import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  BannerWidget,
  FabButton,
  FaqWidget,
  GridCard,
  GridWidget,
  Icon,
  ListCard,
  ListWidget,
  Module,
  ShowroomCard,
  StaticSliderFlexbox,
  StaticSliderCard,
  StaticSliderWidget,
  StoryWidget,
  Text,
  TopTabHeaderWidget,
  getRequiredThemeTokenValue
} from "@turbo/web";
import buyUsedCarImage from "./assets/buy-used-car-v1.png";
import inspectionVisualImage from "./assets/inspection-visual-v1.png";
import loanVisualImage from "./assets/loan-visual-v1.png";
import orbitBannerImage from "./assets/orbit-banner-v1.png";
import sellCarImage from "./assets/sell-car-v1.png";
import hondaLogoImage from "../../storybook/src/stories/assets/car-brand-logos/image/honda.png";
import hyundaiLogoImage from "../../storybook/src/stories/assets/car-brand-logos/image/hyundai.png";
import mahindraLogoImage from "../../storybook/src/stories/assets/car-brand-logos/image/mahindra.png";
import suzukiLogoImage from "../../storybook/src/stories/assets/car-brand-logos/image/suzuki.png";
import tataLogoImage from "../../storybook/src/stories/assets/car-brand-logos/image/tata.png";
import toyotaLogoImage from "../../storybook/src/stories/assets/car-brand-logos/image/toyota.png";

const BRANDS: DisplayBrandId[] = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"];
const brandOptions = [
  { label: "Maruti", logo: suzukiLogoImage },
  { label: "Hyundai", logo: hyundaiLogoImage },
  { label: "Tata", logo: tataLogoImage },
  { label: "Honda", logo: hondaLogoImage },
  { label: "Mahindra", logo: mahindraLogoImage },
  { label: "Toyota", logo: toyotaLogoImage }
];
const bodyTypeOptions = ["SUV", "Hatchback", "Sedan", "Automatic", "7-Seater", "EV"];
const collectionChips = ["SUV", "Budget", "Family", "Automatic", "Luxury"];

const faqItems = [
  {
    id: "faq-quality",
    title: "Are all cars quality checked?",
    content:
      "Cars24 listings are built around inspection clarity so buyers can understand condition, trust markers, and next steps before moving ahead.",
    leadingIcon: false,
    size: "sm" as const
  },
  {
    id: "faq-finance",
    title: "Can I explore EMI options early?",
    content:
      "Yes. Financing should feel like part of discovery, not a separate hidden step, so key finance entry points appear early in the homepage journey.",
    leadingIcon: false,
    size: "sm" as const
  },
  {
    id: "faq-service",
    title: "Can I compare multiple buying paths?",
    content:
      "The L1 page is designed as an entry system, so users can move into buying, loans, inspections, and support journeys from clearly grouped sections.",
    leadingIcon: false,
    size: "sm" as const
  }
];

const faqTabs = [
  { key: "buying", label: "Buying", leadingIcon: false, trailingIcon: false },
  { key: "finance", label: "Finance", leadingIcon: false, trailingIcon: false },
  { key: "quality", label: "Quality", leadingIcon: false, trailingIcon: false }
];

