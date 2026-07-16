---
what: Bootstrap 5.3.8 component class and DOM structure reference
contains: For each Bootstrap component: primary classes, modifier classes, expected DOM tree, sub-element roles, JS-driven class mutations, cross-references.
when-to-load: During mapping — load the specific component entry, not the whole file. Do not load the entire file into context at once.
related: states.md for state-specific selectors; patterns.md for compound component DOM structure; tokens.md for component-level tokens
---

# Bootstrap 5.3.8 Components

Sources: component SCSS files under `src/scss/vendor/bootstrap-5.3.8/` (read in full per component). For compound components where DOM/ARIA structure is not fully evident from SCSS alone, verified against Bootstrap's official docs (getbootstrap.com/docs/5.3/) via WebFetch: Input Group, Dropdown, Nav/Tabs, Accordion, Form Select, Form Check (checks-radios). Those six entries include a literal HTML example pulled from the live docs page in addition to the SCSS-derived class/token facts.

31 components documented below, in the order listed in the generation skill.

---

## Button

**Primary class:** `.btn`
**Modifier classes:** `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-info`, `.btn-warning`, `.btn-danger`, `.btn-light`, `.btn-dark`, `.btn-link` (8 theme + link = 9 solid variants), `.btn-outline-{primary,secondary,success,info,warning,danger,light,dark}` (8 outline variants), `.btn-sm`, `.btn-lg`, `.btn-check` (hidden native input proxy, not a `.btn` modifier but a sibling pattern), `.active`, `.disabled`, `.show` (dropdown-toggle open state)
**JS mutations:** `.active`/`.show` toggled by Bootstrap JS when the button is a dropdown-toggle whose menu is open, or when driven by a `.btn-check` proxy input's `:checked` state (see states.md Active/Pressed)
**Expected DOM:**
```html
<button type="button" class="btn btn-primary">Button</button>
<!-- or -->
<a class="btn btn-primary" href="#" role="button">Link button</a>
<!-- checkbox/radio-styled toggle button -->
<input type="checkbox" class="btn-check" id="btn-check" autocomplete="off">
<label class="btn btn-outline-primary" for="btn-check">Toggle</label>
```
**Sub-elements:** none — Button is a single-element component (the `.btn` class attaches directly to the interactive element itself: `<button>`, `<a>`, or `<input type="submit/reset/button">`).
**Cross-references:** Button Group (composes multiple `.btn`), Close Button (separate `--bs-btn-close-*` namespace despite the `btn-` prefix), Dropdown (`.dropdown-toggle` is a `.btn` modifier), Input Group (`.btn` can be an input-group addon).

---

## Button Group

**Primary class:** `.btn-group` (horizontal), `.btn-group-vertical`
**Modifier classes:** `.btn-group-sm`, `.btn-group-lg` (re-applies `.btn-sm`/`.btn-lg` to children via `@extend`), `.btn-toolbar` (groups multiple `.btn-group`s), `.dropdown-toggle-split`
**JS mutations:** `.show` added to `.btn-group` when a contained `.dropdown-toggle` button's menu opens (`.btn-group.show .dropdown-toggle` gets an inset active-style box-shadow)
**Expected DOM:**
```html
<div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-primary">Left</button>
  <button type="button" class="btn btn-primary">Middle</button>
  <button type="button" class="btn btn-primary">Right</button>
</div>
```
**Sub-elements:** direct `.btn` children (border-radius stripped from adjacent edges via `:not(:last-child)`/`:nth-child(n+3)` sibling selectors, not per-child modifier classes); nested `.btn-group` for split-button dropdown groups.
**Cross-references:** Button (child element), Dropdown (`.dropdown-toggle-split` pattern for split dropdown buttons), Input Group (`.btn-toolbar .input-group { width: auto }` interaction).

---

## Form Control / Text Input

**Primary class:** `.form-control`
**Modifier classes:** `.form-control-sm`, `.form-control-lg`, `.form-control-plaintext`, `.form-control-color` (color-picker variant), `.is-valid`, `.is-invalid`
**JS mutations:** none inherent to the control itself (validation classes are consumer/JS-snippet applied, not auto-managed by `bootstrap.bundle.js`)
**Expected DOM:**
```html
<input type="text" class="form-control" placeholder="...">
<!-- or -->
<textarea class="form-control"></textarea>
```
**Sub-elements:** `::file-selector-button` pseudo-element (styled only when `type="file"`); `::placeholder`, `::-webkit-date-and-time-value`, `::-webkit-datetime-edit` (browser-specific pseudo-elements for date/file inputs).
**Cross-references:** Input Group (form-control as a flex child), Floating Labels (`.form-floating > .form-control`), Form Label (paired via native `for`/`id`, no Bootstrap-enforced structure), Form Text (help text sibling), states.md Valid/Invalid/Read-only/Disabled sections.

---

