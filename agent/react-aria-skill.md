---
title: React Aria + Bootstrap Skill
iteration: 0
---

# React Aria + Bootstrap Skill

This file is the single source of truth for the styling-implementation workflow, principles, and visual comparison methodology.

---

## Workflow

### Overview

Goal: Implement Bootstrap-styled React Aria components that visually match the Bootstrap reference stories, verified via pixel diff and vision comparison.

**Visual regression tooling:** `scripts/compare-stories.mjs` (Playwright + pixelmatch) — compares two live stories directly, no baseline management. See [Visual Comparison Workflow](#visual-comparison-workflow).

### Branch naming

- `{experiment-name}` — integration branch
- `{experiment-name}_N` — experiment branches (N = 0, 1, 2, …)

`{experiment-name}` is the current integration branch name (e.g. `sub-agent-styling`).

### Session start

On an experiment branch (`{experiment-name}_N`), load at session start:

1. `agent/react-aria-skill.md` — this document; the single source of truth for workflow and principles
2. `agent/reference-stories/{component}-taxonomy.md` — for each component in this iteration; the `## Decisions` section is authoritative for resolved design decisions
4. `agent/bootstrap-kb/` — Bootstrap reference; load via `README.md` then selectively per component

Then create a TodoWrite enumerating every step in the current phase before doing anything else.

### Phase 1 — Cut experiment branch

Cut `{experiment-name}_N` from `{experiment-name}`. Two first commits:

**1. Create review stub** — `agent/review-styling-iteration-N.md`:

```markdown
---
title: Review — Styling Iteration N
status: in-progress
---

# Review — Styling Iteration N

## Components
(list the component set for this iteration)

## Phase 1 — Scaffolding notes
*(agent fills in)*

## Phase 2 — Implementation notes
*(one entry per component, added after each component is reviewed)*

## User review
*(user fills in during debrief)*

## Principles extracted
*(filled in during debrief — go into `agent/react-aria-skill.md`)*

## Skill update status
- [ ] `agent/react-aria-skill.md` updated
- [ ] Finalized component files merged to `{experiment-name}`
- [ ] `CLAUDE.md` iteration counter incremented (if applicable)
```

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

// Stories to be implemented in Phase 2
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

// Mirror stories implemented in Phase 2 — must match reference story layout exactly
```

Commit message: `chore: stub files for {experiment-name}_N ({Component1}, {Component2})`

**3. Add story globs to `.storybook/main.js`** — add one glob entry per component (e.g. `stories/bootstrap-test/{ComponentName}/**`) in the same scaffolding commit. This must happen before any implementation work begins.

**4. Restart Storybook** — after the scaffolding commit, kill the running Storybook process and start a fresh one:

```bash
# Find the PID listening on port 6006
lsof -ti tcp:6006 | xargs kill -9
# Start fresh instance
yarn storybook &
```

Wait for the new instance to serve `index.json` with the stub story IDs before proceeding to Phase 2. Adding a new glob creates a new webpack entry point that HMR cannot handle — a clean rebuild is required. Doing this once at scaffolding time means Phase 2 only ever makes content changes that HMR handles correctly.

### Phase 2 — Per-component work sequence

Repeat for each component. User review happens after the full component set is complete (Phase 3).

**2a. Read and internalize inputs**

1. Read `agent/reference-stories/{component}-taxonomy.md` in full.
2. Read the `## Decisions` section of the component taxonomy.
3. Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
4. Load Bootstrap KB: `components.md` entry for the matched Bootstrap component → `states.md` → `patterns.md` if a DOM conflict entry exists.
5. **Review all principles in this skill** before writing any code. Flag any principle with structural or sizing implications (P008, P010, P016, P040, P041, P042) — these must be addressed during TSX/bridge implementation, not discovered at diff time.

**2b. Implement TSX**

- Apply `className` render-prop pattern (P002) for Bootstrap classes.
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing the variant set.
- Honor all decisions in the taxonomy's `## Decisions` section; these are pre-resolved — do not re-derive them.
- Apply Bootstrap component classes (P013); reserve utility classes for genuine one-off cases.
- Address all structural and sizing principles identified in step 2a (e.g. P041 hidden sizer for value-displaying triggers).

**2c. Write bridge selectors**

Write **all** bridge selectors in `src/scss/_bootstrap-overrides.scss` (P003) — this is the single location for all React Aria → Bootstrap style bridging. SCSS mixins work here because the file is compiled after Bootstrap's variables and mixins are loaded (P015). Cover all states in the taxonomy's state mappings; follow the data-* bridge rules below.

**2d. Write Storybook stories**

Write two story files per component:

*Standard stories* (`{ComponentName}.stories.tsx`, title `Bootstrap Test/{ComponentName}`):
- Follow `get-storybook-story-instructions` conventions
- `argTypes` with explicit `options` for all string-union props (P029)
- Default, Variants (all values side by side, P030/P032), Disabled, Invalid, WithDescription where applicable (P031)

*Mirror stories* (`{ComponentName}.mirror.stories.tsx`, title `Bootstrap Test Mirror/{ComponentName}`):
- One story per reference story in scope; names must match exactly
- Replicate reference story layout: same wrapper classes (`ref-specimen-row`, `ref-flex-row`), same `specimen()` helper pattern, same variant order
- Include interactive state specimens using `.faux-*` wrappers (P044); these are pixel-diffed alongside static states

**2e. Visual comparison**

Before running pixel diffs, verify stories are rendering: if `index.json` shows story IDs registered but `compare-stories.mjs` times out on them, this is the HMR loop pattern (new entry point added mid-session). Kill and restart Storybook (same procedure as Phase 1 step 4) and confirm rendering before proceeding.

Follow the [Visual Comparison Workflow](#visual-comparison-workflow) section. Fix all fixable deltas before presenting to the user.

**2f. Document in review file**

Add an entry to `agent/review-styling-iteration-N.md` under "Phase 2 — Implementation notes":
- Sub-parts implemented and bridge strategies used
- Visual comparison results: resolved deltas, open design decisions, intentional deviations
- Candidate principles for this skill file

### Phase 3 — Debrief

User reviews styled components in Storybook. Provides observations.

**Write each observation to `agent/review-styling-iteration-N.md` immediately — before replying.** Do not batch, do not defer. Multiple observations in one message → write all before replying.

Both implementation quality and visual comparison methodology are in scope.

### After debrief — Merge to integration branch

1. Update this skill file:
   - Add new principles extracted from debrief (numbered sequentially after current highest)
   - Refine or correct existing principles
   - Update the Visual Comparison Workflow section if the comparison process changed
2. Tick off the Skill Update Status checklist in the review file.
3. Merge finalized files to `{experiment-name}` (file-by-file checkout, not cherry-pick):
   ```bash
   git checkout {experiment-name}_N -- agent/react-aria-skill.md
   git checkout {experiment-name}_N -- agent/review-styling-iteration-N.md
   git checkout {experiment-name}_N -- src/bootstrap-test/{ComponentName}.tsx
   git checkout {experiment-name}_N -- stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx
   git checkout {experiment-name}_N -- stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx
   ```
   Commit to `{experiment-name}`: `feat: merge iteration N styled components ({Component1}, {Component2})`

---

## Multi-Agent Batch Workflow

For batches of multiple components, use a three-tier agent hierarchy.

### Never substitute for a blocked child agent

This rule applies at every level of the hierarchy.

If a child agent cannot proceed — due to a permissions error, context exhaustion, or any other blocker — it must report the blocker to its parent immediately and stop. The parent does the same: it surfaces the blocker to its own parent (or to the user, if it is the primary). No agent silently resolves a blocker or takes over implementation work from a blocked child. Blockers always propagate up to the user.

Specifically:
- **Primary agent:** if a component sub-agent reports a blocker, surface it to the user and stop waiting for that component. Do not implement TSX, bridge CSS, or stories in its place.
- **Component sub-agent:** if a comparison sub-sub-agent reports a blocker, report it to the primary and stop. Do not run the comparison yourself or substitute your own analysis for the sub-sub-agent's diff output.
- **All agents:** a permissions error is a blocker like any other. Report it; do not attempt a workaround.

### Architecture

```
Primary agent (orchestrator)
├── Dispatches component sub-agents — one per component, simultaneously
├── Event loop: advances each component independently as completions arrive
└── Surfaces problems to user; compiles batch report when all done

Component sub-agent (one per component)
├── Reads: this skill doc, component taxonomy (incl. Decisions section), Bootstrap KB index
├── Implements each mirror story (with CSS extraction before each comparison)
├── Maintains component-wide findings doc: agent/reference-stories/{component}-findings.md
├── Dispatches comparison sub-sub-agents (background, one per story)
├── Cycles until all stories Pass or any Stuck / Timeout / Context exhausted
├── Runs final verification sweep when all stories Pass
└── Reports status to primary on completion

Comparison sub-sub-agent (one per story iteration)
├── Runs pixel diff (Playwright + pixelmatch)
├── Reads all three output images (reference, implementation, diff)
├── Identifies failing specimens using the taxonomy
├── Develops and validates a CSS theory using matched CSS + overrides
├── Writes findings to story findings doc
└── Notifies component sub-agent on completion; retires

Final-stories sub-agent (fresh, one per component)
├── Launched by primary after component sub-agent passes final verification sweep
├── Reads: this skill doc, component taxonomy, component-wide findings doc
└── Implements final styled stories
```

### Primary Agent

Dispatch all component sub-agents simultaneously.

**Note:** The harness may cap concurrent background agents. At full scale (primary + 5 component sub-agents + multiple concurrent sub-sub-agents) the total can exceed 25. If the harness queues agents silently, a queued sub-sub-agent may sit long enough to trip the ScheduleWakeup watchdog, producing a false Timeout — recoverable but noisy. Monitor on first real run.

Each sub-agent prompt must be fully self-contained — see Component Sub-Agent Inputs.

**Event loop** (while any component sub-agents are running):

```
on notification from component sub-agent:
  if status == verification-sweep-passed:
    launch fresh final-stories sub-agent for this component (background)

  if status == Stuck, Timeout, or Context exhausted:
    surface to user immediately with component name and stuck story
    continue waiting for other components

  if status == final-stories-done:
    log completion for this component

if all components have reported final-stories-done:
  compile batch report; present to user
```

### Component Sub-Agent Inputs

- This skill doc
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md` (includes `## Decisions` section)
- Bootstrap KB index: `agent/bootstrap-kb/README.md` — load relevant KB files as needed
- Path to mirror stories file: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Path to component findings doc: `agent/reference-stories/{component}-findings.md`

### Story-Level Pipeline

For each mirror story:

1. Implement CSS and write the mirror story
2. Run CSS extraction:
   ```
   node scripts/extract-story-css.mjs \
     --story {mirror-story-id} \
     --out   agent/reference-stories/mirror-css/{component}-{story}.css
   ```
3. Create story findings doc at `agent/reference-stories/{component}-{story}-findings.md`:
   - `Status: In review` / `Iteration: 0` / `Stuck: 0`
4. Launch comparison sub-sub-agent (`run_in_background: true`)
5. Proceed to the next mirror story without waiting

After all stories are implemented, begin the cycling loop.

### Per-Story Findings Doc

**Path:** `agent/reference-stories/{component}-{story}-findings.md`

**Front matter:**

```yaml
Status: In review | Pass | Fail | Stuck | Timeout | Context exhausted
Iteration: <n>
Stuck: <n>
```

**Status transitions:**

- Initial: `In review`
- Sub-sub-agent completes, diff passes: `Status = Pass`, `Iteration++`, `Stuck = 0`
- Sub-sub-agent completes, diff fails, improved: `Status = Fail`, `Iteration++`, `Stuck = 0`
- Sub-sub-agent completes, diff fails, no improvement: `Status = Fail`, `Iteration++`, `Stuck++`
- After rework by sub-agent: `Status = In review`
- When `Stuck` reaches threshold (default: 3): `Status = Stuck`
- Sub-sub-agent detects context compression: `Status = Context exhausted`

**Body (appended per iteration by sub-sub-agent):**

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

### Component-Wide Findings Doc

**Path:** `agent/reference-stories/{component}-findings.md`

**Story Registry** (updated after each sub-sub-agent run):

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| trigger-states | Fail | 2 | 0 | 1.3% |
| open-states | Pass | 1 | 0 | 0.2% |

**Work Log** (per-story, per-iteration, written by sub-agent after each rework):

```
## {story} — Iteration {N}

**Sub-sub-agent findings:** (copied from story findings doc)
- Specimen [label]: [theory + validation]

**Principles consulted:**
- [Cite specific skill principles or component decisions that guided the fix]

**CSS changes made:**
- [selector/property]: [old value] → [new value] (file:line)
- Shared selectors modified: [list] → stories reset to In review and relaunched: [list]
```

### Cycling Loop

Notification-driven. A `ScheduleWakeup` watchdog guards against silent failures.

After all initial stories are implemented:

```
schedule ScheduleWakeup (20 min)

on sub-sub-agent notification:
  read story findings doc
  update component findings registry

  if Status == Stuck or Context exhausted:
    report to primary agent; stop

  if Status == Fail:
    rework CSS per findings
    update story front matter: Status = In review
    update component findings doc (registry + work log)
    re-check CSS change scope — if shared selector modified:
      set affected stories to Status = In review; relaunch their sub-sub-agents too
    re-launch sub-sub-agent (background)
    reset watchdog: schedule new ScheduleWakeup (20 min)

  if Status == Pass:
    if all stories Pass: proceed to Final Verification Sweep
    else: reset watchdog: schedule new ScheduleWakeup (20 min)

on ScheduleWakeup:
  if any stories still In review:
    mark those stories Timeout in registry
    report to primary agent; stop
  else:
    ignore (stale wakeup)
```

`ScheduleWakeup` has no cancel mechanism — the watchdog only fires if no sub-sub-agent has reported in 20 consecutive minutes (the window resets on every notification).

**On context compression (sub-agent level):** If the sub-agent detects that its prior context has been compressed/summarized, report `Context exhausted` to the primary and stop. Detection: earlier messages have been replaced by a summary.

### Final Verification Sweep

After all stories reach `Pass`, launch one final round of sub-sub-agent comparisons across all stories using the same 0.5% threshold. This catches regressions from shared-selector changes that slipped through the cycling loop.

### Final Story Implementations

Handled by a **fresh final-stories sub-agent** launched by the primary after the verification sweep passes.

**Inputs:**
- This skill doc
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md`
- Component-wide findings doc: `agent/reference-stories/{component}-findings.md`
- Story format conventions: call `get-storybook-story-instructions` via Storybook MCP
- Story content principles: this skill doc (specimen layout, state coverage, Bootstrap-specific patterns)

### Sub-Sub-Agent

**Inputs:**
- Mirror story URL: `?path=/story/bootstrap-test-mirror-{component}--{story}`
- Reference story URL: `?path=/story/bootstrap-reference-{component}--{story}`
- Story findings doc: `agent/reference-stories/{component}-{story}-findings.md`
- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md`
- Component mirror stories TSX: `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`
- Bootstrap overrides: `src/scss/_bootstrap-overrides.scss`
- Matched Bootstrap CSS: `agent/reference-stories/mirror-css/{component}-{story}.css`
  — `.faux-*` rules in this file (e.g. `.btn.faux-hover`) define the target visual appearance for interactive states; use them as the reference when assessing the corresponding `[data-*]` bridge rule. See the state mapping table for the `faux-*` → `data-*` correspondence.

**Pixel diff command:**

```
node scripts/compare-stories.mjs \
  --reference {reference-story-id} \
  --impl      {mirror-story-id} \
  --out       .story-diffs/{component}/{story} \
  --threshold 0.005
```

**Pass/fail threshold:** diff% < 0.5% = Pass; ≥ 0.5% = Fail

**Context compression:** If the sub-sub-agent detects that its prior context has been compressed/summarized, write `Status: Context exhausted` to the story findings doc and exit. Detection: earlier messages have been replaced by a summary.

### CSS Extraction Script

```
node scripts/extract-story-css.mjs \
  --story {mirror-story-id} \
  --out   agent/reference-stories/mirror-css/{component}-{story}.css
```

Re-run on every implementation iteration — new selectors may be introduced. Output is git-tracked and overwritten each run.

### Configurable Knobs

| Parameter | Default | Notes |
|-----------|---------|-------|
| Stuck counter threshold | 3 | Consecutive non-improving iterations before Status = Stuck |
| Pass/fail threshold | 0.5% | Diff% cutoff |
| pixelmatch threshold | 0.005 | Per-pixel color sensitivity |

---

## Principles

**Goal:** Replace project CSS with Bootstrap. Bootstrap becomes the source of truth for all or most styling of the React Aria test components.

**P001: compound-sel — Compound selectors:** Retain the `.react-aria-*` class on every element alongside Bootstrap classes for specificity and non-conflicting React Aria CSS. Example: `.react-aria-Button.btn.btn-primary`.

**P002: class-in-tsx — Bootstrap className in TSX:** Style components by adding Bootstrap classes to the `className` attribute. The render-prop callback receives `RenderProps & { defaultClassName: string }` — use `defaultClassName` to preserve the RAC base class:
```tsx
<Button className={({ defaultClassName }) => `${defaultClassName ?? ''} btn btn-primary`.trim()}>
  Click me
</Button>
```
Do not interpolate the callback argument directly (e.g. `(className) => \`${className} btn\``) — `className` is the whole RenderProps object and produces `[object Object] btn`. As an alternative, a plain string that includes the RAC class explicitly also works and is simpler (see P046).

**P003: scss-bridge — SCSS bridge selectors (`_bootstrap-overrides.scss`):** Map React Aria `data-*` attributes to Bootstrap's interaction styles. Bootstrap is authoritative for interaction states.
```scss
// Example: bridge data-hovered to Bootstrap's :hover styles
.react-aria-Button[data-hovered] {
  // paste Bootstrap's .btn:hover rules here
}
```

**P004: conflict-css — Conflicting project CSS:** Comment out (do not delete) any project CSS rules that conflict with a desired Bootstrap rule.

**P005: bundle-isolation — Bootstrap-test stories require bundle-level CSS isolation:** Storybook compiles a single shared CSS bundle — all CSS imported anywhere in the project enters the global scope of every story. Commenting out CSS imports in bootstrap-test components is insufficient: the original stories import the original components, which import their CSS, which then matches `.react-aria-*` selectors everywhere. `@layer` deprioritization is also insufficient — it only arbitrates direct property conflicts; additive project styles (e.g. interaction-state backgrounds) apply unopposed when Bootstrap has no competing rule. The correct fix is a Storybook glob filter that loads only bootstrap-test stories, so no original component is ever imported and no project CSS enters the bundle. Storybook has no native per-story CSS isolation in any current version.

**P006: modifier-audit — Audit Bootstrap's modifier classes before implementing layout or orientation variants:** Bootstrap components often have modifier classes that handle layout variants with their own corrected structural selectors, token values, and border handling (e.g. `.list-group-horizontal`, `.nav-pills`, `.nav-fill`). Before implementing a React Aria layout or orientation variant, check Bootstrap's documentation for matching modifier classes and apply them — don't hand-roll what Bootstrap already provides.

**P007: variant-replace — Bootstrap variants are the authoritative set — replace, don't extend:** When Bootstrap defines variant classes for a component (e.g. `btn-primary`, `btn-success`), its full set is the authoritative prop type. Replace the component library's inherited `variant` type with Bootstrap's variant names (without prefix: `'primary' | 'secondary' | 'success'` etc.), build a `variantClassMap` mapping each to its full Bootstrap class, and remove any variant names with no Bootstrap equivalent (e.g. `quiet`, `ghost`, `cta`). Do not carry forward component-library-specific variants unless intentionally extending Bootstrap — the prop contract should reflect what Bootstrap actually provides. Any component with a `variant` prop must have a Variants story showing all supported values side by side. **Before finalizing the variant set, read the Bootstrap documentation page for that component and identify all meaningful variant classes from it — do not rely on recall.**

**P008: structural-sel — Bootstrap structural selectors break when React Aria inserts wrappers or headers:** Bootstrap uses structural CSS selectors (`:first-child`, `:last-child`, adjacent-sibling `+`) and `inherit` to propagate styles through a predictable parent → child path. React Aria components with sections, groups, or headers insert intermediate elements that sever these paths. `:first-child` on a list item fails when a header is the actual first child; `inherit` on border-radius picks up from the section wrapper rather than the outer container. The fix pattern: use explicit Bootstrap token values (e.g. `var(--bs-list-group-border-radius)`) in targeted bridge selectors rather than relying on Bootstrap's structural selectors firing correctly through React Aria's element tree.

**P009: clean-slate — Comment-out is not a clean slate — assert your own baseline:** Commenting out a project CSS file removes it from that component's import, but the same file may still load via another path (e.g., the original non-bootstrap story imports the original component, which imports its CSS). Any selectors in that file that match your Bootstrap-styled elements will still apply. Do not assume comment-out leaves a blank slate. For every structural property (margin, padding, display, sizing) that Bootstrap's classes expect to control, explicitly set it in the bridge or via Bootstrap utility classes — even if the value is just a reset to zero.

**P010: form-attach — Bootstrap form patterns don't attach to React Aria custom controls:** Bootstrap's form classes (`.form-check-input`, `.form-select`, etc.) target native inputs directly. React Aria's custom controls (Checkbox, Radio, Switch, Slider, Select) hide the native input and expose a custom visual element instead — so Bootstrap's patterns simply don't attach. When you encounter this mismatch, replicate Bootstrap's *visual outcome* on the custom element using bridge selectors and Bootstrap CSS variables. Do not try to force Bootstrap's class structure onto React Aria's markup.

**P011: cursor-pointer — Interactive non-anchor, non-button elements need `cursor: pointer` added explicitly:** Bootstrap interactive components built on `<a>` elements get pointer cursor for free. React Aria replaces many of these with `<div>` or `<span>` elements that carry no native cursor behavior. Any interactive React Aria element that would produce a pointer cursor in the equivalent Bootstrap component must have `cursor: pointer` added in the bridge.

**P012: match-dom — Match Bootstrap's component to React Aria's rendered output, not to the component name:** When choosing which Bootstrap pattern to apply, look at what React Aria actually renders in the DOM — not at naming similarity. React Aria's `Select`, for example, hides the native `<select>` and renders a custom `<button>` + popover + listbox. Bootstrap's `.form-select` targets the native element and doesn't attach; Bootstrap's dropdown (`.btn` + `.dropdown-menu`) matches the rendered structure. Always inspect the rendered output first.

**P013: prefer-component-cls — Prefer Bootstrap component classes and targeted CSS selectors over utility classes:** Utility classes (e.g. `d-flex`, `flex-column`, `w-100`) encode layout decisions in markup rather than in the component's stylesheet. Bootstrap component classes (`form-label`, `dropdown-menu`, `list-group-item`) carry semantic meaning and give the design system a coherent surface to work with and override. When a structural fix is needed, write it in the bridge CSS targeting the component's own selector — not by adding utility classes to the JSX. Reserve utility classes for genuinely one-off cases where no component class exists and a bridge rule would be disproportionate.

**P014: data-pressed — Bridge `[data-pressed]` to `:active` styles for keyboard press support:** CSS `:active` fires on mouse and touch press but not on keyboard activation. React Aria sets `[data-pressed]` for all three. Any `.btn`-based element needs a `[data-pressed]` bridge that mirrors Bootstrap's `:active` rule — otherwise keyboard-triggered press states are visually silent. Example for `.btn`:
```scss
.react-aria-Button.btn[data-pressed] {
  color: var(--bs-btn-active-color);
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
  @include box-shadow(var(--bs-btn-active-shadow));
}
```
This applies to any component using `.btn`, not just Button.

**P015: scss-mixins — Use Bootstrap's SCSS mixins for `$enable-*`-gated properties in bridge selectors:** Bootstrap conditionally emits certain CSS properties through mixins that check `$enable-*` flags — `@include box-shadow(...)` (`$enable-shadows`), `@include transition(...)` (`$enable-transitions`), `@include border-radius(...)` (`$enable-rounded`), `@include gradient-bg(...)` (`$enable-gradients`). Writing these as raw CSS properties in a bridge selector bypasses those flags and produces output the project may have deliberately suppressed (e.g. `$enable-shadows: false` is Bootstrap's default, so a raw `box-shadow:` declaration applies a shadow Bootstrap itself never renders). Since `_bootstrap-overrides.scss` is compiled after Bootstrap's variables and mixins are loaded, use the same mixin Bootstrap uses — not a raw property declaration.

**P016: fixed-dims — Fix explicit dimensions only when the indicator element itself mounts or unmounts:** When a visual indicator appears or disappears on state change (e.g., a checkmark SVG toggling visibility, a badge mounting), the container can shift layout if dimensions aren't held constant. Set explicit `width` and `height` using `rem` units (not `em`, which varies with inherited font-size) so the container occupies the same space regardless of state. Do not apply this to elements that are always present and only change visual treatment (color, border, background) — those should get their size from natural padding and content.

**P017: border-transparent — Prefer `border-color: transparent` over `border-width: 0` for hiding borders; use `outline` as a last resort:** Setting `border-color: transparent` hides a border while keeping it in the box model — no sizing delta between bordered and unbordered states, and `border-width` stays in the cascade so bridge rules can restore a visible border freely. Avoid `border-width: 0` (and Bootstrap's `.border-0` utility, which sets `border-width: 0 !important`) unless you are certain no bridge rule will ever need to restore a border on that element. When `.border-0 !important` is already in play and cannot be removed, use `outline` for any indicator that must appear — `outline` is independent of the border model and unaffected by `border-width` overrides.

**P018: postcss-scope — Scoping Bootstrap to a wrapper class — use `postcss-prefix-selector`, not SCSS nesting:** Never scope Bootstrap via SCSS nesting (e.g. `.bs-scope { @import "bootstrap"; }`). Sass resolves `&` to the full compiled ancestor chain, silently breaking Bootstrap's adjacent-sibling selectors (e.g. `:not(.btn-check) + &:active` becomes `:not(.btn-check) + .bs-scope .btn:active`). Use `postcss-prefix-selector` instead — it operates on compiled CSS output and prepends the scope class correctly. Apply it as a `postcss-loader` step after `sass-loader`. Two edge cases require a `transform` function: `:root` must stay global so `--bs-*` properties resolve everywhere; `[data-bs-theme]` must attach directly to the scope class with no space (`.bs-test[data-bs-theme="dark"]`) because Bootstrap's dark mode attribute is set on the scope wrapper itself.
```js
transform: (prefix, selector) => {
  if (selector === ':root') return selector;
  if (selector.startsWith('[data-bs-theme')) return `${prefix}${selector}`;
  return `${prefix} ${selector}`;
}
```

**P019: outline-base — `btn-outline-{variant}` as a behavioral base for borderless interactive elements:** `btn-outline-{variant}` ships with Bootstrap's full interaction state rules — hover background fill, active background, focus ring. Pairing it with `border-color: transparent` suppresses the visible border at rest while leaving those interaction styles intact. Use this for two categories: (1) grid/list cells (date cells, list items — repeated elements where visible borders add noise); (2) component chrome controls (prev/next, dismiss, expand buttons that live inside a larger component). If a button's job is to be *noticed*, keep the border; if its job is to be *available*, use `border-color: transparent`.

**P020: reboot-align — Bootstrap reboot overrides browser defaults — make alignment explicit:** Bootstrap's `_reboot.scss` resets browser defaults that components may silently rely on. A common case: `th { text-align: inherit }` overrides the browser's default centering of `<th>` elements. Never rely on browser-default alignment when Bootstrap is loaded — declare it explicitly. Common resets to watch: `<th>` text-align, `<fieldset>` border/padding, `<legend>` sizing, `<button>` background/border.

**P021: outline-text-color — `btn-outline-*` sets text color to the variant color, not body color:** `btn-outline-{variant}` sets `--bs-btn-color` to the variant color (e.g. `$secondary` → `#6c757d`). On standalone buttons this is intentional. On cells or list items where readable body text is expected, it produces text that is too light. Fix: explicitly override with `color: var(--bs-body-color)` in the bridge.

**P022: bs-icons — Bootstrap Icons over inline SVG:** When Bootstrap Icons is available, prefer `<i class="bi bi-{name}">` over inline SVG (e.g. lucide-react imports). Bootstrap Icons are an icon font: they inherit `color`, scale with `font-size`, and align with Bootstrap's type scale without extra CSS. Prerequisite: `bootstrap-icons` installed (`yarn add bootstrap-icons`) and CSS imported (`import 'bootstrap-icons/font/bootstrap-icons.css'`). Apply to any icon in the Bootstrap Icons set (https://icons.getbootstrap.com). Do not apply where no equivalent exists or the design requires custom SVG geometry.

**P023: css-native-visual — Let Bootstrap render CSS-native visual elements — don't add a JSX icon:** When Bootstrap renders a visual indicator via a pseudo-element (`::before`, `::after`) or `background-image` (e.g. dropdown caret, checkbox checkmark, breadcrumb separator), do not add a JSX icon alongside it. Remove any existing JSX icon and do not suppress the pseudo-element with `content: none` or similar. Adding both produces duplicates; suppressing Bootstrap's version loses the dark mode and theme token wiring it carries.

**P024: caret-flip — Directional caret flip for expandable elements:** Any caret on an element that opens a popover, dropdown, or disclosure must rotate 180° when open. Read open state from `[data-open]` on the component root or `[aria-expanded="true"]` on the trigger. Use `transform: rotate(180deg)` — do not swap icon variants or toggle icon visibility.

**P025: hardcode-show — Hardcode `.show` on Bootstrap overlay elements:** Bootstrap JS toggles overlay visibility by adding/removing `.show` on elements like `.dropdown-menu`, `.collapse`, and `.modal`. React Aria manages visibility by mounting/unmounting the element instead. When using Bootstrap overlay classes, hardcode `.show` permanently — React Aria's mount/unmount provides the visibility control; `.show` just ensures Bootstrap's visible styles are always active when the element exists in the DOM.

**P026: use-rem — Use `rem` for Bootstrap-matched sizing, not `em`:** Bootstrap sizes fixed UI elements in `rem`, anchored to the root font size. Using `em` causes elements to scale with local font-size context, diverging from Bootstrap's values in nested containers. Only use `em` where Bootstrap itself uses it for intentionally fluid scaling. Example: a checkbox indicator sized `1em × 1em` shrinks inside a smaller-font-size context; `1rem × 1rem` matches Bootstrap's `.form-check-input` regardless of nesting.

**P027: btn-non-button — `btn` on non-`<button>` interactive elements:** Apply `btn` to any non-`<button>` element (e.g. `<td>`, `<div>`) that a component library makes interactive. It provides the correct cursor, padding, focus baseline, and interaction state hooks. Do not rely on the element's native role alone — `btn` is what makes Bootstrap's interaction CSS apply.

**P028: btn-sm-dense — `btn-sm` in grid-constrained contexts:** Prefer `btn-sm` over `btn` when the element lives inside a dense layout (calendar grid, toolbar, inline action row). It reduces padding without custom sizing CSS and keeps elements from overflowing their containers.

**P033: verify-scss-vars — Verify Bootstrap SCSS variables exist and resolve to what you expect before using them:** Do not infer variable names by naming pattern (e.g. `*-hover-color` exists → `*-hover-bg` must exist). Before writing any `$bootstrap-variable` in `_bootstrap-overrides.scss`, confirm it is present in Bootstrap's `_variables.scss` *and* check what it resolves to — names can be misleading (e.g. `$input-focus-color` is the input *text* color when focused, not the focus ring color). When no variable exists for a value, use the equivalent `--bs-*` CSS custom property or a hardcoded Bootstrap token value instead.

**P036: derive-from-counterpart — When a Bootstrap counterpart exists, derive bridge rules from its actual applied CSS:** When a React Aria component has a direct Bootstrap counterpart (e.g. `.form-check-input` for Checkbox, `.form-control` for Input), inspect Bootstrap's compiled CSS or source SCSS for each state and copy the property/variable pattern from it — do not construct bridge rules from variable names alone. Starting from Bootstrap's own rules gives the correct CSS property (e.g. `box-shadow` not `outline` for focus rings), the correct variables, and guards against misleading variable names. This applies even when P010 prevents direct class attachment — the counterpart's CSS is still the reference.

**P034: contrast-all-states — Text labels must maintain ≥ 4.5:1 contrast through all interaction states:** Verify contrast not just at rest but at hover, active, focus, selected, and disabled states. A text color that works at rest may fail against the background Bootstrap applies at hover or active. When a bridge overrides Bootstrap's text color (e.g. to restore body color on an outline element), scope that override to the rest state or extend it across all states so the full interaction state machine maintains sufficient contrast.

**P039: sub-element-counterpart — Extend counterpart identification to every named sub-element:** P012 and P036 establish counterpart identification at the top-level component. Apply the same discipline to every named sub-element in the React Aria component (headers, labels, separators, dividers, footers, action areas). Each sub-element that serves a specific structural or semantic role has a Bootstrap counterpart within the matched Bootstrap pattern — find it and derive the sub-element's styling from its actual CSS. Do not invent styles for sub-elements in isolation. Example: a non-interactive section label within a list → `.dropdown-header` within `.dropdown-menu`, which provides muted color, reduced font-size, padding, and no border — differentiation through typography and color alone.

**P040: container-owns-boundary — Put boundary properties on the container, not on its children:** Bootstrap derives many outer-boundary effects (top/bottom border, border-radius) from structural child selectors (`:first-child`, `:last-child`, adjacent-sibling). P008 established that these selectors break when React Aria inserts wrapper elements. The same failure occurs in any situation where children are not in their expected structural positions: overflow scrolling (scroll removes first/last items from view), section wrappers, or nested groups. The fix is always the same: apply the boundary property — border, border-radius, or both — directly to the outer container element. Item-level borders then serve as internal row separators only; the container's visual frame is self-contained.

**P038: prop-audit-first — Before implementing any component, enumerate its React Aria prop surface from the documentation:** Read the React Aria documentation for the component and list all props before writing any code. Flag any prop with layout, orientation, selection-mode, or variant semantics — these require bridge rules and stories. Do not rely on recall; the documentation is the authoritative prop surface. This mirrors P007 (which requires reading Bootstrap docs before finalizing variants): both the React Aria prop surface and the Bootstrap variant set must be read, not remembered.

**P037: multi-select-separator — Add a visible separator between adjacent selected items in multi-selection components:** When a component supports multiple simultaneous selection and the selected-state style fills the item background, adjacent selected items share the same filled background with no visual break — making them read as a single merged selection rather than discrete selected items. Add a visible separator between adjacent selected items: a border, outline stroke, or gap. This is a visual correctness requirement regardless of whether the underlying Bootstrap component offers multi-selection behavior — the separator need must be identified from the React Aria prop surface (`selectionMode="multiple"` or equivalent) and applied in the bridge.

**P035: no-color-alone — Use a non-color visual attribute as the primary state differentiator:** Do not use a color change alone to convey a state — provide a secondary non-color cue (border, background fill, shape, weight). Two constraints apply simultaneously: (1) WCAG 1.4.1 prohibits relying on color as the sole visual means of conveying information; (2) Bootstrap's semantic color palette has established conventions (primary blue = interactive/link, danger red = error) — repurposing these colors for unrelated states creates visual confusion even where contrast is sufficient. Use a border or background fill as the primary indicator; color accent is additive, not primary.

**P043: visual-metaphor-completeness — Verify that the rendered output reproduces Bootstrap's full visual metaphor, not just individual state properties:** Bootstrap components produce many of their characteristic effects through coordinated CSS across multiple elements — negative margins that create visual connections, pseudo-element indicators, overlapping backgrounds that occlude borders, etc. Correctly bridging color and border-color properties for each state is necessary but not sufficient. After writing all bridge rules, ask: "does the rendered component tell the same visual story Bootstrap intends?" Check the full coordinated effect, not just that each mapped property is correct in isolation. Two categories of properties must both be present: (1) properties Bootstrap applies to all instances of an element (e.g. structural margins, z-index) — these come from Bootstrap's own CSS automatically and must be verified to still work through the React Aria DOM; (2) properties Bootstrap applies via `.active` or state classes — these are not triggered by React Aria and must be explicitly included in the `[data-*]` bridge. A bridge that maps colors and border-color but omits a load-bearing `background-color` can produce individually correct property values while still failing the visual metaphor.

**P041: value-display-stable-dims — A trigger that displays a selected value from a finite option set must size to its widest option, not its current value:** Bootstrap's native `<select>` sizes to the full option set automatically; a custom trigger backed by a `<button>` intrinsically sizes to the currently displayed value and shifts surrounding layout on each selection change. For any component with a finite, enumerable option set (Select, RadioGroup, etc.), embed a visually-hidden `<span aria-hidden="true">` inside the trigger containing all option labels — the longest label sets the intrinsic width and the trigger never reflows. Do not use an external width container, inline style, or `width: 100%` as a substitute; these do not reproduce the native sizing behaviour and P048 prohibits inline styles. This principle applies only to finite option sets; components that accept typed input (ComboBox, DatePicker, etc.) have different sizing constraints addressed separately.

**P042: right-anchor-indicator — In any flex row with a content region and a trailing indicator, pin the indicator to the right edge:** When a flex container holds a label, value, or text region alongside a trailing indicator (caret, chevron, icon, badge), use `justify-content: space-between` on the container or `margin-left: auto` on the indicator. The content region should expand to fill available space; the indicator should not drift with content length. Applies to any flex row with a trailing indicator: trigger buttons, list items, accordion headers, nav links, or similar. P024 addresses caret rotation on open/close; this principle addresses caret placement.

## Data-* Bridge Rules

Bridge a `data-*` attribute in `_bootstrap-overrides.scss` **only when**:
1. No native CSS pseudo-class equivalent exists (e.g., `[data-selected]`, `[data-invalid]`, `[data-indeterminate]`)
2. The element is non-native (e.g., `<div>`, `<td>`) so pseudo-classes don't fire
3. React Aria uses `aria-disabled` + `[data-disabled]` without native `disabled` (element must stay focusable)

**Do not bridge** native pseudo-classes that fire automatically:
- `:hover` on native elements — use `:hover` directly
- `:focus-visible` on native elements — use `:focus-visible` directly
- `:active` on native elements — use `:active` directly
- `:disabled` on native `<input>` elements

## When Bootstrap Mapping Cannot Be Found

If the Bootstrap equivalent for a component or interaction state cannot be identified:
1. Log it in the "Unmapped" section at the bottom of this file
2. List potential alternative Bootstrap sources (similar in appearance or function)

## Stories Conventions

**P029: argtypes-control — Constrained argTypes for string union props:** When a prop is a string union, configure `argTypes` with an explicit `options` array and pick the control type by count: 2–5 values → `control: { type: 'inline-radio' }`; 6+ values → `control: { type: 'select' }`. Do not rely on Storybook's auto-inferred free-text control — it produces an open text field that obscures the valid values.

**P030: layout-variants-story — Layout Variants story:** For any component with layout or orientation variants, add a single "Layout Variants" story showing all non-default permutations inline side by side. Do not add one story per permutation.

**P031: state-stories — State stories:** Add separate stories for `Disabled`, `Invalid`, and `WithDescription` where applicable. These benefit from independent Controls panel manipulation and make state coverage explicit.

**P045: diff-png-required — Analyse all three output images after every pixel diff run — exit code alone is not sufficient:** The default compare-stories threshold (10%) is too lenient to catch localised styling failures like a missing focus ring or background color on a small control in a mostly-white iframe. Always run with `--threshold 0.005` (0.5%) and after every run use the `Read` tool to load `reference.png`, `implementation.png`, and `diff.png` from the output directory and describe what is visible in each. If any of the three files is missing after the script exits, that is a script failure — report it and stop; do not estimate or invent results. A run is only clean when all three files exist, have been read via tool call, and `diff.png` contains no red regions.

**P044: faux-state-class — Simulate non-declarative interactive states in mirror stories using `.faux-*` CSS:** Reference stories simulate interactive states (focus, hover, pressed) using `.faux-*` CSS classes on native HTML elements (e.g. `.faux-focus` on `<select>`). Mirror stories must match this coverage — do not omit an interactive state specimen just because the state cannot be triggered via React Aria props. The pattern: (1) add a `.faux-[state]` bridge rule in `_bootstrap-overrides.scss` (P003) applying the same property values Bootstrap uses for the equivalent native pseudo-class; if the RAC component replaces `className` entirely (preventing the faux class from landing on the component root), wrap the component in a `.faux-[state]-scope` div and scope the bridge rule to that wrapper; (2) wrap the component in the story with that div (or pass `className="faux-[state]"` where the class lands on a stable outer element). This is symmetric with how reference stories fake state on native elements and requires no changes to the component's core API.

**P046: rac-class-replace — RAC replaces `className` entirely when a string is provided — do not assume the default RAC class co-exists:** When a React Aria component receives a plain string `className` (e.g. `className="form-select"`), it renders with only that string as the element's class — the default `.react-aria-{Component}` class is dropped entirely. The default class is only used as a fallback when `className` is `undefined`. Bridge selectors must be written against the provided class, not the default RAC class. Any bridge that relies on `.react-aria-Button` on a trigger that was given `className="form-select"` will never match. Use the RAC component root's own attributes (e.g. `data-trigger="Select"`, `.react-aria-Select`) as the scope anchor instead.

**P047: augments-import — Mirror stories must explicitly import `augments.scss`:** The pixel diff script navigates to each story in isolation — it does not share a bundle with other stories. `augments.scss` loads as a side-effect of reference story imports during a normal Storybook session, but that import chain is not present when the script renders a mirror story alone. Any mirror story that depends on styles from `augments.scss` must import it directly: `import '../bootstrap-reference/augments.scss'`. Omitting this causes visual diffs against the reference that are pure import failures, not styling gaps.

**P048: no-inline-style — Do not use inline `style=` attributes except in the following rare story-harness cases:** (1) `minHeight` on a story container that must reserve vertical space for a floating overlay (popover, dropdown, tooltip, modal) that would otherwise clip outside the iframe; (2) `position: static` (or an equivalent position override) on an element that is normally floated or absolutely positioned, used to place it in document flow for a static specimen display. These exceptions apply only in story files — never in component TSX or bridge CSS. Any use of an inline style must be accompanied by an inline comment explaining why the exception applies, and must be declared in the iteration review notes with the same explanation. Do not use inline styles to paper over a missing CSS implementation, to hard-code a measured pixel value, or to work around a sizing problem that P041 or a bridge selector should solve.

**P032: title-case-labels — Variants story labels must be title-cased — never raw prop strings:** When a Variants story maps over prop values to render each variant (e.g. `{VARIANTS.map(v => <Button variant={v}>{v}</Button>)}`), labels render lowercase because prop values are lowercase strings. Always title-case the label: either capitalize the first letter (`v.charAt(0).toUpperCase() + v.slice(1)`) or use Bootstrap's documented display name. Do not pass the raw prop string as the visible label.

## Self-Review Checklist

Before delivering iteration work, verify:
- [ ] Storybook builds without errors — start a fresh instance and confirm the build output is clean before proceeding (HTTP 200 and story registration are not sufficient; check the actual webpack/sass output)
- [ ] Every test component has Bootstrap classes in its `className` (not just CSS overrides)
- [ ] All `data-*` bridges that are needed are in `_bootstrap-overrides.scss`
- [ ] No project CSS rules that conflict with Bootstrap are left uncommented
- [ ] Unmapped components/states are logged with alternatives
- [ ] All string-union props have constrained `argTypes` (inline-radio, explicit options)
- [ ] React Aria documentation was read for each component; all props with layout, orientation, selection-mode, or variant semantics are implemented with bridge rules and stories (P038)
- [ ] Visual comparison completed: each component pixel-diffed with `--threshold 0.005` (0.5%); all runs exit 0; `diff.png` inspected for every story and contains no red regions

## Visual Comparison Workflow

Before delivering, visually compare each test component against its Bootstrap Reference story and resolve fixable deltas. Do not present raw differences to the user — fix what you can first. Human review should focus on design decisions, not regressions the agent can close independently.

**Storybook URL patterns:**
- Test story:      `http://localhost:6006/?path=/story/bootstrap-test-{component}--example`
- Reference story: `http://localhost:6006/?path=/story/bootstrap-reference-{component}--{story-name}`

Reference story names vary — use the Storybook sidebar under "Bootstrap Reference" to find the relevant story.

### Pixel diff command

Always run with `--threshold 0.005` (0.5%). The default 10% threshold is far too lenient — a missing focus ring or background color on a small control in a mostly-white 1280×900 iframe can easily stay under 10% while being visually wrong.

```bash
node scripts/compare-stories.mjs \
  --reference <reference-story-id> \
  --impl      <mirror-story-id> \
  --out       .story-diffs/<component>/<story> \
  --threshold 0.005
```

The 0.5% threshold gives comfortable headroom over subpixel font rendering noise (which runs ~0.1–0.2% on clean stories) while reliably catching missing styling like a focus ring or background color.

### Fix loop (repeat until clean)

1. Run pixel diff with `--threshold 0.005`
2. If exit code is non-zero **or** exit code is zero: read `diff.png` — the exit code alone is not sufficient. Red regions in `diff.png` identify exactly which pixels differ. No red regions = clean.
3. List every visual difference visible in `diff.png` and in the reference/implementation screenshots
4. Classify each difference:
   - **Fixable** — a CSS/class gap with an unambiguous Bootstrap solution → fix it now
   - **Design decision** — requires a judgment call (e.g. "filled vs. outlined today cell") → flag for user
   - **Intentional** — a documented deviation → note it
5. Apply all fixable fixes, reload, re-run pixel diff, re-read `diff.png` to confirm
6. Repeat until `diff.png` contains no red regions and exit code is 0

### What to compare

**Default (at-rest) state:**
- Typography: font weight, size, color
- Spacing: padding, row/cell gaps
- Color and fill: background, border, text at rest
- Interactive affordance (does it look clickable?)
- Overall size and proportions

**Interaction states:**

For each stateful component, compare the test component's `data-*` state against the reference component's equivalent CSS pseudo-class or Bootstrap state class. Minimum coverage:

| Test state | Trigger method | Reference equivalent |
|---|---|---|
| `[data-hovered]` | `@browser` hover over element | `:hover` |
| `[data-pressed]` | `@browser` javascript_tool: set `data-pressed="true"` on element | `:active` |
| `[data-focused]` | `@browser` Tab key to focus element | `:focus-visible` |
| `[data-selected]` | Navigate to story with selection active | `.active` / Bootstrap selected state |
| `[data-disabled]` | Navigate to Disabled story | `disabled` attribute / `.disabled` class |
| `[data-invalid]` | Navigate to Invalid/WithError story | Bootstrap invalid feedback styling |

For forced states (e.g. `data-pressed`), use `@browser javascript_tool` to temporarily set the attribute on the element, screenshot, then remove it.

### Deliver to user only when

- All fixable deltas (default + interaction states) are resolved and confirmed via re-screenshot
- Remaining items are design decisions or intentional deviations, documented in the Agent Iteration Summary

### Record in review file

In `agent/review-iteration-N.md`, Agent Iteration Summary: add a "Visual Comparison" subsection per component listing:
- Resolved deltas (what was fixed)
- Open design decisions (deferred to user)
- Intentional deviations (documented departures)

## Pattern Library

*Patterns discovered through iteration. Empty until iteration 0 completes.*

## Iteration History

*Updated after each experiment-branch debrief.*

## Unmapped Components / States

*Log components or states where Bootstrap mapping is unclear. Include alternatives.*

| Component | State/Element | Alternatives considered |
|-----------|--------------|------------------------|
| — | — | — |
