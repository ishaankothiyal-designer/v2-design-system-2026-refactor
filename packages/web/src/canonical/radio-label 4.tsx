import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Radio, type RadioProps, type RadioSize } from "./radio";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalRadioLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.radioLabel"
);

export type RadioLabelSize = RadioSize;

type RadioLabelTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

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

function getTypography(brand: DisplayBrandId, path: string): RadioLabelTypography {
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
  typography: RadioLabelTypography;
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

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

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
  const layoutGap = Number(getRequiredThemeTokenValue(brand, "component.radioLabel.layout.gap"));
  const contentPaddingInline = Number(
    getRequiredThemeTokenValue(brand, "component.radioLabel.layout.contentPaddingInline")
  );
  const contentGap = Number(
    getRequiredThemeTokenValue(brand, `component.radioLabel.size.${sizeKey}.contentGap`)
  );
  const labelTypography = getTypography(brand, `component.radioLabel.typography.label.${sizeKey}`);
  const descriptionTypography = getTypography(
    brand,
    `component.radioLabel.typography.description.${sizeKey}`
  );
  const labelColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled ? "component.radioLabel.color.label.disabled" : "component.radioLabel.color.label.default"
    )
  );
  const descriptionColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled
        ? "component.radioLabel.color.description.disabled"
        : "component.radioLabel.color.description.default"
    )
  );
  const labelStyles = makeTypographyStyles({
    brand,
    color: labelColor,
    fontWeightPath: "typography.fontWeight.medium",
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
  const ariaDescribedBy = joinIds(descriptionId, rest["aria-describedby"]);
  const ariaLabelledBy = joinIds(labelId, rest["aria-labelledby"]);

  return (
    <div
      className={className}
      style={{
        alignItems: "flex-start",
        display: "flex",
        gap: layoutGap,
        maxWidth: "100%",
        ...style
      }}
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

      <label
        htmlFor={resolvedId}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          gap: description ? contentGap : 0,
          maxWidth: "100%",
          minWidth: 0,
          paddingInline: contentPaddingInline
        }}
      >
        <span id={labelId} style={labelStyles}>
          {label}
        </span>
        {description ? (
          <p id={descriptionId} style={descriptionStyles}>
            {description}
          </p>
        ) : null}
      </label>
    </div>
  );
}
