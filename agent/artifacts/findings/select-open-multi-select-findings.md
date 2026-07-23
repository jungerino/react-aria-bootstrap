---
Status: Pass
Iteration: 1
Stuck: 0
---

## Iteration 0 (Inception)

**Diff%:** 1.70% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- "Open menu (checkbox indicator, item state matrix)": same root cause as `select-open-single-select-findings.md` — the mock's `SelectListBox` was missing the `dropdown-menu` class, so `--bs-dropdown-*` custom properties never resolved for descendant items (this story doesn't rely on `--bs-dropdown-link-active-bg` for the checked look since D5 uses the checkbox instead of background fill, but it still needed `.dropdown-menu`'s own visual chrome — border/background/padding — plus `--bs-dropdown-link-hover-bg` for the "Cherry (hover)" specimen).

## Iteration 1

**Diff%:** 0.20% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: Trigger — two selected (caret not flipped, same documented simplification as OpenSingleSelect), Trigger — widest realistic combination, Open menu (checkbox indicator, item state matrix: checked, faux-hover unchecked, faux-focus checked, disabled)

Fix applied: same as OpenSingleSelect — added `dropdown-menu` to the mock's className. No other change needed; the real checkbox-checked bridge (`[data-selection-mode='multiple'][data-selected] .select-item-checkbox`) and the multi-select trigger's real comma-joined `SelectValue` summary text both worked correctly once the chrome/token-scope fix was applied.
