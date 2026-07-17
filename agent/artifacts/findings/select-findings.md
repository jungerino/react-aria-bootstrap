---
component: Select
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| default | Pass | 0 | 0 | 0.29% |
| states | Pass | 0 | 0 | 0.00% |
| open | Pass | 0 | 0 | 0.25% |
| open-item-states | Pass | 0 | 0 | 0.22% |
| open-grouped | Pass | 0 | 0 | 0.25% |
| multi-select | Pass | 2 | 0 | 0.25% |

## Work Log

Blank-slate mode was ON for this session. No `git log`, `git show`, `git diff`
against a prior commit, or any other command reading past-commit content was run
for the TSX implementation, bridge CSS, mirror stories, or this findings doc.
`Select.tsx` and `Select.mirror.stories.tsx` were confirmed as stub/placeholder
content before implementation began (empty component body, `Placeholder` story
only; `_bootstrap-bridges.scss` contained only its header comment).

### default, states, open, open-item-states, open-grouped — Iteration 0

**Observations:** All five stories passed on the first `compare-stories.mjs` run
with no code changes, at diff% between 0.00% and 0.29% (threshold 0.3%). No
FAIL/UNRESOLVED specimens beyond routine subpixel antialiasing noise (see each
story's own findings doc).

**Principles used:**
- P001 compound-sel — every bridge selector and TSX `className` keeps the RAC
  default class alongside Bootstrap classes (e.g. `.react-aria-Button.form-select`).
- P002 class-in-tsx — literal compound-string form used throughout (no
  `defaultClassName` callback needed; no conditional class logic required at the
  root/trigger/value/popover/listbox level).
- P003 scss-bridge — every taxonomy-listed `data-*` state with a "Compound
  selector bridge" strategy got one: trigger `[data-focused]`/
  `[data-focus-visible]`/`[data-pressed]`/`[data-disabled]`, root-informs-trigger
  `[data-open]`/`[data-invalid]`, `SelectValue[data-placeholder]`, item
  `[data-hovered]`/`[data-focused]`/`[data-focus-visible]`/`[data-pressed]`/
  `[data-selected]`/`[data-disabled]`.
- P013 prefer-component-cls — `.form-select`, `.form-label`, `.form-text`,
  `.invalid-feedback`, `.dropdown-menu`, `.dropdown-listbox`, `.dropdown-item`,
  `.dropdown-header` throughout; no utility classes used for anything but the
  pre-existing `select-demo`/`reference-*` story-layout helpers.
- P014 data-pressed — trigger `[data-pressed]` bridge (tertiary-bg tint) and item
  `[data-pressed]` bridge (active color/bg) both keyed off `data-pressed`, not
  `:active`.
- P015 scss-mixins — deliberately did NOT use `@include box-shadow(...)` for the
  focus/invalid box-shadow bridges: this project's `$enable-shadows` is `false`,
  and the mixin emits nothing at all when that flag is off (verified in
  `mixins/_box-shadow.scss`); Bootstrap's own `_form-select.scss` bypasses the
  mixin in the same branch for the same reason, so raw `box-shadow:` declarations
  are the correct, counterpart-matching choice here (P-036), not a violation of
  P015's intent.
- P024 caret-flip — `.react-aria-Select[data-open] .select-chevron { transform:
  rotate(180deg); }`, a real icon transform (not a background-image swap).
- P025 hardcode-show — `.show` hardcoded directly in the Popover's `className` in
  TSX (`select-popover dropdown-menu show`), not via a bridge rule.
- P036 derive-from-counterpart — every trigger/item bridge rule's property values
  were copied from the pre-extracted reference CSS's compiled `.form-select`/
  `.dropdown-item` rules, not approximated.
- P044 faux-state-class — `.faux-focus-visible-scope`/`.faux-pressed-scope`
  wrapper-div pattern added to `presentation.scss` for the trigger's two
  non-declarative states (Select exposes no className passthrough to its internal
  Button); item-level faux states (`Hovered`/`Focused` in OpenItemStates) use the
  existing `.faux-hover`/`.faux-focus-visible` classes merged directly onto
  `SelectItem` via its `className` prop.
- P047 presentation-import — `import '../presentation.scss'` in the mirror
  stories file.
- P049 rac-trigger-width — `.dropdown-menu[data-trigger='Select'] { width:
  var(--trigger-width); }`, matching the principle's own canonical example
  exactly.
- P050 reboot-mismatch — verified directly in `private/Header.mjs` that RAC's
  `Header` renders a `<header>` element, not `<h6>`; added `.dropdown-header {
  font-weight: 500; line-height: 1.2; }` to compensate for the two h6-reboot
  properties (`_reboot.scss`) that `.dropdown-header`'s own rule doesn't already
  override (font-size/color/margin-bottom/display all are; margin-top is
  `<header>`'s own default of 0 anyway, so no gap there).
- P052 portal-no-ancestor-sel — no ancestor selector ever crosses the portal
  boundary from outside; `.dropdown-menu[data-trigger='Select']` and
  `.react-aria-Select[data-open] .select-chevron` both stay within a single
  contiguous DOM subtree (Popover→ListBox is entirely inside the portal; Select
  root→Button→chevron is entirely outside it).
- D-form-select-class, D-selected-indicator, D-multi-select-scope, D-pressed-state
  (all taxonomy `## Decisions`) — applied as resolved, not re-derived.

**Code changes made:**
- `src/react-aria-bootstrap/Select.tsx`: full implementation (`Select`,
  `SelectItem`, `SelectSection`, `SelectSectionHeader`).
- `src/scss/_bootstrap-bridges.scss`: full Select bridge section (trigger,
  root-informs-trigger, chevron, SelectValue, Popover, FieldError, ListBoxItem,
  section header — see file for the complete rule set).
- `stories/react-aria-bootstrap/mirror/Select.mirror.stories.tsx`: all six
  stories (Default, States, Open, OpenItemStates, OpenGrouped, MultiSelect).
- `stories/react-aria-bootstrap/presentation.scss`: added
  `.faux-focus-visible-scope`/`.faux-pressed-scope` wrapper rules under the
  existing Select section.

### multi-select — Iteration 0

**Observations:** Failed at 0.39% (threshold 0.3%). Two independent causes, both
copied verbatim into this component's own findings doc (`select-multi-select-
findings.md`): (1) trigger showed only the word "and" instead of "Alabama and
Alaska" — `item.textValue` resolving to `''` because `SelectItem` always passes a
function to `ListBoxItem`'s `children`, breaking RAC's auto-derivation, which
then breaks `SelectValue`'s `Intl.ListFormat.formatToParts` call for multi-select
summaries (verified directly in Node: `formatToParts(['', ''])` returns only the
literal separator, no element parts). (2) a stray native focus-ring box around
the auto-focused-on-open "Alabama" row, absent from the reference — RAC
auto-focuses the first selected item whenever the popover opens without a
preceding real user gesture (`state.focusStrategy` stays `null`, so
`useSelect`'s `menuProps.autoFocus` resolves to plain `true` — verified in
`useSelect.mjs`); single-select stories mask this because the auto-focused item
already carries the `.active` fill the ring visually disappears into, but
multi-select items never get that fill.

**Principles used:**
- P036 derive-from-counterpart / general debugging — root-caused both failures
  against actual library source (`Select.mjs`, `useSelect.mjs`, `ListBox.mjs`)
  and a direct Node repro of `Intl.ListFormat.formatToParts`, rather than
  guessing from the screenshot alone.
- D-multi-select-scope — the outline-suppression fix is scoped specifically to
  `[data-selection-mode='multiple']` so it doesn't touch single-select's
  taxonomy-mandated native-outline "Focused" specimen in OpenItemStates.

**Code changes made:**
- `src/react-aria-bootstrap/Select.tsx:82-107` (`SelectItem`): derive and pass an
  explicit `textValue` prop (from plain-string `children` when the caller didn't
  supply one).
- `src/scss/_bootstrap-bridges.scss`: added
  `.react-aria-ListBoxItem.dropdown-item[data-selection-mode='multiple'] {
  outline: none; }`.
- Shared selectors modified: `SelectItem`'s `textValue` derivation is shared by
  every story that renders a `SelectItem` → re-ran the full 6-story sweep
  (iteration 2 below), all still Pass.

### All stories — Iteration 2 (final verification sweep)

**Observations:** Re-ran `compare-stories.mjs` for all six stories after the
multi-select fixes, per the Shared Selector Changes rule. All six Pass, no
regressions. No new SCSS files under `stories/` (`git diff --name-only
$(git merge-base HEAD main)..HEAD -- stories/` shows only the pre-existing,
sanctioned `presentation.scss` modified — no new component-scoped stylesheet
created).

**Principles used:** (see Iteration 0 list above — unchanged)

**Code changes made:** None — verification only.
