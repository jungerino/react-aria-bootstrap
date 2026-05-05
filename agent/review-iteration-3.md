---
title: Review — Iteration 3
---

# Review — Iteration 3

## Agent Iteration Summary

### Decisions made

**Button**
- Applied `.btn.btn-{variant}` as the Bootstrap class pair, with a `variantClassMap` mapping all 9 Bootstrap variant names (primary through link) to their `btn-{variant}` class.
- Replaced the inherited project variant type with a `VARIANTS` const and a `Variant` type derived from it, making Bootstrap's variant set the authoritative prop contract.
- Bridge: `[data-pressed]` maps to Bootstrap's `:active` token values (`--bs-btn-active-color`, `--bs-btn-active-bg`, `--bs-btn-active-border-color`) via `@include box-shadow(...)` mixin.
- `ProgressCircle` pending indicator retained as-is (non-Bootstrap UI internal).
- Variants story uses `v.charAt(0).toUpperCase() + v.slice(1)` to title-case rendered labels.
- `argTypes.variant` uses `control: { type: 'select' }` since VARIANTS has 9 values.
- Principles used: P001: compound-sel, P007: variant-replace, P014: data-pressed, P015: scss-mixins, P029: argtypes-control, P032: title-case-labels

**TextField**
- Applied `.form-label`, `.form-control`, `.form-text`, `.invalid-feedback.d-block` to Label, Input, Description, and FieldError respectively.
- Added `d-block` to `.invalid-feedback` because Bootstrap hides it with `display: none` by default; React Aria mounts/unmounts conditionally rather than toggling visibility, so `.d-block` ensures it's visible whenever mounted.
- Bridge: `.react-aria-Label.form-label` resets `font: inherit` to prevent project Form.css font shorthand from leaking (P009/P021 analog). Bridge: `.react-aria-TextField[data-invalid] .react-aria-Input.form-control` maps `[data-invalid]` to Bootstrap's invalid border color.
- WithDescription, Invalid, and Disabled state stories added.
- No string-union props requiring `argTypes`.
- Principles used: P001: compound-sel, P003: scss-bridge, P009: clean-slate, P013: prefer-component-cls, P031: state-stories

**Checkbox**
- Bootstrap's `.form-check-input` targets native inputs directly; React Aria hides the native input. Replicated Bootstrap's checkbox visual outcome on a custom `.indicator` `<div>` via bridge selectors.
- Indicator sized `1rem × 1rem` in rem (not em) to match Bootstrap's own `.form-check-input` sizing regardless of inherited font-size.
- Bridge state machine covers: rest (border + bg), `[data-selected]` (filled + checkmark via `escape-svg($form-check-input-checked-bg-image)`), `[data-indeterminate]` (indeterminate fill + dash icon), `[data-focus-visible]` (outline ring using `$input-focus-width`/`$input-focus-color`), `[data-disabled]` (opacity + pointer-events).
- `@include transition(...)` used for smooth state transitions.
- Cursor: pointer added on the Checkbox wrapper (non-anchor `<label>`-equivalent element).
- SCSS variable correction: Bootstrap 5.3.8 uses `$form-check-input-border` (shorthand) not separate `$form-check-input-border-width` / `$form-check-input-border-color`. Also `$form-check-input-checked-bg-size` does not exist; Bootstrap hardcodes `background-size: contain`, which is already set in the base indicator rule — line removed.
- Principles used: P001: compound-sel, P003: scss-bridge, P010: form-attach, P011: cursor-pointer, P015: scss-mixins, P016: fixed-dims, P026: use-rem

