import { type CSSProperties, type ReactNode, useId, useInsertionEffect } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import { Checkbox, type CheckboxProps, type CheckboxSize } from "./checkbox";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalCheckboxLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.checkboxLabel"
);

export type CheckboxLabelSize = "Small" | "Medium" | "Large";

const CHECKBOX_LABEL_ROOT_CLASS = "geist-checkbox-label";
const CHECKBOX_LABEL_CONTENT_CLASS = "geist-checkbox-label__content";
const CHECKBOX_LABEL_TEXT_CLASS = "geist-checkbox-label__text";
const CHECKBOX_LABEL_DESCRIPTION_CLASS = "geist-checkbox-label__description";
const CHECKBOX_LABEL_STYLESHEET_ID = "geist-checkbox-label-styles";

export interface CheckboxLabelProps
  extends Omit<CheckboxProps, "className" | "size" | "style"> {
  className?: string;
  description?: ReactNode;
  label: ReactNode;
  size?: CheckboxLabelSize;
  style?: CSSProperties;
}

function getSizeKey(size: CheckboxLabelSize) {
  if (size === "Large") {
    return "lg";
  }

  if (size === "Medium") {
    return "md";
  }

  return "sm";
}

function getCheckboxSize(size: CheckboxLabelSize): CheckboxSize {
  if (size === "Large") {
    return "Extra Large";
  }

  if (size === "Medium") {
    return "Medium";
  }

  return "Small";
}

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

const CHECKBOX_LABEL_STYLESHEET = [
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}`, {
    "align-items": "flex-start",
    display: "flex",
    gap: runtimeTokenVarPx("component.checkboxLabel.layout.gap"),
    "max-width": "100%"
  }),
  toCssRule(`.${CHECKBOX_LABEL_CONTENT_CLASS}`, {
    cursor: "pointer",
    display: "flex",
    "flex": "1 1 auto",
    "flex-direction": "column",
    "max-width": "100%",
    "min-width": "0",
    "padding-inline": runtimeTokenVarPx("component.checkboxLabel.layout.contentPaddingInline")
  }),
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-disabled="true"] .${CHECKBOX_LABEL_CONTENT_CLASS}`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-has-description="true"] .${CHECKBOX_LABEL_CONTENT_CLASS}`, {
    gap: runtimeTokenVarPx("component.checkboxLabel.size.sm.contentGap")
  }),
  toCssRule(`.${CHECKBOX_LABEL_TEXT_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": "500",
    margin: "0"
  }),
  toCssRule(`.${CHECKBOX_LABEL_DESCRIPTION_CLASS}`, {
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": "400",
    margin: "0",
    "max-width": "100%"
  }),
  ...(["sm", "md", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-size="${sizeKey}"][data-has-description="true"] .${CHECKBOX_LABEL_CONTENT_CLASS}`, {
      gap: runtimeTokenVarPx(`component.checkboxLabel.size.${sizeKey}.contentGap`)
    }),
    toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${CHECKBOX_LABEL_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.checkboxLabel.typography.label.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.checkboxLabel.typography.label.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.checkboxLabel.typography.label.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${CHECKBOX_LABEL_DESCRIPTION_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.checkboxLabel.typography.description.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.checkboxLabel.typography.description.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.checkboxLabel.typography.description.${sizeKey}.lineHeight`)
    })
  ]),
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-disabled="false"] .${CHECKBOX_LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.checkboxLabel.color.label.default")
  }),
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-disabled="false"] .${CHECKBOX_LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.checkboxLabel.color.description.default")
  }),
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-disabled="true"] .${CHECKBOX_LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.checkboxLabel.color.label.disabled")
  }),
  toCssRule(`.${CHECKBOX_LABEL_ROOT_CLASS}[data-disabled="true"] .${CHECKBOX_LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.checkboxLabel.color.description.disabled")
  })
].join("");

export function CheckboxLabel({
  brand = "Cars24",
  className,
  description,
  disabled = false,
  id,
  label,
  size = "Small",
  style,
  ...rest
}: CheckboxLabelProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const sizeKey = getSizeKey(size);
  const labelId = `${resolvedId}-label`;
  const descriptionId = description ? `${resolvedId}-description` : undefined;
  const ariaDescribedBy = joinIds(descriptionId, rest["aria-describedby"]);
  const ariaLabelledBy = joinIds(labelId, rest["aria-labelledby"]);
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(CHECKBOX_LABEL_STYLESHEET_ID, CHECKBOX_LABEL_STYLESHEET);
  }, []);

  return (
    <div
      className={joinClassNames(CHECKBOX_LABEL_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-has-description={String(Boolean(description))}
      data-size={sizeKey}
      style={style}
    >
      <Checkbox
        {...rest}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        brand={brand}
        disabled={disabled}
        id={resolvedId}
        size={getCheckboxSize(size)}
      />

      <label className={CHECKBOX_LABEL_CONTENT_CLASS} htmlFor={resolvedId}>
        <span className={CHECKBOX_LABEL_TEXT_CLASS} id={labelId}>
          {label}
        </span>
        {description ? (
          <p className={CHECKBOX_LABEL_DESCRIPTION_CLASS} id={descriptionId}>
            {description}
          </p>
        ) : null}
      </label>
    </div>
  );
}
