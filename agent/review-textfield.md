---
title: TextField — Design Review
---

# TextField — Design Review

## Decisions needed

### 1. Floating label variant — in scope or out of scope?

Bootstrap's `.form-floating` wrapper requires the `<input>` to precede the `<label>` in DOM order (general sibling combinator `~`). React Aria's `<TextField>` renders `<Label>` before `<Input>`.

Two paths:
- **Option A — Skip:** Exclude floating labels from the TextField reference story set. Floating label DOM conflict is a known MAJOR issue (patterns.md §2.3) and was not addressed for Select or other components.
- **Option B — Include with DOM swap:** Implement a floating-label specimen that reverses `<Label>`/`<Input>` order. This satisfies Bootstrap's `~` selector but diverges from React Aria's standard component structure.

---

### 2. Size variants — exposure strategy

Bootstrap provides `.form-control-sm` and `.form-control-lg` with no React Aria prop equivalent (M016 trigger #1).

Three paths:
- **Option A — Expose as prop:** Add a `size` prop to the Bootstrap-themed TextField component that applies `.form-control-sm` / `.form-control-lg` to the Input.
- **Option B — Passthrough (className):** Document that size classes should be added via `className` on the `<Input>` sub-component; no dedicated prop.
- **Option C — Exclude from scope:** Do not include size variants in the reference stories for now.

---

### 3. Valid state (`.is-valid`) — include or skip?

The Select taxonomy explicitly decided to skip the valid state: "Skip entirely. Out of scope for this mapping." (M016 cross-component consistency check.)

Two paths:
- **Option A — Skip (consistent with Select):** Exclude `.is-valid` / `valid-feedback` from the TextField reference story, matching the Select decision.
- **Option B — Include:** Add valid-state specimens to TextField. This would require a `[data-valid]` bridge (same pattern as invalid), and would diverge from the Select decision.

---

### 4. TextArea — part of TextField or separate entry?

`<TextArea>` is a sub-component of TextField that renders `<textarea class="react-aria-TextArea">`. Bootstrap's `textarea.form-control` applies to it via the element-type selector.

Two paths:
- **Option A — Include in TextField stories:** Add a TextArea specimen to the TextField reference stories (same file, one additional story or specimen).
- **Option B — Separate entry:** Treat TextArea as its own taxonomy + reference story entry. The React Aria `TextField` component supports both `<Input>` and `<TextArea>` but they have slightly different compiled selectors (`textarea.form-control` vs `input.form-control`).

---

### 5. Plaintext read-only variant — in scope?

Bootstrap's `.form-control-plaintext` removes the border and background for a read-only field that looks like plain text. React Aria has an `isReadOnly` prop.

Two paths:
- **Option A — Include:** Add a `.form-control-plaintext` specimen showing read-only plaintext appearance.
- **Option B — Exclude:** Standard `.form-control[readonly]` is sufficient for the reference story; `.form-control-plaintext` is an aesthetic choice.

---

*Once decisions are made, record them in the `## Decisions` section of `agent/reference-stories/textfield-taxonomy.md` and proceed to Part 6.*
