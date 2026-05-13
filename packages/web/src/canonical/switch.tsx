import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  useId,
  useInsertionEffect,
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

export const canonicalSwitchWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.switch"
);

export type SwitchSize = "Default" | "Small";

const SWITCH_ROOT_CLASS = "geist-switch";
const SWITCH_TRACK_CLASS = "geist-switch__track";
const SWITCH_THUMB_CLASS = "geist-switch__thumb";
const SWITCH_STYLESHEET_ID = "geist-switch-styles";
const SWITCH_TRACK_TRANSITION = "background-color 180ms cubic-bezier(0.2, 0, 0, 1)";
const SWITCH_THUMB_TRANSITION =
  "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), background-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)";

function getSizeKey(size: SwitchSize) {
  return size === "Small" ? "sm" : "default";
}

const SWITCH_SIZE_KEYS = ["default", "sm"] as const;

const SWITCH_STYLESHEET = [
  toCssRule(`.${SWITCH_ROOT_CLASS}`, {
    cursor: "pointer",
    display: "inline-flex",
    "line-height": "0",
    position: "relative",
    "vertical-align": "top"
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${SWITCH_TRACK_CLASS}`, {
    "align-items": "center",
    "border-radius": runtimeTokenVarPx("radius.pill"),
    "box-sizing": "border-box",
    display: "inline-flex",
    transition: SWITCH_TRACK_TRANSITION,
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-focused="true"] .${SWITCH_TRACK_CLASS}`, {
    outline: `${runtimeTokenVarPx("component.switch.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`,
    "outline-offset": runtimeTokenVarPx("component.switch.focus.outlineOffset")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}:focus-within .${SWITCH_TRACK_CLASS}`, {
    outline: `${runtimeTokenVarPx("component.switch.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`,
    "outline-offset": runtimeTokenVarPx("component.switch.focus.outlineOffset")
  }),
  toCssRule(`.${SWITCH_THUMB_CLASS}`, {
    "border-radius": runtimeTokenVarPx("radius.pill"),
    "box-shadow": runtimeTokenVar("component.switch.thumb.shadow"),
    display: "block",
    "flex-shrink": "0",
    transition: SWITCH_THUMB_TRANSITION,
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="false"] .${SWITCH_THUMB_CLASS}`, {
    "will-change": "transform"
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-selected="false"] .${SWITCH_THUMB_CLASS}`, {
    transform: "translate3d(0, 0, 0)"
  }),
  ...SWITCH_SIZE_KEYS.flatMap((sizeKey) => [
    toCssRule(`.${SWITCH_ROOT_CLASS}[data-size="${sizeKey}"] .${SWITCH_TRACK_CLASS}`, {
      height: runtimeTokenVarPx(`component.switch.size.${sizeKey}.trackHeight`),
      padding: runtimeTokenVarPx(`component.switch.size.${sizeKey}.padding`),
      width: runtimeTokenVarPx(`component.switch.size.${sizeKey}.trackWidth`)
    }),
    toCssRule(`.${SWITCH_ROOT_CLASS}[data-size="${sizeKey}"] .${SWITCH_THUMB_CLASS}`, {
      height: runtimeTokenVarPx(`component.switch.size.${sizeKey}.thumbSize`),
      width: runtimeTokenVarPx(`component.switch.size.${sizeKey}.thumbSize`)
    }),
    toCssRule(`.${SWITCH_ROOT_CLASS}[data-size="${sizeKey}"][data-selected="true"] .${SWITCH_THUMB_CLASS}`, {
      transform: `translate3d(${runtimeTokenVarPx(`component.switch.size.${sizeKey}.thumbTranslateX`)}, 0, 0)`
    })
  ]),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="false"][data-selected="false"] .${SWITCH_TRACK_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.rest.track")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="false"][data-selected="false"] .${SWITCH_THUMB_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.rest.thumb")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="false"][data-selected="true"] .${SWITCH_TRACK_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.selected.track")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="false"][data-selected="true"] .${SWITCH_THUMB_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.selected.thumb")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="true"][data-selected="false"] .${SWITCH_TRACK_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.disabled.rest.track")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="true"][data-selected="false"] .${SWITCH_THUMB_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.disabled.rest.thumb")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="true"][data-selected="true"] .${SWITCH_TRACK_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.disabled.selected.track")
  }),
  toCssRule(`.${SWITCH_ROOT_CLASS}[data-disabled="true"][data-selected="true"] .${SWITCH_THUMB_CLASS}`, {
    background: runtimeTokenVar("component.switch.color.disabled.selected.thumb")
  })
].join("");

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
  const repoBrand = normalizeBrandId(brand);
  const sizeKey = getSizeKey(size);

  useInsertionEffect(() => {
    ensureStyleSheet(SWITCH_STYLESHEET_ID, SWITCH_STYLESHEET);
    ensureVisuallyHiddenStyles();
  }, []);

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
      className={joinClassNames(SWITCH_ROOT_CLASS, className)}
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
        checked={resolvedChecked}
        className={VISUALLY_HIDDEN_CLASS}
        disabled={disabled}
        id={resolvedId}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        role="switch"
        type="checkbox"
      />

      <span aria-hidden="true" className={SWITCH_TRACK_CLASS}>
        <span className={SWITCH_THUMB_CLASS} />
      </span>
    </label>
  );
}
