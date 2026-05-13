import type { CSSProperties, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  ChoiceChip,
  Icon,
  PageHeaderL2,
  getRequiredThemeTokenValue
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryPage } from "../storybook-shell";

export type MyOrdersMobileScreenProps = {
  brand?: DisplayBrandId;
};

type OrderStatus = "in-progress" | "recharged" | "in-transit";

type OrderChip = {
  iconName?: Parameters<typeof Icon>[0]["name"];
  id: string;
  label: string;
};

type OrderCardRecord = {
  category: string;
  date: string;
  detailsLabel: string;
  licensePlate: string;
  orderNumber: string;
  quantityLabel: string;
  status: OrderStatus;
  totalAmount: string;
  vehicleName: string;
};

const MY_ORDERS_FIGMA_URL =
  "https://www.figma.com/design/py6JL4jNmcSPS1KMrq7zVt/%F0%9F%93%B1-2026-VAS-Mobile-Final-Design-Handoff---Part-1---VI-CI?node-id=8183-19106&t=F444BkS75mp8cy8t-11";

const FILTER_CHIPS: OrderChip[] = [
  { id: "all", label: "All" },
  {
    iconName: "script-paper-page-contract-file-document-outline",
    id: "challan",
    label: "Challan"
  },
  {
    iconName: "maintenance-outline",
    id: "inspection",
    label: "Pre-delivery inspection"
  },
  {
    iconName: "wallet-3-outline",
    id: "recharge",
    label: "FASTag recharge"
  },
  {
    iconName: "rupee-outline",
    id: "purchased-fastags",
    label: "Purchased FASTags"
  },
  {
    iconName: "umbrella-line",
    id: "insurance",
    label: "Insurance"
  },
  {
    iconName: "clipboard-outline",
    id: "vehicle-history",
    label: "Vehicle history report"
  },
  {
    iconName: "file-text-outline",
    id: "inspection-report",
    label: "Inspection report"
  },
  {
    iconName: "medal-badge-winner-outline",
    id: "seller-package",
    label: "Seller package"
  },
  {
    iconName: "sparkle-line",
    id: "car-wash",
    label: "Car wash"
  }
];

const ORDERS: OrderCardRecord[] = [
  {
    category: "Challan",
    date: "23 Dec, 2026",
    detailsLabel: "View order details",
    licensePlate: "DL2CBF2212",
    orderNumber: "#24324122",
    quantityLabel: "3x Challans",
    status: "in-progress",
    totalAmount: "₹4,300",
    vehicleName: "Skoda Slavia Ambition 1.0 TSI"
  },
  {
    category: "FASTag recharge",
    date: "21 Dec, 2026",
    detailsLabel: "View order details",
    licensePlate: "DL2CBF2212",
    orderNumber: "#24324122",
    quantityLabel: "FASTag recharge",
    status: "recharged",
    totalAmount: "₹4,300",
    vehicleName: "Skoda Slavia Ambition 1.0 TSI"
  },
  {
    category: "Purchased FASTags",
    date: "21 Dec, 2026",
    detailsLabel: "View order details",
    licensePlate: "DL2CBF2212",
    orderNumber: "#24324122",
    quantityLabel: "1x FASTag purchased",
    status: "in-transit",
    totalAmount: "₹4,300",
    vehicleName: "Skoda Slavia Ambition 1.0 TSI"
  }
];

function CellularIcon({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "flex-end",
        display: "inline-flex",
        gap: 2,
        height: 12,
        width: 20
      }}
    >
      {[5, 7, 9, 11].map((height, index) => (
        <span
          key={`cellular-bar-${index}`}
          style={{
            background: color,
            borderRadius: 999,
            display: "block",
            height,
            opacity: index === 0 ? 0.75 : 1,
            width: 3
          }}
        />
      ))}
    </span>
  );
}

function WifiIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      height="13"
      viewBox="0 0 17 13"
      width="17"
    >
      <path
        d="M8.5 10.8c.55 0 1 .44 1 1 0 .55-.45 1-1 1s-1-.45-1-1c0-.56.45-1 1-1Zm0-3.2c1.48 0 2.83.53 3.87 1.41a.55.55 0 0 1 .04.78.56.56 0 0 1-.79.05A4.89 4.89 0 0 0 8.5 8.7c-1.18 0-2.27.41-3.12 1.14a.56.56 0 0 1-.79-.05.55.55 0 0 1 .04-.78A6.02 6.02 0 0 1 8.5 7.6Zm0-3.35c2.35 0 4.52.83 6.18 2.22.23.19.26.54.07.77a.55.55 0 0 1-.78.07A8.4 8.4 0 0 0 8.5 5.35a8.4 8.4 0 0 0-5.47 1.96.55.55 0 0 1-.78-.07.55.55 0 0 1 .07-.77A9.54 9.54 0 0 1 8.5 4.25Zm0-3.25c3.2 0 6.16 1.13 8.42 3.03.23.2.26.54.07.78a.55.55 0 0 1-.78.06A11.87 11.87 0 0 0 8.5 2.1c-2.92 0-5.6 1.02-7.71 2.77a.55.55 0 0 1-.78-.06.55.55 0 0 1 .07-.78A13 13 0 0 1 8.5 1Z"
        fill={color}
      />
    </svg>
  );
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      height="13"
      viewBox="0 0 27 13"
      width="27"
    >
      <rect
        fill="none"
        height="11.5"
        opacity="0.35"
        rx="2.5"
        stroke={color}
        strokeWidth="1"
        width="24"
        x="1"
        y="0.75"
      />
      <rect fill={color} height="7.5" rx="1.5" width="18" x="3.5" y="2.75" />
      <rect fill={color} height="4" rx="1" width="1.6" x="25.2" y="4.5" />
    </svg>
  );
}

function DeviceStatusBar({ brand }: { brand: DisplayBrandId }) {
  const textColor = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: 48,
        position: "relative",
        width: "100%"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          color: textColor,
          fontFamily: "\"SF Pro Text\", \"SF Pro Display\", -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 17,
          fontWeight: 600,
          left: 31.5,
          letterSpacing: "-0.5px",
          lineHeight: "17px",
          position: "absolute",
          top: 21
        }}
      >
        9:41
      </span>

      <div
        aria-hidden="true"
        style={{
          alignItems: "center",
          display: "inline-flex",
          gap: 6,
          position: "absolute",
          right: 18.7,
          top: 23
        }}
      >
        <CellularIcon color={textColor} />
        <WifiIcon color={textColor} />
        <BatteryIcon color={textColor} />
      </div>
    </div>
  );
}

function ScreenCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        boxSizing: "border-box",
        borderRadius: 34,
        boxShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
        overflow: "hidden",
        width: 360
      }}
    >
      {children}
    </div>
  );
}

function createCarThumbnail() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" role="img" aria-label="Car thumbnail">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#EEF2F7" />
        </linearGradient>
        <linearGradient id="car" x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="0%" stop-color="#FF5C26" />
          <stop offset="100%" stop-color="#FF7A1A" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="10" fill="url(#bg)" />
      <ellipse cx="22" cy="31.8" rx="14" ry="2.6" fill="#CBD5E1" opacity="0.4" />
      <path d="M9 25.2h26v-2.8l-2.4-2.5c-2.5-3.2-4.9-4.7-8.8-4.7h-8.3c-3.1 0-5.6 1.7-7.9 6.1L9 25.2Z" fill="#1E293B" />
      <path d="M10.3 24.1h24.4v-1.7l-2.2-2.3c-2.3-3-4.4-4.3-8.1-4.3h-7.4c-2.8 0-5.2 1.5-7.1 5.5l.4 2.8Z" fill="url(#car)" />
      <path d="M14 19.4h10.2c1.8 0 3.1.6 4.6 2.1H12.1c.7-1.1 1.1-1.6 1.9-2.1Z" fill="#F8FAFC" opacity="0.88" />
      <path d="M25.2 19.4h6.5c1.3 0 2.2.6 3.2 2.1H24.8c.1-.8.2-1.4.4-2.1Z" fill="#E2E8F0" opacity="0.95" />
      <rect x="12" y="23.5" width="3.5" height="1.4" rx="0.7" fill="#F8FAFC" opacity="0.9" />
      <rect x="28.5" y="23.5" width="3.5" height="1.4" rx="0.7" fill="#F8FAFC" opacity="0.9" />
      <circle cx="15.4" cy="27.3" r="4.4" fill="#0F172B" />
      <circle cx="15.4" cy="27.3" r="1.9" fill="#E2E8F0" />
      <circle cx="29.4" cy="27.3" r="4.4" fill="#0F172B" />
      <circle cx="29.4" cy="27.3" r="1.9" fill="#E2E8F0" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createTypography(brand: DisplayBrandId) {
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const semibold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const medium = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const bold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.bold"));

  return {
    body2Medium: {
      fontFamily,
      fontSize: 13,
      fontWeight: medium,
      letterSpacing: 0,
      lineHeight: "18px"
    } satisfies CSSProperties,
    body2Semibold: {
      fontFamily,
      fontSize: 13,
      fontWeight: semibold,
      letterSpacing: 0,
      lineHeight: "18px"
    } satisfies CSSProperties,
    body3Medium: {
      fontFamily,
      fontSize: 11,
      fontWeight: medium,
      letterSpacing: 0,
      lineHeight: "17px"
    } satisfies CSSProperties,
    heading5Bold: {
      fontFamily,
      fontSize: 15,
      fontWeight: bold,
      letterSpacing: 0,
      lineHeight: "18px"
    } satisfies CSSProperties,
    heading5Semibold: {
      fontFamily,
      fontSize: 15,
      fontWeight: semibold,
      letterSpacing: 0,
      lineHeight: "18px"
    } satisfies CSSProperties
  };
}

