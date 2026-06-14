---
title: Experiments
---

# Experiments

## Branch Setup: Stubbing this file

When creating a new experiment integration branch, the first commit must stub out this file to prevent its status summaries from leaking context into the experiment. Replace the entire content below the frontmatter with:

```markdown
---
title: Experiments (STUB — experiment branch)
---

# Experiments

**This file is intentionally stubbed on experiment integration branches.**

Reading the full experiment registry during an experiment run could leak context about other experiments and their findings. The real content lives on `main`.
```

Commit message: `chore: stub experiments.md for experiment isolation`

---

## Experiment Outputs

A catalog of skills and knowledge assets produced by experiments, with their canonical locations. These assets live on their experiment's integration branch — they have not been merged to `main`.

| Asset | Type | Branch | Path |
|---|---|---|---|
| Bootstrap Mapping Skill | Skill (methodology) | `bootstrap-mapping` | `agent/bootstrap-mapping-skill.md` |
| Bootstrap Knowledge Base | Knowledge (reference) | `bootstrap-mapping` | `agent/bootstrap-kb/` |
| Bootstrap ↔ React Aria Mapping Table | Knowledge (reference) | `bootstrap-mapping` | `agent/mapping-table.md` |
| React Aria + Bootstrap Skill | Skill (methodology) | `styling-skill` | `agent/react-aria-skill.md` |

**Usage note:** The Bootstrap Mapping Skill is only relevant when generating or extending the mapping table. For styling work, load the React Aria + Bootstrap Skill, the mapping table, and the Bootstrap KB directly.

---

## bootstrap-mapping — Bootstrap ↔ React Aria Mapping Table

**Integration branch:** `bootstrap-mapping`
**Goal:** Build a structured Bootstrap knowledge base and a Bootstrap ↔ React Aria mapping table as a pre-iteration research phase. No code changes — output is documentation only. The approved mapping table feeds into subsequent styling iterations as an additional input alongside `react-aria-skill.md`.
**Status:** Provisionally complete — 3 iterations, 7-component batch. Assets are ready for downstream use. A second run for additional components is anticipated.

### **What Was Produced**

| Asset | Location | Description |
|---|---|---|
| Skill | `agent/bootstrap-mapping-skill.md` | Methodology for mapping React Aria components to Bootstrap equivalents (M001–M017 + Self-Review Checklist) |
| Bootstrap KB | `agent/bootstrap-kb/` | Five reference files: tokens, utilities, states, components, DOM conflict patterns |
| Mapping table | `agent/mapping-table.md` | Approved Bootstrap ↔ React Aria mappings for all 7 test components |

The mapping table covers: sub-part ↔ Bootstrap class pairings, applicable Bootstrap tokens, state bridges with strategies, DOM conflicts and resolutions, and resolved design decisions.

### **Key Findings**

- M016 (four trigger patterns for "decisions needed" flags) and M007 (pseudo-class selector audit) both validated cleanly across all 7 components in iteration 3
- INERT pattern (Bootstrap class-based states + native CSS pseudo-classes) is highly consistent across components
- `bootstrap-mapping-skill.md` is only needed when generating the mapping table — it is not an input for styling work; the mapping table itself is the relevant output for downstream phases

### **Planned Asset Location**

Skills and knowledge-base artifacts are planned to move to a shared structure on `main` for use across experiments:

```
agent/skills/       ← methodology skill files
agent/knowledge/    ← Bootstrap KB and mapping table
```

---

## styling-skill — Bootstrap × React Aria

**Integration branch:** `styling-skill`
**Iteration branches:** `styling-skill_0` through `styling-skill_4`
**Goal:** Develop a reusable agent skill for Bootstrap-styling React Aria component libraries through iterative agent runs and debriefs.
**Status:** Superseded by `styling-skill-plus`. Work suspended at iteration 4 debrief (~halfway complete). The `react-aria-skill.md` state on this branch (P001–P044) carries forward to `styling-skill-plus`.

