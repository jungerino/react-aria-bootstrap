---
title: For Consolidated Experiment — Carrying-Forward Notes
source-branches: bootstrap-mapping, reference-stories_0
---

# For Consolidated Experiment — Carrying-Forward Notes

This file gathers everything to carry into the next experiment, which consolidates taxonomy formation, Bootstrap↔React Aria state mapping, and reference story production into a single workflow. It is input material for writing the new skill and iteration protocol.

**What is changing:** The prior workflow separated (a) Bootstrap↔React Aria mapping (`bootstrap-mapping` branch, `agent/mapping-table.md`) from (b) reference story production (`reference-stories` branch). The new consolidated workflow produces both in a single pass, organized per component. The mapping table as a standalone artifact is retired; bridge strategy and DOM conflict analysis move into the taxonomy document.

**What is not changing:** The KB (`agent/bootstrap-kb/`), the bootstrap-mapping-skill methodology principles, and the reference story construction principles all carry forward. They are assembled here for use in writing the new skill.

---

## Part 1 — Methodology: Sub-part Identification

### M001: dom-first — Match Bootstrap's component to React Aria's rendered output, not to the component name

Before choosing a Bootstrap counterpart, look at what React Aria actually renders in the DOM. Use `mcp__react-aria__get_react_aria_page` to read the component's documentation and understand its DOM structure and sub-parts. A component named `Select` does not map to Bootstrap's `.form-select` — it renders a `<button>` + Popover + ListBox, which maps to the dropdown pattern. Always inspect the rendered output first.

### M002: sub-parts — Extend counterpart identification to every named sub-element; sub-parts may have independent Bootstrap counterparts

Each React Aria component exposes named sub-parts (e.g. ComboBox renders Button, Input, ListBox, Popover). Each sub-part needs its own row with its own Bootstrap counterpart. Different sub-parts may map to entirely different Bootstrap components — this is a first-class case called a **composite mapping**. Do not assume all sub-parts share the same counterpart as the root, and do not map only the root element. The mapping type (1:1 vs. composite) is determined by whether sub-parts fall within the same Bootstrap component's pattern or cross into different ones.

### M006: no-counterpart — Handling components with no direct Bootstrap counterpart

When no Bootstrap component class matches: (1) flag with `[NO DIRECT COUNTERPART]`; (2) identify the closest Bootstrap structural pattern; (3) identify the closest Bootstrap visual pattern; (4) list alternatives considered. Example: Calendar date cells have no Bootstrap calendar component → closest structural pattern is `.btn` for cells; Bootstrap utilities for layout.

### M010: content-states — When a React Aria state renders a child element, scan Bootstrap's component catalog before declaring no counterpart

When a React Aria state drives the presence of a child element (spinner, badge, icon, indicator) rather than a visual change on existing elements, do not default to `[NO DIRECT COUNTERPART]` without first scanning Bootstrap's full component catalog for an embeddable component that fulfills that display role.

M004 (three-bridges) covers CSS-level bridges — pseudo-class, compound selector, override layer. It does not cover states where the response is a new DOM element rendered as a child.

**Key Bootstrap embeddable components for state-driven content:**
- **Loading/pending** → `.spinner-border.spinner-border-sm` or `.spinner-grow.spinner-grow-sm`; both inherit color from `currentColor`; Bootstrap's own docs show `.spinner-border-sm` inside a disabled `.btn` as the canonical pending button pattern
- **Counts / labels** → `.badge`
- **Dismissible** → `.btn-close`

Scan `agent/bootstrap-kb/components.md` for candidate components when a state implies content presence.

### M014: dual-counterpart — When structural and semantic counterparts diverge, use both

When M001 (dom-first) finds that the semantically obvious Bootstrap counterpart targets a different element type than React Aria renders, treat the two counterparts as serving separate concerns:

- **Structural counterpart** (the DOM-first match): drives class assignments, state bridges, and ARIA wiring.
- **Semantic/visual counterpart** (the name-match that lost the structural test): drives token overrides for sizing, spacing, color, border, and shape.

Apply visual token overrides from the semantic counterpart to the structural element. Do not assume the structural counterpart's default appearance is appropriate — its defaults are optimized for its own use case.

**Example:** Select trigger renders `<button>` (structural counterpart: `.btn.dropdown-toggle`), but the visual target is `.form-select`. Use `.btn.dropdown-toggle` for class assignment and bridge strategy; apply `.form-select` token overrides for appearance.

