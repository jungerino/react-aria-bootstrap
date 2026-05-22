import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Calendar',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;


// ── Shared Calendar Widget ────────────────────────────────────────────────────
// January 2025: starts Wednesday (index 3, 0=Sun). 31 days.
// Outside-month before: Dec 29 (Sun), Dec 30 (Mon), Dec 31 (Tue)
// Outside-month after: Feb 1 (Sat)

type CellDef = {
  day: number | string;
  cellClass?: string;
  outsideMonth?: boolean;
};

function CalendarWidget({
  heading,
  rows,
}: {
  heading: string;
  rows: CellDef[][];
}) {
  return (
    <div className="cal-root">
      <header className="cal-header">
        <button className="btn btn-outline-secondary btn-sm" aria-label="Previous month">
          ‹
        </button>
        <div className="cal-heading">{heading}</div>
        <button className="btn btn-outline-secondary btn-sm" aria-label="Next month">
          ›
        </button>
      </header>
      <table className="cal-table" role="grid">
        <thead>
          <tr>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <th key={d} scope="col">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  <span
                    className={[
                      'btn btn-outline-secondary btn-sm cal-cell',
                      cell.outsideMonth ? 'is-outside-month' : '',
                      cell.cellClass ?? '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {cell.day}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// January 2025 date rows (no special states — base)
const jan2025Rows: CellDef[][] = [
  [
    { day: 29, outsideMonth: true },
    { day: 30, outsideMonth: true },
    { day: 31, outsideMonth: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
  ],
  [
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
  ],
  [
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
  ],
  [
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
  ],
  [
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
    { day: 1, outsideMonth: true },
  ],
];

// January 2025 with Jan 15 selected
const jan2025Selected: CellDef[][] = jan2025Rows.map((row) =>
  row.map((cell) =>
    !cell.outsideMonth && cell.day === 15 ? { ...cell, cellClass: 'is-selected' } : cell,
  ),
);

// January 2025 with Jan 10 as "today"
const jan2025Today: CellDef[][] = jan2025Rows.map((row) =>
  row.map((cell) =>
    !cell.outsideMonth && cell.day === 10 ? { ...cell, cellClass: 'is-today' } : cell,
  ),
);

// January 2025 with today (Jan 10) and selected (Jan 15)
const jan2025TodayAndSelected: CellDef[][] = jan2025Rows.map((row) =>
  row.map((cell) => {
    if (!cell.outsideMonth && cell.day === 10) return { ...cell, cellClass: 'is-today' };
    if (!cell.outsideMonth && cell.day === 15) return { ...cell, cellClass: 'is-selected' };
    return cell;
  }),
);

// ── Full Calendar — Selected Date ─────────────────────────────────────────────

export const FullCalendarSelected: Story = {
  name: 'Full Calendar — Selected Date',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap has no calendar component. Custom CSS in augments.scss applies Bootstrap ' +
          'button token values to .cal-cell. Selected cell uses --bs-primary tokens. ' +
          'Cell shape: border-radius: 9999px (circle). Sizing: container-type + aspect-ratio.',
      },
    },
  },
  render: () => (
    <div>
      <div className="ref-label">January 2025 — Jan 15 selected</div>
      <CalendarWidget heading="January 2025" rows={jan2025Selected} />
    </div>
  ),
};

// ── Full Calendar — Today Highlighted ─────────────────────────────────────────

export const FullCalendarToday: Story = {
  name: 'Full Calendar — Today Highlighted',
  parameters: {
    docs: {
      description: {
        story:
          'Today indicator: border: 2px solid var(--bs-primary). All cells carry 2px border ' +
          '(transparent by default) to prevent layout shift when the today border appears.',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">January 2025 — Jan 10 as today</div>
        <CalendarWidget heading="January 2025" rows={jan2025Today} />
      </div>
      <div>
        <div className="ref-label">January 2025 — today + selection</div>
        <CalendarWidget heading="January 2025" rows={jan2025TodayAndSelected} />
      </div>
    </div>
  ),
};

// ── Cell States Grid ──────────────────────────────────────────────────────────
// Shows individual cell specimens outside of a table context.
// Cells use a fixed inline-size container so aspect-ratio produces a square.

export const CellStates: Story = {
  name: 'Cell States Grid',
  parameters: {
    docs: {
      description: {
        story:
          'Individual cell state specimens. Cells sized with a fixed container width (40px) ' +
          'so aspect-ratio produces a 40×40 circle outside the table container query context.',
      },
    },
  },
  render: () => {
    const cellWrap = (lbl: string, className: string, day: number | string = 15) => (
      <div className="ref-cell-specimen">
        <div className="ref-specimen-label">{lbl}</div>
        <span className={`btn btn-outline-secondary btn-sm cal-cell ${className}`}>{day}</span>
      </div>
    );

    return (
      <div className="ref-specimen-row ref-specimen-row--gap-md">
        {cellWrap('Default', '')}
        {cellWrap('Hover', 'faux-hover')}
        {cellWrap('Focus', 'faux-focus')}
        {cellWrap('Selected', 'is-selected')}
        {cellWrap('Today', 'is-today')}
        {cellWrap('Today + Selected', 'is-today is-selected')}
        {cellWrap('Disabled', 'is-disabled')}
        {cellWrap('Unavailable', 'is-unavailable')}
        {cellWrap('Outside Month', 'is-outside-month')}
      </div>
    );
  },
};
