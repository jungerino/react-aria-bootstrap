---
title: Select — Reference Story Taxonomy
status: approved
source: reference-stories_0, iteration 0
---

# Select Reference Story Taxonomy

Select is a composite mapping — sub-parts map to different Bootstrap components. Each substantive sub-part gets its own story under `Bootstrap Reference/Select/SubPartName`.

**General canvas rule:** All specimens visible in one viewport at ~1280px. Use a CSS grid wrapper; column count noted per story.

---

## Sub-parts overview

| Sub-part | Bootstrap counterpart | Story |
|----------|----------------------|-------|
| Root | — (wrapper only) | No story |
| Label | `.form-label` | Form Support |
| Trigger button | `.btn.dropdown-toggle` + `.form-select` token overrides (M001 + M014) | Trigger |
| SelectValue | — (display only) | No story |
| Popover | `.dropdown-menu` | Popover |
| ListBox | — (no class) | No story |
| ListBoxItem | `.dropdown-item` | ListBoxItem |
| Description | `.form-text` | Form Support |
| FieldError | `.invalid-feedback` | Form Support |

---

## Story: Trigger

**Bootstrap class:** `.btn.dropdown-toggle` (structural) + `.form-select` visual token overrides
**Canvas:** 2-column grid

The trigger must visually match a native `.form-select`. Show the target appearance using Bootstrap's native form-select element.

**Group A — Native form-select states (1 column):**
- `.form-select` (default)
- `.form-select.is-valid`
- `.form-select.is-invalid`
- `.form-select:disabled` — use `disabled` attribute

Label: "Target appearance (native `.form-select`)".

**Group B — Sizes (1 column):**
- `.form-select.form-select-sm` — "Small"
- `.form-select` — "Default"
- `.form-select.form-select-lg` — "Large"

---

## Story: Popover

**Bootstrap class:** `.dropdown-menu`
**Canvas:** 2-column grid

Show the menu in its open state. Add `.show` directly in JSX — no JS required.

- Open, no selection — `.dropdown-menu.show` with 5 `.dropdown-item` entries, none active
- Open, one item selected — `.dropdown-menu.show` with one `.dropdown-item.active`
- Open, one item disabled — `.dropdown-menu.show` with one `.dropdown-item.disabled`
- Open, with divider — `.dropdown-menu.show` with a `.dropdown-divider` separating two groups

**Note:** `.dropdown-menu` is `display: none` by default; `.show` makes it visible. Popover will render inline in the document (no Popper.js positioning in reference stories).

---

## Story: ListBoxItem

**Bootstrap class:** `.dropdown-item`
**Canvas:** 2-column grid

Render items inside a `.dropdown-menu.show` wrapper for correct visual framing.

**selectionMode="single" (left column):**
- Default — `.dropdown-item`
- Hovered — `.faux-hover`
- Focused — `.faux-focus`
- Selected / active — `.dropdown-item.active`
- Disabled — `.dropdown-item.disabled`
- Selected + focused — `.dropdown-item.active.faux-focus`; verify focus ring is visible over active background

**selectionMode="multiple" (right column):**
- Default (unselected) — `.dropdown-item` with Bootstrap Checkbox indicator (`div.indicator`, unchecked)
- Selected — `.dropdown-item` with Bootstrap Checkbox indicator in checked state
- Disabled — `.dropdown-item.disabled` with Bootstrap Checkbox indicator in disabled state

---

## Story: Form Support

**Bootstrap classes:** `.form-label`, `.form-text`, `.invalid-feedback`
**Canvas:** 3-column grid

One specimen per sub-part, shown in isolation with representative text content.

- Label — `<label class="form-label">Country</label>`
- Description — `<div class="form-text">Choose your country of residence.</div>`
- FieldError — `<div class="invalid-feedback" style="display: block">Please select a country.</div>` (use `display: block` to force visibility; Bootstrap hides `.invalid-feedback` by default)

---

## Caveats

1. **Static open state** — Dropdown menus require Bootstrap JS to open. Reference stories use `.show` added directly to the class in JSX.

2. **Popover positioning** — `.dropdown-menu.show` renders inline in the document without Popper.js. Acceptable for specimen purposes.
