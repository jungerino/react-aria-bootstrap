# Authoring "Principles" in Claude Agent Skills: Best Practices and a Template Taxonomy

## TL;DR
- **Rewrite your ~50 principles onto 6 standardized templates** — Triggered/Conditional, Preference/Trade-off, Domain-Fact/Definitional, Anti-Pattern/Gotcha, Verification/Checklist, and Procedural/Fallback — because Anthropic's own guidance and the strongest community evidence converge on the same core rules: each entry must be self-contained, lead with an explicit trigger, state the *why* (not all-caps MUSTs), include a concrete example, and earn its token cost.
- **Overlap and verbosity are not cosmetic problems — they measurably degrade reliability.** On IBM's ScaledIF benchmark, instruction-following rate falls sharply as instruction count rises (e.g., Llama-70B from 0.88 with two instructions to 0.66 with ten; Mixtral-8x7B from 0.56 to 0.39), and the paper attributes much of this to "the degree of tension and conflict that arises as the number of instructions is increased." A deduplication/merge pass is therefore the single highest-value action, followed by putting rarely-co-occurring principles behind progressive disclosure so they don't all load at once.
- **Make principle quality testable.** Adopt Anthropic's evaluation-driven loop (baseline without the skill → minimal principle → eval → iterate) and periodic "principle audits" so that entries whose purpose is no longer understood are either re-grounded with a rationale/example or deleted.

## Key Findings

1. **Official Anthropic guidance treats principles as instructions competing for a shared, finite attention budget.** The Skill authoring best-practices page states "The context window is a public good" and that once SKILL.md loads, "every token competes with conversation history and other context." Default assumption: "Claude is already very smart" — only add what Claude doesn't already know. This is the governing principle for pruning verbose entries.

2. **The description field is the retrieval mechanism; principle *bodies* only matter after the skill fires.** Anthropic's skill-creator says all "when to use" info belongs in the description, written in third person and made deliberately "pushy" to combat Claude's tendency to *under-trigger*. Within the body, individual principles need their own explicit in-text triggers so the right one activates at the right moment.

3. **All-caps ALWAYS/NEVER/MUST is an explicit "yellow flag" in Anthropic's own skill-creator.** The verbatim guidance: "If you find yourself writing ALWAYS or NEVER in all caps, or using super rigid structures, that's a yellow flag — if possible, reframe and explain the reasoning so that the model understands why the thing you're asking for is important." The reasoning becomes the rubric for cases the principle didn't anticipate.

4. **"Gotchas" (anti-pattern principles) are the highest-value content in a mature skill.** Anthropic's agentskills.io best-practices guide calls a gotchas list "the highest-value content in many skills" — concrete corrections to mistakes the agent will make without being told, *not* general advice. It also says to keep gotchas in SKILL.md (not a reference file) because "for non-obvious issues, the agent may not recognize the trigger" to load an external file.

5. **Set "degrees of freedom" to match task fragility.** Anthropic's framework: high freedom (prose heuristics) for open-ended tasks with many valid approaches; low freedom (exact scripts, "do not modify this command") for fragile, consistency-critical operations. This maps directly onto your principle types — a "prefer A over B" principle wants explained reasoning (high freedom); a "run this exact verification" principle wants a bare imperative (low freedom).

6. **Redundancy causes measurable failure, and merging is the fix.** IBM's "Boosting Instruction Following at Scale" (arXiv 2510.14842, Elder, Duesterwald & Muthusamy, Oct 2025) shows IF-rate degrades as instruction count grows and identifies *tension and conflict* between instructions as a key driver, formalizing "soft conflicts" and shipping a quantitative conflict-scoring tool; their mitigation ("Instruction Boosting") recovers only "up to 7 points for two instructions and up to 4 points for ten instructions" — i.e., you cannot fully prompt your way out of conflict, you must remove it. HumanLayer's widely-cited CLAUDE.md analysis estimates "Frontier thinking LLMs can follow ~150-200 instructions with reasonable consistency," with "smaller models tend to exhibit an exponential decay… whereas larger frontier thinking models exhibit a linear decay," and notes "Claude Code's system prompt contains ~50 individual instructions" before any of yours are added.

