import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../../_decorators';
import '../augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/TextField',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;


// ── Input States ──────────────────────────────────────────────────────────────

export const InputStates: Story = {
  name: 'Input States',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap .form-control input states. React Aria renders a real <input> so ' +
          ':focus, :disabled, and [readonly] pseudo-classes fire naturally. ' +
          'No hover styling exists on .form-control (file-input only). ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/form-control/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Default (empty)</div>
        <input className="form-control ref-textfield-specimen" type="text" placeholder="Placeholder text" />
      </div>

      <div>
        <div className="ref-label">With value</div>
        <input className="form-control ref-textfield-specimen" type="text" defaultValue="Hello world" />
      </div>

      <div>
        <div className="ref-label">Focus (.faux-focus)</div>
        <input className="form-control faux-focus ref-textfield-specimen" type="text" placeholder="Focused" />
      </div>

      <div>
        <div className="ref-label">Disabled</div>
        <input className="form-control ref-textfield-specimen" type="text" placeholder="Disabled" disabled />
      </div>

      <div>
        <div className="ref-label">Read-only</div>
        <input className="form-control ref-textfield-specimen" type="text" defaultValue="Read-only value" readOnly />
      </div>
    </div>
  ),
};


// ── Validation — Invalid ──────────────────────────────────────────────────────

export const ValidationInvalid: Story = {
  name: 'Validation — Invalid',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap .form-control.is-invalid with .invalid-feedback. React Aria bridges via ' +
          '[data-invalid] compound selector; FieldError renders only when invalid so ' +
          '.invalid-feedback must use display:block unconditionally. ' +
          'Valid state is out of scope per component decision. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/validation/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Invalid (with FieldError)</div>
        <div>
          <input
            className="form-control is-invalid ref-textfield-specimen"
            type="text"
            placeholder="Enter value"
            aria-describedby="tf-invalid-error"
          />
          <div className="invalid-feedback" id="tf-invalid-error">
            This field is required.
          </div>
        </div>
      </div>

      <div>
        <div className="ref-label">Invalid + Focus</div>
        <div>
          <input
            className="form-control is-invalid faux-focus ref-textfield-specimen"
            type="text"
            placeholder="Enter value"
            aria-describedby="tf-invalid-focus-error"
          />
          <div className="invalid-feedback" id="tf-invalid-focus-error">
            This field is required.
          </div>
        </div>
      </div>
    </div>
  ),
};


// ── Full Field ────────────────────────────────────────────────────────────────

