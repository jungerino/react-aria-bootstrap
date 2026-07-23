import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectItem } from '../../src/react-aria-bootstrap/Select';

const meta: Meta<typeof Select> = {
  title: 'Bootstrap/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'lg'],
      description: 'Trigger size modifier (`.form-select-sm` / `.form-select-lg`). Leave unset for the default size.',
    },
    selectionMode: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
    },
  },
  args: {
    label: 'Favorite fruit',
    placeholder: 'Select a fruit',
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    defaultValue: 'banana',
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana">Banana</SelectItem>
      <SelectItem id="cherry">Cherry</SelectItem>
      <SelectItem id="date">Date</SelectItem>
    </Select>
  ),
};

const sizeLabels = {
  sm: 'Small',
  default: 'Default',
  lg: 'Large',
} as const;

/**
 * All supported trigger sizes (Decision D3: custom `size` prop, no React Aria
 * equivalent) side by side against the same selected value.
 */
export const Variants: Story = {
  render: () => (
    <div className="d-flex gap-4 flex-wrap">
      {(['sm', 'default', 'lg'] as const).map((key) => (
        <div key={key}>
          <p className="fw-semibold mb-1">{sizeLabels[key]}</p>
          <Select aria-label="Favorite fruit" size={key === 'default' ? undefined : key} defaultValue="banana">
            <SelectItem id="apple">Apple</SelectItem>
            <SelectItem id="banana">Banana</SelectItem>
          </Select>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: 'banana',
    isDisabled: true,
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana">Banana</SelectItem>
    </Select>
  ),
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    errorMessage: 'Please choose a fruit.',
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana">Banana</SelectItem>
    </Select>
  ),
};

export const WithDescription: Story = {
  args: {
    defaultValue: 'banana',
    description: "Choose the fruit you'd eat every day.",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem id="apple">Apple</SelectItem>
      <SelectItem id="banana">Banana</SelectItem>
    </Select>
  ),
};
