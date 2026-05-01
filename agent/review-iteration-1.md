---
title: Review — Iteration 1
---

# Review — Iteration 1

## Agent Iteration Summary

### Decisions made

**Button**
- Applied full Bootstrap variant system: 9 solid variants (`btn-primary` … `btn-link`) + 8 outline variants (`btn-outline-*`). `VARIANT_CLASSES` record maps each `BootstrapVariant` to its Bootstrap class.
- Pending state: used Bootstrap spinner (`spinner-border spinner-border-sm`) via `composeRenderProps` — hides label text while spinner is shown, consistent with Bootstrap loading-button pattern.
- Disabled state: RAC keeps element focusable via `aria-disabled`; bridge selector adds `opacity: var(--bs-btn-disabled-opacity)` + `pointer-events: none` rather than HTML `disabled` attribute.
- Pressed state (`[data-pressed]`): bridges keyboard activation gap — CSS `:active` only fires on mouse/touch, not keyboard Space/Enter. Applied Bootstrap `--bs-btn-active-*` tokens.
- `className` set directly (no `composeRenderProps`) since no per-state class variation is needed beyond variant.

**TextField**
- Applied `.form-control` to `<Input>`, `.form-label` to `<Label>`, `.form-text` to description `<Text slot="description">`, `.invalid-feedback` to `<FieldError>`.
- Invalid state: `[data-invalid]` on the RAC container targets the child input via compound selector. Inlined the Bootstrap SVG warning icon as a `background-image` data URI to match Bootstrap's native `.is-invalid` icon. `invalid-feedback` display forced to `block` via bridge selector (normally only shown inside a parent with `.was-validated` or `.is-invalid`).

