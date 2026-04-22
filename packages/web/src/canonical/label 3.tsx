import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.label"
);

export type LabelSize = "Extra Small" | "Small" | "Medium" | "Large";

type LabelTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

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

function getTypography(brand: DisplayBrandId, path: string): LabelTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${path}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${path}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${path}.lineHeight`))
  };
}

function makeTypographyStyles({
  brand,
  color,
  fontWeightPath,
  typography
}: {
  brand: DisplayBrandId;
  color: string;
  fontWeightPath: string;
  typography: LabelTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: typography.fontSize,
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: typography.letterSpacing,
    lineHeight: `${typography.lineHeight}px`,
    margin: 0
  };
}

export function Label({
  brand = "Cars24",
  size = "Medium",
  label,
  description,
  required = false,
  showInfoIcon = false,
  infoIconLabel,
  style,
  ...rest
}: LabelProps) {
  const sizeKey = getSizeKey(size);
  const tokenPrefix = `component.label.${sizeKey}`;
  const stackGap = Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.stackGap`));
  const slotGap = Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.slotGap`));
  const labelTypography = getTypography(brand, `${tokenPrefix}.typography.label`);
  const descriptionTypography = getTypography(brand, `${tokenPrefix}.typography.description`);
  const labelColor = String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.label.default"));
  const descriptionColor = String(
    getRequiredThemeTokenValue(brand, "component.phoneInput.color.helper.default.text")
  );
  const requiredColor = String(
    getRequiredThemeTokenValue(brand, "component.phoneInput.color.label.required")
  );
  const infoColor = String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.label.info"));
  const infoIconSize = Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.iconSize`));

  const labelStyles = makeTypographyStyles({
    brand,
    color: labelColor,
    fontWeightPath: "typography.fontWeight.medium",
    typography: labelTypography
  });
  const requiredStyles = makeTypographyStyles({
    brand,
    color: requiredColor,
    fontWeightPath:
      sizeKey === "lg" || sizeKey === "md"
        ? "typography.fontWeight.medium"
        : "typography.fontWeight.regular",
    typography: labelTypography
  });
  const descriptionStyles = {
    ...makeTypographyStyles({
      brand,
      color: descriptionColor,
      fontWeightPath: "typography.fontWeight.regular",
      typography: descriptionTypography
    }),
    maxWidth: "100%"
  } satisfies CSSProperties;

  return (
    <div
      {...rest}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: description ? stackGap : 0,
        maxWidth: "100%",
        minWidth: 0,
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "inline-flex",
          gap: slotGap,
          maxWidth: "100%",
          width: "fit-content"
        }}
      >
        <span style={labelStyles}>{label}</span>
        {required ? (
          <span aria-hidden="true" style={requiredStyles}>
            *
          </span>
        ) : null}
        {showInfoIcon ? (
          <Icon
            decorative={!infoIconLabel}
            name="info-filled"
            {...(infoIconLabel ? { label: infoIconLabel } : {})}
            style={{
              color: infoColor,
              flex: "0 0 auto",
              fontSize: infoIconSize
            }}
          />
        ) : null}
      </div>
      {description ? <p style={descriptionStyles}>{description}</p> : null}
    </div>
  );
}
