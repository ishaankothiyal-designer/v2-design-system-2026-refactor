import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  OtpInput,
  type OtpInputHelperTone,
  type OtpInputProps,
  type OtpInputSize,
  type OtpInputValidationState
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const otpInputSizes: OtpInputSize[] = ["Small", "Large"];
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

function VariantMatrixStory() {
  const common = {
    brand: "Cars24" as const,
    label: "Label",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true
  };

  const rows: Array<{
    label: string;
    small: OtpInputProps;
    large: OtpInputProps;
  }> = [
    {
      label: "Default",
      small: { ...common, helperText: "Helper text", size: "Small", value: "" },
      large: { ...common, helperText: "Helper text", size: "Large", value: "" }
    },
    {
      label: "Typed",
      small: { ...common, helperText: "Helper text", size: "Small", value: "638462" },
      large: { ...common, helperText: "Helper text", size: "Large", value: "638462" }
    },
    {
      label: "Error",
      small: {
        ...common,
        helperText: "Helper text",
        helperTone: "Error",
        size: "Small",
        validationState: "Error",
        value: "638460"
      },
      large: {
        ...common,
        helperText: "Helper text",
        helperTone: "Error",
        size: "Large",
        validationState: "Error",
        value: "638460"
      }
    },
    {
      label: "Success",
      small: {
        ...common,
        helperText: "Helper text",
        helperTone: "Success",
        size: "Small",
        validationState: "Success",
        value: "638462"
      },
      large: {
        ...common,
        helperText: "Helper text",
        helperTone: "Success",
        size: "Large",
        validationState: "Success",
        value: "638462"
      }
    },
    {
      label: "Disabled",
      small: { ...common, disabled: true, helperText: "Helper text", size: "Small", value: "" },
      large: { ...common, disabled: true, helperText: "Helper text", size: "Large", value: "" }
    },
    {
      label: "Resend OTP",
      small: {
        ...common,
        resendActionLabel: "Resend OTP",
        resendPrompt: "Didn’t receive OTP?",
        size: "Small",
        value: ""
      },
      large: {
        ...common,
        resendActionLabel: "Resend OTP",
        resendPrompt: "Didn’t receive OTP?",
        size: "Large",
        value: ""
      }
    },
    {
      label: "OTP Timer",
      small: {
        ...common,
        size: "Small",
        timerPrompt: "Didn’t receive OTP? Resend in",
        timerValue: "23 seconds ..."
      },
      large: {
        ...common,
        size: "Large",
        timerPrompt: "Didn’t receive OTP? Resend in",
        timerValue: "23 seconds ..."
      }
    }
  ];

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <div style={matrixHeaderStyles}>
            <div />
            <strong>Small</strong>
            <strong>Large</strong>
          </div>

          <div style={matrixStyles}>
            {rows.flatMap((row) => [
              <div key={`${row.label}-label`} style={rowLabelStyles}>
                {row.label}
              </div>,
              <OtpInput key={`${row.label}-small`} {...row.small} />,
              <OtpInput key={`${row.label}-large`} {...row.large} />
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
            <strong>Theme Coverage</strong>
            <span style={{ color: "#64748B", fontSize: 12, lineHeight: "18px" }}>
              Same typed state rendered across all supported brand themes.
            </span>
          </header>

          <div style={{ display: "grid", gap: 20 }}>
            {STORYBOOK_BRAND_OPTIONS.map((brand) => (
              <div key={brand} style={{ display: "grid", gap: 10, width: "fit-content" }}>
                <strong style={{ fontSize: 14, lineHeight: "20px" }}>{brand}</strong>
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
  color: "#0F172A",
  columnGap: 24,
  display: "grid",
  fontSize: 14,
  gridTemplateColumns: "120px repeat(2, minmax(328px, 1fr))"
};

const rowLabelStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px",
  paddingTop: 10
};

const OTP_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=4744-19129&t=1zgOyFpiLYMyM4XM-11";

const meta = {
  title: "Components/OTP Input",
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

export const Variants: Story = {
  render: VariantMatrixStory,
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
