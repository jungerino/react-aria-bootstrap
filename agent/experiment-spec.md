# Bootstrap × React Aria: Iterative Agent Skill Development Experiment

## Context

This experiment establishes an iterative feedback loop to develop reusable agent skills for Bootstrap-styling React Aria component libraries. The project (`react-aria-bootstrap`) is a fresh repo with 45+ unstyled React Aria components in Storybook. A previous iteration of this experiment (`bootstrap-trials_v2` branch) was run without key resources in place (React Aria MCP, Storybook MCP, Superpowers). This new experiment starts clean with those resources, a three-layer knowledge architecture, and a dual-branch structure that simultaneously progresses the product and refines the skill.

**Intended outcomes (in parallel):**
1. Properly styled React Aria components for this project (product outcome)
2. A reusable skill for styling any React Aria + Bootstrap project (React Aria skill)
3. A reusable skill for styling any component library with Bootstrap (universal skill, extracted retroactively)

---

## Test Component Isolation in Storybook

### Goal
The experiment runs on a **duplicated subset** of components in a separate Storybook group. The originals remain untouched and visible for reference and comparison in the same Storybook instance.

### File structure
```
src/
  Button.tsx                      ← original, never modified
  bootstrap-test/
    Button.tsx                    ← experiment copy; agent modifies this
    TextField.tsx
    Checkbox.tsx
    Select.tsx
    Tabs.tsx
    Calendar.tsx
    ListBox.tsx

stories/
  Button.stories.tsx              ← original story, imports src/Button.tsx
  bootstrap-test/
    Button.stories.tsx            ← test story, title: "Bootstrap Test/Button"
    TextField.stories.tsx
    ...
```

### Bootstrap CSS scoping

Bootstrap is loaded via a **scoped SCSS file** rather than globally:

```scss
// src/scss/bootstrap-test.scss
.bs-test {
  @import 'vendor/bootstrap-5.3.8/bootstrap';
}
```

This is imported once in `.storybook/preview.js` (instead of the unscoped global import).

**Known leakage (unavoidable CSS limitation):**
- Bootstrap's `:root` CSS custom properties (`--bs-*`) will be available globally. This is benign — they don't visually affect unstyled components unless referenced.
- Bootstrap's Reboot (html/body font and margin resets) will apply globally. This may slightly alter text rendering in original stories; considered acceptable.
- All component-level Bootstrap styles (`.btn`, `.form-control`, `.dropdown`, etc.) are scoped to `.bs-test` and do NOT affect original stories.

### Storybook decorator for test stories

A shared decorator wraps each test story in `.bs-test`:

```tsx
// stories/bootstrap-test/_decorators.tsx
export const withBootstrapTest = (Story) => (
  <div className="bs-test">
    <Story />
  </div>
);
```

Applied in each test story's meta (not globally, to preserve original stories).

### Expanding test batches

When the first batch graduates and a second batch is defined, the same pattern applies:
- Add new component copies to `src/bootstrap-test/`
- Add new stories to `stories/bootstrap-test/` with the same `Bootstrap Test/ComponentName` title pattern

---

## Step 0 — Write this spec to the repo

Copy this document to `agent/experiment-spec.md` in the project repo. This file is the canonical reference for the experiment and lives alongside the other agent docs.

---

## Phase 0 — Project Infrastructure Setup

### 0a. .gitignore
Add to project root:
```
node_modules/
.DS_Store
storybook-static/
```

### 0b. Storybook
Install and confirm Storybook runs on port 6006:
```sh
yarn storybook
```
(Already in package.json; verify it boots correctly on the fresh repo)

### 0c. Sass + Bootstrap
Install Sass compilation:
```sh
yarn add -D sass sass-loader
```
Add SCSS webpack rule to `.storybook/main.js` `webpackFinal` hook:
```js
{ test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
```
Create Bootstrap vendor structure:
```
src/scss/
  vendor/
    bootstrap-5.3.8/     ← Bootstrap SCSS source files (from node_modules or vendor copy)
  _bootstrap-overrides.scss
  styles.scss             ← imports Bootstrap + overrides
```
Import once in `.storybook/preview.js`:
```js
import '../src/scss/styles.scss'
```

