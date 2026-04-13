import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AppHeader,
  Icon,
  Text,
  type AppHeaderBrand,
  type AvatarAppearance,
  type AppHeaderLevel,
  type AppHeaderProps,
  type AppHeaderVariant
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

const APP_HEADER_L1_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=15010-35686&t=1zgOyFpiLYMyM4XM-11";
const APP_HEADER_L2_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=15010-35783&t=1zgOyFpiLYMyM4XM-11";

const supportedBrands: AppHeaderBrand[] = ["Cars24", "CarInfo", "VehicleInfo", "Team BHP"];
const headerLevels: AppHeaderLevel[] = ["Page - L1", "Page - L2"];
const headerVariants: AppHeaderVariant[] = ["Brand", "Light", "Dark"];
const avatarAppearances: AvatarAppearance[] = ["Icon", "Image", "Initials"];
const avatarImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;

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

function VariantStory({
  brand,
  variant
}: {
  brand?: AppHeaderBrand;
  variant: AppHeaderVariant;
}) {
  const activeBrand = (brand ?? "Cars24") as AppHeaderBrand;

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="180px repeat(2, minmax(320px, 1fr))">
          <StoryMatrixCornerCell />
          <StoryMatrixHeaderCell>
            <Text as="strong" brand={activeBrand} size="sm" tone="secondary">
              Without Pill
            </Text>
          </StoryMatrixHeaderCell>
          <StoryMatrixHeaderCell>
            <Text as="strong" brand={activeBrand} size="sm" tone="secondary">
              With Pill
            </Text>
          </StoryMatrixHeaderCell>

          {headerLevels.flatMap((level) => [
            <StoryMatrixRowLabelCell key={`${level}-label`} minHeight={180}>
              <Text as="strong" brand={activeBrand} size="sm" tone="secondary">
                {level}
              </Text>
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`${level}-plain`} minHeight={180}>
              <PreviewFrame>
                <AppHeader brand={activeBrand} level={level} variant={variant} />
              </PreviewFrame>
            </StoryMatrixValueCell>,
            <StoryMatrixValueCell key={`${level}-pill`} minHeight={180}>
              <PreviewFrame>
                <AppHeader brand={activeBrand} level={level} pillAction={createPillAction()} variant={variant} />
              </PreviewFrame>
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function getAppHeaderVariantSourceCode(variant: AppHeaderVariant) {
  return `<StoryPage fullscreen>
  <AppHeader
    brand="Cars24"
    level="Page - L1"
    variant="${variant}"
    showAction1
    showAction2
    showAvatar
    locationLabel="Gurgaon • SAS Tower, Sector 38"
  />

  <AppHeader
    brand="Cars24"
    level="Page - L2"
    variant="${variant}"
    title="Page title"
    subtitle="Subtext"
    pillAction={{
      label: "Label",
      leadingIcon: <Icon name="sparkle-filled" decorative />,
      trailingIcon: <Icon name="arrow-right-outline" decorative />
    }}
  />
</StoryPage>`;
}

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
    avatarAppearance: "Icon",
    avatarAlt: "Profile image",
    avatarImageSrc,
    avatarInitials: "MT",
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
    avatarImageSrc: {
      control: false
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

export const Brand: Story = {
  render: ({ brand = "Cars24" }) => <VariantStory brand={brand} variant="Brand" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: getAppHeaderVariantSourceCode("Brand")
      }
    }
  }
};

export const Light: Story = {
  render: ({ brand = "Cars24" }) => <VariantStory brand={brand} variant="Light" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: getAppHeaderVariantSourceCode("Light")
      }
    }
  }
};

export const Dark: Story = {
  render: ({ brand = "Cars24" }) => <VariantStory brand={brand} variant="Dark" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: getAppHeaderVariantSourceCode("Dark")
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
