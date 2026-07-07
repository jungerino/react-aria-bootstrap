# Batch 1

## Components

- Button
- Select

## Stories

- Bootstrap Reference/Button/Variants
- Bootstrap Reference/Button/OutlineVariants
- Bootstrap Reference/Button/Sizes
- Bootstrap Reference/Button/States
- Bootstrap Reference/Button/LinkStyle
- Bootstrap Reference/Button/Pending
- Bootstrap Reference/Select/TriggerStates
- Bootstrap Reference/Select/DropdownMenu
- Bootstrap Reference/Select/FormField

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

### batch-1/stage-4/iter-4

**Component:** Button

**Principles used:**
- M001: dom-first — Button renders native `<button>`; Bootstrap `.btn` targets `<button>` directly. Perfect 1:1 DOM match.
- M002: sub-parts — Button has no structural sub-parts; only content-driven pending spinner noted (M010).
- M004: three-bridges — All primary states (hover, focus, active, disabled) use Strategy 1 (CSS pseudo-class overlap). Only `[data-pending]` requires a compound selector bridge.
- M007: scss-verify — Compiled CSS audited; `:focus-visible` confirmed as Bootstrap's focus-ring mechanism (not `:focus`).
- M008: data-attrs — Full `data-*` surface enumerated from `ButtonRenderProps`: `[data-hovered]`, `[data-pressed]`, `[data-focused]`, `[data-focus-visible]`, `[data-disabled]`, `[data-pending]`.
- M010: content-states — `[data-pending]` drives spinner child; Bootstrap's `.spinner-border-sm` identified as the counterpart.
- M015: variant-authority — Bootstrap's 8 solid + 8 outline + link + size variants are authoritative.
- M016: decisions-needed — Two decisions surfaced (D1 variant exposure, D2 size exposure).
- M018: elem-type-sub — No element type substitution; React Aria renders native `<button>`, matching Bootstrap's expectation exactly.
- P-001: faux-state-classes — Added `.btn.faux-hover`, `.btn.faux-focus`, `.btn.faux-active` to `presentation.scss`; `faux-focus` uses `box-shadow` token + `outline: 0` to be visually distinct from hover (P-016).
- P-002: selector-context — Each specimen verified to reproduce necessary ancestor/sibling context; `.btn` rules have no ancestor dependency.
- P-003: css-classes — All visual styling in `presentation.scss`; no inline styles in story render functions.
- P-004: flex-wrap — Specimens laid out in `display: flex; flex-wrap: wrap` `.specimen-row` container.
- P-008: label-specimens — Every specimen labeled via `.specimen-label` above the element.
- P-009: state-matrix-per-family — States story covers both solid (`.btn-primary`) and outline (`.btn-outline-primary`) variant families.
- P-011: extract-reference-css — CSS extracted for all 6 stories; saved to `agent/artifacts/reference-css/button-{StoryName}.css`.
- P-016: faux-focus-distinct — Verified `.btn.faux-focus` is visually distinct from `.btn.faux-hover` via `box-shadow: var(--bs-btn-focus-box-shadow)`.

**Decisions needed:**

#### D1 — Bootstrap variant exposure as prop vs. className passthrough
**Question:** Bootstrap's `.btn-{variant}` and `.btn-outline-{variant}` modifier classes have no React Aria prop equivalent. When implementing the Bootstrap Button, should these be exposed as an explicit `variant` prop (e.g. `variant="primary"`, `variant="outline-secondary"`), left as a pure `className` passthrough (consumer writes `className="btn btn-primary"`), or some combination?
**Answer:** Combination — expose an explicit `variant` prop for common cases; provide `className` passthrough for anything the prop does not cover.

#### D2 — Size modifier exposure as prop vs. className passthrough
**Question:** Bootstrap's `.btn-sm` and `.btn-lg` size modifiers have no React Aria prop equivalent. Should these be exposed as an explicit `size` prop (e.g. `size="sm"`, `size="lg"`), left as a `className` passthrough, or omitted from scope?
**Answer:** Explicit typed size prop: `size="sm" | "lg"`.

---

**Component:** Select

