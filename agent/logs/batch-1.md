# Batch 1

## Components

- Select

## Stories

- Bootstrap Reference/Select/TriggerStates
- Bootstrap Reference/Select/DropdownMenu
- Bootstrap Reference/Select/FormField

## Stage 4

### batch-1/stage-4/iter-1

#### Select — Decisions needed

**D1 — Trigger caret approach**

Bootstrap's `.dropdown-toggle::after` generates a CSS caret pseudo-element. React Aria's typical Select implementation uses an explicit icon child (e.g., `<ChevronDown>`) inside the button. Two options:

- **(a) Suppress `::after` caret, use explicit icon child** — `.dropdown-toggle::after { display: none }` on the Select trigger; place a `<ChevronDown>` (or Bootstrap Icons chevron) inside the button as a React child. Matches `.form-select` visual appearance exactly (custom chevron icon).
- **(b) Accept Bootstrap's CSS caret** — keep `.dropdown-toggle::after`; no icon child needed. Results in Bootstrap's standard dropdown caret (small triangle), not `.form-select`'s chevron.

Option (a) matches the `.form-select` visual target more closely and gives implementation-phase control over icon source. Which should the reference story demonstrate?

**Answer:** Suppress `::after` caret — set `.dropdown-toggle::after { display: none }` on the Select trigger. Use an explicit Bootstrap Icons chevron child (`<i class="bi bi-chevron-down">`). Matches `.form-select` visual appearance.

### batch-1/stage-4/iter-2

**Outcome:** Partial. Select stories were written but not approved; iteration closed early to sync learnings. Select work carries forward to iter-3.

**Select:** Taxonomy written. 4 reference stories written (TriggerStates, OpenState, ItemStates, FormIntegration). Review surfaced three CSS bugs:
- Trigger border transparent in all states — root cause: `.btn` defaults `--bs-btn-*-border-color` to `transparent`; sub-agent patched the output `border-color` property instead of overriding the CSS variables, so Bootstrap's own state pseudo-classes re-applied the transparent value on hover/active. Fixed by setting `--bs-btn-hover-border-color` etc. on the element (P-012).
- Two carets rendering — `::after` triangle caret not suppressed despite D1 decision; fixed by adding `.dropdown-toggle.select-trigger::after { display: none }`.
- Focus item indistinguishable from hover — sub-agent saw Bootstrap's `:focus` rule uses the same tokens as `:hover` and concluded the states were visually identical, omitting `outline: auto -webkit-focus-ring-color`. Root cause: Bootstrap's CSS is not a complete description of visual appearance; the UA focus ring is active when `outline` is not suppressed (P-014, P-015, P-016).

**Principles added to component-agent.md:** P-012, P-013, P-014, P-015, P-016.

**Files synced to integration-batch-1:** `agent/mapping-and-references-skill/component-agent.md`, `agent/logs/batch-1.md`.

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

**Outcome:** Select reached `COMPONENT-STAGE-4-COMPLETE`. Taxonomy + 4 reference stories + CSS extracted. Several review cycles surfaced new principles (P-008 amendment, P-017, P-018).

**Principles added to component-agent.md:** P-008 amendment (labels must not appear inside component visual containers), P-017 (asymmetric spacing verification), P-018 (open-state caret flip via CSS transform).

**Files synced to integration-batch-1:** `agent/mapping-and-references-skill/component-agent.md`, `agent/logs/batch-1.md`.

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
- First Select Phase B attempt rejected; rewritten from scratch. Second attempt required two review cycles (P-009 state matrix, caret positioning).

## Stage 5

### Select
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*
