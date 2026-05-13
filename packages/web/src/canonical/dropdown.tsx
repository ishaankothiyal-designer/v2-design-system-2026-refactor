import {
  type ButtonHTMLAttributes,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useId,
  useInsertionEffect,
  useState
} from "react";
import type { IconName } from "@turbo/icons";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalDropdownWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.dropdown"
);

export type DropdownSize = "Small" | "Large";
export type DropdownPreviewState = "Rest" | "Active" | "Selected" | "Error" | "Disabled";
export type DropdownValidationState = "Default" | "Error";
export type DropdownHelperTone = "Default" | "Error";

type FieldVisualState = "rest" | "active" | "selected" | "error" | "disabled";

const DROPDOWN_ROOT_CLASS = "geist-dropdown";
const DROPDOWN_LABEL_SLOT_CLASS = "geist-dropdown__label-slot";
const DROPDOWN_FIELD_CLASS = "geist-dropdown__field";
const DROPDOWN_AFFIX_CLASS = "geist-dropdown__affix";
const DROPDOWN_TEXT_WRAPPER_CLASS = "geist-dropdown__text-wrapper";
const DROPDOWN_TEXT_CLASS = "geist-dropdown__text";
const DROPDOWN_STYLESHEET_ID = "geist-dropdown-styles";

function getSizeKey(size: DropdownSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: DropdownSize) {
  return size === "Large" ? "Large" : "Medium";
}

function resolveVisualState({
  disabled,
  focused,
  forceState,
  open,
  hasValue,
  validationState
}: {
  disabled: boolean;
  focused: boolean;
  forceState: DropdownPreviewState | undefined;
  open: boolean;
  hasValue: boolean;
  validationState: DropdownValidationState;
}): FieldVisualState {
  if (forceState === "Disabled" || disabled) {
    return "disabled";
  }

  if (forceState === "Error" || validationState === "Error") {
    return "error";
  }

  if (forceState === "Active" || open || focused) {
    return "active";
  }

  if (forceState === "Selected" || hasValue) {
    return "selected";
  }

  return "rest";
}

function resolveHelperTone({
  forceState,
  helperTone,
  size,
  validationState
}: {
  forceState: DropdownPreviewState | undefined;
  helperTone: DropdownHelperTone | undefined;
  size: DropdownSize;
  validationState: DropdownValidationState;
}) {
  if (helperTone) {
    return helperTone;
  }

  if (forceState === "Error") {
    return size === "Small" ? "Error" : "Default";
  }

  return validationState === "Error" ? "Error" : "Default";
}

function hasDisplayValue(value: string | undefined) {
  return value !== undefined && value.length > 0;
}

