---
title: TextField Taxonomy
component: TextField
iteration: 0
---

## TextField

**React Aria root class:** `.react-aria-TextField`  
**Mapping type:** 1:1 — Label → `.form-label`; Input → `.form-control`; Description → `.form-text`; FieldError → `.invalid-feedback`

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root (field wrapper) | `.react-aria-TextField` | Form field wrapper | No specific Bootstrap class; use `mb-3` or similar layout utility on a wrapper `<div>` |
| Label | `.react-aria-Label` | Form label | `.form-label` |
| Input | `.react-aria-Input` | Form control | `.form-control` |
| TextArea | `.react-aria-TextArea` | Form control (textarea) | `.form-control` (via `textarea.form-control` element-type selector) |
| Description | `[slot="description"]` / `.react-aria-Text` | Form text | `.form-text` |
| FieldError | `.react-aria-FieldError` | Invalid feedback | `.invalid-feedback` |

React Aria renders a real `<input>` (or `<textarea>`) and a real `<label>` — exactly the element types Bootstrap's `.form-control` and `.form-label` target. This is a clean 1:1 structural match; no composite mapping is needed. No element type substitutions per M018.

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Size | (no prop) | `.form-control-sm`, `.form-control-lg` | Bootstrap | Applied to Input; changes `padding`, `font-size`, `border-radius` via token system — see Decisions needed |
| Input type | `type` prop (text, email, password, search, tel, url) | (no modifier class) | React Aria | Passed directly to `<input type="…">`; no Bootstrap class equivalent |
| TextArea | use `<TextArea>` instead of `<Input>` | `textarea.form-control` | Both | Same `.form-control` class; `textarea` element type activates `textarea.form-control` compiled selectors for `min-height` and `padding-y` |
| Plaintext read-only | `isReadOnly` + visual choice | `.form-control-plaintext` | Bootstrap | Removes border/bg for a plain-text read-only appearance — see Decisions needed |
| Floating label | (no React Aria prop) | `.form-floating` wrapper | Bootstrap | MAJOR DOM conflict (patterns.md §2.3); Bootstrap requires `<input>` before `<label>`, React Aria renders `<Label>` before `<Input>` — see Decisions needed |
| Validation — invalid | `isInvalid` / `[data-invalid]` | `.is-invalid` on `.form-control` | Both | React Aria sets `[data-invalid]` on root; compound selector bridge required on Input |
| Validation — valid | (no `isValid` prop) | `.is-valid` on `.form-control` | Bootstrap | Cross-component consistency with Select — see Decisions needed |
| Disabled | `isDisabled` | `.form-control:disabled` | Both | React Aria sets `disabled` attribute on `<input>`; `:disabled` pseudo fires naturally |
| Read-only | `isReadOnly` | `[readonly]` | Both | React Aria sets `readonly` attribute on `<input>`; Bootstrap's `[readonly]` selector fires naturally |
| Required | `isRequired` | (no Bootstrap visual modifier) | React Aria | Required state is ARIA-only in this mapping |
| Dark mode | (no prop) | `data-bs-theme="dark"` on ancestor | Bootstrap | Bootstrap CSS variable overrides apply automatically |

### State mappings

