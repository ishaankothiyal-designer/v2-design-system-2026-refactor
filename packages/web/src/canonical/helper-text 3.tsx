import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

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

function getTypography(brand: DisplayBrandId, size: HelperTextSize): HelperTextTypography {
  const sizeKey = getSizeKey(size);

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.helper.${sizeKey}.fontSize`)),
    letterSpacing: Number(
      getRequiredThemeTokenValue(brand, `component.textInput.typography.helper.${sizeKey}.letterSpacing`)
    ),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.helper.${sizeKey}.lineHeight`))
  };
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

function makeTypographyStyles({
  brand,
  color,
  typography
}: {
  brand: DisplayBrandId;
  color: string;
  typography: HelperTextTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")),
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`,
    margin: 0
  };
}

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
  ...rest
}: HelperTextProps) {
  const sizeKey = getSizeKey(size);
  const toneKey = getToneKey(tone);
  const helperGap = Number(getRequiredThemeTokenValue(brand, `component.textInput.size.${sizeKey}.helperGap`));
  const resolvedIconSize = iconSize ?? Number(getRequiredThemeTokenValue(brand, "component.textInput.icon.helperSize"));
  const resolvedTypography = typography ?? getTypography(brand, size);
  const resolvedHelperTextColor =
    textColor ?? String(getRequiredThemeTokenValue(brand, `component.textInput.color.helper.${toneKey}.text`));
  const resolvedHelperIconColor =
    iconColor ?? String(getRequiredThemeTokenValue(brand, `component.textInput.color.helper.${toneKey}.icon`));
  const resolvedCounterColor =
    counterColor ?? String(getRequiredThemeTokenValue(brand, "component.textInput.color.helper.default.text"));
  const resolvedCounterTypography = counterTypography ?? resolvedTypography;
  const showCounter = counterText !== undefined && counterText !== null;
  const resolvedWidth = fullWidth ?? showCounter;

  const helperTextStyles = {
    ...makeTypographyStyles({
      brand,
      color: resolvedHelperTextColor,
      typography: resolvedTypography
    }),
    flex: "1 1 auto",
    minWidth: 0
  } satisfies CSSProperties;

  const counterTextStyles = {
    ...makeTypographyStyles({
      brand,
      color: resolvedCounterColor,
      typography: resolvedCounterTypography
    }),
    flex: "0 0 auto",
    whiteSpace: "nowrap"
  } satisfies CSSProperties;

  return (
    <div
      {...rest}
      style={{
        alignItems: align === "start" ? "flex-start" : "center",
        display: "flex",
        gap: `${helperGap}px`,
        minWidth: 0,
        width: resolvedWidth ? "100%" : "fit-content",
        ...style
      }}
    >
      {showIcon ? (
        <Icon
          decorative
          brand={brand}
          name={iconName ?? getIconName(tone)}
          style={{
            color: resolvedHelperIconColor,
            flex: "0 0 auto",
            fontSize: `${resolvedIconSize}px`
          }}
        />
      ) : null}
      <span style={helperTextStyles}>{helperText}</span>
      {showCounter ? <span style={counterTextStyles}>{counterText}</span> : null}
    </div>
  );
}
