---
component: Select
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| default | Pass | 2 | 0 | 0.16% |
| sizes | Pass | 2 | 0 | 0.28% |
| states | Pass | 2 | 0 | 0.28% |
| open-single-select | Pass | 1 | 0 | 0.07% |
| open-multi-select | Pass | 1 | 0 | 0.20% |
| with-label-and-description | Pass | 2 | 0 | 0.04% |

## Work Log

### Blank-slate note

Per dispatch instructions, blank-slate mode is ON for this run. No `git log`, `git show`, `git diff` against a prior commit, or any other command reading past-commit content was run at any point during this session — for TSX implementation, bridge CSS, mirror stories, or this findings doc. No taxonomy/reference-story/CSS content outside the current working tree was consulted. The taxonomy (`agent/taxonomies/Select-taxonomy.md`) itself documents (in its own Confidence section) that it was authored under the same constraint, so it was treated as authoritative rather than re-derived.

### Phase A — architectural decision: no shared vanilla-starter wrappers

The orchestrator stub's `src/react-aria-bootstrap/Select.tsx` imported the shared `src/Button.tsx`, `src/ListBox.tsx`, `src/Popover.tsx`, `src/Form.tsx` wrapper components (via `../Button`, `../ListBox`, `../Popover`, `../Form`) and `src/Select.css` directly. Inspecting those files showed every one of them imports its own original vanilla-starter CSS (`Button.css`, `ListBox.css`, `Popover.css`, `Form.css`, `Select.css`), all keyed to the vanilla theme's own custom-property namespace (`--text-color`, `--spacing-*`, `--gray-*`, `--tint-*`, `--focus-ring-color`) — the same token family CLAUDE.md's styling conventions flag as "being phased out." Principle P005 states as an architectural invariant that "original per-component CSS (`src/{Component}.css`) has no import path into any Bootstrap-styled component" — the stub violated this directly, and reusing the shared wrappers as-is would have carried the violation forward (their CSS imports are unconditional module side effects, not something that can be selectively dropped while still importing the wrapper function).

Decision: rebuilt `Select.tsx` directly on `react-aria-components/Select`'s own re-exports (`Select`, `SelectValue`, `Button`, `Label`, `Text`, `FieldError`, `Popover`, `ListBox`, `ListBoxItem` — this submodule conveniently re-exports all of them, verified via `node_modules/react-aria-components/dist/types/exports/Select.d.ts`), with no import of any `src/*.tsx` wrapper or `src/*.css` file. This keeps Bootstrap as the only styling source for the mirror bundle, satisfying P005 without needing to modify the shared wrapper files (which are out of this agent's scope and may be relied on by other, not-yet-implemented batch components).

### Phase A — simplification: no content-driven trigger sizer (P041) — SUPERSEDED, see Correction below

