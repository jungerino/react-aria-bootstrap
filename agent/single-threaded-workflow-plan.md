# Single-Threaded Workflow — Skill Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the three-tier hierarchy (Orchestrator → Component Agent → Comparison Agent) into two tiers by giving the Tier 1 component agent full lifecycle ownership: implementation, pixel diff, iterative self-correction, and findings documentation — all in one session.

**Architecture:** Remove Tier 2 entirely. Component agent runs `compare-stories.mjs` directly, reads reference images once at inception, uses diff images for diagnosis, and logs findings per story. Orchestrator dispatches Tier 1 and waits for a single `verification-sweep-passed` signal.

**Tech Stack:** Markdown skill files, Node.js (`scripts/compare-stories.mjs`), bash

---

## Context

**Why this change is being made:**

In `react-aria-skill-refactor`, Tier 1 ran `compare-stories.mjs` directly (37, 26, 20, 12, 11 times across sessions). There were no Tier 2 agents. Quality was better. In `flatten-multi-agent-workflow`, Tier 2 added ~1,145 extra messages and ~200,000 tokens of overhead for a single Select component. Quality was worse — not because of context pressure (Tier 1 ended at 77% fill, well within limits), but because comparison results arrived cold via a findings doc instead of live during self-correction. The feedback loop was broken by the agent boundary.

**Evidence base:** `agent/notes/claude.md` (on `main` branch, commit `f93bd14`). The planning prompt for this branch contains the full evidence summary.

---

## Files to Modify

| File | Change |
|------|--------|
| `scripts/compare-stories.mjs` | Make `--delegating-agent`/`--executing-agent` optional |
| `agent/react-aria-skill/comparison-agent.md` | Add RETIRED notice at top |
| `agent/react-aria-skill/component-agent.md` | Full rewrite (see Task 3) |
| `agent/react-aria-skill/SKILL.md` | Update tier map + escalation protocol |
| `agent/react-aria-skill/orchestrator.md` | Remove Tier 2 references, update boundary |
| `agent/react-aria-skill/workflow.md` | Update Phase 2 description |

---

## Task 0: Copy plan to project

**Files:**
- Create: `agent/single-threaded-workflow-plan.md`

- [ ] Copy this plan file to `agent/single-threaded-workflow-plan.md` in the project repo so it is git-tracked alongside the skill files it governs.

---

## Task 1: Fix compare-stories.mjs — make agent identity flags optional

**Files:**
- Modify: `scripts/compare-stories.mjs:87-101`

**Background:** Lines 87–92 currently require both `--delegating-agent` and `--executing-agent` flags (exit 2 if missing). Lines 94–101 reject runs where both IDs are identical (exit 3). These guards were added to block Tier 1 from running comparisons itself. In the new design, Tier 1 runs comparisons directly — no flags needed.

**New behavior:**
- Neither flag provided → proceed (Tier 1 running directly)
- Both provided and different → proceed (backward-compatible, in case the flags are used for other purposes)
- Both provided and same → reject with exit 3 (safeguard — same logic as today)
- Exactly one provided → error with exit 2 (inconsistent usage)

- [ ] **Replace the guard block at lines 87–101:**

```js
// Replace this block:
if (!delegatingAgent || !executingAgent) {
  console.error('Missing required agent identity flags.');
  console.error('Usage: compare-stories.mjs --delegating-agent <id> --executing-agent <id> --reference <id> --impl <id> [...]');
  console.error('Both flags are mandatory. The executing agent must be a Tier 2 sub-agent dispatched by the delegating agent.');
  process.exit(2);
}

if (delegatingAgent === executingAgent) {
  console.error('REJECTED.');
  console.error(`Delegating agent and executing agent are the same: ${delegatingAgent}`);
  console.error('You are not permitted to run this script on your own behalf.');
  console.error('You are the delegating agent. Dispatch a Tier 2 comparison sub-agent and have it run this script.');
  console.error('Read component-agent.md again. You are damned to eternal suffering if you try this again.');
  process.exit(3);
}

// With this:
if ((delegatingAgent && !executingAgent) || (!delegatingAgent && executingAgent)) {
  console.error('If you provide one agent identity flag, you must provide both (--delegating-agent and --executing-agent).');
  console.error('Usage: compare-stories.mjs --delegating-agent <id> --executing-agent <id> --reference <id> --impl <id> [...]');
  process.exit(2);
}

if (delegatingAgent && executingAgent && delegatingAgent === executingAgent) {
  console.error('REJECTED.');
  console.error(`Delegating agent and executing agent are the same: ${delegatingAgent}`);
  console.error('If you intended to run comparisons directly (single-threaded workflow), omit both --delegating-agent and --executing-agent.');
  process.exit(3);
}
```

