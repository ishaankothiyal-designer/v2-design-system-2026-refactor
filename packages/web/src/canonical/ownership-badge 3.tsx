import type { CSSProperties, HTMLAttributes, ReactNode, SVGProps } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { getRequiredThemeTokenValue } from "../theme";

export type OwnershipBadgeSeller =
  | "Cars24 owned stock"
  | "Trusted partner dealer"
  | "Verified direct owner"
  | "Prime"
  | "Lite"
  | "Luxe"
  | "Private Seller"
  | "Dealer"
  | "Select"
  | "Dealer Listing"
  | "Luxury";

type OwnershipBadgeVariant = {
  background: string;
  borderColor: string;
  borderRadius: number;
  borderWidth: number;
  color: string;
  gap: number;
  height: number;
  paddingBlock?: number;
  paddingInlineStart: number;
  paddingInlineEnd: number;
  segmentedPillHeight?: number;
  segmentedPillMinWidth?: number;
  segmentedPillPaddingInline?: number;
  shadow?: string;
};

const FONT_SIZE = "var(--cars24-typography-size-utility-label-4, 11px)";
const LETTER_SPACING = "var(--cars24-typography-letter-spacing-utility-label-4, 0px)";
const LINE_HEIGHT = "17px";

const BRAND_BLUE = "#4736FE";
const BRAND_BORDER = "#D8D3FF";
const BRAND_SURFACE = "linear-gradient(180deg, #FFFFFF 0%, #F6F3FF 100%)";

const MINT_TEXT = "#0B936A";
const MINT_BORDER = "#A7E6DD";
const MINT_SURFACE = "linear-gradient(180deg, #FFFFFF 0%, #F5FFFC 100%)";

const RED_TEXT = "#FF2400";
const RED_BORDER = "#FFC8BD";
const RED_SURFACE = "linear-gradient(180deg, #FFFFFF 0%, #FFF6F3 100%)";

const BEIGE_TEXT = "#756E61";
const BEIGE_BORDER = "#DDD6C8";
const BEIGE_SURFACE = "linear-gradient(180deg, #FFFFFF 0%, #FBF7EF 100%)";

const LUXURY_TEXT = "#7A7366";
const LUXURY_BORDER = "#DDD7CC";
const LUXURY_SURFACE = "linear-gradient(180deg, #FFFFFF 0%, #F8F1E3 100%)";

const OWNERSHIP_BADGE_VARIANTS: Record<OwnershipBadgeSeller, OwnershipBadgeVariant> = {
  "Cars24 owned stock": {
    background: BRAND_SURFACE,
    borderColor: BRAND_BORDER,
    borderRadius: 40,
    borderWidth: 0.5,
    color: BRAND_BLUE,
    gap: 0,
    height: 21,
    paddingBlock: 2.5,
    paddingInlineStart: 9,
    paddingInlineEnd: 9
  },
  "Trusted partner dealer": {
    background: MINT_SURFACE,
    borderColor: MINT_BORDER,
    borderRadius: 40,
    borderWidth: 0.5,
    color: MINT_TEXT,
    gap: 4,
    height: 21,
    paddingBlock: 2,
    paddingInlineStart: 6,
    paddingInlineEnd: 6
  },
  "Verified direct owner": {
    background: RED_SURFACE,
    borderColor: RED_BORDER,
    borderRadius: 38.333,
    borderWidth: 0.5,
    color: RED_TEXT,
    gap: 4,
    height: 21,
    paddingBlock: 2,
    paddingInlineStart: 6,
    paddingInlineEnd: 6
  },
  Prime: {
    background: BRAND_SURFACE,
    borderColor: BRAND_BORDER,
    borderRadius: 46.667,
    borderWidth: 0.583,
    color: BRAND_BLUE,
    gap: 8,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 14,
    paddingInlineEnd: 4,
    segmentedPillHeight: 19,
    segmentedPillMinWidth: 92,
    segmentedPillPaddingInline: 18
  },
  Lite: {
    background: MINT_SURFACE,
    borderColor: "#A7F0EC",
    borderRadius: 46.667,
    borderWidth: 0.583,
    color: "#0F91A0",
    gap: 8,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 14,
    paddingInlineEnd: 4,
    segmentedPillHeight: 19,
    segmentedPillMinWidth: 72,
    segmentedPillPaddingInline: 14
  },
  Luxe: {
    background: BEIGE_SURFACE,
    borderColor: BEIGE_BORDER,
    borderRadius: 46.667,
    borderWidth: 0.583,
    color: BEIGE_TEXT,
    gap: 8,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 14,
    paddingInlineEnd: 4,
    segmentedPillHeight: 19,
    segmentedPillMinWidth: 82,
    segmentedPillPaddingInline: 15
  },
  "Private Seller": {
    background: RED_SURFACE,
    borderColor: RED_BORDER,
    borderRadius: 44.722,
    borderWidth: 0.583,
    color: RED_TEXT,
    gap: 0,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 7,
    paddingInlineEnd: 7
  },
  Dealer: {
    background: RED_SURFACE,
    borderColor: RED_BORDER,
    borderRadius: 44.722,
    borderWidth: 0.583,
    color: RED_TEXT,
    gap: 0,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 7,
    paddingInlineEnd: 7
  },
  Select: {
    background: BRAND_SURFACE,
    borderColor: BRAND_BORDER,
    borderRadius: 46.667,
    borderWidth: 0.583,
    color: BRAND_BLUE,
    gap: 3.5,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 4.667,
    paddingInlineEnd: 4.667,
    shadow: "0 1px 2px rgba(71, 54, 254, 0.05)"
  },
  "Dealer Listing": {
    background: RED_SURFACE,
    borderColor: RED_BORDER,
    borderRadius: 44.722,
    borderWidth: 0.583,
    color: RED_TEXT,
    gap: 1.167,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 7,
    paddingInlineEnd: 7
  },
  Luxury: {
    background: LUXURY_SURFACE,
    borderColor: LUXURY_BORDER,
    borderRadius: 46.667,
    borderWidth: 0.583,
    color: LUXURY_TEXT,
    gap: 3.5,
    height: 21,
    paddingBlock: 2.333,
    paddingInlineStart: 7,
    paddingInlineEnd: 7
  }
};