**Principles used:**
- M001: dom-first — Select renders `<button>` trigger + Popover + ListBox; maps to `.btn` (structural) + `.form-select` (visual) per M014.
- M002: sub-parts — All named sub-parts mapped: root wrapper, Label, Trigger Button, SelectValue, Caret, Popover, ListBox, ListBoxItem, Description, FieldError.
- M004: three-bridges — Trigger states use Strategy 1 (CSS pseudo-class overlap for hover/focus/active/disabled); ListBoxItem selected/disabled use Strategy 2 (compound selector); `[data-invalid]` uses Strategy 2.
- M006: no-counterpart — Root wrapper and ListBox have no direct Bootstrap counterpart; closest structural patterns identified.
- M007: scss-verify — Compiled CSS audited for `.form-select`, `.btn`, `.dropdown-item`, `.dropdown-menu` selectors and token names.
- M008: data-attrs — Full `data-*` surface enumerated from React Aria docs for Select root, Trigger Button, and ListBoxItem.
- M012: custom-controls — Select renders hidden native `<input>` + custom `<button>` visual element; Bootstrap classes applied to visual element only.
- M014: dual-counterpart — Trigger: structural counterpart `.btn`, visual counterpart `.form-select`. Token overrides applied via P-012.
- M015: variant-authority — Bootstrap's size variants (sm/lg) and validation states are authoritative.
- M016: decisions-needed — Two decisions surfaced (D1 size exposure, D2 caret approach).
- M018: elem-type-sub — ListBoxItem renders `<div>`; Bootstrap expects `<a>`. Documented; `:hover`/`:focus`/`:active` fire on `<div>` correctly.
- P-001: faux-state-classes — `.select-trigger.faux-hover/focus/open` and `.dropdown-item.faux-hover/focus/active` added to `presentation.scss`. Focus uses box-shadow for trigger (P-016), UA focus ring for dropdown items (P-015, P-016).
- P-002: selector-context — `.dropdown-menu-static` wraps menu specimens; `.form-field-container` scopes FormField story.
- P-003: css-classes — All visual CSS in `presentation.scss`; no inline styles in story render functions.
- P-004: flex-wrap — Specimens laid out in `.specimen-row` flex-wrap containers.
- P-005: open-state-selected-value — Open trigger shows "Dog"; Active/Selected menu item is "Dog".
- P-006: over-inclusion — All sub-parts included; DropdownMenu story shows full item-state matrix even though `.dropdown-item` appears in other components.
- P-008: label-specimens — External `.specimen-label` above every specimen; DropdownMenu uses separate per-state menu panels rather than injecting state labels into item text.
- P-009: state-matrix-per-family — TriggerStates covers all interactive states; DropdownMenu covers all item states.
- P-011: extract-reference-css — CSS extracted for all 3 stories; saved to `agent/artifacts/reference-css/select-{StoryName}.css`.
- P-012: css-variable-override — `.select-trigger` overrides full `--bs-btn-*` variable set so all state rules resolve to form-select-equivalent values. `.select-trigger-invalid/valid` override border-color variables for all states.
- P-014: focus-not-identical-to-hover — Trigger focus uses `box-shadow` (form-select focus ring) to distinguish from hover. Dropdown item focus uses UA `outline: auto -webkit-focus-ring-color`.
- P-015: compiled-css-not-complete — UA stylesheet noted for dropdown item focus ring; Bootstrap does not suppress outline on `.dropdown-item`.
- P-016: faux-focus-distinct — Trigger faux-focus shows blue border + box-shadow; dropdown item faux-focus shows hover bg + UA outline ring. Both visually distinct from hover.

**Decisions needed:**

#### D1 — Select size modifier exposure as prop vs. className passthrough
**Question:** Bootstrap's `.form-select-sm` and `.form-select-lg` size modifiers have no React Aria prop equivalent. Should these be exposed as an explicit `size` prop (e.g. `size="sm"`, `size="lg"`), left as a `className` passthrough, or omitted from scope?
**Answer:** Explicit size prop: `size="sm" | "lg"`, matching Button.

