---
title: Select Taxonomy
component: Select
iteration: 1
---

## Select

**React Aria root class:** `.react-aria-Select`
**Mapping type:** Composite — Trigger → `.btn.dropdown-toggle` (structural) + `.form-select` (visual), Popover → `.dropdown-menu`, ListBoxItem → `.dropdown-item`

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes | Notes |
|----------|--------------------|-----------------------|--------------------------|-------|
| Root wrapper | `.react-aria-Select` | None (wrapper `<div>`) | — | M006: No direct Bootstrap counterpart; closest structural equivalent is a `.dropdown` wrapper |
| Label | `.react-aria-Label` | `.form-label` | `.form-label` | Renders `<label>` — matches Bootstrap's expected element |
| Trigger (Button) | `.react-aria-Button` | `.btn.dropdown-toggle` (structural) + `.form-select` (visual) | `.btn.dropdown-toggle` | M014: Dual-counterpart. Structural: `.btn.dropdown-toggle` (renders `<button>`). Visual: `.form-select` token overrides for appearance. Bootstrap's `.form-select` targets native `<select>` — completely incompatible (CRITICAL conflict, patterns.md §2.2). |
| SelectValue | `.react-aria-SelectValue` | None (`<span>` inside trigger) | — | Renders selected text; `[data-placeholder]` when no selection |
| Caret icon | child `<svg>` inside `.react-aria-Button` | `.dropdown-toggle::after` | N/A — React Aria renders an actual element | Bootstrap generates caret via CSS `::after` pseudo; React Aria typically renders an SVG icon element. Use the icon element, not the CSS pseudo. |
| Popover | `.react-aria-Popover` | `.dropdown-menu` | `.dropdown-menu` | M006: No `[data-bs-popper]` added — positioning independent (patterns.md §2.2). Popover renders only when open; use `display: block` unconditionally on `.react-aria-Popover` when it is in the DOM. |
| ListBox | `.react-aria-ListBox` | None (inner list container) | — | Inside the Popover; wraps the items |
| ListBoxItem | `.react-aria-ListBoxItem` | `.dropdown-item` | `.dropdown-item` | Renders `<div>` — Bootstrap expects `<a>` or `<button>` (M018: element type substitution) |
| Description | `.react-aria-Text[slot="description"]` | `.form-text` | `.form-text` | Optional helper text below the trigger |
| FieldError | `.react-aria-FieldError` | `.invalid-feedback` | `.invalid-feedback` | Rendered only when invalid; Bootstrap's `.invalid-feedback` is `display: none` by default via sibling selector — use `display: block` unconditionally since React Aria controls render presence |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Size | None | `.form-select-sm` / `.form-select-lg` | Bootstrap | Applied via token overrides on the trigger. M015: Bootstrap's size variants are authoritative. M016 D1: Expose as explicit `size` prop? |
| Validation: invalid | `isInvalid` prop → `[data-invalid]` on root | `.is-invalid` on `.form-select` | Bootstrap (visual) | Bridge required: `[data-invalid]` compound selector |
| Validation: valid | No direct `[data-valid]` on Select root (Select only exposes `[data-invalid]`, `[data-required]`) | `.is-valid` on `.form-select` | Bootstrap (visual) | Out of scope for trigger; `FieldError` only renders on invalid |
| Required | `isRequired` → `[data-required]` on root | No Bootstrap visual equivalent | React Aria | No Bootstrap modifier; no visual change needed |
| Disabled | `isDisabled` → `[data-disabled]` on root | `.disabled` + `:disabled` on `.form-select` | Bootstrap (visual) | Bridge: trigger `[data-disabled]` → form-select disabled appearance |
| Open state | `[data-open]` on root | `.show` on `.dropdown-menu` | Bootstrap (visual) | Bridge: show popover when in DOM + caret rotation via `.faux-open` |
| Selection mode | `selectionMode="single|multiple"` | None | React Aria | No Bootstrap modifier class equivalent; custom CSS required |

### State mappings

#### Trigger Button (`.react-aria-Button`)

| `data-*` attribute | Bootstrap equivalent | Bridge strategy | Notes |
|--------------------|---------------------|-----------------|-------|
| `[data-hovered]` | `.btn:hover` | Strategy 1: CSS pseudo-class overlap — `:hover` fires on `<button>` | No bridge needed |
| `[data-pressed]` | `.btn:active` | Strategy 1: `:active` fires on `<button>` for momentary press | No bridge needed for momentary press |
| `[data-focused]` | N/A | Strategy 1: not used directly — Bootstrap does not style `:focus` on `.btn` separately | No bridge needed |
| `[data-focus-visible]` | `.btn:focus-visible` → `box-shadow` | Strategy 1: `:focus-visible` fires on `<button>` natively | No bridge needed; Bootstrap sets `box-shadow` via `:focus-visible` |
| `[data-disabled]` | `.form-select:disabled` | Strategy 2: compound selector | `.btn` with `disabled` HTML attr fires `:disabled` natively for opacity, but `.form-select` visual tokens need explicit bridge. P-012: override CSS variables at element level. |

