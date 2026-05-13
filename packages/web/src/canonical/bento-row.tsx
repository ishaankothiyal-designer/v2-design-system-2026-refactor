import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { pxToRem } from "../theme";
import { GridCard, type GridCardColumnCount, type GridCardSize } from "./grid-card";

export const canonicalBentoRowWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.bentoRow"
);

export type BentoRowColumns = 2 | 3;
export type BentoRowSize = "Portrait" | "Square" | "Landscape";

export interface BentoRowItem {
  title?: string;
  description?: string;
  tagLabel?: string;
  children?: ReactNode;
}

export interface BentoRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  columns?: BentoRowColumns;
  size?: BentoRowSize;
  items?: BentoRowItem[];
  showTags?: boolean;
  tagLabel?: string;
}

const ROW_WIDTH = 336;
const ROW_GAP = 12;

const GRID_COLUMN_COUNT_BY_COLUMNS: Record<BentoRowColumns, GridCardColumnCount> = {
  2: "2 Column",
  3: "3 Column"
};

const GRID_CARD_SIZE_BY_BENTO_SIZE: Record<BentoRowSize, GridCardSize> = {
  Portrait: "Large",
  Square: "Medium",
  Landscape: "Small"
};

function getDefaultItems(columns: BentoRowColumns): BentoRowItem[] {
  return Array.from({ length: columns }, () => ({
    title: "Title",
    description: "Description",
    tagLabel: "New"
  }));
}

function resolveItems(columns: BentoRowColumns, items: BentoRowItem[] | undefined) {
  const defaults = getDefaultItems(columns);

  return defaults.map((defaultItem, index) => ({
    ...defaultItem,
    ...(items?.[index] ?? {})
  }));
}

/**
 * Fixed-width bento row composed from approved GridCard variants.
 */
export function BentoRow({
  brand = "Cars24",
  className,
  columns = 3,
  items,
  showTags = false,
  size = "Landscape",
  style,
  tagLabel,
  ...rest
}: BentoRowProps) {
  const resolvedItems = resolveItems(columns, items);
  const columnCount = GRID_COLUMN_COUNT_BY_COLUMNS[columns];
  const cardSize = GRID_CARD_SIZE_BY_BENTO_SIZE[size];

  const rootStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "nowrap",
    gap: pxToRem(ROW_GAP),
    width: pxToRem(ROW_WIDTH),
    ...style
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      {resolvedItems.map((item, index) => (
        <GridCard
          key={`${columns}-${size}-${index}`}
          brand={brand}
          columnCount={columnCount}
          description={item.description ?? "Description"}
          size={cardSize}
          tagLabel={showTags ? tagLabel ?? item.tagLabel ?? "New" : ""}
          title={item.title ?? "Title"}
          type="Text Inside"
        >
          {item.children}
        </GridCard>
      ))}
    </div>
  );
}
