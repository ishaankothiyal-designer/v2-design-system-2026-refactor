import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@turbo/icons";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";
import { Tag } from "./tag";

export const canonicalGridCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.gridCard"
);

export type GridCardColumnCount = "2 Column" | "3 Column" | "4 Column" | "5 Column";
export type GridCardType = "Text Inside" | "Text Outside" | "With Icon";
export type GridCardSize = "Large" | "Medium" | "Small";

type GridCardTextScale = "L" | "S" | "XS";

export interface GridCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  columnCount?: GridCardColumnCount;
  type?: GridCardType;
  size?: GridCardSize;
  title?: string;
  description?: string;
  tagLabel?: string;
  iconName?: IconName;
  children?: ReactNode;
}

type GridCardMetrics = {
  width: number;
  slotHeight: number;
  outsideGap: number;
  contentInset: number;
  outsideTagInset: number;
  iconSize: number;
  textScale: GridCardTextScale;
};

const TITLE_TYPOGRAPHY: Record<
  GridCardTextScale,
  { fontSize: number; lineHeight: number; letterSpacing: number }
> = {
  L: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0
  },
  S: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0
  },
  XS: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0
  }
};

const DESCRIPTION_TYPOGRAPHY: Record<
  Exclude<GridCardTextScale, "XS">,
  { fontSize: number; lineHeight: number; letterSpacing: number }
> = {
  L: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0
  },
  S: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0
  }
};

const GRID_CARD_METRICS: Record<
  GridCardColumnCount,
  Partial<Record<GridCardSize, GridCardMetrics>>
> = {
  "2 Column": {
    Large: {
      width: 162,
      slotHeight: 194,
      outsideGap: 8,
      contentInset: 12,
      outsideTagInset: 10,
      iconSize: 32,
      textScale: "L"
    },
    Medium: {
      width: 162,
      slotHeight: 162,
      outsideGap: 8,
      contentInset: 12,
      outsideTagInset: 10,
      iconSize: 32,
      textScale: "L"
    },
    Small: {
      width: 162,
      slotHeight: 108,
      outsideGap: 8,
      contentInset: 12,
      outsideTagInset: 10,
      iconSize: 32,
      textScale: "L"
    }
  },
  "3 Column": {
    Large: {
      width: 104,
      slotHeight: 125,
      outsideGap: 4,
      contentInset: 10,
      outsideTagInset: 8,
      iconSize: 28,
      textScale: "S"
    },
    Medium: {
      width: 104,
      slotHeight: 104,
      outsideGap: 4,
      contentInset: 10,
      outsideTagInset: 8,
      iconSize: 24,
      textScale: "S"
    },
    Small: {
      width: 104,
      slotHeight: 69,
      outsideGap: 4,
      contentInset: 10,
      outsideTagInset: 8,
      iconSize: 24,
      textScale: "S"
    }
  },
  "4 Column": {
    Large: {
      width: 75,
      slotHeight: 90,
      outsideGap: 4,
      contentInset: 10,
      outsideTagInset: 8,
      iconSize: 20,
      textScale: "S"
    },
    Medium: {
      width: 75,
      slotHeight: 75,
      outsideGap: 4,
      contentInset: 10,
      outsideTagInset: 8,
      iconSize: 20,
      textScale: "S"
    }
  },
  "5 Column": {
    Large: {
      width: 60,
      slotHeight: 81,
      outsideGap: 4,
      contentInset: 10,
      outsideTagInset: 8,
      iconSize: 20,
      textScale: "XS"
    }
  }
};

const TEXT_OUTSIDE_SLOT_HEIGHT: Record<
  GridCardColumnCount,
  Partial<Record<GridCardSize, number>>
> = {
  "2 Column": {
    Large: 150,
    Medium: 122,
    Small: 84
  },
  "3 Column": {
    Large: 89,
    Medium: 68,
    Small: 49
  },
  "4 Column": {
    Large: 70,
    Medium: 55
  },
  "5 Column": {
    Large: 43
  }
};

function resolveMetrics(columnCount: GridCardColumnCount, size: GridCardSize, type: GridCardType) {
  const metrics = GRID_CARD_METRICS[columnCount][size];

  if (!metrics) {
    throw new Error(
      `GridCard does not support the Figma-invisible combination: ${columnCount} / ${type} / ${size}.`
    );
  }

  if (type === "Text Outside") {
    const outsideSlotHeight = TEXT_OUTSIDE_SLOT_HEIGHT[columnCount][size];

    if (!outsideSlotHeight) {
      throw new Error(
        `GridCard does not support the Figma-invisible combination: ${columnCount} / ${type} / ${size}.`
      );
    }

    return {
      ...metrics,
      slotHeight: outsideSlotHeight
    };
  }

  return metrics;
}

function getSlotRadiusTokenPath(columnCount: GridCardColumnCount) {
  return columnCount === "5 Column" ? "radius.lg" : "radius.xl";
}

function allowsTag(columnCount: GridCardColumnCount, size: GridCardSize, type: GridCardType) {
  if (columnCount === "2 Column") {
    return true;
  }

  if (columnCount === "3 Column") {
    return size !== "Small" || type === "Text Outside";
  }

  return false;
}

function allowsDescription(columnCount: GridCardColumnCount, size: GridCardSize, type: GridCardType) {
  if (type === "Text Outside") {
    return false;
  }

  return columnCount === "2 Column" || (columnCount === "3 Column" && size !== "Small");
}

