---
component: Tabs
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| default | Pass | 0 | 0 | 0.00% |
| states | Pass | 0 | 0 | 0.00% |
| vertical | Pass | 0 | 0 | 0.07% |
| fill-and-justified | Pass | 0 | 0 | 0.07% |

## Work Log

### default — Iteration 0

**Observations:** Inception pass matched the reference exactly (0.00% diff,
0 / 548800 px). No fix loop entered.

**Principles used:**
- `P001 compound-sel` — RAC default class kept alongside Bootstrap classes throughout (`.react-aria-Tab.nav-link`, `.react-aria-TabList.nav`, `.react-aria-TabPanels.tab-content`)
- `P002 class-in-tsx` — callback form for `Tab`/`TabList`; literal-string form 2 for `TabPanels` (its `className` has no render-prop form)
- `P013 prefer-component-cls` — `.nav`, `.nav-underline`, `.nav-link`, `.tab-content` used throughout; no utility classes in the component itself

**Code changes made:**
- `src/react-aria-bootstrap/Tabs.tsx`: full implementation (Phase A)
- `src/scss/_bootstrap-bridges.scss`: Tabs section added (Phase A)
- `stories/react-aria-bootstrap/mirror/Tabs.mirror.stories.tsx`: Default story (Phase B)

### states — Iteration 0

**Observations:** Inception pass matched the reference exactly (0.00% diff).
Confirms the `[data-disabled]`-before-`[data-selected]` bridge declaration
order correctly reproduces real Bootstrap's cascade outcome for the
Selected + Disabled specimen (active color/weight/underline wins; disabled's
`pointer-events`/`cursor` are non-overlapping and unaffected by order).

**Principles used:**
- `P003 scss-bridge` — `[data-selected]`/`[data-disabled]` bridged explicitly; `[data-hovered]`/`[data-focused]`/`[data-focus-visible]`/`[data-pressed]` deliberately left unbridged per taxonomy (native pseudo-classes fire directly; no `:active` rule exists for `.nav-link` at all)
- `P044 faux-state-class` — `.faux-hover`/`.faux-focus-visible` (already defined in `presentation.scss`) applied via `Tab`'s `className` passthrough
- `G050 native-active-keyboard-gap` (exception verified, not applied) — `.nav-link` has no `:active` rule in compiled CSS, so there is nothing for `[data-pressed]` to bridge

**Code changes made:**
- `stories/react-aria-bootstrap/mirror/Tabs.mirror.stories.tsx`: States story (Phase B) — two adjacent `Tabs` instances joined by `d-flex gap-3` (Tabs' single-selection constraint means "Selected" and "Selected + Disabled" can't share one instance)

### vertical — Iteration 0

**Observations:** Inception pass within threshold (0.07% diff, 393 / 548800
px) — not investigated further.

**Principles used:**
- `P040 container-owns-boundary` (n/a — no boundary needed) / structural: `data-orientation` drives both the Tabs-root bridge (`flex-direction: row; align-items: flex-start; gap: 1rem`) and the TabList bridge (`flex-direction: column`) automatically via RAC's own attribute

**Code changes made:**
- `stories/react-aria-bootstrap/mirror/Tabs.mirror.stories.tsx`: Vertical story (Phase B)

### fill-and-justified — Iteration 0

**Observations:** Inception pass within threshold (0.07% diff, 362 / 548800
px) — not investigated further. Both `.nav-fill`/`.nav-justified` width
distributions visibly diverge as intended.

**Principles used:**
- `P013 prefer-component-cls` — Decision D3 implemented by appending the literal `nav-fill`/`nav-justified` Bootstrap class via React Context, rather than reproducing the effect with a synthetic bridge selector

**Code changes made:**
- `src/react-aria-bootstrap/Tabs.tsx`: `TabsFillContext` + `fill` prop (Phase A)
- `stories/react-aria-bootstrap/mirror/Tabs.mirror.stories.tsx`: FillAndJustified story (Phase B)

### Blank-Slate Mode note

Git history and any prior iteration's deleted/removed content were not
consulted for this implementation. `git log`/`git show`/`git diff` against a
prior commit were not run. The pre-existing `src/react-aria-bootstrap/Tabs.tsx`
and `stories/react-aria-bootstrap/mirror/Tabs.mirror.stories.tsx` stub files
were treated as orchestrator-created placeholders per the dispatch prompt
(bare React Aria component with no Bootstrap classes; a single empty
`Placeholder` story export) and were replaced outright, not extended. The
pre-existing `src/Tabs.css` (vanilla-starter per-component CSS, predates this
experiment) was read only as a currently-present working-tree file to
understand the component's prior sub-part structure — not as a source of any
Bootstrap-mapping conclusion (it contains none). It is not imported by the
new implementation.

### Phase A — Implementation decisions

