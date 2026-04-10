import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useState
} from "react";
import type { BrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.button"
);

export type ButtonShape = "Regular" | "Pill";
export type ButtonStyleVariant = "Solid" | "Outline" | "Ghost" | "Transparent" | "Destructive";
export type ButtonSize = "Extra Small" | "Small" | "Medium" | "Large" | "Extra Large";
export type ButtonPreviewState = "Rest" | "Hover/Pressed";

type ButtonToneAlias = "primary" | "secondary" | "ghost";
type LegacyButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type SizeMetrics = {
  minWidth: string;
  height: string;
  gap: string;
  paddingInline: string;
  paddingBlock: string;
  radiusRegular: string;
  typographySize: string;
  typographyLineHeight: string;
  loaderSize: string;
};

type ButtonSurface = {
  background: string;
  border: string;
  text: string;
  icon: string;
  loaderTrack: string;
  loaderIndicator: string;
};

const BUTTON_SPIN_KEYFRAMES = "@keyframes geist-button-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

const BUTTON_SIZE_METRICS: Record<ButtonSize, SizeMetrics> = {
  "Extra Small": {
    minWidth: "90px",
    height: "28px",
    gap: "4px",
    paddingInline: "12px",
    paddingBlock: "5px",
    radiusRegular: "8px",
    typographySize: "11px",
    typographyLineHeight: "17px",
    loaderSize: "14px"
  },
  Small: {
    minWidth: "95px",
    height: "32px",
    gap: "4px",
    paddingInline: "12px",
    paddingBlock: "7px",
    radiusRegular: "8px",
    typographySize: "13px",
    typographyLineHeight: "18px",
    loaderSize: "16px"
  },
  Medium: {
    minWidth: "112px",
    height: "40px",
    gap: "6px",
    paddingInline: "14px",
    paddingBlock: "10px",
    radiusRegular: "12px",
    typographySize: "15px",
    typographyLineHeight: "20px",
    loaderSize: "18px"
  },
  Large: {
    minWidth: "124px",
    height: "44px",
    gap: "6px",
    paddingInline: "16px",
    paddingBlock: "12px",
    radiusRegular: "14px",
    typographySize: "15px",
    typographyLineHeight: "20px",
    loaderSize: "18px"
  },
  "Extra Large": {
    minWidth: "130px",
    height: "56px",
    gap: "6px",
    paddingInline: "18px",
    paddingBlock: "18px",
    radiusRegular: "16px",
    typographySize: "17px",
    typographyLineHeight: "20px",
    loaderSize: "20px"
  }
};

function makeSurface(
  background: string,
  border: string,
  text: string,
  icon: string,
  loaderTrack: string,
  loaderIndicator: string
): ButtonSurface {
  return { background, border, text, icon, loaderTrack, loaderIndicator };
}

const LIGHT_SURFACES: Record<ButtonStyleVariant, { rest: ButtonSurface; hover: ButtonSurface }> = {
  Solid: {
    rest: makeSurface(
      "var(--lego/color/surface/brand/primary/rest, #4736fe)",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    ),
    hover: makeSurface(
      "var(--lego/color/surface/brand/primary/hover, #4031e5)",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    )
  },
  Outline: {
    rest: makeSurface(
      "transparent",
      "var(--lego/color/border/brand/primary/rest, #4736fe)",
      "var(--lego/color/text/brand/primary/rest, #4736fe)",
      "var(--lego/color/icon/brand/primary/rest, #4736fe)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/brand/primary/rest, #4736fe)"
    ),
    hover: makeSurface(
      "var(--lego/color/surface/brand/tertairy/rest, #edebff)",
      "var(--lego/color/border/brand/primary/hover, #392bcb)",
      "var(--lego/color/text/brand/primary/rest, #4736fe)",
      "var(--lego/color/icon/brand/primary/rest, #4736fe)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/brand/primary/rest, #4736fe)"
    )
  },
  Ghost: {
    rest: makeSurface(
      "transparent",
      "transparent",
      "var(--lego/color/text/brand/primary/rest, #4736fe)",
      "var(--lego/color/icon/brand/primary/rest, #4736fe)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/brand/primary/rest, #4736fe)"
    ),
    hover: makeSurface(
      "var(--lego/color/surface/brand/subtle/hover, #edebff)",
      "transparent",
      "var(--lego/color/text/brand/primary/rest, #4736fe)",
      "var(--lego/color/icon/brand/primary/rest, #4736fe)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/brand/primary/rest, #4736fe)"
    )
  },
  Transparent: {
    rest: makeSurface(
      "var(--translucent/black/lego-color-alpha-black-20, rgba(10,10,10,0.04))",
      "transparent",
      "var(--lego/color/text/primary/rest, #0f172b)",
      "var(--lego/color/icon/primary/rest, #0f172b)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/primary/rest, #0f172b)"
    ),
    hover: makeSurface(
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "transparent",
      "var(--lego/color/text/primary/rest, #0f172b)",
      "var(--lego/color/icon/primary/rest, #0f172b)",
      "var(--translucent/black/lego-color-alpha-black-40, rgba(10,10,10,0.18))",
      "var(--lego/color/text/primary/rest, #0f172b)"
    )
  },
  Destructive: {
    rest: makeSurface(
      "var(--lego/color/surface/feedback/lego-color-feedback-surface-error-rest, #fef2f2)",
      "var(--red/100, #ffe2e2)",
      "var(--lego/color/text/feedback/error-rest, #c10007)",
      "var(--lego/color/icon/feedback/error-rest, #c10007)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/feedback/error-rest, #c10007)"
    ),
    hover: makeSurface(
      "var(--lego/color/surface/feedback/lego-color-feedback-surface-error-rest, #fef2f2)",
      "var(--lego/color/border/feedback/error-rest, #b51d02)",
      "var(--lego/color/text/feedback/error-rest, #c10007)",
      "var(--lego/color/icon/feedback/error-rest, #c10007)",
      "var(--translucent/black/lego-color-alpha-black-30, rgba(10,10,10,0.11))",
      "var(--lego/color/text/feedback/error-rest, #c10007)"
    )
  }
};

