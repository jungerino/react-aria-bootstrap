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
├── Dispatches component sub-agents — one per component (staggered)
└── Receives final status per component; compiles batch report

Component sub-agent (one per component)
├── Reads: skill doc, component taxonomy (incl. Decisions section), Bootstrap KB
├── Implements each mirror story
├── Maintains component-wide findings doc: agent/reference-stories/{component}-findings.md
├── Dispatches comparison sub-sub-agents (background, one per story)
├── Cycles through story findings docs until all Pass or any Stuck
└── Alerts user on Stuck; reports completion to primary on all-Pass

Comparison sub-sub-agent (fire-and-forget)
├── Runs pixel diff (Playwright + pixelmatch)
├── Reads all three output images (reference, implementation, diff)
├── Identifies failing specimens and sub-parts using the taxonomy
├── Develops and validates a CSS theory
└── Writes findings to story findings doc; retires
```

---

## Primary Agent (Orchestrator)

Stagger component sub-agents: dispatch the next after the previous one has started its first comparison. Avoids resource contention and keeps coordination state simple.

Each sub-agent prompt must be fully self-contained — see Sub-Agent Inputs below.

While sub-agents are running, if any remaining implementation work exists in the current queue, proceed with it. Otherwise: "Awaiting sub-agent results."

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
2. Create the story findings doc at `agent/reference-stories/{component}-{story}-findings.md` with front matter:
   - `Status: In review`
   - `Iteration: 0`
   - `Stuck: 0`
3. Launch a comparison sub-sub-agent (`run_in_background: true`)
4. Proceed to the next mirror story without waiting

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
    if Status == Stuck: STOP — alert user
    if Status == Fail:
      read story findings doc
      rework CSS per findings
      update story front matter: Status = In review
      update component findings doc (registry + work log)
      re-launch sub-sub-agent (background)
      re-check CSS change scope — if shared selector modified:
        flag affected stories; relaunch their sub-sub-agents too
  if all Pass: proceed to Final Verification
  if any Stuck: stop
  // else: some still In review — loop again (sub-sub-agents are running)
```

**On notification vs. polling:** The cycling loop above is polling-based — the sub-agent loops and reads findings docs directly, requiring no completion callbacks from sub-sub-agents. This is simpler to reason about and avoids the need for an explicit notification mechanism. Trade-off: slightly less responsive than a notification-driven approach if there are long gaps between sub-sub-agent completions. Given the loop is reading small files, polling cost is negligible.

---

## Final Verification Sweep

After all stories have reached `Status = Pass`, run one final round of sub-sub-agent comparisons across all stories. Rationale: fixing story N may have introduced a regression in story M via a shared selector, and the cycling loop only rechecks stories when the sub-agent knows a shared selector was modified. The final sweep catches anything that slipped through.

**Open question:** Should the final sweep use the same pass/fail threshold (0.5%), or a tighter threshold to catch subtle regressions? Current thinking: same threshold for consistency.

---

## Final Story Implementations

After all mirror stories pass the final verification sweep, the component sub-agent writes the final styled stories. These are the actual end product — the production-ready Bootstrap-themed stories that will ship with the component library.

Mirror stories exist only to drive comparison; final stories are what users and consumers see. Because every sub-part, state, and variant has been validated through the mirror story process by this point, final story implementation should be straightforward and low-error: apply the same CSS that made the mirror stories pass, construct the story files to the standard conventions, no comparison step needed.

**Context window consideration:** Whether the final story step is handled by the same component sub-agent or handed off to a fresh agent depends on how much context headroom remains after the mirror story cycle. If context is running low, the sub-agent should produce a handoff and stop rather than attempting final stories in a degraded state. The primary orchestrator is responsible for deciding whether to dispatch a new agent for this step.

---

## Sub-Sub-Agent

### Inputs

- Mirror story URL: `?path=/story/bootstrap-test-mirror-{component}--{story}`
- Reference story URL: `?path=/story/bootstrap-reference-{component}--{story}`
- Story findings doc path: `agent/reference-stories/{component}-{story}-findings.md`
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md`
- Component mirror stories TSX: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Bootstrap overrides: `src/scss/_bootstrap-overrides.scss`
- Bootstrap CSS source: **see Open Decision #2**

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

The sub-sub-agent needs a source of truth for Bootstrap's rendered rules to develop and validate theories about why a diff failed. `_bootstrap-overrides.scss` is always included (small, targeted). The question is what Bootstrap CSS to add.

**Options:**

**A — Full compiled CSS** (`node_modules/bootstrap/dist/css/bootstrap.css`)
- Pro: Complete, accurate, no dependency chasing
- Con: ~12k lines; agent reads far more than it needs; context cost

**B — SCSS source files** (e.g. `src/scss/vendor/bootstrap-5.3.8/_dropdown.scss`)
- Pro: More targeted per component; human-readable intent
- Con: Requires chasing `$variables`, `--props`, `@mixins`, dependencies; error-prone; increases agent load significantly

**C — Pre-filtered per-component CSS** (generated by a script)
- Pro: Only the rules that actually match the rendered story DOM; ideal context size
- Con: Requires tooling to create. But: Playwright already renders the story for the screenshot; the same browser session could extract applied CSS via DevTools Protocol (e.g. `CSS.getMatchedStylesForNode`). Could be integrated into `compare-stories.mjs`.

**D — Pre-filtered per-component CSS (static, manually curated)**
- Pro: No tooling required; can be done incrementally per component
- Con: Manual effort; may become stale

**Current lean:** Option C is the right long-term answer if feasible — it produces the most relevant input at the lowest context cost, and Playwright's browser session is already open during comparison. Worth scoping before committing.

**Status:** Open.

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

### Bootstrap CSS gap (pending Open Decision #2)
Until a CSS filtering strategy is decided, sub-sub-agents may miss relevant Bootstrap rules or produce inaccurate theories. Proceeding with full `bootstrap.css` as a temporary measure is reasonable for initial validation; switch to filtered CSS once tooling exists.
