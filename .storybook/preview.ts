import type { Preview } from "@storybook/react";
import performancePreview from "@github-ui/storybook-addon-performance-panel/preview";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import "@geist/icons/style.css";
import { centeredCanvasDecorator, ComponentDocsPage } from "../apps/storybook/src/storybook-docs";

const performanceDecorators = Array.isArray(performancePreview.decorators)
  ? performancePreview.decorators
  : performancePreview.decorators
    ? [performancePreview.decorators]
    : [];

type StorybookBrandGlobal = "auto" | DisplayBrandId;

const brandToolbarItems = [
  {
    value: "auto",
    title: "Theme (auto)"
  },
  ...STORYBOOK_BRAND_OPTIONS.map((value) => ({
    value,
    title: value
  }))
];

const preview: Preview = {
  decorators: [
    ...performanceDecorators,
    (Story, context) => {
      const globalBrand = context.globals.brand as StorybookBrandGlobal | undefined;
      const shouldInjectBrand =
        Boolean(globalBrand) &&
        globalBrand !== "auto" &&
        (Boolean(context.argTypes?.brand) || "brand" in context.args);

      if (!shouldInjectBrand) {
        return Story();
      }

      return Story({
        args: {
          ...context.args,
          brand: globalBrand
        }
      });
    },
    centeredCanvasDecorator
  ],
  initialGlobals: {
    brand: "auto"
  },
  globalTypes: {
    brand: {
      name: "Theme",
      description: "Global brand theme",
      toolbar: {
        icon: "paintbrush",
        dynamicTitle: true,
        items: brandToolbarItems
      }
    }
  },
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
