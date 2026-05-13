import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { BrandCard, type BrandCardProps, type BrandCardState } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryHeading, StoryPage } from "../storybook-shell";

const BRAND_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28551-3391&t=hFO1h296qgJvQhe9-11";

const states: BrandCardState[] = ["Rest", "Pressed"];

function PlaygroundStory(args: BrandCardProps) {
  return (
    <StoryPage>
      <StoryCard style={{ width: "fit-content" }}>
        <BrandCard {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function StateGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage>
      <StoryCard style={{ display: "grid", gap: 16, width: "fit-content" }}>
        <StoryHeading brand={activeBrand} size="lg">
          Brand Card
        </StoryHeading>
        <div style={stateGridStyles}>
          {states.map((state) => (
            <div key={state} style={stateCellStyles}>
              <span style={stateLabelStyles}>{state}</span>
              <BrandCard brand={activeBrand} label="Maruti Suzuki" state={state} />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const stateGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(2, max-content)"
};

const stateCellStyles: CSSProperties = {
  display: "grid",
  gap: 8
};

const stateLabelStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 12,
  lineHeight: "16px"
};

const brandCardSourceCode = `<BrandCard
  brand="Cars24"
  label="Maruti Suzuki"
  state="Rest"
/>`;

const meta: Meta<BrandCardProps> = {
  title: "Components/Brand Card",
  component: BrandCard,
  tags: ["autodocs"],
  parameters: {
    design: createFigspecDesign(BRAND_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    label: "Maruti Suzuki",
    state: "Rest"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    label: {
      control: "text"
    },
    state: {
      control: "radio",
      options: states
    },
    slot: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<BrandCardProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: brandCardSourceCode
      }
    }
  }
};

export const States: Story = {
  render: ({ brand }) => <StateGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
