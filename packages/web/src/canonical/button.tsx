import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";
import { getTapFeedbackStyles } from "./press-feedback";

export const canonicalButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.button"
);

export type ButtonShape = "Regular" | "Pill";
export type ButtonStyleVariant = "Solid" | "Outline" | "Ghost" | "Transparent" | "Destructive";
export type ButtonSize = "Extra Small" | "Small" | "Medium" | "Large" | "Extra Large";
export type ButtonPreviewState = "Rest" | "Hover/Pressed";

type ButtonToneAlias = "primary" | "secondary" | "ghost";
type LegacyButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type SizeMetrics = {
  minWidth: string;
  height: string;
  gap: string;
  paddingInline: string;
  paddingBlock: string;
  loaderSize: string;
};

type ButtonSurface = {
  background: string;
  border: string;
  text: string;
  icon: string;
  loaderTrack: string;
  loaderIndicator: string;
};

const BUTTON_SPIN_KEYFRAMES = "@keyframes geist-button-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

const BUTTON_SIZE_METRICS: Record<ButtonSize, SizeMetrics> = {
  "Extra Small": {
    minWidth: "90px",
    height: "28px",
    gap: "4px",
    paddingInline: "12px",
    paddingBlock: "5px",
    loaderSize: "14px"
  },
  Small: {
    minWidth: "95px",
    height: "32px",
    gap: "4px",
    paddingInline: "12px",
    paddingBlock: "7px",
    loaderSize: "16px"
  },
  Medium: {
    minWidth: "112px",
    height: "40px",
    gap: "6px",
    paddingInline: "14px",
    paddingBlock: "10px",
    loaderSize: "18px"
  },
  Large: {
    minWidth: "124px",
    height: "44px",
    gap: "6px",
    paddingInline: "16px",
    paddingBlock: "12px",
    loaderSize: "18px"
  },
  "Extra Large": {
    minWidth: "130px",
    height: "56px",
    gap: "6px",
    paddingInline: "18px",
    paddingBlock: "18px",
    loaderSize: "20px"
  }
};

