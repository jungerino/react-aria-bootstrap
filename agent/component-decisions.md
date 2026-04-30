---
title: Component-Specific Decisions
---

# Component-Specific Decisions

Per-component Bootstrap decisions for this project. Updated after **project branch** (`styled-components`) review only.

Not consulted during experiment-branch iterations (deliberate exclusion for clean skill signal).

## Button

**Reference story pattern:** `.btn.btn-{variant}` for all 9 solid variants and `.btn.btn-outline-{variant}` for 8 outline variants, sourced verbatim from Bootstrap's Buttons docs. React Aria's `Button` renders a native `<button>`, so this pattern maps directly with no bridge required.

**`[data-pressed]` bridge — use `@include box-shadow(...)`, not raw `box-shadow:`:** Bootstrap gates the active shadow on `$enable-shadows` via the `@include box-shadow()` mixin. Writing `box-shadow: var(--bs-btn-active-shadow)` directly bypasses this flag and applies a shadow even when `$enable-shadows: false` (Bootstrap's default). Use `@include box-shadow(var(--bs-btn-active-shadow))` in the bridge so the shadow only appears when the project opts into it.

## TextField

**Reference story pattern:** `.form-label` + `.form-control` + `.form-text` (description) + `.invalid-feedback` (error). Three stories: default (with help text), error state (`.is-invalid` applied statically, no JS), and disabled. React Aria's `TextField` renders `<label>` + `<input>` + description/error divs — the structure maps directly.

**`.form-label` color in dark mode:** Same issue as Select — `.form-label` receives dark text in dark mode. No separate fix needed; the global bridge rule `color: var(--bs-body-color)` on `.form-label` (decided under Select) covers this.

## Checkbox

**Reference story pattern:** `.form-check` + `.form-check-input` + `.form-check-label`. Visual reference only — Bootstrap targets the native `<input type="checkbox">` directly. React Aria hides the native input and renders a custom indicator element; bridge selectors on that indicator are required. The reference shows the target visual state, not a directly applicable class set.

**Suppress utilities.css highlights:** Add `box-shadow: none` to `.react-aria-Checkbox .indicator` in the bridge, covering both the default and selected states. `utilities.css` applies complex specular highlight/gradient box-shadows to `.indicator` — these must be fully overridden so Bootstrap's flat checkbox appearance is not contaminated by the project's design system.

**Checkmark icon:** Replace the SVG `<polyline>` / `<rect>` with Bootstrap Icons: `<i className="bi bi-check">` (checked) and `<i className="bi bi-dash">` (indeterminate). Remove the SVG element entirely. Requires `bootstrap-icons` package.

**Vertical shift on selection:** The component shifts down by a few pixels when `data-selected="true"`. Investigate in iteration 1 — likely caused by utilities.css box-shadow changes on `.indicator[data-selected]` or by the SVG/icon becoming visible and expanding the indicator's layout. Ensure the indicator has fixed dimensions (`width` and `height`) that do not change between states.

**Label text color:** Add `color: var(--bs-body-color)` to `.react-aria-Checkbox` in the bridge. Label text is inheriting a light project CSS variable rather than Bootstrap's body color.

**Indicator size:** Change `width: 1em; height: 1em` to `width: 1rem; height: 1rem` on the `.indicator` in the bridge. Bootstrap's `.form-check-input` is 1rem × 1rem (16×16px at default scale). Using `em` causes the size to vary with inherited font-size context; `rem` anchors it to the root.

## Select

**Reference story pattern:** `.btn.dropdown-toggle` + `.dropdown-menu` — NOT `.form-select`. React Aria hides the native `<select>` and renders a custom `<button>` + popover + listbox; Bootstrap's `.form-select` targets the native element and does not attach. Two stories: closed (default) and open (`.show` forced, since Bootstrap's dropdown JS is not loaded).

**Bootstrap pattern — dropdown, not form-select:** Map Select to Bootstrap's dropdown pattern (`.btn` trigger + `.dropdown-menu` items), not `.form-select`. React Aria hides the native `<select>` and renders a custom `<button>` + popover + listbox — Bootstrap's `.form-select` targets the native element and does not attach. Bootstrap's dropdown matches the rendered structure.