function makeRootStyles(
  brand: DisplayBrandId,
  seller: OwnershipBadgeSeller,
  style?: CSSProperties
): CSSProperties {
  const variant = OWNERSHIP_BADGE_VARIANTS[seller];
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));

  return {
    alignItems: "center",
    background: variant.background,
    border: `${variant.borderWidth}px solid ${variant.borderColor}`,
    borderRadius: `${variant.borderRadius}px`,
    boxShadow: variant.shadow,
    boxSizing: "border-box",
    color: variant.color,
    display: "inline-flex",
    gap: `${variant.gap}px`,
    height: `${variant.height}px`,
    justifyContent: "center",
    paddingBlock: `${variant.paddingBlock ?? 2.5}px`,
    paddingInlineEnd: `${variant.paddingInlineEnd}px`,
    paddingInlineStart: `${variant.paddingInlineStart}px`,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    width: "fit-content",
    ...makeTextStyles(fontFamily, fontWeight, variant.color),
    ...style
  };
}

function makeTextStyles(fontFamily: string, fontWeight: number, color: string): CSSProperties {
  return {
    color,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: FONT_SIZE,
    fontWeight,
    letterSpacing: LETTER_SPACING,
    lineHeight: LINE_HEIGHT
  };
}

function BadgeText({
  brand,
  children,
  color,
  weight = "semibold"
}: {
  brand: DisplayBrandId;
  children: ReactNode;
  color: string;
  weight?: "medium" | "semibold" | "bold";
}) {
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(
    getRequiredThemeTokenValue(
      brand,
      weight === "bold"
        ? "typography.fontWeight.bold"
        : weight === "medium"
          ? "typography.fontWeight.medium"
          : "typography.fontWeight.semibold"
    )
  );

  return <span style={makeTextStyles(fontFamily, fontWeight, color)}>{children}</span>;
}

function SegmentedPill({
  brand,
  label,
  background,
  borderColor,
  height = 18,
  minWidth,
  paddingInline = 10
}: {
  brand: DisplayBrandId;
  label: string;
  background: string;
  borderColor: string;
  height?: number;
  minWidth?: number;
  paddingInline?: number;
}) {
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.bold"));

  return (
    <span
      style={{
        alignItems: "center",
        background,
        border: `0.583px solid ${borderColor}`,
        borderRadius: "999px",
        boxShadow:
          "0 0 0 2px rgba(255, 255, 255, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 1px 2px rgba(0, 0, 0, 0.08)",
        boxSizing: "border-box",
        color: "#FFFFFF",
        display: "inline-flex",
        height: `${height}px`,
        justifyContent: "center",
        minWidth: minWidth ? `${minWidth}px` : undefined,
        paddingInline: `${paddingInline}px`
      }}
    >
      <span
        style={{
          color: "#FFFFFF",
          fontFamily: `${fontFamily}, sans-serif`,
          fontSize: "10.5px",
          fontWeight,
          letterSpacing: "0px",
          lineHeight: "1"
        }}
      >
        {label}
      </span>
    </span>
  );
}

