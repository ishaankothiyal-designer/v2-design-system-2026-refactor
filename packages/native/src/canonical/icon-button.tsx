import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode
} from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalIconButtonNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.iconButton"
);

export type IconButtonShape = "Regular" | "Round";
export type IconButtonStyleVariant =
  | "Solid - Primary"
  | "Solid - Black"
  | "Outline - Primary"
  | "Outline - Black"
  | "Subtle - Primary"
  | "Subtle - Black"
  | "Ghost - Brand"
  | "Ghost - Black"
  | "Transparent";
export type IconButtonSize = "XXXSmall" | "XXSmall" | "XSmall" | "Small" | "Medium" | "Large";
export type IconButtonPreviewState = "Rest" | "Hover/Pressed";

type IconButtonMetrics = {
  borderRadius: number;
  boxSize: number;
  iconSize: number;
};

type IconButtonSurface = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

type StylableNativeIconElement = ReactElement<{ style?: unknown }>;

function getTokenSizeKey(size: IconButtonSize) {
  if (size === "Large") {
    return "lg";
  }
  if (size === "Medium") {
    return "md";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "XSmall") {
    return "xs";
  }
  if (size === "XXSmall") {
    return "xxs";
  }

  return "xxxs";
}

function getMetrics(brand: DisplayBrandId, size: IconButtonSize): IconButtonMetrics {
  const tokenSizeKey = getTokenSizeKey(size);
  const tokenPrefix = `component.iconButton.size.${tokenSizeKey}`;

  return {
    borderRadius: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.borderRadius`)),
    boxSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.boxSize`)),
    iconSize: Number(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.iconSize`))
  };
}

function getSurfaceTokenPrefix(onDark: boolean, styleVariant: IconButtonStyleVariant, active: boolean) {
  const stateKey = active ? "hover" : "rest";
  const modeKey = onDark ? "dark" : "light";

  switch (styleVariant) {
    case "Solid - Primary":
      return `component.iconButton.color.${modeKey}.solid.primary.${stateKey}`;
    case "Solid - Black":
      return `component.iconButton.color.${modeKey}.solid.black.${stateKey}`;
    case "Outline - Primary":
      return `component.iconButton.color.${modeKey}.outline.primary.${stateKey}`;
    case "Outline - Black":
      return `component.iconButton.color.${modeKey}.outline.black.${stateKey}`;
    case "Subtle - Primary":
      return `component.iconButton.color.${modeKey}.subtle.primary.${stateKey}`;
    case "Subtle - Black":
      return `component.iconButton.color.${modeKey}.subtle.black.${stateKey}`;
    case "Ghost - Brand":
      return `component.iconButton.color.${modeKey}.ghost.primary.${stateKey}`;
    case "Ghost - Black":
      return `component.iconButton.color.${modeKey}.ghost.black.${stateKey}`;
    case "Transparent":
      return `component.iconButton.color.${modeKey}.transparent.${stateKey}`;
  }
}

function getSurface(
  brand: DisplayBrandId,
  styleVariant: IconButtonStyleVariant,
  onDark: boolean,
  active: boolean,
  disabled: boolean
): IconButtonSurface {
  const brandAction = String(getRequiredNativeThemeTokenValue(brand, "color.brand.alt.500"));
  const brandBaseHover = String(getRequiredNativeThemeTokenValue(brand, "color.brand.primary.600"));
  const brandSubtler = String(getRequiredNativeThemeTokenValue(brand, "color.brand.primary.50"));
  const brandSubtlerHover = String(getRequiredNativeThemeTokenValue(brand, "color.brand.primary.100"));
  const textPrimary = String(getRequiredNativeThemeTokenValue(brand, "color.text.primary"));
  const textInverse = String(getRequiredNativeThemeTokenValue(brand, "color.text.inverse"));
  const modeKey = onDark ? "dark" : "light";

  if (disabled) {
    const disabledPrefix = `component.iconButton.color.${modeKey}.disabled`;

    return {
      backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${disabledPrefix}.background`)),
      borderColor: String(getRequiredNativeThemeTokenValue(brand, `${disabledPrefix}.border`)),
      color: String(getRequiredNativeThemeTokenValue(brand, `${disabledPrefix}.foreground`))
    };
  }

  if (styleVariant === "Solid - Primary") {
    return {
      backgroundColor: active ? brandBaseHover : brandAction,
      borderColor: "transparent",
      color: textInverse
    };
  }

  if (!onDark && styleVariant === "Outline - Primary") {
    return {
      backgroundColor: active ? brandSubtlerHover : "transparent",
      borderColor: brandAction,
      color: brandAction
    };
  }

  if (!onDark && styleVariant === "Subtle - Primary") {
    return {
      backgroundColor: active ? brandSubtlerHover : brandSubtler,
      borderColor: "transparent",
      color: brandAction
    };
  }

  if (!onDark && styleVariant === "Ghost - Brand") {
    return {
      backgroundColor: "transparent",
      borderColor: "transparent",
      color: brandAction
    };
  }

  if (onDark && styleVariant === "Ghost - Brand") {
    return {
      backgroundColor: "transparent",
      borderColor: "transparent",
      color: textInverse
    };
  }

  if (onDark && styleVariant === "Subtle - Primary") {
    const tokenPrefix = `component.iconButton.color.${modeKey}.subtle.primary.${active ? "hover" : "rest"}`;

    return {
      backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.background`)),
      borderColor: "transparent",
      color: textInverse
    };
  }

  if (onDark && styleVariant === "Outline - Primary") {
    const tokenPrefix = `component.iconButton.color.${modeKey}.outline.primary.${active ? "hover" : "rest"}`;

    return {
      backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.background`)),
      borderColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.border`)),
      color: textInverse
    };
  }

  if (styleVariant === "Transparent") {
    const tokenPrefix = getSurfaceTokenPrefix(onDark, styleVariant, active);

    return {
      backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.background`)),
      borderColor: "transparent",
      color: onDark ? textInverse : textPrimary
    };
  }

  const tokenPrefix = getSurfaceTokenPrefix(onDark, styleVariant, active);
  const borderColor =
    styleVariant === "Solid - Black" ||
    styleVariant === "Subtle - Black" ||
    styleVariant === "Ghost - Black"
      ? "transparent"
      : String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.border`));

  return {
    backgroundColor: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.background`)),
    borderColor,
    color: String(getRequiredNativeThemeTokenValue(brand, `${tokenPrefix}.foreground`))
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

