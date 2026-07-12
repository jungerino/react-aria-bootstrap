---
title: Iteration Protocol
---

# Iteration Protocol

## Purpose and scope

This protocol governs the cut → iterate → debrief → merge lifecycle for iterative stages (Stages 4 and 5) across all component batches. Stages 1 and 2 are one-time project setup; Stage 3 runs once per batch.

---

## Branch naming

- **Integration branch:** `integration-batch-{N}`
- **Iteration branch:** `batch-{N}/stage-{M}/iter-{P}` — the iteration counter resets per stage.

---

## Cutting an iteration branch

Cut `batch-{N}/stage-{M}/iter-{P}` from `integration-batch-{N}`.

**Stub question:** Ask the user: **"Are there any files that should be stubbed before work begins?"**
- If yes: create stubs in a separate commit; commit message: `chore: stub files for batch-{N}/stage-{M}/iter-{P}`
- If no: proceed directly to iteration work

**Batch log stub (ask explicitly):** Ask the user: **"Should the batch log be stubbed?"**

- **Stub** (default while skills are still being refined): Reset the log to the structural template (see Batch log stub template below). The agent works from skills alone, unconstrained by prior iteration findings.
- **Carry forward** (once skills are mature): Leave the log as-is. The agent can see accumulated findings from prior iterations.

If stubbing, include the stub in the same commit as other stubbed files (`chore: stub files for ...`), or as its own commit if the batch log is the only file being stubbed.

**Blank-slate question (ask explicitly):** Ask the user: **"Should sub-agents be barred from consulting git history or deleted content this iteration (a blank-slate test of the skill's principles), or is reusing prior resolved context acceptable?"**

- **Bar** (blank-slate test): Sub-agent dispatch prompts must set blank-slate mode ON — see the stage's skill doc (e.g. `mapping-and-references-skill/component-agent.md`'s "Blank-Slate Mode" section) for the exact boundary and the orchestrator's compliance-audit step. Enforcement is a prompt-level instruction plus an after-the-fact audit, not a `.claude/settings.json` permission block — a settings.json deny rule applies to the whole project session, including the orchestrator's own git usage, not just the sub-agent's.
- **Allow** (default for production iterations): No restriction — sub-agents may consult prior iterations' history and resolved decisions for consistency.

**File hygiene scan:** Before the stage's orchestrator dispatches any sub-agent, it scans for pre-existing artifacts belonging to the batch's components that the stub step didn't address, and surfaces them for an explicit keep/delete decision — see the stage's skill doc for the scan's file list. This exists because stub decisions made from memory at cut time miss files that don't come to mind.

See the stage's skill doc for in-iteration implementation specifics.

---

## Debrief

The user reviews output and provides observations. Record each observation immediately as it is given — before replying — do not batch or defer.

---

## After debrief

### Successful iteration

1. Record the outcome in the batch log under the current iteration's sub-heading (see Batch log below).
2. Update skill docs and knowledge files if the process changed.
3. **Component work gate:** Ask the user: **"Is this component's implementation ready to move on, or should we do another iteration?"** If another iteration is requested, cut a new iteration branch (back to "Cutting an iteration branch" above).
4. Ask the user: **"Which files from this iteration should be merged to `integration-batch-{N}`?"**
5. Merge confirmed files via file-by-file checkout, then commit.
6. **Merge the batch log additively:** Do not checkout the batch log file — this would overwrite the integration branch's cumulative history. Instead, copy the current iteration's sub-heading and its content from the iteration branch log, then append it under the correct stage section of the integration branch log. Commit with message: `chore: sync batch log from batch-{N}/stage-{M}/iter-{P}`

### Failed iteration

1. Record what was attempted and why it failed in the batch log under the current iteration's sub-heading.
2. Update skill docs and knowledge files with learnings from the failure.
3. Cut a new iteration branch (back to "Cutting an iteration branch" above).

---

## Batch log

Each batch has a log at `agent/logs/batch-{N}.md`.

The **integration branch** log is cumulative — every iteration's findings accumulate under their own sub-heading in chronological order. The **iteration branch** log contains only the structural template plus the current iteration's sub-heading.

### Sub-heading format

Within each stage section, each iteration gets its own sub-heading:

```
### batch-{N}/stage-{M}/iter-{P}
```

The outcome summary and all component findings (decisions, taxonomy notes, principles used) are written under this heading. There is no separate summary entry — the sub-heading is the entry.

### Batch log stub template

When stubbing the batch log on a new iteration branch, reset it to this template (replace `{N}`, `{P}`, and component names with actual values):

```markdown
# Batch {N}

## Components

- {ComponentA}
- {ComponentB}

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

## Stage 4

### batch-{N}/stage-4/iter-{P}

*(In progress)*

## Stage 5

*(Populated during Stage 5)*
```

The `*(In progress)*` placeholder marks where the orchestrator writes findings during the iteration.

### Integration branch log structure

The integration branch log accumulates all iterations' sub-headings in chronological order within each stage section:

```markdown
## Stage 4

### batch-{N}/stage-4/iter-1
[iter-1 content]

### batch-{N}/stage-4/iter-2
[iter-2 content]

### batch-{N}/stage-4/iter-3
[iter-3 content]
```
