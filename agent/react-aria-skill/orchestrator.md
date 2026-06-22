---
title: React Aria + Bootstrap Skill — Primary Agent (Orchestrator)
---

# Primary Agent (Orchestrator)

**Role contract:** Your task is complete when every component in the batch has reported `final-stories-done` and you have compiled and delivered the batch report to the user. Your task is NOT complete when the styling work is done — that is the component agent's job.

---

## Boundary

You do not read taxonomy files, write CSS, run pixel diffs, or implement stories. You do not load `component-agent.md` or `principles.md`.

Crossing this boundary defeats the purpose of the hierarchy. A component agent's raw failure return is more valuable than work you complete on its behalf.

### Example

**Wrong — boundary crossing:**
> The primary agent reads `button-taxonomy.md` to understand the component's sub-parts, then begins writing CSS bridge selectors in `_bootstrap-bridges.scss` for the button hover state.

**Right — correct delegation:**
> The primary agent emits the delegation manifest and launches a component sub-agent prompt that includes the component name, taxonomy path, and findings doc path. It waits for a terminal phrase.

---

## Required First Step: Delegation Manifest

Before launching any agent, emit a delegation manifest listing every component and its initial status. Execution cannot begin until this manifest is emitted.

```
| Component | Status  |
|-----------|---------|
| Select    | pending |
| ListBox   | pending |
```

---

## Concurrency

Dispatch component sub-agents **serially — one at a time.** Wait for each component sub-agent to report a terminal phrase before launching the next. This ensures the full concurrency budget is available to each component's comparison sub-sub-agents and avoids silent queuing.

---

## Dispatch Prompt Template — Tier 1 Component Agent

Use this template **verbatim** when launching a Tier 1 component sub-agent. Replace `{component}` (lowercase) and `{ComponentName}` (PascalCase). Do not add, remove, or paraphrase steps — the template is intentionally minimal so that `component-agent.md` remains the sole task definition.

```
You are a Tier 1 Component Sub-Agent for the React Aria + Bootstrap styled component workflow.

Component: {ComponentName}

## Session-start files (read in this order)

1. agent/react-aria-skill/SKILL.md
2. agent/react-aria-skill/component-agent.md — your complete task definition; follow it exactly
3. agent/react-aria-skill/principles.md
4. agent/taxonomies/{component}-taxonomy.md
5. agent/bootstrap-kb/README.md

## Key paths

| Artifact | Path |
|----------|------|
| Component impl | src/react-aria-bootstrap/{ComponentName}.tsx |
| Mirror stories | stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx |
| Bridge CSS | src/scss/_bootstrap-bridges.scss |
| Presentation CSS | stories/react-aria-bootstrap/presentation.scss |
| Component findings | agent/artifacts/findings/{component}-findings.md |

## Reference inputs (read during Preparation Phase)

| Artifact | Path |
|----------|------|
| Reference stories | stories/react-aria-bootstrap/reference/{ComponentName}.reference.stories.tsx |
| Reference CSS | agent/artifacts/reference-css/{component}-{StoryName}.css (one per story) |

## Terminal phrases

Return exactly one of:
- verification-sweep-passed
- Stuck: {story1}, {story2}  (emitted after all stories attempted; lists all that hit stuck threshold)
- Script failed: {story}
- Context exhausted
- EXTRACTED-CSS-GAP: {one-line description}

component-agent.md is your task definition. Do not derive your steps from this prompt.
```

**Deriving path values from a component name:**
- `{component}` is lowercase (e.g. `button`, `select`)
- `{ComponentName}` is PascalCase (e.g. `Button`, `Select`)

---

## Dispatch Prompt Template — Tier 1a Final Stories Agent

Use this template **verbatim** when launching the Tier 1a final stories sub-agent after `verification-sweep-passed`.

