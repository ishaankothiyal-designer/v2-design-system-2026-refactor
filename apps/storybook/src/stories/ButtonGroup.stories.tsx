import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@turbo/tokens";
import {
  ButtonGroup,
  Icon,
  Text,
  type ButtonGroupProps,
  type ButtonGroupSize,
  type ButtonGroupType,
  type ButtonShape
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage, StoryPreviewSurface } from "../storybook-shell";

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
const buttonGroupSizes: ButtonGroupSize[] = ["Small", "Medium", "Large"];
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
    <StoryPreviewSurface onDark={onDark}>
      <div style={{ width: "100%", maxWidth: 408 }}>
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
    </StoryPreviewSurface>
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
  size,
  type,
  onDark
}: {
  brand: DisplayBrandId;
  size: ButtonGroupSize;
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
        {size}
      </Text>
      <StoryMatrix columns="180px repeat(2, minmax(320px, 1fr))" tone={onDark ? "inverse" : "canvas"}>
        <StoryMatrixCornerCell tone={onDark ? "inverse" : "canvas"} />
        {buttonShapes.map((shape) => (
          <StoryMatrixHeaderCell key={`${type}-${size}-${shape}-header`} tone={onDark ? "inverse" : "canvas"}>
            <HeaderCell brand={brand} label={shape} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixHeaderCell>
        ))}

        {[
          <StoryMatrixRowLabelCell key={`${type}-${size}-label`} minHeight={120} tone={onDark ? "inverse" : "canvas"}>
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixRowLabelCell>,
          ...buttonShapes.map((shape) => (
            <StoryMatrixValueCell
              key={`${type}-${size}-${shape}-${onDark ? "dark" : "light"}`}
              minHeight={120}
              tone={onDark ? "inverse" : "canvas"}
            >
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
            </StoryMatrixValueCell>
          ))
        ]}
      </StoryMatrix>
    </div>
  );
}

function VariantDocumentSurface({
  brand,
  type,
  onDark
}: {
  brand: DisplayBrandId;
  type: ButtonGroupType;
  onDark: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {buttonGroupSizes.map((size) => (
        <div
          key={`${type}-${size}-${onDark ? "dark" : "light"}`}
          style={{
            display: "grid",
            gap: 20
          }}
        >
          <GroupMatrix brand={brand} size={size} type={type} onDark={onDark} />
        </div>
      ))}
    </div>
  );
}

function TypeDocument({
  brand,
  type,
  onDark = false
}: {
  brand: DisplayBrandId;
  type: ButtonGroupType;
  onDark?: boolean;
}) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <VariantDocumentSurface brand={brand} type={type} onDark={onDark} />
      </StoryCard>
    </StoryPage>
  );
}

const meta: Meta<ButtonGroupStoryArgs> = {
  title: "Components/Buttons/Button Group",
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

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

function buildButtonGroupTypeSourceCode(type: ButtonGroupType) {
  const secondaryAction =
    type === "Contextual Action"
      ? ""
      : `
  secondaryAction={{
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}`;

  const contextualAction =
    type === "Contextual Action"
      ? `
  contextualAction={{
    prompt: "Already a car owner?",
    label: "Add vehicle",
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}`
      : "";

  return `import { ButtonGroup, Icon } from "@turbo/web";

<ButtonGroup
  brand="Cars24"
  type="${type}"
  size="Large"
  shape="Regular"
  primaryAction={{
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}
${secondaryAction}${contextualAction}
/>

<ButtonGroup
  brand="Cars24"
  type="${type}"
  size="Large"
  shape="Regular"
  onDark
  primaryAction={{
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }}
${secondaryAction}${contextualAction}
/>`;
}

export const Vertical: Story = {
  render: ({ brand = "Cars24", onDark = false }) => <TypeDocument brand={brand} type="Vertical" onDark={onDark} />,
  parameters: {
    controls: { include: ["brand", "onDark"] },
    docs: { source: { code: buildButtonGroupTypeSourceCode("Vertical") } }
  }
};

export const Horizontal: Story = {
  render: ({ brand = "Cars24", onDark = false }) => <TypeDocument brand={brand} type="Horizontal" onDark={onDark} />,
  parameters: {
    controls: { include: ["brand", "onDark"] },
    docs: { source: { code: buildButtonGroupTypeSourceCode("Horizontal") } }
  }
};

export const ContextualAction: Story = {
  name: "Contextual Action",
  render: ({ brand = "Cars24", onDark = false }) => (
    <TypeDocument brand={brand} type="Contextual Action" onDark={onDark} />
  ),
  parameters: {
    controls: { include: ["brand", "onDark"] },
    docs: { source: { code: buildButtonGroupTypeSourceCode("Contextual Action") } }
  }
};
