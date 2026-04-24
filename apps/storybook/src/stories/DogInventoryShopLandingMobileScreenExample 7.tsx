import type { CSSProperties, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import {
  ActionBar,
  AppHeader,
  Banner,
  Button,
  ChoiceChip,
  Icon,
  IconButton,
  Module,
  Ratings,
  SearchBar,
  SectionHeader,
  Tag,
  Text,
  getRequiredThemeTokenValue
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryPage } from "../storybook-shell";

export type DogInventoryShopLandingMobileScreenProps = {
  brand?: DisplayBrandId;
};

type DogInventoryTokens = {
  pageBackground: string;
  surface: string;
  subtleSurface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  brand: string;
  brandStrong: string;
  brandSoft: string;
  info: string;
  success: string;
  warning: string;
};

type CategoryChipRecord = {
  id: string;
  label: string;
  state: "Rest" | "Active";
};

type StageChipRecord = {
  description: string;
  id: string;
  label: string;
};

type ProductRecord = {
  badgeColor: "Green" | "Orange" | "Brand blue";
  badgeLabel: string;
  calories: string;
  category: string;
  imageAccent: string;
  imageBackground: string;
  price: string;
  rating: number;
  subtitle: string;
  title: string;
};

const DOG_INVENTORY_LANDING_FIGMA_URL =
  "https://www.figma.com/design/hS7Wy0vrc2RPlakiDOku0e/v2.0-Mobile-Widget-Library?node-id=26919-114294&t=7ZXalFsYffZYpIOr-11";

const CATEGORY_CHIPS: CategoryChipRecord[] = [
  { id: "all", label: "All", state: "Active" },
  { id: "food", label: "Food", state: "Rest" },
  { id: "treats", label: "Treats", state: "Rest" },
  { id: "toys", label: "Toys", state: "Rest" },
  { id: "health", label: "Health", state: "Rest" }
];

const LIFE_STAGE_CHIPS: StageChipRecord[] = [
  {
    id: "puppy",
    label: "Puppy",
    description: "Growth-first"
  },
  {
    id: "adult",
    label: "Adult",
    description: "Daily routine"
  },
  {
    id: "senior",
    label: "Senior",
    description: "Joint support"
  }
];

const PRODUCTS: ProductRecord[] = [
  {
    badgeColor: "Green",
    badgeLabel: "Vet pick",
    calories: "Grain free",
    category: "Dry food",
    imageAccent: "#FFC6A5",
    imageBackground: "#FFF5EC",
    price: "₹899",
    rating: 4.8,
    subtitle: "Chicken, pumpkin & flaxseed",
    title: "Paw Pantry Active Bowl",
  },
  {
    badgeColor: "Orange",
    badgeLabel: "Best seller",
    calories: "Training treats",
    category: "Treats",
    imageAccent: "#C8E7D4",
    imageBackground: "#F2FBF6",
    price: "₹349",
    rating: 4.7,
    subtitle: "Soft bites with salmon oil",
    title: "Milo Mini Reward Pack",
  },
  {
    badgeColor: "Brand blue",
    badgeLabel: "New drop",
    calories: "Dental care",
    category: "Chews",
    imageAccent: "#D9D5FF",
    imageBackground: "#F7F5FF",
    price: "₹649",
    rating: 4.6,
    subtitle: "Mint sticks for clean smiles",
    title: "Daily Chew Dental Bundle",
  }
];

function getDogInventoryTokens(brand: DisplayBrandId): DogInventoryTokens {
  return {
    pageBackground: "linear-gradient(180deg, #FFF9F4 0%, #F4F8FF 100%)",
    surface: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    subtleSurface: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
    border: String(getRequiredThemeTokenValue(brand, "color.border.default")),
    textPrimary: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    textSecondary: String(getRequiredThemeTokenValue(brand, "color.text.secondary")),
    textMuted: String(getRequiredThemeTokenValue(brand, "color.text.muted")),
    textInverse: String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
    brand: String(getRequiredThemeTokenValue(brand, "color.brand.alt.500")),
    brandStrong: String(getRequiredThemeTokenValue(brand, "color.brand.alt.600")),
    brandSoft: String(getRequiredThemeTokenValue(brand, "color.brand.primary.50")),
    info: String(getRequiredThemeTokenValue(brand, "color.status.info")),
    success: String(getRequiredThemeTokenValue(brand, "color.status.success")),
    warning: String(getRequiredThemeTokenValue(brand, "color.status.warning"))
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

function createHeroIllustration(tokens: DogInventoryTokens) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 260" role="img" aria-label="Dog inventory hero artwork">
      <defs>
        <linearGradient id="heroBg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#FFF4E8" />
          <stop offset="100%" stop-color="#FFFDF9" />
        </linearGradient>
        <linearGradient id="dogBody" x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="0%" stop-color="#F0A76F" />
          <stop offset="100%" stop-color="#D97941" />
        </linearGradient>
        <linearGradient id="crate" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${tokens.brandSoft}" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
      </defs>
      <rect width="420" height="260" rx="32" fill="url(#heroBg)" />
      <circle cx="337" cy="58" r="34" fill="${tokens.brandSoft}" />
      <circle cx="80" cy="48" r="20" fill="#FFE0C9" />
      <rect x="40" y="165" width="152" height="56" rx="18" fill="url(#crate)" />
      <rect x="56" y="181" width="120" height="14" rx="7" fill="#FFFFFF" />
      <rect x="68" y="126" width="114" height="22" rx="11" fill="#FFF1D9" />
      <rect x="82" y="136" width="86" height="6" rx="3" fill="#F0A76F" opacity="0.46" />
      <circle cx="258" cy="138" r="52" fill="url(#dogBody)" />
      <ellipse cx="258" cy="216" rx="88" ry="16" fill="#E7D7CA" />
      <circle cx="218" cy="102" r="26" fill="#E39A66" />
      <path d="M206 89c-5-20 14-35 28-35 7 0 14 4 17 8-10 1-16 7-18 18-4 20-21 23-27 9z" fill="#6D4022" />
      <path d="M233 104c0-15 11-27 25-27 12 0 21 6 26 18-9-2-18 1-27 8-7 5-16 6-24 1z" fill="#6D4022" />
      <circle cx="242" cy="135" r="6" fill="#201812" />
      <circle cx="274" cy="135" r="6" fill="#201812" />
      <ellipse cx="258" cy="154" rx="14" ry="10" fill="#2C1D16" />
      <path d="M248 169c8 10 23 10 31 0" fill="none" stroke="#8A4D2A" stroke-width="4" stroke-linecap="round" />
      <rect x="215" y="178" width="22" height="42" rx="11" fill="#E39A66" />
      <rect x="278" y="178" width="22" height="42" rx="11" fill="#E39A66" />
      <rect x="226" y="212" width="18" height="10" rx="5" fill="#6D4022" />
      <rect x="289" y="212" width="18" height="10" rx="5" fill="#6D4022" />
      <circle cx="338" cy="192" r="34" fill="#FFFFFF" />
      <circle cx="338" cy="192" r="24" fill="#FFF3D6" />
      <path d="M338 170v44M316 192h44" stroke="${tokens.brandStrong}" stroke-width="8" stroke-linecap="round" />
      <rect x="120" y="38" width="88" height="40" rx="20" fill="#FFFFFF" />
      <circle cx="138" cy="58" r="10" fill="${tokens.success}" />
      <rect x="154" y="52" width="38" height="12" rx="6" fill="#D7E2F4" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function HeroStat({
  icon,
  label,
  tokens
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  tokens: DogInventoryTokens;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.86)",
        border: `1px solid ${tokens.border}`,
        borderRadius: 999,
        display: "inline-flex",
        gap: 8,
        padding: "8px 12px"
      }}
    >
      <Icon decorative name={icon} style={{ color: tokens.brand, fontSize: 16 }} />
      <Text as="span" brand="Cars24" size="sm" style={{ color: tokens.textPrimary, margin: 0 }}>
        {label}
      </Text>
    </div>
  );
}

