import type { CSSProperties, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import {
  Badge,
  BottomNav,
  BrandLogo,
  Button,
  HorizontalTab,
  Icon,
  LazyLoader,
  Pagination,
  SearchBar,
  SectionHeader,
  Text,
  TextInput,
  getRequiredThemeTokenValue,
  type BottomNavItem,
  type HorizontalTabItem
} from "@geist/web";
import { StoryBadge, StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const mercedesCClassImageSrc = new URL("./assets/car-marketplace/mercedes-c-class.png", import.meta.url).href;
const marutiSwiftImageSrc = new URL("./assets/car-marketplace/maruti-swift.png", import.meta.url).href;
const rangeRoverEvoqueImageSrc = new URL("./assets/car-marketplace/range-rover-evoque.png", import.meta.url).href;
const bmwFiveSeriesImageSrc = new URL("./assets/car-marketplace/bmw-5-series.avif", import.meta.url).href;
const tataAltrozImageSrc = new URL("./assets/car-marketplace/tata-altroz.avif", import.meta.url).href;
const tataSierraImageSrc = new URL("./assets/car-marketplace/tata-sierra.avif", import.meta.url).href;
const mahindraScorpioImageSrc = new URL("./assets/car-marketplace/mahindra-scorpio-s11-stealth-black.webp", import.meta.url).href;

export type CarMarketplaceDashboardDesktopProps = {
  brand?: DisplayBrandId;
};

type DashboardState = "default" | "loading" | "empty" | "error";
type SidebarMode = "open" | "collapsed";

type DashboardTokens = {
  border: string;
  borderSubtle: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  canvas: string;
  danger: string;
  dangerSoft: string;
  infoSoft: string;
  primary: string;
  secondary: string;
  success: string;
  successSoft: string;
  subtle: string;
  warning: string;
  warningSoft: string;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  radiusPill: number;
  thinBorder: number;
  shadow: string;
};

type Metric = {
  accent: "brand" | "success" | "warning" | "danger";
  helper: string;
  label: string;
  value: string;
};

type Lead = {
  cta: string;
  helper: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  location: string;
  price: string;
  priority: "neutral" | "success" | "warning";
  responseTarget: string;
  specs: string;
};

type InventoryRowData = {
  cta: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  location: string;
  meta: string;
  price: string;
  status: string;
  tone: "neutral" | "success" | "warning";
};

type MarketWatchCar = {
  cta: string;
  helper: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  meta: string;
  price: string;
};

const DASHBOARD_TABS: HorizontalTabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "buying", label: "Buying leads", tag: true, tagLabel: "12" },
  { value: "selling", label: "Sell your car" },
  { value: "finance", label: "Finance" }
];

const MOBILE_NAV_ITEMS: BottomNavItem[] = [
  { value: "home", ariaLabel: "Home", iconName: "square-grid-circle-outline", label: "Home" },
  { value: "search", ariaLabel: "Search", iconName: "search-menu-list-search-outline", label: "Search" },
  { value: "sell", ariaLabel: "Sell", iconName: "car-front-view-filled", label: "Sell" },
  { value: "account", ariaLabel: "Account", iconName: "people-circle-user-circle-avatar-profile-outline", label: "Account" }
];

const METRICS: Metric[] = [
  { accent: "brand", label: "Cars live", value: "184", helper: "+18 added today" },
  { accent: "success", label: "High-intent buyers", value: "42", helper: "Up 12% vs yesterday" },
  { accent: "warning", label: "Pending inspections", value: "16", helper: "7 require review today" },
  { accent: "danger", label: "At-risk listings", value: "05", helper: "Expiring in 48 hours" }
];

const LEADS: Lead[] = [
  {
    priority: "success",
    label: "Mercedes-Benz C-Class C 200",
    location: "Mumbai, Lower Parel",
    price: "₹56 lakh budget",
    specs: "Petrol • Automatic • 8,700 km",
    responseTarget: "within 2 hrs",
    helper: "Buyer wants a white premium sedan with verified service history and same-week finance approval.",
    imageSrc: mercedesCClassImageSrc,
    imageAlt: "White Mercedes-Benz C-Class front three-quarter view",
    cta: "Share quote"
  },
  {
    priority: "warning",
    label: "Maruti Suzuki Swift ZXi",
    location: "Pune, Baner",
    price: "₹7.4 lakh budget",
    specs: "Petrol • Manual • 14,220 km",
    responseTarget: "by 4 PM",
    helper: "First-time buyer is comparing Swift trims and wants EMI options before booking a weekend visit.",
    imageSrc: marutiSwiftImageSrc,
    imageAlt: "Red Maruti Suzuki Swift front three-quarter view",
    cta: "Book test drive"
  },
  {
    priority: "neutral",
    label: "Mahindra Scorpio S11",
    location: "Delhi, Dwarka",
    price: "₹17.8 lakh budget",
    specs: "Diesel • Manual • 22,860 km",
    responseTarget: "today",
    helper: "Family buyer prefers a black SUV and asked for 360 photos plus exchange support.",
    imageSrc: mahindraScorpioImageSrc,
    imageAlt: "Black Mahindra Scorpio S11 front three-quarter view",
    cta: "Review valuation"
  }
];

