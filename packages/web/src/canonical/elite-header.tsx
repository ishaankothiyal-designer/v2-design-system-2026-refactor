import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useInsertionEffect
} from "react";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Avatar, type AvatarAppearance } from "./avatar";
import { EliteBadge, type EliteBadgeName } from "./elite-badge";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
import { ensureStyleSheet, joinClassNames, toCssRule } from "./runtime-styles";
import { SearchBar, type SearchBarProps } from "./search-bar";

export type EliteHeaderBrand = "Cars24";
export type EliteHeaderVariant = "Light" | "Dark";
export type EliteHeaderType = "Normal" | "Search";

export interface EliteHeaderIconAction
  extends Omit<IconButtonProps, "brand" | "icon" | "onDark" | "shape" | "size" | "styleVariant"> {
  icon: ReactNode;
  label: string;
}

export interface EliteHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: EliteHeaderBrand;
  variant?: EliteHeaderVariant;
  type?: EliteHeaderType;
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showTitleChevron?: boolean;
  showLeadingAction?: boolean;
  showBadge?: boolean;
  showAction1?: boolean;
  showAction2?: boolean;
  showAvatar?: boolean;
  badgeName?: EliteBadgeName;
  badgeLabel?: string;
  avatarAppearance?: AvatarAppearance;
  avatarAlt?: string;
  avatarInitials?: string;
  avatarSrc?: string;
  leadingAction?: EliteHeaderIconAction;
  action1?: EliteHeaderIconAction;
  action2?: EliteHeaderIconAction;
  avatarAction?: EliteHeaderIconAction;
  searchPlaceholder?: string;
  searchBarProps?: Omit<SearchBarProps, "brand" | "color" | "placeholder" | "size">;
  onTitleClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const ELITE_HEADER_ROOT_CLASS = "geist-elite-header";
const ELITE_HEADER_BAR_CLASS = "geist-elite-header__bar";
const ELITE_HEADER_SEARCH_SLOT_CLASS = "geist-elite-header__search-slot";
const ELITE_HEADER_TITLE_SLOT_CLASS = "geist-elite-header__title-slot";
const ELITE_HEADER_TITLE_CONTROL_CLASS = "geist-elite-header__title-control";
const ELITE_HEADER_TITLE_ROW_CLASS = "geist-elite-header__title-row";
const ELITE_HEADER_TITLE_TEXT_CLASS = "geist-elite-header__title-text";
const ELITE_HEADER_TITLE_ICON_CLASS = "geist-elite-header__title-icon";
const ELITE_HEADER_SUBTITLE_CLASS = "geist-elite-header__subtitle";
const ELITE_HEADER_TRAILING_CLASS = "geist-elite-header__trailing";
const ELITE_HEADER_AVATAR_TRIGGER_CLASS = "geist-elite-header__avatar-trigger";
const ELITE_HEADER_STYLESHEET_ID = "geist-elite-header-styles";

const ELITE_HEADER_BRANDS = ["Cars24"] as const;
const ELITE_HEADER_VARIANTS = ["Light", "Dark"] as const;

const defaultLeadingAction: EliteHeaderIconAction = {
  icon: <Icon name="placeholder-generate-outline" decorative />,
  label: "Open actions"
};

const defaultAction1: EliteHeaderIconAction = {
  icon: <Icon name="emoji-smile-outline" decorative />,
  label: "Mood"
};

const defaultAction2: EliteHeaderIconAction = {
  icon: <Icon name="emoji-smile-outline" decorative />,
  label: "Rewards"
};

const defaultAvatarAction: EliteHeaderIconAction = {
  icon: <Icon name="people-circle-user-circle-avatar-profile-outline" decorative />,
  label: "Profile"
};

function toPx(value: number | string) {
  return tokenValueToRem(value);
}

function isInverseVariant(variant: EliteHeaderVariant) {
  return variant === "Dark";
}

