import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { GridCard, type GridCardColumnCount, type GridCardProps, type GridCardSize, type GridCardType } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const GRID_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28327-3994&t=h5zc6W2b6MPFvMVS-11";
const GRID_FLEXBOX_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28327-4160&t=h5zc6W2b6MPFvMVS-11";

const VISIBLE_VARIANTS: Array<{
  columnCount: GridCardColumnCount;
  size: GridCardSize;
}> = [
  { columnCount: "2 Column", size: "Large" },
  { columnCount: "2 Column", size: "Medium" },
  { columnCount: "2 Column", size: "Small" },
  { columnCount: "3 Column", size: "Large" },
  { columnCount: "3 Column", size: "Medium" },
  { columnCount: "3 Column", size: "Small" },
  { columnCount: "4 Column", size: "Large" },
  { columnCount: "4 Column", size: "Medium" },
  { columnCount: "5 Column", size: "Large" }
];

const GRID_CARD_COLUMN_COUNTS: GridCardColumnCount[] = ["2 Column", "3 Column", "4 Column", "5 Column"];
const GRID_CARD_SIZES: GridCardSize[] = ["Large", "Medium", "Small"];
const GRID_CARD_TYPES: GridCardType[] = ["Text Inside", "Text Outside", "With Icon"];

const GRID_FLEXBOX_LAYOUTS: Record<
  GridCardSize,
  Array<{
    cardCount: number;
    columnCount: GridCardColumnCount;
    gap: number;
    minHeight: number;
  }>
> = {
  Large: [
    { cardCount: 4, columnCount: "2 Column", gap: 12, minHeight: 400 },
    { cardCount: 6, columnCount: "3 Column", gap: 12, minHeight: 262 },
    { cardCount: 8, columnCount: "4 Column", gap: 12, minHeight: 192 },
    { cardCount: 10, columnCount: "5 Column", gap: 8, minHeight: 170 }
  ],
  Medium: [
    { cardCount: 4, columnCount: "2 Column", gap: 12, minHeight: 336 },
    { cardCount: 6, columnCount: "3 Column", gap: 12, minHeight: 220 },
    { cardCount: 8, columnCount: "4 Column", gap: 12, minHeight: 162 }
  ],
  Small: [
    { cardCount: 4, columnCount: "2 Column", gap: 12, minHeight: 228 },
    { cardCount: 6, columnCount: "3 Column", gap: 12, minHeight: 150 }
  ]
};

