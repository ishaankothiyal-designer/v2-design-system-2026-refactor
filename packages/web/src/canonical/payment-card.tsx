import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Badge, type BadgeType } from "./badge";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Divider } from "./divider";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";

export const canonicalPaymentCardTypeWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.paymentCardType"
);

export const canonicalPaymentCardWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.paymentCard"
);

export type PaymentPricingState = "Default" | "Positive" | "Negative";
export type PaymentStatus = "Paid" | "Pending" | "Failed";
export type PaymentCardTypeVariant = "List box" | "List card";
export type PaymentCardWidgetType = "List card" | "List box";

export interface PaymentPricingFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  amount?: ReactNode;
  brand?: DisplayBrandId;
  state?: PaymentPricingState;
}

export interface PaymentStatusBadgeProps {
  brand?: DisplayBrandId;
  label?: string;
  status?: PaymentStatus;
  className?: string;
  style?: CSSProperties;
}

export interface PaymentCardTypeData {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  amount?: ReactNode;
  badgeLabel?: string;
  paidLabel?: string;
  statusLabel?: string;
  iconName?: IconName;
  leadingIcon?: ReactNode;
  pricingState?: PaymentPricingState;
  status?: PaymentStatus;
  variant?: PaymentCardTypeVariant;
  showBadge?: boolean;
  showDescription?: boolean;
  showDivider?: boolean;
  showLeadingIcon?: boolean;
  showStatus?: boolean;
}

export interface PaymentCardTypeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "id" | "title">,
    PaymentCardTypeData {
  brand?: DisplayBrandId;
}

export interface PaymentCardItemData extends PaymentCardTypeData {}

export interface PaymentCardItemProps extends PaymentCardTypeProps {}

export interface PaymentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  background?: string;
  brand?: DisplayBrandId;
  showSectionHeader?: boolean;
  type?: PaymentCardWidgetType;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showHeaderAction?: boolean;
  headerActionLabel?: string;
  onHeaderActionClick?: () => void;
  titleIcon?: ReactNode;
  subtitleIcon?: ReactNode;
  items?: PaymentCardItemData[];
  children?: ReactNode;
  showButton?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
}

const DEFAULT_PAYMENT_CARD_ITEMS: PaymentCardItemData[] = Array.from({ length: 4 }, (_, index) => ({
  id: `default-payment-${index + 1}`,
  title: "Title left 15px",
  description: "Description of 13px 2 lines",
  amount: "₹9342",
  badgeLabel: "Badge",
  status: "Paid",
  statusLabel: "Paid"
}));

const PAYMENT_CARD_WIDGET_WIDTH = 360;
const PAYMENT_CARD_ROW_WIDTH = 336;
const PAYMENT_CARD_ICON_TILE_SIZE = 40;
const PAYMENT_CARD_ICON_SIZE = 20;
const PAYMENT_CARD_ICON_TILE_RADIUS = 9;
const PAYMENT_CARD_TITLE_MAX_WIDTH = 164;

const PAYMENT_CARD_AMOUNT_GAP = 2;
const PAYMENT_CARD_TITLE_FONT_SIZE = 15;
const PAYMENT_CARD_TITLE_LINE_HEIGHT = 20;
const PAYMENT_CARD_TITLE_LETTER_SPACING = -0.02;
const PAYMENT_CARD_DESCRIPTION_FONT_SIZE = 12;
const PAYMENT_CARD_DESCRIPTION_LINE_HEIGHT = 16;
const PAYMENT_CARD_DESCRIPTION_LETTER_SPACING = 0;

