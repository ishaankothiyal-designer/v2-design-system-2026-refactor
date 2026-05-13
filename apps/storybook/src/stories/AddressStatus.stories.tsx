import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  AddressStatus,
  Text,
  type AddressStatusProps,
  type AddressStatusType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const ADDRESS_STATUS_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=29146-1679&t=hFO1h296qgJvQhe9-11";

const addressStatusTypes: AddressStatusType[] = ["ANS", "Default"];

const optionGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

function StoryLabel({
  brand,
  children
}: {
  brand: DisplayBrandId;
  children: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {children}
    </Text>
  );
}

function PlaygroundStory(args: AddressStatusProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <AddressStatus {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function VariantsStory({ brand = "Cars24" }: Pick<AddressStatusProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        {addressStatusTypes.map((type) => (
          <StoryCard key={type} style={{ display: "grid", gap: 12, width: "fit-content" }}>
            <StoryLabel brand={activeBrand}>{type}</StoryLabel>
            <AddressStatus brand={activeBrand} type={type} />
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

const addressStatusSourceCode = `import { AddressStatus } from "@geist/web";

<AddressStatus brand="Cars24" type="Default" />;`;

const meta = {
  title: "Components/Address Status",
  component: AddressStatus,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(ADDRESS_STATUS_FIGMA_URL),
    docs: {
      description: {
        component:
          "Compact Locator status strip with Default and ANS availability variants from the linked Figma component."
      },
      source: {
        code: addressStatusSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    showIcon: true,
    type: "Default"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "select",
      options: addressStatusTypes
    },
    message: {
      control: "text"
    },
    showIcon: {
      control: "boolean"
    },
    icon: {
      control: false
    }
  },
  render: PlaygroundStory
} satisfies Meta<AddressStatusProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: ({ brand }) => <VariantsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
