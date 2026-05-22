---
title: Review — Iteration 0
status: in-progress
---

# Review — Iteration 0

## Components
Button, ListBox, Select, Calendar, Tabs

## Phase 1 — Taxonomy decisions

### Button

**Decisions needed:**
1. **Outline variant exposure:** Bootstrap offers `.btn-outline-{variant}` as a parallel set of 8 variants. Options: (a) expose as a second `variant` dimension (e.g. `variant="outline-primary"`); (b) expose as a boolean `outline` prop that combines with `variant`; (c) include all 16 combinations in a single `variant` prop. Trade-offs: (a) mirrors Bootstrap's naming directly; (b) is more composable; (c) is exhaustive but verbose.
2. **`isPending` spinner rendering:** React Aria signals pending state via `[data-pending]` but does not render a spinner — the consuming component does. Options: (a) the Button component always renders a hidden spinner that becomes visible on `[data-pending]`; (b) the spinner is passed as children and the component switches between children/spinner via render prop. Trade-off: (a) is self-contained; (b) matches React Aria's own Vanilla CSS example pattern.

**Non-obvious decisions made:**
- **`[data-pending]` → M010 content-states:** Bootstrap has no pending-state class on `.btn`. The bridge is a DOM child — a `.spinner-border.spinner-border-sm` element rendered when pending is active. This is a content-state bridge (M010), not a compound selector bridge. The spinner child is not a state attribute mapping.
- **`:disabled` pseudo fires on Button:** React Aria sets the `disabled` attribute on the `<button>` element for Button. This is the one component where `:disabled` fires without a compound selector bridge needed. All other components (ListBox item, CalendarCell, Select trigger) require compound selector bridges because React Aria renders non-form-control elements.
- **`.btn.disabled` class INERT:** Bootstrap also has a `.disabled` class modifier for anchors-as-buttons. React Aria never adds it. `:disabled` covers the `<button>` case. No bridge needed.

### ListBox

**Decisions needed:**
1. **Grid layout variant (`layout="grid"`):** Bootstrap has no grid list-group. Options: (a) implement with `augments.scss` custom CSS, exposing `grid-template-columns` as a configurable CSS custom property; (b) skip grid layout and document as out-of-scope for this mapping (user must add their own grid wrapper). Trade-off: (a) extends Bootstrap's token system with custom properties; (b) is simpler but leaves a React Aria feature unmapped.
2. **Section sub-part visual representation:** Bootstrap has no list-group section headers. Options: (a) render section headers as styled `.list-group-item.list-group-item-secondary` with `fw-semibold` and `user-select: none`; (b) render with a Bootstrap `.border-bottom` divider above a text label. This is a design choice that affects the section's visual prominence.
3. **Numbered list group:** The `.list-group-numbered` modifier is incompatible with React Aria's `<div>` rendering without a render-prop DOM override. Flag as out-of-scope unless there is a use case for it.
4. **Contextual item colors:** Bootstrap's `.list-group-item-{variant}` classes set per-item background color. React Aria has no equivalent prop. Options: (a) expose as a passthrough class; (b) expose as an `intent` prop mapping to Bootstrap variants; (c) exclude from scope.

**Non-obvious decisions made:**
- **Bootstrap hover guard `:not(.active)`:** Bootstrap's `.list-group-item-action:hover` selector is qualified with `:not(.active)` (so hover styling is suppressed on active items). Since React Aria never adds `.active`, the guard **never fires** — hover styling will appear on `[data-selected]` items unless explicitly suppressed. A compound selector bridge must be added: `.react-aria-ListBoxItem[data-selected]:hover` → suppress hover visual. This is a non-obvious behavioral interaction from `states.md` that required patterns.md cross-reference.
- **Section/Header — both flagged NO DIRECT COUNTERPART:** Bootstrap's list-group has no concept of item grouping sections or section labels. Both the `<ListBoxSection>` and `<Header>` within it need custom CSS. The closest Bootstrap structural pattern (non-interactive `.list-group-item` header) is documented; no Bootstrap alternatives exist.
- **`.list-group-numbered` incompatible:** This Bootstrap modifier requires `<ol>` as the parent, but React Aria renders `<div>`. The CSS counter (`::before` content) requires `ol > li` context. Flagged as MAJOR DOM conflict. Effectively out-of-scope without a render-prop DOM override.
- **`layout="grid"` → custom CSS:** Bootstrap has no grid list-group. Any grid layout must use custom CSS in `augments.scss`. M017 applies — CSS delta identified but numeric column count is a configurable candidate.

