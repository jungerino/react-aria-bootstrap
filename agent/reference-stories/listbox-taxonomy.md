---
title: ListBox — Reference Story Taxonomy (draft)
status: draft
source: styling-skill-plus_0 debrief, session 2
---

# ListBox Reference Story Taxonomy

Draft taxonomy for the `reference-stories` experiment. Covers all substantive sub-parts
of the ListBox component. Each sub-part maps to one Storybook story under
`Bootstrap Reference/ListBox/SubPartName`.

**General canvas rule:** All specimens must be visible in one viewport at ~1280px width.
Use a CSS grid wrapper in the story canvas; column count noted per story.

---

## Story: Root

**Bootstrap class:** `.list-group`
**Canvas:** 4-column grid

Each specimen contains 5 items (1 selected) to demonstrate layout and border behavior in context.

- `orientation="vertical"`, `layout="stack"` — `.list-group` (default; standard Bootstrap list group)
- `orientation="horizontal"`, `layout="stack"` — `.list-group.list-group-horizontal` (Bootstrap class)
- `orientation="vertical"`, `layout="grid"` — `.list-group` + M017 custom CSS (no Bootstrap modifier)
- `orientation="horizontal"`, `layout="grid"` — `.list-group` + M017 custom CSS, row flow (no Bootstrap modifier)
- `[data-focus-visible]` on root — focus ring outline via `--bs-focus-ring-*` tokens
- `[data-empty]` — empty state; no items (no Bootstrap counterpart; custom CSS)

---

## Story: ListBoxItem

**Bootstrap class:** `.list-group-item.list-group-item-action`
**Canvas:** 3-column grid

All specimens use default context (`orientation="vertical"`, `layout="stack"`) unless noted.

**selectionMode="single":**
- Default (unselected) — baseline appearance
- `[data-selected]` — `.list-group-item.active`; `--bs-list-group-active-*` tokens
- `[data-hovered]` — `:hover` pseudo; `--bs-list-group-action-hover-*` tokens
- `[data-pressed]` — `:active` pseudo; `--bs-list-group-action-active-*` tokens
- `[data-focused]` — `:focus` pseudo; Bootstrap has no distinct `:focus` style on `.list-group-item-action` separate from hover (note: virtual focus may mean `:focus` does not fire on items — see caveats)
- `[data-focus-visible]` — `:focus-visible`; Bootstrap focus ring (note: virtual focus may require compound selector rather than CSS pseudo-class overlap)
- `[data-disabled]` — `.list-group-item.disabled`; `--bs-list-group-disabled-*` tokens
- `[data-selected]` + `[data-focus-visible]` — notable combination: focus ring must remain visible over active background color

**selectionMode="multiple"** (states that differ visually from single-select only):
- Default (unselected) — `div.indicator` Checkbox unchecked and visible; differs from single-select which has a hidden check icon
- `[data-selected]` — `div.indicator` Checkbox checked via `[data-selected]` bridge
- `[data-disabled]` — Checkbox indicator in disabled state

*All other states visually identical to single-select; omitted.*

**selectionMode="none"** (action-only):
- Default — no SelectionIndicator; no left indent; pure action item
- `[data-hovered]` — verify no ghost indent from absent indicator

**Text slot variants** (no separate story; additional specimens here):
- Label only — standard single-line item
- Label + description — two-line item; description uses muted text

**Out of scope:** `[data-dragging]`, `[data-drop-target]` — no Bootstrap counterpart; custom CSS only; excluded from Bootstrap reference story.

---

## Story: Section + Header

**Bootstrap class:** Header → `.dropdown-header` (custom); Section → no Bootstrap class
**Canvas:** 2-column grid

- Single section with header, 3 items — shows header styling and visual separation from items
- Two sections with headers, no selected items — shows inter-section separation
- Two sections with headers, 1 item selected in each — verifies active-state border behavior within sections; exercises adjacent-selected separator rule (P037)

---

## Story: SelectionIndicator

**Bootstrap class:** single-select → `<i class="bi bi-check">` (M013); multi-select → `div.indicator` (Checkbox pattern)
**Canvas:** 2×2 grid

- `selectionMode="single"`, unselected — check icon present, `visibility: hidden`; 1rem space reserved
- `selectionMode="single"`, `[data-selected]` — check icon visible
- `selectionMode="multiple"`, unselected — `div.indicator` in unchecked state, visible
- `selectionMode="multiple"`, `[data-selected]` — `div.indicator` in checked state via `[data-selected]` bridge

---

## Story: ListBoxLoadMoreItem

**Bootstrap class:** `.spinner-border.spinner-border-sm` (M010)
**Canvas:** 1 column

- Loading — spinner rendered at end of a 3-item list; demonstrates position and size in context

---

## Caveats

1. **Virtual focus** — React Aria ListBox uses roving tabindex. DOM focus stays on the root,
   not individual items. `:focus` and `:focus-visible` pseudo-classes may not fire on items
   naturally. The reference story shows the intended visual; the implementation will likely
   need compound selectors (`[data-focused]`, `[data-focus-visible]`) rather than relying on
   CSS pseudo-class overlap. Needs verification against the installed React Aria version.

2. **`[data-focused]` vs `[data-focus-visible]`** — may be visually identical in Bootstrap's
   model for list items (Bootstrap has no distinct `:focus` hover treatment on
   `.list-group-item-action`). If confirmed identical in a browser, merge into one specimen
   with a note.

3. **selectionMode access** — `selectionMode` is not in `ListBoxItemRenderProps`. Conditional
   indicator rendering (check icon vs. `div.indicator`) requires a solution: either a prop
   passed down from the ListBox root, or reading from React Aria context. This is an open
   implementation question for the styling iteration, not for the reference story itself.

4. **selectionMode="none" indent** — the iteration-0 review flagged a ~1rem invisible left
   indent in action-only lists caused by the always-rendered (visibility:hidden) check icon.
   The `selectionMode="none"` specimens in this story make the correct treatment explicit:
   no indicator, no indent.
