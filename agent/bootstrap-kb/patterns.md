---
what: Bootstrap 5.3.8 compound component patterns, DOM conflicts with React Aria, and composable patterns
contains: Four sections — (1) how Bootstrap structures compound components and the CSS selectors that bind sub-elements, (2) DOM conflicts between React Aria and Bootstrap's expected HTML, (3) JS state mutation conflicts where Bootstrap toggles classes but React Aria uses data-* attributes, (4) Bootstrap patterns that compose cleanly with React Aria.
when-to-load: When mapping a React Aria component to Bootstrap, or when writing bridge CSS in _bootstrap-bridges.scss. Load alongside states.md for the full picture.
related: states.md for bridge strategy details; components.md for per-component DOM and class listings; tokens.md for CSS custom properties to override
---

# Bootstrap Patterns and React Aria Compatibility

---

## 1. Bootstrap Compound Component Patterns

Bootstrap styles multi-part widgets via CSS descendant/child selectors. Understanding the expected DOM shape is the prerequisite for knowing whether React Aria can satisfy those selectors.

### 1.1 Selector patterns used

| Pattern | Example | Meaning |
|---|---|---|
| Direct descendant | `.nav > .nav-link` | Child must be an immediate child |
| Nested descendant | `.navbar .nav-link` | Can be at any depth |
| Adjacent sibling | `input + label` (not used in BS core) | Rarely used; floating-labels uses `~` |
| General sibling | `.form-floating > .form-control ~ label` | **Critical**: input must precede label |
| Pseudo-class + class | `.accordion-button:not(.collapsed)` | State encoded in absence of class |
| Class + class | `.btn.active`, `.btn.disabled` | Modifier stacked on base |
| Attribute selector | `.dropdown-menu[data-bs-popper]` | JS runtime adds attribute |

### 1.2 Compound component DOM shapes

Each pattern lists the **required** class hierarchy. "Required" means Bootstrap's CSS will not apply without it.

#### Button
```
<button class="btn btn-{variant}">
```
Single element — no compound structure. Modifiers (`.btn-sm`, `.btn-lg`, `.active`, `.disabled`) stack on the same element.

#### Button Group
```
<div class="btn-group" role="group">
  <button class="btn btn-*">
  <button class="btn btn-*">
```
Bootstrap zeroes borders between adjacent `.btn` children using `:not(:first-child)` / `:not(:last-child)` selectors. The group must be a direct parent.

#### Nav / Tabs / Pills
```
<ul class="nav nav-tabs">          ← or nav-pills
  <li class="nav-item">
    <a class="nav-link active">
  <li class="nav-item">
    <a class="nav-link">
```
`.nav-link.active` triggers active styling. `.nav-tabs .nav-link` and `.nav-pills .nav-link` target via descendant. The `.nav-item` wrapper is optional for basic styling but required for correct flex layout and border-radius.

#### Form / Input + Label
```
<div class="mb-3">
  <label class="form-label" for="id">
  <input class="form-control" id="id">
  <div class="form-text">
</div>
```
Bootstrap does not bind label + input via CSS sibling selectors in the standard pattern. The `for`/`id` link is for accessibility only. Styling is independent per element.

#### Floating Labels
```
<div class="form-floating">
  <input class="form-control" id="id" placeholder=" ">  ← MUST come first
  <label for="id">
</div>
```
**Critical constraint**: `.form-floating > .form-control ~ label` uses a general sibling combinator. The `<input>` **must appear before** `<label>` in DOM order. Bootstrap detects "filled" state via `:not(:placeholder-shown)` — the placeholder must exist (even as a space) so `:placeholder-shown` fires correctly.

#### Checkbox / Radio (form-check)
```
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="id">
  <label class="form-check-label" for="id">
</div>
```
Styling applies via `appearance: none` on `<input.form-check-input>`. Checked state via `:checked` pseudo-class (native). Indeterminate state via `:indeterminate`. The `.form-check-input` must be a native `<input>` for these pseudo-classes to fire.

#### Switch
```
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="id">
  <label class="form-check-label" for="id">
</div>
```
Extends form-check. Switch track is the `<input>` itself styled via CSS. Same native input requirement as Checkbox.

