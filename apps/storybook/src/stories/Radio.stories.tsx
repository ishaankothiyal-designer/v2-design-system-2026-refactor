import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { Radio, Text, type RadioProps, type RadioSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const radioSizes: RadioSize[] = ["Small", "Medium"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, disabled: false },
  { key: "selected", label: "Selected", checked: true, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, disabled: true }
] as const;

type RadioStoryArgs = Omit<RadioProps, "defaultChecked">;

function renderPlayground(args: RadioStoryArgs) {
  const [{ checked = false }, updateArgs] = useArgs<RadioStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({
      checked: event.currentTarget.checked
    });

    args.onChange?.(event);
  }

  return (
    <Radio
      {...args}
      checked={checked}
      onChange={handleChange}
    />
  );
}

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

function HeaderCell({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function MatrixCell({
  brand,
  size,
  state
}: {
  brand: DisplayBrandId;
  size: RadioSize;
  state: (typeof documentedStates)[number];
}) {
  return (
    <Radio
      aria-label={`${brand} ${size} ${state.label}`}
      brand={brand}
      checked={state.checked}
      disabled={state.disabled}
      size={size}
    />
  );
}

function BrandVariantMatrixStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <SectionHeading
            brand={brand}
            title="Radio Variants"
            description="Brand-specific state matrix across the supported radio sizes."
          />
          <div style={matrixTableStyles()}>
            <div style={matrixCornerCellStyles} />
            {documentedStates.map((state) => (
              <div key={`${brand}-${state.key}-header`} style={matrixHeaderCellStyles}>
                <HeaderCell brand={brand} label={state.label} />
              </div>
            ))}

            {radioSizes.flatMap((size) => [
              <div key={`${brand}-${size}-label`} style={matrixRowLabelCellStyles}>
                <HeaderCell brand={brand} label={size} />
              </div>,
              ...documentedStates.map((state) => (
                <div key={`${brand}-${size}-${state.key}`} style={matrixValueCellStyles}>
                  <MatrixCell brand={brand} size={size} state={state} />
                </div>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function matrixTableStyles(): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: "180px repeat(4, minmax(140px, 1fr))",
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
  minHeight: 96,
  padding: "20px 16px"
};

const matrixValueCellStyles: CSSProperties = {
  display: "grid",
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  justifyItems: "center",
  minHeight: 96,
  padding: "16px 20px"
};

function buildRadioVariantsSourceCode(brand: DisplayBrandId) {
  return `import { Radio } from "@geist/web";

const sizes = ["Small", "Medium"] as const;
const states = [
  { label: "Rest", checked: false, disabled: false },
  { label: "Selected", checked: true, disabled: false },
  { label: "Disabled Rest", checked: false, disabled: true },
  { label: "Disabled Selected", checked: true, disabled: true }
] as const;

export function RadioVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {states.map((state) => (
            <Radio
              key={state.label}
              aria-label={\`\${size} \${state.label}\`}
              brand="${brand}"
              size={size}
              checked={state.checked}
              disabled={state.disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
}`;
}

const radioUiExampleSourceCode = `<Radio
  aria-label="Select financing option"
  brand="Cars24"
  size="Medium"
  checked
/>\n`;

const RADIO_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=18067-20353&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<RadioStoryArgs> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(RADIO_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    disabled: false,
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: radioSizes
    },
    checked: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<RadioStoryArgs>;

export const Playground: Story = {
  args: {
    "aria-label": "Playground radio"
  },
  parameters: {
    layout: "centered"
  }
};

export const Cars24: Story = {
  render: () => <BrandVariantMatrixStory brand="Cars24" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: buildRadioVariantsSourceCode("Cars24")
      }
    }
  }
};

export const TeamBHP: Story = {
  render: () => <BrandVariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: buildRadioVariantsSourceCode("Team BHP")
      }
    }
  }
};

export const CarInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: buildRadioVariantsSourceCode("CarInfo")
      }
    }
  }
};

export const VehicleInfo: Story = {
  render: () => <BrandVariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: buildRadioVariantsSourceCode("VehicleInfo")
      }
    }
  }
};

export const UsageSnippet: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Radio aria-label="Select financing option" brand="Cars24" checked size="Medium" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: radioUiExampleSourceCode
      }
    }
  }
};
