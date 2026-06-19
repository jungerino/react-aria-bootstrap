# End-to-End Workflow Standardization — Plan Review Findings

Reviewed: `agent/notes/end-to-end-plan.md`
Cross-referenced: `iteration-protocol.md`, `mapping-and-references-skill.md`, `react-aria-skill/SKILL.md`, `react-aria-skill/component-agent.md`, `react-aria-skill/orchestrator.md`, `react-aria-skill/principles.md`

---

## Gaps

### G1. Implementation Tasks section is empty

The plan ends with `## Implementation Tasks — (Phase 3 — to be broken out into a separate plan after spec is approved)` with no content. This is noted as intentional, but several planned changes require code modifications (not just doc updates) that aren't captured anywhere in the existing Implementation Tasks or in the skill file changes lists:

- **`scripts/compare-stories.mjs` must be modified** to stop writing `reference.png`. The plan says this under Script Changes Required, but the change isn't in the Implementation Tasks list (which is where it would naturally be assigned to an agent).
- **`scripts/reference-images.mjs` is a new script** with only a one-line spec: "Accepts `--reference {story-id}` and `--out {path}`. Screenshots the named reference story." An implementing agent needs more to go on: what library (Playwright?), what the output format is, whether it uses the same browser setup as `compare-stories.mjs`, how it handles Storybook readiness.

These need to be captured before Phase 3 starts.

### G2. `agent/taxonomies/` directory has no creation owner

Stage 2 creates `stories/react-aria-bootstrap/reference/`, `stories/react-aria-bootstrap/mirror/`, etc. — but `agent/taxonomies/` (the output directory for Stage 4) is never assigned a creation step. It first appears as Stage 4's output path. An implementing agent may create it implicitly, but the spec doesn't assign responsibility.

### G3. Stage 4 spawn prompt is too minimal for a cold-start agent

The Stage 4 component sub-agent dispatch prompt is:

```
Component: {ComponentName}

Load and follow agent/mapping-and-references-skill.md.
```

Compare to Stage 5's dispatch prompt, which includes session-start file loading order, a key paths table, a reference inputs table, and the full terminal phrase list. The Stage 4 sub-agent handles a complex multi-phase workflow (React Aria MCP queries, KB loading, Q&A cycles, WebFetch for Bootstrap docs, reference story writing, CSS extraction) and needs equivalent scaffolding. A cold-start agent given only "load and follow the skill" is more likely to miss context, infer paths incorrectly, or drift from the protocol.

At minimum the prompt should include: the batch log path, taxonomy output path, reference story path, reference-css output path, `SendMessage` resumption expectation, and the terminal phrase list.

### G4. Stage 4 Phase A step numbering gap

Phase A is split across two sub-agent turns (before and after the user Q&A). The first turn ends at step 4; the second turn starts at step 6. Step 5 is absent. This looks like a renumbering oversight during editing. An implementing agent following the spec would notice the gap but have to guess what belongs there.

### G5. How the orchestrator polls Storybook's `index.json` is unspecified

The Stage 5 orchestrator pre-loop setup says: "wait for all stub story IDs to appear in index.json." No guidance is given on: what the endpoint URL is (`http://localhost:6006/index.json`? `/stories.json`?), what the polling interval should be, what the story ID format is in `index.json`, or how to derive a stub story's ID from its component name. An implementing agent would have to figure this out from the Storybook runtime behavior, which is non-obvious.

### G6. No fallback or recovery path for Tier 1a (Final Stories Agent)

The Stage 5 orchestrator loop shows: `on any other return from Tier 1a: → surface as Undefined return; stop`. The Tier 1a agent's only valid terminal phrase is `final-stories-done`. If the agent struggles (story format unfamiliar, unexpected prop surface, context compressed mid-task), there's no `Stuck`, `EXTRACTED-CSS-GAP`, or resume mechanism. The plan should define at minimum whether the user can manually re-dispatch Tier 1a, and whether the orchestrator resumes or restarts.

---

## Inconsistencies

### I1. Orchestrator boundary conflicts with pre-loop setup

`orchestrator.md` explicitly states: **"You do not read taxonomy files."** This is a hard boundary used to preserve scope discipline.

But the Stage 5 pre-loop setup requires the orchestrator to iterate "for each component in batch.md, **for each story in component's taxonomy**" to capture reference images. Reading story lists from taxonomy files is reading taxonomy files. The plan doesn't acknowledge this boundary relaxation or propose an alternative mechanism (e.g., the orchestrator could read the reference story file to infer story names, or a new story-list field could be added to `batch-{N}.md`).

Either the boundary is being relaxed (say so explicitly and update `orchestrator.md`) or an alternative story-source needs to be identified.

### I2. Part 5 (KB retrieval) removal would leave taxonomy agents without KB guidance

The Stage 4 skill changes say: "Remove KB retrieval section (Part 5 of current file) — that content moves to `bootstrap-kb-skill.md`."

