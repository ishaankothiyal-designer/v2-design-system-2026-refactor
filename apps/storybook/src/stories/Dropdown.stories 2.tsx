import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  Dropdown,
  Text,
  type DropdownHelperTone,
  type DropdownPreviewState,
  type DropdownProps,
  type DropdownSize,
  type DropdownValidationState
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const dropdownSizes: DropdownSize[] = ["Small", "Large"];
const previewStates: DropdownPreviewState[] = ["Rest", "Active", "Selected", "Error", "Disabled"];
const validationStates: DropdownValidationState[] = ["Default", "Error"];
const helperTones: DropdownHelperTone[] = ["Default", "Error"];

function PlaygroundStory(args: DropdownProps) {
  const [{ value }, updateArgs] = useArgs<DropdownProps>();

  function handleSelect() {
    updateArgs({
      value: value ? "" : "Selected option"
    });
  }

  return (
    <div style={{ width: 328 }}>
      <Dropdown
        {...args}
        onClick={handleSelect}
      />
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

function StateMatrixStory({
  brand,
  forceState,
  helperTone,
  stateLabel,
  value
}: {
  brand: DisplayBrandId;
  forceState: DropdownPreviewState;
  helperTone?: DropdownHelperTone;
  stateLabel: string;
  value?: string;
}) {
  const common = {
    brand,
    forceState,
    helperText: "Helper text",
    label: "Label",
    placeholder: "Input text",
    prefixIconName: "placeholder-generate-outline" as const,
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    ...(helperTone ? { helperTone } : {}),
    ...(value ? { value } : {})
  };

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {dropdownSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={112}>
          <HeaderCell brand={brand} label={stateLabel} />
        </StoryMatrixRowLabelCell>
        {dropdownSizes.map((size) => (
          <StoryMatrixValueCell key={`${stateLabel}-${size}`} minHeight={112}>
            <Dropdown {...common} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildDropdownStateSourceCode({
  forceState,
  helperTone,
  label,
  value
}: {
  forceState: DropdownPreviewState;
  helperTone?: DropdownHelperTone;
  label: string;
  value?: string;
}) {
  return `import { Dropdown } from "@geist/web";

export function Dropdown${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Dropdown
        brand="Cars24"
        size="Small"
        forceState="${forceState}"
        label="Label"
        placeholder="Input text"
        helperText="Helper text"
        prefixIconName="placeholder-generate-outline"
        required
        showHelperIcon
        showLabelInfoIcon
${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value ? `        value="${value}"\n` : ""}      />
      <Dropdown
        brand="Cars24"
        size="Large"
        forceState="${forceState}"
        label="Label"
        placeholder="Input text"
        helperText="Helper text"
        prefixIconName="placeholder-generate-outline"
        required
        showHelperIcon
        showLabelInfoIcon
${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value ? `        value="${value}"\n` : ""}      />
    </div>
  );
}`;
}

const dropdownUiExampleSourceCode = `<Dropdown
  brand="Cars24"
  size="Small"
  label="Label"
  placeholder="Input text"
  helperText="Helper text"
  prefixIconName="placeholder-generate-outline"
  required
  showHelperIcon
  showLabelInfoIcon
/>`;

const DROPDOWN_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14175-3650&t=1zgOyFpiLYMyM4XM-11";

const meta = {
  title: "Components/Forms/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(DROPDOWN_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    helperText: "Helper text",
    label: "Label",
    placeholder: "Input text",
    prefixIconName: "placeholder-generate-outline",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small",
    validationState: "Default"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: dropdownSizes
    },
    validationState: {
      control: "inline-radio",
      options: validationStates
    },
    helperTone: {
      control: "inline-radio",
      options: helperTones
    },
    forceState: {
      control: "select",
      options: [undefined, ...previewStates]
    },
    label: {
      control: "text"
    },
    helperText: {
      control: "text"
    },
    placeholder: {
      control: "text"
    },
    value: {
      control: "text"
    },
    prefixIconName: {
      control: "text"
    }
  }
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory,
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDropdownStateSourceCode({ forceState: "Rest", label: "Rest" })
      }
    }
  }
};

export const Active: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Active" stateLabel="Active" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDropdownStateSourceCode({ forceState: "Active", label: "Active" })
      }
    }
  }
};

export const Selected: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Selected" stateLabel="Selected" value="Input text" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDropdownStateSourceCode({ forceState: "Selected", label: "Selected", value: "Input text" })
      }
    }
  }
};

export const Error: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      forceState="Error"
      helperTone="Error"
      stateLabel="Error"
      value="Input text"
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDropdownStateSourceCode({
          forceState: "Error",
          helperTone: "Error",
          label: "Error",
          value: "Input text"
        })
      }
    }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Disabled" stateLabel="Disabled" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildDropdownStateSourceCode({ forceState: "Disabled", label: "Disabled" })
      }
    }
  }
};

export const UIExample: Story = {
  render: PlaygroundStory,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: dropdownUiExampleSourceCode
      }
    }
  }
};
