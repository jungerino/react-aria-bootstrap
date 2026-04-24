# Bootstrap × React Aria Experiment Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up all infrastructure, knowledge files, and Storybook isolation needed to run the iterative Bootstrap styling experiment on a subset of 7 React Aria components.

**Architecture:** Bootstrap is loaded scoped to `.bs-test` (not globally) so test and reference stories coexist in Storybook. A three-layer knowledge system (`react-aria-skill.md`, `component-decisions.md`, `bootstrap-skill.md`) grows through iterations. The 7 test components are duplicated in `src/bootstrap-test/`; original `src/` files are never modified during the experiment.

**Tech Stack:** React 19, React Aria Components 1.17, Bootstrap 5.3.8, Storybook 9 (Webpack 5 + Babel), TypeScript 5.8, Sass/SCSS, Yarn 4.2

---

## File Map

### Created
| File | Purpose |
|------|---------|
| `.gitignore` | Exclude node_modules, .DS_Store, storybook-static/ |
| `agent/experiment-spec.md` | Canonical experiment design document |
| `agent/react-aria-skill.md` | Growing knowledge: React Aria + Bootstrap principles |
| `agent/component-decisions.md` | Per-component decisions stub |
| `agent/bootstrap-skill.md` | Universal Bootstrap skill stub |
| `agent/iteration-protocol.md` | Prescribed iteration workflow for the agent |
| `src/scss/_bootstrap-overrides.scss` | Bridge selectors (empty; filled during iterations) |
| `src/scss/bootstrap-test.scss` | Scoped Bootstrap: `.bs-test { @import 'bootstrap' }` |
| `src/scss/styles.scss` | Top-level SCSS manifest imported by Storybook |
| `stories/bootstrap-test/_decorators.tsx` | `withBootstrapTest` decorator wrapping stories in `.bs-test` |
| `src/bootstrap-test/Button.tsx` | Bootstrap-test copy of Button |
| `src/bootstrap-test/TextField.tsx` | Bootstrap-test copy of TextField |
| `src/bootstrap-test/Checkbox.tsx` | Bootstrap-test copy of Checkbox |
| `src/bootstrap-test/Select.tsx` | Bootstrap-test copy of Select |
| `src/bootstrap-test/Tabs.tsx` | Bootstrap-test copy of Tabs |
| `src/bootstrap-test/Calendar.tsx` | Bootstrap-test copy of Calendar |
| `src/bootstrap-test/ListBox.tsx` | Bootstrap-test copy of ListBox |
| `stories/bootstrap-test/Button.stories.tsx` | Bootstrap Test story: Button |
| `stories/bootstrap-test/TextField.stories.tsx` | Bootstrap Test story: TextField |
| `stories/bootstrap-test/Checkbox.stories.tsx` | Bootstrap Test story: Checkbox |
| `stories/bootstrap-test/Select.stories.tsx` | Bootstrap Test story: Select |
| `stories/bootstrap-test/Tabs.stories.tsx` | Bootstrap Test story: Tabs |
| `stories/bootstrap-test/Calendar.stories.tsx` | Bootstrap Test story: Calendar |
| `stories/bootstrap-test/ListBox.stories.tsx` | Bootstrap Test story: ListBox |

### Modified
| File | Change |
|------|--------|
| `package.json` | Add `bootstrap`, `sass`, `sass-loader` |
| `.storybook/main.js` | Add SCSS webpack rule; expand stories glob to include `bootstrap-test/` |
| `.storybook/preview.js` | Import `../src/scss/styles.scss` |
| `CLAUDE.md` | Add experiment context, MCP guidance, iteration counter, updated ToC |

---

## Task 1: Repo Foundations

**Files:**
- Create: `.gitignore`
- Create: `agent/experiment-spec.md`

- [ ] **Step 1.1: Create .gitignore**

```
node_modules/
.DS_Store
storybook-static/
```

Save to `.gitignore` at project root.

- [ ] **Step 1.2: Write experiment spec to repo**

Copy the full content of the approved plan from `~/.claude/plans/i-would-like-to-shiny-pine.md` to `agent/experiment-spec.md`.

- [ ] **Step 1.3: Commit**

