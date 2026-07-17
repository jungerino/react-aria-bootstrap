---
what: Bootstrap 5.3.8 utility class reference
contains: All utility classes grouped by concern. For each group: available values, class names generated, whether responsive variants exist, single vs. multi-property.
when-to-load: When building the "Bootstrap utilities" column of the mapping table, or when deciding how to handle layout/spacing/display for a React Aria component.
related: tokens.md for CSS custom properties; components.md for component-specific classes vs. utility classes
---

# Bootstrap 5.3.8 Utilities

Source: `src/scss/vendor/bootstrap-5.3.8/_utilities.scss` (806 lines, the `$utilities` Sass map — read in full, 200-line chunks), `src/scss/vendor/bootstrap-5.3.8/utilities/_api.scss` (47 lines, the loop that expands the map into responsive/print CSS classes).

**Generation mechanics (from `_api.scss`):** every entry in the `$utilities` map is expanded once per breakpoint (`xs, sm, md, lg, xl, xxl`) when `responsive: true` — breakpoint infix is inserted before the value segment, e.g. `.mt-3` (xs/base) → `.mt-md-3` (md+). Entries with `print: true` also get a `-print` variant active only in `@media print`. Entries with `rfs: true` (font-size only) get additional fluid-scaling media-query rules. Responsive variants are **not** separate map entries — they're generated mechanically for every group where `responsive: true` is set, so "Responsive: yes" below means the `{bp}-` infix is available (`-sm-`, `-md-`, `-lg-`, `-xl-`, `-xxl-`), not that extra classes exist in source.

---

## 1. Display — `.d-*`

**Responsive:** yes. **Print:** yes (`.d-print-*`). **Single vs. multi-property:** single (`display`).

Values: `inline`, `inline-block`, `block`, `grid`, `inline-grid`, `table`, `table-row`, `table-cell`, `flex`, `inline-flex`, `none`.

Classes: `.d-inline`, `.d-inline-block`, `.d-block`, `.d-grid`, `.d-inline-grid`, `.d-table`, `.d-table-row`, `.d-table-cell`, `.d-flex`, `.d-inline-flex`, `.d-none` (+ `.d-{bp}-*` and `.d-print-*` variants).

---

## 2. Flexbox — `.flex-*`, `.justify-content-*`, `.align-items-*`, `.align-content-*`, `.align-self-*`, `.gap-*`, `.order-*`

**Responsive:** yes on all groups below. **Single vs. multi-property:** all single-property.

| Utility key | Class prefix | Property | Values |
|---|---|---|---|
| `flex` | `.flex-fill` | `flex` | `fill` → `1 1 auto` |
| `flex-direction` | `.flex-*` | `flex-direction` | `row`, `column`, `row-reverse`, `column-reverse` |
| `flex-grow` | `.flex-*` | `flex-grow` | `grow-0`→`0`, `grow-1`→`1` |
| `flex-shrink` | `.flex-*` | `flex-shrink` | `shrink-0`→`0`, `shrink-1`→`1` |
| `flex-wrap` | `.flex-*` | `flex-wrap` | `wrap`, `nowrap`, `wrap-reverse` |
| `justify-content` | `.justify-content-*` | `justify-content` | `start`→`flex-start`, `end`→`flex-end`, `center`, `between`→`space-between`, `around`→`space-around`, `evenly`→`space-evenly` |
| `align-items` | `.align-items-*` | `align-items` | `start`→`flex-start`, `end`→`flex-end`, `center`, `baseline`, `stretch` |
| `align-content` | `.align-content-*` | `align-content` | `start`→`flex-start`, `end`→`flex-end`, `center`, `between`→`space-between`, `around`→`space-around`, `stretch` |
| `align-self` | `.align-self-*` | `align-self` | `auto`, `start`→`flex-start`, `end`→`flex-end`, `center`, `baseline`, `stretch` |
| `order` | `.order-*` | `order` | `first`→`-1`, `0`–`5`, `last`→`6` |
| `gap` | `.gap-*` | `gap` | `$spacers` (`0`–`5`) |
| `row-gap` | `.row-gap-*` | `row-gap` | `$spacers` |
| `column-gap` | `.column-gap-*` | `column-gap` | `$spacers` |

Note: `.align-self` overlaps in name with §14 Vertical Align (`.align-*` for `vertical-align`) — different utility keys (`align-self` vs `align`), disambiguate by class prefix (`align-self-*` vs bare `align-*`).

---

## 3. Spacing — `.m-*`, `.p-*`

**Responsive:** yes. **Single vs. multi-property:** `margin`/`padding` (all-sides) are single-property; `-x`/`-y` variants are multi-property (2 physical properties each).

