import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Button,
  Icon,
  SectionHeader,
  SocialButton,
  Text,
  getRequiredThemeTokenValue,
  type SocialButtonPreviewState,
  type SocialButtonProps,
  type SocialButtonSize
} from "@geist/web";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

type SocialButtonStoryArgs = Omit<SocialButtonProps, "children" | "icon"> & {
  iconName: "apple" | "facebook" | "google-icon" | "linkedin" | "x";
  label: string;
};

const socialButtonSizes: SocialButtonSize[] = ["Large", "Medium"];
const documentedSizes = [
  { key: "small", label: "Small", size: "Medium" as const },
  { key: "large", label: "Large", size: "Large" as const }
] as const;
const providerIcons: SocialButtonStoryArgs["iconName"][] = ["google-icon", "apple", "facebook", "linkedin", "x"];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: SocialButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover", forceState: "Hover" },
  { key: "disabled", label: "Disabled", disabled: true }
];

const variantsSourceCode = `<div style={{ display: "grid", gap: 24 }}>
  <div style={{ display: "grid", gap: 16 }}>
    <SocialButton brand="Cars24" size="Medium" icon={<Icon name="google-icon" decorative />}>
      Sign in with Google
    </SocialButton>
    <SocialButton brand="Cars24" size="Medium" forceState="Hover" icon={<Icon name="google-icon" decorative />}>
      Sign in with Google
    </SocialButton>
    <SocialButton brand="Cars24" size="Medium" disabled icon={<Icon name="google-icon" decorative />}>
      Sign in with Google
    </SocialButton>
  </div>

  <div style={{ display: "grid", gap: 16 }}>
    <SocialButton brand="Cars24" size="Large" icon={<Icon name="google-icon" decorative />}>
      Sign in with Google
    </SocialButton>
    <SocialButton brand="Cars24" size="Large" forceState="Hover" icon={<Icon name="google-icon" decorative />}>
      Sign in with Google
    </SocialButton>
    <SocialButton brand="Cars24" size="Large" disabled icon={<Icon name="google-icon" decorative />}>
      Sign in with Google
    </SocialButton>
  </div>
</div>`;

function StorySocialButton({ iconName, label, ...rest }: SocialButtonStoryArgs) {
  return (
    <SocialButton {...rest} icon={<Icon name={iconName} decorative />}>
      {label}
    </SocialButton>
  );
}

function HeaderCell({
  brand = "Cars24",
  label
}: {
  brand?: DisplayBrandId;
  label: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function MatrixCell({
  brand,
  disabled,
  forceState,
  size
}: {
  brand: DisplayBrandId;
  disabled?: boolean;
  forceState?: SocialButtonPreviewState;
  size: SocialButtonSize;
}) {
  return (
    <SocialButton
      brand={brand}
      size={size}
      icon={<Icon name="google-icon" decorative />}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    >
      Sign in with Google
    </SocialButton>
  );
}

function SizesDocument({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="180px repeat(3, minmax(220px, 1fr))">
          <StoryMatrixCornerCell />
          {documentedStates.map((state) => (
            <StoryMatrixHeaderCell key={`sizes-${state.key}`}>
              <HeaderCell brand={brand} label={state.label} />
            </StoryMatrixHeaderCell>
          ))}

          {documentedSizes.flatMap((entry) => [
            <StoryMatrixRowLabelCell key={`sizes-${entry.key}-label`} minHeight={104}>
              <HeaderCell brand={brand} label={entry.label} />
            </StoryMatrixRowLabelCell>,
            ...documentedStates.map((state) => (
              <StoryMatrixValueCell key={`sizes-${entry.key}-${state.key}`} minHeight={104}>
                <MatrixCell
                  brand={brand}
                  size={entry.size}
                  {...(state.forceState ? { forceState: state.forceState } : {})}
                  {...(state.disabled ? { disabled: true } : {})}
                />
              </StoryMatrixValueCell>
            ))
          ])}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function PlaygroundStory(args: SocialButtonStoryArgs) {
  const { iconName, label, ...rest } = args;

  return (
    <SocialButton {...rest} icon={<Icon name={iconName} decorative />}>
      {label}
    </SocialButton>
  );
}

function LoginActionsStory({ brand = "Cars24" }: Pick<SocialButtonProps, "brand">) {
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const radiusXl = Number(getRequiredThemeTokenValue(brand, "radius.xl"));
  const spacing4 = Number(getRequiredThemeTokenValue(brand, "spacing.4"));
  const spacing6 = Number(getRequiredThemeTokenValue(brand, "spacing.6"));
  const spacing8 = Number(getRequiredThemeTokenValue(brand, "spacing.8"));

  return (
    <StoryPage>
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto"
        }}
      >
        <StoryCard>
          <div
            style={{
              display: "grid",
              gap: spacing6,
              padding: spacing8,
              border: `1px solid ${borderDefault}`,
              borderRadius: radiusXl,
              background: surfaceCanvas
            }}
          >
            <SectionHeader
              brand={brand}
              title="Log in"
              showSubtitle={false}
              showDescription
              description="Choose how you want to continue."
              showTag={false}
              showAction={false}
            />

            <div style={{ display: "grid", gap: spacing4 }}>
              <Button brand={brand} styleVariant="Solid" size="Large" style={{ width: "100%" }}>
                Login with mobile
              </Button>

              <Button brand={brand} styleVariant="Outline" size="Large" style={{ width: "100%" }}>
                Login with Email
              </Button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: spacing4,
                alignItems: "center"
              }}
            >
              <div style={{ height: 1, background: borderDefault }} />
              <Text brand={brand} as="span" size="sm" tone="secondary" style={{ color: textSecondary }}>
                or continue with
              </Text>
              <div style={{ height: 1, background: borderDefault }} />
            </div>

            <SocialButton brand={brand} size="Large" icon={<Icon name="google-icon" decorative />} style={{ width: "100%" }}>
              Login with Google
            </SocialButton>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const meta: Meta<SocialButtonStoryArgs> = {
  title: "Components/Buttons/Social Button",
  component: StorySocialButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    disabled: false,
    iconName: "google-icon",
    label: "Sign in with Google",
    size: "Large"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "radio",
      options: socialButtonSizes
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover"]
    },
    iconName: {
      control: "select",
      options: providerIcons
    }
  }
};

export default meta;

type Story = StoryObj<SocialButtonStoryArgs>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <SizesDocument brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: variantsSourceCode
      }
    }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <LoginActionsStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: `<SectionHeader
  title="Log in"
  showSubtitle={false}
  showDescription
  description="Choose how you want to continue."
  showTag={false}
  showAction={false}
/>

<Button styleVariant="Solid" size="Large">Login with mobile</Button>
<Button styleVariant="Outline" size="Large">Login with Email</Button>
<SocialButton size="Large" icon={<Icon name="google-icon" decorative />}>
  Login with Google
</SocialButton>`
      }
    }
  }
};