**Pseudo-class audit — Trigger Button:**

| Pseudo-class | Status | Reason |
|---|---|---|
| `:hover` | ACTIVE | Fires on native `<button>` element |
| `:focus-visible` | ACTIVE | Fires on native `<button>` element; Bootstrap uses for focus ring box-shadow |
| `:focus` | ACTIVE (but Bootstrap uses `:focus-visible`) | Fires, but Bootstrap's `.btn` focus styles use `:focus-visible` |
| `:active` | ACTIVE | Fires on native `<button>` for momentary press |
| `:disabled` | ACTIVE | React Aria sets `disabled` HTML attribute on `<button>` when `isDisabled` |
| `.active` | INERT | React Aria never adds `.active` class |
| `.disabled` | INERT | React Aria never adds `.disabled` class |
| `.show` | INERT | React Aria never adds `.show` class |

#### Select Root (`.react-aria-Select`)

| `data-*` attribute | Bootstrap equivalent | Bridge strategy | Notes |
|--------------------|---------------------|-----------------|-------|
| `[data-focused]` | N/A | No bridge — styling applied to trigger button directly | Root is a `<div>` wrapper; focus visual is on the trigger |
| `[data-focus-visible]` | N/A | No bridge needed at root | Focus ring is on the trigger button |
| `[data-disabled]` | N/A (see trigger) | No separate root bridge needed | Trigger button handles visual disabled state |
| `[data-open]` | `.dropdown-menu.show` | Strategy 2: caret rotation via `.faux-open` in reference CSS | Popover in DOM = open; no `.show` class needed |
| `[data-invalid]` | `.form-select.is-invalid` | Strategy 2: compound selector on trigger | Bridge: `.react-aria-Select[data-invalid] .react-aria-Button` → form-invalid-border-color + feedback icon |
| `[data-required]` | None | No Bootstrap visual equivalent | No bridge needed |

**Pseudo-class audit — Root `<div>`:**

| Pseudo-class | Status | Reason |
|---|---|---|
| `:hover` | INERT | Root is a non-interactive `<div>`; hover styles target the trigger |
| `:focus-visible` | INERT | Root `<div>` does not receive focus |
| `:disabled` | INERT | `<div>` is not a form element; `:disabled` never fires |
| `.disabled` | INERT | React Aria never adds `.disabled` |
| `.show` | INERT | React Aria never adds `.show` |
| `.is-invalid` | INERT | React Aria never adds `.is-invalid` |

#### ListBoxItem (`.react-aria-ListBoxItem`)

| `data-*` attribute | Bootstrap equivalent | Bridge strategy | Notes |
|--------------------|---------------------|-----------------|-------|
| `[data-hovered]` | `.dropdown-item:hover` | Strategy 1: `:hover` fires on `<div>` | Fires natively |
| `[data-pressed]` | `.dropdown-item:active` | Strategy 1: `:active` fires on `<div>` | Fires natively |
| `[data-focused]` | `.dropdown-item:focus` | Strategy 1: `:focus` fires when item is keyboard-navigated | Fires natively |
| `[data-focus-visible]` | `.dropdown-item:focus` | Strategy 1: `:focus-visible` fires for keyboard focus | No separate Bootstrap focus-visible style for `.dropdown-item`; UA outline active |
| `[data-selected]` | `.dropdown-item.active` | Strategy 2: compound selector | React Aria never adds `.active`; bridge required |
| `[data-disabled]` | `.dropdown-item.disabled` / `.dropdown-item:disabled` | Strategy 2: compound selector | React Aria renders `<div>` — `:disabled` never fires; `[data-disabled]` bridge required |
| `[data-selection-mode]` | None | No Bootstrap equivalent | Informational only |

**Pseudo-class audit — ListBoxItem `<div>`:**

