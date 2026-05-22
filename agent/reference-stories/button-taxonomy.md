---
title: Button Taxonomy
component: Button
iteration: 0
---

## Button

**React Aria root class:** `.react-aria-Button`
**Mapping type:** 1:1 — Bootstrap Button (`.btn`)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Button` | Button | `.btn` + `.btn-{variant}` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Color | (no prop) | `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-light`, `.btn-dark` | Bootstrap | React Aria's `variant` prop (primary/secondary/quiet/destructive) is out of scope per M015 |
| Outline color | (no prop) | `.btn-outline-{variant}` (same 8 values) | Bootstrap | Design choice: expose as a separate variant dimension or a modifier flag |
| Link style | (no prop) | `.btn-link` | Bootstrap | Button styled as hyperlink |
| Size | (no prop) | `.btn-sm`, `.btn-lg` | Bootstrap | Default size has no modifier class |

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Root | `.btn:hover` | No bridge needed — `:hover` pseudo-class fires on the `<button>` element independently |
| Pressed | `[data-pressed]` | Root | `.btn:active` | No bridge needed — `:active` pseudo fires on press |
| Focused | `[data-focused]` | Root | `.btn:focus` | No bridge needed — `:focus` pseudo fires on the `<button>` element |
| Focus visible | `[data-focus-visible]` | Root | `.btn:focus-visible` | No bridge needed — Bootstrap uses `:focus-visible` for the focus ring; fires independently |
| Disabled | `[data-disabled]` | Root | `.btn:disabled` | No bridge needed — React Aria sets `disabled` attribute on `<button>`; `:disabled` pseudo fires. `.btn.disabled` class is INERT (React Aria never adds it; `:disabled` already covers the case). |
| Pending | `[data-pending]` | Root | Spinner inside `.btn` | DOM element bridge (M010): render `<span class="spinner-border spinner-border-sm" aria-hidden="true">` as a child. No Bootstrap class covers pending state on the root element — pending is expressed by the spinner child, not a class on the button. |

**Pseudo-class audit:**
- `:hover` — ACTIVE (fires on React Aria `<button>`)
- `:focus-visible` — ACTIVE (fires on React Aria `<button>`)
- `:focus` — ACTIVE (fires on React Aria `<button>`)
- `:active` — ACTIVE (fires on React Aria `<button>`)
- `:disabled` — ACTIVE (React Aria sets `disabled` attribute on `<button>`)
- `.active` (JS class) — INERT (React Aria never adds; toggle button state is handled by ToggleButton, not Button)
- `.disabled` (class) — INERT (React Aria never adds; `:disabled` covers it)
- `.show` (open dropdown trigger) — INERT (dropdown-trigger role belongs to a different composition pattern, not bare Button)

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| Root | MINOR | `<button class="btn btn-primary">` | `<button class="react-aria-Button">` | No structural conflict — same element type. Add `.btn .btn-{variant}` to className. Bootstrap's class-based states (`.active`, `.disabled`) are INERT — no workaround needed; pseudo-classes cover all states. |

### Reference story canvas

- **Stories (sub-parts):** Root — one story per display category: Color variants (solid), Color variants (outline), Sizes, States
- **Grid columns:** 4 (color story: 8 buttons × 2 rows — solid and outline side-by-side; state story: 6 specimens × 1 row)
- **Width constraint:** ~1280px
- **Notes:** State story should show: default, hover (faux), focus-visible (faux), active/pressed (faux), disabled, pending. Each specimen labeled. Dark-background wrapper not needed — `.btn-dark` and `.btn-outline-light` have sufficient contrast on white. One story should show pending state with `.spinner-border-sm` inside a disabled-styled button.

### Confidence: High

