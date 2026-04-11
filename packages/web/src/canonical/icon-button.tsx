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
import { getTapFeedbackStyles } from "./press-feedback";

export const canonicalIconButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.iconButton"
);

export type IconButtonShape = "Regular" | "Round";
export type IconButtonStyleVariant =
  | "Solid - Primary"
  | "Solid - Black"
  | "Outline - Primary"
  | "Outline - Black"
  | "Subtle - Primary"
  | "Subtle - Black"
  | "Ghost - Brand"
  | "Ghost - Black"
  | "Transparent";
export type IconButtonSize = "XXXSmall" | "XXSmall" | "XSmall" | "Small" | "Medium" | "Large";
export type IconButtonPreviewState = "Rest" | "Hover/Pressed";

type IconButtonMetrics = {
  borderRadius: number;
  boxSize: number;
  iconSize: number;
};

type IconButtonSurface = {
  background: string;
  border: string;
  foreground: string;
};

type StylableIconElement = ReactElement<{ style?: CSSProperties }>;

function getTokenSizeKey(size: IconButtonSize) {
  if (size === "Large") {
    return "lg";
  }
  if (size === "Medium") {
    return "md";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "XSmall") {
    return "xs";
  }
  if (size === "XXSmall") {
    return "xxs";
  }

  return "xxxs";
}

function getMetrics(brand: DisplayBrandId, size: IconButtonSize): IconButtonMetrics {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.iconButton.size.${tokenSizeKey}`;

  return {
    borderRadius: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.borderRadius`)),
    boxSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.boxSize`)),
    iconSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.iconSize`))
  };
}

function getSurfaceTokenPrefix(onDark: boolean, styleVariant: IconButtonStyleVariant, active: boolean) {
  const stateKey = active ? "hover" : "rest";
  const modeKey = onDark ? "dark" : "light";

  switch (styleVariant) {
    case "Solid - Primary":
      return `component.iconButton.color.${modeKey}.solid.primary.${stateKey}`;
    case "Solid - Black":
      return `component.iconButton.color.${modeKey}.solid.black.${stateKey}`;
    case "Outline - Primary":
      return `component.iconButton.color.${modeKey}.outline.primary.${stateKey}`;
    case "Outline - Black":
      return `component.iconButton.color.${modeKey}.outline.black.${stateKey}`;
    case "Subtle - Primary":
      return `component.iconButton.color.${modeKey}.subtle.primary.${stateKey}`;
    case "Subtle - Black":
      return `component.iconButton.color.${modeKey}.subtle.black.${stateKey}`;
    case "Ghost - Brand":
      return `component.iconButton.color.${modeKey}.ghost.primary.${stateKey}`;
    case "Ghost - Black":
      return `component.iconButton.color.${modeKey}.ghost.black.${stateKey}`;
    case "Transparent":
      return `component.iconButton.color.${modeKey}.transparent.${stateKey}`;
  }
}

