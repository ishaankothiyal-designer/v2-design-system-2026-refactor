import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";

export const canonicalWidgetEmptyStateWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.emptyState"
);

export interface WidgetEmptyStateImageSlotProps extends HTMLAttributes<HTMLDivElement> {
  brand?: DisplayBrandId;
}

export interface WidgetEmptyStateCopyProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  title?: ReactNode;
  description?: ReactNode;
  dynamicLabel?: ReactNode;
  showTitle?: boolean;
  showDescription?: boolean;
  showDynamicLabel?: boolean;
}

export interface WidgetEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  title?: ReactNode;
  description?: ReactNode;
  dynamicLabel?: ReactNode;
  imageSlot?: ReactNode;
  primaryAction?: ButtonGroupButtonAction | null;
  secondaryAction?: ButtonGroupButtonAction | null;
  showDescription?: boolean;
  showDynamicLabel?: boolean;
  showImageSlot?: boolean;
  showTitle?: boolean;
}

const WIDGET_EMPTY_STATE_WIDTH = 360;
const WIDGET_EMPTY_STATE_IMAGE_SLOT_WIDTH = 260;
const WIDGET_EMPTY_STATE_IMAGE_SLOT_HEIGHT = 166;
const WIDGET_EMPTY_STATE_PLACEHOLDER_ICON_SIZE = 48;

const FIGMA_SURFACE_BACKGROUND = "var(--cars24-semantic-bg-primary, #FFFFFF)";
const FIGMA_DRIVE_PINK_50 = "var(--cars24-primitive-drive-pink-50, #FFE8F7)";
const FIGMA_DRIVE_PINK_400 = "var(--cars24-primitive-drive-pink-400, #FD49C0)";
const FIGMA_GAP_2 = "var(--cars24-misc-gap-2, 2px)";
const FIGMA_GAP_8 = "var(--cars24-misc-gap-8, 8px)";
const FIGMA_GAP_16 = "var(--cars24-misc-gap-16, 16px)";
const FIGMA_LABEL_3_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const FIGMA_LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const FIGMA_LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function themeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    styleVariant: "Solid",
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function buildDefaultSecondaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    styleVariant: "Ghost",
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function withActionVariant(
  action: ButtonGroupButtonAction,
  fallbackStyleVariant: NonNullable<ButtonGroupButtonAction["styleVariant"]>
) {
  return {
    ...action,
    styleVariant: action.styleVariant ?? fallbackStyleVariant
  } satisfies ButtonGroupButtonAction;
}

function lineClampStyles(lineClamp: number): CSSProperties {
  return {
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lineClamp,
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
}

function WidgetEmptyStatePlaceholderGlyph({ brand }: { brand: DisplayBrandId }) {
  const iconSize = pxToRem(WIDGET_EMPTY_STATE_PLACEHOLDER_ICON_SIZE);

  return (
    <Icon
      brand={brand}
      decorative
      name="square-plus-add-outline"
      style={{
        color: FIGMA_DRIVE_PINK_400,
        fontSize: iconSize,
        height: iconSize,
        width: iconSize
      }}
    />
  );
}

export function WidgetEmptyStateImageSlot({
  brand = "Cars24",
  children,
  className,
  style,
  ...rest
}: WidgetEmptyStateImageSlotProps) {
  const radius = themeNumber(brand, "radius.md");

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        background: FIGMA_DRIVE_PINK_50,
        border: `1px solid ${FIGMA_DRIVE_PINK_400}`,
        borderRadius: pxToRem(radius),
        boxSizing: "border-box",
        display: "flex",
        height: pxToRem(WIDGET_EMPTY_STATE_IMAGE_SLOT_HEIGHT),
        justifyContent: "center",
        overflow: "hidden",
        width: pxToRem(WIDGET_EMPTY_STATE_IMAGE_SLOT_WIDTH),
        ...style
      }}
    >
      {children === undefined ? <WidgetEmptyStatePlaceholderGlyph brand={brand} /> : children}
    </div>
  );
}

