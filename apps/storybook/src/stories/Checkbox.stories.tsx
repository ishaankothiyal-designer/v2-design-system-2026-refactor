import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { Checkbox, Text, type CheckboxProps, type CheckboxSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const checkboxSizes: CheckboxSize[] = ["Small", "Medium", "Large", "Extra Large"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, indeterminate: false, disabled: false },
  { key: "intermediate", label: "Intermediate", checked: false, indeterminate: true, disabled: false },
  { key: "selected", label: "Selected", checked: true, indeterminate: false, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, indeterminate: false, disabled: true },
  { key: "disabled-intermediate", label: "Disabled Intermediate", checked: false, indeterminate: true, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, indeterminate: false, disabled: true }
] as const;

type CheckboxStoryArgs = Omit<CheckboxProps, "defaultChecked" | "defaultIndeterminate">;

function renderPlayground(args: CheckboxStoryArgs) {
  const [{ checked = false, indeterminate = false }, updateArgs] = useArgs<CheckboxStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({
      checked: event.currentTarget.checked,
      indeterminate: false
    });

    args.onChange?.(event);
  }

  return (
    <Checkbox
      {...args}
      checked={checked}
      indeterminate={indeterminate}
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
  size: CheckboxSize;
  state: (typeof documentedStates)[number];
}) {
  return (
    <Checkbox
      aria-label={`${brand} ${size} ${state.label}`}
      brand={brand}
      checked={state.checked}
      disabled={state.disabled}
      indeterminate={state.indeterminate}
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
            title="Checkbox Variants"
            description="Brand-specific state matrix across all supported sizes."
          />
          <div style={matrixTableStyles()}>
            <div style={matrixCornerCellStyles} />
            {documentedStates.map((state) => (
              <div key={`${brand}-${state.key}-header`} style={matrixHeaderCellStyles}>
                <HeaderCell brand={brand} label={state.label} />
              </div>
            ))}

            {checkboxSizes.flatMap((size) => [
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
    gridTemplateColumns: "180px repeat(6, minmax(140px, 1fr))",
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

function buildCheckboxVariantsSourceCode(brand: DisplayBrandId) {
  return `import { Checkbox } from "@geist/web";

const sizes = ["Small", "Medium", "Large", "Extra Large"] as const;
const states = [
  { label: "Rest", checked: false, indeterminate: false, disabled: false },
  { label: "Intermediate", checked: false, indeterminate: true, disabled: false },
  { label: "Selected", checked: true, indeterminate: false, disabled: false },
  { label: "Disabled Rest", checked: false, indeterminate: false, disabled: true },
  { label: "Disabled Intermediate", checked: false, indeterminate: true, disabled: true },
  { label: "Disabled Selected", checked: true, indeterminate: false, disabled: true }
] as const;

export function CheckboxVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {states.map((state) => (
            <Checkbox
              key={state.label}
              aria-label={\`\${size} \${state.label}\`}
              brand="${brand}"
              size={size}
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

const checkboxUiExampleSourceCode = `<Checkbox
  aria-label="Accept terms"
  brand="Cars24"
  size="Large"
  checked
/>\n`;

const CHECKBOX_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=17828-37821&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<CheckboxStoryArgs> = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(CHECKBOX_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    disabled: false,
    indeterminate: false,
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: checkboxSizes
    },
    checked: {
      control: "boolean"
    },
    indeterminate: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<CheckboxStoryArgs>;

export const Playground: Story = {
  args: {
    "aria-label": "Playground checkbox"
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
        code: buildCheckboxVariantsSourceCode("Cars24")
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
        code: buildCheckboxVariantsSourceCode("Team BHP")
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
        code: buildCheckboxVariantsSourceCode("CarInfo")
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
        code: buildCheckboxVariantsSourceCode("VehicleInfo")
      }
    }
  }
};

export const UIExample: Story = {
  args: {
    "aria-label": "Accept terms",
    checked: true,
    size: "Large"
  },
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: checkboxUiExampleSourceCode
      }
    }
  },
  render: (args) => <Checkbox {...args} />
};
