import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/ListBox',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;


// ── Default Vertical List ─────────────────────────────────────────────────────

export const DefaultVertical: Story = {
  name: 'Default Vertical List',
  parameters: {
    docs: {
      description: {
        story: 'Source: https://getbootstrap.com/docs/5.3/components/list-group/#basic-example',
      },
    },
  },
  render: () => (
    <div>
      <div>
        <div className="ref-label">List Group (interactive)</div>
        <div className="list-group ref-listbox-specimen">
          <button className="list-group-item list-group-item-action" type="button">
            Aardvark
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Bear
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Cat
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Dog
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Elephant
          </button>
        </div>
      </div>
    </div>
  ),
};

// ── Item States ───────────────────────────────────────────────────────────────

export const ItemStates: Story = {
  name: 'Item States',
  parameters: {
    docs: {
      description: {
        story:
          'Faux state classes from augments.scss reproduce hover/focus/active CSS variable values statically. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/list-group/#active-items',
      },
    },
  },
  render: () => (
    <div>
      <div>
        <div className="ref-label">Item States</div>
        <div className="list-group ref-listbox-specimen">
          <button className="list-group-item list-group-item-action" type="button">
            Default
          </button>
          <button
            className="list-group-item list-group-item-action faux-hover"
            type="button"
          >
            Hover
          </button>
          <button
            className="list-group-item list-group-item-action faux-focus"
            type="button"
          >
            Focus
          </button>
          <button
            className="list-group-item list-group-item-action faux-active"
            type="button"
          >
            Pressed
          </button>
          <button className="list-group-item list-group-item-action active" type="button">
            Selected (.active)
          </button>
          <button
            className="list-group-item list-group-item-action disabled"
            type="button"
            aria-disabled="true"
          >
            Disabled
          </button>
        </div>
      </div>
    </div>
  ),
};

// ── Selection — Single ────────────────────────────────────────────────────────

export const SelectionSingle: Story = {
  name: 'Selection — Single Select',
  parameters: {
    docs: {
      description: {
        story:
          'Single-select: selection expressed via .active token styling only (background + text color). ' +
          'No checkbox indicator. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/list-group/#active-items',
      },
    },
  },
  render: () => (
    <div>
      <div>
        <div className="ref-label">Single-select (one item selected, no indicator)</div>
        <div className="list-group ref-listbox-specimen">
          <button className="list-group-item list-group-item-action" type="button">
            Apple
          </button>
          <button className="list-group-item list-group-item-action active" type="button">
            Banana
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Cherry
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Date
          </button>
        </div>
      </div>
    </div>
  ),
};

// ── Selection — Multiple (with checkboxes) ────────────────────────────────────

export const SelectionMultiple: Story = {
  name: 'Selection — Multi Select',
  parameters: {
    docs: {
      description: {
        story:
          'Multi-select: .form-check-input checkbox is the sole selection indicator — no .active background fill. ' +
          'The checked checkbox is sufficient; .active would create visual redundancy. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/list-group/#checkboxes-and-radios',
      },
    },
  },
  render: () => (
    <div>
      <div>
        <div className="ref-label">Multi-select (checkbox indicator per item)</div>
        <div className="list-group ref-listbox-specimen">
          <label className="list-group-item list-group-item-action d-flex gap-2 align-items-center">
            <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked />
            <span>Apple</span>
          </label>
          <label className="list-group-item list-group-item-action d-flex gap-2 align-items-center">
            <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked />
            <span>Banana</span>
          </label>
          <label className="list-group-item list-group-item-action d-flex gap-2 align-items-center">
            <input className="form-check-input flex-shrink-0" type="checkbox" />
            <span>Cherry</span>
          </label>
          <label className="list-group-item list-group-item-action d-flex gap-2 align-items-center">
            <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked />
            <span>Date</span>
          </label>
          <label className="list-group-item list-group-item-action disabled d-flex gap-2 align-items-center">
            <input className="form-check-input flex-shrink-0" type="checkbox" disabled />
            <span>Elderberry (disabled)</span>
          </label>
        </div>
      </div>
    </div>
  ),
};

// ── Section Grouping ──────────────────────────────────────────────────────────

export const SectionGrouping: Story = {
  name: 'Section Grouping',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap has no list-group section header pattern. Custom .list-group-section-header ' +
          'class based on Bootstrap .dropdown-header visual (font-size, weight, secondary color). ' +
          'Source: https://getbootstrap.com/docs/5.3/components/dropdowns/#headers',
      },
    },
  },
  render: () => (
    <div>
      <div>
        <div className="ref-label">Section grouping (custom header CSS)</div>
        <div className="list-group list-group-sectioned ref-listbox-specimen">
          <div className="list-group-section-header">Fruits</div>
          <button className="list-group-item list-group-item-action" type="button">
            Apple
          </button>
          <button className="list-group-item list-group-item-action active" type="button">
            Banana
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Cherry
          </button>
          <div className="list-group-section-header">Vegetables</div>
          <button className="list-group-item list-group-item-action" type="button">
            Carrot
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Broccoli
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Spinach
          </button>
        </div>
      </div>
    </div>
  ),
};

// ── Horizontal Layout ─────────────────────────────────────────────────────────

export const HorizontalLayout: Story = {
  name: 'Horizontal Layout',
  parameters: {
    docs: {
      description: {
        story: 'Source: https://getbootstrap.com/docs/5.3/components/list-group/#horizontal',
      },
    },
  },
  render: () => (
    <div className="ref-stack">
      <div>
        <div className="ref-label">Horizontal (.list-group-horizontal)</div>
        <div className="list-group list-group-horizontal">
          <button className="list-group-item list-group-item-action" type="button">
            Apple
          </button>
          <button className="list-group-item list-group-item-action active" type="button">
            Banana
          </button>
          <button className="list-group-item list-group-item-action" type="button">
            Cherry
          </button>
          <button className="list-group-item list-group-item-action disabled" type="button">
            Disabled
          </button>
        </div>
      </div>
    </div>
  ),
};

// ── Grid Layout ───────────────────────────────────────────────────────────────

export const GridLayout: Story = {
  name: 'Grid Layout',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap has no grid list-group. Custom CSS in augments.scss: .list-group-grid uses ' +
          'CSS Grid with --list-group-grid-columns custom property (default 3). ' +
          'Source: https://getbootstrap.com/docs/5.3/components/list-group/',
      },
    },
  },
  render: () => (
    <div>
      <div className="ref-label">Grid layout (3 columns, custom CSS)</div>
      <div className="list-group list-group-grid ref-listbox-grid-specimen">
        <button className="list-group-item list-group-item-action" type="button">
          Apple
        </button>
        <button className="list-group-item list-group-item-action active" type="button">
          Banana
        </button>
        <button className="list-group-item list-group-item-action" type="button">
          Cherry
        </button>
        <button className="list-group-item list-group-item-action" type="button">
          Date
        </button>
        <button className="list-group-item list-group-item-action" type="button">
          Elderberry
        </button>
        <button className="list-group-item list-group-item-action disabled" type="button">
          Disabled
        </button>
      </div>
    </div>
  ),
};
