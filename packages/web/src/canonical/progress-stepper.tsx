import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Icon } from "./icon";

export const canonicalProgressStepperWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.progressStepper"
);

export type ProgressStepperStepState = "Rest" | "Active" | "Loading" | "Success" | "Error" | "Disabled";

export interface ProgressStepperStep {
  label: ReactNode;
  state?: ProgressStepperStepState;
  indicator?: ReactNode;
}

export interface ProgressStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  steps: ProgressStepperStep[];
}

type ProgressStepperMetrics = {
  activeBorderWidth: number;
  activeCircleBackground: string;
  activeCircleForeground: string;
  activeLabelColor: string;
  barActiveThickness: string;
  barInset: string;
  barInactiveThickness: string;
  barTrackColor: string;
  defaultBorderWidth: number;
  disabledCircleBackground: string;
  disabledCircleBorder: string;
  disabledCircleForeground: string;
  disabledLabelColor: string;
  errorColor: string;
  errorTrackColor: string;
  fontFamily: string;
  indicatorIconSize: string;
  indicatorRadius: string;
  indicatorSize: string;
  inverseTextColor: string;
  labelFontSize: string;
  labelLetterSpacing: string;
  labelLineHeight: string;
  labelWeightMedium: number;
  labelWeightSemibold: number;
  loadingTrackColor: string;
  restCircleBackground: string;
  restCircleBorder: string;
  restCircleForeground: string;
  restLabelColor: string;
  stepGap: string;
  stepLabelGap: string;
  stepMinWidth: string;
  successColor: string;
  successTrackColor: string;
};

const PROGRESS_STEPPER_SPIN_KEYFRAMES = `
@keyframes geist-progress-stepper-spin {
  to {
    transform: rotate(360deg);
  }
}
`;

function toPx(value: number) {
  return tokenValueToRem(value);
}

