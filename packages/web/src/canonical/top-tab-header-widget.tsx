import {
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { AppHeader, type AppHeaderBrand, type AppHeaderIconAction, type AppHeaderProps } from "./app-header";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";
import { SearchBar, type SearchBarColor, type SearchBarProps } from "./search-bar";

export const canonicalTopTabHeaderWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.topTabHeaderWidget"
);

export type TopTabHeaderWidgetCountry = "India" | "Country2";

export interface TopTabHeaderWidgetItem {
  value: string;
  label: ReactNode;
  accentColor?: string;
  accentColorToken?: string;
  ariaLabel?: string;
  eyebrow?: ReactNode;
  image?: ReactNode;
  imageAlt?: string;
  imageSrc?: string;
  selectedImage?: ReactNode;
  selectedImageSrc?: string;
  unselectedImage?: ReactNode;
  unselectedImageSrc?: string;
}

export interface TopTabHeaderWidgetSearchAction
  extends Omit<IconButtonProps, "brand" | "icon" | "onDark" | "shape" | "size" | "styleVariant"> {
  icon: ReactNode;
  label: string;
}

export interface TopTabHeaderWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: AppHeaderBrand;
  country?: TopTabHeaderWidgetCountry;
  defaultValue?: string;
  value?: string;
  items?: TopTabHeaderWidgetItem[];
  showBanner?: boolean;
  showNavigationRail?: boolean;
  showSearchBar?: boolean;
  banner?: ReactNode;
  headerProps?: Partial<Omit<AppHeaderProps, "brand" | "level" | "variant">>;
  onValueChange?: (value: string) => void;
  searchAction?: TopTabHeaderWidgetSearchAction | null;
  searchBarProps?: Omit<SearchBarProps, "brand" | "color" | "size">;
}

export interface TopTabHeaderWidgetTabStatusAtomProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "children"> {
  brand?: AppHeaderBrand;
  buttonRef?: (element: HTMLButtonElement | null) => void;
  country?: TopTabHeaderWidgetCountry;
  expanded?: boolean;
  item: TopTabHeaderWidgetItem;
  selected?: boolean;
}

