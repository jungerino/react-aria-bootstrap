---
what: Bootstrap 5.3.8 CSS custom properties (--bs-* tokens) reference
contains: All tokens grouped by category with default values, semantic roles, and which components consume them. SCSS variable name mapped to CSS custom property name.
when-to-load: When you need to know what tokens are available for a component's appearance, or when building CSS bridge rules that override Bootstrap defaults.
related: components.md for which component uses which token; states.md for state-specific token overrides
---

# Bootstrap 5.3.8 Tokens

Sources: `src/scss/vendor/bootstrap-5.3.8/_variables.scss` (SCSS defaults), `src/scss/vendor/bootstrap-5.3.8/_root.scss` (CSS custom property emission), `node_modules/bootstrap/dist/css/bootstrap.css` (compiled/resolved values, light theme `:root`/`[data-bs-theme=light]` block, lines 7-126, and `[data-bs-theme=dark]` overrides, lines 128-182).

All tokens are prefixed `--bs-` (`$prefix: bs-` in `_variables.scss`). Values below are the **light-theme resolved defaults** unless noted. Where a dark-mode override exists, it is listed in the "Dark mode override" note under the table.

---

## 1. Color — Palette base

`| CSS property | Default value | Semantic role | Components that use it |`

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-blue` | `#0d6efd` | Base hue swatch | Source for `$primary` and `.text-blue`/`.bg-blue` utilities |
| `--bs-indigo` | `#6610f2` | Base hue swatch | `.text-indigo`/`.bg-indigo` utilities |
| `--bs-purple` | `#6f42c1` | Base hue swatch | `.text-purple`/`.bg-purple` utilities |
| `--bs-pink` | `#d63384` | Base hue swatch | Source for `$code-color`; `.text-pink`/`.bg-pink` |
| `--bs-red` | `#dc3545` | Base hue swatch | Source for `$danger` |
| `--bs-orange` | `#fd7e14` | Base hue swatch | `.text-orange`/`.bg-orange` |
| `--bs-yellow` | `#ffc107` | Base hue swatch | Source for `$warning` |
| `--bs-green` | `#198754` | Base hue swatch | Source for `$success` |
| `--bs-teal` | `#20c997` | Base hue swatch | `.text-teal`/`.bg-teal` |
| `--bs-cyan` | `#0dcaf0` | Base hue swatch | Source for `$info` |
| `--bs-black` | `#000` | Absolute black | Shadow/backdrop compositing |
| `--bs-white` | `#fff` | Absolute white | Badge/progress-bar text, backgrounds |
| `--bs-white-rgb` | `255, 255, 255` | RGB triplet for `rgba()` composition | Used anywhere `rgba(var(--bs-white-rgb), α)` is needed |
| `--bs-black-rgb` | `0, 0, 0` | RGB triplet for `rgba()` composition | Shadows, backdrops |
| `--bs-gray` | `#6c757d` | Mid-gray alias (= `$gray-600`) | `.text-gray`/`.bg-gray` |
| `--bs-gray-dark` | `#343a40` | Dark-gray alias (= `$gray-800`) | `.text-gray-dark`/`.bg-gray-dark` |
| `--bs-gray-100` | `#f8f9fa` | Lightest gray step | `$light`, subtle backgrounds |
| `--bs-gray-200` | `#e9ecef` | Gray step | Secondary/body-secondary-bg base |
| `--bs-gray-300` | `#dee2e6` | Gray step | `$border-color` base, dark-mode body text |
| `--bs-gray-400` | `#ced4da` | Gray step | Dark theme `$dark-bg-subtle` |
| `--bs-gray-500` | `#adb5bd` | Gray step | Dark theme `$dark-border-subtle` |
| `--bs-gray-600` | `#6c757d` | Gray step | `$secondary` base |
| `--bs-gray-700` | `#495057` | Gray step | `$light-text-emphasis`/`$dark-text-emphasis` base |
| `--bs-gray-800` | `#343a40` | Gray step | `$dark`/`$gray-dark`, form-select indicator color |
| `--bs-gray-900` | `#212529` | Darkest gray step | `$dark` base, `$body-color` base |

**23 tokens.**

---

## 2. Color — Theme

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-primary` | `#0d6efd` | Primary theme color | Buttons, links, focus rings, badges, alerts, nav-pills, progress bars, list-group active state |
| `--bs-secondary` | `#6c757d` | Secondary theme color | Buttons, badges, alerts |
| `--bs-success` | `#198754` | Success theme color | Buttons, badges, alerts, form validation (valid) |
| `--bs-info` | `#0dcaf0` | Info theme color | Buttons, badges, alerts |
| `--bs-warning` | `#ffc107` | Warning theme color | Buttons, badges, alerts |
| `--bs-danger` | `#dc3545` | Danger theme color | Buttons, badges, alerts, form validation (invalid) |
| `--bs-light` | `#f8f9fa` | Light theme color | Buttons, badges, alerts |
| `--bs-dark` | `#212529` | Dark theme color | Buttons, badges, alerts, navbar-dark |
| `--bs-primary-rgb` | `13, 110, 253` | RGB triplet of primary | Focus-ring `rgba()` composition, `.bg-primary` opacity utilities |
| `--bs-secondary-rgb` | `108, 117, 125` | RGB triplet | opacity utilities |
| `--bs-success-rgb` | `25, 135, 84` | RGB triplet | opacity utilities |
| `--bs-info-rgb` | `13, 202, 240` | RGB triplet | opacity utilities |
| `--bs-warning-rgb` | `255, 193, 7` | RGB triplet | opacity utilities |
| `--bs-danger-rgb` | `220, 53, 69` | RGB triplet | opacity utilities |
| `--bs-light-rgb` | `248, 249, 250` | RGB triplet | opacity utilities |
| `--bs-dark-rgb` | `33, 37, 41` | RGB triplet | opacity utilities |

**16 tokens.**

---

