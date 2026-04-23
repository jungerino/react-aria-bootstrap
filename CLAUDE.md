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
- `src/_bootstrap-overrides.scss` bridges React Aria state attributes to Bootstrap visual states

**Key directories:**
- `src/` — Component implementations (`.tsx`) and scoped styles (`.css`)
- `stories/` — Storybook stories (`.stories.tsx`); Bootstrap-styled test stories live in `stories/test/`
- `agent/` — Agent-oriented documentation: vision, guidelines, analysis, session logs
- `.storybook/` — Storybook config (Webpack 5 + Babel + Lightning CSS)

**Styling conventions:**
- CSS variables use Bootstrap's `--bs-*` token system; avoid custom `--gray-*` / `--tint-*` tokens (being phased out)
- Dark mode is handled automatically by Bootstrap CSS variables via `data-bs-theme="dark"` on the root element
- When composing components from sub-components, import and reuse existing CSS classes from their `.css` files — do not use inline styles

## Working Guidelines

- **Honesty about limitations**: Do not make stuff up or provide invalid code. If uncertain, acknowledge it. "I don't know" is acceptable.
- **Markdown summaries**: When asked to "summarize in markdown", provide a concise summary enclosed in a code block using four backticks (```` ```` ````) so inner triple-backtick fences do not close the outer block.
- **Log updates**: When the user says "update log", append a markdown summary of the work session since the previous commit to `agent/log.md`. Include user prompts (quoted, lightly edited for clarity), responses, and code changes. Exclude reverted or discarded work.
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
- [Sessions Log](./agent/log.md) — Chronological record of agent work sessions, documenting user prompts, responses, and code changes made
- [Project Commands](./agent/project-commands.md) — Common CLI commands (package manager, Storybook, etc.)

### Analysis
- [Component Analysis](./agent/component-analysis.md) — Bootstrap 5.3.8 styling options for the 'Test group' of react-aria components: class mappings, state attribute gaps, SCSS variables, and CSS conflicts

### Vision
- [Project Vision](./agent/project-vision.md) — End goal, roadmap, and key architectural decisions

### Bootstrap Trials
- [Bootstrap Guidelines](./agent/bootstrap-guidelines.md) — Distilled, actionable rules for iterative Bootstrap styling passes: data-* bridges, dark mode, visual elements, variants, form components, overlays, layout, stories, and per-component decisions
