import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalStepperBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.stepperBar"
);

export type StepperBarVariant = "Discrete" | "Continuous";
export type StepperBarSegmentState = "Not started" | "Half done" | "Done" | "Focus";

export interface StepperBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  segmentStates?: StepperBarSegmentState[];
  stepCount?: number;
  variant?: StepperBarVariant;
  width?: number | string;
}

type StepperBarMetrics = {
  containerBackground: string;
  containerBlur: string;
  containerPaddingBlock: number;
  containerPaddingInline: number;
  fillColor: string;
  focusBorderColor: string;
  gap: number;
  rootWidth: number | string;
  segmentHeight: number;
  segmentRadius: string;
  trackColor: string;
};

const MIN_STEP_COUNT = 2;
const MAX_STEP_COUNT = 6;
const HALF_DONE_FILL_RATIO = 84 / 164;
const DEFAULT_WIDTH = 360;
const CONTINUOUS_BACKGROUND_FALLBACK = "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)";

function clampStepCount(value: number) {
  return Math.min(Math.max(Math.round(value), MIN_STEP_COUNT), MAX_STEP_COUNT);
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => `${segment}${segment}`)
          .join("")
      : normalized;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function toCssDimension(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function resolveStepCount(stepCount: number | undefined, segmentStates: StepperBarSegmentState[] | undefined) {
  if (typeof stepCount === "number" && Number.isFinite(stepCount)) {
    return clampStepCount(stepCount);
  }

  if (segmentStates?.length) {
    return clampStepCount(segmentStates.length);
  }

  return MIN_STEP_COUNT;
}

function getDefaultSegmentStates(
  stepCount: number,
  variant: StepperBarVariant
): StepperBarSegmentState[] {
  if (variant === "Continuous") {
    return Array.from({ length: stepCount }, (_, index) => {
      if (index < stepCount - 2) {
        return "Done";
      }

      if (index === stepCount - 2) {
        return "Half done";
      }

      return "Not started";
    });
  }

  return Array.from({ length: stepCount }, (_, index) => (
    index < stepCount - 1 ? "Done" : "Not started"
  ));
}

function normalizeSegmentStates(
  stepCount: number,
  variant: StepperBarVariant,
  segmentStates: StepperBarSegmentState[] | undefined
) {
  const defaults = getDefaultSegmentStates(stepCount, variant);

  if (!segmentStates?.length) {
    return defaults;
  }

  const normalized = segmentStates.slice(0, stepCount);

  while (normalized.length < stepCount) {
    const fallbackState = defaults[normalized.length] ?? "Not started";
    normalized.push(fallbackState);
  }

  return normalized;
}

function getStepperBarMetrics(
  brand: DisplayBrandId,
  variant: StepperBarVariant,
  width: number | string | undefined
): StepperBarMetrics {
  const inverseText = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const focusBorder = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.border"));
  const primaryTrack = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.background"));
  const primaryFill = String(getRequiredThemeTokenValue(brand, "component.switch.color.selected.track"));

  return {
    containerBackground: variant === "Continuous" ? CONTINUOUS_BACKGROUND_FALLBACK : "transparent",
    containerBlur: variant === "Continuous" ? "blur(0.302px)" : "none",
    containerPaddingBlock: Number(getRequiredThemeTokenValue(brand, "spacing.4")),
    containerPaddingInline: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
    fillColor: variant === "Continuous" ? inverseText : primaryFill,
    focusBorderColor: variant === "Continuous" ? hexToRgba(inverseText, 0.3) : focusBorder,
    gap: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
    rootWidth: width ?? DEFAULT_WIDTH,
    segmentHeight: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    segmentRadius: `${Number(getRequiredThemeTokenValue(brand, "radius.pill"))}px`,
    trackColor: variant === "Continuous" ? hexToRgba(inverseText, 0.4) : primaryTrack
  };
}

function getSegmentStyles(
  metrics: StepperBarMetrics,
  state: StepperBarSegmentState
): CSSProperties {
  return {
    background: state === "Focus" ? metrics.fillColor : metrics.trackColor,
    border: state === "Focus" ? `1px solid ${metrics.focusBorderColor}` : "none",
    borderRadius: metrics.segmentRadius,
    boxSizing: "border-box",
    flex: "1 1 0",
    height: `${metrics.segmentHeight}px`,
    minWidth: 0,
    overflow: "hidden",
    position: "relative"
  };
}

function getFillStyles(
  metrics: StepperBarMetrics,
  state: StepperBarSegmentState
): CSSProperties | null {
  if (state !== "Half done" && state !== "Done") {
    return null;
  }

  return {
    background: metrics.fillColor,
    borderRadius: metrics.segmentRadius,
    height: "100%",
    insetBlock: 0,
    left: 0,
    position: "absolute",
    width: state === "Done" ? "100%" : `${HALF_DONE_FILL_RATIO * 100}%`
  };
}

/**
 * Token-driven stepper bar matching the canonical Figma count variants, with optional per-segment state overrides.
 */
export function StepperBar({
  brand = "Cars24",
  segmentStates,
  stepCount,
  style,
  variant = "Discrete",
  width,
  ...rest
}: StepperBarProps) {
  const resolvedStepCount = resolveStepCount(stepCount, segmentStates);
  const resolvedStates = normalizeSegmentStates(resolvedStepCount, variant, segmentStates);
  const metrics = getStepperBarMetrics(brand, variant, width);

  const rootStyles: CSSProperties = {
    alignItems: "center",
    backdropFilter: metrics.containerBlur,
    background:
      variant === "Continuous"
        ? `linear-gradient(180deg, ${metrics.containerBackground} 20.192%, rgba(0, 0, 0, 0) 100%)`
        : metrics.containerBackground,
    boxSizing: "border-box",
    display: "flex",
    gap: `${metrics.gap}px`,
    padding: `${metrics.containerPaddingBlock}px ${metrics.containerPaddingInline}px`,
    position: "relative",
    width: toCssDimension(metrics.rootWidth),
    ...style
  };

  return (
    <div {...rest} style={rootStyles}>
      {resolvedStates.map((state, index) => {
        const fillStyles = getFillStyles(metrics, state);

        return (
          <div key={`stepper-bar-segment-${index + 1}`} style={getSegmentStyles(metrics, state)}>
            {fillStyles ? <div aria-hidden="true" style={fillStyles} /> : null}
          </div>
        );
      })}
    </div>
  );
}