function getPaymentCardToken(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function getPaymentCardTokenRem(brand: DisplayBrandId, path: string) {
  return pxToRem(Number(getRequiredThemeTokenValue(brand, path)));
}

function getPaymentCardColors(brand: DisplayBrandId) {
  return {
    brandIcon: getPaymentCardToken(brand, "color.brand.primary.500"),
    brandSubtle: getPaymentCardToken(brand, "color.brand.primary.50"),
    border: getPaymentCardToken(brand, "component.divider.color.line"),
    danger: getPaymentCardToken(brand, "component.textInput.color.field.error.border"),
    secondaryText: getPaymentCardToken(brand, "component.sectionHeader.color.light.description"),
    success: getPaymentCardToken(brand, "component.textInput.color.field.success.border"),
    surface: getPaymentCardToken(brand, "color.surface.canvas"),
    text: getPaymentCardToken(brand, "component.sectionHeader.color.light.title")
  };
}

function getPaymentCardRowVariant(type: PaymentCardWidgetType): PaymentCardTypeVariant {
  return type === "List card" ? "List box" : "List card";
}

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  {
    badgeType: BadgeType;
    iconName: IconName;
    label: string;
  }
> = {
  Failed: {
    badgeType: "Error",
    iconName: "cross-large-filled",
    label: "Failed"
  },
  Paid: {
    badgeType: "Success",
    iconName: "circle-check-filled",
    label: "Paid"
  },
  Pending: {
    badgeType: "Warning",
    iconName: "error-filled",
    label: "Pending"
  }
};

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function formatAmountForState(amount: ReactNode, state: PaymentPricingState) {
  if (typeof amount !== "string") {
    return amount;
  }

  if (state === "Positive" && !amount.trim().startsWith("+")) {
    return `+ ${amount}`;
  }

  if (state === "Negative" && !amount.trim().startsWith("-")) {
    return `- ${amount}`;
  }

  return amount;
}

function ellipsisStyles(): CSSProperties {
  return {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };
}

export function PaymentPricingFlow({
  amount = "₹9342",
  brand = "Cars24",
  className,
  state = "Default",
  style,
  ...rest
}: PaymentPricingFlowProps) {
  const colors = getPaymentCardColors(brand);
  const amountColor =
    state === "Positive" ? colors.success : state === "Negative" ? colors.danger : colors.text;

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "flex-end",
        display: "flex",
        flexDirection: "column",
        gap: pxToRem(PAYMENT_CARD_AMOUNT_GAP),
        ...style
      }}
    >
      <p
        style={{
          color: amountColor,
          fontFamily: `${getPaymentCardToken(brand, "typography.fontFamily.sans")}, sans-serif`,
          fontSize: pxToRem(PAYMENT_CARD_TITLE_FONT_SIZE),
          fontWeight: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold")),
          letterSpacing: pxToRem(PAYMENT_CARD_TITLE_LETTER_SPACING),
          lineHeight: pxToRem(PAYMENT_CARD_TITLE_LINE_HEIGHT),
          margin: 0,
          textAlign: "right",
          whiteSpace: "nowrap"
        }}
      >
        {formatAmountForState(amount, state)}
      </p>
    </div>
  );
}

export function PaymentStatusBadge({
  brand = "Cars24",
  label,
  status = "Paid",
  className,
  style
}: PaymentStatusBadgeProps) {
  const statusConfig = PAYMENT_STATUS_CONFIG[status];

  return (
    <Badge
      brand={brand}
      labelText={label ?? statusConfig.label}
      leadingIcon={<Icon brand={brand} decorative name={statusConfig.iconName} />}
      pillShape="No"
      priority="Low"
      showLeadingIcon
      showTrailingIcon={false}
      size="Extra Small"
      type={statusConfig.badgeType}
      {...(className ? { className } : {})}
      {...(style ? { style } : {})}
    />
  );
}

function PaymentCardLeadingIcon({
  brand,
  iconName,
  leadingIcon
}: {
  brand: DisplayBrandId;
  iconName: IconName;
  leadingIcon?: ReactNode;
}) {
  const colors = getPaymentCardColors(brand);

  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "center",
        background: colors.brandSubtle,
        borderRadius: pxToRem(PAYMENT_CARD_ICON_TILE_RADIUS),
        color: colors.brandIcon,
        display: "inline-flex",
        flexShrink: 0,
        height: pxToRem(PAYMENT_CARD_ICON_TILE_SIZE),
        justifyContent: "center",
        overflow: "hidden",
        width: pxToRem(PAYMENT_CARD_ICON_TILE_SIZE)
      }}
    >
      {leadingIcon ?? (
        <Icon
          brand={brand}
          decorative
          name={iconName}
          style={{
            color: "inherit",
            fontSize: pxToRem(PAYMENT_CARD_ICON_SIZE),
            height: pxToRem(PAYMENT_CARD_ICON_SIZE),
            width: pxToRem(PAYMENT_CARD_ICON_SIZE)
          }}
        />
      )}
    </span>
  );
}

