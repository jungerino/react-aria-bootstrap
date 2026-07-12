---
title: Workflow Overview
---

# End-to-End Workflow Overview

A summary of the five-stage workflow for producing Bootstrap-styled React Aria components.

---

## At a Glance

| Stage | Name | Who runs it | Runs once or per batch |
|-------|------|-------------|------------------------|
| 1 | Bootstrap Knowledge Base | Agent | Once (re-run on Bootstrap upgrade) |
| 2 | Storybook Setup | Agent | Once |
| 3 | Component Batch | **You** | Per batch |
| 4 | Taxonomy + Reference Stories | Agent (with your review) | Per batch |
| 5 | Styled Components | Agent (with your review) | Per batch |

A **batch** is a set of ~5 components you define in Stage 3. Stages 4 and 5 each run fully through that batch before the next batch begins.

---

## How to Start Each Stage

| Stage | What to say | Agent instruction file |
|-------|-------------|------------------------|
| 1 | "Regenerate the Bootstrap KB" | `agent/bootstrap-kb-skill.md` |
| 2 | "Set up Storybook for the end-to-end workflow" | `agent/set-up-storybook.md` |
| 3 | "Create batch N with components: X, Y, Z" | `agent/define-component-batch.md` |
| 4 | "Run Stage 4 for batch N" | `agent/mapping-and-references-skill/SKILL.md` |
| 5 | "Run Stage 5 for batch N" | `agent/react-aria-skill/SKILL.md` |

For Stages 4 and 5, the agent loads `SKILL.md` first, which specifies which additional files to load per tier.

---

## Stage 1 — Bootstrap Knowledge Base

**Purpose:** Build a structured knowledge base from Bootstrap's source code that agents can query during later stages instead of reading raw Bootstrap files directly.

**What gets produced:** Six files in `agent/bootstrap-kb/`:

| File | Contents |
|------|----------|
| `tokens.md` | All `--bs-*` CSS custom properties |
| `utilities.md` | All utility classes |
| `states.md` | Interactive state selectors (hover, focus, active, disabled, etc.) |
| `components.md` | ~31 components: class names, DOM structure, modifier classes |
| `patterns.md` | DOM conflicts between Bootstrap and React Aria; patterns that compose well |
| `README.md` | Master index and retrieval guide (written last) |

**Two sources, both required:**
- Bootstrap SCSS (`src/scss/vendor/bootstrap-5.3.8/`) — authoritative for token names and variable defaults
- Compiled CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) — authoritative for the full selector surface (mixin-expanded selectors only appear here)

**Your involvement:** Spot-check the README's completion table; confirm component count (~31).

---

## Stage 2 — Storybook Setup

**Purpose:** Create the canonical directory structure and wire up the Storybook config so all three story categories are served from one glob.

**What gets produced:**
- `stories/react-aria-bootstrap/reference/` — Bootstrap reference stories (Stage 4 output)
- `stories/react-aria-bootstrap/mirror/` — mirror stories for pixel-diff comparison (Stage 5)
- `stories/react-aria-bootstrap/*.stories.tsx` — final/shipped Storybook stories (Stage 5)
- `stories/react-aria-bootstrap/_decorators.tsx` — Bootstrap light/dark decorator
- `stories/react-aria-bootstrap/presentation.scss` — shared faux-state and layout CSS
- Updated `.storybook/main.js` and `.storybook/preview.js`

**Your involvement:** Start Storybook and confirm the backgrounds switcher correctly toggles Bootstrap light/dark mode.

---

## Stage 3 — Component Batch (Your Step)

**Purpose:** You decide which components to work on before agents start.

**What to produce:** `agent/logs/batch-{N}.md` — a short file listing the components for this run. The orchestrator populates it with story names and debrief notes as work progresses.

**Guidance:**
- Aim for ~5 components per batch. Larger batches overload agent context.
- Spread challenge types across the batch to surface the full range of bridge patterns early:

| Challenge type | Examples |
|----------------|---------|
| Simple single-element | Button, Link, Badge |
| Form input | TextField, NumberField, SearchField |
| List with selection states | ListBox, Menu, TagGroup |
| Tab or disclosure | Tabs, Disclosure |
| No Bootstrap counterpart | Calendar, Slider |
| Compound / portal-rendered | Select, ComboBox, Popover |

- Order components simple → complex within the batch. The agent builds on discoveries from earlier components when tackling harder ones.

---

## Stage 4 — Taxonomy + Reference Stories

**Purpose:** For each component in the batch, map its React Aria structure to Bootstrap equivalents, then produce a static Bootstrap reference story in Storybook. These two artifacts are the specification that Stage 5 works from.

**Architecture:** Two-tier.
- **Orchestrator** manages the batch sequence and is your sole contact point.
- **Component sub-agent** (one per component) runs both Phase A and Phase B in a single session, pausing for your input when needed. The orchestrator resumes it via `SendMessage` after each Q&A round.

