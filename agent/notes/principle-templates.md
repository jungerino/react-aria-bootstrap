---
title: Principle Authoring Templates
---

# Principle Authoring Templates

Templates for writing principles in `agent/react-aria-skill/principles.md` and
`agent/mapping-and-references-skill/component-agent.md`. Each template produces a
principle that an agent can evaluate and act on without live behavioral observation.

**Note on structure:** This document contains two layers. The first (Types 1–4
below) is the initial draft taxonomy. The "Revised Taxonomy" section that follows
is the MECE-corrected version produced by auditing the full principle set — it
supersedes the initial draft for any new or revised principles. The initial draft
is retained for reference.

---

## The Underlying Rule

A principle does its work only when:

- The **trigger** is evaluable from the component description, taxonomy, rendered
  DOM structure, or RAC documentation — never from live interaction or visual output.
- The **action** is imperative, specific, and has no behavioral escape hatch.
- The **exception**, if any, is itself evaluable from structure, not from observation.

Any principle where an agent can rationally conclude "I don't see evidence that
this applies" will be skipped whenever proving applicability requires live testing.
The current `principles.md` mixes explanatory voice ("here is what happens and why")
with imperative voice. Explanatory voice produces knowledge but not behavior.

---

## Type 1: Detection Rule

> *If you observe this structure, you must do this. No behavioral observation needed.*

Use for principles triggered by a structural fact about the component: a rendered
element type, a RAC component type present in the sub-element survey, a prop surface
feature, or a DOM pattern. The agent can evaluate the trigger entirely from the
taxonomy file and RAC documentation.

**Examples in current doc:** P051 (programmatic focus), P011 (cursor-pointer),
P024 (caret flip), P014 (data-pressed bridge), P052 (portal ancestor selectors).

```markdown
### P0XX: {slug}

**Trigger:** When [evaluable structural condition — component type, rendered element
type, prop surface feature, or DOM pattern] is present in the component being
implemented...

**Action:** [Specific, imperative instruction. Active voice. No escape hatch.]

[Pattern (include when the action has a non-obvious implementation):]
```scss
/* or tsx */
```

**Why:** [One sentence — the mechanism. Enough to generalize to edge cases, not
so much that it becomes a design essay. This section explains the structural reason
the trigger always implies the action.]
```

**Anti-patterns to avoid:**
- Trigger phrased as observation of live behavior: "when the resulting ring is
  visually incorrect" — delete. The structural condition implies the problem;
  observation is not required.
- Action with an escape hatch: "apply where applicable" or "if needed" — delete.
  If the trigger fires, the action is mandatory.

---

## Type 2: Phase Gate

> *A mandatory audit or action at a named workflow phase. Cannot be deferred or skipped.*

Use for principles that must execute at a specific point in the workflow — not
reactively when a problem surfaces, but proactively before a later step that
makes the check impossible. The phase anchor prevents an agent from concluding
"I succeeded at the next step, so I must have done this correctly."

**Examples in current doc:** P038 (prop audit before implementation), P006
(Bootstrap modifier audit before variant work), P007 (variant set read before
finalizing props).

```markdown
### P0XX: {slug}

**Phase:** [Named phase from `component-agent.md`]
**Run before:** [The specific step within that phase that this gate precedes.]

**Action:**
For each [enumerable item — sub-element, prop, story, etc.]:
1. [Check A — evaluable from structure]
2. [Check B — evaluable from structure]

**If condition met:** [Do X.]
**If condition not met:** [Do Y, or note and continue with explicit acknowledgment.]

**Why:** [One sentence on why this must happen at this phase. Emphasize the ordering
constraint — what becomes undetectable or irreversible if the gate is skipped.]
```

**Anti-patterns to avoid:**
- No phase anchor: a phase gate without a named phase is just a Detection Rule
  with weaker enforcement. If a phase cannot be named, use Type 1 instead.
- Vague enumeration: "check all relevant elements" — name the element types or
  prop categories explicitly so the audit is completable.

---

