import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  useState
} from "react";
import type { IconName } from "@turbo/icons";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue } from "../theme";
import { Icon } from "./icon";
import { getTapFeedbackStyles } from "./press-feedback";

export type ChoiceChipSize = "Default" | "Small";
export type ChoiceChipState = "Rest" | "Hover" | "Active" | "Disabled";
export type ChoiceChipType = "Regular" | "Black" | "Inverse";
export type ChoiceChipVariant = "Horizontal" | "Vertical";

type ChoiceChipMetrics = {
  gap: string;
  minWidth?: string;
  minHeight?: string;
  paddingBlock: string;
  paddingInline: string;
  radius: string;
  labelFontSize: string;
  labelLineHeight: string;
  labelLetterSpacing: string;
  descriptionFontSize?: string;
  descriptionLineHeight?: string;
  descriptionLetterSpacing?: string;
};

type ChoiceChipSurface = {
  background: string;
  border: string;
  foreground: string;
  supporting: string;
};

const LABEL_2_FONT_SIZE = "var(--cars24-typography-size-utility-label-2, 14px)";
const LABEL_2_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-2, 18px)";
const LABEL_2_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-2, 0px)";
const LABEL_3_FONT_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";
const LABEL_4_FONT_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const LABEL_4_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-4, 14px)";
const LABEL_4_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-4, 0px)";

const HORIZONTAL_DEFAULT_METRICS: ChoiceChipMetrics = {
  gap: "var(--cars24-misc-gap-6, 6px)",
  minHeight: "var(--cars24-misc-size-36, 36px)",
  paddingBlock: "var(--cars24-misc-gap-8, 8px)",
  paddingInline: "var(--cars24-misc-gap-10, 10px)",
  radius: "var(--cars24-theme-radius-alt-sm, 8px)",
  labelFontSize: LABEL_2_FONT_SIZE,
  labelLineHeight: LABEL_2_LINE_HEIGHT,
  labelLetterSpacing: LABEL_2_LETTER_SPACING
};

const HORIZONTAL_SMALL_METRICS: ChoiceChipMetrics = {
  gap: "var(--cars24-misc-gap-6, 6px)",
  minHeight: "var(--cars24-misc-size-28, 28px)",
  paddingBlock: "var(--cars24-misc-gap-8, 8px)",
  paddingInline: "var(--cars24-misc-gap-8, 8px)",
  radius: "var(--cars24-theme-radius-alt-sm, 8px)",
  labelFontSize: LABEL_3_FONT_SIZE,
  labelLineHeight: LABEL_3_LINE_HEIGHT,
  labelLetterSpacing: LABEL_3_LETTER_SPACING
};

const VERTICAL_SMALL_METRICS: ChoiceChipMetrics = {
  gap: "var(--cars24-misc-gap-4, 4px)",
  minWidth: "100px",
  paddingBlock: "var(--cars24-misc-gap-8, 8px)",
  paddingInline: "var(--cars24-misc-gap-4, 4px)",
  radius: "var(--cars24-theme-radius-alt-lg, 14px)",
  labelFontSize: LABEL_2_FONT_SIZE,
  labelLineHeight: LABEL_2_LINE_HEIGHT,
  labelLetterSpacing: LABEL_2_LETTER_SPACING,
  descriptionFontSize: LABEL_4_FONT_SIZE,
  descriptionLineHeight: LABEL_4_LINE_HEIGHT,
  descriptionLetterSpacing: LABEL_4_LETTER_SPACING
};

function getMetrics(variant: ChoiceChipVariant, size: ChoiceChipSize) {
  if (variant === "Vertical") {
    return VERTICAL_SMALL_METRICS;
  }

  return size === "Small" ? HORIZONTAL_SMALL_METRICS : HORIZONTAL_DEFAULT_METRICS;
}

function toAlpha(color: string, alpha: number) {
  const normalized = color.trim();
  const hex = normalized.startsWith("#") ? normalized.slice(1) : normalized;
  const safeAlpha = Math.max(0, Math.min(1, alpha));

  if (!/^[\da-fA-F]{3}$|^[\da-fA-F]{6}$/.test(hex)) {
    return color;
  }

  const expanded = hex.length === 3 ? hex.split("").map((part) => `${part}${part}`).join("") : hex;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
}

