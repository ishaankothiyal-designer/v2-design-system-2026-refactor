import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Button } from "./button";
import { Icon } from "./icon";

export const canonicalInternalPageHeaderWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.internalPageHeader"
);

export type InternalPageHeaderType = "With image" | "With button";

export interface InternalPageHeaderMediaSlotProps extends HTMLAttributes<HTMLDivElement> {
  brand?: DisplayBrandId;
  children?: ReactNode;
}

export interface InternalPageHeaderCopyProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  heading?: ReactNode;
  description?: ReactNode;
  iconName?: IconName;
  descriptionIcon?: ReactNode;
  descriptionIconName?: IconName;
  showDescription?: boolean;
  showDescriptionIcon?: boolean;
}

export interface InternalPageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  action?: ReactNode;
  actionLabel?: ReactNode;
  brand?: DisplayBrandId;
  description?: ReactNode;
  iconName?: IconName;
  descriptionIcon?: ReactNode;
  descriptionIconName?: IconName;
  heading?: ReactNode;
  imageSlot?: ReactNode;
  showDescription?: boolean;
  showDescriptionIcon?: boolean;
  type?: InternalPageHeaderType;
}

const INTERNAL_PAGE_HEADER_WIDTH = 360;
const INTERNAL_PAGE_HEADER_HEIGHT = 68;
const INTERNAL_PAGE_HEADER_MEDIA_SLOT_SIZE = 52;
const INTERNAL_PAGE_HEADER_MEDIA_ICON_SIZE = 26;

const FIGMA_BORDER_TERTIARY = "var(--cars24-semantic-border-tertiary, #94A3B8)";
const FIGMA_DRIVE_PINK_50 = "var(--cars24-primitive-drive-pink-50, #FFE8F7)";
const FIGMA_DRIVE_PINK_400 = "var(--cars24-primitive-drive-pink-400, #FD49C0)";
const FIGMA_GAP_NONE = "var(--cars24-misc-gap-none, 0px)";
const FIGMA_GAP_2 = "var(--cars24-misc-gap-2, 2px)";
const FIGMA_GAP_4 = "var(--cars24-misc-gap-4, 4px)";
const FIGMA_GAP_8 = "var(--cars24-misc-gap-8, 8px)";
const FIGMA_GAP_12 = "var(--cars24-misc-gap-12, 12px)";
const FIGMA_HEADLINE_H3_SIZE = "var(--cars24-typography-size-headline-h3, 17px)";
const FIGMA_HEADLINE_H3_LINE_HEIGHT = "var(--cars24-typography-line-height-headline-h3, 22px)";
const FIGMA_HEADLINE_H3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-headline-h3, -0.02px)";
const FIGMA_LABEL_3_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const FIGMA_LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const FIGMA_LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

const ellipsisStyles: CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

function renderDescriptionIcon({
  brand,
  descriptionIcon,
  descriptionIconName,
  showDescriptionIcon
}: {
  brand: DisplayBrandId;
  descriptionIcon: ReactNode;
  descriptionIconName: IconName;
  showDescriptionIcon: boolean;
}) {
  if (!showDescriptionIcon || descriptionIcon === null) {
    return null;
  }

  if (descriptionIcon !== undefined) {
    return descriptionIcon;
  }

  return (
    <Icon
      brand={brand}
      decorative
      name={descriptionIconName}
      size="sm"
      style={{
        color: FIGMA_BORDER_TERTIARY,
        flex: "0 0 auto",
        fontSize: pxToRem(16),
        height: pxToRem(16),
        width: pxToRem(16)
      }}
    />
  );
}

export function InternalPageHeaderMediaSlot({
  brand = "Cars24",
  children,
  className,
  style,
  ...rest
}: InternalPageHeaderMediaSlotProps) {
  const radius = Number(getRequiredThemeTokenValue(brand, "radius.md"));

  return (
    <div
      {...rest}
      aria-hidden={children === undefined ? true : rest["aria-hidden"]}
      className={className}
      style={{
        alignItems: "center",
        background: FIGMA_DRIVE_PINK_50,
        borderRadius: pxToRem(radius),
        boxSizing: "border-box",
        color: FIGMA_DRIVE_PINK_400,
        display: "inline-flex",
        flex: "0 0 auto",
        height: pxToRem(INTERNAL_PAGE_HEADER_MEDIA_SLOT_SIZE),
        justifyContent: "center",
        overflow: "hidden",
        width: pxToRem(INTERNAL_PAGE_HEADER_MEDIA_SLOT_SIZE),
        ...style
      }}
    >
      {children === undefined ? (
        <Icon
          brand={brand}
          decorative
          name="square-plus-add-outline"
          style={{
            color: "inherit",
            fontSize: pxToRem(INTERNAL_PAGE_HEADER_MEDIA_ICON_SIZE),
            height: pxToRem(INTERNAL_PAGE_HEADER_MEDIA_ICON_SIZE),
            width: pxToRem(INTERNAL_PAGE_HEADER_MEDIA_ICON_SIZE)
          }}
        />
      ) : (
        children
      )}
    </div>
  );
}