### 0d. React Aria MCP
```sh
claude mcp add react-aria npx @react-aria/mcp@latest
```
Add to CLAUDE.md:
- Reference: `https://react-aria.adobe.com/ai` (AI-specific docs)
- Reference: `https://react-aria.adobe.com/llms.txt` (full component index)

### 0e. React Aria Agent Skills
```sh
npx skills add https://react-aria.adobe.com
```
**Note:** Verify what this command does before running — it may be the Superpowers plugin CLI or an Adobe-specific system. Investigate and document.

### 0f. Storybook MCP
```sh
npx storybook add @storybook/addon-mcp
npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project
```
Add to CLAUDE.md (Storybook MCP guidance):
> When working on UI components, always use the Storybook MCP tools to access component and documentation knowledge before answering or taking any action. Never assume component properties without verification. Use `list-all-documentation` to discover components, `get-documentation` for specific details, `get-storybook-story-instructions` for current conventions, and `run-story-tests` to validate work.

### 0g. GitHub CLI auth
```sh
gh auth login
```
Walk through the interactive setup (browser-based OAuth or token). Confirm with `gh auth status`.

---

## Phase 1 — Experiment Infrastructure Files

### Files to create

**`agent/react-aria-skill.md`** — Primary growing knowledge file
- Seeded with meta-principles: compound selectors (`.react-aria-Button.btn`), data-attribute bridging theory, CSS-native visual elements, overlay mount patterns
- **Not** component-specific — React Aria + Bootstrap general patterns
- Updated after each iteration from the **experiment branch only**
- Structure: Principles / Decision Rules / Self-Review Checklist / Pattern Library / Iteration History

**`agent/component-decisions.md`** — Component-specific decisions
- Stub initially; populated from the **project branch** review
- Per-component decisions ("Calendar date cells → `.btn.btn-secondary`")
- NOT used in the experiment branch (deliberate exclusion for clean signal)

**`agent/bootstrap-skill.md`** — Universal Bootstrap skill
- Stub initially; populated **retroactively** when a principle is identified as non-React Aria-specific
- Not written proactively — extracted during debriefs

**`agent/iteration-protocol.md`** — Prescribed agent workflow
- What the agent reads before starting
- Step-by-step iteration flow
- Output format: styling changes + per-component rationale + uncertainties
- What to update in skill files after debrief

**`CLAUDE.md` additions**
- Experiment description and current iteration number
- Branch naming convention
- MCP usage guidance (React Aria MCP + Storybook MCP)
- Pointers to `agent/react-aria-skill.md`, `agent/component-decisions.md`, `agent/iteration-protocol.md`
- React Aria documentation references

### Initial guidelines (seed for `agent/react-aria-skill.md`)

The following user-provided guidelines form the starting content of `agent/react-aria-skill.md`:

---

**Goal:** Replace project CSS with Bootstrap. Bootstrap becomes the source of truth for all or most styling of the React Aria test components.

**Interaction states:**
- Interaction states that are styled in Bootstrap are sometimes unstyled in the project components (e.g., `.react-aria-Button[data-hovered]` is not styled, while `.btn:hover` is styled in Bootstrap).
- Bootstrap is authoritative for interaction state styling. Bridge React Aria `data-*` attributes to the corresponding Bootstrap styles.
  ```scss
  // Example bridge
  .react-aria-Button[data-hovered] {
    // bootstrap's styles for .btn:hover
  }
  ```

**TSX:**
- Style components by adding Bootstrap's component classes to `className`:
  ```tsx
  <Button className={(className) => `${className} btn btn-primary`}>
    Click me
  </Button>
  ```

**SCSS:**
- Bootstrap source files live in `src/scss/vendor/bootstrap-5.3.8/` — leave them untouched.
- `src/scss/styles.scss` is the top-level manifest; imports Bootstrap partials then `_bootstrap-overrides.scss`.
- `src/scss/_bootstrap-overrides.scss` contains bridge selectors mapping React Aria `data-*` attributes to Bootstrap's interaction styles.

**CSS:**
- Project CSS files are in `src/*.css`, `src/utilities.css`, `src/theme.css`.
- Any rules that conflict with a desired Bootstrap rule should be **commented out** (not deleted).

**When Bootstrap mapping cannot be identified:**
- Log the component/state at the end of the styling pass for user review.
- List potential alternative Bootstrap sources (similar in appearance or function). Be creative. Example for Calendar date cells (no direct Bootstrap counterpart):
  - `.btn.btn-secondary`
  - `.pagination .page-item`

