# Project Genesis — Design System

> Version 1.0 · Sprint 2 · Production-ready

A scalable, token-driven design system for Project Genesis. Every visual decision traces back to a token. No magic numbers, no inline styles, no duplicated CSS.

---

## Architecture

```
src/
├── design/                  # Design tokens (TypeScript)
│   ├── colors.ts            # Color palette + semantic aliases
│   ├── spacing.ts           # 4px-grid spacing scale
│   ├── radius.ts            # Border radius scale
│   ├── shadows.ts           # Elevation / box-shadow system
│   ├── typography.ts        # Type scale + font tokens
│   ├── animations.ts        # CSS animation class names + timing
│   ├── icons.ts             # Icon registry + IconProps interface
│   ├── zIndex.ts            # Stacking context layers
│   └── index.ts             # Barrel — import from '@/design'
│
└── components/ui/           # Reusable UI primitives
    ├── Button.tsx
    ├── Input.tsx
    ├── Textarea.tsx
    ├── Select.tsx
    ├── Checkbox.tsx
    ├── Switch.tsx
    ├── Badge.tsx
    ├── Avatar.tsx
    ├── Card.tsx
    ├── Modal.tsx
    ├── Dropdown.tsx
    ├── Tooltip.tsx
    ├── Tabs.tsx
    ├── Alert.tsx
    ├── Spinner.tsx
    ├── Skeleton.tsx
    ├── Separator.tsx
    └── index.ts             # Barrel — import from '@/components/ui'
```

**Token pipeline:**

```
colors.ts (source of truth)
    ↓
globals.css @theme inline (CSS variables)
    ↓
Tailwind generates utility classes (bg-accent, text-danger, etc.)
    ↓
Components use Tailwind classes exclusively
```

No inline styles. No hardcoded hex values in components.

---

## Design Tokens

### Colors (`src/design/colors.ts`)

#### Raw Palette

| Scale     | Description                               |
|-----------|-------------------------------------------|
| `neutral` | 14-stop gray scale from white → near-black |
| `violet`  | Primary brand accent (9 stops)            |
| `blue`    | Info / secondary (5 stops)                |
| `green`   | Success (5 stops)                         |
| `yellow`  | Warning (5 stops)                         |
| `red`     | Danger / error (5 stops)                  |

#### Semantic Tokens

| Token              | Value                        | Usage                          |
|--------------------|------------------------------|--------------------------------|
| `background`       | `#07070a`                    | Page background                |
| `surface`          | `#0d0d12`                    | Cards, panels                  |
| `surfaceElevated`  | `#14141a`                    | Inputs, dropdowns, hover states |
| `surfaceOverlay`   | `#1a1a22`                    | Tooltips, overlays             |
| `border`           | `rgba(255,255,255,0.06)`     | Default borders                |
| `borderHover`      | `rgba(255,255,255,0.12)`     | Hovered borders                |
| `borderFocus`      | `rgba(124,58,237,0.6)`       | Focused element borders        |
| `accent`           | `#7c3aed`                    | Primary CTA, highlights        |
| `accentHover`      | `#6d28d9`                    | Accent hover state             |
| `accentMuted`      | `rgba(124,58,237,0.12)`      | Accent backgrounds             |
| `text.primary`     | `#f0f0f2`                    | Headlines, labels              |
| `text.secondary`   | `#71717a`                    | Body text, descriptions        |
| `text.muted`       | `#52525b`                    | Placeholders, captions         |
| `text.disabled`    | `#3f3f46`                    | Disabled state text            |

#### Status Colors

Each status has three tokens: `text`, `bg`, `border`.

| Status    | Text      | Example usage              |
|-----------|-----------|----------------------------|
| `success` | `#4ade80` | Confirmations, saved state |
| `warning` | `#fbbf24` | Warnings, caution          |
| `danger`  | `#f87171` | Errors, destructive actions |
| `info`    | `#60a5fa` | Informational messages     |

---

### Spacing (`src/design/spacing.ts`)

4px base unit. Values from `0` → `64` matching Tailwind's default scale.

Component presets:
- `componentSpacing.input` — per-size padding for inputs
- `componentSpacing.button` — per-size horizontal padding
- `componentSpacing.section` — vertical section padding

---

### Border Radius (`src/design/radius.ts`)

| Token  | Value    | Usage                        |
|--------|----------|------------------------------|
| `none` | `0px`    | Sharp edges                  |
| `sm`   | `4px`    | Small chips                  |
| `md`   | `6px`    | Small buttons                |
| `lg`   | `8px`    | Buttons, inputs              |
| `xl`   | `12px`   | Cards, large buttons         |
| `2xl`  | `16px`   | Panels, modals               |
| `3xl`  | `24px`   | Hero elements                |
| `full` | `9999px` | Pills, avatars, badges       |

---

### Shadows (`src/design/shadows.ts`)

Elevation system optimised for dark backgrounds (uses rgba black).

