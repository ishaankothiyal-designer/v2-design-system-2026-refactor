import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  Divider,
  Icon,
  type DividerLabelPosition,
  type DividerLineStyle,
  type DividerProps,
  type DividerThickness
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type DividerStoryArgs = Omit<DividerProps, "leadingIcon" | "trailingIcon" | "content"> & {
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

const labelPositions: DividerLabelPosition[] = ["None", "Left", "Center", "Right"];
const thicknesses: DividerThickness[] = ["Regular", "Thin"];
const lineStyles: DividerLineStyle[] = ["Plain", "Dash"];

function makeIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="sparkle-filled" decorative /> : undefined
  };
}

function HeaderCell({ label }: { label: string }) {
  return (
    <div style={{ color: "#64748B", fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>{label}</div>
  );
}

function VariantGridStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <header style={{ display: "grid", gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Divider</h1>
            <p style={{ margin: 0, color: "#64748B", fontSize: 16, lineHeight: "24px" }}>
              Figma variant matrix for label position, thickness, and line style.
            </p>
          </header>

          <div style={variantGridStyles}>
            <HeaderCell label="Variant" />
            <HeaderCell label="Plain" />
            <HeaderCell label="Dash" />

            {thicknesses.flatMap((thickness) =>
              labelPositions.flatMap((labelPosition) => [
                <HeaderCell
                  key={`${thickness}-${labelPosition}-label`}
                  label={`${labelPosition} / ${thickness}`}
                />,
                ...lineStyles.map((lineStyle) => (
                  <Divider
                    key={`${thickness}-${labelPosition}-${lineStyle}`}
                    labelPosition={labelPosition}
                    thickness={thickness}
                    lineStyle={lineStyle}
                    label="Continue"
                    leadingIcon={labelPosition === "None" ? undefined : <Icon name="sparkle-filled" decorative />}
                    trailingIcon={labelPosition === "None" ? undefined : <Icon name="sparkle-filled" decorative />}
                  />
                ))
              ])
            )}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ConfigurationStory(args: DividerStoryArgs) {
  const { showLeadingIcon, showTrailingIcon, ...rest } = args;

  return (
    <StoryPage>
      <div style={configurationGridStyles}>
        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Tokenized Content</strong>
            <Divider {...rest} {...makeIcons(showLeadingIcon, showTrailingIcon)} />
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Custom Content</strong>
            <Divider
              {...rest}
              content={
                <>
                  <Icon name="sparkle-filled" decorative />
                  <span>Featured</span>
                </>
              }
            />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "180px repeat(2, minmax(0, 1fr))",
  rowGap: 18
};

const configurationGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
};

const meta: Meta<DividerStoryArgs> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    labelPosition: "Center",
    thickness: "Regular",
    lineStyle: "Plain",
    label: "Continue",
    showLeadingIcon: true,
    showTrailingIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    labelPosition: {
      control: "inline-radio",
      options: labelPositions
    },
    thickness: {
      control: "inline-radio",
      options: thicknesses
    },
    lineStyle: {
      control: "inline-radio",
      options: lineStyles
    },
    label: {
      control: "text"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showTrailingIcon: {
      control: "boolean"
    }
  },
  render: (args) => <ConfigurationStory {...args} />
};

export default meta;

type Story = StoryObj<DividerStoryArgs>;

export const Playground: Story = {};

export const VariantMatrix: Story = {
  render: () => <VariantGridStory />
};
