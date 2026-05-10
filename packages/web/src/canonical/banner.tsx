import { type CSSProperties, useState } from "react";
import type { BrandId, DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue, pxToRem, tokenValueToRem } from "../theme";

export const canonicalBannerWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.banner"
);

export type BannerTheme = "Light" | "Dark";
export type BannerState = "Warning" | "Success" | "Error" | "Info" | "Brand";
export type BannerActionType = "Text button" | "Icon button";

export interface BannerProps {
  brand?: DisplayBrandId;
  theme?: BannerTheme;
  state?: BannerState;
  heading?: boolean;
  icon?: boolean;
  action?: boolean;
  actionType?: BannerActionType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  onDismiss?: () => void;
  className?: string;
  style?: CSSProperties;
}

type BannerTone = {
  background: string;
  border: string;
  iconColor: string;
  titleColor: string;
  descriptionColor: string;
  actionBackground: string;
  actionText: string;
  actionIcon: string;
};

const BANNER_SHADOW_FALLBACK =
  "0px 8px 28px -4px rgba(31, 41, 55, 0.06), 0px 18px 84px -2px rgba(31, 41, 55, 0.08)";

function getBannerToken(slot: string) {
  return canonicalBannerWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveBannerBindingValue(
  brand: BrandId,
  slot: string,
  fallback: string
) {
  const token = getBannerToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("icon.") ||
    token.startsWith("typography.")
  ) {
    return token.startsWith("color.")
      ? String(getRequiredThemeTokenValue(brand, token))
      : tokenValueToRem(getRequiredThemeTokenValue(brand, token));
  }

  if (token === "drop-shadow/xl") {
    return BANNER_SHADOW_FALLBACK;
  }

  return withTokenFallback(token, fallback);
}

