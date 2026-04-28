import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, getThemeTokenValue, pxToRem } from "../theme";
import { Avatar, type AvatarProps } from "./avatar";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { LinkButton } from "./link-button";
import { Radio } from "./radio";

export const canonicalListCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.listCard"
);

export type ListCardType =
  | "Small: 1T + 1ST"
  | "Med: 1B + 1T + 1ST"
  | "Med: 2T + 1ST"
  | "Med: 1T + 2ST"
  | "Med: 1T + 1ST + 1P"
  | "Large: 1B + 1T + 2ST";

export type ListCardLeftPartType =
  | "S - Image"
  | "M - Image"
  | "L - Image"
  | "XL"
  | "Avatar"
  | "Icon"
  | "Icon container";

export type ListCardRightPartType = "Icon" | "Badge" | "Radio" | "Checkbox" | "Link button";

type ListCardMetrics = {
  height: number;
  leftSlotWidth: number;
  titleLines: 1 | 2;
  subtitleLines: 1 | 2 | 3;
  stackGap: number;
  showsBadge: boolean;
  showsPrice: boolean;
};

const LIST_CARD_WIDTH = 336;
const LIST_CARD_CONTENT_INSET = 12;
const LIST_CARD_TITLE_TYPOGRAPHY = {
  fontSize: 15,
  lineHeight: 20,
  letterSpacing: -0.02
} as const;
const LIST_CARD_SUBTITLE_TYPOGRAPHY = {
  fontSize: 12,
  lineHeight: 18,
  letterSpacing: 0
} as const;
const LIST_CARD_PRICE_TYPOGRAPHY = {
  fontSize: 13,
  lineHeight: 16,
  letterSpacing: 0
} as const;
const LIST_CARD_STRIKE_PRICE_TYPOGRAPHY = {
  fontSize: 9,
  lineHeight: 14,
  letterSpacing: 0
} as const;
const LIST_CARD_LEFT_PART_EXPAND_SHADOW =
  "0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)";

const LIST_CARD_METRICS: Record<ListCardType, ListCardMetrics> = {
  "Small: 1T + 1ST": {
    height: 67,
    leftSlotWidth: 84,
    titleLines: 1,
    subtitleLines: 1,
    stackGap: 0,
    showsBadge: false,
    showsPrice: false
  },
  "Med: 1B + 1T + 1ST": {
    height: 84,
    leftSlotWidth: 84,
    titleLines: 1,
    subtitleLines: 1,
    stackGap: 4,
    showsBadge: true,
    showsPrice: false
  },
  "Med: 2T + 1ST": {
    height: 84,
    leftSlotWidth: 84,
    titleLines: 2,
    subtitleLines: 1,
    stackGap: 0,
    showsBadge: false,
    showsPrice: false
  },
  "Med: 1T + 2ST": {
    height: 84,
    leftSlotWidth: 84,
    titleLines: 1,
    subtitleLines: 2,
    stackGap: 0,
    showsBadge: false,
    showsPrice: false
  },
  "Med: 1T + 1ST + 1P": {
    height: 84,
    leftSlotWidth: 84,
    titleLines: 1,
    subtitleLines: 1,
    stackGap: 0,
    showsBadge: false,
    showsPrice: true
  },
  "Large: 1B + 1T + 2ST": {
    height: 118,
    leftSlotWidth: 100,
    titleLines: 1,
    subtitleLines: 3,
    stackGap: 4,
    showsBadge: true,
    showsPrice: false
  }
};

const LIST_CARD_LEFT_PART_IMAGE_DIMENSIONS: Record<
  Extract<ListCardLeftPartType, "S - Image" | "M - Image" | "L - Image" | "XL">,
  { height: number; width: number }
> = {
  "S - Image": {
    height: 67,
    width: 84
  },
  "M - Image": {
    height: 84,
    width: 84
  },
  "L - Image": {
    height: 118,
    width: 100
  },
  XL: {
    height: 147,
    width: 100
  }
};

function isImageLeftPartType(type: ListCardLeftPartType) {
  return type === "S - Image" || type === "M - Image" || type === "L - Image" || type === "XL";
}

function getDefaultLeftPartType(type: ListCardType): ListCardLeftPartType {
  if (type === "Small: 1T + 1ST") {
    return "S - Image";
  }

  if (type === "Large: 1B + 1T + 2ST") {
    return "L - Image";
  }

  return "M - Image";
}

function getLineClampStyles(lines: number): CSSProperties {
  if (lines === 1) {
    return {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
  }

  return {
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    display: "-webkit-box",
    overflow: "hidden"
  };
}

export interface ListCardLeftPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  avatarProps?: Partial<AvatarProps> | undefined;
  brand?: DisplayBrandId;
  children?: ReactNode;
  expandButton?: boolean;
  iconName?: IconName;
  type?: ListCardLeftPartType;
}

