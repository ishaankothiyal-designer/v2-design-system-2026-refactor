import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  ButtonGroup,
  Icon,
  Text,
  type ButtonGroupProps,
  type ButtonGroupSize,
  type ButtonGroupType,
  type ButtonShape
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type ButtonGroupStoryArgs = Omit<ButtonGroupProps, "primaryAction" | "secondaryAction" | "contextualAction"> & {
  primaryLabel: string;
  secondaryLabel: string;
  contextualPrompt: string;
  contextualLabel: string;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
  showSecondaryAction: boolean;
  showContextualAction: boolean;
};

const BUTTON_GROUP_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14353-33927&t=1zgOyFpiLYMyM4XM-11";

const buttonGroupTypes: ButtonGroupType[] = ["Vertical", "Horizontal", "Contextual Action"];
const buttonGroupSizes: ButtonGroupSize[] = ["Large", "Medium", "Small"];
const buttonShapes: ButtonShape[] = ["Regular", "Pill"];

function makeButtonIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="arrow-right-outline" decorative /> : undefined
  };
}

function PlaygroundStory({
  brand = "Cars24",
  type = "Vertical",
  size = "Large",
  shape = "Regular",
  onDark = false,
  primaryLabel,
  secondaryLabel,
  contextualPrompt,
  contextualLabel,
  showLeadingIcon,
  showTrailingIcon,
  showSecondaryAction,
  showContextualAction
}: ButtonGroupStoryArgs) {
  const buttonIcons = makeButtonIcons(showLeadingIcon, showTrailingIcon);
  const secondaryAction =
    showSecondaryAction && type !== "Contextual Action"
      ? {
          label: secondaryLabel,
          ...buttonIcons
        }
      : undefined;
  const contextualAction =
    showContextualAction && type === "Contextual Action"
      ? {
          prompt: contextualPrompt,
          label: contextualLabel,
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      : undefined;

  return (
    <div
      style={{
        background: onDark ? "#0F172A" : undefined,
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 408
      }}
    >
      <ButtonGroup
        brand={brand}
        onDark={onDark}
        shape={shape}
        size={size}
        type={type}
        primaryAction={{
          label: primaryLabel,
          ...buttonIcons
        }}
        {...(secondaryAction ? { secondaryAction } : {})}
        {...(contextualAction ? { contextualAction } : {})}
      />
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

function GroupMatrix({
  brand,
  type,
  onDark
}: {
  brand: DisplayBrandId;
  type: ButtonGroupType;
  onDark: boolean;
}) {
  const secondaryAction =
    type === "Contextual Action"
      ? undefined
      : {
          label: "Label",
          ...makeButtonIcons(true, true)
        };
  const contextualAction =
    type === "Contextual Action"
      ? {
          prompt: "Already a car owner?",
          label: "Add vehicle",
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      : undefined;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm" tone={onDark ? "inverse" : "primary"}>
        {type}
      </Text>
      <div style={matrixTableStyles(onDark)}>
        <div style={matrixCornerCellStyles(onDark)} />
        {buttonShapes.map((shape) => (
          <div key={`${type}-${shape}-header`} style={matrixHeaderCellStyles(onDark)}>
            <HeaderCell brand={brand} label={shape} tone={onDark ? "inverse" : "secondary"} />
          </div>
        ))}

        {buttonGroupSizes.flatMap((size) => [
          <div key={`${type}-${size}-label`} style={matrixRowLabelCellStyles(onDark)}>
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </div>,
          ...buttonShapes.map((shape) => (
            <div key={`${type}-${size}-${shape}`} style={matrixValueCellStyles(onDark)}>
              <div style={{ width: "100%", maxWidth: 360 }}>
                <ButtonGroup
                  brand={brand}
                  onDark={onDark}
                  shape={shape}
                  size={size}
                  type={type}
                  primaryAction={{
                    label: "Label",
                    ...makeButtonIcons(true, true)
                  }}
                  {...(secondaryAction ? { secondaryAction } : {})}
                  {...(contextualAction ? { contextualAction } : {})}
                />
              </div>
            </div>
          ))
        ])}
      </div>
    </div>
  );
}

function VariantDocumentSurface({ brand, onDark }: { brand: DisplayBrandId; onDark: boolean }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {buttonGroupTypes.map((type) => (
        <div
          key={`${type}-${onDark ? "dark" : "light"}`}
          style={{
            display: "grid",
            gap: 20,
            padding: 24,
            borderRadius: 24,
            border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
            background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
          }}
        >
          <GroupMatrix brand={brand} type={type} onDark={onDark} />
        </div>
      ))}
    </div>
  );
}

function BrandVariantMatrixStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 24 }}>
            <SectionHeading
              brand={brand}
              title="Button Group"
              description="Token-driven layouts composed from the existing Button and Link Button primitives."
            />
            <VariantDocumentSurface brand={brand} onDark={false} />
          </div>
        </StoryCard>

        <StoryCard
          style={{
            background: String(coreTokenCatalog.color.surface.inverse),
            borderRadius: 24,
            padding: 32
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            <SectionHeading
              brand={brand}
              title="On Dark Surface"
              description="The same full matrix rendered on inverse backgrounds for brand validation."
              tone="inverse"
            />
            <VariantDocumentSurface brand={brand} onDark />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function matrixTableStyles(onDark: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "180px repeat(2, minmax(320px, 1fr))",
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    overflow: "hidden"
  };
}

function matrixHeaderCellStyles(onDark: boolean): CSSProperties {
  return {
    minHeight: 68,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
  };
}

function matrixCornerCellStyles(onDark: boolean): CSSProperties {
  return {
    minHeight: 68,
    borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
  };
}

function matrixRowLabelCellStyles(onDark: boolean): CSSProperties {
  return {
    minHeight: 120,
    padding: "20px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
  };
}

function matrixValueCellStyles(onDark: boolean): CSSProperties {
  return {
    minHeight: 120,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
  };
}

const meta: Meta<ButtonGroupStoryArgs> = {
  title: "Components/Button Group",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BUTTON_GROUP_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    type: "Vertical",
    size: "Large",
    shape: "Regular",
    onDark: false,
    primaryLabel: "Label",
    secondaryLabel: "Label",
    contextualPrompt: "Already a car owner?",
    contextualLabel: "Add vehicle",
    showLeadingIcon: true,
    showTrailingIcon: true,
    showSecondaryAction: true,
    showContextualAction: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: buttonGroupTypes
    },
    size: {
      control: "inline-radio",
      options: buttonGroupSizes
    },
    shape: {
      control: "inline-radio",
      options: buttonShapes
    },
    onDark: {
      control: "boolean"
    },
    primaryLabel: {
      control: "text"
    },
    secondaryLabel: {
      control: "text"
    },
    contextualPrompt: {
      control: "text"
    },
    contextualLabel: {
      control: "text"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showTrailingIcon: {
      control: "boolean"
    },
    showSecondaryAction: {
      control: "boolean"
    },
    showContextualAction: {
      control: "boolean"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<ButtonGroupStoryArgs>;

const buttonGroupSourceCode = `import { ButtonGroup, Icon } from "@geist/web";

export function Example() {
  return (
    <ButtonGroup
      type="Horizontal"
      size="Large"
      shape="Regular"
      primaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
      secondaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
    />
  );
}`;

const contextualActionSourceCode = `import { ButtonGroup, Icon } from "@geist/web";

export function Example() {
  return (
    <ButtonGroup
      type="Contextual Action"
      size="Large"
      primaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
      contextualAction={{
        prompt: "Already a car owner?",
        label: "Add vehicle",
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
    />
  );
}`;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Cars24: Story = {
  render: () => <BrandVariantMatrixStory brand="Cars24" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: buttonGroupSourceCode } }
  }
};

export const TeamBHP: Story = {
  render: () => <BrandVariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: buttonGroupSourceCode } }
  }
};

export const CarInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: buttonGroupSourceCode } }
  }
};

export const VehicleInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: buttonGroupSourceCode } }
  }
};

export const ContextualActionExample: Story = {
  render: () => (
    <PlaygroundStory
      brand="Cars24"
      type="Contextual Action"
      size="Large"
      shape="Regular"
      onDark={false}
      primaryLabel="Label"
      secondaryLabel="Label"
      contextualPrompt="Already a car owner?"
      contextualLabel="Add vehicle"
      showLeadingIcon
      showTrailingIcon
      showSecondaryAction={false}
      showContextualAction
    />
  ),
  parameters: {
    layout: "centered",
    controls: { disable: true },
    docs: { source: { code: contextualActionSourceCode } }
  }
};
