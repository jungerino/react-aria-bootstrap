---
what: Bootstrap 5.3.8 component class and DOM structure reference
contains: For each Bootstrap component: primary classes, modifier classes, expected DOM tree, sub-element roles, JS-driven class mutations, cross-references.
when-to-load: During mapping — load the specific component entry, not the whole file. Do not load the entire file into context at once.
related: states.md for state-specific selectors; patterns.md for Bootstrap↔React Aria DOM conflicts; tokens.md for component-level tokens
---

# Bootstrap 5.3.8 Component Reference

> **Usage note:** Load only the component section you need. This file is too large to load in full during a mapping session.

---

## Button

**Primary class:** `.btn`
**Modifier classes:** `.btn-{variant}` (primary, secondary, success, danger, warning, info, light, dark), `.btn-outline-{variant}`, `.btn-link`, `.btn-sm`, `.btn-lg`
**JS mutations:** `.active` (toggle buttons), `.disabled`, `.show` (when button is a dropdown trigger that is open)
**Expected DOM:**
```html
<button type="button" class="btn btn-primary">Label</button>
<!-- or -->
<a href="#" class="btn btn-secondary" role="button">Label</a>
```
**Sub-elements:** None — `.btn` is a single element.
**Toggle button pattern (btn-check):** Bootstrap uses a hidden `<input type="checkbox" class="btn-check">` paired with a `<label class="btn ...">` to create toggle buttons. The `.btn-check` class hides the native input; the `.btn` on the label receives `:checked`-derived styles via the `+` sibling combinator. This is distinct from using `.active` directly on a button.
```html
<input type="checkbox" class="btn-check" id="btn-check" autocomplete="off">
<label class="btn btn-primary" for="btn-check">Toggle</label>
```
**State selectors:** `:hover`, `:focus-visible`, `:active`, `:disabled`, `.disabled`, `.active`, `.show` (open dropdown trigger)
**Compiled state selectors on `.btn`:** `.btn-check:checked + .btn` (checked toggle), `.btn-check:focus-visible + .btn` (focus ring on toggle), `.btn-check[disabled] + .btn` (disabled toggle)
**Cross-references:** Button Group (wraps multiple `.btn`), Close Button (specialized `.btn-close`), Dropdown (`.dropdown-toggle-split` variant)

---

## Button Group

**Primary class:** `.btn-group`
**Modifier classes:** `.btn-group-sm`, `.btn-group-lg`, `.btn-group-vertical`
**JS mutations:** None (managed by individual button states)
**Expected DOM:**
```html
<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-primary">Left</button>
  <button type="button" class="btn btn-primary">Middle</button>
  <button type="button" class="btn btn-primary">Right</button>
</div>
<!-- Toggle button group using btn-check pattern -->
<div class="btn-group" role="group" aria-label="Toggle group">
  <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off">
  <label class="btn btn-outline-primary" for="btncheck1">Option 1</label>
  <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off">
  <label class="btn btn-outline-primary" for="btncheck2">Option 2</label>
</div>
```
**Sub-elements:** Children must be `.btn` elements (or `.btn-check` + `<label class="btn">` pairs, or dropdown wrappers). No inner wrapper needed.
**Related classes:** `.btn-toolbar` — groups multiple `.btn-group` elements into a toolbar (`display: flex; flex-wrap: wrap`).
**Cross-references:** Button, Dropdown (can contain dropdown triggers)

---

## Form Control / Text Input

