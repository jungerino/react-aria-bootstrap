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

## Experiment: Bootstrap Styling Iterations

**Current iteration:** 1 *(restarting — visual comparison workflow added to `react-aria-skill.md` and `iteration-protocol.md`; Chrome MCP availability check required at session start)*

**What this is:** An iterative experiment to develop reusable agent skills for Bootstrap-styling React Aria component libraries. Each round produces two passes:
1. Experiment pass (`bootstrap-iteration_N`) — principles only; primary source for skill updates
2. Styled-components pass (`styled-components_N`) — principles + component decisions; project progress

**Branch naming:**
- `bootstrap-iteration_0`, `bootstrap-iteration_1`, … — experiment branch (uses `react-aria-skill.md`)
- `styled-components_0`, `styled-components_1`, … — project branch (uses `react-aria-skill.md` + `component-decisions.md`)

**Test component set:** Button, TextField, Checkbox, Select, Tabs, Calendar, ListBox

**Experiment branch restrictions (`bootstrap-iteration_N` only):**
- `agent/component-decisions.md` is replaced with a stub on experiment branches. Do not read it. Do not copy or cherry-pick it to `main`.
- `agent/review-iteration-*.md` files from prior iterations are replaced with stubs on experiment branches. Do not read them. Extracted principles live in `agent/react-aria-skill.md`.
- When updating `main` after an experiment debrief, copy files individually using `git checkout <branch> -- <file>`. Never cherry-pick whole commits. See `agent/iteration-protocol.md` for the exact workflow.

**Experiment docs:**
- [Experiment Spec](./agent/experiment-spec.md) — full design document
- [Iteration Protocol](./agent/iteration-protocol.md) — how to run an iteration
- [React Aria Skill](./agent/react-aria-skill.md) — growing general skill: React Aria + Bootstrap principles (updated from experiment branch only)
- [Component Decisions](./agent/component-decisions.md) — per-component decisions (updated from project branch only)

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

- **Honesty about limitations**: Do not make stuff up or provide invalid code. If uncertain, acknowledge it. "I don't know" is acceptable.
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

## Agent Documentation

### Reference Documentation
- [Project Commands](./agent/project-commands.md) — Common CLI commands (package manager, Storybook, etc.)

### Vision
- [Project Vision](./agent/project-vision.md) — End goal, roadmap, and key architectural decisions

### Experiment
- [Experiment Spec](./agent/experiment-spec.md) — Full design document for the iterative Bootstrap styling experiment
- [Iteration Protocol](./agent/iteration-protocol.md) — Prescribed workflow for each styling iteration

### Knowledge Files (Bootstrap Experiment)
- [React Aria Skill](./agent/react-aria-skill.md) — Growing general skill: React Aria + Bootstrap principles (updated from experiment branch)
- [Component Decisions](./agent/component-decisions.md) — Per-component Bootstrap decisions for this project

### Iteration Reviews
- [Review — Iteration 0](./agent/review-iteration-0.md) — Agent summary, user visual review, and debrief decisions for iteration 0
