#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cursor → Claude Code converter

Scans .cursor/rules/**/*.mdc and emits:
- .claude/rules/<slug>.md           (materialized rule bodies)
- CLAUDE.md                         (root memory with @imports and conditional notes)
- <dir>/CLAUDE.md                   (directory memories for Auto-Attached rules hitting that subtree)
- .claude/agents/<slug>.md          (for Agent-Requested/Manual rules as subagents)
- .claude/commands/<slug>.md        (optional: custom slash commands)

Design notes:
- Claude memory loading + @imports: https://docs.anthropic.com/en/docs/claude-code/memory
- Subagents:                          https://docs.anthropic.com/en/docs/claude-code/sub-agents
- Slash commands:                     https://docs.anthropic.com/en/docs/claude-code/slash-commands
- Settings & permissions:             https://docs.anthropic.com/en/docs/claude-code/settings
- Cursor rule anatomy:                https://docs.cursor.com/en/context/rules
"""

from __future__ import annotations
import argparse
import os
import re
import sys
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ---------- helpers ----------

FRONTMATTER_RE = re.compile(
    r'(?s)^\s*---\s*\n(.*?)\n---\s*\n(.*)$'
)

def load_mdc(path: Path) -> Tuple[Dict, str]:
    """
    Very small frontmatter parser that supports:
      description: <str>
      globs: <null|list|string>
      alwaysApply: <bool>
    We avoid external deps; tolerant of simple YAML subset.
    """
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    meta: Dict = {}
    body = text

    if m:
        raw_meta, body = m.group(1), m.group(2)
        meta = _parse_frontmatter_min(raw_meta)

    # Normalize fields
    meta.setdefault("description", None)
    globs = meta.get("globs")
    if isinstance(globs, str):
        # allow single string
        globs = [globs]
    elif globs is None:
        globs = []
    elif not isinstance(globs, list):
        globs = []
    meta["globs"] = [g.strip() for g in globs if isinstance(g, str) and g.strip()]
    meta["alwaysApply"] = bool(meta.get("alwaysApply", False))

    return meta, body.strip("\n")

def _parse_frontmatter_min(raw: str) -> Dict:
    """
    Minimal YAML-ish parser for simple key: value, lists as:
      globs:
        - "path/**"
        - "other/**"
    """
    meta: Dict = {}
    lines = raw.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.strip().startswith("#"):
            i += 1
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            if val == "" or val is None:
                # Possibly a block (e.g., lists)
                # Look ahead for indented items
                i += 1
                items = []
                while i < len(lines):
                    l2 = lines[i]
                    if re.match(r'^\s*-\s+', l2):
                        items.append(re.sub(r'^\s*-\s+', '', l2).strip().strip('"\''))
                        i += 1
                    elif l2.strip() == "":
                        i += 1
                    else:
                        break
                if items:
                    meta[key] = items
                    continue
                else:
                    meta[key] = None
                    continue
            # scalar line
            meta[key] = _coerce_scalar(val)
            i += 1
        else:
            i += 1
    return meta

def _coerce_scalar(s: str):
    s = s.strip().strip('"\'')
    if s.lower() in ("true", "false"):
        return s.lower() == "true"
    if s.lower() in ("null", "none"):
        return None
    return s

def slugify(name: str) -> str:
    base = re.sub(r'\.[^.]+$', '', name)  # drop extension
    base = base.strip().lower().replace(' ', '-')
    base = re.sub(r'[^a-z0-9._/-]+', '-', base)
    base = base.replace('/', '-')
    base = re.sub(r'-{2,}', '-', base).strip('-')
    return base or "rule"

def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)

def read_file(p: Path) -> str:
    if p.exists():
        return p.read_text(encoding="utf-8")
    return ""

def write_file(p: Path, content: str, dry_run: bool):
    ensure_dir(p.parent)
    if dry_run:
        return
    p.write_text(content, encoding="utf-8")

def append_unique_import(md: str, import_line: str, section_name: str) -> str:
    """
    Maintain an import section with BEGIN/END markers and dedupe lines.
    """
    begin = f"<!-- BEGIN: {section_name} -->"
    end   = f"<!-- END: {section_name} -->"

    if begin not in md:
        block = f"{begin}\n{import_line}\n{end}\n"
        return md.rstrip() + ("\n\n" if md.strip() else "") + block

    # update existing block
    pre, rest = md.split(begin, 1)
    block, post = rest.split(end, 1)
    # existing lines
    lines = [ln.strip() for ln in block.strip().splitlines() if ln.strip()]
    if import_line.strip() not in lines:
        lines.append(import_line.strip())
    new_block = begin + "\n" + "\n".join(sorted(set(lines))) + "\n" + end
    return pre + new_block + post

def base_dir_from_glob(glob_pattern: str) -> Optional[str]:
    """
    Return leading directory segment before any wildcard.
    Example:
      "backend/**/*.py"  -> "backend"
      "src/services/**"  -> "src/services"
      "**/*.sql"         -> None  (no stable base)
      "*.md"             -> None
    """
    # Stop at first wildcard token
    wildcard_idx = min([i for i in [
        glob_pattern.find('*'),
        glob_pattern.find('?'),
        glob_pattern.find('[')
    ] if i != -1] or [len(glob_pattern)])

    prefix = glob_pattern[:wildcard_idx]
    prefix = prefix.rstrip('/')
    if not prefix:
        return None
    # ensure prefix is a pure path (no trailing file)
    # if the prefix has an extension, treat as None
    if os.path.splitext(os.path.basename(prefix))[1]:
        # looks like a file name, not a dir
        return os.path.dirname(prefix) or None
    return prefix

def insert_clause_once(md: str, anchor: str, content: str) -> str:
    if anchor in md:
        return md
    return md.rstrip() + ("\n\n" if md.strip() else "") + content.strip() + "\n"

# ---------- core converter ----------

class Converter:
    def __init__(self, project_root: Path, prefer_commands: bool, both: bool, dry_run: bool, verbose: bool):
        self.root = project_root.resolve()
        self.prefer_commands = prefer_commands
        self.both = both
        self.dry_run = dry_run
        self.verbose = verbose
        self.summary = {
            "always": 0,
            "auto_dir": 0,
            "auto_root": 0,
            "agents": 0,
            "commands": 0,
            "processed": 0,
            "skipped": 0,
        }

    # paths
    @property
    def claude_rules_dir(self) -> Path:
        return self.root / ".claude" / "rules"

    @property
    def claude_agents_dir(self) -> Path:
        return self.root / ".claude" / "agents"

    @property
    def claude_commands_dir(self) -> Path:
        return self.root / ".claude" / "commands"

    @property
    def root_memory(self) -> Path:
        return self.root / "CLAUDE.md"

    def run(self):
        mdc_files = list((self.root / ".cursor" / "rules").rglob("*.mdc"))
        if self.verbose:
            print(f"Found {len(mdc_files)} Cursor rule(s) under {self.root / '.cursor' / 'rules'}")
        for mdc in sorted(mdc_files):
            try:
                self._process_rule(mdc)
                self.summary["processed"] += 1
            except Exception as e:
                self.summary["skipped"] += 1
                print(f"[warn] Skipped {mdc}: {e}", file=sys.stderr)

        # Final note in root CLAUDE.md about imports section
        md = read_file(self.root_memory)
        note = insert_clause_once(
            md,
            anchor="<!-- NOTE: cursor-to-claude notice -->",
            content="> _This project’s CLAUDE.md contains imports created by `cursor_to_claude.py`. "
                    "Feel free to re-organize or inline them as your team prefers._\n"
                    "<!-- NOTE: cursor-to-claude notice -->"
        )
        if note != md:
            write_file(self.root_memory, note, self.dry_run)

        # Print summary
        print(json.dumps(self.summary, indent=2))

    def _process_rule(self, mdc_path: Path):
        meta, body = load_mdc(mdc_path)
        rule_name = slugify(mdc_path.relative_to(self.root / ".cursor" / "rules").as_posix())
        title = mdc_path.name
        if self.verbose:
            print(f"Converting: {mdc_path} -> {rule_name}")

        # Materialize the rule body once under .claude/rules/
        rule_file = self.claude_rules_dir / f"{rule_name}.md"
        write_file(rule_file, self._build_rule_md(title, body), self.dry_run)

        # Decide mapping
        if meta["alwaysApply"]:
            self._attach_always(rule_file, title)
            self.summary["always"] += 1
            return

        globs = meta["globs"]
        if globs:
            # Try to anchor to base directories per glob
            anchored = False
            for g in globs:
                base = base_dir_from_glob(g)
                if base:
                    anchored = True
                    self._attach_to_directory(Path(base), rule_file, title, g)
                    self.summary["auto_dir"] += 1
            if not anchored:
                # Fallback: add to root memory as conditional guidance
                self._attach_conditional_to_root(rule_file, title, globs)
                self.summary["auto_root"] += 1
            return

        # Neither always nor globs → Agent Requested / Manual style
        made_agent = False
        made_cmd = False

        if self.prefer_commands or self.both:
            self._create_command(rule_name, meta.get("description") or f"Command for {title}", body)
            made_cmd = True
            self.summary["commands"] += 1

        if (not self.prefer_commands) or self.both:
            self._create_agent(rule_name, meta.get("description") or f"Specialist for {title}", body)
            made_agent = True
            self.summary["agents"] += 1

        if self.verbose:
            print(f"  → created subagent={made_agent}, command={made_cmd}")

    def _build_rule_md(self, title: str, body: str) -> str:
        return f"""<!-- Generated from Cursor rule: {title} -->
