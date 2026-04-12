import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getRequiredThemeTokenValue } from "../theme";
import { EliteBadge, type EliteBadgeName } from "./elite-badge";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
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
  avatarAlt?: string;
  avatarSrc?: string;
  leadingAction?: EliteHeaderIconAction;
  action1?: EliteHeaderIconAction;
  action2?: EliteHeaderIconAction;
  avatarAction?: EliteHeaderIconAction;
  searchPlaceholder?: string;
  searchBarProps?: Omit<SearchBarProps, "brand" | "color" | "placeholder" | "size">;
  onTitleClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

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
  return typeof value === "number" ? `${value}px` : /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
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
  avatarAlt = "Profile",
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
  const inverse = isInverseVariant(variant);
  const background = resolveBackground(brand, variant);
  const dividerColor = resolveDividerColor(brand, variant);
  const titleColor = resolveTitleColor(brand, variant);
  const subtitleColor = resolveSubtitleColor(brand, variant);
  const searchColor = resolveSearchColor(variant);
  const actionControlExtent = toPx(getRequiredThemeTokenValue(brand, "component.iconButton.size.sm.boxSize"));
  const horizontalPadding = toPx(getRequiredThemeTokenValue(brand, "spacing.3"));
  const clusterGap = toPx(getRequiredThemeTokenValue(brand, "component.sectionHeader.size.actionGap"));
  const controlGap = toPx(getRequiredThemeTokenValue(brand, "spacing.2"));
  const titleGap = toPx(getRequiredThemeTokenValue(brand, "spacing.1"));
  const titleFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const titleFontSize = toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.sm"));
  const titleLineHeight = toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.sm"));
  const titleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const subtitleFontSize = toPx(getRequiredThemeTokenValue(brand, "typography.fontSize.xs"));
  const subtitleLineHeight = toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs"));
  const subtitleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const resolvedBadgeName: EliteBadgeName =
    badgeLabel.trim().toLowerCase() === "all cars" ? "All cars" : badgeName;
  const resolvedActions = [
    ...(showAction1 ? [action1] : []),
    ...(showAction2 ? [action2] : [])
  ];

  const titleRowNode =
    showTitle ? (
      <span
        style={{
          alignItems: "center",
          display: "inline-flex",
          gap: titleGap,
          maxWidth: "100%"
        }}
      >
        <span
          style={{
            color: titleColor,
            fontFamily: `${titleFontFamily}, sans-serif`,
            fontSize: titleFontSize,
            fontWeight: titleFontWeight,
            letterSpacing: 0,
            lineHeight: titleLineHeight,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {title}
        </span>

        {showTitleChevron ? (
          <Icon decorative name="chevron-down-small-outline" size="sm" style={{ color: titleColor }} />
        ) : null}
      </span>
    ) : null;

  const titleRow = onTitleClick ? (
    <button
      aria-label={title}
      onClick={onTitleClick}
      style={{
        alignItems: "center",
        appearance: "none",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        justifyContent: "flex-start",
        margin: 0,
        minWidth: 0,
        padding: 0
      }}
      type="button"
    >
      {titleRowNode}
    </button>
  ) : (
    titleRowNode
  );

  const avatarNode = showAvatar ? (
    avatarSrc ? (
      <button
        aria-label={avatarAction["aria-label"] ?? avatarAction.label}
        onClick={avatarAction.onClick}
        style={{
          alignItems: "center",
          appearance: "none",
          background: "transparent",
          border: "none",
          borderRadius: "50%",
          cursor: avatarAction.onClick ? "pointer" : "default",
          display: "inline-flex",
          flexShrink: 0,
          height: actionControlExtent,
          justifyContent: "center",
          overflow: "hidden",
          padding: 0,
          width: actionControlExtent
        }}
        type="button"
      >
        <img
          alt={avatarAlt}
          src={avatarSrc}
          style={{
            borderRadius: "50%",
            display: "block",
            height: "100%",
            objectFit: "cover",
            width: "100%"
          }}
        />
      </button>
    ) : (
      <IconButton
        {...avatarAction}
        aria-label={avatarAction["aria-label"] ?? avatarAction.label}
        brand={brand}
        icon={avatarAction.icon}
        onDark={inverse}
        shape="Round"
        size="Small"
        style={{
          height: actionControlExtent,
          width: actionControlExtent,
          ...(avatarAction.style ?? {})
        }}
        styleVariant="Subtle - Black"
      />
    )
  ) : null;

  return (
    <div
      {...rest}
      className={className}
      style={{
        background,
        borderBottom: `1px solid ${dividerColor}`,
        boxSizing: "border-box",
        overflow: "hidden",
        padding: `0 ${horizontalPadding}`,
        width: "100%",
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: controlGap,
          height: "56px",
          minWidth: 0,
          width: "100%"
        }}
      >
        {showLeadingAction ? (
          <IconButton
            {...leadingAction}
            aria-label={leadingAction["aria-label"] ?? leadingAction.label}
            brand={brand}
            icon={leadingAction.icon}
            onDark={inverse}
            shape="Round"
            size="Small"
            style={{
              height: actionControlExtent,
              width: actionControlExtent,
              ...(leadingAction.style ?? {})
            }}
            styleVariant="Subtle - Black"
          />
        ) : null}

        {type === "Search" ? (
          <SearchBar
            {...searchBarProps}
            brand={brand}
            color={searchColor}
            placeholder={searchPlaceholder}
            size="Small"
            style={{
              flex: 1,
              minWidth: 0,
              ...(searchBarProps?.style ?? {})
            }}
          />
        ) : (
          <>
            <div
              style={{
                display: "grid",
                flex: 1,
                gap: 0,
                minWidth: 0
              }}
            >
              {titleRow}

              {showSubtitle ? (
                <p
                  style={{
                    color: subtitleColor,
                    fontFamily: `${titleFontFamily}, sans-serif`,
                    fontSize: subtitleFontSize,
                    fontWeight: subtitleFontWeight,
                    letterSpacing: 0,
                    lineHeight: subtitleLineHeight,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {subtitle}
                </p>
              ) : null}
            </div>

            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexShrink: 0,
                gap: clusterGap,
                justifyContent: "flex-end"
              }}
            >
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
                  style={{
                    height: actionControlExtent,
                    width: actionControlExtent,
                    ...(actionStyle ?? {})
                  }}
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