const INVENTORY_ROWS: InventoryRowData[] = [
  {
    tone: "success",
    label: "BMW 5 Series 530i M Sport",
    location: "Gurgaon, Golf Course Road",
    meta: "Petrol • Automatic • 11,320 km",
    price: "₹52.9 lakh",
    status: "Ready to publish",
    imageSrc: bmwFiveSeriesImageSrc,
    imageAlt: "BMW 5 Series sedan",
    cta: "Publish"
  },
  {
    tone: "warning",
    label: "Tata Altroz XZ+",
    location: "Hyderabad, Jubilee Hills",
    meta: "Petrol • Manual • 27,640 km",
    price: "₹7.2 lakh",
    status: "Awaiting pricing",
    imageSrc: tataAltrozImageSrc,
    imageAlt: "Tata Altroz hatchback front three-quarter view",
    cta: "Assign"
  },
  {
    tone: "neutral",
    label: "Range Rover Evoque SE",
    location: "Bengaluru, Indiranagar",
    meta: "Petrol • Automatic • 19,480 km",
    price: "₹38.5 lakh",
    status: "Featured placement",
    imageSrc: rangeRoverEvoqueImageSrc,
    imageAlt: "Silver Range Rover Evoque front three-quarter view",
    cta: "Boost"
  },
  {
    tone: "success",
    label: "Tata Sierra EV preview",
    location: "Chennai, OMR",
    meta: "Electric • Launch watchlist • Priority leads",
    price: "₹25 lakh expected",
    status: "Lead magnet active",
    imageSrc: tataSierraImageSrc,
    imageAlt: "Tata Sierra SUV front three-quarter view",
    cta: "Review"
  }
];

const MARKET_WATCH: MarketWatchCar = {
  label: "Tata Sierra EV demand watch",
  price: "214 shoppers saved this model",
  meta: "Preview campaign • Chennai, Bengaluru, Pune",
  helper: "Use editorial imagery for upcoming launches to test premium discovery modules before the live catalog arrives.",
  imageSrc: tataSierraImageSrc,
  imageAlt: "Tata Sierra EV preview image",
  cta: "Open watchlist"
};

const SIDEBAR_ITEMS: Array<{
  active?: boolean;
  key: string;
  label: string;
  iconName: "square-grid-circle-outline" | "search-menu-list-search-outline" | "car-front-view-filled" | "shield-check-filled";
}> = [
  { key: "dashboard", label: "Dashboard", iconName: "square-grid-circle-outline", active: true },
  { key: "buying", label: "Buying leads", iconName: "search-menu-list-search-outline" },
  { key: "inventory", label: "Seller inventory", iconName: "car-front-view-filled" },
  { key: "inspections", label: "Inspections", iconName: "shield-check-filled" }
];

function getDashboardTokens(brand: DisplayBrandId): DashboardTokens {
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const brandBase = String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));

  return {
    border,
    borderSubtle: "rgba(15, 23, 42, 0.08)",
    brand: brandBase,
    brandStrong: String(getRequiredThemeTokenValue(brand, "color.brand.alt.600")),
    brandSoft: String(getRequiredThemeTokenValue(brand, "color.brand.primary.50")),
    canvas: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    danger: String(getRequiredThemeTokenValue(brand, "color.status.danger")),
    dangerSoft: "#FEF2F2",
    infoSoft: "#EFF6FF",
    primary: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    secondary: String(getRequiredThemeTokenValue(brand, "color.text.secondary")),
    success: String(getRequiredThemeTokenValue(brand, "color.status.success")),
    successSoft: "#ECFDF3",
    subtle: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    warning: String(getRequiredThemeTokenValue(brand, "color.status.warning")),
    warningSoft: "#FFFBEB",
    xxs: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    xs: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
    sm: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
    md: Number(getRequiredThemeTokenValue(brand, "spacing.4")),
    lg: Number(getRequiredThemeTokenValue(brand, "spacing.5")),
    xl: Number(getRequiredThemeTokenValue(brand, "spacing.6")),
    radiusSm: Number(getRequiredThemeTokenValue(brand, "radius.sm")),
    radiusMd: Number(getRequiredThemeTokenValue(brand, "radius.md")),
    radiusLg: Number(getRequiredThemeTokenValue(brand, "radius.lg")),
    radiusXl: Number(getRequiredThemeTokenValue(brand, "radius.xl")),
    radiusPill: Number(getRequiredThemeTokenValue(brand, "radius.pill")),
    thinBorder: Number(getRequiredThemeTokenValue(brand, "component.divider.size.thickness.thin")),
    shadow: "0 24px 60px rgba(15, 23, 42, 0.12)"
  };
}

