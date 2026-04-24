import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import { ProgressBar, type ProgressBarProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const PROGRESS_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=580-5333&t=1zgOyFpiLYMyM4XM-11";

const documentedPercentages = [10, 40, 100] as const;

function VariantCard({
  brand,
  percentage,
  showPercentage = true
}: {
  brand: NonNullable<ProgressBarProps["brand"]>;
  percentage: (typeof documentedPercentages)[number];
  showPercentage?: boolean;
}) {
  return (
    <div style={surfaceCardStyles}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={variantHeadingStyles}>{`${percentage}%`}</div>
        <ProgressBar brand={brand} percentage={percentage} showPercentage={showPercentage} />
      </div>
    </div>
  );
}

function PlaygroundStory(args: ProgressBarProps) {
  return (
    <div style={{ minWidth: 260 }}>
      <ProgressBar {...args} />
    </div>
  );
}

function VariantsStory({ brand = "Cars24" }: Pick<ProgressBarProps, "brand">) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <div style={sectionTitleStyles}>Documented Figma variants</div>
            <div style={sectionCopyStyles}>
              The published Progress Bar component set exposes three visible percentage variants: 10%, 40%, and 100%.
            </div>
          </div>

          <div style={variantGridStyles}>
            {documentedPercentages.map((percentage) => (
              <VariantCard brand={brand} key={`progress-bar-${percentage}`} percentage={percentage} />
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(3, minmax(180px, 1fr))"
};

const surfaceCardStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  padding: 20
};

const sectionTitleStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.primary),
  fontSize: 18,
  fontWeight: 600,
  lineHeight: "24px"
};

const sectionCopyStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 14,
  lineHeight: "20px"
};

const variantHeadingStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.primary),
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const progressBarUiExampleSourceCode = `import { ProgressBar } from "@geist/web";

export function Example() {
  return <ProgressBar percentage={40} />;
}`;

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(PROGRESS_BAR_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    percentage: 40,
    showPercentage: true
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    percentage: {
      control: { type: "range", min: 0, max: 100, step: 1 }
    },
    showPercentage: {
      control: "boolean"
    },
    width: {
      control: { type: "number", min: 80, max: 320, step: 1 }
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantsStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen"
  }
};

export const UIExample: Story = {
  parameters: {
    docs: {
      source: {
        code: progressBarUiExampleSourceCode
      }
    }
  }
};
