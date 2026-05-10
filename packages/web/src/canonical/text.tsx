import type { HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  brand?: DisplayBrandId;
  tone?: "primary" | "secondary" | "muted" | "inverse";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  as?: "span" | "p" | "label" | "strong";
  children: ReactNode;
}

export function Text({
  brand = "Cars24",
  tone = "primary",
  size = "md",
  as: Element = "span",
  style,
  children,
  ...rest
}: TextProps) {
  const colorToken =
    tone === "secondary"
      ? "color.text.secondary"
      : tone === "muted"
        ? "color.text.muted"
        : tone === "inverse"
          ? "color.text.inverse"
          : "color.text.primary";

  const fontSize =
    size === "xs"
      ? Number(getRequiredThemeTokenValue(brand, "typography.fontSize.xs"))
      : size === "sm"
        ? Number(getRequiredThemeTokenValue(brand, "typography.fontSize.sm"))
        : size === "lg"
          ? Number(getRequiredThemeTokenValue(brand, "typography.fontSize.lg"))
          : size === "xl"
            ? Number(getRequiredThemeTokenValue(brand, "typography.fontSize.xl"))
            : Number(getRequiredThemeTokenValue(brand, "typography.fontSize.md"));

  const lineHeight =
    size === "xs"
      ? Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs"))
      : size === "sm"
        ? Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.sm"))
        : size === "lg"
          ? Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.lg"))
          : size === "xl"
            ? Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.xl"))
            : Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.md"));

  const fontWeight =
    Element === "strong"
      ? Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"))
      : Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));

  return (
    <Element
      {...rest}
      style={{
        color: String(getRequiredThemeTokenValue(brand, colorToken)),
        fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
        fontSize: pxToRem(fontSize),
        fontWeight,
        lineHeight: pxToRem(lineHeight),
        ...style
      }}
    >
      {children}
    </Element>
  );
}