function Stack({
  children,
  align,
  direction = "column",
  gap,
  justify,
  style,
  wrap
}: {
  children: ReactNode;
  align?: CSSProperties["alignItems"];
  direction?: "row" | "column";
  gap?: number;
  justify?: CSSProperties["justifyContent"];
  style?: CSSProperties;
  wrap?: CSSProperties["flexWrap"];
}) {
  return (
    <div
      style={{
        alignItems: align,
        display: "flex",
        flexDirection: direction,
        flexWrap: wrap,
        gap,
        justifyContent: justify,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function SurfaceCard({
  children,
  tokens,
  style
}: {
  children: ReactNode;
  tokens: DashboardTokens;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: tokens.canvas,
        border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
        borderRadius: tokens.radiusLg,
        boxSizing: "border-box",
        display: "grid",
        gap: tokens.md,
        padding: tokens.lg,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function StatusBadge({
  brand,
  label,
  tone
}: {
  brand: DisplayBrandId;
  label: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <Badge
      brand={brand}
      labelText={label}
      priority="Low"
      showLeadingIcon={false}
      showTrailingIcon={false}
      size="Small"
      type={tone === "success" ? "Success" : tone === "warning" ? "Warning" : "Neutral"}
    />
  );
}

function SidebarNavItem({
  active = false,
  brand,
  collapsed = false,
  iconName,
  label,
  tokens
}: {
  active?: boolean;
  collapsed?: boolean;
  brand: DisplayBrandId;
  iconName: "square-grid-circle-outline" | "search-menu-list-search-outline" | "car-front-view-filled" | "shield-check-filled";
  label: string;
  tokens: DashboardTokens;
}) {
  return (
    <button
      aria-label={label}
      type="button"
      style={{
        alignItems: "center",
        background: active ? tokens.brandSoft : "transparent",
        border: "1px solid transparent",
        borderRadius: tokens.radiusMd,
        color: tokens.primary,
        cursor: "pointer",
        display: "flex",
        font: "inherit",
        gap: tokens.sm,
        justifyContent: collapsed ? "center" : "flex-start",
        minHeight: collapsed ? 48 : 44,
        padding: collapsed ? `${tokens.sm}px` : `${tokens.sm}px ${tokens.md}px`,
        textAlign: "left",
        width: "100%"
      }}
    >
      <Icon brand={brand} decorative name={iconName} size="sm" tone={active ? "primary" : "secondary"} />
      {!collapsed ? (
        <Text as="span" brand={brand} size="sm" tone={active ? "primary" : "secondary"} style={{ margin: 0 }}>
          {label}
        </Text>
      ) : null}
    </button>
  );
}

function SidebarShell({
  brand,
  mode,
  tokens
}: {
  brand: DisplayBrandId;
  mode: SidebarMode;
  tokens: DashboardTokens;
}) {
  const collapsed = mode === "collapsed";

  return (
    <aside
      style={{
        background: tokens.canvas,
        borderRight: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
        display: "grid",
        alignContent: "start",
        gap: tokens.md,
        padding: collapsed ? tokens.md : tokens.lg
      }}
    >
      <div
        style={{
          borderBottom: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
          display: "grid",
          gap: tokens.sm,
          paddingBottom: tokens.md
        }}
      >
        <Stack align="center" direction="row" justify="space-between" gap={tokens.sm}>
          <BrandLogo
            brand={brand}
            decorative={false}
            label={`${brand} logo`}
            type={collapsed ? "Symbol" : "Logo"}
            style={{
              height: 40,
              justifyContent: collapsed ? "center" : "flex-start",
              width: collapsed ? 40 : "fit-content"
            }}
          />
          <button
            aria-label={collapsed ? "Expand side menu" : "Collapse side menu"}
            type="button"
            style={{
              alignItems: "center",
              background: tokens.canvas,
              border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
              borderRadius: tokens.radiusMd,
              color: tokens.primary,
              cursor: "pointer",
              display: "inline-flex",
              height: 36,
              justifyContent: "center",
              width: 36
            }}
          >
            <Icon
              brand={brand}
              decorative
              name={collapsed ? "chevron-small-right-outline" : "arrow-left-filled"}
              size="sm"
              tone="secondary"
            />
          </button>
        </Stack>
      </div>

      <Stack gap={tokens.xs}>
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.key}
            active={Boolean(item.active)}
            brand={brand}
            collapsed={collapsed}
            iconName={item.iconName}
            label={item.label}
            tokens={tokens}
          />
        ))}
      </Stack>
    </aside>
  );
}

function MetricCard({
  brand,
  metric,
  tokens
}: {
  brand: DisplayBrandId;
  metric: Metric;
  tokens: DashboardTokens;
}) {
  const accentColor =
    metric.accent === "success"
      ? tokens.success
      : metric.accent === "warning"
        ? tokens.warning
        : metric.accent === "danger"
          ? tokens.danger
          : tokens.brand;
  const accentSoft =
    metric.accent === "success"
      ? tokens.successSoft
      : metric.accent === "warning"
        ? tokens.warningSoft
        : metric.accent === "danger"
          ? tokens.dangerSoft
          : tokens.brandSoft;

  return (
    <SurfaceCard tokens={tokens} style={{ gap: tokens.sm, minHeight: 142 }}>
      <div
        style={{
          alignItems: "center",
          background: accentSoft,
          borderRadius: tokens.radiusPill,
          color: accentColor,
          display: "inline-flex",
          minHeight: 32,
          paddingInline: tokens.md,
          width: "fit-content"
        }}
      >
        <Text as="span" brand={brand} size="sm" style={{ color: accentColor, margin: 0 }}>
          {metric.label}
        </Text>
      </div>

      <Text as="strong" brand={brand} size="xl" tone="primary" style={{ margin: 0 }}>
        {metric.value}
      </Text>
      <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
        {metric.helper}
      </Text>
    </SurfaceCard>
  );
}

function VehicleMedia({
  alt,
  src,
  tokens,
  height,
  style
}: {
  alt: string;
  src: string;
  tokens: DashboardTokens;
  height: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: `linear-gradient(180deg, ${tokens.brandSoft} 0%, ${tokens.canvas} 100%)`,
        border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
        borderRadius: tokens.radiusMd,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        padding: tokens.sm,
        ...style
      }}
    >
      <img
        alt={alt}
        src={src}
        style={{
          display: "block",
          height,
          maxWidth: "100%",
          objectFit: "contain",
          width: "100%"
        }}
      />
    </div>
  );
}

