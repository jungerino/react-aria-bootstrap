---
title: React Aria + Bootstrap Skill — Workflow
---

# Workflow

Branch lifecycle for a styling experiment iteration: scaffolding, implementation, debrief, and merge.

For multi-agent batch processing, see `orchestrator.md` and `component-agent.md`.

---

## Phase 1 — Cut experiment branch

Cut `{experiment-name}_N` from `{experiment-name}`. Two first commits:

**1. Create review stub** — `agent/review-iteration-N.md`. Use the template in `agent/iteration-protocol.md`.

Commit message: `chore: stub review-iteration-N`

**2. Stub target files** for each component:
- `src/bootstrap-test/{ComponentName}.tsx` — bare React Aria component, no className additions yet
- `stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx` — standard arg-table stories
- `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx` — mirror stories for pixel diff

Standard story stub:
```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Bootstrap Test/{ComponentName}',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

// Placeholder — replaced in Phase 2
export const Placeholder: Story = {};
```

Mirror story stub:
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';

const meta: Meta = {
  title: 'Bootstrap Test Mirror/{ComponentName}',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

// Placeholder — replaced in Phase 2
export const Placeholder: Story = {};
```

Commit message: `chore: stub files for {experiment-name}_N ({Component1}, {Component2})`

**3. Add story globs to `.storybook/main.js`** — add one glob entry per component (e.g. `stories/bootstrap-test/{ComponentName}/**`) in the same scaffolding commit. This must happen before any implementation work begins.

**4. Restart Storybook** — after the scaffolding commit, kill the running Storybook process and start a fresh one:

```bash
lsof -ti tcp:6006 | xargs kill -9
yarn storybook &
```

Wait for the new instance to serve `index.json` with the stub story IDs before proceeding to Phase 2. Adding a new glob creates a new webpack entry point that HMR cannot handle — a clean rebuild is required. Doing this once at scaffolding time means Phase 2 only ever makes content changes that HMR handles correctly.

---

## Phase 2 — Per-component work sequence (single-agent path)

Repeat for each component. For multi-agent batch processing, use `orchestrator.md` + `component-agent.md` instead of this path; the component agent handles both implementation and comparison in one session — no separate comparison tier. User review happens after the full component set is complete (Phase 3).

**2a. Read and internalize inputs**

1. Read `agent/reference-stories/{component}-taxonomy.md` in full.
2. Read the `## Decisions` section — these are pre-resolved; do not re-derive them.
3. Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
4. Load Bootstrap KB: `components.md` entry → `states.md` → `patterns.md` if a DOM conflict entry exists.
5. **Review all principles in `principles.md`** before writing any code. Flag any principle with structural or sizing implications (P008, P010, P016, P040, P041, P042) — address during TSX/bridge implementation, not at diff time.

**2b. Implement TSX**

- Apply `className` render-prop pattern (P002) for Bootstrap classes.
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing the variant set.
- Honor all decisions in the taxonomy's `## Decisions` section.
- Apply Bootstrap component classes (P013); reserve utility classes for genuine one-off cases.
- Address all structural and sizing principles flagged in step 2a.

**2c. Write bridge selectors**

Write **all** bridge selectors in `src/scss/_bootstrap-overrides.scss` (P003). SCSS mixins work here because the file is compiled after Bootstrap's variables and mixins are loaded (P015). Cover all states in the taxonomy's state mappings; follow the Data-* Bridge Rules in `principles.md`.

**2d. Write Storybook stories**

*Standard stories* (`{ComponentName}.stories.tsx`, title `Bootstrap Test/{ComponentName}`):
- Follow `get-storybook-story-instructions` conventions
- `argTypes` with explicit `options` for all string-union props (P029)
- Default, Variants (all values side by side, P030/P032), Disabled, Invalid, WithDescription where applicable (P031)

*Mirror stories* (`{ComponentName}.mirror.stories.tsx`, title `Bootstrap Test Mirror/{ComponentName}`):
- One story per reference story in scope; names must match exactly
- Replicate reference story layout: same wrapper classes (`ref-specimen-row`, `ref-flex-row`), same `specimen()` helper pattern, same variant order
- Include interactive state specimens using `.faux-*` wrappers (P044)

**2e. Visual comparison**

Before running pixel diffs, verify stories are rendering. If `index.json` shows story IDs registered but `compare-stories.mjs` times out, this is the HMR loop pattern — kill and restart Storybook, confirm rendering, then proceed.

Follow the [Visual Comparison Workflow](#visual-comparison-workflow) below. Fix all fixable deltas before presenting to the user.

**2f. Document in review file**

Add an entry to `agent/review-styling-iteration-N.md` under "Phase 2 — Implementation notes":
- Sub-parts implemented and bridge strategies used
- Visual comparison results: resolved deltas, open design decisions, intentional deviations
- Candidate principles for `principles.md`

---

## Phase 3 — Debrief

User reviews styled components in Storybook and provides observations.

**Write each observation to `agent/review-styling-iteration-N.md` immediately — before replying.** Do not batch, do not defer. Multiple observations in one message → write all before replying.

Both implementation quality and visual comparison methodology are in scope.

---

## After debrief

Follow `agent/iteration-protocol.md` — it governs observation recording, knowledge file updates, the component work decision gate, and merge commands.

---

## Visual Comparison Workflow

Before delivering, visually compare each test component against its Bootstrap Reference story and resolve fixable deltas. Do not present raw differences to the user — fix what you can first.

**Storybook URL patterns:**
- Test story:      `http://localhost:6006/?path=/story/bootstrap-test-{component}--example`
- Reference story: `http://localhost:6006/?path=/story/bootstrap-reference-{component}--{story-name}`

Reference story names vary — use the Storybook sidebar under "Bootstrap Reference" to find the relevant story.

### Pixel diff command

Always run with `--threshold 0.003` (0.3%):

```bash
node scripts/compare-stories.mjs \
  --reference <reference-story-id> \
  --impl      <mirror-story-id> \
  --out       .story-diffs/<component>/<story> \
  --threshold 0.003
```

The 0.3% threshold catches structural sizing errors while remaining well above typical sub-pixel rendering noise (~0.1–0.2%).

### Fix loop (repeat until clean)

1. Run pixel diff with `--threshold 0.003`
2. Read `diff.png` — exit code alone is not sufficient. Red regions identify exactly which pixels differ. No red regions = clean.
3. List every visual difference visible in `diff.png` and in the reference/implementation screenshots
4. Classify each difference:
   - **Fixable** — a CSS/class gap with an unambiguous Bootstrap solution → fix it now
   - **Design decision** — requires a judgment call → flag for user
   - **Intentional** — a documented deviation → note it
5. Apply all fixable fixes, reload, re-run pixel diff, re-read `diff.png` to confirm
6. Repeat until `diff.png` contains no red regions and exit code is 0

### What to compare

**Default (at-rest) state:** typography, spacing, color/fill, interactive affordance, overall proportions.

**Interaction states:**

| Test state | Trigger method | Reference equivalent |
|---|---|---|
| `[data-hovered]` | `@browser` hover over element | `:hover` |
| `[data-pressed]` | `@browser` javascript_tool: set `data-pressed="true"` on element | `:active` |
| `[data-focused]` | `@browser` Tab key to focus element | `:focus-visible` |
| `[data-selected]` | Navigate to story with selection active | `.active` / Bootstrap selected state |
| `[data-disabled]` | Navigate to Disabled story | `disabled` attribute / `.disabled` class |
| `[data-invalid]` | Navigate to Invalid/WithError story | Bootstrap invalid feedback styling |

For forced states (e.g. `data-pressed`), use `@browser javascript_tool` to temporarily set the attribute, screenshot, then remove it.

### Deliver to user only when

- All fixable deltas (default + interaction states) are resolved and confirmed via re-screenshot
- Remaining items are design decisions or intentional deviations, documented in the review file

### Record in review file

In `agent/review-iteration-N.md`, add a "Visual Comparison" subsection per component listing resolved deltas, open design decisions, and intentional deviations.

---

## Self-Review Checklist

Before delivering iteration work, verify:
- [ ] Storybook builds without errors — start a fresh instance and confirm the webpack/sass output is clean before proceeding (HTTP 200 and story registration are not sufficient)
- [ ] Every test component has Bootstrap classes in its `className` (not just CSS overrides)
- [ ] All `data-*` bridges that are needed are in `_bootstrap-overrides.scss`
- [ ] No project CSS rules that conflict with Bootstrap are left uncommented
- [ ] Unmapped components/states are logged with alternatives
- [ ] All string-union props have constrained `argTypes` (inline-radio, explicit options)
- [ ] React Aria documentation was read for each component; all props with layout, orientation, selection-mode, or variant semantics are implemented with bridge rules and stories (P038)
- [ ] Visual comparison completed: each component pixel-diffed with `--threshold 0.003` (0.3%); all runs exit 0; `diff.png` inspected for every story and contains no red regions
