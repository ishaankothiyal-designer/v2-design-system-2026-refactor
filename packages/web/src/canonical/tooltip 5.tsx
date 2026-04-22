import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";
import { TooltipStem, type TooltipStemSide } from "./tooltip-shape";

export const canonicalTooltipWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.tooltip"
);

export type TooltipTip =
  | "Top"
  | "Top Left"
  | "Top Right"
  | "Bottom"
  | "Bottom Left"
  | "Bottom Right"
  | "Left"
  | "Left Top"
  | "Left Bottom"
  | "Right"
  | "Right Top"
  | "Right Bottom";

type TooltipAlignment = "center" | "start" | "end";

type TooltipMetrics = {
  background: string;
  color: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
  lineHeight: string;
  paddingBlock: string;
  paddingInline: string;
  radius: string;
  stemDepth: number;
  stemEdgeOffset: string;
  stemWidth: number;
};

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  children?: ReactNode;
  label?: ReactNode;
  maxWidth?: number | string;
  tip?: TooltipTip;
}

function getTooltipToken(slot: string) {
  return canonicalTooltipWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function resolveTooltipBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getTooltipToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("component.") ||
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.") ||
    token.startsWith("icon.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

function toPixelValue(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function toNumber(value: string, fallback: number) {
  const normalized = value.trim().replace(/px$/, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseTip(tip: TooltipTip): { alignment: TooltipAlignment; side: TooltipStemSide } {
  switch (tip) {
    case "Top":
      return { alignment: "center", side: "top" };
    case "Top Left":
      return { alignment: "start", side: "top" };
    case "Top Right":
      return { alignment: "end", side: "top" };
    case "Bottom":
      return { alignment: "center", side: "bottom" };
    case "Bottom Left":
      return { alignment: "start", side: "bottom" };
    case "Bottom Right":
      return { alignment: "end", side: "bottom" };
    case "Left":
      return { alignment: "center", side: "left" };
    case "Left Top":
      return { alignment: "start", side: "left" };
    case "Left Bottom":
      return { alignment: "end", side: "left" };
    case "Right":
      return { alignment: "center", side: "right" };
    case "Right Top":
      return { alignment: "start", side: "right" };
    case "Right Bottom":
      return { alignment: "end", side: "right" };
  }
}

function getTooltipMetrics(brand: DisplayBrandId): TooltipMetrics {
  return {
    background: resolveTooltipBindingValue(
      brand,
      "surface.background",
      "var(--cars24-semantic-bg-secondary-inverse, #262626)"
    ),
    color: resolveTooltipBindingValue(
      brand,
      "surface.foreground",
      "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    ),
    fontFamily: resolveTooltipBindingValue(
      brand,
      "typography.fontFamily",
      String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
    ),
    fontSize: resolveTooltipBindingValue(
      brand,
      "typography.fontSize",
      "var(--cars24-typography-size-utility-label-2, 14px)"
    ),
    fontWeight: toNumber(
      resolveTooltipBindingValue(
        brand,
        "typography.fontWeight",
        String(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"))
      ),
      Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"))
    ),
    letterSpacing: resolveTooltipBindingValue(
      brand,
      "typography.letterSpacing",
      "var(--cars24-typography-letter-spacing-utility-label-2, 0px)"
    ),
    lineHeight: resolveTooltipBindingValue(
      brand,
      "typography.lineHeight",
      "var(--cars24-typography-line-height-utility-label-2, 18px)"
    ),
    paddingBlock: resolveTooltipBindingValue(
      brand,
      "spacing.paddingBlock",
      "var(--cars24-misc-gap-8, 8px)"
    ),
    paddingInline: resolveTooltipBindingValue(
      brand,
      "spacing.paddingInline",
      "var(--cars24-misc-gap-12, 12px)"
    ),
    radius: resolveTooltipBindingValue(
      brand,
      "radius.container",
      "var(--cars24-theme-radius-alt-sm, 8px)"
    ),
    stemDepth: toNumber(
      resolveTooltipBindingValue(brand, "stem.depth", "var(--cars24-misc-gap-8, 8px)"),
      8
    ),
    stemEdgeOffset: resolveTooltipBindingValue(
      brand,
      "stem.edgeOffset",
      "var(--cars24-misc-gap-12, 12px)"
    ),
    stemWidth: toNumber(
      resolveTooltipBindingValue(brand, "stem.width", `${Number(getRequiredThemeTokenValue(brand, "spacing.4"))}px`),
      Number(getRequiredThemeTokenValue(brand, "spacing.4"))
    )
  };
}

function getStemAlignmentStyles(
  alignment: TooltipAlignment,
  side: TooltipStemSide,
  edgeOffset: string
): CSSProperties {
  const justifyContent =
    alignment === "center" ? "center" : alignment === "start" ? "flex-start" : "flex-end";

  if (side === "top" || side === "bottom") {
    return {
      boxSizing: "border-box",
      display: "flex",
      justifyContent,
      paddingInline: edgeOffset,
      width: "100%"
    };
  }

  return {
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    justifyContent,
    paddingBlock: edgeOffset
  };
}

function getStemOverlapStyles(side: TooltipStemSide): CSSProperties {
  if (side === "top") {
    return { marginBottom: "-1px" };
  }

  if (side === "bottom") {
    return { marginTop: "-1px" };
  }

  if (side === "left") {
    return { marginRight: "-1px" };
  }

  return { marginLeft: "-1px" };
}

export function Tooltip({
  brand = "Cars24",
  children,
  label = "A tooltip is a small box that appears when hovering over a UI element, providing additional information.",
  maxWidth = 248,
  role = "tooltip",
  style,
  tip = "Top",
  ...rest
}: TooltipProps) {
  const metrics = getTooltipMetrics(brand);
  const content = children ?? label;
  const { alignment, side } = parseTip(tip);

  const body = (
    <div
      role={role}
      style={{
        background: metrics.background,
        borderRadius: metrics.radius,
        boxSizing: "border-box",
        color: metrics.color,
        display: "inline-flex",
        fontFamily: `${metrics.fontFamily}, sans-serif`,
        fontSize: metrics.fontSize,
        fontWeight: metrics.fontWeight,
        letterSpacing: metrics.letterSpacing,
        lineHeight: metrics.lineHeight,
        maxWidth: toPixelValue(maxWidth),
        minHeight: `calc(${metrics.lineHeight} + (${metrics.paddingBlock} * 2))`,
        overflowWrap: "break-word",
        padding: `${metrics.paddingBlock} ${metrics.paddingInline}`,
        textAlign: "left",
        whiteSpace: "normal",
        width: "fit-content"
      }}
    >
      {content}
    </div>
  );

  const stem = (
    <div style={getStemAlignmentStyles(alignment, side, metrics.stemEdgeOffset)}>
      <TooltipStem
        background={metrics.background}
        depth={metrics.stemDepth}
        side={side}
        style={getStemOverlapStyles(side)}
        width={metrics.stemWidth}
      />
    </div>
  );

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    boxSizing: "border-box",
    display: "inline-flex",
    flexDirection:
      side === "top" || side === "bottom"
        ? side === "top"
          ? "column"
          : "column-reverse"
        : side === "left"
          ? "row"
          : "row-reverse",
    verticalAlign: "top",
    ...style
  };

  return (
    <div {...rest} style={rootStyles}>
      {stem}
      {body}
    </div>
  );
}