function getProgressStepperMetrics(brand: DisplayBrandId): ProgressStepperMetrics {
  return {
    activeBorderWidth: Number(getRequiredThemeTokenValue(brand, "component.checkbox.focus.outlineWidth")),
    activeCircleBackground: String(getRequiredThemeTokenValue(brand, "component.checkbox.color.checked.background")),
    activeCircleForeground: String(getRequiredThemeTokenValue(brand, "component.checkbox.color.checked.foreground")),
    activeLabelColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.value")),
    barActiveThickness: toPx(Number(getRequiredThemeTokenValue(brand, "component.checkbox.focus.outlineWidth"))),
    barInset: toPx(Number(getRequiredThemeTokenValue(brand, "spacing.1"))),
    barInactiveThickness: toPx(Number(getRequiredThemeTokenValue(brand, "component.iconButton.border.width"))),
    barTrackColor: String(getRequiredThemeTokenValue(brand, "component.iconButton.color.light.outline.black.rest.border")),
    defaultBorderWidth: Number(getRequiredThemeTokenValue(brand, "component.iconButton.border.width")),
    disabledCircleBackground: String(
      getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.disabled.background")
    ),
    disabledCircleBorder: String(
      getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.disabled.border")
    ),
    disabledCircleForeground: String(
      getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.disabled.value")
    ),
    disabledLabelColor: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.disabled.value")),
    errorColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.helper.error.text")),
    errorTrackColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.helper.error.text")),
    fontFamily: String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans")),
    indicatorIconSize: toPx(Number(getRequiredThemeTokenValue(brand, "component.checkbox.size.sm.iconSize"))),
    indicatorRadius: toPx(Number(getRequiredThemeTokenValue(brand, "radius.pill"))),
    indicatorSize: toPx(Number(getRequiredThemeTokenValue(brand, "component.checkbox.size.sm.boxSize"))),
    inverseTextColor: String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
    labelFontSize: toPx(Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.fontSize"))),
    labelLetterSpacing: toPx(Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.letterSpacing"))),
    labelLineHeight: toPx(Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.lineHeight"))),
    labelWeightMedium: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium")),
    labelWeightSemibold: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold")),
    loadingTrackColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.border")),
    restCircleBackground: String(
      getRequiredThemeTokenValue(brand, "component.checkbox.color.disabled.checked.background")
    ),
    restCircleBorder: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.rest.border")),
    restCircleForeground: String(
      getRequiredThemeTokenValue(brand, "component.checkbox.color.disabled.checked.foreground")
    ),
    restLabelColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.helper.default.text")),
    stepGap: toPx(Number(getRequiredThemeTokenValue(brand, "spacing.2"))),
    stepLabelGap: toPx(Number(getRequiredThemeTokenValue(brand, "spacing.1"))),
    stepMinWidth: toPx(Number(getRequiredThemeTokenValue(brand, "spacing.10"))),
    successColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.success.border")),
    successTrackColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.success.border"))
  };
}

function getSegmentFillColor(metrics: ProgressStepperMetrics, state: ProgressStepperStepState) {
  if (state === "Success") {
    return metrics.successTrackColor;
  }

  if (state === "Error") {
    return metrics.errorTrackColor;
  }

  if (state === "Active" || state === "Loading") {
    return metrics.activeCircleBackground;
  }

  return metrics.barTrackColor;
}

function isActiveSegmentState(state: ProgressStepperStepState) {
  return state === "Active" || state === "Loading" || state === "Success" || state === "Error";
}

function getLabelStyles(
  metrics: ProgressStepperMetrics,
  state: ProgressStepperStepState
): CSSProperties {
  const color =
    state === "Success"
      ? metrics.successColor
      : state === "Error"
        ? metrics.errorColor
        : state === "Disabled"
          ? metrics.disabledLabelColor
          : state === "Active" || state === "Loading"
            ? metrics.activeLabelColor
            : metrics.restLabelColor;

  return {
    color,
    display: "block",
    fontFamily: `${metrics.fontFamily}, sans-serif`,
    fontSize: metrics.labelFontSize,
    fontWeight:
      state === "Active" || state === "Loading" ? metrics.labelWeightSemibold : metrics.labelWeightMedium,
    letterSpacing: metrics.labelLetterSpacing,
    lineHeight: metrics.labelLineHeight,
    margin: 0,
    maxWidth: "100%",
    overflow: "hidden",
    textAlign: "center",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };
}

function ProgressStepperIndicator({
  brand,
  content,
  metrics,
  state
}: {
  brand: DisplayBrandId;
  content: ReactNode;
  metrics: ProgressStepperMetrics;
  state: ProgressStepperStepState;
}) {
  const baseStyles: CSSProperties = {
    alignItems: "center",
    background: metrics.restCircleBackground,
    border: `${metrics.defaultBorderWidth}px solid ${metrics.restCircleBorder}`,
    borderRadius: metrics.indicatorRadius,
    boxSizing: "border-box",
    color: metrics.restCircleForeground,
    display: "inline-flex",
    flexShrink: 0,
    height: metrics.indicatorSize,
    justifyContent: "center",
    width: metrics.indicatorSize
  };

  const textStyles: CSSProperties = {
    color: "currentColor",
    fontFamily: `${metrics.fontFamily}, sans-serif`,
    fontSize: metrics.labelFontSize,
    fontWeight: metrics.labelWeightMedium,
    letterSpacing: metrics.labelLetterSpacing,
    lineHeight: 1
  };

  if (state === "Loading") {
    return (
      <>
        <style>{PROGRESS_STEPPER_SPIN_KEYFRAMES}</style>
        <span
          aria-hidden="true"
          style={{
            ...baseStyles,
            animation: "geist-progress-stepper-spin 0.8s linear infinite",
            background: "transparent",
            border: `${metrics.activeBorderWidth}px solid ${metrics.loadingTrackColor}`,
            borderTopColor: metrics.activeCircleBackground,
            color: metrics.activeCircleBackground
          }}
        />
      </>
    );
  }

  if (state === "Success") {
    return (
      <span
        aria-hidden="true"
        style={{
          ...baseStyles,
          background: metrics.successColor,
          border: "none",
          color: metrics.inverseTextColor
        }}
      >
        <Icon
          brand={brand}
          decorative
          name="check-outline"
          size="sm"
          style={{ color: metrics.inverseTextColor, fontSize: metrics.indicatorIconSize }}
        />
      </span>
    );
  }

  if (state === "Error") {
    return (
      <Icon
        brand={brand}
        decorative
        name="error-filled"
        size="sm"
        style={{
          color: metrics.errorColor,
          fontSize: metrics.indicatorSize,
          lineHeight: 1
        }}
      />
    );
  }

  if (state === "Disabled") {
    return (
      <span
        aria-hidden="true"
        style={{
          ...baseStyles,
          background: metrics.disabledCircleBackground,
          borderColor: metrics.disabledCircleBorder,
          color: metrics.disabledCircleForeground
        }}
      >
        <span style={textStyles}>{content}</span>
      </span>
    );
  }

  if (state === "Active") {
    return (
      <span
        aria-hidden="true"
        style={{
          ...baseStyles,
          background: metrics.activeCircleBackground,
          border: `${metrics.activeBorderWidth}px solid ${metrics.activeCircleBackground}`,
          color: metrics.activeCircleForeground
        }}
      >
        <span style={{ ...textStyles, color: metrics.activeCircleForeground, fontWeight: metrics.labelWeightSemibold }}>
          {content}
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" style={baseStyles}>
      <span style={textStyles}>{content}</span>
    </span>
  );
}

/**
 * Token-driven progress stepper that mirrors the canonical Figma step-state set.
 */
export function ProgressStepper({
  brand = "Cars24",
  steps,
  style,
  ...rest
}: ProgressStepperProps) {
  const metrics = getProgressStepperMetrics(brand);
  const resolvedSteps =
    steps.length > 0
      ? steps
      : [
          {
            label: "Step 1",
            state: "Active" as const
          }
        ];

  return (
    <div
      {...rest}
      style={{
        display: "grid",
        gap: metrics.stepGap,
        width: "100%",
        ...style
      }}
    >
      <div
        style={{
          display: "grid",
          gap: metrics.stepGap,
          gridTemplateColumns: `repeat(${Math.max(1, resolvedSteps.length)}, minmax(0, 1fr))`,
          width: "100%"
        }}
      >
        {resolvedSteps.map((step, index) => {
          const state = step.state ?? (index === 0 ? "Active" : "Rest");
          const indicatorContent = step.indicator ?? index + 1;

          return (
            <div
              key={`progress-step-${index + 1}`}
              style={{
                alignItems: "center",
                display: "grid",
                gap: metrics.stepLabelGap,
                justifyItems: "center",
                minWidth: metrics.stepMinWidth
              }}
            >
              <ProgressStepperIndicator
                brand={brand}
                content={indicatorContent}
                metrics={metrics}
                state={state}
              />
              <span style={getLabelStyles(metrics, state)}>{step.label}</span>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(1, resolvedSteps.length)}, minmax(0, 1fr))`,
          width: "100%"
        }}
      >
        {resolvedSteps.map((step, index) => {
          const state = step.state ?? (index === 0 ? "Active" : "Rest");

          return (
            <span
              key={`progress-step-segment-${index + 1}`}
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                paddingInline: metrics.barInset,
                width: "100%"
              }}
            >
              <span
                style={{
                  background: getSegmentFillColor(metrics, state),
                  display: "block",
                  height: isActiveSegmentState(state) ? metrics.barActiveThickness : metrics.barInactiveThickness,
                  width: "100%"
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
