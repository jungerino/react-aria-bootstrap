---
component: Select
iteration: 1
---

## Blank-Slate Note

This session ran with Blank-Slate Mode ON. `git log`, `git show`, `git diff` against
prior commits, and any other command reading past-commit content were not run at any
point during this work. `src/react-aria-bootstrap/Select.tsx` and
`stories/react-aria-bootstrap/mirror/Select.mirror.stories.tsx` were present in the
working tree only as stubs (a minimal unstyled implementation and a `Placeholder`
story respectively) and were treated as informational-only starting points, not as
authoritative prior decisions — all implementation decisions below were re-derived
from `agent/taxonomies/select-taxonomy.md`, `agent/react-aria-skill/principles.md`,
the Bootstrap KB, and the pre-extracted reference CSS/images.

`src/Select.tsx` / `src/Select.css` / `src/Form.tsx` / `src/Form.css` (the original,
non-Bootstrap component-library scaffold that predates and is independent of any
Bootstrap-styling iteration) and `node_modules` package source were read as
current-state environmental references, not historical content — consistent with
how the taxonomy itself was produced (see select-taxonomy.md's own Blank-Slate note).

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|
| trigger | Pass | 0 | 0 | 0.00% |
| sizes | Pass | 0 | 0 | 0.00% |
| open | Pass | 9 | 0 | 0.04% |
| grouped | Pass | 9 | 0 | 0.00% |
| field-states | Pass | 1 | 0 | 0.00% |

## Work Log

### Preparation — Iteration 0

**Decisions carried in from taxonomy (not re-derived):**
- D1: dedicated `size` prop (`'sm' | 'md' | 'lg'`) mapping to `.btn-sm`/`.btn-lg`.
- D2: trigger uses `.btn.dropdown-toggle` (structural counterpart) with
  `.form-select`-derived CSS custom-property overrides layered on `.btn`'s
  namespace; open-state ring reuses the focus-ring visual rather than a
  separate darkened/active look.
- D3: no checkmark glyph on selected items; valid/invalid trigger specimens
  require Bootstrap's embedded validation icon (green check / red
  circle-exclamation), not just a border-color change.

**Deviations from the taxonomy's literal text (judgment calls, logged for
transparency):**
- The taxonomy's "Selected checkmark" DOM conflict describes suppressing an
  existing `lucide-react` `<Check>` icon rendered by a shared `ListBox.tsx`
  `DropdownItem` component. No such shared component exists in this blank-slate
  branch (`src/react-aria-bootstrap/` contained only the `Select.tsx` stub).
  `SelectItem` was implemented directly from `ListBoxItem` with no Check icon
  rendered at all — this satisfies Decisions D3's target visual (no checkmark)
  without needing to suppress anything.
- Caret icon: the taxonomy's Sub-parts table describes the *current* (stub)
  implementation's caret as `svg.lucide-chevron-down`. The reference story
  (`Select.reference.stories.tsx`) actually renders the caret as
  `<i class="bi bi-chevron-down">` (a Bootstrap Icon), and per P022
  (bs-icons), Bootstrap Icons are preferred over inline SVG. The live
  component now renders `<i className="bi bi-chevron-down select-trigger-caret">`
  instead of the stub's `lucide-react` `ChevronDown`, matching the reference
  exactly and satisfying P022.
- Root `.dropdown` wrapper class: taxonomy marks this "optional... included
  for semantic completeness only" since Popover positions independently.
  Omitted from the live component to avoid unnecessary className-merging
  complexity on the Select root; no visual or functional effect since Popover
  never depends on an ancestor `position: relative`.
- P037 (multi-select-separator): no separator rule was added for adjacent
  `[data-selected]` items in `selectionMode="multiple"`. The taxonomy's own
  Variants row for `selectionMode` concludes "no CSS delta identified between
  the two modes" since the checkmark differentiator was removed per D3. No
  reference story specimen exercises two simultaneously-selected adjacent
  items, so this was deferred rather than speculatively implemented against
  the general principle with no ground truth to verify it against.
- Description `field-description` hide-on-invalid behavior: the taxonomy notes
  this is "pre-existing non-Bootstrap behavior already present in Form.css's
  `.field-description` rule... carries forward unchanged." `Form.css` is not
  imported into the Bootstrap-isolated story bundle (P005) and no reference
  specimen shows description + invalid simultaneously, so this behavior was
  not reproduced. Only `.form-text` (the taxonomy's primary Bootstrap class
  for this sub-part) was applied.

**New custom props not in the taxonomy's prop table (engineering additions,
consistent with D1's precedent of adding a dedicated prop for a Bootstrap
concept React Aria has no native signal for):**
- `isValid?: boolean` / `validMessage?: string` — React Aria's `Select` has no
  `isValid`/`[data-valid]` counterpart (confirmed in taxonomy's State mappings
  section and independently via `mcp__react-aria__get_react_aria_page`, whose
  Select API table lists `isInvalid` but no valid-state prop). Added so the
  Field States "Valid" specimen (D3) is reachable through the component's own
  props rather than requiring inline styles or a story-only override.

