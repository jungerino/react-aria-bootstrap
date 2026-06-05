---
title: Review — Iteration 0
status: in-progress
---

# Review — Iteration 0

## Components

Button, Select

## Phase 1 — Scaffolding notes

Scaffolding was committed prior to this session (stubs, story globs, Storybook restart). No scaffolding issues noted.

## Phase 2 — Implementation notes

### Button

All 4 mirror stories passed the final verification sweep. Stories: `color-variants-solid`, `color-variants-outline`, `sizes`, `states`. Standard stories written by final-stories sub-agent: Default, ColorVariantsSolid, ColorVariantsOutline, Sizes, Disabled, Pending (17 solid variants, 8 outline variants, 3 sizes).

### Select

5 mirror stories attempted. 3 passed: `trigger-states` (0.41%), `open-dropdown` (0.14%), `size-variants` (0.12%). 2 stuck after 4 iterations each: `invalid-state` (0.93%) and `full-field` (1.26%). Stuck threshold reached correctly; agent halted and reported as specified.

**Root cause of stuck stories (identified in debrief):** The comparison agent's diagnosis — "Chromium renders `<select>` and `<button>` differently at sub-pixel level" — is incorrect. Actual root cause: React Aria renders a `<span>` for the label sub-part instead of a `<label>`. Bootstrap's `_reboot.scss` sets `label { display: inline-block }`, which does not apply to `<span>`. The `.form-label` class applies `margin-bottom`, but the `<span>` remains `display: inline`, silently discarding the margin. The gap between label and trigger is therefore absent in the implementation. Fix: add `display: inline-block` (or `display: block`) to the bridge for the label sub-part.

**Artifact anomalies noted:**
- `.story-diffs` directory hierarchy is inconsistent: Button used flat naming (`button-{story}`), Select used nested naming (`select/{story}`). Correct convention per `comparison-agent.md` is nested. Button's comparison agents deviated from the spec.
- `.story-diffs/select/full-field-lenient` and `select/self-test`, `select/mirror-self-test` are unauthorized artifacts from the Select comparison agents improvising outside the protocol. Safe to delete.

## User review

**Overall:** Good run. Two Select stories got stuck (invalid-state, full-field), but the stuck mechanism behaved correctly and halted iteration cleanly. Findings docs tell a readable tale — the artifact quality is acceptable.

**Comparison agent diagnosis quality:** The stuck diagnosis was a confabulation — plausible-sounding but survives no scrutiny. The "locked pixel count across CSS changes" pattern led the agent to declare an unfixable rendering-engine difference rather than continuing to search. The true root cause (label display mode) was straightforward CSS once identified.

**Skill gaps surfaced:** Three new principles added during debrief:
- P050 `reboot-mismatch` (`principles.md`) — element type substitution invalidates Bootstrap reboot rules; component agent must audit `_reboot.scss` for invalidated properties
- M018 `elem-type-sub` (`mapping-and-references-skill.md`) — taxonomy `DOM conflicts` section should explicitly document element type substitutions and flag them for the component agent
- P-CC-gap (`comparison-agent.md`) — spatial offset in diff means missing spacing; decision tree for identifying root cause via extracted CSS and display mode check

## Principles extracted

- P050: reboot-mismatch — see `agent/react-aria-skill/principles.md`
- M018: elem-type-sub — see `agent/mapping-and-references-skill.md`
- P-CC-gap (Spatial Diff Reasoning) — see `agent/react-aria-skill/comparison-agent.md`

## Skill update status

- [x] Skill knowledge files updated — debrief pass: P050, M018, P-CC-gap committed to `react-aria-skill-refactor_0`
- [x] Skill knowledge files updated — post-debrief pass (this session):
  - Task ID provenance: `comparison-agent.md` and `component-agent.md` — agents record task IDs in every findings entry to enable post-run audit of delegation fidelity
  - Cycling loop quality: actionable-theory requirement, no-repeat-within-stuck-run rule (landmark-based, using `Stuck:` field in iteration header), Work Log required after every sub-sub-agent return, no-code-change gate in Fail branch
- [-] Finalized component files — not merging; Select not finalized, Button deferred with it
- [-] `CLAUDE.md` — cleanup deferred to next session; will be made experiment-agnostic
