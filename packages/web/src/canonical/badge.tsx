import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useState
} from "react";
import type { BrandId } from "@geist/tokens";
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

const BADGE_SIZE_TOKENS = {
  "Extra Small": {
    height: 20,
    icon: 12,
    gap: 2,
    radius: 6,
    paddingX: 4,
    paddingY: 4,
    pillPaddingX: 6,
    fontSize: 11,
    lineHeight: 14
  },
  Small: {
    height: 24,
    icon: 14,
    gap: 2,
    radius: 8,
    paddingX: 4,
    paddingY: 4,
    pillPaddingX: 8,
    fontSize: 14,
    lineHeight: 18
  },
  Medium: {
    height: 36,
    icon: 18,
    gap: 4,
    radius: 12,
    paddingX: 8,
    paddingY: 8,
    pillPaddingX: 10,
    fontSize: 16,
    lineHeight: 20
  }
} as const;

const BADGE_TYPE_TOKENS: Record<
  BadgeType,
  {
    High: { background: string; text: string; border?: string };
    Medium: { background: string; text: string; border?: string };
    Low: { background: string; text: string; border?: string };
  }
> = {
  "Drive pink": {
    High: { background: "#E519A0", text: "#FFFFFF" },
    Medium: { background: "#FFE8F7", text: "#E519A0", border: "#E519A0" },
    Low: { background: "#FFE8F7", text: "#E519A0" }
  },
  Error: {
    High: { background: "#DC2626", text: "#FFFFFF" },
    Medium: { background: "#FEF2F2", text: "#DC2626", border: "#DC2626" },
    Low: { background: "#FEF2F2", text: "#DC2626" }
  },
  Feature: {
    High: { background: "#D300F4", text: "#FFFFFF" },
    Medium: { background: "#FBE6FE", text: "#D300F4", border: "#D300F4" },
    Low: { background: "#FBE6FE", text: "#D300F4" }
  },
  Information: {
    High: { background: "#296FE3", text: "#FFFFFF" },
    Medium: { background: "#F0F7FF", text: "#296FE3", border: "#296FE3" },
    Low: { background: "#F0F7FF", text: "#296FE3" }
  },
  Neutral: {
    High: { background: "#0A0A0A", text: "#FFFFFF" },
    Medium: { background: "#F1F5F9", text: "#64748B", border: "#94A3B8" },
    Low: { background: "#E2E8F0", text: "#64748B" }
  },
  "Sky surge": {
    High: { background: "#159DA3", text: "#FFFFFF" },
    Medium: { background: "#EFFDFD", text: "#159DA3", border: "#159DA3" },
    Low: { background: "#CEFBFA", text: "#159DA3" }
  },
  Success: {
    High: { background: "#1C9C1C", text: "#FFFFFF" },
    Medium: { background: "#F4FCF4", text: "#1C9C1C", border: "#1C9C1C" },
    Low: { background: "#E4F9E0", text: "#1C9C1C" }
  },
  Warning: {
    High: { background: "#E17100", text: "#FFFFFF" },
    Medium: { background: "#FFFBEB", text: "#E17100", border: "#E17100" },
    Low: { background: "#FEF3C6", text: "#E17100" }
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
  brand?: BrandId;
  labelText?: string;
  size?: BadgeSize;
  type?: BadgeType;
  priority?: BadgePriority;
  pillShape?: BadgePillShape;
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
  brand = "core",
  labelText = "Badge",
  size = "Extra Small",
  type = "Neutral",
  priority = "Medium",
  pillShape = "No",
  iconLeft = true,
  iconRight = true,
  changeLeftIcon = null,
  changeRightIcon = null,
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
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const fallbackFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const isPill = pillShape === "Yes";

  const containerStyles: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: metrics.gap,
    minHeight: metrics.height,
    height: metrics.height,
    width: "fit-content",
    padding: `${metrics.paddingY}px ${isPill ? metrics.pillPaddingX : metrics.paddingX}px`,
    borderRadius: isPill ? 999 : metrics.radius,
    backgroundColor: colors.background,
    border: colors.border ? `1px solid ${colors.border}` : "1px solid transparent",
    color: colors.text,
    filter: filterForState(activeState),
    opacity: disabled ? 0.48 : 1,
    boxShadow:
      activeState === "focus" ? `0 0 0 3px ${hexToRgba(focusColor, 0.26)}` : "none",
    fontFamily: `Geist, ${fallbackFontFamily}, sans-serif`,
    fontSize: metrics.fontSize,
    fontWeight: medium,
    lineHeight: `${metrics.lineHeight}px`,
    whiteSpace: "nowrap",
    transition: `filter ${transition}, box-shadow ${transition}, opacity ${transition}`,
    ...style
  };

  const iconStyles: CSSProperties = {
    fontSize: metrics.icon,
    color: colors.text,
    lineHeight: 1,
    width: metrics.icon,
    height: metrics.icon,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };

  const defaultLeadingIcon = (
    <Icon brand={brand} name="sparkle-line" decorative style={iconStyles} />
  );

  const defaultTrailingIcon = (
    <Icon brand={brand} name="close-line" decorative style={iconStyles} />
  );

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
      {iconLeft ? changeLeftIcon ?? defaultLeadingIcon : null}
      <span>{labelText}</span>
      {iconRight ? (
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
              cursor: disabled ? "not-allowed" : "pointer"
            }}
          >
            {changeRightIcon ?? defaultTrailingIcon}
          </button>
        ) : (
          changeRightIcon ?? defaultTrailingIcon
        )
      ) : null}
    </span>
  );
}
