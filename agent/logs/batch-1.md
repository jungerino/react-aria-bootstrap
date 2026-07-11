# Batch 1

## Components

- Select

## Stories

### Select

`stories/react-aria-bootstrap/reference/Select.reference.stories.tsx`

- Trigger
- Sizes
- Open
- Grouped
- Field States

## Stage 4

### batch-1/stage-4/iter-1

**Decisions needed:**

#### D1 — Size variant exposure (`.form-select-sm` / `.form-select-lg`, `.btn-sm` / `.btn-lg`)

Bootstrap's Form Select offers `.form-select-sm` and `.form-select-lg` modifier classes (reduced/increased padding, font-size, border-radius). The structural counterpart (Dropdown) has matching `.btn-sm`/`.btn-lg`. React Aria's `Select` component has no `size` prop — there is no React Aria equivalent to bridge to. Per M016 trigger pattern 1 (variant exposure), this must be flagged: should Bootstrap's size variants be exposed as (a) a new `size` prop on the `Select` component, (b) an unstyled passthrough via `className` with no dedicated prop, or (c) excluded from this iteration's scope entirely (default size only)?

**Answer:** Add a dedicated `size` prop on `Select` (`'sm' | 'md' | 'lg'`) that maps to Bootstrap's `.form-select-sm`/`.form-select-lg` classes.

#### D3 — Selected-item indicator and trigger validation icon (review feedback, round 2)

Raised during reference-story review, not pre-flagged: (1) the option-list checkmark on selected items should be removed (Bootstrap's `.dropdown-item.active` convention is background/color fill only); (2) valid/invalid trigger specimens must show Bootstrap's standard validation icons (green check / red circle-exclamation), not just a border-color change. Full question/answer recorded in `agent/taxonomies/select-taxonomy.md` Decisions D3.

**Select — Stage 4 complete.** Reference stories approved; CSS extracted for all 5 stories (Trigger, Sizes, Open, Grouped, Field States) to `agent/artifacts/reference-css/select-{trigger,sizes,open,grouped,field-states}.css`.

**Principles used:**
- M001 dom-first — matched Select's rendered DOM (button + Popover + ListBox) to the Dropdown pattern rather than `.form-select`
- M002 sub-parts — mapped every sub-part independently (Label, Trigger, SelectValue, caret, Description, FieldError, Popover, ListBox, ListBoxItem, Section/Header, hidden native select)
- M003 kb-sequence — loaded `components.md` → `patterns.md` → `states.md`, cross-referenced `tokens.md`
- M004 three-bridges — applied all three bridge strategies across the state-mapping tables
- M006 no-counterpart — applied to `SelectValue`, the ListBox empty state, and (initially) the selected checkmark
- M007 scss-verify — verified every `--bs-*` token against compiled CSS before use; ran the pseudo-class ACTIVE/INERT audit per sub-part
- M008 data-attrs — enumerated the full `data-*` surface directly from installed `react-aria-components` source, since the MCP-served docs didn't include a full render-props table
- M010 content-states — scanned Bootstrap's component catalog for a selection-indicator counterpart before concluding none exists
- M011 structural-variants — grouped options (sections) kept in scope as a same-sub-parts DOM rearrangement
- M012 custom-controls — applied to the hidden native `<select>` (out of visual scope, not styled)
- M014 dual-counterpart — core resolution for the trigger (Dropdown structural vs. Form Select semantic/visual)
- M015 variant-authority — Bootstrap's size vocabulary (sm/md/lg) adopted wholesale per D1
- M016 decisions-needed — surfaced D1 (variant exposure) and, via review, D3 (selection indicator / validation icon)
- M017 css-delta — documented the (empty) CSS delta for `selectionMode`
- M018 elem-type-sub — caret substitution (real SVG element vs. Bootstrap's `::after` pseudo-element)
- M019 m014-class-in-decisions — D2 records the trigger's class choice explicitly, including rationale
- M020 one-component-class — exactly one component class per interactive element throughout (`.btn` on the trigger, `.dropdown-menu` on the Popover, `.dropdown-item` on items)
- P-001 faux-state classes — `.faux-hover`/`.faux-focus`/`.faux-open`/`.faux-focus-visible` for both the trigger and dropdown items
- P-002 selector context — Open/Grouped stories reproduce the full `.dropdown` > `.btn` + `.dropdown-menu` > `.dropdown-item` ancestor/sibling structure
- P-003 CSS classes, not inline styles — all specimen styling lives in `presentation.scss`
- P-004 flex-wrap layout — `.spec-row` container, no fixed column count
- P-005 open-state shows a selected value — Open/Grouped triggers show "Kangaroo," matching the highlighted item
- P-006 over-inclusion — Sizes, Grouped, and Field States kept as separate stories rather than folded/omitted
- P-007 target appearances only — no unstyled/broken specimens shown
- P-008 label every specimen — every specimen carries a `.spec-label`
- P-009 states across variant families — assessed and concluded sizes are not a structurally distinct family (token-value differences only), so no separate state matrix was required per size
- P-011 extract reference CSS — this step, all 5 stories
- P-012 dual-counterpart variable overrides — `.select-trigger`'s `--bs-btn-*` overrides sourced from `.form-select`
- P-013 verify every faux-state specimen — screenshot-verified every specimen in light and dark themes, twice (initial submission and post-review revision)
- P-014 / P-015 / P-016 — dropdown-item faux-focus includes the UA outline (not suppressed by Bootstrap), keeping it visually distinct from faux-hover; verified by screenshot
- P-017 asymmetric spacing verification — resolved the size-variant `padding-x` question by checking whether the reference component renders a background-image chevron (it doesn't — real element instead)
- P-018 caret rotation via transform — `.faux-open .select-trigger-caret { transform: rotate(180deg) }`

## Stage 5

### Select
**Principles used:**
- *(e.g., `P014 data-pressed`, `P022 bs-icons`)*