/**
 * Variant family for the fixed leading slot used by List Card, covering the image, avatar, icon, and framed-icon treatments defined in Figma.
 */
export function ListCardLeftPart({
  avatarProps,
  brand = "Cars24",
  children,
  expandButton = true,
  iconName = "placeholder-generate-outline",
  type = "S - Image",
  className,
  style,
  ...rest
}: ListCardLeftPartProps) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const slotSurface = String(
    getThemeTokenValue(brand, "color.brand.primary.50") ?? "var(--cars24-primitive-drive-pink-50, #FFE8F7)"
  );
  const borderColor = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const radiusMd = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.md")));
  const radiusXl = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.xl")));
  const iconSizeLg = pxToRem(Number(getRequiredThemeTokenValue(brand, "icon.size.lg")));
  const overlayTone = "var(--cars24-semantic-bg-secondary-alpha, rgba(26, 26, 26, 0.07))";

  const rootStyles: CSSProperties = isImageLeftPartType(type)
    ? {
        display: "flex",
        flexShrink: 0,
        height: pxToRem(LIST_CARD_LEFT_PART_IMAGE_DIMENSIONS[type].height),
        overflow: "hidden",
        position: "relative",
        width: pxToRem(LIST_CARD_LEFT_PART_IMAGE_DIMENSIONS[type].width),
        ...style
      }
    : {
        alignItems: "flex-start",
        borderBottomLeftRadius: radiusXl,
        borderTopLeftRadius: radiusXl,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: pxToRem(100),
        overflow: "hidden",
        paddingBlock: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.3"))),
        paddingInlineEnd: pxToRem(0),
        paddingInlineStart:
          type === "Icon"
            ? pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2")))
            : pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.3"))),
        position: "relative",
        width: pxToRem(type === "Avatar" ? 52 : type === "Icon" ? 32 : 60),
        ...style
      };

  const defaultAvatarProps: AvatarProps = {
    appearance: "Icon",
    adornment: "Status dot",
    brand,
    iconName: "people-circle-user-circle-avatar-profile-outline",
    onDark: false,
    size: "Small",
    statusDotColor: "Green"
  };

  const contentNode = isImageLeftPartType(type) ? (
    <div style={{ background: slotSurface, flex: 1, height: "100%", width: "100%" }}>{children ?? null}</div>
  ) : type === "Avatar" ? (
    <Avatar {...defaultAvatarProps} {...avatarProps} brand={brand} />
  ) : type === "Icon" ? (
    <Icon
      brand={brand}
      decorative
      name={iconName}
      style={{
        color: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
        fontSize: iconSizeLg
      }}
    />
  ) : (
    <div
      style={{
        alignItems: "center",
        background: surface,
        border: `1px solid ${borderColor}`,
        borderRadius: radiusMd,
        boxSizing: "border-box",
        display: "flex",
        height: pxToRem(40),
        justifyContent: "center",
        width: pxToRem(40)
      }}
    >
      <Icon
        brand={brand}
        decorative
        name={iconName}
        style={{
          color: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
          fontSize: iconSizeLg
        }}
      />
    </div>
  );

  return (
    <div {...rest} className={className} style={rootStyles}>
      {contentNode}

      {isImageLeftPartType(type) && expandButton ? (
        <div
          style={{
            background: overlayTone,
            inset: 0,
            position: "absolute"
          }}
        >
          <IconButton
            aria-label="Expand media"
            brand={brand}
            icon={<Icon decorative name="arrow-expand-45deg" />}
            size="XSmall"
            style={{
              background: surface,
              boxShadow: LIST_CARD_LEFT_PART_EXPAND_SHADOW,
              color: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
              position: "absolute",
              right: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2"))),
              top: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.2")))
            }}
            styleVariant="Transparent"
          />
        </div>
      ) : null}
    </div>
  );
}

export interface ListCardRightPartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  badgeLabel?: string | null;
  brand?: DisplayBrandId;
  checked?: boolean;
  linkLabel?: string | null;
  onDark?: boolean;
  selected?: boolean;
  type?: ListCardRightPartType;
}

/**
 * Variant family for the trailing slot used by List Card, covering the icon, badge, radio, checkbox, and link-button treatments defined in Figma.
 */