export function WidgetEmptyStateCopy({
  brand = "Cars24",
  className,
  description = "Description that can go upto 2 lines of text for long descriptions",
  dynamicLabel = "Dynamic Label",
  showDescription = true,
  showDynamicLabel = true,
  showTitle = true,
  style,
  title = "Title comes here, up to two lines",
  ...rest
}: WidgetEmptyStateCopyProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const primaryTextColor = themeString(brand, "component.sectionHeader.color.light.title");
  const secondaryTextColor = themeString(brand, "component.sectionHeader.color.light.description");
  const regular = themeNumber(brand, "typography.fontWeight.regular");
  const semibold = themeNumber(brand, "typography.fontWeight.semibold");
  const titleFontSize = pxToRem(themeNumber(brand, "component.sectionHeader.typography.title.fontSize"));
  const titleLineHeight = pxToRem(themeNumber(brand, "component.sectionHeader.typography.title.lineHeight"));
  const titleLetterSpacing = pxToRem(themeNumber(brand, "component.sectionHeader.typography.title.letterSpacing"));

  const headingStyles: CSSProperties = {
    ...lineClampStyles(2),
    color: primaryTextColor,
    fontFamily,
    fontSize: titleFontSize,
    fontWeight: semibold,
    letterSpacing: titleLetterSpacing,
    lineHeight: titleLineHeight,
    margin: 0,
    overflowWrap: "anywhere",
    textAlign: "center",
    width: "100%"
  };

  const descriptionStyles: CSSProperties = {
    ...lineClampStyles(2),
    color: secondaryTextColor,
    fontFamily,
    fontSize: FIGMA_LABEL_3_SIZE,
    fontWeight: regular,
    letterSpacing: FIGMA_LABEL_3_LETTER_SPACING,
    lineHeight: FIGMA_LABEL_3_LINE_HEIGHT,
    margin: 0,
    overflowWrap: "anywhere",
    textAlign: "center",
    width: "100%"
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: FIGMA_GAP_8,
        minWidth: 0,
        textAlign: "center",
        width: "100%",
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: FIGMA_GAP_2,
          minWidth: 0,
          width: "100%"
        }}
      >
        {showTitle ? <p style={headingStyles}>{title}</p> : null}
        {showDescription ? <p style={descriptionStyles}>{description}</p> : null}
      </div>
      {showDynamicLabel ? <p style={headingStyles}>{dynamicLabel}</p> : null}
    </div>
  );
}

/**
 * Figma Widget / Empty State composition with a placeholder image slot, compact copy stack, and vertical large actions.
 */
export function WidgetEmptyState({
  brand = "Cars24",
  className,
  description,
  dynamicLabel,
  imageSlot,
  primaryAction,
  secondaryAction,
  showDescription = true,
  showDynamicLabel = true,
  showImageSlot = true,
  showTitle = true,
  style,
  title,
  ...rest
}: WidgetEmptyStateProps) {
  const spacing4 = themeNumber(brand, "spacing.4");
  const spacing6 = themeNumber(brand, "spacing.6");
  const resolvedPrimaryAction =
    primaryAction === undefined ? buildDefaultPrimaryAction(brand) : primaryAction;
  const resolvedSecondaryAction =
    secondaryAction === undefined ? buildDefaultSecondaryAction(brand) : secondaryAction;

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        background: FIGMA_SURFACE_BACKGROUND,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: pxToRem(spacing4),
        maxWidth: "100%",
        padding: `${pxToRem(spacing6)} 0`,
        width: pxToRem(WIDGET_EMPTY_STATE_WIDTH),
        ...style
      }}
    >
      {showImageSlot ? (
        <WidgetEmptyStateImageSlot brand={brand}>{imageSlot}</WidgetEmptyStateImageSlot>
      ) : null}

      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: FIGMA_GAP_16,
          minWidth: 0,
          padding: `0 ${pxToRem(spacing4)}`,
          width: "100%"
        }}
      >
        <WidgetEmptyStateCopy
          brand={brand}
          description={description}
          dynamicLabel={dynamicLabel}
          showDescription={showDescription}
          showDynamicLabel={showDynamicLabel}
          showTitle={showTitle}
          title={title}
        />

        {resolvedPrimaryAction ? (
          <ButtonGroup
            brand={brand}
            primaryAction={withActionVariant(resolvedPrimaryAction, "Solid")}
            shape="Regular"
            size="Large"
            type="Vertical"
            {...(resolvedSecondaryAction
              ? { secondaryAction: withActionVariant(resolvedSecondaryAction, "Ghost") }
              : {})}
          />
        ) : null}
      </div>
    </div>
  );
}