**Select**
- React Aria Select renders a `<button>` trigger + Popover overlay + ListBox. Bootstrap's `.form-select` targets a native `<select>` and does not apply. Matched to Bootstrap's dropdown pattern instead.
- Trigger: `.btn.btn-secondary.dropdown-toggle`; Popover: `.dropdown-menu.show` (hardcoded `.show` per P025); items: `.dropdown-item`.
- Trigger layout bridge: `display: flex; align-items: center; gap: 0.5rem` for SelectValue + caret alignment.
- Caret flip: `[aria-expanded="true"]::after { transform: rotate(180deg) }` on `.dropdown-toggle` (P024).
- Bootstrap renders the caret via `dropdown-toggle::after` pseudo-element — no JSX caret icon added (P023).
- Popover bridge resets Popover.css defaults: `filter: none`, explicit `background-color`, `border`, `border-radius`, `box-shadow` using Bootstrap SCSS variables.
- Item state bridges: `[data-focused]` → hover styles, `[data-selected]` → active styles, `[data-disabled]` → disabled color + pointer-events.
- `[data-invalid]` on the Select wrapper bridges to the trigger's border color.
- `min-width: var(--trigger-width)` on the popover preserves width alignment with the trigger.
- WithDescription, Invalid, and Disabled state stories added.
- Principles used: P001: compound-sel, P003: scss-bridge, P011: cursor-pointer, P012: match-dom, P013: prefer-component-cls, P015: scss-mixins, P023: css-native-visual, P024: caret-flip, P025: hardcode-show, P031: state-stories

**Tabs**
- Applied `.nav.nav-tabs` to TabList, `.nav-link` to Tab, `.tab-content` to TabPanels, `.tab-pane.active.show` to TabPanel. Hardcoded `.active.show` on each TabPanel since React Aria mounts/unmounts panels (P025 analog for tab panels).
- Root layout bridge: `flex-column` for horizontal, `flex-row` for vertical. Vertical orientation bridges: `border-bottom: none; border-right: $nav-tabs-border-width solid $nav-tabs-border-color` on the TabList; active tab border correction via `border-color` four-value shorthand to attach the active tab to the right border.
- `[data-selected]` bridges active nav-link colors/bg/border. `[data-disabled]` bridges disabled color + pointer-events.
- Cursor: pointer added on `.react-aria-Tab.nav-link` (non-anchor element).
- `argTypes.orientation` added with `control: { type: 'inline-radio' }` (2 values).
- LayoutVariants story shows horizontal (default) and vertical side by side.
- Disabled story shows one tab individually disabled.
- Principles used: P001: compound-sel, P003: scss-bridge, P011: cursor-pointer, P025: hardcode-show (tab panels), P029: argtypes-control, P030: layout-variants-story, P031: state-stories

**Calendar**
- No Bootstrap calendar component exists. Closest pattern: individual cells treated as interactive buttons.
- Navigation buttons: `.btn.btn-sm.btn-outline-secondary` with `border-color: transparent` at rest; Bootstrap Icons chevrons (`bi-chevron-left`, `bi-chevron-right`) as icons (P022).
- Calendar cells: `.btn.btn-sm.btn-outline-secondary` on `<td>` elements. Bootstrap `btn` needed on non-`<button>` element for interaction CSS (P027). `btn-sm` reduces padding to prevent grid overflow (P028).
- Cell text color override: `btn-outline-secondary` sets text to the secondary variant color; overridden to `color: var(--bs-body-color)` for readable body text (P021).
- Border at rest: `border-color: transparent` on cells (no visible border at rest, P019).
- `[data-today]`: color primary + font-weight 600.
- `[data-selected]`: filled cell using `--bs-btn-active-color/bg/border-color` tokens.
- `[data-outside-month]`: `display: none`.
- `[data-unavailable]`: line-through + danger color.
- CalendarHeaderCell: explicit `text-align: center` to override Bootstrap reboot's `th { text-align: inherit }` (P020).
- `[data-pressed]` on CalendarCell covered by shared Button/CalendarCell bridge rule in the BUTTON section.
- Calendar layout (width, header flex, heading style) declared from scratch in bridge — no Calendar.css in bundle (P009).
- Principles used: P001: compound-sel, P003: scss-bridge, P009: clean-slate, P014: data-pressed, P017: border-transparent, P019: outline-base, P020: reboot-align, P021: outline-text-color, P022: bs-icons, P027: btn-non-button, P028: btn-sm-dense