function HeroModule({
  brand,
  tokens
}: {
  brand: DisplayBrandId;
  tokens: DogInventoryTokens;
}) {
  const image = createHeroIllustration(tokens);

  return (
    <Module
      bodyMinHeight="auto"
      brand={brand}
      description="Fresh meals, reward packs, and health add-ons curated around breed, age, and activity."
      footer={
        <Button brand={brand} shape="Pill" size="Large" style={{ width: "100%" }}>
          Shop featured bundle
        </Button>
      }
      headerActionLabel="See bundles"
      primaryAction={null}
      showButtonGroup={false}
      subtitle="Daily essentials for playful dogs"
      tagLabel="Free sample"
      title="Tail-wagging inventory, packed for the week"
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${tokens.brandSoft} 0%, #FFF9F3 100%)`,
          border: `1px solid ${tokens.border}`,
          borderRadius: 24,
          display: "grid",
          gap: 16,
          overflow: "hidden",
          padding: 16
        }}
      >
        <img
          alt="Dog inventory hero artwork"
          src={image}
          style={{
            borderRadius: 20,
            display: "block",
            height: 190,
            objectFit: "cover",
            width: "100%"
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10
          }}
        >
          <HeroStat icon="circle-check-filled" label="Free delivery above ₹799" tokens={tokens} />
          <HeroStat icon="heart-like-filled" label="Vet-approved formulas" tokens={tokens} />
          <HeroStat icon="basket-1-cart-shopping-outline" label="Curated starter kits" tokens={tokens} />
        </div>
      </div>
    </Module>
  );
}

