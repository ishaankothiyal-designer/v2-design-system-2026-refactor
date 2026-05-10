import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { ShowroomCard, type ShowroomCardProps, type ShowroomCardSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const SHOWROOM_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28615-5689&t=h5zc6W2b6MPFvMVS-11";

const SHOWROOM_CARD_SIZES: ShowroomCardSize[] = ["Small", "Large"];

function DemoMedia() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: [
          "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 38%)",
          "radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 18%)",
          "linear-gradient(135deg, #d7e8ff 0%, #fef1d8 52%, #ffd9ec 100%)"
        ].join(", "),
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function PlaygroundStory(args: ShowroomCardProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={args.brand ?? "Cars24"} size="xl">
            Showroom Card Playground
          </StoryHeading>
          <StoryCopy brand={args.brand ?? "Cars24"} size="md">
            Media-first showroom discovery card with the inventory ribbon, review lockup, directions
            CTA, opening-hours row, and paired actions from the Figma component.
          </StoryCopy>
        </div>

        <ShowroomCard {...args}>
          <DemoMedia />
        </ShowroomCard>
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
            Showroom Card Sizes
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Side-by-side coverage of the approved `Small` and `Large` showroom-card variants.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {SHOWROOM_CARD_SIZES.map((size) => (
            <div key={size} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {size}
              </StoryCopy>
              <ShowroomCard brand={displayBrand} size={size}>
                <DemoMedia />
              </ShowroomCard>
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

const defaultSourceCode = `<ShowroomCard
  brand="Cars24"
  size="Small"
  title="Piyush Mahendra Mall"
  inventoryLabel="135+ Cars"
  rating={4.4}
  reviewCount="(281)"
  address="Sector 56, Gurgaon"
  directionsLabel="4.5 km away from Canna..."
  directionsLinkLabel="Get Directions"
  statusLabel="Open"
  statusText="Closes at 8 PM"
  secondaryActionLabel="Label"
  primaryActionLabel="Label"
/>\n`;

const meta = {
  title: "Components/Cards/Showroom Card",
  component: ShowroomCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SHOWROOM_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    size: "Small",
    title: "Piyush Mahendra Mall",
    inventoryLabel: "135+ Cars",
    rating: 4.4,
    reviewCount: "(281)",
    address: "Sector 56, Gurgaon",
    directionsLabel: "4.5 km away from Canna...",
    directionsLinkLabel: "Get Directions",
    statusLabel: "Open",
    statusText: "Closes at 8 PM",
    secondaryActionLabel: "Label",
    primaryActionLabel: "Label",
    showDirectionsLink: true,
    showSecondaryAction: true,
    showPrimaryAction: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: SHOWROOM_CARD_SIZES
    },
    title: {
      control: "text"
    },
    inventoryLabel: {
      control: "text"
    },
    rating: {
      control: "number"
    },
    reviewCount: {
      control: "text"
    },
    address: {
      control: "text"
    },
    directionsLabel: {
      control: "text"
    },
    directionsLinkLabel: {
      control: "text"
    },
    statusLabel: {
      control: "text"
    },
    statusText: {
      control: "text"
    },
    secondaryActionLabel: {
      control: "text"
    },
    primaryActionLabel: {
      control: "text"
    },
    showDirectionsLink: {
      control: "boolean"
    },
    showSecondaryAction: {
      control: "boolean"
    },
    showPrimaryAction: {
      control: "boolean"
    },
    children: {
      control: false
    },
    onDirectionsClick: {
      control: false
    },
    onSecondaryActionClick: {
      control: false
    },
    onPrimaryActionClick: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
} satisfies Meta<typeof ShowroomCard>;

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

export const Sizes: Story = {
  render: ({ brand = "Cars24" }) => <SizeGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
