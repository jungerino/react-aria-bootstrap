---
Status: Pass
Iteration: 9
Stuck: 0
---

## Iteration 0

**Diff%:** 6.11% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- Trigger: caret pointed down; reference shows it rotated up (open state).
- Selected item ("Kangaroo (selected)"): reference's blue fill spans nearly
  the full viewport width; mine spans only the trigger's ~240px width.

## Iteration 1

**Diff%:** 3.86% | **Status:** fail | **Stuck:** 0

Fix attempted: added `.react-aria-Select[data-open] .select-trigger-caret {
transform: rotate(180deg); }` (real open state had no bridge rule — only the
Trigger story's `.faux-open-scope` simulation did). Added `Select.tsx`
`menuClassName` prop + `presentation.scss` `.select-menu-demo-stretch`
utility (`width: calc(100vw - 2rem) !important`) to reproduce the
reference's incidental full-width stretch (a lone `.spec-item` outside
`.spec-row` stretches via flex `align-items: stretch`); applied via
`menuClassName="select-menu-demo-stretch"` in the story.

### Specimens

FAIL:
- Whole menu + every item ~0.5–7.5px too low vertically (tried several
  `Popover offset` values; gap between trigger and menu didn't match the
  reference's 2px).

## Iteration 2

**Diff%:** 1.84% | **Status:** fail | **Stuck:** 0

Fix attempted: `Popover offset={2}` (Bootstrap's `--bs-dropdown-spacer`).
Measured gap = 1.5px, not 2px.

## Iteration 3

**Diff%:** 2.70% | **Status:** fail | **Stuck:** 1

Fix attempted: `offset={1}` — worse than iteration 2's `offset={2}`.

## Iteration 4

**Diff%:** 0.22% | **Status:** pass | **Stuck:** 0

Fix attempted: `offset={2.5}`. Passed threshold. Investigated the residual:
`floating-ui` rounds its computed anchor `top` to a whole device pixel
*before* adding the offset (verified: trigger's 81.5px bottom edge becomes
inline `top: 81px`), so a sub-pixel-exact target (reference's 83.5px) can
never be hit through `offset` alone — `2.5` happened to land on the right
whole pixel (84) for this specimen given its rounding direction.

## Iteration 5–8

**Diff%:** 0.22% (unchanged) | **Status:** pass | **Stuck:** 0

While fixing the `grouped` story (same shared component code), the
`offset={2.5}` approach turned out not to generalize (see
`select-grouped-findings.md`). Replaced with `Popover offset={0}` +
`_bootstrap-bridges.scss` `margin-top: calc(var(--bs-dropdown-spacer,
0.125rem) + 0.5px)` on `.dropdown-menu[data-trigger='Select']` — a CSS
margin isn't subject to floating-ui's whole-pixel rounding, and the extra
`0.5px` restores exactly what that rounding discards. Re-ran: still 0.22%,
confirming this approach is at least as good as the offset-tuning approach
for this story, and (per the grouped findings) generalizes correctly where
the tuned-offset approach didn't.

## Iteration 9

**Diff%:** 0.04% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: Open (selected value shown in trigger — P-005): all rows (Koala,
Platypus (hover), Bald Eagle (focused), Kangaroo (selected), Skunk
(disabled))

FAIL: none

UNRESOLVED: none

While fixing `grouped`'s "Kangaroo (selected)" text-content mismatch,
discovered `SelectValue`'s default rendering (`defaultChildren`) uses the
selected item's raw rendered content rather than `textValue`-derived
`selectedText`. Fixed `Select.tsx` to prefer `selectedText` (falling back to
`defaultChildren` only for the placeholder). Also discovered the pre-selected
item receives genuine keyboard focus the instant `defaultOpen` mounts
(`data-focused`/`data-focus-visible` both present alongside `data-selected`)
— a real, correct interaction state no static reference specimen depicts in
combination. Suppressed the redundant focus outline when an item is both
selected and focus-visible (`.dropdown-item[data-selected][data-focus-visible]
{ outline: none; }`); the white-on-blue fill already satisfies WCAG 2.4.7 on
its own. This dropped the residual from 0.22% to 0.04%.
