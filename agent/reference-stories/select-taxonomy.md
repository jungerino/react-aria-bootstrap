---
title: Select Taxonomy
component: Select
iteration: 0
---

## Select

**React Aria root class:** `.react-aria-Select`
**Mapping type:** Composite — Label → `.form-label`; Button (trigger) → `.btn.dropdown-toggle` (structural) + `.form-select` (visual tokens, per M014); Popover → `.dropdown-menu`; ListBoxItem → `.dropdown-item`; Description → `.form-text`; FieldError → `.invalid-feedback`

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root (field wrapper) | `.react-aria-Select` | Form field wrapper | `<div>` wrapper; no specific Bootstrap class (add `mb-3` or similar layout utility) |
| Label | `.react-aria-Label` | Form label | `.form-label` |
| Button (trigger) | `.react-aria-Select .react-aria-Button` | Dropdown toggle (structural) + Form select (visual) | `.btn.dropdown-toggle` + `.form-select` token overrides (M014) |
| SelectValue | `.react-aria-SelectValue` | (text content inside trigger) | No Bootstrap class — inherits trigger styling |
| Description | `[slot="description"]` / `.react-aria-Text` | Form text | `.form-text` |
| FieldError | `.react-aria-FieldError` | Invalid feedback | `.invalid-feedback` |
| Popover (dropdown) | `.react-aria-Popover` | Dropdown menu | `.dropdown-menu` |
| ListBoxItem (option) | `.react-aria-ListBoxItem` inside Popover | Dropdown item | `.dropdown-item` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Size | (no prop) | `.form-select-sm`, `.form-select-lg` (token-based size change on trigger) | Bootstrap | Size modifier changes padding, font-size, border-radius tokens |
| Validation state — invalid | `isInvalid` / `[data-invalid]` | `.is-invalid` on `.form-select` | Both | React Aria sets `[data-invalid]` on root; Bridge applies `.is-invalid` visual to trigger button |
| Validation state — valid | (no `isValid` prop — React Aria uses constraint validation) | `.is-valid` on `.form-select` | Bootstrap | Only available if explicitly wiring Bootstrap's valid state |
| Disabled | `isDisabled` | `.form-select:disabled` (native) | React Aria | React Aria renders a `<button>` — `:disabled` does not fire unless the button has `disabled` attr; compound selector bridge needed |
| Required | `isRequired` | (no Bootstrap visual modifier) | React Aria | Required state is ARIA-only in this mapping |
| Placeholder | `placeholder` prop → `[data-placeholder]` on SelectValue | `.form-select` always shows one option | Bootstrap | React Aria renders placeholder text; style via `[data-placeholder]` selector |
| Selection mode | `selectionMode="single|multiple"` | (native `<select multiple>`) | React Aria | `.form-select` does not apply to React Aria's structure; multiple mode is an internal behavior difference |
| Dark mode | (no prop) | `data-bs-theme="dark"` on ancestor | Bootstrap | Bootstrap CSS variable overrides apply automatically |

### State mappings

