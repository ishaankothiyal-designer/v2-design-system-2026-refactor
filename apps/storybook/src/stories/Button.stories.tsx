import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Button,
  Icon,
  SectionHeader,
  SocialButton,
  Text,
  getRequiredThemeTokenValue,
  type ButtonCTA,
  type ButtonPreviewState,
  type ButtonProps,
  type ButtonShape,
  type ButtonSize,
  type ButtonStyleVariant
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
import { StoryCard, StoryPage, StoryPreviewSurface } from "../storybook-shell";

type ButtonStoryArgs = Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon"> & {
  label: string;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

const buttonShapes: ButtonShape[] = ["Regular", "Pill"];
const buttonStyles: ButtonStyleVariant[] = ["Solid", "Outline", "Ghost", "Transparent", "Destructive"];
const buttonSizes: ButtonSize[] = ["Extra Small", "Small", "Medium", "Large", "Extra Large"];
const previewStates: ButtonPreviewState[] = ["Rest", "Hover/Pressed"];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: ButtonPreviewState;
  disabled?: boolean;
  loading?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover / Pressed", forceState: "Hover/Pressed" },
  { key: "loading", label: "Loading", loading: true },
  { key: "disabled", label: "Disabled", disabled: true }
];

const BUTTON_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=215-254&t=1zgOyFpiLYMyM4XM-11";

// Figma node 215:254 exposes these top-level variant axes on the Button component.
const figmaBackedButtonControls = new Set<keyof ButtonStoryArgs>([
  "shape",
  "styleVariant",
  "size",
  "onDark",
  "loading",
  "disabled"
]);

function getButtonControlRemark(name: keyof ButtonStoryArgs | "brand" | "onClick") {
  return figmaBackedButtonControls.has(name as keyof ButtonStoryArgs) ? undefined : "Dev only";
}

function makeIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="chevron-small-right-filled" decorative /> : undefined
  };
}

function MatrixCell({
  brand,
  shape,
  size,
  styleVariant,
  onDark,
  forceState,
  disabled,
  loading
}: {
  brand: DisplayBrandId;
  shape: ButtonShape;
  size: ButtonSize;
  styleVariant: ButtonStyleVariant;
  onDark: boolean;
  forceState?: ButtonPreviewState;
  disabled?: boolean;
  loading?: boolean;
}) {
  const icons = makeIcons(!loading, !loading);
  const stateProps = {
    ...(forceState ? { forceState } : {}),
    ...(disabled ? { disabled: true } : {}),
    ...(loading ? { loading: true } : {})
  };

  return (
    <Button
      brand={brand}
      styleVariant={styleVariant}
      onDark={onDark}
      size={size}
      shape={shape}
      {...icons}
      {...stateProps}
    >
      Label
    </Button>
  );
}

