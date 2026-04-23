# Agent Documentation Index

This directory contains Agent-oriented documentation for this project.

## Working Guidelines

These are the key rules for our collaboration:

-   **Honesty about limitations**: Do not make stuff up or provide invalid code. If uncertain, acknowledge it.
-   **Transparency**: If you don't know how to do something or don't know the answer to a question, say so directly. "I don't know" is a perfectly acceptable answer.
-   **Markdown summaries**: When asked to "summarize in markdown", provide a concise summary of the most recent output formatted in markdown and enclosed in a code block for easy copying. Always use four backticks (```` ```` ````) to open and close the code block, so that any inner triple-backtick fences in the content do not prematurely close the outer block.
-   **Log updates**: When the user says "update log", append a markdown summary of the work session since the previous commit to the `agent/log.md` file. Only include prompts and actions where the user decided to keep the resulting updates (exclude reverted or discarded work). Include the full text of user prompts (in quotes, edited for clarity/spelling as needed), responses, and code changes made.
-   **Version bumps**: When the user says "update version", "version bump", or "semver", update the `version` field in `package.json` according to Semantic Versioning based on the nature of the changes since the last version (MAJOR for breaking changes, MINOR for new backwards-compatible features, PATCH for backwards-compatible fixes; for pre-1.0 versions, treat minor/patch accordingly). State the old and new version and the reasoning before making the change.
-   **Component composition styling**: When composing components from pre-existing sub-components, always use the existing CSS classes and styling from those components (imported from their `component.css` or styles modules) rather than creating inline styles, unless explicitly instructed otherwise.
-   **Code edit validation**: After making any code changes (especially with multi_replace operations), always read back the modified lines to verify syntax correctness before reporting completion. Confirm that: (1) all braces, brackets, and parentheses are balanced, (2) JSX comments have both `{/*` and `*/}` delimiters, (3) string delimiters are matched, and (4) the changes compile to valid code. If syntax errors are detected, fix them immediately.
-   **Document access**: Always access the `.md` files listed under 'Table of Contents' when needed without asking for permission first. These reference documents exist to be used.
-   **Index maintenance**: Whenever you create, update, or modify documentation files in the `agent` directory, always update the `agent/index.md` file to reflect these changes with appropriate descriptions and topics.
-   **Documentation reference transparency**: When an answer or action is based on information from any markdown file in the `agent` directory, state this at the very end of your summary, not at the beginning.
-   **Project memory location**: Store project-specific knowledge (commands, conventions, context) in the versioned `agent/` directory rather than the `.claude` memory system, so it is tracked by git and shared with the project.
-   **Commit grouping**: When the user says "commit changes" or "commit updates", split the changes into as many logical commits as make sense rather than committing everything at once.
-   **Diagnose before fixing**: A symptom tells you something is broken — it does not tell you what or why. Before implementing a fix, confirm the actual state (what a value is, what an API returns, what the code produces) rather than acting on what you expect it to be. Treat your explanation of a bug as a hypothesis that needs verification, not as the truth.

## Table of Contents

### Reference Documentation
- [Sessions Log](./log.md) - Chronological record of Agent work sessions, documenting user prompts, responses, and code changes made
- [Project Commands](./project-commands.md) - Common CLI commands (package manager, Storybook, etc.)

### Analysis
- [Component Analysis](./component-analysis.md) - Bootstrap 5.3.8 styling options for the 'Test group' of react-aria components: class mappings, state attribute gaps, SCSS variables, and CSS conflicts

### Vision
- [Project Vision](./project-vision.md) - End goal, roadmap, and key architectural decisions

### Bootstrap Trials
- [Bootstrap Guidelines](./bootstrap-guidelines.md) - Distilled, actionable rules for iterative Bootstrap styling passes: data-* bridges, dark mode, visual elements, variants, form components, overlays, layout, stories, and per-component decisions

---

*Last updated: April 21, 2026*

## Contributing to Agent Documentation

To add new documentation:

1. Create a new `.md` file in this directory
2. Add an entry to 'Table of Contents' with a brief description
3. Follow the established markdown formatting conventions
4. Ensure all internal links are relative paths
