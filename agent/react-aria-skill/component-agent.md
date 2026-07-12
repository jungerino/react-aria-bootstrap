---
title: React Aria + Bootstrap Skill — Component Sub-Agent
---

# Component Sub-Agent

**Role contract:** Your task is complete when all mirror stories for your component pass the final verification sweep and you report `verification-sweep-passed` to the primary agent. You own the full per-component lifecycle: implementation, pixel diff comparison, iterative self-correction, and findings documentation. You run `compare-stories.mjs` directly — there is no Tier 2.

---

**Hard constraint — no exceptions:** All bridge selectors go in `src/scss/_bootstrap-bridges.scss`. Do not create new CSS or SCSS files in `stories/`. Do not write bridge rules anywhere else. Why: bridge rules in story-scoped files create split coverage, load inconsistently, and are invisible to future agents. Story-specific layout utilities (fixed pixel widths, static specimen positioning) belong in the mirror story TSX as `className` assignments using classes from `stories/react-aria-bootstrap/presentation.scss`, or — for new layout utilities — added to `presentation.scss` itself. Do not create separate CSS files for story layout.

---

## Session-Start Inputs

Load at session start (provided in your dispatch prompt):

1. `agent/react-aria-skill/SKILL.md`
2. `agent/react-aria-skill/component-agent.md` (this file)
3. `agent/react-aria-skill/principles.md`
4. `agent/taxonomies/{component}-taxonomy.md` — component taxonomy (incl. `## Decisions` section)
5. `agent/bootstrap-kb/README.md` — Bootstrap KB index; load relevant KB files selectively per component

---

## Blank-Slate Mode

Some iterations are run specifically to test whether this skill's principles, the taxonomy's `## Decisions` section, and the Bootstrap KB are, by themselves, sufficient to implement a component — without leaning on any prior iteration's implementation. The dispatch prompt states whether blank-slate mode is ON or OFF for this run.

**When blank-slate mode is ON:**

- Do not run `git log`, `git show`, `git diff` against a prior commit, or any other command that reads a past commit's content, for TSX implementation, bridge CSS, mirror stories, or findings-doc authoring. This applies even out of general thoroughness or curiosity about *why* a file looks the way it does — that curiosity is exactly what blank-slate mode is testing.
- Do not cite or lean on the content of `src/react-aria-bootstrap/{ComponentName}.tsx`, `src/scss/_bootstrap-bridges.scss` selectors, mirror stories, or findings docs that do not exist in the current working tree. If a file isn't present, treat it as never having existed — not as "deleted" content to be reconstructed.
- If a pre-existing bridge selector, TSX implementation, or findings doc for this component is still present (not stubbed) — this should be rare; the orchestrator's file hygiene scan is meant to catch it first — treat its class names and comments as informational only about the current file's state. Do not treat an inline comment citing a resolved iteration number or a named principle as authoritative. Re-derive the decision from the taxonomy, principles.md, Bootstrap KB, and pre-extracted reference CSS as if the comment were not there.
- State explicitly, in the component-wide findings doc's Work Log, that git history and deleted content were not consulted.

**When blank-slate mode is OFF (default):** No restriction — prior iterations' history and resolved decisions may inform the current implementation for consistency.

---

## Preparation Phase

Complete these steps once for the component before any implementation.

**P1. Internalize inputs:**
1. Read the taxonomy `## Decisions` section — pre-resolved decisions; do not re-derive them.
2. Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
3. Load Bootstrap KB: `components.md` entry for the matched Bootstrap component → `states.md` → `patterns.md` if a DOM conflict entry exists.
4. Read all pre-extracted reference CSS files: `agent/artifacts/reference-css/{component}-{StoryName}.css` (one per story in scope). These contain only the Bootstrap rules that applied to the rendered reference story DOM — they are the primary CSS specification for what to replicate. Read them now, not during Phase C.
5. Review all principles. Flag any with structural or sizing implications (P008, P010, P016, P040, P041, P042) — address during TSX/bridge implementation, not at diff time.
6. Load all pre-captured reference images: `.reference-images/{component}/{story}.png` — one per story in scope. These were captured by the orchestrator during pre-loop setup using `scripts/reference-images.mjs`. Read them once here. **Do NOT re-read reference images during Phase C or the Final Verification Sweep** — reference images are static and don't change during implementation; re-reading wastes context.