`$spacers` map: `0`→`0`, `1`→`0.25rem`, `2`→`0.5rem`, `3`→`1rem` (= `$spacer`), `4`→`1.5rem`, `5`→`3rem`. Margin utilities additionally support `auto`.

| Utility key | Class prefix | Property(ies) |
|---|---|---|
| `margin` | `.m-*` | `margin` |
| `margin-x` | `.mx-*` | `margin-right`, `margin-left` |
| `margin-y` | `.my-*` | `margin-top`, `margin-bottom` |
| `margin-top` | `.mt-*` | `margin-top` |
| `margin-end` | `.me-*` | `margin-right` (logical "end") |
| `margin-bottom` | `.mb-*` | `margin-bottom` |
| `margin-start` | `.ms-*` | `margin-left` (logical "start") |
| `negative-margin` (+ `-x`/`-y`/`-top`/`-end`/`-bottom`/`-start`) | `.m-n*` etc. | Same property set, negative `$spacers` values. **Disabled by default** — gated behind `$enable-negative-margins: false !default`, so these classes do not exist in the compiled CSS shipped in this repo unless that flag is flipped. |
| `padding` | `.p-*` | `padding` |
| `padding-x` | `.px-*` | `padding-right`, `padding-left` |
| `padding-y` | `.py-*` | `padding-top`, `padding-bottom` |
| `padding-top` | `.pt-*` | `padding-top` |
| `padding-end` | `.pe-*` | `padding-right` |
| `padding-bottom` | `.pb-*` | `padding-bottom` |
| `padding-start` | `.ps-*` | `padding-left` |

Values 0–5 map to the `$spacers` scale above; `auto` is margin-only.

---

## 4. Sizing — `.w-*`, `.h-*`, `.mw-100`, `.mh-100`, viewport variants

**Responsive:** no (none of the sizing utility entries set `responsive: true`). **Single vs. multi-property:** all single-property.

| Utility key | Class prefix | Property | Values |
|---|---|---|---|
| `width` | `.w-*` | `width` | `25`, `50`, `75`, `100` (%), `auto` |
| `max-width` | `.mw-100` | `max-width` | `100`→`100%` (only value) |
| `viewport-width` | `.vw-100` | `width` | `100`→`100vw` (only value) |
| `min-viewport-width` | `.min-vw-100` | `min-width` | `100`→`100vw` (only value) |
| `height` | `.h-*` | `height` | `25`, `50`, `75`, `100` (%), `auto` |
| `max-height` | `.mh-100` | `max-height` | `100`→`100%` (only value) |
| `viewport-height` | `.vh-100` | `height` | `100`→`100vh` (only value) |
| `min-viewport-height` | `.min-vh-100` | `min-height` | `100`→`100vh` (only value) |

---

## 5. Typography — `.text-*` alignment/wrap/transform, `.fs-*`, `.fw-*`, `.fst-*`, `.lh-*`

**Responsive:** only `text-align` (`.text-{bp}-*`) is responsive; the rest are not. **Single vs. multi-property:** `word-wrap` utility is multi-property (`word-wrap` + `word-break`); all others single-property.

| Utility key | Class prefix | Property | Values | Responsive |
|---|---|---|---|---|
| `font-family` | `.font-monospace` | `font-family` | `monospace`→`var(--bs-font-monospace)` (only value) | no |
| `font-size` | `.fs-*` | `font-size` | `1`–`6` (from `$font-sizes` map, i.e. `$h1-font-size`…`$h6-font-size`); `rfs: true` (fluid-scales at narrow viewports) | no |
| `font-style` | `.fst-*` | `font-style` | `italic`, `normal` | no |
| `font-weight` | `.fw-*` | `font-weight` | `lighter`, `light`, `normal`, `medium`, `semibold`, `bold`, `bolder` | no |
| `line-height` | `.lh-*` | `line-height` | `1`, `sm`, `base`, `lg` | no |
| `text-align` | `.text-*` | `text-align` | `start`→`left`, `end`→`right`, `center` | **yes** |
| `text-decoration` | `.text-decoration-*` | `text-decoration` | `none`, `underline`, `line-through` | no |
| `text-transform` | `.text-*` | `text-transform` | `lowercase`, `uppercase`, `capitalize` | no |
| `white-space` | `.text-*` | `white-space` | `wrap`→`normal`, `nowrap` | no |
| `word-wrap` | `.text-break` | `word-wrap`, `word-break` | `break`→`break-word` (only value; `rtl: false` disables RTL flipping) | no |

---

