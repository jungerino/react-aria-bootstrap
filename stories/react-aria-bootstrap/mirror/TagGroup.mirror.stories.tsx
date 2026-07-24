import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import { TagGroup, Tag } from '../../../src/react-aria-bootstrap/TagGroup';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Mirror/TagGroup',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Mirrors reference story "Default" — real TagGroup/TagList/Tag instance,
 * non-removable, non-selectable, at rest. Includes the same short + long
 * label pair (P-020) as the reference to confirm the pill shape holds
 * steady and doesn't clip.
 */
export const Default: Story = {
  render: () => (
    <TagGroup aria-label="News categories">
      <Tag id="news">News</Tag>
      <Tag id="travel">Travel</Tag>
      <Tag id="politics">International Politics &amp; Culture</Tag>
      <Tag id="shopping">Shopping</Tag>
    </TagGroup>
  ),
};

/**
 * Mirrors reference story "States" — full interactive state matrix for the
 * Tag body (P-009/P-013), single structurally-relevant family since
 * selected/unselected share the same mechanism regardless of
 * `selectionMode` (Decision D3). Hover/focus-visible/pressed use
 * `.faux-hover`/`.faux-focus-visible`/`.faux-pressed` (P044 — no Bootstrap
 * static class exists for any of these, and a single static render can't
 * produce real browser hover/keyboard-focus/press). Selected and Disabled
 * use real mechanisms: `selectionMode="multiple"` +
 * `defaultSelectedKeys` (multiple, not single, since two specimens — Selected
 * and Selected + Hover — must both read as selected at once; per Decision D3
 * the visual treatment is identical for single and multiple selection) and
 * real `isDisabled`.
 */
export const States: Story = {
  render: () => (
    <TagGroup
      aria-label="Tag states"
      selectionMode="multiple"
      defaultSelectedKeys={['selected', 'selected-hover']}
    >
      <Tag id="resting">Resting</Tag>
      <Tag id="hover" className="faux-hover">Hover</Tag>
      <Tag id="focused" className="faux-focus-visible">Focused</Tag>
      <Tag id="pressed" className="faux-pressed">Pressed</Tag>
      <Tag id="selected">Selected</Tag>
      <Tag id="selected-hover" className="faux-hover">Selected + Hover</Tag>
      <Tag id="disabled" isDisabled>Disabled</Tag>
    </TagGroup>
  ),
};

/**
 * Mirrors reference story "Removable" — Remove Button sub-part state
 * matrix (P-009), one real single-tag `TagGroup` per specimen so each
 * exercises `onRemove` (driving real `allowsRemoving`/`data-allows-removing`
 * and the M017 asymmetric-padding delta) independently. Hover/focused use
 * `removeButtonClassName` to apply `.faux-hover`/`.faux-focus-visible`
 * directly to the nested Remove Button (P044) — the Tag body itself stays
 * at rest, matching the reference's per-specimen isolation. "Selected +
 * removable" combines real selection with a real Remove Button to confirm
 * the icon's `[data-selected]` color re-point holds up alongside removal.
 */
export const Removable: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Resting</span>
        <TagGroup aria-label="Removable tag — resting" onRemove={() => {}}>
          <Tag id="draft">Draft</Tag>
        </TagGroup>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Remove button — hover</span>
        <TagGroup aria-label="Removable tag — remove button hover" onRemove={() => {}}>
          <Tag id="archived" removeButtonClassName="faux-hover">Archived</Tag>
        </TagGroup>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Remove button — focused</span>
        <TagGroup aria-label="Removable tag — remove button focused" onRemove={() => {}}>
          <Tag id="pending" removeButtonClassName="faux-focus-visible">Pending Review</Tag>
        </TagGroup>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Selected + removable</span>
        <TagGroup
          aria-label="Removable tag — selected"
          selectionMode="single"
          defaultSelectedKeys={['home']}
          onRemove={() => {}}
        >
          <Tag id="home">Home</Tag>
        </TagGroup>
      </div>
    </div>
  ),
};

/**
 * Mirrors reference story "WithLabelAndDescription" — Label
 * (`.form-label`) + TagList + Description (`.form-text`) or Error
 * (`.invalid-feedback`, forced visible via the bridge's unconditional
 * `display: block` — TagGroup has no native invalid state to gate it on,
 * taxonomy DOM conflicts "Error text visibility mechanism"). Three of five
 * tags selected in the first composition (real `selectionMode="multiple"` +
 * `defaultSelectedKeys`) to show Label/TagList/Description together in a
 * realistic filter-chip context (P-006 over-inclusion).
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + description</span>
        <TagGroup
          label="Categories"
          description="Select all categories that apply."
          selectionMode="multiple"
          defaultSelectedKeys={['design', 'engineering', 'sales']}
        >
          <Tag id="design">Design</Tag>
          <Tag id="engineering">Engineering</Tag>
          <Tag id="marketing">Marketing</Tag>
          <Tag id="sales">Sales</Tag>
          <Tag id="support">Support</Tag>
        </TagGroup>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + error</span>
        <TagGroup label="Categories" errorMessage="Select at least one category.">
          <Tag id="design">Design</Tag>
          <Tag id="engineering">Engineering</Tag>
          <Tag id="marketing">Marketing</Tag>
        </TagGroup>
      </div>
    </div>
  ),
};
