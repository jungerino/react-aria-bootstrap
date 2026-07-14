---
title: Principles Consolidation Tracker
---

# Principles Consolidation Tracker

Working document for the multi-session consolidation of `agent/react-aria-skill/principles.md` per the process in the approved plan (`/Users/josh/.claude/plans/in-this-session-we-snug-karp.md`, session of 2026-07-12). Tracks per-principle decisions so the review can resume across sessions without re-deriving prior work.

**Process reference:** research findings at `agent/notes/principles-templates-best-practices.md` (six templates: Conditional, Preference/Trade-off, Domain-Fact, Anti-Pattern/Gotcha, Verification/Checklist, Procedural/Fallback).

**Numbering scheme:** surviving principles renumbered sequentially by 10 in final cluster order (P010, P020, …) once all clusters are reviewed (Stage E). Gotchas moved to `SKILL.md` get separate `G010, G020, …` numbering. Old IDs are kept in this tracker as a permanent cross-reference even after renumbering.

**Format convention, added during Cluster 1 review (2026-07-13):** every `principles.md` entry now leads with a `**Type:**` field (Triggered, Preference, Fact, Verification, or Procedural) for human scanability — see `agent/notes/principle-types.md` for the full reference. Retrofitted onto Cluster 1's P001/P002/P013; apply going forward for every remaining cluster. Gotcha entries in `SKILL.md` don't get a `Type:` field — the section heading already establishes it.

**TOC convention, changed after Cluster 3 (2026-07-13):** the legacy `Core Principles`, `Extended Principles`, and `Stories Conventions` TOC headers no longer carry a specific ID-range + "excluding ..." parenthetical. That approach (used through Clusters 1–3) required updating a growing exclusion list on every cluster that pulled a member out of one of these sections — extra synchronized bookkeeping on top of the tracker, and exactly the kind of thing that produced the one real bug so far (a leftover duplicate P013 entry, caught and fixed during Cluster 2). The bullet lists directly under each header were always the accurate source of truth regardless; the parenthetical was redundant with them. Headers now just say "(not yet reviewed — membership below is current; see tracker for status)." Stage E's full TOC rebuild replaces these placeholder headers entirely once every cluster is done.

