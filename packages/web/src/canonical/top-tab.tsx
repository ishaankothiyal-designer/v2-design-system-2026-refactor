import {
  cloneElement,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import { designSystemRegistry } from "@geist/contracts";
import type { DisplayBrandId } from "@geist/tokens";
import { getRequiredThemeTokenValue } from "../theme";
import { CounterBadge } from "./counter-badge";
import { Icon } from "./icon";
import { NotificationBadge } from "./notification-badge";

export const canonicalTopTabWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.topTab"
);

export type TopTabConfiguration =
  | "Label + icon"
  | "Icon only"
  | "Label + image"
  | "Image only";
export type TopTabItemState = "Rest" | "Hover" | "Pressed" | "Disabled";

export interface TopTabItem {
  value: string;
  label?: ReactNode;
  ariaLabel?: string;
  counterBadgeLabel?: ReactNode;
  disabled?: boolean;
  image?: ReactNode;
  imageAlt?: string;
  imageSrc?: string;
  iconName?: IconName;
  icon?: ReactNode;
  showCounterBadge?: boolean;
  showNotificationBadge?: boolean;
  state?: TopTabItemState;
}

export interface TopTabProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  brand?: DisplayBrandId;
  items: TopTabItem[];
  configuration?: TopTabConfiguration;
  inverse?: boolean;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

type ResolvedTopTabState = "Rest" | "Hover" | "Pressed" | "Active" | "Disabled";

