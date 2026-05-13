import { useState, type CSSProperties } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  BottomNav,
  Button,
  CheckboxLabel,
  ChoiceChip,
  Divider,
  Dropdown,
  FabButton,
  Icon,
  Module,
  PageHeaderL2,
  Ratings,
  SearchBar,
  Tag,
  Text,
  TextInput,
  getRequiredThemeTokenValue
} from "@turbo/web";

type Screen = "home" | "sitter-list" | "sitter-profile" | "my-dogs" | "dog-detail" | "create-dog";
type OverlayScreen = "service-select" | "date-picker" | null;
type ServiceKey = "boarding" | "daycare" | "walking";

const BRANDS: DisplayBrandId[] = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const JULY_2025: (number | null)[] = [
  null, 1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31
];

/* ─── Shared token props ─── */
interface TokenProps {
  brand: DisplayBrandId;
  primaryColor: string;
  subtleColor: string;
  borderColor: string;
  surfaceColor: string;
}

/* ─── Shared: Section Header ─── */
function SectionHeader({
  brand,
  title,
  action,
  onAction,
  primaryColor
}: {
  brand: DisplayBrandId;
  title: string;
  action?: string;
  onAction?: () => void;
  primaryColor: string;
}) {
  return (
    <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", padding: "0 16px 8px" }}>
      <Text brand={brand} as="strong" size="md" tone="primary" style={{ fontWeight: 700 }}>
        {title}
      </Text>
      {action && (
        <button
          type="button"
          onClick={onAction}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <Text brand={brand} size="sm" tone="primary" style={{ color: primaryColor, fontWeight: 500 }}>
            {action}
          </Text>
        </button>
      )}
    </div>
  );
}

