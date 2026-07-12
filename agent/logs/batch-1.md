# Batch 1

## Components

- Select

## Stories

### Select

`stories/react-aria-bootstrap/reference/Select.reference.stories.tsx`

- Trigger
- Sizes
- Open
- Grouped
- Field States

## Stage 4

### batch-1/stage-4/iter-1

**Decisions needed:**

#### D1 — Size variant exposure (`.form-select-sm` / `.form-select-lg`, `.btn-sm` / `.btn-lg`)

Bootstrap's Form Select offers `.form-select-sm` and `.form-select-lg` modifier classes (reduced/increased padding, font-size, border-radius). The structural counterpart (Dropdown) has matching `.btn-sm`/`.btn-lg`. React Aria's `Select` component has no `size` prop — there is no React Aria equivalent to bridge to. Per M016 trigger pattern 1 (variant exposure), this must be flagged: should Bootstrap's size variants be exposed as (a) a new `size` prop on the `Select` component, (b) an unstyled passthrough via `className` with no dedicated prop, or (c) excluded from this iteration's scope entirely (default size only)?

**Answer:** Add a dedicated `size` prop on `Select` (`'sm' | 'md' | 'lg'`) that maps to Bootstrap's `.form-select-sm`/`.form-select-lg` classes.

#### D3 — Selected-item indicator and trigger validation icon (review feedback, round 2)

