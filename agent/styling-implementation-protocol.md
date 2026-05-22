---
title: Iteration Protocol — Styling Implementation
status: draft
---

# Iteration Protocol — Styling Implementation

This document describes the workflow for each `styling-implementation` experiment iteration.

## Overview

Goal: Implement Bootstrap-styled React Aria components that match the visual targets in the Bootstrap reference stories, verified via visual regression (Loki or Playwright fallback).

Each iteration works through a fixed component set in three phases:
- **Phase 0 (one-time setup):** Install and configure the visual regression tool; capture baseline screenshots of the reference stories.
- **Phase 1 — Scaffolding:** Cut experiment branch, stub files, verify baselines.
- **Phase 2 — Per-component implementation:** Read taxonomy → implement TSX + CSS → write stories → run visual comparison → fix deltas. Pause for user review after each component.
- **Phase 3 — Debrief and close-out:** User reviews in Storybook, agent extracts principles, files merged to integration branch.

---

## Branch naming

- `styling-implementation` — integration branch (cut from `mapping-and-references`; includes reference stories and taxonomies)
- `styling-implementation_0`, `styling-implementation_1`, … — experiment branches

---

## Phase 0 — One-time Setup (run once before iteration 0)

### Step 0a: Verify Loki compatibility with Storybook 9

Loki's published adapter targets Storybook 6–8. Storybook 9 (in use here) may require verification.

```bash
yarn info loki peerDependencies
```

If Loki's peer dependency range excludes Storybook 9:
- Fall back to Playwright + `pixelmatch` for pixel diffing.
- Substitute all "Loki" references in this protocol with the Playwright equivalents.

Attempt install and smoke test:
```bash
yarn add --dev loki
yarn loki --help
```

**Playwright fallback (if Loki incompatible):**
```bash
yarn add --dev @playwright/test pixelmatch pngjs
npx playwright install chromium
```

### Step 0b: Configure the visual regression tool

**Loki config** — add to `package.json`:
```json
"loki": {
  "configurations": {
    "chrome.laptop": {
      "target": "chrome.app",
      "width": 1280,
      "height": 900
    }
  }
}
```

Add scripts to `package.json`:
```json
"loki:update": "loki update",
"loki:test": "loki test",
"loki:compare": "loki test"
```

**Playwright fallback:** Create `scripts/compare-stories.js` — see plan file for full script. Add `"compare-stories": "node scripts/compare-stories.js"` to package.json scripts.

### Step 0c: Capture reference story baselines

With Storybook running (`yarn storybook`):

```bash
yarn loki:update --filter "Bootstrap Reference"
# OR Playwright: capture each reference story via compare-stories.js
```

Commit the screenshots:
```bash
git add .loki/reference/
git commit -m "chore: capture Loki baselines from bootstrap reference stories"
```

**Baseline update policy:** Baselines are updated only when reference stories change (intentional visual target change). Never update baselines as a workaround for failing tests.

### Step 0d: Update `react-aria-skill.md` — visual regression section

Replace the manual "Visual Comparison Workflow" section in `agent/react-aria-skill.md` with the "Visual Regression Workflow" section described in the plan. See Open Questions below for diff classification rules — those are deferred to iteration 0 debrief.

---

## Inputs — load at session start

1. `agent/styling-implementation-protocol.md` — this document
2. `agent/react-aria-skill.md` — all principles (P001+); primary styling reference; treat as authoritative
3. `agent/component-decisions.md` — resolved decisions; implementation must honor every entry for components in scope
4. `agent/reference-stories/{component}-taxonomy.md` — for each component in this iteration
5. `agent/bootstrap-kb/` — Bootstrap reference; load via `README.md` then selectively per component

---

## Cutting a new experiment branch

Cut `styling-implementation_N` from `styling-implementation`. First commits:

### 1. Create review stub

Create `agent/review-styling-iteration-N.md`:

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
- [ ] Finalized component files merged to `styling-implementation`
- [ ] `CLAUDE.md` iteration counter incremented (if applicable)
```

### 2. Stub target files for each component

For each component in the iteration:
- `src/{ComponentName}/{ComponentName}.tsx` — bare React Aria component with no className additions yet
- `src/{ComponentName}/{ComponentName}.css` — empty file
- `stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx` — minimal shell:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Bootstrap Test/{ComponentName}',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

// Stories to be implemented in Phase 2
```

Commit message: `chore: stub files for styling-implementation_N ({Component1}, {Component2})`

