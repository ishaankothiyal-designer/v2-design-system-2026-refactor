import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { TestimonialCard, type TestimonialCardProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const TESTIMONIAL_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28103-4468&t=vUpeNbWJ84H8ABzi-11";

const avatarImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;

const testimonialDescription =
  "The car appeared to be in pristine condition, almost as if it had just rolled off the showroom floor. However, the report revealed that it had been involved in two accidents.";

const testimonialCardSourceCode = `<TestimonialCard
  brand="Cars24"
  size="Large"
  customerName="Mr. Pushkar Mehta"
  detailLabel="Bought vehicle history report"
  dateLabel="12 Aug, 2025"
  description="${testimonialDescription}"
  rating={4.5}
  showRating
  showSource
/>`;

function PlaygroundStory(args: TestimonialCardProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={previewSurfaceStyles}>
        <TestimonialCard {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function VariantMatrix({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 20, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 6, maxWidth: 680 }}>
          <StoryHeading brand={activeBrand} size="lg">
            Testimonial Card
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="sm">
            Large testimonial cards across title on/off variants, matching the Figma component matrix.
          </StoryCopy>
        </div>
        <div style={matrixSurfaceStyles}>
          <TestimonialCard avatarImageSrc={avatarImageSrc} brand={activeBrand} description={testimonialDescription} />
          <TestimonialCard
            avatarImageSrc={avatarImageSrc}
            brand={activeBrand}
            description={testimonialDescription}
            showTitle
          />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const previewSurfaceStyles: CSSProperties = {
  background: "#CFCFD4",
  boxSizing: "border-box",
  display: "grid",
  gap: 16,
  justifyItems: "start",
  padding: 20,
  width: "fit-content"
};

const matrixSurfaceStyles: CSSProperties = {
  ...previewSurfaceStyles,
  alignItems: "start",
  gridTemplateColumns: "max-content"
};

const meta: Meta<TestimonialCardProps> = {
  title: "Components/Testimonial Card",
  component: TestimonialCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TESTIMONIAL_CARD_FIGMA_URL)
  },
  args: {
    avatarImageSrc,
    brand: "Cars24",
    customerName: "Mr. Pushkar Mehta",
    dateLabel: "12 Aug, 2025",
    description: testimonialDescription,
    detailLabel: "Bought vehicle history report",
    initials: "PM",
    rating: 4.5,
    showRating: true,
    showSource: true,
    showTitle: false,
    size: "Large",
    sourceLabel: "via Product Review",
    title: "Title T1 one liner"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: false,
      table: { disable: true }
    },
    showTitle: {
      control: "boolean"
    },
    showRating: {
      control: "boolean"
    },
    showSource: {
      control: "boolean"
    },
    rating: {
      control: { type: "range", min: 0, max: 5, step: 0.5 }
    },
    avatar: {
      control: false
    },
    avatarImageAlt: {
      control: false
    },
    avatarImageSrc: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<TestimonialCardProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: testimonialCardSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand }) => <VariantMatrix brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
