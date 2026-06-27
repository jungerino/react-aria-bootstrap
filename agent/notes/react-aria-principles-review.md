---
title: principles.md — Review Notes
date: 2026-06-26
scope: agent/react-aria-skill/principles.md
---

# `principles.md` Review Notes

Flags organized by category. Proposals are conservative — prefer minimal edits over rewrites.

**Reference consulted:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices (especially "Challenge each piece of information" / conciseness guidance)

---

## Redundancies

### R1 — P002 + P046: className string behavior split across two principles

P002 says "a plain string that includes the RAC class explicitly also works and is simpler (see P046)." P046 says when a string is provided, the default `.react-aria-*` class is dropped entirely. Together they're coherent, but the forward reference in P002 sends the agent to P046 for clarification of a choice P002 is framing as optional. An agent reading P002 alone won't realize that passing a string *requires* manually including the RAC class; P046 makes that mandatory, not optional. The cross-reference casts P046 as a recommendation when it's really a warning.

**Proposal:** In P002, resolve inline: "As an alternative, a plain string works — but the default `.react-aria-*` class is dropped (see P046), so include it explicitly: `className="react-aria-Button btn btn-primary"`."

---

### R2 — P004 + P009: similar opening premise, no explicit bridge

P004: "Comment out (do not delete) conflicting project CSS." P009: "Comment-out is not a clean slate." Read in sequence, these seem contradictory — do the action, then the action is insufficient. The reconciliation is real (P004 is the correct action; P009 warns not to *assume* it fully isolates), but the doc doesn't state it. An agent could interpret P009 as "don't follow P004."

**Proposal:** Open P009 with an explicit bridge: "Commenting out conflicting CSS (per P004) is the correct action, but it does not leave a blank slate. Another story may import the original component…"

---

### R3 — P005 + P009: both describe CSS leaking past comment-out

P005 focuses on Storybook bundle-level leakage (another story importing the original component, which imports its CSS). P009 focuses on property-baseline leakage (other selectors in the same file still matching). These are genuinely distinct scenarios but the underlying concept overlaps. Neither cross-references the other.

**Proposal:** Add a sentence at the end of P005: "Even with the glob filter in place, other imported CSS may still set properties Bootstrap expects to control — see P009." Add a reciprocal note to P009.

---

### R4 — P007: story requirement in wrong section

P007 contains: "Any component with a `variant` prop must have a Variants story showing all supported values side by side." This is a Stories Convention, not a Core Principle. Stories Conventions (P029–P031) are the right home.

**Proposal:** Move this sentence to a new P-code in Stories Conventions (or absorb into P031 as a fourth state-story type), and delete it from P007.

---

### R5 — P021 + P034: same ambiguous advice duplicated

Both end with the same clause: "scope that override to the rest state or extend it across all states so the full interaction state machine maintains sufficient contrast." The `or` presents two options as equally valid without a decision criterion. An agent has no way to choose. This ambiguity appears twice.

**Proposal:** Resolve the ambiguity once (in P034, which owns contrast broadly) and cross-reference from P021. Concrete rule: "Extend the override across all states unless you have verified each interaction-state background separately for contrast."

---

### R6 — P038 trailing sentence repeats itself

P038 ends: "This mirrors P007 (which requires reading Bootstrap docs before finalizing variants): both the React Aria prop surface and the Bootstrap variant set must be read, not remembered." The "must be read, not remembered" clause repeats what the body of P038 already said ("Do not rely on recall").

**Proposal:** Trim to: "This mirrors P007's requirement to read Bootstrap docs before finalizing variants."

---

## Inaccuracies

### I1 — P018 (postcss-scope): describes a technique not in use

P018 provides a detailed guide to using `postcss-prefix-selector` to scope Bootstrap CSS. The project does not use this technique. `postcss-prefix-selector` is absent from `package.json` and all Storybook config files. The project uses a Storybook glob filter (P005) for CSS isolation, not postcss scoping.

An agent reading P018 would attempt to implement `postcss-prefix-selector` in the webpack config — work that is incorrect for this project and would conflict with the existing setup.

**Proposal:** One of:
- Remove P018 entirely if the technique is rejected in favor of the glob approach.
- Or, if postcss-scope remains a future option, prefix clearly: "**Alternative approach (not the current project setup):** If scoping Bootstrap to a wrapper class via CSS is ever needed…"

---

### I2 — Data-* Bridge Rules: "pseudo-classes don't fire" is overstated

Condition #2 for bridging reads: "The element is non-native (e.g., `<div>`, `<td>`) so pseudo-classes don't fire."

`:hover` fires on all elements in all modern browsers, including `<div>` and `<td>`. The blanket claim is incorrect. The "do not bridge" list says ":hover on native elements — use :hover directly," which by implication tells an agent to bridge `data-hovered` on non-native elements. That instruction conflicts with the fact that `:hover` works universally.

