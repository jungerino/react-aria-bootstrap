---
title: Select Taxonomy
component: Select
iteration: 1
---

## Select

**React Aria root class:** `.react-aria-Select`
**Mapping type:** Composite — trigger → Form Select (`.form-select`), Popover/ListBox/ListBoxItem → Dropdown (`.dropdown-menu`/`.dropdown-item`), Label → Form Label, Description → Form Text, FieldError → Invalid Feedback, multi-select checkbox indicator → Form Check Input (visual only). Four distinct Bootstrap token namespaces feed one component.

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|---|---|---|---|
| Root wrapper | `.react-aria-Select` (`<div>`) | none — bare structural wrapper, no single Bootstrap element corresponds to it | — |
| Label | `.react-aria-Label` (optional, `<label>`) | Form Label | `.form-label` |
| Trigger button | `.react-aria-Button.button-base` (`<button>`) | **Dual counterpart (M014)** — structural: Dropdown toggle; semantic/visual: Form Select. `.form-select` chosen as the applied class (see Decision D1) | `.form-select`, `.form-select-sm` / `.form-select-lg` (size prop, Decision D3) |
| Selected-value text | `.react-aria-SelectValue` (`<span>`, child of Button) | no distinct Bootstrap element — native `<select>` has no wrapper around its displayed value | — (inherits `.form-select` text styling) |
| Chevron icon | `<ChevronDown>` (lucide-react `<svg class="lucide-chevron-down">`, child of Button) | Neither Bootstrap counterpart matches: Dropdown's caret is `::after` content, Form Select's arrow is a `background-image` — real child icon element is a third mechanism | `[NO DIRECT COUNTERPART]` — see DOM conflicts |
| Description | `.field-description` (`.react-aria-Text[slot=description]`, optional, `<div>`) | Form Text | `.form-text` |
| Validation message | `.react-aria-FieldError` (optional, `<span>`/`<div>`) | Invalid Feedback | `.invalid-feedback` |
| Popover (overlay chrome) | `.react-aria-Popover.select-popover[data-trigger=Select]` | Dropdown Menu — visual chrome only, not positioning (see DOM conflicts) | `.dropdown-menu` |
| ListBox (scroll container) | `.dropdown-listbox` (`.react-aria-ListBox`) | Dropdown Menu's inner list role — no dedicated Bootstrap class beyond scroll/overflow | — |
| ListBoxItem (option) | `.dropdown-item` (`.react-aria-ListBoxItem`) | Dropdown Item | `.dropdown-item` |
| Item label text | `.react-aria-Text[slot=label]` (child of item, only when item children is a string) | none — `.dropdown-item` text content directly | — |
| Selection checkbox (multi-select only) | new/custom — `<span aria-hidden>` rendered conditionally inside a Select-specific item when `selectionMode="multiple"` (Decision D5) | Form Check Input — visual only, not a real input | `.form-check-input` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|---|---|---|---|---|
| Size | none (no built-in prop) | `.form-select-sm` / default / `.form-select-lg` | Bootstrap | **Resolved (D3):** custom `size?: 'sm' \| 'lg'` prop added to this library's `Select` wrapper, applies the modifier class to the trigger. |
| Selection mode | `selectionMode: 'single' \| 'multiple'` | none — Bootstrap Dropdown has no selection-mode concept | React Aria (structural) | No Bootstrap modifier class exists; custom CSS required (M017 delta below). Drives which selected-state mechanism applies (D4/D5). |
| Selection behavior | `selectionBehavior` (inherited ListBox default: `toggle`) | none | — | Not exposed by `Select`'s own prop surface — out of scope. |
| Validation | `isInvalid` | `.is-invalid`, `.invalid-feedback` | Bootstrap | Attribute lives on Select root, not Button — see DOM conflicts. Background-image validation icon dropped (see DOM conflicts). |
| Disabled | `isDisabled` | `:disabled` / `.form-select:disabled` | Bootstrap | |
| Required | `isRequired` | none | — | `[NO DIRECT COUNTERPART]` — Bootstrap has no required-field visual treatment. |
| Placeholder (no selection) | `data-placeholder` on SelectValue | no dedicated class; muted-text convention | — | Bridged informally to `--bs-secondary-color`, not a named Bootstrap component state. |

