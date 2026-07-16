---
what: Bootstrap Knowledge Base master index and retrieval guide
contains: Component index; utility category index; token category index; cross-reference hints; retrieval rules.
when-to-load: ALWAYS load this file first. It is the entry point for all KB lookups.
related: All other files in agent/bootstrap-kb/
---

# Bootstrap 5.3.8 Knowledge Base

This knowledge base documents **Bootstrap's own CSS, DOM, and JS behavior only** — no React Aria bridging strategy, resolution, or "no bridge needed" conclusion is recorded anywhere in these five files. That judgment belongs to Stage 4 (`agent/mapping-and-references-skill/`), made per-component with its own source verification.

Generated from two sources, cross-checked for every entry (the "Two-source rule"):
- **SCSS source:** `src/scss/vendor/bootstrap-5.3.8/` — token names, variable defaults, source structure
- **Compiled CSS:** `node_modules/bootstrap/dist/css/bootstrap.css` — the complete, authoritative selector surface, including mixin-generated selectors that never appear as literal strings in SCSS

---

## Retrieval Rules

```
"What --bs-* token controls X?"                        → tokens.md
"What utility class does Y?"                            → utilities.md
"What state selector does Bootstrap use for Z?"          → states.md
"What DOM structure does Bootstrap's Accordion expect?"  → components.md#accordion
"What DOM chain does Bootstrap's dropdown/Select pattern expect?" → patterns.md
"What modifier classes does .btn have?"                  → components.md#button
```

Additional rules specific to this KB's content:
```
"Does component X expose a --bs-X-* custom property namespace?"     → tokens.md §10 (check before assuming — Form Control/Range/Input Group/Floating Labels/Labels/Form Text do NOT; Form Select/Form Check only partially do)
"Is this selector a literal SCSS string or a mixin-generated compound?" → states.md (Valid/Invalid sections document the compiled-CSS-only compound selectors explicitly)
"Is this Bootstrap component compound (multi-level DOM) or flat/minimal?" → patterns.md §1 vs §2
```

---

## Bootstrap Component Index

Alphabetical. "See also" notes cross-component relationships (shared token namespace, structural composition, or easily-confused naming).

- **Accordion** (`components.md#accordion`) — see also: Card (visually similar, no shared classes), patterns.md compound chain
- **Alert** (`components.md#alert`) — see also: Close Button (dismiss trigger), Badge (shares 8-theme-color variant concept)
- **Badge** (`components.md#badge`) — see also: Button (nesting position correction), Alert
- **Breadcrumb** (`components.md#breadcrumb`) — see also: patterns.md §2 (minimal structure)
- **Button** (`components.md#button`) — see also: Close Button (separate `--bs-btn-close-*` namespace despite shared `btn-` prefix — do not conflate), Button Group, Dropdown (`.dropdown-toggle` modifier)
- **Button Group** (`components.md#button-group`) — see also: Button, Dropdown (split-button pattern)
- **Card** (`components.md#card`) — see also: List Group (`.card > .list-group` border inheritance), Nav/Tabs (`.card-header-tabs`/`.card-header-pills`)
- **Close Button** (`components.md#close-button`) — see also: Button (naming collision on `--bs-btn-close-*` vs `--bs-btn-*`), Modal/Offcanvas/Toast/Alert (all use it as dismiss trigger)
- **Dropdown** (`components.md#dropdown`) — see also: Button (`.dropdown-toggle`), Button Group, Nav/Tabs (`.nav-item.show`), Navbar (`position:static` override), patterns.md compound chain
- **Floating Labels** (`components.md#floating-labels`) — see also: Form Control, Form Select, Input Group, states.md Placeholder shown
- **Form Check (checkbox/radio)** (`components.md#form-check-checkboxradio`) — see also: Form Switch (same structure, modifier only), Button (`.btn-check` proxy pattern), states.md Checked/Indeterminate
- **Form Control / Text Input** (`components.md#form-control--text-input`) — see also: tokens.md's "no `--bs-input-*` namespace" note (important — do not assume this token family exists)
- **Form Label** (`components.md#form-label`) — see also: Form Check Label (separate, scoped class — not interchangeable)
- **Form Range** (`components.md#form-range`) — standalone, no cross-references within scope
- **Form Select** (`components.md#form-select`) — see also: patterns.md (flat structure — looks like a compound dropdown but is not one), Input Group
- **Form Switch** (`components.md#form-switch`) — see also: Form Check (parent component)
- **Form Text** (`components.md#form-text`) — see also: Form Control (`aria-describedby` pairing, author-managed)
- **Input Group** (`components.md#input-group`) — see also: Form Control, Form Select, Button, Floating Labels, patterns.md compound chain
- **List Group** (`components.md#list-group`) — see also: Card, Dropdown/Nav (structurally similar, separate tokens)
- **Modal** (`components.md#modal`) — see also: Offcanvas (shares backdrop/`--bs-backdrop-*` namespace), Close Button
- **Nav / Tabs** (`components.md#nav--tabs`) — see also: Navbar (`.navbar-nav` variant), Dropdown, Pagination (structurally similar), Card, patterns.md compound chain
- **Navbar** (`components.md#navbar`) — see also: Nav/Tabs, Dropdown, Offcanvas (neutralized at `.navbar-expand-*` breakpoint)
- **Offcanvas** (`components.md#offcanvas`) — see also: Modal (shares backdrop mechanics), Navbar
- **Pagination** (`components.md#pagination`) — see also: Nav/Tabs, List Group (shared active/disabled/hover pattern)
- **Popover** (`components.md#popover`) — see also: Tooltip (near-identical, JS-inserted-element pattern)
- **Progress** (`components.md#progress`) — see also: patterns.md §2 (minimal structure)
- **Separator/Divider** (`components.md#separatordivider`) — three distinct mechanisms (`<hr>`, `.dropdown-divider`, `.vr`); see also: Dropdown
- **Spinner** (`components.md#spinner`) — see also: utilities.md §18 (`.visually-hidden` status text convention)
- **Table** (`components.md#table`) — see also: Card (common child), patterns.md §2 (minimal structure), tokens.md §10 (`-type`/`-state` CSS-var precedence chain)
- **Toast** (`components.md#toast`) — see also: Close Button, Alert (similar dismiss-notification concept, different visibility mechanics)
- **Tooltip** (`components.md#tooltip`) — see also: Popover

