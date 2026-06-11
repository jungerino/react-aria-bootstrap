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
> The primary agent reads `button-taxonomy.md` to understand the component's sub-parts, then begins writing CSS bridge selectors in `_bootstrap-overrides.scss` for the button hover state.

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

Each sub-agent prompt must be fully self-contained: component name, taxonomy path, findings doc path, and paths to the skill files the component agent should load.

**Deriving paths from a component name:**
- Taxonomy: `agent/reference-stories/{component}-taxonomy.md` (e.g. `button-taxonomy.md`)
- Component-wide findings doc: `agent/reference-stories/{component}-findings.md`
- Mirror stories TSX: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Bootstrap overrides: `src/scss/_bootstrap-overrides.scss`

`{component}` is lowercase (e.g. `button`, `select`); `{ComponentName}` is PascalCase (e.g. `Button`, `Select`).

---

## Loop

Once per component, in order:

```
[emit delegation manifest — required before any launch]

for each component:
  launch component sub-agent (foreground — wait for completion)

  on terminal phrase:
    verification-sweep-passed
      → launch final-stories sub-agent (foreground — wait for completion)

    Stuck / Script failed / Context exhausted / Undefined return
      → surface to user immediately with component name and phrase; stop

  on final-stories sub-agent completion:
    final-stories-done
      → log completion; update manifest; proceed to next component

    Undefined return: {…}
      → surface to user immediately; stop

when all components done:
  compile batch report; present to user
```

---

## Terminal Phrase Handling

Valid terminal phrases and their meanings are defined in `SKILL.md`. Any return that does not exactly match a valid phrase — partial output, progress descriptions, unclear phrasing — must be reported as `Undefined return: {the return, or a one-sentence summary if longer}`.

**On unexpected return:** Report `Undefined return: {…}` to the parent (or user) immediately and stop. Do not read files, run commands, or perform any work before that message.