const DARK_SURFACES: Record<ButtonStyleVariant, { rest: ButtonSurface; hover: ButtonSurface }> = {
  Solid: {
    rest: makeSurface(
      "var(--lego/color/surface/light-rest, #ffffff)",
      "transparent",
      "var(--lego/color/text/primary/rest, #0f172b)",
      "var(--lego/color/icon/primary/rest, #0f172b)",
      "var(--translucent/black/lego-color-alpha-black-20, rgba(10,10,10,0.04))",
      "var(--lego/color/text/primary/rest, #0f172b)"
    ),
    hover: makeSurface(
      "var(--translucent/white/lego-color-alpha-white-90, rgba(255,255,255,0.9))",
      "transparent",
      "var(--lego/color/text/primary/rest, #0f172b)",
      "var(--lego/color/icon/primary/rest, #0f172b)",
      "var(--translucent/black/lego-color-alpha-black-20, rgba(10,10,10,0.04))",
      "var(--lego/color/text/primary/rest, #0f172b)"
    )
  },
  Outline: {
    rest: makeSurface(
      "transparent",
      "var(--lego/color/border/inverse/lego-color-border-inverse-light-rest, #ffffff)",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    ),
    hover: makeSurface(
      "var(--translucent/white/lego-color-alpha-white-10, rgba(255,255,255,0.1))",
      "var(--lego/color/border/inverse/lego-color-border-inverse-light-rest, #ffffff)",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    )
  },
  Ghost: {
    rest: makeSurface(
      "transparent",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    ),
    hover: makeSurface(
      "var(--translucent/white/lego-color-alpha-white-10, rgba(255,255,255,0.1))",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    )
  },
  Transparent: {
    rest: makeSurface(
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    ),
    hover: makeSurface(
      "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    )
  },
  Destructive: {
    rest: makeSurface(
      "var(--lego/color/surface/feedback/inverse/lego-color-feedback-surface-error-inverse-rest, #c10007)",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    ),
    hover: makeSurface(
      "var(--red/950, #460809)",
      "transparent",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)",
      "var(--lego/color/icon/inverse/lego-color-icon-inverse-light-rest, #ffffff)",
      "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
      "var(--lego/color/text/inverse/lego-color-text-inverse-rest, #ffffff)"
    )
  }
};

const LIGHT_DISABLED_SURFACE = makeSurface(
  "var(--lego/color/surface/primary/disabled, #e2e8f0)",
  "transparent",
  "var(--lego/color/text/primary/disabled, #90a1b9)",
  "var(--lego/color/icon/primary/disabled, #90a1b9)",
  "var(--translucent/black/lego-color-alpha-black-20, rgba(10,10,10,0.04))",
  "var(--lego/color/text/primary/disabled, #90a1b9)"
);

const DARK_DISABLED_SURFACE = makeSurface(
  "var(--translucent/white/lego-color-alpha-white-10, rgba(255,255,255,0.1))",
  "transparent",
  "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
  "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))",
  "var(--translucent/white/lego-color-alpha-white-20, rgba(255,255,255,0.2))",
  "var(--translucent/white/lego-color-alpha-white-30, rgba(255,255,255,0.3))"
);

function normalizeSize(size: ButtonProps["size"]): ButtonSize {
  if (size === "xs") {
    return "Extra Small";
  }
  if (size === "sm") {
    return "Small";
  }
  if (size === "lg") {
    return "Large";
  }
  if (size === "xl") {
    return "Extra Large";
  }
  if (size === "md" || !size) {
    return "Medium";
  }

  return size;
}