## Form Select

**Primary class:** `.form-select`
**Modifier classes:** `.form-select-sm`, `.form-select-lg`, `.is-valid`, `.is-invalid`
**JS mutations:** none (no Bootstrap JS plugin — native `<select>` element)
**Expected DOM** (WebFetch-verified against `getbootstrap.com/docs/5.3/forms/select/`):
```html
<select class="form-select" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
<!-- multiple selection -->
<select class="form-select" multiple aria-label="Multiple select example">...</select>
<!-- fixed visible-row count -->
<select class="form-select" size="3" aria-label="Size 3 select example">...</select>
```
**Sub-elements:** `<option>` children (no Bootstrap class — native element styling only; the dropdown arrow and validation icon are `background-image` layers on the `<select>` itself via `--bs-form-select-bg-img`/`--bs-form-select-bg-icon`, not separate DOM nodes). `[multiple]` and `[size]:not([size="1"])` suppress the arrow icon and reclaim its padding (native multi-row list rendering makes a decorative arrow meaningless).
**Cross-references:** Input Group (form-select as a flex child, same sizing/border-radius treatment as form-control), Floating Labels (`.form-floating > .form-select`), tokens.md's "Form controls — no dedicated `--bs-input-*` namespace" note (form-select is the one form component that *does* expose narrow custom properties).

---

## Form Check (checkbox/radio)

**Primary class:** `.form-check` (wrapper), `.form-check-input` (the `<input>`), `.form-check-label` (the `<label>`)
**Modifier classes:** `.form-check-reverse` (input on the right), `.form-check-inline`, `.is-valid`, `.is-invalid`
**JS mutations:** none (native input; `:checked`/`:indeterminate` are native states, `:indeterminate` is only ever set via JS `el.indeterminate = true`, never an HTML attribute)
**Expected DOM** (WebFetch-verified against `getbootstrap.com/docs/5.3/forms/checks-radios/`):
```html
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="checkDefault">
  <label class="form-check-label" for="checkDefault">Default checkbox</label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1">
  <label class="form-check-label" for="radioDefault1">Default radio</label>
</div>
```
**Sub-elements:** `.form-check-input` and `.form-check-label` are **siblings**, not nested — connected only by native `id`/`for` attribute pairing (Bootstrap enforces no DOM nesting relationship; float/margin CSS on `.form-check-input` positions it to the left of the label visually).
**Cross-references:** Form Switch (adds `.form-switch` to the `.form-check` wrapper, `role="switch"` on the input — same base structure), Button (`.btn-check` reuses the native-input pattern but hides the input entirely and styles the `<label>` as a `.btn`), states.md Checked/Indeterminate sections.

---

## Form Switch

