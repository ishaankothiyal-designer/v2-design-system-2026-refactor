import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { VideoTopBar, type VideoTopBarProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const VIDEO_TOP_BAR_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28342-4956&t=h5zc6W2b6MPFvMVS-11";

function DemoSurface({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 20%), linear-gradient(180deg, #6A4BFF 0%, #090909 100%)",
        height: 220,
        overflow: "hidden",
        position: "relative",
        width: 360
      }}
    >
      {children}
    </div>
  );
}

function PlaygroundStory(args: VideoTopBarProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <DemoSurface>
          <VideoTopBar {...args} />
        </DemoSurface>
      </StoryCard>
    </StoryPage>
  );
}

function VariantGallery({ brand = "Cars24" }: { brand?: NonNullable<VideoTopBarProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={activeBrand} size="xl">
            Video Top Bar Variants
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Coverage for the canonical `Story` and `Video` variants pulled directly from the Figma
            top-bar component set and used inside the fullscreen widget.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          <div style={galleryItemStyles}>
            <StoryCopy brand={activeBrand} size="sm">
              Story
            </StoryCopy>
            <DemoSurface>
              <VideoTopBar brand={activeBrand} type="Story" />
            </DemoSurface>
          </div>

          <div style={galleryItemStyles}>
            <StoryCopy brand={activeBrand} size="sm">
              Video
            </StoryCopy>
            <DemoSurface>
              <VideoTopBar brand={activeBrand} type="Video" />
            </DemoSurface>
          </div>
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

const sourceCode = `<VideoTopBar
  brand="Cars24"
  type="Story"
  title="Page title"
  subtitle="Subtext"
  progressCount={4}
  progressIndex={0}
/>`;

const meta: Meta<VideoTopBarProps> = {
  title: "Components/Video Top Bar",
  component: VideoTopBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(VIDEO_TOP_BAR_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    type: "Story",
    title: "Page title",
    subtitle: "Subtext",
    showSubtitle: true,
    showAction1: true,
    showAction2: true,
    showAvatarAction: true,
    showProgress: true,
    progressCount: 4,
    progressIndex: 0,
    activeProgressValue: 51.22,
    countdownLabel: "00:02",
    videoProgressValue: 27.27,
    showMuteAction: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: ["Story", "Video"]
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    showSubtitle: {
      control: "boolean"
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
    countdownLabel: {
      control: "text"
    },
    videoProgressValue: {
      control: { type: "number", min: 0, max: 100, step: 1 }
    },
    showMuteAction: {
      control: "boolean"
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
    muteActionIcon: {
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
    },
    onMuteActionClick: {
      action: "mute action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<VideoTopBarProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: sourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand }) => <VariantGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
