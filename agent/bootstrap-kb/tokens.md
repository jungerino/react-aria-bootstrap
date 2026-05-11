---
what: Bootstrap 5.3.8 CSS custom properties (--bs-* tokens) reference
contains: All tokens grouped by category with default values, semantic roles, and which components consume them. SCSS variable name mapped to CSS custom property name. Compiled-CSS-verified — audited against node_modules/bootstrap/dist/css/bootstrap.css.
when-to-load: When you need to know what tokens are available for a component's appearance, or when building CSS bridge rules that override Bootstrap defaults.
related: components.md for which component uses which token; states.md for state-specific token overrides
---

# Bootstrap 5.3.8 CSS Custom Properties Reference

All tokens are defined on `:root, [data-bs-theme="light"]` in `_root.scss`. The `$prefix` SCSS variable resolves to `"bs-"`, so `--#{$prefix}foo` becomes `--bs-foo`. Component-level tokens are defined inside their respective component rule blocks (e.g. `.btn { --bs-btn-* }`) and documented in Section 10.

---

## 1. Color — Palette Base

Generated dynamically from the `$colors` and `$grays` SCSS maps.

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-blue` | `#0d6efd` | Named color swatch | Utility `.text-blue`, `.bg-blue` |
| `--bs-indigo` | `#6610f2` | Named color swatch | Utility classes |
| `--bs-purple` | `#6f42c1` | Named color swatch | Utility classes |
| `--bs-pink` | `#d63384` | Named color swatch | Utility classes |
| `--bs-red` | `#dc3545` | Named color swatch | Utility classes |
| `--bs-orange` | `#fd7e14` | Named color swatch | Utility classes |
| `--bs-yellow` | `#ffc107` | Named color swatch | Utility classes |
| `--bs-green` | `#198754` | Named color swatch | Utility classes |
| `--bs-teal` | `#20c997` | Named color swatch | Utility classes |
| `--bs-cyan` | `#0dcaf0` | Named color swatch | Utility classes |
| `--bs-black` | `#000` | Pure black | Various |
| `--bs-white` | `#fff` | Pure white | Various |
| `--bs-gray` | `#6c757d` | Mid gray (gray-600) | Muted text |
| `--bs-gray-dark` | `#343a40` | Dark gray (gray-800) | Dark text |
| `--bs-gray-100` | `#f8f9fa` | Lightest gray | `.bg-light`, subtle backgrounds |
| `--bs-gray-200` | `#e9ecef` | Very light gray | Secondary backgrounds |
| `--bs-gray-300` | `#dee2e6` | Light gray | Default border color |
| `--bs-gray-400` | `#ced4da` | Gray | Input borders |
| `--bs-gray-500` | `#adb5bd` | Mid-light gray | Placeholders |
| `--bs-gray-600` | `#6c757d` | Mid gray | Secondary text, muted |
| `--bs-gray-700` | `#495057` | Dark-mid gray | Body text on light |
| `--bs-gray-800` | `#343a40` | Dark gray | Headings on light |
| `--bs-gray-900` | `#212529` | Darkest gray | Body color default |
| `--bs-white-rgb` | `255, 255, 255` | RGB triple for white | Box shadow, rgba() usage |
| `--bs-black-rgb` | `0, 0, 0` | RGB triple for black | Box shadow, rgba() usage |

---

## 2. Color — Theme

Generated from `$theme-colors` map. Each color also has an `-rgb` variant for use in `rgba()`.

| CSS property | Default value (light) | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-primary` | `#0d6efd` | Brand primary | Buttons, focus rings, active states |
| `--bs-primary-rgb` | `13, 110, 253` | RGB triple | Focus rings, overlays |
| `--bs-secondary` | `#6c757d` | Neutral / secondary | Buttons, muted elements |
| `--bs-secondary-rgb` | `108, 117, 125` | RGB triple | — |
| `--bs-success` | `#198754` | Positive / valid | Alerts, badges, validation |
| `--bs-success-rgb` | `25, 135, 84` | RGB triple | — |
| `--bs-info` | `#0dcaf0` | Informational | Alerts, badges |
| `--bs-info-rgb` | `13, 202, 240` | RGB triple | — |
| `--bs-warning` | `#ffc107` | Caution | Alerts, badges |
| `--bs-warning-rgb` | `255, 193, 7` | RGB triple | — |
| `--bs-danger` | `#dc3545` | Error / destructive | Alerts, badges, validation |
| `--bs-danger-rgb` | `220, 53, 69` | RGB triple | — |
| `--bs-light` | `#f8f9fa` | Light surface | Backgrounds |
| `--bs-light-rgb` | `248, 249, 250` | RGB triple | — |
| `--bs-dark` | `#212529` | Dark surface | Dark buttons, dark navbar |
| `--bs-dark-rgb` | `33, 37, 41` | RGB triple | — |

---

## 3. Color — Text/Border Emphasis (Contextual variants)

Generated per-theme-color. These use subtle tints/shades for accessible contextual UX.