### 3. Verify baselines

Confirm that `.loki/reference/` (or Playwright baselines) already exist for each reference story in scope. If not, run Phase 0c before proceeding.

---

## Phase 2 — Per-component work sequence

Repeat for each component. **Pause for user review after each component** — do not proceed without sign-off.

### 2a. Read and internalize inputs

1. Read `agent/reference-stories/{component}-taxonomy.md` in full.
2. Read `agent/component-decisions.md` entry for this component.
3. Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
4. Load Bootstrap KB: `components.md` entry for the matched Bootstrap component → `states.md` → `patterns.md` if a DOM conflict entry exists.

### 2b. Implement TSX

- Apply `className` render-prop pattern (P002) for Bootstrap classes.
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing the variant set (P007 requirement).
- Honor all entries in `component-decisions.md` for this component; these are pre-resolved — do not re-derive them.
- Apply Bootstrap component classes (P013); reserve utility classes for genuine one-off cases.

### 2c. Implement CSS bridge

- Write bridge selectors in `src/{ComponentName}/{ComponentName}.css`.
- Write SCSS-mixins-gated properties (P015) in `src/scss/_bootstrap-overrides.scss`.
- Cover all states listed in the taxonomy's state mappings.
- Follow data-* bridge rules (bridge only when no native pseudo-class fires).

### 2d. Write Storybook stories

Minimum story set per component:
- Default (at-rest)
- Variants (if component has a `variant` prop) — all values side by side (P030, P032)
- Disabled, Invalid, WithDescription where applicable (P031)

Follow `get-storybook-story-instructions` conventions. Use `argTypes` with explicit `options` for all string-union props (P029).

### 2e. Visual regression — compare against reference

Run the comparison for this component (see "Visual Regression Workflow" in `agent/react-aria-skill.md`):

```bash
yarn loki:compare --filter {component-name}
# OR Playwright fallback:
node scripts/compare-stories.js \
  --reference bootstrap-reference-{component}--{story-name} \
  --implementation bootstrap-test-{component}--{story-name}
```

Fix all fixable deltas before presenting to the user. Flag design decisions and intentional deviations.

### 2f. Document in review file

Add an entry to `agent/review-styling-iteration-N.md` under "Phase 2 — Implementation notes":
- Sub-parts implemented and bridge strategies used
- Visual comparison results: resolved deltas, open design decisions, intentional deviations
- Candidate principles for `react-aria-skill.md`

---

## Phase 3 — Debrief

User reviews styled components in Storybook. Provides observations.

**Write each observation to `agent/review-styling-iteration-N.md` immediately — before replying.** Do not batch, do not defer. Multiple observations in one message → write all before replying.

Both implementation quality and visual comparison methodology are in scope.

---

## After debrief

1. Update `agent/react-aria-skill.md`:
   - Add new principles extracted from debrief (numbered sequentially after current highest)
   - Refine or correct existing principles
   - Update the "Visual Regression Workflow" section if the comparison workflow changed
2. Tick off the Skill Update Status checklist in the review file.
3. Merge finalized files to `styling-implementation` integration branch (file-by-file checkout, not cherry-pick):
   ```bash
   git checkout styling-implementation_N -- agent/react-aria-skill.md
   git checkout styling-implementation_N -- agent/review-styling-iteration-N.md
   git checkout styling-implementation_N -- src/{ComponentName}/{ComponentName}.tsx
   git checkout styling-implementation_N -- src/{ComponentName}/{ComponentName}.css
   git checkout styling-implementation_N -- stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx
   ```
   Commit to `styling-implementation`: `feat: merge iteration N styled components ({Component1}, {Component2})`

---

## Open questions (to resolve before or during iteration 0)

1. **Loki/Storybook 9 compatibility** — must be verified in Phase 0a before any baseline capture. If incompatible, Playwright fallback applies throughout.

2. **Diff classification rules** — intentionally deferred to iteration 0 debrief. After debrief, codify as principles in `react-aria-skill.md` (P044+). Current policy: if in doubt, fix it and re-run. Do not present fixable deltas to the user.

3. **Styled component story location** — protocol currently assumes `stories/bootstrap-test/{ComponentName}/` (separate from pre-existing story files). Confirm this doesn't collide with any existing story structure before iteration 0.

4. **Iteration 0 component set** — Button (simple) + Select (complex), per user input. Confirm before cutting the experiment branch.
