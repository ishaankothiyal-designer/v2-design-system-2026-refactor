import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { Label, type LabelProps, type LabelSize } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type LabelStoryArgs = Omit<LabelProps, "label" | "description"> & {
  label: string;
  description: string;
};

const sizes: LabelSize[] = ["Large", "Medium", "Small", "Extra Small"];

function HeaderCell({ label }: { label: string }) {
  return (
    <div style={{ color: "#64748B", fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>{label}</div>
  );
}

function PlaygroundStory(args: LabelStoryArgs) {
  return (
    <div style={{ width: 328 }}>
      <Label {...args} description={args.description || undefined} label={args.label} />
    </div>
  );
}

function VariantMatrixStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={matrixStyles}>
            <HeaderCell label="Size" />
            <HeaderCell label="Preview" />

            {sizes.flatMap((size) => [
              <HeaderCell key={`${size}-label`} label={size} />,
              <div key={`${size}-preview`} style={{ width: 328 }}>
                <Label
                  size={size}
                  label="Label"
                  description="Helpful description that could potentially wrap wrap to multiple lines"
                  required
                  showInfoIcon
                />
              </div>
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "180px minmax(0, 328px)",
  rowGap: 18,
  justifyContent: "center"
};

const labelVariantsSourceCode = `<StoryPage fullscreen>
  <Label
    brand="Cars24"
    size="Medium"
    label="Label"
    description="Helpful description that could potentially wrap to multiple lines"
    required
    showInfoIcon
  />
</StoryPage>`;

const labelUiExampleSourceCode = `<Label
  brand="Cars24"
  size="Medium"
  label="Label"
  description="Helpful description that could potentially wrap to multiple lines"
  required
  showInfoIcon
/>`;

const meta: Meta<LabelStoryArgs> = {
  title: "Components/Forms/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    size: "Medium",
    label: "Label",
    description: "Helpful description that could potentially wrap wrap to multiple lines",
    required: true,
    showInfoIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: sizes
    },
    label: {
      control: "text"
    },
    description: {
      control: "text"
    },
    required: {
      control: "boolean"
    },
    showInfoIcon: {
      control: "boolean"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<LabelStoryArgs>;

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
        code: labelVariantsSourceCode
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
        code: labelUiExampleSourceCode
      }
    }
  }
};