**Primary class:** `.form-control`
**Modifier classes:** `.form-control-sm`, `.form-control-lg`, `.form-control-plaintext`, `.form-control-color`
**JS mutations:** `.is-valid`, `.is-invalid` (via form validation); `:focus` (browser)
**Expected DOM:**
```html
<div class="mb-3">
  <label for="inputId" class="form-label">Label</label>
  <input type="text" class="form-control" id="inputId" placeholder="Text">
  <div class="invalid-feedback">Error message</div>
  <div class="form-text">Helper text</div>
</div>
```
**Sub-elements:**
- `.form-label` — the `<label>` element above the input
- `.form-text` — helper text below (renders as small muted text)
- `.valid-feedback` / `.invalid-feedback` — error/success messages (hidden by default; shown when `.is-valid`/`.is-invalid` applied)
- `.valid-tooltip` / `.invalid-tooltip` — tooltip-style validation messages (alternative to feedback divs)
**State selectors:** `:focus`, `:disabled`, `[readonly]`, `.is-valid`, `.is-invalid`
**Validation pattern:** Either add `.is-valid`/`.is-invalid` directly to `.form-control`, or add `.was-validated` to the wrapping `<form>` (Bootstrap then uses `:valid`/`:invalid` pseudo-classes). Both patterns produce the same compiled result.
**File input sub-selectors:** `.form-control[type=file]` has special rules; `::file-selector-button` (and vendor `::-webkit-file-upload-button`) is styled as an inset button. Hover state: `.form-control:hover:not(:disabled):not([readonly])::file-selector-button`.
**Cross-references:** Floating Labels (wraps `.form-control`), Input Group (wraps in flex row)

---

## Form Select

**Primary class:** `.form-select`
**Modifier classes:** `.form-select-sm`, `.form-select-lg`
**JS mutations:** `.is-valid`, `.is-invalid`
**Expected DOM:**
```html
<select class="form-select" aria-label="Select example">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```
**Sub-elements:** None — `.form-select` is applied directly to `<select>`. Bootstrap adds a custom chevron via `background-image` (stored in `--bs-form-select-bg-img` CSS variable) on the element itself.
**Critical note:** `.form-select` requires a native `<select>` element. React Aria's `Select` renders a `<button>` + Popover + ListBox — completely incompatible with `.form-select`. See `patterns.md#select`.
**State selectors:** `:focus`, `:disabled`, `.is-valid`, `.is-invalid`
**Additional compiled selectors:** `.form-select[multiple]` and `.form-select[size]:not([size="1"])` — removes background-image (no chevron for multi-select). `:-moz-focusring` — removes dotted outline in Firefox.
**Validation pattern:** `.is-valid`/`.is-invalid` classes or parent `.was-validated` (uses `:valid`/`:invalid` pseudo-classes). Valid state injects a checkmark icon via `--bs-form-select-bg-icon`.
**Cross-references:** Patterns.md (DOM conflict)

---

## Form Check (Checkbox / Radio)

**Primary class:** `.form-check` (wrapper), `.form-check-input` (the `<input>`), `.form-check-label` (the `<label>`)
**Modifier classes:** `.form-check-inline`, `.form-check-reverse`
**JS mutations:** `:checked` (browser manages)
**Expected DOM:**
```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="check1">
  <label class="form-check-label" for="check1">Checkbox label</label>
</div>
```
**Sub-elements:**
- `.form-check-input` — the `<input type="checkbox">` or `<input type="radio">`. Bootstrap uses CSS `appearance: none` + SVG background image for the custom visual.
- `.form-check-label` — the `<label>` for the input
**Critical note:** Bootstrap's checkbox visual is on `<input type="checkbox">` using pseudo-states (`:checked`, `:indeterminate`). React Aria's Checkbox renders a `<label>` wrapping a custom visual element — no native `<input>` participates in styling. Full bridge required.
**State selectors:** `:checked`, `:indeterminate`, `:disabled`, `[disabled]`, `:focus`, `:active`, `.is-valid`, `.is-invalid`
**Key compiled sub-selectors:**
- `.form-check-input[type=checkbox]` — border-radius for checkbox shape
- `.form-check-input[type=radio]` — border-radius for radio shape
- `.form-check-input:checked[type=checkbox]` — checked checkbox SVG background
- `.form-check-input:checked[type=radio]` — checked radio SVG background
- `.form-check-input[type=checkbox]:indeterminate` — indeterminate state SVG
- `.form-check-input:focus` — focus ring (box-shadow)
- `.form-check-input:active` — active state
- `.form-check-input[disabled] ~ .form-check-label, .form-check-input:disabled ~ .form-check-label` — mutes label when input is disabled
- `.form-check-input.is-valid` / `.form-check-input.is-invalid` — validation colors
- `.form-check-input.is-valid ~ .form-check-label` / `.form-check-input.is-invalid ~ .form-check-label` — label color follows validation state
**Cross-references:** Form Switch (variant), Patterns.md (DOM conflict)

---

## Form Switch

