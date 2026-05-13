import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Icon, InvoiceBill, InvoiceItem, Text, type InvoiceBillProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type InvoiceBillStoryArgs = InvoiceBillProps;

const INVOICE_BILL_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=29187-9870&t=MixdbWFumXa9kfBn-11";

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

function makePrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  };
}

function PlaygroundStory({
  brand = "Cars24",
  primaryAction: _primaryAction,
  ...args
}: InvoiceBillStoryArgs) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <InvoiceBill {...args} brand={activeBrand} primaryAction={makePrimaryAction(activeBrand)} />
      </StoryCard>
    </StoryPage>
  );
}

function WidgetOptionsStory({ brand = "Cars24" }: Pick<InvoiceBillStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Default widget</StoryLabel>
          <InvoiceBill brand={activeBrand} primaryAction={makePrimaryAction(activeBrand)} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without action bar</StoryLabel>
          <InvoiceBill actionBar={false} brand={activeBrand} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without footer</StoryLabel>
          <InvoiceBill brand={activeBrand} footerText={false} primaryAction={makePrimaryAction(activeBrand)} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Custom item section</StoryLabel>
          <InvoiceBill
            brand={activeBrand}
            primaryAction={makePrimaryAction(activeBrand)}
            sections={[
              {
                id: "custom-section",
                items: [
                  {
                    id: "booking",
                    label: "Booking amount",
                    amount: "₹7,100",
                    showInfoIcon: true
                  },
                  {
                    id: "discount",
                    label: "Membership discount",
                    amount: "FREE",
                    badgeLabel: "Saved",
                    showBadge: true,
                    showDescription: true,
                    descriptionText: "Applied automatically"
                  },
                  {
                    id: "taxes",
                    label: "Taxes and fees",
                    amount: "₹1,200",
                    clickableItem: true,
                    showStrikeOutPrice: true,
                    strikeOutAmount: "₹1,500"
                  }
                ]
              }
            ]}
            totalAmount="₹8,300"
          />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function CompositionStory({ brand = "Cars24" }: Pick<InvoiceBillStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <InvoiceBill brand={activeBrand} primaryAction={makePrimaryAction(activeBrand)}>
          <InvoiceItem amount="₹7,100" brand={activeBrand} label="Bill item name" />
          <InvoiceItem
            amount="₹8,000"
            brand={activeBrand}
            clickableItem
            descriptionText="Description"
            label="Clickable item"
            showDescription
            showInfoIcon
          />
          <InvoiceItem
            amount="₹0"
            badgeLabel="Badge"
            brand={activeBrand}
            label="Discount"
            showBadge
            showStrikeOutPrice
            strikeOutAmount="₹800"
          />
        </InvoiceBill>
      </StoryCard>
    </StoryPage>
  );
}

const invoiceBillSourceCode = `import { Icon, InvoiceBill } from "@geist/web";

<InvoiceBill
  brand="Cars24"
  title="Section Heading"
  totalAmount="₹7,95,100"
  offerLabel="₹20 off on this order"
  primaryAction={{
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}
/>;`;

const meta = {
  title: "Widgets/Invoice / Bill",
  component: InvoiceBill,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(INVOICE_BILL_FIGMA_URL),
    docs: {
      description: {
        component:
          "Invoice / Bill widget matching the linked Figma node. It composes InvoiceItem rows with canonical Divider, Badge, Icon, and ButtonGroup primitives."
      },
      source: {
        code: invoiceBillSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    actionBar: true,
    footerText: true,
    sectionHeader: true,
    title: "Section Heading",
    footerLabel: "Total",
    totalAmount: "₹7,95,100",
    offerLabel: "₹20 off on this order"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    actionBar: {
      control: "boolean"
    },
    footerText: {
      control: "boolean"
    },
    sectionHeader: {
      control: "boolean"
    },
    title: {
      control: "text"
    },
    footerLabel: {
      control: "text"
    },
    totalAmount: {
      control: "text"
    },
    offerLabel: {
      control: "text"
    },
    sections: {
      control: false
    },
    children: {
      control: false
    },
    primaryAction: {
      control: false
    }
  },
  render: PlaygroundStory
} satisfies Meta<InvoiceBillStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WidgetOptions: Story = {
  render: ({ brand }) => <WidgetOptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const Composition: Story = {
  render: ({ brand }) => <CompositionStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