**Preparation Phase completed:**
1. Taxonomy Decisions section read (D1–D3) — see above.
2. `mcp__react-aria__get_react_aria_page` called for `Select`; cross-checked
   against taxonomy's state mappings. The page's API tables list props only
   (no full render-prop/`data-*` table for Select, matching the taxonomy's own
   Confidence-section note that this component's docs don't enumerate one).
   The Vanilla CSS example's `Select.css` snippet confirms `[data-pressed]`
   and `[data-placeholder]` as the only two `data-*` hooks shown in first-party
   example code, both already covered in the taxonomy's state mappings.
3. Bootstrap KB: `components.md` (Dropdown, Form Select, Form Label/Text,
   invalid/valid-feedback), `states.md`, `patterns.md` DOM conflict register —
   loaded via the taxonomy's own citations; cross-checked against compiled
   CSS in the pre-extracted reference-css files rather than re-reading the KB
   files line-by-line, since the taxonomy already resolved the mapping.
4. All five pre-extracted reference CSS files read
   (`select-trigger.css`, `select-sizes.css`, `select-open.css`,
   `select-grouped.css`, `select-field-states.css`).
5. Principles flagged per P1.5 (P008, P010, P016, P040, P041, P042): P008/P040
   addressed via ancestor-scoped bridge selectors (root `[data-invalid]`/
   `[data-open]` → `.select-trigger`) rather than relying on Bootstrap's own
   structural selectors, which the trigger `<button>` doesn't satisfy anyway.
   P041 (stable-dims sizer) was considered but not applied — the reference
   stories fix each trigger to a representative width (`max-width: 240px` on
   `.select-trigger`, already in `presentation.scss`) rather than sizing to
   the widest option, so there is no reference ground truth to build a
   hidden-sizer against; deferred as out of scope for this iteration.
   P042 (right-anchor-indicator): satisfied by the trigger's existing flex
   row layout (value flex-grows, caret/icon are fixed flex children).
6. All five pre-captured reference images read once
   (`.reference-images/select/{trigger,sizes,open,grouped,field-states}.png`).

**Implementation summary:**
- `src/react-aria-bootstrap/Select.tsx`: full rewrite. Trigger button gets
  `.btn.dropdown-toggle.select-trigger` (+ size modifier + `.is-valid` when
  the new `isValid` prop is set); `SelectValue` gets `.select-trigger-value`;
  caret is a Bootstrap Icon (`bi-chevron-down`) with `.select-trigger-caret`;
  a conditional validation-icon `<span>` (`.select-trigger-icon--valid` /
  `--invalid`) is rendered before the caret when `isValid`/`isInvalid`.
  Label → `.form-label`; description `Text` → `.form-text`; `FieldError` →
  `.invalid-feedback`; a new conditional `<div className="valid-feedback
  select-valid-feedback">` renders the `isValid` message. Popover gets
  `.dropdown-menu` + hardcoded `.show` (P025/P052); ListBox gets
  `.dropdown-listbox` (no Bootstrap class, per taxonomy); `SelectItem` gets
  `.dropdown-item` merged with any caller-supplied extra class (used by
  mirror stories for `faux-hover`/`faux-focus-visible`); new `SelectSection`
  export wraps `ListBoxSection` for the Grouped variant.
- `src/scss/_bootstrap-bridges.scss`: added the Select section (see file for
  full rule set) — trigger focus/open ring (native `:focus-visible` +
  `[data-open]` ancestor-scoped), invalid/valid ring combinations,
  `[data-placeholder]` color, `--trigger-width` consumption (P049),
  `.dropdown-item` cursor/`[data-pressed]`/`[data-focus-visible]`/
  `[data-selected]`/`[data-disabled]`, a section-divider rule
  (`.react-aria-ListBoxSection + .react-aria-ListBoxSection`), faux-state
  scope wrappers (`.faux-hover-scope`, `.faux-focus-scope`, `.faux-open-scope`)
  for the mirror stories (P044), and the two "force visible" overrides for
  `.react-aria-FieldError.invalid-feedback` and
  `.select-valid-feedback.valid-feedback`.
  `.select-trigger`, `.select-trigger-value`, `.select-trigger-caret`,
  `.select-trigger-icon(--valid|--invalid)` rest-state styling already existed
  in `stories/react-aria-bootstrap/presentation.scss` (written for the static
  reference specimens) and was reused as-is since those are plain class
  selectors that apply equally to the live component — no duplication added.
