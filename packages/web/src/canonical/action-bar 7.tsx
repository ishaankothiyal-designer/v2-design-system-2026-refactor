import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, getThemeTokenValue } from "../theme";
import { Button, type ButtonProps } from "./button";
import { ButtonGroup } from "./button-group";
import { ChatBar } from "./chat-bar";
import { Checkbox } from "./checkbox";
import { Icon } from "./icon";
import { ProgressBar } from "./progress-bar";

export const canonicalActionBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.actionBar"
);

export type ActionBarInfoTone = "General" | "Brand" | "Positive" | "Negative" | "Warning";
export type ActionBarOfferTone = "Brand" | "Success" | "Danger" | "Warning";
export type ActionBarOfferAlign = "Center" | "Start";
export type ActionBarAddressState = "Saved" | "Empty";
export type ActionBarChatState = "Default" | "Message Typed";
export type ActionBarActionVariant =
  | "Button Group"
  | "Loader"
  | "Chat Bar"
  | "Payment Strip"
  | "Payment Option"
  | "Payment Breakdown"
  | "Strike Amount"
  | "Progressive";

type ActionBarTypographyKey =
  | "body1Semibold"
  | "body2Regular"
  | "body2Medium"
  | "body2Semibold"
  | "body3Regular"
  | "body3Medium"
  | "body3Semibold"
  | "heading4Medium"
  | "heading4Semibold"
  | "heading4Bold"
  | "heading5Semibold"
  | "offer";

type ActionBarFeedbackKey = "brand" | "general" | "positive" | "negative" | "warning";

type ActionBarButtonEventProps = Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick" | "type">;

export interface ActionBarButtonAction extends ActionBarButtonEventProps {
  label: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export interface ActionBarInfoMessage {
  tone?: ActionBarInfoTone;
  description: ReactNode;
  iconName?: IconName;
  showIcon?: boolean;
}

export interface ActionBarOfferStrip {
  tone?: ActionBarOfferTone;
  align?: ActionBarOfferAlign;
  label: ReactNode;
  iconName?: IconName;
}

export interface ActionBarCheckmarkStrip {
  checked?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  infoIconLabel?: string;
  label: ReactNode;
  showInfoIcon?: boolean;
  showTooltip?: boolean;
  tooltipContent?: ReactNode;
}

export interface ActionBarAddress {
  actionLabel?: ReactNode;
  addressLine?: ReactNode;
  iconName?: IconName;
  state?: ActionBarAddressState;
  title?: ReactNode;
}

export interface ActionBarBottomInfo {
  actionLabel?: ReactNode;
  iconName?: IconName;
  message: ReactNode;
  showIcon?: boolean;
}

export interface ActionBarSecureStrip {
  showIcon?: boolean;
  slot1?: ReactNode;
  slot2?: ReactNode;
  text?: ReactNode;
}

export type ActionBarAction =
  | {
      variant?: "Button Group";
      primaryAction?: ActionBarButtonAction;
      secondaryAction?: ActionBarButtonAction;
    }
  | {
      variant: "Loader";
      cancelAction?: ActionBarButtonAction;
      progressPercentage?: number;
    }
  | {
      variant: "Chat Bar";
      attachmentIconName?: IconName;
      sendIconName?: IconName;
      state?: ActionBarChatState;
      value?: ReactNode;
    }
  | {
      variant: "Payment Strip";
      actionLabel?: ReactNode;
      actionTrailingIcon?: ReactNode;
      productCountLabel?: ReactNode;
      totalAmount?: ReactNode;
      totalPrefix?: ReactNode;
    }
  | {
      variant: "Payment Option";
      amount?: ReactNode;
      buttonAction?: ActionBarButtonAction;
      media?: ReactNode;
      subtitle?: ReactNode;
    }
  | {
      variant: "Payment Breakdown";
      amount?: ReactNode;
      breakdownLabel?: ReactNode;
      buttonAction?: ActionBarButtonAction;
    }
  | {
      variant: "Strike Amount";
      amount?: ReactNode;
      buttonAction?: ActionBarButtonAction;
      label?: ReactNode;
      originalAmount?: ReactNode;
    }
  | {
      variant: "Progressive";
      backLabel?: ReactNode;
      backLeadingIcon?: ReactNode;
      buttonAction?: ActionBarButtonAction;
    };

export interface ActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  action?: ActionBarAction | null;
  address?: ActionBarAddress | null;
  bottomInfo?: ActionBarBottomInfo | null;
  brand?: DisplayBrandId;
  checkmarkStrip?: ActionBarCheckmarkStrip | null;
  divider?: boolean;
  infoMessage?: ActionBarInfoMessage | null;
  offerStrip?: ActionBarOfferStrip | null;
  secureStrip?: ActionBarSecureStrip | null;
  showHomeIndicator?: boolean;
}

