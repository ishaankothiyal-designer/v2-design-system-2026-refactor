import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export type DecorationBadgeStyle = "Style 1" | "Style 2";
export type DecorationBadgeColor =
  | "Purple"
  | "Yellow"
  | "Red"
  | "Gray"
  | "Black"
  | "Green";
export type DecorationBadgeType =
  | "GST Sale"
  | "Price Drop"
  | "Hot Deal"
  | "Top picks"
  | "Features"
  | "Recommended"
  | "New Stock"
  | "In Demand"
  | "Type15"
  | "Upcoming"
  | "Booked"
  | "Reserved"
  | "Under Service"
  | "Sold";

type DecorationBadgeTone = {
  background: string;
  foreground: string;
};

type DecorationBadgeTypeConfig = DecorationBadgeTone & {
  label: string;
  showIcon: boolean;
};

const STYLE_1_ICON_NAME = "placeholder-generate-outline" satisfies IconName;
const STYLE_2_ICON_NAME = "star-filled" satisfies IconName;
const STYLE_1_HEIGHT = 28;
const STYLE_2_HEIGHT = "var(--cars24-misc-gap-20, 20px)";
const STYLE_1_CORNER_RADIUS = "var(--cars24-theme-radius-xl, 16px)";
const STYLE_1_GAP = "var(--cars24-misc-gap-4, 4px)";
const STYLE_2_GAP = "var(--cars24-misc-gap-4, 4px)";
const STYLE_1_FONT_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const STYLE_1_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-4, 14px)";
const STYLE_2_FONT_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const STYLE_2_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-4, 14px)";
const LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-4, 0px)";
const INVERSE_FOREGROUND = "var(--cars24-semantic-text-primary-inverse, #FFFFFF)";
const PRIMARY_FOREGROUND = "var(--cars24-semantic-text-primary, #020617)";
const STYLE_2_CAP_PATH =
  "M0 0L0.511134 4.00107e-07C6.54688 5.12479e-06 11.7976 4.13309 13.2153 9.99998C14.6329 15.8669 19.8837 20 25.9194 20L27 20L0 20V0Z";

const STYLE_1_TONES: Record<DecorationBadgeColor, DecorationBadgeTone> = {
  Purple: {
    background: "var(--cars24-primitive-pop-purple-500, #D300F4)",
    foreground: INVERSE_FOREGROUND
  },
  Yellow: {
    background: "var(--cars24-primitive-orange-400, #FF7234)",
    foreground: INVERSE_FOREGROUND
  },
  Red: {
    background: "var(--cars24-primitive-red-500, #EF4444)",
    foreground: INVERSE_FOREGROUND
  },
  Gray: {
    background: "var(--cars24-primitive-slate-200, #E2E8F0)",
    foreground: PRIMARY_FOREGROUND
  },
  Black: {
    background: "var(--cars24-primitive-slate-900, #111827)",
    foreground: INVERSE_FOREGROUND
  },
  Green: {
    background: "var(--cars24-primitive-mint-green-700, #2AA66B)",
    foreground: INVERSE_FOREGROUND
  }
};

const STYLE_2_TYPES: Record<DecorationBadgeType, DecorationBadgeTypeConfig> = {
  "GST Sale": {
    background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
    foreground: INVERSE_FOREGROUND,
    label: "GST Sale",
    showIcon: true
  },
  "Price Drop": {
    background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
    foreground: INVERSE_FOREGROUND,
    label: "Price Drop",
    showIcon: true
  },
  "Hot Deal": {
    background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
    foreground: INVERSE_FOREGROUND,
    label: "Hot Deal",
    showIcon: true
  },
  "Top picks": {
    background: "var(--cars24-semantic-bg-brand-base, #4736FE)",
    foreground: INVERSE_FOREGROUND,
    label: "Top picks",
    showIcon: true
  },
  Features: {
    background: "var(--cars24-semantic-bg-brand-base, #4736FE)",
    foreground: INVERSE_FOREGROUND,
    label: "Featured",
    showIcon: true
  },
  Recommended: {
    background: "var(--cars24-semantic-bg-brand-base, #4736FE)",
    foreground: INVERSE_FOREGROUND,
    label: "Recommended",
    showIcon: true
  },
  "New Stock": {
    background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
    foreground: INVERSE_FOREGROUND,
    label: "New Stock",
    showIcon: true
  },
  "In Demand": {
    background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
    foreground: INVERSE_FOREGROUND,
    label: "In Demand",
    showIcon: true
  },
  Type15: {
    background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
    foreground: INVERSE_FOREGROUND,
    label: "Brand New",
    showIcon: true
  },
  Upcoming: {
    background: "var(--cars24-primitive-bright-blue-500, #3C8BFB)",
    foreground: INVERSE_FOREGROUND,
    label: "Upcoming",
    showIcon: false
  },
  Booked: {
    background: "var(--cars24-primitive-amber-600, #E17100)",
    foreground: INVERSE_FOREGROUND,
    label: "Booked",
    showIcon: true
  },
  Reserved: {
    background: "var(--cars24-primitive-amber-600, #E17100)",
    foreground: INVERSE_FOREGROUND,
    label: "Reserved",
    showIcon: true
  },
  "Under Service": {
    background: "var(--cars24-primitive-amber-600, #E17100)",
    foreground: INVERSE_FOREGROUND,
    label: "Under Service",
    showIcon: true
  },
  Sold: {
    background: "var(--cars24-primitive-slate-400, #94A3B8)",
    foreground: INVERSE_FOREGROUND,
    label: "Sold",
    showIcon: true
  }
};

