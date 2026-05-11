---
title: Bootstrap ↔ React Aria Mapping Table — Iteration 2 (approved)
iteration: 2
---

# Bootstrap ↔ React Aria Mapping Table

Produced by iteration 2 of the bootstrap-mapping experiment; debrief decisions applied. Each component entry was written fresh from the skill and KB only, with resolved decisions recorded in-place.

---

## Button

**React Aria root class:** `.react-aria-Button`
**Mapping type:** 1:1 — Bootstrap Button

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Button` | Button | `.btn.btn-{variant}` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| `variant` (solid) | `variant="primary"` … `variant="dark"` | `.btn-primary` … `.btn-dark` | Bootstrap | 8 solid variants; compound string prop — value maps directly to Bootstrap modifier |
| `variant` (outline) | `variant="outline-primary"` … `variant="outline-dark"` | `.btn-outline-primary` … `.btn-outline-dark` | Bootstrap | 8 outline variants; compound string mirrors Bootstrap naming (`btn-${variant}`) |
| `variant` (link) | `variant="link"` | `.btn-link` | Bootstrap | 1 link variant; 17 total `variant` values across all families |
| Size | (none) | `.btn-sm`, `.btn-lg` | Bootstrap | React Aria has no size prop |

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-btn-color` | Root | Text color (base; overridden per variant) |
| `--bs-btn-bg` | Root | Background (base transparent; overridden per variant) |
| `--bs-btn-border-color` | Root | Border color |
| `--bs-btn-hover-color` | Root | Hover text color |
| `--bs-btn-hover-bg` | Root | Hover background |
| `--bs-btn-hover-border-color` | Root | Hover border color |
| `--bs-btn-focus-box-shadow` | Root | Focus ring (box-shadow) |
| `--bs-btn-focus-shadow-rgb` | Root | RGB triple for focus ring color calculation |
| `--bs-btn-active-color` | Root | Pressed/active text color |
| `--bs-btn-active-bg` | Root | Pressed/active background |
| `--bs-btn-active-border-color` | Root | Pressed/active border color |
| `--bs-btn-disabled-opacity` | Root | Opacity when disabled (0.65) |
| `--bs-btn-disabled-color` | Root | Disabled text color |
| `--bs-btn-disabled-bg` | Root | Disabled background |
| `--bs-btn-padding-y` / `--bs-btn-padding-x` | Root | Sizing (overridden by `.btn-sm` / `.btn-lg`) |
| `--bs-btn-font-size` | Root | Font size (overridden by size modifiers) |

### Bootstrap utilities

*(none prescribed by Bootstrap docs for Button itself)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Root | `:hover` | No bridge needed — CSS pseudo-class overlap |
| Focused | `[data-focused]` | Root | `:focus` | No bridge needed — CSS pseudo-class overlap |
| Focus visible | `[data-focus-visible]` | Root | `:focus-visible` | No bridge needed — Bootstrap uses `:focus-visible` for button focus ring |
| Pressed | `[data-pressed]` | Root | `:active` (momentary press) | Partial overlap: `:active` fires on mouse press. Keyboard/touch press: compound selector `.react-aria-Button[data-pressed]` → `--bs-btn-active-bg`, `--bs-btn-active-color`, `--bs-btn-active-border-color` |
| Disabled | `[data-disabled]` | Root | `:disabled`, `.disabled` | No bridge needed — React Aria sets native `disabled` attribute on `<button>`, so `:disabled` CSS pseudo fires naturally |
| Pending | `[data-pending]` | Root | No Bootstrap class equivalent | Content bridge (M010): render `.spinner-border.spinner-border-sm` as child element inside the button via `composeRenderProps`; spinner inherits color from `currentcolor`. Note: React Aria may expose pending state via render props rather than a `data-pending` DOM attribute — verify against installed version. |

### DOM conflicts

