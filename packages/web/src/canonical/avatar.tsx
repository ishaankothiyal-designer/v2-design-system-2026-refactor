import { type CSSProperties, type HTMLAttributes, type ReactNode, useInsertionEffect } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import type { IconName } from "@turbo/icons";
import { ensureStyleSheet, joinClassNames, toCssRule } from "./runtime-styles";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { BrandLogo } from "./brand-logo";
import { Icon } from "./icon";

export type AvatarSize = "Extra small" | "Small" | "Medium" | "Large" | "Extra large";
export type AvatarAppearance = "Icon" | "Image" | "Initials";
export type AvatarAdornment = "None" | "Status dot" | "Status badge";
export type AvatarStatusDotColor = "Grey" | "Red" | "Green" | "Amber" | "Blue";
export type AvatarStatusBadgeType = "Verified" | "Premium" | "Cars24";

type AvatarTokenReference =
  | {
      type: "token";
      path: string;
    }
  | {
      type: "sum";
      paths: string[];
    };

type AvatarSizeSpec = {
  badgeExtent: AvatarTokenReference;
  badgeInset: number;
  badgeMarkSize: number;
  boxSize: AvatarTokenReference;
  dotOffset: number;
  dotShellSize: number;
  fontSize: number;
  fontSizeToken: string;
  fontWeightPath: string;
  iconSize: AvatarTokenReference;
  letterSpacing: string;
  letterSpacingToken: string;
  lineHeight: number;
  lineHeightToken: string;
};

const AVATAR_ROOT_CLASS = "geist-avatar";
const AVATAR_FRAME_CLASS = "geist-avatar__frame";
const AVATAR_CONTENT_CLASS = "geist-avatar__content";
const AVATAR_STATUS_DOT_SHELL_CLASS = "geist-avatar__status-dot-shell";
const AVATAR_STATUS_DOT_CLASS = "geist-avatar__status-dot";
const AVATAR_STATUS_BADGE_WRAP_CLASS = "geist-avatar__status-badge-wrap";
const AVATAR_STATUS_BADGE_CLASS = "geist-avatar__status-badge";
const AVATAR_STATUS_BADGE_MARK_CLASS = "geist-avatar__status-badge-mark";
const AVATAR_STYLESHEET_ID = "geist-avatar-styles";