const ACTION_BAR_ROW_PADDING_INLINE = 16;
const ACTION_BAR_ROW_PADDING_BLOCK = 12;
const ACTION_BAR_FEEDBACK_FALLBACKS = {
  negativeBorder: "#B51D02",
  negativeSurface: "#FEF2F2",
  negativeText: "#C10007",
  positiveBorder: "#00A63E",
  positiveSurface: "#EFFFF7",
  positiveText: "#2A6B4A",
  warningBorder: "#E17100",
  warningSurface: "#FFFBEB",
  warningText: "#BB4D00"
} as const;

const DEFAULT_ACTION: ActionBarAction = {
  variant: "Button Group",
  primaryAction: {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  },
  secondaryAction: {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  }
};

function toPx(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function getFontFamily(brand: DisplayBrandId) {
  return `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
}

function getFeedbackPalette(brand: DisplayBrandId) {
  const brandPrimary = String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));
  const secondaryText = String(
    getThemeTokenValue(brand, "component.phoneInput.color.helper.default.text") ?? "#64748B"
  );

  return {
    brand: {
      icon: brandPrimary,
      text: brandPrimary
    },
    general: {
      icon: secondaryText,
      text: secondaryText
    },
    negative: {
      icon: ACTION_BAR_FEEDBACK_FALLBACKS.negativeText,
      text: ACTION_BAR_FEEDBACK_FALLBACKS.negativeText
    },
    positive: {
      icon: ACTION_BAR_FEEDBACK_FALLBACKS.positiveText,
      text: ACTION_BAR_FEEDBACK_FALLBACKS.positiveText
    },
    warning: {
      icon: ACTION_BAR_FEEDBACK_FALLBACKS.warningText,
      text: ACTION_BAR_FEEDBACK_FALLBACKS.warningText
    }
  } satisfies Record<ActionBarFeedbackKey, { icon: string; text: string }>;
}

function getTypographyStyles(brand: DisplayBrandId, key: ActionBarTypographyKey): CSSProperties {
  const fontFamily = getFontFamily(brand);
  const regular = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const semibold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const bold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.bold"));

  switch (key) {
    case "body1Semibold":
      return {
        fontFamily,
        fontSize: 15,
        fontWeight: semibold,
        letterSpacing: 0,
        lineHeight: "20px",
        margin: 0
      };
    case "body2Regular":
      return {
        fontFamily,
        fontSize: 13,
        fontWeight: regular,
        letterSpacing: 0,
        lineHeight: "18px",
        margin: 0
      };
    case "body2Medium":
      return {
        fontFamily,
        fontSize: 13,
        fontWeight: medium,
        letterSpacing: 0,
        lineHeight: "18px",
        margin: 0
      };
    case "body2Semibold":
      return {
        fontFamily,
        fontSize: 13,
        fontWeight: semibold,
        letterSpacing: 0,
        lineHeight: "18px",
        margin: 0
      };
    case "body3Regular":
      return {
        fontFamily,
        fontSize: 11,
        fontWeight: regular,
        letterSpacing: 0,
        lineHeight: "17px",
        margin: 0
      };
    case "body3Medium":
      return {
        fontFamily,
        fontSize: 11,
        fontWeight: medium,
        letterSpacing: 0,
        lineHeight: "17px",
        margin: 0
      };
    case "body3Semibold":
      return {
        fontFamily,
        fontSize: 11,
        fontWeight: semibold,
        letterSpacing: 0,
        lineHeight: "17px",
        margin: 0
      };
    case "heading4Medium":
      return {
        fontFamily,
        fontSize: 17,
        fontWeight: medium,
        letterSpacing: 0,
        lineHeight: "20px",
        margin: 0
      };
    case "heading4Semibold":
      return {
        fontFamily,
        fontSize: 17,
        fontWeight: semibold,
        letterSpacing: 0,
        lineHeight: "20px",
        margin: 0
      };
    case "heading4Bold":
      return {
        fontFamily,
        fontSize: 17,
        fontWeight: bold,
        letterSpacing: 0,
        lineHeight: "20px",
        margin: 0
      };
    case "heading5Semibold":
      return {
        fontFamily,
        fontSize: 15,
        fontWeight: semibold,
        letterSpacing: 0,
        lineHeight: "18px",
        margin: 0
      };
    case "offer":
      return {
        fontFamily,
        fontSize: 12,
        fontWeight: semibold,
        letterSpacing: 0,
        lineHeight: "16.32px",
        margin: 0
      };
  }
}

function wrapButtonLabel(brand: DisplayBrandId, label: ReactNode) {
  return <span style={getTypographyStyles(brand, "body1Semibold")}>{label}</span>;
}

function getPrimaryTextColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "component.phoneInput.color.label.default") ?? "#020617");
}

function getSecondaryTextColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "component.phoneInput.color.helper.default.text") ?? "#64748B");
}

function getMutedTextColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "component.phoneInput.color.field.rest.placeholder") ?? "#94A3B8");
}

function getDividerColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "component.divider.color.line") ?? "#E2E8F0");
}

function getCanvasColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "color.surface.canvas") ?? "#FFFFFF");
}

function getSubtleSurfaceColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "color.surface.subtle") ?? "#F8FAFC");
}

function getBrandPrimaryColor(brand: DisplayBrandId) {
  return String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));
}

function getBrandPrimaryHoverColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "color.brand.alt.600") ?? getBrandPrimaryColor(brand));
}

function getBrandSubtleSurfaceColor(brand: DisplayBrandId) {
  return String(getThemeTokenValue(brand, "color.brand.alt.50") ?? "#F6F5FF");
}

function getContainerStyles(style: CSSProperties | undefined): CSSProperties {
  return {
    background: getCanvasColor("Cars24"),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    maxWidth: "100%",
    width: "100%",
    ...style
  };
}

function renderTopDivider(brand: DisplayBrandId) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: getDividerColor(brand),
        height: 1,
        width: "100%"
      }}
    />
  );
}

function renderIconNode(brand: DisplayBrandId, icon: ReactNode, fallbackName: IconName, color: string, size: "sm" | "md" = "md") {
  if (icon) {
    return icon;
  }

  return (
    <Icon
      brand={brand}
      decorative
      name={fallbackName}
      size={size}
      style={{
        color,
        flex: "0 0 auto"
      }}
    />
  );
}

function InlineAction({
  brand,
  color,
  icon,
  label,
  onClick
}: {
  brand: DisplayBrandId;
  color: string;
  icon?: ReactNode;
  label: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}) {
  const content = (
    <>
      {icon ? <span aria-hidden="true" style={{ display: "inline-flex", lineHeight: 0 }}>{icon}</span> : null}
      <span style={{ ...getTypographyStyles(brand, "heading5Semibold"), color }}>{label}</span>
    </>
  );

  if (!onClick) {
    return (
      <span
        style={{
          alignItems: "center",
          color,
          display: "inline-flex",
          gap: 4,
          justifyContent: "center",
          minHeight: 20
        }}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{
        alignItems: "center",
        appearance: "none",
        background: "transparent",
        border: "none",
        color,
        cursor: "pointer",
        display: "inline-flex",
        gap: 4,
        justifyContent: "center",
        minHeight: 20,
        padding: 0
      }}
      type="button"
    >
      {content}
    </button>
  );
}

function ActionBarTopInfo({
  brand,
  infoMessage
}: {
  brand: DisplayBrandId;
  infoMessage: ActionBarInfoMessage;
}) {
  const tone: ActionBarFeedbackKey =
    infoMessage.tone === "Brand"
      ? "brand"
      : infoMessage.tone === "Positive"
        ? "positive"
        : infoMessage.tone === "Negative"
          ? "negative"
          : infoMessage.tone === "Warning"
            ? "warning"
            : "general";
  const palette = getFeedbackPalette(brand)[tone];

  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: tone === "general" ? 4 : 8,
        minHeight: 36,
        padding: tone === "general" ? "8px 12px" : "12px",
        width: "100%"
      }}
    >
      {infoMessage.showIcon === false
        ? null
        : renderIconNode(brand, undefined, infoMessage.iconName ?? "info-outline", palette.icon)}
      <p
        style={{
          ...getTypographyStyles(brand, "body2Regular"),
          color: palette.text,
          flex: "1 1 auto",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {infoMessage.description}
      </p>
    </div>
  );
}

function getOfferPalette(brand: DisplayBrandId, tone: ActionBarOfferTone) {
  if (tone === "Success") {
    return {
      background: ACTION_BAR_FEEDBACK_FALLBACKS.positiveSurface,
      border: ACTION_BAR_FEEDBACK_FALLBACKS.positiveBorder,
      foreground: ACTION_BAR_FEEDBACK_FALLBACKS.positiveText
    };
  }

  if (tone === "Danger") {
    return {
      background: ACTION_BAR_FEEDBACK_FALLBACKS.negativeSurface,
      border: ACTION_BAR_FEEDBACK_FALLBACKS.negativeBorder,
      foreground: ACTION_BAR_FEEDBACK_FALLBACKS.negativeText
    };
  }

  if (tone === "Warning") {
    return {
      background: ACTION_BAR_FEEDBACK_FALLBACKS.warningSurface,
      border: ACTION_BAR_FEEDBACK_FALLBACKS.warningBorder,
      foreground: ACTION_BAR_FEEDBACK_FALLBACKS.warningText
    };
  }

  return {
    background: getBrandSubtleSurfaceColor(brand),
    border: getBrandPrimaryColor(brand),
    foreground: getBrandPrimaryColor(brand)
  };
}

function ActionBarOffer({
  brand,
  offerStrip
}: {
  brand: DisplayBrandId;
  offerStrip: ActionBarOfferStrip;
}) {
  const palette = getOfferPalette(brand, offerStrip.tone ?? "Brand");
  const align = offerStrip.align ?? "Center";

  return (
    <div
      style={{
        background: palette.background,
        borderBottom: `0.7px solid ${palette.border}`,
        width: "100%"
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: 6,
          justifyContent: align === "Center" ? "center" : "flex-start",
          minHeight: 32,
          padding: align === "Center" ? "8px 16px" : "8px 12px",
          width: "100%"
        }}
      >
        <Icon
          brand={brand}
          decorative
          name={offerStrip.iconName ?? "tag-sale-filled"}
          size="sm"
          style={{ color: palette.foreground, flex: "0 0 auto" }}
        />
        <p
          style={{
            ...getTypographyStyles(brand, "offer"),
            color: palette.foreground,
            flex: align === "Center" ? "0 0 auto" : "1 1 auto",
            minWidth: align === "Center" ? undefined : 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {offerStrip.label}
        </p>
      </div>
    </div>
  );
}

function ActionBarCheckmark({
  brand,
  checkmarkStrip
}: {
  brand: DisplayBrandId;
  checkmarkStrip: ActionBarCheckmarkStrip;
}) {
  const textPrimary = getPrimaryTextColor(brand);
  const textSecondary = getSecondaryTextColor(brand);
  const iconColor = getSecondaryTextColor(brand);

  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: 8,
        padding: "12px",
        position: "relative",
        width: "100%"
      }}
    >
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Checkbox
            brand={brand}
            checked={checkmarkStrip.checked ?? false}
            disabled={checkmarkStrip.disabled ?? false}
            size="Small"
          />
          <div
            style={{
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
              paddingInlineStart: 2
            }}
          >
            <p
              style={{
                ...getTypographyStyles(brand, "body2Medium"),
                color: textPrimary,
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {checkmarkStrip.label}
            </p>
            {checkmarkStrip.description ? (
              <p
                style={{
                  ...getTypographyStyles(brand, "body3Regular"),
                  color: textSecondary,
                  maxWidth: "100%"
                }}
              >
                {checkmarkStrip.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {checkmarkStrip.showInfoIcon === false ? null : (
        <Icon
          brand={brand}
          decorative={!checkmarkStrip.infoIconLabel}
          {...(checkmarkStrip.infoIconLabel ? { label: checkmarkStrip.infoIconLabel } : {})}
          name="info-filled"
          style={{ color: iconColor, flex: "0 0 auto" }}
        />
      )}

      {checkmarkStrip.showTooltip ? (
        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            right: 0,
            top: -35
          }}
        >
          <div
            style={{
              background: "#0F172B",
              borderRadius: 12,
              color: "#FFFFFF",
              maxWidth: 328,
              padding: "8px 12px"
            }}
          >
            <p
              style={{
                ...getTypographyStyles(brand, "body2Regular"),
                color: "#FFFFFF",
                textAlign: "center"
              }}
            >
              {checkmarkStrip.tooltipContent ??
                "A tooltip is a small box that appears when hovering over a UI element, providing additional information."}
            </p>
          </div>
          <div
            aria-hidden="true"
            style={{
              background: "#0F172B",
              height: 10,
              marginRight: 20,
              transform: "translateY(-5px) rotate(45deg)",
              width: 10
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function ActionBarAddressRow({
  brand,
  address
}: {
  brand: DisplayBrandId;
  address: ActionBarAddress;
}) {
  const state = address.state ?? "Saved";
  const textPrimary = getPrimaryTextColor(brand);
  const textSecondary = getSecondaryTextColor(brand);
  const textBrand = getBrandPrimaryColor(brand);
  const iconColor = state === "Saved" ? textBrand : getMutedTextColor(brand);
  const title = address.title ?? (state === "Saved" ? "Home" : "No saved address");
  const description = address.addressLine ?? (state === "Saved" ? "Tower C, Sector 39, Medicity, Gurgaon..." : "Add an address");
  const actionLabel = address.actionLabel ?? (state === "Saved" ? "Change" : "Add new");

  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: 8,
        minHeight: 52,
        padding: "8px 12px",
        width: "100%"
      }}
    >
      <div
        style={{
          alignItems: "center",
          border: `1px solid ${getDividerColor(brand)}`,
          borderRadius: toPx(getRequiredThemeTokenValue(brand, "radius.pill")),
          boxSizing: "border-box",
          display: "inline-flex",
          flex: "0 0 auto",
          justifyContent: "center",
          padding: 6
        }}
      >
        <Icon
          brand={brand}
          decorative
          name={address.iconName ?? (state === "Saved" ? "map-filled" : "map-filled")}
          style={{ color: iconColor }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          minWidth: 0
        }}
      >
        <p
          style={{
            ...getTypographyStyles(brand, "body2Semibold"),
            color: textPrimary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {title}
        </p>
        <p
          style={{
            ...getTypographyStyles(brand, "body2Regular"),
            color: textSecondary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {description}
        </p>
      </div>

      <InlineAction
        brand={brand}
        color={textBrand}
        icon={state === "Empty" ? <Icon brand={brand} decorative name="plus-large-filled" style={{ color: textBrand }} /> : undefined}
        label={actionLabel}
      />
    </div>
  );
}

function ActionBarSurfaceButton({
  action,
  brand,
  size = "Large",
  style,
  variant = "Solid"
}: {
  action: ActionBarButtonAction;
  brand: DisplayBrandId;
  size?: ButtonProps["size"];
  style?: CSSProperties;
  variant?: ButtonProps["styleVariant"];
}) {
  return (
    <Button
      brand={brand}
      disabled={action.disabled}
      leadingIcon={action.leadingIcon}
      onClick={action.onClick}
      shape="Regular"
      size={size}
      style={style}
      styleVariant={variant}
      trailingIcon={action.trailingIcon}
      type={action.type ?? "button"}
    >
      {wrapButtonLabel(brand, action.label)}
    </Button>
  );
}

function ActionBarActionRow({
  action,
  brand
}: {
  action: ActionBarAction;
  brand: DisplayBrandId;
}) {
  const resolvedAction = action.variant ? action : DEFAULT_ACTION;
  const textPrimary = getPrimaryTextColor(brand);
  const textSecondary = getSecondaryTextColor(brand);
  const textMuted = getMutedTextColor(brand);
  const brandPrimary = getBrandPrimaryColor(brand);
  const brandPrimaryHover = getBrandPrimaryHoverColor(brand);
  const brandSubtle = getBrandSubtleSurfaceColor(brand);
  const destructiveBorder = "#FFE2E2";
  const destructiveSurface = ACTION_BAR_FEEDBACK_FALLBACKS.negativeSurface;
  const destructiveText = ACTION_BAR_FEEDBACK_FALLBACKS.negativeText;

  if (resolvedAction.variant === "Loader") {
    return (
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: 12,
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <ProgressBar
          brand={brand}
          percentage={resolvedAction.progressPercentage ?? 40}
          showPercentage={false}
          style={{ flex: "1 1 auto", minWidth: 0 }}
          width="100%"
        />
        <ActionBarSurfaceButton
          action={resolvedAction.cancelAction ?? { label: "Cancel" }}
          brand={brand}
          size="Medium"
          style={{
            background: destructiveSurface,
            border: `1px solid ${destructiveBorder}`,
            color: destructiveText,
            minWidth: "fit-content"
          }}
          variant="Destructive"
        />
      </div>
    );
  }

  if (resolvedAction.variant === "Chat Bar") {
    return (
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <ChatBar
          attachmentIconName={resolvedAction.attachmentIconName ?? "circle-plus-outline"}
          brand={brand}
          forceState={resolvedAction.state ?? "Default"}
          sendIconName={resolvedAction.sendIconName ?? "send-line"}
          value={typeof resolvedAction.value === "string" ? resolvedAction.value : ""}
        />
      </div>
    );
  }

  if (resolvedAction.variant === "Payment Strip") {
    return (
      <div
        style={{
          boxSizing: "border-box",
          padding: `${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: brandPrimary,
            borderRadius: toPx(getRequiredThemeTokenValue(brand, "radius.alt.lg")),
            boxSizing: "border-box",
            display: "flex",
            gap: 16,
            justifyContent: "space-between",
            minHeight: 44,
            padding: "8px 16px",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: 3, minWidth: 0 }}>
            <p style={{ ...getTypographyStyles(brand, "body3Medium"), color: "#FFFFFF" }}>
              {resolvedAction.productCountLabel ?? "1 product"}
            </p>
            <div style={{ display: "flex", gap: 3, minWidth: 0 }}>
              <p style={{ ...getTypographyStyles(brand, "heading4Medium"), color: "#FFFFFF" }}>
                {resolvedAction.totalPrefix ?? "Total:"}
              </p>
              <p style={{ ...getTypographyStyles(brand, "heading4Semibold"), color: "#FFFFFF" }}>
                {resolvedAction.totalAmount ?? "₹529"}
              </p>
            </div>
          </div>

          <div style={{ alignItems: "center", display: "inline-flex", gap: 4 }}>
            <span style={{ ...getTypographyStyles(brand, "heading4Semibold"), color: "#FFFFFF" }}>
              {resolvedAction.actionLabel ?? "Continue"}
            </span>
            {resolvedAction.actionTrailingIcon ?? (
              <Icon brand={brand} decorative name="arrow-right-outline" style={{ color: "#FFFFFF" }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (resolvedAction.variant === "Payment Option") {
    return (
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: 16,
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <div style={{ alignItems: "center", display: "flex", flex: "1 1 auto", gap: 8, minWidth: 0 }}>
          <div
            style={{
              alignItems: "center",
              background: "#F8FAFC",
              borderRadius: toPx(getRequiredThemeTokenValue(brand, "radius.pill")),
              display: "inline-flex",
              height: 32,
              justifyContent: "center",
              overflow: "hidden",
              width: 32
            }}
          >
            {resolvedAction.media ?? (
              <Icon brand={brand} decorative name="shield-check-filled" style={{ color: textMuted, fontSize: 14 }} />
            )}
          </div>
          <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <p style={{ ...getTypographyStyles(brand, "heading4Bold"), color: textPrimary }}>
              {resolvedAction.amount ?? "₹1200"}
            </p>
            <p
              style={{
                ...getTypographyStyles(brand, "body3Medium"),
                color: textSecondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {resolvedAction.subtitle ?? "Payment method"}
            </p>
          </div>
        </div>

        <ActionBarSurfaceButton
          action={
            resolvedAction.buttonAction ?? {
              label: "Pay now",
              trailingIcon: <Icon name="arrow-right-outline" decorative />
            }
          }
          brand={brand}
          style={{ minWidth: "fit-content" }}
        />
      </div>
    );
  }

  if (resolvedAction.variant === "Payment Breakdown") {
    return (
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: 16,
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <p style={{ ...getTypographyStyles(brand, "heading4Bold"), color: textPrimary }}>
            {resolvedAction.amount ?? "₹1200"}
          </p>
          <InlineAction brand={brand} color={brandPrimary} label={resolvedAction.breakdownLabel ?? "Price breakdown"} />
        </div>

        <ActionBarSurfaceButton
          action={
            resolvedAction.buttonAction ?? {
              label: "Pay now",
              trailingIcon: <Icon name="arrow-right-outline" decorative />
            }
          }
          brand={brand}
          style={{ minWidth: "fit-content" }}
        />
      </div>
    );
  }

  if (resolvedAction.variant === "Strike Amount") {
    return (
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: 16,
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <div style={{ display: "flex", flex: "1 1 auto", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <p style={{ ...getTypographyStyles(brand, "body3Medium"), color: textSecondary }}>
            {resolvedAction.label ?? "Total amount"}
          </p>
          <div style={{ alignItems: "center", display: "flex", gap: 4 }}>
            <p style={{ ...getTypographyStyles(brand, "heading4Bold"), color: textPrimary }}>
              {resolvedAction.amount ?? "₹1999"}
            </p>
            <p
              style={{
                ...getTypographyStyles(brand, "body2Medium"),
                color: textSecondary,
                textDecoration: "line-through"
              }}
            >
              {resolvedAction.originalAmount ?? "₹2999"}
            </p>
          </div>
        </div>

        <ActionBarSurfaceButton
          action={
            resolvedAction.buttonAction ?? {
              label: "Pay now",
              trailingIcon: <Icon name="arrow-right-outline" decorative />
            }
          }
          brand={brand}
          style={{ minWidth: "fit-content" }}
        />
      </div>
    );
  }

  if (resolvedAction.variant === "Progressive") {
    return (
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <InlineAction
          brand={brand}
          color={textPrimary}
          icon={resolvedAction.backLeadingIcon ?? <Icon name="arrow-left-filled" decorative style={{ color: textPrimary }} />}
          label={resolvedAction.backLabel ?? "Back"}
        />

        <ActionBarSurfaceButton
          action={
            resolvedAction.buttonAction ?? {
              label: "Proceed to next",
              trailingIcon: <Icon name="arrow-right-outline" decorative />
            }
          }
          brand={brand}
          style={{ minWidth: "fit-content" }}
        />
      </div>
    );
  }

  if (resolvedAction.variant === "Button Group") {
    return (
      <div
        style={{
          boxSizing: "border-box",
          padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
          width: "100%"
        }}
      >
        <ButtonGroup
          brand={brand}
          primaryAction={{
            label: wrapButtonLabel(brand, resolvedAction.primaryAction?.label ?? "Label"),
            leadingIcon:
              resolvedAction.primaryAction?.leadingIcon ??
              <Icon name="sparkle-filled" decorative />,
            onClick: resolvedAction.primaryAction?.onClick,
            trailingIcon:
              resolvedAction.primaryAction?.trailingIcon ??
              <Icon name="arrow-right-outline" decorative />,
            type: resolvedAction.primaryAction?.type
          }}
          secondaryAction={
            resolvedAction.secondaryAction
              ? {
                  label: wrapButtonLabel(brand, resolvedAction.secondaryAction.label),
                  leadingIcon: resolvedAction.secondaryAction.leadingIcon,
                  onClick: resolvedAction.secondaryAction.onClick,
                  trailingIcon: resolvedAction.secondaryAction.trailingIcon,
                  type: resolvedAction.secondaryAction.type
                }
              : {
                  label: wrapButtonLabel(brand, "Label"),
                  leadingIcon: <Icon name="sparkle-filled" decorative />,
                  trailingIcon: <Icon name="arrow-right-outline" decorative />
                }
          }
          shape="Regular"
          size="Large"
          type="Vertical"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: 16,
        padding: `${ACTION_BAR_ROW_PADDING_BLOCK}px ${ACTION_BAR_ROW_PADDING_INLINE}px`,
        width: "100%"
      }}
    >
      <ChatBar
        attachmentIconName="circle-plus-outline"
        brand={brand}
        sendIconName="send-line"
        state="Default"
      />
      <div
        style={{
          alignItems: "center",
          background: brandSubtle,
          border: `1px solid ${brandPrimaryHover}`,
          borderRadius: toPx(getRequiredThemeTokenValue(brand, "radius.alt.lg")),
          color: brandPrimaryHover,
          display: "inline-flex",
          minHeight: 44,
          padding: "12px 16px"
        }}
      >
        {textSecondary}
      </div>
    </div>
  );
}

function ActionBarBottom({
  bottomInfo,
  brand
}: {
  bottomInfo: ActionBarBottomInfo;
  brand: DisplayBrandId;
}) {
  const iconColor = getSecondaryTextColor(brand);
  const textPrimary = getPrimaryTextColor(brand);
  const brandPrimary = getBrandPrimaryColor(brand);

  return (
    <div
      style={{
        alignItems: "center",
        background: getSubtleSurfaceColor(brand),
        boxSizing: "border-box",
        display: "flex",
        gap: 4,
        minHeight: 33,
        padding: "8px 12px",
        width: "100%"
      }}
    >
      <div style={{ alignItems: "center", display: "flex", flex: "1 1 auto", gap: 4, minWidth: 0 }}>
        {bottomInfo.showIcon === false
          ? null
          : renderIconNode(brand, undefined, bottomInfo.iconName ?? "info-outline", iconColor, "sm")}
        <p
          style={{
            ...getTypographyStyles(brand, "body3Regular"),
            color: textPrimary,
            flex: "1 1 auto",
            minWidth: 0
          }}
        >
          {bottomInfo.message}
        </p>
      </div>

      {bottomInfo.actionLabel ? (
        <span style={{ ...getTypographyStyles(brand, "body2Semibold"), color: brandPrimary }}>
          {bottomInfo.actionLabel}
        </span>
      ) : null}
    </div>
  );
}

function ActionBarSecure({
  brand,
  secureStrip
}: {
  brand: DisplayBrandId;
  secureStrip: ActionBarSecureStrip;
}) {
  const muted = getMutedTextColor(brand);

  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: 4,
        justifyContent: "center",
        minHeight: 32,
        overflow: "hidden",
        padding: "4px 12px",
        width: "100%"
      }}
    >
      {secureStrip.showIcon === false ? null : (
        <Icon brand={brand} decorative name="shield-check-filled" size="sm" style={{ color: muted }} />
      )}
      <p style={{ ...getTypographyStyles(brand, "body3Regular"), color: muted }}>
        {secureStrip.text ?? "Secured by Cars24 security"}
      </p>
      {secureStrip.slot1 ? <span style={{ display: "inline-flex", flex: "0 0 auto" }}>{secureStrip.slot1}</span> : null}
      {secureStrip.slot2 ? <span style={{ display: "inline-flex", flex: "0 0 auto" }}>{secureStrip.slot2}</span> : null}
    </div>
  );
}

function ActionBarHomeIndicator({ brand }: { brand: DisplayBrandId }) {
  const inverse = String(getThemeTokenValue(brand, "color.surface.inverse") ?? "#101828");

  return (
    <div
      style={{
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        padding: "21px 0 8px",
        width: "100%"
      }}
    >
      <div
        aria-hidden="true"
        style={{
          background: inverse,
          borderRadius: 30,
          height: 5,
          opacity: 0.75,
          width: 134
        }}
      />
    </div>
  );
}

/**
 * Canonical mobile action surface that composes message, address, CTA, and assurance rows
 * from the Action Bar Figma set.
 */
export function ActionBar({
  action = DEFAULT_ACTION,
  address,
  bottomInfo,
  brand = "Cars24",
  checkmarkStrip,
  className,
  divider = true,
  infoMessage,
  offerStrip,
  secureStrip,
  showHomeIndicator = false,
  style,
  ...rest
}: ActionBarProps) {
  return (
    <div {...rest} className={className} style={{ ...getContainerStyles(style), background: getCanvasColor(brand) }}>
      {divider ? renderTopDivider(brand) : null}
      {offerStrip ? <ActionBarOffer brand={brand} offerStrip={offerStrip} /> : infoMessage ? <ActionBarTopInfo brand={brand} infoMessage={infoMessage} /> : null}
      {checkmarkStrip ? <ActionBarCheckmark brand={brand} checkmarkStrip={checkmarkStrip} /> : null}
      {address ? <ActionBarAddressRow brand={brand} address={address} /> : null}
      {action ? <ActionBarActionRow action={action} brand={brand} /> : null}
      {bottomInfo ? <ActionBarBottom bottomInfo={bottomInfo} brand={brand} /> : null}
      {secureStrip ? <ActionBarSecure brand={brand} secureStrip={secureStrip} /> : null}
      {showHomeIndicator ? <ActionBarHomeIndicator brand={brand} /> : null}
    </div>
  );
}
