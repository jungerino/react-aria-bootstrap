---
Status: Passed
Iteration: 3
Stuck: 0
---

## Result
- Iteration 0: 3.36% FAIL
- Iteration 1 (faux-active fix): 2.46% FAIL
- Iteration 2 (bridge loaded): 2.49% FAIL
- Iteration 3 (line-height fix): 0.26% PASS
- Verification: 0.26% PASS

## Key findings

### P-faux-active vs defaultSelectedKeys
Using `defaultSelectedKeys` with a standalone `ListBox` does not reliably add `[data-selected]` on initial render for screenshot capture. Replaced with explicit `faux-active` class on the item via `activeItem` prop — more reliable for static visual display (P044 pattern).

### selectionMode="none"
When using `faux-active` for active state display, set `selectionMode="none"` on the ListBox — no actual selection management needed.

### Dropdown header line-height (M018)
Reference uses `<h6 class="dropdown-header">` which inherits Bootstrap's heading `line-height: 1.2`, giving 32.8px height.
RAC `ListBoxItem` renders as `<div class="dropdown-header">` which inherits body `line-height: 1.5`, giving 37px height.
Fixed by bridge rule `.dropdown-header { line-height: 1.2 }`.

### Disabled items
`isDisabled` on `ListBoxItem` correctly adds `[data-disabled]`, and the bridge `.react-aria-ListBoxItem.dropdown-item[data-disabled]` applies gray color + no pointer-events.

### Divider
`ListBoxItem` with `className="dropdown-divider"` and `isDisabled` + `aria-hidden="true"` renders a functional horizontal divider as a `<div>` with `height: 0; border-top: 1px`.
