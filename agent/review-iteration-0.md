---
title: Review — Iteration 0
iteration: 0
branch: bootstrap-iteration_0
date: 2026-04-25
---

# Review — Iteration 0

This file records the full review cycle for iteration 0: the agent's self-reported iteration summary, the user's visual review observations in Storybook, and all decisions reached during the debrief. It is the source of truth for skill and decision updates applied at the end of this iteration.

---

## Agent Iteration Summary

### Decisions made

**Button**
Applied `btn btn-{variant}` (primary → `btn-primary`, secondary → `btn-secondary`, quiet → `btn-link`). Destructured `variant` out of props so it is not forwarded to the DOM. Commented out `../Button.css`. No `data-variant` needed since Bootstrap uses classes for variants. `[data-pending]` state (loading spinner) was left as-is — Bootstrap has no native button-loading pattern.

**TextField**
Commented out `../TextField.css`. Applied `form-label` to Label, `form-control` to Input, `form-text` to Description, `invalid-feedback d-block` to FieldError. Added `mb-3` to the AriaTextField root for field group spacing. The `d-block` is required because Bootstrap hides `.invalid-feedback` by default and we do not add `.is-invalid` dynamically to the input — instead the bridge selector applies the error border via `[data-invalid]` on the parent.

**Checkbox**
Commented out `../Checkbox.css`. Bootstrap's `.form-check` pattern is a hard mismatch: it targets native `<input type="checkbox">` inside a `<label>`, but React Aria renders a `<label>` root with a custom `<div class="indicator">` SVG child. Applied `d-inline-flex align-items-center gap-2` for layout instead of `form-check`. The indicator div is styled entirely via SCSS bridge selectors using Bootstrap CSS variables (`--bs-primary`, `--bs-border-color`).

**Select**
Commented out `../Select.css`. Changed `Button` import from `../Button` to `./Button` so the trigger gets Bootstrap's `btn btn-secondary` styling. Added `form-label` to the Label and `mb-3` to the root. The `DropdownListBox`, `DropdownItem`, and `Popover` sub-components still come from `../ListBox` and `../Popover` — they retain project CSS for this iteration.

**Tabs**
Commented out `../Tabs.css`. Applied `nav nav-tabs` to TabList, `nav-link` to Tab, `tab-content` to TabPanels, `tab-pane p-3` to TabPanel. Removed `SelectionIndicator` — Bootstrap's `nav-tabs` conveys selection via a bottom border on the active tab, applied via the `[data-selected]` bridge selector.

**Calendar**
Changed `Button` import from `../Button` to `./Button`. Applied `btn btn-sm btn-outline-secondary border-0` to CalendarCell. Added Bootstrap flex utilities to the header. Kept `../Calendar.css` active because Bootstrap has no calendar grid layout equivalent — removing it would break cell sizing. Visual rules in `Calendar.css` conflict with `.btn` (border-radius: 9999px vs rectangular btn). Logged as uncertainty.

**ListBox**
Commented out `../ListBox.css`. Applied `list-group` to AriaListBox and `list-group-item list-group-item-action` to ListBoxItem. Removed the `Check` icon from `DropdownItem` — Bootstrap's `[data-selected]` bridge handles selection via background color. `DropdownListBox` and `DropdownItem` retained project class names since they serve the Select dropdown panel.

### Uncertainties raised

1. **`d-block` on `invalid-feedback`** — Bootstrap hides `.invalid-feedback` unless `.is-invalid` is present on a sibling input. We force `d-block` and rely on the bridge for the error border. Bypasses Bootstrap's paired `.is-invalid` / `.invalid-feedback` pattern — is this acceptable?
2. **Select trigger appearance** — The trigger uses `btn btn-secondary`. A native Bootstrap `<select>` would use `.form-select`. Would `.form-select` + `.dropdown-toggle` be more appropriate?
3. **`Description` className override fragility** — `Description` from `../Form` hardcodes `className="field-description"`, then spreads `{...props}`. Passing `className="form-text"` overrides it due to spread order. If the component is refactored, the override will silently stop working.
4. **CalendarCell `.btn` + `Calendar.css` conflict** — `Calendar.css` sets `border-radius: 9999px` on `.react-aria-CalendarCell`. Bootstrap's `.btn` sets rectangular border-radius. Both are loaded simultaneously.

### Unmapped states

