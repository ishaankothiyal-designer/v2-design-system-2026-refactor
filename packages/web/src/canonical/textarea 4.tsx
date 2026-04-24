import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
  useId,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalTextareaWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.textarea"
);

export type TextareaSize = "Small" | "Large";
export type TextareaPreviewState = "Rest" | "Hover" | "Typing" | "Typed" | "Disabled";

type FieldVisualState = "rest" | "hover" | "active" | "typed" | "disabled";

type TextareaSizeTokens = {
  containerGap: number;
  fieldPaddingBlock: number;
  fieldPaddingInline: number;
  helperGap: number;
  labelPaddingInline: number;
};

type TextareaTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type TextareaFieldColors = {
  background: string;
  border: string;
  placeholder: string;
  value: string;
};

type TextareaHelperColors = {
  counter: string;
  icon: string;
  text: string;
};

const TEXTAREA_MIN_HEIGHT = 80;
const TEXTAREA_MAX_HEIGHT = 120;

function getSizeKey(size: TextareaSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: TextareaSize) {
  return size === "Large" ? "Large" : "Medium";
}

function getFieldRadius(brand: DisplayBrandId, size: TextareaSize) {
  return Number(getRequiredThemeTokenValue(brand, size === "Large" ? "radius.alt.lg" : "radius.alt.md"));
}

function getSizeTokens(brand: DisplayBrandId, size: TextareaSize): TextareaSizeTokens {
  const tokenPrefix = `component.textInput.size.${getSizeKey(size)}`;

  return {
    containerGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.containerGap`)),
    fieldPaddingBlock: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldPaddingBlock`)),
    fieldPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldPaddingInline`)),
    helperGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.helperGap`)),
    labelPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.labelPaddingInline`))
  };
}

function getInputTypography(brand: DisplayBrandId, size: TextareaSize): TextareaTypography {
  const sizeKey = getSizeKey(size);

  return {
    fontSize: Number(
      getRequiredThemeTokenValue(brand, size === "Large" ? "typography.fontSize.md" : "typography.fontSize.sm")
    ),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.input.${sizeKey}.letterSpacing`)),
    lineHeight: Number(
      getRequiredThemeTokenValue(brand, size === "Large" ? "typography.lineHeight.md" : "typography.lineHeight.sm")
    )
  };
}

function getHelperTypography(brand: DisplayBrandId, size: TextareaSize): TextareaTypography {
  const sizeKey = getSizeKey(size);

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.helper.${sizeKey}.fontSize`)),
    letterSpacing: Number(
      getRequiredThemeTokenValue(brand, `component.textInput.typography.helper.${sizeKey}.letterSpacing`)
    ),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.helper.${sizeKey}.lineHeight`))
  };
}

function getCounterTypography(brand: DisplayBrandId): TextareaTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, "component.textInput.typography.helper.sm.fontSize")),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, "component.textInput.typography.helper.sm.letterSpacing")),
    lineHeight: Number(getRequiredThemeTokenValue(brand, "component.textInput.typography.helper.sm.lineHeight"))
  };
}

function getFieldColors(brand: DisplayBrandId, state: FieldVisualState): TextareaFieldColors {
  const restPrefix = "component.textInput.color.field.rest";

  if (state === "hover") {
    return {
      background: String(getRequiredThemeTokenValue(brand, `${restPrefix}.background`)),
      border: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.border")),
      placeholder: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.placeholder")),
      value: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.value"))
    };
  }

  if (state === "active") {
    return {
      background: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.active.background")),
      border: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.active.border")),
      placeholder: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.active.placeholder")),
      value: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.active.value"))
    };
  }

  if (state === "typed") {
    return {
      background: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.typed.background")),
      border: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.typed.border")),
      placeholder: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.typed.placeholder")),
      value: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.typed.value"))
    };
  }

  if (state === "disabled") {
    return {
      background: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.background")),
      border: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.border")),
      placeholder: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.placeholder")),
      value: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.value"))
    };
  }

  return {
    background: String(getRequiredThemeTokenValue(brand, `${restPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${restPrefix}.border`)),
    placeholder: String(getRequiredThemeTokenValue(brand, `${restPrefix}.placeholder`)),
    value: String(getRequiredThemeTokenValue(brand, `${restPrefix}.value`))
  };
}

function getHelperColors(brand: DisplayBrandId): TextareaHelperColors {
  return {
    counter: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder")),
    icon: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.helper.default.icon")),
    text: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.helper.default.text"))
  };
}

