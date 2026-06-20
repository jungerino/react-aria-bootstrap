# Bootstrap KB Generation Skill

Use this skill when an agent needs to build or rebuild the Bootstrap knowledge base at `agent/bootstrap-kb/`.

## When to use

- **Initial project setup** — `agent/bootstrap-kb/` does not yet exist or is missing files
- **Bootstrap version upgrade** — re-derive all files from the new SCSS source after upgrading
- **New component added to scope** — append entries to `components.md` and `patterns.md`; update `README.md` index; no need to regenerate other files

## Generation Principles

1. **Two-source rule:** Every KB file must consult both sources. SCSS source (`src/scss/vendor/bootstrap-5.3.8/`) for token names, variable defaults, and source structure. Compiled CSS (`node_modules/bootstrap/dist/css/bootstrap.css`) for the complete selector surface. Mixin-generated selectors (`:invalid`, `:valid`, `:checked` compound patterns from `@each` loops) are only visible in the compiled output — they do not appear as literal strings in SCSS source.

2. **File ordering:** Write files in this order: tokens → utilities → states → components → patterns → README. README is always last — it cross-references the five files written before it.

3. **Compiled CSS is authoritative for selectors:** Before finalizing any state mapping, grep the compiled CSS for the component's primary class. Example: `grep -n "\.btn" node_modules/bootstrap/dist/css/bootstrap.css` to confirm the exact selector surface.

4. **Do not infer token names:** Before recording any `--bs-*` token, confirm it exists in `_root.scss` or the component's own SCSS file. Names can be misleading (e.g. `--bs-input-focus-color` is the text color, not the focus ring color).

5. **Bridge file:** The current bridge layer is `src/scss/_bootstrap-bridges.scss`. When documenting patterns and bridge strategies, reference this file — not the old `_bootstrap-overrides.scss` name.

---

## File 1: tokens.md

**SCSS sources:**
- `src/scss/vendor/bootstrap-5.3.8/_variables.scss` — all SCSS variable defaults (read in 500-line chunks)
- `src/scss/vendor/bootstrap-5.3.8/_root.scss` — CSS custom property definitions (188 lines)

**Frontmatter template:**
```markdown
---
what: Bootstrap 5.3.8 CSS custom properties (--bs-* tokens) reference
contains: All tokens grouped by category with default values, semantic roles, and which components consume them. SCSS variable name mapped to CSS custom property name.
when-to-load: When you need to know what tokens are available for a component's appearance, or when building CSS bridge rules that override Bootstrap defaults.
related: components.md for which component uses which token; states.md for state-specific token overrides
---
```

**Table structure:** `| CSS property | Default value | Semantic role | Components that use it |`

**Section list:**
1. Color — Palette base (`--bs-blue`, `--bs-red`, gray scale `--bs-gray-100` through `-900`)
2. Color — Theme (`--bs-primary` through `--bs-dark` + `-rgb` variants)
3. Color — Semantic (`--bs-body-color`, `--bs-body-bg`, `--bs-emphasis-color`, `--bs-secondary-color`, `--bs-tertiary-*`, `--bs-link-*`)
4. Color — Text/Border emphasis (`--bs-*-text-emphasis`, `--bs-*-bg-subtle`, `--bs-*-border-subtle`)
5. Typography (`--bs-font-sans-serif`, `--bs-font-monospace`, `--bs-body-font-family`, `--bs-body-font-size`, `--bs-body-font-weight`, `--bs-body-line-height`)
6. Border (`--bs-border-width`, `--bs-border-style`, `--bs-border-color`, `--bs-border-color-translucent`, all `--bs-border-radius-*`)
7. Shadow (`--bs-box-shadow`, `--bs-box-shadow-sm`, `--bs-box-shadow-lg`, `--bs-box-shadow-inset`)
8. Focus ring (`--bs-focus-ring-width`, `--bs-focus-ring-opacity`, `--bs-focus-ring-color`)
9. Form validation (`--bs-form-valid-color`, `--bs-form-valid-border-color`, `--bs-form-invalid-color`, `--bs-form-invalid-border-color`)
10. Component-level tokens — extract SCSS variables that become component-scoped CSS custom properties (Button `--bs-btn-*`, Form control `--bs-input-*`, Nav `--bs-nav-*`, etc.)

