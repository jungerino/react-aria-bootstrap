# End-to-End Workflow Standardization — Planning Doc

---

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

6. **Create `agent/taxonomies/` directory**
   - Create `agent/taxonomies/` if it does not exist.

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

**Output:** `agent/logs/batch-{N}.md` — the batch log for this run. Created by the primary agent/orchestrator at the start of Stage 3. Serves as both the component list consumed by Stages 4 and 5 and the running log of debrief notes across all iterations. Format:

```markdown
# Batch {N}

## Components

- Button
- Tabs
- ListBox

## Stories

*Populated by Stage 4 orchestrator after each component's reference stories are approved.*

- Button: Default, Disabled, Size Variants
- Tabs: Horizontal, Vertical, Disabled Tab
- ListBox: Single Selection, Multi Selection

## Stage 4

### Iteration 1 — {YYYY-MM-DD}
{outcome and debrief notes}

## Stage 5

### Iteration 1 — {YYYY-MM-DD}
{outcome and debrief notes}
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
- Findings docs (`agent/artifacts/findings/{component}-findings.md`) accumulate across batches as the permanent per-component record. Any broadly applicable pattern discovered during implementation is promoted to a P-code in `principles.md` at debrief time — that is the mechanism for making knowledge available to future agents, not automated file aggregation.

**Note on components worked in prior experiments:**
- Components produced in prior experimental branches (Button, Tabs, ListBox, Calendar, TextField, Select) are throwaway — they will be created anew by this workflow.

---

### Stage 4: Taxonomy + Reference Stories

**Purpose:** Per-component stage run once per batch. For each component, produces a taxonomy doc, a Bootstrap reference story, and pre-extracted CSS for each story. These serve two roles downstream: the taxonomy doc is the mapping specification consumed by Stage 5; the reference story and its extracted CSS are the pixel-diff targets against which Stage 5's mirror stories are compared.

**Skill file:** `agent/mapping-and-references-skill.md` (existing; refactored in Phase 3 per the changes listed below). Single file — the component sub-agent loads it in full at startup. Parts 1–4 of this skill govern taxonomy generation; Parts 5–6 govern reference story construction.

**Architecture:** Two-tier (Tier 0 orchestrator + one Tier 1 component sub-agent at a time).

- **Tier 0 (Orchestrator):** manages batch sequencing; relays Q&A between sub-agents and the user; resumes component sub-agents via `SendMessage`; is the sole point of user contact.
- **Tier 1 (Component sub-agent):** one per component, handles both Phase A (taxonomy) and Phase B (reference stories + CSS extraction) in a single session. Sub-agent transcripts persist across Q&A cycles; the orchestrator resumes them via `SendMessage` after each user-input round.
- **Serial dispatch:** one component sub-agent at a time. Cross-component learning requires each component to complete before the next begins.
- **`SendMessage` dependency:** resumption with preserved context requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` — already set for this purpose (see Appendix A).

**Inputs:**
- `agent/logs/batch-{N}.md` — component list and batch log for this run
- `agent/mapping-and-references-skill.md` — primary instruction set for taxonomy and reference story work
- `agent/bootstrap-kb/` — loaded selectively (README first, then relevant component/state/pattern sections)
- `node_modules/bootstrap/dist/css/bootstrap.css` — compiled CSS; required for selector verification (M007) and reproducing specimen HTML context (P-S002). The KB covers structure and class names but not the mixin-generated selector surface.
- Bootstrap documentation site (`https://getbootstrap.com/docs/5.3/`) — source of reference story HTML; the agent fetches specific component docs pages via WebFetch to obtain example HTML for each story variant
- React Aria MCP — component docs queried by the sub-agent during Phase A
- `stories/react-aria-bootstrap/presentation.scss` — faux-state and layout CSS; sub-agent extends it as needed for new components

**Outputs (per component):**
- `agent/taxonomies/{Component}-taxonomy.md`
- `stories/react-aria-bootstrap/reference/{Component}.reference.stories.tsx`
- `agent/artifacts/reference-css/{Component}-{StoryName}.css` — one file per story, extracted via `scripts/extract-story-css.mjs`

**Human review points:**
1. Answer taxonomy decisions block (surfaced by orchestrator after Phase A)
2. Visual review of reference story in Storybook (approve or provide feedback after Phase B)

**Completion condition:** Taxonomy doc finalized; reference story approved visually; CSS extracted for each story story. All committed before the orchestrator dispatches the next component sub-agent.

---

**Phase A: Taxonomy**

Sub-agent:
1. Query React Aria MCP for the component's variants, states, sub-elements, and props
2. Load Bootstrap KB selectively: README → relevant component, states, and patterns sections
3. Draft taxonomy: map each React Aria variant/state/sub-element to its Bootstrap counterpart, noting bridge strategy; verify selectors against `node_modules/bootstrap/dist/css/bootstrap.css`
4. Identify decisions requiring user input → output terminal phrase `TAXONOMY-DECISIONS-NEEDED` with a structured decisions block

Orchestrator surfaces decisions to user. User answers. Orchestrator resumes sub-agent via `SendMessage` with answers. Multiple Q&A cycles are supported.

Sub-agent (continued):
5. Incorporate answers; finalize taxonomy doc including a `## Decisions` section
6. Write `agent/taxonomies/{Component}-taxonomy.md`
7. Output terminal phrase `TAXONOMY-COMPLETE`

---

**Phase B: Reference Stories**