function normalizeVariant(styleVariant: ButtonProps["styleVariant"], tone: ButtonToneAlias | undefined) {
  if (styleVariant) {
    return styleVariant;
  }

  if (tone === "ghost") {
    return "Ghost";
  }

  if (tone === "secondary") {
    return "Outline";
  }

  return "Solid";
}

function getSurface(styleVariant: ButtonStyleVariant, onDark: boolean, hoveredOrPressed: boolean, disabled: boolean) {
  if (disabled) {
    return onDark ? DARK_DISABLED_SURFACE : LIGHT_DISABLED_SURFACE;
  }

  const collection = onDark ? DARK_SURFACES : LIGHT_SURFACES;
  return hoveredOrPressed ? collection[styleVariant].hover : collection[styleVariant].rest;
}

function getRadius(metrics: SizeMetrics, shape: ButtonShape) {
  return shape === "Pill" ? "var(--radius/full, 999px)" : metrics.radiusRegular;
}

function getIconSize(size: ButtonSize) {
  if (size === "Extra Small") {
    return "14px";
  }

  if (size === "Small") {
    return "16px";
  }

  if (size === "Extra Large") {
    return "20px";
  }

  return "18px";
}

function renderSlot(content: ReactNode, color: string, size: string) {
  if (!content) {
    return null;
  }

  if (typeof content === "string") {
    return (
      <span
        aria-hidden="true"
        style={{
          color,
          display: "inline-flex",
          fontSize: size,
          lineHeight: 0
        }}
      >
        {content}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        color,
        display: "inline-flex",
        lineHeight: 0
      }}
    >
      {content}
    </span>
  );
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: BrandId;
  shape?: ButtonShape;
  styleVariant?: ButtonStyleVariant;
  size?: ButtonSize | LegacyButtonSize;
  onDark?: boolean;
  loading?: boolean;
  forceState?: ButtonPreviewState;
  tone?: ButtonToneAlias;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  brand = "core",
  shape = "Regular",
  styleVariant,
  size = "Medium",
  onDark = false,
  loading = false,
  disabled = false,
  forceState,
  tone,
  leadingIcon,
  trailingIcon,
  children,
  style,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const normalizedSize = normalizeSize(size);
  const normalizedVariant = normalizeVariant(styleVariant, tone);
  const metrics = BUTTON_SIZE_METRICS[normalizedSize];
  const hoveredOrPressed = forceState === "Hover/Pressed" || pressed || hovered;
  const surface = getSurface(normalizedVariant, onDark, hoveredOrPressed, disabled);
  const semibold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const fallbackFontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const iconSize = getIconSize(normalizedSize);
  const isDisabled = disabled || loading;

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: surface.background,
    border: `1px solid ${surface.border}`,
    borderRadius: getRadius(metrics, shape),
    boxSizing: "border-box",
    color: surface.text,
    cursor: isDisabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    justifyContent: "center",
    minHeight: metrics.height,
    minWidth: metrics.minWidth,
    padding: `${metrics.paddingBlock} ${metrics.paddingInline}`,
    position: "relative",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1)",
    boxShadow: focused ? `0 0 0 3px ${focusColor}40` : "none",
    ...style
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: metrics.gap,
    justifyContent: "center",
    minWidth: 0
  };

  const labelStyles: CSSProperties = {
    color: surface.text,
    fontFamily: `var(--font-syle, Geist), ${fallbackFontFamily}, sans-serif`,
    fontSize: metrics.typographySize,
    fontWeight: semibold,
    letterSpacing: 0,
    lineHeight: metrics.typographyLineHeight,
    whiteSpace: "nowrap"
  };

  const loaderStyles: CSSProperties = {
    animation: "geist-button-spin 0.8s linear infinite",
    border: "2px solid",
    borderColor: surface.loaderTrack,
    borderRadius: "50%",
    borderTopColor: surface.loaderIndicator,
    boxSizing: "border-box",
    height: metrics.loaderSize,
    width: metrics.loaderSize
  };

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    if (!isDisabled) {
      setHovered(true);
    }
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    setHovered(false);
    setPressed(false);
    onMouseLeave?.(event);
  }

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    if (!isDisabled) {
      setPressed(true);
    }
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseUp?.(event);
  }

  return (
    <>
      <style>{BUTTON_SPIN_KEYFRAMES}</style>
      <button
        {...rest}
        aria-busy={loading || undefined}
        disabled={isDisabled}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        style={rootStyles}
      >
        {loading ? (
          <span aria-hidden="true" style={loaderStyles} />
        ) : (
          <span style={contentStyles}>
            {renderSlot(leadingIcon, surface.icon, iconSize)}
            {children ? <span style={labelStyles}>{children}</span> : null}
            {renderSlot(trailingIcon, surface.icon, iconSize)}
          </span>
        )}
      </button>
    </>
  );
}
