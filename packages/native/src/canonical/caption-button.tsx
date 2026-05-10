import type { PropsWithChildren, ReactNode } from "react";
import { Pressable, Text, View, type TextStyle, type ViewStyle } from "react-native";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalCaptionButtonNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.captionButton"
);

export type CaptionButtonStyleVariant = "Primary" | "Secondary";
export type CaptionButtonSize = "Medium" | "Large";
export type CaptionButtonCaptionPosition = "Up" | "Down";
export type CaptionButtonPreviewState = "Rest" | "Hover/Pressed";

type CaptionButtonSurface = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

function getTokenSizeKey(size: CaptionButtonSize) {
  return size === "Large" ? "lg" : "md";
}

function getTypography(
  brand: DisplayBrandId,
  role: "label" | "caption",
  size: CaptionButtonSize
) {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.captionButton.typography.${role}.${tokenSizeKey}`;

  return {
    fontSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    letterSpacing: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`)),
    lineHeight: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.lineHeight`))
  };
}

function getSurface(
  brand: DisplayBrandId,
  styleVariant: CaptionButtonStyleVariant,
  active: boolean,
  disabled: boolean
): CaptionButtonSurface {
  if (disabled) {
    return {
      backgroundColor: String(
        getRequiredNativeThemeTokenValue(brand, "component.captionButton.color.light.disabled.background")
      ),
      borderColor: String(
        getRequiredNativeThemeTokenValue(brand, "component.captionButton.color.light.disabled.border")
      ),
      color: String(
        getRequiredNativeThemeTokenValue(brand, "component.captionButton.color.light.disabled.foreground")
      )
    };
  }

  const stateKey = active ? "hover" : "rest";
  const variantKey = styleVariant === "Secondary" ? "secondary" : "primary";
  const tokenPrefix = `component.captionButton.color.light.${variantKey}.${stateKey}`;

  return {
    backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.background`)),
    borderColor:
      variantKey === "secondary"
        ? String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.border`))
        : "transparent",
    color: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.foreground`))
  };
}

function renderText(content: ReactNode, style: TextStyle) {
  if (content === null || content === undefined || content === false) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return <Text style={style}>{content}</Text>;
  }

  return content;
}

export interface CaptionButtonProps {
  brand?: DisplayBrandId;
  caption?: ReactNode;
  captionPosition?: CaptionButtonCaptionPosition;
  disabled?: boolean;
  forceState?: CaptionButtonPreviewState;
  onPress?: () => void;
  size?: CaptionButtonSize;
  styleVariant?: CaptionButtonStyleVariant;
}

export function CaptionButton({
  brand = "Cars24",
  caption,
  captionPosition = "Up",
  children,
  disabled = false,
  forceState,
  onPress,
  size = "Medium",
  styleVariant = "Primary"
}: PropsWithChildren<CaptionButtonProps>) {
  const tokenSizeKey = getTokenSizeKey(size);
  const height = Number(getRequiredNativeThemeTokenValue(brand, `component.captionButton.size.${tokenSizeKey}.height`));
  const paddingInline = Number(
    getRequiredNativeThemeTokenValue(brand, `component.captionButton.size.${tokenSizeKey}.paddingInline`)
  );
  const borderRadius = Number(
    getRequiredNativeThemeTokenValue(brand, `component.captionButton.size.${tokenSizeKey}.borderRadius`)
  );
  const borderWidth = Number(getRequiredNativeThemeTokenValue(brand, "component.captionButton.border.width"));
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const labelFontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.medium")
  ) as TextStyle["fontWeight"];
  const captionFontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.regular")
  ) as TextStyle["fontWeight"];
  const labelTypography = getTypography(brand, "label", size);
  const captionTypography = getTypography(brand, "caption", size);

  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}>
      {({ pressed }) => {
        const active = forceState === "Hover/Pressed" || pressed;
        const surface = getSurface(brand, styleVariant, active, disabled);

        const rootStyle: ViewStyle = {
          alignItems: "center",
          backgroundColor: surface.backgroundColor,
          borderColor: surface.borderColor,
          borderRadius,
          borderWidth,
          flexDirection: "column",
          height,
          justifyContent: "center",
          overflow: "hidden",
          paddingHorizontal: paddingInline
        };

        const labelStyle: TextStyle = {
          color: surface.color,
          fontFamily,
          fontSize: labelTypography.fontSize,
          fontWeight: labelFontWeight,
          letterSpacing: labelTypography.letterSpacing,
          lineHeight: labelTypography.lineHeight,
          textAlign: "center"
        };

        const captionStyle: TextStyle = {
          color: surface.color,
          fontFamily,
          fontSize: captionTypography.fontSize,
          fontWeight: captionFontWeight,
          letterSpacing: captionTypography.letterSpacing,
          lineHeight: captionTypography.lineHeight,
          textAlign: "center"
        };

        const captionElement = renderText(caption, captionStyle);
        const labelElement = renderText(children, labelStyle);

        return (
          <View style={rootStyle}>
            {captionPosition === "Up" ? (
              <>
                {captionElement}
                {labelElement}
              </>
            ) : (
              <>
                {labelElement}
                {captionElement}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}