**Verification step:** After writing, re-read `_root.scss` and confirm every CSS custom property defined there has a corresponding entry in the table.

---

## File 2: utilities.md

**SCSS sources:**
- `src/scss/vendor/bootstrap-5.3.8/_utilities.scss` (read in 200-line chunks until EOF)
- `src/scss/vendor/bootstrap-5.3.8/utilities/_api.scss`

**Frontmatter template:**
```markdown
---
what: Bootstrap 5.3.8 utility class reference
contains: All utility classes grouped by concern. For each group: available values, class names generated, whether responsive variants exist, single vs. multi-property.
when-to-load: When building the "Bootstrap utilities" column of the mapping table, or when deciding how to handle layout/spacing/display for a React Aria component.
related: tokens.md for CSS custom properties; components.md for component-specific classes vs. utility classes
---
```

**Section list** (derive class names from the SCSS map; for each group note `Responsive: yes/no` and `Single vs. multi-property`):
1. Display (`.d-*`, responsive)
2. Flexbox (`.flex-*`, `.justify-content-*`, `.align-items-*`, `.align-self-*`, `.gap-*`, `.order-*`)
3. Spacing (`.m-*`, `.p-*` and directional variants, values 0–5 + auto, responsive)
4. Sizing (`.w-*`, `.h-*`, `.mw-100`, `.mh-100`, viewport variants)
5. Typography (`.text-*` alignment/wrap/transform, `.fs-*`, `.fw-*`, `.fst-*`, `.lh-*`, text color utilities)
6. Color / Background (`.text-*`, `.bg-*`, `.bg-opacity-*`)
7. Border (`.border`, directional, color, width, `.rounded-*`)
8. Shadow (`.shadow`, `.shadow-sm`, `.shadow-lg`, `.shadow-none`)
9. Opacity (`.opacity-*`)
10. Overflow (`.overflow-*`, x/y variants)
11. Position (`.position-*`, `.top-*`, `.bottom-*`, `.start-*`, `.end-*`, `.translate-middle-*`)
12. Visibility (`.visible`, `.invisible`)
13. Float (`.float-*`, responsive)
14. Vertical align (`.align-*`)
15. Object fit (`.object-fit-*`, responsive)
16. User select (`.user-select-*`)
17. Pointer events (`.pe-*`)
18. Screen reader (`.visually-hidden`, `.visually-hidden-focusable`)
19. Stack helpers (`.hstack`, `.vstack` — helpers, not utilities; multi-property)

---

## File 3: states.md

**SCSS sources (read all):**
`_buttons.scss`, `_nav.scss`, `forms/_form-control.scss`, `forms/_form-check.scss`, `forms/_form-select.scss`, `forms/_form-range.scss`, `forms/_validation.scss`, `_list-group.scss`, `_dropdown.scss`, `_accordion.scss`, `_modal.scss`, `_pagination.scss`, `helpers/_focus-ring.scss`

**Compiled CSS grep command (run after reading SCSS):**
```bash
grep -n ":invalid\|:valid\|:checked\|:indeterminate\|:placeholder-shown\|was-validated\|\.is-invalid\|\.is-valid" \
  node_modules/bootstrap/dist/css/bootstrap.css
```
Document any selectors that appear in the compiled CSS but not as literal strings in the SCSS source — these are mixin-generated cases that must be explicitly captured.

**Frontmatter template:**
```markdown
---
what: Bootstrap 5.3.8 state and interaction reference
contains: For each state: CSS selector Bootstrap uses, visual change produced, components it applies to, and React Aria data-* equivalent. Includes JS state mutation catalog and bridge strategy overview.
when-to-load: ALWAYS during the mapping phase. Primary source for the "State mappings" column of mapping-table.md.
related: components.md for component-specific state context; patterns.md for JS mutation conflicts
---
```

**State Catalog table:**
`| State | Bootstrap selector(s) | How applied | Visual effect | React Aria data-* equivalent |`

