import type { Preview } from "@storybook/react";
import performancePreview from "@github-ui/storybook-addon-performance-panel/preview";
import "./fonts.css";
import "@geist/icons/style.css";

const performanceDecorators = Array.isArray(performancePreview.decorators)
  ? performancePreview.decorators
  : performancePreview.decorators
    ? [performancePreview.decorators]
    : [];

const preview: Preview = {
  decorators: performanceDecorators,
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    storybookCodePanel: {
      disabled: true,
      extensionMapping: {
        ts: "typescript",
        md: "markdown",
        mdx: "markdown"
      },
      allowedExtensions: ["tsx", "ts", "jsx", "js", "css", "scss", "json", "md", "mdx"]
    },
    designToken: {
      defaultTab: "Colors",
      pageSize: Number.MAX_VALUE
    }
  }
};

export default preview;
