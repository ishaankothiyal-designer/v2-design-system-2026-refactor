import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Testimonial, type TestimonialItem, type TestimonialProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const TESTIMONIAL_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28633-3026&t=vUpeNbWJ84H8ABzi-11";

const avatarImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;

const TESTIMONIAL_ITEMS: TestimonialItem[] = [
  {
    id: "priya",
    avatarImageSrc,
    customerName: "Priya Menon",
    dateLabel: "08 Aug, 2025",
    description:
      "Helpful staff, transparent details, and a smooth report flow made the buying process much easier.",
    detailLabel: "Bought vehicle history report",
    initials: "PM",
    rating: 4.5,
    size: "Small"
  },
  {
    id: "ramesh",
    avatarImageSrc,
    customerName: "Ramesh Agrawal",
    dateLabel: "10 Aug, 2025",
    description:
      "Buying was quick, transparent, and stress-free. Would recommend to all my friends.",
    detailLabel: "Bought vehicle history report",
    initials: "RA",
    rating: 4.5,
    size: "Large"
  },
  {
    id: "prashant",
    avatarImageSrc,
    customerName: "Prashant Kumar",
    dateLabel: "14 Aug, 2025",
    description:
      "Super easy and fast experience. Helpful staff and smooth paperwork made it convenient.",
    detailLabel: "Bought vehicle history report",
    initials: "PK",
    rating: 4.5,
    size: "Small"
  },
  {
    id: "ram",
    avatarImageSrc,
    customerName: "Ram Verma",
    dateLabel: "24 Aug, 2025",
    description:
      "Very well coordinated. Made the whole process simple, quick, and easy to understand.",
    detailLabel: "Bought vehicle history report",
    initials: "RV",
    rating: 5,
    size: "Small"
  },
  {
    id: "pushkar",
    avatarImageSrc,
    customerName: "Mr. Pushkar Mehta",
    dateLabel: "12 Aug, 2025",
    description:
      "The car appeared to be in pristine condition, almost as if it had just rolled off the showroom floor. However, the report revealed that it had been involved in two accidents.",
    detailLabel: "Bought vehicle history report",
    initials: "PM",
    rating: 4.5,
    size: "Small"
  },
  {
    id: "meera",
    avatarImageSrc,
    customerName: "Meera Iyer",
    dateLabel: "16 Sep, 2025",
    description:
      "The accident and ownership history was easy to understand, and it helped me negotiate with much more confidence.",
    detailLabel: "Bought vehicle history report",
    initials: "MI",
    rating: 5,
    size: "Small"
  }
];

const testimonialSourceCode = `<Testimonial
  brand="Cars24"
  header
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showSubtitle
  showDescription
  showTag
  showHeaderAction
  headerActionLabel="View all"
  inverse={false}
  bottomCta
  interactive
  activeCardIndex={1}
  showCardTitle={false}
/>`;

function PlaygroundStory(args: TestimonialProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={phoneFrameStyles}>
          <Testimonial {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ScrollShowcase({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 20, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 6, maxWidth: 720 }}>
          <StoryHeading brand={activeBrand} size="lg">
            Testimonial
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="sm">
            Drag horizontally, use arrow keys, or select a side card to loop through all six testimonials.
          </StoryCopy>
        </div>
        <div style={phoneFrameStyles}>
          <Testimonial activeCardIndex={1} brand={activeBrand} cards={TESTIMONIAL_ITEMS} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function HeaderHiddenStory({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 20, justifyItems: "start" }}>
        <div style={phoneFrameStyles}>
          <Testimonial activeCardIndex={1} brand={activeBrand} cards={TESTIMONIAL_ITEMS.slice(0, 3)} header={false} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const phoneFrameStyles: CSSProperties = {
  width: 360
};

const meta: Meta<TestimonialProps> = {
  title: "Widgets/Testimonial",
  component: Testimonial,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TESTIMONIAL_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    activeCardIndex: 1,
    bottomCta: true,
    cards: TESTIMONIAL_ITEMS,
    description: "Description goes here upto 2 lines",
    header: true,
    headerActionLabel: "View all",
    interactive: true,
    inverse: false,
    showCardTitle: false,
    showDescription: true,
    showHeaderAction: true,
    showSubtitle: true,
    showTag: true,
    subtitle: "Section title line 2",
    tagLabel: "New",
    title: "Section title"
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
    inverse: {
      control: "boolean",
      name: "Inverse"
    },
    interactive: {
      control: "boolean"
    },
    activeCardIndex: {
      control: { type: "range", min: 0, max: TESTIMONIAL_ITEMS.length - 1, step: 1 }
    },
    bottomCta: {
      control: "boolean",
      name: "Bottom CTA"
    },
    showCardTitle: {
      control: "boolean",
      name: "Card title"
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
    showDescription: {
      control: "boolean"
    },
    showHeader: {
      control: false,
      table: { disable: true }
    },
    showHeaderAction: {
      control: "boolean"
    },
    showSubtitle: {
      control: "boolean"
    },
    showTag: {
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
    onActiveCardIndexChange: {
      action: "active card index change"
    },
    onHeaderActionClick: {
      action: "header action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<TestimonialProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: testimonialSourceCode
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

export const HeaderHidden: Story = {
  render: ({ brand }) => <HeaderHiddenStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
