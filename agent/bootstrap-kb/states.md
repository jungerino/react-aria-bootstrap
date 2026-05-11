---
what: Bootstrap 5.3.8 state and interaction reference
contains: For each state: CSS selector Bootstrap uses, visual change produced, components it applies to, and React Aria data-* equivalent. Includes JS state mutation catalog and bridge strategy overview.
when-to-load: ALWAYS during the mapping phase. Primary source for the "State mappings" column of mapping-table.md.
related: components.md for component-specific state context; patterns.md for JS mutation conflicts
---

# Bootstrap 5.3.8 State and Interaction Reference

---

## Section 1: State Catalog

| State | Bootstrap selector(s) | How applied | Visual effect | React Aria `data-*` equivalent |
|---|---|---|---|---|
| **Hover** | `:hover` | Browser pseudo-class | Color/bg shift via `--bs-*-hover-*` tokens | `[data-hovered]` |
| **Focus** | `:focus`, `:focus-visible` | Browser pseudo-class | Box-shadow focus ring (outline removed) | `[data-focused]`, `[data-focus-visible]` |
| **Active / Pressed** | `:active` (pseudo) + `.active` (class) | Pseudo-class for press; JS adds `.active` to nav/list-group/pagination | Background/color shift; `.active` applies active variant styling | `[data-pressed]` (press), `[data-selected]` (persistent selection) |
| **Disabled** | `:disabled`, `[disabled]`, `.disabled` | HTML attribute or class | Reduced opacity + `pointer-events: none` | `[data-disabled]` |
| **Checked** | `:checked` | Browser pseudo-class on `<input type="checkbox/radio">` | Filled background + checkmark/dot SVG | `[data-selected]` (Checkbox), `[data-selected]` (RadioGroup) |
| **Selected** | `.active` | Bootstrap JS adds to nav-link, list-group-item, page-item | Primary bg/white text on active item | `[data-selected]` |
| **Expanded / Open** | `.show` | Bootstrap JS adds to dropdown-menu, modal, accordion content | `display: block` on menus/modals; visibility | `[data-open]`, `[data-expanded]` |
| **Collapsed** | `.collapsed` (button state), absence of `.show` | Bootstrap JS toggles; `.collapsed` is on the trigger button | Chevron rotation via `::after` icon transform | `[data-expanded="false"]` |
| **Valid** | `.is-valid`, `.was-validated .form-control:valid`, `.was-validated .form-select:valid`, `.was-validated .form-check-input:valid`, `.was-validated .input-group > …:valid` | JS/server adds `.is-valid`; `.was-validated` on `<form>` enables `:valid` pseudo-class cascade | Green border + feedback icon (SVG bg on inputs) + green helper text; feedback div revealed | `[data-valid]` |
| **Invalid** | `.is-invalid`, `.was-validated .form-control:invalid`, `.was-validated .form-select:invalid`, `.was-validated .form-check-input:invalid`, `.was-validated .input-group > …:invalid` | JS/server adds `.is-invalid`; `.was-validated` on `<form>` enables `:invalid` pseudo-class cascade | Red border + feedback icon (SVG bg on inputs) + red helper text; feedback div revealed | `[data-invalid]` |
| **Read-only** | `[readonly]` | HTML attribute | Visual styling only (no Bootstrap class override); field still focusable | `[data-readonly]` |
| **Indeterminate** | `:indeterminate` | Browser pseudo-class on `<input type="checkbox">` | Dash SVG background image | `[data-indeterminate]` |
| **Placeholder shown** | `:placeholder-shown` | Browser pseudo-class | Used by floating labels to detect empty state | No direct RA equivalent (value-based) |

---

## Section 2: Detailed State Notes

### Hover

