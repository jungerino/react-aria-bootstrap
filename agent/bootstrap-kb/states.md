---
what: Bootstrap 5.3.8 state and interaction reference
contains: For each state: CSS selector Bootstrap uses, visual change produced, components it applies to. Includes JS state mutation catalog.
when-to-load: ALWAYS during the mapping phase. Primary source for the "State mappings" column of mapping-table.md.
related: components.md for component-specific state context
---

# Bootstrap 5.3.8 States

Sources (SCSS, read in full): `_buttons.scss`, `_nav.scss`, `forms/_form-control.scss`, `forms/_form-check.scss`, `forms/_form-select.scss`, `forms/_form-range.scss`, `forms/_validation.scss` (+ `mixins/_forms.scss`, which contains the actual selector-generating mixin invoked by `_validation.scss`), `_list-group.scss`, `_dropdown.scss`, `_accordion.scss`, `_modal.scss`, `_pagination.scss`, `helpers/_focus-ring.scss`, `_transitions.scss` (the shared `.collapse`/`.collapsing`/`.fade` rules referenced by Accordion, Modal, Offcanvas, Dropdown, Nav Tabs).

**Compiled-CSS verification (per skill instruction) — command run:**
```bash
grep -n ":invalid\|:valid\|:checked\|:indeterminate\|:placeholder-shown\|was-validated\|\.is-invalid\|\.is-valid" \
  node_modules/bootstrap/dist/css/bootstrap.css
```
Result: 55 matching lines (2427-3713). This confirmed the mixin-generated compound selectors documented in §Valid/§Invalid below — these exact strings (e.g. `.was-validated .form-control:valid, .form-control.is-valid`) do **not** appear literally in `_validation.scss` (which only calls `@include form-validation-state($state, $data...)` in a loop); they are assembled by `form-validation-state-selector()` in `mixins/_forms.scss` and only become literal text in the compiled output. This is exactly the "mixin-generated selectors only visible in compiled CSS" case called out in the skill's Two-source rule.

---

## Hover

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Hover | `:hover` | Native browser pseudo-class | Color/background/border-color transition per component |

Applies to:
- **Button** (`.btn:hover`) → `color: var(--bs-btn-hover-color); background-color: var(--bs-btn-hover-bg); border-color: var(--bs-btn-hover-border-color);`. Suppressed when preceded by `.btn-check` (`.btn-check + .btn:hover` resets to resting-state colors — hover styling is intentionally disabled on the visible label of a checkbox/radio-styled button group).
- **Nav Link** (`.nav-link:hover, .nav-link:focus` — hover and focus share one rule) → `color: var(--bs-nav-link-hover-color)`.
- **Nav Tabs link** (`.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus`) → `isolation: isolate; border-color: var(--bs-nav-tabs-link-hover-border-color)`.
- **Nav Underline link** (`.nav-underline .nav-link:hover, .nav-underline .nav-link:focus`) → `border-bottom-color: currentcolor`.
- **Form Control file button** (`.form-control:hover:not(:disabled):not([readonly])::file-selector-button`) → `background-color: $form-file-button-hover-bg`.
- **Dropdown Item** (`.dropdown-item:hover, .dropdown-item:focus` — hover and focus share one rule) → `color: var(--bs-dropdown-link-hover-color); background-color: var(--bs-dropdown-link-hover-bg)`.
- **List Group Item Action** (`.list-group-item-action:not(.active):hover, :focus` — hover and focus share one rule) → `z-index:1; color: var(--bs-list-group-action-hover-color); background-color: var(--bs-list-group-action-hover-bg)`.
- **Pagination page-link** (`.page-link:hover`) → `z-index:2; color: var(--bs-pagination-hover-color); background-color: var(--bs-pagination-hover-bg); border-color: var(--bs-pagination-hover-border-color)`.
- **Accordion Button** (`.accordion-button:hover`) → `z-index: 2` only (no color change on hover; color change is reserved for the expanded/`:not(.collapsed)` state).

---

