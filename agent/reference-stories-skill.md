---
title: Reference Stories Skill
status: iteration 0 complete (Button, ListBox, Select)
---

# Reference Stories Skill

This document accumulates principles for producing sub-part Bootstrap reference stories for React Aria components. It grows after each debrief.

---

## Part 1 — Taxonomy Formation

See **P-T001** and **P-T002** in Part 2 — both are taxonomy formation principles (inclusion policy and specimen scope) that emerged during iteration 0.

---

## Part 2 — Story Implementation

### P-S001: Faux state classes for pseudo-class specimens

Reference stories must statically render all interactive states to support screenshot-based visual comparison. Never instruct the reviewer to interact with the browser to see a state.

For any pseudo-class state that produces visually distinct Bootstrap output, define a `.faux-{state}` utility class in `stories/bootstrap-test/bootstrap-reference/augments.scss` that applies the same CSS values as a static class rule. Create as many `.faux-*` classes as needed — if Bootstrap styles a state distinctly, there should be a faux class for it.

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

---

### P-S002: Reproduce the Bootstrap selector context for each specimen

For each sub-part specimen, search the compiled Bootstrap CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) for all selectors containing the sub-part's class. The specimen must reproduce whatever ancestor and sibling context those selectors require.

**Ancestor context:** Required when selectors contain `.ancestor .sub-part` or `.ancestor > .sub-part`, or when CSS custom properties referenced via `var()` are defined on an ancestor class rather than `:root`. Nest as many levels deep as the selector chain requires.

**Sibling context:** Required when selectors use adjacent sibling combinators (`.sub-part + .sub-part`) or position pseudo-classes (`:first-child`, `:last-child`, `:not(:last-child)`) that would affect the visual state being shown. Add the minimum siblings needed to place the specimen in the correct position.

---

### P-T002: Reference stories show target appearances only

Reference stories depict what a correctly styled component should look like — they are visual targets. Never include specimens that show an incorrect, unstyled, or intermediate state as a contrast or "baseline." Implementation challenges are documented in the mapping table, not illustrated in reference stories.

---

### P-T001: Err on the side of over-inclusion

Include all substantive sub-parts in a component's reference stories, even if the Bootstrap class appears in another component's stories. Sharing a class name is not grounds for omission — compound selectors in the implementation can produce different visual results for the same Bootstrap class in different component contexts (e.g., `.react-aria-Select .invalid-feedback` vs. `.react-aria-TextField .invalid-feedback`). Never use "covered in another component's story" as justification for omitting a sub-part.

---

## Open questions

*(questions to be resolved through iteration work)*