export function App() {
  const [brand, setBrand] = useState<DisplayBrandId>("Cars24");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [topTabCollapsed, setTopTabCollapsed] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState("all");
  const [activePage, setActivePage] = useState<"home" | "challan">("home");

  const shellStyles = useMemo(() => createShellStyles(brand), [brand]);

  useEffect(() => {
    const collapseThreshold = 24;

    const handleScroll = () => {
      setTopTabCollapsed(window.scrollY > collapseThreshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div data-brand={brand} style={shellStyles.page}>
      <div aria-hidden="true" style={shellStyles.backgroundGlowTop} />

      <main style={shellStyles.main}>
        {activePage === "home" ? (
          <>
            <div style={shellStyles.stickyTopTab}>
              <TopTabHeaderWidget
                brand={brand}
                collapsed={topTabCollapsed}
                country="India"
                headerProps={{
                  locationLabel: "Gurugram, NCR"
                }}
                onValueChange={setActiveTopTab}
                showBanner={false}
                value={activeTopTab}
              />
            </div>
            {activeTopTab === "buy" ? (
              <BuyPage brand={brand} />
            ) : (
              <>
                <BannerWidget
                  bannerType="Rotating"
                  brand={brand}
                  playLabel="Open offer"
                  primaryAction={{
                    label: "Explore now",
                    trailingIcon: <Icon decorative name="arrow-right-outline" />
                  }}
                  rotatingItems={buildEntrySlides(brand)}
                  rotatingShowCopy
                  showHeader={false}
                  showHeaderAction={false}
                  showTag={false}
                  video={false}
                />

                <OrbitBanner brand={brand} />

                <StaticSliderWidget
                  brand={brand}
                  description=""
                  headerActionLabel="Refresh"
                  showCta={false}
                  showHeaderAction
                  showTag={false}
                  showTabSlider={false}
                  subtitle=""
                  title="Personalized picks"
                >
                  <StaticSliderFlexbox
                    brand={brand}
                    cards={[
                      { title: "Buy used car", description: "", children: <ImageTile src={buyUsedCarImage} /> },
                      { title: "Sell your car", description: "", children: <ImageTile src={sellCarImage} /> },
                      { title: "Get car loan", description: "", children: <ImageTile src={loanVisualImage} /> },
                      { title: "Explore EVs", description: "", children: <ImageTile src={buyUsedCarImage} objectPosition="72% center" /> }
                    ]}
                    columnCount="1+"
                    row2={false}
                    scrollable
                    size="Medium"
                    tagLabel=""
                    title=""
                    type="Text Inside"
                    viewportPadding="12px"
                  />
                </StaticSliderWidget>

                <StaticSliderWidget
                  brand={brand}
                  description=""
                  headerActionLabel="View all"
                  showCta={false}
                  showHeaderAction
                  showTag={false}
                  showTabSlider={false}
                  subtitle=""
                  title="Check before you buy"
                >
                  <div style={shellStyles.sliderRail}>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="New car inspection" type="Text Inside">
                      <ImageTile src={inspectionVisualImage} />
                    </StaticSliderCard>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="Used car inspection" type="Text Inside">
                      <ImageTile src={inspectionVisualImage} objectPosition="58% center" />
                    </StaticSliderCard>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="Car service history" type="Text Inside">
                      <ImageTile src={inspectionVisualImage} objectPosition="right center" />
                    </StaticSliderCard>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="RTI / challan" type="Text Inside">
                      <ImageTile src={sellCarImage} objectPosition="60% center" />
                    </StaticSliderCard>
                  </div>
                </StaticSliderWidget>

                <LoanGridSection brand={brand} />

                <VehicleUtilityGrid brand={brand} onOpenChallan={() => setActivePage("challan")} />

                <ScrappageBanner brand={brand} />

                <StaticSliderWidget
                  brand={brand}
                  description=""
                  headerActionLabel="View all"
                  showCta={false}
                  showHeaderAction
                  showTag={false}
                  showTabSlider={false}
                  subtitle=""
                  title="Trending new cars"
                >
                  <div style={shellStyles.sliderRail}>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="Fortuner" type="Text Inside">
                      <ImageTile src={buyUsedCarImage} />
                    </StaticSliderCard>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="S-Class" type="Text Inside">
                      <ImageTile src={buyUsedCarImage} objectPosition="70% center" />
                    </StaticSliderCard>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="Scorpio-N" type="Text Inside">
                      <ImageTile src={buyUsedCarImage} objectPosition="40% center" />
                    </StaticSliderCard>
                    <StaticSliderCard brand={brand} columnCount="1+" description="" size="Medium" tagLabel="" title="Creta EV" type="Text Inside">
                      <ImageTile src={buyUsedCarImage} objectPosition="80% center" />
                    </StaticSliderCard>
                  </div>
                </StaticSliderWidget>

                <NearbyShowroomsSection brand={brand} />

                <LearnDrivingBanner brand={brand} />

                <StoriesSection brand={brand} />

                <CrashFreeBanner brand={brand} />

                <TrustMetricsSection brand={brand} />

                <FaqWidget
                  brand={brand}
                  items={faqItems}
                  primaryAction={{
                    label: "Talk to an expert",
                    trailingIcon: <Icon decorative name="arrow-right-outline" />
                  }}
                  showBottomButton={false}
                  showHeaderAction={false}
                  showTag={false}
                  showTabSlider
                  subtitle={undefined as never}
                  tabItems={faqTabs}
                  title="Questions users usually have before moving ahead"
                />
              </>
            )}
          </>
        ) : (
          <ChallanPage brand={brand} onBack={() => setActivePage("home")} />
        )}
      </main>

      <Footer brand={brand} shellStyles={shellStyles} />

      <BrandSwitcher
        brand={brand}
        brandMenuOpen={brandMenuOpen}
        brands={BRANDS}
        onSelect={(nextBrand) => {
          setBrand(nextBrand);
          setBrandMenuOpen(false);
        }}
        onToggle={() => setBrandMenuOpen((current) => !current)}
        shellStyles={shellStyles}
      />
    </div>
  );
}

function createShellStyles(brand: DisplayBrandId) {
  const pageBackground = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const textPrimary = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const primary100 = String(getRequiredThemeTokenValue(brand, "color.brand.primary.100"));
  const border = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const spacing3 = toPx(getRequiredThemeTokenValue(brand, "spacing.3"));
  const spacing4 = toPx(getRequiredThemeTokenValue(brand, "spacing.4"));
  const spacing5 = toPx(getRequiredThemeTokenValue(brand, "spacing.5"));
  const spacing6 = toPx(getRequiredThemeTokenValue(brand, "spacing.6"));
  const spacing8 = toPx(getRequiredThemeTokenValue(brand, "spacing.8"));
  const radiusPill = toPx(getRequiredThemeTokenValue(brand, "radius.pill"));
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;

  return {
    page: {
      background: pageBackground,
      color: textPrimary,
      fontFamily,
      minHeight: "100vh",
      position: "relative"
    } satisfies CSSProperties,
    backgroundGlowTop: {
      background: `radial-gradient(circle, ${primary100} 0%, transparent 70%)`,
      filter: "blur(12px)",
      height: 260,
      position: "absolute",
      right: -40,
      top: 40,
      width: 260
    } satisfies CSSProperties,
    main: {
      display: "grid",
      gap: spacing4,
      gridTemplateColumns: "minmax(0, 1fr)",
      justifyItems: "stretch",
      margin: "0 auto",
      maxWidth: 392,
      padding: `0 0 ${spacing8}`,
      position: "relative",
      width: "100%",
      zIndex: 1
    } satisfies CSSProperties,
    stickyTopTab: {
      position: "sticky",
      top: 0,
      width: "100%",
      zIndex: 10
    } satisfies CSSProperties,
    introBlock: {
      display: "grid",
      gap: "6px",
      padding: `0 ${spacing3}`
    } satisfies CSSProperties,
    bucketSection: {
      display: "grid",
      gap: spacing4
    } satisfies CSSProperties,
    bucketHeading: {
      display: "grid",
      gap: "8px"
    } satisfies CSSProperties,
    bucketGrid: {
      display: "grid",
      gap: spacing3,
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
    } satisfies CSSProperties,
    bucketItem: {
      borderBottom: `1px solid ${border}`,
      display: "grid",
      gap: "6px",
      minHeight: 96,
      paddingBottom: spacing3
    } satisfies CSSProperties,
    sliderRail: {
      display: "flex",
      gap: spacing3,
      overflowX: "auto",
      padding: `0 ${spacing3} 2px`
    } satisfies CSSProperties,
    footer: {
      borderTop: `1px solid ${border}`,
      display: "grid",
      gap: spacing4,
      marginTop: spacing6,
      padding: `${spacing5} ${spacing3} calc(${spacing8} + 72px)`,
      position: "relative",
      zIndex: 1
    } satisfies CSSProperties,
    footerInner: {
      display: "grid",
      gap: spacing4,
      gridTemplateColumns: "minmax(0, 1fr)",
      margin: "0 auto",
      maxWidth: 392,
      width: "100%"
    } satisfies CSSProperties,
    footerLinks: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px"
    } satisfies CSSProperties,
    switcherWrap: {
      bottom: 20,
      position: "fixed",
      right: 20,
      zIndex: 20
    } satisfies CSSProperties,
    switcherMenu: {
      background: "rgba(255, 255, 255, 0.96)",
      backdropFilter: "blur(16px)",
      border: `1px solid ${border}`,
      borderRadius: "20px",
      bottom: 64,
      boxShadow: "0 20px 42px rgba(15, 23, 42, 0.16)",
      display: "grid",
      gap: "10px",
      minWidth: 220,
      padding: spacing3,
      position: "absolute",
      right: 0
    } satisfies CSSProperties,
    switcherItem: {
      alignItems: "center",
      background: pageBackground,
      border: `1px solid ${border}`,
      borderRadius: radiusPill,
      color: textPrimary,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 14px",
      width: "100%"
    } satisfies CSSProperties,
    textSecondary
  };
}

function IllustrationTile({
  brand,
  tone
}: {
  brand: DisplayBrandId;
  tone: "warm" | "cool";
}) {
  const gradients =
    tone === "warm"
      ? ["#FFEFD6", "#F8C37B", "#EA7A1E"]
      : [
          String(getRequiredThemeTokenValue(brand, "color.brand.primary.100")),
          "#B0D9FF",
          "#2767F6"
        ];

  return (
    <div
      aria-hidden="true"
      style={{
        background: `linear-gradient(145deg, ${gradients[0]} 0%, ${gradients[1]} 56%, ${gradients[2]} 100%)`,
        borderRadius: 18,
        height: "100%",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.36)",
          borderRadius: 999,
          height: 12,
          left: 12,
          position: "absolute",
          top: 12,
          width: 58
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.24)",
          borderRadius: 20,
          bottom: 10,
          height: "58%",
          position: "absolute",
          right: 10,
          width: "54%"
        }}
      />
    </div>
  );
}

