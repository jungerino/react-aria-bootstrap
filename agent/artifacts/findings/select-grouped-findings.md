---
Status: Pass
Iteration: 9
Stuck: 0
---

## Iteration 0

**Diff%:** 6.07% | **Status:** fail | **Stuck:** 0

### Specimens

FAIL: same caret-rotation and menu-width issues as `open` (shared root
cause/fix — see select-findings.md's Work Log and select-open-findings.md).

## Iteration 2

**Diff%:** 1.18% | **Status:** fail | **Stuck:** 0

(Iteration 1 applied the same caret/width fixes as `open`, not re-logged
here — see select-findings.md Work Log.)

Fix attempted: `.react-aria-Header.dropdown-header { font-weight: 500;
line-height: 1.2; }`. The reference's group label is a real `<h6
class="dropdown-header">`, matching `_reboot.scss`'s heading rule
(`line-height: 1.2; font-weight: 500`); RAC's `<Header>` renders a plain
`<header>` (verified via rendered DOM), which doesn't match that reboot
selector and defaults to the body's line-height (1.5) — measured 37px tall
vs the reference's 32.8px (exactly the 1.5×/1.2× ratio at the 14px
`.dropdown-header` font-size).

### Specimens

PASS: "Marsupials" header (after fix)

FAIL: Koala/Kangaroo/Birds/Bald Eagle rows and the divider border still
~0.5px misaligned (see `open`'s offset/margin-top investigation, same root
cause, fixed the same way here).

## Iteration 3

**Diff%:** 0.76% | **Status:** fail | **Stuck:** 0

Fix attempted: `Popover offset={2}`.

## Iteration 5

**Diff%:** 0.39% | **Status:** fail | **Stuck:** 0

Fix attempted: `offset={0}` + `margin-top: calc(var(--bs-dropdown-spacer,
0.125rem) + 0.5px)` (see `open`'s log for the full floating-ui-rounding
investigation — same fix, shared component code). All row positions became
pixel-identical to the reference after this fix; the residual was
entirely the "(selected)" text-content mismatch described below.

### Specimens

PASS: Marsupials, Koala, Birds, Bald Eagle rows; row/divider positions

FAIL: "Kangaroo (selected)" row — reference's *list item* text says
"Kangaroo (selected)" but its *trigger* text says plain "Kangaroo"; a live
`SelectValue` mirrors the selected item's actual rendered content into the
trigger, so it couldn't show both texts at once.

## Iteration 6

**Diff%:** 0.39% (unchanged) | **Status:** fail | **Stuck:** 1

Fix attempted: added `textValue="Kangaroo"` to the item (expecting the
trigger to prefer it). No change — `SelectValue`'s default `defaultChildren`
doesn't consult `textValue` at all (confirmed by reading
`node_modules/react-aria-components/dist/private/Select.mjs`, current
installed source).

## Iteration 7

**Diff%:** 0.39% (unchanged, same pixel count relocated) | **Status:** fail | **Stuck:** 2

Fix attempted: reverted the item's visible text to plain "Kangaroo" (no
suffix) instead. Trigger then matched the reference exactly, but the *list
item* no longer said "(selected)" like the reference does — same overall
diff%, just moved from one element to the other. Confirms the two Stuck
iterations were genuine, differently-scoped hypothesis tests (not repeats of
the same idea), and that the real fix had to be architectural
(`SelectValue`'s rendering), not a story-content tweak.

## Iteration 9

**Diff%:** 0.00% | **Status:** pass | **Stuck:** 0

### Specimens

PASS: Grouped options (Marsupials: Koala, Kangaroo (selected); Birds: Bald Eagle)

FAIL: none

UNRESOLVED: none

Fix: `Select.tsx`'s `<SelectValue>` now supplies a children function —
`isPlaceholder ? defaultChildren : selectedText` — so `selectedText`
(`textValue`-derived) drives the trigger text instead of the selected item's
raw rendered content. Restored `textValue="Kangaroo"` +
`children="Kangaroo (selected)"` on the item. Also applied the
`[data-selected][data-focus-visible]` outline suppression discovered while
finishing `open` (the pre-selected item receives genuine keyboard focus the
instant `defaultOpen` mounts) — resolved the last ~0.34% together with the
`SelectValue` fix.