#### Select (native)
```
<select class="form-select">
  <option>
</select>
```
Targets native `<select>` directly. Arrow icon is added via `background-image` on the `<select>`. There is no compound structure — the element is the component.

#### Input Group
```
<div class="input-group">
  <span class="input-group-text">
  <input class="form-control">
  <button class="btn btn-*">
</div>
```
Bootstrap collapses borders between adjacent children using complex `:not(:first-child)` / `:not(:last-child)` selectors. Inner elements must be direct children of `.input-group`.

#### Dropdown
```
<div class="dropdown">
  <button class="btn dropdown-toggle" data-bs-toggle="dropdown">
  <ul class="dropdown-menu">
    <li><a class="dropdown-item">
```
`.dropdown-menu` defaults to `display: none`. Bootstrap JS adds `.show` to `.dropdown-menu` to reveal it. `.dropdown-item.active` or `.dropdown-item:active` triggers active styling.

#### Accordion
```
<div class="accordion">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed">   ← .collapsed = closed
    <div class="accordion-collapse collapse show">   ← .show = open
      <div class="accordion-body">
```
Open/closed state is encoded as **absence** of `.collapsed` (open = no `.collapsed`) and **presence** of `.show` on the collapse panel. Bootstrap JS adds/removes these.

#### Modal
```
<div class="modal fade" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
        <button class="btn-close">
      <div class="modal-body">
      <div class="modal-footer">
```
`.modal` defaults to `display: none`. Bootstrap JS adds `.show` (and manages `.fade` animation). The four-level nesting is structural — removing levels breaks layout.

#### Card
```
<div class="card">
  <div class="card-header">
  <div class="card-body">
    <h5 class="card-title">
    <p class="card-text">
  <div class="card-footer">
```
Pure CSS — no JS mutations. All elements are optional; styling applies independently to whichever class is present.

#### List Group
```
<ul class="list-group">
  <li class="list-group-item">
  <li class="list-group-item active">
  <li class="list-group-item disabled">
```
`.list-group-item-action` adds hover/focus/active interactive styles. `.active` is a JS-toggled class. For `<button>` or `<a>` variants, native `:disabled` also works.

#### Pagination
```
<nav>
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link">
    <li class="page-item active">
      <a class="page-link">
```
Styling flows from `.page-item` to `.page-link` via descendant selector. `.active`/`.disabled` on `.page-item` affects child `.page-link`.

#### Alert
```
<div class="alert alert-{variant}" role="alert">
  <button class="btn-close" data-bs-dismiss="alert">
```
Single wrapper element with optional close button. `.alert-dismissible` adds right-padding for the button.

#### Badge
```
<span class="badge text-bg-{variant}">
```
Single element — no compound structure.

#### Progress
```
<div class="progress">
  <div class="progress-bar" style="width: 60%" role="progressbar">
```
Width is set via inline `style`. Bootstrap does not provide a utility class for arbitrary widths.

#### Breadcrumb
```
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a href="#">
    <li class="breadcrumb-item active" aria-current="page">
```
Separator is generated via `::before` pseudo-element on `.breadcrumb-item + .breadcrumb-item`. Active styling via `.breadcrumb-item.active`.

#### Spinner
```
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
```
Or `.spinner-grow` for pulse variant. Single animated element — no JS state.

#### Tabs (with pane)
```
<ul class="nav nav-tabs">
  <li class="nav-item">
    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#pane1">
<div class="tab-content">
  <div class="tab-pane fade show active" id="pane1">
  <div class="tab-pane fade" id="pane2">
```
Bootstrap JS adds `.active` + `.show` to the active tab pane. Tab button gets `.active` class.

---

## 2. DOM Conflict Register

A DOM conflict exists when React Aria renders an element structure that cannot satisfy Bootstrap's CSS selectors without modification.

Severity:
- **CRITICAL** — Bootstrap selectors will not match at all; requires a completely different approach
- **MAJOR** — Selectors can be satisfied with structural shims or bridge CSS, but no clean mapping exists
- **MINOR** — Selectors mostly match; small bridge needed for edge cases

### 2.1 Checkbox / Radio