function getStatusBadgeProps(status: OrderStatus) {
  if (status === "recharged") {
    return {
      background: "#EFFFF7",
      label: "Recharged",
      text: "#2A6B4A",
      type: "Success" as const
    };
  }

  if (status === "in-transit") {
    return {
      background: "#FFFBEB",
      label: "In transit",
      text: "#BB4D00",
      type: "Warning" as const
    };
  }

  return {
    background: "#FFFBEB",
    label: "In progress",
    text: "#BB4D00",
    type: "Warning" as const
  };
}

function StatusPill({
  brand,
  status
}: {
  brand: DisplayBrandId;
  status: OrderStatus;
}) {
  const typography = createTypography(brand);
  const config = getStatusBadgeProps(status);

  return (
    <span
      style={{
        ...typography.body3Medium,
        alignItems: "center",
        background: config.background,
        boxSizing: "border-box",
        borderRadius: 6,
        color: config.text,
        display: "inline-flex",
        flexShrink: 0,
        height: 20,
        justifyContent: "center",
        padding: "0 6px",
        whiteSpace: "nowrap"
      }}
    >
      {config.label}
    </span>
  );
}

function OutlineActionButton({
  brand,
  children
}: {
  brand: DisplayBrandId;
  children: ReactNode;
}) {
  const typography = createTypography(brand);
  const brandColor = String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));

  return (
    <button
      type="button"
      style={{
        ...typography.body2Semibold,
        alignItems: "center",
        background: "#FFFFFF",
        border: `1px solid ${brandColor}`,
        borderRadius: 8,
        boxSizing: "border-box",
        color: brandColor,
        cursor: "pointer",
        display: "inline-flex",
        height: 32,
        justifyContent: "center",
        padding: "7px 12px",
        minWidth: 0,
        width: "100%"
      }}
    >
      {children}
    </button>
  );
}

function DateSeparator({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  const borderColor = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const mutedText = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const typography = createTypography(brand);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: 12,
        width: "100%"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: borderColor,
          display: "block",
          flex: 1,
          height: 1
        }}
      />
      <span
        style={{
          ...typography.body3Medium,
          color: mutedText
        }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        style={{
          background: borderColor,
          display: "block",
          flex: 1,
          height: 1
        }}
      />
    </div>
  );
}

