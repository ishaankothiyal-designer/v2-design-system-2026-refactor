import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  Dropdown,
  Text,
  type DropdownHelperTone,
  type DropdownPreviewState,
  type DropdownProps,
  type DropdownSize,
  type DropdownValidationState
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const dropdownSizes: DropdownSize[] = ["Small", "Large"];
const previewStates: DropdownPreviewState[] = ["Rest", "Active", "Selected", "Error", "Disabled"];
const validationStates: DropdownValidationState[] = ["Default", "Error"];
const helperTones: DropdownHelperTone[] = ["Default", "Error"];

function PlaygroundStory(args: DropdownProps) {
  const [{ value }, updateArgs] = useArgs<DropdownProps>();

  function handleSelect() {
    updateArgs({
      value: value ? "" : "Selected option"
    });
  }

  return (
    <div style={{ width: 328 }}>
      <Dropdown
        {...args}
        onClick={handleSelect}
      />
    </div>
  );
}

function VariantMatrixStory() {
  const common = {
    brand: "Cars24" as const,
    helperText: "Helper text",
    label: "Label",
    placeholder: "Input text",
    prefixIconName: "placeholder-generate-outline" as const,
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true
  };

  const rows: Array<{
    label: string;
    small: DropdownProps;
    large: DropdownProps;
  }> = [
    {
      label: "Rest",
      small: { ...common, forceState: "Rest", size: "Small" },
      large: { ...common, forceState: "Rest", size: "Large" }
    },
    {
      label: "Active",
      small: { ...common, forceState: "Active", size: "Small" },
      large: { ...common, forceState: "Active", size: "Large" }
    },
    {
      label: "Selected",
      small: { ...common, forceState: "Selected", size: "Small", value: "Input text" },
      large: { ...common, forceState: "Selected", size: "Large", value: "Input text" }
    },
    {
      label: "Error",
      small: {
        ...common,
        forceState: "Error",
        helperTone: "Error",
        size: "Small",
        value: "Input text"
      },
      large: {
        ...common,
        forceState: "Error",
        helperTone: "Default",
        size: "Large",
        value: "Input text"
      }
    },
    {
      label: "Disabled",
      small: { ...common, forceState: "Disabled", size: "Small" },
      large: { ...common, forceState: "Disabled", size: "Large" }
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
              <Dropdown key={`${row.label}-small`} {...row.small} />,
              <Dropdown key={`${row.label}-large`} {...row.large} />
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
              Selected dropdown state rendered across all supported brand themes.
            </Text>
          </header>

          <div style={{ display: "grid", gap: 20 }}>
            {STORYBOOK_BRAND_OPTIONS.map((brand) => (
              <div key={brand} style={{ display: "grid", gap: 10, width: 328 }}>
                <Text brand={brand} as="strong" size="sm">
                  {brand}
                </Text>
                <Dropdown
                  brand={brand}
                  helperText="Helper text"
                  label="Label"
                  placeholder="Input text"
                  prefixIconName="placeholder-generate-outline"
                  required
                  showHelperIcon
                  showLabelInfoIcon
                  size="Large"
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

const dropdownVariantsSourceCode = `<StoryPage fullscreen>
  <Dropdown
    brand="Cars24"
    size="Small"
    label="Label"
    placeholder="Input text"
    helperText="Helper text"
    prefixIconName="placeholder-generate-outline"
    required
    showHelperIcon
    showLabelInfoIcon
  />
</StoryPage>`;

const dropdownUiExampleSourceCode = `<Dropdown
  brand="Cars24"
  size="Small"
  label="Label"
  placeholder="Input text"
  helperText="Helper text"
  prefixIconName="placeholder-generate-outline"
  required
  showHelperIcon
  showLabelInfoIcon
/>`;

const DROPDOWN_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14175-3650&t=1zgOyFpiLYMyM4XM-11";

const meta = {
  title: "Components/Forms/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(DROPDOWN_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    helperText: "Helper text",
    label: "Label",
    placeholder: "Input text",
    prefixIconName: "placeholder-generate-outline",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small",
    validationState: "Default"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: dropdownSizes
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
    }
  }
} satisfies Meta<typeof Dropdown>;

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
        code: dropdownVariantsSourceCode
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
        code: dropdownUiExampleSourceCode
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