function LeadCard({
  brand,
  lead,
  tokens
}: {
  brand: DisplayBrandId;
  lead: Lead;
  tokens: DashboardTokens;
}) {
  return (
    <SurfaceCard tokens={tokens} style={{ gap: tokens.md }}>
      <VehicleMedia alt={lead.imageAlt} height={176} src={lead.imageSrc} tokens={tokens} />

      <Stack align="flex-start" direction="row" justify="space-between" gap={tokens.sm} wrap="wrap">
        <Stack gap={tokens.xs}>
          <StatusBadge brand={brand} label={lead.priority === "success" ? "High intent" : lead.priority === "warning" ? "Needs follow-up" : "Fresh"} tone={lead.priority} />
          <Text as="strong" brand={brand} size="lg" tone="primary" style={{ margin: 0 }}>
            {lead.label}
          </Text>
        </Stack>
        <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          {lead.price}
        </Text>
      </Stack>

      <Stack direction="row" gap={tokens.md} wrap="wrap">
        <Stack align="center" direction="row" gap={tokens.xs}>
          <Icon brand={brand} decorative name="location-filled" size="sm" tone="secondary" />
          <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            {lead.location}
          </Text>
        </Stack>
        <Stack align="center" direction="row" gap={tokens.xs}>
          <Icon brand={brand} decorative name="car-front-view-filled" size="sm" tone="secondary" />
          <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            {lead.specs}
          </Text>
        </Stack>
      </Stack>

      <Stack align="center" direction="row" gap={tokens.xs}>
        <Icon brand={brand} decorative name="calendar-line" size="sm" tone="secondary" />
        <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          Response target: {lead.responseTarget}
        </Text>
      </Stack>

      <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
        {lead.helper}
      </Text>

      <Stack direction="row" gap={tokens.sm} wrap="wrap">
        <Button brand={brand} size="Large">
          {lead.cta}
        </Button>
        <Button brand={brand} size="Large" styleVariant="Outline">
          Assign agent
        </Button>
      </Stack>
    </SurfaceCard>
  );
}

function InventoryRow({
  brand,
  row,
  tokens
}: {
  brand: DisplayBrandId;
  row: InventoryRowData;
  tokens: DashboardTokens;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
        borderRadius: tokens.radiusMd,
        display: "grid",
        gap: tokens.md,
        gridTemplateColumns: "112px minmax(0, 1.4fr) minmax(120px, auto) minmax(140px, auto) minmax(124px, auto)",
        padding: `${tokens.md}px ${tokens.lg}px`
      }}
    >
      <VehicleMedia alt={row.imageAlt} height={72} src={row.imageSrc} tokens={tokens} />
      <div style={{ minWidth: 0 }}>
        <Text as="strong" brand={brand} size="md" tone="primary" style={{ display: "block", margin: 0 }}>
          {row.label}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
          {row.meta}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
          {row.location}
        </Text>
      </div>
      <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
        {row.price}
      </Text>
      <div>
        <StatusBadge brand={brand} label={row.status} tone={row.tone} />
      </div>
      <Button brand={brand} size="Large" styleVariant="Outline">
        {row.cta}
      </Button>
    </div>
  );
}

function MarketWatchCard({
  brand,
  tokens,
  vehicle
}: {
  brand: DisplayBrandId;
  tokens: DashboardTokens;
  vehicle: MarketWatchCar;
}) {
  return (
    <SurfaceCard tokens={tokens}>
      <SectionHeader
        brand={brand}
        description="Asset-backed imagery makes speculative demand modules feel closer to the real catalog."
        showDescription
        showSubtitle
        subtitle="Market watch"
        title="Emerging demand"
      />
      <VehicleMedia alt={vehicle.imageAlt} height={140} src={vehicle.imageSrc} tokens={tokens} />
      <Stack gap={tokens.xs}>
        <Text as="strong" brand={brand} size="md" tone="primary" style={{ margin: 0 }}>
          {vehicle.label}
        </Text>
        <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          {vehicle.meta}
        </Text>
      </Stack>
      <Text as="strong" brand={brand} size="sm" tone="primary" style={{ margin: 0 }}>
        {vehicle.price}
      </Text>
      <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
        {vehicle.helper}
      </Text>
      <Button brand={brand} size="Large" styleVariant="Outline">
        {vehicle.cta}
      </Button>
    </SurfaceCard>
  );
}

function StateMessageCard({
  actions,
  background,
  brand,
  description,
  iconName,
  title,
  tokens
}: {
  actions: ReactNode;
  background: string;
  brand: DisplayBrandId;
  description: string;
  iconName: "sparkle-filled" | "info-filled";
  title: string;
  tokens: DashboardTokens;
}) {
  return (
    <SurfaceCard
      tokens={tokens}
      style={{
        alignItems: "center",
        background,
        justifyItems: "center",
        minHeight: 300,
        padding: tokens.xl,
        textAlign: "center"
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: tokens.canvas,
          borderRadius: tokens.radiusPill,
          display: "inline-flex",
          height: 56,
          justifyContent: "center",
          width: 56
        }}
      >
        <Icon brand={brand} decorative name={iconName} size="lg" />
      </div>
      <Stack align="center" gap={tokens.xs} style={{ maxWidth: 460 }}>
        <Text as="strong" brand={brand} size="xl" tone="primary" style={{ margin: 0 }}>
          {title}
        </Text>
        <Text as="p" brand={brand} size="md" tone="secondary" style={{ margin: 0 }}>
          {description}
        </Text>
      </Stack>
      <Stack align="center" direction="row" gap={tokens.sm} wrap="wrap">
        {actions}
      </Stack>
    </SurfaceCard>
  );
}