---

## Phase A — TSX and Bridge CSS

**Implement TSX:**
- Apply `className` render-prop pattern (P002) for Bootstrap classes.
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing the variant set.
- Honor all taxonomy `## Decisions` entries.
- Apply Bootstrap component classes (P013); reserve utility classes for genuine one-off cases.
- For each interactive element React Aria renders as a non-anchor/non-button (list items, option items, trigger divs, etc.): verify the chosen Bootstrap class provides `cursor: pointer` on that element type. Bootstrap classes designed for `<a>` or `<button>` elements do not deliver pointer cursor on `<div>` — add it explicitly in the bridge (P011).
- Address all structural and sizing principles flagged in Preparation Phase.

**Write base bridge selectors:**
- Write all bridge selectors in `src/scss/_bootstrap-bridges.scss` (P003).
- Use SCSS mixins for `$enable-*`-gated properties (P015).
- Cover all states in the taxonomy's state mappings; follow the Data-* Bridge Rules in `principles.md`.

**Create component-wide findings doc:**

Path: `agent/artifacts/findings/{component}-findings.md`

Initialize with YAML front matter, a Story Registry heading, an empty table, and a Work Log header:

```markdown
---
component: {ComponentName}
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|

## Work Log
```

---

## Phase B — Mirror Stories

