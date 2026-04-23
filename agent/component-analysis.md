# Component Analysis: Bootstrap styling approach


> **🚫 DEPRECATED — FOR CLAUDE:** The sections below are no longer authoritative.
> Treat them as an example template for future entries. You may discard them
> once they are no longer needed.

Analysis of the React Aria test components against Bootstrap 5.3.8 SCSS source in `src/scss/vendor/bootstrap-5.3.8/`.

## General Findings

### State attribute mismatch

- **React Aria uses `data-*` attributes; Bootstrap uses class names and pseudo-classes** --- Bootstrap applies active/selected state via `.active`, disabled via `.disabled` or `:disabled`, and show/hide via `.show`. React Aria uses `data-selected`, `data-disabled`, `data-pressed`, `data-hovered`, `data-focus-visible`, etc. Any Bootstrap rule that targets `.active` will need an equivalent selector targeting the React Aria `data-*` attribute (e.g., `[data-selected]`).

- **`:hover` vs `[data-hovered]`** --- Bootstrap uses the CSS `:hover` pseudo-class. React Aria exposes `[data-hovered]` instead. Because `:hover` works natively on rendered elements, Bootstrap's `:hover` styles will apply automatically without changes. The existing `[data-hovered]` selectors in the component CSS are redundant if Bootstrap's `:hover` is used.

- **`:focus-visible` vs `[data-focus-visible]`** --- Bootstrap uses the `:focus-visible` pseudo-class. React Aria uses `[data-focus-visible]`. Bootstrap's `:focus-visible` rules will apply natively. However, if both selectors are present, they may produce conflicting focus ring styles.

- **`:active` vs `[data-pressed]`** --- Bootstrap uses `:active` for pressed state. React Aria uses `[data-pressed]`. The native `:active` pseudo-class fires briefly on mouse down, while `[data-pressed]` persists for the full press gesture (including touch). Both may apply simultaneously, risking doubled effects.

- **`:disabled` vs `[data-disabled]`** --- For native `<button>` elements, Bootstrap's `:disabled` pseudo-class works. For non-native elements (e.g., `<div role="button">`), React Aria applies `[data-disabled]` instead, and Bootstrap's `:disabled` won't match. Selectors targeting `:disabled` may need duplication as `[data-disabled]`.

### Structural patterns

- **Bootstrap's box model vs existing custom properties** --- The existing components use a custom design token system (`--spacing-*`, `--radius`, `--font-size`, etc. from `theme.css`) and utility classes (`button-base`, `indicator`, `inset` from `utilities.css`). Bootstrap uses its own token system (`--bs-*` CSS custom properties, SCSS variables like `$btn-padding-y`). Replacing the existing styling wholesale means swapping the token system.

- **`utilities.css` provides sophisticated visual effects** --- The `button-base`, `indicator`, and `inset` utilities in `utilities.css` produce multi-layered box shadows (specular highlights, inner gradients, borders-as-shadows) that go well beyond Bootstrap's visual treatment. Bootstrap buttons are flat or use simple gradients. Replacing these utilities with Bootstrap classes means losing this visual depth.

- **Bootstrap assumes compiled SCSS output** --- The Bootstrap source uses SCSS variables, mixins, and functions (`@include border-radius()`, `@include box-shadow()`, etc.) that compile to plain CSS. The actual CSS custom properties emitted by Bootstrap start with `--bs-` (the default prefix). References in this document to SCSS variables indicate the compile-time inputs; the CSS custom properties are what would be available at runtime.

### Component coverage

- **Direct Bootstrap equivalents exist for 7 of 9 components** --- Button (`.btn`), Breadcrumbs (`.breadcrumb`), Checkbox (`.form-check`), CheckboxGroup (`.form-check` layout), ListBox (`.list-group`), Select (`.form-select` / `.dropdown`), TextField (`.form-control`), Tabs (`.nav-tabs`).

- **No direct Bootstrap equivalent for Calendar** --- Bootstrap has no calendar/datepicker component. The Calendar component would use Bootstrap utility classes for layout and the `.btn` base for day cells.

---

## Component-Specific Findings

---

### 1. Button

**Bootstrap classes**
- Base class: `.btn`
- Available variants: `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-light`, `.btn-dark`, `.btn-outline-*`, `.btn-link`
- Size modifiers: `.btn-sm`, `.btn-lg`
- Recommended variant: `.btn-primary` --- maps to the existing `variant="primary"` default