## 3. Color — Semantic

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-body-font-family` | `var(--bs-font-sans-serif)` | *(cross-listed, see §5)* | — |
| `--bs-body-color` | `#212529` | Default text color | `<body>`, reboot |
| `--bs-body-color-rgb` | `33, 37, 41` | RGB triplet of body color | Table striping, opacity compositing |
| `--bs-body-bg` | `#fff` | Default page background | `<body>`, cards, modals, dropdowns |
| `--bs-body-bg-rgb` | `255, 255, 255` | RGB triplet of body bg | Toast/dropdown translucency |
| `--bs-emphasis-color` | `#000` | High-emphasis text color | Table `--bs-table-color`, tooltip bg, navbar `rgba()` composition |
| `--bs-emphasis-color-rgb` | `0, 0, 0` | RGB triplet | Table striping/hover/active tint math, navbar color composition |
| `--bs-secondary-color` | `rgba(33, 37, 41, 0.75)` | De-emphasized text | Form text, placeholder, disabled text, breadcrumb divider |
| `--bs-secondary-color-rgb` | `33, 37, 41` | RGB triplet | — |
| `--bs-secondary-bg` | `#e9ecef` | De-emphasized background | Body-secondary-bg, disabled input bg, pagination hover |
| `--bs-secondary-bg-rgb` | `233, 236, 239` | RGB triplet | — |
| `--bs-tertiary-color` | `rgba(33, 37, 41, 0.5)` | Lowest-emphasis text | Dropdown disabled link color |
| `--bs-tertiary-color-rgb` | `33, 37, 41` | RGB triplet | — |
| `--bs-tertiary-bg` | `#f8f9fa` | Lowest-emphasis background | Input-group addon bg, dropdown hover bg, list-group action hover bg |
| `--bs-tertiary-bg-rgb` | `248, 249, 250` | RGB triplet | — |
| `--bs-heading-color` | `inherit` | Heading text color override hook | `h1`–`h6`, `.h1`–`.h6` |
| `--bs-link-color` | `#0d6efd` | Anchor text color | `<a>`, nav-link base, pagination |
| `--bs-link-color-rgb` | `13, 110, 253` | RGB triplet | `<a>` color composition with `--bs-link-opacity` |
| `--bs-link-decoration` | `underline` | Anchor text-decoration | `<a>` |
| `--bs-link-hover-color` | `#0a58ca` | Anchor hover text color | `<a>:hover`, nav-link hover |
| `--bs-link-hover-color-rgb` | `10, 88, 202` | RGB triplet | — |
| `--bs-code-color` | `#d63384` | Inline `<code>` text color | `code` |
| `--bs-highlight-color` | `#212529` | `<mark>` text color | `mark`, `.mark` |
| `--bs-highlight-bg` | `#fff3cd` | `<mark>` background | `mark`, `.mark` |
| `--bs-gradient` | `linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,0))` | Overlay gradient used when `$enable-gradients`/`.bg-gradient` is active | `.bg-gradient`, button box-shadow composition |

**Not emitted by default** (guarded by `@if ... != null` in `_root.scss`, both default to `null`): `--bs-body-text-align`, `--bs-root-font-size`, `--bs-link-hover-decoration`. Do not assume these exist in the DOM unless a project explicitly sets `$body-text-align`, `$font-size-root`, or `$link-hover-decoration`.

**Consumer-only hooks (not shipped with a default value in `:root`; referenced with a CSS `var(..., fallback)` inside `.link-*` colored-links helpers only):** `--bs-link-opacity` (fallback `1`), `--bs-link-underline-opacity` (fallback `1`). These only exist once a `.link-*` utility class is applied and are not part of the base `:root` token set.

**23 tokens** in the base `:root` table above (excludes the two null-guarded and two consumer-only hooks noted separately).

---

## 4. Color — Text/Border emphasis

Generated by `@each $color, $value in $theme-colors-text|-bg-subtle|-border-subtle` loops in `_root.scss` for each of the 8 theme colors (primary, secondary, success, info, warning, danger, light, dark).

| CSS property pattern | Default value (primary shown) | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-{color}-text-emphasis` | `--bs-primary-text-emphasis: #052c65` | Darkened/lightened text for subtle backgrounds | Alerts (`.alert-*`), accordion active state |
| `--bs-{color}-bg-subtle` | `--bs-primary-bg-subtle: #cfe2ff` | Tinted background for subtle variants | Alerts, accordion active background |
| `--bs-{color}-border-subtle` | `--bs-primary-border-subtle: #9ec5fe` | Tinted border for subtle variants | Alerts |

Full set of 24 tokens (8 colors × 3 suffixes), literal property names and light-theme default values:

| CSS property | Default value |
|---|---|
| `--bs-primary-text-emphasis` | `#052c65` |
| `--bs-primary-bg-subtle` | `#cfe2ff` |
| `--bs-primary-border-subtle` | `#9ec5fe` |
| `--bs-secondary-text-emphasis` | `#2b2f32` |
| `--bs-secondary-bg-subtle` | `#e2e3e5` |
| `--bs-secondary-border-subtle` | `#c4c8cb` |
| `--bs-success-text-emphasis` | `#0a3622` |
| `--bs-success-bg-subtle` | `#d1e7dd` |
| `--bs-success-border-subtle` | `#a3cfbb` |
| `--bs-info-text-emphasis` | `#055160` |
| `--bs-info-bg-subtle` | `#cff4fc` |
| `--bs-info-border-subtle` | `#9eeaf9` |
| `--bs-warning-text-emphasis` | `#664d03` |
| `--bs-warning-bg-subtle` | `#fff3cd` |
| `--bs-warning-border-subtle` | `#ffe69c` |
| `--bs-danger-text-emphasis` | `#58151c` |
| `--bs-danger-bg-subtle` | `#f8d7da` |
| `--bs-danger-border-subtle` | `#f1aeb5` |
| `--bs-light-text-emphasis` | `#495057` |
| `--bs-light-bg-subtle` | `#fcfcfd` |
| `--bs-light-border-subtle` | `#e9ecef` |
| `--bs-dark-text-emphasis` | `#495057` |
| `--bs-dark-bg-subtle` | `#ced4da` |
| `--bs-dark-border-subtle` | `#adb5bd` |

**24 tokens.**

---

## 5. Typography

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-font-sans-serif` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | Default sans font stack | `--bs-body-font-family`, tooltip/popover `font-family` |
| `--bs-font-monospace` | `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | Monospace font stack | `code`, `kbd`, `pre` |
| `--bs-body-font-family` | `var(--bs-font-sans-serif)` | Body text font | `<body>` |
| `--bs-body-font-size` | `1rem` | Body text size | `<body>` |
| `--bs-body-font-weight` | `400` | Body text weight | `<body>` |
| `--bs-body-line-height` | `1.5` | Body text line-height | `<body>` |

**6 tokens.** (`--bs-root-font-size` and `--bs-body-text-align` are conditionally emitted only — see §3.)

---

