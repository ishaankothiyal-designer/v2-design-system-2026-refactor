import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@turbo/tokens";
import { VideoWidget, type VideoWidgetProps } from "@turbo/web";
import type { VideoCardSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const VIDEO_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28342-4910&t=h5zc6W2b6MPFvMVS-11";
const VIDEO_CARD_SIZES: VideoCardSize[] = ["Small", "Medium", "Large"];

function PlaygroundStory(args: VideoWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={{ width: 360 }}>
          <VideoWidget {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ThemeShowcase({ brand = "Cars24" }: { brand?: NonNullable<VideoWidgetProps["brand"]> }) {
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
                Default video-widget composition with section header, clipped row of three
                video cards, and a full-width primary CTA.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <VideoWidget brand={activeBrand} />
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
                Inverse widget variant matching the dark Figma surface while reusing the same internal
                video-card rail and CTA treatment.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <VideoWidget brand={activeBrand} inverse />
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

const videoWidgetSourceCode = `<VideoWidget
  brand="Cars24"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showHeaderAction
  headerActionLabel="View all"
  showCta
  videoCardSize="Small"
/>\n`;

const meta: Meta<VideoWidgetProps> = {
  title: "Widgets/Video Widget",
  component: VideoWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(VIDEO_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    inverse: false,
    showHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    showCta: true,
    scrollable: true,
    videoCardSize: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
    },
    showHeader: {
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
    showCta: {
      control: "boolean"
    },
    scrollable: {
      control: "boolean"
    },
    videoCardSize: {
      control: "inline-radio",
      options: VIDEO_CARD_SIZES
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

type Story = StoryObj<VideoWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: videoWidgetSourceCode
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
