import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  useId,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalSwitchWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.switch"
);

export type SwitchSize = "Default" | "Small";

type SwitchSizeTokens = {
  padding: number;
  thumbSize: number;
  thumbTranslateX: number;
  trackHeight: number;
  trackWidth: number;
};

type SwitchColors = {
  thumb: string;
  track: string;
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

function getSizeKey(size: SwitchSize) {
  return size === "Small" ? "sm" : "default";
}

function getSizeTokens(brand: DisplayBrandId, size: SwitchSize): SwitchSizeTokens {
  const tokenPrefix = `component.switch.size.${getSizeKey(size)}`;

  return {
    padding: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.padding`)),
    thumbSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.thumbSize`)),
    thumbTranslateX: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.thumbTranslateX`)),
    trackHeight: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.trackHeight`)),
    trackWidth: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.trackWidth`))
  };
}

function getColors({
  brand,
  checked,
  disabled
}: {
  brand: DisplayBrandId;
  checked: boolean;
  disabled: boolean;
}): SwitchColors {
  const tokenPrefix = disabled
    ? checked
      ? "component.switch.color.disabled.selected"
      : "component.switch.color.disabled.rest"
    : checked
      ? "component.switch.color.selected"
      : "component.switch.color.rest";

  return {
    thumb: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.thumb`)),
    track: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.track`))
  };
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  brand?: DisplayBrandId;
  size?: SwitchSize;
}

export function Switch({
  brand = "Cars24",
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  id,
  onBlur,
  onChange,
  onFocus,
  size = "Default",
  style,
  ...rest
}: SwitchProps) {
  const generatedId = useId();
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));

  const isCheckedControlled = checked !== undefined;
  const resolvedChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
  const resolvedId = id ?? generatedId;

  const sizeTokens = getSizeTokens(brand, size);
  const colors = getColors({
    brand,
    checked: resolvedChecked,
    disabled
  });
  const borderRadius = Number(getRequiredThemeTokenValue(brand, "radius.pill"));
  const thumbShadow = String(getRequiredThemeTokenValue(brand, "component.switch.thumb.shadow"));
  const focusOutlineWidth = Number(
    getRequiredThemeTokenValue(brand, "component.switch.focus.outlineWidth")
  );
  const focusOutlineOffset = Number(
    getRequiredThemeTokenValue(brand, "component.switch.focus.outlineOffset")
  );
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));

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
        checked={resolvedChecked}
        disabled={disabled}
        id={resolvedId}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        role="switch"
        style={VISUALLY_HIDDEN_INPUT_STYLES}
        type="checkbox"
      />

      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: colors.track,
          borderRadius,
          boxSizing: "border-box",
          display: "inline-flex",
          height: sizeTokens.trackHeight,
          outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : undefined,
          outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
          padding: sizeTokens.padding,
          width: sizeTokens.trackWidth
        }}
      >
        <span
          style={{
            background: colors.thumb,
            borderRadius,
            boxShadow: thumbShadow,
            display: "block",
            flexShrink: 0,
            height: sizeTokens.thumbSize,
            transform: resolvedChecked
              ? `translateX(${sizeTokens.thumbTranslateX}px)`
              : undefined,
            width: sizeTokens.thumbSize
          }}
        />
      </span>
    </label>
  );
}