function VisibleVariantGrid({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Grid Card
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Gallery of every visible Figma combination across column count, size, and content type.
            Dense variants intentionally suppress the badge or description when the source node does.
          </StoryCopy>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          {VISIBLE_VARIANTS.map(({ columnCount, size }) => (
            <section key={`${columnCount}-${size}`} style={{ display: "grid", gap: 12 }}>
              <StoryHeading brand={displayBrand} size="lg">
                {columnCount} / {size}
              </StoryHeading>

              <div style={variantRowStyles}>
                {GRID_CARD_TYPES.map((type) => (
                  <div key={`${columnCount}-${size}-${type}`} style={variantCellStyles}>
                    <StoryCopy brand={displayBrand} size="sm">
                      {type}
                    </StoryCopy>
                    <GridCard
                      brand={displayBrand}
                      columnCount={columnCount}
                      description="Description"
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

function resolveGridFlexboxLayout(size: GridCardSize, columnCount: GridCardColumnCount) {
  return GRID_FLEXBOX_LAYOUTS[size].find((layout) => layout.columnCount === columnCount) ?? null;
}

function getVisibleSizesForColumnCount(columnCount: GridCardColumnCount) {
  return VISIBLE_VARIANTS.filter((variant) => variant.columnCount === columnCount).map((variant) => variant.size);
}

function PlaygroundStory({
  brand = "Cars24",
  columnCount = "2 Column",
  description = "Description",
  iconName = "placeholder-generate-outline",
  row2 = true,
  size = "Large",
  tagLabel = "New",
  title = "Title",
  type = "Text Inside"
}: GridCardPlaygroundProps) {
  const layout = resolveGridFlexboxLayout(size, columnCount);
  const displayBrand = brand ?? "Cars24";

  if (!layout) {
    const visibleSizes = getVisibleSizesForColumnCount(columnCount).join(", ");

    return (
      <StoryPage fullscreen>
        <StoryCard style={{ display: "grid", gap: 12, maxWidth: 720 }}>
          <StoryHeading brand={displayBrand} size="lg">
            Unsupported Figma Combination
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            `{columnCount}` with `{size}` is not exposed in the Figma grid flexbox set. Visible sizes
            for this column count: {visibleSizes}.
          </StoryCopy>
        </StoryCard>
      </StoryPage>
    );
  }

  const cardsPerRow = layout.cardCount / 2;

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 820 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Grid Flexbox Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Interactive flexbox composition built from the approved `GridCard` component and aligned to
            the visible Figma row width and spacing for this size and column count, with the second row
            toggled through Storybook controls.
          </StoryCopy>
        </div>

        <div
          style={{
            display: "grid",
            gap: layout.gap,
            width: 336
          }}
        >
          <div style={{ display: "flex", gap: layout.gap, width: 336 }}>
            {Array.from({ length: cardsPerRow }, (_, index) => (
              <GridCard
                key={`${size}-${columnCount}-${type}-row1-${index}`}
                brand={displayBrand}
                columnCount={columnCount}
                description={description}
                iconName={iconName}
                size={size}
                tagLabel={tagLabel}
                title={title}
                type={type}
              />
            ))}
          </div>

          {row2 ? (
            <div style={{ display: "flex", gap: layout.gap, width: 336 }}>
              {Array.from({ length: cardsPerRow }, (_, index) => (
                <GridCard
                  key={`${size}-${columnCount}-${type}-row2-${index}`}
                  brand={displayBrand}
                  columnCount={columnCount}
                  description={description}
                  iconName={iconName}
                  size={size}
                  tagLabel={tagLabel}
                  title={title}
                  type={type}
                />
              ))}
            </div>
          ) : null}
        </div>
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

const defaultSourceCode = `<GridCard
  brand="Cars24"
  columnCount="2 Column"
  type="Text Inside"
  size="Large"
  title="Title"
  description="Description"
  tagLabel="New"
/>\n`;

export interface GridCardPlaygroundProps extends GridCardProps {
  row2?: boolean;
}

function buildPlaygroundSourceCode({
  brand = "Cars24",
  columnCount = "2 Column",
  description = "Description",
  iconName,
  row2 = true,
  size = "Large",
  tagLabel = "New",
  title = "Title",
  type = "Text Inside"
}: GridCardPlaygroundProps) {
  return `<GridCardPlayground
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

export function GridCardPlayground(props: GridCardPlaygroundProps) {
  return <PlaygroundStory {...props} />;
}

const meta: Meta<GridCardPlaygroundProps> = {
  title: "Components/Cards/Grid Card",
  component: GridCardPlayground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(GRID_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    columnCount: "2 Column",
    type: "Text Inside",
    size: "Large",
    title: "Title",
    description: "Description",
    tagLabel: "New",
    row2: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    columnCount: {
      control: "inline-radio",
      options: GRID_CARD_COLUMN_COUNTS
    },
    type: {
      control: "inline-radio",
      options: GRID_CARD_TYPES
    },
    size: {
      control: "inline-radio",
      options: GRID_CARD_SIZES
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
    row2: {
      name: "Row 2",
      description: "Shows the second flex row from the Figma grid composition.",
      control: {
        type: "boolean"
      },
      table: {
        type: {
          summary: "boolean"
        },
        defaultValue: {
          summary: "true"
        }
      }
    },
    children: {
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

type Story = StoryObj<GridCardPlaygroundProps>;

export const Default: Story = {
  render: ({
    brand,
    description = "Description",
    tagLabel = "New",
    title = "Title"
  }) => (
    <StoryPage>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <GridCard
          brand={brand ?? "Cars24"}
          columnCount="2 Column"
          description={description}
          size="Large"
          tagLabel={tagLabel}
          title={title}
          type="Text Inside"
        />
      </StoryCard>
    </StoryPage>
  ),
  parameters: {
    controls: { include: ["brand", "title", "description", "tagLabel"] },
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
  args: {
    row2: true
  },
  argTypes: {
    row2: {
      name: "Row 2",
      description: "Shows the second flex row from the Figma grid composition.",
      control: {
        type: "boolean"
      },
      table: {
        type: {
          summary: "boolean"
        },
        defaultValue: {
          summary: "true"
        }
      }
    }
  },
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    controls: {
      include: ["brand", "columnCount", "type", "size", "row2", "title", "description", "tagLabel", "iconName"]
    },
    docs: {
      source: {
        code: buildPlaygroundSourceCode({ row2: true })
      },
      controls: {
        include: ["brand", "columnCount", "type", "size", "row2", "title", "description", "tagLabel", "iconName"]
      }
    },
    design: createFigspecDesign(GRID_FLEXBOX_FIGMA_URL),
    layout: "fullscreen"
  }
};
