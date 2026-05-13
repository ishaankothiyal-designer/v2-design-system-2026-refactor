import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Badge } from "./badge";
import { Divider } from "./divider";
import { Icon } from "./icon";

export const canonicalInvoiceItemWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.invoiceItem"
);

export type InvoiceItemType = "Bill item" | "Header" | "Footer text";

export interface InvoiceItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  type?: InvoiceItemType;
  label?: ReactNode;
  amount?: ReactNode;
  descriptionText?: ReactNode;
  strikeOutAmount?: ReactNode;
  badgeLabel?: string;
  refundableBadgeLabel?: string;
  freeBadgeLabel?: string;
  clickableItem?: boolean;
  showBadge?: boolean;
  showDescription?: boolean;
  showFreeBadge?: boolean;
  showInfoIcon?: boolean;
  showPricing?: boolean;
  showRefundableBadge?: boolean;
  showStrikeOutPrice?: boolean;
}

const FIGMA_TEXT_PRIMARY = "var(--cars24-semantic-text-primary, #020617)";
const FIGMA_TEXT_PRIMARY_INVERSE = "var(--cars24-semantic-text-primary-inverse, #FFFFFF)";
const FIGMA_TEXT_SECONDARY = "var(--cars24-semantic-text-secondary, #64748B)";
const FIGMA_TEXT_TERTIARY = "var(--cars24-semantic-text-tertiary, #94A3B8)";
const FIGMA_SUCCESS_BACKGROUND = "var(--cars24-semantic-bg-success-base, #1C9C1C)";
const FIGMA_SUCCESS_SUBTLE_BACKGROUND = "var(--cars24-semantic-bg-success-subtle, #E4F9E0)";
const FIGMA_SUCCESS_TEXT = "var(--cars24-semantic-text-success-base, #1C9C1C)";
const FIGMA_GAP_2 = "var(--cars24-misc-gap-2, 2px)";
const FIGMA_GAP_4 = "var(--cars24-misc-gap-4, 4px)";
const FIGMA_GAP_8 = "var(--cars24-misc-gap-8, 8px)";
const FIGMA_GAP_24 = "var(--cars24-misc-gap-24, 24px)";
const FIGMA_SPACING_4 = "var(--lego-spacing-4, 4px)";
const FIGMA_HEADLINE_H4_SIZE = "var(--cars24-typography-size-headline-h4, 15px)";
const FIGMA_HEADLINE_H4_LINE_HEIGHT = "var(--cars24-typography-line-height-headline-h4, 20px)";
const FIGMA_HEADLINE_H4_LETTER_SPACING = "var(--cars24-typography-letter-spacing-headline-h4, -0.02px)";
const FIGMA_LABEL_2_SIZE = "var(--cars24-typography-size-utility-label-2, 14px)";
const FIGMA_LABEL_2_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-2, 18px)";
const FIGMA_LABEL_2_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-2, 0px)";
const FIGMA_LABEL_4_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const FIGMA_LABEL_4_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-4, 14px)";
const FIGMA_LABEL_4_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-4, 0px)";

