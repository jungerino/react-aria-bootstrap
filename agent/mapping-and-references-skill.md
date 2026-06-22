---
title: Mapping and References Skill
status: iteration 0 pending — consolidated from bootstrap-mapping and reference-stories experiments
---

# Mapping and References Skill

This skill guides the consolidated workflow: for each component in an iteration, produce a taxonomy document covering sub-part identification, state mappings with bridge strategy, DOM conflicts, variants, and decisions needed — then implement the approved taxonomy as Storybook reference stories.

It consolidates methodology principles from the `bootstrap-mapping` experiment (M-codes) and reference story construction principles from the `reference-stories` experiment (P-codes) into a single reference.

---

## Part 1 — Sub-part Identification

### M001: dom-first — Match Bootstrap's component to React Aria's rendered output, not to the component name

Before choosing a Bootstrap counterpart, look at what React Aria actually renders in the DOM. Use `mcp__react-aria__get_react_aria_page` to read the component's documentation and understand its DOM structure and sub-parts. A component named `Select` does not map to Bootstrap's `.form-select` — it renders a `<button>` + Popover + ListBox, which maps to the dropdown pattern. Always inspect the rendered output first.

### M002: sub-parts — Extend counterpart identification to every named sub-element; sub-parts may have independent Bootstrap counterparts

Each React Aria component exposes named sub-parts (e.g. ComboBox renders Button, Input, ListBox, Popover). Each sub-part needs its own row with its own Bootstrap counterpart. Different sub-parts may map to entirely different Bootstrap components — this is a first-class case called a **composite mapping**. Do not assume all sub-parts share the same counterpart as the root, and do not map only the root element.

**Mapping type classification:**
- Use **1:1** when the component as a whole aligns with one Bootstrap component — even if sub-parts use different classes within that component's pattern.
- Use **Composite** when two or more sub-parts each have a meaningfully different Bootstrap *component* as their counterpart (different token space, different structural pattern).

### M006: no-counterpart — Handling components with no direct Bootstrap counterpart

When no Bootstrap component class matches: (1) flag with `[NO DIRECT COUNTERPART]`; (2) identify the closest Bootstrap structural pattern; (3) identify the closest Bootstrap visual pattern; (4) list alternatives considered. Example: Calendar date cells have no Bootstrap calendar component → closest structural pattern is `.btn` for cells; Bootstrap utilities for layout.

### M010: content-states — When a React Aria state renders a child element, scan Bootstrap's component catalog before declaring no counterpart

When a React Aria state drives the presence of a child element (spinner, badge, icon, indicator) rather than a visual change on existing elements, do not default to `[NO DIRECT COUNTERPART]` without first scanning Bootstrap's full component catalog for an embeddable component that fulfills that display role.

M004 (three-bridges) covers CSS-level bridges — pseudo-class, compound selector, override layer. It does not cover states where the response is a new DOM element rendered as a child.

**Key Bootstrap embeddable components for state-driven content:**
- **Loading/pending** → `.spinner-border.spinner-border-sm` or `.spinner-grow.spinner-grow-sm`; both inherit color from `currentColor`; Bootstrap's own docs show `.spinner-border-sm` inside a disabled `.btn` as the canonical pending button pattern
- **Counts / labels** → `.badge`
- **Dismissible** → `.btn-close`
- **Selection indicator** → `.form-check-input` (checkbox or radio); selected/checked states on selectable items commonly drive a visible indicator child element rather than (or in addition to) a visual change on the item itself — always check whether `[data-selected]` or `[data-checked]` implies indicator content, and whether that indicator varies by selection mode or behavior

Scan `agent/bootstrap-kb/components.md` for candidate components when a state implies content presence.

### M018: elem-type-sub — Document element type substitutions in the DOM conflicts section

When React Aria renders a different HTML element type than the Bootstrap counterpart assumes for a sub-part (e.g. `<span>` where Bootstrap expects `<label>`, `<div>` where Bootstrap expects `<button>`), record the substitution in the taxonomy's `DOM conflicts` section as a distinct category from structural conflicts (wrapper insertion, broken selector paths). For each substitution, record: (1) which element React Aria renders and which Bootstrap expects; (2) which Bootstrap component-level rules are invalidated — rules whose selectors scope to the original element type; (3) a flag that the component agent must audit `_reboot.scss` for additional invalidated rules. Identifying substitutions at taxonomy time ensures the component agent addresses them during implementation rather than discovering them in pixel-diff cycling.

### M014: dual-counterpart — When structural and semantic counterparts diverge, use both

