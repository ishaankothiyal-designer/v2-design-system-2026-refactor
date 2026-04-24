import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import {
  AppHeader,
  Button,
  ChoiceChip,
  Divider,
  Icon,
  Text,
  getRequiredThemeTokenValue
} from "@geist/web";
import { StoryPage } from "../storybook-shell";

export type FlightSearchMobileScreenProps = {
  brand?: DisplayBrandId;
};

type SortMode = "Best Match" | "Cheapest" | "Fastest" | "Departure";

type Amenity = {
  iconName?: Parameters<typeof Icon>[0]["name"];
  label: string;
};

type FlightRecord = {
  airline: string;
  airlineIcon: Parameters<typeof Icon>[0]["name"];
  airlineMark: string;
  airlineSurface: string;
  arrivalCity: string;
  arrivalCode: string;
  arrivalTime: string;
  badge?: string;
  baggageLabel: string;
  bestRank: number;
  departureCity: string;
  departureCode: string;
  departureMinutes: number;
  departureTime: string;
  durationLabel: string;
  durationMinutes: number;
  flightNumber: string;
  id: string;
  priceLabel: string;
  priceValue: number;
  stopLabel: string;
  stops: number;
  amenities: Amenity[];
};

type FlightScreenTokens = {
  background: string;
  border: string;
  brand: string;
  brandHover: string;
  brandSoft: string;
  cardShadow: string;
  cardShadowActive: string;
  cardSurface: string;
  chipStickyShadow: string;
  headerBorder: string;
  headerSurface: string;
  routeAccent: string;
  routeSurface: string;
  screenShadow: string;
  success: string;
  subtleSurface: string;
  textInverse: string;
  textMuted: string;
  textPrimary: string;
  textSecondary: string;
  gap2: number;
  gap3: number;
  gap4: number;
  gap5: number;
  gap6: number;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  radiusPill: number;
};

type FlightTypography = {
  fontFamily: string;
  bold: number;
  medium: number;
  regular: number;
  semibold: number;
};

const SORT_OPTIONS: SortMode[] = ["Best Match", "Cheapest", "Fastest", "Departure"];

const FLIGHTS: FlightRecord[] = [
  {
    id: "delta-2847",
    airline: "Delta Airlines",
    airlineIcon: "arrow-navigation-filled",
    airlineMark: "#FFFFFF",
    airlineSurface: "linear-gradient(135deg, #2F5AA8 0%, #153A7B 100%)",
    arrivalCity: "Los Angeles",
    arrivalCode: "LAX",
    arrivalTime: "09:15",
    badge: "Best value",
    baggageLabel: "1 bag",
    bestRank: 1,
    departureCity: "New York",
    departureCode: "JFK",
    departureMinutes: 390,
    departureTime: "06:30",
    durationLabel: "5h 45m",
    durationMinutes: 345,
    flightNumber: "DL 2847",
    priceLabel: "$289",
    priceValue: 289,
    stopLabel: "Nonstop",
    stops: 0,
    amenities: [
      { iconName: "wifi-full-spot-signal-hotspot", label: "Wi-Fi" },
      { label: "Meal" }
    ]
  },
  {
    id: "american-417",
    airline: "American Airlines",
    airlineIcon: "ongoing-moving-outline",
    airlineMark: "#FFFFFF",
    airlineSurface: "linear-gradient(135deg, #4E7BBF 0%, #1F4B91 100%)",
    arrivalCity: "Los Angeles",
    arrivalCode: "LAX",
    arrivalTime: "10:48",
    baggageLabel: "1 bag",
    bestRank: 2,
    departureCity: "New York",
    departureCode: "JFK",
    departureMinutes: 455,
    departureTime: "07:35",
    durationLabel: "6h 13m",
    durationMinutes: 373,
    flightNumber: "AA 417",
    priceLabel: "$302",
    priceValue: 302,
    stopLabel: "Nonstop",
    stops: 0,
    amenities: [
      { iconName: "wifi-full-spot-signal-hotspot", label: "Wi-Fi" },
      { label: "Meal" }
    ]
  },
  {
    id: "united-1523",
    airline: "United Airlines",
    airlineIcon: "push-launch-rocket-filled",
    airlineMark: "#FFFFFF",
    airlineSurface: "linear-gradient(135deg, #223D6B 0%, #122648 100%)",
    arrivalCity: "Los Angeles",
    arrivalCode: "LAX",
    arrivalTime: "11:25",
    badge: "Most flexible",
    baggageLabel: "1 bag",
    bestRank: 3,
    departureCity: "New York",
    departureCode: "JFK",
    departureMinutes: 495,
    departureTime: "08:15",
    durationLabel: "6h 10m",
    durationMinutes: 370,
    flightNumber: "UA 1523",
    priceLabel: "$315",
    priceValue: 315,
    stopLabel: "Nonstop",
    stops: 0,
    amenities: [
      { label: "Meal" },
      { label: "Extra legroom" }
    ]
  },
  {
    id: "jetblue-915",
    airline: "JetBlue",
    airlineIcon: "sparkle-line",
    airlineMark: "#FFFFFF",
    airlineSurface: "linear-gradient(135deg, #168AAD 0%, #0B5D78 100%)",
    arrivalCity: "Los Angeles",
    arrivalCode: "LAX",
    arrivalTime: "13:52",
    baggageLabel: "Carry-on",
    bestRank: 4,
    departureCity: "New York",
    departureCode: "JFK",
    departureMinutes: 640,
    departureTime: "10:40",
    durationLabel: "6h 12m",
    durationMinutes: 372,
    flightNumber: "B6 915",
    priceLabel: "$328",
    priceValue: 328,
    stopLabel: "Nonstop",
    stops: 0,
    amenities: [
      { iconName: "wifi-full-spot-signal-hotspot", label: "Wi-Fi" },
      { label: "Power" }
    ]
  }
];

