import type { HTMLAttributes } from "react";
import type { BrandId } from "@geist/tokens";
import { getIconClassName, type IconName } from "@geist/icons";
import { getRequiredThemeTokenValue } from "../theme";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  brand?: BrandId;
  name: IconName;
  size?: "sm" | "md" | "lg";
  tone?: "primary" | "secondary" | "muted" | "inverse";
  decorative?: boolean;
  label?: string;
  title?: string;
}

export function Icon({
  brand = "core",
  name,
  size = "md",
  tone,
  decorative = true,
  label,
  title,
  style,
  ...rest
}: IconProps) {
  const colorToken =
    tone === "secondary"
      ? "color.text.secondary"
      : tone === "muted"
        ? "color.text.muted"
        : tone === "inverse"
          ? "color.text.inverse"
          : tone === "primary"
            ? "color.text.primary"
            : undefined;

  const iconSize =
    size === "sm"
      ? Number(getRequiredThemeTokenValue(brand, "icon.size.sm"))
      : size === "lg"
        ? Number(getRequiredThemeTokenValue(brand, "icon.size.lg"))
        : Number(getRequiredThemeTokenValue(brand, "icon.size.md"));

  const colorStyle = colorToken
    ? { color: String(getRequiredThemeTokenValue(brand, colorToken)) }
    : {};

  const accessibilityProps =
    label || title
      ? {
          role: "img" as const,
          "aria-label": label ?? title
        }
      : decorative
        ? { "aria-hidden": true as const }
        : {
            role: "img" as const,
            "aria-label": name
          };

  return (
    <span
      {...rest}
      {...accessibilityProps}
      title={title}
      className={[getIconClassName(name), rest.className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: iconSize,
        lineHeight: 1,
        ...colorStyle,
        ...style
      }}
    />
  );
}