function OrderCard({
  brand,
  order
}: {
  brand: DisplayBrandId;
  order: OrderCardRecord;
}) {
  const typography = createTypography(brand);
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const surfaceSubtle = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const textMuted = String(getRequiredThemeTokenValue(brand, "color.text.muted"));
  const carThumbnail = createCarThumbnail();
  const categoryIconName =
    order.category === "Challan"
      ? "script-paper-page-contract-file-document-outline"
      : order.category === "FASTag recharge"
        ? "wallet-3-outline"
        : "rupee-outline";

  return (
    <article
      style={{
        background: surfaceSubtle,
        boxSizing: "border-box",
        borderRadius: 12,
        display: "grid",
        minWidth: 0,
        maxWidth: "100%",
        overflow: "hidden",
        width: "100%"
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          color: textSecondary,
          display: "flex",
          justifyContent: "space-between",
          minWidth: 0,
          padding: "8px 12px"
        }}
      >
        <span
          style={{
            ...typography.body3Medium,
            minWidth: 0
          }}
        >
          Order {order.orderNumber}
        </span>

        <span
          style={{
            ...typography.body3Medium,
            alignItems: "center",
            display: "inline-flex",
            flexShrink: 0,
            gap: 4
          }}
        >
          <Icon
            brand={brand}
            decorative
            name={categoryIconName}
            size="sm"
            style={{ color: textSecondary }}
          />
          {order.category}
        </span>
      </div>

      <div
        style={{
          background: surfaceCanvas,
          border: `1px solid ${borderDefault}`,
          borderRadius: 12,
          boxSizing: "border-box",
          boxShadow: "0 -2px 6px rgba(15, 23, 42, 0.04)",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: `0.5px solid ${borderDefault}`,
            boxSizing: "border-box",
            display: "grid",
            gap: 24,
            gridTemplateColumns: "minmax(0, 1fr) auto",
            minWidth: 0,
            padding: 12
          }}
        >
          <div style={{ display: "grid", gap: 2, minWidth: 0 }}>
            <span
              style={{
                ...typography.heading5Semibold,
                color: textPrimary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {order.vehicleName}
            </span>
            <span
              style={{
                ...typography.body2Medium,
                color: textMuted
              }}
            >
              {order.licensePlate}
            </span>
          </div>

          <div
            style={{
              alignItems: "center",
              background: surfaceSubtle,
              borderRadius: 8,
              display: "flex",
              height: 44,
              justifyContent: "center",
              overflow: "hidden",
              width: 44
            }}
          >
            <img
              alt={order.vehicleName}
              src={carThumbnail}
              style={{
                display: "block",
                height: 44,
                width: 44
              }}
            />
          </div>
        </div>

        <div
          style={{
            boxSizing: "border-box",
            display: "grid",
            gap: 12,
            minWidth: 0,
            padding: "12px 12px 8px"
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "grid",
              gap: 8,
              gridTemplateColumns: "minmax(0, 1fr) auto",
              minWidth: 0
            }}
          >
            <span
              style={{
                ...typography.body2Medium,
                color: textPrimary,
                minWidth: 0
              }}
            >
              {order.quantityLabel}
            </span>

            <StatusPill brand={brand} status={order.status} />
          </div>

          <span
            aria-hidden="true"
            style={{
              background: borderDefault,
              backgroundImage: `linear-gradient(to right, ${borderDefault} 50%, transparent 0%)`,
              backgroundPosition: "top",
              backgroundRepeat: "repeat-x",
              backgroundSize: "8px 1px",
              display: "block",
              height: 1,
              opacity: 0.9
            }}
          />

          <div
            style={{
              alignItems: "start",
              display: "grid",
              gap: 12,
              gridTemplateColumns: "minmax(0, 1fr) auto",
              minWidth: 0
            }}
          >
            <span
              style={{
                ...typography.body2Semibold,
                color: textMuted,
                minWidth: 0
              }}
            >
              Total Amount paid
            </span>
            <span
              style={{
                ...typography.heading5Bold,
                color: textPrimary
              }}
            >
              {order.totalAmount}
            </span>
          </div>

          <OutlineActionButton brand={brand}>
            {order.detailsLabel}
          </OutlineActionButton>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "2px 12px"
          }}
        >
          <span
            aria-hidden="true"
            style={{
              background: borderDefault,
              display: "block",
              height: 1,
              opacity: 0.95,
              width: 82
            }}
          />
        </div>
      </div>
    </article>
  );
}

