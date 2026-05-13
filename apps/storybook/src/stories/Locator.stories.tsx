import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  Locator,
  Text,
  type LocatorProps,
  type AddressStatusType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const LOCATOR_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=29166-2749&t=hFO1h296qgJvQhe9-11";

type LocatorStoryArgs = Pick<
  LocatorProps,
  | "addressDescription"
  | "addressTitle"
  | "brand"
  | "showAddressIcon"
  | "showHomeIndicator"
  | "statusMessage"
  | "statusType"
> & {
  actionLabel: string;
  changeLabel: string;
  showChangeAction: boolean;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

const addressStatusTypes: AddressStatusType[] = ["Default", "ANS"];

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

function buildLocatorProps(args: LocatorStoryArgs): LocatorProps {
  const brand = args.brand ?? "Cars24";

  return {
    addressDescription: args.addressDescription,
    addressTitle: args.addressTitle,
    brand,
    changeAction: args.showChangeAction
      ? {
          label: args.changeLabel
        }
      : null,
    primaryAction: {
      label: args.actionLabel,
      ...(args.showLeadingIcon ? { leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" /> } : {}),
      styleVariant: "Solid",
      ...(args.showTrailingIcon ? { trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" /> } : {})
    },
    showAddressIcon: args.showAddressIcon ?? true,
    showHomeIndicator: args.showHomeIndicator ?? true,
    statusMessage: args.statusMessage,
    statusType: args.statusType ?? "Default"
  };
}

function PlaygroundStory(args: LocatorStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <Locator {...buildLocatorProps(args)} />
      </StoryCard>
    </StoryPage>
  );
}

function WidgetOptionsStory({ brand = "Cars24" }: Pick<LocatorProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Default locator</StoryLabel>
          <Locator brand={activeBrand} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Unavailable address</StoryLabel>
          <Locator brand={activeBrand} statusType="ANS" />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without change action</StoryLabel>
          <Locator brand={activeBrand} changeAction={null} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const locatorSourceCode = `import { Icon, Locator } from "@geist/web";

<Locator
  brand="Cars24"
  statusType="Default"
  addressTitle="Address header"
  primaryAction={{
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}
/>;`;

const meta = {
  title: "Widgets/Locator",
  component: Locator,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(LOCATOR_FIGMA_URL),
    docs: {
      description: {
        component:
          "Locator widget composed from Address Status, address content, an extra-small outline change Button, a large Button Group CTA, and the iOS Home Indicator chrome."
      },
      source: {
        code: locatorSourceCode
      }
    }
  },
  args: {
    actionLabel: "Label",
    addressDescription:
      "Flat No. 1203, Tower C, Central Park Resorts, Sector 48, Sohna Road, Gurugram, Haryana - 122018, Near Medanta Hospital, Opposite Omaxe Celebration Mall" as ReactNode,
    addressTitle: "Address header" as ReactNode,
    brand: "Cars24",
    changeLabel: "Change",
    showAddressIcon: true,
    showChangeAction: true,
    showHomeIndicator: true,
    showLeadingIcon: true,
    showTrailingIcon: true,
    statusType: "Default"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    statusType: {
      control: "select",
      options: addressStatusTypes
    },
    statusMessage: {
      control: "text"
    },
    addressTitle: {
      control: "text"
    },
    addressDescription: {
      control: "text"
    },
    changeLabel: {
      control: "text"
    },
    actionLabel: {
      control: "text"
    },
    showAddressIcon: {
      control: "boolean"
    },
    showChangeAction: {
      control: "boolean"
    },
    showHomeIndicator: {
      control: "boolean"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showTrailingIcon: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
} satisfies Meta<LocatorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WidgetOptions: Story = {
  render: ({ brand }) => <WidgetOptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
