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
    }
  }
};

export default preview;
