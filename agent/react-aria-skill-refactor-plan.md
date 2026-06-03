# Plan: Restructure react-aria-skill for multi-agent discipline

## Context

`agent/react-aria-skill.md` is a 758-line monolithic instruction document for a multi-agent Bootstrap-styling workflow. Three agent tiers are meant to work hierarchically: a primary orchestrator dispatches component sub-agents, which dispatch comparison sub-sub-agents. In practice, agents at each tier perform work intended for the tier below, defeating the context-isolation purpose of the hierarchy.

Root cause analysis draws on the Anthropic skill authoring best practices and a separate conversation about task completion bias. The restructuring addresses both structural and behavioral failure modes.

## Root Cause Analysis

### 1. Monolithic file gives every agent execution context for every tier

When the primary agent reads the skill at session start, it gets the full pixel diff protocol, CSS rework procedure, findings doc format, and sub-sub-agent instructions — everything it needs to rationalize "I already have this in context, I'll just do it myself." The task completion drive (trained overwhelmingly on completion, not deferral) reliably wins against an instruction-based "don't do this."

**Fix:** Per-tier files loaded selectively. The primary agent reads `orchestrator.md` and never sees `comparison-agent.md` or `principles.md`. It literally lacks the execution knowledge to rationalize crossing the boundary.

### 2. Role contracts are prohibition-based, not success-condition-based

"You must not run pixel diffs" (prohibition) loses to the completion drive. "Your task is complete when and only when you have dispatched a component agent and received a terminal phrase" (success condition) redefines what the model considers "done." Delegation becomes the task.

**Fix:** Each tier file opens with a one-sentence role contract framed as a success condition.

### 3. No planning gate before execution

The orchestrator is free to start executing immediately. A required planning step — emit a delegation manifest listing each component and its assigned agent — forces the reasoning layer (which understands the rules) to make delegation decisions explicit and visible before the completion drive engages.

**Fix:** Orchestrator's first required action is emitting a structured delegation manifest. Execution cannot begin until the manifest is emitted.

### 4. File length exceeds best-practice ceiling

At 758 lines, the file is 50% over Anthropic's <500-line recommendation. Excess length amplifies the problem: more execution detail in context = stronger completion pull.

**Fix:** Restructure into a skill directory; SKILL.md entry point stays under 150 lines.

---

## Target Structure

```
agent/react-aria-skill/
  SKILL.md                  # Entry point: tier map, session start, escalation protocol (~120 lines)
  workflow.md               # Branch lifecycle: phases 1-3, debrief, merge (~110 lines)
  orchestrator.md           # Primary agent: job contract, planning gate, loop (~90 lines)
  component-agent.md        # Component sub-agent: job contract, pipeline, cycling loop (~130 lines)
  comparison-agent.md       # Comparison sub-sub-agent: diff protocol, output (~80 lines)
  final-stories-agent.md    # Final stories sub-agent: contract, inputs (~60 lines)
  principles.md             # P001-P049 reference with table of contents (~220 lines)
```

Total target: ~810 lines across 7 files vs. 758 in one. The gain is selective loading, not line count.

---

## File-by-File Changes

### SKILL.md (entry point)

Content:
- One-sentence role statement per tier
- Session-start loading instructions: which files each tier loads (tier-specific, not global)
- Escalation protocol: valid terminal phrases and what to do with unexpected returns
- Branch naming convention
- Link to `workflow.md` for branch lifecycle
- Explicit: "This file is the only file loaded into the primary agent's context at session start, in addition to `orchestrator.md`."

**Does NOT contain:** any execution details (no CSS, no pixel diff commands, no findings doc formats)

### workflow.md

Content moved from current SKILL.md:
- Phase 1: branch scaffolding (cut branch, create review stub, stub target files, Storybook restart)
- Phase 2: per-component work sequence (single-agent path; points to `component-agent.md` for multi-agent path)
- Phase 3: debrief protocol
- After debrief: merge steps, skill update checklist
- Visual comparison workflow (single-agent fix loop, currently at end of SKILL.md)
- Self-review checklist

### orchestrator.md

**Opens with:**
```
Role contract: Your task is complete when every component in the batch has reported
`final-stories-done` and you have compiled and delivered the batch report.
Your task is NOT complete when the styling work is done — that is the component agent's job.
```

Content:
- Required planning step: before launching any agent, emit a delegation manifest:
  ```
  | Component | Status  |
  |-----------|---------|
  | Select    | pending |
  | ListBox   | pending |
  ```
  Execution cannot begin until this manifest is emitted.
- Loop structure (dispatch → wait for terminal phrase → surface or proceed)
- Terminal phrase handling
- Negative/positive example pair (short): shows agent incorrectly reading a taxonomy file (wrong), then correctly emitting a delegation call (right)
- Explicit boundary statement: "You do not read taxonomy files, write CSS, run pixel diffs, or implement stories. You do not load `component-agent.md`, `comparison-agent.md`, or `principles.md`."

### component-agent.md

**Opens with:**
```
Role contract: Your task is complete when all stories for your component reach Pass
on the final verification sweep and you report `verification-sweep-passed` to the primary agent.
Your task is NOT complete when a story passes — that is an intermediate milestone.
You do not run pixel diffs. You dispatch comparison agents and act on their findings.
```

Content:
- Inputs to load at session start (taxonomy, Bootstrap KB index selectively, principles.md)
- Story-level pipeline (implement CSS → extract CSS → create findings doc → dispatch comparison agent in background → proceed to next story)
- Cycling loop (notification-driven; ScheduleWakeup watchdog)
- Findings doc formats: per-story and component-wide
- CSS change scope rules (shared selector → reset affected stories → relaunch)
- Configurable knobs table

### comparison-agent.md

