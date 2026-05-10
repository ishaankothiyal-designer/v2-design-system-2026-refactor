import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";

export const canonicalNotificationBadgeWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.notificationBadge"
);

export type NotificationBadgeSize = "Small" | "Medium" | "Large";

type NotificationBadgeSizeConfig = {
  diameter: string;
  cutOutBorderWidth: string;
};

const NOTIFICATION_BADGE_BACKGROUND = "var(--cars24-semantic-bg-danger-base, #DC2626)";
const NOTIFICATION_BADGE_CUT_OUT_BORDER = "var(--cars24-semantic-border-white, #FFFFFF)";

const NOTIFICATION_BADGE_SIZE_CONFIG: Record<NotificationBadgeSize, NotificationBadgeSizeConfig> = {
  Small: {
    diameter: "var(--cars24-misc-size-4, 4px)",
    cutOutBorderWidth: "var(--cars24-misc-stroke-regular, 1px)"
  },
  Medium: {
    diameter: "var(--cars24-misc-size-6, 6px)",
    cutOutBorderWidth: "var(--cars24-misc-stroke-regular, 1px)"
  },
  Large: {
    diameter: "var(--cars24-misc-size-8, 8px)",
    cutOutBorderWidth: "var(--cars24-misc-stroke-medium, 1.5px)"
  }
};

export interface NotificationBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  brand?: DisplayBrandId;
  size?: NotificationBadgeSize;
  cutOut?: boolean;
}

/**
 * Compact notification indicator dot that mirrors the Figma size and cut-out variants.
 */
export function NotificationBadge({
  brand = "Cars24",
  size = "Small",
  cutOut = false,
  style,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...rest
}: NotificationBadgeProps) {
  const sizeConfig = NOTIFICATION_BADGE_SIZE_CONFIG[size];
  const radius = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.pill")));
  const resolvedAriaHidden = ariaHidden ?? (ariaLabel || ariaLabelledby ? undefined : true);

  const rootStyles: CSSProperties = {
    background: NOTIFICATION_BADGE_BACKGROUND,
    border: cutOut ? `${sizeConfig.cutOutBorderWidth} solid ${NOTIFICATION_BADGE_CUT_OUT_BORDER}` : undefined,
    borderRadius: radius,
    boxSizing: "border-box",
    display: "inline-block",
    flexShrink: 0,
    height: sizeConfig.diameter,
    verticalAlign: "middle",
    width: sizeConfig.diameter,
    ...style
  };

  return <span {...rest} aria-hidden={resolvedAriaHidden} style={rootStyles} />;
}