```bash
git add .gitignore agent/experiment-spec.md
git commit -m "chore: add .gitignore and experiment spec"
```

---

## Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 2.1: Install Bootstrap, Sass, and sass-loader**

```bash
yarn add bootstrap@5.3.8
yarn add -D sass sass-loader
```

- [ ] **Step 2.2: Verify installation**

```bash
cat package.json | grep -E '"bootstrap|sass'
```

Expected output includes:
```
"bootstrap": "5.3.8"
"sass": "^1.x.x"
"sass-loader": "^16.x.x"
```

- [ ] **Step 2.3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: install bootstrap, sass, sass-loader"
```

---

## Task 3: Storybook + SCSS Configuration

**Files:**
- Modify: `.storybook/main.js`
- Modify: `.storybook/preview.js`

- [ ] **Step 3.1: Update stories glob and add SCSS webpack rule in `.storybook/main.js`**

Replace the `stories` array and `webpackFinal` function:

```js
import { join, dirname } from "path";

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../stories/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) => !/^aria-|on[A-Z]/.test(prop.name)
    },
  },
  async webpackFinal(config) {
    // Existing: add Lightning CSS to the CSS rule
    let cssRule = config.module.rules.find(rule => String(rule.test).includes('.css'));
    cssRule.use.push('lightningcss-loader');

    // New: SCSS rule
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    return config;
  }
};
export default config;
```

- [ ] **Step 3.2: Create Bootstrap SCSS structure**

Create `src/scss/_bootstrap-overrides.scss`:
```scss
// Bridge selectors: React Aria data-* → Bootstrap interaction states
// Populated during iterations. Do not add unverified rules here.
```

Create `src/scss/bootstrap-test.scss`:
```scss
// Bootstrap scoped to .bs-test — only affects Bootstrap Test stories
.bs-test {
  @import 'bootstrap/scss/bootstrap';
}
```

Create `src/scss/styles.scss`:
```scss
// Top-level SCSS manifest imported by Storybook
@import 'bootstrap-test';
@import 'bootstrap-overrides';
```

- [ ] **Step 3.3: Update `.storybook/preview.js` to import styles**

```js
import { themes } from "storybook/theming";
import './preview.css';
import '../src/scss/styles.scss';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    docs: {
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? themes.dark : themes.light
    }
  },
};

export default preview;
```

- [ ] **Step 3.4: Verify Storybook boots without errors**

```bash
yarn storybook
```

Open `http://localhost:6006`. Expected: Storybook launches, existing stories render without visual regressions, no console errors about missing loaders.

Stop Storybook with Ctrl+C before committing.

- [ ] **Step 3.5: Commit**

```bash
git add .storybook/main.js .storybook/preview.js src/scss/
git commit -m "feat: add SCSS support with scoped Bootstrap loader"
```

---

## Task 4: React Aria MCP

