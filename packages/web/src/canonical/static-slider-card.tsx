import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import type { IconName } from "@turbo/icons";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import {
  getReadableTextColor,
  getRequiredThemeTokenValue,
  pxToRem,
  sampleBackgroundImageIsDark,
  sampleImageElementIsDark
} from "../theme";
import { Icon } from "./icon";
import { Tag } from "./tag";

export const canonicalStaticSliderCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.staticSliderCard"
);

export type StaticSliderCardColumnCount = "1+" | "2+" | "3+" | "4+";
export type StaticSliderCardType = "Text Inside" | "Text Outside" | "With Icon";
export type StaticSliderCardSize = "Large" | "Medium" | "Small";

type StaticSliderCardTextScale = "L" | "S";

export interface StaticSliderCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  columnCount?: StaticSliderCardColumnCount;
  type?: StaticSliderCardType;
  size?: StaticSliderCardSize;
  title?: string;
  description?: string;
  tagLabel?: string;
  iconName?: IconName;
  children?: ReactNode;
}

type StaticSliderCardMetrics = {
  width: number;
  height: number;
  textOutsideMediaHeight: number | null;
  contentInset: number;
  iconSize: number;
  textScale: StaticSliderCardTextScale;
};

const TITLE_TYPOGRAPHY: Record<
  StaticSliderCardTextScale,
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
  }
};

const DESCRIPTION_TYPOGRAPHY: Record<
  StaticSliderCardTextScale,
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

const STATIC_SLIDER_CARD_METRICS: Record<
  StaticSliderCardColumnCount,
  Partial<Record<StaticSliderCardSize, StaticSliderCardMetrics>>
> = {
  "1+": {
    Large: {
      width: 200,
      height: 240,
      textOutsideMediaHeight: 200,
      contentInset: 12,
      iconSize: 32,
      textScale: "L"
    },
    Medium: {
      width: 200,
      height: 200,
      textOutsideMediaHeight: 156,
      contentInset: 12,
      iconSize: 32,
      textScale: "L"
    },
    Small: {
      width: 200,
      height: 120,
      textOutsideMediaHeight: 80,
      contentInset: 12,
      iconSize: 32,
      textScale: "L"
    }
  },
  "2+": {
    Large: {
      width: 140,
      height: 168,
      textOutsideMediaHeight: 128,
      contentInset: 12,
      iconSize: 24,
      textScale: "L"
    },
    Medium: {
      width: 140,
      height: 140,
      textOutsideMediaHeight: 96,
      contentInset: 12,
      iconSize: 24,
      textScale: "L"
    },
    Small: {
      width: 140,
      height: 84,
      textOutsideMediaHeight: null,
      contentInset: 12,
      iconSize: 24,
      textScale: "L"
    }
  },
  "3+": {
    Large: {
      width: 92,
      height: 110,
      textOutsideMediaHeight: 73,
      contentInset: 10,
      iconSize: 20,
      textScale: "S"
    },
    Medium: {
      width: 92,
      height: 92,
      textOutsideMediaHeight: 66,
      contentInset: 10,
      iconSize: 20,
      textScale: "S"
    },
    Small: {
      width: 92,
      height: 55,
      textOutsideMediaHeight: null,
      contentInset: 10,
      iconSize: 20,
      textScale: "L"
    }
  },
  "4+": {
    Large: {
      width: 70,
      height: 84,
      textOutsideMediaHeight: 62,
      contentInset: 10,
      iconSize: 16,
      textScale: "S"
    },
    Medium: {
      width: 70,
      height: 70,
      textOutsideMediaHeight: 44,
      contentInset: 10,
      iconSize: 16,
      textScale: "S"
    }
  }
};

function getInsideRadiusTokenPath(columnCount: StaticSliderCardColumnCount) {
  return columnCount === "1+" || columnCount === "2+" ? "radius.xl" : "radius.lg";
}