| CSS property | Default value (light mode) | Semantic role |
|---|---|---|
| `--bs-primary-text-emphasis` | `shade-color($primary, 60%)` ≈ `#052c65` | Dark primary text on subtle bg |
| `--bs-secondary-text-emphasis` | `shade-color($secondary, 60%)` ≈ `#2b2f32` | Dark secondary text on subtle bg |
| `--bs-success-text-emphasis` | `shade-color($success, 60%)` ≈ `#0a3622` | Dark success text on subtle bg |
| `--bs-info-text-emphasis` | `shade-color($info, 60%)` ≈ `#055160` | Dark info text on subtle bg |
| `--bs-warning-text-emphasis` | `shade-color($warning, 60%)` ≈ `#664d03` | Dark warning text on subtle bg |
| `--bs-danger-text-emphasis` | `shade-color($danger, 60%)` ≈ `#58151c` | Dark danger text on subtle bg |
| `--bs-light-text-emphasis` | `$gray-700` = `#495057` | Text on light subtle bg |
| `--bs-dark-text-emphasis` | `$gray-700` = `#495057` | Text on dark subtle bg |
| `--bs-primary-bg-subtle` | `tint-color($primary, 80%)` ≈ `#cfe2ff` | Subtle primary background |
| `--bs-secondary-bg-subtle` | `tint-color($secondary, 80%)` ≈ `#e2e3e5` | Subtle secondary background |
| `--bs-success-bg-subtle` | `tint-color($success, 80%)` ≈ `#d1e7dd` | Subtle success background |
| `--bs-info-bg-subtle` | `tint-color($info, 80%)` ≈ `#cff4fc` | Subtle info background |
| `--bs-warning-bg-subtle` | `tint-color($warning, 80%)` ≈ `#fff3cd` | Subtle warning background |
| `--bs-danger-bg-subtle` | `tint-color($danger, 80%)` ≈ `#f8d7da` | Subtle danger background |
| `--bs-light-bg-subtle` | `mix($gray-100, $white)` ≈ `#fcfcfd` | Subtle light background |
| `--bs-dark-bg-subtle` | `$gray-400` = `#ced4da` | Subtle dark background |
| `--bs-primary-border-subtle` | `tint-color($primary, 60%)` ≈ `#9ec5fe` | Subtle primary border |
| `--bs-secondary-border-subtle` | `tint-color($secondary, 60%)` ≈ `#c4c8cb` | Subtle secondary border |
| `--bs-success-border-subtle` | `tint-color($success, 60%)` ≈ `#a3cfbb` | Subtle success border |
| `--bs-info-border-subtle` | `tint-color($info, 60%)` ≈ `#9eeaf9` | Subtle info border |
| `--bs-warning-border-subtle` | `tint-color($warning, 60%)` ≈ `#ffe69c` | Subtle warning border |
| `--bs-danger-border-subtle` | `tint-color($danger, 60%)` ≈ `#f1aeb5` | Subtle danger border |
| `--bs-light-border-subtle` | `$gray-200` = `#e9ecef` | Subtle light border |
| `--bs-dark-border-subtle` | `$gray-500` = `#adb5bd` | Subtle dark border |

---

## 4. Color — Semantic (Body & UI)

| CSS property | SCSS variable | Default value | Semantic role | Components that use it |
|---|---|---|---|---|
| `--bs-body-color` | `$body-color` | `#212529` | Default text color | All text-bearing components |
| `--bs-body-color-rgb` | derived | `33, 37, 41` | RGB triple | Overlay/transparency usage |
| `--bs-body-bg` | `$body-bg` | `#ffffff` | Page background | Cards, modals, inputs |
| `--bs-body-bg-rgb` | derived | `255, 255, 255` | RGB triple | Toast bg, modal backdrop |
| `--bs-emphasis-color` | `$body-emphasis-color` | `#000` | High-emphasis text | Tables, headings |
| `--bs-emphasis-color-rgb` | derived | `0, 0, 0` | RGB triple | Striped/hover row bg |
| `--bs-secondary-color` | `$body-secondary-color` | `rgba(33,37,41,.75)` | Muted / secondary text | Form hints, captions |
| `--bs-secondary-color-rgb` | derived | `33, 37, 41` | RGB triple | — |
| `--bs-secondary-bg` | `$body-secondary-bg` | `#e9ecef` | Secondary surface | Disabled inputs, input-group |
| `--bs-secondary-bg-rgb` | derived | `233, 236, 239` | RGB triple | — |
| `--bs-tertiary-color` | `$body-tertiary-color` | `rgba(33,37,41,.5)` | Very muted text | Placeholders |
| `--bs-tertiary-color-rgb` | derived | `33, 37, 41` | RGB triple | — |
| `--bs-tertiary-bg` | `$body-tertiary-bg` | `#f8f9fa` | Tertiary surface | Input group addons, list hover |
| `--bs-tertiary-bg-rgb` | derived | `248, 249, 250` | RGB triple | — |
| `--bs-heading-color` | `$headings-color` | `inherit` | Heading text color | h1–h6 |
| `--bs-link-color` | `$link-color` | `#0d6efd` | Hyperlink color | Nav links, pagination |
| `--bs-link-color-rgb` | derived | `13, 110, 253` | RGB triple | — |
| `--bs-link-decoration` | `$link-decoration` | `underline` | Link underline | a elements |
| `--bs-link-hover-color` | `$link-hover-color` | `#0a58ca` | Hovered link color | Nav links hover |
| `--bs-link-hover-color-rgb` | derived | `10, 88, 202` | RGB triple | — |
| `--bs-code-color` | `$code-color` | `#d63384` | Inline code text | `<code>` elements |
| `--bs-highlight-color` | `$mark-color` | `#212529` | Highlighted text | `<mark>` elements |
| `--bs-highlight-bg` | `$mark-bg` | `#fff3cd` (yellow-100) | Highlight background | `<mark>` elements |

---

## 5. Typography

| CSS property | SCSS variable | Default value | Semantic role |
|---|---|---|---|
| `--bs-font-sans-serif` | `$font-family-sans-serif` | `system-ui, -apple-system, "Segoe UI", Roboto, …` | System sans-serif stack |
| `--bs-font-monospace` | `$font-family-monospace` | `SFMono-Regular, Menlo, Monaco, Consolas, …` | Monospace stack |
| `--bs-gradient` | `$gradient` | `linear-gradient(180deg, rgba(#fff,.15), rgba(#fff,0))` | Optional gradient overlay |
| `--bs-body-font-family` | `$font-family-base` | `var(--bs-font-sans-serif)` | Body font |
| `--bs-body-font-size` | `$font-size-base` | `1rem` | Body font size (16px default) |
| `--bs-body-font-weight` | `$font-weight-base` | `400` | Body font weight |
| `--bs-body-line-height` | `$line-height-base` | `1.5` | Body line height |

> `--bs-root-font-size` and `--bs-body-text-align` are only emitted if their SCSS variables are non-null (both are null by default).

---

## 6. Border

| CSS property | SCSS variable | Default value | Semantic role |
|---|---|---|---|
| `--bs-border-width` | `$border-width` | `1px` | Default border thickness |
| `--bs-border-style` | `$border-style` | `solid` | Default border style |
| `--bs-border-color` | `$border-color` | `#dee2e6` (gray-300) | Default border color |
| `--bs-border-color-translucent` | `$border-color-translucent` | `rgba(0,0,0,.175)` | Translucent border (cards, dropdowns) |
| `--bs-border-radius` | `$border-radius` | `.375rem` | Default rounding |
| `--bs-border-radius-sm` | `$border-radius-sm` | `.25rem` | Small rounding |
| `--bs-border-radius-lg` | `$border-radius-lg` | `.5rem` | Large rounding |
| `--bs-border-radius-xl` | `$border-radius-xl` | `1rem` | Extra-large rounding |
| `--bs-border-radius-xxl` | `$border-radius-xxl` | `2rem` | Double-XL rounding |
| `--bs-border-radius-pill` | `$border-radius-pill` | `50rem` | Full pill/capsule shape |
| `--bs-border-radius-2xl` | (alias of xxl) | `var(--bs-border-radius-xxl)` | **Deprecated** in v5.3.0 |