---

## Part 2 — Methodology: State Mappings and Bridge Strategy

### M008: data-attrs — Read the full data-* attribute surface from React Aria docs

For each component, call `mcp__react-aria__get_react_aria_page` and enumerate every `data-*` attribute listed in the documentation before filling the state mappings. Do not rely on recall. Map every attribute — missing a state is a mapping gap.

### M004: three-bridges — Three bridge strategies for state mapping

For each React Aria `data-*` attribute, choose one of three strategies:

1. **CSS pseudo-class overlap** — React Aria's `[data-focused]` is redundant with `:focus-visible`; Bootstrap's `:hover` maps to `[data-hovered]`. Record as "no bridge needed — CSS pseudo-class overlap."
2. **Compound selector** — React Aria never adds `.active`/`.show`, so reproduce Bootstrap's state styling via `[data-selected]` in a compound selector (e.g. `.react-aria-ListBoxItem[data-selected]` → `.list-group-item.active` visual).
3. **`_bootstrap-overrides.scss`** — Global bridge layer; use for rules shared across multiple components.

### M007: scss-verify and pseudo-class selector audit

**Token verification:** Do not infer `--bs-*` token names by pattern. Before recording any token, confirm it exists in `_root.scss` or the component's own SCSS file. Names can be misleading (e.g. `--bs-input-focus-color` is the *text* color when focused, not the focus ring color).

**Compiled CSS is authoritative for the selector surface.** Bootstrap uses `@each` loops and mixin interpolation to generate selectors (e.g. `.was-validated .form-control:invalid`) that do not appear as literal strings in the SCSS source. Always grep the compiled CSS at `node_modules/bootstrap/dist/css/bootstrap.css` for a component's primary class before finalising state mappings.

**Pseudo-class selector audit:** For each Bootstrap pseudo-class selector that applies to the component (`:hover`, `:focus`, `:focus-visible`, `:disabled`, `:checked`, `:invalid`, `:valid`, etc.), explicitly document whether the selector fires (ACTIVE) or is inert (INERT) in a React Aria context. Do not silently omit inert selectors — a reader cannot tell whether an omitted selector was considered and dismissed or simply missed.

**INERT heuristic (from bootstrap-mapping iteration 3):** After four mapping iterations across seven components, two classes of selectors consistently produce INERT classifications and can be pre-classified without individual inspection:

1. **Class-based state selectors** — `.active`, `.disabled`, `.show`, `.is-valid`, `.is-invalid`, `.open` — React Aria never adds these classes; they are always INERT. The compound selector bridge (M004) is required.
2. **Native-element pseudo-classes on custom controls** — `:checked`, `:disabled`, `:indeterminate` — fire on the native `<input>`, not on React Aria's custom visual element. Always INERT when the sub-part is a custom visual element (M012).

The per-selector audit remains necessary for `:hover`, `:focus-visible`, and `:focus` — these fire normally on most React Aria elements and must be individually assessed.

### M012: custom-controls — React Aria's hidden-input pattern is the preferred styling surface

React Aria's custom form controls (Checkbox, Radio, Switch, Slider, Select) render a hidden native `<input>` for form submission and accessibility, alongside a custom visual element for appearance.

When mapping Bootstrap form classes that target native inputs (`.form-check-input`, `.form-select`, etc.):
- **Apply Bootstrap form classes to the custom visual element** to inherit token defaults — sizing, `border-radius`, etc.
- **Do not apply Bootstrap form classes to the hidden native input** — it is invisible.
- **All state styling uses `[data-*]` compound selector bridges** — native pseudo-classes (`:checked`, `:indeterminate`, `:focus`, `:disabled`) fire on the hidden input, not on the custom visual element. This is not a conflict to work around; it is the expected structural reality.

---

## Part 3 — Methodology: Variants and Structural Variants

### M015: variant-authority — Variant mapping is exclusive, not bridged

When Bootstrap's variant vocabulary is authoritative for a sub-part, list Bootstrap's variants as the complete and final set. React Aria-only variant values are out of scope — do not nearest-match or approximate them. The mapping is adopting Bootstrap's design system, not translating React Aria's.

For React Aria structural variants (props like `orientation`, `layout`, `selectionMode`): check for a Bootstrap modifier class equivalent per component. If one exists, map it. If not, note "custom CSS required." Structural variants are not dropped.

