import { Fragment, type ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { CheckboxLabel, Text, type CheckboxLabelProps, type CheckboxLabelSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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

function StateMatrixStory({
  brand,
  description,
  label,
  state
}: {
  brand: DisplayBrandId;
  description: string;
  label: string;
  state: (typeof documentedStates)[number];
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px minmax(320px, 1fr)">
        {checkboxLabelSizes.map((size) => (
          <Fragment key={`${brand}-${state.key}-${size}`}>
            <StoryMatrixRowLabelCell minHeight={112}>
              <HeaderCell brand={brand} label={size} />
            </StoryMatrixRowLabelCell>
            <StoryMatrixValueCell minHeight={112}>
              <VariantCell brand={brand} description={description} label={label} size={size} state={state} />
            </StoryMatrixValueCell>
          </Fragment>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildCheckboxLabelStateSourceCode(state: (typeof documentedStates)[number]) {
  return `import { CheckboxLabel } from "@turbo/web";

const sizes = ["Small", "Medium", "Large"] as const;

export function CheckboxLabel${state.key.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {sizes.map((size) => (
        <CheckboxLabel
          key={size}
          brand="Cars24"
          size={size}
          label="Label"
          description="Helpful description that could potentially wrap to multiple lines"
          checked={${state.checked}}
          indeterminate={${state.indeterminate}}
          disabled={${state.disabled}}
        />
      ))}
    </div>
  );
}`;
}

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

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
      state={documentedStates[0]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxLabelStateSourceCode(documentedStates[0])
      }
    }
  }
};

export const Intermediate: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
      state={documentedStates[1]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxLabelStateSourceCode(documentedStates[1])
      }
    }
  }
};

export const Selected: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
      state={documentedStates[2]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxLabelStateSourceCode(documentedStates[2])
      }
    }
  }
};

export const DisabledRest: Story = {
  name: "Disabled Rest",
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
      state={documentedStates[3]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxLabelStateSourceCode(documentedStates[3])
      }
    }
  }
};

export const DisabledIntermediate: Story = {
  name: "Disabled Intermediate",
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
      state={documentedStates[4]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxLabelStateSourceCode(documentedStates[4])
      }
    }
  }
};

export const DisabledSelected: Story = {
  name: "Disabled Selected",
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      description="Helpful description that could potentially wrap to multiple lines"
      label="Label"
      state={documentedStates[5]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxLabelStateSourceCode(documentedStates[5])
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
