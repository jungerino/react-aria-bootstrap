---
title: React Aria + Bootstrap Skill — Component Sub-Agent
---

# Component Sub-Agent

**Role contract:** Your task is complete when all mirror stories for your component reach Pass on the final verification sweep and you report `verification-sweep-passed` to the primary agent. Your task is NOT complete when a story passes — that is an intermediate milestone. You do not run pixel diffs. You dispatch comparison agents and act on their findings.

---

## Session-Start Inputs

Load at session start (provided in your dispatch prompt):

1. `agent/react-aria-skill/SKILL.md`
2. `agent/react-aria-skill/component-agent.md` (this file)
3. `agent/react-aria-skill/principles.md`
4. `agent/reference-stories/{component}-taxonomy.md` — component taxonomy (incl. `## Decisions` section)
5. `agent/bootstrap-kb/README.md` — Bootstrap KB index; load relevant KB files selectively per component

Then create a TodoWrite enumerating every step before doing anything else.

---

## Preparation Phase

Complete these steps once for the component before the story-level pipeline:

**P1. Internalize inputs:**
1. Read the taxonomy `## Decisions` section — pre-resolved decisions; do not re-derive them.
2. Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
3. Load Bootstrap KB: `components.md` entry for the matched Bootstrap component → `states.md` → `patterns.md` if a DOM conflict entry exists.
4. Review all principles. Flag any with structural or sizing implications (P008, P010, P016, P040, P041, P042) — address during TSX/bridge implementation, not at diff time.

**P2. Implement TSX:**
- Apply `className` render-prop pattern (P002) for Bootstrap classes.
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing the variant set.
- Honor all taxonomy `## Decisions` entries.
- Apply Bootstrap component classes (P013); reserve utility classes for genuine one-off cases.
- Address all structural and sizing principles flagged in P1.

**P3. Write base bridge selectors:**
- Write all bridge selectors in `src/scss/_bootstrap-overrides.scss` (P003).
- Use SCSS mixins for `$enable-*`-gated properties (P015).
- Cover all states in the taxonomy's state mappings; follow the Data-* Bridge Rules in `principles.md`.

---

## Story-Level Pipeline

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
4. Launch comparison sub-sub-agent (`run_in_background: true`) with the inputs listed below
5. Proceed to the next mirror story without waiting

After all stories are implemented, begin the cycling loop.

### Comparison Sub-Agent Dispatch Inputs

Each comparison sub-sub-agent prompt must include:
- Mirror story URL: `?path=/story/bootstrap-test-mirror-{component}--{story}`
- Reference story URL: `?path=/story/bootstrap-reference-{component}--{story}`
- Story findings doc: `agent/reference-stories/{component}-{story}-findings.md`
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md`
- Component mirror stories TSX: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Bootstrap overrides: `src/scss/_bootstrap-overrides.scss`
- Matched Bootstrap CSS: `agent/reference-stories/mirror-css/{component}-{story}.css`
  — `.faux-*` rules in this file define the target visual appearance for interactive states; see the taxonomy state mapping table for the `faux-*` → `data-*` correspondence

---

## Cycling Loop

Notification-driven. A `ScheduleWakeup` watchdog guards against silent failures.

After all initial stories are implemented:

```
schedule ScheduleWakeup (20 min)

on sub-sub-agent notification:
  if notification != `findings-written`:
    report `Undefined return: {notification}` to primary agent; stop
  read story findings doc
  update component findings registry

  if Status == Script failed:
    report `Script failed: {story}` to primary agent; stop

  if Status == Context exhausted:
    report `Context exhausted` to primary agent; stop

  if Status == Stuck:
    report `Stuck: {story}` to primary agent; stop

  if Status == Fail:
    rework CSS per findings
    update story front matter: Status = In review
    update component findings doc (registry + work log)
    re-check CSS change scope — if shared selector modified:
      set affected stories to Status = In review; relaunch their sub-sub-agents too
    re-launch sub-sub-agent (background)
    reset watchdog: schedule new ScheduleWakeup (20 min)

  if Status == Pass:
    if all stories Pass: proceed to Final Verification Sweep
    else: reset watchdog: schedule new ScheduleWakeup (20 min)

on ScheduleWakeup:
  if any stories still In review:
    mark those stories Timeout in registry
    report `Timeout: {story}` to primary agent; stop
  else:
    ignore (stale wakeup)
```

`ScheduleWakeup` has no cancel mechanism — the watchdog only fires if no sub-sub-agent has reported in 20 consecutive minutes (the window resets on every notification).

**On context compression:** If you detect that your prior context has been compressed/summarized (earlier messages replaced by a summary), report `Context exhausted` to the primary agent and stop.

---

## Final Verification Sweep

After all stories reach `Pass`, launch one final round of sub-sub-agent comparisons across all stories using the same 0.5% threshold. This catches regressions from shared-selector changes that slipped through the cycling loop.

When all stories pass the sweep, report `verification-sweep-passed` to the primary agent.

---

## Per-Story Findings Doc

**Path:** `agent/reference-stories/{component}-{story}-findings.md`

**Front matter:**

```yaml
Status: In review | Pass | Fail | Stuck | Timeout | Context exhausted | Script failed
Iteration: <n>
Stuck: <n>
```

**Status transitions:**

- Initial: `In review`
- Sub-sub-agent completes, diff passes: `Status = Pass`, `Iteration++`, `Stuck = 0`
- Sub-sub-agent completes, diff fails, improved: `Status = Fail`, `Iteration++`, `Stuck = 0`
- Sub-sub-agent completes, diff fails, no improvement: `Status = Fail`, `Iteration++`, `Stuck++`
- After rework by sub-agent: `Status = In review`
- When `Stuck` reaches threshold (default: 3): `Status = Stuck`
- Sub-sub-agent detects context compression: `Status = Context exhausted`
- Sub-sub-agent encounters script failure: `Status = Script failed`

**Body (appended per iteration by sub-sub-agent):**

```
## Iteration {N}

**Diff%:** {value} | **Status:** pass / fail

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location].
  Theory: [selector/property] is [missing/wrong value].
  Validated: [yes/no — cite file:line]

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

---

## Component-Wide Findings Doc

**Path:** `agent/reference-stories/{component}-findings.md`

**Story Registry** (updated after each sub-sub-agent run):

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| trigger-states | Fail | 2 | 0 | 1.3% |
| open-states | Pass | 1 | 0 | 0.2% |

**Work Log** (per-story, per-iteration, written by sub-agent after each rework):

```
## {story} — Iteration {N}

**Sub-sub-agent findings:** (copied from story findings doc)
- Specimen [label]: [theory + validation]

**Principles consulted:**
- [Cite specific skill principles or component decisions that guided the fix]

**CSS changes made:**
- [selector/property]: [old value] → [new value] (file:line)
- Shared selectors modified: [list] → stories reset to In review and relaunched: [list]
```

---

## Configurable Knobs

| Parameter | Default | Notes |
|-----------|---------|-------|
| Stuck counter threshold | 3 | Consecutive non-improving iterations before Status = Stuck |
| Pass/fail threshold | 0.5% | Diff% cutoff |
| pixelmatch threshold | 0.005 | Per-pixel color sensitivity |
