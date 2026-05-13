import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";
import { SoldCarCard, type SoldCarCardProps } from "./sold-car-card";

export const canonicalSoldCarCarouselWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.soldCarCarousel"
);

export interface SoldCarCarouselItem
  extends Pick<
    SoldCarCardProps,
    "avatar" | "buyerName" | "carModel" | "initials" | "location" | "media" | "price" | "soldAgoLabel"
  > {
  id?: string;
}

export interface SoldCarCarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  background?: CSSProperties["background"];
  header?: boolean;
  bottomCta?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  /** @deprecated Use `header` to match the Figma widget property. */
  showHeader?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showTag?: boolean;
  showHeaderAction?: boolean;
  headerActionLabel?: string;
  onHeaderActionClick?: () => void;
  cards?: SoldCarCarouselItem[];
  children?: ReactNode;
  primaryAction?: ButtonGroupButtonAction | null;
}

const DEFAULT_SOLD_CARS: SoldCarCarouselItem[] = [
  {
    id: "sold-car-1",
    buyerName: "Customer_name label3 - 12px 1 line",
    carModel: "Car model H5 - 13 SM",
    initials: "MT",
    location: "Location",
    price: "₹4.54L",
    soldAgoLabel: "7d ago"
  },
  {
    id: "sold-car-2",
    buyerName: "Customer_name label3 - 12px 1 line",
    carModel: "Car model H5 - 13 SM",
    initials: "MT",
    location: "Location",
    price: "₹4.54L",
    soldAgoLabel: "7d ago"
  }
];

const WIDGET_WIDTH = 360;

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies ButtonGroupButtonAction;
}

function DefaultSoldCarCards({
  brand,
  cards
}: {
  brand: DisplayBrandId;
  cards: SoldCarCarouselItem[];
}) {
  return (
    <>
      {cards.map((card, index) => {
        const { id, ...cardProps } = card;

        return (
          <SoldCarCard
            key={id ?? `${cardProps.carModel ?? "sold-car"}-${index}`}
            brand={brand}
            style={{ scrollSnapAlign: "start" }}
            {...cardProps}
          />
        );
      })}
    </>
  );
}

/**
 * Widget-level sold-car carousel with a section header, horizontally scrollable card row, and optional CTA.
 */
export function SoldCarCarousel({
  brand = "Cars24",
  background,
  header,
  bottomCta = true,
  title = "Section title",
  subtitle = "Section title line 2",
  description = "Description goes here upto 2 lines",
  tagLabel = "New",
  showHeader = true,
  showSubtitle = true,
  showDescription = true,
  showTag = true,
  showHeaderAction = true,
  headerActionLabel = "View all",
  onHeaderActionClick,
  cards = DEFAULT_SOLD_CARS,
  children,
  primaryAction,
  className,
  style,
  ...rest
}: SoldCarCarouselProps) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const spacing3Rem = pxToRem(spacing3);
  const isHeaderVisible = header ?? showHeader;
  const isBottomCtaVisible = bottomCta && primaryAction !== null;
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: background ?? surface,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing3Rem,
    justifyContent: "center",
    maxWidth: "100%",
    overflow: "hidden",
    padding: spacing3Rem,
    width: pxToRem(WIDGET_WIDTH),
    ...style
  };

  const carouselStyles: CSSProperties = {
    alignItems: "stretch",
    display: "flex",
    gap: spacing3Rem,
    overflowX: "auto",
    overflowY: "hidden",
    overscrollBehaviorX: "contain",
    scrollPaddingInline: spacing3Rem,
    scrollSnapType: "x proximity",
    scrollbarWidth: "thin",
    width: "100%"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      {isHeaderVisible ? (
        <SectionHeader
          actionLabel={headerActionLabel}
          brand={brand}
          description={description}
          inverse={false}
          showAction={showHeaderAction}
          showDescription={showDescription}
          showSubtitle={showSubtitle}
          showTag={showTag}
          subtitle={subtitle}
          tagLabel={tagLabel}
          title={title}
          {...(onHeaderActionClick ? { onActionClick: onHeaderActionClick } : {})}
        />
      ) : null}

      <div aria-label="Sold cars" style={carouselStyles}>
        {children ?? <DefaultSoldCarCards brand={brand} cards={cards} />}
      </div>

      {isBottomCtaVisible && resolvedPrimaryAction ? (
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
  );
}
