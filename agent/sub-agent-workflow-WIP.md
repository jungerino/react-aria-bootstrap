---
title: Sub-Agent Styling Workflow — WIP Design
status: working-draft
---

# Sub-Agent Styling Workflow

Working design document for the three-tier agent architecture intended to scale styling work across a batch of ~5 components. This doc captures the current design, open decisions, alternatives under consideration, and known risks. When the design is settled, the authoritative content moves to `agent/react-aria-skill.md`.

---

## Architecture

```
Primary agent (orchestrator)
├── Dispatches component sub-agents — one per component, simultaneously
├── Event loop: advances each component through verification and final stories
│   as completions arrive, without waiting for all components to finish
└── Surfaces problems to user; compiles batch report when all done

Component sub-agent (one per component)
├── Reads: skill doc, component taxonomy (incl. Decisions section), Bootstrap KB
├── Implements each mirror story (with CSS extraction before each comparison)
├── Maintains component-wide findings doc: agent/reference-stories/{component}-findings.md
├── Dispatches comparison sub-sub-agents (background, one per story)
├── Cycles through story findings docs until all Pass or any Stuck/Timeout
├── Runs final verification sweep when all stories Pass
└── Reports status to primary on completion (all-Pass or problem)

Comparison sub-sub-agent (one per story iteration)
├── Runs pixel diff (Playwright + pixelmatch)
├── Reads all three output images (reference, implementation, diff)
├── Identifies failing specimens and sub-parts using the taxonomy
├── Develops and validates a CSS theory using matched CSS + overrides
├── Writes findings to story findings doc
└── Notifies component sub-agent on completion (automatic via run_in_background); retires

Final-stories sub-agent (fresh, one per component)
├── Launched by primary after component sub-agent passes final verification sweep
├── Reads: skill doc, component taxonomy, validated CSS
├── Implements final styled stories with full context headroom
└── Reports completion to primary
```

---

## Primary Agent (Orchestrator)

Dispatch all component sub-agents simultaneously.

**Note:** The Claude Code harness may impose a cap on concurrent background agents. At full scale (primary + 5 component sub-agents + multiple concurrent sub-sub-agents per component) the total could exceed 25 simultaneous agents. If the harness queues rather than immediately runs a spawned agent, that agent may sit silent long enough to trip the ScheduleWakeup watchdog, producing a false Timeout. This is recoverable — the user sees it and can relaunch — but may occur without indicating a true problem. Monitor on first real run; no design change needed until the failure mode is observed.

Each sub-agent prompt must be fully self-contained — see Component Sub-Agent Inputs below.

**Event loop** (while any component sub-agents are running):

```
on notification from component sub-agent:
  if status == verification-sweep-passed:
    launch fresh final-stories sub-agent for this component (background)

  if status == Stuck or Timeout or Context exhausted:
    surface to user immediately with component name and stuck story
    continue waiting for other components

  if status == final-stories-done:
    log completion for this component

if all components have reported final-stories-done:
  compile batch report; present to user
```

The primary agent advances each component independently as notifications arrive — it does not wait for all components to finish before moving any of them forward.

---

## Component Sub-Agent Inputs

The sub-agent prompt must include:

- This skill doc
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md` (includes a `## Decisions` section)
- Bootstrap KB index: `agent/bootstrap-kb/README.md` — sub-agent loads relevant KB files as needed
- Path to mirror stories file: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Path to write the component findings doc: `agent/reference-stories/{component}-findings.md`

---

## Story-Level Pipeline (Initial Implementation)

For each mirror story:

1. Implement CSS and write the mirror story
2. Run the CSS extraction script to capture Bootstrap rules that match the rendered story DOM:
   ```
   node scripts/extract-story-css.mjs \
     --story {mirror-story-id} \
     --out   agent/reference-stories/mirror-css/{component}-{story}.css
   ```
   (Re-run on every implementation iteration — new selectors may be introduced.)
3. Create the story findings doc at `agent/reference-stories/{component}-{story}-findings.md` with front matter:
   - `Status: In review`
   - `Iteration: 0`
   - `Stuck: 0`
4. Launch a comparison sub-sub-agent (`run_in_background: true`)
5. Proceed to the next mirror story without waiting

After all stories are implemented, begin the cycling loop.

---

## Per-Story Findings Doc

**Path:** `agent/reference-stories/{component}-{story}-findings.md`

