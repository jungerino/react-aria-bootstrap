---
title: Project Vision
---

# Project Vision

This project is a stepping stone toward a **code-driven design system kept in sync with a Figma component library via agent workflows**.

## Roadmap

1. **Foundation** — React Aria components in Storybook: accessible, well-documented, consistent
2. **Bootstrap styling layer** — Style components with Bootstrap (compound-selector approach: `.react-aria-Button.btn`, etc.)
3. **Proportional / responsive design system layer** — Superimpose a token-based spacing, sizing, and responsive layer on top of Bootstrap
4. **Figma component library** — Agent workflow (Figma MCP + figma-generate-design / figma-use skills) builds Figma components from the production code
5. **Designer → code workflow** — Designers compose layouts in Figma; agent workflows assemble them from production-ready components

## Current phase

Bootstrap styling pass (phase 2). Working branch: `bootstrap-trials_v2`.

## Key decisions

- React Aria provides accessible behavior and ARIA semantics; Bootstrap provides visual styling
- Bootstrap loads globally (no `:where(.bs-scope)` scoping); test component CSS wins via compound-selector specificity
- Only Bootstrap-styled test stories are shown in Storybook (`stories/test/`); original stories exist in git for reference
- Bridge rules for React Aria data-attribute states (`[data-pressed]`, `[data-selected]`, etc.) live in `_bootstrap-bridges.scss`
