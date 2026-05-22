---
title: Calendar Taxonomy
component: Calendar
iteration: 0
---

## Calendar

**React Aria root class:** `.react-aria-Calendar`
**Mapping type:** Composite — [NO DIRECT COUNTERPART] for Calendar as a whole; sub-parts mapped to Bootstrap primitives individually

**M006 flags:**
- No Bootstrap calendar component exists in Bootstrap 5.3.8
- Closest structural pattern: `.btn` for date cells; `.table` (or no class) for the grid `<table>`; utility classes for layout
- Closest visual pattern: a collection of `.btn.btn-sm` circular elements inside a custom container; selected date → `.btn.btn-primary` tokens; today → `.btn.btn-outline-primary` or custom ring
- Alternatives considered: Bootstrap does not include a Datepicker — this is an external-library concern (e.g., `bootstrap-datepicker`). Those are not part of Bootstrap 5.3.8's component system and are out of scope.

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Calendar` | [NO DIRECT COUNTERPART] | Custom wrapper; closest: no Bootstrap class. Apply width constraint and font-family via utilities. |
| Header (nav bar) | `.react-aria-Calendar header` (native `<header>`) | [NO DIRECT COUNTERPART] | Closest structural: use Bootstrap flex utilities (`d-flex align-items-center`) on the `<header>` element |
| Previous button | Button slot="previous" inside Calendar | Button | `.btn.btn-outline-secondary.btn-sm` or `.btn.btn-light.btn-sm` |
| Next button | Button slot="next" inside Calendar | Button | `.btn.btn-outline-secondary.btn-sm` or `.btn.btn-light.btn-sm` |
| Heading (month/year title) | `.react-aria-Heading` | [NO DIRECT COUNTERPART] | Closest: Bootstrap typography — `fw-semibold` + `text-center` utilities; no specific heading class |
| CalendarGrid | `.react-aria-CalendarGrid` (renders as `<table>`) | Table (minimal) | `.table.table-borderless` (border-collapse fix) or no Bootstrap table class (custom CSS controls spacing) |
| CalendarGridHeader | `.react-aria-CalendarGridHeader` (renders as `<thead>`) | (standard table structure) | No Bootstrap class; `<thead>` with `<th>` elements |
| CalendarHeaderCell | `.react-aria-CalendarHeaderCell` (renders as `<th>`) | [NO DIRECT COUNTERPART] | Closest: small muted text — `text-muted` + `text-center` utilities |
| CalendarGridBody | `.react-aria-CalendarGridBody` (renders as `<tbody>`) | (standard table structure) | No Bootstrap class |
| CalendarCell (date button) | `.react-aria-CalendarCell` (renders as `<td>` styled as circular button) | Button (closest structural match for the interactive date circle) | `.btn.btn-sm` (sized and shaped as circular); NOT `.table td` Bootstrap styling |
| Error message | `[slot="errorMessage"]` | [NO DIRECT COUNTERPART] | Closest: `.text-danger` utility text |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Disabled (whole calendar) | `isDisabled` | `.btn:disabled` (on each cell) | React Aria | Applies `[data-disabled]` to root; all cells become non-interactive |
| Invalid selection | `isInvalid` | [NO DIRECT COUNTERPART] | Custom CSS | React Aria sets `[data-invalid]` on root and on cells in invalid range; closest Bootstrap: `--bs-danger-*` tokens |
| Read-only | `isReadOnly` | (no Bootstrap equivalent) | React Aria | Cells are focused but not interactive |
| Visible months | `visibleDuration` prop | [NO DIRECT COUNTERPART] | React Aria | Multiple CalendarGrid elements side by side; layout is custom |
| First day of week | `firstDayOfWeek` | [NO DIRECT COUNTERPART] | React Aria | Locale or prop-driven; no Bootstrap modifier |

### State mappings

**Calendar root (`[data-*]` on `.react-aria-Calendar`):**

| React Aria state | data-* attribute | Sub-part affected | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|-------------------|----------------------|-----------------|
| Disabled | `[data-disabled]` | Root | (no Bootstrap calendar equivalent) | Compound selector on root to apply opacity or pointer-events to all children |
| Invalid | `[data-invalid]` | Root | (no Bootstrap calendar equivalent) | Compound selector on root to apply danger color token to relevant sub-parts |
| Read-only | `[data-read-only]` | Root | (no Bootstrap equivalent) | Custom CSS |

**CalendarCell (`.react-aria-CalendarCell`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | CalendarCell | `.btn:hover` | No bridge needed — `:hover` fires on the `<td>` element |
| Pressed | `[data-pressed]` | CalendarCell | `.btn:active` | No bridge needed — `:active` fires on the `<td>` element |
| Focused | `[data-focused]` | CalendarCell | `.btn:focus` | No bridge needed — `:focus` fires on the `<td>` element |
| Focus visible | `[data-focus-visible]` | CalendarCell | `.btn:focus-visible` | No bridge needed — `:focus-visible` fires on the `<td>` element |
| Selected | `[data-selected]` | CalendarCell | `.btn.btn-primary` (tokens) | Compound selector bridge: `.react-aria-CalendarCell[data-selected]` → apply `--bs-btn-bg` (primary), `--bs-btn-color` (white) tokens. `.btn.btn-primary` class INERT (React Aria never adds). |
| Disabled | `[data-disabled]` | CalendarCell | `.btn:disabled` | Compound selector bridge: `.react-aria-CalendarCell[data-disabled]` → apply `--bs-btn-disabled-color`, `--bs-btn-disabled-opacity`. `:disabled` INERT (CalendarCell renders as `<td>`, not `<button>`). |
| Unavailable | `[data-unavailable]` | CalendarCell | [NO DIRECT COUNTERPART] | Custom CSS: `text-decoration: line-through` + danger color. Closest Bootstrap: `--bs-danger-text-emphasis` token for color. |
| Invalid | `[data-invalid]` | CalendarCell | [NO DIRECT COUNTERPART] | Custom CSS: closest Bootstrap → `--bs-form-invalid-color` / `--bs-danger` token. Apply to background or border. |
| Outside month | `[data-outside-month]` | CalendarCell | [NO DIRECT COUNTERPART] | `display: none` — cells outside the current month are hidden. No Bootstrap class equivalent; custom CSS only. |
| Today | `[data-today]` | CalendarCell | [NO DIRECT COUNTERPART] | Custom CSS: closest Bootstrap → `.btn.btn-outline-primary` tokens to show a ring around today's date, or custom `box-shadow` using `--bs-focus-ring-*` tokens. This is a design choice — no Bootstrap class covers "today." |

**Pseudo-class audit (on `.react-aria-CalendarCell`):**
- `:hover` — ACTIVE (fires on `<td>` element)
- `:focus-visible` — ACTIVE (fires on `<td>` element)
- `:focus` — ACTIVE
- `:active` — ACTIVE (momentary press)
- `:disabled` — INERT (CalendarCell is a `<td>`, not a form control; `:disabled` does not fire)
- `.active`, `.disabled`, `.btn-*` classes — all INERT (React Aria never adds class-based state)

**Navigation buttons (prev/next — Bootstrap `.btn`):**
These sub-parts use Button, so they inherit Button's state mappings from the Button taxonomy. All pseudo-class states (`:hover`, `:focus-visible`, `:active`, `:disabled`) fire naturally on the `<button>` elements.

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| CalendarGrid | MINOR | Bootstrap's `.table` expects standard HTML table structure | React Aria renders `<table>` — structurally compatible | Apply `.table-borderless` or no table class; override `border-spacing: 0`. No selector conflicts because Bootstrap table does not have interactive cell styling. |
| CalendarCell | MAJOR | Bootstrap `.btn` expects `<button>` or `<a>` | React Aria renders `<td>` element (styled as circular button) | Cannot apply `.btn` class to `<td>` directly — Bootstrap table rules would conflict (padding, border reset). Use Bootstrap `.btn` token values (CSS custom properties) directly on `.react-aria-CalendarCell` via custom CSS, without adding the `.btn` class. |
| Today indicator | MINOR | No Bootstrap "today" class | `[data-today]` on the cell | Custom CSS required — use Bootstrap `--bs-primary` or ring tokens for visual indicator |

### Reference story canvas

- **Stories (sub-parts):** Full Calendar widget (with selected date), Full Calendar (today highlighted, no selection), Cell states grid (magnified specimens of each cell state), Disabled calendar, Invalid selection
- **Grid columns:** 3 — each story shows one calendar (single month, ~300–360px wide)
- **Width constraint:** ~1280px (3 calendars fit comfortably)
- **Notes:** Each "Full Calendar" story must show a complete calendar widget (header with nav buttons + day-of-week header row + date grid). The cell states story should show individual date cells in a small grid with labels (default, hover-faux, focus-faux, selected, today, disabled, unavailable, outside-month hidden). The calendar widget requires custom layout CSS in `augments.scss` for: container sizing, header flex layout, cell sizing (aspect-ratio based), circular border-radius on cells. This is the most CSS-intensive component in the iteration.

### Confidence: Medium

*Calendar has no Bootstrap counterpart. The CalendarCell-as-`.btn` analogy holds for token reuse but cannot use the `.btn` class directly due to table element conflicts. Overall approach is custom CSS using Bootstrap token values — the mapping is structurally sound but requires design decisions for cell shape, today indicator, and sizing that are not resolvable from Bootstrap's component system alone.*