**Known pre-existing issues carried into this review:**
- ~~P053 cites "M014"/"M020"...~~ **Resolved in Cluster 2 (2026-07-13).** P053 rewritten to drop the M014/M020 labels entirely (now a self-contained Verification principle); the decision-making heuristic that used to live in P053 was migrated to Stage 4's `M014` itself (see Cluster 2 decision log below) rather than left duplicated or dangling.
- TOC omits P053 entirely (body has it, TOC doesn't). **Resolved as part of Cluster 2's TOC edit** — P053 now has a proper TOC entry under "DOM & Counterpart Matching."
- P045 is a numbering gap with **no git history** — confirmed absent even in the first commit that added `principles.md` (`6cf571d`, 2026-06-03). No record of what it was; treat as unrecoverable, not a merge target.
- ~~Taxonomy files... historically cited P-numbers with a hyphen (`P-012`)...~~ **Corrected, not actually an inconsistency (found during Cluster 2 review, 2026-07-13):** `agent/mapping-and-references-skill/component-agent.md` has its own internal, hyphenated `P-XXX` numbering scheme (e.g. `P-012: For dual-counterpart components, override CSS variables at the element level`) — a completely different namespace from `principles.md`'s unhyphenated `PXXX`. They coincidentally collide on some numbers (Stage 4's `P-012` ≠ `principles.md`'s `P012`). The hyphen is very likely functioning as an (undocumented) disambiguator between the two systems, not a formatting slip. **Nothing to reconcile in Stage E** — remove this from the punch list. Worth documenting the two-namespace situation somewhere for future clarity, but out of scope for this pass.
- **Renumbering deferred to Stage E, decided in Cluster 1 review (2026-07-12):** `component-agent.md` cites several P-numbers inline (confirmed: P002, P007, P011, P013) but is out of scope for content edits this pass. Old P-numbers stay stable through Stage B (content is rewritten/reorganized/merged/moved, but IDs don't change) so those citations don't go stale mid-process. Stage E does the sequential-by-10 renumbering **and** a mechanical find-and-replace of just the numeric citations in `component-agent.md` and `final-stories-agent.md` — a small, contained fix, not the broader duplication reconciliation that's out of scope for this pass.
- **P002 omission fixed:** P002 (`class-in-tsx`) was missing from the Stage A cluster inventory below (it was always present in `principles.md`'s own TOC/body — this was an oversight in the tracker's inventory, not a gap in the source doc). Added to Cluster 1.
- **Scope exception, Cluster 2 (2026-07-13):** `agent/mapping-and-references-skill/component-agent.md`'s `M014` was amended (content only, ID unchanged) to absorb a decision heuristic that used to live in `principles.md`'s P053. This is a deliberate, narrow exception to the "scope to principles.md + SKILL.md only" boundary agreed earlier — made because the heuristic belongs at the taxonomy-authoring decision point, not at Tier 1 implementation, and leaving it duplicated or dangling was worse than the small scope crossing. Not a general reopening of that boundary.

---

## Cluster Status

| # | Cluster | Members (old IDs) | Status |
|---|---------|--------------------|--------|
| 1 | Selector & specificity mechanics | P001, P002, P013 | **Done** |
| 2 | DOM/counterpart matching | P012 (deleted), P036, P039 (deleted), P010 (→ Gotcha G020), P053 | **Done** |
| 3 | Structural selector breakage & boundary ownership | P008 (→ Gotcha G030), P040 | **Done** |
| 4 | Interaction-state bridging | P003, P014, P044, P046, Data-* Bridge Rules (unnumbered) | Not started |
| 5 | Prop surface / variant coverage | P006, P007, P038 | Not started |
| 6 | CSS baseline hygiene | P004, P009, P020, P050 | Not started |
| 7 | Dimensions & layout stability | P016, P026, P041, P042, P037 | Not started |
| 8 | Visual fidelity completeness | P043 | Not started |
| 9 | Borders & outline patterns | P017, P019, P021 | Not started |
| 10 | Color & accessibility | P034, P035 | Not started |
| 11 | Icons & CSS-native visuals | P022, P023, P024 | Not started |
| 12 | Interactive element basics | P011, P027, P028 | Not started |
| 13 | SCSS/build config | P015, P033, P018, P005 | Not started |
| 14 | Portals & overlays | P025, P049, P052 | Not started |
| 15 | Focus management | P051 | Not started |
| 16 | Stories Conventions | P029, P030, P031, P032, P047, P048, "When Bootstrap Mapping Cannot Be Found" (unnumbered) | Not started |

---

## Full Inventory (pre-review restatements)

Each row: my one-line restatement of trigger + mechanism + rationale, current outbound cross-references, an initial action hypothesis, and a **Resolution** column recording what was actually decided during live review (filled in as each cluster completes; `—` means not yet reviewed).

### Cluster 1 — Selector & specificity mechanics
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P001 | compound-sel | Keep `.react-aria-*` class alongside Bootstrap classes on every element so specificity wins without conflicting with React Aria's own CSS. | — | Keep (Fact or Conditional) | Kept, standalone, rewritten as **Triggered**. Moved into new "Selector & Specificity Mechanics" section. |
| P002 | class-in-tsx | Two ways to write `className` on a React Aria component: callback form (needs `defaultClassName` to preserve the RAC class) or plain string (replaces it entirely). Don't interpolate the callback argument directly — it's the whole RenderProps object. | P046 (plain-string form) | *(originally omitted from inventory — oversight, backfilled 2026-07-13)* | Kept **standalone**, not merged into P001 (determined to be the broader general mechanism, not specific to P001's rationale). Rewritten as **Triggered**; interpolation trap split out to **G010** in `SKILL.md`. |
| P013 | prefer-component-cls | Prefer Bootstrap component classes/targeted bridge CSS over utility classes in JSX, since component classes carry semantic meaning and a coherent override surface. | — | Keep (Preference) | Kept, rewritten as **Preference**. Moved into same new section, adjacent to P001/P002. |

### Cluster 2 — DOM/counterpart matching
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P012 | match-dom | Choose the Bootstrap pattern by inspecting React Aria's actual rendered DOM, not by component-name similarity. | — | Keep (Conditional) | **Deleted.** Confirmed near-duplicate of Stage 4's `M001` (dom-first), and Tier 1's own `component-agent.md` explicitly says "do not re-derive" taxonomy-resolved decisions — this principle described exactly the forbidden re-derivation. |
| P036 | derive-from-counterpart | When a direct Bootstrap counterpart exists, derive bridge rules from its actual compiled/source CSS, not from variable names alone. | P010 (works even when direct attachment is blocked) | Keep (Conditional), inline the P010 pointer | **Kept**, rewritten as **Triggered**. Narrowed to its real unique contribution — CSS *mechanism* fidelity (e.g. `box-shadow` not `outline`), distinct from P033's variable-existence concern (Cluster 13, not yet reviewed — flagged for cross-check there). P010 pointer replaced with an inline clause rather than a cross-reference, since P010 moved out of `principles.md` entirely. |
| P039 | sub-element-counterpart | Extend counterpart identification (P012/P036) to every named sub-element, not just the top-level component. | P012, P036 | Keep, merge/adjacent to P012/P036 | **Deleted.** Confirmed near-duplicate of Stage 4's `M002` (sub-parts); the real `select-taxonomy.md` output already gives every sub-part its own resolved counterpart row. |
| P010 | form-attach | Bootstrap form classes target native inputs and don't attach to React Aria's custom controls — replicate the *visual outcome* on the custom element instead. | — | Keep (Fact + Conditional hybrid) | **Moved to Gotcha `G020`** in `SKILL.md`. Confirmed it belongs in Cluster 2, not Cluster 3 (my original placement reasoning was based on a citation co-occurrence in `component-agent.md`, not real conceptual similarity — corrected). Kept despite being a specific instance of the now-deleted P012, because it's the one Cluster 2 member `component-agent.md` actually cites operationally, and a Gotcha's "prime the trap" function differs from P012's methodology role. |
| P053 | prefer-visual-target-class | When a component has diverging structural vs. semantic Bootstrap counterparts (foreign concept "M014"), prefer the visual target class when it reduces bridge complexity; don't stack two component classes (foreign concept "M020"). | M014, M020 (undefined in this file — **gap to resolve**) | Needs rework — inline M014/M020 content or determine if this belongs here at all | **Kept**, rewritten as **Verification**, narrowed. The decision heuristic ("prefer visual class when it reduces bridge complexity") was migrated to Stage 4's `M014` itself (scope exception, see note above) since that's where the decision is actually made; P053 keeps only the two things genuinely Tier-1-only — verifying the applied class's pseudo-class rules actually produce visible output, and the single-component-class implementation guardrail. M014/M020 labels dropped entirely; fully self-contained now. |

### Cluster 3 — Structural selector breakage & boundary ownership
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P008 | structural-sel | Bootstrap's structural selectors (`:first-child`, adjacent-sibling, `inherit`) break when React Aria inserts wrapper/header elements — use explicit token values in targeted bridge selectors instead. | — | Keep (Conditional); Gotcha candidate | **Moved to Gotcha `G030`.** Confirmed Stage 4 has no dedicated M-numbered methodology resolving structural-selector breakage (unlike M014/M018) — the real taxonomy only flags it as a DOM-conflict category, doesn't resolve the fix technique — so this is genuinely Tier-1, unlike P012/P039. Broadened during review: the original text only explained the `:first-child`/`inherit` failure mechanisms even though it named adjacent-sibling combinators (`+`) too; added a third bullet with a concrete `.btn-check + .btn` example for that distinct failure mode (user caught this gap). |
| P040 | container-owns-boundary | Boundary properties (border, border-radius) belong on the container, not children, because structural child-selectors (per P008) are unreliable. | P008 | Keep, adjacent to P008 | **Kept**, rewritten as **Triggered**, in a new "Boundary Ownership" section. Made fully self-contained (dropped the "P008 established..." pointer, since P008 left `principles.md` for `SKILL.md`) — and came out *broadened*, not just trimmed: the rewrite makes explicit that overflow-scroll clipping and nested-group reordering are separate root causes from wrapper insertion, all fixed the same way. |

### Cluster 4 — Interaction-state bridging
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P003 | scss-bridge | Map React Aria `data-*` attributes to Bootstrap interaction styles in `_bootstrap-bridges.scss`; Bootstrap is authoritative for interaction states. | — | Keep (Conditional) | — |
| P014 | data-pressed | Bridge `[data-pressed]` to Bootstrap's `:active` rules, since `:active` doesn't fire for keyboard activation but `[data-pressed]` does. | — | Keep (Conditional); Gotcha candidate | — |
| P044 | faux-state-class | Mirror stories must simulate non-declarative states with `.faux-*` CSS to match reference-story coverage, wrapping in a scope div when `className` replacement (P046) prevents direct application. | P003, P046 | Keep — cross-cutting bridging/stories, decide final home | — |
| P046 | rac-class-replace | A string `className` replaces React Aria's default class entirely — bridge selectors must target the provided class, not the default. | — | Gotcha candidate | **Moved to Gotcha `G040`.** Confirmed via discussion there's no legitimate deliberate use case for omitting the RAC class — P001 establishes keeping it is free and beneficial, so this is a defensive/diagnostic check for an actual mistake (pre-existing component source, or an agent reaching for the shorter-looking string), not documentation of an intentional pattern. |
| *(unnumbered)* | data-bridge-rules | When to bridge a `data-*` attribute (no native pseudo-class equivalent / non-native element / `aria-disabled`+`[data-disabled]`) vs. when not to (native pseudo-classes that fire automatically). | — | Candidate to become a numbered Conditional principle | **Superseded — rewritten to zero exceptions.** After further discussion, went further than the P014/P051-contradiction fix: dropped the `:hover`/`:disabled` "safe to use directly" carve-outs entirely. Reasoning chain: (1) 2 of the original 4 "safe" pseudo-classes already had real gaps (P014, P051) — trusting the other 2 "because nothing's been found yet" repeats the same unverified-assumption error; (2) the "avoid JS mediation" argument for keeping `:hover` as an exception was factually wrong — React Aria's `useHover` sets `[data-hovered]` unconditionally regardless of whether the bridge CSS selects it, so there's no JS cost being avoided; (3) most elements already need `[data-*]` bridging for at least one other state, so the marginal cost of also bridging hover is small, while the case-by-case judgment call it replaces is exactly the risk shape that already produced 2 real bugs. Now reads as a single uniform rule: bridge every interactive `data-*` attribute, no exceptions. The numbered "bridge only when" gate is gone too — it's vacuous once bridging is unconditional. **Open, deferred:** (a) whether `agent/mapping-and-references-skill/component-agent.md`'s `M004` (three-bridges) should be touched — its "hover = CSS pseudo-class overlap, no bridge needed" claim isn't factually wrong, Tier 1 is just choosing not to exploit the overlap for uniformity's sake, so this may not need a fix the way `M014` did; (b) whether this section should merge into P003 (very similar content) once P003 is reviewed. **Still open from before:** whether this becomes a numbered Type-tagged principle at all. **Further trimmed (2026-07-13):** the rationale above belongs in this tracker, not in `principles.md` itself — the user caught that the written rule still carried persuasive/historical justification ("nothing's been found yet," "the marginal cost is small") aimed at convincing a skeptical reader, when the rule is unconditional and doesn't need a reason to be applied correctly. Final text in `principles.md` is now a single flat sentence plus the example — no rationale at all. |

### Cluster 5 — Prop surface / variant coverage
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P006 | modifier-audit | Check Bootstrap's documented modifier classes for layout/orientation variants before hand-rolling one. | — | Keep (Procedural/Conditional) | — |
| P007 | variant-replace | Bootstrap's variant set is authoritative — replace the component library's inherited variants with Bootstrap's, reading Bootstrap docs rather than relying on recall. | P038 (mirrors the "read docs, don't recall" requirement) | Keep, adjacent to P038 | — |
| P038 | prop-audit-first | Enumerate the full React Aria prop surface from documentation before implementing, flagging layout/orientation/selection/variant props. | P007 | Keep, merge rationale with P007 | — |

### Cluster 6 — CSS baseline hygiene
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P004 | conflict-css | Comment out (never delete) conflicting project CSS. | — | Keep (Verification/Procedural) | — |
| P009 | clean-slate | Comment-out doesn't guarantee a blank slate (other import paths may still load the same CSS) — explicitly set every structural property Bootstrap expects to control. | P004, P005 (bundle isolation is the actual root-cause fix) | Keep; Gotcha candidate | — |
| P020 | reboot-align | Bootstrap's reboot resets browser defaults (e.g. `<th>` alignment) — never rely on browser defaults once Bootstrap loads. | P050 | Keep, adjacent to P050 | — |
| P050 | reboot-mismatch | When React Aria substitutes a different element type than Bootstrap's reboot rule targets, those rules silently don't apply — read `_reboot.scss` and apply invalidated properties explicitly. | P020 | Keep, adjacent to P020; Gotcha candidate | — |

### Cluster 7 — Dimensions & layout stability
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P016 | fixed-dims | Fix explicit `rem`-based dimensions only for indicator elements that mount/unmount, to prevent layout shift. | — | Keep (Conditional) | — |
| P026 | use-rem | Use `rem`, not `em`, for Bootstrap-matched sizing so values don't drift with local font-size context. | — | Keep (Fact/Preference), possibly merge with P016 | — |
| P041 | value-display-stable-dims | A trigger displaying a selected value from a finite set must size to its widest option via a hidden sizer — not `.visually-hidden` (removes from layout flow). | P048 | Keep; the `.visually-hidden` trap is a Gotcha candidate | — |
| P042 | right-anchor-indicator | Pin trailing indicators to the right edge in flex rows via `justify-content: space-between` or `margin-left: auto`. | P024 (addresses placement, not rotation) | Keep, adjacent to P024 (different cluster — cross-reference to resolve) | — |
| P037 | multi-select-separator | Add a visible separator between adjacent selected items in multi-selection components so filled backgrounds don't merge visually. | — | Keep (Conditional) | — |

### Cluster 8 — Visual fidelity completeness
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P043 | visual-metaphor-completeness | After bridging individual state properties, verify the full coordinated visual effect matches Bootstrap's metaphor — not just each property in isolation. | — | Keep (Verification) | — |

### Cluster 9 — Borders & outline patterns
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P017 | border-transparent | Prefer `border-color: transparent` over `border-width: 0`/`.border-0` to hide borders while keeping them restorable; use `outline` as a last resort. | — | Keep (Preference) | — |
| P019 | outline-base | Use `btn-outline-{variant}` + `border-color: transparent` as a behavioral base for borderless interactive elements that still need full interaction states. | P017 | Keep, adjacent to P017 | — |
| P021 | outline-text-color | `btn-outline-*` sets text to the variant color, not body color — override explicitly on cells/list items where body text is expected. | P019 | Keep, adjacent to P019; Gotcha candidate | — |

### Cluster 10 — Color & accessibility
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P034 | contrast-all-states | Maintain ≥4.5:1 text contrast through every interaction state, not just rest. | — | Keep (Verification) | — |
| P035 | no-color-alone | Use a non-color attribute as the primary state differentiator (WCAG 1.4.1 + Bootstrap semantic-color conventions). | — | Keep (Fact/Conditional) | — |

### Cluster 11 — Icons & CSS-native visuals
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P022 | bs-icons | Prefer Bootstrap Icons (`<i class="bi bi-*">`) over inline SVG when an equivalent exists. | — | Keep (Preference) | — |
| P023 | css-native-visual | Don't add a JSX icon alongside a Bootstrap CSS-native visual (pseudo-element/background-image) — remove the JSX icon instead. | — | Keep (Conditional); Gotcha candidate | — |
| P024 | caret-flip | Rotate carets 180° on open via `transform`; for `background-image`-based carets (e.g. `.form-select`), swap the CSS custom property instead since `transform` has no effect on background images. | P042 | Keep, adjacent to P042 (cross-cluster ref) | — |

### Cluster 12 — Interactive element basics
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P011 | cursor-pointer | Add `cursor: pointer` explicitly to non-native interactive elements (`<div>`/`<span>`), since only `<a>`/`<button>` get it for free. | — | Keep (Fact); possible Gotcha | — |
| P027 | btn-non-button | Apply `.btn` to any non-`<button>` interactive element for correct cursor/padding/focus/interaction hooks. | — | Keep (Conditional), possibly merge with P011 | — |
| P028 | btn-sm-dense | Prefer `.btn-sm` over `.btn` in dense/grid-constrained layouts. | — | Keep (Preference) | — |

### Cluster 13 — SCSS/build config
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P015 | scss-mixins | Use Bootstrap's `$enable-*`-gated SCSS mixins (`box-shadow`, `transition`, `border-radius`, `gradient-bg`) in bridge selectors instead of raw CSS properties, which bypass the project's feature flags. | — | Keep (Conditional); Gotcha candidate; partial deterministic-check candidate (grep raw properties in bridge file) | — |
| P033 | verify-scss-vars | Verify a Bootstrap SCSS variable exists and resolves to the expected value before using it — names can be misleading. | — | Keep (Verification); **strong deterministic-rule candidate** | — |
| P018 | postcss-scope | Scope Bootstrap via `postcss-prefix-selector` (post-compile), never SCSS nesting (breaks Bootstrap's compiled sibling selectors). | — | Is this a per-component principle or one-time build config already implemented? Flag for discussion; Gotcha candidate | — |
| P005 | bundle-isolation | Storybook's shared CSS bundle requires a story-glob filter for isolation — `@layer` and comment-outs are insufficient. | P004, P009 | Same question as P018 — infra fact vs. active principle | — |

### Cluster 14 — Portals & overlays
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P025 | hardcode-show | Hardcode `.show` on Bootstrap overlay elements since React Aria (not Bootstrap JS) controls mount/unmount visibility; apply via TSX `className` for portal elements, not bridge CSS. | P052 | Keep, adjacent to P052; Gotcha candidate | — |
| P049 | rac-trigger-width | Consume RAC's `--trigger-width` custom property to match dropdown width to trigger width. | P052 | Keep, adjacent to P052 | — |
| P052 | portal-no-ancestor-sel | RAC overlay elements (Popover, Modal, Tooltip) render in DOM portals — ancestor bridge selectors silently never match; scope via attributes on the portal element itself instead. | P049, P025 | Keep as the umbrella principle for this cluster; strong Gotcha candidate | — |

### Cluster 15 — Focus management
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P051 | programmatic-focus-visible | Programmatic `.focus()` calls trigger the browser's `:focus-visible` regardless of input mode — suppress unconditional `:focus` outline and restore only on `[data-focus-visible]` for genuine keyboard nav. | — | Keep; strong Gotcha candidate (undetectable by pixel-diff, per its own text) | — |

### Cluster 16 — Stories Conventions
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis | Resolution |
|----|------|--------------|-----------------|---------------------|------------|
| P029 | argtypes-control | Configure `argTypes` explicitly for string-union props (inline-radio for 2-5 values, select for 6+) rather than relying on auto-inferred free text. | — | Keep (Conditional); deterministic-rule candidate | — |
| P030 | layout-variants-story | One "Layout Variants" story showing all non-default permutations side by side, not one story per permutation. | — | Keep (Preference) | — |
| P031 | state-stories | Separate stories for Disabled/Invalid/WithDescription where applicable. | — | Keep (Conditional) | — |
| P032 | title-case-labels | Title-case Variants story labels — never raw lowercase prop strings. | — | Keep; deterministic-rule candidate | — |
| P047 | presentation-import | Mirror stories must explicitly `import '../presentation.scss'` since the pixel-diff script renders stories in isolation without the normal import chain. | — | Keep (Verification); deterministic-rule candidate | — |
| P048 | no-inline-style | No inline `style=` except two documented story-harness exceptions (overlay `minHeight` reservation, `position: static` override), each requiring an inline comment. | P041 | Keep (Verification); deterministic-rule candidate (with exception list) | — |
| *(unnumbered)* | mapping-not-found-fallback | When no Bootstrap equivalent can be identified: log to the Unmapped appendix and list alternatives considered. | — | Candidate for Template 6 (Procedural/Fallback) or keep as free-form appendix instructions | — |

---

## Decision Log

*(Populated cluster-by-cluster during Stage B live review. Format per entry: Old ID(s) → New ID | Action | Template | Cross-refs resolved | Notes)*

### Cluster 1 — Selector & specificity mechanics (done 2026-07-12)
- **P001 (compound-sel)** → ID unchanged for now (renumbered in Stage E) | Kept, standalone, rewritten as **Conditional** | No cross-refs (mentions P002 as the mechanism to satisfy it, adjacent in same section) | Moved into new "Selector & Specificity Mechanics" section.
- **P002 (class-in-tsx)** → ID unchanged | Kept **standalone** (not merged into P001 — user determined it's the broader general mechanism for writing `className` at all, not specific to P001's compound-selector rationale) | Rewritten as **Conditional**; interpolation trap split out | Cross-ref to P046 (plain-string branch) kept as pointer — P046 not yet reviewed (Cluster 4), relationship flagged for that review.
- **P013 (prefer-component-cls)** → ID unchanged | Kept, rewritten as **Preference/Trade-off** | No cross-refs | Moved into same new section, adjacent to P001/P002.
- **G010 (className-callback-interpolation)** → split out of P002 | New **Gotcha**, added to `SKILL.md` | — | First entry in SKILL.md's new Gotchas section.

**Correction, made during Cluster 4 review (2026-07-13):** P002's "Plain string" branch originally (in this rewrite) said it "replaces the RAC default class entirely... use this when the RAC class is deliberately not wanted" — that misrepresented the *original* source text, which actually described a plain string that **explicitly includes** the RAC class as literal text (a safe static equivalent of the callback form), not one that omits it. Fixed to describe the safe variant correctly; the omit-the-RAC-class failure case now lives entirely in Gotcha `G040` (ex-P046), referenced from P002's rationale instead of conflated into its own "Action" field.

### Cluster 2 — DOM/counterpart matching (done 2026-07-13)
- **P012 (match-dom)** → **Deleted.** Near word-for-word duplicate of Stage 4's `M001`; Tier 1's own `component-agent.md` explicitly forbids re-deriving taxonomy-resolved decisions.
- **P039 (sub-element-counterpart)** → **Deleted.** Near-duplicate of Stage 4's `M002`; real taxonomy output already resolves every sub-part's counterpart.
- **P053 (prefer-visual-target-class)** → ID unchanged | Kept, rewritten as **Verification**, narrowed to the verify-and-guardrail content only | M014/M020 labels dropped entirely (fully self-contained now) | The decision heuristic previously in P053 was migrated to `agent/mapping-and-references-skill/component-agent.md`'s `M014` (content amended, ID unchanged) as a deliberate, narrow scope exception — see "Known pre-existing issues" note above.
- **P036 (derive-from-counterpart)** → ID unchanged | Kept, rewritten as **Triggered**, narrowed to CSS-mechanism fidelity | Dropped the "(see P010)" pointer — P010 moved out of `principles.md` entirely, so the needed context is now inlined instead | Flagged overlap with P033 (Cluster 13, not yet reviewed) for cross-check when that cluster is reviewed — related but distinct concerns (mechanism choice vs. variable existence), likely not a merge.
- **P010 (form-attach)** → split out | New **Gotcha `G020`**, added to `SKILL.md` | — | Confirmed placement in Cluster 2 (not Cluster 3 — my original reasoning was a citation-grouping artifact in `component-agent.md`, not real conceptual similarity).
- **Side finding:** `agent/mapping-and-references-skill/component-agent.md` has its own internal, hyphenated `P-XXX` numbering scheme, unrelated to `principles.md`'s `PXXX` — see corrected "Known pre-existing issues" note above.

### Cluster 3 — Structural selector breakage & boundary ownership (done 2026-07-13)
- **P008 (structural-sel)** → split out | New **Gotcha `G030`**, added to `SKILL.md` | — | Stage-4 check confirmed this is genuinely Tier-1 (no dedicated M-number resolves it, unlike Cluster 2's redundant members). Broadened during review at the user's prompting: original text named adjacent-sibling combinators (`+`) but only ever explained the `:first-child`/`inherit` failure mechanisms — added a third, distinct explanation with a concrete `.btn-check + .btn` example, since sibling-adjacency breakage is mechanically different from sibling-position or inheritance breakage.
- **P040 (container-owns-boundary)** → ID unchanged | Kept, rewritten as **Triggered**, in new "Boundary Ownership" section | Dropped the "P008 established..." pointer (self-contained now) | Came out broadened, not just trimmed — made explicit that overflow-scroll clipping and nested-group reordering are separate root causes from wrapper insertion, all fixed the same way (boundary on container, never children).

---

## Gotcha Candidates for SKILL.md (running list — confirmed during Stage B, not final until Stage C)

- **G010 — className-callback-interpolation** (from P002) — confirmed and already written into `SKILL.md`.
- **G020 — form-class-no-attach** (from P010) — confirmed and already written into `SKILL.md`.
- **G030 — structural-selector-breakage** (from P008) — confirmed and already written into `SKILL.md`.
- **G040 — plain-string-drops-rac-class** (from P046) — confirmed and already written into `SKILL.md`.

## Deterministic-Rule Candidates (running list — confirmed during Stage B, finalized Stage D)

*(empty — populated as clusters are reviewed)*
