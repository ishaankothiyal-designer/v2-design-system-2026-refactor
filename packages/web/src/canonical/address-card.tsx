import {
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  isValidElement
} from "react";
import type { IconName } from "@turbo/icons";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Icon } from "./icon";

export const canonicalAddressCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.addressCard"
);

export type AddressCardType = "Address + chevron (Card)" | "Address + chevron (Full bleed)";

export interface AddressCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  description?: string;
  distanceLabel?: string;
  header?: string;
  icon?: ReactNode;
  iconName?: IconName;
  showChevron?: boolean;
  showDistance?: boolean;
  trailingIcon?: ReactNode;
  type?: AddressCardType;
}

function getAddressCardToken(slot: string) {
  return canonicalAddressCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveAddressCardBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getAddressCardToken(slot);

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

function resolveAddressCardBindingRem(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  return tokenValueToRem(resolveAddressCardBindingValue(brand, slot, fallback));
}

function renderDecorativeSlot(content: ReactNode, color: string, size: string) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return (
      <span aria-hidden="true" style={{ color, fontSize: size, lineHeight: 1 }}>
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

export function AddressCard({
  brand = "Cars24",
  className,
  description = "Full address here",
  distanceLabel = "4.4 km",
  header = "Address header",
  icon,
  iconName = "location-outline",
  showChevron = true,
  showDistance = true,
  style,
  trailingIcon,
  type = "Address + chevron (Card)",
  ...rest
}: AddressCardProps) {
  const isFullBleed = type === "Address + chevron (Full bleed)";
  const surfaceColor = resolveAddressCardBindingValue(brand, "container.surface", "#FFFFFF");
  const cardBorderColor = resolveAddressCardBindingValue(brand, "container.border.card", "#CBD5E1");
  const fullBleedBorderColor = resolveAddressCardBindingValue(brand, "container.border.fullBleed", "#E2E8F0");
  const containerGap = resolveAddressCardBindingRem(brand, "layout.container.gap", "8px");
  const contentGap = resolveAddressCardBindingRem(brand, "layout.content.gap", "4px");
  const textGap = resolveAddressCardBindingRem(brand, "layout.text.gap", "2px");
  const cardPadding = resolveAddressCardBindingRem(brand, "layout.padding.card", "12px");
  const fullBleedInlinePadding = resolveAddressCardBindingRem(
    brand,
    "layout.padding.fullBleed.inline",
    "12px"
  );
  const chevronInlinePadding = resolveAddressCardBindingRem(
    brand,
    "layout.chevron.paddingInline",
    "8px"
  );
  const distanceColor = resolveAddressCardBindingValue(
    brand,
    "content.distance.color",
    "#4736FE"
  );
  const titleColor = resolveAddressCardBindingValue(brand, "content.title.color", "#020617");
  const descriptionColor = resolveAddressCardBindingValue(
    brand,
    "content.description.color",
    "#64748B"
  );
  const leadingIconColor = resolveAddressCardBindingValue(
    brand,
    "icon.leading.color",
    "#404040"
  );
  const trailingIconColor = resolveAddressCardBindingValue(
    brand,
    "icon.trailing.color",
    "#262626"
  );
  const leadingIconSize = resolveAddressCardBindingRem(brand, "icon.leading.size", "18px");
  const trailingIconSize = resolveAddressCardBindingRem(brand, "icon.trailing.size", "24px");
  const indicatorWidth = resolveAddressCardBindingRem(brand, "size.indicator.width", "40px");
  const cardWidth = resolveAddressCardBindingRem(brand, "size.card.width", "336px");
  const fullBleedWidth = resolveAddressCardBindingRem(brand, "size.fullBleed.width", "360px");
  const minHeight = resolveAddressCardBindingRem(brand, "size.height", "60px");
  const borderRadius = resolveAddressCardBindingRem(brand, "container.radius.card", "8px");
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const regularWeight = Number(resolveAddressCardBindingValue(brand, "typography.regular.weight", "400"));
  const semiboldWeight = Number(resolveAddressCardBindingValue(brand, "typography.semibold.weight", "600"));

  const titleStyles: CSSProperties = {
    color: titleColor,
    fontFamily,
    fontSize: resolveAddressCardBindingRem(brand, "content.title.fontSize", "14px"),
    fontWeight: semiboldWeight,
    letterSpacing: resolveAddressCardBindingRem(brand, "content.title.letterSpacing", "0px"),
    lineHeight: resolveAddressCardBindingRem(brand, "content.title.lineHeight", "18px"),
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  };

  const descriptionStyles: CSSProperties = {
    color: descriptionColor,
    fontFamily,
    fontSize: resolveAddressCardBindingRem(brand, "content.description.fontSize", "12px"),
    fontWeight: regularWeight,
    letterSpacing: resolveAddressCardBindingRem(brand, "content.description.letterSpacing", "0px"),
    lineHeight: resolveAddressCardBindingRem(brand, "content.description.lineHeight", "16px"),
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  };

  const distanceStyles: CSSProperties = {
    color: distanceColor,
    fontFamily,
    fontSize: resolveAddressCardBindingRem(brand, "content.distance.fontSize", "9px"),
    fontWeight: regularWeight,
    letterSpacing: resolveAddressCardBindingRem(brand, "content.distance.letterSpacing", "0px"),
    lineHeight: resolveAddressCardBindingRem(brand, "content.distance.lineHeight", "13px"),
    margin: 0,
    overflow: "hidden",
    textAlign: "center",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: indicatorWidth
  };

  const leftContent = (
    <div
      style={{
        alignItems: "flex-start",
        display: "flex",
        flex: "1 1 auto",
        gap: contentGap,
        minWidth: 0
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: "0 0 auto",
          flexDirection: "column",
          gap: contentGap,
          width: indicatorWidth
        }}
      >
        {icon ? (
          renderDecorativeSlot(icon, leadingIconColor, leadingIconSize)
        ) : (
          <Icon
            brand={brand}
            decorative
            name={iconName}
            style={{ color: leadingIconColor, fontSize: leadingIconSize }}
          />
        )}
        {showDistance ? <p style={distanceStyles}>{distanceLabel}</p> : null}
      </div>

      <div
        style={{
          alignItems: "flex-start",
          alignSelf: "stretch",
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          gap: textGap,
          justifyContent: "center",
          minWidth: 0
        }}
      >
        <p style={titleStyles}>{header}</p>
        <p style={descriptionStyles}>{description}</p>
      </div>
    </div>
  );

  const chevron = showChevron ? (
    isFullBleed ? (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: "0 0 auto",
          justifyContent: "center",
          minHeight: trailingIconSize,
          minWidth: `calc(${trailingIconSize} + (${chevronInlinePadding} * 2))`,
          paddingInline: chevronInlinePadding
        }}
      >
        {trailingIcon ? (
          renderDecorativeSlot(trailingIcon, trailingIconColor, trailingIconSize)
        ) : (
          <Icon
            brand={brand}
            decorative
            name="chevron-right-outline"
            style={{ color: trailingIconColor, fontSize: trailingIconSize }}
          />
        )}
      </div>
    ) : trailingIcon ? (
      renderDecorativeSlot(trailingIcon, trailingIconColor, trailingIconSize)
    ) : (
      <Icon
        brand={brand}
        decorative
        name="chevron-right-outline"
        style={{ color: trailingIconColor, fontSize: trailingIconSize }}
      />
    )
  ) : null;

  if (isFullBleed) {
    return (
      <div
        {...rest}
        className={className}
        style={{
          alignItems: "center",
          background: surfaceColor,
          boxSizing: "border-box",
          display: "flex",
          gap: containerGap,
          maxWidth: "100%",
          minHeight,
          paddingInline: fullBleedInlinePadding,
          width: fullBleedWidth,
          ...style
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: `1px solid ${fullBleedBorderColor}`,
            boxSizing: "border-box",
            display: "flex",
            flex: "1 1 auto",
            gap: containerGap,
            justifyContent: "space-between",
            minHeight,
            minWidth: 0,
            paddingBlock: cardPadding,
            width: "100%"
          }}
        >
          {leftContent}
          {chevron}
        </div>
      </div>
    );
  }

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        background: surfaceColor,
        border: `1px solid ${cardBorderColor}`,
        borderRadius,
        boxSizing: "border-box",
        display: "flex",
        gap: containerGap,
        maxWidth: "100%",
        minHeight,
        padding: cardPadding,
        width: cardWidth,
        ...style
      }}
    >
      {leftContent}
      {chevron}
    </div>
  );
}
