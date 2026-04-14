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
import { Tag } from "./tag";

export const canonicalHorizontalTabWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.horizontalTab"
);

export type HorizontalTabSize = "Default" | "Small";
export type HorizontalTabItemState = "Rest" | "Hover" | "Pressed" | "Disabled";

export interface HorizontalTabItem {
  value: string;
  label?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  iconLeading?: boolean;
  iconTrailing?: boolean;
  leadingIcon?: ReactNode;
  leadingIconName?: IconName;
  trailingIcon?: ReactNode;
  trailingIconName?: IconName;
  state?: HorizontalTabItemState;
  tag?: boolean;
  tagLabel?: ReactNode;
}

export interface HorizontalTabProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  brand?: DisplayBrandId;
  items: HorizontalTabItem[];
  size?: HorizontalTabSize;
  inverse?: boolean;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

type ResolvedHorizontalTabState = "Rest" | "Hover" | "Pressed" | "Active" | "Disabled";

const DEFAULT_HORIZONTAL_TAB_ICON_NAME = "placeholder-generate-outline" satisfies IconName;

function getHorizontalTabToken(slot: string) {
  return canonicalHorizontalTabWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveHorizontalTabBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getHorizontalTabToken(slot);

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

function getFirstEnabledItemValue(items: HorizontalTabItem[], disabled: boolean) {
  return items.find((item) => !disabled && !item.disabled && item.state !== "Disabled")?.value;
}

function resolveItemLabel(item: HorizontalTabItem) {
  return item.label ?? item.ariaLabel ?? item.value;
}

function getResolvedState(
  selected: boolean,
  disabled: boolean,
  previewState: HorizontalTabItemState | undefined,
  hovered: boolean,
  pressed: boolean
): ResolvedHorizontalTabState {
  if (disabled || previewState === "Disabled") {
    return "Disabled";
  }

  if (selected) {
    return "Active";
  }

  if (pressed || previewState === "Pressed") {
    return "Pressed";
  }

  if (hovered || previewState === "Hover") {
    return "Hover";
  }

  return "Rest";
}

function findNextEnabledIndex(
  items: HorizontalTabItem[],
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

function renderTagLabel(brand: DisplayBrandId, label: ReactNode) {
  if (typeof label === "string" || typeof label === "number") {
    return <Tag brand={brand} label={String(label)} />;
  }

  return <Tag brand={brand}>{label}</Tag>;
}

/**
 * Token-bound horizontal tab navigation matching the canonical Figma light and inverse size matrices.
 */
export function HorizontalTab({
  brand = "Cars24",
  items,
  size = "Default",
  inverse = false,
  value,
  defaultValue,
  disabled = false,
  onValueChange,
  style,
  ...rest
}: HorizontalTabProps) {
  const initialValue = defaultValue ?? getFirstEnabledItemValue(items, disabled);
  const [internalValue, setInternalValue] = useState<string | undefined>(initialValue);
  const [focusedValue, setFocusedValue] = useState<string | undefined>(undefined);
  const [hoveredValue, setHoveredValue] = useState<string | undefined>(undefined);
  const [pressedValue, setPressedValue] = useState<string | undefined>(undefined);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : internalValue;
  const fallbackValue = getFirstEnabledItemValue(items, disabled);

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

  const borderWidth = toPx(resolveHorizontalTabBindingValue(brand, "container.border.width", "1"));
  const activeBorderWidth = toPx(resolveHorizontalTabBindingValue(brand, "item.border.activeWidth", "2"));
  const contentGap = toPx(resolveHorizontalTabBindingValue(brand, "item.contentGap", "8"));
  const iconSize = Number(resolveHorizontalTabBindingValue(brand, "item.icon.size", "16"));
  const paddingInline = toPx(resolveHorizontalTabBindingValue(brand, "item.paddingInline", "10"));
  const paddingTop = toPx(
    resolveHorizontalTabBindingValue(
      brand,
      size === "Small" ? "item.small.paddingTop" : "item.default.paddingTop",
      size === "Small" ? "6" : "10"
    )
  );
  const paddingBottom = toPx(
    resolveHorizontalTabBindingValue(
      brand,
      size === "Small" ? "item.small.paddingBottom" : "item.default.paddingBottom",
      size === "Small" ? "10" : "14"
    )
  );
  const fontFamily = resolveHorizontalTabBindingValue(
    brand,
    "item.typography.fontFamily",
    String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
  );
  const fontWeight = Number(
    resolveHorizontalTabBindingValue(
      brand,
      "item.typography.fontWeight",
      String(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"))
    )
  );
  const fontSize = toPx(
    resolveHorizontalTabBindingValue(
      brand,
      size === "Small" ? "item.typography.small.fontSize" : "item.typography.default.fontSize",
      size === "Small" ? "14" : "16"
    )
  );
  const lineHeight = toPx(
    resolveHorizontalTabBindingValue(
      brand,
      size === "Small" ? "item.typography.small.lineHeight" : "item.typography.default.lineHeight",
      size === "Small" ? "18" : "20"
    )
  );
  const letterSpacing = toPx(
    resolveHorizontalTabBindingValue(
      brand,
      size === "Small" ? "item.typography.small.letterSpacing" : "item.typography.default.letterSpacing",
      "0"
    )
  );
  const focusOutlineWidth = toPx(resolveHorizontalTabBindingValue(brand, "item.focus.outlineWidth", "2"));
  const focusOutlineOffset = toPx(resolveHorizontalTabBindingValue(brand, "item.focus.outlineOffset", "2"));
  const focusOutlineColor = resolveHorizontalTabBindingValue(
    brand,
    "item.focus.outlineColor",
    String(getRequiredThemeTokenValue(brand, "color.border.focus"))
  );

  function getItemBorderColor(state: ResolvedHorizontalTabState) {
    const themeKey = inverse ? "dark" : "light";
    const stateKey =
      state === "Active"
        ? "active"
        : state === "Hover"
          ? "hover"
          : state === "Pressed"
            ? "pressed"
            : state === "Disabled"
              ? "disabled"
              : "rest";

    return resolveHorizontalTabBindingValue(
      brand,
      `item.border.${themeKey}.${stateKey}`,
      inverse
        ? state === "Active"
          ? "#E2E8F0"
          : state === "Disabled"
            ? "rgba(255,255,255,0.3)"
            : state === "Hover" || state === "Pressed"
              ? "rgba(255,255,255,0.75)"
              : "rgba(255,255,255,0.5)"
        : state === "Active"
          ? "#4736FE"
          : state === "Pressed"
            ? "#94A3B8"
            : "#CBD5E1"
    );
  }

  function getItemTextColor(state: ResolvedHorizontalTabState) {
    const themeKey = inverse ? "dark" : "light";
    const stateKey =
      state === "Active"
        ? "active"
        : state === "Hover"
          ? "hover"
          : state === "Pressed"
            ? "pressed"
            : state === "Disabled"
              ? "disabled"
              : "rest";

    return resolveHorizontalTabBindingValue(
      brand,
      `item.text.${themeKey}.${stateKey}`,
      inverse
        ? "#FFFFFF"
        : state === "Active"
          ? "#4736FE"
          : state === "Hover"
            ? "#020617"
            : state === "Disabled"
              ? "#94A3B8"
              : "#64748B"
    );
  }

  function getItemTextOpacity(state: ResolvedHorizontalTabState) {
    if (!inverse) {
      return "1";
    }

    const stateKey =
      state === "Active"
        ? "active"
        : state === "Hover"
          ? "hover"
          : state === "Pressed"
            ? "pressed"
            : state === "Disabled"
              ? "disabled"
              : "rest";

    return resolveHorizontalTabBindingValue(
      brand,
      `item.text.dark.${stateKey}.opacity`,
      state === "Active" ? "1" : state === "Disabled" ? "0.3" : state === "Hover" || state === "Pressed" ? "0.8" : "0.5"
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
      const nextValue = getFirstEnabledItemValue(items, disabled);
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

  const containerBorderColor = resolveHorizontalTabBindingValue(
    brand,
    inverse ? "container.border.dark" : "container.border.light",
    inverse ? "rgba(255,255,255,0.5)" : "#CBD5E1"
  );

  return (
    <div
      {...rest}
      aria-disabled={disabled || undefined}
      role="tablist"
      aria-orientation="horizontal"
      style={{
        borderBottom: `${borderWidth} solid ${disabled ? getItemBorderColor("Disabled") : containerBorderColor}`,
        display: "inline-flex",
        width: "fit-content",
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
        const label = resolveItemLabel(item);
        const borderColor = getItemBorderColor(resolvedState);
        const textColor = getItemTextColor(resolvedState);
        const textOpacity = getItemTextOpacity(resolvedState);

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
            tabIndex={selected || (!resolvedValue && item.value === fallbackValue) ? 0 : -1}
            type="button"
            style={{
              appearance: "none",
              background: "transparent",
              border: "none",
              borderBottom: `${selected ? activeBorderWidth : borderWidth} solid ${borderColor}`,
              color: textColor,
              cursor: itemDisabled ? "not-allowed" : "pointer",
              display: "inline-flex",
              justifyContent: "center",
              marginBottom: `calc(${borderWidth} * -1)`,
              outline: focusedValue === item.value ? `${focusOutlineWidth} solid ${focusOutlineColor}` : undefined,
              outlineOffset: focusedValue === item.value ? focusOutlineOffset : undefined,
              padding: `${paddingTop} ${paddingInline} ${paddingBottom}`,
              position: "relative",
              transition: "border-color 120ms ease, color 120ms ease, opacity 120ms ease",
              whiteSpace: "nowrap"
            }}
          >
            <span
              style={{
                alignItems: "center",
                display: "inline-flex",
                gap: contentGap,
                justifyContent: "center",
                whiteSpace: "nowrap"
              }}
            >
              {item.iconLeading ? (
                <span
                  aria-hidden="true"
                  style={{
                    alignItems: "center",
                    color: textColor,
                    display: "inline-flex",
                    flexShrink: 0,
                    justifyContent: "center",
                    lineHeight: 0,
                    opacity: textOpacity
                  }}
                >
                  {renderDecorativeIcon({
                    brand,
                    color: textColor,
                    content: item.leadingIcon ?? item.leadingIconName ?? DEFAULT_HORIZONTAL_TAB_ICON_NAME,
                    size: iconSize <= 16 ? "sm" : "md"
                  })}
                </span>
              ) : null}
              <span
                style={{
                  color: textColor,
                  fontFamily: `${fontFamily}, sans-serif`,
                  fontSize,
                  fontWeight,
                  letterSpacing,
                  lineHeight,
                  opacity: textOpacity,
                  textAlign: "center",
                  whiteSpace: "nowrap"
                }}
              >
                {label}
              </span>
              {item.tag ? (
                <span aria-hidden="true" style={{ display: "inline-flex", flexShrink: 0 }}>
                  {renderTagLabel(brand, item.tagLabel ?? "Label")}
                </span>
              ) : null}
              {item.iconTrailing ? (
                <span
                  aria-hidden="true"
                  style={{
                    alignItems: "center",
                    color: textColor,
                    display: "inline-flex",
                    flexShrink: 0,
                    justifyContent: "center",
                    lineHeight: 0,
                    opacity: textOpacity
                  }}
                >
                  {renderDecorativeIcon({
                    brand,
                    color: textColor,
                    content: item.trailingIcon ?? item.trailingIconName ?? DEFAULT_HORIZONTAL_TAB_ICON_NAME,
                    size: iconSize <= 16 ? "sm" : "md"
                  })}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