function getSurface({
  brand,
  size,
  state,
  type,
  variant
}: {
  brand: DisplayBrandId;
  size: ChoiceChipSize;
  state: ChoiceChipState;
  type: ChoiceChipType;
  variant: ChoiceChipVariant;
}): ChoiceChipSurface {
  const isVertical = variant === "Vertical";
  const canvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const subtleSurface = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const inverseSurface = String(getRequiredThemeTokenValue(brand, "color.surface.inverse"));
  const defaultBorder = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const strongBorder = String(getRequiredThemeTokenValue(brand, "color.border.strong"));
  const primaryText = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const secondaryText = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const inverseText = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const disabledText = String(getRequiredThemeTokenValue(brand, "color.text.disabled"));
  const disabledInverseText = String(getRequiredThemeTokenValue(brand, "color.text.disabledInverse"));
  const brandSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const brandSurfaceHover = String(getRequiredThemeTokenValue(brand, "color.brand.primary.100"));
  const brandBorder = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const inverseBorder = toAlpha(inverseText, 0.25);
  const inverseBorderAlt = toAlpha(inverseText, 0.3);
  const inverseHoverSurface = toAlpha(inverseText, 0.15);
  const inverseDisabledSurface = toAlpha(inverseText, 0.1);

  if (state === "Disabled") {
    if (type === "Inverse") {
      return {
        background: inverseDisabledSurface,
        border: "transparent",
        foreground: disabledInverseText,
        supporting: disabledInverseText
      };
    }

    return {
      background: subtleSurface,
      border: "transparent",
      foreground: disabledText,
      supporting: disabledText
    };
  }

  if (state === "Active") {
    if (type === "Black") {
      return {
        background: inverseSurface,
        border: "transparent",
        foreground: inverseText,
        supporting: inverseText
      };
    }

    if (type === "Inverse") {
      return {
        background: canvas,
        border: strongBorder,
        foreground: primaryText,
        supporting: isVertical ? secondaryText : primaryText
      };
    }

    return {
      background: brandSurface,
      border: brandBorder,
      foreground: primaryText,
      supporting: primaryText
    };
  }

  if (state === "Hover") {
    if (type === "Inverse") {
      if (isVertical || size === "Small") {
        return {
          background: inverseHoverSurface,
          border: inverseBorderAlt,
          foreground: inverseText,
          supporting: isVertical ? toAlpha(inverseText, 0.6) : inverseText
        };
      }

      return {
        background: toAlpha(inverseSurface, 0.94),
        border: inverseBorder,
        foreground: inverseText,
        supporting: inverseText
      };
    }

    return {
      background: subtleSurface,
      border: "transparent",
      foreground: primaryText,
      supporting: isVertical ? secondaryText : primaryText
    };
  }

  if (type === "Inverse") {
    if (isVertical) {
      return {
        background: "transparent",
        border: inverseBorderAlt,
        foreground: inverseText,
        supporting: toAlpha(inverseText, 0.6)
      };
    }

    if (size === "Small") {
      return {
        background: inverseHoverSurface,
        border: inverseBorderAlt,
        foreground: inverseText,
        supporting: inverseText
      };
    }

    return {
      background: inverseSurface,
      border: inverseBorder,
      foreground: inverseText,
      supporting: inverseText
    };
  }

  return {
    background: canvas,
    border: defaultBorder,
    foreground: primaryText,
    supporting: isVertical ? secondaryText : primaryText
  };
}

function resolveVerticalTrailingIconName({
  state,
  type
}: {
  state: ChoiceChipState;
  type: ChoiceChipType;
}): IconName {
  if (state === "Disabled") {
    return "cross-large-filled";
  }

  if (type === "Inverse" && state === "Rest") {
    return "cross-large-filled";
  }

  return "checkmark-1-filled";
}

export interface ChoiceChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  brand?: DisplayBrandId;
  description?: ReactNode;
  iconSwap?: boolean;
  label?: ReactNode;
  leadingIcon?: boolean;
  leadingIconName?: IconName;
  size?: ChoiceChipSize;
  state?: ChoiceChipState;
  trailingIcon?: boolean;
  trailingIconName?: IconName;
  type?: ChoiceChipType;
  variant?: ChoiceChipVariant;
}

/**
 * Compact selectable chip for filter and lightweight choice states across horizontal and stacked layouts.
 */
