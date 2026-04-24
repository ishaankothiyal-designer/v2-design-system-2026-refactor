import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  TextInput,
  type TextInputHelperTone,
  type TextInputPreviewState,
  type TextInputProps,
  type TextInputSize,
  type TextInputValidationState
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  EditProfileMobileScreen,
  editProfileScreenSourceCode
} from "./EditProfileMobileScreenExample";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const textInputSizes: TextInputSize[] = ["Small", "Large"];
const previewStates: TextInputPreviewState[] = [
  "Rest",
  "Hover",
  "Active",
  "Typing",
  "Typed",
  "Error",
  "Success",
  "Disabled"
];
const validationStates: TextInputValidationState[] = ["Default", "Error", "Success"];
const helperTones: TextInputHelperTone[] = ["Default", "Error", "Success"];

type TextInputStoryArgs = TextInputProps;

function PlaygroundStory(args: TextInputStoryArgs) {
  const [{ value }, updateArgs] = useArgs<TextInputStoryArgs>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 328 }}>
      <TextInput {...args} {...(isControlled ? { value } : {})} onChange={handleChange} />
    </div>
  );
}

function HeaderCell({ label }: { brand: DisplayBrandId; label: string }) {
  return <span>{label}</span>;
}

function StateMatrixStory({
  brand,
  forceState,
  helperTone,
  stateLabel,
  value
}: {
  brand: DisplayBrandId;
  forceState: TextInputPreviewState;
  helperTone?: TextInputHelperTone;
  stateLabel: string;
  value?: string;
}) {
  const common = {
    brand,
    forceState,
    helperText: "Helper text",
    label: "Label",
    placeholder: "Placeholder text",
    prefixIconName: "placeholder-generate-outline" as const,
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    suffixIconName: "placeholder-generate-outline" as const,
    ...(helperTone ? { helperTone } : {}),
    ...(value !== undefined ? { value } : {})
  } satisfies TextInputProps;

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {textInputSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={112}>
          <HeaderCell brand={brand} label={stateLabel} />
        </StoryMatrixRowLabelCell>
        {textInputSizes.map((size) => (
          <StoryMatrixValueCell key={`${stateLabel}-${size}`} minHeight={112}>
            <TextInput {...common} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildTextInputStateSourceCode({
  forceState,
  helperTone,
  label,
  value
}: {
  forceState: TextInputPreviewState;
  helperTone?: TextInputHelperTone;
  label: string;
  value?: string;
}) {
  return `import { TextInput } from "@geist/web";

export function TextInput${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <TextInput
        brand="Cars24"
        size="Small"
        forceState="${forceState}"
        label="Label"
        placeholder="Placeholder text"
        helperText="Helper text"
        prefixIconName="placeholder-generate-outline"
        suffixIconName="placeholder-generate-outline"
        required
        showHelperIcon
        showLabelInfoIcon
${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
      <TextInput
        brand="Cars24"
        size="Large"
        forceState="${forceState}"
        label="Label"
        placeholder="Placeholder text"
        helperText="Helper text"
        prefixIconName="placeholder-generate-outline"
        suffixIconName="placeholder-generate-outline"
        required
        showHelperIcon
        showLabelInfoIcon
${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
    </div>
  );
}`;
}

const TEXT_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=6451-19520&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<TextInputStoryArgs> = {
  title: "Components/Forms/Text Input",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TEXT_INPUT_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    helperText: "Helper text",
    label: "Label",
    placeholder: "Placeholder text",
    prefixIconName: "placeholder-generate-outline",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small",
    suffixIconName: "placeholder-generate-outline",
    validationState: "Default"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: textInputSizes
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
    },
    suffixIconName: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<TextInputStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextInputStateSourceCode({ forceState: "Rest", label: "Rest" }) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Hover" stateLabel="Hover" value="Input text" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextInputStateSourceCode({ forceState: "Hover", label: "Hover", value: "Input text" }) } }
  }
};

export const Active: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Active" stateLabel="Active" value="" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextInputStateSourceCode({ forceState: "Active", label: "Active", value: "" }) } }
  }
};

export const Typing: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Typing" stateLabel="Typing" value="Typing" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextInputStateSourceCode({ forceState: "Typing", label: "Typing", value: "Typing" }) } }
  }
};

export const Typed: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Typed" stateLabel="Typed" value="Typed text" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextInputStateSourceCode({ forceState: "Typed", label: "Typed", value: "Typed text" }) } }
  }
};

export const Error: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Error" helperTone="Error" stateLabel="Error" value="Invalid text" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildTextInputStateSourceCode({
          forceState: "Error",
          helperTone: "Error",
          label: "Error",
          value: "Invalid text"
        })
      }
    }
  }
};

export const Success: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Success" helperTone="Success" stateLabel="Success" value="Input text" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildTextInputStateSourceCode({
          forceState: "Success",
          helperTone: "Success",
          label: "Success",
          value: "Input text"
        })
      }
    }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Disabled" stateLabel="Disabled" value="Input text" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextInputStateSourceCode({ forceState: "Disabled", label: "Disabled", value: "Input text" }) } }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <EditProfileMobileScreen brand={brand} />,
  parameters: {
    layout: "fullscreen",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: editProfileScreenSourceCode
      }
    }
  }
};
