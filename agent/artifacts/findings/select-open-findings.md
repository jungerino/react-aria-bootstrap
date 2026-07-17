---
Status: Pass
Iteration: 0
Stuck: 0
---

## Iteration 0

**Diff%:** 0.25% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: [Open — trigger shows "Banana", chevron rotated, "Banana" item `.active`]

FAIL:
- none

UNRESOLVED:
- Residual diff is subpixel text/border antialiasing noise, well under threshold.
  Note for future stories: RAC auto-focuses an item when the popover opens via
  `defaultOpen` (no preceding real user gesture — `state.focusStrategy` stays
  `null`, so `useSelect`'s `menuProps.autoFocus` resolves to plain `true`,
  focusing the first selected item). Here that lands on "Banana", which already
  carries the `.active` blue fill, so the browser's default focus ring is
  visually absorbed into it and doesn't show up as a separate artifact. See the
  MultiSelect findings doc, where the same mechanism was visible and required a
  fix, since multi-select items never get the `.active` fill.
