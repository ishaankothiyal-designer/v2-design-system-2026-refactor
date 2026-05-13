import { type HTMLAttributes, type ReactNode, useInsertionEffect } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import { Icon } from "./icon";
import {
  ensureStyleSheet,
  joinClassNames,
  runtimeTokenVar,
  runtimeTokenVarPx,
  toCssRule,
} from "./runtime-styles";

export const canonicalLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.label"
);

export type LabelSize = "Extra Small" | "Small" | "Medium" | "Large";

const LABEL_ROOT_CLASS = "geist-label";
const LABEL_ROW_CLASS = "geist-label__row";
const LABEL_TEXT_CLASS = "geist-label__text";
const LABEL_REQUIRED_CLASS = "geist-label__required";
const LABEL_INFO_CLASS = "geist-label__info";
const LABEL_DESCRIPTION_CLASS = "geist-label__description";
const LABEL_STYLESHEET_ID = "geist-label-styles";

export interface LabelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  size?: LabelSize;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
  showInfoIcon?: boolean;
  infoIconLabel?: string;
}

function getSizeKey(size: LabelSize) {
  if (size === "Large") {
    return "lg";
  }

  if (size === "Medium") {
    return "md";
  }

  if (size === "Small") {
    return "sm";
  }

  return "xs";
}

const LABEL_STYLESHEET = [
  toCssRule(`.${LABEL_ROOT_CLASS}`, {
    display: "flex",
    "flex-direction": "column",
    "max-width": "100%",
    "min-width": "0"
  }),
  toCssRule(`.${LABEL_ROOT_CLASS}[data-has-description="true"]`, {
    gap: runtimeTokenVarPx("component.label.xs.stackGap")
  }),
  toCssRule(`.${LABEL_ROW_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    "max-width": "100%",
    width: "fit-content"
  }),
  toCssRule(`.${LABEL_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.phoneInput.color.label.default"),
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.medium"),
    margin: "0"
  }),
  toCssRule(`.${LABEL_REQUIRED_CLASS}`, {
    color: runtimeTokenVar("component.phoneInput.color.label.required"),
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    margin: "0"
  }),
  toCssRule(`.${LABEL_INFO_CLASS}`, {
    color: runtimeTokenVar("component.phoneInput.color.label.info"),
    display: "inline-flex",
    "flex": "0 0 auto",
    "line-height": "0"
  }),
  toCssRule(`.${LABEL_DESCRIPTION_CLASS}`, {
    color: runtimeTokenVar("component.phoneInput.color.helper.default.text"),
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    margin: "0",
    "max-width": "100%"
  }),
  ...(["xs", "sm", "md", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${LABEL_ROOT_CLASS}[data-size="${sizeKey}"][data-has-description="true"]`, {
      gap: runtimeTokenVarPx(`component.label.${sizeKey}.stackGap`)
    }),
    toCssRule(`.${LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${LABEL_ROW_CLASS}`, {
      gap: runtimeTokenVarPx(`component.label.${sizeKey}.slotGap`)
    }),
    toCssRule(`.${LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${LABEL_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.label.${sizeKey}.typography.label.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.label.${sizeKey}.typography.label.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.label.${sizeKey}.typography.label.lineHeight`)
    }),
    toCssRule(`.${LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${LABEL_REQUIRED_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.label.${sizeKey}.typography.label.fontSize`),
      "font-weight":
        sizeKey === "lg" || sizeKey === "md"
          ? runtimeTokenVar("typography.fontWeight.medium")
          : runtimeTokenVar("typography.fontWeight.regular"),
      "letter-spacing": runtimeTokenVarPx(`component.label.${sizeKey}.typography.label.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.label.${sizeKey}.typography.label.lineHeight`)
    }),
    toCssRule(`.${LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${LABEL_INFO_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.label.${sizeKey}.iconSize`)
    }),
    toCssRule(`.${LABEL_ROOT_CLASS}[data-size="${sizeKey}"] .${LABEL_DESCRIPTION_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.label.${sizeKey}.typography.description.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.label.${sizeKey}.typography.description.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.label.${sizeKey}.typography.description.lineHeight`)
    })
  ])
].join("");

export function Label({
  brand = "Cars24",
  size = "Medium",
  label,
  description,
  required = false,
  showInfoIcon = false,
  infoIconLabel,
  className,
  style,
  ...rest
}: LabelProps) {
  const repoBrand = normalizeBrandId(brand);
  const sizeKey = getSizeKey(size);

  useInsertionEffect(() => {
    ensureStyleSheet(LABEL_STYLESHEET_ID, LABEL_STYLESHEET);
  }, []);

  return (
    <div
      {...rest}
      className={joinClassNames(LABEL_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-has-description={String(Boolean(description))}
      data-size={sizeKey}
      style={style}
    >
      <div className={LABEL_ROW_CLASS}>
        <span className={LABEL_TEXT_CLASS}>{label}</span>
        {required ? (
          <span aria-hidden="true" className={LABEL_REQUIRED_CLASS}>
            *
          </span>
        ) : null}
        {showInfoIcon ? (
          <span className={LABEL_INFO_CLASS}>
            <Icon
              decorative={!infoIconLabel}
              name="info-filled"
              {...(infoIconLabel ? { label: infoIconLabel } : {})}
              style={{ color: "inherit", fontSize: "inherit" }}
            />
          </span>
        ) : null}
      </div>
      {description ? <p className={LABEL_DESCRIPTION_CLASS}>{description}</p> : null}
    </div>
  );
}