---

## 7. Shadow

| CSS property | SCSS variable | Default value | Semantic role |
|---|---|---|---|
| `--bs-box-shadow` | `$box-shadow` | `0 .5rem 1rem rgba(0,0,0,.15)` | Standard shadow (cards, dropdowns) |
| `--bs-box-shadow-sm` | `$box-shadow-sm` | `0 .125rem .25rem rgba(0,0,0,.075)` | Subtle shadow (small elements) |
| `--bs-box-shadow-lg` | `$box-shadow-lg` | `0 1rem 3rem rgba(0,0,0,.175)` | Large shadow (modals, popovers) |
| `--bs-box-shadow-inset` | `$box-shadow-inset` | `inset 0 1px 2px rgba(0,0,0,.075)` | Inset shadow (inputs) |

---

## 8. Focus Ring

| CSS property | SCSS variable | Default value | Semantic role |
|---|---|---|---|
| `--bs-focus-ring-width` | `$focus-ring-width` | `.25rem` | Focus ring outer spread |
| `--bs-focus-ring-opacity` | `$focus-ring-opacity` | `.25` | Focus ring alpha |
| `--bs-focus-ring-color` | `$focus-ring-color` | `rgba($primary, .25)` ≈ `rgba(13,110,253,.25)` | Focus ring color (blue-tinted) |

> Note: `--bs-focus-ring-color` is the **ring** color (box-shadow), not the text or border color when focused. Bootstrap's form-control focus border color is compiled to a static value (not a runtime CSS custom property).

---

## 9. Form Validation

| CSS property | SCSS variable | Default value | Semantic role |
|---|---|---|---|
| `--bs-form-valid-color` | `$form-valid-color` | `$success` = `#198754` | Valid state text/icon color |
| `--bs-form-valid-border-color` | `$form-valid-border-color` | `$success` = `#198754` | Valid state border color |
| `--bs-form-invalid-color` | `$form-invalid-color` | `$danger` = `#dc3545` | Invalid state text/icon color |
| `--bs-form-invalid-border-color` | `$form-invalid-border-color` | `$danger` = `#dc3545` | Invalid state border color |

---

## 10. Component-Level Tokens

Component-level tokens are **scoped CSS custom properties defined inside each component's rule block** (e.g. `.btn { --bs-btn-padding-y: … }`). They are not defined in `_root.scss`. Values below are from the compiled CSS (light-mode defaults).

### Button (`--bs-btn-*`)

Defined on `.btn {}` in `_buttons.scss`. Base tokens set structural defaults; variant tokens override color/bg per `.btn-primary`, `.btn-outline-*`, etc.

**Base tokens (set on `.btn`):**

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-btn-padding-y` | `0.375rem` | Vertical padding |
| `--bs-btn-padding-x` | `0.75rem` | Horizontal padding |
| `--bs-btn-font-family` | *(empty — inherits)* | Button font |
| `--bs-btn-font-size` | `1rem` | Button font size |
| `--bs-btn-font-weight` | `400` | Button font weight |
| `--bs-btn-line-height` | `1.5` | Button line height |
| `--bs-btn-color` | `var(--bs-body-color)` | Default button text color |
| `--bs-btn-bg` | `transparent` | Default button background |
| `--bs-btn-border-width` | `var(--bs-border-width)` | Button border width |
| `--bs-btn-border-color` | `transparent` | Default button border |
| `--bs-btn-border-radius` | `var(--bs-border-radius)` | Button corner radius |
| `--bs-btn-hover-border-color` | `transparent` | Hover border color |
| `--bs-btn-box-shadow` | `inset 0 1px 0 rgba(255,255,255,.15), 0 1px 1px rgba(0,0,0,.075)` | Button shadow |
| `--bs-btn-disabled-opacity` | `0.65` | Disabled button opacity |
| `--bs-btn-focus-box-shadow` | `0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb),.5)` | Focus ring shadow |

**Variant-specific tokens** — set on `.btn-primary`, `.btn-secondary`, etc. via the button-variant mixin. Each variant provides these tokens:

| CSS property | Purpose |
|---|---|
| `--bs-btn-color` | Text color for this variant |
| `--bs-btn-bg` | Background color for this variant |
| `--bs-btn-border-color` | Border color for this variant |
| `--bs-btn-hover-color` | Hover text color |
| `--bs-btn-hover-bg` | Hover background |
| `--bs-btn-hover-border-color` | Hover border color |
| `--bs-btn-focus-shadow-rgb` | RGB triple for focus ring |
| `--bs-btn-active-color` | Active/pressed text color |
| `--bs-btn-active-bg` | Active/pressed background |
| `--bs-btn-active-border-color` | Active/pressed border color |
| `--bs-btn-active-shadow` | Active press shadow (`inset 0 3px 5px rgba(0,0,0,.125)`) |
| `--bs-btn-disabled-color` | Disabled text color |
| `--bs-btn-disabled-bg` | Disabled background |
| `--bs-btn-disabled-border-color` | Disabled border color |

> Example: `.btn-primary` sets `--bs-btn-bg: #0d6efd`, `--bs-btn-color: #fff`, etc.

**Size modifier tokens** — overridden on `.btn-lg` / `.btn-sm`:

| CSS property | `.btn-lg` | `.btn-sm` |
|---|---|---|
| `--bs-btn-padding-y` | `0.5rem` | `0.25rem` |
| `--bs-btn-padding-x` | `1rem` | `0.5rem` |
| `--bs-btn-font-size` | `1.25rem` | `0.875rem` |

### Form Check / Checkbox (`--bs-form-check-*`)

Bootstrap's `.form-check-input` uses runtime CSS custom properties for its appearance. Defined inside `.form-check-input {}` in `_form-check.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-form-check-bg` | `var(--bs-body-bg)` | Checkbox/radio background (unchecked) |
| `--bs-form-check-bg-image` | SVG checkmark / dot / dash (set on `:checked`, varies by type) | Custom check indicator image |

