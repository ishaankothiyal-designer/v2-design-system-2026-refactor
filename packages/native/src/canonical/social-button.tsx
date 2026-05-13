import {
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode
} from "react";
import { Pressable, Text, View, type TextStyle, type ViewStyle } from "react-native";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalSocialButtonNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.socialButton"
);

export type SocialButtonSize = "Medium" | "Large";
export type SocialButtonPreviewState = "Rest" | "Hover";

type SocialButtonMetrics = {
  gap: number;
  height: number;
  iconSize: number;
  paddingInline: number;
};

type SocialButtonTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type SocialButtonSurface = {
  backgroundColor: string;
  borderColor: string;
  color: string;
  iconColor: string;
};

type StylableNativeIconElement = ReactElement<{ style?: unknown }>;

function getTokenSizeKey(size: SocialButtonSize) {
  return size === "Large" ? "lg" : "md";
}

function getMetrics(brand: DisplayBrandId, size: SocialButtonSize): SocialButtonMetrics {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.socialButton.size.${tokenSizeKey}`;

  return {
    gap: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.gap`)),
    height: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.height`)),
    iconSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.iconSize`)),
    paddingInline: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.paddingInline`))
  };
}

function getTypography(brand: DisplayBrandId, size: SocialButtonSize): SocialButtonTypography {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.socialButton.typography.${tokenSizeKey}`;

  return {
    fontSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    letterSpacing: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`)),
    lineHeight: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.lineHeight`))
  };
}

function getBorderRadius(brand: DisplayBrandId, size: SocialButtonSize) {
  return Number(getRequiredNativeThemeTokenValue(brand, `radius.alt.${size === "Large" ? "lg" : "md"}`));
}

function getSurface(
  brand: DisplayBrandId,
  active: boolean,
  disabled: boolean
): SocialButtonSurface {
  const stateKey = disabled ? "disabled" : active ? "hover" : "rest";
  const tokenPrefix = `component.socialButton.color.light.${stateKey}`;

  return {
    backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.background`)),
    borderColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.border`)),
    color: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.foreground`)),
    iconColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.icon`))
  };
}

function renderIcon(icon: ReactNode, color: string, iconSize: number) {
  if (!icon) {
    return null;
  }

  const wrapperStyle: ViewStyle = {
    alignItems: "center",
    height: iconSize,
    justifyContent: "center",
    width: iconSize
  };

  if (typeof icon === "string" || typeof icon === "number") {
    return (
      <View style={wrapperStyle}>
        <Text style={{ color, fontSize: iconSize, lineHeight: iconSize } satisfies TextStyle}>{icon}</Text>
      </View>
    );
  }

  if (isValidElement(icon)) {
    const stylableIcon = icon as StylableNativeIconElement;

    return (
      <View style={wrapperStyle}>
        {cloneElement(stylableIcon, {
          style: [stylableIcon.props.style ?? null, { color, fontSize: iconSize }]
        })}
      </View>
    );
  }

  return <View style={wrapperStyle}>{icon}</View>;
}

export interface SocialButtonProps {
  accessibilityLabel?: string;
  brand?: DisplayBrandId;
  disabled?: boolean;
  forceState?: SocialButtonPreviewState;
  icon?: ReactNode;
  onPress?: () => void;
  size?: SocialButtonSize;
}

export function SocialButton({
  accessibilityLabel,
  brand = "Cars24",
  children,
  disabled = false,
  forceState,
  icon,
  onPress,
  size = "Large"
}: PropsWithChildren<SocialButtonProps>) {
  const metrics = getMetrics(brand, size);
  const typography = getTypography(brand, size);
  const borderRadius = getBorderRadius(brand, size);
  const borderWidth = Number(getRequiredNativeThemeTokenValue(brand, "component.socialButton.border.width"));
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.medium")
  ) as TextStyle["fontWeight"];

  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" disabled={disabled} onPress={onPress}>
      {({ pressed }) => {
        const active = forceState === "Hover" || pressed;
        const surface = getSurface(brand, active, disabled);

        const rootStyle: ViewStyle = {
          alignItems: "center",
          backgroundColor: surface.backgroundColor,
          borderColor: surface.borderColor,
          borderRadius,
          borderWidth,
          flexDirection: "row",
          height: metrics.height,
          justifyContent: "center",
          paddingHorizontal: metrics.paddingInline
        };

        const labelStyle: TextStyle = {
          color: surface.color,
          fontFamily,
          fontSize: typography.fontSize,
          fontWeight,
          letterSpacing: typography.letterSpacing,
          lineHeight: typography.lineHeight,
          textAlign: "center"
        };

        return (
          <View style={rootStyle}>
            {renderIcon(icon, surface.iconColor, metrics.iconSize)}
            {children ? (
              <Text style={[labelStyle, icon ? ({ marginLeft: metrics.gap } satisfies TextStyle) : null]}>{children}</Text>
            ) : null}
          </View>
        );
      }}
    </Pressable>
  );
}
