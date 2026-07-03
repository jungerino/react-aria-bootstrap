import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Button',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 * All 8 solid .btn-{variant} buttons.
 */
export const Variants: Story = {
  render: () => (
    <div className="specimen-row">
      <button type="button" className="btn btn-primary">Primary</button>
      <button type="button" className="btn btn-secondary">Secondary</button>
      <button type="button" className="btn btn-success">Success</button>
      <button type="button" className="btn btn-danger">Danger</button>
      <button type="button" className="btn btn-warning">Warning</button>
      <button type="button" className="btn btn-info">Info</button>
      <button type="button" className="btn btn-light">Light</button>
      <button type="button" className="btn btn-dark">Dark</button>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 * All 8 .btn-outline-{variant} buttons.
 */
export const OutlineVariants: Story = {
  render: () => (
    <div className="specimen-row">
      <button type="button" className="btn btn-outline-primary">Primary</button>
      <button type="button" className="btn btn-outline-secondary">Secondary</button>
      <button type="button" className="btn btn-outline-success">Success</button>
      <button type="button" className="btn btn-outline-danger">Danger</button>
      <button type="button" className="btn btn-outline-warning">Warning</button>
      <button type="button" className="btn btn-outline-info">Info</button>
      <button type="button" className="btn btn-outline-light">Light</button>
      <button type="button" className="btn btn-outline-dark">Dark</button>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 * .btn-lg (large), default (no size class), .btn-sm (small) — using primary for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="specimen-row">
      <button type="button" className="btn btn-primary btn-lg">Large button</button>
      <button type="button" className="btn btn-primary">Default button</button>
      <button type="button" className="btn btn-primary btn-sm">Small button</button>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 * Interactive state matrix across two structurally distinct variant families (P-009):
 *   Row 1 — .btn-primary (solid): fill + text color change on hover/active
 *   Row 2 — .btn-outline-primary (outline): fill appears on hover/active
 * Faux-state classes simulate pseudo-class appearances statically (P-001).
 * Focus is visually distinct from hover via the focus box-shadow ring (P-016).
 */
export const States: Story = {
  render: () => (
    <div>
      <div className="specimen-section">
        <div className="specimen-row-header">Solid (.btn-primary)</div>
        <div className="specimen-row">
          <div className="specimen-group">
            <div className="specimen-label">Default</div>
            <button type="button" className="btn btn-primary">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Hover</div>
            <button type="button" className="btn btn-primary faux-hover">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Focus</div>
            <button type="button" className="btn btn-primary faux-focus">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Active</div>
            <button type="button" className="btn btn-primary faux-active">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Disabled</div>
            <button type="button" className="btn btn-primary" disabled>Button</button>
          </div>
        </div>
      </div>

      <div className="specimen-section">
        <div className="specimen-row-header">Outline (.btn-outline-primary)</div>
        <div className="specimen-row">
          <div className="specimen-group">
            <div className="specimen-label">Default</div>
            <button type="button" className="btn btn-outline-primary">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Hover</div>
            <button type="button" className="btn btn-outline-primary faux-hover">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Focus</div>
            <button type="button" className="btn btn-outline-primary faux-focus">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Active</div>
            <button type="button" className="btn btn-outline-primary faux-active">Button</button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Disabled</div>
            <button type="button" className="btn btn-outline-primary" disabled>Button</button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 * .btn-link — renders visually as a hyperlink but retains button semantics.
 * States: Default, Hover, Focus, Disabled.
 */
export const LinkStyle: Story = {
  render: () => (
    <div className="specimen-row">
      <div className="specimen-group">
        <div className="specimen-label">Default</div>
        <button type="button" className="btn btn-link">Link</button>
      </div>
      <div className="specimen-group">
        <div className="specimen-label">Hover</div>
        <button type="button" className="btn btn-link faux-hover">Link</button>
      </div>
      <div className="specimen-group">
        <div className="specimen-label">Focus</div>
        <button type="button" className="btn btn-link faux-focus">Link</button>
      </div>
      <div className="specimen-group">
        <div className="specimen-label">Disabled</div>
        <button type="button" className="btn btn-link" disabled>Link</button>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/spinners/
 * [data-pending] state: spinner child inside a disabled-interaction button.
 * Bootstrap's canonical pattern: .spinner-border-sm inside a .btn.
 */
export const Pending: Story = {
  render: () => (
    <div className="specimen-row">
      <div className="specimen-group">
        <div className="specimen-label">Pending</div>
        <button type="button" className="btn btn-primary" data-pending aria-label="Loading">
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </button>
      </div>
    </div>
  ),
};