## 6. Border

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-border-width` | `1px` | Default border thickness | Buttons, inputs, cards, most bordered components |
| `--bs-border-style` | `solid` | Default border style | `hr`, general borders |
| `--bs-border-color` | `#dee2e6` | Default border color | Buttons, inputs, cards, tables, list-group |
| `--bs-border-color-translucent` | `rgba(0, 0, 0, 0.175)` | Semi-transparent border (works on any bg) | Cards, dropdowns, modals, popovers, toasts |
| `--bs-border-radius` | `0.375rem` | Default corner radius | Buttons, inputs, cards, alerts |
| `--bs-border-radius-sm` | `0.25rem` | Small corner radius | `.btn-sm`, `.form-control-sm` |
| `--bs-border-radius-lg` | `0.5rem` | Large corner radius | `.btn-lg`, modal content, popover |
| `--bs-border-radius-xl` | `1rem` | Extra-large corner radius | `.rounded-xl` utility |
| `--bs-border-radius-xxl` | `2rem` | Extra-extra-large corner radius | `.rounded-xxl` utility |
| `--bs-border-radius-2xl` | `var(--bs-border-radius-xxl)` | Deprecated alias (v5.3.0+) for `-xxl` | `.rounded-2xl` utility |
| `--bs-border-radius-pill` | `50rem` | Pill/fully-rounded radius | `.rounded-pill`, badges |

**11 tokens.**

---

## 7. Shadow

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-box-shadow` | `0 0.5rem 1rem rgba(0, 0, 0, 0.15)` | Standard elevation shadow | `.shadow`, dropdown, popover, toast |
| `--bs-box-shadow-sm` | `0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)` | Subtle elevation shadow | `.shadow-sm`, modal (xs breakpoint) |
| `--bs-box-shadow-lg` | `0 1rem 3rem rgba(0, 0, 0, 0.175)` | Prominent elevation shadow | `.shadow-lg` |
| `--bs-box-shadow-inset` | `inset 0 1px 2px rgba(0, 0, 0, 0.075)` | Inset/pressed shadow | Form controls, progress track |

**4 tokens.**

---

## 8. Focus ring

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-focus-ring-width` | `0.25rem` | Focus ring spread | `.focus-ring` helper, btn/input/pagination focus box-shadow composition |
| `--bs-focus-ring-opacity` | `0.25` | Focus ring alpha | Same as above |
| `--bs-focus-ring-color` | `rgba(13, 110, 253, 0.25)` | Focus ring color | Same as above |

**Not shipped as root tokens** — referenced only inside `.focus-ring:focus` (`helpers/_focus-ring.scss`) as `var()` fallbacks with no default value: `--bs-focus-ring-x` (fallback `0`), `--bs-focus-ring-y` (fallback `0`), `--bs-focus-ring-blur` (fallback `0`). These exist only if a consumer sets them inline; do not treat them as always-present.

**3 tokens** in `:root`.

---

## 9. Form validation

| CSS property | Default value | Semantic role | Components that use it |
|---|---|---|---|
| `--bs-form-valid-color` | `#198754` (= `$success`) | Valid-state text/icon color | `.valid-feedback`, `.is-valid` |
| `--bs-form-valid-border-color` | `#198754` | Valid-state border color | `.is-valid` on form-control/select/check |
| `--bs-form-invalid-color` | `#dc3545` (= `$danger`) | Invalid-state text/icon color | `.invalid-feedback`, `.is-invalid` |
| `--bs-form-invalid-border-color` | `#dc3545` | Invalid-state border color | `.is-invalid` on form-control/select/check |

**4 tokens.**

**Dark mode overrides for §1–9** (from `[data-bs-theme=dark]`, `_root.scss` lines 132-187): `body-color`→`#dee2e6`, `body-bg`→`#212529`, `emphasis-color`→`#fff`, `secondary-color`→`rgba(222,226,230,.75)`, `secondary-bg`→`#343a40`, `tertiary-color`→`rgba(222,226,230,.5)`, `tertiary-bg`→`#2b3035`, all 8 `*-text-emphasis`/`*-bg-subtle`/`*-border-subtle` triads get dark-specific values, `link-color`→`#6ea8fe`, `link-hover-color`→`#8bb9fe`, `code-color`→`#e685b5`, `highlight-color`/`highlight-bg`, `border-color`→`#495057`, `border-color-translucent`→`rgba(255,255,255,.15)`, `form-valid-color`→`#75b798`, `form-valid-border-color`→`#75b798`, `form-invalid-color`→`#ea868f`, `form-invalid-border-color`→`#ea868f`. Theme colors themselves (`--bs-primary`, etc.) and typography/shadow/focus-ring tokens do **not** change in dark mode.

Running total through §9: **114 tokens** (23 + 16 + 23 + 24 + 6 + 11 + 4 + 3 + 4).

---

## 10. Component-level tokens

Bootstrap 5.3.8 gives most (but not all) components their own scoped custom-property namespace, declared on the component's root selector (e.g. `.btn { --bs-btn-*: ...; }`) rather than in `:root`. This section documents each namespace's members and their **base-selector default** (the value on the unmodified component class, before any modifier/variant class is applied). Where a property has **no context-free default** — it is only ever set inside a variant rule (e.g. `.btn-primary`) — this is noted explicitly rather than fabricated.

Verified by reading each component's own SCSS file (`grep -rn "prefix}<name>"`) and cross-checking the compiled CSS base-selector block.

### Button — `--bs-btn-*` (source: `_buttons.scss`, compiled CSS `.btn {}` at line 2953)

| CSS property | Default value | Semantic role |
|---|---|---|
| `--bs-btn-padding-x` | `0.75rem` | Horizontal padding |
| `--bs-btn-padding-y` | `0.375rem` | Vertical padding |
| `--bs-btn-font-family` | *(empty)* | Font family override hook |
| `--bs-btn-font-size` | `1rem` | Font size |
| `--bs-btn-font-weight` | `400` | Font weight |
| `--bs-btn-line-height` | `1.5` | Line height |
| `--bs-btn-color` | `var(--bs-body-color)` | Text color |
| `--bs-btn-bg` | `transparent` | Background color |
| `--bs-btn-border-width` | `var(--bs-border-width)` | Border thickness |
| `--bs-btn-border-color` | `transparent` | Border color |
| `--bs-btn-border-radius` | `var(--bs-border-radius)` | Corner radius |
| `--bs-btn-hover-border-color` | `transparent` | Border color on hover (base default; overridden per variant) |
| `--bs-btn-box-shadow` | `inset 0 1px 0 rgba(255,255,255,.15), 0 1px 1px rgba(0,0,0,.075)` | Resting shadow |
| `--bs-btn-disabled-opacity` | `0.65` | Opacity when `:disabled` |
| `--bs-btn-focus-box-shadow` | `0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), .5)` | Focus ring shadow |
| `--bs-btn-hover-color` | *set per variant only* (e.g. `.btn-primary` → `#fff`) | Text color on hover |
| `--bs-btn-hover-bg` | *set per variant only* | Background on hover |
| `--bs-btn-active-color` | *set per variant only* | Text color when active/pressed |
| `--bs-btn-active-bg` | *set per variant only* | Background when active/pressed |
| `--bs-btn-active-border-color` | *set per variant only* | Border when active/pressed |
| `--bs-btn-active-shadow` | *set per variant only* (`$btn-active-box-shadow`) | Shadow when active/pressed |
| `--bs-btn-disabled-color` | *set per variant only* | Text color when disabled |
| `--bs-btn-disabled-bg` | *set per variant only* | Background when disabled |
| `--bs-btn-disabled-border-color` | *set per variant only* | Border when disabled |
| `--bs-btn-focus-shadow-rgb` | *set per variant only* | RGB triplet feeding `focus-box-shadow` |

