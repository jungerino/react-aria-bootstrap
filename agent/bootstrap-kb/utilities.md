---
what: Bootstrap 5.3.8 utility class reference
contains: All 22 utility groups (Display, Flexbox, Spacing, Sizing, Typography, Color/Background, Border, Shadow, Opacity, Overflow, Position, Visibility, Float, Vertical Align, Object Fit, User Select, Pointer Events, Visually Hidden, Stack Helpers, Z-Index, Focus Ring, Icon Link). For each: available values, class names generated, whether responsive variants exist, single vs. multi-property.
when-to-load: When building the "Bootstrap utilities" column of the mapping table, or when deciding how to handle layout/spacing/display for a React Aria component.
related: tokens.md for CSS custom properties; components.md for component-specific classes vs. utility classes
---

# Bootstrap 5.3.8 Utility Class Reference

Utilities are defined in `_utilities.scss` and generated via `utilities/_api.scss`. Responsive variants use the breakpoint infix pattern: `{class}-{breakpoint}-{value}` (e.g. `.d-md-flex`). Breakpoints: `xs` (no infix), `sm`, `md`, `lg`, `xl`, `xxl`.

---

## 1. Display

**Responsive:** yes | **Single property:** `display`

| Class | Value |
|---|---|
| `.d-inline` | `display: inline` |
| `.d-inline-block` | `display: inline-block` |
| `.d-block` | `display: block` |
| `.d-grid` | `display: grid` |
| `.d-inline-grid` | `display: inline-grid` |
| `.d-table` | `display: table` |
| `.d-table-row` | `display: table-row` |
| `.d-table-cell` | `display: table-cell` |
| `.d-flex` | `display: flex` |
| `.d-inline-flex` | `display: inline-flex` |
| `.d-none` | `display: none` |

**Print variants:** `.d-print-*` (same values)

---

## 2. Flexbox

**Responsive:** yes for all | **Single property:** varies

### Flex direction
| Class | Value |
|---|---|
| `.flex-row` | `flex-direction: row` |
| `.flex-column` | `flex-direction: column` |
| `.flex-row-reverse` | `flex-direction: row-reverse` |
| `.flex-column-reverse` | `flex-direction: column-reverse` |

### Flex behavior
| Class | Value |
|---|---|
| `.flex-fill` | `flex: 1 1 auto` |
| `.flex-grow-0` | `flex-grow: 0` |
| `.flex-grow-1` | `flex-grow: 1` |
| `.flex-shrink-0` | `flex-shrink: 0` |
| `.flex-shrink-1` | `flex-shrink: 1` |
| `.flex-wrap` | `flex-wrap: wrap` |
| `.flex-nowrap` | `flex-wrap: nowrap` |
| `.flex-wrap-reverse` | `flex-wrap: wrap-reverse` |

### Justify content
`.justify-content-{start|end|center|between|around|evenly}`

### Align items
`.align-items-{start|end|center|baseline|stretch}`

### Align content
`.align-content-{start|end|center|between|around|stretch}`

### Align self
`.align-self-{auto|start|end|center|baseline|stretch}`

### Order
`.order-{first|-1|0|1|2|3|4|5|last}`
> `first` = `order: -1`, `last` = `order: 6`

### Gap
**Responsive:** yes

`.gap-{0|1|2|3|4|5}` — sets `gap` (both row and column)
`.row-gap-{0–5}` — sets `row-gap`
`.column-gap-{0–5}` — sets `column-gap`

Responsive pattern: `.gap-{sm|md|lg|xl|xxl}-{0–5}`, `.row-gap-{bp}-{0–5}`, `.column-gap-{bp}-{0–5}`

Spacer scale: 0=`0`, 1=`0.25rem`, 2=`0.5rem`, 3=`1rem`, 4=`1.5rem`, 5=`3rem`

---

## 3. Spacing

**Responsive:** yes | **Properties:** margin and padding (single or multi)

### Spacer scale
| Index | Value |
|---|---|
| `0` | `0` |
| `1` | `0.25rem` |
| `2` | `0.5rem` |
| `3` | `1rem` |
| `4` | `1.5rem` |
| `5` | `3rem` |
| `auto` | `auto` (margins only) |

### Margin — `m{direction}-{value}`

| Class prefix | Properties |
|---|---|
| `.m-*` | All 4 margins |
| `.mx-*` | `margin-right` + `margin-left` |
| `.my-*` | `margin-top` + `margin-bottom` |
| `.mt-*` | `margin-top` |
| `.me-*` | `margin-right` (end) |
| `.mb-*` | `margin-bottom` |
| `.ms-*` | `margin-left` (start) |

