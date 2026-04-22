import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useId,
  useInsertionEffect,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import { designSystemRegistry } from "@geist/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@geist/tokens";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

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

const TEXT_INPUT_ROOT_CLASS = "geist-text-input";
const TEXT_INPUT_LABEL_SLOT_CLASS = "geist-text-input__label-slot";
const TEXT_INPUT_FIELD_CLASS = "geist-text-input__field";
const TEXT_INPUT_AFFIX_CLASS = "geist-text-input__affix";
const TEXT_INPUT_CONTROL_CLASS = "geist-text-input__control";
const TEXT_INPUT_ELEMENT_CLASS = "geist-text-input__element";
const TEXT_INPUT_PREVIEW_CLASS = "geist-text-input__preview";
const TEXT_INPUT_PREVIEW_TEXT_CLASS = "geist-text-input__preview-text";
const TEXT_INPUT_PREVIEW_CARET_CLASS = "geist-text-input__preview-caret";
const TEXT_INPUT_STYLESHEET_ID = "geist-text-input-styles";
const TEXT_INPUT_CARET_KEYFRAMES =
  "@keyframes geist-text-input-caret-blink{0%,49%{opacity:1;}50%,100%{opacity:0;}}";

function getSizeKey(size: TextInputSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: TextInputSize) {
  return size === "Large" ? "Large" : "Medium";
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

const TEXT_INPUT_STYLESHEET = [
  TEXT_INPUT_CARET_KEYFRAMES,
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}`, {
    display: "grid",
    width: "100%"
  }),
  toCssRule(`.${TEXT_INPUT_LABEL_SLOT_CLASS}`, {
    display: "block",
  }),
  toCssRule(`.${TEXT_INPUT_FIELD_CLASS}`, {
    "align-items": "center",
    "box-sizing": "border-box",
    display: "flex",
    "min-width": "0",
    width: "100%"
  }),
  toCssRule(`.${TEXT_INPUT_AFFIX_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    "flex": "0 0 auto",
    "justify-content": "center",
  }),
  toCssRule(`.${TEXT_INPUT_CONTROL_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex": "1 1 auto",
    "min-width": "0"
  }),
  toCssRule(`.${TEXT_INPUT_ELEMENT_CLASS}`, {
    appearance: "none",
    background: "transparent",
    border: "none",
    "flex": "1 1 auto",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "min-width": "0",
    outline: "none",
    padding: "0"
  }),
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-filled="true"] .${TEXT_INPUT_ELEMENT_CLASS}`, {
    "font-weight": runtimeTokenVar("typography.fontWeight.medium")
  }),
  toCssRule(`.${TEXT_INPUT_ELEMENT_CLASS}::placeholder`, {
    opacity: "1"
  }),
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="active"] .${TEXT_INPUT_ELEMENT_CLASS}`, {
    "caret-color": runtimeTokenVar("component.textInput.color.field.active.border")
  }),
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}:not([data-state="active"]) .${TEXT_INPUT_ELEMENT_CLASS}`, {
    "caret-color": runtimeTokenVar("component.textInput.color.field.typed.value")
  }),
  toCssRule(`.${TEXT_INPUT_PREVIEW_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex": "1 1 auto",
    "min-width": "0"
  }),
  toCssRule(`.${TEXT_INPUT_PREVIEW_TEXT_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "min-width": "0",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }),
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-filled="true"] .${TEXT_INPUT_PREVIEW_TEXT_CLASS}`, {
    "font-weight": runtimeTokenVar("typography.fontWeight.medium")
  }),
  toCssRule(`.${TEXT_INPUT_PREVIEW_CARET_CLASS}`, {
    animation: "geist-text-input-caret-blink 1s steps(1, end) infinite",
    display: "inline-block",
    "flex-shrink": "0",
  }),
  ...(["sm", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"]`, {
      gap: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.containerGap`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"] .${TEXT_INPUT_LABEL_SLOT_CLASS}`, {
      "padding-inline": runtimeTokenVarPx(`component.textInput.size.${sizeKey}.labelPaddingInline`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"] .${TEXT_INPUT_FIELD_CLASS}`, {
      gap: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.fieldGap`),
      height: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.height`),
      padding: `${runtimeTokenVarPx(`component.textInput.size.${sizeKey}.fieldPaddingBlock`)} ${runtimeTokenVarPx(`component.textInput.size.${sizeKey}.fieldPaddingInline`)}`,
      "border-radius": runtimeTokenVarPx(sizeKey === "lg" ? "radius.alt.lg" : "radius.alt.md"),
      border: `${runtimeTokenVarPx("component.textInput.border.width")} solid ${runtimeTokenVar(`component.textInput.color.field.rest.border`)}`
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"] .${TEXT_INPUT_AFFIX_CLASS}`, {
      height: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.affixBoxSize`),
      width: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.affixBoxSize`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"] .${TEXT_INPUT_ELEMENT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"] .${TEXT_INPUT_PREVIEW_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-size="${sizeKey}"] .${TEXT_INPUT_PREVIEW_CARET_CLASS}`, {
      height: `max(${runtimeTokenVarPx(`component.textInput.size.${sizeKey}.affixBoxSize`)}, ${runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.lineHeight`)})`,
      "margin-left": runtimeTokenVarPx("component.textInput.caret.gap"),
      width: runtimeTokenVarPx("component.textInput.caret.width")
    })
  ]),
  toCssRule(`.${TEXT_INPUT_AFFIX_CLASS} > *`, {
    color: "inherit",
    "font-size": runtimeTokenVarPx("component.textInput.icon.affixSize")
  }),
  ...(["rest", "hover", "active", "typed", "error", "success", "disabled"] as const).flatMap((stateKey) => [
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="${stateKey}"] .${TEXT_INPUT_FIELD_CLASS}`, {
      background: runtimeTokenVar(`component.textInput.color.field.${stateKey}.background`),
      border: `${runtimeTokenVarPx("component.textInput.border.width")} solid ${runtimeTokenVar(`component.textInput.color.field.${stateKey}.border`)}`
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="${stateKey}"] .${TEXT_INPUT_AFFIX_CLASS}`, {
      color: runtimeTokenVar(`component.textInput.color.field.${stateKey}.affix`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="${stateKey}"] .${TEXT_INPUT_ELEMENT_CLASS}`, {
      color: runtimeTokenVar(`component.textInput.color.field.${stateKey}.placeholder`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="${stateKey}"] .${TEXT_INPUT_ELEMENT_CLASS}::placeholder`, {
      color: runtimeTokenVar(`component.textInput.color.field.${stateKey}.placeholder`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="${stateKey}"] .${TEXT_INPUT_PREVIEW_TEXT_CLASS}`, {
      color: runtimeTokenVar(`component.textInput.color.field.${stateKey}.placeholder`)
    }),
    toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-state="${stateKey}"] .${TEXT_INPUT_PREVIEW_CARET_CLASS}`, {
      background: runtimeTokenVar(`component.textInput.color.field.${stateKey}.border`)
    })
  ]),
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-filled="true"] .${TEXT_INPUT_ELEMENT_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.field.typed.value")
  }),
  toCssRule(`.${TEXT_INPUT_ROOT_CLASS}[data-filled="true"] .${TEXT_INPUT_PREVIEW_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.field.typed.value")
  }),
].join("");

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
  className,
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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");

  const currentValue = value ?? uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const sizeKey = getSizeKey(size);
  const visualState = resolveVisualState({
    disabled,
    focused,
    forceState,
    hovered,
    hasValue,
    validationState
  });
  const resolvedHelperTone =
    forceState === "Error"
      ? "Error"
      : forceState === "Success"
        ? "Success"
        : helperTone ?? validationState;
  const labelSize = getLabelSize(size);
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const previewMode = forceState !== undefined;
  const previewShowsCaret = forceState === "Active" || forceState === "Typing";
  const ariaInvalid = visualState === "error" ? true : undefined;
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(TEXT_INPUT_STYLESHEET_ID, TEXT_INPUT_STYLESHEET);
  }, []);

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
      className={joinClassNames(TEXT_INPUT_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-filled={String(hasValue)}
      data-size={sizeKey}
      data-state={visualState}
      style={style}
    >
      {showLabel ? (
        previewMode ? (
          <div className={TEXT_INPUT_LABEL_SLOT_CLASS}>{labelNode}</div>
        ) : (
          <label className={TEXT_INPUT_LABEL_SLOT_CLASS} htmlFor={inputId}>
            {labelNode}
          </label>
        )
      ) : null}

      <div className={TEXT_INPUT_FIELD_CLASS} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {prefixIconName ? (
          <span className={TEXT_INPUT_AFFIX_CLASS}>
            <Icon
              decorative
              brand={brand}
              name={prefixIconName}
              style={{ color: "inherit", fontSize: runtimeTokenVarPx("component.textInput.icon.affixSize") }}
            />
          </span>
        ) : null}

        <div className={TEXT_INPUT_CONTROL_CLASS}>
          {previewMode ? (
            <div aria-hidden="true" className={TEXT_INPUT_PREVIEW_CLASS}>
              <span className={TEXT_INPUT_PREVIEW_TEXT_CLASS}>{currentValue || placeholder}</span>
              {previewShowsCaret ? <span className={TEXT_INPUT_PREVIEW_CARET_CLASS} /> : null}
            </div>
          ) : (
            <input
              {...rest}
              aria-describedby={showHelper ? helperId : undefined}
              aria-invalid={ariaInvalid}
              className={TEXT_INPUT_ELEMENT_CLASS}
              disabled={disabled}
              id={inputId}
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder={placeholder}
              type={type}
              value={currentValue}
            />
          )}
        </div>

        {suffixIconName ? (
          <span className={TEXT_INPUT_AFFIX_CLASS}>
            <Icon
              decorative
              brand={brand}
              name={suffixIconName}
              style={{ color: "inherit", fontSize: runtimeTokenVarPx("component.textInput.icon.affixSize") }}
            />
          </span>
        ) : null}
      </div>

      {showHelper ? (
        <HelperText
          align="center"
          brand={brand}
          className={TEXT_INPUT_LABEL_SLOT_CLASS}
          fullWidth
          id={showHelper && !previewMode ? helperId : undefined}
          helperText={helperText}
          showIcon={showHelperIcon}
          size={size}
          tone={resolvedHelperTone}
        />
      ) : null}
    </div>
  );
}
