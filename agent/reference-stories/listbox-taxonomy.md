---
title: ListBox Taxonomy
component: ListBox
iteration: 0
---

## ListBox

**React Aria root class:** `.react-aria-ListBox`
**Mapping type:** 1:1 — Bootstrap List Group (`.list-group`)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root (container) | `.react-aria-ListBox` | List Group container | `.list-group` |
| Item | `.react-aria-ListBoxItem` | List Group item (interactive) | `.list-group-item.list-group-item-action` |
| Section | `.react-aria-ListBoxSection` | [NO DIRECT COUNTERPART] | — closest structural: non-interactive `.list-group-item` styled as a header; closest visual: `.list-group-item.list-group-item-secondary` or a sticky header pattern |
| Section header | `.react-aria-ListBoxSection > .react-aria-Header` | [NO DIRECT COUNTERPART] | Closest structural: `.list-group-item` with `fw-semibold` utility and `user-select: none`; closest visual: `.list-group-item.list-group-item-secondary` with bold text or a subdued background label; alternatives considered: Bootstrap's list-group has no built-in header pattern; card `.card-header` is close visually but changes the DOM container entirely. |
| Drop indicator | `.react-aria-DropIndicator` | [NO DIRECT COUNTERPART] | Closest structural: a thin `<div>` or `<hr>` element between items; closest visual: Bootstrap `border-primary` utility for a colored line; alternatives considered: Bootstrap border utilities can style a separator but have no drag-and-drop semantic; no Bootstrap component covers this pattern. Custom CSS required. |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Layout — stack (default) | `layout="stack"` | (default) | React Aria | No Bootstrap modifier needed; stack is the default list-group flow |
| Layout — grid | `layout="grid"` | [NO DIRECT COUNTERPART] | Custom CSS | Bootstrap has no grid list-group; CSS delta: `display: grid; gap: 0.5rem; grid-template-columns: repeat(N, 1fr)` (M017) |
| Orientation — vertical (default) | `orientation="vertical"` | `.list-group` | Bootstrap | Default orientation; no modifier class needed |
| Orientation — horizontal | `orientation="horizontal"` (with `layout="stack"`) | `.list-group-horizontal` | Bootstrap | `.list-group-horizontal-{breakpoint}` variants also available |
| Selection mode | `selectionMode="none|single|multiple"` | (no modifier) | React Aria | Bootstrap's `.active` class is the visual for any selection; no modifier class distinguishes single vs. multiple |
| Contextual item color | (no prop) | `.list-group-item-{variant}` (primary, secondary, success, danger, warning, info, light, dark) | Bootstrap | Per-item color variants; React Aria has no equivalent |
| Flush (no outer borders) | (no prop) | `.list-group-flush` | Bootstrap | Removes outer border and border-radius; design choice |
| Numbered list | (no prop) | `.list-group-numbered` | Bootstrap | Adds auto-incrementing counter via `::before`; structural — requires `<ol>` parent. React Aria renders `<div>`, not `<ol>`. INERT unless DOM is overridden. |

### State mappings

**ListBox root (`[data-*]` on `.react-aria-ListBox`):**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Focus visible | `[data-focus-visible]` | Root | (none — `.list-group` has no container focus style) | Compound selector bridge: `.react-aria-ListBox[data-focus-visible]` → apply `box-shadow: 0 0 0 var(--bs-focus-ring-width) var(--bs-focus-ring-color)` using Bootstrap focus ring tokens |
| Empty | `[data-empty]` | Root | [NO DIRECT COUNTERPART] | Custom CSS — `[data-empty]` shows empty-state content; no Bootstrap visual target |
| Drop target | `[data-drop-target]` | Root | [NO DIRECT COUNTERPART] | Custom CSS only |
| Layout | `[data-layout="stack|grid"]` | Root | See Variants table | Set by `layout` prop; not a user-toggled state |
| Orientation | `[data-orientation="vertical|horizontal"]` | Root | See Variants table | Set by `orientation` prop; not a user-toggled state |