### Select

**Decisions needed:**
1. **M014 dual-counterpart token strategy for trigger:** The trigger button uses `.btn.dropdown-toggle` (structural) + `.form-select` tokens (visual). Bootstrap's `.form-select` tokens define padding, background-image (chevron), border, border-radius, and color. The `.btn` default appearance conflicts with these. Options: (a) apply explicit token overrides inline via `--bs-btn-*` → `.form-select` value mappings in component CSS; (b) remove `.btn` from the trigger entirely and use `.form-select` class alone, relying on direct selector bridges for states. Trade-off: (a) keeps Button-inherited state behavior; (b) is cleaner but requires full state CSS from scratch.
2. **FieldError and Description visibility:** Bootstrap hides `.invalid-feedback` by default and shows it via the `.is-invalid ~` sibling combinator. React Aria's `FieldError` renders conditionally or uses `[data-invalid]` on the root. Options: (a) always render FieldError but hide it with `display: none`, revealing it with `.react-aria-Select[data-invalid] .react-aria-FieldError { display: block }`; (b) let React Aria control rendering (FieldError only renders when invalid). Trade-off: (a) matches Bootstrap's structural pattern; (b) is simpler and more React-like.
3. **Popover positioning:** React Aria's Popover uses its own placement system. Bootstrap's `.dropdown-menu` assumes Popper.js for absolute positioning. Options: (a) use React Aria's placement props to position the popover below the trigger; (b) rely on CSS `position: absolute; top: 100%` on the Popover element. These may conflict with React Aria's inline style overrides for position.
4. **Validation state — valid:** React Aria has no `isValid` prop (only `isInvalid`). Bootstrap exposes `.is-valid` styling for form-select. Options: (a) skip the valid state entirely (document as out-of-scope); (b) implement a custom `isValid` prop that adds Bootstrap's valid token styling.

**Non-obvious decisions made:**
- **M014 dual-counterpart on trigger:** The Select trigger (a `<button>` rendered by React Aria) needs `.btn.dropdown-toggle` for structural/state behavior AND `.form-select` token values for visual fidelity (chevron background-image, padding, border). These cannot both be applied as classes — `.form-select` targets `<select>`, not `<button>`. The bridge applies `.form-select` CSS custom property values (`--bs-form-select-*`) via compound selector, without the class itself.
- **Popover positioning — `[data-bs-popper]` INERT:** Bootstrap's Popper.js positioning selectors target `[data-bs-popper]` which React Aria never sets. The Popover uses its own placement system. Bootstrap's `.dropdown-menu` positioning styles are inert; custom absolute positioning on `.react-aria-Popover` is required.
- **Popover visibility — DOM-presence based:** React Aria renders the Popover only when the Select is open. Bootstrap's `.dropdown-menu` is `display: none` by default and revealed by `.show`. Since the Popover is never in the DOM when closed, no `.show` bridge is needed — DOM presence alone controls visibility.
- **FieldError always rendered vs. Bootstrap's sibling combinator:** Bootstrap's `.invalid-feedback` is hidden by default and revealed via `.is-invalid ~ .invalid-feedback` sibling selector. React Aria renders `FieldError` conditionally (or always). Either approach works, but Bootstrap's sibling selector NEVER fires (React Aria never adds `.is-invalid`). Bridge required: `.react-aria-Select[data-invalid] .react-aria-FieldError { display: block }`.

### Calendar