---

---

## Phase 2 — Iteration Loop

### Test component set (7)
Chosen to cover the key structural patterns that surface the most important judgment calls:

| Component | Why included |
|-----------|-------------|
| Button | Baseline; calibrates the agent |
| TextField | Label/input relationship, error states |
| Checkbox | CSS-native visual elements (background-image checkmark), state bridges |
| Select | Trigger + overlay; two separate Bootstrap concepts |
| Tabs | Active state, ARIA roles vs. Bootstrap nav classes |
| Calendar | Complex grid, custom date cell styling, state-driven classes |
| ListBox | List/option patterns, selection states |

### Branch structure per iteration

Each iteration produces two parallel branches:

| Branch | Guidance used | Purpose |
|--------|-------------|---------|
| `bootstrap-iteration_N` | `react-aria-skill.md` only | Tests the general skill in isolation; primary source for skill updates |
| `styled-components` | `react-aria-skill.md` + `component-decisions.md` | Project progress; cumulative; both skill + specific decisions applied |

### Iteration flow

```
[experiment branch: bootstrap-iteration_N]
1. Agent reads react-aria-skill.md + CLAUDE.md
2. Agent styles all 7 test components (TSX + CSS changes)
3. Agent self-reviews against checklist in react-aria-skill.md
4. Agent writes iteration summary:
   - Per-component decisions and rationale
   - Uncertainties / places judgment was hard
   - Anything that felt like a contradiction in the skill

[user reviews experiment branch in Storybook]
5. Visual review: does each component look right?

[debrief — user + agent together]
6. Identify: what went wrong, what went right, what rule would have prevented each mistake
7. Agent updates react-aria-skill.md (new principles, refined rules, checklist updates)
8. If any principle generalizes beyond React Aria → agent adds to bootstrap-skill.md
9. Update CLAUDE.md: increment iteration number, note what changed

[project branch: styled-components]
10. Agent styles same components using react-aria-skill.md + component-decisions.md
11. User reviews — less rigorous, focused on product quality
12. Agent updates component-decisions.md with any new per-component decisions
```

### Graduation criterion
All 7 test components look correct on the first pass (before self-review catches anything) for **2 consecutive iterations** → expand to full 45-component library.

---

## Knowledge Architecture Summary

| File | Scope | Written when | Updated by |
|------|-------|-------------|-----------|
| `agent/react-aria-skill.md` | Any React Aria + Bootstrap project | Seeded now; grows each iteration | Experiment branch debrief |
| `agent/component-decisions.md` | This project only | Stub now; populated per-component | Project branch review |
| `agent/bootstrap-skill.md` | Any component library + Bootstrap | Stub now; populated retroactively | When principle generalizes beyond React Aria |
| `agent/iteration-protocol.md` | This experiment | Created now | If the process itself needs refinement |
| `CLAUDE.md` | This project | Updated now; version-bumped each iteration | Each iteration |

---

## Verification

After Phase 0 (infrastructure setup):
- `yarn storybook` starts without errors on port 6006
- Bootstrap styles render visually in the browser
- `gh auth status` confirms GitHub CLI is authenticated
- React Aria MCP appears in `claude mcp list`
- Storybook MCP tools are available in a Claude Code session

After each iteration:
- Storybook visual review: all 7 test components render as expected with Bootstrap styling
- Experiment branch: no component-decisions.md was consulted (clean signal)
- react-aria-skill.md was updated with at least one new or refined principle
- iteration-protocol.md is still accurate (agent followed the prescribed flow)

---

## Critical Files

- `/Users/josh/Library/CloudStorage/Dropbox/Github/react-aria-bootstrap/CLAUDE.md`
- `/Users/josh/Library/CloudStorage/Dropbox/Github/react-aria-bootstrap/agent/` (new files to be created)
- `/Users/josh/Library/CloudStorage/Dropbox/Github/react-aria-bootstrap/.storybook/main.js`
- `/Users/josh/Library/CloudStorage/Dropbox/Github/react-aria-bootstrap/.storybook/preview.js`
- `/Users/josh/Library/CloudStorage/Dropbox/Github/react-aria-bootstrap/src/scss/` (to be created)
- `/Users/josh/Library/CloudStorage/Dropbox/Github/react-aria-bootstrap/package.json`