Raised during reference-story review, not pre-flagged: (1) the option-list checkmark on selected items should be removed (Bootstrap's `.dropdown-item.active` convention is background/color fill only); (2) valid/invalid trigger specimens must show Bootstrap's standard validation icons (green check / red circle-exclamation), not just a border-color change. Full question/answer recorded in `agent/taxonomies/select-taxonomy.md` Decisions D3.

**Select — Stage 4 complete.** Reference stories approved; CSS extracted for all 5 stories (Trigger, Sizes, Open, Grouped, Field States) to `agent/artifacts/reference-css/select-{trigger,sizes,open,grouped,field-states}.css`.

**Principles used:**
- M001 dom-first — matched Select's rendered DOM (button + Popover + ListBox) to the Dropdown pattern rather than `.form-select`
- M002 sub-parts — mapped every sub-part independently (Label, Trigger, SelectValue, caret, Description, FieldError, Popover, ListBox, ListBoxItem, Section/Header, hidden native select)
- M003 kb-sequence — loaded `components.md` → `patterns.md` → `states.md`, cross-referenced `tokens.md`
- M004 three-bridges — applied all three bridge strategies across the state-mapping tables
- M006 no-counterpart — applied to `SelectValue`, the ListBox empty state, and (initially) the selected checkmark
- M007 scss-verify — verified every `--bs-*` token against compiled CSS before use; ran the pseudo-class ACTIVE/INERT audit per sub-part
- M008 data-attrs — enumerated the full `data-*` surface directly from installed `react-aria-components` source, since the MCP-served docs didn't include a full render-props table
- M010 content-states — scanned Bootstrap's component catalog for a selection-indicator counterpart before concluding none exists
- M011 structural-variants — grouped options (sections) kept in scope as a same-sub-parts DOM rearrangement
- M012 custom-controls — applied to the hidden native `<select>` (out of visual scope, not styled)
- M014 dual-counterpart — core resolution for the trigger (Dropdown structural vs. Form Select semantic/visual)
- M015 variant-authority — Bootstrap's size vocabulary (sm/md/lg) adopted wholesale per D1
- M016 decisions-needed — surfaced D1 (variant exposure) and, via review, D3 (selection indicator / validation icon)
- M017 css-delta — documented the (empty) CSS delta for `selectionMode`
- M018 elem-type-sub — caret substitution (real SVG element vs. Bootstrap's `::after` pseudo-element)
- M019 m014-class-in-decisions — D2 records the trigger's class choice explicitly, including rationale
- M020 one-component-class — exactly one component class per interactive element throughout (`.btn` on the trigger, `.dropdown-menu` on the Popover, `.dropdown-item` on items)
- P-001 faux-state classes — `.faux-hover`/`.faux-focus`/`.faux-open`/`.faux-focus-visible` for both the trigger and dropdown items
- P-002 selector context — Open/Grouped stories reproduce the full `.dropdown` > `.btn` + `.dropdown-menu` > `.dropdown-item` ancestor/sibling structure
- P-003 CSS classes, not inline styles — all specimen styling lives in `presentation.scss`
- P-004 flex-wrap layout — `.spec-row` container, no fixed column count
- P-005 open-state shows a selected value — Open/Grouped triggers show "Kangaroo," matching the highlighted item
- P-006 over-inclusion — Sizes, Grouped, and Field States kept as separate stories rather than folded/omitted
- P-007 target appearances only — no unstyled/broken specimens shown
- P-008 label every specimen — every specimen carries a `.spec-label`
- P-009 states across variant families — assessed and concluded sizes are not a structurally distinct family (token-value differences only), so no separate state matrix was required per size
- P-011 extract reference CSS — this step, all 5 stories
- P-012 dual-counterpart variable overrides — `.select-trigger`'s `--bs-btn-*` overrides sourced from `.form-select`
- P-013 verify every faux-state specimen — screenshot-verified every specimen in light and dark themes, twice (initial submission and post-review revision)
- P-014 / P-015 / P-016 — dropdown-item faux-focus includes the UA outline (not suppressed by Bootstrap), keeping it visually distinct from faux-hover; verified by screenshot
- P-017 asymmetric spacing verification — resolved the size-variant `padding-x` question by checking whether the reference component renders a background-image chevron (it doesn't — real element instead)
- P-018 caret rotation via transform — `.faux-open .select-trigger-caret { transform: rotate(180deg) }`

## Stage 5

### Select

All 5 mirror stories (Trigger, Sizes, Open, Grouped, Field States) pass the
final verification sweep at threshold 0.003 (Trigger/Sizes/Grouped/Field
States 0.00%, Open 0.04%). Full iteration-by-iteration account in
`agent/artifacts/findings/select-findings.md` and the five
`select-{story}-findings.md` docs.

**Principles used:**
- `P001 compound-sel` — `.react-aria-*` retained alongside Bootstrap classes throughout (Label, SelectValue, Button, Popover, ListBox, ListBoxItem, FieldError, Text, Header)
- `P002 class-in-tsx` — render-prop `className` for the trigger `Button` and `SelectItem`
- `P003 scss-bridge` — all bridge selectors in `_bootstrap-bridges.scss`
- `P007 variant-replace` — `size` prop (D1) uses Bootstrap's `sm`/`lg` vocabulary wholesale
- `P008 structural-sel` — root `[data-invalid]`/`[data-open]` bridged via ancestor-scoped compound selectors onto `.select-trigger` rather than relying on Bootstrap's own structural selectors
- `P011 cursor-pointer` — `.dropdown-item` (a `<div role="option">`) needs explicit `cursor: pointer`
- `P013 prefer-component-cls` — `.btn`/`.dropdown-toggle`/`.dropdown-menu`/`.dropdown-item`/`.dropdown-header` component classes throughout, no ad hoc utility classes
- `P014 data-pressed` — `.dropdown-item[data-pressed]` bridged to the `.active`/`:active` visual
- `P022 bs-icons` — trigger caret switched from the stub's `lucide-react` `ChevronDown` to `<i class="bi bi-chevron-down">`, matching the reference exactly
- `P024 caret-flip` — `.react-aria-Select[data-open] .select-trigger-caret { transform: rotate(180deg); }` (the real open state had no bridge; only the Trigger story's faux-simulated open state did — found and fixed during the `open`/`grouped` fix loop)
- `P025 hardcode-show` — `.show` hardcoded in the Popover's `className`
- `P044 faux-state-class` — `.faux-hover-scope`/`.faux-focus-scope`/`.faux-open-scope` wrapper-div pattern for the Trigger mirror story, since the trigger `Button`'s `className` is itself a function of render state
- `P047 presentation-import` — mirror stories import `../presentation.scss` directly
- `P048 no-inline-style` — two `minHeight` exceptions (Open/Grouped stories, reserving space for the open Popover), each with an inline comment
- `P049 rac-trigger-width` — `.dropdown-menu[data-trigger='Select'] { width: var(--trigger-width); }`
- `P050 reboot-mismatch` — three separate instances found during the fix loop, none pre-flagged by the taxonomy: (1) `<Label>`/`<Text>` render `<span>` (inline), discarding `.form-label`/`.form-text`'s vertical margins that assume a `<label>`/block element; (2) `<Header>` renders a plain `<header>`, missing `_reboot.scss`'s `h1`–`h6` `line-height: 1.2`/`font-weight: 500`, inflating `.dropdown-header`'s height ~4px
- `P052 portal-no-ancestor-sel` — Popover bridge rules scoped via `[data-trigger='Select']`, never an ancestor selector

**Decisions/engineering additions beyond the taxonomy's pre-resolved scope**
(logged in `select-findings.md`'s Work Log for full reasoning):
- `isValid`/`validMessage` props added to `Select` (no RAC equivalent exists; symmetric with D1's precedent of adding a dedicated prop for a Bootstrap-only concept).
- `menuClassName` prop added as a narrow demo/story escape hatch, used only by the Open/Grouped mirror stories to reproduce the reference's incidental full-viewport-width menu (a static-layout artifact, not a general sizing convention — P049's `--trigger-width` remains the default).
- `Popover offset={0}` + CSS `margin-top: calc(var(--bs-dropdown-spacer) + 0.5px)` instead of the `offset` prop alone, because `floating-ui` rounds its computed anchor position to a whole device pixel before applying any JS offset, which can never land on the reference's half-pixel-exact block-layout position; a CSS margin isn't subject to that rounding.
- `SelectValue` now renders `selectedText` (derived from each item's `textValue`) instead of RAC's default `defaultChildren` (the selected item's raw rendered content), so an item can carry a decorated/annotated visible label (e.g. "Kangaroo (selected)" in the Grouped story) without that annotation leaking into the trigger.
- `.dropdown-item[data-selected][data-focus-visible] { outline: none; }` — a pre-selected item can receive genuine keyboard focus the instant a Select mounts already open (`defaultOpen` + `defaultSelectedKey`), a real combined state no static reference specimen depicts; the solid active fill already satisfies WCAG 2.4.7 without the added ring.

**Debrief observations:**
- User: end results are good, but the fix loop took significantly more iterations than any prior component observed — 9 iterations each for both `Open` and `Grouped` mirror stories. Requested a root-cause investigation into the findings/session logs.

**Root-cause investigation (orchestrator, from `select-findings.md` + `select-open-findings.md` + `select-grouped-findings.md`):**

Trigger and Sizes passed at iteration 0; Field States passed at iteration 1 (a single reboot-display fix). Open and Grouped are structurally different from the other three: they are the only stories that render the Select's **real, genuinely-open Popover** — Trigger/Sizes/Field States show only the closed trigger button in faux-simulated states, so they never exercise live Popover positioning, live focus-on-mount, or the live `SelectValue`/selected-item text relationship. That structural gap is why an entire category of bugs was invisible until Open/Grouped ran, and why 4 distinct, unrelated root causes had to be found and fixed serially (a pixel-diff tool reports one aggregate delta, so each cause could only be isolated one iteration at a time):
1. **Missing real-open bridge rule** (it 0→1): the caret-rotation and `.faux-open-scope` rules only covered the *simulated* Trigger-story open state; a genuinely open Select had no `[data-open]`-scoped rule at all.
2. **`<Header>` reboot mismatch** (Grouped it 2): RAC's `<Header>` renders a plain `<header>`, not an `h1`–`h6`, so it misses `_reboot.scss`'s heading `line-height`/`font-weight` — ~4px taller than the reference.
3. **`floating-ui` sub-pixel rounding** (it 2→5, the single biggest cost driver): the Popover's anchor position is rounded to a whole device pixel before any `offset` is applied, so no `offset` value can hit the reference's half-pixel-exact target. The first attempt (`offset={2.5}`) was a curve-fit that happened to pass *Open* alone but landed on the wrong whole pixel for *Grouped* (different header height → different anchor), costing an extra cycle before the agent replaced it with the structural fix (`offset={0}` + a CSS `margin-top` that isn't subject to the same rounding). Because Open and Grouped share one live component, this generalization requirement was unavoidable.
4. **`SelectValue` architecture gap** (it 6→9): `defaultChildren` (raw item content) ≠ `selectedText` (`textValue`-derived) — needed to show "Kangaroo" in the trigger but "Kangaroo (selected)" in the list. Root cause required reading `node_modules/react-aria-components/dist/private/Select.mjs`, not just CSS inspection. Iterations 6–7 were two genuinely different, informative hypothesis tests (not repeated guesses) before the correct fix landed in iteration 9, which also fixed an incidental 5th bug found in the same pass (genuine keyboard focus on a pre-selected item at `defaultOpen` mount, stacking a focus ring on the selected fill).

**Conclusion:** the count reflects breadth (4–5 independent bugs, two requiring library-source investigation) compounded by cross-story coupling (shared live component forced fixes to generalize across both stories), not repeated failed attempts at one problem. No story crossed the Stuck threshold; `verification-sweep-passed` was reached cleanly.

- User: caret has a nice rotate transition (not a hard flip) on open. Not aware of this being prescribed anywhere in the skill — asked how the Stage 5 agent decided to add it. Positive observation, not a correction.

**Investigation (orchestrator, via `git log -S` + diff against Stage 4 merge-base `da1f108`):** the transition was not written by the Stage 5 agent at all. `.select-trigger-caret { transition: transform 0.15s ease-in-out; }` already exists verbatim in `presentation.scss` at commit `f70e06f` ("Stage 4: Select taxonomy and reference stories") and its merge `5d0dda0` — both pre-date Stage 5. `git diff da1f108 -- presentation.scss` shows Stage 5's only change to that file is the unrelated `.select-menu-demo-stretch` utility; the caret rule is untouched. `select-findings.md` explicitly states the rest-state caret CSS "already existed in `presentation.scss` ... and was reused as-is" — Stage 5 only added the `[data-open]`-scoped `transform: rotate(180deg)` rule for the *real* open state (P-018). Because the transition lives on the base rule (not the state-specific one), it applied automatically once the real toggle existed — CSS transitions animate any property change on an element regardless of what triggered it (Stage 4's static `.faux-open` class swap or Stage 5's live `[data-open]` attribute). No principle in the Stage 4/5 logs mandates a transition specifically; best-evidenced explanation is that it matches Bootstrap's own established convention for rotating icons — e.g. `_accordion.scss`'s `.accordion-button::after` uses `transition: var(--bs-accordion-btn-icon-transition)` for its expand/collapse chevron, and `.icon-link > .bi` uses `transition: transform 0.2s ease-in-out` — so the Stage 4 agent likely added it as idiomatic polish by pattern-matching Bootstrap's own design language, not from an explicit written rule.