| Token           | Usage                              |
|-----------------|------------------------------------|
| `sm`            | Subtle lift, focused inputs        |
| `md`            | Default card                       |
| `lg`            | Dropdowns, popovers                |
| `xl`            | Modals                             |
| `2xl`           | Full-screen overlays               |
| `accent`        | Primary button ambient glow        |
| `buttonPrimary` | CTA button glow effect             |
| `success/danger/warning` | Status ring on form elements |

---

### Typography (`src/design/typography.ts`)

#### Type Scale

| Category  | Sizes          | Use case                          |
|-----------|----------------|-----------------------------------|
| `display` | xl/lg/md/sm    | Landing page hero headlines       |
| `heading` | xl→xs          | Section and page headings         |
| `title`   | lg/md/sm       | Card titles, dialog headings      |
| `body`    | lg/md/sm       | Paragraph text                    |
| `caption` | md/sm          | Supporting / meta text            |
| `label`   | lg/md/sm       | Form labels, UI chrome            |
| `mono`    | lg/md/sm       | Code, numbers, data               |

Usage: `import { typeScale } from '@/design/typography'`

---

### Animations (`src/design/animations.ts`)

CSS-only. All keyframes live in `globals.css`. TypeScript exports class name strings for consistency.

| Token       | Class               | Effect                            |
|-------------|---------------------|-----------------------------------|
| `fadeIn`    | `animate-fade-in`   | Opacity 0→1 (150ms)               |
| `slideUp`   | `animate-slide-up`  | Up + fade (150ms, spring)         |
| `slideDown` | `animate-slide-down`| Down + fade (150ms, spring)       |
| `scaleIn`   | `animate-scale-in`  | Scale 0.96→1 + fade (150ms)       |
| `spin`      | `animate-spin`      | Infinite rotation (700ms linear)  |
| `shimmer`   | `animate-shimmer`   | Skeleton shimmer (1.6s infinite)  |
| `revealInit`| `animate-in-element`| Scroll reveal initial state       |
| `revealShow`| `animate-in-visible`| Scroll reveal visible state       |

Timing constants: `duration.fast` (100ms) → `duration.crawl` (700ms).  
Easing: `easing.spring` (`cubic-bezier(0.16, 1, 0.3, 1)`) used for entrance animations.

---

### Z-Index (`src/design/zIndex.ts`)

| Token      | Value | Usage                    |
|------------|-------|--------------------------|
| `below`    | -1    | Background decorations   |
| `base`     | 0     | Normal document flow     |
| `raised`   | 1     | Hover states, badges     |
| `dropdown` | 10    | Menus, dropdowns         |
| `sticky`   | 20    | Sticky headers           |
| `overlay`  | 30    | Drawers, side panels     |
| `modal`    | 40    | Modal dialogs            |
| `toast`    | 50    | Toast notifications      |
| `tooltip`  | 60    | Tooltips                 |
| `maximum`  | 999   | Emergency overrides only |

---

### Icons (`src/design/icons.ts`)

All icons share the `IconProps` interface:

```typescript
interface IconProps {
  size?:        number;   // default: 20
  className?:   string;
  strokeWidth?: number;   // default: 1.5
  'aria-label'?: string; // omit for decorative
}
```

39 icons registered. Decorative icons omit `aria-label`. Meaningful icons always receive one.

---

## Components

### Button

**Variants:** `primary` · `secondary` · `ghost` · `danger` · `outline`  
**Sizes:** `xs` · `sm` · `md` · `lg` · `xl`  
**Props:** `loading`, `leadingIcon`, `trailingIcon`, `href` (renders as `<Link>`)

```tsx
<Button variant="primary" size="lg" href="/dashboard">Get Started</Button>
<Button variant="danger" loading>Deleting…</Button>
<Button variant="secondary" leadingIcon={<PlusIcon />}>New Item</Button>
```

- `loading` shows spinner, disables interaction
- `href` renders as Next.js `<Link>`, otherwise `<button>`
- Full keyboard focus ring via `focus-visible`

---

### Input

**Variants:** `default` · `error` · `success` (auto-derived from `error` prop)  
**Sizes:** `sm` · `md` · `lg`

```tsx
<Input label="Email" type="email" placeholder="you@example.com" required />
<Input label="Password" error="Must be at least 8 characters" type="password" />
<Input leading={<SearchIcon />} placeholder="Search…" />
```

- `useId()` for auto-generated accessible `id` + `aria-describedby`
- `aria-invalid`, `aria-required` set automatically
- Error text has `role="alert"` for screen readers

---

### Textarea

Same API as Input. Additional props: `rows`, `resize`.

---

### Select

Native `<select>` with custom chevron. Accessible, keyboard-navigable by default.

```tsx
<Select label="Plan" placeholder="Choose a plan">
  <option value="starter">Starter</option>
  <option value="pro">Pro</option>
</Select>
```

---

### Checkbox

```tsx
<Checkbox label="Accept terms" description="You agree to our Terms of Service" />
<Checkbox label="Select all" indeterminate />
```

- Uses `peer` CSS for custom visual, real `input[type=checkbox]` underneath
- `indeterminate` state supported
- `forwardRef` compatible with `react-hook-form`

---

### Switch

```tsx
<Switch label="Email notifications" description="Receive weekly digest" />
```

