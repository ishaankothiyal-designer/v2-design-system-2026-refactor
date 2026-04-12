import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { CheckboxLabel, Text, type CheckboxLabelProps, type CheckboxLabelSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const checkboxLabelSizes: CheckboxLabelSize[] = ["Small", "Medium", "Large"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, indeterminate: false, disabled: false },
  { key: "intermediate", label: "Intermediate", checked: false, indeterminate: true, disabled: false },
  { key: "selected", label: "Selected", checked: true, indeterminate: false, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, indeterminate: false, disabled: true },
  { key: "disabled-intermediate", label: "Disabled Intermediate", checked: false, indeterminate: true, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, indeterminate: false, disabled: true }
] as const;

type CheckboxLabelStoryArgs = Omit<CheckboxLabelProps, "label" | "description"> & {
  description: string;
  label: string;
};

function renderPlayground(args: CheckboxLabelStoryArgs) {
  const [{ checked = false, indeterminate = false }, updateArgs] = useArgs<CheckboxLabelStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({
      checked: event.currentTarget.checked,
      indeterminate: false
    });

    args.onChange?.(event);
  }

  return (
    <CheckboxLabel
      {...args}
      checked={checked}
      description={args.description || undefined}
      indeterminate={indeterminate}
      label={args.label}
      onChange={handleChange}
    />
  );
}

function VariantCell({
  brand,
  description,
  label,
  size,
  state
}: {
  brand: DisplayBrandId;
  description: string;
  label: string;
  size: CheckboxLabelSize;
  state: (typeof documentedStates)[number];
}) {
  return (
    <CheckboxLabel
      brand={brand}
      checked={state.checked}
      description={description}
      disabled={state.disabled}
      indeterminate={state.indeterminate}
      label={label}
      size={size}
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

function VariantMatrixStory({
  brand,
  description,
  label
}: {
  brand: DisplayBrandId;
  description: string;
  label: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <SectionHeading
            brand={brand}
            title="Checkbox Label Variants"
            description="Brand-specific size and state matrix for the checkbox with label and helper text."
          />
          <div style={matrixTableStyles()}>
            <div style={matrixCornerCellStyles} />
            {checkboxLabelSizes.map((size) => (
              <div key={`${brand}-${size}-header`} style={matrixHeaderCellStyles}>
                <HeaderCell brand={brand} label={size} />
              </div>
            ))}

            {documentedStates.flatMap((state) => [
              <div key={`${brand}-${state.key}-label`} style={matrixRowLabelCellStyles}>
                <HeaderCell brand={brand} label={state.label} />
              </div>,
              ...checkboxLabelSizes.map((size) => (
                <div key={`${brand}-${state.key}-${size}`} style={matrixValueCellStyles}>
                  <VariantCell
                    brand={brand}
                    description={description}
                    label={label}
                    size={size}
                    state={state}
                  />
                </div>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildCheckboxLabelVariantsSourceCode(brand: DisplayBrandId) {
  return `import { CheckboxLabel } from "@geist/web";

const sizes = ["Small", "Medium", "Large"] as const;
const states = [
  { label: "Rest", checked: false, indeterminate: false, disabled: false },
  { label: "Intermediate", checked: false, indeterminate: true, disabled: false },
  { label: "Selected", checked: true, indeterminate: false, disabled: false },
  { label: "Disabled Rest", checked: false, indeterminate: false, disabled: true },
  { label: "Disabled Intermediate", checked: false, indeterminate: true, disabled: true },
  { label: "Disabled Selected", checked: true, indeterminate: false, disabled: true }
] as const;

export function CheckboxLabelVariants() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "grid", gap: 24 }}>
          {states.map((state) => (
            <CheckboxLabel
              key={state.label}
              brand="${brand}"
              size={size}
              label="Label"
              description="Helpful description that could potentially wrap to multiple lines"
              checked={state.checked}
              indeterminate={state.indeterminate}
              disabled={state.disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
}`;
}

function matrixTableStyles(): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: "180px repeat(3, minmax(328px, 1fr))",
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
  minHeight: 112,
  padding: "20px 16px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "grid",
  minHeight: 112,
  padding: "20px"
};

const checkboxLabelUiExampleSourceCode = `<CheckboxLabel
  brand="Cars24"
  size="Medium"
  label="Label"
  description="Helpful description that could potentially wrap to multiple lines"
  checked
/>`;

const CHECKBOX_LABEL_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=77-139&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<CheckboxLabelStoryArgs> = {
  title: "Components/Forms/Checkbox Label",
  component: CheckboxLabel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(CHECKBOX_LABEL_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    description: "Helpful description that could potentially wrap to multiple lines",
    disabled: false,
    indeterminate: false,
    label: "Label",
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: checkboxLabelSizes
    },
    checked: {
      control: "boolean"
    },
    indeterminate: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    },
    label: {
      control: "text"
    },
    description: {
      control: "text"
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<CheckboxLabelStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: () => (
    <VariantMatrixStory
      brand="Cars24"
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
    />
  ),
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildCheckboxLabelVariantsSourceCode("Cars24")
      }
    }
  }
};

export const TeamBHP: Story = {
  render: () => (
    <VariantMatrixStory
      brand="Team BHP"
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
    />
  ),
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildCheckboxLabelVariantsSourceCode("Team BHP")
      }
    }
  }
};

export const CarInfo: Story = {
  render: () => (
    <VariantMatrixStory
      brand="CarInfo"
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
    />
  ),
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildCheckboxLabelVariantsSourceCode("CarInfo")
      }
    }
  }
};

export const VehicleInfo: Story = {
  render: () => (
    <VariantMatrixStory
      brand="VehicleInfo"
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
    />
  ),
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildCheckboxLabelVariantsSourceCode("VehicleInfo")
      }
    }
  }
};

export const UIExample: Story = {
  args: {
    checked: true,
    size: "Medium"
  },
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: checkboxLabelUiExampleSourceCode
      }
    }
  },
  render: (args) => (
    <CheckboxLabel
      {...args}
      description={args.description || undefined}
      label={args.label}
    />
  )
};