- **No import of `src/Tabs.css`.** Matches Select's established precedent
  (same batch): the file is keyed to the vanilla-starter's phased-out
  `--text-color`/`--spacing-*`/`--gray-*` token namespace and would apply
  conflicting, non-Bootstrap treatments to `.react-aria-Tab`/`TabPanel`/
  `SelectionIndicator` alongside the new Bootstrap bridge. All styling for
  the real component — including the root wrapper's orientation layout,
  which the taxonomy explicitly calls out as having no Bootstrap counterpart
  — lives in `src/scss/_bootstrap-bridges.scss` instead, matching the
  established pattern already visible there for Select's `.select-with-label`
  root wrapper (also a "no direct Bootstrap counterpart" case resolved the
  same way).

- **`SelectionIndicator` is not rendered at all** (Decision D2) — no render
  call, no suppression CSS needed.

- **Fill/justify (Decision D3) implemented via React Context**, not a
  data-attribute bridge selector. `Tabs` accepts `fill?: 'proportional' |
  'justified'` and provides it via `TabsFillContext`; `TabList` reads the
  context and appends the literal Bootstrap class (`nav-fill`/`nav-justified`)
  to its own className. This lets Bootstrap's own compiled CSS
  (`.nav-fill > .nav-link`, `.nav-justified > .nav-link`) apply unmodified —
  preferred over inventing a bridge selector per P013 (prefer real component/
  modifier classes over reproducing their effect via bridge CSS).

- **Taxonomy completeness gap found and resolved without escalation:**
  cross-checking `react-aria-components/dist/private/Tabs.js` (the actual
  compiled RAC source, consulted per Preparation Phase step 2's "verify every
  `data-*` attribute in the docs appears in the taxonomy's state mappings")
  found the `Tabs` root itself also carries `data-focused`, `data-focus-visible`,
  and `data-disabled` (via `useFocusRing({ within: true })` and the Tabs-level
  `isDisabled` prop) — none of which appear in the taxonomy's Tabs (root)
  state-mappings table (only `data-orientation` is listed there). Resolution:
  left unbridged. No Bootstrap concept exists for a whole tabs+content
  composite's focus-within ring or disabled treatment (Bootstrap's `.nav`/
  `.tab-content` are two independent trees with no such wrapper), and an
  unbridged `data-*` attribute with no matching CSS selector produces no
  visual output — so this is a documentation gap, not a functional or visual
  one. None of the four approved stories exercise Tabs-level `isDisabled` or
  focus-within styling. Logged here per the "When Bootstrap Mapping Cannot Be
  Found" appendix in principles.md rather than filed as an
  `EXTRACTED-CSS-GAP` (there is nothing to extract — no Bootstrap rule exists
  for this state at all, at any specificity).

- **`data-selected`/`data-disabled` cascade ordering (Tab).** Both bridge
  selectors are written at equal specificity (`.react-aria-Tab.nav-link[data-X]`
  — 3 simple selectors each), unlike real Bootstrap's asymmetric specificity
  (`.nav-underline .nav-link.active` at 0,3,0 vs. `.nav-link.disabled` at
  0,2,0). Declared `[data-disabled]` before `[data-selected]` in source order
  so the shared `color` property's tie resolves to the selected/active value,
  matching the real cascade's outcome (verified against the States reference
  image: the "Selected + Disabled" specimen shows bold black underlined text,
  i.e. the active look wins, with disabled's `pointer-events`/`cursor`
  presumed still applied since they're non-overlapping properties).

- **`data-inert` bridge scoped to exclude `data-exiting`** —
  `.react-aria-TabPanel[data-inert]:not([data-exiting])`. Verified against
  RAC source that `data-inert` fires on *any* non-selected panel, including
  one currently mid-exit-animation, which would otherwise conflict with the
  taxonomy-mandated retained opacity cross-fade (`data-exiting` → `opacity:
  0` with a transition) by hiding it outright via `display: none` before the
  fade could render. Not exercised by any approved story (no story captures
  a mid-transition frame); included for interactive-usage correctness.

### Preparation Phase — inputs consulted

- Taxonomy `agent/taxonomies/Tabs-taxonomy.md` (Decisions D1–D3, all sub-part
  tables, DOM conflicts, reference story canvas).
- `mcp__react-aria__get_react_aria_page` (Tabs) — full API table cross-checked
  against taxonomy Variants section (P038): `orientation`, `keyboardActivation`,
  `Tab.isDisabled`, `Tab.href`, `TabPanel.shouldForceMount` all covered. No
  variant/layout/selection-mode prop gap found.
- `react-aria-components/dist/private/Tabs.js` (installed package source) —
  read directly to enumerate every `data-*` attribute RAC actually sets per
  sub-part, since the taxonomy's state-mapping tables needed independent
  verification (see completeness gap above).
- Bootstrap KB: `components.md#nav--tabs`, `states.md` (Active/Persistent,
  Nav Link hover/focus-visible, Disabled sections).
- Pre-extracted reference CSS: `agent/artifacts/reference-css/tabs-{default,
  states,vertical,fill-and-justified}.css`.
- Reference images: `.reference-images/tabs/{default,states,vertical,
  fill-and-justified}.png` — read once during Preparation Phase.
