import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  BackToTopButton,
  type BackToTopButtonPreviewState,
  type BackToTopButtonProps
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type BackToTopButtonStoryArgs = Omit<BackToTopButtonProps, "children"> & {
  label: string;
};

function HeaderCell({ label }: { label: string }) {
  return <div style={headerCellStyles}>{label}</div>;
}

function MatrixCell({
  brand,
  disabled,
  forceState,
  inverse
}: {
  brand: NonNullable<BackToTopButtonProps["brand"]>;
  disabled?: boolean;
  forceState?: BackToTopButtonPreviewState;
  inverse?: boolean;
}) {
  return (
    <BackToTopButton
      brand={brand}
      {...(inverse !== undefined ? { inverse } : {})}
      {...(disabled ? { disabled: true } : {})}
      {...(forceState ? { forceState } : {})}
    >
      Go to top
    </BackToTopButton>
  );
}

function BrandSection({
  brand,
  title
}: {
  brand: NonNullable<BackToTopButtonProps["brand"]>;
  title: string;
}) {
  const rows: Array<{
    disabled?: boolean;
    forceState?: BackToTopButtonPreviewState;
    label: string;
  }> = [
    { label: "Rest" },
    { label: "Hover", forceState: "Hover" },
    { label: "Disabled", disabled: true }
  ];

  return (
    <StoryCard>
      <div style={{ display: "grid", gap: 20 }}>
        <strong>{title}</strong>

        <div style={matrixGridStyles}>
          <HeaderCell label="State" />
          <HeaderCell label="Light" />
          <HeaderCell label="Inverse" />

          {rows.flatMap((row) => [
            <HeaderCell key={`${brand}-${row.label}`} label={row.label} />,
            <MatrixCell
              key={`${brand}-${row.label}-light`}
              brand={brand}
              {...(row.disabled ? { disabled: true } : {})}
              {...(row.forceState ? { forceState: row.forceState } : {})}
            />,
            <div key={`${brand}-${row.label}-inverse`} style={inverseCellStyles}>
              <MatrixCell
                brand={brand}
                inverse
                {...(row.disabled ? { disabled: true } : {})}
                {...(row.forceState ? { forceState: row.forceState } : {})}
              />
            </div>
          ])}
        </div>
      </div>
    </StoryCard>
  );
}

function PlaygroundStory(args: BackToTopButtonStoryArgs) {
  const { label, ...rest } = args;

  return (
    <div style={rest.inverse ? { background: "#0A0A0A", padding: 24, borderRadius: 16 } : undefined}>
      <BackToTopButton {...rest}>{label}</BackToTopButton>
    </div>
  );
}

function MatrixStory() {
  return (
    <StoryPage fullscreen>
      <BrandSection brand="Cars24" title="Cars24" />
      <BrandSection brand="Team BHP" title="Team BHP" />
      <BrandSection brand="CarInfo" title="CarInfo" />
      <BrandSection brand="VehicleInfo" title="VehicleInfo" />
    </StoryPage>
  );
}

const headerCellStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const introCopyStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  margin: 0,
  fontSize: 16,
  lineHeight: "24px"
};

const sectionCopyStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  margin: 0,
  fontSize: 14,
  lineHeight: "20px"
};

const matrixGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "140px repeat(2, minmax(0, 1fr))",
  rowGap: 18,
  justifyItems: "center"
};

const inverseCellStyles: CSSProperties = {
  background: "#0A0A0A",
  borderRadius: 16,
  display: "flex",
  justifyContent: "flex-start",
  padding: 20
};

const playgroundGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
};

const meta: Meta<BackToTopButtonStoryArgs> = {
  title: "Components/Back To Top Button",
  component: BackToTopButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    disabled: false,
    inverse: false,
    label: "Go to top"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover"]
    },
    inverse: {
      control: "boolean"
    }
  }
};

export default meta;

type Story = StoryObj<BackToTopButtonStoryArgs>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: () => <MatrixStory />,
  parameters: {
    controls: { disable: true }
  }
};

export const UsageGuidelines: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const UIExample: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};
