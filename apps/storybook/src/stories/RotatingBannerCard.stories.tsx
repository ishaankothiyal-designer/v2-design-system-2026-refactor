import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  RotatingBannerCard,
  type RotatingBannerCardItem,
  type RotatingBannerCardProps,
  type RotatingBannerCardSlideMode,
  type RotatingBannerCardSize
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const ROTATING_BANNER_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28366-7613&t=h5zc6W2b6MPFvMVS-11";

const ROTATING_BANNER_CARD_SIZES: RotatingBannerCardSize[] = ["Small", "Medium", "Large"];
const ROTATING_BANNER_CARD_SLIDE_MODES: RotatingBannerCardSlideMode[] = ["Auto", "Manual"];

const DEMO_ITEMS: RotatingBannerCardItem[] = [
  {
    title: "Weekend steals",
    description: "Fresh drops every hour",
    media: <DemoBanner accent="#D946EF" background="linear-gradient(135deg, #FFE8F7 0%, #FFD5F3 100%)" />
  },
  {
    title: "Daily spotlight",
    description: "Trending across markets",
    media: <DemoBanner accent="#2563EB" background="linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)" />
  },
  {
    title: "Verified picks",
    description: "Expert-approved banners",
    media: <DemoBanner accent="#0F766E" background="linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)" />
  },
  {
    title: "Just launched",
    description: "Handpicked for today",
    media: <DemoBanner accent="#EA580C" background="linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)" />
  },
  {
    title: "Editor's choice",
    description: "High-intent inventory",
    media: <DemoBanner accent="#7C3AED" background="linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)" />
  }
];

function DemoBanner({
  accent,
  background
}: {
  accent: string;
  background: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        background,
        height: "100%",
        overflow: "hidden",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        style={{
          background: `radial-gradient(circle at 24% 24%, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0) 24%)`,
          inset: 0,
          position: "absolute"
        }}
      />
      <div
        style={{
          background: accent,
          borderRadius: 999,
          bottom: "14%",
          height: "24%",
          left: "12%",
          opacity: 0.9,
          position: "absolute",
          width: "28%"
        }}
      />
      <div
        style={{
          border: `2px solid ${accent}`,
          borderRadius: 999,
          height: "40%",
          opacity: 0.18,
          position: "absolute",
          right: "-8%",
          top: "-10%",
          width: "40%"
        }}
      />
      <div
        style={{
          background: "rgba(255, 255, 255, 0.68)",
          borderRadius: 999,
          height: "8%",
          left: "12%",
          position: "absolute",
          top: "18%",
          width: "34%"
        }}
      />
      <div
        style={{
          background: "rgba(255, 255, 255, 0.52)",
          borderRadius: 999,
          height: "8%",
          left: "12%",
          position: "absolute",
          top: "32%",
          width: "22%"
        }}
      />
    </div>
  );
}

function PlaygroundStory(args: RotatingBannerCardProps) {
  const displayBrand = args.brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Rotating Banner Card Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Center-focused rotating banner with clipped side peeks, scale-based slide transitions, and
            a continuous loop that follows the motion direction from the linked animation reference.
          </StoryCopy>
        </div>

        <RotatingBannerCard {...args} items={DEMO_ITEMS} />
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
            Rotating Banner Card Sizes
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visual review of all three visible Figma size variants using the same looping banner set.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {ROTATING_BANNER_CARD_SIZES.map((size) => (
            <div key={size} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {size}
              </StoryCopy>
              <RotatingBannerCard brand={displayBrand} items={DEMO_ITEMS} size={size} />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function SlideModeGallery({ brand = "Cars24", size = "Small" }: { brand?: DisplayBrandId; size?: RotatingBannerCardSize }) {
  const displayBrand = brand ?? "Cars24";
  const activeSize = size ?? "Small";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Rotating Banner Card States
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Manual and auto slide options for the same banner set. Auto keeps the continuous loop,
            while manual switches to a thumb-scrollable snap track for direct user movement.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {ROTATING_BANNER_CARD_SLIDE_MODES.map((mode) => (
            <div key={mode} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {mode} Slide
              </StoryCopy>
              <RotatingBannerCard
                autoPlay={mode === "Auto"}
                brand={displayBrand}
                items={DEMO_ITEMS}
                intervalMs={2400}
                size={activeSize}
                slideMode={mode}
              />
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
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(336px, max-content))"
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const defaultSourceCode = `<RotatingBannerCard
  brand="Cars24"
  size="Small"
  slideMode="Auto"
  autoPlay
  showCopy
  items={[
    { title: "Weekend steals", description: "Fresh drops every hour" },
    { title: "Daily spotlight", description: "Trending across markets" },
    { title: "Verified picks", description: "Expert-approved banners" }
  ]}
/>`;

const meta: Meta<RotatingBannerCardProps> = {
  title: "Components/Cards/Rotating Banner Card",
  component: RotatingBannerCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(ROTATING_BANNER_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    size: "Small",
    slideMode: "Auto",
    autoPlay: true,
    intervalMs: 2400,
    pauseOnHover: true,
    showCopy: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: ROTATING_BANNER_CARD_SIZES
    },
    slideMode: {
      control: "inline-radio",
      options: ROTATING_BANNER_CARD_SLIDE_MODES
    },
    autoPlay: {
      control: "boolean"
    },
    intervalMs: {
      control: {
        min: 1200,
        max: 5000,
        step: 100,
        type: "range"
      }
    },
    pauseOnHover: {
      control: "boolean"
    },
    showCopy: {
      control: "boolean"
    },
    items: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<RotatingBannerCardProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: defaultSourceCode
      }
    }
  }
};

export const Sizes: Story = {
  render: ({ brand }) => <SizeGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const States: Story = {
  render: ({ brand, size }) => <SlideModeGallery brand={brand ?? "Cars24"} size={size ?? "Small"} />,
  parameters: {
    controls: {
      include: ["brand", "size"]
    }
  }
};