| Pseudo-class | Status | Reason |
|---|---|---|
| `:hover` | ACTIVE | Fires on `<div>` element (M018 substitution: Bootstrap expects `<a>`/`<button>` but `:hover` fires on any element) |
| `:focus` | ACTIVE | Fires on focusable `<div>` during keyboard navigation |
| `:focus-visible` | ACTIVE | Fires on `<div>` for keyboard focus; Bootstrap does not suppress outline on `.dropdown-item` |
| `:active` | ACTIVE | Fires on `<div>` for momentary press |
| `.active` | INERT | React Aria never adds `.active` |
| `.disabled` | INERT | React Aria never adds `.disabled` |
| `:disabled` | INERT | `<div>` is not a form element; `:disabled` never fires |

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|-------------------|-------------------|------------|
| Trigger | CRITICAL | `<select class="form-select">` | `<button class="react-aria-Button">` | M014: Use `.btn.dropdown-toggle` as structural counterpart; overlay `.form-select` tokens for visual appearance (P-012) |
| Popover | CRITICAL | `.dropdown-menu.show` + Popper.js `[data-bs-popper]` positioning | `.react-aria-Popover` rendered only when open; no `[data-bs-popper]` | Bridge: set `display: block` on popover always (it's only mounted when open); implement independent positioning. Popper.js rules won't fire. |
| ListBoxItem | MINOR | `<a>` or `<button class="dropdown-item">` | `<div class="react-aria-ListBoxItem">` | M018: `:hover`, `:focus`, `:active` fire on `<div>` fine. No selector type conflict since Bootstrap's `.dropdown-item` selectors use class, not tag. |
| `.dropdown-toggle::after` caret | MINOR | CSS `::after` pseudo-element generates caret | React Aria renders an SVG icon element | Reference story uses inline SVG; `::after` caret will not render since `.dropdown-toggle::after` requires the pseudo. Use SVG icon + CSS `transform: rotate(180deg)` for open state (P-018). |
| FieldError | MINOR | `.invalid-feedback` with `display: none → block` via sibling combinator | `<FieldError>` conditionally rendered by React Aria | Bridge: use `display: block` unconditionally on `.invalid-feedback` when applied to FieldError; React Aria controls render presence. |
| Label | NONE | `<label class="form-label">` | `<label class="react-aria-Label">` | Renders same `<label>` element; Bootstrap `.form-label` applies cleanly |

### Reference story canvas

**Stories to write:**

1. **TriggerStates** — Bootstrap trigger reference: form-select styled trigger button in all interactive states (Default, Hover, Focus, Open/Active, Disabled, Invalid). Shows the full `.btn.dropdown-toggle` + `.form-select` visual counterpart surface.

2. **DropdownMenu** — Bootstrap dropdown-menu reference: popover panel open state with `.dropdown-item` states (Default, Hover, Focus, Active/Selected, Disabled). Separate story to isolate the menu surface.

3. **FormField** — Full field layout: Label + Trigger + Description + FieldError (valid and invalid). Mirrors Bootstrap's `.form-label` + `.form-select` + `.form-text` + `.invalid-feedback` stacked form field.

**Layout notes:**
- Trigger specimens: `width: 200px` minimum (matches Bootstrap form-select width convention)
- Dropdown menu specimens: show menu panel statically (not absolutely positioned) — reference stories are static visual targets
- Use `.specimen-row` flex-wrap container per P-004
- Open state must show a selected value in the trigger per P-005
- Caret rotation for open state via `.faux-open` class per P-018

### Confidence

**Medium** — The structural mapping (button + dropdown pattern) is well-established in `patterns.md`. Key uncertainties:
- Exact CSS variable set needed on trigger to produce `.form-select` visual from a `.btn` base (P-012 variable enumeration needed)
- Caret handling: reference story uses Bootstrap's CSS `::after` caret (D2 resolved); `.dropdown-toggle::after` will render on the `<button>` element
- ListBoxItem `:focus` styling: Bootstrap's `.dropdown-item:focus` uses `:hover`-identical tokens; UA focus ring distinguishes them (P-014/P-015)

## Decisions

### D1 — Size modifier exposure as prop vs. className passthrough
**Question:** Bootstrap's `.form-select-sm` and `.form-select-lg` size modifiers have no React Aria prop equivalent. Should these be exposed as an explicit `size` prop (e.g. `size="sm"`, `size="lg"`), left as a `className` passthrough, or omitted from scope?
**Answer:** Explicit size prop: `size="sm" | "lg"`, matching Button.

### D2 — Caret: `.form-select` background-image SVG vs. `.dropdown-toggle` `::after` border-trick vs. rendered SVG icon
**Question:** Bootstrap's `.dropdown-toggle::after` generates the caret via CSS pseudo-element. React Aria's Select renders a `<ChevronDown>` SVG inside the Button. Should the reference story use the Bootstrap CSS-generated caret (which means styling `.dropdown-toggle::after` on a real `<button>`), or should it use an inline SVG icon (matching React Aria's actual rendered output) styled with CSS transform for open state? The two approaches produce different reference targets for the implementation phase.
**Answer (revised after visual review):** Use the `.form-select` background-image SVG chevron — `--bs-form-select-bg-img` set on the trigger button, positioned at `right 0.75rem center`. The trigger does NOT carry `.dropdown-toggle`. Open state swaps the variable to an up-pointing chevron SVG (path `m2 11 6-6 6 6`). This produces a trigger that looks exactly like `.form-select`, which is the correct visual target.
