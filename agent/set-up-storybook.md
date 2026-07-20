---
title: Storybook Setup
---

# Storybook Setup

One-time setup. Creates the canonical `stories/react-aria-bootstrap/` directory tree, moves shared files to their workflow paths, and updates Storybook config so all three story categories are served from a single glob.

After setup Storybook starts cleanly; no component stories exist yet — that is expected.

## Status check

Before running, verify whether setup is already complete:

```bash
ls stories/react-aria-bootstrap/
```

If the directory exists and contains `_decorators.tsx`, setup has already been done.

---

## Implementation checklist

1. **Create directories**

   ```
   stories/react-aria-bootstrap/
   stories/react-aria-bootstrap/reference/
   stories/react-aria-bootstrap/mirror/
   ```

2. **Create `_decorators.tsx`**
   - Path: `stories/react-aria-bootstrap/_decorators.tsx`
   - Exports `withBootstrap`, a Storybook decorator that sets `data-bs-theme` on `document.documentElement` based on the active `backgrounds` toolbar value.

3. **Create `presentation.scss`**
   - Path: `stories/react-aria-bootstrap/presentation.scss`
   - Shared faux-state and layout CSS used by reference and mirror stories.

4. **Set the `.storybook/main.js` story glob**
   - `"../stories/react-aria-bootstrap/**/*.stories.@(js|jsx|mjs|ts|tsx)"`
   - This single glob covers all three story categories: `reference/`, `mirror/`, and root-level end-product stories.

5. **Update `.storybook/preview.js`**
   - Add import: `import { withBootstrap } from '../stories/react-aria-bootstrap/_decorators';`
   - Add `decorators: [withBootstrap]` to the preview export object.

6. **Create `agent/taxonomies/` directory**
   - Create `agent/taxonomies/` if it does not exist.

---

## Notes

- `presentation.scss` is **not** added as a global import in `preview.js`. Reference and mirror stories import it directly; end-product stories do not need it.
- Story categories by subdirectory:
  - `stories/react-aria-bootstrap/reference/` — Bootstrap reference stories (Stage 4 output)
  - `stories/react-aria-bootstrap/mirror/` — mirror stories for pixel-diff comparison (Stage 5 output)
  - `stories/react-aria-bootstrap/*.stories.tsx` — final shipped stories (Stage 5 output)

---

## Human review

Start Storybook (`yarn storybook`) and confirm the backgrounds switcher correctly toggles Bootstrap light/dark mode (`data-bs-theme` on the root element). No component stories are expected at this point.
