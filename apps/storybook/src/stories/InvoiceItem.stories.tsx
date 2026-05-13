import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { InvoiceItem, Text, type InvoiceItemProps, type InvoiceItemType } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type InvoiceItemStoryArgs = InvoiceItemProps;

const INVOICE_ITEM_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=29187-8338&t=MixdbWFumXa9kfBn-11";

const invoiceItemTypes: InvoiceItemType[] = ["Bill item", "Header", "Footer text"];

const variantGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(344px, max-content))",
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

function PreviewShell({
  brand,
  children,
  label
}: {
  brand: DisplayBrandId;
  children: ReactNode;
  label: string;
}) {
  return (
    <StoryCard style={{ display: "grid", gap: 12, width: 344 }}>
      <StoryLabel brand={brand}>{label}</StoryLabel>
      <div style={{ width: 304 }}>{children}</div>
    </StoryCard>
  );
}

function PlaygroundStory(args: InvoiceItemStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <div style={{ width: 304 }}>
          <InvoiceItem {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function VariantsStory({ brand = "Cars24" }: Pick<InvoiceItemStoryArgs, "brand">) {
  return (
    <StoryPage fullscreen>
      <div style={variantGridStyles}>
        <PreviewShell brand={brand} label="Bill item">
          <InvoiceItem brand={brand} />
        </PreviewShell>

        <PreviewShell brand={brand} label="Bill item with metadata">
          <InvoiceItem
            amount="₹7,100"
            badgeLabel="Badge"
            brand={brand}
            clickableItem
            descriptionText="Description"
            showBadge
            showDescription
            showInfoIcon
            showStrikeOutPrice
            strikeOutAmount="₹8,000"
          />
        </PreviewShell>

        <PreviewShell brand={brand} label="Header">
          <InvoiceItem brand={brand} type="Header" />
        </PreviewShell>

        <PreviewShell brand={brand} label="Footer text">
          <InvoiceItem brand={brand} showFreeBadge showRefundableBadge type="Footer text" />
        </PreviewShell>
      </div>
    </StoryPage>
  );
}

const invoiceItemSourceCode = `import { InvoiceItem } from "@geist/web";

<InvoiceItem
  brand="Cars24"
  label="Bill item name"
  amount="₹7,100"
/>

<InvoiceItem
  brand="Cars24"
  type="Header"
  label="Section Heading"
/>

<InvoiceItem
  brand="Cars24"
  type="Footer text"
  label="Total"
  amount="₹7,95,100"
/>`;

const meta = {
  title: "Components/Invoice Item",
  component: InvoiceItem,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(INVOICE_ITEM_FIGMA_URL),
    docs: {
      description: {
        component:
          "Reusable Invoice item component matching the Figma Type axis: Bill item, Header, and Footer text."
      },
      source: {
        code: invoiceItemSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    type: "Bill item",
    label: "Bill item name",
    amount: "₹7,100",
    descriptionText: "Description",
    strikeOutAmount: "₹8,000",
    badgeLabel: "Badge",
    refundableBadgeLabel: "100% refundable",
    freeBadgeLabel: "FREE",
    clickableItem: false,
    showBadge: false,
    showDescription: false,
    showFreeBadge: false,
    showInfoIcon: false,
    showPricing: true,
    showRefundableBadge: false,
    showStrikeOutPrice: false
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: invoiceItemTypes
    },
    label: {
      control: "text"
    },
    amount: {
      control: "text"
    },
    descriptionText: {
      control: "text"
    },
    strikeOutAmount: {
      control: "text"
    },
    badgeLabel: {
      control: "text"
    },
    refundableBadgeLabel: {
      control: "text"
    },
    freeBadgeLabel: {
      control: "text"
    },
    clickableItem: {
      control: "boolean"
    },
    showBadge: {
      control: "boolean"
    },
    showDescription: {
      control: "boolean"
    },
    showFreeBadge: {
      control: "boolean"
    },
    showInfoIcon: {
      control: "boolean"
    },
    showPricing: {
      control: "boolean"
    },
    showRefundableBadge: {
      control: "boolean"
    },
    showStrikeOutPrice: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
} satisfies Meta<InvoiceItemStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: ({ brand }) => <VariantsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