/**
 * Reusable Figma `.Payment card type` row, covering the List box and List card variants.
 */
export function PaymentCardType({
  brand = "Cars24",
  title = "Title left 15px",
  description = "Description of 13px 2 lines",
  amount = "₹9342",
  badgeLabel = "Badge",
  paidLabel,
  statusLabel,
  iconName = "full-screen-focus-outline",
  leadingIcon,
  pricingState = "Default",
  status = "Paid",
  variant = "List box",
  showBadge = true,
  showDescription = true,
  showDivider = true,
  showLeadingIcon = true,
  showStatus = true,
  className,
  style,
  ...rest
}: PaymentCardTypeProps) {
  const isListCard = variant === "List card";
  const resolvedStatusLabel = statusLabel ?? paidLabel;
  const colors = getPaymentCardColors(brand);
  const fontFamily = `${getPaymentCardToken(brand, "typography.fontFamily.sans")}, sans-serif`;
  const regularFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const semiboldFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const gap4 = getPaymentCardTokenRem(brand, "spacing.1");
  const gap8 = getPaymentCardTokenRem(brand, "spacing.2");
  const gap12 = getPaymentCardTokenRem(brand, "spacing.3");
  const radiusMd = getPaymentCardTokenRem(brand, "radius.alt.md");

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: colors.surface,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
    ...(isListCard
      ? {
          border: `1px solid ${colors.border}`,
          borderRadius: radiusMd
        }
      : {}),
    ...style
  };

  const rowStyles: CSSProperties = {
    alignItems: "center",
    background: colors.surface,
    boxSizing: "border-box",
    display: "flex",
    gap: gap8,
    minWidth: 0,
    padding: isListCard ? gap12 : `${gap12} 0`,
    width: "100%"
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 0",
    gap: gap8,
    minWidth: 0
  };

  const textColumnStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flex: "1 1 0",
    flexDirection: "column",
    gap: gap4,
    minHeight: pxToRem(40),
    minWidth: 0
  };

  const titleRowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: gap4,
    minWidth: 0,
    width: "100%"
  };

  const titleStyles: CSSProperties = {
    ...ellipsisStyles(),
    color: colors.text,
    flexShrink: 1,
    fontFamily,
    fontSize: pxToRem(PAYMENT_CARD_TITLE_FONT_SIZE),
    fontWeight: semiboldFontWeight,
    letterSpacing: pxToRem(PAYMENT_CARD_TITLE_LETTER_SPACING),
    lineHeight: pxToRem(PAYMENT_CARD_TITLE_LINE_HEIGHT),
    margin: 0,
    ...(isListCard ? {} : { maxWidth: pxToRem(PAYMENT_CARD_TITLE_MAX_WIDTH) })
  };

  const descriptionStyles: CSSProperties = {
    ...ellipsisStyles(),
    color: colors.secondaryText,
    fontFamily,
    fontSize: pxToRem(PAYMENT_CARD_DESCRIPTION_FONT_SIZE),
    fontWeight: regularFontWeight,
    letterSpacing: pxToRem(PAYMENT_CARD_DESCRIPTION_LETTER_SPACING),
    lineHeight: pxToRem(PAYMENT_CARD_DESCRIPTION_LINE_HEIGHT),
    margin: 0,
    width: "100%"
  };

  const amountColumnStyles: CSSProperties = {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    gap: pxToRem(PAYMENT_CARD_AMOUNT_GAP),
    justifyContent: "center"
  };

  return (
    <div {...rest} className={className} data-brand={brand} data-variant={variant} style={rootStyles}>
      <div style={rowStyles}>
        {showLeadingIcon ? (
          <PaymentCardLeadingIcon brand={brand} iconName={iconName} leadingIcon={leadingIcon} />
        ) : null}

        <div style={contentStyles}>
          <div style={textColumnStyles}>
            <div style={titleRowStyles}>
              <p style={titleStyles}>{title}</p>
              {showBadge ? (
                <Badge
                  brand={brand}
                  labelText={badgeLabel}
                  pillShape="No"
                  priority="Medium"
                  showLeadingIcon={false}
                  showTrailingIcon={false}
                  size="Extra Small"
                  type="Drive pink"
                />
              ) : null}
            </div>
            {showDescription ? <p style={descriptionStyles}>{description}</p> : null}
          </div>

          <div style={amountColumnStyles}>
            <PaymentPricingFlow amount={amount} brand={brand} state={pricingState} />
            {showStatus ? (
              <PaymentStatusBadge
                brand={brand}
                status={status}
                {...(resolvedStatusLabel !== undefined ? { label: resolvedStatusLabel } : {})}
              />
            ) : null}
          </div>
        </div>
      </div>

      {!isListCard && showDivider ? (
        <Divider brand={brand} labelPosition="None" thickness="Thin" style={{ width: "100%" }} />
      ) : null}
    </div>
  );
}

