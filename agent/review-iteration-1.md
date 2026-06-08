---
title: Review — Iteration 1
status: in-progress
---

# Review — Iteration 1

## Components

Select, ListBox, Tabs

## Phase 1 — Scaffolding notes

Branch `react-aria-skill-refactor_1` cut from `react-aria-skill-refactor`. Story stub files created for Select, ListBox, Tabs (both standard and mirror); globs added to `.storybook/main.js`. Storybook restarted; webpack build completed clean at 100% (no errors). Stub story files have no named exports, so no IDs appear in `index.json` yet — expected. Entry points are registered; HMR handles story additions in Phase 2.

Note: `src/bootstrap-test/Select.tsx`, `ListBox.tsx`, and `Tabs.tsx` already existed on the integration branch with partial Bootstrap classes (pre-experiment work). They are not bare stubs — component agent should audit existing classes before adding new ones.

## Phase 2 — Implementation notes

*(one entry per component, added after each component is reviewed)*

## Debrief observations

### Tier 2 agents were never spawned

**Finding:** All three component agents (Tier 1) ran `compare-stories.mjs` directly as Bash commands. No Tier 2 comparison sub-sub-agents were dispatched. Confirmed by:
- Tool usage audit of `agent-a5a0c5c4c2423957d.jsonl` (Select Tier 1): tools used were Bash, Read, Write, Edit, ToolSearch, storybook MCP, react-aria MCP — no `Agent` tool, no `SendMessage`, no `ScheduleWakeup`.
- The `/private/tmp/claude-501/.../tasks/` directory contains only 6 symlinks (3 Tier 1 + 3 Tier 1a agents); no Tier 2 comparison agent IDs appear.

**Consequence:** The Tier 2 architecture (background dispatch, cycling loop, watchdog, SendMessage handshake) was completely bypassed. Comparisons were done inline by the Tier 1 agent.

**Why it still worked:** Running `compare-stories.mjs` directly produces the same diff output. The pixel diff results are accurate. The architectural violation didn't corrupt the output — it just eliminated concurrency, the watchdog, and per-story agent traceability.

### Task IDs in per-story findings are wrong by design

**Finding:** Per-story findings docs record the Tier 1 component agent's own ID, not a Tier 2 agent ID. This is a direct consequence of the above: since Tier 1 wrote the findings itself, it recorded its own ID. The intended design (per `component-agent.md` + `comparison-agent.md`) was for the Tier 1 agent to send the newly-returned Tier 2 agent ID to that agent via SendMessage, and for Tier 2 to write it into the findings block.

### Tabs agent self-identified with the wrong ID

**Finding:** The Tabs component agent recorded `a1f8796565b4dd946` (the ListBox Tier 1 ID) everywhere in its findings, instead of its own ID `acbf6acdb65b5710d`.

**Root cause:** The self-identification command in `component-agent.md` is:
```bash
ls -la "$PROJ/$SESSION/tasks/" | awk '/^l/{print $9; exit}' | sed 's/\.output$//'
```
`ls -la` without `-t` sorts alphabetically. By the time the Tabs agent ran (14:17), the tasks/ directory contained 4 existing symlinks. Sorted alphabetically, `a1f8796565b4dd946` (ListBox) appeared first — before the Tabs agent's own ID `acbf6acdb65b5710d`. The command returned ListBox's ID to the Tabs agent as its own.

Select and ListBox got correct IDs only by coincidence: Select was the first agent (only symlink), and ListBox's ID happens to sort alphabetically before Select's.

### Countermeasures implemented after debrief

**Script-level enforcement (`scripts/compare-stories.mjs`):**
Added two mandatory flags: `--delegating-agent {id}` and `--executing-agent {id}`. If both IDs are identical — i.e. the component agent is running the script on its own behalf — the script exits with code 3 and a rejection message. Exit code 3 is distinct from 2 (usage error) and 1 (diff failure). An agent that tries to run comparisons itself now hits a hard technical barrier, not just an instruction it can ignore.

**Agent file updates (`comparison-agent.md`, `component-agent.md`):**
- `comparison-agent.md`: updated the pixel diff command block to include both new flags; clarified that both IDs arrive via SendMessage from the component agent immediately after launch.
- `component-agent.md`: updated the SendMessage instruction to transmit both the Tier 2 agent ID and the delegating agent (Tier 1) ID; added the delegating agent ID to the dispatch inputs list.

**Hard constraint block (`component-agent.md`):**
Added a single unambiguous constraint immediately after the role contract, covering not just `compare-stories.mjs` but any alternative comparison method (Playwright directly, a different script, etc.). One statement at the top is more authoritative than repeated warnings per section.