**Checkbox**
- Used a custom `checkbox-indicator` div (with SVG inside) instead of a native `<input type="checkbox">`, because RAC Checkbox renders as a `<label>`-wrapping custom element with its own focus/selection state.
- `form-check` on the outer element provides layout. `form-check-label` on the text `<span>`.
- `Checkbox.css`: indicator is 1rem × 1rem box, border from `--bs-border-color`, SVG checkmark/dash hidden at rest and shown via `[data-selected]` / `[data-indeterminate]` bridge selectors.
- RAC Checkbox render prop parameter typed explicitly as `{ isIndeterminate: boolean }` to satisfy TypeScript (RAC's inferred type was ambiguous in this context).
- Selected/indeterminate: fill indicator with `--bs-primary`; show SVG.
- Hover/focus: border highlight + Bootstrap focus-ring on indicator.
- Disabled: `opacity: 0.5` + `cursor: not-allowed` on container; indicator filled with `--bs-secondary-bg`.

**Select**
- Used RAC `Button` as the dropdown trigger with `.btn.btn-secondary.dropdown-toggle` — Bootstrap's `::after` pseudo-element caret is included automatically.
- Caret rotation on open: `[data-open] .dropdown-toggle::after { transform: rotate(180deg) }` — Bootstrap JS normally handles this via `.show`; we replace it with the RAC state attribute.
- `SelectValue` inside trigger button renders selected option text (or placeholder text when nothing selected).
- Popover contains a `ListBox` styled as `.dropdown-menu.show` — no JS toggle needed because RAC controls display.
- `ListBoxItem` styled as `.dropdown-item`, selected item gets `.active`.
- `[data-focused]` bridge for hover-equivalent on non-native items.
- Key discovery: RAC's `Label` component renders as `<span>`, not `<label>`. Bootstrap's `.form-label` CSS does not apply `display: block` to spans. Bridge fix: `.react-aria-Select { display: block; .form-label { display: block; } }`.

**Tabs**
- `TabList` → `.nav.nav-tabs`; `Tab` → `.nav-link` with conditional `.active` / `.disabled` via render prop.
- `TabPanels` → `.tab-content`; `TabPanel` → `.tab-pane.active` (RAC mounts only the active panel, so `.active` is always appropriate on the rendered panel).
- Removed `SelectionIndicator` (project component) — Bootstrap underline comes from `.nav-tabs .nav-link.active` CSS.
- Hover and focus-visible bridged for Tab items (non-native `<div>` elements).

**Calendar**
- Nav buttons: RAC `Button` with `slot="previous"` / `slot="next"` + `.btn.btn-sm.btn-outline-secondary`. Border hidden at rest via bridge; shown on hover.
- Replaced lucide `ChevronLeft/Right` with Bootstrap Icons (`bi bi-chevron-left/right`) as specified by the setup.
- Day grid: `CalendarGrid weekdayStyle="short"` → produces "Sun Mon Tue Wed Thu Fri Sat" labels via `Intl.DateTimeFormat`. `CalendarHeaderCell` styled as `.calendar-header-cell`.
- Calendar cells: `AriaCalendarCell` with `.btn.btn-sm.btn-outline-secondary.calendar-cell`; border hidden at rest, shown on hover.
- `[data-today]`: filled primary background + white text + bold — matches Bootstrap's convention for highlighting the current date.
- `[data-selected]`: filled primary background + white text.
- `[data-outside-month]`: secondary color + 0.5 opacity.
- Used `CalendarGridHeader + CalendarGridBody` inside a single `CalendarGrid` (new RAC API). Old function-as-children API mixes incompatibly with header/body split.

**ListBox**
- Container: `.list-group` on `<ListBox>`.
- Items: `.list-group-item.list-group-item-action` on `<ListBoxItem>`.
- `[data-focused]`: `--bs-list-group-action-hover-*` tokens.
- `[data-selected]`: `--bs-list-group-active-*` tokens (blue background + white text).
- `[data-disabled]`: `--bs-list-group-disabled-*` tokens + `pointer-events: none`.
- `Sections` story uses RAC `Section` + `Header` for grouped items.

---

### Uncertainties

1. **Select button width** — The trigger button is `display: inline-block` (Bootstrap's `.btn` default). Some Select patterns use `width: 100%` so the button spans the form width. No `w-100` was added; the button sizes to its content. This may need adjustment depending on how it's used in real forms.

2. **Calendar day-of-week label format** — The reference Bootstrap Calendar story uses 2-letter labels ("Su Mo Tu We Th Fr Sa"), but these are not produced by any standard `Intl.DateTimeFormat` format in English. After setting `weekdayStyle="short"`, React Aria produces 3-letter "Sun Mon Tue Wed Thu Fri Sat". This is more readable but differs from the reference. The reference labels may be a Bootstrap-specific convention or a different locale. Deferred to user.

3. **Checkbox indicator sizing** — The `checkbox-indicator` div is 1rem × 1rem, matching the Bootstrap native checkbox input size. SVG scales proportionally. Not verified at non-default font sizes.

4. **Tabs `TabPanel` always has `.active`** — RAC only renders the selected panel to the DOM, so `.tab-pane.active` is always correct on the rendered panel. If RAC ever pre-renders hidden panels, this would need to be made conditional.

---

### Unmapped states

| Component | State | Notes |
|-----------|-------|-------|
| Button | Focus-visible ring | Not bridged — `:focus-visible` fires natively on `<button>`. Behavior confirmed as equivalent. |
| TextField | Read-only | `[data-readonly]` not bridged — browser's default `readonly` appearance handles it; Bootstrap has no utility class for this. |
| Select | Disabled trigger | `AriaSelect[data-disabled]` not bridged; RAC propagates `aria-disabled` to the button which already has a `[data-disabled]` bridge. |
| Calendar | `[data-unavailable]` | Dates outside min/max. RAC sets both `[data-unavailable]` and `[data-disabled]`; the disabled bridge handles the visual treatment. |
| ListBox | `[data-dragging]` | Drag-and-drop state. No Bootstrap equivalent; not bridged. |

---

### Visual comparison

**Button** — Clean. All solid and outline variants correct. Link variant renders as underlined text-color button. Disabled and pending states match Bootstrap behavior.

**TextField** — Clean. Invalid state shows Bootstrap SVG warning icon in input and red border. Error message visible below input. Description renders as `.form-text`.

**Checkbox** — Clean. Checked, indeterminate, disabled, and hover states all correct. SVG indicator matches Bootstrap's check and dash shapes.

**Select** — Delta resolved: label was rendering inline with the trigger button. Root cause: RAC renders `Label` as `<span>`, not `<label>`, so Bootstrap's `.form-label` `display: block` does not apply. Fixed with bridge selector on `.react-aria-Select .form-label`. Label now stacks above button.

**Tabs** — Clean. Active tab has bottom-border underline. Disabled tab muted. Hover state on non-active tabs correct.

**Calendar** — Two deltas resolved:
1. Day header labels changed from narrow single letters (S/M/T) to 3-letter short format (Sun/Mon/Tue) via `weekdayStyle="short"`.
2. Today cell changed from bold-only to filled primary background + white text + bold.
- Open design decision: reference uses 2-letter labels (Su/Mo) sourced from custom Bootstrap HTML, not a standard `Intl` format. The 3-letter "short" format was used as the closest available approximation.

**ListBox** — Clean. Single-selection, multiple-selection, section headers, and disabled items all render correctly with Bootstrap list-group styling.

---

## User Visual Review

> **Note:** This iteration was ended before completion. After reviewing Button and Calendar, the user identified process improvements to make before continuing. Findings recorded here represent a partial debrief only. A fresh iteration will follow.

**Overall rating: 3/5** (iteration 0 was 2/5)
_(scale: 1 = a monkey could have done it as well; 5 = perfect, no notes)_

**Button** — Looks right.

**Calendar**
- Date cells: reference is 36×31px (wider than tall, Bootstrap `.btn-sm` natural padding); test is 32×32px (square — agent applied fixed-dimensions principle without measuring reference). **Prefer reference dimensions.** Agent diagnosed fixed-dimensions principle as overapplied — date cells don't qualify as state-toggled visual indicators; their presence is constant, only their styling changes.
- Day header labels: reference is 12px / 400 weight; test is 16px / 600 weight (agent did not set explicit font-size or font-weight on `CalendarHeaderCell`; `<th>` defaults applied). **Prefer reference size and weight — more elegant, less cramped.**

---

## Debrief Decisions

_To be filled during debrief session._

| Decision | Destination |
|----------|-------------|
| `argTypes` control type threshold: 2–5 values → `inline-radio`; 6+ values → `select` | `react-aria-skill.md` ✓ |
| Fixed-dimensions principle refined: apply only when indicator element mounts/unmounts, not when only visual treatment changes | `react-aria-skill.md` ✓ |

---

## Skill Update Status

- [ ] `agent/react-aria-skill.md` updated with new principles
- [ ] `agent/component-decisions.md` updated with component-specific decisions
- [ ] `CLAUDE.md` iteration number incremented
