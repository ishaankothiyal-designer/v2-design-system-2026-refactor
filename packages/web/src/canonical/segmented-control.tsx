import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import { designSystemRegistry } from "@geist/contracts";
import type { DisplayBrandId } from "@geist/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import {
  SegmentButton,
  type SegmentButtonPreviewState,
  type SegmentButtonSelectionColor
} from "./segment-button";

export const canonicalSegmentedControlWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.segmentedControl"
);

export type SegmentedControlSize = "Default" | "Large";
export type SegmentedControlType = "Label" | "Icon";

export interface SegmentedControlItem {
  value: string;
  label?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  iconName?: IconName;
  icon?: ReactNode;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  brand?: DisplayBrandId;
  items: SegmentedControlItem[];
  size?: SegmentedControlSize;
  type?: SegmentedControlType;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  selectionColor?: SegmentButtonSelectionColor;
  forceState?: SegmentButtonPreviewState;
  onValueChange?: (value: string) => void;
}

function getSegmentedControlToken(slot: string) {
  return canonicalSegmentedControlWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveSegmentedControlBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getSegmentedControlToken(slot);

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
  return tokenValueToRem(value);
}

function getFirstEnabledItemValue(items: SegmentedControlItem[], disabled: boolean) {
  return items.find((item) => !disabled && !item.disabled)?.value;
}

function resolveItemLabel(item: SegmentedControlItem) {
  return item.label ?? item.ariaLabel ?? item.value;
}

function findNextEnabledIndex(
  items: SegmentedControlItem[],
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

    if (!disabled && item && !item.disabled) {
      return index;
    }
  }

  return -1;
}

/**
 * Token-bound segmented control matching the canonical Figma label and icon matrices.
 */
export function SegmentedControl({
  brand = "Cars24",
  items,
  size = "Default",
  type = "Label",
  value,
  defaultValue,
  disabled = false,
  selectionColor = "White",
  forceState = "Default",
  onValueChange,
  style,
  ...rest
}: SegmentedControlProps) {
  const initialValue = defaultValue ?? getFirstEnabledItemValue(items, disabled);
  const [internalValue, setInternalValue] = useState<string | undefined>(initialValue);
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

  const groupBackground = resolveSegmentedControlBindingValue(brand, "group.background", "#F1F5F9");
  const groupGap = toPx(
    resolveSegmentedControlBindingValue(
      brand,
      "group.gap",
      "2"
    )
  );
  const groupPadding = toPx(resolveSegmentedControlBindingValue(brand, "group.padding", "4"));
  const groupRadius = toPx(resolveSegmentedControlBindingValue(brand, "group.radius", "999"));

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

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(items, disabled, currentIndex, 1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;

      if (nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = findNextEnabledIndex(items, disabled, currentIndex, -1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;

      if (nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      const currentItem = items[index];

      if (currentItem && !currentItem.disabled) {
        selectValue(currentItem.value);
      }
    }
  }

  return (
    <div
      {...rest}
      aria-disabled={disabled || undefined}
      role="radiogroup"
      style={{
        alignItems: "center",
        background: groupBackground,
        borderRadius: groupRadius,
        display: "inline-flex",
        gap: groupGap,
        padding: groupPadding,
        width: "fit-content",
        ...style
      }}
    >
      {items.map((item, index) => {
        const isItemDisabled = disabled || Boolean(item.disabled);
        const isSelected = item.value === resolvedValue;
        const resolvedLabel = resolveItemLabel(item);

        return (
          <SegmentButton
            key={item.value}
            ref={(node: HTMLButtonElement | null) => {
              buttonRefs.current[index] = node;
            }}
            aria-checked={isSelected}
            aria-label={typeof resolvedLabel === "string" ? resolvedLabel : item.ariaLabel ?? item.value}
            brand={brand}
            disabled={isItemDisabled}
            forceState={!isSelected ? forceState : "Default"}
            icon={item.icon}
            iconName={item.iconName}
            label={resolvedLabel}
            onClick={() => {
              if (!isItemDisabled) {
                selectValue(item.value);
              }
            }}
            onKeyDown={(event) => handleKeyDown(index, event)}
            role="radio"
            selected={isSelected}
            selectionColor={selectionColor}
            size={size}
            style={{
              flex: type === "Label" ? "1 1 0" : undefined,
              minWidth: type === "Label" ? 1 : undefined,
              width: type === "Label" ? "100%" : undefined
            }}
            tabIndex={
              isItemDisabled ? -1 : item.value === resolvedValue || (!resolvedValue && index === 0) ? 0 : -1
            }
            type={type === "Label" ? "Text" : "Icon"}
          />
        );
      })}
    </div>
  );
}