**ListBox**
- Applied `.list-group` to ListBox, `.list-group-item.list-group-item-action` to ListBoxItem.
- Bridge: `[data-focused]` → hover colors; `[data-pressed]` → active colors; `[data-selected]` → active state (overrides focused/pressed); `[data-disabled]` → disabled color + bg + pointer-events.
- Used explicit Bootstrap token values (`var(--bs-list-group-border-radius)`) on the ListBox container rather than relying on Bootstrap's `:first-child`/`:last-child` structural selectors, which break when `<ListBoxSection>` inserts wrapper elements (P008).
- Section headers: sticky positioning, small caps styling using explicit values — Bootstrap's list-group structural selectors wouldn't fire through the section wrapper.
- Cursor: pointer on `.list-group-item-action` (non-anchor element, P011).
- `argTypes.selectionMode` uses `control: { type: 'inline-radio' }` with 3 options (P029).
- Sections story shows section headers with multiple selection.
- Principles used: P001: compound-sel, P003: scss-bridge, P008: structural-sel, P011: cursor-pointer, P013: prefer-component-cls, P029: argtypes-control

---

### Uncertainties

1. **Checkbox indicator width** — The indicator uses `1rem` while Bootstrap's `.form-check-input` uses `$form-check-input-width: 1em`. Since `em` scales with local font-size and `rem` anchors to root, `rem` was chosen per P026. If these components are embedded in smaller-font-size contexts, the indicator may appear slightly oversized relative to the native input in a reference component. Not clearly wrong — documenting for user awareness.

2. **Select trigger width** — The Select trigger button does not auto-expand to full container width. Used `width: 100%` in the bridge on `.react-aria-Select .react-aria-Button.dropdown-toggle`. This produces correct behavior in a standard form layout, but may interact unexpectedly with button groups or inline form variants.

3. **TabPanel `.active.show` hardcode** — React Aria mounts/unmounts panels. Hardcoding `.active.show` on every mounted TabPanel is the correct approach (per P025), but it means the CSS fade-in animation from `.tab-pane.fade.show` cannot be applied, since panels mount already visible. This is a documented limitation of the React Aria + Bootstrap pattern.

4. **Calendar `[data-pressed]` sharing the Button bridge rule** — The `[data-pressed]` bridge for `.react-aria-CalendarCell.btn[data-pressed]` is colocated in the BUTTON section alongside the Button rule. This keeps related `[data-pressed]` logic together but may be non-obvious when reviewing Calendar behavior. Alternative: move it to the CALENDAR section. Left as-is for now.

---

### Unmapped states

| Component | State/Element | Notes |
|-----------|--------------|-------|
| Calendar | Full component | No Bootstrap counterpart. Cell treatment: `btn-outline-secondary` + `border-color: transparent`. Logged in Bootstrap Counterpart Pairings. |
| TextField | `[data-hovered]` on Input | Native `<input>` — `:hover` fires automatically; no bridge needed. |
| TextField | `[data-focused]` on Input | Native `<input>` — `:focus-visible` fires automatically; no bridge needed. |
| Button | `[data-hovered]` | Native `<button>` — `:hover` fires automatically; no bridge needed. |

---

### Principle usage summary

