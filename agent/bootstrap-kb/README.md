---
what: Master index for the Bootstrap 5.3.8 knowledge base used during bootstrap-mapping experiment iterations
contains: Overview of the KB's purpose, a file-by-file directory with load guidance, a cross-reference map, and completion status.
when-to-load: At the start of any iteration session before mapping work begins — establishes which files to load for a given task.
---

# Bootstrap Knowledge Base — Master Index

This knowledge base documents Bootstrap 5.3.8 at the level of detail needed to produce accurate mappings between React Aria Components and Bootstrap's visual system. It is agent-oriented: each file has a `when-to-load` frontmatter field that tells you exactly when to load it.

**Branch**: `bootstrap-mapping`  
**Bootstrap version**: 5.3.8 (source at `src/scss/vendor/bootstrap-5.3.8/`)  
**Total KB size**: ~2,430 lines across 5 files

---

## File Directory

### [tokens.md](./tokens.md)
**What**: All Bootstrap CSS custom properties (`--bs-*`) generated at runtime, grouped by concern.  
**Contains**: 10 token groups — color/theme, text/background emphasis, body, border, border-radius, box-shadow, focus ring, typography, form, component-level tokens. Plus dark-mode overrides.  
**Load when**: Writing CSS that references Bootstrap tokens; choosing which `--bs-*` variable to override for a component; auditing what a component's visual appearance is driven by.

### [utilities.md](./utilities.md)
**What**: All Bootstrap utility class names, values, and responsive variants.  
**Contains**: 21 utility groups — display, flexbox, spacing (margin/padding/gap), sizing, typography, color/background, border, shadow, opacity, overflow, position, visibility, float, vertical-align, object-fit, user-select, pointer-events, visually-hidden, stack helpers, z-index, focus ring. Responsive breakpoint behavior noted per group.  
**Load when**: Building the "Bootstrap utilities" column of any mapping table; deciding how to apply layout, spacing, or display constraints to a React Aria wrapper element.

### [states.md](./states.md)
**What**: How Bootstrap encodes and styles interactive states; bridge strategies for mapping React Aria `data-*` attributes to Bootstrap state selectors.  
**Contains**: State catalog table (13 states × mechanism/selector/token columns), detailed notes per state, JS mutation class catalog (8 classes), and three bridge strategies: (1) native CSS pseudo-class overlap, (2) compound selector bridge in component CSS, (3) `_bootstrap-overrides.scss` global layer.  
**Load when**: Writing bridge CSS rules; deciding how to handle a state that Bootstrap triggers via JS class toggle but React Aria signals via `data-*` attribute.

### [components.md](./components.md)
**What**: Bootstrap's expected DOM structure and CSS for every component likely to be mapped.  
**Contains**: 31 components — each entry has: primary class, modifier classes, JS-toggled state classes, expected HTML DOM snippet, sub-element class list, state selectors, and cross-references to token groups.  
**Load when**: Starting a new component mapping to understand what Bootstrap's DOM shape, classes, and state selectors require. This is the first file to load for any new component.

### [patterns.md](./patterns.md)
**What**: Compound component patterns, DOM conflict register, JS state mutation conflicts, and composable patterns.  
**Contains**: Four sections — (1) Bootstrap compound component selector patterns with DOM shape for each, (2) DOM conflict register (8 conflicts, rated CRITICAL/MAJOR/MINOR) between React Aria's rendered DOM and Bootstrap's expected HTML, (3) JS state mutation conflicts table comparing Bootstrap `.show`/`.active`/`.collapsed`/`.is-invalid` classes with React Aria `data-*` equivalents, (4) Bootstrap patterns that compose cleanly with React Aria (utilities, single-element components, native-input fields, Button, Link).  
**Load when**: Assessing feasibility for a new component before writing any CSS; choosing a bridge strategy; understanding why a particular Bootstrap pattern does or does not apply.

---

## Cross-Reference Map

