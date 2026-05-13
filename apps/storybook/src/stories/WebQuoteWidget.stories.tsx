import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  Text,
  WebQuoteWidget,
  type WebQuoteWidgetProps
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const WEB_QUOTE_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28813-13963&t=vUpeNbWJ84H8ABzi-11";

const gridStyles: CSSProperties = {
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

function PlaygroundStory(args: WebQuoteWidgetProps) {
  return (
    <StoryPage>
      <StoryCard style={{ width: "fit-content" }}>
        <WebQuoteWidget {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function WidgetOptionsStory({ brand = "Cars24" }: Pick<WebQuoteWidgetProps, "brand">) {
  return (
    <StoryPage fullscreen>
      <div style={gridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Default widget</StoryLabel>
          <WebQuoteWidget brand={brand} />
        </StoryCard>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Without header</StoryLabel>
          <WebQuoteWidget brand={brand} showHeader={false} />
        </StoryCard>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Without CTA</StoryLabel>
          <WebQuoteWidget brand={brand} showCta={false} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const meta = {
  title: "Widgets/Web Quote Widget",
  component: WebQuoteWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(WEB_QUOTE_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    showHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    kicker: "Label - 12px regular",
    amount: "Display2 24px Bold",
    priceVisible: true,
    hiddenDigitCount: 9,
    badgeLabel: "Badge",
    bottomInfoType: "Link Button",
    bottomActionLabel: "Label",
    bottomDescription: "Description - 12px regular",
    showCta: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    showHeader: {
      control: "boolean"
    },
    showCta: {
      control: "boolean"
    },
    priceVisible: {
      control: "boolean"
    },
    bottomInfoType: {
      control: "select",
      options: ["Link Button", "Description"]
    }
  },
  render: PlaygroundStory
} satisfies Meta<WebQuoteWidgetProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WidgetOptions: Story = {
  render: WidgetOptionsStory,
  parameters: {
    controls: { disable: true }
  }
};
