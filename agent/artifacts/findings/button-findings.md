---
component: Button
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| default | Pass | 2 | 0 | 0.00% |
| sizes | Pass | 2 | 0 | 0.00% |
| states | Pass | 2 | 0 | 0.00% |
| pending | Pass | 2 | 0 | 0.01% (36px) |
| icon-only | Pass | 2 | 0 | 0.00% |

## Work Log

### All stories — Iteration 1 (Inception)

**Observations:** All five stories (default, sizes, states, pending,
icon-only) passed on the first `compare-stories.mjs` run, before any
post-Inception code changes. `pending` recorded 26/548800 px of diff
(0.0047%), attributed to the `.spinner-border` animation frame differing
between the two screenshots (Animation Exception) — far under the 0.3%
threshold regardless.

**Principles used:**
- P002 class-in-tsx — callback-form `className` on `RACButton`, merging the
  RAC default class, `.btn` + variant/size/icon-only classes, and any
  caller-supplied `className`.
- P001 compound-sel — `.react-aria-Button.btn[data-*]` compound selectors in
  all bridge rules.
- P003 scss-bridge — `[data-hovered]`, `[data-focus-visible]`, `[data-pressed]`,
  `[data-pressed][data-focus-visible]`, `[data-disabled]`, `[data-pending]`
  bridges added to `_bootstrap-bridges.scss`, uniformly, even where the native
  pseudo-class already fires (belt-and-suspenders per button-taxonomy.md).
- P007 variant-replace — full 17-value Bootstrap variant set
  (`variantClassMap`), `'quiet'` dropped entirely.
- P013 prefer-component-cls — `.btn`/`.btn-{variant}`/`.btn-{size}` component
  classes; no utility classes used.
- P014 data-pressed — `[data-pressed]` bridge mirrors `.btn:active`.
- D-pending-indicator-composition — raw `.spinner-border.spinner-border-sm` +
  `role="status"` markup rendered directly inside Button, no `<ProgressCircle>`
  dependency.
- D-icon-only-scope — `iconOnly` prop applies the pre-existing `.btn-icon-only`
  recipe from presentation.scss (custom, non-Bootstrap-precedented).
- D-variant-scope / D-size-scope — full 17-variant set and `sm`/`lg` size prop
  exposed per taxonomy resolution.

**Code changes made:**
- `src/react-aria-bootstrap/Button.tsx` (new): `variant`, `size`, `iconOnly`
  props; `isPending` renders raw spinner + status markup; `className` merges
  caller-supplied classes (needed so mirror-story faux-state classes like
  `.faux-hover` land on the rendered `<button>` — Button has no composite
  sub-parts blocking passthrough, unlike Select's root).
- `src/scss/_bootstrap-bridges.scss`: added a Button section — six `[data-*]`
  bridge rules, all reusing token values already verified against compiled
  CSS in presentation.scss's Button `.faux-*` classes.
- `stories/react-aria-bootstrap/mirror/Button.mirror.stories.tsx`: 5 stories
  (Default, Sizes, States, Pending, IconOnly) mirroring the reference story
  layout/order exactly.
- No changes to `presentation.scss` — its existing Button section
  (`.faux-hover`, `.faux-focus-visible`, `.btn-link.faux-focus-visible`,
  `.faux-pressed`, `.faux-pressed.faux-focus-visible`, `.faux-pending`,
  `.btn-icon-only`), written during Stage 4 reference-story authoring, was
  reused as-is by the mirror stories via the `className` merge.
- Shared selectors modified: none shared with other components (all Button
  bridge selectors are scoped to `.react-aria-Button.btn`/`.btn-link`) — no
  other stories required re-running.

### Tooling note

`scripts/extract-story-css.mjs --story` requires the Storybook slug ID (e.g.
`bootstrap-mirror-button--default`), not the human-readable title path shown
in component-agent.md's documented usage example
(`"Bootstrap Mirror/Button/Default"`) — the latter causes the script's
`waitForFunction` to time out (it navigates literally to
`?path=/story/Bootstrap Mirror/Button/Default`, which Storybook's manager UI
does not resolve to a valid iframe story). Used the slug form for all five
extractions; flagging here in case this is a broader documentation gap for
future component agents.

### Blank-slate note

Blank-slate mode was ON for this run. No `git log`, `git show`, `git diff` against
a prior commit, or any other command reading past-commit content was run for TSX
implementation, bridge CSS, mirror stories, or this findings doc. The pre-existing
`src/react-aria-bootstrap/Button.tsx` and
`stories/react-aria-bootstrap/mirror/Button.mirror.stories.tsx` found at session
start were stub placeholders (RAC passthrough only / `Placeholder` story only) —
not a prior implementation — so no re-derivation-avoidance issue applied. The
`presentation.scss` "Button" section (faux-state classes, `.btn-icon-only`) and
`_bootstrap-bridges.scss`'s pre-existing Select section were already present in
the working tree from the Stage 4 reference-story-authoring commit and Select's
own Tier 1 pass respectively; both were read as informational/reference inputs
only (not treated as this component's own prior resolution), consistent with
`component-agent.md`'s scope for reference inputs.
