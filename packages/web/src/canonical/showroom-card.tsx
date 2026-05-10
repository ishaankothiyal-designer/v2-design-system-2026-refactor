import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { designSystemRegistry } from "@geist/contracts";
import type { DisplayBrandId } from "@geist/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Button } from "./button";
import { Icon } from "./icon";
import { LinkButton } from "./link-button";

export const canonicalShowroomCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.showroomCard"
);

export type ShowroomCardSize = "Small" | "Large";

type ShowroomCardMetrics = {
  widthSlot: string;
  mediaHeightSlot: string;
  notchWidth: number;
  notchHeight: number;
  notchLabelInsetX: string;
  notchLabelInsetY: string;
  contentPadding: string;
  contentGap: string;
  detailGap: string;
  inlineGap: string;
  actionGap: string;
  actionButtonSize: "Small" | "Medium";
  directionsLinkSize: "Extra Small" | "Small";
};

const SHOWROOM_CARD_METRICS: Record<ShowroomCardSize, ShowroomCardMetrics> = {
  Small: {
    widthSlot: "size.small.width",
    mediaHeightSlot: "media.height.small",
    notchWidth: 117,
    notchHeight: 28,
    notchLabelInsetX: "12px",
    notchLabelInsetY: "5px",
    contentPadding: "12px",
    contentGap: "8px",
    detailGap: "4px",
    inlineGap: "4px",
    actionGap: "8px",
    actionButtonSize: "Small",
    directionsLinkSize: "Extra Small"
  },
  Large: {
    widthSlot: "size.large.width",
    mediaHeightSlot: "media.height.large",
    notchWidth: 117,
    notchHeight: 28,
    notchLabelInsetX: "12px",
    notchLabelInsetY: "5px",
    contentPadding: "12px",
    contentGap: "16px",
    detailGap: "8px",
    inlineGap: "8px",
    actionGap: "12px",
    actionButtonSize: "Medium",
    directionsLinkSize: "Small"
  }
};

export interface ShowroomCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  address?: string;
  brand?: DisplayBrandId;
  children?: ReactNode;
  directionsLabel?: string;
  directionsLinkLabel?: string;
  inventoryLabel?: string;
  onDirectionsClick?: MouseEventHandler<HTMLButtonElement>;
  onPrimaryActionClick?: MouseEventHandler<HTMLButtonElement>;
  onSecondaryActionClick?: MouseEventHandler<HTMLButtonElement>;
  primaryActionLabel?: string;
  rating?: number | string;
  reviewCount?: string;
  secondaryActionLabel?: string;
  showDirectionsLink?: boolean;
  showPrimaryAction?: boolean;
  showSecondaryAction?: boolean;
  size?: ShowroomCardSize;
  statusLabel?: string;
  statusText?: string;
  title?: string;
}

