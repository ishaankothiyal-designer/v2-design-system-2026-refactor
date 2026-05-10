import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  StaticSliderFlexbox,
  type StaticSliderCardColumnCount,
  type StaticSliderCardSize,
  type StaticSliderCardType,
  type StaticSliderFlexboxProps
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const STATIC_SLIDER_FLEXBOX_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28713-9373&t=h5zc6W2b6MPFvMVS-11";

const STATIC_SLIDER_CARD_COLUMN_COUNTS: StaticSliderCardColumnCount[] = ["1+", "2+", "3+", "4+"];
const STATIC_SLIDER_CARD_SIZES: StaticSliderCardSize[] = ["Large", "Medium", "Small"];
const STATIC_SLIDER_CARD_TYPES: StaticSliderCardType[] = ["Text Inside", "Text Outside", "With Icon"];

const VISIBLE_VARIANTS: Array<{
  columnCount: StaticSliderCardColumnCount;
  size: StaticSliderCardSize;
}> = [
  { columnCount: "1+", size: "Large" },
  { columnCount: "1+", size: "Medium" },
  { columnCount: "1+", size: "Small" },
  { columnCount: "2+", size: "Large" },
  { columnCount: "2+", size: "Medium" },
  { columnCount: "2+", size: "Small" },
  { columnCount: "3+", size: "Large" },
  { columnCount: "3+", size: "Medium" },
  { columnCount: "3+", size: "Small" },
  { columnCount: "4+", size: "Large" },
  { columnCount: "4+", size: "Medium" }
];

function isVisibleCombination(
  columnCount: StaticSliderCardColumnCount,
  size: StaticSliderCardSize,
  type: StaticSliderCardType
) {
  if (columnCount === "4+" && size === "Small") {
    return false;
  }

  if (columnCount === "3+" && size === "Small") {
    return type === "Text Inside";
  }

  if (columnCount === "2+" && size === "Small") {
    return type !== "Text Outside";
  }

  return true;
}

function getVisibleTypes(
  columnCount: StaticSliderCardColumnCount,
  size: StaticSliderCardSize
) {
  return STATIC_SLIDER_CARD_TYPES.filter((type) => isVisibleCombination(columnCount, size, type));
}

function getVisibleSizesForColumnCount(columnCount: StaticSliderCardColumnCount) {
  return VISIBLE_VARIANTS.filter((variant) => variant.columnCount === columnCount).map((variant) => variant.size);
}