- **Trigger:** Browser `:hover` pseudo-class.
- **Mechanism:** Component CSS custom property overrides. E.g. `.btn:hover` reads `var(--bs-btn-hover-color)` and `var(--bs-btn-hover-bg)`.
- **Components:** `.btn`, `.nav-link`, `.dropdown-item`, `.list-group-item-action`, `.page-link`
- **React Aria bridge:** No bridge needed — React Aria fires `onHoverStart`/`onHoverEnd` and adds `[data-hovered]`, but Bootstrap's `:hover` pseudo applies independently. The compound selector `.react-aria-Button[data-hovered]:hover` is NOT needed; `:hover` alone is sufficient.

### Focus

- **Trigger:** `:focus` (keyboard or mouse) and `:focus-visible` (keyboard only).
- **Mechanism:**
  - **Buttons:** `:focus-visible` triggers `box-shadow: var(--bs-btn-focus-box-shadow)` (the standard focus ring). `outline: 0` is set.
  - **Inputs (`.form-control`):** `:focus` changes border color to `$input-focus-border-color` (~`#86b7fe`) and applies `box-shadow: $input-focus-box-shadow`.
  - **Form checks:** `:focus` on `.form-check-input` changes border and applies focus box-shadow. Switch variant additionally changes `--bs-form-switch-bg` image on focus.
  - **Form select:** `:focus` applies `$form-select-focus-box-shadow` and border color.
  - **Nav links:** `:focus-visible` applies `box-shadow: $nav-link-focus-box-shadow`.
  - **Input groups:** `.input-group > .form-control:focus`, `.input-group > .form-select:focus`, `.input-group > .form-floating:focus-within` — all raise `z-index` for correct border stacking.
  - **Input groups with validation + focus:** `.was-validated .input-group > .form-control:not(:focus):valid` — note the `:not(:focus)` qualifier; the z-index stacking rule for validation only fires when the input is NOT focused (focus z-index takes precedence).
  - **Accordion:** `.accordion-button:focus` applies `box-shadow: var(--bs-accordion-btn-focus-box-shadow)`.
  - **`.focus-ring` helper:** The `.focus-ring:focus` rule sets `box-shadow` using `--bs-focus-ring-*` tokens. This is a standalone helper, not embedded in components.
- **React Aria bridge:** `[data-focused]` corresponds to `:focus`, `[data-focus-visible]` to `:focus-visible`. In most cases **no bridge needed** — `:focus-visible` applies to both Bootstrap and React Aria's focused elements. However, React Aria adds its own focus ring via `data-focus-visible` that may conflict with Bootstrap's focus ring; the bridge is to ensure Bootstrap's `outline: 0` + `box-shadow` wins.

### Active / Pressed

Two separate concepts in Bootstrap:

1. **`:active` pseudo-class** — momentary press state. Used in:
   - `.btn:first-child:active` / `:not(.btn-check) + .btn:active` (active bg/color/border)
   - `.form-check-input:active` (applies `brightness(90%)` filter)
   - `.form-range` thumb `:active`
   - `.list-group-item-action:not(.active):active` — momentary press on interactive list items applies `--bs-list-group-action-active-bg` / `--bs-list-group-action-active-color` (distinct from `.active` selected state)
   - React Aria equivalent: `[data-pressed]`
   - Bridge: No bridge needed for momentary press — `:active` pseudo-class fires independently.

2. **`.active` class** — persistent selected/current state applied by Bootstrap JS or manually.
   - Used on: `.nav-link.active`, `.list-group-item.active`, `.page-link.active` (or `.active > .page-link`), `.dropdown-item.active`, `.tab-pane.active` (shows pane content), `.btn.active` (toggle button), `.accordion-button:not(.collapsed)` (note: accordion uses absence of `.collapsed` rather than `.active`).
   - React Aria equivalent: `[data-selected]` for selection; `[data-expanded]` for accordion.
   - **Bridge required:** Compound selector `[data-selected]` must reproduce `.active` styling.

### Disabled