When M001 (dom-first) finds that the semantically obvious Bootstrap counterpart targets a different element type than React Aria renders, treat the two counterparts as serving separate concerns:

- **Structural counterpart** (the DOM-first match): drives class assignments, state bridges, and ARIA wiring.
- **Semantic/visual counterpart** (the name-match that lost the structural test): drives token overrides for sizing, spacing, color, border, and shape.

Apply visual token overrides from the semantic counterpart to the structural element. Do not assume the structural counterpart's default appearance is appropriate — its defaults are optimized for its own use case.

**Example:** Select trigger renders `<button>` (structural counterpart: `.btn.dropdown-toggle`), but the visual target is `.form-select`. Use `.btn.dropdown-toggle` for class assignment and bridge strategy; apply `.form-select` token overrides for appearance.

---

## Part 2 — State Mappings and Bridge Strategy

### M008: data-attrs — Read the full data-* attribute surface from React Aria docs

For each component, call `mcp__react-aria__get_react_aria_page` and enumerate every `data-*` attribute listed in the documentation before filling the state mappings. Do not rely on recall. Map every attribute — missing a state is a mapping gap.

### M004: three-bridges — Three bridge strategies for state mapping

For each React Aria `data-*` attribute, choose one of three strategies:

1. **CSS pseudo-class overlap** — React Aria's `[data-focused]` is redundant with `:focus-visible`; Bootstrap's `:hover` maps to `[data-hovered]`. Record as "no bridge needed — CSS pseudo-class overlap."
2. **Compound selector** — React Aria never adds `.active`/`.show`, so reproduce Bootstrap's state styling via `[data-selected]` in a compound selector (e.g. `.react-aria-ListBoxItem[data-selected]` → `.list-group-item.active` visual).
3. **`_bootstrap-bridges.scss`** — Global bridge layer at `src/scss/_bootstrap-bridges.scss`; use for rules shared across multiple components.

### M007: scss-verify and pseudo-class selector audit

**Token verification:** Do not infer `--bs-*` token names by pattern. Before recording any token, confirm it exists in `_root.scss` or the component's own SCSS file. Names can be misleading (e.g. `--bs-input-focus-color` is the *text* color when focused, not the focus ring color).

**Compiled CSS is authoritative for the selector surface.** Bootstrap uses `@each` loops and mixin interpolation to generate selectors (e.g. `.was-validated .form-control:invalid`) that do not appear as literal strings in the SCSS source. Always grep the compiled CSS at `node_modules/bootstrap/dist/css/bootstrap.css` for a component's primary class before finalising state mappings.

**Pseudo-class selector audit:** For each Bootstrap pseudo-class selector that applies to the component (`:hover`, `:focus`, `:focus-visible`, `:disabled`, `:checked`, `:invalid`, `:valid`, etc.), explicitly document whether the selector fires (ACTIVE) or is inert (INERT) in a React Aria context. Do not silently omit inert selectors — a reader cannot tell whether an omitted selector was considered and dismissed or simply missed.

**INERT heuristic:** After four mapping iterations across seven components, two classes of selectors consistently produce INERT classifications and can be pre-classified without individual inspection:

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

## Part 3 — Variants

### M015: variant-authority — Variant mapping is exclusive, not bridged

When Bootstrap's variant vocabulary is authoritative for a sub-part, list Bootstrap's variants as the complete and final set. React Aria-only variant values are out of scope — do not nearest-match or approximate them. The mapping is adopting Bootstrap's design system, not translating React Aria's.

For React Aria structural variants (props like `orientation`, `layout`, `selectionMode`, `selectionBehavior`): check for a Bootstrap modifier class equivalent per component. If one exists, map it. If not, note "custom CSS required." Structural variants are not dropped. Note that some behavioral variants (e.g. `selectionBehavior`) affect rendered sub-parts as well as interaction — enumerate them in the Variants table and re-check the sub-parts table for any indicator or affordance elements they introduce.

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

## Part 4 — Decisions Needed

### M016: decisions-needed — Surface genuine forks as explicit questions; do not resolve unilaterally

When the mapping encounters a genuine fork — multiple legitimate Bootstrap variants for the same semantic role, or a React Aria feature with multiple viable Bootstrap implementation paths — do not resolve it unilaterally. Record each open question in the **`## Stage 4`** section of the current `agent/logs/batch-{N}.md`, under a **Decisions needed** heading. Stop short of recommending an answer.

