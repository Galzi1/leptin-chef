<!-- BEGIN: cursor-to-claude imports -->
@.claude/rules/clean-code.md
@.claude/rules/codequality.md
<!-- END: cursor-to-claude imports -->

<!-- CONDITIONAL import: nextjs.md -->
> Applies when working with files matching: `**/*.tsx, **/*.ts, src/**/*.ts, src/**/*.tsx`

@.claude/rules/nextjs.md

<!-- CONDITIONAL import: node-express.md -->
> Applies when working with files matching: `**/*.js, **/*.ts, src/**/*.ts`

@.claude/rules/node-express.md

<!-- CONDITIONAL import: react.md -->
> Applies when working with files matching: `**/*.tsx, **/*.jsx, components/**/*`

@.claude/rules/react.md

<!-- CONDITIONAL import: tailwind.md -->
> Applies when working with files matching: `**/*.css, **/*.tsx, **/*.jsx, tailwind.config.js, tailwind.config.ts`

@.claude/rules/tailwind.md

<!-- CONDITIONAL import: typescript.md -->
> Applies when working with files matching: `**/*.ts, **/*.tsx, **/*.d.ts`

@.claude/rules/typescript.md

> _This project’s CLAUDE.md contains imports created by `cursor_to_claude.py`. Feel free to re-organize or inline them as your team prefers._
<!-- NOTE: cursor-to-claude notice -->
