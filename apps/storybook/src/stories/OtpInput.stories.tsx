import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  OtpInput,
  Text,
  type OtpInputPreviewState,
  type OtpInputHelperTone,
  type OtpInputProps,
  type OtpInputSize,
  type OtpInputValidationState
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const otpInputSizes: OtpInputSize[] = ["Small", "Large"];
const previewStates: OtpInputPreviewState[] = ["Rest", "Hover", "Active", "Typed", "Error", "Success", "Disabled"];
const validationStates: OtpInputValidationState[] = ["Default", "Error", "Success"];
const helperTones: OtpInputHelperTone[] = ["Default", "Error", "Success"];

function PlaygroundStory(args: OtpInputProps) {
  const [{ value }, updateArgs] = useArgs<OtpInputProps>();

  return (
    <div style={{ width: "fit-content" }}>
      <OtpInput
        {...args}
        {...(value !== undefined ? { value } : {})}
        onValueChange={(nextValue) => {
          updateArgs({ value: nextValue });
          args.onValueChange?.(nextValue);
        }}
      />
    </div>
  );
}

const stateStoryCommon = {
  brand: "Cars24" as const,
  helperText: "Helper text",
  label: "Label",
  required: true,
  showHelperIcon: true,
  showLabelInfoIcon: true
};

function SizePairStory({ small, large }: { small: OtpInputProps; large: OtpInputProps }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <div style={pairHeaderStyles}>
            <Text brand="Cars24" as="strong" size="md">
              Small
            </Text>
            <Text brand="Cars24" as="strong" size="md">
              Large
            </Text>
          </div>

          <div style={pairStyles}>
            <OtpInput {...small} />
            <OtpInput {...large} />
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
              <div key={brand} style={{ display: "grid", gap: 10, width: "fit-content" }}>
                <Text brand={brand} as="strong" size="sm">
                  {brand}
                </Text>
                <OtpInput
                  brand={brand}
                  helperText="Helper text"
                  label="Label"
                  required
                  showHelperIcon
                  showLabelInfoIcon
                  size="Large"
                  value="638462"
                />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const pairStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(328px, 1fr))",
  justifyContent: "center"
};

const pairHeaderStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(328px, 1fr))"
};

const OTP_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=4744-19129&t=1zgOyFpiLYMyM4XM-11";

const meta = {
  title: "Components/Forms/OTP",
  component: OtpInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(OTP_INPUT_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    helperText: "Helper text",
    label: "Label",
    length: 6,
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small",
    validationState: "Default",
    value: ""
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: otpInputSizes
    },
    validationState: {
      control: "inline-radio",
      options: validationStates
    },
    forceState: {
      control: "select",
      options: [undefined, ...previewStates]
    },
    helperTone: {
      control: "inline-radio",
      options: helperTones
    },
    label: {
      control: "text"
    },
    helperText: {
      control: "text"
    },
    value: {
      control: "text"
    },
    resendPrompt: {
      control: "text"
    },
    resendActionLabel: {
      control: "text"
    },
    timerPrompt: {
      control: "text"
    },
    timerValue: {
      control: "text"
    },
    onValueChange: {
      action: "value changed"
    },
    onComplete: {
      action: "completed"
    },
    onResendActionClick: {
      action: "resend clicked"
    }
  }
} satisfies Meta<typeof OtpInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory,
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: () => (
    <SizePairStory
      small={{ ...stateStoryCommon, forceState: "Rest", size: "Small", value: "" }}
      large={{ ...stateStoryCommon, forceState: "Rest", size: "Large", value: "" }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const Hover: Story = {
  render: () => (
    <SizePairStory
      small={{ ...stateStoryCommon, forceState: "Hover", size: "Small", value: "" }}
      large={{ ...stateStoryCommon, forceState: "Hover", size: "Large", value: "" }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const Active: Story = {
  render: () => (
    <SizePairStory
      small={{ ...stateStoryCommon, forceState: "Active", size: "Small", value: "6384" }}
      large={{ ...stateStoryCommon, forceState: "Active", size: "Large", value: "6384" }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const Typed: Story = {
  render: () => (
    <SizePairStory
      small={{ ...stateStoryCommon, forceState: "Typed", size: "Small", value: "638462" }}
      large={{ ...stateStoryCommon, forceState: "Typed", size: "Large", value: "638462" }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const Error: Story = {
  render: () => (
    <SizePairStory
      small={{
        ...stateStoryCommon,
        forceState: "Error",
        helperTone: "Error",
        size: "Small",
        validationState: "Error",
        value: "638460"
      }}
      large={{
        ...stateStoryCommon,
        forceState: "Error",
        helperTone: "Error",
        size: "Large",
        validationState: "Error",
        value: "638460"
      }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const Success: Story = {
  render: () => (
    <SizePairStory
      small={{
        ...stateStoryCommon,
        forceState: "Success",
        helperTone: "Success",
        size: "Small",
        validationState: "Success",
        value: "638462"
      }}
      large={{
        ...stateStoryCommon,
        forceState: "Success",
        helperTone: "Success",
        size: "Large",
        validationState: "Success",
        value: "638462"
      }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const Disabled: Story = {
  render: () => (
    <SizePairStory
      small={{ ...stateStoryCommon, disabled: true, forceState: "Disabled", size: "Small", value: "" }}
      large={{ ...stateStoryCommon, disabled: true, forceState: "Disabled", size: "Large", value: "" }}
    />
  ),
  parameters: {
    controls: { disable: true }
  }
};

export const ThemeCoverage: Story = {
  render: ThemeShowcaseStory,
  parameters: {
    controls: { disable: true }
  }
};
