import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useInsertionEffect
} from "react";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Avatar, type AvatarAppearance } from "./avatar";
import { BrandLogo, type BrandLogoBrand } from "./brand-logo";
import { Button, type ButtonProps } from "./button";
import { Icon, type IconProps } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
import { ensureStyleSheet, joinClassNames, toCssRule } from "./runtime-styles";

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

const APP_HEADER_ROOT_CLASS = "geist-app-header";
const APP_HEADER_TOP_ROW_CLASS = "geist-app-header__top-row";
const APP_HEADER_LOGO_SLOT_CLASS = "geist-app-header__logo-slot";
const APP_HEADER_BRAND_LOGO_CLASS = "geist-app-header__brand-logo";
const APP_HEADER_ACTIONS_ROW_CLASS = "geist-app-header__actions";
const APP_HEADER_LOCATION_ROW_CLASS = "geist-app-header__location-row";
const APP_HEADER_LOCATION_BUTTON_CLASS = "geist-app-header__location-button";
const APP_HEADER_LOCATION_CONTENT_CLASS = "geist-app-header__location-content";
const APP_HEADER_LOCATION_ICON_CLASS = "geist-app-header__location-icon";
const APP_HEADER_LOCATION_LABEL_CLASS = "geist-app-header__location-label";
const APP_HEADER_AVATAR_TRIGGER_CLASS = "geist-app-header__avatar-trigger";
const APP_HEADER_L2_CONTENT_GROUP_CLASS = "geist-app-header__l2-content";
const APP_HEADER_BACK_CLASS = "geist-app-header__back";
const APP_HEADER_TITLE_BLOCK_CLASS = "geist-app-header__title-block";
const APP_HEADER_TITLE_CLASS = "geist-app-header__title";
const APP_HEADER_SUBTITLE_CLASS = "geist-app-header__subtitle";
const APP_HEADER_STYLESHEET_ID = "geist-app-header-styles";

const APP_HEADER_BRANDS = ["Cars24", "CarInfo", "VehicleInfo", "Team BHP"] as const;

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
  return tokenValueToRem(value);
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
      variant === "Light"
        ? "component.sectionHeader.color.light.description"
        : "component.sectionHeader.color.dark.description"
    )
  );
}

function buildAppHeaderBrandRules(brand: AppHeaderBrand, variant: AppHeaderVariant) {
  const selector = `.${APP_HEADER_ROOT_CLASS}[data-brand="${brand}"][data-variant="${variant.toLowerCase()}"]`;
  const titleFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));

  return toCssRule(selector, {
    "--app-header-action-control-extent": toPx(
      getRequiredThemeTokenValue(brand, "component.iconButton.size.sm.boxSize")
    ),
    "--app-header-background": resolveHeaderBackground(brand, variant),
    "--app-header-back-icon-size": toPx(getRequiredThemeTokenValue(brand, "icon.size.md")),
    "--app-header-cluster-gap": toPx(getRequiredThemeTokenValue(brand, "component.sectionHeader.size.actionGap")),
    "--app-header-horizontal-padding": toPx(getRequiredThemeTokenValue(brand, "spacing.3")),
    "--app-header-l2-min-height": "56px",
    "--app-header-l2-padding-block": toPx(getRequiredThemeTokenValue(brand, "spacing.1")),
    "--app-header-l2-subtitle-font-size": toPx(
      getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.fontSize")
    ),
    "--app-header-l2-subtitle-font-weight": String(
      getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")
    ),
    "--app-header-l2-subtitle-line-height": toPx(
      getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.lineHeight")
    ),
    "--app-header-l2-title-font-size": toPx(
      getRequiredThemeTokenValue(brand, "component.button.typography.md.fontSize")
    ),
    "--app-header-l2-title-font-weight": String(
      getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold")
    ),
    "--app-header-l2-title-line-height": toPx(
      getRequiredThemeTokenValue(brand, "component.button.typography.md.lineHeight")
    ),
    "--app-header-location-font-family": `${titleFontFamily}, sans-serif`,
    "--app-header-location-font-size": toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.xs")),
    "--app-header-location-font-weight": String(
      getRequiredThemeTokenValue(brand, "typography.fontWeight.medium")
    ),
    "--app-header-location-gap": toPx(getRequiredThemeTokenValue(brand, "spacing.1")),
    "--app-header-location-icon-color": resolveLocationIconColor(brand, variant),
    "--app-header-location-icon-size": toPx(getRequiredThemeTokenValue(brand, "icon.size.sm")),
    "--app-header-location-line-height": toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs")),
    "--app-header-location-text-color": resolveLocationTextColor(brand, variant),
    "--app-header-logo-height": toPx(getRequiredThemeTokenValue(brand, "icon.size.md")),
    "--app-header-logo-min-height": toPx(getRequiredThemeTokenValue(brand, "component.iconButton.size.sm.boxSize")),
    "--app-header-logo-width": toPx(87.715),
    "--app-header-subtitle-color": resolveSubtitleColor(brand, variant),
    "--app-header-title-color": resolveTitleColor(brand, variant),
    "--app-header-title-font-family": `${titleFontFamily}, sans-serif`,
    "--app-header-top-row-gap": toPx(getRequiredThemeTokenValue(brand, "spacing.2")),
    "--app-header-vertical-padding": toPx(getRequiredThemeTokenValue(brand, "spacing.2"))
  });
}