const DEFAULT_BANNER_HEIGHT = 144;
const DEFAULT_NAV_ITEM_WIDTH = 70;
const INDIA_NAV_ITEM_HEIGHT = 88;
const COUNTRY2_NAV_ITEM_HEIGHT = 70;
const DEFAULT_SEARCH_ACTION: TopTabHeaderWidgetSearchAction = {
  icon: <Icon decorative name="bookmark-banner-flag-tag-outline" />,
  label: "Saved items"
};
const tabAllActiveNoSrc = new URL("./assets/top-tab-header-widget/tab-all-active-no.png", import.meta.url).href;
const tabAllActiveYesSrc = new URL("./assets/top-tab-header-widget/tab-all-active-yes.png", import.meta.url).href;
const tabBuyActiveNoSrc = new URL("./assets/top-tab-header-widget/tab-buy-active-no.png", import.meta.url).href;
const tabBuyActiveYesSrc = new URL("./assets/top-tab-header-widget/tab-buy-active-yes.png", import.meta.url).href;
const tabCarCheckActiveNoSrc = new URL(
  "./assets/top-tab-header-widget/tab-car-check-active-no.png",
  import.meta.url
).href;
const tabCarCheckActiveYesSrc = new URL(
  "./assets/top-tab-header-widget/tab-car-check-active-yes.png",
  import.meta.url
).href;
const tabChallanActiveNoSrc = new URL(
  "./assets/top-tab-header-widget/tab-challan-active-no.png",
  import.meta.url
).href;
const tabChallanActiveYesSrc = new URL(
  "./assets/top-tab-header-widget/tab-challan-active-yes.png",
  import.meta.url
).href;
const tabInsuranceActiveNoSrc = new URL(
  "./assets/top-tab-header-widget/tab-insurance-active-no.png",
  import.meta.url
).href;
const tabInsuranceActiveYesSrc = new URL(
  "./assets/top-tab-header-widget/tab-insurance-active-yes.png",
  import.meta.url
).href;
const tabLoanActiveNoSrc = new URL("./assets/top-tab-header-widget/tab-loan-active-no.png", import.meta.url).href;
const tabLoanActiveYesSrc = new URL("./assets/top-tab-header-widget/tab-loan-active-yes.png", import.meta.url).href;
const tabSellActiveNoSrc = new URL("./assets/top-tab-header-widget/tab-sell-active-no.png", import.meta.url).href;
const tabSellActiveYesSrc = new URL("./assets/top-tab-header-widget/tab-sell-active-yes.png", import.meta.url).href;
const indiaTabAccentColorTokens = {
  buy: "color.utility.service.buy-car.bold",
  sell: "color.utility.service.sell-car.bold",
  loan: "color.utility.service.loan.base",
  "car-check": "color.utility.service.car-check.bold",
  challan: "color.utility.service.challan.base",
  insurance: "color.utility.service.insurance.base"
} as const;
const indiaTabStatusImageSources = {
  all: {
    selected: tabAllActiveYesSrc,
    unselected: tabAllActiveNoSrc
  },
  buy: {
    selected: tabBuyActiveYesSrc,
    unselected: tabBuyActiveNoSrc
  },
  sell: {
    selected: tabSellActiveYesSrc,
    unselected: tabSellActiveNoSrc
  },
  loan: {
    selected: tabLoanActiveYesSrc,
    unselected: tabLoanActiveNoSrc
  },
  "car-check": {
    selected: tabCarCheckActiveYesSrc,
    unselected: tabCarCheckActiveNoSrc
  },
  challan: {
    selected: tabChallanActiveYesSrc,
    unselected: tabChallanActiveNoSrc
  },
  insurance: {
    selected: tabInsuranceActiveYesSrc,
    unselected: tabInsuranceActiveNoSrc
  }
} as const;

function createHeaderAction(iconName: "bookmark-banner-flag-tag-outline" | "sparkle-filled", label: string) {
  return {
    icon: <Icon decorative name={iconName} />,
    label
  } satisfies AppHeaderIconAction;
}

function omitUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  ) as Partial<T>;
}

function buildDefaultHeaderProps(country: TopTabHeaderWidgetCountry) {
  return omitUndefined({
    action1: createHeaderAction("bookmark-banner-flag-tag-outline", "Saved items"),
    action2: createHeaderAction("sparkle-filled", "Rewards"),
    avatarInitials: "C24",
    showAction1: true,
    showAction2: true,
    showAvatar: true,
    showLocation: country === "India",
    showLocationChevron: country === "India",
    locationLabel: country === "India" ? "Gurugram, NCR" : undefined
  });
}

function createArtwork(
  label: string,
  palette: readonly [string, string, string],
  selected: boolean,
  rounded = true
) {
  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "flex-end",
        background: `linear-gradient(145deg, ${palette[0]} 0%, ${palette[1]} 58%, ${palette[2]} 100%)`,
        borderRadius: rounded ? pxToRem(18) : pxToRem(12),
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        style={{
          background: selected ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.12)",
          borderRadius: pxToRem(999),
          height: pxToRem(14),
          left: "50%",
          position: "absolute",
          top: pxToRem(8),
          transform: "translateX(-50%)",
          width: pxToRem(44)
        }}
      />
      <div
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: `${pxToRem(999)} ${pxToRem(999)} 0 0`,
          height: "70%",
          transform: "translateY(18%)",
          width: "72%"
        }}
      />
      <span
        style={{
          bottom: pxToRem(8),
          color: "rgba(255, 255, 255, 0.92)",
          fontSize: pxToRem(10),
          fontWeight: 700,
          left: "50%",
          letterSpacing: pxToRem(0.2),
          position: "absolute",
          textTransform: "uppercase",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap"
        }}
      >
        {label.slice(0, 3)}
      </span>
    </div>
  );
}