function resolveBackground(brand: EliteHeaderBrand, variant: EliteHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(brand, isInverseVariant(variant) ? "color.surface.inverse" : "color.surface.canvas")
  );
}

function resolveDividerColor(brand: EliteHeaderBrand, variant: EliteHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(
      brand,
      isInverseVariant(variant)
        ? "component.iconButton.color.dark.subtle.black.rest.background"
        : "component.divider.color.line"
    )
  );
}

function resolveTitleColor(brand: EliteHeaderBrand, variant: EliteHeaderVariant) {
  return String(getRequiredThemeTokenValue(brand, variant === "Dark" ? "color.text.inverse" : "color.text.primary"));
}

function resolveSubtitleColor(brand: EliteHeaderBrand, variant: EliteHeaderVariant) {
  return String(
    getRequiredThemeTokenValue(
      brand,
      variant === "Dark" ? "component.sectionHeader.color.dark.description" : "color.text.secondary"
    )
  );
}

function resolveSearchColor(variant: EliteHeaderVariant): "Inverse" | "Solid White" {
  return variant === "Dark" ? "Inverse" : "Solid White";
}

function buildEliteHeaderRules(brand: EliteHeaderBrand, variant: EliteHeaderVariant) {
  const selector = `.${ELITE_HEADER_ROOT_CLASS}[data-brand="${brand}"][data-variant="${variant.toLowerCase()}"]`;
  const titleFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));

  return toCssRule(selector, {
    "--elite-header-action-control-extent": toPx(
      getRequiredThemeTokenValue(brand, "component.iconButton.size.sm.boxSize")
    ),
    "--elite-header-background": resolveBackground(brand, variant),
    "--elite-header-border-color": resolveDividerColor(brand, variant),
    "--elite-header-cluster-gap": toPx(getRequiredThemeTokenValue(brand, "component.sectionHeader.size.actionGap")),
    "--elite-header-control-gap": toPx(getRequiredThemeTokenValue(brand, "spacing.2")),
    "--elite-header-horizontal-padding": toPx(getRequiredThemeTokenValue(brand, "spacing.3")),
    "--elite-header-subtitle-color": resolveSubtitleColor(brand, variant),
    "--elite-header-subtitle-font-family": `${titleFontFamily}, sans-serif`,
    "--elite-header-subtitle-font-size": toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.xs")),
    "--elite-header-subtitle-font-weight": String(
      getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")
    ),
    "--elite-header-subtitle-line-height": toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs")),
    "--elite-header-title-color": resolveTitleColor(brand, variant),
    "--elite-header-title-font-family": `${titleFontFamily}, sans-serif`,
    "--elite-header-title-font-size": toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.sm")),
    "--elite-header-title-font-weight": String(
      getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold")
    ),
    "--elite-header-title-gap": toPx(getRequiredThemeTokenValue(brand, "spacing.1")),
    "--elite-header-title-line-height": toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.sm"))
  });
}

