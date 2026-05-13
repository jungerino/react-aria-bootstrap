---
title: Iteration Protocol — Reference Stories
---

# Iteration Protocol — Reference Stories

This document describes the workflow for each `reference-stories` experiment iteration.

## Overview

Goal: Develop a reusable agent skill for producing sub-part Bootstrap reference stories for React Aria components.

Each iteration works through a fixed component set in two phases:
- **Phase 1 — Taxonomy formation**: Define which sub-parts get stories, which specimens appear per sub-part, and canvas layout.
- **Phase 2 — Story implementation**: Build the approved taxonomy as Storybook stories using pure Bootstrap HTML.

Principles discovered in each iteration are accumulated in `agent/reference-stories-skill.md`.

---

## Branch naming

- `reference-stories` — integration branch; holds approved taxonomy files, finalized story files, and the growing skill doc
- `reference-stories_0`, `reference-stories_1`, … — experiment branches; cut from `reference-stories`

---

## Cutting a new experiment branch

Cut `reference-stories_N` from `reference-stories`. First commit on the branch:

1. Create `agent/review-iteration-N.md` with the stub below.
2. No other files need stubbing — taxonomy files from prior iterations are read-only inputs, not contamination risks.

**`agent/review-iteration-N.md` stub:**

```markdown
---
title: Review — Iteration N
status: in-progress
---

# Review — Iteration N

## Components
Button, ListBox, Select (adjust per iteration)

## Phase 1 — Taxonomy decisions
*(agent fills in after taxonomy formation)*

## Phase 2 — Implementation notes
*(agent fills in after story implementation)*

## User review
*(user fills in during debrief)*

## Principles extracted
*(filled in during debrief — these go into `agent/reference-stories-skill.md`)*

## Skill update status
- [ ] `agent/reference-stories-skill.md` updated
- [ ] Finalized taxonomy files merged to `reference-stories`
- [ ] Finalized story files merged to `reference-stories`
- [ ] `CLAUDE.md` iteration counter incremented
```

Commit message: `chore: stub review-iteration-N for experiment branch`

---

## Inputs (available on all experiment branches)

Load these at session start:

1. **`agent/reference-stories-skill.md`** — current taxonomy and story construction principles; treat as the primary methodology reference
2. **`agent/mapping-table.md`** — authoritative Bootstrap ↔ React Aria sub-part mappings; use to identify which sub-parts exist and their Bootstrap counterparts
3. **`agent/bootstrap-kb/`** — Bootstrap reference; navigate via `README.md`, load files selectively per component
4. **`agent/reference-stories/`** — completed taxonomy files from prior iterations (read-only reference)

---

## Phase 1 — Taxonomy formation

For each component in the iteration:

1. Identify sub-parts from `agent/mapping-table.md`.
2. For each substantive sub-part, determine:
   - States and variants that are meaningful as labeled specimens
   - States to omit (no Bootstrap counterpart, visually identical to another specimen, or out of scope)
   - Canvas layout: grid column count, width constraint, whether all specimens fit at ~1280px
   - Whether sub-parts should be merged into one story or kept separate
3. Write taxonomy to `agent/reference-stories/componentname-taxonomy.md`.
4. **Pause for user review before proceeding to Phase 2.**

See `agent/reference-stories-skill.md` for current taxonomy formation principles.

Document all non-obvious decisions in the `## Phase 1 — Taxonomy decisions` section of `agent/review-iteration-N.md` as you go.

---

## Phase 2 — Story implementation

For each approved taxonomy, implement reference stories.

### File locations

- Story files: `stories/bootstrap-test/bootstrap-reference/ComponentName.reference.stories.tsx`
- Title pattern: `Bootstrap Reference/ComponentName/SubPartName` (creates nested Storybook tree)
- Custom CSS augmentations: `stories/bootstrap-test/bootstrap-reference/augments.scss`

The `main.js` glob (`stories/bootstrap-test/**/*.stories.*`) already covers this subdirectory.

### Construction rules

1. **HTML from Bootstrap docs** — fetch the relevant Bootstrap docs page; copy example markup verbatim. Adapt to JSX syntax only (`class` → `className`, `for` → `htmlFor`, `checked` → `defaultChecked`). Do not paraphrase or restructure.
2. **Bootstrap CSS only** — no React Aria components, no project CSS. These are pure Bootstrap reference specimens.
3. **Augment minimally** — where Bootstrap has no counterpart (e.g., ListBox `layout="grid"`), add the minimum custom CSS to `augments.scss`. Import it in the story file with `import './augments.scss'`.
4. **Labeled specimens** — each specimen has a short text label above it identifying the state/variant shown (e.g., "Selected", "Disabled + focused").
5. **Single viewport** — all specimens in a story must be visible at ~1280px width. Use a CSS grid wrapper div in the story render function; column count specified in the taxonomy.
6. **Source attribution** — each story's `parameters.docs.description.story` cites the Bootstrap docs URL the markup was sourced from.

See `agent/reference-stories-skill.md` for current story construction principles.

Document all non-obvious decisions in the `## Phase 2 — Implementation notes` section of `agent/review-iteration-N.md` as you go.

---

## Debrief

User reviews the implemented stories in Storybook and provides observations.

**Write each observation to `agent/review-iteration-N.md` immediately — before replying to the user.** Do not batch, do not defer. If the user gives multiple observations in one message, write all of them before replying.

Both taxonomy decisions and story quality are in scope for debrief.

---

## After debrief

1. Update `agent/reference-stories-skill.md`:
   - Add new principles extracted from debrief
   - Refine existing principles
   - Mark resolved open questions
2. Tick off the Skill Update Status checklist in `agent/review-iteration-N.md`.
3. Merge finalized files to `reference-stories` integration branch (file-by-file checkout, not cherry-pick):
   ```sh
   git checkout reference-stories_N -- agent/reference-stories-skill.md
   git checkout reference-stories_N -- agent/review-iteration-N.md
   git checkout reference-stories_N -- agent/reference-stories/componentname-taxonomy.md
   git checkout reference-stories_N -- stories/bootstrap-test/bootstrap-reference/ComponentName.reference.stories.tsx
   # stage and commit on reference-stories
   ```
4. Update `CLAUDE.md` on `reference-stories`: increment iteration counter, add 1-line note.
5. Commit.

---

## Updating reference-stories from an experiment branch

Never use `git cherry-pick`. Cherry-picked commits may bundle multiple files. Use file-specific checkout as shown above.

Taxonomy files and story files accumulate on the integration branch as they are finalized. The skill doc (`reference-stories-skill.md`) is always wholesale-checked-out from the latest experiment branch.