7. **Meta-authoring by Claude has known, documented failure modes.** Community practitioners report exactly your symptoms: bloat that loads every turn, duplication between files, and stale entries. The fix that recurs is a *self-auditing pass* (grep for duplicates, flag entries >1 line that should be sub-files, delete content older than N days) plus a *learnings file* and periodic audits. Anthropic's own remedy for repeated logic: when transcripts show the model "independently wrote similar helper scripts," promote that to a bundled script — the analog for principles is to merge repeated advice into one canonical entry.

8. **Self-contained entries survive context pressure; context-dependent ones rot.** Research on long-horizon agents ("Governance Decay," arXiv 2606.22528) shows constraints decay far less when they are "extractable as a quotable rule" and self-contained (all needed data inline) versus when they depend on unstated context. This is the empirical basis for your requirement that every principle be understandable out of context.

## Details

### A. What the authoritative sources actually say

**Anthropic official (highest priority).**
- *Skill authoring best practices* (platform.claude.com / docs.claude.com): conciseness ("does this paragraph justify its token cost?"); consistent terminology (pick one term and reuse it); concrete not abstract examples; progressive disclosure with SKILL.md as a table of contents; references one level deep; a "conditional workflow pattern" for decision points ("Creating new content? → follow X; Editing? → follow Y"); an "examples pattern" (input/output pairs); a "template pattern" with strict vs. flexible variants; evaluation-driven development (build evals *first*, baseline without the skill, write minimal instructions, iterate); and the Claude-A/Claude-B loop (one instance authors, another tests, observations feed back). Anthropic notes that if a rule isn't being followed, the fix may be to make it "more prominent" or use "stronger language like 'MUST filter' instead of 'always filter'" — i.e., escalate emphasis only where observation shows it's needed.
- *skill-creator SKILL.md* (anthropics/skills, fetched July 8 2026; 485 lines): three-level progressive disclosure — metadata (~100 words, always in context), SKILL.md body (<500 lines ideal), bundled resources (unlimited, load on demand). Directory convention: `scripts/` = executable code for deterministic/repetitive tasks; `references/` = docs loaded as needed; `assets/` = files used in output. "Prefer using the imperative form in instructions." "Try to explain to the model why things are important in lieu of heavy-handed musty MUSTs." Look for "repeated work across test cases" and promote it (verbatim: "If all 3 test cases resulted in the subagent writing a `create_docx.py` or a `build_chart.py`, that's a strong signal the skill should bundle that script"). Make descriptions "pushy" (the dashboard example). Description optimization uses ~20 eval queries (should-trigger + should-not-trigger), run 3× each, up to 5 iterations, selecting on held-out test score to avoid overfitting.
- *agentskills.io best practices* (Anthropic's open Agent Skills standard site): "Add what the agent lacks, omit what it knows." "Design coherent units" (a skill/principle scoped like a well-designed function — neither too narrow nor too broad). "Favor procedures over declarations" (teach *how to approach* a class of problems, not *what to produce* for one instance). "Provide defaults, not menus." The specification "recommends keeping SKILL.md under 500 lines and 5,000 tokens." Gotchas, templates, checklists, validation loops, and plan-validate-execute are named reusable instruction patterns.
- *Engineering blog* — "Equipping agents for the real world with Agent Skills" (progressive disclosure as the core design principle) and "Effective context engineering for AI agents" (curate a "minimal set of tokens"; "curate a set of diverse, canonical examples" rather than stuffing "a laundry list of edge cases"; bloated, ambiguous instruction sets create "ambiguous decision points").

**Community / practitioner (corroborating).**
- Bilgin Ibryam's "Skill Authoring Patterns" (generativeprogrammer.com, Apr 2026) distills 14 patterns; the most relevant to principles are Activation Metadata, Exclusion Clause ("Do NOT use for…"), Explain-the-Why, Template Scaffold, In-Skill Examples, and Known Gotchas.
- HumanLayer "Writing a good CLAUDE.md": keep only universally-applicable instructions; don't send an LLM to do a linter's job; the ~150–200 instruction ceiling.
- Simon Willison: skills are "JIT context injections"; token-efficient because only descriptions load up front; "if a constraint matters, it must be deterministic, not probabilistic" (i.e., prefer hooks/scripts over advisory prose for hard constraints).
- Self-improvement/audit tooling (TerenceBristol/claude-improve, FlorianBruniaux/claude-code-ultimate-guide, the "/slim" self-audit skill) all encode: lead with WHY, use concrete examples, deduplicate across files, and promote recurring patterns to rules only when observed.

**Rule/heuristic taxonomy (theoretical grounding).**
- Classical rule-based/expert-systems literature models knowledge as production rules — condition ("left-hand side") → action ("right-hand side") that "fires" when facts match — plus Clancey's *heuristic classification* (data abstraction → heuristic association → refinement) and the distinction between *definitional*, *hierarchical*, and *heuristic* (uncertain, experiential) associations. This is the intellectual ancestor of the template taxonomy below and validates separating definitional/factual principles from heuristic/preference ones.

### B. Diagnosis of your specific situation

You have ~50 Claude-authored principles for styling React Aria Components with Bootstrap CSS, consumed by sub-agents in a multi-agent Claude Code workflow, suffering overlap, redundancy, verbosity, and orphaned entries. Three structural facts drive the recommendations:

- **Sub-agents start from near-zero context.** A subagent's only inbound channel is the delegation prompt plus any skills named in its `skills:` frontmatter (which are injected in full at startup). So these principles must be *self-contained* — a subagent will not see your main conversation, and cannot infer the intent behind an orphaned rule. This is exactly why entries "whose purpose is no longer understood" are dangerous: if *you* can't reconstruct the rationale, a fresh subagent certainly can't.
- **All ~50 likely load together.** If they live in one skill body that fires as a unit, every principle competes for attention on every styling task, which is precisely the regime where IF-rate degrades. Progressive disclosure (splitting rarely-co-occurring principles into `references/` files loaded on demand) directly counteracts this.
- **Claude authored them iteratively**, which is the documented recipe for verbosity creep and duplication — each session adds a rule without checking whether an existing one already covers it.

The React Aria domain gives natural, real principle content. Per the official React Aria "Styling" docs: React Aria Components expose states as data attributes / ARIA attributes that act like custom pseudo-classes (e.g., `.react-aria-ListBoxItem[data-selected]`, `[data-focused]`, `[data-pressed]`, `data-entering`/`data-exiting` for animations); "When a custom className is not provided, each component includes a default class name following the react-aria-ComponentName naming convention"; and critically, "A custom className can also be specified on any component. This overrides the default className provided by React Aria with your own" (so you must re-add the default: `className="react-aria-Select my-select"`). These map cleanly onto definitional, conditional, and gotcha principle types.

### C. Cross-cutting authoring rules (apply to every principle, regardless of template)

1. **One principle = one coherent idea.** Split any entry that bundles a trigger, three exceptions, and a rationale into atomic entries. Atomic, self-contained rules resist context decay and are dedup-able.
2. **Lead with the trigger, in plain observable terms.** The agent must be able to pattern-match "am I in this situation right now?" Prefer concrete signals ("when styling a React Aria `Button` that renders as a non-native element") over abstract ones ("when appropriate").
3. **State the why.** Replace all-caps imperatives with rule + reasoning, per Anthropic's yellow-flag guidance. The reasoning generalizes to unanticipated cases. Reserve bare imperatives for genuinely fragile, low-freedom steps.
4. **Include one concrete example (and a counter-example for gotchas).** Examples pattern-match better than prose; for CSS, a 2–4 line code snippet is ideal.
5. **Earn the token cost.** Ask "would a competent agent get this wrong without this line?" If no, cut it. Don't explain what a pseudo-class or specificity is.
6. **Assign a stable ID and a category tag.** IDs enable eval references and audit tracking; the category (which template) enforces consistency and surfaces overlap (two "gotcha" entries about the same selector are obviously merge candidates).
7. **Consistent terminology** — pick one term (e.g., always "data-attribute", never alternately "state attribute"/"data prop").
8. **No time-sensitive phrasing**; put superseded advice in an "old patterns" collapsed section rather than inline.

### D. Redundancy / merge methodology (the audit pass)

Do this before rewriting onto templates:
1. **Cluster by target.** Group the 50 by what they act on (selectors/specificity, data-attribute→pseudo-class bridging, Bootstrap SCSS variables, overrides, etc.). Overlaps surface immediately.
2. **Merge within cluster.** Two rules that fire in the same situation and don't conflict → one entry. Two that *conflict* → resolve explicitly (this is the tension IBM's study penalizes) and record the resolution as a preference principle.
3. **Delete orphans that can't be re-grounded.** For each entry whose purpose is unclear: try to reconstruct a trigger + rationale + example. If you can't produce all three, delete it — an un-grounded principle is net-negative (it consumes attention and may misfire). This operationalizes "if you can't explain why, it shouldn't be a rule."
4. **Demote rarely-used principles** to a `references/` file with an explicit load trigger ("Read references/bootstrap-scss-variables.md before referencing any `$`-prefixed Bootstrap variable").
5. **Promote repeated logic to a script** where deterministic (e.g., a script that verifies a Bootstrap SCSS variable exists), mirroring Anthropic's "repeated work across test cases" guidance — this removes whole classes of prose principles.

