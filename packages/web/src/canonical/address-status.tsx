import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";

export const canonicalAddressStatusWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.addressStatus"
);

export type AddressStatusType = "ANS" | "Default";

export interface AddressStatusProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  icon?: ReactNode;
  message?: ReactNode;
  showIcon?: boolean;
  type?: AddressStatusType;
}

const ADDRESS_STATUS_WIDTH = 360;
const ADDRESS_STATUS_ICON_SIZE = 12;

const FIGMA_BG_BRAND_SUBTLER = "var(--cars24-semantic-bg-brand-subtler, #F6F6FF)";
const FIGMA_BG_DANGER_SUBTLER = "var(--cars24-semantic-bg-danger-subtler, #FEF2F2)";
const FIGMA_GAP_4 = "var(--cars24-misc-gap-4, 4px)";
const FIGMA_SIZE_8 = "var(--cars24-misc-size-8, 8px)";
const FIGMA_SIZE_12 = "var(--cars24-misc-size-12, 12px)";
const FIGMA_TEXT_DANGER = "var(--cars24-semantic-text-danger-base, #DC2626)";
const FIGMA_TEXT_PRIMARY = "var(--cars24-semantic-text-primary, #020617)";
const FIGMA_LABEL_3_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const FIGMA_LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const FIGMA_LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";

const addressStatusDefaults: Record<AddressStatusType, ReactNode> = {
  ANS: "Sorry, we don't currently serve this location.",
  Default: "Your car inspection will be done here."
};

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function toRem(value: number) {
  return pxToRem(value);
}

function renderStatusIcon({
  brand,
  color,
  icon,
  showIcon,
  type
}: {
  brand: DisplayBrandId;
  color: string;
  icon: ReactNode;
  showIcon: boolean;
  type: AddressStatusType;
}) {
  if (type !== "ANS" || !showIcon) {
    return null;
  }

  if (icon !== undefined) {
    return icon;
  }

  return (
    <Icon
      brand={brand}
      decorative
      name="error-filled"
      style={{
        color,
        flex: "0 0 auto",
        fontSize: toRem(ADDRESS_STATUS_ICON_SIZE),
        height: toRem(ADDRESS_STATUS_ICON_SIZE),
        width: toRem(ADDRESS_STATUS_ICON_SIZE)
      }}
    />
  );
}

/**
 * Compact status strip for Locator address availability states.
 */
export function AddressStatus({
  brand = "Cars24",
  className,
  icon,
  message,
  showIcon = true,
  style,
  type = "Default",
  ...rest
}: AddressStatusProps) {
  const isAns = type === "ANS";
  const textColor = isAns ? FIGMA_TEXT_DANGER : FIGMA_TEXT_PRIMARY;
  const fontFamily = themeString(brand, "typography.fontFamily.sans");
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: isAns ? FIGMA_BG_DANGER_SUBTLER : FIGMA_BG_BRAND_SUBTLER,
    boxSizing: "border-box",
    display: "flex",
    gap: FIGMA_GAP_4,
    maxWidth: "100%",
    padding: `${FIGMA_SIZE_8} ${FIGMA_SIZE_12}`,
    width: toRem(ADDRESS_STATUS_WIDTH),
    ...style
  };

  const labelStyles: CSSProperties = {
    color: textColor,
    flex: "1 1 0",
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: FIGMA_LABEL_3_SIZE,
    fontWeight,
    letterSpacing: FIGMA_LABEL_3_LETTER_SPACING,
    lineHeight: FIGMA_LABEL_3_LINE_HEIGHT,
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  return (
    <div {...rest} className={className} data-brand={brand} data-type={type} style={rootStyles}>
      {renderStatusIcon({ brand, color: textColor, icon, showIcon, type })}
      <p style={labelStyles}>{message ?? addressStatusDefaults[type]}</p>
    </div>
  );
}