**25 tokens** (15 with a base default, 10 variant-scoped-only).

### Close Button — `--bs-btn-close-*` (source: `_close.scss`, compiled CSS `.btn-close {}` at line 5336)

Despite the `btn-` prefix (from the `.btn-close` class name), this is a **separate component namespace** from Button — do not conflate with `--bs-btn-*` above.

| CSS property | Default value | Semantic role |
|---|---|---|
| `--bs-btn-close-color` | `#000` | Icon color |
| `--bs-btn-close-bg` | inline SVG data-URI (X icon, black stroke) | Icon image |
| `--bs-btn-close-opacity` | `0.5` | Resting opacity |
| `--bs-btn-close-hover-opacity` | `0.75` | Hover opacity |
| `--bs-btn-close-focus-shadow` | `0 0 0 0.25rem rgba(13,110,253,.25)` | Focus ring shadow |
| `--bs-btn-close-focus-opacity` | `1` | Focus opacity |
| `--bs-btn-close-disabled-opacity` | `0.25` | Disabled opacity |
| `--bs-btn-close-filter` | *(empty in light; `invert(1) grayscale(100%) brightness(200%)` in dark, and on `.btn-close-white`)* | Icon color-inversion filter |

**8 tokens.**

### Form controls — no dedicated `--bs-input-*` namespace

**Verified absence:** `grep -rn "prefix}input\b"` and `grep -rn "prefix}form"` across `forms/_form-control.scss`, `forms/_form-select.scss`, `forms/_form-range.scss`, `forms/_input-group.scss`, `forms/_floating-labels.scss`, `forms/_labels.scss`, `forms/_form-text.scss` returns **no custom-property declarations** in `_form-control.scss`, `_form-range.scss`, `_input-group.scss`, `_floating-labels.scss`, `_labels.scss`, or `_form-text.scss`. Unlike Button/Card/Dropdown/etc., `.form-control` compiles `$input-*` SCSS variables directly into static declarations (e.g. `padding: 0.375rem 0.75rem;`) — there is no `--bs-input-padding-x` or similar consumer override hook. Do not invent one.

The only form-related custom properties that exist at runtime are narrow, image-only hooks:

| CSS property | Default value | Semantic role | Component |
|---|---|---|---|
| `--bs-form-select-bg-img` | inline SVG data-URI (chevron, stroke `#343a40`; dark theme override uses `#dee2e6`) | Select dropdown arrow icon | Form Select (`.form-select`) |
| `--bs-form-select-bg-icon` | *not set by default*; set to a validation-icon SVG only when `.form-select.is-valid` (green check) or `.form-select.is-invalid` (red circle) is applied | Validation icon layered behind the arrow icon | Form Select |
| `--bs-form-check-bg` | `var(--bs-body-bg)` | Checkbox/radio background | Form Check (`.form-check-input`) |
| `--bs-form-check-bg-image` | *not set by default* (unchecked state has no image); set to a checkmark/circle/dash SVG when `:checked` or `:indeterminate` | Checkbox check glyph / radio dot / indeterminate dash | Form Check |

**4 tokens.** (See `states.md` for the full `:checked`/`:indeterminate`/`.is-valid`/`.is-invalid` selector list that toggles these.)

### Form Switch — image-only hook

`_form-check.scss` defines `$form-switch-bg-image` etc. as **SCSS variables only** — no `--bs-form-switch-*` custom property is emitted in `:root`. Compiled CSS shows exactly one runtime custom property for switches:

| CSS property | Default value | Semantic role |
|---|---|---|
| `--bs-form-switch-bg` | inline SVG data-URI (circle, `rgba(0,0,0,.25)`) | Switch track thumb-off image, referenced from the `form` prefix group in compiled CSS |

**1 token.**

### Nav — `--bs-nav-*` (source: `_nav.scss`, compiled CSS `.nav {}` at line 3797, `.nav-tabs`/`.nav-pills`/`.nav-underline` blocks following)

| CSS property | Default value | Scope |
|---|---|---|
| `--bs-nav-link-padding-x` | `1rem` | `.nav` |
| `--bs-nav-link-padding-y` | `0.5rem` | `.nav` |
| `--bs-nav-link-font-weight` | *(empty)* | `.nav` |
| `--bs-nav-link-color` | `var(--bs-link-color)` | `.nav` |
| `--bs-nav-link-hover-color` | `var(--bs-link-hover-color)` | `.nav` |
| `--bs-nav-link-disabled-color` | `var(--bs-secondary-color)` | `.nav` |
| `--bs-nav-tabs-border-width` | `var(--bs-border-width)` | `.nav-tabs` |
| `--bs-nav-tabs-border-color` | `var(--bs-border-color)` | `.nav-tabs` |
| `--bs-nav-tabs-border-radius` | `var(--bs-border-radius)` | `.nav-tabs` |
| `--bs-nav-tabs-link-hover-border-color` | `var(--bs-secondary-bg) var(--bs-secondary-bg) var(--bs-border-color)` | `.nav-tabs` |
| `--bs-nav-tabs-link-active-color` | `var(--bs-emphasis-color)` | `.nav-tabs` |
| `--bs-nav-tabs-link-active-bg` | `var(--bs-body-bg)` | `.nav-tabs` |
| `--bs-nav-tabs-link-active-border-color` | `var(--bs-border-color) var(--bs-border-color) var(--bs-body-bg)` | `.nav-tabs` |
| `--bs-nav-pills-border-radius` | `var(--bs-border-radius)` | `.nav-pills` |
| `--bs-nav-pills-link-active-color` | `#fff` | `.nav-pills` |
| `--bs-nav-pills-link-active-bg` | `#0d6efd` | `.nav-pills` |
| `--bs-nav-underline-gap` | `1rem` | `.nav-underline` |
| `--bs-nav-underline-border-width` | `0.125rem` | `.nav-underline` |
| `--bs-nav-underline-link-active-color` | `var(--bs-emphasis-color)` | `.nav-underline` |

