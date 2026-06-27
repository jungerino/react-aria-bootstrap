# Batch 1

## Components

- Button
- Select

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

## Stage 4

### Button — Decisions needed

**D1 — Pending state visual pattern**

React Aria's `isPending` prop enables a loading state. Bootstrap's canonical pattern places `.spinner-border-sm` inside the button while the label is hidden. Two options for the reference story:

- **(a) Hidden label + spinner overlay:** `visibility: hidden` on label content + spinner rendered via `position: absolute` overlay. Button width stays stable (no resize on pending).
- **(b) Label replaced by spinner:** Label removed from DOM / hidden with `display: none`; spinner takes its place. Button may resize.

Option (a) matches Bootstrap's own docs example most closely. Which should the reference story demonstrate?

**Answer:** Hidden label + spinner overlay. Label stays in the DOM with `visibility: hidden`; spinner is positioned absolutely over the button center. Button width stays stable during the pending state.

**D2 — Variant scope for reference stories**

Bootstrap offers 17 button variants (8 solid `.btn-{color}`, 8 outline `.btn-outline-{color}`, 1 `.btn-link`). Should the Variants reference story show:

- **(a) All 17 variants** — complete coverage, larger story
- **(b) Representative subset** — e.g., primary, secondary, danger, outline-primary, btn-link (5 variants)

Which scope is preferred?

**Answer:** All 17 Bootstrap variants — 8 solid `.btn-{color}`, 8 outline `.btn-outline-{color}`, 1 `.btn-link`.

### Select — Decisions needed

**D1 — Trigger caret approach**

Bootstrap's `.dropdown-toggle::after` generates a CSS caret pseudo-element. React Aria's typical Select implementation uses an explicit icon child (e.g., `<ChevronDown>`) inside the button. Two options:

- **(a) Suppress `::after` caret, use explicit icon child** — `.dropdown-toggle::after { display: none }` on the Select trigger; place a `<ChevronDown>` (or Bootstrap Icons chevron) inside the button as a React child. Matches `.form-select` visual appearance exactly (custom chevron icon).
- **(b) Accept Bootstrap's CSS caret** — keep `.dropdown-toggle::after`; no icon child needed. Results in Bootstrap's standard dropdown caret (small triangle), not `.form-select`'s chevron.

Option (a) matches the `.form-select` visual target more closely and gives implementation-phase control over icon source. Which should the reference story demonstrate?

**Answer:** Suppress `::after` caret — set `.dropdown-toggle::after { display: none }` on the Select trigger. Use an explicit Bootstrap Icons chevron child (`<i class="bi bi-chevron-down">`). Matches `.form-select` visual appearance.

## Stage 5

*(Populated during Stage 5)*
