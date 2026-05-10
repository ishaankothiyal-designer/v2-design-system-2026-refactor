import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { StorySlider, type StorySliderProps, type StorySliderSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const STORY_SLIDER_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28319-2543&t=h5zc6W2b6MPFvMVS-11";

const storySliderImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;
const STORY_SLIDER_SIZES: StorySliderSize[] = ["Large", "Small"];

function createStoryItems(count = 5) {
  return Array.from({ length: count }, (_, index) => ({
    imageAlt: `Story ${index + 1}`,
    imageSrc: storySliderImageSrc,
    title: "Title"
  }));
}

function SizeGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Story Slider
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visible Figma coverage for the horizontally scrollable story rail in both approved sizes,
            built from repeated `StoryCircle` items inside a fixed `336px` viewport.
          </StoryCopy>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          {STORY_SLIDER_SIZES.map((size) => (
            <div key={size} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {size}
              </StoryCopy>
              <StorySlider brand={displayBrand} items={createStoryItems()} size={size} />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function PlaygroundStory({
  brand = "Cars24",
  scrollable = true,
  size = "Large"
}: StorySliderProps) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Story Slider Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Interactive horizontal rail that reuses the canonical `StoryCircle` component and keeps the
            Figma viewport width, item gaps, and clipped overflow behavior.
          </StoryCopy>
        </div>

        <StorySlider
          brand={displayBrand}
          items={createStoryItems()}
          scrollable={scrollable}
          size={size}
        />
      </StoryCard>
    </StoryPage>
  );
}

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const meta = {
  title: "Components/Story Slider",
  component: StorySlider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(STORY_SLIDER_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    scrollable: true,
    size: "Large"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    items: {
      control: false
    },
    scrollable: {
      control: {
        type: "boolean"
      }
    },
    size: {
      control: "inline-radio",
      options: STORY_SLIDER_SIZES
    },
    className: {
      control: false
    },
    style: {
      control: false
    },
    viewportPadding: {
      control: false
    }
  }
} satisfies Meta<typeof StorySlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />
};

export const Sizes: Story = {
  render: ({ brand = "Cars24" }) => <SizeGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
