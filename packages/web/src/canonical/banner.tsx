import { type CSSProperties, useState } from "react";
import type { BrandId, DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

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

const BANNER_TONE_FALLBACKS: Record<Lowercase<BannerTheme>, Record<Lowercase<BannerState>, Omit<BannerTone, "actionBackground" | "actionText" | "actionIcon">>> = {
  light: {
    warning: {
      background: "var(--cars24-semantic-bg-warning-subtler, #fffbeb)",
      border: "var(--cars24-semantic-border-warning-subtle, #fef3c6)",
      iconColor: "var(--cars24-semantic-icon-warning-base, #e17100)",
      titleColor: "var(--cars24-semantic-text-primary, #020617)",
      descriptionColor: "var(--cars24-semantic-text-secondary, #64748b)"
    },
    success: {
      background: "var(--cars24-semantic-bg-success-subtler, #f4fcf4)",
      border: "var(--cars24-semantic-border-success-subtle, #e4f9e0)",
      iconColor: "var(--cars24-semantic-icon-success-base, #1c9c1c)",
      titleColor: "var(--cars24-semantic-text-primary, #020617)",
      descriptionColor: "var(--cars24-semantic-text-secondary, #64748b)"
    },
    error: {
      background: "var(--cars24-semantic-bg-danger-subtler, #fef2f2)",
      border: "var(--cars24-semantic-border-danger-subtle, #fee2e2)",
      iconColor: "var(--cars24-semantic-icon-danger-base, #dc2626)",
      titleColor: "var(--cars24-semantic-text-primary, #020617)",
      descriptionColor: "var(--cars24-semantic-text-secondary, #64748b)"
    },
    info: {
      background: "var(--cars24-semantic-bg-info-subtler, #f0f7ff)",
      border: "var(--cars24-semantic-border-info-subtle, #dbebfe)",
      iconColor: "var(--cars24-semantic-icon-info-base, #296fe3)",
      titleColor: "var(--cars24-semantic-text-primary, #020617)",
      descriptionColor: "var(--cars24-semantic-text-secondary, #64748b)"
    },
    brand: {
      background: "var(--cars24-semantic-bg-brand-subtler, #f6f6ff)",
      border: "var(--cars24-semantic-border-brand-subtle, #c8ccfb)",
      iconColor: "var(--cars24-semantic-icon-brand-base, #4736fe)",
      titleColor: "var(--cars24-semantic-text-primary, #020617)",
      descriptionColor: "var(--cars24-semantic-text-secondary, #64748b)"
    }
  },
  dark: {
    warning: {
      background: "var(--cars24-semantic-bg-warning-base, #e17100)",
      border: "transparent",
      iconColor: "var(--cars24-semantic-icon-primary-inverse, #ffffff)",
      titleColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)",
      descriptionColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)"
    },
    success: {
      background: "var(--cars24-semantic-bg-success-base, #1c9c1c)",
      border: "transparent",
      iconColor: "var(--cars24-semantic-icon-primary-inverse, #ffffff)",
      titleColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)",
      descriptionColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)"
    },
    error: {
      background: "var(--cars24-semantic-bg-danger-base, #dc2626)",
      border: "transparent",
      iconColor: "var(--cars24-semantic-icon-primary-inverse, #ffffff)",
      titleColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)",
      descriptionColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)"
    },
    info: {
      background: "var(--cars24-semantic-bg-info-base, #296fe3)",
      border: "transparent",
      iconColor: "var(--cars24-semantic-icon-primary-inverse, #ffffff)",
      titleColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)",
      descriptionColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)"
    },
    brand: {
      background: "var(--cars24-semantic-bg-brand-base, #4736fe)",
      border: "transparent",
      iconColor: "var(--cars24-semantic-icon-primary-inverse, #ffffff)",
      titleColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)",
      descriptionColor: "var(--cars24-semantic-text-primary-inverse, #ffffff)"
    }
  }
};