export function ListCardRightPart({
  badgeLabel = "Badge",
  brand = "Cars24",
  checked = false,
  linkLabel = "Know more",
  onDark = false,
  selected = false,
  type = "Icon",
  className,
  style,
  ...rest
}: ListCardRightPartProps) {
  const primaryText = String(
    getRequiredThemeTokenValue(brand, onDark ? "color.text.inverse" : "color.text.primary")
  );
  const radiusXl = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.xl")));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    alignSelf: "stretch",
    borderBottomLeftRadius: radiusXl,
    borderTopLeftRadius: radiusXl,
    color: primaryText,
    display: "flex",
    flexDirection: type === "Icon" ? "row" : "column",
    flexShrink: 0,
    justifyContent: "center",
    paddingInlineEnd: pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.3"))),
    ...style
  };

  const contentNode =
    type === "Badge" ? (
      <Badge
        brand={brand}
        labelText={badgeLabel ?? "Badge"}
        pillShape="No"
        priority="Low"
        size="Extra Small"
        type="Neutral"
      />
    ) : type === "Radio" ? (
      <Radio aria-label="Select item" brand={brand} checked={selected} readOnly size="Medium" />
    ) : type === "Checkbox" ? (
      <Checkbox aria-label="Toggle item" brand={brand} checked={checked} readOnly size="Medium" />
    ) : type === "Link button" ? (
      <LinkButton
        brand={brand}
        leadingIcon={<Icon decorative name="sparkle-filled" />}
        onDark={onDark}
        size="Extra Small"
        tone="Brand"
        trailingIcon={<Icon decorative name="arrow-right-outline" />}
        underline
      >
        {linkLabel ?? "Know more"}
      </LinkButton>
    ) : (
      <Icon
        brand={brand}
        decorative
        name="chevron-right-outline"
        style={{ color: primaryText, fontSize: pxToRem(16) }}
      />
    );

  return (
    <div {...rest} className={className} style={rootStyles}>
      {contentNode}
    </div>
  );
}

export interface ListCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  avatarProps?: Partial<AvatarProps> | undefined;
  brand?: DisplayBrandId;
  inverse?: boolean;
  leftPartExpandButton?: boolean;
  leftPartIconName?: IconName;
  leftPartType?: ListCardLeftPartType;
  type?: ListCardType;
  title?: string;
  subtitle?: string;
  badgeLabel?: string | null;
  price?: string | null;
  originalPrice?: string | null;
  linkLabel?: string | null;
  media?: ReactNode;
  rightPartBadgeLabel?: string | null;
  rightPartChecked?: boolean;
  rightPartLinkLabel?: string | null;
  rightPartSelected?: boolean;
  rightPartType?: ListCardRightPartType;
  showChevron?: boolean;
  ctaLeadingIconName?: IconName;
  ctaTrailingIconName?: IconName;
}

/**
 * Fixed-width editorial card that pairs a left media slot with tightly-scoped text combinations from the Figma list-card family.
 */