| Component | State/Element | Alternatives considered |
|-----------|--------------|------------------------|
| Button | `[data-pending]` loading state | Bootstrap `.spinner-border` inside button; no native Bootstrap button-loading class |
| Calendar | No Bootstrap calendar component | Bootstrap table utilities for grid; `.btn-sm` for cells; `Calendar.css` must stay for layout |
| CalendarCell | `[data-focused]` on `<td>` | Unclear if `:focus-visible` fires on `<td>` with `.btn`; needs visual confirmation |
| Select | `DropdownListBox` / `DropdownItem` popover panel | Bootstrap `.dropdown-menu` + `.dropdown-item`; not applied — sub-components from `../ListBox` |
| ListBox | `ListBoxSection` / `Header` | `.list-group-item.disabled` as header workaround; no native section grouping |
| Tabs | `[data-disabled]` on Tab | `.nav-link.disabled` class; bridge via `pointer-events: none; opacity: 0.65` |

---

## User Visual Review

**Overall impression: 2/5** (scale: 1 = a monkey could have done it as well; 5 = perfect, no notes)

### Button

**Positive:** Variant selector and Variants story well set up.

**Issues:**
1. Buttons not receiving border-radius — inspector shows `--bs-btn-border-radius` as undefined (**resolved by `_root.scss` fix**)
2. Outline variants have no visible borders — inspector shows `--bs-btn-border-width` as undefined (**resolved by `_root.scss` fix**)
3. `:active` styling only applies to the first button in a row; non-first-child buttons show no background change on press (confirmed via inspector RGB values, not visual estimate)
4. (Reference) Correct Bootstrap button variants: https://getbootstrap.com/docs/5.3/components/buttons/#variants

**Root cause of issue 3 (resolved):** Bootstrap's active selector compiled inside `.bs-test { @import "buttons"; }` produces a broken adjacent-sibling rule. The SCSS `&` in `:not(.btn-check) + &:active` resolves to the full ancestor chain, yielding `:not(.btn-check) + .bs-test .btn:active` instead of the intended `.bs-test :not(.btn-check) + .btn:active`. Only `&:first-child:active` compiled correctly. Fixed by switching to `postcss-prefix-selector`, which operates on compiled CSS and adds `.bs-test` as a plain ancestor without disturbing combinator chains.

**Follow-on for iteration 1:** Add a `[data-pressed]` bridge for `.btn` in `_bootstrap-overrides.scss` that mirrors Bootstrap's `:active` rule. This handles keyboard press (which sets `[data-pressed]` but never triggers CSS `:active`) and makes the pressed state explicit and reliable regardless of DOM position. Rule to add: `.react-aria-Button.btn[data-pressed] { color: var(--bs-btn-active-color); background-color: var(--bs-btn-active-bg); border-color: var(--bs-btn-active-border-color); box-shadow: var(--bs-btn-active-shadow); }`

### TextField

**Positive:** Label, input, description, error state, and disabled state all render correctly.

**Issues:**
1. `.form-label` receives dark text in dark mode. Same root cause as Select finding #1 — project CSS overrides Bootstrap's theme-aware `--bs-body-color`. Fix: global bridge rule `color: var(--bs-body-color)` on `.form-label` (already decided under Select).

### Checkbox

**Positive:** Mapping Bootstrap's checkbox appearance onto `.indicator` (rather than the hidden native input) is the correct approach.

**Issues:**
1. `utilities.css` specular highlight and gradient box-shadows bleed through onto `.indicator`. Suppress with `box-shadow: none` in the bridge for both default and selected states.
2. Checkmark SVG should be replaced with Bootstrap Icons (`bi-check` / `bi-dash`). Consistent with the Bootstrap Icons principle; requires `bootstrap-icons` package.
3. Component shifts down by a few pixels when `data-selected="true"`. Likely utilities.css box-shadow interaction or icon display change affecting indicator layout. Fix in iteration 1 — ensure indicator has state-invariant fixed dimensions.
4. Label text is too light in light mode. Inheriting a project CSS color variable rather than `--bs-body-color`. Add `color: var(--bs-body-color)` to `.react-aria-Checkbox` in the bridge.
5. Indicator is 14×14px; should be 16×16px per Bootstrap. Change `width: 1em; height: 1em` to `width: 1rem; height: 1rem` in the bridge.

### Select

