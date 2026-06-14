# Notes

* Most of this workflow exists already and has been tested.

  * The pieces are currently scattered throughout the multiple experimental branches in the repo.

  * In some cases, I am not certain which branch has the most recent version of a given skill.

  * Part of this task will be curating and consolidating the most complete versions into a unification branch.

* There are still untested gaps and inconsistencies in this workflow. I’d like your help identifying them and planning the means of testing and resolving inconsistencies.

* This document is imperfect, incomplete, and inconsistent (both internally and with aspects of the actual workflows).

* The goal of this planning session is to:

  * Iron out the end-to-end workflow outlined in this document and in the project repo.

  * Standardize conventions, prompt templates, findings doc templates, acceptance criteria, directory structures, etc.

  * Produce a clear and consistent specification of the workflow.

    * Specification will then be used by superpowers to implement the refined workflow in the form of skills and supporting docs.

* Every principle, rule, and component decision has a unique ID

  * IDs are in various formats depending on the mood of the agent at the time. These will need to be consolidated and formalized.

* Iteration logs list the IDs of principles, rules, and decisions applied to each agent decision or implementation step

* Need to comb through and refine skill docs.

  * Challenge every paragraph

  * Eliminate redundancies and dead wood

* Need to standardize prompt and output templates across skills and workflow phases

* Need to clean up and standardize naming conventions, iteration conventions, and directory structures.

  * Final components are currently deposited in `src/bootstrap-test`. Change to something like `src/styled-components`.

  * Where should `augments.scss` live?

* I backed away from the complexity of a multi-agent workflow in which each story in the final implementation has a dedicated sub-sub-agent to perform the comparison and interpret the diffs. In the end, complexity alone was not the decisive reason for abandoning this approach, but the fact that too much nuanced context was lost when the comparison agent translated its findings and theories into a written hand-off.

  * I believe there are still meaningful roles for sub-agents and possibly even sub-sub-agents in the full workflow lifecycle.

  * I would like you to help me identify opportunities to create efficiency, speed things up, and manage context through parallelism.

* Many phases of the workflow are intended to be iterative, with each iteration producing a log of the outcome, user review feedback, and workflow updates and refinements based on the user’s feedback.

  * I’d like to standardize the conventions around these iterations and the review docs they produce.

* We will likely need to look across multiple branches to find the latest versions of the various skill files and other agent docs. For this reason, I have included on this branch:

  * `agent/notes/experiments.md`: the log of all experimental branches.

  * `agent/notes/skills-review.md`: a round-up of all versions of the various skills across experimental branches.

# Workflow

## **Bootstrap knowledgebase (KB)**

Agent generates a knowledgebase from Bootstrap code. This is a one-time task, to be repeated only if Bootstrap is updated or a different CSS framework or design system is used in place of Bootstrap.

### **Notes**

