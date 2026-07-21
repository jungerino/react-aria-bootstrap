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
*(Populated during Stage 4)*

**Principles used:**
- *(e.g., `M016 decisions-needed`, `P-S001 faux-focus`)*

## Stage 5

### Select
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*

### Tabs
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*

### TagGroup
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*