export const ChoiceChip = forwardRef<HTMLButtonElement, ChoiceChipProps>(function ChoiceChip(
  {
    brand = "Cars24",
    description,
    disabled = false,
    iconSwap = true,
    label = "Chip label",
    leadingIcon,
    leadingIconName,
    onBlur,
    onFocus,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    size = "Default",
    state = "Rest",
    style,
    trailingIcon,
    trailingIconName,
    type = "Regular",
    variant = "Horizontal",
    ...rest
  },
  ref
) {
  const [pressed, setPressed] = useState(false);

  const resolvedVariant = variant;
  const resolvedSize = resolvedVariant === "Vertical" ? "Small" : size;
  const resolvedType = resolvedVariant === "Vertical" && type === "Black" ? "Regular" : type;
  const resolvedState = disabled ? "Disabled" : state;
  const metrics = getMetrics(resolvedVariant, resolvedSize);
  const surface = getSurface({
    brand,
    size: resolvedSize,
    state: resolvedState,
    type: resolvedType,
    variant: resolvedVariant
  });
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const mediumWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const regularWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const resolvedDescription = resolvedVariant === "Vertical" ? description ?? "Description" : description;

  const resolvedLeadingIconName =
    leadingIconName ?? (iconSwap ? "checkmark-1-filled" : undefined);
  const resolvedTrailingIconName =
    trailingIconName ??
    (resolvedVariant === "Horizontal"
      ? iconSwap
        ? "cross-large-filled"
        : undefined
      : iconSwap
        ? undefined
        : resolveVerticalTrailingIconName({ state: resolvedState, type: resolvedType }));

  const shouldShowLeadingIcon =
    leadingIcon ?? (Boolean(resolvedLeadingIconName) && iconSwap);
  const shouldShowTrailingIcon =
    trailingIcon ??
    (resolvedVariant === "Horizontal"
      ? Boolean(resolvedTrailingIconName) && iconSwap
      : Boolean(resolvedTrailingIconName) && !iconSwap);

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLButtonElement>) {
    setPressed(false);
    onBlur?.(event);
  }

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    setPressed(true);
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseUp?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseLeave?.(event);
  }

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: surface.background,
    border: `1px solid ${surface.border}`,
    borderRadius:
      resolvedVariant === "Vertical"
        ? `${Number(getRequiredThemeTokenValue(brand, "radius.alt.lg"))}px`
        : `${Number(getRequiredThemeTokenValue(brand, "radius.alt.sm"))}px`,
    boxSizing: "border-box",
    color: surface.foreground,
    cursor: resolvedState === "Disabled" ? "not-allowed" : "pointer",
    display: "inline-flex",
    flexDirection: resolvedVariant === "Vertical" ? "column" : "row",
    gap: metrics.gap,
    justifyContent: "center",
    minHeight: metrics.minHeight,
    minWidth: metrics.minWidth,
    overflow: "clip",
    paddingBlock: metrics.paddingBlock,
    paddingInline: metrics.paddingInline,
    textAlign: resolvedVariant === "Vertical" ? "center" : "left",
    width: "fit-content",
    ...getTapFeedbackStyles({
      disabled: resolvedState === "Disabled",
      pressed,
      transition:
        "background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1)"
    }),
    ...style
  };

  const labelStyles: CSSProperties = {
    color: surface.foreground,
    fontFamily,
    fontSize: metrics.labelFontSize,
    fontWeight: mediumWeight,
    letterSpacing: metrics.labelLetterSpacing,
    lineHeight: metrics.labelLineHeight,
    margin: 0,
    minWidth: 0,
    whiteSpace: resolvedVariant === "Horizontal" ? "nowrap" : undefined,
    width: resolvedVariant === "Vertical" ? "100%" : undefined
  };

  const descriptionStyles: CSSProperties = {
    color: surface.supporting,
    fontFamily,
    fontSize: metrics.descriptionFontSize,
    fontWeight: regularWeight,
    letterSpacing: metrics.descriptionLetterSpacing,
    lineHeight: metrics.descriptionLineHeight,
    margin: 0,
    width: "100%"
  };

  const iconStyles: CSSProperties = {
    color: surface.foreground,
    flex: "0 0 auto",
    fontSize: metrics.labelFontSize
  };

  return (
    <button
      {...rest}
      ref={ref}
      aria-pressed={resolvedState === "Active"}
      disabled={resolvedState === "Disabled"}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      type="button"
      style={rootStyles}
    >
      {shouldShowLeadingIcon && resolvedLeadingIconName ? (
        <Icon brand={brand} decorative name={resolvedLeadingIconName} style={iconStyles} />
      ) : null}

      <span
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: resolvedVariant === "Vertical" ? "column" : "row",
          gap: "var(--cars24-misc-gap-none, 0px)",
          justifyContent: "center",
          minWidth: 0,
          textAlign: resolvedVariant === "Vertical" ? "center" : "left",
          width: resolvedVariant === "Vertical" ? "100%" : undefined
        }}
      >
        <span style={labelStyles}>{label}</span>
        {resolvedVariant === "Vertical" && resolvedDescription !== null && resolvedDescription !== undefined ? (
          <span style={descriptionStyles}>{resolvedDescription}</span>
        ) : null}
      </span>

      {shouldShowTrailingIcon && resolvedTrailingIconName ? (
        <Icon brand={brand} decorative name={resolvedTrailingIconName} style={iconStyles} />
      ) : null}
    </button>
  );
});
