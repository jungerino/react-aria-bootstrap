---
title: Iteration Protocol
---

# Iteration Protocol

This document describes the prescribed workflow for each Bootstrap styling iteration.

## Cutting a new experiment branch

When cutting `bootstrap-iteration_N` from `main`, the first commit on the branch must stub out the following files:

**1. `agent/component-decisions.md`:**

```markdown
---
title: Component-Specific Decisions (STUB — experiment branch)
---

# Component-Specific Decisions

**This file is intentionally empty on experiment branches.**

Reading this file during an experiment iteration is off-limits — it would contaminate the clean signal the experiment is designed to produce. The real content lives on `main` and `styled-components_N` branches.

**Do not cherry-pick or copy this file to `main`.** When updating `main` with knowledge from this branch, use file-specific checkout (see "Updating main from an experiment branch" below).
```

**2. All `agent/review-iteration-*.md` files from prior iterations** (e.g. `review-iteration-0.md` when cutting `bootstrap-iteration_1`):

```markdown
---
title: Review — Iteration N (STUB — experiment branch)
---

# Review — Iteration N

**This file is intentionally stubbed on experiment branches.**

Reading prior iteration reviews during an experiment pass is off-limits — the findings and component decisions they contain would contaminate the clean signal the experiment is designed to produce. Principles already extracted from this review live in `agent/react-aria-skill.md`.

The real content lives on `main` and `styled-components_N` branches.
```

Commit message: `chore: stub experiment-isolation files for iteration N`

## Updating main from an experiment branch

Never use `git cherry-pick` to move knowledge updates from an experiment branch to `main`. Cherry-picked commits may include the stub file alongside legitimate changes. Instead, reconcile each file explicitly at the end of the iteration:

**Wholesale checkout** — experiment branch version replaces `main`'s version:
```sh
git checkout bootstrap-iteration_N -- agent/react-aria-skill.md agent/iteration-protocol.md agent/review-iteration-N.md
# then stage and commit
```

**Manual merge** — new entries from the stub must be copied into `main`'s existing file; do not overwrite:
- `agent/component-decisions.md`: copy new sections/entries from the stub into `main`'s version by hand.

`git checkout bootstrap-iteration_N -- agent/component-decisions.md` must never be used — it would overwrite `main`'s real content with the stub.

## Round structure

Each iteration round consists of two passes in sequence:

1. **Experiment pass** (`bootstrap-iteration_N`) — principles only; primary source for skill updates
2. **Styled-components pass** (`styled-components_N`) — principles + component decisions; project progress

Complete both passes before starting round N+1. After the experiment debrief, cherry-pick knowledge file updates to `main`, then cut `styled-components_N` from `main`. After the styled-components debrief, cherry-pick any new `component-decisions.md` updates to `main`, then cut `bootstrap-iteration_N+1` from `main`.

## Bootstrap Reference stories

Reference stories provide visual ground truth for self-review. One story file per test component, in `stories/bootstrap-test/`, title `Bootstrap Reference/ComponentName`.

**Construction rules:**
1. **Use Bootstrap's HTML verbatim** — fetch the relevant docs page and copy the example markup directly. Adapt to JSX syntax only (`class` → `className`, `for` → `htmlFor`, `checked` → `defaultChecked`). Do not paraphrase or simplify.
2. **Consult the Bootstrap Counterpart Pairings table** in `react-aria-skill.md` for the approved pattern. Do not choose a different pattern without user approval.
3. **For JS-dependent components** (dropdowns, tabs): show static open/active state by adding the `.show` / `.active` class directly. Note in the file comment that JS is not loaded.
4. **For components with no Bootstrap counterpart** (Calendar): show the intended cell/element treatment using Bootstrap classes. Clearly note the absence of a counterpart.
5. **Add a header comment** to each file: Bootstrap docs URL, chosen pattern, and any deviation from Bootstrap's canonical markup with rationale.

## Pre-iteration-1 setup (one-time)

Perform the following in `main` before cutting `bootstrap-iteration_1`:

1. **Install Bootstrap Icons** — `yarn add bootstrap-icons`. Import `bootstrap-icons/font/bootstrap-icons.css` in the Storybook entry point (`.storybook/preview.js`).
2. **Apply Storybook glob filter** — In `.storybook/main.js`, restrict the `stories` pattern to `stories/bootstrap-test/**` only. This prevents original story CSS from entering the shared bundle and eliminates project CSS leakage into the test environment. Original story files remain in the repo untouched.
3. **Create Bootstrap Reference stories** — For each of the 7 test components, add a companion reference story (`stories/bootstrap-test/ComponentName.reference.stories.tsx`, title: `Bootstrap Reference/ComponentName`) containing native Bootstrap HTML markup with no React Aria. These serve as visual ground truth during self-review. Follow the construction rules in the "Bootstrap Reference stories" section above.

