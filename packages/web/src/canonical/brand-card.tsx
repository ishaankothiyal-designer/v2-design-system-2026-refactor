import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useInsertionEffect
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";
import { ensureStyleSheet, joinClassNames, toCssRule } from "./runtime-styles";

export const canonicalBrandCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.brandCard"
);

export type BrandCardState = "Rest" | "Pressed";

type StylableElement = ReactElement<{ className?: string; style?: CSSProperties }>;

export interface BrandCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "slot"> {
  brand?: DisplayBrandId;
  label?: ReactNode;
  slot?: ReactNode;
  state?: BrandCardState;
}

const BRAND_CARD_ROOT_CLASS = "geist-brand-card";
const BRAND_CARD_SLOT_CLASS = "geist-brand-card__slot";
const BRAND_CARD_LABEL_CLASS = "geist-brand-card__label";
const BRAND_CARD_STYLESHEET_ID = "geist-brand-card-styles";
const FIGMA_GAP_4 = "var(--cars24-misc-gap-4, 4px)";
const FIGMA_GAP_6 = "var(--cars24-misc-gap-6, 6px)";
const FIGMA_GAP_12 = "var(--cars24-misc-gap-12, 12px)";
const FIGMA_RADIUS_MD = "var(--cars24-theme-radius-md, 12px)";
const FIGMA_RADIUS_XXS = "var(--cars24-theme-radius-xxs, 4px)";
const FIGMA_SLOT_BACKGROUND = "var(--cars24-primitive-drive-pink-50, #FFE8F7)";
const FIGMA_SLOT_ICON = "var(--cars24-primitive-drive-pink-400, #FD49C0)";
const FIGMA_HEADLINE_H5_SIZE = "var(--cars24-typography-size-headline-h5, 13px)";
const FIGMA_HEADLINE_H5_LINE_HEIGHT = "var(--cars24-typography-line-height-headline-h5, 18px)";
const FIGMA_HEADLINE_H5_LETTER_SPACING = "var(--cars24-typography-letter-spacing-headline-h5, 0px)";

const BRAND_CARD_STYLESHEET = [
  toCssRule(`.${BRAND_CARD_ROOT_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    "box-sizing": "border-box",
    cursor: "pointer",
    display: "inline-flex",
    flex: "0 0 auto",
    gap: FIGMA_GAP_4,
    "min-width": "0",
    outline: "none",
    position: "relative",
    "text-decoration": "none",
    "white-space": "nowrap"
  }),
  toCssRule(`.${BRAND_CARD_ROOT_CLASS}:focus-visible`, {
    outline: "2px solid var(--cars24-semantic-border-brand-base, #4736FE)",
    "outline-offset": "2px"
  }),
  toCssRule(`.${BRAND_CARD_ROOT_CLASS}:disabled`, {
    cursor: "not-allowed",
    opacity: "0.6"
  }),
  toCssRule(`.${BRAND_CARD_SLOT_CLASS}`, {
    "align-items": "center",
    background: FIGMA_SLOT_BACKGROUND,
    "border-radius": FIGMA_RADIUS_XXS,
    color: FIGMA_SLOT_ICON,
    display: "inline-flex",
    "flex-shrink": "0",
    height: "24px",
    "justify-content": "center",
    overflow: "hidden",
    width: "24px"
  }),
  toCssRule(`.${BRAND_CARD_LABEL_CLASS}`, {
    display: "block",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  })
].join("");

function renderSlotContent({
  brand,
  color,
  slot
}: {
  brand: DisplayBrandId;
  color: string;
  slot: ReactNode;
}) {
  if (slot === null) {
    return null;
  }

  if (slot === undefined) {
    return (
      <Icon
        brand={brand}
        decorative
        name="square-plus-add-outline"
        size="sm"
        style={{ color, fontSize: 16 }}
      />
    );
  }

  if (typeof slot === "string" || typeof slot === "number") {
    return (
      <span aria-hidden="true" style={{ color, fontSize: 12, lineHeight: 1 }}>
        {slot}
      </span>
    );
  }

  if (isValidElement(slot)) {
    const element = slot as StylableElement;

    return cloneElement(element, {
      className: [element.props.className].filter(Boolean).join(" "),
      style: {
        color,
        maxHeight: "100%",
        maxWidth: "100%",
        ...element.props.style
      }
    });
  }

  return slot;
}

/**
 * Compact selectable brand pill with a fixed logo slot and rest/pressed visual states.
 */
export function BrandCard({
  brand = "Cars24",
  className,
  label = "Maruti Suzuki",
  slot,
  state = "Rest",
  style,
  type = "button",
  ...rest
}: BrandCardProps) {
  useInsertionEffect(() => {
    ensureStyleSheet(BRAND_CARD_STYLESHEET_ID, BRAND_CARD_STYLESHEET);
  }, []);

  const isPressed = state === "Pressed";
  const background = isPressed
    ? String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"))
    : String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const borderColor = isPressed
    ? String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"))
    : String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.rest.border"));
  const textColor = String(getRequiredThemeTokenValue(brand, "component.sectionHeader.color.light.title"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.button.border.width"));
  const rootClassName = joinClassNames(BRAND_CARD_ROOT_CLASS, className);

  const rootStyle: CSSProperties = {
    background,
    border: `${pxToRem(borderWidth)} solid ${borderColor}`,
    borderRadius: FIGMA_RADIUS_MD,
    color: textColor,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: FIGMA_HEADLINE_H5_SIZE,
    fontWeight,
    height: "var(--cars24-misc-size-40, 40px)",
    letterSpacing: FIGMA_HEADLINE_H5_LETTER_SPACING,
    lineHeight: FIGMA_HEADLINE_H5_LINE_HEIGHT,
    padding: `${FIGMA_GAP_4} ${FIGMA_GAP_12} ${FIGMA_GAP_4} ${FIGMA_GAP_6}`,
    ...style
  };

  return (
    <button
      {...rest}
      className={rootClassName}
      data-state={state}
      style={rootStyle}
      type={type}
    >
      <span aria-hidden="true" className={BRAND_CARD_SLOT_CLASS}>
        {renderSlotContent({ brand, color: FIGMA_SLOT_ICON, slot })}
      </span>
      <span className={BRAND_CARD_LABEL_CLASS}>{label}</span>
    </button>
  );
}
