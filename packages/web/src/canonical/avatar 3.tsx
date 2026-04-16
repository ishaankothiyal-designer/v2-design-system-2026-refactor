import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import type { IconName } from "@geist/icons";
import { getRequiredThemeTokenValue } from "../theme";
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
  return typeof value === "number" ? `${value}px` : /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
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
        aria-hidden="true"
        style={{
          alignItems: "center",
          background: surfaceColor,
          border: `1px solid ${fillColor}`,
          borderRadius: "50%",
          boxSizing: "border-box",
          display: "inline-flex",
          height: toPx(extent),
          justifyContent: "center",
          width: toPx(extent)
        }}
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
      aria-hidden="true"
      style={{
        alignItems: "center",
        display: "inline-flex",
        height: toPx(extent),
        justifyContent: "center",
        position: "relative",
        width: toPx(extent)
      }}
    >
      <Icon
        decorative
        name={badgeType === "Verified" ? "check-badge-fill" : "medal-badge-winner-filled"}
        style={{
          color: fillColor,
          fontSize: toPx(extent)
        }}
      />
      <Icon
        decorative
        name={badgeType === "Verified" ? "checkmark-1-filled" : "crown-vip-filled"}
        style={{
          color: String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
          fontSize: toPx(iconSize),
          left: "50%",
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)"
        }}
      />
    </span>
  );
}

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
  const metrics = getAvatarResolvedMetrics(brand, size);
  const radius = `${Number(getRequiredThemeTokenValue(brand, "radius.pill"))}px`;
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
      <img
        alt={imageAlt}
        src={imageSrc}
        style={{
          borderRadius: radius,
          display: "block",
          height: "100%",
          objectFit: "cover",
          width: "100%"
        }}
      />
    ) : appearance === "Initials" ? (
      <span
        aria-hidden={rest["aria-label"] || rest["aria-labelledby"] ? undefined : true}
        style={{
          alignItems: "center",
          background: initialsBackground,
          borderRadius: radius,
          color: initialsForeground,
          display: "inline-flex",
          fontFamily: `${fontFamily}, sans-serif`,
          fontSize: toPx(metrics.fontSize),
          fontWeight: metrics.fontWeight,
          height: "100%",
          justifyContent: "center",
          letterSpacing: metrics.letterSpacing,
          lineHeight: toPx(metrics.lineHeight),
          textTransform: "uppercase",
          width: "100%"
        }}
      >
        {getInitials(initials)}
      </span>
    ) : (
      <span
        aria-hidden={rest["aria-label"] || rest["aria-labelledby"] ? undefined : true}
        style={{
          alignItems: "center",
          background: iconBackground,
          borderRadius: radius,
          color: iconForeground,
          display: "inline-flex",
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
      >
        {icon ?? (
          <Icon
            decorative
            name={iconName}
            style={{
              color: iconForeground,
              fontSize: toPx(metrics.iconSize)
            }}
          />
        )}
      </span>
    );

  return (
    <span
      {...rest}
      style={
        {
          borderRadius: radius,
          display: "inline-flex",
          flexShrink: 0,
          height: toPx(metrics.boxSize),
          overflow: "visible",
          position: "relative",
          verticalAlign: "middle",
          width: toPx(metrics.boxSize),
          ...style
        } satisfies CSSProperties
      }
    >
      <span
        style={{
          borderRadius: radius,
          display: "inline-flex",
          height: "100%",
          overflow: "hidden",
          width: "100%"
        }}
      >
        {contentNode}
      </span>

      {adornment === "Status dot" ? (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            background: surfaceColor,
            borderRadius: "50%",
            bottom: toPx(metrics.dotOffset),
            display: "inline-flex",
            height: toPx(metrics.dotShellSize),
            justifyContent: "center",
            pointerEvents: "none",
            position: "absolute",
            right: toPx(metrics.dotOffset),
            width: toPx(metrics.dotShellSize)
          }}
        >
          <span
            style={{
              background: resolveStatusDotColor(brand, statusDotColor, onDark),
              borderRadius: "50%",
              display: "block",
              height: "80%",
              width: "80%"
            }}
          />
        </span>
      ) : null}

      {adornment === "Status badge" ? (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            background: surfaceColor,
            borderRadius: "50%",
            bottom: 0,
            display: "inline-flex",
            height: toPx(metrics.badgeExtent + metrics.badgeInset * 2),
            justifyContent: "center",
            pointerEvents: "none",
            position: "absolute",
            right: 0,
            transform: "translate(10%, 10%)",
            width: toPx(metrics.badgeExtent + metrics.badgeInset * 2)
          }}
        >
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
