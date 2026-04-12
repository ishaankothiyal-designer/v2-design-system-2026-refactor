import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export type RatingsSize = "Small" | "Medium";
export type RatingStateValue = "Default" | "Half Star" | "Full Star";
export type RatingStateSize = "Small" | "Medium" | "Large";

type RatingBadgeTone = "Danger" | "Warning" | "Success";

const RATING_EMPTY_COLOR = "var(--cars24-semantic-icon-disabled-subtle, #CBD5E1)";
const RATING_FILLED_COLOR = "var(--cars24-primitive-amber-500, #FD9A00)";
const RATING_BADGE_BACKGROUNDS: Record<RatingBadgeTone, string> = {
  Danger: "var(--cars24-semantic-bg-danger-base, #DC2626)",
  Warning: "var(--cars24-semantic-bg-warning-base, #E17100)",
  Success: "var(--cars24-semantic-bg-success-base, #1C9C1C)"
};

const RATING_LOCKUP_GAP: Record<RatingsSize, string> = {
  Small: "var(--cars24-misc-gap-6, 6px)",
  Medium: "var(--cars24-misc-gap-8, 8px)"
};

const RATING_BADGE_HEIGHT: Record<RatingsSize, string> = {
  Small: "var(--cars24-misc-size-16, 16px)",
  Medium: "var(--cars24-misc-size-20, 20px)"
};

const RATING_BADGE_PADDING_INLINE: Record<RatingsSize, string> = {
  Small: "var(--cars24-misc-gap-6, 6px)",
  Medium: "var(--cars24-misc-gap-8, 8px)"
};

const RATING_BADGE_PADDING_BLOCK: Record<RatingsSize, string> = {
  Small: "0px",
  Medium: "var(--cars24-misc-gap-2, 2px)"
};

const RATING_BADGE_FONT_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const RATING_BADGE_LINE_HEIGHT = "var(--cars24-typography-line-height-utility-label-4, 14px)";
const RATING_BADGE_LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-4, 0px)";
const LARGE_RATING_STATE_SIZE = 32;
const RATING_STATE_GLYPH_SCALE = 0.6814;
const DEFAULT_RATING = 0;
const DEFAULT_MAX = 5;
const RATING_STEP = 0.5;

export interface RatingStateProps extends HTMLAttributes<HTMLSpanElement> {
  brand?: DisplayBrandId;
  size?: RatingStateSize;
  state?: RatingStateValue;
}

export interface RatingsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  labelFormatter?: (value: number) => ReactNode;
  max?: number;
  rating?: number;
  size?: RatingsSize;
}

function getRatingStateIconName(state: RatingStateValue) {
  if (state === "Half Star") {
    return "haft-rating";
  }

  return "empty-full-rating";
}

function getRatingStateColor(state: RatingStateValue) {
  return state === "Default" ? RATING_EMPTY_COLOR : RATING_FILLED_COLOR;
}

function getRatingStateSizePx(brand: DisplayBrandId, size: RatingStateSize) {
  if (size === "Small") {
    return Number(getRequiredThemeTokenValue(brand, "icon.size.sm"));
  }

  if (size === "Medium") {
    return Number(getRequiredThemeTokenValue(brand, "icon.size.lg"));
  }

  return LARGE_RATING_STATE_SIZE;
}

function clampRating(value: number, max: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_RATING;
  }

  const normalized = Math.round(value / RATING_STEP) * RATING_STEP;
  return Math.min(Math.max(normalized, 0), max);
}

function getStarState(index: number, rating: number): RatingStateValue {
  const starValue = index + 1;

  if (rating >= starValue) {
    return "Full Star";
  }

  if (rating >= starValue - RATING_STEP) {
    return "Half Star";
  }

  return "Default";
}

function getRatingBadgeTone(rating: number): RatingBadgeTone {
  if (rating <= 0) {
    return "Danger";
  }

  if (rating >= 4) {
    return "Success";
  }

  return "Warning";
}

function formatRatingLabel(value: number) {
  return value.toFixed(1);
}

/**
 * Single rating glyph used by the Ratings lockup and the state matrix stories.
 */
export function RatingState({
  brand = "Cars24",
  size = "Small",
  state = "Default",
  style,
  ...rest
}: RatingStateProps) {
  const stateSize = getRatingStateSizePx(brand, size);
  const iconSize = stateSize * RATING_STATE_GLYPH_SCALE;

  return (
    <span
      {...rest}
      style={{
        alignItems: "center",
        color: getRatingStateColor(state),
        display: "inline-flex",
        flexShrink: 0,
        fontSize: `${stateSize}px`,
        height: `${stateSize}px`,
        justifyContent: "center",
        lineHeight: 1,
        width: `${stateSize}px`,
        ...style
      }}
    >
      <Icon
        decorative
        name={getRatingStateIconName(state)}
        style={{ color: getRatingStateColor(state), fontSize: `${iconSize}px` }}
      />
    </span>
  );
}

/**
 * Canonical rating lockup with the five-star scale and value pill from the Figma component.
 */
export function Ratings({
  brand = "Cars24",
  labelFormatter = formatRatingLabel,
  max = DEFAULT_MAX,
  rating = DEFAULT_RATING,
  role,
  size = "Small",
  style,
  ...rest
}: RatingsProps) {
  const resolvedMax = Math.max(1, Math.trunc(max));
  const resolvedRating = clampRating(rating, resolvedMax);
  const badgeTone = getRatingBadgeTone(resolvedRating);
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const inverseText = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const pillRadius = `${Number(getRequiredThemeTokenValue(brand, "radius.pill"))}px`;
  const stateSize = size === "Small" ? "Small" : "Medium";
  const ariaLabel = rest["aria-label"] ?? `Rating ${resolvedRating.toFixed(1)} out of ${resolvedMax}`;

  const badgeStyles: CSSProperties = {
    alignItems: "center",
    background: RATING_BADGE_BACKGROUNDS[badgeTone],
    borderRadius: pillRadius,
    color: inverseText,
    display: "inline-flex",
    flexShrink: 0,
    height: RATING_BADGE_HEIGHT[size],
    justifyContent: "center",
    paddingBlock: RATING_BADGE_PADDING_BLOCK[size],
    paddingInline: RATING_BADGE_PADDING_INLINE[size],
    whiteSpace: "nowrap"
  };

  const badgeLabelStyles: CSSProperties = {
    color: inverseText,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: RATING_BADGE_FONT_SIZE,
    fontWeight,
    letterSpacing: RATING_BADGE_LETTER_SPACING,
    lineHeight: RATING_BADGE_LINE_HEIGHT,
    margin: 0
  };

  return (
    <div
      {...rest}
      aria-label={ariaLabel}
      role={role ?? "img"}
      style={{
        alignItems: "center",
        display: "inline-flex",
        ...style
      }}
    >
      <div
        aria-hidden="true"
        style={{
          alignItems: size === "Small" ? "flex-start" : "center",
          display: "inline-flex",
          gap: RATING_LOCKUP_GAP[size]
        }}
      >
        <div style={{ display: "inline-flex" }}>
          {Array.from({ length: resolvedMax }, (_, index) => (
            <RatingState
              key={`rating-star-${index + 1}`}
              brand={brand}
              size={stateSize}
              state={getStarState(index, resolvedRating)}
            />
          ))}
        </div>
        <span style={badgeStyles}>
          <span style={badgeLabelStyles}>{labelFormatter(resolvedRating)}</span>
        </span>
      </div>
    </div>
  );
}