**Primary class:** `.form-switch` on wrapper, `.form-check-input` on the input
**Modifier classes:** `.form-check-reverse`
**Expected DOM:**
```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="switch1">
  <label class="form-check-label" for="switch1">Toggle label</label>
</div>
```
**Sub-elements:** Same as Form Check. Switch variant uses wider width + pill border-radius + sliding dot animation on the `<input>`.
**State selectors:** Same as Form Check + `:focus` changes the dot SVG color (via `--bs-form-switch-bg` CSS variable).
**Key compiled sub-selectors:**
- `.form-switch .form-check-input` — sets pill shape and switch-specific background image
- `.form-switch .form-check-input:focus` — updates `--bs-form-switch-bg` to focused dot SVG
- `.form-switch .form-check-input:checked` — updates `--bs-form-switch-bg` to checked (white) dot SVG and moves thumb via `background-position`
- `.form-switch.form-check-reverse` — reverses layout direction
- `.form-switch.form-check-reverse .form-check-input` — adjusts margin for reversed layout

---

## Form Range

**Primary class:** `.form-range`
**Expected DOM:**
```html
<label for="range1" class="form-label">Range label</label>
<input type="range" class="form-range" id="range1">
```
**Sub-elements:** None — `.form-range` targets `<input type="range">` directly. Thumb and track are styled via `::-webkit-slider-thumb`, `::-moz-range-thumb`, `::-webkit-slider-runnable-track`, `::-moz-range-track` pseudo-elements.
**State selectors:** `:focus` (box-shadow on thumb), `:disabled` (muted thumb)

---

## Input Group

**Primary class:** `.input-group`
**Modifier classes:** `.input-group-sm`, `.input-group-lg`, `.has-validation`
**Expected DOM:**
```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control" placeholder="Username">
  <button class="btn btn-outline-secondary" type="button">Go</button>
</div>
```
**Sub-elements:**
- `.input-group-text` — text/icon addon (`<span>`); gets matching border/bg to look connected
- `.form-control` — the input (flex-grow: 1)
- `.form-select` — select variant
- `.form-floating` — floating label wrapper can also be a direct child of `.input-group`
- `.btn` — button addon
**DOM rules:** Bootstrap removes border-radius on inner edges using child combinators. Children that are not first or not last have adjacent border-radii zeroed. The `.has-validation` modifier adjusts this logic to leave room for validation feedback icons.
**Key compiled selectors:**
- `.input-group > .form-control`, `.input-group > .form-select`, `.input-group > .form-floating` — flex children with `position: relative` for z-index layering
- `.input-group > .form-control:focus`, `.input-group > .form-select:focus`, `.input-group > .form-floating:focus-within` — raises z-index of focused child above siblings
- `.input-group .btn` — sets `position: relative`; `.input-group .btn:focus` raises z-index
- `.input-group:not(.has-validation) > :not(:last-child):not(.dropdown-toggle)...` — removes right border-radius on non-last children
- `.input-group > :not(:first-child):not(.dropdown-menu)...` — removes left border-radius and border-left on non-first children (prevents double border)
**Cross-references:** Form Control, Button

---

## Floating Labels

**Primary class:** `.form-floating` (wrapper)
**Expected DOM:**
```html
<div class="form-floating mb-3">
  <input type="email" class="form-control" id="emailInput" placeholder="name@example.com">
  <label for="emailInput">Email address</label>
</div>
```
**Important DOM constraint:** The `<label>` MUST come after the `<input>` in the DOM. Bootstrap uses `~` (general sibling combinator) to detect when the input has value via `:placeholder-shown` and `:-webkit-autofill`. The label starts overlaid on the input and animates up when focused or filled.
**Sub-elements:**
- `<input>` or `<select>` with `.form-control` / `.form-select` (must come first)
- `<label>` (must come second)
**State selectors:** `:focus`, `:not(:placeholder-shown)` (label transform trigger)

---

## Form Label

**Primary class:** `.form-label`
**Modifier classes:** None specific (use typography utilities for sizing)
**Expected DOM:**
```html
<label class="form-label" for="inputId">Label text</label>
```
**Sub-elements:** None.
**Notes:** `.form-label` adds `margin-bottom: .5rem`. It is the standard way to label form controls outside of floating labels.

---

## Form Text