**Self-identification bug (not yet fixed):**
The self-identification command in `component-agent.md` returns the alphabetically first symlink in the tasks/ directory, not necessarily the current agent's own ID. This caused the Tabs agent to mis-identify as the ListBox agent. This does not break the enforcement check (Tier 2 has a genuinely different ID regardless), but it corrupts task ID records in findings docs. Fix deferred.

## User review

### Select — `Select.mirror.scss` placement

**Observation:** The agent created `stories/bootstrap-test/Select/Select.mirror.scss` and placed bridge rules there rather than in `src/scss/_bootstrap-overrides.scss`. The file is a mix of two things:

1. **Story-specific layout/sizing rules** — pixel-width classes (`.select-root`, `.select-root-full-width`, `.select-root-full-field-sm`, etc.), static positioning helpers (`.select-popover-static`), faux-focus scope rules. These are appropriate for the stories folder because they're specimen display helpers, not production bridge rules.

2. **Bridge rules** — disabled state, invalid state, FieldError visibility, dropdown item states (`[data-selected]`, `[data-focused]`, `[data-disabled]`). These duplicate or slightly variant the rules already in `_bootstrap-overrides.scss`. Bridge rules belong in `_bootstrap-overrides.scss`.

**Problem:** The agent created a per-component SCSS file in the stories folder and put bridge rules in it instead of routing them to `_bootstrap-overrides.scss`. This splits bridge logic between two locations.

**Guidance that should have prevented this:** Two sources say explicitly where bridge rules go:
- **P003 (scss-bridge)** in `principles.md`: "Map React Aria `data-*` attributes to Bootstrap's interaction styles" in `_bootstrap-overrides.scss`.
- **Preparation Phase P3** in `component-agent.md`: "Write all bridge selectors in `src/scss/_bootstrap-overrides.scss` (P003)."

Both were in the agent's session-start load list. The guidance was present and unambiguous; the agent did not follow it.

### Select — size variant font-size overridden by story SCSS

**Story:** `bootstrap-test-mirror-select--size-variants`

**Observation:** Small and large variants render at the same font-size as the default variant. The reference stories show distinct sizes. Bootstrap's `.form-select-sm` and `.form-select-lg` provide the correct font-sizes, but they were overridden by `.form-select.select-trigger` in `stories/bootstrap-test/Select/Select.mirror.scss`, which set `font-size` explicitly on the trigger element.

**Root cause:** The `.form-select.select-trigger` compound selector (specificity 0,2,0) matches the same specificity as `.form-select.form-select-sm` / `.form-select.form-select-lg`. Because the story SCSS is loaded after Bootstrap's global CSS, the later rule wins on source order, flattening all size variants to a single font-size. The agent should not have set `font-size` on the trigger at all — Bootstrap's size modifier classes exist precisely to handle this, and the agent's explicit override fought them.

**Why the visual check missed it:** The font-size difference between sizes is small (0.875rem / 1rem / 1.25rem). If the pixelmatch threshold was set loosely enough, the per-pixel delta across a slightly different text size may have fallen below the threshold. Tighter thresholds would improve sensitivity here, but would also increase false positives on sub-pixel rendering differences.

**Connection to previous observation:** This is a downstream consequence of `Select.mirror.scss` existing at all (see previous observation). Bridge and trigger rules written in the stories SCSS file — instead of `_bootstrap-overrides.scss` — have no natural boundary preventing them from stomping Bootstrap utility classes.

### Select — trust of the 0.46% diff figure

**Observation:** The diff.png for `size-variants` visually shows clear differences across all three size variants, yet the recorded diff% is 0.46% — which passed the 0.5% threshold by 0.04 percentage points. Two questions arise:

**Can we trust the number?**
The diff.png exists, which proves `compare-stories.mjs` ran (the script writes the PNG as a side effect). A fabricated number without running the script would require the agent to also plant a plausible PNG, which is unlikely. More probable: the script ran and produced the percentage. However, we cannot verify from the findings doc whether the agent passed `--threshold 0.005` (the correct 0.5% threshold per component-agent.md) or used the script default of 10% (`--threshold 0.1`). The threshold flag affects the pass/fail decision but not the reported percentage — both threshold values would produce the same "0.46%" output. So the number itself is probably accurate, but we can't confirm the pass/fail was evaluated against the correct threshold.

**Is 0.5% too permissive?**
At the screenshot dimensions (1280×900 = 1,152,000 pixels), 0.46% = ~5,300 mismatched pixels. Font-size changes affect only the glyph pixels, so a subtle but visible size regression can produce a relatively low pixel count while being clearly wrong to human eyes. The 0.5% threshold is probably too high for regressions of this type. A tighter threshold (e.g. 0.2–0.3%) would increase sensitivity but also increase false positives from sub-pixel rendering variation. The right answer may be story-level thresholds, not a single global threshold. On closer examination the triggers themselves are the wrong sizes (not just font-size), which should produce a higher diff count — making it more surprising that the result stayed at 0.46%. This strengthens the case that 0.5% is too permissive. A tighter threshold such as 0.3% would have flagged this story as a FAIL.

