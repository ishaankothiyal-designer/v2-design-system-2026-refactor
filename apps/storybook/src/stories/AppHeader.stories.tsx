import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AppHeader,
  Icon,
  Text,
  type AppHeaderBrand,
  type AppHeaderLevel,
  type AppHeaderProps,
  type AppHeaderVariant
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const APP_HEADER_L1_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=15010-35686&t=1zgOyFpiLYMyM4XM-11";
const APP_HEADER_L2_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=15010-35783&t=1zgOyFpiLYMyM4XM-11";

const supportedBrands: AppHeaderBrand[] = ["Cars24", "CarInfo", "VehicleInfo", "Team BHP"];
const headerLevels: AppHeaderLevel[] = ["Page - L1", "Page - L2"];
const headerVariants: AppHeaderVariant[] = ["Brand", "Light", "Dark"];

function createPillAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies NonNullable<AppHeaderProps["pillAction"]>;
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return <div style={{ width: 300 }}>{children}</div>;
}

function PlaygroundStory(args: AppHeaderProps) {
  return (
    <StoryPage>
      <StoryCard>
        <PreviewFrame>
          <AppHeader {...args} />
        </PreviewFrame>
      </StoryCard>
    </StoryPage>
  );
}

function VariantsStory() {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 28 }}>
        {headerLevels.map((level) => (
          <section key={level} style={{ display: "grid", gap: 16 }}>
            <Text as="strong" brand="Cars24" size="md">
              {level}
            </Text>

            {headerVariants.map((variant) => (
              <section key={`${level}-${variant}`} style={{ display: "grid", gap: 12 }}>
                <Text as="span" brand="Cars24" size="xs" tone="secondary">
                  {variant}
                </Text>

                <div style={variantGridStyles}>
                  <div style={variantCellStyles}>
                    <Text as="span" brand="Cars24" size="xs" tone="secondary">
                      Pill Button = False
                    </Text>
                    <PreviewFrame>
                      <AppHeader level={level} variant={variant} />
                    </PreviewFrame>
                  </div>

                  <div style={variantCellStyles}>
                    <Text as="span" brand="Cars24" size="xs" tone="secondary">
                      Pill Button = True
                    </Text>
                    <PreviewFrame>
                      <AppHeader level={level} pillAction={createPillAction()} variant={variant} />
                    </PreviewFrame>
                  </div>
                </div>
              </section>
            ))}
          </section>
        ))}
      </div>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
  rowGap: 20
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 10
};

const appHeaderVariantsSourceCode = `<StoryPage fullscreen>
  <AppHeader
    brand="Cars24"
    level="Page - L1"
    variant="Brand"
    showAction1
    showAction2
    showAvatar
    locationLabel="Gurgaon • SAS Tower, Sector 38"
  />

  <AppHeader
    brand="Cars24"
    level="Page - L2"
    variant="Brand"
    title="Page title"
    subtitle="Subtext"
    pillAction={{
      label: "Label",
      leadingIcon: <Icon name="sparkle-filled" decorative />,
      trailingIcon: <Icon name="arrow-right-outline" decorative />
    }}
  />
</StoryPage>`;

const appHeaderUiExampleSourceCode = `<AppHeader
  brand="Cars24"
  level="Page - L2"
  variant="Light"
  title="Page title"
  subtitle="Subtext"
  pillAction={{
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}
/>`;

const meta = {
  title: "Components/Headers/App Header",
  component: AppHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(APP_HEADER_L1_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    level: "Page - L1",
    variant: "Brand",
    title: "Page title",
    subtitle: "Subtext",
    showTitle: true,
    showSubtitle: true,
    showBackButton: true,
    locationLabel: "Gurgaon • SAS Tower, Sector 38",
    showLocation: true,
    showAction1: true,
    showAction2: true,
    showAvatar: true,
    showLocationChevron: true,
    pillAction: null
  },
  argTypes: {
    brand: {
      control: "select",
      options: supportedBrands
    },
    level: {
      control: "inline-radio",
      options: headerLevels
    },
    variant: {
      control: "inline-radio",
      options: headerVariants
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
    showBackButton: {
      control: "boolean"
    },
    locationLabel: {
      control: "text"
    },
    showLocation: {
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
    showLocationChevron: {
      control: "boolean"
    },
    actions: {
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
    backIcon: {
      control: false
    },
    pillAction: {
      control: false
    },
    logo: {
      control: false
    },
    onBackClick: {
      action: "back click"
    },
    onLocationClick: {
      action: "location click"
    }
  }
} satisfies Meta<typeof AppHeader>;

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
        code: appHeaderVariantsSourceCode
      }
    }
  }
};

export const UiExample: Story = {
  render: PlaygroundStory,
  args: {
    brand: "Cars24",
    level: "Page - L2",
    variant: "Light",
    pillAction: createPillAction()
  },
  parameters: {
    design: createFigspecDesign(APP_HEADER_L2_FIGMA_URL),
    docs: {
      source: {
        code: appHeaderUiExampleSourceCode
      }
    }
  }
};
