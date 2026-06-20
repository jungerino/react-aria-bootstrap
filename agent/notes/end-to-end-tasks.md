# End-to-End Workflow — Implementation Tasks

**Spec:** `agent/notes/end-to-end-plan.md` — the authoritative source for all requirements. Tasks reference spec sections by name rather than duplicating content.

**Purpose:** Ordered task list for the Phase 3 implementation agent. Each task targets a specific file or directory change and is self-contained enough to hand to a subagent.

**Scope:** Skill file refactors, new skill files, protocol doc updates, script changes, and directory/path renames described in the spec. Does not include the per-component batch work performed by the workflow itself — that is the workflow's output, not its setup.

---

## Tasks

### Task 1 — Verify prerequisites

**Files:** None (read-only verification)
**Spec section:** Appendix A: Prerequisites
**What to do:** Confirm all prerequisites from Appendix A are satisfied before any implementation work begins: (1) read `~/.claude/settings.json` and verify `CLAUDE_CODE_ENABLE_TASKS=1` and `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` are present in the `env` block; (2) confirm the `react-aria` and `storybook` MCP servers are configured; (3) confirm `scripts/compare-stories.mjs` and `scripts/extract-story-css.mjs` exist on this branch; (4) confirm Playwright is installed (`npx playwright --version`).
**Done when:** All four checks pass. Any gap is reported and resolved before Task 2 begins.
**Commit:** (no commit — verification only)

---

### Task 2 — Create workflow directory structure

**Files:** `stories/react-aria-bootstrap/`, `stories/react-aria-bootstrap/reference/`, `stories/react-aria-bootstrap/mirror/`, `agent/taxonomies/`, `agent/logs/`, `agent/review/`, `agent/review/reference-css/`, `agent/review/mirror-css/`, `agent/review/diffs/`, `.reference-images/`
**Spec section:** Stage 2: Storybook Setup — Implementation checklist (Steps 1 and 6); Stage 4 Outputs; Stage 5 Outputs
**What to do:** Create all directories required by the workflow. Skip any that already exist. Add a `.gitkeep` placeholder to each empty directory so git tracks it.
**Done when:** All ten directories exist and are tracked by git (`git status` shows new `.gitkeep` files).
**Commit:** `feat: create workflow directory structure`

---

### Task 3 — Move and rename `_decorators.tsx`

**Files:** `stories/react-aria-bootstrap/_decorators.tsx` (copied from `stories/bootstrap-test/_decorators.tsx`)
**Spec section:** Stage 2: Storybook Setup — Implementation checklist (Step 2)
**What to do:** Copy `stories/bootstrap-test/_decorators.tsx` to `stories/react-aria-bootstrap/_decorators.tsx`. In the new copy, rename the export `withBootstrapTest` → `withBootstrap`. Do not change the implementation logic. Leave the original file at `stories/bootstrap-test/_decorators.tsx` intact.
**Done when:** New file exists at `stories/react-aria-bootstrap/_decorators.tsx` with the export named `withBootstrap`; original file unchanged.
**Commit:** `refactor: add _decorators.tsx to react-aria-bootstrap/ with renamed export`

---

### Task 4 — Move `presentation.scss`

**Files:** `stories/react-aria-bootstrap/presentation.scss` (copied from `stories/bootstrap-test/bootstrap-reference/augments.scss`)
**Spec section:** Stage 2: Storybook Setup — Implementation checklist (Step 3)
**What to do:** Copy `stories/bootstrap-test/bootstrap-reference/augments.scss` to `stories/react-aria-bootstrap/presentation.scss`. Do not change the content. Leave the original file intact.
**Done when:** New file exists at `stories/react-aria-bootstrap/presentation.scss`; original `augments.scss` unchanged.
**Commit:** `refactor: add presentation.scss to react-aria-bootstrap/`

---

### Task 5 — Update `.storybook/main.js` story glob