| Principle | Times used | Components |
|-----------|-----------|------------|
| P001: compound-sel | 7 | Button, TextField, Checkbox, Select, Tabs, Calendar, ListBox |
| P003: scss-bridge | 6 | TextField, Checkbox, Select, Tabs, Calendar, ListBox |
| P011: cursor-pointer | 4 | Checkbox, Select, Tabs, ListBox |
| P013: prefer-component-cls | 4 | TextField, Select, Calendar, ListBox |
| P031: state-stories | 3 | TextField, Select, Tabs |
| P029: argtypes-control | 3 | Button, ListBox, Tabs |
| P015: scss-mixins | 3 | Button, Checkbox, Select |
| P009: clean-slate | 2 | TextField, Calendar |
| P025: hardcode-show | 2 | Select, Tabs |
| P017: border-transparent | 2 | Calendar (cells + nav buttons) |
| P014: data-pressed | 2 | Button, Calendar |
| P007: variant-replace | 1 | Button |
| P032: title-case-labels | 1 | Button |
| P010: form-attach | 1 | Checkbox |
| P016: fixed-dims | 1 | Checkbox |
| P026: use-rem | 1 | Checkbox |
| P012: match-dom | 1 | Select |
| P023: css-native-visual | 1 | Select |
| P024: caret-flip | 1 | Select |
| P030: layout-variants-story | 1 | Tabs |
| P008: structural-sel | 1 | ListBox |
| P019: outline-base | 1 | Calendar |
| P020: reboot-align | 1 | Calendar |
| P021: outline-text-color | 1 | Calendar |
| P022: bs-icons | 1 | Calendar |
| P027: btn-non-button | 1 | Calendar |
| P028: btn-sm-dense | 1 | Calendar |

**Unused principles:** P002: class-in-tsx, P004: conflict-css, P005: bundle-isolation, P006: modifier-audit, P018: postcss-scope

**Note on P002 (class-in-tsx):** The render-prop className form was not needed this iteration. All components could express Bootstrap classes as static strings. The render-prop form would be needed if state-dependent class switching were required at the TSX level (e.g. `data-selected` affecting the outer container class), but all such switching was handled via bridge selectors.

---

## User Visual Review

### Checkbox

**Bug — non-standard focus ring.** The bridge at `_bootstrap-overrides.scss:80–83` uses `outline: $input-focus-width solid $input-focus-color`. Two errors: (1) `$input-focus-color` is Bootstrap's *text* color for a focused input (`$input-color`), not the focus ring indicator color — the ring color is `$input-btn-focus-color` (a semi-transparent RGBA). (2) Bootstrap's focus ring on `.form-check-input` is a `box-shadow`, not an `outline` — so even if the color were correct, the wrong CSS property was used. The result is an outline drawn in the body text color (dark gray), which is non-standard. P033 also applies: `$input-focus-width` may not exist in Bootstrap 5.3 — the correct variable is `$input-btn-focus-width`. Root cause: variable names that sound like focus-ring colors (`*-focus-color`, `*-focus-width`) actually refer to text color and button focus width respectively; the SCSS variable naming is misleading.

### Calendar

**Bug — date cell numbers not vertically centered.** Visible in screenshot: numbers sit at the top of cells rather than centered. Not a principle gap — a layout omission.

