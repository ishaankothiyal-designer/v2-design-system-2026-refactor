import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  OtpInput,
  Text,
  type OtpInputPreviewState,
  type OtpInputHelperTone,
  type OtpInputProps,
  type OtpInputSize,
  type OtpInputValidationState
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

const otpInputSizes: OtpInputSize[] = ["Small", "Large"];
const previewStates: OtpInputPreviewState[] = ["Rest", "Hover", "Active", "Typed", "Error", "Success", "Disabled"];
const validationStates: OtpInputValidationState[] = ["Default", "Error", "Success"];
const helperTones: OtpInputHelperTone[] = ["Default", "Error", "Success"];

type OtpInputStoryArgs = OtpInputProps;

function PlaygroundStory(args: OtpInputStoryArgs) {
  const [{ value }, updateArgs] = useArgs<OtpInputStoryArgs>();

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

function HeaderCell({ brand, label }: { brand: DisplayBrandId; label: string }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function StateMatrixStory({
  brand,
  disabled = false,
  forceState,
  helperTone,
  stateLabel,
  validationState,
  value
}: {
  brand: DisplayBrandId;
  disabled?: boolean;
  forceState?: OtpInputPreviewState;
  helperTone?: OtpInputHelperTone;
  stateLabel: string;
  validationState?: OtpInputValidationState;
  value?: string;
}) {
  const common = {
    ...stateStoryCommon,
    brand,
    disabled,
    ...(forceState ? { forceState } : {}),
    ...(helperTone ? { helperTone } : {}),
    ...(validationState ? { validationState } : {}),
    ...(value !== undefined ? { value } : {})
  } satisfies OtpInputProps;

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {otpInputSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={148}>
          <HeaderCell brand={brand} label={stateLabel} />
        </StoryMatrixRowLabelCell>
        {otpInputSizes.map((size) => (
          <StoryMatrixValueCell key={`${stateLabel}-${size}`} minHeight={148}>
            <OtpInput {...common} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildOtpInputStateSourceCode({
  disabled = false,
  forceState,
  helperTone,
  label,
  validationState,
  value
}: {
  disabled?: boolean;
  forceState?: OtpInputPreviewState;
  helperTone?: OtpInputHelperTone;
  label: string;
  validationState?: OtpInputValidationState;
  value?: string;
}) {
  return `import { OtpInput } from "@turbo/web";

export function OtpInput${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <OtpInput
        brand="Cars24"
        size="Small"
        label="Label"
        helperText="Helper text"
        length={6}
        required
        showHelperIcon
        showLabelInfoIcon
${disabled ? `        disabled\n` : ""}${forceState ? `        forceState="${forceState}"\n` : ""}${helperTone ? `        helperTone="${helperTone}"\n` : ""}${validationState ? `        validationState="${validationState}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
      <OtpInput
        brand="Cars24"
        size="Large"
        label="Label"
        helperText="Helper text"
        length={6}
        required
        showHelperIcon
        showLabelInfoIcon
${disabled ? `        disabled\n` : ""}${forceState ? `        forceState="${forceState}"\n` : ""}${helperTone ? `        helperTone="${helperTone}"\n` : ""}${validationState ? `        validationState="${validationState}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
    </div>
  );
}`;
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
  },
  render: PlaygroundStory
} satisfies Meta<typeof OtpInput>;

export default meta;

type Story = StoryObj<OtpInputStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" value="" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildOtpInputStateSourceCode({ forceState: "Rest", label: "Rest", value: "" }) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Hover" stateLabel="Hover" value="" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildOtpInputStateSourceCode({ forceState: "Hover", label: "Hover", value: "" }) } }
  }
};

export const Active: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Active" stateLabel="Active" value="6384" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildOtpInputStateSourceCode({ forceState: "Active", label: "Active", value: "6384" }) } }
  }
};

export const Typed: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Typed" stateLabel="Typed" value="638462" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildOtpInputStateSourceCode({ forceState: "Typed", label: "Typed", value: "638462" }) } }
  }
};

export const Error: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      forceState="Error"
      helperTone="Error"
      stateLabel="Error"
      validationState="Error"
      value="638460"
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildOtpInputStateSourceCode({
          forceState: "Error",
          helperTone: "Error",
          label: "Error",
          validationState: "Error",
          value: "638460"
        })
      }
    }
  }
};

export const Success: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      forceState="Success"
      helperTone="Success"
      stateLabel="Success"
      validationState="Success"
      value="638462"
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildOtpInputStateSourceCode({
          forceState: "Success",
          helperTone: "Success",
          label: "Success",
          validationState: "Success",
          value: "638462"
        })
      }
    }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} disabled forceState="Disabled" stateLabel="Disabled" value="" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildOtpInputStateSourceCode({ disabled: true, forceState: "Disabled", label: "Disabled", value: "" })
      }
    }
  }
};

export const ThemeCoverage: Story = {
  render: ThemeShowcaseStory,
  parameters: {
    controls: { disable: true }
  }
};
