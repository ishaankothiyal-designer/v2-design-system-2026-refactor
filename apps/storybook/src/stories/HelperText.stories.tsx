import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { HelperText, Text, type HelperTextProps, type HelperTextSize, type HelperTextTone } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

const helperTextSizes: HelperTextSize[] = ["Small", "Large"];
const helperTextTones: HelperTextTone[] = ["Default", "Error", "Success"];

type HelperTextStoryArgs = Omit<HelperTextProps, "helperText" | "counterText"> & {
  counterText: string;
  helperText: string;
};

function PlaygroundStory(args: HelperTextStoryArgs) {
  return (
    <div style={{ width: 328 }}>
      <HelperText
        {...args}
        counterText={args.counterText || undefined}
        helperText={args.helperText}
      />
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

function VariantCell({
  brand,
  size,
  tone
}: {
  brand: DisplayBrandId;
  size: HelperTextSize;
  tone: HelperTextTone;
}) {
  return (
    <div style={{ width: 328 }}>
      <HelperText
        brand={brand}
        helperText="Helper text"
        size={size}
        tone={tone}
      />
    </div>
  );
}

function ToneMatrixStory({
  brand,
  tone
}: {
  brand: DisplayBrandId;
  tone: HelperTextTone;
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="160px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {helperTextSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${brand}-${tone}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={104}>
          <HeaderCell brand={brand} label={tone} />
        </StoryMatrixRowLabelCell>
        {helperTextSizes.map((size) => (
          <StoryMatrixValueCell key={`${brand}-${tone}-${size}`} minHeight={104}>
            <VariantCell brand={brand} size={size} tone={tone} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function CounterStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <div style={counterMatrixStyles}>
            <div />
            {helperTextSizes.map((size) => (
              <HeaderCell brand={brand} key={`${brand}-${size}-counter-header`} label={size} />
            ))}
            <HeaderCell brand={brand} label="With Counter" />
            {helperTextSizes.map((size) => (
              <div key={`${brand}-${size}-counter`} style={{ width: 328 }}>
                <HelperText
                  brand={brand}
                  counterText="0/500"
                  helperText="Helper text"
                  size={size}
                  tone="Default"
                />
              </div>
            ))}
          </div>

          <div style={counterMatrixStyles}>
            <div />
            {helperTextSizes.map((size) => (
              <HeaderCell brand={brand} key={`${brand}-${size}-text-only-header`} label={size} />
            ))}
            <HeaderCell brand={brand} label="Without Icon" />
            {helperTextSizes.map((size) => (
              <div key={`${brand}-${size}-text-only`} style={{ width: 328 }}>
                <HelperText
                  brand={brand}
                  helperText="Helper text"
                  showIcon={false}
                  size={size}
                  tone="Default"
                />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const counterMatrixStyles = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "140px repeat(2, minmax(328px, 1fr))",
  rowGap: 16,
  justifyContent: "center"
} as const;

function buildHelperTextToneSourceCode(tone: HelperTextTone) {
  return `import { HelperText } from "@geist/web";

export function HelperText${tone}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <HelperText
        brand="Cars24"
        size="Small"
        tone="${tone}"
        helperText="Helper text"
      />
      <HelperText
        brand="Cars24"
        size="Large"
        tone="${tone}"
        helperText="Helper text"
      />
    </div>
  );
}`;
}

const helperTextCounterSourceCode = `<HelperText
  brand="Cars24"
  size="Large"
  tone="Default"
  helperText="Helper text"
  counterText="0/500"
/>`;

const HELPER_TEXT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14859-11150&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<HelperTextStoryArgs> = {
  title: "Components/Forms/Helper Text",
  component: HelperText,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(HELPER_TEXT_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    counterText: "",
    helperText: "Helper text",
    showIcon: true,
    size: "Small",
    tone: "Default"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: helperTextSizes
    },
    tone: {
      control: "inline-radio",
      options: helperTextTones
    },
    helperText: {
      control: "text"
    },
    counterText: {
      control: "text"
    },
    showIcon: {
      control: "boolean"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<HelperTextStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Default: Story = {
  render: ({ brand = "Cars24" }) => <ToneMatrixStory brand={brand} tone="Default" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildHelperTextToneSourceCode("Default")
      }
    }
  }
};

export const Error: Story = {
  render: ({ brand = "Cars24" }) => <ToneMatrixStory brand={brand} tone="Error" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildHelperTextToneSourceCode("Error")
      }
    }
  }
};

export const Success: Story = {
  render: ({ brand = "Cars24" }) => <ToneMatrixStory brand={brand} tone="Success" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildHelperTextToneSourceCode("Success")
      }
    }
  }
};

export const OptionalVariants: Story = {
  render: ({ brand = "Cars24" }) => <CounterStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: helperTextCounterSourceCode
      }
    }
  }
};