**Bug — hover text contrast (light theme).** On hover, the background fills (Bootstrap's `btn-outline-secondary` hover state), but the text remains dark (`var(--bs-body-color)` from the P021 bridge override). Dark text against the filled hover background produces low contrast. Root cause: the P021 text-color override is not scoped to the rest state, so it persists through hover. Proposed new principle: text labels must maintain ≥ 4.5:1 contrast through all interaction states.

**Day-of-week abbreviation (single letter).** User prefers single-letter abbreviations over the multi-letter form used in prior iterations. React Aria's CalendarHeaderCell uses the browser's Intl API for day name formatting; narrow format ("T", "F", "S") vs. short format ("Mon", "Tue") depends on the `dateFormatter` options in use. The single-letter outcome this iteration was likely from a format difference, not a deliberate decision. No objective principle — user preference noted.

**Today's date — color-alone differentiation.** Applied `color: var(--bs-primary)` + `font-weight: 600` to today's cell. Two problems: (1) color alone conveys meaning, violating WCAG 1.4.1; (2) primary blue repurposes Bootstrap's established link/interactive-element color for a non-interactive state. No existing principle (P001–P033) addresses either of these. Gap: a principle is needed that requires non-color visual differentiation for state indication and prohibits co-opting Bootstrap's color conventions for unrelated states.

### ListBox

**Missing layout/orientation variant implementation and stories.** ListBox has `layout` (grid vs. stack) and `orientation` (horizontal vs. vertical) props; no bridge rules or stories were written for them. Bootstrap provides `.list-group-horizontal` as a modifier class that handles horizontal layout with corrected structural selectors and border handling — exactly what P006 requires checking for. P030 requires a Layout Variants story. Root cause: the agent worked from recall of the component's behavior rather than reading the React Aria documentation to enumerate the actual prop surface. P006 and P030 both start from "when a component has layout/orientation variants" — they assume identification has already happened. No principle required that identification from the documentation, so variants not in recall were silently dropped. This is the same failure as Button's omission of `btn-outline-*` (P007 root cause), applied to the React Aria prop surface. New principle: P038 — read the React Aria documentation and enumerate all props before implementing, flagging any with layout/orientation/selection-mode/variant semantics. Checklist amended from a passive downstream check to an active enumeration step.

**Focus state styling incorrect — invented rather than derived from Bootstrap counterpart.** The bridge used a hover-color mapping for `[data-focused]` that did not reproduce Bootstrap's actual `.list-group-item-action:focus` style. Root cause: P036 (derive bridge rules from Bootstrap's actual counterpart CSS) was not applied. Bootstrap's `.list-group-item-action` handles `:hover` and `:focus` together with the same rule — the correct derivation would have shown this. This is a P036 violation.

**ListBox sections — all-caps headings: motivated by convention, better motivated by Bootstrap sub-component identification.** The agent used all-caps small-caps styling for section headers, which the user considers a good outcome. However, the decision was made from general design convention rather than from identifying Bootstrap's conceptual counterpart: `.dropdown-header`, which Bootstrap uses for non-interactive section labels within a `.dropdown-menu` (a list of interactive items separated by headers — the same structural role). `.dropdown-header`'s actual CSS (smaller font, muted color, padding, no border, no text-transform) would have been the correct reference. A principle is needed for extending counterpart identification to sub-elements.

**ListBox sections — heading border causes discontinuous container and doubled borders.** The heading was given a bottom border with no side borders. Two consequences: (1) the outer container's side borders appear to stop and restart at each header, since the header's own element provides no side border; (2) the heading's bottom border and the adjacent item's top border stack, producing a doubled border appearance. Root cause: the border was invented from scratch rather than derived from Bootstrap's `.dropdown-header` (which has no border at all — differentiation is achieved through font size, color, and padding alone). This is a downstream consequence of the missing sub-element counterpart identification (P039).

### Tabs

**Connected-tab illusion not fully emulated.** Bootstrap's tab visual metaphor requires three coordinated properties across two elements: (1) `.nav-tabs` carries `border-bottom`; (2) every `.nav-link` within `.nav-tabs` has `margin-bottom: calc(-1 * var(--bs-nav-tabs-border-width))`, pushing it one pixel below the container's bottom border; (3) the active `.nav-link` gets `background-color: var(--bs-nav-tabs-link-active-bg)` (page background), covering the bottom-border segment where it sits. Properties (1) and (2) come from Bootstrap's own CSS automatically — they require no bridge. Property (3) must be explicitly included in the `[data-selected]` bridge; Bootstrap's rule fires on `.nav-link.active`, which React Aria never adds. If `background-color` is omitted from the bridge, the active tab has a transparent background and the container's bottom border shows through beneath it, breaking the visual connection to the panel below. Root cause: the bridge mapped state colors (foreground, border-color) but the visual metaphor verification step did not confirm that the end-to-end illusion was intact. No existing principle requires asking "does the rendered output reproduce the visual story Bootstrap intended" — only that individual state properties are derived from Bootstrap's CSS. New principle needed: P043.

