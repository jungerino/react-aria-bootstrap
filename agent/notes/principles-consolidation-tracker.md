---
title: Principles Consolidation Tracker
---

# Principles Consolidation Tracker

Working document for the multi-session consolidation of `agent/react-aria-skill/principles.md` per the process in the approved plan (`/Users/josh/.claude/plans/in-this-session-we-snug-karp.md`, session of 2026-07-12). Tracks per-principle decisions so the review can resume across sessions without re-deriving prior work.

**Process reference:** research findings at `agent/notes/principles-templates-best-practices.md` (six templates: Conditional, Preference/Trade-off, Domain-Fact, Anti-Pattern/Gotcha, Verification/Checklist, Procedural/Fallback).

**Numbering scheme:** surviving principles renumbered sequentially by 10 in final cluster order (P010, P020, …) once all clusters are reviewed (Stage E). Gotchas moved to `SKILL.md` get separate `G010, G020, …` numbering. Old IDs are kept in this tracker as a permanent cross-reference even after renumbering.

**Format convention, added during Cluster 1 review (2026-07-13):** every `principles.md` entry now leads with a `**Type:**` field (Triggered, Preference, Fact, Verification, or Procedural) for human scanability — see `agent/notes/principle-types.md` for the full reference. Retrofitted onto Cluster 1's P001/P002/P013; apply going forward for every remaining cluster. Gotcha entries in `SKILL.md` don't get a `Type:` field — the section heading already establishes it.