> `--bs-form-check-bg-image` is overridden when `:checked` (checkmark SVG), when `:indeterminate` (dash SVG), and for radio (dot SVG). This is a runtime CSS custom property, not a SCSS compile-time value.

**Form Switch** (toggle):

| CSS property | State | Value |
|---|---|---|
| `--bs-form-switch-bg` | Default | SVG circle with `rgba(0,0,0,.25)` fill |
| `--bs-form-switch-bg` | `:focus` | SVG circle with `#86b7fe` fill |
| `--bs-form-switch-bg` | `:checked` | SVG circle with `#fff` fill |

### Form Select (`--bs-form-select-*`)

Defined inside `.form-select {}` in `_form-select.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-form-select-bg-img` | Inline SVG caret (dark stroke for light mode) | Dropdown arrow icon |
| `--bs-form-select-bg-icon` | Overridden for `.is-valid` (green check SVG) and `.is-invalid` (red X SVG) | Validation feedback icon |

> Note: `.form-select` does **not** define `--bs-input-*` tokens. Most form-control (text input) styling uses SCSS variables compiled to static values, not runtime CSS custom properties.

### Nav / Tabs (`--bs-nav-*`)

Defined on `.nav {}` in `_nav.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-nav-link-padding-y` | `0.5rem` | Nav link vertical padding |
| `--bs-nav-link-padding-x` | `1rem` | Nav link horizontal padding |
| `--bs-nav-link-font-weight` | *(empty — inherits)* | Nav link font weight |
| `--bs-nav-link-color` | `var(--bs-link-color)` | Nav link default color |
| `--bs-nav-link-hover-color` | `var(--bs-link-hover-color)` | Nav link hover color |
| `--bs-nav-link-disabled-color` | `var(--bs-secondary-color)` | Disabled nav link color |

**Tabs** (additional tokens on `.nav-tabs`):

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-nav-tabs-border-width` | `var(--bs-border-width)` | Tab bottom-border width |
| `--bs-nav-tabs-border-color` | `var(--bs-border-color)` | Tab underline border color |
| `--bs-nav-tabs-border-radius` | `var(--bs-border-radius)` | Tab top-corner rounding |
| `--bs-nav-tabs-link-hover-border-color` | `var(--bs-secondary-bg) var(--bs-secondary-bg) var(--bs-border-color)` | Hover tab borders (top/side/bottom) |
| `--bs-nav-tabs-link-active-color` | `var(--bs-emphasis-color)` | Active tab text color |
| `--bs-nav-tabs-link-active-bg` | `var(--bs-body-bg)` | Active tab background |
| `--bs-nav-tabs-link-active-border-color` | `var(--bs-border-color) var(--bs-border-color) var(--bs-body-bg)` | Active tab borders (top/side/bottom) |

**Pills** (additional tokens on `.nav-pills`):

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-nav-pills-border-radius` | `var(--bs-border-radius)` | Pill item rounding |
| `--bs-nav-pills-link-active-color` | `#fff` | Active pill text color |
| `--bs-nav-pills-link-active-bg` | `#0d6efd` | Active pill background |

**Underline nav** (additional tokens on `.nav-underline`):

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-nav-underline-gap` | `1rem` | Gap between items |
| `--bs-nav-underline-border-width` | `0.125rem` | Active underline thickness |
| `--bs-nav-underline-link-active-color` | `var(--bs-emphasis-color)` | Active underline-nav text |

### Navbar (`--bs-navbar-*`)

Defined on `.navbar {}` in `_navbar.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-navbar-padding-x` | `0` | Navbar horizontal padding |
| `--bs-navbar-padding-y` | `0.5rem` | Navbar vertical padding |
| `--bs-navbar-color` | `rgba(var(--bs-emphasis-color-rgb), 0.65)` | Nav item text color |
| `--bs-navbar-hover-color` | `rgba(var(--bs-emphasis-color-rgb), 0.8)` | Nav item hover color |
| `--bs-navbar-disabled-color` | `rgba(var(--bs-emphasis-color-rgb), 0.3)` | Disabled nav item |
| `--bs-navbar-active-color` | `rgba(var(--bs-emphasis-color-rgb), 1)` | Active nav item |
| `--bs-navbar-brand-padding-y` | `0.3125rem` | Brand vertical padding |
| `--bs-navbar-brand-margin-end` | `1rem` | Brand right margin |
| `--bs-navbar-brand-font-size` | `1.25rem` | Brand font size |
| `--bs-navbar-brand-color` | `rgba(var(--bs-emphasis-color-rgb), 1)` | Brand text color |
| `--bs-navbar-brand-hover-color` | `rgba(var(--bs-emphasis-color-rgb), 1)` | Brand hover color |
| `--bs-navbar-nav-link-padding-x` | `0.5rem` | Nav link horizontal padding |
| `--bs-navbar-toggler-padding-y` | `0.25rem` | Toggler vertical padding |
| `--bs-navbar-toggler-padding-x` | `0.75rem` | Toggler horizontal padding |
| `--bs-navbar-toggler-font-size` | `1.25rem` | Toggler font size |
| `--bs-navbar-toggler-icon-bg` | SVG hamburger icon (dark strokes) | Toggler icon |
| `--bs-navbar-toggler-border-color` | `rgba(var(--bs-emphasis-color-rgb), 0.15)` | Toggler border color |
| `--bs-navbar-toggler-border-radius` | `var(--bs-border-radius)` | Toggler rounding |
| `--bs-navbar-toggler-focus-width` | `0.25rem` | Toggler focus ring width |
| `--bs-navbar-toggler-transition` | `box-shadow 0.15s ease-in-out` | Toggler transition |

> `.navbar-dark` overrides several of these tokens with white-based values.

### Dropdown (`--bs-dropdown-*`)

Defined on `.dropdown-menu {}` in `_dropdown.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-dropdown-zindex` | `1000` | Dropdown z-index |
| `--bs-dropdown-min-width` | `10rem` | Minimum menu width |
| `--bs-dropdown-padding-x` | `0` | Menu horizontal padding |
| `--bs-dropdown-padding-y` | `0.5rem` | Menu vertical padding |
| `--bs-dropdown-spacer` | `0.125rem` | Gap between toggle and menu |
| `--bs-dropdown-font-size` | `1rem` | Menu font size |
| `--bs-dropdown-color` | `var(--bs-body-color)` | Menu text color |
| `--bs-dropdown-bg` | `var(--bs-body-bg)` | Menu background |
| `--bs-dropdown-border-color` | `var(--bs-border-color-translucent)` | Menu border color |
| `--bs-dropdown-border-radius` | `var(--bs-border-radius)` | Menu rounding |
| `--bs-dropdown-border-width` | `var(--bs-border-width)` | Menu border width |
| `--bs-dropdown-inner-border-radius` | `calc(var(--bs-border-radius) - var(--bs-border-width))` | Inner element rounding |
| `--bs-dropdown-divider-bg` | `var(--bs-border-color-translucent)` | Divider color |
| `--bs-dropdown-divider-margin-y` | `0.5rem` | Divider vertical margin |
| `--bs-dropdown-box-shadow` | `var(--bs-box-shadow)` | Menu drop shadow |
| `--bs-dropdown-link-color` | `var(--bs-body-color)` | Item text color |
| `--bs-dropdown-link-hover-color` | `var(--bs-body-color)` | Item hover text color |
| `--bs-dropdown-link-hover-bg` | `var(--bs-tertiary-bg)` | Item hover background |
| `--bs-dropdown-link-active-color` | `#fff` | Selected item text |
| `--bs-dropdown-link-active-bg` | `#0d6efd` | Selected item background |
| `--bs-dropdown-link-disabled-color` | `var(--bs-tertiary-color)` | Disabled item text |
| `--bs-dropdown-item-padding-y` | `0.25rem` | Item vertical padding |
| `--bs-dropdown-item-padding-x` | `1rem` | Item horizontal padding |
| `--bs-dropdown-header-color` | `#6c757d` | Header text color |
| `--bs-dropdown-header-padding-x` | `1rem` | Header horizontal padding |
| `--bs-dropdown-header-padding-y` | `0.5rem` | Header vertical padding |

