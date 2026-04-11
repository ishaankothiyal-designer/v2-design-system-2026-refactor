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
import { LinkButton } from "./link-button";
import { getRequiredNativeThemeTokenValue } from "../theme";

export const canonicalSectionHeaderNativeContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.sectionHeader"
);

export interface SectionHeaderProps {
  brand?: DisplayBrandId;
  inverse?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showAction?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  titleIcon?: ReactNode;
  subtitleIcon?: ReactNode;
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

function HeaderLine({
  brand,
  color,
  icon,
  centered = false,
  text
}: {
  brand: DisplayBrandId;
  color: string;
  icon?: ReactNode;
  centered?: boolean;
  text: string;
}) {
  const rowGap = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.titleRowGap"));
  const iconSize = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.iconSize"));
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.semibold")
  ) as TextStyle["fontWeight"];
  const fontSize = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.title.fontSize"));
  const lineHeight = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.title.lineHeight")
  );
  const letterSpacing = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.title.letterSpacing")
  );

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        gap: rowGap,
        justifyContent: centered ? "center" : undefined,
        minWidth: 0
      }}
    >
      {icon ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{
            alignItems: "center",
            height: iconSize,
            justifyContent: "center",
            width: iconSize
          }}
        >
          {renderDecorativeSlot(icon, color, iconSize)}
        </View>
      ) : null}
      <Text
        numberOfLines={1}
        style={{
          color,
          flex: 1,
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight,
          textAlign: centered ? "center" : undefined
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function DividerLine({
  color,
  thickness
}: {
  color: string;
  thickness: number;
}) {
  return <View style={{ backgroundColor: color, flex: 1, height: thickness, minWidth: 0 }} />;
}

function Tag({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  const height = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.tagHeight"));
  const paddingInline = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.tagPaddingInline")
  );
  const paddingBlock = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.tagPaddingBlock")
  );
  const radius = Number(getRequiredNativeThemeTokenValue(brand, "radius.pill"));
  const background = String(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.color.tag.background"));
  const color = String(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.color.tag.foreground"));
  const fontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.medium")
  ) as TextStyle["fontWeight"];
  const fontSize = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.tag.fontSize"));
  const lineHeight = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.tag.lineHeight")
  );
  const letterSpacing = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.tag.letterSpacing")
  );

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: background,
        borderRadius: radius,
        flexShrink: 0,
        height,
        justifyContent: "center",
        paddingHorizontal: paddingInline,
        paddingVertical: paddingBlock
      }}
    >
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
        {label}
      </Text>
    </View>
  );
}

