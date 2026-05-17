---
title: Iteration Protocol — Mapping and References
---

# Iteration Protocol — Mapping and References

This document describes the workflow for each `mapping-and-references` experiment iteration.

## Overview

Goal: Develop a reusable agent skill for producing per-component taxonomy documents (sub-part identification, state mappings, bridge strategy, DOM conflicts, variants, decisions needed) and Storybook reference stories in a single consolidated pass.

Each iteration works through a fixed component set in two phases:
- **Phase 1 — Taxonomy and mapping formation**: For each component, identify sub-parts, map states with bridge strategy, document DOM conflicts, enumerate variants, surface decisions needed, and specify the reference story canvas layout. Pause for user review.
- **Phase 2 — Reference story implementation**: Build the approved taxonomy as Storybook stories using pure Bootstrap HTML.

Principles discovered in each iteration are accumulated in `agent/mapping-and-references-skill.md`.

---

## Branch naming

- `mapping-and-references` — integration branch; holds approved taxonomy files, finalized story files, and the growing skill doc
- `mapping-and-references_0`, `mapping-and-references_1`, … — experiment branches; cut from `mapping-and-references`

---

## Cutting a new experiment branch

Cut `mapping-and-references_N` from `mapping-and-references`. First commit on the branch:

1. Create `agent/review-iteration-N.md` with the stub below.
2. For each component in this iteration's test set, **write or overwrite** the stub story file at `stories/bootstrap-test/bootstrap-reference/ComponentName.reference.stories.tsx` (see stub below). If a file already exists from a prior iteration, replace its entire contents with the stub — do not preserve prior implementation. These files are the primary output of Phase 2; they are stubbed here so Storybook launches without a "no story files found" error and to make the iteration's scope explicit from the start.

3. Reset `stories/bootstrap-test/bootstrap-reference/augments.scss` to a single comment line (`// Augmentations to be added in Phase 2`) — even if the file already has content from a prior iteration.

**`agent/review-iteration-N.md` stub:**

```markdown
---
title: Review — Iteration N
status: in-progress
---

# Review — Iteration N

## Components
(list the component set for this iteration)

## Phase 1 — Taxonomy decisions
*(agent fills in after taxonomy formation)*

## Phase 2 — Implementation notes
*(agent fills in after story implementation)*

## User review
*(user fills in during debrief)*

## Principles extracted
*(filled in during debrief — these go into `agent/mapping-and-references-skill.md`)*

## Skill update status
- [ ] `agent/mapping-and-references-skill.md` updated
- [ ] Finalized taxonomy files merged to `mapping-and-references`
- [ ] Finalized story files merged to `mapping-and-references`
- [ ] `CLAUDE.md` iteration counter incremented
```

Commit message: `chore: stub review-iteration-N for experiment branch`

**`stories/bootstrap-test/bootstrap-reference/ComponentName.reference.stories.tsx` stub:**

```tsx
import type { Meta } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/ComponentName',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

// Stories to be implemented in Phase 2
```

Commit message: `chore: stub story files for iteration N component set`

(Steps 2 and 3 go in the same commit.)

---

## Inputs (available on all experiment branches)

Load these at session start:

1. **`agent/mapping-and-references-skill.md`** — current methodology and story construction principles; treat as the primary reference
2. **`agent/bootstrap-kb/`** — Bootstrap reference; navigate via `README.md`, load files selectively per component
3. **`agent/reference-stories/`** — completed taxonomy files from prior iterations (read-only reference, if present)

---

## Phase 1 — Taxonomy and mapping formation

### Per-component work sequence

For each component in the iteration:

1. **Read React Aria docs** — call `mcp__react-aria__get_react_aria_page`. Enumerate every `data-*` attribute listed before writing any state mappings (M008).
2. **Load KB** per M003 sequence — `README.md` → `components.md` entry → `states.md` → `patterns.md` if applicable.
3. **Apply INERT heuristic** — pre-classify class-based state selectors and native-element pseudo-classes as INERT; audit `:hover`, `:focus-visible`, `:focus` individually (M007).
4. **Write the taxonomy entry** (see format below) before moving to the next component. Do not hold all entries in memory.

Document all non-obvious decisions in the `## Phase 1 — Taxonomy decisions` section of `agent/review-iteration-N.md` as you go.

After all components are written: run the self-review checklist (below), then **pause for user review before proceeding to Phase 2.**

### Taxonomy format

Write taxonomy to `agent/reference-stories/componentname-taxonomy.md`. Use this format for each component:

```markdown
## ComponentName

**React Aria root class:** `.react-aria-ComponentName`
**Mapping type:** 1:1 — [Bootstrap Component] | Composite — (see sub-parts table)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-ComponentName` | [Bootstrap component] | `.bs-class` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Color | … | `.btn-primary`, `.btn-secondary`, … | Bootstrap | React Aria quiet/destructive out of scope |
| Size | (none) | `.btn-sm`, `.btn-lg` | Bootstrap | — |

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Root | `:hover` | No bridge needed — CSS pseudo-class overlap |
| Selected | `[data-selected]` | Root | `.active` | Compound selector: `.react-aria-X[data-selected]` |

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| Root | MINOR | `<button>` | `<button>` | No conflict |

