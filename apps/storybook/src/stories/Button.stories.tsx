import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  Button,
  Icon,
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

function makeIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="chevron-small-right-filled" decorative /> : undefined
  };
}

function MatrixCell({
  styleVariant,
  onDark,
  forceState,
  disabled,
  loading
}: {
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
      styleVariant={styleVariant}
      onDark={onDark}
      size="Medium"
      shape="Regular"
      {...icons}
      {...stateProps}
    >
      Label
    </Button>
  );
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>{title}</h2>
      {description ? (
        <p style={{ margin: 0, color: "#64748B", fontSize: 14, lineHeight: "20px" }}>{description}</p>
      ) : null}
    </div>
  );
}

function HeaderCell({ label }: { label: string }) {
  return (
    <div style={{ color: "#64748B", fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>{label}</div>
  );
}

function VariantMatrixStory() {
  return (
    <StoryPage fullscreen>
      <header style={{ display: "grid", gap: 12, maxWidth: 960 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Button</h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: 16, lineHeight: "24px" }}>
          Full review matrix for the canonical Figma button family across light and on-dark surfaces.
        </p>
      </header>

      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Light"
            description="Medium regular buttons across all styles and review states on light surfaces."
          />
          <div style={matrixGridStyles}>
            <HeaderCell label="Style" />
            <HeaderCell label="Rest" />
            <HeaderCell label="Hover / Pressed" />
            <HeaderCell label="Disabled" />
            <HeaderCell label="Loading" />

            {buttonStyles.flatMap((styleVariant) => [
              <HeaderCell key={`${styleVariant}-label`} label={styleVariant} />,
              <MatrixCell key={`${styleVariant}-rest-light`} styleVariant={styleVariant} onDark={false} />,
              <MatrixCell
                key={`${styleVariant}-hover-light`}
                styleVariant={styleVariant}
                onDark={false}
                forceState="Hover/Pressed"
              />,
              <MatrixCell
                key={`${styleVariant}-disabled-light`}
                styleVariant={styleVariant}
                onDark={false}
                disabled
              />,
              <MatrixCell
                key={`${styleVariant}-loading-light`}
                styleVariant={styleVariant}
                onDark={false}
                loading
              />
            ])}
          </div>
        </div>
      </StoryCard>

      <StoryCard style={{ background: "#0F172A" }}>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="On Dark"
            description="The same review matrix on dark surfaces."
          />
          <div style={matrixGridStyles}>
            <HeaderCell label="Style" />
            <HeaderCell label="Rest" />
            <HeaderCell label="Hover / Pressed" />
            <HeaderCell label="Disabled" />
            <HeaderCell label="Loading" />

            {buttonStyles.flatMap((styleVariant) => [
              <HeaderCell key={`${styleVariant}-label-dark`} label={styleVariant} />,
              <MatrixCell key={`${styleVariant}-rest-dark`} styleVariant={styleVariant} onDark />,
              <MatrixCell
                key={`${styleVariant}-hover-dark`}
                styleVariant={styleVariant}
                onDark
                forceState="Hover/Pressed"
              />,
              <MatrixCell
                key={`${styleVariant}-disabled-dark`}
                styleVariant={styleVariant}
                onDark
                disabled
              />,
              <MatrixCell
                key={`${styleVariant}-loading-dark`}
                styleVariant={styleVariant}
                onDark
                loading
              />
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
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
                <strong>{size}</strong>
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
                <strong>{size}</strong>
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

function ShapeAndStyleStory() {
  const icons = makeIcons(true, true);

  return (
    <StoryPage>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Shape and Style"
            description="Quick QA surface for regular and pill buttons across all styles."
          />
          <div style={shapeGridStyles}>
            <HeaderCell label="Shape" />
            {buttonStyles.map((styleVariant) => (
              <HeaderCell key={styleVariant} label={styleVariant} />
            ))}

            {buttonShapes.flatMap((shape) => [
              <HeaderCell key={`${shape}-shape`} label={shape} />,
              ...buttonStyles.map((styleVariant) => (
                <Button key={`${shape}-${styleVariant}`} shape={shape} styleVariant={styleVariant} size="Medium" {...icons}>
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

const matrixGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "140px repeat(4, minmax(0, 1fr))",
  rowGap: 16
};

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
      <StoryPage>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={resolvedOnDark ? { background: "#0F172A", padding: 24, borderRadius: 16 } : undefined}>
            <Button {...args} onDark={resolvedOnDark} {...icons}>
              {label}
            </Button>
          </div>
        </StoryCard>
      </StoryPage>
    );
  }
};

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Playground: Story = {};

export const VariantMatrix: StoryObj = {
  render: () => <VariantMatrixStory />
};

export const SizeScale: StoryObj = {
  render: () => <SizeScaleStory />
};

export const ShapeAndStyle: StoryObj = {
  render: () => <ShapeAndStyleStory />
};
