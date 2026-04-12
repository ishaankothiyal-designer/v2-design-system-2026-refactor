import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  Text,
  Textarea,
  type TextareaPreviewState,
  type TextareaProps,
  type TextareaSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const textareaSizes: TextareaSize[] = ["Small", "Large"];
const previewStates: TextareaPreviewState[] = ["Rest", "Hover", "Typing", "Typed", "Disabled"];

function PlaygroundStory(args: TextareaProps) {
  const [{ value }, updateArgs] = useArgs<TextareaProps>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 328 }}>
      <Textarea
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
    maxLength: 250,
    placeholder: "Input text",
    showCharacterCounter: true,
    showHelperIcon: true
  } satisfies TextareaProps;

  const rows: Array<{
    label: string;
    small: TextareaProps;
    large: TextareaProps;
  }> = [
    {
      label: "Rest",
      small: { ...common, forceState: "Rest", size: "Small" },
      large: { ...common, forceState: "Rest", size: "Large" }
    },
    {
      label: "Hover",
      small: { ...common, forceState: "Hover", size: "Small", value: "" },
      large: { ...common, forceState: "Hover", size: "Large", value: "" }
    },
    {
      label: "Typing",
      small: { ...common, forceState: "Typing", size: "Small", value: "Input text" },
      large: { ...common, forceState: "Typing", size: "Large", value: "Input text" }
    },
    {
      label: "Typed",
      small: { ...common, forceState: "Typed", size: "Small", value: "Input text" },
      large: { ...common, forceState: "Typed", size: "Large", value: "Input text" }
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
              <Textarea key={`${row.label}-small`} {...row.small} />,
              <Textarea key={`${row.label}-large`} {...row.large} />
            ])}
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
  justifyContent: "center",
  rowGap: 20
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

const textareaVariantsSourceCode = `<StoryPage fullscreen>
  <Textarea
    brand="Cars24"
    size="Small"
    label="Label"
    placeholder="Input text"
    helperText="Helper text"
    maxLength={250}
    showCharacterCounter
    showHelperIcon
  />
</StoryPage>`;

const textareaUiExampleSourceCode = `<Textarea
  brand="Cars24"
  size="Small"
  label="Label"
  placeholder="Input text"
  helperText="Helper text"
  maxLength={250}
  showCharacterCounter
  showHelperIcon
/>`;

const TEXTAREA_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=1117-27231&t=1zgOyFpiLYMyM4XM-11";

const meta = {
  title: "Components/Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TEXTAREA_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    helperText: "Helper text",
    label: "Label",
    maxLength: 250,
    placeholder: "Input text",
    showCharacterCounter: true,
    showHelperIcon: true,
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: textareaSizes
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
    maxLength: {
      control: { type: "number", min: 0 }
    }
  }
} satisfies Meta<typeof Textarea>;

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
        code: textareaVariantsSourceCode
      }
    }
  }
};

export const UIExample: Story = {
  render: PlaygroundStory,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: textareaUiExampleSourceCode
      }
    },
    layout: "centered"
  }
};
