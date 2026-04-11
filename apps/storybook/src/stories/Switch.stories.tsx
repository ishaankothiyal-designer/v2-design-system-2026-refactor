import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { Switch, Text, type SwitchProps, type SwitchSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const switchSizes: SwitchSize[] = ["Default", "Small"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, disabled: false },
  { key: "selected", label: "Selected", checked: true, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, disabled: true }
] as const;

type SwitchStoryArgs = Omit<SwitchProps, "defaultChecked">;

function renderPlayground(args: SwitchStoryArgs) {
  const [{ checked = false }, updateArgs] = useArgs<SwitchStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({
      checked: event.currentTarget.checked
    });

    args.onChange?.(event);
  }

  return (
    <Switch
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
  size: SwitchSize;
  state: (typeof documentedStates)[number];
}) {
  return (
    <Switch
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
            title="Switch Variants"
            description="Brand-specific state matrix across the supported switch sizes."
          />
          <div style={matrixTableStyles()}>
            <div style={matrixCornerCellStyles} />
            {documentedStates.map((state) => (
              <div key={`${brand}-${state.key}-header`} style={matrixHeaderCellStyles}>
                <HeaderCell brand={brand} label={state.label} />
              </div>
            ))}

            {switchSizes.flatMap((size) => [
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

function buildSwitchVariantsSourceCode(brand: DisplayBrandId) {
  return `import { Switch } from "@geist/web";

const sizes = ["Default", "Small"] as const;
const states = [
  { label: "Rest", checked: false, disabled: false },
  { label: "Selected", checked: true, disabled: false },
  { label: "Disabled Rest", checked: false, disabled: true },
  { label: "Disabled Selected", checked: true, disabled: true }
] as const;

export function SwitchVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {states.map((state) => (
            <Switch
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

const switchUiExampleSourceCode = `<Switch
  aria-label="Enable notifications"
  brand="Cars24"
  size="Default"
  checked
/>\n`;

const SWITCH_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=77-3690&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<SwitchStoryArgs> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SWITCH_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    disabled: false,
    size: "Default"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: switchSizes
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

type Story = StoryObj<SwitchStoryArgs>;

export const Playground: Story = {
  args: {
    "aria-label": "Playground switch"
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
        code: buildSwitchVariantsSourceCode("Cars24")
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
        code: buildSwitchVariantsSourceCode("Team BHP")
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
        code: buildSwitchVariantsSourceCode("CarInfo")
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
        code: buildSwitchVariantsSourceCode("VehicleInfo")
      }
    }
  }
};

export const UIExample: Story = {
  args: {
    "aria-label": "Enable notifications",
    checked: true,
    size: "Default"
  },
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: switchUiExampleSourceCode
      }
    }
  },
  render: (args) => <Switch {...args} />
};
