---
title: Tabs Taxonomy
component: Tabs
iteration: 1
---

## Tabs

**React Aria root class:** `.react-aria-Tabs`
**Mapping type:** 1:1 — every interactive sub-part maps to Bootstrap's single Nav/Tabs component (`.nav`/`.nav-link`/`.tab-content`/`.tab-pane`), scoped to the `.nav-underline` style per Decision D1. One sub-part (`SelectionIndicator`) has no Bootstrap counterpart at all and is suppressed per Decision D2.

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|---|---|---|---|
| Tabs (root) | `.react-aria-Tabs` | none — Bootstrap has no wrapper for the tabs+content composite; its two trees are joined by `data-bs-target`/`aria-controls` id references, not DOM nesting | — (retains existing custom, non-Bootstrap flex layout CSS) |
| TabList | `.react-aria-TabList` | `.nav` + `.nav-underline` | `nav nav-underline` |
| Tab | `.react-aria-Tab` | `.nav-link` | `nav-link` |
| TabPanels | `.react-aria-TabPanels` | `.tab-content` | `tab-content` |
| TabPanel | `.react-aria-TabPanel` | `.tab-pane` | none required beyond structural — `.fade`/`.show` are not applied (see DOM conflicts) |
| SelectionIndicator | `.react-aria-SelectionIndicator` | **[NO DIRECT COUNTERPART]** (M006) | not styled into visibility — suppressed per Decision D2 |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|---|---|---|---|---|
| Nav style | n/a (no prop) | `.nav-tabs` / `.nav-pills` / `.nav-underline` | Bootstrap exclusive (M015) | RESOLVED (D1): `.nav-underline` only — the other two are out of scope for this pass |
| Fill/justify | n/a (no prop) | `.nav-fill` / `.nav-justified` | Bootstrap exclusive (M015) | RESOLVED (D3): custom prop on `Tabs` (e.g. `fill="proportional" \| "justified"`) applies the corresponding class to `TabList` |
| `orientation` | `horizontal` / `vertical` (`data-orientation`) | No dedicated modifier class — Bootstrap's own vertical-tabs doc example pairs `.flex-column` with `.nav-pills` only, but `.flex-column`'s single declaration (`flex-direction: column`) combines validly with any `.nav` style, including `.nav-underline` | Structural variant, in scope per M011 (same sub-parts, same class assignments, same a11y — only layout differs) | See DOM conflicts / State mappings for the CSS delta (M017) |
| `keyboardActivation` | `automatic` / `manual` | n/a | Behavioral only — no visual delta | Out of CSS scope |
| Disabled tab | `isDisabled` prop → `data-disabled` | `.nav-link.disabled` (class-based; native `:disabled` never applies — see DOM conflicts) | Bridge via `[data-disabled]` | RA sets `aria-disabled="true"` automatically, matching Bootstrap's own static-nav (`<a class="nav-link disabled" aria-disabled="true">`) convention |
| Link tabs (`href`) | `Tab` renders `<a>` when `href` is set | `.nav-link` supports `<a>` and `<div>`/generic elements identically — no tag-scoped CSS | No CSS delta | In scope per M011 |

### State mappings

**Tabs (root)**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-orientation` | n/a — no Bootstrap wrapper-level styling exists | Retain existing custom (non-Bootstrap) flex-direction/layout CSS on `.react-aria-Tabs` |

**TabList**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-orientation="vertical"` | `.flex-column` utility's declaration (`flex-direction: column`) | Bridge: `.react-aria-TabList.nav[data-orientation="vertical"] { flex-direction: column; }` — reproduces the utility's single property directly rather than conditionally applying the `.flex-column` class name, avoiding any utility `!important` interaction |

