---
title: React Aria + Bootstrap Skill — Component Sub-Agent
---

# Component Sub-Agent

**Role contract:** Your task is complete when all mirror stories for your component pass the final verification sweep and you report `verification-sweep-passed` to the primary agent. You own the full per-component lifecycle: implementation, pixel diff comparison, iterative self-correction, and findings documentation. You run `compare-stories.mjs` directly — there is no Tier 2.

---

**Hard constraint — no exceptions:** All bridge selectors go in `src/scss/_bootstrap-overrides.scss`. Do not create new CSS or SCSS files in `stories/`. Do not write bridge rules anywhere else. Why: bridge rules in story-scoped files create split coverage, load inconsistently, and are invisible to future agents. Story-specific layout utilities (fixed pixel widths, static specimen positioning) belong in the mirror story TSX as `className` assignments using classes from `augments.scss`, or — for new layout utilities — added to `augments.scss` itself. Do not create separate CSS files for story layout. `augments.scss` is the shared home for all story layout utilities (both reference and mirror stories import it via P047).

---

## Session-Start Inputs

Load at session start (provided in your dispatch prompt):

1. `agent/react-aria-skill/SKILL.md`
2. `agent/react-aria-skill/component-agent.md` (this file)
3. `agent/react-aria-skill/principles.md`
4. `agent/reference-stories/{component}-taxonomy.md` — component taxonomy (incl. `## Decisions` section)
5. `agent/bootstrap-kb/README.md` — Bootstrap KB index; load relevant KB files selectively per component

Then run the task ID self-identification command below and record the result — you will include it in every findings doc iteration block and Work Log entry:

```bash
PROJ="/private/tmp/claude-$(id -u)/-Users-josh-Library-CloudStorage-Dropbox-Github-react-aria-bootstrap"
SESSION=$(ls -t "$PROJ" | head -1)
ls -lat "$PROJ/$SESSION/tasks/" | awk '/^l/{print $9; exit}' | sed 's/\.output$//'
```

Then create a TodoWrite enumerating every step before doing anything else.

---

## Preparation Phase

Complete these steps once for the component before the story-level pipeline:

**P1. Internalize inputs:**
1. Read the taxonomy `## Decisions` section — pre-resolved decisions; do not re-derive them.
2. Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
3. Load Bootstrap KB: `components.md` entry for the matched Bootstrap component → `states.md` → `patterns.md` if a DOM conflict entry exists.
4. Review all principles. Flag any with structural or sizing implications (P008, P010, P016, P040, P041, P042) — address during TSX/bridge implementation, not at diff time.

**P2. Implement TSX:**
- Apply `className` render-prop pattern (P002) for Bootstrap classes.
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing the variant set.
- Honor all taxonomy `## Decisions` entries.
- Apply Bootstrap component classes (P013); reserve utility classes for genuine one-off cases.
- For each interactive element React Aria renders as a non-anchor/non-button (list items, option items, trigger divs, etc.): verify the chosen Bootstrap class provides `cursor: pointer` on that element type. Bootstrap classes designed for `<a>` or `<button>` elements do not deliver pointer cursor on `<div>` — add it explicitly in the bridge (P011).
- Address all structural and sizing principles flagged in P1.

**P3. Write base bridge selectors:**
- Write all bridge selectors in `src/scss/_bootstrap-overrides.scss` (P003).
- Use SCSS mixins for `$enable-*`-gated properties (P015).
- Cover all states in the taxonomy's state mappings; follow the Data-* Bridge Rules in `principles.md`.

---

## Phase A — Story Implementation

For each mirror story:

1. Implement CSS and write the mirror story:
   - One story per reference story in scope; story names must match reference story names exactly
   - Replicate reference story layout: same wrapper classes (`ref-specimen-row`, `ref-flex-row`), same `specimen()` helper pattern, same variant order
   - See `principles.md` → Stories Conventions for CSS conventions (faux states, augments import, inline style rules)
2. Run CSS extraction:
   ```bash
   node scripts/extract-story-css.mjs \
     --story {mirror-story-id} \
     --out   agent/reference-stories/mirror-css/{component}-{story}.css
   ```
   Re-run on every implementation iteration — new selectors may be introduced. Output is git-tracked and overwritten each run.
3. Create story findings doc at `agent/reference-stories/{component}-{story}-findings.md`:
   - Front matter: `Status: In review`, `Iteration: 0`, `Stuck: 0`

After all mirror stories are implemented, begin Phase B — Comparison Loop.

---

## Phase B — Comparison Loop

### Inception

Before making any code changes, run `compare-stories.mjs` for every story in one pass. This generates `reference.png`, `implementation.png`, and `diff.png` for each story:

```bash
node scripts/compare-stories.mjs \
  --reference {reference-story-id} \
  --impl      {mirror-story-id} \
  --out       .story-diffs/{component}/{story} \
  --threshold 0.003
```

After the first pass, read `.story-diffs/{component}/{story}/reference.png` for **every** story. Do this once — **never re-read `reference.png` again for the rest of the session.** Reference stories do not change; re-reading them on each pass wastes ~3,500 tokens per story.

Record exit code and diff% for each story. Stories with exit code 0 are immediately `Pass` — log them and move on. Stories with exit code 1 enter the fix loop.

---

### Image Read Rules (hard constraint)

