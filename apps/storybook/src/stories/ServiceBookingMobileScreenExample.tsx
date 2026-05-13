import { useState, type CSSProperties, type ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  Badge,
  Button,
  Icon,
  PageHeaderL2,
  SegmentedControl,
  Text,
  TextInput,
  getRequiredThemeTokenValue,
  type SegmentedControlItem
} from "@turbo/web";
import { StoryBadge, StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

export type ServiceBookingMobileScreenProps = {
  brand?: DisplayBrandId;
};

type BookingMode = "home" | "workshop";
type BookingScreenState = "default" | "loading" | "empty" | "error";

type BookingSlot = {
  disabled?: boolean;
  helper: string;
  id: string;
  label: string;
  time: string;
};

type BookingTokens = {
  border: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  canvas: string;
  danger: string;
  dangerSoft: string;
  inverse: string;
  muted: string;
  primary: string;
  screenShadow: string;
  subtle: string;
  success: string;
  warning: string;
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
};

const BOOKING_MODE_ITEMS: SegmentedControlItem[] = [
  { ariaLabel: "Book doorstep service", label: "At home", value: "home" },
  { ariaLabel: "Book workshop visit", label: "Workshop", value: "workshop" }
];

const BOOKING_SLOTS: Record<BookingMode, BookingSlot[]> = {
  home: [
    { id: "home-08-30", time: "08:30", label: "Pickup window", helper: "2 hour turnaround" },
    { id: "home-10-00", time: "10:00", label: "Recommended", helper: "Fastest technician" },
    { id: "home-12-30", time: "12:30", label: "Waitlist only", helper: "Limited crew", disabled: true },
    { id: "home-15-00", time: "15:00", label: "Late afternoon", helper: "Pickup included" }
  ],
  workshop: [
    { id: "workshop-09-00", time: "09:00", label: "Express lane", helper: "40 min visit" },
    { id: "workshop-11-30", time: "11:30", label: "Recommended", helper: "Advisor available" },
    { id: "workshop-14-00", time: "14:00", label: "Priority bay", helper: "Lounge access" },
    { id: "workshop-17-30", time: "17:30", label: "Last slot", helper: "Drop-off only", disabled: true }
  ]
};

function getBookingTokens(brand: DisplayBrandId): BookingTokens {
  return {
    border: String(getRequiredThemeTokenValue(brand, "color.border.default")),
    brand: String(getRequiredThemeTokenValue(brand, "color.brand.alt.500")),
    brandStrong: String(getRequiredThemeTokenValue(brand, "color.brand.alt.600")),
    brandSoft: String(getRequiredThemeTokenValue(brand, "color.brand.primary.50")),
    canvas: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    danger: String(getRequiredThemeTokenValue(brand, "color.status.danger")),
    dangerSoft: "#FEF2F2",
    inverse: String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
    muted: String(getRequiredThemeTokenValue(brand, "color.text.secondary")),
    primary: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    screenShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
    subtle: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    success: String(getRequiredThemeTokenValue(brand, "color.status.success")),
    warning: String(getRequiredThemeTokenValue(brand, "color.status.warning")),
    xxs: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    xs: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
    sm: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
    md: Number(getRequiredThemeTokenValue(brand, "spacing.4")),
    lg: Number(getRequiredThemeTokenValue(brand, "spacing.5")),
    xl: Number(getRequiredThemeTokenValue(brand, "spacing.6")),
    radiusSm: Number(getRequiredThemeTokenValue(brand, "radius.alt.sm")),
    radiusMd: Number(getRequiredThemeTokenValue(brand, "radius.alt.md")),
    radiusLg: Number(getRequiredThemeTokenValue(brand, "radius.alt.lg")),
    radiusXl: Number(getRequiredThemeTokenValue(brand, "radius.xl")),
    radiusPill: Number(getRequiredThemeTokenValue(brand, "radius.pill")),
    thinBorder: Number(getRequiredThemeTokenValue(brand, "component.divider.size.thickness.thin"))
  };
}

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
        09:41
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
        borderRadius: 34,
        boxShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
        overflow: "hidden",
        maxWidth: 360,
        width: "100%"
      }}
    >
      {children}
    </div>
  );
}

