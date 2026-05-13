import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  SoldCarCarousel,
  type SoldCarCarouselItem,
  type SoldCarCarouselProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const SOLD_CAR_CAROUSEL_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28633-3026&t=vUpeNbWJ84H8ABzi-11";

const SOLD_CAR_ITEMS: SoldCarCarouselItem[] = [
  {
    id: "creta",
    buyerName: "Aparna Krishnamurthy",
    carModel: "2021 Hyundai Creta SX Diesel Automatic",
    initials: "AK",
    location: "Bengaluru",
    price: "₹12.84L",
    soldAgoLabel: "12d ago"
  },
  {
    id: "baleno",
    buyerName: "Vikram",
    carModel: "2018 Maruti Suzuki Baleno Delta",
    initials: "VK",
    location: "Gurgaon",
    price: "₹5.12L",
    soldAgoLabel: "Today"
  },
  {
    id: "city",
    buyerName: "Meera Nair",
    carModel: "2020 Honda City VX CVT",
    initials: "MN",
    location: "Pune",
    price: "₹9.38L",
    soldAgoLabel: "3d ago"
  },
  {
    id: "i20",
    buyerName: "Rahul S",
    carModel: "2019 Hyundai i20 Asta",
    initials: "RS",
    location: "Noida",
    price: "₹6.45L",
    soldAgoLabel: "7d ago"
  }
];

const soldCarCarouselSourceCode = `<SoldCarCarousel
  brand="Cars24"
  header
  bottomCta
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showSubtitle
  showDescription
  showTag
  showHeaderAction
  headerActionLabel="View all"
/>`;

function PlaygroundStory(args: SoldCarCarouselProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={phoneFrameStyles}>
          <SoldCarCarousel {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ScrollShowcase({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 6, maxWidth: 720 }}>
          <StoryHeading brand={activeBrand} size="lg">
            Sold Car Carousel
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="sm">
            Four sold cards inside the 360px widget frame to verify horizontal scrolling and card truncation.
          </StoryCopy>
        </div>

        <div style={phoneFrameStyles}>
          <SoldCarCarousel brand={activeBrand} cards={SOLD_CAR_ITEMS} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function MinimalWidget({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={phoneFrameStyles}>
          <SoldCarCarousel
            bottomCta={false}
            brand={activeBrand}
            cards={SOLD_CAR_ITEMS.slice(0, 2)}
            header={false}
          />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const phoneFrameStyles: CSSProperties = {
  width: 360
};

const meta: Meta<SoldCarCarouselProps> = {
  title: "Widgets/Sold Car Carousel",
  component: SoldCarCarousel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SOLD_CAR_CAROUSEL_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    header: true,
    bottomCta: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showSubtitle: true,
    showDescription: true,
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    background: {
      control: "color"
    },
    header: {
      control: "boolean",
      name: "Header"
    },
    bottomCta: {
      control: "boolean",
      name: "Bottom CTA"
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    description: {
      control: "text"
    },
    tagLabel: {
      control: "text"
    },
    showHeader: {
      control: false,
      table: { disable: true }
    },
    showSubtitle: {
      control: "boolean"
    },
    showDescription: {
      control: "boolean"
    },
    showTag: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    cards: {
      control: false
    },
    children: {
      control: false
    },
    primaryAction: {
      control: false
    },
    onHeaderActionClick: {
      action: "header action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<SoldCarCarouselProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: soldCarCarouselSourceCode
      }
    }
  }
};

export const HorizontalScroll: Story = {
  render: ({ brand }) => <ScrollShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const HeaderAndCtaHidden: Story = {
  render: ({ brand }) => <MinimalWidget brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
