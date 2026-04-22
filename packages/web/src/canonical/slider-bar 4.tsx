import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";
import { TooltipStem } from "./tooltip-shape";

export const canonicalSliderBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.sliderBar"
);

export type SliderBarMode = "Single" | "Range";
export type SliderBarOrientation = "Horizontal" | "Vertical";
export type SliderBarState = "Normal" | "Active" | "Disabled";
export type SliderBarTooltipDirection = "Top" | "Bottom" | "Left" | "Right";
type SliderHandleGlyphOrientation = "Horizontal" | "Vertical";

type SliderHandleKey = "single" | "leading" | "trailing";

type SliderBarMetrics = {
  focusColor: string;
  focusOffset: string;
  focusWidth: string;
  fontFamily: string;
  fontWeightRegular: string;
  handleBackground: string;
  handleBorderActive: string;
  handleBorderDefault: string;
  handleIconColor: string;
  handleInset: number;
  handleShadow: string;
  handleSize: number;
  labelColor: string;
  labelFontSize: number;
  labelLetterSpacing: number;
  labelLineHeight: number;
  markerColor: string;
  markerHeight: number;
  markerWidth: number;
  rootWidth: number | string;
  tooltipBackground: string;
  tooltipBodyPaddingBlock: number;
  tooltipBodyPaddingInline: number;
  tooltipColor: string;
  tooltipFontSize: number;
  tooltipLetterSpacing: number;
  tooltipLineHeight: number;
  tooltipRadius: string;
  tooltipStemDepth: number;
  tooltipStemWidth: number;
  trackBackground: string;
  trackFill: string;
  trackFillDisabled: string;
  trackHeight: number;
};

type RangeSnapshot = {
  leading: number;
  trailing: number;
};

export interface SliderBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  brand?: DisplayBrandId;
  defaultLeadingValue?: number;
  defaultTrailingValue?: number;
  defaultValue?: number;
  disabled?: boolean;
  height?: number | string;
  leadingAriaLabel?: string;
  leadingValue?: number;
  max?: number;
  maxLabel?: ReactNode;
  min?: number;
  minLabel?: ReactNode;
  mode?: SliderBarMode;
  onRangeChange?: (values: RangeSnapshot) => void;
  onValueChange?: (value: number) => void;
  orientation?: SliderBarOrientation;
  pointerCount?: number;
  showLabels?: boolean;
  showPointers?: boolean;
  state?: SliderBarState;
  step?: number;
  tooltipDirection?: SliderBarTooltipDirection;
  tooltipFormatter?: (value: number) => ReactNode;
  trailingAriaLabel?: string;
  trailingValue?: number;
  value?: number;
  valueAriaLabel?: string;
  width?: number | string;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const MARKER_COUNT_MIN = 2;
const MARKER_COUNT_MAX = 9;
const HANDLE_ICON_LINE_HEIGHT = 8;
const HANDLE_ICON_LINE_WIDTH = 1;
const HANDLE_ICON_LINE_GAP = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, min: number, step: number) {
  if (step <= 0) {
    return value;
  }

  const rounded = Math.round((value - min) / step) * step + min;
  const precision = Number(step.toString().split(".")[1]?.length ?? 0);

  return Number(rounded.toFixed(precision));
}

function clampAndSnap(value: number, min: number, max: number, step: number) {
  return clamp(roundToStep(value, min, step), min, max);
}