function getTopTabToken(slot: string) {
  return canonicalTopTabWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function resolveTopTabBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getTopTabToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("component.") ||
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.") ||
    token.startsWith("icon.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

function toPx(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

function getFirstEnabledItemValue(items: TopTabItem[], disabled: boolean) {
  return items.find((item) => !disabled && !item.disabled && item.state !== "Disabled")?.value;
}

function resolveItemLabel(item: TopTabItem) {
  return item.label ?? item.ariaLabel ?? item.value;
}

function getResolvedState(
  selected: boolean,
  disabled: boolean,
  previewState: TopTabItemState | undefined,
  hovered: boolean,
  pressed: boolean
): ResolvedTopTabState {
  if (disabled || previewState === "Disabled") {
    return "Disabled";
  }

  if (selected) {
    return "Active";
  }

  if (pressed) {
    return "Pressed";
  }

  if (hovered) {
    return "Hover";
  }

  if (previewState === "Hover" || previewState === "Pressed") {
    return previewState;
  }

  return "Rest";
}

function renderDecorativeIcon({
  brand,
  color,
  content,
  size
}: {
  brand: DisplayBrandId;
  color: string;
  content?: ReactNode;
  size: "sm" | "md";
}) {
  if (!content) {
    return null;
  }

  if (typeof content === "string") {
    return <Icon brand={brand} decorative name={content as IconName} size={size} style={{ color }} />;
  }

  if (isValidElement(content)) {
    const element = content as ReactElement<{ style?: CSSProperties; "aria-hidden"?: boolean }>;

    return cloneElement(element, {
      "aria-hidden": true,
      style: {
        color,
        ...element.props.style
      }
    });
  }

  return content;
}

function renderMedia({
  brand,
  color,
  iconSize,
  imageAlt,
  imageRadius,
  imageSize,
  imageSrc,
  imageContent,
  iconContent
}: {
  brand: DisplayBrandId;
  color: string;
  iconContent?: ReactNode | undefined;
  iconSize: "sm" | "md";
  imageAlt?: string | undefined;
  imageContent?: ReactNode | undefined;
  imageRadius: string;
  imageSize: string;
  imageSrc?: string | undefined;
}) {
  if (imageContent) {
    if (isValidElement(imageContent)) {
      return cloneElement(imageContent as ReactElement<{ "aria-hidden"?: boolean }>, {
        "aria-hidden": true
      });
    }

    return imageContent;
  }

  if (imageSrc) {
    return (
      <img
        alt={imageAlt ?? ""}
        aria-hidden="true"
        src={imageSrc}
        style={{
          borderRadius: imageRadius,
          display: "block",
          height: imageSize,
          objectFit: "cover",
          width: imageSize
        }}
      />
    );
  }

  return renderDecorativeIcon({
    brand,
    color,
    content: iconContent,
    size: iconSize
  });
}

function findNextEnabledIndex(
  items: TopTabItem[],
  disabled: boolean,
  startIndex: number,
  direction: 1 | -1
) {
  if (!items.length) {
    return -1;
  }

  for (let offset = 1; offset <= items.length; offset += 1) {
    const index = (startIndex + direction * offset + items.length) % items.length;
    const item = items[index];

    if (!disabled && item && !item.disabled && item.state !== "Disabled") {
      return index;
    }
  }

  return -1;
}

/**
 * Token-bound top tab navigation matching the canonical Figma count, inverse, and configuration variants.
 */
export function TopTab({
  brand = "Cars24",
  items,
  configuration = "Label + icon",
  inverse = false,
  value,
  defaultValue,
  disabled = false,
  onValueChange,
  style,
  ...rest
}: TopTabProps) {
  const initialValue = defaultValue ?? getFirstEnabledItemValue(items, disabled);
  const [internalValue, setInternalValue] = useState<string | undefined>(initialValue);
  const [focusedValue, setFocusedValue] = useState<string | undefined>(undefined);
  const [hoveredValue, setHoveredValue] = useState<string | undefined>(undefined);
  const [pressedValue, setPressedValue] = useState<string | undefined>(undefined);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    if (resolvedValue && items.some((item) => item.value === resolvedValue && !disabled && !item.disabled)) {
      return;
    }

    const nextValue = getFirstEnabledItemValue(items, disabled);
    if (nextValue !== resolvedValue) {
      setInternalValue(nextValue);
    }
  }, [disabled, isControlled, items, resolvedValue]);

  const borderColor = resolveTopTabBindingValue(
    brand,
    inverse ? "container.border.color.dark" : "container.border.color.light",
    inverse ? "rgba(255, 255, 255, 0.3)" : "#D0D5DD"
  );
  const borderWidth = toPx(resolveTopTabBindingValue(brand, "container.border.width", "1"));
  const contentGap = toPx(resolveTopTabBindingValue(brand, "item.contentGap", "4"));
  const indicatorThickness = toPx(resolveTopTabBindingValue(brand, "item.indicator.thickness", "2"));
  const iconSize = toPx(resolveTopTabBindingValue(brand, "item.icon.size", "20"));
  const imageSize = toPx(resolveTopTabBindingValue(brand, "item.image.size", "50"));
  const imageRadius = toPx(resolveTopTabBindingValue(brand, "item.image.radius", "6"));
  const itemHeight = toPx(resolveTopTabBindingValue(brand, "item.height", "64"));
  const labelPaddingBlock = toPx(resolveTopTabBindingValue(brand, "item.label.paddingBlock", "10"));
  const iconOnlyPaddingBlock = toPx(resolveTopTabBindingValue(brand, "item.iconOnly.paddingBlock", "20"));
  const paddingInline = toPx(resolveTopTabBindingValue(brand, "item.paddingInline", "8"));
  const badgeGap = toPx(resolveTopTabBindingValue(brand, "item.badge.gap", "4"));
  const surfacePadding = toPx(resolveTopTabBindingValue(brand, "item.surface.padding", "8"));
  const surfaceRadius = toPx(resolveTopTabBindingValue(brand, "item.surface.radius", "12"));
  const fontFamily = resolveTopTabBindingValue(
    brand,
    "item.typography.fontFamily",
    String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
  );
  const fontSize = toPx(resolveTopTabBindingValue(brand, "item.typography.fontSize", "12"));
  const lineHeight = toPx(resolveTopTabBindingValue(brand, "item.typography.lineHeight", "16"));
  const letterSpacing = toPx(resolveTopTabBindingValue(brand, "item.typography.letterSpacing", "0"));
  const fontWeightRest = Number(resolveTopTabBindingValue(brand, "item.typography.fontWeight.rest", "500"));
  const fontWeightHover = Number(resolveTopTabBindingValue(brand, "item.typography.fontWeight.hover", "600"));
  const fontWeightActive = Number(resolveTopTabBindingValue(brand, "item.typography.fontWeight.active", "500"));
  const focusOutlineWidth = toPx(resolveTopTabBindingValue(brand, "item.focus.outlineWidth", "2"));
  const focusOutlineOffset = toPx(resolveTopTabBindingValue(brand, "item.focus.outlineOffset", "2"));
  const focusOutlineColor = resolveTopTabBindingValue(
    brand,
    "item.focus.outlineColor",
    String(getRequiredThemeTokenValue(brand, "color.border.focus"))
  );
  const iconToneSize = Number(iconSize) <= 16 ? "sm" : "md";

  function getItemColor(state: ResolvedTopTabState) {
    const themeKey = inverse ? "dark" : "light";
    const stateKey =
      state === "Active"
        ? "active"
        : state === "Hover" || state === "Pressed"
          ? "hover"
          : state === "Disabled"
            ? "disabled"
            : "rest";

    return resolveTopTabBindingValue(
      brand,
      `item.color.${themeKey}.${stateKey}`,
      inverse
        ? state === "Disabled"
          ? "rgba(255, 255, 255, 0.3)"
          : "#FFFFFF"
        : state === "Active"
          ? "#4736FE"
          : state === "Hover" || state === "Pressed"
            ? "#101828"
            : state === "Disabled"
              ? "#94A3B8"
              : "#475467"
    );
  }

  function getItemFontWeight(state: ResolvedTopTabState) {
    if (state === "Hover" || state === "Pressed") {
      return fontWeightHover;
    }

    if (state === "Active") {
      return fontWeightActive;
    }

    return fontWeightRest;
  }

  function getItemSurfaceBackground(state: ResolvedTopTabState) {
    if (state !== "Hover" && state !== "Pressed") {
      return "transparent";
    }

    return resolveTopTabBindingValue(
      brand,
      inverse ? "item.surface.dark.hover" : "item.surface.light.hover",
      inverse ? "#262626" : "#F6F6FF"
    );
  }

  function selectValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || !items.length) {
      return;
    }

    const selectedIndex = items.findIndex((item) => item.value === resolvedValue);
    const currentIndex = selectedIndex >= 0 ? selectedIndex : index;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(items, disabled, currentIndex, 1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;
      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(items, disabled, currentIndex, -1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;
      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      const nextIndex = items.findIndex((item) => !disabled && !item.disabled && item.state !== "Disabled");
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;
      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "End") {
      event.preventDefault();
      const nextIndex = [...items]
        .map((item, itemIndex) => ({ item, itemIndex }))
        .reverse()
        .find(({ item }) => !disabled && !item.disabled && item.state !== "Disabled")?.itemIndex;

      const nextItem = nextIndex !== undefined ? items[nextIndex] : undefined;
      if (nextIndex !== undefined && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }
  }

  function handleFocus(itemValue: string, _event: FocusEvent<HTMLButtonElement>) {
    setFocusedValue(itemValue);
  }

  function handleBlur(itemValue: string, _event: FocusEvent<HTMLButtonElement>) {
    if (focusedValue === itemValue) {
      setFocusedValue(undefined);
    }

    if (pressedValue === itemValue) {
      setPressedValue(undefined);
    }
  }

  function handleMouseEnter(itemValue: string) {
    setHoveredValue(itemValue);
  }

  function handleMouseLeave(itemValue: string) {
    if (hoveredValue === itemValue) {
      setHoveredValue(undefined);
    }

    if (pressedValue === itemValue) {
      setPressedValue(undefined);
    }
  }

  function handleMouseDown(itemValue: string) {
    setHoveredValue(itemValue);
    setPressedValue(itemValue);
  }

  function handleMouseUp(itemValue: string) {
    if (pressedValue === itemValue) {
      setPressedValue(undefined);
    }
  }

  return (
    <div
      {...rest}
      role="tablist"
      aria-orientation="horizontal"
      style={{
        borderBottom: `${borderWidth} solid ${borderColor}`,
        display: "flex",
        width: "100%",
        ...style
      }}
    >
      {items.map((item, index) => {
        const itemDisabled = disabled || Boolean(item.disabled) || item.state === "Disabled";
        const selected = item.value === resolvedValue && !itemDisabled;
        const resolvedState = getResolvedState(
          selected,
          disabled || Boolean(item.disabled),
          item.state,
          hoveredValue === item.value,
          pressedValue === item.value
        );
        const foreground = getItemColor(resolvedState);
        const label = resolveItemLabel(item);
        const showLabel = configuration === "Label + icon" || configuration === "Label + image";
        const usesImage = configuration === "Label + image" || configuration === "Image only";
        const showCounterBadge = showLabel && item.showCounterBadge && resolvedState !== "Disabled";
        const showNotificationBadge = item.showNotificationBadge && resolvedState !== "Disabled";

        return (
          <button
            key={item.value}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            aria-label={typeof label === "string" ? label : item.ariaLabel ?? item.value}
            aria-selected={selected}
            disabled={itemDisabled}
            onBlur={(event) => handleBlur(item.value, event)}
            onClick={() => {
              if (!itemDisabled) {
                selectValue(item.value);
              }
            }}
            onFocus={(event) => handleFocus(item.value, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onMouseDown={() => {
              if (!itemDisabled) {
                handleMouseDown(item.value);
              }
            }}
            onMouseEnter={() => {
              if (!itemDisabled) {
                handleMouseEnter(item.value);
              }
            }}
            onMouseLeave={() => handleMouseLeave(item.value)}
            onMouseUp={() => handleMouseUp(item.value)}
            role="tab"
            tabIndex={selected || (!resolvedValue && index === 0) ? 0 : -1}
            type="button"
            style={{
              alignItems: "center",
              appearance: "none",
              background: "transparent",
              border: "none",
              borderBottom: `${indicatorThickness} solid ${selected ? foreground : "transparent"}`,
              color: foreground,
              cursor: itemDisabled ? "not-allowed" : "pointer",
              display: "inline-flex",
              flex: "1 1 0",
              justifyContent: "center",
              marginBottom: `calc(${borderWidth} * -1)`,
              minHeight: itemHeight,
              minWidth: 0,
              outline: focusedValue === item.value ? `${focusOutlineWidth} solid ${focusOutlineColor}` : undefined,
              outlineOffset: focusedValue === item.value ? focusOutlineOffset : undefined,
              padding: `${showLabel ? labelPaddingBlock : iconOnlyPaddingBlock} ${paddingInline}`,
              position: "relative",
              transition: "color 120ms ease, border-color 120ms ease"
            }}
          >
            <span
              aria-hidden="true"
              style={{
                alignItems: "center",
                background: getItemSurfaceBackground(resolvedState),
                borderRadius: surfaceRadius,
                color: foreground,
                display: "inline-flex",
                flexDirection: "column",
                gap: showLabel ? contentGap : "0px",
                justifyContent: "center",
                minWidth: 0,
                padding: surfacePadding,
                transition: "background 120ms ease, color 120ms ease"
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  position: "relative"
                }}
              >
                {renderMedia({
                  brand,
                  color: foreground,
                  iconContent: usesImage ? undefined : item.icon ?? item.iconName,
                  iconSize: iconToneSize === "sm" ? "sm" : "md",
                  imageAlt: usesImage ? item.imageAlt : undefined,
                  imageContent: usesImage ? item.image : undefined,
                  imageRadius,
                  imageSize,
                  imageSrc: usesImage ? item.imageSrc : undefined
                })}
                {showNotificationBadge ? (
                  <NotificationBadge
                    brand={brand}
                    size="Large"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      transform: "translate(35%, -20%)"
                    }}
                  />
                ) : null}
              </span>
              {showLabel ? (
                <span
                  style={{
                    alignItems: "center",
                    display: "inline-flex",
                    gap: badgeGap
                  }}
                >
                  <span
                    style={{
                      color: foreground,
                      fontFamily: `${fontFamily}, sans-serif`,
                      fontSize,
                      fontWeight: getItemFontWeight(resolvedState),
                      letterSpacing,
                      lineHeight,
                      minWidth: 0,
                      textAlign: "center",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {label}
                  </span>
                  {showCounterBadge ? (
                    <CounterBadge brand={brand} color={inverse ? "White" : "Brand"} size="Small">
                      {item.counterBadgeLabel ?? "5"}
                    </CounterBadge>
                  ) : null}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