/* ─── App root ─── */
export function App() {
  const [brand, setBrand] = useState<DisplayBrandId>("Cars24");
  const [screen, setScreen] = useState<Screen>("home");
  const [overlay, setOverlay] = useState<OverlayScreen>(null);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [vaccinationChecked, setVaccinationChecked] = useState(false);
  const [serviceSelected, setServiceSelected] = useState<ServiceKey>("boarding");
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

  const primaryColor = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const surfaceColor = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const subtleColor = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const borderColor = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;

  const shell: CSSProperties = {
    background: subtleColor,
    display: "flex",
    fontFamily,
    justifyContent: "center",
    minHeight: "100vh",
    padding: "24px 16px 40px"
  };

  const phone: CSSProperties = {
    background: surfaceColor,
    borderRadius: 32,
    boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
    display: "flex",
    flexDirection: "column",
    maxWidth: 390,
    minHeight: 844,
    overflow: "hidden",
    position: "relative",
    width: "100%"
  };

  const scrollArea: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 80
  };

  const bottomNavItems = [
    { value: "home", label: "Home", icon: <Icon name="home-round-door-outline" decorative /> },
    { value: "sitter-list", label: "Search", icon: <Icon name="zoom-in-search-plus-outline" decorative /> },
    { value: "my-dogs", label: "My Dogs", icon: <Icon name="people-circle-user-circle-avatar-profile-outline" decorative /> },
    { value: "create-dog", label: "Create", icon: <Icon name="circle-plus-add-filled" decorative /> }
  ];

  const sharedProps = { brand, primaryColor, subtleColor, borderColor, surfaceColor };

  return (
    <div data-brand={brand} style={shell}>
      <div style={phone}>
        <div style={scrollArea}>
          {screen === "home" && (
            <HomeScreen
              {...sharedProps}
              onSearch={() => setOverlay("service-select")}
              onSitterClick={() => setScreen("sitter-profile")}
              onSitterListClick={() => setScreen("sitter-list")}
            />
          )}
          {screen === "sitter-list" && (
            <SitterListScreen
              {...sharedProps}
              onBack={() => setScreen("home")}
              onSitterClick={() => setScreen("sitter-profile")}
              onFilterDates={() => setOverlay("date-picker")}
            />
          )}
          {screen === "sitter-profile" && (
            <SitterProfileScreen
              {...sharedProps}
              fontFamily={fontFamily}
              onBack={() => setScreen("sitter-list")}
            />
          )}
          {screen === "my-dogs" && (
            <MyDogsScreen
              {...sharedProps}
              onDogClick={() => setScreen("dog-detail")}
              onAddDog={() => setScreen("create-dog")}
            />
          )}
          {screen === "dog-detail" && (
            <DogDetailScreen {...sharedProps} onBack={() => setScreen("my-dogs")} />
          )}
          {screen === "create-dog" && (
            <CreateDogScreen
              {...sharedProps}
              fontFamily={fontFamily}
              vaccinationChecked={vaccinationChecked}
              onVaccinationChange={setVaccinationChecked}
              onClose={() => setScreen("my-dogs")}
            />
          )}
        </div>

        <div style={{ bottom: 0, left: 0, position: "absolute", right: 0 }}>
          <BottomNav
            brand={brand}
            items={bottomNavItems}
            value={screen}
            onValueChange={(v) => setScreen(v as Screen)}
          />
        </div>

        {overlay === "service-select" && (
          <ServiceSelectScreen
            {...sharedProps}
            fontFamily={fontFamily}
            serviceSelected={serviceSelected}
            onServiceChange={setServiceSelected}
            onClose={() => setOverlay(null)}
            onSelectDates={() => setOverlay("date-picker")}
            onSearch={() => { setOverlay(null); setScreen("sitter-list"); }}
          />
        )}
        {overlay === "date-picker" && (
          <DatePickerScreen
            {...sharedProps}
            fontFamily={fontFamily}
            selectedDates={selectedDates}
            onToggleDate={(d) =>
              setSelectedDates((prev) =>
                prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
              )
            }
            onClear={() => setSelectedDates([])}
            onConfirm={() => { setOverlay(null); setScreen("sitter-list"); }}
            onClose={() => setOverlay(null)}
          />
        )}
      </div>

      {/* Floating brand switcher */}
      <div style={{ bottom: 100, position: "fixed", right: 20, zIndex: 999 }}>
        {brandMenuOpen && (
          <div style={{ background: surfaceColor, border: `1px solid ${borderColor}`, borderRadius: 16, bottom: 64, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", minWidth: 180, padding: 12, position: "absolute", right: 0 }}>
            <Text brand={brand} as="strong" size="xs" tone="secondary">Switch brand preview</Text>
            {BRANDS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => { setBrand(b); setBrandMenuOpen(false); }}
                style={{ alignItems: "center", background: b === brand ? subtleColor : "transparent", border: "none", borderRadius: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", marginTop: 4, padding: "8px 12px", width: "100%" }}
              >
                <Text brand={brand} as="span" size="sm" tone="primary">{b}</Text>
                {b === brand && <Icon name="checkmark-1-filled" decorative style={{ color: primaryColor }} />}
              </button>
            ))}
          </div>
        )}
        <FabButton
          brand={brand}
          icon={<Icon name="sparkle-filled" decorative />}
          onClick={() => setBrandMenuOpen((o) => !o)}
          showTag={false}
          aria-label="Switch brand"
        >
          Brand
        </FabButton>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Screen 0 – Home (L1)
   Compound header · service bucket grid ·
   top sitters horizontal scroll · trust strip
════════════════════════════════════════════ */

const HOME_SERVICES = [
  { key: "boarding" as const, icon: "moon-dark-mode-night-outline" as const, label: "Boarding", sublabel: "Overnight stay" },
  { key: "daycare" as const, icon: "sun-light-mode-day-today-outline" as const, label: "Day care", sublabel: "While you work" },
  { key: "walking" as const, icon: "location-outline" as const, label: "Walking", sublabel: "Daily walks" }
];

const FEATURED_SITTERS = [
  { name: "Penelope", rating: 4.8, price: "€18", distance: "1.2 km" },
  { name: "Cintia", rating: 4.7, price: "€15", distance: "2.8 km" },
  { name: "Margaux", rating: 4.6, price: "€12", distance: "4.1 km" }
];

function HomeScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  onSearch,
  onSitterClick,
  onSitterListClick
}: TokenProps & { onSearch: () => void; onSitterClick: () => void; onSitterListClick: () => void }) {
  return (
    <div>
      {/* ── Compound header: location + menu + avatar ── */}
      <div style={{ alignItems: "center", display: "flex", gap: 12, padding: "16px 16px 10px" }}>
        <Icon name="location-outline" decorative style={{ color: primaryColor, flexShrink: 0, fontSize: 18 }} />
        <div style={{ flex: 1 }}>
          <Text brand={brand} as="strong" size="sm" tone="primary" style={{ display: "block", fontWeight: 700, lineHeight: 1.3 }}>
            Paris, France
          </Text>
          <Text brand={brand} size="xs" tone="secondary" style={{ lineHeight: 1.3 }}>
            Find sitters near you
          </Text>
        </div>
        <button
          type="button"
          style={{ alignItems: "center", background: subtleColor, border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", flexShrink: 0, height: 36, justifyContent: "center", padding: 0, width: 36 }}
        >
          <Icon name="list-filled" decorative style={{ color: primaryColor, fontSize: 18 }} />
        </button>
        <div style={{ alignItems: "center", background: primaryColor, borderRadius: "50%", cursor: "pointer", display: "flex", flexShrink: 0, height: 36, justifyContent: "center", width: 36 }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>M</span>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ padding: "0 16px 4px" }}>
        <SearchBar brand={brand} placeholder="Postcode or city" size="Large" onClick={onSearch} readOnly />
      </div>

      {/* ── Service bucket: 3-column circular icon tiles ── */}
      <div style={{ padding: "20px 0 4px" }}>
        <SectionHeader brand={brand} title="What are you looking for?" primaryColor={primaryColor} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: "0 8px" }}>
          {HOME_SERVICES.map((tile) => (
            <button
              key={tile.key}
              type="button"
              onClick={onSearch}
              style={{ alignItems: "center", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 6, padding: "10px 8px" }}
            >
              <div style={{ alignItems: "center", background: `${primaryColor}18`, borderRadius: "50%", display: "flex", height: 58, justifyContent: "center", width: 58 }}>
                <Icon name={tile.icon} decorative style={{ color: primaryColor, fontSize: 26 }} />
              </div>
              <Text brand={brand} as="strong" size="xs" tone="primary" style={{ fontWeight: 600, textAlign: "center" }}>
                {tile.label}
              </Text>
              <Text brand={brand} size="xs" tone="secondary" style={{ marginTop: -4, textAlign: "center" }}>
                {tile.sublabel}
              </Text>
            </button>
          ))}
        </div>
      </div>

      <Divider brand={brand} style={{ margin: "8px 0" }} />

      {/* ── Top sitters horizontal scroll ── */}
      <div style={{ padding: "12px 0 4px" }}>
        <SectionHeader brand={brand} title="Top sitters near you" action="View all" onAction={onSitterListClick} primaryColor={primaryColor} />
        <div style={{ overflowX: "auto", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", gap: 12, padding: "4px 16px 8px" }}>
            {FEATURED_SITTERS.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={onSitterClick}
                style={{ background: surfaceColor, border: `1px solid ${borderColor}`, borderRadius: 18, cursor: "pointer", flexShrink: 0, padding: "14px 14px 12px", textAlign: "left", width: 150 }}
              >
                <div style={{ alignItems: "center", background: `${primaryColor}18`, borderRadius: "50%", display: "flex", height: 52, justifyContent: "center", marginBottom: 10, width: 52 }}>
                  <Icon name="people-circle-user-circle-avatar-profile-outline" decorative style={{ color: primaryColor, fontSize: 28 }} />
                </div>
                <Text brand={brand} as="strong" size="sm" tone="primary" style={{ display: "block", fontWeight: 700 }}>
                  {s.name}
                </Text>
                <Ratings brand={brand} rating={s.rating} size="Small" labelFormatter={(v) => `${v}`} />
                <div style={{ alignItems: "baseline", display: "flex", gap: 3, marginTop: 6 }}>
                  <Text brand={brand} as="strong" size="sm" tone="primary" style={{ color: primaryColor, fontWeight: 700 }}>
                    {s.price}
                  </Text>
                  <Text brand={brand} size="xs" tone="secondary">/night</Text>
                </div>
                <Text brand={brand} size="xs" tone="secondary" style={{ marginTop: 2 }}>
                  {s.distance}
                </Text>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Divider brand={brand} style={{ margin: "8px 0" }} />

      {/* ── Recent bookings ── */}
      <div style={{ padding: "12px 0 4px" }}>
        <SectionHeader brand={brand} title="Recent bookings" primaryColor={primaryColor} />
        <div style={{ border: `1px solid ${borderColor}`, borderRadius: 18, margin: "0 16px", padding: "14px 14px 12px" }}>
          <div style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ alignItems: "center", background: `${primaryColor}18`, borderRadius: "50%", display: "flex", flexShrink: 0, height: 46, justifyContent: "center", width: 46 }}>
              <Icon name="people-circle-user-circle-avatar-profile-outline" decorative style={{ color: primaryColor, fontSize: 26 }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text brand={brand} as="strong" size="sm" tone="primary" style={{ display: "block", fontWeight: 600 }}>
                Amélie da Silva
              </Text>
              <Text brand={brand} size="xs" tone="secondary">Wed 21 March · Boarding</Text>
            </div>
            <Tag brand={brand} label="Completed" color="Green" size="Small" />
          </div>
          <Button brand={brand} styleVariant="Solid" shape="Pill" size="Large" style={{ width: "100%" }}>
            Book again
          </Button>
        </div>
      </div>

      <Divider brand={brand} style={{ margin: "20px 0 0" }} />

      {/* ── Trust strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: "16px 8px 24px" }}>
        {[
          { value: "4.8 ★", label: "Avg. rating" },
          { value: "2,400+", label: "Sitters" },
          { value: "12", label: "Cities" }
        ].map((t) => (
          <div key={t.label} style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 2 }}>
            <Text brand={brand} as="strong" size="md" tone="primary" style={{ color: primaryColor, fontWeight: 700 }}>
              {t.value}
            </Text>
            <Text brand={brand} size="xs" tone="secondary" style={{ textAlign: "center" }}>
              {t.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Screen 1 – Sitter List (L2)
   Result count · photo zone with badge + heart ·
   price right-aligned prominent · 3 sitters
════════════════════════════════════════════ */

const SITTERS = [
  { name: "Cintia", distance: "2.8 km", rating: 4.8, reviews: 127, tagline: "Welcome to paradise", price: "€15", priceUnit: "/night", service: "Boarding", serviceIcon: "moon-dark-mode-night-outline" as const },
  { name: "Margaux", distance: "4.1 km", rating: 4.6, reviews: 84, tagline: "Animal lover", price: "€12", priceUnit: "/day", service: "Day care", serviceIcon: "sun-light-mode-day-today-outline" as const },
  { name: "Sophie", distance: "5.3 km", rating: 4.9, reviews: 213, tagline: "5 years experience", price: "€20", priceUnit: "/night", service: "Boarding", serviceIcon: "moon-dark-mode-night-outline" as const }
];

function SitterListScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  onBack,
  onSitterClick,
  onFilterDates
}: TokenProps & { onBack: () => void; onSitterClick: () => void; onFilterDates: () => void }) {
  const [favourites, setFavourites] = useState<string[]>([]);

  return (
    <div>
      <PageHeaderL2
        brand={brand}
        title="Bordeaux, France"
        showBackButton
        onBackClick={onBack}
        showAction1
        action1={{ icon: <Icon name="map-outline" decorative />, label: "Map" }}
      />

      {/* Filter chips */}
      <div style={{ alignItems: "center", borderBottom: `1px solid ${borderColor}`, display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px", scrollbarWidth: "none" }}>
        <ChoiceChip brand={brand} label="Filters (1)" state="Active" leadingIcon leadingIconName="checklist-list-outline" size="Small" />
        <ChoiceChip brand={brand} label="15 Aug – 17 Aug" state="Active" leadingIcon leadingIconName="calendar-2-outline" size="Small" onClick={onFilterDates} />
        <ChoiceChip brand={brand} label="Boarding" state="Rest" size="Small" />
        <ChoiceChip brand={brand} label="Price" state="Rest" size="Small" onClick={onFilterDates} />
      </div>

      {/* Result count */}
      <div style={{ padding: "10px 16px 4px" }}>
        <Text brand={brand} size="sm" tone="secondary">
          <strong style={{ color: "inherit", fontWeight: 700 }}>{SITTERS.length} sitters</strong> found near you
        </Text>
      </div>

      {/* Sitter cards */}
      {SITTERS.map((sitter) => (
        <div key={sitter.name} style={{ cursor: "pointer" }} onClick={onSitterClick}>
          {/* Photo zone */}
          <div style={{ background: `linear-gradient(140deg, ${primaryColor}20 0%, ${primaryColor}55 100%)`, height: 210, position: "relative", width: "100%" }}>
            <Icon
              name="people-circle-user-circle-avatar-profile-outline"
              decorative
              style={{ color: primaryColor, fontSize: 90, left: "50%", opacity: 0.15, position: "absolute", top: "50%", transform: "translate(-50%, -50%)" }}
            />
            {/* Service badge – top left */}
            <div style={{ background: primaryColor, borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 600, left: 12, letterSpacing: 0.2, padding: "4px 10px", position: "absolute", top: 12 }}>
              {sitter.service}
            </div>
            {/* Heart – top right */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFavourites((p) => p.includes(sitter.name) ? p.filter((x) => x !== sitter.name) : [...p, sitter.name]); }}
              style={{ alignItems: "center", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.10)", cursor: "pointer", display: "flex", height: 36, justifyContent: "center", position: "absolute", right: 12, top: 12, width: 36 }}
            >
              <Icon name="heart-like-outline" decorative style={{ color: favourites.includes(sitter.name) ? primaryColor : "#94a3b8", fontSize: 18 }} />
            </button>
          </div>

          {/* Card info */}
          <div style={{ padding: "12px 16px 14px" }}>
            <div style={{ alignItems: "flex-start", display: "flex", gap: 12, justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <div style={{ alignItems: "center", display: "flex", gap: 8, marginBottom: 2 }}>
                  <Text brand={brand} as="strong" size="md" tone="primary" style={{ fontWeight: 700 }}>
                    {sitter.name}
                  </Text>
                  <Text brand={brand} size="xs" tone="secondary">{sitter.distance}</Text>
                </div>
                <Ratings brand={brand} rating={sitter.rating} size="Small" labelFormatter={(v) => `${v} (${sitter.reviews})`} />
                <Text brand={brand} size="sm" tone="secondary" style={{ display: "block", marginTop: 4 }}>
                  {sitter.tagline}
                </Text>
              </div>
              {/* Price – right-aligned, prominent */}
              <div style={{ alignItems: "flex-end", display: "flex", flexDirection: "column", flexShrink: 0, gap: 1 }}>
                <Text brand={brand} as="strong" size="lg" tone="primary" style={{ color: primaryColor, fontWeight: 800, lineHeight: 1 }}>
                  {sitter.price}
                </Text>
                <Text brand={brand} size="xs" tone="secondary">{sitter.priceUnit}</Text>
              </div>
            </div>
          </div>
          <Divider brand={brand} />
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   Screen 2 – Sitter Profile (L2)
   Full-bleed hero · floating back/share/heart ·
   avatar overlapping hero · quick chips ·
   about · availability · services · sticky CTA
════════════════════════════════════════════ */

function SitterProfileScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  fontFamily,
  onBack
}: TokenProps & { fontFamily: string; onBack: () => void }) {
  const [liked, setLiked] = useState(false);

  const services = [
    { iconName: "moon-dark-mode-night-outline" as const, label: "Boarding", price: "€18/night" },
    { iconName: "sun-light-mode-day-today-outline" as const, label: "Day care", price: "€18/day" },
    { iconName: "location-outline" as const, label: "Walk", price: "€18/hour" }
  ];

  const chips = ["Boarding", "Day care", "Walking", "Quick responder", "5 yrs exp.", "Up to 2 dogs"];

  return (
    <div style={{ fontFamily }}>
      {/* ── Full-bleed hero 240px ── */}
      <div style={{ background: `linear-gradient(160deg, ${primaryColor}28 0%, ${primaryColor}65 100%)`, height: 240, position: "relative" }}>
        <Icon
          name="people-circle-user-circle-avatar-profile-outline"
          decorative
          style={{ color: primaryColor, fontSize: 130, left: "50%", opacity: 0.13, position: "absolute", top: "50%", transform: "translate(-50%, -50%)" }}
        />
        {/* Floating back / heart / share */}
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", left: 12, position: "absolute", right: 12, top: 14 }}>
          <button
            type="button"
            onClick={onBack}
            style={{ alignItems: "center", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", height: 36, justifyContent: "center", width: 36 }}
          >
            <Icon name="chevron-large-left-outline" decorative style={{ color: "#1e293b", fontSize: 18 }} />
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              style={{ alignItems: "center", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", height: 36, justifyContent: "center", width: 36 }}
            >
              <Icon name="heart-like-outline" decorative style={{ color: liked ? primaryColor : "#94a3b8", fontSize: 18 }} />
            </button>
            <button
              type="button"
              style={{ alignItems: "center", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", height: 36, justifyContent: "center", width: 36 }}
            >
              <Icon name="share-1" decorative style={{ color: "#1e293b", fontSize: 18 }} />
            </button>
          </div>
        </div>
        {/* Avatar overlapping hero bottom edge */}
        <div style={{ alignItems: "center", background: "#1e293b", border: `3px solid ${surfaceColor}`, borderRadius: "50%", bottom: -32, boxShadow: "0 4px 16px rgba(0,0,0,0.16)", display: "flex", height: 72, justifyContent: "center", left: "50%", position: "absolute", transform: "translateX(-50%)", width: 72 }}>
          <span style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>P</span>
        </div>
      </div>

      {/* ── Identity ── */}
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 4, paddingBottom: 12, paddingTop: 40 }}>
        <strong style={{ fontSize: 20, fontWeight: 700 }}>Penelope</strong>
        <Ratings brand={brand} rating={4.5} size="Small" labelFormatter={(v) => `(47) · ${v}/5`} />
        <Text brand={brand} size="sm" tone="secondary">Bordeaux, 33000</Text>
        <Text brand={brand} size="sm" tone="primary" style={{ color: primaryColor }}>Gaya Animalia</Text>
      </div>

      {/* ── Quick attribute chips ── */}
      <div style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 8, padding: "2px 16px 16px" }}>
          {chips.map((chip) => (
            <div key={chip} style={{ background: subtleColor, border: `1px solid ${borderColor}`, borderRadius: 20, flexShrink: 0, padding: "5px 12px" }}>
              <Text brand={brand} size="xs" tone="secondary" style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                {chip}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <Divider brand={brand} />

      {/* ── About ── */}
      <Module brand={brand} title="About" subtitle="" showTag={false} showHeaderAction={false} showButtonGroup={false} bodyMinHeight={0} description="" primaryAction={null}>
        <Text brand={brand} size="sm" tone="secondary" style={{ lineHeight: 1.65 }}>
          Passionate animal lover with 5+ years of experience. I treat every dog as my own — daily walks, cuddles, and a safe home environment. Up to 2 dogs at a time. Your dog comes home happy and tired.
        </Text>
      </Module>

      <Divider brand={brand} />

      {/* ── Availability ── */}
      <Module brand={brand} title="Availability" subtitle="Check schedule & availability" showTag={false} showHeaderAction headerActionLabel="View" showButtonGroup={false} bodyMinHeight={0} description="" primaryAction={null}>
        <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <Icon name="calendar-2-outline" decorative style={{ color: primaryColor, fontSize: 20 }} />
          <Text brand={brand} size="sm" tone="secondary">Next available · today</Text>
        </div>
      </Module>

      <Divider brand={brand} />

      {/* ── Services offered ── */}
      <Module brand={brand} title="Services offered" subtitle="Daily rates" showTag={false} showHeaderAction={false} showButtonGroup={false} bodyMinHeight={0} description="" primaryAction={null}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, 1fr)" }}>
          {services.map((s) => (
            <div key={s.label} style={{ alignItems: "center", background: subtleColor, borderRadius: 16, display: "flex", flexDirection: "column", gap: 8, padding: "14px 8px" }}>
              <div style={{ alignItems: "center", background: `${primaryColor}18`, borderRadius: "50%", display: "flex", height: 44, justifyContent: "center", width: 44 }}>
                <Icon name={s.iconName} decorative style={{ color: primaryColor, fontSize: 22 }} />
              </div>
              <Text brand={brand} as="strong" size="sm" tone="primary" style={{ fontWeight: 700, textAlign: "center" }}>{s.price}</Text>
              <Text brand={brand} size="xs" tone="secondary" style={{ textAlign: "center" }}>{s.label}</Text>
            </div>
          ))}
        </div>
      </Module>

      {/* ── Sticky CTA ── */}
      <div style={{ background: surfaceColor, borderTop: `1px solid ${borderColor}`, bottom: 0, padding: "12px 20px 20px", position: "sticky" }}>
        <Button brand={brand} styleVariant="Solid" shape="Pill" size="Large" style={{ width: "100%" }}>
          Contact / Book
        </Button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Screen 3 – My Dogs
   Top add button · dog card with avatar +
   inline tags · helper text
════════════════════════════════════════════ */

function MyDogsScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  onDogClick,
  onAddDog
}: TokenProps & { onDogClick: () => void; onAddDog: () => void }) {
  const dogs = [
    { id: "fito", name: "Fito", breed: "Mixed breed", age: "8 yrs", sex: "Male", size: "Medium", initial: "F" }
  ];

  return (
    <div>
      {/* Header row */}
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", padding: "16px 16px 12px" }}>
        <Text brand={brand} as="strong" size="lg" tone="primary" style={{ fontWeight: 700 }}>My Dogs</Text>
        <button
          type="button"
          onClick={onAddDog}
          style={{ alignItems: "center", background: primaryColor, border: "none", borderRadius: 20, color: "#fff", cursor: "pointer", display: "flex", gap: 5, padding: "7px 14px" }}
        >
          <Icon name="circle-plus-add-filled" decorative style={{ color: "#fff", fontSize: 16 }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Add dog</span>
        </button>
      </div>

      {/* Dog cards */}
      <div style={{ display: "grid", gap: 12, padding: "0 16px" }}>
        {dogs.map((dog) => (
          <button
            key={dog.id}
            type="button"
            onClick={onDogClick}
            style={{ alignItems: "center", background: subtleColor, border: "none", borderRadius: 20, cursor: "pointer", display: "flex", gap: 14, padding: "16px", textAlign: "left", width: "100%" }}
          >
            {/* Dark avatar circle with initial */}
            <div style={{ alignItems: "center", background: "#1e293b", borderRadius: "50%", display: "flex", flexShrink: 0, height: 56, justifyContent: "center", width: 56 }}>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{dog.initial}</span>
            </div>
            <div style={{ flex: 1 }}>
              <Text brand={brand} as="strong" size="md" tone="primary" style={{ display: "block", fontWeight: 700 }}>
                {dog.name}
              </Text>
              <Text brand={brand} size="sm" tone="secondary">{dog.breed} · {dog.age}</Text>
              <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                {[dog.sex, dog.size].map((tag) => (
                  <div key={tag} style={{ background: `${primaryColor}14`, borderRadius: 6, padding: "2px 9px" }}>
                    <Text brand={brand} size="xs" tone="primary" style={{ color: primaryColor, fontWeight: 500 }}>{tag}</Text>
                  </div>
                ))}
              </div>
            </div>
            <Icon name="chevron-right-filled" decorative style={{ color: borderColor, flexShrink: 0, fontSize: 18 }} />
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 20px 8px" }}>
        <Text brand={brand} size="sm" tone="secondary">Add your dogs to find the best sitters.</Text>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Screen 4 – Dog Detail
   Full-bleed hero · avatar overlapping edge ·
   floating back + edit · 2-column info grid ·
   health module
════════════════════════════════════════════ */

function DogDetailScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  onBack
}: TokenProps & { onBack: () => void }) {
  const stats: [string, string][] = [
    ["Age", "8 yrs 8 mo"],
    ["Sex", "Male"],
    ["Size", "Medium"],
    ["Weight", "10–20 kg"],
    ["Breed", "Mixed"],
    ["Neutered", "Yes"]
  ];

  return (
    <div>
      {/* Full-bleed hero */}
      <div style={{ background: `linear-gradient(160deg, ${primaryColor}20 0%, ${primaryColor}52 100%)`, height: 260, position: "relative" }}>
        <Icon
          name="people-circle-user-circle-avatar-profile-outline"
          decorative
          style={{ color: primaryColor, fontSize: 120, left: "50%", opacity: 0.12, position: "absolute", top: "50%", transform: "translate(-50%, -50%)" }}
        />
        {/* Floating back + edit */}
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", left: 12, position: "absolute", right: 12, top: 14 }}>
          <button type="button" onClick={onBack} style={{ alignItems: "center", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", height: 36, justifyContent: "center", width: 36 }}>
            <Icon name="chevron-large-left-outline" decorative style={{ color: "#1e293b", fontSize: 18 }} />
          </button>
          <button type="button" style={{ alignItems: "center", background: "rgba(255,255,255,0.88)", border: "none", borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", height: 36, justifyContent: "center", width: 36 }}>
            <Icon name="edit-outline" decorative style={{ color: "#1e293b", fontSize: 18 }} />
          </button>
        </div>
        {/* Avatar overlapping hero */}
        <div style={{ alignItems: "center", background: "#1e293b", border: `3px solid ${surfaceColor}`, borderRadius: "50%", bottom: -28, boxShadow: "0 4px 16px rgba(0,0,0,0.16)", display: "flex", height: 64, justifyContent: "center", left: "50%", position: "absolute", transform: "translateX(-50%)", width: 64 }}>
          <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>F</span>
        </div>
      </div>

      {/* Name + breed tag */}
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 6, padding: "38px 20px 12px" }}>
        <strong style={{ fontSize: 20, fontWeight: 700 }}>Fito</strong>
        <div style={{ background: `${primaryColor}14`, borderRadius: 8, padding: "3px 14px" }}>
          <Text brand={brand} size="xs" tone="primary" style={{ color: primaryColor, fontWeight: 600 }}>Mixed breed</Text>
        </div>
      </div>

      <Divider brand={brand} />

      {/* 2-column info grid */}
      <Module brand={brand} title="Basic information" subtitle="" showTag={false} showHeaderAction={false} showButtonGroup={false} bodyMinHeight={0} description="" primaryAction={null}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {stats.map(([label, value], i) => (
            <div
              key={label}
              style={{
                borderBottom: i < stats.length - 2 ? `1px solid ${borderColor}` : "none",
                borderRight: i % 2 === 0 ? `1px solid ${borderColor}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                padding: "12px 0"
              }}
            >
              <Text brand={brand} size="xs" tone="secondary">{label}</Text>
              <Text brand={brand} as="strong" size="sm" tone="primary" style={{ fontWeight: 600 }}>{value}</Text>
            </div>
          ))}
        </div>
      </Module>

      <Divider brand={brand} />

      {/* Health module */}
      <Module brand={brand} title="Health" subtitle="" showTag={false} showHeaderAction={false} showButtonGroup={false} bodyMinHeight={0} description="" primaryAction={null}>
        <div style={{ alignItems: "center", background: `${primaryColor}10`, borderRadius: 12, display: "flex", gap: 10, padding: "12px 14px" }}>
          <Icon name="checkmark-1-filled" decorative style={{ color: primaryColor, flexShrink: 0, fontSize: 20 }} />
          <div>
            <Text brand={brand} as="strong" size="sm" tone="primary" style={{ display: "block", fontWeight: 600 }}>
              Vaccinations up to date
            </Text>
            <Text brand={brand} size="xs" tone="secondary">Last updated · March 2025</Text>
          </div>
        </div>
      </Module>
    </div>
  );
}

/* ════════════════════════════════════════════
   Screen 5 – Create Dog (Internal)
   Centered solid avatar + camera badge +
   "Change photo" link · full-width name field ·
   essential info section · sticky CTA
════════════════════════════════════════════ */

function CreateDogScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  fontFamily,
  vaccinationChecked,
  onVaccinationChange,
  onClose
}: TokenProps & { fontFamily: string; vaccinationChecked: boolean; onVaccinationChange: (v: boolean) => void; onClose: () => void }) {
  return (
    <div style={{ fontFamily }}>
      <PageHeaderL2
        brand={brand}
        title="Create Dog"
        showBackButton
        backIcon="close-line"
        onBackClick={onClose}
        showAction1
        action1={{ icon: <Icon name="checkmark-1-outline" decorative />, label: "Save" }}
      />

      {/* Centered avatar with camera badge */}
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 8, padding: "24px 20px 16px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ alignItems: "center", background: "#1e293b", borderRadius: "50%", display: "flex", height: 72, justifyContent: "center", width: 72 }}>
            <span style={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>F</span>
          </div>
          {/* Camera badge */}
          <div style={{ alignItems: "center", background: primaryColor, border: `2px solid ${surfaceColor}`, borderRadius: "50%", bottom: 0, display: "flex", height: 24, justifyContent: "center", position: "absolute", right: 0, width: 24 }}>
            <Icon name="camera-picture-image-outline" decorative style={{ color: "#fff", fontSize: 12 }} />
          </div>
        </div>
        <Text brand={brand} size="sm" tone="primary" style={{ color: primaryColor, cursor: "pointer", fontWeight: 500 }}>
          Change photo
        </Text>
      </div>

      {/* Dog name — full width */}
      <div style={{ padding: "0 20px 8px" }}>
        <TextInput brand={brand} label="Dog name" placeholder="E.g. Fito" size="Large" />
      </div>

      <Divider brand={brand} style={{ margin: "12px 0" }} />

      {/* Essential information */}
      <div style={{ padding: "0 20px 16px" }}>
        <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block", fontWeight: 600, marginBottom: 14 }}>
          Essential information
        </Text>
        <div style={{ display: "grid", gap: 12 }}>
          <Dropdown brand={brand} label="Breed" placeholder="Breed" size="Large" />
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
            <Dropdown brand={brand} label="Birth year" placeholder="Year" size="Large" />
            <Dropdown brand={brand} label="Month" placeholder="Birth month" size="Large" />
          </div>
          <Dropdown brand={brand} label="Size" placeholder="Size" size="Large" />
          <Dropdown brand={brand} label="Sex" placeholder="Sex" size="Large" />
          <div style={{ alignItems: "center", background: subtleColor, borderRadius: 14, display: "flex", padding: "12px 14px" }}>
            <CheckboxLabel brand={brand} label="Vaccinations up to date" checked={vaccinationChecked} onChange={(e) => onVaccinationChange(e.target.checked)} size="Large" />
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ background: surfaceColor, borderTop: `1px solid ${borderColor}`, bottom: 0, padding: "12px 20px 20px", position: "sticky" }}>
        <Button brand={brand} styleVariant="Solid" shape="Pill" size="Large" style={{ width: "100%" }}>
          Create profile
        </Button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Overlay – Service Select (bottom sheet)
   Drag handle · icon-in-circle tiles ·
   description text · dates row · search CTA
════════════════════════════════════════════ */

function ServiceSelectScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  fontFamily,
  serviceSelected,
  onServiceChange,
  onClose,
  onSelectDates,
  onSearch
}: TokenProps & {
  fontFamily: string;
  serviceSelected: ServiceKey;
  onServiceChange: (s: ServiceKey) => void;
  onClose: () => void;
  onSelectDates: () => void;
  onSearch: () => void;
}) {
  const services: { key: ServiceKey; icon: "moon-dark-mode-night-outline" | "sun-light-mode-day-today-outline" | "location-outline"; label: string; description: string }[] = [
    { key: "boarding", icon: "moon-dark-mode-night-outline", label: "Dog boarding", description: "Your dog stays overnight with the sitter" },
    { key: "daycare", icon: "sun-light-mode-day-today-outline", label: "Dog day care", description: "Your dog spends the day with the sitter" },
    { key: "walking", icon: "location-outline", label: "Dog walking", description: "The sitter walks your dog" }
  ];

  return (
    <div style={{ bottom: 0, fontFamily, left: 0, position: "absolute", right: 0, top: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ background: "rgba(0,0,0,0.45)", bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }} />
      <div style={{ background: surfaceColor, borderRadius: "22px 22px 0 0", bottom: 0, boxShadow: "0 -4px 28px rgba(0,0,0,0.14)", left: 0, position: "absolute", right: 0 }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
          <div style={{ background: borderColor, borderRadius: 3, height: 4, width: 40 }} />
        </div>
        {/* Header */}
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", padding: "14px 20px 0" }}>
          <Text brand={brand} as="strong" size="lg" tone="primary" style={{ fontWeight: 700 }}>
            Which service do you need?
          </Text>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon name="close-line" decorative style={{ color: primaryColor, fontSize: 22 }} />
          </button>
        </div>

        <div style={{ padding: "14px 20px 28px" }}>
          <div style={{ display: "grid", gap: 10 }}>
            {services.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onServiceChange(s.key)}
                style={{ alignItems: "center", background: serviceSelected === s.key ? `${primaryColor}12` : subtleColor, border: `1.5px solid ${serviceSelected === s.key ? primaryColor : borderColor}`, borderRadius: 14, cursor: "pointer", display: "flex", gap: 12, padding: "14px", textAlign: "left", width: "100%" }}
              >
                {/* Icon in circle */}
                <div style={{ alignItems: "center", background: `${primaryColor}18`, borderRadius: "50%", display: "flex", flexShrink: 0, height: 44, justifyContent: "center", width: 44 }}>
                  <Icon name={s.icon} decorative style={{ color: primaryColor, fontSize: 22 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Text brand={brand} as="strong" size="sm" tone="primary" style={{ display: "block", fontWeight: 600 }}>{s.label}</Text>
                  <Text brand={brand} size="xs" tone="secondary">{s.description}</Text>
                </div>
                {/* Radio dot */}
                <div style={{ alignItems: "center", background: serviceSelected === s.key ? primaryColor : "transparent", border: `2px solid ${serviceSelected === s.key ? primaryColor : borderColor}`, borderRadius: "50%", display: "flex", flexShrink: 0, height: 20, justifyContent: "center", width: 20 }}>
                  {serviceSelected === s.key && <Icon name="checkmark-1-filled" decorative style={{ color: "#fff", fontSize: 12 }} />}
                </div>
              </button>
            ))}
          </div>

          {/* Dates row */}
          <button
            type="button"
            onClick={onSelectDates}
            style={{ alignItems: "center", background: subtleColor, border: `1px solid ${borderColor}`, borderRadius: 14, cursor: "pointer", display: "flex", gap: 12, marginTop: 12, padding: "14px", width: "100%" }}
          >
            <Icon name="calendar-2-outline" decorative style={{ color: primaryColor, fontSize: 22 }} />
            <Text brand={brand} size="sm" tone="secondary" style={{ flex: 1, textAlign: "left" }}>For which dates?</Text>
            <Icon name="arrow-right-outline" decorative style={{ color: primaryColor, fontSize: 18 }} />
          </button>

          <div style={{ height: 16 }} />
          <Button brand={brand} styleVariant="Solid" shape="Pill" size="Large" style={{ width: "100%" }} onClick={onSearch}>
            Search now
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Overlay – Date Picker
   Range summary label · calendar grid ·
   in-range tint · two-column bottom bar
════════════════════════════════════════════ */

function DatePickerScreen({
  brand,
  primaryColor,
  subtleColor,
  borderColor,
  surfaceColor,
  fontFamily,
  selectedDates,
  onToggleDate,
  onClear,
  onConfirm,
  onClose
}: TokenProps & {
  fontFamily: string;
  selectedDates: number[];
  onToggleDate: (d: number) => void;
  onClear: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const rangeLabel =
    selectedDates.length === 2
      ? `${Math.min(...selectedDates)} – ${Math.max(...selectedDates)} July 2025`
      : selectedDates.length === 1
      ? `${selectedDates[0]} July 2025 — pick check-out`
      : "Select check-in and check-out dates";

  return (
    <div style={{ background: surfaceColor, bottom: 0, fontFamily, left: 0, position: "absolute", right: 0, top: 0, zIndex: 100 }}>
      {/* Header */}
      <div style={{ alignItems: "center", borderBottom: `1px solid ${borderColor}`, display: "flex", gap: 12, padding: "16px 16px 12px" }}>
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="close-line" decorative style={{ color: primaryColor, fontSize: 22 }} />
        </button>
        <div style={{ flex: 1 }}>
          <Text brand={brand} as="strong" size="md" tone="primary" style={{ display: "block", fontWeight: 700 }}>Select dates</Text>
          <Text brand={brand} size="xs" tone="secondary">{rangeLabel}</Text>
        </div>
      </div>

      {/* Month nav */}
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", padding: "16px 24px 8px" }}>
        <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="chevron-large-left-outline" decorative style={{ color: primaryColor, fontSize: 20 }} />
        </button>
        <div style={{ textAlign: "center" }}>
          <Text brand={brand} as="strong" size="md" tone="primary" style={{ display: "block", fontWeight: 700 }}>July</Text>
          <Text brand={brand} size="sm" tone="secondary">2025</Text>
        </div>
        <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="chevron-right-filled" decorative style={{ color: primaryColor, fontSize: 20 }} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "4px 16px" }}>
        {DAYS.map((d, i) => (
          <Text key={`${d}-${i}`} brand={brand} size="xs" tone="secondary" style={{ fontWeight: 600, textAlign: "center" }}>{d}</Text>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gap: 4, gridTemplateColumns: "repeat(7, 1fr)", padding: "4px 16px 80px" }}>
        {JULY_2025.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const isSelected = selectedDates.includes(day);
          const isInRange =
            selectedDates.length === 2 &&
            day > Math.min(...selectedDates) &&
            day < Math.max(...selectedDates);

          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggleDate(day)}
              style={{
                alignItems: "center",
                background: isSelected ? primaryColor : isInRange ? `${primaryColor}22` : "transparent",
                border: "none",
                borderRadius: isInRange ? 0 : "50%",
                color: isSelected ? "#fff" : "inherit",
                cursor: "pointer",
                display: "flex",
                fontFamily,
                fontSize: 14,
                fontWeight: isSelected ? 700 : 400,
                height: 40,
                justifyContent: "center",
                width: "100%"
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Two-column bottom bar */}
      <div style={{ borderTop: `1px solid ${borderColor}`, bottom: 0, display: "grid", gridTemplateColumns: "1fr 1fr", left: 0, position: "absolute", right: 0 }}>
        <button type="button" onClick={onClear} style={{ background: subtleColor, border: "none", borderRight: `1px solid ${borderColor}`, cursor: "pointer", fontFamily, fontSize: 14, fontWeight: 600, padding: "18px 16px" }}>
          Clear dates
        </button>
        <button type="button" onClick={onConfirm} style={{ background: primaryColor, border: "none", color: "#fff", cursor: "pointer", fontFamily, fontSize: 14, fontWeight: 700, padding: "18px 16px" }}>
          Confirm
        </button>
      </div>
    </div>
  );
}
