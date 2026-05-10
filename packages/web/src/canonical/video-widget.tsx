import { Children, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";
import { VideoCard, type VideoCardSize } from "./video-card";

export const canonicalVideoWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.videoWidget"
);

const VIDEO_WIDGET_WIDTH = 360;
const DEFAULT_DARK_WIDGET_SURFACE = "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)";

export interface VideoWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
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
  children?: ReactNode;
  showCta?: boolean;
  scrollable?: boolean;
  videoCardSize?: VideoCardSize;
  primaryAction?: ButtonGroupButtonAction | null;
}

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon decorative name="sparkle-filled" />,
    trailingIcon: <Icon decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function buildDefaultVideoCards(brand: DisplayBrandId, size: VideoCardSize) {
  return [
    <VideoCard brand={brand} description="Description" key="video-card-1" size={size} title="Title" value="Value" />,
    <VideoCard brand={brand} description="Description" key="video-card-2" size={size} title="Title" value="Value" />,
    <VideoCard brand={brand} description="Description" key="video-card-3" size={size} title="Title" value="Value" />
  ];
}

/**
 * Widget-level video discovery surface that combines the approved section header, a clipped row of video cards, and a single primary CTA.
 */
export function VideoWidget({
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
  children,
  showCta = true,
  scrollable = true,
  videoCardSize = "Small",
  primaryAction,
  className,
  style,
  ...rest
}: VideoWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const canvasSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;

  const rootStyles: CSSProperties = {
    background: inverse ? DEFAULT_DARK_WIDGET_SURFACE : canvasSurface,
    boxSizing: "border-box",
    maxWidth: pxToRem(VIDEO_WIDGET_WIDTH),
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

  const railViewportStyles: CSSProperties = {
    WebkitOverflowScrolling: scrollable ? "touch" : undefined,
    msOverflowStyle: scrollable ? "none" : undefined,
    overflowX: scrollable ? "auto" : "hidden",
    overflowY: "hidden",
    scrollSnapType: scrollable ? "x proximity" : undefined,
    scrollbarWidth: scrollable ? "none" : undefined,
    width: "100%"
  };

  const railStyles: CSSProperties = {
    display: "flex",
    gap: pxToRem(spacing3),
    width: "max-content"
  };

  const railItemStyles: CSSProperties = {
    display: "flex",
    flexShrink: 0,
    scrollSnapAlign: scrollable ? "start" : undefined
  };

  const railItems = Children.toArray(children ?? buildDefaultVideoCards(brand, videoCardSize)).map(
    (child, index) => (
      <div key={`video-widget-item-${index}`} role="listitem" style={railItemStyles}>
        {child}
      </div>
    )
  );

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

        <div role="list" style={railViewportStyles}>
          <div style={railStyles}>{railItems}</div>
        </div>

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
