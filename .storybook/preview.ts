import type { Preview } from "@storybook/react";
import performancePreview from "@github-ui/storybook-addon-performance-panel/preview";
import "@geist/icons/style.css";
import { centeredCanvasDecorator, ComponentDocsPage } from "../apps/storybook/src/storybook-docs";

const performanceDecorators = Array.isArray(performancePreview.decorators)
  ? performancePreview.decorators
  : performancePreview.decorators
    ? [performancePreview.decorators]
    : [];

const preview: Preview = {
  decorators: [...performanceDecorators, centeredCanvasDecorator],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      page: ComponentDocsPage,
      canvas: {
        layout: "centered"
      },
      story: {
        height: "400px"
      }
    }
  }
};

export default preview;
