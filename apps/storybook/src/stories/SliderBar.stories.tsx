import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  SliderBar,
  Text,
  type SliderBarMode,
  type SliderBarOrientation,
  type SliderBarProps,
  type SliderBarState,
  type SliderBarTooltipDirection
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const SLIDER_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=9435-23878&t=1zgOyFpiLYMyM4XM-11";

const sliderModes: SliderBarMode[] = ["Single", "Range"];
const sliderOrientations: SliderBarOrientation[] = ["Horizontal", "Vertical"];
const sliderStates: SliderBarState[] = ["Normal", "Active", "Disabled"];
const tooltipDirections: SliderBarTooltipDirection[] = ["Top", "Bottom", "Left", "Right"];
const pointerCounts = [2, 3, 4, 5, 6, 7, 8, 9] as const;

function PlaygroundStory(args: SliderBarProps) {
  const [{ leadingValue = 25, mode = "Single", trailingValue = 75, value = 40 }, updateArgs] =
    useArgs<SliderBarProps>();

  if (mode === "Range") {
    return (
      <SliderBar
        {...args}
        leadingValue={leadingValue}
        onRangeChange={(nextRange) => {
          updateArgs({
            leadingValue: nextRange.leading,
            trailingValue: nextRange.trailing
          });
          args.onRangeChange?.(nextRange);
        }}
        trailingValue={trailingValue}
      />
    );
  }

  return (
    <SliderBar
      {...args}
      onValueChange={(nextValue) => {
        updateArgs({ value: nextValue });
        args.onValueChange?.(nextValue);
      }}
      value={value}
    />
  );
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

function StateMatrixStory() {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        {sliderModes.map((mode) => (
          <StoryCard key={mode}>
            <div style={{ display: "grid", gap: 24 }}>
              <SectionHeading
                title={`${mode} states`}
                description={
                  mode === "Single"
                    ? "Single-value slider bar showing the normal, active, and disabled states from the canonical set."
                    : "Double-trigger range slider with the documented normal, active, and disabled states."
                }
              />

              <div style={matrixTableStyles}>
                <div style={matrixCornerCellStyles} />
                {sliderStates.map((state) => (
                  <div key={`${mode}-${state}-header`} style={matrixHeaderCellStyles}>
                    <Text brand="Cars24" as="strong" size="sm">
                      {state}
                    </Text>
                  </div>
                ))}

                <div style={matrixRowLabelCellStyles}>
                  <Text brand="Cars24" as="strong" size="sm">
                    Variant
                  </Text>
                </div>
                {sliderStates.map((state) => (
                  <div key={`${mode}-${state}`} style={matrixValueCellStyles}>
                    <SliderBar
                      leadingValue={25}
                      mode={mode}
                      pointerCount={6}
                      state={state}
                      trailingValue={75}
                      value={40}
                    />
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

function PointerScaleStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Pointer counts"
            description="The visible Figma range-pointer variants span from 2 to 9 markers."
          />
          <div style={pointerTableStyles}>
            {pointerCounts.map((count) => (
              <div key={`pointer-count-${count}`} style={pointerCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {count} pointers
                </Text>
                <SliderBar pointerCount={count} value={40} />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function TooltipDirectionsStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Tooltip directions"
            description="Figma exposes top, bottom, left, and right active tooltip placements for the handle."
          />
          <div style={directionGridStyles}>
            {tooltipDirections.map((direction) => (
              <div key={`tooltip-direction-${direction}`} style={directionCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {direction}
                </Text>
                <div style={{ minHeight: 120, display: "grid", placeItems: "center" }}>
                  <SliderBar
                    showLabels={false}
                    showPointers={false}
                    state="Active"
                    tooltipDirection={direction}
                    value={40}
                    width={160}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function OrientationStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Orientations"
            description="Horizontal remains the default and the new vertical variant preserves the same single and range behavior."
          />
          <div style={orientationGridStyles}>
            {sliderOrientations.map((orientation) => (
              <div key={`slider-orientation-${orientation}`} style={orientationCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {orientation}
                </Text>
                <div style={{ minHeight: orientation === "Vertical" ? 260 : 120, display: "grid", placeItems: "center" }}>
                  <SliderBar
                    height={200}
                    leadingValue={20}
                    mode="Range"
                    orientation={orientation}
                    state="Active"
                    tooltipDirection={orientation === "Vertical" ? "Right" : "Top"}
                    trailingValue={70}
                    width={orientation === "Vertical" ? 160 : 218}
                  />
                </div>
              </div>
            ))}
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
  gridTemplateColumns: "160px repeat(3, minmax(260px, 1fr))",
  overflow: "hidden"
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
  minHeight: 120,
  padding: "16px 20px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 120,
  padding: "16px 20px"
};

const pointerTableStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
};

const pointerCellStyles: CSSProperties = {
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 16,
  display: "grid",
  gap: 16,
  justifyItems: "center",
  padding: "20px 16px"
};

const directionGridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
};

const directionCellStyles: CSSProperties = {
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 16,
  display: "grid",
  gap: 16,
  justifyItems: "center",
  padding: "20px 16px"
};

const orientationGridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
};

const orientationCellStyles: CSSProperties = {
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 16,
  display: "grid",
  gap: 16,
  justifyItems: "center",
  padding: "20px 16px"
};

const sliderBarExampleSourceCode = `import { SliderBar } from "@geist/web";

export function Example() {
  return (
    <SliderBar
      mode="Range"
      leadingValue={20}
      trailingValue={70}
      state="Active"
      tooltipDirection="Top"
    />
  );
}`;

const meta: Meta<SliderBarProps> = {
  title: "Components/Slider Bar",
  component: SliderBar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(SLIDER_BAR_FIGMA_URL),
    docs: {
      source: {
        code: sliderBarExampleSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    leadingValue: 25,
    mode: "Single",
    orientation: "Horizontal",
    pointerCount: 6,
    showLabels: true,
    showPointers: true,
    state: "Normal",
    tooltipDirection: "Top",
    trailingValue: 75,
    value: 40
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    mode: {
      control: "inline-radio",
      options: sliderModes
    },
    orientation: {
      control: "inline-radio",
      options: sliderOrientations
    },
    state: {
      control: "inline-radio",
      options: sliderStates
    },
    tooltipDirection: {
      control: "inline-radio",
      options: tooltipDirections
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 }
    },
    leadingValue: {
      control: { type: "range", min: 0, max: 100, step: 1 }
    },
    trailingValue: {
      control: { type: "range", min: 0, max: 100, step: 1 }
    },
    height: {
      control: { type: "number", min: 80, max: 320, step: 1 }
    },
    pointerCount: {
      control: { type: "number", min: 2, max: 9, step: 1 }
    },
    showPointers: {
      control: "boolean"
    },
    showLabels: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<SliderBarProps>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => <StateMatrixStory />
};

export const PointerCounts: Story = {
  render: () => <PointerScaleStory />
};

export const TooltipDirections: Story = {
  render: () => <TooltipDirectionsStory />
};

export const Orientations: Story = {
  render: () => <OrientationStory />
};