**Severity: CRITICAL**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Root element | `<div.form-check>` wrapper | `<label.react-aria-Checkbox>` (label is root) |
| Interactive element | `<input type="checkbox" class="form-check-input">` | Custom `<div>` or `<span>` as visual indicator (no native input) |
| Label | `<label class="form-check-label">` (sibling of input) | Text is content of the root `<label>` |
| State | Native `:checked`, `:indeterminate`, `:disabled` on `<input>` | `[data-selected]`, `[data-indeterminate]`, `[data-disabled]` on `<label>` |

Bootstrap's `.form-check-input:checked` targets a native `<input>` — this pseudo-class will never fire on React Aria's structure. The `appearance: none` technique and SVG `background-image` injection Bootstrap uses are incompatible with React Aria's checkbox rendering.

**Additional compiled-CSS conflicts (from audit):**
- **Disabled label sibling rule**: `.form-check-input[disabled] ~ .form-check-label, .form-check-input:disabled ~ .form-check-label` — dims the label at `opacity: 0.5` when the input is disabled. React Aria's Checkbox has no `<input>` sibling, so this sibling rule never fires. Bridge required: explicitly apply `opacity: 0.5` to label text when `[data-disabled]` is on the root.
- **Indeterminate type qualifier**: Bootstrap uses `.form-check-input[type=checkbox]:indeterminate` (type-qualified). React Aria's `[data-indeterminate]` attribute is on the `<label>` root — the type qualifier is irrelevant since there is no `<input>`, but it confirms the bridge must explicitly target `[data-indeterminate]` on the custom indicator element.
- **Validation label color sibling rule**: `.form-check-input.is-valid ~ .form-check-label` / `.form-check-input.is-invalid ~ .form-check-label` — changes label text color on valid/invalid state. Since there is no `<input>` sibling, this rule also never fires. Bridge: apply label color via `[data-valid]` / `[data-invalid]` on the root.

**Approach**: Restyle from scratch using React Aria `[data-selected]`/`[data-indeterminate]` attributes. Bootstrap tokens (`--bs-form-check-bg`, `--bs-form-check-bg-image`, `--bs-form-switch-bg`) can be consumed but the selector structure must be rebuilt. The disabled and validation label color effects must also be explicitly bridged since Bootstrap's sibling combinators will never fire.

### 2.2 Select (Combobox / Dropdown)

**Severity: CRITICAL**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Control element | `<select class="form-select">` | `<button>` (trigger) + `<Popover>` + `<ListBox>` |
| State | Native `:focus`, `:disabled` on `<select>` | `[data-focused]`, `[data-disabled]` on `<div.react-aria-Select>` |
| Dropdown | CSS `appearance` hides native UI | Custom popover with `.react-aria-Popover` |
| Options | `<option>` children of `<select>` | `<ListBoxItem>` inside `<ListBox>` inside popover |

Bootstrap's `.form-select` uses `appearance: none` + `background-image` to style the native `<select>`. None of this applies to React Aria's rendered DOM.

**Additional compiled-CSS conflict (from audit):**
- **Popper.js positioning attribute**: Bootstrap's Dropdown adds `[data-bs-popper]` to `.dropdown-menu` for Popper.js positioning (`position`, `inset`, `margin` are set only when this attribute is present). React Aria uses its own positioning system (via the `<Popover>` component) and never adds `[data-bs-popper]`. Consequence: if `.dropdown-menu` CSS is borrowed for the popover, the positioning styles under `.dropdown-menu[data-bs-popper]` will not activate. Bridge: set explicit `position` and placement styles on `.react-aria-Popover` independently, rather than relying on `.dropdown-menu[data-bs-popper]` rules.

**Approach**: Style the trigger `<button>` to look like `.form-select`. Style the popover as `.dropdown-menu`. Style listbox items as `.dropdown-item`. Bridge `[data-open]` → `.show` behavior via CSS (no JS class toggling needed — CSS on `[data-open]` attribute). Handle positioning independently — do not depend on `[data-bs-popper]` rules.

### 2.3 Floating Labels

**Severity: MAJOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| DOM order | `<input>` before `<label>` (sibling combinator `~`) | `<Label>` before `<Input>` (standard React Aria order) |
| Float trigger | CSS `:focus` or `:not(:placeholder-shown)` on input | `[data-focused]` attribute, or value presence (JS-managed) |
| Placeholder requirement | Placeholder must exist (even as space) for `:placeholder-shown` to work | Placeholder optional; float is prop-driven |

