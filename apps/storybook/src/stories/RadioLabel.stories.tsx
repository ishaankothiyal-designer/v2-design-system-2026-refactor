import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { RadioLabel, Text, type RadioLabelProps, type RadioLabelSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const radioLabelSizes: RadioLabelSize[] = ["Small", "Medium"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, disabled: false },
  { key: "selected", label: "Selected", checked: true, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, disabled: true }
] as const;

type RadioLabelStoryArgs = Omit<RadioLabelProps, "label" | "description"> & {
  description: string;
  label: string;
};

function renderPlayground(args: RadioLabelStoryArgs) {
  const [{ checked = false }, updateArgs] = useArgs<RadioLabelStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({ checked: event.currentTarget.checked });
    args.onChange?.(event);
  }

  return (
    <RadioLabel
      {...args}
      checked={checked}
      description={args.description || undefined}
      label={args.label}
      onChange={handleChange}
    />
  );
}

function HeaderCell({ brand, label }: { brand: DisplayBrandId; label: string }) {
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
      <StoryMatrix columns="180px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {radioLabelSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${state.key}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={112}>
          <HeaderCell brand={brand} label={state.label} />
        </StoryMatrixRowLabelCell>
        {radioLabelSizes.map((size) => (
          <StoryMatrixValueCell key={`${state.key}-${size}`} minHeight={112}>
            <RadioLabel
              brand={brand}
              checked={state.checked}
              description={description}
              disabled={state.disabled}
              label={label}
              size={size}
            />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildRadioLabelStateSourceCode(state: (typeof documentedStates)[number]) {
  return `import { RadioLabel } from "@turbo/web";

const sizes = ["Small", "Medium"] as const;

export function RadioLabel${state.key.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <RadioLabel
          key={size}
          brand="Cars24"
          size={size}
          label="Label"
          description="Helpful description that could potentially wrap to multiple lines"
          checked={${state.checked}}
          disabled={${state.disabled}}
        />
      ))}
    </div>
  );
}`;
}

const radioLabelUiExampleSourceCode = `<RadioLabel
  brand="Cars24"
  size="Medium"
  label="Label"
  description="Helpful description that could potentially wrap to multiple lines"
  checked
/>`;

const RADIO_LABEL_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=77-54&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<RadioLabelStoryArgs> = {
  title: "Components/Forms/Radio Label",
  component: RadioLabel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(RADIO_LABEL_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    description: "Helpful description that could potentially wrap to multiple lines",
    disabled: false,
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
      options: radioLabelSizes
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

type Story = StoryObj<RadioLabelStoryArgs>;

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
        code: buildRadioLabelStateSourceCode(documentedStates[0])
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
      state={documentedStates[1]}
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRadioLabelStateSourceCode(documentedStates[1])
      }
    }
  }
};

export const DisabledRest: Story = {
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
        code: buildRadioLabelStateSourceCode(documentedStates[2])
      }
    }
  }
};

export const DisabledSelected: Story = {
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
        code: buildRadioLabelStateSourceCode(documentedStates[3])
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
        code: radioLabelUiExampleSourceCode
      }
    }
  },
  render: (args) => <RadioLabel {...args} description={args.description || undefined} label={args.label} />
};
