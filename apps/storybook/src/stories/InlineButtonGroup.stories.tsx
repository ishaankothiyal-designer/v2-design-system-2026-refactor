import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  InlineButtonGroup,
  type InlineButtonGroupCount,
  type InlineButtonGroupItemAction,
  type InlineButtonGroupProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

type InlineButtonGroupStoryArgs = Omit<InlineButtonGroupProps, "items"> & {
  label: string;
};

const INLINE_BUTTON_GROUP_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28847-2778&t=vUpeNbWJ84H8ABzi-11";

const buttonCounts: InlineButtonGroupCount[] = [3, 4, 5];

const previewFrameStyles: CSSProperties = {
  background: "#444444",
  boxSizing: "border-box",
  display: "grid",
  gap: 16,
  justifyItems: "center",
  padding: 16,
  width: 392
};

const widgetWidthStyles: CSSProperties = {
  width: 360
};

const compositionGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

function makeItems(count: InlineButtonGroupCount, label: string): InlineButtonGroupItemAction[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `story-inline-button-${count}-${index + 1}`,
    label,
    iconName: "plus-large-filled",
    ariaLabel: `${label} ${index + 1}`
  }));
}

function PlaygroundStory({ brand = "Cars24", label, numberOfButtons = 3, ...args }: InlineButtonGroupStoryArgs) {
  const activeBrand = brand ?? "Cars24";
  const activeCount = numberOfButtons ?? 3;

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 12, justifyItems: "start", width: "fit-content" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <StoryHeading brand={activeBrand} size="md">
            Inline button group
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="sm">
            Default Figma variant: {activeCount} equal-width shortcut actions.
          </StoryCopy>
        </div>
        <div style={previewFrameStyles}>
          <div style={widgetWidthStyles}>
            <InlineButtonGroup
              {...args}
              brand={activeBrand}
              items={makeItems(activeCount, label)}
              numberOfButtons={activeCount}
            />
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function CountMatrixStory({ brand = "Cars24", label = "Label" }: Pick<InlineButtonGroupStoryArgs, "brand" | "label">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={compositionGridStyles}>
        {buttonCounts.map((numberOfButtons) => (
          <StoryCard key={numberOfButtons} style={{ display: "grid", gap: 12, width: "fit-content" }}>
            <div style={{ display: "grid", gap: 4 }}>
              <StoryHeading brand={activeBrand} size="md">
                {numberOfButtons} buttons
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Matches the Figma Number of buttons={numberOfButtons} variant.
              </StoryCopy>
            </div>
            <div style={previewFrameStyles}>
              <div style={widgetWidthStyles}>
                <InlineButtonGroup
                  brand={activeBrand}
                  items={makeItems(numberOfButtons, label)}
                  numberOfButtons={numberOfButtons}
                />
              </div>
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

const inlineButtonGroupSourceCode = `import { InlineButtonGroup } from "@geist/web";

<InlineButtonGroup numberOfButtons={3} />`;

const meta = {
  title: "Widgets/Inline Button Group",
  component: InlineButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(INLINE_BUTTON_GROUP_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    label: "Label",
    numberOfButtons: 3
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    label: {
      control: "text"
    },
    numberOfButtons: {
      control: "radio",
      options: buttonCounts
    }
  },
  render: PlaygroundStory
} satisfies Meta<InlineButtonGroupStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: inlineButtonGroupSourceCode
      }
    }
  }
};

export const NumberOfButtons: Story = {
  render: ({ brand, label }) => <CountMatrixStory brand={(brand ?? "Cars24") as DisplayBrandId} label={label} />,
  parameters: {
    controls: { include: ["brand", "label"] }
  }
};