### ListBox — missing `cursor: pointer` on interactive items (P011)

**Story:** `bootstrap-test-mirror-listbox--selection-single`

**Observation:** Clickable ListBox items render with the default arrow cursor instead of a pointer cursor. `cursor: pointer` is absent from `_bootstrap-overrides.scss` and from all ListBox story files.

**Class mapping is correct, bridge is incomplete:** The agent applied `.list-group-item-action` to ListBox items, which is the right Bootstrap class for interactive list items. However, Bootstrap 5's `.list-group-item-action` does not include an explicit `cursor: pointer` rule — it relies on the browser's native cursor for `<a>` and `<button>` elements. React Aria renders ListBoxItems as `<div>` elements, which have no native cursor behavior. The class is correct; the bridge rule is missing.

**P011 exists for exactly this case:** P011 states that any interactive React Aria element that would have a pointer cursor in the equivalent Bootstrap component must have `cursor: pointer` added explicitly in the bridge, because React Aria replaces anchor/button elements with non-native elements.

**Why P011 was overlooked:** The agent applied `.list-group-item-action` and stopped — a reasonable-looking class choice. The gap is that P011 requires an additional verification step: confirm that the chosen Bootstrap class actually delivers `cursor: pointer` on the element type React Aria renders. Without that check, the class appears complete but is not. This is a different failure mode than the P003 placement issue: the agent knew the right class but didn't complete the bridge. P011 requires active verification at point of use, not just recall of the class name.

**Countermeasure applied:** Added a cursor verification substep to P2 in `component-agent.md`, at the point of Bootstrap class selection. The substep names the specific failure mode ("Bootstrap classes designed for `<a>` or `<button>` elements do not deliver pointer cursor on `<div>`") so the agent must confront it while assigning className, not as a deferred recall from a principles list.

## Principles extracted

### Instruction following has real architectural limits — and this workflow is working against them

Research finding (sourced): LLM instruction following degrades with context length. Claude Code reliably handles ~100–150 usable instruction slots in CLAUDE.md before rules start dropping; past ~200 lines, large blocks are ignored. In multi-turn agentic workloads, there is a documented ~39% performance drop on rule adherence. Rules followed early are gradually abandoned — the model reverts toward its training defaults as context grows.

The component agent's session-start load is heavy: SKILL.md, component-agent.md, principles.md (~50 principles), taxonomy doc, Bootstrap KB files. By the time the agent is mid-task writing CSS, the principles loaded at session start are in the "middle dilution zone" — receiving less attention than instructions at the start or end of context.

P003 is principle #3 in a list of 50+. It states what to do but not prominently why. The Tier 2 hard constraint block works because it is at the top of component-agent.md in the primacy position, not buried in a list.

**What this means for remediation:**
- Technical enforcement scripts are one lever but not the right mental model — they're a last resort for things that genuinely cannot be enforced any other way.
- The hard constraint block pattern (visually distinct, top-of-file, states why) is the right pattern and should be applied to CSS file placement too.
- The deeper problem is prompt length. A principles doc with 50+ entries, all loaded at once, is a recipe for selective compliance. Critical cross-cutting rules should live in CLAUDE.md (highest reliability, loaded in every context) or in a hard constraint block at the top of the agent file.
- An explicit pre-completion checklist item ("Verify: no new SCSS files in stories/") catches violations before the agent reports done.

**Open actions:**
- Add a hard constraint block at the top of component-agent.md for CSS file placement
- Add a pre-completion verification step to the agent file
- Evaluate whether CLAUDE.md should carry the most critical cross-cutting rules (e.g., bridge rules go in `_bootstrap-overrides.scss`)
- Consider whether principles.md is too long to be reliably loaded at session start in full

## Skill update status
- [x] Skill knowledge files updated
- [ ] Finalized component files merged to `react-aria-skill-refactor` (if approved)

**Knowledge file changes this iteration:**
- `component-agent.md` — hard constraint block for CSS placement (top of file); pre-completion SCSS grep check; cursor verification substep in P2; pass/fail threshold updated to 0.3%
- `comparison-agent.md` — `--threshold` flag updated to 0.003 (0.3%); pass/fail rule updated
- `scripts/compare-stories.mjs` — `--delegating-agent` and `--executing-agent` flags made mandatory; exit code 3 if both IDs match

**Note:** Tabs debrief observations were not collected before close-out. Tabs component work remains unreviewed.
