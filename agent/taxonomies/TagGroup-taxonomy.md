---
title: TagGroup Taxonomy
component: TagGroup
iteration: 1
---

## TagGroup

**React Aria root class:** `.react-aria-TagGroup`
**Mapping type:** Composite — Label → Form Label, Tag → **no direct Bootstrap counterpart** (resolved dual-sourced: `.btn` structural class + badge-informed visual tokens, Decision D1), Remove Button → Close Button (`.btn-close`, Decision D4), Description → Form Text, error text → Invalid Feedback (informal, not state-gated). TagGroup (root) and TagList have no Bootstrap counterpart at all — bare structural/layout wrappers.

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|---|---|---|---|
| Root wrapper | `.react-aria-TagGroup` (`<div>`) | none — bare structural wrapper, no single Bootstrap element corresponds to it | — (retains flex-column layout via utilities, not a component class) |
| Label | `.react-aria-Label` (`<label>`, optional, via shared `src/Form.tsx` `Label`) | Form Label | `.form-label` |
| TagList | `.react-aria-TagList` (`<div role="grid">`) | **[NO DIRECT COUNTERPART]** (M006) — closest structural pattern is a plain flex-wrap layout; no Bootstrap component owns a "chip container" role | `.d-flex.flex-wrap.gap-2` (utilities only, not a component class) |
| Tag | `.react-aria-Tag` (`<div role="row">`) | **[NO DIRECT COUNTERPART]** (M006) — resolved via dual-sourcing (Decision D1): structural class `.btn` (owns the full interactive-state cascade), visual tokens informed by `.badge`'s compact/pill shape | `.btn` + `.btn-outline-secondary` (neutral resting modifier, Decision D2 refinement — see Decisions) |
| SelectionIndicator | `.react-aria-SelectionIndicator` (optional child, `SelectionIndicatorContext`) | **[NO DIRECT COUNTERPART]** (M006) — same no-counterpart pattern already resolved for Tabs | not styled into visibility — suppressed per Decision D3 |
| Remove Button | `Button[slot=remove]` (`.react-aria-Button.remove-button`, `<button>`, conditionally rendered when `allowsRemoving`) | Close Button, with its background-image glyph suppressed in favor of a Bootstrap Icons glyph (Decision D4) | `.btn-close` + `<i class="bi bi-x">` |
| Description | `.react-aria-Text[slot=description].field-description` (optional, via shared `src/Form.tsx` `Description`) | Form Text | `.form-text` |
| Error text | `.react-aria-Text[slot=errorMessage]` (optional, author-controlled — no native `isInvalid`/`data-invalid` state exists on `TagGroup`, see Confidence) | Invalid Feedback (visual convention only, not state-gated) | `.invalid-feedback` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|---|---|---|---|---|
| Color / variant | none (no built-in prop) | `.text-bg-{color}` (Badge) / `.btn-{color}`, `.btn-outline-{color}` (Button) — 8 theme colors | Bootstrap exclusive (M015) | **RESOLVED (D2):** fixed neutral default (`.btn-outline-secondary`), no prop; color changes only on `[data-selected]`. No `variant`/`color` prop added. |
| Size | none (no built-in prop, no `.badge-sm`/`.badge-lg` exists in Bootstrap either) | `.btn-sm`/`.btn-lg` exist for `.btn` generically, but are superseded here | — | Not exposed. Decision D1's direct `--bs-btn-padding-*`/`--bs-btn-font-size` token overrides already fix Tag at a single small/pill-shaped size; layering `.btn-sm`/`.btn-lg` on top would double-override the same properties. Out of scope for this pass. |
| Selection mode | `selectionMode: 'none' \| 'single' \| 'multiple'` | none — Bootstrap has no chip-selection concept | React Aria (structural) | No Bootstrap modifier class exists; custom CSS required (M017 delta below). Per Decision D3, visual treatment is identical for `single` and `multiple` (background/color fill via `[data-selected]`) — `data-selection-mode` is selector-only, not visual-differentiating. |
| Selection behavior | `selectionBehavior` (inherited default: `toggle`) | none | — | Not exposed by `TagGroup`'s own prop surface — out of scope (mirrors Select's precedent). |
| Removable (`onRemove`) | `allowsRemoving` (derived from whether `onRemove` is passed) → `data-allows-removing` | none — content-state (M010), not a class-based variant | — | Drives Remove Button presence and an asymmetric-padding CSS delta (M017 below). |
| Disabled | `isDisabled` (per-`Tag`, via `disabledKeys` or the item's own `isDisabled`) | `.btn:disabled`/`.disabled` — but real `:disabled` never fires (see DOM conflicts) | Bridge via `[data-disabled]` | |
| Link tag (`href`) | `Tag` renders the same `<div role="row">` (never a real `<a>`) when `href` is set; adds `data-href`/`data-target`/`data-rel`/`data-download` | No dedicated Bootstrap class-scoped behavior — just a cursor/decoration delta | No CSS delta beyond cursor | In scope per M011 (same sub-parts, same class assignment, same a11y — React Aria handles navigation via JS per its own docs, since tags cannot be real `<a>` elements per HTML spec). |

**M017 CSS delta — Removable padding:**
- `data-allows-removing` present → Tag's trailing padding tightens to make room for the Remove Button (matches the pre-existing vanilla scaffold's `:has(.remove-button)` rule, re-expressed as a `[data-allows-removing]` attribute selector for robustness): asymmetric `padding-inline` (less on the trailing edge) instead of the symmetric resting padding.