*(Conflict types: MINOR — works with bridge; MAJOR — requires workaround; CRITICAL — structural incompatibility)*

### Reference story canvas

- **Stories (sub-parts):** [list each sub-part that gets a story]
- **Grid columns:** [number]
- **Width constraint:** [~1280px or note if wider]
- **Notes:** [any layout decisions, e.g. dark-background wrapper for light variants]

### Decisions needed

*(Omit section if no genuine forks. One numbered question per fork: the choice, options, trade-offs.)*

### Confidence: High / Medium / Low

*Note reason if Medium or Low.*
```

### Self-review checklist

Before presenting taxonomy for user review, verify:

- [ ] Every named React Aria sub-part has its own row in the sub-parts table
- [ ] Every `data-*` attribute listed in the React Aria docs appears in state mappings
- [ ] INERT heuristic applied: class-based state selectors and native-element pseudo-classes pre-classified as INERT; `:hover`, `:focus-visible`, `:focus` individually audited
- [ ] Every DOM conflict has a proposed resolution and a conflict type (MINOR/MAJOR/CRITICAL)
- [ ] Confidence rating assigned; reason given for anything below High
- [ ] `[NO DIRECT COUNTERPART]` flags include the closest structural pattern, closest visual pattern, and alternatives considered (M006)
- [ ] Variants table present; Bootstrap visual variants listed as the complete set; React Aria-only visual variants excluded (not nearest-matched); structural variants mapped or noted as "custom CSS required"
- [ ] Genuine forks surfaced in Decisions needed; no fork resolved unilaterally (M016)
- [ ] All four M016 trigger patterns checked: variant exposure, "design choice" entries, cross-component consistency, hardcoded numeric values in CSS deltas
- [ ] Reference story canvas section present: stories list, grid columns, width constraint, layout notes
- [ ] P-T001 applied: no sub-part omitted on grounds of "covered in another component's story"
- [ ] P-T002 applied: no failure-case or unstyled-baseline specimens planned

---

## Phase 2 — Story implementation

For each approved taxonomy, implement reference stories.

### File locations

- Story files: `stories/bootstrap-test/bootstrap-reference/ComponentName.reference.stories.tsx`
- Title pattern: `Bootstrap Reference/ComponentName/SubPartName` (creates nested Storybook tree)
- Custom CSS augmentations: `stories/bootstrap-test/bootstrap-reference/augments.scss`

The `main.js` glob covers this subdirectory.

### Construction rules

1. **HTML from Bootstrap docs** — fetch the relevant Bootstrap docs page; copy example markup verbatim. Adapt to JSX syntax only (`class` → `className`, `for` → `htmlFor`, `checked` → `defaultChecked`). Do not paraphrase or restructure.
2. **Bootstrap CSS only** — no React Aria components, no project CSS. These are pure Bootstrap reference specimens.
3. **Augment minimally** — where Bootstrap has no counterpart (e.g., ListBox `layout="grid"`), add the minimum custom CSS to `augments.scss`. Import it in the story file with `import './augments.scss'`.
4. **Labeled specimens** — each specimen has a short text label above it identifying the state/variant shown (e.g., "Selected", "Disabled + focused").
5. **Single viewport** — all specimens in a story must be visible at ~1280px width. Use a CSS grid wrapper div in the story render function; column count specified in the taxonomy.
6. **Source attribution** — each story's `parameters.docs.description.story` cites the Bootstrap docs URL the markup was sourced from.

See `agent/mapping-and-references-skill.md` Part 6 for current story construction principles.

Document all non-obvious decisions in the `## Phase 2 — Implementation notes` section of `agent/review-iteration-N.md` as you go.

---

## Debrief

User reviews the implemented stories in Storybook and provides observations.

**Write each observation to `agent/review-iteration-N.md` immediately — before replying to the user.** Do not batch, do not defer. If the user gives multiple observations in one message, write all of them before replying.

Both taxonomy decisions and story quality are in scope for debrief.

---

## After debrief

1. Update `agent/mapping-and-references-skill.md`:
   - Add new principles extracted from debrief
   - Refine existing principles
   - Mark resolved open questions
2. Tick off the Skill Update Status checklist in `agent/review-iteration-N.md`.
3. Merge finalized files to `mapping-and-references` integration branch (file-by-file checkout, not cherry-pick):
   ```sh
   git checkout mapping-and-references_N -- agent/mapping-and-references-skill.md
   git checkout mapping-and-references_N -- agent/review-iteration-N.md
   git checkout mapping-and-references_N -- agent/reference-stories/componentname-taxonomy.md
   git checkout mapping-and-references_N -- stories/bootstrap-test/bootstrap-reference/ComponentName.reference.stories.tsx
   # stage and commit on mapping-and-references
   ```
4. Update `CLAUDE.md` on `mapping-and-references`: increment iteration counter, add 1-line note.
5. Commit.

---

## Updating mapping-and-references from an experiment branch

Never use `git cherry-pick`. Cherry-picked commits may bundle multiple files. Use file-specific checkout as shown above.

Taxonomy files and story files accumulate on the integration branch as they are finalized. The skill doc (`mapping-and-references-skill.md`) is always wholesale-checked-out from the latest experiment branch.