function VisualTile({ tone }: { tone: "purple" | "indigo" | "red" | "blue" | "green" | "mint" | "loanBlue" | "loanSky" | "cream" | "sand" | "gray" | "amber" | "silver" | "slate" }) {
  const palettes: Record<
    "purple" | "indigo" | "red" | "blue" | "green" | "mint" | "loanBlue" | "loanSky" | "cream" | "sand" | "gray" | "amber" | "silver" | "slate",
    [string, string, string]
  > = {
    purple: ["#5A22A0", "#6A2BD8", "#2A1248"],
    indigo: ["#4A1B9A", "#5E35D8", "#2D165B"],
    red: ["#7C1616", "#D92632", "#380B14"],
    blue: ["#123C8E", "#2B6EF3", "#0B1D4D"],
    green: ["#216C4D", "#2F8A63", "#113B2A"],
    mint: ["#1D7357", "#34B88A", "#0F3A2D"],
    loanBlue: ["#DCEBFF", "#BAD5FF", "#8DB6FF"],
    loanSky: ["#DDEFFF", "#BEE0FF", "#92C9FF"],
    cream: ["#FFF6E2", "#FDE7A6", "#F3C768"],
    sand: ["#F6ECDC", "#E8D2A7", "#D0B37C"],
    gray: ["#F1F4F9", "#D9E0EA", "#BDC8D7"],
    amber: ["#FFF2D8", "#FAD48C", "#E9AD32"],
    silver: ["#EEF1F4", "#D7DEE6", "#A9B4C0"],
    slate: ["#E8EDF3", "#CDD6E1", "#A3AFBF"]
  };
  const [a, b, c] = palettes[tone];
  return (
    <div
      aria-hidden="true"
      style={{
        background: `linear-gradient(145deg, ${a} 0%, ${b} 56%, ${c} 100%)`,
        borderRadius: 18,
        height: "100%",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.26)",
          borderRadius: 999,
          height: 12,
          left: 12,
          position: "absolute",
          top: 12,
          width: 58
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.22)",
          borderRadius: 20,
          bottom: 10,
          height: "58%",
          position: "absolute",
          right: 10,
          width: "54%"
        }}
      />
    </div>
  );
}

