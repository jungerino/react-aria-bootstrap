import { Checkbox } from '../../src/bootstrap-test/Checkbox';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Checkbox> = {
  title: 'Bootstrap Test/Checkbox',
  component: Checkbox,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Checkbox>;

export const Example: Story = (args) => <Checkbox {...args}>Unsubscribe</Checkbox>;
