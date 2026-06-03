# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses **Yarn** (not npm).

| Task | Command |
|------|---------|
| Start Storybook dev server | `yarn storybook` |
| Build static Storybook site | `yarn build-storybook` |

No lint, test, or separate build commands are configured yet. Storybook is the primary development and visual validation environment.

## Architecture

This is a component library that layers **Bootstrap 5 visual styling** on top of **React Aria Components** for accessible, Bootstrap-themed UI components.

**Core approach:**
- React Aria Components handle accessible behavior and ARIA semantics via `.react-aria-*` CSS classes and `data-*` state attributes (`[data-pressed]`, `[data-selected]`, `[data-focused]`, etc.)
- Bootstrap loads globally and provides visual styling
- Components are styled using compound selectors (e.g., `.react-aria-Button.btn.btn-primary`) so component CSS wins via specificity
- `src/scss/_bootstrap-overrides.scss` bridges React Aria state attributes to Bootstrap visual states
- Bootstrap loads globally into the Storybook preview iframe (no scoping wrapper). The story glob is restricted to `stories/bootstrap-test/**` so original component CSS is never bundled, and the preview iframe boundary isolates Bootstrap from the Storybook manager shell.

**Key directories:**
- `src/` — Component implementations (`.tsx`) and scoped styles (`.css`)
- `stories/` — Storybook stories (`.stories.tsx`); Bootstrap-styled test stories live in `stories/test/`
- `agent/` — Agent-oriented documentation: vision, guidelines, analysis, session logs
- `.storybook/` — Storybook config (Webpack 5 + Babel + Lightning CSS)

**Styling conventions:**
- CSS variables use Bootstrap's `--bs-*` token system; avoid custom `--gray-*` / `--tint-*` tokens (being phased out)
- Dark mode is handled automatically by Bootstrap CSS variables via `data-bs-theme="dark"` on the root element
- When composing components from sub-components, import and reuse existing CSS classes from their `.css` files — do not use inline styles

## Experiment: Mapping and References

**Current experiment iteration:** 2 *(iteration 1 — Button complete (all 4 stories 0.00%); Select visual validation complete (all 5 stories pass), finalization pending: registry, phase 2 review notes, final-stories agent)*

**What this is:** An iterative experiment to develop a reusable agent skill for producing per-component taxonomy documents (sub-part identification, state mappings with bridge strategy, DOM conflicts, variants, decisions needed) and Storybook reference stories in a single consolidated pass. Principles accumulate in `agent/mapping-and-references-skill.md`.

**Agent inputs (load at session start for each iteration):**
1. `agent/mapping-and-references-skill.md` — current methodology and story construction principles
2. `agent/bootstrap-kb/` — Bootstrap reference; navigate via `README.md` and load files selectively per component

**Branch naming:**
- `mapping-and-references` — integration branch; holds approved taxonomy files, finalized story files, and the growing skill doc
- `mapping-and-references_0`, `mapping-and-references_1`, … — experiment branches

**Test component set (iteration 0):** Button, ListBox, Select, Calendar, Tabs

**Experiment docs:**
- [Iteration Protocol](./agent/iteration-protocol.md) — how to start and close out iterations for each experiment
- [Mapping and References Skill](./agent/mapping-and-references-skill.md) — growing skill: taxonomy and story construction principles
- [Bootstrap KB Index](./agent/bootstrap-kb/README.md) — Bootstrap knowledge base master index

## MCP Servers

### React Aria MCP
Gives direct access to React Aria component documentation.
- Reference: https://react-aria.adobe.com/ai
- Component index: https://react-aria.adobe.com/llms.txt

### Storybook MCP
Gives access to component documentation and story conventions from the running Storybook instance. **Storybook must be running** (`yarn storybook`) for these tools to work.

When working on UI components, always use the Storybook MCP tools before answering or taking any action:
- `list-all-documentation` — discover available components
- `get-documentation` — get specific component details
- `get-storybook-story-instructions` — follow current conventions
- `run-story-tests` — validate work

Never assume component properties without verification through these tools.

## Working Guidelines