Once the user resolves a decision, record the answer in the `## Decisions` section of the component's taxonomy doc (`agent/taxonomies/{component}-taxonomy.md`). The batch log retains the original questions as a historical record.

**Taxonomy doc template** (write to `agent/taxonomies/{Component}-taxonomy.md`):

```markdown
---
title: {Component} Taxonomy
component: {Component}
iteration: {N}
---

## {Component}

**React Aria root class:** `.react-aria-{Component}`
**Mapping type:** [1:1 | Composite — sub-part → counterpart, ...]

### Sub-parts
[Table: Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes]

### Variants
[Table: Dimension | React Aria | Bootstrap | Authority | Notes]

### State mappings
[Per sub-part: table of data-* attribute | sub-part | Bootstrap equivalent | bridge strategy]
[Pseudo-class audit per sub-part: ACTIVE/INERT classification for each pseudo-class]

### DOM conflicts
[Table: Sub-part | Conflict type (CRITICAL/MAJOR/MINOR) | Bootstrap expects | React Aria renders | Resolution]

### Reference story canvas
[List of stories to write; grid columns; width constraints; layout and rendering notes]

### Confidence
[High/Medium/Low with rationale]

## Decisions
[Resolved user decisions from Q&A — the authoritative record for Stage 5 to consume]
```

**Four trigger patterns** must elevate items to Decisions needed:

1. **Variant exposure** — When Bootstrap offers modifier classes with no React Aria prop equivalent, flag whether those classes will be exposed as a component prop, left as a passthrough, or excluded from scope.
2. **"Design choice" notes** — Any Variants table entry explicitly noted as "design choice" is unresolved. Elevate it.
3. **Cross-component consistency** — When a sub-part pattern (SelectionIndicator, ghost button, icon source) was already resolved for another component in the same session, check consistency. If the current component differs, flag the inconsistency as a fork.
4. **Hardcoded numeric values in CSS deltas** — Flag as configurable candidates. Propose a CSS custom property or prop.

---

## Part 5 — KB Usage

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

---

## Part 6 — Reference Story Construction

### Reference story template

Every reference story file follows this structure:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/{ComponentName}',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Source: https://getbootstrap.com/docs/5.3/components/{component-page}/
 */
export const {StoryName}: Story = {
  render: () => (
    // Bootstrap HTML from docs — with faux-state classes for interactive states
  ),
};
```

Import `presentation.scss` directly from the reference story (not via the global bundle). Use the `withBootstrap` decorator from `../_decorators` — this is applied via the meta decorator array, not imported separately.

### WebFetch: Fetch Bootstrap docs for reference story HTML

Before writing each story variant, fetch the relevant Bootstrap documentation page via WebFetch to obtain example HTML. Do not rely on recall for HTML structure — the docs are authoritative.

Primary docs URL pattern: `https://getbootstrap.com/docs/5.3/components/{component-name}/`

For form components: `https://getbootstrap.com/docs/5.3/forms/{form-component}/`

Annotate each story with its Bootstrap docs source URL in a JSDoc comment above the export.

### P-S001: Faux state classes for pseudo-class specimens

Reference stories must statically render all interactive states to support screenshot-based visual comparison. Never instruct the reviewer to interact with the browser to see a state.

For any pseudo-class state that produces visually distinct Bootstrap output, define a `.faux-{state}` utility class in `stories/react-aria-bootstrap/presentation.scss` that applies the same CSS values as a static class rule. Create as many `.faux-*` classes as needed — if Bootstrap styles a state distinctly, there should be a faux class for it.

For Bootstrap components that drive pseudo-class styles via CSS custom properties (most of them — `.btn`, `.list-group-item-action`, `.dropdown-item`, etc.), scope the faux class to the component class to match Bootstrap's specificity:

