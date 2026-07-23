---
Status: Pass
Iteration: 2
Stuck: 0
---

## Iteration 0 (Inception)

**Diff%:** 0.36% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- Small / Default / Large: same double-reserved trailing padding issue as the Default story (see `select-default-findings.md`), scaled across all three sizes.

## Iteration 1

**Diff%:** 0.28% | **Status:** pass | **Stuck:** 0

Fix applied: same `padding-right: 0.75rem` override as Default (shared bridge rule, no size-specific change needed — `.form-select-sm`/`.form-select-lg` never touch padding-right in Bootstrap's own compiled CSS either, so the override applies uniformly and correctly to all three sizes).

## Iteration 2 (final sweep, unchanged)

**Diff%:** 0.28% | **Status:** pass | **Stuck:** 0

Re-verified after the `select-with-label` root-class change — no regression (this story never sets `label`).
