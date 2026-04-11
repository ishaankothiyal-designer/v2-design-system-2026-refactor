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

export const canonicalCaptionButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.captionButton"
);

export type CaptionButtonStyleVariant = "Primary" | "Secondary";
export type CaptionButtonSize = "Medium" | "Large";
export type CaptionButtonCaptionPosition = "Up" | "Down";
export type CaptionButtonPreviewState = "Rest" | "Hover/Pressed";

type CaptionButtonSurface = {
  background: string;
  borderColor: string;
  foreground: string;
};

type CaptionButtonSizeMetrics = {
  borderRadius: number;
  height: number;
  paddingInline: number;
};

type CaptionButtonTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

function getTokenSizeKey(size: CaptionButtonSize) {
  return size === "Large" ? "lg" : "md";
}

function getSizeMetrics(brand: DisplayBrandId, size: CaptionButtonSize): CaptionButtonSizeMetrics {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.captionButton.size.${tokenSizeKey}`;

  return {
    borderRadius: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.borderRadius`)),
    height: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.height`)),
    paddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.paddingInline`))
  };
}

function getTypography(
  brand: DisplayBrandId,
  role: "label" | "caption",
  size: CaptionButtonSize
): CaptionButtonTypography {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.captionButton.typography.${role}.${tokenSizeKey}`;

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.lineHeight`))
  };
}

function getSurface(
  brand: DisplayBrandId,
  styleVariant: CaptionButtonStyleVariant,
  hoveredOrPressed: boolean,
  disabled: boolean
): CaptionButtonSurface {
  if (disabled) {
    return {
      background: String(
        getRequiredThemeTokenValue(brand, "component.captionButton.color.light.disabled.background")
      ),
      borderColor: String(
        getRequiredThemeTokenValue(brand, "component.captionButton.color.light.disabled.border")
      ),
      foreground: String(
        getRequiredThemeTokenValue(brand, "component.captionButton.color.light.disabled.foreground")
      )
    };
  }

  const stateKey = hoveredOrPressed ? "hover" : "rest";
  const variantKey = styleVariant === "Secondary" ? "secondary" : "primary";
  const tokenPrefix = `component.captionButton.color.light.${variantKey}.${stateKey}`;

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    borderColor:
      variantKey === "secondary"
        ? String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`))
        : "transparent",
    foreground: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`))
  };
}

export interface CaptionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  caption?: ReactNode;
  captionPosition?: CaptionButtonCaptionPosition;
  forceState?: CaptionButtonPreviewState;
  size?: CaptionButtonSize;
  styleVariant?: CaptionButtonStyleVariant;
}

export function CaptionButton({
  brand = "Cars24",
  caption,
  captionPosition = "Up",
  children,
  disabled = false,
  forceState,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  size = "Medium",
  style,
  styleVariant = "Primary",
  type = "button",
  ...rest
}: CaptionButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const hoveredOrPressed = forceState === "Hover/Pressed" || hovered || pressed;
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.captionButton.border.width"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const focusOutlineWidth = Number(
    getRequiredThemeTokenValue(brand, "component.captionButton.focus.outlineWidth")
  );
  const focusOutlineOffset = Number(
    getRequiredThemeTokenValue(brand, "component.captionButton.focus.outlineOffset")
  );
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const labelFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const captionFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const metrics = getSizeMetrics(brand, size);
  const labelTypography = getTypography(brand, "label", size);
  const captionTypography = getTypography(brand, "caption", size);
  const surface = getSurface(brand, styleVariant, hoveredOrPressed, disabled);

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: surface.background,
    border: `${borderWidth}px solid ${surface.borderColor}`,
    borderRadius: `${metrics.borderRadius}px`,
    boxSizing: "border-box",
    color: surface.foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flexDirection: "column",
    height: `${metrics.height}px`,
    justifyContent: "center",
    minWidth: 0,
    outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : "none",
    outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
    overflow: "hidden",
    padding: `0 ${metrics.paddingInline}px`,
    textAlign: "center",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
    ...style,
    ...getTapFeedbackStyles({
      disabled,
      pressed,
      transition: style?.transition,
      transform: style?.transform
    })
  };

  const labelStyles: CSSProperties = {
    color: surface.foreground,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${labelTypography.fontSize}px`,
    fontWeight: labelFontWeight,
    letterSpacing: `${labelTypography.letterSpacing}px`,
    lineHeight: `${labelTypography.lineHeight}px`,
    whiteSpace: "nowrap"
  };

  const captionStyles: CSSProperties = {
    color: surface.foreground,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${captionTypography.fontSize}px`,
    fontWeight: captionFontWeight,
    letterSpacing: `${captionTypography.letterSpacing}px`,
    lineHeight: `${captionTypography.lineHeight}px`,
    whiteSpace: "nowrap"
  };

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    if (!disabled) {
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
    if (!disabled) {
      setPressed(true);
    }
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseUp?.(event);
  }

  const captionElement = caption ? <span style={captionStyles}>{caption}</span> : null;
  const labelElement = children ? <span style={labelStyles}>{children}</span> : null;

  return (
    <button
      {...rest}
      disabled={disabled}
      type={type}
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
      {captionPosition === "Up" ? (
        <>
          {captionElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement}
          {captionElement}
        </>
      )}
    </button>
  );
}
