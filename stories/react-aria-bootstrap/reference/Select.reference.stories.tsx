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
 * Source: https://getbootstrap.com/docs/5.3/forms/select/
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/
 *
 * The Select trigger is a .btn styled to look like .form-select (M014 dual-counterpart).
 * .select-trigger in presentation.scss overrides .btn CSS custom properties at the variable level
 * (P-012) so all Bootstrap state rules read form-select-equivalent values automatically.
 *
 * Chevron: uses .form-select's background-image SVG approach (--bs-form-select-bg-img), positioned
 * at right 0.75rem center — NOT a .dropdown-toggle ::after border-trick caret. The trigger does
 * NOT carry the .dropdown-toggle class. Open state swaps the SVG to an up-pointing chevron via
 * --bs-form-select-bg-img override on .faux-open.
 *
 * Section 1 — Interactive states: Default, Hover, Focus, Open, Disabled, Invalid.
 * Section 2 — Size variants: Large, Default, Small (D1 resolved: explicit size prop).
 * Faux-state classes simulate pseudo-class appearances statically (P-001).
 * Focus box-shadow distinguishes focus from hover (P-014, P-016).
 * Open state shows selected value "Dog" in trigger with up-facing chevron (P-005).
 */
export const TriggerStates: Story = {
  render: () => (
    <div>
      <div className="specimen-section">
        <div className="specimen-row-header">Interactive states — .btn + .form-select appearance</div>
        <div className="specimen-row">
          <div className="specimen-group">
            <div className="specimen-label">Default</div>
            <button type="button" className="btn select-trigger">
              Select an option
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Hover</div>
            <button type="button" className="btn select-trigger faux-hover">
              Select an option
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Focus</div>
            <button type="button" className="btn select-trigger faux-focus">
              Select an option
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Open (value selected)</div>
            <button type="button" className="btn select-trigger faux-open">
              Dog
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Disabled</div>
            <button type="button" className="btn select-trigger" disabled>
              Select an option
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Invalid</div>
            <button type="button" className="btn select-trigger select-trigger-invalid">
              Select an option
            </button>
          </div>
        </div>
      </div>

      <div className="specimen-section">
        <div className="specimen-row-header">Size variants (D1: size="sm" | "lg" prop)</div>
        <div className="specimen-row specimen-row-top">
          <div className="specimen-group">
            <div className="specimen-label">Large (.form-select-lg)</div>
            <button type="button" className="btn select-trigger select-trigger-lg">
              Select an option
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Default</div>
            <button type="button" className="btn select-trigger">
              Select an option
            </button>
          </div>
          <div className="specimen-group">
            <div className="specimen-label">Small (.form-select-sm)</div>
            <button type="button" className="btn select-trigger select-trigger-sm">
              Select an option
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/
 *
 * Dropdown menu panel (.dropdown-menu) with each .dropdown-item interactive state shown as a
 * separate specimen with an external label above it. Per P-008: labels appear above each panel,
 * not injected as text into items. Per P-006: all item states shown independently.
 *
 * Bootstrap's .dropdown-item:hover and :focus share the same CSS tokens
 * (--bs-dropdown-link-hover-color / --bs-dropdown-link-hover-bg). Bootstrap does NOT suppress
 * outline on .dropdown-item, so the UA focus ring distinguishes focus from hover visually
 * (P-014, P-015). faux-focus uses outline: auto -webkit-focus-ring-color (P-001, P-016).
 *
 * Panel shows Animals list with "Dog" as the active/selected item (P-005: matches open trigger value).
 */
export const DropdownMenu: Story = {
  render: () => (
    <div>
      <div className="specimen-row-header">Dropdown menu (.dropdown-menu) — per-state specimens</div>
      <div className="specimen-row specimen-row-top">

        <div className="specimen-group">
          <div className="specimen-label">Default</div>
          <ul className="dropdown-menu dropdown-menu-static">
            <li><h6 className="dropdown-header">Animals</h6></li>
            <li><a className="dropdown-item" href="#">Cat</a></li>
            <li><a className="dropdown-item" href="#">Dog</a></li>
            <li><a className="dropdown-item" href="#">Rabbit</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Platypus</a></li>
          </ul>
        </div>

        <div className="specimen-group">
          <div className="specimen-label">Hover</div>
          <ul className="dropdown-menu dropdown-menu-static">
            <li><h6 className="dropdown-header">Animals</h6></li>
            <li><a className="dropdown-item faux-hover" href="#">Cat</a></li>
            <li><a className="dropdown-item" href="#">Dog</a></li>
            <li><a className="dropdown-item" href="#">Rabbit</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Platypus</a></li>
          </ul>
        </div>

        <div className="specimen-group">
          <div className="specimen-label">Focus</div>
          <ul className="dropdown-menu dropdown-menu-static">
            <li><h6 className="dropdown-header">Animals</h6></li>
            <li><a className="dropdown-item faux-focus" href="#">Cat</a></li>
            <li><a className="dropdown-item" href="#">Dog</a></li>
            <li><a className="dropdown-item" href="#">Rabbit</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Platypus</a></li>
          </ul>
        </div>

        <div className="specimen-group">
          <div className="specimen-label">Active / Selected</div>
          <ul className="dropdown-menu dropdown-menu-static">
            <li><h6 className="dropdown-header">Animals</h6></li>
            <li><a className="dropdown-item" href="#">Cat</a></li>
            <li><a className="dropdown-item active" href="#" aria-current="true">Dog</a></li>
            <li><a className="dropdown-item" href="#">Rabbit</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Platypus</a></li>
          </ul>
        </div>

        <div className="specimen-group">
          <div className="specimen-label">Disabled</div>
          <ul className="dropdown-menu dropdown-menu-static">
            <li><h6 className="dropdown-header">Animals</h6></li>
            <li><a className="dropdown-item" href="#">Cat</a></li>
            <li><a className="dropdown-item" href="#">Dog</a></li>
            <li><a className="dropdown-item" href="#">Rabbit</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item disabled" aria-disabled="true">Platypus</a></li>
          </ul>
        </div>

      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/select/
 * Source: https://getbootstrap.com/docs/5.3/forms/validation/
 *
 * Full form field layout: .form-label + trigger button + .form-text + .invalid-feedback.
 * Mirrors Bootstrap's stacked form field pattern for .form-select.
 * Per P-006: includes all substantive sub-parts (Label, Description, FieldError).
 *
 * Default field: label + placeholder trigger + description text (.form-text).
 * Invalid field: label + red-border trigger + error circle bg-icon + .invalid-feedback (display: block).
 * Valid field: label + green-border trigger + checkmark bg-icon + .valid-feedback with "Dog" (P-005).
 */
export const FormField: Story = {
  render: () => (
    <div className="form-field-container">
      <div className="specimen-section">
        <div className="specimen-row-header">Default field</div>
        <label className="form-label" htmlFor="select-default">Pick an animal</label>
        <button
          id="select-default"
          type="button"
          className="btn select-trigger select-trigger-block"
        >
          Select an option
        </button>
        <div className="form-text">Choose your favourite animal from the list.</div>
      </div>

      <div className="specimen-section">
        <div className="specimen-row-header">Invalid field</div>
        <label className="form-label" htmlFor="select-invalid">Pick an animal</label>
        <button
          id="select-invalid"
          type="button"
          className="btn select-trigger select-trigger-block select-trigger-invalid"
        >
          Select an option
        </button>
        <div className="invalid-feedback d-block">
          Please select a valid animal.
        </div>
      </div>

      <div className="specimen-section">
        <div className="specimen-row-header">Valid field</div>
        <label className="form-label" htmlFor="select-valid">Pick an animal</label>
        <button
          id="select-valid"
          type="button"
          className="btn select-trigger select-trigger-block select-trigger-valid"
        >
          Dog
        </button>
        <div className="valid-feedback d-block">
          Looks good!
        </div>
      </div>
    </div>
  ),
};
