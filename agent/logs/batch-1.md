# Batch 1

## Components

- Button
- Select

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

## Stage 4

### batch-1/stage-4/iter-1

#### Button — Decisions needed

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

#### Select — Decisions needed

**D1 — Trigger caret approach**

Bootstrap's `.dropdown-toggle::after` generates a CSS caret pseudo-element. React Aria's typical Select implementation uses an explicit icon child (e.g., `<ChevronDown>`) inside the button. Two options:

- **(a) Suppress `::after` caret, use explicit icon child** — `.dropdown-toggle::after { display: none }` on the Select trigger; place a `<ChevronDown>` (or Bootstrap Icons chevron) inside the button as a React child. Matches `.form-select` visual appearance exactly (custom chevron icon).
- **(b) Accept Bootstrap's CSS caret** — keep `.dropdown-toggle::after`; no icon child needed. Results in Bootstrap's standard dropdown caret (small triangle), not `.form-select`'s chevron.

Option (a) matches the `.form-select` visual target more closely and gives implementation-phase control over icon source. Which should the reference story demonstrate?

**Answer:** Suppress `::after` caret — set `.dropdown-toggle::after { display: none }` on the Select trigger. Use an explicit Bootstrap Icons chevron child (`<i class="bi bi-chevron-down">`). Matches `.form-select` visual appearance.

### batch-1/stage-4/iter-2

**Outcome:** Partial. Button reached `COMPONENT-STAGE-4-COMPLETE`. Select stories were written but not approved; iteration closed early to sync learnings. Select work carries forward to iter-3.

**Button:** Taxonomy and 4 reference stories (States, Pending, Variants, Sizes) approved; CSS extracted; committed. `COMPONENT-STAGE-4-COMPLETE`.

**Select:** Taxonomy written. 4 reference stories written (TriggerStates, OpenState, ItemStates, FormIntegration). Review surfaced three CSS bugs:
- Trigger border transparent in all states — root cause: `.btn` defaults `--bs-btn-*-border-color` to `transparent`; sub-agent patched the output `border-color` property instead of overriding the CSS variables, so Bootstrap's own state pseudo-classes re-applied the transparent value on hover/active. Fixed by setting `--bs-btn-hover-border-color` etc. on the element (P-012).
- Two carets rendering — `::after` triangle caret not suppressed despite D1 decision; fixed by adding `.dropdown-toggle.select-trigger::after { display: none }`.
- Focus item indistinguishable from hover — sub-agent saw Bootstrap's `:focus` rule uses the same tokens as `:hover` and concluded the states were visually identical, omitting `outline: auto -webkit-focus-ring-color`. Root cause: Bootstrap's CSS is not a complete description of visual appearance; the UA focus ring is active when `outline` is not suppressed (P-014, P-015, P-016).

**Principles added to component-agent.md:** P-012, P-013, P-014, P-015, P-016.

**Files synced to integration-batch-1:** `agent/mapping-and-references-skill/component-agent.md`, `agent/logs/batch-1.md`.

#### Button — Taxonomy and reference stories

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

#### Select — Taxonomy

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

### batch-1/stage-4/iter-3

**Outcome:** Both components reached `COMPONENT-STAGE-4-COMPLETE`. Button: taxonomy + 4 reference stories + CSS extracted. Select: taxonomy + 4 reference stories + CSS extracted. Several review cycles surfaced new principles (P-008 amendment, P-017, P-018).

**Principles added to component-agent.md:** P-008 amendment (labels must not appear inside component visual containers), P-017 (asymmetric spacing verification), P-018 (open-state caret flip via CSS transform).

**Files synced to integration-batch-1:** `agent/mapping-and-references-skill/component-agent.md`, `agent/logs/batch-1.md`.

#### Button

**Taxonomy:** `agent/taxonomies/button-taxonomy.md`
**Reference stories:** `stories/react-aria-bootstrap/reference/Button.reference.stories.tsx`
**Presentation CSS:** `stories/react-aria-bootstrap/presentation.scss`

**Stories written:**
- `Bootstrap Reference/Button — Color Variants — Solid` (9 solid variants incl. link)
- `Bootstrap Reference/Button — Color Variants — Outline` (8 outline variants)
- `Bootstrap Reference/Button — Sizes` (sm / default / lg)
- `Bootstrap Reference/Button — States` (Solid Primary + Outline Primary state matrix)

**Reference CSS extracted (approved, P-011):**
- `agent/artifacts/reference-css/button-ColorVariantsSolid.css` (86 rules)
- `agent/artifacts/reference-css/button-ColorVariantsOutline.css` (86 rules)
- `agent/artifacts/reference-css/button-Sizes.css` (87 rules)
- `agent/artifacts/reference-css/button-States.css` (92 rules)

**Decisions resolved in taxonomy:**
- D1: Pending specimen uses plain Bootstrap spinner HTML (`.spinner-border-sm`) per P-007 (reference stories = visual target).
- D2: States story covers both Solid and Outline Primary per P-009 (structurally distinct hover mechanism).

