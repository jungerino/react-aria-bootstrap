---
title: Mapping and References Skill — Orchestrator (Tier 0)
---

# Orchestrator (Tier 0)

**Role contract:** Your task is complete when every component in the batch has reported `COMPONENT-STAGE-4-COMPLETE`, you have committed and pushed all Stage 4 artifacts, and you have compiled and delivered the batch report to the user. Your task is NOT complete when taxonomy work or story writing is done — that is the component sub-agent's job. You run git commit and push after each component completes — see Commit Ownership below.

---

## Commit Ownership

The orchestrator runs `git commit` and `git push` — not the sub-agent. Reason: `git commit` requires user approval (it is in the `ask` permission list in user settings). Sub-agents resumed via `SendMessage` run in background mode, where permission prompts cannot surface to the user. The orchestrator runs in the foreground and can handle the approval prompt normally.

After receiving `COMPONENT-STAGE-4-COMPLETE`, stage and commit all artifacts for that component before moving to the next:

```bash
git add agent/taxonomies/{component}-taxonomy.md
git add stories/react-aria-bootstrap/reference/{ComponentName}.reference.stories.tsx
git add stories/react-aria-bootstrap/presentation.scss
git add agent/artifacts/reference-css/{component}-*.css
git add agent/logs/batch-{N}.md
git commit   # permission prompt will appear — this is expected, approve it
git push
```

When running `git commit`, expect a permission prompt — this is correct behavior, not a blocker.

---

## Boundary

You do not write taxonomy content, reference stories, or CSS. You do not load `component-agent.md`.

Crossing this boundary defeats the purpose of the hierarchy. A component sub-agent's raw failure return is more valuable than work you complete on its behalf.

### Example

**Wrong — boundary crossing:**
> The orchestrator reads React Aria docs to understand a component's sub-parts, then begins drafting taxonomy content directly.

**Right — correct delegation:**
> The orchestrator emits the delegation manifest and dispatches a component sub-agent with the component name and key paths. It waits for a terminal phrase.

---

## Required First Step: Delegation Manifest

Before dispatching any sub-agent, emit a delegation manifest listing every component and its initial status. Execution cannot begin until this manifest is emitted.

```
| Component | Status  |
|-----------|---------|
| Button    | pending |
| Tabs      | pending |
```

---

## Concurrency

Dispatch component sub-agents **serially — one at a time.** Wait for each component sub-agent to reach `COMPONENT-STAGE-4-COMPLETE` before dispatching the next. Cross-component learning requires each component to complete before the next begins.

---

## Dispatch Prompt Template

Use this template **verbatim** when launching a Tier 1 component sub-agent. Replace `{component}` (lowercase) and `{ComponentName}` (PascalCase). Do not add, remove, or paraphrase steps.

```
You are a Tier 1 Component Sub-Agent for the React Aria + Bootstrap taxonomy and reference stories workflow.

Component: {ComponentName}

## Session-start files (read in this order)

1. agent/mapping-and-references-skill/SKILL.md
2. agent/mapping-and-references-skill/component-agent.md

## Key paths

| Artifact | Path |
|----------|------|
| Batch log | agent/logs/batch-{N}.md |
| Taxonomy output | agent/taxonomies/{component}-taxonomy.md |
| Reference stories | stories/react-aria-bootstrap/reference/{ComponentName}.reference.stories.tsx |
| Reference CSS | agent/artifacts/reference-css/{component}-{StoryName}.css (one per story) |
| Bootstrap KB | agent/bootstrap-kb/README.md |

## SendMessage resumption

This agent may be paused mid-session for user Q&A. When the orchestrator resumes you via SendMessage, continue from where you stopped — do not re-read session-start files.

## Terminal phrases

Return exactly one of:
- TAXONOMY-DECISIONS-NEEDED: {list of decisions}
- TAXONOMY-COMPLETE
- REFERENCE-STORY-READY-FOR-REVIEW
- COMPONENT-STAGE-4-COMPLETE

component-agent.md is your task definition. Do not derive your steps from this prompt.
```

**Deriving path values from a component name:**
- `{component}` is lowercase (e.g. `button`, `select`)
- `{ComponentName}` is PascalCase (e.g. `Button`, `Select`)

---

## Loop

```
emit delegation manifest (required before any dispatch)

read agent/logs/batch-{N}.md for component list

for each component in batch (serial):

  dispatch Tier 1 component sub-agent (foreground — wait for terminal phrase)

  [sub-agent runs Phase A then Phase B in a single session, pausing at each terminal phrase]

  while not COMPONENT-STAGE-4-COMPLETE:

    on terminal phrase:

      TAXONOMY-DECISIONS-NEEDED: {list}:
        → surface to user:
            "Phase A complete for {ComponentName}. Decisions needed:
             {formatted decision list}"
        → receive user answers
        → resume sub-agent via SendMessage: "User answers: {answers}. Continue."
        → continue waiting

      TAXONOMY-COMPLETE:
        → log internally; immediately resume sub-agent via SendMessage: "Proceed to Phase B."
          [Transparent to user — no interruption. See note below.]
        → continue waiting

      REFERENCE-STORY-READY-FOR-REVIEW:
        → prompt user:
            "Open Storybook → Bootstrap Reference/{ComponentName}.
             Review the stories. Approve or provide feedback."
        → receive user response
        → resume sub-agent via SendMessage with user feedback or "Approved."
        → continue waiting (sub-agent may loop back to REFERENCE-STORY-READY-FOR-REVIEW)

      COMPONENT-STAGE-4-COMPLETE:
        → commit and push all Stage 4 artifacts for this component (see Commit Ownership)
        → log completion; update delegation manifest; exit while loop

      Undefined return:
        → surface to user immediately as Undefined return; stop

when all components done:
  compile batch report (delegation manifest + per-component outcome summary)
  present to user
```

---

## TAXONOMY-COMPLETE: Transparent Checkpoint

`TAXONOMY-COMPLETE` is an inter-phase checkpoint, not a user event. When you receive it, immediately resume the sub-agent via SendMessage without interrupting the user. Do not ask the user what to do next.

This is the only terminal phrase in the Stage 4 loop that requires no user interaction before resuming.

---

## Terminal Phrase Handling

Valid terminal phrases and their meanings are defined in `SKILL.md`. Any return that does not exactly match a valid phrase — partial output, progress descriptions, unclear phrasing — must be reported as `Undefined return: {the return, or a one-sentence summary if longer}`.

**On unexpected return:** Report `Undefined return: {…}` to the user immediately and stop. Do not read files, run commands, or perform any work before that message.
