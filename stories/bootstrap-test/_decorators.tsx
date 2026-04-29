import { useEffect } from 'react';
import type { Decorator } from '@storybook/react';

export const withBootstrapTest: Decorator = (Story, context) => {
  const theme = (context.globals?.backgrounds?.value as string) || 'light';

  useEffect(() => {
    document.documentElement.dataset.bsTheme = theme;
    return () => { delete document.documentElement.dataset.bsTheme; };
  }, [theme]);

  return <Story />;
};
