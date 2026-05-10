import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { AddressCard, Icon, Text, type AddressCardProps, type AddressCardType } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

const ADDRESS_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28770-12034&t=h5zc6W2b6MPFvMVS-11";

const ADDRESS_CARD_TYPES: AddressCardType[] = [
  "Address + chevron (Card)",
  "Address + chevron (Full bleed)"
];

function PreviewFrame({
  children,
  type
}: {
  children: ReactNode;
  type: AddressCardType;
}) {
  return (
    <div style={{ width: type === "Address + chevron (Full bleed)" ? 360 : 336 }}>
      {children}
    </div>
  );
}

function HeaderCell({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  return (
    <Text as="strong" brand={brand} size="sm" tone="secondary">
      {label}
    </Text>
  );
}

function PlaygroundStory(args: AddressCardProps) {
  return (
    <StoryPage>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <PreviewFrame type={args.type ?? "Address + chevron (Card)"}>
          <AddressCard {...args} />
        </PreviewFrame>
      </StoryCard>
    </StoryPage>
  );
}

function VariantMatrix({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="220px repeat(2, minmax(360px, 1fr))">
          <StoryMatrixCornerCell />
          <StoryMatrixHeaderCell>
            <HeaderCell brand={activeBrand} label="Distance shown" />
          </StoryMatrixHeaderCell>
          <StoryMatrixHeaderCell>
            <HeaderCell brand={activeBrand} label="Distance hidden" />
          </StoryMatrixHeaderCell>

          {ADDRESS_CARD_TYPES.flatMap((type) => [
            <StoryMatrixRowLabelCell key={`${type}-label`} minHeight={168}>
              <HeaderCell brand={activeBrand} label={type} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`${type}-distance-on`} minHeight={168}>
              <PreviewFrame type={type}>
                <AddressCard brand={activeBrand} type={type} />
              </PreviewFrame>
            </StoryMatrixValueCell>,
            <StoryMatrixValueCell key={`${type}-distance-off`} minHeight={168}>
              <PreviewFrame type={type}>
                <AddressCard brand={activeBrand} showDistance={false} type={type} />
              </PreviewFrame>
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

const addressCardSourceCode = `<AddressCard
  brand="Cars24"
  type="Address + chevron (Card)"
  header="Address header"
  description="Full address here"
  distanceLabel="4.4 km"
  showDistance
/>\n`;

const meta: Meta<AddressCardProps> = {
  title: "Components/Cards/Address Card",
  component: AddressCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(ADDRESS_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    type: "Address + chevron (Card)",
    header: "Address header",
    description: "Full address here",
    distanceLabel: "4.4 km",
    showDistance: true,
    showChevron: true,
    iconName: "location-outline"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: ADDRESS_CARD_TYPES
    },
    header: {
      control: "text"
    },
    description: {
      control: "text"
    },
    distanceLabel: {
      control: "text"
    },
    showDistance: {
      control: "boolean"
    },
    showChevron: {
      control: "boolean"
    },
    iconName: {
      control: false
    },
    icon: {
      control: false
    },
    trailingIcon: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<AddressCardProps>;

export const Playground: Story = {
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: addressCardSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantMatrix brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const CustomIcon: Story = {
  args: {
    icon: <Icon name="location-filled" decorative />,
    type: "Address + chevron (Full bleed)"
  },
  parameters: {
    layout: "centered"
  }
};
