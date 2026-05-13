import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Divider } from "./divider";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalLoanCardNbfcWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.loanCardNbfc"
);

export type LoanCardSupportingContentType = "Registration number plate" | "Description";

export interface LoanCardNbfcItemData {
  id?: string;
  label?: ReactNode;
  amount?: ReactNode;
}

export interface LoanCardNbfcItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "id">, LoanCardNbfcItemData {
  brand?: DisplayBrandId;
}

export interface LoanCardNbfcMediaSlotProps extends HTMLAttributes<HTMLDivElement> {
  brand?: DisplayBrandId;
}

export interface LoanCardRegistrationPlateProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  brand?: DisplayBrandId;
  registrationNumber?: string;
}

export interface LoanCardSupportingContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  description?: ReactNode;
  registrationNumber?: string;
  type?: LoanCardSupportingContentType;
}

export interface LoanCardNbfcProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  title?: ReactNode;
  description?: ReactNode;
  registrationNumber?: string;
  imageSlot?: ReactNode;
  items?: LoanCardNbfcItemData[];
  children?: ReactNode;
  onTrailingActionClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  showImage?: boolean;
  showTrailingAction?: boolean;
  supportingContentType?: LoanCardSupportingContentType;
  trailingAction?: ReactNode;
}

const DEFAULT_LOAN_CARD_ITEMS: LoanCardNbfcItemData[] = Array.from({ length: 3 }, (_, index) => ({
  id: `default-loan-row-${index + 1}`,
  amount: "₹7,100",
  label: "Label2 14"
}));

const LOAN_CARD_WIDTH = 336;
const LOAN_CARD_MEDIA_WIDTH = 68;
const LOAN_CARD_MEDIA_HEIGHT = 48;
const LOAN_CARD_PLACEHOLDER_ICON_SIZE = 32;
const LOAN_CARD_PLATE_HEIGHT = 20;
const LOAN_CARD_PLATE_ICON_SIZE = 8;

const FIGMA_HEADLINE_H4_SIZE = "var(--cars24-typography-size-headline-h4, 15px)";
const FIGMA_HEADLINE_H4_LINE_HEIGHT = "var(--cars24-typography-line-height-headline-h4, 20px)";
const FIGMA_HEADLINE_H4_LETTER_SPACING = "var(--cars24-typography-letter-spacing-headline-h4, -0.02em)";
const FIGMA_LABEL_2_SIZE = "var(--cars24-typography-size-utility-label-2, 14px)";
const FIGMA_LABEL_2_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-2, 18px)";
const FIGMA_LABEL_2_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-2, 0px)";
const FIGMA_LABEL_3_SIZE = "var(--cars24-typography-size-utility-label-3, 12px)";
const FIGMA_LABEL_3_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-3, 16px)";
const FIGMA_LABEL_3_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-3, 0px)";
const FIGMA_CAPTION_MD_SIZE = "var(--cars24-typography-size-caption-md, 10px)";
const FIGMA_CAPTION_MD_LINE_HEIGHT = "var(--cars24-typography-line-height-caption-md, 14px)";
const FIGMA_CAPTION_MD_LETTER_SPACING = "var(--cars24-typography-letter-spacing-caption-md, 0px)";

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function themeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function themeRem(brand: DisplayBrandId, path: string) {
  return pxToRem(themeNumber(brand, path));
}

function getLoanCardTokens(brand: DisplayBrandId) {
  return {
    accent: themeString(brand, "color.brand.primary.500"),
    accentSubtle: themeString(brand, "color.brand.primary.50"),
    cardRadius: themeRem(brand, "radius.xl"),
    gapNone: themeRem(brand, "spacing.0"),
    gapXs: themeRem(brand, "spacing.1"),
    gapSm: themeRem(brand, "spacing.2"),
    gapMd: themeRem(brand, "spacing.3"),
    mediaRadius: themeRem(brand, "radius.alt.sm"),
    plateRadius: themeRem(brand, "radius.xxs"),
    plateStroke: themeRem(brand, "component.divider.size.thickness.thin"),
    surface: themeString(brand, "color.surface.canvas"),
    textInverse: themeString(brand, "color.text.inverse"),
    textPrimary: themeString(brand, "color.text.primary"),
    textSecondary: themeString(brand, "color.text.secondary")
  };
}

function ellipsisStyles(): CSSProperties {
  return {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };
}

function LoanCardPlaceholderGlyph({ brand }: { brand: DisplayBrandId }) {
  const iconSize = pxToRem(LOAN_CARD_PLACEHOLDER_ICON_SIZE);
  const tokens = getLoanCardTokens(brand);

  return (
    <Icon
      brand={brand}
      decorative
      name="square-plus-add-outline"
      style={{
        color: tokens.accent,
        fontSize: iconSize,
        height: iconSize,
        width: iconSize
      }}
    />
  );
}

