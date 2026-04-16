import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getRequiredThemeTokenValue } from "../theme";
import { Avatar, type AvatarAppearance } from "./avatar";
import { BrandLogo, type BrandLogoBrand } from "./brand-logo";
import { Button, type ButtonProps } from "./button";
import { Icon, type IconProps } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";

export type AppHeaderBrand = BrandLogoBrand;
export type AppHeaderVariant = "Brand" | "Light" | "Dark";
export type AppHeaderLevel = "Page - L1" | "Page - L2";

export interface AppHeaderIconAction
  extends Omit<IconButtonProps, "brand" | "icon" | "onDark" | "shape" | "size" | "styleVariant"> {
  icon: ReactNode;
  label: string;
}

export interface AppHeaderPillAction
  extends Omit<ButtonProps, "brand" | "children" | "onDark" | "shape" | "size" | "styleVariant"> {
  label: string;
}

export interface AppHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: AppHeaderBrand;
  level?: AppHeaderLevel;
  variant?: AppHeaderVariant;
  logo?: ReactNode;
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  actions?: AppHeaderIconAction[];
  action1?: AppHeaderIconAction;
  action2?: AppHeaderIconAction;
  avatarAction?: AppHeaderIconAction;
  pillAction?: AppHeaderPillAction | null;
  backIcon?: IconProps["name"];
  showBackButton?: boolean;
  onBackClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  backButtonLabel?: string;
  locationLabel?: string;
  showLocation?: boolean;
  showAction1?: boolean;
  showAction2?: boolean;
  showAvatar?: boolean;
  avatarAppearance?: AvatarAppearance;
  avatarAlt?: string;
  avatarImageSrc?: string;
  avatarInitials?: string;
  locationIcon?: IconProps["name"];
  showLocationChevron?: boolean;
  onLocationClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const defaultAction1: AppHeaderIconAction = {
  icon: <Icon name="emoji-smile-outline" decorative />,
  label: "Mood"
};

const defaultAction2: AppHeaderIconAction = {
  icon: <Icon name="emoji-smile-outline" decorative />,
  label: "Rewards"
};

const defaultAvatarAction: AppHeaderIconAction = {
  icon: <Icon name="people-circle-user-circle-avatar-profile-outline" decorative />,
  label: "Profile"
};

function toPx(value: number | string) {
  return typeof value === "number" ? `${value}px` : /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

function resolveHeaderBackground(brand: AppHeaderBrand, variant: AppHeaderVariant) {
  if (variant === "Brand") {
    return String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  }

  if (variant === "Dark") {
    return String(getRequiredThemeTokenValue(brand, "component.backToTopButton.color.dark.rest.background"));
  }

  return String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
}

function resolveLocationTextColor(brand: AppHeaderBrand, variant: AppHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(
      brand,
      variant === "Light" ? "component.sectionHeader.color.light.description" : "color.text.inverse"
    )
  );
}

function resolveLocationIconColor(brand: AppHeaderBrand, variant: AppHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(
      brand,
      variant === "Light" ? "component.phoneInput.color.helper.default.icon" : "color.text.inverse"
    )
  );
}

function resolveTitleColor(brand: AppHeaderBrand, variant: AppHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(
      brand,
      variant === "Light" ? "color.text.primary" : "color.text.inverse"
    )
  );
}

function resolveSubtitleColor(brand: AppHeaderBrand, variant: AppHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(
      brand,
      variant === "Light" ? "component.sectionHeader.color.light.description" : "component.sectionHeader.color.dark.description"
    )
  );
}

function resolveLogo(brand: AppHeaderBrand, variant: AppHeaderVariant, logo: ReactNode | undefined) {
  if (logo) {
    return logo;
  }

  return (
    <BrandLogo
      brand={brand}
      decorative
      imageFit="cover"
      imagePosition="left center"
      onDark={variant !== "Light"}
      style={{
        height: "18px",
        width: "87.715px"
      }}
      type="Logo"
    />
  );
}

/**
 * Canonical top-of-screen header that combines brand identity, utility actions, and a compact location row.
 */
