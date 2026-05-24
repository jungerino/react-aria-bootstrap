---
title: Review — Styling Iteration 0
status: in-progress
---

# Review — Styling Iteration 0

## Components

- Button
- Select

## Phase 1 — Scaffolding notes

- Cut `styling-implementation_0` from main. First commit stubbed: `src/bootstrap-test/Button.tsx`, `src/bootstrap-test/Button.css`, `stories/bootstrap-test/Button/Button.stories.tsx`, `stories/bootstrap-test/Button/Button.mirror.stories.tsx`, `stories/bootstrap-test/Select/Select.mirror.stories.tsx`.
- Storybook glob in `main.js` widened to cover all `stories/bootstrap-test/**` stories (not just `stories/`).
- Mirror story stubs had incorrect `_decorators` import path (`../../_decorators` instead of `../_decorators`) — fixed in Phase 2d when Storybook build failed. Both Button and Select stubs corrected.

## Phase 2 — Implementation notes

### Button

**TSX (`src/bootstrap-test/Button.tsx`):**
- `variant` prop covers 16 values: 8 solid (`primary`…`dark`), 8 outline (`outline-primary`…`outline-dark`), plus `link`. Defaults to `primary`.
- `size` prop: `'sm' | 'lg'` (optional). Not in component-decisions.md but present in taxonomy — added for completeness.
- Bootstrap classes applied via `composeRenderProps` on `className` (pattern P002): `react-aria-Button btn {variantClass} {sizeClass}`.
- Pending state: `composeRenderProps` on children — hides children when `isPending`, shows `<span class="spinner-border spinner-border-sm">`. Intentional deviation from reference (which shows spinner + "Loading…" text); matches React Aria vanilla CSS pattern.

**CSS (`src/bootstrap-test/Button.css`):**
- Comment-only: all interactive states (hover, focus, active, disabled) use native CSS pseudo-classes so no bridge selectors needed.

**SCSS (`src/scss/_bootstrap-overrides.scss`):**
- Added `[data-pressed]` bridge for `.react-aria-Button` using Bootstrap's `@include box-shadow()` mixin (P014/P015 patterns).

**Stories (`stories/bootstrap-test/Button/Button.stories.tsx`):**
- Uses untyped `Meta` (typed `Meta<typeof Button>` caused TS errors — `@types/react` is intentionally absent).
- Stories: Default, SolidVariants, OutlineVariants, Sizes, Disabled, Pending.

**Mirror stories (`stories/bootstrap-test/Button/Button.mirror.stories.tsx`):**
- 3 stories matching reference layouts: ColorVariantsSolid, ColorVariantsOutline, Sizes.
- No States mirror story — faux state classes can't replicate React Aria interactive states; use vision comparison for States.
- `specimen()` helper and `ref-specimen-row`/`ref-align-center` layout classes match reference exactly.

### Select

**TSX (`src/bootstrap-test/Select.tsx`):**
- `Select<T, M>` generic component wraps `AriaSelect`, `Button`, `Label`, `FieldError`, `Text`, `Popover`, `ListBox`.
- Trigger class built manually: `['react-aria-Button', 'form-select', size ? `form-select-${size}` : ''].filter(Boolean).join(' ')`. Must include `react-aria-Button` explicitly — any `className` passed to RAC replaces the default class rather than merging.
- `SelectValue` left unstyled inside the trigger; `.form-select` background-image provides the caret (P023).
- `FieldError` always rendered; CSS controls visibility (`display:none` → `display:block` under `[data-invalid]`).
- Popover gets `dropdown-menu show` hardcoded — React Aria controls visibility via mount/unmount, not CSS display (P025).
- `SelectItem` uses `composeRenderProps` to apply `dropdown-item`, `active` (when `isSelected`), `disabled` (when `isDisabled`).
- `textValue` auto-derived from string children so keyboard search works.

**CSS (`src/bootstrap-test/Select.css`):**
- Root: `display:block; position:relative`.
- Label: `display:inline-block; margin-bottom:0.5rem` (mirrors `.form-label`).
- Trigger text-align override: `.form-select` alone sets `display:block; width:100%` but button default is `text-align:center` — overrode to `text-align:start`.
- SelectValue text overflow: `display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap`.
- Placeholder muted color: `[data-placeholder]` → `var(--bs-secondary-color)`.
- Disabled bridge: `[data-disabled]` on root → trigger gets `color/bg/border-color` from `--bs-form-select-disabled-*` tokens; `:disabled` pseudo-class is INERT in RAC.
- Invalid bridge: `[data-invalid]` on root → trigger border-color, bg-icon (X icon inline SVG), expanded padding-right; `.is-invalid` is INERT in RAC.
- FieldError: `display:none` base + `display:block` under `[data-invalid]`; did not use `.invalid-feedback` (Bootstrap sets that to `display:none` unconditionally).
- Popover: `min-width: var(--trigger-width)` — RAC sets this CSS var on the Popover element.
- ListBox: reset `padding:0; outline:none; margin:0; list-style:none`.
- Item hover/focus: `[data-focus-visible]` → dropdown hover colors.
- Selected item lock: `.active:hover/focus/[data-hovered]/[data-focus-visible]` → active colors (prevents hover from overriding selection color).
- Disabled item: `.disabled` → disabled color, `pointer-events:none`.

