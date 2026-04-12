import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  LinkButton,
  Text,
  type LinkButtonPreviewState,
  type LinkButtonProps,
  type LinkButtonSize,
  type LinkButtonTone
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type LinkButtonStoryArgs = Omit<LinkButtonProps, "children" | "leadingIcon" | "trailingIcon"> & {
  label: string;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

const linkButtonSizes: LinkButtonSize[] = ["Extra Small", "Small", "Medium", "Large"];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: LinkButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover", forceState: "Hover" },
  { key: "disabled", label: "Disabled", disabled: true }
];

function makeIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="arrow-right-outline" decorative /> : undefined
  };
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

function MatrixCell({
  brand,
  tone,
  size,
  onDark,
  forceState,
  disabled
}: {
  brand: DisplayBrandId;
  tone: LinkButtonTone;
  size: LinkButtonSize;
  onDark: boolean;
  forceState?: LinkButtonPreviewState;
  disabled?: boolean;
}) {
  return (
    <LinkButton
      brand={brand}
      tone={tone}
      size={size}
      onDark={onDark}
      {...makeIcons(true, true)}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    >
      Label
    </LinkButton>
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

function ToneMatrix({
  brand,
  tone,
  onDark
}: {
  brand: DisplayBrandId;
  tone: LinkButtonTone;
  onDark: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm" tone={onDark ? "inverse" : "primary"}>
        {tone}
      </Text>
      <div style={matrixTableStyles(onDark)}>
        <div style={matrixCornerCellStyles(onDark)} />
        {documentedStates.map((state) => (
          <div key={`${tone}-${state.key}-header`} style={matrixHeaderCellStyles(onDark)}>
            <HeaderCell brand={brand} label={state.label} tone={onDark ? "inverse" : "secondary"} />
          </div>
        ))}

        {linkButtonSizes.flatMap((size) => [
          <div key={`${tone}-${size}-label`} style={matrixRowLabelCellStyles(onDark)}>
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </div>,
          ...documentedStates.map((state) => (
            <div key={`${tone}-${size}-${state.key}`} style={matrixValueCellStyles(onDark)}>
              <MatrixCell
                brand={brand}
                tone={tone}
                size={size}
                onDark={onDark}
                {...(state.forceState ? { forceState: state.forceState } : {})}
                {...(state.disabled ? { disabled: true } : {})}
              />
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
      {(["Brand", "Black"] as const).map((tone) => (
        <div
          key={`${tone}-${onDark ? "dark" : "light"}`}
          style={{
            display: "grid",
            gap: 20,
            padding: 24,
            borderRadius: 24,
            border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
            background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
          }}
        >
          <ToneMatrix brand={brand} tone={tone} onDark={onDark} />
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
          <VariantDocumentSurface brand={brand} onDark={false} />
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
              description="The same complete matrix on inverse backgrounds for contrast validation."
              tone="inverse"
            />
            <VariantDocumentSurface brand={brand} onDark />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function ConfigurationStory(args: LinkButtonStoryArgs) {
  const { label, showLeadingIcon, showTrailingIcon, onDark, ...rest } = args;
  const resolvedOnDark = Boolean(onDark);

  return (
    <div style={resolvedOnDark ? { background: "#0B0B0C", padding: 24, borderRadius: 16 } : undefined}>
      <LinkButton {...rest} onDark={resolvedOnDark} {...makeIcons(showLeadingIcon, showTrailingIcon)}>
        {label}
      </LinkButton>
    </div>
  );
}

function matrixTableStyles(onDark: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "180px repeat(3, minmax(180px, 1fr))",
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
    minHeight: 88,
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
    minHeight: 88,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
  };
}

const meta: Meta<LinkButtonStoryArgs> = {
  title: "Components/Buttons/Link Button",
  component: LinkButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    tone: "Brand",
    size: "Medium",
    onDark: false,
    underline: true,
    disabled: false,
    label: "Label",
    showLeadingIcon: true,
    showTrailingIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    tone: {
      control: "radio",
      options: ["Brand", "Black"]
    },
    size: {
      control: "radio",
      options: linkButtonSizes
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover"]
    }
  }
};

export default meta;

type Story = StoryObj<LinkButtonStoryArgs>;

const linkButtonVariantsSourceCode = `<LinkButton tone="Brand" size="Medium">Label</LinkButton>
<LinkButton tone="Brand" size="Medium" forceState="Hover">Label</LinkButton>
<LinkButton tone="Brand" size="Medium" disabled>Label</LinkButton>
<LinkButton tone="Black" size="Medium">Label</LinkButton>`;

const linkButtonUiExampleSourceCode = `<LinkButton tone="Brand" size="Small">Privacy statement</LinkButton>`;

export const Playground: Story = {
  render: (args) => <ConfigurationStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Cars24: Story = {
  render: () => <BrandVariantMatrixStory brand="Cars24" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: linkButtonVariantsSourceCode } }
  }
};

export const TeamBHP: Story = {
  render: () => <BrandVariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: linkButtonVariantsSourceCode } }
  }
};

export const CarInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: linkButtonVariantsSourceCode } }
  }
};

export const VehicleInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: linkButtonVariantsSourceCode } }
  }
};

export const UIExample: Story = {
  render: (args) => <ConfigurationStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: linkButtonUiExampleSourceCode } }
  }
};