function getFlightScreenTokens(brand: DisplayBrandId): FlightScreenTokens {
  const brandBase = String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));
  const brandHover = String(getRequiredThemeTokenValue(brand, "color.brand.alt.600"));
  const brandSoft = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const canvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const subtle = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const textMuted = String(getRequiredThemeTokenValue(brand, "color.text.muted"));
  const textInverse = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const success = String(getRequiredThemeTokenValue(brand, "color.status.success"));
  const gap2 = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const gap3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const gap4 = Number(getRequiredThemeTokenValue(brand, "spacing.4"));
  const gap5 = Number(getRequiredThemeTokenValue(brand, "spacing.5"));
  const gap6 = Number(getRequiredThemeTokenValue(brand, "spacing.6"));
  const radiusSm = Number(getRequiredThemeTokenValue(brand, "radius.alt.sm"));
  const radiusMd = Number(getRequiredThemeTokenValue(brand, "radius.alt.md"));
  const radiusLg = Number(getRequiredThemeTokenValue(brand, "radius.alt.lg"));
  const radiusXl = Number(getRequiredThemeTokenValue(brand, "radius.xl"));
  const radiusPill = Number(getRequiredThemeTokenValue(brand, "radius.pill"));

  return {
    background: `linear-gradient(180deg, ${brandSoft} 0%, ${canvas} 22%, ${subtle} 100%)`,
    border,
    brand: brandBase,
    brandHover,
    brandSoft,
    cardShadow: "0 16px 30px rgba(15, 23, 42, 0.08)",
    cardShadowActive: "0 22px 44px rgba(15, 23, 42, 0.12)",
    cardSurface: canvas,
    chipStickyShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
    headerBorder: border,
    headerSurface: canvas,
    routeAccent: brandHover,
    routeSurface: canvas,
    screenShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
    success,
    subtleSurface: subtle,
    textInverse,
    textMuted,
    textPrimary,
    textSecondary,
    gap2,
    gap3,
    gap4,
    gap5,
    gap6,
    radiusSm,
    radiusMd,
    radiusLg,
    radiusXl,
    radiusPill
  };
}

function getTypography(brand: DisplayBrandId): FlightTypography {
  return {
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    bold: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.bold")),
    medium: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium")),
    regular: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")),
    semibold: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"))
  };
}

