import type { CSSProperties, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  AppHeader,
  Banner,
  BottomNav,
  Button,
  ChoiceChip,
  Ratings,
  SearchBar,
  SectionHeader,
  Tag,
  Text,
  getRequiredThemeTokenValue
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryPage } from "../storybook-shell";

export type FoodDeliveryMobileScreenProps = {
  brand?: DisplayBrandId;
};

type FoodDeliveryTokens = {
  pageBackground: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  success: string;
  warning: string;
  shadow: string;
};

type CuisineChip = {
  id: string;
  label: string;
  state: "Rest" | "Active";
};

type RestaurantRecord = {
  id: string;
  title: string;
  cuisine: string;
  eta: string;
  price: string;
  offer: string;
  rating: number;
  tagColor: "Green" | "Orange";
  tagLabel: string;
  artTitle: string;
  artDescription: string;
  artStart: string;
  artEnd: string;
  foodColor: string;
  accentColor: string;
};

const FOOD_DELIVERY_FIGMA_URL =
  "https://www.figma.com/design/WrvDB5k5CaYoJcTKobqnzv/Food-Delivery-Mobile-Landing---UI-Kits?node-id=4-44";

const CUISINE_CHIPS: CuisineChip[] = [
  { id: "pizza", label: "Pizza", state: "Active" },
  { id: "biryani", label: "Biryani", state: "Rest" },
  { id: "healthy", label: "Healthy", state: "Rest" },
  { id: "dessert", label: "Dessert", state: "Rest" }
];

const RESTAURANTS: RestaurantRecord[] = [
  {
    id: "bowlcraft",
    title: "Biryani By Bowlcraft",
    cuisine: "Hyderabadi • North Indian",
    eta: "24 mins",
    price: "₹249 for one",
    offer: "Flat 20% off above ₹399",
    rating: 4.8,
    tagColor: "Green",
    tagLabel: "Top rated",
    artTitle: "Smoky biryani",
    artDescription: "Tender rice, fresh mint, and slow-cooked flavour in every bowl.",
    artStart: "#FFF2DA",
    artEnd: "#FFD29A",
    foodColor: "#E67D2A",
    accentColor: "#FFD166"
  },
  {
    id: "slice-theory",
    title: "Slice Theory Pizza",
    cuisine: "Italian • Fast Food",
    eta: "18 mins",
    price: "₹329 for one",
    offer: "Free garlic bread with combos",
    rating: 4.6,
    tagColor: "Orange",
    tagLabel: "Free delivery",
    artTitle: "Cheese stretch",
    artDescription: "Stone-baked slices with hot garlic butter crust and melty cheese.",
    artStart: "#FFE6E1",
    artEnd: "#F9C1BA",
    foodColor: "#F45D34",
    accentColor: "#FFD166"
  }
];

function getFoodDeliveryTokens(brand: DisplayBrandId): FoodDeliveryTokens {
  return {
    pageBackground: "linear-gradient(180deg, #FFF8F0 0%, #FFFDF9 100%)",
    surface: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    surfaceMuted: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    border: String(getRequiredThemeTokenValue(brand, "color.border.default")),
    textPrimary: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    textSecondary: String(getRequiredThemeTokenValue(brand, "color.text.secondary")),
    textMuted: String(getRequiredThemeTokenValue(brand, "color.text.muted")),
    brand: String(getRequiredThemeTokenValue(brand, "color.brand.alt.500")),
    brandStrong: String(getRequiredThemeTokenValue(brand, "color.brand.alt.600")),
    brandSoft: String(getRequiredThemeTokenValue(brand, "color.brand.primary.50")),
    success: String(getRequiredThemeTokenValue(brand, "color.status.success")),
    warning: String(getRequiredThemeTokenValue(brand, "color.status.warning")),
    shadow: "0 28px 80px rgba(15, 23, 42, 0.16)"
  };
}

function ScreenCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 34,
        boxShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
        overflow: "hidden",
        width: 390
      }}
    >
      {children}
    </div>
  );
}