~~P041 prescribes a hidden "sizer" element inside the trigger so it sizes to the widest of *all* its options (reproducing native `<select>`'s intrinsic-width behavior), not just the current selection. Checked whether this is actually load-bearing for the "Default" story's three specimens... Skipped the sizer for this pass as a documented simplification.~~

This reasoning was reviewed and rejected by the coordinator: P041 is `Type: Triggered` with no exception clause, its trigger condition (taxonomy records specimen data for the trigger) was met, and "the current dataset makes the divergent case invisible" is exactly the coincidence-not-mechanism failure P041's own Rationale exists to prevent — using it as grounds to skip the action applies the failure to itself (see `SKILL.md` G060: `dataset-coincidence-skip`, added in response to this). See "Correction — P041 implemented" below for the fix.

### Correction — P041 implemented, plus retroactive Triggered Principle Compliance Check

The hidden-sizer technique is now genuinely implemented per P041's own example structure — see `src/react-aria-bootstrap/Select.tsx` (the `getOptionLabels`/`extractText` helpers, and the `.option-sizer` span rendered inside the trigger `Button`) and `src/scss/_bootstrap-bridges.scss` (the `.react-aria-Button.form-select` flex-column restructure and `.option-sizer` rule). Verified as a genuine artifact, not just present-but-inert markup, via direct DOM/computed-style inspection (not inferred from the pixel diff, which — as expected given the dataset coincidence identified above — reports identical diff% before and after, since current-selection width already equals widest-option width for every specimen in scope):

```
.option-sizer elements found: 3 (Default story)
  "AppleBananaCherryDate"                  width: 77.7969px
  "ApplePomegranate seeds, family size"    width: 252.703px
  "AppleBanana"                            width: 172.547px
(each: display:block, visibility:hidden, height:0px — contributing width to
the trigger's intrinsic sizing without occupying vertical space or being
visible, confirmed via getComputedStyle)
```

This diff-invariance is the expected, correct outcome of implementing a principle whose divergent case the current dataset doesn't happen to exercise — not evidence the fix was unnecessary. The mechanism is now correct for any future option set, not just this taxonomy's specimen data.

Per the new "Triggered Principle Compliance Check" requirement in `component-agent.md`, every `Type: Triggered` principle in `principles.md` was re-audited against the full Select implementation (not just P041) — see the table below. This surfaced two more gaps that were fixed the same way (implemented, not logged as an omission):

1. **P001/P002 (compound-sel / class-in-tsx):** `<Label className="form-label">` and the description `<Text className="field-description form-text">` were plain strings that dropped the RAC default class (`react-aria-Label`, `react-aria-Text`) — exactly G040's failure mode, latent (no bridge rule currently targets either class, so it wasn't yet an active visual bug, but inconsistent with every other element in the file and a real risk for the next bridge rule added against either). Fixed: both now include the RAC default class explicitly (`Select.tsx:89`, `:112`).
2. **P007 (variant-replace):** the `size` prop resolved to `form-select-${size}` via template-literal interpolation rather than an actual `variantClassMap`. Functionally identical output, but not the literal artifact the principle specifies. Replaced with an explicit `sizeClassMap: Record<'sm' | 'lg', string>` (`Select.tsx:52-55`).
3. **P050 (reboot-mismatch):** the taxonomy's own DOM-conflicts entry for the trigger's button/select substitution concludes "no action needed," and independent verification (grepping the extracted reference CSS, then confirming via `getComputedStyle` on a real disabled trigger button) showed both bare-`select`-scoped reboot rules (`select { overflow-wrap: normal }`, `select:disabled { opacity: 1 }`) already resolve to the same values on a `<button>` without any rule — i.e. a genuine no-op, not a data coincidence (true for any consumer, not just this taxonomy's specimens). Implemented explicitly anyway rather than relying on that determination to justify omitting a code artifact (`_bootstrap-bridges.scss:73-84`).

All fixes re-verified: `tsc --noEmit` exits 0; all 6 stories re-extracted and re-compared, all still pass at unchanged diff% (`agent/artifacts/diffs/select/{story}/final3/`).

### Phase A — `.select-item-checkbox` base style reuse

`stories/react-aria-bootstrap/presentation.scss` already defines `.select-item-checkbox` (resting/unchecked look, including the `border-radius: 0.25em` redeclare the taxonomy's DOM-conflicts entry calls for) and `.dropdown-item:has(.select-item-checkbox) { display:flex; ... }`, put there by the Stage 4 (mapping-and-references) agent to support the reference story. Neither rule is `.ref-`-scoped or otherwise reference-only — they apply generically to any element carrying those classes, including this component's real rendered DOM. Reused them as-is (mirror stories import `presentation.scss` per P047) rather than duplicating them into `_bootstrap-bridges.scss`. Only the state-driven checked-look bridge (`[data-selection-mode='multiple'][data-selected] .select-item-checkbox {...}`) was added to `_bootstrap-bridges.scss`, since that part is genuinely `data-*`-driven and taxonomy's own literal bridge code targets `.select-item-checkbox` directly (not `.form-check-input`, despite the taxonomy's prose column saying to apply `.form-check-input` — followed the literal code block and the reference story's own actual markup, both of which use the custom class name).

### Phase A — Open-specimen layout strategy

`compare-stories.mjs` diffs full 1280×900 iframe screenshots pixel-for-pixel, so the mirror's DOM layout has to land in very close to the same screen positions as the reference, not just be "equivalent." The reference story's own OpenSingleSelect/OpenMultiSelect specimens already sidestep the "can't show a real open native `<select>`" problem by rendering two independent regions side by side: a closed trigger, and an unrelated static `.dropdown-menu` mock (taxonomy P-019/P-005). A genuinely-opened real `<Select defaultOpen>` would instead position its Popover via floating-ui relative to the trigger (default below-aligned, not beside it), which would not land in the same screen position as the reference's second column.

Adopted the same two-region strategy for the mirror: a real, closed `<Select>` trigger in the first specimen, paired with an independent real `SelectListBox`/`SelectItem` group (not nested inside an actual `Popover`) in the second, using real `selectionMode`/`defaultSelectedKeys`/`disabledKeys` for selected/disabled state and `.faux-hover`/`.faux-focus` (both already defined in `presentation.scss`, scoped to `.dropdown-item`) for the states that require live interaction to produce for real.

**Correction:** the trigger specimen originally did not fake the caret's open/rotated look, logged as "a known, minor, documented simplification." The coordinator flagged this for verification against the reference: the reference story's own OpenSingleSelect/OpenMultiSelect trigger specimens (`stories/react-aria-bootstrap/reference/Select.reference.stories.tsx:157`, `:201`, `:212`) explicitly use `<svg className="select-caret faux-open">` — confirmed genuinely intentional (not incidental), matching both the specimen label ("...caret open") and the pre-captured reference image (up-pointing chevron). The mirror was wrong, not the label. Fixed by giving `Select` a passthrough `className` (merged via the same string-append pattern already used by `SelectListBox`/`SelectItem`, `Select.tsx:79,81,86` — this also closes a latent gap where `Select` silently dropped any consumer-supplied `className` entirely) and adding a `faux-open` class to the three trigger `Select` instances (`Select.mirror.stories.tsx:151,195,207`), bridged in `_bootstrap-bridges.scss:108-118` per P044 (rotates the real `.lucide-chevron-down` without genuinely opening the popover, which would mount a second real Popover duplicating the independent menu specimen beside it). Verified genuinely applied via computed style, not just class presence: `getComputedStyle(icon).transform` → `matrix(-1, 0, 0, -1, 0, 0)` (`rotate(180deg)`) on the real trigger icon. All 3 affected stories re-compared after the fix; diff% unchanged (open-single-select 0.07%, open-multi-select 0.20% — the rotated-vs-unrotated 16px icon apparently falls under pixelmatch's per-pixel color-difference threshold either way, confirmed empirically rather than assumed).

### Preparation Phase — cross-checks performed

- `mcp__react-aria__get_react_aria_page('Select')` read in full; confirmed Select's own prop surface (`defaultValue`/`value` for uncontrolled/controlled selection — not `defaultSelectedKey`, which is a ListBox/Collection-only prop; `size`/layout-relevant props already covered by taxonomy's Variants table). No prop with layout/orientation/selection-mode/variant semantics was found missing from the taxonomy (P038).
- Verified `@selector` annotations directly in `node_modules/react-aria-components/dist/types/src/{Collection,Select,Popover}.d.ts` for every `data-*` attribute the taxonomy cites (`data-selection-mode`, `data-selected`, `data-hovered`, `data-pressed`, `data-focused`, `data-focus-visible`, `data-disabled`, `data-trigger`, `data-placement`, `data-open`, `data-invalid`, `data-placeholder`) — all present exactly as documented. This is package source, not git history or deleted content, so it's outside the blank-slate restriction (consistent with the taxonomy's own Confidence section, which used the same method).
- Read Bootstrap KB `components.md` (Form Select, Dropdown entries) and `patterns.md` §2 (Form Select confirmed flat/non-compound; Dropdown confirmed as the true compound pattern) — no gap found relative to what the taxonomy already encodes.

### Iteration 1 — implementation and comparison loop (Inception)

Ran `compare-stories.mjs` for all 6 stories in one pass before any fixes, per protocol. All 6 failed:

| Story | Diff% |
|---|---|
| default | 0.78% |
| sizes | 0.36% |
| states | 0.85% |
| open-single-select | 1.82% |
| open-multi-select | 1.70% |
| with-label-and-description | 0.72% |

**Observations:** default/sizes/states all showed the trigger box rendering wider than reference with cumulative rightward drift; open-single-select/open-multi-select showed the standalone menu mock with no visible chrome and no selected/hover highlighting; with-label-and-description showed everything from the trigger box downward rendering too high (insufficient label-to-control gap).

**Principles used:**
- `P036 derive-from-counterpart` — diagnosed the trigger-width bug by comparing my bridge's reserved space against `.form-select`'s actual compiled padding shorthand, not by guessing at a pixel value

**Code changes made:** None yet — this pass only measured baseline diffs.

### default / sizes / states — Iteration 2

**Observations:** all three specimens' trigger boxes were wider than reference because the real `<ChevronDown>` icon's flex width + gap were reserved *in addition to* the inherited `padding-right: 2.25rem` (originally sized for the now-suppressed background-image arrow) — space double-counted.

**Principles used:**
- `P036 derive-from-counterpart` — root-caused via the extracted reference CSS's literal `.form-select` padding shorthand rather than trial-and-error pixel adjustment

**Code changes made:**
- `src/scss/_bootstrap-bridges.scss`: added `padding-right: 0.75rem` to `.react-aria-Button.form-select`
- Shared selector modified (affects every story using the trigger) → re-ran full sweep: default 0.78%→0.16% (pass), sizes 0.36%→0.28% (pass), states 0.85%→0.28% (pass); open-single-select and open-multi-select re-checked too, no effect on their (still-failing, unrelated) diffs at this point

### open-single-select / open-multi-select — Iteration 1

**Observations:** the standalone `SelectListBox`/`SelectItem` menu mock rendered with no container chrome and no selected-state highlight, despite `data-selected`/`data-selection-mode` genuinely being present in the DOM (confirmed via direct `getComputedStyle`/`.matches()` inspection rather than assumption).

**Principles used:**
- `P040 container-owns-boundary` — recognized that `.dropdown-menu`'s chrome (and, in this codebase, its entire `--bs-dropdown-*` custom-property scope) belongs to a specific carrier element, and the mock never had it

**Code changes made:**
- `stories/react-aria-bootstrap/mirror/Select.mirror.stories.tsx`: added `dropdown-menu` to the mock `SelectListBox`'s className (alongside `select-reference-menu`) in both stories
- Not a shared-selector change (story-local fix) → re-ran only these two stories: open-single-select 1.82%→0.07% (pass), open-multi-select 1.70%→0.20% (pass)

### with-label-and-description — Iteration 2

**Observations:** trigger box and everything below rendered too close to the label; measured the actual pixel gap directly (not estimated) and found the reference's `.ref-stack` wrapper (flex column, 0.5rem gap) adds spacing *on top of* each child's own block margin, which my component's plain block-flow children didn't reproduce.

**Principles used:**
- `P001 compound-sel` — added the conditional class alongside the RAC default class via the callback form, not a replacing literal string

**Code changes made:**
- `src/react-aria-bootstrap/Select.tsx`: added a conditional `select-with-label` class to the `AriaSelect` root, applied only when `label` is set
- `src/scss/_bootstrap-bridges.scss`: added `.react-aria-Select.select-with-label { display:flex; flex-direction:column; gap:0.5rem; }`
- Shared selector modified (root class change in `Select.tsx` is a Select-wide change) → re-ran default/sizes/states to confirm no regression (label-less stories never receive the class): all still pass, diffs unchanged

### Triggered Principle Compliance Check

Scope: every principle in `principles.md` carrying an explicit `**Type:** Triggered` field. (Several principles in the not-yet-migrated "Core Principles"/"Extended Principles"/"Stories Conventions" sections — e.g. P005, P011, P024, P042, P049 — read as trigger/action in prose but carry no `**Type:**` field at all per the TOC's own "reorganization in progress" note; they're addressed elsewhere in this doc and the Stage 5 principles list, but are out of scope for this specific table, which is keyed to the literal `Type: Triggered` tag.)

| Principle | Trigger condition met? | Evidence (file:line) |
|-----------|------------------------|-----------------------|
| P001 compound-sel | Yes — every Bootstrap-classed RAC element | `Select.tsx:85-87` (Select root), `:89` (Label, compound literal), `:91-93` (Button), `:112` (Text/description, compound literal), `:118` (FieldError), `:122` (Popover), `:134-136` (SelectListBox), `:148-150` (SelectItem) — all preserve the RAC default class |
| P002 class-in-tsx | Yes — same trigger, same elements | Same lines as P001; callback form used for all render-prop-dependent classes, explicit compound literal (`"react-aria-Label form-label"`, `"react-aria-Text field-description form-text"`) where no render-prop state is needed |
| P003 scss-bridge | Yes — hover/focus/pressed/selected/disabled/invalid all styled | `_bootstrap-bridges.scss:69-70` (disabled), `:88-94` (invalid), `:98-100` (placeholder), `:104-106` (open/caret), `:147-189` (item hover/focused/focus-visible/pressed/disabled/selected) |
| P007 variant-replace | Yes — `size` is a taxonomy-resolved Bootstrap-authoritative variant (Decision D3) | `Select.tsx:52-55` (`sizeClassMap`), `:92` (applied); `Select.mirror.stories.tsx` "Sizes" story (`:55-81`) shows all values side by side |
| P016 fixed-dims | No — no visual indicator element in this implementation mounts/unmounts on a state change. The multi-select checkbox (`Select.tsx:154`) is the only candidate; it mounts/unmounts on `selectionMode` (effectively static per list), not on the selected-state toggle itself — its checked/unchecked look changes via CSS only (`_bootstrap-bridges.scss:186-190`), which is P016's own explicitly-excluded case ("always present... only changes visual treatment"). Single-select carries no checkmark at all (Decision D4). No other mount/unmount indicator exists (caret rotates via `transform`, never unmounts; the invalid background-image icon was dropped entirely per taxonomy DOM conflicts, so there's nothing to reserve dimensions for). | — |
| P036 derive-from-counterpart | Yes — Button↔`.form-select`, ListBoxItem↔`.dropdown-item` are both direct counterparts | `_bootstrap-bridges.scss:69-70,78-84` (from extracted `.form-select:disabled`/`select:disabled`), `:147-175` (from extracted `.dropdown-item:hover`/`.active`/`.disabled`) |
| P040 container-owns-boundary | Yes — `.dropdown-menu`'s outer boundary (Decision D2) | `Select.tsx:122` (Popover gets `dropdown-menu`); `_bootstrap-bridges.scss:123-131` (chrome on Popover only); `ListBox`/`ListBoxItem` never receive boundary-owning classes |
| P041 value-display-stable-dims | Yes (implemented per Correction above) | `Select.tsx:24-33` (`extractText`), `:38-46` (`getOptionLabels`), `:105-109` (sizer JSX); `_bootstrap-bridges.scss:23-34` (`flex-direction: column` on the trigger, line 26), `:60-66` (the `.option-sizer` rule itself, not just its preceding comment) |
| P050 reboot-mismatch | Yes — taxonomy DOM conflicts "Trigger element type" (M018), select→button substitution | `_bootstrap-bridges.scss:73-84` |

### Final Verification Sweep

Re-ran all 6 stories with `--threshold 0.003` after all fixes above (including the P041/P001/P002/P007/P050 corrections and the OpenSingleSelect/OpenMultiSelect caret fix); all pass (see Story Registry, diffs unchanged from before these corrections — expected, since none of the gaps were visible in the current specimen data by construction, per the Correction section above). No new SCSS files were created under `stories/` (`git diff --name-only` against merge-base showed `presentation.scss` only, which was pre-existing and has zero uncommitted diff — not a file I created or modified). `tsc --noEmit` exits 0; zero browser console errors across all 6 mirror stories (re-verified after all corrections).
