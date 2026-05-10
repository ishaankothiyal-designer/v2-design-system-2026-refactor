import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  BannerWidget,
  type BannerWidgetBannerType,
  type BannerWidgetProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const BANNER_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28366-7573&t=h5zc6W2b6MPFvMVS-11";
const BANNER_WIDGET_TYPES: BannerWidgetBannerType[] = ["Full Bleed", "Single", "Rotating"];

function DemoMedia() {
  return (
    <div
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0) 20%), linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 42%)",
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function PlaygroundStory(args: BannerWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={{ width: 360 }}>
          <BannerWidget {...args}>
            <DemoMedia />
          </BannerWidget>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ThemeShowcase({ brand = "Cars24" }: { brand?: NonNullable<BannerWidgetProps["brand"]> }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={themeGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={activeBrand} size="lg">
                Light
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Default banner-widget composition with a section header, full-bleed XS banner card,
                and a single primary CTA.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <BannerWidget brand={activeBrand}>
                <DemoMedia />
              </BannerWidget>
            </div>
          </div>
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={activeBrand} size="lg">
                Dark
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Inverse banner-widget variant matching the Figma dark surface while reusing the same
                header, banner-card, and CTA structure.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <BannerWidget brand={activeBrand} inverse>
                <DemoMedia />
              </BannerWidget>
            </div>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function TypeShowcase({
  brand = "Cars24",
  inverse = false
}: {
  brand?: NonNullable<BannerWidgetProps["brand"]>;
  inverse?: boolean;
}) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={themeGridStyles}>
        {BANNER_WIDGET_TYPES.map((bannerType) => (
          <StoryCard key={bannerType} style={{ width: "fit-content" }}>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <StoryHeading brand={activeBrand} size="lg">
                  {bannerType}
                </StoryHeading>
                <StoryCopy brand={activeBrand} size="sm">
                  Banner-widget shell reusing the same header and CTA while swapping the banner
                  presentation to {bannerType.toLowerCase()}.
                </StoryCopy>
              </div>
              <div style={{ width: 360 }}>
                <BannerWidget bannerType={bannerType} brand={activeBrand} inverse={inverse}>
                  <DemoMedia />
                </BannerWidget>
              </div>
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

const themeGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, max-content))",
  justifyContent: "center"
};

const bannerWidgetSourceCode = `<BannerWidget
  brand="Cars24"
  bannerType="Full Bleed"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showHeaderAction
  headerActionLabel="View all"
  showCta
  video
/>`;

const meta: Meta<BannerWidgetProps> = {
  title: "Widgets/Banner Widget",
  component: BannerWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BANNER_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    bannerType: "Full Bleed",
    inverse: false,
    showHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    showCta: true,
    video: true,
    playLabel: "Play video"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    bannerType: {
      control: "inline-radio",
      options: BANNER_WIDGET_TYPES
    },
    inverse: {
      control: "boolean"
    },
    showHeader: {
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
    showTag: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    showCta: {
      control: "boolean"
    },
    video: {
      control: "boolean"
    },
    playLabel: {
      control: "text"
    },
    rotatingAutoPlay: {
      control: "boolean"
    },
    rotatingShowCopy: {
      control: "boolean"
    },
    rotatingSize: {
      control: "inline-radio",
      options: ["Small", "Medium", "Large"]
    },
    rotatingSlideMode: {
      control: "inline-radio",
      options: ["Auto", "Manual"]
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
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
    },
    onPlayClick: {
      action: "play click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<BannerWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: bannerWidgetSourceCode
      }
    }
  }
};

export const Themes: Story = {
  render: ({ brand }) => <ThemeShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const BannerTypes: Story = {
  render: ({ brand, inverse = false }) => <TypeShowcase brand={brand ?? "Cars24"} inverse={inverse} />,
  parameters: {
    controls: { include: ["brand", "inverse"] }
  }
};