function fontFamily(brand: DisplayBrandId) {
  return `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
}

function fontWeight(brand: DisplayBrandId, weight: "regular" | "medium" | "semibold") {
  return Number(getRequiredThemeTokenValue(brand, `typography.fontWeight.${weight}`));
}

function getDefaultLabel(type: InvoiceItemType) {
  if (type === "Header") {
    return "Section Heading";
  }

  if (type === "Footer text") {
    return "Total";
  }

  return "Bill item name";
}

function getDefaultAmount(type: InvoiceItemType) {
  return type === "Footer text" ? "₹7,95,100" : "₹7,100";
}

function getLabel2Styles(brand: DisplayBrandId, color = FIGMA_TEXT_SECONDARY): CSSProperties {
  return {
    color,
    fontFamily: fontFamily(brand),
    fontSize: FIGMA_LABEL_2_SIZE,
    fontWeight: fontWeight(brand, "medium"),
    letterSpacing: FIGMA_LABEL_2_LETTER_SPACING,
    lineHeight: FIGMA_LABEL_2_LINE_HEIGHT,
    margin: 0
  };
}

function getHeadingStyles(brand: DisplayBrandId, align: "left" | "right" = "left"): CSSProperties {
  return {
    color: FIGMA_TEXT_PRIMARY,
    fontFamily: fontFamily(brand),
    fontSize: FIGMA_HEADLINE_H4_SIZE,
    fontWeight: fontWeight(brand, "semibold"),
    letterSpacing: FIGMA_HEADLINE_H4_LETTER_SPACING,
    lineHeight: FIGMA_HEADLINE_H4_LINE_HEIGHT,
    margin: 0,
    textAlign: align,
    whiteSpace: "nowrap"
  };
}

function InvoiceStatusBadge({
  brand,
  label,
  tone
}: {
  brand: DisplayBrandId;
  label: string;
  tone: "high" | "low";
}) {
  return (
    <Badge
      brand={brand}
      labelText={label}
      pillShape="No"
      priority={tone === "high" ? "High" : "Low"}
      showLeadingIcon={false}
      showTrailingIcon={false}
      size="Extra Small"
      type="Success"
      style={{
        backgroundColor: tone === "high" ? FIGMA_SUCCESS_BACKGROUND : FIGMA_SUCCESS_SUBTLE_BACKGROUND,
        color: tone === "high" ? FIGMA_TEXT_PRIMARY_INVERSE : FIGMA_SUCCESS_TEXT,
        flex: "0 0 auto"
      }}
    />
  );
}

function InvoiceBillItem({
  amount,
  badgeLabel,
  brand,
  clickableItem,
  descriptionText,
  label,
  showBadge,
  showDescription,
  showInfoIcon,
  showPricing,
  showStrikeOutPrice,
  strikeOutAmount
}: Required<Pick<InvoiceItemProps, "brand">> &
  Pick<
    InvoiceItemProps,
    | "amount"
    | "badgeLabel"
    | "clickableItem"
    | "descriptionText"
    | "label"
    | "showBadge"
    | "showDescription"
    | "showInfoIcon"
    | "showPricing"
    | "showStrikeOutPrice"
    | "strikeOutAmount"
  >) {
  const labelTextStyles = getLabel2Styles(brand);

  return (
    <>
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flex: "1 1 0",
          flexDirection: "column",
          gap: FIGMA_GAP_2,
          justifyContent: "center",
          minWidth: 0
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: FIGMA_GAP_4,
            minWidth: 0,
            width: "100%"
          }}
        >
          <span
            style={{
              alignItems: "center",
              display: "inline-flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0
            }}
          >
            <span
              style={{
                ...labelTextStyles,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {label}
            </span>
            {clickableItem ? (
              <span
                aria-hidden="true"
                style={{
                  borderBottom: `1px solid ${FIGMA_TEXT_SECONDARY}`,
                  display: "block",
                  width: "100%"
                }}
              />
            ) : null}
          </span>
          {showInfoIcon ? (
            <Icon
              brand={brand}
              decorative
              name="info-outline"
              size="sm"
              style={{ color: FIGMA_TEXT_SECONDARY, flex: "0 0 auto" }}
            />
          ) : null}
        </div>
        {showDescription ? (
          <p
            style={{
              color: FIGMA_TEXT_SECONDARY,
              fontFamily: fontFamily(brand),
              fontSize: FIGMA_LABEL_4_SIZE,
              fontWeight: fontWeight(brand, "regular"),
              letterSpacing: FIGMA_LABEL_4_LETTER_SPACING,
              lineHeight: FIGMA_LABEL_4_LINE_HEIGHT,
              margin: 0,
              width: "100%"
            }}
          >
            {descriptionText}
          </p>
        ) : null}
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexShrink: 0,
          gap: FIGMA_GAP_4,
          justifyContent: "center"
        }}
      >
        {showPricing ? (
          <p style={{ ...labelTextStyles, whiteSpace: "nowrap" }}>
            {amount}
          </p>
        ) : null}
        {showStrikeOutPrice ? (
          <p
            style={{
              ...getLabel2Styles(brand, FIGMA_TEXT_TERTIARY),
              fontWeight: fontWeight(brand, "regular"),
              textAlign: "right",
              textDecoration: "line-through",
              whiteSpace: "nowrap"
            }}
          >
            {strikeOutAmount}
          </p>
        ) : null}
        {showBadge ? <InvoiceStatusBadge brand={brand} label={badgeLabel ?? "Badge"} tone="low" /> : null}
      </div>
    </>
  );
}

function InvoiceHeader({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: ReactNode;
}) {
  return (
    <>
      <p style={getHeadingStyles(brand)}>{label}</p>
      <Divider
        brand={brand}
        labelPosition="None"
        lineStyle="Plain"
        thickness="Regular"
        style={{ width: "100%" }}
      />
    </>
  );
}

function InvoiceFooter({
  amount,
  brand,
  freeBadgeLabel,
  label,
  refundableBadgeLabel,
  showFreeBadge,
  showRefundableBadge
}: Required<Pick<InvoiceItemProps, "brand">> &
  Pick<
    InvoiceItemProps,
    "amount" | "freeBadgeLabel" | "label" | "refundableBadgeLabel" | "showFreeBadge" | "showRefundableBadge"
  >) {
  return (
    <div
      style={{
        alignItems: "flex-start",
        display: "flex",
        flex: "1 1 0",
        flexDirection: "column",
        gap: FIGMA_GAP_8,
        minWidth: 0,
        width: "100%"
      }}
    >
      <Divider
        brand={brand}
        labelPosition="None"
        lineStyle="Plain"
        thickness="Regular"
        style={{ width: "100%" }}
      />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: "1 1 0",
            gap: FIGMA_GAP_4,
            minWidth: 0
          }}
        >
          <p
            style={{
              ...getHeadingStyles(brand),
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {label}
          </p>
          {showRefundableBadge ? (
            <InvoiceStatusBadge brand={brand} label={refundableBadgeLabel ?? "100% refundable"} tone="high" />
          ) : null}
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexShrink: 0,
            gap: FIGMA_GAP_4
          }}
        >
          <p style={getHeadingStyles(brand, "right")}>{amount}</p>
          {showFreeBadge ? <InvoiceStatusBadge brand={brand} label={freeBadgeLabel ?? "FREE"} tone="high" /> : null}
        </div>
      </div>
    </div>
  );
}

export function InvoiceItem({
  amount,
  badgeLabel = "Badge",
  brand = "Cars24",
  className,
  clickableItem = false,
  descriptionText = "Description",
  freeBadgeLabel = "FREE",
  label,
  refundableBadgeLabel = "100% refundable",
  showBadge = false,
  showDescription = false,
  showFreeBadge = false,
  showInfoIcon = false,
  showPricing = true,
  showRefundableBadge = false,
  showStrikeOutPrice = false,
  strikeOutAmount = "₹8,000",
  style,
  type = "Bill item",
  ...rest
}: InvoiceItemProps) {
  const rootStyles: CSSProperties =
    type === "Header"
      ? {
          alignItems: "flex-start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: FIGMA_GAP_8,
          height: pxToRem(32),
          paddingBottom: FIGMA_SPACING_4,
          width: "100%"
        }
      : {
          alignItems: type === "Footer text" ? "center" : "flex-start",
          boxSizing: "border-box",
          display: "flex",
          gap: FIGMA_GAP_24,
          minWidth: 0,
          width: "100%"
        };

  const resolvedLabel = label ?? getDefaultLabel(type);
  const resolvedAmount = amount ?? getDefaultAmount(type);

  return (
    <div {...rest} className={className} style={{ ...rootStyles, ...style }}>
      {type === "Header" ? (
        <InvoiceHeader brand={brand} label={resolvedLabel} />
      ) : type === "Footer text" ? (
        <InvoiceFooter
          amount={resolvedAmount}
          brand={brand}
          freeBadgeLabel={freeBadgeLabel}
          label={resolvedLabel}
          refundableBadgeLabel={refundableBadgeLabel}
          showFreeBadge={showFreeBadge}
          showRefundableBadge={showRefundableBadge}
        />
      ) : (
        <InvoiceBillItem
          amount={resolvedAmount}
          badgeLabel={badgeLabel}
          brand={brand}
          clickableItem={clickableItem}
          descriptionText={descriptionText}
          label={resolvedLabel}
          showBadge={showBadge}
          showDescription={showDescription}
          showInfoIcon={showInfoIcon}
          showPricing={showPricing}
          showStrikeOutPrice={showStrikeOutPrice}
          strikeOutAmount={strikeOutAmount}
        />
      )}
    </div>
  );
}