**M017 CSS delta — Selection mode:**
- `selectionMode="single"`: selected item → `.dropdown-item.active`-equivalent background/color change (existing Bootstrap dropdown-item token values).
- `selectionMode="multiple"`: selected item → **no** background/color change; instead a `.form-check-input`-styled checkbox indicator (leading position, flex gap before the label text) shows checked/unchecked. See Decisions D4/D5 and State mappings below.

### State mappings

**Select root** (`.react-aria-Select`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-open` | Popover DOM presence (not a `.show` toggle) + caret rotation | Popover mounts only while open → force `display:block` unconditionally on `.react-aria-Popover.dropdown-menu` (bypasses Bootstrap's default `display:none`). Caret: `.react-aria-Select[data-open] .lucide-chevron-down { transform: rotate(180deg); }` (P-018). |
| `data-disabled` | delegates to Button's own `[data-disabled]` | no separate bridge on root |
| `data-invalid` | `.form-select.is-invalid` visual, but attribute lives on root, not Button | `.react-aria-Select[data-invalid] .react-aria-Button.form-select { border-color: var(--bs-form-invalid-border-color); }` plus a focus-combined rule for the danger box-shadow (see Button table) |
| `data-required` | none | `[NO DIRECT COUNTERPART]` |
| `data-focused` / `data-focus-visible` | delegates to Button's real `:focus` (Button is the actual focusable element) | no bridge needed — informational duplicate |

**Button / trigger** (`.react-aria-Button.form-select`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | none — `.form-select` defines no `:hover` rule (verified: absent from compiled CSS and from states.md's Hover section) | no bridge needed |
| `data-pressed` | none — `.form-select` defines no `:active` rule | no bridge needed |
| `data-focused` / `data-focus-visible` | `.form-select:focus` → `border-color:#86b7fe; outline:0; box-shadow:0 0 0 .25rem rgba(13,110,253,.25)` | real `:focus` fires naturally (Button is a real `<button>`); no bridge required for implementation. Reference-story specimens still need a static `.form-select.faux-focus` class (P-001) since Bootstrap uses `:focus`, not `:focus-visible` — no modality distinction to represent. |
| `data-disabled` | `.form-select:disabled` → `background-color: var(--bs-secondary-bg)` (the only property Bootstrap changes for this state) | `.react-aria-Button.form-select[data-disabled] { background-color: var(--bs-secondary-bg); }` |
| `data-invalid` (via ancestor, see root table) | `.form-select.is-invalid:focus` → `border-color: var(--bs-form-invalid-border-color); box-shadow: 0 0 0 .25rem rgba(var(--bs-danger-rgb),.25)` | `.react-aria-Select[data-invalid] .react-aria-Button.form-select[data-focused] { ... }` |
| `data-pending` | not applicable — Select's Button never sets `isPending` | — |

**SelectValue** (`.react-aria-SelectValue`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-placeholder` | no dedicated class; muted-text convention | `.react-aria-SelectValue[data-placeholder] { color: var(--bs-secondary-color); }` |

**Popover** (`.react-aria-Popover.dropdown-menu[data-trigger=Select]`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-entering` / `data-exiting` | none — Bootstrap Dropdown has no built-in open/close animation | no bridge needed / optional future enhancement, out of scope |
| `data-placement` | Bootstrap's static `[data-bs-popper]` fallback positioning doesn't apply | no bridge — RAC's JS/inline-style positioning is always active; borrow visual-chrome classes only |
| (presence) | `.dropdown-menu` default `display:none` | force `display:block` unconditionally (see DOM conflicts) |

**ListBox** (`.dropdown-listbox`, i.e. `.react-aria-ListBox`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-focused` / `data-focus-visible` | none meaningful — container isn't the visibly-focused target under the activedescendant pattern | no bridge, `outline: none` |
| `data-empty` | could use `.dropdown-item-text` styling for an empty-state message | deferred, out of scope for this pass |
| `data-drop-target`, `data-layout`, `data-orientation` | drag-and-drop / grid layout | not applicable — Select's internal ListBox never exposes these |

**ListBoxItem** (`.dropdown-item`, i.e. `.react-aria-ListBoxItem`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | `.dropdown-item:hover` → `color: var(--bs-dropdown-link-hover-color); background-color: var(--bs-dropdown-link-hover-bg)` | `.react-aria-ListBoxItem.dropdown-item[data-hovered] { ... }` (explicit bridge preferred over real `:hover`, which RAC deliberately excludes for touch) |
| `data-focused` / `data-focus-visible` | shares the same rule as hover (`.dropdown-item:hover, .dropdown-item:focus`) but real `:focus` never reaches an item (roving/activedescendant keeps DOM focus on the ListBox) | bridge required (not redundant, unlike Button): `.react-aria-ListBoxItem.dropdown-item[data-focused] { color: var(--bs-dropdown-link-hover-color); background-color: var(--bs-dropdown-link-hover-bg); }` plus `[data-focus-visible] { outline: auto -webkit-focus-ring-color; }` — Bootstrap's own rule doesn't suppress outline for `.dropdown-item`, so the UA ring must be reproduced explicitly (P-001/P-014/P-015) |
| `data-pressed` | shares the same rule as active/selected (`.dropdown-item.active, .dropdown-item:active`) | `.react-aria-ListBoxItem.dropdown-item[data-pressed] { color: var(--bs-dropdown-link-active-color); background-color: var(--bs-dropdown-link-active-bg); }` |
| `data-selected` | `.dropdown-item.active` **only when `data-selection-mode="single"`**; suppressed when `data-selection-mode="multiple"` (drives the checkbox instead) — Decisions D4/D5 | see selection-mode-conditional block below |
| `data-disabled` | `.dropdown-item.disabled` → `color: var(--bs-dropdown-link-disabled-color); pointer-events:none; background-color:transparent` | `.react-aria-ListBoxItem.dropdown-item[data-disabled] { ... }` (a `<div>` can't be `:disabled`, must bridge) |
| `data-selection-mode` | routes which selected-state bridge applies | selector-only, no visual of its own |
| `data-dragging` / `data-allows-dragging` / `data-drop-target` | not used — Select doesn't enable drag-and-drop | not applicable |

**Selection-mode-conditional selected bridges (Decisions D4 + D5):**
```scss
.react-aria-ListBoxItem.dropdown-item[data-selection-mode='single'][data-selected] {
  color: var(--bs-dropdown-link-active-color);
  background-color: var(--bs-dropdown-link-active-bg);
}
.react-aria-ListBoxItem.dropdown-item[data-selection-mode='multiple'][data-selected] .select-item-checkbox {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
}
```
(checkmark data-URI copied from `.form-check-input:checked[type=checkbox]`'s `--bs-form-check-bg-image` value)

**Selection checkbox** (`.select-item-checkbox.form-check-input`, multi-select only, decorative `<span aria-hidden>`)

| State | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| Resting/unchecked | `.form-check-input` base rule (bg, border, size) — applies automatically, not pseudo-class-gated | apply `.form-check-input` class directly; explicitly redeclare `border-radius: 0.25em` (the `[type=checkbox]` attribute-selector rule that normally supplies it won't match a `<span>` with no `type` attribute — see DOM conflicts) |
| Checked | `.form-check-input:checked` → `background-color:#0d6efd; border-color:#0d6efd` + checkmark background-image | bridged via ancestor `[data-selected][data-selection-mode=multiple]`, not `:checked` (see block above) |
| Focus / active / disabled on the checkbox itself | `.form-check-input:focus/:active/:disabled` | not applicable — the span is `aria-hidden` and non-focusable; the parent `ListBoxItem` remains the sole interactive/focusable target |

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|---|---|---|---|---|
| Trigger arrow | MAJOR | `background-image` layer (`--bs-form-select-bg-img`) on the `<select>` itself, no child element | a real rendered `<ChevronDown>` SVG child element | Suppress `.form-select`'s own arrow image (`--bs-form-select-bg-img: none`) so it doesn't double up with the real icon; position the real icon via flex/margin instead. |
| Trigger validation icon | MAJOR | `.is-invalid`/`.is-valid` layer a **second** background-image (`--bs-form-select-bg-icon`) + extra `padding-right`, alongside the arrow image | same real-child-icon constraint as above — no background-image system in use | Drop the background-image validation icon entirely; border-color + box-shadow validation feedback is retained and sufficient. |
| Trigger element type | M018 (elem-type-sub) | `.form-select` assumed on a native `<select>` | React Aria renders a real `<button>` | Real `:focus`/`:hover`/`:active`/`:disabled` behave equivalently since `<button>` is also natively focusable. `.form-select:-moz-focusring` (Firefox `<select>` text-shadow reset) is inert/irrelevant on a button — informational only, no action needed. |
| Invalid state attribute location | MAJOR | `.is-invalid` applied directly to the control needing the visual | `data-invalid` renders on `.react-aria-Select` (ancestor), not on the Button | Descendant-selector bridge: `.react-aria-Select[data-invalid] .react-aria-Button.form-select { ... }` (see State mappings). |
| Popover visibility mechanism | MINOR | `.dropdown-menu` toggles `display:none`→`block` via a `.show` class | RAC mounts/unmounts the Popover from the DOM entirely; no `.show` class is ever added | Force `display:block` unconditionally on `.react-aria-Popover.dropdown-menu` — DOM presence already signals "show". |
| Popover positioning | MINOR | static CSS fallback (`top:100%;left:0`) or `[data-bs-popper]` inline styles | JS-computed inline-style positioning (floating-ui) is always active | Borrow only visual-chrome classes from `.dropdown-menu`; its positioning rules are irrelevant and ignored. |
| Popover ↔ ListBox chrome split | MINOR (resolved, Decision D2) | one element (`.dropdown-menu`) carries both overlay positioning and item-list container styling | two elements — Popover (positioning) and ListBox (scroll container) | Apply `.dropdown-menu`'s visual-chrome properties (bg, border, border-radius, padding) to **Popover**; ListBox gets only `max-height` / `overflow` / `outline:none`. Matches react-aria-components' own vanilla-starter split (Popover.css owns chrome, `dropdown-listbox` is bare). |
| FieldError visibility mechanism | MINOR | `.invalid-feedback` hidden by default, shown via `.is-invalid ~ .invalid-feedback` sibling selector | RAC conditionally mounts `FieldError` only when a real error exists | Force `display:block` unconditionally on `.react-aria-FieldError` — DOM presence already signals "show"; no sibling-selector gating needed (and none would reach it anyway — see next row). |
| FieldError sibling reach | MINOR | `.is-invalid ~ .invalid-feedback` requires the invalid marker on a *preceding sibling* | `data-invalid` lives on the Select root (an ancestor of both Button and FieldError, not a preceding sibling of FieldError) | Moot given the resolution above (unconditional `display:block`), but noted so a future author doesn't try to reach for Bootstrap's native sibling selector here. |
| ListBoxItem focus mechanism | MAJOR | `.dropdown-item:focus` real pseudo-class | roving/activedescendant pattern — individual items never receive real DOM focus | Full `[data-focused]`/`[data-focus-visible]` bridge required (not optional/redundant, unlike the Button's case). |
| Selection checkbox element type | M018 (elem-type-sub), multi-select only | `.form-check-input[type=checkbox]` on a real `<input>` | decorative `<span aria-hidden>` with no `type` attribute | `[type=checkbox]`'s `border-radius:0.25em` rule won't match — redeclare explicitly. `:checked`/`:focus`/`:active`/`:disabled` never fire — checked-look is bridged via the ancestor `[data-selected][data-selection-mode=multiple]`; focus/active/disabled are not applicable (non-interactive element). |
| Selected-state mechanism split by selectionMode | MAJOR (M017 delta, Decisions D4/D5) | one visual language (`.dropdown-item.active`) for all selection | Select needs two different visual languages depending on `selectionMode` | `[data-selection-mode="single"]` → item background/color change; `[data-selection-mode="multiple"]` → checkbox fill, item background/color suppressed. |
| Item label text wrapper | MINOR | `.dropdown-item` expects direct text content | RAC wraps string children in `<span class="react-aria-Text" slot="label">` | No visual impact (inline span inherits color/font) — no bridge needed. |

### Reference story canvas

All specimens laid out in `display:flex; flex-wrap:wrap` containers (P-004), each carrying a visible text label (P-008). Source: `https://getbootstrap.com/docs/5.3/forms/select/` and `https://getbootstrap.com/docs/5.3/components/dropdowns/`. Per P-019, trigger specimens are built from a real `<select className="form-select">` (semantic/visual counterpart's native element); the Open specimens keep that `<select>` at rest and pair it with an independent `.dropdown-menu` mock, since the native `<select>`'s open list is OS-rendered and unstylable.

1. **Default** — closed trigger, single-select. Specimens (P-020 content-driven width demonstration):
   - `"Banana"` selected (short value)
   - `"Pomegranate seeds, family size"` selected (long value — widest realistic content, confirms the trigger doesn't clip/doesn't have a fixed width unrelated to content)
   - Placeholder / no selection (`data-placeholder` muted-text specimen) — text: `"Select a fruit"`
2. **Sizes** — three closed-trigger specimens side by side, same selected value (`"Banana"`) at `.form-select-sm`, default, `.form-select-lg`, to isolate the size delta.
3. **States** — single-select trigger specimens: resting, faux-focus, disabled (real `disabled` attribute), invalid (`.is-invalid` + a paired `.invalid-feedback` specimen reading `"Please choose a fruit."`). No hover specimen — `.form-select` defines no hover treatment (confirmed absent from compiled CSS); this absence is itself the correct target, not an omission.
4. **Open — single-select** — trigger at rest showing `"Banana"` selected (P-005), paired with an independent `.dropdown-menu` mock containing items `Apple`, `Banana` (marked selected/active), `Cherry`, `Date` (disabled). Item state matrix inside the menu (P-009/P-013): resting (`Apple`), faux-hover (`Cherry`), faux-focus with visible outline (`Date`), selected/active (`Banana`), disabled (`Elderberry`). The trigger's native `.form-select` arrow (a `background-image`, which cannot rotate) is suppressed and replaced with an overlaid decorative chevron SVG (`.select-caret`) shown flipped via `.faux-open` (`transform: rotate(180deg)`, P-018) — matching the real composite, which renders a genuine `<ChevronDown>` child element rather than a background-image arrow.
5. **Open — multiple-select** — trigger specimens showing content-driven multi-value summary text (P-020): `"Apple, Banana"` (two selected) and `"Apple, Banana, Cherry, Date"` (widest realistic combination, truncated with an ellipsis via `.select-reference-trigger`'s `text-overflow`), each using the same suppressed-arrow + `.faux-open` caret overlay as the single-select Open specimen. Paired with an independent `.dropdown-menu` mock where each item carries a leading `.form-check-input`-styled checkbox (`.select-item-checkbox`): `Apple` (checked), `Banana` (checked), `Cherry` (unchecked, hover), `Date` (checked, focused), `Elderberry` (unchecked, disabled). Full state matrix for this structurally-distinct family (P-009): resting, faux-hover, faux-focus (outline), checked+focus, disabled — since the selected-state *mechanism* (checkbox fill vs. item background) differs structurally from single-select, not just in token values.
6. **With Label / Description / Validation** — two stacked compositions:
   - `.form-label` (`"Favorite fruit"`) + trigger (`"Banana"` selected) + `.form-text` (`"Choose the fruit you'd eat every day."`)
   - `.form-label` (`"Favorite fruit"`) + trigger (`.is-invalid`, no selection) + `.invalid-feedback` (`"Please choose a fruit."`)

### Confidence

**High**, with one caveat: the react-aria docs MCP (`mcp__react-aria__get_react_aria_page`) does not expose a rendered "data attributes" table for `Select`, `Button`, `ListBox`, `ListBoxItem`, or `Popover` — only prop tables and CSS examples. The full `data-*` surface used in this taxonomy was instead verified against the `@selector`-annotated TypeScript definitions shipped in this repo's installed `node_modules/react-aria-components/dist/types/src/*.d.ts` (Select.d.ts, Button.d.ts, ListBox.d.ts, Popover.d.ts, Collection.d.ts, FieldError.d.ts), which is authoritative for the installed version and not a recall-based substitute. All Bootstrap-side values (compiled selectors, token names, exact property values) were verified against `node_modules/bootstrap/dist/css/bootstrap.css` per M007. Sub-part composition (which icon library, which shared `DropdownItem`/`DropdownListBox`/`Popover`/`Form` helpers are actually used) was verified against this repo's own `src/Select.tsx`, `src/ListBox.tsx`, `src/Popover.tsx`, `src/Form.tsx`, `src/Button.tsx`, `src/Content.tsx` — the current working tree, not deleted/historical content.

Per blank-slate mode: no `git log`/`git show`/`git diff` against a prior commit was run, and no taxonomy/reference-story/CSS content that doesn't exist in the current working tree was consulted or leaned on. `agent/taxonomies/`, `stories/react-aria-bootstrap/reference/`, and `agent/artifacts/reference-css/` contained only `.gitkeep` placeholders at session start; `src/scss/_bootstrap-bridges.scss` and `stories/react-aria-bootstrap/presentation.scss` contained only empty scaffolding comments — this is a genuine first pass, not a redo.

Deferred/out of scope for this pass: `data-empty` ListBox empty-state styling; Popover enter/exit animation; drag-and-drop attributes (`data-dragging`/`data-drop-target`/`data-allows-dragging`); `selectionBehavior` (not exposed by `Select`'s own prop surface); `SelectValue`-as-`TagGroup` composition for multi-select (React Aria docs mention it as an optional pattern, not the default — default comma-joined text summary is in scope, TagGroup-in-trigger is a distinct future composition).

## Decisions

### D1 — Trigger element's applied Bootstrap class (M014 dual-counterpart)
**Question:** React Aria's Select trigger renders a real `<button>` + Popover/ListBox, which structurally matches Bootstrap's Dropdown pattern (`.btn.dropdown-toggle` + `.dropdown-menu`), but the semantically obvious counterpart — because this is a "select" control — is Form Select (`.form-select`). Per M014, which counterpart's class is applied to the trigger element?
**Answer:** `.form-select` (the semantic/visual counterpart). Reproducing `.form-select`'s appearance (padding, border, background, focus ring, sizing) via `.btn.dropdown-toggle` would require extensive CSS-variable overrides and supplementary bridge rules, since Button and Form Select have entirely different token namespaces and neither exposes the other's shape. This matches the skill's own worked example for Select (P-019). The Dropdown counterpart still informs the Popover/ListBox/ListBoxItem sub-parts, which is where the true compound structure lives.

### D2 — Which element carries `.dropdown-menu`'s visual chrome: Popover or ListBox
**Question:** Bootstrap's `.dropdown-menu` is a single element that is both the positioned overlay and the visual container (border, background, padding, border-radius) for the item list. React Aria splits these concerns across two elements — `Popover` (positioning) and `ListBox` (scrollable item container). Which one receives `.dropdown-menu`'s visual-chrome classes/tokens?
**Answer:** **Popover.** It's the element that receives `position`-equivalent overlay treatment, so the outer visual chrome (background, border, border-radius, padding) belongs there; `ListBox` gets only `max-height`/`overflow`/`outline:none`. This also matches react-aria-components' own vanilla-starter reference implementation (`Popover.css` owns the visual chrome; `dropdown-listbox` in `ListBox.css` is a bare scroll container).

### D3 — Size variant exposure
**Question:** Bootstrap offers `.form-select-sm`/`.form-select-lg` modifier classes with no React Aria `Select` prop equivalent (the `Select` API has no `size` prop). Per M016 trigger pattern 1 (variant exposure): expose as a component prop, leave as passthrough-only, or exclude from scope?
**Answer:** Add a custom `size?: 'sm' | 'lg'` prop to this library's `Select` wrapper component. When set, it applies `.form-select-sm`/`.form-select-lg` to the trigger's class list directly (no `data-*` bridge involved — a static modifier class driven by the prop).

### D4 — Selected-item indicator for single-selection mode
**Question:** The existing shared `DropdownItem` (`src/ListBox.tsx`, reused by `Select` via `SelectItem`) unconditionally renders a `<Check />` icon next to any item where `isSelected` is true, regardless of `selectionMode`. Bootstrap's own Dropdown docs show no checkmark convention — a selected/active `.dropdown-item` is indicated by background/color highlight only. For single-selection mode, does the reference target keep the checkmark (matching the shared component's existing behavior) or suppress it in favor of background highlight alone (matching native Bootstrap dropdown-item convention)?
**Answer:** Suppress the checkmark for single-select; rely on background highlight only (`.dropdown-item.active`-equivalent). This requires a Select-specific override of the shared item — `Select`'s `SelectItem` can no longer be a bare passthrough to the shared `DropdownItem`.

### D5 — Selected-item indicator for multi-selection mode
**Question:** Given D4 suppresses the checkmark for single-select, how should multi-select indicate selection?
**Answer:** Multi-select uses a Bootstrap-styled checkbox — a decorative element styled to look like `.form-check-input` (not a real `<input>`) — leading the item's label text. This **replaces both** the checkmark icon and the background-highlight mechanism for multi-select: a selected item in multi-select mode shows a filled/checked-looking checkbox and no `.dropdown-item.active` background/color change. See State mappings' "Selection-mode-conditional selected bridges" and the DOM conflicts entries for the checkbox's element-type substitution.