export const AVATAR_SIZE_SPECS: Record<AvatarSize, AvatarSizeSpec> = {
  "Extra small": {
    badgeExtent: { type: "token", path: "component.iconButton.size.xxxs.iconSize" },
    badgeInset: 1,
    badgeMarkSize: 6,
    boxSize: { type: "token", path: "spacing.8" },
    dotOffset: 0,
    dotShellSize: 10,
    fontSize: 13,
    fontSizeToken: "var(--cars24-typography-size-headline-h5)",
    fontWeightPath: "typography.fontWeight.semibold",
    iconSize: { type: "token", path: "icon.size.md" },
    letterSpacing: "0px",
    letterSpacingToken: "var(--cars24-typography-letter-spacing-headline-h5)",
    lineHeight: 18,
    lineHeightToken: "var(--cars24-typography-line-height-headline-h5)"
  },
  Small: {
    badgeExtent: { type: "token", path: "component.iconButton.size.xxs.iconSize" },
    badgeInset: 1,
    badgeMarkSize: 7,
    boxSize: { type: "token", path: "spacing.10" },
    dotOffset: 0,
    dotShellSize: 12,
    fontSize: 15,
    fontSizeToken: "var(--cars24-typography-size-headline-h4)",
    fontWeightPath: "typography.fontWeight.semibold",
    iconSize: { type: "token", path: "icon.size.lg" },
    letterSpacing: "-0.02em",
    letterSpacingToken: "var(--cars24-typography-letter-spacing-headline-h4)",
    lineHeight: 20,
    lineHeightToken: "var(--cars24-typography-line-height-headline-h4)"
  },
  Medium: {
    badgeExtent: { type: "token", path: "component.linkButton.size.md.iconSize" },
    badgeInset: 1.5,
    badgeMarkSize: 8,
    boxSize: { type: "token", path: "spacing.12" },
    dotOffset: 0,
    dotShellSize: 14,
    fontSize: 17,
    fontSizeToken: "var(--cars24-typography-size-headline-h3)",
    fontWeightPath: "typography.fontWeight.semibold",
    iconSize: { type: "sum", paths: ["icon.size.lg", "spacing.1"] },
    letterSpacing: "-0.02em",
    letterSpacingToken: "var(--cars24-typography-letter-spacing-headline-h3)",
    lineHeight: 22,
    lineHeightToken: "var(--cars24-typography-line-height-headline-h3)"
  },
  Large: {
    badgeExtent: { type: "token", path: "component.linkButton.size.md.iconSize" },
    badgeInset: 1.5,
    badgeMarkSize: 8,
    boxSize: { type: "sum", paths: ["spacing.12", "spacing.2"] },
    dotOffset: 1,
    dotShellSize: 16,
    fontSize: 19,
    fontSizeToken: "var(--cars24-typography-size-headline-h2)",
    fontWeightPath: "typography.fontWeight.semibold",
    iconSize: { type: "token", path: "spacing.8" },
    letterSpacing: "-0.03em",
    letterSpacingToken: "var(--cars24-typography-letter-spacing-headline-h2)",
    lineHeight: 24,
    lineHeightToken: "var(--cars24-typography-line-height-headline-h2)"
  },
  "Extra large": {
    badgeExtent: { type: "token", path: "icon.size.sm" },
    badgeInset: 2,
    badgeMarkSize: 10,
    boxSize: { type: "token", path: "spacing.16" },
    dotOffset: 0,
    dotShellSize: 20,
    fontSize: 24,
    fontSizeToken: "var(--cars24-typography-size-headline-h1)",
    fontWeightPath: "typography.fontWeight.semibold",
    iconSize: { type: "sum", paths: ["spacing.8", "spacing.1"] },
    letterSpacing: "-0.05em",
    letterSpacingToken: "var(--cars24-typography-letter-spacing-headline-h1)",
    lineHeight: 28,
    lineHeightToken: "var(--cars24-typography-line-height-headline-h1)"
  }
};

function toPx(value: number | string) {
  return tokenValueToRem(value);
}

