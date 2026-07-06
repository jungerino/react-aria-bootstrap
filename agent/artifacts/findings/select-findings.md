---
component: Select
iteration: 3
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| TriggerStates | Passed | 2 | 0 | 0.00% |
| DropdownMenu | Passed | 3 | 0 | 0.26% |
| FormField | Passed | 3 | 0 | 0.00% |

## Work Log

### Iteration 0 — Inception pass
- TriggerStates: 0.08% PASS (bridge not loaded — passed due to threshold leniency)
- DropdownMenu: 3.36% FAIL — Active/Selected "Dog" missing blue bg; header line-height wrong
- FormField: 1.80% FAIL — label inline with trigger (no select-trigger-block); bridge not loaded

### Iteration 1 — DropdownMenu: faux-active fix
- Changed `defaultSelectedKeys` to `activeItem` prop using `faux-active` class (more reliable than [data-selected])
- Changed `selectionMode="single"` to `selectionMode="none"` (no selection state needed for static display)
- DropdownMenu: 2.46% FAIL — blue bg fixed; header height still wrong (line-height 1.5 vs 1.2)
- FormField: 1.78% FAIL — still failing (bridge not loaded)

### Iteration 2 — Bridge import fix
- Root cause found: `_bootstrap-bridges.scss` was not imported anywhere
- Fixed: added `@import 'bootstrap-bridges'` to `_bootstrap-overrides.scss`
- TriggerStates: 0.00% PASS (bridge now fires for [data-invalid])
- DropdownMenu: 2.49% FAIL — header line-height still off
- FormField: 1.78% FAIL — layout differences: label inline (span vs label), description inline (span vs div)

### Iteration 3 — Layout and line-height fixes
- Added `d-inline-block` to Label className so <span.react-aria-Label> behaves like <label> (Bootstrap reboot sets `label { display: inline-block }`)
- Added `d-block` to Text description className so <span.form-text> behaves like <div.form-text>
- Added bridge rule `.dropdown-header { line-height: 1.2 }` to match <h6> heading line-height
- Added `select-trigger-block` class to trigger when `label` prop is present (form-field mode)
- TriggerStates: 0.00% PASS
- DropdownMenu: 0.26% PASS
- FormField: 0.00% PASS

### Final Verification Sweep
- TriggerStates: 0.00% PASS
- DropdownMenu: 0.26% PASS
- FormField: 0.00% PASS
- All stories pass with threshold 0.003