function getShowroomCardToken(slot: string) {
  return canonicalShowroomCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveShowroomCardBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getShowroomCardToken(slot);

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

function resolveShowroomCardBindingRem(brand: DisplayBrandId, slot: string, fallback: string) {
  return tokenValueToRem(resolveShowroomCardBindingValue(brand, slot, fallback));
}

function formatRatingValue(value: number | string) {
  return typeof value === "number" ? value.toFixed(1) : value;
}

const singleLineTextStyles: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

export function ShowroomCard({
  address = "Sector 56, Gurgaon",
  brand = "Cars24",
  children,
  className,
  directionsLabel = "4.5 km away from Canna...",
  directionsLinkLabel = "Get Directions",
  inventoryLabel = "135+ Cars",
  onDirectionsClick,
  onPrimaryActionClick,
  onSecondaryActionClick,
  primaryActionLabel = "Label",
  rating = 4.4,
  reviewCount = "(281)",
  secondaryActionLabel = "Label",
  showDirectionsLink = true,
  showPrimaryAction = true,
  showSecondaryAction = true,
  size = "Small",
  statusLabel = "Open",
  statusText = "Closes at 8 PM",
  style,
  title = "Piyush Mahendra Mall",
  ...rest
}: ShowroomCardProps) {
  const metrics = SHOWROOM_CARD_METRICS[size];
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const regularWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const mediumWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const semiboldWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const rootWidth = resolveShowroomCardBindingRem(brand, metrics.widthSlot, size === "Small" ? "288px" : "336px");
  const rootRadius = resolveShowroomCardBindingRem(brand, "container.radius", "16px");
  const borderWidth = resolveShowroomCardBindingRem(brand, "container.borderWidth", "2px");
  const rootSurface = resolveShowroomCardBindingValue(brand, "container.surface", "var(--cars24-semantic-bg-primary, #FFFFFF)");
  const borderColor = resolveShowroomCardBindingValue(brand, "container.border", "var(--cars24-semantic-border-white, #FFFFFF)");
  const primaryShadow = resolveShowroomCardBindingValue(
    brand,
    "container.shadow.primary",
    "0px 6px 16px 0px rgba(31, 41, 55, 0.04)"
  );
  const secondaryShadow = resolveShowroomCardBindingValue(
    brand,
    "container.shadow.secondary",
    "0px 2px 8px 0px rgba(31, 41, 55, 0.02)"
  );
  const mediaHeight = resolveShowroomCardBindingRem(brand, metrics.mediaHeightSlot, size === "Small" ? "140px" : "144px");
  const mediaSurface = resolveShowroomCardBindingValue(brand, "media.surface", "color-mix(in srgb, #FFE8F7 100%, transparent)");
  const contentPadding = resolveShowroomCardBindingRem(brand, "content.padding", metrics.contentPadding);
  const contentGap = resolveShowroomCardBindingRem(brand, "content.stackGap", metrics.contentGap);
  const detailGap = resolveShowroomCardBindingRem(brand, "content.detailGap", metrics.detailGap);
  const inlineGap = resolveShowroomCardBindingRem(brand, "content.inlineGap", metrics.inlineGap);
  const ratingGap = resolveShowroomCardBindingRem(brand, "rating.gap", "2.4px");
  const titleColor = resolveShowroomCardBindingValue(brand, "content.title.color", "#101828");
  const bodyPrimaryColor = resolveShowroomCardBindingValue(brand, "content.bodyPrimary.color", "#101828");
  const bodySecondaryColor = resolveShowroomCardBindingValue(brand, "content.bodySecondary.color", "#475467");
  const directionsColor = resolveShowroomCardBindingValue(
    brand,
    "directions.foreground",
    "var(--cars24-semantic-text-brand-base, #4736FE)"
  );
  const statusSuccessColor = resolveShowroomCardBindingValue(
    brand,
    "status.success.color",
    "var(--cars24-semantic-text-success-base, #1C9C1C)"
  );
  const statusDotSize = resolveShowroomCardBindingRem(brand, "status.dot.size", "2px");
  const dividerColor = resolveShowroomCardBindingValue(brand, "divider.color", "#D0D5DD");
  const titleFontSize = resolveShowroomCardBindingRem(brand, "content.title.fontSize", "17px");
  const titleLineHeight = resolveShowroomCardBindingRem(brand, "content.title.lineHeight", "22px");
  const titleLetterSpacing = resolveShowroomCardBindingRem(brand, "content.title.letterSpacing", "0px");
  const bodyFontSize = resolveShowroomCardBindingRem(brand, "content.body.fontSize", "12px");
  const bodyLineHeight = resolveShowroomCardBindingRem(brand, "content.body.lineHeight", "18px");
  const bodyLetterSpacing = resolveShowroomCardBindingRem(brand, "content.body.letterSpacing", "0px");
  const labelMdFontSize = resolveShowroomCardBindingRem(brand, "content.label.md.fontSize", "14px");
  const labelMdLineHeight = resolveShowroomCardBindingRem(brand, "content.label.md.lineHeight", "18px");
  const labelMdLetterSpacing = resolveShowroomCardBindingRem(brand, "content.label.md.letterSpacing", "0px");
  const labelXsFontSize = resolveShowroomCardBindingRem(brand, "content.label.xs.fontSize", "11px");
  const labelXsLineHeight = resolveShowroomCardBindingRem(brand, "content.label.xs.lineHeight", "14px");
  const labelXsLetterSpacing = resolveShowroomCardBindingRem(brand, "content.label.xs.letterSpacing", "0px");
  const badgeSurface = resolveShowroomCardBindingValue(brand, "badge.surface", "var(--cars24-semantic-bg-primary, #FFFFFF)");
  const badgeForeground = resolveShowroomCardBindingValue(brand, "badge.foreground", "#101828");
  const ratingIconColor = resolveShowroomCardBindingValue(
    brand,
    "rating.iconColor",
    "var(--cars24-primitive-amber-500, #FD9A00)"
  );
  const actionGap = resolveShowroomCardBindingRem(brand, "actions.gap", metrics.actionGap);
  const slotRadius = resolveShowroomCardBindingRem(brand, "media.radius.top", "16px");
  const hasActions = showPrimaryAction || showSecondaryAction;
  const contentPaddingTop = contentPadding;
  const notchWidth = tokenValueToRem(metrics.notchWidth);
  const notchHeight = tokenValueToRem(metrics.notchHeight);
  const notchLabelInsetX = tokenValueToRem(metrics.notchLabelInsetX);
  const notchLabelInsetY = tokenValueToRem(metrics.notchLabelInsetY);
  const notchPath =
    "M77 0C82.6586 0 88.0596 2.85644 91.8984 7.87891L100.683 19.3711C104.887 24.8718 110.803 28 117 28H0V0H77Z";

  const titleStyles: CSSProperties = {
    ...singleLineTextStyles,
    color: titleColor,
    fontFamily,
    fontSize: titleFontSize,
    fontWeight: semiboldWeight,
    letterSpacing: titleLetterSpacing,
    lineHeight: titleLineHeight,
    margin: 0,
    minWidth: 0
  };

  const bodyStyles: CSSProperties = {
    ...singleLineTextStyles,
    color: bodyPrimaryColor,
    fontFamily,
    fontSize: bodyFontSize,
    fontWeight: regularWeight,
    letterSpacing: bodyLetterSpacing,
    lineHeight: bodyLineHeight,
    margin: 0,
    minWidth: 0
  };

  const secondaryBodyStyles: CSSProperties = {
    ...bodyStyles,
    color: bodySecondaryColor
  };

  const statusTextStyles: CSSProperties = {
    ...singleLineTextStyles,
    color: bodySecondaryColor,
    fontFamily,
    fontSize: labelMdFontSize,
    fontWeight: regularWeight,
    letterSpacing: labelMdLetterSpacing,
    lineHeight: labelMdLineHeight,
    margin: 0,
    minWidth: 0
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        background: rootSurface,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: rootRadius,
        boxShadow: `${primaryShadow}, ${secondaryShadow}`,
        boxSizing: "border-box",
        display: "inline-flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        width: rootWidth,
        ...style
      }}
    >
      <div
        style={{
          background: mediaSurface,
          borderTopLeftRadius: slotRadius,
          borderTopRightRadius: slotRadius,
          height: mediaHeight,
          overflow: "hidden",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            background: mediaSurface,
            height: "100%",
            width: "100%"
          }}
        >
          {children ?? null}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: contentGap,
          position: "relative",
          paddingBottom: contentPadding,
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
          paddingTop: contentPaddingTop
        }}
      >
        {inventoryLabel ? (
          <div
            aria-hidden="true"
            style={{
              height: notchHeight,
              left: 0,
              pointerEvents: "none",
              position: "absolute",
              top: `calc(${notchHeight} * -1)`,
              width: notchWidth,
              zIndex: 0
            }}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              style={{ display: "block", height: "100%", width: "100%" }}
              viewBox={`0 0 ${metrics.notchWidth} ${metrics.notchHeight}`}
              preserveAspectRatio="xMinYMin meet"
            >
              <path d={notchPath} fill={badgeSurface} />
            </svg>
          </div>
        ) : null}

        {inventoryLabel ? (
          <div
            style={{
              left: notchLabelInsetX,
              pointerEvents: "none",
              position: "absolute",
              top: `calc(${notchHeight} * -1 + ${notchLabelInsetY})`,
              zIndex: 1
            }}
          >
            <span
              style={{
                ...singleLineTextStyles,
                color: badgeForeground,
                display: "inline-flex",
                fontFamily,
                fontSize: labelMdFontSize,
                fontWeight: mediumWeight,
                letterSpacing: labelMdLetterSpacing,
                lineHeight: labelMdLineHeight
              }}
            >
              {inventoryLabel}
            </span>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: detailGap }}>
          <div style={{ display: "grid", gap: detailGap }}>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: tokenValueToRem(16),
                justifyContent: "space-between",
                minWidth: 0
              }}
            >
              <h3 style={titleStyles}>{title}</h3>

              <div
                style={{
                  alignItems: "center",
                  display: "inline-flex",
                  flexShrink: 0,
                  gap: ratingGap
                }}
              >
                <Icon
                  decorative
                  name="star-filled"
                  style={{ color: ratingIconColor, fontSize: resolveShowroomCardBindingRem(brand, "rating.iconSize", "18px") }}
                />
                <span
                  style={{
                    color: titleColor,
                    fontFamily,
                    fontSize: labelXsFontSize,
                    fontWeight: semiboldWeight,
                    letterSpacing: labelXsLetterSpacing,
                    lineHeight: labelXsLineHeight
                  }}
                >
                  {formatRatingValue(rating)}
                </span>
                <span
                  style={{
                    color: bodySecondaryColor,
                    fontFamily,
                    fontSize: labelXsFontSize,
                    fontWeight: regularWeight,
                    letterSpacing: labelXsLetterSpacing,
                    lineHeight: labelXsLineHeight
                  }}
                >
                  {reviewCount}
                </span>
              </div>
            </div>

            <p style={secondaryBodyStyles}>{address}</p>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: inlineGap,
              minWidth: 0
            }}
          >
            <p style={{ ...bodyStyles, flex: "0 1 auto" }}>{directionsLabel}</p>
            {showDirectionsLink ? (
              <>
                <span
                  aria-hidden="true"
                  style={{
                    background: dividerColor,
                    display: "inline-flex",
                    flexShrink: 0,
                    height: bodyLineHeight,
                    width: tokenValueToRem(1)
                  }}
                />
                <LinkButton
                  brand={brand}
                  size={metrics.directionsLinkSize}
                  style={{ color: directionsColor }}
                  tone="Brand"
                  trailingIcon={<Icon decorative name="arrow-lbow-up-right" style={{ fontSize: "inherit" }} />}
                  type="button"
                  underline={false}
                  onClick={onDirectionsClick}
                >
                  {directionsLinkLabel}
                </LinkButton>
              </>
            ) : null}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "inline-flex",
            gap: inlineGap,
            minWidth: 0
          }}
        >
          <span
            aria-hidden="true"
            style={{
              background: statusSuccessColor,
              borderRadius: "999px",
              display: "inline-flex",
              flexShrink: 0,
              height: statusDotSize,
              width: statusDotSize
            }}
          />
          <span
            style={{
              ...singleLineTextStyles,
              color: statusSuccessColor,
              fontFamily,
              fontSize: labelMdFontSize,
              fontWeight: regularWeight,
              letterSpacing: labelMdLetterSpacing,
              lineHeight: labelMdLineHeight
            }}
          >
            {statusLabel}
          </span>
          <span aria-hidden="true" style={{ background: bodySecondaryColor, borderRadius: "999px", display: "inline-flex", flexShrink: 0, height: tokenValueToRem(1), width: tokenValueToRem(1) }} />
          <span style={statusTextStyles}>{statusText}</span>
        </div>

        {hasActions ? (
          <div
            style={{
              display: "flex",
              gap: actionGap,
              width: "100%"
            }}
          >
            {showSecondaryAction ? (
              <Button
                brand={brand}
                leadingIcon={<Icon decorative name="sparkle-filled" style={{ fontSize: "inherit" }} />}
                size={metrics.actionButtonSize}
                style={{ flex: "1 1 0", minWidth: 0, width: "100%" }}
                styleVariant="Outline"
                trailingIcon={<Icon decorative name="arrow-right-outline" style={{ fontSize: "inherit" }} />}
                type="button"
                onClick={onSecondaryActionClick}
              >
                {secondaryActionLabel}
              </Button>
            ) : null}

            {showPrimaryAction ? (
              <Button
                brand={brand}
                leadingIcon={<Icon decorative name="sparkle-filled" style={{ fontSize: "inherit" }} />}
                size={metrics.actionButtonSize}
                style={{ flex: "1 1 0", minWidth: 0, width: "100%" }}
                styleVariant="Solid"
                trailingIcon={<Icon decorative name="arrow-right-outline" style={{ fontSize: "inherit" }} />}
                type="button"
                onClick={onPrimaryActionClick}
              >
                {primaryActionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