function SurfaceCard({
  children,
  style
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: 20,
        display: "grid",
        gap: 12,
        padding: 16,
        width: "100%",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function InfoRow({
  brand,
  title,
  value,
  iconName
}: {
  brand: DisplayBrandId;
  title: string;
  value: string;
  iconName: "calendar-line" | "map-filled" | "shield-check-filled";
}) {
  return (
    <div
      style={{
        alignItems: "flex-start",
        display: "grid",
        gap: 8,
        gridTemplateColumns: "auto minmax(0, 1fr)"
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "rgba(15, 23, 42, 0.04)",
          borderRadius: 12,
          display: "inline-flex",
          height: 32,
          justifyContent: "center",
          width: 32
        }}
      >
        <Icon brand={brand} decorative name={iconName} size="sm" tone="primary" />
      </div>

      <div style={{ display: "grid", gap: 2 }}>
        <Text as="span" brand={brand} size="xs" tone="secondary">
          {title}
        </Text>
        <Text as="strong" brand={brand} size="sm" tone="primary">
          {value}
        </Text>
      </div>
    </div>
  );
}

function SlotCard({
  brand,
  onSelect,
  selected,
  slot,
  tokens
}: {
  brand: DisplayBrandId;
  onSelect: () => void;
  selected: boolean;
  slot: BookingSlot;
  tokens: BookingTokens;
}) {
  const disabled = Boolean(slot.disabled);

  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      style={{
        alignItems: "flex-start",
        background: disabled ? tokens.subtle : selected ? tokens.brandSoft : tokens.canvas,
        border: `${tokens.thinBorder}px solid ${selected ? tokens.brandStrong : tokens.border}`,
        borderRadius: tokens.radiusLg,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "grid",
        gap: 4,
        minHeight: 72,
        opacity: disabled ? 0.55 : 1,
        padding: `${tokens.xs + 2}px`,
        textAlign: "left",
        width: "100%"
      }}
      type="button"
    >
      <Text as="strong" brand={brand} size="md" tone="primary">
        {slot.time}
      </Text>
      <Text as="span" brand={brand} size="xs" tone={selected ? "primary" : "secondary"}>
        {slot.label}
      </Text>
      <Text as="span" brand={brand} size="xs" tone="secondary">
        {slot.helper}
      </Text>
    </button>
  );
}

function LoadingSlotCard({ tokens }: { tokens: BookingTokens }) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: `linear-gradient(90deg, ${tokens.subtle} 0%, ${tokens.brandSoft} 50%, ${tokens.subtle} 100%)`,
        backgroundSize: "220px 100%",
        borderRadius: tokens.radiusLg,
        minHeight: 72,
        opacity: 0.9
      }}
    />
  );
}

function EmptyStateCard({
  brand,
  description,
  title,
  tokens
}: {
  brand: DisplayBrandId;
  description: string;
  title: string;
  tokens: BookingTokens;
}) {
  return (
    <SurfaceCard
      style={{
        background: tokens.subtle,
        justifyItems: "center",
        padding: 24,
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
        <Icon brand={brand} decorative name="calendar-line" size="md" tone="primary" />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <Text as="strong" brand={brand} size="lg" tone="primary">
          {title}
        </Text>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          {description}
        </Text>
      </div>
    </SurfaceCard>
  );
}

function ErrorStateCard({ brand, tokens }: { brand: DisplayBrandId; tokens: BookingTokens }) {
  return (
    <SurfaceCard
      style={{
        background: tokens.dangerSoft,
        borderColor: tokens.danger
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 12,
          gridTemplateColumns: "auto minmax(0, 1fr)"
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: tokens.canvas,
            borderRadius: tokens.radiusPill,
            display: "inline-flex",
            height: 44,
            justifyContent: "center",
            width: 44
          }}
        >
          <Icon brand={brand} decorative name="info-filled" size="sm" tone="primary" />
        </div>

        <div style={{ display: "grid", gap: 4 }}>
          <Text as="strong" brand={brand} size="md" tone="primary">
            We could not load the latest slots
          </Text>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            Check your connection or retry to refresh availability before confirming the booking.
          </Text>
        </div>
      </div>
    </SurfaceCard>
  );
}

function FooterNote({
  brand,
  tokens
}: {
  brand: DisplayBrandId;
  tokens: BookingTokens;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: tokens.brandSoft,
        borderRadius: tokens.radiusMd,
        display: "grid",
        gap: 6,
        gridTemplateColumns: "auto minmax(0, 1fr)",
        padding: `8px ${tokens.sm}px`
      }}
    >
      <Icon brand={brand} decorative name="shield-check-filled" size="sm" tone="primary" />
      <Text as="span" brand={brand} size="xs" tone="secondary">
        Free cancellation up to 2 hours before the slot starts.
      </Text>
    </div>
  );
}

