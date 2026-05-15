---
title: Review — Iteration 0
status: complete
---

# Review — Iteration 0

## Components
Button, ListBox, Select

---

## Phase 1 — Taxonomy decisions

### ListBox

**Observation 1 (user):** The `[data-focused]` specimen note in ListBoxItem says "Bootstrap has no distinct `:focus` style on `.list-group-item-action` separate from hover". This is incorrect. Bootstrap groups `:hover` and `:focus` with the same explicit styles (same bg/color via grouped selector), but `:focus` also receives the user-agent focus outline — so the two states are visually distinct (same background, different outline treatment). The specimen note and Caveat #2 ("may be visually identical — merge into one specimen") should both be corrected.

**Observation 2 (user):** The ListBoxItem `[data-focused]` specimen note includes "(note: virtual focus may mean :focus does not fire on items — see caveats)". This caveat is not relevant at the reference story stage. Bootstrap reference specimens are pure Bootstrap HTML with no React Aria — `:focus` fires naturally on any focusable element. Virtual focus is a React Aria runtime concern and belongs in styling-iteration guidance, not in the taxonomy. Remove from the specimen note and remove Caveat #1.

**Observation 3 (user):** The SelectionIndicator sub-part specifies `<i class="bi bi-check">` for single-select. This is incorrect on two counts: (1) neither React Aria's `ListBox` nor Bootstrap's `.list-group` features a checkmark by default — M013 is a prior agent invention with no Bootstrap docs source; (2) it is a poor design choice — a checkmark implies checkbox/multi-select behavior and should not be used for single-select. Bootstrap's list group indicates selection purely via `.active` class styling (background + text color change). Single-select has NO SelectionIndicator. The SelectionIndicator story covers multi-select only (`div.indicator` Checkbox pattern). M013 in the mapping table must be corrected.

---

## Phase 2 — Implementation notes

### Select

**Observation 3 (user):** Select ListBoxItem story — the "Note on `div.indicator`" proposes a "minimal visual placeholder" (generic square outline) instead of the actual Bootstrap Checkbox indicator HTML. User disagrees. The reference story should show the actual Bootstrap Checkbox indicator pattern, not a stand-in. The visual target for multi-select indicator IS the Bootstrap form-check-input pattern — use real Bootstrap HTML. Remove the placeholder rationale; use actual Checkbox indicator markup.

**Observation 2 (user):** Trigger story Group B ("Baseline — unstyled dropdown-toggle") shows `.btn.dropdown-toggle` with no form-select overrides. User questions the value: this depicts a failure case (incorrectly styled output), not a Bootstrap reference. Reference stories should show target appearances, not implementation starting points. Decision: remove Group B. The design challenge is documented in the mapping table; it doesn't need illustration in the reference story.

**Observation 1 (user):** The taxonomy omits Label, Description, and FieldError with the note "same as TextField; omit — covered there." Two problems: (1) TextField is not in this iteration's component set and has no scheduled coverage date — "covered there" is not valid justification; (2) the assumption that Description and FieldError receive identical styling across components needs to be verified, not assumed.

**Decision:** Include Label, Description, and FieldError in the Select reference story. Sharing a Bootstrap class with another component is not grounds for omission — compound selectors in the implementation could style `.react-aria-Select .invalid-feedback` differently than `.react-aria-TextField .invalid-feedback`. Err on the side of over-inclusion. "Covered in another component's story" is never valid justification for omitting a sub-part.

### Button

**Observation 1 (user):** The taxonomy proposes interactive labels instructing the user to hover/focus to see pseudo-class states. This is insufficient — reference stories should support screenshot-based visual comparison where states must be statically rendered. Proposed fix: define `.faux-hover` and `.faux-focus` utility classes in `augments.scss` that apply Bootstrap's pseudo-class styles as static class-based rules. Decision: adopt faux classes. See implementation notes below for specificity approach.

### Agent implementation notes (Phase 2)

**File locations:** Story files created in `stories/bootstrap-test/bootstrap-reference/` (new subdirectory). Augments in `stories/bootstrap-test/bootstrap-reference/augments.scss`. Existing `stories/bootstrap-test/Button.reference.stories.tsx` etc. are old stubs at a different title path (`Bootstrap Reference/Button`) and coexist without conflict.