function createFoodArt({
  accentColor,
  artDescription,
  artEnd,
  artStart,
  artTitle,
  foodColor
}: Pick<
  RestaurantRecord,
  "accentColor" | "artDescription" | "artEnd" | "artStart" | "artTitle" | "foodColor"
>) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" role="img" aria-label="${artTitle}">
      <defs>
        <linearGradient id="cardBg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${artStart}" />
          <stop offset="100%" stop-color="${artEnd}" />
        </linearGradient>
      </defs>
      <rect width="420" height="200" rx="28" fill="url(#cardBg)" />
      <circle cx="325" cy="100" r="74" fill="#FFFFFF" opacity="0.94" />
      <circle cx="325" cy="100" r="54" fill="none" stroke="${foodColor}" stroke-width="14" />
      <circle cx="265" cy="50" r="16" fill="${accentColor}" />
      <text x="26" y="58" fill="#1A1223" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="700">
        ${artTitle}
      </text>
      <foreignObject x="26" y="80" width="150" height="90">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter,Arial,sans-serif;color:#5F566E;font-size:15px;line-height:1.35;">
          ${artDescription}
        </div>
      </foreignObject>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function HeroBadge({
  color,
  label,
  tokens
}: {
  color: string;
  label: string;
  tokens: FoodDeliveryTokens;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.92)",
        border: `1px solid ${tokens.border}`,
        borderRadius: 999,
        display: "inline-flex",
        gap: 8,
        padding: "8px 12px"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: color,
          borderRadius: 999,
          display: "block",
          height: 10,
          width: 10
        }}
      />
      <Text as="span" brand="Cars24" size="sm" style={{ color: tokens.textPrimary, margin: 0 }}>
        {label}
      </Text>
    </div>
  );
}

function RestaurantCard({
  brand,
  restaurant,
  tokens
}: {
  brand: DisplayBrandId;
  restaurant: RestaurantRecord;
  tokens: FoodDeliveryTokens;
}) {
  const art = createFoodArt(restaurant);

  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 24,
        boxShadow: "0 18px 34px rgba(15, 23, 42, 0.08)",
        display: "grid",
        gap: 12,
        padding: 12
      }}
    >
      <img
        alt={restaurant.artTitle}
        src={art}
        style={{
          borderRadius: 20,
          display: "block",
          height: 160,
          objectFit: "cover",
          width: "100%"
        }}
      />

      <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
        <Tag
          brand={brand}
          color={restaurant.tagColor}
          priority="Low"
          size="Small"
        >
          {restaurant.tagLabel}
        </Tag>
        <Ratings brand={brand} rating={restaurant.rating} size="Small" />
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <Text as="strong" brand={brand} size="xl" style={{ color: tokens.textPrimary }}>
          {restaurant.title}
        </Text>
        <Text as="span" brand={brand} size="md" style={{ color: tokens.textSecondary, margin: 0 }}>
          {restaurant.cuisine} • {restaurant.eta}
        </Text>
      </div>

      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "grid", gap: 2 }}>
          <Text as="strong" brand={brand} size="xl" style={{ color: tokens.textPrimary }}>
            {restaurant.price}
          </Text>
          <Text as="span" brand={brand} size="sm" style={{ color: tokens.textMuted, margin: 0 }}>
            {restaurant.offer}
          </Text>
        </div>

        <Button brand={brand} leadingIcon="sparkle-filled" shape="Pill" size="Medium">
          Add
        </Button>
      </div>
    </div>
  );
}

