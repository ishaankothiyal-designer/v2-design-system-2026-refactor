import type { PropsWithChildren, ReactNode } from "react";
import { Pressable, Text, View, type TextStyle } from "react-native";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalButtonNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.button"
);

export interface ButtonProps {
  brand?: DisplayBrandId;
  tone?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export function Button({
  brand = "Cars24",
  tone = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  onPress,
  disabled,
  children
}: PropsWithChildren<ButtonProps>) {
  const backgroundColor =
    tone === "primary"
      ? String(getRequiredNativeThemeTokenValue(brand, "color.brand.alt.500"))
      : tone === "secondary"
        ? String(getRequiredNativeThemeTokenValue(brand, "color.brand.secondary.600"))
        : String(getRequiredNativeThemeTokenValue(brand, "color.surface.subtle"));

  const color =
    tone === "ghost"
      ? String(getRequiredNativeThemeTokenValue(brand, "color.text.primary"))
      : String(getRequiredNativeThemeTokenValue(brand, "color.text.inverse"));

  const paddingVertical = Number(getRequiredNativeThemeTokenValue(brand, "spacing.2"));

  const paddingHorizontal =
    size === "sm"
      ? Number(getRequiredNativeThemeTokenValue(brand, "spacing.3"))
      : size === "lg"
        ? Number(getRequiredNativeThemeTokenValue(brand, "spacing.5"))
        : Number(getRequiredNativeThemeTokenValue(brand, "spacing.4"));

  const fontSize =
    size === "sm"
      ? Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.sm"))
      : size === "lg"
        ? Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.lg"))
        : Number(getRequiredNativeThemeTokenValue(brand, "typography.fontSize.md"));

  const lineHeight =
    size === "sm"
      ? Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.sm"))
      : size === "lg"
        ? Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.lg"))
        : Number(getRequiredNativeThemeTokenValue(brand, "typography.lineHeight.md"));

  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.semibold")
  ) as TextStyle["fontWeight"];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{
        alignItems: "center",
        backgroundColor,
        borderColor:
          tone === "primary"
            ? "transparent"
            : String(getRequiredNativeThemeTokenValue(brand, "color.border.default")),
        borderRadius: Number(getRequiredNativeThemeTokenValue(brand, "radius.md")),
        borderWidth: tone === "primary" ? 0 : 1,
        flexDirection: "row",
        opacity: disabled ? 0.5 : 1,
        paddingHorizontal,
        paddingVertical
      }}
    >
      {leadingIcon ? <View style={{ marginRight: Number(getRequiredNativeThemeTokenValue(brand, "spacing.1")) }}>{leadingIcon}</View> : null}
      <View>
        <Text
          style={{
            color,
            fontFamily: String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans")),
            fontSize,
            fontWeight,
            lineHeight
          }}
        >
          {children}
        </Text>
      </View>
      {trailingIcon ? <View style={{ marginLeft: Number(getRequiredNativeThemeTokenValue(brand, "spacing.1")) }}>{trailingIcon}</View> : null}
    </Pressable>
  );
}
