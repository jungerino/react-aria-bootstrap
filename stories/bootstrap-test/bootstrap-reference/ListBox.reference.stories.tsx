import type { ReactNode, CSSProperties } from 'react';
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

// Five-item list group with one selected item; used for Root story specimens
function FiveItemList({ className = '', style = {} }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`list-group ${className}`.trim()} style={{ minWidth: 140, ...style }}>
      <a href="#" className="list-group-item list-group-item-action">Item 1</a>
      <a href="#" className="list-group-item list-group-item-action active" aria-current="true">Item 2</a>
      <a href="#" className="list-group-item list-group-item-action">Item 3</a>
      <a href="#" className="list-group-item list-group-item-action">Item 4</a>
      <a href="#" className="list-group-item list-group-item-action">Item 5</a>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────

export const Root: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — List group › Basic example](https://getbootstrap.com/docs/5.3/components/list-group/#basic-example) · [Horizontal](https://getbootstrap.com/docs/5.3/components/list-group/#horizontal)',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      <Specimen label="vertical / stack">
        <FiveItemList />
      </Specimen>

      <Specimen label="horizontal / stack">
        <FiveItemList className="list-group-horizontal" style={{ minWidth: 0 }} />
      </Specimen>

      <Specimen label="vertical / grid">
        <FiveItemList className="list-group-grid" style={{ minWidth: 0, width: 200 }} />
      </Specimen>

      <Specimen label="horizontal / grid">
        <FiveItemList className="list-group-grid-row" style={{ minWidth: 0, width: 200 }} />
      </Specimen>

      <Specimen label="focus-visible (root)">
        <FiveItemList className="faux-focus" />
      </Specimen>

      <Specimen label="empty [data-empty]">
        <div className="list-group" style={{ minWidth: 140, minHeight: 40, border: '1px solid var(--bs-list-group-border-color)', borderRadius: 'var(--bs-list-group-border-radius)' }} />
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
          '**Source:** [Bootstrap Docs — List group › Links and buttons](https://getbootstrap.com/docs/5.3/components/list-group/#links-and-buttons) · [Active items](https://getbootstrap.com/docs/5.3/components/list-group/#active-items) · [Disabled items](https://getbootstrap.com/docs/5.3/components/list-group/#disabled-items)',
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
      {/* selectionMode="single" */}
      <Specimen label='selectionMode="single" — Default (unselected)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-selected] (.active)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action active" aria-current="true">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-hovered]'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action faux-hover">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-pressed]'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action faux-active">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-focused]'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action faux-focus">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-focus-visible]'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action faux-focus-visible">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-disabled] (.disabled)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action disabled" aria-disabled="true">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="single" — [data-selected] + [data-focus-visible]'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action active faux-focus-visible" aria-current="true">Item label</a>
        </div>
      </Specimen>

      {/* selectionMode="multiple" — states that differ from single-select */}
      <Specimen label='selectionMode="multiple" — Default (unchecked indicator)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
            <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" readOnly />
            Item label
          </a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="multiple" — [data-selected] (checked indicator)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action d-flex align-items-center active" aria-current="true">
            <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" defaultChecked readOnly />
            Item label
          </a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="multiple" — [data-disabled] (disabled indicator)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action d-flex align-items-center disabled" aria-disabled="true">
            <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" disabled readOnly />
            Item label
          </a>
        </div>
      </Specimen>

      {/* selectionMode="none" */}
      <Specimen label='selectionMode="none" — Default (no indicator)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action">Item label</a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="none" — [data-hovered]'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action faux-hover">Item label</a>
        </div>
      </Specimen>

      {/* Text slot variants */}
      <Specimen label="Text slot — label only">
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action">Item label</a>
        </div>
      </Specimen>

      <Specimen label="Text slot — label + description">
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action">
            <div>Item label</div>
            <div className="small text-muted">Description text</div>
          </a>
        </div>
      </Specimen>
    </div>
  ),
};

// ── Section + Header ─────────────────────────────────────────────────────────