**ListBox item (`[data-*]` on `.react-aria-ListBoxItem`):**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Item | `.list-group-item-action:hover` | No bridge needed — `:hover` pseudo fires on the rendered element independently |
| Pressed | `[data-pressed]` | Item | `.list-group-item-action:active` | No bridge needed — `:active` pseudo fires independently |
| Focused | `[data-focused]` | Item | `.list-group-item-action:focus` | No bridge needed — `:focus` fires on the rendered element |
| Focus visible | `[data-focus-visible]` | Item | `.list-group-item-action:focus-visible` | No bridge needed — `:focus-visible` fires on the rendered element |
| Selected | `[data-selected]` | Item | `.list-group-item.active` | Compound selector bridge: `.react-aria-ListBoxItem[data-selected]` → apply `--bs-list-group-active-bg`, `--bs-list-group-active-color`, `--bs-list-group-active-border-color`. Bootstrap's `.active` class is INERT. |
| Disabled | `[data-disabled]` | Item | `.list-group-item.disabled` | Compound selector bridge: `.react-aria-ListBoxItem[data-disabled]` → apply `--bs-list-group-disabled-color`, `--bs-list-group-disabled-bg`, `pointer-events: none`. Bootstrap's `.disabled` class is INERT (React Aria never adds it; renders `<div>`, not `<button>`, so `:disabled` does not fire). |
| Dragging | `[data-dragging]` | Item | [NO DIRECT COUNTERPART] | Custom CSS — Bootstrap has no drag-state visual for list-group items |
| Drop target (on item) | `[data-drop-target]` | Item | [NO DIRECT COUNTERPART] | Custom CSS only |

**Pseudo-class audit (on `.react-aria-ListBoxItem`):**
- `:hover` — ACTIVE (fires on React Aria's rendered `<div>` or `<a>`)
- `:focus` — ACTIVE
- `:focus-visible` — ACTIVE
- `:active` — ACTIVE (momentary press on `<div>` or `<a>`)
- `:disabled` — INERT (React Aria renders `<div>`; `:disabled` does not fire on non-form elements)
- `.active` (class) — INERT (React Aria never adds)
- `.disabled` (class) — INERT (React Aria never adds)

**Pseudo-class audit (on `.react-aria-ListBox` container):**
- `:focus` / `:focus-visible` — INERT in most usage (the container itself does not receive focus; keyboard focus goes to items). However, when the list is empty or first mounted with `autoFocus`, the container may receive focus — `:focus-visible` may fire in that case. Bridge still needed for `[data-focus-visible]` because that's what React Aria uses.

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| Root | MINOR | `<ul class="list-group">` or `<div class="list-group">` | `<div role="listbox" class="react-aria-ListBox">` | No structural conflict — Bootstrap's interactive list-group variant works with `<div>`. Add `.list-group` to the root element. |
| Item | MINOR | `<li>`, `<a>`, or `<button class="list-group-item list-group-item-action">` | `<div role="option" class="react-aria-ListBoxItem">` | Bootstrap's `.list-group-item-action` hover/focus selectors work on any element type. No conflict; add `.list-group-item.list-group-item-action` to the item. |
| Section | MAJOR | (no equivalent) | `<section class="react-aria-ListBoxSection">` | Bootstrap has no section grouping for list-group. Must render section using a non-interactive header item (custom styled `.list-group-item`) plus a nested group or visual separator. No Bootstrap structural pattern matches — custom CSS required. |
| `.list-group-numbered` | MAJOR | `<ol>` parent element | `<div>` | Bootstrap's `.list-group-numbered` counter is generated via `.list-group-numbered > .list-group-item::before` with CSS counters. React Aria renders a `<div>`, not `<ol>`. The counter will not increment correctly. This variant is effectively incompatible without DOM override. |

### Reference story canvas

- **Stories (sub-parts):** Root + Items (default vertical), Items — States, Items — Selected (single & multiple), Section grouping, Horizontal layout, Contextual item colors
- **Grid columns:** 3 (one column per major story group)
- **Width constraint:** ~1280px
- **Notes:** The selected state story should show both single-selected and multiple-selected specimens since the visual is the same Bootstrap `.active` treatment. Section grouping story needs a custom header style since Bootstrap has no equivalent. State story should include: default, hover (faux), focus-visible (faux), pressed (faux), selected, disabled.

### Confidence: High

*Section sub-part and numbered list group have no Bootstrap counterpart, but the core Root + Item mapping is unambiguous.*