**Primary class:** `.form-switch` (added alongside `.form-check` on the wrapper)
**Modifier classes:** none beyond the base Form Check set (`.form-check-reverse` combines with `.form-switch`)
**JS mutations:** none
**Expected DOM** (WebFetch-verified):
```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault">
  <label class="form-check-label" for="switchCheckDefault">Default switch checkbox input</label>
</div>
```
**Sub-elements:** identical structure to Form Check — `.form-switch` is a wrapper modifier, not a new component tree. `role="switch"` on the input is an author-added ARIA role (Bootstrap's CSS does not require it to render correctly, but it's the documented accessible pattern).
**Cross-references:** Form Check (parent component; Form Switch is purely a CSS/token variant of it — see tokens.md's single `--bs-form-switch-bg` token, distinct from `--bs-form-check-bg`/`--bs-form-check-bg-image`).

---

## Form Range

**Primary class:** `.form-range`
**Modifier classes:** none (no size/variant modifiers)
**JS mutations:** none (native `<input type="range">`)
**Expected DOM:**
```html
<input type="range" class="form-range" min="0" max="5" step="0.5" id="customRange3">
```
**Sub-elements:** `::-webkit-slider-thumb` / `::-moz-range-thumb` (draggable handle), `::-webkit-slider-runnable-track` / `::-moz-range-track` (track) — all browser vendor-prefixed pseudo-elements; no separate DOM nodes exist for thumb/track, they're pure CSS pseudo-element styling on the single `<input>`. Per the SCSS file's own comment: "Vendor-specific rules for pseudo elements cannot be mixed. As such, there are no shared styles for focus or active states on prefixed selectors" — each vendor prefix needs its own duplicated ruleset.
**Cross-references:** none within the 31-component scope (range is visually and structurally independent of Form Control/Select/Check).

---

## Input Group

**Primary class:** `.input-group`
**Modifier classes:** `.input-group-text` (addon), `.input-group-sm`, `.input-group-lg`, `.has-validation` (adjusts corner-radius selectors when a validation feedback message is also a flex child)
**JS mutations:** none
**Expected DOM** (WebFetch-verified against `getbootstrap.com/docs/5.3/forms/input-group/`):
```html
<div class="input-group mb-3">
  <span class="input-group-text" id="basic-addon1">@</span>
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
</div>
<!-- button addon -->
<div class="input-group mb-3">
  <button class="btn btn-outline-secondary" type="button" id="button-addon1">Button</button>
  <input type="text" class="form-control" aria-label="Example text with button addon" aria-describedby="button-addon1">
</div>
```
**Sub-elements:** flat flex-row of direct children — any mix of `.input-group-text`, `.form-control`, `.form-select`, `.btn`, `.form-floating` is valid; Bootstrap's CSS strips/reassigns `border-radius` on interior edges purely via sibling-position selectors (`:not(:last-child)`, `:not(:first-child)`), not via a fixed tag-order requirement. `z-index` is bumped on `:focus`/`:focus-within` (5) and on `.btn` (2, or 5 focused) so the focused/interactive child's border isn't visually clipped by neighbors.
**Cross-references:** Form Control, Form Select, Button (all valid addon/content children), Floating Labels (`.form-floating` can be an input-group child), states.md Valid/Invalid (`.input-group > .form-control:not(:focus).is-invalid` z-index bump).

---

## Floating Labels

**Primary class:** `.form-floating`
**Modifier classes:** none (wrapper-only; the floating behavior applies automatically to any `.form-control`/`.form-control-plaintext`/`.form-select` child)
**JS mutations:** none — purely CSS-driven via `:placeholder-shown`/`:focus` (see states.md)
**Expected DOM:**
```html
<div class="form-floating">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div>
```
**Sub-elements:** `<label>` is a **sibling** of the control (not wrapping it), positioned absolutely and animated via `transform` when the control is focused or non-empty (`:not(:placeholder-shown)`). Requires a non-empty `placeholder` attribute on the control even though the placeholder text itself is made `color: transparent` — the placeholder's mere *presence* is what the `:placeholder-shown` pseudo-class keys off.
**Cross-references:** Form Control, Form Select (both valid children), Input Group (`.form-floating` can itself be an input-group child), states.md Placeholder shown section.

---

## Form Label

**Primary class:** `.form-label`
**Modifier classes:** `.col-form-label`, `.col-form-label-sm`, `.col-form-label-lg` (variants for horizontal/grid-aligned forms, matching form-control padding instead of block spacing)
**JS mutations:** none
**Expected DOM:**
```html
<label for="exampleInput" class="form-label">Email address</label>
```
**Sub-elements:** none — single-element component, a plain `<label>` with the class applied.
**Cross-references:** Form Control, Form Select, Form Check Label (`.form-check-label` is a related-but-separate class scoped specifically to check/radio, not `.form-label`).

---

## Form Text

**Primary class:** `.form-text`
**Modifier classes:** none
**JS mutations:** none
**Expected DOM:**
```html
<div id="passwordHelpBlock" class="form-text">
  Your password must be 8-20 characters long.
</div>
```
**Sub-elements:** none — single-element, typically a `<div>` or `<small>`, connected to its control only via `aria-describedby` (author-managed, not Bootstrap-enforced).
**Cross-references:** Form Control (`aria-describedby` pairing), Form Feedback (`.valid-feedback`/`.invalid-feedback` are a visually similar but functionally distinct class from `mixins/_forms.scss`, shown/hidden by validation state rather than always visible).

---

## Dropdown

**Primary class:** `.dropdown` (wrapper), `.dropdown-menu` (the popup), `.dropdown-toggle` (trigger modifier on a `.btn`), `.dropdown-item` (menu entry)
**Modifier classes:** `.dropup`, `.dropend`, `.dropstart`, `.dropup-center`, `.dropdown-center` (direction variants on the wrapper), `.dropdown-menu-{bp}-start/-end` (responsive alignment), `.dropdown-menu-dark`, `.dropdown-divider`, `.dropdown-header`, `.dropdown-item-text`, `.dropdown-toggle-split`, `.show` (open state), `.active`/`.disabled` on `.dropdown-item`
**JS mutations:** `.show` added to both `.dropdown-menu` (`display:block`) and the wrapper `.dropdown`/`.btn-group` (box-shadow on the toggle); `[data-bs-popper]` attribute added to `.dropdown-menu` when Popper.js positioning is active (switches from static CSS positioning to inline-style Popper positioning); `aria-expanded` toggled `true`/`false` on the toggle button.
**Expected DOM** (WebFetch-verified against `getbootstrap.com/docs/5.3/components/dropdowns/`):
```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown button
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
  </ul>
</div>
```
**Sub-elements:** `.dropdown-toggle` (the `.btn` that opens the menu — a modifier class, not a separate element type), `.dropdown-menu` (positioned `absolute`, `display:none` until `.show`), `.dropdown-item` (individual `<a>`/`<button>` entries, `<li>` wrapping is a docs convention, not CSS-required — `.dropdown-item` styles apply directly regardless of `<li>` presence), `.dropdown-divider` (an `<hr>`-like separator, see Separator/Divider entry), `.dropdown-header` (non-interactive section label).
**Cross-references:** Button (`.dropdown-toggle` is applied to a `.btn`), Button Group (`.btn-group.show .dropdown-toggle`), Nav/Tabs (`.nav-item.show .nav-link` shares the same open-state concept for a nav-item containing a dropdown), Navbar (`.navbar-nav .dropdown-menu { position: static }` override), patterns.md for the full compound DOM chain.

---

## Nav / Tabs

**Primary class:** `.nav` (base flex list), `.nav-link` (individual item), `.nav-tabs`/`.nav-pills`/`.nav-underline` (visual variant added alongside `.nav`), `.tab-content`/`.tab-pane` (JS-tab content panes)
**Modifier classes:** `.nav-item` (docs convention wrapper, optional), `.nav-fill`, `.nav-justified`, `.active`, `.disabled`, `.show` (nav-item with open dropdown)
**JS mutations:** `.active` toggled on `.nav-link` and its paired `.tab-pane` by the Tab plugin; `aria-selected` toggled `true`/`false`; `.fade`/`.show` combination on `.tab-pane` for the cross-fade transition.
**Expected DOM** (WebFetch-verified against `getbootstrap.com/docs/5.3/components/navs-tabs/`, JS-powered Tabs variant):
```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
            type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
            type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">...</div>
  <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">...</div>
</div>
```
**Sub-elements:** `.nav-item` (`role="presentation"`, purely structural — the interactive semantics live on `.nav-link` via `role="tab"`), `.nav-link` (the trigger, can be `<a>` or `<button>` — Bootstrap CSS doesn't care which tag), `.tab-content` > `.tab-pane` (`role="tabpanel"`, hidden via `display:none` unless `.active`).
**Cross-references:** Navbar (`.navbar-nav` is a `.nav` variant with its own CSS-var-overridden `--bs-nav-link-*` scope), Dropdown (a `.nav-item` can contain a `.dropdown`), Pagination (visually distinct but conceptually similar "list of link-styled items" pattern), Card (`.card-header-tabs`/`.card-header-pills` re-style `.nav-tabs`/`.nav-pills` for use inside a card header).

---

## Navbar

**Primary class:** `.navbar`
**Modifier classes:** `.navbar-brand`, `.navbar-nav` (a `.nav` variant scoped to the navbar), `.navbar-text`, `.navbar-collapse`, `.navbar-toggler`, `.navbar-toggler-icon`, `.navbar-nav-scroll`, `.navbar-expand`/`.navbar-expand-{sm,md,lg,xl,xxl}` (responsive collapse breakpoint), `.navbar-dark` (deprecated in favor of `data-bs-theme="dark"` on the navbar itself; `.navbar-light` is fully deprecated as of v5.2.0 per an explicit `@include deprecate(...)` call in the SCSS)
**JS mutations:** shares the Collapse plugin's `.collapse`/`.collapsing`/`.show` triad on `.navbar-collapse`; `aria-expanded` toggled on `.navbar-toggler`.
**Expected DOM:**
```html
<nav class="navbar navbar-expand-lg" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>
```
**Sub-elements:** `.navbar-brand` (logo/site name), `.navbar-toggler` + `.navbar-toggler-icon` (mobile hamburger button, hidden above the `.navbar-expand-*` breakpoint via `display:none`), `.navbar-collapse` (the collapsible content wrapper, reuses `.collapse`), `.navbar-nav` (a `.nav` with navbar-scoped `--bs-nav-link-*` CSS-var overrides pointing at `--bs-navbar-*` tokens), `.navbar-text`, `.navbar-nav-scroll` (constrains max-height with overflow scroll).
**Cross-references:** Nav/Tabs (`.navbar-nav` is a `.nav` variant), Dropdown (`.navbar-nav .dropdown-menu { position: static }` — a navbar-specific override), Container (`.navbar > .container*` gets flex properties re-declared since flex isn't inherited by non-flex children automatically), Offcanvas (`.navbar-expand-*` has explicit CSS to neutralize an `.offcanvas` used as the collapse target at wide viewports).

---

## List Group

**Primary class:** `.list-group`
**Modifier classes:** `.list-group-item` (entry), `.list-group-item-action` (interactive/hoverable entry), `.list-group-numbered`, `.list-group-horizontal`/`.list-group-horizontal-{bp}`, `.list-group-flush`, `.list-group-item-{primary,secondary,success,info,warning,danger,light,dark}` (8 contextual color variants), `.active`, `.disabled`
**JS mutations:** none inherent (no dedicated List Group JS plugin; `.active` is author/app-managed unless composed with Tabs, in which case the Tab plugin manages it)
**Expected DOM:**
```html
<ul class="list-group">
  <li class="list-group-item active" aria-current="true">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item disabled" aria-disabled="true">Morbi leo risus</li>
</ul>
```
**Sub-elements:** `.list-group-item` children (any tag — `<li>`, `<div>`, `<a>`, `<button>`; interactive variants use `<a>`/`<button>` plus `.list-group-item-action` for hover/focus/active affordances). `.list-group-numbered` adds a CSS `counter()` pseudo-element (`::before`) rather than requiring literal numbering in markup.
**Cross-references:** Card (`.card > .list-group` gets border-radius inheritance treatment), Dropdown/Nav (structurally similar "list of interactive items" pattern, but a separate token namespace).

---

## Breadcrumb

**Primary class:** `.breadcrumb`
**Modifier classes:** `.breadcrumb-item`, `.active` (on the current/last `.breadcrumb-item`)
**JS mutations:** none
**Expected DOM:**
```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Library</a></li>
    <li class="breadcrumb-item active" aria-current="page">Data</li>
  </ol>
</nav>
```
**Sub-elements:** `.breadcrumb-item` children; the separator (`/` by default) is a CSS `content:` value on `.breadcrumb-item + .breadcrumb-item::before` — not a DOM node, and not literally typed into markup.
**Cross-references:** none within scope (visually/structurally standalone; shares only the generic `--bs-secondary-color` token family with other components).

---

## Pagination

**Primary class:** `.pagination`
**Modifier classes:** `.page-item`, `.page-link`, `.pagination-sm`, `.pagination-lg`, `.active`, `.disabled`
**JS mutations:** none (fully static; no Bootstrap JS plugin)
**Expected DOM:**
```html
<nav aria-label="...">
  <ul class="pagination">
    <li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>
    <li class="page-item active" aria-current="page"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
```
**Sub-elements:** `.page-item` (`<li>`, structural) > `.page-link` (`<a>` or `<span>`, the actual styled/interactive surface — `.active`/`.disabled` can be applied to either the `.page-item` wrapper or directly on `.page-link`, both selector forms exist: `.page-link.active, .active > .page-link`).
**Cross-references:** Nav/Tabs (conceptually similar "row of link items" pattern, separate token namespace), List Group (shares the active/disabled/hover triad pattern in structure though not token names).

---

## Accordion

**Primary class:** `.accordion`
**Modifier classes:** `.accordion-item`, `.accordion-header`, `.accordion-button`, `.accordion-collapse`, `.accordion-body`, `.accordion-flush`, `.collapsed` (on `.accordion-button`, marks closed state)
**JS mutations:** `.collapsed` added/removed on `.accordion-button`; `.collapse`/`.collapsing`/`.show` triad (shared with the generic Collapse plugin, see `_transitions.scss`) on `.accordion-collapse`; `aria-expanded` toggled on the button; `data-bs-parent` (author-set, not JS-mutated) restricts accordion behavior to one-open-at-a-time within the same `#id` group.
**Expected DOM** (WebFetch-verified against `getbootstrap.com/docs/5.3/components/accordion/`):
```html
<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">...</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Accordion Item #2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">...</div>
    </div>
  </div>
</div>
```
**Sub-elements:** `.accordion-item` (one collapsible section) > `.accordion-header` (`<h2>`, wraps the trigger for document-outline purposes) > `.accordion-button` (the clickable trigger, styles depend on `:not(.collapsed)` for the "currently open" look — see states.md Collapsed) + sibling `.accordion-collapse` (`id`-targeted by the button's `data-bs-target`) > `.accordion-body` (padding wrapper for the actual content).
**Cross-references:** states.md's Collapsed section (full `.collapsed`/`.collapse`/`.collapsing`/`.show` mechanics), patterns.md (full compound DOM chain), Card (accordion items visually resemble stacked cards but share no CSS classes with `.card`).

---

## Modal

**Primary class:** `.modal`
**Modifier classes:** `.modal-dialog`, `.modal-content`, `.modal-header`, `.modal-title`, `.modal-body`, `.modal-footer`, `.modal-backdrop`, `.modal-dialog-scrollable`, `.modal-dialog-centered`, `.modal-sm`/`.modal-lg`/`.modal-xl`, `.modal-fullscreen`/`.modal-fullscreen-{bp}-down`, `.modal-static` (shake-to-indicate-blocked feedback), `.fade`, `.show`
**JS mutations:** `.show` added to `.modal` and `.modal-backdrop` on open (`display:block` is set inline by JS on `.modal`, since the base CSS default is `display:none` with no CSS-only way to reveal it — unlike Dropdown/Collapse, Modal's open/close visibility toggle is JS-driven, not purely `.show`-class-driven, though `.show` still drives the opacity/transform transition); `.modal-open` added to `<body>`; `aria-hidden`/`aria-modal` toggled on `.modal`.
**Expected DOM:**
```html
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">...</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
```
**Sub-elements:** `.modal` (fixed full-viewport scroll container, `--bs-modal-*` tokens live here, not on `.modal-content`) > `.modal-dialog` (positioning shell, `pointer-events:none` so backdrop clicks pass through) > `.modal-content` (the actual visible bordered/shadowed box) > `.modal-header`/`.modal-body`/`.modal-footer`. `.modal-backdrop` is a **sibling** of `.modal` at the body level, not a descendant (separate full-viewport overlay element).
**Cross-references:** Offcanvas (shares `.modal-content-border-*`-derived tokens for backdrop, `--bs-backdrop-*` namespace), Close Button (`.btn-close` in the header), states.md Expanded/Open section.

---

## Offcanvas

**Primary class:** `.offcanvas` (+ responsive variants `.offcanvas-sm`/`-md`/`-lg`/`-xl`/`-xxl`, each with its own breakpoint-scoped behavior)
**Modifier classes:** `.offcanvas-start`, `.offcanvas-end`, `.offcanvas-top`, `.offcanvas-bottom` (placement), `.offcanvas-header`, `.offcanvas-title`, `.offcanvas-body`, `.offcanvas-backdrop`, `.showing`/`.hiding` (transient transition-state classes distinct from `.show`)
**JS mutations:** `.showing` (transient, entrance transition), `.show` (rest-open state), `.hiding` (transient, exit transition) all toggled by the Offcanvas plugin; `aria-hidden`/`aria-modal` toggled; `.offcanvas-backdrop` inserted/removed from the DOM.
**Expected DOM:**
```html
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">...</div>
</div>
```
**Sub-elements:** `.offcanvas-header` (title + close button) and `.offcanvas-body` (scrollable content) are direct children of `.offcanvas` — no intermediate "dialog"/"content" wrapper layer the way Modal has (`.modal-dialog` > `.modal-content`); Offcanvas is flatter.
**Cross-references:** Modal (shares backdrop mechanics and `.showing`/`.hiding`/`.show` transition pattern, though Modal only uses `.fade`/`.show`), Close Button, Navbar (`.navbar-expand-*` neutralizes an `.offcanvas` used as the navbar's collapse target above the breakpoint — see Navbar entry).

---

## Popover

**Primary class:** `.popover`
**Modifier classes:** `.popover-header`, `.popover-body`, `.popover-arrow`, `.bs-popover-{top,bottom,start,end,auto}` (placement, JS-applied), `.bs-popover-auto` (Popper-driven auto-placement, resolves to one of the four directional classes via `[data-popper-placement^=...]` attribute selectors)
**JS mutations:** entire `.popover` element is inserted into/removed from the DOM by the Popover plugin (it does not exist in static markup — only a `data-bs-toggle="popover"` trigger element does); placement class and `[data-popper-placement]` attribute set by Popper.js.
**Expected DOM (JS-generated, not authored):**
```html
<!-- Trigger, authored -->
<button type="button" class="btn btn-secondary" data-bs-toggle="popover" data-bs-title="Popover title" data-bs-content="Content">Click</button>
<!-- Popover itself, JS-inserted on trigger -->
<div class="popover bs-popover-top" role="tooltip" data-popper-placement="top">
  <div class="popover-arrow"></div>
  <h3 class="popover-header">Popover title</h3>
  <div class="popover-body">Content</div>
</div>
```
**Sub-elements:** `.popover-arrow` (pointer triangle, built from `::before`/`::after` pseudo-elements, not a nested visible child), `.popover-header` (optional — `&:empty { display:none }`), `.popover-body`.
**Cross-references:** Tooltip (near-identical structure and JS-generation pattern, but Popover adds an optional header and supports richer HTML content), patterns.md (JS-inserted-element pattern, distinct from author-written compound DOM).

---

## Tooltip

**Primary class:** `.tooltip`
**Modifier classes:** `.tooltip-arrow`, `.tooltip-inner`, `.bs-tooltip-{top,bottom,start,end,auto}`, `.show` (opacity transition target)
**JS mutations:** entire `.tooltip` element is JS-inserted/removed exactly like Popover (not present in static markup — only the `data-bs-toggle="tooltip"` trigger is authored); `.show` toggled for the opacity fade-in.
**Expected DOM (JS-generated):**
```html
<!-- Trigger, authored -->
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-title="Tooltip text">Hover</button>
<!-- Tooltip itself, JS-inserted -->
<div class="tooltip bs-tooltip-top show" role="tooltip" data-popper-placement="top">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner">Tooltip text</div>
</div>
```
**Sub-elements:** `.tooltip-arrow` (pseudo-element-built pointer), `.tooltip-inner` (the text content box — no header sub-element, unlike Popover).
**Cross-references:** Popover (structurally near-identical, Tooltip is the simpler/text-only sibling), patterns.md.

---

## Alert

**Primary class:** `.alert`
**Modifier classes:** `.alert-{primary,secondary,success,info,warning,danger,light,dark}` (8 contextual variants), `.alert-dismissible`, `.alert-heading`, `.alert-link`, `.fade`, `.show`
**JS mutations:** `.show` removed (and the element eventually removed from the DOM entirely, after the `.fade` opacity transition) by the Alert plugin's dismiss behavior, triggered via `data-bs-dismiss="alert"` on a close button.
**Expected DOM:**
```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
```
**Sub-elements:** none required beyond content — `.alert-heading` and `.alert-link` are content-styling modifiers (typically on `<h4>`/`<a>`) rather than structural sub-components; `.btn-close` is the optional dismiss trigger for `.alert-dismissible`.
**Cross-references:** Close Button (`.btn-close` dismiss trigger), Badge (shares the 8-theme-color modifier-class pattern), tokens.md §4 (Alert variants consume the `-text-emphasis`/`-bg-subtle`/`-border-subtle` triad directly).

---

## Badge

**Primary class:** `.badge`
**Modifier classes:** the 8 theme-color text/background utility classes are applied externally (`.text-bg-primary`, etc. from `helpers/_color-bg.scss` — Badge has no dedicated `.badge-{color}` modifier classes of its own in 5.3.8, unlike Alert/List Group/Button, which do)
**JS mutations:** none
**Expected DOM:**
```html
<span class="badge text-bg-primary">New</span>
<!-- badge inside a heading or button -->
<button type="button" class="btn btn-primary">
  Notifications <span class="badge text-bg-secondary">4</span>
</button>
```
**Sub-elements:** none — single-element, typically `<span>`.
**Cross-references:** Alert (shares the "8-theme-color contextual variant" concept, but via a different class-application mechanism — utility class vs. dedicated modifier), Button (`.btn .badge { position:relative; top:-1px }` positioning correction when nested inside a button).

---

## Progress

**Primary class:** `.progress` (track/container), `.progress-bar` (fill)
**Modifier classes:** `.progress-stacked` (shares the same CSS-var block as `.progress`, for multi-segment progress), `.progress-bar-striped`, `.progress-bar-animated`
**JS mutations:** none (fully static/CSS; width is typically set via inline `style="width: N%"` or `aria-valuenow`, author-managed, not a Bootstrap JS plugin)
**Expected DOM:**
```html
<div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 25%"></div>
</div>
```
**Sub-elements:** `.progress-bar` — single required child representing the filled portion; `.progress-stacked > .progress > .progress-bar` for multi-segment bars (nested `.progress` elements, each becoming one segment).
**Cross-references:** none within scope (standalone; only tokens.md-level relationship via shared `--bs-box-shadow-inset`).

---

## Spinner

**Primary class:** `.spinner-border`, `.spinner-grow` (two visually distinct animation variants, same DOM shape)
**Modifier classes:** `.spinner-border-sm`, `.spinner-grow-sm`, `.visually-hidden` (typically applied to an inner status-text span, not the spinner itself)
**JS mutations:** none
**Expected DOM:**
```html
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
```
**Sub-elements:** an inner text node (commonly wrapped in `.visually-hidden`) providing an accessible name for `role="status"` — not a Bootstrap-defined sub-element class, just a convention shown in the docs.
**Cross-references:** Screen reader utility (`.visually-hidden`, utilities.md §18).

---

## Toast

**Primary class:** `.toast`
**Modifier classes:** `.toast-container`, `.toast-header`, `.toast-body`, `.showing`, `.show`, `.fade` (toast typically omits `.fade` by default per docs example, unlike Modal/Alert which include it — presence is author-controlled)
**JS mutations:** `.showing` (transient) and `.show` toggled by the Toast plugin; the base rule `.toast:not(.show) { display:none }` means `.show` is required for any visibility at all (stricter than Alert, which only fades opacity).
**Expected DOM:**
```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">Hello, world! This is a toast message.</div>
  </div>
</div>
```
**Sub-elements:** `.toast-container` (positioning wrapper for one or more toasts — not required if a toast is manually positioned), `.toast-header` (optional, contains dismiss `.btn-close`), `.toast-body`.
**Cross-references:** Close Button (`.btn-close` dismiss trigger), Alert (conceptually similar dismissible-notification pattern, different visibility mechanics).

---

## Card

**Primary class:** `.card`
**Modifier classes:** `.card-body`, `.card-title`, `.card-subtitle`, `.card-text`, `.card-link`, `.card-header`, `.card-footer`, `.card-header-tabs`, `.card-header-pills`, `.card-img`/`.card-img-top`/`.card-img-bottom`, `.card-img-overlay`, `.card-group`
**JS mutations:** none (fully static component)
**Expected DOM:**
```html
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text.</p>
    <a href="#" class="card-link">Card link</a>
  </div>
</div>
```
**Sub-elements:** `.card-header`/`.card-footer` (optional caps, first/last-child get corner-radius via `:first-child`/`:last-child`, not fixed position requirement), `.card-body` (main content wrapper — a card can contain multiple `.card-body`/`.card-header`/list-group blocks stacked directly as children), `.card-img-top`/`.card-img-bottom` (edge-to-edge images, corner-radius-aware), `.card-img-overlay` (absolute-positioned overlay for text-on-image cards).
**Cross-references:** List Group (`.card > .list-group` gets special border-inheritance treatment), Nav/Tabs (`.card-header-tabs`/`.card-header-pills` restyle `.nav-tabs`/`.nav-pills` to fit a card header), Close Button (`.card-header .btn-close` composition, not defined in `_card.scss` itself but a common pattern).

---

## Table

**Primary class:** `.table`
**Modifier classes:** `.table-striped`, `.table-striped-columns`, `.table-hover`, `.table-active`, `.table-bordered`, `.table-borderless`, `.table-sm`, `.table-responsive`/`.table-responsive-{bp}`, `.table-group-divider`, `.caption-top`, `.table-{primary,secondary,success,info,warning,danger,light,dark}` (8 contextual row/cell variants via `mixins/_table-variants.scss`)
**JS mutations:** none (fully static)
**Expected DOM:**
```html
<table class="table table-striped">
  <thead>
    <tr><th scope="col">#</th><th scope="col">Name</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">1</th><td>Mark</td></tr>
  </tbody>
</table>
```
**Sub-elements:** native `<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>`/`<caption>` — Bootstrap adds no custom classes to these by default; all cell styling flows down from `.table` via CSS-var cascade (`--bs-table-color-type`/`--bs-table-bg-type` reset chain documented in tokens.md §10). The universal-selector rule `> :not(caption) > * > *` targets `th`/`td` regardless of thead/tbody/tfoot ancestry with a single compact selector.
**Cross-references:** Card (a table is a common `.card-body` child, no special integration classes needed), tokens.md §10 Table entry for the `-type`/`-state` CSS-var precedence chain.

---

## Close Button

**Primary class:** `.btn-close`
**Modifier classes:** `.btn-close-white` (forces the invert-filter used automatically in dark mode, for use on a light-on-dark surface within an otherwise light-themed page)
**JS mutations:** none inherent to the button itself; `data-bs-dismiss="{modal|alert|offcanvas|toast}"` (author-set attribute, not JS-mutated) is what each host component's plugin listens for to trigger its own dismiss behavior.
**Expected DOM:**
```html
<button type="button" class="btn-close" aria-label="Close"></button>
```
**Sub-elements:** none — single empty `<button>`, the "X" glyph is a `background-image` (inline SVG data-URI), not text content or a child icon element. `aria-label="Close"` is required since the button has no visible text.
**Cross-references:** Modal, Offcanvas, Toast, Alert (all use `.btn-close` as their dismiss trigger); tokens.md's Close Button entry (`--bs-btn-close-*` namespace, easily confused with Button's `--bs-btn-*` due to shared prefix but fully separate).

---

## Separator/Divider

**Primary class:** none single — this is a concept covered by three distinct, unrelated Bootstrap mechanisms:
1. **`<hr>`** (Reboot-styled native element, no Bootstrap class required) — `margin: $hr-margin-y 0; border-top: var(--bs-border-width) solid; opacity: .25` (color inherits from context via `color: inherit` + `border-color: currentcolor` pattern).
2. **`.dropdown-divider`** — an `<hr>`-like horizontal rule purpose-built for inside `.dropdown-menu` (see Dropdown entry): `height:0; margin: var(--bs-dropdown-divider-margin-y) 0; border-top: 1px solid var(--bs-dropdown-divider-bg); opacity:1`.
3. **`.vr`** (`helpers/_vr.scss`) — a *vertical* rule for inline/flex contexts: `display:inline-block; align-self:stretch; width: var(--bs-border-width); min-height:1em; background-color: currentcolor; opacity: .25`.

**Modifier classes:** none for any of the three.
**JS mutations:** none.
**Expected DOM:**
```html
<hr>
<!-- inside a dropdown -->
<ul class="dropdown-menu"><li><hr class="dropdown-divider"></li></ul>
<!-- inline vertical rule, e.g. in a toolbar -->
<div class="vr"></div>
```
**Sub-elements:** none — all three are single, content-free elements.
**Cross-references:** Dropdown (`.dropdown-divider` is scoped for use there), tokens.md §7 Border tokens (`hr` consumes `--bs-border-width`/`border-color` generically, no dedicated token namespace of its own — confirmed by the absence of any `--bs-hr-*` token in the compiled-CSS grep for tokens.md).

---

### Component count

31 components documented above, matching the skill's required list exactly.