## Focus

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Focus | `:focus` | Native pseudo-class | Border/background/box-shadow change, varies by component |
| Focus-visible | `:focus-visible` | Native pseudo-class (keyboard-only in most browsers) | Same as focus, but scoped to keyboard focus for interactive controls that also handle `:active` |
| Focus ring helper | `.focus-ring:focus` | Utility class + `:focus` | `box-shadow` ring using `--bs-focus-ring-*` tokens (see tokens.md §8) |

Applies to:
- **Button** uses `:focus-visible` (not `:focus`) for its focus treatment: `.btn:focus-visible` → hover-color/hover-bg + `box-shadow: var(--bs-btn-box-shadow), var(--bs-btn-focus-box-shadow)`. When wrapped by `.btn-check`, focus is driven by `.btn-check:focus-visible + .btn` instead (radio/checkbox proxy pattern).
- **Nav Link** (`.nav-link:focus-visible`) → `outline:0; box-shadow: $nav-link-focus-box-shadow` (`0 0 0 .25rem rgba(primary, .25)`).
- **Form Control** (`.form-control:focus`) → `color, background-color, border-color` change + `box-shadow: $input-box-shadow, $input-focus-box-shadow`.
- **Form Select** (`.form-select:focus`) → `border-color` change + `box-shadow`. Also a Firefox-only reset: `.form-select:-moz-focusring { color: transparent; text-shadow: 0 0 0 $form-select-color; }`.
- **Form Range** (`.form-range:focus`) → pseudo-element-specific: `&::-webkit-slider-thumb { box-shadow }` / `&::-moz-range-thumb { box-shadow }` (cannot share one rule across vendor-prefixed pseudo-elements).
- **Form Check Input** (`.form-check-input:focus`) → `border-color: $form-check-input-focus-border; box-shadow: $form-check-input-focus-box-shadow`. Form Switch additionally swaps `--bs-form-switch-bg` to a focus-specific thumb SVG on `:focus`.
- **Dropdown Item** shares the hover rule (`:hover, :focus` combined selector — see Hover).
- **Accordion Button** (`.accordion-button:focus`) → `z-index:3; outline:0; box-shadow: var(--bs-accordion-btn-focus-box-shadow)`.
- **Pagination page-link** (`.page-link:focus`) → `z-index:3; color; background-color; box-shadow` (outline explicitly zeroed via `$pagination-focus-outline: 0`).
- **List Group Item Action** shares the hover rule (`:hover, :focus` combined selector).
- **`.focus-ring:focus`** (`helpers/_focus-ring.scss`) — generic utility, not tied to a specific component: `outline:0; box-shadow: var(--bs-focus-ring-x,0) var(--bs-focus-ring-y,0) var(--bs-focus-ring-blur,0) var(--bs-focus-ring-width) var(--bs-focus-ring-color)`.

---

## Active / Pressed

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Active/pressed (native) | `:active` | Native pseudo-class | Momentary pressed-state styling |
| Active (persistent, JS-toggled) | `.active` class | Added/removed by Bootstrap JS or manually for the "currently selected" item | Persistent selected-state styling (nav-tabs current tab, list-group current item, pagination current page) |