function SectionHeading({
  brand = "Cars24",
  title,
  description,
  tone = "primary"
}: {
  brand?: DisplayBrandId;
  title: string;
  description?: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md" tone={tone}>
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone={tone === "inverse" ? "inverse" : "secondary"}>
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function HeaderCell({
  brand = "Cars24",
  label,
  tone = "secondary"
}: {
  brand?: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function StyleMatrix({
  brand,
  size,
  styleVariant,
  onDark = false
}: {
  brand: DisplayBrandId;
  size: ButtonSize;
  styleVariant: ButtonStyleVariant;
  onDark?: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm" tone={onDark ? "inverse" : "primary"}>
        {size}
      </Text>
      <StoryMatrix columns="180px repeat(4, minmax(180px, 1fr))" tone={onDark ? "inverse" : "canvas"}>
        <StoryMatrixCornerCell tone={onDark ? "inverse" : "canvas"} />
        {documentedStates.map((state) => (
          <StoryMatrixHeaderCell
            key={`${styleVariant}-${size}-${state.key}-header-${onDark ? "dark" : "light"}`}
            tone={onDark ? "inverse" : "canvas"}
          >
            <HeaderCell brand={brand} label={state.label} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixHeaderCell>
        ))}

        {buttonShapes.flatMap((shape) => [
          <StoryMatrixRowLabelCell
            key={`${styleVariant}-${size}-${shape}-label-${onDark ? "dark" : "light"}`}
            minHeight={104}
            tone={onDark ? "inverse" : "canvas"}
          >
            <HeaderCell brand={brand} label={shape} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixRowLabelCell>,
          ...documentedStates.map((state) => (
            <StoryMatrixValueCell
              key={`${styleVariant}-${size}-${shape}-${state.key}-${onDark ? "dark" : "light"}`}
              minHeight={104}
              tone={onDark ? "inverse" : "canvas"}
            >
              <MatrixCell
                brand={brand}
                shape={shape}
                size={size}
                styleVariant={styleVariant}
                onDark={onDark}
                {...(state.forceState ? { forceState: state.forceState } : {})}
                {...(state.disabled ? { disabled: true } : {})}
                {...(state.loading ? { loading: true } : {})}
              />
            </StoryMatrixValueCell>
          ))
        ])}
      </StoryMatrix>
    </div>
  );
}

function BrandStateDocument({
  brand,
  styleVariant,
  onDark = false
}: {
  brand: DisplayBrandId;
  styleVariant: ButtonStyleVariant;
  onDark?: boolean;
}) {
  return (
    <div style={{ display: "grid" }}>
      <div style={{ display: "grid", gap: 20 }}>
        {buttonSizes.map((size) => (
          <StyleMatrix
            key={`${brand}-${styleVariant}-${size}-${onDark ? "dark" : "light"}`}
            brand={brand}
            size={size}
            styleVariant={styleVariant}
            onDark={onDark}
          />
        ))}
      </div>
    </div>
  );
}

function buildButtonStyleSourceCode(styleVariant: ButtonStyleVariant) {
  return `import { Button, Icon } from "@geist/web";

<Button
  brand="Cars24"
  styleVariant="${styleVariant}"
  shape="Regular"
  size="Medium"
  leadingIcon={<Icon name="sparkle-filled" decorative />}
  trailingIcon={<Icon name="chevron-small-right-filled" decorative />}
>
  Label
</Button>

<Button
  brand="Cars24"
  styleVariant="${styleVariant}"
  shape="Regular"
  size="Medium"
  onDark
  leadingIcon={<Icon name="sparkle-filled" decorative />}
  trailingIcon={<Icon name="chevron-small-right-filled" decorative />}
>
  Label
</Button>`;
}

function StyleDocument({
  styleVariant,
  brand = "Cars24"
}: {
  styleVariant: ButtonStyleVariant;
  brand?: DisplayBrandId;
}) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 20 }}>
          <SectionHeading brand={brand} title="Light" />
          <BrandStateDocument brand={brand} styleVariant={styleVariant} />
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <SectionHeading brand={brand} title="Inverse" tone="inverse" />
          <BrandStateDocument brand={brand} styleVariant={styleVariant} onDark />
        </div>
      </div>
    </StoryPage>
  );
}