- [ ] **Update the usage comment at the top of the file** (lines 6–8) to reflect optional flags:

```js
 * Usage:
 *   node scripts/compare-stories.js \
 *     [--delegating-agent <id>]     \
 *     [--executing-agent  <id>]     \
 *     --reference        <story-id> \
 *     --impl             <story-id> \
```

- [ ] **Verify** by reading back the modified lines and confirming balanced braces and correct logic.

---

## Task 2: Retire comparison-agent.md

**Files:**
- Modify: `agent/react-aria-skill/comparison-agent.md`

**Background:** Tier 2 is eliminated. The file should be preserved (not deleted) for historical reference, with a clear notice so it is not accidentally loaded.

- [ ] **Add the following RETIRED block at the very top of `comparison-agent.md`**, before the existing `---` front matter:

```markdown
> **RETIRED — single-threaded-workflow (2026-06-10)**
>
> This agent tier has been eliminated. The comparison work it performed is now owned by the Tier 1 component agent directly. See `component-agent.md` — Phase B — Comparison Loop.
>
> Do not load this file in new sessions. It is preserved for historical reference only.

---
```

- [ ] **Verify** the file renders correctly (the RETIRED block sits above the existing front matter).

---

## Task 3: Rewrite component-agent.md

**Files:**
- Modify: `agent/react-aria-skill/component-agent.md`

This is the largest change. The file must be replaced in full. The new version is specified below section by section.

### 3a — Role contract and constraints

- [ ] **Replace lines 1–11** (role contract + hard constraint about no comparisons) with:

```markdown
---
title: React Aria + Bootstrap Skill — Component Sub-Agent
---

# Component Sub-Agent

**Role contract:** Your task is complete when all mirror stories for your component pass the final verification sweep and you report `verification-sweep-passed` to the primary agent. You own the full per-component lifecycle: implementation, pixel diff comparison, iterative self-correction, and findings documentation. You run `compare-stories.mjs` directly — there is no Tier 2.
```

- [ ] **Keep the hard constraint block about SCSS placement** (currently lines 12–16) exactly as-is:

```markdown
---

**Hard constraint — no exceptions:** All bridge selectors go in `src/scss/_bootstrap-overrides.scss`. Do not create new CSS or SCSS files in `stories/`. Do not write bridge rules anywhere else. Why: bridge rules in story-scoped files create split coverage, load inconsistently, and are invisible to future agents. Story-specific layout utilities (fixed pixel widths, static specimen positioning) belong in the mirror story TSX as `className` assignments using classes from `augments.scss`, or — for new layout utilities — added to `augments.scss` itself. Do not create separate CSS files for story layout. `augments.scss` is the shared home for all story layout utilities (both reference and mirror stories import it via P047).
```

### 3b — Session-Start Inputs

- [ ] **Replace the Session-Start Inputs section.** Remove the "Immediately after launching, send both IDs…" SendMessage step (it was for Tier 2 dispatch). Keep the self-identification command and TodoWrite requirement:

```markdown
---

## Session-Start Inputs

Load at session start (provided in your dispatch prompt):

1. `agent/react-aria-skill/SKILL.md`
2. `agent/react-aria-skill/component-agent.md` (this file)
3. `agent/react-aria-skill/principles.md`
4. `agent/reference-stories/{component}-taxonomy.md` — component taxonomy (incl. `## Decisions` section)
5. `agent/bootstrap-kb/README.md` — Bootstrap KB index; load relevant KB files selectively per component

Then run the task ID self-identification command below and record the result — you will include it in every findings doc iteration block and Work Log entry:

