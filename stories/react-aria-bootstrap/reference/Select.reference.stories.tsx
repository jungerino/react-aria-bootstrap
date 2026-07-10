import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from '../_decorators';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Select',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Trigger — closed-state specimens.
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/ (trigger button)
 *         https://getbootstrap.com/docs/5.3/forms/select/ (visual counterpart — see select-taxonomy.md Decisions D2)
 */
export const Trigger: Story = {
  render: () => (
    <div className="spec-row">
      <div className="spec-item">
        <span className="spec-label">Default (placeholder)</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger" aria-expanded="false">
            <span className="select-trigger-value is-placeholder">Select an item</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Filled</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger" aria-expanded="false">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Hover</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger faux-hover" aria-expanded="false">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Focus</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger faux-focus" aria-expanded="false">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Open / pressed</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger faux-open" aria-expanded="true">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Disabled</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger" aria-expanded="false" disabled>
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Invalid</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger is-invalid" aria-expanded="false">
            <span className="select-trigger-value is-placeholder">Select an item</span>
            <span className="select-trigger-icon select-trigger-icon--invalid" aria-hidden="true"></span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
          <div className="invalid-feedback">Please select an animal.</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Sizes — Decisions D1 (dedicated `size` prop: 'sm' | 'md' | 'lg').
 * Source: https://getbootstrap.com/docs/5.3/forms/select/#sizing
 */
export const Sizes: Story = {
  render: () => (
    <div className="spec-row">
      <div className="spec-item">
        <span className="spec-label">Small (btn-sm)</span>
        <div className="dropdown">
          <button type="button" className="btn btn-sm dropdown-toggle select-trigger" aria-expanded="false">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Default</span>
        <div className="dropdown">
          <button type="button" className="btn dropdown-toggle select-trigger" aria-expanded="false">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Large (btn-lg)</span>
        <div className="dropdown">
          <button type="button" className="btn btn-lg dropdown-toggle select-trigger" aria-expanded="false">
            <span className="select-trigger-value">Kangaroo</span>
            <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Open — full assembly with the menu visible, showing per-item interactive
 * states (P-002: reproduces the trigger + menu ancestor/sibling context).
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/
 */
export const Open: Story = {
  render: () => (
    <div className="spec-item">
      <span className="spec-label">Open (selected value shown in trigger — P-005)</span>
      <div className="dropdown">
        <button type="button" className="btn dropdown-toggle select-trigger faux-open" aria-expanded="true">
          <span className="select-trigger-value">Kangaroo</span>
          <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
        </button>
        <ul className="dropdown-menu show select-menu">
          <li>
            <a className="dropdown-item" href="#">Koala</a>
          </li>
          <li>
            <a className="dropdown-item faux-hover" href="#">Platypus (hover)</a>
          </li>
          <li>
            <a className="dropdown-item faux-focus-visible" href="#">Bald Eagle (focused)</a>
          </li>
          <li>
            <a className="dropdown-item active" href="#" aria-selected="true">Kangaroo (selected)</a>
          </li>
          <li>
            <a className="dropdown-item disabled" href="#" aria-disabled="true">Skunk (disabled)</a>
          </li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Grouped — optional sections variant (ListBoxSection + Header), in scope
 * per M011 since it reuses the same sub-parts in a different arrangement.
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/#headers
 */
export const Grouped: Story = {
  render: () => (
    <div className="spec-item">
      <span className="spec-label">Grouped options</span>
      <div className="dropdown">
        <button type="button" className="btn dropdown-toggle select-trigger faux-open" aria-expanded="true">
          <span className="select-trigger-value">Kangaroo</span>
          <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
        </button>
        <ul className="dropdown-menu show select-menu">
          <li><h6 className="dropdown-header">Marsupials</h6></li>
          <li>
            <a className="dropdown-item" href="#">Koala</a>
          </li>
          <li>
            <a className="dropdown-item active" href="#" aria-selected="true">Kangaroo (selected)</a>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li><h6 className="dropdown-header">Birds</h6></li>
          <li>
            <a className="dropdown-item" href="#">Bald Eagle</a>
          </li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Field states — label, description, and validation composition.
 * Valid/Invalid specimens include Bootstrap's standard form-validation
 * icons (green check / red circle-exclamation), matching
 * .form-select.is-valid/.is-invalid's embedded icon exactly — not just a
 * border-color change (see select-taxonomy.md Decisions D3).
 * Source: https://getbootstrap.com/docs/5.3/forms/overview/ (form-label, form-text)
 *         https://getbootstrap.com/docs/5.3/forms/validation/ (valid-feedback, invalid-feedback, validation icons)
 */
export const FieldStates: Story = {
  render: () => (
    <div className="spec-row">
      <div className="spec-item">
        <span className="spec-label">Default (label + description)</span>
        <div>
          <label className="form-label" htmlFor="select-demo-default">Favorite animal</label>
          <div className="dropdown">
            <button type="button" id="select-demo-default" className="btn dropdown-toggle select-trigger" aria-expanded="false">
              <span className="select-trigger-value">Kangaroo</span>
              <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
            </button>
          </div>
          <div className="form-text">Choose the animal you&apos;d like to adopt.</div>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Valid (label + valid-feedback + icon)</span>
        <div>
          <label className="form-label" htmlFor="select-demo-valid">Favorite animal</label>
          <div className="dropdown">
            <button type="button" id="select-demo-valid" className="btn dropdown-toggle select-trigger is-valid" aria-expanded="false">
              <span className="select-trigger-value">Kangaroo</span>
              <span className="select-trigger-icon select-trigger-icon--valid" aria-hidden="true"></span>
              <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
            </button>
            <div className="valid-feedback">Looks good!</div>
          </div>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Invalid (label + invalid-feedback + icon)</span>
        <div>
          <label className="form-label" htmlFor="select-demo-invalid">Favorite animal</label>
          <div className="dropdown">
            <button type="button" id="select-demo-invalid" className="btn dropdown-toggle select-trigger is-invalid" aria-expanded="false">
              <span className="select-trigger-value is-placeholder">Select an item</span>
              <span className="select-trigger-icon select-trigger-icon--invalid" aria-hidden="true"></span>
              <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
            </button>
            <div className="invalid-feedback">Please select an animal.</div>
          </div>
        </div>
      </div>

      <div className="spec-item">
        <span className="spec-label">Disabled field</span>
        <div>
          <label className="form-label" htmlFor="select-demo-disabled">Favorite animal</label>
          <div className="dropdown">
            <button type="button" id="select-demo-disabled" className="btn dropdown-toggle select-trigger" aria-expanded="false" disabled>
              <span className="select-trigger-value">Kangaroo</span>
              <i className="bi bi-chevron-down select-trigger-caret" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};
