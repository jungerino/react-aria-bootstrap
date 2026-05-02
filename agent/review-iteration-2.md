---
title: Review — Iteration 2
---

# Review — Iteration 2

## Session Notes (Meta)

This iteration was unusual and the review should be read with that context in mind.

**What went wrong:**
- Storybook was non-functional for the entire implementation phase. The webpack devserver (an 18-hour-old process) entered an HMR reload loop after source changes, never stabilizing long enough to render a preview. Visual comparison — the primary quality gate — was never performed during implementation.
- The session ran long enough to trigger context compaction mid-work. When resumed, the agent was working from a conversation summary rather than direct session context. Some nuance in implementation decisions was lost.
- A significant portion of available context was consumed diagnosing the Storybook malfunction rather than doing implementation work.

**User preliminary score: 2/5** (assessed before visual comparison pass)

**Agent's self-assessment on root cause of regression:**
The user correctly identified that performance was *worse than before visual comparison was introduced*, which rules out "no visual feedback" as the primary explanation. Likely causes in order of impact:
1. Context compaction mid-implementation: resumed sessions have lower fidelity than fresh starts
2. Storybook debugging dominated context/attention during implementation — less careful thinking about UI quality
3. Writing all 7 components in one pass without any intermediate feedback loop, which is itself a risk even in an iteration-0 world

---

## Agent Iteration Summary

### Decisions made

**Button**
- Applied `.btn.btn-{variant}` compound classes. Added `variant` prop (9 Bootstrap variants) and `outline` boolean prop that maps to `.btn-outline-{variant}`.
- Pending state handled via `composeRenderProps` on `children` — shows `ProgressCircle` when `isPending`.
- Bridge selector: `[data-pressed]` → Bootstrap active state via `@include box-shadow()` mixin.
- Principles used: P001: compound-sel, P002: class-in-tsx, P003: scss-bridge, P007: variant-replace, P014: data-pressed, P015: mixin-active

**TextField**
- Applied `.form-label`, `.form-control`, `.form-text`, `.invalid-feedback` to corresponding RAC sub-components.
- `is-invalid` class added conditionally on `Input` based on `props.isInvalid` (checked at the component level).
- Bridge selector: `.react-aria-TextField[data-invalid]` → `border-color: var(--bs-form-invalid-border-color)` on the inner Input. `.react-aria-FieldError.invalid-feedback { display: block }` overrides Bootstrap's default-hidden state.
- Switched from `react-aria-components` main import to subpath imports for compile performance.
- Principles used: P001: compound-sel, P002: class-in-tsx, P003: scss-bridge, P004: conflict-css, P010: form-attach

**Checkbox**
- Bootstrap's `.form-check-input` can't be applied to RAC's composite structure (custom element, not native `<input>`), so full styling delivered via SCSS bridge (P010: form-attach).
- Kept SVG indicator element in the DOM; the SCSS bridge hides it (`svg { display: none }`) and replaces the visual with Bootstrap's `background-image` checkmark via CSS variables (P023: css-native-visual).
- States: `[data-selected]`, `[data-indeterminate]`, `[data-focus-visible]`, `[data-disabled]` all bridged to Bootstrap form-check CSS variables.
- Principles used: P001: compound-sel, P003: scss-bridge, P010: form-attach, P016: fixed-dims, P023: css-native-visual, P026: use-rem

**Select**
- Trigger: `.btn.btn-secondary.dropdown-toggle.w-100` with flex layout so `SelectValue` fills remaining space.
- Popover: `.dropdown-menu.show.p-0` — hardcoded `.show` because RAC manages open/close via mount/unmount, not class toggling (P025: hardcode-show).
- Items: render-prop className mapping `isFocused` → `.active`, `isSelected` → `.fw-bold`.
- Chevron icon removed — Bootstrap's `.dropdown-toggle` pseudo-element provides the caret natively (P023: css-native-visual). Switched from main import to `react-aria-components/Select` subpath.
- Bridge selectors: flex layout on trigger, `min-width: var(--trigger-width)` on popover, `cursor: pointer` on items.
- Principles used: P001: compound-sel, P002: class-in-tsx, P003: scss-bridge, P011: cursor-pointer, P012: match-dom, P023: css-native-visual, P025: hardcode-show