function DesktopDashboardBody({
  brand,
  screenState,
  tokens
}: {
  brand: DisplayBrandId;
  screenState: DashboardState;
  tokens: DashboardTokens;
}) {
  if (screenState === "loading") {
    return (
      <div style={{ display: "grid", gap: tokens.lg }}>
        <div
          style={{
            display: "grid",
            gap: tokens.md,
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
        }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <SurfaceCard key={`metric-loading-${index}`} tokens={tokens} style={{ minHeight: 142 }}>
              <LazyLoader brand={brand} height={28} width="42%" />
              <LazyLoader brand={brand} height={36} width="56%" />
              <LazyLoader brand={brand} height={16} width="70%" />
          </SurfaceCard>
        ))}
      </div>

        <div
          style={{
            display: "grid",
            gap: tokens.lg,
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)"
          }}
        >
          <SurfaceCard tokens={tokens} style={{ minHeight: 420 }}>
            <LazyLoader brand={brand} height={28} width="30%" />
            <LazyLoader brand={brand} height={18} width="58%" />
            <div style={{ display: "grid", gap: tokens.md }}>
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`lead-loading-${index}`}
                  style={{
                    border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
                    borderRadius: tokens.radiusMd,
                    display: "grid",
                    gap: tokens.sm,
                    padding: tokens.lg
                  }}
                >
                  <LazyLoader brand={brand} height={120} width="100%" />
                  <LazyLoader brand={brand} height={22} width="28%" />
                  <LazyLoader brand={brand} height={20} width="68%" />
                  <LazyLoader brand={brand} height={16} width="44%" />
                  <LazyLoader brand={brand} height={16} width="88%" />
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard tokens={tokens} style={{ minHeight: 420 }}>
            <LazyLoader brand={brand} height={28} width="50%" />
            <LazyLoader brand={brand} height={18} width="72%" />
            <LazyLoader brand={brand} height={56} width="100%" />
            <LazyLoader brand={brand} height={56} width="100%" />
            <LazyLoader brand={brand} height={44} width="100%" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  if (screenState === "empty") {
    return (
      <div
        style={{
          display: "grid",
          gap: tokens.lg,
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)"
        }}
      >
        <StateMessageCard
          background={tokens.brandSoft}
          brand={brand}
          description="Start by importing existing seller inventory, or publish your first assisted listing to activate the dashboard modules."
          iconName="sparkle-filled"
          title="No live cars yet"
          tokens={tokens}
          actions={
            <>
              <Button brand={brand} size="Large">
                Import inventory
              </Button>
              <Button brand={brand} size="Large" styleVariant="Outline">
                Create manual listing
              </Button>
            </>
          }
        />

        <SurfaceCard tokens={tokens} style={{ alignContent: "start" }}>
          <SectionHeader
            actionLabel="View checklist"
            brand={brand}
            description="Use the same system modules on every new dashboard."
            showAction
            showDescription
            showSubtitle
            subtitle="Reusable setup"
            title="Launch checklist"
          />
          <Stack gap={tokens.sm}>
            {[
              "Set the default city and acquisition source.",
              "Connect valuation and finance rules.",
              "Assign an owner for review and publishing."
            ].map((item) => (
              <div
                key={item}
                style={{
                  alignItems: "center",
                  border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
                  borderRadius: tokens.radiusMd,
                  display: "flex",
                  gap: tokens.sm,
                  padding: `${tokens.sm}px ${tokens.md}px`
                }}
              >
                <Icon brand={brand} decorative name="check-badge-fill" size="sm" />
                <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                  {item}
                </Text>
              </div>
            ))}
          </Stack>
        </SurfaceCard>
      </div>
    );
  }

  if (screenState === "error") {
    return (
      <div style={{ display: "grid", gap: tokens.lg }}>
        <SurfaceCard
          tokens={tokens}
          style={{
            background: tokens.dangerSoft,
            borderColor: "rgba(220, 38, 38, 0.16)",
            gap: tokens.sm
          }}
        >
          <Stack align="center" direction="row" gap={tokens.sm} justify="space-between" wrap="wrap">
            <Stack align="center" direction="row" gap={tokens.sm}>
              <Icon brand={brand} decorative name="info-filled" size="md" />
              <Stack gap={tokens.xxs}>
                <Text as="strong" brand={brand} size="md" tone="primary" style={{ margin: 0 }}>
                  Listing sync failed for the North region
                </Text>
                <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                  Keep the shell intact, surface the issue early, and offer an immediate recovery path.
                </Text>
              </Stack>
            </Stack>
            <Stack direction="row" gap={tokens.sm}>
              <Button brand={brand} size="Large" styleVariant="Outline">
                View logs
              </Button>
              <Button brand={brand} size="Large">
                Retry sync
              </Button>
            </Stack>
          </Stack>
        </SurfaceCard>

        <div
          style={{
            display: "grid",
            gap: tokens.lg,
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)"
          }}
        >
          <StateMessageCard
            background={tokens.canvas}
            brand={brand}
            description="The dashboard still reserves space for leads and inventory so the page does not jump while error details load."
            iconName="info-filled"
            title="We couldn't refresh inventory insights"
            tokens={tokens}
            actions={
              <>
                <Button brand={brand} size="Large">
                  Retry refresh
                </Button>
                <Button brand={brand} disabled size="Large" styleVariant="Outline">
                  Export report
                </Button>
              </>
            }
          />

          <SurfaceCard tokens={tokens}>
            <SectionHeader
              brand={brand}
              description="Recovery recommendations stay visible even in error mode."
              showDescription
              showSubtitle
              subtitle="Fallback content"
              title="Next best actions"
            />
            <Stack gap={tokens.sm}>
              {[
                "Switch to cached listings for read-only browsing.",
                "Re-run photo enrichment after the sync completes.",
                "Notify operations only if the issue persists past 15 minutes."
              ].map((item) => (
                <Text key={item} as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                  {item}
                </Text>
              ))}
            </Stack>
          </SurfaceCard>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: tokens.lg }}>
      <div
        style={{
          display: "grid",
          gap: tokens.md,
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
        }}
      >
        {METRICS.map((metric) => (
          <MetricCard key={metric.label} brand={brand} metric={metric} tokens={tokens} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gap: tokens.lg,
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(320px, 0.9fr)"
        }}
      >
        <SurfaceCard tokens={tokens}>
          <SectionHeader
            actionLabel="View all"
            brand={brand}
            description="Structured list items keep hierarchy stable while sales teams scan and act fast."
            showAction
            showDescription
            showSubtitle
            subtitle="Today"
            title="Priority buyer leads"
          />
          <div style={{ display: "grid", gap: tokens.md }}>
            {LEADS.map((lead) => (
              <LeadCard key={lead.label} brand={brand} lead={lead} tokens={tokens} />
            ))}
          </div>
        </SurfaceCard>

        <Stack gap={tokens.lg}>
          <SurfaceCard tokens={tokens}>
            <SectionHeader
              brand={brand}
              description="Input fields and buttons are reused without changing the shell."
              showDescription
              showSubtitle
              subtitle="Finance helper"
              title="Budget qualification"
            />
            <TextInput
              brand={brand}
              helperText="Used by the lead scoring widget."
              label="Budget range"
              prefixIconName="car-front-view-filled"
              size="Large"
              value="₹8 lakh - ₹18 lakh"
            />
            <TextInput
              brand={brand}
              helperText="Recovery text uses semantic helper tone."
              helperTone="Success"
              label="Preferred city"
              prefixIconName="location-filled"
              size="Large"
              value="Delhi NCR"
            />
            <Stack direction="row" gap={tokens.sm} wrap="wrap">
              <Button brand={brand} size="Large">
                Match inventory
              </Button>
              <Button brand={brand} size="Large" styleVariant="Outline">
                Save segment
              </Button>
            </Stack>
          </SurfaceCard>

          <SurfaceCard tokens={tokens}>
            <SectionHeader
              brand={brand}
              description="A compact operational rail is easier to reuse than page-specific widgets."
              showDescription
              showSubtitle
              subtitle="Ops pulse"
              title="Team health"
            />
            <Stack gap={tokens.sm}>
              {[
                ["Inspections completed", "11 of 16 today"],
                ["Cars promoted", "4 featured and 3 sponsored"],
                ["Finance approvals", "9 eligible buyers"]
              ].map(([label, value]) => (
                <Stack key={label} align="center" direction="row" justify="space-between">
                  <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                    {label}
                  </Text>
                  <Text as="strong" brand={brand} size="sm" tone="primary" style={{ margin: 0 }}>
                    {value}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </SurfaceCard>

          <MarketWatchCard brand={brand} tokens={tokens} vehicle={MARKET_WATCH} />
        </Stack>
      </div>

      <SurfaceCard tokens={tokens}>
        <SectionHeader
          actionLabel="Inventory rules"
          brand={brand}
          description="Desktop uses wider list rows and desktop pagination while preserving the same spacing rhythm."
          showAction
          showDescription
          showSubtitle
          subtitle="Catalog management"
          title="Inventory queue"
        />
        <div style={{ display: "grid", gap: tokens.sm }}>
          {INVENTORY_ROWS.map((row) => (
            <InventoryRow key={row.label} brand={brand} row={row} tokens={tokens} />
          ))}
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            gap: tokens.md,
            flexWrap: "wrap"
          }}
        >
          <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            Showing 1-4 of 24 inventory tasks
          </Text>
          <Pagination brand={brand} currentPage={3} platform="Desktop" totalPages={8} type="2" />
        </div>
      </SurfaceCard>
    </div>
  );
}

