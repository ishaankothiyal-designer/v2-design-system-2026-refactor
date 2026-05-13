import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Divider } from "./divider";
import { Icon } from "./icon";
import { InvoiceItem, type InvoiceItemProps } from "./invoice-item";

export const canonicalInvoiceBillWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.invoiceBill"
);

export interface InvoiceBillItemData
  extends Omit<InvoiceItemProps, "brand" | "className" | "style" | "type"> {
  id?: string;
}

export interface InvoiceBillSection {
  id?: string;
  items?: InvoiceBillItemData[];
  children?: ReactNode;
}

export interface InvoiceBillProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  actionBar?: boolean;
  footerText?: boolean;
  sectionHeader?: boolean;
  title?: ReactNode;
  sections?: InvoiceBillSection[];
  footerLabel?: ReactNode;
  totalAmount?: ReactNode;
  offerLabel?: ReactNode;
  primaryAction?: ButtonGroupButtonAction | null;
  children?: ReactNode;
}

const DEFAULT_SECTION_ITEMS: InvoiceBillItemData[] = Array.from({ length: 4 }, (_, index) => ({
  id: `invoice-item-${index + 1}`,
  label: "Bill item name",
  amount: "₹7100"
}));

const DEFAULT_SECTIONS: InvoiceBillSection[] = Array.from({ length: 3 }, (_, index) => ({
  id: `invoice-section-${index + 1}`,
  items: DEFAULT_SECTION_ITEMS.map((item) => ({
    ...item,
    id: `${item.id}-${index + 1}`
  }))
}));

const FIGMA_SURFACE = "var(--cars24-semantic-bg-primary, #FFFFFF)";
const FIGMA_BORDER = "var(--cars24-semantic-border-primary, #E2E8F0)";
const FIGMA_BRAND_BACKGROUND = "var(--cars24-semantic-bg-brand-subtler, #F6F6FF)";
const FIGMA_BRAND_COLOR = "var(--cars24-semantic-text-brand-base, #4736FE)";
const FIGMA_BRAND_BORDER = "var(--cars24-semantic-border-brand-base, #4736FE)";
const FIGMA_GAP_0 = "var(--cars24-misc-gap-none, 0px)";
const FIGMA_GAP_6 = "var(--cars24-misc-gap-6, 6px)";
const FIGMA_GAP_8 = "var(--cars24-misc-gap-8, 8px)";
const FIGMA_GAP_12 = "var(--cars24-misc-gap-12, 12px)";
const FIGMA_GAP_16 = "var(--cars24-misc-gap-16, 16px)";
const FIGMA_LABEL_3_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const FIGMA_LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const FIGMA_LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";
const FIGMA_SUBTLE_BORDER_WIDTH = "var(--lego-border-subtle, 0.7px)";

function toPx(value: number) {
  return pxToRem(value);
}

function themeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function InvoiceOfferStrip({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: ReactNode;
}) {
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));

  return (
    <div
      style={{
        borderBottom: `${FIGMA_SUBTLE_BORDER_WIDTH} solid ${FIGMA_BRAND_BORDER}`,
        boxSizing: "border-box",
        width: "100%"
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: FIGMA_BRAND_BACKGROUND,
          boxSizing: "border-box",
          display: "flex",
          gap: FIGMA_GAP_6,
          justifyContent: "center",
          padding: `${FIGMA_GAP_8} ${FIGMA_GAP_16}`,
          width: "100%"
        }}
      >
        <Icon
          brand={brand}
          decorative
          name="offer-badge-fill"
          size="sm"
          style={{ color: FIGMA_BRAND_COLOR, flex: "0 0 auto" }}
        />
        <p
          style={{
            color: FIGMA_BRAND_COLOR,
            fontFamily,
            fontSize: FIGMA_LABEL_3_SIZE,
            fontWeight: medium,
            letterSpacing: FIGMA_LABEL_3_LETTER_SPACING,
            lineHeight: FIGMA_LABEL_3_LINE_HEIGHT,
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function InvoiceActionBar({
  brand,
  offerLabel,
  primaryAction
}: {
  brand: DisplayBrandId;
  offerLabel: ReactNode;
  primaryAction: ButtonGroupButtonAction | null | undefined;
}) {
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction(brand) : primaryAction;

  return (
    <div
      style={{
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        width: "100%"
      }}
    >
      <InvoiceOfferStrip brand={brand} label={offerLabel} />
      {resolvedPrimaryAction ? (
        <div
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            padding: FIGMA_GAP_12,
            width: "100%"
          }}
        >
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
    </div>
  );
}

function InvoiceSection({
  brand,
  section
}: {
  brand: DisplayBrandId;
  section: InvoiceBillSection;
}) {
  if (section.children) {
    return (
      <div
        style={{
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
          gap: FIGMA_GAP_6,
          width: "100%"
        }}
      >
        {section.children}
      </div>
    );
  }

  return (
    <div
      style={{
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        gap: FIGMA_GAP_6,
        width: "100%"
      }}
    >
      {(section.items ?? DEFAULT_SECTION_ITEMS).map((item, index) => {
        const { id, ...itemProps } = item;

        return (
          <InvoiceItem
            key={id ?? `${String(item.label ?? "invoice-item")}-${index}`}
            {...itemProps}
            brand={brand}
            type="Bill item"
          />
        );
      })}
    </div>
  );
}

/**
 * Figma Invoice / Bill widget composition with repeated bill rows, section dividers, total footer, offer strip, and CTA.
 */
export function InvoiceBill({
  actionBar = true,
  brand = "Cars24",
  children,
  className,
  footerLabel = "Total",
  footerText = true,
  offerLabel = "₹20 off on this order",
  primaryAction,
  sectionHeader = true,
  sections = DEFAULT_SECTIONS,
  style,
  title = "Section Heading",
  totalAmount = "₹7,95,100",
  ...rest
}: InvoiceBillProps) {
  const radius = themeNumber(brand, "radius.xl");
  const activeSections = sections.length > 0 ? sections : DEFAULT_SECTIONS;

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "stretch",
        background: FIGMA_SURFACE,
        border: `1px solid ${FIGMA_BORDER}`,
        borderRadius: toPx(radius),
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: FIGMA_GAP_0,
        maxWidth: "100%",
        overflow: "hidden",
        width: toPx(328),
        ...style
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: FIGMA_GAP_8,
          padding: FIGMA_GAP_12,
          width: "100%"
        }}
      >
        {sectionHeader ? <InvoiceItem brand={brand} label={title} type="Header" /> : null}

        {children ??
          activeSections.map((section, index) => (
            <div
              key={section.id ?? `invoice-section-${index + 1}`}
              style={{
                display: "contents"
              }}
            >
              <InvoiceSection brand={brand} section={section} />
              {index < activeSections.length - 1 ? (
                <Divider
                  brand={brand}
                  labelPosition="None"
                  lineStyle="Dash"
                  thickness="Thin"
                  style={{ width: "100%" }}
                />
              ) : null}
            </div>
          ))}

        {footerText ? (
          <InvoiceItem
            amount={totalAmount}
            brand={brand}
            label={footerLabel}
            type="Footer text"
          />
        ) : null}
      </div>

      {actionBar ? (
        <>
          <Divider
            brand={brand}
            labelPosition="None"
            lineStyle="Plain"
            thickness="Regular"
            style={{ width: "100%" }}
          />
          <InvoiceActionBar brand={brand} offerLabel={offerLabel} primaryAction={primaryAction} />
        </>
      ) : null}
    </div>
  );
}
