import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalSocialButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.socialButton"
);

export type SocialButtonSize = "Medium" | "Large";
export type SocialButtonPreviewState = "Rest" | "Hover";

type SocialButtonMetrics = {
  gap: number;
  height: number;
  iconSize: number;
  paddingInline: number;
};

type SocialButtonTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type SocialButtonSurface = {
  background: string;
  border: string;
  foreground: string;
  icon: string;
};

type StylableIconElement = ReactElement<{ style?: CSSProperties }>;

function getTokenSizeKey(size: SocialButtonSize) {
  return size === "Large" ? "lg" : "md";
}

function getMetrics(brand: DisplayBrandId, size: SocialButtonSize): SocialButtonMetrics {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.socialButton.size.${tokenSizeKey}`;

  return {
    gap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.gap`)),
    height: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.height`)),
    iconSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.iconSize`)),
    paddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.paddingInline`))
  };
}

function getTypography(brand: DisplayBrandId, size: SocialButtonSize): SocialButtonTypography {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.socialButton.typography.${tokenSizeKey}`;

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.lineHeight`))
  };
}

function getBorderRadius(brand: DisplayBrandId, size: SocialButtonSize) {
  return Number(getRequiredThemeTokenValue(brand, `radius.alt.${size === "Large" ? "lg" : "md"}`));
}

function getSurface(
  brand: DisplayBrandId,
  active: boolean,
  disabled: boolean
): SocialButtonSurface {
  const stateKey = disabled ? "disabled" : active ? "hover" : "rest";
  const tokenPrefix = `component.socialButton.color.light.${stateKey}`;

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    foreground: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`)),
    icon: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.icon`))
  };
}

function renderIcon(icon: ReactNode, color: string, size: number) {
  if (!icon) {
    return null;
  }

  const wrapperStyles: CSSProperties = {
    alignItems: "center",
    color,
    display: "inline-flex",
    fontSize: `${size}px`,
    height: `${size}px`,
    justifyContent: "center",
    lineHeight: 1,
    width: `${size}px`
  };

  if (isValidElement(icon)) {
    const stylableIcon = icon as StylableIconElement;

    return (
      <span aria-hidden style={wrapperStyles}>
        {cloneElement(stylableIcon, {
          style: {
            ...(stylableIcon.props.style ?? {}),
            color,
            fontSize: `${size}px`
          }
        })}
      </span>
    );
  }

  return (
    <span aria-hidden style={wrapperStyles}>
      {icon}
    </span>
  );
}

export interface SocialButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  forceState?: SocialButtonPreviewState;
  icon?: ReactNode;
  size?: SocialButtonSize;
}

export function SocialButton({
  brand = "Cars24",
  children,
  disabled = false,
  forceState,
  icon,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  size = "Large",
  style,
  type = "button",
  ...rest
}: SocialButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const active = forceState === "Hover" || hovered || pressed;
  const metrics = getMetrics(brand, size);
  const typography = getTypography(brand, size);
  const surface = getSurface(brand, active, disabled);
  const borderRadius = getBorderRadius(brand, size);
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.socialButton.border.width"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const focusOutlineWidth = Number(getRequiredThemeTokenValue(brand, "component.socialButton.focus.outlineWidth"));
  const focusOutlineOffset = Number(getRequiredThemeTokenValue(brand, "component.socialButton.focus.outlineOffset"));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: surface.background,
    border: `${borderWidth}px solid ${surface.border}`,
    borderRadius: `${borderRadius}px`,
    boxSizing: "border-box",
    color: surface.foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    gap: `${metrics.gap}px`,
    height: `${metrics.height}px`,
    justifyContent: "center",
    minWidth: 0,
    outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : "none",
    outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
    padding: `0 ${metrics.paddingInline}px`,
    textDecoration: "none",
    ...style
  };

  const labelStyles: CSSProperties = {
    color: surface.foreground,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight,
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`,
    textAlign: "center",
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

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      style={rootStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        setPressed(false);
        onBlur?.(event);
      }}
    >
      {renderIcon(icon, surface.icon, metrics.iconSize)}
      {children ? <span style={labelStyles}>{children}</span> : null}
    </button>
  );
}
