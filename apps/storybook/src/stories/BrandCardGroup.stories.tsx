import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  BrandCardGroup,
  type BrandCardGroupItem,
  type BrandCardGroupProps
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const BRAND_CARD_GROUP_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28551-3401&t=hFO1h296qgJvQhe9-11";

const SCROLL_ROWS: BrandCardGroupItem[][] = [
  [
    { id: "maruti", label: "Maruti Suzuki", state: "Pressed" },
    { id: "hyundai", label: "Hyundai" },
    { id: "tata", label: "Tata Motors" },
    { id: "mahindra", label: "Mahindra" },
    { id: "kia", label: "Kia" },
    { id: "toyota", label: "Toyota" }
  ],
  [
    { id: "honda", label: "Honda" },
    { id: "renault", label: "Renault" },
    { id: "skoda", label: "Skoda" },
    { id: "volkswagen", label: "Volkswagen" },
    { id: "mg", label: "MG Motor" },
    { id: "nissan", label: "Nissan" }
  ]
];

function PlaygroundStory(args: BrandCardGroupProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={phoneFrameStyles}>
          <BrandCardGroup {...args} />
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
            Brand Card Group
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="sm">
            Two rows of brand cards inside the 360px widget frame to verify horizontal scrolling and pressed state.
          </StoryCopy>
        </div>

        <div style={phoneFrameStyles}>
          <BrandCardGroup brand={activeBrand} rows={SCROLL_ROWS} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function CompactWidget({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={phoneFrameStyles}>
          <BrandCardGroup
            bottomCta={false}
            brand={activeBrand}
            heading={false}
            rows={SCROLL_ROWS}
            searchFieldVisibility={false}
            showRow2={false}
          />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const phoneFrameStyles: CSSProperties = {
  width: 360
};

const brandCardGroupSourceCode = `<BrandCardGroup
  brand="Cars24"
  bottomCta
  heading
  searchFieldVisibility
  showRow2
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
/>`;

const meta: Meta<BrandCardGroupProps> = {
  title: "Widgets/Brand Card Group",
  component: BrandCardGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BRAND_CARD_GROUP_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    bottomCta: true,
    heading: true,
    searchFieldVisibility: true,
    showRow2: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    searchPlaceholder: "Search"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    bottomCta: {
      control: "boolean",
      name: "Bottom CTA"
    },
    heading: {
      control: "boolean",
      name: "Heading"
    },
    searchFieldVisibility: {
      control: "boolean",
      name: "Search field visibility"
    },
    showRow2: {
      control: "boolean",
      name: "Show row 2"
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
    showTag: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    searchPlaceholder: {
      control: "text"
    },
    rows: {
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

type Story = StoryObj<BrandCardGroupProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: brandCardGroupSourceCode
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

export const CardsOnly: Story = {
  render: ({ brand }) => <CompactWidget brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