**Primary class:** `.form-text`
**Expected DOM:**
```html
<div class="form-text">We'll never share your email.</div>
```
**Sub-elements:** None. Renders as small muted text (uses `--bs-secondary-color`).

---

## Dropdown

**Primary class:** `.dropdown` (wrapper), `.dropdown-toggle` (trigger), `.dropdown-menu` (menu)
**Modifier classes:** `.dropup`, `.dropend`, `.dropstart`, `.dropdown-center`, `.dropup-center`, `.dropdown-menu-{breakpoint}-{start|end}`, `.dropdown-menu-dark`
**JS mutations:** `.show` on `.dropdown-menu` (open), `.show` on `.dropdown` (container); Popper.js adds `[data-bs-popper]` attribute to `.dropdown-menu` for positioning
**Expected DOM:**
```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Something else</a></li>
  </ul>
</div>
<!-- Split button with separate toggle -->
<div class="btn-group">
  <button type="button" class="btn btn-primary">Action</button>
  <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">Toggle</span>
  </button>
  <ul class="dropdown-menu">...</ul>
</div>
```
**Sub-elements:**
- `.dropdown-toggle` — the trigger button/link; has auto-generated caret via `::after` pseudo-element (`.dropstart` uses `::before` instead)
- `.dropdown-toggle-split` — narrower split button variant for the caret-only part; `::after` is the only content
- `.dropdown-menu` — the menu container (`display: none` by default; `.show` makes it visible)
- `.dropdown-menu[data-bs-popper]` — Popper.js positioning mode (adds `position`, `inset` styles)
- `.dropdown-item` — each menu item (anchors or buttons)
- `.dropdown-divider` — separator (`<hr>`)
- `.dropdown-header` — non-interactive section header
- `.dropdown-item-text` — non-interactive plain-text item
**State selectors:** `.dropdown-item:hover/:focus`, `.dropdown-item.active`, `.dropdown-item:active`, `.dropdown-item.disabled`, `.dropdown-item:disabled`, `.dropdown-menu.show`
**Caret direction by modifier:**
- `.dropdown` — caret points down (`::after` with border trick)
- `.dropup` — caret points up (`.dropup .dropdown-toggle::after`)
- `.dropend` — caret points right (`.dropend .dropdown-toggle::after`)
- `.dropstart` — caret points left (`.dropstart .dropdown-toggle::before`; `.dropstart .dropdown-toggle::after` is hidden)
**Cross-references:** Nav (dropdown variant inside nav), Patterns.md (React Aria Select maps to this pattern)

---

## Nav / Tabs

**Primary class:** `.nav` (list), `.nav-link` (item)
**Modifier classes:** `.nav-tabs`, `.nav-pills`, `.nav-underline`, `.nav-fill`, `.nav-justified`
**JS mutations:** `.active` on `.nav-link`, `.show` on dropdown within nav
**Expected DOM (tabs):**
```html
<ul class="nav nav-tabs">
  <li class="nav-item">
    <button class="nav-link active" aria-selected="true">Tab 1</button>
  </li>
  <li class="nav-item">
    <button class="nav-link">Tab 2</button>
  </li>
  <li class="nav-item">
    <button class="nav-link disabled">Disabled</button>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane active" id="pane1">Content 1</div>
  <div class="tab-pane" id="pane2">Content 2</div>
</div>
```
**Sub-elements:**
- `.nav-item` — the `<li>` wrapper
- `.nav-link` — the interactive link/button
- `.tab-content` — container for tab panels
- `.tab-pane` — individual panel (`display: none` by default; `.active` shows it; add `.fade` for opacity transition + `.show` for visible)
**State selectors:** `.nav-link:hover`, `.nav-link:focus`, `.nav-link:focus-visible`, `.nav-link.active`, `.nav-link.disabled`, `.nav-link:disabled`
**Note:** Both `.nav-link.disabled` AND `.nav-link:disabled` are compiled selectors — Bootstrap styles both the class and native disabled state.
**Tab panel transitions:** `.tab-pane.fade` starts at `opacity: 0`; adding `.show` brings opacity to 1. The `.tab-content > .tab-pane` rule hides non-active panes (`display: none`). `.tab-content > .active` shows the active pane.
**Nav-tabs specific compiled selectors:**
- `.nav-tabs .nav-link` — base tab styling (no bottom border, border-radius top)
- `.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus` — hover/focus border color
- `.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link` — active tab (white bg, border bottom removed)
- `.nav-tabs .dropdown-menu` — adjusts border-radius for dropdown inside tab nav
**Nav-pills specific:** `.nav-pills .nav-link.active, .nav-pills .show > .nav-link` — filled background
**Nav-underline specific:** `.nav-underline .nav-link.active, .nav-underline .show > .nav-link` — colored underline
**Cross-references:** Accordion (different expand pattern), React Aria Tabs maps to this structure