```bash
PROJ="/private/tmp/claude-$(id -u)/-Users-josh-Library-CloudStorage-Dropbox-Github-react-aria-bootstrap"
SESSION=$(ls -t "$PROJ" | head -1)
ls -lat "$PROJ/$SESSION/tasks/" | awk '/^l/{print $9; exit}' | sed 's/\.output$//'
```

Then create a TodoWrite enumerating every step before doing anything else.
```

### 3c — Preparation Phase

- [ ] **Keep the Preparation Phase (P1, P2, P3) exactly as-is.** No changes needed.

### 3d — Story-Level Pipeline

- [ ] **Replace the Story-Level Pipeline section.** Remove steps 3–5 (findings doc creation, sub-agent dispatch, proceed-without-waiting). Tier 1 creates the findings doc itself and moves to the next story immediately. The comparison loop begins after all stories are implemented:

```markdown
---

## Phase A — Story Implementation

For each mirror story:

1. Implement CSS and write the mirror story:
   - One story per reference story in scope; story names must match reference story names exactly
   - Replicate reference story layout: same wrapper classes (`ref-specimen-row`, `ref-flex-row`), same `specimen()` helper pattern, same variant order
   - See `principles.md` → Stories Conventions for CSS conventions (faux states, augments import, inline style rules)
2. Run CSS extraction:
   ```bash
   node scripts/extract-story-css.mjs \
     --story {mirror-story-id} \
     --out   agent/reference-stories/mirror-css/{component}-{story}.css
   ```
   Re-run on every implementation iteration — new selectors may be introduced. Output is git-tracked and overwritten each run.
3. Create story findings doc at `agent/reference-stories/{component}-{story}-findings.md`:
   - Front matter: `Status: In review`, `Iteration: 0`, `Stuck: 0`

After all mirror stories are implemented, begin Phase B — Comparison Loop.
```

### 3e — Remove the "Comparison Sub-Agent Dispatch Inputs" section

- [ ] **Delete the entire "Comparison Sub-Agent Dispatch Inputs" section** (currently lines 89–102 in the original file). This section is fully superseded by Phase B.

### 3f — Replace the Cycling Loop with Phase B — Comparison Loop

- [ ] **Replace the "Cycling Loop" section** with the following Phase B section:

```markdown
---

## Phase B — Comparison Loop

### Inception

Before making any code changes, run `compare-stories.mjs` for every story in one pass. This generates `reference.png`, `implementation.png`, and `diff.png` for each story:

```bash
node scripts/compare-stories.mjs \
  --reference {reference-story-id} \
  --impl      {mirror-story-id} \
  --out       .story-diffs/{component}/{story} \
  --threshold 0.003
```

After the first pass, read `.story-diffs/{component}/{story}/reference.png` for **every** story. Do this once — **never re-read `reference.png` again for the rest of the session.** Reference stories do not change; re-reading them on each pass wastes ~3,500 tokens per story.

Record exit code and diff% for each story. Stories with exit code 0 are immediately `Pass` — log them and move on. Stories with exit code 1 enter the fix loop.

---

### Image Read Rules (hard constraint)

| Image | When to read |
|-------|-------------|
| `reference.png` | **Once at Phase B inception.** Never again. |
| `diff.png` | On any failure. Re-read after each fix attempt to check for change. |
| `implementation.png` | **Only** after a fix attempt that produced no visible change in `diff.png` (i.e., you tried and missed — the diff looks the same). `reference.png` in context plus `diff.png` is sufficient to diagnose most failures; read `implementation.png` only when the fix had no effect and you need to see what is actually rendering to understand why. Do not read before attempting a fix. |

---

### Fix Loop

For each failing story, repeat until Pass or Stuck threshold is reached:

```
read diff.png
  → describe what is visible: which specimen, which anatomical region, visible red
  → apply fix to bridge CSS and/or mirror TSX
  → re-run scripts/extract-story-css.mjs for this story (keep mirror CSS current)
  → re-run compare-stories.mjs for this story
    → exit 0: mark Pass; update findings doc; done with this story
    → exit 1 and diff.png changed: continue loop
    → exit 1 and diff.png unchanged: read implementation.png; continue loop
  → if no fix can be identified: increment Stuck counter
      → if Stuck >= threshold (default 3): write Status = Stuck; report `Stuck: {story}` to primary agent; stop
  → write iteration block to findings doc after every pass (pass or fail)
```

