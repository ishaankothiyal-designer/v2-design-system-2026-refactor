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
import { Icon } from "./icon";

export const canonicalBottomNavWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.bottomNav"
);

export type BottomNavType = "Sticky" | "Floating";
export type BottomNavConfiguration = "Label + icon" | "Icon only";
export type BottomNavItemState = "Rest" | "Selected";

export interface BottomNavItem {
  value: string;
  label?: ReactNode;
  ariaLabel?: string;
  iconName?: IconName;
  icon?: ReactNode;
  disabled?: boolean;
  state?: BottomNavItemState;
}

export interface BottomNavProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  brand?: DisplayBrandId;
  items: BottomNavItem[];
  type?: BottomNavType;
  configuration?: BottomNavConfiguration;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  showHomeIndicator?: boolean;
}

function getBottomNavToken(slot: string) {
  return canonicalBottomNavWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveBottomNavBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getBottomNavToken(slot);

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

function toPx(value: string | number) {
  return typeof value === "number" ? `${value}px` : /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

function toTransparent(color: string) {
  const normalized = color.trim();

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);
    const value =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => `${char}${char}`)
            .join("")
        : hex.length === 6
          ? hex
          : undefined;

    if (value) {
      const red = Number.parseInt(value.slice(0, 2), 16);
      const green = Number.parseInt(value.slice(2, 4), 16);
      const blue = Number.parseInt(value.slice(4, 6), 16);

      return `rgba(${red}, ${green}, ${blue}, 0)`;
    }
  }

  const rgbMatch = normalized.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);

  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0)`;
  }

  return "transparent";
}

function getDefaultValue(items: BottomNavItem[]) {
  return items.find((item) => !item.disabled && item.state === "Selected")?.value ?? items.find((item) => !item.disabled)?.value;
}

function resolveConfiguration(items: BottomNavItem[], configuration: BottomNavConfiguration | undefined) {
  if (configuration) {
    return configuration;
  }

  return items.some((item) => item.label !== undefined) ? "Label + icon" : "Icon only";
}

function resolveType(brand: DisplayBrandId, type: BottomNavType | undefined): BottomNavType {
  if (type) {
    return type;
  }

  return brand === "VehicleInfo" ? "Floating" : "Sticky";
}

function renderItemIcon({
  brand,
  color,
  icon,
  iconName,
  size
}: {
  brand: DisplayBrandId;
  color: string;
  icon: ReactNode | undefined;
  iconName: IconName | undefined;
  size: string;
}) {
  if (icon) {
    if (isValidElement(icon)) {
      const element = icon as ReactElement<{ style?: CSSProperties; "aria-hidden"?: boolean }>;

      return cloneElement(element, {
        "aria-hidden": true,
        style: {
          color,
          fontSize: size,
          ...element.props.style
        }
      });
    }

    return icon;
  }

  if (!iconName) {
    return null;
  }

  return (
    <Icon
      brand={brand}
      decorative
      name={iconName}
      style={{
        color,
        fontSize: size
      }}
    />
  );
}

function getNextEnabledIndex(items: BottomNavItem[], startIndex: number, direction: 1 | -1) {
  if (!items.length) {
    return -1;
  }

  for (let offset = 1; offset <= items.length; offset += 1) {
    const candidateIndex = (startIndex + offset * direction + items.length) % items.length;

    if (!items[candidateIndex]?.disabled) {
      return candidateIndex;
    }
  }

  return -1;
}

/**
 * Canonical mobile bottom navigation with sticky and floating variants, driven by equal-width destinations.
 */
export function BottomNav({
  brand = "Cars24",
  items,
  type,
  configuration,
  value,
  defaultValue,
  onValueChange,
  showHomeIndicator = false,
  className,
  style,
  "aria-label": ariaLabel = "Bottom navigation",
  ...rest
}: BottomNavProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    defaultValue ?? getDefaultValue(items)
  );
  const [focusedValue, setFocusedValue] = useState<string | undefined>(undefined);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (value !== undefined) {
      return;
    }

    if (!items.some((item) => item.value === uncontrolledValue && !item.disabled)) {
      setUncontrolledValue(getDefaultValue(items));
    }
  }, [items, uncontrolledValue, value]);

  const selectedValue = value ?? uncontrolledValue ?? getDefaultValue(items);
  const fallbackValue = getDefaultValue(items);
  const resolvedConfiguration = resolveConfiguration(items, configuration);
  const resolvedType = resolveType(brand, type);
  const isFloating = resolvedType === "Floating";
  const canvasColor = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const inverseSurfaceColor = String(getRequiredThemeTokenValue(brand, "color.surface.inverse"));
  const brandPrimaryColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const inverseTextColor = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const secondaryTextColor = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const brandTextColor = String(getRequiredThemeTokenValue(brand, "component.linkButton.color.light.brand.rest"));
  const defaultBorderColor = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const floatingWrapperPaddingInline = toPx(
    resolveBottomNavBindingValue(brand, "root.floating.paddingInline", "16px")
  );
  const floatingWrapperPaddingBlock = toPx(
    resolveBottomNavBindingValue(brand, "root.floating.paddingBlock", "8px")
  );
  const floatingGradientCanvas = resolveBottomNavBindingValue(
    brand,
    "root.floating.gradient.canvas",
    "#FFFFFF"
  );
  const floatingContainerBackground = resolveBottomNavBindingValue(
    brand,
    "container.floating.background",
    brandPrimaryColor
  );
  const floatingContainerRadius = toPx(
    resolveBottomNavBindingValue(brand, "container.floating.radius", "999px")
  );
  const floatingContainerPaddingInlineStart = toPx(
    resolveBottomNavBindingValue(brand, "container.floating.paddingInlineStart", "4px")
  );
  const floatingContainerPaddingInlineEnd = toPx(
    resolveBottomNavBindingValue(brand, "container.floating.paddingInlineEnd", "12px")
  );
  const floatingContainerPaddingBlock = toPx(
    resolveBottomNavBindingValue(brand, "container.floating.paddingBlock", "4px")
  );
  const stickyBackground = resolveBottomNavBindingValue(
    brand,
    "container.sticky.background",
    canvasColor
  );
  const stickyBorderWidth = toPx(
    resolveBottomNavBindingValue(brand, "container.sticky.borderWidth", "1px")
  );
  const stickyBorderColor = resolveBottomNavBindingValue(
    brand,
    "container.sticky.borderColor",
    defaultBorderColor
  );
  const itemHeight = toPx(
    resolveBottomNavBindingValue(
      brand,
      isFloating ? "item.height.floating" : "item.height.sticky",
      isFloating ? "62px" : "56px"
    )
  );
  const floatingItemRadius = toPx(
    resolveBottomNavBindingValue(brand, "item.radius.floating", "999px")
  );
  const floatingItemOverlap = toPx(
    resolveBottomNavBindingValue(
      brand,
      "item.overlap.floating",
      String(getRequiredThemeTokenValue(brand, "spacing.2"))
    )
  );
  const itemContentGap = toPx(resolveBottomNavBindingValue(brand, "item.contentGap", "4px"));
  const itemIconSize = toPx(
    resolveBottomNavBindingValue(
      brand,
      "item.icon.size",
      String(getRequiredThemeTokenValue(brand, "icon.size.lg"))
    )
  );
  const labelFontFamily = `${resolveBottomNavBindingValue(brand, "item.typography.fontFamily", "Geist")}, sans-serif`;
  const labelFontWeight = Number(
    resolveBottomNavBindingValue(brand, "item.typography.fontWeight", "600")
  );
  const labelFontSize = toPx(
    resolveBottomNavBindingValue(
      brand,
      "item.typography.fontSize",
      String(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.fontSize"))
    )
  );
  const labelLineHeight = toPx(resolveBottomNavBindingValue(brand, "item.typography.lineHeight", "17px"));
  const labelLetterSpacing = toPx(
    resolveBottomNavBindingValue(
      brand,
      "item.typography.letterSpacing",
      String(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.letterSpacing"))
    )
  );
  const floatingSelectedBackground = resolveBottomNavBindingValue(
    brand,
    "item.background.floating.selected",
    canvasColor
  );
  const stickyIndicatorWidth = toPx(
    resolveBottomNavBindingValue(
      brand,
      "item.indicator.sticky.width",
      String(getRequiredThemeTokenValue(brand, "spacing.12"))
    )
  );
  const stickyIndicatorHeight = toPx(
    resolveBottomNavBindingValue(
      brand,
      "item.indicator.sticky.height",
      String(getRequiredThemeTokenValue(brand, "component.switch.focus.outlineWidth"))
    )
  );
  const focusOutlineWidth = toPx(
    resolveBottomNavBindingValue(brand, "item.focus.outlineWidth", "2px")
  );
  const focusOutlineOffset = toPx(
    resolveBottomNavBindingValue(brand, "item.focus.outlineOffset", "2px")
  );
  const focusOutlineColor = resolveBottomNavBindingValue(
    brand,
    "item.focus.outlineColor",
    "var(--cars24-semantic-border-focus, #3B82F6)"
  );
  const homeIndicatorColor = resolveBottomNavBindingValue(
    brand,
    "homeIndicator.color",
    inverseSurfaceColor
  );
  const homeIndicatorWidth = toPx(resolveBottomNavBindingValue(brand, "homeIndicator.width", "134px"));
  const homeIndicatorHeight = toPx(resolveBottomNavBindingValue(brand, "homeIndicator.height", "5px"));
  const homeIndicatorOpacity = Number(
    resolveBottomNavBindingValue(brand, "homeIndicator.opacity", "0.75")
  );

  const rootStyles: CSSProperties = {
    background: isFloating
      ? `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${floatingGradientCanvas} 100%)`
      : stickyBackground,
    borderTop: isFloating ? undefined : `${stickyBorderWidth} solid ${stickyBorderColor}`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    ...(isFloating
      ? {
          padding: `${floatingWrapperPaddingBlock} ${floatingWrapperPaddingInline}`
        }
      : {}),
    ...style
  };

  const railStyles: CSSProperties = {
    alignItems: "stretch",
    background: isFloating ? floatingContainerBackground : stickyBackground,
    borderRadius: isFloating ? floatingContainerRadius : undefined,
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    ...(isFloating
      ? {
          padding: `${floatingContainerPaddingBlock} ${floatingContainerPaddingInlineEnd} ${floatingContainerPaddingBlock} ${floatingContainerPaddingInlineStart}`
        }
      : {})
  };

  const homeIndicatorStyles: CSSProperties = {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    padding: isFloating ? "10px 0 8px" : "12px 0 8px",
    width: "100%"
  };

  function selectValue(nextValue: string) {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    if (!items.length) {
      return;
    }

    const selectedIndex = items.findIndex((item) => item.value === selectedValue && !item.disabled);
    const currentIndex = selectedIndex >= 0 ? selectedIndex : index;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = getNextEnabledIndex(items, currentIndex, 1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;

      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = getNextEnabledIndex(items, currentIndex, -1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;

      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      const nextValue = getDefaultValue(items);
      const nextIndex = nextValue ? items.findIndex((item) => item.value === nextValue) : -1;

      if (nextIndex >= 0 && nextValue) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextValue);
      }
    }

    if (event.key === "End") {
      event.preventDefault();
      const nextIndex = [...items]
        .map((item, itemIndex) => ({ item, itemIndex }))
        .reverse()
        .find(({ item }) => !item.disabled)?.itemIndex;
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
  }

  return (
    <nav {...rest} aria-label={ariaLabel} className={className} style={rootStyles}>
      <div style={railStyles}>
        {items.map((item, index) => {
          const selected = item.value === selectedValue || (value === undefined && selectedValue === undefined && item.state === "Selected");
          const itemColor = resolveBottomNavBindingValue(
            brand,
            `item.color.${isFloating ? "floating" : "sticky"}.${selected ? "selected" : "rest"}`,
            selected
              ? brandTextColor
              : isFloating
                ? inverseTextColor
                : secondaryTextColor
          );
          const itemLabel = item.label ?? item.ariaLabel ?? item.value;
          const visualLabel = resolvedConfiguration === "Label + icon" ? itemLabel : null;

          return (
            <button
              key={item.value}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              aria-label={item.ariaLabel ?? (typeof itemLabel === "string" ? itemLabel : item.value)}
              aria-pressed={selected}
              disabled={item.disabled}
              onBlur={(event) => handleBlur(item.value, event)}
              onClick={() => {
                if (item.disabled) {
                  return;
                }

                selectValue(item.value);
              }}
              onFocus={(event) => handleFocus(item.value, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              tabIndex={selected || (!selectedValue && item.value === fallbackValue) ? 0 : -1}
              style={{
                alignItems: "center",
                appearance: "none",
                background: selected && isFloating ? floatingSelectedBackground : "transparent",
                border: "none",
                borderRadius: isFloating ? floatingItemRadius : 0,
                boxSizing: "border-box",
                color: itemColor,
                cursor: item.disabled ? "not-allowed" : "pointer",
                display: "flex",
                flex: "1 1 0",
                flexDirection: "column",
                gap: visualLabel ? itemContentGap : 0,
                justifyContent: "center",
                marginInlineEnd: isFloating ? `calc(${floatingItemOverlap} * -1)` : undefined,
                minHeight: itemHeight,
                minWidth: 0,
                opacity: item.disabled ? 0.4 : 1,
                outline: focusedValue === item.value ? `${focusOutlineWidth} solid ${focusOutlineColor}` : undefined,
                outlineOffset: focusedValue === item.value ? focusOutlineOffset : undefined,
                padding: 0,
                position: "relative",
                zIndex: selected && isFloating ? 1 : 0
              }}
              type="button"
            >
              {selected && !isFloating ? (
                <span
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(90deg, ${toTransparent(itemColor)} 0%, ${itemColor} 50%, ${toTransparent(itemColor)} 100%)`,
                    borderRadius: 999,
                    height: stickyIndicatorHeight,
                    left: "50%",
                    position: "absolute",
                    top: 0,
                    transform: "translateX(-50%)",
                    width: stickyIndicatorWidth
                  }}
                />
              ) : null}
              {renderItemIcon({
                brand,
                color: itemColor,
                icon: item.icon,
                iconName: item.iconName,
                size: itemIconSize
              })}
              {visualLabel ? (
                <span
                  style={{
                    color: itemColor,
                    display: "block",
                    fontFamily: labelFontFamily,
                    fontSize: labelFontSize,
                    fontWeight: labelFontWeight,
                    letterSpacing: labelLetterSpacing,
                    lineHeight: labelLineHeight,
                    overflow: "hidden",
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%"
                  }}
                >
                  {visualLabel}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {showHomeIndicator ? (
        <div style={homeIndicatorStyles}>
          <div
            aria-hidden="true"
            style={{
              background: homeIndicatorColor,
              borderRadius: 999,
              height: homeIndicatorHeight,
              opacity: homeIndicatorOpacity,
              width: homeIndicatorWidth
            }}
          />
        </div>
      ) : null}
    </nav>
  );
}