function FooterActions({
  brand,
  screenState
}: {
  brand: DisplayBrandId;
  screenState: BookingScreenState;
}) {
  if (screenState === "loading") {
    return (
      <>
        <Button brand={brand} disabled size="Large" style={{ width: "100%" }} styleVariant="Outline">
          Compare
        </Button>
        <Button brand={brand} loading size="Large" style={{ width: "100%" }}>
          Checking slots
        </Button>
      </>
    );
  }

  if (screenState === "empty") {
    return (
      <>
        <Button brand={brand} size="Large" style={{ width: "100%" }} styleVariant="Outline">
          Notify me
        </Button>
        <Button brand={brand} disabled size="Large" style={{ width: "100%" }}>
          Continue
        </Button>
      </>
    );
  }

  if (screenState === "error") {
    return (
      <>
        <Button brand={brand} size="Large" style={{ width: "100%" }} styleVariant="Outline">
          Retry
        </Button>
        <Button brand={brand} disabled size="Large" style={{ width: "100%" }}>
          Continue
        </Button>
      </>
    );
  }

  return (
    <>
      <Button brand={brand} size="Large" style={{ width: "100%" }} styleVariant="Outline">
        Compare
      </Button>
      <Button brand={brand} size="Large" style={{ width: "100%" }}>
        Book slot
      </Button>
    </>
  );
}

function ScreenPreview({
  children,
  label,
  description
}: {
  children: ReactNode;
  description: string;
  label: string;
}) {
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center", width: "100%" }}>
      <div style={{ display: "grid", gap: 8, justifyItems: "start", maxWidth: 360, width: "100%" }}>
        <StoryBadge>{label}</StoryBadge>
        <StoryCopy size="sm">{description}</StoryCopy>
      </div>
      <div style={{ maxWidth: 360, width: "100%" }}>{children}</div>
    </div>
  );
}

