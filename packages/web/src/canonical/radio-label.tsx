import { type CSSProperties, type ReactNode, useId, useInsertionEffect } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import { Radio, type RadioProps, type RadioSize } from "./radio";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalRadioLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.radioLabel"
);

export type RadioLabelSize = RadioSize;

const RADIO_LABEL_ROOT_CLASS = "geist-radio-label";
const RADIO_LABEL_CONTENT_CLASS = "geist-radio-label__content";
const RADIO_LABEL_TEXT_CLASS = "geist-radio-label__text";
const RADIO_LABEL_DESCRIPTION_CLASS = "geist-radio-label__description";
const RADIO_LABEL_STYLESHEET_ID = "geist-radio-label-styles";

export interface RadioLabelProps extends Omit<RadioProps, "className" | "size" | "style"> {
  brand?: DisplayBrandId;
  className?: string;
  description?: ReactNode;
  label: ReactNode;
  size?: RadioLabelSize;
  style?: CSSProperties;
}

function getSizeKey(size: RadioLabelSize) {
  return size === "Medium" ? "md" : "sm";
}

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

const RADIO_LABEL_STYLESHEET = [
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}`, {
    "align-items": "flex-start",
    display: "flex",
    gap: runtimeTokenVarPx("component.radioLabel.layout.gap"),
    "max-width": "100%"
  }),
  toCssRule(`.${RADIO_LABEL_CONTENT_CLASS}`, {
    cursor: "pointer",
    display: "flex",
    "flex": "1 1 auto",
    "flex-direction": "column",
    "max-width": "100%",
    "min-width": "0",
    "padding-inline": runtimeTokenVarPx("component.radioLabel.layout.contentPaddingInline")
  }),
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-disabled="true"] .${RADIO_LABEL_CONTENT_CLASS}`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-has-description="true"] .${RADIO_LABEL_CONTENT_CLASS}`, {
    gap: runtimeTokenVarPx("component.radioLabel.size.sm.contentGap")
  }),
  toCssRule(`.${RADIO_LABEL_TEXT_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": "500",
    margin: "0"
  }),
  toCssRule(`.${RADIO_LABEL_DESCRIPTION_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": "400",
    margin: "0",
    "max-width": "100%"
  }),
  ...(["sm", "md"] as const).flatMap((sizeKey) => [
    toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-size="${sizeKey}"][data-has-description="true"] .${RADIO_LABEL_CONTENT_CLASS}`, {
      gap: runtimeTokenVarPx(`component.radioLabel.size.${sizeKey}.contentGap`)
    }),
    toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${RADIO_LABEL_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.radioLabel.typography.label.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.radioLabel.typography.label.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.radioLabel.typography.label.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${RADIO_LABEL_DESCRIPTION_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.radioLabel.typography.description.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.radioLabel.typography.description.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.radioLabel.typography.description.${sizeKey}.lineHeight`)
    })
  ]),
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-disabled="false"] .${RADIO_LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.radioLabel.color.label.default")
  }),
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-disabled="false"] .${RADIO_LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.radioLabel.color.description.default")
  }),
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-disabled="true"] .${RADIO_LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.radioLabel.color.label.disabled")
  }),
  toCssRule(`.${RADIO_LABEL_ROOT_CLASS}[data-disabled="true"] .${RADIO_LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.radioLabel.color.description.disabled")
  })
].join("");

export function RadioLabel({
  brand = "Cars24",
  className,
  description,
  disabled = false,
  id,
  label,
  size = "Small",
  style,
  ...rest
}: RadioLabelProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const sizeKey = getSizeKey(size);
  const labelId = `${resolvedId}-label`;
  const descriptionId = description ? `${resolvedId}-description` : undefined;
  const ariaDescribedBy = joinIds(descriptionId, rest["aria-describedby"]);
  const ariaLabelledBy = joinIds(labelId, rest["aria-labelledby"]);
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(RADIO_LABEL_STYLESHEET_ID, RADIO_LABEL_STYLESHEET);
  }, []);

  return (
    <div
      className={joinClassNames(RADIO_LABEL_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-has-description={String(Boolean(description))}
      data-size={sizeKey}
      style={style}
    >
      <Radio
        {...rest}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        brand={brand}
        disabled={disabled}
        id={resolvedId}
        size={size}
      />

      <label className={RADIO_LABEL_CONTENT_CLASS} htmlFor={resolvedId}>
        <span className={RADIO_LABEL_TEXT_CLASS} id={labelId}>
          {label}
        </span>
        {description ? (
          <p className={RADIO_LABEL_DESCRIPTION_CLASS} id={descriptionId}>
            {description}
          </p>
        ) : null}
      </label>
    </div>
  );
}