function getOutsideRadiusTokenPath(columnCount: StaticSliderCardColumnCount) {
  if (columnCount === "4+") {
    return "radius.md";
  }

  return columnCount === "1+" || columnCount === "2+" ? "radius.xl" : "radius.lg";
}

function resolveMetrics(
  columnCount: StaticSliderCardColumnCount,
  size: StaticSliderCardSize,
  type: StaticSliderCardType
) {
  const metrics = STATIC_SLIDER_CARD_METRICS[columnCount][size];

  if (!metrics) {
    throw new Error(
      `StaticSliderCard does not support the Figma-invisible combination: ${columnCount} / ${type} / ${size}.`
    );
  }

  if (type === "Text Outside" && metrics.textOutsideMediaHeight === null) {
    throw new Error(
      `StaticSliderCard does not support the Figma-invisible combination: ${columnCount} / ${type} / ${size}.`
    );
  }

  if (columnCount === "3+" && size === "Small" && type !== "Text Inside") {
    throw new Error(
      `StaticSliderCard does not support the Figma-invisible combination: ${columnCount} / ${type} / ${size}.`
    );
  }

  return metrics;
}

function allowsTag(
  columnCount: StaticSliderCardColumnCount,
  size: StaticSliderCardSize,
  type: StaticSliderCardType
) {
  if (columnCount === "4+") {
    return false;
  }

  if (columnCount === "3+") {
    return type === "Text Outside" && size !== "Small";
  }

  return true;
}

function allowsDescription(
  columnCount: StaticSliderCardColumnCount,
  size: StaticSliderCardSize,
  type: StaticSliderCardType
) {
  if (type === "Text Outside") {
    return false;
  }

  if (columnCount === "1+") {
    return true;
  }

  if (columnCount === "2+") {
    return !(type === "With Icon" && size === "Small");
  }

  return false;
}

