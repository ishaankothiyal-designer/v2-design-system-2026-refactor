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
import { Icon } from "./icon";

export const canonicalBackToTopButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.backToTopButton"
);

export type BackToTopButtonPreviewState = "Rest" | "Hover";

type BackToTopButtonMetrics = {
  gap: number;
  height: number;
  iconSize: number;
  paddingBlock: number;
  paddingInline: number;
};

type BackToTopButtonTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type BackToTopButtonSurface = {
  background: string;
  border: string;
  foreground: string;
  icon: string;
};

type StylableIconElement = ReactElement<{ style?: CSSProperties }>;

const BACK_TO_TOP_SHADOW_FALLBACK =
  "0px 8px 28px -2px rgba(31, 41, 55, 0.04), 0px 18px 72px -2px rgba(31, 41, 55, 0.06)";

function getMetrics(brand: DisplayBrandId): BackToTopButtonMetrics {
  const tokenPrefix = "component.backToTopButton.size.md";

  return {
    gap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.gap`)),
    height: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.height`)),
    iconSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.iconSize`)),
    paddingBlock: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.paddingBlock`)),
    paddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.paddingInline`))
  };
}

function getTypography(brand: DisplayBrandId): BackToTopButtonTypography {
  const tokenPrefix = "component.backToTopButton.typography.md";

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.lineHeight`))
  };
}

function getSurface(
  brand: DisplayBrandId,
  inverse: boolean,
  active: boolean,
  disabled: boolean
): BackToTopButtonSurface {
  const surfaceKey = inverse ? "dark" : "light";
  const stateKey = disabled ? "disabled" : active ? "hover" : "rest";
  const tokenPrefix = `component.backToTopButton.color.${surfaceKey}.${stateKey}`;

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    foreground: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`)),
    icon: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.icon`))
  };
}

function getShadow() {
  const shadowToken = canonicalBackToTopButtonWebContract?.tokenBindings.find(
    (binding) => binding.slot === "container.shadow"
  )?.token;

  return shadowToken === "drop-shadow/lg" ? BACK_TO_TOP_SHADOW_FALLBACK : BACK_TO_TOP_SHADOW_FALLBACK;
}

function renderIcon(icon: ReactNode, color: string, size: number) {
  const wrapperStyles: CSSProperties = {
    alignItems: "center",
    color,
    display: "inline-flex",
    flexShrink: 0,
    fontSize: `${size}px`,
    height: `${size}px`,
    justifyContent: "center",
    lineHeight: 1,
    width: `${size}px`
  };

  if (!icon) {
    return (
      <span aria-hidden style={wrapperStyles}>
        <Icon decorative name="arrow-up-filled" style={{ color, fontSize: `${size}px` }} />
      </span>
    );
  }

  if (typeof icon === "string" || typeof icon === "number") {
    return (
      <span aria-hidden style={wrapperStyles}>
        {icon}
      </span>
    );
  }

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

export interface BackToTopButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  forceState?: BackToTopButtonPreviewState;
  icon?: ReactNode;
  inverse?: boolean;
}

export function BackToTopButton({
  brand = "Cars24",
  children,
  disabled = false,
  forceState,
  icon,
  inverse = false,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  style,
  type = "button",
  ...rest
}: BackToTopButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const active = forceState === "Hover" || hovered || pressed;
  const metrics = getMetrics(brand);
  const typography = getTypography(brand);
  const surface = getSurface(brand, inverse, active, disabled);
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.backToTopButton.border.width"));
  const borderRadius = Number(getRequiredThemeTokenValue(brand, "radius.pill"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const focusOutlineWidth = Number(
    getRequiredThemeTokenValue(brand, "component.backToTopButton.focus.outlineWidth")
  );
  const focusOutlineOffset = Number(
    getRequiredThemeTokenValue(brand, "component.backToTopButton.focus.outlineOffset")
  );

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: surface.background,
    border: "none",
    borderRadius: `${borderRadius}px`,
    boxShadow: [getShadow(), surface.border !== "transparent" ? `inset 0 0 0 ${borderWidth}px ${surface.border}` : null]
      .filter(Boolean)
      .join(", "),
    boxSizing: "border-box",
    color: surface.foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    gap: `${metrics.gap}px`,
    justifyContent: "center",
    minHeight: `${metrics.height}px`,
    minWidth: 0,
    outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : "none",
    outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
    padding: `${metrics.paddingBlock}px ${metrics.paddingInline}px`,
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
        setPressed(false);
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
      {renderIcon(icon, surface.icon, metrics.iconSize)}
      {children ? <span style={labelStyles}>{children}</span> : null}
    </button>
  );
}
