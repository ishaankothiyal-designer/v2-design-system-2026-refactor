import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  useInsertionEffect,
  useState
} from "react";
import {
  normalizeBrandId,
  type DisplayBrandId
} from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { ensureStyleSheet, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.button"
);

export type ButtonShape = "Regular" | "Pill";
export type ButtonStyleVariant = "Solid" | "Outline" | "Ghost" | "Transparent" | "Destructive";
export type ButtonSize = "Extra Small" | "Small" | "Medium" | "Large" | "Extra Large";
export type ButtonPreviewState = "Rest" | "Hover/Pressed" | "Focus";
export type ButtonCTAVariant = "primary" | "secondary" | "ghost" | "transparent" | "destructive";

type ButtonToneAlias = "primary" | "secondary" | "ghost";
type LegacyButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonSizeKey = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariantKey = "solid" | "outline" | "ghost" | "transparent" | "destructive";
type StylableElement = ReactElement<{ style?: CSSProperties; className?: string }>;

export interface ButtonCTA {
  text: ReactNode;
  variant?: ButtonCTAVariant;
}

const BUTTON_ROOT_CLASS = "geist-button";
const BUTTON_CONTENT_CLASS = "geist-button__content";
const BUTTON_LABEL_CLASS = "geist-button__label";
const BUTTON_SLOT_CLASS = "geist-button__slot";
const BUTTON_LOADER_CLASS = "geist-button__loader";
const BUTTON_STYLESHEET_ID = "geist-button-styles";
const BUTTON_TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";
const BUTTON_TAP_TRANSFORM = "translateY(1px) scale(0.985)";
const BUTTON_SPIN_KEYFRAMES = "@keyframes geist-button-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

function getTokenSizeKey(size: ButtonSize): ButtonSizeKey {
  if (size === "Extra Small") {
    return "xs";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "Large") {
    return "lg";
  }
  if (size === "Extra Large") {
    return "xl";
  }

  return "md";
}

function getRadiusTokenKey(sizeKey: ButtonSizeKey) {
  if (sizeKey === "xl") {
    return "xl";
  }
  if (sizeKey === "lg") {
    return "lg";
  }
  if (sizeKey === "md") {
    return "md";
  }

  return "sm";
}

function getVariantKey(styleVariant: ButtonStyleVariant): ButtonVariantKey {
  switch (styleVariant) {
    case "Solid":
      return "solid";
    case "Outline":
      return "outline";
    case "Ghost":
      return "ghost";
    case "Transparent":
      return "transparent";
    case "Destructive":
      return "destructive";
  }
}

const BUTTON_SIZE_KEYS = ["xs", "sm", "md", "lg", "xl"] as const;
const BUTTON_VARIANT_KEYS = ["solid", "outline", "ghost", "transparent", "destructive"] as const;