From Q7, Part 5 currently contains: "M003 load sequence + query table" — i.e., the KB retrieval instructions used by the taxonomy agent during Phase A. `bootstrap-kb-skill.md` is described as a KB *generation* skill ("when to use: initial build / Bootstrap version upgrade"). If Part 5 moves there, the taxonomy agent (which loads only `mapping-and-references-skill.md`) loses all KB retrieval guidance, including the M003 load sequence.

Either Part 5 stays in `mapping-and-references-skill.md` (and the "remove" instruction is an error), or the taxonomy agent's session-start loading must be expanded to include `bootstrap-kb-skill.md`, or Part 5 is replaced with a forward reference. The plan needs to resolve this explicitly.

### I3. `Stuck` behavior changed but not flagged as a behavior change

The existing `SKILL.md` and `component-agent.md` have `Stuck: {story}` (single story, emitted immediately when a story hits the threshold, orchestrator stops). The plan changes this to `Stuck: {story1}, {story2}` — emitted only after ALL stories are attempted, with all stuck stories listed together.

This is a meaningful behavioral change: under the old protocol, the orchestrator stops as soon as one story is stuck. Under the new one, the agent continues through remaining stories and reports all stuck stories at the end. The plan describes the new behavior clearly in Stage 5 but doesn't frame this as a change from the current behavior. The skill file changes for `orchestrator.md` say to update the `Stuck` handling, but the component agent's fix loop description ("report `Stuck: {story}` to primary agent and stop") in `component-agent.md` would also need to change — and the fix loop description doesn't appear in the skill file changes list.

### I4. `M016` still references `agent/review-iteration-N.md`

`mapping-and-references-skill.md` M016 instructs the agent to write decisions to "`agent/review-iteration-N.md`." The plan renames this file to `agent/logs/batch-{N}.md` per Q6. The Stage 4 skill changes list says to update paths "per Q6" broadly, but M016's specific instruction to write to a review file isn't called out. An implementing agent doing the path update might miss this inline instruction in the M016 principle text.

### I5. `component-agent.md` Phase B / Final Verification Sweep describe `reference.png` inconsistently with the proposed script change

`component-agent.md` currently says: Phase B inception "generates `reference.png`, `implementation.png`, and `diff.png`" via `compare-stories.mjs`. The plan says the script will be changed to no longer write `reference.png` (reference images are captured beforehand by `reference-images.mjs`). The skill file changes for `component-agent.md` update the "read `reference.png`" instruction to say images come from the Preparation Phase — but the script's current output description in the existing doc and in any inline examples would also need updating. Some of the "Script failure" protocol text references a missing `reference.png` as a failure condition — that condition no longer applies under the new model.

---

## Under-specified

### U1. Storybook story ID format not documented for orchestrator or implementing agent

Several places use `"bootstrap-reference-{component}--{story-name}"` as a Storybook story ID (in `reference-images.mjs`, in `compare-stories.mjs`, in the terminal phrase examples). The format — title kebab-cased, double-dash before the story name — is Storybook's internal convention. The plan doesn't explain this convention, making it hard for an implementing agent to derive correct IDs from component/story names.

For example: a reference story with title `Bootstrap Reference/Button` and story name `Default States` becomes `bootstrap-reference-button--default-states`. But what if a story name has special characters? What if a component name is multi-word (`TagGroup`)? A brief ID-derivation rule would prevent script invocation errors.

### U2. The `@media` wrapper loss gap has no agent-facing guidance

Q8 documents a known gap: extracted CSS loses `@media` wrapper context for responsive rules. The plan says "an agent might find a rule in the extracted CSS without realising it only applies at a certain breakpoint." The `EXTRACTED-CSS-GAP` protocol exists for when agents need `bootstrap.css` access, but this gap is *silent* — an agent sees the rule without its `@media` context and doesn't know it's incomplete.

No guidance is given for proactively detecting this gap (e.g., "if you see a responsive modifier class in the taxonomy, treat the extracted CSS as potentially incomplete for breakpoint behavior"). Bootstrap's utility classes (`.col-sm-*`, `.d-md-*`) and responsive component variants are extensively `@media`-wrapped. The gap protocol only fires if the agent notices something is wrong.

### U3. Stage 3 / Stage 4 orchestrator relationship is undefined

Stage 4 specifies a "Tier 0 orchestrator" that manages the batch sequencing and Q&A relay. Stage 5 also specifies a "Tier 0 orchestrator." Are these the same agent session running across both stages, or separate agent sessions? The batch log format (`## Stage 4`, `## Stage 5`) suggests a single session spans both, but the plan never says so. The dispatch prompt templates in Stage 5 give specific reading instructions for the Stage 5 orchestrator; Stage 4's orchestrator has almost no spec. If they're the same session, the orchestrator's context window carries Stage 4's entire Q&A history into Stage 5.

### U4. Post-batch debrief and iteration-protocol alignment