Sub-agent:
1. Fetch relevant Bootstrap documentation pages via WebFetch to obtain example HTML for each story variant
2. Write reference story at `stories/react-aria-bootstrap/reference/{Component}.reference.stories.tsx`
   - Import `../presentation.scss`
   - Apply `withBootstrap` decorator from `../_decorators`
   - Story title: `Bootstrap Reference/{ComponentName}`
   - Cover all visual states from the taxonomy; use faux-state classes from `presentation.scss` where needed (add new faux-state classes to `presentation.scss` if required)
   - Annotate each story with its Bootstrap docs source URL
3. Output terminal phrase `REFERENCE-STORY-READY-FOR-REVIEW`

Orchestrator prompts user to open Storybook and review. User responds with feedback or approval. Orchestrator resumes sub-agent via `SendMessage`. Multiple review cycles are supported.

*(Same agent session resumed via `SendMessage` after orchestrator Q&A relay — not a new agent dispatch.)*

Sub-agent (continued):
4. Apply feedback; loop back to `REFERENCE-STORY-READY-FOR-REVIEW` until approved
5. For each approved story: run `node scripts/extract-story-css.mjs "Bootstrap Reference/{Component}/{StoryName}"` and save output to `agent/artifacts/reference-css/{Component}-{StoryName}.css`
6. Output terminal phrase `COMPONENT-STAGE-4-COMPLETE`

---

**Taxonomy doc structure** (`agent/taxonomies/{Component}-taxonomy.md`):

The format is defined by the M-codes in `mapping-and-references-skill.md` and has been established through prior experiments (see `agent/reference-stories/*-taxonomy.md` for examples). The implementing agent follows the skill; the spec records the sections for reference only.

```markdown
---
title: {Component} Taxonomy
component: {Component}
iteration: {N}
---

## {Component}

**React Aria root class:** `.react-aria-{Component}`
**Mapping type:** [1:1 | Composite — sub-part → counterpart, ...]

### Sub-parts
[Table: Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes]

### Variants
[Table: Dimension | React Aria | Bootstrap | Authority | Notes]

### State mappings
[Per sub-part: table of data-* attribute | sub-part | Bootstrap equivalent | bridge strategy]
[Pseudo-class audit per sub-part: ACTIVE/INERT classification for each pseudo-class]

### DOM conflicts
[Table: Sub-part | Conflict type (CRITICAL/MAJOR/MINOR) | Bootstrap expects | React Aria renders | Resolution]

### Reference story canvas
[List of stories to write; grid columns; width constraints; layout and rendering notes]

### Confidence
[High/Medium/Low with rationale]

## Decisions
[Resolved user decisions from Q&A — the authoritative record for Stage 5 to consume]
```

---

**Spawn prompt template (orchestrator → component sub-agent):**

```
You are a Tier 1 Component Sub-Agent for the React Aria + Bootstrap taxonomy and reference stories workflow.

Component: {ComponentName}

## Session-start files (read in this order)

1. agent/mapping-and-references-skill.md

## Key paths

| Artifact | Path |
|----------|------|
| Batch log | agent/logs/batch-{N}.md |
| Taxonomy output | agent/taxonomies/{component}-taxonomy.md |
| Reference stories | stories/react-aria-bootstrap/reference/{ComponentName}.reference.stories.tsx |
| Reference CSS | agent/artifacts/reference-css/{component}-{StoryName}.css (one per story) |
| Bootstrap KB | agent/bootstrap-kb/README.md |

## SendMessage resumption

This agent may be paused mid-session for user Q&A. When the orchestrator resumes you via SendMessage, continue from where you stopped — do not re-read session-start files.

## Terminal phrases

Return exactly one of:
- TAXONOMY-DECISIONS-NEEDED: {list of decisions}
- TAXONOMY-COMPLETE
- REFERENCE-STORY-READY-FOR-REVIEW
- COMPONENT-STAGE-4-COMPLETE

mapping-and-references-skill.md is your task definition. Do not derive your steps from this prompt.
```

---

**Skill file changes required for Phase 3** (`agent/mapping-and-references-skill.md`):
- Update all paths per Q6 (reference stories → `stories/react-aria-bootstrap/reference/`, taxonomy docs → `agent/taxonomies/`, extracted CSS → `agent/artifacts/reference-css/`, `presentation.scss` replaces `augments.scss`, `withBootstrap` replaces `withBootstrapTest`)
- Remove KB *generation* content from Part 5 (when to rebuild the KB, which Bootstrap source files to parse) — that content moves to `bootstrap-kb-skill.md`. Retain M003 load sequence and query table in `mapping-and-references-skill.md`.
- Add: explicit instruction to fetch Bootstrap documentation pages via WebFetch for reference story HTML
- Add: `## Decisions` section to taxonomy doc template
- Add: terminal phrase protocol (`TAXONOMY-DECISIONS-NEEDED`, `TAXONOMY-COMPLETE`, `REFERENCE-STORY-READY-FOR-REVIEW`, `COMPONENT-STAGE-4-COMPLETE`)
- Add: `presentation.scss` import and `withBootstrap` decorator usage in reference story template
- Retain: M007's `bootstrap.css` grep instruction for selector verification; P-S002's specimen HTML context requirement
- Update M016: replace `agent/review-iteration-N.md` with `agent/logs/batch-{N}.md`.

---

### Stage 5: Styled Components

**Purpose:** Per-component stage run once per batch. For each component, produces the styled React Aria component implementation, mirror stories for pixel-diff comparison against the Stage 4 reference stories, and final/standard Storybook stories. This is the core engineering work of the workflow: TSX → bridge CSS → mirror stories → self-correcting pixel-diff loop → final verification sweep → standard stories.

