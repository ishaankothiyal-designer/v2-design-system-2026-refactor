import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-designs",
    "storybook-dark-mode",
    {
      name: "storybook-design-token",
      options: {
        designTokenGlob: "src/generated/*.tokens.css"
      }
    },
    "@storybook/addon-vitest",
    "@github-ui/storybook-addon-performance-panel/preset"
  ]
};

export default config;
