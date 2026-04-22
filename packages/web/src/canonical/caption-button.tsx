import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useInsertionEffect,
  useState
} from "react";
import { designSystemRegistry } from "@geist/contracts";
import { normalizeBrandId, type DisplayBrandId } from "@geist/tokens";
import { ensureStyleSheet, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalCaptionButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.captionButton"
);

export type CaptionButtonStyleVariant = "Primary" | "Secondary";
export type CaptionButtonSize = "Medium" | "Large";
export type CaptionButtonCaptionPosition = "Up" | "Down";
export type CaptionButtonPreviewState = "Rest" | "Hover/Pressed";

type CaptionButtonSizeKey = "md" | "lg";

const CAPTION_BUTTON_ROOT_CLASS = "geist-caption-button";
const CAPTION_BUTTON_LABEL_CLASS = "geist-caption-button__label";
const CAPTION_BUTTON_CAPTION_CLASS = "geist-caption-button__caption";
const CAPTION_BUTTON_STYLESHEET_ID = "geist-caption-button-styles";
const CAPTION_BUTTON_TAP_TRANSFORM = "translateY(1px) scale(0.985)";
const CAPTION_BUTTON_TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";

function getTokenSizeKey(size: CaptionButtonSize): CaptionButtonSizeKey {
  return size === "Large" ? "lg" : "md";
}

function getVariantKey(styleVariant: CaptionButtonStyleVariant) {
  return styleVariant === "Secondary" ? "secondary" : "primary";
}

const CAPTION_BUTTON_STYLESHEET = [
  toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    border: `${runtimeTokenVarPx("component.captionButton.border.width")} solid transparent`,
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "inline-flex",
    "flex-direction": "column",
    "justify-content": "center",
    "min-width": "0",
    outline: "none",
    "outline-offset": runtimeTokenVarPx("component.captionButton.focus.outlineOffset"),
    overflow: "hidden",
    "text-align": "center",
    "transform-origin": "center center",
    transition: [
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      CAPTION_BUTTON_TAP_TRANSITION
    ].join(", "),
    "will-change": "transform"
  }),
  toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-focused="true"]`, {
    outline: `${runtimeTokenVarPx("component.captionButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}:focus-visible`, {
    outline: `${runtimeTokenVarPx("component.captionButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    "will-change": "auto"
  }),
  toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-pressed="true"][data-disabled="false"]`, {
    transform: CAPTION_BUTTON_TAP_TRANSFORM
  }),
  toCssRule(`.${CAPTION_BUTTON_LABEL_CLASS}`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.medium"),
    "white-space": "nowrap"
  }),
  toCssRule(`.${CAPTION_BUTTON_CAPTION_CLASS}`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "white-space": "nowrap"
  }),
  ...(["md", "lg"] as const).flatMap((sizeKey) => [
    toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"]`, {
      "border-radius": runtimeTokenVarPx(`component.captionButton.size.${sizeKey}.borderRadius`),
      height: runtimeTokenVarPx(`component.captionButton.size.${sizeKey}.height`),
      padding: `0 ${runtimeTokenVarPx(`component.captionButton.size.${sizeKey}.paddingInline`)}`
    }),
    toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${CAPTION_BUTTON_LABEL_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.captionButton.typography.label.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.captionButton.typography.label.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.captionButton.typography.label.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${CAPTION_BUTTON_CAPTION_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.captionButton.typography.caption.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.captionButton.typography.caption.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.captionButton.typography.caption.${sizeKey}.lineHeight`)
    })
  ]),
  toCssRule(`.${CAPTION_BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    background: runtimeTokenVar("component.captionButton.color.light.disabled.background"),
    "border-color": runtimeTokenVar("component.captionButton.color.light.disabled.border"),
    color: runtimeTokenVar("component.captionButton.color.light.disabled.foreground")
  }),
  ...(["primary", "secondary"] as const).flatMap((variantKey) =>
    (["rest", "hover"] as const).map((stateKey) => {
      const selector =
        stateKey === "hover"
          ? `.${CAPTION_BUTTON_ROOT_CLASS}[data-variant="${variantKey}"][data-disabled="false"][data-hovered="true"]`
          : `.${CAPTION_BUTTON_ROOT_CLASS}[data-variant="${variantKey}"][data-disabled="false"][data-hovered="false"]`;

      return toCssRule(selector, {
        background: runtimeTokenVar(`component.captionButton.color.light.${variantKey}.${stateKey}.background`),
        "border-color":
          variantKey === "secondary"
            ? runtimeTokenVar(`component.captionButton.color.light.${variantKey}.${stateKey}.border`)
            : "transparent",
        color: runtimeTokenVar(`component.captionButton.color.light.${variantKey}.${stateKey}.foreground`)
      });
    })
  )
].join("");

export interface CaptionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  caption?: ReactNode;
  captionPosition?: CaptionButtonCaptionPosition;
  forceState?: CaptionButtonPreviewState;
  size?: CaptionButtonSize;
  styleVariant?: CaptionButtonStyleVariant;
}

export function CaptionButton({
  brand = "Cars24",
  caption,
  captionPosition = "Up",
  children,
  className,
  disabled = false,
  forceState,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  size = "Medium",
  style,
  styleVariant = "Primary",
  type = "button",
  ...rest
}: CaptionButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useInsertionEffect(() => {
    ensureStyleSheet(CAPTION_BUTTON_STYLESHEET_ID, CAPTION_BUTTON_STYLESHEET);
  }, []);

  const normalizedBrand = normalizeBrandId(brand);
  const isHovered = forceState === "Hover/Pressed" || hovered || pressed;
  const isPressed = !disabled && (pressed || forceState === "Hover/Pressed");
  const isFocused = focused;
  const captionElement = caption ? <span className={CAPTION_BUTTON_CAPTION_CLASS}>{caption}</span> : null;
  const labelElement = children ? <span className={CAPTION_BUTTON_LABEL_CLASS}>{children}</span> : null;

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    if (!disabled) {
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
    if (!disabled) {
      setPressed(true);
    }
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseUp?.(event);
  }

  return (
    <button
      {...rest}
      className={[CAPTION_BUTTON_ROOT_CLASS, className].filter(Boolean).join(" ")}
      data-brand={normalizedBrand}
      data-disabled={String(disabled)}
      data-focused={String(isFocused)}
      data-hovered={String(isHovered)}
      data-pressed={String(isPressed)}
      data-size={getTokenSizeKey(size)}
      data-variant={getVariantKey(styleVariant)}
      disabled={disabled}
      type={type}
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
      style={style}
    >
      {captionPosition === "Up" ? (
        <>
          {captionElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement}
          {captionElement}
        </>
      )}
    </button>
  );
}
