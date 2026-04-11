import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  CaptionButton,
  Text,
  type CaptionButtonCaptionPosition,
  type CaptionButtonPreviewState,
  type CaptionButtonProps,
  type CaptionButtonSize,
  type CaptionButtonStyleVariant
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type CaptionButtonStoryArgs = Omit<CaptionButtonProps, "caption" | "children"> & {
  captionText: string;
  label: string;
};

const captionButtonSizes: CaptionButtonSize[] = ["Medium", "Large"];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: CaptionButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover / Pressed", forceState: "Hover/Pressed" },
  { key: "disabled", label: "Disabled", disabled: true }
];

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
  description
}: {
  brand?: DisplayBrandId;
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md">
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function MatrixCell({
  brand,
  captionPosition,
  disabled,
  forceState,
  size,
  styleVariant
}: {
  brand: DisplayBrandId;
  captionPosition: CaptionButtonCaptionPosition;
  disabled?: boolean;
  forceState?: CaptionButtonPreviewState;
  size: CaptionButtonSize;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <CaptionButton
      brand={brand}
      caption="Caption"
      captionPosition={captionPosition}
      size={size}
      styleVariant={styleVariant}
      {...(disabled ? { disabled: true } : {})}
      {...(forceState ? { forceState } : {})}
    >
      Primary Button
    </CaptionButton>
  );
}

function VariantMatrix({
  brand,
  captionPosition,
  styleVariant
}: {
  brand: DisplayBrandId;
  captionPosition: CaptionButtonCaptionPosition;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {styleVariant}
      </Text>
      <div style={matrixTableStyles()}>
        <div style={matrixCornerCellStyles} />
        {documentedStates.map((state) => (
          <div key={`${captionPosition}-${styleVariant}-${state.key}-header`} style={matrixHeaderCellStyles}>
            <HeaderCell brand={brand} label={state.label} />
          </div>
        ))}

        {captionButtonSizes.flatMap((size) => [
          <div key={`${captionPosition}-${styleVariant}-${size}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={size} />
          </div>,
          ...documentedStates.map((state) => (
            <div key={`${captionPosition}-${styleVariant}-${size}-${state.key}`} style={matrixValueCellStyles}>
              <MatrixCell
                brand={brand}
                captionPosition={captionPosition}
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

function CaptionPositionSection({
  brand,
  captionPosition
}: {
  brand: DisplayBrandId;
  captionPosition: CaptionButtonCaptionPosition;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 20,
        padding: 24,
        borderRadius: 24,
        border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
        background: String(coreTokenCatalog.color.surface.canvas)
      }}
    >
      <SectionHeading brand={brand} title={`Caption ${captionPosition}`} />
      <div style={{ display: "grid", gap: 20 }}>
        {(["Primary", "Secondary"] as const).map((styleVariant) => (
          <VariantMatrix
            key={`${captionPosition}-${styleVariant}`}
            brand={brand}
            captionPosition={captionPosition}
            styleVariant={styleVariant}
          />
        ))}
      </div>
    </div>
  );
}

function BrandVariantMatrixStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <StoryCard>
          <CaptionPositionSection brand={brand} captionPosition="Up" />
        </StoryCard>
        <StoryCard>
          <CaptionPositionSection brand={brand} captionPosition="Down" />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function PlaygroundStory(args: CaptionButtonStoryArgs) {
  const { captionText, label, ...rest } = args;

  return (
    <CaptionButton {...rest} caption={captionText}>
      {label}
    </CaptionButton>
  );
}

function matrixTableStyles(): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "180px repeat(3, minmax(220px, 1fr))",
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    overflow: "hidden"
  };
}

const matrixCornerCellStyles: CSSProperties = {
  minHeight: 68,
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.canvas)
};

const matrixHeaderCellStyles: CSSProperties = {
  minHeight: 68,
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.canvas)
};

const matrixRowLabelCellStyles: CSSProperties = {
  minHeight: 108,
  padding: "20px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.canvas)
};

const matrixValueCellStyles: CSSProperties = {
  minHeight: 108,
  padding: "16px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.canvas)
};

const meta: Meta<CaptionButtonStoryArgs> = {
  title: "Components/Caption Button",
  component: CaptionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    captionPosition: "Up",
    captionText: "Caption",
    disabled: false,
    label: "Primary Button",
    size: "Medium",
    styleVariant: "Primary"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    captionPosition: {
      control: "radio",
      options: ["Up", "Down"]
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover/Pressed"]
    },
    size: {
      control: "radio",
      options: captionButtonSizes
    },
    styleVariant: {
      control: "radio",
      options: ["Primary", "Secondary"]
    }
  }
};

export default meta;

type Story = StoryObj<CaptionButtonStoryArgs>;

const captionButtonVariantsSourceCode = `<CaptionButton caption="Caption" captionPosition="Up" size="Medium" styleVariant="Primary">
  Primary Button
</CaptionButton>
<CaptionButton caption="Caption" captionPosition="Up" size="Medium" styleVariant="Primary" forceState="Hover/Pressed">
  Primary Button
</CaptionButton>
<CaptionButton caption="Caption" captionPosition="Up" size="Medium" styleVariant="Primary" disabled>
  Primary Button
</CaptionButton>`;

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
    docs: { source: { code: captionButtonVariantsSourceCode } }
  }
};

export const TeamBHP: Story = {
  render: () => <BrandVariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: captionButtonVariantsSourceCode } }
  }
};

export const CarInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: captionButtonVariantsSourceCode } }
  }
};

export const VehicleInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true },
    docs: { source: { code: captionButtonVariantsSourceCode } }
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