function GlyphFrame({ children, size = 12 }: { children: ReactNode; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "center",
        display: "inline-flex",
        flexShrink: 0,
        height: `${size}px`,
        justifyContent: "center",
        width: `${size}px`
      }}
    >
      {children}
    </span>
  );
}

function Svg(props: SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props} />;
}

function OwnedStockWordmark() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="10"
      viewBox="0 0 120 10"
      width="120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.619 8.67401C2.90767 8.67401 2.28067 8.51268 1.738 8.19001C1.19533 7.86001 0.77 7.39434 0.462 6.79301C0.154 6.18434 0 5.45467 0 4.60401C0 3.76801 0.150333 3.04567 0.451 2.43701C0.751667 1.82101 1.17333 1.34801 1.716 1.01801C2.25867 0.680675 2.89667 0.512008 3.63 0.512008C4.62733 0.512008 5.401 0.761341 5.951 1.26001C6.501 1.75134 6.86033 2.44067 7.029 3.32801L5.533 3.40501C5.43767 2.89167 5.23233 2.48834 4.917 2.19501C4.60167 1.90167 4.17267 1.75501 3.63 1.75501C3.19 1.75501 2.80867 1.87234 2.486 2.10701C2.16333 2.34167 1.914 2.67167 1.738 3.09701C1.562 3.52234 1.474 4.02467 1.474 4.60401C1.474 5.19067 1.562 5.69667 1.738 6.12201C1.92133 6.54001 2.17433 6.86267 2.497 7.09001C2.81967 7.31734 3.19367 7.43101 3.619 7.43101C4.19833 7.43101 4.64567 7.27334 4.961 6.95801C5.28367 6.63534 5.489 6.19534 5.577 5.63801L7.073 5.71501C6.97033 6.32367 6.77233 6.85167 6.479 7.29901C6.18567 7.73901 5.797 8.08001 5.313 8.32201C4.83633 8.55667 4.27167 8.67401 3.619 8.67401Z" fill="#351ED8" />
      <path d="M7.38444 8.49801L10.2004 0.688008H11.9494L14.7654 8.49801H13.2694L12.6204 6.65001H9.52944L8.88044 8.49801H7.38444ZM9.94744 5.42901H12.2024L11.0804 2.12901L9.94744 5.42901Z" fill="#351ED8" />
      <path d="M15.5965 8.49801V0.688008H18.8635C19.4281 0.688008 19.9158 0.783341 20.3265 0.974008C20.7371 1.16467 21.0561 1.43601 21.2835 1.78801C21.5108 2.14001 21.6245 2.55434 21.6245 3.03101C21.6245 3.39034 21.5475 3.70934 21.3935 3.98801C21.2395 4.26667 21.0305 4.49034 20.7665 4.65901C20.5098 4.82767 20.2238 4.93034 19.9085 4.96701L19.8535 4.85701C20.3595 4.85701 20.7481 4.97067 21.0195 5.19801C21.2981 5.42534 21.4558 5.77367 21.4925 6.24301L21.6905 8.49801H20.2385L20.0735 6.45201C20.0515 6.14401 19.9525 5.91667 19.7765 5.77001C19.6005 5.62334 19.3071 5.55001 18.8965 5.55001H17.0265V8.49801H15.5965ZM17.0265 4.29601H18.7755C19.2081 4.29601 19.5455 4.19334 19.7875 3.98801C20.0295 3.78267 20.1505 3.49301 20.1505 3.11901C20.1505 2.73767 20.0258 2.44434 19.7765 2.23901C19.5345 2.03367 19.1788 1.93101 18.7095 1.93101H17.0265V4.29601Z" fill="#351ED8" />
      <path d="M25.9673 8.67401C25.322 8.67401 24.7646 8.56034 24.2953 8.33301C23.826 8.10567 23.4556 7.79034 23.1843 7.38701C22.9203 6.97634 22.7663 6.49967 22.7223 5.95701L24.1743 5.86901C24.2183 6.20634 24.3136 6.49234 24.4603 6.72701C24.6143 6.96167 24.816 7.14134 25.0653 7.26601C25.322 7.38334 25.63 7.44201 25.9893 7.44201C26.2973 7.44201 26.5576 7.40534 26.7703 7.33201C26.9903 7.25134 27.1553 7.13767 27.2653 6.99101C27.3826 6.83701 27.4413 6.65001 27.4413 6.43001C27.4413 6.23201 27.3936 6.05601 27.2983 5.90201C27.203 5.74067 27.0196 5.59767 26.7483 5.47301C26.477 5.34101 26.0736 5.21267 25.5383 5.08801C24.893 4.94134 24.376 4.77634 23.9873 4.59301C23.5986 4.40234 23.3163 4.16767 23.1403 3.88901C22.9643 3.60301 22.8763 3.24734 22.8763 2.82201C22.8763 2.36734 22.99 1.96767 23.2173 1.62301C23.4446 1.27101 23.7673 0.999674 24.1853 0.809007C24.6033 0.611008 25.1056 0.512008 25.6923 0.512008C26.3156 0.512008 26.8436 0.625674 27.2763 0.853007C27.709 1.07301 28.05 1.37734 28.2993 1.76601C28.5486 2.15467 28.7026 2.60201 28.7613 3.10801L27.3203 3.17401C27.2836 2.88801 27.1956 2.63867 27.0563 2.42601C26.9243 2.21334 26.741 2.04834 26.5063 1.93101C26.279 1.80634 26.0003 1.74401 25.6703 1.74401C25.2596 1.74401 24.9333 1.83934 24.6913 2.03001C24.4566 2.21334 24.3393 2.45901 24.3393 2.76701C24.3393 2.97967 24.387 3.15567 24.4823 3.29501C24.585 3.43434 24.7646 3.55534 25.0213 3.65801C25.278 3.75334 25.6373 3.85601 26.0993 3.96601C26.796 4.11267 27.3496 4.29967 27.7603 4.52701C28.171 4.75434 28.4643 5.01834 28.6403 5.31901C28.8163 5.61967 28.9043 5.96434 28.9043 6.35301C28.9043 6.82967 28.7833 7.24401 28.5413 7.59601C28.2993 7.94067 27.9583 8.20834 27.5183 8.39901C27.0783 8.58234 26.5613 8.67401 25.9673 8.67401Z" fill="#351ED8" />
      <path d="M30.0071 8.49801C30.0071 7.86734 30.0951 7.31734 30.2711 6.84801C30.4471 6.37134 30.7441 5.93867 31.1621 5.55001C31.5801 5.15401 32.1447 4.76901 32.8561 4.39501C33.2081 4.20434 33.4904 4.03567 33.7031 3.88901C33.9157 3.74234 34.0697 3.59201 34.1651 3.43801C34.2604 3.27667 34.3081 3.08601 34.3081 2.86601C34.3081 2.64601 34.2604 2.45534 34.1651 2.29401C34.0697 2.12534 33.9267 1.99334 33.7361 1.89801C33.5527 1.80267 33.3217 1.75501 33.0431 1.75501C32.5957 1.75501 32.2401 1.88334 31.9761 2.14001C31.7194 2.38934 31.5617 2.74867 31.5031 3.21801L30.0291 3.13001C30.1024 2.31601 30.3994 1.67801 30.9201 1.21601C31.4481 0.746675 32.1557 0.512008 33.0431 0.512008C33.6151 0.512008 34.1064 0.611008 34.5171 0.809007C34.9277 0.999674 35.2394 1.27101 35.4521 1.62301C35.6721 1.97501 35.7821 2.38201 35.7821 2.84401C35.7821 3.24001 35.7124 3.58101 35.5731 3.86701C35.4411 4.15301 35.2211 4.41701 34.9131 4.65901C34.6124 4.89367 34.2054 5.14667 33.6921 5.41801C33.0467 5.76267 32.5627 6.09634 32.2401 6.41901C31.9174 6.73434 31.7451 7.01301 31.7231 7.25501H35.7821V8.49801H30.0071Z" fill="#351ED8" />
      <path d="M40.3599 8.49801V6.93601H36.4439V5.77001L40.1289 0.688008H41.7899V5.69301H42.7249V6.93601H41.7899V8.49801H40.3599ZM38.0059 5.69301H40.3599V2.54701L38.0059 5.69301Z" fill="#351ED8" />
      <path d="M57.1409 0.0769566C56.8928 -0.162921 56.4807 0.212509 56.7651 0.458064C57.0495 0.70362 57.3724 0.300511 57.1409 0.0769566ZM50.8757 9.71891V3.13646C50.8757 2.3267 51.741 1.19047 52.4566 0.7973L53.4079 0.38674C51.3553 0.0499881 49.2672 0.964434 48.218 2.69574C46.6208 5.33156 47.9097 8.73172 50.8757 9.71891ZM54.1785 0.599294V7.18174C54.1785 7.95212 53.3576 9.06954 52.6853 9.46378L51.6467 9.93147C53.9125 10.3023 56.1966 9.1398 57.1093 7.10581C58.2701 4.51896 56.9214 1.507 54.1785 0.599294Z" fill="white" />
      <path d="M50.8757 9.71891C47.9097 8.73172 46.6208 5.33156 48.218 2.69574C49.2672 0.964434 51.3553 0.0499881 53.4079 0.38674L52.4566 0.7973C51.741 1.19047 50.8757 2.3267 50.8757 3.13646V9.71891Z" fill="#351ED8" />
      <path d="M54.1785 0.599294C56.9214 1.507 58.2701 4.51896 57.1093 7.10581C56.1966 9.1398 53.9125 10.3023 51.6467 9.93147L52.6853 9.46378C53.3576 9.06954 54.1785 7.95212 54.1785 7.18174V0.599294Z" fill="#351ED8" />
      <path d="M60.529 8.49801L58.758 2.62401H60.199L61.343 6.90301L62.52 2.62401H63.752L64.94 6.90301L66.084 2.62401H67.525L65.754 8.49801H64.302L63.136 4.56001L61.981 8.49801H60.529Z" fill="#351ED8" />
      <path d="M68.2775 8.49801V2.62401H69.5535L69.6085 4.27401L69.4435 4.20801C69.5021 3.79734 69.6231 3.46734 69.8065 3.21801C69.9898 2.96867 70.2135 2.78534 70.4775 2.66801C70.7415 2.55067 71.0311 2.49201 71.3465 2.49201C71.7791 2.49201 72.1421 2.58734 72.4355 2.77801C72.7361 2.96867 72.9635 3.23267 73.1175 3.57001C73.2715 3.90001 73.3485 4.28501 73.3485 4.72501V8.49801H71.9405V5.17601C71.9405 4.84601 71.9075 4.56734 71.8415 4.34001C71.7755 4.11267 71.6655 3.94034 71.5115 3.82301C71.3648 3.69834 71.1668 3.63601 70.9175 3.63601C70.5435 3.63601 70.2428 3.76801 70.0155 4.03201C69.7955 4.29601 69.6855 4.67734 69.6855 5.17601V8.49801H68.2775Z" fill="#351ED8" />
      <path d="M77.2853 8.63001C76.6986 8.63001 76.1889 8.50534 75.7563 8.25601C75.3236 7.99934 74.9899 7.64001 74.7553 7.17801C74.5206 6.71601 74.4033 6.17701 74.4033 5.56101C74.4033 4.94501 74.5206 4.40967 74.7553 3.95501C74.9899 3.49301 75.3199 3.13367 75.7453 2.87701C76.1779 2.62034 76.6803 2.49201 77.2523 2.49201C77.8096 2.49201 78.2973 2.61667 78.7153 2.86601C79.1406 3.11534 79.4669 3.47467 79.6943 3.94401C79.9216 4.41334 80.0353 4.97801 80.0353 5.63801V5.95701H75.8663C75.8956 6.47034 76.0349 6.85901 76.2843 7.12301C76.5409 7.37967 76.8783 7.50801 77.2963 7.50801C77.6116 7.50801 77.8719 7.43834 78.0773 7.29901C78.2899 7.15234 78.4366 6.95067 78.5173 6.69401L79.9583 6.78201C79.7969 7.35401 79.4779 7.80501 79.0013 8.13501C78.5319 8.46501 77.9599 8.63001 77.2853 8.63001ZM75.8663 5.01101H78.5833C78.5539 4.53434 78.4183 4.18234 78.1763 3.95501C77.9343 3.72034 77.6263 3.60301 77.2523 3.60301C76.8783 3.60301 76.5666 3.72401 76.3173 3.96601C76.0753 4.20801 75.9249 4.55634 75.8663 5.01101Z" fill="#351ED8" />
      <path d="M83.2259 8.63001C82.7272 8.63001 82.2945 8.50534 81.9279 8.25601C81.5685 8.00667 81.2899 7.65101 81.0919 7.18901C80.8939 6.72701 80.7949 6.18434 80.7949 5.56101C80.7949 4.93767 80.8939 4.39501 81.0919 3.93301C81.2899 3.47101 81.5722 3.11534 81.9389 2.86601C82.3055 2.61667 82.7345 2.49201 83.2259 2.49201C83.6365 2.49201 83.9959 2.57634 84.3039 2.74501C84.6192 2.91367 84.8575 3.15201 85.0189 3.46001V0.688008H86.4269V8.49801H85.0849L85.0519 7.62901C84.8905 7.94434 84.6485 8.19001 84.3259 8.36601C84.0032 8.54201 83.6365 8.63001 83.2259 8.63001ZM83.6549 7.48601C83.9482 7.48601 84.1939 7.41267 84.3919 7.26601C84.5972 7.11934 84.7512 6.90301 84.8539 6.61701C84.9639 6.32367 85.0189 5.97167 85.0189 5.56101C85.0189 5.14301 84.9639 4.79101 84.8539 4.50501C84.7512 4.21901 84.5972 4.00267 84.3919 3.85601C84.1939 3.70934 83.9482 3.63601 83.6549 3.63601C83.2295 3.63601 82.8885 3.80834 82.6319 4.15301C82.3825 4.49034 82.2579 4.95967 82.2579 5.56101C82.2579 6.14767 82.3825 6.61701 82.6319 6.96901C82.8885 7.31367 83.2295 7.48601 83.6549 7.48601Z" fill="#351ED8" />
      <path d="M92.9545 8.63001C92.3752 8.63001 91.8875 8.54568 91.4915 8.37701C91.1028 8.20834 90.8022 7.97367 90.5895 7.67301C90.3768 7.37234 90.2558 7.03134 90.2265 6.65001L91.6675 6.58401C91.7188 6.89201 91.8472 7.13034 92.0525 7.29901C92.2578 7.46767 92.5622 7.55201 92.9655 7.55201C93.2955 7.55201 93.5522 7.50067 93.7355 7.39801C93.9262 7.28801 94.0215 7.11934 94.0215 6.89201C94.0215 6.76001 93.9885 6.65001 93.9225 6.56201C93.8565 6.47401 93.7318 6.39701 93.5485 6.33101C93.3652 6.26501 93.0938 6.19901 92.7345 6.13301C92.1332 6.03034 91.6602 5.90567 91.3155 5.75901C90.9708 5.60501 90.7252 5.41434 90.5785 5.18701C90.4392 4.95967 90.3695 4.67734 90.3695 4.34001C90.3695 3.79001 90.5785 3.34634 90.9965 3.00901C91.4218 2.66434 92.0415 2.49201 92.8555 2.49201C93.3835 2.49201 93.8272 2.58001 94.1865 2.75601C94.5458 2.92467 94.8245 3.15934 95.0225 3.46001C95.2278 3.75334 95.3562 4.09067 95.4075 4.47201L93.9885 4.53801C93.9518 4.34001 93.8858 4.16767 93.7905 4.02101C93.6952 3.87434 93.5668 3.76434 93.4055 3.69101C93.2442 3.61034 93.0535 3.57001 92.8335 3.57001C92.5035 3.57001 92.2542 3.63601 92.0855 3.76801C91.9168 3.90001 91.8325 4.07601 91.8325 4.29601C91.8325 4.45001 91.8692 4.57834 91.9425 4.68101C92.0232 4.78367 92.1515 4.86801 92.3275 4.93401C92.5035 4.99267 92.7382 5.04767 93.0315 5.09901C93.6475 5.19434 94.1315 5.31901 94.4835 5.47301C94.8428 5.61967 95.0958 5.81034 95.2425 6.04501C95.3965 6.27234 95.4735 6.54734 95.4735 6.87001C95.4735 7.24401 95.3672 7.56301 95.1545 7.82701C94.9492 8.09101 94.6558 8.29267 94.2745 8.43201C93.9005 8.56401 93.4605 8.63001 92.9545 8.63001Z" fill="#351ED8" />
      <path d="M98.7223 8.49801C98.1356 8.49801 97.7029 8.36234 97.4243 8.09101C97.153 7.81967 97.0173 7.39434 97.0173 6.81501V1.24901H98.4253V6.68301C98.4253 6.95434 98.484 7.14501 98.6013 7.25501C98.7186 7.35768 98.902 7.40901 99.1513 7.40901H99.9763V8.49801H98.7223ZM96.0933 3.71301V2.62401H99.9763V3.71301H96.0933Z" fill="#351ED8" />
      <path d="M103.464 8.63001C102.885 8.63001 102.375 8.50534 101.935 8.25601C101.503 7.99934 101.165 7.64001 100.923 7.17801C100.689 6.71601 100.571 6.17701 100.571 5.56101C100.571 4.93767 100.689 4.39867 100.923 3.94401C101.165 3.48201 101.503 3.12634 101.935 2.87701C102.375 2.62034 102.885 2.49201 103.464 2.49201C104.044 2.49201 104.55 2.62034 104.982 2.87701C105.415 3.12634 105.749 3.48201 105.983 3.94401C106.225 4.39867 106.346 4.93767 106.346 5.56101C106.346 6.17701 106.225 6.71601 105.983 7.17801C105.749 7.64001 105.415 7.99934 104.982 8.25601C104.55 8.50534 104.044 8.63001 103.464 8.63001ZM103.464 7.48601C103.919 7.48601 104.267 7.31734 104.509 6.98001C104.759 6.64267 104.883 6.16967 104.883 5.56101C104.883 4.95967 104.759 4.49034 104.509 4.15301C104.267 3.80834 103.919 3.63601 103.464 3.63601C103.01 3.63601 102.658 3.80834 102.408 4.15301C102.159 4.49034 102.034 4.95967 102.034 5.56101C102.034 6.16967 102.159 6.64267 102.408 6.98001C102.658 7.31734 103.01 7.48601 103.464 7.48601Z" fill="#351ED8" />
      <path d="M109.985 8.63001C109.398 8.63001 108.888 8.50534 108.456 8.25601C108.023 7.99934 107.686 7.64001 107.444 7.17801C107.209 6.71601 107.092 6.17701 107.092 5.56101C107.092 4.94501 107.209 4.40967 107.444 3.95501C107.686 3.49301 108.023 3.13367 108.456 2.87701C108.888 2.62034 109.398 2.49201 109.985 2.49201C110.483 2.49201 110.927 2.58001 111.316 2.75601C111.704 2.93201 112.02 3.18501 112.262 3.51501C112.511 3.83767 112.665 4.23367 112.724 4.70301L111.272 4.78001C111.213 4.40601 111.066 4.12367 110.832 3.93301C110.604 3.73501 110.322 3.63601 109.985 3.63601C109.53 3.63601 109.178 3.80834 108.929 4.15301C108.679 4.49034 108.555 4.95967 108.555 5.56101C108.555 6.16967 108.679 6.64267 108.929 6.98001C109.178 7.31734 109.53 7.48601 109.985 7.48601C110.329 7.48601 110.615 7.38701 110.843 7.18901C111.077 6.99101 111.22 6.68301 111.272 6.26501L112.724 6.33101C112.665 6.80034 112.515 7.20734 112.273 7.55201C112.031 7.89667 111.715 8.16434 111.327 8.35501C110.938 8.53834 110.491 8.63001 109.985 8.63001Z" fill="#351ED8" />
      <path d="M113.706 8.49801V0.688008H115.114V5.27501L117.523 2.62401H119.261L116.962 5.06601L119.338 8.49801H117.754L116.038 5.90201L115.114 6.88101V8.49801H113.706Z" fill="#351ED8" />
    </svg>
  );
}