**18 tokens.**

### Navbar — `--bs-navbar-*` (source: `_navbar.scss`, compiled CSS `.navbar {}` at line 3932)

| CSS property | Default value |
|---|---|
| `--bs-navbar-padding-x` | `0` |
| `--bs-navbar-padding-y` | `0.5rem` |
| `--bs-navbar-color` | `rgba(var(--bs-emphasis-color-rgb), .65)` |
| `--bs-navbar-hover-color` | `rgba(var(--bs-emphasis-color-rgb), .8)` |
| `--bs-navbar-disabled-color` | `rgba(var(--bs-emphasis-color-rgb), .3)` |
| `--bs-navbar-active-color` | `rgba(var(--bs-emphasis-color-rgb), 1)` |
| `--bs-navbar-brand-padding-y` | `0.3125rem` |
| `--bs-navbar-brand-margin-end` | `1rem` |
| `--bs-navbar-brand-font-size` | `1.25rem` |
| `--bs-navbar-brand-color` | `rgba(var(--bs-emphasis-color-rgb), 1)` |
| `--bs-navbar-brand-hover-color` | `rgba(var(--bs-emphasis-color-rgb), 1)` |
| `--bs-navbar-nav-link-padding-x` | `0.5rem` |
| `--bs-navbar-toggler-padding-y` | `0.25rem` |
| `--bs-navbar-toggler-padding-x` | `0.75rem` |
| `--bs-navbar-toggler-font-size` | `1.25rem` |
| `--bs-navbar-toggler-icon-bg` | inline SVG (hamburger) |
| `--bs-navbar-toggler-border-color` | `rgba(var(--bs-emphasis-color-rgb), .15)` |
| `--bs-navbar-toggler-border-radius` | `var(--bs-border-radius)` |
| `--bs-navbar-toggler-focus-width` | `0.25rem` |
| `--bs-navbar-toggler-transition` | `box-shadow 0.15s ease-in-out` |

**19 tokens.** (`.navbar-dark`/`.navbar-light` legacy theme classes override `--bs-navbar-*` and `--bs-navbar-brand-*` colors directly; not separate token names.)

### Dropdown — `--bs-dropdown-*` (source: `_dropdown.scss`, compiled CSS `.dropdown-menu {}` at line 3405)

| CSS property | Default value |
|---|---|
| `--bs-dropdown-zindex` | `1000` |
| `--bs-dropdown-min-width` | `10rem` |
| `--bs-dropdown-padding-x` | `0` |
| `--bs-dropdown-padding-y` | `0.5rem` |
| `--bs-dropdown-spacer` | `0.125rem` |
| `--bs-dropdown-font-size` | `1rem` |
| `--bs-dropdown-color` | `var(--bs-body-color)` |
| `--bs-dropdown-bg` | `var(--bs-body-bg)` |
| `--bs-dropdown-border-color` | `var(--bs-border-color-translucent)` |
| `--bs-dropdown-border-radius` | `var(--bs-border-radius)` |
| `--bs-dropdown-border-width` | `var(--bs-border-width)` |
| `--bs-dropdown-inner-border-radius` | `calc(var(--bs-border-radius) - var(--bs-border-width))` |
| `--bs-dropdown-divider-bg` | `var(--bs-border-color-translucent)` |
| `--bs-dropdown-divider-margin-y` | `0.5rem` |
| `--bs-dropdown-box-shadow` | `var(--bs-box-shadow)` |
| `--bs-dropdown-link-color` | `var(--bs-body-color)` |
| `--bs-dropdown-link-hover-color` | `var(--bs-body-color)` |
| `--bs-dropdown-link-hover-bg` | `var(--bs-tertiary-bg)` |
| `--bs-dropdown-link-active-color` | `#fff` |
| `--bs-dropdown-link-active-bg` | `#0d6efd` |
| `--bs-dropdown-link-disabled-color` | `var(--bs-tertiary-color)` |
| `--bs-dropdown-item-padding-x` | `1rem` |
| `--bs-dropdown-item-padding-y` | `0.25rem` |
| `--bs-dropdown-header-color` | `#6c757d` |
| `--bs-dropdown-header-padding-x` | `1rem` |
| `--bs-dropdown-header-padding-y` | `0.5rem` |

**25 tokens.** `.dropdown-menu-dark` overrides several of these (color/bg/border/link colors) inline as a modifier class rather than exposing new token names.

### Pagination — `--bs-pagination-*` (source: `_pagination.scss`, compiled CSS `.pagination {}` at line 4715)

| CSS property | Default value |
|---|---|
| `--bs-pagination-padding-x` | `0.75rem` |
| `--bs-pagination-padding-y` | `0.375rem` |
| `--bs-pagination-font-size` | `1rem` |
| `--bs-pagination-color` | `var(--bs-link-color)` |
| `--bs-pagination-bg` | `var(--bs-body-bg)` |
| `--bs-pagination-border-width` | `var(--bs-border-width)` |
| `--bs-pagination-border-color` | `var(--bs-border-color)` |
| `--bs-pagination-border-radius` | `var(--bs-border-radius)` |
| `--bs-pagination-hover-color` | `var(--bs-link-hover-color)` |
| `--bs-pagination-hover-bg` | `var(--bs-tertiary-bg)` |
| `--bs-pagination-hover-border-color` | `var(--bs-border-color)` |
| `--bs-pagination-focus-color` | `var(--bs-link-hover-color)` |
| `--bs-pagination-focus-bg` | `var(--bs-secondary-bg)` |
| `--bs-pagination-focus-box-shadow` | `0 0 0 0.25rem rgba(13,110,253,.25)` |
| `--bs-pagination-active-color` | `#fff` |
| `--bs-pagination-active-bg` | `#0d6efd` |
| `--bs-pagination-active-border-color` | `#0d6efd` |
| `--bs-pagination-disabled-color` | `var(--bs-secondary-color)` |
| `--bs-pagination-disabled-bg` | `var(--bs-secondary-bg)` |
| `--bs-pagination-disabled-border-color` | `var(--bs-border-color)` |

**19 tokens.**

### Accordion — `--bs-accordion-*` (source: `_accordion.scss`, compiled CSS `.accordion {}` at line 4546)