**Files:** No repo files modified (MCP is configured in Claude Code's global settings)

- [ ] **Step 4.1: Add React Aria MCP to Claude Code**

```bash
claude mcp add react-aria npx @react-aria/mcp@latest
```

- [ ] **Step 4.2: Verify MCP is registered**

```bash
claude mcp list
```

Expected: `react-aria` appears in the list.

- [ ] **Step 4.3: Investigate the `npx skills add` command**

```bash
npx skills add https://react-aria.adobe.com
```

Observe output carefully. Document what it does — it may install a Superpowers skill or belong to a different agent tools system. If it installs successfully and the output is clear, document the result in `agent/experiment-spec.md` under a note at the bottom. If it fails or is unclear, log what happened.

---

## Task 5: Storybook MCP

**Files:** No repo files modified (MCP wiring is via project config)

- [ ] **Step 5.1: Add Storybook MCP addon**

```bash
npx storybook add @storybook/addon-mcp
```

- [ ] **Step 5.2: Wire Storybook MCP to the agent**

```bash
npx mcp-add --type http --url "http://localhost:6006/mcp" --scope project
```

- [ ] **Step 5.3: Verify Storybook MCP is available**

Start Storybook and open a Claude Code session. Confirm the Storybook MCP tools are listed (e.g., `list-all-documentation`). Stop Storybook after verification.

---

## Task 6: GitHub CLI Authentication

- [ ] **Step 6.1: Log in via browser**

```bash
gh auth login
```

Follow the prompts: choose `GitHub.com` → `HTTPS` → `Login with a web browser`. Complete the OAuth flow in the browser.

- [ ] **Step 6.2: Verify auth**

```bash
gh auth status
```

Expected: `Logged in to github.com as jungerino`.

---

## Task 7: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 7.1: Add experiment section and MCP guidance to `CLAUDE.md`**

Insert the following sections after the `## Architecture` section and before `## Working Guidelines`:

```markdown
## Experiment: Bootstrap Styling Iterations

**Current iteration:** 0 (not started)

**What this is:** An iterative experiment to develop reusable agent skills for Bootstrap-styling React Aria component libraries. Two outcomes run in parallel:
1. Properly styled test components (product outcome) — `styled-components` branch
2. A growing, reusable skill for styling React Aria + Bootstrap projects — `bootstrap-iteration_N` branches

**Branch naming:**
- `bootstrap-iteration_0`, `bootstrap-iteration_1`, … — experiment branch (uses `react-aria-skill.md` only)
- `styled-components` — project branch (uses `react-aria-skill.md` + `component-decisions.md`)

**Test component set:** Button, TextField, Checkbox, Select, Tabs, Calendar, ListBox

**Experiment docs:**
- [Experiment Spec](./agent/experiment-spec.md) — full design document
- [Iteration Protocol](./agent/iteration-protocol.md) — how to run an iteration
- [React Aria Skill](./agent/react-aria-skill.md) — growing general skill (updated from experiment branch only)
- [Component Decisions](./agent/component-decisions.md) — per-component decisions (updated from project branch only)
- [Bootstrap Skill](./agent/bootstrap-skill.md) — universal Bootstrap skill (retroactively extracted)

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
```

- [ ] **Step 7.2: Update the Table of Contents in `CLAUDE.md`**

Add new entries to the `## Agent Documentation` section:

```markdown
### Experiment
- [Experiment Spec](./agent/experiment-spec.md) — Full design document for the iterative Bootstrap styling experiment
- [Iteration Protocol](./agent/iteration-protocol.md) — Prescribed workflow for each styling iteration

### Knowledge Files (Bootstrap Experiment)
- [React Aria Skill](./agent/react-aria-skill.md) — Growing general skill: React Aria + Bootstrap principles (updated from experiment branch)
- [Component Decisions](./agent/component-decisions.md) — Per-component Bootstrap decisions for this project
- [Bootstrap Skill](./agent/bootstrap-skill.md) — Universal Bootstrap skill (retroactively extracted; stub until principles emerge)
```

- [ ] **Step 7.3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add experiment context and MCP guidance to CLAUDE.md"
```

---

## Task 8: Agent Knowledge Files

**Files:**
- Create: `agent/react-aria-skill.md`
- Create: `agent/component-decisions.md`
- Create: `agent/bootstrap-skill.md`
- Create: `agent/iteration-protocol.md`

- [ ] **Step 8.1: Create `agent/react-aria-skill.md`**

```markdown
---
title: React Aria + Bootstrap Skill
iteration: 0
---

# React Aria + Bootstrap Skill

This file is the growing knowledge base for styling React Aria component libraries with Bootstrap. It is updated after each **experiment branch** debrief. Do not update it from the project branch (`styled-components`).

## Principles

**Goal:** Replace project CSS with Bootstrap. Bootstrap becomes the source of truth for all or most styling of the React Aria test components.

**Compound selectors:** Retain the `.react-aria-*` class on every element alongside Bootstrap classes for specificity and non-conflicting React Aria CSS. Example: `.react-aria-Button.btn.btn-primary`.

**Bootstrap className in TSX:** Style components by adding Bootstrap classes to the `className` attribute using the render-prop form:
```tsx
<Button className={(className) => `${className} btn btn-primary`}>
  Click me
</Button>
```

**SCSS bridge selectors (`_bootstrap-overrides.scss`):** Map React Aria `data-*` attributes to Bootstrap's interaction styles. Bootstrap is authoritative for interaction states.
```scss
// Example: bridge data-hovered to Bootstrap's :hover styles
.react-aria-Button[data-hovered] {
  // paste Bootstrap's .btn:hover rules here
}
```

**Conflicting project CSS:** Comment out (do not delete) any project CSS rules that conflict with a desired Bootstrap rule.

## Data-* Bridge Rules

Bridge a `data-*` attribute in `_bootstrap-overrides.scss` **only when**:
1. No native CSS pseudo-class equivalent exists (e.g., `[data-selected]`, `[data-invalid]`, `[data-indeterminate]`)
2. The element is non-native (e.g., `<div>`, `<td>`) so pseudo-classes don't fire
3. React Aria uses `aria-disabled` + `[data-disabled]` without native `disabled` (element must stay focusable)

**Do not bridge** native pseudo-classes that fire automatically:
- `:hover` on native elements — use `:hover` directly
- `:focus-visible` on native elements — use `:focus-visible` directly
- `:active` on native elements — use `:active` directly
- `:disabled` on native `<input>` elements

## When Bootstrap Mapping Cannot Be Found

If the Bootstrap equivalent for a component or interaction state cannot be identified:
1. Log it in the "Unmapped" section at the bottom of this file
2. List potential alternative Bootstrap sources (similar in appearance or function)

## Self-Review Checklist

Before delivering iteration work, verify:
- [ ] Every test component has Bootstrap classes in its `className` (not just CSS overrides)
- [ ] All `data-*` bridges that are needed are in `_bootstrap-overrides.scss`
- [ ] No project CSS rules that conflict with Bootstrap are left uncommented
- [ ] Unmapped components/states are logged with alternatives

## Pattern Library

*Patterns discovered through iteration. Empty until iteration 0 completes.*

## Iteration History

*Updated after each experiment-branch debrief.*

## Unmapped Components / States

*Log components or states where Bootstrap mapping is unclear. Include alternatives.*

| Component | State/Element | Alternatives considered |
|-----------|--------------|------------------------|
| — | — | — |
```

- [ ] **Step 8.2: Create `agent/component-decisions.md`**

```markdown
---
title: Component-Specific Decisions
---

# Component-Specific Decisions

Per-component Bootstrap decisions for this project. Updated after **project branch** (`styled-components`) review only.

Not consulted during experiment-branch iterations (deliberate exclusion for clean skill signal).

## Button

*No decisions yet.*

## TextField

*No decisions yet.*

## Checkbox

*No decisions yet.*

## Select

*No decisions yet.*

## Tabs

*No decisions yet.*

## Calendar

*No decisions yet.*

## ListBox

*No decisions yet.*
```

- [ ] **Step 8.3: Create `agent/bootstrap-skill.md`**

```markdown
---
title: Universal Bootstrap Skill
---

# Universal Bootstrap Skill

Principles that apply to **any component library** being styled with Bootstrap — not specific to React Aria. Populated retroactively when a principle from `react-aria-skill.md` is recognized as non-React-Aria-specific.

Do not write to this file proactively. Extract during debriefs when a principle clearly generalizes.

## Principles

*Empty until principles emerge through iteration.*
```

- [ ] **Step 8.4: Create `agent/iteration-protocol.md`**

```markdown
---
title: Iteration Protocol
---

# Iteration Protocol

This document describes the prescribed workflow for each Bootstrap styling iteration.

## Before starting

1. Confirm which branch this is:
   - **Experiment branch** (`bootstrap-iteration_N`): read `agent/react-aria-skill.md` + `CLAUDE.md`. Do NOT consult `agent/component-decisions.md`.
   - **Project branch** (`styled-components`): read `agent/react-aria-skill.md` + `agent/component-decisions.md` + `CLAUDE.md`.

2. Read `agent/react-aria-skill.md` carefully. Understand current principles and the self-review checklist.

3. Start Storybook (`yarn storybook`) and confirm the `Bootstrap Test` story group is visible.

## Iteration steps

1. For each of the 7 test components (Button, TextField, Checkbox, Select, Tabs, Calendar, ListBox):
   - Open `src/bootstrap-test/ComponentName.tsx` and its CSS file
   - Apply Bootstrap classes and bridge selectors following `react-aria-skill.md`
   - Comment out conflicting project CSS rules (do not delete)
   - Log any unmapped states

2. Run self-review against the checklist in `react-aria-skill.md`.

3. Write the iteration summary (see Output Format below).

## Output Format

After styling all 7 components, produce a summary with these sections:

### Decisions made
For each component: what Bootstrap classes/patterns were applied and why.

### Uncertainties
Places where you were unsure which approach was correct. Flag these for user review.

### Unmapped states
Components or interaction states where no Bootstrap equivalent was found. List alternatives considered.

### Proposed skill updates
Rules you believe should be added to or changed in `react-aria-skill.md`.

## After user review (debrief)

1. Update `agent/react-aria-skill.md`:
   - Add new principles
   - Refine existing rules
   - Update the self-review checklist
   - Add confirmed patterns to the Pattern Library
   - Clear resolved unmapped items

2. If any principle is clearly not React Aria-specific → add to `agent/bootstrap-skill.md`.

3. Update `CLAUDE.md`: increment iteration number, add 1-line note about what changed.

4. Commit.
```

- [ ] **Step 8.5: Commit**

```bash
git add agent/react-aria-skill.md agent/component-decisions.md agent/bootstrap-skill.md agent/iteration-protocol.md
git commit -m "feat: add experiment knowledge files and iteration protocol"
```

---

## Task 9: Bootstrap-Test Component Copies

**Files:**
- Create: `src/bootstrap-test/Button.tsx`
- Create: `src/bootstrap-test/TextField.tsx`
- Create: `src/bootstrap-test/Checkbox.tsx`
- Create: `src/bootstrap-test/Select.tsx`
- Create: `src/bootstrap-test/Tabs.tsx`
- Create: `src/bootstrap-test/Calendar.tsx`
- Create: `src/bootstrap-test/ListBox.tsx`

These are exact copies of the originals in `src/`. The agent will modify them during iterations; the originals are never touched.

- [ ] **Step 9.1: Copy the 7 test components**

```bash
mkdir -p src/bootstrap-test
cp src/Button.tsx src/bootstrap-test/Button.tsx
cp src/TextField.tsx src/bootstrap-test/TextField.tsx
cp src/Checkbox.tsx src/bootstrap-test/Checkbox.tsx
cp src/Select.tsx src/bootstrap-test/Select.tsx
cp src/Tabs.tsx src/bootstrap-test/Tabs.tsx
cp src/Calendar.tsx src/bootstrap-test/Calendar.tsx
cp src/ListBox.tsx src/bootstrap-test/ListBox.tsx
```

- [ ] **Step 9.2: Update CSS imports to point to parent directory**

Each copied file imports its CSS with a relative path like `'./Button.css'`. Update each import to point to the parent `src/` directory:

In `src/bootstrap-test/Button.tsx`: change `import './Button.css'` → `import '../Button.css'`
In `src/bootstrap-test/TextField.tsx`: change `import './TextField.css'` → `import '../TextField.css'`
In `src/bootstrap-test/Checkbox.tsx`: change `import './Checkbox.css'` → `import '../Checkbox.css'`
In `src/bootstrap-test/Select.tsx`: change `import './Select.css'` → `import '../Select.css'`
In `src/bootstrap-test/Tabs.tsx`: change `import './Tabs.css'` → `import '../Tabs.css'`
In `src/bootstrap-test/Calendar.tsx`: change `import './Calendar.css'` → `import '../Calendar.css'`
In `src/bootstrap-test/ListBox.tsx`: change `import './ListBox.css'` → `import '../ListBox.css'`

Also update any cross-component imports (e.g., `TextField.tsx` imports `Form.tsx` components — change `'./Form'` → `'../Form'`).

Run a quick check to find all local imports that need updating:
```bash
grep -n "from '\.\/" src/bootstrap-test/*.tsx
```
Fix any remaining `'./'` imports to `'../'`.

- [ ] **Step 9.3: Commit**

```bash
git add src/bootstrap-test/
git commit -m "feat: add bootstrap-test component copies (unmodified)"
```

---

## Task 10: Bootstrap-Test Stories

**Files:**
- Create: `stories/bootstrap-test/_decorators.tsx`
- Create: `stories/bootstrap-test/Button.stories.tsx`
- Create: `stories/bootstrap-test/TextField.stories.tsx`
- Create: `stories/bootstrap-test/Checkbox.stories.tsx`
- Create: `stories/bootstrap-test/Select.stories.tsx`
- Create: `stories/bootstrap-test/Tabs.stories.tsx`
- Create: `stories/bootstrap-test/Calendar.stories.tsx`
- Create: `stories/bootstrap-test/ListBox.stories.tsx`

- [ ] **Step 10.1: Create the `.bs-test` decorator**

Create `stories/bootstrap-test/_decorators.tsx`:

```tsx
import type { Decorator } from '@storybook/react';

export const withBootstrapTest: Decorator = (Story) => (
  <div className="bs-test">
    <Story />
  </div>
);
```

- [ ] **Step 10.2: Create `stories/bootstrap-test/Button.stories.tsx`**

```tsx
import { Button } from '../../src/bootstrap-test/Button';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Button> = {
  title: 'Bootstrap Test/Button',
  component: Button,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Button>;

export const Example: Story = (args) => <Button {...args}>Press me</Button>;

Example.args = {
  onPress: () => alert('Hello world!')
};
```

- [ ] **Step 10.3: Create `stories/bootstrap-test/TextField.stories.tsx`**

Read `stories/TextField.stories.tsx` for the original story structure, then create:

```tsx
import { TextField } from '../../src/bootstrap-test/TextField';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof TextField> = {
  title: 'Bootstrap Test/TextField',
  component: TextField,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof TextField>;

export const Example: Story = (args) => <TextField {...args} />;

Example.args = {
  label: 'Name',
  placeholder: 'Enter your name'
};
```

- [ ] **Step 10.4: Create `stories/bootstrap-test/Checkbox.stories.tsx`**

```tsx
import { Checkbox } from '../../src/bootstrap-test/Checkbox';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Checkbox> = {
  title: 'Bootstrap Test/Checkbox',
  component: Checkbox,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Checkbox>;

export const Example: Story = (args) => <Checkbox {...args}>Unsubscribe</Checkbox>;
```

- [ ] **Step 10.5: Create `stories/bootstrap-test/Select.stories.tsx`**

```tsx
import { Select, SelectItem } from '../../src/bootstrap-test/Select';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Select> = {
  title: 'Bootstrap Test/Select',
  component: Select,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Select>;

export const Example: Story = (args) => (
  <Select {...args}>
    <SelectItem>Chocolate</SelectItem>
    <SelectItem>Mint</SelectItem>
    <SelectItem>Strawberry</SelectItem>
    <SelectItem>Vanilla</SelectItem>
  </Select>
);

Example.args = {
  label: 'Ice cream flavor'
};
```

- [ ] **Step 10.6: Create `stories/bootstrap-test/Tabs.stories.tsx`**

```tsx
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '../../src/bootstrap-test/Tabs';
import { fn } from 'storybook/test';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Tabs> = {
  title: 'Bootstrap Test/Tabs',
  component: Tabs,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  args: { onSelectionChange: fn() },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Tabs>;

export const Example: Story = (args) => (
  <Tabs {...args}>
    <TabList aria-label="History of Ancient Rome">
      <Tab id="FoR">Founding of Rome</Tab>
      <Tab id="MaR">Monarchy and Republic</Tab>
      <Tab id="Emp">Empire</Tab>
    </TabList>
    <TabPanels>
      <TabPanel id="FoR">Arma virumque cano, Troiae qui primus ab oris.</TabPanel>
      <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
      <TabPanel id="Emp">Alea jacta est.</TabPanel>
    </TabPanels>
  </Tabs>
);
```

- [ ] **Step 10.7: Create `stories/bootstrap-test/Calendar.stories.tsx`**

```tsx
import { Calendar } from '../../src/bootstrap-test/Calendar';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Calendar> = {
  title: 'Bootstrap Test/Calendar',
  component: Calendar,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Calendar>;

export const Example: Story = (args) => (
  <Calendar aria-label="Event date" {...args} />
);
```

- [ ] **Step 10.8: Create `stories/bootstrap-test/ListBox.stories.tsx`**

```tsx
import { ListBox, ListBoxItem, ListBoxSection } from '../../src/bootstrap-test/ListBox';
import { Header } from 'react-aria-components/Header';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof ListBox> = {
  title: 'Bootstrap Test/ListBox',
  component: ListBox,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof ListBox>;

export const Example: Story = (args) => (
  <ListBox aria-label="Ice cream flavor" {...args}>
    <ListBoxItem>Chocolate</ListBoxItem>
    <ListBoxItem>Mint</ListBoxItem>
    <ListBoxItem>Strawberry</ListBoxItem>
    <ListBoxItem>Vanilla</ListBoxItem>
  </ListBox>
);

Example.args = {
  onAction: undefined,
  selectionMode: 'single'
};

export const Sections: Story = (args) => (
  <ListBox aria-label="Sandwich contents" selectionMode="multiple">
    <ListBoxSection>
      <Header>Veggies</Header>
      <ListBoxItem id="lettuce">Lettuce</ListBoxItem>
      <ListBoxItem id="tomato">Tomato</ListBoxItem>
      <ListBoxItem id="onion">Onion</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <Header>Protein</Header>
      <ListBoxItem id="ham">Ham</ListBoxItem>
      <ListBoxItem id="tuna">Tuna</ListBoxItem>
      <ListBoxItem id="tofu">Tofu</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <Header>Condiments</Header>
      <ListBoxItem id="mayo">Mayonaise</ListBoxItem>
      <ListBoxItem id="mustard">Mustard</ListBoxItem>
      <ListBoxItem id="ranch">Ranch</ListBoxItem>
    </ListBoxSection>
  </ListBox>
);

- [ ] **Step 10.9: Commit**

```bash
git add stories/bootstrap-test/
git commit -m "feat: add bootstrap-test stories with .bs-test decorator"
```

---

## Task 11: End-to-End Verification

- [ ] **Step 11.1: Start Storybook and verify both story groups appear**

```bash
yarn storybook
```

In the Storybook sidebar, confirm:
- Original component stories (Button, TextField, etc.) appear at the top level
- A `Bootstrap Test` group appears with all 7 components inside it

- [ ] **Step 11.2: Verify Bootstrap CSS is scoped**

Click any `Bootstrap Test/Button` story. Inspect the component in DevTools — it should be wrapped in a `<div class="bs-test">` element.

Click a regular `Button` story. Confirm there is no `.bs-test` wrapper.

- [ ] **Step 11.3: Verify Bootstrap styles are loading**

In DevTools → Elements → select the `.bs-test` wrapper. Confirm that Bootstrap's CSS variables (`--bs-primary`, etc.) are defined on the `.bs-test` scope. The test stories may look unstyled (the bootstrap-test copies are still unmodified) — that is expected. The important thing is that Bootstrap's CSS is loaded and scoped correctly.

- [ ] **Step 11.4: Verify React Aria MCP**

```bash
claude mcp list
```

Confirm `react-aria` appears. Test a query: ask Claude Code "What props does the React Aria Button component accept?" and confirm it answers using MCP data.

- [ ] **Step 11.5: Final commit and push**

```bash
git add .
git status  # verify only expected files are staged
git commit -m "chore: complete experiment setup — ready for iteration 0"
gh repo view  # confirm GitHub remote is configured
git push -u origin main
```

---

## Notes

**Bootstrap CSS vendor files:** Bootstrap SCSS is imported directly from `node_modules/bootstrap/scss/bootstrap` via sass-loader (which resolves `node_modules` paths automatically). The vendor directory mentioned in `agent/experiment-spec.md` is not needed — `node_modules` serves this purpose.

**`npx skills add` investigation:** The command `npx skills add https://react-aria.adobe.com` is listed in React Aria's AI docs but its system is unverified. Document outcome in Task 4, Step 4.3.

**`:root` leakage:** Bootstrap's CSS custom properties (`--bs-*`) and Reboot resets (html/body font/margin) load globally even with `.bs-test` scoping. This is a known CSS limitation. Original stories will see Bootstrap's Reboot and token values on `:root`. Component-level styles are fully scoped.
