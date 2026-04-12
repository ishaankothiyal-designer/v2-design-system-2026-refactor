import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  SegmentedControl,
  Text,
  type SegmentedControlItem,
  type SegmentedControlProps,
  type SegmentedControlSize,
  type SegmentedControlType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const SEGMENTED_CONTROL_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=77-3907&t=1zgOyFpiLYMyM4XM-11";

const segmentedControlSizes: SegmentedControlSize[] = ["Default", "Large"];
const segmentedControlTypes: SegmentedControlType[] = ["Label", "Icon"];
const optionCounts = [2, 3, 4, 5] as const;

type SegmentedControlStoryArgs = SegmentedControlProps;

function buildItems(count: number, type: SegmentedControlType): SegmentedControlItem[] {
  return Array.from({ length: count }, (_, index) => ({
    ariaLabel: `Option ${index + 1}`,
    iconName: "placeholder-generate-outline",
    label: type === "Label" ? "Label" : undefined,
    value: `option-${index + 1}`
  }));
}

function renderPlayground(args: SegmentedControlStoryArgs) {
  const [{ value = "option-1" }, updateArgs] = useArgs<SegmentedControlStoryArgs>();

  function handleValueChange(nextValue: string) {
    updateArgs({ value: nextValue });
    args.onValueChange?.(nextValue);
  }

  return (
    <SegmentedControl
      {...args}
      value={value}
      onValueChange={handleValueChange}
    />
  );
}

function SectionHeading({
  brand,
  title,
  description,
  tone = "primary"
}: {
  brand: DisplayBrandId;
  title: string;
  description?: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md" tone={tone}>
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone={tone === "inverse" ? "inverse" : "secondary"}>
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function HeaderCell({
  brand,
  label,
  tone = "secondary"
}: {
  brand: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function MatrixCell({
  brand,
  count,
  size,
  type
}: {
  brand: DisplayBrandId;
  count: (typeof optionCounts)[number];
  size: SegmentedControlSize;
  type: SegmentedControlType;
}) {
  return (
    <SegmentedControl
      brand={brand}
      items={buildItems(count, type)}
      size={size}
      type={type}
      value="option-1"
    />
  );
}

function VariantMatrix({
  brand,
  type
}: {
  brand: DisplayBrandId;
  type: SegmentedControlType;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {type}
      </Text>
      <div style={matrixTableStyles()}>
        <div style={matrixCornerCellStyles} />
        {segmentedControlSizes.map((size) => (
          <div key={`${type}-${size}-header`} style={matrixHeaderCellStyles}>
            <HeaderCell brand={brand} label={size} />
          </div>
        ))}

        {optionCounts.flatMap((count) => [
          <div key={`${type}-${count}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={`${count} items`} />
          </div>,
          ...segmentedControlSizes.map((size) => (
            <div key={`${type}-${count}-${size}`} style={matrixValueCellStyles}>
              <MatrixCell brand={brand} count={count} size={size} type={type} />
            </div>
          ))
        ])}
      </div>
    </div>
  );
}

function SegmentedControlVariantsStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Segmented Control"
            description="Full Figma matrix across Label and Icon types, Default and Large sizes, and 2 to 5 visible options."
          />
          <div style={{ display: "grid", gap: 24 }}>
            {segmentedControlTypes.map((type) => (
              <VariantMatrix key={type} brand={brand} type={type} />
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function matrixTableStyles(): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: "180px repeat(2, minmax(260px, 1fr))",
    overflow: "hidden"
  };
}

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 68,
  padding: "16px 20px"
};

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 68
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 104,
  padding: "20px 16px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 104,
  padding: "16px 20px"
};

const segmentedControlVariantsSourceCode = `import { SegmentedControl } from "@geist/web";

const sizes = ["Default", "Large"] as const;
const counts = [2, 3, 4, 5] as const;

function buildItems(count: number, type: "Label" | "Icon") {
  return Array.from({ length: count }, (_, index) => ({
    value: \`option-\${index + 1}\`,
    ariaLabel: \`Option \${index + 1}\`,
    iconName: "placeholder-generate-outline",
    label: type === "Label" ? "Label" : undefined
  }));
}

export function SegmentedControlVariants() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {(["Label", "Icon"] as const).map((type) => (
        <div key={type} style={{ display: "grid", gap: 12 }}>
          {counts.map((count) => (
            <div key={count} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {sizes.map((size) => (
                <SegmentedControl
                  key={\`\${type}-\${size}-\${count}\`}
                  brand="Cars24"
                  items={buildItems(count, type)}
                  size={size}
                  type={type}
                  value="option-1"
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}`;

const segmentedControlUiExampleSourceCode = `<SegmentedControl
  brand="Cars24"
  type="Label"
  size="Default"
  value="option-1"
  items={[
    { value: "option-1", label: "Label", iconName: "placeholder-generate-outline" },
    { value: "option-2", label: "Label", iconName: "placeholder-generate-outline" },
    { value: "option-3", label: "Label", iconName: "placeholder-generate-outline" }
  ]}
/>\n`;

const meta: Meta<SegmentedControlStoryArgs> = {
  title: "Components/Tabs/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SEGMENTED_CONTROL_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    disabled: false,
    items: buildItems(3, "Label"),
    size: "Default",
    type: "Label",
    value: "option-1"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: segmentedControlSizes
    },
    type: {
      control: "inline-radio",
      options: segmentedControlTypes
    },
    disabled: {
      control: "boolean"
    },
    items: {
      control: false
    },
    onValueChange: {
      action: "value changed"
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<SegmentedControlStoryArgs>;

export const Playground: Story = {
  parameters: {
    docs: { source: { code: segmentedControlUiExampleSourceCode } },
    layout: "centered"
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <SegmentedControlVariantsStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: segmentedControlVariantsSourceCode } }
  }
};