**Opens with:**
```
Role contract: Your task is complete when you have written findings to the story findings doc
and exited. You do not cycle. You do not rework CSS. You report findings and stop.
```

Content:
- Inputs (mirror story URL, reference URL, findings doc path, taxonomy, mirror stories TSX, overrides file, matched CSS)
- Pixel diff command
- Pass/fail threshold (0.5%)
- Image analysis protocol (read all three images via Read tool; missing file = script failure, stop)
- Findings doc output format (Iteration N block)
- Animation exception (all four conditions must hold)
- Context compression exit procedure

### final-stories-agent.md

**Opens with:**
```
Role contract: Your task is complete when standard and mirror stories are written
and you report `final-stories-done` to the primary agent.
```

Content:
- Inputs (taxonomy, component-wide findings doc, story instructions via Storybook MCP)
- Stories to implement (standard + mirror)
- Stories conventions key points (or pointer to principles.md P029-P044 section)

### principles.md

Content: All current principles P001-P049, **unchanged in substance**.

Additions:
- Table of contents at top (required per Anthropic guidance for files >100 lines)
- Loaded by component agents at session start; not loaded by orchestrator, comparison, or final-stories agents

---

## CLAUDE.md Update

One line change in the session start instructions:

**Before:**
```
1. `agent/react-aria-skill.md` — this document; the single source of truth for workflow and principles
```

**After:**
```
1. `agent/react-aria-skill/SKILL.md` — entry point; follow its session-start loading instructions for this tier
```

---

## What Does NOT Change

- Substance of all principles P001-P049
- Terminal phrase protocol (`verification-sweep-passed`, `Stuck: {story}`, `Timeout: {story}`, `Context exhausted`)
- Cycling loop logic
- Findings doc formats
- Pixel diff threshold (0.5%)
- Configurable knobs table
- Branch naming convention

---

## Verification

After restructuring:
1. Read `orchestrator.md` in isolation and confirm it contains no execution details (no CSS selectors, no pixel diff commands, no taxonomy reading steps, no story formats)
2. Read `comparison-agent.md` in isolation and confirm it contains no cycling logic and no CSS rework steps
3. Confirm each file is within its target line count; SKILL.md entry point stays under 150 lines
4. Confirm CLAUDE.md session start instruction points to new location
5. Dry-run check: starting from `orchestrator.md` alone, could a reasonable agent rationalize running a pixel diff? If yes, revise until the answer is no.

---

## Iteration Protocol Refactor

`agent/iteration-protocol.md` is updated as part of this same branch. The protocol governs the experiment workflow across all experiments (not just react-aria-skill), so it stays as a standalone project document — it is not folded into the skill.

### Change 1: Generalize branch name references

Replace all hardcoded experiment names with placeholders so the protocol applies to any experiment:

- `sub-agent-styling` → `{integration-branch}`
- `sub-agent-styling_N` → `{iteration-branch}` (i.e. `{integration-branch}_N`)
- Specific file paths that reference experiment names get the same treatment

Remove the "Sub-Agent Styling Experiment" heading as a named section. The document becomes a single generic protocol; per-experiment configuration belongs in each experiment's skill doc and CLAUDE.md, not in the iteration protocol itself.

### Change 2: Correct the merge workflow — knowledge files only by default

The current protocol merges both knowledge files and component work (styles, components, stories) to the integration branch. This is wrong: iteration branches produce component work to assess skill effectiveness, not as a production deliverable. The component work stays on the iteration branch.

**Knowledge files (merge by default):**
- `agent/{skill-directory}/` — all files in the skill dir (updated for new structure)
- `agent/review-iteration-N.md` — iteration review notes
- `CLAUDE.md` — if updated during the iteration

**Component work (does NOT merge by default):**
- `src/scss/_bootstrap-overrides.scss`
- `src/bootstrap-test/{ComponentName}.tsx`
- `stories/bootstrap-test/{ComponentName}/`

### Change 3: Add a component-work merge decision point

At the end of the after-debrief workflow, insert an explicit decision step before the agent executes any merges:

```markdown
**Component work merge decision**
- [ ] No (default) — knowledge files only; component work stays on {iteration-branch}
- [ ] Yes — also merge component work for: {list components / files}
```

The user fills in this checkbox in the iteration review doc. The agent reads it before executing the merge and acts accordingly. As component work quality improves and merges become the norm, the default can be flipped in a future protocol revision.

### Change 4: Update skill path references

After the skill is restructured from a single file to a directory, the merge command changes. Current protocol:

```bash
git checkout {iteration-branch} -- agent/react-aria-skill.md
```

New protocol — enumerate the individual files:

```bash
git checkout {iteration-branch} -- agent/react-aria-skill/SKILL.md
git checkout {iteration-branch} -- agent/react-aria-skill/workflow.md
git checkout {iteration-branch} -- agent/react-aria-skill/orchestrator.md
git checkout {iteration-branch} -- agent/react-aria-skill/component-agent.md
git checkout {iteration-branch} -- agent/react-aria-skill/comparison-agent.md
git checkout {iteration-branch} -- agent/react-aria-skill/final-stories-agent.md
git checkout {iteration-branch} -- agent/react-aria-skill/principles.md
```

(Adjust if any files are added or removed during the skill restructure.)

### Change 5: Separate generic structure from experiment specifics

Restructure the document sections:

1. **Purpose and scope** — brief intro: this protocol governs the cut/iterate/debrief/merge lifecycle for all iterative experiments; in-iteration workflow details live in each experiment's skill doc
2. **Cutting a new iteration branch** — generic (placeholders)
3. **In-iteration workflow** — one line: see the experiment's skill doc
4. **After debrief — merge to integration branch** — generic, with the component-work decision point

No per-experiment named sections.