**Front matter (maintained by sub-sub-agent):**

```yaml
Status: In review | Pass | Fail | Stuck | Context exhausted
Iteration: <n>
Stuck: <n>   # consecutive iterations that failed to improve Diff%
```

**Status transitions:**

- Initial: `In review`
- Sub-sub-agent completes, diff passes: `Status = Pass`, `Iteration++`, `Stuck = 0`
- Sub-sub-agent completes, diff fails, improved: `Status = Fail`, `Iteration++`, `Stuck = 0`
- Sub-sub-agent completes, diff fails, no improvement: `Status = Fail`, `Iteration++`, `Stuck++`
- After rework by sub-agent: `Status = In review`
- When `Stuck` reaches threshold (default: 3): `Status = Stuck`
- Sub-sub-agent detects context compression: `Status = Context exhausted`

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

Maintained by the sub-agent. Purpose: single place for the user and primary orchestrator to monitor overall progress; reduces the cost of the cycling loop.

**Contents:**

### Story Registry

A table updated by the sub-agent after each sub-sub-agent run:

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| trigger-states | Fail | 2 | 0 | 1.3% |
| open-states | Pass | 1 | 0 | 0.2% |
| ... | | | | |

Sub-agent reads this registry before each cycle pass to skip stories already logged as `Pass`.

### Work Log

Per-story, per-iteration entries written by the sub-agent after each rework:

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

## Cycling Loop

The cycling loop is **notification-driven** — the sub-agent waits for completion notifications from sub-sub-agents rather than polling. A `ScheduleWakeup` watchdog guards against silent failures.

After all initial story implementations are complete (all sub-sub-agents already launched):

```
schedule ScheduleWakeup (20 min)   // initial watchdog

on sub-sub-agent notification:
  read story findings doc
  update component findings registry

  if Status == Stuck or Context exhausted:
    report to primary agent; stop

  if Status == Fail:
    rework CSS per findings
    update story front matter: Status = In review
    update component findings doc (registry + work log)
    re-check CSS change scope — if shared selector modified:
      set affected stories to Status = In review; relaunch their sub-sub-agents too
    re-launch sub-sub-agent (background)
    reset watchdog: schedule new ScheduleWakeup (20 min)

  if Status == Pass:
    if all stories Pass: cancel watchdog intent; proceed to Final Verification Sweep
    else: reset watchdog: schedule new ScheduleWakeup (20 min)

on ScheduleWakeup:
  if any stories still In review:
    mark those stories Timeout in registry
    report to primary agent; stop
  else:
    ignore (stale wakeup — all sub-sub-agents already completed)
```

**On ScheduleWakeup:** `ScheduleWakeup` has no cancel mechanism. "Cancel watchdog intent" above means: when the wakeup eventually fires, the `else` branch handles it as a stale wakeup. The 20-minute window resets on every sub-sub-agent notification, so the watchdog only fires if no sub-sub-agent has reported in 20 consecutive minutes — the definition of a silent failure.

**On context compression (sub-agent level):** If the sub-agent itself detects that its prior conversation context has been compressed/summarized by the harness, it should report `Context exhausted` to the primary agent and stop — same handling as `Stuck`. Do not continue work after compression; quality is unreliable. Detection: the agent observes that earlier messages in its context have been replaced by a summary.

**Status values** (per-story front matter): `In review` | `Pass` | `Fail` | `Stuck` | `Timeout` | `Context exhausted`

---

## Final Verification Sweep

After all stories have reached `Status = Pass`, run one final round of sub-sub-agent comparisons across all stories. Rationale: fixing story N may have introduced a regression in story M via a shared selector, and the cycling loop only rechecks stories when the sub-agent knows a shared selector was modified. The final sweep catches anything that slipped through.

The final sweep uses the same pass/fail threshold (0.5%) as the cycling loop.

---

## Final Story Implementations

The component sub-agent's job ends after the final verification sweep. Final styled stories — the actual deliverable — are written by a **fresh final-stories sub-agent** launched by the primary agent.

Rationale: by the time the mirror cycle is complete, the component sub-agent has accumulated substantial context (diff analysis, rework history, intermediate state) that is irrelevant to final story authorship. A fresh agent starts with full context headroom and only what it needs: the skill doc, the component taxonomy (with the validated CSS decisions), and the story conventions.

Because every sub-part, state, and variant has been validated through the mirror story process, final story implementation should be straightforward and low-error — no comparison step needed.

