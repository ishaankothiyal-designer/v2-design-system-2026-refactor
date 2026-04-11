import {
  cloneElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";
import { getTapFeedbackStyles } from "./press-feedback";

export const canonicalLinkButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.linkButton"
);

export type LinkButtonTone = "Brand" | "Black";
export type LinkButtonSize = "Extra Small" | "Small" | "Medium" | "Large";
export type LinkButtonPreviewState = "Rest" | "Hover";

type LinkButtonSizeMetrics = {
  height: number;
  gap: number;
  iconSize: number;
};

type LinkButtonTypography = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

function getTokenSizeKey(size: LinkButtonSize) {
  if (size === "Extra Small") {
    return "xs";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "Large") {
    return "lg";
  }

  return "md";
}

function getSizeMetrics(brand: DisplayBrandId, size: LinkButtonSize): LinkButtonSizeMetrics {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.linkButton.size.${tokenSizeKey}`;

  return {
    height: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.height`)),
    gap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.gap`)),
    iconSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.iconSize`))
  };
}

function getTypography(brand: DisplayBrandId, size: LinkButtonSize): LinkButtonTypography {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.linkButton.typography.${tokenSizeKey}`;

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.lineHeight`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`))
  };
}

function getForegroundColor(
  brand: DisplayBrandId,
  tone: LinkButtonTone,
  onDark: boolean,
  hoveredOrPressed: boolean,
  disabled: boolean
) {
  const surfaceKey = onDark ? "dark" : "light";
  const stateKey = hoveredOrPressed ? "hover" : "rest";

  if (disabled) {
    return String(getRequiredThemeTokenValue(brand, `component.linkButton.color.${surfaceKey}.disabled`));
  }

  return String(
    getRequiredThemeTokenValue(
      brand,
      `component.linkButton.color.${surfaceKey}.${tone === "Black" ? "black" : "brand"}.${stateKey}`
    )
  );
}

function renderSlot(content: ReactNode, color: string, size: number) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return (
      <span
        aria-hidden="true"
        style={{
          color,
          display: "inline-flex",
          fontSize: `${size}px`,
          lineHeight: 0
        }}
      >
        {content}
      </span>
    );
  }

  if (isValidElement(content)) {
    const element = content as ReactElement<{ style?: CSSProperties }>;

    return cloneElement(element, {
      style: {
        color,
        fontSize: `${size}px`,
        ...element.props.style
      }
    });
  }

  return (
    <span
      aria-hidden="true"
      style={{
        color,
        display: "inline-flex",
        fontSize: `${size}px`,
        lineHeight: 0
      }}
    >
      {content}
    </span>
  );
}

export interface LinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  tone?: LinkButtonTone;
  size?: LinkButtonSize;
  onDark?: boolean;
  underline?: boolean;
  forceState?: LinkButtonPreviewState;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function LinkButton({
  brand = "Cars24",
  tone = "Brand",
  size = "Extra Small",
  onDark = false,
  underline = true,
  forceState,
  leadingIcon,
  trailingIcon,
  disabled = false,
  children,
  style,
  type = "button",
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}: LinkButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const hoveredOrPressed = forceState === "Hover" || hovered || pressed;
  const metrics = getSizeMetrics(brand, size);
  const typography = getTypography(brand, size);
  const foreground = getForegroundColor(brand, tone, onDark, hoveredOrPressed, disabled);
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const underlineThickness = Number(
    getRequiredThemeTokenValue(brand, "component.linkButton.decoration.underlineThickness")
  );
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const focusOutlineWidth = Number(
    getRequiredThemeTokenValue(brand, "component.linkButton.focus.outlineWidth")
  );
  const focusOutlineOffset = Number(
    getRequiredThemeTokenValue(brand, "component.linkButton.focus.outlineOffset")
  );

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    color: foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    font: "inherit",
    justifyContent: "center",
    minHeight: `${metrics.height}px`,
    padding: 0,
    textDecoration: "none",
    outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : "none",
    outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
    transition: "color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)",
    ...style,
    ...getTapFeedbackStyles({
      disabled,
      pressed,
      transition: style?.transition,
      transform: style?.transform
    })
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    boxShadow: underline ? `inset 0 -${underlineThickness}px 0 0 ${foreground}` : "none",
    display: "inline-flex",
    gap: `${metrics.gap}px`,
    justifyContent: "center",
    minHeight: `${metrics.height}px`,
    minWidth: 0
  };

  const labelStyles: CSSProperties = {
    color: foreground,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight,
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`,
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
      <span style={contentStyles}>
        {renderSlot(leadingIcon, foreground, metrics.iconSize)}
        {children ? <span style={labelStyles}>{children}</span> : null}
        {renderSlot(trailingIcon, foreground, metrics.iconSize)}
      </span>
    </button>
  );
}