# {title}

{body}
"""

    def _attach_always(self, rule_file: Path, title: str):
        # Add an @import in root CLAUDE.md
        md = read_file(self.root_memory)
        import_line = f"@{rule_file.relative_to(self.root).as_posix()}"
        md2 = append_unique_import(md, import_line, section_name="cursor-to-claude imports")
        if md2 != md and self.verbose:
            print(f"  + Importing ALWAYS rule into CLAUDE.md: {import_line}")
        write_file(self.root_memory, md2, self.dry_run)

    def _attach_to_directory(self, base_dir: Path, rule_file: Path, title: str, glob_src: str):
        target_dir = (self.root / base_dir).resolve()
        if not str(target_dir).startswith(str(self.root)):
            raise ValueError(f"Glob base escaped project root: {glob_src}")

        memory_path = target_dir / "CLAUDE.md"
        md = read_file(memory_path)
        header = f"<!-- Directory rule anchor: {rule_file.name} -->"
        if header not in md:
            # Add a small header once
            md = insert_clause_once(
                md, anchor=header,
                content=f"<!-- Directory rule anchor: {rule_file.name} -->\n"
                        f"_Guidance imported for files under `{base_dir.as_posix()}` matching original Cursor glob `{glob_src}`._"
            )
        import_line = f"@{rule_file.relative_to(self.root).as_posix()}"
        md2 = append_unique_import(md, import_line, section_name="cursor-to-claude imports")
        if self.verbose and md2 != md:
            print(f"  + Importing AUTO-ATTACHED rule into {memory_path.relative_to(self.root)}: {import_line}")
        write_file(memory_path, md2, self.dry_run)

    def _attach_conditional_to_root(self, rule_file: Path, title: str, globs: List[str]):
        md = read_file(self.root_memory)
        block_anchor = f"<!-- CONDITIONAL import: {rule_file.name} -->"
        conditional_block = f"""
{block_anchor}
> Applies when working with files matching: `{", ".join(globs)}`