**Decisions needed:**
1. **Cell shape — circle vs. rounded rectangle:** The React Aria Vanilla CSS example uses `border-radius: 9999px` (circle). Bootstrap's `.btn` uses `--bs-btn-border-radius` (rounded rectangle by default). Options: (a) keep the circle shape with `border-radius: 9999px` as a custom override in `augments.scss`; (b) use Bootstrap's default button border-radius for a rectangular cell appearance. This is a design choice — both are valid calendar date cell shapes.
2. **Cell sizing:** The React Aria example uses container-query-based sizing. Bootstrap has no equivalent sizing utility. Options: (a) implement via custom CSS in `augments.scss` using a fixed pixel width; (b) use a percentage-width CSS grid approach. Any numeric cell size value is a hardcoded configurable candidate per M016.
3. **"Today" visual indicator:** Bootstrap has no built-in "today" highlight pattern. Options: (a) use `box-shadow: 0 0 0 2px var(--bs-primary)` (ring, matching Bootstrap's focus ring pattern); (b) use `border: 2px solid var(--bs-primary)` (border ring); (c) use `font-weight: bold` + `color: var(--bs-primary)` (text-only indicator). These produce different visual weight.
4. **Outside-month cells:** The Vanilla CSS example hides outside-month cells entirely (`display: none`). Options: (a) always hide outside-month cells; (b) show them muted with `.text-muted` color. This affects the calendar's grid density appearance.
5. **Unavailable date styling:** The Vanilla CSS example uses `text-decoration: line-through` + danger color. Bootstrap has no unavailable-date pattern. Options: use `--bs-danger-text-emphasis` token vs. `--bs-secondary-color` token vs. a fully custom color.

**Non-obvious decisions made:**
- **NO DIRECT COUNTERPART (whole component):** Bootstrap 5.3.8 has no calendar or datepicker component. External datepicker libraries (bootstrap-datepicker, flatpickr) are out of scope — they are not part of Bootstrap's component system. The entire widget is built from Bootstrap button tokens (for cells) and utility classes (for layout).
- **CalendarCell is `<td>` — `.btn` class cannot be applied:** Bootstrap's `.btn` class has table-reset conflicts when applied to `<td>` (Bootstrap's table rules set `padding`, `border-width`, `box-shadow` on `td` elements which conflict with `.btn` values). The resolution is to use Bootstrap's `.btn` CSS custom properties (`--bs-btn-*`) directly on `.react-aria-CalendarCell` without the `.btn` class.
- **`:disabled` INERT on CalendarCell:** CalendarCell renders as `<td>`. `:disabled` does not fire on non-form elements. Compound selector bridge on `[data-disabled]` required.
- **`[data-outside-month]` → `display: none`:** Cells outside the current month are hidden entirely. No Bootstrap class covers this. Custom CSS only.

### Tabs

