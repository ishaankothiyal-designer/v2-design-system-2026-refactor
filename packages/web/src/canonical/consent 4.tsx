import type { CSSProperties, ReactNode } from "react";
import { useId } from "react";
import { designSystemRegistry } from "@geist/contracts";
import type { DisplayBrandId } from "@geist/tokens";
import { Checkbox, type CheckboxProps, type CheckboxSize } from "./checkbox";
import { Text } from "./text";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalConsentWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.consent"
);

export type ConsentSize = "Small" | "Medium" | "Large";

type ConsentTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

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

function getTypography(brand: DisplayBrandId, size: ConsentSize): ConsentTypography {
  const sizeKey = getSizeKey(size);

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `component.consent.content.size.${sizeKey}.fontSize`)),
    letterSpacing: Number(
      getRequiredThemeTokenValue(brand, `component.consent.content.size.${sizeKey}.letterSpacing`)
    ),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `component.consent.content.size.${sizeKey}.lineHeight`))
  };
}

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

/**
 * Checkbox-based consent copy row that follows the Figma component variants without introducing a new input primitive.
 */
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
  const typography = getTypography(brand, size);
  const rootGap = Number(getRequiredThemeTokenValue(brand, "component.consent.layout.gap"));
  const textColor = String(
    getRequiredThemeTokenValue(
      brand,
      disabled
        ? "component.consent.content.color.disabled"
        : "component.consent.content.color.default"
    )
  );
  const outerPaddingInline = insideCard
    ? Number(getRequiredThemeTokenValue(brand, `component.consent.layout.insideCard.${sizeKey}.padding`))
    : Number(getRequiredThemeTokenValue(brand, "component.consent.layout.paddingInline"));
  const outerPaddingBlock = insideCard
    ? Number(getRequiredThemeTokenValue(brand, `component.consent.layout.insideCard.${sizeKey}.padding`))
    : Number(getRequiredThemeTokenValue(brand, "component.consent.layout.paddingBlock"));
  const contentPaddingTop = Number(
    getRequiredThemeTokenValue(
      brand,
      insideCard
        ? `component.consent.content.size.${sizeKey}.insideCardPaddingTop`
        : `component.consent.content.size.${sizeKey}.paddingTop`
    )
  );
  const contentPaddingBottom = Number(
    getRequiredThemeTokenValue(
      brand,
      insideCard
        ? `component.consent.content.size.${sizeKey}.insideCardPaddingBottom`
        : `component.consent.content.size.${sizeKey}.paddingBottom`
    )
  );
  const rootBackground = insideCard
    ? String(getRequiredThemeTokenValue(brand, "component.consent.layout.insideCard.background"))
    : "transparent";
  const rootRadius = insideCard
    ? Number(getRequiredThemeTokenValue(brand, `component.consent.layout.insideCard.${sizeKey}.radius`))
    : 0;
  const ariaLabelledBy = joinIds(labelId, rest["aria-labelledby"]);

  return (
    <div
      className={className}
      style={{
        alignItems: "flex-start",
        background: rootBackground,
        borderRadius: rootRadius > 0 ? `${rootRadius}px` : undefined,
        boxSizing: "border-box",
        display: "flex",
        gap: rootGap,
        maxWidth: "100%",
        padding: `${outerPaddingBlock}px ${outerPaddingInline}px`,
        width: "100%",
        ...style
      }}
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

      <label
        htmlFor={resolvedId}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flex: "1 1 auto",
          minWidth: 0,
          paddingBottom: contentPaddingBottom,
          paddingTop: contentPaddingTop
        }}
      >
        <Text
          as="span"
          brand={brand}
          id={labelId}
          style={{
            color: textColor,
            display: "block",
            fontSize: typography.fontSize,
            letterSpacing: typography.letterSpacing,
            lineHeight: `${typography.lineHeight}px`,
            margin: 0
          }}
          tone="secondary"
        >
          {label}
        </Text>
      </label>
    </div>
  );
}
