---
title: Button Taxonomy
component: Button
iteration: 1
---

## Button

**React Aria root class:** `.react-aria-Button`
**Mapping type:** 1:1 — the root renders a genuine `<button>` element, which maps directly to Bootstrap's `.btn`. No structural/semantic divergence (M014 does not apply — there is no dual-counterpart fork; the DOM-first match and the name-match are the same element). The `isPending` state additionally introduces a content-state sub-part (spinner child) per M010 — this is a conditional child, not a second always-present sub-part, so it does not make this a Composite mapping under M002.

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|---|---|---|---|
| Root (button element) | `.react-aria-Button` (renders a real `<button type="button">` by default) | Button (`components.md#button`) | `.btn` + one variant modifier (`.btn-{variant}` or `.btn-outline-{variant}`, full 17-value set per D-variant-scope) + optional `.btn-sm`/`.btn-lg` (per D-size-scope) |
| Pending indicator (content-state, M010) | Raw markup rendered in place of `children` only when `isPending` — **resolved (D-pending-indicator-composition): does not use `<ProgressCircle>`**; implemented self-contained inside Button | Spinner (`components.md#spinner`) | `.spinner-border.spinner-border-sm` + status text (Bootstrap's own canonical "pending button" example) |
| Icon-only shape (custom, non-Bootstrap-precedented) | Same root `<button>`, no additional React Aria sub-part — a shape/sizing recipe applied to the same element | `[NO DIRECT COUNTERPART]` (M006) — resolved in scope per D-icon-only-scope | `.btn` + custom fixed-size square/circle CSS (no Bootstrap class provides this) |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|---|---|---|---|---|
| Color/style | `variant` prop — repo-defined, **not** a React Aria Components API. Vanilla-starter default values were `'primary' \| 'secondary' \| 'quiet'`, none of which are Bootstrap terms. | 9 solid: `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-info`, `.btn-warning`, `.btn-danger`, `.btn-light`, `.btn-dark`, `.btn-link`. 8 outline: `.btn-outline-{primary,secondary,success,info,warning,danger,light,dark}`. | Bootstrap (M015) | **Resolved (D-variant-scope):** expose the full 17-value set (all 9 solid + all 8 outline). `'quiet'` is dropped entirely, not aliased. |
| Size | None in React Aria's Button API. | `.btn-sm`, `.btn-lg` (no size modifier = default/medium). | Bootstrap (M015) | **Resolved (D-size-scope):** expose a `size` prop covering `sm`/default/`lg`. |
| Icon-only shape | `:has(> svg:only-child)` special case in the vanilla-starter CSS (turns the button into a fixed-size circle, strips padding). Not part of React Aria's API — purely a CSS convention in the reference implementation. | `[NO DIRECT COUNTERPART]` (M006). Closest structural pattern: `.btn` sized to an explicit square/circle via custom CSS (Bootstrap ships no icon-button component). | M006 | **Resolved (D-icon-only-scope):** in scope, built as a custom (non-Bootstrap-precedented) recipe on top of `.btn` — no Bootstrap reference to match against. |
| Link-as-button | Out of scope for `Button` — React Aria's docs state the `Button` component always renders semantic `<button>`; a link that looks like a button uses the separate `Link` component instead, reusing the same classes. | `.btn` applied to `<a href>`. | N/A | Out of scope for this component's reference stories — belongs to a `Link` taxonomy pass, not `Button`. |

### State mappings

All rows are for the Root sub-part (`.react-aria-Button.btn`). Verified against `node_modules/react-aria-components/dist/types/src/Button.d.ts` (render props) and `node_modules/react-aria-components/dist/private/Button.js` (runtime `data-*` wiring) — full attribute surface: `data-hovered`, `data-pressed`, `data-focused`, `data-focus-visible`, `data-disabled`, `data-pending`.

Because Button renders a genuine native `<button>` (unlike Select's fake trigger), the chosen class `.btn` gets its **native** Bootstrap pseudo-class rules (`:hover`, `:focus-visible`, `:active`/`.active`, `:disabled`) firing for real, automatically, with zero bridge CSS. The bridges below exist for cross-modality reliability (touch, keyboard-only press, RAC's own focus-visible heuristic) and for the one state (`pending`) that has no native trigger at all — not to work around a broken selector.

| `data-*` attribute | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `[data-hovered]` | `.btn:hover` → `--bs-btn-hover-color/-bg/-border-color` | Compound selector `.react-aria-Button.btn[data-hovered]` reading the same `--bs-btn-hover-*` variables `.btn:hover` already reads — reinforces, does not neutralize (native `:hover` also fires on a real hover). Belt-and-suspenders, kept for parity with RAC's hover normalization (excludes touch-emulated hover, which native `:hover` does not). |
| `[data-focused]` (true) with `[data-focus-visible]` (false) | No distinct Bootstrap rule — `.btn` has no plain `:focus` style, only `:focus-visible`. | No bridge — resting-state appearance applies. This is intentional (see DOM conflicts), not a mapping gap. |
| `[data-focus-visible]` | `.btn:focus-visible` → hover-color tokens + `outline: 0` + `box-shadow: var(--bs-btn-focus-box-shadow)` (verified in compiled CSS — the rule does **not** also layer `--bs-btn-box-shadow`; see Confidence). | Compound selector `.react-aria-Button.btn[data-focus-visible]` reproducing the same three properties. Neutralizes nothing new; belt-and-suspenders against RAC's focus-visible heuristic diverging from the browser's own in edge cases (virtual focus, modality switch). |
| `[data-pressed]` | `.btn:active`, `.btn.active`, `.btn.show` → `--bs-btn-active-color/-bg/-border-color` (verified: no `box-shadow` is actually applied by this rule in compiled CSS despite the `--bs-btn-active-shadow` token existing — see Confidence). | Compound selector `.react-aria-Button.btn[data-pressed]`. This one is **not** purely belt-and-suspenders: native `:active` is unreliable across keyboard/touch activation in some browsers, which is the documented reason RAC ships `data-pressed` (see `usePress`/"Building a Button" series). |
| `[data-pressed][data-focus-visible]` | `.btn:active:focus-visible` (compound OR-selector in compiled CSS) → active tokens retained + `box-shadow: var(--bs-btn-focus-box-shadow)` | Compound selector `.react-aria-Button.btn[data-pressed][data-focus-visible]` combining both token sets. |
| `[data-disabled]` | `.btn:disabled`, `.btn.disabled` → disabled tokens + `opacity: var(--bs-btn-disabled-opacity)` + `pointer-events: none` | `isDisabled` also sets the real `disabled` HTML attribute (confirmed in `Button.js`), so native `:disabled` already fires. Bridge is defensive/redundant, not required. |
| `[data-pending]` | No native Bootstrap concept. Closest analog: same visual treatment as `:disabled` (dimmed via disabled tokens/opacity) plus a spinner child, per Bootstrap's own documented pending-button pattern. | **Required bridge** — confirmed in `Button.js` that `isPending` sets `aria-disabled="true"` but does **not** set the native `disabled` attribute (button must stay focusable), so `:disabled` never fires. Must apply the disabled-token look via `[data-pending]` selector directly. Also must guard interaction with simultaneous `[data-hovered]` (RAC preserves hover events during pending, for tooltip support) via CSS ordering/`:not([data-pending])` on the hover bridge, so pending's dimmed look always wins. **Resolved (D-pending-indicator-composition):** the spinner child is raw `.spinner-border.spinner-border-sm` markup rendered directly by Button — not `<ProgressCircle>` — so this bridge only needs to style Button's own root plus a self-contained spinner element, with no cross-component dependency. |

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|---|---|---|---|---|
| Root | MINOR | `.btn` as the sole component class on the interactive element (M020) | `.react-aria-Button` + `.btn` + variant modifier(s) on a real `<button>` | No conflict — M020 satisfied by construction; no dual-counterpart, no element-type substitution (M018 does not apply). |
| Pending indicator | MAJOR | Bootstrap's documented spinner-in-button pattern is two flat children directly inside `.btn`: `.spinner-border.spinner-border-sm` + a `role="status"`/`.visually-hidden` text node | RAC's own vanilla-starter implementation nests a separately-defined React Aria component (`<ProgressCircle>`/`<ProgressBar>`), not yet given a Bootstrap mapping in this batch (batch-1 scopes only Select and Button) | **Resolved (D-pending-indicator-composition):** bypass `<ProgressCircle>` for this component; render Bootstrap's raw `.spinner-border.spinner-border-sm` + status-text markup directly inside Button, self-contained, no dependency on ProgressCircle's own future Stage 4 pass. |
| Focus (plain) vs. focus-visible | MINOR | Bootstrap defines no rule for plain `:focus` on `.btn` — visually identical to resting state | RAC exposes `data-focused` (any focus, including pointer-click focus) distinctly from `data-focus-visible` (keyboard-only) | No bridge for `data-focused` alone — intentional. Flagging explicitly so the implementation agent doesn't mistake the missing bridge for a gap. |

### Reference story canvas

- **Default** — one specimen per in-scope color/style variant at rest: all 9 solid (`primary, secondary, success, danger, warning, info, light, dark, link`) + all 8 outline (`outline-primary` … `outline-dark`) = 17 specimens, flex-wrap layout (P-004), each labeled with its variant name (P-008). Include a size row/group for `sm`/default/`lg` (D-size-scope) — representative variant(s) at each size, not the full 17 × 3 cross-product.
- **States** — full interactive state matrix (resting, hover, focus-visible, pressed, disabled) for **at least one representative of each structurally distinct variant family**, per P-009:
  - **Solid** (e.g. `.btn-primary`) — fill present at rest, darkens on hover/active.
  - **Outline** (e.g. `.btn-outline-primary`) — no fill at rest; fill *appears* on hover/active (verified in compiled CSS: outline variants set `--bs-btn-bg` only in `-hover-bg`/`-active-bg`, never at rest).
  - **Link** (`.btn-link`) — never fills or borders; `:focus-visible` uniquely does **not** change text color (`.btn-link:focus-visible { color: var(--bs-btn-color); }` overrides the generic hover-color swap) — only the box-shadow ring appears.
  - Disabled is uniform opacity-based dimming across all three families (verified — not a structurally distinct case), so one disabled specimen per family is enough, not a fourth family.
  - Plain-focused-without-visible-ring is not a separate specimen (see DOM conflicts) — resting-state specimen covers it.
- **Pending** — raw `.spinner-border.spinner-border-sm` + status-text markup (D-pending-indicator-composition), at least one specimen showing the spinner + dimmed treatment. Include a second specimen with `[data-hovered]` simultaneously true, to verify the pending dimmed look wins over the hover bridge (see state mappings note).
- **IconOnly** — circular/square icon-only specimen(s) per D-icon-only-scope's custom recipe; include resting, hover, focus-visible, pressed, and disabled since it's still an interactive `.btn` underneath.

### Confidence

**High** for the root sub-part, its state mappings, and the DOM-conflict analysis — all directly verified against three independent current-tree sources: `node_modules/bootstrap/dist/css/bootstrap.css` (compiled CSS, read directly for `.btn` and every variant block), `node_modules/react-aria-components/dist/types/src/Button.d.ts` (full `data-*`/render-prop surface), and `node_modules/react-aria-components/dist/private/Button.js` (runtime confirmation of exactly which DOM attributes get set and when, including the pending/disabled distinction).

Two corrections to `agent/bootstrap-kb/states.md`'s prose surfaced during this verification (M007 compiled-css-authoritative): (1) states.md describes `.btn:focus-visible`'s box-shadow as `var(--bs-btn-box-shadow), var(--bs-btn-focus-box-shadow)` — the compiled CSS only ever applies `var(--bs-btn-focus-box-shadow)`; `--bs-btn-box-shadow` is defined on every button variant but is **never consumed** by any `box-shadow:` declaration anywhere in the compiled stylesheet (grepped, zero hits). (2) states.md describes the active/pressed rule as including `box-shadow: var(--bs-btn-active-shadow)` — same issue: `--bs-btn-active-shadow` is defined per-variant but never consumed either. Net effect: Bootstrap 5.3.8 buttons have **no box-shadow at all** except the focus-visible ring. These should be corrected in `states.md` in a future KB pass; this taxonomy's state-mapping table reflects the compiled-CSS-verified behavior, not states.md's prose.

**High** overall — all four decisions are now resolved (see Decisions below); no open forks remain.

**Blank-slate note:** No git history, prior commits, or deleted taxonomy/reference-story/CSS content were consulted for this taxonomy. `agent/taxonomies/` contained no prior `Button-taxonomy.md`/`button-taxonomy.md` at session start (only `Select-taxonomy.md`), and no reference story or extracted CSS for Button existed in the working tree. All conclusions above derive from the Bootstrap KB, the current compiled CSS, and the current `node_modules/react-aria-components` source — not from any prior iteration's resolution.

## Decisions

### D-variant-scope — Color/style variant exposure

**Question:** Button's current `variant` prop (repo-defined, not a React Aria API) uses non-Bootstrap values (`'primary' | 'secondary' | 'quiet'`). Bootstrap offers 9 solid variants (`.btn-primary/-secondary/-success/-info/-warning/-danger/-light/-dark/-link`) and 8 outline variants (`.btn-outline-{primary,secondary,success,info,warning,danger,light,dark}`) with no React Aria prop equivalent. Per M015, Bootstrap's variant vocabulary is authoritative and the existing `'quiet'` value has no Bootstrap counterpart. Which variants should the `variant` prop expose — the full 17, a curated subset, both solid and outline, or something else — and should `'quiet'` be dropped or mapped to something?
**Answer:** Full Bootstrap set — all 9 solid (`primary, secondary, success, danger, warning, info, light, dark, link`) plus their 8 `.btn-outline-*` counterparts (17 total). `'quiet'` is dropped entirely; not aliased to any Bootstrap variant.

### D-size-scope — Size modifier exposure

**Question:** Bootstrap offers `.btn-sm`/`.btn-lg` size modifiers with no existing React Aria Button prop. Should this reference pass expose a `size` prop, or leave size out of scope for now?
**Answer:** Include sizing — expose `.btn-sm`/`.btn-lg` as a `size` prop this pass, alongside the unmodified default (medium) size.

### D-icon-only-scope — Icon-only button variant

**Question:** The vanilla-starter CSS special-cases icon-only buttons (`:has(> svg:only-child)`) into a fixed-size circle with no padding — Bootstrap has no built-in icon-button component (`[NO DIRECT COUNTERPART]`, M006). Should this pass include an icon-only circular/square button variant in the reference stories, or defer it?
**Answer:** Include an icon-only circular/square button variant, built as a custom (non-Bootstrap-precedented) recipe — Bootstrap has no reference pattern to match against for this variant, so its sizing/shape is an original addition on top of `.btn`.

### D-pending-indicator-composition — Pending state markup

**Question:** Button's pending state renders a nested `<ProgressCircle>` (a separate React Aria component, not yet given a Bootstrap mapping in this batch). Bootstrap's own documented pending-button pattern is flat: `.spinner-border.spinner-border-sm` + a status-text node, both direct children of `.btn`. Should the Bootstrap-styled Button render raw Bootstrap spinner markup in place of `<ProgressCircle>` for its pending indicator, or keep composing `<ProgressCircle>` and bridge Bootstrap's spinner look onto its own output?
**Answer:** Raw Bootstrap spinner markup (`.spinner-border.spinner-border-sm`) — self-contained, does not compose `<ProgressCircle>` since that component hasn't had its own Stage 4 pass yet. The pending indicator is implemented directly inside Button's own markup/CSS, with no dependency on ProgressCircle's eventual mapping.
