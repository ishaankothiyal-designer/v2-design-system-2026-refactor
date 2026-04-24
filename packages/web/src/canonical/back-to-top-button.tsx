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
import { Icon } from "./icon";
import { ensureStyleSheet, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalBackToTopButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.backToTopButton"
);

export type BackToTopButtonPreviewState = "Rest" | "Hover";

type StylableElement = ReactElement<{ style?: CSSProperties; className?: string }>;

const BACK_TO_TOP_BUTTON_ROOT_CLASS = "geist-back-to-top-button";
const BACK_TO_TOP_BUTTON_LABEL_CLASS = "geist-back-to-top-button__label";
const BACK_TO_TOP_BUTTON_SLOT_CLASS = "geist-back-to-top-button__slot";
const BACK_TO_TOP_BUTTON_STYLESHEET_ID = "geist-back-to-top-button-styles";
const BACK_TO_TOP_BUTTON_TAP_TRANSFORM = "translateY(1px) scale(0.985)";
const BACK_TO_TOP_BUTTON_TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";

const BACK_TO_TOP_BUTTON_STYLESHEET = [
  toCssRule(`.${BACK_TO_TOP_BUTTON_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    border: `${runtimeTokenVarPx("component.backToTopButton.border.width")} solid transparent`,
    "border-radius": runtimeTokenVarPx("radius.pill"),
    "box-shadow": runtimeTokenVar("component.backToTopButton.shadow.lg"),
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "inline-flex",
    gap: runtimeTokenVarPx("component.backToTopButton.size.md.gap"),
    "justify-content": "center",
    "min-height": runtimeTokenVarPx("component.backToTopButton.size.md.height"),
    "min-width": "0",
    outline: "none",
    "outline-offset": runtimeTokenVarPx("component.backToTopButton.focus.outlineOffset"),
    padding: `${runtimeTokenVarPx("component.backToTopButton.size.md.paddingBlock")} ${runtimeTokenVarPx("component.backToTopButton.size.md.paddingInline")}`,
    "text-decoration": "none",
    "transform-origin": "center center",
    transition: [
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)",
      "outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      BACK_TO_TOP_BUTTON_TAP_TRANSITION
    ].join(", "),
    "will-change": "transform"
  }),
  toCssRule(`.${BACK_TO_TOP_BUTTON_ROOT_CLASS}[data-focused="true"]`, {
    outline: `${runtimeTokenVarPx("component.backToTopButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${BACK_TO_TOP_BUTTON_ROOT_CLASS}:focus-visible`, {
    outline: `${runtimeTokenVarPx("component.backToTopButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${BACK_TO_TOP_BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    "will-change": "auto"
  }),
  toCssRule(`.${BACK_TO_TOP_BUTTON_ROOT_CLASS}[data-pressed="true"][data-disabled="false"]`, {
    transform: BACK_TO_TOP_BUTTON_TAP_TRANSFORM
  }),
  toCssRule(`.${BACK_TO_TOP_BUTTON_LABEL_CLASS}`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-size": runtimeTokenVarPx("component.backToTopButton.typography.md.fontSize"),
    "font-weight": runtimeTokenVar("typography.fontWeight.semibold"),
    "letter-spacing": runtimeTokenVarPx("component.backToTopButton.typography.md.letterSpacing"),
    "line-height": runtimeTokenVarPx("component.backToTopButton.typography.md.lineHeight"),
    "white-space": "nowrap"
  }),
  toCssRule(`.${BACK_TO_TOP_BUTTON_SLOT_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    "flex-shrink": "0",
    "font-size": runtimeTokenVarPx("component.backToTopButton.size.md.iconSize"),
    height: runtimeTokenVarPx("component.backToTopButton.size.md.iconSize"),
    "justify-content": "center",
    "line-height": "1",
    width: runtimeTokenVarPx("component.backToTopButton.size.md.iconSize")
  }),
  ...[false, true].flatMap((inverse) => {
    const surfaceKey = inverse ? "dark" : "light";
    const modeSelector = `.${BACK_TO_TOP_BUTTON_ROOT_CLASS}[data-inverse="${String(inverse)}"]`;

    return (["rest", "hover", "disabled"] as const).flatMap((stateKey) => {
      const selector =
        stateKey === "disabled"
          ? `${modeSelector}[data-disabled="true"]`
          : `${modeSelector}[data-disabled="false"][data-hovered="${String(stateKey === "hover")}"]`;

      return [
        toCssRule(selector, {
          background: runtimeTokenVar(`component.backToTopButton.color.${surfaceKey}.${stateKey}.background`),
          "border-color": runtimeTokenVar(`component.backToTopButton.color.${surfaceKey}.${stateKey}.border`),
          color: runtimeTokenVar(`component.backToTopButton.color.${surfaceKey}.${stateKey}.foreground`)
        }),
        toCssRule(`${selector} .${BACK_TO_TOP_BUTTON_SLOT_CLASS}`, {
          color: runtimeTokenVar(`component.backToTopButton.color.${surfaceKey}.${stateKey}.icon`)
        })
      ];
    });
  })
].join("");

function renderIcon(icon: ReactNode) {
  if (!icon) {
    return (
      <span aria-hidden className={BACK_TO_TOP_BUTTON_SLOT_CLASS}>
        <Icon decorative name="arrow-up-filled" style={{ color: "inherit", fontSize: "inherit" }} />
      </span>
    );
  }

  if (isValidElement(icon)) {
    const element = icon as StylableElement;

    return (
      <span aria-hidden className={BACK_TO_TOP_BUTTON_SLOT_CLASS}>
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
    <span aria-hidden className={BACK_TO_TOP_BUTTON_SLOT_CLASS}>
      {icon}
    </span>
  );
}

export interface BackToTopButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  forceState?: BackToTopButtonPreviewState;
  icon?: ReactNode;
  inverse?: boolean;
}

export function BackToTopButton({
  brand = "Cars24",
  children,
  className,
  disabled = false,
  forceState,
  icon,
  inverse = false,
  onBlur,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  style,
  type = "button",
  ...rest
}: BackToTopButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useInsertionEffect(() => {
    ensureStyleSheet(BACK_TO_TOP_BUTTON_STYLESHEET_ID, BACK_TO_TOP_BUTTON_STYLESHEET);
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
      className={[BACK_TO_TOP_BUTTON_ROOT_CLASS, className].filter(Boolean).join(" ")}
      data-brand={normalizedBrand}
      data-disabled={String(disabled)}
      data-focused={String(isFocused)}
      data-hovered={String(isHovered)}
      data-inverse={String(inverse)}
      data-pressed={String(isPressed)}
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
      {children ? <span className={BACK_TO_TOP_BUTTON_LABEL_CLASS}>{children}</span> : null}
    </button>
  );
}