Negative margins (`.m-n{1–5}`, etc.) available when `$enable-negative-margins: true` (off by default).

### Padding — `p{direction}-{value}`

| Class prefix | Properties |
|---|---|
| `.p-*` | All 4 paddings |
| `.px-*` | `padding-right` + `padding-left` |
| `.py-*` | `padding-top` + `padding-bottom` |
| `.pt-*` | `padding-top` |
| `.pe-*` | `padding-right` (end) |
| `.pb-*` | `padding-bottom` |
| `.ps-*` | `padding-left` (start) |

> Note: `.pe-*` for pointer-events uses the same class prefix — see Section 16.

---

## 4. Sizing

**Responsive:** no | **Properties:** single

### Width
| Class | Value |
|---|---|
| `.w-25` | `width: 25%` |
| `.w-50` | `width: 50%` |
| `.w-75` | `width: 75%` |
| `.w-100` | `width: 100%` |
| `.w-auto` | `width: auto` |
| `.mw-100` | `max-width: 100%` |
| `.vw-100` | `width: 100vw` |
| `.min-vw-100` | `min-width: 100vw` |

### Height
| Class | Value |
|---|---|
| `.h-25` | `height: 25%` |
| `.h-50` | `height: 50%` |
| `.h-75` | `height: 75%` |
| `.h-100` | `height: 100%` |
| `.h-auto` | `height: auto` |
| `.mh-100` | `max-height: 100%` |
| `.vh-100` | `height: 100vh` |
| `.min-vh-100` | `min-height: 100vh` |

---

## 5. Typography

**Responsive:** varies (alignment is responsive; others are not)

### Font family
| Class | Value |
|---|---|
| `.font-monospace` | `font-family: var(--bs-font-monospace)` |

### Font size (`.fs-*`)
**RFS-scaled** | **Responsive:** via RFS

| Class | Value |
|---|---|
| `.fs-1` | h1 size = `2.5rem` |
| `.fs-2` | h2 size = `2rem` |
| `.fs-3` | h3 size = `1.75rem` |
| `.fs-4` | h4 size = `1.5rem` |
| `.fs-5` | h5 size = `1.25rem` |
| `.fs-6` | h6 size = `1rem` |

### Font weight (`.fw-*`)
| Class | Value |
|---|---|
| `.fw-lighter` | `lighter` |
| `.fw-light` | `300` |
| `.fw-normal` | `400` |
| `.fw-medium` | `500` |
| `.fw-semibold` | `600` |
| `.fw-bold` | `700` |
| `.fw-bolder` | `bolder` |

### Font style (`.fst-*`)
| Class | Value |
|---|---|
| `.fst-italic` | `font-style: italic` |
| `.fst-normal` | `font-style: normal` |

### Line height (`.lh-*`)
| Class | Value |
|---|---|
| `.lh-1` | `line-height: 1` |
| `.lh-sm` | `line-height: 1.25` |
| `.lh-base` | `line-height: 1.5` |
| `.lh-lg` | `line-height: 2` |

### Text alignment
**Responsive:** yes

`.text-{start|end|center}` (maps to left/right/center)

### Text decoration
`.text-decoration-{none|underline|line-through}`

### Text transform
`.text-{lowercase|uppercase|capitalize}`

### White space
| Class | Value |
|---|---|
| `.text-wrap` | `white-space: normal` |
| `.text-nowrap` | `white-space: nowrap` |
| `.text-break` | `word-wrap: break-word; word-break: break-word` — **multi-property** |

### Miscellaneous text utilities
| Class | Effect |
|---|---|
| `.text-truncate` | Truncates overflowing text with ellipsis; requires `overflow: hidden` (sets `overflow`, `text-overflow`, `white-space`) |
| `.text-reset` | Resets color to inherit from parent (`color: inherit`) |
| `.text-black-50` | Black at 50% opacity (`color: rgba(0,0,0,.5)`) |
| `.text-white-50` | White at 50% opacity (`color: rgba(255,255,255,.5)`) |

---

## 6. Color / Background

### Text color (`.text-*`)
Uses `$utilities-text-colors` (all theme colors + named colors). With `.text-opacity-{25|50|75|100}` for alpha.

