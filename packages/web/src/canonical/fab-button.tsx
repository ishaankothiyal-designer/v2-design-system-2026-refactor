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
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, getThemeTokenValue } from "../theme";
import { Icon } from "./icon";

export const canonicalFabButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.fabButton"
);

export type FabButtonPreviewState = "Rest" | "Hover";

type StylableElement = ReactElement<{ style?: CSSProperties; className?: string }>;

type FabButtonPalette = {
  background: string;
  foreground: string;
  icon: string;
};

const FAB_BUTTON_COLLAPSED_SIZE = 48;
const FAB_BUTTON_EXPANDED_WIDTH = 324;
const FAB_BUTTON_CONTENT_WIDTH = 224;
const FAB_BUTTON_LABEL_WIDTH = 192;
const FAB_BUTTON_ICON_SIZE = 24;
const FAB_BUTTON_CONTENT_GAP = 8;
const FAB_BUTTON_PADDING = 12;
const FAB_BUTTON_TAG_LEFT = 26;
const FAB_BUTTON_TAG_TOP = -3;
const FAB_BUTTON_TAG_MIN_WIDTH = 26;
const FAB_BUTTON_TAG_HEIGHT = 16;
const FAB_BUTTON_TAG_PADDING_INLINE = 6;
const FAB_BUTTON_PRESSED_TRANSFORM = "translateY(1px) scale(0.985)";

function toPx(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function getPalette(brand: DisplayBrandId, hovered: boolean, disabled: boolean): FabButtonPalette {
  if (disabled) {
    return {
      background: String(getRequiredThemeTokenValue(brand, "component.backToTopButton.color.dark.disabled.background")),
      foreground: String(getRequiredThemeTokenValue(brand, "component.backToTopButton.color.dark.disabled.foreground")),
      icon: String(getRequiredThemeTokenValue(brand, "component.backToTopButton.color.dark.disabled.icon"))
    };
  }

  const stateKey = hovered ? "hover" : "rest";

  return {
    background: String(getRequiredThemeTokenValue(brand, `component.backToTopButton.color.dark.${stateKey}.background`)),
    foreground: String(getRequiredThemeTokenValue(brand, `component.backToTopButton.color.dark.${stateKey}.foreground`)),
    icon: String(getRequiredThemeTokenValue(brand, `component.backToTopButton.color.dark.${stateKey}.icon`))
  };
}

function renderIcon(icon: ReactNode, color: string) {
  if (!icon) {
    return (
      <span aria-hidden style={iconSlotStyles}>
        <Icon decorative name="arrow-out-of-box-upload-share-outline" style={{ color, fontSize: FAB_BUTTON_ICON_SIZE }} />
      </span>
    );
  }

  if (isValidElement(icon)) {
    const element = icon as StylableElement;

    return (
      <span aria-hidden style={iconSlotStyles}>
        {cloneElement(element, {
          className: [element.props.className].filter(Boolean).join(" "),
          style: {
            color,
            fontSize: FAB_BUTTON_ICON_SIZE,
            ...element.props.style
          }
        })}
      </span>
    );
  }

  return (
    <span aria-hidden style={iconSlotStyles}>
      {icon}
    </span>
  );
}

const iconSlotStyles: CSSProperties = {
  alignItems: "center",
  display: "inline-flex",
  flexShrink: 0,
  height: FAB_BUTTON_ICON_SIZE,
  justifyContent: "center",
  lineHeight: "1",
  width: FAB_BUTTON_ICON_SIZE
};

export interface FabButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  forceState?: FabButtonPreviewState;
  icon?: ReactNode;
  showTag?: boolean;
  tagLabel?: ReactNode;
}

