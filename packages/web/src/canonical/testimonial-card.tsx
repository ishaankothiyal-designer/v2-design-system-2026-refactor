import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Avatar } from "./avatar";
import { Ratings } from "./ratings";

export const canonicalTestimonialCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.testimonialCard"
);

export type TestimonialCardSize = "Large" | "Small";

type TestimonialCardIdentityPlacement = "Center" | "sideways";

export interface TestimonialCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  avatar?: ReactNode;
  avatarImageAlt?: string;
  avatarImageSrc?: string;
  brand?: DisplayBrandId;
  customerName?: string;
  dateLabel?: string;
  description?: string;
  detailLabel?: string;
  initials?: string;
  rating?: number;
  showRating?: boolean;
  showSource?: boolean;
  showTitle?: boolean;
  size?: TestimonialCardSize;
  sourceLabel?: string;
  title?: string;
}

const DEFAULT_DESCRIPTION =
  "The car appeared to be in pristine condition, almost as if it had just rolled off the showroom floor. However, the report revealed that it had been involved in two accidents.";

const ellipsisStyles: CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

function getThemeValue(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function getThemeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function getThemeRem(brand: DisplayBrandId, path: string) {
  return pxToRem(getThemeNumber(brand, path));
}

function getTypographyStyles({
  brand,
  color,
  path,
  weightPath
}: {
  brand: DisplayBrandId;
  color: string;
  path: string;
  weightPath: string;
}): CSSProperties {
  return {
    color,
    fontFamily: `${getThemeValue(brand, "typography.fontFamily.sans")}, sans-serif`,
    fontSize: getThemeRem(brand, `${path}.fontSize`),
    fontWeight: getThemeNumber(brand, weightPath),
    letterSpacing: getThemeRem(brand, `${path}.letterSpacing`),
    lineHeight: getThemeRem(brand, `${path}.lineHeight`),
    margin: 0
  };
}

function getLineClampStyles(lines: number): CSSProperties {
  return {
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis"
  } as CSSProperties;
}

function getDescriptionTypographyKey(size: TestimonialCardSize, showTitle: boolean) {
  if (showTitle) {
    return size === "Large" ? "titleLarge" : "titleSmall";
  }

  return size === "Large" ? "large" : "small";
}

function getDescriptionLineClamp(size: TestimonialCardSize, showTitle: boolean) {
  if (size === "Large") {
    return 3;
  }

  return showTitle ? 3 : 5;
}

function getCardHeightKey(size: TestimonialCardSize, showTitle: boolean) {
  if (showTitle) {
    return size === "Large" ? "titleLarge" : "titleSmall";
  }

  return size === "Large" ? "large" : "small";
}

function getCardRadiusToken(size: TestimonialCardSize) {
  return size === "Large" ? "radius.xl" : "radius.md";
}

function TestimonialCardIdentity({
  avatar,
  avatarImageAlt = "Customer photo",
  avatarImageSrc,
  brand,
  customerName,
  dateLabel,
  detailLabel,
  initials,
  placement
}: {
  avatar?: ReactNode;
  avatarImageAlt?: string;
  avatarImageSrc?: string;
  brand: DisplayBrandId;
  customerName: string;
  dateLabel: string;
  detailLabel: string;
  initials: string;
  placement: TestimonialCardIdentityPlacement;
}) {
  const isCenter = placement === "Center";
  const placementKey = isCenter ? "center" : "sideways";
  const sizeKey = isCenter ? "large" : "small";
  const metadataColor = getThemeValue(brand, "component.testimonialCard.color.metadata");

  const rootStyles: CSSProperties = {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexShrink: 0,
    gap: getThemeRem(brand, `component.testimonialCard.layout.bottomBar.gap.${placementKey}`),
    justifyContent: "center",
    padding: 0,
    width: getThemeRem(brand, `component.testimonialCard.layout.bottomBar.width.${placementKey}`)
  };

  const nameStyles: CSSProperties = {
    ...getTypographyStyles({
      brand,
      color: getThemeValue(brand, "component.testimonialCard.color.title"),
      path: `component.testimonialCard.typography.name.${sizeKey}`,
      weightPath: "typography.fontWeight.semibold"
    }),
    ...ellipsisStyles,
    width: "100%"
  };

  const detailStyles = getTypographyStyles({
    brand,
    color: metadataColor,
    path: `component.testimonialCard.typography.details.${sizeKey}`,
    weightPath: "typography.fontWeight.medium"
  });

  const defaultAvatar = (
    <Avatar
      adornment="Status dot"
      appearance={avatarImageSrc ? "Image" : "Initials"}
      brand={brand}
      imageAlt={avatarImageAlt}
      initials={initials}
      onDark={false}
      size={isCenter ? "Small" : "Extra small"}
      {...(avatarImageSrc ? { imageSrc: avatarImageSrc } : {})}
    />
  );

  return (
    <div style={rootStyles}>
      <div
        style={{
          display: "flex",
          flex: "1 1 0",
          flexDirection: "column",
          gap: getThemeRem(brand, "component.testimonialCard.layout.bottomBar.gap.userInfo"),
          justifyContent: "center",
          minWidth: 0,
          whiteSpace: "nowrap"
        }}
      >
        <p style={nameStyles}>{customerName}</p>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: getThemeRem(brand, "component.testimonialCard.layout.bottomBar.gap.details"),
            minWidth: 0,
            width: "100%"
          }}
        >
          <p style={{ ...detailStyles, flexShrink: 0 }}>{detailLabel}</p>
          <p aria-hidden="true" style={{ ...detailStyles, flexShrink: 0 }}>
            •
          </p>
          <p style={{ ...detailStyles, ...ellipsisStyles, flex: isCenter ? "0 0 auto" : "1 1 0" }}>
            {dateLabel}
          </p>
        </div>
      </div>

      {avatar ?? defaultAvatar}
    </div>
  );
}

