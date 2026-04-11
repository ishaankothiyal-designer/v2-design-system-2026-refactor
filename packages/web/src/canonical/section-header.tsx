import {
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  isValidElement
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { LinkButton } from "./link-button";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalSectionHeaderWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.sectionHeader"
);

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  inverse?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showAction?: boolean;
  actionLabel?: string;
  onActionClick?: () => void;
  titleIcon?: ReactNode;
  subtitleIcon?: ReactNode;
}

function getSectionHeaderToken(slot: string) {
  return canonicalSectionHeaderWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function resolveSectionHeaderBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getSectionHeaderToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("component.") ||
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.") ||
    token.startsWith("icon.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

function toPx(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

function renderDecorativeSlot(content: ReactNode, color: string, size: string) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return (
      <span
        aria-hidden="true"
        style={{
          color,
          display: "inline-flex",
          fontSize: size,
          lineHeight: 0
        }}
      >
        {content}
      </span>
    );
  }

  if (isValidElement(content)) {
    const element = content as ReactElement<{ style?: CSSProperties }>;

    return cloneElement(element, {
      style: {
        color,
        fontSize: size,
        ...element.props.style
      }
    });
  }

  return content;
}

function Tag({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  const height = toPx(resolveSectionHeaderBindingValue(brand, "tag.height", "20"));
  const paddingInline = toPx(resolveSectionHeaderBindingValue(brand, "tag.paddingInline", "8"));
  const paddingBlock = toPx(resolveSectionHeaderBindingValue(brand, "tag.paddingBlock", "2"));
  const radius = toPx(resolveSectionHeaderBindingValue(brand, "tag.radius", "999"));
  const background = resolveSectionHeaderBindingValue(brand, "color.tag.background", "#DC2626");
  const color = resolveSectionHeaderBindingValue(brand, "color.tag.foreground", "#FFFFFF");
  const fontFamily = resolveSectionHeaderBindingValue(brand, "tag.typography.fontFamily", "Inter");
  const fontWeight = Number(resolveSectionHeaderBindingValue(brand, "tag.typography.fontWeight", "500"));
  const fontSize = toPx(resolveSectionHeaderBindingValue(brand, "tag.typography.fontSize", "11"));
  const lineHeight = toPx(resolveSectionHeaderBindingValue(brand, "tag.typography.lineHeight", "14"));
  const letterSpacing = toPx(resolveSectionHeaderBindingValue(brand, "tag.typography.letterSpacing", "0"));

  return (
    <span
      style={{
        alignItems: "center",
        background,
        borderRadius: radius,
        color,
        display: "inline-flex",
        flexShrink: 0,
        fontFamily: `${fontFamily}, sans-serif`,
        fontSize,
        fontWeight,
        height,
        justifyContent: "center",
        letterSpacing,
        lineHeight,
        padding: `${paddingBlock} ${paddingInline}`,
        whiteSpace: "nowrap"
      }}
    >
      {label}
    </span>
  );
}

function HeaderLine({
  brand,
  color,
  icon,
  centered = false,
  inline = false,
  text
}: {
  brand: DisplayBrandId;
  color: string;
  icon?: ReactNode;
  centered?: boolean;
  inline?: boolean;
  text: string;
}) {
  const rowGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.titleRowGap", "8"));
  const iconSize = toPx(resolveSectionHeaderBindingValue(brand, "icon.size", "16"));
  const fontFamily = resolveSectionHeaderBindingValue(brand, "typography.title.fontFamily", "Inter");
  const fontWeight = Number(resolveSectionHeaderBindingValue(brand, "typography.title.fontWeight", "600"));
  const fontSize = toPx(resolveSectionHeaderBindingValue(brand, "typography.title.fontSize", "17"));
  const lineHeight = toPx(resolveSectionHeaderBindingValue(brand, "typography.title.lineHeight", "22"));
  const letterSpacing = toPx(resolveSectionHeaderBindingValue(brand, "typography.title.letterSpacing", "-0.02"));

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: rowGap,
        flex: centered || inline ? "0 1 auto" : 1,
        justifyContent: centered ? "center" : undefined,
        maxWidth: "100%",
        minWidth: 0,
        width: centered || inline ? "auto" : "100%"
      }}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            color,
            display: "inline-flex",
            flexShrink: 0,
            fontSize: iconSize,
            height: iconSize,
            justifyContent: "center",
            lineHeight: 0,
            width: iconSize
          }}
        >
          {renderDecorativeSlot(icon, color, iconSize)}
        </span>
      ) : null}
      <span
        style={{
          color,
          flex: centered || inline ? "0 1 auto" : 1,
          fontFamily: `${fontFamily}, sans-serif`,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight,
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden",
          textAlign: centered ? "center" : undefined,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {text}
      </span>
    </div>
  );
}