### M011: structural-variants — A Bootstrap structural variant is in scope if it reuses the same sub-parts in a different arrangement

A Bootstrap variant that requires a different DOM structure (not just a modifier class) is still in scope if it satisfies all three conditions:
1. **Same sub-parts** — the same React Aria sub-components are used
2. **Same sub-part → Bootstrap class assignments** — unchanged
3. **Same accessibility behavior** — React Aria's ARIA wiring and keyboard handling are unchanged

What may differ: DOM ordering, an added wrapper element, or a wrapper modifier class.

**Out of scope:** A variant that requires a different React Aria primitive.

### M017: css-delta — Document the minimum CSS delta for structural variants with no Bootstrap modifier class

When a React Aria structural variant has no Bootstrap modifier class equivalent, document the minimum CSS delta: which specific properties change and what values they take. This gives the implementation phase a concrete starting point. Flag any hardcoded numeric values (column count, gap, size) as configurable candidates per M016.

---

## Part 4 — Methodology: Decisions Needed

### M016: decisions-needed — Surface genuine forks as explicit questions; do not resolve unilaterally

When the mapping encounters a genuine fork — multiple legitimate Bootstrap variants for the same semantic role, or a React Aria feature with multiple viable Bootstrap implementation paths — do not resolve it unilaterally. Insert a **Decisions needed** section listing each open question, the available options, and their trade-offs. Stop short of recommending an answer.

**Four trigger patterns** must elevate items to Decisions needed:

1. **Variant exposure** — When Bootstrap offers modifier classes with no React Aria prop equivalent, flag whether those classes will be exposed as a component prop, left as a passthrough, or excluded from scope.
2. **"Design choice" notes** — Any Variants table entry explicitly noted as "design choice" is unresolved. Elevate it.
3. **Cross-component consistency** — When a sub-part pattern (SelectionIndicator, ghost button, icon source) was already resolved for another component in the same session, check consistency. If the current component differs, flag the inconsistency as a fork.
4. **Hardcoded numeric values in CSS deltas** — Flag as configurable candidates. Propose a CSS custom property or prop.

---

## Part 5 — Methodology: KB Usage

### M003: kb-sequence — Load KB files in a specific sequence per component

For each component: (1) load `README.md` to identify which component entry and cross-references apply; (2) load `components.md` section for the matched Bootstrap component; (3) load `states.md`; (4) load `patterns.md` section if a DOM conflict entry exists. Cross-reference `tokens.md` when filling the tokens column.

### KB retrieval rules

| Question | File to consult |
|----------|----------------|
| "What `--bs-*` token controls X?" | `agent/bootstrap-kb/tokens.md` |
| "What state selector does Bootstrap use for Z?" | `agent/bootstrap-kb/states.md` |
| "What DOM structure does Bootstrap's X expect?" | `agent/bootstrap-kb/components.md` |
| "Will React Aria's X conflict with Bootstrap?" | `agent/bootstrap-kb/patterns.md` |
| "What utility class does Y?" | `agent/bootstrap-kb/utilities.md` |

### Source file reference

- **Compiled CSS** (`node_modules/bootstrap/dist/css/bootstrap.css`) — authoritative for the complete selector surface, including mixin-generated selectors. Grep this file for the pseudo-class selector audit.
- **SCSS source** (`src/scss/vendor/bootstrap-5.3.8/`) — authoritative for token names, variable values, and source structure. Use `_root.scss` and component-specific files (e.g. `_buttons.scss`, `forms/_form-check.scss`) for token verification.

---

## Part 6 — Methodology: Icons and Indicators

### M013: bs-icons — Prefer Bootstrap Icons over inline SVG for indicator and icon elements

When a sub-part renders an icon or visual indicator (checkmark, dash, chevron, close, etc.), prefer Bootstrap Icons (`<i class="bi bi-{name}">`) over inline SVG or CSS `background-image` SVG data URIs.

Bootstrap Icons are an icon font: they inherit `currentColor`, scale with `font-size`, and align with Bootstrap's type scale without extra CSS.

**Common mappings:**

