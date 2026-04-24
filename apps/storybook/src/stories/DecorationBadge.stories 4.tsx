import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  DecorationBadge,
  type DecorationBadgeColor,
  type DecorationBadgeProps,
  type DecorationBadgeStyle,
  type DecorationBadgeType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const styleVariants: DecorationBadgeStyle[] = ["Style 1", "Style 2"];
const style1Colors: DecorationBadgeColor[] = [
  "Purple",
  "Yellow",
  "Red",
  "Gray",
  "Black",
  "Green"
];
const style2Types: DecorationBadgeType[] = [
  "GST Sale",
  "Price Drop",
  "Hot Deal",
  "Top picks",
  "Features",
  "Recommended",
  "New Stock",
  "In Demand",
  "Type15",
  "Upcoming",
  "Booked",
  "Reserved",
  "Under Service",
  "Sold"
];

const DECORATION_BADGE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=19889-18090&p=f&t=1zgOyFpiLYMyM4XM-11";

type DecorationBadgeStoryArgs = Omit<DecorationBadgeProps, "label" | "children"> & {
  label: string;
};

function PlaygroundStory(args: DecorationBadgeStoryArgs) {
  return <DecorationBadge {...args} label={args.label} />;
}

function Style1Gallery({
  brand,
  label,
  showIcon
}: {
  brand: DisplayBrandId;
  label: string;
  showIcon: boolean;
}) {
  return (
    <StoryPage>
      <StoryCard>
        <div style={style1GridStyles}>
          {style1Colors.map((color) => (
            <DecorationBadge
              key={color}
              brand={brand}
              color={color}
              label={label}
              showIcon={showIcon}
              styleVariant="Style 1"
            />
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function Style2Gallery({
  brand,
  showIcon
}: {
  brand: DisplayBrandId;
  showIcon: boolean;
}) {
  return (
    <StoryPage>
      <StoryCard>
        <div style={style2GridStyles}>
          {style2Types.map((type) => (
            <DecorationBadge
              key={type}
              brand={brand}
              showIcon={showIcon}
              styleVariant="Style 2"
              type={type}
            />
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildVariantsSourceCode(brand: DisplayBrandId) {
  return `import { DecorationBadge } from "@geist/web";

const style1Colors = ["Purple", "Yellow", "Red", "Gray", "Black", "Green"] as const;
const style2Types = [
  "GST Sale",
  "Price Drop",
  "Hot Deal",
  "Top picks",
  "Features",
  "Recommended",
  "New Stock",
  "In Demand",
  "Type15",
  "Upcoming",
  "Booked",
  "Reserved",
  "Under Service",
  "Sold"
] as const;

export function DecorationBadgeVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {style1Colors.map((color) => (
          <DecorationBadge key={color} brand="${brand}" styleVariant="Style 1" color={color} label="Label" />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {style2Types.map((type) => (
          <DecorationBadge key={type} brand="${brand}" styleVariant="Style 2" type={type} />
        ))}
      </div>
    </div>
  );
}`;
}

const style1GridStyles: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  justifyContent: "center"
};

const style2GridStyles: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  justifyContent: "center"
};

const meta: Meta<DecorationBadgeStoryArgs> = {
  title: "Components/Badges/Decoration Badge",
  component: DecorationBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(DECORATION_BADGE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    color: "Purple",
    label: "Label",
    showIcon: true,
    styleVariant: "Style 1",
    type: "GST Sale"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    styleVariant: {
      control: "inline-radio",
      options: styleVariants
    },
    color: {
      control: "inline-radio",
      options: style1Colors
    },
    type: {
      control: "select",
      options: style2Types
    },
    label: {
      control: "text"
    },
    showIcon: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<DecorationBadgeStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Style1Variants: Story = {
  render: (args) => <Style1Gallery brand={args.brand ?? "Cars24"} label={args.label} showIcon={args.showIcon ?? true} />,
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildVariantsSourceCode("Cars24")
      }
    }
  }
};

export const Style2Variants: Story = {
  render: (args) => <Style2Gallery brand={args.brand ?? "Cars24"} showIcon={args.showIcon ?? true} />,
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildVariantsSourceCode("Cars24")
      }
    }
  }
};