function orderFlights(sortMode: SortMode) {
  return [...FLIGHTS].sort((left, right) => {
    if (sortMode === "Cheapest") {
      return left.priceValue - right.priceValue;
    }

    if (sortMode === "Fastest") {
      return left.durationMinutes - right.durationMinutes;
    }

    if (sortMode === "Departure") {
      return left.departureMinutes - right.departureMinutes;
    }

    return left.bestRank - right.bestRank;
  });
}

function PhoneFrame({
  children,
  tokens
}: {
  children: ReactNode;
  tokens: FlightScreenTokens;
}) {
  return (
    <div
      style={{
        background: tokens.background,
        borderRadius: 36,
        boxShadow: tokens.screenShadow,
        height: 844,
        overflow: "hidden",
        width: 390
      }}
    >
      {children}
    </div>
  );
}

function RouteSummary({
  brand,
  tokens
}: {
  brand: DisplayBrandId;
  tokens: FlightScreenTokens;
}) {
  return (
    <section
      style={{
        background: tokens.routeSurface,
        borderBottom: `1px solid ${tokens.headerBorder}`,
        display: "grid",
        gap: tokens.gap3,
        padding: `${tokens.gap5}px ${tokens.gap5}px ${tokens.gap4}px`
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: tokens.gap3,
          justifyContent: "space-between"
        }}
      >
        <div style={{ alignItems: "center", display: "inline-flex", gap: tokens.gap3, minWidth: 0 }}>
          <span
            aria-hidden="true"
            style={{
              alignItems: "center",
              background: tokens.brandSoft,
              borderRadius: tokens.radiusPill,
              color: tokens.routeAccent,
              display: "inline-flex",
              flexShrink: 0,
              height: 32,
              justifyContent: "center",
              width: 32
            }}
          >
            <Icon
              brand={brand}
              decorative
              name="arrow-right-left-sort1-switchhorizontal-outline"
              size="sm"
              style={{ color: tokens.routeAccent }}
            />
          </span>

          <div style={{ display: "grid", gap: tokens.gap2, minWidth: 0 }}>
            <Text
              as="strong"
              brand={brand}
              size="lg"
              style={{
                fontSize: 22,
                lineHeight: "26px",
                minWidth: 0
              }}
            >
              NYC to LAX
            </Text>
            <Text brand={brand} size="sm" tone="secondary">
              JFK to Los Angeles International
            </Text>
          </div>
        </div>

        <Button
          brand={brand}
          shape="Pill"
          size="Small"
          styleVariant="Ghost"
          trailingIcon={<Icon brand={brand} decorative name="edit-outline" size="sm" />}
        >
          Edit
        </Button>
      </div>

      <div
        style={{
          alignItems: "center",
          color: tokens.textSecondary,
          display: "flex",
          flexWrap: "wrap",
          gap: tokens.gap2
        }}
      >
        {["Apr 15, 2025", "1 Adult", "Economy"].map((item, index) => (
          <div key={item} style={{ alignItems: "center", display: "inline-flex", gap: tokens.gap2 }}>
            {index > 0 ? (
              <span
                aria-hidden="true"
                style={{
                  background: tokens.border,
                  borderRadius: tokens.radiusPill,
                  display: "inline-block",
                  height: 4,
                  width: 4
                }}
              />
            ) : null}
            <Text brand={brand} size="sm" tone="secondary">
              {item}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
}

function FilterBar({
  brand,
  sortMode,
  setSortMode,
  tokens
}: {
  brand: DisplayBrandId;
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
  tokens: FlightScreenTokens;
}) {
  return (
    <div
      style={{
        backdropFilter: "blur(18px)",
        background: `${tokens.headerSurface}`,
        borderBottom: `1px solid ${tokens.headerBorder}`,
        boxSizing: "border-box",
        boxShadow: tokens.chipStickyShadow,
        left: 0,
        overflow: "hidden",
        padding: `${tokens.gap3}px ${tokens.gap5}px ${tokens.gap4}px`,
        position: "sticky",
        right: 0,
        top: 0,
        width: "100%",
        zIndex: 3
      }}
    >
      <div
        style={{
          display: "flex",
          gap: tokens.gap2,
          overflowX: "auto",
          paddingBottom: tokens.gap2 / 2,
          scrollbarWidth: "none"
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <ChoiceChip
            key={option}
            brand={brand}
            label={option}
            size="Small"
            state={sortMode === option ? "Active" : "Rest"}
            style={{ minWidth: "fit-content" }}
            type="Regular"
            variant="Horizontal"
            onClick={() => setSortMode(option)}
          />
        ))}
      </div>
    </div>
  );
}

function AirlineMark({
  brand,
  tokens,
  flight
}: {
  brand: DisplayBrandId;
  tokens: FlightScreenTokens;
  flight: FlightRecord;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: flight.airlineSurface,
        borderRadius: tokens.radiusLg,
        display: "inline-flex",
        height: 44,
        justifyContent: "center",
        width: 44
      }}
    >
      <Icon
        brand={brand}
        decorative
        name={flight.airlineIcon}
        style={{
          color: flight.airlineMark,
          fontSize: 20
        }}
      />
    </div>
  );
}

function Timeline({
  brand,
  flight,
  tokens,
  typography
}: {
  brand: DisplayBrandId;
  flight: FlightRecord;
  tokens: FlightScreenTokens;
  typography: FlightTypography;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: tokens.gap2,
        justifyItems: "center",
        minWidth: 0
      }}
    >
      <Text
        as="strong"
        brand={brand}
        size="sm"
        style={{
          color: tokens.textPrimary,
          fontSize: 13,
          fontWeight: typography.semibold,
          lineHeight: "18px"
        }}
      >
        {flight.durationLabel}
      </Text>

      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: tokens.gap2,
          gridTemplateColumns: "1fr auto 1fr",
          width: "100%"
        }}
      >
        <span
          aria-hidden="true"
          style={{
            borderTop: `1.5px dashed ${tokens.border}`,
            display: "block",
            width: "100%"
          }}
        />
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            background: tokens.brandSoft,
            borderRadius: tokens.radiusPill,
            color: tokens.routeAccent,
            display: "inline-flex",
            height: 24,
            justifyContent: "center",
            width: 24
          }}
        >
          <Icon
            brand={brand}
            decorative
            name="ongoing-moving-outline"
            size="sm"
            style={{ color: tokens.routeAccent, fontSize: 12 }}
          />
        </span>
        <span
          aria-hidden="true"
          style={{
            borderTop: `1.5px dashed ${tokens.border}`,
            display: "block",
            width: "100%"
          }}
        />
      </div>

      <Text
        brand={brand}
        size="xs"
        style={{
          color: flight.stops === 0 ? tokens.success : tokens.textSecondary,
          fontSize: 12,
          lineHeight: "16px"
        }}
      >
        {flight.stopLabel}
      </Text>
    </div>
  );
}