| Role | Bootstrap Icon |
|------|---------------|
| Checked (multi-select, Checkbox) | `bi-check` or `bi-check-lg` |
| Indeterminate (Checkbox) | `bi-dash-lg` |
| Chevron / select caret | `bi-chevron-down` |
| Close / dismiss | `bi-x-lg` |
| Calendar nav previous | `bi-chevron-left` |
| Calendar nav next | `bi-chevron-right` |

**Scope note:** M013 applies when a visual indicator element is warranted. A single-select ListBox indicates selection via `.active` class styling (background + text color change) — it has **no SelectionIndicator element**. Do not apply M013 to single-select selection state; there is nothing to render. M013 applies to multi-select indicators, explicit icon slots, and nav controls.

**Prerequisite:** `bootstrap-icons` installed and CSS imported (`import 'bootstrap-icons/font/bootstrap-icons.css'`).

---

## Part 7 — Reference Story Principles

### P-S001: Faux state classes for pseudo-class specimens

Reference stories must statically render all interactive states to support screenshot-based visual comparison. Never instruct the reviewer to interact with the browser to see a state.

For any pseudo-class state that produces visually distinct Bootstrap output, define a `.faux-{state}` utility class in `stories/bootstrap-test/bootstrap-reference/augments.scss` that applies the same CSS values as a static class rule.

For Bootstrap components that drive pseudo-class styles via CSS custom properties, scope the faux class to the component class to match Bootstrap's specificity:

```scss
.btn.faux-hover {
  color: var(--bs-btn-hover-color);
  background-color: var(--bs-btn-hover-bg);
  border-color: var(--bs-btn-hover-border-color);
}
.btn.faux-focus {
  color: var(--bs-btn-focus-color, var(--bs-btn-hover-color));
  background-color: var(--bs-btn-focus-bg, var(--bs-btn-hover-bg));
  border-color: var(--bs-btn-focus-border-color, var(--bs-btn-hover-border-color));
  box-shadow: var(--bs-btn-focus-box-shadow);
}
.btn.faux-active {
  color: var(--bs-btn-active-color);
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
}
```

Apply the same pattern for each component using its own CSS variable namespace. States representable via static HTML attributes or Bootstrap classes (e.g. `disabled`, `.active`, `.is-invalid`) do not need faux classes.

### P-S002: Reproduce the Bootstrap selector context for each specimen

For each sub-part specimen, search the compiled Bootstrap CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) for all selectors containing the sub-part's class. The specimen must reproduce whatever ancestor and sibling context those selectors require.

**Ancestor context:** Required when selectors contain `.ancestor .sub-part`, or when CSS custom properties referenced via `var()` are defined on an ancestor class rather than `:root`.

**Sibling context:** Required when selectors use adjacent sibling combinators or position pseudo-classes (`:first-child`, `:last-child`) that would affect the visual state being shown.

### P-T001: Err on the side of over-inclusion

Include all substantive sub-parts in a component's reference stories, even if the Bootstrap class appears in another component's stories. Sharing a class name is not grounds for omission — compound selectors in the implementation can produce different visual results for the same Bootstrap class in different component contexts. Never use "covered in another component's story" as justification for omitting a sub-part.

### P-T002: Reference stories show target appearances only

Reference stories depict what a correctly styled component should look like — they are visual targets. Never include specimens that show an incorrect, unstyled, or intermediate state as a contrast or "baseline." Implementation challenges are documented in the taxonomy's DOM conflicts and decisions-needed sections, not illustrated in reference stories.

---

## Part 8 — Expanded Taxonomy Format

The consolidated taxonomy replaces both the prior taxonomy file and the per-component mapping table entry. Token tables are omitted (covered by `agent/bootstrap-kb/tokens.md`). Reference story canvas layout is included as a taxonomy section.

```markdown
## ComponentName

**React Aria root class:** `.react-aria-ComponentName`
**Mapping type:** 1:1 — [Bootstrap Component] | Composite — (see sub-parts table)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-ComponentName` | [Bootstrap component] | `.bs-class` |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Color | … | `.btn-primary`, `.btn-secondary`, … | Bootstrap | React Aria quiet/destructive out of scope |
| Size | (none) | `.btn-sm`, `.btn-lg` | Bootstrap | — |

### State mappings

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Root | `:hover` | No bridge needed — CSS pseudo-class overlap |
| Selected | `[data-selected]` | Root | `.active` | Compound selector: `.react-aria-X[data-selected]` |

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| Root | MINOR | `<button>` | `<button>` | No conflict |

