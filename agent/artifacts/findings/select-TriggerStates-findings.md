---
Status: Passed
Iteration: 2
Stuck: 0
---

## Result
- Iteration 0: 0.08% (passed threshold — minor diff from bridge not loaded)
- Iteration 2 (after bridge fix): 0.00% PASS
- Verification: 0.00% PASS

## Key findings
- `faux-open` class correctly swaps caret SVG to up-pointing chevron
- `faux-hover`, `faux-focus` classes correctly apply form-select-equivalent tokens
- `isInvalid` + bridge applies red border + error circle icon
- `isDisabled` natively fires :disabled on <button> — no bridge needed
- Size variants (sm, lg) via `select-trigger-sm`/`select-trigger-lg` classes work correctly
