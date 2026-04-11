import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { SwitchLabel, type SwitchLabelProps, type SwitchLabelSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const switchLabelSizes: SwitchLabelSize[] = ["Default", "Small"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, disabled: false },
  { key: "selected", label: "Selected", checked: true, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, disabled: true }
] as const;

type SwitchLabelStoryArgs = Omit<SwitchLabelProps, "label" | "description"> & {
  description: string;
  label: string;
};

function renderPlayground(args: SwitchLabelStoryArgs) {
  const [{ checked = false }, updateArgs] = useArgs<SwitchLabelStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({
      checked: event.currentTarget.checked
    });

    args.onChange?.(event);
  }

  return (
    <SwitchLabel
      {...args}
      checked={checked}
      description={args.description || undefined}
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
  size: SwitchLabelSize;
  state: (typeof documentedStates)[number];
}) {
  return (
    <SwitchLabel
      brand={brand}
      checked={state.checked}
      description={description}
      disabled={state.disabled}
      label={label}
      size={size}
    />
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
        <div style={matrixGridStyles}>
          {switchLabelSizes.map((size) => (
            <div key={`${brand}-${size}`} style={sizeColumnStyles}>
              <div style={sizeHeadingStyles}>{size}</div>
              {documentedStates.map((state) => (
                <VariantCell
                  key={`${brand}-${size}-${state.key}`}
                  brand={brand}
                  description={description}
                  label={label}
                  size={size}
                  state={state}
                />
              ))}
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildSwitchLabelVariantsSourceCode(brand: DisplayBrandId) {
  return `import { SwitchLabel } from "@geist/web";

const sizes = ["Default", "Small"] as const;
const states = [
  { label: "Rest", checked: false, disabled: false },
  { label: "Selected", checked: true, disabled: false },
  { label: "Disabled Rest", checked: false, disabled: true },
  { label: "Disabled Selected", checked: true, disabled: true }
] as const;

export function SwitchLabelVariants() {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "grid", gap: 16 }}>
          {states.map((state) => (
            <SwitchLabel
              key={state.label}
              brand="${brand}"
              size={size}
              label="Label"
              description="Helpful description that could potentially wrap to multiple lines"
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

const matrixGridStyles: CSSProperties = {
  display: "grid",
  gap: 32,
  gridTemplateColumns: "repeat(auto-fit, minmax(328px, 1fr))"
};

const sizeColumnStyles: CSSProperties = {
  display: "grid",
  gap: 24
};

const sizeHeadingStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const switchLabelUiExampleSourceCode = `<SwitchLabel
  brand="Cars24"
  size="Default"
  label="Label"
  description="Helpful description that could potentially wrap to multiple lines"
  checked
/>`;

const SWITCH_LABEL_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=20010-4475&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<SwitchLabelStoryArgs> = {
  title: "Components/Switch Label",
  component: SwitchLabel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SWITCH_LABEL_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    description: "Helpful description that could potentially wrap to multiple lines",
    disabled: false,
    label: "Label",
    size: "Default"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: switchLabelSizes
    },
    checked: {
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

type Story = StoryObj<SwitchLabelStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Cars24: Story = {
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
        code: buildSwitchLabelVariantsSourceCode("Cars24")
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
        code: buildSwitchLabelVariantsSourceCode("Team BHP")
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
        code: buildSwitchLabelVariantsSourceCode("CarInfo")
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
        code: buildSwitchLabelVariantsSourceCode("VehicleInfo")
      }
    }
  }
};

export const UIExample: Story = {
  args: {
    checked: true,
    size: "Default"
  },
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: switchLabelUiExampleSourceCode
      }
    }
  },
  render: (args) => (
    <SwitchLabel
      {...args}
      description={args.description || undefined}
      label={args.label}
    />
  )
};
