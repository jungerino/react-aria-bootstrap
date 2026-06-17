# End-to-End Workflow Standardization — Planning Doc

---

## Summary: What We're Trying to Accomplish

You're building a **systematic, agent-driven workflow** for styling React Aria Components with Bootstrap 5 — turning it from an ad-hoc experiment series into a reproducible, well-documented, and teachable process.

The workflow has five stages:

1. **Bootstrap KB** (one-time) — structured knowledge files derived from Bootstrap source
2. **Storybook setup** (one-time) — scaffolding and dark-mode wiring
3. **Component batch** — user selects ~5 components to work on
4. **Taxonomy + Reference Stories** — agent produces per-component taxonomy docs and Bootstrap reference stories (consolidated in the `mapping-and-references` experiment)
5. **Styled Components** — agent implements Bootstrap-styled TSX/CSS and self-corrects via pixel-diff comparison against the reference stories

The workflow is encoded across multiple skills and protocol docs scattered across branches. The experiments have been a long arc of iteration:
- Early work established the principles (`react-aria-skill.md`, P-codes)
- `bootstrap-mapping` gave you the KB and M-codes
- `mapping-and-references` consolidated taxonomy + reference stories into one pass
- The multi-agent experiments (`sub-agent-styling`, `react-aria-skill-refactor`, `flatten-multi-agent-workflow`) failed for architectural reasons (sub-agents can't spawn sub-sub-agents; orchestration added cost and degraded quality)
- `single-threaded-workflow` attempted a clean single-agent model but produced the worst results, attributed to workflow gaps rather than model limitations
- **The current branch** (`end-to-end-workflow`) is a fresh start to consolidate everything properly before the next run

The best results ever came from the single-agent runs in `react-aria-skill-refactor` — a single Tier 1 component agent owning implementation + comparison + self-correction. The goal now is to re-encode that quality in a clean, consistent workflow spec.

---

## Proposal: How We Tackle This

The output of this session should be a **clean, authoritative specification document** for the full end-to-end workflow. That spec becomes the blueprint for updating/creating the skill files.

Three phases:

**Phase 1 — Resolve the biggest ambiguities first (dialogue)**
Before writing anything, we need answers to the structural questions below. These decisions shape everything else — spec-writing before resolving them produces a spec that needs rewriting.

**Phase 2 — Draft the spec section by section (collaborative)**
Working stage by stage through the workflow, I draft each section, you review and correct. We'd structure the spec to cover: inputs, outputs, skill files, templates, directory layout, and naming conventions for each stage.

**Phase 3 — Implement**
Update/create skill files, protocol docs, templates, and directory structure based on the approved spec. (Likely a separate subsequent task, not completed in this session.)

---

## Questions

### Architecture (most consequential)

**Q1. Single-agent or two-tier for the styled components phase?**

The experiments conclusively showed:
- Three-tier is impossible (sub-agents can't dispatch sub-agents)
- Two-tier (orchestrator + component agents) was expensive and quality-degrading
- Single component agent owning the full lifecycle produced the best results

But the current `SKILL.md` still describes a Tier 0 orchestrator for batch processing. Is the orchestrator retained for batch coordination only (launching sequential component agents), or do we go fully single-threaded with no orchestrator at all?

> **Decision: Two-tier.**
>
> - **Tier 0 (Orchestrator):** Manages the batch. Launches one component agent per component (serial or parallel — TBD). Receives completion signals. Handles cross-component coordination.
> - **Tier 1 (Component Agent):** One per component. Owns full lifecycle: TSX → bridge CSS → pixel-diff comparison (runs `compare-stories.mjs` directly) → self-correction loop → findings doc → completion signal.
>
> No Tier 2. The component agent runs comparison directly — this is what `react-aria-skill-refactor` Tier 1 agents did in practice, and produced the best results. Three-tier (orchestrator intermediating between component agents and comparison agents) remains architecturally possible but is not the current target.
>
> **Dispatch order: Serial for now** (simpler; parallel adds orchestrator state complexity). Future exploration: staggered parallel, where the orchestrator starts component N+1 while the user is in the review-and-feedback stage for component N. This requires the orchestrator to track multiple in-flight agents and handle re-dispatch for fixups requested during review.
>
> **Sub-agent opportunities within Tier 1:** See Q1a below.

---

**Q1a. Sub-agent opportunities within the component agent's work**

The component agent's core work — implementation, bridge CSS, and the fix loop — is deeply context-dependent. The fix loop in particular requires continuous reasoning over what was just written and why a fix didn't work. Delegating any of that to a sub-agent breaks the feedback loop, which is exactly what made the `flatten-multi-agent-workflow` comparison agents expensive and quality-degrading.

That said, there are two genuine opportunities at the edges:

**1. Final Verification Sweep (good candidate)**
After the component agent completes Phase B and all stories pass, the final sweep is purely confirmatory — run `compare-stories.mjs` across all stories, report pass/fail. No implementation context is needed. This could be a lightweight sub-agent dispatched by the orchestrator, freeing the component agent's context window from having to persist through to the very end. The component agent would report something like `implementation-complete` and the orchestrator dispatches a verification agent.

**2. Batch reporting (weak candidate)**
After all component agents complete, a reporting agent could aggregate per-component findings docs into a batch-level summary. Low complexity, low value — probably not worth the overhead of a sub-agent.

**Not good candidates:** CSS extraction (fast, part of the fix loop), diff analysis (needs implementation context), story writing (needs full understanding of what was implemented).

> **Decision:** Final Verification Sweep is delegated to a lightweight sub-agent dispatched by the orchestrator after the component agent reports `implementation-complete`. The sweep is purely confirmatory (run `compare-stories.mjs`, report pass/fail) and needs no implementation context — freeing the component agent's context window from persisting to the end.
>
> Batch reporting is not worth the overhead — low value, low complexity, can be done inline.
>
> Everything else (implementation, bridge CSS, fix loop, story writing) stays with the component agent. The fix loop in particular requires continuous reasoning over what was just written; delegating any of it breaks the feedback loop that made `react-aria-skill-refactor` work.

---

**Q2. What is the "Final Stories" concept?**

`SKILL.md` references a "Final-stories sub-agent (Tier 1a)" that writes "standard stories" after mirror stories pass. `end-to-end-rough.md` doesn't mention this phase explicitly. Is this the distinction between "mirror stories" (used for pixel-diff comparison) and "finished component stories" (the actual shipped product)? Or is it something else?

> **Decision:** Confirmed. Two story types:
> - **Mirror stories** (`{ComponentName}.mirror.stories.tsx`, title `Bootstrap Test Mirror/{ComponentName}`): layout-matched pixel-diff targets, not shipped
> - **Final/standard stories** (`{ComponentName}.stories.tsx`, title `Bootstrap Test/{ComponentName}`): the actual shipped Storybook stories with arg tables, controls, and documentation
>
> **Tier 1a (Final-Stories Agent) is retained.** Final story writing is mechanical enough to delegate and the component agent's context is likely heavy by the end of the fix loop. Component agent exits at `verification-sweep-passed`; orchestrator dispatches a fresh Tier 1a agent with taxonomy, implemented component, and story conventions — no diff images or fix-loop history in context.

---

### Scope and output

**Q3. What does the specification document need to cover?**

Does the spec need to be implementable by a future agent reading it cold with no prior context (a complete cookbook), or is it primarily a reference for *us* to guide Phase 3 implementation work?

> **Decision: Complete cookbook.** The spec will be handed to one or more future agents to implement. It must be self-contained — no reliance on experiment history or prior context. Implementation will involve:
> - Refactoring existing skill files (splitting some, merging others)
> - Stitching them into a coherent, consistent end-to-end workflow
> - The spec does not need to reproduce skill file content verbatim — most content already exists and needs refinement, not rewriting. The spec describes target structure, maps existing content to where it belongs, and calls out gaps requiring new content.
> - May require more than one implementation session depending on scope.

---

**Q4. What is the expected output format for skill files?**

The skills-review shows `mapping-and-references-skill.md` as the model for the taxonomy/reference stage, and `agent/react-aria-skill/` as a directory with per-tier files for the implementation stage. Should we maintain that split, unify them, or something else? Put differently: should there be one skill file per workflow stage, or one skill directory for the whole thing?

> **Decision: Roughly one skill per workflow stage; no skill for human-only stages (e.g. "Component batch: user defines batch"). Format decided case-by-case:**
> - **Single file** when the entire content is meant to be loaded in full by whoever uses it
> - **Directory** when content should be loaded selectively — either because multiple consumers need different subsets (e.g. orchestrator vs. component agent), *or* because a single consumer should load sub-files on demand rather than ingesting everything at once (e.g. Bootstrap KB: README first, then specific component/state/pattern files as needed)
>
> Decision rule for implementing agent: *should any consumer load this content selectively rather than all at once?* If yes → directory. If no → file.

---

### IDs and conventions

**Q5. How do we consolidate the ID system?**

Currently there are M-codes (mapping principles), P-codes (styling principles), P-S codes (story construction), P-T codes, and others with inconsistent numbering across files. What's the desired final system — one namespace, separate namespaces per stage, drop IDs entirely in favor of descriptive rule names, or something else?

> **Decision:** Format: `{NS}{NNN}: descriptive-slug` (e.g. `T030: scss-bridge`). Namespaces map to workflow stages:
>
> | Namespace | Stage |
> |-----------|-------|
> | `K` | Knowledge Base generation |
> | `T` | Taxonomy (retaining existing name; `M`-codes become `T`-codes) |
> | `R` | Reference Stories (`P-S` and `P-T` codes become `R`-codes) |
> | `P` | Implementation Principles (existing `P`-codes carry letter forward) |
> | `W` | Workflow / Orchestration (cross-cutting process rules, if needed) |
>
> Numbering: steps of 10 within each namespace (`T010, T020, T030…`), leaving 9 insertion slots between any two codes. Full renumber during implementation — old codes are historical artifacts in review docs, not live references.

---

### Directory structure

**Q6. What are the final canonical paths?**

The rough notes flag several changes needed.

> **Decision:**
>
> **Base terminology:**
> - **react-aria-bootstrap** — the project and its shippable output
> - **reference-stories** — stories built from Bootstrap demo HTML + Bootstrap styles, presented with layout and state-spoofing rules from `presentation.scss`
> - **mirror-stories** — stories built from React Aria components styled with Bootstrap classes + bridge selectors from `_bootstrap-bridges.scss` + layout rules from `presentation.scss`; purpose is visual comparison against reference stories
>
> **Canonical paths:**
>
> | Current | Final |
> |---------|-------|
> | `src/bootstrap-test/` | `src/react-aria-bootstrap/` |
> | `src/scss/_bootstrap-overrides.scss` | `src/scss/_bootstrap-bridges.scss` |
> | `stories/bootstrap-test/` | `stories/react-aria-bootstrap/` |
> | `stories/bootstrap-test/bootstrap-reference/` | *(eliminated — contents move to parent)* |
> | `stories/bootstrap-test/bootstrap-reference/augments.scss` | `stories/react-aria-bootstrap/presentation.scss` |
> | reference stories | `stories/react-aria-bootstrap/reference/` |
> | mirror stories | `stories/react-aria-bootstrap/mirror/` |
> | `agent/reference-stories/{component}-findings.md` | `agent/review/{component}-findings.md` |
> | `agent/review-iteration-3.md` etc. | `agent/review/` |
> | *(no current home)* | `agent/taxonomies/` — per-component taxonomy docs |
>
> **Naming conventions:**
> - Paths use the same vocabulary across `agent/`, `src/`, and `stories/` (no `bootstrap-test`, no `bootstrap-reference`)
> - No `-stories` suffix in directory names within the `stories/` tree (redundant given parent)
> - `presentation.scss` (replaces `augments.scss`) — shared by both reference and mirror stories; lives at `stories/react-aria-bootstrap/` root
> - `_bootstrap-bridges.scss` (replaces `_bootstrap-overrides.scss`) — more accurately describes its role bridging React Aria state attributes to Bootstrap visuals

---

### Content gaps

**Q7. What's missing from the current `mapping-and-references-skill.md`?**

The rough notes say the skill currently combines taxonomy + reference story principles, and that the KB generation skill needs to be separated out. But are there other gaps — things the skill *should* say but doesn't based on what you've learned from the experiments?

> **Decision:** KB generation instructions are absent from `mapping-and-references-skill.md`. Part 5 of that skill covers KB *retrieval* only (M003 load sequence + query table). The full generation instructions exist only as a one-time implementation plan in `bootstrap-mapping:agent/bootstrap-mapping-plan.md` Tasks 1–6 — not as any reusable skill.
>
> **Gap:** A new `agent/bootstrap-kb-skill.md` is needed. Source: Tasks 1–6 of that plan doc. Content covers: two-source rule (SCSS source + compiled CSS); file generation sequence (tokens → utilities → states → components → patterns → README); per-file SCSS sources, frontmatter templates, table structures; compiled-CSS grep step for `states.md`; 31-component list for `components.md`.
>
> **Format:** Single skill file (not a directory) — an agent regenerating the KB loads it all at once.
>
> **Adaptation from plan to skill:** Remove checkbox steps and commit commands. Convert to principles + templates. Add "when to use" guidance (initial build / Bootstrap version upgrade / adding new component entries). Update all path references per Q6 decisions (`_bootstrap-bridges.scss`, etc.).

---

**Q8. Has the extracted-CSS-as-substitute-for-bootstrap.css approach been validated?**

Both the rough notes and the `single-threaded-workflow` entry flag this as needing validation. Is this still an open question, or has it been answered?

> **Decision: Validated, with one known gap and a new compliance pattern.**
>
> `scripts/extract-story-css.mjs` was audited and found to have significant gaps in its original form. The script was updated with a two-pass matching strategy:
> - **Pass 1 — DOM element match:** strips `::pseudo-element` suffixes, then tests each rule against all elements including `document.documentElement` and `document.body`. This captures `:root { --bs-* }` variable declarations (via `documentElement.matches(':root')`) and `body` styles.
> - **Pass 2 — class-pattern match:** collects every CSS class name from story elements and includes any rule whose `selectorText` contains one of those class names as a substring — regardless of dynamic pseudo-class state. This captures `.btn:hover`, `.btn:focus-visible`, `.btn-check:checked + .btn`, and similar rules that Pass 1 cannot match at page-load time.
>
> **Known remaining gap — `@media` wrapper loss:** When recursing into `@media` blocks, inner rules are extracted as bare `CSSStyleRule` text without the enclosing `@media (...)` wrapper. Responsive variants lose their breakpoint context. For Bootstrap component styling (most rules are at root level) this is a minor issue in practice, but an agent might find a rule in the extracted CSS without realising it only applies at a certain breakpoint.
>
> **New compliance pattern:** Extracted CSS is the agent's primary Bootstrap reference; `bootstrap.css` access is deny-listed. See Appendix B, Pattern 7.

---

## Decisions Log

*(Filled in as we work through the questions above)*

| # | Question | Decision | Notes |
|---|----------|----------|-------|
| Q1 | Single-agent vs. two-tier | Two-tier: Tier 0 orchestrator + Tier 1 component agents (one per component, full lifecycle). No Tier 2. Serial vs. parallel TBD. | |
| Q2 | Final stories concept | Mirror stories = pixel-diff targets (not shipped). Final/standard stories = shipped product. Tier 1a retained for final story writing — context load concern on component agent. | |
| Q3 | Spec scope | Complete cookbook for implementing agent(s). Self-contained. Describes target structure + existing content mapping + gaps. Not a verbatim skill file. | |
| Q4 | Skill file format | ~1 skill per stage; no skill for human-only stages. File vs. directory case-by-case: directory when content should be loaded selectively (multiple consumers OR single consumer loading on demand); file when loaded in full. | |
| Q5 | ID system | Format: `{NS}{NNN}: slug`, steps of 10. Namespaces: K (KB), T (Taxonomy), R (Reference Stories), P (Implementation), W (Workflow). Full renumber on implementation. | |
| Q6 | Directory structure | `src/react-aria-bootstrap/`, `stories/react-aria-bootstrap/reference/` + `mirror/`, `agent/taxonomies/` + `agent/review/`. `augments.scss` → `presentation.scss`. `_bootstrap-overrides.scss` → `_bootstrap-bridges.scss`. No `bootstrap-test` or `bootstrap-reference` anywhere. | |
| Q7 | Mapping skill gaps | KB generation absent from `mapping-and-references-skill.md` — only retrieval (M003) is covered. New `agent/bootstrap-kb-skill.md` needed, sourced from `bootstrap-mapping:agent/bootstrap-mapping-plan.md` Tasks 1–6. Single skill file; adapt plan's checkboxes to principles + templates; update Q6 paths. | |
| Q8 | Extracted CSS validation | Validated. Script updated with two-pass strategy (Pass 1: DOM match + `:root`/`body`; Pass 2: class-pattern for pseudo-class and compound selectors). Known gap: `@media` wrapper context lost on extraction. New compliance pattern: extracted CSS is primary reference; `bootstrap.css` deny-listed with gap protocol. | |

---

## Workflow Spec Draft

### Stage 1: Bootstrap Knowledge Base

**Purpose:** One-time setup. Produces `agent/bootstrap-kb/` — six structured knowledge files loaded by agents during the taxonomy phase (Stage 4).

**Skill file:** `agent/bootstrap-kb-skill.md` (single file; an agent regenerating the KB loads it in full)

**Full details:** `bootstrap-mapping:agent/bootstrap-mapping-plan.md` Tasks 1–6 is the authoritative source for KB generation. The skill file to be created in Phase 3 is derived directly from that plan — converting its checkbox steps to principles + templates and updating paths per Q6.

**Primary sources (read-only):**
- Bootstrap SCSS source: `src/scss/vendor/bootstrap-5.3.8/` — authoritative for token names, variable defaults, mixin structure
- Compiled Bootstrap CSS: `node_modules/bootstrap/dist/css/bootstrap.css` — authoritative for the complete selector surface (mixin-generated selectors are only visible here, not in SCSS source)

**Two-source rule:** Both sources must be consulted for every KB file. SCSS source for token names and values; compiled CSS for the selector surface.

**Output files (created in this order):**

| File | Sources | Contents |
|------|---------|----------|
| `agent/bootstrap-kb/tokens.md` | `_variables.scss`, `_root.scss` | All `--bs-*` CSS custom properties; defaults; semantic roles; consuming components |
| `agent/bootstrap-kb/utilities.md` | `_utilities.scss`, `utilities/_api.scss` | All utility classes by category; responsive variants; single vs. multi-property |
| `agent/bootstrap-kb/states.md` | 11 SCSS component files + compiled CSS grep | State catalog; JS mutation catalog; bridge strategy overview |
| `agent/bootstrap-kb/components.md` | All component SCSS files + Bootstrap docs | 31 components: primary classes, modifier classes, DOM structure, JS mutations |
| `agent/bootstrap-kb/patterns.md` | `src/scss/_bootstrap-bridges.scss` + React Aria MCP + Bootstrap docs | DOM conflict register; JS state mutation conflicts; patterns that compose well |
| `agent/bootstrap-kb/README.md` | All 5 above (written last) | Master index; retrieval rules; component/utility/token indexes; completion status table |

**When to use this skill:**
- Initial project setup (KB does not yet exist)
- Bootstrap version upgrade (re-derive all files from new SCSS source)
- New component added to scope (append entry to `components.md` and `patterns.md`; update `README.md` index)

**Inputs:** None from prior stages — Stage 1 is self-contained; all sources are vendor files.
**Outputs:** `agent/bootstrap-kb/` (6 files, complete).
**Human review:** Spot-check README completion table; confirm component count in `components.md` (~31 entries).

**Skill file internal structure** (`agent/bootstrap-kb-skill.md`):

```
# Bootstrap KB Generation Skill

[When to use: initial build / Bootstrap upgrade / adding new component entries]

## Generation Principles
[Two-source rule; file ordering; compiled-CSS-is-authoritative for selectors; etc.]

## File 1: tokens.md
[SCSS sources; frontmatter template; table structure (token | default | semantic role | consuming components); section list]

## File 2: utilities.md
[SCSS sources; frontmatter template; section list with class names derived from SCSS map]

## File 3: states.md
[SCSS sources; compiled-CSS grep command; frontmatter template; State Catalog table; JS State Mutations section; Bridge Strategy Overview section]

## File 4: components.md
[SCSS + Bootstrap docs sources; frontmatter template; per-component template (primary class / modifier classes / JS mutations / expected DOM / sub-elements); list of 31 components]

## File 5: patterns.md
[sources: src/scss/_bootstrap-bridges.scss + React Aria MCP + Bootstrap docs; frontmatter template; Bootstrap Compound Component Patterns section; DOM Conflict Register table; JS State Mutation Conflicts section; Patterns That Compose Well section]

## File 6: README.md  ← write last
[frontmatter template; Retrieval Rules section; Bootstrap Component Index; Utility Category Index; CSS Token Category Index; Cross-Reference Hints; KB Completion Status table]

## Self-Review Checklist
[All 6 files present; every CSS property in _root.scss has a tokens.md entry; compiled-CSS grep was run for states.md; component count ~31; README completion table filled in]
```

**Verification (after implementing the skill and running it):**
```bash
grep -c "^## " agent/bootstrap-kb/components.md   # expect ~31
grep -c "| \`--bs-" agent/bootstrap-kb/tokens.md  # expect 80+
grep -c "^## " agent/bootstrap-kb/states.md       # expect 13+ state sections
ls agent/bootstrap-kb-skill.md                    # skill file exists
grep "bootstrap-kb-skill" CLAUDE.md               # TOC entry present
```

---

### Stage 2: Storybook Setup

**Purpose:** One-time setup. Creates the canonical `stories/react-aria-bootstrap/` directory tree, moves shared files to their Q6 paths, and updates Storybook config to cover all three story categories. After this stage Storybook starts cleanly; no component stories exist yet (expected — they are added in Stages 4 and 5).

**Skill file:** None. This is a short mechanical checklist; the spec below is the complete instruction set.

**Inputs:** None from prior stages — all changes are to existing config and shared files.

**Outputs:**
- `stories/react-aria-bootstrap/` (with `reference/` and `mirror/` subdirectories)
- `stories/react-aria-bootstrap/_decorators.tsx` — moved from `stories/bootstrap-test/_decorators.tsx`, export renamed
- `stories/react-aria-bootstrap/presentation.scss` — moved from `stories/bootstrap-test/bootstrap-reference/augments.scss`
- `.storybook/main.js` — story glob updated
- `.storybook/preview.js` — decorator applied globally

**Human review:** Start Storybook (`yarn storybook`) and confirm the backgrounds switcher correctly toggles Bootstrap light/dark mode. No stories are expected yet.

**Implementation checklist:**

1. **Create directories**
   ```
   stories/react-aria-bootstrap/
   stories/react-aria-bootstrap/reference/
   stories/react-aria-bootstrap/mirror/
   ```

2. **Move and rename `_decorators.tsx`**
   - Source: `stories/bootstrap-test/_decorators.tsx`
   - Destination: `stories/react-aria-bootstrap/_decorators.tsx`
   - Rename the export: `withBootstrapTest` → `withBootstrap`
   - Do not change the implementation — the dark mode mapping works correctly as written; do not alter it.

3. **Move `presentation.scss`**
   - Source: `stories/bootstrap-test/bootstrap-reference/augments.scss`
   - Destination: `stories/react-aria-bootstrap/presentation.scss`
   - Do not change the content.

4. **Update `.storybook/main.js` story glob**
   - Old: `"../stories/bootstrap-test/bootstrap-reference/**/*.stories.@(js|jsx|mjs|ts|tsx)"`
   - New: `"../stories/react-aria-bootstrap/**/*.stories.@(js|jsx|mjs|ts|tsx)"`
   - This single glob covers all three story categories: `reference/`, `mirror/`, and root-level end-product stories.

5. **Update `.storybook/preview.js`**
   - Add import: `import { withBootstrap } from '../stories/react-aria-bootstrap/_decorators';`
   - Add `decorators: [withBootstrap]` to the preview export object.

**Notes:**
- The original `stories/bootstrap-test/` directory is left intact. It will be removed when migration is complete (after Stage 5). Until then it is simply excluded from the story glob.
- `presentation.scss` is NOT added as a global import in `preview.js`. Reference and mirror stories import it directly — end-product stories do not need it.
- Story categories by subdirectory:
  - `stories/react-aria-bootstrap/reference/` — Bootstrap reference stories (static HTML + Bootstrap classes)
  - `stories/react-aria-bootstrap/mirror/` — mirror stories (React Aria + Bootstrap styling; pixel-diff targets)
  - `stories/react-aria-bootstrap/*.stories.tsx` — end-product stories (shipped Storybook stories with controls and docs)

---

### Stage 3: Component Batch

**Purpose:** Human-driven step. The user defines the set of components to work on before the agent workflow begins. No agent skill — the spec below is guidance for the user.

**Skill file:** None. A future skill could help a novice user select sensible batches, but the project doesn't yet have enough empirical data to encode principles for this.

**Inputs:** None from prior stages.

**Output:** `agent/batch.md` — a simple file listing the component names to be processed in this run. The component agent reads this at Stage 5 startup. Format:

```markdown
# Component Batch

- Button
- Tabs
- ListBox
```

**Human review:** n/a — this stage IS the human step.

---

**Batch sizing:**
- Aim for ~5 components per batch. Larger batches overload the component agent's context window and slow iterative learning.

**Selecting for diversity:**
- Choose components that span a range of styling challenge types. A representative first batch might include one component from each of:

  | Challenge type | Examples |
  |---------------|---------|
  | Simple single-element | Button, Link, Badge |
  | Form input (label/input/validation triad) | TextField, NumberField, SearchField |
  | List/collection with selection states | ListBox, Menu, TagGroup |
  | Tab or disclosure (show/hide, active state) | Tabs, Disclosure |
  | No Bootstrap counterpart (custom token CSS) | Calendar, Slider, ColorSwatch |
  | Compound / portal-rendered | Select, ComboBox, Popover |

- Spreading challenge types across a batch surfaces the full range of bridge patterns early and builds reusable knowledge for subsequent batches.

**Sequencing within a batch:**
- Order components simple → complex within the batch. The component agent works serially; discoveries from earlier components (bridge patterns, KB gaps) are available in context when tackling harder ones.

**Cross-batch accumulation:**
- The Bootstrap KB is static — generated once in Stage 1 and not updated during component work unless a gap or error is discovered. When a component agent finds the KB incomplete or incorrect, it flags the gap in its findings doc; those flags are reviewed before the next batch and trigger a targeted KB update if warranted.
- Findings docs (`agent/review/{component}-findings.md`) do accumulate across batches and are the primary vehicle for cross-batch learning. The mechanism for surfacing this knowledge to subsequent agents is specified in Stages 4 and 5:
  - Each findings doc includes a structured "Transferable Knowledge" section (reusable bridge patterns established, anti-patterns to avoid, user decisions that set precedent) — see Stage 5.
  - The taxonomy agent reads findings docs for structurally similar prior components before drafting the taxonomy for a new component — see Stage 4.
  - The intent is that cross-batch knowledge flows through the taxonomy doc, not by having every Tier 1 agent trawl findings docs directly.

**Note on components worked in prior experiments:**
- Components produced in prior experimental branches (Button, Tabs, ListBox, Calendar, TextField, Select) are throwaway — they will be created anew by this workflow.

---

### Stage 4: Taxonomy + Reference Stories
### Stage 5: Styled Components

---

## Implementation Tasks

*(Phase 3 — to be broken out into a separate plan after spec is approved)*

---

## Appendix

### A: Prerequisites

Environment settings and tooling that must be in place before the workflow can run. The spec should include this as a setup checklist for new contributors and implementing agents.

#### Environment settings

| Setting | Value | Where | Why |
|---------|-------|--------|-----|
| `CLAUDE_CODE_ENABLE_TASKS` | `1` | `~/.claude/settings.json` `env` block | Enables Task tools (`TaskCreate`, `TaskUpdate`, etc.) in place of deprecated `TodoWrite` |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1` (future) | `~/.claude/settings.json` `env` block | Required for shared task lists and `SendMessage` between agents; experimental — not needed for current serial two-tier workflow |

#### MCP servers

| Server | Required for |
|--------|-------------|
| `react-aria` MCP | Taxonomy phase — `mcp__react-aria__get_react_aria_page` for component docs |
| `storybook` MCP | Reference story and mirror story validation |

#### Tooling

| Tool | Version / notes |
|------|----------------|
| Storybook | Must be running on port 6006 for CSS extraction and story comparison |
| `scripts/compare-stories.mjs` | Pixel-diff script; must be present on the branch |
| `scripts/extract-story-css.mjs` | CSS extraction script; must be present on the branch |
| Playwright | Required by `compare-stories.mjs` for screenshot capture |

---

### B: Compliance and Enforcement Patterns

Consistent patterns the spec should define and apply across all agent tiers. The goal is structural enforcement — making non-compliance harder than compliance — rather than behavioral prohibition ("you must not…").

#### 1. Success conditions over prohibitions

Frame each agent's role contract as a completion condition, not a list of forbidden actions. Task-completion bias is stronger than prohibition-following.

- **Prohibition (weak):** "You must not run `compare-stories.mjs`."
- **Success condition (strong):** "Your task is complete when you have dispatched a component agent and received `verification-sweep-passed`."

Already applied in `component-agent.md`. Must be consistently applied in all tier files.

#### 2. `disallowedTools` / `tools` in subagent definitions

The parent agent controls each sub-agent's tool roster via frontmatter. This is structural — the sub-agent physically cannot use a denied tool, regardless of motivation.

- Orchestrator sub-agent definition should deny `Bash(node scripts/compare-stories.mjs *)` — physically blocks it from running comparison directly
- Component agent sub-agent definition should deny `Agent` — prevents it from spawning its own sub-agents
- Apply the principle of least capability: each tier gets only the tools it needs

#### 3. Required deliverable artifacts as gate conditions

An agent cannot proceed to its next step without producing a specific artifact. The artifact's existence is verifiable by the orchestrator or the spec.

- Component agent must create `agent/review/{component}-findings.md` before Phase B
- Component agent must append an iteration block to the findings doc after every comparison pass (not batched at end)
- Final-stories agent must produce committed story files before reporting `final-stories-done`

#### 4. Settings.json deny rules

For the hardest constraints — things that must never happen regardless of agent reasoning — add a `deny` rule in `.claude/settings.json`. This is OS-level enforcement that no prompt can override.

Example from prior experiments: `Bash(node scripts/compare-stories.mjs *)` in the deny list for orchestrator sessions.

#### 5. Task tools for pipeline tracking

With `CLAUDE_CODE_ENABLE_TASKS=1`, agents use `TaskCreate` / `TaskUpdate` / `TaskList` instead of `TodoWrite`. Apply as follows:

- **Component agent:** Create a task for each story at Phase A start (`TaskCreate`). Mark `in_progress` when entering the fix loop, `completed` when the story passes. This gives the orchestrator a verifiable record of progress without relying on terminal phrases alone.
- **Orchestrator:** Use `TaskList` to inspect component agent progress; do not rely solely on self-reported terminal phrases.
- **Cross-agent visibility:** Confirmed for Agent Teams (shared task list at `~/.claude/tasks/{team-name}/`). For regular sub-agents (Agent tool), Tasks are session-scoped — the orchestrator cannot directly read a sub-agent's tasks. Terminal phrases remain the primary cross-agent signal; Tasks are a within-agent tracking aid.
- **Future:** When Agent Teams become stable (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`), the shared task list enables the orchestrator to monitor all component agents' task states directly, and `TaskCompleted` hooks can enforce quality gates.

#### 6. Hooks for quality gates (future / Agent Teams)

When Agent Teams are enabled, three hooks can enforce compliance:

- `TeammateIdle`: runs when a teammate is about to go idle. Exit code 2 sends feedback and keeps the teammate working — use to enforce incomplete deliverables.
- `TaskCompleted`: runs when a task is marked complete. Exit code 2 blocks completion — use to enforce quality criteria before a task can be closed.
- `TaskCreated`: runs when a task is created. Exit code 2 blocks creation — use to enforce task naming conventions or required fields.

#### 7. Extracted CSS primacy with gap protocol

The component agent's primary Bootstrap CSS reference is the pre-extracted file at `agent/review/reference-css/{component}-{story}.css`. Direct access to `node_modules/bootstrap/dist/css/bootstrap.css` is structurally blocked.

**Enforcement:** Add `Read(node_modules/bootstrap/dist/css/bootstrap.css)` to `disallowedTools` in the component agent's sub-agent definition (or to the project `.claude/settings.json` deny list). The agent physically cannot read `bootstrap.css`; any attempt produces a permission prompt that only the user can approve.

**Gap protocol — when extracted CSS is insufficient:**

1. **Log immediately** — append a "Extracted CSS Gaps" entry to `agent/review/{component}-findings.md` recording: the specific selector or property searched for, which extracted file was consulted, and why it was insufficient.
2. **Signal the orchestrator** — output the terminal phrase `EXTRACTED-CSS-GAP: {description of what's missing}` so the orchestrator can surface it to the user rather than the agent silently proceeding.
3. **Wait for permission** — the deny rule enforces the pause; the user sees the permission prompt and decides whether to allow the `bootstrap.css` read for this specific gap.

**Known limitation — `@media` wrapper loss:** Extracted CSS includes rules that live inside `@media` blocks but strips the `@media (...)` wrapper. An agent may find a rule in the extracted file without realising it only applies at a specific breakpoint. The gap protocol does not help here — the agent won't know what it doesn't know. Skill files should note this and instruct agents to treat extracted responsive-utility rules with caution.
