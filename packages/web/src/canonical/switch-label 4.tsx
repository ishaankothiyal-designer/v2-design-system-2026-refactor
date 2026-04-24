import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";
import { designSystemRegistry } from "@geist/contracts";
import type { DisplayBrandId } from "@geist/tokens";
import { Switch, type SwitchProps, type SwitchSize } from "./switch";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalSwitchLabelWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.switchLabel"
);

export type SwitchLabelSize = SwitchSize;

type SwitchLabelTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

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

function getTypography(brand: DisplayBrandId, path: string): SwitchLabelTypography {
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
  typography: SwitchLabelTypography;
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
  const layoutGap = Number(getRequiredThemeTokenValue(brand, "component.switchLabel.layout.gap"));
  const contentPaddingInline = Number(
    getRequiredThemeTokenValue(brand, "component.switchLabel.layout.contentPaddingInline")
  );
  const contentGap = Number(
    getRequiredThemeTokenValue(brand, `component.switchLabel.size.${sizeKey}.contentGap`)
  );
  const labelTypography = getTypography(brand, `component.switchLabel.typography.label.${sizeKey}`);
  const descriptionTypography = getTypography(
    brand,
    `component.switchLabel.typography.description.${sizeKey}`
  );
  const labelColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled ? "component.switchLabel.color.label.disabled" : "component.switchLabel.color.label.default"
    )
  );
  const descriptionColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled
        ? "component.switchLabel.color.description.disabled"
        : "component.switchLabel.color.description.default"
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
      <Switch
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
