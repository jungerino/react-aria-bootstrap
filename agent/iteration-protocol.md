---
title: Iteration Protocol
---

# Iteration Protocol

This document describes how to start and close out iterations for each ongoing experiment. In-iteration workflow details live in the experiment's skill doc.

---

# Sub-Agent Styling Experiment

Experiment goal: Develop and validate a multi-agent workflow that produces Bootstrap-styled React Aria components verified via pixel diff against Bootstrap reference stories. Workflow and principles accumulate in `agent/react-aria-skill.md`.

## Branch naming

- `sub-agent-styling` — integration branch; holds approved styled components, finalized mirror stories, and the growing skill doc
- `sub-agent-styling_0`, `sub-agent-styling_1`, … — experiment branches; cut from `sub-agent-styling`

## Cutting a new experiment branch

Cut `sub-agent-styling_N` from `sub-agent-styling`. Two first commits:

**Commit 1 — Review stub:** Create `agent/review-styling-iteration-N.md`:

```markdown
---
title: Review — Styling Iteration N
status: in-progress
---

# Review — Styling Iteration N

## Components
(list the component set for this iteration)

## Phase 1 — Scaffolding notes
*(agent fills in)*

## Phase 2 — Implementation notes
*(one entry per component, added after each component is reviewed)*

## User review
*(user fills in during debrief)*

## Principles extracted
*(filled in during debrief — go into `agent/react-aria-skill.md`)*

## Skill update status
- [ ] `agent/react-aria-skill.md` updated
- [ ] Finalized component files merged to `sub-agent-styling`
- [ ] `CLAUDE.md` iteration counter incremented (if applicable)
```

Commit message: `chore: stub review-styling-iteration-N`

**Commit 2 — Component stubs:** For each component in the iteration's test set:

- `src/bootstrap-test/{ComponentName}.tsx` — bare React Aria component stub
- `stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx` — standard story stub
- `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx` — mirror story stub
- Add `stories/bootstrap-test/{ComponentName}/**` glob to `.storybook/main.js`

See `agent/react-aria-skill.md` Phase 1 for stub file contents.

Commit message: `chore: stub files for sub-agent-styling_N ({Component1}, {Component2})`

After committing stubs, restart Storybook (`lsof -ti tcp:6006 | xargs kill -9 && yarn storybook &`) and wait for the new instance to serve the stub story IDs before beginning Phase 2.

## In-iteration workflow

See `agent/react-aria-skill.md` — Phase 2 (implementation), Phase 3 (debrief), and Multi-Agent Batch Workflow.

## After debrief — Merge to integration branch

1. Update `agent/react-aria-skill.md`: add new principles, refine existing ones, tick off Skill Update Status checklist.
2. Merge finalized files to `sub-agent-styling` (file-by-file checkout, not cherry-pick):
   ```bash
   git checkout sub-agent-styling_N -- agent/react-aria-skill.md
   git checkout sub-agent-styling_N -- agent/review-styling-iteration-N.md
   git checkout sub-agent-styling_N -- src/scss/_bootstrap-overrides.scss
   git checkout sub-agent-styling_N -- src/bootstrap-test/{ComponentName}.tsx
   git checkout sub-agent-styling_N -- stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx
   git checkout sub-agent-styling_N -- stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx
   ```
   Commit: `feat: merge iteration N styled components ({Component1}, {Component2})`
3. Increment `CLAUDE.md` iteration counter on `sub-agent-styling`.