### List Group (`--bs-list-group-*`)

Defined on `.list-group {}` in `_list-group.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-list-group-color` | `var(--bs-body-color)` | Item text color |
| `--bs-list-group-bg` | `var(--bs-body-bg)` | Item background |
| `--bs-list-group-border-color` | `var(--bs-border-color)` | Item border color |
| `--bs-list-group-border-width` | `var(--bs-border-width)` | Item border width |
| `--bs-list-group-border-radius` | `var(--bs-border-radius)` | List rounding |
| `--bs-list-group-item-padding-y` | `0.5rem` | Item vertical padding |
| `--bs-list-group-item-padding-x` | `1rem` | Item horizontal padding |
| `--bs-list-group-action-color` | `var(--bs-secondary-color)` | Actionable item text |
| `--bs-list-group-action-hover-color` | `var(--bs-emphasis-color)` | Actionable item hover text |
| `--bs-list-group-action-hover-bg` | `var(--bs-tertiary-bg)` | Actionable item hover bg |
| `--bs-list-group-action-active-color` | `var(--bs-body-color)` | Actionable item active text |
| `--bs-list-group-action-active-bg` | `var(--bs-secondary-bg)` | Actionable item active bg |
| `--bs-list-group-disabled-color` | `var(--bs-secondary-color)` | Disabled item text |
| `--bs-list-group-disabled-bg` | `var(--bs-body-bg)` | Disabled item background |
| `--bs-list-group-active-color` | `#fff` | Selected item text |
| `--bs-list-group-active-bg` | `#0d6efd` | Selected item background |
| `--bs-list-group-active-border-color` | `#0d6efd` | Selected item border |

> Note: The SCSS source named this `$list-group-hover-bg`; in compiled CSS it appears as `--bs-list-group-action-hover-bg`.

### Accordion (`--bs-accordion-*`)

Defined on `.accordion {}` in `_accordion.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-accordion-color` | `var(--bs-body-color)` | Content text |
| `--bs-accordion-bg` | `var(--bs-body-bg)` | Content background |
| `--bs-accordion-transition` | `color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, border-radius 0.15s ease` | Header transition |
| `--bs-accordion-border-color` | `var(--bs-border-color)` | Panel border color |
| `--bs-accordion-border-width` | `var(--bs-border-width)` | Panel border width |
| `--bs-accordion-border-radius` | `var(--bs-border-radius)` | Outer rounding |
| `--bs-accordion-inner-border-radius` | `calc(var(--bs-border-radius) - (var(--bs-border-width)))` | Inner element rounding |
| `--bs-accordion-btn-padding-y` | `1rem` | Header button vertical padding |
| `--bs-accordion-btn-padding-x` | `1.25rem` | Header button horizontal padding |
| `--bs-accordion-btn-color` | `var(--bs-body-color)` | Header button text |
| `--bs-accordion-btn-bg` | `var(--bs-accordion-bg)` | Header button background |
| `--bs-accordion-btn-focus-box-shadow` | (references `$btn-focus-box-shadow`) | Focus ring |
| `--bs-accordion-body-padding-x` | `1.25rem` | Body horizontal padding |
| `--bs-accordion-body-padding-y` | `1rem` | Body vertical padding |
| `--bs-accordion-active-color` | `var(--bs-primary-text-emphasis)` | Open header text |
| `--bs-accordion-active-bg` | `var(--bs-primary-bg-subtle)` | Open header background |

### Badge (`--bs-badge-*`)

Defined on `.badge {}` in `_badge.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-badge-padding-y` | `0.35em` | Vertical padding |
| `--bs-badge-padding-x` | `0.65em` | Horizontal padding |
| `--bs-badge-font-size` | `0.75em` | Badge font size |
| `--bs-badge-font-weight` | `700` | Badge font weight |
| `--bs-badge-color` | `#fff` | Badge text color |
| `--bs-badge-border-radius` | `var(--bs-border-radius)` | Badge rounding |

### Alert (`--bs-alert-*`)

Defined on `.alert {}` in `_alert.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-alert-bg` | `transparent` | Alert background (overridden per variant) |
| `--bs-alert-padding-y` | `1rem` | Vertical padding |
| `--bs-alert-padding-x` | `1rem` | Horizontal padding |
| `--bs-alert-margin-bottom` | `1rem` | Bottom margin |
| `--bs-alert-color` | `inherit` | Alert text color (overridden per variant) |
| `--bs-alert-border-color` | `transparent` | Alert border color (overridden per variant) |
| `--bs-alert-border` | `var(--bs-border-width) solid var(--bs-alert-border-color)` | Full border shorthand |
| `--bs-alert-border-radius` | `var(--bs-border-radius)` | Alert rounding |
| `--bs-alert-link-color` | `inherit` | Alert link color (overridden per variant) |

