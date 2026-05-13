import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { AddressStatus, type AddressStatusType } from "./address-status";
import { Button, type ButtonProps } from "./button";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { HomeIndicator } from "./home-indicator";
import { Icon } from "./icon";

export const canonicalLocatorWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.locator"
);

export interface LocatorChangeAction
  extends Omit<ButtonProps, "brand" | "children" | "onDark" | "shape" | "size" | "styleVariant"> {
  label: ReactNode;
}

export interface LocatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  addressDescription?: ReactNode;
  addressIcon?: ReactNode;
  addressIconName?: IconName;
  addressTitle?: ReactNode;
  brand?: DisplayBrandId;
  changeAction?: LocatorChangeAction | null;
  primaryAction?: ButtonGroupButtonAction | null;
  showAddressIcon?: boolean;
  showHomeIndicator?: boolean;
  statusMessage?: ReactNode;
  statusType?: AddressStatusType;
}

const LOCATOR_WIDTH = 360;
const LOCATOR_ADDRESS_BLOCK_HEIGHT = "116px";
const LOCATOR_ACTION_BAR_HEIGHT = 96;
const LOCATOR_ADDRESS_ICON_SIZE = 18;

const FIGMA_BG_PRIMARY = "var(--cars24-semantic-bg-primary, #FFFFFF)";
const FIGMA_BORDER_TERTIARY = "var(--cars24-semantic-border-tertiary, #94A3B8)";
const FIGMA_GAP_4 = "var(--cars24-misc-gap-4, 4px)";
const FIGMA_GAP_8 = "var(--cars24-misc-gap-8, 8px)";
const FIGMA_GAP_12 = "var(--cars24-misc-gap-12, 12px)";
const FIGMA_GAP_16 = "var(--cars24-misc-gap-16, 16px)";
const FIGMA_GAP_20 = "var(--cars24-misc-gap-20, 20px)";
const FIGMA_GAP_36 = "var(--cars24-misc-gap-36, 36px)";
const FIGMA_RADIUS_XL = "var(--cars24-theme-radius-xl, 16px)";
const FIGMA_RADIUS_XXL = "var(--cars24-theme-radius-xxl, 20px)";
const FIGMA_TEXT_PRIMARY = "var(--cars24-semantic-text-primary, #020617)";
const FIGMA_TEXT_SECONDARY = "var(--cars24-semantic-text-secondary, #64748B)";
const FIGMA_HOME_INDICATOR = "var(--cars24-semantic-bg-primary-inverse-hover, #171717)";
const FIGMA_HEADLINE_H4_SIZE = "var(--cars24-typography-size-headline-h4, 15px)";
const FIGMA_HEADLINE_H4_LINE_HEIGHT = "var(--cars24-typography-line-height-headline-h4, 20px)";
const FIGMA_HEADLINE_H4_LETTER_SPACING = "var(--cars24-typography-letter-spacing-headline-h4, -0.02px)";
const FIGMA_BODY_3_SIZE = "var(--cars24-typography-size-paragraph-body-3, 12px)";
const FIGMA_BODY_3_LINE_HEIGHT = "var(--cars24-typography-line-height-paragraph-body-3, 18px)";
const FIGMA_BODY_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-paragraph-body-3, 0px)";

const DEFAULT_ADDRESS =
  "Flat No. 1203, Tower C, Central Park Resorts, Sector 48, Sohna Road, Gurugram, Haryana - 122018, Near Medanta Hospital, Opposite Omaxe Celebration Mall";

function toRem(value: number) {
  return pxToRem(value);
}

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    styleVariant: "Solid",
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function buildDefaultChangeAction() {
  return {
    label: "Change"
  } satisfies LocatorChangeAction;
}

function renderAddressIcon({
  addressIcon,
  addressIconName,
  brand,
  showAddressIcon
}: {
  addressIcon: ReactNode;
  addressIconName: IconName;
  brand: DisplayBrandId;
  showAddressIcon: boolean;
}) {
  if (!showAddressIcon) {
    return null;
  }

  if (addressIcon !== undefined) {
    return addressIcon;
  }

  return (
    <Icon
      brand={brand}
      decorative
      name={addressIconName}
      style={{
        color: FIGMA_BORDER_TERTIARY,
        flex: "0 0 auto",
        fontSize: toRem(LOCATOR_ADDRESS_ICON_SIZE),
        height: toRem(LOCATOR_ADDRESS_ICON_SIZE),
        width: toRem(LOCATOR_ADDRESS_ICON_SIZE)
      }}
    />
  );
}

