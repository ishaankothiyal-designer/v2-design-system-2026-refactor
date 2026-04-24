import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Checkbox, type CheckboxProps, type CheckboxSize } from "./checkbox";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalCheckboxLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.checkboxLabel"
);

export type CheckboxLabelSize = "Small" | "Medium" | "Large";

type CheckboxLabelTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

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

function getTypography(brand: DisplayBrandId, path: string): CheckboxLabelTypography {
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
  typography: CheckboxLabelTypography;
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
  const layoutGap = Number(getRequiredThemeTokenValue(brand, "component.checkboxLabel.layout.gap"));
  const contentPaddingInline = Number(
    getRequiredThemeTokenValue(brand, "component.checkboxLabel.layout.contentPaddingInline")
  );
  const contentGap = Number(
    getRequiredThemeTokenValue(brand, `component.checkboxLabel.size.${sizeKey}.contentGap`)
  );
  const labelTypography = getTypography(
    brand,
    `component.checkboxLabel.typography.label.${sizeKey}`
  );
  const descriptionTypography = getTypography(
    brand,
    `component.checkboxLabel.typography.description.${sizeKey}`
  );
  const labelColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled
        ? "component.checkboxLabel.color.label.disabled"
        : "component.checkboxLabel.color.label.default"
    )
  );
  const descriptionColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled
        ? "component.checkboxLabel.color.description.disabled"
        : "component.checkboxLabel.color.description.default"
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
      <Checkbox
        {...rest}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={ariaLabelledBy}
        brand={brand}
        disabled={disabled}
        id={resolvedId}
        size={getCheckboxSize(size)}
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
