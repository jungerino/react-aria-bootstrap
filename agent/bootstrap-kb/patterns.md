---
what: Bootstrap compound-component structural reference
contains: A selector-pattern taxonomy; how Bootstrap structures compound components (assumed DOM chains); which Bootstrap components have a flat, single-element structure versus a compound one.
when-to-load: When mapping any compound React Aria component to Bootstrap, to see Bootstrap's expected DOM chain before comparing it against React Aria's actual rendered markup.
related: components.md for per-component DOM structure and JS mutations; states.md for state selectors
---

# Bootstrap 5.3.8 Structural Patterns

Sources: Bootstrap docs (getbootstrap.com/docs/5.3/) via WebFetch for compound components whose DOM structure isn't clear from SCSS alone — Input Group, Dropdown, Nav/Tabs, Accordion, Form Select, Form Check (checks-radios) — cross-checked against the component SCSS files already read for `components.md`. Modal and the `.btn-check` toggle pattern are documented directly from their SCSS source (`_modal.scss`, `_buttons.scss`, `forms/_form-check.scss`), since their DOM structure is already clear from source and a WebFetch lookup wasn't needed. Every load-bearing selector cited in Sections 1–2 was additionally verified against the compiled `node_modules/bootstrap/dist/css/bootstrap.css` output, per the Two-source rule.

---

## Section 1: Selector Pattern Taxonomy

The kinds of structural CSS-selector relationships Bootstrap's component CSS relies on. Section 2 entries name a row from this table instead of re-deriving the relationship each time. Every example below is pulled from a component documented in Section 2 and confirmed present in both the SCSS source and the compiled CSS output.

| Pattern | Example | What it structurally requires |
|---|---|---|
| Direct descendant (`.parent > .child`) | `.input-group > .form-control` | Child must be an *immediate* child of parent — any wrapping element inserted between them breaks the match. |
| Nested descendant (`.ancestor .descendant`) | `.accordion-header .accordion-button` | Descendant only needs to exist *somewhere* inside the ancestor's subtree — depth and intervening wrappers don't matter, only ancestry. (In Bootstrap's own markup this pair happens to also be an immediate parent/child, but the selector itself doesn't require that.) |
| Adjacent sibling (`+`) | `.btn-check:checked + .btn` | The two elements must be immediate siblings in that exact order, with nothing between them. |
| General sibling (`~`) | `.form-check-input:disabled ~ .form-check-label` | The target must be a *later* sibling of the reference element under the same parent — any distance apart is fine, but DOM order still matters (the reference element must come first). |
| Pseudo-class stacked with class (`:not(.collapsed)`) | `.accordion-button:not(.collapsed)` | Both the base class and the pseudo-class condition must hold on the *same* element — no ancestor or sibling relationship is involved. |
| Class stacked with class (`.btn.active`) | `.nav-link.active` | Both classes must be present on the *same* single element simultaneously. |
| Attribute selector (`[data-bs-popper]`) | `.dropdown-menu[data-bs-popper]` | The attribute must be present on that specific element. Here it's added by Popper.js at runtime rather than authored in static markup, so the rule only activates once JS positioning engages. |

---

## Section 2: Bootstrap Compound Component Patterns

For each compound component, Bootstrap's CSS assumes a specific DOM chain — classes are written to target specific ancestor/descendant/sibling relationships, so a flattened or reordered structure will not receive the intended styling even if all the right classes are present somewhere in the tree.

**Inclusion criterion:** a component belongs here if any of its CSS selectors depend on a specific ancestor/descendant/sibling *relationship* — not merely on a class being present somewhere in the subtree. The list below is Input Group, Dropdown, Nav/Tabs, Accordion, Form Select, Form Check, plus Modal and the `.btn-check` toggle pattern — two components whose DOM is already obvious from SCSS or a `components.md` snippet, which is not the same as being flat: each still has a load-bearing relational selector, documented below with what specifically breaks if that relationship is violated.

### Input Group

