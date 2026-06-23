---
title: Mapping and References Skill — Entry Point
---

# Mapping and References Skill

Entry point for the Stage 4 taxonomy and reference stories workflow. Maps agent tiers, specifies per-tier file loading, and defines the escalation protocol. Contains no execution details.

---

## Tier Map

| Tier | Agent | Success condition | Terminal phrases |
|------|-------|-------------------|-----------------|
| 0 | Orchestrator | Every component has reported `COMPONENT-STAGE-4-COMPLETE` and the batch report is delivered. | — |
| 1 | Component Sub-Agent | Taxonomy finalized; reference stories approved; CSS extracted for all stories; all committed. | `TAXONOMY-DECISIONS-NEEDED: {list}`, `TAXONOMY-COMPLETE`, `REFERENCE-STORY-READY-FOR-REVIEW`, `COMPONENT-STAGE-4-COMPLETE` |

---

## Session-Start Loading Instructions

Each tier loads only the files listed for it. Loading files outside your tier is a boundary violation.

**Orchestrator (Tier 0):**
- `agent/mapping-and-references-skill/SKILL.md` (this file)
- `agent/mapping-and-references-skill/orchestrator.md`

**Component sub-agent (Tier 1):**
- `agent/mapping-and-references-skill/SKILL.md` (this file)
- `agent/mapping-and-references-skill/component-agent.md`

`SKILL.md` and `orchestrator.md` are the only files loaded into the orchestrator's context at session start. The orchestrator does not load `component-agent.md`.

---

## Escalation Protocol

**Valid terminal phrases:**

| Phrase | Source | Meaning |
|--------|--------|---------|
| `TAXONOMY-DECISIONS-NEEDED: {list}` | Component sub-agent | Taxonomy has open forks requiring user input; decisions listed |
| `TAXONOMY-COMPLETE` | Component sub-agent | Taxonomy doc written; no open decisions remain; sub-agent proceeding to Phase B |
| `REFERENCE-STORY-READY-FOR-REVIEW` | Component sub-agent | Reference stories written; ready for visual review in Storybook |
| `COMPONENT-STAGE-4-COMPLETE` | Component sub-agent | All stories approved; CSS extracted for all stories; all committed |
| `Undefined return: {…}` | Any agent | Received a return matching no valid terminal phrase; content included for diagnosis |

**On any non-matching return:** Report `Undefined return: {the return, or a one-sentence summary if longer}` to the parent (or user) and stop immediately. Do not read files, run commands, or perform any work before that message.

---

## Workflow

For the full branch lifecycle — iteration setup, component work, debrief, and merge — see `agent/iteration-protocol.md`.

For multi-agent batch operation, see `agent/mapping-and-references-skill/orchestrator.md`.
