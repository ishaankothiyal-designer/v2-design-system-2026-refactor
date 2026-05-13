import { useState } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import type { AccordionGroupItem } from "@turbo/web";
import {
  Button,
  Divider,
  FaqWidget,
  Icon,
  Module,
  PageHeaderL2,
  ProgressStepper,
  Ratings,
  SectionHeader,
  Text,
  getRequiredThemeTokenValue
} from "@turbo/web";

const BRANDS: DisplayBrandId[] = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"];

type TokenProps = {
  brand: DisplayBrandId;
  primaryColor: string;
  subtleColor: string;
  borderColor: string;
  surfaceColor: string;
  fontFamily: string;
};

function useTokens(brand: DisplayBrandId): TokenProps {
  return {
    brand,
    primaryColor: String(getRequiredThemeTokenValue(brand, "color.brand.primary.500")),
    subtleColor: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    borderColor: String(getRequiredThemeTokenValue(brand, "color.border.default")),
    surfaceColor: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    fontFamily: String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
  };
}

const FAQ_ITEMS: AccordionGroupItem[] = [
  {
    id: "faq-1",
    title: "Is this the final price or can it change?",
    content:
      "The price shown is our best guaranteed offer based on your car's current market value. It is valid for 24 hours. After a physical inspection, if no undisclosed issues are found, the price remains the same.",
    leadingIcon: false,
    size: "sm"
  },
  {
    id: "faq-2",
    title: "What happens during the car inspection?",
    content:
      "Our certified inspector visits at your preferred time and location. They assess the exterior, interior, engine, and documents. The entire process takes 30–45 minutes and is completely free.",
    leadingIcon: false,
    size: "sm"
  },
  {
    id: "faq-3",
    title: "How long does it take to receive payment?",
    content:
      "Once you accept the price and the inspection is complete, payment is transferred directly to your bank account within 24 hours of completing the paperwork.",
    leadingIcon: false,
    size: "sm"
  },
  {
    id: "faq-4",
    title: "Can I negotiate the price?",
    content:
      "The price is calculated by our algorithm using real-time market data. You can speak to a sales consultant if you have concerns, but the offer already reflects the highest possible market value.",
    leadingIcon: false,
    size: "sm"
  },
  {
    id: "faq-5",
    title: "What documents do I need to sell my car?",
    content:
      "You will need your RC book, insurance copy, PUC certificate, service history (if available), and a government-issued ID. Our team will guide you through the complete documentation process.",
    leadingIcon: false,
    size: "sm"
  }
];

function PriceBreakdownRow({
  label,
  value,
  valueColor,
  bold,
  borderColor
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  borderColor: string;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        borderBottom: `1px solid ${borderColor}`,
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0"
      }}
    >
      <span style={{ fontSize: 14, fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span
        style={{
          color: valueColor,
          fontSize: bold ? 16 : 14,
          fontWeight: bold ? 700 : 500
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TestimonialCard({
  name,
  city,
  car,
  quote,
  rating,
  primaryColor,
  subtleColor,
  borderColor,
  brand
}: {
  name: string;
  city: string;
  car: string;
  quote: string;
  rating: number;
  primaryColor: string;
  subtleColor: string;
  borderColor: string;
  brand: DisplayBrandId;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        flexShrink: 0,
        padding: "18px 16px",
        width: 272
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            alignItems: "center",
            background: primaryColor,
            borderRadius: "50%",
            display: "flex",
            height: 40,
            justifyContent: "center",
            width: 40
          }}
        >
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
            {name[0]}
          </span>
        </div>
        <div>
          <Text brand={brand} as="strong" size="sm" tone="primary" style={{ fontWeight: 700 }}>
            {name}
          </Text>
          <Text brand={brand} size="xs" tone="secondary">
            {city} · {car}
          </Text>
        </div>
      </div>
      <Ratings brand={brand} rating={rating} size="Small" style={{ marginBottom: 10 }} />
      <Text brand={brand} size="sm" tone="secondary" style={{ lineHeight: 1.5 }}>
        "{quote}"
      </Text>
    </div>
  );
}

function StatTile({
  value,
  label,
  primaryColor,
  subtleColor,
  brand
}: {
  value: string;
  label: string;
  primaryColor: string;
  subtleColor: string;
  brand: DisplayBrandId;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: `${primaryColor}12`,
        borderRadius: 14,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: 4,
        padding: "14px 8px"
      }}
    >
      <Text
        brand={brand}
        as="strong"
        size="md"
        tone="primary"
        style={{ color: primaryColor, fontWeight: 800, textAlign: "center" }}
      >
        {value}
      </Text>
      <Text brand={brand} size="xs" tone="secondary" style={{ textAlign: "center" }}>
        {label}
      </Text>
    </div>
  );
}