### **What Was Built**

A growing principles-based skill (`agent/react-aria-skill.md`) for Bootstrap-styling React Aria component libraries. Covers compound selectors, state bridging via `data-*` attributes, Bootstrap structural conflict patterns, SCSS bridge techniques, and component-specific gotchas. 4 iterations brought the agent's output quality from 2/5 → 3.5/5.

### **Where Work Was Suspended (Iteration 4 Debrief)**

5 of 12 debrief proposals were reviewed and committed before work moved to `styling-skill-plus`. The 7 unreviewed proposals remain on `styling-skill_4`. If the iteration 4 debrief is resumed, continue from `agent/review-iteration-4.md` § Debrief Decisions, item 1 (selected-uses-primary).

### **Key Files**

- `agent/react-aria-skill.md` — the accumulated skill; primary output of the experiment
- `agent/review-iteration-4.md` — iteration 4 review and partial debrief
- `agent/iteration-protocol.md` — prescribed workflow for running an iteration
- `agent/todos.md` — open process questions and unresolved items

---

## styling-skill-plus — Bootstrap × React Aria (augmented inputs)

**Integration branch:** `styling-skill-plus`
**Iteration branches:** `styling-skill-plus_0`, `styling-skill-plus_1`, …
**Goal:** Continue the Bootstrap × React Aria styling skill experiment with the full set of available knowledge inputs: `react-aria-skill.md` (P001–P044, inherited from `styling-skill`), the Bootstrap Knowledge Base (`agent/bootstrap-kb/`), and the approved mapping table (`agent/mapping-table.md`).
**Status:** Iteration 0 complete; debrief in progress on `styling-skill-plus_0`.

### **Rationale for a New Branch**

`styling-skill` reached iteration 4 with only `react-aria-skill.md` as agent input. Introducing the Bootstrap KB and mapping table is a significant enough workflow change to warrant a clean validation from iteration_0 rather than continuing mid-stream. Starting fresh also establishes a new quality baseline that isolates the contribution of the new assets.

### **How Agent Instruction Works**

Three inputs, three roles:

| Asset | Role | Load timing |
|---|---|---|
| `react-aria-skill.md` | Methodology — principles for bridging React Aria to Bootstrap | Always, at session start |
| `agent/mapping-table.md` | Approved per-component mappings (authoritative) | Load fully at session start |
| `agent/bootstrap-kb/` | Reference — Bootstrap tokens, states, DOM patterns | Selectively per component; navigate via `README.md` |

**Key instruction principle:** Mapping table entries are authoritative — the agent must treat them as decisions already made, not starting points for re-derivation. The KB is a lookup resource, not a discovery exercise.

### **Iteration 0 Findings**

**Rating: 3.75/5** (up from 3.5/5 at end of `styling-skill`). Incremental improvement attributed to the addition of the mapping table and Bootstrap KB as inputs.

**What worked:** All 7 components styled and building. 39 stories registered. Bridge rules written for all components. P-ID citation in the review doc was more disciplined than prior series.

**Key failures:**
- Mapping table was referenced but misread in places: Tabs default variant was prescribed as `nav-underline` in both the Variants table and the Resolved Decisions section; the agent implemented `nav-tabs` as default
- ListBox multi-select indicator: mapping table prescribed `div.indicator` (Checkbox pattern) for `selectionMode="multiple"`; agent used check icon for all modes
- Calendar: zero mapping table citations in the review doc — no evidence the mapping table was consulted for this component

**Root cause diagnosis:** The mapping table's highest-signal sections (Sub-parts at the top, Decisions Needed/Resolved at the bottom) are at opposite ends of each component entry, separated by dense tables. Decisions buried in Notes columns are easy to misread. The agent absorbs the top of each entry but fades before reaching Resolved Decisions.

**Proposed fix (not yet implemented):** Add a compact "Implementation spec" block at the top of each component section — terse numbered directives — with supporting tables as reference below.

