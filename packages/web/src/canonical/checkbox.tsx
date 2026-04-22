import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  useEffect,
  useId,
  useInsertionEffect,
  useRef,
  useState
} from "react";
import { designSystemRegistry } from "@geist/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@geist/tokens";
import { Icon } from "./icon";
import {
  ensureStyleSheet,
  ensureVisuallyHiddenStyles,
  joinClassNames,
  runtimeTokenVar,
  runtimeTokenVarPx,
  toCssRule,
  VISUALLY_HIDDEN_CLASS
} from "./runtime-styles";

export const canonicalCheckboxWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.checkbox"
);

export type CheckboxSize = "Small" | "Medium" | "Large" | "Extra Large";

const CHECKBOX_ROOT_CLASS = "geist-checkbox";
const CHECKBOX_BOX_CLASS = "geist-checkbox__box";
const CHECKBOX_ICON_CLASS = "geist-checkbox__icon";
const CHECKBOX_STYLESHEET_ID = "geist-checkbox-styles";

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

function getRadiusTokenPath(sizeKey: ReturnType<typeof getSizeKey>) {
  return sizeKey === "xl" ? "radius.alt.sm" : "radius.alt.xs";
}

const CHECKBOX_SIZE_KEYS = ["sm", "md", "lg", "xl"] as const;

const CHECKBOX_STYLESHEET = [
  toCssRule(`.${CHECKBOX_ROOT_CLASS}`, {
    cursor: "pointer",
    display: "inline-flex",
    "line-height": "0",
    position: "relative",
    "vertical-align": "top"
  }),
  toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${CHECKBOX_BOX_CLASS}`, {
    "align-items": "center",
    "box-sizing": "border-box",
    display: "inline-flex",
    "justify-content": "center",
  }),
  toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-focused="true"] .${CHECKBOX_BOX_CLASS}`, {
    outline: `${runtimeTokenVarPx("component.checkbox.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`,
    "outline-offset": runtimeTokenVarPx("component.checkbox.focus.outlineOffset")
  }),
  toCssRule(`.${CHECKBOX_ROOT_CLASS}:focus-within .${CHECKBOX_BOX_CLASS}`, {
    outline: `${runtimeTokenVarPx("component.checkbox.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`,
    "outline-offset": runtimeTokenVarPx("component.checkbox.focus.outlineOffset")
  }),
  toCssRule(`.${CHECKBOX_ICON_CLASS}`, {
    "align-items": "center",
    color: "inherit",
    display: "inline-flex",
    "line-height": "0"
  }),
  ...CHECKBOX_SIZE_KEYS.flatMap((sizeKey) => [
    toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="${sizeKey}"] .${CHECKBOX_BOX_CLASS}`, {
      "border-radius": runtimeTokenVarPx(getRadiusTokenPath(sizeKey)),
      height: runtimeTokenVarPx(`component.checkbox.size.${sizeKey}.boxSize`),
      width: runtimeTokenVarPx(`component.checkbox.size.${sizeKey}.boxSize`)
    }),
    toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="${sizeKey}"] .${CHECKBOX_ICON_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.checkbox.size.${sizeKey}.iconSize`)
    }),
    toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="false"][data-selected="false"] .${CHECKBOX_BOX_CLASS}`, {
      background: runtimeTokenVar("component.checkbox.color.rest.background"),
      border: `${runtimeTokenVarPx(`component.checkbox.size.${sizeKey}.borderWidth`)} solid ${runtimeTokenVar("component.checkbox.color.rest.border")}`,
      color: "transparent"
    }),
    toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="false"][data-selected="true"] .${CHECKBOX_BOX_CLASS}`, {
      background: runtimeTokenVar("component.checkbox.color.checked.background"),
      border: `0 solid ${runtimeTokenVar("component.checkbox.color.checked.border")}`,
      color: runtimeTokenVar("component.checkbox.color.checked.foreground")
    }),
    toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="true"][data-selected="false"] .${CHECKBOX_BOX_CLASS}`, {
      background: runtimeTokenVar("component.checkbox.color.disabled.rest.background"),
      border: `${runtimeTokenVarPx(`component.checkbox.size.${sizeKey}.borderWidth`)} solid ${runtimeTokenVar("component.checkbox.color.disabled.rest.border")}`,
      color: "transparent"
    }),
    sizeKey === "xl"
      ? toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="xl"][data-disabled="true"][data-selected="true"] .${CHECKBOX_BOX_CLASS}`, {
          background: runtimeTokenVar("component.checkbox.color.disabled.rest.background"),
          border: `${runtimeTokenVarPx("component.checkbox.size.xl.disabledCheckedBorderWidth")} solid ${runtimeTokenVar("component.checkbox.color.disabled.rest.border")}`,
          color: runtimeTokenVar("component.checkbox.color.disabled.checked.foreground")
        })
      : toCssRule(`.${CHECKBOX_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="true"][data-selected="true"] .${CHECKBOX_BOX_CLASS}`, {
          background: runtimeTokenVar("component.checkbox.color.disabled.checked.background"),
          border: `${runtimeTokenVarPx(`component.checkbox.size.${sizeKey}.disabledCheckedBorderWidth`)} solid ${runtimeTokenVar("component.checkbox.color.disabled.checked.border")}`,
          color: runtimeTokenVar("component.checkbox.color.disabled.checked.foreground")
        })
  ])
].join("");

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
  const repoBrand = normalizeBrandId(brand);
  const sizeKey = getSizeKey(size);

  useInsertionEffect(() => {
    ensureStyleSheet(CHECKBOX_STYLESHEET_ID, CHECKBOX_STYLESHEET);
    ensureVisuallyHiddenStyles();
  }, []);

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
      className={joinClassNames(CHECKBOX_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-focused={String(focused)}
      data-selected={String(showSelectedState)}
      data-size={sizeKey}
      htmlFor={resolvedId}
      style={style}
    >
      <input
        {...rest}
        ref={inputRef}
        aria-checked={showMixedState ? "mixed" : undefined}
        checked={resolvedChecked}
        className={VISUALLY_HIDDEN_CLASS}
        disabled={disabled}
        id={resolvedId}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        type="checkbox"
      />

      <span aria-hidden="true" className={CHECKBOX_BOX_CLASS}>
        {showMixedState ? (
          <span className={CHECKBOX_ICON_CLASS}>
            <Icon decorative name="minus-large-filled" style={{ color: "inherit", fontSize: "inherit" }} />
          </span>
        ) : resolvedChecked ? (
          <span className={CHECKBOX_ICON_CLASS}>
            <Icon decorative name="checkmark-1-filled" style={{ color: "inherit", fontSize: "inherit" }} />
          </span>
        ) : null}
      </span>
    </label>
  );
}