export const FullField: Story = {
  name: 'Full Field (Label + Input + Description + Error)',
  parameters: {
    docs: {
      description: {
        story:
          'Complete form field: .form-label + .form-control + .form-text + .invalid-feedback. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/form-control/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Default field</div>
        <div>
          <label className="form-label" htmlFor="tf-full-default">
            Full name
          </label>
          <input
            className="form-control ref-textfield-specimen"
            id="tf-full-default"
            type="text"
            defaultValue="Jane Smith"
          />
          <div className="form-text">Enter your first and last name.</div>
        </div>
      </div>

      <div>
        <div className="ref-label">Invalid field</div>
        <div>
          <label className="form-label" htmlFor="tf-full-invalid">
            Full name
          </label>
          <input
            className="form-control is-invalid ref-textfield-specimen"
            id="tf-full-invalid"
            type="text"
            placeholder="Enter your name"
            aria-describedby="tf-full-invalid-text tf-full-invalid-error"
          />
          <div className="form-text" id="tf-full-invalid-text">Enter your first and last name.</div>
          <div className="invalid-feedback" id="tf-full-invalid-error">
            Full name is required.
          </div>
        </div>
      </div>

      <div>
        <div className="ref-label">Disabled field</div>
        <div>
          <label className="form-label" htmlFor="tf-full-disabled">
            Full name
          </label>
          <input
            className="form-control ref-textfield-specimen"
            id="tf-full-disabled"
            type="text"
            defaultValue="Jane Smith"
            disabled
          />
          <div className="form-text">This field is disabled.</div>
        </div>
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
        story:
          '.form-control-sm and .form-control-lg modify padding, font-size, and border-radius. ' +
          'Applied to the Input sub-part; exposed as a prop on the Bootstrap-themed component. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/form-control/#sizing',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row ref-align-center">
      <div>
        <div className="ref-label">Small (.form-control-sm)</div>
        <input className="form-control form-control-sm ref-textfield-specimen" type="text" placeholder="Small input" />
      </div>

      <div>
        <div className="ref-label">Default</div>
        <input className="form-control ref-textfield-specimen" type="text" placeholder="Default input" />
      </div>

      <div>
        <div className="ref-label">Large (.form-control-lg)</div>
        <input className="form-control form-control-lg ref-textfield-specimen" type="text" placeholder="Large input" />
      </div>
    </div>
  ),
};


// ── TextArea Variant ──────────────────────────────────────────────────────────

export const TextAreaVariant: Story = {
  name: 'TextArea Variant',
  parameters: {
    docs: {
      description: {
        story:
          'Same .form-control class on a <textarea> element. Bootstrap activates ' +
          'textarea.form-control selectors for min-height and padding-y. ' +
          'React Aria uses <TextArea> in place of <Input> — same root, same classes. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/textarea/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Default (empty)</div>
        <textarea className="form-control ref-textfield-specimen" placeholder="Enter text…" rows={3} />
      </div>

      <div>
        <div className="ref-label">With value</div>
        <textarea className="form-control ref-textfield-specimen" rows={3} defaultValue="This is some longer text that spans multiple lines in the textarea." />
      </div>

      <div>
        <div className="ref-label">Disabled</div>
        <textarea className="form-control ref-textfield-specimen" placeholder="Disabled" rows={3} disabled />
      </div>

      <div>
        <div className="ref-label">Invalid (with FieldError)</div>
        <div>
          <textarea
            className="form-control is-invalid ref-textfield-specimen"
            placeholder="Enter text…"
            rows={3}
            aria-describedby="tf-textarea-error"
          />
          <div className="invalid-feedback" id="tf-textarea-error">
            This field is required.
          </div>
        </div>
      </div>
    </div>
  ),
};


// ── Floating Label ────────────────────────────────────────────────────────────

export const FloatingLabel: Story = {
  name: 'Floating Label',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap .form-floating requires <input> before <label> (general sibling combinator ' +
          '".form-control ~ label"). React Aria renders <Label> before <Input> by default, ' +
          'so the DOM order must be swapped within the .form-floating wrapper (M016 decision). ' +
          'The "filled" state fires naturally via :not(:placeholder-shown) when the input has a value. ' +
          'The "focused" state uses .faux-focused on the wrapper. ' +
          'Source: https://getbootstrap.com/docs/5.3/forms/floating-labels/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">Empty (label as placeholder)</div>
        <div className="form-floating ref-textfield-specimen">
          <input
            className="form-control"
            id="tf-floating-empty"
            type="email"
            placeholder=" "
          />
          <label htmlFor="tf-floating-empty">Email address</label>
        </div>
      </div>

      <div>
        <div className="ref-label">With value (label floated)</div>
        <div className="form-floating ref-textfield-specimen">
          <input
            className="form-control"
            id="tf-floating-filled"
            type="email"
            placeholder=" "
            defaultValue="jane@example.com"
          />
          <label htmlFor="tf-floating-filled">Email address</label>
        </div>
      </div>

      <div>
        <div className="ref-label">Focus (.faux-focused on wrapper)</div>
        <div className="form-floating faux-focused ref-textfield-specimen">
          <input
            className="form-control"
            id="tf-floating-focus"
            type="email"
            placeholder=" "
          />
          <label htmlFor="tf-floating-focus">Email address</label>
        </div>
      </div>

      <div>
        <div className="ref-label">Disabled</div>
        <div className="form-floating ref-textfield-specimen">
          <input
            className="form-control"
            id="tf-floating-disabled"
            type="email"
            placeholder=" "
            defaultValue="jane@example.com"
            disabled
          />
          <label htmlFor="tf-floating-disabled">Email address</label>
        </div>
      </div>
    </div>
  ),
};