export interface IconButtonProps {
  accessibilityLabel?: string;
  brand?: DisplayBrandId;
  disabled?: boolean;
  forceState?: IconButtonPreviewState;
  icon: ReactNode;
  onDark?: boolean;
  onPress?: () => void;
  shape?: IconButtonShape;
  size?: IconButtonSize;
  styleVariant?: IconButtonStyleVariant;
}

export function IconButton({
  accessibilityLabel,
  brand = "Cars24",
  disabled = false,
  forceState,
  icon,
  onDark = false,
  onPress,
  shape = "Regular",
  size = "Medium",
  styleVariant = "Solid - Primary"
}: IconButtonProps) {
  const metrics = getMetrics(brand, size);
  const borderWidth = Number(getRequiredNativeThemeTokenValue(brand, "component.iconButton.border.width"));
  const roundRadius = Number(getRequiredNativeThemeTokenValue(brand, "radius.pill"));

  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" disabled={disabled} onPress={onPress}>
      {({ pressed }) => {
        const active = forceState === "Hover/Pressed" || pressed;
        const surface = getSurface(brand, styleVariant, onDark, active, disabled);

        const rootStyle: ViewStyle = {
          alignItems: "center",
          backgroundColor: surface.backgroundColor,
          borderColor: surface.borderColor,
          borderRadius: shape === "Round" ? roundRadius : metrics.borderRadius,
          borderWidth,
          height: metrics.boxSize,
          justifyContent: "center",
          width: metrics.boxSize
        };

        return <View style={rootStyle}>{renderIcon(icon, surface.color, metrics.iconSize)}</View>;
      }}
    </Pressable>
  );
}