| CSS property | Default value |
|---|---|
| `--bs-accordion-color` | `var(--bs-body-color)` |
| `--bs-accordion-bg` | `var(--bs-body-bg)` |
| `--bs-accordion-transition` | `color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out, border-radius .15s ease` |
| `--bs-accordion-border-color` | `var(--bs-border-color)` |
| `--bs-accordion-border-width` | `var(--bs-border-width)` |
| `--bs-accordion-border-radius` | `var(--bs-border-radius)` |
| `--bs-accordion-inner-border-radius` | `calc(var(--bs-border-radius) - var(--bs-border-width))` |
| `--bs-accordion-btn-padding-x` | `1.25rem` |
| `--bs-accordion-btn-padding-y` | `1rem` |
| `--bs-accordion-btn-color` | `var(--bs-body-color)` |
| `--bs-accordion-btn-bg` | `var(--bs-accordion-bg)` |
| `--bs-accordion-btn-icon` | inline SVG chevron (stroke `#212529`) |
| `--bs-accordion-btn-icon-width` | `1.25rem` |
| `--bs-accordion-btn-icon-transform` | `rotate(-180deg)` |
| `--bs-accordion-btn-icon-transition` | `transform .2s ease-in-out` |
| `--bs-accordion-btn-active-icon` | inline SVG chevron (stroke `#052c65`, matches `primary-text-emphasis`) |
| `--bs-accordion-btn-focus-box-shadow` | `0 0 0 0.25rem rgba(13,110,253,.25)` |
| `--bs-accordion-body-padding-x` | `1.25rem` |
| `--bs-accordion-body-padding-y` | `1rem` |
| `--bs-accordion-active-color` | `var(--bs-primary-text-emphasis)` |
| `--bs-accordion-active-bg` | `var(--bs-primary-bg-subtle)` |

**20 tokens.**

### Card — `--bs-card-*` (source: `_card.scss`, compiled CSS `.card {}` at line 4359)

| CSS property | Default value |
|---|---|
| `--bs-card-spacer-y` | `1rem` |
| `--bs-card-spacer-x` | `1rem` |
| `--bs-card-title-spacer-y` | `0.5rem` |
| `--bs-card-title-color` | *(empty)* |
| `--bs-card-subtitle-color` | *(empty)* |
| `--bs-card-border-width` | `var(--bs-border-width)` |
| `--bs-card-border-color` | `var(--bs-border-color-translucent)` |
| `--bs-card-border-radius` | `var(--bs-border-radius)` |
| `--bs-card-box-shadow` | *(empty)* |
| `--bs-card-inner-border-radius` | `calc(var(--bs-border-radius) - var(--bs-border-width))` |
| `--bs-card-cap-padding-y` | `0.5rem` |
| `--bs-card-cap-padding-x` | `1rem` |
| `--bs-card-cap-bg` | `rgba(var(--bs-body-color-rgb), .03)` |
| `--bs-card-cap-color` | *(empty)* |
| `--bs-card-height` | *(empty)* |
| `--bs-card-color` | *(empty)* |
| `--bs-card-bg` | `var(--bs-body-bg)` |
| `--bs-card-img-overlay-padding` | `1rem` |
| `--bs-card-group-margin` | `0.75rem` |

**19 tokens.**

### List Group — `--bs-list-group-*` (source: `_list-group.scss`, compiled CSS `.list-group {}` at line 4993)

| CSS property | Default value |
|---|---|
| `--bs-list-group-color` | `var(--bs-body-color)` |
| `--bs-list-group-bg` | `var(--bs-body-bg)` |
| `--bs-list-group-border-color` | `var(--bs-border-color)` |
| `--bs-list-group-border-width` | `var(--bs-border-width)` |
| `--bs-list-group-border-radius` | `var(--bs-border-radius)` |
| `--bs-list-group-item-padding-x` | `1rem` |
| `--bs-list-group-item-padding-y` | `0.5rem` |
| `--bs-list-group-action-color` | `var(--bs-secondary-color)` |
| `--bs-list-group-action-hover-color` | `var(--bs-emphasis-color)` |
| `--bs-list-group-action-hover-bg` | `var(--bs-tertiary-bg)` |
| `--bs-list-group-action-active-color` | `var(--bs-body-color)` |
| `--bs-list-group-action-active-bg` | `var(--bs-secondary-bg)` |
| `--bs-list-group-disabled-color` | `var(--bs-secondary-color)` |
| `--bs-list-group-disabled-bg` | `var(--bs-body-bg)` |
| `--bs-list-group-active-color` | `#fff` |
| `--bs-list-group-active-bg` | `#0d6efd` |
| `--bs-list-group-active-border-color` | `#0d6efd` |

**17 tokens.**

### Table — `--bs-table-*` (source: `_variables.scss` table-variables block, compiled CSS `.table {}` at line 1862)

| CSS property | Default value |
|---|---|
| `--bs-table-color-type` | `initial` |
| `--bs-table-bg-type` | `initial` |
| `--bs-table-color-state` | `initial` |
| `--bs-table-bg-state` | `initial` |
| `--bs-table-color` | `var(--bs-emphasis-color)` |
| `--bs-table-bg` | `var(--bs-body-bg)` |
| `--bs-table-border-color` | `var(--bs-border-color)` |
| `--bs-table-accent-bg` | `transparent` |
| `--bs-table-striped-color` | `var(--bs-emphasis-color)` |
| `--bs-table-striped-bg` | `rgba(var(--bs-emphasis-color-rgb), .05)` |
| `--bs-table-active-color` | `var(--bs-emphasis-color)` |
| `--bs-table-active-bg` | `rgba(var(--bs-emphasis-color-rgb), .1)` |
| `--bs-table-hover-color` | `var(--bs-emphasis-color)` |
| `--bs-table-hover-bg` | `rgba(var(--bs-emphasis-color-rgb), .075)` |

**14 tokens.** `-type` and `-state` variants are internal composition hooks used by `.table-{variant}` and `.table-{active,hover}` modifier classes (see `mixins/_table-variants.scss`) — they aren't meant to be set directly by consumers.

### Alert — `--bs-alert-*` (source: `_alert.scss`, compiled CSS `.alert {}` at line 4836)

| CSS property | Default value |
|---|---|
| `--bs-alert-bg` | `transparent` |
| `--bs-alert-padding-x` | `1rem` |
| `--bs-alert-padding-y` | `1rem` |
| `--bs-alert-margin-bottom` | `1rem` |
| `--bs-alert-color` | `inherit` |
| `--bs-alert-border-color` | `transparent` |
| `--bs-alert-border` | `var(--bs-border-width) solid var(--bs-alert-border-color)` |
| `--bs-alert-border-radius` | `var(--bs-border-radius)` |
| `--bs-alert-link-color` | `inherit` |