## 6. Color / Background — `.text-*`, `.bg-*`, `.bg-opacity-*`

**Responsive:** no. **Single vs. multi-property:** single-property (`color` or `background-color`), plus a separate opacity-only CSS-custom-property utility.

| Utility key | Class prefix | Property | Values |
|---|---|---|---|
| `color` | `.text-*` | `color` | Full `$utilities-text-colors` map (theme colors) + `muted` (deprecated), `black-50`/`white-50` (deprecated), `body-secondary`, `body-tertiary`, `body-emphasis`, `reset`→`inherit`. Sets local CSS var `--bs-text-opacity: 1`. |
| `text-opacity` | `.text-opacity-*` | *(CSS custom property `--bs-text-opacity`, `css-var: true`)* | `25`, `50`, `75`, `100` |
| `text-color` | `.text-*` | `color` | `$utilities-text-emphasis-colors` (the `-text-emphasis` tokens from tokens.md §4) |
| `background-color` | `.bg-*` | `background-color` | `$utilities-bg-colors` (theme colors) + `transparent`, `body-secondary`, `body-tertiary`. Sets local CSS var `--bs-bg-opacity: 1`. |
| `bg-opacity` | `.bg-opacity-*` | *(CSS custom property `--bs-bg-opacity`, `css-var: true`)* | `10`, `25`, `50`, `75`, `100` |
| `subtle-background-color` | `.bg-*` | `background-color` | `$utilities-bg-subtle` (the `-bg-subtle` tokens from tokens.md §4) |
| `gradient` | `.bg-gradient` | `background-image` | `gradient`→`var(--bs-gradient)` (only value) |
| — | `.text-bg-{color}` | `color` + `background-color` | Not from the `$utilities` map — generated separately by `helpers/_color-bg.scss` for each of the 8 theme colors; sets contrast-appropriate text color and translucency-aware background (`RGBA(var(--bs-{color}-rgb), var(--bs-bg-opacity, 1))`). Multi-property, marked `!important` when `$enable-important-utilities` (default true). |

Also in this concern area: **link utilities** (`link-opacity`, `link-offset`, `link-underline`, `link-underline-opacity`) — `css-var: true` classes with a `state: hover` modifier (auto-generates a `:hover` variant), e.g. `.link-opacity-50`, `.link-opacity-50-hover`. Not responsive.

---

## 7. Border — `.border`, directional, color, width, `.rounded-*`

**Responsive:** no (border/rounded groups). **Single vs. multi-property:** `border`/`border-{side}` shorthand values are single-property (`border`, `border-top`, etc.); `rounded-top`/`-end`/`-bottom`/`-start` are multi-property (2 physical corner properties each); `rounded` (all corners) is single-property.

| Utility key | Class prefix | Property | Values |
|---|---|---|---|
| `border` | `.border` / `.border-0` | `border` | `null`→`var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)`, `0`→`0` |
| `border-top` | `.border-top` / `.border-top-0` | `border-top` | same pattern |
| `border-end` | `.border-end` / `.border-end-0` | `border-right` | same pattern |
| `border-bottom` | `.border-bottom` / `.border-bottom-0` | `border-bottom` | same pattern |
| `border-start` | `.border-start` / `.border-start-0` | `border-left` | same pattern |
| `border-color` | `.border-{color}` | `border-color` | `$utilities-border-colors` (theme colors); sets local var `--bs-border-opacity: 1` |
| `subtle-border-color` | `.border-{color}-subtle` | `border-color` | `$utilities-border-subtle` (the `-border-subtle` tokens) |
| `border-width` | `.border-{n}` | `border-width` | `$border-widths` map: `1`–`5` (px) |
| `border-opacity` | `.border-opacity-*` | *(CSS custom property `--bs-border-opacity`, `css-var: true`)* | `10`, `25`, `50`, `75`, `100` |
| `rounded` | `.rounded`, `.rounded-0`…`.rounded-5`, `.rounded-circle`, `.rounded-pill` | `border-radius` | `null`→`var(--bs-border-radius)`, `0`→`0`, `1`→sm, `2`→base, `3`→lg, `4`→xl, `5`→xxl, `circle`→`50%`, `pill`→`var(--bs-border-radius-pill)` |
| `rounded-top` | `.rounded-top-*` | `border-top-left-radius`, `border-top-right-radius` | same value set as `rounded` |
| `rounded-end` | `.rounded-end-*` | `border-top-right-radius`, `border-bottom-right-radius` | same value set |
| `rounded-bottom` | `.rounded-bottom-*` | `border-bottom-right-radius`, `border-bottom-left-radius` | same value set |
| `rounded-start` | `.rounded-start-*` | `border-bottom-left-radius`, `border-top-left-radius` | same value set |