```
.input-group
  > .input-group-text | .form-control | .form-select | .btn | .form-floating   (any mix, flat children)
```
- All children are **direct, flat children** of `.input-group` in a single `display:flex` row — there is no nesting depth beyond one level.
- Border-radius stripping/reassignment on interior edges is done via sibling-position selectors (`:not(:first-child)`, `:not(:last-child)`, `:nth-last-child(n+3)` when `.has-validation` is present) — not via fixed element-type ordering. Any valid child type can appear in any position.
- `z-index` layering on focus (`.form-control:focus` → 5, `.form-select:focus` → 5, `.form-floating:focus-within` → 5, `.btn` → 2 resting / 5 focused) exists specifically so a focused child's border isn't visually clipped by an adjacent sibling's border — this only works because siblings are flat, not nested.
- `.form-floating` can itself be an `.input-group` child, adding one further nesting level *inside* that specific child slot only: `.input-group > .form-floating > .form-control|.form-select + label`.
- **Taxonomy:** direct descendant (`.input-group > .form-control`, Section 1 row 1). **What breaks:** if a child is wrapped in an extra element instead of being a direct child of `.input-group` (e.g. a `<div>` around `.form-control`), the flex-row layout, the sibling-position border-radius rules, and the `> .form-control:focus` z-index rule all stop matching — the wrapped child renders outside the flex row and loses its input-group styling entirely.

### Dropdown

```
.dropdown (position: relative wrapper)
  > .btn.dropdown-toggle[data-bs-toggle="dropdown"][aria-expanded]
  > .dropdown-menu[data-bs-popper]
      > li > .dropdown-item | .dropdown-header | .dropdown-item-text
      > .dropdown-divider
```
- The toggle and the menu are **siblings** under the same `.dropdown` wrapper — the menu is not nested inside the toggle button.
- `<li>` wrapping of `.dropdown-item` is a docs convention for `<ul class="dropdown-menu">`, not CSS-required; `.dropdown-item` styles apply directly to whatever element carries the class (commonly `<a>` or `<button>`).
- `[data-bs-popper]` is added to `.dropdown-menu` only once Popper.js positioning engages — its absence means the menu is using the static CSS fallback position (`top:100%; left:0`).
- **Direction variants** change the wrapper class only (`.dropup`, `.dropend`, `.dropstart`, `.dropup-center`, `.dropdown-center`), not the internal chain — the toggle/menu relationship is identical regardless of direction.
- **Split-button variant** inserts a second `.btn` before the toggle: `.btn-group > .btn (action) + .btn.dropdown-toggle.dropdown-toggle-split[data-bs-toggle="dropdown"] + .dropdown-menu`.
- **Taxonomy:** the toggle/menu relationship is a **direct descendant** pair (`.dropdown > .dropdown-toggle`, `.dropdown > .dropdown-menu`, Section 1 row 1) — there is no sibling-combinator selector joining the two directly; `.dropdown-menu`'s `position: absolute` instead resolves against the shared `.dropdown { position: relative }` ancestor. `[data-bs-popper]` is an **attribute selector** (Section 1 row 7). The split-button insertion is an **adjacent sibling** (Section 1 row 3). **What breaks:** if `.dropdown-menu` is moved outside the `.dropdown` wrapper, it's no longer a descendant of that `position: relative` ancestor, so its `position: absolute` resolves against the next positioned ancestor up the tree instead — the menu detaches from the toggle and renders in the wrong place, even though its own classes are untouched.

### Nav / Tabs (JS-powered)