## Type 3: Selection Rule

> *A decision point exists. The principle constrains which option to choose.*

Use for principles that govern a recurring choice between two or more approaches.
The agent encounters the decision point, evaluates the principle, and picks the
constrained option. The exception condition, if any, must be as evaluable as the
trigger — a judgment-call exception is an escape hatch.

**Examples in current doc:** P017 (`border-color: transparent` over
`border-width: 0`), P026 (`rem` over `em`), P013 (component classes over
utilities), P019 (`btn-outline-*` for borderless interactive elements).

```markdown
### P0XX: {slug}

**Decision point:** When choosing how to [accomplish X — e.g. hide a border,
size an element, scope a bridge selector]...

**Prefer:** [A] — [one-phrase reason this is the safer or more correct choice]
**Avoid:** [B] — [one-phrase reason this causes problems]

**Exception:** Use [B] only when [narrow, evaluable condition].

**Why:** [One sentence — the mechanism that makes A preferable. If the mechanism
is not clear, the agent cannot evaluate edge cases that don't exactly match the
template.]
```

**Anti-patterns to avoid:**
- Exception phrased as a judgment call: "unless A seems disproportionate" — this
  is always true when the agent wants to take the easy path. Make the exception
  evaluable: a specific element type, a specific condition in the taxonomy, or
  "no exception."
- Omitting the exception entirely when one legitimately exists — an agent that
  encounters the exception and has no guidance will either always apply A (wrong)
  or improvise (unpredictable).

---

## Type 4: Universal Constraint

> *Applies everywhere in the workflow, unconditionally. No trigger, no exception.*

Use for invariants that hold across all components, all phases, and all story
types. The value is that the agent cannot construct a "this doesn't apply here"
argument. If an exception exists, use Type 3 instead — an exception makes this
a Selection Rule.

**Examples in current doc:** P001 (retain `.react-aria-*` class always), P048
(no inline `style=` except named story-harness cases — note: the named exceptions
make this closer to Type 3), P025 (hardcode `.show` on Bootstrap overlay elements).

```markdown
### P0XX: {slug}

**Rule:** Always [do X]. / Never [do Y].

[Scope clarification if "everywhere" is narrower than the full workflow:]
This applies in [bridge CSS / component TSX / mirror stories / all contexts].

[Pattern:]
```scss
/* or tsx */
```

**Why:** [One sentence — the mechanism. The scope clarification and mechanism
together define where "always" and "never" apply without requiring a trigger.]
```

**Anti-patterns to avoid:**
- An implied exception buried in the "Why": "...because X causes Y in most cases."
  "Most cases" signals an exception. Surface it explicitly or remove the hedge.
- Scope left implicit: "always add cursor: pointer" without clarifying "on
  non-`<button>`, non-`<a>` interactive elements" produces false positives on
  native elements that already have pointer cursor.

---

## Revised Taxonomy

A MECE audit of all principles across `agent/react-aria-skill/principles.md` and
`agent/mapping-and-references-skill/component-agent.md` found that the initial
four types are neither mutually exclusive nor collectively exhaustive. This section
documents the findings and the corrected taxonomy. Use it when authoring new
principles or reclassifying existing ones.

### What the audit found

**Not mutually exclusive:**

- Phase Gate is a Detection Rule with a timing constraint. The only difference is
  that a Phase Gate fires at a named workflow step rather than whenever the
  structural condition appears. They share the same structure (trigger → mandatory
  action) and can be unified under Detection Rule with an optional `Phase:` field.
