import type { ReactNode } from 'react';
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

function Label({ children }: { children: ReactNode }) {
  return (
    <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--bs-secondary-color, #6c757d)' }}>
      {children}
    </p>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ outline: '1px solid magenta', padding: 4 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ── Trigger ──────────────────────────────────────────────────────────────────

export const Trigger: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Select](https://getbootstrap.com/docs/5.3/forms/select/) (native `.form-select` is the visual target for the React Aria trigger)',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      {/* Group A — Native form-select states */}
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
          Group A — Target appearance (native <code>.form-select</code>)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 240 }}>
          <Specimen label="Default">
            <select className="form-select" defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
          <Specimen label="Valid (.is-valid)">
            <select className="form-select is-valid" defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
          <Specimen label="Invalid (.is-invalid)">
            <select className="form-select is-invalid" defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
          <Specimen label="Disabled">
            <select className="form-select" disabled defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
        </div>
      </div>

      {/* Group B — Sizes */}
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
          Group B — Sizes
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 240 }}>
          <Specimen label="Small (.form-select-sm)">
            <select className="form-select form-select-sm" defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
          <Specimen label="Default">
            <select className="form-select" defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
          <Specimen label="Large (.form-select-lg)">
            <select className="form-select form-select-lg" defaultValue="option1">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </Specimen>
        </div>
      </div>
    </div>
  ),
};

// ── Popover ──────────────────────────────────────────────────────────────────

export const Popover: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Dropdowns › Single button](https://getbootstrap.com/docs/5.3/components/dropdowns/#single-button) (`.show` applied directly — no JS; popover renders inline)',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      <Specimen label="Open, no selection">
        <ul className="dropdown-menu show" style={{ position: 'static', display: 'block', minWidth: 180 }}>
          <li><a className="dropdown-item" href="#">Apple</a></li>
          <li><a className="dropdown-item" href="#">Banana</a></li>
          <li><a className="dropdown-item" href="#">Cherry</a></li>
          <li><a className="dropdown-item" href="#">Durian</a></li>
          <li><a className="dropdown-item" href="#">Elderberry</a></li>
        </ul>
      </Specimen>

      <Specimen label="Open, one item selected (.active)">
        <ul className="dropdown-menu show" style={{ position: 'static', display: 'block', minWidth: 180 }}>
          <li><a className="dropdown-item" href="#">Apple</a></li>
          <li><a className="dropdown-item active" href="#" aria-current="true">Banana</a></li>
          <li><a className="dropdown-item" href="#">Cherry</a></li>
          <li><a className="dropdown-item" href="#">Durian</a></li>
          <li><a className="dropdown-item" href="#">Elderberry</a></li>
        </ul>
      </Specimen>

      <Specimen label="Open, one item disabled (.disabled)">
        <ul className="dropdown-menu show" style={{ position: 'static', display: 'block', minWidth: 180 }}>
          <li><a className="dropdown-item" href="#">Apple</a></li>
          <li><a className="dropdown-item" href="#">Banana</a></li>
          <li><a className="dropdown-item disabled" aria-disabled="true">Cherry</a></li>
          <li><a className="dropdown-item" href="#">Durian</a></li>
          <li><a className="dropdown-item" href="#">Elderberry</a></li>
        </ul>
      </Specimen>

      <Specimen label="Open, with divider (.dropdown-divider)">
        <ul className="dropdown-menu show" style={{ position: 'static', display: 'block', minWidth: 180 }}>
          <li><a className="dropdown-item" href="#">Apple</a></li>
          <li><a className="dropdown-item" href="#">Banana</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">Cherry</a></li>
          <li><a className="dropdown-item" href="#">Durian</a></li>
        </ul>
      </Specimen>
    </div>
  ),
};

// ── ListBoxItem ──────────────────────────────────────────────────────────────

export const ListBoxItem: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Dropdowns › Menu items](https://getbootstrap.com/docs/5.3/components/dropdowns/#menu-items) (`.dropdown-item` inside `.dropdown-menu.show`)',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      {/* selectionMode="single" */}
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
          selectionMode=&#34;single&#34;
        </p>
        <ul className="dropdown-menu show" style={{ position: 'static', display: 'block', minWidth: 200 }}>
          <li>
            <Label>Default</Label>
            <a className="dropdown-item" href="#">Option</a>
          </li>
          <li>
            <Label>Hovered</Label>
            <a className="dropdown-item faux-hover" href="#">Option</a>
          </li>
          <li>
            <Label>Focused</Label>
            <a className="dropdown-item faux-focus" href="#">Option</a>
          </li>
          <li>
            <Label>Selected / active (.active)</Label>
            <a className="dropdown-item active" href="#" aria-current="true">Option</a>
          </li>
          <li>
            <Label>Disabled (.disabled)</Label>
            <a className="dropdown-item disabled" aria-disabled="true">Option</a>
          </li>
          <li>
            <Label>Selected + focused</Label>
            <a className="dropdown-item active faux-focus" href="#" aria-current="true">Option</a>
          </li>
        </ul>
      </div>

      {/* selectionMode="multiple" */}
      <div>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-secondary-color, #6c757d)', marginBottom: '0.5rem' }}>
          selectionMode=&#34;multiple&#34;
        </p>
        <ul className="dropdown-menu show" style={{ position: 'static', display: 'block', minWidth: 200 }}>
          <li>
            <Label>Default (unselected)</Label>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" readOnly />
              Option
            </a>
          </li>
          <li>
            <Label>Selected (checked)</Label>
            <a className="dropdown-item d-flex align-items-center active" href="#" aria-current="true">
              <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" defaultChecked readOnly />
              Option
            </a>
          </li>
          <li>
            <Label>Disabled</Label>
            <a className="dropdown-item d-flex align-items-center disabled" aria-disabled="true">
              <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" disabled readOnly />
              Option
            </a>
          </li>
        </ul>
      </div>
    </div>
  ),
};

// ── Form Support ─────────────────────────────────────────────────────────────

export const FormSupport: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Forms › Form text](https://getbootstrap.com/docs/5.3/forms/form-text/) · [Validation](https://getbootstrap.com/docs/5.3/forms/validation/)',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      <Specimen label="Label (.form-label)">
        <label className="form-label">Country</label>
      </Specimen>

      <Specimen label="Description (.form-text)">
        <div className="form-text">Choose your country of residence.</div>
      </Specimen>

      <Specimen label="FieldError (.invalid-feedback)">
        {/* display: block forces visibility — Bootstrap hides .invalid-feedback by default */}
        <div className="invalid-feedback" style={{ display: 'block' }}>
          Please select a country.
        </div>
      </Specimen>
    </div>
  ),
};