**Tabs**
- `TabList` → `.nav.nav-tabs`, `Tab` → `.nav-link`, `TabPanel` → `.tab-pane.show.active`.
- `SelectionIndicator` removed — Bootstrap nav-tabs handles active tab indication natively.
- Bridge selectors: `[data-selected]` → Bootstrap nav-tabs active CSS variables; `[data-disabled]` → disabled color + pointer-events-none; `.tab-pane { display: block }` to override Bootstrap's default hidden state (P025: hardcode-show equivalent).
- `cursor: pointer` bridge on Tab because RAC renders it as a `<div>`, not `<button>` (P011: cursor-pointer).
- Principles used: P001: compound-sel, P002: class-in-tsx, P003: scss-bridge, P011: cursor-pointer, P025: hardcode-show

**Calendar**
- No Bootstrap counterpart — pure custom implementation using Bootstrap utilities.
- Nav buttons: `.btn.btn-sm.btn-outline-secondary` with Bootstrap Icons (`bi-chevron-left/right`) replacing any SVG (P022: bs-icons).
- Calendar cells: `.btn.btn-sm.btn-outline-secondary` — transparent border at rest (P019: outline-base), body text color (P021: outline-text-color).
- States: `[data-today]` restores visible secondary border; `[data-selected]` full Bootstrap active state; `[data-pressed]` matches active state; `[data-unavailable]` line-through + opacity 0.5.
- Header cells: centered text, small font size.
- Switched to `react-aria-components/Calendar` subpath import.
- Principles used: P001: compound-sel, P002: class-in-tsx, P003: scss-bridge, P014: data-pressed, P019: outline-base, P021: outline-text-color, P022: bs-icons, P026: use-rem

**ListBox**
- `ListBox` → `.list-group`, `ListBoxItem` → `.list-group-item.list-group-item-action`.
- `isSelected` → `.active`, `isFocused && !isSelected` → `.list-group-item-secondary`, `isDisabled` → `.disabled`.
- Section headers: non-interactive, `background-color: var(--bs-secondary-bg-subtle)`.
- `cursor: pointer` bridge on items (P011: cursor-pointer).
- Removed `DropdownListBox`/`DropdownItem` exports that existed in the original file — not needed for this test component set.
- Principles used: P001: compound-sel, P002: class-in-tsx, P003: scss-bridge, P011: cursor-pointer, P030: section-group

---

### Uncertainties

- **TextField `is-invalid` detection**: Read `props.isInvalid` at component level rather than using the render-prop pattern. Uncertain if this correctly reflects server-side validation errors that RAC propagates differently.
- **Calendar cell sizing**: Used `width: 2.25rem; aspect-ratio: 1` for square cells. Not confident this is the right sizing, or that the overall grid layout aligns with the reference.
- **Select focus state on items**: Mapped `isFocused` → `.active` (same as Bootstrap dropdown hover state). This is also what selected items get. Used `fw-bold` for selected-but-not-focused to differentiate — uncertain if this is visually correct.
- **ListBox focused-but-not-selected state**: Used `.list-group-item-secondary` (a Bootstrap contextual color) rather than directly applying hover CSS variables. May look inconsistent.

---

### Unmapped states

- **Calendar `[data-focus-visible]`**: No explicit bridge selector added for keyboard focus on cells — relies on btn's default focus ring. May be insufficient.
- **Select `[data-invalid]`**: No invalid state styling on the Select trigger. Bootstrap forms don't have a canonical invalid-dropdown pattern.
- **TextField `[data-focus-visible]`**: Relies on `.form-control:focus` Bootstrap styles, which should fire. Not explicitly bridged.
- **Button `[data-focus-visible]`**: Relies on `.btn:focus-visible` Bootstrap default. Not explicitly bridged but Bootstrap handles this.

---

### Visual comparison

**NOT COMPLETED.** Storybook was non-functional throughout the implementation phase. The visual comparison loop was blocked until the user manually restarted Storybook after the session ended.

Visual comparison is the next required step before this review can be considered complete.

---

### Principle usage summary

| Principle | Times used | Components |
|-----------|-----------|------------|
| P001: compound-sel | 7 | All |
| P002: class-in-tsx | 6 | Button, TextField, Select, Tabs, Calendar, ListBox |
| P003: scss-bridge | 7 | All |
| P010: form-attach | 2 | TextField, Checkbox |
| P011: cursor-pointer | 3 | Select, Tabs, ListBox |
| P012: match-dom | 1 | Select |
| P014: data-pressed | 2 | Button, Calendar |
| P015: mixin-active | 1 | Button |
| P016: fixed-dims | 1 | Checkbox |
| P019: outline-base | 1 | Calendar |
| P021: outline-text-color | 1 | Calendar |
| P022: bs-icons | 1 | Calendar |
| P023: css-native-visual | 2 | Checkbox, Select |
| P025: hardcode-show | 2 | Select, Tabs |
| P026: use-rem | 2 | Checkbox, Calendar |
| P030: section-group | 1 | ListBox |
| P004: conflict-css | 1 | TextField |
| P007: variant-replace | 1 | Button |