function SizeScaleStory() {
  const icons = makeIcons(true, true);

  return (
    <StoryPage>
      <div style={{ display: "grid", gap: 24 }}>
        <StoryCard>
          <SectionHeading title="Regular" />
          <div style={sizeGridStyles}>
            {buttonSizes.map((size) => (
              <div key={`regular-${size}`} style={{ display: "grid", gap: 12 }}>
                <Text brand="Cars24" as="strong" size="sm">
                  {size}
                </Text>
                <Button size={size} styleVariant="Solid" shape="Regular" {...icons}>
                  Label
                </Button>
              </div>
            ))}
          </div>
        </StoryCard>

        <StoryCard>
          <SectionHeading title="Pill" />
          <div style={sizeGridStyles}>
            {buttonSizes.map((size) => (
              <div key={`pill-${size}`} style={{ display: "grid", gap: 12 }}>
                <Text brand="Cars24" as="strong" size="sm">
                  {size}
                </Text>
                <Button size={size} styleVariant="Solid" shape="Pill" {...icons}>
                  Label
                </Button>
              </div>
            ))}
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function ShapeAndStyleStory({ brand = "Cars24" }: Pick<ButtonProps, "brand">) {
  const icons = makeIcons(true, true);

  return (
    <StoryPage>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Shape and Style"
            description="Quick QA surface for regular and pill buttons across all styles."
          />
          <div style={shapeGridStyles}>
            <HeaderCell brand={brand} label="Shape" />
            {buttonStyles.map((styleVariant) => (
              <HeaderCell key={styleVariant} brand={brand} label={styleVariant} />
            ))}

            {buttonShapes.flatMap((shape) => [
              <HeaderCell key={`${shape}-shape`} brand={brand} label={shape} />,
              ...buttonStyles.map((styleVariant) => (
                <Button
                  key={`${shape}-${styleVariant}`}
                  brand={brand}
                  shape={shape}
                  styleVariant={styleVariant}
                  size="Medium"
                  {...icons}
                >
                  Label
                </Button>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function LoginActionsStory({ brand = "Cars24" }: Pick<ButtonProps, "brand">) {
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

            <SocialButton
              brand={brand}
              size="Large"
              icon={<Icon name="google-icon" decorative />}
              style={{ width: "100%" }}
            >
              Login with Google
            </SocialButton>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const sizeGridStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  rowGap: 20
};

const shapeGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 16,
  display: "grid",
  gridTemplateColumns: "140px repeat(5, minmax(0, 1fr))",
  rowGap: 16
};

const meta: Meta<ButtonStoryArgs> = {
  title: "Components/Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BUTTON_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    cta: {
      variant: "primary",
      text: "Primary Button"
    } satisfies ButtonCTA,
    shape: "Regular",
    styleVariant: "Solid",
    size: "Medium",
    onDark: false,
    loading: false,
    disabled: false,
    tabIndex: 0,
    forceState: "Rest",
    label: "Label",
    showLeadingIcon: true,
    showTrailingIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS,
      table: {
        remark: getButtonControlRemark("brand")
      }
    },
    cta: {
      control: "object",
      description: "Call-to-action configuration containing visual and content properties.",
      table: {
        remark: getButtonControlRemark("cta")
      }
    },
    shape: {
      control: "inline-radio",
      options: buttonShapes,
      table: {
        remark: getButtonControlRemark("shape")
      }
    },
    styleVariant: {
      control: "inline-radio",
      options: buttonStyles,
      table: {
        remark: getButtonControlRemark("styleVariant")
      }
    },
    size: {
      control: "select",
      options: buttonSizes,
      table: {
        remark: getButtonControlRemark("size")
      }
    },
    onDark: {
      control: "boolean",
      table: {
        remark: getButtonControlRemark("onDark")
      }
    },
    loading: {
      control: "boolean",
      table: {
        remark: getButtonControlRemark("loading")
      }
    },
    disabled: {
      control: "boolean",
      table: {
        remark: getButtonControlRemark("disabled")
      }
    },
    onClick: {
      action: "clicked",
      description: "Click handler - receives DOM event as first parameter.",
      table: {
        remark: getButtonControlRemark("onClick")
      }
    },
    tabIndex: {
      control: { type: "number" },
      description: "Tab index",
      table: {
        remark: getButtonControlRemark("tabIndex")
      }
    },
    forceState: {
      control: "inline-radio",
      options: previewStates,
      table: {
        remark: getButtonControlRemark("forceState")
      }
    },
    label: {
      control: "text",
      table: {
        remark: getButtonControlRemark("label")
      }
    },
    showLeadingIcon: {
      control: "boolean",
      table: {
        remark: getButtonControlRemark("showLeadingIcon")
      }
    },
    showTrailingIcon: {
      control: "boolean",
      table: {
        remark: getButtonControlRemark("showTrailingIcon")
      }
    },
    tone: {
      table: {
        disable: true
      }
    }
  },
  render: ({ label, showLeadingIcon, showTrailingIcon, onDark, cta, ...args }) => {
    const icons = makeIcons(showLeadingIcon && !args.loading, showTrailingIcon && !args.loading);
    const resolvedOnDark = Boolean(onDark);
    const resolvedCta = cta ? { ...cta, text: cta.text ?? label } : undefined;

    return (
      <StoryPreviewSurface onDark={resolvedOnDark}>
        <Button {...args} cta={resolvedCta} onDark={resolvedOnDark} {...icons}>
          {resolvedCta ? undefined : label}
        </Button>
      </StoryPreviewSurface>
    );
  }
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

const buttonUiExampleSourceCode = `<SectionHeader
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
</SocialButton>`;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Solid: Story = {
  render: ({ brand = "Cars24" }) => <StyleDocument styleVariant="Solid" brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildButtonStyleSourceCode("Solid") } }
  }
};

export const Outline: Story = {
  render: ({ brand = "Cars24" }) => <StyleDocument styleVariant="Outline" brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildButtonStyleSourceCode("Outline") } }
  }
};

export const Ghost: Story = {
  render: ({ brand = "Cars24" }) => <StyleDocument styleVariant="Ghost" brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildButtonStyleSourceCode("Ghost") } }
  }
};

export const Transparent: Story = {
  render: ({ brand = "Cars24" }) => <StyleDocument styleVariant="Transparent" brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildButtonStyleSourceCode("Transparent") } }
  }
};

export const Destructive: Story = {
  render: ({ brand = "Cars24" }) => <StyleDocument styleVariant="Destructive" brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildButtonStyleSourceCode("Destructive") } }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <LoginActionsStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: buttonUiExampleSourceCode } }
  }
};
