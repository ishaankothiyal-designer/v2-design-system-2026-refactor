import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  OwnershipBadge,
  type OwnershipBadgeProps,
  type OwnershipBadgeSeller
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const OWNERSHIP_BADGE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=18274-13295&t=1zgOyFpiLYMyM4XM-11";

const ownershipBadgeSellers: OwnershipBadgeSeller[] = [
  "Cars24 owned stock",
  "Prime",
  "Select",
  "Trusted partner dealer",
  "Lite",
  "Dealer Listing",
  "Verified direct owner",
  "Luxe",
  "Luxury",
  "Private Seller",
  "Dealer"
];

type OwnershipBadgeStoryArgs = OwnershipBadgeProps;

function PlaygroundStory(args: OwnershipBadgeStoryArgs) {
  return <OwnershipBadge {...args} />;
}

function VariantMatrixStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={matrixStyles}>
          {ownershipBadgeSellers.map((seller) => (
            <OwnershipBadge key={seller} brand={brand} seller={seller} />
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildVariantsSourceCode(brand: DisplayBrandId) {
  return `import { OwnershipBadge } from "@geist/web";

const sellers = [
  "Cars24 owned stock",
  "Prime",
  "Select",
  "Trusted partner dealer",
  "Lite",
  "Dealer Listing",
  "Verified direct owner",
  "Luxe",
  "Luxury",
  "Private Seller",
  "Dealer"
] as const;

export function OwnershipBadgeVariants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {sellers.map((seller) => (
        <OwnershipBadge key={seller} brand="${brand}" seller={seller} />
      ))}
    </div>
  );
}`;
}

const matrixStyles: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: 20
};

const meta: Meta<OwnershipBadgeStoryArgs> = {
  title: "Components/Badges/Ownership Badge",
  component: OwnershipBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(OWNERSHIP_BADGE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    seller: "Cars24 owned stock"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    seller: {
      control: "select",
      options: ownershipBadgeSellers
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<OwnershipBadgeStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: (args) => <VariantMatrixStory brand={args.brand ?? "Cars24"} />,
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildVariantsSourceCode("Cars24")
      }
    }
  }
};
