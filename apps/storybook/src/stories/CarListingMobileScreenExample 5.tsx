import type { CSSProperties, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import {
  Badge,
  Divider,
  Icon,
  IconButton,
  OwnershipBadge,
  SectionHeader,
  Text,
  getRequiredThemeTokenValue
} from "@geist/web";

export type UsedCarListingCardProps = {
  brand?: DisplayBrandId;
  listing?: Partial<UsedCarListingCardListing>;
};

type UsedCarListingCardListing = {
  ribbonLabel: string;
  title: string;
  subtitle: string;
  km: string;
  fuel: string;
  transmission: string;
  registration: string;
  distance: string;
  price: string;
  emi: string;
  saveAmount: string;
  imageAccent: string;
  imageBackground: string;
  imageBody: string;
};

type UsedCarListingCardTokens = {
  color: {
    surface: string;
    imageSurface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    brand: string;
    brandStrong: string;
    success: string;
    trust: string;
    chipSurface: string;
    ribbonText: string;
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    card: number;
    chip: number;
    pill: number;
    button: number;
  };
  border: {
    subtle: number;
  };
  shadow: {
    card: string;
  };
};

const DEFAULT_LISTING: UsedCarListingCardListing = {
  ribbonLabel: "Top picks",
  title: "2021 Range Rover Evoque",
  subtitle: "1.2 L I-VTEC V",
  km: "158,670 km",
  fuel: "Petrol",
  transmission: "Manual",
  registration: "KA-03",
  distance: "3.2km away",
  price: "₹40.32 lakh",
  emi: "EMI at ₹7,218/mo*",
  saveAmount: "Save 6 lakh",
  imageAccent: "#ECECEC",
  imageBackground: "#FBFDFF",
  imageBody: "#ECECEC"
};

function getUsedCarListingCardTokens(brand: DisplayBrandId): UsedCarListingCardTokens {
  return {
    color: {
      surface: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
      imageSurface: String(getRequiredThemeTokenValue(brand, "color.surface.subtle")),
      textPrimary: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
      textSecondary: String(getRequiredThemeTokenValue(brand, "color.text.secondary")),
      border: String(getRequiredThemeTokenValue(brand, "color.border.default")),
      brand: String(getRequiredThemeTokenValue(brand, "color.brand.primary.500")),
      brandStrong: String(getRequiredThemeTokenValue(brand, "color.brand.primary.600")),
      success: String(getRequiredThemeTokenValue(brand, "color.status.success")),
      trust: "#1D9BF0",
      chipSurface: "#F7FAFD",
      ribbonText: String(getRequiredThemeTokenValue(brand, "color.text.inverse"))
    },
    spacing: {
      xxs: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
      xs: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
      sm: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
      md: Number(getRequiredThemeTokenValue(brand, "spacing.4")),
      lg: Number(getRequiredThemeTokenValue(brand, "spacing.5")),
      xl: Number(getRequiredThemeTokenValue(brand, "spacing.6"))
    },
    radius: {
      card: Number(getRequiredThemeTokenValue(brand, "radius.xl")),
      chip: Number(getRequiredThemeTokenValue(brand, "radius.alt.md")),
      pill: Number(getRequiredThemeTokenValue(brand, "radius.pill")),
      button: Number(getRequiredThemeTokenValue(brand, "radius.alt.lg"))
    },
    border: {
      subtle: Number(getRequiredThemeTokenValue(brand, "component.divider.size.thickness.thin"))
    },
    // The system does not expose a dedicated shadow token here, so we keep one restrained card shadow.
    shadow: {
      card: "0 12px 30px rgba(15, 23, 42, 0.08)"
    }
  };
}

function Stack({
  children,
  direction = "column",
  gap,
  align,
  justify,
  wrap,
  style
}: {
  children: ReactNode;
  direction?: "row" | "column";
  gap?: number;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: CSSProperties["flexWrap"];
  style?: CSSProperties;
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

function createCarIllustration({
  imageAccent,
  imageBackground,
  imageBody
}: Pick<UsedCarListingCardListing, "imageAccent" | "imageBackground" | "imageBody">) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 250" role="img" aria-label="Used car image">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${imageBackground}" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
        <linearGradient id="car" x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="0%" stop-color="${imageBody}" />
          <stop offset="100%" stop-color="${imageAccent}" />
        </linearGradient>
      </defs>
      <rect width="420" height="250" fill="url(#bg)" />
      <path d="M0 186L158 126L255 146L343 101L420 121V250H0V186Z" fill="#F5F1FF" />
      <ellipse cx="194" cy="196" rx="136" ry="16" fill="#CBD5E1" opacity="0.28" />
      <path d="M74 171h232v-21l-24-22c-25-32-44-47-78-47h-69c-33 0-58 16-78 57l-17 12z" fill="url(#car)" />
      <path d="M108 133h156c-16-25-31-38-61-38h-45c-23 0-37 11-50 38z" fill="#FFFFFF" opacity="0.72" />
      <path d="M132 115h72c14 0 23 4 35 18H120c6-11 9-15 12-18z" fill="#DDE7F1" opacity="0.98" />
      <path d="M208 115h49c12 0 21 5 30 18h-85c4-11 5-14 6-18z" fill="#DDE7F1" opacity="0.98" />
      <rect x="80" y="154" width="26" height="10" rx="5" fill="#A2AFBC" />
      <rect x="280" y="154" width="26" height="10" rx="5" fill="#A2AFBC" />
      <rect x="256" y="134" width="33" height="8" rx="4" fill="#FFFFFF" opacity="0.94" />
      <rect x="104" y="134" width="29" height="8" rx="4" fill="#FFFFFF" opacity="0.94" />
      <circle cx="139" cy="175" r="25" fill="#141C28" />
      <circle cx="139" cy="175" r="11" fill="#E5ECF3" />
      <circle cx="254" cy="175" r="25" fill="#141C28" />
      <circle cx="254" cy="175" r="11" fill="#E5ECF3" />
      <rect x="228" y="170" width="53" height="18" rx="4" fill="#FFFFFF" opacity="0.86" />
      <rect x="230" y="172" width="49" height="14" rx="3" fill="#EEF2FF" />
      <rect x="238" y="173" width="9" height="12" rx="1.5" fill="#3B3BFF" />
      <rect x="249" y="173" width="26" height="12" rx="1.5" fill="#FFFFFF" />
      <path d="M108 143h89" stroke="#AEB8C2" stroke-width="2" stroke-linecap="round" opacity="0.4" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function TopRibbon({
  brand,
  label,
  tokens
}: {
  brand: DisplayBrandId;
  label: string;
  tokens: UsedCarListingCardTokens;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        background: `linear-gradient(90deg, ${tokens.color.brand} 0%, ${tokens.color.brandStrong} 100%)`,
        borderBottomRightRadius: tokens.radius.card,
        color: tokens.color.ribbonText,
        display: "inline-flex",
        height: 46,
        left: 0,
        paddingInline: tokens.spacing.lg,
        position: "absolute",
        top: 0,
        zIndex: 1
      }}
    >
      <Text as="strong" brand={brand} size="lg" tone="inverse" style={{ margin: 0 }}>
        {label}
      </Text>
    </div>
  );
}

function MetadataChip({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  return (
    <Badge
      brand={brand}
      labelText={label}
      pillShape="No"
      priority="Low"
      showLeadingIcon={false}
      showTrailingIcon={false}
      size="Medium"
      style={{ flex: "0 0 auto" }}
      type="Neutral"
    />
  );
}

export function UsedCarListingCard({
  brand = "Cars24",
  listing
}: UsedCarListingCardProps) {
  const tokens = getUsedCarListingCardTokens(brand);
  const content = {
    ...DEFAULT_LISTING,
    ...listing
  };

  return (
    <article
      aria-label={`${content.title} used car listing`}
      style={{
        background: tokens.color.surface,
        border: `${tokens.border.subtle}px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.card,
        boxShadow: tokens.shadow.card,
        display: "grid",
        gridTemplateColumns: "minmax(250px, 32%) minmax(0, 1fr)",
        maxWidth: 860,
        overflow: "hidden",
        width: "100%"
      }}
    >
      <div
        style={{
          background: `linear-gradient(180deg, ${tokens.color.surface} 0%, ${tokens.color.imageSurface} 100%)`,
          borderRight: `${tokens.border.subtle}px solid ${tokens.color.border}`,
          minHeight: 266,
          position: "relative"
        }}
      >
        <TopRibbon brand={brand} label={content.ribbonLabel} tokens={tokens} />

        <img
          alt={content.title}
          src={createCarIllustration(content)}
          style={{
            display: "block",
            height: 176,
            left: tokens.spacing.sm,
            objectFit: "contain",
            position: "absolute",
            right: tokens.spacing.sm,
            top: 72,
            width: `calc(100% - ${tokens.spacing.sm * 2}px)`
          }}
        />

        <div
          style={{
            bottom: tokens.spacing.lg,
            left: tokens.spacing.lg,
            position: "absolute"
          }}
        >
          <OwnershipBadge brand={brand} seller="Cars24 owned stock" />
        </div>
      </div>

      <Stack
        direction="column"
        style={{
          minWidth: 0
        }}
      >
        <Stack
          direction="column"
          gap={tokens.spacing.md}
          style={{
            padding: `${tokens.spacing.xl}px ${tokens.spacing.xl}px ${tokens.spacing.lg}px`
          }}
        >
          <Stack align="flex-start" justify="space-between" gap={tokens.spacing.md}>
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
              <SectionHeader
                brand={brand}
                description=""
                showAction={false}
                showDescription={false}
                showSubtitle
                showTag={false}
                subtitle={content.subtitle}
                title={content.title}
              />
            </div>

            <IconButton
              aria-label="Add to favorites"
              brand={brand}
              icon={<Icon name="Wishlist-outline" decorative />}
              shape="Round"
              size="Medium"
              styleVariant="Transparent"
            />
          </Stack>

          <Stack align="center" gap={tokens.spacing.sm} wrap="wrap">
            <Badge
              brand={brand}
              labelText="E L I T E"
              pillShape="Yes"
              priority="Low"
              showLeadingIcon={false}
              showTrailingIcon={false}
              size="Small"
              type="Neutral"
            />

            <Badge
              brand={brand}
              changeLeftIcon={<Icon name="diamond-shine-pop-polish-filled" decorative />}
              labelText="Top model"
              pillShape="Yes"
              priority="Low"
              showLeadingIcon
              showTrailingIcon={false}
              size="Small"
              type="Success"
            />
          </Stack>

          <Stack gap={tokens.spacing.sm} wrap="wrap">
            <MetadataChip brand={brand} label={content.km} />
            <MetadataChip brand={brand} label={content.fuel} />
            <MetadataChip brand={brand} label={content.transmission} />
            <MetadataChip brand={brand} label={content.registration} />
          </Stack>
        </Stack>

        <Stack
          align="center"
          justify="space-between"
          style={{
            background: "#F8FBFF",
            padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px`
          }}
        >
          <Stack align="center" gap={tokens.spacing.xs}>
            <Icon brand={brand} name="check-badge-fill" size="md" style={{ color: tokens.color.trust }} />
            <Text as="strong" brand={brand} size="lg" style={{ margin: 0 }}>
              ZERO Worry
            </Text>
            <Icon brand={brand} name="chevron-small-right-outline" size="sm" tone="secondary" />
          </Stack>

          <Stack align="center" gap={tokens.spacing.xs}>
            <Icon brand={brand} name="location-filled" size="sm" style={{ color: tokens.color.textPrimary }} />
            <Text as="span" brand={brand} size="lg" tone="secondary" style={{ margin: 0 }}>
              {content.distance}
            </Text>
          </Stack>
        </Stack>

        <Stack
          direction="column"
          gap={tokens.spacing.md}
          style={{
            padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px ${tokens.spacing.xl}px`
          }}
        >
          <Divider brand={brand} lineStyle="Dash" style={{ width: "100%" }} />

          <Stack align="baseline" gap={tokens.spacing.xs} wrap="wrap">
            <Text as="strong" brand={brand} size="xl" style={{ margin: 0 }}>
              {content.price}
            </Text>
            <Text as="span" brand={brand} size="md" tone="secondary" style={{ margin: 0 }}>
              |
            </Text>
            <Text as="span" brand={brand} size="lg" style={{ color: tokens.color.success, margin: 0 }}>
              {content.saveAmount}
            </Text>
            <Text as="span" brand={brand} size="lg" tone="secondary" style={{ margin: 0 }}>
              vs New car
            </Text>
          </Stack>

          <Text as="p" brand={brand} size="lg" tone="secondary" style={{ margin: 0 }}>
            {content.emi}
          </Text>
        </Stack>
      </Stack>
    </article>
  );
}

export const carListingScreenSourceCode = `import {
  Badge,
  Divider,
  Icon,
  IconButton,
  OwnershipBadge,
  SectionHeader,
  Text
} from "@geist/web";

export function UsedCarListingCard() {
  return (
    <article>
      <OwnershipBadge brand="Cars24" seller="Cars24 owned stock" />
      <SectionHeader
        brand="Cars24"
        title="2021 Range Rover Evoque"
        subtitle="1.2 L I-VTEC V"
        showSubtitle
        showDescription={false}
        showTag={false}
        showAction={false}
      />
      <Badge brand="Cars24" labelText="E L I T E" showLeadingIcon={false} showTrailingIcon={false} />
      <Badge brand="Cars24" labelText="Top model" type="Success" priority="Low" size="Small" showTrailingIcon={false} />
      <IconButton brand="Cars24" icon={<Icon name="Wishlist-outline" decorative />} shape="Round" styleVariant="Transparent" />
      <Divider brand="Cars24" lineStyle="Dash" />
      <Text brand="Cars24" as="strong" size="xl">₹40.32 lakh</Text>
    </article>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: UsedCarListingCardProps) => <UsedCarListingCard brand={brand} />,
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: carListingScreenSourceCode
      }
    }
  }
};
