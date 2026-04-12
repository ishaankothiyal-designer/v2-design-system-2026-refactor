import {
  cloneElement,
  type CSSProperties,
  isValidElement,
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

type BadgeSizeConfig = {
  height: number;
  iconSize: number;
  gap: number;
  paddingBlock: number;
  paddingInline: number;
  pillPaddingInline: number;
  radiusToken: "radius.alt.xs" | "radius.alt.sm" | "radius.alt.md";
  typography: Record<
    BadgePriority,
    {
      fontSize: number;
      lineHeight: number;
      letterSpacing: number;
    }
  >;
};

type BadgeToneConfig = {
  background: string;
  foreground: string;
  borderColor?: string;
};

const BADGE_SIZE_CONFIG: Record<BadgeSize, BadgeSizeConfig> = {
  "Extra Small": {
    height: 20,
    iconSize: 12,
    gap: 2,
    paddingBlock: 4,
    paddingInline: 4,
    pillPaddingInline: 6,
    radiusToken: "radius.alt.xs",
    typography: {
      High: { fontSize: 11, lineHeight: 14, letterSpacing: 0 },
      Medium: { fontSize: 11, lineHeight: 14, letterSpacing: 0 },
      Low: { fontSize: 11, lineHeight: 14, letterSpacing: 0 }
    }
  },
  Small: {
    height: 24,
    iconSize: 14,
    gap: 2,
    paddingBlock: 4,
    paddingInline: 4,
    pillPaddingInline: 8,
    radiusToken: "radius.alt.sm",
    typography: {
      High: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
      Medium: { fontSize: 14, lineHeight: 18, letterSpacing: 0 },
      Low: { fontSize: 14, lineHeight: 18, letterSpacing: 0 }
    }
  },
  Medium: {
    height: 36,
    iconSize: 18,
    gap: 4,
    paddingBlock: 8,
    paddingInline: 8,
    pillPaddingInline: 10,
    radiusToken: "radius.alt.md",
    typography: {
      High: { fontSize: 16, lineHeight: 20, letterSpacing: 0 },
      Medium: { fontSize: 16, lineHeight: 20, letterSpacing: 0 },
      Low: { fontSize: 16, lineHeight: 20, letterSpacing: 0 }
    }
  }
};

const BADGE_TONE_CONFIG: Record<
  BadgeType,
  Record<BadgePriority, BadgeToneConfig>
> = {
  "Drive pink": {
    High: {
      background: "var(--cars24-primitive-drive-pink-600, #E519A0)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-primitive-drive-pink-50, #FFE8F7)",
      foreground: "var(--cars24-primitive-drive-pink-600, #E519A0)",
      borderColor: "var(--cars24-primitive-drive-pink-600, #E519A0)"
    },
    Low: {
      background: "var(--cars24-primitive-drive-pink-50, #FFE8F7)",
      foreground: "var(--cars24-primitive-drive-pink-600, #E519A0)"
    }
  },
  Error: {
    High: {
      background: "var(--cars24-semantic-bg-danger-base, #DC2626)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-danger-subtler, #FEF2F2)",
      foreground: "var(--cars24-semantic-text-danger-base, #DC2626)",
      borderColor: "var(--cars24-semantic-border-danger-base, #DC2626)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-danger-subtler, #FEF2F2)",
      foreground: "var(--cars24-semantic-text-danger-base, #DC2626)"
    }
  },
  Feature: {
    High: {
      background: "var(--cars24-primitive-pop-purple-500, #D300F4)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-primitive-pop-purple-50, #FBE6FE)",
      foreground: "var(--cars24-primitive-pop-purple-500, #D300F4)",
      borderColor: "var(--cars24-primitive-pop-purple-500, #D300F4)"
    },
    Low: {
      background: "var(--cars24-primitive-pop-purple-50, #FBE6FE)",
      foreground: "var(--cars24-primitive-pop-purple-500, #D300F4)"
    }
  },
  Information: {
    High: {
      background: "var(--cars24-semantic-bg-info-base, #296FE3)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-info-subtler, #F0F7FF)",
      foreground: "var(--cars24-semantic-text-info-base, #296FE3)",
      borderColor: "var(--cars24-semantic-bg-info-base, #296FE3)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-info-subtler, #F0F7FF)",
      foreground: "var(--cars24-semantic-text-info-base, #296FE3)"
    }
  },
  Neutral: {
    High: {
      background: "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-secondary, #F1F5F9)",
      foreground: "var(--cars24-semantic-text-secondary, #64748B)",
      borderColor: "var(--cars24-semantic-border-tertiary, #94A3B8)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-tertiary, #E2E8F0)",
      foreground: "var(--cars24-semantic-text-secondary, #64748B)"
    }
  },
  "Sky surge": {
    High: {
      background: "var(--cars24-primitive-sky-surge-700, #159DA3)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-primitive-sky-surge-50, #EFFDFD)",
      foreground: "var(--cars24-primitive-sky-surge-700, #159DA3)",
      borderColor: "var(--cars24-primitive-sky-surge-700, #159DA3)"
    },
    Low: {
      background: "var(--cars24-primitive-sky-surge-100, #CEFBFA)",
      foreground: "var(--cars24-primitive-sky-surge-700, #159DA3)"
    }
  },
  Success: {
    High: {
      background: "var(--cars24-semantic-bg-success-base, #1C9C1C)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-success-subtler, #F4FCF4)",
      foreground: "var(--cars24-semantic-text-success-base, #1C9C1C)",
      borderColor: "var(--cars24-semantic-border-success-base, #1C9C1C)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-success-subtle, #E4F9E0)",
      foreground: "var(--cars24-semantic-text-success-base, #1C9C1C)"
    }
  },
  Warning: {
    High: {
      background: "var(--cars24-semantic-bg-warning-base, #E17100)",
      foreground: "var(--cars24-semantic-text-primary-inverse, #FFFFFF)"
    },
    Medium: {
      background: "var(--cars24-semantic-bg-warning-subtler, #FFFBEB)",
      foreground: "var(--cars24-semantic-text-warning-base, #E17100)",
      borderColor: "var(--cars24-semantic-border-warning-base, #E17100)"
    },
    Low: {
      background: "var(--cars24-semantic-bg-warning-subtle, #FEF3C6)",
      foreground: "var(--cars24-semantic-text-warning-base, #E17100)"
    }
  }
};

const BADGE_DEFAULT_ICON_NAMES = {
  leading: "sparkle-filled",
  trailing: "cross-large-outline"
} as const;

const BADGE_STATE_FILTERS: Record<BadgeInteractionState, string> = {
  default: "none",
  hover: "brightness(0.98)",
  focus: "none",
  active: "brightness(0.94)"
};

function toPx(value: number) {
  return `${value}px`;
}

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

function renderBadgeIcon(icon: ReactNode, color: string, size: number) {
  if (!icon) {
    return null;
  }

  const iconSize = toPx(size);
  const resolvedIcon = isValidElement<{ style?: CSSProperties }>(icon)
    ? cloneElement(icon, {
        style: {
          fontSize: iconSize,
          height: iconSize,
          lineHeight: 0,
          width: iconSize,
          ...(icon.props.style ?? {})
        }
      })
    : icon;

  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "center",
        color,
        display: "inline-flex",
        flexShrink: 0,
        fontSize: iconSize,
        height: iconSize,
        justifyContent: "center",
        lineHeight: 0,
        width: iconSize
      }}
    >
      {resolvedIcon}
    </span>
  );
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

  const sizeConfig = BADGE_SIZE_CONFIG[size];
  const toneConfig = BADGE_TONE_CONFIG[type][priority];
  const activeState = resolveBadgeState({
    disabled,
    forceState,
    hovered,
    focused,
    pressed
  });

  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const isPill = pillShape === "Yes";
  const typography = sizeConfig.typography[priority];
  const resolvedShowLeadingIcon = showLeadingIcon ?? iconLeft ?? true;
  const resolvedShowTrailingIcon = showTrailingIcon ?? iconRight ?? true;
  const resolvedLeadingIcon =
    leadingIcon ??
    changeLeftIcon ??
    <Icon brand={brand} name={BADGE_DEFAULT_ICON_NAMES.leading} decorative />;
  const resolvedTrailingIcon =
    trailingIcon ??
    changeRightIcon ??
    <Icon brand={brand} name={BADGE_DEFAULT_ICON_NAMES.trailing} decorative />;

  const borderRadius = isPill
    ? toPx(Number(getRequiredThemeTokenValue(brand, "radius.pill")))
    : toPx(Number(getRequiredThemeTokenValue(brand, sizeConfig.radiusToken)));

  const rootStyles: CSSProperties = {
    alignItems: "center",
    backgroundColor: toneConfig.background,
    border: `1px solid ${toneConfig.borderColor ?? "transparent"}`,
    borderRadius,
    boxShadow:
      activeState === "focus" ? `0 0 0 3px ${hexToRgba(focusColor, 0.26)}` : "none",
    boxSizing: "border-box",
    color: toneConfig.foreground,
    display: "inline-flex",
    filter: BADGE_STATE_FILTERS[activeState],
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: toPx(typography.fontSize),
    fontWeight,
    height: toPx(sizeConfig.height),
    justifyContent: "center",
    letterSpacing: typography.letterSpacing,
    lineHeight: toPx(typography.lineHeight),
    opacity: disabled ? 0.48 : 1,
    overflow: "hidden",
    padding: `${toPx(sizeConfig.paddingBlock)} ${toPx(
      isPill ? sizeConfig.pillPaddingInline : sizeConfig.paddingInline
    )}`,
    transition:
      "filter 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), opacity 180ms cubic-bezier(0.2, 0, 0, 1)",
    whiteSpace: "nowrap",
    width: "fit-content",
    ...style
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: toPx(sizeConfig.gap),
    height: "100%",
    justifyContent: "center",
    minWidth: 0
  };

  const labelStyles: CSSProperties = {
    alignItems: "center",
    color: toneConfig.foreground,
    display: "inline-flex",
    height: "100%",
    lineHeight: toPx(typography.lineHeight),
    textAlign: "center"
  };

  const dismissButtonStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: 0,
    color: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    lineHeight: 0,
    margin: 0,
    padding: 0
  };

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
      style={rootStyles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
    >
      <span style={contentStyles}>
        {resolvedShowLeadingIcon
          ? renderBadgeIcon(resolvedLeadingIcon, toneConfig.foreground, sizeConfig.iconSize)
          : null}
        <span style={labelStyles}>{labelText}</span>
        {resolvedShowTrailingIcon ? (
          onDismiss ? (
            <button
              type="button"
              aria-label={`Remove ${labelText}`}
              disabled={disabled}
              onBlur={() => {
                setFocused(false);
                setPressed(false);
              }}
              onClick={handleDismiss}
              onFocus={() => setFocused(true)}
              onKeyDown={handleDismissKeyDown}
              onKeyUp={() => setPressed(false)}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              style={dismissButtonStyles}
            >
              {renderBadgeIcon(resolvedTrailingIcon, toneConfig.foreground, sizeConfig.iconSize)}
            </button>
          ) : (
            renderBadgeIcon(resolvedTrailingIcon, toneConfig.foreground, sizeConfig.iconSize)
          )
        ) : null}
      </span>
    </span>
  );
}
