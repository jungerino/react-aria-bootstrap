# Bootstrap Guidelines



> **🚫 DEPRECATED — FOR CLAUDE:** The sections below are no longer authoritative.
> Treat them as an example template for future entries. You may discard them
> once they are no longer needed.

---

## General Approach

- Retain the `.react-aria-*` class on every element alongside Bootstrap classes (e.g., `react-aria-Button btn btn-primary`). This preserves non-conflicting React Aria CSS and provides specificity hooks.
- Remove project utility classes that conflict with Bootstrap's box model (e.g., `button-base`, `.inset`).
- Bootstrap is the eventual source of all styling. Replace project CSS tokens (`--tint-*`, `--gray-*`, `--spacing-*`, `--text-*`, etc.) with Bootstrap equivalents as each component is styled. If no equivalent exists, keep the project token and **log it in a "Token Outliers" section at the bottom of this file**.

---

## data-* Bridges

Bridge `data-*` attributes in `_bootstrap-overrides.scss` **only when**:

1. There is no native CSS pseudo-class equivalent (e.g., `[data-selected]`, `[data-invalid]`, `[data-indeterminate]`).
2. The element is non-native (e.g., `<div>`, `<td>`) so pseudo-classes don't fire.
3. React Aria uses `aria-disabled` + `[data-disabled]` **without** the native `disabled` attribute — i.e., it wants the element to remain keyboard-focusable when disabled. This applies to `Button`, `Tab`, and similar interactive non-input elements.

**Do not bridge** when a native pseudo-class fires automatically:
- `:hover`, `:focus-visible`, `:active` on native elements — use native selectors directly.
- `:focus` on native `<input>` elements (TextField, ComboBox input) — Bootstrap's `.form-control:focus` fires natively.
- `:disabled` on native `<input>` elements inside compound components — React Aria sets the native `disabled` attribute there.

**Refined `[data-disabled]` principle**: React Aria sets `aria-disabled` + `[data-disabled]` (no native `disabled`) on elements that must stay focusable when disabled (Button, Tab). It sets native `disabled` on `<input>` elements inside compound components. Bridge `[data-disabled]` only for the former case.

---

## Dark Mode