function CategoryRail({ brand }: { brand: DisplayBrandId }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        paddingBottom: 4
      }}
    >
      {CATEGORY_CHIPS.map((chip) => (
        <ChoiceChip
          key={chip.id}
          brand={brand}
          label={chip.label}
          size="Small"
          state={chip.state}
          variant="Horizontal"
        />
      ))}
    </div>
  );
}

function StageRail({ brand }: { brand: DisplayBrandId }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
      }}
    >
      {LIFE_STAGE_CHIPS.map((chip, index) => (
        <ChoiceChip
          key={chip.id}
          brand={brand}
          description={chip.description}
          label={chip.label}
          state={index === 1 ? "Active" : "Rest"}
          variant="Vertical"
        />
      ))}
    </div>
  );
}

function createProductIllustration(product: ProductRecord) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 312 200" role="img" aria-label="${product.title}">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${product.imageBackground}" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
        <linearGradient id="bag" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${product.imageAccent}" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
      </defs>
      <rect width="312" height="200" rx="24" fill="url(#bg)" />
      <circle cx="246" cy="44" r="26" fill="#FFFFFF" opacity="0.7" />
      <rect x="44" y="48" width="116" height="122" rx="18" fill="url(#bag)" />
      <rect x="58" y="62" width="88" height="16" rx="8" fill="#FFFFFF" opacity="0.78" />
      <rect x="68" y="94" width="66" height="10" rx="5" fill="#FFFFFF" opacity="0.7" />
      <rect x="68" y="112" width="54" height="10" rx="5" fill="#FFFFFF" opacity="0.7" />
      <circle cx="226" cy="118" r="40" fill="#FFF2E3" />
      <circle cx="206" cy="104" r="16" fill="#A76A3C" />
      <circle cx="238" cy="102" r="18" fill="#C5854B" />
      <ellipse cx="222" cy="130" rx="28" ry="22" fill="#D69255" />
      <circle cx="212" cy="128" r="3" fill="#201812" />
      <circle cx="230" cy="128" r="3" fill="#201812" />
      <ellipse cx="221" cy="138" rx="7" ry="5" fill="#2C1D16" />
      <path d="M214 146c4 4 10 4 14 0" fill="none" stroke="#8A4D2A" stroke-width="3" stroke-linecap="round" />
      <ellipse cx="154" cy="176" rx="84" ry="10" fill="#E6E9EF" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function ProductCard({
  brand,
  product,
  tokens
}: {
  brand: DisplayBrandId;
  product: ProductRecord;
  tokens: DogInventoryTokens;
}) {
  const productImage = createProductIllustration(product);

  return (
    <Module
      bodyMinHeight="auto"
      brand={brand}
      footer={
        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "48px minmax(0, 1fr)"
          }}
        >
          <IconButton
            aria-label={`Save ${product.title}`}
            brand={brand}
            icon={<Icon decorative name="heart-like-outline" />}
            shape="Round"
            size="Medium"
            styleVariant="Outline - Primary"
          />
          <Button brand={brand} shape="Pill" size="Medium">
            Add to cart
          </Button>
        </div>
      }
      primaryAction={null}
      showButtonGroup={false}
      showSectionHeader={false}
      style={{
        border: `1px solid ${tokens.border}`,
        borderRadius: 28,
        gap: 14,
        padding: 14
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 14
        }}
      >
        <div
          style={{
            borderRadius: 22,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <img
            alt={product.title}
            src={productImage}
            style={{
              display: "block",
              height: 176,
              objectFit: "cover",
              width: "100%"
            }}
          />
          <div
            style={{
              left: 12,
              position: "absolute",
              top: 12
            }}
          >
            <Tag brand={brand} color={product.badgeColor} priority="Low" size="Large">
              {product.badgeLabel}
            </Tag>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 10
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 8,
              justifyContent: "space-between"
            }}
          >
            <Tag brand={brand} color="Neutral" priority="Low" size="Large">
              {product.category}
            </Tag>
            <div style={{ alignItems: "center", display: "inline-flex", gap: 6 }}>
              <Ratings brand={brand} rating={product.rating} size="Small" />
              <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
                {product.rating.toFixed(1)}
              </Text>
            </div>
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <Text as="strong" brand={brand} size="lg" style={{ color: tokens.textPrimary, margin: 0 }}>
              {product.title}
            </Text>
            <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
              {product.subtitle}
            </Text>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 8,
              justifyContent: "space-between"
            }}
          >
            <Text as="span" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
              {product.calories}
            </Text>
            <Text as="strong" brand={brand} size="lg" style={{ color: tokens.brandStrong, margin: 0 }}>
              {product.price}
            </Text>
          </div>
        </div>
      </div>
    </Module>
  );
}

