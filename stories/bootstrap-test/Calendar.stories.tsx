import { Calendar } from '../../src/bootstrap-test/Calendar';
import type { Meta, StoryFn } from '@storybook/react';
import { withBootstrapTest } from './_decorators';

const meta: Meta<typeof Calendar> = {
  title: 'Bootstrap Test/Calendar',
  component: Calendar,
  decorators: [withBootstrapTest],
  parameters: { layout: 'centered' },
  tags: ['autodocs']
};

export default meta;
type Story = StoryFn<typeof Calendar>;

export const Example: Story = (args) => (
  <Calendar aria-label="Event date" {...args} />
);
