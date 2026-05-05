---
title: React Aria + Bootstrap Skill
iteration: 0
---

# React Aria + Bootstrap Skill

This file is the growing knowledge base for styling React Aria component libraries with Bootstrap. It is updated after each **experiment branch** debrief. Do not update it from the project branch (`styled-components`).

## Principles

**Goal:** Replace project CSS with Bootstrap. Bootstrap becomes the source of truth for all or most styling of the React Aria test components.

**P001: compound-sel — Compound selectors:** Retain the `.react-aria-*` class on every element alongside Bootstrap classes for specificity and non-conflicting React Aria CSS. Example: `.react-aria-Button.btn.btn-primary`.

**P002: class-in-tsx — Bootstrap className in TSX:** Style components by adding Bootstrap classes to the `className` attribute using the render-prop form:
```tsx
<Button className={(className) => `${className} btn btn-primary`}>
  Click me
</Button>
```

**P003: scss-bridge — SCSS bridge selectors (`_bootstrap-overrides.scss`):** Map React Aria `data-*` attributes to Bootstrap's interaction styles. Bootstrap is authoritative for interaction states.
```scss
// Example: bridge data-hovered to Bootstrap's :hover styles
.react-aria-Button[data-hovered] {
  // paste Bootstrap's .btn:hover rules here
}
```

**P004: conflict-css — Conflicting project CSS:** Comment out (do not delete) any project CSS rules that conflict with a desired Bootstrap rule.

**P005: bundle-isolation — Bootstrap-test stories require bundle-level CSS isolation:** Storybook compiles a single shared CSS bundle — all CSS imported anywhere in the project enters the global scope of every story. Commenting out CSS imports in bootstrap-test components is insufficient: the original stories import the original components, which import their CSS, which then matches `.react-aria-*` selectors everywhere. `@layer` deprioritization is also insufficient — it only arbitrates direct property conflicts; additive project styles (e.g. interaction-state backgrounds) apply unopposed when Bootstrap has no competing rule. The correct fix is a Storybook glob filter that loads only bootstrap-test stories, so no original component is ever imported and no project CSS enters the bundle. Storybook has no native per-story CSS isolation in any current version.

**P006: modifier-audit — Audit Bootstrap's modifier classes before implementing layout or orientation variants:** Bootstrap components often have modifier classes that handle layout variants with their own corrected structural selectors, token values, and border handling (e.g. `.list-group-horizontal`, `.nav-pills`, `.nav-fill`). Before implementing a React Aria layout or orientation variant, check Bootstrap's documentation for matching modifier classes and apply them — don't hand-roll what Bootstrap already provides.

**P007: variant-replace — Bootstrap variants are the authoritative set — replace, don't extend:** When Bootstrap defines variant classes for a component (e.g. `btn-primary`, `btn-success`), its full set is the authoritative prop type. Replace the component library's inherited `variant` type with Bootstrap's variant names (without prefix: `'primary' | 'secondary' | 'success'` etc.), build a `variantClassMap` mapping each to its full Bootstrap class, and remove any variant names with no Bootstrap equivalent (e.g. `quiet`, `ghost`, `cta`). Do not carry forward component-library-specific variants unless intentionally extending Bootstrap — the prop contract should reflect what Bootstrap actually provides. Any component with a `variant` prop must have a Variants story showing all supported values side by side. **Before finalizing the variant set, read the Bootstrap documentation page for that component and identify all meaningful variant classes from it — do not rely on recall.**

**P008: structural-sel — Bootstrap structural selectors break when React Aria inserts wrappers or headers:** Bootstrap uses structural CSS selectors (`:first-child`, `:last-child`, adjacent-sibling `+`) and `inherit` to propagate styles through a predictable parent → child path. React Aria components with sections, groups, or headers insert intermediate elements that sever these paths. `:first-child` on a list item fails when a header is the actual first child; `inherit` on border-radius picks up from the section wrapper rather than the outer container. The fix pattern: use explicit Bootstrap token values (e.g. `var(--bs-list-group-border-radius)`) in targeted bridge selectors rather than relying on Bootstrap's structural selectors firing correctly through React Aria's element tree.

