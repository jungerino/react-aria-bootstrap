import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import { withBootstrap } from './_decorators';
import { Button, type ButtonVariant } from '../../src/react-aria-bootstrap/Button';
import './presentation.scss';

const solidVariants: ButtonVariant[] = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'link',
];

const outlineVariants: ButtonVariant[] = [
  'outline-primary',
  'outline-secondary',
  'outline-success',
  'outline-danger',
  'outline-warning',
  'outline-info',
  'outline-light',
  'outline-dark',
];

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const meta: Meta = {
  title: 'Bootstrap/Button',
  tags: ['autodocs'],
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: [...solidVariants, ...outlineVariants],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'lg'],
    },
  },
  args: {
    variant: 'primary',
    children: 'Button',
  },
  render: (args) => <Button {...args} />,
};
export default meta;

type Story = StoryObj<typeof meta>;

/** Baseline appearance — `primary` variant, default size. */
export const Default: Story = {};

/**
 * `variant` (button-taxonomy.md D-variant-scope) — the full Bootstrap color/style
 * set: 9 solid variants plus their 8 `.btn-outline-*` counterparts (no
 * `outline-link`). The repo's prior non-Bootstrap `'quiet'` value was dropped.
 */
export const Variants: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <div className="reference-specimen-label mb-2">Solid</div>
        <div className="reference-row">
          {solidVariants.map((v) => (
            <Button key={v} variant={v}>
              {titleCase(v)}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="reference-specimen-label mb-2">Outline</div>
        <div className="reference-row">
          {outlineVariants.map((v) => (
            <Button key={v} variant={v}>
              {titleCase(v.replace('outline-', ''))}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** `size` (D-size-scope) — `.btn-sm`/`.btn-lg` alongside the unmodified default size. */
export const Sizes: Story = {
  render: () => (
    <div className="reference-row align-items-center">
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary">Default</Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

/** `isDisabled` — sets the native `disabled` attribute; dims via Bootstrap's disabled tokens. */
export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

/**
 * `isPending` (D-pending-indicator-composition) — renders raw
 * `.spinner-border.spinner-border-sm` + `role="status"` markup in place of
 * `children`, self-contained (no `<ProgressCircle>` dependency). The button
 * stays focusable (`aria-disabled`, not the native `disabled` attribute).
 */
export const Pending: Story = {
  args: {
    isPending: true,
    children: 'Saving...',
  },
};

/**
 * `iconOnly` (D-icon-only-scope) — `[NO DIRECT COUNTERPART]`; a custom
 * fixed-size circular recipe on top of `.btn` since Bootstrap ships no
 * icon-button component. Requires an `aria-label` since there's no visible text.
 */
export const IconOnly: Story = {
  render: () => (
    <Button variant="primary" iconOnly aria-label="Add item">
      <Plus size={16} aria-hidden="true" />
    </Button>
  ),
};