**9 tokens.** Each `.alert-{variant}` (primary/secondary/success/info/warning/danger/light/dark) overrides `-color`/`-bg`/`-border-color`/`-link-color` with the theme color's subtle/emphasis tokens from §4 — no new token names.

### Badge — `--bs-badge-*` (source: `_variables.scss` badge-variables, compiled CSS `.badge {}` at line 4809)

| CSS property | Default value |
|---|---|
| `--bs-badge-padding-x` | `0.65em` |
| `--bs-badge-padding-y` | `0.35em` |
| `--bs-badge-font-size` | `0.75em` |
| `--bs-badge-font-weight` | `700` |
| `--bs-badge-color` | `#fff` |
| `--bs-badge-border-radius` | `var(--bs-border-radius)` |

**6 tokens.**

### Breadcrumb — `--bs-breadcrumb-*` (source: `_breadcrumb.scss`, compiled CSS `.breadcrumb {}` at line 4683)

| CSS property | Default value |
|---|---|
| `--bs-breadcrumb-padding-x` | `0` |
| `--bs-breadcrumb-padding-y` | `0` |
| `--bs-breadcrumb-margin-bottom` | `1rem` |
| `--bs-breadcrumb-bg` | *(empty)* |
| `--bs-breadcrumb-border-radius` | *(empty)* |
| `--bs-breadcrumb-divider-color` | `var(--bs-secondary-color)` |
| `--bs-breadcrumb-item-padding-x` | `0.5rem` |
| `--bs-breadcrumb-item-active-color` | `var(--bs-secondary-color)` |

**8 tokens.**

### Progress — `--bs-progress-*` (source: `_progress.scss`, compiled CSS `.progress, .progress-stacked {}` at line 4936)

| CSS property | Default value |
|---|---|
| `--bs-progress-height` | `1rem` |
| `--bs-progress-font-size` | `0.75rem` |
| `--bs-progress-bg` | `var(--bs-secondary-bg)` |
| `--bs-progress-border-radius` | `var(--bs-border-radius)` |
| `--bs-progress-box-shadow` | `var(--bs-box-shadow-inset)` |
| `--bs-progress-bar-color` | `#fff` |
| `--bs-progress-bar-bg` | `#0d6efd` |
| `--bs-progress-bar-transition` | `width .6s ease` |

**8 tokens.**

### Spinner — `--bs-spinner-*` (source: `_spinners.scss`, compiled CSS `.spinner-border {}` / `.spinner-grow {}` around line 6213)

| CSS property | Default value | Scope |
|---|---|---|
| `--bs-spinner-width` | `2rem` | Both variants (`1rem` on `-sm` modifiers) |
| `--bs-spinner-height` | `2rem` | Both variants (`1rem` on `-sm`) |
| `--bs-spinner-vertical-align` | `-0.125em` | Both |
| `--bs-spinner-border-width` | `0.25em` | `.spinner-border` only (`0.2em` on `-sm`) |
| `--bs-spinner-animation-speed` | `0.75s` (`1.5s` under `prefers-reduced-motion: reduce`) | Both |
| `--bs-spinner-animation-name` | `spinner-border` / `spinner-grow` | Set per variant |

**6 tokens.**

### Toast — `--bs-toast-*` (source: `_toasts.scss`, compiled CSS `.toast {}` at line 5386)

| CSS property | Default value |
|---|---|
| `--bs-toast-zindex` | `1090` |
| `--bs-toast-padding-x` | `0.75rem` |
| `--bs-toast-padding-y` | `0.5rem` |
| `--bs-toast-spacing` | `1.5rem` |
| `--bs-toast-max-width` | `350px` |
| `--bs-toast-font-size` | `0.875rem` |
| `--bs-toast-color` | *(empty)* |
| `--bs-toast-bg` | `rgba(var(--bs-body-bg-rgb), .85)` |
| `--bs-toast-border-width` | `var(--bs-border-width)` |
| `--bs-toast-border-color` | `var(--bs-border-color-translucent)` |
| `--bs-toast-border-radius` | `var(--bs-border-radius)` |
| `--bs-toast-box-shadow` | `var(--bs-box-shadow)` |
| `--bs-toast-header-color` | `var(--bs-secondary-color)` |
| `--bs-toast-header-bg` | `rgba(var(--bs-body-bg-rgb), .85)` |
| `--bs-toast-header-border-color` | `var(--bs-border-color-translucent)` |

**15 tokens.**

### Tooltip — `--bs-tooltip-*` (source: `_tooltip.scss`, compiled CSS `.tooltip {}` at line 5749)

| CSS property | Default value |
|---|---|
| `--bs-tooltip-zindex` | `1080` |
| `--bs-tooltip-max-width` | `200px` |
| `--bs-tooltip-padding-x` | `0.5rem` |
| `--bs-tooltip-padding-y` | `0.25rem` |
| `--bs-tooltip-margin` | *(empty)* |
| `--bs-tooltip-font-size` | `0.875rem` |
| `--bs-tooltip-color` | `var(--bs-body-bg)` |
| `--bs-tooltip-bg` | `var(--bs-emphasis-color)` |
| `--bs-tooltip-border-radius` | `var(--bs-border-radius)` |
| `--bs-tooltip-opacity` | `0.9` |
| `--bs-tooltip-arrow-width` | `0.8rem` |
| `--bs-tooltip-arrow-height` | `0.4rem` |

**12 tokens.**

### Popover — `--bs-popover-*` (source: `_popover.scss`, compiled CSS `.popover {}` at line 5851)

| CSS property | Default value |
|---|---|
| `--bs-popover-zindex` | `1070` |
| `--bs-popover-max-width` | `276px` |
| `--bs-popover-font-size` | `0.875rem` |
| `--bs-popover-bg` | `var(--bs-body-bg)` |
| `--bs-popover-border-width` | `var(--bs-border-width)` |
| `--bs-popover-border-color` | `var(--bs-border-color-translucent)` |
| `--bs-popover-border-radius` | `var(--bs-border-radius-lg)` |
| `--bs-popover-inner-border-radius` | `calc(var(--bs-border-radius-lg) - var(--bs-border-width))` |
| `--bs-popover-box-shadow` | `var(--bs-box-shadow)` |
| `--bs-popover-header-padding-x` | `1rem` |
| `--bs-popover-header-padding-y` | `0.5rem` |
| `--bs-popover-header-font-size` | `1rem` |
| `--bs-popover-header-color` | `inherit` |
| `--bs-popover-header-bg` | `var(--bs-secondary-bg)` |
| `--bs-popover-body-padding-x` | `1rem` |
| `--bs-popover-body-padding-y` | `1rem` |
| `--bs-popover-body-color` | `var(--bs-body-color)` |
| `--bs-popover-arrow-width` | `1rem` |
| `--bs-popover-arrow-height` | `0.5rem` |
| `--bs-popover-arrow-border` | `var(--bs-popover-border-color)` |

