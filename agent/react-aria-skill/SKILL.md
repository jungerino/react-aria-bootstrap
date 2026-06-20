---
title: React Aria + Bootstrap Skill — Entry Point
---

# React Aria + Bootstrap Skill

Entry point for the Bootstrap-styling workflow. Maps agent tiers, specifies per-tier file loading, and defines the escalation protocol. Contains no execution details.

---

## Tier Map

| Tier | Agent | Success condition | Terminal phrases |
|------|-------|-------------------|-----------------|
| 0 | Primary (Orchestrator) | Every component has reported `final-stories-done` and the batch report is delivered. | — |
| 1 | Component Sub-Agent | All mirror stories pass the final verification sweep and `verification-sweep-passed` is reported. | `verification-sweep-passed`, `Stuck: {stories}`, `Script failed: {story}`, `Context exhausted`, `EXTRACTED-CSS-GAP: {description}` |
| 1a | Final-Stories Sub-Agent | Standard stories are written and `final-stories-done` is reported. | `final-stories-done` |

---

## Session-Start Loading Instructions

Each tier loads only the files listed for it. Loading files outside your tier is a boundary violation.

**Primary agent (Tier 0):**
- `agent/react-aria-skill/SKILL.md` (this file)
- `agent/react-aria-skill/orchestrator.md`

**Component sub-agent (Tier 1):**
- `agent/react-aria-skill/SKILL.md`
- `agent/react-aria-skill/component-agent.md`
- `agent/react-aria-skill/principles.md`
- `agent/taxonomies/{component}-taxonomy.md` — component taxonomy (incl. `## Decisions` section)
- `agent/bootstrap-kb/README.md` — Bootstrap KB index; then load relevant KB files selectively

**Final-stories sub-agent (Tier 1a):**
- `agent/react-aria-skill/SKILL.md`
- `agent/react-aria-skill/final-stories-agent.md`
- `agent/taxonomies/{component}-taxonomy.md`

`SKILL.md` and `orchestrator.md` are the only files loaded into the primary agent's context at session start. The primary agent does not load `component-agent.md`, `final-stories-agent.md`, or `principles.md`.

---

## Escalation Protocol

**Valid terminal phrases:**

| Phrase | Source | Meaning |
|--------|--------|---------|
| `verification-sweep-passed` | Component sub-agent | All mirror stories passed final verification sweep |
| `final-stories-done` | Final-stories sub-agent | Standard stories written and committed |
| `Stuck: {story1}, {story2}` | Component sub-agent | All stories attempted; listed stories hit stuck threshold; needs user guidance for all at once |
| `Script failed: {story}` | Component sub-agent | Comparison pixel-diff script failed; check the story findings doc |
| `Context exhausted` | Any agent | Agent detected context compression and stopped |
| `EXTRACTED-CSS-GAP: {description}` | Component sub-agent | Cannot proceed without `bootstrap.css` access for a specific gap |
| `Undefined return: {…}` | Any agent | Received a return matching no valid terminal phrase; content included for diagnosis |

**On any non-matching return:** If a child agent's return does not exactly match one of the phrases above — partial output, unclear phrases, progress descriptions — report `Undefined return: {the return, or a one-sentence summary if longer}` to the parent (or user) and stop. Do not read files, run commands, or perform any work before that message.

---

## Workflow

For the full branch lifecycle — iteration setup, component work, debrief, and merge — see `agent/iteration-protocol.md`.

For multi-agent batch operation, see `agent/react-aria-skill/orchestrator.md`.