### State mappings

**Tag** (`.react-aria-Tag.btn.btn-outline-secondary`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | `.btn:hover` → `color: var(--bs-btn-hover-color); background-color: var(--bs-btn-hover-bg); border-color: var(--bs-btn-hover-border-color);` | **Explicit bridge preferred over real `:hover`**, consistent with Select's ListBoxItem precedent (RAC's `useHover` deliberately excludes touch, so relying on raw CSS `:hover` would diverge from `data-hovered`): `.react-aria-Tag.btn[data-hovered] { color: var(--bs-btn-hover-color); background-color: var(--bs-btn-hover-bg); border-color: var(--bs-btn-hover-border-color); }` — reads the same `--bs-btn-hover-*` vars `.btn-outline-secondary` already sets, no contest. |
| `data-focused` / `data-focus-visible` | `.btn:focus-visible` → hover-color/hover-bg + `box-shadow: var(--bs-btn-focus-box-shadow)` | Tag genuinely receives DOM focus (roving-tabindex pattern confirmed in `useTag`'s `tabIndex` logic — not activedescendant), so real `:focus-visible` fires directly on the real, keyboard-focusable div (mirrors Tabs' Tab precedent). No bridge required for implementation; reference-story specimens still need a static `.btn.faux-focus-visible` class (P-001) to depict the state without real keyboard interaction. |
| `data-pressed` | `.btn-check:checked + .btn, :not(.btn-check) + .btn:active, .btn:first-child:active, .btn.active, .btn.show` → `color: var(--bs-btn-active-color); background-color: var(--bs-btn-active-bg); border-color: var(--bs-btn-active-border-color); box-shadow: var(--bs-btn-active-shadow)` | `data-pressed` covers keyboard (Enter/Space) presses that real `:active` may not reliably capture — explicit bridge per M004: `.react-aria-Tag.btn[data-pressed] { color: var(--bs-btn-active-color); background-color: var(--bs-btn-active-bg); border-color: var(--bs-btn-active-border-color); }`, reading the same `--bs-btn-active-*` vars (no new values needed, no contest with real `:active` since both resolve identically). |
| `data-selected` | No native Bootstrap selector fires (`.btn.active` is never added by React Aria) | **Explicit bridge required.** Per M004's second pattern ("some rely on the RAC class and data attribute alone, using values borrowed from a comparable Bootstrap element") — the compound selector declares `.btn-primary`'s *complete* literal token set directly, borrowed verbatim from its compiled block (M007), rather than partially re-deriving values: `.react-aria-Tag.btn[data-selected] { --bs-btn-color: #fff; --bs-btn-bg: #0d6efd; --bs-btn-border-color: #0d6efd; --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #0b5ed7; --bs-btn-hover-border-color: #0a58ca; --bs-btn-active-color: #fff; --bs-btn-active-bg: #0a58ca; --bs-btn-active-border-color: #0a53be; --bs-btn-disabled-color: #fff; --bs-btn-disabled-bg: #0d6efd; --bs-btn-disabled-border-color: #0d6efd; }`. This is the complete variable set `.btn-primary` itself declares — nothing partial, no fallthrough gap. *(Earlier draft of this row proposed re-deriving hover-bg from `--bs-primary-text-emphasis`; corrected — that token is tuned for accessible text-on-light-background contrast, not a hover-bg fill, and would have produced the wrong color. Borrowing `.btn-primary`'s own literal values directly, the same way Bootstrap's own source declares them, avoids the error.)* |
| `data-disabled` | `.btn:disabled, .btn.disabled` → disabled color/bg/border + `opacity: var(--bs-btn-disabled-opacity)` + `pointer-events: none` | Real `:disabled` never fires — a `<div>` is not a form-disableable element (same class of conflict documented for Tabs' `.nav-link:disabled`). Explicit bridge: `.react-aria-Tag.btn[data-disabled] { opacity: var(--bs-btn-disabled-opacity); pointer-events: none; }` (color/bg/border disabled tokens intentionally omitted — `.btn-outline-secondary` has no separate disabled color shift beyond opacity in its own token block, so opacity alone reproduces the target). |
| `data-selection-mode="single"\|"multiple"` | routes nothing visual (Decision D3 — identical treatment both modes) | selector-only, no bridge |
| `data-allows-removing` | drives the M017 padding delta above | `.react-aria-Tag.btn[data-allows-removing] { /* tightened trailing padding */ }` |
| `data-href` | no dedicated Bootstrap selector | **No bridge needed — correction from initial draft.** `.btn`'s base rule sets `cursor: pointer` unconditionally for every Tag regardless of `data-href` (verified in compiled CSS: `cursor: pointer;` is in `.btn`'s own declaration block, not gated by any modifier or state selector). The pre-existing vanilla scaffold's conditional `[data-href] { cursor: pointer }` rule was necessary there because that scaffold's resting Tag used `cursor: default`; it does not carry over once `.btn` (already `cursor: pointer` at rest) is the applied class. `.btn` also already sets `text-decoration: none` unconditionally. No visual delta exists for `data-href` under this mapping — dropped from the reference story's state matrix accordingly. |