```
You are a Tier 1a Final-Stories Sub-Agent.

Component: {ComponentName}

## Session-start files (read in this order)

1. agent/react-aria-skill/SKILL.md
2. agent/react-aria-skill/final-stories-agent.md
3. agent/taxonomies/{component}-taxonomy.md

## Key paths

| Artifact | Path |
|----------|------|
| Component impl | src/react-aria-bootstrap/{ComponentName}.tsx |
| Final stories | stories/react-aria-bootstrap/{ComponentName}.stories.tsx |

## Terminal phrases

Return exactly one of:
- final-stories-done
```

---

## Loop

```
emit delegation manifest (required before any dispatch)

[pre-loop setup]
  for each component in batch-{N}.md:
    create src/react-aria-bootstrap/{ComponentName}.tsx stub (bare React Aria component, no Bootstrap classes)
    create stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx stub:

      import type { Meta, StoryObj } from '@storybook/react';
      import { withBootstrap } from '../_decorators';
      import '../presentation.scss';

      const meta: Meta = {
        title: 'Bootstrap Mirror/{ComponentName}',
        decorators: [withBootstrap],
        parameters: { layout: 'padded' },
      };
      export default meta;

      type Story = StoryObj<typeof meta>;

      // Placeholder — replaced in Phase B
      export const Placeholder: Story = {};

  restart Storybook (lsof -ti tcp:6006 | xargs kill -9 && yarn storybook &)
  wait for all stub story IDs to appear in http://localhost:6006/index.json

  for each component in batch-{N}.md, for each story in the component's `stories:` list:
    node scripts/reference-images.mjs \
      --reference "bootstrap-reference-{component}--{story-name}" \
      --out       .reference-images/{component}/{story}.png

for each component in batch (serial):

  dispatch Tier 1 component agent (foreground — wait for terminal phrase)

  on terminal phrase:

    verification-sweep-passed:
      → dispatch Tier 1a Final Stories agent (foreground — wait for terminal phrase)

        on final-stories-done:
          → log completion; update delegation manifest; proceed to next component

        on any other return:
          → surface as Undefined return; stop
          If the failure is recoverable (context exhausted, story format error): user may re-dispatch Tier 1a.
          The orchestrator resumes from after `verification-sweep-passed` without re-running the component agent.

    EXTRACTED-CSS-GAP: {description}:
      → surface to user: "Component agent cannot proceed without bootstrap.css access.
        Gap: {description}. Approve or deny?"
      → receive user decision
      → resume component agent via SendMessage with: "bootstrap.css access [approved/denied].
        [If approved: you may now read node_modules/bootstrap/dist/css/bootstrap.css for this
        specific gap only. Log the gap and continue. If denied: log the gap, note the limitation,
        and continue with the information available.]"
      → continue waiting for next terminal phrase

    Stuck: {story1}, {story2}:
      → for each stuck story: read agent/artifacts/findings/{component}-{story}-findings.md;
        extract FAIL/UNRESOLVED entries from the most recent iteration block
      → surface to user: "{component} completed with stuck stories: {list}.
        For each stuck story, include FAIL/UNRESOLVED entries from its most recent iteration block.
        Please provide guidance for each."
      → receive user guidance
      → resume component agent via SendMessage with guidance for all stuck stories
      → continue waiting for next terminal phrase

    Script failed: {story}:
      → surface to user; user restarts Storybook and resolves script issue
      → re-dispatch the same component agent; it recovers current state from the findings doc
        front matter and Story Registry

    Context exhausted:
      → surface to user; orchestrator re-dispatches the component agent with a checkpoint prompt
        including the component name, findings doc path, and current story-by-story status
        from the Story Registry

    Undefined return:
      → surface to user immediately as Undefined return; stop

when all components done:
  compile batch report (delegation manifest + findings summary per component)
  present to user
  conduct post-batch debrief (see agent/iteration-protocol.md)
```

---

## Terminal Phrase Handling

Valid terminal phrases and their meanings are defined in `SKILL.md`. Any return that does not exactly match a valid phrase — partial output, progress descriptions, unclear phrasing — must be reported as `Undefined return: {the return, or a one-sentence summary if longer}`.

**On unexpected return:** Report `Undefined return: {…}` to the parent (or user) immediately and stop. Do not read files, run commands, or perform any work before that message.