```scss
// Scope to the component class to match Bootstrap's specificity (no !important needed)
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
.btn.faux-focus-visible {
  // Same as faux-focus for .btn — Bootstrap uses :focus-visible for its focus ring
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

Apply the same pattern for each component using its own CSS variable namespace (e.g., `--bs-list-group-action-hover-*`, `--bs-dropdown-link-hover-*`). States representable via static HTML attributes or Bootstrap classes (e.g., `disabled`, `.active`, `.is-invalid`) do not need faux classes.

If `presentation.scss` does not yet have faux-state classes for the component being worked on, add them now.

### P-S002: Reproduce the Bootstrap selector context for each specimen

For each sub-part specimen, search the compiled Bootstrap CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) for all selectors containing the sub-part's class. The specimen must reproduce whatever ancestor and sibling context those selectors require.

**Ancestor context:** Required when selectors contain `.ancestor .sub-part` or `.ancestor > .sub-part`, or when CSS custom properties referenced via `var()` are defined on an ancestor class rather than `:root`. Nest as many levels deep as the selector chain requires.

**Sibling context:** Required when selectors use adjacent sibling combinators (`.sub-part + .sub-part`) or position pseudo-classes (`:first-child`, `:last-child`, `:not(:last-child)`) that would affect the visual state being shown. Add the minimum siblings needed to place the specimen in the correct position.

### P-S003: Use CSS classes, not inline styles

Reference story render functions should not use inline `style` props for visual styling. All visual CSS — including faux state values, layout, sizing, and spacing — belongs in `presentation.scss` as named classes. The story file applies class names only.

**Why:** `presentation.scss` is the single searchable source of truth for how Bootstrap appearances are represented statically. Inline styles scatter visual definitions across story files, cannot be grepped alongside related rules, and are harder to audit during review. A class name is also more self-documenting than a bag of property values.

The only case where an inline style would be justified is one that cannot be expressed as a reusable class — for example, a per-specimen value that is genuinely unique and data-driven. No such case has arisen in practice.

### P-S004: Lay out specimens in a flex-wrap container

Specimens should wrap naturally in a `display: flex; flex-wrap: wrap` container. Never specify a fixed column count.

### P-S005: Open-state specimens show a selected value in the trigger

When a story specimen shows a component in its open state (dropdown open, popover visible, panel expanded), the trigger must display the currently selected value — not a placeholder or empty state. The selected value should match the visually active item in the open panel. This reflects the most common real-world open interaction: the user has a prior selection and reopens the component to review or change it. An empty trigger paired with an open panel is an unrealistic combination that misrepresents the target appearance.

### P-T001: Err on the side of over-inclusion

Include all substantive sub-parts in a component's reference stories, even if the Bootstrap class appears in another component's stories. Sharing a class name is not grounds for omission — compound selectors in the implementation can produce different visual results for the same Bootstrap class in different component contexts (e.g., `.react-aria-Select .invalid-feedback` vs. `.react-aria-TextField .invalid-feedback`). Never use "covered in another component's story" as justification for omitting a sub-part.

### P-T002: Reference stories show target appearances only

Reference stories depict what a correctly styled component should look like — they are visual targets. Never include specimens that show an incorrect, unstyled, or intermediate state as a contrast or "baseline." Implementation challenges are documented in the taxonomy's DOM conflicts and decisions-needed sections, not illustrated in reference stories.

### P-S006: Extract reference CSS after each story is written

After writing each story file and confirming Storybook renders it, run `scripts/extract-story-css.mjs` for that story and save the output to `agent/artifacts/reference-css/{component}-{StoryName}.css` (kebab-case, matching the story's title path). Storybook must be running on port 6006.

```bash
node scripts/extract-story-css.mjs "Bootstrap Reference/{Component}/{StoryName}"
```

This extracted file is the authoritative CSS target for the styling phase — the implementation agent loads it instead of grepping `bootstrap.css`.

---

## Part 7 — Terminal Phrase Protocol

All terminal phrases must be the final line of the agent's response. Return exactly one per turn.

| Phrase | When to emit |
|--------|-------------|
| `TAXONOMY-DECISIONS-NEEDED: {list}` | Taxonomy has open forks that require user input. List the specific decisions needed. |
| `TAXONOMY-COMPLETE` | Taxonomy doc has been written to `agent/taxonomies/{Component}-taxonomy.md`; no open decisions remain. |
| `REFERENCE-STORY-READY-FOR-REVIEW` | Reference story has been written; CSS has been extracted for all stories; ready for user visual review in Storybook. |
| `COMPONENT-STAGE-4-COMPLETE` | All stories approved; CSS extracted for all stories; all committed. |

**Flow:**
1. Phase A: emit `TAXONOMY-DECISIONS-NEEDED` if any decisions remain; otherwise emit `TAXONOMY-COMPLETE`.
2. After orchestrator relays user answers (via `SendMessage`), continue from where you stopped — do not re-read session-start files.
3. Phase B: emit `REFERENCE-STORY-READY-FOR-REVIEW` when the reference story is ready. Apply user feedback; loop back to `REFERENCE-STORY-READY-FOR-REVIEW` as needed.
4. After approval: extract CSS for all stories; emit `COMPONENT-STAGE-4-COMPLETE`.

---

## Open questions

*(questions to be resolved through iteration work)*
