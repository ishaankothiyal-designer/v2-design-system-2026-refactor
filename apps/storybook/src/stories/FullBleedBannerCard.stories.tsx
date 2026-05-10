import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  FullBleedBannerCard,
  type FullBleedBannerCardProps,
  type FullBleedBannerCardSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const FULL_BLEED_BANNER_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28366-7592&t=h5zc6W2b6MPFvMVS-11";

const FULL_BLEED_BANNER_CARD_SIZES: FullBleedBannerCardSize[] = ["XXS", "XS", "S", "M", "L", "XL"];

function DemoMedia({ accent = "rgba(255, 255, 255, 0.4)" }: { accent?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${accent} 0%, rgba(255, 255, 255, 0) 18%), linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 42%)`,
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function PlaygroundStory({
  brand = "Cars24",
  playLabel = "Play video",
  size = "M",
  video = true
}: FullBleedBannerCardProps) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Full Bleed Banner Card Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Minimal full-bleed banner shell with the exact six Figma heights and an optional centered
            video affordance built from the approved `IconButton` variant.
          </StoryCopy>
        </div>

        <FullBleedBannerCard brand={displayBrand} playLabel={playLabel} size={size} video={video}>
          <DemoMedia />
        </FullBleedBannerCard>
      </StoryCard>
    </StoryPage>
  );
}

function SizeGallery({ brand = "Cars24", video = true }: Pick<FullBleedBannerCardProps, "brand" | "video">) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Full Bleed Banner Card Sizes
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visual review for all six size variants from the Figma component set, keeping the slot
            full bleed and the play overlay centered only when `video` is enabled.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {FULL_BLEED_BANNER_CARD_SIZES.map((size) => (
            <div key={size} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {size}
              </StoryCopy>
              <FullBleedBannerCard brand={displayBrand} size={size} video={video}>
                <DemoMedia accent={size === "XXS" || size === "XS" ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.32)"} />
              </FullBleedBannerCard>
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const galleryStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 24
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const defaultSourceCode = `<FullBleedBannerCard
  brand="Cars24"
  size="M"
  video
/>\n`;

const meta = {
  title: "Components/Cards/Full Bleed Banner Card",
  component: FullBleedBannerCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(FULL_BLEED_BANNER_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    size: "M",
    video: true,
    playLabel: "Play video"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: FULL_BLEED_BANNER_CARD_SIZES
    },
    video: {
      control: "boolean"
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
} satisfies Meta<typeof FullBleedBannerCard>;

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
  render: ({ brand = "Cars24", video = true }) => <SizeGallery brand={brand} video={video} />,
  parameters: {
    controls: {
      include: ["brand", "video"]
    }
  }
};
