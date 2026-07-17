import type { Meta, StoryObj } from '@storybook/react';
import { withBootstrap } from './_decorators';
import { Select, SelectItem } from '../../src/react-aria-bootstrap/Select';
import './presentation.scss';

// Popovers render in a portal at `document.body`, absolutely positioned
// relative to the trigger — the story container's own layout doesn't reserve
// space for them automatically. `minHeight` on the wrapper reserves room so
// the open popover isn't clipped by the iframe boundary (inline-style
// exception 1: reserving vertical space for a floating overlay).
const OPEN_MIN_HEIGHT = 220;

const meta: Meta = {
  title: 'Bootstrap/Select',
  tags: ['autodocs'],
  decorators: [withBootstrap],
  parameters: { layout: 'padded' },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
    },
  },
  args: {
    label: 'Favorite fruit',
    selectionMode: 'single',
    defaultSelectedKey: 'banana',
  },
  render: (args) => (
    <div className="select-demo">
      <Select {...args}>
        <SelectItem id="aardvark">Aardvark</SelectItem>
        <SelectItem id="banana">Banana</SelectItem>
        <SelectItem id="cat">Cat</SelectItem>
        <SelectItem id="dog">Dog</SelectItem>
        <SelectItem id="kangaroo">Kangaroo</SelectItem>
      </Select>
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof meta>;

/** Baseline appearance — label, populated items, a pre-selected value. */
export const Default: Story = {};

/**
 * `selectionMode` — the only prop-driven visual variant (select-taxonomy.md
 * Variants row `selectionMode`): `single` highlights one item with no icon
 * (D-selected-indicator); `multiple` pairs a `.form-check` checkbox with each
 * item (D-multi-select-scope) and the trigger shows a comma-joined summary.
 * Both shown open (`defaultOpen`) so the difference is visible.
 */
export const Variants: Story = {
  render: () => (
    <div className="d-flex flex-wrap gap-4 align-items-start">
      <div className="d-flex flex-column gap-2">
        <span className="fw-semibold">Single</span>
        <div className="select-demo" style={{ minHeight: OPEN_MIN_HEIGHT }}>
          <Select label="Favorite fruit" defaultSelectedKey="banana" defaultOpen>
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        <span className="fw-semibold">Multiple</span>
        <div className="select-demo" style={{ minHeight: OPEN_MIN_HEIGHT }}>
          <Select<object, 'multiple'>
            label="Favorite fruits"
            selectionMode="multiple"
            defaultValue={['aardvark', 'banana']}
            defaultOpen
          >
            <SelectItem id="aardvark">Aardvark</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
            <SelectItem id="cat">Cat</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  ),
};

/** `isDisabled` — trigger, label, and description (if any) all dim/mute. */
export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

/** `isInvalid` + `errorMessage` — `.is-invalid` trigger and `.invalid-feedback` text. */
export const Invalid: Story = {
  args: {
    defaultSelectedKey: undefined,
    isInvalid: true,
    errorMessage: 'Please select a valid fruit.',
  },
};

/** `description` — `.form-text` rendered below the trigger. */
export const WithDescription: Story = {
  args: {
    description: "Choose the fruit you'd like to order.",
  },
};
