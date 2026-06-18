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

Ask the user: **"Are there any files that should be stubbed before work begins?"**
- If yes: create stubs in a separate commit; commit message: `chore: stub files for batch-{N}/stage-{M}/iter-{P}`
- If no: proceed directly to iteration work

See the stage's skill doc for in-iteration implementation specifics.

---

## Debrief

The user reviews output and provides observations. Record each observation immediately as it is given — before replying — do not batch or defer.

---

## After debrief

### Successful iteration

1. Record the outcome in the batch log (see below).
2. Update skill docs and knowledge files if the process changed.
3. Ask the user: **"Which files from this iteration should be merged to `integration-batch-{N}`?"**
4. Merge confirmed files via file-by-file checkout, then commit.
5. Add a success entry to the batch log.

### Failed iteration

1. Record what was attempted and why it failed in the batch log.
2. Update skill docs and knowledge files with learnings from the failure.
3. Cut a new iteration branch (back to "Cutting an iteration branch" above).

---

## Batch log

Each batch has a log at `agent/logs/batch-{N}.md`.

**Entry heading format:** `## Stage {M} / Iteration {P} — {YYYY-MM-DD}`

Every iteration gets an entry — successful and failed alike. Failed entries note what was attempted and why it was abandoned. The final successful entry for each stage summarizes what was accomplished and any notable observations.
