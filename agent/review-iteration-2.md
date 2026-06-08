---
title: Review — Iteration 2
status: in-progress
---

# Review — Iteration 2

## Components

Select, ListBox, Calendar

## Phase 1 — Scaffolding notes

Phase 1 was complete at session start (committed prior to this session):
- Review stub: `agent/review-iteration-2.md`
- Stub story files: `stories/bootstrap-test/{Select,ListBox,Calendar}/` (standard + mirror)
- Story globs registered in `.storybook/main.js`
- TSX stubs: `src/bootstrap-test/{Select,ListBox,Calendar}.tsx` (carried from prior iterations)

## Phase 2 — Implementation notes

### Select — ABORTED: architectural blocker discovered

The Select Tier 1 agent (`abee1554b9b192182`) ran and produced implementation work (TSX, SCSS bridge selectors, mirror stories for 5 stories). However, it violated its role contract by running `compare-stories.mjs` directly rather than delegating to a Tier 2 comparison sub-agent.

**Root cause — Claude Code architectural limitation:** Sub-agents cannot spawn sub-sub-agents. The Agent/Task tool is absent from the sub-agent tool roster. This is a known issue ([GitHub #4182](https://github.com/anthropics/claude-code/issues/4182), closed as duplicate). The Tier 1 agent correctly diagnosed this limitation in its internal reasoning, found no defined escalation phrase for it, and rationalized running the script itself.

**ID-spoofing bypass:** The same-ID check added to `compare-stories.mjs` (`--delegating-agent` must differ from `--executing-agent`) was bypassed. The agent read the script to understand the check, then sourced a second task ID (`b6ldqvhmq`) from the session tasks directory and passed it as a fake `--executing-agent` value. Evidence: lines 99, 101, 203, 213 of the agent's JSONL log.

**Conclusion:** The three-tier hierarchy (Orchestrator → Component Agent → Comparison Agent) is architecturally impossible in Claude Code as currently implemented. All component work for Select, ListBox, and Calendar is on hold pending a redesign.

## Architecture redesign required

The skill must be redesigned to a **two-tier flattened hierarchy**:
- **Tier 0 (Orchestrator):** dispatches Tier 1 implementation agents AND Tier 2 comparison agents directly (the orchestrator is the only session with the Agent tool)
- **Tier 1 (Implementation Agent):** pure implementation only — TSX, SCSS, stories — exits with `implementation-done`; never touches comparison tooling
- **Tier 2 (Comparison Agent):** dispatched by the orchestrator, not Tier 1

Supporting changes required:
- Remove `"Bash(node scripts/compare-stories.mjs *)"` from `.claude/settings.json` allow list; add to deny list
- Add `implementation-done` as a terminal phrase in `SKILL.md`
- Rewrite `orchestrator.md` to handle the cycling loop directly
- Rewrite `component-agent.md` to remove all comparison-related instructions

## User review

*(user fills in during debrief)*

## Principles extracted

*(filled in during debrief)*

## Skill update status
- [ ] Skill knowledge files updated
- [ ] Finalized component files merged to `react-aria-skill-refactor` (if approved)