States to document: Hover (`:hover`), Focus (`:focus`, `:focus-visible`, `.focus-ring` helper), Active / Pressed (`:active`; `.active` on nav/list-group/pagination), Disabled (`:disabled`, `[disabled]`, `.disabled`), Checked (`:checked`), Selected (`.active` on list-group/dropdown items), Expanded / Open (`.show`), Collapsed (`.collapse`, `.collapsing`), Valid (`.is-valid`; `:valid` with `was-validated`), Invalid (`.is-invalid`; `:invalid` with `was-validated`), Read-only (`[readonly]`), Indeterminate (`:indeterminate`), Placeholder shown (`:placeholder-shown`)

**JS State Mutations section:** For each JS-toggled class: what adds it, what element it targets, what it reveals/selects. Cover `.show`, `.active`, `.collapse`/`.collapsing`/`.show`.

**Bridge Strategy Overview section:**
1. **CSS pseudo-class overlap** — React Aria's `[data-focused]` is redundant with `:focus-visible`; no bridge needed.
2. **Compound selector bridge** — React Aria never adds `.active`/`.show`; use `[data-selected]` or `[data-open]` in compound selectors (e.g. `.react-aria-ListBoxItem[data-selected]`) to reproduce `.active` visual styling.
3. **`_bootstrap-bridges.scss`** — Global bridge layer at `src/scss/_bootstrap-bridges.scss` for rules shared across multiple components.

---

## File 4: components.md

**Sources:**
- All component SCSS files listed in the file map (forms, navigation, overlays, collections, feedback)
- Bootstrap docs pages via WebFetch for compound components where DOM structure is unclear from SCSS alone. Prioritize: input-group, dropdowns, navs-tabs, accordion, select, checks-radios.

**Frontmatter template:**
```markdown
---
what: Bootstrap 5.3.8 component class and DOM structure reference
contains: For each Bootstrap component: primary classes, modifier classes, expected DOM tree, sub-element roles, JS-driven class mutations, cross-references.
when-to-load: During mapping — load the specific component entry, not the whole file. Do not load the entire file into context at once.
related: states.md for state-specific selectors; patterns.md for Bootstrap↔React Aria DOM conflicts; tokens.md for component-level tokens
---
```

**Per-component template:**
```markdown
## ComponentName

**Primary class:** `.component-name`
**Modifier classes:** list all
**JS mutations:** classes Bootstrap JS adds/removes
**Expected DOM:**
```html
<div class="component-name">
  <element class="component-name-part">...</element>
</div>
```
**Sub-elements:** role of each sub-element class
**Cross-references:** related components
```

**Components to document (31):**
Button, Button Group, Form Control / Text Input, Form Select, Form Check (checkbox/radio), Form Switch, Form Range, Input Group, Floating Labels, Form Label, Form Text, Dropdown, Nav / Tabs, Navbar, List Group, Breadcrumb, Pagination, Accordion, Modal, Offcanvas, Popover, Tooltip, Alert, Badge, Progress, Spinner, Toast, Card, Table, Close Button, Separator/Divider

---

## File 5: patterns.md

**Sources:**
- `src/scss/_bootstrap-bridges.scss` — current bridge layer; read first
- React Aria MCP (`mcp__react-aria__get_react_aria_page`) for components with known DOM conflicts
- Bootstrap docs via WebFetch for highest-conflict components (dropdowns, select, navs-tabs, checks-radios, input-group)

**Frontmatter template:**
```markdown
---
what: Bootstrap↔React Aria structural pattern analysis
contains: How Bootstrap structures compound components; where React Aria's rendered DOM diverges from Bootstrap's expected DOM; where Bootstrap JS state mutations conflict with React Aria data-* attributes; proposed resolutions.
when-to-load: During mapping table construction for any component with a DOM conflict. Also load at the start of any mapping session.
related: states.md for state-level conflicts; components.md for Bootstrap's expected DOM; tokens.md for token-level customization that sidesteps DOM conflicts
---
```

**Section 1: Bootstrap Compound Component Patterns** — For each compound component, document Bootstrap's assumed DOM chain (e.g. `.input-group > .input-group-text | .form-control | .btn`).

