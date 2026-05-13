import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  PaymentCard,
  PaymentCardType,
  Text,
  type PaymentCardProps,
  type PaymentCardWidgetType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const PAYMENT_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28090-406&t=MixdbWFumXa9kfBn-11";

const paymentCardWidgetTypes: PaymentCardWidgetType[] = ["List card", "List box"];

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

function PlaygroundStory(args: PaymentCardProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <PaymentCard {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function WidgetOptionsStory({
  brand = "Cars24",
  type = "List card"
}: Pick<PaymentCardProps, "brand" | "type">) {
  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        {paymentCardWidgetTypes.map((widgetType) => (
          <StoryCard key={widgetType} style={{ display: "grid", gap: 12, width: "fit-content" }}>
            <StoryLabel brand={brand}>{widgetType}</StoryLabel>
            <PaymentCard brand={brand} type={widgetType} />
          </StoryCard>
        ))}

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Without section header</StoryLabel>
          <PaymentCard brand={brand} showSectionHeader={false} type={type} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Without CTA</StoryLabel>
          <PaymentCard brand={brand} showButton={false} type={type} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function CompositionStory({ brand = "Cars24" }: Pick<PaymentCardProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center", width: "fit-content" }}>
        <PaymentCard brand={activeBrand} title="Payment schedule" subtitle="NBFC breakdown">
          <PaymentCardType
            amount="₹9,342"
            badgeLabel="Due"
            brand={activeBrand}
            status="Pending"
            title="Processing fee"
          />
          <PaymentCardType
            amount="₹4,120"
            badgeLabel="Paid"
            brand={activeBrand}
            pricingState="Positive"
            status="Paid"
            title="Down payment"
          />
          <PaymentCardType
            amount="₹1,200"
            badgeLabel="Failed"
            brand={activeBrand}
            pricingState="Negative"
            status="Failed"
            title="Retry charge"
          />
        </PaymentCard>
      </StoryCard>
    </StoryPage>
  );
}

const paymentCardSourceCode = `import { PaymentCard } from "@geist/web";

export function Example() {
  return (
    <PaymentCard
      brand="Cars24"
      type="List card"
      title="Section title"
      subtitle="Section title line 2"
      description="Description goes here upto 2 lines"
      tagLabel="New"
      headerActionLabel="View all"
    />
  );
}`;

const meta = {
  title: "Widgets/Payment Card (NBFC)",
  component: PaymentCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(PAYMENT_CARD_FIGMA_URL),
    docs: {
      description: {
        component:
          "Payment summary widget with optional section header and CTA, composing repeated payment rows with amount and paid status."
      },
      source: {
        code: paymentCardSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    type: "List card",
    showSectionHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    showButton: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: paymentCardWidgetTypes
    },
    background: {
      control: "color"
    },
    showSectionHeader: {
      control: "boolean"
    },
    showButton: {
      control: "boolean"
    },
    showTag: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
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
    headerActionLabel: {
      control: "text"
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    },
    items: {
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
  render: PlaygroundStory
} satisfies Meta<PaymentCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WidgetOptions: Story = {
  render: ({ brand, type }) => <WidgetOptionsStory brand={brand ?? "Cars24"} type={type ?? "List card"} />,
  parameters: {
    controls: { include: ["brand", "type"] }
  }
};

export const Composition: Story = {
  render: ({ brand }) => <CompositionStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