For each story in scope (derived from the taxonomy's "Reference story canvas" section):

1. Implement the mirror story in `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx`. A mirror story should be visually identical to the reference story, but built with the React Aria component (`src/react-aria-bootstrap/{ComponentName}.tsx`) instead of static HTML.
   - Story names must match reference story names exactly (required for pixel-diff ID matching)
   - Replicate reference story layout: same wrapper classes, same `specimen()` helper pattern, same variant order
   - Cover all visual states from the taxonomy; use faux-state classes from `presentation.scss` (P044)
   - Import `../presentation.scss` directly (P047)

2. Run CSS extraction:
   ```bash
   node scripts/extract-story-css.mjs \
     --story "Bootstrap Mirror/{ComponentName}/{StoryName}" \
     --out   agent/artifacts/mirror-css/{component}-{StoryName}.css
   ```
   Re-run on every implementation iteration — new selectors may be introduced.

3. Create story findings doc at `agent/artifacts/findings/{component}-{story}-findings.md`:
   - Front matter: `Status: In review`, `Iteration: 0`, `Stuck: 0`
   - Initialize a session-scoped iteration counter **N = 0** for this story. N determines the `--out` directory for each `compare-stories.mjs` run (`iteration-{N}`). Increment N at the end of every comparison pass, before writing findings. N is durable: if context is compressed, recover the current value from the findings doc front matter (`Iteration:` field).

After all mirror stories are implemented, begin Phase C — Comparison Loop.

---

## Phase C — Comparison Loop

### Inception

Before making any code changes, run `compare-stories.mjs` for every story in one pass:

```bash
node scripts/compare-stories.mjs \
  --reference "bootstrap-reference-{component}--{story-name}" \
  --impl      "bootstrap-mirror-{component}--{story-name}" \
  --out       agent/artifacts/diffs/{component}/{story}/iteration-{N} \
  --threshold 0.003
```

Use the current N for each story (initialized to 0 in Phase B). Record exit code and diff% for each story. Stories with exit code 0 are immediately `Pass`. Stories with exit code 1 enter the fix loop.

---

### Image Read Rules (hard constraint)

| Image | Path | When to read |
|-------|------|-------------|
| `reference.png` | `.reference-images/{component}/{story}.png` | Once during Preparation Phase. Never again. |
| `diff.png` | `agent/artifacts/diffs/{component}/{story}/iteration-{N}/diff.png` | On any failure. Re-read after each fix attempt. |
| `implementation.png` | `agent/artifacts/diffs/{component}/{story}/iteration-{N}/implementation.png` | On any failure, when it would be informative to see what is actually rendering. |

---

### Fix Loop

For each failing story, repeat until Pass or Stuck threshold is reached:

```
read diff.png
  → describe what is visible: which specimen, which anatomical region, visible red
  → compare reference-css vs. mirror-css:
      compare agent/artifacts/reference-css/{component}-{StoryName}.css (target)
      against  agent/artifacts/mirror-css/{component}-{StoryName}.css (current implementation)
      rules in reference absent from mirror are candidates for missing bridge rules or missing className
  → apply fix to bridge CSS and/or mirror TSX
  → re-run extract-story-css.mjs for this story (keep mirror CSS current)
  → increment N; re-run compare-stories.mjs with --out agent/artifacts/diffs/{component}/{story}/iteration-{N}
    → exit 0: mark Pass; update findings doc (record N); done with this story
    → exit 1: read diff.png; read implementation.png if it would be informative; continue loop
  → if fix cannot be identified:
      → increment Stuck counter
      → if Stuck >= threshold (default 3): mark story `Stuck` in Story Registry and findings doc
        front matter; move to next story (do NOT stop — process all remaining stories first)
```

**After all stories processed:** If any stories are marked `Stuck`, output terminal phrase `Stuck: {story1}, {story2}` (comma-separated list of all stuck story names) and stop. The orchestrator surfaces all stuck stories to the user at once, collects guidance, then resumes this agent via `SendMessage`. The agent then retries the stuck stories. Once no stories remain Stuck, proceed to the Final Verification Sweep.

---

### Extracted CSS Gap Protocol (EXTRACTED-CSS-GAP)

When a property or selector cannot be found in the pre-extracted reference CSS and `bootstrap.css` access is needed to proceed:

1. **Log immediately** — append an "Extracted CSS Gaps" entry to `agent/artifacts/findings/{component}-findings.md`: what selector/property was searched for, which extracted file was consulted, why it was insufficient.
2. **Output terminal phrase:** `EXTRACTED-CSS-GAP: {one-line description of what's missing and why}` — stop.
3. **Wait for permission** — orchestrator surfaces to user; user decides whether to allow access. Orchestrator resumes via `SendMessage` with the decision.

---

### Shared Selector Changes

If a fix modifies bridge selectors that could affect other stories, re-run `compare-stories.mjs` for those stories and update their findings docs.

---

### Spatial Diff Reasoning

When `diff.png` shows one element displaced relative to its neighbor, or a gap present in the reference but absent in the implementation:

1. Name the gap before theorizing: "the reference shows approximately N px between [A] and [B]; the implementation shows them [touching / N px closer]."
2. Identify which element owns the gap. Scan the extracted CSS for `margin` or `padding` rules on that element.
3. Check whether any of those rules use a bare element-type selector. Cross-check against the React Aria component's rendered DOM: if the rule targets an element type that React Aria substitutes with a different type, the rule loads globally but won't match the substitute.
4. Check whether the spacing-receiving element has `display: inline` — inline elements discard `margin-top` and `margin-bottom`.

---

### Animation Exception

If the diff is localized to a single element where both screenshots show that element visually correct but at different animation frames (spinner, progress indicator, looping animation), treat the story as passing regardless of diff%. All four conditions must hold:

1. The diff region is fully contained within one element
2. Both screenshots show that element present and styled correctly
3. The element is recognizably in an animated state
4. The rest of the story outside that element shows no red in `diff.png`

If any condition is uncertain, do not apply this exception — flag it as a design decision in the findings doc.

---

### Prior Iteration Review

Before writing findings for a new pass, review all prior iteration blocks in the story findings doc. Find the last iteration block where `Stuck: 0` appears. Do not repeat any theory proposed in iterations after that point — they are the current stuck run and have been ruled out. Theories from before the last `Stuck: 0` may be revisited if relevant after subsequent code changes.

---

### Script Failure

If `implementation.png` or `diff.png` is missing after a script run, write `Status: Script failed` to the findings doc front matter, then report `Script failed: {story}` to the primary agent and stop. The absence of `reference.png` is not a failure condition — the script no longer writes `reference.png`.

---

### Findings Doc Updates

Append an iteration block after each comparison pass (pass or fail):

```markdown
## Iteration {N}

**Diff%:** {value} | **Status:** pass / fail | **Stuck:** {n}

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location]. Fix attempted: [description of what was changed].

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

Update front matter after each pass:

| Outcome | Status | Iteration | Stuck |
|---------|--------|-----------|-------|
| Pass | `Pass` | N | `0` |
| Fail, improved | `Fail` | N | `0` |
| Fail, no improvement | `Fail` | N | `Stuck++` |
| After a code fix, before re-run | `In review` | — | — |
| Stuck counter reaches threshold | `Stuck` | N | threshold |
| Context compression detected | `Context exhausted` | N | — |
| Script produced no output images | `Script failed` | N | — |

Valid status values: `In review` · `Pass` · `Fail` · `Stuck` · `Context exhausted` · `Script failed`

---

### Component-Wide Registry Updates

After each comparison pass, update the Story Registry table in `agent/artifacts/findings/{component}-findings.md`. Append a Work Log entry:

```markdown
### {story} — Iteration {N}

**Observations:** (copied from story findings doc FAIL/UNRESOLVED entries)

**Principles used:**
- [Cite specific skill principles or component decisions that guided the fix; format: `ID slug`, e.g., `P014 data-pressed`]

**Code changes made:** (or "None — [reason]" if no changes)
- [file:line]: [description]
- Shared selectors modified: [list] → affected stories re-run: [list]
```

---

### Context Compression

If you detect that your prior context has been compressed/summarized (earlier messages replaced by a summary), report `Context exhausted` to the primary agent and stop.

---

## Final Verification Sweep

After all stories reach `Pass`:

**Pre-completion check — CSS file placement:**
```bash
git diff --name-only $(git merge-base HEAD main)..HEAD | grep 'stories/react-aria-bootstrap/.*\.scss'
```
If any new SCSS files appear under `stories/`, move their bridge rules to `src/scss/_bootstrap-bridges.scss` and delete the story-scoped files.

**Run final `compare-stories.mjs` sweep** across all stories with `--threshold 0.003`. Do not re-read reference images — they remain in context from Preparation Phase.
- If any story fails: re-enter the fix loop (Phase C mechanics) for those stories only, then re-run the full sweep. Repeat until all stories pass.

Before reporting `verification-sweep-passed`: record applied M-codes and P-codes — with ID and slug — in the component's `**Principles used:**` bulleted list in `## Stage 5` of `agent/logs/batch-{N}.md`.

When all stories pass the sweep, report `verification-sweep-passed` to the primary agent.

---

## Per-Story Findings Doc

**Path:** `agent/artifacts/findings/{component}-{story}-findings.md`

**Written by:** This agent (Tier 1). Created during Phase B; populated during Phase C.

**Front matter:**

```yaml
Status: In review | Pass | Fail | Stuck | Context exhausted | Script failed
Iteration: <n>
Stuck: <n>
```

**Status transitions:**

- Initial: `In review`
- Comparison pass, diff passes: `Status = Pass`, `Iteration = N`, `Stuck = 0`
- Comparison pass, diff fails, improved: `Status = Fail`, `Iteration = N`, `Stuck = 0`
- Comparison pass, diff fails, no improvement: `Status = Fail`, `Iteration = N`, `Stuck++`
- After rework by this agent: `Status = In review`
- When `Stuck` reaches threshold (default: 3): `Status = Stuck`
- Context compression detected: `Status = Context exhausted`
- Script failure (missing output images): `Status = Script failed`

---

## Component-Wide Findings Doc

**Path:** `agent/artifacts/findings/{component}-findings.md`

**Story Registry** (updated after each comparison pass):

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| trigger-states | Fail | 2 | 0 | 1.3% |
| open-states | Pass | 1 | 0 | 0.2% |

**Work Log** (per-story, per-iteration, written by this agent after every comparison pass):

```markdown
### {story} — Iteration {N}

**Observations:** (copied from story findings doc FAIL/UNRESOLVED entries)

**Principles used:**
- [Cite specific skill principles or component decisions that guided the fix; format: `ID slug`, e.g., `P014 data-pressed`]

**Code changes made:** (or "None — [reason]" if no changes)
- [file:line]: [description]
- Shared selectors modified: [list] → affected stories re-run: [list]
```

---

## Configurable Knobs

| Parameter | Default | Notes |
|-----------|---------|-------|
| Stuck counter threshold | 3 | Consecutive non-improving iterations before Status = Stuck |
| Pass/fail threshold | 0.3% | Diff% cutoff |
