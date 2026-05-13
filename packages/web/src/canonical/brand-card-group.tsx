import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { BrandCard, type BrandCardProps } from "./brand-card";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SearchBar } from "./search-bar";
import { SectionHeader } from "./section-header";

export const canonicalBrandCardGroupWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.brandCardGroup"
);

export interface BrandCardGroupItem extends Omit<BrandCardProps, "brand"> {
  id?: string;
}

export interface BrandCardGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  bottomCta?: boolean;
  heading?: boolean;
  searchFieldVisibility?: boolean;
  showRow2?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showHeaderAction?: boolean;
  headerActionLabel?: string;
  onHeaderActionClick?: () => void;
  searchPlaceholder?: string;
  rows?: BrandCardGroupItem[][];
  children?: ReactNode;
  primaryAction?: ButtonGroupButtonAction | null;
}

const WIDGET_WIDTH = 360;

const DEFAULT_BRAND_CARD_ROWS: BrandCardGroupItem[][] = [
  [
    { id: "maruti-row-1-1", label: "Maruti Suzuki" },
    { id: "maruti-row-1-2", label: "Maruti Suzuki" },
    { id: "maruti-row-1-3", label: "Maruti Suzuki" },
    { id: "maruti-row-1-4", label: "Maruti Suzuki" }
  ],
  [
    { id: "maruti-row-2-1", label: "Maruti Suzuki" },
    { id: "maruti-row-2-2", label: "Maruti Suzuki" },
    { id: "maruti-row-2-3", label: "Maruti Suzuki" },
    { id: "maruti-row-2-4", label: "Maruti Suzuki" }
  ]
];

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies ButtonGroupButtonAction;
}

function BrandCardRows({
  brand,
  rows
}: {
  brand: DisplayBrandId;
  rows: BrandCardGroupItem[][];
}) {
  return (
    <>
      {rows.map((row, rowIndex) => (
        <div key={`brand-card-row-${rowIndex + 1}`} role="list" style={rowStyles}>
          {row.map((card, cardIndex) => {
            const { id, style, ...cardProps } = card;

            return (
              <BrandCard
                key={id ?? `brand-card-${rowIndex + 1}-${cardIndex + 1}`}
                brand={brand}
                role="listitem"
                style={{
                  scrollSnapAlign: "start",
                  ...style
                }}
                {...cardProps}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

const rowStyles: CSSProperties = {
  alignItems: "center",
  display: "flex",
  flex: "0 0 auto",
  gap: "var(--cars24-misc-gap-12, 12px)",
  minWidth: "max-content"
};

/**
 * Widget-level brand picker that composes the approved section header, search bar, selectable brand cards, and CTA.
 */
export function BrandCardGroup({
  brand = "Cars24",
  bottomCta = true,
  heading = true,
  searchFieldVisibility = true,
  showRow2 = true,
  title = "Section title",
  subtitle = "Section title line 2",
  description = "Description goes here upto 2 lines",
  tagLabel = "New",
  showTag = true,
  showHeaderAction = true,
  headerActionLabel = "View all",
  onHeaderActionClick,
  searchPlaceholder = "Search",
  rows = DEFAULT_BRAND_CARD_ROWS,
  children,
  primaryAction,
  className,
  style,
  ...rest
}: BrandCardGroupProps) {
  const surface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const spacing3Rem = pxToRem(spacing3);
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;
  const visibleRows = showRow2 ? rows : rows.slice(0, 1);

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: surface,
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

  const scrollerStyles: CSSProperties = {
    overflowX: "auto",
    overflowY: "hidden",
    overscrollBehaviorX: "contain",
    scrollPaddingInline: spacing3Rem,
    scrollSnapType: "x proximity",
    scrollbarWidth: "thin",
    width: "100%"
  };

  const trackStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: spacing3Rem,
    minWidth: "max-content"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      {heading ? (
        <SectionHeader
          actionLabel={headerActionLabel}
          brand={brand}
          description={description}
          inverse={false}
          showAction={showHeaderAction}
          showDescription={Boolean(description)}
          showSubtitle={Boolean(subtitle)}
          showTag={showTag}
          subtitle={subtitle}
          tagLabel={tagLabel}
          title={title}
          {...(onHeaderActionClick ? { onActionClick: onHeaderActionClick } : {})}
        />
      ) : null}

      {searchFieldVisibility ? (
        <SearchBar
          brand={brand}
          color="Solid White"
          placeholder={searchPlaceholder}
          size="Small"
        />
      ) : null}

      <div aria-label="Brand cards" style={scrollerStyles}>
        <div style={trackStyles}>
          {children ?? <BrandCardRows brand={brand} rows={visibleRows} />}
        </div>
      </div>

      {bottomCta && resolvedPrimaryAction ? (
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
