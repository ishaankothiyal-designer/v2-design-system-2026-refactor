import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  RegInput,
  Text,
  type RegInputHelperTone,
  type RegInputTrailingAction,
  type RegInputPreviewState,
  type RegInputProps,
  type RegInputSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const regInputSizes: RegInputSize[] = ["Small", "Large"];
const previewStates: RegInputPreviewState[] = ["Rest", "Hover", "Active", "Typing", "Filled", "Disabled"];
const helperTones: RegInputHelperTone[] = ["Default", "Destructive"];
const trailingActions: RegInputTrailingAction[] = ["Camera", "Dismiss", "Search"];

function PlaygroundStory(args: RegInputProps) {
  const [{ value }, updateArgs] = useArgs<RegInputProps>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 443 }}>
      <RegInput
        {...args}
        {...(isControlled ? { value } : {})}
        onChange={handleChange}
      />
    </div>
  );
}

function VariantMatrixStory() {
  const common = {
    badgeLabel: "IND",
    brand: "Cars24" as const,
    helperText: "Helper text",
    label: "Label",
    placeholder: "(e.g. AB 12 CD 3456)",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true
  };

  const rows: Array<{
    label: string;
    small: RegInputProps;
    large: RegInputProps;
  }> = [
    {
      label: "Rest",
      small: { ...common, forceState: "Rest", size: "Small", trailingAction: "Camera" },
      large: { ...common, forceState: "Rest", size: "Large", trailingAction: "Camera" }
    },
    {
      label: "Destructive",
      small: {
        ...common,
        destructive: true,
        forceState: "Rest",
        helperTone: "Destructive",
        size: "Small",
        trailingAction: "Camera"
      },
      large: {
        ...common,
        destructive: true,
        forceState: "Rest",
        helperTone: "Destructive",
        size: "Large",
        trailingAction: "Camera"
      }
    },
    {
      label: "Filled",
      small: { ...common, forceState: "Filled", size: "Small", trailingAction: "Dismiss", value: "AB12CD3456" },
      large: { ...common, forceState: "Filled", size: "Large", trailingAction: "Dismiss", value: "AB12CD3456" }
    },
    {
      label: "Destructive Filled",
      small: {
        ...common,
        destructive: true,
        forceState: "Filled",
        helperTone: "Destructive",
        size: "Small",
        trailingAction: "Dismiss",
        value: "AB12CD3456"
      },
      large: {
        ...common,
        destructive: true,
        forceState: "Filled",
        helperTone: "Destructive",
        size: "Large",
        trailingAction: "Dismiss",
        value: "AB12CD3456"
      }
    },
    {
      label: "Active",
      small: { ...common, forceState: "Active", size: "Small", trailingAction: "Camera", value: "" },
      large: { ...common, forceState: "Active", size: "Large", trailingAction: "Camera", value: "" }
    },
    {
      label: "Typing",
      small: { ...common, forceState: "Typing", size: "Small", trailingAction: "Dismiss", value: "AB12" },
      large: { ...common, forceState: "Typing", size: "Large", trailingAction: "Dismiss", value: "AB12" }
    },
    {
      label: "Hover",
      small: { ...common, forceState: "Hover", size: "Small", trailingAction: "Camera" },
      large: { ...common, forceState: "Hover", size: "Large", trailingAction: "Camera" }
    },
    {
      label: "Disabled",
      small: { ...common, forceState: "Disabled", size: "Small", trailingAction: "Camera" },
      large: { ...common, forceState: "Disabled", size: "Large", trailingAction: "Camera" }
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
              <RegInput key={`${row.label}-small`} {...row.small} />,
              <RegInput key={`${row.label}-large`} {...row.large} />
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
  gridTemplateColumns: "160px repeat(2, minmax(443px, 1fr))",
  rowGap: 24,
  justifyContent: "center"
};

const matrixHeaderStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "160px repeat(2, minmax(443px, 1fr))"
};

const rowLabelStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px",
  paddingTop: 10
};

const regInputVariantsSourceCode = `<StoryPage fullscreen>
  <RegInput
    brand="Cars24"
    size="Small"
    label="Label"
    placeholder="(e.g. AB 12 CD 3456)"
    helperText="Helper text"
    required
    showHelperIcon
    showLabelInfoIcon
  />
</StoryPage>`;

const regInputUiExampleSourceCode = `<RegInput
  brand="Cars24"
  size="Small"
  label="Label"
  placeholder="(e.g. AB 12 CD 3456)"
  helperText="Helper text"
  trailingAction="Search"
  required
  showHelperIcon
  showLabelInfoIcon
/>`;

const REG_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=2318-38875&t=1zgOyFpiLYMyM4XM-11";

const meta = {
  title: "Components/Forms/Reg Number",
  component: RegInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(REG_INPUT_FIGMA_URL)
  },
  args: {
    badgeLabel: "IND",
    brand: "Cars24",
    helperText: "Helper text",
    helperTone: "Default",
    label: "Label",
    placeholder: "(e.g. AB 12 CD 3456)",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small",
    trailingAction: "Camera"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: regInputSizes
    },
    forceState: {
      control: "select",
      options: [undefined, ...previewStates]
    },
    helperTone: {
      control: "inline-radio",
      options: helperTones
    },
    trailingAction: {
      control: "inline-radio",
      options: trailingActions
    },
    badgeLabel: {
      control: "text"
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
    }
  }
} satisfies Meta<typeof RegInput>;

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
        code: regInputVariantsSourceCode
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
        code: regInputUiExampleSourceCode
      }
    }
  }
};