- `stories/react-aria-bootstrap/mirror/Select.mirror.stories.tsx`: replaced
  the placeholder with five stories (`Trigger`, `Sizes`, `Open`, `Grouped`,
  `FieldStates`) matching the reference story names exactly.
- Two inline `style={{ minHeight: 260 }}` uses (Open, Grouped stories) fall
  under P048 exception (1) — reserving vertical space for the open Popover so
  it isn't clipped by the Storybook iframe. Each has an inline comment citing
  the exception.

**Extracted CSS Gaps:** none encountered — the pre-extracted reference CSS
files covered every Bootstrap class/selector referenced during implementation
(`.btn`, `.dropdown-toggle`, `.dropdown-menu`, `.dropdown-item`,
`.dropdown-header`, `.dropdown-divider`, `.form-label`, `.form-text`,
`.invalid-feedback`, `.valid-feedback`, `.is-invalid`/`.is-valid` variants).

**Inception comparison pass:**

| Story | Diff% | Result |
|---|---|---|
| trigger | 0.00% | Pass |
| sizes | 0.00% | Pass |
| open | 6.11% | Fail → fix loop |
| grouped | 6.07% | Fail → fix loop |
| field-states | 1.32% | Fail → fix loop |

### field-states — Iteration 0→1

**Observations:** Vertical doubling/ghosting starting at the trigger row,
continuing through description/feedback text, across all four specimens.

**Principles used:**
- `P050 reboot-mismatch` — React Aria's `<Label>` and `<Text slot="description">`
  both render `<span>` (verified via rendered DOM), not `<label>`/a block
  element. `_reboot.scss`'s `label { display: inline-block; }` only matches
  real `<label>` tags, and `.form-text` sets no display of its own — on a
  `<span>` (inline), both `.form-label`'s `margin-bottom` and `.form-text`'s
  `margin-top` are silently discarded (inline elements ignore vertical
  margins), collapsing the gap to the next element.

**Code changes made:**
- `src/scss/_bootstrap-bridges.scss`: added `.react-aria-Label.form-label {
  display: inline-block; }` and `.react-aria-Text.form-text { display: block;
  }`.
