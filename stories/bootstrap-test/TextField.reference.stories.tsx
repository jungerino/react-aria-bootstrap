// Bootstrap reference: https://getbootstrap.com/docs/5.3/forms/form-control/#example
// Pattern: .form-label + .form-control + .form-text (description) + .invalid-feedback (error).
// React Aria's TextField renders <label> + <input> + description/error divs — maps directly.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/TextField',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Form control › Example](https://getbootstrap.com/docs/5.3/forms/form-control/#example)' } },
  },
  render: () => (
    <div style={{ width: 300 }}>
      <label htmlFor="ref-tf-1" className="form-label">Password</label>
      <input
        type="password"
        id="ref-tf-1"
        className="form-control"
        aria-describedby="ref-tf-1-help"
      />
      <div id="ref-tf-1-help" className="form-text">
        Your password must be 8–20 characters long, contain letters and numbers, and must not
        contain spaces, special characters, or emoji.
      </div>
    </div>
  ),
};

export const ErrorState: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Validation › Server side](https://getbootstrap.com/docs/5.3/forms/validation/#server-side) (`.is-invalid` applied without JS)' } },
  },
  render: () => (
    <div style={{ width: 300 }}>
      <label htmlFor="ref-tf-2" className="form-label">Email</label>
      <input
        type="email"
        id="ref-tf-2"
        className="form-control is-invalid"
        defaultValue="not-an-email"
        aria-describedby="ref-tf-2-err"
      />
      <div id="ref-tf-2-err" className="invalid-feedback">
        Please enter a valid email address.
      </div>
    </div>
  ),
};

export const Disabled: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Form control › Disabled](https://getbootstrap.com/docs/5.3/forms/form-control/#disabled)' } },
  },
  render: () => (
    <div style={{ width: 300 }}>
      <label htmlFor="ref-tf-3" className="form-label">Username</label>
      <input type="text" id="ref-tf-3" className="form-control" placeholder="Disabled" disabled />
    </div>
  ),
};