function PriceSummaryScreen({ tokens }: { tokens: TokenProps }) {
  const { brand, primaryColor, subtleColor, borderColor, surfaceColor, fontFamily } = tokens;

  const greenColor = "#16a34a";
  const redLight = "#fef2f2";
  const redText = "#dc2626";

  return (
    <div style={{ fontFamily, maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {/* Header */}
      <PageHeaderL2
        brand={brand}
        title="Your Best Price"
        subtitle="Maruti Suzuki Swift VXI · MH12 AB 3456"
        showBackButton
        showTitle
        showSubtitle
        showAction1={false}
        showAction2={false}
        showAvatar={false}
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      />

      {/* ── PRICE HERO ── */}
      <div
        style={{
          background: `linear-gradient(145deg, ${primaryColor} 0%, ${primaryColor}cc 60%, ${primaryColor}99 100%)`,
          padding: "28px 20px 36px"
        }}
      >
        {/* Guaranteed badge */}
        <div
          style={{
            alignItems: "center",
            background: "rgba(255,255,255,0.18)",
            borderRadius: 999,
            display: "inline-flex",
            gap: 6,
            marginBottom: 16,
            padding: "5px 12px"
          }}
        >
          <Icon
            brand={brand}
            name="brand-shield-outline"
            decorative
            style={{ color: "#fff", fontSize: 14 }}
          />
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: 0.3 }}>
            Guaranteed Price
          </span>
        </div>

        {/* Main price */}
        <div style={{ marginBottom: 6 }}>
          <span
            style={{
              color: "#fff",
              display: "block",
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.1
            }}
          >
            ₹7,85,000
          </span>
        </div>
        <Text
          brand={brand}
          size="sm"
          style={{ color: "rgba(255,255,255,0.82)", marginBottom: 18 }}
        >
          Best market price for your car
        </Text>

        {/* Car detail chip row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {["2021 Model", "58,000 km", "Petrol", "Manual", "1st Owner"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.18)",
                borderRadius: 999,
                padding: "4px 12px"
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{tag}</span>
            </div>
          ))}
        </div>

        {/* Validity strip */}
        <div
          style={{
            alignItems: "center",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 12,
            display: "flex",
            gap: 8,
            padding: "10px 14px"
          }}
        >
          <Icon
            brand={brand}
            name="clock-time-timer-outline"
            decorative
            style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}
          />
          <Text brand={brand} size="xs" style={{ color: "rgba(255,255,255,0.9)", flex: 1 }}>
            Offer valid for{" "}
            <strong style={{ color: "#fff" }}>24 hours</strong> · Expires 13 May, 09:45 AM
          </Text>
        </div>
      </div>

      {/* ── PRICE BREAKDOWN ── */}
      <div style={{ background: surfaceColor, margin: "8px 0 0", padding: "20px 20px 8px" }}>
        <SectionHeader
          brand={brand}
          title="Price Breakdown"
          showSubtitle={false}
          showDescription={false}
          showTag={false}
          showAction={false}
          style={{ marginBottom: 4 }}
        />
        <div style={{ color: String(getRequiredThemeTokenValue(brand, "color.text.primary")) }}>
          <PriceBreakdownRow
            label="Base Market Value"
            value="₹7,20,000"
            borderColor={borderColor}
          />
          <PriceBreakdownRow
            label="Condition Bonus"
            value="+ ₹45,000"
            valueColor={greenColor}
            borderColor={borderColor}
          />
          <PriceBreakdownRow
            label="Market Premium"
            value="+ ₹25,000"
            valueColor={greenColor}
            borderColor={borderColor}
          />
          <PriceBreakdownRow
            label="RC Transfer Fee"
            value="− ₹5,000"
            valueColor={redText}
            borderColor={borderColor}
          />
          <div
            style={{
              alignItems: "center",
              background: `${primaryColor}0d`,
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              padding: "14px 16px"
            }}
          >
            <Text brand={brand} as="strong" size="md" tone="primary" style={{ fontWeight: 700 }}>
              Your Price
            </Text>
            <Text
              brand={brand}
              as="strong"
              size="lg"
              tone="primary"
              style={{ color: primaryColor, fontWeight: 800 }}
            >
              ₹7,85,000
            </Text>
          </div>
        </div>
      </div>

      {/* ── CONSULTANT STRIP ── */}
      <div
        style={{
          background: surfaceColor,
          borderTop: `1px solid ${borderColor}`,
          margin: "8px 0 0",
          padding: "16px 20px"
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: subtleColor,
            borderRadius: 16,
            display: "flex",
            gap: 12,
            padding: "14px 16px"
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#1e293b",
              borderRadius: "50%",
              display: "flex",
              flexShrink: 0,
              height: 48,
              justifyContent: "center",
              width: 48
            }}
          >
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>R</span>
          </div>
          <div style={{ flex: 1 }}>
            <Text brand={brand} as="strong" size="sm" tone="primary" style={{ fontWeight: 700 }}>
              Raj Kumar
            </Text>
            <Text brand={brand} size="xs" tone="secondary">
              Senior Sales Consultant
            </Text>
            <Text brand={brand} size="xs" style={{ color: primaryColor, fontWeight: 500 }}>
              +91 98765 43210
            </Text>
          </div>
          <Button
            brand={brand}
            styleVariant="Outline"
            shape="Pill"
            size="Small"
            style={{ flexShrink: 0 }}
          >
            Call Now
          </Button>
        </div>
      </div>

      {/* ── NEXT STEPS ── */}
      <div
        style={{
          background: surfaceColor,
          borderTop: `1px solid ${borderColor}`,
          margin: "8px 0 0",
          padding: "20px 20px"
        }}
      >
        <SectionHeader
          brand={brand}
          title="What Happens Next?"
          showSubtitle
          subtitle="Simple 3-step process"
          showDescription={false}
          showTag={false}
          showAction={false}
          style={{ marginBottom: 24 }}
        />
        <ProgressStepper
          brand={brand}
          steps={[
            { label: "Car Inspection", state: "Active" },
            { label: "Deal Closure", state: "Rest" },
            { label: "Car Handover", state: "Rest" }
          ]}
          style={{ marginBottom: 20 }}
        />
        {/* Step descriptions */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}>
          {[
            {
              icon: "zoom-in-search-plus-outline",
              desc: "Free inspection at your doorstep. 30–45 min."
            },
            {
              icon: "page-check-signed-document-outline",
              desc: "Paperwork & instant price confirmation."
            },
            {
              icon: "car-front-view",
              desc: "Payment in 24 hrs after handover."
            }
          ].map(({ icon, desc }) => (
            <div
              key={icon}
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                textAlign: "center"
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: `${primaryColor}15`,
                  borderRadius: "50%",
                  display: "flex",
                  height: 40,
                  justifyContent: "center",
                  width: 40
                }}
              >
                <Icon
                  brand={brand}
                  name={icon as never}
                  decorative
                  style={{ color: primaryColor, fontSize: 18 }}
                />
              </div>
              <Text brand={brand} size="xs" tone="secondary" style={{ lineHeight: 1.4 }}>
                {desc}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* ── SOCIAL PROOF ── */}
      <div
        style={{
          background: surfaceColor,
          borderTop: `1px solid ${borderColor}`,
          margin: "8px 0 0",
          padding: "20px 20px"
        }}
      >
        <SectionHeader
          brand={brand}
          title="Trusted by Lakhs of Sellers"
          showSubtitle={false}
          showDescription={false}
          showTag={false}
          showAction={false}
          style={{ marginBottom: 16 }}
        />

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <StatTile
            value="2L+"
            label="Cars sold"
            primaryColor={primaryColor}
            subtleColor={subtleColor}
            brand={brand}
          />
          <StatTile
            value="₹550Cr+"
            label="Paid to sellers"
            primaryColor={primaryColor}
            subtleColor={subtleColor}
            brand={brand}
          />
          <StatTile
            value="4.6★"
            label="Avg rating"
            primaryColor={primaryColor}
            subtleColor={subtleColor}
            brand={brand}
          />
        </div>

        {/* Testimonial horizontal scroll */}
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "none"
          }}
        >
          <TestimonialCard
            name="Priya Sharma"
            city="Delhi"
            car="Honda City 2019"
            quote="Got ₹1.2L more than what a local dealer offered. The whole process was smooth and they picked up the car from my home."
            rating={5}
            primaryColor={primaryColor}
            subtleColor={subtleColor}
            borderColor={borderColor}
            brand={brand}
          />
          <TestimonialCard
            name="Arjun Mehta"
            city="Pune"
            car="Hyundai Creta 2020"
            quote="Raj was super helpful. Got the payment the very next day. No hidden deductions — the final amount matched exactly."
            rating={5}
            primaryColor={primaryColor}
            subtleColor={subtleColor}
            borderColor={borderColor}
            brand={brand}
          />
          <TestimonialCard
            name="Sunita Verma"
            city="Bangalore"
            car="Maruti Swift 2021"
            quote="I was skeptical at first but the entire selling process was transparent. Best decision — no haggling, no stress."
            rating={4}
            primaryColor={primaryColor}
            subtleColor={subtleColor}
            borderColor={borderColor}
            brand={brand}
          />
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ margin: "8px 0 0" }}>
        <FaqWidget
          brand={brand}
          title="Frequently Asked Questions"
          subtitle=""
          description=""
          showHeader
          showTag={false}
          showHeaderAction={false}
          showTabSlider={false}
          showBottomButton={false}
          items={FAQ_ITEMS}
          style={{ maxWidth: "100%" }}
        />
      </div>

      {/* Bottom spacing for sticky CTA */}
      <div style={{ height: 100 }} />
    </div>
  );
}