Use this to find information across files when the concern spans multiple KB files.

| Question | Primary file | Secondary file |
|---|---|---|
| What CSS vars does `.btn` use? | tokens.md (§ Component-Level) | components.md (Button entry) |
| How does Bootstrap show `:hover` styling on a button? | states.md (hover row) | components.md (Button state selectors) |
| What class applies `.dropdown-menu`? | components.md (Dropdown) | states.md (`.show` JS mutations) |
| Can I use `.gap-3` on a React Aria wrapper? | utilities.md (§ Flexbox > Gap) | patterns.md (§ 4.1 Utility classes) |
| How do I handle checkbox styling? | patterns.md (§ 2.1 DOM Conflict) | tokens.md (§ 9 Form Tokens) |
| What bridge strategy handles `.active` on tabs? | states.md (§ Bridge Strategies) | patterns.md (§ 3.2 Conflict table) |
| Which Bootstrap tokens scope to `:root`? | tokens.md (§ 1 Color/Theme) | — |
| What does `.form-control:focus` set? | states.md (focus-visible row) | tokens.md (§ 8 Focus Ring) |
| How does Bootstrap reveal a modal? | components.md (Modal) | patterns.md (§ 3.2 `.show`) |
| What is the floating label DOM constraint? | patterns.md (§ 2.3 Floating Labels) | components.md (Floating Labels) |
| Which components compose without conflict? | patterns.md (§ 4 Compose Well) | components.md (relevant entries) |
| What breakpoints does Bootstrap support? | utilities.md (intro paragraph) | — |

---

## How to Use This KB in an Iteration

A typical mapping iteration proceeds as follows:

1. **Load `components.md`** — identify the Bootstrap DOM shape for the target component.
2. **Load `patterns.md`** — check the DOM conflict register and JS mutation conflict table for the component.
3. **Load `states.md`** — determine bridge strategy for each interactive state.
4. **Load `tokens.md`** — identify which `--bs-*` variables drive the visual properties you need to match.
5. **Load `utilities.md`** — only if applying utility classes to wrappers or resolving a layout concern.

Not all files are needed for every iteration. Simple utility-class work needs only `utilities.md`. Complex component work (Checkbox, Select, Modal) needs all five.

---

## Completion Status

| File | Status | Lines | Committed |
|---|---|---|---|
| tokens.md | Complete (compiled CSS audit: 2026-05-08) | 782 | Yes |
| utilities.md | Complete (compiled CSS audit: 2026-05-08) | 503 | Yes |
| states.md | Complete (compiled CSS audit: 2026-05-08) | 276 | Yes |
| components.md | Complete (compiled CSS audit: 2026-05-08) | 799 | Yes |
| patterns.md | Complete (compiled CSS audit: 2026-05-08) | 589 | Yes |
| README.md | Complete | — | Yes |

---

## Scope and Limitations

- **Bootstrap version**: 5.3.8 only. Class names and token structures differ in earlier versions.
- **React Aria version**: Documentation was fetched at session time. Component DOM and `data-*` attributes should be verified against the installed version before writing production CSS.
- **Completeness**: The KB documents what Bootstrap CSS and DOM structure *require*. It does not prescribe specific bridge CSS implementations — those are written and verified during mapping iterations.
- **Source of truth — tokens**: Always prefer reading Bootstrap SCSS source in `src/scss/vendor/bootstrap-5.3.8/` for token names and values. The KB is a navigation and planning aid, not a substitute for the source.
- **Source of truth — selectors**: Always prefer reading the compiled CSS at `node_modules/bootstrap/dist/css/bootstrap.css` for the complete selector surface. Bootstrap uses `@each` loops and mixin interpolation to generate selectors (e.g. `.was-validated .form-control:invalid`) that do not appear as literal strings in the SCSS source. Grep the compiled CSS for a component's primary class to confirm what selectors actually exist before writing state mappings.
