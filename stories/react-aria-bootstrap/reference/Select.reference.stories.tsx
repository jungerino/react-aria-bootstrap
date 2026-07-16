import type { Meta, StoryObj } from '@storybook/react';
import { ChevronDown } from 'lucide-react';
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
 * Source: https://getbootstrap.com/docs/5.3/forms/select/ (trigger appearance)
 *
 * Select's trigger renders as a real `<button>` (not a native `<select>`),
 * so it is styled with `.form-select` — chosen over Dropdown Toggle
 * (`.btn.dropdown-toggle`) per the taxonomy's D-form-select-class decision.
 * The chevron is a real icon substituting for `.form-select`'s
 * background-image chevron (see `.select-trigger` in presentation.scss).
 */
export const Default: Story = {
  render: () => (
    <div className="dropdown select-demo">
      <label className="form-label" htmlFor="select-default">Favorite fruit</label>
      <button
        type="button"
        id="select-default"
        className="form-select select-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span className="select-value is-placeholder">Select an item</span>
        <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
      </button>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/select/ (trigger states)
 *         https://getbootstrap.com/docs/5.3/forms/validation/ (is-invalid + invalid-feedback)
 *
 * Interactive-state matrix for the closed trigger. Every specimen keeps the
 * same selected value ("Banana") so state-driven visual differences are the
 * only variable. Hover and required are included even though `.form-select`
 * defines no distinct visual for them, per P-013's full-matrix requirement —
 * the "no visual difference" fact is demonstrated, not omitted.
 */
export const States: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Resting</span>
        <div className="dropdown select-demo">
          <button type="button" className="form-select select-trigger" aria-haspopup="listbox" aria-expanded="false">
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Hover (no visual change — `.form-select` defines no `:hover` rule)</span>
        <div className="dropdown select-demo">
          <button type="button" className="form-select select-trigger" aria-haspopup="listbox" aria-expanded="false">
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Focus-visible</span>
        <div className="dropdown select-demo">
          <button type="button" className="form-select select-trigger faux-focus-visible" aria-haspopup="listbox" aria-expanded="false">
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Pressed (subtle tint — D-pressed-state)</span>
        <div className="dropdown select-demo">
          <button type="button" className="form-select select-trigger faux-pressed" aria-haspopup="listbox" aria-expanded="false">
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Disabled</span>
        <div className="dropdown select-demo">
          <button type="button" className="form-select select-trigger" disabled aria-haspopup="listbox" aria-expanded="false">
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Invalid</span>
        <div className="dropdown select-demo">
          <button
            type="button"
            id="select-invalid"
            className="form-select select-trigger is-invalid"
            aria-haspopup="listbox"
            aria-expanded="false"
            aria-describedby="select-invalid-feedback"
          >
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
          <div id="select-invalid-feedback" className="invalid-feedback">
            Please select a valid fruit.
          </div>
        </div>
      </div>

      <div className="reference-specimen">
        <span className="reference-specimen-label">Required (informational only — no distinct visual)</span>
        <div className="dropdown select-demo">
          <button type="button" className="form-select select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-required="true">
            <span className="select-value">Banana</span>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/ (menu/item structure)
 *
 * Open, realistic appearance (P-005): the trigger shows the currently
 * selected value and the chevron is rotated to its open position (P-018).
 * The matching item is marked `.active` with no icon (D-selected-indicator).
 */
export const Open: Story = {
  render: () => (
    <div className="dropdown select-demo">
      <label className="form-label" htmlFor="select-open">Favorite fruit</label>
      <button
        type="button"
        id="select-open"
        className="form-select select-trigger faux-open"
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        <span className="select-value">Banana</span>
        <ChevronDown size={16} className="select-chevron faux-open" aria-hidden="true" />
      </button>
      <div className="dropdown-menu select-popover show">
        <div className="dropdown-listbox" role="listbox">
          <div className="dropdown-item" role="option">Aardvark</div>
          <div className="dropdown-item active" role="option" aria-selected="true">Banana</div>
          <div className="dropdown-item" role="option">Cat</div>
          <div className="dropdown-item" role="option">Dog</div>
          <div className="dropdown-item" role="option">Kangaroo</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/ (item states)
 *
 * Full interactive-state matrix for listbox items (P-009), open by default.
 * Item text doubles as the state label (P-008 — labels may not be injected
 * inside the popover/listbox boundary). The trigger's shown value matches
 * the item marked `.active` (P-005).
 */
export const OpenItemStates: Story = {
  render: () => (
    <div className="dropdown select-demo">
      <label className="form-label" htmlFor="select-open-states">Item states</label>
      <button
        type="button"
        id="select-open-states"
        className="form-select select-trigger faux-open"
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        <span className="select-value">Selected</span>
        <ChevronDown size={16} className="select-chevron faux-open" aria-hidden="true" />
      </button>
      <div className="dropdown-menu select-popover show">
        <div className="dropdown-listbox" role="listbox">
          <div className="dropdown-item" role="option">Resting</div>
          <div className="dropdown-item faux-hover" role="option">Hovered</div>
          <div className="dropdown-item faux-focus-visible" role="option">Focused</div>
          <div className="dropdown-item active" role="option" aria-selected="true">Selected</div>
          <div className="dropdown-item disabled" role="option" aria-disabled="true">Disabled</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/ (dropdown-header)
 *
 * Sectioned listbox using `.dropdown-header`, mirroring the Fruit/Vegetable
 * grouping example from the React Aria Select docs' Content section.
 */
export const OpenGrouped: Story = {
  render: () => (
    <div className="dropdown select-demo">
      <label className="form-label" htmlFor="select-open-grouped">Preferred fruit or vegetable</label>
      <button
        type="button"
        id="select-open-grouped"
        className="form-select select-trigger faux-open"
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        <span className="select-value">Banana</span>
        <ChevronDown size={16} className="select-chevron faux-open" aria-hidden="true" />
      </button>
      <div className="dropdown-menu select-popover show">
        <div className="dropdown-listbox" role="listbox">
          <h6 className="dropdown-header">Fruit</h6>
          <div className="dropdown-item" role="option">Apple</div>
          <div className="dropdown-item active" role="option" aria-selected="true">Banana</div>
          <div className="dropdown-item" role="option">Orange</div>
          <h6 className="dropdown-header">Vegetable</h6>
          <div className="dropdown-item" role="option">Cabbage</div>
          <div className="dropdown-item" role="option">Broccoli</div>
          <div className="dropdown-item" role="option">Carrots</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/checks-radios/ (form-check structure)
 *         https://getbootstrap.com/docs/5.3/components/dropdowns/ (menu/item structure)
 *
 * `selectionMode="multiple"` (D-multi-select-scope): Bootstrap has no
 * built-in multi-select dropdown-menu pattern, so each item pairs a
 * `.form-check` checkbox with its label inside the `.dropdown-item` — the
 * closest structural recipe built from primitives already in the KB. The
 * trigger shows a comma-joined summary of the selected values.
 */
export const MultiSelect: Story = {
  render: () => (
    <div className="dropdown select-demo">
      <label className="form-label" htmlFor="select-multi">States</label>
      <button
        type="button"
        id="select-multi"
        className="form-select select-trigger faux-open"
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        <span className="select-value">Alabama, Alaska</span>
        <ChevronDown size={16} className="select-chevron faux-open" aria-hidden="true" />
      </button>
      <div className="dropdown-menu select-popover show">
        <div className="dropdown-listbox" role="listbox" aria-multiselectable="true">
          <div className="dropdown-item select-multi-item" role="option" aria-selected="true">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="select-multi-al" checked readOnly />
              <label className="form-check-label" htmlFor="select-multi-al">Alabama</label>
            </div>
          </div>
          <div className="dropdown-item select-multi-item" role="option" aria-selected="true">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="select-multi-ak" checked readOnly />
              <label className="form-check-label" htmlFor="select-multi-ak">Alaska</label>
            </div>
          </div>
          <div className="dropdown-item select-multi-item" role="option" aria-selected="false">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="select-multi-az" readOnly />
              <label className="form-check-label" htmlFor="select-multi-az">Arizona</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
