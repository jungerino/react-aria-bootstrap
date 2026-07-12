---
Status: Pass
Iteration: 1
Stuck: 0
---

## Iteration 0

**Diff%:** 1.32% | **Status:** fail | **Stuck:** 0

### Specimens

PASS: none

FAIL:
- All four specimens (Default, Valid, Invalid, Disabled field): vertical
  doubling/ghosting starting at the trigger row and continuing through the
  description/feedback text. Measured actual DOM: React Aria's `<Label>` and
  `<Text slot="description">` both render `<span>` elements (not `<label>`/a
  block element), so `.form-label`'s `margin-bottom` and `.form-text`'s
  `margin-top` were silently discarded (inline elements ignore vertical
  margins) — collapsing the label→trigger and trigger→description gaps
  relative to the reference's real `<label>`/`<div>` elements. Fix: added
  `.react-aria-Label.form-label { display: inline-block; }` and
  `.react-aria-Text.form-text { display: block; }` to
  `_bootstrap-bridges.scss` (P-050 reboot-mismatch).

UNRESOLVED: none

## Iteration 1

**Diff%:** 0.00% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: Default (label + description), Valid (label + valid-feedback + icon), Invalid (label + invalid-feedback + icon), Disabled field

FAIL: none

UNRESOLVED: none
