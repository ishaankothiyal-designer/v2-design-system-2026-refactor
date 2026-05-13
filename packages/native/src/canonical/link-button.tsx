import {
  cloneElement,
  type PropsWithChildren,
  type ReactNode,
  isValidElement
} from "react";
import { Pressable, Text, View, type TextStyle, type ViewStyle } from "react-native";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalLinkButtonNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.linkButton"
);

export type LinkButtonTone = "Brand" | "Black";
export type LinkButtonSize = "Extra Small" | "Small" | "Medium" | "Large";
export type LinkButtonPreviewState = "Rest" | "Hover";

function getTokenSizeKey(size: LinkButtonSize) {
  if (size === "Extra Small") {
    return "xs";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "Large") {
    return "lg";
  }

  return "md";
}

function getForegroundColor(
  brand: DisplayBrandId,
  tone: LinkButtonTone,
  onDark: boolean,
  active: boolean,
  disabled: boolean
) {
  const surfaceKey = onDark ? "dark" : "light";
  const stateKey = active ? "hover" : "rest";

  if (disabled) {
    return String(
      getRequiredNativeThemeTokenValue(brand, `component.linkButton.color.${surfaceKey}.disabled`)
    );
  }

  return String(
    getRequiredNativeThemeTokenValue(
      brand,
      `component.linkButton.color.${surfaceKey}.${tone === "Black" ? "black" : "brand"}.${stateKey}`
    )
  );
}

function renderSlot(content: ReactNode, color: string, size: number) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return (
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ color, fontSize: size, lineHeight: size } satisfies TextStyle}
      >
        {content}
      </Text>
    );
  }

  if (isValidElement<{ style?: TextStyle | ViewStyle }>(content)) {
    return cloneElement(content, {
      style: {
        color,
        fontSize: size,
        ...(content.props.style ?? {})
      }
    });
  }

  return content;
}

export interface LinkButtonProps {
  brand?: DisplayBrandId;
  tone?: LinkButtonTone;
  size?: LinkButtonSize;
  onDark?: boolean;
  underline?: boolean;
  forceState?: LinkButtonPreviewState;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export function LinkButton({
  brand = "Cars24",
  tone = "Brand",
  size = "Extra Small",
  onDark = false,
  underline = true,
  forceState,
  leadingIcon,
  trailingIcon,
  onPress,
  disabled = false,
  children
}: PropsWithChildren<LinkButtonProps>) {
  const tokenSizeKey = getTokenSizeKey(size);
  const sizeTokenPrefix = `component.linkButton.size.${tokenSizeKey}`;
  const typographyTokenPrefix = `component.linkButton.typography.${tokenSizeKey}`;
  const height = Number(getRequiredNativeThemeTokenValue(brand, `${sizeTokenPrefix}.height`));
  const gap = Number(getRequiredNativeThemeTokenValue(brand, `${sizeTokenPrefix}.gap`));
  const iconSize = Number(getRequiredNativeThemeTokenValue(brand, `${sizeTokenPrefix}.iconSize`));
  const fontSize = Number(getRequiredNativeThemeTokenValue(brand, `${typographyTokenPrefix}.fontSize`));
  const lineHeight = Number(getRequiredNativeThemeTokenValue(brand, `${typographyTokenPrefix}.lineHeight`));
  const letterSpacing = Number(
    getRequiredNativeThemeTokenValue(brand, `${typographyTokenPrefix}.letterSpacing`)
  );
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.medium")
  ) as TextStyle["fontWeight"];
  const underlineThickness = Number(
    getRequiredNativeThemeTokenValue(brand, "component.linkButton.decoration.underlineThickness")
  );

  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}>
      {({ pressed }) => {
        const active = forceState === "Hover" || pressed;
        const color = getForegroundColor(brand, tone, onDark, active, disabled);

        return (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              minHeight: height
            }}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomColor: underline ? color : "transparent",
                borderBottomWidth: underline ? underlineThickness : 0,
                flexDirection: "row",
                minHeight: height
              }}
            >
              {leadingIcon ? (
                <View style={{ marginRight: gap }}>{renderSlot(leadingIcon, color, iconSize)}</View>
              ) : null}
              {children ? (
                <Text
                  style={{
                    color,
                    fontFamily,
                    fontSize,
                    fontWeight,
                    letterSpacing,
                    lineHeight
                  }}
                >
                  {children}
                </Text>
              ) : null}
              {trailingIcon ? (
                <View style={{ marginLeft: gap }}>{renderSlot(trailingIcon, color, iconSize)}</View>
              ) : null}
            </View>
          </View>
        );
      }}
    </Pressable>
  );
}
