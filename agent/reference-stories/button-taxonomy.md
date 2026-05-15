---
title: Button — Reference Story Taxonomy (draft)
status: approved
source: reference-stories_0, iteration 0
---

# Button Reference Story Taxonomy

Draft taxonomy for the `reference-stories` experiment, iteration 0. Covers all substantive sub-parts of the Button component. Each sub-part maps to one Storybook story under `Bootstrap Reference/Button/SubPartName`.

**General canvas rule:** All specimens must be visible in one viewport at ~1280px width. Use a CSS grid wrapper in the story canvas; column count noted per story.

---

## Sub-parts

Button has one substantive sub-part: Root. The mapping is 1:1 (Button → `.btn.btn-{variant}`).

No nested sub-parts exist. A single story covers all dimensions.

---

## Story: Root

**Bootstrap class:** `.btn.btn-{variant}`
**Canvas:** Flexible — see layout notes below

The Root story covers three independent dimensions: variant family, size, and interactive states. These are shown as separate specimen groups within the same story rather than separate stories — Button is simple enough that splitting would create unnecessary navigation overhead.

### Group A — Variant families (8-column grid)

Show all 17 variant values in a single row per family:

**Solid variants (1 row, 8 columns):**
- `.btn.btn-primary`
- `.btn.btn-secondary`
- `.btn.btn-success`
- `.btn.btn-danger`
- `.btn.btn-warning`
- `.btn.btn-info`
- `.btn.btn-light`
- `.btn.btn-dark`

**Outline variants (1 row, 8 columns):**
- `.btn.btn-outline-primary`
- `.btn.btn-outline-secondary`
- `.btn.btn-outline-success`
- `.btn.btn-outline-danger`
- `.btn.btn-outline-warning`
- `.btn.btn-outline-info`
- `.btn.btn-outline-light`
- `.btn.btn-outline-dark`

**Link variant (1 row, 1 column):**
- `.btn.btn-link`

Label each specimen with its variant string (e.g., "primary", "outline-danger", "link").

### Group B — Sizes (3-column grid)

Use `btn-primary` as the representative variant for all size specimens:

- `.btn.btn-primary.btn-sm` — "Small"
- `.btn.btn-primary` — "Default"
- `.btn.btn-primary.btn-lg` — "Large"

### Group C — Interactive states (2-column grid)

Use `btn-primary` as the representative variant. Show state via Bootstrap's own class/attribute mechanism — do not fake with inline styles.

- Default — no modifier
- Hover — `.btn.btn-primary.faux-hover`
- Focus visible — `.btn.btn-primary.faux-focus`
- Active / pressed — `.active` class (Bootstrap's static pressed representation)
- Disabled — `disabled` attribute on `<button>`
- Disabled (link variant) — `.btn.btn-link` with `.disabled` class (anchors use class, not attribute)

---

## Caveats

1. **Pending state** — The mapping table notes `[data-pending]` may not be a real DOM attribute in the installed React Aria version. Omitted from this reference story; no Bootstrap counterpart exists anyway (the pattern is a spinner child element). Out of scope for Bootstrap reference — Bootstrap's own docs have no "button loading" state using classes.

2. **Static pseudo-class limitation** — Hover and focus-visible cannot be demonstrated with static HTML markup. Specimens are interactive targets with instructional labels. This is acceptable for the reference story purpose: the reviewer uses the story to verify Bootstrap's CSS behavior, not as a pixel-diff target.

3. **Outline-light on white background** — `.btn-outline-light` is nearly invisible on a white canvas background. The story should use a dark background (`data-bs-theme="dark"` or a dark wrapper) for the outline-light specimen, or note the visibility issue.