**Known pre-existing issues carried into this review:**
- P053 cites "M014"/"M020" — defined only in `agent/mapping-and-references-skill/component-agent.md`, which Tier 1 react-aria-skill agents never load. Must be resolved (inline or reposition) in Cluster 2.
- TOC omits P053 entirely (body has it, TOC doesn't).
- P045 is a numbering gap with **no git history** — confirmed absent even in the first commit that added `principles.md` (`6cf571d`, 2026-06-03). No record of what it was; treat as unrecoverable, not a merge target.
- Taxonomy files (when they exist) have historically cited P-numbers with a hyphen (`P-012`) while `principles.md` uses no hyphen (`P012`) — pick one format during Stage E and note it, though this doesn't block per-principle review.
- **Renumbering deferred to Stage E, decided in Cluster 1 review (2026-07-12):** `component-agent.md` cites several P-numbers inline (confirmed: P002, P007, P011, P013) but is out of scope for content edits this pass. Old P-numbers stay stable through Stage B (content is rewritten/reorganized/merged/moved, but IDs don't change) so those citations don't go stale mid-process. Stage E does the sequential-by-10 renumbering **and** a mechanical find-and-replace of just the numeric citations in `component-agent.md` and `final-stories-agent.md` — a small, contained fix, not the broader duplication reconciliation that's out of scope for this pass.
- **P002 omission fixed:** P002 (`class-in-tsx`) was missing from the Stage A cluster inventory below (it was always present in `principles.md`'s own TOC/body — this was an oversight in the tracker's inventory, not a gap in the source doc). Added to Cluster 1.

---

## Cluster Status

| # | Cluster | Members (old IDs) | Status |
|---|---------|--------------------|--------|
| 1 | Selector & specificity mechanics | P001, P002, P013 | **Done** |
| 2 | DOM/counterpart matching | P012, P036, P039, P010, P053 | Not started |
| 3 | Structural selector breakage & boundary ownership | P008, P040 | Not started |
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

Each row: my one-line restatement of trigger + mechanism + rationale, current outbound cross-references, and an initial action hypothesis (confirmed/changed during live review — see decision log below once a cluster starts).

### Cluster 1 — Selector & specificity mechanics
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P001 | compound-sel | Keep `.react-aria-*` class alongside Bootstrap classes on every element so specificity wins without conflicting with React Aria's own CSS. | — | Keep (Fact or Conditional) |
| P013 | prefer-component-cls | Prefer Bootstrap component classes/targeted bridge CSS over utility classes in JSX, since component classes carry semantic meaning and a coherent override surface. | — | Keep (Preference) |

### Cluster 2 — DOM/counterpart matching
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P012 | match-dom | Choose the Bootstrap pattern by inspecting React Aria's actual rendered DOM, not by component-name similarity. | — | Keep (Conditional) |
| P036 | derive-from-counterpart | When a direct Bootstrap counterpart exists, derive bridge rules from its actual compiled/source CSS, not from variable names alone. | P010 (works even when direct attachment is blocked) | Keep (Conditional), inline the P010 pointer |
| P039 | sub-element-counterpart | Extend counterpart identification (P012/P036) to every named sub-element, not just the top-level component. | P012, P036 | Keep, merge/adjacent to P012/P036 |
| P010 | form-attach | Bootstrap form classes target native inputs and don't attach to React Aria's custom controls — replicate the *visual outcome* on the custom element instead. | — | Keep (Fact + Conditional hybrid) |
| P053 | prefer-visual-target-class | When a component has diverging structural vs. semantic Bootstrap counterparts (foreign concept "M014"), prefer the visual target class when it reduces bridge complexity; don't stack two component classes (foreign concept "M020"). | M014, M020 (undefined in this file — **gap to resolve**) | Needs rework — inline M014/M020 content or determine if this belongs here at all |

### Cluster 3 — Structural selector breakage & boundary ownership
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P008 | structural-sel | Bootstrap's structural selectors (`:first-child`, adjacent-sibling, `inherit`) break when React Aria inserts wrapper/header elements — use explicit token values in targeted bridge selectors instead. | — | Keep (Conditional); Gotcha candidate |
| P040 | container-owns-boundary | Boundary properties (border, border-radius) belong on the container, not children, because structural child-selectors (per P008) are unreliable. | P008 | Keep, adjacent to P008 |

### Cluster 4 — Interaction-state bridging
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P003 | scss-bridge | Map React Aria `data-*` attributes to Bootstrap interaction styles in `_bootstrap-bridges.scss`; Bootstrap is authoritative for interaction states. | — | Keep (Conditional) |
| P014 | data-pressed | Bridge `[data-pressed]` to Bootstrap's `:active` rules, since `:active` doesn't fire for keyboard activation but `[data-pressed]` does. | — | Keep (Conditional); Gotcha candidate |
| P044 | faux-state-class | Mirror stories must simulate non-declarative states with `.faux-*` CSS to match reference-story coverage, wrapping in a scope div when `className` replacement (P046) prevents direct application. | P003, P046 | Keep — cross-cutting bridging/stories, decide final home |
| P046 | rac-class-replace | A string `className` replaces React Aria's default class entirely — bridge selectors must target the provided class, not the default. | — | Gotcha candidate |
| *(unnumbered)* | data-bridge-rules | When to bridge a `data-*` attribute (no native pseudo-class equivalent / non-native element / `aria-disabled`+`[data-disabled]`) vs. when not to (native pseudo-classes that fire automatically). | — | Candidate to become a numbered Conditional principle |

### Cluster 5 — Prop surface / variant coverage
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P006 | modifier-audit | Check Bootstrap's documented modifier classes for layout/orientation variants before hand-rolling one. | — | Keep (Procedural/Conditional) |
| P007 | variant-replace | Bootstrap's variant set is authoritative — replace the component library's inherited variants with Bootstrap's, reading Bootstrap docs rather than relying on recall. | P038 (mirrors the "read docs, don't recall" requirement) | Keep, adjacent to P038 |
| P038 | prop-audit-first | Enumerate the full React Aria prop surface from documentation before implementing, flagging layout/orientation/selection/variant props. | P007 | Keep, merge rationale with P007 |

### Cluster 6 — CSS baseline hygiene
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P004 | conflict-css | Comment out (never delete) conflicting project CSS. | — | Keep (Verification/Procedural) |
| P009 | clean-slate | Comment-out doesn't guarantee a blank slate (other import paths may still load the same CSS) — explicitly set every structural property Bootstrap expects to control. | P004, P005 (bundle isolation is the actual root-cause fix) | Keep; Gotcha candidate |
| P020 | reboot-align | Bootstrap's reboot resets browser defaults (e.g. `<th>` alignment) — never rely on browser defaults once Bootstrap loads. | P050 | Keep, adjacent to P050 |
| P050 | reboot-mismatch | When React Aria substitutes a different element type than Bootstrap's reboot rule targets, those rules silently don't apply — read `_reboot.scss` and apply invalidated properties explicitly. | P020 | Keep, adjacent to P020; Gotcha candidate |

### Cluster 7 — Dimensions & layout stability
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P016 | fixed-dims | Fix explicit `rem`-based dimensions only for indicator elements that mount/unmount, to prevent layout shift. | — | Keep (Conditional) |
| P026 | use-rem | Use `rem`, not `em`, for Bootstrap-matched sizing so values don't drift with local font-size context. | — | Keep (Fact/Preference), possibly merge with P016 |
| P041 | value-display-stable-dims | A trigger displaying a selected value from a finite set must size to its widest option via a hidden sizer — not `.visually-hidden` (removes from layout flow). | P048 | Keep; the `.visually-hidden` trap is a Gotcha candidate |
| P042 | right-anchor-indicator | Pin trailing indicators to the right edge in flex rows via `justify-content: space-between` or `margin-left: auto`. | P024 (addresses placement, not rotation) | Keep, adjacent to P024 (different cluster — cross-reference to resolve) |
| P037 | multi-select-separator | Add a visible separator between adjacent selected items in multi-selection components so filled backgrounds don't merge visually. | — | Keep (Conditional) |

### Cluster 8 — Visual fidelity completeness
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P043 | visual-metaphor-completeness | After bridging individual state properties, verify the full coordinated visual effect matches Bootstrap's metaphor — not just each property in isolation. | — | Keep (Verification) |

### Cluster 9 — Borders & outline patterns
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P017 | border-transparent | Prefer `border-color: transparent` over `border-width: 0`/`.border-0` to hide borders while keeping them restorable; use `outline` as a last resort. | — | Keep (Preference) |
| P019 | outline-base | Use `btn-outline-{variant}` + `border-color: transparent` as a behavioral base for borderless interactive elements that still need full interaction states. | P017 | Keep, adjacent to P017 |
| P021 | outline-text-color | `btn-outline-*` sets text to the variant color, not body color — override explicitly on cells/list items where body text is expected. | P019 | Keep, adjacent to P019; Gotcha candidate |

### Cluster 10 — Color & accessibility
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P034 | contrast-all-states | Maintain ≥4.5:1 text contrast through every interaction state, not just rest. | — | Keep (Verification) |
| P035 | no-color-alone | Use a non-color attribute as the primary state differentiator (WCAG 1.4.1 + Bootstrap semantic-color conventions). | — | Keep (Fact/Conditional) |

### Cluster 11 — Icons & CSS-native visuals
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P022 | bs-icons | Prefer Bootstrap Icons (`<i class="bi bi-*">`) over inline SVG when an equivalent exists. | — | Keep (Preference) |
| P023 | css-native-visual | Don't add a JSX icon alongside a Bootstrap CSS-native visual (pseudo-element/background-image) — remove the JSX icon instead. | — | Keep (Conditional); Gotcha candidate |
| P024 | caret-flip | Rotate carets 180° on open via `transform`; for `background-image`-based carets (e.g. `.form-select`), swap the CSS custom property instead since `transform` has no effect on background images. | P042 | Keep, adjacent to P042 (cross-cluster ref) |

### Cluster 12 — Interactive element basics
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P011 | cursor-pointer | Add `cursor: pointer` explicitly to non-native interactive elements (`<div>`/`<span>`), since only `<a>`/`<button>` get it for free. | — | Keep (Fact); possible Gotcha |
| P027 | btn-non-button | Apply `.btn` to any non-`<button>` interactive element for correct cursor/padding/focus/interaction hooks. | — | Keep (Conditional), possibly merge with P011 |
| P028 | btn-sm-dense | Prefer `.btn-sm` over `.btn` in dense/grid-constrained layouts. | — | Keep (Preference) |

### Cluster 13 — SCSS/build config
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P015 | scss-mixins | Use Bootstrap's `$enable-*`-gated SCSS mixins (`box-shadow`, `transition`, `border-radius`, `gradient-bg`) in bridge selectors instead of raw CSS properties, which bypass the project's feature flags. | — | Keep (Conditional); Gotcha candidate; partial deterministic-check candidate (grep raw properties in bridge file) |
| P033 | verify-scss-vars | Verify a Bootstrap SCSS variable exists and resolves to the expected value before using it — names can be misleading. | — | Keep (Verification); **strong deterministic-rule candidate** |
| P018 | postcss-scope | Scope Bootstrap via `postcss-prefix-selector` (post-compile), never SCSS nesting (breaks Bootstrap's compiled sibling selectors). | — | Is this a per-component principle or one-time build config already implemented? Flag for discussion; Gotcha candidate |
| P005 | bundle-isolation | Storybook's shared CSS bundle requires a story-glob filter for isolation — `@layer` and comment-outs are insufficient. | P004, P009 | Same question as P018 — infra fact vs. active principle |

### Cluster 14 — Portals & overlays
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P025 | hardcode-show | Hardcode `.show` on Bootstrap overlay elements since React Aria (not Bootstrap JS) controls mount/unmount visibility; apply via TSX `className` for portal elements, not bridge CSS. | P052 | Keep, adjacent to P052; Gotcha candidate |
| P049 | rac-trigger-width | Consume RAC's `--trigger-width` custom property to match dropdown width to trigger width. | P052 | Keep, adjacent to P052 |
| P052 | portal-no-ancestor-sel | RAC overlay elements (Popover, Modal, Tooltip) render in DOM portals — ancestor bridge selectors silently never match; scope via attributes on the portal element itself instead. | P049, P025 | Keep as the umbrella principle for this cluster; strong Gotcha candidate |

### Cluster 15 — Focus management
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P051 | programmatic-focus-visible | Programmatic `.focus()` calls trigger the browser's `:focus-visible` regardless of input mode — suppress unconditional `:focus` outline and restore only on `[data-focus-visible]` for genuine keyboard nav. | — | Keep; strong Gotcha candidate (undetectable by pixel-diff, per its own text) |

### Cluster 16 — Stories Conventions
| ID | Slug | Restatement | Cross-refs out | Initial hypothesis |
|----|------|--------------|-----------------|---------------------|
| P029 | argtypes-control | Configure `argTypes` explicitly for string-union props (inline-radio for 2-5 values, select for 6+) rather than relying on auto-inferred free text. | — | Keep (Conditional); deterministic-rule candidate |
| P030 | layout-variants-story | One "Layout Variants" story showing all non-default permutations side by side, not one story per permutation. | — | Keep (Preference) |
| P031 | state-stories | Separate stories for Disabled/Invalid/WithDescription where applicable. | — | Keep (Conditional) |
| P032 | title-case-labels | Title-case Variants story labels — never raw lowercase prop strings. | — | Keep; deterministic-rule candidate |
| P047 | presentation-import | Mirror stories must explicitly `import '../presentation.scss'` since the pixel-diff script renders stories in isolation without the normal import chain. | — | Keep (Verification); deterministic-rule candidate |
| P048 | no-inline-style | No inline `style=` except two documented story-harness exceptions (overlay `minHeight` reservation, `position: static` override), each requiring an inline comment. | P041 | Keep (Verification); deterministic-rule candidate (with exception list) |
| *(unnumbered)* | mapping-not-found-fallback | When no Bootstrap equivalent can be identified: log to the Unmapped appendix and list alternatives considered. | — | Candidate for Template 6 (Procedural/Fallback) or keep as free-form appendix instructions |

---

## Decision Log

*(Populated cluster-by-cluster during Stage B live review. Format per entry: Old ID(s) → New ID | Action | Template | Cross-refs resolved | Notes)*

### Cluster 1 — Selector & specificity mechanics (done 2026-07-12)
- **P001 (compound-sel)** → ID unchanged for now (renumbered in Stage E) | Kept, standalone, rewritten as **Conditional** | No cross-refs (mentions P002 as the mechanism to satisfy it, adjacent in same section) | Moved into new "Selector & Specificity Mechanics" section.
- **P002 (class-in-tsx)** → ID unchanged | Kept **standalone** (not merged into P001 — user determined it's the broader general mechanism for writing `className` at all, not specific to P001's compound-selector rationale) | Rewritten as **Conditional**; interpolation trap split out | Cross-ref to P046 (plain-string branch) kept as pointer — P046 not yet reviewed (Cluster 4), relationship flagged for that review.
- **P013 (prefer-component-cls)** → ID unchanged | Kept, rewritten as **Preference/Trade-off** | No cross-refs | Moved into same new section, adjacent to P001/P002.
- **G010 (className-callback-interpolation)** → split out of P002 | New **Gotcha**, added to `SKILL.md` | — | First entry in SKILL.md's new Gotchas section.

---

## Gotcha Candidates for SKILL.md (running list — confirmed during Stage B, not final until Stage C)

- **G010 — className-callback-interpolation** (from P002) — confirmed and already written into `SKILL.md`.

## Deterministic-Rule Candidates (running list — confirmed during Stage B, finalized Stage D)

*(empty — populated as clusters are reviewed)*
