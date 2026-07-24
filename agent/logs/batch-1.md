# Batch 1

## Components

- Select
- Tabs
- TagGroup

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

### Select

- File: `stories/react-aria-bootstrap/reference/Select.reference.stories.tsx`
- Approved stories: Default, Sizes, States, OpenSingleSelect, OpenMultiSelect, WithLabelAndDescription

### Tabs

- File: `stories/react-aria-bootstrap/reference/Tabs.reference.stories.tsx`
- Approved stories: Default, States, Vertical, FillAndJustified

### TagGroup

- File: `stories/react-aria-bootstrap/reference/TagGroup.reference.stories.tsx`
- Approved stories: Default, States, Removable, WithLabelAndDescription

## Stage 4

### Select

**Decisions needed:**

1. **Size variant exposure (`.form-select-sm` / `.form-select-lg`).** Bootstrap's Form Select offers `.form-select-sm` and `.form-select-lg` modifier classes with no React Aria `Select` prop equivalent (the `Select` API has no `size` prop). Per M016 trigger pattern 1 (variant exposure), this needs a scope decision: (a) expose a custom `size` prop on this library's `Select` wrapper that adds the modifier class, (b) leave it as a `className`/passthrough-only concern with no dedicated prop, or (c) exclude size variants from scope entirely for this pass.
   **Answer:** Custom `size` prop — add a `size` prop (sm/lg) to this library's Select wrapper that applies the modifier class directly.

2. **Selected-item indicator for single-selection mode.** The existing shared `DropdownItem` (`src/ListBox.tsx`, reused by `Select` via `SelectItem`) unconditionally renders a `<Check />` icon next to any item where `isSelected` is true, regardless of `selectionMode`. Bootstrap's own Dropdown docs show no checkmark convention at all — a selected/active `.dropdown-item` is indicated by background/color highlight only (`.dropdown-item.active`). For Select specifically (most commonly used in single-selection mode, where exactly one value is always "selected" whenever the popover is open), does the reference target keep the checkmark for single-select too (consistent with the shared component's existing behavior, and with multi-select), or should single-select suppress the checkmark and rely on background highlight alone (closer to native `<select>`/Bootstrap-dropdown convention, requiring a Select-specific override of the shared item)?
   **Answer:** Suppress the checkmark for single-select, relying on background highlight only (requires a Select-specific override of the shared item). Additionally: multi-select uses a Bootstrap-styled checkbox (a visual-only element styled to look like `.form-check-input`, not a real `<input>`) instead of the default background highlight, replacing the checkmark-based indicator for multi-select too. Reference examples of multi-select are included in scope.

**Principles used:**
- `M001 dom-first`, `M002 sub-parts`, `M003 kb-sequence`, `M004 bridge-selector`, `M007 compiled-css-authoritative`, `M010 content-states`, `M012 custom-controls`, `M014 dual-counterpart`, `M015 variant-authority`, `M016 decisions-needed`, `M017 css-delta`, `M018 elem-type-sub`, `M019 m014-class-in-decisions`, `M020 one-component-class`, `P-001 faux-state`, `P-002 selector-context`, `P-003 css-classes-not-inline-styles`, `P-004 flex-wrap`, `P-005 open-state-selected-value`, `P-006 over-inclusion`, `P-007 target-appearances-only`, `P-008 label-every-specimen`, `P-009 state-matrix-per-family`, `P-011 extract-reference-css`, `P-013 verify-every-specimen`, `P-014 focus-vs-hover-tokens`, `P-015 compiled-css-incomplete`, `P-016 faux-focus-distinguishability`, `P-018 caret-rotation`, `P-019 dual-counterpart-specimen-element`, `P-020 record-specimen-data`

### Tabs

**Decisions needed:**

