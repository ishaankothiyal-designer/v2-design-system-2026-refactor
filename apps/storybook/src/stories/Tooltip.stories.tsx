import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Text, Tooltip, type TooltipProps, type TooltipTip } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const TOOLTIP_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=358-3600&t=1zgOyFpiLYMyM4XM-11";

const tooltipTips: TooltipTip[] = [
  "Top",
  "Top Left",
  "Top Right",
  "Bottom",
  "Bottom Left",
  "Bottom Right",
  "Left",
  "Left Top",
  "Left Bottom",
  "Right",
  "Right Top",
  "Right Bottom"
];

const tooltipColumns: Array<{ tips: TooltipTip[]; title: string }> = [
  { title: "Top", tips: ["Top", "Top Left", "Top Right"] },
  { title: "Bottom", tips: ["Bottom", "Bottom Left", "Bottom Right"] },
  { title: "Left", tips: ["Left", "Left Top", "Left Bottom"] },
  { title: "Right", tips: ["Right", "Right Top", "Right Bottom"] }
];

type TooltipStoryArgs = Omit<TooltipProps, "children"> & {
  label: string;
};

function PlaygroundStory(args: TooltipStoryArgs) {
  return (
    <div style={{ display: "grid", minHeight: 180, placeItems: "center", padding: 24 }}>
      <Tooltip {...args} label={args.label} />
    </div>
  );
}

function TipMatrixStory({
  brand,
  label,
  maxWidth
}: {
  brand: DisplayBrandId;
  label: string;
  maxWidth: number | string | undefined;
}) {
  return (
    <StoryPage fullscreen>
      <div style={columnGridStyles}>
        {tooltipColumns.map((column) => (
          <StoryCard key={column.title}>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <Text brand={brand} as="strong" size="sm">
                  {column.title} tips
                </Text>
                <Text brand={brand} as="p" size="sm" tone="secondary">
                  Canonical tooltip surfaces with the visible directional variants from the Figma node.
                </Text>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {column.tips.map((tip) => (
                  <div key={tip} style={previewRowStyles}>
                    <Text brand={brand} as="strong" size="sm">
                      {tip}
                    </Text>
                    <div style={previewFrameStyles}>
                      <Tooltip
                        brand={brand}
                        label={label}
                        tip={tip}
                        {...(maxWidth !== undefined ? { maxWidth } : {})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

function buildVariantsSourceCode(brand: DisplayBrandId) {
  return `import { Tooltip } from "@geist/web";

const tips = [
  "Top",
  "Top Left",
  "Top Right",
  "Bottom",
  "Bottom Left",
  "Bottom Right",
  "Left",
  "Left Top",
  "Left Bottom",
  "Right",
  "Right Top",
  "Right Bottom"
] as const;

export function TooltipVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {tips.map((tip) => (
        <Tooltip
          key={tip}
          brand="${brand}"
          label="A tooltip is a small box that appears when hovering over a UI element, providing additional information."
          maxWidth={248}
          tip={tip}
        />
      ))}
    </div>
  );
}`;
}

const columnGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(2, minmax(320px, 1fr))"
};

const previewRowStyles: CSSProperties = {
  alignItems: "center",
  display: "grid",
  gap: 10
};

const previewFrameStyles: CSSProperties = {
  alignItems: "center",
  background: "#FFFFFF",
  borderRadius: 16,
  display: "grid",
  justifyItems: "start",
  minHeight: 96,
  padding: 16
};

const meta: Meta<TooltipStoryArgs> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TOOLTIP_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    label: "A tooltip is a small box that appears when hovering over a UI element, providing additional information.",
    maxWidth: 248,
    tip: "Top"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    label: {
      control: "text"
    },
    maxWidth: {
      control: "number"
    },
    tip: {
      control: "select",
      options: tooltipTips
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<TooltipStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: (args) => (
    <TipMatrixStory
      brand={args.brand ?? "Cars24"}
      label={args.label}
      maxWidth={args.maxWidth}
    />
  ),
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildVariantsSourceCode("Cars24")
      }
    }
  }
};