function getSurface(
  brand: DisplayBrandId,
  styleVariant: IconButtonStyleVariant,
  onDark: boolean,
  active: boolean,
  disabled: boolean
): IconButtonSurface {
  const brandAction = String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));
  const brandBaseHover = String(getRequiredThemeTokenValue(brand, "color.brand.primary.600"));
  const brandSubtler = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const brandSubtlerHover = String(getRequiredThemeTokenValue(brand, "color.brand.primary.100"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textInverse = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const modeKey = onDark ? "dark" : "light";

  if (disabled) {
    const disabledPrefix = `component.iconButton.color.${modeKey}.disabled`;
    return {
      background: String(getRequiredThemeTokenValue(brand, `${disabledPrefix}.background`)),
      border: String(getRequiredThemeTokenValue(brand, `${disabledPrefix}.border`)),
      foreground: String(getRequiredThemeTokenValue(brand, `${disabledPrefix}.foreground`))
    };
  }

  if (styleVariant === "Solid - Primary") {
    return {
      background: active ? brandBaseHover : brandAction,
      border: "transparent",
      foreground: textInverse
    };
  }

  if (!onDark && styleVariant === "Outline - Primary") {
    return {
      background: active ? brandSubtlerHover : "transparent",
      border: brandAction,
      foreground: brandAction
    };
  }

  if (!onDark && styleVariant === "Subtle - Primary") {
    return {
      background: active ? brandSubtlerHover : brandSubtler,
      border: "transparent",
      foreground: brandAction
    };
  }

  if (!onDark && styleVariant === "Ghost - Brand") {
    return {
      background: "transparent",
      border: "transparent",
      foreground: brandAction
    };
  }

  if (onDark && styleVariant === "Ghost - Brand") {
    return {
      background: "transparent",
      border: "transparent",
      foreground: textInverse
    };
  }

  if (onDark && styleVariant === "Subtle - Primary") {
    const tokenPrefix = `component.iconButton.color.${modeKey}.subtle.primary.${active ? "hover" : "rest"}`;

    return {
      background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
      border: "transparent",
      foreground: textInverse
    };
  }

  if (onDark && styleVariant === "Outline - Primary") {
    const tokenPrefix = `component.iconButton.color.${modeKey}.outline.primary.${active ? "hover" : "rest"}`;

    return {
      background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
      border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
      foreground: textInverse
    };
  }

  if (styleVariant === "Transparent") {
    const tokenPrefix = getSurfaceTokenPrefix(onDark, styleVariant, active);
    return {
      background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
      border: "transparent",
      foreground: onDark ? textInverse : textPrimary
    };
  }

  const tokenPrefix = getSurfaceTokenPrefix(onDark, styleVariant, active);
  const border =
    styleVariant === "Solid - Black" ||
    styleVariant === "Subtle - Black" ||
    styleVariant === "Ghost - Black"
      ? "transparent"
      : String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`));

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border,
    foreground: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`))
  };
}

function renderIcon(icon: ReactNode, foreground: string, iconSize: number) {
  const iconWrapperStyles: CSSProperties = {
    alignItems: "center",
    color: foreground,
    display: "inline-flex",
    fontSize: `${iconSize}px`,
    height: `${iconSize}px`,
    justifyContent: "center",
    lineHeight: 1,
    width: `${iconSize}px`
  };

  if (!icon) {
    return null;
  }

  if (isValidElement(icon)) {
    const stylableIcon = icon as StylableIconElement;

    return (
      <span aria-hidden style={iconWrapperStyles}>
        {cloneElement(stylableIcon, {
          style: {
            ...(stylableIcon.props.style ?? {}),
            color: foreground,
            fontSize: `${iconSize}px`
          }
        })}
      </span>
    );
  }

  return (
    <span aria-hidden style={iconWrapperStyles}>
      {icon}
    </span>
  );
}

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "size"> {
  brand?: DisplayBrandId;
  forceState?: IconButtonPreviewState;
  icon: ReactNode;
  onDark?: boolean;
  shape?: IconButtonShape;
  size?: IconButtonSize;
  styleVariant?: IconButtonStyleVariant;
}

export function IconButton({
  brand = "Cars24",
  disabled = false,
  forceState,
  icon,
  onBlur,
  onDark = false,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  shape = "Regular",
  size = "Medium",
  style,
  styleVariant = "Solid - Primary",
  type = "button",
  ...rest
}: IconButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const active = forceState === "Hover/Pressed" || hovered || pressed;
  const metrics = getMetrics(brand, size);
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.iconButton.border.width"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const focusOutlineWidth = Number(getRequiredThemeTokenValue(brand, "component.iconButton.focus.outlineWidth"));
  const focusOutlineOffset = Number(getRequiredThemeTokenValue(brand, "component.iconButton.focus.outlineOffset"));
  const roundRadius = Number(getRequiredThemeTokenValue(brand, "radius.pill"));
  const surface = getSurface(brand, styleVariant, onDark, active, disabled);

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: surface.background,
    border: `${borderWidth}px solid ${surface.border}`,
    borderRadius: `${shape === "Round" ? roundRadius : metrics.borderRadius}px`,
    boxSizing: "border-box",
    color: surface.foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    height: `${metrics.boxSize}px`,
    justifyContent: "center",
    outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : "none",
    outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
    padding: 0,
    width: `${metrics.boxSize}px`,
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
      {renderIcon(icon, surface.foreground, metrics.iconSize)}
    </button>
  );
}