const DROPDOWN_STYLESHEET = [
  toCssRule(`.${DROPDOWN_ROOT_CLASS}`, {
    display: "grid",
    width: "100%"
  }),
  toCssRule(`.${DROPDOWN_LABEL_SLOT_CLASS}`, {
    display: "block",
  }),
  toCssRule(`.${DROPDOWN_FIELD_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "flex",
    margin: "0",
    "min-width": "0",
    "text-align": "left",
    width: "100%"
  }),
  toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-disabled="true"] .${DROPDOWN_FIELD_CLASS}`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${DROPDOWN_AFFIX_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    "flex": "0 0 auto",
    "justify-content": "center",
  }),
  toCssRule(`.${DROPDOWN_AFFIX_CLASS}[data-role="chevron"]`, {
  }),
  toCssRule(`.${DROPDOWN_TEXT_WRAPPER_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex": "1 1 auto",
    "min-width": "0",
  }),
  toCssRule(`.${DROPDOWN_TEXT_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "min-width": "0",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }),
  toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-filled="true"] .${DROPDOWN_TEXT_CLASS}`, {
    "font-weight": runtimeTokenVar("typography.fontWeight.medium")
  }),
  ...(["sm", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-size="${sizeKey}"]`, {
      gap: runtimeTokenVarPx("component.phoneInput.size.sm.containerGap")
    }),
    toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-size="${sizeKey}"] .${DROPDOWN_LABEL_SLOT_CLASS}`, {
      "padding-inline": runtimeTokenVarPx(`component.textInput.size.${sizeKey}.labelPaddingInline`)
    }),
    toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-size="${sizeKey}"] .${DROPDOWN_FIELD_CLASS}`, {
      gap: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.fieldGap`),
      height: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.height`),
      padding: `${runtimeTokenVarPx(`component.textInput.size.${sizeKey}.fieldPaddingBlock`)} ${runtimeTokenVarPx(`component.textInput.size.${sizeKey}.fieldPaddingInline`)}`,
      "border-radius": runtimeTokenVarPx(sizeKey === "lg" ? "radius.alt.lg" : "radius.alt.md"),
      border: `${runtimeTokenVarPx("component.textInput.border.width")} solid ${runtimeTokenVar("component.textInput.color.field.rest.border")}`
    }),
    toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-size="${sizeKey}"] .${DROPDOWN_AFFIX_CLASS}`, {
      height: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.affixBoxSize`),
      width: runtimeTokenVarPx(`component.textInput.size.${sizeKey}.affixBoxSize`)
    }),
    toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-size="${sizeKey}"] .${DROPDOWN_TEXT_WRAPPER_CLASS}`, {
      "padding-block": sizeKey === "lg" ? runtimeTokenVarPx("component.phoneInput.size.sm.labelPaddingInline") : "0px"
    }),
    toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-size="${sizeKey}"] .${DROPDOWN_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.textInput.typography.input.${sizeKey}.lineHeight`)
    })
  ]),
  toCssRule(`.${DROPDOWN_AFFIX_CLASS}:not([data-role="chevron"])`, {
    color: runtimeTokenVar("component.textInput.color.field.rest.affix")
  }),
  ...(["rest", "active", "selected", "error", "disabled"] as const).flatMap((stateKey) => {
    const textInputStateKey =
      stateKey === "selected" ? "typed" : stateKey === "disabled" ? "disabled" : stateKey;
    const phoneInputStateKey =
      stateKey === "selected"
        ? "filled"
        : stateKey === "error"
          ? "destructive"
          : stateKey === "disabled"
            ? "disabled"
            : stateKey;

    return [
      toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-state="${stateKey}"] .${DROPDOWN_FIELD_CLASS}`, {
        background:
          stateKey === "disabled"
            ? runtimeTokenVar(`component.phoneInput.color.field.${phoneInputStateKey}.background`)
            : runtimeTokenVar(`component.textInput.color.field.${textInputStateKey}.background`),
        border: `${runtimeTokenVarPx("component.textInput.border.width")} solid ${runtimeTokenVar(`component.textInput.color.field.${textInputStateKey}.border`)}`
      }),
      toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-state="${stateKey}"] .${DROPDOWN_AFFIX_CLASS}:not([data-role="chevron"])`, {
        color: runtimeTokenVar(`component.textInput.color.field.${textInputStateKey}.affix`)
      }),
      toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-state="${stateKey}"] .${DROPDOWN_AFFIX_CLASS}[data-role="chevron"]`, {
        color: runtimeTokenVar(`component.phoneInput.color.field.${phoneInputStateKey}.chevron`)
      }),
      toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-state="${stateKey}"] .${DROPDOWN_TEXT_CLASS}`, {
        color: runtimeTokenVar(`component.textInput.color.field.${textInputStateKey}.placeholder`)
      })
    ];
  }),
  toCssRule(`.${DROPDOWN_ROOT_CLASS}[data-filled="true"] .${DROPDOWN_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.field.typed.value")
  })
].join("");

export interface DropdownProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "size" | "value"> {
  brand?: DisplayBrandId;
  forceState?: DropdownPreviewState;
  helperText?: ReactNode;
  helperTone?: DropdownHelperTone;
  label?: ReactNode;
  open?: boolean;
  placeholder?: string;
  prefixIconName?: IconName;
  required?: boolean;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: DropdownSize;
  validationState?: DropdownValidationState;
  value?: string;
}

export function Dropdown({
  brand = "Cars24",
  className,
  disabled = false,
  forceState,
  helperText,
  helperTone,
  id,
  label,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  open = false,
  placeholder = "Select option",
  prefixIconName = "placeholder-generate-outline",
  required = false,
  showHelperIcon = true,
  showLabelInfoIcon = true,
  size = "Small",
  style,
  type = "button",
  validationState = "Default",
  value,
  ...rest
}: DropdownProps) {
  const generatedId = useId();
  const buttonId = id ?? `dropdown-${generatedId}`;
  const helperId = `${buttonId}-helper`;
  const [focused, setFocused] = useState(false);

  const sizeKey = getSizeKey(size);
  const hasValue = hasDisplayValue(value);
  const visualState = resolveVisualState({
    disabled,
    focused,
    forceState,
    open,
    hasValue,
    validationState
  });
  const resolvedHelperTone = resolveHelperTone({
    forceState,
    helperTone,
    size,
    validationState
  });
  const labelSize = getLabelSize(size);
  const previewMode = forceState !== undefined;
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const displayText = hasValue ? value : placeholder;
  const ariaInvalid = visualState === "error" ? true : undefined;
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(DROPDOWN_STYLESHEET_ID, DROPDOWN_STYLESHEET);
  }, []);

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLButtonElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLButtonElement>) {
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: ReactMouseEvent<HTMLButtonElement>) {
    onMouseLeave?.(event);
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

  const fieldContent = (
    <>
      {prefixIconName ? (
        <span className={DROPDOWN_AFFIX_CLASS}>
          <Icon
            decorative
            brand={brand}
            name={prefixIconName}
            style={{ color: "inherit", fontSize: runtimeTokenVarPx("component.textInput.icon.affixSize") }}
          />
        </span>
      ) : null}

      <span className={DROPDOWN_TEXT_WRAPPER_CLASS}>
        <span className={DROPDOWN_TEXT_CLASS}>{displayText}</span>
      </span>

      <span className={DROPDOWN_AFFIX_CLASS} data-role="chevron">
        <Icon
          decorative
          brand={brand}
          name="chevron-down-small-outline"
          style={{ color: "inherit", fontSize: runtimeTokenVarPx("component.phoneInput.icon.countryChevronSize") }}
        />
      </span>
    </>
  );

  return (
    <div
      className={joinClassNames(DROPDOWN_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-filled={String(hasValue)}
      data-size={sizeKey}
      data-state={visualState}
      style={style}
    >
      {showLabel ? (
        previewMode ? (
          <div className={DROPDOWN_LABEL_SLOT_CLASS}>{labelNode}</div>
        ) : (
          <label className={DROPDOWN_LABEL_SLOT_CLASS} htmlFor={buttonId}>
            {labelNode}
          </label>
        )
      ) : null}

      {previewMode ? (
        <div aria-hidden="true" className={DROPDOWN_FIELD_CLASS}>
          {fieldContent}
        </div>
      ) : (
        <button
          {...rest}
          aria-describedby={showHelper ? helperId : undefined}
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-required={required || undefined}
          className={DROPDOWN_FIELD_CLASS}
          disabled={disabled}
          id={buttonId}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          type={type}
        >
          {fieldContent}
        </button>
      )}

      {showHelper ? (
        <HelperText
          align="center"
          brand={brand}
          className={DROPDOWN_LABEL_SLOT_CLASS}
          fullWidth
          id={previewMode ? undefined : helperId}
          helperText={helperText}
          iconColor={
            resolvedHelperTone === "Error"
              ? runtimeTokenVar("component.phoneInput.color.helper.destructive.icon")
              : runtimeTokenVar("component.phoneInput.color.helper.default.icon")
          }
          iconName={resolvedHelperTone === "Error" ? "error-outline" : "info-outline"}
          showIcon={showHelperIcon}
          size={size}
          textColor={
            resolvedHelperTone === "Error"
              ? runtimeTokenVar("component.phoneInput.color.helper.destructive.text")
              : runtimeTokenVar("component.phoneInput.color.helper.default.text")
          }
        />
      ) : null}
    </div>
  );
}
