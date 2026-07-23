---
Status: Pass
Iteration: 2
Stuck: 0
---

## Iteration 0 (Inception)

**Diff%:** 0.78% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- Specimen "Short value" / "Long value" / "Placeholder": all three trigger boxes rendered wider than reference, with cumulative rightward drift causing labels/boxes to visibly overlap in the diff. Root cause: the real `<ChevronDown>` child icon's own flex width + gap were reserved *in addition to* `.form-select`'s base `padding-right: 2.25rem` (which was originally sized to reserve space for the native background-image arrow, now suppressed). Space was being reserved twice.

## Iteration 1

**Diff%:** 0.16% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: Short value, Long value (widest realistic content), Placeholder (no selection)

Fix applied: `padding-right: 0.75rem` override on `.react-aria-Button.form-select` (matches the other three sides) so the icon's own flex space isn't double-counted on top of the inherited arrow reserve.

## Iteration 2 (final sweep, unchanged)

**Diff%:** 0.16% | **Status:** pass | **Stuck:** 0

Re-verified after the `select-with-label` root-class change (made for the WithLabelAndDescription story) — no regression, since this story never sets `label`.