const BANNER_ACTION_FALLBACKS: Record<Lowercase<BannerTheme>, { background: string; text: string; icon: string }> = {
  light: {
    background: "var(--cars24-semantic-bg-primary-inverse, #0a0a0a)",
    text: "var(--cars24-semantic-text-primary-inverse, #ffffff)",
    icon: "var(--cars24-semantic-icon-secondary, #64748b)"
  },
  dark: {
    background: "var(--cars24-semantic-bg-primary, #ffffff)",
    text: "var(--cars24-semantic-text-primary, #020617)",
    icon: "var(--cars24-semantic-icon-primary-inverse, #ffffff)"
  }
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
    return String(getRequiredThemeTokenValue(brand, token));
  }

  if (token === "drop-shadow/xl") {
    return BANNER_SHADOW_FALLBACK;
  }

  return withTokenFallback(token, fallback);
}

function getBannerTone(theme: BannerTheme, state: BannerState): BannerTone {
  const normalizedTheme = theme.toLowerCase() as Lowercase<BannerTheme>;
  const normalizedState = state.toLowerCase() as Lowercase<BannerState>;
  const slotPrefix = `tone.${normalizedTheme}.${normalizedState}`;
  const actionSlotPrefix = `action.${normalizedTheme}.${normalizedState}`;
  const toneFallback = BANNER_TONE_FALLBACKS[normalizedTheme][normalizedState];
  const actionFallback = BANNER_ACTION_FALLBACKS[normalizedTheme];

  return {
    background: withTokenFallback(
      getBannerToken(`${slotPrefix}.background`),
      toneFallback.background
    ),
    border: withTokenFallback(
      getBannerToken(`${slotPrefix}.border`),
      toneFallback.border
    ),
    iconColor: withTokenFallback(
      getBannerToken(`${slotPrefix}.icon`),
      toneFallback.iconColor
    ),
    titleColor: withTokenFallback(
      getBannerToken(`${slotPrefix}.title`),
      toneFallback.titleColor
    ),
    descriptionColor: withTokenFallback(
      getBannerToken(`${slotPrefix}.description`),
      toneFallback.descriptionColor
    ),
    actionBackground: withTokenFallback(
      getBannerToken(`${actionSlotPrefix}.background`) ??
        getBannerToken(`action.${normalizedTheme}.background`),
      actionFallback.background
    ),
    actionText: withTokenFallback(
      getBannerToken(`${actionSlotPrefix}.text`) ??
        getBannerToken(`action.${normalizedTheme}.text`),
      actionFallback.text
    ),
    actionIcon: withTokenFallback(
      getBannerToken(`${actionSlotPrefix}.icon`) ??
        getBannerToken(`action.${normalizedTheme}.icon`),
      actionFallback.icon
    )
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
  const [actionFocused, setActionFocused] = useState(false);
  const tone = getBannerTone(theme, state);
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const regular = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const fallbackFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const isDark = theme === "Dark";
  const focusColor = resolveBannerBindingValue(
    brand,
    "action.focusRing",
    String(getRequiredThemeTokenValue(brand, "color.border.focus"))
  );
  const rootWidth = resolveBannerBindingValue(brand, "container.width", "328px");
  const rootGap = resolveBannerBindingValue(brand, "container.gap", "0px");
  const rootRadius = resolveBannerBindingValue(brand, "container.radius", "14px");
  const rootShadow = resolveBannerBindingValue(brand, "container.shadow", BANNER_SHADOW_FALLBACK);
  const contentGap = icon
    ? resolveBannerBindingValue(brand, "content.gap", "8px")
    : resolveBannerBindingValue(brand, "container.gap", "0px");
  const contentPaddingInline = resolveBannerBindingValue(brand, "content.paddingInline", "12px");
  const contentPaddingBlock = resolveBannerBindingValue(brand, "content.paddingBlock", "16px");
  const leadingIconSize = resolveBannerBindingValue(brand, "icon.leading.size", "20px");
  const actionIconSize = resolveBannerBindingValue(brand, "icon.action.size", "24px");
  const actionTextRadius = resolveBannerBindingValue(brand, "action.text.radius", "999px");
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
    gap: heading ? "var(--cars24-misc-gap-2, 2px)" : 0
  };

  const actionAreaStyles: CSSProperties = {
    display: "flex",
    flexDirection: actionType === "Text button" ? "column" : "row",
    justifyContent: "center",
    alignItems: actionType === "Text button" ? "flex-end" : "center",
    paddingRight: "var(--cars24-misc-gap-12, 12px)",
    paddingLeft: "var(--cars24-misc-gap-none, 0px)",
    paddingTop:
      actionType === "Icon button"
        ? heading
          ? "var(--cars24-misc-gap-20, 20px)"
          : "var(--cars24-misc-gap-14, 14px)"
        : heading
          ? "var(--cars24-misc-gap-16, 16px)"
          : "var(--cars24-misc-gap-10, 10px)",
    paddingBottom:
      actionType === "Icon button"
        ? heading
          ? "var(--cars24-misc-gap-20, 20px)"
          : "var(--cars24-misc-gap-14, 14px)"
        : heading
          ? "var(--cars24-misc-gap-16, 16px)"
          : "var(--cars24-misc-gap-10, 10px)",
    width: actionType === "Text button" ? 68 : undefined,
    flexShrink: 0
  };

  const actionButtonStyles: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--cars24-misc-gap-4, 4px)",
    height: 28,
    maxHeight: 28,
    border: 0,
    borderRadius: actionTextRadius,
    padding: `${actionTextPaddingBlock} ${actionTextPaddingInline}`,
    background: tone.actionBackground,
    color: tone.actionText,
    cursor: "pointer",
    fontFamily: `var(--cars24-theme-font-family-primary, Geist), ${fallbackFontFamily}, sans-serif`,
    fontSize: "var(--cars24-typography-size-utility-label-3, 12px)",
    lineHeight: "var(--cars24-typography-line-height-utility-label-3, 16px)",
    fontWeight: medium,
    boxShadow: actionFocused ? `0 0 0 3px ${focusColor}40` : "none"
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
    borderRadius: "var(--cars24-theme-radius-alt-md, 12px)",
    boxShadow: actionFocused ? `0 0 0 3px ${focusColor}40` : "none"
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
                  fontFamily: `var(--cars24-theme-font-family-primary, Geist), ${fallbackFontFamily}, sans-serif`,
                  fontSize: "var(--cars24-typography-size-utility-label-1, 16px)",
                  lineHeight: "var(--cars24-typography-line-height-utility-label-1, 20px)",
                  fontWeight: medium
                }}
              >
                {title}
              </div>
              <div
                style={{
                  margin: 0,
                  color: tone.descriptionColor,
                  fontFamily: `var(--cars24-theme-font-family-primary, Geist), ${fallbackFontFamily}, sans-serif`,
                  fontSize: "var(--cars24-typography-size-paragraph-body-3, 12px)",
                  lineHeight: "var(--cars24-typography-line-height-paragraph-body-3, 18px)",
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
                fontFamily: `var(--cars24-theme-font-family-primary, Geist), ${fallbackFontFamily}, sans-serif`,
                fontSize: "var(--cars24-typography-size-paragraph-body-2, 14px)",
                lineHeight: "var(--cars24-typography-line-height-paragraph-body-2, 20px)",
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
              onFocus={() => setActionFocused(true)}
              onBlur={() => setActionFocused(false)}
              style={actionButtonStyles}
            >
              {actionLabel}
            </button>
          ) : (
            <button
              type="button"
              aria-label="Dismiss banner"
              onClick={onDismiss ?? onActionClick}
              onFocus={() => setActionFocused(true)}
              onBlur={() => setActionFocused(false)}
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