```
ul.nav.nav-tabs[role="tablist"]
  > li.nav-item[role="presentation"]
      > button.nav-link[role="tab"][data-bs-toggle="tab"][data-bs-target="#{id}"][aria-controls="{id}"][aria-selected]
div.tab-content
  > div.tab-pane.fade[role="tabpanel"][aria-labelledby="{tab-id}"][id="{id}"][tabindex="0"]
```
- Two **separate, sibling trees** — the tab-trigger list (`.nav-tabs`) and the panel container (`.tab-content`) are not nested inside each other; they're linked purely by `data-bs-target`/`id` and `aria-controls`/`aria-labelledby` attribute pairs, not DOM position.
- `.nav-item` (`role="presentation"`) is a structural-only wrapper — the interactive/semantic role (`role="tab"`) lives one level down on `.nav-link`.
- `.tab-pane` uses `.fade` + `.show`/`.active` together for the cross-fade transition between panels (see states.md Expanded/Open and Selected).
- The same `.nav`/`.nav-link` base classes are reused, unchanged, for **Nav Pills** (`.nav-pills`) and **Nav Underline** (`.nav-underline`) — only the modifier class on the `<ul>` and the resulting `--bs-nav-*` CSS-var overrides differ; the tree shape is identical across all three visual variants. **Non-JS nav** (plain navigation, no tabs) drops `.tab-content`/`role="tablist"`/`data-bs-*` entirely and is just `.nav > .nav-item > .nav-link` used as ordinary links.
- **Taxonomy:** `.nav-link.active` is **class stacked with class** (Section 1 row 6). Nav/Tabs is the odd one out in this section: the tab-list↔panel link itself uses no CSS relational selector at all — it's resolved entirely by JS matching `data-bs-target`/`id` and `aria-controls`/`aria-labelledby` attribute values. **What breaks:** relocating `.tab-content` elsewhere in the DOM does *not* break the tab/panel wiring as long as the id references stay intact — unlike every other entry in this section. What *does* break is the active-state visual: if `.active` ends up on a wrapping element instead of the same `<button class="nav-link">` that has `.nav-link`, the class-stacked selector no longer matches and the active-tab styling (per `.nav-tabs`/`.nav-pills`/`.nav-underline` variant) silently fails to apply.

### Accordion

```
div.accordion[id]
  > div.accordion-item
      > h2.accordion-header
          > button.accordion-button[.collapsed]?[data-bs-toggle="collapse"][data-bs-target="#{id}"][aria-expanded][aria-controls="{id}"]
      > div.accordion-collapse.collapse[.show]?[id][data-bs-parent="#{accordion-id}"]
          > div.accordion-body
```
- Exactly **4 nesting levels** deep from `.accordion` to content: item → header → button (trigger) as one branch, item → collapse → body as the sibling branch.
- The trigger (`.accordion-button`) and its panel (`.accordion-collapse`) are **siblings** under `.accordion-item`, connected by `data-bs-target`/`id`, not by nesting the panel inside the button.
- `.accordion-header` wraps only the button, not the panel — it exists purely to give the trigger correct heading semantics (`<h2>`) in the document outline.
- `data-bs-parent="#{accordion-id}"` on each `.accordion-collapse` is what makes sibling items mutually-exclusive (opening one closes the others) — remove it for an independently-toggleable accordion (`.accordion-flush` styling doesn't affect this; it's purely a class-driven behavioral option, not tied to a specific structural variant).
- `.accordion-flush` is a modifier on the outer `.accordion` only — the internal chain is unchanged, it just removes outer borders/radius.
- **Taxonomy:** `.accordion > .accordion-item` is **direct descendant** (Section 1 row 1). `.accordion-header .accordion-button` is written as a **nested descendant** (Section 1 row 2), even though the two happen to be immediate parent/child in Bootstrap's own markup — it appears only inside `:first-of-type`/`:last-of-type`/`.accordion-flush` qualifiers, never as a standalone rule. `.accordion-button:not(.collapsed)` is **pseudo-class stacked with class** (Section 1 row 5) and, critically, is unqualified by any ancestor. **What breaks:** the button's interactive styling — caret rotation, expanded/collapsed color and background, hover/focus — all key off the bare, ancestor-independent `.accordion-button` rule and are unaffected by nesting. The `.accordion-header .accordion-button` descendant chain governs only border-radius correction: the first item's button regaining its rounded top corners, the last (collapsed) item's button regaining rounded bottom corners, and `.accordion-flush` forcing square corners throughout. `.accordion-button`'s own base style already sets `border-radius: 0`, so if it isn't a descendant of `.accordion-header`, only this corner-rounding correction is lost — the button stays square-cornered at the accordion's ends instead of matching the item's own outer rounded border. Every other behavior is untouched.

### Form Select

