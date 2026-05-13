import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  InvoiceItem,
  LoanCardNbfc,
  LoanCardNbfcItem,
  LoanCardNbfcMediaSlot,
  LoanCardRegistrationPlate,
  LoanCardSupportingContent,
  Text,
  getRequiredThemeTokenValue,
  type LoanCardNbfcProps,
  type LoanCardSupportingContentType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type LoanCardNbfcStoryArgs = LoanCardNbfcProps;

const LOAN_CARD_NBFC_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=29233-758&t=MixdbWFumXa9kfBn-11";

const supportingContentTypes: LoanCardSupportingContentType[] = [
  "Registration number plate",
  "Description"
];

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
      {children}
    </StoryCard>
  );
}

function PlaygroundStory(args: LoanCardNbfcStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <LoanCardNbfc {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function CustomMediaSlot({ brand }: { brand: DisplayBrandId }) {
  const surfaceSubtle = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return (
    <div
      style={{
        alignItems: "center",
        background: surfaceSubtle,
        color: textPrimary,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Icon brand={brand} decorative name="car-front-view" style={{ color: "inherit", fontSize: 28 }} />
    </div>
  );
}

function WidgetOptionsStory({ brand = "Cars24" }: Pick<LoanCardNbfcStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <PreviewShell brand={activeBrand} label="Default widget">
          <LoanCardNbfc brand={activeBrand} />
        </PreviewShell>

        <PreviewShell brand={activeBrand} label="Description support">
          <LoanCardNbfc
            brand={activeBrand}
            description="Loan approved, disbursal pending"
            supportingContentType="Description"
            title="CARS24 Finance"
          />
        </PreviewShell>

        <PreviewShell brand={activeBrand} label="Custom media slot">
          <LoanCardNbfc
            brand={activeBrand}
            imageSlot={<CustomMediaSlot brand={activeBrand} />}
            items={[
              { id: "emi", label: "Monthly EMI", amount: "₹12,840" },
              { id: "tenure", label: "Tenure", amount: "48 months" },
              { id: "rate", label: "Rate", amount: "11.25%" }
            ]}
            registrationNumber="MH12AB1234"
            title="Used car loan"
          />
        </PreviewShell>

        <PreviewShell brand={activeBrand} label="Without media or action">
          <LoanCardNbfc brand={activeBrand} showImage={false} showTrailingAction={false} />
        </PreviewShell>
      </div>
    </StoryPage>
  );
}

function ReusablePiecesStory({ brand = "Cars24" }: Pick<LoanCardNbfcStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <PreviewShell brand={activeBrand} label="Media slot">
          <LoanCardNbfcMediaSlot brand={activeBrand} />
        </PreviewShell>

        <PreviewShell brand={activeBrand} label="Registration plate">
          <LoanCardRegistrationPlate brand={activeBrand} />
        </PreviewShell>

        <PreviewShell brand={activeBrand} label="Invoice row">
          <div style={{ width: 312 }}>
            <LoanCardNbfcItem amount="₹7,100" brand={activeBrand} label="Label2 14" />
          </div>
        </PreviewShell>

        <PreviewShell brand={activeBrand} label="Supporting content variants">
          <div style={{ display: "grid", gap: 12, width: 240 }}>
            <LoanCardSupportingContent brand={activeBrand} />
            <LoanCardSupportingContent
              brand={activeBrand}
              description="Description"
              type="Description"
            />
          </div>
        </PreviewShell>
      </div>
    </StoryPage>
  );
}

function CompositionStory({ brand = "Cars24" }: Pick<LoanCardNbfcStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <LoanCardNbfc brand={activeBrand} title="Loan summary">
          <InvoiceItem amount="₹12,840" brand={activeBrand} label="Monthly EMI" />
          <InvoiceItem amount="48 months" brand={activeBrand} label="Tenure" />
          <InvoiceItem amount="11.25%" brand={activeBrand} label="Interest rate" />
        </LoanCardNbfc>
      </StoryCard>
    </StoryPage>
  );
}

const loanCardNbfcSourceCode = `import { LoanCardNbfc } from "@geist/web";

<LoanCardNbfc
  brand="Cars24"
  title="Title (H4) - 15px"
  registrationNumber="DL10CQ7291"
/>;`;

const meta = {
  title: "Widgets/Loan Card (NBFC)",
  component: LoanCardNbfc,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(LOAN_CARD_NBFC_FIGMA_URL),
    docs: {
      description: {
        component:
          "Loan card (NBFC) widget matching the linked Figma node. It composes reusable media, registration/supporting-content, token-driven row pieces with canonical IconButton and Divider."
      },
      source: {
        code: loanCardNbfcSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    title: "Title (H4) - 15px",
    description: "Description",
    registrationNumber: "DL10CQ7291",
    showImage: true,
    showTrailingAction: true,
    supportingContentType: "Registration number plate"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    title: {
      control: "text"
    },
    registrationNumber: {
      control: "text"
    },
    description: {
      control: "text"
    },
    supportingContentType: {
      control: "inline-radio",
      options: supportingContentTypes
    },
    showImage: {
      control: "boolean"
    },
    showTrailingAction: {
      control: "boolean"
    },
    imageSlot: {
      control: false
    },
    items: {
      control: false
    },
    children: {
      control: false
    },
    trailingAction: {
      control: false
    },
    onTrailingActionClick: {
      action: "trailing action click"
    }
  },
  render: PlaygroundStory
} satisfies Meta<LoanCardNbfcStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WidgetOptions: Story = {
  render: ({ brand }) => <WidgetOptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const ReusablePieces: Story = {
  render: ({ brand }) => <ReusablePiecesStory brand={brand ?? "Cars24"} />,
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
