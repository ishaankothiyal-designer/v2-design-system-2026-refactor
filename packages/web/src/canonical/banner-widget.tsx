import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { FullBleedBannerCard } from "./full-bleed-banner-card";
import { Icon } from "./icon";
import {
  RotatingBannerCard,
  type RotatingBannerCardItem,
  type RotatingBannerCardSize,
  type RotatingBannerCardSlideMode
} from "./rotating-banner-card";
import { SectionHeader } from "./section-header";
import { SingleBannerCard } from "./single-banner-card";

export const canonicalBannerWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.bannerWidget"
);

const BANNER_WIDGET_WIDTH = 360;

export type BannerWidgetBannerType = "Full Bleed" | "Single" | "Rotating";

export interface BannerWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  bannerType?: BannerWidgetBannerType;
  inverse?: boolean;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showHeaderAction?: boolean;
  headerActionLabel?: string;
  onHeaderActionClick?: () => void;
  titleIcon?: ReactNode;
  subtitleIcon?: ReactNode;
  children?: ReactNode;
  showCta?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
  onPlayClick?: MouseEventHandler<HTMLButtonElement>;
  playLabel?: string;
  rotatingAutoPlay?: boolean;
  rotatingItems?: RotatingBannerCardItem[];
  rotatingShowCopy?: boolean;
  rotatingSize?: RotatingBannerCardSize;
  rotatingSlideMode?: RotatingBannerCardSlideMode;
  video?: boolean;
}

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon decorative name="sparkle-filled" />,
    trailingIcon: <Icon decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function buildDefaultRotatingItems(media?: ReactNode): RotatingBannerCardItem[] {
  return [
    { id: "banner-widget-1", title: "Title", description: "Description", media },
    { id: "banner-widget-2", title: "Fresh arrivals", description: "Limited inventory", media },
    { id: "banner-widget-3", title: "Expert picks", description: "Curated for today", media },
    { id: "banner-widget-4", title: "Popular this week", description: "Trending banners", media },
    { id: "banner-widget-5", title: "Daily spotlight", description: "Updated every day", media }
  ];
}

/**
 * Discovery widget that mirrors the Figma banner-widget shell with a section header,
 * a switchable banner-card slot, and a single full-width primary CTA.
 */
export function BannerWidget({
  brand = "Cars24",
  bannerType = "Full Bleed",
  inverse = false,
  showHeader = true,
  title = "Section title",
  subtitle = "Section title line 2",
  description = "Description goes here upto 2 lines",
  tagLabel = "New",
  showTag = true,
  showHeaderAction = true,
  headerActionLabel = "View all",
  onHeaderActionClick,
  titleIcon,
  subtitleIcon,
  children,
  showCta = true,
  primaryAction,
  onPlayClick,
  playLabel = "Play video",
  rotatingAutoPlay = true,
  rotatingItems,
  rotatingShowCopy = true,
  rotatingSize = "Small",
  rotatingSlideMode = "Auto",
  video = true,
  className,
  style,
  ...rest
}: BannerWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const surfaceBackground = String(
    getRequiredThemeTokenValue(brand, inverse ? "color.surface.inverse" : "color.surface.canvas")
  );
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;
  const resolvedRotatingItems = rotatingItems ?? (children ? buildDefaultRotatingItems(children) : undefined);

  const rootStyles: CSSProperties = {
    background: surfaceBackground,
    boxSizing: "border-box",
    maxWidth: pxToRem(BANNER_WIDGET_WIDTH),
    paddingBlock: inverse ? pxToRem(spacing3) : undefined,
    width: "100%",
    ...style
  };

  const containerStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing3),
    padding: pxToRem(spacing3),
    width: "100%"
  };

  const bannerViewportStyles: CSSProperties = {
    overflow: "hidden",
    width: "100%"
  };

  const bannerStyles: CSSProperties = {
    display: "block",
    marginInline: pxToRem(-spacing3),
    maxWidth: "none"
  };

  let bannerContent: ReactNode;

  if (bannerType === "Single") {
    bannerContent = (
      <SingleBannerCard
        brand={brand}
        playLabel={playLabel}
        video={video}
        {...(onPlayClick ? { onPlayClick } : {})}
      >
        {children}
      </SingleBannerCard>
    );
  } else if (bannerType === "Rotating") {
    bannerContent = (
      <RotatingBannerCard
        autoPlay={rotatingAutoPlay}
        brand={brand}
        showCopy={rotatingShowCopy}
        size={rotatingSize}
        slideMode={rotatingSlideMode}
        {...(resolvedRotatingItems ? { items: resolvedRotatingItems } : {})}
      />
    );
  } else {
    bannerContent = (
      <div style={bannerViewportStyles}>
        <FullBleedBannerCard
          brand={brand}
          playLabel={playLabel}
          size="XS"
          style={bannerStyles}
          video={video}
          {...(onPlayClick ? { onPlayClick } : {})}
        >
          {children}
        </FullBleedBannerCard>
      </div>
    );
  }

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={containerStyles}>
        {showHeader ? (
          <SectionHeader
            actionLabel={headerActionLabel}
            brand={brand}
            description={description}
            inverse={inverse}
            showAction={showHeaderAction}
            showDescription={Boolean(description)}
            showSubtitle={Boolean(subtitle)}
            showTag={showTag}
            subtitle={subtitle}
            subtitleIcon={subtitleIcon}
            tagLabel={tagLabel}
            title={title}
            titleIcon={titleIcon}
            {...(onHeaderActionClick ? { onActionClick: onHeaderActionClick } : {})}
          />
        ) : null}

        {bannerContent}

        {showCta && resolvedPrimaryAction ? (
          <ButtonGroup
            brand={brand}
            onDark={false}
            primaryAction={resolvedPrimaryAction}
            shape="Regular"
            size="Medium"
            type="Vertical"
          />
        ) : null}
      </div>
    </div>
  );
}
