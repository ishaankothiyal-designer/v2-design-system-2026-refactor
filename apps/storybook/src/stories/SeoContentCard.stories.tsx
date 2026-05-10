import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { SeoContentCard, type SeoContentCardProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const SEO_CONTENT_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28615-5813&t=h5zc6W2b6MPFvMVS-11";

const DEMO_TITLE = "A two line title car easily fit in the container. 15px";
const DEMO_DESCRIPTION =
  "Body text covering every aspect of the thing that is covered and conveyed to the user. Body text covering every aspect of the thing that is covered and conveyed to the user.";

function DemoMedia() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: [
          "radial-gradient(circle at 20% 22%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0) 18%)",
          "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 40%)",
          "linear-gradient(135deg, #dbeafe 0%, #fde68a 52%, #fbcfe8 100%)"
        ].join(", "),
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function renderCard(args: SeoContentCardProps, showCustomMedia = true) {
  return showCustomMedia ? (
    <SeoContentCard {...args}>
      <DemoMedia />
    </SeoContentCard>
  ) : (
    <SeoContentCard {...args} />
  );
}

function PlaygroundStory({
  brand = "Cars24",
  description = DEMO_DESCRIPTION,
  title = DEMO_TITLE
}: SeoContentCardProps) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            SEO Content Card Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Media-first SEO content card with the fixed showcase slot and the exact two-line title plus
            four-line body treatment from the linked Figma component.
          </StoryCopy>
        </div>

        {renderCard({ brand: displayBrand, description, title })}
      </StoryCard>
    </StoryPage>
  );
}

function UsageGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            SEO Content Card Usage
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visual review of the approved card with both the built-in placeholder slot and a custom
            media fill.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          <div style={variantCellStyles}>
            <StoryCopy brand={displayBrand} size="sm">
              Placeholder Slot
            </StoryCopy>
            {renderCard({ brand: displayBrand, description: DEMO_DESCRIPTION, title: DEMO_TITLE }, false)}
          </div>

          <div style={variantCellStyles}>
            <StoryCopy brand={displayBrand} size="sm">
              Custom Media
            </StoryCopy>
            {renderCard({ brand: displayBrand, description: DEMO_DESCRIPTION, title: DEMO_TITLE })}
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

const defaultSourceCode = `<SeoContentCard
  brand="Cars24"
  title="${DEMO_TITLE}"
  description="${DEMO_DESCRIPTION}"
/>\n`;

const meta = {
  title: "Components/SEO Content Card",
  component: SeoContentCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SEO_CONTENT_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    title: DEMO_TITLE,
    description: DEMO_DESCRIPTION
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    children: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
} satisfies Meta<typeof SeoContentCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: defaultSourceCode
      }
    }
  }
};

export const Usage: Story = {
  render: ({ brand }) => <UsageGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