@{rule_file.relative_to(self.root).as_posix()}
""".strip("\n")
        md2 = insert_clause_once(md, block_anchor, conditional_block)
        if self.verbose and md2 != md:
            print(f"  + Root conditional for non-directory globs: {globs}")
        write_file(self.root_memory, md2, self.dry_run)

    def _create_agent(self, slug: str, description: str, body: str):
        agent_md = f"""---
name: {slug}
description: {description}
---

{body}
"""
        write_file(self.claude_agents_dir / f"{slug}.md", agent_md, self.dry_run)

    def _create_command(self, slug: str, description: str, body: str):
        cmd_md = f"""---
description: {description}
---

{body}
"""
        write_file(self.claude_commands_dir / f"{slug}.md", cmd_md, self.dry_run)

# ---------- CLI ----------

def main():
    ap = argparse.ArgumentParser(description="Convert Cursor .mdc rules to Claude Code configuration.")
    ap.add_argument("--project-root", type=str, default=".", help="Project root (contains .cursor/)")
    ap.add_argument("--prefer-commands", action="store_true",
                    help="Map non-glob, non-always rules to custom slash commands instead of subagents.")
    ap.add_argument("--both", action="store_true",
                    help="Create BOTH a subagent and a slash command for non-glob, non-always rules.")
    ap.add_argument("--dry-run", action="store_true", help="Preview changes without writing files.")
    ap.add_argument("--verbose", action="store_true", help="Verbose logging.")
    args = ap.parse_args()

    root = Path(args.project_root).resolve()
    if not (root / ".cursor" / "rules").exists():
        print(f"[error] No .cursor/rules directory under {root}", file=sys.stderr)
        sys.exit(2)

    conv = Converter(
        project_root=root,
        prefer_commands=bool(args.prefer_commands),
        both=bool(args.both),
        dry_run=bool(args.dry_run),
        verbose=bool(args.verbose),
    )
    conv.run()

if __name__ == "__main__":
    main()
