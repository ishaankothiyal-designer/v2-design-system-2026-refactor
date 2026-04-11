import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalBadgeWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.badge"
);

export type BadgeSize = "Extra Small" | "Small" | "Medium";
export type BadgeType =
  | "Drive pink"
  | "Error"
  | "Feature"
  | "Information"
  | "Neutral"
  | "Sky surge"
  | "Success"
  | "Warning";
export type BadgePriority = "High" | "Medium" | "Low";
export type BadgePillShape = "Yes" | "No";
export type BadgeInteractionState = "default" | "hover" | "focus" | "active";

type BadgeSizeTokens = {
  minHeight: string;
  icon: string;
  gap: string;
  radius: string;
  paddingX: string;
  paddingY: string;
  pillPaddingX: string;
  fontSize: string;
  lineHeight: string;
};

type BadgeToneTokens = {
  background: string;
  text: string;
  border?: string;
};

const BADGE_SIZE_TOKENS: Record<BadgeSize, BadgeSizeTokens> = {
  "Extra Small": {
    minHeight: "20px",
    icon: "12px",
    gap: "2px",
    radius: "6px",
    paddingX: "4px",
    paddingY: "4px",
    pillPaddingX: "6px",
    fontSize: "11px",
    lineHeight: "14px"
  },
  Small: {
    minHeight: "24px",
    icon: "14px",
    gap: "2px",
    radius: "8px",
    paddingX: "4px",
    paddingY: "4px",
    pillPaddingX: "8px",
    fontSize: "12px",
    lineHeight: "16px"
  },
  Medium: {
    minHeight: "36px",
    icon: "18px",
    gap: "4px",
    radius: "12px",
    paddingX: "8px",
    paddingY: "8px",
    pillPaddingX: "10px",
    fontSize: "16px",
    lineHeight: "20px"
  }
};

const BADGE_TYPE_TOKENS: Record<
  BadgeType,
  {
    High: BadgeToneTokens;
    Medium: BadgeToneTokens;
    Low: BadgeToneTokens;
  }
> = {
  "Drive pink": {
    High: {
      background: "var(--cars24-primitive-drive-pink-600, #E519A0)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-primitive-drive-pink-50, #FFE8F7)",
      text: "var(--cars24-primitive-drive-pink-600, #E519A0)",
      border: "var(--cars24-primitive-drive-pink-600, #E519A0)"
    },
    Low: {
      background: "var(--cars24-primitive-drive-pink-50, #FFE8F7)",
      text: "var(--cars24-primitive-drive-pink-600, #E519A0)"
    }
  },
  Error: {
    High: {
      background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-danger-subtler, #FEF2F2)",
      text: "var(--cars24-semantic-text-danger-base, #DC2626)",
      border: "var(--cars24-semantic-border-danger-base, #DC2626)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-danger-subtler, #FEF2F2)",
      text: "var(--cars24-semantic-text-danger-base, #DC2626)"
    }
  },
  Feature: {
    High: {
      background: "var(--cars24-primitive-pop-purple-500, #D300F4)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-primitive-pop-purple-50, #FBE6FE)",
      text: "var(--cars24-primitive-pop-purple-500, #D300F4)",
      border: "var(--cars24-primitive-pop-purple-500, #D300F4)"
    },
    Low: {
      background: "var(--cars24-primitive-pop-purple-50, #FBE6FE)",
      text: "var(--cars24-primitive-pop-purple-500, #D300F4)"
    }
  },
  Information: {
    High: {
      background: "var(--cars24-semantic-bg-info-base, #296FE3)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-info-subtler, #F0F7FF)",
      text: "var(--cars24-semantic-text-info-base, #296FE3)",
      border: "var(--cars24-semantic-bg-info-base, #296FE3)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-info-subtler, #F0F7FF)",
      text: "var(--cars24-semantic-text-info-base, #296FE3)"
    }
  },
  Neutral: {
    High: {
      background: "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-secondary, #F1F5F9)",
      text: "var(--cars24-semantic-text-secondary, #64748B)",
      border: "var(--cars24-semantic-border-tertiary, #94A3B8)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-tertiary, #E2E8F0)",
      text: "var(--cars24-semantic-text-secondary, #64748B)"
    }
  },
  "Sky surge": {
    High: {
      background: "var(--cars24-primitive-sky-surge-700, #159DA3)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-primitive-sky-surge-50, #EFFDFD)",
      text: "var(--cars24-primitive-sky-surge-700, #159DA3)",
      border: "var(--cars24-primitive-sky-surge-700, #159DA3)"
    },
    Low: {
      background: "var(--cars24-primitive-sky-surge-100, #CEFBFA)",
      text: "var(--cars24-primitive-sky-surge-700, #159DA3)"
    }
  },
  Success: {
    High: {
      background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-success-subtler, #F4FCF4)",
      text: "var(--cars24-semantic-text-success-base, #1C9C1C)",
      border: "var(--cars24-semantic-border-success-base, #1C9C1C)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-success-subtle, #E4F9E0)",
      text: "var(--cars24-semantic-text-success-base, #1C9C1C)"
    }
  },
  Warning: {
    High: {
      background: "var(--cars24-semantic-bg-warning-base, #E17100)",
      text: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-warning-subtler, #FFFBEB)",
      text: "var(--cars24-semantic-text-warning-base, #E17100)",
      border: "var(--cars24-semantic-border-warning-base, #E17100)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-warning-subtle, #FEF3C6)",
      text: "var(--cars24-semantic-text-warning-base, #E17100)"
    }
  }
};

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => `${segment}${segment}`)
          .join("")
      : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function filterForState(state: BadgeInteractionState) {
  if (state === "hover") {
    return "brightness(0.98)";
  }

  if (state === "active") {
    return "brightness(0.94)";
  }

  return "none";
}