export function ListCard({
  brand = "Cars24",
  inverse = false,
  type = "Small: 1T + 1ST",
  title = "Title left (H4) 15px",
  subtitle = "Subtitles can be coloured",
  badgeLabel,
  price = "₹4.31 lakh",
  originalPrice = "₹4.91 lakh",
  linkLabel = null,
  media,
  rightPartBadgeLabel = null,
  rightPartChecked = false,
  rightPartLinkLabel = null,
  rightPartSelected = false,
  rightPartType,
  avatarProps,
  leftPartExpandButton = false,
  leftPartIconName = "placeholder-generate-outline",
  leftPartType,
  showChevron = true,
  ctaLeadingIconName = "sparkle-filled",
  ctaTrailingIconName = "arrow-right-outline",
  className,
  style,
  ...rest
}: ListCardProps) {
  const metrics = LIST_CARD_METRICS[type];
  const surface = String(
    getRequiredThemeTokenValue(brand, inverse ? "color.surface.inverse" : "color.surface.canvas")
  );
  const primaryText = String(
    getRequiredThemeTokenValue(brand, inverse ? "color.text.inverse" : "color.text.primary")
  );
  const secondaryText = inverse
    ? String(
        getThemeTokenValue(brand, "component.sectionHeader.color.dark.description") ??
          "rgba(255, 255, 255, 0.8)"
      )
    : String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const borderColor = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const semiboldWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const regularWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const rootRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.md")));
  const resolvedBadgeLabel = metrics.showsBadge ? badgeLabel ?? "Badge" : null;
  const showsPrice = metrics.showsPrice && Boolean(price);
  const showsLink = Boolean(linkLabel);
  const resolvedLeftPartType = leftPartType ?? getDefaultLeftPartType(type);
  const resolvedRightPartType = rightPartType ?? (showChevron ? "Icon" : undefined);

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: surface,
    border: inverse ? undefined : `1px solid ${borderColor}`,
    borderRadius: rootRadius,
    boxSizing: "border-box",
    display: "flex",
    height: pxToRem(metrics.height),
    overflow: "hidden",
    width: pxToRem(LIST_CARD_WIDTH),
    ...style
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 auto",
    gap: pxToRem(4),
    minWidth: 0,
    paddingInline: pxToRem(LIST_CARD_CONTENT_INSET)
  };

  const contentStackStyles: CSSProperties = {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    gap: pxToRem(metrics.stackGap),
    justifyContent: "center",
    minWidth: 0
  };

  const textBlockStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    minWidth: 0
  };

  const titleStyles: CSSProperties = {
    color: primaryText,
    fontFamily,
    fontSize: pxToRem(LIST_CARD_TITLE_TYPOGRAPHY.fontSize),
    fontWeight: semiboldWeight,
    letterSpacing: `${LIST_CARD_TITLE_TYPOGRAPHY.letterSpacing}px`,
    lineHeight: pxToRem(LIST_CARD_TITLE_TYPOGRAPHY.lineHeight),
    margin: 0,
    ...getLineClampStyles(metrics.titleLines)
  };

  const subtitleStyles: CSSProperties = {
    color: secondaryText,
    fontFamily,
    fontSize: pxToRem(LIST_CARD_SUBTITLE_TYPOGRAPHY.fontSize),
    fontWeight: regularWeight,
    letterSpacing: `${LIST_CARD_SUBTITLE_TYPOGRAPHY.letterSpacing}px`,
    lineHeight: pxToRem(LIST_CARD_SUBTITLE_TYPOGRAPHY.lineHeight),
    margin: 0,
    ...getLineClampStyles(metrics.subtitleLines)
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <ListCardLeftPart
        brand={brand}
        expandButton={leftPartExpandButton}
        iconName={leftPartIconName}
        type={resolvedLeftPartType}
        {...(avatarProps ? { avatarProps } : {})}
      >
        {media ?? null}
      </ListCardLeftPart>

      <div style={contentStyles}>
        <div style={contentStackStyles}>
          {resolvedBadgeLabel ? (
            <Badge
              brand={brand}
              labelText={resolvedBadgeLabel}
              pillShape="No"
              priority="Low"
              size="Extra Small"
              type="Neutral"
            />
          ) : null}

          <div style={textBlockStyles}>
            <p style={titleStyles}>{title}</p>
            {subtitle ? <p style={subtitleStyles}>{subtitle}</p> : null}
          </div>

          {showsLink ? (
            <LinkButton
              brand={brand}
              leadingIcon={<Icon decorative name={ctaLeadingIconName} />}
              onDark={inverse}
              size="Extra Small"
              tone="Brand"
              trailingIcon={<Icon decorative name={ctaTrailingIconName} />}
              underline
            >
              {linkLabel}
            </LinkButton>
          ) : null}

          {showsPrice ? (
            <div style={{ alignItems: "center", display: "flex", gap: pxToRem(2), minWidth: 0 }}>
              <span
                style={{
                  color: primaryText,
                  fontFamily,
                  fontSize: pxToRem(LIST_CARD_PRICE_TYPOGRAPHY.fontSize),
                  fontWeight: semiboldWeight,
                  letterSpacing: `${LIST_CARD_PRICE_TYPOGRAPHY.letterSpacing}px`,
                  lineHeight: pxToRem(LIST_CARD_PRICE_TYPOGRAPHY.lineHeight),
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {price}
              </span>

              {originalPrice ? (
                <span
                  style={{
                    color: secondaryText,
                    fontFamily,
                    fontSize: pxToRem(LIST_CARD_STRIKE_PRICE_TYPOGRAPHY.fontSize),
                    fontWeight: regularWeight,
                    letterSpacing: `${LIST_CARD_STRIKE_PRICE_TYPOGRAPHY.letterSpacing}px`,
                    lineHeight: pxToRem(LIST_CARD_STRIKE_PRICE_TYPOGRAPHY.lineHeight),
                    minWidth: 0,
                    overflow: "hidden",
                    textDecoration: "line-through",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {originalPrice}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {resolvedRightPartType ? (
          <ListCardRightPart
            badgeLabel={rightPartBadgeLabel ?? resolvedBadgeLabel ?? "Badge"}
            brand={brand}
            checked={rightPartChecked}
            linkLabel={rightPartLinkLabel ?? linkLabel ?? "Know more"}
            onDark={inverse}
            selected={rightPartSelected}
            type={resolvedRightPartType}
          />
        ) : null}
      </div>
    </div>
  );
}