> Variant classes (`.alert-primary`, `.alert-danger`, etc.) override `--bs-alert-color`, `--bs-alert-bg`, `--bs-alert-border-color`, and `--bs-alert-link-color` using the `*-text-emphasis`, `*-bg-subtle`, and `*-border-subtle` tokens.

### Progress (`--bs-progress-*`)

Defined on `.progress {}` in `_progress.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-progress-height` | `1rem` | Track height |
| `--bs-progress-font-size` | `0.75rem` | Label font size |
| `--bs-progress-bg` | `var(--bs-secondary-bg)` | Track background |
| `--bs-progress-border-radius` | `var(--bs-border-radius)` | Track rounding |
| `--bs-progress-box-shadow` | `var(--bs-box-shadow-inset)` | Inset shadow on track |
| `--bs-progress-bar-color` | `#fff` | Bar label text color |
| `--bs-progress-bar-bg` | `#0d6efd` | Bar fill color |
| `--bs-progress-bar-transition` | `width 0.6s ease` | Bar width animation |

### Breadcrumb (`--bs-breadcrumb-*`)

Defined on `.breadcrumb {}` in `_breadcrumb.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-breadcrumb-padding-x` | `0` | Horizontal padding |
| `--bs-breadcrumb-padding-y` | `0` | Vertical padding |
| `--bs-breadcrumb-margin-bottom` | `1rem` | Bottom margin |
| `--bs-breadcrumb-bg` | *(empty)* | Background (transparent by default) |
| `--bs-breadcrumb-border-radius` | *(empty)* | Rounding (none by default) |
| `--bs-breadcrumb-divider-color` | `var(--bs-secondary-color)` | Divider `/` color |
| `--bs-breadcrumb-item-padding-x` | `0.5rem` | Padding around divider |
| `--bs-breadcrumb-item-active-color` | `var(--bs-secondary-color)` | Current page text |

### Pagination (`--bs-pagination-*`)

Defined on `.pagination {}` in `_pagination.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-pagination-padding-y` | `0.375rem` | Item vertical padding |
| `--bs-pagination-padding-x` | `0.75rem` | Item horizontal padding |
| `--bs-pagination-font-size` | `1rem` | Item font size |
| `--bs-pagination-color` | `var(--bs-link-color)` | Item text color |
| `--bs-pagination-bg` | `var(--bs-body-bg)` | Item background |
| `--bs-pagination-border-width` | `var(--bs-border-width)` | Item border width |
| `--bs-pagination-border-color` | `var(--bs-border-color)` | Item border color |
| `--bs-pagination-border-radius` | `var(--bs-border-radius)` | Item rounding |
| `--bs-pagination-hover-color` | `var(--bs-link-hover-color)` | Hover text color |
| `--bs-pagination-hover-bg` | `var(--bs-tertiary-bg)` | Hover background |
| `--bs-pagination-hover-border-color` | `var(--bs-border-color)` | Hover border color |
| `--bs-pagination-focus-color` | `var(--bs-link-hover-color)` | Focused item text |
| `--bs-pagination-focus-bg` | `var(--bs-secondary-bg)` | Focused item background |
| `--bs-pagination-focus-box-shadow` | `0 0 0 0.25rem rgba(13,110,253,.25)` | Focused item ring |
| `--bs-pagination-active-color` | `#fff` | Active page text |
| `--bs-pagination-active-bg` | `#0d6efd` | Active page background |
| `--bs-pagination-active-border-color` | `#0d6efd` | Active page border |
| `--bs-pagination-disabled-color` | `var(--bs-secondary-color)` | Disabled page text |
| `--bs-pagination-disabled-bg` | `var(--bs-secondary-bg)` | Disabled page background |
| `--bs-pagination-disabled-border-color` | `var(--bs-border-color)` | Disabled page border |

### Card (`--bs-card-*`)

Defined on `.card {}` in `_card.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-card-spacer-y` | `1rem` | Card body vertical padding |
| `--bs-card-spacer-x` | `1rem` | Card body horizontal padding |
| `--bs-card-title-spacer-y` | `0.5rem` | Spacing below title |
| `--bs-card-title-color` | *(empty — inherits)* | Card title color |
| `--bs-card-subtitle-color` | *(empty — inherits)* | Card subtitle color |
| `--bs-card-border-width` | `var(--bs-border-width)` | Card border width |
| `--bs-card-border-color` | `var(--bs-border-color-translucent)` | Card border color |
| `--bs-card-border-radius` | `var(--bs-border-radius)` | Card rounding |
| `--bs-card-box-shadow` | *(empty)* | Card shadow (none by default) |
| `--bs-card-inner-border-radius` | `calc(var(--bs-border-radius) - (var(--bs-border-width)))` | Inner element rounding |
| `--bs-card-cap-padding-y` | `0.5rem` | Header/footer vertical padding |
| `--bs-card-cap-padding-x` | `1rem` | Header/footer horizontal padding |
| `--bs-card-cap-bg` | `rgba(var(--bs-body-color-rgb), 0.03)` | Header/footer background tint |
| `--bs-card-cap-color` | *(empty — inherits)* | Header/footer text color |
| `--bs-card-height` | *(empty)* | Card height (auto by default) |
| `--bs-card-color` | *(empty — inherits)* | Card body text color |
| `--bs-card-bg` | `var(--bs-body-bg)` | Card background |
| `--bs-card-img-overlay-padding` | `1rem` | Image overlay padding |
| `--bs-card-group-margin` | `0.75rem` | Card group gutter |

### Toast (`--bs-toast-*`)

Defined on `.toast {}` in `_toasts.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-toast-zindex` | `1090` | Toast stacking z-index |
| `--bs-toast-padding-x` | `0.75rem` | Horizontal padding |
| `--bs-toast-padding-y` | `0.5rem` | Vertical padding |
| `--bs-toast-spacing` | `1.5rem` | Gap between stacked toasts |
| `--bs-toast-max-width` | `350px` | Maximum width |
| `--bs-toast-font-size` | `0.875rem` | Toast font size |
| `--bs-toast-color` | *(empty — inherits)* | Toast text color |
| `--bs-toast-bg` | `rgba(var(--bs-body-bg-rgb), 0.85)` | Toast background |
| `--bs-toast-border-width` | `var(--bs-border-width)` | Toast border width |
| `--bs-toast-border-color` | `var(--bs-border-color-translucent)` | Toast border color |
| `--bs-toast-border-radius` | `var(--bs-border-radius)` | Toast rounding |
| `--bs-toast-box-shadow` | `var(--bs-box-shadow)` | Toast drop shadow |
| `--bs-toast-header-color` | `var(--bs-secondary-color)` | Header text color |
| `--bs-toast-header-bg` | `rgba(var(--bs-body-bg-rgb), 0.85)` | Header background |
| `--bs-toast-header-border-color` | `var(--bs-border-color-translucent)` | Header border color |

