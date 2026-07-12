import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectItem, type SelectSize } from '../../src/react-aria-bootstrap/Select';
import './presentation.scss';

interface Animal {
  id: string;
  name: string;
}

const animals: Animal[] = [
  { id: 'koala', name: 'Koala' },
  { id: 'platypus', name: 'Platypus' },
  { id: 'bald-eagle', name: 'Bald Eagle' },
  { id: 'kangaroo', name: 'Kangaroo' },
  { id: 'skunk', name: 'Skunk' },
];

const sizes: SelectSize[] = ['sm', 'md', 'lg'];

const meta: Meta = {
  title: 'Bootstrap/Select',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes,
    },
  },
  args: {
    label: 'Favorite animal',
    items: animals,
    size: 'md',
    defaultSelectedKey: 'kangaroo',
  },
  render: (args) => (
    <Select {...args}>
      {(item: Animal) => <SelectItem id={item.id}>{item.name}</SelectItem>}
    </Select>
  ),
};
export default meta;

type Story = StoryObj<typeof meta>;

/** Baseline appearance — label, populated items, a pre-selected value. */
export const Default: Story = {};

/**
 * Size variants (Decisions D1 — dedicated `size` prop mapping to Bootstrap's
 * `.btn-sm`/`.btn-lg`). Shown side by side; `selectionMode` has no visual
 * delta between `single`/`multiple` (see select-taxonomy.md Variants row
 * "selectionMode") so it is not depicted as a separate visual variant here.
 */
export const Variants: Story = {
  render: () => (
    <div className="d-flex flex-wrap gap-4 align-items-start">
      {sizes.map((size) => (
        <div key={size} className="d-flex flex-column gap-2">
          <span className="fw-semibold">{size.charAt(0).toUpperCase() + size.slice(1)}</span>
          <Select aria-label="Favorite animal" items={animals} defaultSelectedKey="kangaroo" size={size}>
            {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
          </Select>
        </div>
      ))}
    </div>
  ),
};

/** `isDisabled` — trigger, label, and description (if any) all dim/mute. */
export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

/** `isInvalid` + `errorMessage` — invalid validation icon and `.invalid-feedback` text. */
export const Invalid: Story = {
  args: {
    defaultSelectedKey: undefined,
    isInvalid: true,
    errorMessage: 'Please select an animal.',
  },
};

/** `description` — `.form-text` rendered below the trigger. */
export const WithDescription: Story = {
  args: {
    description: "Choose the animal you'd like to adopt.",
  },
};
