import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  HorizontalTab,
  Text,
  type HorizontalTabItem,
  type HorizontalTabItemState,
  type HorizontalTabProps,
  type HorizontalTabSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const HORIZONTAL_TAB_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=6881-35258&p=f&t=1zgOyFpiLYMyM4XM-11";

const counts = [8, 7, 6, 5, 4, 3, 2] as const;
const sizes: HorizontalTabSize[] = ["Default", "Small"];
const visibleStates = ["Rest", "Hover", "Active", "Pressed", "Disabled"] as const;

type HorizontalTabStoryArgs = HorizontalTabProps & {
  iconLeading: boolean;
  iconTrailing: boolean;
  tag: boolean;
};

function buildItems(
  count: number,
  previewState?: HorizontalTabItemState,
  previewIndex = 0,
  options?: {
    iconLeading?: boolean;
    iconTrailing?: boolean;
    tag?: boolean;
  }
): HorizontalTabItem[] {
  return Array.from({ length: count }, (_, index) => {
    const item: HorizontalTabItem = {
      ariaLabel: `Tab ${index + 1}`,
      iconLeading: options?.iconLeading ?? false,
      iconTrailing: options?.iconTrailing ?? false,
      label: `Tab ${index + 1}`,
      tag: options?.tag ?? false,
      value: `tab-${index + 1}`
    };

    if (index === previewIndex && previewState) {
      item.state = previewState;
    }

    return item;
  });
}

