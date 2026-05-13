import {
  cloneElement,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useInsertionEffect,
  useRef,
  useState
} from "react";
import type { IconName } from "@turbo/icons";
import { designSystemRegistry } from "@turbo/contracts";
import { type DisplayBrandId, normalizeBrandId, REPO_BRAND_IDS, type RepoBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Icon } from "./icon";
import { ensureStyleSheet, joinClassNames, toCssRule } from "./runtime-styles";

export const canonicalBottomNavWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.bottomNav"
);

export type BottomNavType = "Sticky" | "Floating";
export type BottomNavConfiguration = "Label + icon" | "Icon only";
export type BottomNavItemState = "Rest" | "Selected";

export interface BottomNavItem {
  value: string;
  label?: ReactNode;
  ariaLabel?: string;
  iconName?: IconName;
  icon?: ReactNode;
  disabled?: boolean;
  state?: BottomNavItemState;
}

export interface BottomNavProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  brand?: DisplayBrandId;
  items: BottomNavItem[];
  type?: BottomNavType;
  configuration?: BottomNavConfiguration;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  showHomeIndicator?: boolean;
}

type StylableElement = ReactElement<{ style?: CSSProperties; className?: string; "aria-hidden"?: boolean }>;

const BOTTOM_NAV_ROOT_CLASS = "geist-bottom-nav";
const BOTTOM_NAV_RAIL_CLASS = "geist-bottom-nav__rail";
const BOTTOM_NAV_ITEM_CLASS = "geist-bottom-nav__item";
const BOTTOM_NAV_ICON_CLASS = "geist-bottom-nav__icon";
const BOTTOM_NAV_LABEL_CLASS = "geist-bottom-nav__label";
const BOTTOM_NAV_HOME_WRAPPER_CLASS = "geist-bottom-nav__home-wrapper";
const BOTTOM_NAV_HOME_INDICATOR_CLASS = "geist-bottom-nav__home-indicator";
const BOTTOM_NAV_STYLESHEET_ID = "geist-bottom-nav-styles";