export function PaymentCardItem(props: PaymentCardItemProps) {
  return <PaymentCardType {...props} />;
}

/**
 * Payment card (NBFC) widget that composes the approved section header, repeated payment rows, and optional CTA.
 */
export function PaymentCard({
  background,
  brand = "Cars24",
  showSectionHeader = true,
  type = "List card",
  title = "Section title",
  subtitle = "Section title line 2",
  description = "Description goes here upto 2 lines",
  tagLabel = "New",
  showTag = true,
  showHeaderAction = true,
  headerActionLabel = "View all",
  onHeaderActionClick,
  titleIcon,
  subtitleIcon,
  items,
  children,
  showButton = true,
  primaryAction,
  className,
  style,
  ...rest
}: PaymentCardProps) {
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction(brand) : primaryAction;
  const resolvedItems = items ?? DEFAULT_PAYMENT_CARD_ITEMS;
  const colors = getPaymentCardColors(brand);
  const gap12 = getPaymentCardTokenRem(brand, "spacing.3");
  const radiusMd = getPaymentCardTokenRem(brand, "radius.alt.md");
  const isEnclosedList = type === "List card";
  const rowVariant = getPaymentCardRowVariant(type);

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: background || colors.surface,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: gap12,
    justifyContent: "center",
    maxWidth: "100%",
    overflow: "hidden",
    padding: gap12,
    width: pxToRem(PAYMENT_CARD_WIDGET_WIDTH),
    ...style
  };

  const rowsStyles: CSSProperties = {
    alignItems: "stretch",
    background: colors.surface,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    width: pxToRem(PAYMENT_CARD_ROW_WIDTH),
    ...(isEnclosedList
      ? {
          border: `1px solid ${colors.border}`,
          borderRadius: radiusMd,
          overflow: "hidden"
        }
      : {
          gap: gap12,
          overflow: "visible"
        })
  };

  return (
    <div {...rest} className={className} data-brand={brand} data-type={type} style={rootStyles}>
      {showSectionHeader ? (
        <SectionHeader
          actionLabel={headerActionLabel}
          brand={brand}
          description={description}
          showAction={showHeaderAction}
          showDescription={Boolean(description)}
          showSubtitle={Boolean(subtitle)}
          showTag={showTag}
          subtitle={subtitle}
          subtitleIcon={subtitleIcon}
          tagLabel={tagLabel}
          title={title}
          titleIcon={titleIcon}
          {...(onHeaderActionClick ? { onActionClick: onHeaderActionClick } : {})}
        />
      ) : null}

      <div data-brand={brand} data-type={type} style={rowsStyles}>
        {children ??
          resolvedItems.map((item, index) => {
            const resolvedVariant = item.variant ?? rowVariant;

            return (
              <PaymentCardType
                key={item.id ?? `payment-card-type-${index + 1}`}
                {...item}
                brand={brand}
                showDivider={item.showDivider ?? resolvedVariant === "List box"}
                variant={resolvedVariant}
              />
            );
          })}
      </div>

      {showButton && resolvedPrimaryAction ? (
        <ButtonGroup
          brand={brand}
          onDark={false}
          primaryAction={resolvedPrimaryAction}
          shape="Regular"
          size="Large"
          type="Vertical"
        />
      ) : null}
    </div>
  );
}