export function DogInventoryShopLandingMobileScreen({
  brand = "Cars24"
}: DogInventoryShopLandingMobileScreenProps) {
  const tokens = getDogInventoryTokens(brand);

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
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: 34,
              boxSizing: "border-box",
              display: "grid",
              gridTemplateRows: "auto 1fr auto",
              height: 844,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                background: tokens.pageBackground,
                borderBottom: `1px solid ${tokens.border}`,
                display: "grid",
                gap: 12,
                padding: 12
              }}
            >
              <AppHeader
                actions={[
                  {
                    icon: <Icon decorative name="heart-like-outline" />,
                    label: "Wishlist"
                  },
                  {
                    icon: <Icon decorative name="basket-2-shopping-bag-outline" />,
                    label: "Cart"
                  }
                ]}
                avatarAppearance="Icon"
                avatarInitials="MP"
                brand={brand}
                level="Page - L1"
                locationLabel="Deliver to Milo • Sector 54"
                showAvatar={false}
                variant="Light"
              />

              <SearchBar
                brand={brand}
                color="Solid White"
                placeholder="Search kibble, chews, toys"
                size="Large"
              />

              <CategoryRail brand={brand} />
            </div>

            <div
              style={{
                background: tokens.pageBackground,
                boxSizing: "border-box",
                minHeight: 0,
                overflowX: "hidden",
                overflowY: "auto",
                padding: 12
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: 14
                }}
              >
                <HeroModule brand={brand} tokens={tokens} />

                <Banner
                  action
                  actionLabel="Claim now"
                  actionType="Text button"
                  brand={brand}
                  description="Unlock a free nutrition consult with every first order this week."
                  heading
                  state="Brand"
                  theme="Light"
                  title="Starter pack offer"
                />

                <div style={{ display: "grid", gap: 12 }}>
                  <SectionHeader
                    actionLabel="View all"
                    brand={brand}
                    description="Fast-moving picks for playful routines, picky eaters, and travel bags."
                    showAction
                    showDescription
                    showSubtitle={false}
                    showTag
                    subtitle=""
                    tagLabel="Trending"
                    title="Best sellers for the week"
                  />

                  <div style={{ display: "grid", gap: 12 }}>
                    {PRODUCTS.map((product) => (
                      <ProductCard
                        key={product.title}
                        brand={brand}
                        product={product}
                        tokens={tokens}
                      />
                    ))}
                  </div>
                </div>

                <Module
                  bodyMinHeight="auto"
                  brand={brand}
                  description="Filter bundles by age so we can balance taste, nutrition, and chewing difficulty."
                  footer={
                    <Button brand={brand} shape="Pill" size="Medium" styleVariant="Outline">
                      Explore all age-based kits
                    </Button>
                  }
                  headerActionLabel="See chart"
                  primaryAction={null}
                  showButtonGroup={false}
                  subtitle="Balanced by age and energy"
                  tagLabel="Smart filters"
                  title="Shop by life stage"
                >
                  <StageRail brand={brand} />
                </Module>

                <Banner
                  action={false}
                  brand={brand}
                  description="Orders above ₹799 arrive next day in Gurgaon, Noida, and South Delhi."
                  heading={false}
                  state="Info"
                  theme="Light"
                  title="Fast delivery zones expanded"
                />
              </div>
            </div>

            <ActionBar
              action={{
                variant: "Payment Strip",
                actionLabel: "Checkout",
                productCountLabel: "2 items ready",
                totalAmount: "₹1,248",
                totalPrefix: "Milo's cart"
              }}
              brand={brand}
              divider
              infoMessage={{
                description: "Free delivery unlocked",
                tone: "Positive"
              }}
              showHomeIndicator
            />
          </div>
        </ScreenCard>
      </div>
    </StoryPage>
  );
}