**Faux state class approach:** Defined `.btn.faux-hover/focus/focus-visible/active`, `.list-group-item.list-group-item-action.faux-hover/focus/focus-visible/active`, `.dropdown-item.faux-hover/focus/focus-visible/active`, and `.list-group.faux-focus` in `augments.scss`. All scoped to component class to match Bootstrap specificity (no `!important` needed).

**Multi-select indicator:** Used `<input class="form-check-input m-0 me-2 flex-shrink-0" type="checkbox">` inline within `d-flex align-items-center` list items and dropdown items. This is the direct Bootstrap checkbox pattern without a `div.indicator` wrapper — cleaner for reference markup.

**ListBox grid layout (M017):** Added `.list-group-grid` (3-column grid) and `.list-group-grid-row` (3-column, row-flow) utility classes to `augments.scss`. Used as class names on the `.list-group` container.

**`btn-outline-light` visibility:** Wrapped in `data-bs-theme="dark"` div with dark background so the outline is visible on the canvas.

**Select Trigger:** Group A shows only the native `.form-select` states (default, valid, invalid, disabled) and Group B shows sizes — no "unstyled dropdown-toggle baseline" per P-T002.

**Select Popover:** Rendered with `position: static; display: block` inline styles so the menu renders in the document flow without Popper.js.

**Select FormSupport FieldError:** Uses `style={{ display: 'block' }}` inline to force visibility (Bootstrap hides `.invalid-feedback` by default).

**Section + Header:** Used `<div class="dropdown-header">` as the section header within `.list-group`. The `.dropdown-header` CSS variables have `:root`-level defaults so they render correctly outside a `.dropdown-menu` context.

**ListBox selectionMode="none" specimens:** Identical markup to selectionMode="single" default — no indicator, no left indent. Hover faux class applied to second specimen to verify no ghost indent from absent indicator.

**Story title conflict check:** Old flat-path stories (`Bootstrap Reference/Button`, `Bootstrap Reference/ListBox`, `Bootstrap Reference/Select`) coexist with new sub-part stories (`Bootstrap Reference/Button/Root` etc.) — different title paths, no collision.

---

## User review

### Session 2 — Workflow retrospective (2026-05-14)

**User:** Overall, this is an encouraging outcome. My feedback on the specimens is minimal. They mostly look right. I have a few specific details to discuss. But first I am trying to think through how this stage of the workflow should relate to the next stages. Questions and ideas I am considering:
- To what extent, if any, did the mapping table (`agent/mapping-table.md`) contribute to this outcome?
  - Was the mapping table a necessary precursor to the taxonomies?
  - Or could the taxonomies and reference specimens replace much or all of the mapping table exercise?
- To me, the reference stories are a much more intelligible artifact than the mapping table. How about you?
- Please compare the combined context/signal provided by the taxonomies and reference stories with the context/signal of the `agent/mapping-table.md`.
  - Which would serve you better in styling the actual react-aria components?
  - What information from the mapping table is missing from the taxonomies and reference stories?

**Agent:** Good questions for a workflow retrospective. Here's my honest read after reviewing both artifacts.

**Intelligibility:** You're right — the reference stories are far more intelligible. The mapping table is a dense analytical document: it reasons from documentation about what things *should* look like. The reference stories *show* what Bootstrap actually renders. For visual styling work, that difference is significant. The bug we caught (items needing a `.list-group` parent to inherit token values) is a perfect example: no amount of documentation analysis would have surfaced it — only rendering did.

**What the mapping table uniquely provides:** After reading both carefully, the mapping table has three things the taxonomy + stories don't:

1. **Token inventory** — explicit `--bs-*` custom property tables per sub-part. The stories show *appearances*; they don't name the CSS custom properties responsible. When writing `[data-selected]` bridge CSS, knowing to set `--bs-list-group-active-bg` rather than `background-color` is the mapping table's direct contribution.

2. **Bridge strategy classification** — the "no bridge needed / compound selector bridge" distinction per state is explicit and actionable. The stories show target appearances; they're silent on *how* to achieve them from the React Aria side.

3. **DOM conflict analysis** — MINOR/MAJOR/CRITICAL conflict rows with resolution paths. The reference stories render Bootstrap HTML; they don't document the mismatch with React Aria's actual DOM output (e.g., Checkbox's CRITICAL sibling-combinator conflict, Select's form-select DOM conflict).

Items 2 and 3 are not derivable from reference stories alone — they require knowing what React Aria actually renders and how Bootstrap's selectors work.

