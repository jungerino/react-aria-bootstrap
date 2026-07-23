---
Status: Pass
Iteration: 2
Stuck: 0
---

## Iteration 0 (Inception)

**Diff%:** 0.72% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- "Label + description" / "Label + invalid + feedback": both specimens showed the trigger box (and everything below it) rendering noticeably higher than the reference, producing overlapping/doubled text in the diff starting right at the label-to-control gap.

## Iteration 1 (shared padding fix, insufficient alone)

**Diff%:** 0.72% | **Status:** fail | **Stuck:** 0

Applied the shared `padding-right: 0.75rem` fix (same as Default/Sizes/States) — no measurable improvement here, confirming the real cause was vertical, not horizontal.

### Diagnosis

Measured pixel row-transitions at several x-columns across reference vs. implementation screenshots directly (not just eyeballing): the label text itself lands at the same y-position in both, but the gap between the end of the label and the start of the trigger box was visibly smaller in the implementation. The reference story wraps label+control+description/error in `.ref-stack` (`display:flex; flex-direction:column; gap:0.5rem`) — an *additional* 0.5rem of spacing on top of each child's own block margin (`.form-label`'s `margin-bottom:0.5rem`, `.form-text`'s `margin-top:0.25rem`), since flex `gap` doesn't collapse with margins. My `Select` component's internal children (Label/Button/Text/FieldError) were plain block-flow siblings with no equivalent extra gap — relying on their own margins alone.

## Iteration 2

**Diff%:** 0.04% | **Status:** pass | **Stuck:** 0

Fix applied: added a conditional `select-with-label` class to the `AriaSelect` root (applied only when the `label` prop is set) and a matching bridge rule (`display:flex; flex-direction:column; gap:0.5rem`) — reproduces `.ref-stack`'s exact spacing contribution without affecting label-less stories (verified no regression on Default/Sizes/States, which never pass `label` and so never receive the class).
