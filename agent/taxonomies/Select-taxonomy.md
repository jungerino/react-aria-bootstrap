---
title: Select Taxonomy
component: Select
iteration: 1
---

## Select

**React Aria root class:** `.react-aria-Select`
**Mapping type:** Composite — trigger button → **Form Select** (`.form-select`; dual-counterpart with Dropdown Toggle `.btn.dropdown-toggle`, semantic/visual counterpart wins the class per M014); popover panel + listbox → **Dropdown Menu** (`.dropdown-menu`, its token set split across two nested elements); listbox item → **Dropdown Item** (`.dropdown-item`); label → **Form Label** (`.form-label`); description → **Form Text** (`.form-text`); field error → **Form Feedback** (`.invalid-feedback`); section header → **Dropdown Header** (`.dropdown-header`).

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|---|---|---|---|
| Root wrapper | `.react-aria-Select` (`<div>`) | Dropdown wrapper | `.dropdown` (structural role only — `position: relative`; contributes no visual tokens) |
| Label | `.react-aria-Label` (`<label>`) | Form Label | `.form-label` |
| Trigger button | `.react-aria-Button.button-base` (`<button>`) | **Dual-counterpart (M014):** Form Select (semantic/visual) vs. Dropdown Toggle (structural) | `.form-select` — see `## Decisions` D-form-select-class |
| Value text | `.react-aria-SelectValue` (`<span>`) | **[NO DIRECT COUNTERPART]** — plain text run, no Bootstrap element wraps a "current value" span inside `.form-select` (a native `<select>`'s displayed text has no addressable DOM node) | none of its own; inherits trigger's `color`/font tokens. Placeholder dimming borrows `--bs-secondary-color` (closest visual pattern; Bootstrap defines no placeholder-shown treatment for `.form-select` — verified in states.md, which scopes `:placeholder-shown` to Form Control/Floating Labels only) |
| Chevron icon | `<ChevronDown>` (lucide `<svg>`, child of trigger) | Substitutes for Form Select's `--bs-form-select-bg-img` background layer | none (bare icon, colored via `currentColor`); see DOM conflicts #2 |
| Description | `.field-description` (`<span>`, slot="description") | Form Text | `.form-text` |
| Field error | `.react-aria-FieldError` (`<span>`, slot="errorMessage", conditionally mounted) | Form Feedback | `.invalid-feedback` |
| Popover panel | `.react-aria-Popover.select-popover` (`<div>`, `hideArrow`) | Dropdown Menu — outer/box half | `.dropdown-menu` (box tokens only: bg, border, radius, shadow, min-width, z-index) |
| ListBox | `.dropdown-listbox` — **not** `.react-aria-ListBox`; see DOM conflicts #3 and Confidence | Dropdown Menu — inner/flow half | `.dropdown-menu` (flow tokens only: padding-y/x, list-style, overflow/scroll) |
| ListBoxItem | `.dropdown-item` — **not** `.react-aria-ListBoxItem`; see DOM conflicts #3 and Confidence | Dropdown Item | `.dropdown-item` |
| Selected-item indicator icon | `<Check>` (lucide `<svg>`, conditional on `data-selected`, child of ListBoxItem) | **Out of scope for the Bootstrap-styled target** — resolved D-selected-indicator: native `.active` background/color only, no icon | n/a — the reference story's selected specimen renders no icon, matching Bootstrap's own `.dropdown-item.active` docs example exactly |
| Section header | `.react-aria-Header` (via `ListBoxSection`, opt-in) | Dropdown Header | `.dropdown-header` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|---|---|---|---|---|
| `selectionMode` | `'single'` (default) / `'multiple'` | No native multi-select dropdown-menu component | React Aria structural variant, no Bootstrap modifier class | **In scope** (resolved D-multi-select-scope): custom CSS required — closest structural pattern is `.form-check` checkbox inputs embedded inside `.dropdown-item`s (no official Bootstrap docs example; built from the Form Check + Dropdown Item primitives already in the KB) |
| `isInvalid` | boolean | `.is-invalid` on trigger + `.invalid-feedback` sibling | Bootstrap authoritative | 1:1 |
| `isRequired` | boolean | none | **[NO DIRECT COUNTERPART]** | Bootstrap has no built-in required-marker convention for `.form-select`; no bridge needed — `aria-required` stays a pure ARIA signal with no dedicated visual |
| `isDisabled` | boolean | `:disabled` on `.form-select` | Bootstrap authoritative | 1:1 |
| `layout` (ListBox) | `'stack'` (default) / `'grid'` | No grid-menu convention in Dropdown | Custom CSS required, out of scope | Select never sets `layout="grid"` in its composition — not shown in reference stories |
| `orientation` (ListBox) | `'vertical'` (default) / `'horizontal'` | n/a | Not applicable to a dropdown-menu context | Select is always vertical — out of scope |

### State mappings

**Trigger button** (`.react-aria-Button.button-base`, styled with `.form-select`):

| `data-*` attribute | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | none (`.form-select` defines no `:hover` rule in Bootstrap's compiled CSS) | No bridge needed — resting appearance persists on hover, consistent with native `<select>` behavior |
| `data-pressed` | none natively; **resolved D-pressed-state:** borrow a subtle tint from Dropdown Toggle's `:active`/`.show` treatment as an enhancement | Compound selector bridge reading Dropdown's active tokens (`--bs-dropdown-link-active-bg`-adjacent tint, applied at low opacity so it reads as a subtle press feedback rather than a full active-item swap) rather than any `--bs-form-select-*` or `--bs-btn-*` token, since neither namespace defines one |
| `data-focused` | shares `.form-select:focus` (border-color + box-shadow change) | Compound selector bridge: `.form-select[data-focused]` reading `--bs-form-select-*`-adjacent focus tokens (border `#86b7fe`, box-shadow `0 0 0 .25rem rgba(13,110,253,.25)`, both are static values on `.form-select`, not variable-driven — see tokens.md, Form Select has no `--bs-input-*`-style override hook) |
| `data-focus-visible` | same as `data-focused` (`.form-select` does not distinguish `:focus` from `:focus-visible`) | Same bridge as above |
| `data-disabled` | `.form-select:disabled` (`background-color: var(--bs-secondary-bg)`) | Compound selector bridge |
| `data-pending` | none — Select never sets `isPending` on its Button composition | Out of scope, no bridge needed |
| `data-open` (on root, informs trigger) | closest analog: Dropdown Toggle's `aria-expanded="true"`/`.show` (informs ARIA wiring, not a `.form-select` visual) | No visual bridge on the trigger itself; drives the chevron rotation (DOM conflict #2) and the popover's mount/visibility |
| `data-invalid` (on root, informs trigger) | `.form-select.is-invalid` (border-color + validation icon layer) | Compound selector bridge; see DOM conflict #2 for the validation-icon-layer interaction with the chevron |
| `data-required` (on root, informs trigger) | none | No bridge needed (see Variants table) |

**SelectValue** (`.react-aria-SelectValue`):

| `data-*` attribute | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-placeholder` | **[NO DIRECT COUNTERPART]** | Closest visual pattern: `--bs-secondary-color` (muted text token) — see Sub-parts table |

**Popover** (`.react-aria-Popover.select-popover`):

| `data-*` attribute | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-trigger="Select"` | informational only, no Bootstrap counterpart | No bridge needed |
| `data-placement="..."` | informational only (Bootstrap's own `[data-bs-popper]` marks *that* positioning is active but doesn't encode placement in a stylable way by default) | No bridge needed |
| `data-entering` / `data-exiting` | Bootstrap's `.fade`/`.show` enter/exit-transition concept (states.md, Expanded/Open) | Bridge as a CSS transition on opacity/transform, keyed off these attributes instead of `.fade`/`.show` classes (React Aria doesn't add those classes) |

**ListBox** (`.dropdown-listbox`):

| `data-*` attribute | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-empty` | no direct Bootstrap convention for an empty dropdown-menu | Closest structural pattern: `.dropdown-item-text` styling (muted, non-interactive) applied to whatever empty-state content is rendered |
| `data-focused` | n/a (Bootstrap's `.dropdown-menu` itself is never a focus target — focus lives on items) | No bridge needed |
| `data-focus-visible` | n/a | No bridge needed |
| `data-drop-target` | out of scope — Select does not enable drag-and-drop | No bridge needed |
| `data-layout="stack"` | n/a (see Variants) | No bridge needed (Select never varies this) |
| `data-orientation="vertical"` | n/a (see Variants) | No bridge needed |

**ListBoxItem** (`.dropdown-item`):

| `data-*` attribute | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | `.dropdown-item:hover` (`color`/`background-color` via `--bs-dropdown-link-hover-color`/`-bg`) | Compound selector bridge, reading the same CSS variables Bootstrap's native `:hover` rule reads (M004) |
| `data-pressed` | `.dropdown-item:active` (shares the `.active` bg/color pair — states.md Active/Pressed) | Compound selector bridge |
| `data-selected` | `.dropdown-item.active` (`--bs-dropdown-link-active-color`/`-bg`) | Compound selector bridge for color/bg only — **resolved D-selected-indicator:** no icon, matching Bootstrap's native `.active` treatment exactly |
| `data-focused` | shares the `:hover, :focus` combined rule (`--bs-dropdown-link-hover-color`/`-bg`) | Compound selector bridge |
| `data-focus-visible` | same as `data-focused` (Bootstrap does not distinguish `:focus` from `:focus-visible` on `.dropdown-item`) | Same bridge |
| `data-disabled` | `.dropdown-item.disabled`/`:disabled` (dimmed color, `pointer-events:none`) | Compound selector bridge |
| `data-selection-mode="single\|multiple"` | see Variants (`selectionMode`) | **Resolved D-multi-select-scope:** multiple selection is in scope — item renders a `.form-check` checkbox input alongside its label when `data-selection-mode="multiple"` |
| `data-allows-dragging` / `data-dragging` / `data-drop-target` | out of scope — Select does not enable drag-and-drop | No bridge needed |

**Label / Description / FieldError:** no `data-*` state surface of their own (plain structural elements); styled 1:1 via `.form-label` / `.form-text` / `.invalid-feedback` static classes.

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|---|---|---|---|---|
| Trigger button element type | MAJOR (M018 elem-type-sub) | `.form-select` is documented/demonstrated on a native `<select>` | `<button type="button">` | Verified via compiled-CSS grep (`node_modules/bootstrap/dist/css/bootstrap.css`): no `select.form-select`-tag-qualified rule exists anywhere — every rule targets the bare `.form-select` class. No Bootstrap component-level rule is invalidated by the element-type substitution. `.form-select`'s own `appearance: none` already neutralizes native chrome regardless of tag, so no `_reboot.scss` gap was found either. |
| Chevron affordance | MAJOR | A `background-image` layer (`--bs-form-select-bg-img`) on the element itself — no DOM node, and it never rotates (no Bootstrap hook for a select's open/closed state) | A real `<svg>` child element (lucide `ChevronDown`) | Suppress `--bs-form-select-bg-img` (→ `none`) **and** the auto validation-icon layer `--bs-form-select-bg-icon` (which would otherwise render Bootstrap's own red/green circle behind the now-empty chevron slot when `.is-valid`/`.is-invalid` is applied, colliding with the real icon). Style the real `<ChevronDown>` icon instead — this also enables the `[data-open]` rotate-180° transform required by P-018, which a static background-image could never support. |
| Popover/ListBox split vs. fused `.dropdown-menu` | MAJOR (wrapper insertion) | Bootstrap fuses the "floating panel" and "item-list container" into **one** element carrying one token set (`.dropdown-menu`) | React Aria splits this into two nested elements: Popover (outer, the one actually positioned) wrapping ListBox (inner, scrollable) | Split `.dropdown-menu`'s token set across the two elements: outer Popover gets box tokens (`--bs-dropdown-bg`, `-border-color`, `-border-radius`, `-border-width`, `-box-shadow`, `-min-width`, `-zindex`); inner `.dropdown-listbox` gets flow tokens (`-padding-x`, `-padding-y`, `list-style`, `overflow`). Applying the full class to both would double borders/shadows. |
| FieldError display mechanism | MINOR | An always-mounted `.invalid-feedback` element, `display:none` baseline, revealed via a sibling selector keyed off `.is-invalid`/`:invalid` on the preceding control (states.md, Valid/Invalid) | React Aria's `FieldError` returns `null` (unmounts entirely) whenever the field is not invalid — verified directly in the installed package (`node_modules/react-aria-components/dist/private/FieldError.mjs`: `if (!validation?.isInvalid) return null;`) | No display-toggle bridge needed — the element's mere presence already means "show it." Only `.invalid-feedback`'s color/typography token values are borrowed, not its sibling-selector visibility mechanism. |
| Popover positioning vs. `.dropdown` ancestor | MINOR (informational) | `.dropdown-menu`'s `position: absolute` resolves against a `.dropdown { position: relative }` ancestor (patterns.md §Dropdown) — moving the menu outside that ancestor breaks its placement | React Aria's `Popover` self-positions via its own internal positioning logic (computed inline style), independent of any ancestor's `position: relative` | No structural requirement carries over. `.react-aria-Select` being `position: relative` (per its own pre-existing CSS) is coincidental, not load-bearing for the popover's placement — no bridge action needed. |

### Reference story canvas

- **Default** — closed trigger, with label, placeholder text shown, chevron resting (not rotated).
- **States** — interactive matrix on the closed trigger, each specimen individually labeled (P-008): resting, hover (`.faux-hover`), focus-visible (`.faux-focus-visible`), pressed (`.faux-pressed`, subtle Dropdown-Toggle-tint per D-pressed-state), disabled, invalid (paired with `.invalid-feedback` text), required (informational only, no distinct visual per Variants table — include the specimen so the "no visual difference" fact is legible, not omitted).
- **Open — default** — popover visible, trigger shows the currently-selected value (P-005) with chevron rotated 180° (P-018, `.faux-open`); item-state matrix inside the open list: resting, hovered (`.faux-hover`), keyboard-focused (`.faux-focus-visible`), selected (`.active`, color/bg only per D-selected-indicator, no icon), disabled.
- **Open — grouped** — sectioned listbox using `.dropdown-header` (mirrors the Content section's Fruit/Vegetable grouping example from the React Aria docs).
- **Multi-select** — in scope per D-multi-select-scope: open popover, `selectionMode="multiple"`, each item paired with a `.form-check` checkbox input reflecting `data-selected`; trigger shows a comma-joined summary of selected values.
- All specimens laid out in a flex-wrap container (P-004); labels live outside any popover/listbox boundary except for item specimens, where the item's own text serves as the label (P-008).

### Confidence

Medium-High. Sub-part identification and every DOM fact above (the ListBox/ListBoxItem className-replacement, FieldError's conditional mounting, `.form-select`'s tag-independence) were verified directly against the installed `react-aria-components` package's `.d.ts` type declarations and compiled private source (`node_modules/react-aria-components/dist/{types,private}/...`), and against Bootstrap's compiled CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) plus live Bootstrap documentation (WebFetch) — not against recollection or the react-aria.adobe.com MCP docs alone (that MCP tool's `Select`/`Button`/`ListBox` pages expose prop tables but no `data-*`/render-props tables for this install; the full state surface came from the shipped `.d.ts` files instead, which is the more authoritative source in any case). Three genuine design forks were surfaced rather than resolved unilaterally, per M016; all three are now resolved by the user and recorded in `## Decisions` below.

**Blank-slate mode was ON for this session.** No `git log`, `git show`, `git diff` against a prior commit, or any other command reading past-commit content was run for this taxonomy. No prior taxonomy, reference story, or `presentation.scss` content for Select was consulted — the working tree currently contains no such artifacts (`agent/taxonomies/`, `stories/react-aria-bootstrap/reference/`, and `presentation.scss` all confirmed empty/placeholder before this doc was written). All conclusions derive from: the current working tree's live `react-aria-components` package, the pre-existing (pre-Bootstrap) `src/Select.tsx` / `src/ListBox.tsx` / `src/Button.tsx` / `src/Form.tsx` / `src/Content.tsx` implementations, the Bootstrap Knowledge Base (`agent/bootstrap-kb/`), and live Bootstrap 5.3 documentation fetched via WebFetch.

## Decisions

### D-form-select-class — Trigger button's Bootstrap component class

**Question:** Select's trigger renders as a real `<button>` opening a real popover+listbox (structural counterpart: Dropdown Toggle `.btn.dropdown-toggle`), but conceptually the whole widget "is" a select (semantic/visual counterpart: Form Select `.form-select`). Per M014, exactly one of the two contributes the applied class — which one, and why?
**Answer:** Resolved mechanically via M014's bridge-complexity deciding signal (not escalated as a user decision) — `.form-select` is the applied class. Verified tag-independent via compiled-CSS grep (no `select.form-select`-qualified rule exists), and it already ships focus/disabled/invalid states matching what Select needs, whereas `.btn.dropdown-toggle` shares no token namespace with `.form-select` and would need near-total custom override to fake form-control appearance.

### D-selected-indicator — Selected dropdown-item icon

**Question:** Select's `dropdown-item` renders a checkmark icon (lucide `Check`) when an item is selected, in the current pre-Bootstrap CSS (`src/ListBox.tsx`/`ListBox.css`). Bootstrap's own dropdown-item `.active` state (getbootstrap.com/docs/5.3/components/dropdowns/) uses only a background/text color change — no icon. Should the Bootstrap-styled reference keep a checkmark icon on the selected item, or rely solely on Bootstrap's native active background/color treatment with no icon?
**Answer:** Native `.active` only — no checkmark icon.

### D-multi-select-scope — Multi-select variant scope

**Question:** Select's underlying API supports `selectionMode="multiple"`, but Bootstrap has no built-in multi-select dropdown-menu component or documented pattern (the closest unofficial recipe is checkbox inputs embedded inside `.dropdown-item`s). Should the reference stories include a multi-select variant for this pass, or is `selectionMode="single"` the only in-scope variant, with multiple explicitly deferred?
**Answer:** Include a `selectionMode="multiple"` variant as an additional reference story.

### D-pressed-state — Trigger pressed-state treatment

**Question:** The trigger's chosen Bootstrap class, `.form-select`, defines no `:active`/pressed visual treatment in Bootstrap's CSS (native `<select>` elements have no pressed state) — but React Aria's Button sub-part still fires `data-pressed` on every press. Should the pressed specimen render identically to the resting state (pure Bootstrap fidelity, since Bootstrap defines nothing here), or should it borrow a subtle background tint (e.g., from Dropdown Toggle's `:active`/`.show` treatment) as an enhancement beyond stock Bootstrap?
**Answer:** Borrow a subtle tint from Dropdown Toggle's `:active`/`.show` state for the pressed trigger specimen.
