import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Divider,
  EliteHeader,
  Icon,
  Module,
  SearchBar,
  Tag,
  Text,
  TopTab,
  type EliteBadgeName,
  type EliteHeaderBrand,
  type EliteHeaderProps,
  type EliteHeaderType,
  type EliteHeaderVariant,
  type AvatarAppearance
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

const ELITE_HEADER_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=2711-31207&t=1zgOyFpiLYMyM4XM-11";

const supportedBrands: EliteHeaderBrand[] = ["Cars24"];
const badgeNames: EliteBadgeName[] = ["Elite", "All cars"];
const eliteTypes: EliteHeaderType[] = ["Normal", "Search"];
const eliteVariants: EliteHeaderVariant[] = ["Light", "Dark"];
const avatarAppearances: AvatarAppearance[] = ["Icon", "Image", "Initials"];
const avatarImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;

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

function EliteMobileScreenStory(args: EliteHeaderProps) {
  return (
    <StoryPage fullscreen>
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          justifyContent: "center",
          padding: 24
        }}
      >
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: 28,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
            overflow: "hidden",
            width: 360
          }}
        >
          <EliteHeader {...args} />

          <div
            style={{
              display: "grid",
              gap: 16,
              padding: 16
            }}
          >
            <SearchBar
              brand="Cars24"
              color="Solid White"
              defaultValue="SUV under 20 lakhs"
              placeholder="Search elite cars"
              size="Small"
            />

            <TopTab
              brand="Cars24"
              configuration="Label + icon"
              items={[
                {
                  value: "featured",
                  label: "Featured",
                  iconName: "star-outline"
                },
                {
                  value: "new",
                  label: "New drops",
                  iconName: "sparkle-line",
                  showNotificationBadge: true
                },
                {
                  value: "saved",
                  label: "Saved",
                  iconName: "bookmark-banner-flag-tag-outline"
                }
              ]}
              value="featured"
            />

            <Module
              bodyMinHeight="auto"
              brand="Cars24"
              description="Curated cars with inspection confidence and instant test drive support."
              headerActionLabel="See all"
              primaryAction={{
                label: "Browse Elite cars"
              }}
              secondaryAction={{
                label: "Save filters"
              }}
              showHeaderAction
              showSectionHeader
              showTag={false}
              subtitle="Premium selection"
              title="Recommended for you"
            >
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ alignItems: "center", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Tag brand="Cars24" color="Green" label="Inspected" priority="Low" size="Large" />
                    <Text as="strong" brand="Cars24" size="md">
                      2022 Hyundai Creta SX(O)
                    </Text>
                  </div>
                  <Text as="p" brand="Cars24" size="sm" tone="secondary" style={{ margin: 0 }}>
                    14,320 km • Automatic • Petrol
                  </Text>
                </div>

                <Divider brand="Cars24" />

                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ alignItems: "center", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Tag brand="Cars24" color="Blue" label="Top rated" priority="Low" size="Large" />
                    <Text as="strong" brand="Cars24" size="md">
                      2021 Kia Seltos GTX+
                    </Text>
                  </div>
                  <Text as="p" brand="Cars24" size="sm" tone="secondary" style={{ margin: 0 }}>
                    18,980 km • Turbo petrol • 7DCT
                  </Text>
                </div>
              </div>
            </Module>

            <Module
              bodyMinHeight="auto"
              brand="Cars24"
              description="Benefits unlocked with your Elite membership."
              showButtonGroup={false}
              showHeaderAction={false}
              showTag={false}
              subtitle="Ownership experience"
              title="Why Elite"
            >
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <Text as="strong" brand="Cars24" size="sm">
                      Priority test drives
                    </Text>
                    <Text as="p" brand="Cars24" size="xs" tone="secondary" style={{ margin: 0 }}>
                      Book premium slots before they open publicly.
                    </Text>
                  </div>
                  <Tag brand="Cars24" color="Brand blue" label="Elite" priority="Low" size="Large" />
                </div>

                <Divider brand="Cars24" />

                <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <Text as="strong" brand="Cars24" size="sm">
                      Dedicated relationship manager
                    </Text>
                    <Text as="p" brand="Cars24" size="xs" tone="secondary" style={{ margin: 0 }}>
                      Assistance from shortlist to delivery.
                    </Text>
                  </div>
                  <Button brand="Cars24" shape="Pill" size="Small" styleVariant="Outline">
                    Talk now
                  </Button>
                </div>
              </div>
            </Module>
          </div>
        </div>
      </div>
    </StoryPage>
  );
}