**ListBox with overflow — outer container missing top and bottom borders.** The list-group pattern relies on item-level borders to produce the visual appearance of an outer container border (the first item's top border and last item's bottom border). When the component overflows (scrolls), those items scroll away, leaving the container without its top or bottom border. The outer container element needs its own explicit border, independent of item borders, whenever overflow is possible. No existing principle addresses this. New principle needed: P040.

**Multiple selection — adjacent selected items appear merged.** When two or more adjacent items are selected, they share the same filled background with no visual break between them, making them read as a single continuous selection rather than discrete items. Bootstrap has no multiple-selection behavior, so this required inference from common sense or React Aria conventions. A separator (visible border or gap) between adjacent selected items is the standard affordance. No existing principle addresses inferring visual separation needs for multiple selection. New principle needed: P037.

### Select

**Trigger width collapses to selected value length.** The button width shrinks and grows as the user selects different options. Correct behavior: the trigger should maintain a stable width sized to accommodate the widest option, so the control does not reflow the surrounding layout on selection change. Bootstrap's native `<select>` element sizes to the full option set automatically; the custom trigger must replicate this deliberately (e.g. via a hidden sizer element, or `min-width` derived from the option set). Root cause: the implementation applied `display: flex; gap: 0.5rem` to the trigger internals but set no width constraint, so the button intrinsically sizes to its content — the currently selected value. No existing principle addresses trigger width stability across value changes. New principle needed: P041.

**Caret shifts with selected text rather than sitting at the right edge.** Because the trigger uses flex layout with `gap`, the caret floats immediately after the SelectValue text instead of being pinned to the right edge of the button. Correct behavior: the caret should remain at the right regardless of how long or short the selected value is. Fix is `justify-content: space-between` on the trigger flex container (or `margin-left: auto` on the caret), so SelectValue occupies available space and the caret is always right-aligned. P024 addresses caret rotation on open/close but not caret placement. Root cause: `gap` layout does not push the caret to the far edge; `space-between` is required. New principle needed: P042.

---

## Debrief Decisions

*Populated during debrief.*

### Principles to update in `agent/react-aria-skill.md`

**P007: variant-replace** — Amended to require reading the Bootstrap documentation page for the component before finalizing the variant set. Root cause: Button omitted `btn-outline-{variant}` because the agent relied on recall rather than reading the docs. The existing principle said "full set" but didn't require verification against the source. Added: "Before finalizing the variant set, read the Bootstrap documentation page for that component and identify all meaningful variant classes from it — do not rely on recall."

**P033: verify-scss-vars** — Amended to require verifying what a variable *resolves to*, not just that it exists. `$input-focus-color` exists but resolves to the input text color (`$input-color`), not the focus ring color — the name is misleading. Applies on the no-counterpart path where bridge rules are constructed from scratch.

**P036: derive-from-counterpart** — New principle. When a Bootstrap counterpart exists for a React Aria component (e.g. `.form-check-input` for Checkbox), inspect Bootstrap's actual applied CSS for each state and derive bridge rules from it rather than constructing from SCSS variable names alone. Starting from Bootstrap's source CSS gives the right property (e.g. `box-shadow` not `outline`) and the right variables automatically.

**P034: contrast-all-states** — New principle. Root cause: Calendar cell text was overridden to `var(--bs-body-color)` (P021 fix) but the override was not scoped to the rest state, so dark text persisted against Bootstrap's filled hover background. Principle: text labels must maintain ≥ 4.5:1 contrast through all interaction states; when overriding text color, verify the full state machine.

**P035: no-color-alone** — New principle. Root cause: today's date was differentiated with `color: var(--bs-primary)` alone. Two gaps: WCAG 1.4.1 (color as sole visual cue) and co-opting Bootstrap's primary-blue convention (which signals interactive/link) for a non-interactive state. Principle: use a non-color visual attribute (border, background fill) as the primary state differentiator; color is additive, not primary.