function resolveVisualState({
  disabled,
  focused,
  forceState,
  hovered,
  hasValue
}: {
  disabled: boolean;
  focused: boolean;
  forceState: TextareaPreviewState | undefined;
  hovered: boolean;
  hasValue: boolean;
}): FieldVisualState {
  if (forceState === "Disabled") {
    return "disabled";
  }

  if (forceState === "Hover") {
    return "hover";
  }

  if (forceState === "Typing") {
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
  typography: TextareaTypography;
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

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "defaultValue" | "size" | "value"> {
  brand?: DisplayBrandId;
  counterText?: ReactNode;
  defaultValue?: string;
  forceState?: TextareaPreviewState;
  helperText?: ReactNode;
  label?: ReactNode;
  showCharacterCounter?: boolean;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: TextareaSize;
  value?: string;
}

export function Textarea({
  brand = "Cars24",
  counterText,
  defaultValue,
  disabled = false,
  forceState,
  helperText,
  id,
  label,
  maxLength,
  onBlur,
  onChange,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  placeholder = "Input text",
  required = false,
  showCharacterCounter,
  showHelperIcon = true,
  showLabelInfoIcon = false,
  size = "Small",
  style,
  value,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? `textarea-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const sanitizedId = generatedId.replace(/[^a-zA-Z0-9_-]/g, "");
  const placeholderClassName = `geist-textarea-${sanitizedId}`;
  const caretKeyframesName = `geist-textarea-caret-blink-${sanitizedId}`;
  const previewCaretClassName = `geist-textarea-caret-${sanitizedId}`;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");

  const currentValue = value ?? uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const sizeTokens = getSizeTokens(brand, size);
  const inputTypography = getInputTypography(brand, size);
  const helperTypography = getHelperTypography(brand, size);
  const counterTypography = getCounterTypography(brand);
  const visualState = resolveVisualState({
    disabled,
    focused,
    forceState,
    hovered,
    hasValue
  });
  const fieldColors = getFieldColors(brand, visualState);
  const helperColors = getHelperColors(brand);
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.border.width"));
  const caretWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.caret.width"));
  const fieldRadius = getFieldRadius(brand, size);
  const labelSize = getLabelSize(size);
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const resolvedCounterText =
    counterText ?? (maxLength !== undefined ? `Max. ${maxLength} character` : undefined);
  const shouldShowCharacterCounter =
    showCharacterCounter ?? (resolvedCounterText !== undefined && resolvedCounterText !== null);
  const showCounter =
    shouldShowCharacterCounter && resolvedCounterText !== undefined && resolvedCounterText !== null;
  const showSupporting = showHelper || showCounter;
  const previewMode = forceState !== undefined;
  const previewShowsCaret = forceState === "Hover" || forceState === "Typing";
  const previewTextValue = currentValue || placeholder;
  const previewHasValue = currentValue.length > 0;
  const contentMinHeight = TEXTAREA_MIN_HEIGHT - borderWidth * 2 - sizeTokens.fieldPaddingBlock * 2;
  const contentMaxHeight = TEXTAREA_MAX_HEIGHT - borderWidth * 2 - sizeTokens.fieldPaddingBlock * 2;

  const fieldStyles: CSSProperties = {
    alignItems: "flex-start",
    background: fieldColors.background,
    border: `${borderWidth}px solid ${fieldColors.border}`,
    borderRadius: `${fieldRadius}px`,
    boxSizing: "border-box",
    display: "flex",
    maxHeight: `${TEXTAREA_MAX_HEIGHT}px`,
    minHeight: `${TEXTAREA_MIN_HEIGHT}px`,
    minWidth: 0,
    overflow: "hidden",
    padding: `${sizeTokens.fieldPaddingBlock}px ${sizeTokens.fieldPaddingInline}px`,
    width: "100%"
  };

  const actualTextareaStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: hasValue ? fieldColors.value : fieldColors.placeholder,
      fontWeightPath: "typography.fontWeight.regular",
      typography: inputTypography
    }),
    appearance: "none",
    background: "transparent",
    border: "none",
    caretColor: fieldColors.border,
    flex: "1 1 auto",
    maxHeight: `${contentMaxHeight}px`,
    minHeight: `${contentMinHeight}px`,
    minWidth: 0,
    outline: "none",
    overflowY: "auto",
    padding: 0,
    resize: "none"
  };

  const previewTextStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: previewHasValue ? fieldColors.value : fieldColors.placeholder,
      fontWeightPath: "typography.fontWeight.regular",
      typography: inputTypography
    }),
    flex: "1 1 auto",
    maxHeight: `${contentMaxHeight}px`,
    minHeight: `${contentMinHeight}px`,
    minWidth: 0,
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  };

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLTextAreaElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLTextAreaElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(true);
    onMouseEnter?.(event as unknown as ReactMouseEvent<HTMLTextAreaElement>);
  }

  function handleMouseLeave(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(false);
    onMouseLeave?.(event as unknown as ReactMouseEvent<HTMLTextAreaElement>);
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
        {previewMode ? (
          <div aria-hidden="true" style={previewTextStyles}>
            <span>{previewTextValue}</span>
            {previewShowsCaret ? (
              <span
                className={previewCaretClassName}
                style={{
                  background: fieldColors.border,
                  display: "inline-block",
                  height: `${inputTypography.lineHeight}px`,
                  verticalAlign: "top",
                  width: `${caretWidth}px`
                }}
              />
            ) : null}
          </div>
        ) : (
          <textarea
            {...rest}
            aria-describedby={showHelper ? helperId : undefined}
            className={placeholderClassName}
            disabled={disabled}
            id={inputId}
            maxLength={maxLength}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            style={actualTextareaStyles}
            value={currentValue}
          />
        )}
      </div>

      {showSupporting ? (
        <div
          id={showHelper && !previewMode ? helperId : undefined}
          style={{
            alignItems: "center",
            display: "flex",
            gap: `${sizeTokens.containerGap}px`,
            minWidth: 0,
            paddingInline: `${sizeTokens.labelPaddingInline}px`,
            width: "100%"
          }}
        >
          {showHelper ? (
            <HelperText
              align="center"
              brand={brand}
              counterColor={helperColors.counter}
              counterText={showCounter ? resolvedCounterText : undefined}
              counterTypography={counterTypography}
              fullWidth
              helperText={helperText}
              iconColor={helperColors.icon}
              iconName="info-outline"
              showIcon={showHelperIcon}
              size={size}
              textColor={helperColors.text}
              typography={helperTypography}
            />
          ) : (
            <div style={{ flex: "1 1 auto" }} />
          )}
        </div>
      ) : null}
    </div>
  );
}
