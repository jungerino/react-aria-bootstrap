---
title: Review — Styling Iteration 1
status: in-progress
---

# Review — Styling Iteration 1

## Components
- Button
- Select

## Phase 1 — Scaffolding notes
*(agent fills in)*

## Phase 2 — Implementation notes

### Button

**Sub-parts implemented:**
- Root button with className render-prop (P002), 16-variant map via `variantClassMap` (P007 — solid + outline), size classes (sm/md/lg), className passthrough for faux states in stories.

**Bridge strategy:**
- No bridge needed for hover/focus/active/disabled — all native pseudo-classes fire on `<button>` elements directly.
- `[data-pending]` bridge **required**: `isPending` sets `aria-disabled` but NOT the native `disabled` attribute (button stays focusable), so `:disabled` does not fire. Bridge added: `.btn[data-pending]` → Bootstrap's btn-disabled token values (color, bg, border-color, opacity).
- `augments.scss` received a `.ref-freeze-animations` utility addition so the pending spinner doesn't animate during pixel diff capture.

**Visual comparison results:**
- `color-variants-solid`: 0.00% diff — Pass (iteration 1)
- `color-variants-outline`: 0.00% diff — Pass (iteration 1)
- `sizes`: 0.00% diff — Pass (iteration 1)
- `states`: 0.00% diff — Pass (iteration 2; iteration 1 failed on pending opacity until `[data-pending]` bridge was added)

**Open design decisions:** None — all taxonomy decisions resolved.

**Intentional deviations:** None.

**Candidate principles:**
- Any RAC `isPending` pattern needs an explicit `[data-pending]` bridge for Bootstrap's disabled visual — `aria-disabled` alone does not trigger `:disabled`.

---

## User review
*(user fills in during debrief)*

## Principles extracted
*(filled in during debrief — go into `agent/react-aria-skill.md`)*

## Skill update status
- [ ] `agent/react-aria-skill.md` updated
- [ ] Finalized component files merged to `sub-agent-styling`
- [ ] `CLAUDE.md` iteration counter incremented (if applicable)