**Tag sizing/shape overrides (Decision D1 — badge-informed token overrides on `.btn`):**
```scss
.react-aria-Tag.btn {
  // .btn's own display:inline-block doesn't lay out label text + a nested
  // Remove Button on one line with even spacing — needed unconditionally
  // (not just when allowsRemoving) since a single component class can't
  // conditionally switch its own display mode based on children present.
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  --bs-btn-padding-x: 0.65em;      // borrowed from --bs-badge-padding-x
  --bs-btn-padding-y: 0.35em;      // borrowed from --bs-badge-padding-y
  --bs-btn-font-size: 0.875rem;    // smaller than .btn's 1rem default
  --bs-btn-border-radius: var(--bs-border-radius-pill); // 50rem, pill shape
}
```

**Remove Button** (`.react-aria-Button.btn-close`, slot="remove")

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | `.btn-close:hover` → `opacity: var(--bs-btn-close-hover-opacity)` | Real Button element (`<button>`), genuinely hoverable — but per project-wide precedent (explicit bridge over relying on real `:hover`), bridge: `.react-aria-Button.btn-close[data-hovered] { opacity: var(--bs-btn-close-hover-opacity); }` |
| `data-focused` / `data-focus-visible` | `.btn-close:focus` → `outline:0; box-shadow: var(--bs-btn-close-focus-shadow); opacity: var(--bs-btn-close-focus-opacity)` | Real `<button>`, genuinely focusable — real `:focus`/`:focus-visible` fires natively (Button is a true `<button>` per `src/TagGroup.tsx`'s existing `<Button slot="remove">`). No bridge required for implementation; reference story still needs a static `.btn-close.faux-focus` class (P-001). |
| `data-pressed` | `.btn-close` has no dedicated `:active` rule in compiled CSS (only hover/focus/disabled) | No bridge — matches Bootstrap's own target appearance (absence is correct, not an omission, per the `.form-select` precedent in Select-taxonomy.md). |
| `data-disabled` | `.btn-close:disabled, .btn-close.disabled` → `pointer-events:none; user-select:none; opacity: var(--bs-btn-close-disabled-opacity)` | Real `<button disabled>` — native `:disabled` fires directly (Button renders a true `<button>` element, unlike Tag itself). No bridge required. |

**Remove Button icon override (Decision D4 — Bootstrap Icons glyph instead of background-image, per P022 bs-icons):**
```scss
.react-aria-Button.btn-close {
  --bs-btn-close-bg: none;      // suppress the default background-image glyph
  --bs-btn-close-opacity: 1;    // Bootstrap's own default (0.5) reads too faint once paired
                                  // with a real icon-font glyph instead of its pre-tuned
                                  // fixed-black background-image (user review feedback)
  display: inline-flex;          // .btn-close is not flex by default; needed to center the <i> glyph
  align-items: center;
  justify-content: center;
  font-size: 1.5em;              // user review feedback: 1em read too small; scaling .btn-close's
                                  // own font-size (not just the inner glyph) grows width/height/padding
                                  // together, since all three are em-based in its compiled rule
  color: var(--bs-body-color);   // user review feedback: `color: inherit` picked up the ancestor
                                  // .tag's lighter --bs-btn-color (.btn-outline-secondary's #6c757d
                                  // at rest), which combined with the opacity dimming above read as
                                  // too light — explicit --bs-body-color reads as solid body text

  .bi-x {
    font-size: 1em;              // bootstrap-icons scale with font-size
    color: inherit;
  }
}

// Selected Tag: the icon must follow the selected tag's white text instead
// of the fixed --bs-body-color default, or it becomes illegible against
// the primary-blue fill.
.tag-selected .react-aria-Button.btn-close {
  color: #fff;
}
```
*(Earlier draft of this block used `color: inherit` for both the resting and selected cases, relying on plain CSS inheritance from the ancestor `.tag`'s current text color to need no separate override. User review feedback on the rendered reference story found the resting-state result too light — `.tag`'s resting text color (`.btn-outline-secondary`'s `#6c757d`) is itself lighter than full body text, and `.btn-close`'s own default 0.5 opacity compounded on top of it. Corrected to an explicit `--bs-body-color` base plus an explicit `[data-selected]`-equivalent override, rather than relying on inheritance alone.)*

**TagList** (`.react-aria-TagList`)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-empty` | could use `.dropdown-item-text`-style empty-state message | Deferred, out of scope for this pass (mirrors Select's ListBox `data-empty` deferral). |
| `data-focused` / `data-focus-visible` | none meaningful — the container itself isn't the visible focus target (individual Tags are) | No bridge; `outline: none` on the container. |

**TagGroup (root), Label, Description, Error text** — no `data-*` render props exist on any of these (confirmed: `TagGroupProps` has no `RenderProps`/render-prop-driven `className` function, unlike collection sub-parts). Static classes only: `.form-label` (Label), `.form-text` (Description), `.invalid-feedback` (error text, always `display:block` when authored — no `.is-invalid` gating exists to hide it, see DOM conflicts).

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|---|---|---|---|---|
| Tag element type | M018 (elem-type-sub) | `.btn` assumed on `<button>`/`<a>`/`<input type=submit\|reset\|button>` | `<div role="row">` | `:hover`/`:focus`/`:focus-visible` fire natively on a genuinely hoverable/focusable div, but `:disabled` **never** fires (CSS spec restricts it to form-disableable elements) — full `[data-disabled]` bridge required. `_reboot.scss`'s `button`-reset rules are not applicable (Tag never renders `<button>`). This div-not-button choice is also structurally required, not just a React Aria convention: a removable Tag nests a genuine interactive `<Button slot="remove">` inside it, and the HTML spec forbids interactive content nested inside a `<button>` — Tag could not be a real `<button>` even if React Aria wanted it to be. Reference-story specimens use `<div role="button" tabIndex={0}>` for the same reason, consistently across removable and non-removable specimens (not switching element type story-to-story). |
| Tag base token gap | MAJOR | `.btn` alone (no `.btn-{color}` modifier) defines **zero** `--bs-btn-hover-*`/`--bs-btn-active-*`/`--bs-btn-disabled-*` values — verified in compiled CSS, these vars only exist on `.btn-{color}`/`.btn-outline-{color}` modifier classes, never on bare `.btn` | Applying bare `.btn` with no modifier would leave hover/active/disabled states silently inert (vars resolve to nothing) | Resolved by Decision D2: pairing `.btn` with `.btn-outline-secondary` supplies a complete, real token set for free — this is *why* D2's "fixed neutral default" is also a structural necessity, not purely cosmetic. |
| Remove Button icon delivery | MAJOR | `.btn-close`'s glyph is a `background-image` data-URI, tinted via `filter: invert()` for dark mode (works only because it's an image), at a fixed 0.5 resting opacity tuned for that fixed-black image | Decision D4 renders a real `<i class="bi bi-x">` glyph instead | The `filter`-based dark-mode inversion mechanism is inapplicable to a font glyph. **Revised after user review** of the rendered reference story: an initial `color: inherit` approach (no explicit color, relying on the ancestor `.tag`'s current text color) combined with Bootstrap's own unmodified `--bs-btn-close-opacity: 0.5` read as too faint — `.btn-outline-secondary`'s resting text color (`#6c757d`) is already lighter than full body text, and the 0.5 opacity compounded on top of it. Resolved to an explicit `color: var(--bs-body-color)` base, `--bs-btn-close-opacity: 1` (neutralizing Bootstrap's own dimming), and an explicit `.tag-selected .btn-close` override to `#fff` for the selected case (where `--bs-body-color` would be illegible against the primary-blue fill). `.btn-close` is not `display:flex` by default (it's a padded box with a centered background-image) — added `display:inline-flex; align-items:center; justify-content:center` to center the real icon element in the same box. |
| Remove Button sizing inside a small pill Tag | MINOR | `.btn-close`'s box (`width:1em;height:1em;padding:0.25em`, ~1.5em square) is sized for standalone contexts (alert/modal/toast headers) | Nested inside a Tag whose own `font-size` is now 0.875rem (Decision D1) | **Revised after user review:** the icon read too small at `.btn-close`'s unmodified 1em×1em box (which, scaled down by the Tag's smaller inherited font-size, becomes even more diminutive). Resolved by setting `.btn-close.remove-button`'s own `font-size: 1.5em` — since `.btn-close`'s compiled rule expresses width/height/padding entirely in `em` units relative to its own font-size, scaling that one property grows the whole box (icon + surrounding padding) proportionally, rather than growing only the inner glyph past its original content box. |
| Tag width in `.ref-specimen`-based reference-story layouts | MINOR (reference-story-only) | N/A | `.ref-specimen` (shared reference-story layout helper) is a flex column with the default `align-items: stretch` — the same mechanism already documented for `.ref-select-wrap` in the Select taxonomy/presentation.scss | A `.tag` nested directly inside a `.ref-specimen` stretched to the full cross-axis width of the specimen column (driven by the widest sibling's label), rather than hugging its own label+icon content. `display: inline-flex` on `.tag` does not prevent this — that property governs how `.tag` lays out its own children, not how `.tag` itself is sized as a flex item of its parent. **Resolved after user review** by adding `align-self: flex-start` to `.tag` itself. This is a reference-story-authoring concern only — the real `TagList` is a row-direction flex container (not a column), so this stretch behavior never arises in the actual composite; `align-self: flex-start` is harmless there too (it only constrains cross-axis/vertical stretch in a row container). |
| SelectionIndicator | CRITICAL (M006, resolved) | No Bootstrap element, class, or pattern exists for a chip-selection glyph/overlay | React Aria's `Tag` provides a `SelectionIndicatorContext`; an author *may* render `<SelectionIndicator/>` as a child | **RESOLVED (D3):** suppress entirely — do not render `<SelectionIndicator/>` in `src/TagGroup.tsx`'s `Tag`. Rely solely on `[data-selected]` styling applied to the Tag itself. |
| Error text visibility mechanism | MINOR | `.invalid-feedback` hidden by default, shown via `.is-invalid ~ .invalid-feedback` sibling selector | `TagGroup` has **no** `isInvalid`/`data-invalid` state at all (confirmed absent from the `TagGroupProps` table) — `errorMessage` is purely author-controlled conditional rendering (`{errorMessage && <Text slot="errorMessage">}`) | Force `display:block` unconditionally on `.react-aria-Text[slot=errorMessage].invalid-feedback` — DOM presence already signals "show," and no `.is-invalid` gating mechanism exists to hook into (unlike Select's `FieldError`). No `.is-invalid` border/background styling applies anywhere in TagGroup — out of scope, since nothing drives it. |
| Link tag (`href`) | MINOR | N/A — Bootstrap has no tag-scoped link styling; `.btn` supports `<a>`/`<button>`/`<div>`-via-`role` interchangeably | Tag never renders a real `<a>` even when `href` is set (HTML-spec limitation per React Aria's own docs); adds `data-href`/`data-target`/`data-rel`/`data-download` instead, with JS-driven navigation | No structural conflict and, per the State mappings correction above, no CSS delta at all — `.btn`'s unconditional `cursor:pointer`/`text-decoration:none` already produce the target appearance with no bridge required. |

### Reference story canvas

All specimens laid out in `display:flex; flex-wrap:wrap` containers (P-004), each carrying a visible text label (P-008). Source: `https://getbootstrap.com/docs/5.3/components/close-button/` (Remove Button token/state reference only — Bootstrap has no dedicated Tag/Chip docs page to source from, consistent with the M006 no-counterpart finding) and `https://getbootstrap.com/docs/5.3/components/buttons/` (Tag's `.btn`/`.btn-outline-secondary` token reference).

1. **Default** — a `TagList`-equivalent flex-wrap row of 4–5 plain (non-removable, non-selectable) Tags at rest, using `.btn.btn-outline-secondary` with the Decision D1 sizing overrides. Content-driven width demonstration (P-020): one short label (`"News"`) and one long label (`"International Politics & Culture"`), both rendered at the same font-size/padding to confirm the pill shape holds steady and doesn't clip (Tag uses `white-space:nowrap;overflow:hidden;text-overflow:ellipsis` per the pre-existing vanilla scaffold — retained).
2. **States** — full interactive state matrix for the Tag (P-009/P-013 — single structurally-relevant family, since selected/unselected share the same mechanism regardless of `selectionMode`):
   - Default / resting
   - Hover (`.faux-hover`)
   - Focus-visible (`.faux-focus-visible`)
   - Pressed (`.faux-pressed`, momentary — matching D-selected's active token reuse but distinct label so it's not confused with the persistent Selected specimen)
   - Selected (`[data-selected]`-equivalent — real static class, e.g. `.tag-selected`, since it's a persistent look, not a faux pseudo-class state)
   - Selected + Hover (confirms the full-variable-set override keeps hover coherent while selected, per the DOM conflicts note above)
   - Disabled (`.faux-disabled`-equivalent static class — `<div>` can't take a real `disabled` attribute)
   Each specimen individually labeled per P-008. (A "Link" / `data-href` specimen was considered but dropped — no CSS delta exists to demonstrate, see State mappings correction above.)
3. **Removable** — 3 specimens showing the Remove Button sub-part's own state matrix (P-009, structurally distinct sub-part from the Tag body): resting, hover (`.faux-hover` on `.btn-close`), focus-visible (`.faux-focus-visible` on `.btn-close`). Includes one **Selected + Removable** specimen to demonstrate the `[data-selected]` → `--bs-btn-close-color:#fff` re-point (icon must read white-on-primary, not the default black). Asymmetric padding (M017 delta) is visible on every removable specimen by construction — per P-017, verified against the fact that the Remove Button sub-part genuinely renders in these specimens (not assumed).
4. **Empty / Group composition** — one composed example: `.form-label` (`"Categories"`) + a `TagList`-equivalent row of 3 selected + 2 unselected Tags + `.form-text` (`"Select all categories that apply."`) — demonstrating Label/Description in context (P-006 over-inclusion; these sub-parts are simple enough not to need their own dedicated story, but must still appear somewhere). A second composition pairs the same Label with an `.invalid-feedback` error text (`"Select at least one category."`) instead of the description, per the error-text DOM-conflict resolution (always visible when authored, no `.is-invalid` gating).

**Specimen data (P-020):** "News" / "International Politics & Culture" (Default, width demonstration). "Home", "Away", "Draft", "Archived", "Pending Review" (States/Removable specimens — short + one realistically long label). "Design", "Engineering", "Marketing", "Sales", "Support" (Group composition — realistic category tags, 3 marked selected).

### Confidence

**High**, with two caveats. First: the react-aria docs MCP (`mcp__react-aria__get_react_aria_page`) does not expose a rendered "data attributes" table for `TagGroup`, `TagList`, or `Tag` — only prop tables and CSS examples (the vanilla-starter CSS example's own `[data-pressed]`/`[data-selected]`/`[data-href]` selectors were a partial, non-exhaustive hint). The full `data-*` surface used in this taxonomy was instead verified against this repo's installed `node_modules/react-aria-components/dist/types/src/TagGroup.d.ts` and `Collection.d.ts` (`@selector`-annotated TypeScript definitions, authoritative for the installed version) and cross-checked against the actual compiled runtime output in `node_modules/react-aria-components/dist/private/TagGroup.mjs` and `node_modules/react-aria/dist/private/tag/useTag.mjs` (confirms `data-href`/`data-target`/`data-rel`/`data-download` originate from `useSyntheticLinkProps` in `react-aria/dist/private/utils/openLink.mjs`, and that Tag uses roving-tabindex real DOM focus, not activedescendant). Second: `TagGroup` has no built-in `isInvalid`/validation-state mechanism at all (confirmed absent from the props table) — the Invalid Feedback mapping for error text is a visual-convention-only resolution, not a state-bridge, and is flagged as such throughout.

All Bootstrap-side values (compiled selectors, token names, exact literal property values for `.btn`, `.btn-primary`, `.btn-outline-secondary`, `.badge`, `.btn-close`) were verified against `node_modules/bootstrap/dist/css/bootstrap.css` per M007 — including the significant finding that bare `.btn` (no color modifier) defines no hover/active/disabled token values at all, which directly shaped Decision D2's resolution (see DOM conflicts). Sub-part composition (existing `Tag`/`TagGroup` structure, `button-base` shared utility class, lucide-react `<X/>` icon usage) was verified against this repo's own `src/TagGroup.tsx`, `src/TagGroup.css`, `src/Form.tsx`, `src/Content.tsx` — current working-tree files describing the pre-Bootstrap vanilla scaffold, not a source of prior Bootstrap-mapping conclusions (none existed there). Cross-component consistency (M016 trigger 3) was checked directly against `agent/taxonomies/Select-taxonomy.md` and `agent/taxonomies/Tabs-taxonomy.md`, both present in the current working tree as this same batch's sibling components — most notably Decision D3 (`SelectionIndicator` suppression) mirrors Tabs' Decision D2 exactly, and the `[data-hovered]`-over-real-`:hover` bridge preference mirrors Select's ListBoxItem precedent.

Per blank-slate mode: no `git log`/`git show`/`git diff` against a prior commit was run, and no taxonomy/reference-story/CSS content that doesn't exist in the current working tree was consulted or leaned on. `agent/taxonomies/TagGroup-taxonomy.md`, `stories/react-aria-bootstrap/reference/TagGroup.reference.stories.tsx`, and `agent/artifacts/reference-css/taggroup-*.css` did not exist at session start — this is a genuine first pass. `src/scss/_bootstrap-bridges.scss` contained only its scaffolding comment (no prior TagGroup bridge rules to lean on or contradict).

Deferred/out of scope for this pass: `data-empty` TagList empty-state styling; drag-and-drop attributes (not exposed by `TagGroup`'s prop surface); `selectionBehavior` (not exposed); a `variant`/`color` prop (explicitly excluded per Decision D2); a `size` prop (explicitly excluded, see Variants table).

## Decisions

### D1 — Tag's applied Bootstrap component class (no direct counterpart)
**Question:** React Aria's `Tag` is an interactive, focusable, hoverable, selectable, optionally-removable chip. Bootstrap has no dedicated "chip"/"tag" component. `.badge` is the visual/shape match but defines zero interactive pseudo-class rules; `.btn` is the interactive-state match but is visually a full-size button. Per M020, options: (a) apply `.btn` and override its CSS custom properties toward badge-like visual tokens; (b) apply `.badge` and hand-build the entire interactive state cascade from scratch; (c) apply `.list-group-item-action`.
**Answer:** `.btn`, override tokens — apply `.btn` as the sole component class and override its CSS custom properties toward badge-like visual tokens (small padding, pill border-radius, smaller font-size); the interactive cascade comes free. See State mappings' "Tag sizing/shape overrides" block for the exact token deltas (`--bs-btn-padding-x/-y`, `--bs-btn-font-size`, `--bs-btn-border-radius`).

### D2 — Theme-color / variant exposure for Tag
**Question:** Bootstrap's Badge and Button vocabularies both offer 8 theme-color variants, with no React Aria `Tag`/`TagGroup` prop equivalent. Per M016 trigger 1: (a) expose a custom `variant`/`color` prop; (b) fix a single neutral default with no prop, reserving color change for the selected state only; (c) leave as passthrough-only.
**Answer:** Fixed neutral default — fix a single neutral default (secondary/gray) with no prop; reserve color change for the selected state only. No `variant`/`color` prop is added to `Tag` or `TagGroup`.

**D2 refinement (resolved without re-escalation, subject to visual-review veto in Phase B):** "Secondary/gray" resolves to `.btn-outline-secondary` specifically (not solid `.btn-secondary`) — a solid gray fill reads as too visually heavy/"active-looking" for a resting, unselected chip, and directly conflicts with D2's own "reserve color change for the selected state only" intent (a solid fill *is* a color statement). `.btn-outline-secondary` is also the choice that closes the Tag-base-token-gap DOM conflict (see DOM conflicts table) by supplying a complete real `--bs-btn-hover-*`/`--bs-btn-active-*`/`--bs-btn-disabled-*` token set, which bare `.btn` alone does not provide. If this reads wrong in the reference story, it is a one-line class swap to `.btn-secondary`, not a re-architecture.

### D3 — Selected-state visual treatment and `SelectionIndicator`'s role
**Question:** React Aria's `Tag` receives an optional `SelectionIndicatorContext`/`<SelectionIndicator/>` — the same no-Bootstrap-counterpart mechanism already resolved for Tabs (suppressed, static `[data-selected]` styling instead). Given `TagGroup`'s `selectionMode` can be `single` or `multiple`, and Select's precedent used a checkbox indicator for multi-select while suppressing it for single-select, options: (a) mirror Tabs — suppress entirely, background/color fill for both modes; (b) mirror Select — checkbox indicator for multi-select only; (c) always show a checkmark regardless of mode.
**Answer:** Mirror Tabs — suppress `SelectionIndicator` entirely for both selection modes; rely on background/color fill change via a `[data-selected]` bridge (matches Tabs Decision D2 precedent). `src/TagGroup.tsx`'s `Tag` must not render `<SelectionIndicator/>`.

### D4 — Remove-button Bootstrap counterpart
**Question:** Bootstrap's closest convention for a small dismiss glyph is `.btn-close`, but its glyph is a fixed-color `background-image` (not `currentColor`-tintable), unlike the project's existing lucide-react `<X/>` inline SVG. Options: (a) apply `.btn-close` and override its background-image with a real SVG rendered on top; (b) skip `.btn-close` entirely, hand-build a plain circular icon-button.
**Answer:** Use `.btn-close` for its hover/focus/disabled cascade and sizing tokens, but instead of overriding the background-image with a real SVG, render Bootstrap's close icon via the icon font (`<i class="bi bi-x">`), per this project's P022 bs-icons principle (prefer Bootstrap Icons over inline SVG when an equivalent exists; `bootstrap-icons` is already an installed dependency and its CSS is already imported globally in `.storybook/preview.js`). See State mappings' "Remove Button icon override" block and the corresponding DOM conflicts entries (icon delivery mechanism, sizing).