```
select.form-select
  > option[selected]?
  > option[value]
```
- **Flat, not compound** — despite being a form control that visually resembles a dropdown menu, Bootstrap does not build a custom `.dropdown-menu`-style DOM for it. It's a single native `<select>` with plain `<option>` children; no Bootstrap class touches the options.
- The dropdown arrow and any validation icon are `background-image` layers on the `<select>` element itself (`--bs-form-select-bg-img`, `--bs-form-select-bg-icon` — see tokens.md §10), not separate rendered DOM nodes. This is a meaningful contrast with Dropdown (a **true** compound component with a real `.dropdown-menu` element) — Form Select only *looks* like a compound dropdown-menu pattern from the outside but structurally is not one.
- `[multiple]` and `[size]:not([size="1"])` variants suppress the decorative arrow (`background-image: none`) since a native multi-row listbox rendering makes it meaningless — same flat structure, no additional nodes.
- **Taxonomy:** none of Section 1's rows apply — every rule targets the single `.form-select` element directly, with no ancestor/descendant/sibling relationship anywhere in its CSS. That flatness is exactly why Form Select is included here: it's the deliberate contrast case against Dropdown, not an oversight.

### Form Check / Radio (Checks & Radios)

```
div.form-check[.form-switch]?[.form-check-inline]?[.form-check-reverse]?
  > input.form-check-input[type="checkbox"|"radio"][id][role="switch"]?
  > label.form-check-label[for]
```
- `.form-check-input` and `.form-check-label` are **siblings**, connected only by native `id`/`for` attribute pairing — Bootstrap enforces no parent/child nesting relationship between them (the input is not inside the label, nor vice versa). Visual left-to-right ordering (input, then label) is achieved with `float:left` + negative margin on the input, not DOM order tricks — `.form-check-reverse` flips this via `text-align:right` + `float:right` rather than reordering the DOM.
- `.form-switch` and `.form-check-inline` are modifiers on the **outer wrapper** (`.form-check`) — the internal input/label sibling chain is identical across the checkbox, radio, switch, and inline variants; only the wrapper's modifier classes and the input's `type`/`role` attributes change.
- `role="switch"` (Form Switch) is an author-added ARIA role, not required by Bootstrap's CSS to render correctly — it's the documented accessible-pattern recommendation, not a structural requirement.
- **Taxonomy:** the base input/label connection is `id`/`for` only, with no CSS relational selector at all (comparable to Nav/Tabs' non-positional linking above). The disabled-state visual effect, however, is a **general sibling** selector (Section 1 row 4): `.form-check-input:disabled ~ .form-check-label`. **What breaks:** because that rule uses `~`, `.form-check-label` must be a *later* sibling of `.form-check-input` under the same parent. If the label is placed before the input in DOM order, or an intervening wrapper separates them, `:disabled ~ .form-check-label` no longer matches — the dimmed opacity and `cursor: default` on the label silently fail to apply, even though the input itself is still functionally disabled.

### Modal

```
.modal
  > .modal-dialog
      > .modal-content
          > .modal-header      (sibling)
          > .modal-body        (sibling)
          > .modal-footer      (sibling)
```
- **Exactly 3 nesting levels** from `.modal` to `.modal-content`, with `.modal-header`/`.modal-body`/`.modal-footer` as flat, direct-child siblings inside `.modal-content` (laid out via `.modal-content { display: flex; flex-direction: column }`).
- **Taxonomy:** the `.modal > .modal-dialog > .modal-content` chain is **direct descendant** at each level (Section 1 row 1), but the load-bearing relationship here is *nesting depth itself* — a canonical example distinct from the flat sibling dependencies documented elsewhere in this section.
- **What breaks:** `.modal-dialog` sets `pointer-events: none` — the SCSS source comment states this is deliberate, to "allow clicks to pass through for custom click handling to close modal." `.modal-content` then sets `pointer-events: auto`, with a source comment stating it exists to "counteract the `pointer-events: none`; in the `.modal-dialog`." Collapsing the two levels into one — e.g. applying `.modal-content`'s background/border/`pointer-events: auto` styles directly onto `.modal-dialog` and dropping the extra wrapper — removes this deliberate split: clicks that should pass through the dialog's outer margin to trigger backdrop click-to-close no longer do, because there is no longer an inner element re-enabling `pointer-events: auto` for just the visible content box. `.modal-content` also declares `width: 100%` specifically "to extend the full width of the parent `.modal-dialog`" (per its source comment) — collapsing the level removes the parent whose width it fills, breaking the sizing relationship that `.modal-dialog`'s `--bs-modal-width` size variants (`.modal-sm`, `.modal-lg`, `.modal-xl`) rely on.

### `.btn-check` toggle pattern

```
<input type="checkbox|radio" class="btn-check" id="{id}" ...>
<label class="btn btn-outline-*" for="{id}">...</label>
```
- `.btn-check` is visually hidden on the input itself (`position: absolute; clip: rect(0, 0, 0, 0)`) — the checkbox/radio semantics stay on a real `<input>`, but nothing about it is rendered; the adjacent `.btn`-styled `<label>` is what the user sees and clicks.
- **Taxonomy:** **adjacent sibling** (Section 1 row 3) — `.btn-check:checked + .btn`, `.btn-check:focus-visible + .btn`, and `.btn-check[disabled] + .btn, .btn-check:disabled + .btn` all require `.btn` to be the CSS-adjacent sibling immediately following `.btn-check`.
- **What breaks:** `.btn-check:checked + .btn` will not fire unless the input immediately precedes the label as a sibling. Moving the input elsewhere in the DOM — most commonly nesting it *inside* the label, which looks harmless since the input is invisible anyway — silently breaks the selector with no error: the label keeps rendering as a normal `.btn`, but it never picks up the checked/active toggle styling, because `.btn-check` is no longer adjacent to it in the sibling chain the selector requires.

---

## Section 3: Bootstrap Components With Minimal DOM Structure

These components attach their primary class to a single element, or to a shallow/optional structure — in contrast to Section 2's multi-level compound chains where specific ancestor/descendant/sibling relationships are load-bearing for the CSS to work.

### `.badge`

Single element. `<span class="badge text-bg-primary">New</span>`. No required children, no required wrapper. Optionally nested inside a heading or button (`.btn .badge` gets a `position:relative; top:-1px` correction, but this is a cosmetic nudge, not a structural dependency — the badge works standalone too).

### `.alert`

Single element (a `<div>` with `role="alert"`) plus **optional, unstructured** content-styling classes (`.alert-heading`, `.alert-link`) that can be applied to any descendant, at any depth, with no fixed position requirement — unlike Input Group or Dropdown, there's no sibling-order or specific-child-position dependency. The one semi-structural piece is `.alert-dismissible`, which reserves right-padding and absolutely-positions a `.btn-close` — but the `.btn-close` can be placed anywhere in the markup (position is CSS `absolute`, not flow-dependent).

### `.table`

Structure is entirely native HTML (`<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>`) — Bootstrap adds no custom wrapper elements or custom classes to any cell/row by default. All styling cascades from CSS custom properties set once on `.table` itself down through a single compact universal selector (`.table > :not(caption) > * > *`) that matches any cell regardless of which section (`thead`/`tbody`/`tfoot`) or nesting Ancestor it's under. This is the flattest possible pattern — one class on the root, zero required classes anywhere below it.

### `.progress` / `.progress-bar`

Two-level, but deliberately minimal and rigid: `.progress` (track) directly wraps one or more `.progress-bar` (fill) children — no intermediate wrapper, no optional layers. `.progress-stacked > .progress > .progress-bar` adds exactly one more level for multi-segment bars, still with no optional/variable structure — every level is required and fixed.

### `.breadcrumb` / `.breadcrumb-item`

Two-level and rigid like Progress: `.breadcrumb` (`<ol>`, conventionally) wraps flat `.breadcrumb-item` children (`<li>`, conventionally, but not CSS-required) — no nesting depth variance. The separator between items is a **generated `content:` value** on a `::before` pseudo-element (`.breadcrumb-item + .breadcrumb-item::before`), not a DOM node — so there is nothing to account for structurally between items despite the visual "/" appearing between each one.

### Why this distinction matters for mapping

Section 2 components require verifying that a React Aria component's rendered markup preserves specific ancestor/sibling relationships (e.g., does React Aria's Tabs render a `.tab-content`-equivalent sibling to the tab list, or nest panels differently?) before any Bootstrap class can be trusted to apply its intended visual effect. Section 3 components mostly just need the right class on the right single element or two — there's little/no DOM-shape risk to check.
