import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { SoldCarCard, type SoldCarCardProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const SOLD_CAR_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28590-15605&t=vUpeNbWJ84H8ABzi-11";

const soldCarCardSourceCode = `<SoldCarCard
  brand="Cars24"
  price="₹4.54L"
  carModel="Car model H5 - 13 SM"
  buyerName="Customer_name label3 - 12px 1 line"
  location="Location"
  soldAgoLabel="7d ago"
  initials="MT"
/>`;

function PlaygroundStory(args: SoldCarCardProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <SoldCarCard {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function ContentShowcase({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 6, maxWidth: 720 }}>
          <StoryHeading brand={activeBrand} size="lg">
            Sold Car Card
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="sm">
            Default card plus longer-content stress cases for truncation and fixed media sizing.
          </StoryCopy>
        </div>

        <div style={showcaseGridStyles}>
          <SoldCarCard brand={activeBrand} />
          <SoldCarCard
            brand={activeBrand}
            buyerName="Aparna Krishnamurthy"
            carModel="2021 Hyundai Creta SX Diesel Automatic"
            initials="AK"
            location="Bengaluru"
            price="₹12.84L"
            soldAgoLabel="12d ago"
          />
          <SoldCarCard
            brand={activeBrand}
            buyerName="Vikram"
            carModel="2018 Maruti Suzuki Baleno Delta"
            initials="VK"
            location="Gurgaon"
            price="₹5.12L"
            soldAgoLabel="Today"
          />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const showcaseGridStyles: CSSProperties = {
  alignItems: "start",
  display: "flex",
  flexWrap: "wrap",
  gap: 16
};

const meta: Meta<SoldCarCardProps> = {
  title: "Components/Sold Car Card",
  component: SoldCarCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SOLD_CAR_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    price: "₹4.54L",
    carModel: "Car model H5 - 13 SM",
    buyerName: "Customer_name label3 - 12px 1 line",
    location: "Location",
    soldAgoLabel: "7d ago",
    initials: "MT"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    price: {
      control: "text"
    },
    carModel: {
      control: "text"
    },
    buyerName: {
      control: "text"
    },
    location: {
      control: "text"
    },
    soldAgoLabel: {
      control: "text"
    },
    initials: {
      control: "text"
    },
    media: {
      control: false
    },
    avatar: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<SoldCarCardProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: soldCarCardSourceCode
      }
    }
  }
};

export const ContentStates: Story = {
  render: ({ brand }) => <ContentShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