function LocatorChangeButton({
  action,
  brand
}: {
  action: LocatorChangeAction;
  brand: DisplayBrandId;
}) {
  const {
    label,
    style,
    type,
    ...buttonProps
  } = action;

  return (
    <Button
      {...buttonProps}
      brand={brand}
      onDark={false}
      shape="Regular"
      size="Extra Small"
      style={{
        minWidth: "auto",
        paddingBlock: "var(--cars24-misc-gap-6, 6px)",
        paddingInline: FIGMA_GAP_12,
        width: "fit-content",
        ...style
      }}
      styleVariant="Outline"
      type={type ?? "button"}
    >
      {label}
    </Button>
  );
}

/**
 * Locator widget for showing inspection address availability, selected address, and the next action.
 */
export function Locator({
  addressDescription = DEFAULT_ADDRESS,
  addressIcon,
  addressIconName = "map-pin-flat-route-outline",
  addressTitle = "Address header",
  brand = "Cars24",
  changeAction,
  className,
  primaryAction,
  showAddressIcon = true,
  showHomeIndicator = true,
  statusMessage,
  statusType = "Default",
  style,
  ...rest
}: LocatorProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const semibold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const regular = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const resolvedChangeAction = changeAction === undefined ? buildDefaultChangeAction() : changeAction;
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction(brand) : primaryAction;

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: FIGMA_BG_PRIMARY,
    borderTopLeftRadius: FIGMA_RADIUS_XL,
    borderTopRightRadius: FIGMA_RADIUS_XL,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "100%",
    overflow: "hidden",
    width: toRem(LOCATOR_WIDTH),
    ...style
  };

  const addressContainerStyles: CSSProperties = {
    alignItems: "flex-start",
    boxSizing: "border-box",
    display: "flex",
    gap: FIGMA_GAP_8,
    height: LOCATOR_ADDRESS_BLOCK_HEIGHT,
    padding: `${FIGMA_GAP_12} ${FIGMA_GAP_12} ${FIGMA_GAP_8}`,
    width: "100%"
  };

  const addressContentStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flex: "1 1 0",
    gap: FIGMA_GAP_4,
    minWidth: 0
  };

  const addressTextStackStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flex: "1 1 0",
    flexDirection: "column",
    gap: FIGMA_GAP_4,
    justifyContent: "center",
    minWidth: 0
  };

  const titleStyles: CSSProperties = {
    color: FIGMA_TEXT_PRIMARY,
    fontFamily,
    fontSize: FIGMA_HEADLINE_H4_SIZE,
    fontWeight: semibold,
    letterSpacing: FIGMA_HEADLINE_H4_LETTER_SPACING,
    lineHeight: FIGMA_HEADLINE_H4_LINE_HEIGHT,
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  };

  const descriptionStyles: CSSProperties = {
    color: FIGMA_TEXT_SECONDARY,
    display: "block",
    fontFamily,
    fontSize: FIGMA_BODY_3_SIZE,
    fontWeight: regular,
    letterSpacing: FIGMA_BODY_3_LETTER_SPACING,
    lineHeight: FIGMA_BODY_3_LINE_HEIGHT,
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%"
  };

  const actionBarStyles: CSSProperties = {
    background: FIGMA_BG_PRIMARY,
    boxSizing: "border-box",
    height: toRem(LOCATOR_ACTION_BAR_HEIGHT),
    position: "relative",
    width: "100%"
  };

  const actionAreaStyles: CSSProperties = {
    boxSizing: "border-box",
    padding: `${FIGMA_GAP_16} ${FIGMA_GAP_16} ${FIGMA_GAP_36}`,
    position: "relative",
    width: "100%",
    zIndex: 1
  };

  return (
    <div {...rest} className={className} data-brand={brand} style={rootStyles}>
      <AddressStatus brand={brand} message={statusMessage} type={statusType} />

      <div style={addressContainerStyles}>
        <div style={addressContentStyles}>
          {renderAddressIcon({ addressIcon, addressIconName, brand, showAddressIcon })}
          <div style={addressTextStackStyles}>
            <p style={titleStyles}>{addressTitle}</p>
            <p style={descriptionStyles}>{addressDescription}</p>
          </div>
        </div>

        {resolvedChangeAction ? <LocatorChangeButton action={resolvedChangeAction} brand={brand} /> : null}
      </div>

      <div style={actionBarStyles}>
        {resolvedPrimaryAction ? (
          <div style={actionAreaStyles}>
            <ButtonGroup
              brand={brand}
              onDark={false}
              primaryAction={resolvedPrimaryAction}
              shape="Regular"
              size="Large"
              type="Vertical"
            />
          </div>
        ) : null}

        {showHomeIndicator ? (
          <HomeIndicator
            brand={brand}
            style={{
              bottom: 0,
              left: 0,
              padding: `${FIGMA_GAP_20} 0 ${FIGMA_GAP_8}`,
              position: "absolute",
              right: 0
            }}
            handleStyle={{
              background: FIGMA_HOME_INDICATOR,
              borderRadius: FIGMA_RADIUS_XXL
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