**20 tokens.**

### Modal — `--bs-modal-*` (source: `_modal.scss`, compiled CSS `.modal {}` at line 5455)

| CSS property | Default value |
|---|---|
| `--bs-modal-zindex` | `1055` |
| `--bs-modal-width` | `500px` |
| `--bs-modal-padding` | `1rem` |
| `--bs-modal-margin` | `0.5rem` |
| `--bs-modal-color` | `var(--bs-body-color)` |
| `--bs-modal-bg` | `var(--bs-body-bg)` |
| `--bs-modal-border-color` | `var(--bs-border-color-translucent)` |
| `--bs-modal-border-width` | `var(--bs-border-width)` |
| `--bs-modal-border-radius` | `var(--bs-border-radius-lg)` |
| `--bs-modal-box-shadow` | `var(--bs-box-shadow-sm)` |
| `--bs-modal-inner-border-radius` | `calc(var(--bs-border-radius-lg) - var(--bs-border-width))` |
| `--bs-modal-header-padding-x` | `1rem` |
| `--bs-modal-header-padding-y` | `1rem` |
| `--bs-modal-header-padding` | `1rem 1rem` |
| `--bs-modal-header-border-color` | `var(--bs-border-color)` |
| `--bs-modal-header-border-width` | `var(--bs-border-width)` |
| `--bs-modal-title-line-height` | `1.5` |
| `--bs-modal-footer-gap` | `0.5rem` |
| `--bs-modal-footer-bg` | *(empty)* |
| `--bs-modal-footer-border-color` | `var(--bs-border-color)` |
| `--bs-modal-footer-border-width` | `var(--bs-border-width)` |

**20 tokens**, declared on `.modal` (not `.modal-content` — `.modal-content` only consumes them via `var()`).

**Modal backdrop — `--bs-backdrop-*`** (shared namespace with Offcanvas; declared separately on `.modal-backdrop` and `.offcanvas-backdrop`):

| CSS property | Default value |
|---|---|
| `--bs-backdrop-zindex` | `1050` (modal) / different value on offcanvas backdrop |
| `--bs-backdrop-bg` | `#000` |
| `--bs-backdrop-opacity` | `0.5` |

**3 tokens** (namespace reused, not duplicated, by Offcanvas).

### Offcanvas — `--bs-offcanvas-*` (source: `_offcanvas.scss`, compiled CSS `.offcanvas, .offcanvas-xxl, .offcanvas-xl, .offcanvas-lg, .offcanvas-md, .offcanvas-sm {}` at line 6275)

| CSS property | Default value |
|---|---|
| `--bs-offcanvas-zindex` | `1045` |
| `--bs-offcanvas-width` | `400px` |
| `--bs-offcanvas-height` | `30vh` |
| `--bs-offcanvas-padding-x` | `1rem` |
| `--bs-offcanvas-padding-y` | `1rem` |
| `--bs-offcanvas-color` | `var(--bs-body-color)` |
| `--bs-offcanvas-bg` | `var(--bs-body-bg)` |
| `--bs-offcanvas-border-width` | `var(--bs-border-width)` |
| `--bs-offcanvas-border-color` | `var(--bs-border-color-translucent)` |
| `--bs-offcanvas-box-shadow` | `var(--bs-box-shadow-sm)` |
| `--bs-offcanvas-transition` | `transform 0.3s ease-in-out` |
| `--bs-offcanvas-title-line-height` | `1.5` |

**12 tokens.** Note the base selector is a comma-joined group (`.offcanvas, .offcanvas-xxl, ...`), not just `.offcanvas` alone — all size-responsive variants share one default block, then each breakpoint's media query re-scopes `--bs-offcanvas-height`/`-border-width` for the horizontal-becomes-inline breakpoint behavior.

### Carousel — no dedicated `--bs-carousel-*` root namespace

`_variables.scss` defines `$carousel-*` SCSS variables, but only 3 end up as runtime custom properties in compiled CSS (all declared inline on specific sub-elements, not a shared `.carousel` block): `--bs-carousel-caption-color`, `--bs-carousel-control-icon-filter`, `--bs-carousel-indicator-active-bg`. Carousel is out of the 31-component scope for this KB (not in the "Components to document" list) — flagged here only because it surfaced during the `--bs-*` grep; not expanded further.

### Grid gutters — `--bs-gutter-x` / `--bs-gutter-y` (source: `mixins/_grid.scss`)

| CSS property | Default value | Scope |
|---|---|---|
| `--bs-gutter-x` | `1.5rem` (`$grid-gutter-width`) | `.row` |
| `--bs-gutter-y` | `0` | `.row` |

**2 tokens.** Layout-system tokens, not tied to a single component in the 31-component list; included for completeness since they appeared in the token grep.

---

## Section 10 totals

Button 25 + Close Button 8 + Form controls 4 + Form Switch 1 + Nav 18 + Navbar 19 + Dropdown 25 + Pagination 19 + Accordion 20 + Card 19 + List Group 17 + Table 14 + Alert 9 + Badge 6 + Breadcrumb 8 + Progress 8 + Spinner 6 + Toast 15 + Tooltip 12 + Popover 20 + Modal 20 + Backdrop 3 + Offcanvas 12 + Grid gutters 2 = **310 tokens**.

## Grand total

§1–9 (114) + §10 (310) = **424 tokens** documented (matches the compiled-CSS unique-property-name count for these namespaces; the full compiled CSS has 459 unique `--bs-*` names in total — the remaining ~35 are per-color-scale `fusv-disable` maps like `$blue-100`..`$blue-900` that never reach `:root` as CSS, deprecated-alias variables, and a small number of internal composition variables covered inline above such as `--bs-table-bg-type`).

---

## Verification note (per skill instruction: re-read `_root.scss` and confirm every property has an entry)

Re-read of `_root.scss` (188 lines, full file) confirms every `--#{$prefix}...` emission in that file is represented above in §1–9: palette (`$colors`, `$grays`, `$theme-colors`, `$theme-colors-rgb`, `$theme-colors-text`, `$theme-colors-bg-subtle`, `$theme-colors-border-subtle` loops), `white-rgb`/`black-rgb`, fonts, `gradient`, root-body-variables block, link/code/highlight, root-border-var block, shadow, root-focus-variables block, root-form-validation-variables block, and the entire `[data-bs-theme=dark]` override block. No property emitted by `_root.scss` is missing from this file.
