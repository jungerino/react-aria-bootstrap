---
component: Button
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| Variants | Pass | 0 | 0 | 0.00% |
| OutlineVariants | Pass | 0 | 0 | 0.00% |
| Sizes | Pass | 0 | 0 | 0.00% |
| States | Pass | 0 | 0 | 0.00% |
| LinkStyle | Pass | 0 | 0 | 0.00% |
| Pending | Pass | 0 | 0 | 0.01% |

## Work Log

### Variants — Iteration 0

**Observations:** None — clean pass on first comparison.

**Principles used:**
- P001 compound-sel — retained `.react-aria-Button` alongside `.btn.btn-{variant}`
- P002 class-in-tsx — Bootstrap classes applied via explicit className string in TSX
- P007 variant-replace — variantClassMap covers all 8 Bootstrap solid variants

**Code changes made:** None — pass on first run.

---

### OutlineVariants — Iteration 0

**Observations:** None — clean pass on first comparison.

**Principles used:**
- P001 compound-sel
- P007 variant-replace — variantClassMap covers all 8 outline variants (`outline-primary` → `btn-outline-primary` etc.)

**Code changes made:** None — pass on first run.

---

### Sizes — Iteration 0

**Observations:** None — clean pass on first comparison.

**Principles used:**
- D2 — explicit `size="sm" | "lg"` prop mapped to `btn-sm` / `btn-lg` via `sizeClassMap`

**Code changes made:** None — pass on first run.

---

### States — Iteration 0

**Observations:** None — clean pass on first comparison.

**Principles used:**
- P044 faux-state-class — `.faux-hover`, `.faux-focus`, `.faux-active` from `presentation.scss` applied via `className` prop
- P014 data-pressed — `:active` fires natively on `<button>`; no bridge needed (taxonomy confirmed ACTIVE)
- React Aria `isDisabled` → native `disabled` attribute → Bootstrap's `.btn:disabled` fires automatically

**Code changes made:** None — pass on first run.

---

### LinkStyle — Iteration 0

**Observations:** None — clean pass on first comparison.

**Principles used:**
- P007 variant-replace — `link` → `btn-link` in variantClassMap
- P044 faux-state-class — faux-hover, faux-focus applied

**Code changes made:** None — pass on first run.

---

### Pending — Iteration 0

**Observations:** 33 pixels diff (0.01%) in spinner animation region. Animation Exception applied — spinner is present and styled correctly in both screenshots; diff is frame difference only.

**Principles used:**
- P003 scss-bridge — `[data-pending]` bridge in `_bootstrap-bridges.scss`: `pointer-events: none` + `opacity: var(--bs-btn-disabled-opacity)`
- React Aria `isPending` prop → `[data-pending]` attribute on `<button>`
- Bootstrap `.spinner-border.spinner-border-sm` on child `<span>` — content-driven, not structural

**Code changes made:** None — pass on first run (Animation Exception).