*(none — React Aria renders a native `<button>`, which is exactly what Bootstrap's `.btn` targets; patterns.md §4.3 confirms no conflict)*

### Decisions needed

*Resolved: single compound `variant` prop accepting Bootstrap's naming directly (`variant="primary"`, `variant="outline-primary"`, `variant="link"`, etc.) — 17 values total across 8 solid, 8 outline, and 1 link family.*

### Confidence: High

---

## TextField

**React Aria root class:** `.react-aria-TextField`
**Mapping type:** 1:1 — Bootstrap Form Control (all sub-parts fall within Bootstrap's standard form field pattern)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-TextField` | Form wrapper | *(no Bootstrap component class — structural wrapper div)* |
| Label | `.react-aria-Label` | Form Label | `.form-label` |
| Input | `.react-aria-Input` | Form Control | `.form-control` |
| TextArea | `.react-aria-TextArea` | Form Control | `.form-control` (same class; Bootstrap targets `<textarea>` with `.form-control` identically) |
| Description | `.react-aria-Text[slot="description"]` | Form Text | `.form-text` |
| FieldError | `.react-aria-FieldError` | Invalid Feedback | `.invalid-feedback` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Input type | `type` prop: text, email, password, tel, url, search | All use `.form-control` — no class change per type | React Aria | Bootstrap's `.form-control` applies uniformly to all `<input>` types |
| Size | (none) | `.form-control-sm`, `.form-control-lg` | Bootstrap | Applied to the Input sub-part |
| Plaintext | (none) | `.form-control-plaintext` | Bootstrap | No React Aria equivalent; removes border/bg for read-only display |
| Floating label | `variant="floating"` | `.form-floating` wrapper | Bootstrap | `variant="floating"` prop; render-prop reorders `<Input>` before `<Label>` inside a `.form-floating` wrapper — same sub-parts and Bootstrap class assignments, different DOM order |

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-form-valid-color` | Root / Input | Valid state text/icon color |
| `--bs-form-valid-border-color` | Input | Valid state border color |
| `--bs-form-invalid-color` | Root / Input | Invalid state text/icon color |
| `--bs-form-invalid-border-color` | Input | Invalid state border color |
| `--bs-secondary-color` | Description | Form-text muted color |

> Note: Most `.form-control` visual styling (default border, padding, font size, focus border color) is compiled from SCSS variables to static values — not runtime `--bs-*` CSS custom properties. These cannot be overridden at runtime via CSS custom property reassignment; they require SCSS build-time customization.

### Bootstrap utilities

*(none prescribed by Bootstrap docs for the standard form field pattern)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Focused (input) | `[data-focused]` | Input | `:focus` | No bridge needed — React Aria renders a real `<input>`, so `:focus` and `:focus-visible` fire natively |
| Hovered (input) | `[data-hovered]` | Input | `:hover` | No bridge needed — CSS pseudo-class overlap |
| Focus visible | `[data-focus-visible]` | Input | `:focus-visible` | No bridge needed |
| Disabled | `[data-disabled]` on root; native `disabled` on `<input>` | Root + Input | `:disabled` | No bridge needed — React Aria sets native `disabled` attribute on `<input>`, so `:disabled` CSS pseudo fires naturally |
| Invalid | `[data-invalid]` | Root | `.is-invalid` on `.form-control` | Compound selector bridge: `.react-aria-TextField[data-invalid] .react-aria-Input` → border-color: `var(--bs-form-invalid-border-color)` + focus box-shadow |
| Valid | `[data-valid]` | Root | `.is-valid` on `.form-control` | Compound selector bridge: `.react-aria-TextField[data-valid] .react-aria-Input` → same as `.form-control.is-valid` |
| Read-only | `[data-readonly]` on root; native `readonly` on `<input>` | Root + Input | `[readonly]` | No bridge needed — React Aria sets native `readonly` attribute on `<input>` |
| Required | `[data-required]` on root; native `required` on `<input>` | Root + Input | `[required]` | No bridge needed — React Aria sets native `required` attribute |
| FieldError visibility | (renders content only when error exists) | FieldError | `.invalid-feedback` reveal | No sibling-selector bridge needed — React Aria only renders `<FieldError>` content when there is an error. Style `.react-aria-FieldError` as `.invalid-feedback` with `display: block` unconditionally (patterns.md §3.4) |

### DOM conflicts

| Sub-part | Conflict | Bootstrap expects | React Aria renders | Resolution |
|----------|----------|------------------|--------------------|------------|
| Floating label DOM order | MAJOR | `<input>` before `<label>` (sibling combinator `~`) | `<Label>` before `<Input>` (default React Aria order) | Reorder children using render-prop API: render `<Input>` before `<Label>` inside a `.form-floating` wrapper when using floating label variant |

*(Standard pattern has no DOM conflicts — patterns.md §4.5)*

### Decisions needed

*Resolved: `variant="floating"` prop (option A) — the wrapper handles child reordering internally via render-prop API. Consumers use the same `<TextField>` API regardless of variant.*

### Confidence: High

*(Note: validation label sibling rules `.form-check-input.is-valid ~ .form-check-label` do not apply to TextField — those are for Checkbox. TextField's validation bridge is straightforward via `[data-invalid]` compound selectors.)*

---

## Checkbox

**React Aria root class:** `.react-aria-Checkbox`
**Mapping type:** 1:1 — Bootstrap Form Check

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Checkbox` | Form Check wrapper + label combined | `.form-check` (structural wrapper); also acts as the label element |
| Indicator (custom visual) | `.react-aria-Checkbox .indicator` (or equivalent custom element) | Form Check Input (visual styling surface only, per M012) | `.form-check-input` applied to this element to inherit token defaults |
| Hidden input | `<input type="checkbox">` (rendered internally by React Aria) | Form Check Input (form submission / ARIA) | *(no Bootstrap class — not the styling surface per M012)* |
| Label text | Text content inside `.react-aria-Checkbox` | Form Check Label | `.form-check-label` — but structurally merged into root `<label>` rather than a sibling element |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Inline layout | (none — layout is external) | `.form-check-inline` | Bootstrap | Applied to the root `.form-check` element; no React Aria prop equivalent |
| Reverse layout | (none) | `.form-check-reverse` | Bootstrap | Swaps label/indicator order via `flex-direction: row-reverse` |
| Size | (none) | (none — no `.form-check-sm`/`.form-check-lg` in Bootstrap) | — | Bootstrap has no size modifier for form-check |
| Icon style (indicator) | render-prop: `isSelected`, `isIndeterminate` | `bi-check-lg` (selected), `bi-dash-lg` (indeterminate) | Bootstrap Icons (M013) | Prefer Bootstrap Icons over inline SVG |

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-form-check-bg` | Indicator | Unchecked background color |
| `--bs-form-check-bg-image` | Indicator | Checkmark / dash SVG indicator image (overridden per state via `[data-selected]` / `[data-indeterminate]` bridges) |
| `--bs-form-valid-color` | Root / Indicator | Valid state color |
| `--bs-form-valid-border-color` | Indicator | Valid state border color |
| `--bs-form-invalid-color` | Root / Indicator | Invalid state color |
| `--bs-form-invalid-border-color` | Indicator | Invalid state border color |

### Bootstrap utilities

*(none prescribed by Bootstrap docs for this component)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Selected / Checked | `[data-selected]` | Root | `.form-check-input:checked` | Compound selector bridge: `.react-aria-Checkbox[data-selected] .indicator` → background-color: primary + checkmark icon visible (or use `bi-check-lg` Bootstrap Icon) |
| Indeterminate | `[data-indeterminate]` | Root | `.form-check-input[type=checkbox]:indeterminate` | Compound selector bridge: `.react-aria-Checkbox[data-indeterminate] .indicator` → dash icon visible (use `bi-dash-lg` Bootstrap Icon) |
| Hovered | `[data-hovered]` | Root | *(no explicit Bootstrap form-check hover styling on wrapper)* | No bridge needed — no Bootstrap hover style defined for `.form-check` wrapper |
| Focused / Focus visible | `[data-focus-visible]` | Root | `.form-check-input:focus` (box-shadow on input) | Compound selector bridge: `.react-aria-Checkbox[data-focus-visible] .indicator` → apply Bootstrap focus ring box-shadow (`--bs-focus-ring-*` tokens) on the indicator element |
| Pressed | `[data-pressed]` | Root | `.form-check-input:active` (brightness filter) | Compound selector bridge: `.react-aria-Checkbox[data-pressed] .indicator` → `filter: brightness(90%)` |
| Disabled | `[data-disabled]` | Root | `:disabled` on hidden input + sibling label rule `.form-check-input[disabled] ~ .form-check-label` | Two bridges required: (1) `.react-aria-Checkbox[data-disabled] .indicator` → muted indicator styles; (2) `.react-aria-Checkbox[data-disabled]` → `opacity: 0.5` on label text (sibling rule won't fire — no sibling structure) |
| Invalid | `[data-invalid]` | Root | `.form-check-input.is-invalid` + `.form-check-input.is-invalid ~ .form-check-label` | Two bridges: (1) `.react-aria-Checkbox[data-invalid] .indicator` → `border-color: var(--bs-form-invalid-border-color)`; (2) `.react-aria-Checkbox[data-invalid]` → label text color: `var(--bs-form-invalid-color)` |
| Valid | `[data-valid]` | Root | `.form-check-input.is-valid` + sibling label rule | Same pattern as invalid — bridges for indicator border and label text color |
| Read-only | `[data-readonly]` | Root | *(no Bootstrap read-only state for form-check)* | No Bootstrap equivalent; custom styling only if needed |
| Required | `[data-required]` | Root + hidden input | Native `required` attribute on hidden `<input>` | No visual bridge needed — React Aria sets native `required` on the hidden input |

### DOM conflicts

| Sub-part | Conflict | Bootstrap expects | React Aria renders | Resolution |
|----------|----------|------------------|--------------------|------------|
| Root element | CRITICAL | `<div.form-check>` wrapper | `<label.react-aria-Checkbox>` (label is root, not a div) | Apply `.form-check` to the root `<label>` — this works visually but is semantically different (Bootstrap's pattern expects a div with a sibling label) |
| Interactive input | CRITICAL | `<input type="checkbox" class="form-check-input">` as real input for pseudo-class styling | Hidden `<input>` (not styled) + custom visual `<div>` indicator | Apply `.form-check-input` to the custom indicator element for token inheritance (M012); all state bridges use `[data-*]` compound selectors since `:checked`, `:indeterminate`, `:focus`, `:active`, `:disabled` fire on the hidden input, not the indicator |
| Sibling label rule | CRITICAL | `.form-check-input[disabled] ~ .form-check-label` / `.form-check-input.is-valid ~ .form-check-label` — sibling combinator from input to label | No sibling relationship — label text is inside the root `<label>`, not a sibling of the hidden input | All label-color and disabled-opacity effects on the label must be explicitly bridged via `[data-disabled]` / `[data-invalid]` / `[data-valid]` on the root |

### Decisions needed

*(no genuine design-intent forks — Bootstrap form-check has no color variant system for individual checkboxes; the mapping approach is clear once the CRITICAL conflicts are acknowledged)*

### Confidence: High

*(Note: confidence is High for the mapping strategy itself. The CRITICAL conflicts are well-understood and the bridge approach via `[data-*]` compound selectors is the only viable path. Implementation complexity is high but the mapping is unambiguous.)*

---

## Select

**React Aria root class:** `.react-aria-Select`
**Mapping type:** Composite — sub-parts map to different Bootstrap components (see table)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Select` | — (wrapper only) | *(no Bootstrap component class — structural wrapper div)* |
| Label | `.react-aria-Label` | Form Label | `.form-label` |
| Trigger button | `.react-aria-Select .react-aria-Button` | **Structural**: Dropdown Toggle (M001); **Semantic/visual**: Form Select (M014) | `.btn.dropdown-toggle` with `.form-select` visual token overrides applied to match form-select appearance |
| SelectValue | `.react-aria-SelectValue` | — (display only) | *(no Bootstrap class — displays selected item text)* |
| Popover | `.react-aria-Popover` | Dropdown Menu | `.dropdown-menu` |
| ListBox | `.react-aria-ListBox` | — (wrapper inside dropdown-menu) | *(no additional class — Popover already carries `.dropdown-menu`)* |
| ListBoxItem | `.react-aria-ListBoxItem` | Dropdown Item | `.dropdown-item` |
| Description | `.react-aria-Text[slot="description"]` | Form Text | `.form-text` |
| FieldError | `.react-aria-FieldError` | Invalid Feedback | `.invalid-feedback` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Selection mode | `selectionMode="single"` (default), `selectionMode="multiple"` | `.dropdown-item` only (no multi-select modifier class) | Custom CSS | Multi-select supported: render `div.indicator` from Checkbox component per item; checked state bridges via `[data-selected]` on each item |
| Trigger size | (none) | `.form-select-sm`, `.form-select-lg` (via token overrides) | Bootstrap | Applied as token overrides on the trigger button |
| Menu direction | (controlled by Popover placement) | `.dropup`, `.dropend`, `.dropstart` (on wrapper) | React Aria | React Aria positions via `[data-placement]`; Bootstrap direction modifiers are out of scope |

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-dropdown-bg` | Popover | Dropdown menu background |
| `--bs-dropdown-border-color` | Popover | Dropdown menu border |
| `--bs-dropdown-border-radius` | Popover | Dropdown menu rounding |
| `--bs-dropdown-padding-y` | Popover | Menu vertical padding |
| `--bs-dropdown-link-color` | ListBoxItem | Item default text color |
| `--bs-dropdown-link-hover-color` | ListBoxItem | Item hover text color |
| `--bs-dropdown-link-hover-bg` | ListBoxItem | Item hover background |
| `--bs-dropdown-link-active-color` | ListBoxItem | Selected item text color |
| `--bs-dropdown-link-active-bg` | ListBoxItem | Selected item background |
| `--bs-dropdown-link-disabled-color` | ListBoxItem | Disabled item text color |
| `--bs-form-valid-border-color` | Trigger | Valid state border |
| `--bs-form-invalid-border-color` | Trigger | Invalid state border |
| `--bs-form-valid-color` | Trigger | Valid state icon/text color |
| `--bs-form-invalid-color` | Trigger | Invalid state icon/text color |

> Note: The trigger button's form-select visual appearance (border, border-radius, height, padding) uses compiled SCSS values from `_form-select.scss`, not runtime `--bs-*` tokens. These are applied as explicit CSS overrides on `.react-aria-Select .react-aria-Button` to achieve form-select aesthetics.

### Bootstrap utilities

*(none prescribed by Bootstrap docs for Dropdown + Form Select patterns)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Open | `[data-open]` on Root | Trigger + Popover | `.dropdown-menu.show` | CSS bridge: `.react-aria-Select[data-open] .react-aria-Popover { display: block }` — Popover is only in DOM when open, so `.show` class is not needed; style as visible when present |
| Hovered (trigger) | `[data-hovered]` | Trigger | `:hover` on `.btn` | No bridge needed — `:hover` pseudo fires on native `<button>` |
| Focused (trigger) | `[data-focus-visible]` | Trigger | `:focus-visible` on `.btn` | No bridge needed — CSS pseudo fires naturally |
| Pressed (trigger) | `[data-pressed]` | Trigger | `:active` on `.btn` | No bridge for mouse; compound selector for keyboard: `.react-aria-Button[data-pressed]` → `--bs-btn-active-*` |
| Disabled | `[data-disabled]` on Root; native `disabled` on trigger `<button>` | Root + Trigger + Items | `:disabled`, `.disabled` | Trigger: `:disabled` fires naturally. Items: `.react-aria-ListBoxItem[data-disabled]` → `color: var(--bs-dropdown-link-disabled-color); pointer-events: none` |
| Invalid | `[data-invalid]` on Root | Root | `.is-invalid` on trigger | Compound selector: `.react-aria-Select[data-invalid] .react-aria-Button` → border-color: `var(--bs-form-invalid-border-color)` |
| Valid | `[data-valid]` on Root | Root | `.is-valid` on trigger | Same pattern as invalid with `--bs-form-valid-border-color` |
| Selected item | `[data-selected]` on ListBoxItem | ListBoxItem | `.dropdown-item.active` | Compound selector: `.react-aria-ListBoxItem[data-selected]` → `color: var(--bs-dropdown-link-active-color); background-color: var(--bs-dropdown-link-active-bg)` |
| Focused item | `[data-focused]` on ListBoxItem | ListBoxItem | `.dropdown-item:focus` | No bridge needed — `:focus` pseudo fires if item is focusable; or compound selector for React Aria virtual focus: `.react-aria-ListBoxItem[data-focused]` → same as hover styles |
| Hovered item | `[data-hovered]` on ListBoxItem | ListBoxItem | `.dropdown-item:hover` | No bridge needed — `:hover` fires on native element |
| Placeholder | `[data-placeholder]` on SelectValue | SelectValue | No Bootstrap equivalent | Custom CSS only — apply muted text color when placeholder is shown |

### DOM conflicts

| Sub-part | Conflict | Bootstrap expects | React Aria renders | Resolution |
|----------|----------|------------------|--------------------|------------|
| Trigger element | CRITICAL | `<select class="form-select">` (native select) | `<button>` (trigger) + Popover + ListBox | Apply `.btn.dropdown-toggle` (structural); overlay `.form-select` visual token values on the button to achieve form-field appearance (M014 dual-counterpart) |
| Popover positioning | MAJOR | `.dropdown-menu[data-bs-popper]` receives `position`/`inset` from Popper.js | React Aria uses its own positioning system; never adds `[data-bs-popper]` | Do not depend on `[data-bs-popper]` positioning rules. Set explicit `position: absolute` and placement styles on `.react-aria-Popover` independently (patterns.md §2.2) |
| Dropdown open state | MAJOR | Bootstrap JS adds `.show` to `.dropdown-menu` | React Aria mounts/unmounts Popover (or uses `hidden` attribute); never adds `.show` | Style Popover as visible when rendered: `display: block` on `.react-aria-Popover` when present in DOM — no `.show` class needed |

### Decisions needed

*Resolved §1: Multi-select supported — render `div.indicator` from Checkbox component per item (not a bare `bi-check` icon); selected state bridges via `[data-selected]` compound selector on each item.*

*Resolved §2: Chevron icon — `bi-chevron-down` via Bootstrap Icons (option A, M013-aligned).*

### Confidence: High

*(Note: the mapping strategy is unambiguous due to M001 + M014. Confidence is High for the structural decision. Implementation complexity is significant due to the CRITICAL `.form-select` DOM conflict and Popper.js positioning gap.)*

---

## Tabs

**React Aria root class:** `.react-aria-Tabs`
**Mapping type:** 1:1 — Bootstrap Nav / Tabs (all sub-parts fall within Bootstrap's nav tabs pattern)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Tabs` | — (wrapper only) | *(no Bootstrap component class — structural wrapper div)* |
| TabList | `.react-aria-TabList` | Nav (tabs variant) | `.nav.nav-tabs` |
| Tab | `.react-aria-Tab` | Nav Link | `.nav-link` |
| SelectionIndicator | `.react-aria-SelectionIndicator` | — (no Bootstrap counterpart) | `[NO DIRECT COUNTERPART]` — React Aria's animated sliding indicator; Bootstrap uses border/background styling on `.nav-link.active` instead of an animated indicator element |
| TabPanels | `.react-aria-TabPanels` | Tab Content | `.tab-content` |
| TabPanel | `.react-aria-TabPanel` | Tab Pane | `.tab-pane` |

> Note on `.nav-item`: Bootstrap's standard nav structure wraps each `.nav-link` in a `.nav-item` `<li>`. React Aria's Tab renders as a `<div>` directly inside the TabList, with no `<li>` wrapper. The `.nav-item` wrapper is optional for basic `.nav-link` styling (patterns.md §1.2) but required for correct flex layout and border-radius. Apply `.nav-item` to a wrapper around each Tab if exact Bootstrap layout is needed.

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| `variant` | `variant="underline"` (default), `variant="tabs"`, `variant="pills"` | `.nav-underline` (default), `.nav-tabs`, `.nav-pills` | Bootstrap | `.nav-underline` is default — closest to React Aria's SelectionIndicator style and adapts most naturally to vertical orientation |
| Fill/Justify | (none) | `.nav-fill`, `.nav-justified` | Bootstrap | Applied to TabList |
| Orientation | `orientation="horizontal"` (default), `orientation="vertical"` | `.nav-tabs` (horizontal only) | Bootstrap (horizontal); Custom CSS (vertical) | Bootstrap has no vertical tabs modifier; vertical requires custom CSS: `flex-direction: column` on TabList, `border-inline-end` instead of `border-bottom`, active tab uses inline border |
| Keyboard activation | `keyboardActivation="automatic"` / `"manual"` | (none) | React Aria | No Bootstrap equivalent; no visual impact |

**Vertical orientation CSS delta (M017):**
Minimum changes for `orientation="vertical"`:
```css
.react-aria-Tabs[data-orientation=vertical] > .react-aria-TabList {
  flex-direction: column;
  border-bottom: none;
  border-inline-end: 1px solid var(--bs-nav-tabs-border-color, var(--bs-border-color));
}
.react-aria-Tabs[data-orientation=vertical] > .react-aria-TabList .react-aria-Tab[data-selected] {
  border-inline-end-color: transparent; /* or active background */
}
```

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-nav-link-color` | Tab | Default tab text color |
| `--bs-nav-link-hover-color` | Tab | Hover tab text color |
| `--bs-nav-link-padding-y` | Tab | Tab vertical padding |
| `--bs-nav-link-padding-x` | Tab | Tab horizontal padding |
| `--bs-nav-tabs-link-active-color` | Tab | Active (selected) tab text color |
| `--bs-nav-tabs-link-active-bg` | Tab | Active tab background (white by default on `.nav-tabs`) |
| `--bs-nav-tabs-link-active-border-color` | Tab | Active tab border color |
| `--bs-nav-tabs-border-color` | TabList | Bottom border of the nav tabs container |
| `--bs-nav-tabs-border-radius` | Tab | Tab border radius |

### Bootstrap utilities

*(none prescribed by Bootstrap docs for Nav / Tabs)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Selected (active tab) | `[data-selected]` | Tab | `.nav-link.active` | Compound selector bridge: `.react-aria-Tab[data-selected]` → `color: var(--bs-nav-tabs-link-active-color); background-color: var(--bs-nav-tabs-link-active-bg); border-color: var(--bs-nav-tabs-link-active-border-color)` |
| Hovered | `[data-hovered]` | Tab | `.nav-link:hover` | No bridge needed — `:hover` pseudo fires on the native element |
| Focused | `[data-focused]` | Tab | `:focus` | No bridge needed |
| Focus visible | `[data-focus-visible]` | Tab | `:focus-visible` | No bridge needed — Bootstrap uses `:focus-visible` for nav-link focus rings |
| Disabled | `[data-disabled]` | Tab | `.nav-link.disabled` / `.nav-link:disabled` | Compound selector bridge: `.react-aria-Tab[data-disabled]` → `color: var(--bs-nav-link-disabled-color); pointer-events: none` |
| Pressed | `[data-pressed]` | Tab | `:active` | No bridge needed — `:active` fires naturally |
| Panel visible | Active tab panel is rendered | TabPanel | `.tab-pane.show.active` | React Aria manages visibility natively — do NOT apply `.tab-pane` unless the companion `display: block` bridge is also in place (patterns.md §2.7). Safest approach: do not apply `.tab-pane`; rely on React Aria's own visibility, only borrow Bootstrap tokens |
| Panel focus visible | `[data-focus-visible]` | TabPanel | *(no Bootstrap equivalent)* | Custom CSS only |
| Panel inert | `[data-inert]` | TabPanel | `display: none` on inactive `.tab-pane` | If `.tab-pane` IS applied, add companion bridge: `.react-aria-TabPanel[data-inert] { display: none }` — but React Aria's default behavior already hides inactive panels without this class |
| Panel entering | `[data-entering]` | TabPanel | `.tab-pane.fade` + `.tab-pane.show` | No Bootstrap class equivalent; use CSS opacity transition on `[data-entering]`/`[data-exiting]` |
| Orientation | `[data-orientation]` | Root + TabList | *(no Bootstrap modifier for vertical tabs)* | CSS: `[data-orientation=horizontal]` → `.nav-tabs` pattern; `[data-orientation=vertical]` → custom CSS delta (see Variants) |

### DOM conflicts

| Sub-part | Conflict | Bootstrap expects | React Aria renders | Resolution |
|----------|----------|------------------|--------------------|------------|
| Tab active state | MINOR | `.nav-link.active` class | `[data-selected]` attribute on Tab | Compound selector bridge: `.react-aria-Tab[data-selected]` reproduces `.nav-link.active` styling |
| Tab panel visibility | MINOR | `.tab-pane.show.active` for visible; `display: none` for hidden | React Aria controls visibility via `[data-inert]` (or `hidden`) without class toggling | Two paths: (a) do not apply `.tab-pane` and rely on React Aria's visibility management + borrow only Bootstrap tokens; (b) apply `.tab-pane` with explicit `[data-inert] { display: none }` companion rule (patterns.md §2.7) |
| Tab wrapper | MINOR | `.nav-item` `<li>` wrapper around each tab | React Aria Tab renders as `<div>` without `<li>` wrapper | Apply `.nav-link` directly to `.react-aria-Tab`; omit `.nav-item` wrapper or add it as an explicit wrapper element if needed for flex layout |

### Decisions needed

*Resolved §1: Default variant is `.nav-underline` (`variant="underline"`); `.nav-tabs` and `.nav-pills` exposed via `variant` prop.*

*Resolved §2: Option A — do not apply `.tab-pane`; React Aria manages panel visibility via `[data-inert]`/`hidden`. Bootstrap panel tokens (padding etc.) applied selectively via compound selectors only.*

### Confidence: High

---

## Calendar

**React Aria root class:** `.react-aria-Calendar`
**Mapping type:** Composite — no root Bootstrap counterpart; sub-parts map to Bootstrap Button (nav controls and cells as visual pattern); grid sub-parts have no Bootstrap counterpart

[NO DIRECT COUNTERPART] — Bootstrap has no Calendar component. The closest structural pattern is a bare `<table>` grid for the day cells (without `.table`). The closest visual pattern for date cells is `.btn.btn-sm` (circular variant via CSS override). Nav buttons map directly to Bootstrap Button.

Alternatives considered:
- Bootstrap `.table` on CalendarGrid — rejected: `.table` is a data table pattern; a date grid has different semantics and Bootstrap's own `.table` styling (borders, stripe) is inappropriate
- Bootstrap Card as a wrapper — rejected: Card adds visual framing not inherent to Calendar; the root is a layout container, not a content card
- No Bootstrap classes at all — valid baseline; sub-part-level Bootstrap classes (on nav buttons and cells) provide visual coherence without a root class

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Calendar` | — (wrapper only) | *(no Bootstrap component class)* |
| PrevButton | `.react-aria-Calendar .react-aria-Button[slot=previous]` | Button | `.btn.btn-sm.btn-outline-secondary` + `border-color: transparent; color: var(--bs-body-color)` (ghost button pattern) |
| Heading | `.react-aria-Calendar .react-aria-Heading` | — (typography only) | *(no Bootstrap component class)* |
| NextButton | `.react-aria-Calendar .react-aria-Button[slot=next]` | Button | `.btn.btn-sm.btn-outline-secondary` + `border-color: transparent; color: var(--bs-body-color)` (ghost button pattern) |
| CalendarGrid | `.react-aria-CalendarGrid` | — (table structure) | *(no Bootstrap component class — bare `<table>`)* |
| CalendarGridHeader | `.react-aria-CalendarGridHeader` | — | *(no Bootstrap component class — bare `<thead>`)* |
| CalendarHeaderCell | `.react-aria-CalendarHeaderCell` | — | *(no Bootstrap component class — weekday `<th>` labels)* |
| CalendarGridBody | `.react-aria-CalendarGridBody` | — | *(no Bootstrap component class — bare `<tbody>`)* |
| CalendarCell | `.react-aria-CalendarCell` | Button (visual pattern only) | `.btn.btn-sm` + variant via `[data-selected]` compound selector |
| ErrorMessage | `.react-aria-Calendar [slot=errorMessage]` | — | *(no Bootstrap component class — color via `--bs-form-invalid-color` CSS variable override)* |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Nav button style | (none — icon buttons) | Ghost button: `.btn-outline-secondary` + `border-color: transparent; color: var(--bs-body-color)` | Custom CSS | No background or border by default; background appears on hover/focus; icon inherits `--bs-body-color` for light/dark theming |
| Cell unselected style | (none) | Ghost button: same pattern as nav buttons | Custom CSS | Unified ghost button pattern across nav controls and unselected date cells |
| Cell selected style | (none) | `.btn-primary` visual | Bootstrap | `[data-selected]` compound selector applies `.btn-primary` token values |
| Today indicator | (none) | [NO DIRECT COUNTERPART] | Custom CSS | `outline: 2px solid var(--bs-primary)` ring on `[data-today]` |

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-btn-font-size` | PrevButton, NextButton, CalendarCell | Button text/icon size (`btn-sm` sets this) |
| `--bs-btn-padding-x` | PrevButton, NextButton | Button horizontal padding |
| `--bs-btn-padding-y` | PrevButton, NextButton | Button vertical padding |
| `--bs-btn-border-radius` | CalendarCell | Base border-radius (override to `50%` for circular cells) |
| `--bs-btn-bg` | CalendarCell | Cell background for selected state |
| `--bs-btn-color` | CalendarCell | Cell text color |
| `--bs-btn-border-color` | CalendarCell | Cell border color |
| `--bs-btn-hover-bg` | CalendarCell | Hovered cell background |
| `--bs-btn-active-bg` | CalendarCell | Pressed cell background |
| `--bs-btn-disabled-color` | CalendarCell | Disabled cell text color |
| `--bs-form-invalid-color` | ErrorMessage | Error message text color |

### Bootstrap utilities

*(none prescribed by Bootstrap docs — no Bootstrap Calendar component exists)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Selected | `[data-selected]` | CalendarCell | `.btn-primary` visual (filled) | Compound selector: `.react-aria-CalendarCell[data-selected]` → apply `--bs-btn-bg: var(--bs-primary)`, `--bs-btn-color: #fff` |
| Hovered | `[data-hovered]` | CalendarCell | `:hover` | No bridge needed — CSS pseudo-class overlap |
| Pressed | `[data-pressed]` | CalendarCell | `:active` | No bridge needed — CSS pseudo-class overlap |
| Focused | `[data-focused]` | CalendarCell | `:focus` | No bridge needed — CSS pseudo-class overlap |
| Focus visible | `[data-focus-visible]` | CalendarCell | `:focus-visible` + Bootstrap focus ring | No bridge needed — CSS pseudo-class overlap; Bootstrap focus ring via `--bs-focus-ring-*` applies naturally |
| Disabled | `[data-disabled]` | CalendarCell | `.disabled` visual | Compound selector: `.react-aria-CalendarCell[data-disabled]` → `opacity: var(--bs-btn-disabled-opacity); pointer-events: none` |
| Disabled (root) | `[data-disabled]` | Root | Calendar-level disabled | Compound selector: `.react-aria-Calendar[data-disabled]` → `opacity: 0.5; pointer-events: none` |
| Today | `[data-today]` | CalendarCell | [NO DIRECT COUNTERPART] | Custom CSS: `outline: 2px solid var(--bs-primary)` ring on `.react-aria-CalendarCell[data-today]` |
| Outside month | `[data-outside-month]` | CalendarCell | (hidden) | Compound selector: `.react-aria-CalendarCell[data-outside-month] { display: none }` |
| Unavailable | `[data-unavailable]` | CalendarCell | [NO DIRECT COUNTERPART] | Compound selector: `.react-aria-CalendarCell[data-unavailable]` → `text-decoration: line-through; color: var(--bs-danger)` |
| Invalid (cell) | `[data-invalid]` | CalendarCell | `.is-invalid` visual | Compound selector: `.react-aria-CalendarCell[data-invalid]` → `--bs-btn-bg: var(--bs-danger); --bs-btn-color: #fff` |
| Invalid (root) | `[data-invalid]` | Root | Calendar-level invalid | Compound selector: `.react-aria-Calendar[data-invalid]` — triggers error message display |

### DOM conflicts

| Sub-part | Conflict | Bootstrap expects | React Aria renders | Resolution |
|----------|----------|------------------|--------------------|------------|
| CalendarCell | `.btn` targets `<button>` or `<a>`; CalendarCell renders `<div>` (inside `<td>`) | `<button>` element | `<div role="gridcell">` inside `<td>` | Apply `.btn.btn-sm` to `.react-aria-CalendarCell` (the `<div>`); visual styling works on `<div>`; `[data-*]` compound selectors replace pseudo-class state styling |
| CalendarGrid | Bootstrap `.table` applies to `<table>` data grids with borders/stripe | Data table with `.table` class | `<table>` used as a 7-column date grid | Do NOT apply `.table` — use bare `<table>` without Bootstrap table classes; calendar layout is not a data table |

### Decisions needed

*Resolved §1 + §2: Ghost button pattern — `.btn-outline-secondary` with `border-color: transparent; color: var(--bs-body-color)` override — applied uniformly to nav buttons (PrevButton, NextButton) and unselected CalendarCell. No background or border at rest; background appears on hover/focus. Icon and date text use `--bs-body-color` for light/dark theming.*

*Resolved §2 (selected): `.btn-primary` token values applied via `[data-selected]` compound selector.*

*Resolved §3: Today indicator — `outline: 2px solid var(--bs-primary)` ring on `[data-today]`.*

### Confidence: Low

*Reason: No Bootstrap Calendar component exists. All sub-part mappings are structural approximations. The cell visual pattern (`.btn.btn-sm` on a `<div>` inside a `<td>`) involves a DOM conflict. Multiple design decisions (Decisions needed §1–3) must be resolved before implementation. The `[data-today]` and `[data-unavailable]` states have no Bootstrap equivalent and require fully custom CSS.*

---

## ListBox

**React Aria root class:** `.react-aria-ListBox`
**Mapping type:** 1:1 — Bootstrap List Group

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-ListBox` | List Group | `.list-group` |
| ListBoxItem | `.react-aria-ListBoxItem` | List Group Item | `.list-group-item.list-group-item-action` |
| ListBoxSection | `.react-aria-ListBoxSection` | — (no Bootstrap section concept) | *(no Bootstrap component class)* [NO DIRECT COUNTERPART] |
| Header (section label) | `.react-aria-ListBoxSection .react-aria-Header` | — | *(no Bootstrap component class — custom styling required for section headers)* |
| SelectionIndicator | `.react-aria-ListBoxItem .react-aria-SelectionIndicator` | — (icon / Checkbox indicator) | Single-select: `<i class="bi bi-check">` per M013. Multi-select (`selectionMode="multiple"`): render `div.indicator` from Checkbox component; checked state bridges via `[data-selected]` |
| Text (label slot) | `.react-aria-ListBoxItem [slot=label]` | — | *(no Bootstrap component class — typography only)* |
| Text (description slot) | `.react-aria-ListBoxItem [slot=description]` | — | *(no Bootstrap component class — typography only)* |
| ListBoxLoadMoreItem | `.react-aria-ListBoxLoadMoreItem` | Spinner (Bootstrap) | `.spinner-border.spinner-border-sm` per M010 |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Item color | (none) | Bootstrap's default `.list-group-item.active` styling | Bootstrap | No `color` prop exposed; selected items use Bootstrap's active token values (`--bs-list-group-active-*`) via `[data-selected]` compound selector. Bootstrap's 8 contextual color classes (`.list-group-item-primary` etc.) are available for manual consumer use but out of scope as a component prop. |
| Orientation | `orientation="vertical"` (default) / `orientation="horizontal"` (with `layout="stack"`) | `.list-group` / `.list-group-horizontal` | Bootstrap | React Aria's `orientation="horizontal"` maps to `.list-group-horizontal`; `.list-group-horizontal-{breakpoint}` variants also available |
| Layout | `layout="stack"` (default) / `layout="grid"` | `.list-group` / [NO DIRECT COUNTERPART] | Bootstrap (stack), Custom CSS (grid) | No Bootstrap modifier for grid layout; `columns` prop controls column count in CSS delta (see M017 below) |
| Flush (no outer border/radius) | (none) | `.list-group-flush` | Out of scope | Out of scope as a component prop |
| Numbered | (none) | `.list-group-numbered` (requires `<ol>`) | Out of scope | Requires `<ol>` element; React Aria renders `<div>` — not implementable without render override |

**M017 CSS delta — `layout="grid"` (no Bootstrap modifier class):**

When `[data-layout=grid]` is present, React Aria renders items in a configurable column grid. A `columns` prop controls column count (default: 2). Minimum CSS override:
```css
.react-aria-ListBox[data-layout=grid] {
  display: grid;
  gap: 0.25rem;
}
.react-aria-ListBox[data-layout=grid][data-orientation=vertical] {
  grid-template-columns: repeat(var(--listbox-columns, 2), 1fr);
}
.react-aria-ListBox[data-layout=grid][data-orientation=horizontal] {
  grid-auto-flow: column;
  grid-template-rows: repeat(var(--listbox-columns, 2), auto);
  grid-auto-columns: 160px;
}
```
The `columns` prop sets `--listbox-columns` as an inline CSS custom property on the root element.

### Bootstrap tokens

| Token | Sub-part | Purpose |
|-------|----------|---------|
| `--bs-list-group-color` | ListBoxItem | Item text color |
| `--bs-list-group-bg` | ListBoxItem | Item background |
| `--bs-list-group-border-color` | Root, ListBoxItem | Container and item border color |
| `--bs-list-group-border-width` | Root, ListBoxItem | Border width |
| `--bs-list-group-border-radius` | Root | Container corner radius |
| `--bs-list-group-item-padding-x` | ListBoxItem | Item horizontal padding |
| `--bs-list-group-item-padding-y` | ListBoxItem | Item vertical padding |
| `--bs-list-group-active-color` | ListBoxItem (selected) | Selected item text color |
| `--bs-list-group-active-bg` | ListBoxItem (selected) | Selected item background |
| `--bs-list-group-active-border-color` | ListBoxItem (selected) | Selected item border color |
| `--bs-list-group-disabled-color` | ListBoxItem (disabled) | Disabled item text color |
| `--bs-list-group-disabled-bg` | ListBoxItem (disabled) | Disabled item background |
| `--bs-list-group-action-color` | ListBoxItem | Action item default text color |
| `--bs-list-group-action-hover-color` | ListBoxItem | Action item hover text color |
| `--bs-list-group-action-hover-bg` | ListBoxItem | Action item hover background |
| `--bs-list-group-action-active-color` | ListBoxItem | Action item active/pressed text color |
| `--bs-list-group-action-active-bg` | ListBoxItem | Action item active/pressed background |

### Bootstrap utilities

*(none prescribed by Bootstrap docs for List Group)*

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Selected | `[data-selected]` | ListBoxItem | `.list-group-item.active` | Compound selector: `.react-aria-ListBoxItem[data-selected]` → apply `--bs-list-group-active-*` tokens (Bootstrap JS never sets `.active` on React Aria items) |
| Hovered | `[data-hovered]` | ListBoxItem | `.list-group-item-action:hover` | No bridge needed — CSS pseudo-class overlap; Bootstrap's `--bs-list-group-action-hover-*` tokens apply via `:hover` |
| Pressed | `[data-pressed]` | ListBoxItem | `.list-group-item-action:active` | No bridge needed — CSS pseudo-class overlap; Bootstrap's `--bs-list-group-action-active-*` tokens apply via `:active` |
| Focused | `[data-focused]` | ListBoxItem | `:focus` | No bridge needed — CSS pseudo-class overlap |
| Focus visible (item) | `[data-focus-visible]` | ListBoxItem | `:focus-visible` + Bootstrap focus ring | No bridge needed — CSS pseudo-class overlap; Bootstrap focus ring fires on `:focus-visible` |
| Focus visible (root) | `[data-focus-visible]` | Root | Bootstrap focus ring on container | Compound selector: `.react-aria-ListBox[data-focus-visible]` → `outline: var(--bs-focus-ring-width) solid var(--bs-focus-ring-color)` |
| Disabled | `[data-disabled]` | ListBoxItem | `.list-group-item.disabled` | Compound selector bridge: `.react-aria-ListBoxItem[data-disabled]` → apply `--bs-list-group-disabled-*` tokens; Bootstrap's `.disabled` class not added by React Aria |
| Dragging | `[data-dragging]` | ListBoxItem | [NO DIRECT COUNTERPART] | Compound selector: `.react-aria-ListBoxItem[data-dragging] { opacity: 0.6 }` — custom CSS only |
| Drop target (item) | `[data-drop-target]` | ListBoxItem | [NO DIRECT COUNTERPART] | Compound selector: `.react-aria-ListBoxItem[data-drop-target]` → custom outline/background; no Bootstrap drag-drop token |
| Drop target (root) | `[data-drop-target]` | Root | [NO DIRECT COUNTERPART] | Compound selector: `.react-aria-ListBox[data-drop-target]` → custom outline; no Bootstrap equivalent |
| Empty | `[data-empty]` | Root | [NO DIRECT COUNTERPART] | Compound selector: `.react-aria-ListBox[data-empty]` → show empty state content; no Bootstrap equivalent |
| Loading more | `isLoading` prop | ListBoxLoadMoreItem | Bootstrap Spinner | Render `.spinner-border.spinner-border-sm` inside `ListBoxLoadMoreItem` when `isLoading` is true (M010) |
| Layout: grid | `[data-layout=grid]` | Root | [NO DIRECT COUNTERPART] | Custom CSS via compound selector (see M017 CSS delta above) |
| Orientation: horizontal | `[data-orientation=horizontal]` | Root | `.list-group-horizontal` | Add `.list-group-horizontal` modifier class; compound selector bridge for `[data-orientation=horizontal]` |

### DOM conflicts

| Sub-part | Conflict | Bootstrap expects | React Aria renders | Resolution |
|----------|----------|------------------|--------------------|------------|
| Root | `.list-group` typically applied to `<ul>` for semantic lists | `<ul>` element | `<div role="listbox">` | MINOR: Bootstrap docs also show `.list-group` on `<div>` and `<a>` wrappers; apply `.list-group` to `.react-aria-ListBox` div — fully valid per Bootstrap docs |
| ListBoxItem | `.list-group-item.active` set by Bootstrap JS | JavaScript adds/removes `.active` class | React Aria sets `[data-selected]` attribute | MINOR: Compound selector bridge: `.react-aria-ListBoxItem[data-selected]` applies `--bs-list-group-active-*` tokens; no `.active` class added |
| ListBoxSection | Bootstrap List Group has no section/group concept | No Bootstrap section element | `<section>` element grouping items | MINOR: No conflict per se — section renders semantically correctly; no Bootstrap class to apply; custom styling required for section headers |

### Decisions needed

*Resolved §1: Multi-select — `div.indicator` from Checkbox component per item; `[data-selected]` compound selector drives checked appearance. Consistent with Select multi-select resolution.*

*Resolved §2: No `color` prop — selected items use Bootstrap's default `.list-group-item.active` token values (`--bs-list-group-active-*`). Bootstrap's contextual color classes available for manual consumer use, out of scope as a prop.*

*Resolved §3: Flush variant — out of scope.*

*Resolved §4: Grid layout — `columns` prop (default: 2) sets `--listbox-columns` CSS custom property; CSS delta uses `repeat(var(--listbox-columns, 2), 1fr)` for configurable column count.*

### Confidence: High
