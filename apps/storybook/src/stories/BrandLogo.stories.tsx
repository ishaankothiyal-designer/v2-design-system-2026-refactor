import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BrandLogo, Text, type BrandLogoProps, type BrandLogoType } from "@turbo/web";
import { coreTokenCatalog } from "@turbo/tokens";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage, StoryPreviewSurface } from "../storybook-shell";

const BRAND_LOGO_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=12125-23339&p=f&t=1zgOyFpiLYMyM4XM-11";

const brands: NonNullable<BrandLogoProps["brand"]>[] = ["Cars24", "VehicleInfo", "CarInfo", "Team BHP"];
const types: BrandLogoType[] = ["Logo", "Symbol"];

function CellLabel({
  label,
  onDark
}: {
  label: string;
  onDark: boolean;
}) {
  return (
    <Text
      brand="Cars24"
      as="strong"
      size="sm"
      tone={onDark ? "inverse" : "secondary"}
      style={{ display: "block" }}
    >
      {label}
    </Text>
  );
}

function Matrix({ onDark }: { onDark: boolean }) {
  return (
    <StoryMatrix columns="minmax(140px, 180px) minmax(260px, 1fr) minmax(120px, 180px)" tone={onDark ? "inverse" : "canvas"}>
      <StoryMatrixCornerCell tone={onDark ? "inverse" : "canvas"} />
      {types.map((type) => (
        <StoryMatrixHeaderCell key={`head-${type}`} tone={onDark ? "inverse" : "canvas"}>
          <CellLabel label={type} onDark={onDark} />
        </StoryMatrixHeaderCell>
      ))}

      {brands.flatMap((brand) => [
        <StoryMatrixRowLabelCell key={`${brand}-label`} minHeight={88} tone={onDark ? "inverse" : "canvas"}>
          <CellLabel label={brand} onDark={onDark} />
        </StoryMatrixRowLabelCell>,
        ...types.map((type) => (
          <StoryMatrixValueCell key={`${brand}-${type}`} minHeight={88} tone={onDark ? "inverse" : "canvas"}>
            <div style={valueCellStyles}>
              <BrandLogo brand={brand} type={type} onDark={onDark} decorative />
            </div>
          </StoryMatrixValueCell>
        ))
      ])}
    </StoryMatrix>
  );
}

function DocsMatrix({
  brand,
  onDark
}: {
  brand: NonNullable<BrandLogoProps["brand"]>;
  onDark: boolean;
}) {
  return (
    <StoryMatrix columns="minmax(140px, 180px) repeat(2, minmax(180px, 1fr))" tone={onDark ? "inverse" : "canvas"}>
      <StoryMatrixCornerCell tone={onDark ? "inverse" : "canvas"} />
      <StoryMatrixHeaderCell tone={onDark ? "inverse" : "canvas"}>
        <CellLabel label="Logo" onDark={onDark} />
      </StoryMatrixHeaderCell>
      <StoryMatrixHeaderCell tone={onDark ? "inverse" : "canvas"}>
        <CellLabel label="Symbol" onDark={onDark} />
      </StoryMatrixHeaderCell>

      <StoryMatrixRowLabelCell minHeight={88} tone={onDark ? "inverse" : "canvas"}>
        <CellLabel label={brand} onDark={onDark} />
      </StoryMatrixRowLabelCell>
      {types.map((type) => (
        <StoryMatrixValueCell key={`${brand}-${type}-${onDark ? "dark" : "light"}`} minHeight={88} tone={onDark ? "inverse" : "canvas"}>
          <div style={valueCellStyles}>
            <BrandLogo brand={brand} type={type} onDark={onDark} decorative />
          </div>
        </StoryMatrixValueCell>
      ))}
    </StoryMatrix>
  );
}

const meta = {
  title: "Identity/BrandLogo",
  component: BrandLogo,
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BRAND_LOGO_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    type: "Logo",
    onDark: false,
    decorative: true
  },
  argTypes: {
    brand: {
      control: "select",
      options: brands
    },
    type: {
      control: "inline-radio",
      options: types
    },
    onDark: {
      control: "boolean"
    }
  }
} satisfies Meta<typeof BrandLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: ({ brand = "Cars24" }) => (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <DocsMatrix brand={brand} onDark={false} />
        <DocsMatrix brand={brand} onDark />
      </div>
    </StoryPage>
  ),
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const Playground: Story = {
  render: (args) => (
    <StoryPage>
      <StoryPreviewSurface onDark={Boolean(args.onDark)}>
        <BrandLogo {...args} />
      </StoryPreviewSurface>
    </StoryPage>
  )
};

export const BrandMatrix: Story = {
  name: "All Brands",
  render: () => (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <Matrix onDark={false} />
        <Matrix onDark />
      </div>
    </StoryPage>
  ),
  parameters: {
    controls: { disable: true }
  }
};

const valueCellStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  minHeight: 56
};
