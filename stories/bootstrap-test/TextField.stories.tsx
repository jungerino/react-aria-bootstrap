import { TextField } from '../../src/bootstrap-test/TextField';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof TextField> = {
  title: 'Bootstrap Test/TextField',
  component: TextField,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof TextField>;

export const Example: Story = (args) => <TextField {...args} />;

Example.args = {
  label: 'Name',
  placeholder: 'Enter your name'
};