---

## 8. Shadow — `.shadow`, `.shadow-sm`, `.shadow-lg`, `.shadow-none`

**Responsive:** no. **Single vs. multi-property:** single (`box-shadow`).

Values: `null`→`var(--bs-box-shadow)`, `sm`→`var(--bs-box-shadow-sm)`, `lg`→`var(--bs-box-shadow-lg)`, `none`→`none`. Classes: `.shadow`, `.shadow-sm`, `.shadow-lg`, `.shadow-none`.

Adjacent utility in the same source region: `focus-ring` (`css-var: true`, sets `--bs-focus-ring-color` per theme color, class `.focus-ring` combined with `.focus-ring-{color}`; not itself a box-shadow utility but feeds the `.focus-ring:focus` box-shadow rule in `helpers/_focus-ring.scss` — see states.md).

---

## 9. Opacity — `.opacity-*`

**Responsive:** no. **Single vs. multi-property:** single (`opacity`).

Values: `0`→`0`, `25`→`.25`, `50`→`.5`, `75`→`.75`, `100`→`1`. Classes: `.opacity-0`, `.opacity-25`, `.opacity-50`, `.opacity-75`, `.opacity-100`.

---

## 10. Overflow — `.overflow-*`, x/y variants

**Responsive:** no. **Single vs. multi-property:** single-property each.

| Utility key | Class prefix | Property |
|---|---|---|
| `overflow` | `.overflow-*` | `overflow` |
| `overflow-x` | `.overflow-x-*` | `overflow-x` |
| `overflow-y` | `.overflow-y-*` | `overflow-y` |

Values (all three): `auto`, `hidden`, `visible`, `scroll`.

---

## 11. Position — `.position-*`, `.top-*`, `.bottom-*`, `.start-*`, `.end-*`, `.translate-middle-*`

**Responsive:** no. **Single vs. multi-property:** `position`/`top`/`bottom`/`start`/`end` are single-property; `translate-middle` is single-property (`transform`) but composes a 2-axis translate.

| Utility key | Class prefix | Property | Values |
|---|---|---|---|
| `position` | `.position-*` | `position` | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top` | `.top-*` | `top` | `$position-values`: `0`→`0`, `50`→`50%`, `100`→`100%` |
| `bottom` | `.bottom-*` | `bottom` | same `$position-values` |
| `start` | `.start-*` | `left` | same `$position-values` |
| `end` | `.end-*` | `right` | same `$position-values` |
| `translate-middle` | `.translate-middle`, `.translate-middle-x`, `.translate-middle-y` | `transform` | `null`→`translate(-50%,-50%)`, `x`→`translateX(-50%)`, `y`→`translateY(-50%)` |

**Related, but not part of the `$utilities` map** (hardcoded rules in `helpers/_position.scss`, not generated by `_api.scss`'s loop, so `responsive`/`print`/`rfs` flags don't apply the same way): `.fixed-top`, `.fixed-bottom` (both `position: fixed` + edge offsets + `z-index: $zindex-fixed`), and `.sticky-top`/`.sticky-bottom` which **are** responsive via a hand-written `@each $breakpoint` loop (`.sticky-{bp}-top`, `.sticky-{bp}-bottom`), `position: sticky` + `z-index: $zindex-sticky`.

---

## 12. Visibility — `.visible`, `.invisible`

**Responsive:** no. **Single vs. multi-property:** single (`visibility`). Note `class: null` in the map — the generated class name matches the value key directly (no `visibility-` prefix).

Values: `visible`→`visible`, `invisible`→`hidden`. Classes: `.visible`, `.invisible`.

---

## 13. Float — `.float-*`

**Responsive:** yes. **Single vs. multi-property:** single (`float`).

Values: `start`→`left`, `end`→`right`, `none`→`none`. Classes: `.float-start`, `.float-end`, `.float-none` (+ `.float-{bp}-*`).

---

## 14. Vertical align — `.align-*`

**Responsive:** no. **Single vs. multi-property:** single (`vertical-align`).

Values: `baseline`, `top`, `middle`, `bottom`, `text-bottom`, `text-top`. Classes: `.align-baseline`, `.align-top`, `.align-middle`, `.align-bottom`, `.align-text-bottom`, `.align-text-top`.

---

## 15. Object fit — `.object-fit-*`

**Responsive:** yes. **Single vs. multi-property:** single (`object-fit`).

Values: `contain`, `cover`, `fill`, `scale`→`scale-down`, `none`. Classes: `.object-fit-contain`, `.object-fit-cover`, `.object-fit-fill`, `.object-fit-scale`, `.object-fit-none` (+ `.object-fit-{bp}-*`).

---

## 16. User select — `.user-select-*`

**Responsive:** no. **Single vs. multi-property:** single (`user-select`).

Values: `all`, `auto`, `none`. Classes: `.user-select-all`, `.user-select-auto`, `.user-select-none`.

---

## 17. Pointer events — `.pe-*`

**Responsive:** no. **Single vs. multi-property:** single (`pointer-events`).

Values: `none`, `auto`. Classes: `.pe-none`, `.pe-auto`.

**Naming collision warning:** `.pe-*` is also the class prefix for `padding-end` (§3, e.g. `.pe-3` = `padding-right: 1rem`). `.pe-none`/`.pe-auto` (pointer-events) vs `.pe-0`..`.pe-5`/`.pe-auto`... wait — padding-end also generates `.pe-auto`? No: `margin-end` supports `auto`, not `padding-end` (padding utilities don't include `auto` in `$spacers`). But `pointer-events` and `padding-end` both use class prefix `pe`, and padding-end's value keys are purely numeric (`0`–`5`), so no literal collision exists in the generated class *names* (`.pe-0`..`.pe-5` are padding; `.pe-none`/`.pe-auto` are pointer-events) — flagged here only because grepping for `.pe-` matches both concerns.

---

## 18. Screen reader — `.visually-hidden`, `.visually-hidden-focusable`

**Responsive:** no. **Single vs. multi-property:** multi-property (source: `mixins/_visually-hidden.scss` — not part of the `$utilities` map; a hand-written helper).

`.visually-hidden` and `.visually-hidden-focusable:not(:focus):not(:focus-within)` both apply the same mixin: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;`. The `-focusable` variant reverses all of that (returns to normal flow) once the element receives focus, so it's the "skip link" pattern — hidden until focused.

