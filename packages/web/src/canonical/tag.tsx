import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue } from "../theme";

export type TagColor = "Red" | "Green" | "Neutral" | "Brand blue" | "Blue" | "Orange";
export type TagSize = "Small" | "Large";
export type TagPriority = "High" | "Low";

type TagSizeConfig = {
  height: string;
  paddingBlock: string;
  paddingInline: string;
};

type TagToneConfig = {
  background: string;
  foreground: string;
};

const TAG_BORDER_RADIUS = "var(--cars24-theme-radius-full, 999px)";
const TAG_FONT_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const TAG_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-4, 14px)";
const TAG_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-4, 0px)";
const TAG_INVERSE_FOREGROUND = "var(--cars24-semantic-text-primary-inverse, #FFFFFF)";

const TAG_SIZE_CONFIG: Record<TagSize, TagSizeConfig> = {
  Small: {
    height: "var(--cars24-misc-size-16, 16px)",
    paddingBlock: "0px",
    paddingInline: "var(--cars24-misc-gap-6, 6px)"
  },
  Large: {
    height: "var(--cars24-misc-size-20, 20px)",
    paddingBlock: "var(--cars24-misc-gap-2, 2px)",
    paddingInline: "var(--cars24-misc-gap-8, 8px)"
  }
};

const TAG_TONE_CONFIG: Record<TagColor, Record<TagPriority, TagToneConfig>> = {
  Red: {
    High: {
      background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
      foreground: TAG_INVERSE_FOREGROUND
    },
    Low: {
      background: "var(--cars24-semantic-bg-danger-subtle, #FEE2E2)",
      foreground: "var(--cars24-semantic-text-danger-base, #DC2626)"
    }
  },
  Green: {
    High: {
      background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
      foreground: TAG_INVERSE_FOREGROUND
    },
    Low: {
      background: "var(--cars24-semantic-bg-success-subtle, #E4F9E0)",
      foreground: "var(--cars24-semantic-text-success-base, #1C9C1C)"
    }
  },
  Neutral: {
    High: {
      background: "var(--cars24-semantic-bg-secondary-inverse-hover, #404040)",
      foreground: TAG_INVERSE_FOREGROUND
    },
    Low: {
      background: "var(--cars24-semantic-bg-tertiary, #E2E8F0)",
      foreground: "var(--cars24-semantic-text-primary, #020617)"
    }
  },
  "Brand blue": {
    High: {
      background: "var(--cars24-semantic-bg-brand-base, #4736FE)",
      foreground: TAG_INVERSE_FOREGROUND
    },
    Low: {
      background: "var(--cars24-semantic-bg-brand-subtle, #E1E3FD)",
      foreground: "var(--cars24-semantic-text-brand-base, #4736FE)"
    }
  },
  Blue: {
    High: {
      background: "var(--cars24-semantic-bg-info-base, #296FE3)",
      foreground: TAG_INVERSE_FOREGROUND
    },
    Low: {
      background: "var(--cars24-semantic-bg-info-subtle, #DBEBFE)",
      foreground: "var(--cars24-semantic-text-info-base, #296FE3)"
    }
  },
  Orange: {
    High: {
      background: "var(--cars24-semantic-bg-warning-base, #E17100)",
      foreground: TAG_INVERSE_FOREGROUND
    },
    Low: {
      background: "var(--cars24-semantic-bg-warning-subtle, #FEF3C6)",
      foreground: "var(--cars24-semantic-text-warning-base, #E17100)"
    }
  }
};

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  brand?: DisplayBrandId;
  color?: TagColor;
  size?: TagSize;
  priority?: TagPriority;
  label?: ReactNode;
  children?: ReactNode;
}

/**
 * Compact metadata pill used for short category, state, or contextual labels.
 */
export function Tag({
  brand = "Cars24",
  color = "Red",
  size = "Small",
  priority = "High",
  label = "Label",
  children,
  style,
  ...rest
}: TagProps) {
  const sizeConfig = TAG_SIZE_CONFIG[size];
  const toneConfig = TAG_TONE_CONFIG[color][priority];
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const content = children ?? label;

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: toneConfig.background,
    borderRadius: TAG_BORDER_RADIUS,
    boxSizing: "border-box",
    color: toneConfig.foreground,
    display: "inline-flex",
    flexShrink: 0,
    height: sizeConfig.height,
    justifyContent: "center",
    paddingBlock: sizeConfig.paddingBlock,
    paddingInline: sizeConfig.paddingInline,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    width: "fit-content",
    ...style
  };

  const labelStyles: CSSProperties = {
    color: toneConfig.foreground,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: TAG_FONT_SIZE,
    fontWeight,
    letterSpacing: TAG_LETTER_SPACING,
    lineHeight: TAG_LINE_HEIGHT,
    margin: 0
  };

  return (
    <span {...rest} style={rootStyles}>
      <span style={labelStyles}>{content}</span>
    </span>
  );
}
