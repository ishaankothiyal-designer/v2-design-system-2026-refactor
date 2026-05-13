import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Avatar } from "./avatar";
import { Icon } from "./icon";

export const canonicalSoldCarCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.soldCarCard"
);

export interface SoldCarCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  price?: string;
  carModel?: string;
  buyerName?: string;
  location?: string;
  soldAgoLabel?: string;
  initials?: string;
  media?: ReactNode;
  avatar?: ReactNode;
}

const CARD_WIDTH = 264;
const MEDIA_SLOT_WIDTH = 77;
const MEDIA_SLOT_HEIGHT = 52;
const SOLD_STAMP_WIDTH = 42;
const SOLD_STAMP_HEIGHT = 15;
const SOLD_STAMP_OFFSET = -5;
const SOLD_STAMP_CENTER_OFFSET = -0.5;

const ellipsisStyles: CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

const soldStampSrc = new URL("./assets/sold-car-card/sold-stamp.png", import.meta.url).href;

function getThemeValue(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function getThemeRem(brand: DisplayBrandId, path: string) {
  return pxToRem(Number(getRequiredThemeTokenValue(brand, path)));
}

function getSoldCarCardTokens(brand: DisplayBrandId) {
  const fontFamily = `${getThemeValue(brand, "typography.fontFamily.sans")}, sans-serif`;
  const regularWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const semiboldWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));

  return {
    border: getThemeValue(brand, "color.border.default"),
    brandSubtle: getThemeValue(brand, "color.brand.primary.50"),
    brandPrimary: getThemeValue(brand, "color.brand.primary.500"),
    cardRadius: getThemeRem(brand, "radius.md"),
    cardShadow: getThemeValue(brand, "component.switch.thumb.shadow"),
    gap1: getThemeRem(brand, "spacing.1"),
    gap2: getThemeRem(brand, "spacing.2"),
    gap3: getThemeRem(brand, "spacing.3"),
    gap4: getThemeRem(brand, "spacing.4"),
    slotRadius: getThemeRem(brand, "radius.sm"),
    surface: getThemeValue(brand, "color.surface.canvas"),
    typography: {
      buyer: {
        color: getThemeValue(brand, "color.text.primary"),
        fontFamily,
        fontSize: pxToRem(12),
        fontWeight: regularWeight,
        letterSpacing: 0,
        lineHeight: pxToRem(16),
        margin: 0
      } satisfies CSSProperties,
      metadata: {
        color: getThemeValue(brand, "color.text.secondary"),
        fontFamily,
        fontSize: pxToRem(11),
        fontWeight: regularWeight,
        letterSpacing: 0,
        lineHeight: pxToRem(14),
        margin: 0
      } satisfies CSSProperties,
      model: {
        color: getThemeValue(brand, "color.text.primary"),
        fontFamily,
        fontSize: pxToRem(13),
        fontWeight: semiboldWeight,
        letterSpacing: 0,
        lineHeight: pxToRem(18),
        margin: 0
      } satisfies CSSProperties,
      price: {
        color: getThemeValue(brand, "color.status.success"),
        fontFamily,
        fontSize: pxToRem(19),
        fontWeight: semiboldWeight,
        letterSpacing: "-0.03px",
        lineHeight: pxToRem(24),
        margin: 0
      } satisfies CSSProperties
    }
  };
}

function DefaultSoldCarMedia({
  background,
  brand,
  iconColor
}: {
  background: CSSProperties["background"];
  brand: DisplayBrandId;
  iconColor: CSSProperties["color"];
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "center",
        background,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Icon
        brand={brand}
        decorative
        name="square-plus-add-outline"
        style={{
          color: iconColor,
          fontSize: pxToRem(32)
        }}
      />
    </div>
  );
}

function SoldStamp() {
  return (
    <span
      aria-label="Sold"
      role="img"
      style={{
        bottom: pxToRem(SOLD_STAMP_OFFSET),
        display: "block",
        height: pxToRem(SOLD_STAMP_HEIGHT),
        left: `calc(50% + ${pxToRem(SOLD_STAMP_CENTER_OFFSET)})`,
        lineHeight: 0,
        overflow: "hidden",
        position: "absolute",
        transform: "translateX(-50%)",
        width: pxToRem(SOLD_STAMP_WIDTH)
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        src={soldStampSrc}
        style={{
          display: "block",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          width: "100%"
        }}
      />
    </span>
  );
}

/**
 * Sold-car summary card matching the DLS sold-car carousel card anatomy.
 */
export function SoldCarCard({
  brand = "Cars24",
  price = "₹4.54L",
  carModel = "Car model H5 - 13 SM",
  buyerName = "Customer_name label3 - 12px 1 line",
  location = "Location",
  soldAgoLabel = "7d ago",
  initials = "MT",
  media,
  avatar,
  className,
  style,
  ...rest
}: SoldCarCardProps) {
  const tokens = getSoldCarCardTokens(brand);

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.cardRadius,
    boxShadow: tokens.cardShadow,
    boxSizing: "border-box",
    display: "flex",
    flex: "0 0 auto",
    flexDirection: "column",
    overflow: "hidden",
    width: pxToRem(CARD_WIDTH),
    ...style
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: tokens.gap2,
          padding: `${tokens.gap4} ${tokens.gap3}`,
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1 1 0",
            flexDirection: "column",
            minWidth: 0
          }}
        >
          <p style={tokens.typography.price}>{price}</p>
          <p style={{ ...tokens.typography.model, ...ellipsisStyles }}>{carModel}</p>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: `0 0 ${pxToRem(MEDIA_SLOT_WIDTH)}`,
            height: pxToRem(MEDIA_SLOT_HEIGHT),
            justifyContent: "flex-end",
            position: "relative",
            width: pxToRem(MEDIA_SLOT_WIDTH)
          }}
        >
          <div
            style={{
              alignItems: "center",
              borderRadius: tokens.slotRadius,
              bottom: 0,
              display: "flex",
              height: pxToRem(MEDIA_SLOT_HEIGHT),
              justifyContent: "center",
              left: 0,
              overflow: "hidden",
              position: "absolute",
              width: pxToRem(MEDIA_SLOT_WIDTH)
            }}
          >
            {media ?? (
              <DefaultSoldCarMedia background={tokens.brandSubtle} brand={brand} iconColor={tokens.brandPrimary} />
            )}
          </div>
          <SoldStamp />
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          background: tokens.surface,
          borderTop: `0.5px solid ${tokens.border}`,
          boxSizing: "border-box",
          display: "flex",
          gap: tokens.gap2,
          padding: `${tokens.gap2} ${tokens.gap3}`,
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1 1 0",
            flexDirection: "column",
            gap: pxToRem(2),
            minWidth: 0,
            whiteSpace: "nowrap"
          }}
        >
          <p style={{ ...tokens.typography.buyer, ...ellipsisStyles }}>{buyerName}</p>
          <div
            style={{
              alignItems: "flex-start",
              display: "flex",
              gap: tokens.gap1,
              minWidth: 0,
              width: "100%"
            }}
          >
            <p style={{ ...tokens.typography.metadata, ...ellipsisStyles }}>{location}</p>
            <p style={tokens.typography.metadata}>|</p>
            <p style={{ ...tokens.typography.metadata, ...ellipsisStyles }}>{soldAgoLabel}</p>
          </div>
        </div>

        {avatar ?? (
          <Avatar
            adornment="Status dot"
            appearance="Initials"
            brand={brand}
            initials={initials}
            onDark={false}
            size="Extra small"
          />
        )}
      </div>
    </div>
  );
}