Bootstrap's `.form-floating > .form-control ~ label` uses `~` which requires `<input>` to precede `<label>` in the DOM. React Aria's `<TextField>` renders `<Label>` before `<Input>`.

**Approach**: Either (a) reverse DOM order in the React Aria TextField wrapper for floating-label use, or (b) abandon the Bootstrap floating-label CSS entirely and implement float behavior using `[data-focused]` + a CSS custom property or JS-managed class.

### 2.4 Switch

**Severity: CRITICAL** (same root cause as Checkbox)

Bootstrap `.form-switch` extends `.form-check` with the same native `<input type="checkbox">` requirement. React Aria's `Switch` renders `<label>` as root with a custom visual indicator — no native input.

**Approach**: Restyle using `[data-selected]` on the React Aria `<Switch>` label. Consume Bootstrap switch tokens (`--bs-form-switch-bg`, `--bs-form-switch-checked-bg`) but rebuild the selector structure.

### 2.5 Accordion

**Severity: MAJOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Open class | Absence of `.collapsed` on button | `[data-expanded]` on button (may vary — check current React Aria version) |
| Panel visibility | `.collapse.show` on panel | Controlled visibility via `hidden` attribute or similar |
| State encoding | Two-class toggle (`.collapsed` removed, `.show` added) | Single `data-*` attribute |

Bootstrap's `.accordion-button:not(.collapsed)` encodes the open state as absence of a class. React Aria uses a `data-*` attribute presence/absence model.

**Approach**: Bridge CSS `.accordion-button[data-expanded]` → same styling as `.accordion-button:not(.collapsed)`. Panel visibility bridge: map `[data-expanded]` or `[aria-hidden="false"]` to `display: block` behavior.

### 2.6 Modal / Dialog

**Severity: MAJOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Root structure | `.modal > .modal-dialog > .modal-content` (4-level) | `.react-aria-ModalOverlay > .react-aria-Modal` (2-level) |
| Visibility | Bootstrap JS adds `.show`, removes `.d-none` | React Aria controls via `isOpen` prop / `hidden` attribute |
| Backdrop | Separate `.modal-backdrop` element injected by Bootstrap JS | `.react-aria-ModalOverlay` is the backdrop wrapper |

React Aria's modal overlay renders as a two-level structure. Bootstrap's three inner levels (`.modal-dialog`, `.modal-content`, and the backdrop) require manual DOM construction inside the React Aria modal wrapper.

**Approach**: Apply `.modal-dialog` and `.modal-content` classes to custom wrapper divs inside the React Aria `<Modal>`. Style `.react-aria-ModalOverlay` as the backdrop (`.modal-backdrop` equivalent). Use `[data-entering]`/`[data-exiting]` for transitions instead of Bootstrap's `.fade`/`.show`.

### 2.7 Tabs + Tab Panes

**Severity: MINOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Active tab | `.nav-link.active` class | `[data-selected]` attribute on `.react-aria-Tab` |
| Tab panel | `.tab-pane.show.active` class | `.react-aria-TabPanel` (visible when selected, hidden otherwise) |
| JS dependency | Bootstrap JS manages `.show`/`.active` classes | React Aria manages visibility natively |

**Additional compiled-CSS note (from audit):**
- **Tab pane visibility mechanism**: Bootstrap's compiled CSS is `.tab-content > .tab-pane { display: none }` and `.tab-content > .active { display: block }` — these are two separate rules, not one toggle. React Aria's `<TabPanel>` does not receive `.active`; it uses `[data-inert]` (or removes the attribute) to control visibility. The `display: none` rule on `.tab-pane` will fire if that class is applied, but the `display: block` reveal via `.active` will never fire. Bridge: if `.tab-pane` is applied to React Aria `<TabPanel>` elements, add a companion rule `[data-inert] { display: none }` / `:not([data-inert]) { display: block }` or rely purely on React Aria's own visibility management without adding `.tab-pane`.