function getInitials(initials: string) {
  const trimmed = initials.trim();

  if (!trimmed) {
    return "";
  }

  const segments = trimmed.split(/\s+/);

  if (segments.length === 1) {
    return trimmed.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  }

  return segments
    .map((segment) => segment.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAvatarTokenReference(reference: AvatarTokenReference) {
  return reference.type === "token" ? reference.path : reference.paths.join(" + ");
}

function resolveAvatarTokenValue(brand: DisplayBrandId, reference: AvatarTokenReference) {
  if (reference.type === "token") {
    return Number(getRequiredThemeTokenValue(brand, reference.path));
  }

  return reference.paths.reduce(
    (total, path) => total + Number(getRequiredThemeTokenValue(brand, path)),
    0
  );
}

export function getAvatarResolvedMetrics(brand: DisplayBrandId, size: AvatarSize) {
  const spec = AVATAR_SIZE_SPECS[size];

  return {
    badgeExtent: resolveAvatarTokenValue(brand, spec.badgeExtent),
    badgeExtentToken: formatAvatarTokenReference(spec.badgeExtent),
    badgeInset: spec.badgeInset,
    badgeMarkSize: spec.badgeMarkSize,
    boxSize: resolveAvatarTokenValue(brand, spec.boxSize),
    boxSizeToken: formatAvatarTokenReference(spec.boxSize),
    dotOffset: spec.dotOffset,
    dotShellSize: spec.dotShellSize,
    dotSize: spec.dotShellSize * 0.8,
    fontSize: spec.fontSize,
    fontSizeToken: spec.fontSizeToken,
    fontWeight: Number(getRequiredThemeTokenValue(brand, spec.fontWeightPath)),
    fontWeightToken: spec.fontWeightPath,
    iconSize: resolveAvatarTokenValue(brand, spec.iconSize),
    iconSizeToken: formatAvatarTokenReference(spec.iconSize),
    letterSpacing: spec.letterSpacing,
    letterSpacingToken: spec.letterSpacingToken,
    lineHeight: spec.lineHeight,
    lineHeightToken: spec.lineHeightToken
  };
}

function resolveStatusDotColor(brand: DisplayBrandId, color: AvatarStatusDotColor, onDark: boolean) {
  if (color === "Grey") {
    return String(
      getRequiredThemeTokenValue(brand, onDark ? "color.text.disabledInverse" : "color.border.default")
    );
  }

  if (color === "Red") {
    return String(getRequiredThemeTokenValue(brand, "color.status.danger"));
  }

  if (color === "Green") {
    return String(getRequiredThemeTokenValue(brand, "color.status.success"));
  }

  if (color === "Amber") {
    return String(getRequiredThemeTokenValue(brand, "color.status.warning"));
  }

  return String(getRequiredThemeTokenValue(brand, "color.status.info"));
}

function AvatarStatusBadge({
  badgeType,
  brand,
  extent,
  iconSize,
  onDark,
  surfaceColor
}: {
  badgeType: AvatarStatusBadgeType;
  brand: DisplayBrandId;
  extent: number;
  iconSize: number;
  onDark: boolean;
  surfaceColor: string;
}) {
  const fillColor =
    badgeType === "Verified"
      ? String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"))
      : badgeType === "Premium"
        ? onDark
          ? String(
              getRequiredThemeTokenValue(brand, "component.iconButton.color.dark.subtle.black.rest.background")
            )
          : String(getRequiredThemeTokenValue(brand, "color.text.secondary"))
        : String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));

  if (badgeType === "Cars24") {
    return (
      <span
        className={AVATAR_STATUS_BADGE_CLASS}
        style={
          {
            "--avatar-badge-border": fillColor,
            "--avatar-badge-extent": toPx(extent),
            "--avatar-badge-fill": surfaceColor,
            "--avatar-badge-surface": surfaceColor
          } as CSSProperties
        }
      >
        <BrandLogo
          brand={brand}
          decorative
          onDark={false}
          style={{
            height: toPx(iconSize),
            width: toPx(iconSize)
          }}
          type="Symbol"
        />
      </span>
    );
  }

  return (
    <span
      className={AVATAR_STATUS_BADGE_CLASS}
      style={
        {
          "--avatar-badge-color": fillColor,
          "--avatar-badge-extent": toPx(extent)
        } as CSSProperties
      }
    >
      <Icon
        decorative
        name={badgeType === "Verified" ? "check-badge-fill" : "medal-badge-winner-filled"}
        style={{
          color: "var(--avatar-badge-color)",
          fontSize: "var(--avatar-badge-extent)"
        }}
      />
      <Icon
        decorative
        className={AVATAR_STATUS_BADGE_MARK_CLASS}
        name={badgeType === "Verified" ? "checkmark-1-filled" : "crown-vip-filled"}
        style={{
          color: "var(--avatar-badge-mark-color)",
          fontSize: toPx(iconSize)
        }}
      />
    </span>
  );
}