**P039: sub-element-counterpart** — New principle. Root cause: ListBox section headers were styled from general design convention rather than from Bootstrap's structural sub-component for the same role (`.dropdown-header`). Both P012 and P036 apply counterpart identification at the top-level component; neither extends it to sub-elements. Principle: when a React Aria component has structural sub-elements (section headers, group labels, separators, dividers), look for Bootstrap sub-components that serve an equivalent role within the matched Bootstrap pattern, and derive styling from those. Example: non-interactive section labels within a list → `.dropdown-header` within `.dropdown-menu`.

**P040: overflow-container-border** — New principle. Root cause: the list-group's visual outer border is produced by item-level borders, not by a border on the container itself. When the component overflows (scrolls), the first and last items scroll away, removing the apparent outer border. Principle: when a list or grid component may scroll, add an explicit border to the outer container. Bootstrap's structural-selector-based border effects break at overflow boundaries; the container must carry its own border.

**P037: multi-select-separator** — New principle. Root cause: adjacent selected items in the ListBox shared the same filled background, making them read as a single merged selection. The separator need must be identified from the React Aria prop surface — it is a visual correctness requirement regardless of whether the underlying Bootstrap component offers multi-selection behavior. Principle: when a component supports multiple simultaneous selection and the selected-state style fills the item background, add a visible separator (border, outline, or gap) between adjacent selected items.

**P043: visual-metaphor-completeness** — New principle. Root cause: the Tabs `[data-selected]` bridge mapped color and border-color but the agent's goal was state property mapping, not end-to-end visual metaphor verification. Bootstrap components frequently produce visual effects through coordinated properties across multiple elements (negative margin + background on active tab; dropdown caret via `::after`; etc.). Bridging each state's colors correctly is necessary but not sufficient — the bridge must also reproduce every property that participates in the visual metaphor, and the rendered output must be verified to tell the same visual story Bootstrap intends. After bridging state, ask: "does the rendered component produce Bootstrap's characteristic visual behavior?" If any coordinated property is missing (e.g. `background-color` on the active tab), the illusion breaks even when colors are correct.

**P041: value-display-stable-dims** — New principle. Root cause: Select trigger width collapsed to the selected value's text length because no width constraint was applied. Bootstrap's native `<select>` sizes to its full option set; a custom trigger must replicate this deliberately. Generalized: any component whose rendered value changes during interaction (Select, ComboBox, DatePicker) must size its container to accommodate the full range of possible values. Finite option sets → hidden sizer element; open-ended → `width: 100%` or explicit width.

**P042: right-anchor-indicator** — New principle. Root cause: `display: flex; gap` on the trigger floated the caret immediately after the selected text. P024 covers caret rotation but not placement. Generalized: in any flex row that has a content region alongside a trailing indicator (caret, chevron, icon, badge), use `justify-content: space-between` or `margin-left: auto` on the indicator. Applies to trigger buttons, list items, accordion headers, nav links — anywhere a trailing indicator must not drift with content length.

### Component decisions to record in `agent/component-decisions.md`

*None yet.*

---

## Process Notes

### Model / Effort Recommendations

Provisional — not yet adopted into the protocol.

| Phase | Model | Effort |
|-------|-------|--------|
| Counterpart identification | Sonnet | normal |
| Implementation | Sonnet | extended thinking (`/think`) |
| Self-review / checklist | Sonnet | extended thinking (`/think`) |
| Debrief — principle extraction | Opus | normal |

Subagent spawning (Agent tool) supports per-invocation model selection, so these could be enforced autonomously if adopted into `iteration-protocol.md`.

---

## Skill Update Status

- [x] `agent/react-aria-skill.md` updated with new/refined principles (P007 amended; P033 amended; P034, P035, P036 added; P037, P038, P039, P040, P041, P042, P043 added; checklist amended)
- [x] `agent/component-decisions.md` — N/A (no component-specific decisions this iteration)
- [x] `CLAUDE.md` iteration number incremented — done on `main` (see below)
- [x] Committed