**P009: clean-slate — Comment-out is not a clean slate — assert your own baseline:** Commenting out a project CSS file removes it from that component's import, but the same file may still load via another path (e.g., the original non-bootstrap story imports the original component, which imports its CSS). Any selectors in that file that match your Bootstrap-styled elements will still apply. Do not assume comment-out leaves a blank slate. For every structural property (margin, padding, display, sizing) that Bootstrap's classes expect to control, explicitly set it in the bridge or via Bootstrap utility classes — even if the value is just a reset to zero.

**P010: form-attach — Bootstrap form patterns don't attach to React Aria custom controls:** Bootstrap's form classes (`.form-check-input`, `.form-select`, etc.) target native inputs directly. React Aria's custom controls (Checkbox, Radio, Switch, Slider, Select) hide the native input and expose a custom visual element instead — so Bootstrap's patterns simply don't attach. When you encounter this mismatch, replicate Bootstrap's *visual outcome* on the custom element using bridge selectors and Bootstrap CSS variables. Do not try to force Bootstrap's class structure onto React Aria's markup.

**P011: cursor-pointer — Interactive non-anchor, non-button elements need `cursor: pointer` added explicitly:** Bootstrap interactive components built on `<a>` elements get pointer cursor for free. React Aria replaces many of these with `<div>` or `<span>` elements that carry no native cursor behavior. Any interactive React Aria element that would produce a pointer cursor in the equivalent Bootstrap component must have `cursor: pointer` added in the bridge.

**P012: match-dom — Match Bootstrap's component to React Aria's rendered output, not to the component name:** When choosing which Bootstrap pattern to apply, look at what React Aria actually renders in the DOM — not at naming similarity. React Aria's `Select`, for example, hides the native `<select>` and renders a custom `<button>` + popover + listbox. Bootstrap's `.form-select` targets the native element and doesn't attach; Bootstrap's dropdown (`.btn` + `.dropdown-menu`) matches the rendered structure. Always inspect the rendered output first.

**P013: prefer-component-cls — Prefer Bootstrap component classes and targeted CSS selectors over utility classes:** Utility classes (e.g. `d-flex`, `flex-column`, `w-100`) encode layout decisions in markup rather than in the component's stylesheet. Bootstrap component classes (`form-label`, `dropdown-menu`, `list-group-item`) carry semantic meaning and give the design system a coherent surface to work with and override. When a structural fix is needed, write it in the bridge CSS targeting the component's own selector — not by adding utility classes to the JSX. Reserve utility classes for genuinely one-off cases where no component class exists and a bridge rule would be disproportionate.

**P014: data-pressed — Bridge `[data-pressed]` to `:active` styles for keyboard press support:** CSS `:active` fires on mouse and touch press but not on keyboard activation. React Aria sets `[data-pressed]` for all three. Any `.btn`-based element needs a `[data-pressed]` bridge that mirrors Bootstrap's `:active` rule — otherwise keyboard-triggered press states are visually silent. Example for `.btn`:
```scss
.react-aria-Button.btn[data-pressed] {
  color: var(--bs-btn-active-color);
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
  @include box-shadow(var(--bs-btn-active-shadow));
}
```
This applies to any component using `.btn`, not just Button.

**P015: scss-mixins — Use Bootstrap's SCSS mixins for `$enable-*`-gated properties in bridge selectors:** Bootstrap conditionally emits certain CSS properties through mixins that check `$enable-*` flags — `@include box-shadow(...)` (`$enable-shadows`), `@include transition(...)` (`$enable-transitions`), `@include border-radius(...)` (`$enable-rounded`), `@include gradient-bg(...)` (`$enable-gradients`). Writing these as raw CSS properties in a bridge selector bypasses those flags and produces output the project may have deliberately suppressed (e.g. `$enable-shadows: false` is Bootstrap's default, so a raw `box-shadow:` declaration applies a shadow Bootstrap itself never renders). Since `_bootstrap-overrides.scss` is compiled after Bootstrap's variables and mixins are loaded, use the same mixin Bootstrap uses — not a raw property declaration.

**P016: fixed-dims — Fix explicit dimensions only when the indicator element itself mounts or unmounts:** When a visual indicator appears or disappears on state change (e.g., a checkmark SVG toggling visibility, a badge mounting), the container can shift layout if dimensions aren't held constant. Set explicit `width` and `height` using `rem` units (not `em`, which varies with inherited font-size) so the container occupies the same space regardless of state. Do not apply this to elements that are always present and only change visual treatment (color, border, background) — those should get their size from natural padding and content.

