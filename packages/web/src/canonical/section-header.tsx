import {
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useInsertionEffect
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { LinkButton } from "./link-button";
import { ensureStyleSheet, joinClassNames, toCssRule } from "./runtime-styles";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";

export const canonicalSectionHeaderWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.sectionHeader"
);

const SECTION_HEADER_ROOT_CLASS = "geist-section-header";
const SECTION_HEADER_CENTERED_CLASS = "geist-section-header--centered";
const SECTION_HEADER_ROW_CLASS = "geist-section-header__row";
const SECTION_HEADER_CONTENT_CLASS = "geist-section-header__content";
const SECTION_HEADER_TITLE_BLOCK_CLASS = "geist-section-header__title-block";
const SECTION_HEADER_TITLE_ROW_CLASS = "geist-section-header__title-row";
const SECTION_HEADER_HEADER_LINE_CLASS = "geist-section-header__header-line";
const SECTION_HEADER_HEADER_ICON_CLASS = "geist-section-header__header-icon";
const SECTION_HEADER_HEADER_TEXT_CLASS = "geist-section-header__header-text";
const SECTION_HEADER_DESCRIPTION_CLASS = "geist-section-header__description";
const SECTION_HEADER_TAG_CLASS = "geist-section-header__tag";
const SECTION_HEADER_ACTION_CLASS = "geist-section-header__action";
const SECTION_HEADER_ACTION_STACK_CLASS = "geist-section-header__action-stack";
const SECTION_HEADER_DIVIDER_CLASS = "geist-section-header__divider";
const SECTION_HEADER_CENTERED_GROUP_CLASS = "geist-section-header__centered-group";
const SECTION_HEADER_CENTERED_TITLE_STACK_CLASS = "geist-section-header__centered-title-stack";
const SECTION_HEADER_STYLESHEET_ID = "geist-section-header-styles";

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  inverse?: boolean;
  title?: string;
  showSubtitle?: boolean;
  subtitle?: string;
  showDescription?: boolean;
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
  return tokenValueToRem(value);
}

function renderDecorativeSlot(content: ReactNode, color: string, size: string) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return <span aria-hidden="true">{content}</span>;
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

function buildHeaderLine({
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
  const iconSize = toPx(resolveSectionHeaderBindingValue(brand, "icon.size", "16"));

  return (
    <div
      className={SECTION_HEADER_HEADER_LINE_CLASS}
      data-centered={String(centered)}
      data-inline={String(inline)}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={SECTION_HEADER_HEADER_ICON_CLASS}
          style={{ color, fontSize: iconSize } satisfies CSSProperties}
        >
          {renderDecorativeSlot(icon, color, iconSize)}
        </span>
      ) : null}
      <span className={SECTION_HEADER_HEADER_TEXT_CLASS} style={{ color } satisfies CSSProperties}>
        {text}
      </span>
    </div>
  );
}

function DividerLine({
  direction,
  opaqueColor,
  transparentColor
}: {
  direction: "left" | "right";
  opaqueColor: string;
  transparentColor: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={SECTION_HEADER_DIVIDER_CLASS}
      style={{
        backgroundImage:
          direction === "left"
            ? `linear-gradient(to right, ${transparentColor}, ${opaqueColor})`
            : `linear-gradient(to right, ${opaqueColor}, ${transparentColor})`
      }}
    />
  );
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
      className={SECTION_HEADER_TAG_CLASS}
      style={
        {
          "--section-header-tag-background": background,
          "--section-header-tag-color": color,
          "--section-header-tag-font-family": `${fontFamily}, sans-serif`,
          "--section-header-tag-font-size": fontSize,
          "--section-header-tag-font-weight": String(fontWeight),
          "--section-header-tag-height": height,
          "--section-header-tag-letter-spacing": letterSpacing,
          "--section-header-tag-line-height": lineHeight,
          "--section-header-tag-padding-block": paddingBlock,
          "--section-header-tag-padding-inline": paddingInline,
          "--section-header-tag-radius": radius
        } as CSSProperties
      }
    >
      {label}
    </span>
  );
}

