import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  // Ignore Finder-style duplicate copies like "IconLibrary 2.mdx" so Storybook
  // doesn't index the same docs page twice.
  stories: [
    "../src/**/!(* [0-9]*).mdx",
    "../src/stories/!(* [0-9]*).stories.@(ts|tsx)"
  ],
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