**Overlap and potential consolidation:** The sub-part identification, Bootstrap class assignments, and state enumeration in the mapping table overlap heavily with the taxonomy. If you already have the taxonomy and reference stories, you don't need the mapping table to tell you that `ListBoxItem` maps to `.list-group-item.list-group-item-action` — the story shows that directly, more clearly.

The mapping table's necessary content could probably be reduced to: token tables + bridge strategy column + DOM conflict analysis — essentially the three sections above. The rest (sub-parts, variants, confidence ratings, decisions) migrates into the taxonomy.

**Was the mapping table a necessary precursor?** Looking at how the taxonomy was written — it references M001, M010, M013, M014, M017 — those decisions clearly came from prior mapping work. The taxonomy is downstream of it. But whether the *mapping table exercise* is the right vehicle for producing those decisions is a separate question from whether those decisions need to exist.

My read: the mapping-table exercise is a legitimate way to produce the analysis, but it could potentially be folded into an earlier phase of the taxonomy work rather than standing as its own deliverable. The reference stories then serve as verification of that analysis — and as the primary artifact a future agent uses to understand styling targets.

**Bottom line on "which serves better for styling":** If I'm implementing a component:
- Reference stories → primary signal for what each state should look like
- Mapping table bridge strategy + token tables → secondary signal for how to wire it up

The stories are better at communicating the *what*; the mapping table is better at communicating the *how* for the hard cases. Neither alone is complete for the implementation task.

---

**User:** Regarding the mapping table's token tables, do they not already exist in `agent/bootstrap-kb/tokens.md`? Is the per-component organization of the mapping table less overhead than consulting `agent/bootstrap-kb/tokens.md`? The references to M001, M010, M013, M014, M017 are, I think, strays. They refer to the mapping skill, which does not exist on this branch. Can you confirm that they do not convey meaning on this branch?

**Agent:** **On token tables:** Yes, they're redundant. `tokens.md` Section 10 has exactly the same component-level tokens (`--bs-btn-*`, `--bs-list-group-*`, etc.) organized per Bootstrap component class. The mapping table's token tables are a sub-selection of Section 10, filtered by sub-part. The reorganization per sub-part is marginally convenient, but given that you'd always know which Bootstrap component class you're targeting when writing bridge CSS, consulting Section 10 directly is not meaningfully more overhead. The mapping table's token tables don't add information.

**On the M-codes:** Confirmed — they're strays. No M-codes are defined anywhere in `reference-stories-skill.md` or the taxonomy files. The taxonomy has two M017 references (grid layout CSS delta) and one M010 reference (spinner pattern). Both are meaningful concepts, but the codes themselves are opaque on this branch. The meaning only resolves if you happen to cross-reference the mapping table — which is itself a document from a different experiment workflow.

Concretely: the M017 CSS delta content (the grid `repeat(var(--listbox-columns, 2), 1fr)` block) is documented in the mapping table, not in any reference-stories artifact. So the taxonomy references M017 without that content being locally accessible. Same for M010 (spinner pattern) — the taxonomy says `.spinner-border.spinner-border-sm` and then parenthetically says "(M010)" as if it were citing a source, but the citation is a dead link on this branch.

**Practical implication:** both taxonomy references should either be rewritten to plain English descriptions or the relevant content should be folded into the taxonomy or skill doc directly.

---

## Principles extracted

All four principles below were extracted during iteration 0 and written to `agent/reference-stories-skill.md`.

- **P-S001** (expanded) — Faux state classes for pseudo-class specimens. Extracted from Button taxonomy review; expanded with full SCSS pattern and scoping rationale during Phase 2.
- **P-S002** (new) — Reproduce the Bootstrap selector context for each specimen. Extracted from the `.list-group` ancestor bug discovered during Phase 2 review.
- **P-T001** (new) — Err on the side of over-inclusion. Extracted from the Select FormSupport taxonomy observation (Label/Description/FieldError omission was invalid).
- **P-T002** (new) — Reference stories show target appearances only. Extracted from the Select Trigger review (Group B "unstyled baseline" was not a valid specimen).

---

## Skill update status

- [x] `agent/reference-stories-skill.md` updated
- [x] Finalized taxonomy files merged to `reference-stories`
- [x] Finalized story files merged to `reference-stories`
- [x] `CLAUDE.md` iteration counter incremented