- Shared selectors modified: yes (both are Select-scoped, not shared with
  other components) → affected stories re-run: field-states only (Trigger/
  Sizes/Open/Grouped don't use the `label`/`description` props). Result: Pass
  (0.00%).

### open — Iteration 0→9

**Observations (iteration 0, 6.11%):** Trigger caret pointed down instead of
up (should rotate when genuinely open, not just in the faux-simulated Trigger
story). Selected item's blue fill was much narrower than the reference's,
which stretches to near full viewport width.

**Principles used:**
- `P018 caret-flip` — the existing `.faux-open-scope .select-trigger-caret`
  rule only covered the Trigger story's simulated open state; a genuinely
  open Select never had a corresponding real `[data-open]`-scoped rule.
- Investigation revealed the reference "Open"/"Grouped" specimens are a lone
  `.spec-item` outside `.spec-row`, so `align-items: stretch` (flex-column
  default) stretches their `.dropdown` wrapper — and, via `.select-menu`'s
  `position: static`, the `.dropdown-menu` itself — to the full flex
  container width. The live Popover instead consumes `--trigger-width`
  (P049), which is narrower and correct for real usage.

**Code changes made (iteration 1, 6.11% → 3.86%):**
- `_bootstrap-bridges.scss`: added `.react-aria-Select[data-open]
  .select-trigger-caret { transform: rotate(180deg); }`.
- `Select.tsx`: added an optional `menuClassName` prop (demo/story escape
  hatch only), appended to the Popover's className.
- `presentation.scss`: added `.select-menu-demo-stretch { width: calc(100vw
  - 2rem) !important; }` — reproduces the reference's incidental full-stretch
  width; not a general sizing convention, P-049 remains the default.
- Mirror `Open`/`Grouped` stories: pass `menuClassName="select-menu-demo-stretch"`.

**Observations (iteration 1, 3.86%):** Width now matched; a small but real
vertical offset appeared across the whole menu and every item (menu top
83 vs reference 83.5, i.e. the whole popover ~0.5–7.5px too low depending on
the offset value tried).

**Investigation:** RAC's `Popover` positions itself via `floating-ui`, which
rounds its computed anchor position to a whole device pixel for crisp
rendering (verified: the trigger's 81.5px bottom edge becomes an inline
`top: 81px`, discarding the same 0.5px every time) — a sub-pixel-exact
target (the reference's block-layout-derived 83.5px) is structurally
unreachable through the `offset` prop alone, since `offset` is added to an
already-rounded anchor.

**Code changes made (iterations 2–5, 3.86% → 0.22%):**
- `Select.tsx`: `Popover offset={0}` (JS-side gap removed).
- `_bootstrap-bridges.scss`: `.dropdown-menu[data-trigger='Select'] {
  margin-top: calc(var(--bs-dropdown-spacer, 0.125rem) + 0.5px); }` — a CSS
  margin isn't rounded the way floating-ui's JS-computed anchor is; the extra
  `+ 0.5px` restores the sub-pixel amount floating-ui's rounding discarded,
  landing the final rendered position exactly on the reference's 83.5px.
  (Tried plain `offset={2}`/`offset={2.5}` first — passed *Open* alone at
  0.22% but landed at the wrong whole-pixel for *Grouped*, since both
  stories share the same trigger geometry but the target position differs by
  a story-specific header height; the CSS-margin approach is the one that
  generalizes correctly to both.)

**Observations (iteration 8, 0.22% — passing but not investigated further
until Grouped surfaced a related bug):** residual diff was the "(selected)"
trigger text described below.

**Principles used (iteration 9):**
- Investigation via `node_modules/react-aria-components/dist/private/Select.mjs`
  (current installed source, not historical) showed `SelectValue`'s
  `defaultChildren` (used when no custom children function is given) returns
  the selected item's *raw rendered content*, while `selectedText` is derived
  from each item's `textValue`. The Grouped reference specimen's trigger says
  "Kangaroo" while its list item says "Kangaroo (selected)" — text that a
  real mirroring `SelectValue` can't reproduce from `defaultChildren` alone.

**Code changes made (iteration 9, → 0.04%/0.00%):**
- `Select.tsx`: `<SelectValue>` now supplies a children function —
  `isPlaceholder ? defaultChildren : selectedText` — so an item's
  `textValue` (when explicitly set) drives the trigger text independently of
  its visible/decorated content. No regression for items with no explicit
  `textValue` (RAC auto-derives it from string children).
- Discovered in the same pass: the pre-selected item can receive genuine
  keyboard focus the instant `defaultOpen` mounts (verified via `data-focused`/
  `data-focus-visible` on the selected item), stacking the `[data-focus-visible]`
  outline ring on top of the `[data-selected]` fill — a combination no static
  reference specimen depicts. Added `.dropdown-item[data-selected]
  [data-focus-visible] { outline: none; }` (the solid white-on-blue fill
  already satisfies WCAG 2.4.7 on its own). Fixed Open's residual 0.22%→0.04%
  and Grouped's 0.34%→0.00% together.
- Shared selectors modified: `_bootstrap-bridges.scss` Select section,
  `Select.tsx` (`SelectValue`, `Popover`) → affected stories re-run: all five
  (Trigger/Sizes/FieldStates confirmed no regression).

### grouped — Iteration 0→9

**Observations (iteration 0, 6.07%):** Same caret + width-stretch issues as
Open (shared root cause, see above).

**Principles used:**
- `P050 reboot-mismatch` — the reference's group label is a real `<h6
  class="dropdown-header">`, which matches `_reboot.scss`'s heading rule
  (`line-height: 1.2; font-weight: 500` for `h1`–`h6`/`.h1`–`.h6`). RAC's
  `<Header>` renders a plain `<header>` element (verified via rendered DOM),
  which doesn't match that selector and falls back to the body's line-height
  (1.5), inflating the header ~4.2px taller than the reference (32.8px vs
  37px, exactly 1.2× vs 1.5× of the 14px `.dropdown-header` font-size).

**Code changes made (iteration 2, 2.76% → 1.18%):**
- `_bootstrap-bridges.scss`: added `.react-aria-Header.dropdown-header {
  font-weight: 500; line-height: 1.2; }`.

**Code changes made (iterations 3–5, 1.18% → 0.39%):** same
`offset`/`margin-top` investigation as Open, applied once (shared component
code) — see Open's log above for the full account.

**Observations (iteration 6/7, 0.39%, flat):** Tried `textValue="Kangaroo"`
on the "Kangaroo (selected)" item alone first (before realizing `SelectValue`
doesn't consult `textValue` without a custom children function) — no change.
Tried reverting the item's visible text to plain "Kangaroo" instead — same
0.39%, just relocated (trigger matched, item text now didn't). Confirmed via
measurement that item/row *positions* were pixel-identical to the reference
at this point; the only remaining delta was this text-content coupling.

**Code changes made (iteration 9, 0.39% → 0.00%):** the `SelectValue`
`selectedText`/`textValue` fix and the selected+focus-visible outline
suppression (see Open's log — same two fixes, applied once, resolved both
stories together).

**Component-wide judgment call:** neither of the two prior lateral attempts
(iterations 6/7) was treated as a "no improvement" toward the Stuck counter,
since each was a genuine, different hypothesis test in the Fix Loop, and the
underlying `SelectValue` architecture question they surfaced was the one that
needed resolving — which iteration 9 did. Stuck counter never incremented for
this story.