**States**
| State | Bootstrap approach | React Aria attribute |
|---|---|---|
| Hover | `:hover` --- changes `background-color`, `border-color`, `color` via `--bs-btn-hover-*` vars | `[data-hovered]` (but `:hover` works natively) |
| Focus | `:focus-visible` --- applies `--bs-btn-focus-box-shadow` (a `0 0 0 .25rem` ring) | `[data-focus-visible]` |
| Active/Pressed | `:active`, `.active` --- applies `--bs-btn-active-*` vars, `--bs-btn-active-shadow` | `[data-pressed]` |
| Disabled | `:disabled`, `.disabled` --- sets `opacity: .65`, `pointer-events: none` | `[data-disabled]` |
| Pending | (no Bootstrap equivalent) | `[data-pending]` --- currently shows `ProgressCircle` |

**SCSS variables / CSS custom properties**
- `--bs-btn-padding-x` / `--bs-btn-padding-y` --- button padding (default `.375rem` / `.75rem`)
- `--bs-btn-font-size` --- button font size
- `--bs-btn-border-radius` --- border radius (default `var(--bs-border-radius)`)
- `--bs-btn-bg` / `--bs-btn-color` --- background and text color
- `--bs-btn-hover-bg` / `--bs-btn-hover-color` --- hover state colors
- `--bs-btn-active-bg` / `--bs-btn-active-color` --- active state colors
- `--bs-btn-disabled-opacity` --- disabled opacity (default `.65`)
- `--bs-btn-focus-box-shadow` --- focus ring shadow
- `$btn-box-shadow` --- `inset 0 1px 0 rgba(white,.15), 0 1px 1px rgba(black,.075)`

**Conflicting existing CSS**
- `border: none` (Button.css:5) --- Bootstrap sets `border: var(--bs-btn-border-width) solid var(--bs-btn-border-color)`
- `border-radius: var(--radius)` (Button.css:6) --- conflicts with `--bs-btn-border-radius`
- `font` shorthand (Button.css:8) --- conflicts with Bootstrap's separate `font-size`, `font-weight`, `line-height` declarations
- `height: var(--spacing-8)` (Button.css:11) --- Bootstrap uses `padding` rather than explicit height
- `padding: 0 var(--spacing-3)` (Button.css:12) --- conflicts with `--bs-btn-padding-*`
- `&[data-pressed] { scale: 0.95 }` (Button.css:32-34) --- Bootstrap doesn't scale on press; uses `box-shadow` and `background-color` change instead
- The `button-base` class from `utilities.css` applies elaborate multi-layer box-shadows that conflict with Bootstrap's simpler `--bs-btn-box-shadow`

---

### 2. Breadcrumbs

**Bootstrap classes**
- Base class: `.breadcrumb` (on the `<ol>` / `<nav>` container)
- Item class: `.breadcrumb-item` (on each `<li>`)
- Active state: `.breadcrumb-item.active` (on the current/last item)
- No dedicated link class --- breadcrumb links are just `<a>` elements inside `.breadcrumb-item`

**States**
| State | Bootstrap approach | React Aria attribute |
|---|---|---|
| Current/Active | `.active` class on `.breadcrumb-item` --- sets `color: var(--bs-breadcrumb-item-active-color)` | `[data-current]` on the `Link` element |
| Hover | Standard `<a>` `:hover` --- inherits link hover styling | `[data-hovered]` |
| Focus | Standard `:focus-visible` | `[data-focus-visible]` |
| Disabled | (not standard in Bootstrap breadcrumbs) | `[data-disabled]` |

**SCSS variables / CSS custom properties**
- `--bs-breadcrumb-padding-x` / `--bs-breadcrumb-padding-y` --- container padding (default `0`)
- `--bs-breadcrumb-margin-bottom` --- bottom margin (default `1rem`)
- `--bs-breadcrumb-font-size` --- font size (default `null` / inherits)
- `--bs-breadcrumb-divider-color` --- separator color
- `--bs-breadcrumb-item-active-color` --- active item color
- `--bs-breadcrumb-item-padding-x` --- horizontal padding between items (default `.5rem`)
- `$breadcrumb-divider` --- separator content (default `"/"`)

**Conflicting existing CSS**
- `align-items: center` (Breadcrumbs.css:4) --- Bootstrap uses `flex-wrap: wrap` but not `align-items: center`
- `color: var(--text-color)` (Breadcrumbs.css:9) --- conflicts with Bootstrap's unset/inherited color
- The Link styling (Breadcrumbs.css:17-47) --- Bootstrap doesn't style breadcrumb links with `[data-hovered]` / `[data-focus-visible]` selectors; it relies on standard anchor styling
- The component uses a Lucide `<ChevronRight>` icon as separator; Bootstrap uses a CSS `::before` pseudo-element with `content: var(--bs-breadcrumb-divider)`. These are structurally different --- Bootstrap's separator is text/CSS-based, the current component uses an inline SVG icon

