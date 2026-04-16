import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  Tag,
  type TagColor,
  type TagPriority,
  type TagProps,
  type TagSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const tagColors: TagColor[] = ["Red", "Green", "Neutral", "Brand blue", "Blue", "Orange"];
const tagSizes: TagSize[] = ["Small", "Large"];
const tagPriorities: TagPriority[] = ["High", "Low"];

type TagStoryArgs = Omit<TagProps, "children"> & {
  label: string;
};

const TAG_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=428-12206&t=1zgOyFpiLYMyM4XM-11";

function PlaygroundStory(args: TagStoryArgs) {
  return <Tag {...args}>{args.label}</Tag>;
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
          <HeaderCell label="Small / High" />
          <HeaderCell label="Small / Low" />
          <HeaderCell label="Large / High" />
          <HeaderCell label="Large / Low" />

          {tagColors.flatMap((color) => [
            <ColorCell key={`${color}-label`} label={color} />,
            <PreviewCell key={`${color}-small-high`}>
              <Tag brand={brand} color={color} priority="High" size="Small">
                {label}
              </Tag>
            </PreviewCell>,
            <PreviewCell key={`${color}-small-low`}>
              <Tag brand={brand} color={color} priority="Low" size="Small">
                {label}
              </Tag>
            </PreviewCell>,
            <PreviewCell key={`${color}-large-high`}>
              <Tag brand={brand} color={color} priority="High" size="Large">
                {label}
              </Tag>
            </PreviewCell>,
            <PreviewCell key={`${color}-large-low`}>
              <Tag brand={brand} color={color} priority="Low" size="Large">
                {label}
              </Tag>
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

function buildVariantsSourceCode(brand: DisplayBrandId) {
  return `import { Tag } from "@geist/web";

const colors = ["Red", "Green", "Neutral", "Brand blue", "Blue", "Orange"] as const;

export function TagVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {colors.map((color) => (
        <div key={color} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Tag brand="${brand}" color={color} size="Small" priority="High">Label</Tag>
          <Tag brand="${brand}" color={color} size="Small" priority="Low">Label</Tag>
          <Tag brand="${brand}" color={color} size="Large" priority="High">Label</Tag>
          <Tag brand="${brand}" color={color} size="Large" priority="Low">Label</Tag>
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
  gridTemplateColumns: "minmax(140px, auto) repeat(4, minmax(120px, auto))",
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
  display: "flex",
  justifyContent: "center"
};

const meta: Meta<TagStoryArgs> = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(TAG_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    color: "Red",
    label: "Label",
    priority: "High",
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    color: {
      control: "inline-radio",
      options: tagColors
    },
    size: {
      control: "inline-radio",
      options: tagSizes
    },
    priority: {
      control: "inline-radio",
      options: tagPriorities
    },
    label: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<TagStoryArgs>;

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
        code: buildVariantsSourceCode("Cars24")
      }
    }
  }
};
