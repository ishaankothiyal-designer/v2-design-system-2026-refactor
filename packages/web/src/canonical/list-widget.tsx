import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Button } from "./button";
import { Icon } from "./icon";
import { ListCard } from "./list-card";
import { SectionHeader } from "./section-header";

export const canonicalListWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.listWidget"
);

const LIST_WIDGET_WIDTH = 360;
const DEFAULT_DARK_WIDGET_SURFACE = "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)";
const DEFAULT_DARK_CARD_SURFACE = "var(--cars24-semantic-bg-secondary-inverse, #262626)";

export interface ListWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
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
  showCta?: boolean;
  ctaLabel?: string;
  ctaLeadingIcon?: ReactNode;
  ctaTrailingIcon?: ReactNode;
  onCtaClick?: () => void;
  children?: ReactNode;
}

function DefaultListCards({
  brand = "Cars24",
  inverse = false
}: {
  brand?: DisplayBrandId;
  inverse?: boolean;
}) {
  return Array.from({ length: 5 }, (_, index) => (
    <ListCard
      key={`list-widget-card-${index + 1}`}
      brand={brand}
      inverse={inverse}
      style={inverse ? { background: DEFAULT_DARK_CARD_SURFACE } : undefined}
      subtitle="Subtitles can be coloured"
      title="Title left (H4) 15px"
      type="Small: 1T + 1ST"
    />
  ));
}

/**
 * Widget-level list composition that mirrors the workshop Figma pattern with an approved section header, five stacked list cards, and a full-width primary CTA.
 */
export function ListWidget({
  brand = "Cars24",
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
  showCta = true,
  ctaLabel = "Label",
  ctaLeadingIcon = <Icon decorative name="sparkle-filled" />,
  ctaTrailingIcon = <Icon decorative name="arrow-right-outline" />,
  onCtaClick,
  children,
  className,
  style,
  ...rest
}: ListWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const canvasSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));

  const rootStyles: CSSProperties = {
    background: inverse ? DEFAULT_DARK_WIDGET_SURFACE : canvasSurface,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing3),
    maxWidth: pxToRem(LIST_WIDGET_WIDTH),
    padding: pxToRem(spacing3),
    width: "100%",
    ...style
  };

  const stackStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing3),
    width: "100%"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
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

      <div style={stackStyles}>{children ?? <DefaultListCards brand={brand} inverse={inverse} />}</div>

      {showCta ? (
        <Button
          brand={brand}
          cta={{ text: ctaLabel, variant: "primary" }}
          leadingIcon={ctaLeadingIcon}
          onClick={onCtaClick}
          onDark={false}
          shape="Regular"
          size="Medium"
          style={{ width: "100%" }}
          trailingIcon={ctaTrailingIcon}
        />
      ) : null}
    </div>
  );
}
