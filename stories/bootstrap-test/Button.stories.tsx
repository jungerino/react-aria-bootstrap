import { Button } from '../../src/bootstrap-test/Button';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Button> = {
  title: 'Bootstrap Test/Button',
  component: Button,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Button>;

export const Example: Story = (args) => <Button {...args}>Press me</Button>;

Example.args = {
  onPress: () => alert('Hello world!')
};
