import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ActionBar, type ActionBarAction, type ActionBarButtonAction } from "./action-bar";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalDialogPopupWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.dialogPopup"
);

export type DialogPopupType = "With Header" | "Without Header";

export interface DialogPopupPlaceholderSlotProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
}

export interface DialogPopupHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  closeLabel?: string;
  heading?: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  subHeading?: ReactNode;
  subHeadingVisibility?: boolean;
}

export interface DialogPopupActionTrayProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  primaryAction?: ActionBarButtonAction | null;
  secondaryAction?: ActionBarButtonAction | null;
}

export interface DialogPopupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  actionTrayStyle?: CSSProperties;
  brand?: DisplayBrandId;
  children?: ReactNode;
  closeLabel?: string;
  cta?: boolean;
  heading?: ReactNode;
  onClose?: () => void;
  overlayStyle?: CSSProperties;
  primaryAction?: ActionBarButtonAction | null;
  secondaryAction?: ActionBarButtonAction | null;
  showCloseButton?: boolean;
  slotStyle?: CSSProperties;
  subHeading?: ReactNode;
  subHeadingVisibility?: boolean;
  surfaceStyle?: CSSProperties;
  type?: DialogPopupType;
}

const FIGMA_OVERLAY_BACKGROUND = "var(--cars24-utility-alpha-black-400, rgba(26, 26, 26, 0.36))";
const FIGMA_SURFACE_BACKGROUND = "var(--cars24-semantic-bg-primary, #FFFFFF)";
const FIGMA_TEXT_PRIMARY = "var(--cars24-semantic-text-primary, #020617)";
const FIGMA_TEXT_SECONDARY = "var(--cars24-semantic-text-secondary, #64748B)";
const FIGMA_DRIVE_PINK_50 = "var(--cars24-primitive-drive-pink-50, #FFE8F7)";
const FIGMA_DRIVE_PINK_500 = "var(--cars24-primitive-drive-pink-500, #FC1CB0)";
const FIGMA_GAP_NONE = "var(--cars24-misc-gap-none, 0px)";
const FIGMA_GAP_8 = "var(--cars24-misc-gap-8, 8px)";
const FIGMA_GAP_12 = "var(--cars24-misc-gap-12, 12px)";
const FIGMA_FONT_FAMILY_PRIMARY = "var(--cars24-theme-font-family-primary, Geist, sans-serif)";
const FIGMA_FONT_WEIGHT_REGULAR = "var(--cars24-theme-font-weight-regular, 400)";
const FIGMA_FONT_WEIGHT_SEMIBOLD = "var(--cars24-theme-font-weight-semibold, 600)";
const FIGMA_HEADLINE_H4_SIZE = "var(--cars24-typography-size-headline-h4, 15px)";
const FIGMA_HEADLINE_H4_LINE_HEIGHT = "var(--cars24-typography-line-height-headline-h4, 20px)";
const FIGMA_HEADLINE_H4_LETTER_SPACING = "var(--cars24-typography-letter-spacing-headline-h4, -0.02px)";
const FIGMA_LABEL_3_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const FIGMA_LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const FIGMA_LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";

function toPx(value: number) {
  return pxToRem(value);
}

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />,
    styleVariant: "Solid"
  } satisfies ActionBarButtonAction;
}

function buildDefaultSecondaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />,
    styleVariant: "Outline"
  } satisfies ActionBarButtonAction;
}

export function DialogPopupPlaceholderSlot({
  brand = "Cars24",
  className,
  style,
  ...rest
}: DialogPopupPlaceholderSlotProps) {
  const iconSize = Number(getRequiredThemeTokenValue(brand, "spacing.12"));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: FIGMA_DRIVE_PINK_50,
    display: "flex",
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
    ...style
  };

  return (
    <div {...rest} aria-hidden="true" className={className} style={rootStyles}>
      <Icon
        brand={brand}
        decorative
        name="square-plus-add-outline"
        style={{
          color: FIGMA_DRIVE_PINK_500,
          fontSize: toPx(iconSize),
          height: toPx(iconSize),
          width: toPx(iconSize)
        }}
      />
    </div>
  );
}

