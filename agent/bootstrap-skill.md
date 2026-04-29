---
title: Universal Bootstrap Skill
---

# Universal Bootstrap Skill

Principles that apply to **any component library** being styled with Bootstrap — not specific to React Aria. Populated retroactively when a principle from `react-aria-skill.md` is recognized as non-React-Aria-specific.

Do not write to this file proactively. Extract during debriefs when a principle clearly generalizes.

## Principles

### Scoping Bootstrap to a wrapper class

**Never use SCSS nesting to scope Bootstrap** (e.g. `.bs-scope { @import "bootstrap"; }`). Sass resolves `&` to the full compiled ancestor chain, so Bootstrap's adjacent-sibling selectors break silently. For example, `:not(.btn-check) + &:active` inside `.bs-scope { .btn { … } }` compiles to `:not(.btn-check) + .bs-scope .btn:active` — which requires `.bs-scope` itself to have a non-`.btn-check` preceding sibling, not the button. Only selectors that don't use `&` with combinators (like `&:first-child:active`) survive intact, so failures are inconsistent and hard to trace.

**Use `postcss-prefix-selector` instead.** It operates on compiled CSS output, sees selectors as flat strings, and prepends the scope class correctly without disturbing combinator chains. Apply it as a `postcss-loader` step after `sass-loader` in the Webpack rule for the Bootstrap entry file.

A `transform` function is required to handle two edge cases:
- **`:root`** — keep global so `--bs-*` custom properties resolve everywhere, not just inside the scope element.
- **`[data-bs-theme]`** — attach directly to the scope class with no space (`${prefix}${selector}`, e.g. `.bs-test[data-bs-theme="dark"]`), because Bootstrap's dark mode attribute is set on the scope wrapper itself, not on a descendant.

```js
transform: (prefix, selector) => {
  if (selector === ':root') return selector;
  if (selector.startsWith('[data-bs-theme')) return `${prefix}${selector}`;
  return `${prefix} ${selector}`;
}
```

### Outline variant as a behavioral base

`btn-outline-{variant}` ships with all of Bootstrap's interaction state rules already written — hover background fill, active background, focus ring. Pairing it with `border-0` suppresses the visible border at rest while leaving those interaction styles fully intact.

This separates **resting appearance** from **interactive behavior**: the element looks borderless and unobtrusive by default, but gets Bootstrap's full hover/active/focus treatment on interaction — with no custom CSS required.

Use this pattern whenever an element needs to look plain at rest but still respond visually to user interaction. `btn-outline-secondary border-0` is the neutral starting point; swap the variant for color when selection or emphasis is needed.

**Two categories of element call for this treatment:**

- **Grid/list cells** — date cells, list items, option rows. These are dense and repeated; visible borders add visual noise and fight the surrounding layout.
- **Component chrome controls** — prev/next navigation, close, expand, dismiss buttons that live *inside* a component rather than standing alone as primary actions. These are structural affordances; their job is to be discoverable on hover, not prominent at rest.

The distinction to apply: if a button's primary job is to be *noticed* (call-to-action, form submit, destructive confirm), keep the border. If its job is to be *available* (navigation, toggle, dismiss within a larger component), use `border-0`.

**Examples:**
- Calendar date cells — `<td>` elements that should look like plain text at rest but respond like buttons on hover/press.
- Calendar prev/next month buttons — icon-only navigation controls that are chrome inside the calendar header, not standalone actions.

### Bootstrap reboot overrides browser defaults — make alignment explicit

Bootstrap's `_reboot.scss` resets many browser defaults that components may silently rely on. A common case: `th { text-align: inherit }` overrides the browser's default `text-align: center` for table header cells. Any component that renders `<th>` elements and relies on browser-default centering will lose it when Bootstrap loads.

**Rule:** Never rely on browser-default alignment when Bootstrap is loaded. If an element should be centered (or otherwise aligned), declare it explicitly in the component's CSS.

**Common reboot resets to watch for:** `<th>` text-align, `<fieldset>` border/padding, `<legend>` sizing, `<button>` background/border, `<a>` color in some contexts.

### `btn-outline-*` sets text color to the variant color, not body color

`btn-outline-{variant}` sets `--bs-btn-color` to the variant color (e.g. `$secondary` → `#6c757d`). On standalone buttons this is intentional. On cells, header items, or any element where readable body text is expected, it produces text that is too light.

**Rule:** When using `btn-outline-*` on a non-button element (grid cell, list item, etc.) where the text should read as normal body content, explicitly override with `color: var(--bs-body-color)` in the bridge or component CSS.

### Bootstrap Icons over inline SVG

When Bootstrap Icons is available, prefer `<i class="bi bi-{name}">` over inline SVG (e.g. lucide-react imports). Bootstrap Icons are an icon font: they inherit `color`, scale with `font-size`, and align with Bootstrap's type scale and spacing without extra CSS. Inline SVGs require explicit sizing, color wiring, and import maintenance.

**When to apply:** Any icon that exists in the Bootstrap Icons set and lives inside a Bootstrap-styled component. Check the set at https://icons.getbootstrap.com.

**Prerequisite:** `bootstrap-icons` must be installed (`yarn add bootstrap-icons`) and the CSS imported (`import 'bootstrap-icons/font/bootstrap-icons.css'`).

**Do not apply** to icons that have no Bootstrap Icons equivalent, or where the design requires a custom SVG with specific geometry.

### Match Bootstrap's unit choice when replicating its sizing

Bootstrap sizes fixed UI elements (form controls, indicators, spacing scale) in `rem`, anchored to the root font size. Using `em` instead causes elements to scale with the local font-size context — producing sizes that diverge from Bootstrap's values in nested or modified-font-size containers.

**Rule:** When replicating Bootstrap's sizing, use `rem` for fixed sizes. Only use `em` where Bootstrap itself uses `em` for intentionally fluid or relative scaling.

**Example:** A checkbox indicator sized at `1em × 1em` will shrink inside a smaller-font-size context; `1rem × 1rem` matches Bootstrap's `.form-check-input` regardless of nesting.

### `btn` on non-`<button>` interactive elements

Apply `btn` to any non-`<button>` element (e.g. `<td>`, `<div>`) that a component library makes interactive. It provides the correct cursor, padding, focus baseline, and interaction state hooks without extra markup.

Do not rely on the element's native role alone — `btn` is what makes Bootstrap's interaction CSS apply.

### `btn-sm` in grid-constrained contexts

Prefer `btn-sm` over `btn` when the element lives inside a dense layout (calendar grid, toolbar, inline action row). It reduces padding without custom sizing CSS and keeps elements from overflowing their containers.