**Approach**: Bridge `.react-aria-Tab[data-selected]` → same styling as `.nav-link.active`. Tab panel visibility is handled by React Aria — no `.show` class needed; style the panel's default and selected states via `[data-inert]` / shown state. Do not apply `.tab-pane` to tab panels unless the companion `display: block` bridge is also in place.

### 2.8 Input Group Composition

**Severity: MINOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Wrapper | `.input-group` as direct parent | React Aria `<TextField>` renders `<div.react-aria-TextField>` as wrapper |
| Input element | `<input.form-control>` as direct child of `.input-group` | `<input>` nested inside React Aria's structure |
| Border collapsing | Direct child selectors collapse adjacent borders | Selectors may not reach the React Aria input |

**Approach**: Apply `.input-group` to a wrapper that directly contains `.input-group-text` spans and the React Aria field wrapper styled as `.form-control`.

### 2.9 ListBox (List Group interactive items)

**Severity: MINOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Selected item | `.list-group-item.active` class | `[data-selected]` on `.react-aria-ListBoxItem` |
| Disabled item | `.list-group-item.disabled` class or `:disabled` pseudo | `[data-disabled]` on item; `aria-disabled` set |
| Hover/focus styles | `.list-group-item-action:not(.active):hover/focus` | Native `:hover`/`:focus-visible` on item |

**Critical compiled-CSS detail (from audit):**
Bootstrap's hover/focus/active styles on list items are explicitly guarded: `.list-group-item-action:not(.active):hover`, `.list-group-item-action:not(.active):focus`, `.list-group-item-action:not(.active):active`. The `:not(.active)` guard prevents hover styles from appearing on an already-selected item. Since React Aria never adds `.active`, this guard never fires — hover styles WILL appear on selected items even when the bridge reproduces `.active` styling via `[data-selected]`.

**Bridge required**: Suppress hover/focus/active styles on selected items explicitly:
```css
.react-aria-ListBoxItem[data-selected]:hover,
.react-aria-ListBoxItem[data-selected]:focus {
  /* Do not apply hover bg — selected styles should win */
  background-color: var(--bs-list-group-active-bg);
  color: var(--bs-list-group-active-color);
}
```

**Approach**: Apply `.list-group` to the `<ListBox>` wrapper and `.list-group-item list-group-item-action` to each `<ListBoxItem>`. Bridge `[data-selected]` → `.list-group-item.active` styles. Add explicit override to suppress hover styles on selected items.

### 2.10 Toggle Button (btn-check pattern)

**Severity: MAJOR**

| Dimension | Bootstrap expects | React Aria renders |
|---|---|---|
| Structure | Hidden `<input type="checkbox" class="btn-check">` + adjacent `<label class="btn">` | `<button>` element (React Aria `<ToggleButton>`) |
| Toggle state | `:checked` on hidden `<input>` → `.btn-check:checked + .btn` sibling selector applies active styles | `[data-selected]` attribute on `<button>` |
| Focus ring on toggle | `.btn-check:focus-visible + .btn` | `[data-focus-visible]` on `<button>` (native `:focus-visible` also fires) |
| Disabled toggle | `.btn-check[disabled] + .btn` / `.btn-check:disabled + .btn` | `[data-disabled]` on `<button>` + `disabled` HTML attribute |

Bootstrap's toggle button pattern relies on a hidden `<input type="checkbox">` with the `+` adjacent sibling combinator to transfer state to the styled `<label>`. React Aria's `<ToggleButton>` renders a native `<button>` and uses `[data-selected]` to indicate the toggled-on state. The `.btn-check:checked + .btn` compound selector will never fire on React Aria's structure.

**Note:** The active/checked visual styles (from `.btn-check:checked + .btn`) are the same CSS custom property values as `.btn.active` — both resolve to `--bs-btn-active-bg`, `--bs-btn-active-color`, `--bs-btn-active-border-color`. This means the bridge only needs to target `[data-selected]` on the button.

**Approach**: Bridge `[data-selected]` → same styles as `.btn.active` (or `.btn-check:checked + .btn`). Since `ToggleButton` renders a native `<button>`, `:focus-visible` fires naturally and no focus ring bridge is needed. For disabled state, React Aria sets the `disabled` attribute, so `:disabled` pseudo-class fires — but `[data-disabled]` bridge is also needed for non-button toggle surfaces.