export function SectionHeader({
  brand = "Cars24",
  inverse = false,
  title = "Section title",
  subtitle = "Section title line 2",
  description = "Description goes here upto 2 lines",
  tagLabel = "New",
  showTag = true,
  showAction = true,
  actionLabel = "View all",
  onActionPress,
  titleIcon,
  subtitleIcon,
  style
}: SectionHeaderProps) {
  const gap = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.gap"));
  const containerPaddingBottom = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.paddingBottom")
  );
  const layoutVariant = String(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.layout.variant"));
  const isCentered = layoutVariant === "centered";
  const rowGap = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.rowGap"));
  const contentGap = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.contentGap"));
  const titleStackGap = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.titleStackGap")
  );
  const actionGap = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.actionGap"));
  const actionStackGap = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.actionStackGap")
  );
  const dividerGap = Number(getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.dividerGap"));
  const dividerThickness = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.size.dividerThickness")
  );
  const actionHeight = Number(getRequiredNativeThemeTokenValue(brand, "component.linkButton.size.sm.height"));
  const descriptionColor = String(
    getRequiredNativeThemeTokenValue(
      brand,
      inverse ? "component.sectionHeader.color.dark.description" : "component.sectionHeader.color.light.description"
    )
  );
  const titleColor = String(
    getRequiredNativeThemeTokenValue(
      brand,
      inverse ? "component.sectionHeader.color.dark.title" : "component.sectionHeader.color.light.title"
    )
  );
  const dividerColor = String(
    getRequiredNativeThemeTokenValue(
      brand,
      inverse ? "component.sectionHeader.color.dark.divider" : "component.sectionHeader.color.light.divider"
    )
  );
  const descriptionFontFamily = String(getRequiredNativeThemeTokenValue(brand, "typography.fontFamily.sans"));
  const descriptionFontWeight = String(
    getRequiredNativeThemeTokenValue(brand, "typography.fontWeight.regular")
  ) as TextStyle["fontWeight"];
  const descriptionFontSize = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.description.fontSize")
  );
  const descriptionLineHeight = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.description.lineHeight")
  );
  const descriptionLetterSpacing = Number(
    getRequiredNativeThemeTokenValue(brand, "component.sectionHeader.typography.description.letterSpacing")
  );
  const resolvedShowTag = isCentered ? false : showTag;
  const resolvedShowAction = isCentered ? false : showAction;

  if (isCentered) {
    return (
      <View
        style={[
          {
            alignItems: "flex-start",
            flexDirection: "column",
            gap,
            justifyContent: "center",
            maxWidth: "100%",
            minWidth: 0,
            width: "100%"
          },
          style
        ]}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "column",
            gap: contentGap,
            justifyContent: "center",
            paddingBottom: containerPaddingBottom,
            width: "100%"
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "column",
              gap: titleStackGap,
              justifyContent: "center",
              width: "100%"
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: dividerGap,
                justifyContent: "center",
                width: "100%"
              }}
            >
              <DividerLine color={dividerColor} thickness={dividerThickness} />
              <HeaderLine brand={brand} centered color={titleColor} icon={titleIcon} text={title} />
              <DividerLine color={dividerColor} thickness={dividerThickness} />
            </View>
            {subtitle ? (
              <HeaderLine brand={brand} centered color={titleColor} icon={subtitleIcon} text={subtitle} />
            ) : null}
          </View>

          {description ? (
            <Text
              numberOfLines={2}
              style={{
                color: descriptionColor,
                fontFamily: descriptionFontFamily,
                fontSize: descriptionFontSize,
                fontWeight: descriptionFontWeight,
                letterSpacing: descriptionLetterSpacing,
                lineHeight: descriptionLineHeight,
                textAlign: "center",
                width: "100%"
              }}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          alignItems: "flex-start",
          flexDirection: "column",
          gap,
          justifyContent: "center",
          maxWidth: "100%",
          minWidth: 0,
          width: "100%"
        },
        style
      ]}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: rowGap,
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <View style={{ flex: 1, flexDirection: "column", gap: contentGap, minWidth: 0 }}>
          <View style={{ flexDirection: "column", gap: 0, width: "100%" }}>
            <View style={{ alignItems: "center", flexDirection: "row", gap, width: "100%" }}>
              <HeaderLine brand={brand} color={titleColor} icon={titleIcon} text={title} />
              {resolvedShowTag ? <Tag brand={brand} label={tagLabel} /> : null}
            </View>
            {subtitle ? <HeaderLine brand={brand} color={titleColor} icon={subtitleIcon} text={subtitle} /> : null}
          </View>

          {description ? (
            <Text
              numberOfLines={2}
              style={{
                color: descriptionColor,
                fontFamily: descriptionFontFamily,
                fontSize: descriptionFontSize,
                fontWeight: descriptionFontWeight,
                letterSpacing: descriptionLetterSpacing,
                lineHeight: descriptionLineHeight,
                width: "100%"
              }}
            >
              {description}
            </Text>
          ) : null}
        </View>

        {resolvedShowAction ? (
          <View
            style={{
              alignItems: "flex-end",
              alignSelf: "stretch",
              flexDirection: "column",
              flexShrink: 0,
              gap: actionGap,
              justifyContent: "center",
              minHeight: actionHeight
            }}
          >
            <View style={{ flexDirection: "column", gap: actionStackGap, justifyContent: "center" }}>
              <LinkButton
                brand={brand}
                onDark={inverse}
                size="Small"
                tone="Brand"
                underline={false}
                {...(onActionPress ? { onPress: onActionPress } : {})}
              >
                {actionLabel}
              </LinkButton>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
