---
component: TagGroup
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| default | Pass | 0 | 0 | 0.00% |
| states | Pass | 0 | 0 | 0.00% |
| removable | Pass | 0 | 0 | 0.00% |
| with-label-and-description | Pass | 0 | 0 | 0.08% |

## Work Log

### Blank-slate note

Per dispatch instructions, blank-slate mode is ON for this run. No `git log`, `git show`, `git diff` against a prior commit, or any other command reading past-commit content was run at any point during this session — for TSX implementation, bridge CSS, mirror stories, or this findings doc. No taxonomy/reference-story/CSS content outside the current working tree was consulted. `agent/taxonomies/TagGroup-taxonomy.md` itself documents (in its own Confidence section) that it was authored under the same constraint, so it was treated as authoritative rather than re-derived. `node_modules/react-aria-components` and `node_modules/react-aria` source/type files were read directly (package source, not git history or deleted content — same method the taxonomy's own Confidence section used) to verify prop/export surfaces before writing TSX.

### Phase A — architectural decision: no shared vanilla-starter wrappers

The orchestrator stub's `src/react-aria-bootstrap/TagGroup.tsx` imported the shared `src/Form.tsx` (`Description`, `Label`) and `src/Content.tsx` (`Text`) wrapper components, plus `src/TagGroup.css` directly, and used `lucide-react`'s `<X/>` for the remove icon. Per the dispatch note (confirmed against `src/Form.tsx`/`src/Content.tsx`, which do carry their own vanilla-theme CSS imports) and matching the pattern already established for Select/Tabs in this batch (P005 bundle-isolation), rebuilt `TagGroup.tsx` directly on `react-aria-components/TagGroup`'s own re-exports. Verified via `node_modules/react-aria-components/dist/types/exports/TagGroup.d.ts` that this submodule re-exports `TagGroup`, `TagList`, `Tag`, `Button`, `Label`, `Text`, `SelectionIndicator` (the `dist/types/src/TagGroup.d.ts` file alone — the private source types — does not show `Button`/`Label`/`Text`, since those are re-exported from sibling private modules only at the `exports/` barrel level; the `exports/TagGroup.d.ts` file is the one that actually matches the `react-aria-components/TagGroup` import specifier). Replaced the lucide `<X/>` icon with `<i class="bi bi-x">` per Decision D4/P022.

### Phase A — Tag base styles reused from `presentation.scss`

`stories/react-aria-bootstrap/presentation.scss` already defines `.tag` (Decision D1 sizing/shape overrides), the faux-state classes (`.faux-hover`, `.faux-focus-visible`, `.faux-pressed`), `.tag-selected` (full `.btn-primary` token set), the `:has(.remove-button)` padding delta, and the `.btn-close.remove-button` icon-font override block — all written by the Stage 4 (mapping-and-references) agent to support the reference story, none `.ref-`-scoped. Per the same pattern already established for Select's `.select-item-checkbox` (see `select-findings.md`), reused these as-is by adding the `tag` class to the real `Tag` component's `className` (mirror stories import `presentation.scss` per P047) rather than duplicating the rules into `_bootstrap-bridges.scss`. Only genuinely `data-*`-driven bridges (`[data-hovered]`, `[data-pressed]`, `[data-selected]`, `[data-disabled]`, `[data-allows-removing]` on Tag; `[data-hovered]` on the Remove Button; the `[data-selected]`-scoped remove-button icon color re-point) were added to `_bootstrap-bridges.scss`, since the reference story's static classes (`.tag-selected`, `.faux-*`) have no real-component equivalent — those are simulated states, not states the real component ever reaches through data attributes alone.

### Phase A — `data-focused`/`data-focus-visible` bridge omission (Tag and Remove Button)

Taxonomy State mappings explicitly conclude no bridge is needed for Tag's or the Remove Button's focus states: Tag is a genuinely focusable `<div>` (roving tabindex per `useTag`), and the Remove Button is a real `<button>` — both receive real DOM focus, so native `:focus-visible`/`:focus` fire directly, matching Bootstrap's own `.btn:focus-visible`/`.btn-close:focus` compiled rules (verified in the pre-extracted reference CSS, `agent/artifacts/reference-css/taggroup-states.css` line 45 and `taggroup-removable.css` line 55/59/103). This reads as a deviation from P003's "bridge every data-* attribute uniformly" instruction, but P003 governs the *default* case; the taxonomy's State mappings table is this component's resolved bridge-strategy conclusion (the table's own "Bridge strategy" column), and the underlying mechanism differs from G050 (native-active-keyboard-gap): G050 addresses `:active`, which genuinely does not fire for keyboard activation — `:focus-visible` is specifically designed to fire correctly for keyboard-only focus regardless of input modality, so no gap exists to bridge. Followed the taxonomy's conclusion; reference-story specimens still get the `.faux-focus-visible` static class (P044), already present in `presentation.scss`.

### Phase A — TagGroup root: `tag-group-with-label` flex-column bridge

Mirrored Select's `.select-with-label` precedent (see `select-findings.md`, "with-label-and-description — Iteration 2"): TagGroup's root `className` prop has no render-prop form (plain `string` only, per `dist/types/src/TagGroup.d.ts`), so the RAC default class is spelled out explicitly (P002 form 2). Added a conditional `tag-group-with-label` class, applied only when `label` is set, bridged to `display:flex; flex-direction:column; gap:0.5rem;` in `_bootstrap-bridges.scss` — reproducing the reference story's `.ref-stack` gap. Applied proactively (not discovered via a failing diff, unlike Select's case) since the mechanism and expected failure mode are already documented from Select's iteration; will confirm against `diff.png` in Iteration 1 regardless.

### Preparation Phase — cross-checks performed

- `mcp__react-aria__get_react_aria_page('TagGroup')` was not available as a dedicated data-attributes table per the taxonomy's own Confidence section — the taxonomy's `data-*` surface was cross-verified there against `node_modules/react-aria-components/dist/types/src/TagGroup.d.ts` and `Collection.d.ts`; re-verified independently here against the same files plus `node_modules/react-aria/dist/private/tag/useTag.mjs` and `useTagGroup.d.ts` (confirms `onRemove`/`selectionMode`/`selectedKeys`/`defaultSelectedKeys`/`disabledKeys` live on `AriaTagGroupProps` via `MultipleSelection`, and that `removeButtonProps` — including a localized default `aria-label` — is supplied automatically via the `Button[slot=remove]` context, so no manual `aria-label` is needed on the Remove Button in TSX). No prop with layout/selection-mode/variant semantics was found missing from the taxonomy (P038).
- Loaded Bootstrap KB `components.md` (Button, Badge, Close Button entries) and `states.md` (Hover/Focus/Active-Pressed/Disabled sections) — confirmed `.btn:focus-visible`, `.btn:disabled, .btn.disabled`, and `.btn-close`'s hover/focus/disabled token values all match the taxonomy's literal values exactly; no gap found relative to what the taxonomy already encodes. `patterns.md` was not consulted — Tag/TagGroup/TagList are not a compound Dropdown-style multi-level DOM pattern, and no taxonomy DOM-conflicts entry pointed at a `patterns.md`-scoped question.
- Read all four pre-extracted reference CSS files (`agent/artifacts/reference-css/taggroup-{default,states,removable,with-label-and-description}.css`) in full — confirmed they match `presentation.scss`'s TagGroup section verbatim (both are downstream of the same reference story), and contain no `white-space`/`overflow`/`text-overflow` rule on `.tag` despite the taxonomy's Reference story canvas prose mentioning such a rule "per the pre-existing vanilla scaffold — retained." Per blank-slate mode, treated the extracted CSS (the primary specification per P036/P050) as authoritative over that prose note, which appears to describe a property that was not actually carried into the current `presentation.scss` `.tag` block — did not add `white-space:nowrap`/`overflow:hidden`/`text-overflow:ellipsis` to the bridge, since none of the four reference stories constrain any Tag's width (all specimens render in unconstrained flex-wrap rows), so no visible clipping behavior exists to reproduce.

### Phase B — mirror stories and CSS extraction

Implemented all four mirror stories (`stories/react-aria-bootstrap/mirror/TagGroup.mirror.stories.tsx`: Default, States, Removable, WithLabelAndDescription), matching reference story names exactly. Added a `removeButtonClassName` prop to the exported `Tag` component (not present in the original stub) so the Removable story's per-specimen `.faux-hover`/`.faux-focus-visible` states could target the nested Remove Button independently of the Tag body — no other way to reach that inner element from outside `Tag`, since only `TagGroup`/`Tag` are exported (matching the original stub's export surface; `TagList` stays internal).

