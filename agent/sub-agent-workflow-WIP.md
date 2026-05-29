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
└── Notifies component sub-agent on completion; retires

Final-stories sub-agent (fresh, one per component)
├── Launched by primary after component sub-agent passes final verification sweep
├── Reads: skill doc, component taxonomy, validated CSS
├── Implements final styled stories with full context headroom
└── Reports completion to primary
```

---

## Primary Agent (Orchestrator)

Dispatch all component sub-agents simultaneously.

**Note:** The Claude Code harness may impose a cap on concurrent background agents. This has not been verified empirically. If agents appear to be silently queued, test by launching 5 simultaneously and observing behavior.

Each sub-agent prompt must be fully self-contained — see Component Sub-Agent Inputs below.

**Event loop** (while any component sub-agents are running):

```
on notification from component sub-agent:
  if status == verification-sweep-passed:
    launch fresh final-stories sub-agent for this component (background)

  if status == Stuck or Timeout:
    surface to user immediately with component name and stuck story
    continue waiting for other components

  if status == final-stories-done:
    log completion for this component

if all components have reported final-stories-done:
  compile batch report; present to user
```

The primary agent advances each component independently as notifications arrive — it does not wait for all components to finish before moving any of them forward. While waiting with nothing to advance, state: "Awaiting sub-agent results."

---

## Component Sub-Agent Inputs

The sub-agent prompt must include:

- This skill doc
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md` (includes a `## Decisions` section — see Open Decisions #1)
- Relevant entries from `agent/component-decisions.md` for the assigned component
- Bootstrap KB index and whichever KB files are relevant to the component
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
Status: In review | Pass | Fail | Stuck
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
- Shared selectors modified: [list — triggers shared-selector recheck]
```

**Open question:** What else belongs in the work log? Current candidates:
- Story implementation order
- Cross-story impacts (which stories were rechecked due to a shared-selector change)

---

## Cycling Loop

After all initial implementations are complete, the sub-agent cycles:

```
repeat:
  for each story in registry:
    if Status == Pass: skip
    if Status == In review: skip (sub-sub-agent running)
    if Status == Stuck: STOP — report to primary agent
    if Status == Fail:
      read story findings doc
      rework CSS per findings
      update story front matter: Status = In review
      update component findings doc (registry + work log)
      re-launch sub-sub-agent (background)
      re-check CSS change scope — if shared selector modified:
        flag affected stories; relaunch their sub-sub-agents too
  if all Pass: proceed autonomously to Final Verification Sweep
  if any Stuck or Timeout: stop — report to primary agent
  // else: some still In review — loop again (sub-sub-agents are running)
```

**On notification vs. polling:** The cycling loop above is polling-based — the sub-agent loops and reads findings docs directly, requiring no completion callbacks from sub-sub-agents. This is simpler to reason about and avoids the need for an explicit notification mechanism. Trade-off: slightly less responsive than a notification-driven approach if there are long gaps between sub-sub-agent completions. Given the loop is reading small files, polling cost is negligible.

---

## Final Verification Sweep

After all stories have reached `Status = Pass`, run one final round of sub-sub-agent comparisons across all stories. Rationale: fixing story N may have introduced a regression in story M via a shared selector, and the cycling loop only rechecks stories when the sub-agent knows a shared selector was modified. The final sweep catches anything that slipped through.

**Open question:** Should the final sweep use the same pass/fail threshold (0.5%), or a tighter threshold to catch subtle regressions? Current thinking: same threshold for consistency.

---

## Final Story Implementations

The component sub-agent's job ends after the final verification sweep. Final styled stories — the actual deliverable — are written by a **fresh final-stories sub-agent** launched by the primary agent.

Rationale: by the time the mirror cycle is complete, the component sub-agent has accumulated substantial context (diff analysis, rework history, intermediate state) that is irrelevant to final story authorship. A fresh agent starts with full context headroom and only what it needs: the skill doc, the component taxonomy (with the validated CSS decisions), and the story conventions.

Because every sub-part, state, and variant has been validated through the mirror story process, final story implementation should be straightforward and low-error — no comparison step needed.

**Inputs for the final-stories sub-agent:**
- Skill doc
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md` (includes Decisions section)
- Component-wide findings doc: `agent/reference-stories/{component}-findings.md` (work log provides full CSS history)
- Story conventions (from Storybook MCP or skill doc)

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
  (Generated by `extract-story-css.mjs` before this sub-sub-agent is launched — see Open Decision #2)

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

---

## Configurable Knobs

| Parameter | Default | Notes |
|-----------|---------|-------|
| Stuck counter threshold | 3 | Consecutive non-improving iterations before Status = Stuck |
| Pass/fail threshold | 0.5% | Diff% cutoff |
| pixelmatch threshold | 0.005 | Per-pixel sensitivity (separate from pass/fail %) |

---

## Open Decisions

### #1 — Component decisions doc structure

**Question:** Where do per-component decisions live?

- **Option A:** Separate file: `agent/reference-stories/{component}-decisions.md`
- **Option B:** `## Decisions` section added to existing `agent/reference-stories/{component}-taxonomy.md`

**Current lean:** Option B. Decisions are coupled to taxonomy structure; sub-agent loads one file instead of two; no drift risk between the two docs.

**Status:** Agreed — pending implementation.

---

### #2 — Bootstrap CSS source for sub-sub-agents

**Question:** What CSS source does the sub-sub-agent use to validate theories about Bootstrap styling?

**Decision: Option C — Playwright-extracted matched styles**, stored at `agent/reference-stories/mirror-css/{component}-{story}.css` (git-tracked).

**Mechanism:** Chrome DevTools Protocol (CDP) `CSS.getMatchedStylesForNode`. Playwright exposes CDP via `page.context().newCDPSession(page)`. The extraction script (`extract-story-css.mjs`):
1. Navigates to the mirror story
2. Opens a CDP session, enables the CSS domain
3. Gets nodeIds for `#storybook-root` and all descendants via `DOM.querySelectorAll`
4. Calls `CSS.getMatchedStylesForNode` on each nodeId
5. Collects `matchedCSSRules` (and `pseudoElements` for pseudo-element rules — see Coverage below)
6. De-duplicates and writes to the output file

Context cost to the sub-sub-agent: hundreds of lines rather than ~12k. The component sub-agent's cost to run the script: one Bash call, ~5–15 seconds, output goes to a file.

**Coverage:**

- *Pseudo-element rules* (`::before`, `::after`, `::placeholder`, etc.): covered. The CDP response includes a `pseudoElements` array alongside `matchedCSSRules`; the script must extract both.
- *CSS variable declarations*: covered. If a rule `.btn { --bs-btn-padding-x: 0.75rem; }` matches an element, that declaration appears in the output. The sub-sub-agent can trace `var(--bs-btn-padding-x)` references back to their declaration in the same file.
- *Resolved variable values* (e.g. the computed `0.75rem` rather than `var(...)`): not included in matched rules. Available via `getComputedStyle` if needed, but for theory validation the declaration chain is sufficient.

**Per-iteration re-run:** Required. Each implementation iteration may introduce new selectors or modify existing ones, so the matched CSS must be regenerated after each story implementation before the comparison sub-sub-agent is launched.

**Storage:** `agent/reference-stories/mirror-css/{component}-{story}.css`, git-tracked. These files are overwritten on each iteration; the history is useful for comparing what changed between iterations.

**Proof-of-concept test (browser console):**
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
Run on a Storybook story, paste the clipboard into a file, verify Bootstrap rules for the component are present. Note: this console test does not capture pseudo-element rules — that requires the CDP approach.

**Remaining options (not pursued):**

- **A — Full compiled CSS** (`node_modules/bootstrap/dist/css/bootstrap.css`): ~12k lines; viable as a fallback while the script is being built.
- **B — SCSS source files**: requires chasing `$variables`, `@mixins`, dependencies; too error-prone.
- **D — Manually curated per-component CSS**: no tooling required but becomes stale; superseded by Option C.

**Status:** Decided — pending script implementation.

---

## Alternatives Under Consideration

### Alt A — Cycle-as-you-go (vs. complete-then-cycle)

Instead of implementing all stories before cycling, the sub-agent cycles after each story implementation.

```
for each story:
  implement
  launch sub-sub-agent (background)
  read findings from previous story (if any)
  rework if Fail
  re-launch sub-sub-agent if reworked
```

- **Advantage:** A fix for story N can preempt the same failure in story N+1.
- **Disadvantage:** Sub-sub-agents for later stories start later; less parallelism overall. Implementation is also harder to reason about — the loop mixes first-pass work with rework.
- **Current lean:** Complete-then-cycle. Preemption benefit is speculative; parallelism loss is concrete.

### Alt B — Batched wait (hybrid)

Implement all stories, launch all sub-sub-agents, then wait for all to complete before starting any rework pass.

- **Advantage:** Maximum initial parallelism; clean separation between implementation and rework phases.
- **Disadvantage:** If one sub-sub-agent hangs, the entire batch waits. Also, no opportunity to start easy rework while harder stories are still running.
- **Current lean:** Polling loop is more resilient; not pursuing this.

### Alt C — Prioritized cycling (by Diff%)

When cycling, tackle highest-Diff% stories first rather than sequential order.

- **Advantage:** Fastest overall improvement if some stories are far off.
- **Disadvantage:** Added complexity; likely premature optimization.
- **Current lean:** Sequential order for now; revisit if stories vary wildly in difficulty.

---

## Known Risks and Vulnerabilities

### Shared-selector regressions
A CSS fix for story N may introduce a regression in story M. The cycling loop flags and rechecks when shared selectors are modified, and the final verification sweep provides a safety net. Risk is residual if the sub-agent fails to detect a shared selector change — mitigated by making the work log's "CSS changes made" entry mandatory.

### Sub-sub-agent write conflicts on component findings doc
The component-wide findings doc (`{component}-findings.md`) is written by the sub-agent, not sub-sub-agents. Sub-sub-agents write only to their own story findings doc. No write conflicts expected at this tier.

Story findings docs (`{component}-{story}-findings.md`) are written by a single sub-sub-agent per story at a time. No conflicts expected here either, as long as the sub-agent does not re-launch a sub-sub-agent for a story while a previous one is still running.

### Polling loop termination
The polling loop must terminate even if all stories are stuck `In review` indefinitely (e.g. a sub-sub-agent silently fails). Should include a maximum-iterations guard or timeout.

### Context exhaustion in component sub-agent
A sub-agent handling 5+ stories with multiple rework cycles accumulates significant context. The component-wide findings doc partially mitigates this by providing a structured summary the sub-agent can re-read rather than reconstructing from memory. If context runs short, the sub-agent should produce a handoff and stop (per the standard guideline).

### Bootstrap CSS gap (script not yet implemented)
The `extract-story-css.mjs` script does not exist yet. Until it does, sub-sub-agents should receive the full `node_modules/bootstrap/dist/css/bootstrap.css` as a fallback. Switch to the matched CSS file once the script is implemented.
