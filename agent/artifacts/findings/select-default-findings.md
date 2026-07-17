---
Status: Pass
Iteration: 0
Stuck: 0
---

## Iteration 0

**Diff%:** 0.29% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: [Default — closed trigger, "Favorite fruit" label, "Select an item" placeholder]

FAIL:
- none

UNRESOLVED:
- Residual diff is a 1-2px text/border antialiasing offset around the placeholder
  text and trigger boundary (visible in diff.png as a thin double-outline), typical
  of subpixel rendering differences between a live `<button>` render and the
  static reference mockup. Well under threshold; no code change made.
