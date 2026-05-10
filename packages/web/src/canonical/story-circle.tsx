import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";

export const canonicalStoryCircleWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.storyCircle"
);

export type StoryCircleSize = "Large" | "Small";

type StoryCircleMetrics = {
  circleSize: number;
  contentSize: number;
  gapTokenPath: string;
  titleWidth: number;
};

const STORY_CIRCLE_METRICS: Record<StoryCircleSize, StoryCircleMetrics> = {
  Large: {
    circleSize: 88,
    contentSize: 76,
    gapTokenPath: "spacing.2",
    titleWidth: 96
  },
  Small: {
    circleSize: 70,
    contentSize: 60,
    gapTokenPath: "spacing.1",
    titleWidth: 70
  }
};

export interface StoryCircleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  children?: ReactNode;
  size?: StoryCircleSize;
  title?: string;
}

/**
 * Canonical circular story/media wrapper with a brand ring and centered single-line title.
 */
export function StoryCircle({
  brand = "Cars24",
  children,
  size = "Large",
  style,
  title = "Title",
  ...rest
}: StoryCircleProps) {
  const metrics = STORY_CIRCLE_METRICS[size];
  const borderColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const gap = Number(getRequiredThemeTokenValue(brand, metrics.gapTokenPath));
  const placeholderColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const surfaceColor = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const titleColor = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const titleFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const titleFontSize = Number(getRequiredThemeTokenValue(brand, "component.button.typography.sm.fontSize"));
  const titleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const titleLetterSpacing = Number(
    getRequiredThemeTokenValue(brand, "component.button.typography.sm.letterSpacing")
  );
  const titleLineHeight = Number(getRequiredThemeTokenValue(brand, "component.button.typography.sm.lineHeight"));

  const titleStyles: CSSProperties = {
    color: titleColor,
    display: "block",
    fontFamily: `${titleFontFamily}, sans-serif`,
    fontSize: pxToRem(titleFontSize),
    fontWeight: titleFontWeight,
    letterSpacing: `${titleLetterSpacing}em`,
    lineHeight: pxToRem(titleLineHeight),
    width: pxToRem(metrics.titleWidth),
    overflow: "hidden",
    textAlign: "center",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  return (
    <div
      {...rest}
      style={{
        alignItems: "center",
        display: "inline-grid",
        gap: pxToRem(gap),
        justifyItems: "center",
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderRadius: "50%",
          display: "inline-flex",
          height: pxToRem(metrics.circleSize),
          justifyContent: "center",
          position: "relative",
          width: pxToRem(metrics.circleSize)
        }}
      >
        <div
          aria-hidden
          style={{
            background: surfaceColor,
            border: `${pxToRem(2)} solid ${borderColor}`,
            borderRadius: "50%",
            inset: 0,
            pointerEvents: "none",
            position: "absolute"
          }}
        />

        <div
          aria-hidden={children ? undefined : true}
          style={{
            alignItems: "center",
            background: children ? undefined : placeholderColor,
            borderRadius: "50%",
            display: "inline-flex",
            height: pxToRem(metrics.contentSize),
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            width: pxToRem(metrics.contentSize)
          }}
        >
          {children}
        </div>
      </div>

      <span style={titleStyles}>{title}</span>
    </div>
  );
}
