import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  Text,
  WebQuoteBottomInfo,
  WebQuoteCard,
  type WebQuoteCardBottomInfoType,
  type WebQuoteCardProps
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type WebQuoteCardStoryArgs = WebQuoteCardProps & {
  bottomInfoType: WebQuoteCardBottomInfoType;
};

const WEB_QUOTE_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28460-43152&p=f&t=vUpeNbWJ84H8ABzi-11";
const WEB_QUOTE_BOTTOM_INFO_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28460-43196&t=vUpeNbWJ84H8ABzi-11";

const gridStyles: CSSProperties = {
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

function PlaygroundStory(args: WebQuoteCardStoryArgs) {
  return (
    <StoryPage>
      <StoryCard style={{ width: "fit-content" }}>
        <WebQuoteCard {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function CardVariantsStory({ brand = "Cars24" }: Pick<WebQuoteCardStoryArgs, "brand">) {
  return (
    <StoryPage fullscreen>
      <div style={gridStyles}>
        {([true, false] as const).map((priceVisible) =>
          (["Link Button", "Description"] as const).map((bottomInfoType) => (
            <StoryCard key={`${priceVisible}-${bottomInfoType}`} style={{ display: "grid", gap: 12 }}>
              <StoryLabel brand={brand}>{`Price ${priceVisible ? "visible" : "hidden"} / ${bottomInfoType}`}</StoryLabel>
              <WebQuoteCard brand={brand} bottomInfoType={bottomInfoType} priceVisible={priceVisible} />
            </StoryCard>
          ))
        )}
      </div>
    </StoryPage>
  );
}

function BottomInfoStory({ brand = "Cars24" }: Pick<WebQuoteCardStoryArgs, "brand">) {
  return (
    <StoryPage fullscreen>
      <div style={gridStyles}>
        {(["Link Button", "Description"] as const).map((type) => (
          <StoryCard key={type} style={{ display: "grid", gap: 12, width: "fit-content" }}>
            <StoryLabel brand={brand}>{type}</StoryLabel>
            <WebQuoteBottomInfo brand={brand} type={type} />
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

const meta = {
  title: "Components/Web Quote Card",
  component: WebQuoteCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(WEB_QUOTE_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    kicker: "Label - 12px regular",
    amount: "Display2 24px Bold",
    priceVisible: true,
    hiddenDigitCount: 9,
    badgeLabel: "Badge",
    bottomInfoType: "Link Button",
    bottomActionLabel: "Label",
    bottomDescription: "Description - 12px regular"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
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
} satisfies Meta<WebQuoteCardStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: CardVariantsStory,
  parameters: {
    controls: { disable: true }
  }
};

export const BottomInfo: Story = {
  render: BottomInfoStory,
  parameters: {
    controls: { disable: true },
    design: createFigspecDesign(WEB_QUOTE_BOTTOM_INFO_FIGMA_URL)
  }
};
