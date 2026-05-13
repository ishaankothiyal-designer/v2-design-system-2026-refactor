import type { CSSProperties, HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";

export const canonicalAppRatingBannerWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.appRatingBanner"
);

export type AppRatingStoreLogoType = "google-play" | "app-store";

export interface AppRatingBannerPlaceholderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  variant?: "hero" | "overlay";
}

export interface AppRatingStoreLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  store: AppRatingStoreLogoType;
}

export interface AppRatingBannerMediaSlotProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  media?: ReactNode;
  showWidgetSlot?: boolean;
  widgetSlot?: ReactNode;
}

export interface AppRatingBannerInfoProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  title?: ReactNode;
  description?: ReactNode;
  downloadLabel?: ReactNode;
  showStoreLogos?: boolean;
  storeLogos?: AppRatingStoreLogoType[];
}

export interface AppRatingBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  title?: ReactNode;
  description?: ReactNode;
  downloadLabel?: ReactNode;
  media?: ReactNode;
  showStoreLogos?: boolean;
  showWidgetSlot?: boolean;
  storeLogos?: AppRatingStoreLogoType[];
  widgetSlot?: ReactNode;
}

const APP_RATING_BANNER_WIDTH = 336;
const APP_RATING_BANNER_MEDIA_HEIGHT = 160;
const APP_RATING_BANNER_WIDGET_LEFT = 210;
const APP_RATING_BANNER_WIDGET_TOP = 40;
const APP_RATING_BANNER_WIDGET_WIDTH = 86;
const APP_RATING_BANNER_WIDGET_HEIGHT = 80;
const APP_RATING_BANNER_PLACEHOLDER_ICON_SIZE = 48;
const APP_RATING_BANNER_SHADOW = "0 2px 2px rgba(31, 41, 55, 0.04)";

const DRIVE_PINK_50 = "var(--cars24-primitive-drive-pink-50, #FFE8F7)";
const DRIVE_PINK_100 = "var(--cars24-primitive-drive-pink-100, #FEB9E7)";
const DRIVE_PINK_500 = "var(--cars24-primitive-drive-pink-500, #FC1CB0)";

const googlePlayLogoSrc = new URL("./assets/app-rating-banner/google-play-logo.svg", import.meta.url).href;
const appleAppStoreLogoSrc = new URL("./assets/app-rating-banner/apple-app-store-logo.svg", import.meta.url).href;

const STORE_LOGO_CONFIG = {
  "google-play": {
    alt: "Google Play",
    height: 24,
    src: googlePlayLogoSrc,
    width: 22
  },
  "app-store": {
    alt: "App Store",
    height: 24,
    src: appleAppStoreLogoSrc,
    width: 24
  }
} satisfies Record<AppRatingStoreLogoType, { alt: string; height: number; src: string; width: number }>;

function toPx(value: number) {
  return pxToRem(value);
}

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function themeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function AddSlotGlyph() {
  const lineStyles: CSSProperties = {
    background: DRIVE_PINK_500,
    borderRadius: 999,
    display: "block",
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)"
  };

  return (
    <span
      aria-hidden="true"
      style={{
        border: `1.5px solid ${DRIVE_PINK_500}`,
        borderRadius: toPx(6),
        boxSizing: "border-box",
        display: "block",
        height: toPx(APP_RATING_BANNER_PLACEHOLDER_ICON_SIZE),
        position: "relative",
        width: toPx(APP_RATING_BANNER_PLACEHOLDER_ICON_SIZE)
      }}
    >
      <span style={{ ...lineStyles, height: toPx(1.5), width: toPx(24) }} />
      <span style={{ ...lineStyles, height: toPx(24), width: toPx(1.5) }} />
    </span>
  );
}

export function AppRatingBannerPlaceholder({
  brand = "Cars24",
  variant = "hero",
  className,
  style,
  ...rest
}: AppRatingBannerPlaceholderProps) {
  const background = variant === "overlay" ? DRIVE_PINK_50 : DRIVE_PINK_100;

  return (
    <div
      {...rest}
      aria-hidden="true"
      className={className}
      style={{
        alignItems: "center",
        background,
        boxSizing: "border-box",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        width: "100%",
        ...style
      }}
    >
      <AddSlotGlyph />
    </div>
  );
}

export function AppRatingStoreLogo({
  alt,
  className,
  store,
  style,
  ...rest
}: AppRatingStoreLogoProps) {
  const logo = STORE_LOGO_CONFIG[store];

  return (
    <img
      {...rest}
      alt={alt ?? logo.alt}
      className={className}
      src={logo.src}
      style={{
        display: "block",
        flex: "0 0 auto",
        height: toPx(logo.height),
        objectFit: "fill",
        width: toPx(logo.width),
        ...style
      }}
    />
  );
}