## Before starting

1. Confirm which branch this is:
   - **Experiment branch** (`bootstrap-iteration_N`): read `agent/react-aria-skill.md` + `CLAUDE.md`. Do NOT consult `agent/component-decisions.md`.
   - **Styled-components branch** (`styled-components_N`): read `agent/react-aria-skill.md` + `agent/component-decisions.md` + `CLAUDE.md`.

2. Read `agent/react-aria-skill.md` carefully. Understand current principles and the self-review checklist.

3. Start Storybook (`yarn storybook`) and confirm only the `Bootstrap Test` and `Bootstrap Reference` story groups are visible.

4. **Confirm Chrome browser tools are available.** Use `@browser` to navigate to `http://localhost:6006` and take a screenshot. If the tool responds successfully, visual comparison is enabled for this session. If it fails or returns no tools, stop — do not begin styling until the Chrome MCP issue is resolved. Visual comparison is a required step; skipping it is not an option.

## Iteration steps

1. For each of the 7 test components (Button, TextField, Checkbox, Select, Tabs, Calendar, ListBox):
   - Open `src/bootstrap-test/ComponentName.tsx` and its CSS file
   - Apply Bootstrap classes and bridge selectors following `react-aria-skill.md`
   - Comment out conflicting project CSS rules (do not delete)
   - Log any unmapped states
   - Create or update `stories/bootstrap-test/ComponentName.stories.tsx` following the Stories conventions in `react-aria-skill.md` (argTypes, Variants, LayoutVariants, and state stories as applicable)

2. Run self-review against the checklist in `react-aria-skill.md`. This includes the visual comparison loop for each component: compare the rendered test story against its Bootstrap Reference story using `@browser`, for both default and interaction states. Fix all fixable deltas and re-compare to confirm. Do not deliver until no fixable deltas remain.

3. Create `agent/review-iteration-N.md` (e.g. `review-iteration-0.md`) and populate the **Agent Iteration Summary** section with the output format below.

## Output Format

Populate the Agent Iteration Summary section of `agent/review-iteration-N.md` with:

### Decisions made
For each component: what Bootstrap classes/patterns were applied and why.

### Uncertainties
Places where you were unsure which approach was correct. Flag these for user review.

### Unmapped states
Components or interaction states where no Bootstrap equivalent was found. List alternatives considered.

### Visual comparison
For each component: deltas resolved (what was fixed), open design decisions (judgment calls deferred to user), intentional deviations. Only unresolved items appear here — fixable deltas must be closed before delivery.

## User visual review

The user reviews each component in Storybook and records observations directly in the **User Visual Review** section of `agent/review-iteration-N.md`.

## Debrief

User and agent work through the review observations together. **Write each observation to `agent/review-iteration-N.md` immediately — before replying to the user.** Do not batch, do not defer to end-of-debrief. If the user gives multiple observations in one message, write all of them before replying. Record all decisions in the **Debrief Decisions** section, sorted by destination:

- General principles → `agent/react-aria-skill.md`
- Component-specific decisions → `agent/component-decisions.md`

**On experiment branches, accumulate component decisions in the stub — reconcile at the end.** Rather than switching to `main` after each component decision, record new entries directly in the `agent/component-decisions.md` stub on the experiment branch (below the stub header). At the end of the iteration, manually merge those entries into `main`'s `component-decisions.md` (see "Updating main from an experiment branch" above).

Component-specific decisions discovered during the experiment-branch debrief should be captured in `agent/component-decisions.md` immediately — do not defer to the `styled-components` review. The `styled-components` review may add further decisions, but anything known now should be recorded now.

## After debrief

1. Update `agent/react-aria-skill.md`:
   - Add new principles
   - Refine existing rules
   - Update the self-review checklist
   - Add confirmed patterns to the Pattern Library
   - Clear resolved unmapped items

2. All principles — whether React Aria-specific or Bootstrap-generic — go into `agent/react-aria-skill.md`.

3. Update `agent/component-decisions.md` with any component-specific decisions reached during the debrief.

4. Update `CLAUDE.md`: increment iteration number, add 1-line note about what changed.

5. Tick off the Skill Update Status checklist in `agent/review-iteration-N.md`.

6. Commit.