function makeSurface(
  background: string,
  border: string,
  text: string,
  icon: string,
  loaderTrack: string,
  loaderIndicator: string
): ButtonSurface {
  return { background, border, text, icon, loaderTrack, loaderIndicator };
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

function normalizeSize(size: ButtonProps["size"]): ButtonSize {
  if (size === "xs") {
    return "Extra Small";
  }
  if (size === "sm") {
    return "Small";
  }
  if (size === "lg") {
    return "Large";
  }
  if (size === "xl") {
    return "Extra Large";
  }
  if (size === "md" || !size) {
    return "Medium";
  }

  return size;
}

function normalizeVariant(styleVariant: ButtonProps["styleVariant"], tone: ButtonToneAlias | undefined) {
  if (styleVariant) {
    return styleVariant;
  }

  if (tone === "ghost") {
    return "Ghost";
  }

  if (tone === "secondary") {
    return "Outline";
  }

  return "Solid";
}

function getSurface(
  brand: DisplayBrandId,
  styleVariant: ButtonStyleVariant,
  onDark: boolean,
  hoveredOrPressed: boolean,
  disabled: boolean
) {
  const brandBase = String(getRequiredThemeTokenValue(brand, "color.brand.primary.600"));
  const brandHover = String(getRequiredThemeTokenValue(brand, "color.brand.primary.700"));
  const brandSubtle = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textInverse = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const surfaceSubtle = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const surfaceInverse = String(getRequiredThemeTokenValue(brand, "color.surface.inverse"));
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const statusDanger = String(getRequiredThemeTokenValue(brand, "color.status.danger"));

  if (disabled) {
    return onDark
      ? makeSurface(
          toAlpha(textInverse, 0.12),
          "transparent",
          toAlpha(textInverse, 0.45),
          toAlpha(textInverse, 0.45),
          toAlpha(textInverse, 0.2),
          toAlpha(textInverse, 0.45)
        )
      : makeSurface(
          surfaceSubtle,
          "transparent",
          toAlpha(textPrimary, 0.45),
          toAlpha(textPrimary, 0.45),
          toAlpha(textPrimary, 0.12),
          toAlpha(textPrimary, 0.45)
        );
  }

  if (onDark) {
    switch (styleVariant) {
      case "Solid":
        return hoveredOrPressed
          ? makeSurface(surfaceSubtle, "transparent", textPrimary, textPrimary, toAlpha(textPrimary, 0.14), textPrimary)
          : makeSurface(surfaceCanvas, "transparent", textPrimary, textPrimary, toAlpha(textPrimary, 0.14), textPrimary);
      case "Outline":
        return hoveredOrPressed
          ? makeSurface(toAlpha(textInverse, 0.1), textInverse, textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse)
          : makeSurface("transparent", textInverse, textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse);
      case "Ghost":
        return hoveredOrPressed
          ? makeSurface(toAlpha(textInverse, 0.1), "transparent", textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse)
          : makeSurface("transparent", "transparent", textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse);
      case "Transparent":
        return hoveredOrPressed
          ? makeSurface(toAlpha(textInverse, 0.18), "transparent", textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse)
          : makeSurface(toAlpha(textInverse, 0.12), "transparent", textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse);
      case "Destructive":
        return hoveredOrPressed
          ? makeSurface(toAlpha(statusDanger, 0.8), "transparent", textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse)
          : makeSurface(statusDanger, "transparent", textInverse, textInverse, toAlpha(textInverse, 0.24), textInverse);
    }
  }

  switch (styleVariant) {
    case "Solid":
      return hoveredOrPressed
        ? makeSurface(brandHover, "transparent", textInverse, textInverse, toAlpha(textInverse, 0.3), textInverse)
        : makeSurface(brandBase, "transparent", textInverse, textInverse, toAlpha(textInverse, 0.3), textInverse);
    case "Outline":
      return hoveredOrPressed
        ? makeSurface(brandSubtle, brandHover, brandHover, brandHover, toAlpha(textPrimary, 0.16), brandHover)
        : makeSurface("transparent", brandBase, brandBase, brandBase, toAlpha(textPrimary, 0.16), brandBase);
    case "Ghost":
      return hoveredOrPressed
        ? makeSurface(brandSubtle, "transparent", brandHover, brandHover, toAlpha(textPrimary, 0.16), brandHover)
        : makeSurface("transparent", "transparent", brandBase, brandBase, toAlpha(textPrimary, 0.16), brandBase);
    case "Transparent":
      return hoveredOrPressed
        ? makeSurface(toAlpha(surfaceInverse, 0.12), "transparent", textPrimary, textPrimary, toAlpha(textPrimary, 0.18), textPrimary)
        : makeSurface(toAlpha(surfaceInverse, 0.06), "transparent", textPrimary, textPrimary, toAlpha(textPrimary, 0.16), textPrimary);
    case "Destructive":
      return hoveredOrPressed
        ? makeSurface(toAlpha(statusDanger, 0.12), statusDanger, statusDanger, statusDanger, toAlpha(textPrimary, 0.16), statusDanger)
        : makeSurface(toAlpha(statusDanger, 0.08), toAlpha(statusDanger, 0.24), statusDanger, statusDanger, toAlpha(textPrimary, 0.16), statusDanger);
  }
}

function getRadius(brand: DisplayBrandId, size: ButtonSize, shape: ButtonShape) {
  if (shape === "Pill") {
    return `${Number(getRequiredThemeTokenValue(brand, "radius.pill"))}px`;
  }

  const radiusTokenPath =
    size === "Extra Large"
      ? "radius.alt.xl"
      : size === "Large"
        ? "radius.alt.lg"
        : size === "Medium"
          ? "radius.alt.md"
          : "radius.alt.sm";

  return `${Number(getRequiredThemeTokenValue(brand, radiusTokenPath))}px`;
}

function getIconSize(size: ButtonSize) {
  if (size === "Extra Small") {
    return "14px";
  }

  if (size === "Small") {
    return "16px";
  }

  if (size === "Extra Large") {
    return "20px";
  }

  return "18px";
}

function getTypographyTokenPrefix(size: ButtonSize) {
  if (size === "Extra Small") {
    return "component.button.typography.xs";
  }
  if (size === "Small") {
    return "component.button.typography.sm";
  }
  if (size === "Large") {
    return "component.button.typography.lg";
  }
  if (size === "Extra Large") {
    return "component.button.typography.xl";
  }

  return "component.button.typography.md";
}

function renderSlot(content: ReactNode, color: string, size: string) {
  if (!content) {
    return null;
  }

  if (typeof content === "string") {
    return (
      <span
        aria-hidden="true"
        style={{
          color,
          display: "inline-flex",
          fontSize: size,
          lineHeight: 0
        }}
      >
        {content}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        color,
        display: "inline-flex",
        lineHeight: 0
      }}
    >
      {content}
    </span>
  );
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  shape?: ButtonShape;
  styleVariant?: ButtonStyleVariant;
  size?: ButtonSize | LegacyButtonSize;
  onDark?: boolean;
  loading?: boolean;
  forceState?: ButtonPreviewState;
  tone?: ButtonToneAlias;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  brand = "Cars24",
  shape = "Regular",
  styleVariant,
  size = "Medium",
  onDark = false,
  loading = false,
  disabled = false,
  forceState,
  tone,
  leadingIcon,
  trailingIcon,
  children,
  style,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const normalizedSize = normalizeSize(size);
  const normalizedVariant = normalizeVariant(styleVariant, tone);
  const metrics = BUTTON_SIZE_METRICS[normalizedSize];
  const typographyTokenPrefix = getTypographyTokenPrefix(normalizedSize);
  const hoveredOrPressed = forceState === "Hover/Pressed" || pressed || hovered;
  const surface = getSurface(brand, normalizedVariant, onDark, hoveredOrPressed, disabled);
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const iconSize = getIconSize(normalizedSize);
  const isDisabled = disabled || loading;
  const labelFontSize = Number(getRequiredThemeTokenValue(brand, `${typographyTokenPrefix}.fontSize`));
  const labelLineHeight = Number(getRequiredThemeTokenValue(brand, `${typographyTokenPrefix}.lineHeight`));
  const labelLetterSpacing = Number(getRequiredThemeTokenValue(brand, `${typographyTokenPrefix}.letterSpacing`));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: surface.background,
    border: `1px solid ${surface.border}`,
    borderRadius: getRadius(brand, normalizedSize, shape),
    boxSizing: "border-box",
    color: surface.text,
    cursor: isDisabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    justifyContent: "center",
    minHeight: metrics.height,
    minWidth: metrics.minWidth,
    padding: `${metrics.paddingBlock} ${metrics.paddingInline}`,
    position: "relative",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1)",
    boxShadow: focused ? `0 0 0 3px ${focusColor}40` : "none",
    ...style,
    ...getTapFeedbackStyles({
      disabled: isDisabled,
      pressed,
      transition: style?.transition,
      transform: style?.transform
    })
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: metrics.gap,
    justifyContent: "center",
    minWidth: 0
  };

  const labelStyles: CSSProperties = {
    color: surface.text,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${labelFontSize}px`,
    fontWeight: medium,
    letterSpacing: `${labelLetterSpacing}px`,
    lineHeight: `${labelLineHeight}px`,
    whiteSpace: "nowrap"
  };

  const loaderStyles: CSSProperties = {
    animation: "geist-button-spin 0.8s linear infinite",
    border: "2px solid",
    borderColor: surface.loaderTrack,
    borderRadius: "50%",
    borderTopColor: surface.loaderIndicator,
    boxSizing: "border-box",
    height: metrics.loaderSize,
    width: metrics.loaderSize
  };

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    if (!isDisabled) {
      setHovered(true);
    }
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    setHovered(false);
    setPressed(false);
    onMouseLeave?.(event);
  }

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    if (!isDisabled) {
      setPressed(true);
    }
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseUp?.(event);
  }

  return (
    <>
      <style>{BUTTON_SPIN_KEYFRAMES}</style>
      <button
        {...rest}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        style={rootStyles}
      >
        {loading ? (
          <span aria-hidden="true" style={loaderStyles} />
        ) : (
          <span style={contentStyles}>
            {renderSlot(leadingIcon, surface.icon, iconSize)}
            {children ? <span style={labelStyles}>{children}</span> : null}
            {renderSlot(trailingIcon, surface.icon, iconSize)}
          </span>
        )}
      </button>
    </>
  );
}
