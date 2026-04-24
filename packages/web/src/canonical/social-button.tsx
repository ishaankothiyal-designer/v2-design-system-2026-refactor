import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useInsertionEffect,
  useState
} from "react";
import { designSystemRegistry } from "@geist/contracts";
import { normalizeBrandId, type DisplayBrandId } from "@geist/tokens";
import { ensureStyleSheet, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalSocialButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.socialButton"
);

export type SocialButtonSize = "Medium" | "Large";
export type SocialButtonPreviewState = "Rest" | "Hover";

type StylableElement = ReactElement<{ style?: CSSProperties; className?: string }>;
type SocialButtonSizeKey = "md" | "lg";

const SOCIAL_BUTTON_ROOT_CLASS = "geist-social-button";
const SOCIAL_BUTTON_LABEL_CLASS = "geist-social-button__label";
const SOCIAL_BUTTON_SLOT_CLASS = "geist-social-button__slot";
const SOCIAL_BUTTON_STYLESHEET_ID = "geist-social-button-styles";
const SOCIAL_BUTTON_TAP_TRANSFORM = "translateY(1px) scale(0.985)";
const SOCIAL_BUTTON_TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";

function getTokenSizeKey(size: SocialButtonSize): SocialButtonSizeKey {
  return size === "Large" ? "lg" : "md";
}

const SOCIAL_BUTTON_STYLESHEET = [
  toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    border: `${runtimeTokenVarPx("component.socialButton.border.width")} solid transparent`,
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "inline-flex",
    "justify-content": "center",
    "min-width": "0",
    outline: "none",
    "outline-offset": runtimeTokenVarPx("component.socialButton.focus.outlineOffset"),
    "text-decoration": "none",
    "transform-origin": "center center",
    transition: [
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      SOCIAL_BUTTON_TAP_TRANSITION
    ].join(", "),
    "will-change": "transform"
  }),
  toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}[data-focused="true"]`, {
    outline: `${runtimeTokenVarPx("component.socialButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}:focus-visible`, {
    outline: `${runtimeTokenVarPx("component.socialButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    "will-change": "auto"
  }),
  toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}[data-pressed="true"][data-disabled="false"]`, {
    transform: SOCIAL_BUTTON_TAP_TRANSFORM
  }),
  toCssRule(`.${SOCIAL_BUTTON_LABEL_CLASS}`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.medium"),
    "text-align": "center",
    "white-space": "nowrap"
  }),
  toCssRule(`.${SOCIAL_BUTTON_SLOT_CLASS}`, {
    "align-items": "center",
    color: "inherit",
    display: "inline-flex",
    "justify-content": "center",
    "line-height": "1"
  }),
  ...(["md", "lg"] as const).flatMap((sizeKey) => {
    const radiusKey = sizeKey === "lg" ? "lg" : "md";

    return [
      toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"]`, {
        "border-radius": runtimeTokenVarPx(`radius.alt.${radiusKey}`),
        gap: runtimeTokenVarPx(`component.socialButton.size.${sizeKey}.gap`),
        height: runtimeTokenVarPx(`component.socialButton.size.${sizeKey}.height`),
        padding: `0 ${runtimeTokenVarPx(`component.socialButton.size.${sizeKey}.paddingInline`)}`
      }),
      toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${SOCIAL_BUTTON_LABEL_CLASS}`, {
        "font-size": runtimeTokenVarPx(`component.socialButton.typography.${sizeKey}.fontSize`),
        "letter-spacing": runtimeTokenVarPx(`component.socialButton.typography.${sizeKey}.letterSpacing`),
        "line-height": runtimeTokenVarPx(`component.socialButton.typography.${sizeKey}.lineHeight`)
      }),
      toCssRule(`.${SOCIAL_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${SOCIAL_BUTTON_SLOT_CLASS}`, {
        "font-size": runtimeTokenVarPx(`component.socialButton.size.${sizeKey}.iconSize`),
        height: runtimeTokenVarPx(`component.socialButton.size.${sizeKey}.iconSize`),
        width: runtimeTokenVarPx(`component.socialButton.size.${sizeKey}.iconSize`)
      })
    ];
  }),
  ...(["rest", "hover", "disabled"] as const).map((stateKey) => {
    const selector =
      stateKey === "disabled"
        ? `.${SOCIAL_BUTTON_ROOT_CLASS}[data-disabled="true"]`
        : `.${SOCIAL_BUTTON_ROOT_CLASS}[data-disabled="false"][data-hovered="${String(stateKey === "hover")}"]`;

    return toCssRule(selector, {
      background: runtimeTokenVar(`component.socialButton.color.light.${stateKey}.background`),
      "border-color": runtimeTokenVar(`component.socialButton.color.light.${stateKey}.border`),
      color: runtimeTokenVar(`component.socialButton.color.light.${stateKey}.foreground`)
    });
  })
].join("");

function renderIcon(icon: ReactNode) {
  if (!icon) {
    return null;
  }

  if (isValidElement(icon)) {
    const element = icon as StylableElement;

    return (
      <span aria-hidden className={SOCIAL_BUTTON_SLOT_CLASS}>
        {cloneElement(element, {
          className: [element.props.className].filter(Boolean).join(" "),
          style: {
            color: "inherit",
            fontSize: "inherit",
            ...element.props.style
          }
        })}
      </span>
    );
  }

  return (
    <span aria-hidden className={SOCIAL_BUTTON_SLOT_CLASS}>
      {icon}
    </span>
  );
}

export interface SocialButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  forceState?: SocialButtonPreviewState;
  icon?: ReactNode;
  size?: SocialButtonSize;
}

export function SocialButton({
  brand = "Cars24",
  children,
  className,
  disabled = false,
  forceState,
  icon,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  size = "Large",
  style,
  type = "button",
  ...rest
}: SocialButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  useInsertionEffect(() => {
    ensureStyleSheet(SOCIAL_BUTTON_STYLESHEET_ID, SOCIAL_BUTTON_STYLESHEET);
  }, []);

  const normalizedBrand = normalizeBrandId(brand);
  const isHovered = forceState === "Hover" || hovered || pressed;
  const isPressed = !disabled && (pressed || forceState === "Hover");
  const isFocused = focused;

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
      className={[SOCIAL_BUTTON_ROOT_CLASS, className].filter(Boolean).join(" ")}
      data-brand={normalizedBrand}
      data-disabled={String(disabled)}
      data-focused={String(isFocused)}
      data-hovered={String(isHovered)}
      data-pressed={String(isPressed)}
      data-size={getTokenSizeKey(size)}
      disabled={disabled}
      type={type}
      onBlur={(event) => {
        setFocused(false);
        setPressed(false);
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
      {renderIcon(icon)}
      {children ? <span className={SOCIAL_BUTTON_LABEL_CLASS}>{children}</span> : null}
    </button>
  );
}
