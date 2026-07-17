---
Status: Pass
Iteration: 0
Stuck: 0
---

## Iteration 0

**Diff%:** 0.22% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: [Resting, Hovered (faux), Focused (faux), Selected (real `defaultSelectedKey`), Disabled (real `isDisabled`)]

FAIL:
- none

UNRESOLVED:
- Residual diff is subpixel text/border antialiasing noise, well under threshold.
  The item RAC auto-focuses on open here is "Selected" (the `defaultSelectedKey`),
  which already carries the `.active` fill — same masking effect noted in the
  Open findings doc, coincidentally matching the reference's own dedicated
  "Focused" specimen closely enough that no separate artifact is visible.
