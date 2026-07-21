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
 *
 * Trigger specimens are built from a real `<select class="form-select">`
 * (the semantic/visual counterpart's native element, per P-019) rather than
 * `.btn.dropdown-toggle` — see taxonomy Decision D1. Content values
 * demonstrate that the trigger sizes to its content rather than a fixed
 * width (P-020).
 */
export const Default: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Short value</span>
        <select className="form-select" aria-label="Favorite fruit" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
          <option value="date">Date</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Long value (widest realistic content)</span>
        <select className="form-select" aria-label="Favorite fruit" defaultValue="pomegranate">
          <option value="apple">Apple</option>
          <option value="pomegranate">Pomegranate seeds, family size</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Placeholder (no selection)</span>
        <select className="form-select" aria-label="Favorite fruit" defaultValue="">
          <option value="" disabled>Select a fruit</option>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/select/
 *
 * Isolates the size delta (`.form-select-sm` / default / `.form-select-lg`)
 * against the same selected value — Decision D3.
 */
export const Sizes: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Small</span>
        <select className="form-select form-select-sm" aria-label="Favorite fruit" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Default</span>
        <select className="form-select" aria-label="Favorite fruit" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Large</span>
        <select className="form-select form-select-lg" aria-label="Favorite fruit" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/select/
 *
 * `.form-select` defines no hover or pressed treatment at all (verified
 * against compiled CSS) — that absence is the correct target, so no hover/
 * pressed specimen is shown here (P-013 checklist: confirmed absent, not
 * skipped).
 */
export const States: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Resting</span>
        <select className="form-select" aria-label="Favorite fruit" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Focused</span>
        <select className="form-select faux-focus" aria-label="Favorite fruit" defaultValue="banana">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Disabled</span>
        <select className="form-select" aria-label="Favorite fruit" defaultValue="banana" disabled>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </select>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Invalid</span>
        <select className="form-select is-invalid" aria-label="Favorite fruit" defaultValue="">
          <option value="" disabled>Select a fruit</option>
          <option value="apple">Apple</option>
        </select>
        <div className="invalid-feedback d-block">Please choose a fruit.</div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/
 *
 * Open specimen keeps the trigger `<select>` at rest, showing the currently
 * selected value (P-005), paired with an independent `.dropdown-menu` mock
 * (P-019) since a native `<select>`'s open list is OS-rendered and
 * unstylable. Single-selection mode: selected item uses background/color
 * highlight only, no checkmark (Decision D4). Item state matrix covers
 * resting, hover, focus, selected, and disabled (P-009/P-013). The trigger's
 * native arrow is suppressed in favor of an overlaid chevron so the caret can
 * be shown flipped to the open position (P-018) — the real composite renders
 * a genuine `<ChevronDown>` child element, not a background-image arrow.
 */
export const OpenSingleSelect: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Trigger (at rest, showing selection, caret open)</span>
        <div className="ref-select-wrap">
          <select className="form-select select-reference-trigger" aria-label="Favorite fruit" defaultValue="banana">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
            <option value="date">Date</option>
          </select>
          <svg className="select-caret faux-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Open menu (item state matrix)</span>
        <div className="dropdown-menu select-reference-menu">
          <button type="button" className="dropdown-item">Apple</button>
          <button type="button" className="dropdown-item select-item-selected">Banana (selected)</button>
          <button type="button" className="dropdown-item faux-hover">Cherry (hover)</button>
          <button type="button" className="dropdown-item faux-focus">Date (focused)</button>
          <button type="button" className="dropdown-item disabled">Elderberry (disabled)</button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/dropdowns/
 *
 * Multi-selection mode: the trigger shows a comma-joined value summary
 * (content-driven, P-020 — shown at two selection counts, including the
 * widest realistic combination). Selected items use a Bootstrap-styled
 * checkbox indicator instead of background highlight — the checkbox
 * *replaces* both the checkmark and the active-background mechanism used in
 * single-selection mode (Decision D5). Full item state matrix shown since
 * the selected-state mechanism is structurally distinct from single-select,
 * not just a token-value difference (P-009). Trigger caret is shown flipped
 * to the open position (P-018), same overlay technique as OpenSingleSelect.
 */
export const OpenMultiSelect: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Trigger — two selected, caret open</span>
        {/* No `multiple` attribute: a native multi-row listbox isn't the
            target here — the custom trigger is always a single-line button
            showing a comma-joined text summary, regardless of selectionMode. */}
        <div className="ref-select-wrap">
          <select className="form-select select-reference-trigger" aria-label="Favorite fruits">
            <option>Apple, Banana</option>
          </select>
          <svg className="select-caret faux-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Trigger — widest realistic combination</span>
        <div className="ref-select-wrap">
          <select className="form-select select-reference-trigger" aria-label="Favorite fruits">
            <option>Apple, Banana, Cherry, Date</option>
          </select>
          <svg className="select-caret faux-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Open menu (checkbox indicator, item state matrix)</span>
        <div className="dropdown-menu select-reference-menu">
          <button type="button" className="dropdown-item">
            <span className="select-item-checkbox faux-checked" aria-hidden="true" />
            Apple
          </button>
          <button type="button" className="dropdown-item">
            <span className="select-item-checkbox faux-checked" aria-hidden="true" />
            Banana
          </button>
          <button type="button" className="dropdown-item faux-hover">
            <span className="select-item-checkbox" aria-hidden="true" />
            Cherry (hover, unchecked)
          </button>
          <button type="button" className="dropdown-item faux-focus">
            <span className="select-item-checkbox faux-checked" aria-hidden="true" />
            Date (focused, checked)
          </button>
          <button type="button" className="dropdown-item disabled">
            <span className="select-item-checkbox" aria-hidden="true" />
            Elderberry (disabled)
          </button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/forms/overview/ and
 * https://getbootstrap.com/docs/5.3/forms/validation/
 *
 * Label → `.form-label`, description → `.form-text`, validation message →
 * `.invalid-feedback` (forced visible — see taxonomy DOM conflicts, FieldError
 * visibility mechanism).
 */
export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="ref-row">
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + description</span>
        <div className="ref-stack">
          <label className="form-label" htmlFor="ref-select-fruit">Favorite fruit</label>
          <select className="form-select" id="ref-select-fruit" defaultValue="banana">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
          </select>
          <div className="form-text">Choose the fruit you&apos;d eat every day.</div>
        </div>
      </div>
      <div className="ref-specimen">
        <span className="ref-specimen-label">Label + invalid + feedback</span>
        <div className="ref-stack">
          <label className="form-label" htmlFor="ref-select-fruit-invalid">Favorite fruit</label>
          <select className="form-select is-invalid" id="ref-select-fruit-invalid" defaultValue="">
            <option value="" disabled>Select a fruit</option>
            <option value="apple">Apple</option>
          </select>
          <div className="invalid-feedback d-block">Please choose a fruit.</div>
        </div>
      </div>
    </div>
  ),
};
