import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { BentoRow, type BentoRowColumns, type BentoRowProps, type BentoRowSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

type BentoRowStoryArgs = Omit<BentoRowProps, "items"> & {
  description: string;
  title: string;
};

const BENTO_ROW_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28344-7784&t=vUpeNbWJ84H8ABzi-11";

const BENTO_ROW_COLUMNS: BentoRowColumns[] = [3, 2];
const BENTO_ROW_SIZES: BentoRowSize[] = ["Landscape", "Square", "Portrait"];

function buildItems(columns: BentoRowColumns, title: string, description: string) {
  return Array.from({ length: columns }, () => ({
    title,
    description,
    tagLabel: "New"
  }));
}

function PlaygroundStory({
  brand = "Cars24",
  columns = 3,
  description = "Description",
  showTags = false,
  size = "Landscape",
  tagLabel = "New",
  title = "Title"
}: BentoRowStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <BentoRow
          brand={brand}
          columns={columns}
          items={buildItems(columns, title, description)}
          showTags={showTags}
          size={size}
          tagLabel={tagLabel}
        />
      </StoryCard>
    </StoryPage>
  );
}

function VariantMatrix({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 6, maxWidth: 720 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Bento Row
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Figma exposes the row by size and column count. Tags stay off here to match the component-set variants;
            the widget turns them on through row composition.
          </StoryCopy>
        </div>

        <div style={variantGridStyles}>
          {BENTO_ROW_SIZES.map((size) =>
            BENTO_ROW_COLUMNS.map((columns) => (
              <section key={`${size}-${columns}`} style={variantCellStyles}>
                <StoryCopy brand={displayBrand} size="sm">
                  {size} / {columns} columns
                </StoryCopy>
                <BentoRow brand={displayBrand} columns={columns} size={size} />
              </section>
            ))
          )}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))"
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const bentoRowSourceCode = `<BentoRow
  brand="Cars24"
  columns={3}
  size="Landscape"
/>`;

const meta: Meta<BentoRowStoryArgs> = {
  title: "Components/Bento Row",
  component: BentoRow,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BENTO_ROW_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    columns: 3,
    description: "Description",
    showTags: false,
    size: "Landscape",
    tagLabel: "New",
    title: "Title"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    columns: {
      control: "radio",
      options: [2, 3]
    },
    size: {
      control: "radio",
      options: BENTO_ROW_SIZES
    },
    showTags: {
      control: "boolean"
    },
    tagLabel: {
      control: "text"
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<BentoRowStoryArgs>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: bentoRowSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand }) => <VariantMatrix brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
