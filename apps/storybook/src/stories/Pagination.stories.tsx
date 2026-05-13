import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@turbo/tokens";
import {
  Pagination,
  Text,
  type PaginationMove,
  type PaginationPlatform,
  type PaginationProps,
  type PaginationType
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const PAGINATION_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=11723-27347&t=1zgOyFpiLYMyM4XM-11";

const paginationPlatforms: PaginationPlatform[] = ["Mobile", "Desktop"];
const paginationTypes: PaginationType[] = ["1", "2"];
const paginationMoves: PaginationMove[] = ["only right", "both ways", "only left"];

const type1PagesByMove: Record<PaginationMove, number> = {
  "only right": 1,
  "both ways": 2,
  "only left": 4
};

const type2PagesByMove: Record<PaginationPlatform, Record<PaginationMove, number>> = {
  Mobile: {
    "only right": 1,
    "both ways": 2,
    "only left": 32
  },
  Desktop: {
    "only right": 1,
    "both ways": 3,
    "only left": 32
  }
};

function PlaygroundStory(args: PaginationProps) {
  return <Pagination {...args} />;
}

function SectionHeading({
  brand,
  title,
  description
}: {
  brand: NonNullable<PaginationProps["brand"]>;
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md">
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function PlatformStory({
  brand,
  platform
}: {
  brand?: NonNullable<PaginationProps["brand"]>;
  platform: PaginationPlatform;
}) {
  const activeBrand = (brand ?? "Cars24") as NonNullable<PaginationProps["brand"]>;

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={activeBrand}
            title={platform}
            description={
              platform === "Mobile"
                ? "Compact summary and numbered pagination states covering start, mid, and end movement."
                : "Desktop pagination with the wider page-window variant shown in the Figma canonical set."
            }
          />

          <div style={matrixTableStyles}>
            <div style={matrixCornerCellStyles} />
            <div style={matrixHeaderCellStyles}>
              <Text brand={activeBrand} as="strong" size="sm">
                Type 1
              </Text>
            </div>
            <div style={matrixHeaderCellStyles}>
              <Text brand={activeBrand} as="strong" size="sm">
                Type 2
              </Text>
            </div>

            {paginationMoves.flatMap((move) => [
              <div key={`${platform}-${move}-label`} style={matrixRowLabelCellStyles}>
                <Text brand={activeBrand} as="strong" size="sm">
                  {move}
                </Text>
              </div>,
              <div key={`${platform}-${move}-type1`} style={matrixValueCellStyles}>
                <Pagination
                  brand={activeBrand}
                  currentPage={type1PagesByMove[move]}
                  platform={platform}
                  totalPages={4}
                  type="1"
                />
              </div>,
              <div key={`${platform}-${move}-type2`} style={matrixValueCellStyles}>
                <Pagination
                  brand={activeBrand}
                  currentPage={type2PagesByMove[platform][move]}
                  platform={platform}
                  totalPages={32}
                  type="2"
                />
              </div>
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixTableStyles: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "160px repeat(2, minmax(280px, 1fr))",
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  overflow: "hidden"
};

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 64
};

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 64,
  padding: "16px 20px"
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 96,
  padding: "16px 20px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 96,
  padding: "16px 20px"
};

function buildPaginationPlatformSourceCode(platform: PaginationPlatform) {
  return `import { Pagination } from "@turbo/web";

export function Example() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Pagination currentPage={1} platform="${platform}" totalPages={4} type="1" />
      <Pagination currentPage={${platform === "Mobile" ? 2 : 3}} platform="${platform}" totalPages={32} type="2" />
    </div>
  );
}`;
}

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(PAGINATION_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    currentPage: 3,
    platform: "Desktop",
    totalPages: 32,
    type: "2"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "inline-radio",
      options: paginationTypes
    },
    platform: {
      control: "inline-radio",
      options: paginationPlatforms
    },
    currentPage: {
      control: { type: "number", min: 1, step: 1 }
    },
    totalPages: {
      control: { type: "number", min: 1, step: 1 }
    },
    pageItems: {
      control: false
    },
    onPageChange: {
      control: false
    }
  }
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Mobile: Story = {
  render: ({ brand = "Cars24" }) => <PlatformStory brand={brand} platform="Mobile" />,
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen",
    docs: {
      source: {
        code: buildPaginationPlatformSourceCode("Mobile")
      }
    }
  }
};

export const Desktop: Story = {
  render: ({ brand = "Cars24" }) => <PlatformStory brand={brand} platform="Desktop" />,
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen",
    docs: {
      source: {
        code: buildPaginationPlatformSourceCode("Desktop")
      }
    }
  }
};