---

## Navbar

**Primary class:** `.navbar`
**Modifier classes:** `.navbar-expand-{sm|md|lg|xl|xxl}`, `.navbar-{light|dark}`, `.bg-{theme}`, `.fixed-top`, `.fixed-bottom`, `.sticky-top`
**JS mutations:** `.show` on `.navbar-collapse` (mobile menu open)
**Expected DOM:**
```html
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
      </ul>
    </div>
  </div>
</nav>
```
**Sub-elements:**
- `.navbar-brand` — logo/brand text
- `.navbar-toggler` — mobile menu toggle button
- `.navbar-toggler-icon` — hamburger icon (CSS background-image)
- `.navbar-collapse` — collapsible nav area; gets `.collapse` + `.show` via JS
- `.navbar-nav` — the nav list (uses `.nav-link`, `.nav-item`)
- `.navbar-text` — inline text

---

## List Group

**Primary class:** `.list-group`
**Modifier classes:** `.list-group-flush`, `.list-group-horizontal`, `.list-group-horizontal-{breakpoint}`, `.list-group-numbered`, `.list-group-item-{variant}` (contextual color variants: primary, secondary, success, danger, warning, info, light, dark)
**JS mutations:** `.active` on `.list-group-item`
**Expected DOM:**
```html
<ul class="list-group">
  <li class="list-group-item">First item</li>
  <li class="list-group-item active" aria-current="true">Active item</li>
  <li class="list-group-item disabled" aria-disabled="true">Disabled</li>
</ul>
<!-- Interactive variant -->
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">Active link</a>
  <a href="#" class="list-group-item list-group-item-action">Link item</a>
  <button class="list-group-item list-group-item-action">Button item</button>
</div>
<!-- Numbered list group -->
<ol class="list-group list-group-numbered">
  <li class="list-group-item">First item</li>
  <li class="list-group-item">Second item</li>
</ol>
```
**Sub-elements:**
- `.list-group-item` — each item
- `.list-group-item-action` — adds hover/focus/active interactivity styling (use on `<a>` or `<button>`)
**State selectors:** `.list-group-item.active`, `.list-group-item.disabled`, `.list-group-item:disabled`, `.list-group-item-action:hover/:focus` (only when not `.active`), `.list-group-item-action:active` (only when not `.active`)
**Note:** `.list-group-item-action` hover/focus/active selectors are qualified with `:not(.active)` — an already-active item does not change on hover.
**Numbered list group note:** `.list-group-numbered > .list-group-item::before` generates the counter number as `::before` content.
**Contextual color classes:** `.list-group-item-primary`, `.list-group-item-secondary`, `.list-group-item-success`, `.list-group-item-danger`, `.list-group-item-warning`, `.list-group-item-info`, `.list-group-item-light`, `.list-group-item-dark` — each sets `--bs-list-group-color` and `--bs-list-group-bg`.
**Cross-references:** Patterns.md (React Aria ListBox maps to this structure)

---

## Breadcrumb

**Primary class:** `.breadcrumb` (list), `.breadcrumb-item` (item)
**Modifier classes:** None
**JS mutations:** None
**Expected DOM:**
```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Library</a></li>
    <li class="breadcrumb-item active" aria-current="page">Data</li>
  </ol>
</nav>
```
**Sub-elements:**
- `.breadcrumb-item` — each crumb; the separator (default `/`) is generated via `::before` content on all items after the first
- `.breadcrumb-item.active` — current page (not a link); uses `--bs-breadcrumb-item-active-color`
**State selectors:** `.breadcrumb-item.active`

---

## Pagination

