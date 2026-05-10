import { type CSSProperties, type HTMLAttributes, type ReactNode, useInsertionEffect } from "react";
import type { IconName } from "@turbo/icons";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@turbo/tokens";
import { Icon } from "./icon";
import {
  ensureStyleSheet,
  joinClassNames,
  runtimeTokenVar,
  runtimeTokenVarPx,
  toCssRule,
  toRem
} from "./runtime-styles";

export const canonicalHelperTextWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.helperText"
);

export type HelperTextSize = "Small" | "Large";
export type HelperTextTone = "Default" | "Error" | "Success";

export type HelperTextTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

const HELPER_TEXT_ROOT_CLASS = "geist-helper-text";
const HELPER_TEXT_ICON_CLASS = "geist-helper-text__icon";
const HELPER_TEXT_COPY_CLASS = "geist-helper-text__copy";
const HELPER_TEXT_COUNTER_CLASS = "geist-helper-text__counter";
const HELPER_TEXT_STYLESHEET_ID = "geist-helper-text-styles";

export interface HelperTextProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  align?: "center" | "start";
  brand?: DisplayBrandId;
  counterText?: ReactNode;
  counterColor?: string;
  counterTypography?: HelperTextTypography;
  fullWidth?: boolean;
  helperText: ReactNode;
  iconColor?: string;
  iconName?: IconName;
  iconSize?: number;
  showIcon?: boolean;
  size?: HelperTextSize;
  textColor?: string;
  typography?: HelperTextTypography;
  tone?: HelperTextTone;
}

function getSizeKey(size: HelperTextSize) {
  return size === "Large" ? "lg" : "sm";
}

function getToneKey(tone: HelperTextTone) {
  if (tone === "Error") {
    return "error";
  }

  if (tone === "Success") {
    return "success";
  }

  return "default";
}

function getIconName(tone: HelperTextTone): IconName {
  if (tone === "Error") {
    return "error-outline";
  }

  if (tone === "Success") {
    return "circle-check-line";
  }

  return "info-outline";
}

function buildTypographyVariables(prefix: string, typography: HelperTextTypography | undefined) {
  if (!typography) {
    return undefined;
  }

  return {
    ...(prefix ? {} : {}),
    "font-size": toRem(typography.fontSize),
    "letter-spacing": toRem(typography.letterSpacing),
    "line-height": toRem(typography.lineHeight)
  } as CSSProperties;
}

const HELPER_TEXT_STYLESHEET = [
  toCssRule(`.${HELPER_TEXT_ROOT_CLASS}`, {
    "align-items": "center",
    display: "flex",
    gap: runtimeTokenVarPx("component.textInput.size.sm.helperGap"),
    "min-width": "0",
    width: "fit-content"
  }),
  toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-size="lg"]`, {
    gap: runtimeTokenVarPx("component.textInput.size.lg.helperGap")
  }),
  toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-align="start"]`, {
    "align-items": "flex-start"
  }),
  toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-full-width="true"]`, {
    width: "100%"
  }),
  toCssRule(`.${HELPER_TEXT_ICON_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.helper.default.icon"),
    display: "inline-flex",
    "flex": "0 0 auto",
    "font-size": runtimeTokenVarPx("component.textInput.icon.helperSize"),
    "line-height": "0"
  }),
  toCssRule(`.${HELPER_TEXT_COPY_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.helper.default.text"),
    "flex": "1 1 auto",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "min-width": "0",
    margin: "0"
  }),
  toCssRule(`.${HELPER_TEXT_COUNTER_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.helper.default.text"),
    "flex": "0 0 auto",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "white-space": "nowrap"
  }),
  ...(["sm", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-size="${sizeKey}"] .${HELPER_TEXT_COPY_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.textInput.typography.helper.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.textInput.typography.helper.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.textInput.typography.helper.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-size="${sizeKey}"] .${HELPER_TEXT_COUNTER_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.textInput.typography.helper.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.textInput.typography.helper.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.textInput.typography.helper.${sizeKey}.lineHeight`)
    })
  ]),
  ...(["default", "error", "success"] as const).flatMap((toneKey) => [
    toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-tone="${toneKey}"] .${HELPER_TEXT_ICON_CLASS}`, {
      color: runtimeTokenVar(`component.textInput.color.helper.${toneKey}.icon`)
    }),
    toCssRule(`.${HELPER_TEXT_ROOT_CLASS}[data-tone="${toneKey}"] .${HELPER_TEXT_COPY_CLASS}`, {
      color: runtimeTokenVar(`component.textInput.color.helper.${toneKey}.text`)
    })
  ])
].join("");

export function HelperText({
  align = "center",
  brand = "Cars24",
  counterText,
  counterColor,
  counterTypography,
  fullWidth,
  helperText,
  iconColor,
  iconName,
  iconSize,
  showIcon = true,
  size = "Small",
  style,
  textColor,
  typography,
  tone = "Default",
  className,
  ...rest
}: HelperTextProps) {
  const toneKey = getToneKey(tone);
  const sizeKey = getSizeKey(size);
  const showCounter = counterText !== undefined && counterText !== null;
  const resolvedWidth = fullWidth ?? showCounter;
  const repoBrand = normalizeBrandId(brand);

  useInsertionEffect(() => {
    ensureStyleSheet(HELPER_TEXT_STYLESHEET_ID, HELPER_TEXT_STYLESHEET);
  }, []);

  const copyTypographyStyle = buildTypographyVariables("", typography);
  const counterTypographyStyle = buildTypographyVariables("", counterTypography ?? typography);

  return (
    <div
      {...rest}
      className={joinClassNames(HELPER_TEXT_ROOT_CLASS, className)}
      data-align={align}
      data-brand={repoBrand}
      data-full-width={String(Boolean(resolvedWidth))}
      data-size={sizeKey}
      data-tone={toneKey}
      style={style}
    >
      {showIcon ? (
        <span
          className={HELPER_TEXT_ICON_CLASS}
          style={{
            color: iconColor,
            fontSize: iconSize !== undefined ? toRem(iconSize) : undefined
          }}
        >
          <Icon
            decorative
            brand={brand}
            name={iconName ?? getIconName(tone)}
            style={{ color: "inherit", fontSize: "inherit" }}
          />
        </span>
      ) : null}
      <span className={HELPER_TEXT_COPY_CLASS} style={{ ...copyTypographyStyle, color: textColor }}>
        {helperText}
      </span>
      {showCounter ? (
        <span className={HELPER_TEXT_COUNTER_CLASS} style={{ ...counterTypographyStyle, color: counterColor }}>
          {counterText}
        </span>
      ) : null}
    </div>
  );
}