- Universal Constraint is a Selection Rule with no exception. P001 ("always retain
  `.react-aria-*`") is equivalent to a Selection Rule that says "when choosing
  whether to include `.react-aria-*`, always include it — no exception." The two
  sit on a continuum rather than being genuinely distinct categories.

**Not collectively exhaustive:**

Two principle types appear in the docs that the initial four types cannot express:

1. **Procedure** — The correct method for a recurring task. No structural trigger
   in the component being worked on; no decision between options; fires whenever
   the task is performed at all. Examples: P002 (how to pass `className` through a
   render-prop callback), P018 (how to scope Bootstrap via postcss-prefix-selector),
   M004 (the three bridge strategies and how to select one), P-010 (how to center
   `position: absolute` overlays in flex containers). Forcing these into Detection
   Rules produces triggers like "when implementing any component" — indistinguishable
   from "always" and therefore useless as a trigger.

2. **Epistemic Guard** — A common but wrong inference an agent will draw from
   apparently sufficient evidence, and the verification step required before
   proceeding. The trigger is an epistemic state ("you believe X because you
   observed Y"), not a structural condition. Examples: P-014 ("`focus` sharing
   tokens with `hover` does not mean they look the same"), P-015 ("Bootstrap's
   compiled CSS is not a complete description of a state's visual appearance"),
   P-016 ("faux-focus indistinguishable from faux-hover is a definitive error
   signal"), P046 ("RAC replaces `className` entirely when a string is provided"),
   P009 ("comment-out is not a clean slate"). These cannot be expressed as
   Detection Rules because there is no structural feature of the component being
   implemented — the trigger is an inference the agent is about to draw.

### Corrected taxonomy

Four types, replacing the initial four:

| Type | Trigger | Template anchor |
|------|---------|-----------------|
| **Detection Rule** | A structural fact in the component, sub-element, or prop surface — including timing-constrained variants (Phase Gate) | "When [structural condition]..." |
| **Selection Rule** | A recurring decision point — including unconditional variants (Universal Constraint) | "When choosing between [A and B]..." |
| **Procedure** | The task itself — fires whenever X is being done, not because of a feature of the component | "To do [X], follow these steps..." |
| **Epistemic Guard** | An apparently sufficient observation that does not actually establish the conclusion | "Evidence [Y] does not imply [X]..." |

These four are mutually exclusive (distinct trigger structures) and collectively
exhaustive across the full principle set in both skill docs.

---

### Detection Rule with Phase field

When a Detection Rule must fire at a specific workflow phase — before a step that
makes the check impossible to perform later — add a `Phase:` and `Before:` line.
This replaces the separate Phase Gate type.

```markdown
### P0XX: {slug}

**Trigger:** When [structural condition]...
**Phase:** [Named phase] — run before [specific step that makes this check moot].

**Action:** [Mandatory. No escape hatch.]

**Why:** [Mechanism + why the phase constraint matters — what becomes undetectable
if the check is deferred.]
```

Examples where the Phase field is needed: P038 (prop audit — must happen before
writing bridge CSS, because absent props won't be noticed once implementation is
done), P050 (reboot audit — must happen before diffing, because diffs won't catch
rules that never fired).

---

### Selection Rule with no exception (replaces Universal Constraint)

When a Selection Rule has no legitimate exception, write the Exception line as
"No exception." Do not omit it — omission leaves the agent room to invent one.

```markdown
### P0XX: {slug}

**Decision point:** When choosing whether / how to [do X]...

**Prefer:** [A]
**Avoid:** [B]
**Exception:** No exception.

**Why:** [Mechanism.]
```

---

## Type 5: Procedure

> *The correct method for a recurring task. Fires whenever the task is performed.*

Use when the principle describes *how* to do something correctly, not *whether* or
*when* to do it. The trigger is the task itself — "you are doing X" — not a
structural feature of the component under implementation. There is no decision
between options; there is one correct method and one or more incorrect ones.

If a trigger beyond "you are doing X" can be named, the principle is probably a
Detection Rule instead.

**Examples in current docs:** P002 (render-prop `className`), P018 (Bootstrap
scoping via postcss-prefix-selector), M004 (three bridge strategies), P-010
(centering `position: absolute` overlays in flex containers).

```markdown
### P0XX: {slug}

**Task:** When [doing X — e.g. passing Bootstrap `className` to a RAC component,
centering an overlay, selecting a bridge strategy for a `data-*` attribute]...

**Method:**
1. [Step A]
2. [Step B]
...

[Pattern:]
```scss
/* or tsx */
```

**Do not:**
- [Common incorrect approach A — and why it fails]
- [Common incorrect approach B — and why it fails]

**Why:** [One sentence — the mechanism that makes the method correct and the
alternatives incorrect.]
```

**Anti-patterns to avoid:**
- Hiding a Procedure inside a Detection Rule by writing a trigger of the form
  "when implementing any component with X" — if X is present in every component,
  the trigger is the task, not a structural condition.
- Omitting the "Do not" section when a plausible-looking wrong approach exists.
  Procedures are written because the wrong approach is tempting; name it.

---

## Type 6: Epistemic Guard

> *A common false inference from apparently sufficient evidence. Requires a
> verification step before proceeding.*

Use when an agent will predictably conclude X from evidence Y, and that inference
is wrong. The trigger is observing Y; the action is a required verification step
before acting on the conclusion. The principle does not describe a structural
feature of the component — it describes an epistemic trap.

**Examples in current docs:** P-014 (same `:focus` tokens as `:hover` ≠ same
visual appearance), P-015 (Bootstrap's compiled CSS ≠ complete visual description
of a state), P-016 (faux-focus visually identical to faux-hover = definitive error
signal), P046 (string `className` on a RAC component ≠ RAC default class is
preserved), P009 (comment-out ≠ CSS rules are gone from the bundle).

```markdown
### P0XX: {slug}

**False inference:** When you observe [Y], you might conclude [X]. This is wrong.

**Why it's wrong:** [One sentence — the mechanism that makes Y insufficient
evidence for X. Be specific about what Y misses.]

**Required verification:** Before concluding [X] and acting on it, verify [Z].

**If Z confirms X:** Proceed.
**If Z does not confirm X:** [What to do instead — typically: include the missing
element in the implementation.]

[Pattern (if the corrective action has a non-obvious implementation):]
```scss
/* or tsx */
```
```

**Anti-patterns to avoid:**
- Framing as a Detection Rule with trigger "when you observe Y" — the Detection
  Rule type implies Y is a structural feature of the component; here Y is an
  agent's epistemic state (a belief formed from evidence). The distinction matters
  because the action is a verification step, not a bridge CSS rule.
- Writing the false inference in passive or hedged voice: "it may appear that..."
  Name the inference directly so the agent recognizes it when it occurs.
- Omitting the falsification criterion. The principle is only actionable if the
  agent knows exactly what to check to confirm or deny the inference.

---

## Diagnostic Checklist

Before publishing a new or revised principle, verify:

**Type classification**
- [ ] Which of the four types is this? If it doesn't fit cleanly, is it compound?
      Compound principles (e.g. Phase Gate trigger + Procedure action) should be
      split or the dominant type should be chosen and the secondary part noted.
- [ ] If classified as a Detection Rule: can the trigger be evaluated from the
      taxonomy file and RAC docs alone, without running the component?
- [ ] If classified as a Selection Rule: is the exception condition evaluable from
      structure — not a judgment call? If no exception exists, is "No exception"
      written explicitly?
- [ ] If classified as a Procedure: is the trigger the task itself ("when doing X"),
      not a structural feature of the component? If a structural feature can be
      named, reclassify as Detection Rule.
- [ ] If classified as an Epistemic Guard: is the false inference named directly
      (not hedged)? Is the falsification criterion specific enough that the agent
      knows exactly what to check?

**Action quality**
- [ ] Does the action contain any word that functions as an escape hatch:
      "if applicable," "where needed," "where incorrect," "as appropriate,"
      "where relevant"? Delete it or replace it with an evaluable condition.
- [ ] Is the action imperative and specific, not descriptive?

**Why section**
- [ ] Does the "Why" explain the mechanism — the structural or logical reason the
      trigger implies the action — not the history of how the principle was
      discovered? History belongs in commit messages and session logs.
- [ ] Is the "Why" short enough that it adds clarity without becoming a design
      essay? One to three sentences is the target.
