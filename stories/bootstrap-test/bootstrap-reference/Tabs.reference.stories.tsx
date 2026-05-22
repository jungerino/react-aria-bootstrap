import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrapTest } from '../_decorators';
import './augments.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Tabs',
  decorators: [withBootstrapTest],
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;


// ── Tab Styles ────────────────────────────────────────────────────────────────

export const TabStyles: Story = {
  name: 'Tab Styles',
  parameters: {
    docs: {
      description: {
        story:
          'Three Bootstrap nav style variants. Default for this component is .nav-underline. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/',
      },
    },
  },
  render: () => (
    <div className="ref-flex-row">
      <div>
        <div className="ref-label">.nav.nav-underline (default)</div>
        <ul className="nav nav-underline">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              First
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Second
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Third
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Disabled
            </a>
          </li>
        </ul>
      </div>

      <div>
        <div className="ref-label">.nav.nav-tabs</div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              First
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Second
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Third
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Disabled
            </a>
          </li>
        </ul>
      </div>

      <div>
        <div className="ref-label">.nav.nav-pills</div>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              First
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Second
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Third
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Disabled
            </a>
          </li>
        </ul>
      </div>
    </div>
  ),
};

// ── Tab States (nav-underline) ────────────────────────────────────────────────

export const TabStates: Story = {
  name: 'Tab States',
  parameters: {
    docs: {
      description: {
        story:
          'Individual .nav-link specimens in .nav-underline with faux state classes. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/',
      },
    },
  },
  render: () => (
    <div className="ref-specimen-row ref-specimen-row--gap-wide">
      {[
        { lbl: 'Default', cls: '' },
        { lbl: 'Hover', cls: 'faux-hover' },
        { lbl: 'Active (selected)', cls: 'active' },
        { lbl: 'Disabled', cls: 'disabled' },
      ].map(({ lbl, cls }) => (
        <div key={lbl}>
          <div className="ref-specimen-label">{lbl}</div>
          <ul className="nav nav-underline ref-nav-nowrap">
            <li className="nav-item">
              <a
                className={`nav-link ${cls}`}
                href="#"
                aria-disabled={cls === 'disabled' ? 'true' : undefined}
              >
                Tab
              </a>
            </li>
          </ul>
        </div>
      ))}
    </div>
  ),
};

// ── Full Tabs Widget ──────────────────────────────────────────────────────────

export const FullTabsWidget: Story = {
  name: 'Full Tabs Widget',
  parameters: {
    docs: {
      description: {
        story:
          'Complete TabList + TabPanel. Panel visibility: display:block baseline; ' +
          'inactive panels hidden via [hidden] attribute bridge (analogous to [data-inert] in React Aria). ' +
          '.tab-pane class not used — would hide all panels via Bootstrap default. ' +
          'Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/#javascript-behavior',
      },
    },
  },
  render: () => (
    <div>
      <div className="ref-label">Full tabs widget (.nav-underline + panels)</div>
      <ul className="nav nav-underline mb-3">
        <li className="nav-item">
          <a className="nav-link active" href="#">
            First
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Second
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Third
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#" aria-disabled="true">
            Disabled
          </a>
        </li>
      </ul>
      {/* Active panel — display:block */}
      <div className="ref-tab-panel">
        <p>
          <strong>First panel content.</strong> This panel is active — display: block applied as
          baseline. React Aria uses [data-inert] (not .tab-pane) for inactive panels.
        </p>
      </div>
      {/* Inactive panel — hidden via [hidden] attribute (analogous to [data-inert]) */}
      <div className="ref-tab-panel" hidden>
        <p>Second panel content (inactive — hidden).</p>
      </div>
      <div className="ref-tab-panel" hidden>
        <p>Third panel content (inactive — hidden).</p>
      </div>
    </div>
  ),
};

// ── Vertical Orientation ──────────────────────────────────────────────────────

export const VerticalOrientation: Story = {
  name: 'Vertical Orientation',
  parameters: {
    docs: {
      description: {
        story:
          'Bootstrap has no .nav-tabs-vertical modifier. Custom CSS in augments.scss: ' +
          '.ref-tabs-vertical wraps TabList + panel; nav-underline active indicator repositioned ' +
          'from bottom-border to right-border (sidescore). ' +
          'Source: https://getbootstrap.com/docs/5.3/components/navs-tabs/#vertical',
      },
    },
  },
  render: () => (
    <div>
      <div className="ref-label">Vertical tabs with sidescore indicator (custom CSS)</div>
      <div className="ref-tabs-vertical">
        <ul className="nav nav-underline">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              First
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Second
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Third
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" aria-disabled="true">
              Disabled
            </a>
          </li>
        </ul>
        <div className="ref-tab-content">
          <div className="ref-tab-panel">
            <p>
              <strong>First panel content.</strong> Active tab indicator is a right-edge border
              (sidescore) instead of the default bottom border.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