const AVATAR_STYLESHEET = [
  toCssRule(`.${AVATAR_ROOT_CLASS}`, {
    "border-radius": "var(--avatar-radius)",
    display: "inline-flex",
    "flex-shrink": "0",
    height: "var(--avatar-box-size)",
    overflow: "visible",
    position: "relative",
    "vertical-align": "middle",
    width: "var(--avatar-box-size)"
  }),
  toCssRule(`.${AVATAR_FRAME_CLASS}`, {
    "border-radius": "var(--avatar-radius)",
    display: "inline-flex",
    height: "100%",
    overflow: "hidden",
    width: "100%"
  }),
  toCssRule(`.${AVATAR_CONTENT_CLASS}`, {
    "align-items": "center",
    "background": "var(--avatar-content-background)",
    "border-radius": "var(--avatar-radius)",
    color: "var(--avatar-content-color)",
    display: "inline-flex",
    "font-family": "var(--avatar-font-family)",
    "font-size": "var(--avatar-font-size)",
    "font-weight": "var(--avatar-font-weight)",
    height: "100%",
    "justify-content": "center",
    "letter-spacing": "var(--avatar-letter-spacing)",
    "line-height": "var(--avatar-line-height)",
    "text-transform": "uppercase",
    width: "100%"
  }),
  toCssRule(`.${AVATAR_CONTENT_CLASS} > img`, {
    "border-radius": "var(--avatar-radius)",
    display: "block",
    height: "100%",
    "object-fit": "cover",
    width: "100%"
  }),
  toCssRule(`.${AVATAR_STATUS_DOT_SHELL_CLASS}`, {
    "align-items": "center",
    background: "var(--avatar-surface-color)",
    "border-radius": "50%",
    bottom: "var(--avatar-dot-offset)",
    display: "inline-flex",
    height: "var(--avatar-dot-shell-size)",
    "justify-content": "center",
    "pointer-events": "none",
    position: "absolute",
    right: "var(--avatar-dot-offset)",
    width: "var(--avatar-dot-shell-size)"
  }),
  toCssRule(`.${AVATAR_STATUS_DOT_CLASS}`, {
    background: "var(--avatar-dot-color)",
    "border-radius": "50%",
    display: "block",
    height: "80%",
    width: "80%"
  }),
  toCssRule(`.${AVATAR_STATUS_BADGE_WRAP_CLASS}`, {
    "align-items": "center",
    background: "var(--avatar-surface-color)",
    "border-radius": "50%",
    bottom: "0",
    display: "inline-flex",
    height: "var(--avatar-badge-wrap-size)",
    "justify-content": "center",
    "pointer-events": "none",
    position: "absolute",
    right: "0",
    transform: "translate(10%, 10%)",
    width: "var(--avatar-badge-wrap-size)"
  }),
  toCssRule(`.${AVATAR_STATUS_BADGE_CLASS}`, {
    "align-items": "center",
    background: "var(--avatar-badge-fill, transparent)",
    border: "var(--avatar-badge-border, 0 solid transparent)",
    "border-radius": "50%",
    display: "inline-flex",
    height: "var(--avatar-badge-extent)",
    "justify-content": "center",
    position: "relative",
    width: "var(--avatar-badge-extent)"
  }),
  toCssRule(`.${AVATAR_STATUS_BADGE_MARK_CLASS}`, {
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)"
  })
].join("");

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  appearance?: AvatarAppearance;
  adornment?: AvatarAdornment;
  badgeType?: AvatarStatusBadgeType;
  brand?: DisplayBrandId;
  icon?: ReactNode;
  iconName?: IconName;
  imageAlt?: string;
  imageSrc?: string;
  initials?: string;
  onDark?: boolean;
  size?: AvatarSize;
  statusDotColor?: AvatarStatusDotColor;
}

/**
 * Canonical avatar primitive covering icon, image, and initials treatments with status-dot and status-badge adornments.
 */