export function AppHeader({
  brand = "Cars24",
  level = "Page - L1",
  variant = "Brand",
  logo,
  title = "Page title",
  subtitle = "Subtext",
  showTitle = true,
  showSubtitle = true,
  actions,
  action1 = defaultAction1,
  action2 = defaultAction2,
  avatarAction = defaultAvatarAction,
  pillAction = null,
  backIcon = "arrow-left-outline",
  showBackButton = true,
  onBackClick,
  backButtonLabel = "Go back",
  locationLabel = "Gurgaon • SAS Tower, Sector 38",
  showLocation = true,
  showAction1 = true,
  showAction2 = true,
  showAvatar = true,
  avatarAppearance = "Icon",
  avatarAlt = "Profile image",
  avatarImageSrc,
  avatarInitials = "MT",
  locationIcon = "map-filled",
  showLocationChevron = true,
  onLocationClick,
  className,
  style,
  ...rest
}: AppHeaderProps) {
  const background = resolveHeaderBackground(brand, variant);
  const locationTextColor = resolveLocationTextColor(brand, variant);
  const locationIconColor = resolveLocationIconColor(brand, variant);
  const titleColor = resolveTitleColor(brand, variant);
  const subtitleColor = resolveSubtitleColor(brand, variant);
  const actionControlExtent = toPx(getRequiredThemeTokenValue(brand, "component.iconButton.size.sm.boxSize"));
  const horizontalPadding = toPx(getRequiredThemeTokenValue(brand, "spacing.3"));
  const verticalPadding = toPx(getRequiredThemeTokenValue(brand, "spacing.2"));
  const clusterGap = toPx(getRequiredThemeTokenValue(brand, "component.sectionHeader.size.actionGap"));
  const topRowGap = toPx(getRequiredThemeTokenValue(brand, "spacing.2"));
  const locationGap = toPx(getRequiredThemeTokenValue(brand, "spacing.1"));
  const logoMinHeight = actionControlExtent;
  const locationFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const locationFontSize = toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.xs"));
  const locationLineHeight = toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs"));
  const locationFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const locationIconSize = toPx(getRequiredThemeTokenValue(brand, "icon.size.sm"));
  const titleFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const l2TitleFontSize = toPx(getRequiredThemeTokenValue(brand, "component.button.typography.md.fontSize"));
  const l2TitleLineHeight = toPx(getRequiredThemeTokenValue(brand, "component.button.typography.md.lineHeight"));
  const l2TitleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const l2SubtitleFontSize = toPx(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.fontSize"));
  const l2SubtitleLineHeight = toPx(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.lineHeight"));
  const l2SubtitleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const backIconSize = toPx(getRequiredThemeTokenValue(brand, "icon.size.md"));
  const l1ResolvedActions =
    actions ??
    [
      ...(showAction1 ? [action1] : []),
      ...(showAction2 ? [action2] : [])
    ];
  const l2ResolvedActions =
    actions ??
    [
      ...(pillAction ? (showAction2 ? [action2] : []) : showAction1 ? [action1] : []),
      ...(!pillAction && showAction2 ? [action2] : [])
    ];

  const rootStyles: CSSProperties = {
    background,
    boxSizing: "border-box",
    display: "grid",
    overflow: "hidden",
    width: "100%",
    ...style
  };

  const topRowStyles: CSSProperties = {
    alignItems: "center",
    boxSizing: "border-box",
    columnGap: topRowGap,
    display: "flex",
    flexWrap: "wrap",
    minHeight: "48px",
    padding: `${verticalPadding} ${horizontalPadding}`
  };

  const logoContainerStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 160px",
    height: logoMinHeight,
    minWidth: 0
  };

  const actionsRowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    flexShrink: 0,
    gap: clusterGap,
    justifyContent: "flex-end",
    maxWidth: "100%"
  };

  const locationRowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: locationGap,
    minWidth: 0,
    padding: `0 ${horizontalPadding} ${verticalPadding}`,
    width: "100%"
  };

  const locationContentStyles: CSSProperties = {
    alignItems: "center",
    color: locationTextColor,
    columnGap: locationGap,
    display: "flex",
    flexWrap: "wrap",
    rowGap: "2px",
    maxWidth: "100%",
    minWidth: 0
  };

  const locationLabelStyles: CSSProperties = {
    color: locationTextColor,
    display: "-webkit-box",
    fontFamily: `${locationFontFamily}, sans-serif`,
    fontSize: locationFontSize,
    fontWeight: locationFontWeight,
    letterSpacing: 0,
    lineHeight: locationLineHeight,
    overflow: "hidden",
    overflowWrap: "anywhere",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    whiteSpace: "normal"
  };

  const locationControl = (
    <span style={locationContentStyles}>
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          color: locationIconColor,
          display: "inline-flex",
          flexShrink: 0,
          fontSize: locationIconSize,
          lineHeight: 0
        }}
      >
        <Icon name={locationIcon} decorative size="sm" style={{ color: locationIconColor }} />
      </span>
      <span style={locationLabelStyles}>{locationLabel}</span>
      {showLocationChevron ? (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            color: locationIconColor,
            display: "inline-flex",
            flexShrink: 0,
            fontSize: locationIconSize,
            lineHeight: 0
          }}
        >
          <Icon name="chevron-down-small-outline" decorative size="sm" style={{ color: locationIconColor }} />
        </span>
      ) : null}
    </span>
  );

  const avatarNode = showAvatar ? (
    (() => {
      const avatarProps = {
        adornment: "None" as const,
        appearance: avatarAppearance,
        brand,
        icon: avatarAction.icon,
        imageAlt: avatarAlt,
        initials: avatarInitials,
        onDark: variant !== "Light",
        size: "Extra small" as const,
        ...(avatarImageSrc ? { imageSrc: avatarImageSrc } : {})
      };

      return avatarAction.onClick ? (
        <button
          aria-label={avatarAction["aria-label"] ?? avatarAction.label}
          onClick={avatarAction.onClick}
          style={{
            alignItems: "center",
            appearance: "none",
            background: "transparent",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "inline-flex",
            flexShrink: 0,
            height: actionControlExtent,
            justifyContent: "center",
            padding: 0,
            width: actionControlExtent,
            ...(avatarAction.style ?? {})
          }}
          type="button"
        >
          <Avatar {...avatarProps} />
        </button>
      ) : (
        <span
          aria-label={avatarAction["aria-label"] ?? avatarAction.label}
          role="img"
          style={{
            alignItems: "center",
            display: "inline-flex",
            flexShrink: 0,
            height: actionControlExtent,
            justifyContent: "center",
            width: actionControlExtent,
            ...(avatarAction.style ?? {})
          }}
        >
          <Avatar {...avatarProps} />
        </span>
      );
    })()
  ) : null;

  if (level === "Page - L2") {
    const rootStyles: CSSProperties = {
      alignItems: "center",
      background,
      boxSizing: "border-box",
      display: "flex",
      flexWrap: "wrap",
      gap: topRowGap,
      minHeight: "56px",
      padding: `${toPx(getRequiredThemeTokenValue(brand, "spacing.1"))} ${horizontalPadding}`,
      width: "100%",
      ...style
    };

    const contentGroupStyles: CSSProperties = {
      alignItems: "center",
      display: "flex",
      flex: "1 1 220px",
      gap: horizontalPadding,
      minWidth: 0
    };

    const backButtonStyles: CSSProperties = {
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      border: "none",
      color: titleColor,
      cursor: onBackClick ? "pointer" : "default",
      display: "inline-flex",
      flexShrink: 0,
      justifyContent: "center",
      lineHeight: 0,
      padding: 0
    };

    const titleBlockStyles: CSSProperties = {
      display: "grid",
      flex: 1,
      minWidth: 0
    };

    const titleStyles: CSSProperties = {
      color: titleColor,
      display: "-webkit-box",
      fontFamily: `${titleFontFamily}, sans-serif`,
      fontSize: l2TitleFontSize,
      fontWeight: l2TitleFontWeight,
      letterSpacing: 0,
      lineHeight: l2TitleLineHeight,
      margin: 0,
      overflow: "hidden",
      overflowWrap: "anywhere",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      whiteSpace: "normal"
    };

    const subtitleStyles: CSSProperties = {
      color: subtitleColor,
      display: "-webkit-box",
      fontFamily: `${titleFontFamily}, sans-serif`,
      fontSize: l2SubtitleFontSize,
      fontWeight: l2SubtitleFontWeight,
      letterSpacing: 0,
      lineHeight: l2SubtitleLineHeight,
      margin: 0,
      overflow: "hidden",
      overflowWrap: "anywhere",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      whiteSpace: "normal"
    };

    const actionsRowStyles: CSSProperties = {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      flexShrink: 0,
      gap: clusterGap,
      justifyContent: "flex-end",
      maxWidth: "100%"
    };

    const backNode = showBackButton ? (
      onBackClick ? (
        <button aria-label={backButtonLabel} onClick={onBackClick} style={backButtonStyles} type="button">
          <Icon brand={brand} decorative name={backIcon} size="md" style={{ color: titleColor, fontSize: backIconSize }} />
        </button>
      ) : (
        <span aria-hidden="true" style={backButtonStyles}>
          <Icon brand={brand} decorative name={backIcon} size="md" style={{ color: titleColor, fontSize: backIconSize }} />
        </span>
      )
    ) : null;

    return (
      <div {...rest} className={className} style={rootStyles}>
        <div style={contentGroupStyles}>
          {backNode}

          {(showTitle || showSubtitle) ? (
            <div style={titleBlockStyles}>
              {showTitle ? <p style={titleStyles}>{title}</p> : null}
              {showSubtitle ? <p style={subtitleStyles}>{subtitle}</p> : null}
            </div>
          ) : null}
        </div>

        <div style={actionsRowStyles}>
          {pillAction && showAction1 ? (
            <Button
              {...pillAction}
              aria-label={pillAction["aria-label"] ?? pillAction.label}
              brand={brand}
              onDark={variant !== "Light"}
              shape="Pill"
              size="Small"
              styleVariant="Transparent"
              style={{
                height: actionControlExtent,
                minHeight: actionControlExtent,
                ...(pillAction.style ?? {})
              }}
            >
              {pillAction.label}
            </Button>
          ) : null}

          {l2ResolvedActions.map(({ icon, label, style: actionStyle, ...action }, index) => (
            <IconButton
              {...action}
              key={`${label}-${index}`}
              aria-label={action["aria-label"] ?? label}
              brand={brand}
              icon={icon}
              onDark={variant !== "Light"}
              shape="Round"
              size="Small"
              style={{
                height: actionControlExtent,
                width: actionControlExtent,
                ...(actionStyle ?? {})
              }}
              styleVariant={variant === "Light" ? "Subtle - Black" : "Subtle - Primary"}
            />
          ))}

          {avatarNode}
        </div>
      </div>
    );
  }

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={topRowStyles}>
        <div style={logoContainerStyles}>{resolveLogo(brand, variant, logo)}</div>

        <div style={actionsRowStyles}>
          {pillAction ? (
            <Button
              {...pillAction}
              aria-label={pillAction["aria-label"] ?? pillAction.label}
              brand={brand}
              onDark={variant !== "Light"}
              shape="Pill"
              size="Small"
              styleVariant="Transparent"
              style={{
                height: actionControlExtent,
                minHeight: actionControlExtent,
                ...(pillAction.style ?? {})
              }}
            >
              {pillAction.label}
            </Button>
          ) : null}

          {l1ResolvedActions.map(({ icon, label, style: actionStyle, ...action }, index) => (
            <IconButton
              {...action}
              key={`${label}-${index}`}
              aria-label={action["aria-label"] ?? label}
              brand={brand}
              icon={icon}
              onDark={variant !== "Light"}
              shape="Round"
              size="Small"
              style={{
                height: actionControlExtent,
                width: actionControlExtent,
                ...(actionStyle ?? {})
              }}
              styleVariant={variant === "Light" ? "Subtle - Black" : "Subtle - Primary"}
            />
          ))}

          {avatarNode}
        </div>
      </div>

      {showLocation ? (
        <div style={locationRowStyles}>
          {onLocationClick ? (
            <button
              aria-label={`Choose location: ${locationLabel}`}
              onClick={onLocationClick}
              style={{
                alignItems: "center",
                appearance: "none",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                justifyContent: "flex-start",
                minWidth: 0,
                padding: 0
              }}
              type="button"
            >
              {locationControl}
            </button>
          ) : (
            locationControl
          )}
        </div>
      ) : null}
    </div>
  );
}
