---
title: React Aria + Bootstrap Skill — Entry Point
---

# React Aria + Bootstrap Skill

Entry point for the Bootstrap-styling workflow. Maps agent tiers, specifies per-tier file loading, and defines the escalation protocol. Contains no execution details.

---

## Tier Map

| Tier | Agent | Success condition | Terminal phrases |
|------|-------|-------------------|-----------------|
| 0 | Primary (Orchestrator) | Every component has reported `final-stories-done` and the batch report is delivered. | — |
| 1 | Component Sub-Agent | All mirror stories pass the final verification sweep and `verification-sweep-passed` is reported. | `verification-sweep-passed`, `Stuck: {stories}`, `Script failed: {story}`, `Context exhausted`, `EXTRACTED-CSS-GAP: {description}` |
| 1a | Final-Stories Sub-Agent | Standard stories are written and `final-stories-done` is reported. | `final-stories-done` |

---

## Session-Start Loading Instructions

Each tier loads only the files listed for it. Loading files outside your tier is a boundary violation.

**Primary agent (Tier 0):**
- `agent/react-aria-skill/SKILL.md` (this file)
- `agent/react-aria-skill/orchestrator.md`

**Component sub-agent (Tier 1):**
- `agent/react-aria-skill/SKILL.md`
- `agent/react-aria-skill/component-agent.md`
- `agent/react-aria-skill/principles.md`
- `agent/taxonomies/{component}-taxonomy.md` — component taxonomy (incl. `## Decisions` section)
- `agent/bootstrap-kb/README.md` — Bootstrap KB index; then load relevant KB files selectively

**Final-stories sub-agent (Tier 1a):**
- `agent/react-aria-skill/SKILL.md`
- `agent/react-aria-skill/final-stories-agent.md`
- `agent/taxonomies/{component}-taxonomy.md`

`SKILL.md` and `orchestrator.md` are the only files loaded into the primary agent's context at session start. The primary agent does not load `component-agent.md`, `final-stories-agent.md`, or `principles.md`.

---

## Escalation Protocol

**Valid terminal phrases:**

| Phrase | Source | Meaning |
|--------|--------|---------|
| `verification-sweep-passed` | Component sub-agent | All mirror stories passed final verification sweep |
| `final-stories-done` | Final-stories sub-agent | Standard stories written and committed |
| `Stuck: {story1}, {story2}` | Component sub-agent | All stories attempted; listed stories hit stuck threshold; needs user guidance for all at once |
| `Script failed: {story}` | Component sub-agent | Comparison pixel-diff script failed; check the story findings doc |
| `Context exhausted` | Any agent | Agent detected context compression and stopped |
| `EXTRACTED-CSS-GAP: {description}` | Component sub-agent | Cannot proceed without `bootstrap.css` access for a specific gap |
| `Undefined return: {…}` | Any agent | Received a return matching no valid terminal phrase; content included for diagnosis |

**On any non-matching return:** If a child agent's return does not exactly match one of the phrases above — partial output, unclear phrases, progress descriptions — report `Undefined return: {the return, or a one-sentence summary if longer}` to the parent (or user) and stop. Do not read files, run commands, or perform any work before that message.

---

## Gotchas

Corrections to mistakes an agent will predictably make without being told. Loaded by every tier — most entries are CSS/TSX-specific and only actionable by Tier 1, but they're cheap to read and orchestrator-tier agents (0, 1a) benefit from recognizing the symptom if a sub-agent's output looks wrong in one of these ways.

### G010: className-callback-interpolation

**Tempting-but-wrong:** Interpolating the render-prop `className` callback argument directly as if it were the existing class string: ``(className) => `${className} btn` ``.
**Why-it-fails:** The callback argument is the whole `RenderProps` object, not a string — this produces `[object Object] btn`.
**Correct-approach:** Destructure `{ defaultClassName }` from the callback argument: ``({ defaultClassName }) => `${defaultClassName ?? ''} btn`.trim()``.
**Symptom:** The rendered `class` attribute literally contains the text `[object Object]`.

### G020: form-class-no-attach

**Tempting-but-wrong:** Assume a Bootstrap form class (`.form-check-input`, `.form-select`, etc.) will style a React Aria custom control (Checkbox, Radio, Switch, Slider, Select) just by applying it, since the names correspond.
**Why-it-fails:** Bootstrap's form classes target native `<input>`/`<select>` elements directly. React Aria's custom controls hide the native input and render a custom visual element instead — the class has nothing native to attach to.
**Correct-approach:** Replicate Bootstrap's visual outcome on the custom visual element using bridge selectors and Bootstrap CSS variables — don't try to force Bootstrap's class structure onto React Aria's markup.
**Symptom:** Applying the Bootstrap form class produces no visible styling change at all.