**Section 2: DOM Conflict Register table:**
`| React Aria Component | React Aria DOM | Bootstrap Expects | Conflict | Resolution |`

Required entries:
- **Button** — likely low conflict; `.btn` attaches to React Aria's `<button>` directly
- **TextField** — label/input relationship; React Aria renders wrapper + label + input; Bootstrap's `.form-label` + `.form-control` should attach cleanly but verify wrapper doesn't break `.mb-3` spacing
- **Checkbox** — React Aria renders `<label>` root with custom visual `<div>`, not `<input type="checkbox">`; Bootstrap's `.form-check` targets native input; cannot use `.form-check-input` directly
- **Select** — React Aria renders `<button>` trigger + Popover + ListBox; Bootstrap's `.form-select` targets `<select>` element; must use dropdown pattern instead
- **Tabs** — React Aria's `TabList > Tab` maps well to `.nav.nav-tabs > .nav-link`; conflict is state: React Aria uses `[data-selected]`, Bootstrap uses `.active`
- **Calendar** — no Bootstrap calendar component; use `.btn.btn-sm` for cells, table utilities for grid; keep Calendar.css for grid layout
- **ListBox** — React Aria's `ListBox > ListBoxItem` maps to `.list-group > .list-group-item`; sections/headers may insert intermediate elements that break Bootstrap's structural selectors

**Section 3: JS State Mutation Conflicts** — For each Bootstrap component where JS adds/removes classes, document the React Aria data-* attribute that replaces it and the bridge strategy.

**Section 4: Bootstrap Patterns That Compose Well** — `.badge`, `.alert`, `.table`, `.progress`/`.progress-bar`, `.breadcrumb`/`.breadcrumb-item`.

---

## File 6: README.md

**Write last.** Read all five KB files before writing — README cross-references them.

**Frontmatter template:**
```markdown
---
what: Bootstrap Knowledge Base master index and retrieval guide
contains: Component index; utility category index; token category index; cross-reference hints; retrieval rules.
when-to-load: ALWAYS load this file first. It is the entry point for all KB lookups.
related: All other files in agent/bootstrap-kb/
---
```

**Retrieval Rules section:**
```
"What --bs-* token controls X?" → tokens.md
"What utility class does Y?" → utilities.md
"What state selector does Bootstrap use for Z?" → states.md
"What DOM structure does Bootstrap's Accordion expect?" → components.md#accordion
"Will React Aria's Select conflict with Bootstrap?" → patterns.md
"What modifier classes does .btn have?" → components.md#button
```

**Bootstrap Component Index** — one line per component, alphabetical, with "see also" cross-references

**Utility Category Index** — one line per category

**CSS Token Category Index** — one line per category with approximate token count

**Cross-Reference Hints** — key relationships between components that share token space or structural patterns

**KB Completion Status table:**
```
| File | Status | Last updated |
|------|--------|-------------|
| tokens.md | Complete | YYYY-MM-DD |
| utilities.md | Complete | YYYY-MM-DD |
| states.md | Complete | YYYY-MM-DD |
| components.md | Complete | YYYY-MM-DD |
| patterns.md | Complete | YYYY-MM-DD |
```

---

## Self-Review Checklist

Before reporting the KB as complete:

- [ ] All 6 files present in `agent/bootstrap-kb/`: tokens.md, utilities.md, states.md, components.md, patterns.md, README.md
- [ ] Every CSS custom property defined in `_root.scss` has a corresponding entry in tokens.md
- [ ] The compiled-CSS grep command was run for states.md; mixin-generated selectors are captured
- [ ] components.md has approximately 31 component entries (`grep -c "^## " agent/bootstrap-kb/components.md`)
- [ ] tokens.md has 80+ token entries (`grep -c "| \`--bs-" agent/bootstrap-kb/tokens.md`)
- [ ] states.md has 13+ state sections (`grep -c "^## " agent/bootstrap-kb/states.md`)
- [ ] README.md completion table is filled in with actual dates
- [ ] patterns.md references `src/scss/_bootstrap-bridges.scss` (not the old `_bootstrap-overrides.scss` name)
- [ ] README.md is the last file written in this session
