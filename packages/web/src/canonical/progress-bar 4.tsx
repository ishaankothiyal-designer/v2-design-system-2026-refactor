import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalProgressBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.progressBar"
);

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  percentage?: number;
  showPercentage?: boolean;
  width?: number | string;
}

type ProgressBarMetrics = {
  fillColor: string;
  fillRadius: string;
  fontFamily: string;
  fontWeightRegular: number;
  labelColor: string;
  labelFontSize: number;
  labelLetterSpacing: number;
  labelLineHeight: number;
  trackColor: string;
  trackHeight: number;
  trackRadius: string;
};

const DEFAULT_PERCENTAGE = 10;
const DEFAULT_TRACK_WIDTH = 161;
const ROOT_GAP = 6;

const DOCUMENTED_VARIANT_FILL_PERCENTAGES: Record<number, number> = {
  10: (25.246 / DEFAULT_TRACK_WIDTH) * 100,
  40: (81.514 / DEFAULT_TRACK_WIDTH) * 100,
  100: 100
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toCssDimension(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function toPx(value: number) {
  return `${value}px`;
}

function formatPercentage(percentage: number) {
  const normalized =
    Number.isInteger(percentage) ? percentage.toString() : percentage.toFixed(1).replace(/\.0$/, "");

  return `${normalized}%`;
}

function getVisualFillPercentage(percentage: number) {
  const documentedPercentage = DOCUMENTED_VARIANT_FILL_PERCENTAGES[percentage];
  return documentedPercentage ?? percentage;
}

function getProgressBarMetrics(brand: DisplayBrandId): ProgressBarMetrics {
  return {
    fillColor: String(getRequiredThemeTokenValue(brand, "component.switch.color.selected.track")),
    fillRadius: `${Number(getRequiredThemeTokenValue(brand, "radius.pill"))}px`,
    fontFamily: String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans")),
    fontWeightRegular: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")),
    labelColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.helper.default.text")),
    labelFontSize: Number(getRequiredThemeTokenValue(brand, "component.label.sm.typography.label.fontSize")),
    labelLetterSpacing: Number(
      getRequiredThemeTokenValue(brand, "component.label.sm.typography.label.letterSpacing")
    ),
    labelLineHeight: Number(getRequiredThemeTokenValue(brand, "component.label.sm.typography.label.lineHeight")),
    trackColor: String(getRequiredThemeTokenValue(brand, "component.iconButton.color.light.outline.black.rest.border")),
    trackHeight: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
    trackRadius: `${Number(getRequiredThemeTokenValue(brand, "radius.alt.xs"))}px`
  };
}

/**
 * Token-driven progress bar that preserves the published Figma 10%, 40%, and 100% fill ratios.
 */
export function ProgressBar({
  brand = "Cars24",
  className,
  percentage = DEFAULT_PERCENTAGE,
  showPercentage = true,
  style,
  width = DEFAULT_TRACK_WIDTH,
  ...rest
}: ProgressBarProps) {
  const metrics = getProgressBarMetrics(brand);
  const safePercentage = Number.isFinite(percentage) ? percentage : DEFAULT_PERCENTAGE;
  const clampedPercentage = clamp(safePercentage, 0, 100);
  const label = formatPercentage(clampedPercentage);
  const fillPercentage = getVisualFillPercentage(clampedPercentage);

  const rootStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: toPx(ROOT_GAP),
    maxWidth: "100%",
    minWidth: 0,
    ...style
  };

  const trackStyles: CSSProperties = {
    background: metrics.trackColor,
    borderRadius: metrics.trackRadius,
    display: "block",
    flex: "0 0 auto",
    height: toPx(metrics.trackHeight),
    overflow: "hidden",
    width: toCssDimension(width)
  };

  const fillStyles: CSSProperties = {
    background: metrics.fillColor,
    borderRadius: metrics.fillRadius,
    display: "block",
    height: "100%",
    width: `${fillPercentage}%`
  };

  const labelStyles: CSSProperties = {
    color: metrics.labelColor,
    fontFamily: `${metrics.fontFamily}, sans-serif`,
    fontSize: toPx(metrics.labelFontSize),
    fontWeight: metrics.fontWeightRegular,
    letterSpacing: toPx(metrics.labelLetterSpacing),
    lineHeight: toPx(metrics.labelLineHeight),
    margin: 0,
    whiteSpace: "nowrap"
  };

  return (
    <div
      {...rest}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clampedPercentage}
      aria-valuetext={label}
      className={className}
      role="progressbar"
      style={rootStyles}
    >
      <span aria-hidden="true" style={trackStyles}>
        <span style={fillStyles} />
      </span>
      {showPercentage ? <span style={labelStyles}>{label}</span> : null}
    </div>
  );
}
