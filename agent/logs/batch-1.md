# Batch 1

## Components

- Select
- Button

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

### Select
- File: `stories/react-aria-bootstrap/reference/Select.reference.stories.tsx`
- Approved stories: `Default`, `States`, `Open`, `OpenItemStates`, `OpenGrouped`, `MultiSelect`

## Stage 4

### Select

**Decisions needed:**

- **D-form-select-class:** Select's trigger renders as a real `<button>` opening a real popover+listbox (structural counterpart: Dropdown Toggle `.btn.dropdown-toggle`), but conceptually the whole widget "is" a select (semantic/visual counterpart: Form Select `.form-select`). Per M014's bridge-complexity deciding signal, `.form-select` was chosen as the applied class (verified tag-independent via compiled-CSS grep — no `select.form-select`-qualified rule exists) since it already ships focus/disabled/invalid states matching what Select needs, whereas `.btn.dropdown-toggle` shares no token namespace with `.form-select` and would need near-total custom override to fake form-control appearance. Recorded as resolved in the taxonomy per M014/M019 (mechanical resolution, not a design fork) — no user input needed for this one; listed here for visibility only.
- **D-selected-indicator:** Select's `dropdown-item` renders a checkmark icon (lucide `Check`) when an item is selected, in the current pre-Bootstrap CSS (`src/ListBox.tsx`/`ListBox.css`). Bootstrap's own dropdown-item `.active` state (getbootstrap.com/docs/5.3/components/dropdowns/) uses only a background/text color change — no icon. Should the Bootstrap-styled reference keep a checkmark icon on the selected item, or rely solely on Bootstrap's native active background/color treatment with no icon?
  - **Answer:** Native `.active` only (no checkmark icon).
- **D-multi-select-scope:** Select's underlying API supports `selectionMode="multiple"`, but Bootstrap has no built-in multi-select dropdown-menu component or documented pattern (the closest unofficial recipe is checkbox inputs embedded inside `.dropdown-item`s). Should the reference stories include a multi-select variant for this pass, or is `selectionMode="single"` the only in-scope variant, with multiple explicitly deferred?
  - **Answer:** Include a `selectionMode="multiple"` variant as an additional reference story.
- **D-pressed-state:** The trigger's chosen Bootstrap class, `.form-select`, defines no `:active`/pressed visual treatment in Bootstrap's CSS (native `<select>` elements have no pressed state) — but React Aria's Button sub-part still fires `data-pressed` on every press. Should the pressed specimen render identically to the resting state (pure Bootstrap fidelity, since Bootstrap defines nothing here), or should it borrow a subtle background tint (e.g., from Dropdown Toggle's `:active`/`.show` treatment) as an enhancement beyond stock Bootstrap?
  - **Answer:** Borrow a subtle tint from Dropdown Toggle's `:active`/`.show` state for the pressed trigger specimen.

**Principles used:**
- `M001 dom-first`
- `M002 sub-parts`
- `M003 kb-sequence`
- `M004 bridge-selector`
- `M006 no-counterpart`
- `M007 compiled-css-authoritative`
- `M008 data-attrs`
- `M010 content-states`
- `M014 dual-counterpart`
- `M015 variant-authority`
- `M016 decisions-needed`
- `M018 elem-type-sub`
- `M019 m014-class-in-decisions`
- `M020 one-component-class`
- `P-001 faux-state-classes`
- `P-002 selector-context`
- `P-003 css-classes-not-inline`
- `P-004 flex-wrap-layout`
- `P-005 open-state-selected-value`
- `P-006 over-inclusion`
- `P-007 target-appearances-only`
- `P-008 label-every-specimen`
- `P-009 states-across-variant-families`
- `P-011 extract-reference-css`
- `P-013 verify-before-ready-for-review`
- `P-014 focus-not-identical-to-hover`
- `P-015 compiled-css-incomplete`
- `P-016 faux-focus-distinct-from-hover`
- `P-017 asymmetric-spacing-verification`
- `P-018 open-state-caret-rotation`

### Button
*(Populated during Stage 4)*

**Principles used:**
- *(e.g., `M016 decisions-needed`, `P-S001 faux-focus`)*

## Stage 5

### Select
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*

### Button
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*
