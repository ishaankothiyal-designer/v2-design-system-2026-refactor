import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@turbo/tokens";
import {
  StepperBar,
  Text,
  type StepperBarProps,
  type StepperBarSegmentState,
  type StepperBarVariant
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const STEPPER_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=2578-76171&p=f&t=1zgOyFpiLYMyM4XM-11";

const stepCounts = [2, 3, 4, 5, 6] as const;
const variants: StepperBarVariant[] = ["Discrete", "Continuous"];
const segmentStates: StepperBarSegmentState[] = ["Not started", "Half done", "Done", "Focus"];

function PlaygroundStory(args: StepperBarProps) {
  return <StepperBar {...args} />;
}

function SectionHeading({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand="Cars24" as="strong" size="md">
        {title}
      </Text>
      {description ? (
        <Text brand="Cars24" as="p" size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function VariantMatrixStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Count variants"
            description="Figma exposes step-count variants from 2 to 6 in light Discrete and dark Continuous presentations."
          />

          <div style={matrixTableStyles}>
            <div style={matrixCornerCellStyles} />
            {variants.map((variant) => (
              <div key={`stepper-bar-${variant}-header`} style={matrixHeaderCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {variant}
                </Text>
              </div>
            ))}

            {stepCounts.flatMap((count) => [
              <div key={`stepper-bar-count-${count}-label`} style={matrixRowLabelCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {count} steps
                </Text>
              </div>,
              ...variants.map((variant) => (
                <div key={`stepper-bar-count-${count}-${variant}`} style={matrixValueCellStyles}>
                  <StepperBar stepCount={count} variant={variant} />
                </div>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function SegmentStateStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Visible bar states"
            description="The Stepper Bar API accepts per-segment state overrides so the underlying Not started, Half done, Done, and Focus states can be rendered with the same light and dark treatments shown in Figma."
          />

          <div style={stateTableStyles}>
            <div style={matrixCornerCellStyles} />
            {segmentStates.map((state) => (
              <div key={`stepper-bar-state-${state}-header`} style={matrixHeaderCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {state}
                </Text>
              </div>
            ))}

            {variants.flatMap((variant) => [
              <div key={`stepper-bar-variant-${variant}-label`} style={matrixRowLabelCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {variant}
                </Text>
              </div>,
              ...segmentStates.map((state) => (
                <div key={`stepper-bar-variant-${variant}-${state}`} style={matrixValueCellStyles}>
                  <StepperBar
                    segmentStates={[state, "Not started", "Not started"]}
                    stepCount={3}
                    variant={variant}
                  />
                </div>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixTableStyles: CSSProperties = {
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  display: "grid",
  gridTemplateColumns: "160px repeat(2, minmax(360px, 1fr))",
  overflow: "hidden"
};

const stateTableStyles: CSSProperties = {
  ...matrixTableStyles,
  gridTemplateColumns: "160px repeat(4, minmax(320px, 1fr))"
};

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 64
};

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 64,
  padding: "16px 20px"
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 96,
  padding: "16px 20px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 96,
  padding: "16px 20px"
};

const stepperBarUiExampleSourceCode = `import { StepperBar } from "@turbo/web";

export function Example() {
  return <StepperBar stepCount={4} variant="Continuous" />;
}`;

const meta = {
  title: "Components/StepperBar",
  component: StepperBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(STEPPER_BAR_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    stepCount: 4,
    variant: "Discrete"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    stepCount: {
      control: "inline-radio",
      options: stepCounts
    },
    variant: {
      control: "inline-radio",
      options: variants
    },
    segmentStates: {
      control: false
    }
  }
} satisfies Meta<typeof StepperBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Variants: Story = {
  render: VariantMatrixStory,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};

export const SegmentStates: Story = {
  render: SegmentStateStory,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};

export const UIExample: Story = {
  render: PlaygroundStory,
  parameters: {
    docs: {
      source: {
        code: stepperBarUiExampleSourceCode
      }
    }
  }
};
