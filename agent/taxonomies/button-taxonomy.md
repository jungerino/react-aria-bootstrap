---
title: Button Taxonomy
component: Button
iteration: 4
---

## Button

**React Aria root class:** `.react-aria-Button`
**Mapping type:** 1:1 — Button → `.btn.btn-{variant}`

React Aria renders a native `<button>` element. Bootstrap's `.btn` targets `<button>` directly. This is the cleanest possible mapping: no DOM substitution, no wrapper conflicts, no hidden-input pattern. All Bootstrap pseudo-class selectors (`:hover`, `:focus-visible`, `:active`, `:disabled`) fire naturally.

---

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|--------------------|-----------------------|--------------------------|
| Root button | `.react-aria-Button` | Button | `.btn .btn-{variant}` |
| (Pending spinner — content) | `[data-pending] > *` (rendered child) | Spinner (embeddable) | `.spinner-border.spinner-border-sm` |

**Note on pending spinner:** When `isPending` is true, React Aria adds `[data-pending]` to the button and the application renders a spinner child (e.g. a `<span>` with a spinner). Bootstrap's canonical pattern is `.spinner-border-sm` inside a disabled `.btn`. This is a content-driven state (M010), not a structural sub-part — the spinner element is application-provided, not part of React Aria's output. It is documented here for completeness.

---

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Color variant | None (no built-in prop) | `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-light`, `.btn-dark` | Bootstrap | 8 solid variants; exposed via className passthrough or a `variant` prop |
| Outline variant | None | `.btn-outline-{variant}` (8 variants) | Bootstrap | Visual alternative to solid; same 8 color names |
| Link style | None | `.btn-link` | Bootstrap | Renders visually as a hyperlink but retains button semantics |
| Size | None | `.btn-sm`, `.btn-lg` | Bootstrap | Two explicit sizes; default (md) is the base |
| Block/full-width | None | `d-grid` wrapper + `w-100` | Bootstrap | Not a class on the button itself — requires a `div.d-grid` parent |
| Active/toggle | `ToggleButton` (separate component) | `.btn.active` or `.btn-check` + `<label>` | Bootstrap | React Aria's `ToggleButton` maps to the toggle pattern; out of scope for `Button` |
| Pending | `isPending` prop | No Bootstrap modifier class | React Aria | Spinner child + disabled interaction; bridge via `[data-pending]` compound selector |

**Variant exposure decision needed:** Bootstrap offers `.btn-{variant}` and `.btn-outline-{variant}` with no React Aria prop equivalent. See D1.

**Size exposure decision needed:** Bootstrap offers `.btn-sm` / `.btn-lg`. See D2.

---

### State mappings

#### Root button (`.react-aria-Button` → `<button>`)

| `data-*` attribute | Bootstrap equivalent selector | Bridge strategy | Notes |
|-------------------|------------------------------|----------------|-------|
| `[data-hovered]` | `.btn:hover` | No bridge needed — CSS pseudo-class overlap | `:hover` fires independently on the `<button>` element |
| `[data-pressed]` | `.btn:first-child:active` / `:not(.btn-check) + .btn:active` | No bridge needed — `:active` pseudo fires natively | Momentary press; `:active` fires correctly on `<button>` |
| `[data-focused]` | `.btn:focus` (Bootstrap suppresses this with `outline: 0`) | No bridge needed — CSS pseudo-class overlap | Note: `:focus` is not Bootstrap's focus-ring mechanism; `:focus-visible` is |
| `[data-focus-visible]` | `.btn:focus-visible` | No bridge needed — CSS pseudo-class overlap | Bootstrap applies `box-shadow: var(--bs-btn-focus-box-shadow)` and `outline: 0` via `:focus-visible` |
| `[data-disabled]` | `.btn:disabled` | No bridge needed — React Aria sets `disabled` attribute on `<button>` | Native `:disabled` pseudo fires; React Aria also adds `[data-disabled]` for CSS targeting if needed |
| `[data-pending]` | No direct Bootstrap equivalent | Compound selector bridge | `[data-pending]` → disabled interaction; spinner child styled as `.spinner-border-sm` |

#### Pseudo-class audit (`.btn` on `<button>`)

| Pseudo-class | Status | Notes |
|-------------|--------|-------|
| `:hover` | ACTIVE | Fires on native `<button>`; Bootstrap reads `--bs-btn-hover-*` tokens |
| `:focus-visible` | ACTIVE | Fires on native `<button>`; Bootstrap sets `outline: 0` + `box-shadow: var(--bs-btn-focus-box-shadow)` |
| `:focus` | ACTIVE (suppressed) | Fires but Bootstrap sets no visual ring via `:focus` alone; `outline: 0` set globally. Focus ring is `:focus-visible` only |
| `:active` | ACTIVE | Fires on native `<button>` via `.btn:first-child:active` rule |
| `:disabled` | ACTIVE | React Aria sets `disabled` attribute on `<button>`; Bootstrap's `.btn:disabled` fires |
| `.active` (class) | INERT | React Aria never adds `.active`; not applicable for `Button` (applies to `ToggleButton`) |
| `.disabled` (class) | INERT | React Aria uses `disabled` attribute, not `.disabled` class |
| `.show` (class) | INERT | Not applicable to Button |
| `.btn-check:checked + .btn` | INERT | Toggle-button pattern requires a sibling `<input class="btn-check">` which React Aria does not render |