**Label placement — bridge CSS, not utility classes:** The `AriaSelect` wrapper needs explicit vertical stacking so the label renders above the trigger. Fix via bridge CSS targeting `.react-aria-Select` (e.g. `display: flex; flex-direction: column`) rather than adding `d-flex flex-column` to the JSX. Utility classes encode layout decisions in markup; structural fixes belong in the component's stylesheet.

**`.form-label` color in dark mode:** `.form-label` receives dark text in dark mode — project CSS is overriding Bootstrap's theme-aware `--bs-body-color`. Fix: add `color: var(--bs-body-color)` in the bridge. This likely affects any component using `.form-label` (e.g. TextField) and should be applied globally rather than per-component.

**Popover — apply `.dropdown-menu`:** Add Bootstrap's `.dropdown-menu` class to the `Popover` wrapping the Select listbox to replace project CSS padding and theming with Bootstrap's dropdown surface. Ensure project legacy CSS (`.dropdown-item` from `ListBox.css`) does not override Bootstrap's rules.

**`.dropdown-item` class collision:** Both `ListBox.css` (project) and Bootstrap define `.dropdown-item`. The project's version leaks into the bundle via the original story import chain and applies unwanted margins and padding. Bootstrap's rules must win — use a compound selector for specificity or apply explicit resets in the bridge. Resolved cleanly in iteration 1 by the glob filter removing project CSS from the bundle.

**Trigger — use `.dropdown-toggle`:** Apply `.btn.btn-secondary.dropdown-toggle` to the Select trigger (not just `.btn.btn-secondary`). Bootstrap's `.dropdown-toggle` provides the canonical caret via CSS `::after`. Remove the `ChevronDown` Lucide SVG from the JSX — the caret is owned by Bootstrap, not the component.

**Selected item indicator — Bootstrap Icon:** Replace the SVG checkmark on selected dropdown items with a Bootstrap Icon. Consistent with the Bootstrap Icons principle established for Calendar and Checkbox.

## Tabs

**Reference story pattern:** `.nav.nav-tabs` + `.nav-link` on `<button>` elements + `.tab-content` + `.tab-pane`. Static active state only — tab switching requires Bootstrap JS which is not loaded. React Aria renders `<div>` tab items (not `<a>` or `<button>`), so cursor and active state must be bridged explicitly.

**Cursor pointer on tabs:** Add `cursor: pointer` to `.react-aria-Tab` in the bridge. Bootstrap's tabs are `<a>` elements and get pointer cursor for free; React Aria renders `<div>`s and does not. General principle: any interactive element that Bootstrap makes pointer-cursor must have `cursor: pointer` added explicitly when React Aria renders it as a non-anchor, non-button element.

**Vertical orientation — bridge rule, not `.flex-column`:** Implement vertical tabs via `flex-direction: column` on `.react-aria-TabList[data-orientation="vertical"]` in the bridge. Bootstrap documents `.flex-column` for this, but that is a utility class and no Bootstrap component modifier for vertical nav exists. A single bridge rule is not disproportionate, and `data-orientation` is React Aria's own semantic signal for this state.

## Calendar

**Reference story pattern:** No Bootstrap calendar component exists. The reference shows the intended cell treatment — `.btn.btn-sm.btn-outline-secondary` with `border-color: transparent` at rest — preserving hover/active states without a visible resting border. Nav buttons use the same treatment with Bootstrap Icons chevrons (`bi-chevron-left` / `bi-chevron-right`).

**Date cells:** `btn btn-sm btn-outline-secondary border-0` on `CalendarCell`. Cells are dense and repeated — visible borders add noise. `border-0` suppresses the resting border while `btn-outline-secondary` preserves hover/active/focus states.

**Prev/next navigation buttons:** Same treatment as cells — `btn-outline-secondary border-0` (and `btn-sm` for size consistency). These are chrome controls inside the calendar header, not standalone actions. Use Bootstrap Icons for the chevrons: `<i className="bi bi-chevron-left">` and `<i className="bi bi-chevron-right">` — remove the lucide-react `ChevronLeft`/`ChevronRight` imports. Requires `bootstrap-icons` package and its CSS imported in the entry point.

**Today cell:** Replace `font-weight: bold; text-decoration: underline` in the `[data-today]` bridge with `outline: 1px solid var(--bs-secondary)`. The `border-0` utility class on CalendarCell sets `border-width: 0 !important`, blocking any border-based approach in SCSS. `outline` is independent of the border model and unaffected by `border-0`.