function VisibleVariantGrid({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Static Slider Flexbox
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Gallery of every visible Figma composition across size, column count, and content type,
            including the optional second row.
          </StoryCopy>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          {VISIBLE_VARIANTS.map(({ columnCount, size }) => (
            <section key={`${columnCount}-${size}`} style={{ display: "grid", gap: 12 }}>
              <StoryHeading brand={displayBrand} size="lg">
                {columnCount} / {size}
              </StoryHeading>

              <div style={variantRowStyles}>
                {getVisibleTypes(columnCount, size).map((type) => (
                  <div key={`${columnCount}-${size}-${type}`} style={variantCellStyles}>
                    <StoryCopy brand={displayBrand} size="sm">
                      {type}
                    </StoryCopy>
                    <StaticSliderFlexbox
                      brand={displayBrand}
                      columnCount={columnCount}
                      description="Description"
                      iconName="placeholder-generate-outline"
                      row2
                      size={size}
                      tagLabel="New"
                      title="Title"
                      type={type}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function PlaygroundStory({
  brand = "Cars24",
  columnCount = "1+",
  description = "Description",
  iconName = "placeholder-generate-outline",
  row2 = false,
  size = "Medium",
  tagLabel = "New",
  title = "Title",
  type = "Text Inside"
}: StaticSliderFlexboxProps) {
  const displayBrand = brand ?? "Cars24";

  if (!isVisibleCombination(columnCount, size, type)) {
    return (
      <StoryPage fullscreen>
        <StoryCard style={{ display: "grid", gap: 12, maxWidth: 720 }}>
          <StoryHeading brand={displayBrand} size="lg">
            Unsupported Figma Combination
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            `{columnCount}` with `{size}` and `{type}` is not exposed in the Figma flexbox set. Visible
            sizes for this column count: {getVisibleSizesForColumnCount(columnCount).join(", ")}.
          </StoryCopy>
        </StoryCard>
      </StoryPage>
    );
  }

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 820 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Static Slider Flexbox Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Fixed-width slider composition built from `StaticSliderCard`, preserving the clipped Figma
            row width and optional second row toggle.
          </StoryCopy>
        </div>

        <StaticSliderFlexbox
          brand={displayBrand}
          columnCount={columnCount}
          description={description}
          iconName={iconName}
          row2={row2}
          size={size}
          tagLabel={tagLabel}
          title={title}
          type={type}
        />
      </StoryCard>
    </StoryPage>
  );
}

const variantRowStyles: CSSProperties = {
  alignItems: "start",
  display: "flex",
  flexWrap: "wrap",
  gap: 16
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const defaultSourceCode = `<StaticSliderFlexbox
  brand="Cars24"
  columnCount="1+"
  type="Text Inside"
  size="Medium"
  title="Title"
  description="Description"
  tagLabel="New"
/>\n`;

function buildPlaygroundSourceCode({
  brand = "Cars24",
  columnCount = "1+",
  description = "Description",
  iconName,
  row2 = false,
  size = "Medium",
  tagLabel = "New",
  title = "Title",
  type = "Text Inside"
}: StaticSliderFlexboxProps) {
  return `<StaticSliderFlexbox
  brand="${brand}"
  columnCount="${columnCount}"
  type="${type}"
  size="${size}"
  title="${title}"
  description="${description}"
  tagLabel="${tagLabel}"${iconName ? `
  iconName="${iconName}"` : ""}
  row2={${row2}}
/>`;
}

const meta: Meta<StaticSliderFlexboxProps> = {
  title: "Components/Static Slider Flexbox",
  component: StaticSliderFlexbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(STATIC_SLIDER_FLEXBOX_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    columnCount: "1+",
    type: "Text Inside",
    size: "Medium",
    row2: false,
    title: "Title",
    description: "Description",
    tagLabel: "New",
    iconName: "placeholder-generate-outline"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    columnCount: {
      control: "inline-radio",
      options: STATIC_SLIDER_CARD_COLUMN_COUNTS
    },
    type: {
      control: "inline-radio",
      options: STATIC_SLIDER_CARD_TYPES
    },
    size: {
      control: "inline-radio",
      options: STATIC_SLIDER_CARD_SIZES
    },
    row2: {
      name: "Row 2",
      description: "Shows the second slider row from the Figma component set.",
      control: {
        type: "boolean"
      },
      table: {
        type: {
          summary: "boolean"
        },
        defaultValue: {
          summary: "false"
        }
      }
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    tagLabel: {
      control: "text"
    },
    iconName: {
      control: "text"
    },
    cards: {
      control: false
    },
    className: {
      control: false
    },
    style: {
      control: false
    }
  }
};

export default meta;

type Story = StoryObj<StaticSliderFlexboxProps>;

export const Default: Story = {
  render: ({
    brand,
    description = "Description",
    iconName = "placeholder-generate-outline",
    tagLabel = "New",
    title = "Title"
  }) => (
    <StoryPage>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <StaticSliderFlexbox
          brand={brand ?? "Cars24"}
          columnCount="1+"
          description={description}
          iconName={iconName}
          size="Medium"
          tagLabel={tagLabel}
          title={title}
          type="Text Inside"
        />
      </StoryCard>
    </StoryPage>
  ),
  parameters: {
    controls: { include: ["brand", "title", "description", "tagLabel", "iconName"] },
    docs: {
      source: {
        code: defaultSourceCode
      }
    }
  }
};

export const VisibleVariants: Story = {
  render: ({ brand }) => <VisibleVariantGrid brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    controls: {
      include: ["brand", "columnCount", "type", "size", "row2", "title", "description", "tagLabel", "iconName"]
    },
    docs: {
      source: {
        code: buildPlaygroundSourceCode({ row2: false })
      },
      controls: {
        include: ["brand", "columnCount", "type", "size", "row2", "title", "description", "tagLabel", "iconName"]
      }
    }
  }
};