**TextField root (`.react-aria-TextField`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part affected | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|-------------------|----------------------|-----------------|
| Disabled | `[data-disabled]` | Root + Input | `.form-control:disabled` | No bridge needed on Input — React Aria sets `disabled` attribute on `<input>`, `:disabled` pseudo fires naturally. Root attribute available for pointer-events wrapper styling if needed. |
| Invalid | `[data-invalid]` | Root + Input + FieldError | `.form-control.is-invalid` | Compound selector bridge required: `.react-aria-TextField[data-invalid] .react-aria-Input` → apply `--bs-form-invalid-border-color` border + validation icon `background-image`. `.is-invalid` INERT (React Aria never adds). |
| Read-only | `[data-readonly]` | Root + Input | `[readonly]` | No bridge needed — React Aria sets `readonly` HTML attribute on `<input>`; Bootstrap's `[readonly]` selector fires naturally. |
| Required | `[data-required]` | Root | (no Bootstrap visual) | No visual bridge needed; ARIA attributes handle required state. |

**Input (`.react-aria-Input`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Input | `:hover` | No bridge needed — `:hover` fires on `<input>`. Bootstrap's `.form-control` has no explicit hover styling (hover rules only apply to the file-input variant). |
| Focused | `[data-focused]` | Input | `.form-control:focus` | No bridge needed — `:focus` fires on `<input>` naturally. ACTIVE. |
| Focus visible | `[data-focus-visible]` | Input | `.form-control:focus` | No bridge needed — Bootstrap uses `:focus` (not `:focus-visible`) for `.form-control`; `:focus` fires naturally. ACTIVE. |
| Disabled | `[data-disabled]` | Input | `.form-control:disabled` | No bridge needed — React Aria sets `disabled` attribute on `<input>`; `:disabled` pseudo fires naturally. ACTIVE. |
| Invalid | `[data-invalid]` | Input | `.form-control.is-invalid` | Compound selector bridge: `.react-aria-TextField[data-invalid] .react-aria-Input` → invalid border color + validation `background-image` + adjusted `padding-right`. `.is-invalid` INERT (React Aria never adds). |

**Pseudo-class audit (on `.react-aria-Input` / `<input>`):**

| Bootstrap selector | Fires? | Notes |
|--------------------|--------|-------|
| `.form-control:hover` | N/A | No hover rule on `.form-control` (file-input hover rule only) |
| `.form-control:focus` | ACTIVE | React Aria renders real `<input>`; `:focus` fires naturally |
| `.form-control:focus-visible` | N/A | Bootstrap uses `:focus` not `:focus-visible` for form controls |
| `.form-control:disabled` | ACTIVE | React Aria sets `disabled` attribute; `:disabled` fires |
| `.form-control[readonly]` | ACTIVE | React Aria sets `readonly` attribute; `[readonly]` fires |
| `.form-control.is-invalid` | INERT | React Aria never adds `.is-invalid`; compound selector bridge required |
| `.form-control.is-valid` | INERT | React Aria never adds `.is-valid`; compound selector bridge required if in scope |
| `.was-validated .form-control:invalid` | INERT | No `.was-validated` parent in React Aria context |
| `.was-validated .form-control:valid` | INERT | No `.was-validated` parent in React Aria context |

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| FieldError visibility | MINOR | `.is-invalid ~ .invalid-feedback` sibling selector reveals feedback div | React Aria renders `<FieldError>` only when there is an error (no always-present hidden element) | Style `.react-aria-FieldError` as `.invalid-feedback` with `display: block` unconditionally — React Aria's rendering lifecycle controls visibility, not the sibling selector. |
| Invalid validation icon + padding | MINOR | `.form-control.is-invalid` adds `padding-right: calc(1.5em + 0.75rem)` + SVG icon via `background-image` | `.is-invalid` never fires on React Aria's `<input>` | Compound selector bridge on `.react-aria-TextField[data-invalid] .react-aria-Input` must reproduce both the `padding-right` and the `background-image` SVG icon from the compiled CSS audit. |
| Floating label DOM order | MAJOR | `.form-floating > .form-control ~ label` (general sibling `~`) requires `<input>` before `<label>` | React Aria renders `<Label>` before `<Input>` | See Decisions needed. Either reverse DOM order within `.form-floating`, or exclude floating labels from scope. |

### Reference story canvas

- **Stories:** Input States (default, focus, disabled, readonly, with value, with placeholder), Validation States (invalid with FieldError, invalid + focus), Full Field (Label + Input + Description + FieldError), Size Variants (sm, default, lg), TextArea Variant
- **Grid columns:** 3–4; inputs constrained to ~300px width for visual clarity
- **Width constraint:** ~1000px
- **Notes:** All state specimens use static `<input class="form-control">` with faux state classes for pseudo-class states. No `.faux-hover` needed — `.form-control` has no hover styling. FieldError specimens use `.invalid-feedback` without additional `display: block` override since React Aria controls rendering. One full-field specimen should show Label + Input + Description + FieldError as a complete form field layout.

### Confidence: High

*TextField is a clean 1:1 mapping — React Aria renders real `<input>` and `<label>` elements that Bootstrap's form control pattern targets directly. Almost all pseudo-class states fire naturally. The only bridges needed are for `.is-invalid` / `.is-valid` class-based validation and FieldError visibility. Floating label is a known MAJOR conflict (patterns.md §2.3) and is deferred to user decision.*

## Decisions

*(to be filled after user resolves M016 items in `agent/review-textfield.md`)*
