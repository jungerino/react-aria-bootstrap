---
title: Component Decisions
---

# Component Decisions

Resolved design and API decisions for each component. Open questions are tracked in `agent/review-iteration-N.md` until resolved, then recorded here.

---

## Button

### Outline variant API
**Decision:** Single combined `variant` prop. Accepts all 16 values: solid variants (`"primary"`, `"secondary"`, `"success"`, `"danger"`, `"warning"`, `"info"`, `"light"`, `"dark"`) and outline variants (`"outline-primary"`, `"outline-secondary"`, etc.). No separate `outline` boolean prop.

### `isPending` spinner rendering
**Decision:** Spinner is passed as children. The component switches between its normal children and the spinner child when `[data-pending]` is active. Matches React Aria's Vanilla CSS example pattern.

---

## ListBox

### Grid layout variant (`layout="grid"`)
**Decision:** Implement with custom CSS in `augments.scss`. Expose `grid-template-columns` as a configurable CSS custom property (`--list-group-grid-columns`, default 3). No gap between items — gap was removed as inconsistent with React Aria's ListBox grid intent.

**Border and corner radius technique:** The container carries the outer border and radius via the "background-as-border" pattern: `gap` and `padding` are both set to `--bs-list-group-border-width`; `background-color` is set to `--bs-list-group-border-color`. The container background shows through the gap (internal grid lines) and padding (outer border). No item-level borders are used.

**Corner radii:** `overflow: hidden` clipping is unreliable across browsers for grid children and fights Bootstrap's `.list-group-item:last-child { border-bottom-radius: inherit }` rule. Instead, explicit inner radii are set on the four corner items only: `calc(--bs-list-group-border-radius - --bs-list-group-border-width)` (concentric with the container). `:first-child` and `:last-child` cover two corners; `:nth-child(3)` and `:nth-last-child(3)` cover the other two and hardcode the default 3-column count.

### Section header visual
**Decision:** Custom CSS based on Bootstrap's `.dropdown-header` pattern (not a non-interactive list item or divider). Background: `--bs-secondary-bg` (gray-200) — structural background token, same value as `--bs-list-group-action-active-bg` but semantically correct for a non-interactive label. `--bs-tertiary-bg` (gray-100) was considered but rejected as too subtle to distinguish headers from items.

### Numbered list group
**Decision:** Out of scope.

### Sectioned list border model
**Decision:** When sections are present, the outer border and border-radius belong on the `.list-group` container (via `.list-group-sectioned` modifier), not on individual items. Items and section headers use only internal bottom borders. This prevents the broken-border appearance caused by non-item section header elements lacking side borders.

### Contextual item colors
**Decision:** Excluded from scope. Bootstrap's `.list-group-item-{variant}` per-item color classes are not exposed as a prop or passthrough.

### Selection indicator
**Decision:** Single-select has no indicator — selection is expressed purely via `.active` token styling (background + text color change). Multi-select (`selectionMode="multiple"`) uses Bootstrap's `.form-check-input` checkbox pattern as the sole selection indicator; `.active` background fill is NOT applied — the checked checkbox is sufficient and `.active` would be redundant.

---

## Select

### Trigger button styling strategy (M014)
**Decision:** Remove `.btn` from the trigger entirely and use `.form-select` class alone, relying on direct selector bridges for all states. Full state CSS written from scratch without inheriting `.btn` token behavior.

### FieldError visibility
**Decision:** Let React Aria control rendering — FieldError only renders when invalid. No always-present hidden element.

### Popover positioning
**Decision:** Use React Aria's placement props to position the popover below the trigger, matching Bootstrap's default dropdown placement.

### Validation state — valid
**Decision:** Skip the valid state entirely. Out of scope for this mapping.

---

## Calendar

### Cell shape
**Decision:** Circle — `border-radius: 9999px` via custom CSS in `augments.scss`.

### Date cell and nav button base class
**Decision:** Both use `.btn.btn-outline-secondary.btn-sm`. `--bs-btn-color` is overridden to `--bs-body-color` so text responds correctly to light/dark theme. `--bs-btn-border-color`, `--bs-btn-hover-border-color`, and `--bs-btn-active-border-color` are overridden to `transparent` — the 2px border on cells exists only to prevent layout shift when the today indicator appears.

### Cell and nav button sizing
**Decision:** Both are explicitly 2.5em × 2.5em with `padding: 0` and `display: flex; align-items: center; justify-content: center`. Nav button borders are transparent. Explicit dimensions guarantee a perfect square regardless of content width. The table sizes to content naturally; no `table-layout: fixed` or container query needed.

### "Today" visual indicator
**Decision:** Border ring — `border: 2px solid var(--bs-primary)`. All cells carry the same border thickness at all times (transparent by default) to prevent layout shift when the today border appears.

### Outside-month cells
**Decision:** Show muted — display with `.text-muted` color rather than hiding entirely.

### Unavailable date styling
**Decision:** `text-decoration: line-through` + `color: var(--bs-danger-text-emphasis)`.

---

## Tabs

### Default tab style
**Decision:** `.nav-underline` — thin underline on the active tab, no surrounding border.

### SelectionIndicator
**Decision:** Suppress — `display: none`. Active tab indication handled entirely by Bootstrap's `.nav-underline` token-based active border on the Tab itself.

### Panel visibility strategy
**Decision:** Skip `.tab-pane` entirely. TabPanel baseline is `display: block`; inactive panels hidden via `.react-aria-TabPanel[data-inert] { display: none }`. No Bootstrap visibility mechanism used.

### Vertical orientation
**Decision:** Custom CSS in `augments.scss`. The `.nav-underline` active underline (normally a bottom border) is repositioned to the right edge of the tab, becoming a sidescore — a vertical active indicator for the vertical layout.