Applies to:
- **Button** — active is a compound OR-selector covering both the native pressed state and the toggled/checked state: `.btn-check:checked + .btn, :not(.btn-check) + .btn:active, .btn:first-child:active, .btn.active, .btn.show` → `color: var(--bs-btn-active-color); background-color: var(--bs-btn-active-bg); border-color: var(--bs-btn-active-border-color); box-shadow: var(--bs-btn-active-shadow)`. A further compound selector layers focus-visible on top of active: `.btn-check:checked + .btn:focus-visible, ...`. A third, narrower rule (`.btn-check:checked:focus-visible + .btn`) covers the case where keyboard focus lands on the *hidden* checkbox/radio proxy itself while it is checked — same focus box-shadow outcome, just a different selector path than the `+ .btn:focus-visible` rule above.
- **Button Group active-button stacking** (`.btn-group > .btn-check:checked + .btn, .btn-group > .btn-check:focus + .btn, .btn-group > .btn:hover, .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active` and the `.btn-group-vertical` equivalents) → `z-index: 1` (or higher for focus), so the visually "on top" button in an overlapping button group border isn't clipped by its siblings. Presentation plumbing, not a new state concept — layers on top of the Button rules above wherever grouped buttons overlap borders.
- **Form Check Input** (`.form-check-input:active`) → `filter: $form-check-input-active-filter` (`brightness(90%)`) — momentary press feedback distinct from `:checked`.
- **Form Range thumb** (`::-webkit-slider-thumb:active` / `::-moz-range-thumb:active`) → `background-color: $form-range-thumb-active-bg` (tinted).
- **Nav Tabs / Nav Pills / Nav Underline** use `.active` (JS/manual), not `:active` — see Selected below (same mechanism, documented separately because Bootstrap's own docs treat "active tab" as a selection concept).
- **Dropdown Item** (`.dropdown-item.active, .dropdown-item:active`) → active color/bg, combined native+class selector.
- **List Group Item** (`.list-group-item.active`) → `z-index:2; color: var(--bs-list-group-active-color); background-color: var(--bs-list-group-active-bg); border-color: var(--bs-list-group-active-border-color)`. Separately, `.list-group-item-action:not(.active):active` → active color/bg (momentary press, only when not already the persistent `.active` item).
- **Pagination page-link** (`.page-link.active, .active > .page-link`) → `z-index:3` + active color/bg/border.

---

## Disabled

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Disabled | `:disabled`, `[disabled]`, `.disabled` | Native attribute, native pseudo-class, or manually-applied class (for non-form elements like `<a>` that have no native disabled state) | Dimmed color/opacity, `pointer-events: none` |

Applies to:
- **Button** (`.btn:disabled, .btn.disabled, fieldset:disabled .btn`) → disabled color/bg/border + `opacity: var(--bs-btn-disabled-opacity)` (`.65`) + `pointer-events: none`. Fieldset-disabled inheritance is explicit (`fieldset:disabled &`).
- **Button Check proxy** (`.btn-check:disabled + .btn, .btn-check[disabled] + .btn`) → `pointer-events:none; filter:none; opacity: $form-check-btn-check-disabled-opacity`.
- **Nav Link** (`.nav-link.disabled, .nav-link:disabled`) → `color: var(--bs-nav-link-disabled-color); pointer-events:none; cursor:default`.
- **Form Control** (`.form-control:disabled`) → `color, background-color, border-color` swapped to disabled tokens, `opacity:1` (explicit iOS-readability override).
- **Form Select** (`.form-select:disabled`) → same pattern.
- **Form Check Input** (`.form-check-input:disabled`) → `pointer-events:none; filter:none; opacity: $form-check-input-disabled-opacity`. Sibling label dimming uses the attribute form too: `.form-check-input[disabled], .form-check-input:disabled ~ .form-check-label` → `cursor:default; opacity: $form-check-label-disabled-opacity`.
- **Form Range** (`.form-range:disabled`) → `pointer-events:none`, thumb background swapped via nested pseudo-element selectors.
- **Dropdown Item** (`.dropdown-item.disabled, .dropdown-item:disabled`) → disabled color, `pointer-events:none`, transparent bg.
- **List Group Item** (`.list-group-item.disabled, .list-group-item:disabled`) → disabled color/bg, `pointer-events:none`.
- **Pagination page-item** (`.page-link.disabled, .disabled > .page-link`) → disabled color/bg/border, `pointer-events:none`.
- **Form Control `[readonly]`** is a related-but-distinct attribute — see Read-only below; disabled and readonly are not interchangeable in Bootstrap's CSS.

---

## Checked

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Checked | `:checked` | Native pseudo-class (checkbox/radio inputs) | Background color + background-image (check glyph / dot / switch thumb position) swap |

Applies to:
- **Form Check Input** (`.form-check-input:checked`) → `background-color: $form-check-input-checked-bg-color; border-color: $form-check-input-checked-border-color`, plus type-specific icon: `&[type="checkbox"]` sets `--bs-form-check-bg-image` to a checkmark SVG, `&[type="radio"]` sets it to a filled-circle SVG (both optionally layered with `var(--bs-gradient)` when `$enable-gradients`).
- **Form Switch Input** (`.form-switch .form-check-input:checked`) → `background-position: $form-switch-checked-bg-position` (`right center`) + `--bs-form-switch-bg` swapped to the checked-state thumb SVG.
- **Button Check proxy** (`.btn-check:checked + .btn`) → drives the Button component's Active state (see Active/Pressed above) — `:checked` on the hidden native input, not on `.btn` itself.

Compiled-CSS confirmation (from the states.md grep command): `.form-check-input:checked`, `.form-check-input:checked[type=checkbox]`, `.form-check-input:checked[type=radio]`, `.form-switch .form-check-input:checked`, `[data-bs-theme=dark] .form-switch .form-check-input:not(:checked):not(:focus)` (dark-mode unchecked/unfocused override), `.btn-check:checked + .btn`.

---

## Selected

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Selected (persistent) | `.active` | JS-toggled (Bootstrap's Tab/Collapse JS) or manually applied in static markup | Marks the current tab / current list item / current dropdown item |

Applies to:
- **Nav Tabs** (`.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link`) → active color/bg/border (the `.show` variant covers a dropdown-containing nav-item whose menu is open).
- **Nav Pills** (`.nav-pills .nav-link.active, .nav-pills .show > .nav-link`) → active color + gradient-aware background.
- **Nav Underline** (`.nav-underline .nav-link.active, .nav-underline .show > .nav-link`) → `font-weight:700; color: var(--bs-nav-underline-link-active-color); border-bottom-color: currentcolor`.
- **Tab Content pane** (`.tab-content > .tab-pane` hidden by default, `.tab-content > .active` shown) → `display:none` / `display:block` — this is how the tab panel itself is shown/hidden, distinct from the `.nav-link.active` tab-trigger styling.
- **Dropdown Item** (`.dropdown-item.active, .dropdown-item:active`) — see Active/Pressed (same selector serves both concepts for dropdown items).
- **List Group Item** (`.list-group-item.active`) — see Active/Pressed.
- **Pagination** (`.page-link.active, .active > .page-link`) — see Active/Pressed.

---

## Expanded / Open

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Expanded/Open | `.show` | Added by Bootstrap JS when a Dropdown/Collapse/Modal/Offcanvas/Toast/Tab is opened | Makes the previously `display:none` (or `opacity:0`) element visible |

Applies to:
- **Dropdown Menu** (`.dropdown-menu.show`) → `display: block` (base rule is `display: none`, defined inline on `.dropdown-menu` itself).
- **Fade-transition components generally** (`_transitions.scss`, `.fade`) → `.fade:not(.show) { opacity: 0; }`, so `.show` is what makes a faded element reach `opacity: 1`. Used by Modal, Offcanvas, Toast, Alert (dismiss fade-out), Carousel.
- **Modal** (`.modal.show .modal-dialog`) → `transform: $modal-show-transform` (`none`, cancels the slide-down entrance transform).
- **Collapse** (`.collapse:not(.show) { display:none; }`) → so `.show` reveals a `.collapse`-classed element (Accordion body wrapper `.accordion-collapse`, Navbar-collapse, generic `.collapse` component).
- **Nav-item with open dropdown** (`.nav-item.show .nav-link` / `.show > .nav-link`) — see Selected (shares styling with `.active` for the trigger link).

---

## Collapsed

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Collapsed | `.collapse` (resting/hidden), `.collapsing` (mid-transition) | `.collapse` is the static class always present on a collapsible element; `.collapsing` is added by JS only during the open/close animation; `.show` (see Expanded/Open) marks the open end-state | `display:none` when collapsed-and-not-showing; animated `height`/`width` transition while `.collapsing` |
| Accordion-specific collapsed marker | `.collapsed` on `.accordion-button` (note: no leading dot-class-name overlap with `.collapse` — different class, applied to the *trigger*, not the panel) | JS-toggled on the button by the Accordion/Collapse plugin | Controls the chevron icon rotation and active-color styling via `:not(.collapsed)` |

Source (`_transitions.scss`): `.collapse:not(.show) { display: none; }` and `.collapsing { height:0; overflow:hidden; transition: $transition-collapse; &.collapse-horizontal { width:0; height:auto; transition: $transition-collapse-width; } }`.

Applies to:
- **Accordion Button** (`.accordion-button:not(.collapsed)`) → active color/bg + `box-shadow: inset ...` (border overlap trick) + swaps `::after` background-image to the active/rotated chevron icon (`--bs-accordion-btn-active-icon`, `transform: var(--bs-accordion-btn-icon-transform)`). The **absence** of `.collapsed` means "currently expanded" — Bootstrap's Accordion JS adds `.collapsed` to the button when its panel is closed, so the default/unannotated state in markup is actually "expanded" unless `.collapsed` is explicitly present.
- **Accordion Item corner radius** (`.accordion-item:last-of-type > .accordion-header .accordion-button.collapsed`) → only the last item gets a bottom border-radius on its button while collapsed (open state's button stays square against its now-visible body).
- **Navbar Toggler / generic `.collapse` targets** — same `.collapse`/`.collapsing`/`.show` triad from `_transitions.scss` (Navbar itself has no bespoke collapse CSS beyond consuming this shared triad on `.navbar-collapse`).

---

## Valid

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Valid (declarative) | `.was-validated :valid` | Ancestor form has `.was-validated` class (added by Bootstrap's opt-in JS validation snippet or manually) + the input itself matches native `:valid` | Feedback text/tooltip shown, border/icon/focus-shadow swapped to success color |
| Valid (explicit) | `.is-valid` | Applied directly to the control (server-side / manual validation, no `.was-validated` ancestor needed) | Same visual effect as above |

**Mixin-generated compound selectors** (from `mixins/_forms.scss` `form-validation-state-selector()`, confirmed present in compiled CSS at the line numbers below — not literal strings in `_validation.scss`, which only invokes the mixin in a loop):

| Compiled CSS selector | Line | Effect |
|---|---|---|
| `.was-validated :valid ~ .valid-feedback, .was-validated :valid ~ .valid-tooltip, .is-valid ~ .valid-feedback, .is-valid ~ .valid-tooltip` | 2795 | Reveals the sibling feedback/tooltip text (`display:block`) |
| `.was-validated .form-control:valid, .form-control.is-valid` | 2802 | `border-color: $color` (success) + validation-icon background-image (if `$enable-validation-icons`) |
| `.was-validated .form-control:valid:focus, .form-control.is-valid:focus` | 2810 | Adds success-tinted focus box-shadow |
| `.was-validated textarea.form-control:valid, textarea.form-control.is-valid` | 2815 | Icon repositioned for multi-line control |
| `.was-validated .form-select:valid, .form-select.is-valid` | 2820 | `border-color` success |
| `.was-validated .form-select:valid:not([multiple]):not([size]), ... .form-select.is-valid:not([multiple])[size="1"]` | 2823 | Sets `--bs-form-select-bg-icon` to the success SVG, layered behind the arrow icon (single-select only — `[multiple]`/`[size]` selects don't get the icon) |
| `.was-validated .form-select:valid:focus, .form-select.is-valid:focus` | 2829 | Success-tinted focus box-shadow |
| `.was-validated .form-control-color:valid, .form-control-color.is-valid` | 2834 | Width adjustment to accommodate icon |
| `.was-validated .form-check-input:valid, .form-check-input.is-valid` | 2838 | `border-color` success |
| `.was-validated .form-check-input:valid:checked, .form-check-input.is-valid:checked` | 2841 | `background-color: $color` (success) — overrides the normal checked-state background |
| `.was-validated .form-check-input:valid:focus, .form-check-input.is-valid:focus` | 2844 | Success-tinted focus box-shadow |
| `.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label` | 2847 | Label text tinted success color |
| `.was-validated .input-group > .form-control:not(:focus):valid, .input-group > .form-control:not(:focus).is-valid` (+ form-select/form-floating variants) | 2855-2859 | `z-index:3` so the valid border isn't clipped by an adjacent input-group sibling |

Root tokens driving the color: `--bs-form-valid-color`, `--bs-form-valid-border-color` (tokens.md §9).

---

## Invalid

Structurally identical to Valid (same mixin, `$state: "invalid"`), using `--bs-form-invalid-color` / `--bs-form-invalid-border-color` and danger-red icon SVGs instead. Compiled-CSS confirmation (lines 2885-2949, same file):

| Compiled CSS selector | Line |
|---|---|
| `.was-validated :invalid ~ .invalid-feedback, .was-validated :invalid ~ .invalid-tooltip, .is-invalid ~ .invalid-feedback, .is-invalid ~ .invalid-tooltip` | 2885 |
| `.was-validated .form-control:invalid, .form-control.is-invalid` | 2892 |
| `.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus` | 2900 |
| `.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid` | 2905 |
| `.was-validated .form-select:invalid, .form-select.is-invalid` | 2910 |
| `.was-validated .form-select:invalid:not([multiple]):not([size]), ... .form-select.is-invalid:not([multiple])[size="1"]` | 2913 |
| `.was-validated .form-select:invalid:focus, .form-select.is-invalid:focus` | 2919 |
| `.was-validated .form-control-color:invalid, .form-control-color.is-invalid` | 2924 |
| `.was-validated .form-check-input:invalid, .form-check-input.is-invalid` | 2928 |
| `.was-validated .form-check-input:invalid:checked, .form-check-input.is-invalid:checked` | 2931 |
| `.was-validated .form-check-input:invalid:focus, .form-check-input.is-invalid:focus` | 2934 |
| `.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label` | 2937 |
| `.was-validated .input-group > .form-control:not(:focus):invalid, .input-group > .form-control:not(:focus).is-invalid` (+ variants) | 2945-2949 |

Note on precedence: both Valid and Invalid states target the exact same elements (`.form-control`, `.form-select`, `.form-check-input`, etc.) with the exact same specificity pattern — a control cannot be both `:valid` and `:invalid` simultaneously (native HTML constraint validity is exclusive), and `.is-valid`/`.is-invalid` are mutually the consumer's responsibility to not co-apply.

---

## Read-only

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Read-only | `[readonly]` | Native HTML attribute | Only affects cursor/interaction on specific sub-features — **not** a general visual dimming like Disabled |

Applies to:
- **Form Control file input** — `&[type="file"] { &:not(:disabled):not([readonly]) { cursor: pointer; } }` — readonly (like disabled) suppresses the pointer cursor on file inputs.
- **Form Control file-selector-button hover** — `.form-control:hover:not(:disabled):not([readonly])::file-selector-button` — readonly suppresses the hover-darken effect on the file button.
- **Form Control Color swatch** — `.form-control-color:not(:disabled):not([readonly]) { cursor: pointer; }` — same pattern.
- **Input Group validation z-index rules** reference `:not(:focus-within)` on `.form-floating` alongside readonly-adjacent logic, but `[readonly]` itself is not part of the validation selector set.

Unlike Disabled, `[readonly]` on a plain `.form-control` (text input) produces **no dedicated Bootstrap CSS rule** beyond `.form-control-plaintext` (a *different*, opt-in class a consumer applies manually to a readonly input to make it look like static text — Bootstrap does not auto-apply `.form-control-plaintext` styling merely because `[readonly]` is present). Do not assume `[readonly]` dims a text input the way `:disabled` does — verified by the absence of a `.form-control[readonly]` rule in `forms/_form-control.scss` outside the two `:not([readonly])` guards above.

---

## Indeterminate

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Indeterminate | `:indeterminate` | Native pseudo-class, only reachable via JS (`el.indeterminate = true`) — no HTML attribute sets it | Dash-glyph background image + active-state background/border color |

Applies to:
- **Form Check Input, checkbox only** (`.form-check-input[type="checkbox"]:indeterminate`) → `background-color: $form-check-input-indeterminate-bg-color; border-color: $form-check-input-indeterminate-border-color; --bs-form-check-bg-image:` set to a horizontal-dash SVG (optionally gradient-layered). Radio inputs have no indeterminate treatment (native `:indeterminate` doesn't apply meaningfully to radios in the same way).

Compiled-CSS confirmation: `.form-check-input[type=checkbox]:indeterminate` at line 2437.

---

## Placeholder shown

| State | Bootstrap selector(s) | How applied | Visual effect |
|---|---|---|---|
| Placeholder shown | `:placeholder-shown` (used in the negated form `:not(:placeholder-shown)`) | Native pseudo-class — true when the control's placeholder is currently visible (i.e., value is empty) | Drives the Floating Labels animation |

This state is **not defined in any of the 13 SCSS files the skill lists for states.md** — it lives in `forms/_floating-labels.scss` (not in the required-read list), but was surfaced by the compiled-CSS grep command as required by the skill, so it's documented here rather than silently dropped:

- `.form-floating > .form-control:focus, .form-floating > .form-control:not(:placeholder-shown), .form-floating > .form-control-plaintext:not(:placeholder-shown)` (line 2636) → triggers the "label floats up" layout (padding/height adjustment).
- `.form-floating > .form-control:not(:placeholder-shown) ~ label` (line 2653) and the textarea-specific `~ label::after` (line 2662) → transforms the `<label>` to its floated (small, offset) position.

The condition is deliberately `:focus OR :not(:placeholder-shown)` — the label floats either while actively focused (even if empty) or whenever there's a value (placeholder no longer shown), and returns to resting position only when both empty and unfocused.

---

## JS State Mutations

Classes Bootstrap's JavaScript plugins add/remove at runtime (as opposed to classes a developer writes in static markup). This section is the DOM-mutation counterpart to the CSS-selector tables above.

| Class | Added by | Target element | What it reveals/selects |
|---|---|---|---|
| `.show` | Dropdown, Modal, Offcanvas, Toast, Collapse, Tab plugins | The menu/panel/dialog element itself (and, for Dropdown, the trigger's parent `.nav-item`/`.dropdown`) | Dropdown menu: `display:block`. Fade components (Modal/Offcanvas/Toast/Alert): `opacity:1`. Collapse: cancels `display:none`. |
| `.collapsing` | Collapse/Accordion plugin, transiently during open/close | The `.collapse`-classed element | Mid-transition `height`/`width` animation; removed and replaced by `.show` (opening) or removed entirely (closing) once the transition ends |
| `.collapsed` | Accordion/Collapse plugin | The **trigger** button/link (`.accordion-button`, or any element with `data-bs-toggle="collapse"`), not the panel | Marks the trigger as pointing at a currently-closed panel; drives chevron rotation via `:not(.collapsed)` |
| `.active` | Tab plugin (for `.nav-link`/`.tab-pane` pairs); otherwise typically author-managed for List Group/Pagination "current item" (Bootstrap's JS does not auto-manage list-group/pagination active state — those are commonly static or app-managed) | `.nav-link`, `.tab-pane` | Marks the current tab and its associated panel (`display:block` on the pane via `.tab-content > .active`) |
| `.fade` (present in static markup) + `.show` (JS-toggled) | Modal/Offcanvas/Toast/Alert/Collapse plugins | The component root | Two-class combination drives CSS transitions: `.fade` alone = `opacity:0` (via `:not(.show)`); `.fade.show` = `opacity:1` with a transition already wired via `@include transition($transition-fade)` |
| `.modal-open` | Modal plugin | `<body>` | Suppresses body scroll while any modal is open (no visual change to the modal itself) |
| `data-bs-popper` attribute (not a class, but a JS-set attribute) | Dropdown plugin (when Popper positioning is active) | `.dropdown-menu` | Switches from static `top:100%;left:0` fallback positioning to Popper-computed inline `style` positioning |

**Not JS-driven** (included here only to prevent a mapping author from mistakenly assuming they are): `.disabled`, `.is-valid`, `.is-invalid`, `.was-validated` are all either native-attribute-driven or explicitly author/consumer-applied (the Bootstrap validation JS snippet in the docs adds `.was-validated` on form submit, but this is opt-in example code, not part of `bootstrap.bundle.js`'s always-on behavior for the components this KB covers).
