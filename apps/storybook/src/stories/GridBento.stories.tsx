import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { GridBento, type GridBentoProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const GRID_BENTO_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28344-7765&t=vUpeNbWJ84H8ABzi-11";

function PlaygroundStory(args: GridBentoProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <GridBento {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function ThemeShowcase({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={themeGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={displayBrand} size="lg">
                Light
              </StoryHeading>
              <StoryCopy brand={displayBrand} size="sm">
                Default Figma widget composition with header, bento rows, and primary CTA.
              </StoryCopy>
            </div>
            <GridBento brand={displayBrand} />
          </div>
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={displayBrand} size="lg">
                Inverse
              </StoryHeading>
              <StoryCopy brand={displayBrand} size="sm">
                Dark Figma presentation with the same row and action composition.
              </StoryCopy>
            </div>
            <GridBento brand={displayBrand} inverse />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const themeGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(390px, max-content))",
  justifyContent: "center"
};

const gridBentoSourceCode = `<GridBento
  brand="Cars24"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showHeaderAction
  headerActionLabel="View all"
/>`;

const meta: Meta<GridBentoProps> = {
  title: "Widgets/Grid Bento",
  component: GridBento,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(GRID_BENTO_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    description: "Description goes here upto 2 lines",
    headerActionLabel: "View all",
    inverse: false,
    showButtonGroup: true,
    showHeader: true,
    showHeaderAction: true,
    showTag: true,
    subtitle: "Section title line 2",
    tagLabel: "New",
    title: "Section title"
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
    showHeader: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    showButtonGroup: {
      control: "boolean"
    },
    rows: {
      control: false
    },
    primaryAction: {
      control: false
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    },
    onHeaderActionClick: {
      action: "header action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<GridBentoProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: gridBentoSourceCode
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
