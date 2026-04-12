import type { Preview } from "@storybook/react";
import performancePreview from "@github-ui/storybook-addon-performance-panel/preview";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import "./fonts.css";
import "@geist/icons/style.css";

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
    }
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