function MetadataItem({
  brand,
  iconName,
  label,
  tokens
}: {
  brand: DisplayBrandId;
  iconName: Parameters<typeof Icon>[0]["name"] | undefined;
  label: string;
  tokens: FlightScreenTokens;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        color: tokens.textSecondary,
        display: "inline-flex",
        gap: tokens.gap2
      }}
    >
      {iconName ? (
        <Icon
          brand={brand}
          decorative
          name={iconName}
          size="sm"
          style={{ color: tokens.textSecondary, fontSize: 14 }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            background: tokens.border,
            borderRadius: tokens.radiusPill,
            display: "inline-block",
            height: 5,
            width: 5
          }}
        />
      )}
      <Text brand={brand} size="xs" tone="secondary" style={{ fontSize: 12, lineHeight: "16px" }}>
        {label}
      </Text>
    </div>
  );
}

function FlightCard({
  brand,
  flight,
  highlight,
  tokens,
  typography
}: {
  brand: DisplayBrandId;
  flight: FlightRecord;
  highlight: boolean;
  tokens: FlightScreenTokens;
  typography: FlightTypography;
}) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseDown={() => setPressed(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseUp={() => setPressed(false)}
      style={{
        background: tokens.cardSurface,
        border: `1px solid ${highlight ? tokens.brand : tokens.border}`,
        borderRadius: tokens.radiusXl,
        boxSizing: "border-box",
        boxShadow: hovered || pressed ? tokens.cardShadowActive : tokens.cardShadow,
        cursor: "pointer",
        display: "grid",
        gap: tokens.gap4,
        maxWidth: "100%",
        minWidth: 0,
        padding: tokens.gap4,
        transform: pressed ? "scale(0.988)" : "translateY(0)",
        transition:
          "box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
        width: "100%"
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          display: "grid",
          gap: tokens.gap3,
          gridTemplateColumns: "44px minmax(0, 1fr)"
        }}
      >
        <AirlineMark brand={brand} flight={flight} tokens={tokens} />

        <div style={{ display: "grid", gap: tokens.gap2, minWidth: 0 }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: tokens.gap2,
              justifyContent: "space-between",
              minWidth: 0
            }}
          >
            <Text
              as="strong"
              brand={brand}
              size="md"
              style={{
                fontSize: 17,
                lineHeight: "22px",
                minWidth: 0
              }}
            >
              {flight.airline}
            </Text>

            {flight.badge ? (
              <span
                style={{
                  alignItems: "center",
                  background: tokens.brandSoft,
                  borderRadius: tokens.radiusPill,
                  color: tokens.brandHover,
                  display: "inline-flex",
                  flex: "0 0 auto",
                  fontFamily: typography.fontFamily,
                  fontSize: 11,
                  fontWeight: typography.semibold,
                  height: 24,
                  justifyContent: "center",
                  lineHeight: "14px",
                  padding: `0 ${tokens.gap2 + 2}px`,
                  whiteSpace: "nowrap"
                }}
              >
                {flight.badge}
              </span>
            ) : null}
          </div>

          <Text brand={brand} size="xs" tone="secondary" style={{ fontSize: 12, lineHeight: "16px" }}>
            {flight.flightNumber}
          </Text>
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: tokens.gap3,
          gridTemplateColumns: "minmax(64px, auto) minmax(0, 1fr) minmax(64px, auto)"
        }}
      >
        <div style={{ display: "grid", gap: 4, justifyItems: "start" }}>
          <Text
            as="strong"
            brand={brand}
            size="xl"
            style={{
              fontSize: 30,
              fontWeight: typography.bold,
              letterSpacing: -0.8,
              lineHeight: "32px"
            }}
          >
            {flight.departureTime}
          </Text>
          <Text
            as="strong"
            brand={brand}
            size="sm"
            style={{
              fontSize: 13,
              lineHeight: "18px"
            }}
          >
            {flight.departureCode}
          </Text>
          <Text brand={brand} size="xs" tone="muted" style={{ fontSize: 11, lineHeight: "14px" }}>
            {flight.departureCity}
          </Text>
        </div>

        <Timeline brand={brand} flight={flight} tokens={tokens} typography={typography} />

        <div style={{ display: "grid", gap: 4, justifyItems: "end" }}>
          <Text
            as="strong"
            brand={brand}
            size="xl"
            style={{
              fontSize: 30,
              fontWeight: typography.bold,
              letterSpacing: -0.8,
              lineHeight: "32px"
            }}
          >
            {flight.arrivalTime}
          </Text>
          <Text
            as="strong"
            brand={brand}
            size="sm"
            style={{
              fontSize: 13,
              lineHeight: "18px"
            }}
          >
            {flight.arrivalCode}
          </Text>
          <Text brand={brand} size="xs" tone="muted" style={{ fontSize: 11, lineHeight: "14px" }}>
            {flight.arrivalCity}
          </Text>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: tokens.gap3
        }}
      >
        <MetadataItem
          brand={brand}
          iconName="checkmark-1-filled"
          label={flight.stopLabel}
          tokens={tokens}
        />
        <MetadataItem
          brand={brand}
          iconName="suitcase-luggage-case-outlined"
          label={flight.baggageLabel}
          tokens={tokens}
        />
        {flight.amenities.map((amenity) => (
          <MetadataItem
            key={`${flight.id}-${amenity.label}`}
            brand={brand}
            iconName={amenity.iconName}
            label={amenity.label}
            tokens={tokens}
          />
        ))}
      </div>

      <Divider brand={brand} lineStyle="Plain" thickness="Thin" />

      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: tokens.gap3,
          gridTemplateColumns: "minmax(0, 1fr) auto",
          minWidth: 0,
          width: "100%"
        }}
      >
        <div style={{ display: "grid", gap: tokens.gap2, minWidth: 0 }}>
          <Text brand={brand} size="xs" tone="muted" style={{ fontSize: 11, lineHeight: "14px" }}>
            From
          </Text>
          <Text
            as="strong"
            brand={brand}
            size="xl"
            style={{
              color: tokens.textPrimary,
              fontSize: 28,
              fontWeight: typography.bold,
              letterSpacing: -0.6,
              lineHeight: "30px"
            }}
          >
            {flight.priceLabel}
          </Text>
        </div>

        <div style={{ display: "grid", justifyItems: "end" }}>
          <Button
            brand={brand}
            shape="Regular"
            size="Extra Small"
            style={{
              minWidth: 88,
              width: "auto"
            }}
          >
            Select
          </Button>
        </div>
      </div>
    </article>
  );
}