**Stories (`stories/bootstrap-test/Select/Select.stories.tsx`):**
- Stories: Default (with `argTypes`), WithValue, Sizes, Disabled, Invalid, WithDescription, WithDisabledItem.
- Uses untyped `Meta` (same `@types/react` absence issue as Button).

**Mirror stories (`stories/bootstrap-test/Select/Select.mirror.stories.tsx`):**
- 5 stories matching reference export names: `TriggerStates`, `OpenDropdown`, `InvalidState`, `SizeVariants`, `FullField`.
- `TriggerStates`: initially 3 specimens (placeholder, with value, disabled) — Focus specimen was incorrectly omitted. Fixed post-review: added Focus specimen using `.faux-focus` class on the root (P044); added `.faux-focus` bridge rule to `Select.css` and `[data-focused]` bridge alongside it.
- `OpenDropdown`: `defaultOpen shouldCloseOnSelect={false}` — pixel diff not run (popover is absolutely positioned; reference uses static inline layout); vision comparison only.
- `InvalidState`, `SizeVariants`, `FullField`: pixel-diffed.

**Issue identified during user review:** Pixel diff passed (0.89%) but stories did not visually match — TriggerStates had 3 specimens vs 4 in the reference (missing Focus), and the pixel diff threshold (10% of full iframe) was too lenient to catch localised layout differences. Fix: omitting interactive state specimens is not acceptable even when the state cannot be set via React Aria props — use `.faux-*` CSS class simulation instead (P044).

**Additional fixes post-review:**
- Disabled specimen: changed to `defaultSelectedKey="apple"` to match reference (which shows first non-disabled option auto-selected by the browser). Confirmed `defaultValue` is not a typed RAC Select prop; `defaultSelectedKey` is correct.
- Note: `defaultValue` used in existing stories (Select.stories.tsx, mirror story WithValue specimen) appears to work at runtime despite not being typed — investigate separately.

**Remaining known deviations in TriggerStates:**
- Default specimen shows "Choose an option" (placeholder text); reference shows "Apple" (native `<select>` auto-selects first enabled option when no value is set). Our behavior is more correct to the label "Default (placeholder showing)" — this is a difference in native vs. custom element behavior, not a styling bug.
- Trigger width: mirror triggers size to current displayed value (button intrinsic sizing); reference triggers size to the longest option text (native select intrinsic sizing). This is P041 territory — architectural difference, not a CSS issue.

**Pixel diff results (final):**
| Story | Diff pixels | % | Result |
|---|---|---|---|
| TriggerStates | 5013 / 548800 | 0.91% | PASS |
| InvalidState | 481 / 548800 | 0.09% | PASS |
| SizeVariants | 910 / 548800 | 0.17% | PASS |
| FullField | 752 / 548800 | 0.14% | PASS |
| OpenDropdown | — | — | vision only |

## User review

Debrief focused on workflow correctness rather than visual output:

- **Styles in wrong location:** Select bridge styles were written in `src/bootstrap-test/Select.css` (imported from the TSX) instead of `src/scss/_bootstrap-overrides.scss`. Root cause: the protocol's Phase 2c contradicted P003 in the skill. The agent followed the protocol.
- **Protocol vs skill conflict:** The styling-implementation-protocol.md was a second source of truth that duplicated and in places contradicted the skill. Resolved by consolidating the protocol's workflow content into the skill as a `## Workflow` section, then deleting the protocol file.
- **Trigger width (P041):** Mirror triggers are narrower than reference triggers because the RAC `<button>` sizes to its current value, not the longest option. The P041 hidden sizer approach was identified as the correct fix for the next iteration. Hardcoded inline width was rejected.
- **Faux-focus pattern (P044):** `.faux-focus` class on the component root doesn't work because RAC's `className` prop replaces the default class. Correct pattern: `.faux-focus-scope` wrapper div; bridge rule scoped to that wrapper in `_bootstrap-overrides.scss`.

## Principles extracted

Principles added or updated on this branch:

- **P044 updated:** faux state bridge rules go in `_bootstrap-overrides.scss` (P003); when RAC replaces `className` entirely, use a `.faux-[state]-scope` wrapper div in the story and scope the bridge rule to that wrapper.
- **P045 added:** Read `diff.png` after every pixel diff run — exit code alone is not sufficient. Always use `--threshold 0.005`. A run is only clean when `diff.png` contains no red regions.
- **Workflow section added to skill:** Consolidated from the deleted `styling-implementation-protocol.md`. Phase 2a now explicitly requires reviewing all structural/sizing principles (P008, P010, P016, P040, P041, P042) before writing any code.

## Skill update status

- [x] `agent/react-aria-skill.md` updated
- [x] Finalized component files merged to `styling-implementation`
- [ ] `CLAUDE.md` iteration counter incremented (if applicable)
