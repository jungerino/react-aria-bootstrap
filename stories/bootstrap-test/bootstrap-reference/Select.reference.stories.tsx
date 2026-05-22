import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Select',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;


// ── Trigger States ────────────────────────────────────────────────────────────

export const TriggerStates: Story = {
  name: 'Trigger States',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap .form-select trigger states. The React Aria implementation bridges a <button> ' +
          'to produce these appearances via CSS custom property overrides (M014). ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/select/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Default (placeholder showing)</div>
        <select className="form-select">
          <option value="" disabled>
            Choose an option
          </option>
          <option>Apple</option>
          <option>Banana</option>
          <option>Cherry</option>
        </select>
      </div>

      <div>
        <div className="ref-label">With value selected</div>
        <select className="form-select" defaultValue="banana">
          <option value="" disabled>
            Choose an option
          </option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
        </select>
      </div>

      <div>
        <div className="ref-label">Focus</div>
        <select className="form-select faux-focus" defaultValue="">
          <option value="" disabled>
            Choose an option
          </option>
          <option>Apple</option>
          <option>Banana</option>
          <option>Cherry</option>
        </select>
      </div>

      <div>
        <div className="ref-label">Disabled</div>
        <select className="form-select" disabled>
          <option value="" disabled>
            Choose an option
          </option>
          <option>Apple</option>
          <option>Banana</option>
          <option>Cherry</option>
        </select>
      </div>
    </div>
  ),
};

// ── Open Dropdown ─────────────────────────────────────────────────────────────

export const OpenDropdown: Story = {
  name: 'Open Dropdown',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap .dropdown-menu shown statically (display: block). React Aria renders the ' +
          'Popover only when open; DOM presence alone controls visibility — no .show bridge needed. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/dropdowns/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Open dropdown (trigger + menu)</div>
        <select className="form-select mb-1" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
          <option value="date">Date</option>
          <option value="elderberry" disabled>Elderberry (disabled)</option>
        </select>
        <div className="dropdown-menu show ref-dropdown-static ref-dropdown-full-width">
          <button className="dropdown-item" type="button">
            Apple
          </button>
          <button className="dropdown-item active" type="button">
            Banana
          </button>
          <button className="dropdown-item" type="button">
            Cherry
          </button>
          <button className="dropdown-item" type="button">
            Date
          </button>
          <button className="dropdown-item disabled" type="button" aria-disabled="true">
            Elderberry (disabled)
          </button>
        </div>
      </div>

      <div>
        <div className="ref-label">Dropdown item states</div>
        <div className="dropdown-menu show ref-dropdown-static">
          <button className="dropdown-item" type="button">
            Default
          </button>
          <button className="dropdown-item faux-hover" type="button">
            Hover (faux)
          </button>
          <button className="dropdown-item active" type="button">
            Selected (.active)
          </button>
          <button className="dropdown-item disabled" type="button" aria-disabled="true">
            Disabled
          </button>
        </div>
      </div>
    </div>
  ),
};

// ── Validation — Invalid State ────────────────────────────────────────────────

export const InvalidState: Story = {
  name: 'Validation — Invalid',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap .form-select.is-invalid with .invalid-feedback. React Aria bridges via ' +
          '[data-invalid] compound selector; FieldError renders only when invalid. ' +
          'Valid state is out of scope per component decision. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/validation/',
      },
    },
  },
  render: () => (
    <div>
      <div className="ref-label">Invalid state (with field error)</div>
      <div>
        <label className="form-label" htmlFor="select-invalid">
          Favourite fruit
        </label>
        <select className="form-select is-invalid" id="select-invalid">
          <option value="" disabled>
            Choose an option
          </option>
          <option>Apple</option>
          <option>Banana</option>
          <option>Cherry</option>
        </select>
        <div className="invalid-feedback">Please select a valid option.</div>
      </div>
    </div>
  ),
};

// ── Size Variants ─────────────────────────────────────────────────────────────

export const SizeVariants: Story = {
  name: 'Size Variants',
  parameters: {
    docs: {
      description: {
        story: 'Source: https://getbootstrap.com/docs/5.3/forms/select/#sizing',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row ref-align-center">
      <div>
        <div className="ref-label">Small (.form-select-sm)</div>
        <select className="form-select form-select-sm">
          <option>Small</option>
        </select>
      </div>
      <div>
        <div className="ref-label">Default</div>
        <select className="form-select">
          <option>Default</option>
        </select>
      </div>
      <div>
        <div className="ref-label">Large (.form-select-lg)</div>
        <select className="form-select form-select-lg">
          <option>Large</option>
        </select>
      </div>
    </div>
  ),
};

// ── Full Field ────────────────────────────────────────────────────────────────

export const FullField: Story = {
  name: 'Full Field (Label + Trigger + Description + Error)',
  parameters: {
    docs: {
      description: {
        story:
          'Complete form field: .form-label + .form-select + .form-text + .invalid-feedback. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/select/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Default field</div>
        <div>
          <label className="form-label" htmlFor="select-full-default">
            Favourite fruit
          </label>
          <select className="form-select" id="select-full-default" defaultValue="banana">
            <option value="" disabled>
              Choose an option
            </option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
          </select>
          <div className="form-text">Select your favourite fruit from the list.</div>
        </div>
      </div>

      <div>
        <div className="ref-label">Invalid field</div>
        <div>
          <label className="form-label" htmlFor="select-full-invalid">
            Favourite fruit
          </label>
          <select className="form-select is-invalid" id="select-full-invalid">
            <option value="" disabled>
              Choose an option
            </option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
          </select>
          <div className="form-text">Select your favourite fruit from the list.</div>
          <div className="invalid-feedback">Please select a valid option.</div>
        </div>
      </div>

      <div>
        <div className="ref-label">Disabled field</div>
        <div>
          <label className="form-label" htmlFor="select-full-disabled">
            Favourite fruit
          </label>
          <select className="form-select" id="select-full-disabled" disabled defaultValue="apple">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
          </select>
          <div className="form-text">This field is disabled.</div>
        </div>
      </div>
    </div>
  ),
};