**Files:** `.storybook/main.js`
**Spec section:** Stage 2: Storybook Setup — Implementation checklist (Step 4)
**What to do:** Replace the existing `stories/bootstrap-test/bootstrap-reference/**/*.stories.*` glob with `../stories/react-aria-bootstrap/**/*.stories.@(js|jsx|mjs|ts|tsx)` per Step 4 (exact old and new values are in the spec). This single glob covers all three story categories.
**Done when:** `main.js` contains only the new glob; Storybook starts without errors (`yarn storybook`).
**Commit:** `refactor: update Storybook story glob to react-aria-bootstrap/`

---

### Task 6 — Update `.storybook/preview.js`

**Files:** `.storybook/preview.js`
**Spec section:** Stage 2: Storybook Setup — Implementation checklist (Step 5)
**What to do:** Add `import { withBootstrap } from '../stories/react-aria-bootstrap/_decorators';` and add `decorators: [withBootstrap]` to the preview export object per Step 5.
**Done when:** `preview.js` has the import and decorator; Storybook background switcher correctly toggles Bootstrap light/dark mode (manual check per Stage 2 Human review note).
**Commit:** `feat: apply withBootstrap decorator globally in Storybook preview`

---

### Task 7 — Create `agent/bootstrap-kb-skill.md`

**Files:** `agent/bootstrap-kb-skill.md` (new)
**Spec section:** Stage 1: Bootstrap Knowledge Base — Skill file internal structure; Stage 1: Verification
**What to do:** Create the Bootstrap KB generation skill. The primary source is `bootstrap-mapping:agent/bootstrap-mapping-plan.md` Tasks 1–6 (on the `bootstrap-mapping` branch — read with `git show bootstrap-mapping:agent/bootstrap-mapping-plan.md`); convert its checkbox steps to principles and templates, update all paths per Q6 (taxonomy → `agent/taxonomies/`, findings → `agent/review/`). The file must include all six sections listed in Stage 1's "Skill file internal structure" block: When to use, Generation Principles, one section per output file (tokens → README), and Self-Review Checklist. Also add an entry for `agent/bootstrap-kb-skill.md` under the "Knowledge Files" section of `CLAUDE.md` (Table of Contents).
**Done when:** `agent/bootstrap-kb-skill.md` exists with all required sections; `CLAUDE.md` Table of Contents lists it.
**Commit:** `feat: add bootstrap-kb-skill.md and update CLAUDE.md TOC`

---

### Task 8 — Update `agent/mapping-and-references-skill.md`

**Files:** `agent/mapping-and-references-skill.md`
**Spec section:** Stage 4: Taxonomy + Reference Stories — Skill file changes required for Phase 3
**What to do:** Apply all changes listed in the Stage 4 "Skill file changes required for Phase 3" block:
- Update all file paths per Q6 (reference stories, taxonomy docs, extracted CSS, `presentation.scss`, `withBootstrap`)
- Remove KB *generation* content from Part 5 (bootstrap source file parsing, when to rebuild KB); retain M003 load sequence and query table
- Add explicit WebFetch instruction for fetching Bootstrap documentation pages
- Add `## Decisions` section to the taxonomy doc template
- Add terminal phrase protocol (all four phrases: `TAXONOMY-DECISIONS-NEEDED`, `TAXONOMY-COMPLETE`, `REFERENCE-STORY-READY-FOR-REVIEW`, `COMPONENT-STAGE-4-COMPLETE`)
- Add `presentation.scss` import and `withBootstrap` decorator usage to reference story template
- Retain M007 `bootstrap.css` grep instruction; retain P-S002 specimen HTML context requirement
- Update M016: replace `agent/review-iteration-N.md` with `agent/logs/batch-{N}.md`
**Done when:** All bullet points above are applied; no old paths remain; the skill file's taxonomy doc template includes a `## Decisions` section.
**Commit:** `refactor: update mapping-and-references-skill.md for Phase 3`

---

### Task 9 — Update `agent/react-aria-skill/SKILL.md`