**Select root (`.react-aria-Select`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part affected | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|-------------------|----------------------|-----------------|
| Open | `[data-open]` | Root | `.dropdown.show` on trigger container | Compound selector: `.react-aria-Select[data-open] .react-aria-Button` → apply `.show` dropdown-toggle visual (caret direction); popover is in DOM only when open, so no `display` bridge needed |
| Focused | `[data-focused]` | Root | `.form-select:focus` | INERT on root `<div>`; focus is on the Button child — `:focus` fires on the `<button>` directly |
| Focus visible | `[data-focus-visible]` | Root | `.form-select:focus-visible` | INERT on root `<div>`; `:focus-visible` fires on Button directly |
| Disabled | `[data-disabled]` | Root + all sub-parts | `.form-select:disabled` | Compound selector bridge: `.react-aria-Select[data-disabled] .react-aria-Button` → apply disabled token values (`--bs-form-select-disabled-color`, `--bs-form-select-disabled-bg`, `--bs-form-select-disabled-border-color`) + `pointer-events: none`. `:disabled` INERT on `<div>` root. |
| Invalid | `[data-invalid]` | Root + trigger | `.form-select.is-invalid` | Compound selector bridge: `.react-aria-Select[data-invalid] .react-aria-Button` → apply `--bs-form-invalid-border-color` border + invalid bg-icon. `.is-invalid` class INERT (React Aria never adds). |
| Required | `[data-required]` | Root | (no Bootstrap visual) | No visual bridge needed; ARIA attributes handle this |

**Button (trigger) data-* attributes:**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Button | `.form-select:hover` | No bridge needed — `:hover` fires on the `<button>` |
| Pressed | `[data-pressed]` | Button | `.form-select:active` | No bridge needed — `:active` fires on the `<button>` |
| Focused | `[data-focused]` | Button | `.form-select:focus` | No bridge needed — `:focus` fires on the `<button>` |
| Focus visible | `[data-focus-visible]` | Button | `.form-select:focus-visible` | No bridge needed — `:focus-visible` fires on the `<button>` |

**SelectValue data-* attributes:**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Placeholder showing | `[data-placeholder]` | SelectValue | `.form-select` default option text (placeholder) | Compound selector: `.react-aria-SelectValue[data-placeholder]` → apply muted color (Bootstrap's form-select placeholder color is the same as text; React Aria allows distinct styling here) |

**Pseudo-class audit (on `.react-aria-Button` trigger):**
- `:hover` — ACTIVE (fires on `<button>`)
- `:focus` — ACTIVE (fires on `<button>`)
- `:focus-visible` — ACTIVE (fires on `<button>`)
- `:active` — ACTIVE (fires on `<button>`)
- `:disabled` — INERT by default: React Aria's Select renders a `<button>` but does not set the `disabled` attribute on it (the button remains focusable when the Select is disabled per React Aria behavior); compound selector bridge on `[data-disabled]` is required
- `.is-invalid` (class) — INERT (React Aria never adds)
- `.form-select:disabled` (on `<select>`) — CRITICAL INERT: Select renders `<button>`, not `<select>`; this selector cannot fire

**Popover / dropdown-menu:**
- `.dropdown-menu` styles apply when the Popover is in the DOM (React Aria renders the Popover only when open). No `.show` class bridge is needed — the element's DOM presence controls visibility.
- `[data-bs-popper]` — INERT: React Aria positions the Popover via its own system; Bootstrap's Popper.js positioning selectors (`[data-bs-popper]`) never fire. Position the Popover with explicit `position: absolute` rules, not Bootstrap's Popper.js positioning styles.

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| Trigger button | CRITICAL | `<select class="form-select">` | `<button class="react-aria-Button">` | Apply `.btn.dropdown-toggle` for structural behavior; apply `.form-select` token overrides (`--bs-form-select-*`) for visual fidelity. `.form-select` class cannot be applied to `<button>` directly — use override variables (M014). |
| Dropdown menu positioning | MAJOR | `.dropdown-menu[data-bs-popper]` receives `position`, `inset`, `margin` | Popover uses its own positioning | Set positioning styles on `.react-aria-Popover` independently; do not rely on `[data-bs-popper]` rules. |
| Disabled trigger | MINOR | `<select:disabled>` or `.form-select:disabled` | `<button>` without `disabled` attribute (Select keeps button focusable) | Compound selector bridge required: `.react-aria-Select[data-disabled] .react-aria-Button` applies disabled tokens without relying on `:disabled` pseudo. |
| Label ordering | MINOR | `<label>` for `<select>` (standard flow) | `<label>` for `<button>` (trigger) | `for` attribute on label should reference the button's `id`; React Aria wires this via ARIA. No visual conflict. |
| FieldError visibility | MINOR | `.invalid-feedback` shown via `.is-invalid ~ .invalid-feedback` sibling selector | React Aria renders FieldError always (visibility controlled by `[data-invalid]` on root) | FieldError is always in the DOM; style it visible when `.react-aria-Select[data-invalid]`. `.is-invalid ~ .invalid-feedback` selector INERT — bridge required. |

### Reference story canvas

- **Stories (sub-parts):** Trigger button (closed, open, placeholder, with value), Validation states (valid, invalid), Dropdown menu + options, Size variants, Disabled state
- **Grid columns:** 3 (trigger states, validation, open dropdown shown with positioned popover)
- **Width constraint:** ~1280px; the open-dropdown specimen may need extra height to show the menu below the trigger
- **Notes:** The open dropdown cannot be shown statically via HTML class alone (menu visibility is DOM-presence-based). Reference story should use static HTML `.dropdown-menu` without the `.d-none` / `display: none` override, with a faux open state. Trigger button specimens should show the `.form-select`-styled button with Bootstrap tokens applied. One story should show Label + Trigger + Description + FieldError as a complete field specimen to show the full form field layout.

### Confidence: Medium

*Core trigger/popover/item mapping is clear per patterns.md 2.2. The dual-counterpart trigger strategy (M014) is well-documented. Medium confidence because the Popover positioning interaction with Bootstrap's `.dropdown-menu` positioning model requires implementation testing to confirm — particularly whether React Aria's inline positioning styles will conflict with Bootstrap's class-based positioning approach.*

## Decisions

**Trigger button styling strategy (M014):** Remove `.btn` from the trigger entirely and use `.form-select` class alone, relying on direct selector bridges for all states. Full state CSS written from scratch without inheriting `.btn` token behavior.

**FieldError visibility:** Let React Aria control rendering — FieldError only renders when invalid. No always-present hidden element.

**Popover positioning:** Use React Aria's placement props to position the popover below the trigger, matching Bootstrap's default dropdown placement.

**Validation state — valid:** Skip entirely. Out of scope for this mapping.
