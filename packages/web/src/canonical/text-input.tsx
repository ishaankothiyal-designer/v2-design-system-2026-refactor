import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useId,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { Label } from "./label";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalTextInputWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.textInput"
);

export type TextInputSize = "Small" | "Large";
export type TextInputPreviewState =
  | "Rest"
  | "Hover"
  | "Active"
  | "Typing"
  | "Typed"
  | "Error"
  | "Success"
  | "Disabled";
export type TextInputValidationState = "Default" | "Error" | "Success";
export type TextInputHelperTone = "Default" | "Error" | "Success";

type FieldVisualState = "rest" | "hover" | "active" | "typed" | "error" | "success" | "disabled";

type TextInputSizeTokens = {
  affixBoxSize: number;
  containerGap: number;
  fieldGap: number;
  fieldPaddingBlock: number;
  fieldPaddingInline: number;
  height: number;
  helperGap: number;
  labelPaddingInline: number;
};

type TextInputTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type TextInputFieldColors = {
  affix: string;
  background: string;
  border: string;
  placeholder: string;
  value: string;
};

type TextInputHelperColors = {
  icon: string;
  text: string;
};

function getSizeKey(size: TextInputSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: TextInputSize) {
  return size === "Large" ? "Large" : "Medium";
}

function getFieldRadius(brand: DisplayBrandId, size: TextInputSize) {
  return Number(getRequiredThemeTokenValue(brand, size === "Large" ? "radius.alt.lg" : "radius.alt.md"));
}

function getSizeTokens(brand: DisplayBrandId, size: TextInputSize): TextInputSizeTokens {
  const tokenPrefix = `component.textInput.size.${getSizeKey(size)}`;

  return {
    affixBoxSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.affixBoxSize`)),
    containerGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.containerGap`)),
    fieldGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldGap`)),
    fieldPaddingBlock: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldPaddingBlock`)),
    fieldPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldPaddingInline`)),
    height: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.height`)),
    helperGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.helperGap`)),
    labelPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.labelPaddingInline`))
  };
}

function getTypography(brand: DisplayBrandId, path: string): TextInputTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${path}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${path}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${path}.lineHeight`))
  };
}

function getFieldColors(brand: DisplayBrandId, state: FieldVisualState): TextInputFieldColors {
  const tokenPrefix = `component.textInput.color.field.${state}`;

  return {
    affix: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.affix`)),
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    placeholder: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.placeholder`)),
    value: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.value`))
  };
}

function getHelperColors(brand: DisplayBrandId, tone: TextInputHelperTone): TextInputHelperColors {
  const toneKey = tone === "Error" ? "error" : tone === "Success" ? "success" : "default";
  const tokenPrefix = `component.textInput.color.helper.${toneKey}`;

  return {
    icon: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.icon`)),
    text: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.text`))
  };
}

function resolveVisualState({
  disabled,
  focused,
  forceState,
  hovered,
  hasValue,
  validationState
}: {
  disabled: boolean;
  focused: boolean;
  forceState: TextInputPreviewState | undefined;
  hovered: boolean;
  hasValue: boolean;
  validationState: TextInputValidationState;
}): FieldVisualState {
  if (forceState === "Disabled") {
    return "disabled";
  }

  if (forceState === "Error") {
    return "error";
  }

  if (forceState === "Success") {
    return "success";
  }

  if (forceState === "Hover") {
    return "hover";
  }

  if (forceState === "Active" || forceState === "Typing") {
    return "active";
  }

  if (forceState === "Typed") {
    return "typed";
  }

  if (forceState === "Rest") {
    return "rest";
  }

  if (disabled) {
    return "disabled";
  }

  if (validationState === "Error") {
    return "error";
  }

  if (validationState === "Success") {
    return "success";
  }

  if (focused) {
    return "active";
  }

  if (hovered) {
    return "hover";
  }

  if (hasValue) {
    return "typed";
  }

  return "rest";
}

