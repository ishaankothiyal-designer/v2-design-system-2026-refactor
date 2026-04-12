import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { HelperText, Text, type HelperTextProps, type HelperTextSize, type HelperTextTone } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
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

function HeaderCell({ label }: { label: string }) {
  return (
    <Text brand="Cars24" as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
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

function VariantMatrixStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={matrixStyles}>
          <div />
          {helperTextSizes.map((size) => (
            <HeaderCell key={`${brand}-${size}-header`} label={size} />
          ))}

          {helperTextTones.flatMap((tone) => [
            <HeaderCell key={`${brand}-${tone}-label`} label={tone} />,
            ...helperTextSizes.map((size) => (
              <VariantCell
                key={`${brand}-${tone}-${size}`}
                brand={brand}
                size={size}
                tone={tone}
              />
            ))
          ])}
        </div>
      </StoryCard>
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
              <HeaderCell key={`${brand}-${size}-counter-header`} label={size} />
            ))}
            <HeaderCell label="With Counter" />
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
              <HeaderCell key={`${brand}-${size}-text-only-header`} label={size} />
            ))}
            <HeaderCell label="Without Icon" />
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

const matrixStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "140px repeat(2, minmax(328px, 1fr))",
  rowGap: 20,
  justifyContent: "center"
};

const counterMatrixStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "140px repeat(2, minmax(328px, 1fr))",
  rowGap: 16,
  justifyContent: "center"
};

const helperTextVariantsSourceCode = `<StoryPage fullscreen>
  <HelperText brand="Cars24" size="Small" tone="Default" helperText="Helper text" />
</StoryPage>`;

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

export const Cars24: Story = {
  render: () => <VariantMatrixStory brand="Cars24" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: helperTextVariantsSourceCode
      }
    }
  }
};

export const TeamBHP: Story = {
  render: () => <VariantMatrixStory brand="Team BHP" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: helperTextVariantsSourceCode.replaceAll('"Cars24"', '"Team BHP"')
      }
    }
  }
};

export const CarInfo: Story = {
  render: () => <VariantMatrixStory brand="CarInfo" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: helperTextVariantsSourceCode.replaceAll('"Cars24"', '"CarInfo"')
      }
    }
  }
};

export const VehicleInfo: Story = {
  render: () => <VariantMatrixStory brand="VehicleInfo" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: helperTextVariantsSourceCode.replaceAll('"Cars24"', '"VehicleInfo"')
      }
    }
  }
};

export const OptionalVariants: Story = {
  render: () => <CounterStory brand="Cars24" />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: helperTextCounterSourceCode
      }
    }
  }
};