export function FlightSearchMobileScreen({
  brand = "Cars24"
}: FlightSearchMobileScreenProps) {
  const [sortMode, setSortMode] = useState<SortMode>("Best Match");
  const tokens = getFlightScreenTokens(brand);
  const typography = getTypography(brand);
  const flights = useMemo(() => orderFlights(sortMode), [sortMode]);

  return (
    <StoryPage fullscreen>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <PhoneFrame tokens={tokens}>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto auto minmax(0, 1fr)",
              height: "100%"
            }}
          >
            <AppHeader
              actions={[
                {
                  icon: <Icon brand={brand} decorative name="filter-filled" />,
                  label: "Filters"
                }
              ]}
              backIcon="bars-three-outline"
              brand={brand}
              level="Page - L2"
              showAvatar={false}
              showSubtitle={false}
              title="Flights"
              variant="Light"
            />

            <RouteSummary brand={brand} tokens={tokens} />

            <div
              style={{
                boxSizing: "border-box",
                minHeight: 0,
                overflowX: "hidden",
                overflowY: "auto"
              }}
            >
              <FilterBar brand={brand} setSortMode={setSortMode} sortMode={sortMode} tokens={tokens} />

              <div
                style={{
                  boxSizing: "border-box",
                  display: "grid",
                  gap: tokens.gap4,
                  padding: `${tokens.gap4}px ${tokens.gap4}px ${tokens.gap6}px`,
                  width: "100%"
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <Text
                    as="strong"
                    brand={brand}
                    size="md"
                    style={{
                      fontSize: 17,
                      lineHeight: "22px"
                    }}
                  >
                    48 flights found
                  </Text>

                  <Text brand={brand} size="xs" tone="secondary" style={{ fontSize: 12, lineHeight: "16px" }}>
                    Sticky filters enabled
                  </Text>
                </div>

                <div style={{ display: "grid", gap: tokens.gap3 }}>
                  {flights.map((flight, index) => (
                    <FlightCard
                      key={`${sortMode}-${flight.id}`}
                      brand={brand}
                      flight={flight}
                      highlight={index === 0 && sortMode === "Best Match"}
                      tokens={tokens}
                      typography={typography}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </StoryPage>
  );
}

export const flightSearchMobileScreenSourceCode = `import {
  AppHeader,
  Button,
  ChoiceChip,
  Divider,
  Icon,
  Text
} from "@geist/web";

export function FlightSearchMobileScreen() {
  return (
    <>
      <AppHeader
        brand="Cars24"
        level="Page - L2"
        title="Flights"
        showSubtitle={false}
        showAvatar={false}
        backIcon="bars-three-outline"
        actions={[{ icon: <Icon name="filter-filled" decorative />, label: "Filters" }]}
        variant="Light"
      />

      <ChoiceChip brand="Cars24" label="Best Match" state="Active" size="Small" />
      <Button brand="Cars24" size="Medium">Select</Button>
      <Divider brand="Cars24" thickness="Thin" />
      <Text brand="Cars24" as="strong" size="xl">06:30</Text>
    </>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: FlightSearchMobileScreenProps) => (
    <FlightSearchMobileScreen brand={brand} />
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      source: {
        code: flightSearchMobileScreenSourceCode
      }
    }
  }
};
