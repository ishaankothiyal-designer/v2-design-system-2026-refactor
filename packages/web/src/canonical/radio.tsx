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
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import {
  ensureStyleSheet,
  ensureVisuallyHiddenStyles,
  joinClassNames,
  runtimeTokenVar,
  runtimeTokenVarPx,
  toCssRule,
  VISUALLY_HIDDEN_CLASS
} from "./runtime-styles";

export const canonicalRadioWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.radio"
);

export type RadioSize = "Small" | "Medium";

const RADIO_ROOT_CLASS = "geist-radio";
const RADIO_BOX_CLASS = "geist-radio__box";
const RADIO_DOT_CLASS = "geist-radio__dot";
const RADIO_STYLESHEET_ID = "geist-radio-styles";

function getSizeKey(size: RadioSize) {
  return size === "Medium" ? "md" : "sm";
}

const RADIO_SIZE_KEYS = ["sm", "md"] as const;

const RADIO_STYLESHEET = [
  toCssRule(`.${RADIO_ROOT_CLASS}`, {
    cursor: "pointer",
    display: "inline-flex",
    "line-height": "0",
    position: "relative",
    "vertical-align": "top"
  }),
  toCssRule(`.${RADIO_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${RADIO_BOX_CLASS}`, {
    "align-items": "center",
    "box-sizing": "border-box",
    display: "inline-flex",
    "justify-content": "center",
  }),
  toCssRule(`.${RADIO_ROOT_CLASS}[data-focused="true"] .${RADIO_BOX_CLASS}`, {
    outline: `${runtimeTokenVarPx("component.radio.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`,
    "outline-offset": runtimeTokenVarPx("component.radio.focus.outlineOffset")
  }),
  toCssRule(`.${RADIO_ROOT_CLASS}:focus-within .${RADIO_BOX_CLASS}`, {
    outline: `${runtimeTokenVarPx("component.radio.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`,
    "outline-offset": runtimeTokenVarPx("component.radio.focus.outlineOffset")
  }),
  toCssRule(`.${RADIO_DOT_CLASS}`, {
    display: "block",
    "border-radius": runtimeTokenVarPx("radius.pill")
  }),
  ...RADIO_SIZE_KEYS.flatMap((sizeKey) => [
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"] .${RADIO_BOX_CLASS}`, {
      "border-radius": runtimeTokenVarPx("radius.pill"),
      height: runtimeTokenVarPx(`component.radio.size.${sizeKey}.boxSize`),
      width: runtimeTokenVarPx(`component.radio.size.${sizeKey}.boxSize`)
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"] .${RADIO_DOT_CLASS}`, {
      height: runtimeTokenVarPx(`component.radio.size.${sizeKey}.dotSize`),
      width: runtimeTokenVarPx(`component.radio.size.${sizeKey}.dotSize`)
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="false"][data-selected="false"] .${RADIO_BOX_CLASS}`, {
      background: runtimeTokenVar("component.radio.color.rest.background"),
      border: `${runtimeTokenVarPx(`component.radio.size.${sizeKey}.borderWidth`)} solid ${runtimeTokenVar("component.radio.color.rest.border")}`
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="false"][data-selected="true"] .${RADIO_BOX_CLASS}`, {
      background: runtimeTokenVar("component.radio.color.selected.background"),
      border: `${runtimeTokenVarPx(`component.radio.size.${sizeKey}.selectedBorderWidth`)} solid ${runtimeTokenVar("component.radio.color.selected.border")}`
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="false"][data-selected="true"] .${RADIO_DOT_CLASS}`, {
      background: runtimeTokenVar("component.radio.color.selected.foreground")
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="true"][data-selected="false"] .${RADIO_BOX_CLASS}`, {
      background: runtimeTokenVar("component.radio.color.disabled.rest.background"),
      border: `${runtimeTokenVarPx(`component.radio.size.${sizeKey}.borderWidth`)} solid ${runtimeTokenVar("component.radio.color.disabled.rest.border")}`
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="true"][data-selected="true"] .${RADIO_BOX_CLASS}`, {
      background: runtimeTokenVar("component.radio.color.disabled.selected.background"),
      border: `${runtimeTokenVarPx(`component.radio.size.${sizeKey}.disabledSelectedBorderWidth`)} solid ${runtimeTokenVar("component.radio.color.disabled.selected.border")}`
    }),
    toCssRule(`.${RADIO_ROOT_CLASS}[data-size="${sizeKey}"][data-disabled="true"][data-selected="true"] .${RADIO_DOT_CLASS}`, {
      background: runtimeTokenVar("component.radio.color.disabled.selected.foreground")
    })
  ])
].join("");

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
  const repoBrand = normalizeBrandId(brand);
  const sizeKey = getSizeKey(size);

  useInsertionEffect(() => {
    ensureStyleSheet(RADIO_STYLESHEET_ID, RADIO_STYLESHEET);
    ensureVisuallyHiddenStyles();
  }, []);

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
      className={joinClassNames(RADIO_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-focused={String(focused)}
      data-selected={String(resolvedChecked)}
      data-size={sizeKey}
      htmlFor={resolvedId}
      style={style}
    >
      <input
        {...rest}
        ref={inputRef}
        checked={resolvedChecked}
        className={VISUALLY_HIDDEN_CLASS}
        disabled={disabled}
        id={resolvedId}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        type="radio"
      />

      <span aria-hidden="true" className={RADIO_BOX_CLASS}>
        {resolvedChecked ? <span className={RADIO_DOT_CLASS} /> : null}
      </span>
    </label>
  );
}