The real distinctions are:
- `:focus` / `:active` don't fire reliably on non-native interactive elements without `tabIndex`
- `:disabled` doesn't fire on non-form elements
- `:hover` fires universally — no need to bridge it on any element type

**Proposal:** Replace the blanket claim with specific pseudo-class/element pairs:
> "The element is non-native and the pseudo-class requires native semantics — specifically: `:focus` and `:active` on `<div>`/`<td>` without `tabIndex`; `:disabled` on any non-form element. Note: `:hover` fires on all elements — bridge `[data-hovered]` only when React Aria needs it for keyboard or touch parity."

---

### I3 — P022: bootstrap-icons prerequisite is stale

P022 says: "Prerequisite: `bootstrap-icons` installed (`yarn add bootstrap-icons`) and CSS imported (`import 'bootstrap-icons/font/bootstrap-icons.css'`)."

Both are already in place: `bootstrap-icons ^1.13.1` is in `package.json`; the CSS is globally imported in `.storybook/preview.js`. An agent reading this might redundantly run `yarn add bootstrap-icons`.

**Proposal:** Replace the prerequisite block with: "Bootstrap Icons is installed (`bootstrap-icons ^1.13.1`) and loaded globally via `.storybook/preview.js` — no per-story import needed."

---

### I4 — Appendices: "Empty until iteration 0 completes" is stale

The Pattern Library appendix says "Empty until iteration 0 completes." The Iteration History says "Updated after each experiment-branch debrief." The project is now in batch-1/stage-4 — iteration 0 is long past. Neither appendix has been populated.

**Proposal:** Remove the "iteration 0" language. If the appendices are intentionally empty, say so clearly. If patterns were supposed to be promoted here during debriefs, flag that the debrief protocol wasn't followed and decide whether to backfill or change the protocol. At minimum, replace "Empty until iteration 0 completes" with "No entries yet."

---

## Unclarities

### U1 — P001: "non-conflicting React Aria CSS" is vague

"Retain the `.react-aria-*` class on every element alongside Bootstrap classes for specificity and non-conflicting React Aria CSS."

"Non-conflicting React Aria CSS" does not explain what CSS it refers to or why retaining the class helps. The actual mechanism: React Aria's own CSS targets `.react-aria-*` selectors; keeping those classes means React Aria's base styles continue to function.

**Proposal:** "…for compound-selector specificity and to keep React Aria's own `.react-aria-*` CSS rules active."

---

### U2 — P003: "paste" is imprecise

The example comment says `// paste Bootstrap's .btn:hover rules here`. "Paste" implies verbatim copy, but the agent should replicate the *pattern* using Bootstrap's CSS variables, adapted to the bridge selector — not paste raw rules verbatim.

**Proposal:** Change to `// mirror Bootstrap's .btn:hover rules — use the same CSS variables`.

---

### U3 — P017 vs P019 (and P036): "outline" terminology collision

P017 uses "outline" to mean the CSS `outline` property (as a fallback when `border-width: 0 !important` blocks borders).

P019 uses "outline" to mean Bootstrap's `btn-outline-*` class variants ("btn-outline-{variant} as a behavioral base").

P036 uses "outline" again for the CSS property ("box-shadow not outline for focus rings").

These are different things with the same name. An agent reading across principles will face ambiguity whenever "outline" appears without qualifier.

**Proposal:** Standardize: always write `btn-outline-*` (with hyphens and asterisk) for the Bootstrap class; always write `CSS outline` or `outline property` for the CSS property. Apply consistently across P017, P019, P036, and anywhere else the term appears.

---

### U4 — P021 + P034: "scope OR extend" — no decision criterion

Already noted as R5 (redundancy). The unclarity is: the agent cannot choose between "scope to rest state" and "extend to all states" because no decision rule is given.

**Proposal:** (same as R5) Provide a decision rule: "Extend the override across all states unless you've verified each state individually for contrast."

---

### U5 — P024: when to use `[data-open]` vs `[aria-expanded="true"]`

"Read open state from `[data-open]` on the component root or `[aria-expanded="true"]` on the trigger."

No preference is stated. An agent must guess which to use.

**Proposal:** Add the decision rule: "Prefer `[data-open]` on the component root — it's always set when the overlay is open. Use `[aria-expanded="true"]` on the trigger only when the selector must be scoped to the trigger element itself."

---

### U6 — P026: "where Bootstrap uses em" — no guidance on how to identify

"Only use `em` where Bootstrap itself uses it for intentionally fluid scaling."

No guidance on how to find those cases. In practice, Bootstrap uses `em` in almost no sizing contexts (primarily in a few media query breakpoints and some deprecated patterns).

**Proposal:** "Bootstrap uses `em` in almost no sizing contexts. Default to `rem`. The exception — if Bootstrap's source SCSS for a specific sub-element explicitly uses `em` — is rare enough to check case by case."

---

### U7 — P050: operational step embedded in a principles doc

"During the preparation phase, for each sub-part where element types differ, read `src/scss/vendor/bootstrap-5.3.8/_reboot.scss` and identify rules scoped to the original element type. Apply the invalidated properties explicitly in the bridge."

