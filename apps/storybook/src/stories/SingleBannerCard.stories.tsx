import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { SingleBannerCard, type SingleBannerCardProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const SINGLE_BANNER_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28366-7611&t=h5zc6W2b6MPFvMVS-11";

function DemoMedia({ accent = "rgba(255, 255, 255, 0.38)" }: { accent?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle at 50% 34%, ${accent} 0%, rgba(255, 255, 255, 0) 20%), linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 42%)`,
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function PlaygroundStory({
  brand = "Cars24",
  playLabel = "Play video",
  video = true
}: SingleBannerCardProps) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Single Banner Card Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Fixed-width banner card with the approved centered play affordance and the exact `336 x
            168` geometry from the linked Figma component.
          </StoryCopy>
        </div>

        <SingleBannerCard brand={displayBrand} playLabel={playLabel} video={video}>
          <DemoMedia />
        </SingleBannerCard>
      </StoryCard>
    </StoryPage>
  );
}

function StatesGallery({ brand = "Cars24" }: Pick<SingleBannerCardProps, "brand">) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Single Banner Card States
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visual review for the two supported states from the Figma node: plain banner media and
            banner media with the centered video control.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          <div style={variantCellStyles}>
            <StoryCopy brand={displayBrand} size="sm">
              `video=false`
            </StoryCopy>
            <SingleBannerCard brand={displayBrand} video={false}>
              <DemoMedia accent="rgba(255, 255, 255, 0.42)" />
            </SingleBannerCard>
          </div>

          <div style={variantCellStyles}>
            <StoryCopy brand={displayBrand} size="sm">
              `video=true`
            </StoryCopy>
            <SingleBannerCard brand={displayBrand} video>
              <DemoMedia />
            </SingleBannerCard>
          </div>
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

const defaultSourceCode = `<SingleBannerCard
  brand="Cars24"
  video
/>\n`;

const meta = {
  title: "Components/Cards/Single Banner Card",
  component: SingleBannerCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SINGLE_BANNER_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    video: true,
    playLabel: "Play video"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
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
} satisfies Meta<typeof SingleBannerCard>;

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

export const States: Story = {
  render: ({ brand = "Cars24" }) => <StatesGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
