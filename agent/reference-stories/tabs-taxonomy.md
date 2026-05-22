---
title: Tabs Taxonomy
component: Tabs
iteration: 0
---

## Tabs

**React Aria root class:** `.react-aria-Tabs`
**Mapping type:** 1:1 — Bootstrap Nav/Tabs (`.nav.nav-tabs`)

### Sub-parts

| Sub-part | React Aria selector | Bootstrap counterpart | Primary Bootstrap classes |
|----------|---------------------|-----------------------|--------------------------|
| Root | `.react-aria-Tabs` | (wrapper `<div>`) | No Bootstrap class; utility `d-flex flex-column` for vertical orientation |
| TabList | `.react-aria-TabList` | Nav | `.nav.nav-tabs` (or `.nav.nav-pills` / `.nav.nav-underline` per style variant) |
| Tab | `.react-aria-Tab` | Nav link | `.nav-link` (inside optional `.nav-item` wrapper — see DOM conflicts) |
| SelectionIndicator | `.react-aria-SelectionIndicator` | [NO DIRECT COUNTERPART] | Closest structural: an absolutely positioned `<span>` or `::after` pseudo-element; closest visual: the bottom-border applied by `.nav-link.active` serves the same purpose (Bootstrap handles active tab indication via the link's own border, not a separate element); alternatives considered: Bootstrap's `.nav-tabs` active state uses border tokens on `.nav-link.active` — no separate indicator element exists. SelectionIndicator is additive and optional. |
| TabPanels | `.react-aria-TabPanels` | Tab content wrapper | `.tab-content` |
| TabPanel | `.react-aria-TabPanel` | Tab pane | `.tab-pane` (visibility management overridden — see DOM conflicts) |

### Variants

| Dimension | React Aria | Bootstrap | Authority | Notes |
|-----------|-----------|-----------|-----------|-------|
| Tab style — underline tabs | `defaultSelectedKey` / appearance | `.nav.nav-tabs` | Bootstrap | Bottom-border active indicator; default Bootstrap tab style |
| Tab style — pills | (no prop) | `.nav.nav-pills` | Bootstrap | Filled background on active tab |
| Tab style — underline (minimal) | (no prop) | `.nav.nav-underline` | Bootstrap | Thin underline only; no surrounding border |
| Orientation — horizontal | `orientation="horizontal"` (default) | `.nav` default | React Aria | Standard horizontal layout; no Bootstrap modifier needed |
| Orientation — vertical | `orientation="vertical"` | [NO DIRECT COUNTERPART] | React Aria | Custom CSS: `flex-direction: column` on TabList; no Bootstrap modifier class |
| Keyboard activation | `keyboardActivation="automatic|manual"` | (no equivalent) | React Aria | Behavior-only; no visual difference |
| Disabled tab | `isDisabled` on Tab | `.nav-link.disabled` (tokens) | React Aria | React Aria sets `[data-disabled]`; `.disabled` class INERT |

### State mappings

**Tabs root (`.react-aria-Tabs`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part affected | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|-------------------|----------------------|-----------------|
| Orientation | `[data-orientation="horizontal|vertical"]` | Root + TabList | (layout modifier) | Compound selector on `[data-orientation="vertical"]` for flex-direction override |

**Tab (`.react-aria-Tab`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Hovered | `[data-hovered]` | Tab | `.nav-link:hover` | No bridge needed — `:hover` fires on the Tab element |
| Pressed | `[data-pressed]` | Tab | `.nav-link:active` | No bridge needed — `:active` fires on the Tab element |
| Focused | `[data-focused]` | Tab | `.nav-link:focus` | No bridge needed — `:focus` fires on the Tab element |
| Focus visible | `[data-focus-visible]` | Tab | `.nav-link:focus-visible` | No bridge needed — `:focus-visible` fires on the Tab element |
| Selected | `[data-selected]` | Tab | `.nav-link.active` (tokens) | Compound selector bridge: `.react-aria-Tab[data-selected]` → apply `--bs-nav-link-*` active token values (color, border). `.active` class INERT (React Aria never adds). |
| Disabled | `[data-disabled]` | Tab | `.nav-link.disabled` (tokens) | Compound selector bridge: `.react-aria-Tab[data-disabled]` → apply `--bs-nav-link-disabled-color` + `pointer-events: none`. `.disabled` class INERT. |

**TabPanel (`.react-aria-TabPanel`) data-* attributes:**

| React Aria state | data-* attribute | Sub-part | Bootstrap equivalent | Bridge strategy |
|-----------------|------------------|----------|----------------------|-----------------|
| Focus visible | `[data-focus-visible]` | TabPanel | (panel focus ring) | No bridge needed — `:focus-visible` fires on the panel `<div>` |
| Entering | `[data-entering]` | TabPanel | (transition in) | Custom CSS: animation/transition hook for panel appear |
| Exiting | `[data-exiting]` | TabPanel | (transition out) | Custom CSS: animation/transition hook for panel disappear |
| Inert (inactive) | `[data-inert]` | TabPanel | `.tab-pane` (hidden) | Compound selector bridge: `.react-aria-TabPanel[data-inert]` → `display: none`. Bootstrap's `.tab-pane { display: none }` + `.active { display: block }` mechanism INERT — see DOM conflicts. |

**Pseudo-class audit (on `.react-aria-Tab`):**
- `:hover` — ACTIVE (fires on Tab element)
- `:focus` — ACTIVE (fires on Tab element)
- `:focus-visible` — ACTIVE (fires on Tab element)
- `:active` — ACTIVE (fires on Tab element)
- `:disabled` — INERT (Tab renders as `<div>` or `<a>`, not a form control; `:disabled` does not fire)
- `.active` class — INERT (React Aria never adds)
- `.disabled` class — INERT (React Aria never adds)

### DOM conflicts

| Sub-part | Conflict type | Bootstrap expects | React Aria renders | Resolution |
|----------|--------------|------------------|--------------------|------------|
| Tab active state | MINOR | `.nav-link.active` class | `[data-selected]` attribute on Tab element | Compound selector bridge: `.react-aria-Tab[data-selected]` → apply active token values. `.nav-link.active` class INERT. |
| TabPanel visibility | MINOR | `.tab-content > .tab-pane { display: none }` hidden; `.tab-content > .active { display: block }` revealed | React Aria hides inactive panels via `[data-inert]` attribute; no `.active` class added | Bootstrap's `.tab-pane` rule hides all panels (fires, but incorrect — ALL panels hidden). Bootstrap's reveal rule INERT (`.active` never added). Resolution: do not apply `.tab-pane` class, or explicitly override: `.react-aria-TabPanel { display: block }` baseline, with `.react-aria-TabPanel[data-inert] { display: none }` bridge. |
| Disabled tab | MINOR | `.nav-link.disabled` class | `[data-disabled]` attribute | Compound selector bridge required: `.react-aria-Tab[data-disabled]` → apply disabled tokens. `.disabled` class INERT. |
| Vertical orientation | MINOR | No Bootstrap modifier class for vertical nav tabs | `[data-orientation="vertical"]` on root | Custom CSS in `augments.scss`: `.react-aria-Tabs[data-orientation="vertical"] .react-aria-TabList { flex-direction: column }` |

### Reference story canvas

- **Stories (sub-parts):** Tab styles (tabs, pills, underline), Tab states (default, hover-faux, focus-faux, selected, disabled), Full tabs widget (with panel content), Vertical orientation
- **Grid columns:** 3 — tab style specimens, tab state specimens, full widget
- **Width constraint:** ~1280px
- **Notes:** The tab states story should show individual `.nav-link` specimens with faux state classes applied (P-S001). The full widget story must show complete TabList + TabPanel content to validate panel visibility bridge. The disabled tab specimen must confirm pointer-events suppression. The vertical orientation story should show the TabList in column layout with a panel to the right. Panel visibility depends entirely on the `[data-inert]` bridge — this is a critical functional check for the reference story.

### Confidence: High

*Core TabList → `.nav.nav-tabs` and Tab → `.nav-link` mappings are direct. The panel visibility conflict (`.tab-pane` vs. `[data-inert]`) is well-understood and resolvable via compound selector. SelectionIndicator is additive (React Aria feature, not required by Bootstrap's model). The main open decision is which Bootstrap nav style to use as default — a design choice, not a mapping ambiguity.*
