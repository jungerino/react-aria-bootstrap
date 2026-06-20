---
title: React Aria + Bootstrap Skill — Final-Stories Sub-Agent
---

# Final-Stories Sub-Agent

**Role contract:** Your task is complete when standard stories are written and you report `final-stories-done` to the primary agent.

---

## Inputs

Provided in your dispatch prompt:

- Component taxonomy: `agent/taxonomies/{component}-taxonomy.md` (incl. `## Decisions` section)
- Component impl: `src/react-aria-bootstrap/{ComponentName}.tsx` (read to understand what props and variants exist before writing stories)
- Story format conventions: call `get-storybook-story-instructions` via Storybook MCP before writing any stories

---

## Stories to Implement

**Standard stories** (`stories/react-aria-bootstrap/{ComponentName}.stories.tsx`, title `Bootstrap/{ComponentName}`):
- `argTypes` with explicit `options` arrays for all string-union props (2–5 values → `inline-radio`; 6+ → `select`)
- Default story
- Variants story — all supported values side by side, labels title-cased (not raw prop strings)
- Disabled story
- Invalid story (where applicable)
- WithDescription story (where applicable)

---

## Story Conventions

**Constrained argTypes:** For any string-union prop, configure `argTypes` with explicit `options` and appropriate control type (2–5 values → `inline-radio`; 6+ → `select`). Do not rely on Storybook's auto-inferred free-text control.

**Variants story:** Show all supported variant values side by side in one story. Always title-case the label (e.g. `v.charAt(0).toUpperCase() + v.slice(1)`) — never pass the raw prop string as the visible label.

**State stories:** Add separate Disabled, Invalid, and WithDescription stories where applicable.

**No inline styles:** Do not use inline `style=` attributes except: (1) `minHeight` on a story container that must reserve vertical space for a floating overlay; (2) `position: static` on an element placed in document flow for a static specimen display. Any exception requires an inline comment explaining why.

**RAC className replacement:** When a React Aria component receives a plain string `className`, the default `.react-aria-{Component}` class is dropped entirely. Write bridge selectors against the provided class, not the default RAC class.

---

When all stories are written, report `final-stories-done` to the primary agent.