function ImageTile({
  src,
  objectPosition = "center"
}: {
  src: string;
  objectPosition?: CSSProperties["objectPosition"];
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius: 18,
        height: "100%",
        overflow: "hidden",
        width: "100%"
      }}
    >
      <img
        alt=""
        src={src}
        style={{
          display: "block",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          width: "100%"
        }}
      />
    </div>
  );
}

function BuyPage({ brand }: { brand: DisplayBrandId }) {
  return (
    <section style={{ display: "grid", gap: 20, paddingBottom: 32 }}>
      <GridWidget
        brand={brand}
        description=""
        headerActionLabel="View all"
        primaryAction={null}
        showHeaderAction
        showTag={false}
        subtitle=""
        title="Buy used cars"
      >
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", width: "100%" }}>
          {[
            { title: "All cars", subtitle: "Cars under every budget", image: buyUsedCarImage, position: "center" },
            { title: "Budget cars", subtitle: "EMI-friendly picks", image: buyUsedCarImage, position: "72% center" },
            { title: "Mid range cars", subtitle: "Daily drivers", image: buyUsedCarImage, position: "38% center" },
            { title: "Premium cars", subtitle: "Luxury & flagship picks", image: buyUsedCarImage, position: "80% center" }
          ].map((item) => (
            <GridCard
              key={item.title}
              brand={brand}
              columnCount="2 Column"
              description={item.subtitle}
              size="Medium"
              tagLabel=""
              title={item.title}
              type="Text Outside"
            >
              <ImageTile objectPosition={item.position} src={item.image} />
            </GridCard>
          ))}
        </div>
      </GridWidget>

      <HorizontalBadgeRail brand={brand} items={brandOptions} title="Explore by brand" />
      <BodyTypeRail brand={brand} />
      <PopularCollectionSection brand={brand} />
      <NearbySellerStrip brand={brand} />
      <FindRightCarSection brand={brand} />
      <NearbyShowroomsSection brand={brand} />
      <WhyChooseCars24Section brand={brand} />
      <HowItWorksBanner brand={brand} />
      <NeedHelpSection brand={brand} />
      <FaqWidget
        brand={brand}
        items={[
          {
            id: "buy-faq-1",
            title: "How many used cars are available in India?",
            content: "Inventory changes by city and demand, but the buy page is organized to help users scan by budget, body type, and collection quickly.",
            leadingIcon: false,
            size: "sm" as const
          },
          {
            id: "buy-faq-2",
            title: "How can I buy a car on CARS24?",
            content: "Browse collections, compare shortlisted options, inspect details, and move into financing or showroom visits from the same surface.",
            leadingIcon: false,
            size: "sm" as const
          },
          {
            id: "buy-faq-3",
            title: "How does CARS24 ensure quality?",
            content: "Trust indicators, verified listings, inspection-led flows, and showroom support all help users move ahead with more confidence.",
            leadingIcon: false,
            size: "sm" as const
          }
        ]}
        primaryAction={null}
        showBottomButton={false}
        showHeaderAction
        headerActionLabel="View all"
        showTag={false}
        showTabSlider={false}
        subtitle=""
        title="Frequently asked questions"
      />
    </section>
  );
}

function HorizontalBadgeRail({
  brand,
  title,
  items
}: {
  brand: DisplayBrandId;
  title: string;
  items: Array<{ label: string; logo: string }>;
}) {
  return (
    <StaticSliderWidget
      brand={brand}
      description=""
      showCta={false}
      showHeaderAction={false}
      showTag={false}
      showTabSlider={false}
      subtitle=""
      title={title}
    >
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 2 }}>
        {items.map((item) => (
          <div key={item.label} style={{ alignItems: "center", display: "grid", gap: 8, justifyItems: "center", minWidth: 58 }}>
            <div style={{ alignItems: "center", background: "#fff", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 999, display: "flex", height: 46, justifyContent: "center", overflow: "hidden", width: 46 }}>
              <img
                alt=""
                aria-hidden="true"
                src={item.logo}
                style={{
                  display: "block",
                  height: "68%",
                  objectFit: "contain",
                  width: "68%"
                }}
              />
            </div>
            <Text brand={brand} size="xs" tone="secondary">
              {item.label}
            </Text>
          </div>
        ))}
      </div>
    </StaticSliderWidget>
  );
}

function BodyTypeRail({ brand }: { brand: DisplayBrandId }) {
  return (
    <StaticSliderWidget
      brand={brand}
      description=""
      showCta={false}
      showHeaderAction={false}
      showTag={false}
      showTabSlider={false}
      subtitle=""
      title="Buy used cars by body type"
    >
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 2 }}>
        {bodyTypeOptions.map((item, index) => (
          <div key={item} style={{ display: "grid", gap: 8, minWidth: 92 }}>
            <div style={{ minHeight: 54 }}>
              <ImageTile objectPosition={index % 2 === 0 ? "center" : "70% center"} src={buyUsedCarImage} />
            </div>
            <Text as="strong" brand={brand} size="xs" tone="primary" style={{ textAlign: "center" }}>
              {item}
            </Text>
          </div>
        ))}
      </div>
    </StaticSliderWidget>
  );
}

