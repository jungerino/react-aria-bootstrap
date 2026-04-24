---
title: Iteration Protocol
---

# Iteration Protocol

This document describes the prescribed workflow for each Bootstrap styling iteration.

## Before starting

1. Confirm which branch this is:
   - **Experiment branch** (`bootstrap-iteration_N`): read `agent/react-aria-skill.md` + `CLAUDE.md`. Do NOT consult `agent/component-decisions.md`.
   - **Project branch** (`styled-components`): read `agent/react-aria-skill.md` + `agent/component-decisions.md` + `CLAUDE.md`.

2. Read `agent/react-aria-skill.md` carefully. Understand current principles and the self-review checklist.

3. Start Storybook (`yarn storybook`) and confirm the `Bootstrap Test` story group is visible.

## Iteration steps

1. For each of the 7 test components (Button, TextField, Checkbox, Select, Tabs, Calendar, ListBox):
   - Open `src/bootstrap-test/ComponentName.tsx` and its CSS file
   - Apply Bootstrap classes and bridge selectors following `react-aria-skill.md`
   - Comment out conflicting project CSS rules (do not delete)
   - Log any unmapped states

2. Run self-review against the checklist in `react-aria-skill.md`.

3. Write the iteration summary (see Output Format below).

## Output Format

After styling all 7 components, produce a summary with these sections:

### Decisions made
For each component: what Bootstrap classes/patterns were applied and why.

### Uncertainties
Places where you were unsure which approach was correct. Flag these for user review.

### Unmapped states
Components or interaction states where no Bootstrap equivalent was found. List alternatives considered.

### Proposed skill updates
Rules you believe should be added to or changed in `react-aria-skill.md`.

## After user review (debrief)

1. Update `agent/react-aria-skill.md`:
   - Add new principles
   - Refine existing rules
   - Update the self-review checklist
   - Add confirmed patterns to the Pattern Library
   - Clear resolved unmapped items

2. If any principle is clearly not React Aria-specific → add to `agent/bootstrap-skill.md`.

3. Update `CLAUDE.md`: increment iteration number, add 1-line note about what changed.

4. Commit.
