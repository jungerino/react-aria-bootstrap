import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import { withBootstrap } from '../_decorators';
import { Button } from '../../../src/react-aria-bootstrap/Button';
import '../presentation.scss';

const meta: Meta = {
  title: 'Bootstrap Mirror/Button',
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Mirrors Bootstrap Reference/Button's Default story: full color/style variant
 * set (D-variant-scope) — all 9 solid variants plus all 8 outline variants.
 */
export const Default: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <div className="reference-specimen-label mb-2">Solid</div>
        <div className="reference-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="light">Light</Button>
          <Button variant="dark">Dark</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Outline</div>
        <div className="reference-row">
          <Button variant="outline-primary">Primary</Button>
          <Button variant="outline-secondary">Secondary</Button>
          <Button variant="outline-success">Success</Button>
          <Button variant="outline-danger">Danger</Button>
          <Button variant="outline-warning">Warning</Button>
          <Button variant="outline-info">Info</Button>
          <Button variant="outline-light">Light</Button>
          <Button variant="outline-dark">Dark</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Mirrors Bootstrap Reference/Button's Sizes story: `.btn-sm`/`.btn-lg`
 * (D-size-scope) alongside the unmodified default size.
 */
export const Sizes: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Small</span>
        <Button variant="primary" size="sm">
          Small button
        </Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Default</span>
        <Button variant="primary">Default button</Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Large</span>
        <Button variant="primary" size="lg">
          Large button
        </Button>
      </div>
    </div>
  ),
};

/**
 * Mirrors Bootstrap Reference/Button's States story. Hover/Focus-visible/Pressed
 * can't be held declaratively for a static specimen, so those three use the same
 * `.faux-*` classes the reference story applies to native buttons (P-044) —
 * Button merges any caller-supplied `className` onto the rendered `<button>`
 * alongside its own `.btn`/variant classes, so no wrapper-scope div is needed.
 * Disabled uses the real `isDisabled` prop (sets the native `disabled`
 * attribute, same as the reference story's `disabled` attribute).
 */
export const States: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <div className="reference-specimen-label mb-2">Solid (btn-primary)</div>
        <div className="reference-row">
          <div className="reference-specimen">
            <span className="reference-specimen-label">Resting</span>
            <Button variant="primary">Button</Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Hover</span>
            <Button variant="primary" className="faux-hover">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Focus-visible</span>
            <Button variant="primary" className="faux-focus-visible">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Pressed</span>
            <Button variant="primary" className="faux-pressed">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Disabled</span>
            <Button variant="primary" isDisabled>
              Button
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Outline (btn-outline-primary)</div>
        <div className="reference-row">
          <div className="reference-specimen">
            <span className="reference-specimen-label">Resting</span>
            <Button variant="outline-primary">Button</Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Hover</span>
            <Button variant="outline-primary" className="faux-hover">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Focus-visible</span>
            <Button variant="outline-primary" className="faux-focus-visible">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Pressed</span>
            <Button variant="outline-primary" className="faux-pressed">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Disabled</span>
            <Button variant="outline-primary" isDisabled>
              Button
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Link (btn-link)</div>
        <div className="reference-row">
          <div className="reference-specimen">
            <span className="reference-specimen-label">Resting</span>
            <Button variant="link">Button</Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Hover</span>
            <Button variant="link" className="faux-hover">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Focus-visible</span>
            <Button variant="link" className="faux-focus-visible">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Pressed</span>
            <Button variant="link" className="faux-pressed">
              Button
            </Button>
          </div>
          <div className="reference-specimen">
            <span className="reference-specimen-label">Disabled</span>
            <Button variant="link" isDisabled>
              Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Mirrors Bootstrap Reference/Button's Pending story. `isPending` is a real
 * declarative prop (D-pending-indicator-composition) — Button renders raw
 * `.spinner-border.spinner-border-sm` + `role="status"` markup internally, no
 * `<ProgressCircle>` dependency. The second specimen combines `isPending` with
 * the `.faux-hover` simulation class to verify the pending dimmed look
 * (`[data-pending]`, higher specificity) wins over the hover bridge.
 */
export const Pending: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Pending</span>
        <Button variant="primary" isPending>
          Saving...
        </Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Pending + Hover (dimmed look must win)</span>
        <Button variant="primary" isPending className="faux-hover">
          Saving...
        </Button>
      </div>
    </div>
  ),
};

/**
 * Mirrors Bootstrap Reference/Button's IconOnly story. `[NO DIRECT COUNTERPART]`
 * (D-icon-only-scope) — the `iconOnly` prop adds `.btn-icon-only`, a custom
 * recipe (presentation.scss) with no Bootstrap precedent. Still a real
 * interactive `.btn` underneath, so the full state matrix applies.
 */
export const IconOnly: Story = {
  render: () => (
    <div className="reference-row">
      <div className="reference-specimen">
        <span className="reference-specimen-label">Resting</span>
        <Button variant="primary" iconOnly aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Hover</span>
        <Button variant="primary" iconOnly className="faux-hover" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Focus-visible</span>
        <Button variant="primary" iconOnly className="faux-focus-visible" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Pressed</span>
        <Button variant="primary" iconOnly className="faux-pressed" aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="reference-specimen">
        <span className="reference-specimen-label">Disabled</span>
        <Button variant="primary" iconOnly isDisabled aria-label="Add item">
          <Plus size={16} aria-hidden="true" />
        </Button>
      </div>
    </div>
  ),
};