**Debrief status:** Partially complete. Two component observations recorded (Tabs, ListBox). Remaining components (Button, TextField, Checkbox, Select, Calendar) not yet reviewed. `react-aria-skill.md`, `component-decisions.md`, and `CLAUDE.md` iteration counter not yet updated. Work paused to explore the reference story taxonomy experiment below.

---

## reference-stories — Sub-part Bootstrap Reference Story Taxonomy

**Integration branch:** `reference-stories` (suggested: cut from `styling-skill-plus`)
**Goal:** Design and validate a sub-part-level Bootstrap Reference story format to replace the current whole-component reference stories. The output is a taxonomy protocol and a set of implemented reference stories for a reduced component set, plus updated `iteration-protocol.md` instructions.
**Status:** Not started — proposed.

### **Motivation**

The `styling-skill-plus` iteration 0 debrief identified that the mapping table is not being absorbed reliably. A secondary signal is that the whole-component Bootstrap Reference stories (one story per component) are too coarse for visual comparison — the agent cannot easily isolate a specific sub-part's state against the reference.

The proposed fix: during the mapping phase, the agent creates one Storybook story per substantive sub-part (e.g. `Bootstrap Reference/ListBox/ListBoxItem`), showing all relevant states and variants as labeled specimens in a single canvas-grid layout. This converts the mapping review step from table-reading to visual inspection, and provides targeted per-sub-part references for the visual comparison pass at the end of a styling iteration.

### **Proposed Component Set**

A reduced set of 3 components covering the full range of sub-part complexity:

| Component | Why |
|---|---|
| **Button** | Simple 1:1 baseline — 1 sub-part, clear state set |
| **ListBox** | High complexity — multiple sub-parts, selectionMode dimension, virtual focus, no-Bootstrap-counterpart states |
| **Select** | Composite mapping — sub-parts spread across multiple Bootstrap components; multi-select indicator |

### **Proposed Output**

1. Sub-part taxonomy documents for each of the 3 components (specimen lists, canvas layout notes, Bootstrap class and counterpart annotations)
2. Implemented reference stories in `stories/bootstrap-test/` for all sub-parts in the 3-component set
3. Updated `agent/iteration-protocol.md` — expanded mapping phase instructions covering sub-part story construction rules
4. Optionally: "Implementation spec" block format added to mapping table entries

### **ListBox Taxonomy (drafted in `styling-skill-plus_0` debrief)**

A full sub-part taxonomy for ListBox was drafted during the iteration 0 debrief. It covers 5 stories (Root, ListBoxItem, Section + Header, SelectionIndicator, ListBoxLoadMoreItem) with specimen lists, canvas layout recommendations, and notable caveats (virtual focus, selectionMode="none" indent, `[data-focused]` vs `[data-focus-visible]` overlap). This draft is the starting point for the reference-stories experiment and should be written to a taxonomy doc on the new branch.

**Key caveats from the ListBox taxonomy:**
- Virtual focus (roving tabindex): `:focus` and `:focus-visible` may not fire on individual items; compound selector bridges likely needed
- `selectionMode` is not in `ListBoxItemRenderProps` — conditional indicator rendering requires a prop or context solution
- `[data-focused]` and `[data-focus-visible]` may be visually identical in Bootstrap's model for list items; worth confirming in a browser before finalizing

---

## mapping-and-references — Consolidated Taxonomy and Reference Stories

**Integration branch:** `mapping-and-references`
**Experiment branches:** `mapping-and-references_0`, `mapping-and-references_1`, …
**Goal:** Test the outcome of consolidating taxonomy formation, Bootstrap↔React Aria state mapping, and reference story production into a single workflow stage. The agent produces taxonomy, bridge strategy, DOM conflict analysis, and reference story specimens for each component in one pass — rather than as separate deliverables. The mapping table as a standalone artifact is retired; its highest-value content (bridge strategy classification, DOM conflict analysis) moves into the taxonomy document.
**Status:** Iteration 0 complete — Button, ListBox, Select, Calendar, Tabs. All assets merged to integration branch.

