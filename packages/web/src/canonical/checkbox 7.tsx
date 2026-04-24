import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalCheckboxWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.checkbox"
);

export type CheckboxSize = "Small" | "Medium" | "Large" | "Extra Large";

type CheckboxSizeTokens = {
  borderWidth: number;
  boxSize: number;
  disabledCheckedBorderWidth: number;
  iconSize: number;
};

type CheckboxVisualColors = {
  background: string;
  border: string;
  foreground: string;
};

const VISUALLY_HIDDEN_INPUT_STYLES: CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1
};

function getSizeKey(size: CheckboxSize) {
  if (size === "Extra Large") {
    return "xl";
  }

  if (size === "Large") {
    return "lg";
  }

  if (size === "Medium") {
    return "md";
  }

  return "sm";
}

function getSizeTokens(brand: DisplayBrandId, size: CheckboxSize): CheckboxSizeTokens {
  const tokenPrefix = `component.checkbox.size.${getSizeKey(size)}`;

  return {
    borderWidth: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.borderWidth`)),
    boxSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.boxSize`)),
    disabledCheckedBorderWidth: Number(
      getRequiredThemeTokenValue(brand, `${tokenPrefix}.disabledCheckedBorderWidth`)
    ),
    iconSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.iconSize`))
  };
}

function getBorderRadius(brand: DisplayBrandId, size: CheckboxSize) {
  const radiusTokenPath =
    size === "Extra Large"
      ? "radius.alt.sm"
      : "radius.alt.xs";

  return Number(getRequiredThemeTokenValue(brand, radiusTokenPath));
}

function getVisualColors({
  brand,
  checked,
  disabled,
  size
}: {
  brand: DisplayBrandId;
  checked: boolean;
  disabled: boolean;
  size: CheckboxSize;
}): CheckboxVisualColors {
  if (disabled) {
    if (checked && size === "Extra Large") {
      return {
        background: String(
          getRequiredThemeTokenValue(brand, "component.checkbox.color.disabled.rest.background")
        ),
        border: String(
          getRequiredThemeTokenValue(brand, "component.checkbox.color.disabled.rest.border")
        ),
        foreground: String(
          getRequiredThemeTokenValue(brand, "component.checkbox.color.disabled.checked.foreground")
        )
      };
    }

    const tokenPrefix = checked ? "component.checkbox.color.disabled.checked" : "component.checkbox.color.disabled.rest";

    return {
      background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
      border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
      foreground: checked
        ? String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`))
        : "transparent"
    };
  }

  const tokenPrefix = checked ? "component.checkbox.color.checked" : "component.checkbox.color.rest";

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    foreground: checked
      ? String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`))
      : "transparent"
  };
}

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  brand?: DisplayBrandId;
  defaultIndeterminate?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
}

export function Checkbox({
  brand = "Cars24",
  checked,
  className,
  defaultChecked = false,
  defaultIndeterminate = false,
  disabled = false,
  id,
  indeterminate,
  onBlur,
  onChange,
  onFocus,
  size = "Small",
  style,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const [internalIndeterminate, setInternalIndeterminate] = useState(Boolean(defaultIndeterminate));

  const isCheckedControlled = checked !== undefined;
  const isIndeterminateControlled = indeterminate !== undefined;
  const resolvedChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
  const resolvedIndeterminate = isIndeterminateControlled
    ? Boolean(indeterminate)
    : internalIndeterminate;
  const showMixedState = resolvedIndeterminate;
  const showSelectedState = resolvedChecked || showMixedState;
  const resolvedId = id ?? generatedId;

  const sizeTokens = getSizeTokens(brand, size);
  const borderRadius = getBorderRadius(brand, size);
  const colors = getVisualColors({
    brand,
    checked: showSelectedState,
    disabled,
    size
  });
  const focusOutlineWidth = Number(
    getRequiredThemeTokenValue(brand, "component.checkbox.focus.outlineWidth")
  );
  const focusOutlineOffset = Number(
    getRequiredThemeTokenValue(brand, "component.checkbox.focus.outlineOffset")
  );
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const borderWidth =
    disabled && showSelectedState
      ? sizeTokens.disabledCheckedBorderWidth
      : showSelectedState
        ? 0
        : sizeTokens.borderWidth;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = showMixedState;
    }
  }, [showMixedState]);

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isCheckedControlled) {
      setInternalChecked(event.currentTarget.checked);
    }

    if (!isIndeterminateControlled) {
      setInternalIndeterminate(false);
    }

    onChange?.(event);
  }

  return (
    <label
      className={className}
      htmlFor={resolvedId}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        lineHeight: 0,
        position: "relative",
        verticalAlign: "top",
        ...style
      }}
    >
      <input
        {...rest}
        ref={inputRef}
        aria-checked={showMixedState ? "mixed" : undefined}
        checked={resolvedChecked}
        disabled={disabled}
        id={resolvedId}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        style={VISUALLY_HIDDEN_INPUT_STYLES}
        type="checkbox"
      />

      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: colors.background,
          border: `${borderWidth}px solid ${colors.border}`,
          borderRadius,
          boxSizing: "border-box",
          color: colors.foreground,
          display: "inline-flex",
          height: sizeTokens.boxSize,
          justifyContent: "center",
          outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : undefined,
          outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
          width: sizeTokens.boxSize
        }}
      >
        {showMixedState ? (
          <Icon
            decorative
            name="minus-large-filled"
            style={{
              color: colors.foreground,
              fontSize: sizeTokens.iconSize
            }}
          />
        ) : resolvedChecked ? (
          <Icon
            decorative
            name="checkmark-1-filled"
            style={{
              color: colors.foreground,
              fontSize: sizeTokens.iconSize
            }}
          />
        ) : null}
      </span>
    </label>
  );
}
