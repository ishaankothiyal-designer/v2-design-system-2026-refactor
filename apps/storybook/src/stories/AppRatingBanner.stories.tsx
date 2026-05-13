import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  AppRatingBanner,
  AppRatingBannerPlaceholder,
  Text,
  type AppRatingBannerProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const APP_RATING_BANNER_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28871-3206&t=vUpeNbWJ84H8ABzi-11";

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

function RatingWidgetSlot({ brand }: { brand: DisplayBrandId }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "var(--cars24-semantic-bg-primary, #FFFFFF)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Text brand={brand} as="strong" size="lg" style={{ lineHeight: 1 }}>
        4.8
      </Text>
      <Text brand={brand} as="span" size="xs" tone="secondary" style={{ lineHeight: 1.2 }}>
        Rating
      </Text>
    </div>
  );
}

function CustomMedia({ brand }: { brand: DisplayBrandId }) {
  return (
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, var(--cars24-primitive-drive-pink-100, #FEB9E7), var(--cars24-primitive-drive-pink-50, #FFE8F7))",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <AppRatingBannerPlaceholder brand={brand} variant="overlay" style={{ height: 80, width: 86 }} />
    </div>
  );
}

function PlaygroundStory(args: AppRatingBannerProps) {
  return (
    <StoryPage>
      <StoryCard style={{ width: "fit-content" }}>
        <AppRatingBanner {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function WidgetOptionsStory({ brand = "Cars24" }: Pick<AppRatingBannerProps, "brand">) {
  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Default widget</StoryLabel>
          <AppRatingBanner brand={brand} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Without store logos</StoryLabel>
          <AppRatingBanner brand={brand} showStoreLogos={false} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Custom media and rating slot</StoryLabel>
          <AppRatingBanner
            brand={brand}
            media={<CustomMedia brand={brand} />}
            title="Loved by app users"
            description="Fast checkout, easy car discovery, and account updates in one app."
            widgetSlot={<RatingWidgetSlot brand={brand} />}
          />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const appRatingBannerSourceCode = `import { AppRatingBanner } from "@geist/web";

export function Example() {
  return (
    <AppRatingBanner
      brand="Cars24"
      title="Title"
      description="Description up to 2 lines"
      downloadLabel="Download app now"
    />
  );
}`;

const meta = {
  title: "Widgets/App rating banner",
  component: AppRatingBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(APP_RATING_BANNER_FIGMA_URL),
    docs: {
      description: {
        component:
          "Implements the linked Figma node named App rating banner. Figma exposes placeholder slots rather than final artwork, so media and the overlay widget slot are reusable props with placeholder defaults."
      },
      source: {
        code: appRatingBannerSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    title: "Title",
    description: "Description up to 2 lines",
    downloadLabel: "Download app now",
    showStoreLogos: true,
    showWidgetSlot: true,
    storeLogos: ["google-play", "app-store"]
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
    downloadLabel: {
      control: "text"
    },
    showStoreLogos: {
      control: "boolean"
    },
    showWidgetSlot: {
      control: "boolean"
    },
    storeLogos: {
      control: "check",
      options: ["google-play", "app-store"]
    },
    media: {
      control: false
    },
    widgetSlot: {
      control: false
    }
  },
  render: PlaygroundStory
} satisfies Meta<AppRatingBannerProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WidgetOptions: Story = {
  render: ({ brand }) => <WidgetOptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