export function FabButton({
  brand = "Cars24",
  children,
  className,
  disabled = false,
  forceState,
  icon,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  showTag = true,
  style,
  tagLabel = "10",
  type = "button",
  ...rest
}: FabButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isHovered = forceState === "Hover" || hovered || pressed;
  const isPressed = !disabled && (pressed || forceState === "Hover");
  const isExpanded = isHovered && !disabled;
  const palette = getPalette(brand, isHovered, disabled);
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const borderRadius = toPx(getRequiredThemeTokenValue(brand, "radius.pill"));
  const borderWidth = toPx(getRequiredThemeTokenValue(brand, "component.backToTopButton.border.width"));
  const boxShadow = String(getRequiredThemeTokenValue(brand, "component.backToTopButton.shadow.lg"));
  const outlineWidth = toPx(getRequiredThemeTokenValue(brand, "component.backToTopButton.focus.outlineWidth"));
  const outlineOffset = toPx(getRequiredThemeTokenValue(brand, "component.backToTopButton.focus.outlineOffset"));
  const outlineColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const tagBackground = String(getThemeTokenValue(brand, "component.sectionHeader.color.tag.background") ?? "#DC2626");
  const tagForeground = String(getThemeTokenValue(brand, "component.sectionHeader.color.tag.foreground") ?? "#FFFFFF");
  const tagFontSize = toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.xs"));
  const tagLineHeight = toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs"));
  const tagFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const labelFontSize = toPx(getRequiredThemeTokenValue(brand, "component.button.typography.sm.fontSize"));
  const labelLineHeight = toPx(getRequiredThemeTokenValue(brand, "component.button.typography.sm.lineHeight"));
  const labelLetterSpacing = toPx(getRequiredThemeTokenValue(brand, "component.button.typography.sm.letterSpacing"));
  const labelFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: palette.background,
    border: `${borderWidth} solid transparent`,
    borderRadius,
    boxShadow,
    boxSizing: "border-box",
    color: palette.foreground,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    height: toPx(FAB_BUTTON_COLLAPSED_SIZE),
    justifyContent: isExpanded ? "flex-start" : "center",
    minWidth: toPx(FAB_BUTTON_COLLAPSED_SIZE),
    outline: focused ? `${outlineWidth} solid ${outlineColor}` : "none",
    outlineOffset,
    overflow: "visible",
    padding: toPx(FAB_BUTTON_PADDING),
    position: "relative",
    textDecoration: "none",
    transform: isPressed ? FAB_BUTTON_PRESSED_TRANSFORM : undefined,
    transformOrigin: "center center",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1), width 220ms cubic-bezier(0.2, 0, 0, 1)",
    verticalAlign: "top",
    width: toPx(isExpanded ? FAB_BUTTON_EXPANDED_WIDTH : FAB_BUTTON_COLLAPSED_SIZE),
    ...style
  };

  const expandedContentStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: toPx(FAB_BUTTON_CONTENT_GAP),
    justifyContent: "flex-start",
    overflow: "hidden",
    transition: "width 220ms cubic-bezier(0.2, 0, 0, 1)",
    width: toPx(isExpanded ? FAB_BUTTON_CONTENT_WIDTH : FAB_BUTTON_ICON_SIZE)
  };

  const labelStyles: CSSProperties = {
    color: palette.foreground,
    display: "block",
    fontFamily,
    fontSize: labelFontSize,
    fontWeight: labelFontWeight,
    letterSpacing: labelLetterSpacing,
    lineHeight: labelLineHeight,
    opacity: isExpanded ? 1 : 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "opacity 140ms cubic-bezier(0.2, 0, 0, 1)",
    whiteSpace: "nowrap",
    width: toPx(FAB_BUTTON_LABEL_WIDTH)
  };

  const tagStyles: CSSProperties = {
    alignItems: "center",
    background: tagBackground,
    borderRadius,
    boxSizing: "border-box",
    color: tagForeground,
    display: "inline-flex",
    height: toPx(FAB_BUTTON_TAG_HEIGHT),
    justifyContent: "center",
    left: toPx(FAB_BUTTON_TAG_LEFT),
    minWidth: toPx(FAB_BUTTON_TAG_MIN_WIDTH),
    paddingInline: toPx(FAB_BUTTON_TAG_PADDING_INLINE),
    pointerEvents: "none",
    position: "absolute",
    top: toPx(FAB_BUTTON_TAG_TOP),
    whiteSpace: "nowrap"
  };

  const tagLabelStyles: CSSProperties = {
    color: tagForeground,
    display: "block",
    fontFamily,
    fontSize: tagFontSize,
    fontWeight: tagFontWeight,
    letterSpacing: "0px",
    lineHeight: tagLineHeight,
    margin: 0,
    textAlign: "center"
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
      className={className}
      disabled={disabled}
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
      type={type}
    >
      {showTag ? (
        <span aria-hidden style={tagStyles}>
          <span style={tagLabelStyles}>{tagLabel}</span>
        </span>
      ) : null}
      <span style={expandedContentStyles}>
        {renderIcon(icon, palette.icon)}
        <span aria-hidden={!isExpanded} style={labelStyles}>
          {children}
        </span>
      </span>
    </button>
  );
}