### E. Testing whether a principle retrieves and applies

- **Golden trigger set per principle:** for each high-value principle, write ~3–5 should-fire and ~3–5 should-not-fire task prompts, following skill-creator's should-trigger/should-not-trigger method (it uses ~20 queries, 3 runs each, ≤5 iterations, scored on held-out cases).
- **Baseline-vs-skill A/B:** run the styling task with and without the principle set; if outputs don't differ on the targeted failure, the principle isn't earning its place.
- **Read transcripts, not just outputs** (Anthropic): watch whether the subagent actually consulted the right principle, wasted time, or ignored a reference file.
- **Regression audit cadence:** re-run the golden set after each editing pass; keep a learnings file recording which principles get rejected/accepted so low-value ones are pruned.

## Recommended Principle Templates (the deliverable)

Standardize on **six** archetypes. Each has a fixed field set. Keep every instance short (target a handful of lines); push long material to `references/`. Use a consistent ID scheme (e.g., `STY-COND-001`).

### Template 1 — Triggered / Conditional ("when X, do Y")
**Fields:** `ID` · `Trigger` (observable condition) · `Action` · `Rationale` · `Example`
**Use when:** behavior depends on a detectable situation. This is the production-rule condition→action form.
**Example:**
> **STY-COND-004 — Bridge data-attributes to pseudo-class styling**
> **Trigger:** Styling an interactive state (hover/press/focus/selected) on a React Aria Component.
> **Action:** Target the component's data-attribute selector (e.g., `[data-hovered]`, `[data-pressed]`, `[data-selected]`) instead of the native CSS pseudo-class (`:hover`, `:active`).
> **Rationale:** Per the React Aria docs, these states "are similar to CSS pseudo classes such as :hover and :active, but work consistently between mouse, touch, and keyboard modalities" — native pseudo-classes miss keyboard/touch paths.
> **Example:** `.react-aria-ListBoxItem[data-selected] { background: var(--bs-primary); }`

