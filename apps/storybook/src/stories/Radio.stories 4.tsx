import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Radio, Text, type RadioProps, type RadioSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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
    updateArgs({ checked: event.currentTarget.checked });
    args.onChange?.(event);
  }

  return <Radio {...args} checked={checked} onChange={handleChange} />;
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
  state
}: {
  brand: DisplayBrandId;
  state: (typeof documentedStates)[number];
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(140px, 1fr))">
        <StoryMatrixCornerCell />
        {radioSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${state.key}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={96}>
          <HeaderCell brand={brand} label={state.label} />
        </StoryMatrixRowLabelCell>
        {radioSizes.map((size) => (
          <StoryMatrixValueCell key={`${state.key}-${size}`} minHeight={96}>
            <Radio
              aria-label={`${brand} ${size} ${state.label}`}
              brand={brand}
              checked={state.checked}
              disabled={state.disabled}
              size={size}
            />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildRadioStateSourceCode(state: (typeof documentedStates)[number]) {
  return `import { Radio } from "@geist/web";

const sizes = ["Small", "Medium"] as const;

export function Radio${state.key.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <Radio
          key={size}
          aria-label={\`${"${size}"} ${state.label}\`}
          brand="Cars24"
          size={size}
          checked={${state.checked}}
          disabled={${state.disabled}}
        />
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
/>`;

const RADIO_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=18067-20353&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<RadioStoryArgs> = {
  title: "Components/Forms/Radio",
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

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[0]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRadioStateSourceCode(documentedStates[0])
      }
    }
  }
};

export const Selected: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[1]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRadioStateSourceCode(documentedStates[1])
      }
    }
  }
};

export const DisabledRest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[2]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRadioStateSourceCode(documentedStates[2])
      }
    }
  }
};

export const DisabledSelected: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[3]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRadioStateSourceCode(documentedStates[3])
      }
    }
  }
};

export const UIExample: Story = {
  args: {
    "aria-label": "Select financing option",
    checked: true,
    size: "Medium"
  },
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: radioUiExampleSourceCode
      }
    }
  },
  render: (args) => <Radio {...args} />
};