function makeTypographyStyles({
  brand,
  color,
  fontWeightPath,
  typography
}: {
  brand: DisplayBrandId;
  color: string;
  fontWeightPath: string;
  typography: TextInputTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`,
    margin: 0
  };
}

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "size" | "value"> {
  brand?: DisplayBrandId;
  defaultValue?: string;
  forceState?: TextInputPreviewState;
  helperText?: ReactNode;
  helperTone?: TextInputHelperTone;
  label?: ReactNode;
  prefixIconName?: IconName;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: TextInputSize;
  suffixIconName?: IconName;
  validationState?: TextInputValidationState;
  value?: string;
}

export function TextInput({
  brand = "Cars24",
  defaultValue,
  disabled = false,
  forceState,
  helperText,
  helperTone,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  placeholder = "Placeholder text",
  prefixIconName,
  required = false,
  showHelperIcon = true,
  showLabelInfoIcon = true,
  size = "Small",
  style,
  suffixIconName,
  type = "text",
  validationState = "Default",
  value,
  ...rest
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? `text-input-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const sanitizedId = generatedId.replace(/[^a-zA-Z0-9_-]/g, "");
  const placeholderClassName = `geist-text-input-${sanitizedId}`;
  const caretKeyframesName = `geist-text-input-caret-blink-${sanitizedId}`;
  const previewCaretClassName = `geist-text-input-caret-${sanitizedId}`;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");

  const currentValue = value ?? uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const sizeKey = getSizeKey(size);
  const sizeTokens = getSizeTokens(brand, size);
  const inputTypography = getTypography(brand, `component.textInput.typography.input.${sizeKey}`);
  const helperTypography = getTypography(brand, `component.textInput.typography.helper.${sizeKey}`);
  const visualState = resolveVisualState({
    disabled,
    focused,
    forceState,
    hovered,
    hasValue,
    validationState
  });
  const fieldColors = getFieldColors(brand, visualState);
  const resolvedHelperTone =
    forceState === "Error"
      ? "Error"
      : forceState === "Success"
        ? "Success"
        : helperTone ?? validationState;
  const helperColors = getHelperColors(brand, resolvedHelperTone);
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.border.width"));
  const fieldRadius = getFieldRadius(brand, size);
  const affixIconSize = Number(getRequiredThemeTokenValue(brand, "component.textInput.icon.affixSize"));
  const helperIconSize = Number(getRequiredThemeTokenValue(brand, "component.textInput.icon.helperSize"));
  const caretWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.caret.width"));
  const caretGap = Number(getRequiredThemeTokenValue(brand, "component.textInput.caret.gap"));
  const labelSize = getLabelSize(size);
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const previewMode = forceState !== undefined;
  const previewShowsCaret = forceState === "Active" || forceState === "Typing";
  const helperIconName =
    resolvedHelperTone === "Error"
      ? "error-outline"
      : resolvedHelperTone === "Success"
        ? "circle-check-line"
        : "info-outline";
  const inputColor = hasValue ? fieldColors.value : fieldColors.placeholder;
  const inputFontWeightPath = hasValue ? "typography.fontWeight.medium" : "typography.fontWeight.regular";
  const previewTextValue = currentValue || placeholder;
  const previewHasValue = currentValue.length > 0;
  const previewTextColor = previewHasValue ? fieldColors.value : fieldColors.placeholder;
  const previewTextFontWeightPath = previewHasValue
    ? "typography.fontWeight.medium"
    : "typography.fontWeight.regular";
  const ariaInvalid = visualState === "error" ? true : undefined;

  const fieldStyles: CSSProperties = {
    alignItems: "center",
    background: fieldColors.background,
    border: `${borderWidth}px solid ${fieldColors.border}`,
    borderRadius: `${fieldRadius}px`,
    boxSizing: "border-box",
    display: "flex",
    gap: `${sizeTokens.fieldGap}px`,
    height: `${sizeTokens.height}px`,
    minWidth: 0,
    padding: `${sizeTokens.fieldPaddingBlock}px ${sizeTokens.fieldPaddingInline}px`,
    width: "100%"
  };

  const affixStyles: CSSProperties = {
    alignItems: "center",
    color: fieldColors.affix,
    display: "inline-flex",
    flex: "0 0 auto",
    height: `${sizeTokens.affixBoxSize}px`,
    justifyContent: "center",
    width: `${sizeTokens.affixBoxSize}px`
  };

  const actualInputStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: inputColor,
      fontWeightPath: inputFontWeightPath,
      typography: inputTypography
    }),
    appearance: "none",
    background: "transparent",
    border: "none",
    caretColor: visualState === "active" ? fieldColors.border : fieldColors.value,
    flex: "1 1 auto",
    minWidth: 0,
    outline: "none",
    padding: 0
  };

  const helperTextStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: helperColors.text,
      fontWeightPath: "typography.fontWeight.regular",
      typography: helperTypography
    }),
    minWidth: 0
  };

  const previewTextStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: previewTextColor,
      fontWeightPath: previewTextFontWeightPath,
      typography: inputTypography
    }),
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(true);
    onMouseEnter?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
  }

  function handleMouseLeave(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(false);
    onMouseLeave?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
  }

  const labelNode = (
    <Label
      brand={brand}
      label={label}
      required={required}
      showInfoIcon={showLabelInfoIcon}
      size={labelSize}
    />
  );

  return (
    <div
      style={{
        display: "grid",
        gap: `${sizeTokens.containerGap}px`,
        width: "100%",
        ...style
      }}
    >
      <style>{`
        .${placeholderClassName}::placeholder{color:${fieldColors.placeholder};opacity:1;}
        @keyframes ${caretKeyframesName}{
          0%,49%{opacity:1;}
          50%,100%{opacity:0;}
        }
        .${previewCaretClassName}{
          animation:${caretKeyframesName} 1s steps(1, end) infinite;
        }
      `}</style>

      {showLabel ? (
        previewMode ? (
          <div
            style={{
              display: "block",
              paddingInline: `${sizeTokens.labelPaddingInline}px`
            }}
          >
            {labelNode}
          </div>
        ) : (
          <label
            htmlFor={inputId}
            style={{
              display: "block",
              paddingInline: `${sizeTokens.labelPaddingInline}px`
            }}
          >
            {labelNode}
          </label>
        )
      ) : null}

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={fieldStyles}>
        {prefixIconName ? (
          <span style={affixStyles}>
            <Icon decorative brand={brand} name={prefixIconName} style={{ fontSize: `${affixIconSize}px` }} />
          </span>
        ) : null}

        {previewMode ? (
          <div
            aria-hidden="true"
            style={{
              alignItems: "center",
              display: "flex",
              flex: "1 1 auto",
              minWidth: 0
            }}
          >
            <span style={previewTextStyles}>{previewTextValue}</span>
            {previewShowsCaret ? (
              <span
                className={previewCaretClassName}
                style={{
                  background: fieldColors.border,
                  display: "inline-block",
                  flexShrink: 0,
                  height: `${Math.max(sizeTokens.affixBoxSize, inputTypography.lineHeight)}px`,
                  marginLeft: `${caretGap}px`,
                  width: `${caretWidth}px`
                }}
              />
            ) : null}
          </div>
        ) : (
          <input
            {...rest}
            aria-describedby={showHelper ? helperId : undefined}
            aria-invalid={ariaInvalid}
            className={placeholderClassName}
            disabled={disabled}
            id={inputId}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            style={actualInputStyles}
            type={type}
            value={currentValue}
          />
        )}

        {suffixIconName ? (
          <span style={affixStyles}>
            <Icon decorative brand={brand} name={suffixIconName} style={{ fontSize: `${affixIconSize}px` }} />
          </span>
        ) : null}
      </div>

      {showHelper ? (
        <div
          id={showHelper && !previewMode ? helperId : undefined}
          style={{
            alignItems: "flex-start",
            display: "flex",
            gap: `${sizeTokens.helperGap}px`,
            minWidth: 0,
            paddingInline: `${sizeTokens.labelPaddingInline}px`
          }}
        >
          {showHelperIcon ? (
            <Icon
              decorative
              brand={brand}
              name={helperIconName}
              style={{
                color: helperColors.icon,
                flex: "0 0 auto",
                fontSize: `${helperIconSize}px`
              }}
            />
          ) : null}
          <span style={helperTextStyles}>{helperText}</span>
        </div>
      ) : null}
    </div>
  );
}
