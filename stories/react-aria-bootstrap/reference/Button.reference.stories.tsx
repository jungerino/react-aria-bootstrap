import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import { withBootstrap } from '../_decorators';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Reference/Button',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 *
 * Full color/style variant set (D-variant-scope): all 9 solid variants plus
 * all 8 outline variants — Bootstrap has no `outline-link`. The repo's prior
 * non-Bootstrap `'quiet'` value is dropped entirely, not aliased.
 */
export const Default: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <div className="reference-specimen-label mb-2">Solid</div>
        <div className="reference-row">
          <button type="button" className="btn btn-primary">Primary</button>
          <button type="button" className="btn btn-secondary">Secondary</button>
          <button type="button" className="btn btn-success">Success</button>
          <button type="button" className="btn btn-danger">Danger</button>
          <button type="button" className="btn btn-warning">Warning</button>
          <button type="button" className="btn btn-info">Info</button>
          <button type="button" className="btn btn-light">Light</button>
          <button type="button" className="btn btn-dark">Dark</button>
          <button type="button" className="btn btn-link">Link</button>
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Outline</div>
        <div className="reference-row">
          <button type="button" className="btn btn-outline-primary">Primary</button>
          <button type="button" className="btn btn-outline-secondary">Secondary</button>
          <button type="button" className="btn btn-outline-success">Success</button>
          <button type="button" className="btn btn-outline-danger">Danger</button>
          <button type="button" className="btn btn-outline-warning">Warning</button>
          <button type="button" className="btn btn-outline-info">Info</button>
          <button type="button" className="btn btn-outline-light">Light</button>
          <button type="button" className="btn btn-outline-dark">Dark</button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/#sizes
 *
 * `.btn-sm`/`.btn-lg` (D-size-scope) alongside the unmodified default size.
 */
export const Sizes: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Small</span>
        <button type="button" className="btn btn-primary btn-sm">Small button</button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Default</span>
        <button type="button" className="btn btn-primary">Default button</button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Large</span>
        <button type="button" className="btn btn-primary btn-lg">Large button</button>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/buttons/
 *
 * Full interactive-state matrix (P-013) for one representative of each
 * structurally distinct variant family (P-009):
 * - Solid — fill present at rest, darkens on hover/active.
 * - Outline — no fill at rest; fill *appears* on hover/active.
 * - Link — never fills or borders; focus-visible keeps resting text color
 *   (only the box-shadow ring changes) — see `.btn-link.faux-focus-visible`
 *   in presentation.scss.
 *
 * Disabled dimming is uniform (opacity-based) across all three families —
 * verified not to be a fourth structurally distinct case, so one disabled
 * specimen per family is sufficient. Plain focused-without-visible-ring is
 * not shown separately — Bootstrap defines no distinct rule for it, so it
 * is identical to Resting (see button-taxonomy.md DOM conflicts).
 */
export const States: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <div className="reference-specimen-label mb-2">Solid (btn-primary)</div>
        <div className="reference-row">
          <div className="reference-specimen">
            <span className="reference-specimen-label">Resting</span>
            <button type="button" className="btn btn-primary">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Hover</span>
            <button type="button" className="btn btn-primary faux-hover">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Focus-visible</span>
            <button type="button" className="btn btn-primary faux-focus-visible">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Pressed</span>
            <button type="button" className="btn btn-primary faux-pressed">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Disabled</span>
            <button type="button" className="btn btn-primary" disabled>Button</button>
          </div>
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Outline (btn-outline-primary)</div>
        <div className="reference-row">
          <div className="reference-specimen">
            <span className="reference-specimen-label">Resting</span>
            <button type="button" className="btn btn-outline-primary">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Hover</span>
            <button type="button" className="btn btn-outline-primary faux-hover">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Focus-visible</span>
            <button type="button" className="btn btn-outline-primary faux-focus-visible">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Pressed</span>
            <button type="button" className="btn btn-outline-primary faux-pressed">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Disabled</span>
            <button type="button" className="btn btn-outline-primary" disabled>Button</button>
          </div>
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Link (btn-link)</div>
        <div className="reference-row">
          <div className="reference-specimen">
            <span className="reference-specimen-label">Resting</span>
            <button type="button" className="btn btn-link">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Hover</span>
            <button type="button" className="btn btn-link faux-hover">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Focus-visible</span>
            <button type="button" className="btn btn-link faux-focus-visible">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Pressed</span>
            <button type="button" className="btn btn-link faux-pressed">Button</button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Disabled</span>
            <button type="button" className="btn btn-link" disabled>Button</button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Source: https://getbootstrap.com/docs/5.3/components/spinners/#buttons
 *         https://react-aria.adobe.com/react-aria-components/Button.html#pending (isPending semantics)
 *
 * Raw Bootstrap spinner markup (D-pending-indicator-composition) —
 * self-contained, does not compose `<ProgressCircle>`. React Aria keeps the
 * button focusable while pending (`aria-disabled="true"`, never the native
 * `disabled` attribute), so the dimmed look comes from `.faux-pending`, not
 * `:disabled`. The second specimen verifies `.faux-pending` wins over
 * `.faux-hover` when both apply, matching RAC's preservation of hover
 * events during pending (for tooltip support).
 */
export const Pending: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Pending</span>
        <button type="button" className="btn btn-primary faux-pending" aria-disabled="true">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />{' '}
          <span role="status">Saving...</span>
        </button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Pending + Hover (dimmed look must win)</span>
        <button type="button" className="btn btn-primary faux-pending faux-hover" aria-disabled="true">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />{' '}
          <span role="status">Saving...</span>
        </button>
      </div>
    </div>
  ),
};

/**
 * Source: none — [NO DIRECT COUNTERPART] (D-icon-only-scope). Custom,
 * non-Bootstrap-precedented recipe: `.btn-icon-only` sizes a circle from
 * `.btn`'s own tokens (see presentation.scss). Still a real interactive
 * `.btn` underneath, so the full state matrix applies.
 */
export const IconOnly: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Resting</span>
        <button type="button" className="btn btn-primary btn-icon-only" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Hover</span>
        <button type="button" className="btn btn-primary btn-icon-only faux-hover" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Focus-visible</span>
        <button type="button" className="btn btn-primary btn-icon-only faux-focus-visible" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Pressed</span>
        <button type="button" className="btn btn-primary btn-icon-only faux-pressed" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Disabled</span>
        <button type="button" className="btn btn-primary btn-icon-only" disabled aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  ),
};
