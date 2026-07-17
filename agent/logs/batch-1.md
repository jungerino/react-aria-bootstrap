# Batch 1

## Components

- Select
- Button

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

### Select
- File: `stories/react-aria-bootstrap/reference/Select.reference.stories.tsx`
- Approved stories: `Default`, `States`, `Open`, `OpenItemStates`, `OpenGrouped`, `MultiSelect`

### Button
- File: `stories/react-aria-bootstrap/reference/Button.reference.stories.tsx`
- Approved stories: `Default`, `Sizes`, `States`, `Pending`, `IconOnly`

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

**Decisions needed:**

- **D-variant-scope:** Button's current `variant` prop (repo-defined, not a React Aria API) uses non-Bootstrap values (`'primary' | 'secondary' | 'quiet'`). Bootstrap offers 9 solid variants (`.btn-primary/-secondary/-success/-info/-warning/-danger/-light/-dark/-link`) and 8 outline variants (`.btn-outline-{primary,secondary,success,info,warning,danger,light,dark}`) with no React Aria prop equivalent. Per M015, Bootstrap's variant vocabulary is authoritative and the existing `'quiet'` value has no Bootstrap counterpart. Which variants should the `variant` prop expose — the full 17, a curated subset, both solid and outline, or something else — and should `'quiet'` be dropped or mapped to something (e.g. `.btn-link` or an outline variant)?
  - **Answer:** Full Bootstrap set (primary/secondary/success/danger/warning/info/light/dark/link + their `.btn-outline-*` counterparts — 17 total). Drop `'quiet'` entirely — no Bootstrap counterpart, not aliased.
- **D-size-scope:** Bootstrap offers `.btn-sm`/`.btn-lg` size modifiers with no existing React Aria Button prop. Should this reference pass expose a `size` prop, or leave size out of scope for now?
  - **Answer:** Include sizing — expose `.btn-sm`/`.btn-lg` as a `size` prop this pass, alongside default.
- **D-icon-only-scope:** The vanilla-starter CSS special-cases icon-only buttons (`:has(> svg:only-child)`) into a fixed-size circle with no padding — Bootstrap has no built-in icon-button component (`[NO DIRECT COUNTERPART]`, M006). Should this pass include an icon-only circular/square button variant in the reference stories, or defer it?
  - **Answer:** Include an icon-only circular/square button variant as a custom (non-Bootstrap-precedented) recipe.
- **D-pending-indicator-composition:** Button's pending state renders a nested `<ProgressCircle>` (a separate React Aria component, not yet given a Bootstrap mapping in this batch — batch-1 scopes only Select and Button). Bootstrap's own documented pending-button pattern is flat: `.spinner-border.spinner-border-sm` + a status-text node, both direct children of `.btn`. Should the Bootstrap-styled Button render raw Bootstrap spinner markup in place of `<ProgressCircle>` for its pending indicator, or keep composing `<ProgressCircle>` and bridge Bootstrap's spinner look onto its own output (which would make `<ProgressCircle>`'s Bootstrap treatment a dependency of Button's pending story)?
  - **Answer:** Raw Bootstrap spinner markup (`.spinner-border-sm`) — self-contained, do not compose ProgressCircle since it hasn't had its own Stage 4 pass yet.

**Principles used:**
- `M001 dom-first`
- `M002 sub-parts`
- `M003 kb-sequence`
- `M006 no-counterpart`
- `M007 compiled-css-authoritative`
- `M008 data-attrs`
- `M010 content-states`
- `M015 variant-authority`
- `M016 decisions-needed`
- `M020 one-component-class`
- `P-001 faux-state-classes`
- `P-003 css-classes-not-inline`
- `P-004 flex-wrap-layout`
- `P-006 over-inclusion`
- `P-007 target-appearances-only`
- `P-008 label-every-specimen`
- `P-009 states-across-variant-families`
- `P-011 extract-reference-css`
- `P-013 verify-before-ready-for-review`
- `P-014 focus-not-identical-to-hover`
- `P-015 compiled-css-incomplete`
- `P-016 faux-focus-distinct-from-hover`

## Stage 5

### Select
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*

### Button
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*
