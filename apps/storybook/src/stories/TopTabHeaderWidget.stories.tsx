import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  getTopTabHeaderWidgetDefaultItems,
  TopTabHeaderWidget,
  TopTabHeaderWidgetTabStatusAtom,
  type TopTabHeaderWidgetProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const TOP_TAB_HEADER_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28726-9432&t=h5zc6W2b6MPFvMVS-11";
const TOP_TAB_STATUS_ATOM_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=23044-6980&p=f&t=h5zc6W2b6MPFvMVS-11";
const avatarImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;

function PreviewFrame({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: 360, width: "100%" }}>{children}</div>;
}

function PlaygroundStory(args: TopTabHeaderWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <PreviewFrame>
          <TopTabHeaderWidget {...args} />
        </PreviewFrame>
      </StoryCard>
    </StoryPage>
  );
}

function CountryShowcase({
  brand = "Cars24"
}: {
  brand?: NonNullable<TopTabHeaderWidgetProps["brand"]>;
}) {
  return (
    <StoryPage fullscreen>
      <div style={themeGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={brand} size="lg">
                India
              </StoryHeading>
              <StoryCopy brand={brand} size="sm">
                Status bar, branded L1 app header with location row, inverse search, and the taller 88px navigation rail from the Figma widget.
              </StoryCopy>
            </div>
            <PreviewFrame>
              <TopTabHeaderWidget
                banner={<DefaultStoryBanner />}
                brand={brand}
                country="India"
                headerProps={{
                  avatarAppearance: "Image",
                  avatarImageSrc,
                  locationLabel: "Gurugram, NCR"
                }}
              />
            </PreviewFrame>
          </div>
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={brand} size="lg">
                Country2
              </StoryHeading>
              <StoryCopy brand={brand} size="sm">
                Compact header variant with the search-plus-action row and rounded 70px navigation cards shown in the second Figma country variant.
              </StoryCopy>
            </div>
            <PreviewFrame>
              <TopTabHeaderWidget
                banner={<DefaultStoryBanner compact />}
                brand={brand}
                country="Country2"
                headerProps={{
                  avatarAppearance: "Image",
                  avatarImageSrc
                }}
              />
            </PreviewFrame>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function DefaultStoryBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-label="Banner image placeholder"
      role="img"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.36), transparent 30%), linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(3, 7, 18, 0.16))",
        height: 144,
        overflow: "hidden",
        position: "relative"
      }}
    >
      <div
        aria-hidden="true"
        style={{
          background: "linear-gradient(160deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.34))",
          borderRadius: 28,
          bottom: -12,
          height: 108,
          position: "absolute",
          right: -12,
          transform: "rotate(-8deg)",
          width: compact ? 154 : 176
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background: "rgba(255, 255, 255, 0.18)",
          borderRadius: 20,
          height: compact ? 76 : 88,
          left: 18,
          position: "absolute",
          top: compact ? 34 : 26,
          width: compact ? 108 : 120
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background: "rgba(255, 255, 255, 0.14)",
          borderRadius: 999,
          height: 10,
          left: 30,
          position: "absolute",
          top: compact ? 48 : 42,
          width: compact ? 64 : 72
        }}
      />
    </div>
  );
}

function TabStatusAtomStory({
  brand = "Cars24"
}: {
  brand?: NonNullable<TopTabHeaderWidgetProps["brand"]>;
}) {
  const indiaItems = getTopTabHeaderWidgetDefaultItems("India");

  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 24, justifyContent: "center" }}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <StoryHeading brand={brand} size="lg">
              India Tab Status Atom
            </StoryHeading>
            <StoryCopy brand={brand} size="sm">
              Real imported active and inactive tab icon artwork used by the India variant of the Top Tab Header Widget.
            </StoryCopy>
          </div>
          <div style={atomGridStyles}>
            <AtomHeaderCell brand={brand} label="Tab" />
            <AtomHeaderCell brand={brand} label="Active = Yes" />
            <AtomHeaderCell brand={brand} label="Active = No" />

            {indiaItems.flatMap((item) => [
              <AtomLabelCell key={`${item.value}-label`} brand={brand} label={typeof item.label === "string" ? item.label : item.value} />,
              <AtomValueCell key={`${item.value}-yes`}>
                <TopTabHeaderWidgetTabStatusAtom brand={brand} country="India" expanded item={item} selected />
              </AtomValueCell>,
              <AtomValueCell key={`${item.value}-no`}>
                <TopTabHeaderWidgetTabStatusAtom brand={brand} country="India" expanded item={item} selected={false} />
              </AtomValueCell>
            ])}
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function AtomHeaderCell({
  brand,
  label
}: {
  brand: NonNullable<TopTabHeaderWidgetProps["brand"]>;
  label: string;
}) {
  return (
    <div style={{ color: "#64748B", fontSize: 12, fontWeight: 600, lineHeight: "16px" }}>
      {label}
    </div>
  );
}

function AtomLabelCell({
  brand,
  label
}: {
  brand: NonNullable<TopTabHeaderWidgetProps["brand"]>;
  label: string;
}) {
  return (
    <div style={{ alignItems: "center", display: "flex", minHeight: 96 }}>
      <StoryCopy brand={brand} size="sm">
        {label}
      </StoryCopy>
    </div>
  );
}

function AtomValueCell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(180deg, #6A4DFF 0%, #4F38E4 100%)",
        borderRadius: 20,
        display: "flex",
        justifyContent: "center",
        minHeight: 108,
        padding: 16
      }}
    >
      {children}
    </div>
  );
}

const themeGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, max-content))",
  justifyContent: "center"
};

const atomGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 16,
  display: "grid",
  gridTemplateColumns: "160px repeat(2, minmax(140px, 1fr))",
  rowGap: 12
};

const topTabHeaderWidgetSourceCode = `<TopTabHeaderWidget
  brand="Cars24"
  country="India"
  headerProps={{
    avatarAppearance: "Image",
    avatarImageSrc: "/stories/assets/avatar-image-variant.png",
    locationLabel: "Gurugram, NCR"
  }}
/>\n`;

const meta: Meta<TopTabHeaderWidgetProps> = {
  title: "Widgets/Top Tab Header Widget",
  component: TopTabHeaderWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TOP_TAB_HEADER_WIDGET_FIGMA_URL)
  },
  args: {
    banner: <DefaultStoryBanner />,
    brand: "Cars24",
    country: "India",
    headerProps: {
      avatarAppearance: "Image",
      avatarImageSrc,
      locationLabel: "Gurugram, NCR"
    },
    showBanner: true,
    showNavigationRail: true,
    showSearchBar: true
  },
  argTypes: {
    banner: {
      control: false
    },
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    country: {
      control: "inline-radio",
      options: ["India", "Country2"]
    },
    defaultValue: {
      control: false
    },
    headerProps: {
      control: false
    },
    items: {
      control: false
    },
    onValueChange: {
      action: "value change"
    },
    searchAction: {
      control: false
    },
    searchBarProps: {
      control: false
    },
    showBanner: {
      control: "boolean"
    },
    showNavigationRail: {
      control: "boolean"
    },
    showSearchBar: {
      control: "boolean"
    },
    style: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<TopTabHeaderWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: topTabHeaderWidgetSourceCode
      }
    }
  }
};

export const Countries: Story = {
  render: ({ brand }) => <CountryShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const TabStatusAtom: Story = {
  render: ({ brand }) => <TabStatusAtomStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] },
    design: createFigspecDesign(TOP_TAB_STATUS_ATOM_FIGMA_URL)
  }
};