**Skill files:** `agent/react-aria-skill/` directory (existing; refactored in Phase 3 — see skill file changes below). Loading is selective by tier:
- **Tier 0** loads: `SKILL.md`, `orchestrator.md`
- **Tier 1** loads: `SKILL.md`, `component-agent.md`, `principles.md`, `agent/taxonomies/{component}-taxonomy.md`, `agent/bootstrap-kb/README.md`
- **Tier 1a** loads: `SKILL.md`, `final-stories-agent.md`, `agent/taxonomies/{component}-taxonomy.md`

**Architecture:** Two-tier serial (same pattern as Stage 4).

Stage 4 and Stage 5 each run in a separate orchestrator session. The batch log (`agent/logs/batch-{N}.md`) is the handoff artifact — the Stage 4 orchestrator populates it; the Stage 5 orchestrator reads it as its primary input.

- **Tier 0 (Orchestrator):** Manages batch sequencing; dispatches one Tier 1 component agent at a time; handles terminal phrase routing (surfaces exceptions to user, resumes agents via `SendMessage`); dispatches Tier 1a after `verification-sweep-passed`; compiles and delivers the batch report. The sole point of user contact.
- **Tier 1 (Component Agent):** One per component. Owns the full per-component lifecycle: Preparation Phase (read inputs + pre-captured reference images) → Phase A (TSX + bridge CSS) → Phase B (mirror stories) → Phase C (comparison loop, self-correction) → Final Verification Sweep.
- **Tier 1a (Final Stories Agent):** Dispatched by the orchestrator after `verification-sweep-passed`. Writes the final/standard Storybook stories. No implementation context needed — receives only taxonomy and story conventions.
- **Serial dispatch:** One Tier 1 agent at a time.
- **`SendMessage` dependency:** `EXTRACTED-CSS-GAP` and `Stuck` handling require the orchestrator to resume a paused component agent with preserved context. Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (see Appendix A).