31 components total (see `components.md` "Component count" for the authoritative list).

---

## Utility Category Index

One line per category (19 total, `utilities.md`):

1. Display (`.d-*`) — responsive, single-property
2. Flexbox (`.flex-*`, `.justify-content-*`, `.align-items-*`, `.align-content-*`, `.align-self-*`, `.gap-*`, `.order-*`) — responsive, single-property
3. Spacing (`.m-*`, `.p-*` + directional) — responsive, single/multi-property mix
4. Sizing (`.w-*`, `.h-*`, `.mw-100`, `.mh-100`, viewport variants) — not responsive, single-property
5. Typography (`.text-*` align/wrap/transform, `.fs-*`, `.fw-*`, `.fst-*`, `.lh-*`) — mostly not responsive (only `text-align` is)
6. Color / Background (`.text-*`, `.bg-*`, `.bg-opacity-*`) — not responsive, single-property + CSS-var opacity hooks
7. Border (`.border`, directional, color, width, `.rounded-*`) — not responsive, single/multi-property mix
8. Shadow (`.shadow`, `.shadow-sm`, `.shadow-lg`, `.shadow-none`) — not responsive, single-property
9. Opacity (`.opacity-*`) — not responsive, single-property
10. Overflow (`.overflow-*`, x/y variants) — not responsive, single-property
11. Position (`.position-*`, `.top-*`, `.bottom-*`, `.start-*`, `.end-*`, `.translate-middle-*`) — not responsive; related non-map helpers `.fixed-top`/`.sticky-top` etc.
12. Visibility (`.visible`, `.invisible`) — not responsive, single-property
13. Float (`.float-*`) — responsive, single-property
14. Vertical align (`.align-*`) — not responsive, single-property
15. Object fit (`.object-fit-*`) — responsive, single-property
16. User select (`.user-select-*`) — not responsive, single-property
17. Pointer events (`.pe-*`) — not responsive, single-property (naming collision with `padding-end`'s `.pe-*` prefix, see utilities.md §17)
18. Screen reader (`.visually-hidden`, `.visually-hidden-focusable`) — not responsive, multi-property, not part of the `$utilities` map
19. Stack helpers (`.hstack`, `.vstack` + `.vr`, `.ratio`, `.text-truncate`, `.clearfix`, `.stretched-link`, `.icon-link`, colored-links) — not responsive, multi-property, hand-written helpers

---

## CSS Token Category Index

One line per category with approximate token count (`tokens.md`):

1. Color — Palette base (`--bs-blue`…`--bs-cyan`, grays, black/white + rgb) — 23 tokens
2. Color — Theme (`--bs-primary`…`--bs-dark` + rgb) — 16 tokens
3. Color — Semantic (`--bs-body-*`, `--bs-emphasis-*`, `--bs-link-*`, etc.) — 23 tokens
4. Color — Text/Border emphasis (`-text-emphasis`/`-bg-subtle`/`-border-subtle` × 8 theme colors) — 24 tokens
5. Typography (`--bs-font-*`, `--bs-body-font-*`, `--bs-body-line-height`) — 6 tokens
6. Border (`--bs-border-*`, all `--bs-border-radius-*`) — 11 tokens
7. Shadow (`--bs-box-shadow*`) — 4 tokens
8. Focus ring (`--bs-focus-ring-*`) — 3 tokens (+ 3 unset consumer-only hooks)
9. Form validation (`--bs-form-valid-*`, `--bs-form-invalid-*`) — 4 tokens
10. Component-level tokens (per-component `--bs-{component}-*` namespaces, Button through Grid gutters) — 310 tokens across 23 component namespaces, including two notable **absences**: Form Control has no `--bs-input-*` namespace at all, and Carousel is out-of-scope but was found to have only 3 stray tokens

**Grand total: 424 documented tokens** (413 literal `` | `--bs- `` table rows in `tokens.md`, some namespace-summary rows cover multiple tokens by pattern). Well above the 80+ minimum.

---

## Cross-Reference Hints

Key relationships between components that share token space or structural patterns — check these before assuming two similarly-named things are the same:

- **`--bs-btn-*` vs `--bs-btn-close-*`** — Button and Close Button are fully separate token namespaces despite the shared `btn` prefix (Close Button's class is `.btn-close`, not a Button modifier). See tokens.md §10.
- **Form components mostly don't use the `--bs-{component}-*` CSS custom property pattern** — unlike Button/Card/Dropdown/Modal/etc., Form Control, Form Range, Input Group, Floating Labels, Form Label, and Form Text compile their SCSS `$input-*`/`$form-*` variables directly into static CSS with **no runtime override hook**. Only Form Select (`--bs-form-select-bg-img`/`-bg-icon`) and Form Check (`--bs-form-check-bg`/`-bg-image`, and Form Switch's single `--bs-form-switch-bg`) expose narrow, image-only custom properties. Verify before assuming a `--bs-input-padding-x`-style token exists — it doesn't.
- **`.nav` supplies `--bs-nav-link-*` tokens that `.navbar-nav` overrides** — Navbar doesn't invent new link-color tokens, it re-points `--bs-nav-link-color` etc. at `--bs-navbar-*` tokens on the `.navbar-nav` selector. See tokens.md Nav and Navbar entries.
- **`.collapse`/`.collapsing`/`.show` triad is shared infrastructure** (`_transitions.scss`), consumed by Accordion, Navbar-collapse, and the generic Collapse component — not reimplemented per-component. See states.md Collapsed/Expanded-Open sections.
- **`--bs-backdrop-*` namespace is shared** between Modal (`.modal-backdrop`) and Offcanvas (`.offcanvas-backdrop`) — one token family, two consuming components. See tokens.md §10.
- **Popover and Tooltip are both JS-inserted, not authored** — the visible `.popover`/`.tooltip` element does not exist in static markup; only the trigger element with `data-bs-toggle` does. See components.md and patterns.md.
- **Form Select LOOKS like a compound dropdown-menu pattern but structurally is NOT one** — it's a flat native `<select>` with `background-image` layers, no `.dropdown-menu`-equivalent element. Contrast directly with the true compound Dropdown component. See patterns.md §1.
- **`.is-valid`/`.is-invalid`/`.was-validated` compound selectors are mixin-generated** — they exist as literal text only in compiled CSS, never as literal strings in `forms/_validation.scss` (which just loops a mixin call). This is the canonical example of the "Two-source rule" / Generation Principle #1 in the skill file. See states.md Valid/Invalid sections for the full verified selector list with compiled-CSS line numbers.
- **`.pe-*` is a naming collision** between the `pointer-events` utility (`.pe-none`, `.pe-auto`) and the `padding-end` spacing utility (`.pe-0`…`.pe-5`) — no literal class-name overlap in practice (value keys don't intersect), but grepping `.pe-` in the compiled CSS returns both concerns. See utilities.md §17.

---

## KB Completion Status

| File | Status | Last updated |
|------|--------|-------------|
| tokens.md | Complete | 2026-07-15 |
| utilities.md | Complete | 2026-07-15 |
| states.md | Complete | 2026-07-15 |
| components.md | Complete | 2026-07-15 |
| patterns.md | Complete | 2026-07-15 |

All five files generated in a single initial-generation session from Bootstrap 5.3.8 (SCSS source `src/scss/vendor/bootstrap-5.3.8/` + compiled `node_modules/bootstrap/dist/css/bootstrap.css`). This README was written last, after all five other files existed, per the skill's file-ordering rule.
