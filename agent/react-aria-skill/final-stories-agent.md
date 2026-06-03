---
title: React Aria + Bootstrap Skill — Final-Stories Sub-Agent
---

# Final-Stories Sub-Agent

**Role contract:** Your task is complete when standard and mirror stories are written and you report `final-stories-done` to the primary agent.

---

## Inputs

Provided in your dispatch prompt:

- Component taxonomy: `agent/reference-stories/{component}-taxonomy.md` (incl. `## Decisions` section)
- Component-wide findings doc: `agent/reference-stories/{component}-findings.md`
- Story format conventions: call `get-storybook-story-instructions` via Storybook MCP before writing any stories

---

## Stories to Implement

**Standard stories** (`stories/bootstrap-test/{ComponentName}/{ComponentName}.stories.tsx`, title `Bootstrap Test/{ComponentName}`):
- `argTypes` with explicit `options` arrays for all string-union props (2–5 values → `inline-radio`; 6+ → `select`)
- Default story
- Variants story — all supported values side by side, labels title-cased (not raw prop strings)
- Disabled story
- Invalid story (where applicable)
- WithDescription story (where applicable)

**Mirror stories** (`stories/bootstrap-test/{ComponentName}/{ComponentName}.mirror.stories.tsx`, title `Bootstrap Test Mirror/{ComponentName}`):
- One story per reference story in scope; names must match exactly
- Replicate reference story layout: same wrapper classes (`ref-specimen-row`, `ref-flex-row`), same `specimen()` helper pattern, same variant order
- Include interactive state specimens using `.faux-*` wrappers (see Story Conventions below)
- Import `augments.scss` directly: `import '../bootstrap-reference/augments.scss'`

---

## Story Conventions

**Constrained argTypes:** For any string-union prop, configure `argTypes` with explicit `options` and appropriate control type (2–5 values → `inline-radio`; 6+ → `select`). Do not rely on Storybook's auto-inferred free-text control.

**Variants story:** Show all supported variant values side by side in one story. Always title-case the label (e.g. `v.charAt(0).toUpperCase() + v.slice(1)`) — never pass the raw prop string as the visible label.

**State stories:** Add separate Disabled, Invalid, and WithDescription stories where applicable.

**Faux interactive states:** Mirror stories must cover interactive states (focus, hover, pressed) even when they cannot be triggered via props. Pattern: (1) add a `.faux-[state]` bridge rule in `_bootstrap-overrides.scss` applying the same properties Bootstrap uses for the native pseudo-class; if the RAC component replaces `className` entirely, wrap the component in a `.faux-[state]-scope` div and scope the bridge rule to that wrapper; (2) wrap the component with that div (or pass `className="faux-[state]"` where it lands on a stable outer element).

**Augments import:** Mirror stories must explicitly import `augments.scss` — the pixel diff script renders each story in isolation without the normal shared bundle.

**No inline styles:** Do not use inline `style=` attributes except: (1) `minHeight` on a story container that must reserve vertical space for a floating overlay; (2) `position: static` on an element placed in document flow for a static specimen display. Any exception requires an inline comment explaining why.

**RAC className replacement:** When a React Aria component receives a plain string `className`, the default `.react-aria-{Component}` class is dropped entirely. Write bridge selectors against the provided class, not the default RAC class.

---

When all stories are written, report `final-stories-done` to the primary agent.
