// Bootstrap reference: https://getbootstrap.com/docs/5.3/forms/checks-radios/#checks
// Pattern: .form-check + .form-check-input + .form-check-label.
// Note: Bootstrap targets native <input type="checkbox"> directly. React Aria hides the native
// input and renders a custom indicator — this reference shows the visual target only.
// The React Aria implementation uses bridge selectors on the custom indicator element.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/Checkbox',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Checks & radios › Checks](https://getbootstrap.com/docs/5.3/forms/checks-radios/#checks)' } },
  },
  render: () => (
    <div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="ref-cb-1" />
        <label className="form-check-label" htmlFor="ref-cb-1">Default checkbox</label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="ref-cb-2" defaultChecked />
        <label className="form-check-label" htmlFor="ref-cb-2">Checked checkbox</label>
      </div>
    </div>
  ),
};

export const Disabled: StoryObj = {
  parameters: {
    docs: { description: { story: '**Source:** [Bootstrap Docs — Checks & radios › Checks](https://getbootstrap.com/docs/5.3/forms/checks-radios/#checks) (disabled examples shown at the end of the section)' } },
  },
  render: () => (
    <div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="ref-cb-3" disabled />
        <label className="form-check-label" htmlFor="ref-cb-3">Disabled checkbox</label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="ref-cb-4" defaultChecked disabled />
        <label className="form-check-label" htmlFor="ref-cb-4">Disabled checked</label>
      </div>
    </div>
  ),
};