**Issues:**
1. `.form-label` receives dark text in dark mode. Bootstrap's `.form-label` should inherit `--bs-body-color` (light in dark mode), but project CSS is overriding it with a non-theme-aware color. Fix: add `color: var(--bs-body-color)` to a bridge rule for `.form-label` in the Select context (or globally, since this affects any component using `.form-label` — see TextField). Same class of issue as Checkbox finding #4, but inverse (dark text in dark mode vs. too-light text in light mode).
2. `.react-aria-Popover.select-popover` has unwanted padding causing overflow. Fix: apply Bootstrap's `.dropdown-menu` class to the popover and ensure project legacy CSS does not override it (project CSS defines `.dropdown-item` which leaks into the bundle and introduces conflicting rules).
3. `.dropdown-item` class collision: both the project (`ListBox.css`) and Bootstrap define `.dropdown-item`. The project's version is leaking in via the shared bundle and applies unwanted margins and padding to dropdown items. Fix: Bootstrap's `.dropdown-item` rules must win — either via specificity (compound selector), explicit resets in the bridge, or (iteration 1) the glob filter that removes project CSS from the bundle entirely.
4. Trigger button should use `.btn.btn-secondary.dropdown-toggle` instead of `.btn.btn-secondary`. Bootstrap's `.dropdown-toggle` introduces the canonical caret via CSS `::after`. The `ChevronDown` Lucide SVG in the JSX should be removed — the caret is provided by Bootstrap, not the component.
5. Checkmark SVG on selected dropdown items should be replaced with a Bootstrap Icon (consistent with the Bootstrap Icons principle established for Calendar and Checkbox).

### Tabs

**Positive:** Overall appearance is close to Bootstrap's native tabs.

**Issues:**
1. Tabs do not show a pointer cursor on hover. Bootstrap's tabs are `<a>` elements and get `cursor: pointer` for free; React Aria renders tabs as `<div>`s and does not. Fix: add `cursor: pointer` to `.react-aria-Tab` in the bridge. General principle: any interactive element that produces a pointer cursor in Bootstrap should do so in React Aria — if the React Aria element is not a native anchor or button, the rule must be added explicitly.
2. Vertical variant renders as horizontal. Bootstrap's documented approach for vertical tabs is `.flex-column` on the `.nav` element, but `.flex-column` is a utility class and no Bootstrap component modifier class for vertical nav exists. A bridge rule is not disproportionate here. Fix: add `flex-direction: column` to `.react-aria-TabList[data-orientation="vertical"]` in the bridge. This uses React Aria's own semantic orientation attribute rather than appending a utility class to the JSX.

### Calendar

**Positive:** Date cell styling (`btn btn-sm btn-outline-secondary border-0`) correctly separates resting appearance from interactive behavior — cells look plain at rest and respond visually on hover/press.

**Issues:**
1. Prev/next month buttons use `variant="outline-secondary"` without `border-0` — inconsistent with the cell treatment. These are chrome controls inside the component header and should follow the same pattern: borderless at rest, responsive on hover. Fix for iteration 1: pass `border-0` alongside the `outline-secondary` variant on both nav buttons.
2. Prev/next buttons use lucide-react `ChevronLeft`/`ChevronRight` SVGs. Replace with Bootstrap Icons (`<i className="bi bi-chevron-left">`, `<i className="bi bi-chevron-right">`). Requires adding `bootstrap-icons` package and importing its CSS.
3. Day-of-week abbreviations in header cells (`<th>`) are not centered. Bootstrap's reboot sets `th { text-align: inherit }`, overriding the browser default. Fix for iteration 1: add `text-align: center` to `.react-aria-CalendarHeaderCell` in `Calendar.css`.
4. Today cell uses `text-decoration: underline` in the bridge. Replace with `outline: 1px solid var(--bs-secondary)`. `border-0 !important` on the cell blocks any border-based approach; `outline` is independent of the border model.
5. Date cell text is too light in light mode. `btn-outline-secondary` sets text color to secondary gray (`#6c757d`). Fix for iteration 1: add `color: var(--bs-body-color)` to the CalendarCell bridge rule in `_bootstrap-overrides.scss`.

### ListBox

**Positive:** `.list-group` on `AriaListBox` is the right call.

