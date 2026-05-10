import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@turbo/tokens";
import { VideoFullscreenWidget, type VideoFullscreenWidgetProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const VIDEO_FULLSCREEN_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28342-4952&t=h5zc6W2b6MPFvMVS-11";

function PlaygroundStory(args: VideoFullscreenWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={{ width: 360 }}>
          <VideoFullscreenWidget {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ProgressGallery({ brand = "Cars24" }: { brand?: NonNullable<VideoFullscreenWidgetProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={activeBrand} size="xl">
            Video Fullscreen Widget Progress
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Review coverage for the story-style top progress rail while keeping the full-screen media,
            bottom related-card overlay, and CTA composition intact.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {[0, 1, 2, 3].map((progressIndex) => (
            <div key={progressIndex} style={galleryItemStyles}>
              <StoryCopy brand={activeBrand} size="sm">
                Step {progressIndex + 1}
              </StoryCopy>
              <div style={{ width: 360 }}>
                <VideoFullscreenWidget brand={activeBrand} progressCount={4} progressIndex={progressIndex} />
              </div>
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const galleryStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))"
};

const galleryItemStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const videoFullscreenWidgetSourceCode = `<VideoFullscreenWidget
  brand="Cars24"
  title="Page title"
  subtitle="Subtext"
  progressCount={4}
  progressIndex={0}
  showRelatedRail
  showCta
/>`;

const meta: Meta<VideoFullscreenWidgetProps> = {
  title: "Widgets/Video Fullscreen Widget",
  component: VideoFullscreenWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(VIDEO_FULLSCREEN_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    title: "Page title",
    subtitle: "Subtext",
    showProgress: true,
    progressCount: 4,
    progressIndex: 0,
    activeProgressValue: 51.22,
    showAction1: true,
    showAction2: true,
    showAvatarAction: true,
    showRelatedRail: true,
    scrollable: true,
    showCta: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    showProgress: {
      control: "boolean"
    },
    progressCount: {
      control: { type: "number", min: 1, max: 6, step: 1 }
    },
    progressIndex: {
      control: { type: "number", min: 0, max: 5, step: 1 }
    },
    activeProgressValue: {
      control: { type: "number", min: 0, max: 100, step: 1 }
    },
    showAction1: {
      control: "boolean"
    },
    showAction2: {
      control: "boolean"
    },
    showAvatarAction: {
      control: "boolean"
    },
    showRelatedRail: {
      control: "boolean"
    },
    scrollable: {
      control: "boolean"
    },
    showCta: {
      control: "boolean"
    },
    media: {
      control: false
    },
    relatedItems: {
      control: false
    },
    primaryAction: {
      control: false
    },
    backIcon: {
      control: false
    },
    action1Icon: {
      control: false
    },
    action2Icon: {
      control: false
    },
    avatarActionIcon: {
      control: false
    },
    onBackClick: {
      action: "back click"
    },
    onAction1Click: {
      action: "action 1 click"
    },
    onAction2Click: {
      action: "action 2 click"
    },
    onAvatarActionClick: {
      action: "avatar action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<VideoFullscreenWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: videoFullscreenWidgetSourceCode
      }
    }
  }
};

export const ProgressStates: Story = {
  render: ({ brand }) => <ProgressGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