**Inputs for the final-stories sub-agent:**
- Skill doc
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md` (includes Decisions section)
- Component-wide findings doc: `agent/reference-stories/{component}-findings.md` (work log provides full CSS history)
- Story format conventions: call `get-storybook-story-instructions` via Storybook MCP
- Story content principles: this skill doc (specimen layout, state coverage, Bootstrap-specific patterns)

---

## Sub-Sub-Agent

### Inputs

- Mirror story URL: `?path=/story/bootstrap-test-mirror-{component}--{story}`
- Reference story URL: `?path=/story/bootstrap-reference-{component}--{story}`
- Story findings doc path: `agent/reference-stories/{component}-{story}-findings.md`
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md`
- Component mirror stories TSX: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Bootstrap overrides: `src/scss/_bootstrap-overrides.scss`
- Matched Bootstrap CSS for this story: `agent/reference-stories/mirror-css/{component}-{story}.css`
  (Generated by `extract-story-css.mjs` before this sub-sub-agent is launched — see CSS Extraction Script section)

### Pixel diff command

```
node scripts/compare-stories.mjs \
  --reference {reference-story-id} \
  --impl      {mirror-story-id} \
  --out       .story-diffs/{component}/{story} \
  --threshold 0.005
```

Script outputs:
- `.story-diffs/{component}/{story}/reference.png`
- `.story-diffs/{component}/{story}/implementation.png`
- `.story-diffs/{component}/{story}/diff.png`
- Diff percentage (stdout)

### Pass/fail threshold

- Pass: diff% < 0.5%
- Fail: diff% ≥ 0.5%

### Context compression

If the sub-sub-agent detects that its prior conversation context has been compressed/summarized by the harness, it must write `Status: Context exhausted` to the story findings doc and exit. Do not attempt further analysis — quality after compression is unreliable.

Detection: the agent observes that earlier messages in its context have been replaced by a summary.

---

## CSS Extraction Script

**Script:** `scripts/extract-story-css.mjs` (not yet implemented)

**Purpose:** Produce a CSS file containing only the Bootstrap rules that actually match the rendered story DOM, for use by the comparison sub-sub-agent during theory validation.

**Mechanism:** Chrome DevTools Protocol (CDP) `CSS.getMatchedStylesForNode`. Playwright exposes CDP via `page.context().newCDPSession(page)`. The script:
1. Navigates to the mirror story
2. Opens a CDP session, enables the CSS domain
3. Gets nodeIds for `#storybook-root` and all descendants via `DOM.querySelectorAll`
4. Calls `CSS.getMatchedStylesForNode` on each nodeId
5. Collects `matchedCSSRules` and `pseudoElements` (for `::before`, `::after`, etc.)
6. De-duplicates and writes to the output file

**Coverage:**
- Pseudo-element rules (`::before`, `::after`, `::placeholder`, etc.): covered via the `pseudoElements` array in the CDP response
- CSS variable declarations: covered — rules declaring `--bs-*` variables appear if the declaring selector matches an element
- Resolved variable values: not included; available via `getComputedStyle` if needed, but the declaration chain is sufficient for theory validation
- Native pseudo-class rules (`:hover`, `:focus`, etc.): only captured if the element is in that state at extraction time; unlikely to matter since our overrides use `data-*` attribute selectors instead

**Output:** `agent/reference-stories/mirror-css/{component}-{story}.css`, git-tracked. Overwritten on each iteration.

**Proof-of-concept (browser console):**
```javascript
const elements = [...document.querySelectorAll('#storybook-root, #storybook-root *')];
const rules = new Set();
for (const sheet of document.styleSheets) {
  try {
    for (const rule of sheet.cssRules) {
      try {
        if (elements.some(el => el.matches(rule.selectorText)))
          rules.add(rule.cssText);
      } catch(e) {}
    }
  } catch(e) {}
}
copy([...rules].join('\n'));
```
Paste result into a file and verify that Bootstrap rules for the component are present. Note: does not capture pseudo-element rules — that requires the CDP approach.

---

## Configurable Knobs

| Parameter | Default | Notes |
|-----------|---------|-------|
| Stuck counter threshold | 3 | Consecutive non-improving iterations before Status = Stuck |
| Pass/fail threshold | 0.5% | Diff% cutoff |
| pixelmatch threshold | 0.005 | Per-pixel sensitivity (separate from pass/fail %) |