function GridCardTextBlock({
  align,
  brand,
  description,
  descriptionTone,
  scale,
  title
}: {
  align: "left" | "center";
  brand: DisplayBrandId;
  description?: string | undefined;
  descriptionTone: string;
  scale: GridCardTextScale;
  title: string;
}) {
  const titleTypography = TITLE_TYPOGRAPHY[scale];
  const descriptionTypography = scale === "XS" ? null : DESCRIPTION_TYPOGRAPHY[scale];
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const titleWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const descriptionWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const titleColor = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textAlign = align === "center" ? "center" : "left";

  const wrapperStyles: CSSProperties = {
    alignItems: align === "center" ? "center" : "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: scale === "XS" || !description ? 0 : pxToRem(2),
    minWidth: 0,
    textAlign
  };

  const titleStyles: CSSProperties = {
    color: titleColor,
    display: "block",
    fontFamily,
    fontSize: pxToRem(titleTypography.fontSize),
    fontWeight: titleWeight,
    letterSpacing: `${titleTypography.letterSpacing}px`,
    lineHeight: pxToRem(titleTypography.lineHeight),
    margin: 0,
    maxWidth: "100%",
    overflowWrap: "anywhere"
  };

  const descriptionStyles: CSSProperties | null =
    description && descriptionTypography
      ? {
          color: descriptionTone,
          display: "block",
          fontFamily,
          fontSize: pxToRem(descriptionTypography.fontSize),
          fontWeight: descriptionWeight,
          letterSpacing: `${descriptionTypography.letterSpacing}px`,
          lineHeight: pxToRem(descriptionTypography.lineHeight),
          margin: 0,
          maxWidth: "100%",
          overflowWrap: "anywhere"
        }
      : null;

  return (
    <div style={wrapperStyles}>
      <span style={titleStyles}>{title}</span>
      {description && descriptionStyles ? <span style={descriptionStyles}>{description}</span> : null}
    </div>
  );
}

function GridCardIcon({
  brand,
  iconName,
  size
}: {
  brand: DisplayBrandId;
  iconName: IconName;
  size: number;
}) {
  return (
    <Icon
      brand={brand}
      decorative
      name={iconName}
      style={{ fontSize: pxToRem(size), color: String(getRequiredThemeTokenValue(brand, "color.text.primary")) }}
    />
  );
}

/**
 * Fixed-dimension content card used inside editorial or discovery grids, with visual density controlled by the intended grid column count.
 */
export function GridCard({
  brand = "Cars24",
  children,
  className,
  columnCount = "2 Column",
  description = "Description",
  iconName = "placeholder-generate-outline",
  size = "Large",
  style,
  tagLabel = "New",
  title = "Title",
  type = "Text Inside",
  ...rest
}: GridCardProps) {
  const metrics = resolveMetrics(columnCount, size, type);
  const showTag = Boolean(tagLabel) && allowsTag(columnCount, size, type);
  const showDescription = Boolean(description) && allowsDescription(columnCount, size, type);
  const descriptionTone = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const slotSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const slotRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, getSlotRadiusTokenPath(columnCount))));
  const contentInset = pxToRem(metrics.contentInset);

  const rootStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: type === "Text Outside" ? pxToRem(metrics.outsideGap) : undefined,
    position: "relative",
    width: pxToRem(metrics.width),
    ...(type === "Text Outside" ? null : { height: pxToRem(metrics.slotHeight) }),
    ...style
  };

  const slotStyles: CSSProperties = {
    background: slotSurface,
    borderRadius: slotRadius,
    height: pxToRem(metrics.slotHeight),
    inset: type === "Text Outside" ? undefined : 0,
    overflow: "hidden",
    position: type === "Text Outside" ? "relative" : "absolute",
    width: "100%"
  };

  const slotContentStyles: CSSProperties = {
    borderRadius: slotRadius,
    inset: 0,
    overflow: "hidden",
    position: "absolute"
  };

  const tagElement = showTag ? <Tag brand={brand} color="Red" label={tagLabel} priority="High" size="Small" /> : null;

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={slotStyles}>
        <div style={slotContentStyles}>{children}</div>

        {type === "Text Inside" ? (
          <div
            style={{
              display: "flex",
              gap: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2"))),
              inset: contentInset,
              justifyContent: "space-between",
              position: "absolute"
            }}
          >
            <GridCardTextBlock
              align="left"
              brand={brand}
              description={showDescription ? description : undefined}
              descriptionTone={descriptionTone}
              scale={metrics.textScale}
              title={title}
            />
            {tagElement}
          </div>
        ) : null}

        {type === "With Icon" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              inset: contentInset,
              position: "absolute"
            }}
          >
            <div
              style={{
                alignItems: "flex-start",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <GridCardIcon brand={brand} iconName={iconName} size={metrics.iconSize} />
              {tagElement}
            </div>

            <div style={{ marginTop: "auto" }}>
              <GridCardTextBlock
                align="left"
                brand={brand}
                description={showDescription ? description : undefined}
                descriptionTone={descriptionTone}
                scale={metrics.textScale}
                title={title}
              />
            </div>
          </div>
        ) : null}

        {type === "Text Outside" ? (
          <div
            style={{
              position: "absolute",
              right: pxToRem(metrics.outsideTagInset),
              top: pxToRem(metrics.outsideTagInset)
            }}
          >
            {tagElement}
          </div>
        ) : null}
      </div>

      {type === "Text Outside" ? (
        <GridCardTextBlock
          align="center"
          brand={brand}
          description={undefined}
          descriptionTone={descriptionTone}
          scale={metrics.textScale}
          title={title}
        />
      ) : null}
    </div>
  );
}