### G030: structural-selector-breakage

**Tempting-but-wrong:** Assume Bootstrap's structural selectors — sibling-position pseudo-classes (`:first-child`, `:last-child`), adjacent-sibling combinators (`+`, `~`), and `inherit` — will match and propagate through React Aria's rendered DOM the same way they do in Bootstrap's native markup.
**Why-it-fails:** React Aria inserts intermediate elements (wrappers, headers, hidden inputs, icons) that change what's actually adjacent or positioned first/last — and each mechanism breaks differently:
- **Sibling-position pseudo-classes:** `:first-child`/`:last-child` on a list item fail to match when a header is the actual first child.
- **Adjacent-sibling combinators:** Bootstrap's `.btn-check + .btn` pattern requires the label to be the *immediate* next sibling of the input — if React Aria wraps either element or inserts something between them, `+` never matches at all, even though nothing about first/last position changed.
- **`inherit`:** a value set to `inherit` (e.g. border-radius) picks up whatever the nearest actual parent now is — an inserted section wrapper, not the outer container you intended.
**Correct-approach:** Don't rely on structural selectors firing correctly through React Aria's element tree. For boundary/radius effects, use explicit Bootstrap token values (e.g. `var(--bs-list-group-border-radius)`) in a targeted bridge selector. For sibling-driven state styling, bridge the actual `[data-*]` state attribute directly onto the visual element instead of depending on adjacency.
**Symptom:** A boundary/corner-radius effect lands on the wrong element or nowhere at all; or a state-driven style that depends on a `+`/`~` sibling match (e.g. a checked-state visual) never appears, with no console error to indicate why.

### G040: plain-string-drops-rac-class

**Tempting-but-wrong:** Set `className` to a plain string containing only the target Bootstrap class (e.g. `className="form-select"`), since it looks simpler than the callback form or a fully-spelled literal.
**Why-it-fails:** A plain string *replaces* React Aria's default `.react-aria-{Component}` class entirely — it doesn't add to it. The default class is only used as a fallback when `className` is `undefined`. Any bridge selector written against `.react-aria-{Component}` (the usual pattern) will never match this element.
**Correct-approach:** Either use the render-prop callback form — destructure `defaultClassName` from the callback argument and append to it, e.g. ``({ defaultClassName }) => `${defaultClassName ?? ''} form-select`.trim()`` — to preserve the default class dynamically, or explicitly include it in a literal string: `className="react-aria-Button form-select"`. If the RAC class genuinely isn't needed as a selector (e.g. scoping via `data-trigger` instead), write every bridge rule for that element against the class that's actually present — never assume `.react-aria-{Component}` by habit.
**Symptom:** A bridge rule that should apply to this element (correct selector, correct property values) never takes effect, with no error — because the element's actual class list doesn't include what the selector expects.

### G050: native-active-keyboard-gap

**Tempting-but-wrong:** Assume Bootstrap's native `:active` pseudo-class is sufficient for press-state styling on an element carrying a Bootstrap component class with its own `:active` rule (`.btn`, `.dropdown-item`, `.nav-link`, `.page-link`, `.accordion-button`, and others).
**Why-it-fails:** `:active` fires reliably for mouse and touch press, but not for keyboard activation (Enter/Space on a focused element). React Aria's `usePress` hook sets `[data-pressed]` uniformly across all three input modalities. The gap is invisible to pixel-diff comparison, since a mouse-rendered reference screenshot never exercises the keyboard path.
**Correct-approach:** Bridge `[data-pressed]` to mirror the applied class's real `:active` output values, unconditionally — not just where `:active` seems insufficient. Example for `.btn`:
```scss
.react-aria-Button.btn[data-pressed] {
  color: var(--bs-btn-active-color);
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
  @include box-shadow(var(--bs-btn-active-shadow));
}
```
The same pattern applies to any Bootstrap component class with its own `:active` rule, not just `.btn`.
**Symptom:** Keyboard users pressing Enter/Space see no visual press feedback at all, while mouse/touch users do.

---

## Workflow

For the full branch lifecycle — iteration setup, component work, debrief, and merge — see `agent/iteration-protocol.md`.

For multi-agent batch operation, see `agent/react-aria-skill/orchestrator.md`.
