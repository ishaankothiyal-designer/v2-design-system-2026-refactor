import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  Banner,
  Button,
  LinkButton,
  SectionHeader,
  Text,
  TextInput,
  getRequiredThemeTokenValue,
  type BannerActionType,
  type BannerProps,
  type BannerState,
  type BannerTheme
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixSection,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

const bannerStates: BannerState[] = ["Warning", "Success", "Error", "Info", "Brand"];
const bannerThemes: BannerTheme[] = ["Light", "Dark"];
const actionTypes: BannerActionType[] = ["Text button", "Icon button"];

const BANNER_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=831-8218&t=1zgOyFpiLYMyM4XM-11";

function VariantCell({
  brand,
  theme,
  heading,
  actionType,
  state
}: {
  brand: NonNullable<BannerProps["brand"]>;
  theme: BannerTheme;
  heading: boolean;
  actionType: BannerActionType;
  state: BannerState;
}) {
  return (
    <Banner
      brand={brand}
      theme={theme}
      state={state}
      actionType={actionType}
      heading={heading}
      title="New Message Alert"
      description="New message received!"
    />
  );
}

function HeaderCell({
  brand,
  label,
  tone = "secondary"
}: {
  brand: NonNullable<BannerProps["brand"]>;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function BannerMatrixStory({
  brand = "Cars24",
  heading
}: {
  brand?: NonNullable<BannerProps["brand"]>;
  heading: boolean;
}) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        {actionTypes.map((actionType) => (
          <StoryCard key={actionType}>
            <StoryMatrixSection>
              <Text brand={brand} as="strong" size="md" style={{ display: "block" }}>
                {actionType}
              </Text>
              <StoryMatrix columns="180px repeat(2, minmax(320px, 1fr))">
                <StoryMatrixCornerCell />
                <StoryMatrixHeaderCell>
                  <HeaderCell brand={brand} label="Light" />
                </StoryMatrixHeaderCell>
                <StoryMatrixHeaderCell>
                  <HeaderCell brand={brand} label="Dark" />
                </StoryMatrixHeaderCell>

                {bannerStates.flatMap((state) => [
                  <StoryMatrixRowLabelCell key={`${actionType}-${state}-label`} minHeight={148}>
                    <HeaderCell brand={brand} label={state} />
                  </StoryMatrixRowLabelCell>,
                  <StoryMatrixValueCell key={`${actionType}-${state}-light`} minHeight={148}>
                    <VariantCell
                      brand={brand}
                      actionType={actionType}
                      state={state}
                      theme="Light"
                      heading={heading}
                    />
                  </StoryMatrixValueCell>,
                  <StoryMatrixValueCell key={`${actionType}-${state}-dark`} minHeight={148}>
                    <VariantCell
                      brand={brand}
                      actionType={actionType}
                      state={state}
                      theme="Dark"
                      heading={heading}
                    />
                  </StoryMatrixValueCell>
                ])}
              </StoryMatrix>
            </StoryMatrixSection>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

function ContactChoice({
  brand,
  label,
  selected = false
}: {
  brand: NonNullable<BannerProps["brand"]>;
  label: string;
  selected?: boolean;
}) {
  const brandPrimary = String(getRequiredThemeTokenValue(brand, "color.brand.primary.600"));
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        minHeight: 28
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          boxSizing: "border-box",
          border: `1.5px solid ${selected ? brandPrimary : borderDefault}`,
          display: "grid",
          placeItems: "center"
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: selected ? brandPrimary : "transparent"
          }}
        />
      </div>
      <Text brand={brand} as="span" size="md" style={{ color: textPrimary }}>
        {label}
      </Text>
    </div>
  );
}

function SignupFormStory({ brand = "Cars24" }: Pick<BannerProps, "brand">) {
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const radiusXl = Number(getRequiredThemeTokenValue(brand, "radius.xl"));
  const spacing4 = Number(getRequiredThemeTokenValue(brand, "spacing.4"));
  const spacing5 = Number(getRequiredThemeTokenValue(brand, "spacing.5"));
  const spacing6 = Number(getRequiredThemeTokenValue(brand, "spacing.6"));
  const spacing8 = Number(getRequiredThemeTokenValue(brand, "spacing.8"));

  return (
    <StoryPage>
      <div
        style={{
          width: "100%",
          maxWidth: 460,
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
              title="Sign up"
              showSubtitle={false}
              showDescription
              description="All fields are required."
              showTag={false}
              showAction={false}
            />

            <Banner
              brand={brand}
              theme="Light"
              state="Warning"
              heading={false}
              action={false}
              description="Fix errors to proceed with signup"
              style={{ width: "100%" }}
            />

            <div style={{ display: "grid", gap: spacing5 }}>
              <TextInput
                brand={brand}
                size="Large"
                label="First and last name"
                required
                validationState="Error"
                helperTone="Error"
                helperText="Enter a valid name: John Smith"
                placeholder=""
                suffixIconName="error-outline"
              />

              <TextInput
                brand={brand}
                size="Large"
                label="Phone number"
                required
                type="tel"
                validationState="Error"
                helperTone="Error"
                helperText="Enter a valid number: (555) 123-4567"
                placeholder=""
                suffixIconName="error-outline"
              />

              <TextInput
                brand={brand}
                size="Large"
                label="Email address"
                required
                type="email"
                validationState="Error"
                helperTone="Error"
                helperText="Enter a valid email: name@company.com"
                placeholder=""
                suffixIconName="error-outline"
              />
            </div>

            <div style={{ display: "grid", gap: spacing4 }}>
              <Text brand={brand} as="strong" size="md" style={{ color: textPrimary, display: "block" }}>
                How can we contact you? <span style={{ color: textSecondary }}>*</span>
              </Text>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: spacing6
                }}
              >
                <ContactChoice brand={brand} label="Phone" />
                <ContactChoice brand={brand} label="Email" />
                <ContactChoice brand={brand} label="Do not" selected />
              </div>
            </div>

            <div
              style={{
                width: "100%"
              }}
            >
              <Button brand={brand} styleVariant="Solid" size="Medium" style={{ width: "100%" }}>
                Submit
              </Button>
            </div>

            <div>
              <LinkButton brand={brand} tone="Brand" size="Small">
                Privacy statement
              </LinkButton>
            </div>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const meta: Meta<BannerProps> = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BANNER_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    theme: "Light",
    state: "Warning",
    heading: true,
    icon: true,
    action: true,
    actionType: "Text button",
    title: "New Message Alert",
    description: "New message received!",
    actionLabel: "Label"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    theme: {
      control: "inline-radio",
      options: bannerThemes
    },
    state: {
      control: "inline-radio",
      options: bannerStates
    },
    heading: {
      control: "boolean"
    },
    icon: {
      control: "boolean"
    },
    action: {
      control: "boolean"
    },
    actionType: {
      control: "inline-radio",
      options: actionTypes
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    actionLabel: {
      control: "text"
    },
    onActionClick: {
      action: "action click"
    },
    onDismiss: {
      action: "dismiss"
    }
  },
  render: (args) => <Banner {...args} />
};

export default meta;

type Story = StoryObj<BannerProps>;

const bannerWithHeadingSourceCode = `<Banner
  theme="Light"
  state="Warning"
  actionType="Text button"
  heading
  title="New Message Alert"
  description="New message received!"
/>`;

const bannerNoHeadingSourceCode = `<Banner
  theme="Light"
  state="Warning"
  actionType="Text button"
  heading={false}
  description="New message received!"
/>`;

const bannerUiExampleSourceCode = `<SectionHeader
  title="Sign up"
  showSubtitle={false}
  showDescription
  description="All fields are required."
  showTag={false}
  showAction={false}
/>

<Banner state="Warning" heading={false} action={false} description="Fix errors to proceed with signup" />
<TextInput label="First and last name" validationState="Error" helperText="Enter a valid name: John Smith" />
<Button styleVariant="Solid" size="Medium">Submit</Button>`;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const WithHeading: Story = {
  render: ({ brand = "Cars24" }) => <BannerMatrixStory brand={brand} heading />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: bannerWithHeadingSourceCode } }
  }
};

export const NoHeading: Story = {
  render: ({ brand = "Cars24" }) => <BannerMatrixStory brand={brand} heading={false} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: bannerNoHeadingSourceCode } }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <SignupFormStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: bannerUiExampleSourceCode } }
  }
};