function PopularCollectionSection({ brand }: { brand: DisplayBrandId }) {
  return (
    <StaticSliderWidget
      brand={brand}
      description=""
      headerActionLabel="View all"
      showCta={false}
      showHeaderAction
      showTag={false}
      showTabSlider={false}
      subtitle=""
      title="Popular collection"
    >
      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {collectionChips.map((item, index) => (
          <div
            key={item}
            style={{
              background: index === 0 ? "#101828" : "#fff",
              border: `1px solid ${index === 0 ? "#101828" : "rgba(15,23,42,0.08)"}`,
              borderRadius: 999,
              color: index === 0 ? "#fff" : "#111827",
              fontSize: 12,
              fontWeight: 700,
              padding: "8px 12px",
              whiteSpace: "nowrap"
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 2 }}>
        {[
          ["2019 Kia Seltos", "₹9.4L", "17K km"],
          ["2018 Hyundai Creta", "₹8.7L", "31K km"],
          ["2020 Nexon XZ+", "₹7.9L", "24K km"]
        ].map(([title, price, meta], index) => (
          <div key={title} style={{ border: "1px solid rgba(15,23,42,0.08)", borderRadius: 18, display: "grid", minWidth: 220, overflow: "hidden" }}>
            <div style={{ minHeight: 132 }}>
              <ImageTile objectPosition={index === 0 ? "center" : index === 1 ? "72% center" : "40% center"} src={buyUsedCarImage} />
            </div>
            <div style={{ display: "grid", gap: 4, padding: 12 }}>
              <Text as="strong" brand={brand} size="sm" tone="primary">
                {title}
              </Text>
              <Text brand={brand} size="xs" tone="secondary">
                {meta}
              </Text>
              <Text as="strong" brand={brand} size="sm" tone="primary" style={{ color: "#4d35f4" }}>
                {price}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </StaticSliderWidget>
  );
}

function NearbySellerStrip({ brand }: { brand: DisplayBrandId }) {
  return (
    <StaticSliderWidget
      brand={brand}
      description=""
      headerActionLabel="View all"
      showCta={false}
      showHeaderAction
      showTag={false}
      showTabSlider={false}
      subtitle=""
      title="Explore our car sellers"
    >
      <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
        {[
          ["Sarthak Arora", "5.5 km", "Dealer"],
          ["Verified seller", "Instant replies", "Profile"],
          ["Premium seller", "Great condition cars", "Top rated"]
        ].map(([title, subtitle, tag], index) => (
          <div key={title} style={{ border: "1px solid rgba(15,23,42,0.08)", borderRadius: 18, display: "grid", gap: 10, minWidth: 184, padding: 12 }}>
            <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
              <div style={{ background: "#eef2ff", borderRadius: 999, height: 44, overflow: "hidden", width: 44 }}>
                <ImageTile objectPosition={index === 0 ? "center" : "74% center"} src={index === 1 ? sellCarImage : buyUsedCarImage} />
              </div>
              <div style={{ display: "grid", gap: 2 }}>
                <Text as="strong" brand={brand} size="sm" tone="primary">
                  {title}
                </Text>
                <Text brand={brand} size="xs" tone="secondary">
                  {subtitle}
                </Text>
              </div>
            </div>
            <Text brand={brand} size="xs" tone="secondary">
              {tag}
            </Text>
          </div>
        ))}
      </div>
    </StaticSliderWidget>
  );
}

function FindRightCarSection({ brand }: { brand: DisplayBrandId }) {
  const cards = [
    { title: "First time buyer", image: buyUsedCarImage },
    { title: "Family car", image: buyUsedCarImage }
  ];
  return (
    <GridWidget
      brand={brand}
      description=""
      primaryAction={null}
      showHeaderAction={false}
      showTag={false}
      subtitle=""
      title="Find the right car for you"
    >
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        {cards.map((item, index) => (
          <GridCard
            key={item.title}
            brand={brand}
            columnCount="2 Column"
            description=""
            size="Medium"
            tagLabel=""
            title={item.title}
            type="Text Outside"
          >
            <div style={{ minHeight: 88 }}>
              <ImageTile objectPosition={index === 0 ? "center" : "72% center"} src={item.image} />
            </div>
          </GridCard>
        ))}
      </div>
    </GridWidget>
  );
}

function WhyChooseCars24Section({ brand }: { brand: DisplayBrandId }) {
  const benefits = [
    {
      title: "Best price and quality guarantee",
      subtitle: "Every step is designed to reduce guesswork and increase confidence.",
      image: buyUsedCarImage
    },
    {
      title: "Citywide delivery available",
      subtitle: "Move from search to shortlist to doorstep without losing momentum.",
      image: sellCarImage
    },
    {
      title: "Thorough quality checks",
      subtitle: "Inspection-first discovery keeps the page useful and trustworthy.",
      image: inspectionVisualImage
    }
  ];
  return (
    <ListWidget
      brand={brand}
      description=""
      showCta={false}
      showHeaderAction={false}
      showTag={false}
      subtitle=""
      title="Why choose CARS24?"
    >
      {benefits.map((item, index) => (
        <ListCard
          key={item.title}
          brand={brand}
          leftPartExpandButton={false}
          leftPartType="M - Image"
          media={
            <ImageTile
              objectPosition={index === 0 ? "center" : index === 1 ? "72% center" : "58% center"}
              src={item.image}
            />
          }
          showChevron={false}
          subtitle={item.subtitle}
          title={item.title}
          type="Med: 1T + 2ST"
        />
      ))}
    </ListWidget>
  );
}

function HowItWorksBanner({ brand }: { brand: DisplayBrandId }) {
  return (
    <StaticSliderWidget
      brand={brand}
      description=""
      headerActionLabel="View all"
      showCta={false}
      showHeaderAction
      showTag={false}
      showTabSlider={false}
      subtitle=""
      title="How CARS24 works?"
    >
      <div style={{ borderRadius: 20, overflow: "hidden" }}>
        <div style={{ minHeight: 200 }}>
          <ImageTile objectPosition="center" src={buyUsedCarImage} />
        </div>
        <div style={{ display: "grid", gap: 6, padding: 12 }}>
          <Text as="strong" brand={brand} size="sm" tone="primary">
            Search, shortlist, finance, and drive home
          </Text>
          <Text brand={brand} size="xs" tone="secondary">
            The buy flow is built to move from discovery to trust to action in a clean sequence.
          </Text>
        </div>
      </div>
    </StaticSliderWidget>
  );
}

function NeedHelpSection({ brand }: { brand: DisplayBrandId }) {
  const helpCards = [
    { title: "Talk to an expert", image: sellCarImage },
    { title: "Get EMI support", image: loanVisualImage }
  ];
  return (
    <GridWidget
      brand={brand}
      description=""
      headerActionLabel="View all"
      primaryAction={null}
      showHeaderAction
      showTag={false}
      subtitle=""
      title="Need help finding the right car?"
    >
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        {helpCards.map((item, index) => (
          <GridCard
            key={item.title}
            brand={brand}
            columnCount="2 Column"
            description=""
            size="Medium"
            tagLabel=""
            title={item.title}
            type="Text Outside"
          >
            <div style={{ minHeight: 88 }}>
              <ImageTile objectPosition={index === 0 ? "58% center" : "center"} src={item.image} />
            </div>
          </GridCard>
        ))}
      </div>
    </GridWidget>
  );
}

function OrbitBanner({ brand }: { brand: DisplayBrandId }) {
  return (
    <Module
      brand={brand}
      bodyMinHeight={0}
      description=""
      inverse
      primaryAction={null}
      showButtonGroup={false}
      showHeaderAction={false}
      showSectionHeader={true}
      showTag={false}
      subtitle=""
      title="Manage your car with ORBIT"
      footer={
        <button style={{ background: "#fff", border: "none", borderRadius: 16, color: "#181c2b", fontSize: 18, fontWeight: 700, padding: "14px 18px", textAlign: "left", width: "100%" }} type="button">
          Add a vehicle
        </button>
      }
    >
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ alignItems: "start", display: "flex", gap: 12, justifyContent: "space-between" }}>
          <Text brand={brand} size="sm" tone="inverse">
            FASTag, challans, insurance, reminders.
          </Text>
          <div aria-hidden="true" style={{ borderRadius: 24, height: 76, minWidth: 92, overflow: "hidden" }}>
            <img alt="" src={orbitBannerImage} style={{ display: "block", height: "100%", objectFit: "cover", width: "100%" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Recharge FASTag", "Pay challan", "Insurance", "Vehicle reminders"].map((item) => (
            <span key={item} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "8px 12px" }}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </Module>
  );
}

function LoanGridSection({ brand }: { brand: DisplayBrandId }) {
  return (
    <section style={{ display: "grid", gap: 16, padding: "0 12px" }}>
      <div style={{ alignItems: "start", display: "flex", gap: 12, justifyContent: "space-between" }}>
        <Text as="strong" brand={brand} size="xl" tone="primary">
          Get loans
        </Text>
        <Text as="span" brand={brand} size="md" tone="primary" style={{ color: "#4d35f4" }}>
          View all
        </Text>
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        {[
          { title: "Used car loan", tone: "loanBlue" as const },
          { title: "Loan against car", tone: "loanSky" as const },
          { title: "Personal loan", tone: "loanBlue" as const },
          { title: "Credit score", tone: "loanSky" as const }
        ].map((item) => (
          <div key={item.title} style={{ display: "grid", gap: 8 }}>
            <div style={{ minHeight: 136 }}>
              <ImageTile src={loanVisualImage} objectPosition={item.tone === "loanBlue" ? "center" : "68% center"} />
            </div>
            <Text as="strong" brand={brand} size="md" tone="primary">
              {item.title}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
}

function VehicleUtilityGrid({
  brand,
  onOpenChallan
}: {
  brand: DisplayBrandId;
  onOpenChallan: () => void;
}) {
  return (
    <Module
      brand={brand}
      bodyMinHeight={0}
      description=""
      inverse
      primaryAction={null}
      showButtonGroup={false}
      showHeaderAction
      showSectionHeader={true}
      showTag={false}
      subtitle=""
      title="Vehicle management"
      headerActionLabel="Add vehicle"
    >
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", justifyItems: "start" }}>
        {[
          { title: "Pay challan", description: "Due today", iconName: "receipt-bill-purchase-invoice-outline" },
          { title: "Recharge FASTag", description: "", iconName: "thunder-zap-flash-outline" },
          { title: "Insurance", description: "", iconName: "car-insurance-outline" },
          { title: "Roadside help", description: "", iconName: "support-outline" },
          { title: "Warranty", description: "", iconName: "shield-badge-check-outline" },
          { title: "Cash against car", description: "", iconName: "currency-rupees-outline" }
        ].map((item) => (
          <GridCard
            key={item.title}
            brand={brand}
            columnCount="2 Column"
            description={item.description}
            iconName={item.iconName as never}
            onClick={item.title === "Pay challan" ? onOpenChallan : undefined}
            role={item.title === "Pay challan" ? "button" : undefined}
            size="Medium"
            style={{
              background: "transparent",
              cursor: item.title === "Pay challan" ? "pointer" : "default"
            }}
            tagLabel=""
            title={item.title}
            type="With Icon"
          />
        ))}
      </div>
    </Module>
  );
}

function ScrappageBanner({ brand }: { brand: DisplayBrandId }) {
  return (
    <section style={{ background: "#151c2f", borderRadius: 24, color: "#fff", display: "grid", gap: 12, margin: "0 12px", overflow: "hidden", padding: "22px 18px" }}>
      <Text as="strong" brand={brand} size="xl" tone="inverse">
        Scrap & earn
      </Text>
      <Text brand={brand} size="sm" tone="inverse">
        Avoid fines. Prevent seizure. Dispose safely.
      </Text>
      <div style={{ display: "flex", gap: 10 }}>
        <span style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 12px" }}>Delhi NCR</span>
        <span style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 12px" }}>10+ year vehicles</span>
      </div>
    </section>
  );
}

function NearbyShowroomsSection({ brand }: { brand: DisplayBrandId }) {
  return (
    <Module
      brand={brand}
      bodyMinHeight={0}
      description=""
      primaryAction={null}
      showButtonGroup={false}
      showHeaderAction
      showTag={false}
      subtitle=""
      title="Nearby showrooms"
      headerActionLabel="View all"
    >
      <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
        <ShowroomCard
          brand={brand}
          directionsLabel="4.5 km away"
          inventoryLabel="135+ Cars"
          primaryActionLabel="View showroom"
          secondaryActionLabel="Call now"
          title="Piyush Mahendra Mall"
        />
        <ShowroomCard
          brand={brand}
          directionsLabel="6.1 km away"
          inventoryLabel="94+ Cars"
          primaryActionLabel="View showroom"
          rating={4.6}
          reviewCount="(148)"
          secondaryActionLabel="Call now"
          title="Gurgaon Auto Hub"
        />
      </div>
    </Module>
  );
}

function LearnDrivingBanner({ brand }: { brand: DisplayBrandId }) {
  return (
    <section style={{ background: "#fff", border: "1px solid rgba(15,23,42,0.08)", borderRadius: 24, display: "grid", gap: 14, margin: "0 12px", overflow: "hidden" }}>
      <div style={{ display: "grid", gap: 6, padding: "18px 18px 0" }}>
        <Text as="strong" brand={brand} size="lg" tone="primary">
          Learn to drive confidently
        </Text>
        <Text brand={brand} size="sm" tone="secondary">
          95% satisfaction rate. Flexible lessons. No platform fee.
        </Text>
      </div>
      <div style={{ background: "linear-gradient(135deg, #e9f2ff 0%, #d5e3ff 100%)", height: 148 }} />
    </section>
  );
}

function StoriesSection({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryWidget
      brand={brand}
      description=""
      headerActionLabel="View all"
      showCta={false}
      showHeaderAction
      showTag={false}
      subtitle=""
      title="Customer stories"
    />
  );
}

function CrashFreeBanner({ brand }: { brand: DisplayBrandId }) {
  return (
    <section style={{ background: "linear-gradient(145deg, #5c53ff 0%, #4e36f4 100%)", borderRadius: 24, color: "#fff", display: "grid", gap: 10, margin: "0 12px", padding: "22px 18px" }}>
      <Text brand={brand} size="sm" tone="inverse">
        Crashfree India
      </Text>
      <Text as="strong" brand={brand} size="xl" tone="inverse">
        Let’s make India crash free
      </Text>
      <Text brand={brand} size="sm" tone="inverse">
        Safety stories, awareness campaigns, and road-first habits.
      </Text>
    </section>
  );
}

function TrustMetricsSection({ brand }: { brand: DisplayBrandId }) {
  return (
    <section style={{ display: "grid", gap: 18, padding: "8px 12px 0" }}>
      <div style={{ display: "grid", gap: 8, justifyItems: "center", padding: "8px 0" }}>
        <Text as="strong" brand={brand} size="xl" tone="primary">
          4.6
        </Text>
        <Text brand={brand} size="sm" tone="secondary">
          42K+ ratings
        </Text>
        <Text as="strong" brand={brand} size="lg" tone="primary" style={{ textAlign: "center" }}>
          Trusted by users in 10,000+ pin codes across India
        </Text>
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          ["1Cr+", "Inspections"],
          ["10+", "Years"],
          ["200+", "Cities"]
        ].map(([value, label]) => (
          <div key={value} style={{ display: "grid", gap: 6, textAlign: "center" }}>
            <Text as="strong" brand={brand} size="lg" tone="primary">
              {value}
            </Text>
            <Text brand={brand} size="sm" tone="secondary">
              {label}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChallanPage({
  brand,
  onBack
}: {
  brand: DisplayBrandId;
  onBack: () => void;
}) {
  return (
    <section style={{ display: "grid", gap: 20, padding: "20px 12px 96px" }}>
      <button
        onClick={onBack}
        style={{
          alignItems: "center",
          background: "transparent",
          border: "none",
          color: "#4d35f4",
          cursor: "pointer",
          display: "inline-flex",
          fontSize: 16,
          fontWeight: 700,
          gap: 8,
          padding: 0
        }}
        type="button"
      >
        <Icon decorative name="arrow-left-circle-outline" />
        Back
      </button>

      <div style={{ display: "grid", gap: 8 }}>
        <Text as="strong" brand={brand} size="xl" tone="primary">
          Pay challan
        </Text>
        <Text brand={brand} size="sm" tone="secondary">
          Find pending challans by vehicle number and clear them in a few taps.
        </Text>
      </div>

      <Module
        brand={brand}
        bodyMinHeight={0}
        description=""
        primaryAction={{
          label: "Check challan",
          trailingIcon: <Icon decorative name="arrow-right-outline" />
        }}
        showButtonGroup
        showHeaderAction={false}
        showTag={false}
        subtitle=""
        title="Vehicle lookup"
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={inputShellStyle()}>
            <span>HR 26 DK 8337</span>
          </div>
          <div style={inputShellStyle()}>
            <span>Registered owner mobile</span>
          </div>
        </div>
      </Module>

      <Module
        brand={brand}
        bodyMinHeight={0}
        description=""
        primaryAction={null}
        showButtonGroup={false}
        showHeaderAction={false}
        showTag={false}
        subtitle=""
        title="Pending challans"
      >
        <div style={{ display: "grid", gap: 12 }}>
          {[
            ["DL Traffic Police", "Speed violation", "₹1,000"],
            ["Gurugram Traffic", "No parking", "₹500"]
          ].map(([authority, reason, amount]) => (
            <div key={`${authority}-${reason}`} style={{ border: "1px solid rgba(15,23,42,0.08)", borderRadius: 18, display: "grid", gap: 6, padding: "14px 16px" }}>
              <Text brand={brand} size="xs" tone="secondary">
                {authority}
              </Text>
              <Text as="strong" brand={brand} size="md" tone="primary">
                {reason}
              </Text>
              <Text brand={brand} size="sm" tone="secondary">
                Amount due {amount}
              </Text>
            </div>
          ))}
        </div>
      </Module>
    </section>
  );
}

function inputShellStyle(): CSSProperties {
  return {
    alignItems: "center",
    background: "#fff",
    border: "1px solid rgba(15,23,42,0.12)",
    borderRadius: 16,
    display: "flex",
    minHeight: 54,
    padding: "0 16px"
  };
}

function Footer({
  brand,
  shellStyles
}: {
  brand: DisplayBrandId;
  shellStyles: ReturnType<typeof createShellStyles>;
}) {
  return (
    <footer style={shellStyles.footer}>
      <div style={shellStyles.footerInner}>
        <div style={{ display: "grid", gap: 12 }}>
          <Text as="strong" brand={brand} size="lg" tone="primary">
            Cars24 entry points, made simpler
          </Text>
          <Text brand={brand} size="sm" tone="secondary">
            The homepage should help users choose a journey quickly, understand what Cars24 offers, and move ahead without noise.
          </Text>
        </div>
        <div style={shellStyles.footerLinks}>
          {["Help", "Buying guide", "Loans", "Inspection", "Support"].map((item) => (
            <Text key={item} as="span" brand={brand} size="sm" tone="secondary">
              {item}
            </Text>
          ))}
        </div>
      </div>
    </footer>
  );
}

function BrandSwitcher({
  brand,
  brandMenuOpen,
  brands,
  onSelect,
  onToggle,
  shellStyles
}: {
  brand: DisplayBrandId;
  brandMenuOpen: boolean;
  brands: DisplayBrandId[];
  onSelect: (brand: DisplayBrandId) => void;
  onToggle: () => void;
  shellStyles: ReturnType<typeof createShellStyles>;
}) {
  return (
    <div style={shellStyles.switcherWrap}>
      {brandMenuOpen ? (
        <div style={shellStyles.switcherMenu}>
          <Text as="strong" brand={brand} size="sm" tone="primary">
            Switch brand preview
          </Text>
          {brands.map((item) => (
            <button key={item} onClick={() => onSelect(item)} style={shellStyles.switcherItem} type="button">
              <span>{item}</span>
              <span>{item === brand ? "Active" : "Preview"}</span>
            </button>
          ))}
        </div>
      ) : null}
      <FabButton
        aria-label="Open brand switcher"
        brand={brand}
        icon={<Icon decorative name="sparkle-filled" />}
        onClick={onToggle}
        showTag={false}
      >
        Switch brand preview
      </FabButton>
    </div>
  );
}

function buildEntrySlides(brand: DisplayBrandId) {
  return [
    {
      id: "entry-1",
      title: "Buy, sell, finance",
      description: "Jump into the journey you already came for.",
      media: <ImageTile src={buyUsedCarImage} />
    },
    {
      id: "entry-2",
      title: "Check before you buy",
      description: "Inspection, history, and pricing in one flow.",
      media: <ImageTile src={inspectionVisualImage} />
    },
    {
      id: "entry-3",
      title: "Manage your vehicle",
      description: "FASTag, challans, insurance, and support.",
      media: <ImageTile src={orbitBannerImage} />
    }
  ];
}

function OfferMedia({
  brand,
  tone
}: {
  brand: DisplayBrandId;
  tone: "sunrise" | "sky" | "graphite";
}) {
  const palette =
    tone === "sunrise"
      ? ["#FFF2D8", "#F9B45B", "#E56E18"]
      : tone === "sky"
        ? ["#E7F3FF", "#7FC4FF", "#2E6FF2"]
        : [
            String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
            "#94A3B8",
            "#334155"
          ];

  return (
    <div
      aria-hidden="true"
      style={{
        background: `linear-gradient(150deg, ${palette[0]} 0%, ${palette[1]} 58%, ${palette[2]} 100%)`,
        height: "100%",
        position: "relative",
        width: "100%"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.3)",
          borderRadius: 999,
          height: 10,
          left: 16,
          position: "absolute",
          top: 16,
          width: 64
        }}
      />
      <div
        style={{
          background: "rgba(255,255,255,0.28)",
          borderRadius: 24,
          bottom: 12,
          height: "52%",
          position: "absolute",
          right: 14,
          width: "50%"
        }}
      />
    </div>
  );
}

function toPx(value: string | number) {
  return typeof value === "number" ? `${value}px` : value;
}
