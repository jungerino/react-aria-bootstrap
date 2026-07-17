---
Status: Pass
Iteration: 2
Stuck: 0
---

## Iteration 0

**Diff%:** 0.39% | **Status:** fail | **Stuck:** 0

### Specimens

PASS: [Arizona row (unselected, unfocused)]

FAIL:
- Specimen "trigger value text": Red across the trigger's value text. Reference
  shows "Alabama and Alaska"; implementation rendered only the bare word "and".
  Root cause: `SelectItem` always passes `children` to the underlying
  `ListBoxItem` as a function (needed to read `selectionMode`/`isSelected` for the
  multi-select checkbox wrapper), so React Aria's collection builder can never
  auto-derive `item.textValue` from it — `item.textValue` silently resolves to
  `''`. `SelectValue`'s own multi-select rendering builds
  `Intl.ListFormat.formatToParts(textValue)` over each item's `textValue`;
  verified directly in Node that `formatToParts(['', ''])` collapses to a single
  literal part (`" and "`) with no element parts at all when every list entry is
  empty, which is exactly the "and"-only text observed. Fix: `SelectItem` now
  derives and passes an explicit `textValue` prop (from plain-string `children`
  when the caller doesn't supply one).
- Specimen "Alabama row": Red as a rounded blue box outline around the row, not
  present in the reference. Root cause: RAC auto-focuses the first selected item
  when the popover opens via `defaultOpen` (`state.focusStrategy` stays `null`,
  so `useSelect`'s `menuProps.autoFocus` resolves to `true` — verified in
  `useSelect.mjs`), producing a real `[data-focus-visible]` state and the
  browser's default focus outline. For single-select stories this lands on the
  item that also carries the `.active` blue fill and visually disappears into it;
  multi-select items never get that fill (D-multi-select-scope's checkbox is the
  indicator instead), so the same outline shows up as a stray, unexplained box.
  Fix: added `.react-aria-ListBoxItem.dropdown-item[data-selection-mode='multiple']
  { outline: none; }` — scoped to multi-select only, so the single-select
  "Focused" specimen in OpenItemStates (which relies on the native outline) is
  unaffected. The `[data-focused]`/`[data-focus-visible]` background-tint bridge
  still applies, so focus isn't visually silent on multi-select items either.

UNRESOLVED:
- none — both causes identified and fixed in the same pass.

## Iteration 1

**Diff%:** 0.25% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: [Trigger value text ("Alabama and Alaska"), Alabama row (no stray outline), Alaska row, Arizona row]

FAIL:
- none

UNRESOLVED:
- Residual diff is subpixel text/border antialiasing noise, well under threshold.

## Iteration 2

**Diff%:** 0.25% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: [all — re-run as part of the full 6-story final verification sweep after
the fixes above, to confirm no regression from the shared `SelectItem`/bridge
changes]

FAIL:
- none

UNRESOLVED:
- none