function PartnerDealerGlyph() {
  return (
    <Svg width="12" height="12">
      <path
        d="M8.042 1.333C11.355 1.333 14 3.955 14 7.25C14 10.563 11.332 13.208 8.042 13.208V9.517H6.455L3.6 13.208H1.5L4.548 9.328C2.987 8.732 1.875 7.248 1.875 5.527C1.875 3.187 3.785 1.333 6.125 1.333H8.042ZM7.763 3.502H6.054C4.919 3.502 4.017 4.403 4.017 5.527C4.017 6.652 4.919 7.553 6.054 7.553H7.763V3.502Z"
        fill={MINT_TEXT}
      />
    </Svg>
  );
}

function DirectOwnerGlyph() {
  return (
    <Svg width="12" height="12">
      <circle cx="8" cy="8" r="8" fill={RED_TEXT} />
      <path
        d="M4.1 8.138H7.11L5.284 10.02H6.82L10.62 6.189L6.82 2.356H5.284L7.11 4.24H4.1V8.138Z"
        fill="white"
      />
    </Svg>
  );
}

function SelectGlyph() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14">
      <path
        d="M7 1.042L11.813 2.399V6.17C11.813 8.827 10.11 11.248 7 12.958C3.89 11.248 2.188 8.827 2.188 6.17V2.399L7 1.042Z"
        fill={BRAND_BLUE}
      />
      <path
        d="M7 2.106L10.771 3.167V6.17C10.771 8.32 9.403 10.294 7 11.708C4.597 10.294 3.229 8.32 3.229 6.17V3.167L7 2.106Z"
        fill="white"
        fillOpacity="0.12"
      />
      <path
        d="M5.85 7.905L4.346 6.402L3.604 7.143L5.85 9.39L10.396 4.843L9.654 4.101L5.85 7.905Z"
        fill="white"
      />
    </Svg>
  );
}

