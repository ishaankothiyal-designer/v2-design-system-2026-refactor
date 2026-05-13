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
import { designSystemRegistry } from "@turbo/contracts";
import { normalizeBrandId, type DisplayBrandId } from "@turbo/tokens";
import { ensureStyleSheet, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalIconButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.iconButton"
);

export type IconButtonShape = "Regular" | "Round";
export type IconButtonStyleVariant =
  | "Solid - Primary"
  | "Solid - Black"
  | "Outline - Primary"
  | "Outline - Black"
  | "Subtle - Primary"
  | "Subtle - Black"
  | "Ghost - Brand"
  | "Ghost - Black"
  | "Transparent";
export type IconButtonSize = "XXXSmall" | "XXSmall" | "XSmall" | "Small" | "Medium" | "Large";
export type IconButtonPreviewState = "Rest" | "Hover/Pressed";

type IconButtonSizeKey = "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg";
type StylableElement = ReactElement<{ style?: CSSProperties; className?: string }>;

const ICON_BUTTON_ROOT_CLASS = "geist-icon-button";
const ICON_BUTTON_SLOT_CLASS = "geist-icon-button__slot";
const ICON_BUTTON_STYLESHEET_ID = "geist-icon-button-styles";
const ICON_BUTTON_TAP_TRANSFORM = "translateY(1px) scale(0.985)";
const ICON_BUTTON_TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";

function getTokenSizeKey(size: IconButtonSize): IconButtonSizeKey {
  if (size === "Large") {
    return "lg";
  }
  if (size === "Medium") {
    return "md";
  }
  if (size === "Small") {
    return "sm";
  }
  if (size === "XSmall") {
    return "xs";
  }
  if (size === "XXSmall") {
    return "xxs";
  }

  return "xxxs";
}

function getVariantKey(styleVariant: IconButtonStyleVariant) {
  switch (styleVariant) {
    case "Solid - Primary":
      return "solid-primary";
    case "Solid - Black":
      return "solid-black";
    case "Outline - Primary":
      return "outline-primary";
    case "Outline - Black":
      return "outline-black";
    case "Subtle - Primary":
      return "subtle-primary";
    case "Subtle - Black":
      return "subtle-black";
    case "Ghost - Brand":
      return "ghost-primary";
    case "Ghost - Black":
      return "ghost-black";
    case "Transparent":
      return "transparent";
  }
}

function getVariantTokenSegments(styleVariantKey: string) {
  if (styleVariantKey === "transparent") {
    return ["transparent"] as const;
  }

  const [family, tone] = styleVariantKey.split("-") as ["solid" | "outline" | "subtle" | "ghost", "primary" | "black"];
  return [family, tone] as const;
}

const ICON_BUTTON_SIZE_KEYS = ["xxxs", "xxs", "xs", "sm", "md", "lg"] as const;
const ICON_BUTTON_VARIANT_KEYS = [
  "solid-primary",
  "solid-black",
  "outline-primary",
  "outline-black",
  "subtle-primary",
  "subtle-black",
  "ghost-primary",
  "ghost-black",
  "transparent"
] as const;