1. **Nav style variant exposure (`.nav-tabs` / `.nav-pills` / `.nav-underline`).** Bootstrap's Nav/Tabs component offers three visually distinct style variants for the tab list — `.nav-tabs` (bordered, visually connects to the panel below via a border-color trick), `.nav-pills` (solid rounded-pill active state), and `.nav-underline` (colored bottom-border + bold active text) — with no React Aria `Tabs`/`TabList` prop equivalent to select among them. Per M016 trigger 1 (variant exposure), this needs a scope decision: (a) expose a custom prop (e.g. `variant="tabs" | "pills" | "underline"`) on this library's `TabList` wrapper that applies the corresponding modifier class, defaulting to one variant; (b) fix a single Bootstrap style as the permanent default with no prop, excluding the other two from scope; (c) leave it as a `className`/passthrough-only concern with no dedicated prop.
   **Answer:** Fix one default — use Bootstrap's `.nav-underline` as the only supported nav style; no prop for switching between `.nav-tabs`/`.nav-pills`/`.nav-underline`.

2. **`SelectionIndicator`'s role, given no Bootstrap counterpart.** React Aria's `<Tab>` always renders a child `<SelectionIndicator>` — an absolutely-positioned, animated bar/pill overlay that slides between tabs on selection change. Bootstrap's Nav/Tabs has no equivalent floating-indicator element; Bootstrap expresses the "active" tab purely through static classes/colors applied directly to `.nav-link.active` (border/background for `.nav-tabs`, solid pill fill for `.nav-pills`, colored underline + bold text for `.nav-underline`) — no separate DOM element, no animation. Per M006 (no direct counterpart) and M016 (multiple viable implementation paths), this needs a decision: (a) keep `SelectionIndicator` and style it to reproduce the chosen variant's active-state look as an animated overlay (e.g. a sliding pill for `.nav-pills`, an animated underline bar for `.nav-underline`), layering React Aria's built-in animation on top of Bootstrap's token values; (b) suppress/hide `SelectionIndicator` entirely and apply the "active" look via static styling directly on `[data-selected]`, discarding the animation and matching Bootstrap's literal non-animated behavior; (c) a hybrid — keep it only for variants where it adds value (e.g. `.nav-pills`) and hide it for others (e.g. `.nav-tabs`, whose active look is already fully expressed through border/background change without an overlay). This decision is entangled with Decision 1 — the chosen Bootstrap style constrains which `SelectionIndicator` treatment makes visual sense.
   **Answer:** Suppress it entirely; rely on static `[data-selected]` styling on the tab itself (matches native Bootstrap `.nav-link.active` convention).

3. **Fill/justify layout exposure (`.nav-fill` / `.nav-justified`).** Bootstrap offers `.nav-fill` (tabs proportionally fill available width) and `.nav-justified` (tabs forced to equal width) modifier classes for the tab list, with no React Aria `TabList` prop equivalent. Per M016 trigger 1 (variant exposure), this needs a scope decision: (a) expose a custom prop on `TabList` (e.g. `fill="proportional" | "justified"`) that applies the corresponding modifier class; (b) leave it as a `className`/passthrough-only concern; (c) exclude fill/justify layout from scope entirely for this pass.
   **Answer:** Custom prop — add a prop to this library's `Tabs` wrapper that applies `.nav-fill` or `.nav-justified` directly.

**Principles used:**
- `M001 dom-first`, `M002 sub-parts`, `M003 kb-sequence`, `M004 bridge-selector`, `M006 no-counterpart`, `M007 compiled-css-authoritative`, `M010 content-states`, `M011 structural-variants`, `M015 variant-authority`, `M016 decisions-needed`, `M017 css-delta`, `M018 elem-type-sub`, `M020 one-component-class`, `P-001 faux-state`, `P-002 selector-context`, `P-003 css-classes-not-inline-styles`, `P-004 flex-wrap`, `P-007 target-appearances-only`, `P-008 label-every-specimen`, `P-009 state-matrix-per-family`, `P-011 extract-reference-css`, `P-013 verify-every-specimen`, `P-014 focus-vs-hover-tokens`, `P-016 faux-focus-distinguishability`, `P-020 record-specimen-data`

### TagGroup

**Decisions needed:**