---

## 19. Stack helpers — `.hstack`, `.vstack`

**Responsive:** no. **Single vs. multi-property:** multi-property. Source: `helpers/_stacks.scss` — hand-written helper classes, not part of the `$utilities` map (no responsive/print variants exist for these).

- `.hstack` → `display: flex; flex-direction: row; align-items: center; align-self: stretch;`
- `.vstack` → `display: flex; flex: 1 1 auto; flex-direction: column; align-self: stretch;`

**Other non-map helpers found alongside stacks** (same "helper, not utility" category — hand-written in `helpers/*.scss`, no responsive variants):
- `.vr` (`helpers/_vr.scss`) — vertical rule: `display: inline-block; align-self: stretch; width: var(--bs-border-width); min-height: 1em; background-color: currentcolor; opacity: .25;`. Multi-property.
- `.ratio`, `.ratio-1x1`, `.ratio-4x3`, `.ratio-16x9`, `.ratio-21x9` (`helpers/_ratio.scss`) — aspect-ratio box via padding-top trick; sets `--bs-aspect-ratio` custom property per modifier. Multi-property (pseudo-element + custom property).
- `.text-truncate` (`helpers/_text-truncation.scss`) — `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`. Multi-property.
- `.clearfix` (`helpers/_clearfix.scss`) — `::after { display: block; clear: both; content: "";}`. Multi-property (pseudo-element).
- `.stretched-link` (`helpers/_stretched-link.scss`) — `::after` pseudo-element covering the nearest `position: relative` ancestor. Multi-property.
- `.icon-link`, `.icon-link-hover` (`helpers/_icon-link.scss`) — flex layout + gap + underline-offset for icon+text link pattern. Multi-property.
- `.link-primary`…`.link-dark` etc. (`helpers/_colored-links.scss`) — per-theme-color anchor styling using `--bs-link-opacity`/`--bs-link-underline-opacity` hooks (see §6). Multi-property.

---

## Utility count summary

30 top-level keys in the `$utilities` map (§1–17 above cover all of them, some keys grouped together where they share a concern, e.g. all 7 margin-direction keys under §3). Plus 2 CSS-custom-property-only utilities (`text-opacity`, `bg-opacity`, `border-opacity` — 3 total) that don't map to a physical CSS property directly. Plus the hand-written, non-map helpers in §18–19 (`visually-hidden`, `hstack`/`vstack`, `vr`, `ratio`, `text-truncate`, `clearfix`, `stretched-link`, `icon-link`, colored-links) and `helpers/_position.scss` (`fixed-top`/`fixed-bottom`/`sticky-top`/`sticky-bottom`, noted in §11) and `helpers/_color-bg.scss` (`.text-bg-*`, noted in §6).