**Primary class:** `.pagination`
**Modifier classes:** `.pagination-sm`, `.pagination-lg`
**JS mutations:** `.active` on `.page-item`, `.disabled` on `.page-item`
**Expected DOM:**
```html
<nav aria-label="Page navigation">
  <ul class="pagination">
    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
```
**Sub-elements:**
- `.page-item` — each `<li>` wrapper; holds `.active` and `.disabled` state classes
- `.page-link` — the actual link/button inside each item
**State selectors:** `.page-link:hover`, `.page-link:focus`, `.page-link.active` (or `.active > .page-link`), `.page-link.disabled`

---

## Accordion

**Primary class:** `.accordion`
**Modifier classes:** `.accordion-flush`
**JS mutations:** `.collapsed` on `.accordion-button` (added when item is collapsed), `.show` on `.accordion-collapse`
**Expected DOM:**
```html
<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
        Item 1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show">
      <div class="accordion-body">Content</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
        Item 2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse">
      <div class="accordion-body">Content</div>
    </div>
  </div>
</div>
```
**Sub-elements:**
- `.accordion-item` — each panel wrapper
- `.accordion-header` — the heading (usually `<h2>`) containing the button
- `.accordion-button` — trigger button; open state = no class, closed state = `.collapsed`
- `.accordion-collapse` — the collapsible container; has `.collapse` class always; `.show` when open
- `.accordion-body` — inner content padding wrapper
**State selectors:** `.accordion-button:not(.collapsed)` (open), `.accordion-button.collapsed` (closed), `.accordion-button:hover`, `.accordion-button:focus`
**Compiled selectors:**
- `.accordion-button:not(.collapsed)` — open state: text/bg color change, rotated chevron (`::after`)
- `.accordion-button:not(.collapsed)::after` — rotated chevron icon
- `.accordion-button::after` — default chevron icon (collapsed state)
- `.accordion-button:hover` — cursor pointer
- `.accordion-button:focus` — focus ring (box-shadow)

---

## Modal

**Primary class:** `.modal`
**Modifier classes:** `.modal-sm`, `.modal-lg`, `.modal-xl`, `.modal-fullscreen`, `.modal-fullscreen-{breakpoint}-down`, `.modal-dialog-scrollable`, `.modal-dialog-centered`, `.fade`
**JS mutations:** `.show` on `.modal` (opens modal), `.show` on `.modal-dialog` (triggers animation), `.modal-open` on `<body>`
**Expected DOM:**
```html
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Modal body content.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```
**Sub-elements:**
- `.modal-dialog` — positioning/sizing wrapper; animated on open (slide-in) when `.fade`
- `.modal-content` — visual card with bg/border/shadow
- `.modal-header` — title row + close button
- `.modal-title` — heading text
- `.modal-body` — content area
- `.modal-footer` — action buttons row
- `.modal-backdrop` — separate DOM element added by Bootstrap JS (fixed overlay)
**State selectors:** `.modal.show` (visible), `.modal.fade` (transition enabled)

---

## Offcanvas

**Primary class:** `.offcanvas`
**Modifier classes:** `.offcanvas-start`, `.offcanvas-end`, `.offcanvas-top`, `.offcanvas-bottom`
**JS mutations:** `.show` on `.offcanvas`, `.offcanvas-backdrop` added to DOM
**Expected DOM:**
```html
<div class="offcanvas offcanvas-start" id="offcanvasExample" tabindex="-1">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title">Offcanvas</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>
  <div class="offcanvas-body">
    Content here.
  </div>
</div>
```
**Sub-elements:**
- `.offcanvas-header` — title + close button row
- `.offcanvas-title` — panel title
- `.offcanvas-body` — scrollable content area

---

## Popover

**Primary class:** `.popover`
**Modifier classes:** `.bs-popover-{top|bottom|start|end}` (set by Popper.js), `.popover-header` + `.popover-body`
**JS mutations:** Entire `.popover` element is created/destroyed by Bootstrap JS; positioned via `data-bs-popper`
**Expected DOM (generated by JS):**
```html
<div class="popover bs-popover-top" role="tooltip">
  <div class="popover-arrow"></div>
  <h3 class="popover-header">Title</h3>
  <div class="popover-body">Content here.</div>
</div>
```
**Sub-elements:**
- `.popover-arrow` — CSS arrow pointing to the trigger
- `.popover-header` — title (optional)
- `.popover-body` — content
**Cross-references:** Tooltip (simpler variant), Patterns.md (React Aria Popover maps to this)