1. **Tag's applied Bootstrap component class — no direct counterpart.** React Aria's `Tag` is an interactive, focusable, hoverable, selectable, optionally-removable chip (`data-hovered`/`data-pressed`/`data-focused`/`data-focus-visible`/`data-selected`/`data-disabled` all fire on it). Bootstrap has no dedicated "chip"/"tag" component. Two candidates diverge sharply: `.badge` is the visual/shape match (small, pill-capable, colored label) but defines **zero** interactive pseudo-class rules in compiled CSS (verified — only a base rule, `:empty`, and a `.btn .badge` nesting correction exist); `.btn` is the interactive-state match (full `:hover`/`:focus-visible`/`:active`/`:disabled` cascade with a rich CSS-variable namespace) but is visually a full-size button, not a chip. Per M020 (one component class per element), options: (a) apply `.btn` as the sole component class and override its CSS custom properties toward badge-like visual tokens (small padding, pill `border-radius`, smaller `font-size`) — the interactive cascade comes free, only visual tokens need overriding; (b) apply `.badge` as the sole component class and hand-build the entire interactive state cascade (hover/focus-visible/active/disabled) via bridge rules from scratch, since Bootstrap defines none of them for `.badge`; (c) apply `.list-group-item-action` (has its own native hover/focus/active cascade) — but its rectangular list-item shape (no pill/rounded treatment) diverges further from a chip's appearance than either `.btn` or `.badge`.
   **Answer:** `.btn`, override tokens — apply `.btn` as the sole component class and override its CSS custom properties toward badge-like visual tokens (small padding, pill border-radius, smaller font-size); the interactive cascade comes free.