**Decisions needed:**
1. **Tab style variant — which Bootstrap style is default?** Bootstrap offers `.nav-tabs` (bottom-border + outer border), `.nav-pills` (filled background), and `.nav-underline` (thin underline only). React Aria has no equivalent prop — the style is applied via class on the TabList. Options: (a) use `.nav-tabs` as the default; (b) use `.nav-underline` (cleaner, matches the React Aria Vanilla CSS example's underline approach); (c) expose a style variant prop on the component.
2. **SelectionIndicator — keep or suppress?** React Aria's `<SelectionIndicator>` is an absolutely positioned animated indicator separate from the tab's own active border. Bootstrap's active tab appearance is handled via border tokens on `.nav-link.active` (no separate animated element). Options: (a) suppress SelectionIndicator (`display: none`) and rely on Bootstrap's token-based active border; (b) keep SelectionIndicator as the sole active indicator, removing Bootstrap's border-based styling from the Tab. These cannot both be active simultaneously without visual duplication.
3. **Panel visibility strategy — apply `.tab-pane` or use `[data-inert]` directly?** Options: (a) skip `.tab-pane` entirely, use `display: block` as the panel baseline + `[data-inert] { display: none }` bridge — cleanest, no Bootstrap class conflicts; (b) apply `.tab-pane` for structural semantics, then override with a `display: block` baseline + `[data-inert]` bridge — more Bootstrap-idiomatic but requires counteracting Bootstrap's default.
4. **Vertical orientation CSS delta:** Bootstrap has no `.nav-tabs-vertical` modifier class. All vertical layout requires custom CSS in `augments.scss`. Confirm: always custom CSS, no Bootstrap variant to inherit.

**Non-obvious decisions made:**
- **Tab active state — `.nav-link.active` INERT:** React Aria never adds the `.active` class. Bootstrap's active tab styling (bottom border, color change) is entirely class-driven. Compound selector bridge on `[data-selected]` required for every Bootstrap nav style variant.
- **TabPanel visibility — `.tab-pane` conflicts with `[data-inert]`:** Bootstrap's `.tab-pane` hides all panels (`display: none`) and reveals via `.active`. React Aria uses `[data-inert]` to hide inactive panels (no class-based reveal). If `.tab-pane` is applied, ALL panels are hidden and none are revealed. Resolution: use `display: block` as the baseline for `.react-aria-TabPanel` + `[data-inert] { display: none }` bridge. `.tab-pane` class can still be applied for structural semantics, but its visibility behavior is overridden.
- **SelectionIndicator — additive React Aria feature:** The `<SelectionIndicator>` is an absolutely positioned animated element. Bootstrap's `.nav-link.active` already handles the active indicator visually. Both active simultaneously causes visual duplication — one must be suppressed.
- **Vertical orientation — custom CSS only:** Bootstrap has no `.nav-tabs-vertical` modifier. All vertical layout requires custom CSS in `augments.scss`.

### Self-review findings (fixed before user review)

- **ListBox Section header and Drop indicator:** Original sub-parts table entries were missing "closest visual" and "alternatives considered" per M006. Fixed by expanding the table cell descriptions.
- **Tabs SelectionIndicator:** Original sub-parts table entry lacked M006-style closest structural/visual/alternatives. Fixed by expanding the table cell description.

## Phase 2 — Implementation notes

### Button

- **Faux states scoped per P-S001:** `.btn.faux-hover`, `.btn.faux-focus`, `.btn.faux-active` defined in `augments.scss`. Bootstrap's `.btn` uses CSS custom properties (`--bs-btn-hover-*`, `--bs-btn-focus-*`, `--bs-btn-active-*`) scoped per variant, so scoping the faux class to `.btn` is sufficient — no per-variant overrides needed.
- **Pending state:** Rendered as `<button disabled>` with `<span class="spinner-border spinner-border-sm me-2">` child, per the component decision (spinner passed as child, not hardcoded inside the component). The `disabled` attribute on the button suppresses interaction and triggers `:disabled` visual — matching Bootstrap's own "Loading..." button example.
- **Outline Light contrast:** `.btn-outline-light` on a white background is nearly invisible — no special handling applied (the reference story is for visual specification of the target appearance; low-contrast variants are valid Bootstrap output).
- **Stories implemented:** Color Variants (Solid), Color Variants (Outline), Sizes, States.

### ListBox

- **Faux states:** `.list-group-item.list-group-item-action.faux-hover/focus/active` defined in `augments.scss`. The Bootstrap hover selector is qualified with `:not(.active)` — since `.active` is INERT in React Aria, this guard never fires in production. The faux classes reproduce the underlying CSS variable values directly, bypassing the guard.
- **Section header:** Implemented as `.list-group-section-header` custom class in `augments.scss`. Styled after Bootstrap's `.dropdown-header` visual pattern — small, uppercase, secondary color, with bottom border. This is a custom class with no Bootstrap counterpart.
- **Multi-select checkboxes:** Used `<label>` wrappers instead of `<button>` for items in the multi-select story, following Bootstrap's own checkbox list-group pattern (checkboxes inside list-group-items require label wrapping for native check behavior). The React Aria implementation wraps differently but the visual target is the same.
- **Grid layout:** `.list-group-grid` class in `augments.scss` — `display: grid` with `--list-group-grid-columns` CSS custom property (default 3). Individual items get `border-radius` applied directly since the list-group's border-radius is normally handled by `:first-child`/`:last-child` selectors that don't apply in grid context.
- **Stories implemented:** Default Vertical, Item States, Selection Single, Selection Multiple, Section Grouping, Horizontal Layout, Grid Layout.

### Select

- **Reference story uses `<select>` element:** Per construction rules, reference stories show Bootstrap's target HTML. The trigger is rendered as `<select class="form-select">` — the React Aria implementation bridges a `<button>` to produce the same appearance. This means the reference story faithfully shows Bootstrap's intended visual without needing the M014 dual-counterpart technique (that technique applies to the React Aria implementation, not the reference story).
- **Faux focus:** `.form-select.faux-focus` reproduces Bootstrap's `.form-select:focus` values (`border-color: #86b7fe; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25)`). These are hardcoded values in Bootstrap's CSS — not custom properties — so they are copied literally.
- **Open dropdown:** Shown with a static `<div class="dropdown-menu show" style="position: static; display: block">` — overriding Bootstrap's `position: absolute; display: none` defaults. This allows the dropdown to appear below the trigger in normal document flow without JavaScript.
- **Dropdown item hover faux:** Used inline style with `--bs-dropdown-link-hover-bg` and `--bs-dropdown-link-hover-color` CSS variables directly, since `.dropdown-item` hover state uses these variables. No separate faux class added to `augments.scss` for dropdown items — the story needed only one hover specimen.
- **FieldError:** Only shown in invalid state per component decision ("React Aria controls rendering — FieldError only renders when invalid").
- **Valid state omitted:** Per component decision.
- **Stories implemented:** Trigger States, Open Dropdown, Validation (Invalid), Size Variants, Full Field.

### Calendar

- **No Bootstrap counterpart:** All Calendar CSS is custom in `augments.scss`. Bootstrap button token values (`--bs-primary`, `--bs-tertiary-bg`, `--bs-secondary-color`, `--bs-danger-text-emphasis`) are used directly as custom property references — not via `.btn` class which would conflict with `<td>` table styles.
- **Container query approach:** `container-type: inline-size` applied to `.cal-table`. Cal-cells use `width: calc(100cqw / 7)` which gives each cell exactly 1/7 of the table width, matching the `table-layout: fixed` column distribution. This works correctly inside the table context.
- **Cell states story override:** Outside the table context, `100cqw` resolves to the nearest container with `container-type: inline-size` — which in the cell states story is not the table. Cells in the states story use inline `style={{ width: '2.5rem', height: '2.5rem' }}` to override the container-query-driven width, giving fixed 40×40 circles for clear specimen display.
- **Outside-month cells:** Shown muted with `.is-outside-month` → `color: var(--bs-secondary-color)`, per component decision (not hidden).
- **Today + Selected combination:** Added a third calendar in the FullCalendarToday story showing both today-ring and selected-fill simultaneously, to validate that the 2px transparent border on non-today cells prevents layout shift.
- **Stories implemented:** Full Calendar (Selected Date), Full Calendar (Today Highlighted), Cell States Grid.

### Tabs

- **SelectionIndicator suppression:** `.react-aria-SelectionIndicator { display: none }` added to `augments.scss`. Not exercised in the reference stories (no React Aria components used), but documented for the implementation phase.
- **Panel visibility:** Reference stories use `[hidden]` attribute on inactive panels, which maps to the `[data-inert]` bridge in React Aria. `.tab-pane` class is NOT used — applying it would hide all panels via Bootstrap's default `display: none` rule.
- **Vertical sidescore:** `.ref-tabs-vertical` custom CSS in `augments.scss`. The nav-underline's bottom border (`border-bottom`) is suppressed on nav-links inside this wrapper; a `border-right` is used instead. The hover/active selectors within `.ref-tabs-vertical` override the normal border-bottom-color rule to use border-right-color. The `.faux-active` class applies `border-right-color: currentcolor` which matches Bootstrap's own `.active` bottom-border behavior.
- **faux-hover for nav-underline:** Applies `border-bottom-color: currentcolor` — matching Bootstrap's actual `.nav-underline .nav-link:hover` rule (confirmed from compiled CSS).
- **Tab states story:** Each specimen is a standalone `<ul class="nav nav-underline">` containing a single tab — this reproduces the ancestor context P-S002 requires (`.nav-underline` must be the ancestor for the faux-hover/active border-bottom selectors to apply correctly).
- **Stories implemented:** Tab Styles, Tab States, Full Tabs Widget, Vertical Orientation.

## Phase 2 — Post-implementation cleanup

### Inline styles → augments.scss (P-S003)

All `style={{...}}` props were removed from the five reference story files and replaced with named CSS classes in `augments.scss`. This was the only change to story files; no render logic or structure changed.

**Cross-component utilities added** (shared across ≥2 stories):
- `.ref-label` — shared specimen label (0.75rem, secondary color, 0.25rem bottom margin)
- `.ref-specimen-label` — smaller label for dense specimen grids (0.7rem)
- `.ref-grid` + `.ref-grid-1/2/3` — equal-column story grid (1fr, 1.5rem gap); used by ListBox, Select, Calendar, Tabs
- `.ref-specimen-row` + `.ref-specimen-row-3/4/6/9` — auto-column specimen row (compact gap); used by Button, Calendar, Tabs
- `.ref-align-center` — align-items: center modifier; used by Button Sizes, Select SizeVariants

**Component-specific utilities, placed inside their component sections:**
- ListBox: `.ref-listbox-specimen` (max-width: 320px), `.ref-listbox-grid-specimen` (max-width: 480px), `.ref-stack` (flex column, 1rem gap)
- Select: `.ref-dropdown-static` (position: static), `.ref-dropdown-full-width` (width: 100%)
- Calendar: `.ref-specimen-row--gap-md` (gap: 1rem), `.ref-cell-specimen` (text-align: center), `.ref-cell-container` (inline-block, 40×40), `.cal-cell.ref-cell-fixed` (fixed 40×40 overriding container-query width)
- Tabs: `.ref-specimen-row--gap-wide` (gap: 0.75rem 1.5rem), `.ref-nav-nowrap` (flex-wrap: nowrap)

**Bug fixes during migration:**
- Calendar CellStates: grid was `repeat(8, auto)` but story renders 9 specimens — fixed to `.ref-specimen-row-9`
- Tabs TabStates: grid was `repeat(6, auto)` but story renders 4 specimens — fixed to `.ref-specimen-row-4`

**Select `marginBottom` on trigger `<select>`:** replaced with Bootstrap's existing `.mb-1` utility — no new class needed.

**Organization:** component-specific utilities live inside their component block in `augments.scss`, not in a separate top-level section. Cross-component utilities stay together at the top.

## User review

### Button
No notes. LGTM.

### Calendar
- `FullCalendarSelected`: `ref-grid ref-grid-3` wrapper is unnecessary for a single specimen — constrains the calendar to 1/3 width without benefit. Root cause: taxonomy specified "Grid columns: 3" globally without accounting for per-story specimen counts; the iteration protocol instruction sent the agent to specify column count in the taxonomy rather than match it to specimens.
- `FullCalendarToday`: `ref-grid-3` used with 2 specimens — one empty column slot.
- Fix: replace all `ref-grid` usage in story layout with `ref-flex-row`; remove wrapper from single-specimen stories.

### ListBox
- `SelectionMultiple`: selected items had `.active` applied alongside the checked checkbox — redundant. The checkbox is sufficient to indicate selected state in multi-select; `.active` background fill is only appropriate for button-based single-select items. Fix: remove `.active` from selected items in the multi-select story. This also affects the implementation bridge: `[data-selected]` → `.active` only applies to single-select mode; multi-select mode bridges to `checked` on the checkbox child, not `.active` on the item.
- `SectionGrouping`: section header `<div>` elements lacked side borders, making the outer border appear broken where headers were interleaved with items. Root cause: Bootstrap's `.list-group-item` border model puts the outer border on each item; non-item children break the continuity. Fix: added `.list-group-sectioned` modifier class to `augments.scss` — moves outer border/radius to the container, strips items/headers to bottom-border-only internal borders. Principle: for sectioned lists, the outer border belongs on `.list-group`, not on individual items.

### Select
- `OpenDropdown`: trigger showed placeholder instead of selected value. Fix: set `defaultValue="banana"` to match the active dropdown item. Principle extracted: P-S005.

### Tabs
No notes. LGTM.

## Principles extracted

- **P-S004** (prior session): lay out specimens in a flex-wrap container; never specify a fixed column count in the taxonomy.
- **P-S005**: open-state specimens must show a selected value in the trigger, matching the active item in the open panel. An empty trigger paired with an open panel is an unrealistic and misleading specimen.

## Skill update status
- [x] `agent/mapping-and-references-skill.md` updated
- [x] Finalized taxonomy files merged to `mapping-and-references`
- [x] Finalized story files merged to `mapping-and-references`
- [x] `CLAUDE.md` iteration counter incremented