const BUTTON_STYLESHEET = [
  BUTTON_SPIN_KEYFRAMES,
  toCssRule(`.${BUTTON_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    border: `${runtimeTokenVarPx("component.button.border.width")} solid transparent`,
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "inline-flex",
    "justify-content": "center",
    outline: "none",
    "outline-offset": runtimeTokenVarPx("component.button.focus.outlineOffset"),
    position: "relative",
    "text-decoration": "none",
    "transform-origin": "center center",
    transition: [
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "color 180ms cubic-bezier(0.2, 0, 0, 1)",
      BUTTON_TAP_TRANSITION
    ].join(", "),
    "will-change": "transform"
  }),
  toCssRule(`.${BUTTON_ROOT_CLASS}[data-focused="true"]`, {
    outline: `${runtimeTokenVarPx("component.button.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${BUTTON_ROOT_CLASS}:focus-visible`, {
    outline: `${runtimeTokenVarPx("component.button.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    "will-change": "auto"
  }),
  toCssRule(`.${BUTTON_ROOT_CLASS}[data-pressed="true"][data-disabled="false"]`, {
    transform: BUTTON_TAP_TRANSFORM
  }),
  toCssRule(`.${BUTTON_CONTENT_CLASS}`, {
    "align-items": "center",
    display: "inline-flex",
    "justify-content": "center",
    "min-width": "0"
  }),
  toCssRule(`.${BUTTON_LABEL_CLASS}`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-weight": runtimeTokenVar("typography.fontWeight.medium"),
    "white-space": "nowrap"
  }),
  toCssRule(`.${BUTTON_SLOT_CLASS}`, {
    "align-items": "center",
    color: "inherit",
    display: "inline-flex",
    "line-height": "0"
  }),
  toCssRule(`.${BUTTON_LOADER_CLASS}`, {
    animation: "geist-button-spin 0.8s linear infinite",
    border: `${runtimeTokenVarPx("component.button.loading.strokeWidth")} solid transparent`,
    "border-radius": "50%",
    "box-sizing": "border-box",
  }),
  ...BUTTON_SIZE_KEYS.flatMap((sizeKey) => [
    toCssRule(`.${BUTTON_ROOT_CLASS}[data-size="${sizeKey}"]`, {
      "min-height": runtimeTokenVarPx(`component.button.size.${sizeKey}.height`),
      "min-width": runtimeTokenVarPx(`component.button.size.${sizeKey}.minWidth`),
      padding: `${runtimeTokenVarPx(`component.button.size.${sizeKey}.paddingBlock`)} ${runtimeTokenVarPx(`component.button.size.${sizeKey}.paddingInline`)}`
    }),
    toCssRule(`.${BUTTON_ROOT_CLASS}[data-size="${sizeKey}"][data-shape="regular"]`, {
      "border-radius": runtimeTokenVarPx(`radius.alt.${getRadiusTokenKey(sizeKey)}`)
    }),
    toCssRule(`.${BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${BUTTON_CONTENT_CLASS}`, {
      gap: runtimeTokenVarPx(`component.button.size.${sizeKey}.gap`)
    }),
    toCssRule(`.${BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${BUTTON_LABEL_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.button.typography.${sizeKey}.fontSize`),
      "letter-spacing": runtimeTokenVarPx(`component.button.typography.${sizeKey}.letterSpacing`),
      "line-height": runtimeTokenVarPx(`component.button.typography.${sizeKey}.lineHeight`)
    }),
    toCssRule(`.${BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${BUTTON_SLOT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.button.size.${sizeKey}.iconSize`)
    }),
    toCssRule(`.${BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${BUTTON_LOADER_CLASS}`, {
      height: runtimeTokenVarPx(`component.button.size.${sizeKey}.loaderSize`),
      width: runtimeTokenVarPx(`component.button.size.${sizeKey}.loaderSize`)
    })
  ]),
  toCssRule(`.${BUTTON_ROOT_CLASS}[data-shape="pill"]`, {
    "border-radius": runtimeTokenVarPx("radius.pill")
  }),
  ...[false, true].flatMap((onDark) => {
    const modeKey = onDark ? "dark" : "light";
    const modeSelector = `.${BUTTON_ROOT_CLASS}[data-on-dark="${String(onDark)}"]`;

    return [
      toCssRule(`${modeSelector}[data-disabled="true"]`, {
        background: runtimeTokenVar(`component.button.color.${modeKey}.disabled.background`),
        "border-color": runtimeTokenVar(`component.button.color.${modeKey}.disabled.border`),
        color: runtimeTokenVar(`component.button.color.${modeKey}.disabled.foreground`)
      }),
      toCssRule(`${modeSelector}[data-disabled="true"] .${BUTTON_LOADER_CLASS}`, {
        "border-color": runtimeTokenVar(`component.button.color.${modeKey}.disabled.loaderTrack`),
        "border-top-color": runtimeTokenVar(`component.button.color.${modeKey}.disabled.loaderIndicator`)
      }),
      ...BUTTON_VARIANT_KEYS.flatMap((variantKey) =>
        ["rest", "hover"].flatMap((stateKey) => {
          const selector =
            stateKey === "hover"
              ? `${modeSelector}[data-variant="${variantKey}"][data-disabled="false"][data-hovered="true"]`
              : `${modeSelector}[data-variant="${variantKey}"][data-disabled="false"][data-hovered="false"]`;

          return [
            toCssRule(selector, {
              background: runtimeTokenVar(`component.button.color.${modeKey}.${variantKey}.${stateKey}.background`),
              "border-color": runtimeTokenVar(`component.button.color.${modeKey}.${variantKey}.${stateKey}.border`),
              color: runtimeTokenVar(`component.button.color.${modeKey}.${variantKey}.${stateKey}.foreground`)
            }),
            toCssRule(`${selector} .${BUTTON_LOADER_CLASS}`, {
              "border-color": runtimeTokenVar(`component.button.color.${modeKey}.${variantKey}.${stateKey}.loaderTrack`),
              "border-top-color": runtimeTokenVar(
                `component.button.color.${modeKey}.${variantKey}.${stateKey}.loaderIndicator`
              )
            })
          ];
        })
      )
    ];
  })
].join("");

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

  if (tone === undefined) {
    return "Solid";
  }

  if (tone === "ghost") {
    return "Ghost";
  }

  if (tone === "secondary") {
    return "Outline";
  }

  return "Solid";
}

function mapCtaVariant(variant: ButtonCTAVariant | undefined): ButtonStyleVariant | undefined {
  if (!variant) {
    return undefined;
  }

  if (variant === "primary") {
    return "Solid";
  }

  if (variant === "secondary") {
    return "Outline";
  }

  if (variant === "ghost") {
    return "Ghost";
  }

  if (variant === "transparent") {
    return "Transparent";
  }

  return "Destructive";
}

function renderSlot(content: ReactNode) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return <span className={BUTTON_SLOT_CLASS}>{content}</span>;
  }

  if (isValidElement(content)) {
    const element = content as StylableElement;

    return (
      <span className={BUTTON_SLOT_CLASS}>
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

  return <span className={BUTTON_SLOT_CLASS}>{content}</span>;
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "onClick" | "tabIndex"> {
  brand?: DisplayBrandId;
  cta?: ButtonCTA | undefined;
  shape?: ButtonShape;
  styleVariant?: ButtonStyleVariant;
  size?: ButtonSize | LegacyButtonSize;
  onDark?: boolean;
  loading?: boolean;
  forceState?: ButtonPreviewState;
  tone?: ButtonToneAlias;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  tabIndex?: number | undefined;
}

export function Button({
  brand = "Cars24",
  cta,
  className,
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
  onClick,
  tabIndex,
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

  useInsertionEffect(() => {
    ensureStyleSheet(BUTTON_STYLESHEET_ID, BUTTON_STYLESHEET);
  }, []);

  const normalizedSize = normalizeSize(size);
  const normalizedVariant = normalizeVariant(styleVariant ?? mapCtaVariant(cta?.variant), tone);
  const normalizedBrand = normalizeBrandId(brand);
  const isDisabled = disabled || loading;
  const isHovered = forceState === "Hover/Pressed" || hovered || pressed;
  const isPressed = !isDisabled && (pressed || forceState === "Hover/Pressed");
  const isFocused = forceState === "Focus" || focused;
  const labelContent = children ?? cta?.text;

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
    <button
      {...rest}
      aria-busy={loading || undefined}
      className={[BUTTON_ROOT_CLASS, className].filter(Boolean).join(" ")}
      data-brand={normalizedBrand}
      data-disabled={String(isDisabled)}
      data-focused={String(isFocused)}
      data-hovered={String(isHovered)}
      data-loading={String(loading)}
      data-on-dark={String(onDark)}
      data-pressed={String(isPressed)}
      data-shape={shape === "Pill" ? "pill" : "regular"}
      data-size={getTokenSizeKey(normalizedSize)}
      data-variant={getVariantKey(normalizedVariant)}
      disabled={isDisabled}
      onBlur={(event) => {
        setFocused(false);
        setPressed(false);
        onBlur?.(event);
      }}
      onClick={onClick}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      style={style}
      tabIndex={tabIndex}
    >
      {loading ? (
        <span aria-hidden="true" className={BUTTON_LOADER_CLASS} />
      ) : (
        <span className={BUTTON_CONTENT_CLASS}>
          {renderSlot(leadingIcon)}
          {labelContent ? <span className={BUTTON_LABEL_CLASS}>{labelContent}</span> : null}
          {renderSlot(trailingIcon)}
        </span>
      )}
    </button>
  );
}