2. **Theme-color / variant exposure for Tag.** Bootstrap's Badge (`.text-bg-{primary,secondary,success,info,warning,danger,light,dark}`) and Button (`.btn-{color}`/`.btn-outline-{color}`) vocabularies both offer 8 theme-color variants, with no React Aria `Tag`/`TagGroup` prop equivalent. Per M016 trigger 1 (variant exposure): (a) expose a custom `variant`/`color` prop on `Tag` (or on `TagGroup`, cascading to all children) selecting among Bootstrap's theme colors; (b) fix a single neutral default (e.g. secondary/gray, matching the vanilla-starter reference's neutral default) with no prop, reserving color change for the `data-selected` state only; (c) leave as `className`/passthrough-only concern, no dedicated prop.
   **Answer:** Fixed neutral default — fix a single neutral default (e.g. secondary/gray) with no prop; reserve color change for the selected state only. (Resolved in the taxonomy to `.btn-outline-secondary` specifically — see TagGroup-taxonomy.md Decisions D2 refinement.)

3. **Selected-state visual treatment, and `SelectionIndicator`'s role.** React Aria's `Tag` receives a `SelectionIndicatorContext` (an optional `<SelectionIndicator/>` child) — the same no-Bootstrap-counterpart mechanism already resolved for Tabs (Batch 1 Tabs Decision 2: suppressed entirely, static `[data-selected]` styling on the tab itself instead, per M006). TagGroup's `selectionMode` can be `single` or `multiple` (concurrently-selected chips is a common "filter chip" pattern), and Select's precedent (Batch 1 Select Decisions D4/D5) used a checkbox indicator specifically for multi-select while suppressing it for single-select. Options: (a) mirror Tabs' resolution exactly — suppress `SelectionIndicator` entirely, rely on background/color fill change via a `[data-selected]` bridge for both selection modes (matches common filter-chip conventions: selected = filled background, no separate glyph); (b) mirror Select's split resolution — prepend a checkmark-style indicator (`.form-check-input`-styled visual) for `selectionMode="multiple"` specifically, while single-select uses background fill alone; (c) always show a checkmark regardless of selection mode.
   **Answer:** Mirror Tabs — suppress `SelectionIndicator` entirely for both selection modes; rely on background/color fill change via a `[data-selected]` bridge (matches Tabs Decision 2 precedent).

4. **Remove-button (`Button slot="remove"`) Bootstrap counterpart.** Bootstrap's closest convention for a small dismiss glyph is `.btn-close` (used across Alert/Modal/Offcanvas/Toast; has its own hover/focus/disabled cascade) — but its glyph is a fixed-color `background-image` (`--bs-btn-close-bg`, black or white only via dark-mode inversion, not `currentColor`-tintable), unlike the project's existing lucide-react `<X/>` inline SVG already used in `src/TagGroup.tsx` (and precedented by Select's Chevron icon, kept as a real unreplaced child SVG element rather than forced into Bootstrap's background-image arrow mechanism — Select-taxonomy.md Sub-parts row "Chevron icon"). Options: (a) apply `.btn-close` as the component class for its hover/focus/disabled state cascade and sizing tokens, but override `--bs-btn-close-bg: none` and render the real `<X/>` SVG on top, colored via `currentColor` so it adapts to the tag's variant/selected color; (b) skip `.btn-close` entirely and hand-build a plain circular icon-button treatment (no dedicated Bootstrap component class, informal token-borrowing only), keeping the real `<X/>` SVG throughout.
   **Answer:** Use `.btn-close` for its hover/focus/disabled cascade and sizing tokens, but instead of overriding the background-image with a real SVG, render Bootstrap's close icon via the icon font (`<i class="bi bi-x">`), per this project's P022 bs-icons principle (prefer Bootstrap Icons over inline SVG when an equivalent exists; `bootstrap-icons` is already an installed dependency).

**Principles used:**
- `M001 dom-first`, `M002 sub-parts`, `M003 kb-sequence`, `M004 bridge-selector`, `M006 no-counterpart`, `M007 compiled-css-authoritative`, `M010 content-states`, `M011 structural-variants`, `M015 variant-authority`, `M016 decisions-needed`, `M017 css-delta`, `M018 elem-type-sub`, `M020 one-component-class`, `P-001 faux-state`, `P-002 selector-context`, `P-003 css-classes-not-inline-styles`, `P-004 flex-wrap`, `P-006 over-inclusion`, `P-007 target-appearances-only`, `P-008 label-every-specimen`, `P-009 state-matrix-per-family`, `P-011 extract-reference-css`, `P-013 verify-every-specimen`, `P-016 faux-focus-distinguishability`, `P-017 asymmetric-spacing-verified`, `P-020 record-specimen-data`, `P022 bs-icons`

## Stage 5

### Select
**Principles used:**
- `P001 compound-sel` — kept the RAC default class alongside Bootstrap classes throughout (`.react-aria-Button.form-select`, `.react-aria-ListBoxItem.dropdown-item`, `.react-aria-Popover.dropdown-menu`, `.react-aria-Select`)
- `P002 class-in-tsx` — callback form (`{ defaultClassName } => ...`) used for every className in `Select.tsx`
- `P003 scss-bridge` — all `data-*` states bridged in `_bootstrap-bridges.scss`
- `P005 bundle-isolation` — rebuilt directly on `react-aria-components` primitives instead of the vanilla-starter's shared `src/Button.tsx`/`ListBox.tsx`/`Popover.tsx`/`Form.tsx` wrappers, since those unconditionally import original per-component CSS keyed to the vanilla theme's token namespace
- `P007 variant-replace` — custom `size` prop (`sm`/`lg`) resolves to `form-select-sm`/`form-select-lg`, replacing the component-library-inherited variant concept entirely (taxonomy Decision D3)
- `P011 cursor-pointer` — `cursor: pointer` added explicitly on `.react-aria-ListBoxItem.dropdown-item` (a `<div>`, not a native interactive element)
- `P013 prefer-component-cls` — `.form-select`, `.dropdown-item`, `.dropdown-menu`, `.form-label`, `.form-text`, `.invalid-feedback` used throughout; no layout utility classes needed in the component itself
- `P024 caret-flip` — `.react-aria-Select[data-open] .lucide-chevron-down { transform: rotate(180deg); }`
- `P036 derive-from-counterpart` — Button's disabled/invalid/focus bridges and ListBoxItem's hover/focus/pressed/disabled/selected bridges all copied from `.form-select`'s and `.dropdown-item`'s real compiled-CSS mechanism in the extracted reference CSS, not re-derived from visual similarity
- `P038 prop-audit-first` — cross-checked Select's full prop table via `mcp__react-aria__get_react_aria_page` against the taxonomy's Variants section during Preparation Phase; no gap found
- `P040 container-owns-boundary` — Popover (container) owns the `.dropdown-menu` visual chrome (border/radius/background); ListBox and its items own no boundary of their own (Decision D2)
- `P041 value-display-stable-dims` — implemented per the principle's own example structure: a hidden `.option-sizer` span inside the trigger `Button`, containing every option's text as an individual block child, so the trigger's width resolves to the widest *option*, not just the current value. (An earlier pass skipped this on the reasoning that the current specimen data made the two cases coincide — rejected by the coordinator per `SKILL.md` G060 `dataset-coincidence-skip`; implemented for real, see `select-findings.md`'s Correction section.)
- `P042 right-anchor-indicator` — `justify-content: space-between` on the trigger's value+caret row pins the chevron to the trailing edge regardless of value text length
- `P044 faux-state-class` — `.faux-hover`/`.faux-focus` (already defined in `presentation.scss`) applied to specific mirror-story `SelectItem`s, and a new `.faux-open` bridge rule (rotating the real trigger chevron) applied to the OpenSingleSelect/OpenMultiSelect trigger specimens, matching the reference story's own `.select-caret.faux-open` treatment for the same specimens — states that can't be produced without live interaction
- `P047 presentation-import` — mirror story imports `../presentation.scss` directly
- `P049 rac-trigger-width` — `.react-aria-Popover.dropdown-menu[data-trigger='Select'] { width: var(--trigger-width); }`
- `P050 reboot-mismatch` — taxonomy DOM conflicts "Trigger element type" (M018, native `<select>` → real `<button>`): `select { overflow-wrap: normal }` and `select:disabled { opacity: 1 }` are bare-`select`-scoped reboot rules that won't match the substituted button; reproduced explicitly in `_bootstrap-bridges.scss`
- `P052 portal-no-ancestor-sel` — Popover bridge selectors written with no ancestor prefix, scoped via `[data-trigger='Select']` instead