export function InternalPageHeaderCopy({
  brand = "Cars24",
  className,
  description = "Description label3 regular",
  descriptionIcon,
  descriptionIconName = "location-outline",
  heading = "Heading h3 semibold",
  iconName,
  showDescription = true,
  showDescriptionIcon = true,
  style,
  ...rest
}: InternalPageHeaderCopyProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const primaryTextColor = "var(--cars24-semantic-text-primary, #020617)";
  const secondaryTextColor = "var(--cars24-semantic-text-secondary, #64748B)";
  const regular = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const semibold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const resolvedIconName = iconName ?? descriptionIconName;

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "stretch",
        display: "flex",
        flex: "1 1 0",
        flexDirection: "column",
        gap: FIGMA_GAP_2,
        justifyContent: "center",
        minWidth: 0,
        padding: FIGMA_GAP_NONE,
        ...style
      }}
    >
      <p
        style={{
          ...ellipsisStyles,
          color: primaryTextColor,
          fontFamily,
          fontSize: FIGMA_HEADLINE_H3_SIZE,
          fontWeight: semibold,
          letterSpacing: FIGMA_HEADLINE_H3_LETTER_SPACING,
          lineHeight: FIGMA_HEADLINE_H3_LINE_HEIGHT,
          margin: 0,
          width: "100%"
        }}
      >
        {heading}
      </p>
      {showDescription ? (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: FIGMA_GAP_2,
            minWidth: 0,
            padding: FIGMA_GAP_NONE,
            width: "100%"
          }}
        >
          {renderDescriptionIcon({
            brand,
            descriptionIcon,
            descriptionIconName: resolvedIconName,
            showDescriptionIcon
          })}
          <p
            style={{
              ...ellipsisStyles,
              color: secondaryTextColor,
              flex: "1 1 0",
              fontFamily,
              fontSize: FIGMA_LABEL_3_SIZE,
              fontWeight: regular,
              letterSpacing: FIGMA_LABEL_3_LETTER_SPACING,
              lineHeight: FIGMA_LABEL_3_LINE_HEIGHT,
              margin: 0
            }}
          >
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Figma Internal Page Header widget with compact copy and either an image slot or a primary action.
 */
export function InternalPageHeader({
  action,
  actionLabel = "Button",
  brand = "Cars24",
  className,
  description,
  descriptionIcon,
  descriptionIconName,
  heading,
  iconName,
  imageSlot,
  showDescription = true,
  showDescriptionIcon = true,
  style,
  type = "With image",
  ...rest
}: InternalPageHeaderProps) {
  const isWithButton = type === "With button";
  const resolvedDescriptionIconName = iconName ?? descriptionIconName ?? "location-outline";
  const brandSubtlerHover = themeString(brand, "color.brand.primary.100");
  const primarySurface = themeString(brand, "color.surface.canvas");

  return (
    <div
      {...rest}
      className={className}
      data-brand={brand}
      data-type={type}
      style={{
        alignItems: "flex-start",
        background: `linear-gradient(180deg, ${brandSubtlerHover} 0%, ${primarySurface} 100%)`,
        boxSizing: "border-box",
        display: "flex",
        gap: FIGMA_GAP_4,
        height: pxToRem(INTERNAL_PAGE_HEADER_HEIGHT),
        maxWidth: "100%",
        padding: `${FIGMA_GAP_12} ${FIGMA_GAP_12} ${FIGMA_GAP_4}`,
        width: pxToRem(INTERNAL_PAGE_HEADER_WIDTH),
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: "1 1 0",
          gap: FIGMA_GAP_8,
          height: "100%",
          justifyContent: "center",
          minWidth: 0,
          padding: FIGMA_GAP_NONE
        }}
      >
        <InternalPageHeaderCopy
          brand={brand}
          description={description}
          descriptionIcon={descriptionIcon}
          descriptionIconName={resolvedDescriptionIconName}
          heading={heading}
          iconName={resolvedDescriptionIconName}
          showDescription={showDescription}
          showDescriptionIcon={showDescriptionIcon}
        />
        {isWithButton ? (
          action === undefined ? (
            <Button brand={brand} shape="Regular" size="Extra Small" styleVariant="Solid">
              {actionLabel}
            </Button>
          ) : (
            action
          )
        ) : (
          <InternalPageHeaderMediaSlot brand={brand}>{imageSlot}</InternalPageHeaderMediaSlot>
        )}
      </div>
    </div>
  );
}