### **What Is Changing**

The prior workflow separated (a) Bootstrap↔React Aria mapping (`bootstrap-mapping` branch) from (b) reference story production (`reference-stories` branch). The new consolidated workflow produces both in a single pass, organized per component. The mapping table as a standalone artifact is retired.

### **Inputs**

| Asset | Role |
|---|---|
| `agent/mapping-and-references-skill.md` | Methodology — sub-part identification, state mapping, bridge strategy, variants, decisions needed, reference story construction |
| `agent/bootstrap-kb/` | Reference — Bootstrap tokens, states, DOM patterns; load selectively per component |

### **Key Decisions**

- `agent/mapping-table.md` deleted on this branch — not carried forward
- `agent/reference-stories-skill.md` renamed to `agent/mapping-and-references-skill.md`
- M-codes (from `bootstrap-mapping`) and P-codes (from `reference-stories`) merged into a single unified skill document
- M013 (icons/indicators) excluded from skill — styling-phase concern, not taxonomy-phase
- Prior resolved component decisions (Tabs, Calendar, multi-select indicator, Select trigger) excluded from skill — belong in per-component taxonomy docs when those components are worked, not as standing directives

### **Iteration 0 Outputs**

| Asset | Location | Description |
|---|---|---|
| Taxonomy files | `agent/reference-stories/` | Per-component: sub-parts, state mappings, bridge strategy, DOM conflicts, variants, decisions needed |
| Reference stories | `stories/bootstrap-test/bootstrap-reference/` | Pure Bootstrap HTML specimens — visual targets for the styling phase |
| Component decisions | `agent/component-decisions.md` | Resolved design forks for Button, ListBox, Select, Calendar, Tabs |
| Skill doc | `agent/mapping-and-references-skill.md` | M001–M017 methodology principles + P-S001–P-S005 story construction principles |

---

## styling-implementation — Bootstrap-Styled React Aria Components

**Integration branch:** `styling-implementation` (cut from `mapping-and-references`)
**Experiment branches:** `styling-implementation_0`, `styling-implementation_1`, …
**Goal:** Implement Bootstrap-styled React Aria TSX + CSS components that match the visual targets produced by the mapping-and-references experiment. Visual regression (Loki or Playwright fallback) verifies the styled output against reference story screenshots before human review.
**Status:** In progress — setup phase. Protocol drafted; Loki compatibility unverified.

### **What Is Changing**

The mapping-and-references experiment produced taxonomy documents and Bootstrap reference stories as visual targets. This experiment implements the actual styled components and validates them via screenshot diffing rather than manual visual inspection.

### **Inputs**

| Asset | Role |
|---|---|
| `agent/react-aria-skill.md` | Methodology — styling principles (P001+); primary reference |
| `agent/component-decisions.md` | Resolved design decisions per component; treated as authoritative |
| `agent/reference-stories/{component}-taxonomy.md` | Sub-parts, state mappings, bridge strategy |
| `agent/bootstrap-kb/` | Bootstrap tokens, states, DOM patterns; load selectively |

### **Key Design Decisions**

- Visual regression tool: Loki (preferred) or Playwright + pixelmatch fallback, pending Storybook 9 compatibility check
- Diff classification rules deferred to iteration 0 debrief
- Protocol document: `agent/styling-implementation-protocol.md` (on integration branch)

### **Iteration 0 Scope**

Button (simple) + Select (complex) — brackets the difficulty range to validate the protocol end-to-end before expanding to the full component set.

---

## sub-agent-styling — Multi-Agent Batch Styling

