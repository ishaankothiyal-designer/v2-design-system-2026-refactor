import { type CSSProperties, type ReactNode, useId, useInsertionEffect } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import { Switch, type SwitchProps, type SwitchSize } from "./switch";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalSwitchLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.switchLabel"
);

export type SwitchLabelSize = SwitchSize;

const SWITCH_LABEL_ROOT_CLASS = "geist-switch-label";
const SWITCH_LABEL_CONTENT_CLASS = "geist-switch-label__content";
const SWITCH_LABEL_TEXT_CLASS = "geist-switch-label__text";
const SWITCH_LABEL_DESCRIPTION_CLASS = "geist-switch-label__description";
const SWITCH_LABEL_STYLESHEET_ID = "geist-switch-label-styles";

export interface SwitchLabelProps extends Omit<SwitchProps, "className" | "size" | "style"> {
  brand?: DisplayBrandId;
  className?: string;
  description?: ReactNode;
  label: ReactNode;
  size?: SwitchLabelSize;
  style?: CSSProperties;
}

function getSizeKey(size: SwitchLabelSize) {
  return size === "Small" ? "sm" : "default";
}

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

const SWITCH_LABEL_STYLESHEET = [
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}`, {
    "align-items": "flex-start",
    display: "flex",
    gap: runtimeTokenVarPx("component.switchLabel.layout.gap"),
    "max-width": "100%"
  }),
  toCssRule(`.${SWITCH_LABEL_CONTENT_CLASS}`, {
    cursor: "pointer",
    display: "flex",
    "flex": "1 1 auto",
    "flex-direction": "column",
    "max-width": "100%",
    "min-width": "0",
    "padding-inline": runtimeTokenVarPx("component.switchLabel.layout.contentPaddingInline")
  }),
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-disabled="true"] .${SWITCH_LABEL_CONTENT_CLASS}`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-has-description="true"] .${SWITCH_LABEL_CONTENT_CLASS}`, {
    gap: runtimeTokenVarPx("component.switchLabel.size.sm.contentGap")
  }),
  toCssRule(`.${SWITCH_LABEL_TEXT_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": "500",
    margin: "0"
  }),
  toCssRule(`.${SWITCH_LABEL_DESCRIPTION_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": "400",
    margin: "0",
    "max-width": "100%"
  }),
  ...(["default", "sm"] as const).flatMap((sizeKey) => [
    toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-size="${sizeKey}"][data-has-description="true"] .${SWITCH_LABEL_CONTENT_CLASS}`, {
      gap: runtimeTokenVarPx(`component.switchLabel.size.${sizeKey}.contentGap`)
    }),
    toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${SWITCH_LABEL_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.switchLabel.typography.label.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.switchLabel.typography.label.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.switchLabel.typography.label.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${SWITCH_LABEL_DESCRIPTION_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.switchLabel.typography.description.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.switchLabel.typography.description.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.switchLabel.typography.description.${sizeKey}.lineHeight`)
    })
  ]),
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-disabled="false"] .${SWITCH_LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.switchLabel.color.label.default")
  }),
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-disabled="false"] .${SWITCH_LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.switchLabel.color.description.default")
  }),
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-disabled="true"] .${SWITCH_LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.switchLabel.color.label.disabled")
  }),
  toCssRule(`.${SWITCH_LABEL_ROOT_CLASS}[data-disabled="true"] .${SWITCH_LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.switchLabel.color.description.disabled")
  })
].join("");

export function SwitchLabel({
  brand = "Cars24",
  className,
  description,
  disabled = false,
  id,
  label,
  size = "Default",
  style,
  ...rest
}: SwitchLabelProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const sizeKey = getSizeKey(size);
  const labelId = `${resolvedId}-label`;
  const descriptionId = description ? `${resolvedId}-description` : undefined;
  const ariaDescribedBy = joinIds(descriptionId, rest["aria-describedby"]);
  const ariaLabelledBy = joinIds(labelId, rest["aria-labelledby"]);
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(SWITCH_LABEL_STYLESHEET_ID, SWITCH_LABEL_STYLESHEET);
  }, []);

  return (
    <div
      className={joinClassNames(SWITCH_LABEL_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-has-description={String(Boolean(description))}
      data-size={sizeKey}
      style={style}
    >
      <Switch
        {...rest}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        brand={brand}
        disabled={disabled}
        id={resolvedId}
        size={size}
      />

      <label className={SWITCH_LABEL_CONTENT_CLASS} htmlFor={resolvedId}>
        <span className={SWITCH_LABEL_TEXT_CLASS} id={labelId}>
          {label}
        </span>
        {description ? (
          <p className={SWITCH_LABEL_DESCRIPTION_CLASS} id={descriptionId}>
            {description}
          </p>
        ) : null}
      </label>
    </div>
  );
}
