import {
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode
} from "react";
import { Pressable, Text, View, type TextStyle, type ViewStyle } from "react-native";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalBackToTopButtonNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.backToTopButton"
);

export type BackToTopButtonPreviewState = "Rest" | "Hover";

type BackToTopButtonMetrics = {
  gap: number;
  height: number;
  iconSize: number;
  paddingBlock: number;
  paddingInline: number;
};

type BackToTopButtonTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type BackToTopButtonSurface = {
  backgroundColor: string;
  borderColor: string;
  color: string;
  iconColor: string;
};

type StylableNativeIconElement = ReactElement<{ style?: unknown }>;

function getMetrics(brand: DisplayBrandId): BackToTopButtonMetrics {
  const tokenPrefix = "component.backToTopButton.size.md";

  return {
    gap: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.gap`)),
    height: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.height`)),
    iconSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.iconSize`)),
    paddingBlock: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.paddingBlock`)),
    paddingInline: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.paddingInline`))
  };
}

function getTypography(brand: DisplayBrandId): BackToTopButtonTypography {
  const tokenPrefix = "component.backToTopButton.typography.md";

  return {
    fontSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.fontSize`)),
    letterSpacing: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.letterSpacing`)),
    lineHeight: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.lineHeight`))
  };
}

function getSurface(
  brand: DisplayBrandId,
  inverse: boolean,
  active: boolean,
  disabled: boolean
): BackToTopButtonSurface {
  const surfaceKey = inverse ? "dark" : "light";
  const stateKey = disabled ? "disabled" : active ? "hover" : "rest";
  const tokenPrefix = `component.backToTopButton.color.${surfaceKey}.${stateKey}`;

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

export interface BackToTopButtonProps {
  accessibilityLabel?: string;
  brand?: DisplayBrandId;
  disabled?: boolean;
  forceState?: BackToTopButtonPreviewState;
  icon?: ReactNode;
  inverse?: boolean;
  onPress?: () => void;
}

export function BackToTopButton({
  accessibilityLabel,
  brand = "Cars24",
  children,
  disabled = false,
  forceState,
  icon,
  inverse = false,
  onPress
}: PropsWithChildren<BackToTopButtonProps>) {
  const metrics = getMetrics(brand);
  const typography = getTypography(brand);
  const borderRadius = Number(getRequiredNativeThemeTokenValue(brand, "radius.pill"));
  const borderWidth = Number(getRequiredNativeThemeTokenValue(brand, "component.backToTopButton.border.width"));
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.semibold")
  ) as TextStyle["fontWeight"];

  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" disabled={disabled} onPress={onPress}>
      {({ pressed }) => {
        const active = forceState === "Hover" || pressed;
        const surface = getSurface(brand, inverse, active, disabled);

        const rootStyle: ViewStyle = {
          alignItems: "center",
          backgroundColor: surface.backgroundColor,
          borderColor: surface.borderColor,
          borderRadius,
          borderWidth,
          flexDirection: "row",
          justifyContent: "center",
          minHeight: metrics.height,
          paddingHorizontal: metrics.paddingInline,
          paddingVertical: metrics.paddingBlock
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
