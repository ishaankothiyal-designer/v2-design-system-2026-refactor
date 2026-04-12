import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { ProgressStepper, type ProgressStepperProps, type ProgressStepperStepState } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const PROGRESS_STEPPER_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=1996-17101&t=1zgOyFpiLYMyM4XM-11";

const stepStates: ProgressStepperStepState[] = ["Rest", "Active", "Loading", "Success", "Error", "Disabled"];
const stepCounts = [2, 3, 4, 5, 6] as const;

type ProgressStepperStoryArgs = Omit<ProgressStepperProps, "steps"> & {
  previewState: ProgressStepperStepState;
  stepCount: number;
};

function buildSteps(stepCount: number, state: ProgressStepperStepState) {
  return Array.from({ length: stepCount }, (_, index) => ({
    label: `Step ${index + 1}`,
    state: index === 0 ? state : "Rest"
  }));
}

function PlaygroundStory({
  brand = "Cars24",
  previewState = "Active",
  stepCount = 4,
  ...rest
}: ProgressStepperStoryArgs) {
  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <ProgressStepper
        {...rest}
        brand={brand}
        steps={buildSteps(stepCount, previewState)}
      />
    </div>
  );
}

function SectionHeading({
  title,
  description,
  tone = "primary"
}: {
  title: string;
  description?: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <StoryHeading size="lg" tone={tone}>
        {title}
      </StoryHeading>
      {description ? <StoryCopy tone={tone === "inverse" ? "inverse" : "secondary"}>{description}</StoryCopy> : null}
    </div>
  );
}

function VariantMatrixStory({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 40 }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 24 }}>
            <SectionHeading
              title="Step States"
              description="All six visible indicator states from the canonical Figma node."
            />
            <div style={stepStateGridStyles}>
              {stepStates.map((state) => (
                <div key={state} style={surfaceCardStyles}>
                  <ProgressStepper brand={brand} steps={[{ label: "Step 1", state }]} />
                </div>
              ))}
            </div>
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 24 }}>
            <SectionHeading
              title="Count Variants"
              description="The updated Figma node shows the underline progress track baked into the component, with the first step active across the count variants."
            />
            <div style={{ display: "grid", gap: 16 }}>
              {stepCounts.map((stepCount) => (
                <div key={`count-${stepCount}`} style={surfaceCardStyles}>
                  <ProgressStepper brand={brand} steps={buildSteps(stepCount, "Active")} />
                </div>
              ))}
            </div>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const stepStateGridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(3, minmax(140px, 1fr))"
};

const surfaceCardStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  display: "grid",
  minHeight: 88,
  padding: 20
};

const progressStepperUiExampleSourceCode = `import { ProgressStepper } from "@geist/web";

export function Example() {
  return (
    <ProgressStepper
      steps={[
        { label: "Step 1", state: "Success" },
        { label: "Step 2", state: "Active" },
        { label: "Step 3", state: "Loading" },
        { label: "Step 4", state: "Disabled" }
      ]}
    />
  );
}`;

const meta: Meta<ProgressStepperStoryArgs> = {
  title: "Components/Progress Stepper",
  component: ProgressStepper as never,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(PROGRESS_STEPPER_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    previewState: "Active",
    stepCount: 4
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    previewState: {
      control: "inline-radio",
      options: stepStates
    },
    stepCount: {
      control: { type: "number", min: 2, max: 6, step: 1 }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Variants: Story = {
  args: {
    brand: "Cars24",
    previewState: "Active",
    stepCount: 4
  },
  render: VariantMatrixStory,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};

export const UIExample: Story = {
  args: {
    brand: "Cars24",
    previewState: "Active",
    stepCount: 4
  },
  render: PlaygroundStory,
  parameters: {
    docs: {
      source: {
        code: progressStepperUiExampleSourceCode
      }
    }
  }
};
