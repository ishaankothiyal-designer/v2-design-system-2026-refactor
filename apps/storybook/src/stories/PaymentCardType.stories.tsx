import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  PaymentCardType,
  PaymentPricingFlow,
  PaymentStatusBadge,
  Text,
  type PaymentCardTypeProps,
  type PaymentCardTypeVariant,
  type PaymentPricingState,
  type PaymentStatus
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const PAYMENT_CARD_TYPE_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28090-414&t=MixdbWFumXa9kfBn-11";

const paymentCardTypeVariants: PaymentCardTypeVariant[] = ["List box", "List card"];
const paymentPricingStates: PaymentPricingState[] = ["Default", "Positive", "Negative"];
const paymentStatuses: PaymentStatus[] = ["Paid", "Pending", "Failed"];

const optionGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(336px, max-content))",
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
    <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
      <StoryLabel brand={brand}>{label}</StoryLabel>
      <div style={{ width: 336 }}>{children}</div>
    </StoryCard>
  );
}

function PlaygroundStory(args: PaymentCardTypeProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <div style={{ width: 336 }}>
          <PaymentCardType {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function VariantMatrixStory({ brand = "Cars24" }: Pick<PaymentCardTypeProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        {paymentCardTypeVariants.map((variant) => (
          <PreviewShell key={variant} brand={activeBrand} label={variant}>
            <PaymentCardType brand={activeBrand} variant={variant} />
          </PreviewShell>
        ))}
      </div>
    </StoryPage>
  );
}

function StatusMatrixStory({ brand = "Cars24" }: Pick<PaymentCardTypeProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        {paymentStatuses.map((status) => (
          <PreviewShell key={status} brand={activeBrand} label={status}>
            <PaymentCardType
              badgeLabel={status}
              brand={activeBrand}
              pricingState={status === "Failed" ? "Negative" : status === "Pending" ? "Default" : "Positive"}
              status={status}
              title={`${status} payment`}
              variant="List card"
            />
          </PreviewShell>
        ))}
      </div>
    </StoryPage>
  );
}

function ReusableSubcomponentsStory({ brand = "Cars24" }: Pick<PaymentCardTypeProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Pricing flow</StoryLabel>
          <div style={{ alignItems: "flex-start", display: "flex", gap: 24 }}>
            {paymentPricingStates.map((state) => (
              <PaymentPricingFlow key={state} amount="₹9342" brand={activeBrand} state={state} />
            ))}
          </div>
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Payment status</StoryLabel>
          <div style={{ alignItems: "flex-start", display: "flex", gap: 12 }}>
            {paymentStatuses.map((status) => (
              <PaymentStatusBadge key={status} brand={activeBrand} status={status} />
            ))}
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const paymentCardTypeSourceCode = `import { PaymentCardType } from "@geist/web";

<PaymentCardType
  brand="Cars24"
  title="Title left 15px"
  description="Description of 13px 2 lines"
  amount="₹9342"
  badgeLabel="Badge"
  status="Paid"
  variant="List box"
/>;`;

const meta = {
  title: "Components/Payment Card Type",
  component: PaymentCardType,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(PAYMENT_CARD_TYPE_FIGMA_URL),
    docs: {
      description: {
        component:
          "Reusable Payment card type row from the linked Figma node. It covers List box/List card presentations plus amount and payment status subcomponents."
      },
      source: {
        code: paymentCardTypeSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    title: "Title left 15px",
    description: "Description of 13px 2 lines",
    amount: "₹9342",
    badgeLabel: "Badge",
    pricingState: "Default",
    status: "Paid",
    variant: "List box",
    showBadge: true,
    showDescription: true,
    showDivider: true,
    showLeadingIcon: true,
    showStatus: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    amount: {
      control: "text"
    },
    badgeLabel: {
      control: "text"
    },
    pricingState: {
      control: "inline-radio",
      options: paymentPricingStates
    },
    status: {
      control: "inline-radio",
      options: paymentStatuses
    },
    variant: {
      control: "inline-radio",
      options: paymentCardTypeVariants
    },
    showBadge: {
      control: "boolean"
    },
    showDescription: {
      control: "boolean"
    },
    showDivider: {
      control: "boolean"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showStatus: {
      control: "boolean"
    },
    iconName: {
      control: false
    },
    leadingIcon: {
      control: false
    },
    paidLabel: {
      control: false
    },
    statusLabel: {
      control: "text"
    }
  },
  render: PlaygroundStory
} satisfies Meta<PaymentCardTypeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: ({ brand }) => <VariantMatrixStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const Statuses: Story = {
  render: ({ brand }) => <StatusMatrixStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const ReusableSubcomponents: Story = {
  render: ({ brand }) => <ReusableSubcomponentsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
