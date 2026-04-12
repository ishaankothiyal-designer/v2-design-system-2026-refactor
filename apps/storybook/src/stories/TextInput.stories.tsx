import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  Text,
  TextInput,
  type TextInputHelperTone,
  type TextInputPreviewState,
  type TextInputProps,
  type TextInputSize,
  type TextInputValidationState
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

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

function PlaygroundStory(args: TextInputProps) {
  const [{ value }, updateArgs] = useArgs<TextInputProps>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 328 }}>
      <TextInput
        {...args}
        {...(isControlled ? { value } : {})}
        onChange={handleChange}
      />
    </div>
  );
}

function VariantMatrixStory() {
  const common = {
    brand: "Cars24" as const,
    helperText: "Helper text",
    label: "Label",
    placeholder: "Placeholder text",
    prefixIconName: "placeholder-generate-outline" as const,
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    suffixIconName: "placeholder-generate-outline" as const
  };

  const rows: Array<{
    label: string;
    small: TextInputProps;
    large: TextInputProps;
  }> = [
    {
      label: "Rest",
      small: { ...common, forceState: "Rest", size: "Small" },
      large: { ...common, forceState: "Rest", size: "Large" }
    },
    {
      label: "Hover",
      small: { ...common, forceState: "Hover", size: "Small", value: "Input text" },
      large: { ...common, forceState: "Hover", size: "Large", value: "Input text" }
    },
    {
      label: "Active",
      small: { ...common, forceState: "Active", size: "Small", value: "" },
      large: { ...common, forceState: "Active", size: "Large", value: "" }
    },
    {
      label: "Typing",
      small: { ...common, forceState: "Typing", size: "Small", value: "Typing" },
      large: { ...common, forceState: "Typing", size: "Large", value: "Typing" }
    },
    {
      label: "Typed",
      small: { ...common, forceState: "Typed", size: "Small", value: "Typed text" },
      large: { ...common, forceState: "Typed", size: "Large", value: "Typed text" }
    },
    {
      label: "Error",
      small: { ...common, forceState: "Error", helperTone: "Error", size: "Small", value: "Invalid text" },
      large: { ...common, forceState: "Error", helperTone: "Error", size: "Large", value: "Input text" }
    },
    {
      label: "Success",
      small: { ...common, forceState: "Success", helperTone: "Success", size: "Small", value: "Input text" },
      large: { ...common, forceState: "Success", helperTone: "Success", size: "Large", value: "Input text" }
    },
    {
      label: "Disabled",
      small: { ...common, forceState: "Disabled", size: "Small", value: "Input text" },
      large: { ...common, forceState: "Disabled", size: "Large", value: "Input text" }
    }
  ];

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <div style={matrixHeaderStyles}>
            <div />
            <Text brand="Cars24" as="strong" size="md">
              Small
            </Text>
            <Text brand="Cars24" as="strong" size="md">
              Large
            </Text>
          </div>

          <div style={matrixStyles}>
            {rows.flatMap((row) => [
              <div key={`${row.label}-label`} style={rowLabelStyles}>
                {row.label}
              </div>,
              <TextInput key={`${row.label}-small`} {...row.small} />,
              <TextInput key={`${row.label}-large`} {...row.large} />
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ThemeShowcaseStory() {
  return (
    <StoryPage>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <header style={{ display: "grid", gap: 6 }}>
            <Text brand="Cars24" as="strong" size="md">
              Theme Coverage
            </Text>
            <Text brand="Cars24" as="span" size="xs" tone="secondary">
              Same typed state rendered across all supported brand themes.
            </Text>
          </header>

          <div style={{ display: "grid", gap: 20 }}>
            {STORYBOOK_BRAND_OPTIONS.map((brand) => (
              <div key={brand} style={{ display: "grid", gap: 10, width: 328 }}>
                <Text brand={brand} as="strong" size="sm">
                  {brand}
                </Text>
                <TextInput
                  brand={brand}
                  helperText="Helper text"
                  label="Label"
                  prefixIconName="placeholder-generate-outline"
                  required
                  showHelperIcon
                  showLabelInfoIcon
                  size="Large"
                  suffixIconName="placeholder-generate-outline"
                  value="Input text"
                />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "120px repeat(2, minmax(328px, 1fr))",
  rowGap: 20,
  justifyContent: "center"
};

const matrixHeaderStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "120px repeat(2, minmax(328px, 1fr))"
};

const rowLabelStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px",
  paddingTop: 10
};

const textInputVariantsSourceCode = `<StoryPage fullscreen>
  <TextInput
    brand="Cars24"
    size="Small"
    label="Label"
    placeholder="Placeholder text"
    helperText="Helper text"
    prefixIconName="placeholder-generate-outline"
    suffixIconName="placeholder-generate-outline"
    required
    showHelperIcon
    showLabelInfoIcon
  />
</StoryPage>`;

const textInputUiExampleSourceCode = `<TextInput
  brand="Cars24"
  size="Small"
  label="Label"
  placeholder="Placeholder text"
  helperText="Helper text"
  prefixIconName="placeholder-generate-outline"
  suffixIconName="placeholder-generate-outline"
  required
  showHelperIcon
  showLabelInfoIcon
/>`;

const TEXT_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=6451-19520&t=1zgOyFpiLYMyM4XM-11";

const meta = {
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
  }
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory,
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: VariantMatrixStory,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: textInputVariantsSourceCode
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
        code: textInputUiExampleSourceCode
      }
    }
  }
};