- **Bootstrap selectors used:**
  - `:disabled` — HTML pseudo-class for native form elements.
  - `[disabled]` — HTML attribute selector (functionally same; used as belt-and-suspenders in some rules).
  - `.disabled` — CSS class for elements that cannot use `:disabled` (e.g. `<a>` links, nav links, page links).
  - `fieldset:disabled .btn` — buttons inside a disabled fieldset inherit disabled styling. **Important:** `.disabled` alone does NOT prevent pointer events in all cases; `pointer-events: none` is set via CSS but the element is still in the DOM and accessible.
- **Visual effect:** `opacity: var(--bs-btn-disabled-opacity)` (`.65` for buttons), muted colors, `pointer-events: none`.
- **Components:** All interactive components. Specific compiled selectors:
  - `.btn:disabled`, `.btn.disabled`, `fieldset:disabled .btn`
  - `.form-control:disabled`, `.form-select:disabled`, `.form-check-input:disabled`, `.form-check-input[disabled]`
  - `.form-check-input[disabled] ~ .form-check-label`, `.form-check-input:disabled ~ .form-check-label` — label also gets reduced opacity when input is disabled
  - `.nav-link.disabled`, `.nav-link:disabled`
  - `.list-group-item.disabled`, `.list-group-item:disabled`
  - `.page-link.disabled`, `.disabled > .page-link`
  - `.btn-check[disabled] + .btn`, `.btn-check:disabled + .btn` — for toggle-button patterns
- **React Aria bridge:** React Aria adds `[data-disabled]` and sets `aria-disabled`. Bootstrap's `:disabled` pseudo will NOT fire on React Aria components that render `<button disabled>` — but React Aria does set the `disabled` attribute on native buttons. For non-button elements (e.g. custom list items), use compound selector `.react-aria-ListBoxItem[data-disabled]` to apply `.disabled`-equivalent styling. For Checkbox, the label sibling opacity rule must be explicitly bridged.

### Checked

- **Bootstrap selector:** `:checked` on `<input type="checkbox">` and `<input type="radio">`.
- **Mechanism:** Changes `background-color` to `$form-check-input-checked-bg-color` ($primary) and sets `--bs-form-check-bg-image` to the SVG checkmark/radio dot.
- **Critical conflict:** React Aria's Checkbox renders a **custom visual** (`<div>` inside `<label>`), not `<input type="checkbox">`. Bootstrap's `.form-check-input:checked` targets native inputs — it **does not apply** to React Aria's Checkbox component DOM. Full bridge required.
- **React Aria bridge:** Use `[data-selected]` on the React Aria custom checkbox indicator.

### Selected (`.active` on collection items)

See **Active / Pressed** — `.active` section above.

### Expanded / Open (`.show`)

- **Bootstrap JS adds `.show` to:**
  - `.dropdown-menu` — when a dropdown is open (`display: none` → `display: block`)
  - `.modal` — when a modal is visible
  - `.collapse` / `.accordion-collapse` — when accordion content is revealed (Bootstrap uses `.collapse.show`)
  - `.nav-item.show > .nav-link` — when a nav dropdown is open (also applies `.active` styling)
- **Bootstrap also uses `.collapsing`** — a transitional class added/removed during collapse animation.
- **React Aria equivalents:**
  - Dropdown/Select open → `[data-open]` on the trigger; Popover renders when open (not a class toggle).
  - Accordion expanded → `[data-expanded]` on the disclosure button; panel is in DOM but hidden.
  - Modal open → React Aria Dialog is in the DOM only when open.
- **Bridge:** React Aria never adds `.show`. Use `[data-open]` or `[data-expanded]` compound selectors to reproduce `.show` visual effects.

### Collapsed / Accordion

- **Bootstrap mechanism:** `.accordion-button` starts without any class. When an item is **collapsed**, Bootstrap JS adds `.collapsed` to the button. When **open**, `.collapsed` is absent (the button is styled with `:not(.collapsed)`).
  - `.collapsed` on the button: chevron points down, default colors.
  - `:not(.collapsed)`: `color: var(--bs-accordion-active-color)`, `background-color: var(--bs-accordion-active-bg)`, rotated chevron icon via `::after` background-image change.
  - `.accordion-button:hover` — sets `z-index: 2` (border overlap fix); no color change by default.
  - `.accordion-button:focus` — applies `box-shadow: var(--bs-accordion-btn-focus-box-shadow)`; `outline: 0`.