export const SectionAndHeader: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Dropdowns › Headers](https://getbootstrap.com/docs/5.3/components/dropdowns/#headers) (`.dropdown-header` is the Bootstrap counterpart for ListBox section headers)',
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
      <Specimen label="Single section with header, 3 items">
        <div className="list-group" style={{ minWidth: 200 }}>
          <div className="dropdown-header">Section A</div>
          <a href="#" className="list-group-item list-group-item-action">Item 1</a>
          <a href="#" className="list-group-item list-group-item-action">Item 2</a>
          <a href="#" className="list-group-item list-group-item-action">Item 3</a>
        </div>
      </Specimen>

      <Specimen label="Two sections, no selection">
        <div className="list-group" style={{ minWidth: 200 }}>
          <div className="dropdown-header">Section A</div>
          <a href="#" className="list-group-item list-group-item-action">Item 1</a>
          <a href="#" className="list-group-item list-group-item-action">Item 2</a>
          <a href="#" className="list-group-item list-group-item-action">Item 3</a>
          <div className="dropdown-header">Section B</div>
          <a href="#" className="list-group-item list-group-item-action">Item 4</a>
          <a href="#" className="list-group-item list-group-item-action">Item 5</a>
          <a href="#" className="list-group-item list-group-item-action">Item 6</a>
        </div>
      </Specimen>

      <Specimen label="Two sections, 1 item selected in each">
        <div className="list-group" style={{ minWidth: 200 }}>
          <div className="dropdown-header">Section A</div>
          <a href="#" className="list-group-item list-group-item-action active" aria-current="true">Item 1</a>
          <a href="#" className="list-group-item list-group-item-action">Item 2</a>
          <a href="#" className="list-group-item list-group-item-action">Item 3</a>
          <div className="dropdown-header">Section B</div>
          <a href="#" className="list-group-item list-group-item-action">Item 4</a>
          <a href="#" className="list-group-item list-group-item-action active" aria-current="true">Item 5</a>
          <a href="#" className="list-group-item list-group-item-action">Item 6</a>
        </div>
      </Specimen>
    </div>
  ),
};

// ── SelectionIndicator ───────────────────────────────────────────────────────

export const SelectionIndicator: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Checks & radios › Checks](https://getbootstrap.com/docs/5.3/forms/checks-radios/#checks) (Bootstrap Checkbox indicator pattern; multi-select only — single-select uses `.active` styling with no indicator)',
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
      <Specimen label='selectionMode="multiple" — unselected (unchecked)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
            <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" readOnly />
            Item label
          </a>
        </div>
      </Specimen>

      <Specimen label='selectionMode="multiple" — [data-selected] (checked)'>
        <div className="list-group" style={{ width: 220 }}>
          <a href="#" className="list-group-item list-group-item-action d-flex align-items-center active" aria-current="true">
            <input className="form-check-input m-0 me-2 flex-shrink-0" type="checkbox" defaultChecked readOnly />
            Item label
          </a>
        </div>
      </Specimen>
    </div>
  ),
};

// ── ListBoxLoadMoreItem ──────────────────────────────────────────────────────

export const ListBoxLoadMoreItem: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '**Source:** [Bootstrap Docs — Spinners › Border spinner](https://getbootstrap.com/docs/5.3/components/spinners/#border-spinner) (`.spinner-border.spinner-border-sm` at end of list)',
      },
    },
  },
  render: () => (
    <div>
      <Label>Loading — spinner at end of list</Label>
      <div className="list-group" style={{ width: 240 }}>
        <a href="#" className="list-group-item list-group-item-action">Item 1</a>
        <a href="#" className="list-group-item list-group-item-action">Item 2</a>
        <a href="#" className="list-group-item list-group-item-action">Item 3</a>
        <div className="list-group-item d-flex justify-content-center align-items-center">
          <div className="spinner-border spinner-border-sm text-secondary" role="status">
            <span className="visually-hidden">Loading more items…</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