export function getTopTabHeaderWidgetDefaultItems(country: TopTabHeaderWidgetCountry): TopTabHeaderWidgetItem[] {
  const indiaItems = [
    ["all", "All"],
    ["buy", "Buy car"],
    ["sell", "Sell car"],
    ["loan", "Get loans"],
    ["car-check", "Car check"],
    ["challan", "Challan"],
    ["insurance", "Insurance"]
  ] as const;
  const country2Items = [
    ["all", "All", ["#F5F0FF", "#E6DEFF", "#C5B5FF"]],
    ["buy", "Buy Car", ["#FFE2CC", "#FDBA8C", "#D97706"]],
    ["sell", "Sell Car", ["#EFD8FF", "#C7A4FF", "#7C3AED"]],
    ["loan", "Loan", ["#D9F0FF", "#95D5FF", "#2563EB"]],
    ["service", "Car Service", ["#E7FFF4", "#9AE6C3", "#059669"]],
    ["chauferly", "Chauferly", ["#FFE7F1", "#F8B4D9", "#DB2777"]],
    ["new-car", "New Car", ["#FFF3D6", "#FDE68A", "#D97706"]]
  ] as const;

  if (country === "India") {
    return indiaItems.map(([value, label]) => ({
      ...(value === "all" ? {} : { accentColorToken: indiaTabAccentColorTokens[value] }),
      value,
      label,
      imageAlt: `${label} tab`,
      selectedImageSrc: indiaTabStatusImageSources[value].selected,
      unselectedImageSrc: indiaTabStatusImageSources[value].unselected
    }));
  }

  return country2Items.map(([value, label, palette], index) => ({
    value,
    label,
    eyebrow: index === 0 ? "All" : undefined,
    selectedImage: createArtwork(label, palette, true, true),
    unselectedImage: createArtwork(label, palette, false, true)
  }));
}

