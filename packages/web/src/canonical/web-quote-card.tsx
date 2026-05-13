import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Badge } from "./badge";
import { Icon } from "./icon";
import { LinkButton } from "./link-button";

export const canonicalWebQuoteCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.webQuoteCard"
);

export const canonicalWebQuoteBottomInfoWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.webQuoteBottomInfo"
);

export type WebQuoteCardBottomInfoType = "Link Button" | "Description";

export interface WebQuoteBottomInfoProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  type?: WebQuoteCardBottomInfoType;
  actionLabel?: string;
  description?: string;
  onActionClick?: () => void;
}

export interface WebQuoteCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  kicker?: string;
  amount?: string;
  priceVisible?: boolean;
  hiddenDigitCount?: number;
  badgeLabel?: string;
  bottomInfoType?: WebQuoteCardBottomInfoType;
  bottomActionLabel?: string;
  bottomDescription?: string;
  onBottomActionClick?: () => void;
}

const TOKEN_ROOT = "component.webQuoteCard";

function tokenPath(path: string) {
  return `${TOKEN_ROOT}.${path}`;
}

function tokenNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, tokenPath(path)));
}

function tokenString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, tokenPath(path)));
}

function themeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function toPx(value: number) {
  return pxToRem(value);
}

function textStyle({
  brand,
  color,
  token,
  weight
}: {
  brand: DisplayBrandId;
  color: string;
  token: "highlight" | "amount" | "description";
  weight: "regular" | "medium" | "bold";
}) {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: toPx(tokenNumber(brand, `typography.${token}.fontSize`)),
    fontWeight: Number(getRequiredThemeTokenValue(brand, `typography.fontWeight.${weight}`)),
    letterSpacing: toPx(tokenNumber(brand, `typography.${token}.letterSpacing`)),
    lineHeight: toPx(tokenNumber(brand, `typography.${token}.lineHeight`)),
    margin: 0
  } satisfies CSSProperties;
}

function HighlightHeader({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  const dividerColor = tokenString(brand, "color.divider");
  const textColor = tokenString(brand, "color.highlight");
  const iconSize = toPx(tokenNumber(brand, "size.highlightIcon"));

  const lineStyles: CSSProperties = {
    background: dividerColor,
    flex: "1 1 0%",
    height: toPx(tokenNumber(brand, "border.dividerWidth")),
    minWidth: 0
  };

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: toPx(tokenNumber(brand, "layout.highlightGap")),
        width: "100%"
      }}
    >
      <span aria-hidden="true" style={lineStyles} />
      <Icon
        brand={brand}
        decorative
        name="sparkle-filled"
        style={{ color: textColor, fontSize: iconSize, height: iconSize, width: iconSize }}
      />
      <p
        style={{
          ...textStyle({ brand, color: textColor, token: "highlight", weight: "regular" }),
          maxWidth: toPx(tokenNumber(brand, "layout.highlightLabelMaxWidth")),
          overflow: "hidden",
          textAlign: "center",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {label}
      </p>
      <Icon
        brand={brand}
        decorative
        name="sparkle-filled"
        style={{ color: textColor, fontSize: iconSize, height: iconSize, width: iconSize }}
      />
      <span aria-hidden="true" style={lineStyles} />
    </div>
  );
}

function HiddenAmount({
  brand,
  hiddenDigitCount
}: {
  brand: DisplayBrandId;
  hiddenDigitCount: number;
}) {
  const textColor = tokenString(brand, "color.title");
  const digitSize = tokenNumber(brand, "size.hiddenDigit");
  const digitCount = Math.max(0, hiddenDigitCount);

  const amountStyles = textStyle({ brand, color: textColor, token: "amount", weight: "bold" });
  const digitStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    flex: "0 0 auto",
    fontFamily: amountStyles.fontFamily,
    fontSize: toPx(12),
    fontWeight: amountStyles.fontWeight,
    height: toPx(digitSize),
    justifyContent: "center",
    lineHeight: 1,
    width: toPx(digitSize)
  };

  return (
    <div
      aria-label="Price hidden"
      style={{
        ...amountStyles,
        alignItems: "center",
        display: "flex",
        gap: toPx(tokenNumber(brand, "layout.hiddenDigitGap")),
        justifyContent: "center",
        width: "100%"
      }}
    >
      <span aria-hidden="true">₹</span>
      {Array.from({ length: digitCount }, (_, index) => (
        <span aria-hidden="true" key={`hidden-digit-${index}`} style={digitStyles}>
          *
        </span>
      ))}
    </div>
  );
}