export function App() {
  const [brand, setBrand] = useState<DisplayBrandId>("Cars24");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const tokens = useTokens(brand);
  const { primaryColor, surfaceColor, borderColor, fontFamily } = tokens;

  return (
    <div
      data-brand={brand}
      style={{
        background: "#f1f5f9",
        fontFamily,
        minHeight: "100vh",
        position: "relative"
      }}
    >
      <PriceSummaryScreen tokens={tokens} />

      {/* ── STICKY CTA ── */}
      <div
        style={{
          background: surfaceColor,
          borderTop: `1px solid ${borderColor}`,
          bottom: 0,
          left: 0,
          maxWidth: 480,
          padding: "12px 20px 20px",
          position: "fixed",
          right: 0,
          margin: "0 auto",
          zIndex: 20
        }}
      >
        <Button
          brand={brand}
          styleVariant="Solid"
          shape="Pill"
          size="Large"
          style={{ width: "100%", marginBottom: 10 }}
        >
          Accept this Price
        </Button>
        <div style={{ textAlign: "center" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: primaryColor,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              padding: 0
            }}
          >
            Schedule Free Inspection First
          </button>
        </div>
      </div>

      {/* ── FLOATING BRAND SWITCHER ── */}
      <div
        style={{
          bottom: 112,
          position: "fixed",
          right: 20,
          zIndex: 30
        }}
      >
        {switcherOpen && (
          <div
            style={{
              background: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 16,
              bottom: 52,
              boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
              overflow: "hidden",
              position: "absolute",
              right: 0,
              width: 168
            }}
          >
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => {
                  setBrand(b);
                  setSwitcherOpen(false);
                }}
                style={{
                  alignItems: "center",
                  background: b === brand ? `${primaryColor}12` : "none",
                  border: "none",
                  borderBottom: `1px solid ${borderColor}`,
                  cursor: "pointer",
                  display: "flex",
                  gap: 10,
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  width: "100%"
                }}
              >
                <span style={{ fontSize: 13, fontWeight: b === brand ? 600 : 400 }}>{b}</span>
                {b === brand && (
                  <Icon
                    brand={brand}
                    name="check-outline"
                    decorative
                    style={{ color: primaryColor, fontSize: 14 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setSwitcherOpen((v) => !v)}
          style={{
            alignItems: "center",
            background: primaryColor,
            border: "none",
            borderRadius: "50%",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            cursor: "pointer",
            display: "flex",
            height: 48,
            justifyContent: "center",
            width: 48
          }}
        >
          <Icon brand={brand} name="color-palette-outline" decorative style={{ color: "#fff", fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
}