**Cell text color:** Add `color: var(--bs-body-color)` to the CalendarCell rule in `_bootstrap-overrides.scss`. `btn-outline-secondary` sets `--bs-btn-color` to the secondary gray (`#6c757d`), making date text too light. Body color is the correct default for readable date text.

**Day-of-week header cells:** Add `text-align: center` explicitly to `.react-aria-CalendarHeaderCell` in `Calendar.css`. Bootstrap's reboot resets `<th>` to `text-align: inherit`, which overrides the browser default centering. Since `Calendar.css` is already kept active for layout, this is the right place for the fix.

**Grid layout:** Keep `../Calendar.css` active. Bootstrap has no calendar grid equivalent — removing it breaks cell sizing and aspect ratio.

## ListBox

**Reference story pattern:** `.list-group` + `.list-group-item` (Basic, from Bootstrap docs verbatim) and `.list-group-item-action` on `<a>` elements (Interactive). The Interactive story uses `<a>` elements because Bootstrap's hover/active/focus states on `.list-group-item-action` are only activated on anchor and button elements. React Aria renders items as `<div>` or `<li>`, so these states must be bridged.

**Container:** `list-group` on `AriaListBox`. Bootstrap's canonical list component — correct structural choice.

**List items:** Replace `list-group-item list-group-item-action` with `btn btn-outline-secondary border-0 w-100 text-start` on `ListBoxItem`. Applies the same "outline with border suppressed" principle as Calendar date cells: items are plain at rest, responsive on hover/press. `w-100 text-start` preserve list-item block layout and left-aligned text that `btn` would otherwise collapse.

**Item margins:** Explicitly set `margin: 0` on `.react-aria-ListBoxItem` in the bridge (or suppress via the class chain). React Aria adds `data-layout="stack"` and `data-orientation="vertical"` by default; `ListBox.css` applies `margin-inline: var(--spacing-1)` under those selectors. Even if `ListBox.css` is commented out, margins may leak through the non-bootstrap import chain. `margin: 0` also fixes the first/last-item border-radius visual: Bootstrap's `.list-group-item:first-child/:last-child` inherit container `border-radius`, which only looks correct when items are flush against the container walls.

**Horizontal orientation:** Add `.list-group-horizontal` to the `AriaListBox` className when `orientation="horizontal"`. Bootstrap's modifier handles `flex-direction: row`, correct horizontal corner radii (using `var(--bs-list-group-border-radius)` directly, not `inherit`), and adjacent-sibling border collapse.

**Grid layout radii:** Set `border-radius: 0` on all items in `[data-layout=grid]` via the bridge. No Bootstrap grid-list modifier exists, and `:nth-child()`-based corner selection is brittle and hardcoded to a fixed column count. Flat corners are the correct interim treatment. Future path: once inset focus rings are introduced project-wide, switch to `overflow: hidden` on the container and let clipping handle the corners generically.

**Grid gap and padding:** Explicitly set `gap: 0; padding: 0` on `.react-aria-ListBox[data-layout=grid]` in the bridge. `ListBox.css` applies both under this selector and leaks through.

**Container border-radius:** Explicitly set `border-radius: var(--bs-list-group-border-radius)` on `.react-aria-ListBox.list-group` in the bridge. Project CSS from `ListBox.css` leaks through and sets a different radius on `.react-aria-ListBox`; without an explicit override the Bootstrap token is never applied.

**Section corner radii:** Bootstrap's `:first-child` / `:last-child` selectors on `.list-group-item` assume items are direct children of `.list-group`. With React Aria sections, items are children of `.react-aria-ListBoxSection` and the header is the first child — so `:first-child` never fires on the first item, and `inherit` on the last item picks up from the section container (no radius) rather than the outer `.list-group`. Fix in iteration 1: apply corner radii explicitly using `var(--bs-list-group-border-radius)` via bridge selectors targeting `.react-aria-ListBoxSection:first-child .react-aria-ListBoxItem:first-of-type` (top corners) and `.react-aria-ListBoxSection:last-child .react-aria-ListBoxItem:last-of-type` (bottom corners).

**Section headers:** Add `box-shadow: none` to `.react-aria-Header` in the bridge. `ListBox.css` applies an inset decorative shadow to section headers; it leaks through even when commented out.