export interface DecorationBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  brand?: DisplayBrandId;
  styleVariant?: DecorationBadgeStyle;
  color?: DecorationBadgeColor;
  type?: DecorationBadgeType;
  label?: ReactNode;
  children?: ReactNode;
  showIcon?: boolean;
  icon?: ReactNode;
}

function renderDefaultIcon(
  brand: DisplayBrandId,
  iconName: IconName,
  color: string
) {
  return (
    <Icon
      brand={brand}
      name={iconName}
      decorative
      style={{
        color,
        fontSize: 12
      }}
    />
  );
}

function makeTypographyStyles(
  brand: DisplayBrandId,
  fontWeightPath: "typography.fontWeight.medium" | "typography.fontWeight.semibold",
  fontSize: string,
  lineHeight: string,
  color: string
): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize,
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: LETTER_SPACING,
    lineHeight,
    margin: 0
  };
}

function DecorationBadgeCap({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 27 20"
      style={{
        color,
        display: "block",
        flexShrink: 0,
        height: 20,
        transform: "scaleY(-1)",
        width: 27
      }}
    >
      <path d={STYLE_2_CAP_PATH} fill="currentColor" />
    </svg>
  );
}

/**
 * Decorative metadata pill used for promo, merchandising, and inventory state labels.
 * Mirrors the Figma "Decoration badge" component with both style families.
 */
export function DecorationBadge({
  brand = "Cars24",
  styleVariant = "Style 1",
  color = "Purple",
  type = "GST Sale",
  label,
  children,
  showIcon = true,
  icon,
  style,
  ...rest
}: DecorationBadgeProps) {
  const content = children ?? label;

  if (styleVariant === "Style 2") {
    const config = STYLE_2_TYPES[type];
    const resolvedContent = content ?? config.label;
    const shouldShowIcon = showIcon && config.showIcon;
    const resolvedIcon =
      icon ?? renderDefaultIcon(brand, STYLE_2_ICON_NAME, config.foreground);

    return (
      <span
        {...rest}
        style={{
          alignItems: "center",
          display: "inline-flex",
          flexShrink: 0,
          verticalAlign: "middle",
          width: "fit-content",
          ...style
        }}
      >
        <span
          style={{
            alignItems: "center",
            background: config.background,
            boxSizing: "border-box",
            color: config.foreground,
            display: "inline-flex",
            gap: shouldShowIcon ? STYLE_2_GAP : 0,
            height: STYLE_2_HEIGHT,
            justifyContent: "center",
            paddingInlineStart: "var(--cars24-misc-gap-12, 12px)",
            whiteSpace: "nowrap"
          }}
        >
          {shouldShowIcon ? (
            <span
              style={{
                alignItems: "center",
                color: config.foreground,
                display: "inline-flex",
                flexShrink: 0,
                height: 12,
                justifyContent: "center",
                width: 12
              }}
            >
              {resolvedIcon}
            </span>
          ) : null}
          <span
            style={makeTypographyStyles(
              brand,
              "typography.fontWeight.semibold",
              STYLE_2_FONT_SIZE,
              STYLE_2_LINE_HEIGHT,
              config.foreground
            )}
          >
            {resolvedContent}
          </span>
        </span>
        <DecorationBadgeCap color={config.background} />
      </span>
    );
  }

  const tone = STYLE_1_TONES[color];
  const resolvedContent = content ?? "Label";
  const resolvedIcon = icon ?? renderDefaultIcon(brand, STYLE_1_ICON_NAME, tone.foreground);

  return (
    <span
      {...rest}
      style={{
        alignItems: "center",
        background: tone.background,
        borderBottomRightRadius: STYLE_1_CORNER_RADIUS,
        boxSizing: "border-box",
        color: tone.foreground,
        display: "inline-flex",
        flexShrink: 0,
        gap: showIcon ? STYLE_1_GAP : 0,
        height: STYLE_1_HEIGHT,
        justifyContent: "center",
        maxWidth: 140,
        overflow: "hidden",
        paddingBlock: 6,
        paddingInline: 10,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        width: "fit-content",
        ...style
      }}
    >
      {showIcon ? (
        <span
          style={{
            alignItems: "center",
            color: tone.foreground,
            display: "inline-flex",
            flexShrink: 0,
            height: 12,
            justifyContent: "center",
            width: 12
          }}
        >
          {resolvedIcon}
        </span>
      ) : null}
      <span
        style={{
          ...makeTypographyStyles(
            brand,
            "typography.fontWeight.medium",
            STYLE_1_FONT_SIZE,
            STYLE_1_LINE_HEIGHT,
            tone.foreground
          ),
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {resolvedContent}
      </span>
    </span>
  );
}
