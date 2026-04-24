import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  CounterBadge,
  type CounterBadgeColor,
  type CounterBadgeProps,
  type CounterBadgeSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const counterBadgeColors: CounterBadgeColor[] = ["Brand", "Green", "Red", "White"];
const counterBadgeSizes: CounterBadgeSize[] = ["Small", "Large"];

type CounterBadgeStoryArgs = Omit<CounterBadgeProps, "children"> & {
  label: string;
};

const COUNTER_BADGE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=11725-27822&t=1zgOyFpiLYMyM4XM-11";

function PlaygroundStory(args: CounterBadgeStoryArgs) {
  return <CounterBadge {...args}>{args.label}</CounterBadge>;
}

function VariantMatrixStory({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={matrixStyles}>
          <HeaderCell label="Color" />
          <HeaderCell label="Small" />
          <HeaderCell label="Large" />

          {counterBadgeColors.flatMap((color) => [
            <ColorCell key={`${color}-label`} label={color} />,
            <PreviewCell key={`${color}-small`}>
              <CounterBadge brand={brand} color={color} size="Small">
                {label}
              </CounterBadge>
            </PreviewCell>,
            <PreviewCell key={`${color}-large`}>
              <CounterBadge brand={brand} color={color} size="Large">
                {label}
              </CounterBadge>
            </PreviewCell>
          ])}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function HeaderCell({ label }: { label: string }) {
  return <div style={headerCellStyles}>{label}</div>;
}

function ColorCell({ label }: { label: string }) {
  return <div style={colorCellStyles}>{label}</div>;
}

function PreviewCell({ children }: { children: ReactNode }) {
  return <div style={previewCellStyles}>{children}</div>;
}

function buildVariantsSourceCode(brand: DisplayBrandId, label: string) {
  return `import { CounterBadge } from "@geist/web";

const colors = ["Brand", "Green", "Red", "White"] as const;

export function CounterBadgeVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {colors.map((color) => (
        <div key={color} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <CounterBadge brand="${brand}" color={color} size="Small">${label}</CounterBadge>
          <CounterBadge brand="${brand}" color={color} size="Large">${label}</CounterBadge>
        </div>
      ))}
    </div>
  );
}`;
}

const matrixStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 16,
  display: "grid",
  gridTemplateColumns: "minmax(140px, auto) repeat(2, minmax(140px, auto))",
  rowGap: 16
};

const headerCellStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const colorCellStyles: CSSProperties = {
  color: "#020617",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "18px"
};

const previewCellStyles: CSSProperties = {
  alignItems: "center",
  background: "#F8FAFC",
  borderRadius: 12,
  display: "flex",
  justifyContent: "center",
  minHeight: 56,
  padding: 16
};

const meta: Meta<CounterBadgeStoryArgs> = {
  title: "Components/Badges/Counter Badge",
  component: CounterBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(COUNTER_BADGE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    color: "Brand",
    label: "99+",
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    color: {
      control: "inline-radio",
      options: counterBadgeColors
    },
    size: {
      control: "inline-radio",
      options: counterBadgeSizes
    },
    label: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<CounterBadgeStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: (args) => <VariantMatrixStory brand={args.brand ?? "Cars24"} label={args.label} />,
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildVariantsSourceCode("Cars24", "99+")
      }
    }
  }
};