- Keep `$color-mode-type: "data"` (Bootstrap's default). Do not change to `"media-query"`.
- Add a decorator in `.storybook/preview.js` that reads `context.globals.backgrounds.value` and sets `data-bs-theme="dark"` on `document.documentElement` when the dark background is selected. The dark background hex must be explicitly configured in `preview.js` so the decorator has a stable value to compare against.
- Any component that uses `--bs-*` CSS variables gets dark mode for free — no component-specific dark mode work needed.

---

## CSS-Native Visual Elements

When Bootstrap renders a visual element via a pseudo-element or `background-image` (`::before` separator, `::after` caret, `background-image` indicator), **remove the corresponding JSX icon and do not suppress the pseudo-element**.

- **Breadcrumbs**: Remove `<ChevronRight />` from `Breadcrumbs.tsx`; remove `content: none` override to restore Bootstrap's `::before` separator.
- **Select**: Remove `<ChevronDown />` from `Select.tsx`; use a `::after` pseudo-element caret instead (see Select section).
- **Checkbox / RadioButton**: Remove `<svg>` checkmark from `Checkbox.tsx`; use Bootstrap's `background-image` mechanism (see Checkbox section).

---

## Directional Caret Flip

Any caret indicating an expanding popover must rotate 180° when open. Read open state from `[data-open]` on the component root or `[aria-expanded="true"]` on the trigger. Use `transform: rotate(180deg)` — do not swap icon variants.

- **Select**: `.react-aria-Select[data-open] .react-aria-Button.form-select::after { transform: rotate(180deg); }`
- **ComboBox**: same pattern.
- **Disclosure**: apply via `[data-expanded]` if it uses a chevron icon.

---

## Variants

- When Bootstrap defines variant classes for a component, they are the authoritative set. Replace the component's `variant` prop type with Bootstrap's variant names (without prefix, e.g., `'primary' | 'secondary' | 'danger'`). Build `variantClassMap` to map each to its full Bootstrap class. Remove React Aria variant names with no Bootstrap equivalent.
- **Button**: Expand `variant` from `'primary' | 'secondary' | 'quiet'` to the full Bootstrap button variant set: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`, and `outline-*` variants for each.
- Any component with a `variant` prop must have a **Variants story** showing all values side by side.

---

## Form Components (`Form.tsx`)

Add default Bootstrap classes to form primitive components in `Form.tsx` so all usages get Bootstrap styling automatically:

- `Label` → add `form-label` as default `className`
- `Description` → add `form-text` as default `className`
- `FieldError` → add `invalid-feedback` as default `className`

Add a visibility bridge in `_bootstrap-overrides.scss` for `FieldError` (Bootstrap hides `.invalid-feedback` by default; React Aria never adds `.is-invalid`):

```scss
.react-aria-TextField[data-invalid] .react-aria-FieldError.invalid-feedback {
  display: block;
}
```

---

## Overlay Components (Popover, Dropdown)

- **Hardcode `.show`** on any Bootstrap overlay element whose visibility Bootstrap JS would toggle (`dropdown-menu`, `collapse`, `modal`, etc.). React Aria mounts/unmounts these elements — `.show` should be permanently present.
- **Portal container**: Use `UNSTABLE_portalContainer` on `Popover` to render the portal inside the `.bs-scope` element, not `document.body`. This ensures Bootstrap's scoped styles and `[data-bs-theme]` dark mode reach portal content. React Aria's positioning is viewport-relative and unaffected.

---

## Layout and Containers

**Form group containers** (e.g., `CheckboxGroup`, `RadioGroup`) with no Bootstrap group equivalent: use `display: flex` + `gap` for spacing. `flex-direction: column` for vertical, `flex-direction: row` for horizontal.

**Bootstrap float/padding-left layout**: When Bootstrap positions a floated child via `padding-left` on a wrapper and `float: left; margin-left: -X` on the child, prefer the React Aria flexbox approach and zero out Bootstrap's `padding-left` on the wrapper (e.g., `padding-left: 0` on `.form-check`).

---

## Stories

- **Constrained argTypes**: When a prop is a string union with 2–5 values, configure `argTypes` with `control: { type: 'inline-radio' }` and an explicit `options` array. Do not rely on Storybook's auto-inferred free-text control.
  - Known instances: `selectionMode` on `ListBox.stories.tsx`; `variant` on `Button.stories.tsx`.
- **Layout variants**: Add a single "Layout Variants" story showing all non-default layout permutations inline. Do not add one story per permutation.
  - Applies to: `ListBox` (layout × orientation), `Tabs` (orientation), `CheckboxGroup` (orientation).
- **State stories**: Add separate stories for `Disabled`, `Invalid`, and `WithDescription` where applicable. These benefit from independent Controls panel manipulation.
  - Required for: `TextField` (`Disabled`, `Invalid`, `WithDescription`).

---

## Component-Specific Decisions

### Button
- Classes: `react-aria-Button btn btn-{variant}`
- Remove `button-base` utility class.
- Keep SVG icon sizing rules, `kbd` styling, `ProgressBar` dark mode override.
- In `_bootstrap-overrides.scss`: remove `[data-focus-visible]` and `[data-pressed]` bridges (native `:focus-visible` and `:active` fire). Keep `[data-disabled]` bridge.

### Breadcrumbs
- Remove `<ChevronRight />` from TSX; remove `content: none` override in `Breadcrumbs.css` to restore Bootstrap's `::before` separator.

### Calendar
- Use `.btn.btn-ghost` (custom variant) on day cells and prev/next nav buttons. Define `.btn-ghost` in `_bootstrap-overrides.scss`:
  - Default: transparent bg, `border-color: transparent` (not `none`), text `var(--bs-body-color)`.
  - Hover/focus: `.btn-secondary` interaction colors via Bootstrap CSS vars.
  - Selected (`[data-selected]`): emulates `.btn-primary`; bridge via `_bootstrap-overrides.scss`.
- Add `text-align: center` to `.react-aria-CalendarHeaderCell` in `Calendar.css` (Bootstrap reboot sets `th { text-align: inherit }`).
- Keep `border-radius: 9999px` on day cells (intentional pill shape).

### Checkbox / RadioButton
- Remove `<svg>` from `Checkbox.tsx`.
- On `.form-check-indicator`: add `background-image: var(--bs-form-check-bg-image)`, `background-repeat: no-repeat`, `background-position: center`, `background-size: contain`, `print-color-adjust: exact`.
- In `_bootstrap-overrides.scss`, bridge `[data-selected]` → set `--bs-form-check-bg-image` to `$form-check-input-checked-bg-image`; bridge `[data-indeterminate]` → `$form-check-input-indeterminate-bg-image`.
- RadioButton: same pattern with `border-radius: 50%` and `$form-check-radio-checked-bg-image`.
- Add `padding-left: 0` to `.react-aria-Checkbox.form-check` to neutralize Bootstrap's float-layout padding.
- Bridge `:active` → `filter: $form-check-input-active-filter` on `.form-check-indicator`.

### CheckboxGroup
- No Bootstrap group container class exists. Use `display: flex` + `gap` for layout (column/row per orientation).


## Token Outliers

*Log project tokens with no Bootstrap equivalent here during the v2 pass.*

| Component | File | Property | Token | Notes |
|-----------|------|----------|-------|-------|
| — | — | — | — | — |