**Integration branch:** `sub-agent-styling` (cut from `styling-implementation`)
**Experiment branches:** `sub-agent-styling_0`, `sub-agent-styling_1`, …
**Goal:** Validate a three-tier agent hierarchy for styling multiple components in a single batch: a primary orchestrator dispatches component sub-agents, each of which dispatches comparison sub-sub-agents. Primary agent context is conserved by delegating both implementation and visual diff interpretation to sub-agents.
**Status:** Not started — blocked on prerequisite. Resume after the single-component comparison workflow is validated on `styling-implementation_2` (Select). Multi-agent workflow draft is stashed on the `sub-agent-styling` branch pending review.

### **Motivation**

The `styling-implementation` experiment established the per-component workflow and visual comparison tooling. Running 5 components per batch quickly exhausts the primary agent's context window. This experiment tests whether a three-tier orchestration model can extend the effective batch size without loss of quality.

### **Architecture**

```
Primary (orchestrator) → Component sub-agents (one per component) → Comparison sub-sub-agents (one per story)
```

Key design decisions:
- Component sub-agents are fully self-contained — each receives skill doc, taxonomy, and decisions in its prompt
- Comparison sub-sub-agents run pixel diff, inspect diffs visually, validate CSS theories, and return structured findings
- Per-component findings docs (`agent/{component}-findings.md`) relay comparison results — no shared state between components
- Component sub-agents operate a story-level pipeline: implement story N, launch comparison (background), implement story N+1 in parallel
- Cross-component context is replaced by explicit doc passing; cross-cutting patterns are mapped in prior stages and need not carry across components at implementation time

### **Prerequisite**

The basic comparison workflow (Playwright + pixelmatch + diff interpretation) must be validated on a single component first. This validation occurs on `styling-implementation_2` (Select). Do not start `sub-agent-styling` until that validation is complete.

### **Key Risk**

The "spinning plates" orchestration pattern is unproven. If sub-agent coordination proves unreliable (missed notifications, context overflows, inconsistent findings format), the approach may need to fall back to sequential per-component processing with only the comparison step delegated.

---

## react-aria-skill-refactor — Multi-Agent Skill Restructure