export function LoanCardNbfcMediaSlot({
  brand = "Cars24",
  children,
  className,
  style,
  ...rest
}: LoanCardNbfcMediaSlotProps) {
  const tokens = getLoanCardTokens(brand);

  return (
    <div
      {...rest}
      aria-hidden={children === undefined ? true : rest["aria-hidden"]}
      className={className}
      data-loan-card-part="media-slot"
      style={{
        alignItems: "center",
        background: tokens.surface,
        borderRadius: tokens.mediaRadius,
        boxSizing: "border-box",
        display: "inline-flex",
        flex: "0 0 auto",
        height: pxToRem(LOAN_CARD_MEDIA_HEIGHT),
        justifyContent: "center",
        overflow: "hidden",
        width: pxToRem(LOAN_CARD_MEDIA_WIDTH),
        ...style
      }}
    >
      {children === undefined ? (
        <span
          aria-hidden="true"
          data-loan-card-part="media-placeholder"
          style={{
            alignItems: "center",
            background: tokens.accentSubtle,
            display: "inline-flex",
            height: "100%",
            justifyContent: "center",
            width: "100%"
          }}
        >
          <LoanCardPlaceholderGlyph brand={brand} />
        </span>
      ) : (
        children
      )}
    </div>
  );
}

export function LoanCardRegistrationPlate({
  brand = "Cars24",
  className,
  registrationNumber = "DL10CQ7291",
  style,
  ...rest
}: LoanCardRegistrationPlateProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const medium = themeNumber(brand, "typography.fontWeight.medium");
  const iconSize = pxToRem(LOAN_CARD_PLATE_ICON_SIZE);
  const tokens = getLoanCardTokens(brand);

  return (
    <span
      {...rest}
      className={className}
      data-loan-card-part="registration-plate"
      style={{
        alignItems: "center",
        background: tokens.surface,
        border: `${tokens.plateStroke} solid ${tokens.textPrimary}`,
        borderRadius: tokens.plateRadius,
        boxSizing: "border-box",
        display: "inline-flex",
        height: pxToRem(LOAN_CARD_PLATE_HEIGHT),
        justifyContent: "center",
        overflow: "hidden",
        verticalAlign: "top",
        ...style
      }}
    >
      <span
        aria-hidden="true"
        data-loan-card-part="registration-plate-brand"
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          background: tokens.accent,
          color: tokens.textInverse,
          display: "inline-flex",
          justifyContent: "center",
          padding: "3px 2px 3px 3px"
        }}
      >
        <Icon
          brand={brand}
          decorative
          name="chakra"
          style={{
            color: "inherit",
            fontSize: iconSize,
            height: iconSize,
            width: iconSize
          }}
        />
      </span>
      <span
        style={{
          alignItems: "center",
          alignSelf: "stretch",
          borderBottomRightRadius: tokens.plateRadius,
          borderTopRightRadius: tokens.plateRadius,
          display: "inline-flex",
          justifyContent: "center",
          overflow: "hidden",
          padding: "3px 4px"
        }}
      >
        <span
          style={{
            color: tokens.textPrimary,
            fontFamily,
            fontSize: FIGMA_CAPTION_MD_SIZE,
            fontWeight: medium,
            letterSpacing: FIGMA_CAPTION_MD_LETTER_SPACING,
            lineHeight: FIGMA_CAPTION_MD_LINE_HEIGHT,
            whiteSpace: "nowrap"
          }}
        >
          {registrationNumber}
        </span>
      </span>
    </span>
  );
}