const ELITE_HEADER_STYLESHEET = [
  toCssRule(`.${ELITE_HEADER_ROOT_CLASS}`, {
    background: "var(--elite-header-background)",
    "border-bottom": "1px solid var(--elite-header-border-color)",
    "box-sizing": "border-box",
    overflow: "hidden",
    padding: "0 var(--elite-header-horizontal-padding)",
    width: "100%"
  }),
  toCssRule(`.${ELITE_HEADER_BAR_CLASS}`, {
    "align-items": "center",
    display: "flex",
    gap: "var(--elite-header-control-gap)",
    height: "56px",
    "min-width": "0",
    width: "100%"
  }),
  toCssRule(`.${ELITE_HEADER_SEARCH_SLOT_CLASS}`, {
    flex: "1",
    "min-width": "0"
  }),
  toCssRule(`.${ELITE_HEADER_TITLE_SLOT_CLASS}`, {
    display: "grid",
    flex: "1",
    gap: "0",
    "min-width": "0"
  }),
  toCssRule(`.${ELITE_HEADER_TITLE_CONTROL_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    "justify-content": "flex-start",
    margin: "0",
    "max-width": "100%",
    "min-width": "0",
    padding: "0"
  }),
  toCssRule(`span.${ELITE_HEADER_TITLE_CONTROL_CLASS}`, {
    cursor: "default"
  }),
  toCssRule(`.${ELITE_HEADER_TITLE_ROW_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    gap: "var(--elite-header-title-gap)",
    "max-width": "100%",
    "min-width": "0"
  }),
  toCssRule(`.${ELITE_HEADER_TITLE_TEXT_CLASS}`, {
    color: "var(--elite-header-title-color)",
    "font-family": "var(--elite-header-title-font-family)",
    "font-size": "var(--elite-header-title-font-size)",
    "font-weight": "var(--elite-header-title-font-weight)",
    "letter-spacing": "0",
    "line-height": "var(--elite-header-title-line-height)",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }),
  toCssRule(`.${ELITE_HEADER_TITLE_ICON_CLASS}`, {
    "align-items": "center",
    color: "var(--elite-header-title-color)",
    display: "inline-flex",
    "flex-shrink": "0",
    "line-height": "0"
  }),
  toCssRule(`.${ELITE_HEADER_SUBTITLE_CLASS}`, {
    color: "var(--elite-header-subtitle-color)",
    "font-family": "var(--elite-header-subtitle-font-family)",
    "font-size": "var(--elite-header-subtitle-font-size)",
    "font-weight": "var(--elite-header-subtitle-font-weight)",
    "letter-spacing": "0",
    "line-height": "var(--elite-header-subtitle-line-height)",
    margin: "0",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }),
  toCssRule(`.${ELITE_HEADER_TRAILING_CLASS}`, {
    "align-items": "center",
    display: "flex",
    "flex-shrink": "0",
    gap: "var(--elite-header-cluster-gap)",
    "justify-content": "flex-end"
  }),
  toCssRule(`.${ELITE_HEADER_AVATAR_TRIGGER_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    "border-radius": "50%",
    display: "inline-flex",
    "flex-shrink": "0",
    height: "var(--elite-header-action-control-extent)",
    "justify-content": "center",
    padding: "0",
    width: "var(--elite-header-action-control-extent)"
  }),
  toCssRule(`button.${ELITE_HEADER_AVATAR_TRIGGER_CLASS}`, {
    cursor: "pointer"
  }),
  ...ELITE_HEADER_BRANDS.flatMap((brand) => ELITE_HEADER_VARIANTS.map((variant) => buildEliteHeaderRules(brand, variant)))
].join("");

/**
 * Premium header composition for Elite surfaces, with dedicated search and badge states.
 */
export function EliteHeader({
  brand = "Cars24",
  variant = "Dark",
  type = "Normal",
  title = "Gurugram",
  subtitle = "NCR, India",
  showTitle = true,
  showSubtitle = true,
  showTitleChevron = true,
  showLeadingAction = true,
  showBadge = true,
  showAction1 = true,
  showAction2 = true,
  showAvatar = true,
  badgeName = "Elite",
  badgeLabel = "Elite",
  avatarAppearance = "Image",
  avatarAlt = "Profile",
  avatarInitials = "MT",
  avatarSrc,
  leadingAction = defaultLeadingAction,
  action1 = defaultAction1,
  action2 = defaultAction2,
  avatarAction = defaultAvatarAction,
  searchPlaceholder = "Search",
  searchBarProps,
  onTitleClick,
  className,
  style,
  ...rest
}: EliteHeaderProps) {
  useInsertionEffect(() => {
    ensureStyleSheet(ELITE_HEADER_STYLESHEET_ID, ELITE_HEADER_STYLESHEET);
  }, []);

  const inverse = isInverseVariant(variant);
  const searchColor = resolveSearchColor(variant);
  const resolvedBadgeName: EliteBadgeName =
    badgeLabel.trim().toLowerCase() === "all cars" ? "All cars" : badgeName;
  const resolvedActions = [...(showAction1 ? [action1] : []), ...(showAction2 ? [action2] : [])];

  const titleRowNode = showTitle ? (
    <span className={ELITE_HEADER_TITLE_ROW_CLASS}>
      <span className={ELITE_HEADER_TITLE_TEXT_CLASS}>{title}</span>

      {showTitleChevron ? (
        <span className={ELITE_HEADER_TITLE_ICON_CLASS}>
          <Icon decorative name="chevron-down-small-outline" size="sm" style={{ color: "inherit" }} />
        </span>
      ) : null}
    </span>
  ) : null;

  const titleRow =
    onTitleClick && titleRowNode ? (
      <button
        aria-label={title}
        className={ELITE_HEADER_TITLE_CONTROL_CLASS}
        onClick={onTitleClick}
        type="button"
      >
        {titleRowNode}
      </button>
    ) : (
      <span className={ELITE_HEADER_TITLE_CONTROL_CLASS}>{titleRowNode}</span>
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
        onDark: inverse,
        size: "Extra small" as const,
        ...(avatarSrc ? { imageSrc: avatarSrc } : {})
      };

      return avatarAction.onClick ? (
        <button
          aria-label={avatarAction["aria-label"] ?? avatarAction.label}
          className={ELITE_HEADER_AVATAR_TRIGGER_CLASS}
          onClick={avatarAction.onClick}
          style={avatarAction.style}
          type="button"
        >
          <Avatar {...avatarProps} />
        </button>
      ) : (
        <span
          aria-label={avatarAction["aria-label"] ?? avatarAction.label}
          className={ELITE_HEADER_AVATAR_TRIGGER_CLASS}
          role="img"
          style={avatarAction.style}
        >
          <Avatar {...avatarProps} />
        </span>
      );
    })()
  ) : null;

  return (
    <div
      {...rest}
      className={joinClassNames(ELITE_HEADER_ROOT_CLASS, className)}
      data-brand={brand}
      data-type={type.toLowerCase()}
      data-variant={variant.toLowerCase()}
      style={style}
    >
      <div className={ELITE_HEADER_BAR_CLASS}>
        {showLeadingAction ? (
          <IconButton
            {...leadingAction}
            aria-label={leadingAction["aria-label"] ?? leadingAction.label}
            brand={brand}
            icon={leadingAction.icon}
            onDark={inverse}
            shape="Round"
            size="Small"
            style={leadingAction.style}
            styleVariant="Subtle - Black"
          />
        ) : null}

        {type === "Search" ? (
          <div className={ELITE_HEADER_SEARCH_SLOT_CLASS}>
            <SearchBar
              {...searchBarProps}
              brand={brand}
              color={searchColor}
              placeholder={searchPlaceholder}
              size="Small"
              style={searchBarProps?.style}
            />
          </div>
        ) : (
          <>
            <div className={ELITE_HEADER_TITLE_SLOT_CLASS}>
              {titleRow}
              {showSubtitle ? <p className={ELITE_HEADER_SUBTITLE_CLASS}>{subtitle}</p> : null}
            </div>

            <div className={ELITE_HEADER_TRAILING_CLASS}>
              {showBadge ? <EliteBadge badgeName={resolvedBadgeName} brand={brand} /> : null}

              {resolvedActions.map(({ icon, label, style: actionStyle, ...action }, index) => (
                <IconButton
                  {...action}
                  key={`${label}-${index}`}
                  aria-label={action["aria-label"] ?? label}
                  brand={brand}
                  icon={icon}
                  onDark={inverse}
                  shape="Round"
                  size="Small"
                  style={actionStyle}
                  styleVariant="Subtle - Black"
                />
              ))}

              {avatarNode}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
