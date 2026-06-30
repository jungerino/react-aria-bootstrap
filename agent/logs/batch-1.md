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

### Button — Taxonomy and reference stories

Taxonomy written to `agent/taxonomies/button-taxonomy.md`.

**Mapping type:** 1:1 — root `<button>` maps directly to `.btn`; no composite sub-parts.

**Principles used:**
- M001 dom-first — Button renders `<button>`; maps directly to `.btn`
- M002 sub-parts — single root element; pending spinner is an M010 content-state child, not a structural sub-part
- M004 three-bridges — no bridge CSS required for Button's own states; all pseudo-classes fire on native `<button>` (Strategy 1 for all)
- M007 scss-verify — compiled CSS grepped for `.btn` state selectors; token names confirmed
- M008 data-attrs — full data-* surface enumerated from React Aria docs: `[data-hovered]`, `[data-pressed]`, `[data-focused]`, `[data-focus-visible]`, `[data-disabled]`, `[data-pending]`
- M010 content-states — `[data-pending]` drives a spinner child (`.spinner-border-sm`); Bootstrap's canonical pending-button pattern applied
- M015 variant-authority — Bootstrap's 17 variants (8 solid, 8 outline, 1 link) are the complete variant set; React Aria has no variant prop
- M016 decisions-needed — D1 (pending pattern) and D2 (variant scope) were pre-resolved in batch log; no new decisions surfaced
- P-001 faux-state-classes — `.btn.faux-hover`, `.btn.faux-focus-visible`, `.btn.faux-active` added to `presentation.scss`
- P-003 css-classes-not-inline — all visual CSS in `presentation.scss`; story file uses class names only
- P-004 flex-wrap — specimens in `display: flex; flex-wrap: wrap` containers
- P-010 absolute-overlay-centering — removed `top/left/transform: translate(-50%,-50%)` from `.btn-pending-spinner`; Bootstrap's `spinner-border` `@keyframes` replaces the entire `transform` value on every frame, wiping out the translate; `position: absolute` with no inset values correctly centers the spinner inside the `inline-flex` wrapper

### Select — Decisions needed

**D1 — Trigger caret approach**

Bootstrap's `.dropdown-toggle::after` generates a CSS caret pseudo-element. React Aria's typical Select implementation uses an explicit icon child (e.g., `<ChevronDown>`) inside the button. Two options:

- **(a) Suppress `::after` caret, use explicit icon child** — `.dropdown-toggle::after { display: none }` on the Select trigger; place a `<ChevronDown>` (or Bootstrap Icons chevron) inside the button as a React child. Matches `.form-select` visual appearance exactly (custom chevron icon).
- **(b) Accept Bootstrap's CSS caret** — keep `.dropdown-toggle::after`; no icon child needed. Results in Bootstrap's standard dropdown caret (small triangle), not `.form-select`'s chevron.

Option (a) matches the `.form-select` visual target more closely and gives implementation-phase control over icon source. Which should the reference story demonstrate?

**Answer:** Suppress `::after` caret — set `.dropdown-toggle::after { display: none }` on the Select trigger. Use an explicit Bootstrap Icons chevron child (`<i class="bi bi-chevron-down">`). Matches `.form-select` visual appearance.

### Select — Taxonomy

Taxonomy written to `agent/taxonomies/select-taxonomy.md`.

**Mapping type:** Composite — trigger maps to `.btn.dropdown-toggle` (structural) + `.form-select` tokens (visual); popover maps to `.dropdown-menu`; list items map to `.dropdown-item`; label maps to `.form-label`.

**Principles used:**
- M001 dom-first — trigger renders `<button>`, not `<select>`; mapped to `.btn.dropdown-toggle`
- M002 sub-parts — five distinct sub-parts identified with independent Bootstrap counterparts
- M004 three-bridges — compound selector bridges for `[data-selected]`, `[data-disabled]`, `[data-invalid]`, `[data-open]`
- M006 no-counterpart — Select root `<div>` and SelectValue `<span>` flagged as having no direct Bootstrap counterpart
- M007 scss-verify — compiled CSS grepped for `.form-select`, `.dropdown-item`, `.dropdown-menu`, `.dropdown-toggle` selectors; all token names verified
- M008 data-attrs — full data-* surface enumerated from React Aria TypeScript type definitions: Select (`[data-focused]`, `[data-focus-visible]`, `[data-disabled]`, `[data-open]`, `[data-invalid]`, `[data-required]`, `[data-placeholder]`); Button trigger (`[data-hovered]`, `[data-pressed]`, `[data-focused]`, `[data-focus-visible]`, `[data-disabled]`); ListBoxItem (`[data-hovered]`, `[data-pressed]`, `[data-selected]`, `[data-focused]`, `[data-focus-visible]`, `[data-disabled]`, `[data-selection-mode]`); Popover (`[data-trigger]`, `[data-placement]`, `[data-entering]`, `[data-exiting]`)
- M010 content-states — not applicable (no content-presence state like spinner)
- M012 custom-controls — not applicable (Select trigger is a real `<button>`)
- M014 dual-counterpart — trigger structural counterpart is `.btn.dropdown-toggle`; visual/semantic counterpart is `.form-select` (token overrides for sizing, padding, border, bg, border-radius)
- M015 variant-authority — Bootstrap dropdown-item states (`.active`, `.disabled`) are the authority for list items; React Aria-only values not mapped
- M016 decisions-needed — D1 (trigger caret) was pre-resolved in batch log; no new decisions surfaced
- M018 elem-type-sub — ListBoxItem renders `<div>` (not `<a>` or `<button>` as Bootstrap typically shows for `.dropdown-item`); `:disabled` pseudo will not fire on `<div>`; only `[data-disabled]` bridge applies

## Stage 4 / Iteration 2 — 2026-06-30

**Outcome:** Partial. Button reached `COMPONENT-STAGE-4-COMPLETE`. Select stories were written but not approved; iteration closed early to sync learnings. Select work carries forward to iter-3.

**Button:** Taxonomy and 4 reference stories (States, Pending, Variants, Sizes) approved; CSS extracted; committed. `COMPONENT-STAGE-4-COMPLETE`.

**Select:** Taxonomy written. 4 reference stories written (TriggerStates, OpenState, ItemStates, FormIntegration). Review surfaced three CSS bugs:
- Trigger border transparent in all states — root cause: `.btn` defaults `--bs-btn-*-border-color` to `transparent`; sub-agent patched the output `border-color` property instead of overriding the CSS variables, so Bootstrap's own state pseudo-classes re-applied the transparent value on hover/active. Fixed by setting `--bs-btn-hover-border-color` etc. on the element (P-012).
- Two carets rendering — `::after` triangle caret not suppressed despite D1 decision; fixed by adding `.dropdown-toggle.select-trigger::after { display: none }`.
- Focus item indistinguishable from hover — sub-agent saw Bootstrap's `:focus` rule uses the same tokens as `:hover` and concluded the states were visually identical, omitting `outline: auto -webkit-focus-ring-color`. Root cause: Bootstrap's CSS is not a complete description of visual appearance; the UA focus ring is active when `outline` is not suppressed (P-014, P-015, P-016).

**Principles added to component-agent.md:** P-012, P-013, P-014, P-015, P-016.

**Files synced to integration-batch-1:** `agent/mapping-and-references-skill/component-agent.md`, `agent/logs/batch-1.md`.

## Stage 5

*(Populated during Stage 5)*