| Class | Use |
|---|---|
| `.text-primary` through `.text-dark` | Theme colors |
| `.text-body` | Body color |
| `.text-body-secondary` | Muted text |
| `.text-body-tertiary` | More muted text |
| `.text-body-emphasis` | Highest contrast text |
| `.text-muted` | Deprecated alias for secondary |
| `.text-black` / `.text-white` | Pure black/white |
| `.text-{primary|…}-emphasis` | Contextual emphasis text |

### Background color (`.bg-*`)
Uses `$utilities-bg-colors`. With `.bg-opacity-{10|25|50|75|100}` for alpha.

| Class | Use |
|---|---|
| `.bg-primary` through `.bg-dark` | Theme colors |
| `.bg-body` | Body background |
| `.bg-body-secondary` | Secondary surface |
| `.bg-body-tertiary` | Tertiary surface |
| `.bg-transparent` | Transparent |
| `.bg-{primary|…}-subtle` | Subtle theme backgrounds |
| `.bg-gradient` | Adds the Bootstrap gradient overlay (`background-image`) |

### Background + text combos
`.text-bg-{primary|secondary|…}` — sets both background and contrasting text color.

### Link utilities
| Class | Use |
|---|---|
| `.link-opacity-{10|25|50|75|100}` | Link text opacity (`:hover` variant available) |
| `.link-offset-{1|2|3}` | Underline offset |
| `.link-underline` | Sets underline color to current link color |
| `.link-underline-{color}` | Sets underline to specific color |
| `.link-underline-opacity-{0|10|25|50|75|100}` | Underline opacity |

---

## 7. Border

**Responsive:** no | **Properties:** varies

### Add / remove border
| Class | Effect |
|---|---|
| `.border` | Add all-sides border |
| `.border-0` | Remove all-sides border |
| `.border-top` / `.border-top-0` | Top border |
| `.border-end` / `.border-end-0` | Right border |
| `.border-bottom` / `.border-bottom-0` | Bottom border |
| `.border-start` / `.border-start-0` | Left border |

### Border color
`.border-{primary|secondary|success|info|warning|danger|light|dark|white|black}` — sets border color.
`.border-{theme}-subtle` — subtle color variants.

### Border width
`.border-{1|2|3|4|5}` — `border-width: Npx`

### Border opacity
`.border-opacity-{10|25|50|75|100}` — CSS custom property `--bs-border-opacity`

### Border radius
| Class | Value |
|---|---|
| `.rounded` | `border-radius: var(--bs-border-radius)` |
| `.rounded-0` | No radius |
| `.rounded-1` | `var(--bs-border-radius-sm)` |
| `.rounded-2` | `var(--bs-border-radius)` |
| `.rounded-3` | `var(--bs-border-radius-lg)` |
| `.rounded-4` | `var(--bs-border-radius-xl)` |
| `.rounded-5` | `var(--bs-border-radius-xxl)` |
| `.rounded-circle` | `50%` |
| `.rounded-pill` | `var(--bs-border-radius-pill)` |
| `.rounded-top-*` | Top corners only |
| `.rounded-end-*` | Right corners only |
| `.rounded-bottom-*` | Bottom corners only |
| `.rounded-start-*` | Left corners only |

---

## 8. Shadow

**Responsive:** no | **Single property:** `box-shadow`

| Class | Value |
|---|---|
| `.shadow` | `var(--bs-box-shadow)` |
| `.shadow-sm` | `var(--bs-box-shadow-sm)` |
| `.shadow-lg` | `var(--bs-box-shadow-lg)` |
| `.shadow-none` | `none` |

---

## 9. Opacity

**Responsive:** no | **Single property:** `opacity`

`.opacity-{0|25|50|75|100}` → values `0, .25, .5, .75, 1`

---

## 10. Overflow

**Responsive:** no | **Single property:** varies

`.overflow-{auto|hidden|visible|scroll}` — all four sides
`.overflow-x-{auto|hidden|visible|scroll}` — x-axis only
`.overflow-y-{auto|hidden|visible|scroll}` — y-axis only

---

## 11. Position

**Responsive:** no | **Single property:** varies

### Position type
`.position-{static|relative|absolute|fixed|sticky}`

### Edge offsets
`.top-{0|50|100}` — `top: 0 / 50% / 100%`
`.bottom-{0|50|100}` — `bottom: ...`
`.start-{0|50|100}` — `left: ...`
`.end-{0|50|100}` — `right: ...`