const APP_HEADER_STYLESHEET = [
  toCssRule(`.${APP_HEADER_ROOT_CLASS}`, {
    background: "var(--app-header-background)",
    "box-sizing": "border-box",
    display: "grid",
    overflow: "hidden",
    width: "100%"
  }),
  toCssRule(`.${APP_HEADER_ROOT_CLASS}[data-level="page-l2"]`, {
    "align-items": "center",
    display: "flex",
    "flex-wrap": "wrap",
    gap: "var(--app-header-top-row-gap)",
    "min-height": "var(--app-header-l2-min-height)",
    padding: "var(--app-header-l2-padding-block) var(--app-header-horizontal-padding)"
  }),
  toCssRule(`.${APP_HEADER_TOP_ROW_CLASS}`, {
    "align-items": "center",
    "box-sizing": "border-box",
    "column-gap": "var(--app-header-top-row-gap)",
    display: "flex",
    "flex-wrap": "wrap",
    "min-height": "48px",
    padding: "var(--app-header-vertical-padding) var(--app-header-horizontal-padding)"
  }),
  toCssRule(`.${APP_HEADER_LOGO_SLOT_CLASS}`, {
    "align-items": "center",
    display: "flex",
    flex: "1 1 160px",
    height: "var(--app-header-logo-min-height)",
    "min-width": "0"
  }),
  toCssRule(`.${APP_HEADER_BRAND_LOGO_CLASS}`, {
    height: "var(--app-header-logo-height) !important",
    "max-width": "100%",
    width: "var(--app-header-logo-width) !important"
  }),
  toCssRule(`.${APP_HEADER_ACTIONS_ROW_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex-wrap": "wrap",
    "flex-shrink": "0",
    gap: "var(--app-header-cluster-gap)",
    "justify-content": "flex-end",
    "max-width": "100%"
  }),
  toCssRule(`.${APP_HEADER_LOCATION_ROW_CLASS}`, {
    "align-items": "center",
    display: "flex",
    gap: "var(--app-header-location-gap, 0.25rem)",
    "min-width": "0",
    padding: "0 var(--app-header-horizontal-padding) var(--app-header-vertical-padding)",
    width: "100%"
  }),
  toCssRule(`.${APP_HEADER_LOCATION_BUTTON_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    "justify-content": "flex-start",
    "min-width": "0",
    padding: "0"
  }),
  toCssRule(`.${APP_HEADER_LOCATION_CONTENT_CLASS}`, {
    "align-items": "center",
    color: "var(--app-header-location-text-color)",
    "column-gap": "var(--app-header-location-gap, 0.25rem)",
    display: "flex",
    "flex-wrap": "wrap",
    "max-width": "100%",
    "min-width": "0",
    "row-gap": "2px"
  }),
  toCssRule(`.${APP_HEADER_LOCATION_ICON_CLASS}`, {
    "align-items": "center",
    color: "var(--app-header-location-icon-color)",
    display: "inline-flex",
    "flex-shrink": "0",
    "font-size": "var(--app-header-location-icon-size)",
    "line-height": "0"
  }),
  toCssRule(`.${APP_HEADER_LOCATION_LABEL_CLASS}`, {
    color: "var(--app-header-location-text-color)",
    display: "-webkit-box",
    "font-family": "var(--app-header-location-font-family)",
    "font-size": "var(--app-header-location-font-size)",
    "font-weight": "var(--app-header-location-font-weight)",
    "letter-spacing": "0",
    "line-height": "var(--app-header-location-line-height)",
    overflow: "hidden",
    "overflow-wrap": "anywhere",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "2",
    "white-space": "normal"
  }),
  toCssRule(`.${APP_HEADER_AVATAR_TRIGGER_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    "border-radius": "50%",
    display: "inline-flex",
    "flex-shrink": "0",
    height: "var(--app-header-action-control-extent)",
    "justify-content": "center",
    padding: "0",
    width: "var(--app-header-action-control-extent)"
  }),
  toCssRule(`button.${APP_HEADER_AVATAR_TRIGGER_CLASS}`, {
    cursor: "pointer"
  }),
  toCssRule(`.${APP_HEADER_L2_CONTENT_GROUP_CLASS}`, {
    "align-items": "center",
    display: "flex",
    flex: "1 1 220px",
    gap: "var(--app-header-horizontal-padding)",
    "min-width": "0"
  }),
  toCssRule(`.${APP_HEADER_BACK_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    color: "var(--app-header-title-color)",
    display: "inline-flex",
    "flex-shrink": "0",
    "font-size": "var(--app-header-back-icon-size)",
    "justify-content": "center",
    "line-height": "0",
    padding: "0"
  }),
  toCssRule(`button.${APP_HEADER_BACK_CLASS}`, {
    cursor: "pointer"
  }),
  toCssRule(`span.${APP_HEADER_BACK_CLASS}`, {
    cursor: "default"
  }),
  toCssRule(`.${APP_HEADER_TITLE_BLOCK_CLASS}`, {
    display: "grid",
    flex: "1",
    "min-width": "0"
  }),
  toCssRule(`.${APP_HEADER_TITLE_CLASS}`, {
    color: "var(--app-header-title-color)",
    display: "-webkit-box",
    "font-family": "var(--app-header-title-font-family)",
    "font-size": "var(--app-header-l2-title-font-size)",
    "font-weight": "var(--app-header-l2-title-font-weight)",
    "letter-spacing": "0",
    "line-height": "var(--app-header-l2-title-line-height)",
    margin: "0",
    overflow: "hidden",
    "overflow-wrap": "anywhere",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "2",
    "white-space": "normal"
  }),
  toCssRule(`.${APP_HEADER_SUBTITLE_CLASS}`, {
    color: "var(--app-header-subtitle-color)",
    display: "-webkit-box",
    "font-family": "var(--app-header-title-font-family)",
    "font-size": "var(--app-header-l2-subtitle-font-size)",
    "font-weight": "var(--app-header-l2-subtitle-font-weight)",
    "letter-spacing": "0",
    "line-height": "var(--app-header-l2-subtitle-line-height)",
    margin: "0",
    overflow: "hidden",
    "overflow-wrap": "anywhere",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": "2",
    "white-space": "normal"
  }),
  ...APP_HEADER_BRANDS.flatMap((brand) =>
    (["Brand", "Light", "Dark"] as const).map((variant) => buildAppHeaderBrandRules(brand, variant))
  )
].join("");