function renderPlayground(args: HorizontalTabStoryArgs) {
  const [{ value = "tab-1" }, updateArgs] = useArgs<HorizontalTabStoryArgs>();
  const { iconLeading, iconTrailing, tag, ...componentArgs } = args;

  return (
    <HorizontalTab
      {...componentArgs}
      items={buildItems(4, undefined, 0, {
        iconLeading,
        iconTrailing,
        tag
      })}
      value={value}
      onValueChange={(nextValue) => {
        updateArgs({ value: nextValue });
        args.onValueChange?.(nextValue);
      }}
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

function VariantMatrix({
  brand,
  size
}: {
  brand: DisplayBrandId;
  size: HorizontalTabSize;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {size}
      </Text>
      <div style={matrixTableStyles("160px repeat(2, minmax(560px, 1fr))")}>
        <div style={matrixCornerCellStyles} />
        <div style={matrixHeaderCellStyles}>
          <HeaderCell brand={brand} label="Light" />
        </div>
        <div style={matrixHeaderCellStyles}>
          <HeaderCell brand={brand} label="Inverse" />
        </div>

        {counts.flatMap((count) => [
          <div key={`${size}-${count}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={`${count} items`} />
          </div>,
          <div key={`${size}-${count}-light`} style={matrixValueCellStyles}>
            <HorizontalTab brand={brand} items={buildItems(count)} size={size} value="tab-1" />
          </div>,
          <div
            key={`${size}-${count}-inverse`}
            style={{
              ...matrixValueCellStyles,
              background: String(coreTokenCatalog.color.surface.inverse)
            }}
          >
            <HorizontalTab brand={brand} inverse items={buildItems(count)} size={size} value="tab-1" />
          </div>
        ])}
      </div>
    </div>
  );
}

function VariantsStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Horizontal Tab variants"
            description="Canonical Horizontal Tab matrix covering counts 2 through 8 across default and small sizes on light and inverse surfaces."
          />
          <div style={{ display: "grid", gap: 24 }}>
            {sizes.map((size) => (
              <VariantMatrix key={size} brand={brand} size={size} />
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildStateExample(size: HorizontalTabSize, state: (typeof visibleStates)[number], inverse: boolean) {
  if (state === "Active") {
    return (
      <HorizontalTab
        inverse={inverse}
        items={buildItems(2, undefined, 0, { iconLeading: true, iconTrailing: true, tag: true })}
        size={size}
        value="tab-1"
      />
    );
  }

  return (
    <HorizontalTab
      inverse={inverse}
      items={buildItems(2, state, 0, { iconLeading: true, iconTrailing: true, tag: true })}
      size={size}
      value="tab-2"
    />
  );
}

function ContentOptionsStory({ brand }: { brand: DisplayBrandId }) {
  const rows = [
    { iconLeading: true, iconTrailing: false, label: "Leading icon", tag: false },
    { iconLeading: false, iconTrailing: true, label: "Trailing icon", tag: false },
    { iconLeading: false, iconTrailing: false, label: "Tag", tag: true },
    { iconLeading: true, iconTrailing: true, label: "Leading + trailing", tag: false },
    { iconLeading: true, iconTrailing: true, label: "All options", tag: true }
  ] as const;

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Content options"
            description="Boolean item options remapped from the Figma tab atom: leading icon, trailing icon, and tag."
          />
          <div style={matrixTableStyles("180px repeat(2, minmax(320px, 1fr))")}>
            <div style={matrixCornerCellStyles} />
            <div style={matrixHeaderCellStyles}>
              <HeaderCell brand={brand} label="Light" />
            </div>
            <div style={matrixHeaderCellStyles}>
              <HeaderCell brand={brand} label="Inverse" />
            </div>
            {rows.flatMap((row) => [
              <div key={`${row.label}-label`} style={matrixRowLabelCellStyles}>
                <HeaderCell brand={brand} label={row.label} />
              </div>,
              <div key={`${row.label}-light`} style={matrixValueCellStyles}>
                <HorizontalTab brand={brand} items={buildItems(2, undefined, 0, row)} size="Default" value="tab-1" />
              </div>,
              <div
                key={`${row.label}-inverse`}
                style={{
                  ...matrixValueCellStyles,
                  background: String(coreTokenCatalog.color.surface.inverse)
                }}
              >
                <HorizontalTab
                  brand={brand}
                  inverse
                  items={buildItems(2, undefined, 0, row)}
                  size="Default"
                  value="tab-1"
                />
              </div>
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function StateMatrix({
  brand,
  size
}: {
  brand: DisplayBrandId;
  size: HorizontalTabSize;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {size}
      </Text>
      <div style={matrixTableStyles("160px repeat(5, minmax(200px, 1fr))")}>
        <div style={matrixCornerCellStyles} />
        {visibleStates.map((state) => (
          <div key={`${size}-${state}-header`} style={matrixHeaderCellStyles}>
            <HeaderCell brand={brand} label={state} />
          </div>
        ))}

        {(["Light", "Inverse"] as const).flatMap((surface) => [
          <div key={`${size}-${surface}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={surface} />
          </div>,
          ...visibleStates.map((state) => (
            <div
              key={`${size}-${surface}-${state}`}
              style={{
                ...matrixValueCellStyles,
                background:
                  surface === "Inverse"
                    ? String(coreTokenCatalog.color.surface.inverse)
                    : String(coreTokenCatalog.color.surface.canvas)
              }}
            >
              {buildStateExample(size, state, surface === "Inverse")}
            </div>
          ))
        ])}
      </div>
    </div>
  );
}

function VisibleStatesStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Visible states"
            description="State previews derived from the Horizontal Tab atoms: Rest, Hover, Active, Pressed, and Disabled across both supported sizes and surfaces."
          />
          <div style={{ display: "grid", gap: 24 }}>
            {sizes.map((size) => (
              <StateMatrix key={size} brand={brand} size={size} />
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function matrixTableStyles(columns: string): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: columns,
    overflow: "hidden"
  };
}

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 68
};

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 68,
  padding: "16px 20px"
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

const horizontalTabUiExampleSourceCode = `import { HorizontalTab } from "@geist/web";

const items = [
  { value: "overview", label: "Overview", iconLeading: true, tag: true },
  { value: "specs", label: "Specs", iconTrailing: true },
  { value: "pricing", label: "Pricing" },
  { value: "history", label: "History", iconLeading: true, iconTrailing: true }
];

export function Example() {
  return (
    <HorizontalTab
      brand="Cars24"
      items={items}
      size="Default"
      value="overview"
    />
  );
}`;

const meta: Meta<HorizontalTabStoryArgs> = {
  title: "Components/Tabs/Horizontal Tab",
  component: HorizontalTab,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(HORIZONTAL_TAB_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    iconLeading: true,
    iconTrailing: true,
    inverse: false,
    size: "Default",
    tag: true,
    value: "tab-1"
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
    inverse: {
      control: "boolean"
    },
    iconLeading: {
      control: "boolean"
    },
    iconTrailing: {
      control: "boolean"
    },
    items: {
      control: false
    },
    onValueChange: {
      action: "value changed"
    },
    tag: {
      control: "boolean"
    },
    value: {
      control: false
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<HorizontalTabStoryArgs>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: horizontalTabUiExampleSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantsStory brand={brand} />,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};

export const ContentOptions: Story = {
  render: ({ brand = "Cars24" }) => <ContentOptionsStory brand={brand} />,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};

export const VisibleStates: Story = {
  render: ({ brand = "Cars24" }) => <VisibleStatesStory brand={brand} />,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};