The "during the preparation phase" instruction is procedural (when and how to act), not conceptual (what the principle means). Principles state the *what* and *why*; the agent's task definition (`component-agent.md`) states the *when* and *how*. This mixes layers.

**Proposal:** Remove the phase instruction. Reframe as a principle: "When a sub-part uses a different element type than Bootstrap's counterpart, read `_reboot.scss` to identify baseline rules scoped to the original type and explicitly apply the invalidated ones in the bridge."

---

### U8 — TOC numbering is non-sequential across sections

- Core Principles: P001–P028
- Extended Principles: P033–P043, P049–P050
- Stories Conventions: P029–P032, P044, P046–P048

Numbers don't follow document section order. P029–P032 (Stories) are numerically between Core (P028) and Extended (P033), but Stories Conventions appear *after* Extended Principles in the body. P045 is missing entirely — no entry in the TOC or body. This creates a gap that could confuse an agent counting principles or inferring structure from numbering.

**Proposal:** Add a note at the top of the TOC: "Numbers are stable identifiers assigned in discovery order — they do not indicate document section order." Separately, clarify whether P045 was intentionally skipped or deleted.

---

## Unnecessary Verbosities

### V1 — P007: internal sentences say the same thing three times

These four sentences in P007 are progressively redundant:
1. "Replace the component library's inherited `variant` type with Bootstrap's variant names"
2. "remove any variant names with no Bootstrap equivalent (e.g. `quiet`, `ghost`, `cta`)"
3. "Do not carry forward component-library-specific variants unless intentionally extending Bootstrap"
4. "the prop contract should reflect what Bootstrap actually provides"

Sentences 3 and 4 restate sentences 1 and 2.

**Proposal:** Condense 1–4 to: "Bootstrap's variant classes are the authoritative prop type — replace the inherited type, drop non-Bootstrap variants (e.g. `quiet`, `ghost`, `cta`), and build a `variantClassMap` for each Bootstrap class."

---

### V2 — P031: rationale for state stories doesn't justify its tokens

"These benefit from independent Controls panel manipulation and make state coverage explicit."

An agent following the convention doesn't need the justification — just the rule.

**Proposal:** Remove this sentence.

---

### V3 — P037: defensive clause is redundant

"This is a visual correctness requirement regardless of whether the underlying Bootstrap component offers multi-selection behavior."

Once the principle is stated, this caveat (anticipating pushback that Bootstrap doesn't support multi-select) is noise.

**Proposal:** Remove this sentence.

---

### V4 — P005: last sentence may age poorly

"Storybook has no native per-story CSS isolation in any current version."

This is both time-sensitive (could become wrong) and already implied by the rest of P005 (which explains exactly why the glob approach is needed). It doesn't add information.

**Proposal:** Remove this sentence.

---

### V5 — P003: redundant example comments

The example has two comments that together over-explain:
```scss
// Example: bridge data-hovered to Bootstrap's :hover styles
.react-aria-Button[data-hovered] {
  // paste Bootstrap's .btn:hover rules here  ← second comment
}
```

One comment is sufficient.

**Proposal:** Keep only the heading comment (or only the inline comment). Drop the other.

---

## Priority Summary

| Flag | Category | Severity | Principle(s) |
|------|----------|----------|--------------|
| postcss-prefix-selector not in use | Inaccuracy | High | P018 |
| "pseudo-classes don't fire" overstated | Inaccuracy | High | Data-* Bridge Rules |
| P022 prerequisite stale | Inaccuracy | Medium | P022 |
| Appendices stale | Inaccuracy | Low | Appendices |
| P002 + P046 className confusion | Redundancy | High | P002, P046 |
| P021 + P034 ambiguous "scope or extend" | Unclarity + Redundancy | High | P021, P034 |
| P004 + P009 contradictory-seeming | Redundancy + Unclarity | Medium | P004, P009 |
| "outline" terminology collision | Unclarity | Medium | P017, P019, P036 |
| P024 `[data-open]` vs `[aria-expanded]` | Unclarity | Medium | P024 |
| P050 operational step in principles | Unclarity | Medium | P050 |
| TOC non-sequential + P045 gap | Unclarity | Low | TOC |
| P007 story req in wrong section | Redundancy | Medium | P007, Stories Conventions |
| P007 internal redundancy | Verbosity | Medium | P007 |
| P003 "paste" imprecise | Unclarity | Low | P003 |
| P001 "non-conflicting React Aria CSS" | Unclarity | Low | P001 |
| P026 no guidance for em cases | Unclarity | Low | P026 |
| P031 rationale | Verbosity | Low | P031 |
| P037 defensive clause | Verbosity | Low | P037 |
| P005 last sentence | Verbosity | Low | P005 |
| P038 trailing clause | Redundancy + Verbosity | Low | P038 |
| P003 double example comments | Verbosity | Low | P003 |