function TypeStory({
  brand,
  type
}: {
  brand?: EliteHeaderBrand;
  type: EliteHeaderType;
}) {
  const activeBrand = (brand ?? "Cars24") as EliteHeaderBrand;

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="180px repeat(2, minmax(320px, 1fr))">
          <StoryMatrixCornerCell />
          {eliteVariants.map((variant) => (
            <StoryMatrixHeaderCell key={`${type}-${variant}-header`}>
              <div style={{ color: "#64748B", fontSize: 12, lineHeight: "16px" }}>{variant}</div>
            </StoryMatrixHeaderCell>
          ))}

          <StoryMatrixRowLabelCell minHeight={160}>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: "18px" }}>{type}</div>
          </StoryMatrixRowLabelCell>
          {eliteVariants.map((variant) => (
            <StoryMatrixValueCell key={`${type}-${variant}`} minHeight={160}>
              <PreviewFrame>
                <EliteHeader
                  avatarSrc={avatarImageSrc}
                  brand={activeBrand}
                  title="Gurugram"
                  subtitle="NCR, India"
                  type={type}
                  variant={variant}
                />
              </PreviewFrame>
            </StoryMatrixValueCell>
          ))}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function getEliteHeaderTypeSourceCode(type: EliteHeaderType) {
  return `<StoryPage fullscreen>
  <EliteHeader
    brand="Cars24"
    type="${type}"
    variant="Light"
    title="Gurugram"
    subtitle="NCR, India"
  />

  <EliteHeader
    brand="Cars24"
    type="${type}"
    variant="Dark"
    title="Gurugram"
    subtitle="NCR, India"
    searchPlaceholder="Search"
  />
</StoryPage>`;
}

const eliteHeaderUiExampleSourceCode = `<StoryPage fullscreen>
  <EliteHeader
    brand="Cars24"
    type="Normal"
    variant="Dark"
    title="Gurugram"
    subtitle="NCR, India"
    leadingAction={{
      icon: <Icon name="square-grid-circle-outline" decorative />,
      label: "Open sections"
    }}
    action1={{
      icon: <Icon name="heart-like-outline" decorative />,
      label: "Saved cars"
    }}
    action2={{
      icon: <Icon name="bell-outline" decorative />,
      label: "Notifications"
    }}
    avatarAppearance="Image"
    avatarSrc="/stories/assets/avatar-image-variant.png"
  />

  <SearchBar
    brand="Cars24"
    color="Solid White"
    defaultValue="SUV under 20 lakhs"
    placeholder="Search elite cars"
    size="Small"
  />

  <TopTab
    brand="Cars24"
    configuration="Label + icon"
    items={[
      {
        value: "featured",
        label: "Featured",
        iconName: "star-outline"
      },
      {
        value: "new",
        label: "New drops",
        iconName: "sparkle-line",
        showNotificationBadge: true
      },
      {
        value: "saved",
        label: "Saved",
        iconName: "bookmark-banner-flag-tag-outline"
      }
    ]}
    value="featured"
  />

  <Module
    brand="Cars24"
    title="Recommended for you"
    subtitle="Premium selection"
    description="Curated cars with inspection confidence and instant test drive support."
    primaryAction={{ label: "Browse Elite cars" }}
    secondaryAction={{ label: "Save filters" }}
  />
</StoryPage>`;

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
    avatarAppearance: "Image",
    avatarSrc: avatarImageSrc,
    avatarInitials: "MT",
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
    avatarAppearance: {
      control: "inline-radio",
      options: avatarAppearances
    },
    avatarAlt: {
      control: "text"
    },
    avatarInitials: {
      control: "text"
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

export const Normal: Story = {
  render: ({ brand = "Cars24" }) => <TypeStory brand={brand} type="Normal" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: getEliteHeaderTypeSourceCode("Normal")
      }
    }
  }
};

export const Search: Story = {
  render: ({ brand = "Cars24" }) => <TypeStory brand={brand} type="Search" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: getEliteHeaderTypeSourceCode("Search")
      }
    }
  }
};

export const UiExample: Story = {
  render: EliteMobileScreenStory,
  args: {
    brand: "Cars24",
    type: "Normal",
    variant: "Dark",
    leadingAction: {
      icon: <Icon name="square-grid-circle-outline" decorative />,
      label: "Open sections"
    },
    action1: {
      icon: <Icon name="heart-like-outline" decorative />,
      label: "Saved cars"
    },
    action2: {
      icon: <Icon name="bell-outline" decorative />,
      label: "Notifications"
    }
  },
  parameters: {
    docs: {
      source: {
        code: eliteHeaderUiExampleSourceCode
      }
    }
  }
};