**P017: border-transparent — Prefer `border-color: transparent` over `border-width: 0` for hiding borders; use `outline` as a last resort:** Setting `border-color: transparent` hides a border while keeping it in the box model — no sizing delta between bordered and unbordered states, and `border-width` stays in the cascade so bridge rules can restore a visible border freely. Avoid `border-width: 0` (and Bootstrap's `.border-0` utility, which sets `border-width: 0 !important`) unless you are certain no bridge rule will ever need to restore a border on that element. When `.border-0 !important` is already in play and cannot be removed, use `outline` for any indicator that must appear — `outline` is independent of the border model and unaffected by `border-width` overrides.

**P018: postcss-scope — Scoping Bootstrap to a wrapper class — use `postcss-prefix-selector`, not SCSS nesting:** Never scope Bootstrap via SCSS nesting (e.g. `.bs-scope { @import "bootstrap"; }`). Sass resolves `&` to the full compiled ancestor chain, silently breaking Bootstrap's adjacent-sibling selectors (e.g. `:not(.btn-check) + &:active` becomes `:not(.btn-check) + .bs-scope .btn:active`). Use `postcss-prefix-selector` instead — it operates on compiled CSS output and prepends the scope class correctly. Apply it as a `postcss-loader` step after `sass-loader`. Two edge cases require a `transform` function: `:root` must stay global so `--bs-*` properties resolve everywhere; `[data-bs-theme]` must attach directly to the scope class with no space (`.bs-test[data-bs-theme="dark"]`) because Bootstrap's dark mode attribute is set on the scope wrapper itself.
```js
transform: (prefix, selector) => {
  if (selector === ':root') return selector;
  if (selector.startsWith('[data-bs-theme')) return `${prefix}${selector}`;
  return `${prefix} ${selector}`;
}
```

**P019: outline-base — `btn-outline-{variant}` as a behavioral base for borderless interactive elements:** `btn-outline-{variant}` ships with Bootstrap's full interaction state rules — hover background fill, active background, focus ring. Pairing it with `border-color: transparent` suppresses the visible border at rest while leaving those interaction styles intact. Use this for two categories: (1) grid/list cells (date cells, list items — repeated elements where visible borders add noise); (2) component chrome controls (prev/next, dismiss, expand buttons that live inside a larger component). If a button's job is to be *noticed*, keep the border; if its job is to be *available*, use `border-color: transparent`.

**P020: reboot-align — Bootstrap reboot overrides browser defaults — make alignment explicit:** Bootstrap's `_reboot.scss` resets browser defaults that components may silently rely on. A common case: `th { text-align: inherit }` overrides the browser's default centering of `<th>` elements. Never rely on browser-default alignment when Bootstrap is loaded — declare it explicitly. Common resets to watch: `<th>` text-align, `<fieldset>` border/padding, `<legend>` sizing, `<button>` background/border.

**P021: outline-text-color — `btn-outline-*` sets text color to the variant color, not body color:** `btn-outline-{variant}` sets `--bs-btn-color` to the variant color (e.g. `$secondary` → `#6c757d`). On standalone buttons this is intentional. On cells or list items where readable body text is expected, it produces text that is too light. Fix: explicitly override with `color: var(--bs-body-color)` in the bridge.

**P022: bs-icons — Bootstrap Icons over inline SVG:** When Bootstrap Icons is available, prefer `<i class="bi bi-{name}">` over inline SVG (e.g. lucide-react imports). Bootstrap Icons are an icon font: they inherit `color`, scale with `font-size`, and align with Bootstrap's type scale without extra CSS. Prerequisite: `bootstrap-icons` installed (`yarn add bootstrap-icons`) and CSS imported (`import 'bootstrap-icons/font/bootstrap-icons.css'`). Apply to any icon in the Bootstrap Icons set (https://icons.getbootstrap.com). Do not apply where no equivalent exists or the design requires custom SVG geometry.

**P023: css-native-visual — Let Bootstrap render CSS-native visual elements — don't add a JSX icon:** When Bootstrap renders a visual indicator via a pseudo-element (`::before`, `::after`) or `background-image` (e.g. dropdown caret, checkbox checkmark, breadcrumb separator), do not add a JSX icon alongside it. Remove any existing JSX icon and do not suppress the pseudo-element with `content: none` or similar. Adding both produces duplicates; suppressing Bootstrap's version loses the dark mode and theme token wiring it carries.

**P024: caret-flip — Directional caret flip for expandable elements:** Any caret on an element that opens a popover, dropdown, or disclosure must rotate 180° when open. Read open state from `[data-open]` on the component root or `[aria-expanded="true"]` on the trigger. Use `transform: rotate(180deg)` — do not swap icon variants or toggle icon visibility.

**P025: hardcode-show — Hardcode `.show` on Bootstrap overlay elements:** Bootstrap JS toggles overlay visibility by adding/removing `.show` on elements like `.dropdown-menu`, `.collapse`, and `.modal`. React Aria manages visibility by mounting/unmounting the element instead. When using Bootstrap overlay classes, hardcode `.show` permanently — React Aria's mount/unmount provides the visibility control; `.show` just ensures Bootstrap's visible styles are always active when the element exists in the DOM.

**P026: use-rem — Use `rem` for Bootstrap-matched sizing, not `em`:** Bootstrap sizes fixed UI elements in `rem`, anchored to the root font size. Using `em` causes elements to scale with local font-size context, diverging from Bootstrap's values in nested containers. Only use `em` where Bootstrap itself uses it for intentionally fluid scaling. Example: a checkbox indicator sized `1em × 1em` shrinks inside a smaller-font-size context; `1rem × 1rem` matches Bootstrap's `.form-check-input` regardless of nesting.

**P027: btn-non-button — `btn` on non-`<button>` interactive elements:** Apply `btn` to any non-`<button>` element (e.g. `<td>`, `<div>`) that a component library makes interactive. It provides the correct cursor, padding, focus baseline, and interaction state hooks. Do not rely on the element's native role alone — `btn` is what makes Bootstrap's interaction CSS apply.

**P028: btn-sm-dense — `btn-sm` in grid-constrained contexts:** Prefer `btn-sm` over `btn` when the element lives inside a dense layout (calendar grid, toolbar, inline action row). It reduces padding without custom sizing CSS and keeps elements from overflowing their containers.

**P033: verify-scss-vars — Verify Bootstrap SCSS variables exist and resolve to what you expect before using them:** Do not infer variable names by naming pattern (e.g. `*-hover-color` exists → `*-hover-bg` must exist). Before writing any `$bootstrap-variable` in `_bootstrap-overrides.scss`, confirm it is present in Bootstrap's `_variables.scss` *and* check what it resolves to — names can be misleading (e.g. `$input-focus-color` is the input *text* color when focused, not the focus ring color). When no variable exists for a value, use the equivalent `--bs-*` CSS custom property or a hardcoded Bootstrap token value instead.

**P036: derive-from-counterpart — When a Bootstrap counterpart exists, derive bridge rules from its actual applied CSS:** When a React Aria component has a direct Bootstrap counterpart (e.g. `.form-check-input` for Checkbox, `.form-control` for Input), inspect Bootstrap's compiled CSS or source SCSS for each state and copy the property/variable pattern from it — do not construct bridge rules from variable names alone. Starting from Bootstrap's own rules gives the correct CSS property (e.g. `box-shadow` not `outline` for focus rings), the correct variables, and guards against misleading variable names. This applies even when P010 prevents direct class attachment — the counterpart's CSS is still the reference.

**P034: contrast-all-states — Text labels must maintain ≥ 4.5:1 contrast through all interaction states:** Verify contrast not just at rest but at hover, active, focus, selected, and disabled states. A text color that works at rest may fail against the background Bootstrap applies at hover or active. When a bridge overrides Bootstrap's text color (e.g. to restore body color on an outline element), scope that override to the rest state or extend it across all states so the full interaction state machine maintains sufficient contrast.

**P039: sub-element-counterpart — Extend counterpart identification to every named sub-element:** P012 and P036 establish counterpart identification at the top-level component. Apply the same discipline to every named sub-element in the React Aria component (headers, labels, separators, dividers, footers, action areas). Each sub-element that serves a specific structural or semantic role has a Bootstrap counterpart within the matched Bootstrap pattern — find it and derive the sub-element's styling from its actual CSS. Do not invent styles for sub-elements in isolation. Example: a non-interactive section label within a list → `.dropdown-header` within `.dropdown-menu`, which provides muted color, reduced font-size, padding, and no border — differentiation through typography and color alone.

**P040: container-owns-boundary — Put boundary properties on the container, not on its children:** Bootstrap derives many outer-boundary effects (top/bottom border, border-radius) from structural child selectors (`:first-child`, `:last-child`, adjacent-sibling). P008 established that these selectors break when React Aria inserts wrapper elements. The same failure occurs in any situation where children are not in their expected structural positions: overflow scrolling (scroll removes first/last items from view), section wrappers, or nested groups. The fix is always the same: apply the boundary property — border, border-radius, or both — directly to the outer container element. Item-level borders then serve as internal row separators only; the container's visual frame is self-contained.

**P038: prop-audit-first — Before implementing any component, enumerate its React Aria prop surface from the documentation:** Read the React Aria documentation for the component and list all props before writing any code. Flag any prop with layout, orientation, selection-mode, or variant semantics — these require bridge rules and stories. Do not rely on recall; the documentation is the authoritative prop surface. This mirrors P007 (which requires reading Bootstrap docs before finalizing variants): both the React Aria prop surface and the Bootstrap variant set must be read, not remembered.

**P037: multi-select-separator — Add a visible separator between adjacent selected items in multi-selection components:** When a component supports multiple simultaneous selection and the selected-state style fills the item background, adjacent selected items share the same filled background with no visual break — making them read as a single merged selection rather than discrete selected items. Add a visible separator between adjacent selected items: a border, outline stroke, or gap. This is a visual correctness requirement regardless of whether the underlying Bootstrap component offers multi-selection behavior — the separator need must be identified from the React Aria prop surface (`selectionMode="multiple"` or equivalent) and applied in the bridge.

**P035: no-color-alone — Use a non-color visual attribute as the primary state differentiator:** Do not use a color change alone to convey a state — provide a secondary non-color cue (border, background fill, shape, weight). Two constraints apply simultaneously: (1) WCAG 1.4.1 prohibits relying on color as the sole visual means of conveying information; (2) Bootstrap's semantic color palette has established conventions (primary blue = interactive/link, danger red = error) — repurposing these colors for unrelated states creates visual confusion even where contrast is sufficient. Use a border or background fill as the primary indicator; color accent is additive, not primary.

**P043: visual-metaphor-completeness — Verify that the rendered output reproduces Bootstrap's full visual metaphor, not just individual state properties:** Bootstrap components produce many of their characteristic effects through coordinated CSS across multiple elements — negative margins that create visual connections, pseudo-element indicators, overlapping backgrounds that occlude borders, etc. Correctly bridging color and border-color properties for each state is necessary but not sufficient. After writing all bridge rules, ask: "does the rendered component tell the same visual story Bootstrap intends?" Check the full coordinated effect, not just that each mapped property is correct in isolation. Two categories of properties must both be present: (1) properties Bootstrap applies to all instances of an element (e.g. structural margins, z-index) — these come from Bootstrap's own CSS automatically and must be verified to still work through the React Aria DOM; (2) properties Bootstrap applies via `.active` or state classes — these are not triggered by React Aria and must be explicitly included in the `[data-*]` bridge. A bridge that maps colors and border-color but omits a load-bearing `background-color` can produce individually correct property values while still failing the visual metaphor.

**P041: value-display-stable-dims — A component that displays a mutable value must not resize as the value changes:** Bootstrap's native `<select>` sizes to its full option set automatically; a custom trigger backed by a `<button>` intrinsically sizes to current content and shifts surrounding layout on each selection change. Any component whose rendered value changes during interaction (Select, ComboBox, DatePicker, etc.) must size its container to accommodate the full range of possible values — not the currently displayed value. For finite option sets, use a hidden sizer element (a visually-hidden `<span>` containing all option labels, `aria-hidden`); for open-ended inputs, `width: 100%` or an explicit width. Unstable control dimensions produce reflow on every interaction.

**P042: right-anchor-indicator — In any flex row with a content region and a trailing indicator, pin the indicator to the right edge:** When a flex container holds a label, value, or text region alongside a trailing indicator (caret, chevron, icon, badge), use `justify-content: space-between` on the container or `margin-left: auto` on the indicator. The content region should expand to fill available space; the indicator should not drift with content length. Applies to any flex row with a trailing indicator: trigger buttons, list items, accordion headers, nav links, or similar. P024 addresses caret rotation on open/close; this principle addresses caret placement.

## Data-* Bridge Rules

Bridge a `data-*` attribute in `_bootstrap-overrides.scss` **only when**:
1. No native CSS pseudo-class equivalent exists (e.g., `[data-selected]`, `[data-invalid]`, `[data-indeterminate]`)
2. The element is non-native (e.g., `<div>`, `<td>`) so pseudo-classes don't fire
3. React Aria uses `aria-disabled` + `[data-disabled]` without native `disabled` (element must stay focusable)

**Do not bridge** native pseudo-classes that fire automatically:
- `:hover` on native elements — use `:hover` directly
- `:focus-visible` on native elements — use `:focus-visible` directly
- `:active` on native elements — use `:active` directly
- `:disabled` on native `<input>` elements

## When Bootstrap Mapping Cannot Be Found

If the Bootstrap equivalent for a component or interaction state cannot be identified:
1. Log it in the "Unmapped" section at the bottom of this file
2. List potential alternative Bootstrap sources (similar in appearance or function)

## Stories Conventions

**P029: argtypes-control — Constrained argTypes for string union props:** When a prop is a string union, configure `argTypes` with an explicit `options` array and pick the control type by count: 2–5 values → `control: { type: 'inline-radio' }`; 6+ values → `control: { type: 'select' }`. Do not rely on Storybook's auto-inferred free-text control — it produces an open text field that obscures the valid values.

**P030: layout-variants-story — Layout Variants story:** For any component with layout or orientation variants, add a single "Layout Variants" story showing all non-default permutations inline side by side. Do not add one story per permutation.

**P031: state-stories — State stories:** Add separate stories for `Disabled`, `Invalid`, and `WithDescription` where applicable. These benefit from independent Controls panel manipulation and make state coverage explicit.

**P032: title-case-labels — Variants story labels must be title-cased — never raw prop strings:** When a Variants story maps over prop values to render each variant (e.g. `{VARIANTS.map(v => <Button variant={v}>{v}</Button>)}`), labels render lowercase because prop values are lowercase strings. Always title-case the label: either capitalize the first letter (`v.charAt(0).toUpperCase() + v.slice(1)`) or use Bootstrap's documented display name. Do not pass the raw prop string as the visible label.

## Self-Review Checklist

Before delivering iteration work, verify:
- [ ] Storybook builds without errors — start a fresh instance and confirm the build output is clean before proceeding (HTTP 200 and story registration are not sufficient; check the actual webpack/sass output)
- [ ] Every test component has Bootstrap classes in its `className` (not just CSS overrides)
- [ ] All `data-*` bridges that are needed are in `_bootstrap-overrides.scss`
- [ ] No project CSS rules that conflict with Bootstrap are left uncommented
- [ ] Unmapped components/states are logged with alternatives
- [ ] All string-union props have constrained `argTypes` (inline-radio, explicit options)
- [ ] React Aria documentation was read for each component; all props with layout, orientation, selection-mode, or variant semantics are implemented with bridge rules and stories (P038)
- [ ] Visual comparison completed: each component screenshot-compared against its Bootstrap Reference story (default + interaction states); all fixable deltas resolved; only design decisions remain

## Visual Comparison Workflow

Before delivering, visually compare each test component against its Bootstrap Reference story and resolve fixable deltas. Do not present raw differences to the user — fix what you can first. Human review should focus on design decisions, not regressions the agent can close independently.

**Storybook URL patterns:**
- Test story:      `http://localhost:6006/?path=/story/bootstrap-test-{component}--example`
- Reference story: `http://localhost:6006/?path=/story/bootstrap-reference-{component}--{story-name}`

Reference story names vary — use the Storybook sidebar under "Bootstrap Reference" to find the relevant story.

### Fix loop (repeat until clean)

1. Open two tabs — test story in one, reference story in the other
2. Screenshot both; zoom into the component area of each
3. List every visual difference
4. Classify each difference:
   - **Fixable** — a CSS/class gap with an unambiguous Bootstrap solution → fix it now
   - **Design decision** — requires a judgment call (e.g. "filled vs. outlined today cell") → flag for user
   - **Intentional** — a documented deviation → note it
5. Apply all fixable fixes, reload, re-screenshot to confirm
6. Repeat until no fixable deltas remain

### What to compare

**Default (at-rest) state:**
- Typography: font weight, size, color
- Spacing: padding, row/cell gaps
- Color and fill: background, border, text at rest
- Interactive affordance (does it look clickable?)
- Overall size and proportions

**Interaction states:**

For each stateful component, compare the test component's `data-*` state against the reference component's equivalent CSS pseudo-class or Bootstrap state class. Minimum coverage:

| Test state | Trigger method | Reference equivalent |
|---|---|---|
| `[data-hovered]` | `@browser` hover over element | `:hover` |
| `[data-pressed]` | `@browser` javascript_tool: set `data-pressed="true"` on element | `:active` |
| `[data-focused]` | `@browser` Tab key to focus element | `:focus-visible` |
| `[data-selected]` | Navigate to story with selection active | `.active` / Bootstrap selected state |
| `[data-disabled]` | Navigate to Disabled story | `disabled` attribute / `.disabled` class |
| `[data-invalid]` | Navigate to Invalid/WithError story | Bootstrap invalid feedback styling |

For forced states (e.g. `data-pressed`), use `@browser javascript_tool` to temporarily set the attribute on the element, screenshot, then remove it.

### Deliver to user only when

- All fixable deltas (default + interaction states) are resolved and confirmed via re-screenshot
- Remaining items are design decisions or intentional deviations, documented in the Agent Iteration Summary

### Record in review file

In `agent/review-iteration-N.md`, Agent Iteration Summary: add a "Visual Comparison" subsection per component listing:
- Resolved deltas (what was fixed)
- Open design decisions (deferred to user)
- Intentional deviations (documented departures)

## Bootstrap Counterpart Pairings

Approved pairings of React Aria components to Bootstrap patterns. Entries are added only after user approval. When encountering a new component, consult this table first — generalize by matching the component's rendered DOM structure to existing entries before researching from scratch.

| React Aria Component | Rendered DOM Structure | Bootstrap Pattern | Docs |
|----------------------|----------------------|-------------------|------|
| Button | Native `<button>` | `.btn.btn-{variant}` | [Buttons](https://getbootstrap.com/docs/5.3/components/buttons/) |
| TextField | `<label>` + `<input>` + description/error `<div>`s | `.form-label` + `.form-control` + `.form-text` + `.invalid-feedback` | [Form control](https://getbootstrap.com/docs/5.3/forms/form-control/) |
| Checkbox | `<label>` root + custom indicator `<div>` (native `<input>` hidden) | `.form-check` (visual reference only — Bootstrap targets native input; bridge required for custom indicator) | [Checks](https://getbootstrap.com/docs/5.3/forms/checks-radios/) |
| Select | `<button>` trigger + `<div>` popover overlay + listbox | `.btn.btn-secondary.dropdown-toggle` + `.dropdown-menu` | [Dropdowns](https://getbootstrap.com/docs/5.3/components/dropdowns/) |
| Tabs | `<div>` tab list + `<div>` tab items + panel container | `.nav.nav-tabs` + `.nav-link` + `.tab-content` + `.tab-pane` | [Navs & Tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/) |
| Calendar | Calendar grid — no Bootstrap counterpart | No counterpart. Cell treatment: `.btn.btn-sm.btn-outline-secondary` with `border-color: transparent` at rest. | — |
| ListBox | List container + interactive item children | `.list-group` + `.list-group-item` (static) / `.list-group-item-action` (interactive) | [List group](https://getbootstrap.com/docs/5.3/components/list-group/) |

**How to generalize to new components:**
- Identify the component's rendered DOM structure (inspect in browser, not component name)
- Match the structure to existing entries: trigger + overlay → dropdown; list container + items → list-group; label + input → form control
- When no existing entry matches, check Bootstrap's docs for a component whose HTML structure resembles the rendered output

## Pattern Library

*Patterns discovered through iteration. Empty until iteration 0 completes.*

## Iteration History

*Updated after each experiment-branch debrief.*

## Unmapped Components / States

*Log components or states where Bootstrap mapping is unclear. Include alternatives.*

| Component | State/Element | Alternatives considered |
|-----------|--------------|------------------------|
| — | — | — |
