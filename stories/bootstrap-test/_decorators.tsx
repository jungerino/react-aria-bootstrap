import type { Decorator } from '@storybook/react';

export const withBootstrapTest: Decorator = (Story) => (
  <div className="bs-test">
    <Story />
  </div>
);