function PromoCard({
  background,
  body,
  title,
  tone
}: {
  background: string;
  body: string;
  title: string;
  tone: string;
}) {
  return (
    <div
      style={{
        background,
        borderRadius: 18,
        display: "grid",
        gap: 4,
        padding: 12
      }}
    >
      <div style={{ color: tone, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
      <div style={{ color: tone, fontSize: 12, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
}

export function FoodDeliveryMobileScreen({ brand = "Cars24" }: FoodDeliveryMobileScreenProps) {
  const tokens = getFoodDeliveryTokens(brand);
  const bottomNavItems = [
    { value: "home", label: "Home", ariaLabel: "Home", iconName: "sparkle-filled" as const },
    { value: "offers", label: "Offers", ariaLabel: "Offers", iconName: "sparkle-filled" as const },
    { value: "cart", label: "Cart", ariaLabel: "Cart", iconName: "sparkle-filled" as const }
  ];

  return (
    <StoryPage fullscreen>
      <div
        style={{
          background: tokens.pageBackground,
          display: "grid",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 32
        }}
      >
        <ScreenCard>
          <div
            style={{
              background: tokens.pageBackground,
              display: "grid",
              gap: 16,
              padding: 16
            }}
          >
            <AppHeader
              brand={brand}
              level="Page - L1"
              locationLabel="Koramangala, Bengaluru"
              variant="Brand"
            />

            <SearchBar
              brand={brand}
              color="Solid White"
              placeholder="Search for biryani or burgers"
              size="Large"
            />

            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 4
              }}
            >
              {CUISINE_CHIPS.map((chip) => (
                <ChoiceChip
                  key={chip.id}
                  brand={brand}
                  label={chip.label}
                  size="Default"
                  state={chip.state}
                  variant="Horizontal"
                />
              ))}
            </div>

            <div
              style={{
                background: "linear-gradient(180deg, #FFF0DC 0%, #FFF8EE 100%)",
                border: `1px solid #F2D8B8`,
                borderRadius: 28,
                display: "grid",
                gap: 14,
                padding: 18
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <HeroBadge color={tokens.warning} label="30 min" tokens={tokens} />
                <HeroBadge color={tokens.success} label="Live offers" tokens={tokens} />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <Text
                  as="strong"
                  brand={brand}
                  size="xl"
                  style={{ color: "#1A1223", fontSize: 28, lineHeight: 1.08 }}
                >
                  Cravings delivered fast and fresh
                </Text>
                <Text as="p" brand={brand} size="md" style={{ color: "#5C4A39", margin: 0 }}>
                  Browse handpicked restaurants, stack offers, and track every order in real time.
                </Text>
              </div>

              <Banner
                actionType="Text button"
                brand={brand}
                description="Use code FEAST50 and save up to ₹150 tonight."
                heading
                state="Brand"
                theme="Light"
                title="Free delivery on your first order"
              />
            </div>

            <SectionHeader
              actionLabel="View all"
              brand={brand}
              description="Fastest picks with great ratings and zero hassle checkout."
              showAction
              showDescription
              showSubtitle={false}
              title="Popular near you"
            />

            <div style={{ display: "grid", gap: 14 }}>
              {RESTAURANTS.map((restaurant) => (
                <RestaurantCard key={restaurant.id} brand={brand} restaurant={restaurant} tokens={tokens} />
              ))}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <Text as="strong" brand={brand} size="xl" style={{ color: tokens.textPrimary, fontSize: 20 }}>
                Tonight&apos;s best offers
              </Text>
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
                }}
              >
                <PromoCard
                  background="#FFF3E1"
                  body="On first order above ₹299"
                  title="50% off"
                  tone="#A24D10"
                />
                <PromoCard
                  background="#E9F7EE"
                  body="With orders from select partners"
                  title="Free dessert"
                  tone="#206A3F"
                />
              </div>
            </div>

            <div
              style={
                {
                  marginLeft: -16,
                  marginRight: -16,
                  marginTop: 4
                } satisfies CSSProperties
              }
            >
              <BottomNav
                brand={brand}
                items={bottomNavItems}
                style={{ width: "100%" }}
                value="home"
              />
            </div>
          </div>
        </ScreenCard>
      </div>
    </StoryPage>
  );
}

export const foodDeliveryMobileScreenSourceCode = `import {
  AppHeader,
  Banner,
  BottomNav,
  Button,
  ChoiceChip,
  Ratings,
  SearchBar,
  SectionHeader,
  Tag
} from "@turbo/web";

export function FoodDeliveryMobileScreen() {
  return (
    <>
      <AppHeader
        brand="Cars24"
        level="Page - L1"
        variant="Brand"
        locationLabel="Koramangala, Bengaluru"
      />
      <SearchBar brand="Cars24" color="Solid White" size="Large" placeholder="Search for biryani or burgers" />
      <ChoiceChip brand="Cars24" label="Pizza" state="Active" variant="Horizontal" />
      <Banner
        brand="Cars24"
        actionType="Text button"
        state="Brand"
        theme="Light"
        title="Free delivery on your first order"
        description="Use code FEAST50 and save up to ₹150 tonight."
      />
      <SectionHeader brand="Cars24" title="Popular near you" actionLabel="View all" showAction />
      <Tag brand="Cars24" color="Green" priority="Low" size="Small">
        Top rated
      </Tag>
      <Ratings brand="Cars24" rating={4.8} size="Small" />
      <Button brand="Cars24" shape="Pill" size="Medium">Add</Button>
      <BottomNav
        brand="Cars24"
        value="home"
        items={[
          { value: "home", label: "Home", ariaLabel: "Home", iconName: "sparkle-filled" },
          { value: "offers", label: "Offers", ariaLabel: "Offers", iconName: "sparkle-filled" },
          { value: "cart", label: "Cart", ariaLabel: "Cart", iconName: "sparkle-filled" }
        ]}
      />
    </>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: FoodDeliveryMobileScreenProps) => (
    <FoodDeliveryMobileScreen brand={brand} />
  ),
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(FOOD_DELIVERY_FIGMA_URL),
    docs: {
      source: {
        code: foodDeliveryMobileScreenSourceCode
      }
    }
  }
};