**Tab** (`.nav-link` applied directly to the real, focusable/hoverable Tab element — no hidden native input, see below)

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-hovered` | `.nav-link:hover, .nav-link:focus` (shared rule) + `.nav-underline .nav-link:hover, .nav-underline .nav-link:focus` | **No bridge needed.** `.nav-link`/`.nav-underline` are applied to the real Tab element (div or `<a>`), which is genuinely hoverable — Bootstrap's own native `:hover` rule fires directly. `data-hovered` and real `:hover` coincide; there is no CSS-variable "contest" because both paths read the same tokens. |
| `data-focused` | `.nav-link:focus` (shared with hover rule above) | No bridge needed — same reasoning; the Tab element is genuinely focusable (`tabIndex`), so real `:focus` fires natively. |
| `data-focus-visible` | `.nav-link:focus-visible` → `outline: 0; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);` (Bootstrap's compiled literal value — not exposed as a `--bs-*` custom property, per M007 compiled-css-authoritative) | No bridge needed — native `:focus-visible` fires directly on the real, keyboard-focusable Tab element. |
| `data-pressed` | **No Bootstrap visual exists.** states.md's Active/Pressed section is explicit: "Nav Tabs / Nav Pills / Nav Underline use `.active` (JS/manual), not `:active`" — Bootstrap defines no momentary-press treatment for `.nav-link` at all. | No bridge applied — matches Bootstrap's own JS-tabs behavior, which has no separate pressed state. |
| `data-selected` | `.nav-underline .nav-link.active` → `font-weight: 700; color: var(--bs-nav-underline-link-active-color); border-bottom-color: currentcolor;` | **Explicit bridge required** (not a native pseudo-class): `.react-aria-Tab.nav-link[data-selected] { font-weight: 700; color: var(--bs-nav-underline-link-active-color); border-bottom-color: currentcolor; }` |
| `data-disabled` | `.nav-link.disabled, .nav-link:disabled` → `color: var(--bs-nav-link-disabled-color); pointer-events: none; cursor: default;` | **Explicit bridge required** — native `:disabled` never matches (Tab never renders a real disableable form element; see DOM conflicts): `.react-aria-Tab.nav-link[data-disabled] { color: var(--bs-nav-link-disabled-color); pointer-events: none; cursor: default; }` |
| `data-selected` + `data-disabled` (combined) | Real Bootstrap cascade: `.nav-underline .nav-link.active` (3 classes, specificity 0,3,0) outranks `.nav-link.disabled` (2 classes, 0,2,0) for the shared `color` property, so the *active* color/weight/underline wins visually while disabled's `pointer-events`/`cursor` still apply (non-overlapping properties, both fire) | No special-cased override needed — simply apply both bridge rules above and let cascade specificity resolve it the way real Bootstrap HTML would. This intentionally differs from the pre-existing custom `Tabs.css`, which forced disabled dimming to override the selection indicator's color; that special case is obsolete once `SelectionIndicator` is suppressed (D2) and native cascade is trusted instead. |

**TabPanels** — no render props / no `data-*` attributes exposed (`TabPanelsProps` extends only `DOMRenderProps`). No bridge needed beyond the static `.tab-content` class.

**TabPanel**

| `data-*` | Bootstrap equivalent | Bridge strategy |
|---|---|---|
| `data-focused` / `data-focus-visible` | **[NO DIRECT COUNTERPART]** — Bootstrap's `.tab-pane` has no focus styling of its own in any compiled rule | Not a genuine fork (M006 documented, not escalated): retain a custom outline treatment; Stage 5 may optionally align it to Bootstrap's generic `--bs-focus-ring-*` tokens (the closest available "focus ring" concept in the KB) for token consistency, but no Bootstrap component rule is being overridden either way. |
| `data-inert` | Closest Bootstrap analog: `.tab-content > .tab-pane` (`display: none`, the resting/hidden state before `.active` reveals it) | Bridge: `.react-aria-TabPanel[data-inert] { display: none; }` — only reachable when a consumer passes `shouldForceMount` (not exposed as a dedicated prop; passthrough only) |
| `data-entering` / `data-exiting` | No Bootstrap equivalent — Bootstrap's `.fade`/`.show` mechanism assumes all panes are co-present in the DOM and toggled via `display`; React Aria instead mounts only the active panel and animates via these two attributes | Retain existing custom (non-Bootstrap) opacity-transition CSS; do not apply `.fade`/`.show` classes (see DOM conflicts) |

**SelectionIndicator** — suppressed per Decision D2. No state mappings apply; it must not be styled into visibility.

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|---|---|---|---|---|
| Tab | MAJOR — element-type substitution (M018) | `<button type="button" role="tab">` (JS-powered tabs pattern) or `<a role="tab">` (static-nav pattern) | `<div role="tab">` by default; `<a role="tab">` only when `href` is supplied; **never** a real `<button>` | Native `:disabled`/`:hover`/`:focus-visible` pseudo-classes still work for hover/focus (any focusable, hoverable element supports them — no invalidation there), but `.nav-link:disabled` can **never** match a div or plain `<a>` (CSS spec restricts `:disabled` to actual form-disableable elements). All disabled-state visual styling must go through the `[data-disabled]` class-based bridge, matching Bootstrap's own static-nav fallback convention rather than its JS-tabs `disabled`-attribute convention. `_reboot.scss`'s `button`-reset rules are not applicable (Tab never renders `<button>`); its `a`-reset rules are moot since `.nav-link` already resets `text-decoration`/`color`/`background` itself regardless of tag. |
| TabList | MINOR — element-type substitution | `<ul role="tablist">` | `<div role="tablist">` | No invalidated rule — `.nav`'s `list-style: none`/`padding-left: 0` etc. are class-scoped, not `ul`-tag-scoped, so they apply identically to a `<div>`. |
| Tab (list-item wrapper) | MINOR | `<li class="nav-item" role="presentation">` wraps each `.nav-link` | No wrapper — `Tab` renders directly as a flex child of `TabList` | No conflict — Bootstrap explicitly supports the no-wrapper case via its own fallback selectors (`.nav-fill > .nav-link`, `.nav-justified > .nav-link`), confirmed in compiled CSS. `.nav-item` is documented in `components.md` as an "optional" convention wrapper. |
| Tabs / TabList+TabPanels nesting | MINOR | Two independent sibling trees (`.nav-tabs` list and `.tab-content`), linked purely by `data-bs-target`/`id` and `aria-controls`/`aria-labelledby` — never by DOM position | React Aria nests `TabList` and `TabPanels` together inside a shared `<div class="react-aria-Tabs">` wrapper | No conflict — per `patterns.md`, Nav/Tabs' tab↔panel linkage has zero CSS relational-selector dependency, so wrapping both trees in a shared parent changes nothing Bootstrap-relevant. |
| TabPanel | MINOR | `<div class="tab-pane fade" role="tabpanel">`; all panes co-present in DOM, toggled via `.tab-content > .tab-pane { display:none }` / `.tab-content > .active { display:block }` | React Aria mounts only the selected panel by default (inactive ones are unmounted, not hidden), and drives its own cross-fade via `[data-entering]`/`[data-exiting]` | No conflict, but do **not** apply `.tab-pane`/`.fade`/`.show` classes — none of their rules (a pure display-toggle mechanism) are relevant once mount/unmount already achieves the same end-visual result through React Aria's own (different) mechanism. |
| SelectionIndicator | CRITICAL (M006, resolved) | No Bootstrap element, class, or pattern exists for a floating/animated active-tab indicator overlay | React Aria's `Tab` unconditionally renders a child `<div class="react-aria-SelectionIndicator">` | **RESOLVED (D2):** suppress entirely (e.g. `display: none` in the bridge, or remove the render call — the latter is a Stage 5/`src/Tabs.tsx` implementation concern, out of scope for Stage 4). Rely solely on `[data-selected]` styling applied to `.nav-link` itself, matching Bootstrap's native `.nav-underline .nav-link.active` convention. |

### Reference story canvas

All specimens use the `.nav-underline` style per Decision D1 (the only Bootstrap Nav/Tabs style in scope). `SelectionIndicator` is never rendered in any specimen (D2 — it doesn't exist in the Bootstrap target appearance).

1. **Default** — horizontal `<ul class="nav nav-underline">` (per Bootstrap's own list-based markup; React Aria itself renders `<div>`, but reference stories depict Bootstrap's *target* appearance, not React Aria's DOM — consistent with every other reference story in this batch) with four tabs: "Home" (active), "Profile", "Settings", "Disabled" (disabled). Paired with a `.tab-content` below containing one `.tab-pane` of placeholder content for "Home" (the active tab). Demonstrates P-005-equivalent realism: the visible panel content matches the visibly active tab.
2. **States** — full interactive state matrix for the `.nav-underline` `.nav-link`, per P-009/P-013 (single variant family in scope, so one matrix suffices):
   - Default / resting
   - Hover (`.faux-hover`)
   - Focus-visible (`.faux-focus-visible`)
   - Selected / active (`.active` — real Bootstrap class, no faux class needed per P-007/P-001)
   - Disabled (`.disabled` + `aria-disabled="true"` — real Bootstrap class, no faux class needed)
   - Selected + Disabled combined (`.active.disabled` — demonstrates the cascade-resolution behavior documented in State mappings above: active color/weight/underline wins, disabled pointer-events/cursor still applies)
   Each specimen individually labeled per P-008.
3. **Vertical** — `.nav.nav-underline.flex-column` tab list beside a `.tab-content`, mirroring Bootstrap's documented vertical-pills layout pattern (`d-flex align-items-start` wrapper, `.flex-column` on the nav) but adapted to `.nav-underline` (Bootstrap's docs only demonstrate `.flex-column` + `.nav-pills`; the combination with `.nav-underline` is a valid but undocumented composition per M011/M017 — `.flex-column`'s only relevant declaration is `flex-direction: column`, which is orthogonal to the `.nav-underline` variant's own rules). One tab active, content panel to the right.
4. **Fill / Justified** — two specimens, each a `.nav.nav-underline.nav-fill` and `.nav.nav-underline.nav-justified` respectively, both using at least one short label ("Tab") and one long label ("Much longer nav link") per P-020, to visibly demonstrate the different width-distribution behavior (`nav-fill`: proportional to content; `nav-justified`: forced equal width) that these two custom-prop-exposed classes (D3) produce.

**Specimen data (P-020):** Default/States stories use the labels "Home"/"Profile"/"Settings"/"Disabled" (four short, roughly-equal-width labels — width is not content-driven in the default flow layout, tabs simply size to their own text like inline flex items). The Fill/Justified story is the one place sizing *is* content-driven and must show at least two different-length labels held against the same container width, per P-020's explicit instruction for content-driven dimensions.

### Confidence

**High.** Bootstrap's Nav/Tabs component is a Section 2 "compound pattern" in `patterns.md` but its only relational selector (`.nav-link.active`, a class-stacked selector) is fully preserved by React Aria's flat DOM — there is no ancestor/sibling relationship at risk the way there is for, e.g., Dropdown. The compiled CSS for `.nav`, `.nav-link`, `.nav-underline`, `.nav-fill`, `.nav-justified`, and `.tab-content > .tab-pane` was read directly (M007), not inferred from SCSS source alone. The one area of residual uncertainty is Stage 5's exact mechanism for suppressing `SelectionIndicator` (CSS-only `display:none` vs. removing the render call in `src/Tabs.tsx`) — left as an implementation choice for Stage 5, not a Stage 4 blocker.

Per Blank-Slate Mode: git history and any prior iteration's deleted/removed content were not consulted for this taxonomy. The existing (pre-Stage-4) `src/Tabs.css` and `src/Tabs.tsx` were read only as currently-present working-tree files describing the component's current implementation surface (sub-parts, existing `data-*` usage) — not as a source of prior Bootstrap-mapping conclusions, none of which existed there (that file predates this experiment and contains no Bootstrap classes at all).

## Decisions

### D1 — Nav style variant exposure
**Question:** Bootstrap's Nav/Tabs component offers three visually distinct style variants for the tab list — `.nav-tabs` (bordered, visually connects to the panel below via a border-color trick), `.nav-pills` (solid rounded-pill active state), and `.nav-underline` (colored bottom-border + bold active text) — with no React Aria `Tabs`/`TabList` prop equivalent to select among them. Should this library expose a custom prop to switch between them, fix one as the permanent default, or leave it as a passthrough-only concern?
**Answer:** Fix one default — use Bootstrap's `.nav-underline` as the only supported nav style; no prop for switching between `.nav-tabs`/`.nav-pills`/`.nav-underline`.

### D2 — `SelectionIndicator`'s role given no Bootstrap counterpart
**Question:** React Aria's `<Tab>` always renders a child `<SelectionIndicator>` — an absolutely-positioned, animated bar/pill overlay with no Bootstrap equivalent (Bootstrap expresses "active" purely via static classes/colors on `.nav-link.active` itself, no separate element, no animation). Should the animated overlay be kept and styled to reproduce the chosen variant's active look, suppressed entirely in favor of static `[data-selected]` styling, or handled as a per-variant hybrid?
**Answer:** Suppress it entirely; rely on static `[data-selected]` styling on the tab itself (matches native Bootstrap `.nav-link.active` convention). The applied component class for the active-state visual is `.nav-link` (via the `[data-selected]` bridge) — `SelectionIndicator` contributes no class and renders no visible output.

### D3 — Fill/justify layout exposure
**Question:** Bootstrap offers `.nav-fill` (tabs proportionally fill available width) and `.nav-justified` (tabs forced to equal width) modifier classes for the tab list, with no React Aria `TabList` prop equivalent. Should this be exposed as a custom prop, left passthrough-only, or excluded from scope?
**Answer:** Custom prop — add a prop to this library's `Tabs` wrapper that applies `.nav-fill` or `.nav-justified` directly.
