---
Status: Pass
Iteration: 1
Stuck: 0
---

## Iteration 0 (Inception)

**Diff%:** 1.82% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL:
- "Open menu (item state matrix)": the standalone `SelectListBox`/`SelectItem` mock (built independently of a real `Popover`, per the two-region layout strategy documented in `select-findings.md`) rendered with no visible container chrome at all (no border/background/padding), and — more importantly — "Banana (selected)" showed no active background/text-color highlight despite `data-selected`/`data-selection-mode="single"` genuinely being present in the DOM (confirmed via direct DOM/computed-style inspection, not assumed).

### Root cause

Diagnosed via direct inspection rather than guessing from the screenshot alone: the story's mock `SelectListBox` was given `className="select-reference-menu"` only — I had planned to also add `dropdown-menu` but the JSX never actually included it. Bootstrap defines `--bs-dropdown-link-active-bg`/`--bs-dropdown-link-hover-bg`/etc. as custom properties scoped to `.dropdown-menu` itself (`.dropdown-menu { --bs-dropdown-link-active-bg: #0d6efd; ... }`), not as global tokens. With no element in the mock's subtree carrying `.dropdown-menu`, every `var(--bs-dropdown-*)` reference inside the item-state bridge rules resolved to nothing (no fallback given), making the whole `background-color`/`color` declaration invalid and silently dropped by the browser — confirmed via `getComputedStyle` showing `background-color: rgba(0, 0, 0, 0)` on the selected item even though the bridge selector itself `.matches()` the element correctly.

## Iteration 1

**Diff%:** 0.07% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: Trigger (at rest, showing selection — caret intentionally not flipped, see below), Open menu (item state matrix: resting, selected, faux-hover, faux-focus, disabled)

Fix applied: added `dropdown-menu` to the mock's className alongside `select-reference-menu` (same two-class combination the reference story itself already uses for its own static mock) — restores both the visual chrome and, critically, the `--bs-dropdown-*` custom property scope every item-level bridge rule depends on.

### Known simplification (documented, not a defect)

The "Trigger" specimen renders a genuinely closed `<Select>` (caret pointing down), not a caret-flipped-to-open look — per the two-region layout strategy in `select-findings.md`, faking the open caret without a real `data-open` state was judged not worth the added plumbing for this pass. The resulting diff (0.07%) confirms this is visually negligible at the actual icon's pixel scale.