---

## 3. JS State Mutation Conflicts

Bootstrap's JavaScript (or manual class toggling) and React Aria both manage component state, but via different mechanisms. This section catalogs conflicts where they would fight over the same visual result.

### 3.1 Core conflict model

- **Bootstrap**: JavaScript adds/removes CSS classes at runtime (`.show`, `.active`, `.collapsed`, `.is-valid`, `.is-invalid`).
- **React Aria**: Sets `data-*` attributes on elements at runtime (`[data-open]`, `[data-selected]`, `[data-invalid]`, etc.).
- **Rule**: When using React Aria, **do not include Bootstrap's JavaScript**. Bootstrap JS will add/remove classes React Aria has not set, creating state desync. All state signals come from `data-*` attributes.

### 3.2 Conflict table

| Visual state | Bootstrap class | React Aria attribute | Conflict | Bridge strategy |
|---|---|---|---|---|
| Open/visible | `.show` on `.dropdown-menu`, `.collapse`, `.modal`, `.offcanvas` | `[data-open]` on trigger/panel | Direct conflict if both JS run | CSS bridge: `[data-open] .dropdown-menu { display: block }` |
| Selected/active tab | `.active` on `.nav-link` | `[data-selected]` on `.react-aria-Tab` | Bootstrap JS expected — omit it | CSS bridge: `.react-aria-Tab[data-selected]` mirrors `.nav-link.active` |
| Accordion open | Absence of `.collapsed` on button | `[data-expanded]` on button | Inverse encoding | CSS bridge: `[data-expanded]` → active accordion button styles |
| Form valid | `.is-valid` on input/wrapper | No direct equiv; validation is prop-driven in React Aria | Bootstrap validation CSS won't fire | Bridge: render `.is-valid` as a prop-driven conditional class, or rebuild via `[data-valid]` if available |
| Form invalid | `.is-invalid` on input/wrapper | `[data-invalid]` on field root | Bootstrap validation CSS won't fire | CSS bridge: `[data-invalid] input` → same as `.is-invalid` |
| Disabled | `.disabled` class + `:disabled` pseudo | `[data-disabled]` attribute | Bootstrap CSS uses both; React Aria only sets attribute | CSS bridge: `[data-disabled]` → same styling as `.disabled`. For `<button>` elements React Aria may also set the `disabled` attribute, so `:disabled` pseudo fires |
| Button pressed/active | `.active` class | `[data-pressed]` attribute | No automatic overlap | CSS bridge: `[data-pressed]` → same as `.btn.active` |
| Focused | None (Bootstrap uses `:focus-visible` natively) | `[data-focus-visible]` | Minimal conflict — both can coexist | Use `:focus-visible` CSS for Bootstrap-native focus ring; `[data-focus-visible]` for React Aria-specific focus styles |
| Loading/pending | No Bootstrap equivalent | `[data-pending]` on Button | No conflict | React Aria-only: spinner or opacity via `[data-pending]` |
| Toggle button checked | `.btn-check:checked + .btn` (sibling combinator) | `[data-selected]` on `<button>` | Sibling selector won't fire on React Aria's single `<button>` | CSS bridge: `button[data-selected]` → same as `.btn.active` visual |

### 3.3 Dropdown `.show` class in detail

Bootstrap's dropdown requires `.dropdown-menu.show` to be visible. React Aria's Select/ComboBox does not toggle this class — it manages visibility through the Popover's own rendering (the popover is mounted/unmounted or `hidden` attribute toggled).

**Resolution options**:

1. **Don't use `.dropdown-menu.show`** — style the popover as visible when rendered: `.react-aria-Popover { display: block }`. The popover is only in the DOM when open.
2. **Use data attribute** — `.react-aria-Popover[data-placement]` or `[data-entering]`/`[data-exiting]` to trigger show/hide animations.

### 3.4 Validation state conflict

Bootstrap's form validation uses `.is-valid` and `.is-invalid` classes plus `.valid-feedback` / `.invalid-feedback` sibling elements. React Aria uses `[data-invalid]` on the field root and a `<FieldError>` component for error messages.