Ran `node scripts/extract-story-css.mjs` for all four stories. Note: `component-agent.md`'s literal example invocation (`--story "Bootstrap Mirror/{ComponentName}/{StoryName}"`) does not match the script's actual expected input — the script builds the Storybook URL directly from the `--story` value (`?path=/story/${story}`), which requires Storybook's kebab-case story id (e.g. `bootstrap-mirror-taggroup--default`), not the human-readable title path. The slash/title-case form timed out waiting for the preview iframe; switched to the kebab-case id form (matching `compare-stories.mjs`'s own documented `--reference`/`--impl` format) and all four extractions succeeded (60/65/96/71 rules respectively).

### Iteration 0 (Inception) — comparison loop, all stories

Ran `compare-stories.mjs` for all four stories in one pass before any fixes, per protocol:

| Story | Diff% | Exit code |
|---|---|---|
| default | 0.00% | 0 |
| states | 0.00% | 0 |
| removable | 0.00% | 0 |
| with-label-and-description | 0.08% | 0 |

**Observations:** all four passed outright — no fix loop entered for any story. This is a first for this batch (Select and Tabs both needed at least one fix-loop iteration); attributed to reusing `presentation.scss`'s already-verified `.tag`/faux-state/`.tag-selected`/`.btn-close.remove-button` rules as-is (Phase A decision above) rather than re-deriving equivalent bridge CSS independently, combined with proactively applying the `tag-group-with-label` flex-column bridge from Select's precedent up front instead of discovering the gap via a failing diff.

**Principles used:**
- `P047 presentation-import` — mirror story imports `presentation.scss` directly, making the reused `.tag`/faux-state classes available
- `P002 class-in-tsx` / `P001 compound-sel` — callback-form `className` throughout, preserving RAC default classes for bridge selector targeting
- `P044 faux-state-class` — `.faux-hover`/`.faux-focus-visible`/`.faux-pressed` for Tag's non-declarative states; `removeButtonClassName` extended this pattern to the Remove Button sub-element

**Code changes made:** None during this pass — Phase A/B implementation already covered all four stories; this pass only measured baseline diffs, and all passed.

### Final Verification Sweep

`git diff --name-only $(git merge-base HEAD main)..HEAD | grep 'stories/react-aria-bootstrap/.*\.scss'` — checked before the sweep; no new SCSS files were created under `stories/` (only `_bootstrap-bridges.scss` under `src/scss/` was modified; `presentation.scss` was pre-existing with its TagGroup section already in place from Stage 4, not created or newly modified by this agent).

Re-ran all four stories with `--threshold 0.003` (same as Inception, since no code changes were made in between): all four still pass, same diff percentages as above.
