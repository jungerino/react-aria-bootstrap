---
Status: Pass
Iteration: 2
Stuck: 0
---

## Iteration 2 (Final Verification Sweep)

**Diff%:** 0.00% (0 / 548800 px) | **Status:** pass | **Stuck:** 0

Diff artifacts: `agent/artifacts/diffs/button/icon-only/iteration-1/`. No code
changes since Iteration 1 — re-run confirms stability.

## Iteration 1

**Diff%:** 0.00% (0 / 548800 px) | **Status:** pass | **Stuck:** 0

Diff artifacts: `agent/artifacts/diffs/button/icon-only/iteration-0/`

### Specimens

PASS: Resting, Hover, Focus-visible, Pressed, Disabled

FAIL: none

UNRESOLVED: none

Inception pass — no code changes were needed. `iconOnly` prop applied the
pre-existing `.btn-icon-only` recipe from presentation.scss (D-icon-only-scope);
combined with the same `data-*`/faux-state bridges used elsewhere, the full
interactive-state matrix matched the reference exactly.
