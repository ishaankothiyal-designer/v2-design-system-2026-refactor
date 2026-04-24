import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  GridWidget,
  type GridWidgetProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const GRID_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28327-4502&t=h5zc6W2b6MPFvMVS-11";

function PlaygroundStory(args: GridWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={{ width: 360 }}>
          <GridWidget {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ThemeShowcase({ brand = "Cars24" }: { brand?: NonNullable<GridWidgetProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={themeGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={activeBrand} size="lg">
                Light
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Default widget composition with section header, two medium grid cards, and a single CTA.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <GridWidget brand={activeBrand} />
            </div>
          </div>
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={activeBrand} size="lg">
                Dark
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Inverse widget variant matching the dark Figma surface while reusing the same internal components.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <GridWidget brand={activeBrand} inverse />
            </div>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const themeGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, max-content))",
  justifyContent: "center"
};

const gridWidgetSourceCode = `<GridWidget
  brand="Cars24"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showHeaderAction
  headerActionLabel="View all"
/>`;

const meta: Meta<GridWidgetProps> = {
  title: "Widgets/Grid Widget",
  component: GridWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(GRID_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    inverse: false,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    description: {
      control: "text"
    },
    tagLabel: {
      control: "text"
    },
    showTag: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    },
    children: {
      control: false
    },
    primaryAction: {
      control: false
    },
    onHeaderActionClick: {
      action: "header action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<GridWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: gridWidgetSourceCode
      }
    }
  }
};

export const Themes: Story = {
  render: ({ brand }) => <ThemeShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