export function DialogPopupHeader({
  brand = "Cars24",
  closeLabel = "Close dialog",
  heading = "Heading 15px",
  onClose,
  showCloseButton = true,
  subHeading = "Sub heading 12px",
  subHeadingVisibility = true,
  className,
  style,
  ...rest
}: DialogPopupHeaderProps) {
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const headerHeight = 60;

  const rootStyles: CSSProperties = {
    alignItems: "flex-start",
    background: FIGMA_SURFACE_BACKGROUND,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: FIGMA_GAP_8,
    height: toPx(headerHeight),
    justifyContent: "center",
    padding: FIGMA_GAP_12,
    width: "100%",
    ...style
  };

  const rowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: FIGMA_GAP_8,
    width: "100%"
  };

  const textColumnStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flex: "1 1 0",
    flexDirection: "column",
    gap: FIGMA_GAP_NONE,
    justifyContent: "center",
    minWidth: 0,
    whiteSpace: "nowrap"
  };

  const headingStyles: CSSProperties = {
    color: FIGMA_TEXT_PRIMARY,
    fontFamily: `${fontFamily}, ${FIGMA_FONT_FAMILY_PRIMARY}`,
    fontSize: FIGMA_HEADLINE_H4_SIZE,
    fontWeight: FIGMA_FONT_WEIGHT_SEMIBOLD,
    letterSpacing: FIGMA_HEADLINE_H4_LETTER_SPACING,
    lineHeight: FIGMA_HEADLINE_H4_LINE_HEIGHT,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  };

  const subHeadingStyles: CSSProperties = {
    color: FIGMA_TEXT_SECONDARY,
    fontFamily: `${fontFamily}, ${FIGMA_FONT_FAMILY_PRIMARY}`,
    fontSize: FIGMA_LABEL_3_SIZE,
    fontWeight: FIGMA_FONT_WEIGHT_REGULAR,
    letterSpacing: FIGMA_LABEL_3_LETTER_SPACING,
    lineHeight: FIGMA_LABEL_3_LINE_HEIGHT,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={rowStyles}>
        <div style={textColumnStyles}>
          <p style={headingStyles}>{heading}</p>
          {subHeadingVisibility ? <p style={subHeadingStyles}>{subHeading}</p> : null}
        </div>
        {showCloseButton ? (
          <IconButton
            aria-label={closeLabel}
            brand={brand}
            icon={<Icon brand={brand} decorative name="cross-small-outline" />}
            onClick={onClose}
            shape="Round"
            size="XSmall"
            styleVariant="Transparent"
          />
        ) : null}
      </div>
    </div>
  );
}

export function DialogPopupActionTray({
  brand = "Cars24",
  primaryAction,
  secondaryAction,
  className,
  style,
  ...rest
}: DialogPopupActionTrayProps) {
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction(brand) : primaryAction;
  const resolvedSecondaryAction = secondaryAction === undefined ? buildDefaultSecondaryAction(brand) : secondaryAction;

  if (!resolvedPrimaryAction) {
    return null;
  }

  const action = {
    variant: "Button Group",
    buttonGroupType: "Horizontal",
    primaryAction: resolvedPrimaryAction,
    ...(resolvedSecondaryAction ? { secondaryAction: resolvedSecondaryAction } : {})
  } satisfies ActionBarAction;

  return (
    <ActionBar
      {...rest}
      action={action}
      brand={brand}
      className={className}
      divider={false}
      showHomeIndicator={false}
      style={style}
    />
  );
}

/**
 * Mobile dialog popup widget with optional header, content slot, close affordance, and bottom CTA tray.
 */
export function DialogPopup({
  actionTrayStyle,
  brand = "Cars24",
  children,
  className,
  closeLabel = "Close dialog",
  cta = true,
  heading = "Heading 15px",
  onClose,
  overlayStyle,
  primaryAction,
  secondaryAction,
  showCloseButton = true,
  slotStyle,
  style,
  subHeading = "Sub heading 12px",
  subHeadingVisibility = true,
  surfaceStyle,
  type = "With Header",
  ...rest
}: DialogPopupProps) {
  const surfaceWidth = 312;
  const slotHeight = 200;
  const overlayWidth = 360;
  const overlayHeight = 800;
  const surfaceRadius = Number(getRequiredThemeTokenValue(brand, "radius.xl"));
  const hasHeader = type === "With Header";

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: FIGMA_OVERLAY_BACKGROUND,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: toPx(overlayHeight),
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: toPx(overlayWidth),
    ...overlayStyle,
    ...style
  };

  const surfaceStyles: CSSProperties = {
    alignItems: "stretch",
    background: FIGMA_SURFACE_BACKGROUND,
    borderRadius: toPx(surfaceRadius),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
    width: toPx(surfaceWidth),
    ...surfaceStyle
  };

  const slotStyles: CSSProperties = {
    background: FIGMA_DRIVE_PINK_50,
    flexShrink: 0,
    height: toPx(slotHeight),
    overflow: "hidden",
    position: "relative",
    width: "100%",
    ...slotStyle
  };

  const floatingCloseStyles: CSSProperties = {
    position: "absolute",
    right: toPx(Number(getRequiredThemeTokenValue(brand, "spacing.3"))),
    top: toPx(Number(getRequiredThemeTokenValue(brand, "spacing.3"))),
    zIndex: 1
  };

  return (
    <div {...rest} className={className} data-dialog-popup-type={type} style={rootStyles}>
      <div style={surfaceStyles}>
        {hasHeader ? (
          <DialogPopupHeader
            brand={brand}
            closeLabel={closeLabel}
            heading={heading}
            showCloseButton={showCloseButton}
            subHeading={subHeading}
            subHeadingVisibility={subHeadingVisibility}
            {...(onClose ? { onClose } : {})}
          />
        ) : null}

        <div style={slotStyles}>
          {!hasHeader && showCloseButton ? (
            <IconButton
              aria-label={closeLabel}
              brand={brand}
              icon={<Icon brand={brand} decorative name="cross-small-outline" />}
              onClick={onClose}
              onDark
              shape="Round"
              size="Small"
              style={floatingCloseStyles}
              styleVariant="Solid - Primary"
            />
          ) : null}
          {children ?? <DialogPopupPlaceholderSlot brand={brand} />}
        </div>

        {cta ? (
          <DialogPopupActionTray
            brand={brand}
            {...(primaryAction !== undefined ? { primaryAction } : {})}
            {...(secondaryAction !== undefined ? { secondaryAction } : {})}
            {...(actionTrayStyle ? { style: actionTrayStyle } : {})}
          />
        ) : null}
      </div>
    </div>
  );
}
