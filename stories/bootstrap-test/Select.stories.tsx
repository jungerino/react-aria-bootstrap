import { Select, SelectItem } from '../../src/bootstrap-test/Select';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Select> = {
  title: 'Bootstrap Test/Select',
  component: Select,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Select>;

export const Example: Story = (args) => (
  <Select {...args}>
    <SelectItem>Chocolate</SelectItem>
    <SelectItem>Mint</SelectItem>
    <SelectItem>Strawberry</SelectItem>
    <SelectItem>Vanilla</SelectItem>
  </Select>
);

Example.args = {
  label: 'Ice cream flavor'
};
