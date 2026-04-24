import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Checkbox, Text, type CheckboxProps, type CheckboxSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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

function StateMatrixStory({
  brand,
  state
}: {
  brand: DisplayBrandId;
  state: (typeof documentedStates)[number];
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px minmax(220px, 1fr)">
        <StoryMatrixCornerCell />
        <StoryMatrixHeaderCell>
          <HeaderCell brand={brand} label={state.label} />
        </StoryMatrixHeaderCell>

        {checkboxSizes.flatMap((size) => [
          <StoryMatrixRowLabelCell key={`${brand}-${state.key}-${size}-label`} minHeight={96}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixRowLabelCell>,
          <StoryMatrixValueCell key={`${brand}-${state.key}-${size}`} minHeight={96}>
            <MatrixCell brand={brand} size={size} state={state} />
          </StoryMatrixValueCell>
        ])}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildCheckboxStateSourceCode(state: (typeof documentedStates)[number]) {
  return `import { Checkbox } from "@geist/web";

const sizes = ["Small", "Medium", "Large", "Extra Large"] as const;

export function Checkbox${state.key.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <Checkbox
          key={size}
          aria-label={\`${"${size}"} ${state.label}\`}
          brand="Cars24"
          size={size}
          checked={${state.checked}}
          indeterminate={${state.indeterminate}}
          disabled={${state.disabled}}
        />
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

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[0]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxStateSourceCode(documentedStates[0])
      }
    }
  }
};

export const Intermediate: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[1]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxStateSourceCode(documentedStates[1])
      }
    }
  }
};

export const Selected: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[2]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxStateSourceCode(documentedStates[2])
      }
    }
  }
};

export const DisabledRest: Story = {
  name: "Disabled Rest",
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[3]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxStateSourceCode(documentedStates[3])
      }
    }
  }
};

export const DisabledIntermediate: Story = {
  name: "Disabled Intermediate",
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[4]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxStateSourceCode(documentedStates[4])
      }
    }
  }
};

export const DisabledSelected: Story = {
  name: "Disabled Selected",
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[5]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildCheckboxStateSourceCode(documentedStates[5])
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
