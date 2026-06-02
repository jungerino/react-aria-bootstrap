---
title: Review — Styling Iteration 1
status: complete
---

# Review — Styling Iteration 1

## Components
- Button
- Select

## Phase 1 — Scaffolding notes

Stub files created for Button and Select (TSX, standard stories, mirror stories). Story globs added to `.storybook/main.js`. Storybook restarted clean before Phase 2.

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

### Select

**Sub-parts implemented:**
- Label (`.form-label`), Button trigger (`.form-select`, M014 — no `.btn`), SelectValue, P041 hidden sizer, Popover (`.dropdown-menu.show`), ListBoxItem (`.dropdown-item`), Description (`.form-text`), FieldError (`.invalid-feedback`).
- Size variants via `sizeClassMap` (`form-select-sm` / `form-select-lg`).

**Bridge strategy:**
- Trigger layout: `display: flex; flex-direction: column` with hidden sizer span containing all option labels as block children (P041). Sizer sets min-content width to widest option without visual height contribution.
- Open state caret flip: `--bs-form-select-bg-img` custom property override (upward arrow SVG) — `transform` cannot rotate a `background-image`. Dark mode variant provided separately (P024).
- Disabled: `[data-disabled]` on root → trigger background/color/border (`:disabled` pseudo-class never fires — RAC keeps button focusable).
- Invalid: `[data-invalid]` on root → trigger border-color + error icon via `--bs-form-select-bg-icon`. FieldError visibility bridged via `.react-aria-Select[data-invalid] .invalid-feedback { display: block }` (Bootstrap's `.is-invalid ~ .invalid-feedback` sibling selector never fires).
- Label / Description display: RAC renders these as `<span>`; Bootstrap spacing requires `display: inline-block` / `display: block` respectively.
- ListBoxItem selected/disabled: `[data-selected]` → `.dropdown-item` active token values; `[data-disabled]` → muted color.
- Popover z-index set explicitly (`var(--bs-dropdown-zindex)`).
- Dropdown width: `width: var(--trigger-width)` on `.dropdown-menu[data-trigger="Select"]` — RAC sets this via ResizeObserver (P049).
- Faux focus scope: `.faux-focus-scope` wrapper + bridge for mirror story focus specimens.

**Visual comparison results:**
- `trigger-states`: 0.41% diff — Pass (iteration 1)
- `open-dropdown`: 0.14% diff — Pass (iteration 1)
- `invalid-state`: 0.00% diff — Pass (iteration 1)
- `size-variants`: 0.12% diff — Pass (iteration 1)
- `full-field`: 0.02% diff — Pass (iteration 1)

**Open design decisions:** None — all taxonomy decisions resolved.

**Intentional deviations:** None.

**Candidate principles:** See debrief section below.

---

## User review — Debrief

### P002 correction
P002's documented example `(className) => \`${className} btn\`` is broken — the callback receives a RenderProps object, not a string, so interpolation produces `[object Object] btn`. Confirmed via React Aria API docs: the callback receives `RenderProps & { defaultClassName: string }`. Correct form: `({ defaultClassName }) => \`${defaultClassName ?? ''} btn\`.trim()`. Plain string alternative also valid per P046. P002 updated.

### P041 pattern
The `visually-hidden` span approach (using Bootstrap's `.visually-hidden` class) fails because `position: absolute; width: 1px` removes the sizer from layout flow. Correct pattern: `display: flex; flex-direction: column` on trigger; sizer contains all option labels as `<div>` children; sizer styled `height: 0; overflow: hidden; visibility: hidden; white-space: nowrap`. Browser resolves widest label naturally — no JS measurement needed. P041 updated with pattern code and explicit `.visually-hidden` warning.

### P024 caveat
`transform: rotate(180deg)` cannot rotate a `background-image` caret (applies to element box, not background). For `.form-select`, override `--bs-form-select-bg-img` with an upward arrow SVG; provide a second rule for `[data-bs-theme=dark]`. Background-image swaps cannot be transitioned — caret snaps, consistent with Bootstrap's own `.form-select` behavior. P024 updated.

### New principles added
- **P049**: RAC sets `--trigger-width` on Popover via ResizeObserver; consume it to match dropdown width to trigger width.
- **[data-pending] bridge rule**: Added to Data-* Bridge Rules section (not a numbered principle — it's a special case of the existing `aria-disabled` bridge rule).

### Workflow changes
- Serial component dispatch adopted as default — parallel exhausts concurrency budget, causing silent sub-sub-agent queuing indistinguishable from stuck agents.
- P045 (image analysis rule) migrated from Stories Conventions to Sub-Sub-Agent section.
- Animation exception rule added to Sub-Sub-Agent section: diffs localized to a single animated element may be treated as passing when both screenshots show correct styling.

---

## Principles extracted

- P002 corrected (defaultClassName accessor)
- P024 updated (background-image caret caveat)
- P041 updated (flex+sizer pattern with code; .visually-hidden warning)
- P049 added (--trigger-width)
- P045 migrated to Sub-Sub-Agent section
- Animation exception rule added to Sub-Sub-Agent section
- Serial dispatch adopted as primary workflow default

## Skill update status
- [x] `agent/react-aria-skill.md` updated
- [ ] Finalized component files merged to `sub-agent-styling`
- [x] `CLAUDE.md` iteration counter updated