**Principles used:**
- M001 (dom-first) — Button renders `<button>`; exact match for Bootstrap's `.btn`. No element substitution.
- M002 (sub-parts) — Single root element; pending spinner identified as state-driven child per M010.
- M004 (three-bridges) — All Button pseudo-classes (`:hover`, `:focus-visible`, `:active`, `:disabled`) fire natively; no compound selector bridges needed.
- M008 (data-attrs) — Full `data-*` surface enumerated from React Aria docs.
- M010 (content-states) — Pending state drives `.spinner-border-sm` child element; scanned Bootstrap catalog; canonical spinner pattern confirmed in Bootstrap docs.
- M015 (variant-authority) — Bootstrap's `.btn-{color}` / `.btn-outline-{color}` / `.btn-sm` / `.btn-lg` are authoritative variant set.
- M016 (decisions-needed) — Two decisions surfaced and resolved within taxonomy (D1, D2).
- P-001 (faux-states) — `.btn.faux-hover`, `.btn.faux-focus`, `.btn.faux-active` added to `presentation.scss`; focus source checked against compiled CSS; `--bs-btn-focus-box-shadow` token used.
- P-002 (selector-context) — Button is single-element; no ancestor/sibling context required.
- P-004 (flex-wrap) — Flex-wrap layout used for all specimen rows.
- P-007 (target-appearances-only) — No unstyled baseline specimens included.
- P-008 (labels) — All specimens labeled; States story labels variant families.
- P-009 (state-matrix-coverage) — States story shows full state matrix for both Solid and Outline Primary.
- P-013 (verify-before-emitting) — Analytical verification: token chain confirmed via Bootstrap compiled CSS grep; focus ring token confirmed distinct from hover.
- P-016 (focus-not-identical-to-hover) — `.btn-primary` and `.btn-outline-primary` both define `--bs-btn-focus-shadow-rgb`; focus box-shadow produces visible ring absent from hover.

#### Select

**Taxonomy:** `agent/taxonomies/select-taxonomy.md`
**Reference stories:** `stories/react-aria-bootstrap/reference/Select.reference.stories.tsx`
**Presentation CSS:** `stories/react-aria-bootstrap/presentation.scss`

**Mapping type:** Composite (M002)
- Trigger → `.btn.dropdown-toggle` (structural) + `.form-select` token overrides (visual) — M014 dual-counterpart
- Popover → `.dropdown-menu`
- ListBoxItem → `.dropdown-item`
- Label → `.form-label`
- FieldError → `.invalid-feedback`
- Description → `.form-text`

**Stories written:**
- `Bootstrap Reference/Select — Trigger States`
- `Bootstrap Reference/Select — Popover & Items`
- `Bootstrap Reference/Select — Form Field`
- `Bootstrap Reference/Select — Sizes`

**Review cycles:**
- Trigger States: extra `padding-right: 2.25rem` on trigger pushed chevron inward — value exists in `.form-select` to reserve space for a `background-image` chevron, which is absent in the reference component. Removed per P-017.
- Popover & Items: state labels injected as text nodes inside the dropdown menu container. Replaced with item-text-as-label per amended P-008.
- Popover & Items: open-state trigger did not flip the chevron. Added `.faux-open svg { transform: rotate(180deg) }` per new P-018.

**Principles added this iteration:**
- P-008 amendment — labels must not appear inside a component's visual container; item text serves as the label for collection components
- P-017 — asymmetric spacing reserving clearance for an absent element or background-image must be eliminated
- P-018 — open-state specimens must show the caret flipped 180° via CSS transform (mirrors P024 in react-aria-skill)

**Principles used:**
- M001 (dom-first) — Select renders `<button>` + Popover + ListBox; does NOT map to `.form-select` (`<select>`).
- M002 (sub-parts) — 8 named sub-parts identified; each with independent Bootstrap counterpart.
- M014 (dual-counterpart) — Trigger is structurally `.btn.dropdown-toggle` but visually `.form-select`; token overrides applied to structural counterpart.
- M004 (three-bridges) — Trigger pseudo-classes fire natively; compound selector bridges needed for `[data-open]`, `[data-invalid]`, `[data-selected]` on items, `[data-disabled]` on items.
- M007 (scss-verify) — Compiled CSS grepped for `.dropdown-item`, `.dropdown-menu`, `.form-select`, `.btn` state selectors; all tokens confirmed.
- M008 (data-attrs) — Full `data-*` surface enumerated from React Aria docs for Select, Button, ListBoxItem.
- M015 (variant-authority) — Bootstrap's `.form-select-sm`/`.form-select-lg` size modifiers are authoritative.
- M018 (elem-type-sub) — ListBoxItem renders `<div>` where Bootstrap expects `<a>`/`<button>`; `:disabled` pseudo is INERT on `<div>`; bridge required.
- P-017 — asymmetric `padding-right` from `.form-select` eliminated (no background-image chevron present).
- P-018 — open-state trigger specimen shows chevron rotated 180° via `.faux-open`.

## Stage 5

*(Populated during Stage 5)*