function DealerListingGlyph() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14">
      <path
        d="M7 0.875L8.799 2.073L10.964 1.934L11.673 3.985L13.467 5.182L12.758 7.234L13.467 9.286L11.673 10.483L10.964 12.535L8.799 12.395L7 13.593L5.201 12.395L3.036 12.535L2.327 10.483L0.533 9.286L1.242 7.234L0.533 5.182L2.327 3.985L3.036 1.934L5.201 2.073L7 0.875Z"
        fill={RED_TEXT}
      />
      <path
        d="M5.917 9.502L3.958 7.543L5.009 6.492L5.917 7.4L9.062 4.255L10.113 5.307L5.917 9.502Z"
        fill="white"
      />
    </Svg>
  );
}

function LuxuryGlyph() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14">
      <path
        d="M4.274 2.333H9.726L12.25 5.385L7 11.667L1.75 5.385L4.274 2.333Z"
        stroke="#B5A88F"
        strokeWidth="1.25"
      />
      <path d="M4.274 2.333L5.942 5.385M9.726 2.333L8.058 5.385M1.75 5.385H12.25M7 2.333V11.667" stroke="#B5A88F" strokeWidth="1.25" />
    </Svg>
  );
}

function renderSellerContent(brand: DisplayBrandId, seller: OwnershipBadgeSeller) {
  switch (seller) {
    case "Cars24 owned stock":
      return <OwnedStockWordmark />;
    case "Trusted partner dealer":
      return (
        <>
          <BadgeText brand={brand} color={MINT_TEXT}>
            Trusted
          </BadgeText>
          <GlyphFrame>
            <PartnerDealerGlyph />
          </GlyphFrame>
          <BadgeText brand={brand} color={MINT_TEXT}>
            Partner dealer
          </BadgeText>
        </>
      );
    case "Verified direct owner":
      return (
        <>
          <BadgeText brand={brand} color={RED_TEXT}>
            Verified
          </BadgeText>
          <GlyphFrame>
            <DirectOwnerGlyph />
          </GlyphFrame>
          <BadgeText brand={brand} color={RED_TEXT}>
            Direct owner
          </BadgeText>
        </>
      );
    case "Prime":
      return (
        <>
          <BadgeText brand={brand} color={BRAND_BLUE}>
            Cars24
          </BadgeText>
          <SegmentedPill
            brand={brand}
            label="Prime"
            background="linear-gradient(180deg, #7C78FF 0%, #5847FF 52%, #4332F2 100%)"
            borderColor="#8E88FF"
            height={18}
            minWidth={51}
            paddingInline={12}
          />
        </>
      );
    case "Lite":
      return (
        <>
          <BadgeText brand={brand} color="#0E8F9F">
            Cars24
          </BadgeText>
          <SegmentedPill
            brand={brand}
            label="Lite"
            background="linear-gradient(180deg, #0DB5BE 0%, #0A8F98 55%, #0A7276 100%)"
            borderColor="#2DC7CD"
            height={18}
            minWidth={41}
            paddingInline={10}
          />
        </>
      );
    case "Luxe":
      return (
        <>
          <BadgeText brand={brand} color={BEIGE_TEXT}>
            Cars24
          </BadgeText>
          <SegmentedPill
            brand={brand}
            label="Luxe"
            background="linear-gradient(180deg, #9D917D 0%, #7B7366 55%, #665F52 100%)"
            borderColor="#B3AA9B"
            height={18}
            minWidth={45}
            paddingInline={10}
          />
        </>
      );
    case "Private Seller":
      return (
        <BadgeText brand={brand} color={RED_TEXT}>
          Private Seller
        </BadgeText>
      );
    case "Dealer":
      return (
        <BadgeText brand={brand} color={RED_TEXT}>
          Dealer
        </BadgeText>
      );
    case "Select":
      return (
        <>
          <GlyphFrame size={14}>
            <SelectGlyph />
          </GlyphFrame>
          <BadgeText brand={brand} color={BRAND_BLUE}>
            Cars24 Select
          </BadgeText>
        </>
      );
    case "Dealer Listing":
      return (
        <>
          <GlyphFrame size={14}>
            <DealerListingGlyph />
          </GlyphFrame>
          <BadgeText brand={brand} color={RED_TEXT}>
            Dealer listing
          </BadgeText>
        </>
      );
    case "Luxury":
      return (
        <>
          <GlyphFrame size={14}>
            <LuxuryGlyph />
          </GlyphFrame>
          <BadgeText brand={brand} color={LUXURY_TEXT}>
            Cars24 Luxury
          </BadgeText>
        </>
      );
    default:
      return null;
  }
}

export interface OwnershipBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  brand?: DisplayBrandId;
  seller?: OwnershipBadgeSeller;
}

/**
 * Seller ownership badge with Figma-matched composition, gradients, and inline glyphs.
 */
export function OwnershipBadge({
  brand = "Cars24",
  seller = "Cars24 owned stock",
  style,
  ...rest
}: OwnershipBadgeProps) {
  return (
    <span {...rest} style={makeRootStyles(brand, seller, style)}>
      {renderSellerContent(brand, seller)}
    </span>
  );
}