function StaticSliderCardTextBlock({
  align,
  brand,
  titleTone,
  description,
  descriptionTone,
  scale,
  title
}: {
  align: "left" | "center";
  brand: DisplayBrandId;
  titleTone: string;
  description?: string | undefined;
  descriptionTone: string;
  scale: StaticSliderCardTextScale;
  title: string;
}) {
  const titleTypography = TITLE_TYPOGRAPHY[scale];
  const descriptionTypography = DESCRIPTION_TYPOGRAPHY[scale];
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const titleWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const descriptionWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const textAlign = align === "center" ? "center" : "left";

  const wrapperStyles: CSSProperties = {
    alignItems: align === "center" ? "center" : "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: description ? pxToRem(2) : 0,
    minWidth: 0,
    textAlign
  };

  const titleStyles: CSSProperties = {
    color: titleTone,
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

  const descriptionStyles: CSSProperties | null = description
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

function StaticSliderCardIcon({
  brand,
  iconName,
  tone,
  size
}: {
  brand: DisplayBrandId;
  iconName: IconName;
  tone: string;
  size: number;
}) {
  return (
    <Icon
      brand={brand}
      decorative
      name={iconName}
      style={{ color: tone, fontSize: pxToRem(size) }}
    />
  );
}

/**
 * Slot-based fixed-dimension card used by the static slider widget, adapting density across the approved slider column counts.
 */
export function StaticSliderCard({
  brand = "Cars24",
  children,
  className,
  columnCount = "1+",
  description = "Description",
  iconName = "placeholder-generate-outline",
  size = "Medium",
  style,
  tagLabel = "New",
  title = "Title",
  type = "Text Inside",
  ...rest
}: StaticSliderCardProps) {
  const metrics = resolveMetrics(columnCount, size, type);
  const showTag = Boolean(tagLabel) && allowsTag(columnCount, size, type);
  const showDescription = Boolean(description) && allowsDescription(columnCount, size, type);
  const slotSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const insideRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, getInsideRadiusTokenPath(columnCount))));
  const outsideRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, getOutsideRadiusTokenPath(columnCount))));
  const contentInset = pxToRem(metrics.contentInset);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const resolvedBackground =
    typeof style?.background === "string"
      ? style.background
      : typeof style?.backgroundColor === "string"
        ? style.backgroundColor
        : slotSurface;
  const backgroundImage = typeof style?.backgroundImage === "string" ? style.backgroundImage : undefined;
  const defaultOnSurfaceTextTone = getReadableTextColor(resolvedBackground);
  const [onSurfaceTextTone, setOnSurfaceTextTone] = useState(defaultOnSurfaceTextTone);
  const titleTone = type === "Text Outside"
    ? String(getRequiredThemeTokenValue(brand, "color.text.primary"))
    : onSurfaceTextTone;
  const descriptionTone = type === "Text Outside"
    ? String(getRequiredThemeTokenValue(brand, "color.text.secondary"))
    : onSurfaceTextTone;

  const rootStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: type === "Text Outside" ? pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2"))) : undefined,
    position: "relative",
    width: pxToRem(metrics.width),
    ...(type === "Text Outside" ? null : { height: pxToRem(metrics.height) }),
    ...style
  };

  const slotStyles: CSSProperties = {
    background: slotSurface,
    borderRadius: type === "Text Outside" ? outsideRadius : insideRadius,
    height:
      type === "Text Outside"
        ? pxToRem(metrics.textOutsideMediaHeight ?? metrics.height)
        : pxToRem(metrics.height),
    inset: type === "Text Outside" ? undefined : 0,
    overflow: "hidden",
    position: type === "Text Outside" ? "relative" : "absolute",
    width: "100%"
  };

  useEffect(() => {
    let cancelled = false;

    async function resolveTone() {
      const imageElement = slotRef.current?.querySelector("img");
      const imageDarkness = imageElement ? await sampleImageElementIsDark(imageElement) : null;
      const backgroundImageDarkness =
        imageDarkness === null && backgroundImage ? await sampleBackgroundImageIsDark(backgroundImage) : null;
      const nextTone =
        imageDarkness === null && backgroundImageDarkness === null
          ? defaultOnSurfaceTextTone
          : imageDarkness === true || backgroundImageDarkness === true
            ? "#FFFFFF"
            : "#000000";

      if (!cancelled) {
        setOnSurfaceTextTone(nextTone);
      }
    }

    setOnSurfaceTextTone(defaultOnSurfaceTextTone);
    void resolveTone();

    return () => {
      cancelled = true;
    };
  }, [backgroundImage, children, defaultOnSurfaceTextTone]);

  const slotContentStyles: CSSProperties = {
    borderRadius: type === "Text Outside" ? outsideRadius : insideRadius,
    inset: 0,
    overflow: "hidden",
    position: "absolute"
  };

  const tagElement = showTag ? <Tag brand={brand} color="Red" label={tagLabel} priority="High" size="Small" /> : null;

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div ref={slotRef} style={slotStyles}>
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
            <StaticSliderCardTextBlock
              align="left"
              brand={brand}
              titleTone={titleTone}
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
                justifyContent: showTag ? "space-between" : "flex-start"
              }}
            >
              <StaticSliderCardIcon brand={brand} iconName={iconName} size={metrics.iconSize} tone={onSurfaceTextTone} />
              {tagElement}
            </div>

            <div style={{ marginTop: "auto" }}>
              <StaticSliderCardTextBlock
                align="left"
                brand={brand}
                titleTone={titleTone}
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
              right: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2"))),
              top: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2")))
            }}
          >
            {tagElement}
          </div>
        ) : null}
      </div>

      {type === "Text Outside" ? (
        <StaticSliderCardTextBlock
          align="center"
          brand={brand}
          titleTone={titleTone}
          description={undefined}
          descriptionTone={descriptionTone}
          scale={metrics.textScale}
          title={title}
        />
      ) : null}
    </div>
  );
}
