import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BrandLogo, Text, type BrandLogoProps, type BrandLogoType } from "@geist/web";
import { coreTokenCatalog } from "@geist/tokens";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const BRAND_LOGO_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=12125-23339&p=f&t=1zgOyFpiLYMyM4XM-11";

const brands: BrandLogoProps["brand"][] = ["Cars24", "VehicleInfo", "CarInfo", "Team BHP"];
const types: BrandLogoType[] = ["Logo", "Symbol"];

function Surface({
  children,
  onDark
}: {
  children: ReactNode;
  onDark: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 24,
        padding: 24,
        borderRadius: 24,
        border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
        background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas)
      }}
    >
      {children}
    </div>
  );
}

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
    <Surface onDark={onDark}>
      <div style={matrixStyles}>
        <div />
        {types.map((type) => (
          <CellLabel key={`head-${type}`} label={type} onDark={onDark} />
        ))}

        {brands.flatMap((brand) => [
          <CellLabel key={`${brand}-label`} label={brand} onDark={onDark} />,
          ...types.map((type) => (
            <div key={`${brand}-${type}`} style={valueCellStyles}>
              <BrandLogo brand={brand} type={type} onDark={onDark} decorative />
            </div>
          ))
        ])}
      </div>
    </Surface>
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

export const Playground: Story = {
  render: (args) => (
    <StoryPage>
      <div style={args.onDark ? darkPreviewStyles : undefined}>
        <BrandLogo {...args} />
      </div>
    </StoryPage>
  )
};

export const BrandMatrix: Story = {
  render: () => (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 16 }}>
            <StoryHeading>Brand Logo</StoryHeading>
            <StoryCopy>
              Canonical logo and symbol variants for the Cars24, VehicleInfo, CarInfo, and Team BHP brands.
            </StoryCopy>
            <Matrix onDark={false} />
          </div>
        </StoryCard>

        <StoryCard
          style={{
            background: String(coreTokenCatalog.color.surface.inverse),
            borderRadius: 24,
            padding: 32
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <StoryHeading tone="inverse" style={{ color: String(coreTokenCatalog.color.text.inverse) }}>
              On Dark Surface
            </StoryHeading>
            <StoryCopy
              tone="inverse"
              style={{ color: String(coreTokenCatalog.color.text.inverse), opacity: 0.82 }}
            >
              Inverse variants aligned with the Figma identity matrix.
            </StoryCopy>
            <Matrix onDark />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  )
};

const matrixStyles: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(120px, 140px) minmax(180px, 1fr) 80px",
  gap: 20,
  alignItems: "center"
};

const valueCellStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: 56
};

const darkPreviewStyles: CSSProperties = {
  display: "inline-flex",
  padding: 24,
  borderRadius: 16,
  background: String(coreTokenCatalog.color.surface.inverse)
};
