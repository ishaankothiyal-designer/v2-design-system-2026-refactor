import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@turbo/tokens";
import {
  SegmentButton,
  type SegmentButtonPreviewState,
  type SegmentButtonProps,
  type SegmentButtonSelectionColor,
  type SegmentButtonSize,
  type SegmentButtonType
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const SEGMENT_BUTTON_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=77-3858&t=1zgOyFpiLYMyM4XM-11";

const types: SegmentButtonType[] = ["Text", "Icon"];
const sizes: SegmentButtonSize[] = ["Default", "Large"];
const selectionColors: SegmentButtonSelectionColor[] = ["White", "Black", "Brand"];
const previewStates: SegmentButtonPreviewState[] = ["Default", "Hover/Pressed"];

type SegmentButtonStoryArgs = SegmentButtonProps;

function SectionHeading({
  brand,
  title,
  description
}: {
  brand: DisplayBrandId;
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <span style={{ color: String(coreTokenCatalog.color.text.primary), fontSize: 16, fontWeight: 600 }}>
        {title}
      </span>
      {description ? (
        <span style={{ color: String(coreTokenCatalog.color.text.secondary), fontSize: 14 }}>{description}</span>
      ) : null}
    </div>
  );
}

function HeaderCell({ label }: { label: string }) {
  return (
    <span style={{ color: String(coreTokenCatalog.color.text.secondary), display: "block", fontSize: 14, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function buildMatrixRows() {
  return [
    { selected: false, forceState: "Default" as const, selectionColor: "White" as const, disabled: false, label: "Rest / White" },
    { selected: false, forceState: "Hover/Pressed" as const, selectionColor: "White" as const, disabled: false, label: "Hover / White" },
    { selected: true, forceState: "Default" as const, selectionColor: "White" as const, disabled: false, label: "Selected / White" },
    { selected: true, forceState: "Default" as const, selectionColor: "Black" as const, disabled: false, label: "Selected / Black" },
    { selected: true, forceState: "Default" as const, selectionColor: "Brand" as const, disabled: false, label: "Selected / Brand" },
    { selected: false, forceState: "Default" as const, selectionColor: "Brand" as const, disabled: true, label: "Disabled / Brand" }
  ];
}

function MatrixCell({
  brand,
  buttonType,
  forceState,
  selected,
  selectionColor,
  disabled,
  size
}: {
  brand: DisplayBrandId;
  buttonType: SegmentButtonType;
  forceState: SegmentButtonPreviewState;
  selected: boolean;
  selectionColor: SegmentButtonSelectionColor;
  disabled: boolean;
  size: SegmentButtonSize;
}) {
  return (
    <SegmentButton
      aria-label={`${buttonType} ${size}`}
      brand={brand}
      disabled={disabled}
      forceState={forceState}
      iconName="placeholder-generate-outline"
      label="Label"
      selected={selected}
      selectionColor={selectionColor}
      size={size}
      type={buttonType}
    />
  );
}

function VariantMatrix({ brand }: { brand: DisplayBrandId }) {
  const rows = buildMatrixRows();

  return (
    <div style={matrixTableStyles()}>
      <div style={matrixCornerCellStyles} />
      {types.flatMap((buttonType) =>
        sizes.map((size) => (
          <div key={`${buttonType}-${size}-header`} style={matrixHeaderCellStyles}>
            <HeaderCell label={`${buttonType} / ${size}`} />
          </div>
        ))
      )}

      {rows.flatMap((row) => [
        <div key={`${row.label}-label`} style={matrixRowLabelCellStyles}>
          <HeaderCell label={row.label} />
        </div>,
        ...types.flatMap((buttonType) =>
          sizes.map((size) => (
            <div key={`${row.label}-${buttonType}-${size}`} style={matrixValueCellStyles}>
              <MatrixCell
                brand={brand}
                buttonType={buttonType}
                disabled={row.disabled}
                forceState={row.forceState}
                selected={row.selected}
                selectionColor={row.selectionColor}
                size={size}
              />
            </div>
          ))
        )
      ])}
    </div>
  );
}

function matrixTableStyles(): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: "180px repeat(4, minmax(180px, 1fr))",
    overflow: "hidden"
  };
}

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 68,
  padding: "16px 20px"
};

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 68
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 104,
  padding: "20px 16px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 104,
  padding: "16px 20px"
};

const meta: Meta<SegmentButtonStoryArgs> = {
  title: "Components/Tabs/Segment Button",
  component: SegmentButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SEGMENT_BUTTON_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    forceState: "Default",
    iconName: "placeholder-generate-outline",
    label: "Label",
    selected: false,
    selectionColor: "White",
    size: "Default",
    type: "Text"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: types
    },
    size: {
      control: "inline-radio",
      options: sizes
    },
    selectionColor: {
      control: "inline-radio",
      options: selectionColors
    },
    forceState: {
      control: "inline-radio",
      options: previewStates
    }
  }
};

export default meta;

type Story = StoryObj<SegmentButtonStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Segment Button variants"
            description="Item-level segmented-control matrix covering text and icon modes, Default and Large sizes, plus white, black, brand, hover, and disabled states from Figma."
          />
          <VariantMatrix brand={brand} />
        </div>
      </StoryCard>
    </StoryPage>
  ),
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
