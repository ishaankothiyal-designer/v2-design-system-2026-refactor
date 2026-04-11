import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Button,
  Icon,
  Text,
  type ButtonPreviewState,
  type ButtonProps,
  type ButtonShape,
  type ButtonSize,
  type ButtonStyleVariant
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

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

function VariantDocumentSurface({ brand, onDark }: { brand: DisplayBrandId; onDark: boolean }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {buttonStyles.map((styleVariant) => (
        <VariantDocumentSection key={`${styleVariant}-${onDark ? "dark" : "light"}`} brand={brand} styleVariant={styleVariant} onDark={onDark} />
      ))}
    </div>
  );
}

function VariantDocumentSection({
  brand,
  styleVariant,
  onDark
}: {
  brand: DisplayBrandId;
  styleVariant: ButtonStyleVariant;
  onDark: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 20,
        padding: 24,
        borderRadius: 24,
        border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
        background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
      }}
    >
      <SectionHeading brand={brand} title={styleVariant} tone={onDark ? "inverse" : "primary"} />
      <div style={{ display: "grid", gap: 20 }}>
        {buttonShapes.map((shape) => (
          <StateMatrix key={`${styleVariant}-${shape}-${onDark ? "dark" : "light"}`} brand={brand} shape={shape} styleVariant={styleVariant} onDark={onDark} />
        ))}
      </div>
    </div>
  );
}

function StateMatrix({
  brand,
  shape,
  styleVariant,
  onDark
}: {
  brand: DisplayBrandId;
  shape: ButtonShape;
  styleVariant: ButtonStyleVariant;
  onDark: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm" tone={onDark ? "inverse" : "primary"}>
        {shape}
      </Text>
      <div style={matrixTableStyles(onDark)}>
        <div style={matrixCornerCellStyles(onDark)} />
        {documentedStates.map((state) => (
          <div key={`${shape}-${styleVariant}-${state.key}-header`} style={matrixHeaderCellStyles(onDark)}>
            <HeaderCell brand={brand} label={state.label} tone={onDark ? "inverse" : "secondary"} />
          </div>
        ))}

        {buttonSizes.flatMap((size) => [
          <div key={`${shape}-${styleVariant}-${size}-label`} style={matrixRowLabelCellStyles(onDark)}>
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </div>,
          ...documentedStates.map((state) => (
            <div key={`${shape}-${styleVariant}-${size}-${state.key}`} style={matrixValueCellStyles(onDark)}>
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
            </div>
          ))
        ])}
      </div>
    </div>
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

function matrixTableStyles(onDark: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "180px repeat(4, minmax(180px, 1fr))",
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
    minHeight: 96,
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
    minHeight: 96,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
  };
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
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    shape: "Regular",
    styleVariant: "Solid",
    size: "Medium",
    onDark: false,
    loading: false,
    disabled: false,
    forceState: "Rest",
    label: "Label",
    showLeadingIcon: true,
    showTrailingIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    shape: {
      control: "inline-radio",
      options: buttonShapes
    },
    styleVariant: {
      control: "inline-radio",
      options: buttonStyles
    },
    size: {
      control: "select",
      options: buttonSizes
    },
    onDark: {
      control: "boolean"
    },
    loading: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    },
    forceState: {
      control: "inline-radio",
      options: previewStates
    },
    label: {
      control: "text"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showTrailingIcon: {
      control: "boolean"
    },
    tone: {
      table: {
        disable: true
      }
    }
  },
  render: ({ label, showLeadingIcon, showTrailingIcon, onDark, ...args }) => {
    const icons = makeIcons(showLeadingIcon && !args.loading, showTrailingIcon && !args.loading);
    const resolvedOnDark = Boolean(onDark);

    return (
      <div style={resolvedOnDark ? { background: "#0F172A", padding: 24, borderRadius: 16 } : undefined}>
        <Button {...args} onDark={resolvedOnDark} {...icons}>
          {label}
        </Button>
      </div>
    );
  }
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Cars24: Story = {
  render: () => <BrandVariantMatrixStory brand="Cars24" />,
  parameters: {
    controls: { disable: true }
  }
};

export const TeamBHP: Story = {
  render: () => <BrandVariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true }
  }
};

export const CarInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true }
  }
};

export const VehicleInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <ShapeAndStyleStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