**Inputs:**
- `agent/logs/batch-{N}.md` — component list and batch log for this run (from Stage 3)
- `agent/taxonomies/{Component}-taxonomy.md` — per-component taxonomy and pre-resolved decisions (from Stage 4)
- `stories/react-aria-bootstrap/reference/{Component}.reference.stories.tsx` — Bootstrap reference stories (from Stage 4)
- `agent/artifacts/reference-css/{Component}-{StoryName}.css` — pre-extracted Bootstrap CSS, one file per reference story (from Stage 4; component agent's primary CSS reference — `bootstrap.css` is structurally blocked per Appendix B Pattern 7)
- `.reference-images/{component}/{story}.png` — reference story screenshots, one per story; captured by the orchestrator during pre-loop setup using `scripts/reference-images.mjs`; read into context by component agent during Preparation Phase
- `src/scss/_bootstrap-bridges.scss` — shared bridge CSS file; component agent appends new rules for this component
- `stories/react-aria-bootstrap/presentation.scss` — faux-state and layout utilities; component agent extends as needed
- `agent/bootstrap-kb/README.md` → relevant KB files loaded selectively per component
- React Aria MCP — `mcp__react-aria__get_react_aria_page` for component documentation

**Outputs (per component):**

| Artifact | Path |
|----------|------|
| Styled component | `src/react-aria-bootstrap/{ComponentName}.tsx` |
| Mirror stories | `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx` |
| Final/standard stories | `stories/react-aria-bootstrap/{ComponentName}.stories.tsx` |
| Component findings doc | `agent/artifacts/findings/{component}-findings.md` |
| Story findings docs | `agent/artifacts/findings/{component}-{story}-findings.md` (one per story) |
| Extracted mirror CSS | `agent/artifacts/mirror-css/{component}-{StoryName}.css` (one per story) |
| Diff images (per pass) | `agent/artifacts/diffs/{component}/{story}/iteration-{N}/` (`diff.png`, `implementation.png`) |
| Bridge CSS (updated) | `src/scss/_bootstrap-bridges.scss` |

**Story title conventions:**

| Story type | Title | File |
|-----------|-------|------|
| Reference (from Stage 4) | `Bootstrap Reference/{ComponentName}` | `stories/react-aria-bootstrap/reference/{ComponentName}.reference.stories.tsx` |
| Mirror | `Bootstrap Mirror/{ComponentName}` | `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx` |
| Final/standard | `Bootstrap/{ComponentName}` | `stories/react-aria-bootstrap/{ComponentName}.stories.tsx` |

**Human review:** Exception-based during implementation; routine at batch completion.

| Trigger | When | User action |
|---------|------|-------------|
| `EXTRACTED-CSS-GAP: {description}` | Comparison loop needs `bootstrap.css` access | Decide whether to permit; orchestrator relays decision via `SendMessage` |
| `Stuck: {story1}, {story2}` | All stories attempted; one or more hit stuck threshold | Provide guidance for each stuck story; orchestrator relays all at once via `SendMessage` |
| `Script failed: {story}` | Comparison script produced no output images | Investigate script failure; restart Storybook if needed |
| Post-batch debrief | After all components complete and batch report delivered | Review all components in Storybook; provide observations |

**Completion condition:** All components have reported `final-stories-done`; orchestrator has compiled and delivered the batch report; post-batch debrief completed.

---

**Preparation Phase (Tier 1 Component Agent)**

Before any implementation, the component agent:

1. **Internalize taxonomy:** Read `agent/taxonomies/{component}-taxonomy.md` in full, especially `## Decisions` — pre-resolved decisions; do not re-derive them.
2. **Query React Aria docs:** Call `mcp__react-aria__get_react_aria_page` for the component. Cross-check: every `data-*` attribute in the docs must appear in the taxonomy's state mappings.
3. **Load Bootstrap KB:** `README.md` → then the relevant component, states, and patterns sections for this component.
4. **Read reference CSS:** Read all `agent/artifacts/reference-css/{component}-{StoryName}.css` files. These contain only the Bootstrap rules that applied to the rendered reference story DOM — they are the primary CSS specification for what to replicate. Read them now, not during the comparison loop.
5. **Review principles:** Read `principles.md` in full. Flag any with structural or sizing implications (P008, P010, P016, P040, P041, P042) — address during TSX/bridge implementation, not at diff time.

6. **Load reference images:** Read all `.reference-images/{component}/{story}.png` files into context — one per story in scope. These were captured by the orchestrator during pre-loop setup using `scripts/reference-images.mjs`. Reference images are static — they don't change during implementation. Read them once here; do not re-read them during Phase C or the Final Verification Sweep.

---

**Phase A: TSX and Bridge CSS (Tier 1 Component Agent)**

**Implement TSX:**
- Apply `className` render-prop pattern (P002) for Bootstrap classes
- Use `variantClassMap` for variant props (P007); read Bootstrap docs before finalizing variants
- Honor all taxonomy `## Decisions` entries
- Apply Bootstrap component classes (P013); reserve utilities for genuine one-off cases
- Address all structural and sizing principles flagged in Preparation Phase

**Write base bridge selectors:**
- Write all bridge selectors in `src/scss/_bootstrap-bridges.scss` (P003)
- Use SCSS mixins for `$enable-*`-gated properties (P015)
- Cover all states in the taxonomy's state mappings; follow Data-* Bridge Rules in `principles.md`

**Create component-wide findings doc:**

Path: `agent/artifacts/findings/{component}-findings.md`

Initialize with an empty Story Registry and Work Log header:

```markdown
---
component: {ComponentName}
iteration: 1
---

## Story Registry

| Story | Status | Iteration | Stuck | Diff% |
|-------|--------|-----------|-------|-------|

## Work Log
```

---

**Phase B: Mirror Stories (Tier 1 Component Agent)**

For each story in scope (derived from the taxonomy's "Reference story canvas" section):

1. **Implement the mirror story** in `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx`:
   - Story names must match reference story names exactly (required for pixel-diff ID matching)
   - Replicate reference story layout: same wrapper classes, same `specimen()` helper pattern, same variant order
   - Cover all visual states from the taxonomy; use faux-state classes from `presentation.scss` (P044)
   - Import `../presentation.scss` directly (P047 equivalent — do not rely on shared bundle loading)

2. **Extract mirror CSS:**
   ```bash
   node scripts/extract-story-css.mjs \
     --story "Bootstrap Mirror/{ComponentName}/{StoryName}" \
     --out   agent/artifacts/mirror-css/{component}-{StoryName}.css
   ```
   Re-run on every implementation iteration — new selectors may be introduced.

3. **Create story findings doc** at `agent/artifacts/findings/{component}-{story}-findings.md`:
   - Front matter: `Status: In review`, `Iteration: 0`, `Stuck: 0`
   - Initialize a session-scoped iteration counter **N = 0** for this story. N determines the `--out` directory for each `compare-stories.mjs` run (`iteration-{N}`). Increment N at the end of every comparison pass, before writing findings. N is durable: if context is compressed, recover the current value from the findings doc front matter (`Iteration:` field).

After all mirror stories are implemented, begin Phase C — Comparison Loop.

---

**Phase C: Comparison Loop (Tier 1 Component Agent)**

**Inception:** Run `compare-stories.mjs` for every story in one pass before making any code changes:

```bash
node scripts/compare-stories.mjs \
  --reference "bootstrap-reference-{component}--{story-name}" \
  --impl      "bootstrap-mirror-{component}--{story-name}" \
  --out       agent/artifacts/diffs/{component}/{story}/iteration-{N} \
  --threshold 0.003
```

Use the current N for each story (initialized to 0 in Phase B). Record exit code and diff% for each story. Stories with exit code 0 are immediately `Pass`. Stories with exit code 1 enter the fix loop.

**Image read rules:**

| Image | Path | When to read |
|-------|------|-------------|
| `reference.png` | `.reference-images/{component}/{story}.png` | Once during Preparation Phase. Never again. |
| `diff.png` | `agent/artifacts/diffs/{component}/{story}/iteration-{N}/diff.png` | On any failure. Re-read after each fix attempt. |
| `implementation.png` | `agent/artifacts/diffs/{component}/{story}/iteration-{N}/implementation.png` | On any failure, when `diff.png` alone doesn't show what's rendering. |

**Fix loop** (per failing story, repeat until Pass or Stuck threshold):

```
read diff.png
  → describe what is visible: which specimen, which anatomical region, visible red
  → compare reference-css vs. mirror-css: rules in reference absent from mirror are candidates for missing bridge rules or missing className
  → apply fix to bridge CSS and/or mirror TSX
  → re-run extract-story-css.mjs for this story (keep mirror CSS current)
  → increment N; re-run compare-stories.mjs with --out agent/artifacts/diffs/{component}/{story}/iteration-{N}
    → exit 0: mark Pass; update findings doc (record N); done with this story
    → exit 1: read diff.png; read implementation.png if diff.png alone doesn't show what's rendering; continue loop
  → if fix cannot be identified:
      → increment Stuck counter
      → if Stuck >= threshold (default 3): mark story `Stuck` in Story Registry and findings doc front matter; move to next story
  → write iteration block to findings doc after every pass (pass or fail); record N in iteration header
```

**After all stories processed:** If any stories are marked `Stuck`, output terminal phrase `Stuck: {story1}, {story2}` (comma-separated list of stuck story names) and stop. The orchestrator surfaces all stuck stories to the user at once, collects guidance, then resumes this agent via `SendMessage` with guidance for all of them. The agent then retries the stuck stories. Once no stories remain `Stuck`, proceed to the Final Verification Sweep.

**Reference CSS vs. mirror CSS comparison (mandatory):** On every iteration, compare `agent/artifacts/reference-css/{component}-{StoryName}.css` (target) against `agent/artifacts/mirror-css/{component}-{StoryName}.css` (current implementation). Rules present in the reference CSS but absent from the mirror CSS are candidates for missing bridge rules or missing className assignments.

**Extracted CSS gap protocol (EXTRACTED-CSS-GAP):**

When a property or selector cannot be found in the pre-extracted reference CSS and `bootstrap.css` access is needed to proceed:

1. **Log immediately** — append an "Extracted CSS Gaps" entry to `agent/artifacts/findings/{component}-findings.md`: what selector/property was searched for, which extracted file was consulted, why it was insufficient.
2. **Output terminal phrase:** `EXTRACTED-CSS-GAP: {one-line description of what's missing and why}` — stop.
3. **Wait for permission** — orchestrator surfaces to user; user decides whether to allow access. Orchestrator resumes via `SendMessage` with the decision.

See Appendix B Pattern 7 for the enforcement mechanism.

**Shared selector changes:** If a fix modifies bridge selectors that could affect other stories, re-run `compare-stories.mjs` for those stories and update their findings docs.

**Spatial diff reasoning, animation exception, prior iteration review, script failure protocol:** Same rules as currently documented in `component-agent.md` (Spatial Diff Reasoning, Animation Exception, Prior Iteration Review, Script failure sections). These carry forward unchanged to the refactored skill file.

**Findings doc updates:**

*Story findings doc* (`agent/artifacts/findings/{component}-{story}-findings.md`) — append an iteration block after every comparison pass:

```markdown
## Iteration {N}

**Diff%:** {value} | **Status:** pass / fail | **Stuck:** {n}

### Specimens

PASS: [specimen labels]

FAIL:
- Specimen [label]: Red at [location]. Fix attempted: [description].

UNRESOLVED:
- Specimen [label]: [describe what is visible but unexplained]
```

Update front matter after each pass:

| Outcome | Status | Iteration | Stuck |
|---------|--------|-----------|-------|
| Pass | `Pass` | N | `0` |
| Fail, improved | `Fail` | N | `0` |
| Fail, no improvement | `Fail` | N | `Stuck++` |
| After a code fix, before re-run | `In review` | — | — |
| Stuck counter reaches threshold | `Stuck` | N | threshold |
| Context compression detected | `Context exhausted` | N | — |
| Script produced no output images | `Script failed` | N | — |

Valid status values: `In review` · `Pass` · `Fail` · `Stuck` · `Context exhausted` · `Script failed`

*Component-wide findings doc* (`agent/artifacts/findings/{component}-findings.md`) — update the Story Registry table and append a Work Log entry after every comparison pass:

```markdown
### {story} — Iteration {N}

**Observations:** (copied from story findings doc FAIL/UNRESOLVED entries)

**Principles consulted:**
- [Cite specific skill principles or component decisions that guided the fix]

**Code changes made:** (or "None — [reason]" if no changes)
- [file:line]: [description]
- Shared selectors modified: [list] → affected stories re-run: [list]
```

---

**Final Verification Sweep (Tier 1 Component Agent)**

After all stories reach `Pass`:

1. **Pre-completion CSS placement check:**
   ```bash
   git diff --name-only $(git merge-base HEAD main)..HEAD | grep 'stories/react-aria-bootstrap/.*\.scss'
   ```
   If any new SCSS files appear under `stories/`, move their bridge rules to `src/scss/_bootstrap-bridges.scss` and delete the story-scoped files.

2. **Run final `compare-stories.mjs` sweep** across all stories with `--threshold 0.003`. This catches regressions from shared-selector changes. Do not re-read `reference.png` — it remains in context from Preparation Phase.
   - If any story fails: re-enter the fix loop (Phase C mechanics) for those stories only, then re-run the full sweep. Repeat until all stories pass.

3. **Report `verification-sweep-passed` to the orchestrator.**

---

**Orchestrator Loop (Tier 0)**

**Delegation manifest:** A markdown table emitted before any dispatch, listing every component in the batch with its initial status. Updated as each component completes. Included in the final batch report. Format:

```
| Component | Status  |
|-----------|---------|
| Button    | pending |
| Select    | pending |
```

```
emit delegation manifest (required before any dispatch)

[pre-loop setup]
  for each component in batch.md:
    create src/react-aria-bootstrap/{ComponentName}.tsx stub (bare React Aria component, no Bootstrap classes)
    create stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx stub:

      import type { Meta, StoryObj } from '@storybook/react';
      import { withBootstrap } from '../_decorators';
      import '../presentation.scss';

      const meta: Meta = {
        title: 'Bootstrap Mirror/{ComponentName}',
        decorators: [withBootstrap],
        parameters: { layout: 'padded' },
      };
      export default meta;

      type Story = StoryObj<typeof meta>;

      // Placeholder — replaced in Phase B
      export const Placeholder: Story = {};

  restart Storybook (lsof -ti tcp:6006 | xargs kill -9 && yarn storybook &)
  wait for all stub story IDs to appear in index.json

  for each component in batch.md, for each story in the component's `stories:` list in `batch-{N}.md`:
    node scripts/reference-images.mjs \
      --reference "bootstrap-reference-{component}--{story-name}" \
      --out       .reference-images/{component}/{story}.png

for each component in batch (serial):

  dispatch Tier 1 component agent (foreground — wait for terminal phrase)

  on terminal phrase:

    verification-sweep-passed:
      → dispatch Tier 1a Final Stories agent (foreground — wait for terminal phrase)

        on final-stories-done:
          → log completion; update delegation manifest; proceed to next component

        on any other return:
          → surface as Undefined return; stop
          If the failure is recoverable (context exhausted, story format error): user may re-dispatch Tier 1a. The orchestrator resumes from after `verification-sweep-passed` without re-running the component agent.

    EXTRACTED-CSS-GAP: {description}:
      → surface to user: "Component agent cannot proceed without bootstrap.css access.
        Gap: {description}. Approve or deny?"
      → receive user decision
      → resume component agent via SendMessage with: "bootstrap.css access [approved/denied].
        [If approved: you may now read node_modules/bootstrap/dist/css/bootstrap.css for this
        specific gap only. Log the gap and continue. If denied: log the gap, note the limitation,
        and continue with the information available.]"
      → continue waiting for next terminal phrase

    Stuck: {story1}, {story2}:
      → for each stuck story: read agent/artifacts/findings/{component}-{story}-findings.md; extract FAIL/UNRESOLVED entries from the most recent iteration block
      → surface to user: "{component} completed with stuck stories: {list}.
        For each stuck story, include FAIL/UNRESOLVED entries from its most recent iteration block.
        Please provide guidance for each."
      → receive user guidance
      → resume component agent via SendMessage with guidance for all stuck stories
      → continue waiting for next terminal phrase

    Script failed: {story}:
      → surface to user; user restarts Storybook and resolves script issue
      → re-dispatch the same component agent; it recovers current state from the findings doc front matter and Story Registry

    Context exhausted:
      → surface to user; orchestrator re-dispatches the component agent with a checkpoint prompt including the component name, findings doc path, and current story-by-story status from the Story Registry

    Undefined return:
      → surface to user immediately as Undefined return; stop

when all components done:
  compile batch report (delegation manifest + findings summary per component)
  present to user
  conduct post-batch debrief (see below)
```

---

**Post-Batch Debrief**

After the batch report is delivered, the user reviews all implemented components in Storybook and provides observations. The debrief covers both implementation quality and visual comparison methodology.

- The orchestrator conducts the debrief. If context headroom is insufficient at this point, hand off to a fresh agent manually — formalize a handoff protocol only if this becomes a recurring pattern.
- Write each observation to `agent/logs/batch-{N}.md` immediately — before replying. Do not batch, do not defer. Multiple observations in one message → write all before replying. Append under the current stage/iteration heading (format: `## Stage {M} / Iteration {P} — {YYYY-MM-DD}`).
- Both "what to improve" and "what worked well" are in scope. Patterns worth keeping become P-codes in `principles.md` at this step. The user decides which patterns to promote during the debrief. The orchestrator drafts a proposed P-code entry (following the existing numbered format and updating the table of contents in `principles.md`) for user approval. The next available P-code number is determined by reading the table of contents in `principles.md`.
- After the debrief, follow `agent/iteration-protocol.md` for knowledge file updates, component work decision gate, and merge commands.

---

**Dispatch Prompt Template — Tier 1 Component Agent (orchestrator → component agent):**

```
You are a Tier 1 Component Sub-Agent for the React Aria + Bootstrap styled component workflow.

Component: {ComponentName}

## Session-start files (read in this order)

1. agent/react-aria-skill/SKILL.md
2. agent/react-aria-skill/component-agent.md — your complete task definition; follow it exactly
3. agent/react-aria-skill/principles.md
4. agent/taxonomies/{component}-taxonomy.md
5. agent/bootstrap-kb/README.md

## Key paths

| Artifact | Path |
|----------|------|
| Component impl | src/react-aria-bootstrap/{ComponentName}.tsx |
| Mirror stories | stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx |
| Bridge CSS | src/scss/_bootstrap-bridges.scss |
| Presentation CSS | stories/react-aria-bootstrap/presentation.scss |
| Component findings | agent/artifacts/findings/{component}-findings.md |

## Reference inputs (read during Preparation Phase)

| Artifact | Path |
|----------|------|
| Reference stories | stories/react-aria-bootstrap/reference/{ComponentName}.reference.stories.tsx |
| Reference CSS | agent/artifacts/reference-css/{component}-{StoryName}.css (one per story) |

## Terminal phrases

Return exactly one of:
- verification-sweep-passed
- Stuck: {story1}, {story2}  (emitted after all stories attempted; lists all that hit stuck threshold)
- Script failed: {story}
- Context exhausted
- EXTRACTED-CSS-GAP: {one-line description}

component-agent.md is your task definition. Do not derive your steps from this prompt.
```

---

**Dispatch Prompt Template — Tier 1a Final Stories Agent (orchestrator → final stories agent):**

```
You are a Tier 1a Final-Stories Sub-Agent.

Component: {ComponentName}

## Session-start files (read in this order)

1. agent/react-aria-skill/SKILL.md
2. agent/react-aria-skill/final-stories-agent.md
3. agent/taxonomies/{component}-taxonomy.md

## Key paths

| Artifact | Path |
|----------|------|
| Component impl | src/react-aria-bootstrap/{ComponentName}.tsx |
| Final stories | stories/react-aria-bootstrap/{ComponentName}.stories.tsx |

## Terminal phrases

Return exactly one of:
- final-stories-done
```

---

**Terminal Phrase Protocol (Stage 5):**

| Phrase | Source | Meaning |
|--------|--------|---------|
| `verification-sweep-passed` | Tier 1 component agent | All mirror stories passed final verification sweep |
| `final-stories-done` | Tier 1a final stories agent | Standard stories written and committed |
| `Stuck: {story1}, {story2}` | Tier 1 component agent | All stories attempted; listed stories hit stuck threshold; needs user guidance for all at once |
| `Script failed: {story}` | Tier 1 component agent | Comparison script produced no output images |
| `Context exhausted` | Any agent | Agent detected context compression; stopped |
| `EXTRACTED-CSS-GAP: {description}` | Tier 1 component agent | Cannot proceed without `bootstrap.css` access for a specific gap |
| `Undefined return: {…}` | Any tier | Return matched no valid phrase; content included for diagnosis |

---

**Skill File Changes Required for Phase 3** (`agent/react-aria-skill/`):

**SKILL.md:**
- Update tier map: reflect `EXTRACTED-CSS-GAP` as a valid terminal phrase
- Update session-start loading paths: taxonomy → `agent/taxonomies/`, findings → `agent/artifacts/findings/`
- Update terminal phrase table: add `EXTRACTED-CSS-GAP: {description}` and `final-stories-done`
- Remove branch naming section (no longer relevant; branches are now managed at the workflow level)

**orchestrator.md:**
- Update dispatch prompt template: new paths for taxonomy, findings, bridge CSS, story locations, presentation.scss (per above dispatch prompt templates — replace verbatim)
- Add `EXTRACTED-CSS-GAP` and `Stuck` handling to the orchestrator loop — this is a behavioral change, not just a template update: both phrases use `SendMessage` resumption rather than stopping. `EXTRACTED-CSS-GAP` is a mid-run per-request interrupt; `Stuck: {stories}` is an end-of-component report emitted after all stories are attempted, with all stuck stories listed together so the user can provide guidance for all at once
- Add Tier 1a dispatch prompt template (per above)
- Rename `_bootstrap-overrides.scss` → `_bootstrap-bridges.scss` throughout
- Add pre-loop setup section to the orchestrator loop: for each component in batch.md, create stub TSX file and stub mirror story file (using the mirror story stub template in the loop pseudocode above); then restart Storybook and wait for all stub story IDs in index.json before dispatching any component agent

**component-agent.md:**
- Update all paths throughout:
  - `src/bootstrap-test/{ComponentName}.tsx` → `src/react-aria-bootstrap/{ComponentName}.tsx`
  - `stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx` → `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx`
  - `stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx` → `stories/react-aria-bootstrap/{ComponentName}.stories.tsx`
  - `src/scss/_bootstrap-overrides.scss` → `src/scss/_bootstrap-bridges.scss`
  - `stories/bootstrap-test/bootstrap-reference/augments.scss` → `stories/react-aria-bootstrap/presentation.scss`
  - `withBootstrapTest` → `withBootstrap`
  - `agent/reference-stories/{component}-findings.md` → `agent/artifacts/findings/{component}-findings.md`
  - `agent/reference-stories/{component}-{story}-findings.md` → `agent/artifacts/findings/{component}-{story}-findings.md`
  - `agent/reference-stories/reference-css/` → `agent/artifacts/reference-css/`
  - `agent/reference-stories/mirror-css/` → `agent/artifacts/mirror-css/`
  - `agent/reference-stories/{component}-taxonomy.md` → `agent/taxonomies/{component}-taxonomy.md`
- Add step to Preparation Phase: read all reference CSS files (`agent/artifacts/reference-css/{component}-*.css`)
- Add final step to Preparation Phase: read all pre-captured `.reference-images/{component}/{story}.png` files into context (images were captured by the orchestrator during pre-loop setup using `reference-images.mjs`; do not run any script to generate them); note these images must not be re-read during Phase C or the Final Verification Sweep — reference images are static and don't change during implementation, so re-reading wastes context without benefit
- Update Phase C image read rules table: `reference.png` row — "Once at Phase C inception. Never again." → "Once during Preparation Phase. Never again."
- Remove from Phase C inception: the instruction to read `reference.png` after the first pass
- Update Final Verification Sweep: "remains in context from Phase C inception" → "from Preparation Phase"
- Add `EXTRACTED-CSS-GAP` protocol to Phase C (Comparison Loop)
- Update fix loop: replace the existing 'report `Stuck: {story}` to primary agent and stop' behavior with: mark the story `Stuck` in the Story Registry and findings doc front matter, continue to remaining stories, then emit `Stuck: {story1}, {story2}` (all stuck stories listed together) only after all stories have been attempted.
- Make CSS comparison mandatory in the Phase C fix loop: integrate `compare reference-css vs. mirror-css` as a required step between "describe what is visible" and "apply fix" in the fix loop pseudocode; revise the standalone "Reference CSS vs. mirror CSS gap analysis" paragraph to remove its conditional framing ("when the diff alone doesn't pinpoint the cause") — comparison runs on every iteration, not as a fallback
- Update Pre-completion CSS placement check: path filter updated to `stories/react-aria-bootstrap/.*\.scss`
- Update Final Verification Sweep: add regression handling — if any story fails the sweep, re-enter the fix loop for those stories only, then re-run the full sweep; repeat until all pass
- Restructure phases: Preparation Phase retains only step P1 (internalize inputs); P2 (implement TSX) and P3 (write bridge CSS) move into new Phase A; current Phase A (story implementation) becomes Phase B; current Phase B (comparison loop) becomes Phase C. The scaffold-stubs step is removed from component-agent.md entirely — it moves to the orchestrator pre-loop setup.
- Add YAML front matter to the component-wide findings doc initialization template in Phase A: `component: {ComponentName}` and `iteration: 1`; also add a `## Story Registry` heading above the table
- Update hard constraint: bridge rules go in `src/scss/_bootstrap-bridges.scss`
- Remove task ID self-identification command and `**Task ID:**` field from iteration blocks and Work Log entries — task tracking is now via `TaskCreate`/`TaskUpdate` (see Appendix B Pattern 5), not session-path introspection
- Remove `agent/review-iteration-N.md` references (replaced by `agent/logs/batch-{N}.md`)
- Relax `implementation.png` read rule: remove the "only when `diff.png` unchanged" restriction; the agent may read `implementation.png` on any failure when it would be informative
- Update Script failure protocol: remove `reference.png` from the failure condition. Under the new model `compare-stories.mjs` never writes `reference.png`, so its absence is not a script failure. The failure condition should check only for missing `implementation.png` or `diff.png`.

**final-stories-agent.md:**
- Update story path: `stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx` → `stories/react-aria-bootstrap/{ComponentName}.stories.tsx`
- Update story title: `Bootstrap Test/{ComponentName}` → `Bootstrap/{ComponentName}`
- Update taxonomy path: `agent/reference-stories/{component}-taxonomy.md` → `agent/taxonomies/{component}-taxonomy.md`
- Update component impl reference: `src/bootstrap-test/{ComponentName}.tsx` → `src/react-aria-bootstrap/{ComponentName}.tsx`

**workflow.md:**
- Delete this file. The branch lifecycle it documented is now fully covered by `agent/iteration-protocol.md` (rewritten on branch `end-to-end-workflow`). The Visual Comparison Workflow and Self-Review Checklist sections move to `component-agent.md`.
- Remove the `workflow.md` pointer from the bottom of `SKILL.md`.

**principles.md:**
- P047 (`augments-import`): rename `augments.scss` → `presentation.scss`; update import path to `../presentation.scss` (relative to mirror story in `stories/react-aria-bootstrap/mirror/`)
- All `_bootstrap-overrides.scss` references → `_bootstrap-bridges.scss`
- All `stories/bootstrap-test/` references → `stories/react-aria-bootstrap/mirror/`
- `withBootstrapTest` → `withBootstrap`
- `Bootstrap Test Mirror/{ComponentName}` → `Bootstrap Mirror/{ComponentName}` (story title)
- `Bootstrap Test/{ComponentName}` → `Bootstrap/{ComponentName}` (story title)
- `agent/reference-stories/` → `agent/artifacts/` or `agent/taxonomies/` as appropriate

**comparison-agent.md:**
- Deleted on branch `end-to-end-workflow`. No Phase 3 action needed.

**scripts/reference-images.mjs (new script):**
- New script. Accepts `--reference {story-id}` and `--out {path}`. Uses Playwright to screenshot the named reference story rendered in Storybook, reusing the same browser/Storybook connection setup as `compare-stories.mjs`. Before capturing, polls `http://localhost:6006/index.json` until the target story ID appears. Saves a PNG screenshot of the rendered story to the path given by `--out`. No implementation screenshot; no diff output. Run by the orchestrator during pre-loop setup, once per reference story per component.

**scripts/compare-stories.mjs:**
- Does not write `reference.png`. Writes only `implementation.png` and `diff.png` to the `--out` directory.
- Output directory convention: `agent/artifacts/diffs/{component}/{story}/iteration-{N}/`. The caller passes an iteration-specific `--out` path on each invocation; the script creates the directory if it does not exist.

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
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1` | `~/.claude/settings.json` `env` block | Required for `SendMessage`, which the orchestrator uses to resume component sub-agents with preserved context after user Q&A. Already set. Experimental — does not require using the full agent-teams UX. |

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

- Component agent must create `agent/artifacts/findings/{component}-findings.md` before Phase B
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

The component agent's primary Bootstrap CSS reference is the pre-extracted file at `agent/artifacts/reference-css/{component}-{story}.css`. Direct access to `node_modules/bootstrap/dist/css/bootstrap.css` is structurally blocked.

**Enforcement:** Add `Read(node_modules/bootstrap/dist/css/bootstrap.css)` to `disallowedTools` in the component agent's sub-agent definition (or to the project `.claude/settings.json` deny list). The agent physically cannot read `bootstrap.css`; any attempt produces a permission prompt that only the user can approve.

**Gap protocol — when extracted CSS is insufficient:**

1. **Log immediately** — append a "Extracted CSS Gaps" entry to `agent/artifacts/findings/{component}-findings.md` recording: the specific selector or property searched for, which extracted file was consulted, and why it was insufficient.
2. **Signal the orchestrator** — output the terminal phrase `EXTRACTED-CSS-GAP: {description of what's missing}` so the orchestrator can surface it to the user rather than the agent silently proceeding.
3. **Wait for permission** — the deny rule enforces the pause; the user sees the permission prompt and decides whether to allow the `bootstrap.css` read for this specific gap.