export function Avatar({
  appearance = "Icon",
  adornment = "Status dot",
  badgeType = "Verified",
  brand = "Cars24",
  className,
  icon,
  iconName = "people-circle-user-circle-avatar-profile-outline",
  imageAlt = "Profile image",
  imageSrc,
  initials = "MT",
  onDark = false,
  size = "Medium",
  statusDotColor = "Green",
  style,
  ...rest
}: AvatarProps) {
  useInsertionEffect(() => {
    ensureStyleSheet(AVATAR_STYLESHEET_ID, AVATAR_STYLESHEET);
  }, []);

  const metrics = getAvatarResolvedMetrics(brand, size);
  const radius = tokenValueToRem(getRequiredThemeTokenValue(brand, "radius.pill"));
  const surfaceColor = String(
    getRequiredThemeTokenValue(brand, onDark ? "color.surface.inverse" : "color.surface.canvas")
  );
  const iconBackground = String(
    onDark
      ? getRequiredThemeTokenValue(brand, "component.iconButton.color.dark.subtle.black.rest.background")
      : "var(--cars24-utility-alpha-black-50, rgba(26, 26, 26, 0.07))"
  );
  const iconForeground = String(
    getRequiredThemeTokenValue(
      brand,
      onDark
        ? "component.iconButton.color.dark.subtle.black.rest.foreground"
        : "component.iconButton.color.light.subtle.black.rest.foreground"
    )
  );
  const initialsBackground = String(
    onDark
      ? getRequiredThemeTokenValue(brand, "color.brand.primary.500")
      : "var(--cars24-semantic-bg-brand-subtle, #E1E3FD)"
  );
  const initialsForeground = String(
    onDark
      ? getRequiredThemeTokenValue(brand, "color.text.inverse")
      : "var(--cars24-semantic-text-brand-base, #4736FE)"
  );
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));

  const contentNode =
    appearance === "Image" && imageSrc ? (
      <img alt={imageAlt} src={imageSrc} />
    ) : appearance === "Initials" ? (
      <span
        aria-hidden={rest["aria-label"] || rest["aria-labelledby"] ? undefined : true}
        className={AVATAR_CONTENT_CLASS}
        style={
          {
            "--avatar-content-background": initialsBackground,
            "--avatar-content-color": initialsForeground
          } as CSSProperties
        }
      >
        {getInitials(initials)}
      </span>
    ) : (
      <span
        aria-hidden={rest["aria-label"] || rest["aria-labelledby"] ? undefined : true}
        className={AVATAR_CONTENT_CLASS}
        style={
          {
            "--avatar-content-background": iconBackground,
            "--avatar-content-color": iconForeground
          } as CSSProperties
        }
      >
        {icon ?? (
          <Icon
            decorative
            name={iconName}
            style={{
              color: "inherit",
              fontSize: toPx(metrics.iconSize)
            }}
          />
        )}
      </span>
    );

  return (
    <span
      {...rest}
      className={joinClassNames(AVATAR_ROOT_CLASS, className)}
      style={
        {
          "--avatar-badge-mark-color": String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
          "--avatar-badge-wrap-size": toPx(metrics.badgeExtent + metrics.badgeInset * 2),
          "--avatar-box-size": toPx(metrics.boxSize),
          "--avatar-dot-color": resolveStatusDotColor(brand, statusDotColor, onDark),
          "--avatar-dot-offset": toPx(metrics.dotOffset),
          "--avatar-dot-shell-size": toPx(metrics.dotShellSize),
          "--avatar-font-family": `${fontFamily}, sans-serif`,
          "--avatar-font-size": toPx(metrics.fontSize),
          "--avatar-font-weight": String(metrics.fontWeight),
          "--avatar-letter-spacing": metrics.letterSpacing,
          "--avatar-line-height": toPx(metrics.lineHeight),
          "--avatar-radius": radius,
          "--avatar-surface-color": surfaceColor,
          ...style
        } as CSSProperties
      }
    >
      <span className={AVATAR_FRAME_CLASS}>{contentNode}</span>

      {adornment === "Status dot" ? (
        <span aria-hidden="true" className={AVATAR_STATUS_DOT_SHELL_CLASS}>
          <span className={AVATAR_STATUS_DOT_CLASS} />
        </span>
      ) : null}

      {adornment === "Status badge" ? (
        <span aria-hidden="true" className={AVATAR_STATUS_BADGE_WRAP_CLASS}>
          <AvatarStatusBadge
            badgeType={badgeType}
            brand={brand}
            extent={metrics.badgeExtent}
            iconSize={metrics.badgeMarkSize}
            onDark={onDark}
            surfaceColor={surfaceColor}
          />
        </span>
      ) : null}
    </span>
  );
}