**Files:** `agent/react-aria-skill/SKILL.md`
**Spec section:** Stage 5: Styled Components — Skill File Changes Required for Phase 3 (SKILL.md subsection)
**What to do:** Apply all four changes from the SKILL.md subsection: update the tier map to reflect `EXTRACTED-CSS-GAP` as a valid terminal phrase; update session-start loading paths (taxonomy → `agent/taxonomies/`, findings → `agent/review/`); update the terminal phrase table (add `EXTRACTED-CSS-GAP: {description}` and `final-stories-done`); remove the branch naming section.
**Done when:** All four changes applied; no old paths or old terminal phrase entries remain.
**Commit:** `refactor: update react-aria-skill/SKILL.md for Phase 3`

---

### Task 10 — Update `agent/react-aria-skill/orchestrator.md`

**Files:** `agent/react-aria-skill/orchestrator.md`
**Spec section:** Stage 5: Styled Components — Skill File Changes Required for Phase 3 (orchestrator.md subsection)
**What to do:** Apply all changes from the orchestrator.md subsection:
- Replace both dispatch prompt templates verbatim with the templates in Stage 5 (Tier 1 Component Agent template and new Tier 1a Final Stories Agent template)
- Add `EXTRACTED-CSS-GAP` and `Stuck` handling to the orchestrator loop pseudocode (using `SendMessage` resumption, not stopping)
- Add the pre-loop setup section to the orchestrator loop: stub TSX creation, stub mirror story creation (using the mirror story stub template in Stage 5), Storybook restart, and wait-for-stub-IDs step
- Rename all `_bootstrap-overrides.scss` references to `_bootstrap-bridges.scss`
**Done when:** Both dispatch prompt templates match the Stage 5 spec verbatim; orchestrator loop includes `EXTRACTED-CSS-GAP`, `Stuck`, and pre-loop setup; no `_bootstrap-overrides.scss` references remain.
**Commit:** `refactor: update react-aria-skill/orchestrator.md for Phase 3`

---

### Task 11 — Update `agent/react-aria-skill/component-agent.md`

**Files:** `agent/react-aria-skill/component-agent.md`
**Spec section:** Stage 5: Styled Components — Skill File Changes Required for Phase 3 (component-agent.md subsection)
**What to do:** Apply all changes from the component-agent.md subsection. There are many; work through the bullet list in order:
- Update all file paths throughout (twelve path substitutions listed in the subsection)
- Add Preparation Phase step: read all reference CSS files
- Add final Preparation Phase step: read all pre-captured `.reference-images/{component}/{story}.png` files; note they must not be re-read during Phase C or Final Verification Sweep
- Update Phase C image read rules table: `reference.png` row — "Once during Preparation Phase. Never again."
- Remove from Phase C inception: instruction to read `reference.png` after first pass
- Update Final Verification Sweep: "remains in context from Preparation Phase"
- Add `EXTRACTED-CSS-GAP` protocol to Phase C
- Update fix loop: mark stuck stories in registry, continue to remaining stories, emit `Stuck: {stories}` only after all attempted
- Make CSS comparison mandatory in Phase C fix loop: integrate reference-css vs. mirror-css as a required step (not a fallback)
- Update Pre-completion CSS placement check: path filter to `stories/react-aria-bootstrap/.*\.scss`
- Update Final Verification Sweep: add regression handling (re-enter fix loop for failures; re-run full sweep; repeat until all pass)
- Restructure phases: Preparation Phase retains only step P1; P2 (TSX) and P3 (bridge CSS) move to new Phase A; current Phase A becomes Phase B; current Phase B becomes Phase C; remove scaffold-stubs step entirely
- Add YAML front matter to component-wide findings doc initialization template in Phase A
- Add `## Story Registry` heading above the findings table
- Update hard constraint: bridge rules go in `src/scss/_bootstrap-bridges.scss`
- Remove task ID self-identification command and `**Task ID:**` field from iteration blocks
- Remove `agent/review-iteration-N.md` references
- Relax `implementation.png` read rule: may read on any failure when informative (remove "only when diff.png unchanged" restriction)
- Update Script failure protocol: remove `reference.png` from the failure condition
**Done when:** All bullet points applied; no old paths remain; phase structure (Preparation/A/B/C) is consistent throughout; `EXTRACTED-CSS-GAP` protocol is present in Phase C.
**Commit:** `refactor: update react-aria-skill/component-agent.md for Phase 3`

