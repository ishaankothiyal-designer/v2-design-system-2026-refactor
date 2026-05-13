import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { Divider, Icon, Text, type DividerLabelPosition, type DividerLineStyle, type DividerProps, type DividerThickness } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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

function HeaderCell({ brand, label }: { brand: DisplayBrandId; label: string }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function VariantMatrixStory({
  brand,
  lineStyle
}: {
  brand: DisplayBrandId;
  lineStyle: DividerLineStyle;
}) {
  const rows = thicknesses.flatMap((thickness) =>
    labelPositions.map((labelPosition) => ({
      label: `${labelPosition} / ${thickness}`,
      labelPosition,
      thickness
    }))
  );

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="220px minmax(0, 1fr)">
        <StoryMatrixCornerCell />
        <StoryMatrixHeaderCell>
          <HeaderCell brand={brand} label="Preview" />
        </StoryMatrixHeaderCell>

        {rows.flatMap(({ label, labelPosition, thickness }) => [
          <StoryMatrixRowLabelCell key={`${thickness}-${labelPosition}-label`} minHeight={88}>
            <HeaderCell brand={brand} label={label} />
          </StoryMatrixRowLabelCell>,
          <StoryMatrixValueCell key={`${thickness}-${labelPosition}-preview`} minHeight={88}>
            <div style={{ minWidth: 320, width: "100%", maxWidth: 640 }}>
              <Divider
                brand={brand}
                labelPosition={labelPosition}
                thickness={thickness}
                lineStyle={lineStyle}
                label="Continue"
              />
            </div>
          </StoryMatrixValueCell>
        ])}
      </StoryMatrix>
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

function buildDividerVariantsSourceCode(lineStyle: DividerLineStyle) {
  return `<StoryPage fullscreen>
  <div style={{ display: "grid", gap: 24 }}>
    <Divider brand="Cars24" labelPosition="None" thickness="Regular" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="Left" thickness="Regular" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="Center" thickness="Regular" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="Right" thickness="Regular" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="None" thickness="Thin" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="Left" thickness="Thin" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="Center" thickness="Thin" lineStyle="${lineStyle}" label="Continue" />
    <Divider brand="Cars24" labelPosition="Right" thickness="Thin" lineStyle="${lineStyle}" label="Continue" />
  </div>
</StoryPage>`;
}

const dividerUiExampleSourceCode = `<Divider
  brand="Cars24"
  labelPosition="Center"
  thickness="Regular"
  lineStyle="Plain"
  label="Continue"
  leadingIcon={<Icon name="sparkle-filled" decorative />}
  trailingIcon={<Icon name="sparkle-filled" decorative />}
/>`;

const DIVIDER_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=473-7681&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<DividerStoryArgs> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(DIVIDER_FIGMA_URL)
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

export const Plain: Story = {
  render: ({ brand = "Cars24" }) => <VariantMatrixStory brand={brand} lineStyle="Plain" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDividerVariantsSourceCode("Plain")
      }
    }
  }
};

export const Dash: Story = {
  render: ({ brand = "Cars24" }) => <VariantMatrixStory brand={brand} lineStyle="Dash" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDividerVariantsSourceCode("Dash")
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