**Phase A — Taxonomy:**
1. Agent queries React Aria docs and relevant Bootstrap KB sections.
2. Drafts a mapping of every variant, state, and sub-element to its Bootstrap counterpart, with bridge strategy.
3. Surfaces decisions that require your input (e.g., "which Bootstrap component should model this?").
4. You answer; agent finalizes the taxonomy doc at `agent/taxonomies/{Component}-taxonomy.md`.

**Phase B — Reference Stories:**
1. Agent fetches Bootstrap documentation pages to get example HTML for each story variant.
2. Writes `stories/react-aria-bootstrap/reference/{Component}.reference.stories.tsx` — pure Bootstrap HTML, no React Aria. Covers all visual states using faux-state CSS classes (hover, focus, active, etc.).
3. You review in Storybook and approve or give feedback. Multiple review cycles are supported.
4. On approval, agent extracts the computed CSS for each story to `agent/artifacts/reference-css/{Component}-{StoryName}.css` — these CSS files become the spec for Stage 5.

**Your involvement:** Answer taxonomy decisions (surfaced by orchestrator). Visual approval of each reference story in Storybook.

---

## Stage 5 — Styled Components

**Purpose:** For each component in the batch, implement the React Aria component with Bootstrap styling, then verify it visually matches the reference story via pixel-diff comparison.

**Architecture:** Two-tier, with a third tier for final stories.
- **Orchestrator** manages the batch sequence, surfaces exceptions to you, and is your sole contact point.
- **Component agent** (one per component) owns the full per-component lifecycle through pixel-diff pass.
- **Final stories agent** (dispatched after the component passes) writes the standard shipped Storybook stories.

**Component Agent Lifecycle:**

**Preparation Phase**
- Reads taxonomy, React Aria docs, Bootstrap KB, reference CSS files, and pre-captured reference story screenshots.

**Phase A — TSX + Bridge CSS**
- Implements `src/react-aria-bootstrap/{ComponentName}.tsx` using React Aria Components with Bootstrap `className` props.
- Writes bridge CSS rules to `src/scss/_bootstrap-bridges.scss` — maps React Aria `data-*` state attributes to Bootstrap visual states.

**Phase B — Mirror Stories**
- Writes `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx` — identical layout to the reference story, but using the React Aria component instead of static HTML.
- Extracts CSS from each mirror story.

**Phase C — Comparison Loop**
- Runs `scripts/compare-stories.mjs` for every story, generating `diff.png` and `implementation.png` in `agent/artifacts/diffs/{component}/{story}/iteration-{N}/`.
- For each failing story: reads the diff image, compares reference CSS vs. mirror CSS, applies a fix, re-runs.
- If a story can't be fixed after 3 attempts, it's marked `Stuck` and the orchestrator surfaces it to you for guidance.
- A special `EXTRACTED-CSS-GAP` flag is emitted if the agent needs access to the full `bootstrap.css` to resolve a gap — you decide whether to allow it.

**Final Verification Sweep**
- After all stories pass, runs one full sweep across all stories to catch regressions from shared-selector changes.

**Final Stories Agent**
- Writes `stories/react-aria-bootstrap/{ComponentName}.stories.tsx` — the standard Storybook stories with controls and documentation, for end users of the library.

**Post-Batch Debrief**
- After all components complete, you review the batch in Storybook and share observations.
- Patterns worth generalizing become new P-codes in `agent/react-aria-skill/principles.md`.
- The orchestrator follows `agent/iteration-protocol.md` for knowledge file updates and merge decisions.

**Your involvement:**
- Guidance for any `Stuck` stories (surfaced by orchestrator with the specific diff observations).
- Approve/deny `EXTRACTED-CSS-GAP` requests (rare).
- Post-batch Storybook review and debrief.

---

## Outputs by Stage

| Artifact | Stage | Path |
|----------|-------|------|
| Bootstrap KB | 1 | `agent/bootstrap-kb/` |
| Storybook config + shared files | 2 | `.storybook/`, `stories/react-aria-bootstrap/` |
| Batch log | 3 | `agent/logs/batch-{N}.md` |
| Taxonomy doc | 4 | `agent/taxonomies/{Component}-taxonomy.md` |
| Reference story | 4 | `stories/react-aria-bootstrap/reference/{Component}.reference.stories.tsx` |
| Reference CSS (extracted) | 4 | `agent/artifacts/reference-css/{Component}-{StoryName}.css` |
| Component implementation | 5 | `src/react-aria-bootstrap/{ComponentName}.tsx` |
| Bridge CSS | 5 | `src/scss/_bootstrap-bridges.scss` |
| Mirror story | 5 | `stories/react-aria-bootstrap/mirror/{ComponentName}.mirror.stories.tsx` |
| Diff images | 5 | `agent/artifacts/diffs/{component}/{story}/iteration-{N}/` |
| Findings docs | 5 | `agent/artifacts/findings/{component}-findings.md` |
| Final/standard story | 5 | `stories/react-aria-bootstrap/{ComponentName}.stories.tsx` |