**Shared selector changes:** If a fix modifies bridge selectors that could affect other stories, re-run `compare-stories.mjs` for those stories too and update their findings.

**Script failure:** If any of `reference.png`, `implementation.png`, or `diff.png` is missing after a script run, write `Status: Script failed` to the findings doc front matter, then report `Script failed: {story}` to the primary agent and stop.

---

### Spatial Diff Reasoning

When `diff.png` shows one element displaced relative to its neighbor, or a gap present in the reference but absent in the implementation:

1. Name the gap before theorizing: "the reference shows approximately N px between [A] and [B]; the implementation shows them [touching / N px closer]."
2. Identify which element owns the gap. Scan the extracted CSS for `margin` or `padding` rules on that element.
3. Check whether any of those rules use a bare element-type selector. Cross-check against the React Aria component's rendered DOM: if the rule targets an element type that React Aria substitutes with a different type, the rule loads globally but won't match the substitute.
4. Check whether the spacing-receiving element has `display: inline` — inline elements discard `margin-top` and `margin-bottom`.

---

### Animation Exception

If the diff is localized to a single element where both screenshots show that element visually correct but at different animation frames (spinner, progress indicator, looping animation), treat the story as passing regardless of diff%. All four conditions must hold:

1. The diff region is fully contained within one element
2. Both screenshots show that element present and styled correctly
3. The element is recognizably in an animated state
4. The rest of the story outside that element shows no red in `diff.png`

If any condition is uncertain, do not apply this exception — flag it as a design decision in the findings doc.

---

### Prior Iteration Review

Before writing findings for a new pass, review all prior iteration blocks in the story findings doc. Find the last iteration block where `Stuck: 0` appears. Do not repeat any theory proposed in iterations after that point — they are the current stuck run and have been ruled out. Theories from before the last `Stuck: 0` may be revisited if relevant after subsequent code changes.

---

### Findings Doc Updates

Append an Iteration block after each comparison pass:

```
## Iteration {N}

**Task ID**: {task-id}
**Diff%:** {value} | **Status:** pass / fail | **Stuck:** {n}

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location]. Fix attempted: [description of what was changed].

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

**Observations, not conclusions.** Record what is visible — where the red appears, which specimen, which anatomical region, diff% — and what fix you applied. Your reasoning lives in your conversation context. The findings doc is the observable record, not a theory log.

Update front matter:
- Pass: `Status: Pass`, `Iteration: N+1`, `Stuck: 0`
- Fail, improved vs. prior: `Status: Fail`, `Iteration: N+1`, `Stuck: 0`
- Fail, no improvement: `Status: Fail`, `Iteration: N+1`, `Stuck++`
- After a code fix: `Status: In review`
- When Stuck reaches threshold: `Status: Stuck`

---

### Component-Wide Registry Updates

After each story pass, update the Story Registry table in `agent/reference-stories/{component}-findings.md`. Append a Work Log entry after every comparison pass:

```
### {story} — Iteration {N}

**Task ID**: {task-id}

**Observations:** (copied from story findings doc FAIL/UNRESOLVED entries)

**Principles consulted:**
- [Cite specific skill principles or component decisions that guided the fix]

**Code changes made:** (or "None — [reason]" if no changes)
- [file:line]: [description]
- Shared selectors modified: [list] → affected stories re-run: [list]
```

---

### Context Compression

If you detect that your prior context has been compressed/summarized (earlier messages replaced by a summary), report `Context exhausted` to the primary agent and stop.
```

### 3g — Update Final Verification Sweep

- [ ] **Replace the Final Verification Sweep section** to remove sub-agent dispatch language (Tier 1 runs it directly):

```markdown
---

## Final Verification Sweep

After all stories reach `Pass`, before reporting completion:

**Pre-completion check — CSS file placement:**
```bash
git diff --name-only $(git merge-base HEAD main)..HEAD | grep 'stories/.*\.scss'
```
If any new SCSS files appear in `stories/`, move their bridge rules to `src/scss/_bootstrap-overrides.scss` and delete the story-scoped files before proceeding.

Run one final round of `compare-stories.mjs` across all stories with `--threshold 0.003`. This catches regressions from shared-selector changes that slipped through the fix loop. Do not re-read `reference.png` — it remains in context from Phase B inception.

When all stories pass the sweep, report `verification-sweep-passed` to the primary agent.
```