**Issues:**
1. List items should apply the same "outline with border suppressed" thinking as Calendar date cells. Replace `list-group-item list-group-item-action` on `ListBoxItem` with `btn btn-outline-secondary border-0 w-100 text-start` — items look plain at rest but respond visually on hover/press. Bootstrap's `list-group` container already provides the grouped appearance without relying on item borders.
2. List items overflow the container horizontally, causing a horizontal scrollbar. The items have `margin-inline` applied — likely from `ListBox.css` (which applies `margin-inline: var(--spacing-1)` under `[data-layout=stack][data-orientation=vertical]`, and React Aria adds those attributes by default) leaking through despite being commented out in the bootstrap-test component, possibly via the original story's import chain. Regardless of source, it was an oversight: explicit `margin: 0` should have been set on items in the bridge.
3. The first list item has enlarged top-left/top-right border radii and the last has enlarged bottom-left/bottom-right radii. Bootstrap's `.list-group-item:first-child` / `:last-child` inherit `border-radius` from the container — correct behavior when items are flush. The `margin-inline` pushes items inward so they are not flush with the container walls, making the inherited corner radii visually incoherent. `margin: 0` resolves both issues 2 and 3 simultaneously.

**Sections story (`Bootstrap Test/ListBox -- Sections`):**

4. Top radii of the first item in each section are not being suppressed (they should have no radius since they are not at the outer container corners). Bootstrap's `.list-group-item:first-child { border-top-radius: inherit }` uses a `:first-child` selector, which fails here because `.react-aria-Header` is the first child of the section — the first list item is actually the second child. So the `:first-child` rule never fires, and the item retains its own border-radius.
5. Bottom radii of the last item in the last section are inheriting, but from the section container (`.react-aria-ListBoxSection`) rather than from the outer `.list-group`. The section container has no explicit `border-radius`, so the inherited value is either 0 or whatever leaks from project CSS — neither matches the outer container's `--bs-list-group-border-radius`. Fix: apply `border-radius` directly using `var(--bs-list-group-border-radius)` on targeted bridge selectors rather than relying on `inherit`. (Bootstrap uses `inherit` to handle embedding in other components, but it breaks when React Aria's section wrapper is in the inheritance chain.)
6. The container's `border-radius` is coming from `.react-aria-ListBox` (project CSS from `ListBox.css` leaking through) rather than from Bootstrap's `.list-group` token (`--bs-list-group-border-radius`). Fix: explicitly set `border-radius: var(--bs-list-group-border-radius)` on `.react-aria-ListBox.list-group` in the bridge. This affects both the sectioned and non-sectioned instances.
7. Section headers have a visible inset box-shadow. This comes from `.react-aria-ListBoxSection .react-aria-Header { box-shadow: inset 0px 1px 0px white, inset 0px -4px 8px var(--gray-200) }` in `ListBox.css` — leaking through despite the comment-out. Cannot be suppressed via browser inspector (possibly a cascade layer issue). Fix in iteration 1: explicitly override with `box-shadow: none` on `.react-aria-Header` in the bridge.

**Layout variants story (`Bootstrap Test/ListBox -- Layout Variants`):**

8. Stack/horizontal variant has incorrect corner radii — items get the vertical-layout first/last-child treatment instead of the horizontal one. Fix: add `.list-group-horizontal` to the `AriaListBox` className when `orientation="horizontal"`. Bootstrap's `.list-group-horizontal` already handles `flex-direction: row`, correct corner assignment, and adjacent-sibling border collapse — using the token directly, not `inherit`. The agent should have found this modifier class before attempting to hand-roll a horizontal layout.
9. Grid variant has `gap` and `padding` applied — leaking from `ListBox.css`'s `[data-layout=grid]` rules despite the comment-out. Fix in iteration 1: explicitly set `gap: 0; padding: 0` on the grid container in the bridge.
10. Grid variant has incorrect corner radii — no Bootstrap grid-list modifier class exists, and `:nth-child()`-based corner selection is brittle and column-count-dependent. Fix in iteration 1: set `border-radius: 0` on all items in `[data-layout=grid]`. Future path: once inset focus rings are introduced, `overflow: hidden` on the container handles corners generically without selector hacks.

**Systemic finding — project CSS leakage:**

11. Project CSS (`ListBox.css`, `theme.css`, etc.) leaks into the bootstrap-test environment because Storybook compiles a single shared CSS bundle. Commenting out imports in bootstrap-test components prevents those components from pulling in their CSS, but the original stories (`stories/ListBox.stories.tsx`) import the original components, which import their CSS — and that CSS enters the global bundle and matches `.react-aria-*` selectors everywhere. Interaction-state styles (e.g. `background: var(--highlight-background-pressed)` on `[data-pressed]`) appear even when Bootstrap provides no competing rule, making `@layer`-based deprioritization insufficient — `@layer` only arbitrates direct property conflicts, not additive styles. Only `utilities.css` is currently wrapped in `@layer utilities`; component CSS and `theme.css` are unlayered. Fix for iteration 1: configure Storybook to load only bootstrap-test stories via a glob filter, so no original component is ever imported and no project CSS enters the bundle. This also makes the `postcss-prefix-selector` Bootstrap scoping unnecessary for the bootstrap-test instance. Storybook (including v9) has no native per-story CSS isolation — the glob filter is the correct architectural solution.

