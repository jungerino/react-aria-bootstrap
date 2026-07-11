---
title: Select Taxonomy
component: Select
iteration: 1
---

## Select

**React Aria root class:** `.react-aria-Select`
**Mapping type:** Composite — sub-parts map to genuinely different Bootstrap components (Dropdown, Form Select [visual counterpart only], Form Label, Form Text, invalid-feedback).

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|---|---|---|---|
| Root wrapper | `.react-aria-Select` (div) | Dropdown wrapper | `.dropdown` — optional; only contributes `position: relative`, which is not structurally required since React Aria's Popover computes position independently (see DOM conflict "Popover positioning"). Included for semantic completeness only. |
| Label | `.react-aria-Label` (via `<Label>`, rendered when `label` prop is set) | Form Label | `.form-label` |
| Trigger button | `.react-aria-Button` (`Button.tsx`, real `<button>`) | Dropdown toggle (structural, M014) / Form Select (semantic/visual, M014) | `.btn`, `.dropdown-toggle`, `.btn-sm`/`.btn-lg` (size, D1); CSS custom-property overrides sourced from `.form-select` tokens — see Decisions D2 |
| Selected value text | `.react-aria-SelectValue` (span, child of trigger) | [NO DIRECT COUNTERPART] — native `<select>` has no separate value wrapper; the browser renders the chosen `<option>` text directly | none; inherits trigger's typography tokens; placeholder state (`[data-placeholder]`) styled with `--bs-secondary-color` |
| Caret icon | `svg.lucide-chevron-down` (real DOM element, child of trigger) | Dropdown toggle caret (`::after` pseudo-element) — M018 element-type substitution | none (real element, not a pseudo-element); `.dropdown-toggle::after` suppressed via `content: none`; icon rotated 180deg on open per P-018 |
| Description | `[slot=description]` (`.field-description`, via `<Description>`) | Form Text | `.form-text` |
| Field error | `.react-aria-FieldError` (mounted only when invalid) | Invalid feedback | `.invalid-feedback` (forced `display: block` — see DOM conflict "Field error visibility") |
| Popover (menu) | `.react-aria-Popover` (`className="select-popover"`, `data-trigger="Select"`) | Dropdown menu | `.dropdown-menu` |
| ListBox (options container) | `.react-aria-ListBox` (`className="dropdown-listbox"`, nested inside Popover) | [wrapper insertion — no separate Bootstrap class] | none; `.dropdown-menu`'s visual chrome lives on the Popover ancestor per M020 one-component-class — see DOM conflict "Popover + ListBox" |
| ListBoxItem (option) | `.react-aria-ListBoxItem` (`className="dropdown-item"`, via `DropdownItem`) | Dropdown item | `.dropdown-item` |
| Selected checkmark | `svg.lucide-check` (child of item, rendered only when `isSelected`) | none — resolved via review feedback, see Decisions D3 | none; hidden (`display: none`) in the Bootstrap-styled context — selection is indicated by `.dropdown-item.active`'s background/color fill alone, matching genuine Bootstrap dropdown-item convention |
| Section (optional) | `.react-aria-ListBoxSection` | — (structural grouping only) | none |
| Section header (optional) | `.react-aria-Header` (within a Section) | Dropdown header | `.dropdown-header` (+ `.dropdown-divider` between groups) |
| Hidden native select | `<select>` rendered by `HiddenSelect` (off-screen, for native form submission) | — (out of visual scope) | none — already invisible via React Aria's own hiding technique |
| Trigger validation icon | none rendered by React Aria — new element required | Form Select's embedded validation icon (green check / red circle-exclamation) | none in React Aria's DOM; a new icon element added in the Bootstrap-styled context, positioned before the caret, using Bootstrap's exact `--bs-form-select-bg-icon` SVG data URIs for `.is-valid`/`.is-invalid` (see Decisions D3, DOM conflict "Trigger validation icon") |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|---|---|---|---|---|
| Size | none pre-existing — new `size` prop added per D1 | `.form-select-sm`/`.form-select-lg`, `.btn-sm`/`.btn-lg` | Bootstrap authoritative | `.btn-sm`/`.btn-lg` and `.form-select-sm`/`.form-select-lg` coincide exactly on `font-size`, `padding-y`, and `border-radius` (sm: 0.875rem / 0.25rem / `--bs-border-radius-sm`; lg: 1.25rem / 0.5rem / `--bs-border-radius-lg`) — apply `.btn-sm`/`.btn-lg` directly, no override delta needed for those three properties. `padding-x`: form-select-sm/lg use asymmetric left/right padding to reserve room for a native background-image chevron; our trigger renders a real SVG chevron as a flex child instead (sub-part "Caret icon"), so that reservation technique doesn't apply — use `.btn-sm`'s/`.btn-lg`'s symmetric `padding-x` (0.5rem / 1rem, which matches form-select's *left*-padding value exactly) and rely on flex `gap` for icon clearance. |
| selectionMode | `single` \| `multiple` | none — Bootstrap's dropdown pattern has no native multi-select equivalent | React Aria structural | M017: no Bootstrap modifier class exists; no CSS delta identified between the two modes (the selected-item checkmark that previously differentiated multiple simultaneous selections was removed per Decisions D3 — selection is indicated by background/color fill alone regardless of `selectionMode`). |
| Validation (invalid/required) | `isInvalid`, `isRequired` → `[data-invalid]`, `[data-required]` (root only) | `.form-select.is-invalid`/`.is-valid`, `.invalid-feedback`/`.valid-feedback`, plus Bootstrap's embedded validation icon (`--bs-form-select-bg-icon`) | Bootstrap authoritative for visual treatment | Bridge via ancestor-scoped compound selector `.react-aria-Select[data-invalid] .select-trigger` — `data-invalid` is not mirrored onto the trigger button itself (verified in installed source; see DOM conflict "Trigger invalid-state signal"). Per Decisions D3, the valid/invalid treatment also requires a dedicated icon element (sub-part "Trigger validation icon"), not just a border-color change. |
| Placeholder | `placeholder` prop → `[data-placeholder]` on `SelectValue` | none — native `<select>` has no `::placeholder` (that pseudo-element only applies to `<input>`/`<textarea>`) | — | [NO DIRECT COUNTERPART]; closest visual analog is `--bs-secondary-color`, the same muted-text token Bootstrap uses for `.form-text` and disabled affordances. |
| Grouped options (sections) | `ListBoxSection` + `Header` (optional; consumer-supplied children) | `.dropdown-header` + `.dropdown-divider` | Bootstrap authoritative | In scope per M011 (structural-variants): same sub-parts (ListBox/ListBoxItem), same class assignments, same accessibility wiring — only DOM arrangement changes (grouped vs. flat). |
| Open state visual | `[data-open]` (root only) / `[data-pressed]` (mirrored onto trigger — see DOM conflict "Trigger open-state signal") | `.btn.show` (part of the `.btn` active-state selector group) | — | Resolved, not a fork: the semantic counterpart's only state differentiation is `:focus` (a real `<select>` stays browser-focused while its native picker is open), so the open trigger is styled identically to the focused trigger rather than inventing separate `--bs-btn-active-*` "pressed/darkened" values. See Decisions D2. |

