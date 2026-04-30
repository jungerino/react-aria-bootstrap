---
title: Review — Iteration 1
iteration: 1
branch: bootstrap-iteration_1
date: 2026-04-30
---

# Review — Iteration 1

## Agent Iteration Summary

### Decisions made

**Button**
- Variants: replaced `'primary' | 'secondary' | 'quiet'` with Bootstrap's full set: 9 solid (`primary secondary success danger warning info light dark link`) + 8 outline (`outline-{color}`). `quiet` removed — no Bootstrap equivalent.
- className: `react-aria-Button btn btn-${variant}` (static string; includes `react-aria-Button` to preserve specificity).
- `ProgressCircle` replaced with Bootstrap spinner (`<span className="spinner-border spinner-border-sm me-2">`).
- `data-variant` attribute removed.
- Bridge: `[data-pressed]` → Bootstrap `:active` token values (keyboard press support).
- Stories: Example (args), Variants (all 9 solid), OutlineVariants (all 8 outline), Disabled, Pending.

**TextField**
- Rewrote to import from RAC directly (no project `Form` components) to avoid CSS bundling.
- `<Label>` → `form-label`, `<Input>` → `form-control`, `<Text slot="description">` → `form-text`, `<FieldError>` → `invalid-feedback`.
- Bridge: `[data-invalid]` on TextField root → red border on Input + `box-shadow` focus ring + `display: block` on `invalid-feedback`.
- Stories: Example, WithDescription, Invalid, Disabled.

