import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { Text, Textarea, type TextareaPreviewState, type TextareaProps, type TextareaSize } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const textareaSizes: TextareaSize[] = ["Small", "Large"];
const previewStates: TextareaPreviewState[] = ["Rest", "Hover", "Typing", "Typed", "Disabled"];

type TextareaStoryArgs = TextareaProps;

function PlaygroundStory(args: TextareaStoryArgs) {
  const [{ value }, updateArgs] = useArgs<TextareaStoryArgs>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 328 }}>
      <Textarea {...args} {...(isControlled ? { value } : {})} onChange={handleChange} />
    </div>
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
  forceState,
  stateLabel,
  value
}: {
  brand: DisplayBrandId;
  forceState: TextareaPreviewState;
  stateLabel: string;
  value?: string;
}) {
  const common = {
    brand,
    forceState,
    helperText: "Helper text",
    label: "Label",
    maxLength: 250,
    placeholder: "Input text",
    showCharacterCounter: true,
    showHelperIcon: true,
    ...(value !== undefined ? { value } : {})
  } satisfies TextareaProps;

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {textareaSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={112}>
          <HeaderCell brand={brand} label={stateLabel} />
        </StoryMatrixRowLabelCell>
        {textareaSizes.map((size) => (
          <StoryMatrixValueCell key={`${stateLabel}-${size}`} minHeight={112}>
            <Textarea {...common} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildTextareaStateSourceCode({
  forceState,
  label,
  value
}: {
  forceState: TextareaPreviewState;
  label: string;
  value?: string;
}) {
  return `import { Textarea } from "@turbo/web";

export function Textarea${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Textarea
        brand="Cars24"
        size="Small"
        forceState="${forceState}"
        label="Label"
        placeholder="Input text"
        helperText="Helper text"
        maxLength={250}
        showCharacterCounter
        showHelperIcon
${value !== undefined ? `        value="${value}"\n` : ""}      />
      <Textarea
        brand="Cars24"
        size="Large"
        forceState="${forceState}"
        label="Label"
        placeholder="Input text"
        helperText="Helper text"
        maxLength={250}
        showCharacterCounter
        showHelperIcon
${value !== undefined ? `        value="${value}"\n` : ""}      />
    </div>
  );
}`;
}

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

const meta: Meta<TextareaStoryArgs> = {
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
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<TextareaStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextareaStateSourceCode({ forceState: "Rest", label: "Rest" }) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Hover" stateLabel="Hover" value="" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextareaStateSourceCode({ forceState: "Hover", label: "Hover", value: "" }) } }
  }
};

export const Typing: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Typing" stateLabel="Typing" value="Input text" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextareaStateSourceCode({ forceState: "Typing", label: "Typing", value: "Input text" }) } }
  }
};

export const Typed: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Typed" stateLabel="Typed" value="Input text" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextareaStateSourceCode({ forceState: "Typed", label: "Typed", value: "Input text" }) } }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Disabled" stateLabel="Disabled" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildTextareaStateSourceCode({ forceState: "Disabled", label: "Disabled" }) } }
  }
};

export const UIExample: Story = {
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