/**
 * Testimonial card with customer metadata, review text, rating, and source.
 */
export function TestimonialCard({
  avatar,
  avatarImageAlt,
  avatarImageSrc,
  brand = "Cars24",
  className,
  customerName = "Mr. Pushkar Mehta",
  dateLabel = "12 Aug, 2025",
  description = DEFAULT_DESCRIPTION,
  detailLabel = "Bought vehicle history report",
  initials = "PM",
  rating = 4.5,
  showRating = true,
  showSource = true,
  showTitle = false,
  size = "Large",
  sourceLabel = "via Product Review",
  style,
  title = "Title T1 one liner",
  ...rest
}: TestimonialCardProps) {
  const sizeKey = size === "Large" ? "large" : "small";
  const cardGapKey = showTitle && size === "Small" ? "titleSmall" : sizeKey;
  const cardHeightKey = getCardHeightKey(size, showTitle);
  const bodyColor = getThemeValue(brand, "component.testimonialCard.color.body");
  const metadataColor = getThemeValue(brand, "component.testimonialCard.color.metadata");

  const rootStyles: CSSProperties = {
    alignItems: "flex-start",
    background: getThemeValue(brand, "component.testimonialCard.color.background"),
    border: `${getThemeRem(brand, "component.testimonialCard.border.width")} solid ${getThemeValue(
      brand,
      "component.testimonialCard.color.border"
    )}`,
    borderRadius: getThemeRem(brand, getCardRadiusToken(size)),
    boxSizing: "border-box",
    display: "flex",
    flex: "0 0 auto",
    flexDirection: "column",
    gap: getThemeRem(brand, `component.testimonialCard.layout.card.gap.${cardGapKey}`),
    height: getThemeRem(brand, `component.testimonialCard.layout.card.height.${cardHeightKey}`),
    padding: getThemeRem(brand, `component.testimonialCard.layout.card.padding.${sizeKey}`),
    width: getThemeRem(brand, `component.testimonialCard.layout.card.width.${sizeKey}`),
    ...style
  };

  const reviewStackGap =
    showTitle && size === "Large"
      ? pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.1")))
      : getThemeRem(brand, `component.testimonialCard.layout.card.gap.${cardGapKey}`);

  const titleStyles: CSSProperties = {
    ...getTypographyStyles({
      brand,
      color: getThemeValue(brand, "component.testimonialCard.color.title"),
      path: "component.testimonialCard.typography.title",
      weightPath: "typography.fontWeight.semibold"
    }),
    ...ellipsisStyles,
    width: "100%"
  };

  const descriptionKey = getDescriptionTypographyKey(size, showTitle);
  const descriptionStyles: CSSProperties = {
    ...getTypographyStyles({
      brand,
      color: showTitle ? metadataColor : bodyColor,
      path: `component.testimonialCard.typography.description.${descriptionKey}`,
      weightPath:
        showTitle || size === "Large" ? "typography.fontWeight.regular" : "typography.fontWeight.medium"
    }),
    ...getLineClampStyles(getDescriptionLineClamp(size, showTitle)),
    width: "100%"
  };

  const sourceStyles: CSSProperties = {
    ...getTypographyStyles({
      brand,
      color: getThemeValue(brand, "component.testimonialCard.color.source"),
      path: `component.testimonialCard.typography.source.${sizeKey}`,
      weightPath: size === "Large" || showTitle ? "typography.fontWeight.regular" : "typography.fontWeight.medium"
    }),
    ...ellipsisStyles,
    flex: "1 1 0",
    textAlign: "right"
  };

  const showRatingRow = showRating || showSource;

  return (
    <div {...rest} className={className} style={rootStyles}>
      <TestimonialCardIdentity
        avatar={avatar}
        brand={brand}
        customerName={customerName}
        dateLabel={dateLabel}
        detailLabel={detailLabel}
        initials={initials}
        placement={size === "Large" ? "Center" : "sideways"}
        {...(avatarImageAlt ? { avatarImageAlt } : {})}
        {...(avatarImageSrc ? { avatarImageSrc } : {})}
      />

      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          gap: reviewStackGap,
          minHeight: 0,
          minWidth: 0,
          width: "100%"
        }}
      >
        {showTitle ? <p style={titleStyles}>{title}</p> : null}
        <p style={descriptionStyles}>{description}</p>

        {showRatingRow ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexShrink: 0,
              gap: getThemeRem(brand, "component.testimonialCard.layout.rating.gap"),
              justifyContent: "space-between",
              marginTop: "auto",
              minWidth: 0,
              width: "100%"
            }}
          >
            {showRating ? <Ratings brand={brand} rating={rating} size="Small" /> : null}
            {showSource ? <p style={sourceStyles}>{sourceLabel}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