const SECTION_HEADER_STYLESHEET = [
  toCssRule(`.${SECTION_HEADER_ROOT_CLASS}`, {
    "align-items": "flex-start",
    display: "flex",
    "flex-direction": "column",
    gap: "var(--section-header-container-gap)",
    "justify-content": "center",
    "max-width": "100%",
    "min-width": "0",
    width: "100%"
  }),
  toCssRule(`.${SECTION_HEADER_CENTERED_CLASS}`, {
    "align-items": "flex-start"
  }),
  toCssRule(`.${SECTION_HEADER_ROW_CLASS}`, {
    "align-items": "flex-start",
    display: "flex",
    flex: "wrap",
    "flex-wrap": "wrap",
    gap: "var(--section-header-row-gap)",
    "justify-content": "space-between",
    "min-width": "0",
    width: "100%"
  }),
  toCssRule(`.${SECTION_HEADER_CONTENT_CLASS}`, {
    display: "flex",
    flex: "1 1 0%",
    "flex-direction": "column",
    gap: "var(--section-header-content-gap)",
    "min-width": "0"
  }),
  toCssRule(`.${SECTION_HEADER_TITLE_BLOCK_CLASS}`, {
    display: "flex",
    "flex-direction": "column",
    gap: "0",
    "min-width": "0",
    width: "100%"
  }),
  toCssRule(`.${SECTION_HEADER_TITLE_ROW_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex-wrap": "wrap",
    gap: "var(--section-header-title-row-gap)",
    "max-width": "100%",
    "min-width": "0"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_LINE_CLASS}`, {
    "align-items": "center",
    display: "flex",
    flex: "1",
    gap: "var(--section-header-title-row-gap)",
    "max-width": "100%",
    "min-width": "0",
    width: "100%"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_LINE_CLASS}[data-centered="true"]`, {
    flex: "0 1 auto",
    "justify-content": "center",
    width: "auto"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_LINE_CLASS}[data-inline="true"]`, {
    flex: "0 1 auto",
    width: "auto"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_ICON_CLASS}`, {
    "align-items": "center",
    color: "inherit",
    display: "inline-flex",
    "flex-shrink": "0",
    height: "var(--section-header-icon-size)",
    "justify-content": "center",
    "line-height": "0",
    width: "var(--section-header-icon-size)"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_TEXT_CLASS}`, {
    color: "inherit",
    display: "-webkit-box",
    flex: "1",
    "font-family": "var(--section-header-title-font-family)",
    "font-size": "var(--section-header-title-font-size)",
    "font-weight": "var(--section-header-title-font-weight)",
    "letter-spacing": "var(--section-header-title-letter-spacing)",
    "line-height": "var(--section-header-title-line-height)",
    "max-width": "100%",
    "min-width": "0",
    overflow: "hidden",
    "overflow-wrap": "anywhere",
    "text-overflow": "ellipsis",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "2",
    "white-space": "normal"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_LINE_CLASS}[data-centered="true"] .${SECTION_HEADER_HEADER_TEXT_CLASS}`, {
    flex: "0 1 auto",
    "text-align": "center"
  }),
  toCssRule(`.${SECTION_HEADER_HEADER_LINE_CLASS}[data-inline="true"] .${SECTION_HEADER_HEADER_TEXT_CLASS}`, {
    flex: "0 1 auto"
  }),
  toCssRule(`.${SECTION_HEADER_DESCRIPTION_CLASS}`, {
    color: "var(--section-header-description-color)",
    display: "-webkit-box",
    "font-family": "var(--section-header-description-font-family)",
    "font-size": "var(--section-header-description-font-size)",
    "font-weight": "var(--section-header-description-font-weight)",
    "letter-spacing": "var(--section-header-description-letter-spacing)",
    "line-height": "var(--section-header-description-line-height)",
    margin: "0",
    overflow: "hidden",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "2",
    width: "100%"
  }),
  toCssRule(`.${SECTION_HEADER_CENTERED_CLASS} .${SECTION_HEADER_DESCRIPTION_CLASS}`, {
    "text-align": "center"
  }),
  toCssRule(`.${SECTION_HEADER_ACTION_CLASS}`, {
    "align-items": "flex-end",
    "align-self": "stretch",
    display: "flex",
    "flex-direction": "column",
    "flex-shrink": "0",
    gap: "var(--section-header-action-gap)",
    "justify-content": "center",
    "margin-left": "auto",
    "max-width": "100%",
    "min-height": "var(--section-header-action-height)"
  }),
  toCssRule(`.${SECTION_HEADER_ACTION_STACK_CLASS}`, {
    display: "flex",
    "flex-direction": "column",
    gap: "var(--section-header-action-stack-gap)",
    "justify-content": "center",
    "max-width": "100%"
  }),
  toCssRule(`.${SECTION_HEADER_TAG_CLASS}`, {
    "align-items": "center",
    background: "var(--section-header-tag-background)",
    "border-radius": "var(--section-header-tag-radius)",
    "box-sizing": "border-box",
    color: "var(--section-header-tag-color)",
    display: "inline-flex",
    "flex-shrink": "0",
    "font-family": "var(--section-header-tag-font-family)",
    "font-size": "var(--section-header-tag-font-size)",
    "font-weight": "var(--section-header-tag-font-weight)",
    height: "var(--section-header-tag-height)",
    "justify-content": "center",
    "letter-spacing": "var(--section-header-tag-letter-spacing)",
    "line-height": "var(--section-header-tag-line-height)",
    padding: "var(--section-header-tag-padding-block) var(--section-header-tag-padding-inline)",
    "white-space": "nowrap"
  }),
  toCssRule(`.${SECTION_HEADER_DIVIDER_CLASS}`, {
    display: "block",
    flex: "1",
    height: "var(--section-header-divider-thickness)",
    "min-width": "0"
  }),
  toCssRule(`.${SECTION_HEADER_CENTERED_GROUP_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex-direction": "column",
    gap: "var(--section-header-content-gap)",
    "justify-content": "center",
    "padding-bottom": "var(--section-header-container-padding-bottom)",
    width: "100%"
  }),
  toCssRule(`.${SECTION_HEADER_CENTERED_TITLE_STACK_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex-direction": "column",
    gap: "var(--section-header-title-stack-gap)",
    "justify-content": "center",
    width: "100%"
  })
].join("");

export function SectionHeader({
  brand = "Cars24",
  inverse = false,
  title = "Section title",
  showSubtitle = true,
  subtitle = "Section title line 2",
  showDescription = true,
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
  useInsertionEffect(() => {
    ensureStyleSheet(SECTION_HEADER_STYLESHEET_ID, SECTION_HEADER_STYLESHEET);
  }, []);

  const containerGap = toPx(resolveSectionHeaderBindingValue(brand, "container.gap", "8"));
  const containerPaddingBottom = toPx(resolveSectionHeaderBindingValue(brand, "container.paddingBottom", "0"));
  const layoutVariant = resolveSectionHeaderBindingValue(brand, "layout.variant", "split");
  const isCentered = layoutVariant === "centered";
  const rowGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.rowGap", "24"));
  const contentGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.contentGap", "4"));
  const titleRowGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.titleRowGap", "8"));
  const titleStackGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.titleStackGap", "0"));
  const actionGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.actionGap", "6"));
  const actionStackGap = toPx(resolveSectionHeaderBindingValue(brand, "layout.actionStackGap", "10"));
  const actionHeight = toPx(resolveSectionHeaderBindingValue(brand, "action.height", "18"));
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
  const titleFontFamily = resolveSectionHeaderBindingValue(brand, "typography.title.fontFamily", "Inter");
  const titleFontWeight = Number(resolveSectionHeaderBindingValue(brand, "typography.title.fontWeight", "600"));
  const titleFontSize = toPx(resolveSectionHeaderBindingValue(brand, "typography.title.fontSize", "17"));
  const titleLineHeight = toPx(resolveSectionHeaderBindingValue(brand, "typography.title.lineHeight", "22"));
  const titleLetterSpacing = toPx(resolveSectionHeaderBindingValue(brand, "typography.title.letterSpacing", "-0.02"));
  const iconSize = toPx(resolveSectionHeaderBindingValue(brand, "icon.size", "16"));
  const resolvedShowSubtitle = showSubtitle;
  const resolvedShowDescription = showDescription;
  const resolvedShowTag = isCentered ? false : showTag;
  const resolvedShowAction = isCentered ? false : showAction;

  const rootClassName = joinClassNames(
    SECTION_HEADER_ROOT_CLASS,
    isCentered && SECTION_HEADER_CENTERED_CLASS,
    className
  );

  const rootStyle = {
    "--section-header-action-gap": actionGap,
    "--section-header-action-height": actionHeight,
    "--section-header-action-stack-gap": actionStackGap,
    "--section-header-container-gap": containerGap,
    "--section-header-container-padding-bottom": containerPaddingBottom,
    "--section-header-content-gap": contentGap,
    "--section-header-description-color": descriptionColor,
    "--section-header-description-font-family": `${descriptionFontFamily}, sans-serif`,
    "--section-header-description-font-size": descriptionFontSize,
    "--section-header-description-font-weight": String(descriptionFontWeight),
    "--section-header-description-letter-spacing": descriptionLetterSpacing,
    "--section-header-description-line-height": descriptionLineHeight,
    "--section-header-divider-thickness": dividerThickness,
    "--section-header-icon-size": iconSize,
    "--section-header-row-gap": rowGap,
    "--section-header-title-font-family": `${titleFontFamily}, sans-serif`,
    "--section-header-title-font-size": titleFontSize,
    "--section-header-title-font-weight": String(titleFontWeight),
    "--section-header-title-letter-spacing": titleLetterSpacing,
    "--section-header-title-line-height": titleLineHeight,
    "--section-header-title-row-gap": titleRowGap,
    "--section-header-title-stack-gap": titleStackGap,
    ...style
  } as CSSProperties;

  if (isCentered) {
    return (
      <div {...rest} className={rootClassName} style={rootStyle}>
        <div className={SECTION_HEADER_CENTERED_GROUP_CLASS}>
          <div className={SECTION_HEADER_CENTERED_TITLE_STACK_CLASS}>
            <div className={SECTION_HEADER_TITLE_ROW_CLASS} style={{ justifyContent: "center", width: "100%" }}>
              <DividerLine
                direction="left"
                opaqueColor={dividerOpaqueColor}
                transparentColor={dividerTransparentColor}
              />
              {buildHeaderLine({ brand, centered: true, color: titleColor, icon: titleIcon, text: title })}
              <DividerLine
                direction="right"
                opaqueColor={dividerOpaqueColor}
                transparentColor={dividerTransparentColor}
              />
            </div>
            {resolvedShowSubtitle
              ? buildHeaderLine({ brand, centered: true, color: titleColor, icon: subtitleIcon, text: subtitle })
              : null}
          </div>

          {resolvedShowDescription ? (
            <p className={SECTION_HEADER_DESCRIPTION_CLASS}>{description}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div {...rest} className={rootClassName} style={rootStyle}>
      <div className={SECTION_HEADER_ROW_CLASS}>
        <div className={SECTION_HEADER_CONTENT_CLASS}>
          <div className={SECTION_HEADER_TITLE_BLOCK_CLASS}>
            <div className={SECTION_HEADER_TITLE_ROW_CLASS}>
              {buildHeaderLine({ brand, color: titleColor, icon: titleIcon, inline: true, text: title })}
              {resolvedShowTag ? <Tag brand={brand} label={tagLabel} /> : null}
            </div>
            {resolvedShowSubtitle
              ? buildHeaderLine({ brand, color: titleColor, icon: subtitleIcon, text: subtitle })
              : null}
          </div>

          {resolvedShowDescription ? (
            <p className={SECTION_HEADER_DESCRIPTION_CLASS}>{description}</p>
          ) : null}
        </div>

        {resolvedShowAction ? (
          <div className={SECTION_HEADER_ACTION_CLASS}>
            <div className={SECTION_HEADER_ACTION_STACK_CLASS}>
              <LinkButton
                brand={brand}
                onClick={onActionClick}
                onDark={inverse}
                size="Small"
                tone="Brand"
                underline={false}
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
