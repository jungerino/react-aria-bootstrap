// No Bootstrap calendar component exists.
// Reference shows the intended cell treatment: .btn.btn-sm.btn-outline-secondary with
// border-color: transparent at rest (preserving hover/active states without a resting border).
// Nav buttons follow the same treatment with Bootstrap Icons chevrons.

import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta = {
  title: 'Bootstrap Reference/Calendar',
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const CellTreatment: StoryObj = {
  parameters: {
    docs: { description: { story: 'Bootstrap has no Calendar component. This reference shows the intended cell treatment: `.btn.btn-sm.btn-outline-secondary` with `border-color: transparent` at rest, which preserves hover/active states without a visible resting border. Nav chevrons follow the same treatment using Bootstrap Icons.' } },
  },
  render: () => (
    <div style={{ width: 280 }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button type="button" className="btn btn-sm btn-outline-secondary" style={{ borderColor: 'transparent' }}>
          <i className="bi bi-chevron-left" />
        </button>
        <span>April 2026</span>
        <button type="button" className="btn btn-sm btn-outline-secondary" style={{ borderColor: 'transparent' }}>
          <i className="bi bi-chevron-right" />
        </button>
      </div>
      <div className="d-flex flex-wrap" style={{ gap: 2 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} style={{ width: 36, textAlign: 'center', fontSize: '0.75rem', color: 'var(--bs-secondary)' }}>{d}</div>
        ))}
        {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
          <button
            key={d}
            type="button"
            className={`btn btn-sm btn-outline-secondary${d === 29 ? ' active' : ''}`}
            style={{ width: 36, borderColor: d === 29 ? undefined : 'transparent' }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  ),
};