**Checkbox**
- Rewrote to import from RAC directly.
- Removed SVG checkmark — Bootstrap renders via CSS `background-image` (CSS-native visual principle).
- Indicator `<div>` receives Bootstrap's form-check-input visual via bridge selectors using Bootstrap's SCSS variables (`$form-check-input-checked-bg-image`, `$form-check-input-indeterminate-bg-image`).
- Root `<label>` gets `form-check` class; layout is `display: flex; align-items: center; gap: 0.5rem` (overrides Bootstrap's padding-based form-check layout since our indicator is inline, not absolutely positioned).
- Bridge: `[data-selected]` → checked visual; `[data-indeterminate]` → indeterminate visual; `[data-invalid]` → red border; `[data-disabled]` → opacity.
- Stories: Example, Checked, Indeterminate, Disabled, Invalid.

**Select**
- Rewrote to import from RAC directly (no project Button/ListBox/Popover/Form imports).
- Trigger button: `btn btn-secondary dropdown-toggle w-100`. No JSX chevron — Bootstrap's `.dropdown-toggle::after` renders the caret via CSS.
- Popover: `dropdown-menu show` (hardcoded `.show` since RAC handles visibility via mount/unmount).
- Items (`SelectItem`): `dropdown-item` on RAC `ListBoxItem`.
- Bridge: caret rotation via `[aria-expanded="true"]::after { transform: rotate(180deg) }`; `min-width: var(--trigger-width)` on Popover; `[data-focused]` and `[data-selected]` on dropdown items.
- Stories: Example (width: 220px wrapper), WithDescription, Invalid, Disabled.

**Tabs**
- `TabList` → `nav nav-tabs`.
- `Tab` → `nav-link` (no `.nav-item` wrapper — Bootstrap CSS targets `.nav-tabs .nav-link` directly, wrapper not required).
- `SelectionIndicator` removed — Bootstrap provides active state via border treatment on `.nav-link`.
- `TabPanels` → `tab-content`.
- `TabPanel` → `tab-pane show active p-3` (hardcoded since RAC unmounts inactive panels by default; only active panel is in DOM).
- Bridge: `[data-selected]` on `.nav-link` → Bootstrap's active border/bg treatment; `cursor: pointer` (Tab renders as `<div>`); `[data-disabled]` → nav-link disabled colors; vertical orientation → custom flex layout.
- Stories: Example (width: 480px), LayoutVariants (horizontal + vertical side by side), Disabled.

**Calendar**
- Rewrote to import from RAC directly (no project Button/Heading/Content imports).
- Replaced `lucide-react` chevrons with Bootstrap Icons `<i class="bi bi-chevron-left/right">`.
- Nav buttons: `btn btn-sm btn-outline-secondary bs-cal-nav` with `border-color: transparent` at rest.
- Cells: `btn btn-sm btn-outline-secondary bs-cal-cell` with `border-color: transparent` at rest; explicit `color: var(--bs-body-color)` override (`.btn-outline-secondary` uses variant text color which is too light).
- Bridge: `[data-selected]` → primary bg/border; `[data-today]` → primary border with bold font; `[data-pressed]` → active bg; `[data-outside-month]` → `visibility: hidden` (preserves grid spacing); `[data-unavailable]` → strikethrough danger color; `[data-disabled]` → opacity.
- Stories: Example, Disabled, WithError.

**ListBox**
- Rewrote to import from RAC directly (no project Text/ProgressCircle imports).
- Removed `lucide-react` Check icon — selection shown via Bootstrap's `.active` background (no checkmark in list-group-item).
- Container: `list-group`.
- Items: `list-group-item list-group-item-action`.
- Section header (`Header`): styled inline in stories via Bootstrap utilities (`fw-semibold small text-secondary bg-body-secondary`).
- Bridge: `cursor: pointer` on items (renders as `<div>`); `[data-selected]` → `.active` list-group token values; `[data-focused]` → hover bg; `[data-disabled]` → disabled color/pointer-events; section header top border.
- Stories: Example (selectionMode=single), Sections (with ListBoxSection + Header), LayoutVariants (single / multiple / none side by side), Disabled.

### Uncertainties

1. **Tabs vertical orientation**: Bootstrap's nav-tabs are horizontally oriented by design. My bridge creates a vertical layout but it may look off compared to Bootstrap's nav-pills (which are the recommended vertical nav component). The `.nav-pills` pattern wasn't applied here to keep consistency with `.nav-tabs`, but a debrief decision is needed on which Bootstrap counterpart to use for vertical tabs.

2. **Select Popover positioning**: RAC's Popover uses Floating UI for positioning via inline `style`. Bootstrap's `.dropdown-menu` also sets `position: absolute` via CSS. These coexist without conflict (inline style wins) but have not been visually verified. The `min-width: var(--trigger-width)` bridge may or may not align correctly with the trigger.

3. **Checkbox layout conflict**: Bootstrap's `.form-check` expects `padding-inline-start` for the indented layout (with absolutely-positioned native input). I overrode this to `padding-left: 0` and used `display: flex` for our inline indicator. This deviates from Bootstrap's structural form-check pattern but is the correct approach given RAC's custom indicator.

4. **ListBox border-radius with sections**: Bootstrap's `:first-child`/`:last-child` selectors apply border-radius to first and last items. When sections/headers are present, these selectors fire on the header element, not the first item. Section items don't get rounded corners. Accepted for now.

5. **TextField `FieldError` rendering**: React Aria's `FieldError` renders even when there's no error message (`{errorMessage}` renders as empty). Bootstrap's `invalid-feedback` always occupies height when `display: block`. This may cause spacing issues when no error is shown. Needs visual verification.

### Unmapped states

| Component | State/Element | Alternatives considered |
|-----------|--------------|------------------------|
| Tabs | Vertical orientation | `.nav-pills` with `flex-direction: column` is Bootstrap's idiomatic vertical nav; `.nav-tabs` vertical is a custom bridge |
| ListBox | `[data-dragging]` (drag-and-drop) | No Bootstrap equivalent; opacity-based visual used |
| Calendar | `[data-in-range]`/`[data-selection-start]`/`[data-selection-end]` | RangeCalendar-specific; not applicable to Calendar |
| All components | Focus ring (`[data-focus-visible]`) | Bootstrap uses `:focus-visible` natively; no bridge needed for native elements, but custom elements may need explicit outline |

## Skill Update Status

- [x] New principles added to `agent/react-aria-skill.md`
- [x] Self-review checklist updated
- [x] `CLAUDE.md` iteration number incremented

## User Visual Review

**Overall score: 3/5**
*(Scale: 1 = a monkey could have done it as well; 5 = perfect, no notes)*

Improvement over iteration 0 (scored 2/5).

---

### Button

**Learning — `[data-pressed]` bridge: use `@include box-shadow()`, not raw `box-shadow:`**
Bootstrap's `box-shadow` mixin is gated on `$enable-shadows` (default: `false`). Writing `box-shadow: var(--bs-btn-active-shadow)` directly in the bridge bypasses this flag and applies a shadow Bootstrap itself suppresses by default. Correct approach: `@include box-shadow(var(--bs-btn-active-shadow))`.

*Applied:* General principle added to `react-aria-skill.md`; Button-specific note added to `component-decisions.md` on `main`. No code change in this iteration.

**Learning — Variants story labels should be title-cased, not raw prop strings**
The Variants story maps over `SOLID_VARIANTS` and uses the variant name as the label (`{v}`). Since prop values are lowercase strings, all labels render lowercase. Labels should be title-cased.

*Applied:* General principle added to `react-aria-skill.md` (Stories Conventions); Button-specific note added to `component-decisions.md` stub (to be reconciled to `main` at end of iteration). No code change in this iteration.

## Debrief Decisions

*To be filled in after debrief.*