---

### Task 12 — Update `agent/react-aria-skill/final-stories-agent.md`

**Files:** `agent/react-aria-skill/final-stories-agent.md`
**Spec section:** Stage 5: Styled Components — Skill File Changes Required for Phase 3 (final-stories-agent.md subsection)
**What to do:** Apply the four path/title substitutions from the final-stories-agent.md subsection: story path, story title, taxonomy path, and component impl reference.
**Done when:** No old paths or old story titles remain.
**Commit:** `refactor: update react-aria-skill/final-stories-agent.md for Phase 3`

---

### Task 13 — Update `agent/react-aria-skill/principles.md`

**Files:** `agent/react-aria-skill/principles.md`
**Spec section:** Stage 5: Styled Components — Skill File Changes Required for Phase 3 (principles.md subsection)
**What to do:** Apply all substitutions from the principles.md subsection: P047 rename (`augments.scss` → `presentation.scss`, updated import path); all `_bootstrap-overrides.scss` → `_bootstrap-bridges.scss`; all `stories/bootstrap-test/` → `stories/react-aria-bootstrap/mirror/`; `withBootstrapTest` → `withBootstrap`; story title updates (`Bootstrap Test Mirror/` → `Bootstrap Mirror/`, `Bootstrap Test/` → `Bootstrap/`); `agent/reference-stories/` → `agent/review/` or `agent/taxonomies/` as appropriate.
**Done when:** No old names, paths, or story titles remain in `principles.md`.
**Commit:** `refactor: update react-aria-skill/principles.md paths for Phase 3`

---

### Task 14 — Delete `agent/react-aria-skill/workflow.md`

**Files:** `agent/react-aria-skill/workflow.md` (delete)
**Spec section:** Stage 5: Styled Components — Skill File Changes Required for Phase 3 (workflow.md subsection)
**What to do:** Delete `agent/react-aria-skill/workflow.md`. Per the spec, the branch lifecycle content it documented is now fully covered by `agent/iteration-protocol.md`; the Visual Comparison Workflow and Self-Review Checklist sections should move to `component-agent.md` before deletion if they are not already present there (check first). Also remove the `workflow.md` pointer from the bottom of `SKILL.md` (already part of Task 9, but verify it was removed).
**Done when:** `agent/react-aria-skill/workflow.md` does not exist; `SKILL.md` has no reference to it; any content unique to `workflow.md` has been incorporated into `component-agent.md`.
**Commit:** `chore: delete workflow.md (content absorbed into component-agent.md and iteration-protocol.md)`

---

### Task 15 — Create `scripts/reference-images.mjs`

**Files:** `scripts/reference-images.mjs` (new)
**Spec section:** Script Changes Required — scripts/reference-images.mjs (new script)
**What to do:** Implement the new script per the spec description: accepts `--reference {story-id}` and `--out {path}`; polls `http://localhost:6006/index.json` until the target story ID appears; uses Playwright to screenshot the named reference story rendered in Storybook; saves a PNG to `--out`; no implementation screenshot or diff output. Reuse the same browser/Storybook connection setup as `compare-stories.mjs`.
**Done when:** Script runs successfully against a live Storybook instance and produces a PNG at the specified `--out` path.
**Commit:** `feat: add scripts/reference-images.mjs`

---

### Task 16 — Update `scripts/compare-stories.mjs`

**Files:** `scripts/compare-stories.mjs`
**Spec section:** Script Changes Required — scripts/compare-stories.mjs
**What to do:** Remove `reference.png` from the script's output. The script must write only `implementation.png` and `diff.png` to the `--out` directory. Confirm the output directory is created by the script if it does not exist (the caller passes an iteration-specific `--out` path on each invocation).
**Done when:** Script runs and produces only `implementation.png` and `diff.png` in the `--out` directory; no `reference.png` is written; output directory is created if absent.
**Commit:** `fix: remove reference.png output from compare-stories.mjs`

---