const ICON_BUTTON_STYLESHEET = [
  toCssRule(`.${ICON_BUTTON_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    border: `${runtimeTokenVarPx("component.iconButton.border.width")} solid transparent`,
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "inline-flex",
    "justify-content": "center",
    outline: "none",
    "outline-offset": runtimeTokenVarPx("component.iconButton.focus.outlineOffset"),
    padding: "0",
    "transform-origin": "center center",
    transition: [
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      "outline-color 180ms cubic-bezier(0.2, 0, 0, 1)",
      ICON_BUTTON_TAP_TRANSITION
    ].join(", "),
    "will-change": "transform"
  }),
  toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-focused="true"]`, {
    outline: `${runtimeTokenVarPx("component.iconButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${ICON_BUTTON_ROOT_CLASS}:focus-visible`, {
    outline: `${runtimeTokenVarPx("component.iconButton.focus.outlineWidth")} solid ${runtimeTokenVar("color.border.focus")}`
  }),
  toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    "will-change": "auto"
  }),
  toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-pressed="true"][data-disabled="false"]`, {
    transform: ICON_BUTTON_TAP_TRANSFORM
  }),
  toCssRule(`.${ICON_BUTTON_SLOT_CLASS}`, {
    "align-items": "center",
    color: "inherit",
    display: "inline-flex",
    "justify-content": "center",
    "line-height": "1",
  }),
  ...ICON_BUTTON_SIZE_KEYS.flatMap((sizeKey) => [
    toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"]`, {
      height: runtimeTokenVarPx(`component.iconButton.size.${sizeKey}.boxSize`),
      width: runtimeTokenVarPx(`component.iconButton.size.${sizeKey}.boxSize`)
    }),
    toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"][data-shape="regular"]`, {
      "border-radius": runtimeTokenVarPx(`component.iconButton.size.${sizeKey}.borderRadius`)
    }),
    toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-size="${sizeKey}"] .${ICON_BUTTON_SLOT_CLASS}`, {
      "font-size": runtimeTokenVarPx(`component.iconButton.size.${sizeKey}.iconSize`),
      height: runtimeTokenVarPx(`component.iconButton.size.${sizeKey}.iconSize`),
      width: runtimeTokenVarPx(`component.iconButton.size.${sizeKey}.iconSize`)
    })
  ]),
  toCssRule(`.${ICON_BUTTON_ROOT_CLASS}[data-shape="round"]`, {
    "border-radius": runtimeTokenVarPx("radius.pill")
  }),
  ...[false, true].flatMap((onDark) => {
    const modeKey = onDark ? "dark" : "light";
    const modeSelector = `.${ICON_BUTTON_ROOT_CLASS}[data-on-dark="${String(onDark)}"]`;

    return [
      toCssRule(`${modeSelector}[data-disabled="true"]`, {
        background: runtimeTokenVar(`component.iconButton.color.${modeKey}.disabled.background`),
        "border-color": runtimeTokenVar(`component.iconButton.color.${modeKey}.disabled.border`),
        color: runtimeTokenVar(`component.iconButton.color.${modeKey}.disabled.foreground`)
      }),
      ...ICON_BUTTON_VARIANT_KEYS.flatMap((styleVariantKey) => {
        const segments = getVariantTokenSegments(styleVariantKey);

        return (["rest", "hover"] as const).map((stateKey) => {
          const selector =
            stateKey === "hover"
              ? `${modeSelector}[data-variant="${styleVariantKey}"][data-disabled="false"][data-hovered="true"]`
              : `${modeSelector}[data-variant="${styleVariantKey}"][data-disabled="false"][data-hovered="false"]`;

          const tokenPrefix =
            segments.length === 1
              ? `component.iconButton.color.${modeKey}.${segments[0]}.${stateKey}`
              : `component.iconButton.color.${modeKey}.${segments[0]}.${segments[1]}.${stateKey}`;

          return toCssRule(selector, {
            background: runtimeTokenVar(`${tokenPrefix}.background`),
            "border-color":
              styleVariantKey === "solid-primary" ||
              styleVariantKey === "solid-black" ||
              styleVariantKey === "subtle-primary" ||
              styleVariantKey === "subtle-black" ||
              styleVariantKey === "ghost-primary" ||
              styleVariantKey === "ghost-black" ||
              styleVariantKey === "transparent"
                ? "transparent"
                : runtimeTokenVar(`${tokenPrefix}.border`),
            color: runtimeTokenVar(`${tokenPrefix}.foreground`)
          });
        });
      })
    ];
  })
].join("");

function renderIcon(icon: ReactNode) {
  if (!icon) {
    return null;
  }

  if (isValidElement(icon)) {
    const element = icon as StylableElement;

    return (
      <span aria-hidden className={ICON_BUTTON_SLOT_CLASS}>
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
    <span aria-hidden className={ICON_BUTTON_SLOT_CLASS}>
      {icon}
    </span>
  );
}

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "size"> {
  brand?: DisplayBrandId;
  forceState?: IconButtonPreviewState;
  icon: ReactNode;
  onDark?: boolean;
  shape?: IconButtonShape;
  size?: IconButtonSize;
  styleVariant?: IconButtonStyleVariant;
}

export function IconButton({
  brand = "Cars24",
  className,
  disabled = false,
  forceState,
  icon,
  onBlur,
  onDark = false,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  shape = "Regular",
  size = "Medium",
  style,
  styleVariant = "Solid - Primary",
  type = "button",
  ...rest
}: IconButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useInsertionEffect(() => {
    ensureStyleSheet(ICON_BUTTON_STYLESHEET_ID, ICON_BUTTON_STYLESHEET);
  }, []);

  const normalizedBrand = normalizeBrandId(brand);
  const isHovered = forceState === "Hover/Pressed" || hovered || pressed;
  const isPressed = !disabled && (pressed || forceState === "Hover/Pressed");
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
      className={[ICON_BUTTON_ROOT_CLASS, className].filter(Boolean).join(" ")}
      data-brand={normalizedBrand}
      data-disabled={String(disabled)}
      data-focused={String(isFocused)}
      data-hovered={String(isHovered)}
      data-on-dark={String(onDark)}
      data-pressed={String(isPressed)}
      data-shape={shape === "Round" ? "round" : "regular"}
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
      {renderIcon(icon)}
    </button>
  );
}