### Modal (`--bs-modal-*`)

Defined on `.modal {}` / `.modal-content {}` in `_modal.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-modal-zindex` | `1055` | Modal stacking z-index |
| `--bs-modal-width` | `500px` | Default modal width |
| `--bs-modal-padding` | `1rem` | Body/section padding |
| `--bs-modal-margin` | `0.5rem` | Outer margin (mobile) |
| `--bs-modal-color` | `var(--bs-body-color)` | Modal text color |
| `--bs-modal-bg` | `var(--bs-body-bg)` | Modal background |
| `--bs-modal-border-color` | `var(--bs-border-color-translucent)` | Modal border color |
| `--bs-modal-border-width` | `var(--bs-border-width)` | Modal border width |
| `--bs-modal-border-radius` | `var(--bs-border-radius-lg)` | Modal rounding |
| `--bs-modal-box-shadow` | `var(--bs-box-shadow-sm)` | Mobile shadow |
| `--bs-modal-inner-border-radius` | `calc(var(--bs-border-radius-lg) - (var(--bs-border-width)))` | Inner element rounding |
| `--bs-modal-header-padding-x` | `1rem` | Header horizontal padding |
| `--bs-modal-header-padding-y` | `1rem` | Header vertical padding |
| `--bs-modal-header-padding` | `1rem 1rem` | Header padding shorthand |
| `--bs-modal-header-border-color` | `var(--bs-border-color)` | Header divider border color |
| `--bs-modal-header-border-width` | `var(--bs-border-width)` | Header divider border width |
| `--bs-modal-title-line-height` | `1.5` | Modal title line height |
| `--bs-modal-footer-gap` | `0.5rem` | Gap between footer actions |
| `--bs-modal-footer-bg` | *(empty)* | Footer background (transparent) |
| `--bs-modal-footer-border-color` | `var(--bs-border-color)` | Footer divider border color |
| `--bs-modal-footer-border-width` | `var(--bs-border-width)` | Footer divider border width |

> On `@media (min-width: 576px)`, `--bs-modal-margin` becomes `1.75rem` and `--bs-modal-box-shadow` becomes `var(--bs-box-shadow)`.

### Tooltip (`--bs-tooltip-*`)

Defined on `.tooltip {}` in `_tooltip.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-tooltip-zindex` | `1080` | Tooltip stacking z-index |
| `--bs-tooltip-max-width` | `200px` | Maximum tooltip width |
| `--bs-tooltip-padding-x` | `0.5rem` | Horizontal padding |
| `--bs-tooltip-padding-y` | `0.25rem` | Vertical padding |
| `--bs-tooltip-margin` | *(empty)* | External margin |
| `--bs-tooltip-font-size` | `0.875rem` | Tooltip font size |
| `--bs-tooltip-color` | `var(--bs-body-bg)` | Tooltip text color |
| `--bs-tooltip-bg` | `var(--bs-emphasis-color)` | Tooltip background |
| `--bs-tooltip-border-radius` | `var(--bs-border-radius)` | Tooltip rounding |
| `--bs-tooltip-opacity` | `0.9` | Tooltip opacity |
| `--bs-tooltip-arrow-width` | `0.8rem` | Arrow width |
| `--bs-tooltip-arrow-height` | `0.4rem` | Arrow height |

### Popover (`--bs-popover-*`)

Defined on `.popover {}` in `_popover.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-popover-zindex` | `1070` | Popover stacking z-index |
| `--bs-popover-max-width` | `276px` | Maximum popover width |
| `--bs-popover-font-size` | `0.875rem` | Popover font size |
| `--bs-popover-bg` | `var(--bs-body-bg)` | Popover background |
| `--bs-popover-border-width` | `var(--bs-border-width)` | Popover border width |
| `--bs-popover-border-color` | `var(--bs-border-color-translucent)` | Popover border color |
| `--bs-popover-border-radius` | `var(--bs-border-radius-lg)` | Popover rounding |
| `--bs-popover-inner-border-radius` | `calc(var(--bs-border-radius-lg) - var(--bs-border-width))` | Inner element rounding |
| `--bs-popover-box-shadow` | `var(--bs-box-shadow)` | Popover drop shadow |
| `--bs-popover-header-padding-x` | `1rem` | Header horizontal padding |
| `--bs-popover-header-padding-y` | `0.5rem` | Header vertical padding |
| `--bs-popover-header-font-size` | `1rem` | Header font size |
| `--bs-popover-header-color` | `inherit` | Header text color |
| `--bs-popover-header-bg` | `var(--bs-secondary-bg)` | Header background |
| `--bs-popover-body-padding-x` | `1rem` | Body horizontal padding |
| `--bs-popover-body-padding-y` | `1rem` | Body vertical padding |
| `--bs-popover-body-color` | `var(--bs-body-color)` | Body text color |
| `--bs-popover-arrow-width` | `1rem` | Arrow width |
| `--bs-popover-arrow-height` | `0.5rem` | Arrow height |
| `--bs-popover-arrow-border` | `var(--bs-popover-border-color)` | Arrow border color |

### Spinner (`--bs-spinner-*`)

Defined on `.spinner-border` / `.spinner-grow` in `_spinners.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-spinner-width` | `2rem` | Spinner size (width) |
| `--bs-spinner-height` | `2rem` | Spinner size (height) |
| `--bs-spinner-vertical-align` | `-0.125em` | Vertical alignment offset |
| `--bs-spinner-border-width` | `0.25em` | Border-spinner ring width |
| `--bs-spinner-animation-speed` | `0.75s` | Rotation speed |
| `--bs-spinner-animation-name` | `spinner-border` or `spinner-grow` | Keyframe animation name |

> `.spinner-border-sm` / `.spinner-grow-sm` override `--bs-spinner-width`, `--bs-spinner-height`, and `--bs-spinner-border-width`.

### Offcanvas (`--bs-offcanvas-*`)