- `role="switch"` for correct screen reader announcement
- Smooth thumb transition via CSS transform

---

### Badge

**Variants:** `default` · `primary` · `success` · `warning` · `danger` · `info` · `outline`  
**Sizes:** `sm` · `md` · `lg`

```tsx
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" size="sm">Beta</Badge>
```

---

### Avatar

**Sizes:** `xs` · `sm` · `md` · `lg` · `xl` · `2xl`  
**Status:** `online` · `offline` · `away` · `busy`

```tsx
<Avatar src="/photo.jpg" alt="Sarah K." size="md" status="online" />
<Avatar initials="SK" size="lg" />
<Avatar icon={<UserIcon />} />
```

- `initials` background color is deterministically derived from the string (consistent across renders)
- Status indicator uses `role="img"` with `aria-label`

---

### Card

**Variants:** `default` · `bordered` · `elevated` · `ghost` · `accent`  
**Padding:** `none` · `sm` · `md` · `lg`

```tsx
<Card variant="elevated">
  <CardHeader>
    <h3>Card Title</h3>
    <Button variant="ghost" size="sm">Action</Button>
  </CardHeader>
  <CardBody>Content here</CardBody>
  <CardFooter>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>
```

---

### Modal

```tsx
const [open, setOpen] = useState(false);

<Modal open={open} onClose={() => setOpen(false)} title="Confirm action" size="md">
  <p>Are you sure?</p>
  <Button onClick={() => setOpen(false)}>Confirm</Button>
</Modal>
```

- Rendered via `createPortal` into `document.body`
- Focus trap: Tab cycles within modal
- Escape key closes (unless `persistent`)
- Body scroll locked while open
- `aria-modal="true"`, `aria-labelledby` wired automatically

---

### Dropdown

Compound component pattern:

```tsx
<Dropdown>
  {() => (
    <>
      <Dropdown.Trigger>
        <Button variant="secondary" size="sm">Actions</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        <Dropdown.Label>File</Dropdown.Label>
        <Dropdown.Item idx={0} leading={<EditIcon />}>Edit</Dropdown.Item>
        <Dropdown.Item idx={1} leading={<CopyIcon />}>Duplicate</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item idx={2} danger leading={<TrashIcon />}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </>
  )}
</Dropdown>
```

- Arrow key navigation (Up/Down)
- Escape closes, focus returns to trigger
- Outside click closes

---

### Tooltip

```tsx
<Tooltip content="Copy to clipboard" side="top">
  <Button variant="ghost" size="sm">Copy</Button>
</Tooltip>
```

- Triggered on hover AND focus (keyboard accessible)
- 300ms delay by default (configurable)
- Portal rendered, avoids overflow clipping

---

### Tabs

**Variants:** `line` · `pills` · `boxed`

```tsx
<Tabs.Root defaultValue="overview" variant="pills">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
    <Tabs.Tab value="settings" disabled>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview" className="pt-6">...</Tabs.Panel>
  <Tabs.Panel value="analytics" className="pt-6">...</Tabs.Panel>
</Tabs.Root>
```

- Arrow keys navigate between tabs
- Home/End jump to first/last
- `aria-selected`, `role="tab"`, `role="tabpanel"` wired correctly
- Skips disabled tabs in keyboard navigation

---

### Alert

```tsx
<Alert variant="success" title="Saved!" onDismiss={() => {}}>
  Your changes have been saved successfully.
</Alert>

<Alert variant="danger">
  Something went wrong. Please try again.
</Alert>
```

- `role="alert"` for screen reader announcement
- Default icons per variant (overridable)
- `onDismiss` shows close button

---

### Spinner

```tsx
<Spinner size="md" color="accent" />
<Spinner size="sm" color="white" label="Saving changes…" />
```

- `role="status"` with `aria-label`
- `animate-spin` CSS class

---

### Skeleton

```tsx
<Skeleton variant="rect" height={200} />
<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="text" lines={3} />
```

- `aria-busy="true"` for screen readers
- Shimmer animation via CSS gradient

---

### Separator

```tsx
<Separator />
<Separator label="or" />
<Separator orientation="vertical" className="h-6" />
```

- `role="separator"` with correct `aria-orientation`
- Labelled variant centres text between two lines

---

## Usage

```typescript
// Import tokens
import { colors, spacing, animation, typeScale } from '@/design';

// Import components
import { Button, Input, Badge, Modal, Tabs } from '@/components/ui';
```

---

## Conventions

| Rule                              | Reason                                      |
|-----------------------------------|---------------------------------------------|
| No inline `style={{}}` in components | All values come from Tailwind/tokens    |
| No hardcoded hex colors            | Change a token, change the whole system     |
| `forwardRef` on all form elements  | Compatibility with `react-hook-form`        |
| `useId()` for form element IDs    | SSR-safe, avoids hydration mismatches       |
| `createPortal` for overlays       | Escapes stacking contexts, no z-index hacks |
| Compound component pattern        | Flexible composition without prop drilling  |
| Server Components by default      | Client only when state/browser APIs needed  |