export function AppRatingBannerMediaSlot({
  brand = "Cars24",
  className,
  media,
  showWidgetSlot = true,
  style,
  widgetSlot,
  ...rest
}: AppRatingBannerMediaSlotProps) {
  return (
    <div
      {...rest}
      className={className}
      style={{
        background: DRIVE_PINK_100,
        boxSizing: "border-box",
        height: toPx(APP_RATING_BANNER_MEDIA_HEIGHT),
        overflow: "hidden",
        position: "relative",
        width: "100%",
        ...style
      }}
    >
      {media ? (
        <div
          style={{
            height: "100%",
            inset: 0,
            overflow: "hidden",
            position: "absolute",
            width: "100%"
          }}
        >
          {media}
        </div>
      ) : (
        <AppRatingBannerPlaceholder brand={brand} variant="hero" />
      )}

      {showWidgetSlot ? (
        <div
          style={{
            background: DRIVE_PINK_50,
            height: toPx(APP_RATING_BANNER_WIDGET_HEIGHT),
            left: toPx(APP_RATING_BANNER_WIDGET_LEFT),
            overflow: "hidden",
            position: "absolute",
            top: toPx(APP_RATING_BANNER_WIDGET_TOP),
            width: toPx(APP_RATING_BANNER_WIDGET_WIDTH)
          }}
        >
          {widgetSlot === undefined ? (
            <AppRatingBannerPlaceholder brand={brand} variant="overlay" />
          ) : (
            widgetSlot
          )}
        </div>
      ) : null}
    </div>
  );
}

export function AppRatingBannerInfo({
  brand = "Cars24",
  className,
  description = "Description up to 2 lines",
  downloadLabel = "Download app now",
  showStoreLogos = true,
  storeLogos = ["google-play", "app-store"],
  style,
  title = "Title",
  ...rest
}: AppRatingBannerInfoProps) {
  const fontFamily = `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`;
  const textPrimary = themeString(brand, "color.text.primary");
  const textSecondary = themeString(brand, "color.text.secondary");
  const surface = themeString(brand, "color.surface.canvas");
  const regular = themeNumber(brand, "typography.fontWeight.regular");
  const semibold = themeNumber(brand, "typography.fontWeight.semibold");
  const spacing3 = themeNumber(brand, "spacing.3");
  const spacing4 = themeNumber(brand, "spacing.4");

  const titleStyles: CSSProperties = {
    color: textPrimary,
    fontFamily,
    fontSize: "var(--cars24-typography-size-headline-h3, 17px)",
    fontWeight: semibold,
    letterSpacing: "0",
    lineHeight: "var(--cars24-typography-line-height-headline-h4, 20px)",
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  };

  const descriptionStyles: CSSProperties = {
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    color: textSecondary,
    display: "-webkit-box",
    fontFamily,
    fontSize: "var(--cars24-typography-size-utility-label-3, 12px)",
    fontWeight: regular,
    letterSpacing: "var(--cars24-typography-letter-spacing-utility-label-3, 0)",
    lineHeight: "var(--cars24-typography-line-height-utility-label-3, 16px)",
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%"
  };

  const downloadLabelStyles: CSSProperties = {
    color: textSecondary,
    flex: "0 1 auto",
    fontFamily,
    fontSize: "var(--cars24-typography-size-utility-label-2, 14px)",
    fontWeight: semibold,
    letterSpacing: "var(--cars24-typography-letter-spacing-utility-label-2, 0)",
    lineHeight: "var(--cars24-typography-line-height-utility-label-2, 18px)",
    margin: 0,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "flex-start",
        background: surface,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: toPx(spacing3),
        padding: `${toPx(spacing4)} ${toPx(spacing3)}`,
        width: "100%",
        ...style
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          gap: toPx(2),
          minWidth: 0,
          width: "100%"
        }}
      >
        <p style={titleStyles}>{title}</p>
        <p style={descriptionStyles}>{description}</p>
      </div>

      {showStoreLogos ? (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: toPx(spacing3),
            minWidth: 0,
            width: "100%"
          }}
        >
          <p style={downloadLabelStyles}>{downloadLabel}</p>
          <div
            aria-label="Available app stores"
            style={{
              alignItems: "center",
              display: "flex",
              flex: "0 0 auto",
              gap: toPx(spacing3)
            }}
          >
            {storeLogos.map((store) => (
              <AppRatingStoreLogo key={store} store={store} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * App rating download banner with a media slot, optional widget overlay, and store-logo CTA row.
 */
export function AppRatingBanner({
  brand = "Cars24",
  className,
  description,
  downloadLabel,
  media,
  showStoreLogos = true,
  showWidgetSlot = true,
  storeLogos,
  style,
  title,
  widgetSlot,
  ...rest
}: AppRatingBannerProps) {
  const radius = themeNumber(brand, "radius.md");

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "stretch",
        background: themeString(brand, "color.surface.canvas"),
        borderRadius: toPx(radius),
        boxShadow: APP_RATING_BANNER_SHADOW,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        overflow: "hidden",
        width: toPx(APP_RATING_BANNER_WIDTH),
        ...style
      }}
    >
      <AppRatingBannerMediaSlot
        brand={brand}
        media={media}
        showWidgetSlot={showWidgetSlot}
        widgetSlot={widgetSlot}
      />
      <AppRatingBannerInfo
        brand={brand}
        description={description}
        downloadLabel={downloadLabel}
        showStoreLogos={showStoreLogos}
        title={title}
        {...(storeLogos ? { storeLogos } : {})}
      />
    </div>
  );
}
