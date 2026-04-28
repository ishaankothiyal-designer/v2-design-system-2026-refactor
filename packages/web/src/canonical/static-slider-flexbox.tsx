import type { CSSProperties, HTMLAttributes } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { pxToRem } from "../theme";
import {
  StaticSliderCard,
  type StaticSliderCardColumnCount,
  type StaticSliderCardProps,
  type StaticSliderCardSize,
  type StaticSliderCardType
} from "./static-slider-card";

export const canonicalStaticSliderFlexboxWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.staticSliderFlexbox"
);

type StaticSliderFlexboxCardItem = {
  children?: StaticSliderCardProps["children"];
  description?: string | undefined;
  iconName?: IconName | undefined;
  tagLabel?: string | undefined;
  title?: string | undefined;
};

export interface StaticSliderFlexboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  columnCount?: StaticSliderCardColumnCount;
  type?: StaticSliderCardType;
  size?: StaticSliderCardSize;
  row2?: boolean;
  scrollable?: boolean;
  viewportPadding?: number | string;
  title?: string;
  description?: string;
  tagLabel?: string;
  iconName?: IconName;
  cards?: StaticSliderFlexboxCardItem[];
}

type StaticSliderFlexboxLayout = {
  cardsPerRow: number;
  rowWidth: number;
  viewportWidth: number;
};

const STATIC_SLIDER_FLEXBOX_LAYOUTS: Record<
  StaticSliderCardColumnCount,
  StaticSliderFlexboxLayout
> = {
  "1+": {
    cardsPerRow: 2,
    rowWidth: 410,
    viewportWidth: 336
  },
  "2+": {
    cardsPerRow: 3,
    rowWidth: 440,
    viewportWidth: 336
  },
  "3+": {
    cardsPerRow: 4,
    rowWidth: 398,
    viewportWidth: 336
  },
  "4+": {
    cardsPerRow: 5,
    rowWidth: 390,
    viewportWidth: 336
  }
};

const STATIC_SLIDER_FLEXBOX_GAP = "var(--cars24-misc-gap-10, 10px)";
const STATIC_SLIDER_FLEXBOX_VIEWPORT_PADDING = "0px";

function resolveViewportPadding(viewportPadding: number | string | undefined) {
  if (viewportPadding === undefined) {
    return STATIC_SLIDER_FLEXBOX_VIEWPORT_PADDING;
  }

  return typeof viewportPadding === "number" ? pxToRem(viewportPadding) : viewportPadding;
}

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

function resolveLayout(
  columnCount: StaticSliderCardColumnCount,
  size: StaticSliderCardSize,
  type: StaticSliderCardType
) {
  if (!isVisibleCombination(columnCount, size, type)) {
    throw new Error(
      `StaticSliderFlexbox does not support the Figma-invisible combination: ${columnCount} / ${type} / ${size}.`
    );
  }

  return STATIC_SLIDER_FLEXBOX_LAYOUTS[columnCount];
}

function buildResolvedCards(
  cardCount: number,
  cards: StaticSliderFlexboxCardItem[] | undefined,
  {
    description,
    iconName,
    tagLabel,
    title
  }: Pick<StaticSliderFlexboxProps, "description" | "iconName" | "tagLabel" | "title">
) {
  const fallbackCard: StaticSliderFlexboxCardItem = {
    ...(description !== undefined ? { description } : {}),
    ...(iconName !== undefined ? { iconName } : {}),
    ...(tagLabel !== undefined ? { tagLabel } : {}),
    ...(title !== undefined ? { title } : {})
  };

  return Array.from({ length: cardCount }, (_, index) => ({
    ...fallbackCard,
    ...(cards?.[index] ?? {})
  }));
}

/**
 * Fixed-width flexbox composition of Static Slider Cards, preserving the Figma slider viewport and row widths.
 */
export function StaticSliderFlexbox({
  brand = "Cars24",
  cards,
  className,
  columnCount = "1+",
  description = "Description",
  iconName = "placeholder-generate-outline",
  role,
  row2 = false,
  scrollable = true,
  size = "Medium",
  style,
  tagLabel = "New",
  title = "Title",
  type = "Text Inside",
  viewportPadding,
  ...rest
}: StaticSliderFlexboxProps) {
  const layout = resolveLayout(columnCount, size, type);
  const resolvedViewportPadding = resolveViewportPadding(viewportPadding);
  const visibleRowCount = row2 ? 2 : 1;
  const visibleCardCount = layout.cardsPerRow * visibleRowCount;
  const resolvedCards = buildResolvedCards(visibleCardCount, cards, {
    description,
    iconName,
    tagLabel,
    title
  });

  const rootStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "grid",
    gap: STATIC_SLIDER_FLEXBOX_GAP,
    width: pxToRem(layout.viewportWidth),
    ...style
  };

  const rowViewportStyles: CSSProperties = {
    boxSizing: "border-box",
    overflowX: scrollable ? "auto" : "hidden",
    overflowY: "hidden",
    paddingLeft: resolvedViewportPadding,
    paddingRight: resolvedViewportPadding,
    WebkitOverflowScrolling: scrollable ? "touch" : undefined,
    scrollPaddingLeft: scrollable ? resolvedViewportPadding : undefined,
    scrollPaddingRight: scrollable ? resolvedViewportPadding : undefined,
    scrollSnapType: scrollable ? "x proximity" : undefined,
    scrollbarWidth: scrollable ? "none" : undefined,
    width: "100%"
  };

  const rowStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    gap: STATIC_SLIDER_FLEXBOX_GAP,
    width: pxToRem(layout.rowWidth)
  };

  const rowItemStyles: CSSProperties = {
    display: "flex",
    flexShrink: 0,
    scrollSnapAlign: scrollable ? "start" : undefined
  };

  return (
    <div {...rest} className={className} role={role ?? "list"} style={rootStyles}>
      {Array.from({ length: visibleRowCount }, (_, rowIndex) => {
        const rowCards = resolvedCards.slice(
          rowIndex * layout.cardsPerRow,
          (rowIndex + 1) * layout.cardsPerRow
        );

        return (
          <div key={`row-${rowIndex}`} style={rowViewportStyles}>
            <div style={rowStyles}>
              {rowCards.map((card, cardIndex) => (
                <div
                  key={`card-${rowIndex}-${cardIndex}`}
                  role="listitem"
                  style={rowItemStyles}
                >
                  <StaticSliderCard
                    brand={brand}
                    columnCount={columnCount}
                    size={size}
                    type={type}
                    {...(card.description !== undefined ? { description: card.description } : {})}
                    {...(card.iconName !== undefined ? { iconName: card.iconName } : {})}
                    {...(card.tagLabel !== undefined ? { tagLabel: card.tagLabel } : {})}
                    {...(card.title !== undefined ? { title: card.title } : {})}
                  >
                    {card.children}
                  </StaticSliderCard>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