export const dogInventoryShopLandingMobileScreenSourceCode = `import {
  ActionBar,
  AppHeader,
  Banner,
  Button,
  ChoiceChip,
  Module,
  Ratings,
  SearchBar,
  SectionHeader,
  Tag
} from "@geist/web";

export function DogInventoryShopLandingMobileScreen() {
  return (
    <>
      <AppHeader
        brand="Cars24"
        level="Page - L1"
        variant="Light"
        locationLabel="Deliver to Milo • Sector 54"
      />
      <SearchBar brand="Cars24" color="Solid White" size="Large" placeholder="Search kibble, chews, toys" />
      <ChoiceChip brand="Cars24" label="All" size="Small" state="Active" variant="Horizontal" />
      <Module
        title="Tail-wagging inventory, packed for the week"
        subtitle="Daily essentials for playful dogs"
        description="Fresh meals, reward packs, and health add-ons curated around breed, age, and activity."
      />
      <SectionHeader brand="Cars24" title="Best sellers for the week" actionLabel="View all" showAction />
      <Tag brand="Cars24" color="Green" priority="Low" size="Large">Vet pick</Tag>
      <Ratings brand="Cars24" rating={4.8} size="Small" />
      <Button brand="Cars24" shape="Pill" size="Medium">Add to cart</Button>
      <ActionBar
        brand="Cars24"
        action={{ variant: "Payment Strip", productCountLabel: "2 items ready", totalPrefix: "Milo's cart", totalAmount: "₹1,248", actionLabel: "Checkout" }}
      />
    </>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: DogInventoryShopLandingMobileScreenProps) => (
    <DogInventoryShopLandingMobileScreen brand={brand} />
  ),
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(DOG_INVENTORY_LANDING_FIGMA_URL),
    docs: {
      source: {
        code: dogInventoryShopLandingMobileScreenSourceCode
      }
    }
  }
};