function resolveBadgeState({
  disabled,
  forceState,
  hovered,
  focused,
  pressed
}: {
  disabled: boolean;
  forceState: BadgeInteractionState | undefined;
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
}) {
  if (disabled) {
    return "default";
  }

  if (forceState) {
    return forceState;
  }

  if (pressed) {
    return "active";
  }

  if (focused) {
    return "focus";
  }

  if (hovered) {
    return "hover";
  }

  return "default";
}

export interface BadgeProps {
  brand?: DisplayBrandId;
  labelText?: string;
  size?: BadgeSize;
  type?: BadgeType;
  priority?: BadgePriority;
  pillShape?: BadgePillShape;
  showLeadingIcon?: boolean;
  showTrailingIcon?: boolean;
  leadingIcon?: ReactNode | null;
  trailingIcon?: ReactNode | null;
  iconLeft?: boolean;
  iconRight?: boolean;
  changeLeftIcon?: ReactNode | null;
  changeRightIcon?: ReactNode | null;
  disabled?: boolean;
  forceState?: BadgeInteractionState;
  onDismiss?: () => void;
  className?: string;
  style?: CSSProperties;
}

function renderBadgeIcon(icon: ReactNode, color: string, size: string) {
  if (!icon) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "center",
        color,
        display: "inline-flex",
        flexShrink: 0,
        fontSize: size,
        height: size,
        justifyContent: "center",
        lineHeight: 0,
        width: size
      }}
    >
      {icon}
    </span>
  );
}

export function Badge({
  brand = "Cars24",
  labelText = "Badge",
  size = "Extra Small",
  type = "Neutral",
  priority = "Medium",
  pillShape = "No",
  showLeadingIcon,
  showTrailingIcon,
  leadingIcon,
  trailingIcon,
  iconLeft,
  iconRight,
  changeLeftIcon,
  changeRightIcon,
  disabled = false,
  forceState,
  onDismiss,
  className,
  style
}: BadgeProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const metrics = BADGE_SIZE_TOKENS[size];
  const colors = BADGE_TYPE_TOKENS[type][priority];
  const activeState = resolveBadgeState({
    disabled,
    forceState,
    hovered,
    focused,
    pressed
  });
  const transition = "180ms cubic-bezier(0.2, 0, 0, 1)";
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const isPill = pillShape === "Yes";
  const resolvedShowLeadingIcon = showLeadingIcon ?? iconLeft ?? true;
  const resolvedShowTrailingIcon = showTrailingIcon ?? iconRight ?? true;

  const containerStyles: CSSProperties = {
    display: "inline-flex",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    minHeight: metrics.minHeight,
    width: "fit-content",
    padding: `${metrics.paddingY} ${isPill ? metrics.pillPaddingX : metrics.paddingX}`,
    borderRadius: isPill
      ? `${Number(getRequiredThemeTokenValue(brand, "radius.pill"))}px`
      : `${Number(getRequiredThemeTokenValue(
          brand,
          size === "Extra Small" ? "radius.alt.xs" : size === "Small" ? "radius.alt.sm" : "radius.alt.md"
        ))}px`,
    backgroundColor: colors.background,
    border: colors.border ? `1px solid ${colors.border}` : "1px solid transparent",
    color: colors.text,
    filter: filterForState(activeState),
    opacity: disabled ? 0.48 : 1,
    boxShadow:
      activeState === "focus" ? `0 0 0 3px ${hexToRgba(focusColor, 0.26)}` : "none",
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: metrics.fontSize,
    fontWeight: medium,
    lineHeight: metrics.lineHeight,
    letterSpacing: 0,
    whiteSpace: "nowrap",
    transition: `filter ${transition}, box-shadow ${transition}, opacity ${transition}`,
    ...style
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    columnGap: metrics.gap,
    display: "inline-flex",
    justifyContent: "center",
    minWidth: 0
  };

  const labelStyles: CSSProperties = {
    color: colors.text,
    display: "inline-flex",
    alignItems: "center",
    lineHeight: metrics.lineHeight
  };

  const defaultLeadingIcon = <Icon brand={brand} name="sparkle-line" decorative />;

  const defaultTrailingIcon = <Icon brand={brand} name="close-line" decorative />;
  const resolvedLeadingIcon = leadingIcon ?? changeLeftIcon ?? defaultLeadingIcon;
  const resolvedTrailingIcon = trailingIcon ?? changeRightIcon ?? defaultTrailingIcon;

  const handleDismiss = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onDismiss?.();
  };

  const handleDismissKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      setPressed(true);
    }
  };

  return (
    <span
      className={className}
      style={containerStyles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
    >
      <span style={contentStyles}>
        {resolvedShowLeadingIcon ? renderBadgeIcon(resolvedLeadingIcon, colors.text, metrics.icon) : null}
        <span style={labelStyles}>{labelText}</span>
        {resolvedShowTrailingIcon ? (
          onDismiss ? (
            <button
              type="button"
              aria-label={`Remove ${labelText}`}
              disabled={disabled}
              onClick={handleDismiss}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                setPressed(false);
              }}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onKeyDown={handleDismissKeyDown}
              onKeyUp={() => setPressed(false)}
              style={{
                appearance: "none",
                background: "transparent",
                border: 0,
                color: "inherit",
                padding: 0,
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                flexShrink: 0,
                lineHeight: 0
              }}
            >
              {renderBadgeIcon(resolvedTrailingIcon, colors.text, metrics.icon)}
            </button>
          ) : (
            renderBadgeIcon(resolvedTrailingIcon, colors.text, metrics.icon)
          )
        ) : null}
      </span>
    </span>
  );
}