Defined on `.offcanvas {}` in `_offcanvas.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-offcanvas-zindex` | `1045` | Offcanvas z-index |
| `--bs-offcanvas-width` | `400px` | Default width (side panels) |
| `--bs-offcanvas-height` | `30vh` | Default height (top/bottom panels) |
| `--bs-offcanvas-padding-x` | `1rem` | Horizontal padding |
| `--bs-offcanvas-padding-y` | `1rem` | Vertical padding |
| `--bs-offcanvas-color` | `var(--bs-body-color)` | Content text color |
| `--bs-offcanvas-bg` | `var(--bs-body-bg)` | Panel background |
| `--bs-offcanvas-border-width` | `var(--bs-border-width)` | Edge border width |
| `--bs-offcanvas-border-color` | `var(--bs-border-color-translucent)` | Edge border color |
| `--bs-offcanvas-box-shadow` | `var(--bs-box-shadow-sm)` | Panel shadow |
| `--bs-offcanvas-transition` | `transform 0.3s ease-in-out` | Slide-in transition |
| `--bs-offcanvas-title-line-height` | `1.5` | Title line height |

### Table (`--bs-table-*`)

Defined on `.table {}` in `_tables.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-table-color-type` | `initial` | Type-based cell color (used for striping) |
| `--bs-table-bg-type` | `initial` | Type-based cell background |
| `--bs-table-color-state` | `initial` | State-based cell color (hover/active) |
| `--bs-table-bg-state` | `initial` | State-based cell background |
| `--bs-table-color` | `var(--bs-emphasis-color)` | Default cell text |
| `--bs-table-bg` | `var(--bs-body-bg)` | Default cell background |
| `--bs-table-border-color` | `var(--bs-border-color)` | Row/cell border color |
| `--bs-table-accent-bg` | `transparent` | Accent overlay (legacy) |
| `--bs-table-striped-color` | `var(--bs-emphasis-color)` | Striped row text |
| `--bs-table-striped-bg` | `rgba(var(--bs-emphasis-color-rgb), 0.05)` | Striped row background |
| `--bs-table-active-color` | `var(--bs-emphasis-color)` | Active row text |
| `--bs-table-active-bg` | `rgba(var(--bs-emphasis-color-rgb), 0.1)` | Active row background |
| `--bs-table-hover-color` | `var(--bs-emphasis-color)` | Hover row text |
| `--bs-table-hover-bg` | `rgba(var(--bs-emphasis-color-rgb), 0.075)` | Hover row background |

### Button Close (`--bs-btn-close-*`)

Defined on `.btn-close {}` in `_close.scss`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-btn-close-color` | `#000` | Close icon color |
| `--bs-btn-close-bg` | Inline SVG × icon | Close icon image |
| `--bs-btn-close-opacity` | `0.5` | Default opacity |
| `--bs-btn-close-hover-opacity` | `0.75` | Hover opacity |
| `--bs-btn-close-focus-shadow` | `0 0 0 0.25rem rgba(13,110,253,.25)` | Focus ring |
| `--bs-btn-close-focus-opacity` | `1` | Focused opacity |
| `--bs-btn-close-disabled-opacity` | `0.25` | Disabled opacity |
| `--bs-btn-close-filter` | *(empty for light; `invert(1) grayscale(100%) brightness(200%)` for dark)* | Dark-mode inversion filter |

---

## 11. Layout Tokens

### Grid Gutters (`--bs-gutter-*`)

Set on row/column elements. Not defined at `:root`.

| CSS property | Default value | Purpose |
|---|---|---|
| `--bs-gutter-x` | `1.5rem` | Horizontal gutter between columns |
| `--bs-gutter-y` | `0` | Vertical gutter (wrapping rows) |

> Override via `.g-*`, `.gx-*`, `.gy-*` utility classes (0 / 0.25rem / 0.5rem / 1rem / 1.5rem / 3rem).

### Breakpoints (`--bs-breakpoint-*`)

Defined on `.container {}` — informational only, not consumed by CSS calc.

| CSS property | Value |
|---|---|
| `--bs-breakpoint-xs` | `0` |
| `--bs-breakpoint-sm` | `576px` |
| `--bs-breakpoint-md` | `768px` |
| `--bs-breakpoint-lg` | `992px` |
| `--bs-breakpoint-xl` | `1200px` |
| `--bs-breakpoint-xxl` | `1400px` |

---

## Dark Mode Overrides

Bootstrap 5.3 supports dark mode via `[data-bs-theme="dark"]`. In dark mode the following root tokens are overridden. Key changed values:

| Token | Dark mode value | Notes |
|---|---|---|
| `--bs-body-color` | `#dee2e6` | Light text on dark |
| `--bs-body-bg` | `#212529` | Dark background |
| `--bs-emphasis-color` | `#fff` | Max contrast text |
| `--bs-secondary-color` | `rgba(222,226,230,.75)` | Muted light text |
| `--bs-secondary-bg` | `#343a40` | Slightly lighter than bg |
| `--bs-tertiary-color` | `rgba(222,226,230,.5)` | Very muted light text |
| `--bs-tertiary-bg` | `#2b3035` | Dark tertiary surface |
| `--bs-border-color` | `#495057` | Gray-700 border on dark |
| `--bs-border-color-translucent` | `rgba(255,255,255,.15)` | White-based translucent border |
| `--bs-form-valid-color` | `#75b798` | Light green for dark bg |
| `--bs-form-valid-border-color` | `#75b798` | — |
| `--bs-form-invalid-color` | `#ea868f` | Light red for dark bg |
| `--bs-form-invalid-border-color` | `#ea868f` | — |
| `--bs-link-color` | `#6ea8fe` | Lighter blue link |
| `--bs-link-hover-color` | `#8bb9fe` | Even lighter on hover |
| `--bs-code-color` | `#e685b5` | Lighter pink code |
| `--bs-highlight-bg` | `#664d03` | Dark yellow highlight |
| `--bs-*-text-emphasis` | Lighter tints | Per-theme-color (e.g. `#6ea8fe` for primary) |
| `--bs-*-bg-subtle` | Darker shades | Per-theme-color (e.g. `#031633` for primary) |
| `--bs-*-border-subtle` | Mid-dark shades | Per-theme-color (e.g. `#084298` for primary) |

Component-level dark mode: `.dropdown-menu-dark` overrides `--bs-dropdown-*` tokens directly. `.navbar-dark` overrides `--bs-navbar-*` tokens.
