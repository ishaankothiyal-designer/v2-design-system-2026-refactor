import type { PropsWithChildren } from "react";
import { Text as RNText } from "react-native";
import type { BrandId } from "@geist/tokens";
import { getRequiredNativeThemeTokenValue } from "../theme";

export interface TextProps {
  brand?: BrandId;
  tone?: "primary" | "secondary" | "muted" | "inverse";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Text({
  brand = "core",
  tone = "primary",
  size = "md",
  children
}: PropsWithChildren<TextProps>) {
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
      ? Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.xs"))
      : size === "sm"
        ? Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.sm"))
        : size === "lg"
          ? Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.lg"))
          : size === "xl"
            ? Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.xl"))
            : Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.md"));

  const lineHeight =
    size === "xs"
      ? Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.xs"))
      : size === "sm"
        ? Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.sm"))
        : size === "lg"
          ? Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.lg"))
          : size === "xl"
            ? Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.xl"))
            : Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.md"));

  return (
    <RNText
      style={{
        color: String(getRequiredNativeThemeTokenValue(brand, colorToken)),
        fontFamily: String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans")),
        fontSize,
        lineHeight
      }}
    >
      {children}
    </RNText>
  );
}