### Translate helper
| Class | Value |
|---|---|
| `.translate-middle` | `transform: translate(-50%, -50%)` |
| `.translate-middle-x` | `transform: translateX(-50%)` |
| `.translate-middle-y` | `transform: translateY(-50%)` |

---

## 12. Visibility

**Responsive:** no | **Single property:** `visibility`

| Class | Value |
|---|---|
| `.visible` | `visibility: visible` |
| `.invisible` | `visibility: hidden` |

Note: `.invisible` hides visually but preserves layout space (unlike `.d-none`).

---

## 13. Float

**Responsive:** yes | **Single property:** `float`

`.float-{start|end|none}` → `float: left / right / none`
`.float-{sm|md|lg|xl|xxl}-{start|end|none}` — responsive variants

---

## 14. Vertical Align

**Responsive:** no | **Single property:** `vertical-align`

`.align-{baseline|top|middle|bottom|text-bottom|text-top}`

---

## 15. Object Fit

**Responsive:** yes | **Single property:** `object-fit`

`.object-fit-{contain|cover|fill|scale|none}` — `scale` maps to `scale-down`

---

## 16. User Select

**Responsive:** no | **Single property:** `user-select`

`.user-select-{all|auto|none}`

---

## 17. Pointer Events

**Responsive:** no | **Single property:** `pointer-events`

| Class | Value |
|---|---|
| `.pe-none` | `pointer-events: none` |
| `.pe-auto` | `pointer-events: auto` |

> ⚠️ Same `.pe-*` prefix as padding-end. Context determines meaning.

---

## 18. Screen Reader / Visually Hidden

**Helper classes** (defined in `_helpers.scss`, not `_utilities.scss`) | **Multi-property**

| Class | Effect |
|---|---|
| `.visually-hidden` | Hides from visual display but accessible to screen readers; uses clip/overflow technique |
| `.visually-hidden-focusable` | Same as above but visible on keyboard focus (skip-link pattern) |

---

## 19. Stack Helpers

**Helper classes** (defined in `_helpers.scss`) | **Multi-property** | **Responsive:** no

| Class | Effect |
|---|---|
| `.hstack` | `display: flex; flex-direction: row; align-items: center; align-self: stretch` |
| `.vstack` | `display: flex; flex-direction: column; align-items: stretch; align-self: stretch; flex: 1 1 auto` |

Used for quick horizontal (`.hstack`) or vertical (`.vstack`) stacking with flexbox.

---

## 20. Z-Index

**Responsive:** no | **Single property:** `z-index`

`.z-{n1|0|1|2|3}` → values: `-1, 0, 1, 2, 3`

---

## 21. Focus Ring

**CSS-variable utility** (Bootstrap 5.3+)

### Base class
| Class | Effect |
|---|---|
| `.focus-ring` | On `:focus`, removes default `outline` and applies `box-shadow` using `--bs-focus-ring-*` tokens. Variables: `--bs-focus-ring-x`, `--bs-focus-ring-y`, `--bs-focus-ring-blur`, `--bs-focus-ring-width`, `--bs-focus-ring-color`. |

### Color variants
`.focus-ring-{primary|secondary|success|info|warning|danger|light|dark}` — overrides `--bs-focus-ring-color` for the element.

> Use `.focus-ring` on interactive elements to apply the Bootstrap focus ring style. Combine with `.focus-ring-{theme}` to change the ring color.

---

## 22. Icon Link

**Helper class** (defined in `_helpers.scss`) | **Multi-property** | **Responsive:** no

| Class | Effect |
|---|---|
| `.icon-link` | `display: inline-flex; gap: 0.375rem; align-items: center` — for pairing text with inline icons |
| `.icon-link-hover` | Adds hover/focus animation to child `.bi` icons (transitions `transform`) |

> Targets child Bootstrap Icons (`.bi`). Not needed for icon-only buttons (use `.visually-hidden` for accessibility there).

---

## Utility Notes for Mapping Work

- **Spacing scale**: values 0–5 map to `0, .25rem, .5rem, 1rem, 1.5rem, 3rem`. Used heavily on wrappers and form groups.
- **`.mb-3`** is the standard spacing below form fields (`margin-bottom: 1rem`).
- **`.d-flex` + `.gap-*`** is the idiomatic Bootstrap inline-flex row pattern (replaces older float grids).
- **`.visually-hidden`** is the correct Bootstrap replacement for `aria-hidden` + off-screen text on icon-only buttons.
- **`.text-{theme}-emphasis`** classes set text via `--bs-{theme}-text-emphasis` tokens and work with the theme emphasis token system.