function getBottomNavToken(slot: string) {
  return canonicalBottomNavWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function getDisplayBrandId(brandId: RepoBrandId): DisplayBrandId {
  if (brandId === "cars24") {
    return "Cars24";
  }

  if (brandId === "teambhp") {
    return "Team BHP";
  }

  if (brandId === "carinfo") {
    return "CarInfo";
  }

  return "VehicleInfo";
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function resolveBottomNavBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getBottomNavToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("component.") ||
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.") ||
    token.startsWith("icon.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

function toPx(value: string | number) {
  return tokenValueToRem(value);
}

function getDefaultValue(items: BottomNavItem[]) {
  return (
    items.find((item) => !item.disabled && item.state === "Selected")?.value ??
    items.find((item) => !item.disabled)?.value
  );
}

function resolveConfiguration(items: BottomNavItem[], configuration: BottomNavConfiguration | undefined) {
  if (configuration) {
    return configuration;
  }

  return items.some((item) => item.label !== undefined) ? "Label + icon" : "Icon only";
}

function resolveType(brand: DisplayBrandId, type: BottomNavType | undefined): BottomNavType {
  if (type) {
    return type;
  }

  return brand === "VehicleInfo" ? "Floating" : "Sticky";
}

function getNextEnabledIndex(items: BottomNavItem[], startIndex: number, direction: 1 | -1) {
  if (!items.length) {
    return -1;
  }

  for (let offset = 1; offset <= items.length; offset += 1) {
    const candidateIndex = (startIndex + offset * direction + items.length) % items.length;

    if (!items[candidateIndex]?.disabled) {
      return candidateIndex;
    }
  }

  return -1;
}

function renderItemIcon({
  brand,
  icon,
  iconName
}: {
  brand: DisplayBrandId;
  icon: ReactNode | undefined;
  iconName: IconName | undefined;
}) {
  if (icon) {
    if (isValidElement(icon)) {
      const element = icon as StylableElement;

      return (
        <span className={BOTTOM_NAV_ICON_CLASS}>
          {cloneElement(element, {
            "aria-hidden": true,
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

    return <span className={BOTTOM_NAV_ICON_CLASS}>{icon}</span>;
  }

  if (!iconName) {
    return null;
  }

  return (
    <span className={BOTTOM_NAV_ICON_CLASS}>
      <Icon
        brand={brand}
        decorative
        name={iconName}
        style={{
          color: "inherit",
          fontSize: "inherit"
        }}
      />
    </span>
  );
}

function buildBottomNavBrandRules(brandId: RepoBrandId) {
  const rootSelector = `.${BOTTOM_NAV_ROOT_CLASS}[data-brand="${brandId}"]`;
  const displayBrand = getDisplayBrandId(brandId);
  const canvasColor = String(getRequiredThemeTokenValue(displayBrand, "color.surface.canvas"));
  const inverseSurfaceColor = String(getRequiredThemeTokenValue(displayBrand, "color.surface.inverse"));
  const brandPrimaryColor = String(getRequiredThemeTokenValue(displayBrand, "color.brand.primary.500"));
  const inverseTextColor = String(getRequiredThemeTokenValue(displayBrand, "color.text.inverse"));
  const secondaryTextColor = String(getRequiredThemeTokenValue(displayBrand, "color.text.secondary"));
  const brandTextColor = String(
    getRequiredThemeTokenValue(displayBrand, "component.linkButton.color.light.brand.rest")
  );
  const defaultBorderColor = String(getRequiredThemeTokenValue(displayBrand, "color.border.default"));

  return [
    toCssRule(rootSelector, {
      "--bottom-nav-floating-container-background": resolveBottomNavBindingValue(
        displayBrand,
        "container.floating.background",
        brandPrimaryColor
      ),
      "--bottom-nav-floating-container-padding-block": toPx(
        resolveBottomNavBindingValue(displayBrand, "container.floating.paddingBlock", "4px")
      ),
      "--bottom-nav-floating-container-padding-inline-end": toPx(
        resolveBottomNavBindingValue(displayBrand, "container.floating.paddingInlineEnd", "12px")
      ),
      "--bottom-nav-floating-container-padding-inline-start": toPx(
        resolveBottomNavBindingValue(displayBrand, "container.floating.paddingInlineStart", "4px")
      ),
      "--bottom-nav-floating-container-radius": toPx(
        resolveBottomNavBindingValue(displayBrand, "container.floating.radius", "999px")
      ),
      "--bottom-nav-floating-gradient-canvas": resolveBottomNavBindingValue(
        displayBrand,
        "root.floating.gradient.canvas",
        canvasColor
      ),
      "--bottom-nav-floating-selected-background": resolveBottomNavBindingValue(
        displayBrand,
        "item.background.floating.selected",
        canvasColor
      ),
      "--bottom-nav-floating-wrapper-padding-block": toPx(
        resolveBottomNavBindingValue(displayBrand, "root.floating.paddingBlock", "8px")
      ),
      "--bottom-nav-floating-wrapper-padding-inline": toPx(
        resolveBottomNavBindingValue(displayBrand, "root.floating.paddingInline", "16px")
      ),
      "--bottom-nav-focus-outline-color": resolveBottomNavBindingValue(
        displayBrand,
        "item.focus.outlineColor",
        "transparent"
      ),
      "--bottom-nav-focus-outline-offset": toPx(
        resolveBottomNavBindingValue(displayBrand, "item.focus.outlineOffset", "2px")
      ),
      "--bottom-nav-focus-outline-width": toPx(
        resolveBottomNavBindingValue(displayBrand, "item.focus.outlineWidth", "2px")
      ),
      "--bottom-nav-home-indicator-color": resolveBottomNavBindingValue(
        displayBrand,
        "homeIndicator.color",
        inverseSurfaceColor
      ),
      "--bottom-nav-home-indicator-height": toPx(
        resolveBottomNavBindingValue(displayBrand, "homeIndicator.height", "5px")
      ),
      "--bottom-nav-home-indicator-opacity": resolveBottomNavBindingValue(
        displayBrand,
        "homeIndicator.opacity",
        "0.75"
      ),
      "--bottom-nav-home-indicator-width": toPx(
        resolveBottomNavBindingValue(displayBrand, "homeIndicator.width", "134px")
      ),
      "--bottom-nav-item-color-floating-disabled": resolveBottomNavBindingValue(
        displayBrand,
        "item.color.dark.disabled",
        inverseTextColor
      ),
      "--bottom-nav-item-color-floating-rest": resolveBottomNavBindingValue(
        displayBrand,
        "item.color.floating.rest",
        inverseTextColor
      ),
      "--bottom-nav-item-color-floating-selected": resolveBottomNavBindingValue(
        displayBrand,
        "item.color.floating.selected",
        brandTextColor
      ),
      "--bottom-nav-item-color-sticky-disabled": resolveBottomNavBindingValue(
        displayBrand,
        "item.color.light.disabled",
        secondaryTextColor
      ),
      "--bottom-nav-item-color-sticky-rest": resolveBottomNavBindingValue(
        displayBrand,
        "item.color.sticky.rest",
        secondaryTextColor
      ),
      "--bottom-nav-item-color-sticky-selected": resolveBottomNavBindingValue(
        displayBrand,
        "item.color.sticky.selected",
        brandTextColor
      ),
      "--bottom-nav-item-content-gap": toPx(resolveBottomNavBindingValue(displayBrand, "item.contentGap", "4px")),
      "--bottom-nav-item-height-floating": toPx(
        resolveBottomNavBindingValue(displayBrand, "item.height.floating", "62px")
      ),
      "--bottom-nav-item-height-sticky": toPx(resolveBottomNavBindingValue(displayBrand, "item.height.sticky", "56px")),
      "--bottom-nav-item-icon-size": toPx(
        resolveBottomNavBindingValue(
          displayBrand,
          "item.icon.size",
          String(getRequiredThemeTokenValue(displayBrand, "icon.size.lg"))
        )
      ),
      "--bottom-nav-item-opacity-disabled": "0.4",
      "--bottom-nav-item-overlap-floating": toPx(
        resolveBottomNavBindingValue(
          displayBrand,
          "item.overlap.floating",
          String(getRequiredThemeTokenValue(displayBrand, "spacing.2"))
        )
      ),
      "--bottom-nav-item-radius-floating": toPx(
        resolveBottomNavBindingValue(displayBrand, "item.radius.floating", "999px")
      ),
      "--bottom-nav-label-font-family": `${resolveBottomNavBindingValue(
        displayBrand,
        "item.typography.fontFamily",
        "Geist"
      )}, sans-serif`,
      "--bottom-nav-label-font-size": toPx(
        resolveBottomNavBindingValue(
          displayBrand,
          "item.typography.fontSize",
          String(getRequiredThemeTokenValue(displayBrand, "component.linkButton.typography.xs.fontSize"))
        )
      ),
      "--bottom-nav-label-font-weight": resolveBottomNavBindingValue(
        displayBrand,
        "item.typography.fontWeight",
        "600"
      ),
      "--bottom-nav-label-letter-spacing": toPx(
        resolveBottomNavBindingValue(
          displayBrand,
          "item.typography.letterSpacing",
          String(getRequiredThemeTokenValue(displayBrand, "component.linkButton.typography.xs.letterSpacing"))
        )
      ),
      "--bottom-nav-label-line-height": toPx(
        resolveBottomNavBindingValue(displayBrand, "item.typography.lineHeight", "17px")
      ),
      "--bottom-nav-sticky-background": resolveBottomNavBindingValue(
        displayBrand,
        "container.sticky.background",
        canvasColor
      ),
      "--bottom-nav-sticky-border-color": resolveBottomNavBindingValue(
        displayBrand,
        "container.sticky.borderColor",
        defaultBorderColor
      ),
      "--bottom-nav-sticky-border-width": toPx(
        resolveBottomNavBindingValue(displayBrand, "container.sticky.borderWidth", "1px")
      ),
      "--bottom-nav-sticky-indicator-height": toPx(
        resolveBottomNavBindingValue(
          displayBrand,
          "item.indicator.sticky.height",
          String(getRequiredThemeTokenValue(displayBrand, "component.switch.focus.outlineWidth"))
        )
      ),
      "--bottom-nav-sticky-indicator-width": toPx(
        resolveBottomNavBindingValue(
          displayBrand,
          "item.indicator.sticky.width",
          String(getRequiredThemeTokenValue(displayBrand, "spacing.12"))
        )
      )
    })
  ].join("");
}

const BOTTOM_NAV_STYLESHEET = [
  toCssRule(`.${BOTTOM_NAV_ROOT_CLASS}`, {
    "box-sizing": "border-box",
    display: "flex",
    "flex-direction": "column",
    width: "100%"
  }),
  toCssRule(`.${BOTTOM_NAV_ROOT_CLASS}[data-type="floating"]`, {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--bottom-nav-floating-gradient-canvas) 100%)",
    padding:
      "var(--bottom-nav-floating-wrapper-padding-block) var(--bottom-nav-floating-wrapper-padding-inline)"
  }),
  toCssRule(`.${BOTTOM_NAV_ROOT_CLASS}[data-type="sticky"]`, {
    background: "var(--bottom-nav-sticky-background)",
    "border-top":
      "var(--bottom-nav-sticky-border-width) solid var(--bottom-nav-sticky-border-color)"
  }),
  toCssRule(`.${BOTTOM_NAV_RAIL_CLASS}`, {
    "align-items": "stretch",
    "box-sizing": "border-box",
    display: "flex",
    width: "100%"
  }),
  toCssRule(`.${BOTTOM_NAV_ROOT_CLASS}[data-type="floating"] .${BOTTOM_NAV_RAIL_CLASS}`, {
    background: "var(--bottom-nav-floating-container-background)",
    "border-radius": "var(--bottom-nav-floating-container-radius)",
    padding:
      "var(--bottom-nav-floating-container-padding-block) var(--bottom-nav-floating-container-padding-inline-end) var(--bottom-nav-floating-container-padding-block) var(--bottom-nav-floating-container-padding-inline-start)"
  }),
  toCssRule(`.${BOTTOM_NAV_ROOT_CLASS}[data-type="sticky"] .${BOTTOM_NAV_RAIL_CLASS}`, {
    background: "var(--bottom-nav-sticky-background)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    "box-sizing": "border-box",
    color: "var(--bottom-nav-item-color)",
    cursor: "pointer",
    display: "flex",
    flex: "1 1 0",
    "flex-direction": "column",
    "justify-content": "center",
    "min-width": "0",
    outline: "none",
    padding: "0",
    position: "relative"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-show-label="true"]`, {
    gap: "var(--bottom-nav-item-content-gap)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-disabled="true"]`, {
    cursor: "not-allowed",
    opacity: "var(--bottom-nav-item-opacity-disabled)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="sticky"]`, {
    "min-height": "var(--bottom-nav-item-height-sticky)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"]`, {
    "min-height": "var(--bottom-nav-item-height-floating)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"]:not(:last-child)`, {
    "margin-inline-end": "calc(var(--bottom-nav-item-overlap-floating) * -1)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"][data-selected="true"]`, {
    background: "var(--bottom-nav-floating-selected-background)",
    "border-radius": "var(--bottom-nav-item-radius-floating)",
    "z-index": "1"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"][data-selected="false"]`, {
    "z-index": "0"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="sticky"][data-disabled="false"][data-selected="false"]`, {
    "--bottom-nav-item-color": "var(--bottom-nav-item-color-sticky-rest)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="sticky"][data-disabled="false"][data-selected="true"]`, {
    "--bottom-nav-item-color": "var(--bottom-nav-item-color-sticky-selected)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="sticky"][data-disabled="true"]`, {
    "--bottom-nav-item-color": "var(--bottom-nav-item-color-sticky-disabled)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"][data-disabled="false"][data-selected="false"]`, {
    "--bottom-nav-item-color": "var(--bottom-nav-item-color-floating-rest)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"][data-disabled="false"][data-selected="true"]`, {
    "--bottom-nav-item-color": "var(--bottom-nav-item-color-floating-selected)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="floating"][data-disabled="true"]`, {
    "--bottom-nav-item-color": "var(--bottom-nav-item-color-floating-disabled)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-focused="true"]`, {
    outline: "var(--bottom-nav-focus-outline-width) solid var(--bottom-nav-focus-outline-color)",
    "outline-offset": "var(--bottom-nav-focus-outline-offset)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}:focus-visible`, {
    outline: "var(--bottom-nav-focus-outline-width) solid var(--bottom-nav-focus-outline-color)",
    "outline-offset": "var(--bottom-nav-focus-outline-offset)"
  }),
  toCssRule(`.${BOTTOM_NAV_ITEM_CLASS}[data-type="sticky"][data-selected="true"]::before`, {
    background:
      "linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)",
    "border-radius": "999px",
    content: "\"\"",
    height: "var(--bottom-nav-sticky-indicator-height)",
    left: "50%",
    position: "absolute",
    top: "0",
    transform: "translateX(-50%)",
    width: "var(--bottom-nav-sticky-indicator-width)"
  }),
  toCssRule(`.${BOTTOM_NAV_ICON_CLASS}`, {
    color: "inherit",
    display: "inline-flex",
    "font-size": "var(--bottom-nav-item-icon-size)",
    "line-height": "0"
  }),
  toCssRule(`.${BOTTOM_NAV_LABEL_CLASS}`, {
    color: "inherit",
    display: "block",
    "font-family": "var(--bottom-nav-label-font-family)",
    "font-size": "var(--bottom-nav-label-font-size)",
    "font-weight": "var(--bottom-nav-label-font-weight)",
    "letter-spacing": "var(--bottom-nav-label-letter-spacing)",
    "line-height": "var(--bottom-nav-label-line-height)",
    overflow: "hidden",
    "text-align": "center",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
    width: "100%"
  }),
  toCssRule(`.${BOTTOM_NAV_HOME_WRAPPER_CLASS}`, {
    "align-items": "center",
    "box-sizing": "border-box",
    display: "flex",
    "justify-content": "center",
    padding: "12px 0 8px",
    width: "100%"
  }),
  toCssRule(`.${BOTTOM_NAV_ROOT_CLASS}[data-type="floating"] .${BOTTOM_NAV_HOME_WRAPPER_CLASS}`, {
    padding: "10px 0 8px"
  }),
  toCssRule(`.${BOTTOM_NAV_HOME_INDICATOR_CLASS}`, {
    background: "var(--bottom-nav-home-indicator-color)",
    "border-radius": "999px",
    height: "var(--bottom-nav-home-indicator-height)",
    opacity: "var(--bottom-nav-home-indicator-opacity)",
    width: "var(--bottom-nav-home-indicator-width)"
  }),
  ...REPO_BRAND_IDS.map((brandId) => buildBottomNavBrandRules(brandId))
].join("");

/**
 * Canonical mobile bottom navigation with sticky and floating variants, driven by equal-width destinations.
 */
export function BottomNav({
  brand = "Cars24",
  items,
  type,
  configuration,
  value,
  defaultValue,
  onValueChange,
  showHomeIndicator = false,
  className,
  style,
  "aria-label": ariaLabel = "Bottom navigation",
  ...rest
}: BottomNavProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    defaultValue ?? getDefaultValue(items)
  );
  const [focusedValue, setFocusedValue] = useState<string | undefined>(undefined);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useInsertionEffect(() => {
    ensureStyleSheet(BOTTOM_NAV_STYLESHEET_ID, BOTTOM_NAV_STYLESHEET);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      return;
    }

    if (!items.some((item) => item.value === uncontrolledValue && !item.disabled)) {
      setUncontrolledValue(getDefaultValue(items));
    }
  }, [items, uncontrolledValue, value]);

  const selectedValue = value ?? uncontrolledValue ?? getDefaultValue(items);
  const fallbackValue = getDefaultValue(items);
  const resolvedConfiguration = resolveConfiguration(items, configuration);
  const resolvedType = resolveType(brand, type);
  const typeKey = resolvedType === "Floating" ? "floating" : "sticky";
  const repoBrand = normalizeBrandId(brand);

  function selectValue(nextValue: string) {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    if (!items.length) {
      return;
    }

    const selectedIndex = items.findIndex((item) => item.value === selectedValue && !item.disabled);
    const currentIndex = selectedIndex >= 0 ? selectedIndex : index;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = getNextEnabledIndex(items, currentIndex, 1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;

      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = getNextEnabledIndex(items, currentIndex, -1);
      const nextItem = nextIndex >= 0 ? items[nextIndex] : undefined;

      if (nextIndex >= 0 && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      const nextValue = getDefaultValue(items);
      const nextIndex = nextValue ? items.findIndex((item) => item.value === nextValue) : -1;

      if (nextIndex >= 0 && nextValue) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextValue);
      }
    }

    if (event.key === "End") {
      event.preventDefault();
      const nextIndex = [...items]
        .map((item, itemIndex) => ({ item, itemIndex }))
        .reverse()
        .find(({ item }) => !item.disabled)?.itemIndex;
      const nextItem = nextIndex !== undefined ? items[nextIndex] : undefined;

      if (nextIndex !== undefined && nextItem) {
        buttonRefs.current[nextIndex]?.focus();
        selectValue(nextItem.value);
      }
    }
  }

  function handleFocus(itemValue: string, _event: FocusEvent<HTMLButtonElement>) {
    setFocusedValue(itemValue);
  }

  function handleBlur(itemValue: string, _event: FocusEvent<HTMLButtonElement>) {
    if (focusedValue === itemValue) {
      setFocusedValue(undefined);
    }
  }

  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      className={joinClassNames(BOTTOM_NAV_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-type={typeKey}
      style={style}
    >
      <div className={BOTTOM_NAV_RAIL_CLASS}>
        {items.map((item, index) => {
          const selected =
            item.value === selectedValue ||
            (value === undefined && selectedValue === undefined && item.state === "Selected");
          const itemLabel = item.label ?? item.ariaLabel ?? item.value;
          const visualLabel = resolvedConfiguration === "Label + icon" ? itemLabel : null;

          return (
            <button
              key={item.value}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              aria-label={item.ariaLabel ?? (typeof itemLabel === "string" ? itemLabel : item.value)}
              aria-pressed={selected}
              className={BOTTOM_NAV_ITEM_CLASS}
              data-disabled={String(Boolean(item.disabled))}
              data-focused={String(focusedValue === item.value)}
              data-selected={String(selected)}
              data-show-label={String(Boolean(visualLabel))}
              data-type={typeKey}
              disabled={item.disabled}
              onBlur={(event) => handleBlur(item.value, event)}
              onClick={() => {
                if (item.disabled) {
                  return;
                }

                selectValue(item.value);
              }}
              onFocus={(event) => handleFocus(item.value, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              tabIndex={selected || (!selectedValue && item.value === fallbackValue) ? 0 : -1}
              type="button"
            >
              {renderItemIcon({
                brand,
                icon: item.icon,
                iconName: item.iconName
              })}
              {visualLabel ? <span className={BOTTOM_NAV_LABEL_CLASS}>{visualLabel}</span> : null}
            </button>
          );
        })}
      </div>
      {showHomeIndicator ? (
        <div className={BOTTOM_NAV_HOME_WRAPPER_CLASS}>
          <div aria-hidden="true" className={BOTTOM_NAV_HOME_INDICATOR_CLASS} />
        </div>
      ) : null}
    </nav>
  );
}
