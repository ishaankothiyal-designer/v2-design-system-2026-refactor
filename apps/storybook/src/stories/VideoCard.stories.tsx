import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { VideoCard, type VideoCardProps, type VideoCardSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const VIDEO_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28342-4921&t=h5zc6W2b6MPFvMVS-11";

const VIDEO_CARD_SIZES: VideoCardSize[] = ["Small", "Medium", "Large"];

function DemoMedia() {
  return (
    <div
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 50% 24%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 22%), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 45%)",
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function PlaygroundStory({
  brand = "Cars24",
  description = "Description",
  playLabel = "Play video",
  size = "Medium",
  title = "Title",
  value = "Value"
}: VideoCardProps) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Video Card Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Canonical video preview card with the centered play affordance, inverse text overlay, and
            brand-aware media surface from the Figma component set.
          </StoryCopy>
        </div>

        <VideoCard
          brand={displayBrand}
          description={description}
          playLabel={playLabel}
          size={size}
          title={title}
          value={value}
        >
          <DemoMedia />
        </VideoCard>
      </StoryCard>
    </StoryPage>
  );
}

function SizeGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Video Card Sizes
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Full visible coverage of the `Small`, `Medium`, and `Large` video-card variants from the
            Figma spec, using the canonical media slot and brand-tokenized overlay styling.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {VIDEO_CARD_SIZES.map((size) => (
            <div key={size} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {size}
              </StoryCopy>
              <VideoCard
                brand={displayBrand}
                description="Description"
                size={size}
                title="Title"
                value="Value"
              >
                <DemoMedia />
              </VideoCard>
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const galleryStyles: CSSProperties = {
  alignItems: "start",
  display: "flex",
  flexWrap: "wrap",
  gap: 24
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const defaultSourceCode = `<VideoCard
  brand="Cars24"
  size="Medium"
  title="Title"
  description="Description"
  value="Value"
/>\n`;

const meta = {
  title: "Components/Cards/Video Card",
  component: VideoCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(VIDEO_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    size: "Medium",
    title: "Title",
    description: "Description",
    value: "Value",
    playLabel: "Play video"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: VIDEO_CARD_SIZES
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    value: {
      control: "text"
    },
    playLabel: {
      control: "text"
    },
    children: {
      control: false
    },
    onPlayClick: {
      control: false
    }
  }
} satisfies Meta<typeof VideoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    docs: {
      source: {
        code: defaultSourceCode
      }
    }
  }
};

export const Sizes: Story = {
  render: ({ brand = "Cars24" }) => <SizeGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
