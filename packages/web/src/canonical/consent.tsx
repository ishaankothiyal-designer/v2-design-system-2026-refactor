import { type CSSProperties, type ReactNode, useId, useInsertionEffect } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { normalizeBrandId } from "@turbo/tokens";
import { Checkbox, type CheckboxProps, type CheckboxSize } from "./checkbox";
import { Text } from "./text";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalConsentWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.consent"
);

export type ConsentSize = "Small" | "Medium" | "Large";

const CONSENT_ROOT_CLASS = "geist-consent";
const CONSENT_CONTENT_CLASS = "geist-consent__content";
const CONSENT_TEXT_CLASS = "geist-consent__text";
const CONSENT_STYLESHEET_ID = "geist-consent-styles";

export interface ConsentProps extends Omit<CheckboxProps, "className" | "size" | "style"> {
  brand?: DisplayBrandId;
  className?: string;
  insideCard?: boolean;
  label: ReactNode;
  size?: ConsentSize;
  style?: CSSProperties;
}

function getSizeKey(size: ConsentSize) {
  if (size === "Large") {
    return "lg";
  }

  if (size === "Medium") {
    return "md";
  }

  return "sm";
}

function getCheckboxSize(size: ConsentSize): CheckboxSize {
  return size === "Large" ? "Medium" : "Small";
}

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

const CONSENT_STYLESHEET = [
  toCssRule(`.${CONSENT_ROOT_CLASS}`, {
    "align-items": "flex-start",
    background: "transparent",
    "border-radius": "0px",
    "box-sizing": "border-box",
    display: "flex",
    gap: runtimeTokenVarPx("component.consent.layout.gap"),
    "max-width": "100%",
    padding: `${runtimeTokenVarPx("component.consent.layout.paddingBlock")} ${runtimeTokenVarPx("component.consent.layout.paddingInline")}`,
    width: "100%"
  }),
  toCssRule(`.${CONSENT_CONTENT_CLASS}`, {
    cursor: "pointer",
    display: "flex",
    "flex": "1 1 auto",
    "min-width": "0"
  }),
  toCssRule(`.${CONSENT_ROOT_CLASS}[data-disabled="true"] .${CONSENT_CONTENT_CLASS}`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${CONSENT_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.consent.content.color.default"),
    display: "block",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    margin: "0"
  }),
  ...(["sm", "md", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${CONSENT_ROOT_CLASS}[data-size="${sizeKey}"][data-inside-card="false"] .${CONSENT_CONTENT_CLASS}`, {
      "padding-bottom": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.paddingBottom`),
      "padding-top": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.paddingTop`)
    }),
    toCssRule(`.${CONSENT_ROOT_CLASS}[data-size="${sizeKey}"][data-inside-card="true"]`, {
      background: runtimeTokenVar("component.consent.layout.insideCard.background"),
      "border-radius": runtimeTokenVarPx(`component.consent.layout.insideCard.${sizeKey}.radius`),
      padding: `${runtimeTokenVarPx(`component.consent.layout.insideCard.${sizeKey}.padding`)} ${runtimeTokenVarPx(`component.consent.layout.insideCard.${sizeKey}.padding`)}`
    }),
    toCssRule(`.${CONSENT_ROOT_CLASS}[data-size="${sizeKey}"][data-inside-card="true"] .${CONSENT_CONTENT_CLASS}`, {
      "padding-bottom": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.insideCardPaddingBottom`),
      "padding-top": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.insideCardPaddingTop`)
    }),
    toCssRule(`.${CONSENT_ROOT_CLASS}[data-size="${sizeKey}"] .${CONSENT_TEXT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.consent.content.size.${sizeKey}.lineHeight`)
    })
  ]),
  toCssRule(`.${CONSENT_ROOT_CLASS}[data-disabled="true"] .${CONSENT_TEXT_CLASS}`, {
    color: runtimeTokenVar("component.consent.content.color.disabled")
  })
].join("");

export function Consent({
  brand = "Cars24",
  checked,
  className,
  disabled = false,
  id,
  insideCard = false,
  label,
  size = "Small",
  style,
  ...rest
}: ConsentProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const sizeKey = getSizeKey(size);
  const labelId = `${resolvedId}-label`;
  const ariaLabelledBy = joinIds(labelId, rest["aria-labelledby"]);
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(CONSENT_STYLESHEET_ID, CONSENT_STYLESHEET);
  }, []);

  return (
    <div
      className={joinClassNames(CONSENT_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-inside-card={String(insideCard)}
      data-size={sizeKey}
      style={style}
    >
      <Checkbox
        {...rest}
        aria-labelledby={ariaLabelledBy}
        brand={brand}
        checked={checked}
        disabled={disabled}
        id={resolvedId}
        size={getCheckboxSize(size)}
      />

      <label className={CONSENT_CONTENT_CLASS} htmlFor={resolvedId}>
        <Text
          as="span"
          brand={brand}
          className={CONSENT_TEXT_CLASS}
          id={labelId}
          tone="secondary"
        >
          {label}
        </Text>
      </label>
    </div>
  );
}
