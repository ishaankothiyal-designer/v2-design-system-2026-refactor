import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
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
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixSection,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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
  brand,
  title,
  description
}: {
  brand: NonNullable<SliderBarProps["brand"]>;
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md">
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function HeaderCell({
  brand,
  label
}: {
  brand: NonNullable<SliderBarProps["brand"]>;
  label: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function StateMatrixStory({ brand }: { brand?: NonNullable<SliderBarProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        {sliderModes.map((mode) => (
          <StoryMatrixSection key={mode}>
            <SectionHeading
              brand={activeBrand}
              title={`${mode} states`}
              description={
                mode === "Single"
                  ? "Single-value slider bar showing the normal, active, and disabled states from the canonical set."
                  : "Double-trigger range slider with the documented normal, active, and disabled states."
              }
            />

            <StoryMatrix columns="160px repeat(3, minmax(260px, 1fr))">
              <StoryMatrixCornerCell minHeight={64} />
              {sliderStates.map((state) => (
                <StoryMatrixHeaderCell key={`${mode}-${state}-header`} minHeight={64}>
                  <HeaderCell brand={activeBrand} label={state} />
                </StoryMatrixHeaderCell>
              ))}

              <StoryMatrixRowLabelCell minHeight={120}>
                <HeaderCell brand={activeBrand} label="Variant" />
              </StoryMatrixRowLabelCell>
              {sliderStates.map((state) => (
                <StoryMatrixValueCell key={`${mode}-${state}`} minHeight={120}>
                  <SliderBar
                    brand={activeBrand}
                    leadingValue={25}
                    mode={mode}
                    pointerCount={6}
                    state={state}
                    trailingValue={75}
                    value={40}
                  />
                </StoryMatrixValueCell>
              ))}
            </StoryMatrix>
          </StoryMatrixSection>
        ))}
      </div>
    </StoryPage>
  );
}

function PointerScaleStory({ brand }: { brand?: NonNullable<SliderBarProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryMatrixSection>
        <SectionHeading
          brand={activeBrand}
          title="Pointer counts"
          description="The visible Figma range-pointer variants span from 2 to 9 markers."
        />
        <StoryMatrix columns="180px minmax(0, 1fr)">
          <StoryMatrixCornerCell minHeight={64} />
          <StoryMatrixHeaderCell minHeight={64}>
            <HeaderCell brand={activeBrand} label="Preview" />
          </StoryMatrixHeaderCell>
          {pointerCounts.flatMap((count) => [
            <StoryMatrixRowLabelCell key={`pointer-count-${count}-label`} minHeight={104}>
              <HeaderCell brand={activeBrand} label={`${count} pointers`} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`pointer-count-${count}-preview`} minHeight={104}>
              <SliderBar brand={activeBrand} pointerCount={count} value={40} />
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryMatrixSection>
    </StoryPage>
  );
}

function TooltipDirectionsStory({ brand }: { brand?: NonNullable<SliderBarProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryMatrixSection>
        <SectionHeading
          brand={activeBrand}
          title="Tooltip directions"
          description="Figma exposes top, bottom, left, and right active tooltip placements for the handle."
        />
        <StoryMatrix columns="180px minmax(0, 1fr)">
          <StoryMatrixCornerCell minHeight={64} />
          <StoryMatrixHeaderCell minHeight={64}>
            <HeaderCell brand={activeBrand} label="Preview" />
          </StoryMatrixHeaderCell>
          {tooltipDirections.flatMap((direction) => [
            <StoryMatrixRowLabelCell key={`tooltip-direction-${direction}-label`} minHeight={140}>
              <HeaderCell brand={activeBrand} label={direction} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`tooltip-direction-${direction}-preview`} minHeight={140}>
              <div style={{ minHeight: 120, display: "grid", placeItems: "center", width: "100%" }}>
                <SliderBar
                  brand={activeBrand}
                  showLabels={false}
                  showPointers={false}
                  state="Active"
                  tooltipDirection={direction}
                  value={40}
                  width={160}
                />
              </div>
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryMatrixSection>
    </StoryPage>
  );
}

function OrientationStory({ brand }: { brand?: NonNullable<SliderBarProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryMatrixSection>
        <SectionHeading
          brand={activeBrand}
          title="Orientations"
          description="Horizontal remains the default and the new vertical variant preserves the same single and range behavior."
        />
        <StoryMatrix columns="180px minmax(0, 1fr)">
          <StoryMatrixCornerCell minHeight={64} />
          <StoryMatrixHeaderCell minHeight={64}>
            <HeaderCell brand={activeBrand} label="Preview" />
          </StoryMatrixHeaderCell>
          {sliderOrientations.flatMap((orientation) => [
            <StoryMatrixRowLabelCell
              key={`slider-orientation-${orientation}-label`}
              minHeight={orientation === "Vertical" ? 300 : 140}
            >
              <HeaderCell brand={activeBrand} label={orientation} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell
              key={`slider-orientation-${orientation}-preview`}
              minHeight={orientation === "Vertical" ? 300 : 140}
            >
              <div style={{ minHeight: orientation === "Vertical" ? 260 : 120, display: "grid", placeItems: "center", width: "100%" }}>
                <SliderBar
                  brand={activeBrand}
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
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryMatrixSection>
    </StoryPage>
  );
}

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
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const PointerCounts: Story = {
  render: ({ brand = "Cars24" }) => <PointerScaleStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const TooltipDirections: Story = {
  render: ({ brand = "Cars24" }) => <TooltipDirectionsStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const Orientations: Story = {
  render: ({ brand = "Cars24" }) => <OrientationStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