export function WebQuoteBottomInfo({
  brand = "Cars24",
  type = "Link Button",
  actionLabel = "Label",
  description = "Description - 12px regular",
  onActionClick,
  className,
  style,
  ...rest
}: WebQuoteBottomInfoProps) {
  const divider = tokenString(brand, "color.divider");
  const isDescription = type === "Description";
  const baseStyles: CSSProperties = {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flex: "0 0 auto",
    justifyContent: "center",
    position: "relative",
    width: "100%"
  };
  const dividerStyles: CSSProperties = {
    borderTop: `${toPx(tokenNumber(brand, "border.dividerWidth"))} dashed ${divider}`,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: 0
  };

  if (isDescription) {
    return (
      <div
        {...rest}
        className={className}
        style={{
          ...baseStyles,
          background: tokenString(brand, "color.descriptionBackground"),
          height: toPx(tokenNumber(brand, "layout.bottomDescriptionHeight")),
          padding: `${toPx(tokenNumber(brand, "layout.bottomDescriptionPaddingBlock"))} ${toPx(
            tokenNumber(brand, "layout.bottomPaddingInline")
          )}`,
          ...style
      }}
    >
        <p
          style={{
            ...textStyle({
              brand,
              color: tokenString(brand, "color.highlight"),
              token: "description",
              weight: "regular"
            }),
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%"
          }}
        >
          {description}
        </p>
      </div>
    );
  }

  return (
    <div
      {...rest}
      className={className}
      style={{
        ...baseStyles,
        background: tokenString(brand, "color.background"),
        height: toPx(tokenNumber(brand, "layout.bottomLinkHeight")),
        padding: `${toPx(tokenNumber(brand, "layout.bottomLinkPaddingBlock"))} ${toPx(
          tokenNumber(brand, "layout.bottomPaddingInline")
        )}`,
        ...style
      }}
    >
      <span aria-hidden="true" style={dividerStyles} />
      <LinkButton
        brand={brand}
        leadingIcon={<Icon brand={brand} decorative name="sparkle-filled" />}
        onClick={onActionClick}
        size="Extra Small"
        tone="Brand"
        trailingIcon={<Icon brand={brand} decorative name="arrow-right-outline" />}
        type="button"
        underline
      >
        {actionLabel}
      </LinkButton>
    </div>
  );
}

export function WebQuoteCard({
  brand = "Cars24",
  kicker = "Label - 12px regular",
  amount = "Display2 24px Bold",
  priceVisible = true,
  hiddenDigitCount = 9,
  badgeLabel = "Badge",
  bottomInfoType = "Link Button",
  bottomActionLabel = "Label",
  bottomDescription = "Description - 12px regular",
  onBottomActionClick,
  className,
  style,
  ...rest
}: WebQuoteCardProps) {
  const background = tokenString(brand, "color.background");
  const borderColor = tokenString(brand, "color.border");
  const borderWidth = toPx(tokenNumber(brand, "border.width"));
  const bottomHeight =
    bottomInfoType === "Description"
      ? tokenNumber(brand, "layout.bottomDescriptionHeight")
      : tokenNumber(brand, "layout.bottomLinkHeight");
  const titleColor = tokenString(brand, "color.title");
  const borderOverlayStyles: CSSProperties = {
    border: `${borderWidth} solid ${borderColor}`,
    borderRadius: "inherit",
    boxSizing: "border-box",
    inset: 0,
    pointerEvents: "none",
    position: "absolute",
    zIndex: 1
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        background,
        border: 0,
        borderRadius: toPx(themeNumber(brand, "radius.xl")),
        boxShadow: tokenString(brand, "shadow.container"),
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: toPx(tokenNumber(brand, "layout.topHeight") + bottomHeight),
        justifyContent: "center",
        lineHeight: 0,
        overflow: "hidden",
        position: "relative",
        width: toPx(tokenNumber(brand, "layout.width")),
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: toPx(tokenNumber(brand, "layout.contentGap")),
          padding: toPx(tokenNumber(brand, "layout.topPadding")),
          width: "100%"
        }}
      >
        <HighlightHeader brand={brand} label={kicker} />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: toPx(tokenNumber(brand, "layout.subjectGap")),
            width: "100%"
          }}
        >
          {priceVisible ? (
            <p
              style={{
                ...textStyle({ brand, color: titleColor, token: "amount", weight: "bold" }),
                minWidth: "100%",
                textAlign: "center"
              }}
            >
              {amount}
            </p>
          ) : (
            <HiddenAmount brand={brand} hiddenDigitCount={hiddenDigitCount} />
          )}

          <Badge
            brand={brand}
            labelText={badgeLabel}
            pillShape="No"
            priority="Low"
            showLeadingIcon={false}
            showTrailingIcon={false}
            size="Extra Small"
            style={{
              backgroundColor: tokenString(brand, "color.badgeBackground"),
              borderColor: "transparent",
              color: tokenString(brand, "color.badgeText")
            }}
            type="Neutral"
          />
        </div>
      </div>

      <WebQuoteBottomInfo
        actionLabel={bottomActionLabel}
        brand={brand}
        description={bottomDescription}
        type={bottomInfoType}
        {...(onBottomActionClick ? { onActionClick: onBottomActionClick } : {})}
      />
      <span aria-hidden="true" style={borderOverlayStyles} />
    </div>
  );
}
