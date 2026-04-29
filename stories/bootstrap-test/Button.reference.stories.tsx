// Bootstrap reference: https://getbootstrap.com/docs/5.3/components/buttons/#variants
// Pattern: .btn.btn-{variant} — React Aria's Button renders a native <button>; this maps directly.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/Button',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Variants: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Buttons › Variants](https://getbootstrap.com/docs/5.3/components/buttons/#variants)' } },
  },
  render: () => (
    <div className="d-flex flex-wrap gap-2">
      <button type="button" className="btn btn-primary">Primary</button>
      <button type="button" className="btn btn-secondary">Secondary</button>
      <button type="button" className="btn btn-success">Success</button>
      <button type="button" className="btn btn-danger">Danger</button>
      <button type="button" className="btn btn-warning">Warning</button>
      <button type="button" className="btn btn-info">Info</button>
      <button type="button" className="btn btn-light">Light</button>
      <button type="button" className="btn btn-dark">Dark</button>
      <button type="button" className="btn btn-link">Link</button>
    </div>
  ),
};

export const OutlineVariants: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Buttons › Outline buttons](https://getbootstrap.com/docs/5.3/components/buttons/#outline-buttons)' } },
  },
  render: () => (
    <div className="d-flex flex-wrap gap-2">
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