**Bridge**:
```css
/* In _bootstrap-bridges.scss */
.react-aria-TextField[data-invalid] .react-aria-Input {
  border-color: var(--bs-form-invalid-border-color);
  box-shadow: none;
}
.react-aria-TextField[data-invalid] .react-aria-Input:focus {
  box-shadow: 0 0 0 var(--bs-focus-ring-width) var(--bs-form-invalid-color);
}
```
The `.invalid-feedback` display pattern (`display: none` → `display: block` when sibling has `.is-invalid`) cannot be used — use `<FieldError>` styled as `.invalid-feedback` with `display: block` unconditionally (React Aria only renders `<FieldError>` content when there is an error).

### 3.5 Accordion `.collapsed` inversion

Bootstrap encodes "open" as the **absence** of `.collapsed`. This is unusual — it means there is no single positive class for the open state.

```scss
// Bootstrap native
.accordion-button { /* closed styles */ }
.accordion-button:not(.collapsed) { /* open styles — applies primary color */ }
```

React Aria Disclosure/Accordion uses `[data-expanded]` as a positive attribute (present = open).

**Bridge**:
```css
.accordion-button[data-expanded] {
  color: var(--bs-accordion-btn-active-color);
  background-color: var(--bs-accordion-btn-active-bg);
  /* etc. — copy from .accordion-button:not(.collapsed) */
}
```

---

## 4. Bootstrap Patterns That Compose Well

These Bootstrap patterns require no or minimal bridging when applied to React Aria components.

### 4.1 Utility classes on wrapper elements

All Bootstrap utility classes work cleanly when applied to wrapper `<div>` elements that React Aria does not own. React Aria manages its own inner DOM; wrapping it in a div with Bootstrap utilities is always safe.

```jsx
<div className="d-flex gap-3 mb-4">
  <Button>Cancel</Button>
  <Button>Save</Button>
</div>
```

Safe categories: `.d-flex`, `.gap-*`, `.m-*`, `.p-*`, `.w-*`, `.h-*`, `.text-*`, `.bg-*`, `.border`, `.rounded-*`, `.shadow-*`, `.position-*`.

### 4.2 Single-element components

Bootstrap components that are a single element with no compound sub-element requirements apply cleanly:

| Bootstrap component | Class | React Aria component | Compatibility |
|---|---|---|---|
| Badge | `.badge .text-bg-*` | `<span>` (static), `<Button>` | Full — apply class to rendered element |
| Alert | `.alert .alert-*` | Custom `<div>` | Full — wrapper div owns the class |
| Spinner | `.spinner-border` | `<div>` | Full — no state interaction needed |
| Progress bar | `.progress` + `.progress-bar` | Custom `<div>` | Full — width via inline style or CSS var |
| Breadcrumb item | `.breadcrumb-item` | Custom `<li>` | Full — static markup |

### 4.3 Button

React Aria `<Button>` renders a `<button>` element — exactly what Bootstrap's `.btn` targets. State mapping:

| Bootstrap | React Aria | Overlap type |
|---|---|---|
| `:hover` | `[data-hovered]` | CSS pseudo fires on native element — no bridge needed |
| `:focus-visible` | `[data-focus-visible]` | CSS pseudo fires — no bridge needed |
| `:active` | `[data-pressed]` | Partial overlap — `:active` fires during mouse press; `[data-pressed]` also covers keyboard/touch. Bridge: `[data-pressed]` mirrors `.btn:active` |
| `.active` | `[data-pressed]` or managed prop | No auto bridge — needs explicit class or CSS bridge |
| `:disabled` | `[data-disabled]` + `disabled` attr | React Aria sets `disabled` attribute when `isDisabled` — `:disabled` CSS pseudo fires naturally |

**Result**: Bootstrap `.btn` + `.btn-{variant}` can be applied directly to a React Aria `<Button>`. Only the pressed/active state needs a bridge CSS rule.

### 4.4 Link / anchor navigation

React Aria's router integration renders `<a>` elements for navigation items. Bootstrap's `.nav-link`, `.dropdown-item`, `.breadcrumb-item a`, and `.page-link` all target `<a>` elements directly — these apply without structural conflict.

### 4.5 Form label + input (non-floating)

The standard Bootstrap form pattern (label above input, no sibling combinator) composes well:

