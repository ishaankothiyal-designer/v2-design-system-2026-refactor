import {
  cloneElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useInsertionEffect,
  useState
} from "react";
import { designSystemRegistry } from "@geist/contracts";
import { normalizeBrandId, type DisplayBrandId } from "@geist/tokens";
import { ensureStyleSheet, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalLinkButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.linkButton"
);

export type LinkButtonTone = "Brand" | "Black";
export type LinkButtonSize = "Extra Small" | "Small" | "Medium" | "Large";
export type LinkButtonPreviewState = "Rest" | "Hover";

type StylableElement = ReactElement<{ style?: CSSProperties; className?: string }>;
type LinkButtonSizeKey = "xs" | "sm" | "md" | "lg";

const LINK_BUTTON_ROOT_CLASS = "geist-link-button";
const LINK_BUTTON_CONTENT_CLASS = "geist-link-button__content";
const LINK_BUTTON_LABEL_CLASS = "geist-link-button__label";
const LINK_BUTTON_SLOT_CLASS = "geist-link-button__slot";
const LINK_BUTTON_STYLESHEET_ID = "geist-link-button-styles";
const LINK_BUTTON_TAP_TRANSFORM = "translateY(1px) scale(0.985)";
const LINK_BUTTON_TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";

function getTokenSizeKey(size: LinkButtonSize): LinkButtonSizeKey {
  if (size === "Extra Small") {
    return "xs";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "Large") {
    return "lg";
  }

  return "md";
}

function getToneKey(tone: LinkButtonTone) {
  return tone === "Black" ? "black" : "brand";
}

const LINK_BUTTON_SIZE_KEYS = ["xs", "sm", "md", "lg"] as const;

const LINK_BUTTON_STYLESHEET = [
  toCssRule(`.${LINK_BUTTON_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    font: "inherit",
    "justify-content": "center",
    outline: "none",
    "outline-offset": runtimeTokenVarPx("component.linkButton.focus.outlineOffset"),
    padding: "0",
    "text-decoration": "none",
    "transform-origin": "center center",
    transition: [
      "color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)",
      "outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      LINK_BUTTON_TAP_TRANSITION
    ].join(", "),
    "will-change": "transform"
  }),
  toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-focused="true"]`, {
    outline: `${runtimeTokenVarPx("component.linkButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${LINK_BUTTON_ROOT_CLASS}:focus-visible`, {
    outline: `${runtimeTokenVarPx("component.linkButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    "will-change": "auto"
  }),
  toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-pressed="true"][data-disabled="false"]`, {
    transform: LINK_BUTTON_TAP_TRANSFORM
  }),
  toCssRule(`.${LINK_BUTTON_CONTENT_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    "justify-content": "center",
    "min-width": "0"
  }),
  toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-underline="true"] .${LINK_BUTTON_CONTENT_CLASS}`, {
    "box-shadow": `inset 0 calc(${runtimeTokenVar("component.linkButton.decoration.underlineThickness")} * -1px) 0 0 currentColor`
  }),
  toCssRule(`.${LINK_BUTTON_LABEL_CLASS}`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.medium"),
    "white-space": "nowrap"
  }),
  toCssRule(`.${LINK_BUTTON_SLOT_CLASS}`, {
    "align-items": "center",
    color: "inherit",
    display: "inline-flex",
    "line-height": "0"
  }),
  ...LINK_BUTTON_SIZE_KEYS.flatMap((sizeKey) => [
    toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"]`, {
      "min-height": runtimeTokenVarPx(`component.linkButton.size.${sizeKey}.height`)
    }),
    toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${LINK_BUTTON_CONTENT_CLASS}`, {
      gap: runtimeTokenVarPx(`component.linkButton.size.${sizeKey}.gap`),
      "min-height": runtimeTokenVarPx(`component.linkButton.size.${sizeKey}.height`)
    }),
    toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${LINK_BUTTON_LABEL_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.linkButton.typography.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.linkButton.typography.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.linkButton.typography.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${LINK_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${LINK_BUTTON_SLOT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.linkButton.size.${sizeKey}.iconSize`)
    })
  ]),
  ...[false, true].flatMap((onDark) => {
    const modeKey = onDark ? "dark" : "light";
    const modeSelector = `.${LINK_BUTTON_ROOT_CLASS}[data-on-dark="${String(onDark)}"]`;

    return [
      toCssRule(`${modeSelector}[data-disabled="true"]`, {
        color: runtimeTokenVar(`component.linkButton.color.${modeKey}.disabled`)
      }),
      ...(["brand", "black"] as const).flatMap((toneKey) =>
        (["rest", "hover"] as const).map((stateKey) => {
          const selector =
            stateKey === "hover"
              ? `${modeSelector}[data-tone="${toneKey}"][data-disabled="false"][data-hovered="true"]`
              : `${modeSelector}[data-tone="${toneKey}"][data-disabled="false"][data-hovered="false"]`;

          return toCssRule(selector, {
            color: runtimeTokenVar(`component.linkButton.color.${modeKey}.${toneKey}.${stateKey}`)
          });
        })
      )
    ];
  })
].join("");

function renderSlot(content: ReactNode) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return <span className={LINK_BUTTON_SLOT_CLASS}>{content}</span>;
  }

  if (isValidElement(content)) {
    const element = content as StylableElement;

    return (
      <span className={LINK_BUTTON_SLOT_CLASS}>
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

  return <span className={LINK_BUTTON_SLOT_CLASS}>{content}</span>;
}

export interface LinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  brand?: DisplayBrandId;
  tone?: LinkButtonTone;
  size?: LinkButtonSize;
  onDark?: boolean;
  underline?: boolean;
  forceState?: LinkButtonPreviewState;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function LinkButton({
  brand = "Cars24",
  className,
  tone = "Brand",
  size = "Extra Small",
  onDark = false,
  underline = true,
  forceState,
  leadingIcon,
  trailingIcon,
  disabled = false,
  children,
  style,
  type = "button",
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onFocus,
  onBlur,
  ...rest
}: LinkButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  useInsertionEffect(() => {
    ensureStyleSheet(LINK_BUTTON_STYLESHEET_ID, LINK_BUTTON_STYLESHEET);
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
      className={[LINK_BUTTON_ROOT_CLASS, className].filter(Boolean).join(" ")}
      data-brand={normalizedBrand}
      data-disabled={String(disabled)}
      data-focused={String(isFocused)}
      data-hovered={String(isHovered)}
      data-on-dark={String(onDark)}
      data-pressed={String(isPressed)}
      data-size={getTokenSizeKey(size)}
      data-tone={getToneKey(tone)}
      data-underline={String(underline)}
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
      <span className={LINK_BUTTON_CONTENT_CLASS}>
        {renderSlot(leadingIcon)}
        {children ? <span className={LINK_BUTTON_LABEL_CLASS}>{children}</span> : null}
        {renderSlot(trailingIcon)}
      </span>
    </button>
  );
}