function getSliderBarMetrics(brand: DisplayBrandId, width: number | string | undefined): SliderBarMetrics {
  const themeFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const themeFontWeightRegular = String(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const themeFocusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const themeRadiusAltXs = Number(getRequiredThemeTokenValue(brand, "radius.alt.xs"));

  return {
    focusColor: themeFocusColor,
    focusOffset: "2px",
    focusWidth: "2px",
    fontFamily: themeFontFamily,
    fontWeightRegular: themeFontWeightRegular,
    handleBackground: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    handleBorderActive: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.active.border")),
    handleBorderDefault: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.border")),
    handleIconColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder")),
    handleInset: 6,
    handleShadow: "0px 1px 3px 0px rgba(18,18,23,0.1), 0px 1px 2px 0px rgba(18,18,23,0.06)",
    handleSize: 20,
    labelColor: String(getRequiredThemeTokenValue(brand, "color.text.disabled")),
    labelFontSize: 9,
    labelLetterSpacing: 0,
    labelLineHeight: 13,
    markerColor: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.border")),
    markerHeight: 8,
    markerWidth: 1,
    rootWidth: width ?? 218,
    tooltipBackground: String(getRequiredThemeTokenValue(brand, "color.brand.primary.600")),
    tooltipBodyPaddingBlock: 4,
    tooltipBodyPaddingInline: 8,
    tooltipColor: String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
    tooltipFontSize: 12,
    tooltipLetterSpacing: 0,
    tooltipLineHeight: 16,
    tooltipRadius: `${themeRadiusAltXs}px`,
    tooltipStemDepth: 8,
    tooltipStemWidth: 16,
    trackBackground: String(getRequiredThemeTokenValue(brand, "component.checkbox.color.disabled.rest.background")),
    trackFill: String(getRequiredThemeTokenValue(brand, "component.switch.color.selected.track")),
    trackFillDisabled: String(getRequiredThemeTokenValue(brand, "component.switch.color.disabled.selected.track")),
    trackHeight: 8
  };
}

function getPercent(value: number, min: number, max: number) {
  if (max <= min) {
    return 0;
  }

  return (value - min) / (max - min);
}

function getHandleCenter(percent: number, trackWidth: number, handleInset: number) {
  if (trackWidth <= handleInset * 2) {
    return trackWidth / 2;
  }

  return handleInset + percent * (trackWidth - handleInset * 2);
}

function getTrackWidth(trackWidth: number, fillEnd: number, minimumFillWidth: number) {
  return clamp(Math.max(minimumFillWidth, fillEnd), minimumFillWidth, trackWidth);
}

function normalizePointerCount(pointerCount: number | undefined) {
  return clamp(Math.round(pointerCount ?? 6), MARKER_COUNT_MIN, MARKER_COUNT_MAX);
}

function toPixelDimension(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function getValueText(value: number, tooltipFormatter: SliderBarProps["tooltipFormatter"]) {
  return tooltipFormatter ? tooltipFormatter(value) : String(value);
}

function getValueFromClientX(
  clientX: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number
) {
  const percent = rect.width <= 0 ? 0 : clamp((clientX - rect.left) / rect.width, 0, 1);
  return clampAndSnap(min + percent * (max - min), min, max, step);
}

function getValueFromClientY(
  clientY: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number
) {
  const percent = rect.height <= 0 ? 0 : 1 - clamp((clientY - rect.top) / rect.height, 0, 1);
  return clampAndSnap(min + percent * (max - min), min, max, step);
}

function SliderStem({
  background,
  depth,
  direction,
  width
}: {
  background: string;
  depth: number;
  direction: SliderBarTooltipDirection;
  width: number;
}) {
  return (
    <TooltipStem
      background={background}
      depth={depth}
      side={
        direction === "Top"
          ? "bottom"
          : direction === "Bottom"
            ? "top"
            : direction === "Left"
              ? "right"
              : "left"
      }
      width={width}
    />
  );
}

function SliderTooltip({
  background,
  children,
  color,
  direction,
  metrics
}: {
  background: string;
  children: ReactNode;
  color: string;
  direction: SliderBarTooltipDirection;
  metrics: SliderBarMetrics;
}) {
  const body = (
    <div
      style={{
        alignItems: "center",
        background,
        boxSizing: "border-box",
        borderRadius: metrics.tooltipRadius,
        color,
        display: "inline-flex",
        flex: "0 0 auto",
        fontFamily: `${metrics.fontFamily}, sans-serif`,
        fontSize: metrics.tooltipFontSize,
        fontWeight: metrics.fontWeightRegular,
        justifyContent: "center",
        letterSpacing: metrics.tooltipLetterSpacing,
        lineHeight: `${metrics.tooltipLineHeight}px`,
        minHeight: `${metrics.tooltipLineHeight + metrics.tooltipBodyPaddingBlock * 2}px`,
        paddingBlock: metrics.tooltipBodyPaddingBlock,
        paddingInline: metrics.tooltipBodyPaddingInline,
        textAlign: "center",
        whiteSpace: "nowrap",
        width: "max-content"
      }}
    >
      {children}
    </div>
  );

  const stem = (
    <SliderStem
      background={background}
      depth={metrics.tooltipStemDepth}
      direction={direction}
      width={metrics.tooltipStemWidth}
    />
  );

  if (direction === "Bottom") {
    return (
      <div style={{ alignItems: "center", display: "inline-flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "-1px" }}>{stem}</div>
        {body}
      </div>
    );
  }

  if (direction === "Left") {
    return (
      <div style={{ alignItems: "center", display: "inline-flex", flexDirection: "row" }}>
        {body}
        <div style={{ marginLeft: "-1px" }}>{stem}</div>
      </div>
    );
  }

  if (direction === "Right") {
    return (
      <div style={{ alignItems: "center", display: "inline-flex", flexDirection: "row" }}>
        <div style={{ marginRight: "-1px" }}>{stem}</div>
        {body}
      </div>
    );
  }

  return (
    <div style={{ alignItems: "center", display: "inline-flex", flexDirection: "column" }}>
      {body}
      <div style={{ marginTop: "-1px" }}>{stem}</div>
    </div>
  );
}

function SliderHandleGlyph({
  color,
  orientation
}: {
  color: string;
  orientation: SliderHandleGlyphOrientation;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "center",
        display: "inline-flex",
        flexDirection: orientation === "Horizontal" ? "column" : "row",
        gap: `${HANDLE_ICON_LINE_GAP}px`,
        height: orientation === "Horizontal" ? "6px" : `${HANDLE_ICON_LINE_HEIGHT}px`,
        justifyContent: "center",
        width: orientation === "Horizontal" ? `${HANDLE_ICON_LINE_HEIGHT}px` : "6px"
      }}
    >
      <span
        style={{
          background: color,
          borderRadius: "999px",
          display: "block",
          height: orientation === "Horizontal" ? `${HANDLE_ICON_LINE_WIDTH}px` : `${HANDLE_ICON_LINE_HEIGHT}px`,
          width: orientation === "Horizontal" ? `${HANDLE_ICON_LINE_HEIGHT}px` : `${HANDLE_ICON_LINE_WIDTH}px`
        }}
      />
      <span
        style={{
          background: color,
          borderRadius: "999px",
          display: "block",
          height: orientation === "Horizontal" ? `${HANDLE_ICON_LINE_WIDTH}px` : `${HANDLE_ICON_LINE_HEIGHT}px`,
          width: orientation === "Horizontal" ? `${HANDLE_ICON_LINE_HEIGHT}px` : `${HANDLE_ICON_LINE_WIDTH}px`
        }}
      />
    </span>
  );
}

function getTooltipPlacementStyles(
  direction: SliderBarTooltipDirection,
  metrics: SliderBarMetrics
): CSSProperties {
  if (direction === "Bottom") {
    return {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      left: "50%",
      position: "absolute",
      top: `${metrics.handleSize + 4}px`,
      transform: "translateX(-50%)"
    };
  }

  if (direction === "Left") {
    return {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      right: `${metrics.handleSize + 4}px`,
      top: "50%",
      transform: "translateY(-50%)"
    };
  }

  if (direction === "Right") {
    return {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      left: `${metrics.handleSize + 4}px`,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)"
    };
  }

  return {
    alignItems: "center",
    bottom: `${metrics.handleSize + 4}px`,
    display: "flex",
    justifyContent: "center",
    left: "50%",
    position: "absolute",
    transform: "translateX(-50%)"
  };
}

function SliderHandle({
  ariaLabel,
  direction,
  focusVisible,
  isActive,
  isDisabled,
  label,
  metrics,
  onBlur,
  onFocus,
  onKeyDown,
  onPointerDown,
  orientation,
  position,
  value,
  valueMax,
  valueMin
}: {
  ariaLabel: string;
  direction: SliderBarTooltipDirection;
  focusVisible: boolean;
  isActive: boolean;
  isDisabled: boolean;
  label: ReactNode;
  metrics: SliderBarMetrics;
  onBlur: () => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  orientation: SliderBarOrientation;
  position: number;
  value: number;
  valueMax: number;
  valueMin: number;
}) {
  return (
    <button
      aria-label={ariaLabel}
      aria-valuemax={valueMax}
      aria-valuemin={valueMin}
      aria-valuenow={value}
      aria-valuetext={typeof label === "string" ? label : String(value)}
      disabled={isDisabled}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      role="slider"
      tabIndex={isDisabled ? -1 : 0}
      type="button"
      style={{
        alignItems: "center",
        appearance: "none",
        background: metrics.handleBackground,
        border: `1px solid ${isActive ? metrics.handleBorderActive : metrics.handleBorderDefault}`,
        borderRadius: "999px",
        boxShadow: metrics.handleShadow,
        cursor: isDisabled ? "default" : "grab",
        display: "inline-flex",
        height: `${metrics.handleSize}px`,
        justifyContent: "center",
        left: orientation === "Horizontal" ? `${position}px` : "50%",
        outline: focusVisible ? `${metrics.focusWidth} solid ${metrics.focusColor}` : "none",
        outlineOffset: focusVisible ? metrics.focusOffset : "0px",
        padding: 0,
        position: "absolute",
        top: orientation === "Horizontal" ? "50%" : `${position}px`,
        transform: "translate(-50%, -50%)",
        width: `${metrics.handleSize}px`,
        zIndex: isActive ? 3 : 2
      }}
    >
      <SliderHandleGlyph
        color={metrics.handleIconColor}
        orientation={orientation === "Vertical" ? "Horizontal" : "Vertical"}
      />
      {isActive ? (
        <div style={getTooltipPlacementStyles(direction, metrics)}>
          <SliderTooltip
            background={metrics.tooltipBackground}
            color={metrics.tooltipColor}
            direction={direction}
            metrics={metrics}
          >
            {label}
          </SliderTooltip>
        </div>
      ) : null}
    </button>
  );
}

export function SliderBar({
  brand = "Cars24",
  defaultLeadingValue = 0,
  defaultTrailingValue = 25,
  defaultValue = 0,
  disabled = false,
  height,
  leadingAriaLabel = "Minimum value",
  leadingValue,
  max = DEFAULT_MAX,
  maxLabel = "Max value",
  min = DEFAULT_MIN,
  minLabel = "Min value",
  mode = "Single",
  onRangeChange,
  onValueChange,
  orientation = "Horizontal",
  pointerCount = 6,
  showLabels = true,
  showPointers = true,
  state,
  step = DEFAULT_STEP,
  style,
  tooltipDirection = "Top",
  tooltipFormatter,
  trailingAriaLabel = "Maximum value",
  trailingValue,
  value,
  valueAriaLabel = "Slider value",
  width,
  ...rest
}: SliderBarProps) {
  const safeMin = Math.min(min, max);
  const safeMax = Math.max(min, max);
  const safeStep = step > 0 ? step : DEFAULT_STEP;
  const metrics = getSliderBarMetrics(brand, width);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [internalValue, setInternalValue] = useState(() =>
    clampAndSnap(defaultValue, safeMin, safeMax, safeStep)
  );
  const [internalRange, setInternalRange] = useState<RangeSnapshot>(() => {
    const normalizedLeading = clampAndSnap(defaultLeadingValue, safeMin, safeMax, safeStep);
    const normalizedTrailing = clampAndSnap(defaultTrailingValue, safeMin, safeMax, safeStep);

    return {
      leading: Math.min(normalizedLeading, normalizedTrailing),
      trailing: Math.max(normalizedLeading, normalizedTrailing)
    };
  });
  const [draggingHandle, setDraggingHandle] = useState<SliderHandleKey | null>(null);
  const [focusedHandle, setFocusedHandle] = useState<SliderHandleKey | null>(null);

  const isSingleControlled = value !== undefined;
  const isLeadingControlled = leadingValue !== undefined;
  const isTrailingControlled = trailingValue !== undefined;

  const resolvedValue = clampAndSnap(
    isSingleControlled ? value : internalValue,
    safeMin,
    safeMax,
    safeStep
  );
  const resolvedRange = {
    leading: clampAndSnap(
      isLeadingControlled ? leadingValue : internalRange.leading,
      safeMin,
      safeMax,
      safeStep
    ),
    trailing: clampAndSnap(
      isTrailingControlled ? trailingValue : internalRange.trailing,
      safeMin,
      safeMax,
      safeStep
    )
  };

  const orderedRange = {
    leading: Math.min(resolvedRange.leading, resolvedRange.trailing),
    trailing: Math.max(resolvedRange.leading, resolvedRange.trailing)
  };

  const resolvedState =
    state ?? (disabled ? "Disabled" : draggingHandle !== null ? "Active" : "Normal");
  const isDisabled = resolvedState === "Disabled";
  const isSingleMode = mode === "Single";

  function commitSingleValue(nextValue: number) {
    const normalizedValue = clampAndSnap(nextValue, safeMin, safeMax, safeStep);

    if (!isSingleControlled) {
      setInternalValue(normalizedValue);
    }

    onValueChange?.(normalizedValue);
  }

  function commitRangeValues(nextLeading: number, nextTrailing: number) {
    const normalizedLeading = clampAndSnap(nextLeading, safeMin, safeMax, safeStep);
    const normalizedTrailing = clampAndSnap(nextTrailing, safeMin, safeMax, safeStep);
    const nextRange = {
      leading: Math.min(normalizedLeading, normalizedTrailing),
      trailing: Math.max(normalizedLeading, normalizedTrailing)
    };

    if (!isLeadingControlled || !isTrailingControlled) {
      setInternalRange((previous) => ({
        leading: isLeadingControlled ? previous.leading : nextRange.leading,
        trailing: isTrailingControlled ? previous.trailing : nextRange.trailing
      }));
    }

    onRangeChange?.(nextRange);
  }

  function updateFromClientX(clientX: number, handle: SliderHandleKey) {
    const trackNode = rootRef.current;

    if (!trackNode) {
      return;
    }

    const rect = trackNode.getBoundingClientRect();
    const nextValue = getValueFromClientX(clientX, rect, safeMin, safeMax, safeStep);

    if (isSingleMode || handle === "single") {
      commitSingleValue(nextValue);
      return;
    }

    if (handle === "leading") {
      commitRangeValues(Math.min(nextValue, orderedRange.trailing), orderedRange.trailing);
      return;
    }

    commitRangeValues(orderedRange.leading, Math.max(nextValue, orderedRange.leading));
  }

  function updateFromClientY(clientY: number, handle: SliderHandleKey) {
    const trackNode = rootRef.current;

    if (!trackNode) {
      return;
    }

    const rect = trackNode.getBoundingClientRect();
    const nextValue = getValueFromClientY(clientY, rect, safeMin, safeMax, safeStep);

    if (isSingleMode || handle === "single") {
      commitSingleValue(nextValue);
      return;
    }

    if (handle === "leading") {
      commitRangeValues(Math.min(nextValue, orderedRange.trailing), orderedRange.trailing);
      return;
    }

    commitRangeValues(orderedRange.leading, Math.max(nextValue, orderedRange.leading));
  }

  function updateFromPointer(handle: SliderHandleKey, clientX: number, clientY: number) {
    if (orientation === "Vertical") {
      updateFromClientY(clientY, handle);
      return;
    }

    updateFromClientX(clientX, handle);
  }

  useEffect(() => {
    if (!draggingHandle || isDisabled) {
      return;
    }

    const activeHandle = draggingHandle;

    function handlePointerMove(event: PointerEvent) {
      event.preventDefault();
      updateFromPointer(activeHandle, event.clientX, event.clientY);
    }

    function handlePointerUp() {
      setDraggingHandle(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [draggingHandle, isDisabled, orientation, orderedRange.leading, orderedRange.trailing, safeMax, safeMin, safeStep]);

  function beginDrag(handle: SliderHandleKey, event: ReactPointerEvent<HTMLButtonElement>) {
    if (isDisabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setDraggingHandle(handle);
    updateFromPointer(handle, event.clientX, event.clientY);
  }

  function handleTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (isDisabled) {
      return;
    }

    event.preventDefault();

    if (isSingleMode) {
      setDraggingHandle("single");
      updateFromPointer("single", event.clientX, event.clientY);
      return;
    }

    const trackNode = rootRef.current;

    if (!trackNode) {
      return;
    }

    const rect = trackNode.getBoundingClientRect();
    const nextValue =
      orientation === "Vertical"
        ? getValueFromClientY(event.clientY, rect, safeMin, safeMax, safeStep)
        : getValueFromClientX(event.clientX, rect, safeMin, safeMax, safeStep);
    const nextHandle =
      Math.abs(nextValue - orderedRange.leading) <= Math.abs(nextValue - orderedRange.trailing)
        ? "leading"
        : "trailing";

    setDraggingHandle(nextHandle);
    updateFromPointer(nextHandle, event.clientX, event.clientY);
  }

  function nudgeSingleValue(offset: number) {
    commitSingleValue(resolvedValue + offset);
  }

  function nudgeRangeValue(handle: "leading" | "trailing", offset: number) {
    if (handle === "leading") {
      commitRangeValues(orderedRange.leading + offset, orderedRange.trailing);
      return;
    }

    commitRangeValues(orderedRange.leading, orderedRange.trailing + offset);
  }

  function handleSingleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (isDisabled) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      nudgeSingleValue(-safeStep);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      nudgeSingleValue(safeStep);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      commitSingleValue(safeMin);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      commitSingleValue(safeMax);
    }
  }

  function handleRangeKeyDown(handle: "leading" | "trailing", event: KeyboardEvent<HTMLButtonElement>) {
    if (isDisabled) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      nudgeRangeValue(handle, -safeStep);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      nudgeRangeValue(handle, safeStep);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      if (handle === "leading") {
        commitRangeValues(safeMin, orderedRange.trailing);
      } else {
        commitRangeValues(orderedRange.leading, orderedRange.leading);
      }
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      if (handle === "leading") {
        commitRangeValues(orderedRange.trailing, orderedRange.trailing);
      } else {
        commitRangeValues(orderedRange.leading, safeMax);
      }
    }
  }

  const horizontalTrackLengthValue =
    typeof metrics.rootWidth === "number" ? metrics.rootWidth : Number.parseFloat(metrics.rootWidth);
  const verticalTrackLengthValue =
    typeof height === "number" ? height : Number.parseFloat(typeof height === "string" ? height : "218");
  const trackLength =
    orientation === "Vertical"
      ? Number.isFinite(verticalTrackLengthValue)
        ? verticalTrackLengthValue
        : 218
      : Number.isFinite(horizontalTrackLengthValue)
        ? horizontalTrackLengthValue
        : 218;

  const singlePercent = getPercent(resolvedValue, safeMin, safeMax);
  const leadingPercent = getPercent(orderedRange.leading, safeMin, safeMax);
  const trailingPercent = getPercent(orderedRange.trailing, safeMin, safeMax);

  const singleHandleCenterFromMin = getHandleCenter(singlePercent, trackLength, metrics.handleInset);
  const leadingHandleCenterFromMin = getHandleCenter(leadingPercent, trackLength, metrics.handleInset);
  const trailingHandleCenterFromMin = getHandleCenter(trailingPercent, trackLength, metrics.handleInset);

  const singleHandleCenter =
    orientation === "Vertical" ? trackLength - singleHandleCenterFromMin : singleHandleCenterFromMin;
  const leadingHandleCenter =
    orientation === "Vertical" ? trackLength - leadingHandleCenterFromMin : leadingHandleCenterFromMin;
  const trailingHandleCenter =
    orientation === "Vertical" ? trackLength - trailingHandleCenterFromMin : trailingHandleCenterFromMin;

  const singleFillWidth = getTrackWidth(trackLength, singleHandleCenterFromMin, metrics.trackHeight);
  const rangeFillMin = Math.min(leadingHandleCenterFromMin, trailingHandleCenterFromMin);
  const rangeFillMax = Math.max(leadingHandleCenterFromMin, trailingHandleCenterFromMin);
  const showGlobalActiveState = resolvedState === "Active" || draggingHandle !== null;
  const normalizedPointerCount = normalizePointerCount(pointerCount);
  const resolvedTooltipDirection =
    orientation === "Vertical" ? "Left" : tooltipDirection;

  function shouldShowTooltip(handle: SliderHandleKey) {
    if (isDisabled) {
      return false;
    }

    if (showGlobalActiveState) {
      return true;
    }

    return focusedHandle === handle;
  }

  const rootStyles = {
    alignItems: orientation === "Vertical" ? "flex-start" : undefined,
    display: "inline-flex",
    flexDirection: orientation === "Vertical" ? "row" : "column",
    gap: orientation === "Vertical" ? 12 : showLabels ? 6 : showPointers ? 6 : 0,
    justifyItems: "stretch",
    overflow: "visible",
    ...style
  } satisfies CSSProperties;

  const trackStyles = {
    background: metrics.trackBackground,
    borderRadius: "999px",
    cursor: isDisabled ? "default" : "pointer",
    height: orientation === "Vertical" ? `${trackLength}px` : `${metrics.trackHeight}px`,
    position: "relative",
    width: orientation === "Vertical" ? `${metrics.trackHeight}px` : toPixelDimension(metrics.rootWidth)
  } satisfies CSSProperties;

  const labelsStyles = {
    color: metrics.labelColor,
    display: "flex",
    flexDirection: orientation === "Vertical" ? "column-reverse" : "row",
    fontFamily: `${metrics.fontFamily}, sans-serif`,
    fontSize: `${metrics.labelFontSize}px`,
    fontWeight: metrics.fontWeightRegular,
    height: orientation === "Vertical" ? `${trackLength}px` : undefined,
    justifyContent: "space-between",
    letterSpacing: `${metrics.labelLetterSpacing}px`,
    lineHeight: `${metrics.labelLineHeight}px`,
    textAlign: orientation === "Vertical" ? "left" : "center",
    whiteSpace: "nowrap",
    width: orientation === "Vertical" ? "fit-content" : "100%"
  } satisfies CSSProperties;

  const markersStyles = {
    alignItems: "center",
    display: orientation === "Vertical" ? "block" : "flex",
    height: orientation === "Vertical" ? `${trackLength}px` : undefined,
    justifyContent: "space-between",
    marginInline: orientation === "Vertical" ? undefined : `${metrics.handleInset}px`,
    position: orientation === "Vertical" ? "relative" : undefined,
    width: orientation === "Vertical" ? "12px" : `calc(100% - ${metrics.handleInset * 2}px)`
  } satisfies CSSProperties;

  const railStyles = {
    display: "grid",
    gap: orientation === "Vertical" ? 0 : showPointers ? 6 : 0,
    justifyItems: orientation === "Vertical" ? "center" : "stretch",
    minHeight: orientation === "Vertical" ? `${trackLength}px` : undefined,
    position: "relative"
  } satisfies CSSProperties;

  const singleTooltipLabel = getValueText(resolvedValue, tooltipFormatter);
  const leadingTooltipLabel = getValueText(orderedRange.leading, tooltipFormatter);
  const trailingTooltipLabel = getValueText(orderedRange.trailing, tooltipFormatter);

  return (
    <div {...rest} style={rootStyles}>
      <div style={railStyles}>
        <div
          onPointerDown={handleTrackPointerDown}
          ref={rootRef}
          style={trackStyles}
        >
          {isSingleMode ? (
            <div
              aria-hidden="true"
              style={{
                background: isDisabled ? metrics.trackFillDisabled : metrics.trackFill,
                borderRadius: "999px",
                bottom: orientation === "Vertical" ? 0 : undefined,
                height: orientation === "Vertical" ? `${singleFillWidth}px` : "100%",
                left: 0,
                position: "absolute",
                top: orientation === "Vertical" ? undefined : 0,
                width: orientation === "Vertical" ? "100%" : `${singleFillWidth}px`
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                background: isDisabled ? metrics.trackFillDisabled : metrics.trackFill,
                borderRadius: "999px",
                bottom: orientation === "Vertical" ? `${rangeFillMin}px` : undefined,
                height:
                  orientation === "Vertical"
                    ? `${Math.max(metrics.trackHeight, rangeFillMax - rangeFillMin)}px`
                    : "100%",
                left: orientation === "Vertical" ? 0 : `${Math.min(leadingHandleCenter, trailingHandleCenter)}px`,
                position: "absolute",
                top: orientation === "Vertical" ? undefined : 0,
                width:
                  orientation === "Vertical"
                    ? "100%"
                    : `${Math.max(metrics.trackHeight, Math.abs(trailingHandleCenter - leadingHandleCenter))}px`
              }}
            />
          )}

          {!isDisabled && isSingleMode ? (
            <SliderHandle
              ariaLabel={valueAriaLabel}
              direction={resolvedTooltipDirection}
              focusVisible={focusedHandle === "single"}
              isActive={shouldShowTooltip("single")}
              isDisabled={isDisabled}
              label={singleTooltipLabel}
              metrics={metrics}
              onBlur={() => setFocusedHandle((current) => (current === "single" ? null : current))}
              onFocus={() => setFocusedHandle("single")}
              onKeyDown={handleSingleKeyDown}
              onPointerDown={(event) => beginDrag("single", event)}
              orientation={orientation}
              position={singleHandleCenter}
              value={resolvedValue}
              valueMax={safeMax}
              valueMin={safeMin}
            />
          ) : null}

          {!isDisabled && !isSingleMode ? (
            <>
            <SliderHandle
              ariaLabel={leadingAriaLabel}
              direction={resolvedTooltipDirection}
              focusVisible={focusedHandle === "leading"}
              isActive={shouldShowTooltip("leading")}
                isDisabled={isDisabled}
                label={leadingTooltipLabel}
                metrics={metrics}
                onBlur={() => setFocusedHandle((current) => (current === "leading" ? null : current))}
                onFocus={() => setFocusedHandle("leading")}
                onKeyDown={(event) => handleRangeKeyDown("leading", event)}
                onPointerDown={(event) => beginDrag("leading", event)}
                orientation={orientation}
                position={leadingHandleCenter}
                value={orderedRange.leading}
                valueMax={orderedRange.trailing}
                valueMin={safeMin}
              />
            <SliderHandle
              ariaLabel={trailingAriaLabel}
              direction={resolvedTooltipDirection}
              focusVisible={focusedHandle === "trailing"}
              isActive={shouldShowTooltip("trailing")}
                isDisabled={isDisabled}
                label={trailingTooltipLabel}
                metrics={metrics}
                onBlur={() => setFocusedHandle((current) => (current === "trailing" ? null : current))}
                onFocus={() => setFocusedHandle("trailing")}
                onKeyDown={(event) => handleRangeKeyDown("trailing", event)}
                onPointerDown={(event) => beginDrag("trailing", event)}
                orientation={orientation}
                position={trailingHandleCenter}
                value={orderedRange.trailing}
                valueMax={safeMax}
                valueMin={orderedRange.leading}
              />
            </>
          ) : null}
        </div>

        {showPointers && orientation === "Horizontal" ? (
          <div aria-hidden="true" style={markersStyles}>
            {Array.from({ length: normalizedPointerCount }, (_, index) => (
              <span
                key={`slider-bar-pointer-${index + 1}`}
                style={{
                  background: metrics.markerColor,
                  borderRadius: "999px",
                  display: "block",
                  height: `${metrics.markerHeight}px`,
                  width: `${metrics.markerWidth}px`
                }}
              />
            ))}
          </div>
        ) : null}
      </div>

      {orientation === "Vertical" && showPointers ? (
        <div aria-hidden="true" style={markersStyles}>
          {Array.from({ length: normalizedPointerCount }, (_, index) => {
            const markerPercent =
              normalizedPointerCount <= 1 ? 0 : index / (normalizedPointerCount - 1);
            const markerPosition =
              metrics.handleInset + markerPercent * (trackLength - metrics.handleInset * 2);

            return (
              <span
                key={`slider-bar-pointer-${index + 1}`}
                style={{
                  background: metrics.markerColor,
                  borderRadius: "999px",
                  bottom: `${markerPosition - metrics.markerWidth / 2}px`,
                  display: "block",
                  height: `${metrics.markerWidth}px`,
                  left: 0,
                  position: "absolute",
                  width: `${metrics.markerHeight}px`
                }}
              />
            );
          })}
        </div>
      ) : null}

      {orientation === "Vertical" && showLabels ? (
        <div style={labelsStyles}>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : orientation === "Horizontal" && showLabels ? (
        <div style={labelsStyles}>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