```jsx
<div className="mb-3">
  <TextField>
    <Label className="form-label">Email</Label>
    <Input className="form-control" />
    <FieldError className="invalid-feedback d-block" />
  </TextField>
</div>
```

React Aria renders `<label>` and `<input>` as separate elements in the expected order for this pattern. The `for`/`id` wiring is handled automatically by React Aria.

### 4.6 TextField focus ring

React Aria's `TextField` with `.form-control` applied to the `<Input>` element: Bootstrap's `.form-control:focus` rule fires natively because React Aria renders a real `<input>` element. No bridge needed for focus styling.

### 4.7 Bootstrap grid and layout

Bootstrap's grid system (`.container`, `.row`, `.col-*`) and all flex utilities operate entirely on wrapper elements React Aria does not touch. These compose cleanly with any React Aria component.

### 4.8 Color themes and dark mode

Bootstrap's `[data-bs-theme="dark"]` attribute sets CSS custom property overrides on the root. Since React Aria tokens are CSS custom properties (when defined that way), applying the Bootstrap dark-mode attribute to a wrapper or the `<html>` element automatically updates all derived Bootstrap token values. React Aria has no opinion on color-scheme management.

### 4.9 Typography utilities

All `.fs-*`, `.fw-*`, `.fst-*`, `.text-*`, `.text-{color}` utilities apply to any element. React Aria renders standard semantic HTML (`<h1>`–`<h6>`, `<p>`, `<span>`) — Bootstrap typography utilities work without conflict.

### 4.10 `visually-hidden` for icon-only buttons

React Aria's `<Button>` with icon content: wrapping the label in `<span className="visually-hidden">` provides accessible text while hiding it visually. This is the standard Bootstrap pattern for icon-only buttons and composes cleanly with React Aria's accessible name resolution.

```jsx
<Button aria-label="Close">
  <CloseIcon aria-hidden />
</Button>
// or
<Button>
  <CloseIcon />
  <span className="visually-hidden">Close</span>
</Button>
```

---

## Summary: Conflict severity by component

| Component | Severity | Primary conflict |
|---|---|---|
| Button | None | No conflict — single element, native button |
| ToggleButton | MAJOR | btn-check sibling pattern won't fire; bridge `[data-selected]` → `.btn.active` |
| TextField | None (standard) | No conflict for standard pattern |
| TextField (floating) | MAJOR | DOM order (`<label>` before `<input>`) |
| Checkbox | CRITICAL | No native input; Bootstrap `:checked`, `:indeterminate`, sibling disabled/validation label rules won't apply |
| Radio | CRITICAL | Same as Checkbox |
| Switch | CRITICAL | Same root cause as Checkbox |
| Select | CRITICAL | React Aria renders button + popover, not native `<select>`; Popper.js `[data-bs-popper]` positioning won't fire |
| ComboBox | CRITICAL | Same as Select |
| Tabs | MINOR | `[data-selected]` vs `.active`; tab-pane `display: block` bridge required |
| Accordion | MAJOR | State encoding inversion (`.collapsed` absence vs `[data-expanded]`) |
| Dialog / Modal | MAJOR | DOM nesting differs; Bootstrap JS vs React Aria state management |
| ListBox | MINOR | `[data-selected]` vs `.active`; hover `:not(.active)` guard requires explicit bridge to suppress hover on selected items |
| Calendar | MAJOR | No Bootstrap Calendar component — must style custom DOM |
| Slider | MINOR | Bootstrap has no Slider — use range token values as reference |
| NumberField | None | Renders `<input>` — Bootstrap `.form-control` applies |
| SearchField | None | Renders `<input>` — Bootstrap `.form-control` applies |
| TextArea | None | Renders `<textarea>` — Bootstrap `.form-control` applies |
| Breadcrumbs | None | React Aria renders `<ol>`/`<li>` matching Bootstrap's expected DOM |
| Link | None | Renders `<a>` — Bootstrap link classes apply directly |
| Badge (static) | None | Pure HTML `<span>` — `.badge` applies directly |
| Meter / ProgressBar | MINOR | Bootstrap `.progress-bar` expects inline `width` style; React Aria uses `aria-valuenow` |