---

## Tooltip

**Primary class:** `.tooltip`
**Modifier classes:** `.bs-tooltip-{top|bottom|start|end}` (Popper.js), `.tooltip-inner`
**JS mutations:** Entire `.tooltip` element created/destroyed by JS
**Expected DOM (generated by JS):**
```html
<div class="tooltip bs-tooltip-top" role="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">Tooltip text</div>
</div>
```
**Sub-elements:**
- `.tooltip-arrow` — the directional arrow
- `.tooltip-inner` — the text box

---

## Alert

**Primary class:** `.alert`
**Modifier classes:** `.alert-{primary|secondary|success|danger|warning|info|light|dark}`, `.alert-dismissible`
**JS mutations:** Remove from DOM on dismiss (no class toggle — Bootstrap JS calls `element.remove()`)
**Expected DOM:**
```html
<div class="alert alert-primary alert-dismissible fade show" role="alert">
  <strong>Alert heading</strong> Alert text.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
```
**Sub-elements:**
- `.alert-heading` — styled heading inside alert
- `.alert-link` — styled link inside alert
- `.btn-close` — dismiss button (when `.alert-dismissible`)
**State selectors:** `.alert.show` (opacity 1 when `.fade` present)
**Notes:** Alert variants use contextual token system (`--bs-*-bg-subtle`, `--bs-*-text-emphasis`, `--bs-*-border-subtle`).

---

## Badge

**Primary class:** `.badge`
**Modifier classes:** `.bg-{theme}`, `.text-bg-{theme}`, `.rounded-pill`
**JS mutations:** None
**Expected DOM:**
```html
<span class="badge bg-primary">New</span>
<span class="badge text-bg-secondary rounded-pill">99+</span>
```
**Sub-elements:** None — `.badge` is a single `<span>`.
**Notes:** `.badge` alone provides sizing/typography; color is added via `.bg-*` or `.text-bg-*`. Empty badges (`&:empty`) are automatically `display: none`.

---

## Progress

**Primary class:** `.progress` (track), `.progress-bar` (fill)
**Modifier classes:** `.progress-bar-striped`, `.progress-bar-animated`, `.progress-stacked`
**JS mutations:** `width` style on `.progress-bar` (set inline via JS or CSS)
**Expected DOM:**
```html
<div class="progress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 25%">25%</div>
</div>
<!-- Stacked -->
<div class="progress-stacked">
  <div class="progress" style="width: 15%"><div class="progress-bar bg-success">15%</div></div>
  <div class="progress" style="width: 30%"><div class="progress-bar bg-warning">30%</div></div>
</div>
```
**Sub-elements:**
- `.progress` — the track (background bar)
- `.progress-bar` — the fill (width set inline)
**Notes:** Set `width` inline on `.progress-bar`. The ARIA attributes go on the outer `.progress` element.

---

## Spinner

**Primary class:** `.spinner-border` (ring) or `.spinner-grow` (pulse)
**Modifier classes:** `.spinner-border-sm`, `.spinner-grow-sm`, `.text-{theme}` for color
**JS mutations:** None
**Expected DOM:**
```html
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
<div class="spinner-grow text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
```
**Sub-elements:**
- `.visually-hidden` inside spinner — provides accessible text for screen readers
**Notes:** Color is inherited from `currentcolor` (border/bg use `currentcolor`); use `.text-{theme}` to set it.

---

## Toast

**Primary class:** `.toast`
**Modifier classes:** `.toast-container` (positioning wrapper), `.align-items-center` (variant)
**JS mutations:** `.show` on `.toast` (visible), `.hide` on dismiss start
**Expected DOM:**
```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">Hello, world!</div>
  </div>
</div>
```
**Sub-elements:**
- `.toast-header` — icon + title + timestamp + close button
- `.toast-body` — content area
**State selectors:** `.toast.show` (visible with opacity 1)

---

## Card

