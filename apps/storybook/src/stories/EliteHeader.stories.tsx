import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  EliteHeader,
  type EliteBadgeName,
  type EliteHeaderBrand,
  type EliteHeaderProps,
  type EliteHeaderType,
  type EliteHeaderVariant
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const ELITE_HEADER_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=2711-31207&t=1zgOyFpiLYMyM4XM-11";

const supportedBrands: EliteHeaderBrand[] = ["Cars24"];
const badgeNames: EliteBadgeName[] = ["Elite", "All cars"];
const eliteTypes: EliteHeaderType[] = ["Normal", "Search"];
const eliteVariants: EliteHeaderVariant[] = ["Light", "Dark"];
const sampleAvatarDataUri =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="32" fill="#FFE7D9"/>
      <circle cx="32" cy="24" r="11" fill="#F5B19A"/>
      <path d="M14 58C16.6 45.2 24 39 32 39C40 39 47.4 45.2 50 58" fill="#D7745A"/>
      <circle cx="28" cy="22" r="1.5" fill="#6B2E1A"/>
      <circle cx="36" cy="22" r="1.5" fill="#6B2E1A"/>
      <path d="M28 29C29.2 30.6 30.7 31.4 32 31.4C33.3 31.4 34.8 30.6 36 29" stroke="#6B2E1A" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `);

function PreviewFrame({ children }: { children: ReactNode }) {
  return <div style={{ width: 360 }}>{children}</div>;
}

function PlaygroundStory(args: EliteHeaderProps) {
  return (
    <StoryPage>
      <StoryCard>
        <PreviewFrame>
          <EliteHeader {...args} />
        </PreviewFrame>
      </StoryCard>
    </StoryPage>
  );
}

function VariantsStory() {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 28 }}>
        {eliteTypes.map((type) => (
          <section key={type} style={{ display: "grid", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: "18px" }}>Type = {type}</div>
            <div style={variantGridStyles}>
              {eliteVariants.map((variant) => (
                <div key={`${type}-${variant}`} style={variantCellStyles}>
                  <div style={{ color: "#64748B", fontSize: 12, lineHeight: "16px" }}>{variant}</div>
                  <PreviewFrame>
                    <EliteHeader
                      avatarSrc={sampleAvatarDataUri}
                      title="Gurugram"
                      subtitle="NCR, India"
                      type={type}
                      variant={variant}
                    />
                  </PreviewFrame>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  rowGap: 20
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 10
};

const eliteHeaderVariantsSourceCode = `<StoryPage fullscreen>
  <EliteHeader
    brand="Cars24"
    type="Normal"
    variant="Light"
    title="Gurugram"
    subtitle="NCR, India"
  />

  <EliteHeader
    brand="Cars24"
    type="Search"
    variant="Dark"
    searchPlaceholder="Search"
  />
</StoryPage>`;

const eliteHeaderUiExampleSourceCode = `<EliteHeader
  brand="Cars24"
  type="Normal"
  variant="Dark"
  title="Gurugram"
  subtitle="NCR, India"
  avatarSrc="data:image/svg+xml;utf8,..."
/>`;

const meta = {
  title: "Components/Headers/Elite Header",
  component: EliteHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(ELITE_HEADER_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    variant: "Dark",
    type: "Normal",
    title: "Gurugram",
    subtitle: "NCR, India",
    showTitle: true,
    showSubtitle: true,
    showTitleChevron: true,
    showLeadingAction: true,
    showBadge: true,
    showAction1: true,
    showAction2: true,
    showAvatar: true,
    badgeName: "Elite",
    badgeLabel: "Elite",
    avatarSrc: sampleAvatarDataUri,
    searchPlaceholder: "Search"
  },
  argTypes: {
    brand: {
      control: false,
      options: supportedBrands
    },
    variant: {
      control: "inline-radio",
      options: eliteVariants
    },
    type: {
      control: "inline-radio",
      options: eliteTypes
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    showTitle: {
      control: "boolean"
    },
    showSubtitle: {
      control: "boolean"
    },
    showTitleChevron: {
      control: "boolean"
    },
    showLeadingAction: {
      control: "boolean"
    },
    showBadge: {
      control: "boolean"
    },
    showAction1: {
      control: "boolean"
    },
    showAction2: {
      control: "boolean"
    },
    showAvatar: {
      control: "boolean"
    },
    badgeName: {
      control: "inline-radio",
      options: badgeNames
    },
    badgeLabel: {
      control: false
    },
    searchPlaceholder: {
      control: "text"
    },
    leadingAction: {
      control: false
    },
    action1: {
      control: false
    },
    action2: {
      control: false
    },
    avatarAction: {
      control: false
    },
    searchBarProps: {
      control: false
    },
    avatarSrc: {
      control: false
    },
    onTitleClick: {
      action: "title click"
    }
  }
} satisfies Meta<typeof EliteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Variants: Story = {
  render: VariantsStory,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: eliteHeaderVariantsSourceCode
      }
    }
  }
};

export const UiExample: Story = {
  render: PlaygroundStory,
  args: {
    brand: "Cars24",
    type: "Normal",
    variant: "Dark"
  },
  parameters: {
    docs: {
      source: {
        code: eliteHeaderUiExampleSourceCode
      }
    }
  }
};
