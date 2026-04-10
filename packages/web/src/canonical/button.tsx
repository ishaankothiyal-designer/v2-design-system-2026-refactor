import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { BrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.button"
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  brand?: BrandId;
  tone?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  brand = "core",
  tone = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  children,
  style,
  ...rest
}: ButtonProps) {
  const backgroundColor =
    tone === "primary"
      ? String(getRequiredThemeTokenValue(brand, "color.brand.primary.600"))
      : tone === "secondary"
        ? String(getRequiredThemeTokenValue(brand, "color.brand.secondary.600"))
        : String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));

  const color =
    tone === "ghost"
      ? String(getRequiredThemeTokenValue(brand, "color.text.primary"))
      : String(getRequiredThemeTokenValue(brand, "color.text.inverse"));

  const fontSize =
    size === "sm"
      ? Number(getRequiredThemeTokenValue(brand, "typography.fontSize.sm"))
      : size === "lg"
        ? Number(getRequiredThemeTokenValue(brand, "typography.fontSize.lg"))
        : Number(getRequiredThemeTokenValue(brand, "typography.fontSize.md"));

  const lineHeight =
    size === "sm"
      ? Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.sm"))
      : size === "lg"
        ? Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.lg"))
        : Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.md"));

  const paddingInline =
    size === "sm"
      ? Number(getRequiredThemeTokenValue(brand, "spacing.3"))
      : size === "lg"
        ? Number(getRequiredThemeTokenValue(brand, "spacing.5"))
        : Number(getRequiredThemeTokenValue(brand, "spacing.4"));

  const paddingBlock = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const gap = Number(getRequiredThemeTokenValue(brand, "spacing.1"));

  return (
    <button
      {...rest}
      disabled={rest.disabled}
      style={{
        alignItems: "center",
        backgroundColor,
        border: `1px solid ${String(getRequiredThemeTokenValue(brand, "color.border.default"))}`,
        borderRadius: Number(getRequiredThemeTokenValue(brand, "radius.md")),
        color,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        gap,
        fontFamily: String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans")),
        fontSize,
        fontWeight: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold")),
        lineHeight: `${lineHeight}px`,
        opacity: rest.disabled ? 0.6 : 1,
        padding: `${paddingBlock}px ${paddingInline}px`,
        ...style
      }}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