| Image | When to read |
|-------|-------------|
| `reference.png` | **Once at Phase B inception.** Never again. |
| `diff.png` | On any failure. Re-read after each fix attempt to check for change. |
| `implementation.png` | **Only** after a fix attempt that produced no visible change in `diff.png` (i.e., you tried and missed — the diff looks the same). `reference.png` in context plus `diff.png` is sufficient to diagnose most failures; read `implementation.png` only when the fix had no effect and you need to see what is actually rendering to understand why. Do not read before attempting a fix. |

---

### Fix Loop

For each failing story, repeat until Pass or Stuck threshold is reached:

```
read diff.png
  → describe what is visible: which specimen, which anatomical region, visible red
  → apply fix to bridge CSS and/or mirror TSX
  → re-run scripts/extract-story-css.mjs for this story (keep mirror CSS current)
  → re-run compare-stories.mjs for this story
    → exit 0: mark Pass; update findings doc; done with this story
    → exit 1 and diff.png changed: continue loop
    → exit 1 and diff.png unchanged: read implementation.png; continue loop
  → if no fix can be identified: increment Stuck counter
      → if Stuck >= threshold (default 3): write Status = Stuck; report `Stuck: {story}` to primary agent; stop
  → write iteration block to findings doc after every pass (pass or fail)
```

**Shared selector changes:** If a fix modifies bridge selectors that could affect other stories, re-run `compare-stories.mjs` for those stories too and update their findings.

**Script failure:** If any of `reference.png`, `implementation.png`, or `diff.png` is missing after a script run, write `Status: Script failed` to the findings doc front matter, then report `Script failed: {story}` to the primary agent and stop.

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

### Findings Doc Updates

Append an Iteration block after each comparison pass:

```
## Iteration {N}

**Task ID**: {task-id}
**Diff%:** {value} | **Status:** pass / fail | **Stuck:** {n}

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location]. Fix attempted: [description of what was changed].

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

**Observations, not conclusions.** Record what is visible — where the red appears, which specimen, which anatomical region, diff% — and what fix you applied. Your reasoning lives in your conversation context. The findings doc is the observable record, not a theory log.

Update front matter:
- Pass: `Status: Pass`, `Iteration: N+1`, `Stuck: 0`
- Fail, improved vs. prior: `Status: Fail`, `Iteration: N+1`, `Stuck: 0`
- Fail, no improvement: `Status: Fail`, `Iteration: N+1`, `Stuck++`
- After a code fix: `Status: In review`
- When Stuck reaches threshold: `Status: Stuck`

---

### Component-Wide Registry Updates

After each story pass, update the Story Registry table in `agent/reference-stories/{component}-findings.md`. Append a Work Log entry after every comparison pass:

```
### {story} — Iteration {N}

**Task ID**: {task-id}

**Observations:** (copied from story findings doc FAIL/UNRESOLVED entries)

**Principles consulted:**
- [Cite specific skill principles or component decisions that guided the fix]

**Code changes made:** (or "None — [reason]" if no changes)
- [file:line]: [description]
- Shared selectors modified: [list] → affected stories re-run: [list]
```

---

### Context Compression

If you detect that your prior context has been compressed/summarized (earlier messages replaced by a summary), report `Context exhausted` to the primary agent and stop.

---

## Final Verification Sweep

After all stories reach `Pass`, before reporting completion:

**Pre-completion check — CSS file placement:**
```bash
git diff --name-only $(git merge-base HEAD main)..HEAD | grep 'stories/.*\.scss'
```
If any new SCSS files appear in `stories/`, move their bridge rules to `src/scss/_bootstrap-overrides.scss` and delete the story-scoped files before proceeding.

Run one final round of `compare-stories.mjs` across all stories with `--threshold 0.003`. This catches regressions from shared-selector changes that slipped through the fix loop. Do not re-read `reference.png` — it remains in context from Phase B inception.

When all stories pass the sweep, report `verification-sweep-passed` to the primary agent.

---

## Per-Story Findings Doc

**Path:** `agent/reference-stories/{component}-{story}-findings.md`

**Written by:** This agent (Tier 1). Created during Phase A; populated during Phase B.

**Front matter:**

```yaml
Status: In review | Pass | Fail | Stuck | Context exhausted | Script failed
Iteration: <n>
Stuck: <n>
```

**Status transitions:**

- Initial: `In review`
- Comparison pass, diff passes: `Status = Pass`, `Iteration++`, `Stuck = 0`
- Comparison pass, diff fails, improved: `Status = Fail`, `Iteration++`, `Stuck = 0`
- Comparison pass, diff fails, no improvement: `Status = Fail`, `Iteration++`, `Stuck++`
- After rework by this agent: `Status = In review`
- When `Stuck` reaches threshold (default: 3): `Status = Stuck`
- Context compression detected: `Status = Context exhausted`
- Script failure (missing output images): `Status = Script failed`

**Body (appended per iteration by this agent):**

```
## Iteration {N}

**Task ID**: {task-id}
**Diff%:** {value} | **Status:** pass / fail | **Stuck:** {n}

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location]. Fix attempted: [description].

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

---

## Component-Wide Findings Doc

**Path:** `agent/reference-stories/{component}-findings.md`

**Story Registry** (updated after each comparison pass):

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| trigger-states | Fail | 2 | 0 | 1.3% |
| open-states | Pass | 1 | 0 | 0.2% |

**Work Log** (per-story, per-iteration, written by this agent after every comparison pass):

```
### {story} — Iteration {N}

**Task ID**: {task-id}

**Observations:** (copied from story findings doc FAIL/UNRESOLVED entries)

**Principles consulted:**
- [Cite specific skill principles or component decisions that guided the fix]

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

