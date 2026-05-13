import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue } from "../theme";

export type CounterBadgeColor = "Brand" | "Green" | "Red" | "White";
export type CounterBadgeSize = "Small" | "Large";

type CounterBadgeSizeConfig = {
  fontSize: string;
  letterSpacing: string;
  lineHeight: string;
  paddingBlock: string;
};

type CounterBadgeToneConfig = {
  background: string;
  foreground: string;
};

const COUNTER_BADGE_BORDER_RADIUS = "var(--cars24-theme-radius-full, 999px)";
const COUNTER_BADGE_PADDING_INLINE = "var(--cars24-misc-gap-4, 4px)";

const COUNTER_BADGE_SIZE_CONFIG: Record<CounterBadgeSize, CounterBadgeSizeConfig> = {
  Small: {
    fontSize: "var(--cars24-typography-size-utility-fine-print, 9px)",
    letterSpacing: "var(--cars24-typography-letter-spacing-utility-fine-print, 0px)",
    lineHeight: "var(--cars24-typography-line-height-utility-fine-print, 13px)",
    paddingBlock: "0px"
  },
  Large: {
    fontSize: "var(--cars24-typography-size-utility-label-4, 11px)",
    letterSpacing: "var(--cars24-typography-letter-spacing-utility-label-4, 0px)",
    lineHeight: "var(--cars24-typography-line-height-utility-label-4, 14px)",
    paddingBlock: "var(--cars24-misc-gap-2, 2px)"
  }
};

const COUNTER_BADGE_TONE_CONFIG: Record<CounterBadgeColor, CounterBadgeToneConfig> = {
  Brand: {
    background: "var(--cars24-semantic-bg-brand-base, #4736FE)",
    foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
  },
  Green: {
    background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
    foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
  },
  Red: {
    background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
    foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
  },
  White: {
    background: "var(--cars24-semantic-bg-primary, #FFFFFF)",
    foreground: "var(--cars24-semantic-text-primary, #020617)"
  }
};

export interface CounterBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  brand?: DisplayBrandId;
  color?: CounterBadgeColor;
  size?: CounterBadgeSize;
  label?: ReactNode;
  children?: ReactNode;
}

/**
 * Compact count and state pill for short numeric or status signals attached to nearby content.
 */
export function CounterBadge({
  brand = "Cars24",
  color = "Brand",
  size = "Small",
  label = "99+",
  children,
  style,
  ...rest
}: CounterBadgeProps) {
  const sizeConfig = COUNTER_BADGE_SIZE_CONFIG[size];
  const toneConfig = COUNTER_BADGE_TONE_CONFIG[color];
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const content = children ?? label;

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: toneConfig.background,
    borderRadius: COUNTER_BADGE_BORDER_RADIUS,
    boxSizing: "border-box",
    color: toneConfig.foreground,
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    paddingBlock: sizeConfig.paddingBlock,
    paddingInline: COUNTER_BADGE_PADDING_INLINE,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    width: "fit-content",
    ...style
  };

  const labelStyles: CSSProperties = {
    color: toneConfig.foreground,
    display: "block",
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: sizeConfig.fontSize,
    fontWeight,
    letterSpacing: sizeConfig.letterSpacing,
    lineHeight: sizeConfig.lineHeight,
    margin: 0,
    textAlign: "center"
  };

  return (
    <span {...rest} style={rootStyles}>
      <span style={labelStyles}>{content}</span>
    </span>
  );
}