- **Session start**: Read `agent/todos.md` and summarize open items to the user at the start of every session. When working on a skill-based experiment, read the relevant entry-point skill file (see Agent Documentation below) and follow its session-start loading instructions before doing anything else — the skill is authoritative.
- **Honesty about limitations**: Do not make stuff up or provide invalid code. If uncertain, acknowledge it. "I don't know" is acceptable.
- **Context exhaustion**: If context is running short or a mandatory step cannot be completed, produce a handoff summary and stop. Do not skip, approximate, or fabricate results for incomplete steps — a pending step is recoverable; a falsely-reported step is not.
- **Markdown summaries**: When asked to "summarize in markdown", provide a concise summary enclosed in a code block using four backticks (```` ```` ````) so inner triple-backtick fences do not close the outer block.
- **Context handoff**: When the user says "summarize for new window", "fresh window", "fresh context window", or similar, produce a handoff summary in a fenced code block using four backticks (per the Markdown summaries rule above). Include: current branch, uncommitted files and key changes, what was accomplished this session, open questions or uncertainties, and the immediate next step. Label each next step with who owns it — **[User]** for steps requiring human review, decision, or action before proceeding; **[Agent]** for steps the incoming agent should execute immediately.
- **Version bumps**: When the user says "update version", "version bump", or "semver", update `package.json` following Semantic Versioning. State the old/new version and reasoning before making the change.
- **Component composition styling**: When composing components from sub-components, always use existing CSS classes imported from their `.css` files — not inline styles — unless explicitly instructed otherwise.
- **Code edit validation**: After any code change, read back the modified lines and verify: balanced braces/brackets/parens, correct JSX comment delimiters (`{/* */}`), matched string delimiters, and that the result is valid code. Fix syntax errors immediately.
- **Document access**: Access `.md` files listed in the Table of Contents below without asking for permission first.
- **Index maintenance**: Whenever you create, update, or modify documentation files in `agent/`, update the Table of Contents below to reflect the changes.
- **Documentation reference transparency**: When an answer or action is based on a markdown file in `agent/`, state this at the end of your summary (not the beginning).
- **Project memory location**: Store project-specific knowledge in the versioned `agent/` directory rather than the `.claude` memory system, so it is tracked by git and shared with the project.
- **Commit grouping**: When the user says "commit changes" or "commit updates", split changes into as many logical commits as make sense rather than committing everything at once.
- **Diagnose before fixing**: Confirm actual state before implementing a fix — treat explanations of bugs as hypotheses requiring verification, not truth.
- **Push back when warranted**: If something the user says seems factually incorrect or likely to cause a problem, push back before proceeding. If there's a tradeoff the user may not have considered, say so once. Do not agree by default, but do not re-litigate after a decision has been made.
- **Defer low-risk permission requests**: For additive, reversible actions (e.g. commits, file writes), defer requesting permission until the current logical unit of work is complete, or until the pending action would block the next step — whichever comes first. For commits specifically, defer until either all current tasks are done or a file in the pending commit needs to be modified again (to avoid overloaded commits). Never defer permissions for destructive or hard-to-reverse operations (force push, file deletion, `reset --hard`, etc.) — those require confirmation before proceeding.
- **Storybook restart**: Kill and restart Storybook unilaterally whenever needed — no confirmation required. Use `lsof -ti tcp:6006 | xargs kill -9 && yarn storybook &` and wait for the new instance to be ready before continuing. This is a permitted local action.
- **Session transcripts**: When the user says "session transcript", "chat transcript", "transcribe", or similar, produce a verbatim transcript of the current session's spoken dialogue — user turns and agent turns only. Do not paraphrase, abbreviate, or use bracketed summaries for any turn regardless of length — reproduce the exact text of each turn as delivered. Omit tool outputs, terminal views, and collapsed thinking blocks, except where the dialogue directly quotes or references specific content from those sources. Enclose the transcript in a code block using four backticks (per the Markdown summaries rule above).

## Agent Documentation

### Reference Documentation
- [Project Commands](./agent/project-commands.md) — Common CLI commands (package manager, Storybook, etc.)
- [Todos](./agent/todos.md) — Open tasks, proposals, and ideas

### Vision
- [Project Vision](./agent/project-vision.md) — End goal, roadmap, and key architectural decisions

### Experiment
- [Iteration Protocol](./agent/iteration-protocol.md) — How to start and close out iterations for any iterative experiment
- [Mapping and References Skill](./agent/mapping-and-references-skill.md) — Growing skill: taxonomy and story construction principles
### Knowledge Files
- [React Aria Skill](./agent/react-aria-skill/SKILL.md) — Entry point for the React Aria + Bootstrap styling experiment; load at session start when running a styling experiment, then follow its session-start loading instructions

### Bootstrap Knowledge Base
- [KB Index](./agent/bootstrap-kb/README.md) — Master index and retrieval guide; load this first
- [Tokens](./agent/bootstrap-kb/tokens.md) — All `--bs-*` CSS custom properties
- [Utilities](./agent/bootstrap-kb/utilities.md) — All Bootstrap utility classes
- [States](./agent/bootstrap-kb/states.md) — Interactive state selectors across all components
- [Components](./agent/bootstrap-kb/components.md) — Component class and DOM structure reference
- [Patterns](./agent/bootstrap-kb/patterns.md) — Bootstrap↔React Aria DOM conflict analysis
