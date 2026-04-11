import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { Divider, Icon, type DividerLabelPosition, type DividerLineStyle, type DividerProps, type DividerThickness } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type DividerStoryArgs = Omit<DividerProps, "leadingIcon" | "trailingIcon"> & {
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
    </StoryPage>
  );
}

function ConfigurationStory(args: DividerStoryArgs) {
  const { showLeadingIcon, showTrailingIcon, ...rest } = args;

  return (
    <div style={{ minWidth: 320, width: "100%", maxWidth: 640 }}>
      <Divider {...rest} {...makeIcons(showLeadingIcon, showTrailingIcon)} />
    </div>
  );
}

const variantGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "180px repeat(2, minmax(0, 1fr))",
  rowGap: 18,
  justifyContent: "center",
  justifyItems: "center"
};

const dividerVariantsSourceCode = `<StoryPage fullscreen>
  <Divider
    brand="Cars24"
    labelPosition="Center"
    thickness="Regular"
    lineStyle="Plain"
    label="Continue"
    leadingIcon={<Icon name="sparkle-filled" decorative />}
    trailingIcon={<Icon name="sparkle-filled" decorative />}
  />
</StoryPage>`;

const dividerUiExampleSourceCode = `<Divider
  brand="Cars24"
  labelPosition="Center"
  thickness="Regular"
  lineStyle="Plain"
  label="Continue"
  leadingIcon={<Icon name="sparkle-filled" decorative />}
  trailingIcon={<Icon name="sparkle-filled" decorative />}
/>`;

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

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: () => <VariantGridStory />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: dividerVariantsSourceCode
      }
    }
  }
};

export const UIExample: Story = {
  render: (args) => <ConfigurationStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: dividerUiExampleSourceCode
      }
    }
  }
};