function DividerLine({
  direction,
  opaqueColor,
  transparentColor,
  thickness
}: {
  direction: "left" | "right";
  opaqueColor: string;
  transparentColor: string;
  thickness: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        backgroundImage:
          direction === "left"
            ? `linear-gradient(to right, ${transparentColor}, ${opaqueColor})`
            : `linear-gradient(to right, ${opaqueColor}, ${transparentColor})`,
        display: "block",
        flex: 1,
        height: thickness,
        minWidth: 0
      }}
    />
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
  onActionClick,
  titleIcon,
  subtitleIcon,
  className,
  style,
  ...rest
}: SectionHeaderProps) {
  const containerWidth = toPx(resolveSectionHeaderBindingValue(brand, "container.width", "336"));
  const containerGap = toPx(resolveSectionHeaderBindingValue(brand, "container.gap", "8"));
  const containerPaddingBottom = toPx(resolveSectionHeaderBindingValue(brand, "container.paddingBottom", "0"));
  const layoutVariant = resolveSectionHeaderBindingValue(brand, "layout.variant", "split");
  const isCentered = layoutVariant === "centered";
  const rowGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.rowGap", "24"));
  const contentGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.contentGap", "4"));
  const titleStackGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.titleStackGap", "0"));
  const actionGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.actionGap", "6"));
  const actionStackGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.actionStackGap", "10"));
  const actionHeight = toPx(resolveSectionHeaderBindingValue(brand, "action.height", "18"));
  const dividerGap = toPx(resolveSectionHeaderBindingValue(brand, "divider.gap", "12"));
  const dividerThickness = toPx(resolveSectionHeaderBindingValue(brand, "divider.thickness", "1"));
  const titleColor = resolveSectionHeaderBindingValue(
    brand,
    inverse ? "color.dark.title" : "color.light.title",
    inverse ? "#FFFFFF" : "#020617"
  );
  const descriptionColor = resolveSectionHeaderBindingValue(
    brand,
    inverse ? "color.dark.description" : "color.light.description",
    inverse ? "rgba(255, 255, 255, 0.7)" : "#64748B"
  );
  const dividerColor = resolveSectionHeaderBindingValue(
    brand,
    inverse ? "color.dark.divider" : "color.light.divider",
    inverse ? "rgba(255, 255, 255, 0.6)" : "rgba(26, 26, 26, 0.15)"
  );
  const dividerOpaqueColor = resolveSectionHeaderBindingValue(
    brand,
    inverse ? "color.dark.dividerOpaque" : "color.light.dividerOpaque",
    dividerColor
  );
  const dividerTransparentColor = resolveSectionHeaderBindingValue(
    brand,
    inverse ? "color.dark.dividerTransparent" : "color.light.dividerTransparent",
    inverse ? "rgba(255, 255, 255, 0)" : "rgba(26, 26, 26, 0)"
  );
  const descriptionFontFamily = resolveSectionHeaderBindingValue(
    brand,
    "typography.description.fontFamily",
    "Inter"
  );
  const descriptionFontWeight = Number(
    resolveSectionHeaderBindingValue(brand, "typography.description.fontWeight", "400")
  );
  const descriptionFontSize = toPx(
    resolveSectionHeaderBindingValue(brand, "typography.description.fontSize", "14")
  );
  const descriptionLineHeight = toPx(
    resolveSectionHeaderBindingValue(brand, "typography.description.lineHeight", "20")
  );
  const descriptionLetterSpacing = toPx(
    resolveSectionHeaderBindingValue(brand, "typography.description.letterSpacing", "0")
  );
  const resolvedShowTag = isCentered ? false : showTag;
  const resolvedShowAction = isCentered ? false : showAction;

  if (isCentered) {
    return (
      <div
        {...rest}
        className={className}
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          gap: containerGap,
          justifyContent: "center",
          maxWidth: "100%",
          width: containerWidth,
          ...style
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: contentGap,
            justifyContent: "center",
            paddingBottom: containerPaddingBottom,
            width: "100%"
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: titleStackGap,
              justifyContent: "center",
              width: "100%"
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: dividerGap,
                justifyContent: "center",
                width: "100%"
              }}
            >
              <DividerLine
                direction="left"
                opaqueColor={dividerOpaqueColor}
                thickness={dividerThickness}
                transparentColor={dividerTransparentColor}
              />
              <HeaderLine brand={brand} centered color={titleColor} icon={titleIcon} text={title} />
              <DividerLine
                direction="right"
                opaqueColor={dividerOpaqueColor}
                thickness={dividerThickness}
                transparentColor={dividerTransparentColor}
              />
            </div>
            {subtitle ? (
              <HeaderLine brand={brand} centered color={titleColor} icon={subtitleIcon} text={subtitle} />
            ) : null}
          </div>

          {description ? (
            <p
              style={{
                color: descriptionColor,
                display: "-webkit-box",
                fontFamily: `${descriptionFontFamily}, sans-serif`,
                fontSize: descriptionFontSize,
                fontWeight: descriptionFontWeight,
                letterSpacing: descriptionLetterSpacing,
                lineHeight: descriptionLineHeight,
                margin: 0,
                overflow: "hidden",
                textAlign: "center",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                width: "100%"
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: containerGap,
        justifyContent: "center",
        maxWidth: "100%",
        width: containerWidth,
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: rowGap,
          justifyContent: "space-between",
          minWidth: 0,
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1 1 0%",
            flexDirection: "column",
            gap: contentGap,
            minWidth: 0
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              minWidth: 0,
              width: "100%"
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: toPx(resolveSectionHeaderBindingValue(brand, "layout.titleRowGap", "8")),
                maxWidth: "100%",
                minWidth: 0
              }}
            >
              <HeaderLine brand={brand} color={titleColor} icon={titleIcon} inline text={title} />
              {resolvedShowTag ? <Tag brand={brand} label={tagLabel} /> : null}
            </div>
            {subtitle ? (
              <HeaderLine brand={brand} color={titleColor} icon={subtitleIcon} text={subtitle} />
            ) : null}
          </div>

          {description ? (
            <p
              style={{
                color: descriptionColor,
                display: "-webkit-box",
                fontFamily: `${descriptionFontFamily}, sans-serif`,
                fontSize: descriptionFontSize,
                fontWeight: descriptionFontWeight,
                letterSpacing: descriptionLetterSpacing,
                lineHeight: descriptionLineHeight,
                margin: 0,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                width: "100%"
              }}
            >
              {description}
            </p>
          ) : null}
        </div>

        {resolvedShowAction ? (
          <div
            style={{
              alignItems: "flex-end",
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              gap: actionGap,
              justifyContent: "center",
              minHeight: actionHeight
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: actionStackGap,
                justifyContent: "center"
              }}
            >
              <LinkButton
                brand={brand}
                onDark={inverse}
                size="Small"
                tone="Brand"
                underline={false}
                onClick={onActionClick}
              >
                {actionLabel}
              </LinkButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
