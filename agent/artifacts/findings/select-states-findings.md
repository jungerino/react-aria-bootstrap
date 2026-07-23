---
Status: Pass
Iteration: 2
Stuck: 0
---

## Iteration 0 (Inception)

**Diff%:** 0.85% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- Resting / Focused / Disabled / Invalid: same double-reserved trailing padding issue as Default (see `select-default-findings.md`).

## Iteration 1

**Diff%:** 0.28% | **Status:** pass | **Stuck:** 0

Fix applied: same shared `padding-right: 0.75rem` bridge fix. Confirms the "Focused" specimen's use of real `autoFocus` (rather than a faux class) was correct — `.form-select:focus` is a plain `:focus` rule in Bootstrap with no focus-visible modality distinction, so real programmatic focus produces the exact same visual as reference's static `.faux-focus` simulation, and no bridge rule was needed for this state at all (matches taxonomy's own note that Button's focus state requires "no bridge required for implementation").

## Iteration 2 (final sweep, unchanged)

**Diff%:** 0.28% | **Status:** pass | **Stuck:** 0

Re-verified after the `select-with-label` root-class change — no regression (this story never sets `label`).
