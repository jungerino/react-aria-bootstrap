---
title: React Aria + Bootstrap Skill — Comparison Sub-Sub-Agent
---

# Comparison Sub-Sub-Agent

**Role contract:** Your task is complete when you have written findings to the story findings doc and exited. You do not cycle. You do not rework CSS. You report findings and stop.

---

## Inputs

Provided in your dispatch prompt:

- Mirror story URL: `?path=/story/bootstrap-test-mirror-{component}--{story}`
- Reference story URL: `?path=/story/bootstrap-reference-{component}--{story}`
- Story findings doc path: `agent/reference-stories/{component}-{story}-findings.md`
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md`
- Component mirror stories TSX: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Bootstrap overrides file: `src/scss/_bootstrap-overrides.scss`
- Matched Bootstrap CSS: `agent/reference-stories/mirror-css/{component}-{story}.css`
  — `.faux-*` rules in this file define the target visual appearance for interactive states; use them as the reference when assessing the corresponding `[data-*]` bridge rule. See the state mapping table in the taxonomy for the `faux-*` → `data-*` correspondence.

---

## Pixel Diff

**Command:**

```bash
node scripts/compare-stories.mjs \
  --reference {reference-story-id} \
  --impl      {mirror-story-id} \
  --out       .story-diffs/{component}/{story} \
  --threshold 0.005
```

**Pass/fail threshold:** diff% < 0.5% = Pass; ≥ 0.5% = Fail

---

## Image Analysis

After every diff run, use the `Read` tool to load all three output images:
- `.story-diffs/{component}/{story}/reference.png`
- `.story-diffs/{component}/{story}/implementation.png`
- `.story-diffs/{component}/{story}/diff.png`

If any of the three files is missing, that is a script failure — write `Status: Script failed` to the findings doc front matter, report `findings-written` to the component agent, and stop. Do not estimate or invent results.

Describe what is visible in each image. A run is only clean when all three files exist, have been read via tool call, and `diff.png` contains no red regions outside of the animation exception below.

### Animation Exception

If after reading all three images the diff is localized to a single element and both screenshots show that element visually correct but at different animation frames, treat the story as passing regardless of diff%. All four conditions must hold:

1. The diff region is fully contained within one element
2. Both screenshots show that element present and styled correctly
3. The element is recognizably in an animated state (spinner, progress indicator, looping animation)
4. The rest of the story outside that element shows no red in `diff.png`

If any condition is uncertain, do not apply this exception — flag it as a design decision in the findings doc for the component agent to resolve.

---

## Findings Output

Append an Iteration block to the story findings doc:

```
## Iteration {N}

**Diff%:** {value} | **Status:** pass / fail

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location].
  Theory: [selector/property] is [missing/wrong value].
  Validated: [yes/no — cite file:line]

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

Then update the front matter:
- Pass: `Status: Pass`, `Iteration: N+1`, `Stuck: 0`
- Fail with improvement vs. prior iteration: `Status: Fail`, `Iteration: N+1`, `Stuck: 0`
- Fail with no improvement: `Status: Fail`, `Iteration: N+1`, `Stuck: Stuck+1`

Report `findings-written` to the component agent, then exit.

---

## Context Compression

If you detect that your prior context has been compressed/summarized (earlier messages replaced by a summary), write `Status: Context exhausted` to the story findings doc front matter, report `findings-written` to the component agent, and exit.
