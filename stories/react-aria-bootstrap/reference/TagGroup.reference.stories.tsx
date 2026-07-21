import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/TagGroup',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 *
 * Bootstrap has no dedicated Tag/Chip component (taxonomy M006) — Tag is
 * resolved as `.btn` + `.btn-outline-secondary` with badge-informed sizing
 * overrides (Decisions D1/D2), applied via the `.tag` class in
 * presentation.scss. Tag renders as `<div role="button">`, not `<button>`,
 * consistently across every specimen in this file — not just the removable
 * ones — since a removable Tag nests a genuine interactive Remove Button,
 * and the HTML spec forbids interactive content inside a real `<button>`
 * (see taxonomy DOM conflicts, "Tag element type"). Varied label lengths
 * demonstrate the chip sizes to its own content rather than a fixed width.
 */
export const Default: Story = {
  render: () => (
    <div className="d-flex flex-wrap gap-2">
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">News</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Travel</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">International Politics &amp; Culture</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Shopping</div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 *
 * Full interactive state matrix (P-009/P-013) — a single variant family,
 * since selection treatment doesn't differ by `selectionMode` (Decision
 * D3). Hover/focus/pressed use faux classes (P-001, no Bootstrap static
 * class exists for any of them); Selected and Disabled reuse real
 * mechanisms — Selected swaps in the `.tag-selected` class (the complete
 * `.btn-primary` token set, borrowed verbatim per Decision D3's state
 * mapping), Disabled uses Bootstrap's real `.disabled` class, which fires
 * `.btn`'s own native `.btn.disabled` rule using `.btn-outline-secondary`'s
 * disabled tokens directly — no custom CSS needed for either. "Selected +
 * Hover" confirms the full-token-set swap keeps hover coherent while
 * selected (`.faux-hover` reads whatever `--bs-btn-hover-*` is currently in
 * scope, which resolves to the selected/primary values here). A `data-href`
 * / "Link" specimen was considered and dropped — `.btn` sets `cursor:
 * pointer` unconditionally, so there is no visual delta to demonstrate
 * (see taxonomy State mappings correction).
 */
export const States: Story = {
  render: () => (
    <div className="d-flex flex-wrap gap-2">
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Resting</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary faux-hover">Hover</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary faux-focus-visible">Focused</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary faux-pressed">Pressed</div>
      <div role="button" tabIndex={0} className="tag btn tag-selected" aria-pressed="true">Selected</div>
      <div role="button" tabIndex={0} className="tag btn tag-selected faux-hover" aria-pressed="true">Selected + Hover</div>
      <div role="button" tabIndex={0} className="tag btn btn-outline-secondary disabled" aria-disabled="true">Disabled</div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/close-button/
 *
 * Remove Button (`Button[slot=remove]`) state matrix (P-009 — structurally
 * distinct sub-part from the Tag body). Per Decision D4, `.btn-close`
 * supplies the hover/focus/disabled cascade and sizing tokens, but its
 * default background-image glyph is suppressed in favor of a Bootstrap
 * Icons glyph (`<i class="bi bi-x">`, per P022 bs-icons) — see
 * presentation.scss's `.btn-close.remove-button` override. The asymmetric
 * trailing padding visible on every specimen here is a genuine CSS delta
 * (`:has(.remove-button)`, taxonomy M017) verified against a Remove Button
 * that actually renders (P-017), not assumed. The "Selected + removable"
 * specimen demonstrates the icon's `color: inherit` picking up the
 * selected Tag's white text automatically, with no separate override rule.
 */
export const Removable: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Resting</span>
        <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">
          Draft
          <button type="button" className="btn-close remove-button" aria-label="Remove Draft">
            <i className="bi bi-x" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Remove button — hover</span>
        <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">
          Archived
          <button type="button" className="btn-close remove-button faux-hover" aria-label="Remove Archived">
            <i className="bi bi-x" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Remove button — focused</span>
        <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">
          Pending Review
          <button type="button" className="btn-close remove-button faux-focus-visible" aria-label="Remove Pending Review">
            <i className="bi bi-x" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Selected + removable</span>
        <div role="button" tabIndex={0} className="tag btn tag-selected" aria-pressed="true">
          Home
          <button type="button" className="btn-close remove-button" aria-label="Remove Home">
            <i className="bi bi-x" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/overview/ and
 * https://getbootstrap.com/docs/5.3/forms/validation/
 *
 * Label → `.form-label`, description → `.form-text`, error text →
 * `.invalid-feedback` (forced visible via `.d-block` — `TagGroup` has no
 * native invalid state to gate it on, see taxonomy DOM conflicts, "Error
 * text visibility mechanism"). Three of five tags marked selected in the
 * first composition to show Label/TagList/Description together in a
 * realistic filter-chip context (P-006 over-inclusion).
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + description</span>
        <div className="ref-stack">
          <label className="form-label" id="ref-taggroup-categories-label">Categories</label>
          <div className="d-flex flex-wrap gap-2" role="group" aria-labelledby="ref-taggroup-categories-label">
            <div role="button" tabIndex={0} className="tag btn tag-selected" aria-pressed="true">Design</div>
            <div role="button" tabIndex={0} className="tag btn tag-selected" aria-pressed="true">Engineering</div>
            <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Marketing</div>
            <div role="button" tabIndex={0} className="tag btn tag-selected" aria-pressed="true">Sales</div>
            <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Support</div>
          </div>
          <div className="form-text">Select all categories that apply.</div>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + error</span>
        <div className="ref-stack">
          <label className="form-label" id="ref-taggroup-categories-invalid-label">Categories</label>
          <div className="d-flex flex-wrap gap-2" role="group" aria-labelledby="ref-taggroup-categories-invalid-label">
            <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Design</div>
            <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Engineering</div>
            <div role="button" tabIndex={0} className="tag btn btn-outline-secondary">Marketing</div>
          </div>
          <div className="invalid-feedback d-block">Select at least one category.</div>
        </div>
      </div>
    </div>
  ),
};
