// Bootstrap reference: https://getbootstrap.com/docs/5.3/components/dropdowns/#single-button
// Pattern: .btn.dropdown-toggle + .dropdown-menu — NOT .form-select.
// React Aria hides the native <select> and renders a custom <button> + popover + listbox.
// Bootstrap's .form-select targets the native element and does not attach.
// The dropdown pattern matches React Aria's rendered DOM structure.
// Dropdown shown open (via .show) — Bootstrap dropdown toggling requires JS not loaded here.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/Select',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Closed: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Dropdowns › Single button](https://getbootstrap.com/docs/5.3/components/dropdowns/#single-button)' } },
  },
  render: () => (
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" aria-expanded="false">
        Dropdown button
      </button>
    </div>
  ),
};

export const Open: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Dropdowns › Single button](https://getbootstrap.com/docs/5.3/components/dropdowns/#single-button) (open state forced via `.show` — Bootstrap dropdown toggling requires JS)' } },
  },
  render: () => (
    <div className="dropdown" style={{ paddingBottom: 140 }}>
      <button className="btn btn-secondary dropdown-toggle" type="button" aria-expanded="true">
        Dropdown button
      </button>
      <ul className="dropdown-menu show">
        <li><a className="dropdown-item" href="#">Action</a></li>
        <li><a className="dropdown-item" href="#">Another action</a></li>
        <li><a className="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  ),
};