**Primary class:** `.card`
**Modifier classes:** `.card-img-top`, `.card-img-bottom`, `.card-img-overlay`, `.text-bg-{theme}`, `.border-{theme}`, `.card-group`, `.card-columns`
**JS mutations:** None
**Expected DOM:**
```html
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Card text.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Item</li>
  </ul>
  <div class="card-footer text-body-secondary">Footer</div>
</div>
```
**Sub-elements:**
- `.card-body` — main content area with padding
- `.card-title` — heading text
- `.card-subtitle` — subtitle text
- `.card-text` — paragraph text
- `.card-link` — a link inside card body
- `.card-header` — top header row (darker bg)
- `.card-footer` — bottom footer row
- `.card-img-top` / `.card-img-bottom` — images at top/bottom with rounding
- `.card-img-overlay` — absolute-positioned overlay on image

---

## Table

**Primary class:** `.table`
**Modifier classes:** `.table-{primary|secondary|success|…}` (row/cell color), `.table-striped`, `.table-striped-columns`, `.table-hover`, `.table-bordered`, `.table-borderless`, `.table-sm`, `.caption-top`, `.table-responsive{-{breakpoint}}`
**JS mutations:** None
**Expected DOM:**
```html
<table class="table table-striped table-hover">
  <thead>
    <tr><th scope="col">#</th><th scope="col">Name</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Alice</td></tr>
    <tr class="table-active"><td>2</td><td>Bob</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2">Footer</td></tr>
  </tfoot>
</table>
```
**Sub-elements:** Standard table elements (`<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, `<caption>`).
**State selectors:** `.table-active` on `<tr>` or `<td>` (highlighted row/cell)

---

## Close Button

**Primary class:** `.btn-close`
**Modifier classes:** `.btn-close-white` (deprecated v5.3.4; use `.text-reset` + filter), `data-bs-dismiss` attribute
**JS mutations:** None (Bootstrap JS listens for click and calls dismiss on parent)
**Expected DOM:**
```html
<button type="button" class="btn-close" aria-label="Close"></button>
```
**Sub-elements:** None — purely visual via `background-image` SVG.
**Notes:** Used inside Modal, Alert, Toast, Offcanvas headers.

---

## Separator / Divider

**In Dropdowns:** `.dropdown-divider` — rendered as `<hr>` inside `.dropdown-menu`
**In Nav:** `<li role="separator">` with visual styling via utilities
**In Buttons:** Achieved via CSS border-left on adjacent `.btn` in `.btn-group`

```html
<!-- Dropdown divider -->
<li><hr class="dropdown-divider"></li>
```

No standalone "separator" component in Bootstrap — use `<hr>` with utilities for general separators.

---

## Component Token Cross-Reference

| Component | Token namespace | Key tokens for React Aria bridge |
|---|---|---|
| Button | `--bs-btn-*` | `--bs-btn-hover-bg`, `--bs-btn-active-bg`, `--bs-btn-disabled-opacity`, `--bs-btn-focus-box-shadow` |
| Nav/Tabs | `--bs-nav-*`, `--bs-nav-tabs-*` | `--bs-nav-link-color`, `--bs-nav-tabs-link-active-color`, `--bs-nav-tabs-link-active-bg` |
| List Group | `--bs-list-group-*` | `--bs-list-group-active-bg`, `--bs-list-group-active-color`, `--bs-list-group-hover-bg` |
| Dropdown | `--bs-dropdown-*` | `--bs-dropdown-link-active-bg`, `--bs-dropdown-link-hover-bg`, `--bs-dropdown-link-disabled-color` |
| Accordion | `--bs-accordion-*` | `--bs-accordion-active-bg`, `--bs-accordion-active-color`, `--bs-accordion-btn-focus-box-shadow` |
| Badge | `--bs-badge-*` | `--bs-badge-font-size`, `--bs-badge-border-radius` |
| Alert | `--bs-alert-*` | `--bs-alert-bg`, `--bs-alert-color`, `--bs-alert-border-color` |
| Progress | `--bs-progress-*` | `--bs-progress-bar-bg`, `--bs-progress-bg` |
| Pagination | `--bs-pagination-*` | `--bs-pagination-active-bg`, `--bs-pagination-hover-bg` |
| Modal | `--bs-modal-*` | `--bs-modal-bg`, `--bs-modal-border-radius`, `--bs-modal-box-shadow` |