### State mappings

**Root `.react-aria-Select`**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `[data-focused]` | — | No bridge — visual focus lives on the trigger (a real `<button>`), not styled independently on root |
| `[data-focus-visible]` | — | No bridge — not independently styled |
| `[data-disabled]` | `.btn:disabled`/`fieldset:disabled .btn` (trigger) + dimmed label/description | Compound selector: `.react-aria-Select[data-disabled] .form-label`, `.react-aria-Select[data-disabled] .field-description`; trigger itself gets native `:disabled` (see Trigger below) |
| `[data-open]` | `.btn.show` (active-state visual group) | Compound selector, ancestor-scoped: `.react-aria-Select[data-open] .select-trigger` reproduces the same visual as `:focus`/`[data-focus-visible]` (Variants row "Open state visual") |
| `[data-invalid]` | `.form-select.is-invalid`, `.invalid-feedback`, invalid validation icon (D3) | Compound selector, ancestor-scoped: `.react-aria-Select[data-invalid] .select-trigger`. (Description-hiding-when-invalid is pre-existing non-Bootstrap behavior already present in `Form.css`'s `.field-description` rule — not a Bootstrap convention; carries forward unchanged.) |
| `[data-required]` | none — Bootstrap has no visual for required-but-unfilled on a select | No bridge — informational only |

**No `[data-valid]` attribute exists.** `SelectRenderProps` (verified in `node_modules/react-aria-components/dist/types/src/Select.d.ts`) exposes `isInvalid` → `[data-invalid]` but no `isValid`/`[data-valid]` counterpart — React Aria signals invalidity only, it does not auto-detect a "valid" state the way HTML5 `:valid` does. The Field States reference story's Valid specimen (`.is-valid` + green check icon, per Decisions D3) depicts the target appearance using literal Bootstrap markup; at implementation time, applying the equivalent `.select-trigger.is-valid`-style bridge to the real component will require the consuming application to derive "valid" itself (e.g. from its own form-validation logic), since `Select` has no built-in signal for it. This is a scope note, not a fork — flagging it here so the implementation phase isn't surprised.

**Trigger `.react-aria-Button` (real `<button>`)**

| `data-*` / pseudo-class | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `:hover` (native) | `.btn:hover` | Strategy 1 — no bridge; token values overridden to equal resting values (form-select has no hover treatment — M014) |
| `[data-hovered]` | — | Redundant with `:hover`; no bridge needed |
| `:focus-visible` (native) | `.btn:focus-visible` | Strategy 1 — no bridge; token values overridden per Decisions D2 |
| `[data-focus-visible]` | — | Redundant with `:focus-visible`; no bridge needed |
| `[data-pressed]` (real momentary press, AND repurposed to signal select-open — DOM conflict "Trigger open-state signal") | `.btn.show` / `:active` visual | Compound selector `.select-trigger[data-pressed]` reproduces the focus-equivalent visual (Variants row "Open state visual"); genuine momentary-press feedback is visually subsumed into this same treatment since React Aria overwrites `isPressed` with `state.isOpen` while the Select is open |
| `:disabled` (native, attribute set from `isDisabled`) | `.btn:disabled` | Strategy 1 — no bridge; token values overridden |
| `[data-disabled]` | — | Redundant with `:disabled`; no bridge needed |
| `[data-pending]` | none — Select's trigger never enters a pending state | Not applicable |

**Pseudo-class audit — trigger:**
- `:hover` — ACTIVE (real button); overridden to equal resting tokens per M014
- `:focus-visible` — ACTIVE (real button)
- `:focus` — ACTIVE (real button); not separately distinguished since `.btn` only defines a `:focus-visible` rule, no plain `:focus` rule
- `:active` — ACTIVE technically, but superseded in practice by the `[data-pressed]` compound bridge (React Aria's usePress-driven `[data-pressed]` is the reliable state source)
- `:disabled` — ACTIVE (native `disabled` attribute set via `triggerProps`)
- `.active` (class) — INERT (React Aria never adds this class) — M007 heuristic
- `.disabled` (class) — INERT — M007 heuristic
- `.show` (class) — INERT (never added; bridged via `[data-pressed]`/ancestor `[data-open]` instead) — M007 heuristic

**SelectValue `.react-aria-SelectValue`**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `[data-placeholder]` | none native | Compound selector: `.react-aria-SelectValue[data-placeholder]` → `color: var(--bs-secondary-color)` |

**Popover `.react-aria-Popover` (menu)**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `[data-trigger="Select"]` | — | Selector hook only (already used in current codebase CSS for width); no visual bridge needed |
| `[data-placement]` | `.dropup`/`.dropend`/etc. Popper placement variants | Not required for base parity — React Aria computes placement independently (DOM conflict "Popover positioning"); directional caret flips per placement would be a separate enhancement |
| `[data-entering]` / `[data-exiting]` | none — Bootstrap's `.dropdown-menu` has no built-in enter/exit transition (JS toggles `display` instantly) | No Bootstrap equivalent to bridge; not a Bootstrap-driven concern |

**ListBox `.react-aria-ListBox` (`dropdown-listbox`)**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `[data-empty]` | none — Bootstrap dropdown has no documented empty state | [NO DIRECT COUNTERPART]; style as muted placeholder text via `--bs-dropdown-link-disabled-color` |
| `[data-focused]` / `[data-focus-visible]` | none — only items are styled for focus in Bootstrap's dropdown, never the menu container | No bridge — not independently styled |
| `[data-drop-target]` | none — drag-and-drop is out of Bootstrap's vocabulary | Out of scope for this taxonomy |
| `[data-layout]` / `[data-orientation]` | none | Select always uses default `stack`/`vertical`; not exercised |

**ListBoxItem `.react-aria-ListBoxItem` (`dropdown-item`)**

| `data-*` / pseudo-class | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `[data-hovered]` | `.dropdown-item:hover` | `:hover` fires natively on any element type — usable directly per Strategy 1 |
| `[data-pressed]` | `.dropdown-item:active` | Item is a `<div role="option">`, not a native interactive element; verify `:active` fires at implementation time (per-selector audit) — bridge via `[data-pressed]` if inert |
| `[data-focused]` / `[data-focus-visible]` | `.dropdown-item:focus` | Item is not natively focusable via Tab (roving/virtual focus pattern) — `:focus` will not fire; bridge via `[data-focus-visible]` compound selector |
| `[data-selected]` | `.dropdown-item.active`/`.dropdown-item:active` (persistent) | Compound selector: `.dropdown-item[data-selected]` → `--bs-dropdown-link-active-color`/`--bs-dropdown-link-active-bg`. Per Decisions D3, this compound selector must also hide `DropdownItem`'s existing `<Check>` icon (`display: none`) — no checkmark glyph in the Bootstrap target appearance. |
| `[data-disabled]` | `.dropdown-item.disabled`/`.dropdown-item:disabled` | Compound selector (item is a `<div>`, pseudo-class won't fire) |
| `[data-selection-mode]` | none | Informational only |
| `[data-allows-dragging]` / `[data-dragging]` / `[data-drop-target]` | none | Out of scope |

**Pseudo-class audit — ListBoxItem:**
- `:hover` — ACTIVE (fires on any element regardless of type) — usable directly
- `:focus` / `:focus-visible` — INERT (roving/virtual focus, not real DOM focus) — bridge via `[data-focus-visible]`
- `:active` — verify at implementation time; `[data-pressed]` is the safer bridge target regardless
- `.active` (class) — INERT — bridge via `[data-selected]`
- `.disabled` (class) / `:disabled` (pseudo) — INERT (item is a `<div>`, no native disabled state) — bridge via `[data-disabled]`

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|---|---|---|---|---|
| Trigger | CRITICAL (M014 dual-counterpart) | `<select class="form-select">` — native element, own token/state system | `<button>` (Dropdown pattern) | Apply the structural counterpart's class (`.btn.dropdown-toggle`); override CSS custom properties with values sourced from `.form-select`'s computed tokens (P-012). See Decisions D2. |
| Trigger caret | MAJOR (M018 element-type substitution) | `.dropdown-toggle::after` — generated pseudo-element, no DOM node | Real `svg.lucide-chevron-down` element, a genuine flex child | Suppress `.dropdown-toggle::after` (`content: none`) inside the Select trigger scope; style the real SVG to read as a caret; rotate 180deg on open (P-018). No other `_reboot.scss` rules were found scoped to `.dropdown-toggle::after` beyond the caret itself. |
| Popover + ListBox | MAJOR (wrapper insertion) | Single `.dropdown-menu` element directly containing `.dropdown-item` children | Two nested elements: `.react-aria-Popover` (overlay/position) wrapping `.react-aria-ListBox` (scrollable list) | Apply `.dropdown-menu`'s full visual property set (bg, border, border-radius, box-shadow, padding, min-width, font-size, z-index) to the Popover per M020 one-component-class; ListBox receives no Bootstrap component class — `.dropdown-item` (one level deeper) is an unscoped selector, and Bootstrap's CSS never requires items to be a direct child of `.dropdown-menu`. |
| Popover positioning | MINOR | `.dropdown-menu[data-bs-popper]` — Popper.js sets `position`/`inset`/`margin`, gated on this attribute | React Aria never adds `[data-bs-popper]`; positions the Popover via its own overlay system (inline styles) | Do not depend on `.dropdown-menu[data-bs-popper]` rules; the existing `Popover.css` sets no `position` property of its own, already consistent with this. |
| Trigger open-state signal | MAJOR (non-obvious; verified against installed `react-aria-components` source) | `.btn.show` requires the JS-toggled `.show` class | `[data-open]` is set only on the ROOT `.react-aria-Select`. Select internally forces the trigger's `isPressed` render prop to `state.isOpen` (`react-aria-components/dist/private/Select.mjs`, line 175), so the trigger instead receives `[data-pressed]` when open — a repurposing of the momentary-press attribute to also mean "select is open." | Bridge target: `.react-aria-Select[data-open] .select-trigger` (ancestor-scoped, semantically clearest) — equivalent in practice to `.select-trigger[data-pressed]`, but the ancestor form avoids conflating with genuine momentary-press semantics in CSS/comments. |
| Trigger invalid-state signal | MINOR (verified against installed source) | `.form-select.is-invalid`/`:invalid` fires directly on the styled element | `[data-invalid]` is set only on the ROOT `.react-aria-Select`, never mirrored onto the trigger `<button>` | Bridge via ancestor-scoped compound selector `.react-aria-Select[data-invalid] .select-trigger` |
| Field error visibility | MINOR | `.invalid-feedback` is `display: none` by default; shown only via `.is-invalid ~ .invalid-feedback` / `:invalid ~ .invalid-feedback` sibling selector | `<FieldError>` only mounts in the DOM when invalid — there is no "hidden but present" state to toggle | Override `display: block` unconditionally on `.react-aria-FieldError.invalid-feedback` — existence in the DOM already implies the invalid condition. |
| Selected checkmark | MINOR (M006/M010; resolved via review feedback, see Decisions D3) | No Bootstrap dropdown-item convention for a persistent selected checkmark icon (`.dropdown-item.active` uses bg/color fill only) | `DropdownItem` unconditionally renders a `lucide-react` `<Check>` icon as a sibling when `isSelected` is true (existing structural behavior, not introduced by this taxonomy) | Hide the existing icon (`display: none`) in the Bootstrap-styled context — the Bootstrap target appearance relies on `.dropdown-item.active`'s background/color fill alone, with no checkmark glyph. |
| Size variant padding | MINOR | `.form-select-sm`/`.form-select-lg` use asymmetric `padding-right` to reserve room for a background-image chevron | Trigger has no background-image chevron (see "Trigger caret" row above); chevron is a flex child | Use `.btn-sm`/`.btn-lg`'s symmetric `padding-x` instead of form-select's asymmetric values; rely on flex `gap` for icon clearance (see Variants, "Size"). |
| Trigger validation icon | MINOR (resolved via review feedback, see Decisions D3) | `.form-select.is-valid`/`.is-invalid` embed a validation icon as a `background-image` on the select element itself (`--bs-form-select-bg-icon`), alongside the caret background-image, with `padding-right` reserved for both | React Aria renders no validation-icon element at all; the trigger's caret is already a real flex-child element rather than a background-image (see "Trigger caret" row) | Add a new small flex-child icon element between the value text and the caret, using Bootstrap's exact `--bs-form-select-bg-icon` SVG data URIs (copied byte-for-byte from compiled CSS) as its own `background-image` — green checkmark (`#198754`) for `.is-valid`, red circle-exclamation (`#dc3545`) for `.is-invalid`. Not a background-image layered on `.select-trigger` itself, since that would fight the flex layout used for the caret. |

### Reference story canvas

Stories to write under `Bootstrap Reference/Select`:

1. **Trigger** — closed-state specimens only: `.dropdown` > `.btn.dropdown-toggle.select-trigger` with static chevron. Specimens: Default (placeholder text, muted), Filled (a selected value shown — also needed as context for the Open story per P-005), Hover (`.faux-hover`), Focus (`.faux-focus` — border-color + box-shadow ring, per Decisions D2), Open/Pressed (`.faux-open`, chevron rotated per P-018), Disabled (`disabled` attribute), Invalid (`.is-invalid` + validation icon + adjacent `.invalid-feedback`, per Decisions D3). Each specimen labeled per P-008.
2. **Sizes** — three Filled triggers side by side: Small (`.btn-sm`), Default (no modifier), Large (`.btn-lg`) — demonstrates Decisions D1.
3. **Open** — full assembly: `.dropdown` wrapper with trigger showing a selected value (P-005) and `.dropdown-menu` visibly open below it, reproducing Popover's ancestor/sibling context (P-002). Items inside: Default, Hover (`.faux-hover`), Focused (`.faux-focus-visible`), Selected (background/color fill only, no checkmark — Decisions D3), Disabled. Caret shown rotated (P-018).
4. **Grouped** — Open assembly variant with two `.dropdown-header`-labeled groups separated by `.dropdown-divider`, demonstrating the optional sections variant.
5. **Field states** — Label + trigger + `.form-text` description (Default); Label + trigger + validation icon + `.valid-feedback` (Valid); Label + trigger + validation icon + `.invalid-feedback` (Invalid); disabled field (label + disabled trigger, muted). Valid/Invalid specimens per Decisions D3.

Layout: `display: flex; flex-wrap: wrap` container per P-004, no fixed column count. Width constraint: trigger specimens fixed at a representative width (e.g. 240px) so text truncation/ellipsis is visible; Open specimens sized to fit their `.dropdown-menu` (`min-width: 10rem` Bootstrap default, matched to trigger width per the codebase's existing `--trigger-width` custom-property convention).

### Confidence

**Medium-High.** The Dropdown/Form-Select dual-counterpart resolution is well-grounded: the KB's own `patterns.md` §2.2 already documents this exact CRITICAL conflict and its resolution approach, and the compiled CSS audit (`.btn`, `.form-select`, `.dropdown-menu`, `.dropdown-item`) confirms every token referenced. Two findings were verified directly against the installed `react-aria-components@1.17.0` source (not documentation — the MCP-served docs for this component do not enumerate a full render-props/`data-*` table) rather than inferred: (1) the trigger's open state is signaled via a repurposed `[data-pressed]` (root `[data-open]` is not mirrored to the button), and (2) `[data-invalid]`/`[data-required]` exist only on the root, not the trigger. Both were confirmed by reading `node_modules/react-aria-components/dist/private/Select.mjs` and the corresponding `.d.ts` render-prop interfaces directly — current, installed, first-party source, not deleted or historical content.

One value is intentionally hardcoded rather than tokenized: the trigger's focus border-color (`#86b7fe`), matching `.form-select:focus`/`.form-control:focus`. Bootstrap computes this via a Sass `tint-color()` function at compile time and does not expose it as a `--bs-*` custom property — the literal hex value already exists un-tokenized everywhere else in Bootstrap's compiled CSS, so hardcoding it here is consistent with (not a deviation from) the existing design system, not a new arbitrary value requiring a configurable prop.

**Revision note (review round 2):** The first reference-story submission rendered a checkmark beside selected items and depicted valid/invalid trigger states as a border-color change only. User review feedback corrected both — see Decisions D3. The validation icon SVG data URIs were re-verified against `node_modules/bootstrap/dist/css/bootstrap.css` a second time (grepped independently, byte-for-byte match with the first extraction) before being written into `presentation.scss`.

**Blank-slate note:** No prior taxonomy, reference story, or CSS file existed in the working tree for this component (only `.gitkeep` stubs were present in `agent/taxonomies/`, `stories/react-aria-bootstrap/reference/`, and `agent/artifacts/reference-css/`). Git history, prior commits, and any deleted content were not consulted at any point during this analysis, per blank-slate mode. All conclusions are derived from: the Bootstrap KB (`agent/bootstrap-kb/`), Bootstrap's compiled CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) and vendor SCSS source, the React Aria MCP documentation tool, and the currently-installed `react-aria-components`/`react-aria` package source (current dependency state, not historical).

## Decisions

### D1 — Size variant exposure

**Question:** Bootstrap's Form Select offers `.form-select-sm` and `.form-select-lg` modifier classes (reduced/increased padding, font-size, border-radius). The structural counterpart (Dropdown) has matching `.btn-sm`/`.btn-lg`. React Aria's `Select` component has no `size` prop — there is no React Aria equivalent to bridge to. Per M016 trigger pattern 1 (variant exposure), this must be flagged: should Bootstrap's size variants be exposed as (a) a new `size` prop on the `Select` component, (b) an unstyled passthrough via `className` with no dedicated prop, or (c) excluded from this iteration's scope entirely (default size only)?

**Answer:** Add a dedicated `size` prop on `Select` (`'sm' | 'md' | 'lg'`) that maps to Bootstrap's `.form-select-sm`/`.form-select-lg` classes.

### D2 — Trigger component class (M014 / M019 / M020)

**Question:** M014 identifies a dual-counterpart for the trigger: the structural counterpart (Dropdown, matching React Aria's rendered `<button>`) versus the semantic/visual counterpart (Form Select, matching the component's intended real-world role). Per M020 (one-component-class), exactly one Bootstrap component class may be applied to the trigger element. Which one, and why?

**Answer:** Apply `.btn.dropdown-toggle` (the structural counterpart) as the trigger's component class, since M001 (dom-first) establishes that React Aria renders a `<button>`, not a `<select>` — `.form-select`'s own state-cascade selectors (`:focus`, `:disabled`, `.is-invalid`) target a native `<select>` element type and would never fire on a `<button>`. `.form-select`'s computed token values (border-color, background-color, focus ring, disabled background, validation border colors) are instead applied as CSS custom-property overrides on top of `.btn`'s variable namespace (P-012), so every state rule already defined on `.btn` (`:hover`, `:focus-visible`, `.btn.show`, `:disabled`) resolves to `.form-select`-equivalent visuals automatically rather than `.btn`'s own default (transparent-border, no-background) appearance. The open-state visual (DOM conflict "Trigger open-state signal") is resolved the same way: alias `.btn.show`'s `--bs-btn-active-*` tokens to the same values as the focus-state tokens, since a real `<select>` remains focused while its native picker is open — `.form-select` has no distinct "open" appearance beyond its focus treatment.

### D3 — Selected-item indicator and trigger validation icon (review feedback, round 2)

**Question:** The first reference-story submission (1) rendered a checkmark glyph (`DropdownItem`'s existing `lucide-react` `<Check>` icon) beside selected items in the option list, and (2) depicted valid/invalid trigger states with a border-color change and text feedback only, no icon. Is this the correct Bootstrap target appearance?

**Answer (user review):** No, on both points.

1. **Remove the checkmark from selected items.** Bootstrap's `.dropdown-item` selected/active convention is background/color fill only (`.dropdown-item.active`) — no inline checkmark glyph. The existing `DropdownItem` `<Check>` icon (rendered unconditionally by the shared `ListBox.tsx` component when `isSelected` is true — not introduced by this taxonomy) must be hidden (`display: none`) in the Bootstrap-styled context.
2. **Valid and invalid trigger specimens must include Bootstrap's standard form-validation icons** — a green checkmark for valid, a red circle-exclamation for invalid — matching `.form-select.is-valid`/`.is-invalid`'s embedded `--bs-form-select-bg-icon` exactly (SVG data URIs copied byte-for-byte from the compiled CSS), not just a border-color change. Since the trigger is `.btn`-based (D2) and already carries a real flex-child chevron rather than a background-image caret, the validation icon is reproduced the same way — as its own small flex-child element positioned before the caret — rather than attempting to layer a second background-image onto `.select-trigger` (which would fight the existing flex layout). `.valid-feedback`/`.invalid-feedback` text accompanies the icon, consistent with the existing invalid-feedback treatment.

Cross-component consistency note (M016 trigger pattern 3): `DropdownItem`'s selected-checkmark suppression applies to any future component sharing `ListBox.tsx`'s `DropdownItem` (e.g. ComboBox) — check this resolution for consistency when mapping those components.