export function ServiceBookingMobileScreen({
  brand = "Cars24",
  screenState = "default"
}: ServiceBookingMobileScreenProps & {
  screenState?: BookingScreenState;
}) {
  const tokens = getBookingTokens(brand);
  const [mode, setMode] = useState<BookingMode>("home");
  const [address, setAddress] = useState("Tower C, Sector 44, Gurgaon");
  const [selectedSlotId, setSelectedSlotId] = useState(BOOKING_SLOTS.home[1]?.id ?? "");
  const visibleSlots = BOOKING_SLOTS[mode];
  const previewSlots = visibleSlots.slice(0, 2);
  const shouldShowErrorField = screenState === "error";

  return (
    <ScreenCard>
      <div
        style={{
          background: tokens.canvas,
          border: `${tokens.thinBorder}px solid ${tokens.border}`,
          borderRadius: 34,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          height: 780,
          overflow: "hidden"
        }}
      >
        <div style={{ background: tokens.canvas }}>
          <DeviceStatusBar brand={brand} />
          <PageHeaderL2
            actions={[{ icon: <Icon name="calendar-line" decorative />, label: "Schedule" }]}
            brand={brand}
            showAction1={false}
            showAction2={false}
            showAvatar={false}
            showLocation={false}
            showSubtitle={false}
            title="Book service"
            variant="Light"
            style={{
              background: tokens.canvas,
              borderBottom: `${tokens.thinBorder}px solid ${tokens.border}`
            }}
          />
        </div>

        <div
          style={{
            background: `linear-gradient(180deg, ${tokens.brandSoft} 0%, ${tokens.canvas} 18%, ${tokens.subtle} 100%)`,
            minHeight: 0,
            overflowY: "auto",
            padding: `${tokens.xs + 2}px ${tokens.sm}px ${tokens.md}px`
          }}
        >
          <div style={{ display: "grid", gap: tokens.xs + 2 }}>
            <SurfaceCard
              style={{
                background: `linear-gradient(135deg, ${tokens.brand} 0%, ${tokens.brandStrong} 100%)`,
                border: "none",
                color: tokens.inverse,
                gap: 4,
                padding: 12
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-start"
                }}
              >
                <Badge
                  brand={brand}
                  labelText="Next available"
                  pillShape="No"
                  priority="Low"
                  showLeadingIcon={false}
                  showTrailingIcon={false}
                  size="Extra Small"
                  type="Warning"
                />
              </div>

              <div style={{ display: "grid", gap: 4 }}>
                <Text as="strong" brand={brand} size="lg" tone="inverse">
                  Periodic service
                </Text>
                <Text as="p" brand={brand} size="sm" tone="inverse" style={{ margin: 0, opacity: 0.88 }}>
                  Hyundai Creta • DL 8C AB 2401
                </Text>
              </div>
            </SurfaceCard>

            <SegmentedControl
              brand={brand}
              items={BOOKING_MODE_ITEMS}
              onValueChange={(nextValue) => {
                const nextMode = nextValue as BookingMode;
                setMode(nextMode);
                setSelectedSlotId(BOOKING_SLOTS[nextMode][1]?.id ?? BOOKING_SLOTS[nextMode][0]?.id ?? "");
              }}
              size="Large"
              type="Label"
              value={mode}
            />

            <TextInput
              brand={brand}
              helperText={
                shouldShowErrorField ? "We could not validate this address. You can still retry." : "Pickup and drop are included."
              }
              helperTone={shouldShowErrorField ? "Error" : "Default"}
              label={mode === "home" ? "Pickup address" : "Workshop location"}
              onChange={(event) => setAddress(event.currentTarget.value)}
              placeholder={mode === "home" ? "Enter pickup address" : "Search workshop"}
              required
              showLabelInfoIcon={false}
              size="Small"
              validationState={shouldShowErrorField ? "Error" : "Default"}
              value={address}
            />

            <SurfaceCard style={{ gap: tokens.xs, padding: 14 }}>
              <div
                style={{
                  alignItems: "flex-start",
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "minmax(0, 1fr)"
                }}
              >
                <Text as="strong" brand={brand} size="md" tone="primary">
                  Booking summary
                </Text>
                <Badge
                  brand={brand}
                  labelText={mode === "home" ? "Doorstep" : "Workshop"}
                  pillShape="No"
                  priority="Low"
                  showLeadingIcon={false}
                  showTrailingIcon={false}
                  size="Extra Small"
                  style={{ width: "fit-content" }}
                  type="Success"
                />
              </div>

              <InfoRow brand={brand} iconName="calendar-line" title="Service date" value="Tomorrow, 24 July" />
              <InfoRow
                brand={brand}
                iconName="map-filled"
                title={mode === "home" ? "Pickup location" : "Selected workshop"}
                value={mode === "home" ? "Sector 44, Gurgaon" : "Cars24 Hub, Golf Course Road"}
              />
              <InfoRow brand={brand} iconName="shield-check-filled" title="Coverage" value="Genuine parts • 6 month warranty" />
            </SurfaceCard>

            <div style={{ display: "grid", gap: tokens.xs + 2 }}>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  gap: 8
                }}
              >
                <Icon brand={brand} decorative name="sparkle-filled" size="sm" tone="primary" />
                <Text as="strong" brand={brand} size="md" tone="primary">
                  Time slots
                </Text>
                <Badge
                  brand={brand}
                  labelText="New"
                  pillShape="No"
                  priority="Low"
                  showLeadingIcon={false}
                  showTrailingIcon={false}
                  size="Extra Small"
                  type="Error"
                />
              </div>

              {screenState === "loading" ? (
                <div
                  style={{
                    display: "grid",
                    gap: tokens.xs + 2,
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
                  }}
                >
                  {Array.from({ length: 2 }, (_, index) => (
                    <LoadingSlotCard key={`loading-slot-${index}`} tokens={tokens} />
                  ))}
                </div>
              ) : null}

              {screenState === "empty" ? (
                <EmptyStateCard
                  brand={brand}
                  description="No slots match the selected date and service mode. Users can switch modes or opt in for reminders."
                  title="No slots available"
                  tokens={tokens}
                />
              ) : null}

              {screenState === "error" ? <ErrorStateCard brand={brand} tokens={tokens} /> : null}

              {screenState === "default" ? (
                <div
                  style={{
                    display: "grid",
                    gap: tokens.xs + 2,
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
                  }}
                >
                  {previewSlots.map((slot) => (
                    <SlotCard
                      brand={brand}
                      key={slot.id}
                      onSelect={() => setSelectedSlotId(slot.id)}
                      selected={selectedSlotId === slot.id}
                      slot={slot}
                      tokens={tokens}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          style={{
            background: tokens.canvas,
            borderTop: `${tokens.thinBorder}px solid ${tokens.border}`,
            display: "grid",
            gap: tokens.xs,
            padding: `${tokens.xs}px ${tokens.sm}px ${tokens.sm}px`
          }}
        >
          <FooterNote brand={brand} tokens={tokens} />
          <div
            style={{
              display: "grid",
              gap: tokens.sm,
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
            }}
          >
            <FooterActions brand={brand} screenState={screenState} />
          </div>
        </div>
      </div>
    </ScreenCard>
  );
}

function InteractionStatesPanel({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const tokens = getBookingTokens(brand);

  return (
    <StoryCard
      style={{
        display: "grid",
        gap: 20
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <StoryHeading brand={brand} size="lg">
          Interaction states
        </StoryHeading>
        <StoryCopy brand={brand} size="sm">
          Primary actions cover rest, pressed, loading, and disabled states. Slot cards show rest, selected, and unavailable states without changing layout structure.
        </StoryCopy>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        <SurfaceCard style={{ gap: 16 }}>
          <Text as="strong" brand={brand} size="sm" tone="secondary">
            Button states
          </Text>
          <div style={{ display: "grid", gap: 12 }}>
            <Button brand={brand} size="Large" style={{ width: "100%" }}>
              Book slot
            </Button>
            <Button brand={brand} forceState="Hover/Pressed" size="Large" style={{ width: "100%" }}>
              Pressed
            </Button>
            <Button brand={brand} loading size="Large" style={{ width: "100%" }}>
              Loading
            </Button>
            <Button brand={brand} disabled size="Large" style={{ width: "100%" }}>
              Disabled
            </Button>
          </div>
        </SurfaceCard>

        <SurfaceCard style={{ gap: 16 }}>
          <Text as="strong" brand={brand} size="sm" tone="secondary">
            Slot states
          </Text>
          <div style={{ display: "grid", gap: 12 }}>
            <SlotCard
              brand={brand}
              onSelect={() => undefined}
              selected={false}
              slot={{ id: "rest-slot", time: "09:00", label: "Rest", helper: "Default card" }}
              tokens={tokens}
            />
            <SlotCard
              brand={brand}
              onSelect={() => undefined}
              selected
              slot={{ id: "selected-slot", time: "10:30", label: "Selected", helper: "Active option" }}
              tokens={tokens}
            />
            <SlotCard
              brand={brand}
              onSelect={() => undefined}
              selected={false}
              slot={{ id: "disabled-slot", time: "14:00", label: "Unavailable", helper: "Disabled state", disabled: true }}
              tokens={tokens}
            />
          </div>
        </SurfaceCard>
      </div>
    </StoryCard>
  );
}

function DocumentationPanel({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <StoryCard
      style={{
        display: "grid",
        gap: 24
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <StoryHeading brand={brand} size="lg">
          Design system notes
        </StoryHeading>
        <StoryCopy brand={brand} size="sm">
          The template keeps the page shell stable and swaps only the content state. That makes the pattern reusable for booking, profile, dashboard, and listing flows without redesigning the navigation or action rails each time.
        </StoryCopy>
      </div>

      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        <SurfaceCard>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Component breakdown
          </Text>
          <StoryCopy brand={brand} size="sm">
            `PageHeaderL2` handles the top navigation. `SegmentedControl` switches between service modes. `TextInput` captures the address or workshop query. `Text`, `Icon`, and `Badge` build the compact slot heading. `Button` covers primary, secondary, loading, and disabled actions.
          </StoryCopy>
          <StoryCopy brand={brand} size="sm">
            Custom wrappers are limited to slot cards, summary rows, and state cards, because those are page compositions rather than new design-system primitives.
          </StoryCopy>
        </SurfaceCard>

        <SurfaceCard>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Spacing and layout
          </Text>
          <StoryCopy brand={brand} size="sm">
            The screen uses a 360px mobile frame with token-based spacing values that resolve to an 8pt rhythm. Major blocks use 16px or 24px separation, while internal card padding stays at 16px for a predictable scan pattern.
          </StoryCopy>
          <StoryCopy brand={brand} size="sm">
            Controls keep a minimum 44px height through existing button and segmented-control sizing, which supports touch targets and keeps the footer usable on compact screens.
          </StoryCopy>
        </SurfaceCard>

        <SurfaceCard>
          <Text as="strong" brand={brand} size="md" tone="primary">
            Scaling guidance
          </Text>
          <StoryCopy brand={brand} size="sm">
            To scale this pattern to other screens, preserve the shell: status bar, page header, filter or mode rail, content stack, and sticky action footer. Only the middle content module changes shape.
          </StoryCopy>
          <StoryCopy brand={brand} size="sm">
            Accessibility is supported through high-contrast text tokens, semantic warning and error surfaces, and readable hierarchy that avoids relying on color alone.
          </StoryCopy>
        </SurfaceCard>
      </div>
    </StoryCard>
  );
}

export function ServiceBookingMobileKit({ brand = "Cars24" }: ServiceBookingMobileScreenProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard
        style={{
          display: "grid",
          gap: 32
        }}
      >
        <div style={{ display: "grid", gap: 12, maxWidth: 840 }}>
          <StoryBadge>Booking screen</StoryBadge>
          <StoryHeading brand={brand} size="xl">
            Mobile service booking template
          </StoryHeading>
          <StoryCopy brand={brand} size="md">
            This UI kit example shows a booking screen built with the existing design system, including default, loading, empty, and error states. The layout keeps the same shell across states so the pattern is reusable and easy to scale.
          </StoryCopy>
        </div>

        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            justifyItems: "center"
          }}
        >
          <ScreenPreview
            description="Primary booking flow with summary, token-driven spacing, and a selectable slot grid."
            label="Default state"
          >
            <ServiceBookingMobileScreen brand={brand} screenState="default" />
          </ScreenPreview>

          <ScreenPreview
            description="Loading placeholders keep the structure visible while the user waits for live availability."
            label="Loading state"
          >
            <ServiceBookingMobileScreen brand={brand} screenState="loading" />
          </ScreenPreview>

          <ScreenPreview
            description="Empty state keeps the same shell and offers a recovery path instead of leaving the screen blank."
            label="Empty state"
          >
            <ServiceBookingMobileScreen brand={brand} screenState="empty" />
          </ScreenPreview>

          <ScreenPreview
            description="Error state uses semantic color and a retry path without collapsing the page hierarchy."
            label="Error state"
          >
            <ServiceBookingMobileScreen brand={brand} screenState="error" />
          </ScreenPreview>
        </div>

        <InteractionStatesPanel brand={brand} />
        <DocumentationPanel brand={brand} />
      </StoryCard>
    </StoryPage>
  );
}

export const serviceBookingMobileScreenSourceCode = `import {
  Badge,
  Button,
  PageHeaderL2,
  SegmentedControl,
  Text,
  TextInput
} from "@turbo/web";

export function ServiceBookingMobileScreen() {
  return (
    <>
      <PageHeaderL2 brand="Cars24" title="Book service" variant="Light" />
      <SegmentedControl
        brand="Cars24"
        size="Large"
        type="Label"
        value="home"
        items={[
          { value: "home", label: "At home", ariaLabel: "Doorstep service" },
          { value: "workshop", label: "Workshop", ariaLabel: "Workshop visit" }
        ]}
      />
      <TextInput
        brand="Cars24"
        label="Pickup address"
        helperText="Pickup and drop are included."
        size="Small"
      />
      <Text brand="Cars24" as="strong" size="md">Time slots</Text>
      <Badge
        brand="Cars24"
        labelText="Next available"
        pillShape="No"
        priority="Low"
        showLeadingIcon={false}
        showTrailingIcon={false}
        size="Extra Small"
        type="Warning"
      />
      <Button brand="Cars24" size="Large">Book slot</Button>
    </>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: ServiceBookingMobileScreenProps) => <ServiceBookingMobileKit brand={brand} />,
  parameters: {
    layout: "fullscreen",
    docs: {
      source: {
        code: serviceBookingMobileScreenSourceCode
      }
    }
  }
};