function renderMedia(item: TopTabHeaderWidgetItem, label: ReactNode, size: string, selected: boolean) {
  const statefulImage = selected ? item.selectedImage : item.unselectedImage;
  const statefulImageSrc = selected ? item.selectedImageSrc : item.unselectedImageSrc;

  if (statefulImage) {
    if (isValidElement(statefulImage)) {
      return cloneElement(statefulImage as ReactElement<{ "aria-hidden"?: boolean }>, {
        "aria-hidden": true
      });
    }

    return statefulImage;
  }

  if (statefulImageSrc) {
    return (
      <img
        alt={item.imageAlt ?? ""}
        aria-hidden="true"
        src={statefulImageSrc}
        style={{
          display: "block",
          height: size,
          objectFit: "contain",
          width: size
        }}
      />
    );
  }

  if (item.image) {
    if (isValidElement(item.image)) {
      return cloneElement(item.image as ReactElement<{ "aria-hidden"?: boolean }>, {
        "aria-hidden": true
      });
    }

    return item.image;
  }

  if (item.imageSrc) {
    return (
      <img
        alt={item.imageAlt ?? ""}
        aria-hidden="true"
        src={item.imageSrc}
        style={{
          borderRadius: pxToRem(18),
          display: "block",
          height: size,
          objectFit: "cover",
          width: size
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        background: "linear-gradient(145deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.12))",
        borderRadius: pxToRem(18),
        color: "rgba(255, 255, 255, 0.92)",
        display: "grid",
        fontSize: pxToRem(12),
        fontWeight: 700,
        height: size,
        letterSpacing: pxToRem(0.2),
        placeItems: "center",
        textTransform: "uppercase",
        width: size
      }}
    >
      {typeof label === "string" ? label.slice(0, 2) : "TT"}
    </div>
  );
}

function DefaultBanner({ brand = "Cars24" }: { brand?: AppHeaderBrand }) {
  const highlight = String(getRequiredThemeTokenValue(brand, "color.brand.primary.100"));

  return (
    <div
      aria-label="Banner image placeholder"
      role="img"
      style={{
        background:
          "radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.46), transparent 32%), linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(10, 10, 10, 0.14))",
        display: "block",
        height: pxToRem(DEFAULT_BANNER_HEIGHT),
        overflow: "hidden",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        aria-hidden="true"
        style={{
          background: `linear-gradient(160deg, rgba(255, 255, 255, 0.96), ${highlight})`,
          borderRadius: pxToRem(24),
          bottom: pxToRem(-10),
          height: pxToRem(104),
          position: "absolute",
          right: pxToRem(-18),
          transform: "rotate(-8deg)",
          width: pxToRem(172)
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background: "rgba(255, 255, 255, 0.18)",
          borderRadius: pxToRem(20),
          height: pxToRem(88),
          left: pxToRem(18),
          position: "absolute",
          top: pxToRem(26),
          width: pxToRem(120)
        }}
      />
      <div
        aria-hidden="true"
        style={{
          background: "rgba(255, 255, 255, 0.14)",
          borderRadius: pxToRem(999),
          height: pxToRem(10),
          left: pxToRem(30),
          position: "absolute",
          top: pxToRem(42),
          width: pxToRem(72)
        }}
      />
    </div>
  );
}

function findNextIndex(startIndex: number, itemCount: number, direction: 1 | -1) {
  if (itemCount <= 0) {
    return -1;
  }

  return (startIndex + direction + itemCount) % itemCount;
}

function getWidgetSurfaceBackground(
  brand: AppHeaderBrand,
  brandBackground: string,
  selectedItem: TopTabHeaderWidgetItem | undefined
) {
  if (selectedItem?.accentColorToken) {
    return String(getRequiredThemeTokenValue(brand, selectedItem.accentColorToken));
  }

  return selectedItem?.accentColor ?? brandBackground;
}

export function TopTabHeaderWidgetTabStatusAtom({
  brand = "Cars24",
  buttonRef,
  country = "India",
  expanded = true,
  item,
  selected = false,
  style,
  ...rest
}: TopTabHeaderWidgetTabStatusAtomProps) {
  const spacing1 = Number(getRequiredThemeTokenValue(brand, "spacing.1"));
  const spacing2 = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const radiusLg = Number(getRequiredThemeTokenValue(brand, "radius.alt.lg"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const labelFontSize = pxToRem(Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.sm.fontSize")));
  const labelLineHeight = pxToRem(
    Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.sm.lineHeight"))
  );
  const eyebrowFontSize = pxToRem(Number(getRequiredThemeTokenValue(brand, "typography.fontSize.xs")));
  const inverseText = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const selectedBackground = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const selectedForeground = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const navItemHeight = country === "India" ? INDIA_NAV_ITEM_HEIGHT : COUNTRY2_NAV_ITEM_HEIGHT;
  const label = item.label;
  const labelText = typeof label === "string" ? label : item.ariaLabel ?? item.value;
  const labelColor =
    country === "Country2" && selected ? selectedForeground : selected ? inverseText : "rgba(255, 255, 255, 0.82)";
  const eyebrow = item.eyebrow ?? label;
  const mediaSize = country === "India" ? pxToRem(56) : selected ? pxToRem(42) : pxToRem(38);

  return (
    <button
      {...rest}
      aria-label={typeof labelText === "string" ? labelText : item.value}
      aria-selected={selected}
      ref={buttonRef}
      role="tab"
      style={{
        alignItems: "center",
        appearance: "none",
        background:
          !expanded
            ? "transparent"
            : country === "Country2"
              ? selected
                ? selectedBackground
                : "linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(0, 0, 0, 0.14))"
              : "transparent",
        border: "none",
        borderBottom:
          country === "India" && selected ? `${pxToRem(2)} solid ${inverseText}` : "none",
        borderRadius: expanded && country === "Country2" ? pxToRem(radiusLg) : 0,
        color: labelColor,
        cursor: "pointer",
        display: "inline-flex",
        flex: "0 0 auto",
        flexDirection: "column",
        gap: expanded ? (country === "India" ? pxToRem(8) : pxToRem(spacing1)) : 0,
        height: expanded ? (country === "India" ? "auto" : pxToRem(navItemHeight)) : pxToRem(country === "India" ? 36 : 40),
        justifyContent: "flex-start",
        minHeight: expanded && country === "India" ? pxToRem(navItemHeight) : undefined,
        padding: expanded
          ? country === "India"
            ? `${pxToRem(8)} 0 ${pxToRem(8)}`
            : `${pxToRem(6)} ${pxToRem(6)} ${pxToRem(8)}`
          : 0,
        width: pxToRem(DEFAULT_NAV_ITEM_WIDTH),
        ...style
      }}
      tabIndex={selected ? 0 : -1}
      type="button"
    >
      {expanded && country === "Country2" && selected ? (
        <span
          style={{
            color: selectedForeground,
            fontFamily: `${fontFamily}, sans-serif`,
            fontSize: eyebrowFontSize,
            fontWeight: 600,
            lineHeight: pxToRem(16),
            whiteSpace: "nowrap"
          }}
        >
          {eyebrow}
        </span>
      ) : null}

      {expanded ? (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            display: "inline-flex",
            height: mediaSize,
            justifyContent: "center",
            overflow: country === "India" ? "visible" : "hidden",
            width: country === "India" ? mediaSize : "100%"
          }}
        >
          {renderMedia(item, label, mediaSize, selected)}
        </span>
      ) : null}

      <span
        style={{
          color: labelColor,
          display: expanded && country === "Country2" ? "-webkit-box" : "inline-block",
          fontFamily: `${fontFamily}, sans-serif`,
          fontSize: labelFontSize,
          fontWeight: selected ? 600 : country === "Country2" ? 500 : 400,
          letterSpacing: "0",
          lineHeight: labelLineHeight,
          maxWidth: "100%",
          overflow: "hidden",
          textAlign: "center",
          WebkitBoxOrient: expanded && country === "Country2" ? "vertical" : undefined,
          WebkitLineClamp: expanded && country === "Country2" ? 2 : undefined,
          whiteSpace: expanded && country === "Country2" ? "normal" : "nowrap"
        }}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Mobile header widget that composes the canonical brand header with a country-specific search and top-tab discovery rail.
 */
export function TopTabHeaderWidget({
  banner,
  brand = "Cars24",
  className,
  country = "India",
  defaultValue,
  headerProps,
  items,
  onValueChange,
  searchAction,
  searchBarProps,
  showBanner = true,
  showNavigationRail = true,
  showSearchBar = true,
  style,
  value,
  ...rest
}: TopTabHeaderWidgetProps) {
  const resolvedItems = items && items.length > 0 ? items : getTopTabHeaderWidgetDefaultItems(country);
  const initialValue = defaultValue ?? resolvedItems[0]?.value;
  const [internalValue, setInternalValue] = useState<string | undefined>(initialValue);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    if (resolvedValue && resolvedItems.some((item) => item.value === resolvedValue)) {
      return;
    }

    setInternalValue(resolvedItems[0]?.value);
  }, [isControlled, resolvedItems, resolvedValue]);

  const spacing1 = Number(getRequiredThemeTokenValue(brand, "spacing.1"));
  const spacing2 = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const radiusMd = Number(getRequiredThemeTokenValue(brand, "radius.alt.md"));
  const inverseText = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const brandBackground = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const selectedItem =
    resolvedItems.find((item) => item.value === resolvedValue) ??
    resolvedItems[0];
  const widgetSurfaceBackground = getWidgetSurfaceBackground(brand, brandBackground, selectedItem);
  const searchColor: SearchBarColor = country === "India" ? "Inverse" : "Solid White";
  const searchActionNode = country === "Country2" ? searchAction ?? DEFAULT_SEARCH_ACTION : null;
  const navigationGap = country === "India" ? spacing3 : spacing2;
  const searchFirst = country === "India";
  const mergedHeaderProps = omitUndefined({
    ...buildDefaultHeaderProps(country),
    ...headerProps
  });
  const appHeaderProps = mergedHeaderProps as Partial<Omit<AppHeaderProps, "brand" | "level" | "variant">>;
  const resolvedHeaderStyle = {
    background: "transparent",
    ...(appHeaderProps.style ?? {})
  };
  const searchBarNode = showSearchBar ? (
    <div
      style={{
        alignItems: "flex-start",
        boxSizing: "border-box",
        display: "flex",
        gap: pxToRem(spacing2),
        padding: `0 ${pxToRem(spacing3)} ${pxToRem(spacing3)}`,
        width: "100%"
      }}
    >
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <SearchBar
          brand={brand}
          color={searchColor}
          placeholder="Search"
          size="Small"
          {...searchBarProps}
        />
      </div>
      {searchActionNode ? (() => {
        const { icon, label, ...searchActionProps } = searchActionNode;

        return (
          <IconButton
            aria-label={label}
            brand={brand}
            icon={icon}
            onDark={false}
            shape="Round"
            size="Medium"
            styleVariant="Subtle - Black"
            {...searchActionProps}
          />
        );
      })() : null}
    </div>
  ) : null;

  const navigationNode = showNavigationRail ? (
    <div
      role="tablist"
      aria-orientation="horizontal"
      style={{
        boxSizing: "border-box",
        display: "flex",
        gap: pxToRem(navigationGap),
        overflowX: "auto",
        padding: `0 ${pxToRem(spacing3)} ${searchFirst ? "0" : pxToRem(spacing3)}`,
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        width: "100%"
      }}
    >
      {resolvedItems.map((item, index) => {
        const selected = item.value === resolvedValue || (!resolvedValue && index === 0);

        return (
          <TopTabHeaderWidgetTabStatusAtom
            key={item.value}
            brand={brand}
            buttonRef={(element: HTMLButtonElement | null) => {
              buttonRefs.current[index] = element;
            }}
            country={country}
            expanded
            item={item}
            onClick={() => {
              if (!isControlled) {
                setInternalValue(item.value);
              }

              onValueChange?.(item.value);
            }}
            onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                return;
              }

              event.preventDefault();
              const nextIndex = findNextIndex(index, resolvedItems.length, event.key === "ArrowRight" ? 1 : -1);

              if (nextIndex < 0) {
                return;
              }

              const nextItem = resolvedItems[nextIndex];

              if (!nextItem) {
                return;
              }

              buttonRefs.current[nextIndex]?.focus();

              if (!isControlled) {
                setInternalValue(nextItem.value);
              }

              onValueChange?.(nextItem.value);
            }}
            selected={selected}
          />
        );
      })}
    </div>
  ) : null;

  return (
    <div
      {...rest}
      className={className}
      style={{
        background: widgetSurfaceBackground,
        borderRadius: country === "Country2" ? pxToRem(radiusMd) : undefined,
        boxSizing: "border-box",
        color: inverseText,
        overflow: "hidden",
        transition: "background 180ms ease",
        width: "100%",
        ...style
      }}
    >
      <div style={{ display: "grid", gap: pxToRem(spacing1), width: "100%" }}>
        <AppHeader
          brand={brand}
          level="Page - L1"
          variant="Brand"
          {...appHeaderProps}
          style={resolvedHeaderStyle}
        />
        {searchFirst ? searchBarNode : null}
        {navigationNode}
        {searchFirst ? null : searchBarNode}
      </div>

      {showBanner ? <div style={{ width: "100%" }}>{banner ?? <DefaultBanner brand={brand} />}</div> : null}
    </div>
  );
}
