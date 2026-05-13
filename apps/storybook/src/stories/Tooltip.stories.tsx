import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { Text, Tooltip, type TooltipProps, type TooltipTip } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixSection,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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

type TooltipStoryArgs = Omit<TooltipProps, "children"> & {
  label: string;
};

function PlaygroundStory(args: TooltipStoryArgs) {
  return (
    <div style={{ display: "grid", minHeight: 180, placeItems: "center", padding: 24 }}>
      <Tooltip
        label={args.label}
        {...(args.brand !== undefined ? { brand: args.brand } : {})}
        {...(args.maxWidth !== undefined ? { maxWidth: args.maxWidth } : {})}
        {...(args.tip !== undefined ? { tip: args.tip } : {})}
      />
    </div>
  );
}

function HeaderCell({ brand, label }: { brand: DisplayBrandId; label: string }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
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
      <StoryMatrixSection>
        <div style={{ display: "grid", gap: 6 }}>
          <Text brand={brand} as="strong" size="sm">
            Tip variants
          </Text>
          <Text brand={brand} as="p" size="sm" tone="secondary">
            Canonical tooltip surfaces across all visible Figma tip placements.
          </Text>
        </div>

        <StoryMatrix columns="180px minmax(0, 1fr)">
          <StoryMatrixCornerCell minHeight={64} />
          <StoryMatrixHeaderCell minHeight={64}>
            <HeaderCell brand={brand} label="Preview" />
          </StoryMatrixHeaderCell>

          {tooltipTips.flatMap((tip) => [
            <StoryMatrixRowLabelCell key={`${tip}-label`} minHeight={132}>
              <HeaderCell brand={brand} label={tip} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`${tip}-preview`} minHeight={132}>
              <div style={{ display: "grid", minHeight: 92, placeItems: "center", width: "100%" }}>
                <Tooltip
                  brand={brand}
                  label={label}
                  tip={tip}
                  {...(maxWidth !== undefined ? { maxWidth } : {})}
                />
              </div>
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryMatrixSection>
    </StoryPage>
  );
}

function buildTipsSourceCode(brand: DisplayBrandId) {
  return `import { Tooltip } from "@turbo/web";

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

export function TooltipTipsMatrix() {
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
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<TooltipStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Tips: Story = {
  render: ({ brand = "Cars24", label, maxWidth }) => (
    <TipMatrixStory brand={brand} label={label} maxWidth={maxWidth} />
  ),
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildTipsSourceCode("Cars24")
      }
    }
  }
};
