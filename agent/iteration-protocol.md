---
title: Iteration Protocol
---

# Iteration Protocol

## Purpose and scope

This protocol governs the cut → iterate → debrief → merge lifecycle for all iterative experiments in this project. In-iteration workflow details live in each experiment's skill doc. Per-experiment configuration (branch name, component set, skill doc path) belongs in the experiment's skill doc and `CLAUDE.md`, not here.

---

## Cutting a new iteration branch

Cut `{iteration-branch}` (i.e. `{integration-branch}_N`) from `{integration-branch}`. Two first commits:

**Commit 1 — Review stub:** Create `agent/review-iteration-N.md`:

```markdown
---
title: Review — Iteration N
status: in-progress
---

# Review — Iteration N

## Components
(list the component set for this iteration)

## Phase 1 — Scaffolding notes
*(agent fills in)*

## Phase 2 — Implementation notes
*(one entry per component, added after each component is reviewed)*

## User review
*(user fills in during debrief)*

## Principles extracted
*(filled in during debrief)*

## Skill update status
- [ ] Skill knowledge files updated
- [ ] Finalized component files merged to `{integration-branch}` (if approved)
- [ ] `CLAUDE.md` iteration counter incremented (if applicable)
```

Commit message: `chore: stub review-iteration-N`

**Commit 2 — Component stubs:** For each component in the iteration's test set, create stub files and add story globs per the experiment's skill doc (Phase 1 details live there).

Commit message: `chore: stub files for {iteration-branch} ({Component1}, {Component2})`

After committing stubs, restart Storybook (`lsof -ti tcp:6006 | xargs kill -9 && yarn storybook &`) and wait for the new instance to serve the stub story IDs.

---

## In-iteration workflow

See the experiment's skill doc — Phase 2 (implementation), Phase 3 (debrief), and any batch workflow details all live there.

---

## After debrief — Merge to integration branch

### Step 1 — Record observations and update knowledge files

Write every debrief observation to `agent/review-iteration-N.md` before proceeding. Do not batch or defer. As part of the same step, update the skill knowledge files: add new principles extracted from observations, refine existing ones, and update workflow or agent files if the process changed.

### Step 2 — Ask about component work

Before executing any merge, ask the user:

> "Should component work (styles, components, stories) be merged to `{integration-branch}`, in addition to knowledge files? If yes, which components?"

Record the user's answer in `agent/review-iteration-N.md` under "User review", then proceed.

### Step 3 — Merge knowledge files (always)

Merge knowledge files to `{integration-branch}` (file-by-file checkout, not cherry-pick):

```bash
git checkout {iteration-branch} -- agent/react-aria-skill/SKILL.md
git checkout {iteration-branch} -- agent/react-aria-skill/workflow.md
git checkout {iteration-branch} -- agent/react-aria-skill/orchestrator.md
git checkout {iteration-branch} -- agent/react-aria-skill/component-agent.md
git checkout {iteration-branch} -- agent/react-aria-skill/comparison-agent.md
git checkout {iteration-branch} -- agent/react-aria-skill/final-stories-agent.md
git checkout {iteration-branch} -- agent/react-aria-skill/principles.md
git checkout {iteration-branch} -- agent/review-iteration-N.md
```

If `CLAUDE.md` was updated during the iteration, add it to the checkout list.

Commit: `feat: merge iteration N knowledge files`

### Step 4 — Merge component work (only if approved in Step 2)

If the user approved merging component work, check out the approved components:

```bash
git checkout {iteration-branch} -- src/scss/_bootstrap-overrides.scss
git checkout {iteration-branch} -- src/bootstrap-test/{ComponentName}.tsx
git checkout {iteration-branch} -- stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx
git checkout {iteration-branch} -- stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx
```

Commit: `feat: merge iteration N styled components ({Component1}, {Component2})`

**Default: component work does NOT merge.** Iteration branches produce component work to assess skill effectiveness. The components stay on the iteration branch unless explicitly approved.