*(Conflict types: MINOR — works with bridge; MAJOR — requires workaround; CRITICAL — structural incompatibility)*

### Reference story canvas

- **Stories (sub-parts):** [list each sub-part that gets a story]
- **Grid columns:** [number]
- **Width constraint:** [~1280px or note if wider]
- **Notes:** [any layout decisions, e.g. dark-background wrapper for light variants]

### Decisions needed

*(Omit section if no genuine forks. One numbered question per fork: the choice, options, trade-offs.)*

### Confidence: High / Medium / Low

*Note reason if Medium or Low.*
```

**Rules for mapping type:**
- Use **1:1** when the component as a whole aligns with one Bootstrap component — even if sub-parts use different classes within that component's pattern.
- Use **Composite** when two or more sub-parts each have a meaningfully different Bootstrap *component* as their counterpart (different token space, different structural pattern).

---

## Part 9 — Per-Component Work Sequence

For each component in the iteration:

1. **Read React Aria docs** — call `mcp__react-aria__get_react_aria_page`. Enumerate every `data-*` attribute listed before writing any state mappings (M008).
2. **Load KB** per M003 sequence — `README.md` → `components.md` entry → `states.md` → `patterns.md` if applicable.
3. **Apply INERT heuristic** — pre-classify class-based state selectors and native-element pseudo-classes as INERT; audit `:hover`, `:focus-visible`, `:focus` individually.
4. **Write the taxonomy entry** before moving to the next component. Do not hold all entries in memory.

After all components: run the self-review checklist.

---

## Part 10 — Prior Resolved Decisions

These decisions were made during the `bootstrap-mapping` experiment and should not be re-opened:

**Tabs — default nav variant:** `.nav-underline`. Rationale: the underline indicator is visually closest to React Aria's `SelectionIndicator` animated underline pattern, and `.nav-underline` adapts more naturally to vertical orientation (an underline becomes a left/right border, whereas `.nav-tabs` and `.nav-pills` require more override work for vertical layouts).

**Calendar — ghost button pattern:** Both nav buttons and unselected date cells use the same ghost button pattern — no background and no border by default; background appears on hover/focus. Approximated via `.btn-outline-secondary` with `border-color: transparent` override. Button content uses `var(--bs-body-color)` for light/dark theming. This pattern is unified across nav controls and date cells.

**Multi-select indicator (Select and ListBox):** Multi-select items render the full `div.indicator` from the Checkbox component — the styled custom-control indicator element — not a bare `bi-check` icon. This reuses existing component styling and keeps multi-select UX consistent with Checkbox across all components.

**Select trigger counterpart:** M014 dual-counterpart applies. Structural counterpart is `.btn.dropdown-toggle` (DOM-first match); semantic/visual counterpart is `.form-select` (drives token overrides for appearance). The two are not interchangeable — apply both.

---

## Part 11 — Self-Review Checklist

Before submitting any iteration output, verify:

- [ ] Every named React Aria sub-part has its own row in the sub-parts table
- [ ] Every `data-*` attribute listed in the React Aria docs appears in state mappings
- [ ] INERT heuristic applied: class-based state selectors and native-element pseudo-classes pre-classified as INERT; `:hover`, `:focus-visible`, `:focus` individually audited
- [ ] Every DOM conflict has a proposed resolution and a conflict type (MINOR/MAJOR/CRITICAL)
- [ ] Confidence rating assigned; reason given for anything below High
- [ ] `[NO DIRECT COUNTERPART]` flags include the closest structural pattern, closest visual pattern, and alternatives considered (M006)
- [ ] Variants table present; Bootstrap visual variants listed as the complete set; React Aria-only visual variants excluded (not nearest-matched); structural variants mapped or noted as "custom CSS required"
- [ ] Genuine forks surfaced in Decisions needed; no fork resolved unilaterally (M016)
- [ ] All four M016 trigger patterns checked: variant exposure, "design choice" entries, cross-component consistency, hardcoded numeric values in CSS deltas
- [ ] Prior resolved decisions (Tabs, Calendar ghost button, multi-select indicator, Select trigger) carried forward without re-opening
- [ ] Reference story canvas section present: stories list, grid columns, width constraint, layout notes
- [ ] P-T001 applied: no sub-part omitted on grounds of "covered in another component's story"
- [ ] P-T002 applied: no failure-case or unstyled-baseline specimens planned