The post-batch debrief says "follow `agent/iteration-protocol.md` for knowledge file updates, component work decision gate, and merge commands." `iteration-protocol.md` describes a branch-based lifecycle: `integration-batch-{N}` + `batch-{N}/stage-{M}/iter-{P}` branches, with file-by-file checkout merges.

It's unclear whether `iteration-protocol.md` is being updated as part of this work. If not, the implementing agent reading both documents will encounter a tension: this spec says the debrief follows iteration-protocol, but iteration-protocol talks about iteration branches and per-stage debriefs in a way that predates the end-to-end batch workflow.

### U5. Pre-loop stub mirror story references final story path, not mirror path

In the Stage 5 orchestrator pre-loop setup, the stub mirror story template uses `title: 'Bootstrap Mirror/{ComponentName}'` — correct. But the orchestrator loop also says "create `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx` stub." The current `orchestrator.md` (old) lists this under the `Key paths` table as `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`. The plan's changes for `orchestrator.md` say to add the pre-loop setup section — but it doesn't call out removing the old path entry from the dispatch prompt template. There may be leftover `bootstrap-test` references in `orchestrator.md` that conflict with the new paths.

### U6. Bridge CSS file for Stage 4 is not addressed

Stage 4 doesn't mention `src/scss/_bootstrap-bridges.scss` at all. But if reference stories use faux-state classes in `presentation.scss` (extending it as needed), do reference stories ever need bridge CSS? Probably not — reference stories use plain Bootstrap HTML. But the plan is silent on this, which could confuse an implementing agent trying to establish what files Stage 4 touches.

### U7. P-code promotion process in post-batch debrief

The debrief says "Patterns worth keeping become P-codes in `principles.md` at this step." `principles.md` has a specific numbered structure with a table of contents. The plan doesn't describe: who decides a pattern is worth promoting (user, orchestrator, or both?), what the next available P-code number is, or how to update the table of contents. This is minor but risks sloppy P-code additions during implementation.

---

## Questions

### Q-A. Single orchestrator across stages or separate sessions?

Does one orchestrator session manage both Stage 4 (taxonomy + reference stories) and Stage 5 (styled components), or does each stage run in a separate orchestrator session? The answer affects context window pressure, whether stage handoff needs a formal protocol, and how the batch log is populated across stages.

### Q-B. What is the orchestrator allowed to read from taxonomy files?

The plan needs to decide: does the "no taxonomy reading" boundary hold for Stage 5's orchestrator, or is it relaxed specifically for pre-loop setup (reference image capture)? If relaxed, what does the orchestrator read — the full taxonomy, or just a story list? If not relaxed, what's the alternative source for story names?

### Q-C. Does `mapping-and-references-skill.md` Part 5 (M003) stay or move?

As written, "Remove KB retrieval section (Part 5)" would eliminate M003 (the KB load sequence for taxonomy agents). Is this intentional — meaning the taxonomy agent should instead load `bootstrap-kb-skill.md` to get KB usage guidance? Or is this a mis-statement — meaning only KB generation content moves to `bootstrap-kb-skill.md` and M003 stays in `mapping-and-references-skill.md`? This decision changes both files significantly.

### Q-D. Is `iteration-protocol.md` being updated?

The post-batch debrief references `iteration-protocol.md`, but the current version describes a branch lifecycle that predates this workflow. Should `iteration-protocol.md` be updated as part of Phase 3, or is it intentionally left as a fallback reference with known gaps?

### Q-E. Stage 5 `Script failed` and `Context exhausted` — can the orchestrator resume?

Currently these phrases cause the orchestrator to `stop`. Is the expectation that the user manually restarts? Or should the orchestrator have a recovery path (e.g., allow user to restart a component agent from a checkpoint)? The plan is silent on re-entry after these failures.

---

## Minor / Editorial

- **Stage 2 checklist is clear and complete** — this is the spec's strongest section. The level of detail there is a good target for the Stage 4 spawn prompt.

- **The Decisions Log table** (at the end of the Questions section) is useful but the "Notes" column is consistently empty. Was this intentional (decisions are self-contained) or placeholder?

- **Stage 4 Phase B steps are split** across "Sub-agent" and "Sub-agent (continued)" sections with an orchestrator step in between. The step numbers reset to 4 in the continued section after 3 in the first section. Clarifying that this is one continuous task interrupted by an orchestrator relay (not two separate task specs) would reduce confusion for an implementing agent.

- **The "Decisions and Rationale" section** is added to the taxonomy doc template per Stage 4 skill changes, but the Q&A protocol calls it "`## Decisions`" (line ~100) and the taxonomy template section at line ~540 calls it "`## Decisions`" as well. The skill change says "Decisions and Rationale section" — a minor naming inconsistency.

- **Appendix A lists `CLAUDE_CODE_ENABLE_TASKS`** with a note "Enables Task tools in place of deprecated `TodoWrite`" — but `CLAUDE_CODE_ENABLE_TASKS` is already required today. Whether it's set in `~/.claude/settings.json` should be verified before Phase 3 rather than assumed.
