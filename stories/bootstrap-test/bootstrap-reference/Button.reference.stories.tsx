import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Button',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const specimen = (lbl: string, children: React.ReactNode) => (
  <div>
    <div className="ref-label">{lbl}</div>
    {children}
  </div>
);

// ── Color Variants — Solid ────────────────────────────────────────────────────

export const ColorVariantsSolid: Story = {
  name: 'Color Variants — Solid',
  parameters: {
    docs: {
      description: {
        story: 'Source: https://getbootstrap.com/docs/5.3/components/buttons/#examples',
      },
    },
  },
  render: () => (
    <div className="ref-specimen-row">
      {specimen('Primary', <button className="btn btn-primary">Primary</button>)}
      {specimen('Secondary', <button className="btn btn-secondary">Secondary</button>)}
      {specimen('Success', <button className="btn btn-success">Success</button>)}
      {specimen('Danger', <button className="btn btn-danger">Danger</button>)}
      {specimen('Warning', <button className="btn btn-warning">Warning</button>)}
      {specimen('Info', <button className="btn btn-info">Info</button>)}
      {specimen('Light', <button className="btn btn-light">Light</button>)}
      {specimen('Dark', <button className="btn btn-dark">Dark</button>)}
    </div>
  ),
};

// ── Color Variants — Outline ──────────────────────────────────────────────────

export const ColorVariantsOutline: Story = {
  name: 'Color Variants — Outline',
  parameters: {
    docs: {
      description: {
        story: 'Source: https://getbootstrap.com/docs/5.3/components/buttons/#outline-buttons',
      },
    },
  },
  render: () => (
    <div className="ref-specimen-row">
      {specimen('Outline Primary', <button className="btn btn-outline-primary">Primary</button>)}
      {specimen('Outline Secondary', <button className="btn btn-outline-secondary">Secondary</button>)}
      {specimen('Outline Success', <button className="btn btn-outline-success">Success</button>)}
      {specimen('Outline Danger', <button className="btn btn-outline-danger">Danger</button>)}
      {specimen('Outline Warning', <button className="btn btn-outline-warning">Warning</button>)}
      {specimen('Outline Info', <button className="btn btn-outline-info">Info</button>)}
      {specimen('Outline Light', <button className="btn btn-outline-light">Light</button>)}
      {specimen('Outline Dark', <button className="btn btn-outline-dark">Dark</button>)}
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: 'Source: https://getbootstrap.com/docs/5.3/components/buttons/#sizes',
      },
    },
  },
  render: () => (
    <div className="ref-specimen-row ref-align-center">
      {specimen('Small (.btn-sm)', <button className="btn btn-primary btn-sm">Small</button>)}
      {specimen('Default', <button className="btn btn-primary">Default</button>)}
      {specimen('Large (.btn-lg)', <button className="btn btn-primary btn-lg">Large</button>)}
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story:
          'Faux state classes from augments.scss reproduce hover/focus/active CSS variable values statically. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/buttons/#disabled-state',
      },
    },
  },
  render: () => (
    <div className="ref-specimen-row">
      {specimen('Default', <button className="btn btn-primary">Button</button>)}
      {specimen('Hover', <button className="btn btn-primary faux-hover">Button</button>)}
      {specimen('Focus', <button className="btn btn-primary faux-focus">Button</button>)}
      {specimen('Active', <button className="btn btn-primary faux-active">Button</button>)}
      {specimen('Disabled', <button className="btn btn-primary" disabled>Button</button>)}
      {specimen(
        'Pending',
        <button className="btn btn-primary" disabled>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          Loading…
        </button>,
      )}
    </div>
  ),
};
