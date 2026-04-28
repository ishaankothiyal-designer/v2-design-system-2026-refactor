import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { StoryCircle, type StoryCircleProps, type StoryCircleSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const STORY_CIRCLE_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28319-2570&t=h5zc6W2b6MPFvMVS-11";

const storyCircleImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;
const STORY_CIRCLE_SIZES: StoryCircleSize[] = ["Large", "Small"];

function StoryCircleMedia({ title }: { title: string }) {
  return (
    <img
      alt={`${title} preview`}
      src={storyCircleImageSrc}
      style={{
        display: "block",
        height: "100%",
        objectFit: "cover",
        width: "100%"
      }}
    />
  );
}

function StoryCirclePreview(args: StoryCircleProps) {
  return (
    <StoryCircle {...args}>
      <StoryCircleMedia title={args.title ?? "Title"} />
    </StoryCircle>
  );
}

function SizeGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Story Circle
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visible Figma coverage for the approved `Large` and `Small` story-circle variants using
            the slotted media surface and centered title lockup.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {STORY_CIRCLE_SIZES.map((size) => (
            <div key={size} style={cellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {size}
              </StoryCopy>
              <StoryCircle brand={displayBrand} size={size} title="Title">
                <StoryCircleMedia title={`${size} Title`} />
              </StoryCircle>
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

const cellStyles: CSSProperties = {
  display: "grid",
  gap: 12,
  justifyItems: "center"
};

const meta = {
  title: "Components/Story Circle",
  component: StoryCircle,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(STORY_CIRCLE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    size: "Large",
    title: "Title"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    children: {
      control: false
    },
    size: {
      control: "inline-radio",
      options: STORY_CIRCLE_SIZES
    }
  }
} satisfies Meta<typeof StoryCircle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 640 }}>
          <StoryHeading brand={args.brand} size="xl">
            Story Circle Playground
          </StoryHeading>
          <StoryCopy brand={args.brand} size="md">
            Interactive preview of the canonical story-circle wrapper with slotted media content.
          </StoryCopy>
        </div>

        <StoryCirclePreview {...args} />
      </StoryCard>
    </StoryPage>
  )
};

export const Sizes: Story = {
  render: ({ brand = "Cars24" }) => <SizeGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