**Unused principles:** P005, P006, P008, P009, P013, P017, P018, P020, P024, P027, P028, P029, P031, P032 (and any others not yet tallied — full list in react-aria-skill.md)

---

## Storybook Diagnostics

During the visual comparison pass, Storybook's preview iframe stalled twice and CPU load was noticeably high. The following test plan was recorded to diagnose root causes before resuming the comparison.

### Symptoms observed

- Preview iframe entered a persistent loading state (spinner, no render) after the agent edited `Button.tsx` mid-session and then navigated to a new story
- A second stall occurred on the TextField story without a file edit — suggesting navigation alone may trigger it
- Storybook manager console logged ~1956 "unable to determine source of event" errors (cross-iframe messaging failures)
- CPU was high during the session

### Hypotheses

1. **HMR + navigation race** — editing a file triggers HMR; if the agent navigates the tab during the HMR reload, the iframe gets stuck in a transitional state
2. **TextField component render hang** — the stall happened on TextField both times; could be a React Aria import issue or a missing subpath export causing a silent module error
3. **Cross-iframe messaging breakdown** — the 1956 manager errors suggest the Storybook shell lost its communication channel to the preview iframe; this can cascade into a permanent spinner
4. **Webpack dev-server exhaustion** — if the webpack process is near its memory/CPU ceiling, HMR rebuilds fail silently and the preview never updates

### Test plan

**Step 1 — Isolate HMR as the cause**
Restart Storybook fresh. Navigate between 6+ stories without editing any files. If the iframe never stalls, HMR interaction is the trigger. If it stalls anyway, the cause is navigation or component-level.

**Step 2 — Check the terminal during a stall**
When the spinner appears, immediately inspect the Storybook terminal output. Look for:
- Webpack compilation errors
- HMR update failures (`[webpack-dev-server] HMR update failed`)
- Module-not-found errors for subpath imports

**Step 3 — Check the preview iframe console directly**
Open Chrome DevTools, switch the JS console context to the `localhost:6006/iframe.html` frame (not the top-level manager frame). Look for React render errors, uncaught exceptions, or module resolution failures that the manager console wouldn't show.

**Step 4 — Test the TextField story in isolation**
Navigate directly to `http://localhost:6006/iframe.html?id=bootstrap-test-textfield--example&viewMode=story` in a fresh tab. If it also spins, the component itself has a render problem. If it renders fine, the issue is the Storybook shell/manager.

**Step 5 — Identify CPU source**
While Storybook is idle (no rebuild in progress), run `top -o cpu` in a terminal. Determine whether the CPU is consumed by `node` (webpack watch), `sass`/`lightning-css`, or something else. High idle CPU points to a polling or watch loop problem.

**Step 6 — Check webpack chunk strategy**
After a file save, note the HMR rebuild time logged in the terminal. If every save triggers a full bundle rebuild (not an incremental chunk update), the project's webpack config may lack proper code splitting, explaining both the CPU cost and the fragile HMR behavior.

### Recommended process change (pending diagnosis)

Regardless of root cause: **do all visual comparison screenshots before making any file edits**. Edits should be batched and applied only after all screenshots are captured, then Storybook is reloaded once for a confirmation pass.

---

## User Visual Review

*Skipped — visual comparison step suspended as of iteration 2 debrief (see Debrief Decisions).*

---

## Debrief Decisions

**Visual comparison step suspended (Option A).**
During visual inspection, several real bugs were identified (invisible Checkbox indicator, missing Tabs active state, Calendar cells with visible borders at rest). However, the visual comparison workflow was judged to be counterproductive to skill formation — it is slow, token-intensive, and encourages large-batch implementations with late feedback rather than tight iteration loops.

Decision: move all visual comparison instructions to a suspended appendix in `agent/iteration-protocol.md` (Option A). The instructions are preserved for potential re-enablement. Future iterations rely on principle application and self-review checklist rather than live browser comparison.

---

## Skill Update Status

- [ ] `agent/react-aria-skill.md` updated with new/refined principles
- [ ] `agent/component-decisions.md` updated with component-specific decisions
- [ ] `CLAUDE.md` iteration number incremented
- [ ] This file: debrief decisions section complete
