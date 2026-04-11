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
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalRadioWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.radio"
);

export type RadioSize = "Small" | "Medium";

type RadioSizeTokens = {
  borderWidth: number;
  boxSize: number;
  disabledSelectedBorderWidth: number;
  dotSize: number;
  selectedBorderWidth: number;
};

type RadioVisualColors = {
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

function getSizeKey(size: RadioSize) {
  return size === "Medium" ? "md" : "sm";
}

function getSizeTokens(brand: DisplayBrandId, size: RadioSize): RadioSizeTokens {
  const tokenPrefix = `component.radio.size.${getSizeKey(size)}`;

  return {
    borderWidth: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.borderWidth`)),
    boxSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.boxSize`)),
    disabledSelectedBorderWidth: Number(
      getRequiredThemeTokenValue(brand, `${tokenPrefix}.disabledSelectedBorderWidth`)
    ),
    dotSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.dotSize`)),
    selectedBorderWidth: Number(
      getRequiredThemeTokenValue(brand, `${tokenPrefix}.selectedBorderWidth`)
    )
  };
}

function getVisualColors({
  brand,
  checked,
  disabled
}: {
  brand: DisplayBrandId;
  checked: boolean;
  disabled: boolean;
}): RadioVisualColors {
  const tokenPrefix = disabled
    ? checked
      ? "component.radio.color.disabled.selected"
      : "component.radio.color.disabled.rest"
    : checked
      ? "component.radio.color.selected"
      : "component.radio.color.rest";

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    foreground: checked
      ? String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.foreground`))
      : "transparent"
  };
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  brand?: DisplayBrandId;
  size?: RadioSize;
}

export function Radio({
  brand = "Cars24",
  checked,
  className,
  defaultChecked = false,
  disabled = false,
  id,
  onBlur,
  onChange,
  onFocus,
  size = "Small",
  style,
  ...rest
}: RadioProps) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));

  const isCheckedControlled = checked !== undefined;
  const resolvedChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
  const resolvedId = id ?? generatedId;

  const sizeTokens = getSizeTokens(brand, size);
  const colors = getVisualColors({
    brand,
    checked: resolvedChecked,
    disabled
  });
  const borderRadius = Number(getRequiredThemeTokenValue(brand, "radius.pill"));
  const focusOutlineWidth = Number(getRequiredThemeTokenValue(brand, "component.radio.focus.outlineWidth"));
  const focusOutlineOffset = Number(
    getRequiredThemeTokenValue(brand, "component.radio.focus.outlineOffset")
  );
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const borderWidth = resolvedChecked
    ? disabled
      ? sizeTokens.disabledSelectedBorderWidth
      : sizeTokens.selectedBorderWidth
    : sizeTokens.borderWidth;

  useEffect(() => {
    if (isCheckedControlled) {
      return;
    }

    function syncCheckedState() {
      setInternalChecked(Boolean(inputRef.current?.checked));
    }

    syncCheckedState();
    document.addEventListener("change", syncCheckedState);

    return () => {
      document.removeEventListener("change", syncCheckedState);
    };
  }, [isCheckedControlled]);

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
        ref={inputRef}
        checked={resolvedChecked}
        disabled={disabled}
        id={resolvedId}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        style={VISUALLY_HIDDEN_INPUT_STYLES}
        type="radio"
      />

      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: colors.background,
          border: `${borderWidth}px solid ${colors.border}`,
          borderRadius,
          boxSizing: "border-box",
          display: "inline-flex",
          height: sizeTokens.boxSize,
          justifyContent: "center",
          outline: focused ? `${focusOutlineWidth}px solid ${focusColor}` : undefined,
          outlineOffset: focused ? `${focusOutlineOffset}px` : undefined,
          width: sizeTokens.boxSize
        }}
      >
        {resolvedChecked ? (
          <span
            style={{
              background: colors.foreground,
              borderRadius,
              display: "block",
              height: sizeTokens.dotSize,
              width: sizeTokens.dotSize
            }}
          />
        ) : null}
      </span>
    </label>
  );
}