### Tabs
**Principles used:**
- `P001 compound-sel` — RAC default class kept alongside Bootstrap classes throughout (`.react-aria-Tab.nav-link`, `.react-aria-TabList.nav`, `.react-aria-TabPanels.tab-content`, `.react-aria-Tabs`)
- `P002 class-in-tsx` — callback form used for `Tab`/`TabList`; literal-string form 2 used for `TabPanels` specifically, since its `className` prop has no render-prop form (verified via the API table) and passing any string replaces the RAC default outright (G040)
- `P003 scss-bridge` — `[data-selected]`/`[data-disabled]` bridged explicitly on `Tab`; `[data-focus-visible]`/`[data-inert]`/`[data-entering]`/`[data-exiting]` bridged on `TabPanel`
- `P005 bundle-isolation` — built directly on `react-aria-components` primitives instead of importing the pre-existing `src/Tabs.css` (vanilla-starter per-component CSS keyed to the phased-out `--text-color`/`--spacing-*` token namespace), matching Select's precedent
- `P013 prefer-component-cls` — `.nav`, `.nav-underline`, `.nav-link`, `.tab-content` used throughout; Decision D3's fill/justify variant applies the real `.nav-fill`/`.nav-justified` Bootstrap classes via React Context rather than a synthetic bridge selector reproducing their effect
- `P033 verify-scss-vars` — `--bs-focus-ring-width`/`--bs-focus-ring-color` (TabPanel's custom focus treatment) confirmed present in the pre-extracted reference CSS before use
- `P036 derive-from-counterpart` — `[data-selected]`/`[data-disabled]` bridge property values copied verbatim from `.nav-underline .nav-link.active`/`.nav-link.disabled`'s real compiled-CSS declarations in the extracted reference CSS
- `P038 prop-audit-first` — cross-checked the full Tabs/TabList/Tab/TabPanels/TabPanel prop tables via `mcp__react-aria__get_react_aria_page` against the taxonomy's Variants section; no prop gap found (orientation, keyboardActivation, Tab.isDisabled, Tab.href, TabPanel.shouldForceMount all covered)
- `P044 faux-state-class` — `.faux-hover`/`.faux-focus-visible` (already defined in `presentation.scss` for the Tabs reference story) applied via `Tab`'s className-passthrough for the States story's Hover/Focused specimens
- `P047 presentation-import` — mirror story imports `../presentation.scss` directly
- Taxonomy completeness gap (not a listed principle ID): cross-checking `react-aria-components/dist/private/Tabs.js` directly found the Tabs root also carries `data-focused`/`data-focus-visible`/`data-disabled`, absent from the taxonomy's Tabs-root state-mapping table (only `data-orientation` listed). Left unbridged — no Bootstrap counterpart exists for a whole tabs+content composite's focus-within ring or disabled treatment, and an unmatched `data-*` attribute renders no visual output on its own. Logged in `tabs-findings.md` per principles.md's "When Bootstrap Mapping Cannot Be Found" appendix.

### TagGroup
**Principles used:**
- `P001 compound-sel` — RAC default class kept alongside Bootstrap classes throughout (`.react-aria-Tag.btn`, `.react-aria-Button.btn-close.remove-button`, `.react-aria-TagGroup`, `.react-aria-TagList`)
- `P002 class-in-tsx` — callback form used for `Tag`/remove `Button`/`TagList`; literal-string form 2 used for `TagGroup` root specifically, since its `className` prop has no render-prop form (verified via `dist/types/src/TagGroup.d.ts`) and passing any string replaces the RAC default outright (G040)
- `P003 scss-bridge` — `[data-hovered]`/`[data-pressed]`/`[data-selected]`/`[data-disabled]`/`[data-allows-removing]` bridged explicitly on `Tag`; `[data-hovered]` bridged on the Remove Button
- `P005 bundle-isolation` — rebuilt directly on `react-aria-components/TagGroup`'s own re-exports (`TagGroup`, `TagList`, `Tag`, `Button`, `Label`, `Text`) instead of the vanilla-starter's shared `src/Form.tsx`/`src/Content.tsx` wrappers, matching Select/Tabs' precedent
- `P013 prefer-component-cls` — `.btn`, `.btn-outline-secondary`, `.btn-close`, `.form-label`, `.form-text`, `.invalid-feedback` used throughout; `.d-flex.flex-wrap.gap-2` utilities used only for TagList, which has no Bootstrap component-class counterpart at all (taxonomy M006)
- `P022 bs-icons` — Remove Button glyph rendered as `<i class="bi bi-x">` instead of the original stub's `lucide-react` `<X/>` (Decision D4)
- `P036 derive-from-counterpart` — `[data-hovered]`/`[data-pressed]`/`[data-selected]`/`[data-disabled]` bridge property values copied verbatim from `.btn:hover`/`.btn-check:checked + .btn, ...:active`/`.btn-primary`'s own token block/`.btn:disabled, .btn.disabled` in the pre-extracted reference CSS, not re-derived from visual similarity
- `P038 prop-audit-first` — cross-checked `AriaTagGroupProps`/`TagProps` (via `useTagGroup.d.ts` and `TagGroup.d.ts`, `mcp__react-aria__get_react_aria_page` having no dedicated data-attributes table for this component per the taxonomy's own Confidence section) against the taxonomy's Variants section; no prop gap found
- `P040 container-owns-boundary` — not directly triggered (Tag has no child sub-boundary to own), but its converse informed Decision D1's resolution: `.btn`'s own border/radius live on the Tag element itself, not distributed across sub-elements
- `P044 faux-state-class` — `.faux-hover`/`.faux-focus-visible`/`.faux-pressed` (already defined in `presentation.scss` for the TagGroup reference story) applied via `Tag`'s className passthrough for the States story; extended via a new `removeButtonClassName` prop on `Tag` so the Removable story could apply the same faux classes to the nested Remove Button specifically
- `P047 presentation-import` — mirror story imports `../presentation.scss` directly, reusing its pre-existing `.tag`/faux-state/`.tag-selected`/`.btn-close.remove-button` rules rather than duplicating them into `_bootstrap-bridges.scss` (same pattern as Select's `.select-item-checkbox` reuse)
- `P053 prefer-visual-target-class` — confirmed `.btn-outline-secondary`'s hover/active/disabled rules produce visible output on `.react-aria-Tag.btn` as applied (not left silently inert, per the taxonomy's "Tag base token gap" DOM conflict); the `[data-selected]` override was written as a full token-set bridge rather than adding a second component class
- G050 (native-active-keyboard-gap) — considered and found inapplicable to Tag's/Remove Button's `data-focused`/`data-focus-visible` (no bridge needed there, per taxonomy): the gap G050 describes is specific to `:active` under keyboard activation, not `:focus-visible`, which fires correctly for keyboard focus regardless of input modality on a genuinely focusable element