function FilterBar({
  activeChip,
  brand
}: {
  activeChip: string;
  brand: DisplayBrandId;
}) {
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const brandColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));

  return (
    <div
      style={{
        borderBottom: `1px solid ${borderDefault}`,
        boxSizing: "border-box",
        maxWidth: "100%",
        minWidth: 0,
        padding: "8px 0 0"
      }}
    >
      <div
        style={{
          WebkitOverflowScrolling: "touch",
          boxSizing: "border-box",
          display: "flex",
          gap: 8,
          justifyContent: "flex-start",
          maxWidth: "100%",
          msOverflowStyle: "none",
          minWidth: 0,
          overflowX: "auto",
          padding: "0 12px 12px",
          scrollbarWidth: "none",
          width: "100%"
        }}
      >
        {FILTER_CHIPS.map((chip) => {
          const isActive = chip.id === activeChip;

          return (
            <ChoiceChip
              key={chip.id}
              brand={brand}
              iconSwap={false}
              label={chip.label}
              leadingIcon={Boolean(chip.iconName)}
              trailingIcon={false}
              size="Small"
              state={isActive ? "Active" : "Rest"}
              style={{
                background: isActive ? "#F6F5FF" : "#FFFFFF",
                borderColor: borderDefault,
                color: isActive ? brandColor : undefined,
                flex: "0 0 auto",
                whiteSpace: "nowrap"
              }}
              variant="Horizontal"
              {...(chip.iconName ? { leadingIconName: chip.iconName } : {})}
            />
          );
        })}
      </div>
    </div>
  );
}

function HomeIndicator({ brand }: { brand: DisplayBrandId }) {
  const mutedText = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));

  return (
    <div
      style={{
        alignItems: "center",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        padding: "10px 12px 8px"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: mutedText,
          borderRadius: 999,
          display: "block",
          height: 5,
          opacity: 0.55,
          width: 134
        }}
      />
    </div>
  );
}

export function MyOrdersMobileScreen({
  brand = "Cars24"
}: MyOrdersMobileScreenProps) {
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const ordersByDate = ORDERS.reduce<Record<string, OrderCardRecord[]>>((accumulator, order) => {
    const ordersForDate = accumulator[order.date] ?? [];
    ordersForDate.push(order);
    accumulator[order.date] = ordersForDate;
    return accumulator;
  }, {});

  return (
    <StoryPage fullscreen>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          padding: "24px 12px"
        }}
      >
        <ScreenCard>
          <div
            style={{
              background: surfaceCanvas,
              border: `1px solid ${borderDefault}`,
              borderRadius: 34,
              boxSizing: "border-box",
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              height: 780,
              minWidth: 0,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                background: surfaceCanvas,
                minWidth: 0,
                width: "100%"
              }}
            >
              <DeviceStatusBar brand={brand} />
              <PageHeaderL2
                brand={brand}
                showAction1={false}
                showAction2={false}
                showAvatar={false}
                showLocation={false}
                showSubtitle={false}
                title="My orders"
                variant="Light"
                style={{
                  background: surfaceCanvas
                }}
              />
              <FilterBar activeChip="all" brand={brand} />
            </div>

            <div
              style={{
                boxSizing: "border-box",
                minHeight: 0,
                minWidth: 0,
                overflowX: "hidden",
                overflowY: "auto",
                padding: 12,
                width: "100%"
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  minWidth: 0,
                  width: "100%"
                }}
              >
                {Object.entries(ordersByDate).map(([date, orders]) => (
                  <div
                    key={date}
                    style={{
                      display: "grid",
                      gap: 12,
                      minWidth: 0,
                      width: "100%"
                    }}
                  >
                    <DateSeparator brand={brand} label={date} />
                    {orders.map((order) => (
                      <OrderCard
                        key={`${order.date}-${order.category}-${order.quantityLabel}`}
                        brand={brand}
                        order={order}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <HomeIndicator brand={brand} />
          </div>
        </ScreenCard>
      </div>
    </StoryPage>
  );
}

export const myOrdersMobileScreenSourceCode = `import {
  Badge,
  Button,
  ChoiceChip,
  Icon,
  PageHeaderL2
} from "@turbo/web";

export function MyOrdersMobileScreen() {
  return (
    <>
      <PageHeaderL2 brand="Cars24" title="My orders" variant="Light" />
      <ChoiceChip brand="Cars24" label="All" size="Small" state="Active" variant="Horizontal" />
      <Badge
        brand="Cars24"
        labelText="In progress"
        pillShape="No"
        priority="Low"
        showLeadingIcon={false}
        showTrailingIcon={false}
        size="Extra Small"
        type="Warning"
      />
      <Button brand="Cars24" size="Small" styleVariant="Outline">View order details</Button>
    </>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: MyOrdersMobileScreenProps) => <MyOrdersMobileScreen brand={brand} />,
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(MY_ORDERS_FIGMA_URL),
    docs: {
      source: {
        code: myOrdersMobileScreenSourceCode
      }
    }
  }
};