---

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|-------------------|--------------------|------------|
| Root button | **NONE** | `<button class="btn btn-{variant}">` | `<button>` (native `<button>`) | No conflict — React Aria Button renders a real `<button>`. All Bootstrap selectors fire correctly. |
| Pending state | **MINOR** | No Bootstrap pending pattern on `.btn` itself | `[data-pending]` attribute + aria-label change | Bridge: use `[data-pending]` to apply `pointer-events: none` + spinner child styling; `.btn:disabled` does NOT fire during pending (button is not `disabled`) |

**Note on `_reboot.scss` audit (per M018):** No element type substitution exists for Button — React Aria renders `<button>` and Bootstrap targets `<button>`. No `_reboot.scss` rules are invalidated.

**Note on `btn-check` pattern:** Bootstrap's toggle button variant uses `<input class="btn-check">` + `<label class="btn">` with the CSS sibling combinator. This pattern is entirely inapplicable to React Aria Button, which renders a native `<button>` — not an `<input>`+`<label>` pair. The `.btn-check:checked + .btn` selectors are pre-classified INERT.

---

### Reference story canvas

Stories to write, covering Bootstrap's full button appearance surface:

1. **Variants** — All 8 solid `.btn-{variant}` buttons in a flex-wrap row, labeled. Represents the primary catalog of color/semantic variants.

2. **OutlineVariants** — All 8 `.btn-outline-{variant}` buttons in a flex-wrap row, labeled.

3. **Sizes** — `.btn-lg`, default (`.btn`), `.btn-sm` side by side, using primary variant for comparison.

4. **States** — Interactive state matrix for one representative variant (`.btn-primary`): Default, Hover (`.faux-hover`), Focus (`.faux-focus`), Active (`.faux-active`), Disabled (`disabled`). Each state labeled.

5. **LinkStyle** — `.btn.btn-link` in its states: Default, Hover, Focus, Disabled.

6. **Pending** — `.btn.btn-primary` with `[data-pending]` attribute and a `.spinner-border-sm` child, showing the loading/pending appearance.

**Grid layout:** `display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center` for all stories. No fixed column count.

**Width constraints:** None — buttons are intrinsically sized by content.

**Faux-state classes needed in `presentation.scss`:**
- `.btn.faux-hover` — reads `--bs-btn-hover-color`, `--bs-btn-hover-bg`, `--bs-btn-hover-border-color`
- `.btn.faux-focus` — reads same hover tokens + `box-shadow: var(--bs-btn-focus-box-shadow)` + `outline: 0`
- `.btn.faux-active` — reads `--bs-btn-active-color`, `--bs-btn-active-bg`, `--bs-btn-active-border-color`

Per P-001 and P-016: `.faux-focus` must include `outline: 0` (Bootstrap suppresses it) and `box-shadow` so it is visually distinct from `.faux-hover` (both share hover token values per Bootstrap's `:focus-visible` rule, but the box-shadow separates them). Verify P-016 before emitting `REFERENCE-STORY-READY-FOR-REVIEW`.

**Bootstrap docs source:** `https://getbootstrap.com/docs/5.3/components/buttons/`

---

### Confidence

**High.** Button is the simplest possible Bootstrap↔React Aria mapping: 1:1, native element, no DOM substitution, no hidden-input pattern, no compound selector conflicts. All Bootstrap pseudo-classes fire as expected. The only non-trivial element is the `[data-pending]` state, which requires a content-driven bridge (spinner child).

---

## Decisions

### D1 — Bootstrap variant exposure as prop vs. className passthrough

**Question:** Bootstrap's `.btn-{variant}` and `.btn-outline-{variant}` modifier classes have no React Aria prop equivalent. When implementing the Bootstrap Button, should these be exposed as an explicit `variant` prop (e.g. `variant="primary"`, `variant="outline-secondary"`), left as a pure `className` passthrough (consumer writes `className="btn btn-primary"`), or some combination?

**Answer:** Combination — expose an explicit `variant` prop for common cases; provide `className` passthrough for anything the prop does not cover.

### D2 — Size modifier exposure as prop vs. className passthrough

**Question:** Bootstrap's `.btn-sm` and `.btn-lg` size modifiers have no React Aria prop equivalent. Should these be exposed as an explicit `size` prop (e.g. `size="sm"`, `size="lg"`), left as a `className` passthrough, or omitted from scope?

**Answer:** Explicit typed size prop: `size="sm" | "lg"`.