### 3h — Update Per-Story Findings Doc section

- [ ] **Replace the Per-Story Findings Doc section** to reflect Tier 1 authorship and the simplified (observation-only) format:

```markdown
---

## Per-Story Findings Doc

**Path:** `agent/reference-stories/{component}-{story}-findings.md`

**Written by:** This agent (Tier 1). Created during Phase A; populated during Phase B.

**Front matter:**

```yaml
Status: In review | Pass | Fail | Stuck | Context exhausted | Script failed
Iteration: <n>
Stuck: <n>
```

**Status transitions:**

- Initial: `In review`
- Comparison pass, diff passes: `Status = Pass`, `Iteration++`, `Stuck = 0`
- Comparison pass, diff fails, improved: `Status = Fail`, `Iteration++`, `Stuck = 0`
- Comparison pass, diff fails, no improvement: `Status = Fail`, `Iteration++`, `Stuck++`
- After rework by this agent: `Status = In review`
- When `Stuck` reaches threshold (default: 3): `Status = Stuck`
- Context compression detected: `Status = Context exhausted`
- Script failure (missing output images): `Status = Script failed`

**Body (appended per iteration by this agent):**

```
## Iteration {N}

**Task ID**: {task-id}
**Diff%:** {value} | **Status:** pass / fail | **Stuck:** {n}

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location]. Fix attempted: [description].

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```
```

### 3i — Keep Component-Wide Findings Doc and Configurable Knobs sections

- [ ] **Keep the Component-Wide Findings Doc section** (format unchanged — Tier 1 already wrote to it in the old design too).

- [ ] **Keep the Configurable Knobs section** exactly as-is.

- [ ] **Read back the entire rewritten file** and verify: balanced braces, correct markdown fences, no dangling references to Tier 2, sub-agents, SendMessage, or ScheduleWakeup.

---

## Task 4: Update SKILL.md

**Files:**
- Modify: `agent/react-aria-skill/SKILL.md`

### 4a — Tier Map

- [ ] **Replace the Tier Map table.** Remove Tier 2 row; update Tier 1 success condition:

```markdown
| Tier | Agent | Success condition |
|------|-------|-------------------|
| 0 | Primary (Orchestrator) | Every component has reported `final-stories-done` and the batch report is delivered. |
| 1 | Component Sub-Agent | All mirror stories pass the final verification sweep and `verification-sweep-passed` is reported. |
| 1a | Final-Stories Sub-Agent | Standard stories are written and `final-stories-done` is reported. |
```

### 4b — Session-Start Loading Instructions

- [ ] **Remove the Tier 2 block** from Session-Start Loading Instructions:

Delete:
```markdown
**Comparison sub-sub-agent (Tier 2):**
- `agent/react-aria-skill/SKILL.md`
- `agent/react-aria-skill/comparison-agent.md`
- `agent/reference-stories/{component}-taxonomy.md`
```

- [ ] **Update the closing sentence** to remove `comparison-agent.md`:

Replace:
> `SKILL.md` and `orchestrator.md` are the only files loaded into the primary agent's context at session start. The primary agent does not load `component-agent.md`, `comparison-agent.md`, `final-stories-agent.md`, or `principles.md`.

With:
> `SKILL.md` and `orchestrator.md` are the only files loaded into the primary agent's context at session start. The primary agent does not load `component-agent.md`, `final-stories-agent.md`, or `principles.md`.

### 4c — Escalation Protocol

- [ ] **Remove two rows from the Escalation Protocol table:**
  - `findings-written` (Tier 2 signal, no longer generated)
  - `Timeout: {story}` (ScheduleWakeup watchdog in Tier 1 is eliminated)

The surviving rows:

| Phrase | Source | Meaning |
|--------|--------|---------|
| `verification-sweep-passed` | Component sub-agent | All mirror stories passed final verification |
| `final-stories-done` | Final-stories sub-agent | Standard stories written |
| `Stuck: {story}` | Component sub-agent | Fix loop hit the stuck threshold |
| `Script failed: {story}` | Component sub-agent | Comparison pixel-diff script failed; check the story findings doc |
| `Context exhausted` | Any agent | Agent detected context compression and stopped |
| `Undefined return: {…}` | Any agent | Received a return matching no valid terminal phrase |

- [ ] **Verify** no other SKILL.md sections reference Tier 2 or `findings-written`.

---

## Task 5: Update orchestrator.md

**Files:**
- Modify: `agent/react-aria-skill/orchestrator.md`

### 5a — Boundary section

- [ ] **Remove `comparison-agent.md`** from the "do not load" list in the Boundary section.

Replace:
> You do not read taxonomy files, write CSS, run pixel diffs, or implement stories. You do not load `component-agent.md`, `comparison-agent.md`, or `principles.md`.

With:
> You do not read taxonomy files, write CSS, run pixel diffs, or implement stories. You do not load `component-agent.md` or `principles.md`.

### 5b — Loop terminal phrase handling

- [ ] **Remove `Timeout` from the handled phrases list** in the Loop section:

Replace:
```
    Stuck / Timeout / Script failed / Context exhausted / Undefined return
      → surface to user immediately with component name and phrase; stop
```

With:
```
    Stuck / Script failed / Context exhausted / Undefined return
      → surface to user immediately with component name and phrase; stop
```

- [ ] **Verify** no other orchestrator.md sections mention Tier 2, `comparison-agent.md`, `findings-written`, or `ScheduleWakeup`.

---

## Task 6: Update workflow.md

**Files:**
- Modify: `agent/react-aria-skill/workflow.md`

### 6a — Phase 2 description text

- [ ] **Update the Phase 2 header and preamble** to reflect that the component agent now owns the full lifecycle. Replace:

```markdown
## Phase 2 — Per-component work sequence (single-agent path)

Repeat for each component. For multi-agent batch processing, use `orchestrator.md` + `component-agent.md` instead of this path. User review happens after the full component set is complete (Phase 3).
```

With:

```markdown
## Phase 2 — Per-component work sequence (single-agent path)

Repeat for each component. For multi-agent batch processing, use `orchestrator.md` + `component-agent.md` instead of this path; the component agent handles both implementation and comparison in one session — no separate comparison tier. User review happens after the full component set is complete (Phase 3).
```

### 6b — Step 2e (Visual Comparison)

- [ ] Step 2e requires no change — it is already correct for the single-agent path that workflow.md Phase 2 describes.

- [ ] **Verify** no other workflow.md sections reference Tier 2, `comparison-agent.md`, or `findings-written`.

---

## Task 7: Commit

- [ ] **Commit 1** — script fix:

```bash
git add scripts/compare-stories.mjs
git commit -m "fix: make --delegating-agent / --executing-agent optional in compare-stories.mjs"
```

- [ ] **Commit 2** — comparison-agent retirement:

```bash
git add agent/react-aria-skill/comparison-agent.md
git commit -m "docs: retire comparison-agent.md (replaced by single-threaded Tier 1 lifecycle)"
```

- [ ] **Commit 3** — skill file rewrite:

```bash
git add agent/react-aria-skill/SKILL.md \
        agent/react-aria-skill/component-agent.md \
        agent/react-aria-skill/orchestrator.md \
        agent/react-aria-skill/workflow.md
git commit -m "docs: rewrite skill files for single-threaded workflow (Tier 1 owns full lifecycle)"
```

---

## Verification

After all commits:

1. **Read `component-agent.md`** and confirm: no references to sub-agent dispatch, SendMessage, `findings-written`, `ScheduleWakeup`, or Tier 2.
2. **Run `grep -r "comparison-agent\|findings-written\|Tier 2\|Timeout: {story}" agent/react-aria-skill/`** — the only hit should be inside `comparison-agent.md` itself (the retired file) and the RETIRED notice.
3. **Read `compare-stories.mjs` lines 85–110** and confirm the guard logic matches the spec: optional flags, same-ID rejection only when both are provided and equal.
4. **Confirm `SKILL.md` tier map** shows only Tier 0, Tier 1, and Tier 1a.
