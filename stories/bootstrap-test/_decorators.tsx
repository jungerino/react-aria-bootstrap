import type { Decorator } from '@storybook/react';

export const withBootstrapTest: Decorator = (Story, context) => {
  const theme = (context.globals?.backgrounds?.value as string) || 'light';
  return (
    <div className="bs-test" data-bs-theme={theme}>
      <Story />
    </div>
  );
};