export function LoanCardSupportingContent({
  brand = "Cars24",
  className,
  description = "Description",
  registrationNumber,
  style,
  type = "Registration number plate",
  ...rest
}: LoanCardSupportingContentProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const regular = themeNumber(brand, "typography.fontWeight.regular");
  const tokens = getLoanCardTokens(brand);

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        display: "flex",
        minWidth: 0,
        ...style
      }}
    >
      {type === "Registration number plate" ? (
        <LoanCardRegistrationPlate
          brand={brand}
          {...(registrationNumber !== undefined ? { registrationNumber } : {})}
        />
      ) : (
        <p
          style={{
            ...ellipsisStyles(),
            color: tokens.textSecondary,
            fontFamily,
            fontSize: FIGMA_LABEL_3_SIZE,
            fontWeight: regular,
            letterSpacing: FIGMA_LABEL_3_LETTER_SPACING,
            lineHeight: FIGMA_LABEL_3_LINE_HEIGHT,
            margin: 0,
            width: "100%"
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function LoanCardNbfcItem({
  amount = "₹7,100",
  brand = "Cars24",
  className,
  label = "Label2 14",
  style,
  ...rest
}: LoanCardNbfcItemProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const medium = themeNumber(brand, "typography.fontWeight.medium");
  const tokens = getLoanCardTokens(brand);

  const textStyles: CSSProperties = {
    ...ellipsisStyles(),
    color: tokens.textSecondary,
    fontFamily,
    fontSize: FIGMA_LABEL_2_SIZE,
    fontWeight: medium,
    letterSpacing: FIGMA_LABEL_2_LETTER_SPACING,
    lineHeight: FIGMA_LABEL_2_LINE_HEIGHT,
    margin: 0
  };

  return (
    <div
      {...rest}
      className={className}
      data-loan-card-part="item"
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: tokens.gapSm,
        minHeight: pxToRem(16),
        minWidth: 0,
        width: "100%",
        ...style
      }}
    >
      <p style={{ ...textStyles, flex: "1 1 0", textAlign: "left" }}>{label}</p>
      <p style={{ ...textStyles, flex: "0 0 auto", maxWidth: "50%", textAlign: "right" }}>{amount}</p>
    </div>
  );
}

function LoanCardDefaultAction({
  brand,
  onClick
}: {
  brand: DisplayBrandId;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}) {
  return (
    <IconButton
      aria-label="Open loan details"
      brand={brand}
      icon={<Icon brand={brand} decorative name="arrow-right-outline" />}
      onClick={onClick}
      shape="Round"
      size="XSmall"
      styleVariant="Subtle - Black"
    />
  );
}

function renderLoanCardRows(brand: DisplayBrandId, items: LoanCardNbfcItemData[]) {
  return items.map((item, index) => (
    <LoanCardNbfcItem
      key={item.id ?? `loan-card-item-${index + 1}`}
      amount={item.amount}
      brand={brand}
      label={item.label}
    />
  ));
}

/**
 * Figma Loan card (NBFC) widget with media, vehicle support content, action, divider, and invoice rows.
 */
export function LoanCardNbfc({
  brand = "Cars24",
  children,
  className,
  description,
  imageSlot,
  items = DEFAULT_LOAN_CARD_ITEMS,
  onTrailingActionClick,
  registrationNumber,
  showImage = true,
  showTrailingAction = true,
  style,
  supportingContentType = "Registration number plate",
  title = "Title (H4) - 15px",
  trailingAction,
  ...rest
}: LoanCardNbfcProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const semibold = themeNumber(brand, "typography.fontWeight.semibold");
  const tokens = getLoanCardTokens(brand);
  const resolvedTrailingAction =
    trailingAction === undefined ? (
      <LoanCardDefaultAction brand={brand} onClick={onTrailingActionClick} />
    ) : (
      trailingAction
    );

  return (
    <div
      {...rest}
      className={className}
      data-brand={brand}
      data-loan-card-part="root"
      style={{
        alignItems: "flex-start",
        background: tokens.surface,
        borderRadius: tokens.cardRadius,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: tokens.gapSm,
        maxWidth: "100%",
        overflow: "hidden",
        padding: tokens.gapMd,
        width: pxToRem(LOAN_CARD_WIDTH),
        ...style
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: tokens.gapMd,
          minWidth: 0,
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flex: "1 1 0",
            gap: tokens.gapMd,
            minWidth: 0
          }}
        >
          {showImage ? (
            <LoanCardNbfcMediaSlot brand={brand}>{imageSlot}</LoanCardNbfcMediaSlot>
          ) : null}
          <div
            style={{
              alignItems: "flex-start",
              display: "flex",
              flex: "1 1 0",
              flexDirection: "column",
              gap: tokens.gapXs,
              minWidth: 0
            }}
          >
            <p
              style={{
                ...ellipsisStyles(),
                color: tokens.textPrimary,
                fontFamily,
                fontSize: FIGMA_HEADLINE_H4_SIZE,
                fontWeight: semibold,
                letterSpacing: FIGMA_HEADLINE_H4_LETTER_SPACING,
                lineHeight: FIGMA_HEADLINE_H4_LINE_HEIGHT,
                margin: 0,
                width: "100%"
              }}
            >
              {title}
            </p>
            <LoanCardSupportingContent
              brand={brand}
              type={supportingContentType}
              {...(description !== undefined ? { description } : {})}
              {...(registrationNumber !== undefined ? { registrationNumber } : {})}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        {showTrailingAction && resolvedTrailingAction ? (
          <div style={{ alignItems: "center", display: "inline-flex", flex: "0 0 auto" }}>
            {resolvedTrailingAction}
          </div>
        ) : null}
      </div>

      <Divider
        brand={brand}
        labelPosition="None"
        lineStyle="Dash"
        thickness="Regular"
        style={{ height: 0, width: "100%" }}
      />

      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          gap: tokens.gapSm,
          minWidth: 0,
          padding: tokens.gapNone,
          width: "100%"
        }}
      >
        {children ?? renderLoanCardRows(brand, items)}
      </div>
    </div>
  );
}