- **Content:** `.accordion-collapse` element has `.collapse` class. When shown: `.collapse.show`.
- **React Aria equivalent:** `[data-expanded]` on the disclosure trigger.
- **Bridge:** Map React Aria's `[data-expanded="true"]` → Bootstrap's `:not(.collapsed)` visual; `[data-expanded="false"]` → `.collapsed` visual.

### Valid / Invalid

- **Bootstrap two modes:**
  1. **Class-based (programmatic):** Add `.is-valid` or `.is-invalid` directly to the input for server-side or JS validation.
  2. **CSS pseudo-class cascade (native HTML5):** Add `.was-validated` to the `<form>` element; the browser's `:valid`/`:invalid` pseudo-classes then activate the same styles via compound selectors.

- **Token source:** `--bs-form-valid-color` (#198754 green), `--bs-form-invalid-color` (#dc3545 red), and corresponding `--bs-form-valid-border-color` / `--bs-form-invalid-border-color` variants (all from `_root.scss`).

- **Compiled CSS selector matrix — BOTH paths produce identical visual output:**

  | Component element | `.was-validated` path | `.is-*` class path |
  |---|---|---|
  | Feedback div visibility | `.was-validated :valid ~ .valid-feedback` | `.is-valid ~ .valid-feedback` |
  | `.form-control` border + icon | `.was-validated .form-control:valid` | `.form-control.is-valid` |
  | `.form-control` focus ring | `.was-validated .form-control:valid:focus` | `.form-control.is-valid:focus` |
  | `.form-select` border | `.was-validated .form-select:valid` | `.form-select.is-valid` |
  | `.form-select` bg-icon + padding (non-multi) | `.was-validated .form-select:valid:not([multiple]):not([size])` | `.form-select.is-valid:not([multiple]):not([size])` |
  | `.form-select` focus ring | `.was-validated .form-select:valid:focus` | `.form-select.is-valid:focus` |
  | `.form-check-input` border | `.was-validated .form-check-input:valid` | `.form-check-input.is-valid` |
  | `.form-check-input` checked bg | `.was-validated .form-check-input:valid:checked` | `.form-check-input.is-valid:checked` |
  | `.form-check-input` focus ring | `.was-validated .form-check-input:valid:focus` | `.form-check-input.is-valid:focus` |
  | `.form-check-label` color | `.was-validated .form-check-input:valid ~ .form-check-label` | `.form-check-input.is-valid ~ .form-check-label` |
  | `.input-group` z-index stacking | `.was-validated .input-group > .form-control:not(:focus):valid` | `.input-group > .form-control:not(:focus).is-valid` |

  *(Same matrix exists for `:invalid` / `.is-invalid` — mirror of the above with `--bs-form-invalid-*` tokens.)*

- **Visual effect details:**
  - `.form-control`: border-color change + SVG checkmark/X icon as `background-image` + adjusted `padding-right`
  - `.form-select`: border-color change + validation icon added to `--bs-form-select-bg-icon` (for non-multiple selects)
  - `.form-check-input`: border-color change; when `:checked`, `background-color` changes to `--bs-form-valid-color`/`--bs-form-invalid-color`
  - `.form-check-label`: text color changes to `--bs-form-valid-color`/`--bs-form-invalid-color`
  - `.valid-feedback` / `.invalid-feedback`: toggled from `display: none` to `display: block` via sibling combinator

- **React Aria equivalent:** `[data-valid]`, `[data-invalid]`.
- **Bridge:** React Aria never adds `.is-valid`/`.is-invalid` or `.was-validated`. Use `[data-invalid]` / `[data-valid]` compound selectors to reproduce the border, icon, and label color. Both validation paths collapse to the same visual — only one bridge selector set is needed per component.

### Read-only

- **Bootstrap:** `[readonly]` attribute on `<input>`. No `.readonly` class. Bootstrap renders inputs with `opacity: 1` even when disabled (to prevent iOS double-opacity). No specific Bootstrap styling for readonly beyond what the browser provides.
- **React Aria equivalent:** `[data-readonly]`.
- **Bridge:** Generally not needed — native `[readonly]` attribute styling is sufficient in most cases.

### Indeterminate

- **Bootstrap:** `:indeterminate` pseudo-class on `<input type="checkbox">`. Sets `--bs-form-check-bg-image` to the dash SVG.
- **React Aria equivalent:** `[data-indeterminate]` on the checkbox wrapper.
- **Bridge:** Since React Aria renders a custom visual (not native `<input type="checkbox">`), the `:indeterminate` pseudo won't fire. Must bridge via `[data-indeterminate]` → custom dash indicator styling.

### Placeholder Shown

- **Bootstrap:** `:placeholder-shown` — used specifically for **floating labels** to detect when a field is empty (so the label floats down into the field). Only relevant to `.form-floating`.
- **React Aria equivalent:** No direct `data-*` attribute. Floating label interaction in React Aria is value-based — the label position depends on whether the input has a value, not CSS pseudo-class state.
- **Bridge:** Floating label pattern requires custom CSS; Bootstrap's `:placeholder-shown` approach is incompatible with React Aria's model.

---

## Section 3: Bootstrap JS State Mutations

Bootstrap's JavaScript adds and removes classes to produce interactive states. These never fire automatically with React Aria — the bridge layer must replace them.

| Class | Added by | Removed by | Target element | Effect |
|---|---|---|---|---|
| `.show` | `Dropdown.show()` | `Dropdown.hide()` | `.dropdown-menu` | `display: block` — reveals menu |
| `.show` | `Modal.show()` | `Modal.hide()` | `.modal` | Modal becomes visible |
| `.show` | `Collapse.show()` | `Collapse.hide()` | `.collapse` (accordion body) | Height expands + `display: block` |
| `.collapsing` | Collapse animation start | Collapse animation end | `.collapse` | Transitional class during height animation |
| `.active` | Tab/Nav JS | Tab/Nav JS | `.nav-link` | Active tab/pill styling |
| `.active` | Tab/Nav JS | Tab/Nav JS | `.tab-pane` | Makes tab panel visible (`display: block`) |
| `.active` | List group JS | List group JS | `.list-group-item` | Active item styling (primary bg/white text) |
| `.active` | Pagination (manual) | Pagination (manual) | `.page-item` | Active page styling |
| `.collapsed` | Accordion JS | Accordion JS | `.accordion-button` | Collapsed button styling; chevron direction |

**Key insight:** Because Bootstrap JS manages these classes and React Aria manages `data-*` attributes, there is **zero overlap** — the bridge must 100% reproduce Bootstrap's JS-toggled states using React Aria's `data-*` attributes.

---

## Section 4: Bridge Strategy Overview

Three strategies connect React Aria `data-*` attributes to Bootstrap's visual states.

### Strategy 1: CSS pseudo-class overlap — no bridge needed

React Aria's `[data-focused]` is entirely redundant with `:focus-visible` since both fire at the same time for keyboard users. Bootstrap's `:hover` fires independently of React Aria's `[data-hovered]`. The CSS pseudo-classes handle these states directly.

**States using this strategy:**
- Hover → `:hover` (no bridge)
- Focus visible → `:focus-visible` (no bridge)
- Active/pressed (momentary) → `:active` (no bridge)
- Checked on native inputs → `:checked` (no bridge for native inputs)

**Caution:** This only applies where React Aria's rendered element is the same type as Bootstrap expects (e.g. a real `<button>` for `.btn`). For custom elements, pseudo-classes may not fire.

### Strategy 2: Compound selector bridge

React Aria never adds Bootstrap's class-based states (`.active`, `.show`, `.collapsed`, `.is-invalid`). The bridge uses compound selectors to reproduce Bootstrap's visual styling on React Aria elements.

**Pattern:**
```css
/* Replaces .list-group-item.active */
.react-aria-ListBoxItem[data-selected] {
  color: var(--bs-list-group-active-color);
  background-color: var(--bs-list-group-active-bg);
  border-color: var(--bs-list-group-active-border-color);
}
```

**States using this strategy:**
- Selected → `[data-selected]` → `.active` visual
- Open/expanded → `[data-open]` → `.show` visual
- Disabled → `[data-disabled]` → `.disabled` visual (for non-native elements)
- Invalid → `[data-invalid]` → `.is-invalid` visual
- Valid → `[data-valid]` → `.is-valid` visual
- Indeterminate → `[data-indeterminate]` → `:indeterminate` visual

### Strategy 3: `_bootstrap-overrides.scss` global bridge layer

Located at `src/scss/_bootstrap-overrides.scss`. Used for bridge rules that apply across multiple components (shared token overrides, global focus ring adjustments, etc.). Component-specific bridges belong in the component's own CSS file; shared structural patterns belong here.

**When to use:** When a rule is needed by 2+ components, or when it modifies a global Bootstrap token (e.g. adjusting `--bs-focus-ring-color` globally to match a design decision).

---

## Section 5: State Tokens Quick Reference

For each state, the primary token controlling the visual change:

| State | Component | Primary token |
|---|---|---|
| Hover | Button | `--bs-btn-hover-bg`, `--bs-btn-hover-color`, `--bs-btn-hover-border-color` |
| Hover | Nav link | `--bs-nav-link-hover-color` |
| Hover | List group (action) | `--bs-list-group-action-hover-bg`, `--bs-list-group-action-hover-color` |
| Hover | Dropdown item | `--bs-dropdown-link-hover-bg`, `--bs-dropdown-link-hover-color` |
| Hover | Pagination | `--bs-pagination-hover-bg`, `--bs-pagination-hover-color` |
| Focus | Button | `--bs-btn-focus-box-shadow` |
| Focus | Input | `$input-focus-border-color` (≈`#86b7fe`), `$input-focus-box-shadow` |
| Focus | Pagination | `--bs-pagination-focus-bg`, `--bs-pagination-focus-box-shadow` |
| Focus | Accordion | `--bs-accordion-btn-focus-box-shadow` |
| Focus ring (global) | All `.focus-ring` | `--bs-focus-ring-width`, `--bs-focus-ring-color`, `--bs-focus-ring-opacity` |
| Active / Selected | Button | `--bs-btn-active-bg`, `--bs-btn-active-color`, `--bs-btn-active-border-color` |
| Active / Selected | Nav tabs | `--bs-nav-tabs-link-active-color`, `--bs-nav-tabs-link-active-bg` |
| Active / Selected | Nav pills | `--bs-nav-pills-link-active-color`, `--bs-nav-pills-link-active-bg` |
| Active / Selected | List group | `--bs-list-group-active-bg`, `--bs-list-group-active-color`, `--bs-list-group-active-border-color` |
| Active / Selected | Pagination | `--bs-pagination-active-bg`, `--bs-pagination-active-color` |
| Active / Selected | Dropdown item | `--bs-dropdown-link-active-bg`, `--bs-dropdown-link-active-color` |
| Expanded | Accordion button | `--bs-accordion-active-color`, `--bs-accordion-active-bg` |
| Disabled | Button | `--bs-btn-disabled-color`, `--bs-btn-disabled-bg`, `--bs-btn-disabled-opacity` |
| Disabled | List group | `--bs-list-group-disabled-color`, `--bs-list-group-disabled-bg` |
| Disabled | Pagination | `--bs-pagination-disabled-color`, `--bs-pagination-disabled-bg` |
| Valid | All form fields | `--bs-form-valid-color`, `--bs-form-valid-border-color` |
| Invalid | All form fields | `--bs-form-invalid-color`, `--bs-form-invalid-border-color` |