function resolveLogo(brand: AppHeaderBrand, variant: AppHeaderVariant, logo: ReactNode | undefined) {
  if (logo) {
    return logo;
  }

  return (
    <BrandLogo
      brand={brand}
      className={APP_HEADER_BRAND_LOGO_CLASS}
      decorative
      imageFit="cover"
      imagePosition="left center"
      onDark={variant !== "Light"}
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
  useInsertionEffect(() => {
    ensureStyleSheet(APP_HEADER_STYLESHEET_ID, APP_HEADER_STYLESHEET);
  }, []);

  const onDark = variant !== "Light";
  const titleColor = resolveTitleColor(brand, variant);

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

  const locationControl = (
    <span className={APP_HEADER_LOCATION_CONTENT_CLASS}>
      <span className={APP_HEADER_LOCATION_ICON_CLASS}>
        <Icon name={locationIcon} decorative size="sm" style={{ color: "inherit", fontSize: "inherit" }} />
      </span>
      <span className={APP_HEADER_LOCATION_LABEL_CLASS}>{locationLabel}</span>
      {showLocationChevron ? (
        <span className={APP_HEADER_LOCATION_ICON_CLASS}>
          <Icon
            name="chevron-down-small-outline"
            decorative
            size="sm"
            style={{ color: "inherit", fontSize: "inherit" }}
          />
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
        onDark,
        size: "Extra small" as const,
        ...(avatarImageSrc ? { imageSrc: avatarImageSrc } : {})
      };

      return avatarAction.onClick ? (
        <button
          aria-label={avatarAction["aria-label"] ?? avatarAction.label}
          className={APP_HEADER_AVATAR_TRIGGER_CLASS}
          onClick={avatarAction.onClick}
          style={avatarAction.style}
          type="button"
        >
          <Avatar {...avatarProps} />
        </button>
      ) : (
        <span
          aria-label={avatarAction["aria-label"] ?? avatarAction.label}
          className={APP_HEADER_AVATAR_TRIGGER_CLASS}
          role="img"
          style={avatarAction.style}
        >
          <Avatar {...avatarProps} />
        </span>
      );
    })()
  ) : null;

  if (level === "Page - L2") {
    const backNode = showBackButton ? (
      onBackClick ? (
        <button
          aria-label={backButtonLabel}
          className={APP_HEADER_BACK_CLASS}
          onClick={onBackClick}
          type="button"
        >
          <Icon
            brand={brand}
            decorative
            name={backIcon}
            size="md"
            style={{ color: "inherit", fontSize: "inherit" }}
          />
        </button>
      ) : (
        <span aria-hidden="true" className={APP_HEADER_BACK_CLASS}>
          <Icon
            brand={brand}
            decorative
            name={backIcon}
            size="md"
            style={{ color: "inherit", fontSize: "inherit" }}
          />
        </span>
      )
    ) : null;

    return (
      <div
        {...rest}
        className={joinClassNames(APP_HEADER_ROOT_CLASS, className)}
        data-brand={brand}
        data-level="page-l2"
        data-variant={variant.toLowerCase()}
        style={style}
      >
        <div className={APP_HEADER_L2_CONTENT_GROUP_CLASS}>
          {backNode}

          {showTitle || showSubtitle ? (
            <div className={APP_HEADER_TITLE_BLOCK_CLASS}>
              {showTitle ? <p className={APP_HEADER_TITLE_CLASS}>{title}</p> : null}
              {showSubtitle ? <p className={APP_HEADER_SUBTITLE_CLASS}>{subtitle}</p> : null}
            </div>
          ) : null}
        </div>

        <div className={APP_HEADER_ACTIONS_ROW_CLASS}>
          {pillAction && showAction1 ? (
            <Button
              {...pillAction}
              aria-label={pillAction["aria-label"] ?? pillAction.label}
              brand={brand}
              onDark={onDark}
              shape="Pill"
              size="Small"
              style={pillAction.style}
              styleVariant="Transparent"
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
              onDark={onDark}
              shape="Round"
              size="Small"
              style={actionStyle}
              styleVariant={variant === "Light" ? "Subtle - Black" : "Subtle - Primary"}
            />
          ))}

          {avatarNode}
        </div>
      </div>
    );
  }

  return (
    <div
      {...rest}
      className={joinClassNames(APP_HEADER_ROOT_CLASS, className)}
      data-brand={brand}
      data-level="page-l1"
      data-variant={variant.toLowerCase()}
      style={style}
    >
      <div className={APP_HEADER_TOP_ROW_CLASS}>
        <div className={APP_HEADER_LOGO_SLOT_CLASS}>{resolveLogo(brand, variant, logo)}</div>

        <div className={APP_HEADER_ACTIONS_ROW_CLASS}>
          {pillAction ? (
            <Button
              {...pillAction}
              aria-label={pillAction["aria-label"] ?? pillAction.label}
              brand={brand}
              onDark={onDark}
              shape="Pill"
              size="Small"
              style={pillAction.style}
              styleVariant="Transparent"
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
              onDark={onDark}
              shape="Round"
              size="Small"
              style={actionStyle}
              styleVariant={variant === "Light" ? "Subtle - Black" : "Subtle - Primary"}
            />
          ))}

          {avatarNode}
        </div>
      </div>

      {showLocation ? (
        <div className={APP_HEADER_LOCATION_ROW_CLASS}>
          {onLocationClick ? (
            <button
              aria-label={`Choose location: ${locationLabel}`}
              className={APP_HEADER_LOCATION_BUTTON_CLASS}
              onClick={onLocationClick}
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
