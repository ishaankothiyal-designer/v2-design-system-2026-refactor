import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  type PhoneInputCountry,
  PhoneInput,
  type PhoneInputHelperTone,
  type PhoneInputPreviewState,
  type PhoneInputProps,
  type PhoneInputSize
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

const phoneInputSizes: PhoneInputSize[] = ["Small", "Large"];
const previewStates: PhoneInputPreviewState[] = ["Rest", "Hover", "Active", "Typing", "Filled"];
const helperTones: PhoneInputHelperTone[] = ["Default", "Destructive"];
const phoneInputCountries: PhoneInputCountry[] = ["India", "UAE", "Australia"];

function PlaygroundStory(args: PhoneInputProps) {
  return (
    <div style={{ width: 328 }}>
      <PhoneInput {...args} />
    </div>
  );
}

function VariantMatrixStory() {
  const common = {
    brand: "Cars24" as const,
    country: "India" as const,
    label: "Label",
    placeholder: "9876543210",
    required: true,
    showCountryChevron: true,
    showLabelInfoIcon: true
  };

  const rows = [
    {
      small: {
        ...common,
        size: "Small" as const,
        forceState: "Rest" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true
      },
      large: {
        ...common,
        size: "Large" as const,
        forceState: "Rest" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true
      }
    },
    {
      small: {
        ...common,
        size: "Small" as const,
        forceState: "Hover" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true
      },
      large: {
        ...common,
        size: "Large" as const,
        forceState: "Hover" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true
      }
    },
    {
      small: {
        ...common,
        size: "Small" as const,
        forceState: "Active" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        value: ""
      },
      large: {
        ...common,
        size: "Large" as const,
        forceState: "Active" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        value: ""
      }
    },
    {
      small: {
        ...common,
        size: "Small" as const,
        forceState: "Typing" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        value: "980"
      },
      large: {
        ...common,
        size: "Large" as const,
        forceState: "Typing" as const,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        value: "980"
      }
    },
    {
      small: {
        ...common,
        destructive: true,
        helperText: "Helper text",
        helperTone: "Destructive" as const,
        showHelperIcon: false,
        size: "Small" as const
      },
      large: {
        ...common,
        destructive: true,
        helperText: "Helper text",
        helperTone: "Destructive" as const,
        showHelperIcon: true,
        size: "Large" as const
      }
    },
    {
      small: {
        ...common,
        destructive: true,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        size: "Small" as const,
        value: "9806578901",
        forceState: "Filled" as const
      },
      large: {
        ...common,
        destructive: true,
        helperText: "Helper text",
        helperTone: "Destructive" as const,
        showHelperIcon: true,
        size: "Large" as const,
        value: "9806578901",
        forceState: "Filled" as const
      }
    },
    {
      small: {
        ...common,
        disabled: true,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        size: "Small" as const
      },
      large: {
        ...common,
        disabled: true,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        size: "Large" as const
      }
    },
    {
      small: {
        ...common,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        size: "Small" as const,
        value: "9806578901",
        forceState: "Filled" as const
      },
      large: {
        ...common,
        helperText: "Helper text",
        helperTone: "Default" as const,
        showHelperIcon: true,
        size: "Large" as const,
        value: "9806578901",
        forceState: "Filled" as const
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
            {rows.flatMap((row, index) => [
              <div key={`label-${index}`} style={rowLabelStyles}>
                Row {index + 1}
              </div>,
              <PhoneInput key={`small-${index}`} {...row.small} />,
              <PhoneInput key={`large-${index}`} {...row.large} />
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function CountrySupportStory() {
  return (
    <StoryPage>
      <StoryCard>
        <div style={{ display: "grid", gap: 20, width: 138 }}>
          <header style={{ display: "grid", gap: 6 }}>
            <strong>Country Support</strong>
            <span style={{ color: "#64748B", fontSize: 12, lineHeight: "18px" }}>
              Prefix variants from the Figma country dial set.
            </span>
          </header>

          <div style={{ display: "grid", gap: 10 }}>
            {phoneInputCountries.map((country) => (
              <div
                key={country}
                style={{
                  alignItems: "center",
                  border: "1px dashed #C4B5FD",
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "flex-start",
                  minHeight: 44,
                  padding: "0 8px"
                }}
              >
                <PhoneInput
                  country={country}
                  placeholder=""
                  showAction={false}
                  value=""
                />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixHeaderStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "64px repeat(2, minmax(328px, 1fr))"
};

const matrixStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "64px repeat(2, minmax(328px, 1fr))",
  rowGap: 24,
  justifyContent: "center"
};

const rowLabelStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 12,
  lineHeight: "18px",
  paddingTop: 8
};

const phoneInputVariantsSourceCode = `<StoryPage fullscreen>
  <PhoneInput
    brand="Cars24"
    size="Small"
    label="Label"
    placeholder="9876543210"
    helperText="Helper text"
    required
    showCountryChevron
    showHelperIcon
    showLabelInfoIcon
    defaultCountry="India"
  />
</StoryPage>`;

const phoneInputUiExampleSourceCode = `<PhoneInput
  brand="Cars24"
  size="Small"
  label="Label"
  placeholder="9876543210"
  helperText="Helper text"
  required
  showCountryChevron
  showHelperIcon
  showLabelInfoIcon
  defaultCountry="India"
/>`;

const meta: Meta<PhoneInputProps> = {
  title: "Components/Phone Input",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    defaultCountry: "India",
    defaultValue: "",
    helperText: "Helper text",
    helperTone: "Default",
    label: "Label",
    placeholder: "9876543210",
    required: true,
    showCountryChevron: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: phoneInputSizes
    },
    disabled: {
      control: "inline-radio",
      options: [false, true]
    },
    showAction: {
      control: "inline-radio",
      options: ["Auto", "Hidden", "Visible"],
      mapping: {
        Auto: undefined,
        Hidden: false,
        Visible: true
      }
    },
    defaultCountry: {
      control: "inline-radio",
      options: phoneInputCountries
    },
    availableCountries: {
      control: false,
      table: {
        disable: true
      }
    },
    country: {
      control: "select",
      options: [undefined, ...phoneInputCountries]
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
    defaultValue: {
      control: "text"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<PhoneInputProps>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: () => <VariantMatrixStory />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: phoneInputVariantsSourceCode
      }
    }
  }
};

export const UIExample: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: phoneInputUiExampleSourceCode
      }
    }
  }
};