* [Details from branch \`bootstrap-mapping\`](https://github.com/jungerino/react-aria-bootstrap/blob/bootstrap-mapping/agent/bootstrap-mapping-plan.md#file-map)

* **Question:** is there a role for Bootstrap’s documentation site in authoring the KB?

### **Inputs**

* `agent/generating-knowledge-base-skill.md`

  * **To-do:** knowledge base construction should have its own skill. It is currently combined with the mapping skill.

* Bootstrap source SCSS

* Bootstrap compiled CSS

### **Tasks**

* Use skill to generate knowledgebase files

### **Outputs**

* Knowledge base files:

  * `agent/bootstrap-kb/README.md`

  * `agent/bootstrap-kb/components.md`

  * `agent/bootstrap-kb/patterns.md`

  * `agent/bootstrap-kb/states.md`

  * `agent/bootstrap-kb/tokens.md`

  * `agent/bootstrap-kb/utilities.md`

## **Storybook set-up**

One-time tasks to prepare Storybook.

* `stories/react-aria-bootstrap/_decorators.tsx`

  * Currently named: `stories/bootstrap-test/_decorators.tsx`

  * Wires Bootstrap's dark mode to Storybook's background switcher.

## **Component batch**

User defines component batch.

### **Notes**

* Best to work with a limited number of react-aria components per batch.  
  (\~5 components per batch)

  * To avoid overloading context window

  * To accumulate learning iteratively

* Select components representing a diversity of the patterns and styling requirements found across the full inventory.

### **Outputs**

* List of components in the batch, for example:

  * `Select`

  * `ListBox`

  * `Button`

  * `Tabs`

  * `Calendar`

## **Component taxonomies**

Agent generates taxonomies mapping react-aria components and sub-components to their Bootstrap counterparts. (One taxonomy file per component.)

Precursor to ‘Reference stories’ and ‘Implementation’ phases.

### **Notes**

* ‘Taxonomy’ may not be the best term for the artifact generated during this phase, which includes:

  * Component and sub-component mappings

  * Itemized variants

  * State mappings

  * DOM conflicts

  * Component-specific decisions (derived during taxonomy and reference story phases)

### **Questions**

* Is there a role for Bootstrap’s SCSS in generating taxonomies, or just the compiled CSS?

* Is there a role for Bootstrap’s documentation site?

### **Inputs**

* Component batch

* `agent/bootstrap-kb/*`

* `agent/generating-taxonomies-skill.md`

  * **To-do:** currently includes reference stories principles. Should be separated.

* Bootstrap CSS

* react-aria MCP

### **Outputs**

* `agent/component-taxonomies/*`

  * `agent/component-taxonomies/{component}-taxonomy.md`

    * Header — component name, mapping type (1:1 or Composite), React Aria root class.

    * Sub-parts table — each named sub-element with its React Aria selector, Bootstrap counterpart, and primary Bootstrap classes.

    * Variants table — every dimension of variation (size, input type, validation state, etc.) with React Aria prop/value, Bootstrap modifier class, which system is authoritative, and notes on conflicts or open decisions.

    * State mappings — per sub-part tables of every data-\* attribute, which sub-part it affects, the Bootstrap equivalent, and bridge strategy. Followed by a pseudo-class audit table explicitly marking each Bootstrap selector as ACTIVE or INERT.

    * DOM conflicts — a table of structural mismatches between what React Aria renders and what Bootstrap expects, categorized by severity (MINOR/MAJOR) with a proposed resolution.

    * Reference story canvas — a prose planning note listing which stories will be written, approximate grid layout, width constraints, and any specimen-level notes.

    * Confidence rating — a short qualitative assessment of how clean the mapping is.

    * Decisions — resolved forks, recorded after user review.

* `agent/component-taxonomies/iteration-review-{N}.md`

  * Per component

    * IDs of principles, rules, and directions applied to each agent decision or implementation step

    * Decisions needed

      * Agent encounters ambiguities and forks in the road during taxonomy formation.

        * “When the mapping encounters a genuine fork — multiple legitimate Bootstrap variants for the same semantic role, or a React Aria feature with multiple viable Bootstrap implementation paths — do not resolve it unilaterally.”

      * User’s answers are added to a `## Decisions` section of the taxonomy.

      * Examples:

        * Use Bootstrap’s `Dropdown` styling for react-aria’s `Select` component.

          * Bootstrap’s `Select` is based on a native html ‘select’ input.

          * React-aria’s `Select` uses a trigger button and popover-menu approach, which is closer to Bootstrap’s `Dropdown`.

        * Surface size variants as a react-aria prop

        * [https://github.com/jungerino/react-aria-bootstrap/blob/f71a5e51b659928e2b37e906d4a192b0c9de217b/agent/review-textfield.md](https://github.com/jungerino/react-aria-bootstrap/blob/f71a5e51b659928e2b37e906d4a192b0c9de217b/agent/review-textfield.md)

### **Review**

* User provides decisions

* Agent logs decisions in  `## Decisions` section of the component taxonomy.

* Agent updates taxonomies per decisions

## **Reference stories**

Agent generates Bootstrap reference stories consisting of Bootstrap html (drawn from Bootstrap’s documentation site) and Bootstrap styling.

For each react-aria component, the goal is to represent every sub-component, variant, and state using Bootstrap html and styling.

### **Notes**

* Reference stories serve multiple purposes:

  * Surface stylistic decisions and judgement calls for the user to weigh in on

    * Examples:

      * Use checkbox-style indicators for multi-select ListBox items.

      * Use Bootstrap’s `.dropdown-header` styling for `ListBox` section headers

  * As visual artifacts, reference stories are faster and easier for a human to review than taxonomies.

  * They become the reference targets for visual regression testing during the component styling phase.

* Agent generates Bootstrap reference stories consisting of:

  * Bootstrap html (from documentation site)

  * SCSS augmentations to spoof interaction states (e.g. `.faux-hover`, `.faux-active`, etc.) and fill styling gaps

  * Stories for every component and sub-component

  * Stories and specimens for every variant and state

* Visual confirmation of taxonomy decisions for user review

* Visual reference for eventual agent visual comparison

### **Inputs**

* Component batch

* `agent/component-taxonomies/*`

* Bootstrap documentation site for html

### **Outputs**

* Reference stories

  * `stories/react-aria-bootstrap/reference/{component}.reference.stories.tsx`

* `agent/reference-stories/iteration-review-{N}.md`

* `augments.scss`

  * Additional styles to spoof states, fill styling gaps, and lay out specimens

* Reference stories extracted CSS

  * Extracted using the script `scripts/extract-story-css.mjs`

  * Provides component agent with all relevant selectors and rules, so that it does not have to ingest and search through `node_modules/bootstrap/dist/css/bootstrap.css`

  * `agent/story-css/reference/{component}-{story}.css`

  * Need to validate that extracted CSS is a sufficient substitute for compiled `bootstrap.css`

### **Review**

* User reviews reference stories

* User requests specific changes as needed

* Requested changes are implemented and logged in `agent/component-decisions.md`

## **Styled components**

### **Notes**

* Workflow begins with the agent using playwright to capture screenshots of the reference stories.

  * Reference stories will not change, so this is a one-time capture per story.

  * Agent should read the reference images into context only once.

* This stage of the workflow consists of several phases:

  * Phase 1: iterative branch set-up

    * Should include reference story screen captures

  * Phase 2: mirror story creation

    * Agent performs self-guided cycles of story implementation and comparison.

  * Phase 3: final story creation

    * Once the mirror stories pass comparison, final story creation is expected to be straightforward and predictable.

* Like most other stages of the overall workflow, this one is intended to be iterative. Unless and until the agent turns out perfect results in the first pass.

  * To be clear, there are multiple levels of iteration at this stage. There is the self-guided iteration performed by the agent in cycles of  implementation and comparison. This is distinct from the iterations of user review and feedback.

* Mirror-story extracted CSS is both an input and an output. It is an output following every round of agent implementation. And it is an input for subsequent rounds of implementation.

  * Like the reference story extracted CSS, the purpose is to spare the agent from having to ingest the compiled `bootstrap.css` into context and repeatedly search through it.

  * Need to validate that extracted CSS is a sufficient substitute for compiled `bootstrap.css`.

### **Inputs**

* `agent/react-aria-skill/SKILL.md`

* `agent/bootstrap-kb/*`

* `agent/component-taxonomies/*`

* reference story screen captures

* `agent/story-css/reference/*`

* `agent/story-css/mirror/*`

### **Outputs**

* mirror story screen captures and diffs

* `agent/reference-stories/iteration-review-{N}.md`

* `agent/story-css/mirror/*`

* mirror stories

* Component-level findings

  * Summary table of per-story status.

    * Story name

    * Status

    * Iteration count

    * Stuck count

    * Latest diff%

  * Log of each story iteration, including:

    * Story-level findings (copied from story-level findings)

    * Principles consulted

    * Code changes made (including shared selectors modified)

* Story-level findings

  * Front-matter

    * Status: In review | Pass | Fail | Stuck | Context exhausted | Script failed

    * Iteration: {N}

    * Stuck: {N}

  * Per-iteration findings

* **Styled components** (the end product)