function getBannerTone(brand: BrandId, theme: BannerTheme, state: BannerState): BannerTone {
  const brand50 = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const brand100 = String(getRequiredThemeTokenValue(brand, "color.brand.primary.100"));
  const brand600 = String(getRequiredThemeTokenValue(brand, "color.brand.primary.600"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const textInverse = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const canvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const inverseSurface = String(getRequiredThemeTokenValue(brand, "color.surface.inverse"));
  const warning = String(getRequiredThemeTokenValue(brand, "color.status.warning"));
  const success = String(getRequiredThemeTokenValue(brand, "color.status.success"));
  const danger = String(getRequiredThemeTokenValue(brand, "color.status.danger"));
  const info = String(getRequiredThemeTokenValue(brand, "color.status.info"));

  if (theme === "Dark") {
    const background =
      state === "Warning" ? warning : state === "Success" ? success : state === "Error" ? danger : state === "Info" ? info : brand600;

    return {
      background,
      border: "transparent",
      iconColor: textInverse,
      titleColor: textInverse,
      descriptionColor: textInverse,
      actionBackground: canvas,
      actionText: textPrimary,
      actionIcon: textInverse
    };
  }

  if (state === "Brand") {
    return {
      background: brand50,
      border: brand100,
      iconColor: brand600,
      titleColor: textPrimary,
      descriptionColor: textSecondary,
      actionBackground: inverseSurface,
      actionText: textInverse,
      actionIcon: textSecondary
    };
  }

  const lightTones: Record<Exclude<BannerState, "Brand">, Omit<BannerTone, "actionBackground" | "actionText" | "actionIcon">> = {
    Warning: {
      background: "#FFFBEB",
      border: "#FEF3C6",
      iconColor: warning,
      titleColor: textPrimary,
      descriptionColor: textSecondary
    },
    Success: {
      background: "#F4FCF4",
      border: "#E4F9E0",
      iconColor: success,
      titleColor: textPrimary,
      descriptionColor: textSecondary
    },
    Error: {
      background: "#FEF2F2",
      border: "#FEE2E2",
      iconColor: danger,
      titleColor: textPrimary,
      descriptionColor: textSecondary
    },
    Info: {
      background: "#F0F7FF",
      border: "#DBEBFE",
      iconColor: info,
      titleColor: textPrimary,
      descriptionColor: textSecondary
    }
  };

  return {
    ...lightTones[state],
    actionBackground: inverseSurface,
    actionText: textInverse,
    actionIcon: textSecondary
  };
}

function getBannerLeadingIconName(state: BannerState) {
  if (state === "Success") {
    return "circle-check-filled";
  }

  if (state === "Info" || state === "Brand") {
    return "info-filled";
  }

  return "error-filled";
}

export function Banner({
  brand = "Cars24",
  theme = "Light",
  state = "Warning",
  heading = true,
  icon = true,
  action = true,
  actionType = "Text button",
  title = "New Message Alert",
  description = "New message received!",
  actionLabel = "Label",
  onActionClick,
  onDismiss,
  className,
  style
}: BannerProps) {
  const tone = getBannerTone(brand, theme, state);
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const regular = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const isDark = theme === "Dark";
  const rootWidth = resolveBannerBindingValue(brand, "container.width", "328px");
  const rootGap = resolveBannerBindingValue(brand, "container.gap", "0px");
  const rootRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.alt.lg")));
  const rootShadow = resolveBannerBindingValue(brand, "container.shadow", BANNER_SHADOW_FALLBACK);
  const contentGap = icon
    ? resolveBannerBindingValue(brand, "content.gap", "8px")
    : resolveBannerBindingValue(brand, "container.gap", "0px");
  const contentPaddingInline = resolveBannerBindingValue(brand, "content.paddingInline", "12px");
  const contentPaddingBlock = resolveBannerBindingValue(brand, "content.paddingBlock", "16px");
  const leadingIconSize = resolveBannerBindingValue(brand, "icon.leading.size", "20px");
  const actionIconSize = resolveBannerBindingValue(brand, "icon.action.size", "24px");
  const actionTextRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.pill")));
  const actionTextPaddingInline = resolveBannerBindingValue(brand, "action.text.paddingInline", "12px");
  const actionTextPaddingBlock = resolveBannerBindingValue(brand, "action.text.paddingBlock", "6px");

  const rootStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: rootGap,
    width: rootWidth,
    overflow: "clip",
    boxSizing: "border-box",
    borderRadius: rootRadius,
    border: isDark ? "1px solid transparent" : `1px solid ${tone.border}`,
    background: tone.background,
    boxShadow: rootShadow,
    ...style
  };

  const contentStyles: CSSProperties = {
    display: "flex",
    flex: "1 0 0",
    minWidth: 0,
    alignItems: "flex-start",
    gap: contentGap,
    padding: `${contentPaddingBlock} ${contentPaddingInline}`
  };

  const textWrapStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 0",
    minWidth: 0,
    gap: heading ? pxToRem(2) : 0
  };

  const actionAreaStyles: CSSProperties = {
    display: "flex",
    flexDirection: actionType === "Text button" ? "column" : "row",
    justifyContent: "center",
    alignItems: actionType === "Text button" ? "flex-end" : "center",
    paddingRight: pxToRem(12),
    paddingLeft: pxToRem(0),
    paddingTop:
      actionType === "Icon button"
        ? heading
          ? pxToRem(20)
          : pxToRem(14)
        : heading
          ? pxToRem(16)
          : pxToRem(10),
    paddingBottom:
      actionType === "Icon button"
        ? heading
          ? pxToRem(20)
          : pxToRem(14)
        : heading
          ? pxToRem(16)
          : pxToRem(10),
    width: actionType === "Text button" ? pxToRem(68) : undefined,
    flexShrink: 0
  };

  const actionButtonStyles: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: pxToRem(4),
    height: pxToRem(28),
    maxHeight: pxToRem(28),
    border: 0,
    borderRadius: actionTextRadius,
    padding: `${actionTextPaddingBlock} ${actionTextPaddingInline}`,
    background: tone.actionBackground,
    color: tone.actionText,
    cursor: "pointer",
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: pxToRem(12),
    lineHeight: pxToRem(16),
    fontWeight: medium,
    boxShadow: "none"
  };

  const iconButtonStyles: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    padding: 0,
    background: "transparent",
    color: tone.actionIcon,
    cursor: "pointer",
    borderRadius: pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.alt.md"))),
    boxShadow: "none"
  };

  return (
    <div className={className} style={rootStyles}>
      <div style={contentStyles}>
        {icon ? (
          <Icon
            brand={brand}
            name={getBannerLeadingIconName(state)}
            decorative
            style={{
              flexShrink: 0,
              width: leadingIconSize,
              height: leadingIconSize,
              fontSize: leadingIconSize,
              color: tone.iconColor
            }}
          />
        ) : null}
        <div style={textWrapStyles}>
          {heading ? (
            <>
              <div
                style={{
                  margin: 0,
                  color: tone.titleColor,
                  fontFamily: `${fontFamily}, sans-serif`,
                  fontSize: pxToRem(16),
                  lineHeight: pxToRem(20),
                  fontWeight: medium
                }}
              >
                {title}
              </div>
              <div
                style={{
                  margin: 0,
                  color: tone.descriptionColor,
                  fontFamily: `${fontFamily}, sans-serif`,
                  fontSize: pxToRem(12),
                  lineHeight: pxToRem(18),
                  fontWeight: regular
                }}
              >
                {description}
              </div>
            </>
          ) : (
            <div
              style={{
                margin: 0,
                color: tone.titleColor,
                fontFamily: `${fontFamily}, sans-serif`,
                fontSize: pxToRem(14),
                lineHeight: pxToRem(20),
                fontWeight: regular
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>

      {action ? (
        <div style={actionAreaStyles}>
          {actionType === "Text button" ? (
            <button
              type="button"
              onClick={onActionClick}
              style={actionButtonStyles}
            >
              {actionLabel}
            </button>
          ) : (
            <button
              type="button"
              aria-label="Dismiss banner"
              onClick={onDismiss ?? onActionClick}
              style={iconButtonStyles}
            >
              <Icon
                brand={brand}
                name="cross-small-filled"
                decorative
                style={{
                  width: actionIconSize,
                  height: actionIconSize,
                  fontSize: actionIconSize,
                  color: tone.actionIcon
                }}
              />
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
