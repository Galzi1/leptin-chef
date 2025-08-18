# Leptin Chef Design System

This design system provides a comprehensive set of Material Design components and utilities for the Leptin Chef application, ensuring consistent visual styling across both web and Android platforms.

## Color Palette

The design system is built around the primary color `#00E676` (Material Design Green A400) with a complete Material Design color system:

### Primary Colors
- `primary-50` to `primary-900`: Full range of green shades
- `primary-A100` to `primary-A700`: Accent colors
- `primary-A400`: Main brand color (#00E676)

### Surface Colors
- `surface-0` to `surface-11`: Material Design surface colors for backgrounds
- `on-surface-0` to `on-surface-11`: Text colors for different surface levels

## Components

### MaterialButton
A versatile button component with multiple variants and sizes.

```tsx
import { MaterialButton } from '@/components/design-system'

// Primary button (default)
<MaterialButton>Click me</MaterialButton>

// Outlined variant
<MaterialButton variant="outlined">Outlined Button</MaterialButton>

// Text variant
<MaterialButton variant="text">Text Button</MaterialButton>

// Different sizes
<MaterialButton size="small">Small</MaterialButton>
<MaterialButton size="medium">Medium</MaterialButton>
<MaterialButton size="large">Large</MaterialButton>

// Disabled state
<MaterialButton disabled>Disabled</MaterialButton>
```

**Props:**
- `variant`: 'primary' | 'outlined' | 'text'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `className`: string
- All standard button HTML attributes

### MaterialCard
A card component with configurable elevation and padding.

```tsx
import { MaterialCard } from '@/components/design-system'

// Basic card
<MaterialCard>
  <p>Card content</p>
</MaterialCard>

// With elevation
<MaterialCard elevation="high">
  <p>Elevated content</p>
</MaterialCard>

// Custom padding
<MaterialCard padding="large">
  <p>Content with large padding</p>
</MaterialCard>
```

**Props:**
- `elevation`: 'low' | 'medium' | 'high' | 'none'
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `className`: string

### MaterialInput
A form input component with built-in validation and accessibility features.

```tsx
import { MaterialInput } from '@/components/design-system'

// Basic input
<MaterialInput label="Email" placeholder="Enter your email" />

// With validation
<MaterialInput 
  label="Email" 
  error="Invalid email address"
  required 
/>

// With helper text
<MaterialInput 
  label="Password" 
  helperText="Must be at least 8 characters"
  type="password"
/>

// Different sizes
<MaterialInput size="small" label="Small Input" />
<MaterialInput size="large" label="Large Input" />
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: boolean
- `required`: boolean
- All standard input HTML attributes

### MaterialListItem
A list item component with hover states and click handling.

```tsx
import { MaterialListItem } from '@/components/design-system'

// Basic list item
<MaterialListItem>List item content</MaterialListItem>

// Clickable item
<MaterialListItem onClick={() => console.log('clicked')}>
  Clickable item
</MaterialListItem>

// Selected state
<MaterialListItem selected>Selected item</MaterialListItem>

// Dense variant
<MaterialListItem dense>Compact item</MaterialListItem>
```

**Props:**
- `onClick`: () => void
- `disabled`: boolean
- `selected`: boolean
- `dense`: boolean
- `className`: string

### MaterialTopBar
A top navigation bar component with menu button and actions.

```tsx
import { MaterialTopBar } from '@/components/design-system'

// Basic top bar
<MaterialTopBar title="App Title" />

// With menu button
<MaterialTopBar 
  title="App Title" 
  onMenuClick={() => setDrawerOpen(true)}
/>

// With action buttons
<MaterialTopBar 
  title="App Title"
  actions={<button>Action</button>}
/>

// Without menu button
<MaterialTopBar 
  title="App Title" 
  showMenuButton={false}
/>
```

**Props:**
- `title`: string
- `onMenuClick`: () => void
- `actions`: React.ReactNode
- `showMenuButton`: boolean
- `className`: string

### MaterialNavigationDrawer
A slide-out navigation drawer with overlay.

```tsx
import { MaterialNavigationDrawer } from '@/components/design-system'

<MaterialNavigationDrawer 
  open={drawerOpen} 
  onClose={() => setDrawerOpen(false)}
>
  <div>Navigation content</div>
</MaterialNavigationDrawer>

// Different widths
<MaterialNavigationDrawer width="narrow">
  <div>Narrow drawer</div>
</MaterialNavigationDrawer>

<MaterialNavigationDrawer width="wide">
  <div>Wide drawer</div>
</MaterialNavigationDrawer>
```

**Props:**
- `open`: boolean
- `onClose`: () => void
- `width`: 'narrow' | 'medium' | 'wide'
- `className`: string

## Typography Utilities

The design system includes comprehensive typography utilities following Material Design guidelines:

```tsx
// Display text
<h1 className="text-display-large">Large Display</h1>
<h2 className="text-display-medium">Medium Display</h2>
<h3 className="text-display-small">Small Display</h3>

// Headlines
<h1 className="text-headline-large">Large Headline</h1>
<h2 className="text-headline-medium">Medium Headline</h2>
<h3 className="text-headline-small">Small Headline</h3>

// Titles
<h4 className="text-title-large">Large Title</h4>
<h5 className="text-title-medium">Medium Title</h5>
<h6 className="text-title-small">Small Title</h6>

// Body text
<p className="text-body-large">Large body text</p>
<p className="text-body-medium">Medium body text</p>
<p className="text-body-small">Small body text</p>

// Labels
<span className="text-label-large">Large label</span>
<span className="text-label-medium">Medium label</span>
<span className="text-label-small">Small label</span>
```

## Spacing Utilities

Material Design spacing system utilities:

```tsx
// Vertical spacing
<div className="space-material-xs">Extra small spacing</div>
<div className="space-material-sm">Small spacing</div>
<div className="space-material-md">Medium spacing</div>
<div className="space-material-lg">Large spacing</div>
<div className="space-material-xl">Extra large spacing</div>
```

## Elevation Utilities

Material Design elevation system:

```tsx
// Elevation levels
<div className="elevation-0">No elevation</div>
<div className="elevation-1">Level 1 elevation</div>
<div className="elevation-2">Level 2 elevation</div>
<div className="elevation-3">Level 3 elevation</div>
<div className="elevation-4">Level 4 elevation</div>
<div className="elevation-5">Level 5 elevation</div>
```

## State Utilities

Common state styling utilities:

```tsx
// Interactive states
<button className="state-hover state-focus state-active">
  Interactive button
</button>

// Disabled state
<button className="state-disabled">Disabled button</button>
```

## Animation Utilities

Material Design animation utilities:

```tsx
// Enter animations
<div className="animate-material-enter">Fade in</div>
<div className="animate-material-slide-up">Slide up</div>
<div className="animate-material-slide-down">Slide down</div>
```

## Responsive Utilities

Cross-platform responsive utilities:

```tsx
// Platform-specific visibility
<div className="mobile-only">Mobile only content</div>
<div className="tablet-only">Tablet only content</div>
<div className="desktop-only">Desktop only content</div>

// Responsive ranges
<div className="mobile-tablet">Mobile and tablet content</div>
<div className="tablet-desktop">Tablet and desktop content</div>
```

## Usage Guidelines

### Best Practices

1. **Consistency**: Always use design system components instead of custom styling
2. **Accessibility**: All components include proper ARIA attributes and keyboard navigation
3. **Responsive Design**: Use responsive utilities for cross-platform compatibility
4. **Performance**: Components are optimized for both web and mobile performance

### Component Composition

```tsx
// Example: Creating a form with design system components
<MaterialCard elevation="medium" padding="large">
  <div className="space-material-md">
    <h2 className="text-headline-medium">Contact Form</h2>
    
    <MaterialInput 
      label="Name" 
      placeholder="Enter your name"
      required
    />
    
    <MaterialInput 
      label="Email" 
      type="email"
      placeholder="Enter your email"
      required
    />
    
    <MaterialButton size="large">
      Submit
    </MaterialButton>
  </div>
</MaterialCard>
```

### Testing

All design system components include comprehensive tests covering:
- Component rendering
- Props handling
- User interactions
- Accessibility features
- Responsive behavior

Run tests with:
```bash
npm test
```

## Customization

The design system is built on Tailwind CSS and can be customized by modifying:
- `tailwind.config.js`: Color palette, spacing, typography
- `src/index.css`: Component styles and utilities
- Individual component files: Component-specific styling

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Android WebView
- React Native Web (for mobile apps)