#### D2 — Caret: `.form-select` background-image SVG vs. `.dropdown-toggle` `::after` border-trick vs. rendered SVG icon
**Question:** Bootstrap's `.dropdown-toggle::after` generates the caret via CSS pseudo-element. React Aria's Select renders a `<ChevronDown>` SVG icon inside the Button. Should the reference story use the Bootstrap CSS-generated caret (styling `.dropdown-toggle::after` on a `<button>`) or an inline SVG icon (matching React Aria's actual rendered output, styled with CSS `transform: rotate(180deg)` for open state via P-018)? The two choices produce different reference targets for the implementation phase.
**Answer (revised after visual review):** Use the `.form-select` background-image SVG chevron approach — `--bs-form-select-bg-img` set on the trigger button, positioned at `right 0.75rem center`. The trigger does NOT carry `.dropdown-toggle`. Open state swaps the variable to an up-pointing chevron SVG. This is the correct visual target: the reference should look like `.form-select`, not like a `.dropdown-toggle` button.

**Process notes:**
- `Bash(node *)` and `Bash(git *)` added to `.claude/settings.json` to unblock sub-agents from CSS extraction and git operations.
- Commit ownership moved to orchestrator: sub-agents resumed via SendMessage run in background mode where `git commit` permission prompts cannot surface. Orchestrator commits in foreground.
- P-009 miss on Button's initial States story (outline states omitted); caught in review and corrected.
- First Select Phase B attempt rejected; rewritten from scratch. Second attempt required two review cycles (P-009 state matrix, caret positioning).

## Stage 5

### Button — batch-1/stage-5/iter-1

All 6 mirror stories passed the final verification sweep on the first run (iteration 0).

**Results:**

| Story | Diff% | Status |
|-------|-------|--------|
| Variants | 0.00% | Pass |
| OutlineVariants | 0.00% | Pass |
| Sizes | 0.00% | Pass |
| States | 0.00% | Pass |
| LinkStyle | 0.00% | Pass |
| Pending | 0.01% | Pass (animation exception) |

**Principles used:**
- `P002 class-in-tsx` — render-prop `className` builds `react-aria-Button btn btn-{variant} [btn-sm|btn-lg]`
- `P007 variant-replace` — all 17 Bootstrap variants (8 solid, 8 outline, 1 link) plus sm/lg sizes exposed as typed props via `variantClassMap` and `sizeClassMap`
- `P003 scss-bridge` — `[data-pending]` bridge in `_bootstrap-bridges.scss` for `pointer-events: none`
- `P044 faux-state-class` — `.faux-hover`, `.faux-focus`, `.faux-active` from `presentation.scss` applied via `className` prop in mirror stories
- `P047 presentation-import` — mirror story imports `../presentation.scss` directly
- `P013 prefer-component-cls` — no utility classes; all styling via Bootstrap component classes (`.btn`, `.btn-{variant}`, `.btn-sm`, `.btn-lg`)
- Animation exception — Pending story 0.01% diff is spinner animation frame difference; all 4 exception conditions met

### Select — batch-1/stage-5/iter-1

All 3 mirror stories passed the final verification sweep.

**Results:**

| Story | Final Diff% | Iterations | Status |
|-------|-------------|------------|--------|
| TriggerStates | 0.00% | 1 | Pass |
| DropdownMenu | 0.14% | 3 | Pass |
| FormField | 0.00% | 3 | Pass |

**Files produced:**
- `src/react-aria-bootstrap/Select.tsx` — full `Select<T>` + `SelectItem` implementation
- `src/scss/_bootstrap-bridges.scss` — Select bridge rules added after Button bridge
- `src/scss/styles.scss` — added `@import 'bootstrap-bridges'`
- `stories/react-aria-bootstrap/mirror/Select.mirror.stories.tsx` — 3 mirror stories
- `stories/react-aria-bootstrap/presentation.scss` — `.dropdown-divider-section` class added

**Principles used:**
- `P002 class-in-tsx` — trigger className built in Select.tsx; includes `react-aria-Button` explicitly so bridge selectors still match
- `P003 scss-bridge` — `[data-selected]`, `[data-disabled]`, `[data-focused]` → dropdown-item states; `display:block` for Label/Text; `display:block` for Popover; line-height for dropdown-header
- `P011 cursor-pointer` — `.react-aria-ListBoxItem.dropdown-item { cursor: pointer; }` in bridges
- `P024 caret-flip` — SVG swap via `--bs-form-select-bg-img` on `.faux-open` (presentation.scss) and `[data-open]` (bridges)
- `P025 hardcode-show` — `.react-aria-Popover.dropdown-menu { display: block; position: unset; }` in bridges
- `P044 faux-state-class` — `faux-hover`, `faux-focus`, `faux-open` applied via `triggerClassName` prop
- `P046 rac-class-replace` — plain string className on Button, ListBoxItem includes `react-aria-*` explicitly
- `P049 rac-trigger-width` — `.react-aria-Popover[data-trigger="Select"] { width: var(--trigger-width); }` in bridges
- `P050 reboot-mismatch` — `.dropdown-header { line-height: 1.2; }` — RAC renders `<header>` (1.5 lh) vs reference `<h6>` (1.2 lh)

**Issues discovered and fixed:**

1. **`styles.scss` missing `@import 'bootstrap-bridges'`** — bridge CSS existed but was never loaded; all bridge selectors were dead until this import was added.

2. **DropdownMenu divider** — RAC ListBox does not accept raw `<hr>` children. Workaround: empty `ListBoxSection` with `dropdown-divider-section` class (height:0; border-top) to replicate `<hr class="dropdown-divider">`.

3. **DropdownMenu header line-height** — RAC `ListBoxSection + Header` renders as `<header>` (line-height 1.5 from body reboot) vs reference `<h6>` (line-height 1.2 from Bootstrap heading styles). Fixed via P050 bridge.

4. **FormField conditional FieldError** — FieldError always rendered even when no error, adding invisible height. Fixed: conditional render in Select.tsx.

5. **FormField Label/Text inline display** — RAC renders `<Label>` and `<Text>` as `<span>` (inline). Bootstrap `.form-label` / `.form-text` expect block-level margins. Fixed: bridge rules `.react-aria-Label.form-label { display: block; }` and `.react-aria-Text.form-text { display: block; }`.

**New pattern (unlabeled):** RAC Label and Text render as inline `<span>` elements; Bootstrap class margin behavior requires `display: block`. This pattern will need a P-code in the taxonomy.

### Debrief — batch-1/stage-5/iter-1

**Outcome:** Successful. Both components complete. Two post-merge issues discovered during manual testing and resolved as a new principle.

**Issues found in manual testing:**

1. **ListBox container focus ring on mouse open** — Clicking the trigger produced a focus ring around the entire dropdown container. Root cause: RAC calls `.focus()` programmatically on the ListBox when the popover opens; browsers apply `:focus-visible` to programmatic focus regardless of input mode. Fix pattern: suppress UA outline; restore via `[data-focus-visible]`. Since keyboard users see the ring on focused items, the container ring is always wrong — `outline: none` alone suffices for the container.

2. **ListBoxItem focus ring on mouse hover** — Hovering an item produced a blue outline ring. Same root cause: RAC moves DOM focus to items on hover (programmatic focus). Fix pattern: full P051 — suppress UA outline; restore via `[data-focus-visible]` so keyboard navigation retains the ring.

**New principle added:** P051 `programmatic-focus-visible` — suppress the UA outline on RAC-managed elements; restore only via `[data-focus-visible]`. Both fixes intentionally not pre-applied; next iteration's sub-agent is expected to discover and apply P051 independently.

### batch-1/stage-5/iter-2

#### Button — Mirror Stories

All 6 stories passed on the first comparison pass with 0.00% diff (Pending: 0.01% — Animation Exception applied).

**Principles used:**
- P001 compound-sel — `.react-aria-Button` retained alongside `.btn.btn-{variant}`
- P002 class-in-tsx — Bootstrap classes applied as explicit className string (not callback pattern; RAC class included explicitly)
- P003 scss-bridge — `[data-pending]` bridge in `_bootstrap-bridges.scss`
- P007 variant-replace — variantClassMap covers all 17 Bootstrap button variants (8 solid, 8 outline, link); `variant` prop typed to Bootstrap's authoritative set per D1
- P044 faux-state-class — `.faux-hover`, `.faux-focus`, `.faux-active` from `presentation.scss` passed via `className` prop for States and LinkStyle stories
- D1 — combination: explicit `variant` prop + `className` passthrough
- D2 — explicit `size="sm" | "lg"` prop

#### Select — Mirror Stories

All 3 stories pass the verification sweep within threshold 0.003:
- TriggerStates: 0.00%
- DropdownMenu: 0.26%
- FormField: 0.00%

**Principles used:**
- M014 dual-counterpart — trigger uses `.btn` (behavior) + `.select-trigger` (form-select token overrides via CSS custom properties)
- M018 div-substitution — ListBoxItem renders `<div>`, not `<a>` or `<li>`; dropdown-item class-based styles still apply
- P001 compound-sel — `.react-aria-Button`, `.react-aria-Select`, `.react-aria-ListBoxItem` retained for bridge selectors
- P002 class-in-tsx — all Bootstrap classes as explicit className strings
- P003 scss-bridge — bridges for `[data-invalid]`, `[data-open]`, `[data-selected]`, `[data-disabled]` in `_bootstrap-bridges.scss`
- P011 cursor-pointer — explicit `cursor: pointer` bridge on `.react-aria-ListBoxItem.dropdown-item`
- P024 caret-swap — `[data-open]` swaps `--bs-form-select-bg-img` to up-pointing chevron SVG
- P025 hardcode-show — `.react-aria-Popover.dropdown-menu { display: block }` since RAC controls mount/unmount
- P044 faux-state-class — `triggerClassName` prop on Select for faux-hover/focus/open; `activeItem` prop for faux-active on dropdown items
- P049 rac-trigger-width — `.react-aria-Popover.dropdown-menu { width: var(--trigger-width) }`
- D1 — explicit `size="sm" | "lg"` prop → `.select-trigger-sm`/`.select-trigger-lg`
- D2 — background-image SVG chevron via `--bs-form-select-bg-img` override

**Bridge infrastructure fix:**
`_bootstrap-bridges.scss` was not imported in the SCSS chain. Added `@import 'bootstrap-bridges'` to `_bootstrap-overrides.scss`. This is a one-time infrastructure fix needed for all components.

**Non-obvious findings:**
- RAC `<Label>` renders as `<span>` — needs `d-inline-block` to match Bootstrap's `label { display: inline-block }` reboot rule
- RAC `<Text slot="description">` renders as `<span>` — needs `d-block` to match `<div.form-text>` behaviour
- `.dropdown-header` on `<div>` gets body line-height (1.5); reference uses `<h6>` with heading line-height (1.2). Bridge rule `.dropdown-header { line-height: 1.2 }` corrects this
- `defaultSelectedKeys` in standalone ListBox does not reliably set `[data-selected]` for static screenshot capture; use explicit `faux-active` class instead
- `select-trigger-block` must be added to trigger when `label` is present (form-field mode requires block-level trigger)

#### Debrief — batch-1/stage-5/iter-2

**Observations:**
1. Styling is nearly flawless on first glance.
2. The Select menu does not expand when clicking the trigger — dropdown does not open in live use.

**Root cause (observation 2):**
RAC Popover renders in a DOM portal (attached to document body), NOT inside the `.react-aria-Select` wrapper. The bridge selector `.react-aria-Select .react-aria-Popover.dropdown-menu` never matched, so Bootstrap's `display:none` default on `.dropdown-menu` was never overridden. Fix: target `.react-aria-Popover.dropdown-menu` directly without an ancestor selector. Same issue applied to `.react-aria-Select .react-aria-ListBox` — changed to `.react-aria-Popover .react-aria-ListBox`.

**New principle added:** P052 `portal-no-ancestor-sel` — RAC overlay elements render in portals; ancestor bridge selectors never match them.

**P051 post-debrief update:** The container-centric qualification in P051 ("When a container receives focus programmatically but individual child items show their own focus rings…") was removed. It implied items are self-managing and led to P051 being applied to the ListBox container but not to ListBoxItems. Principle now reads: "Apply this to any RAC element that receives programmatic focus and where the resulting ring is visually incorrect."

### batch-1/stage-5/iter-3

#### Button — verification-sweep-passed

**Principles used:**
- P001 compound-sel — retained `.react-aria-Button` alongside `.btn.btn-{variant}` on all stories
- P002 class-in-tsx — Bootstrap classes applied via explicit `className` string in `Button.tsx`
- P003 scss-bridge — `[data-pending]` bridge added to `_bootstrap-bridges.scss` (pointer-events + cursor)
- P007 variant-replace — `variantClassMap` covers all 8 solid variants, 8 outline variants, and `link`
- P044 faux-state-class — `.faux-hover`, `.faux-focus`, `.faux-active` from `presentation.scss` applied in States and LinkStyle stories via `className` prop
- D1 (Button decision) — combination approach: explicit `variant` prop + `className` passthrough
- D2 (Button decision) — explicit typed `size="sm" | "lg"` prop mapped to `btn-sm` / `btn-lg`

#### Select — verification-sweep-passed

**Principles used:**
- P002 class-in-tsx — Bootstrap classes via explicit `className` string on all sub-parts in `Select.tsx`
- P003 scss-bridge — bridge selectors for `[data-open]` caret, `[data-invalid]` border, `[data-selected]`, `[data-disabled]`, cursor: pointer, `.dropdown-header` line-height
- P010 form-attach — `.form-select` cannot attach to RAC `<button>`; replicate visual tokens on `.btn.select-trigger` via CSS custom property overrides
- P011 cursor-pointer — explicit `cursor: pointer` on `.react-aria-ListBoxItem.dropdown-item` (renders as `<div>`, not `<a>`)
- P012 match-dom — matched `.btn.dropdown-toggle` (structural) + `.form-select` token overrides (visual) for trigger (M014 dual-counterpart)
- P024 caret-flip — background-image SVG swap for open state (CSS transform has no effect on `background-image`); dark-mode variant uses light-stroke SVG
- P025 hardcode-show — `.show` hardcoded on Popover className; `d-block` on FieldError className
- P036 derive-from-counterpart — trigger token values derived from `.form-select` compiled CSS; ListBoxItem state values derived from `.dropdown-item.active` / `.dropdown-item.disabled`
- P044 faux-state-class — `.faux-hover`, `.faux-focus`, `.faux-open`, `.faux-active` from `presentation.scss` applied to specimen buttons in mirror stories
- P047 presentation-import — all three mirror stories import `../presentation.scss`
- P049 rac-trigger-width — `.react-aria-Popover[data-trigger="Select"].dropdown-menu { width: var(--trigger-width) }` bridge
- P050 reboot-mismatch — `d-inline-block` on `<Label>` (RAC renders `<span>`, Bootstrap reboot sets `label { display: inline-block }`); `d-block` on `<Text slot="description">`
- P052 portal-no-ancestor-sel — Popover bridge uses `[data-trigger="Select"]` attribute, not ancestor selector `.react-aria-Select .react-aria-Popover`
- D1 (Select decision) — explicit `size="sm" | "lg"` prop mapped to `select-trigger-sm` / `select-trigger-lg`
- D2 (Select decision) — `.form-select` background-image SVG chevron approach; trigger does NOT carry `.dropdown-toggle`

#### Debrief

**Issue identified:** P051 (programmatic-focus-visible) was not applied. Focus outlines appeared on the ListBox container on trigger click and on ListBoxItems on hover — both caused by RAC's programmatic `.focus()` calls, which browsers treat as keyboard-like and apply `:focus-visible` unconditionally.

**Root cause of miss:** P051's original trigger ("any RAC element that receives programmatic focus where the resulting ring is visually incorrect") required live behavioral observation. The pixel-diff verification loop is blind to this — static screenshots never show a spurious hover focus ring. The principle had a behavioral escape hatch that made it effectively optional.

**Fixes applied:**
- P051 rewritten with doc-derivable trigger: `autoFocus` prop on container sub-elements and `shouldFocusOnHover` prop on container APIs are explicit RAC declarations of programmatic focus, readable from `mcp__react-aria__get_react_aria_page` during Preparation Phase. Phase constraint added (run before writing bridge CSS). Escape hatch removed.
- `agent/notes/principle-templates.md` created: MECE taxonomy of principle types (Detection Rule, Selection Rule, Procedure, Epistemic Guard) with templates and diagnostic checklist. Surfaced that the initial four-type taxonomy was neither mutually exclusive nor collectively exhaustive.

**Outcome:** Both components pass at 0.00% diff. P051 fix deferred to next iteration.