**Integration branch:** `react-aria-skill-refactor` (cut from `sub-agent-styling`)
**Goal:** Restructure `agent/react-aria-skill.md` from a 758-line monolith into a per-tier skill directory that structurally enforces agent role boundaries. The current multi-agent workflow fails because agents at each tier take on work intended for the tier below; diagnosis points to both structural causes (every agent reads every tier's instructions) and behavioral causes (prohibition-based role contracts lose to task completion bias).
**Status:** In progress — plan complete, implementation pending.
**Planning doc:** `agent/react-aria-skill-refactor-plan.md` (on this branch)

### **Motivation**

`sub-agent-styling` established a three-tier agent hierarchy (orchestrator → component sub-agent → comparison sub-sub-agent) to manage context window constraints when styling multiple components in a batch. In practice, agents at each tier consistently bypass delegation and perform the sub-tier's work directly. Three root causes:

1. **Monolithic file** — reading the skill gives every agent execution context for every tier, making it trivial to rationalize crossing the boundary
2. **Prohibition-based contracts** — "you must not do X" loses to task completion bias; success conditions ("your task is complete when you have dispatched…") are more durable
3. **No planning gate** — the orchestrator can begin executing immediately; a required delegation manifest forces the reasoning layer to make delegation decisions explicit before the completion drive engages

### **Target Structure**

```
agent/react-aria-skill/
  SKILL.md               # Entry point: tier map, session start, escalation protocol
  workflow.md            # Branch lifecycle: phases 1-3, debrief, merge
  orchestrator.md        # Primary agent: job contract, planning gate, loop
  component-agent.md     # Component sub-agent: job contract, pipeline, cycling loop
  comparison-agent.md    # Comparison sub-sub-agent: diff protocol, output
  final-stories-agent.md # Final stories sub-agent: contract, inputs
  principles.md          # P001-P049 reference — loaded selectively by component agents only
```

Each tier file is loaded only by that tier. The primary agent reads `SKILL.md` + `orchestrator.md` and never sees `comparison-agent.md` or `principles.md` — it structurally lacks the execution knowledge to rationalize crossing the boundary.

### **Key Design Decisions**

- Role contracts reframed as success conditions, not prohibitions
- Orchestrator requires a delegation manifest before any agent launch
- `principles.md` loaded only by component agents (not orchestrator, comparison, or final-stories agents)
- `CLAUDE.md` session start instruction updated to reference new entry point
- Substance of P001-P049, terminal phrase protocol, cycling loop, and findings doc formats unchanged

---

## flatten-multi-agent-workflow — Flattened Two-Tier Agent Dispatch

**Integration branch:** `flatten-multi-agent-workflow` (cut from `react-aria-skill-refactor`)
**Goal:** Redesign the multi-agent skill to eliminate the three-tier dispatch hierarchy, which is architecturally impossible in Claude Code: sub-agents cannot spawn sub-sub-agents (the Agent/Task tool is absent from the sub-agent tool roster; see [GitHub #4182](https://github.com/anthropics/claude-code/issues/4182)). Two iterations of `react-aria-skill-refactor` failed because Tier 1 component agents cannot dispatch Tier 2 comparison agents.
**Status:** Not started — planning complete, implementation pending.

### **Root Cause**

The `react-aria-skill-refactor` skill assumed:

```
Tier 0 (Orchestrator) → dispatches → Tier 1 (Component Agent) → dispatches → Tier 2 (Comparison Agent)
```

Tier 1 dispatching Tier 2 is impossible. Iteration 2's Tier 1 agent correctly diagnosed the limitation, found no defined escalation path, and rationalized running the comparison script itself — then spoofed agent IDs to bypass a same-ID safeguard added to `compare-stories.mjs`.

### **Redesign: Flattened Two-Tier Hierarchy**

```
Tier 0 (Orchestrator)
  ├── dispatches → Tier 1 (Implementation Agent) — TSX, SCSS, stories only; exits with `implementation-done`
  └── dispatches → Tier 2 (Comparison Agent) — pixel diff, findings; dispatched by orchestrator, not Tier 1
```

The orchestrator owns the full cycling loop: dispatch Tier 1, receive `implementation-done`, dispatch Tier 2, receive `findings-written`, read findings, re-dispatch Tier 1 for rework if needed.

### **Key Changes Required**

| File | Change |
|------|--------|
| `SKILL.md` | Update tier map; add `implementation-done` terminal phrase; remove Tier 1→Tier 2 dispatch references |
| `orchestrator.md` | Rewrite cycling loop to dispatch Tier 2 directly after `implementation-done` |
| `component-agent.md` | Remove all comparison-related instructions; agent exits after stories are written |
| `comparison-agent.md` | Update dispatch context (sent by orchestrator, not component agent) |
| `workflow.md` | Update Phase 2 to reflect flattened dispatch |
| `.claude/settings.json` | Move `Bash(node scripts/compare-stories.mjs *)` from allowlist to denylist — physically blocks Tier 1 regardless of motivation |

---

## single-threaded-workflow — Single-Agent Full-Lifecycle Styling

**Integration branch:** `single-threaded-workflow` (cut from `react-aria-skill-refactor`)
**Goal:** Explicitly eliminate Tier 2 (comparison agents) in favour of a single component agent that owns the full lifecycle — implementation, pixel diff, self-correction, and completion signal — without delegation.
**Status:** Not started — branch created, prerequisite fixes ported.

### **Motivation**

Post-mortem analysis of `flatten-multi-agent-workflow` against `react-aria-skill-refactor` session logs revealed that Tier 2 was both inefficient and quality-degrading:

- **Inefficient:** 17 fresh comparison agents in a single Select session consumed ~200,000 tokens in startup overhead alone (17 × 11,821 baseline). Total messages: ~1,444 (299 Tier 1 + 1,145 Tier 2) vs. ~633 for the equivalent `react-aria-skill-refactor` session.
- **Quality-degrading:** Tier 2 broke the feedback loop. In `react-aria-skill-refactor`, Tier 1 ran compare-stories.mjs directly and self-corrected while holding full implementation context. In `flatten-multi-agent-workflow`, results arrived via a findings doc read cold — the agent had to reconstruct implementation reasoning before acting on each theory. Stories that previously converged in one external iteration required 3–4 iterations to reach the same result.
- **Context pressure was not the actual risk:** The `react-aria-skill-refactor` Tier 1 agents ran 300–490+ message sessions and produced better results, not worse. The `flatten` Tier 1 ended at 77% context fill (154,524 / 200,000 tokens) — well within limits and shorter than the prior experiment's sessions.

### **Design**

No orchestrator cycling loop. No comparison agents. The component agent:
1. Implements TSX and bridge CSS for all stories
2. Runs `compare-stories.mjs` directly after each round of changes
3. Reads diff images, self-corrects, re-runs until all stories pass
4. Signals done

The skill directory structure (`agent/react-aria-skill/`) from `react-aria-skill-refactor` is retained; `comparison-agent.md` and orchestrator cycling-loop instructions are retired or stripped.

### **Key Risk**

Context exhaustion for components with many stories and many fix cycles. Mitigation path (in order, if needed): (1) enhance `compare-stories.mjs` to output a structured text report so agents read text instead of images (~45× cheaper per pass); (2) story-by-story session segmentation with handoff notes for components exceeding safe context limits.

### **Offshoot: TextField Reference Stories**

While `single-threaded-workflow` was active, TextField reference stories were produced on a short-lived `add-text-field` branch cut from `single-threaded-workflow` and merged back. This extended the `mapping-and-references` taxonomy workflow (Part 6, P-S006) to a sixth component.

- **Branch:** `add-text-field` (merged and deleted)
- **Output:** 6 stories in `stories/bootstrap-test/bootstrap-reference/TextField/`; 6 extracted CSS files in `agent/reference-stories/reference-css/`; faux state classes added to `augments.scss`
- **Process note:** The Part 6 skill executed seamlessly — no deviations, no follow-up notes from the reviewer.

### **Iteration 1 Results (Select only — TextField not reached)**

Iteration 1 produced poor results — the worst of any experiment to date.

- **4 of 5 Select stories stuck** (trigger-states, open-dropdown, invalid-state, full-field). Reported root cause: `<button>` vs. native `<select>` subpixel rendering difference (~2px vertical offset). Whether this is a genuine dead end or a premature stuck declaration is unresolved.
- **Context compaction occurred** — first time in any experiment. Root cause: agent over-iterated on stuck stories (6 pixel diff cycles for trigger-states vs. the 3-cycle stuck threshold), and findings doc writes were batched at end of session rather than per-iteration.
- **Findings docs were created** (a first) but contained no iteration log entries — the agent wrote once at the end rather than incrementally.
- **Workflow gaps identified:** (1) component-agent.md does not direct agents to compare reference-css vs. mirror-css as the primary stuck-story diagnostic; (2) no explicit instruction to write findings doc entries after each fix loop cycle.

Best results to date were produced by `react-aria-skill-refactor` — the multi-agent aspect was broken (Tier 1 could not dispatch Tier 2), but the single Tier 1 component agent running the full lifecycle produced higher-quality output than any subsequent experiment. The quality regression in later experiments is attributable to workflow complexity, not model capability.

Work paused. A new `end-to-end-workflow` experiment branch is being cut to rethink the full workflow from scratch.

---

## end-to-end-workflow — Full End-to-End Workflow Standardization

**Integration branch:** `end-to-end-workflow` (cut from `single-threaded-workflow`)
**Goal:** Bring together and standardize all stages of the full workflow — from Bootstrap knowledge base creation, through component taxonomies and reference stories, through mirror stories, and ultimately to the end product of styled React Aria components. Every stage should have clear inputs, outputs, and agent instructions; no stage should require improvisation or leave gaps that drive agents toward out-of-scope resources.
**Status:** Not started — branch created.