function DesktopDashboardScreen({
  brand = "Cars24",
  screenState,
  sidebarMode = "open"
}: {
  brand?: DisplayBrandId;
  screenState: DashboardState;
  sidebarMode?: SidebarMode;
}) {
  const tokens = getDashboardTokens(brand);
  const collapsed = sidebarMode === "collapsed";

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${tokens.brandSoft} 0%, ${tokens.subtle} 100%)`,
        border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
        borderRadius: 32,
        boxShadow: tokens.shadow,
        overflow: "hidden",
        width: "100%"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: collapsed ? "96px minmax(0, 1fr)" : "248px minmax(0, 1fr)",
          minHeight: 840
        }}
      >
        <SidebarShell brand={brand} mode={sidebarMode} tokens={tokens} />

        <main
          style={{
            display: "grid",
            alignContent: "start",
            gap: tokens.lg,
            padding: tokens.xl
          }}
        >
          <Stack align="center" direction="row" justify="space-between" gap={tokens.lg} wrap="wrap">
            <Stack gap={tokens.xs}>
              <Text as="strong" brand={brand} size="xl" tone="primary" style={{ margin: 0 }}>
                Car buying and selling dashboard
              </Text>
              <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                Desktop-first template with token-driven spacing, semantic states, and reusable content zones.
              </Text>
            </Stack>
            <Stack direction="row" gap={tokens.sm} wrap="wrap">
              <Button brand={brand} size="Large" styleVariant="Outline">
                Save view
              </Button>
              <Button brand={brand} size="Large">
                Create listing
              </Button>
            </Stack>
          </Stack>

          <Stack align="center" direction="row" gap={tokens.md} wrap="wrap">
            <div style={{ flex: "1 1 420px", minWidth: 320 }}>
              <SearchBar brand={brand} color="Solid White" placeholder="Search by car, city, or lead" size="Large" />
            </div>
            <div style={{ flex: "0 1 320px", minWidth: 260 }}>
              <TextInput
                brand={brand}
                helperText="Filters sync with the saved desktop view."
                label="Market cluster"
                prefixIconName="location-filled"
                size="Large"
                value="Delhi NCR"
              />
            </div>
          </Stack>

          <div style={{ width: "100%" }}>
            <HorizontalTab brand={brand} items={DASHBOARD_TABS} size="Default" value="overview" />
          </div>

          <DesktopDashboardBody brand={brand} screenState={screenState} tokens={tokens} />
        </main>
      </div>
    </div>
  );
}

function ScreenPreview({
  children,
  description,
  label
}: {
  children: ReactNode;
  description: string;
  label: string;
}) {
  return (
    <StoryCard
      style={{
        display: "grid",
        gap: 12
      }}
    >
      <div style={{ display: "grid", gap: 6, maxWidth: 840 }}>
        <StoryBadge>{label}</StoryBadge>
        <StoryCopy size="sm">{description}</StoryCopy>
      </div>
      {children}
    </StoryCard>
  );
}

function InteractionStatesPanel({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const tokens = getDashboardTokens(brand);

  return (
    <StoryCard style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <StoryHeading brand={brand} size="lg">
          Interaction states
        </StoryHeading>
        <StoryCopy brand={brand} size="sm">
          Buttons preserve 44px height on mobile-compatible sizes, search and input fields show validation without layout shift, and list items keep structure stable across hover and disabled states.
        </StoryCopy>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        <SurfaceCard tokens={tokens}>
          <Text as="strong" brand={brand} size="sm" tone="secondary">
            Button states
          </Text>
          <div style={{ display: "grid", gap: 12 }}>
            <Button brand={brand} size="Large" style={{ width: "100%" }}>
              Primary
            </Button>
            <Button brand={brand} forceState="Hover/Pressed" size="Large" style={{ width: "100%" }}>
              Pressed
            </Button>
            <Button brand={brand} size="Large" style={{ width: "100%" }} styleVariant="Outline">
              Secondary
            </Button>
            <Button brand={brand} disabled size="Large" style={{ width: "100%" }}>
              Disabled
            </Button>
          </div>
        </SurfaceCard>

        <SurfaceCard tokens={tokens}>
          <Text as="strong" brand={brand} size="sm" tone="secondary">
            Field states
          </Text>
          <div style={{ display: "grid", gap: 12 }}>
            <SearchBar brand={brand} color="Solid White" forceState="Completed" size="Large" value="SUV under 15 lakh" />
            <TextInput
              brand={brand}
              helperText="Field-level semantic messaging."
              label="Budget"
              prefixIconName="car-front-view-filled"
              size="Large"
              validationState="Error"
              value="₹2 lakh"
            />
            <TextInput
              brand={brand}
              forceState="Disabled"
              helperText="Disabled state"
              label="Assigned advisor"
              size="Large"
              value="Priya Sharma"
            />
          </div>
        </SurfaceCard>

        <SurfaceCard tokens={tokens}>
          <Text as="strong" brand={brand} size="sm" tone="secondary">
            List item states
          </Text>
          <div style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
                borderRadius: tokens.radiusMd,
                padding: tokens.md
              }}
            >
              <Text as="strong" brand={brand} size="sm" tone="primary" style={{ display: "block", margin: 0 }}>
                Rest state row
              </Text>
              <Text as="span" brand={brand} size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
                Neutral surface with stable density.
              </Text>
            </div>
            <div
              style={{
                border: `${tokens.thinBorder}px solid ${tokens.brand}`,
                borderRadius: tokens.radiusMd,
                boxShadow: `0 0 0 4px ${tokens.brandSoft}`,
                padding: tokens.md
              }}
            >
              <Text as="strong" brand={brand} size="sm" tone="primary" style={{ display: "block", margin: 0 }}>
                Hover / selected row
              </Text>
              <Text as="span" brand={brand} size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
                Uses emphasis without changing spacing or alignment.
              </Text>
            </div>
            <div
              style={{
                background: tokens.subtle,
                border: `${tokens.thinBorder}px solid ${tokens.borderSubtle}`,
                borderRadius: tokens.radiusMd,
                opacity: 0.65,
                padding: tokens.md
              }}
            >
              <Text as="strong" brand={brand} size="sm" tone="primary" style={{ display: "block", margin: 0 }}>
                Disabled row
              </Text>
              <Text as="span" brand={brand} size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
                Data stays readable while actions become unavailable.
              </Text>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </StoryCard>
  );
}

function MobileCompanionPreview({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const tokens = getDashboardTokens(brand);

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        boxShadow: tokens.shadow,
        overflow: "hidden",
        width: 360
      }}
    >
      <div style={{ display: "grid", gap: tokens.md, padding: tokens.lg }}>
        <Stack gap={tokens.xxs}>
          <Text as="strong" brand={brand} size="lg" tone="primary" style={{ margin: 0 }}>
            Mobile companion
          </Text>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            The desktop shell compresses into a single column with the same tokens.
          </Text>
        </Stack>

        <SearchBar brand={brand} color="Solid White" placeholder="Search cars or leads" size="Large" />

        <div
          style={{
            display: "grid",
            gap: tokens.sm,
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
          }}
        >
          {METRICS.slice(0, 2).map((metric) => (
            <MetricCard key={`mobile-${metric.label}`} brand={brand} metric={metric} tokens={tokens} />
          ))}
        </div>

        <SurfaceCard tokens={tokens} style={{ padding: tokens.md }}>
          <SectionHeader
            brand={brand}
            description="Stacked cards stay touch-friendly."
            showDescription
            showSubtitle
            subtitle="Lead inbox"
            title="Top priority"
          />
          <LeadCard brand={brand} lead={LEADS[0]!} tokens={tokens} />
        </SurfaceCard>
      </div>

      <BottomNav brand={brand} configuration="Label + icon" items={MOBILE_NAV_ITEMS} style={{ width: "100%" }} type="Sticky" value="home" />
    </div>
  );
}

function DocumentationPanel({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const tokens = getDashboardTokens(brand);

  return (
    <StoryCard style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <StoryHeading brand={brand} size="lg">
          Design system notes
        </StoryHeading>
        <StoryCopy brand={brand} size="sm">
          The template keeps a fixed shell of sidebar, toolbar, tab rail, metrics, and modular content cards. New dashboard screens can swap only the center modules without redefining hierarchy, density, or interaction rules.
        </StoryCopy>
      </div>

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        <SurfaceCard tokens={tokens}>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Component breakdown
          </Text>
          <StoryCopy brand={brand} size="sm">
            `SearchBar`, `TextInput`, `Button`, `HorizontalTab`, `Badge`, `Pagination`, and `BottomNav` provide the reusable system primitives. `SectionHeader` standardizes content headings so desktop and mobile modules feel related.
          </StoryCopy>
          <StoryCopy brand={brand} size="sm">
            Custom wrappers are limited to dashboard compositions such as metric cards, lead rows, and inventory list items because those combine multiple primitives into a page-level pattern.
          </StoryCopy>
        </SurfaceCard>

        <SurfaceCard tokens={tokens}>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Spacing and layout
          </Text>
          <StoryCopy brand={brand} size="sm">
            Layout spacing is driven from token values equivalent to an 8pt rhythm. Major regions use 24px separation, card padding stays at 20px or 24px, and controls rely on existing component heights to maintain readable density.
          </StoryCopy>
          <StoryCopy brand={brand} size="sm">
            Alignment stays strict across states: cards keep their bounds, headings retain their placement, and status changes swap content rather than moving the frame.
          </StoryCopy>
        </SurfaceCard>

        <SurfaceCard tokens={tokens}>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Scaling guidance
          </Text>
          <StoryCopy brand={brand} size="sm">
            To scale across other screens, preserve the shell and replace only the feature module: pricing, inspections, financing, or seller ops. The system already supports semantic states, pagination, and CTA patterns, so additional workflows reuse the same skeleton.
          </StoryCopy>
          <StoryCopy brand={brand} size="sm">
            Accessibility is supported through token-based contrast, semantic status surfaces, readable typography, and 44px minimum tap targets for the companion mobile layout.
          </StoryCopy>
        </SurfaceCard>
      </div>

      <SurfaceCard
        tokens={tokens}
        style={{
          alignItems: "start",
          display: "grid",
          gap: 20,
          gridTemplateColumns: "minmax(0, 1fr) auto"
        }}
      >
        <div style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Responsive companion
          </Text>
          <StoryCopy brand={brand} size="sm">
            The assignment mixes desktop and mobile requirements, so this kit includes a mobile companion that collapses the same primitives into a single-column flow with sticky bottom navigation. The desktop template remains the primary artifact, while the mobile preview demonstrates how the system scales down without inventing new rules.
          </StoryCopy>
        </div>
        <MobileCompanionPreview brand={brand} />
      </SurfaceCard>
    </StoryCard>
  );
}

export function CarMarketplaceDashboardDesktopKit({ brand = "Cars24" }: CarMarketplaceDashboardDesktopProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 12, maxWidth: 920 }}>
          <StoryBadge>Dashboard template</StoryBadge>
          <StoryHeading brand={brand} size="xl">
            Car buying and selling dashboard
          </StoryHeading>
          <StoryCopy brand={brand} size="md">
            This UI kit example is desktop-first, built from the existing design system, and documents default, loading, empty, and error states. The shell stays stable so the page can scale into additional marketplace workflows without fragmenting the visual language.
          </StoryCopy>
        </div>

        <div
          style={{
            display: "grid",
            gap: 28
          }}
        >
          <ScreenPreview
            description="Default state now documents both side-menu modes: an open navigation with labels and context, plus a collapsed rail for denser desktop workflows."
            label="Default state"
          >
            <div
              style={{
                display: "grid",
                gap: 20
              }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <StoryCopy size="sm">Open side menu</StoryCopy>
                <DesktopDashboardScreen brand={brand} screenState="default" sidebarMode="open" />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <StoryCopy size="sm">Collapsed side menu</StoryCopy>
                <DesktopDashboardScreen brand={brand} screenState="default" sidebarMode="collapsed" />
              </div>
            </div>
          </ScreenPreview>

          <ScreenPreview
            description="Loading state preserves card and list structure so the interface remains predictable while inventory and leads resolve."
            label="Loading state"
          >
            <DesktopDashboardScreen brand={brand} screenState="loading" />
          </ScreenPreview>

          <ScreenPreview
            description="Empty state keeps the template useful by offering setup actions and guidance instead of leaving the dashboard blank."
            label="Empty state"
          >
            <DesktopDashboardScreen brand={brand} screenState="empty" />
          </ScreenPreview>

          <ScreenPreview
            description="Error state uses semantic messaging, recovery actions, and stable layout boundaries so users can still orient themselves quickly."
            label="Error state"
          >
            <DesktopDashboardScreen brand={brand} screenState="error" />
          </ScreenPreview>
        </div>

        <InteractionStatesPanel brand={brand} />
        <DocumentationPanel brand={brand} />
      </StoryCard>
    </StoryPage>
  );
}

export const carMarketplaceDashboardDesktopSourceCode = `import {
  Badge,
  BottomNav,
  Button,
  HorizontalTab,
  Pagination,
  SearchBar,
  SectionHeader,
  TextInput
} from "@geist/web";

export function CarMarketplaceDashboard() {
  return (
    <div>
      <SearchBar brand="Cars24" size="Large" placeholder="Search by car, city, or lead" />
      <HorizontalTab brand="Cars24" value="overview" items={[{ value: "overview", label: "Overview" }]} />
      <SectionHeader brand="Cars24" title="Priority buyer leads" showSubtitle subtitle="Today" />
      <Button brand="Cars24" size="Large">Create listing</Button>
      <Pagination brand="Cars24" platform="Desktop" type="2" currentPage={3} totalPages={8} />
      <BottomNav brand="Cars24" type="Sticky" value="home" />
    </div>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: CarMarketplaceDashboardDesktopProps) => <CarMarketplaceDashboardDesktopKit brand={brand} />,
  parameters: {
    layout: "fullscreen",
    docs: {
      source: {
        code: carMarketplaceDashboardDesktopSourceCode
      }
    }
  }
};
