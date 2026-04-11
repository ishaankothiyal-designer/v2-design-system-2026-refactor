import {
  cloneElement,
  type ReactNode,
  isValidElement
} from "react";
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from "react-native";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalDividerNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.divider"
);

export type DividerLabelPosition = "None" | "Left" | "Center" | "Right";
export type DividerThickness = "Regular" | "Thin";
export type DividerLineStyle = "Plain" | "Dash";

export interface DividerProps {
  brand?: DisplayBrandId;
  labelPosition?: DividerLabelPosition;
  thickness?: DividerThickness;
  lineStyle?: DividerLineStyle;
  label?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  content?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function renderDecorativeSlot(content: ReactNode, color: string, size: number) {
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

function DividerLine({
  color,
  lineStyle,
  thickness,
  width
}: {
  color: string;
  lineStyle: DividerLineStyle;
  thickness: number;
  width?: number;
}) {
  return (
    <View
      style={{
        backgroundColor: lineStyle === "Plain" ? color : "transparent",
        borderTopColor: lineStyle === "Dash" ? color : "transparent",
        borderTopWidth: lineStyle === "Dash" ? thickness : 0,
        borderStyle: lineStyle === "Dash" ? "dashed" : "solid",
        flex: width === undefined ? 1 : 0,
        height: lineStyle === "Plain" ? thickness : 0,
        minWidth: width === undefined ? 0 : width,
        width
      }}
    />
  );
}

export function Divider({
  brand = "Cars24",
  labelPosition = "None",
  thickness = "Regular",
  lineStyle = "Plain",
  label,
  leadingIcon,
  trailingIcon,
  content,
  style
}: DividerProps) {
  const width = Number(getRequiredNativeThemeTokenValue(brand, "component.divider.size.width"));
  const shortSegmentLength = Number(
    getRequiredNativeThemeTokenValue(brand, "component.divider.size.shortSegmentLength")
  );
  const contentGap = Number(getRequiredNativeThemeTokenValue(brand, "component.divider.size.contentGap"));
  const contentPaddingInline = Number(
    getRequiredNativeThemeTokenValue(brand, "component.divider.size.contentPaddingInline")
  );
  const contentPaddingBlock = Number(
    getRequiredNativeThemeTokenValue(brand, "component.divider.size.contentPaddingBlock")
  );
  const iconSize = Number(getRequiredNativeThemeTokenValue(brand, "component.divider.size.iconSize"));
  const resolvedThickness = Number(
    getRequiredNativeThemeTokenValue(
      brand,
      thickness === "Thin"
        ? "component.divider.size.thickness.thin"
        : "component.divider.size.thickness.regular"
    )
  );
  const contentRadius = Number(
    getRequiredNativeThemeTokenValue(
      brand,
      thickness === "Thin"
        ? "component.divider.size.contentRadius.thin"
        : "component.divider.size.contentRadius.regular"
    )
  );
  const lineColor = String(getRequiredNativeThemeTokenValue(brand, "component.divider.color.line"));
  const contentColor = String(getRequiredNativeThemeTokenValue(brand, "component.divider.color.content"));
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.regular")
  ) as TextStyle["fontWeight"];
  const fontSize = Number(getRequiredNativeThemeTokenValue(brand, "component.divider.typography.label.fontSize"));
  const lineHeight = Number(getRequiredNativeThemeTokenValue(brand, "component.divider.typography.label.lineHeight"));
  const letterSpacing = Number(
    getRequiredNativeThemeTokenValue(brand, "component.divider.typography.label.letterSpacing")
  );
  const hasContent = content !== undefined && content !== null
    ? true
    : Boolean(label || leadingIcon || trailingIcon);
  const resolvedLabelPosition = hasContent ? labelPosition : "None";

  const contentNode = content ?? (
    <>
      {leadingIcon ? renderDecorativeSlot(leadingIcon, contentColor, iconSize) : null}
      {label ? (
        <Text
          style={{
            color: contentColor,
            fontFamily,
            fontSize,
            fontWeight,
            letterSpacing,
            lineHeight
          }}
        >
          {label}
        </Text>
      ) : null}
      {trailingIcon ? renderDecorativeSlot(trailingIcon, contentColor, iconSize) : null}
    </>
  );

  if (resolvedLabelPosition === "None") {
    return (
      <View style={[{ maxWidth: "100%", width }, style]}>
        <DividerLine color={lineColor} lineStyle={lineStyle} thickness={resolvedThickness} />
      </View>
    );
  }

  const leadingWidth = resolvedLabelPosition === "Left" ? shortSegmentLength : undefined;
  const trailingWidth = resolvedLabelPosition === "Right" ? shortSegmentLength : undefined;

  return (
    <View
      style={[
        {
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          maxWidth: "100%",
          minWidth: 0,
          width
        },
        style
      ]}
    >
      <DividerLine
        color={lineColor}
        lineStyle={lineStyle}
        thickness={resolvedThickness}
        {...(leadingWidth !== undefined ? { width: leadingWidth } : {})}
      />
      <View
        style={{
          alignItems: "center",
          borderRadius: contentRadius,
          flexDirection: "row",
          flexShrink: 0,
          gap: contentGap,
          justifyContent: "center",
          overflow: "hidden",
          paddingHorizontal: contentPaddingInline,
          paddingVertical: contentPaddingBlock
        }}
      >
        {contentNode}
      </View>
      <DividerLine
        color={lineColor}
        lineStyle={lineStyle}
        thickness={resolvedThickness}
        {...(trailingWidth !== undefined ? { width: trailingWidth } : {})}
      />
    </View>
  );
}