### Template 2 — Preference / Trade-off ("prefer A over B, because")
**Fields:** `ID` · `Trigger` · `Preferred` · `Over` · `Rationale` · `Exception`
**Use when:** multiple valid approaches exist and you want a default with reasoning (high-freedom). The rationale is the rubric for edge cases.
**Example:**
> **STY-PREF-002 — Prefer compound selectors over raising specificity artificially**
> **Trigger:** A Bootstrap rule is overriding your React Aria state style.
> **Preferred:** Increase specificity with a compound selector on the component's own default class + data-attribute.
> **Over:** Adding `!important` or an extra wrapper class.
> **Rationale:** Compound selectors keep specificity legible and localized; `!important` creates override cascades that later rules can't cleanly beat.
> **Exception:** Bootstrap utilities that themselves use `!important` may require a matching `!important` — note it inline.

### Template 3 — Domain-Fact / Definitional ("X means Y")
**Fields:** `ID` · `Fact` · `Implication` · `Example`
**Use when:** encoding a non-obvious, stable truth the agent needs to reason correctly. (Clancey's definitional association.) Keep these purely factual — no action verb.
**Example:**
> **STY-FACT-001 — Default class names follow the `react-aria-ComponentName` convention**
> **Fact:** When no custom `className` is provided, each React Aria Component renders a default class of the form `react-aria-<ComponentName>` (e.g., `react-aria-Select`).
> **Implication:** You can style unmodified components with plain CSS using these classes, with no code changes.
> **Example:** `.react-aria-Select { … }` targets every un-classed `<Select>`.

### Template 4 — Anti-Pattern / Gotcha ("you might think X, but Y")
**Fields:** `ID` · `Tempting-but-wrong` · `Why-it-fails` · `Correct-approach` · `Symptom` (how you'd notice)
**Use when:** correcting a predictable mistake. Anthropic calls these the highest-value skill content; keep them in the main body so the agent reads them *before* hitting the situation.
**Example:**
> **STY-GOTCHA-003 — A custom `className` replaces the default, it doesn't add to it**
> **Tempting-but-wrong:** Assume `className="my-select"` keeps the `react-aria-Select` styles and layers yours on top.
> **Why-it-fails:** The React Aria docs are explicit: "A custom className can also be specified on any component. This overrides the default className provided by React Aria with your own." Any base styles keyed to `react-aria-Select` silently stop applying.
> **Correct-approach:** Re-add the default explicitly: `className="react-aria-Select my-select"`.
> **Symptom:** Base component styling disappears the moment you add a custom class.

### Template 5 — Verification / Checklist ("confirm before proceeding")
**Fields:** `ID` · `Trigger` · `Check` (imperative, verifiable) · `On-failure`
**Use when:** a fragile step needs a validation gate (low-freedom; bare imperative is correct here). Pairs with the validation-loop pattern.
**Example:**
> **STY-VERIFY-001 — Verify Bootstrap SCSS variables exist before use**
> **Trigger:** About to reference a `$`-prefixed Bootstrap variable in SCSS.
> **Check:** Confirm the variable is defined in the project's Bootstrap version (grep the Bootstrap `_variables.scss` or run `scripts/check_scss_var.py <name>`).
> **On-failure:** Use the corresponding CSS custom property (`--bs-*`) or define a local fallback; do not invent a variable name.

### Template 6 — Procedural / Fallback ("do these steps in order; if blocked, escalate")
**Fields:** `ID` · `Trigger` · `Steps` (ordered) · `Fallback` · `Stop-condition`
**Use when:** a multi-step sequence must run in order, or an escalation path is needed. For >3 steps, render as a copyable checklist.
**Example:**
> **STY-PROC-002 — Overriding a Bootstrap component style on a React Aria element**
> **Trigger:** A React Aria Component wrapped in / composed with Bootstrap classes needs a visual override.
> **Steps:** (1) Identify the winning Bootstrap selector via computed styles; (2) write a compound selector on the React Aria default class + relevant data-attribute; (3) match or exceed specificity without `!important`; (4) verify in both keyboard and pointer states.
> **Fallback:** If Bootstrap uses `!important`, match it and add a comment explaining why.
> **Stop-condition:** Style holds across `[data-hovered]`, `[data-focused]`, and `[data-pressed]`.

**Why six and not four:** your four candidate types (conditional, preference, definitional, anti-pattern) cover most entries, but the CSS/verification domain generates enough "confirm before using" and "ordered override procedure" content that Verification and Procedural/Fallback earn their own templates rather than being crammed into Conditional. If you want a smaller set, Verification can fold into Conditional (a check is a conditional action) and Procedural into Preference-adjacent workflow docs — but keeping them distinct makes overlap easier to spot during audits.

## Recommendations

**Stage 1 — Audit and merge (do first, before any rewriting).**
- Cluster the 50 by target; merge non-conflicting same-trigger rules; resolve conflicts explicitly.
- For every orphaned entry, attempt to reconstruct Trigger + Rationale + Example; delete any that fail all three. Benchmark to change course: if merging + deletion doesn't get you under ~25–30 principles in the always-loaded body, keep splitting to `references/`.

**Stage 2 — Rewrite onto the six templates.**
- Tag each surviving principle with a template and a stable ID. Enforce the field set. Convert every all-caps MUST/NEVER into rule-plus-rationale except in Verification principles.
- Move rarely-co-occurring clusters into `references/*.md` with explicit load triggers; keep only universally-relevant principles and all Gotchas in the main body. Target the spec's budget of **under 500 lines and ~5,000 tokens** for the always-loaded SKILL.md body.

**Stage 3 — Wire into the multi-agent workflow.**
- Because subagents get skills injected in full via `skills:` frontmatter, ensure the always-loaded body stays lean and that domain files are named descriptively with one-hop references.
- Make the skill description "pushy" and add an exclusion clause so it fires for React-Aria-plus-Bootstrap styling and *not* for unrelated CSS.

**Stage 4 — Make it testable and self-maintaining.**
- Build a golden trigger set (should-fire / should-not-fire) for your 8–10 highest-value principles; run baseline-vs-skill A/Bs; read transcripts.
- Institute a recurring "principle audit" (e.g., after every N sessions): grep for duplicates, flag any entry that has grown beyond its template, promote repeated ad-hoc fixes into new Gotcha/Script entries, and delete stale ones. Keep a learnings file of accept/reject patterns.
- **Threshold to escalate a principle's emphasis** (from explained-rationale to bold/"MUST"/hook): only when transcripts show the agent repeatedly violating it despite the rationale being present. **Threshold to convert a principle to a script/hook:** when the check is deterministic and the agent reinvents it across runs (e.g., SCSS variable verification).

## Caveats
- **Numeric instruction ceilings are estimates, not laws.** The "~150–200 instructions" figure is HumanLayer's synthesis of limited public research, and IBM's degradation numbers (e.g., Llama-70B 0.88→0.66 across 2→10 instructions) are benchmark-specific to ScaledIF; treat them as directional. Notably, IBM's own positional analysis found "no consistent relationship between IF rates and instruction position" (i.e., no reliable lost-in-the-middle penalty for instructions), so don't over-optimize ordering at the expense of dedup/merge, which has stronger evidence.
- **Some cited sources are community blogs, not peer-reviewed.** The strongest claims here trace to Anthropic's own docs and skill-creator; treat practitioner posts (generativeprogrammer, HumanLayer, Medium guides) as corroborating experience.
- **Skill/Claude Code specifics evolve.** Details like the `skills:` subagent-injection field, `allowed-tools`, and Claude Code's description truncation limits were current as of mid-2026 and may change; re-verify against docs.claude.com / code.claude.com before relying on exact field names.
- **The six templates are a starting standard, not dogma.** Anthropic explicitly favors judgment over rigid structure; if a principle genuinely doesn't fit, that's a signal to reconsider the taxonomy, not to force the entry.
- **React Aria API note:** exact available data-attributes/states are per-component; the examples above are illustrative — verify each component's documented state list when writing a real principle.