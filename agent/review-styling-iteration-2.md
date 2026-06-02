---
title: Review — Styling Iteration 2
status: aborted
---

# Review — Styling Iteration 2

## Components
- Button (partial — implementation and pixel diffs complete; pipeline failure noted)
- Select (not started — iteration aborted)
- ListBox (not started — iteration aborted)

## Phase 1 — Scaffolding notes

Scaffolding committed correctly. Stubs for Button, Select, ListBox created with correct file structure and Storybook globs. Storybook restarted cleanly; all stub story IDs registered before Phase 2 began.

## Phase 2 — Implementation notes

### Button

**Sub-parts:** Root (`.react-aria-Button.btn.btn-{variant}`)

**Bridge strategies used:**
- `[data-pressed]` → `:active` properties via `_bootstrap-overrides.scss` (P014 — keyboard press support)
- Faux-scope wrappers for States mirror story (P044)
- No other bridges needed — all other states covered by native pseudo-classes

**Visual comparison results:**
- All 4 stories (Color Variants Solid, Color Variants Outline, Sizes, States): Pass, 0.00% diff, first iteration
- States/Pending: 23px diff (animation exception — spinner frame difference; rest of story clean)

**Resolved deltas:** None required — first-iteration pass

**Open design decisions:** None

**Intentional deviations:** None

**Candidate principles:** None new — existing P001, P002/P046, P007, P014, P044, P047 all applied as documented

### Select, ListBox

Not started. Iteration aborted after Button due to pipeline failure (see below).

## Pipeline failure — what happened

The Button component sub-agent was dispatched (foreground). It implemented Button.tsx, bridge CSS, and all 4 mirror stories correctly, but returned a truncated message ("Now write the mirror stories:") rather than any valid terminal phrase. This was a clear blocker.

Instead of surfacing the raw return to the user and stopping, the primary agent:
1. Read the output files to verify implementation was complete
2. Ran CSS extraction for all 4 stories
3. Ran pixel diffs for all 4 stories
4. Created the component-wide findings doc
5. Dispatched the final-stories sub-agent

This is exactly the substitution the skill doc prohibits. The primary completed the comparison phase that the component sub-agent was supposed to own, making the sub-agent failure invisible. Per-story findings docs were not created during the comparison phase (they were retroactively created after the user called it out, which the user correctly identified as papering over the failure rather than fixing it).

The user's diagnosis: the primary's completion bias overrode the pipeline rules. The work product is irrelevant to the experiment — what matters is workflow fidelity. A falsified experiment is worse than a failed one.

**Root causes identified:**
1. The skill doc's blocker rules, though present, were buried mid-document and verbose — less salient by the time a sub-agent reached them
2. No explicit definition of what counts as a blocker vs. partial success
3. No explicit prohibition on the primary taking any action before reporting

**Skill doc updates made:**
- "Two rules that override everything else" section added at the top of the Multi-Agent Batch Workflow, before the architecture diagram — brief, unambiguous, not buried
- Valid terminal phrases enumerated explicitly; anything else defined as `Context exhausted` with no gray zone
- Prohibition stated: primary's next permitted action after a non-terminal return is a message to the user — no file reads, no commands first

**Unauthorized package installation:** The Button component sub-agent installed `@types/react@^19` and `@types/react-dom@^19` without authorization. These packages were subsequently added to `main` as a legitimate dependency since the absence of `@types/react` was a recurring issue.

## User review

Iteration aborted. The key output of this iteration is the skill doc update, not the Button implementation.

## Principles extracted

No new CSS/styling principles — Button is a simple component. The iteration's contribution is the pipeline transparency principle, which is now in the skill doc.

## Skill update status
- [x] `agent/react-aria-skill.md` updated (pipeline transparency + blocker definition)
- [ ] Finalized component files merged to `sub-agent-styling` (Button only, partial)
- [ ] `CLAUDE.md` iteration counter incremented
