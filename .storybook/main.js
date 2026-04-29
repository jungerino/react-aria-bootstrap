import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../stories/bootstrap-test/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
    getAbsolutePath("@storybook/addon-mcp")
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) => !/^aria-|on[A-Z]/.test(prop.name)
    },
  },
  async webpackFinal(config) {
    // Existing: add Lightning CSS to the CSS rule
    let cssRule = config.module.rules.find(rule => String(rule.test).includes('.css'));
    cssRule.use.push('lightningcss-loader');

    // New: SCSS rule
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    return config;
  }
};
export default config;