---

## Debrief Decisions

### Protocol decisions → `agent/iteration-protocol.md`

**Round structure:** Each round consists of an experiment pass (`bootstrap-iteration_N`) followed immediately by a styled-components pass (`styled-components_N`). Both passes complete before the next round starts. `styled-components_N` branches off `main` after experiment knowledge updates are cherry-picked; `bootstrap-iteration_N+1` branches off `main` after styled-components knowledge updates are cherry-picked.

**Versioned styled-components branches:** `styled-components` is now `styled-components_N` (versioned, parallel to experiment branches). Provides a clean snapshot of product state after each round.

**Pre-iteration-1 one-time setup (in `main` before cutting `bootstrap-iteration_1`):**
1. Install Bootstrap Icons (`yarn add bootstrap-icons`)
2. Create Bootstrap Reference stories — one native Bootstrap HTML story per test component, no React Aria, for visual ground truth during self-review

**Glob filter — applied at the start of each iteration branch (not in `main`):** Restrict Storybook `stories` pattern to `stories/bootstrap-test/**` so no original story CSS enters the bundle.

**`d-block` on `invalid-feedback`:** Acceptable. React Aria's `<FieldError>` only renders content when a validation error exists, so the forced `display: block` produces no visual artifact when the field is valid. The bridge handles the error border separately via `[data-invalid]`. Bypassing Bootstrap's `.is-invalid` / `.invalid-feedback` pairing is the correct approach — the alternative (adding `.is-invalid` dynamically via React state) requires component logic rather than pure CSS bridge rules.

**Bridge selectors are re-authored each iteration:** `_bootstrap-overrides.scss` gets a fresh pass each iteration informed by the prior debrief. Nothing carries over from the previous iteration; the file is rewritten from scratch.

### General principles → `react-aria-skill.md`

*(none)*

### Bootstrap-generic principles → `agent/bootstrap-skill.md`

*(none)*

### Component-specific decisions → `agent/component-decisions.md`

*(none — all component findings from visual review were recorded in `component-decisions.md` during the review phase)*

---

## Proposals for Next Iteration

- **Bootstrap Reference stories:** Add a "Bootstrap Reference" story group with one story per test component showing native Bootstrap HTML (no React Aria). Gives a visual ground truth for self-review. Note: some React Aria components have no direct Bootstrap counterpart, and some (e.g. Select) have multiple possible counterparts — agent must judge which is most appropriate and document the choice in the story.

- **Zero-baseline + reference-driven workflow:** A proposed workflow for future iterations (not iteration 1 necessarily):
  1. Run the bootstrap-test Storybook instance with a glob filter so no project CSS enters the bundle — bootstrap-test components start from a genuinely clean slate.
  2. Each test component is paired with an adjacent Bootstrap Reference story as a visual ground truth.
  3. The agent's task becomes: apply Bootstrap classes and bridge rules to the unstyled component, compare against the reference, and iterate until the component matches visually. For components with no Bootstrap counterpart (e.g. Calendar), the original project component's layout and proportions serve as the structural reference, and the task is to replace project CSS variables and classes with Bootstrap equivalents while preserving structure.
  4. Autonomous iteration is viable for coarse differences (wrong colors, missing borders, broken layout); subtle differences (spacing, weight, radius) may still benefit from a targeted user review pass before finalizing.
  
  This approach eliminates CSS leakage at the source, removes ahead-of-time judgments about which structural CSS to retain (start from zero, add back only what collapses without it), and gives the agent a clear, measurable visual target rather than relying on its judgment of what "correct Bootstrap styling" looks like.

## Skill Update Status

- [x] `agent/react-aria-skill.md` updated
- [x] `agent/bootstrap-skill.md` updated (if applicable) — no additions; new principles are React Aria-specific or general CSS
- [x] `agent/component-decisions.md` updated
- [x] `CLAUDE.md` iteration number incremented to 1
- [ ] Changes committed
