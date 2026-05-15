---
title: ListBox — Reference Story Taxonomy
status: approved
source: styling-skill-plus_0 debrief, session 2; revised reference-stories_0
---

# ListBox Reference Story Taxonomy

Covers all substantive sub-parts of the ListBox component. Each sub-part maps to one Storybook story under `Bootstrap Reference/ListBox/SubPartName`.

**General canvas rule:** All specimens must be visible in one viewport at ~1280px width. Use a CSS grid wrapper in the story canvas; column count noted per story.

---

## Story: Root

**Bootstrap class:** `.list-group`
**Canvas:** 4-column grid

Each specimen contains 5 items (1 selected) to demonstrate layout and border behavior in context.

- `orientation="vertical"`, `layout="stack"` — `.list-group` (default; standard Bootstrap list group)
- `orientation="horizontal"`, `layout="stack"` — `.list-group.list-group-horizontal` (Bootstrap class)
- `orientation="vertical"`, `layout="grid"` — `.list-group` + M017 custom CSS (no Bootstrap modifier)
- `orientation="horizontal"`, `layout="grid"` — `.list-group` + M017 custom CSS, row flow (no Bootstrap modifier)
- `[data-focus-visible]` on root — focus ring outline via `--bs-focus-ring-*` tokens; use `.faux-focus` class
- `[data-empty]` — empty state; no items (no Bootstrap counterpart; custom CSS)

---

## Story: ListBoxItem

**Bootstrap class:** `.list-group-item.list-group-item-action`
**Canvas:** 3-column grid

All specimens use default context (`orientation="vertical"`, `layout="stack"`) unless noted.

**selectionMode="single":**
- Default (unselected) — baseline appearance
- `[data-selected]` — `.list-group-item.active`; `--bs-list-group-active-*` tokens
- `[data-hovered]` — `.faux-hover`; `--bs-list-group-action-hover-*` tokens
- `[data-pressed]` — `.faux-active`; `--bs-list-group-action-active-*` tokens
- `[data-focused]` — `.faux-focus`; Bootstrap groups `:hover` and `:focus` with the same bg/color styles, but `:focus` additionally receives the user-agent outline — visually distinct from hover
- `[data-focus-visible]` — `.faux-focus-visible`; Bootstrap focus ring via `:focus-visible`
- `[data-disabled]` — `.list-group-item.disabled`; `--bs-list-group-disabled-*` tokens
- `[data-selected]` + `[data-focus-visible]` — notable combination: focus ring must remain visible over active background color

**selectionMode="multiple"** (states that differ visually from single-select only):
- Default (unselected) — `div.indicator` (Bootstrap Checkbox indicator, unchecked); visible at all times
- `[data-selected]` — `div.indicator` in checked state
- `[data-disabled]` — `div.indicator` in disabled state

*All other states visually identical to single-select; omitted.*

**selectionMode="none"** (action-only):
- Default — no indicator; no left indent
- `[data-hovered]` — `.faux-hover`; verify no ghost indent from absent indicator

**Text slot variants** (no separate story; additional specimens here):
- Label only — standard single-line item
- Label + description — two-line item; description uses muted text

**Out of scope:** `[data-dragging]`, `[data-drop-target]` — no Bootstrap counterpart; custom CSS only; excluded from Bootstrap reference story.

---

## Story: Section + Header

**Bootstrap class:** Header → `.dropdown-header`; Section → no Bootstrap class
**Canvas:** 2-column grid

- Single section with header, 3 items — shows header styling and visual separation from items
- Two sections with headers, no selected items — shows inter-section separation
- Two sections with headers, 1 item selected in each — verifies active-state border behavior within sections

---

## Story: SelectionIndicator

**Bootstrap class:** `div.indicator` (Bootstrap Checkbox indicator pattern)
**Canvas:** 1×2 grid

Multi-select only. Single-select has no indicator — selection is communicated solely by Bootstrap's `.active` styling (background + text color change).

- `selectionMode="multiple"`, unselected — `div.indicator` in unchecked state (Bootstrap Checkbox indicator)
- `selectionMode="multiple"`, `[data-selected]` — `div.indicator` in checked state

---

## Story: ListBoxLoadMoreItem

**Bootstrap class:** `.spinner-border.spinner-border-sm` (M010)
**Canvas:** 1 column

- Loading — spinner rendered at end of a 3-item list; demonstrates position and size in context
