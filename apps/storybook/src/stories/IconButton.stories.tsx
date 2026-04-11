import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  IconButton,
  Text,
  type IconButtonPreviewState,
  type IconButtonProps,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonStyleVariant
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type IconButtonStoryArgs = Omit<IconButtonProps, "icon"> & {
  iconName: "plus-large-filled";
};

const iconButtonSizes: IconButtonSize[] = ["Large", "Medium", "Small", "XSmall", "XXSmall", "XXXSmall"];
const iconButtonShapes: IconButtonShape[] = ["Regular", "Round"];
const styleVariants: IconButtonStyleVariant[] = [
  "Solid - Primary",
  "Solid - Black",
  "Outline - Primary",
  "Outline - Black",
  "Subtle - Primary",
  "Subtle - Black",
  "Ghost - Brand",
  "Ghost - Black",
  "Transparent"
];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: IconButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover / Pressed", forceState: "Hover/Pressed" },
  { key: "disabled", label: "Disabled", disabled: true }
];

function StoryIconButton({ iconName, ...rest }: IconButtonStoryArgs) {
  return <IconButton {...rest} icon={<Icon name={iconName} decorative />} />;
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

function MatrixCell({
  brand,
  disabled,
  forceState,
  onDark,
  shape,
  size,
  styleVariant
}: {
  brand: DisplayBrandId;
  disabled?: boolean;
  forceState?: IconButtonPreviewState;
  onDark: boolean;
  shape: IconButtonShape;
  size: IconButtonSize;
  styleVariant: IconButtonStyleVariant;
}) {
  return (
    <IconButton
      aria-label="Add item"
      brand={brand}
      icon={<Icon name="plus-large-filled" decorative />}
      onDark={onDark}
      shape={shape}
      size={size}
      styleVariant={styleVariant}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    />
  );
}

function ShapeMatrix({
  brand,
  onDark,
  shape,
  styleVariant
}: {
  brand: DisplayBrandId;
  onDark: boolean;
  shape: IconButtonShape;
  styleVariant: IconButtonStyleVariant;
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

        {iconButtonSizes.flatMap((size) => [
          <div key={`${shape}-${styleVariant}-${size}-label`} style={matrixRowLabelCellStyles(onDark)}>
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </div>,
          ...documentedStates.map((state) => (
            <div key={`${shape}-${styleVariant}-${size}-${state.key}`} style={matrixValueCellStyles(onDark)}>
              <MatrixCell
                brand={brand}
                onDark={onDark}
                shape={shape}
                size={size}
                styleVariant={styleVariant}
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
      {styleVariants.map((styleVariant) => (
        <div
          key={`${styleVariant}-${onDark ? "dark" : "light"}`}
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
            {iconButtonShapes.map((shape) => (
              <ShapeMatrix
                key={`${styleVariant}-${shape}-${onDark ? "dark" : "light"}`}
                brand={brand}
                onDark={onDark}
                shape={shape}
                styleVariant={styleVariant}
              />
            ))}
          </div>
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

function PlaygroundStory(args: IconButtonStoryArgs) {
  const { iconName, ...rest } = args;

  return (
    <div style={rest.onDark ? { background: "#0A0A0A", padding: 24, borderRadius: 16 } : undefined}>
      <IconButton {...rest} icon={<Icon name={iconName} decorative />} />
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

const meta: Meta<IconButtonStoryArgs> = {
  title: "Components/Icon Button",
  component: StoryIconButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    "aria-label": "Add item",
    brand: "Cars24",
    disabled: false,
    iconName: "plus-large-filled",
    onDark: false,
    shape: "Regular",
    size: "Medium",
    styleVariant: "Solid - Primary"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover/Pressed"]
    },
    shape: {
      control: "radio",
      options: iconButtonShapes
    },
    size: {
      control: "radio",
      options: iconButtonSizes
    },
    styleVariant: {
      control: "select",
      options: [...styleVariants]
    }
  }
};

export default meta;

type Story = StoryObj<IconButtonStoryArgs>;

const iconButtonVariantsSourceCode = `<IconButton aria-label="Add item" icon={<Icon name="plus-large-filled" decorative />} size="Medium" styleVariant="Solid - Primary" />
<IconButton aria-label="Add item" icon={<Icon name="plus-large-filled" decorative />} size="Medium" styleVariant="Solid - Primary" forceState="Hover/Pressed" />
<IconButton aria-label="Add item" icon={<Icon name="plus-large-filled" decorative />} size="Medium" styleVariant="Solid - Primary" disabled />`;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Cars24: Story = {
  render: () => <BrandVariantMatrixStory brand="Cars24" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: iconButtonVariantsSourceCode } }
  }
};

export const TeamBHP: Story = {
  render: () => <BrandVariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: iconButtonVariantsSourceCode } }
  }
};

export const CarInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: iconButtonVariantsSourceCode } }
  }
};

export const VehicleInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: iconButtonVariantsSourceCode } }
  }
};

export const UIExample: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    }
  }
};
