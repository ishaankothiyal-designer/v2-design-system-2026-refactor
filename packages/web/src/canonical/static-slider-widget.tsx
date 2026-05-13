import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode
} from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Button } from "./button";
import { ChoiceChip, type ChoiceChipState } from "./choice-chip";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";
import { StaticSliderFlexbox } from "./static-slider-flexbox";

export const canonicalStaticSliderWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.staticSliderWidget"
);

export interface StaticSliderWidgetTabItem {
  label: string;
  state?: ChoiceChipState;
}

export interface StaticSliderWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
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
  showTabSlider?: boolean;
  tabItems?: StaticSliderWidgetTabItem[];
  showCta?: boolean;
  ctaLabel?: string;
  ctaLeadingIcon?: ReactNode;
  ctaTrailingIcon?: ReactNode;
  onCtaClick?: () => void;
  children?: ReactNode;
}

const DEFAULT_TAB_ITEMS: StaticSliderWidgetTabItem[] = [
  { label: "Chip label", state: "Active" },
  { label: "Chip label", state: "Rest" },
  { label: "Chip label", state: "Rest" },
  { label: "Chip label", state: "Rest" },
  { label: "Chip label", state: "Rest" }
];

function DefaultSlider({
  brand = "Cars24",
  style
}: {
  brand?: DisplayBrandId;
  style?: CSSProperties;
}) {
  return (
    <StaticSliderFlexbox
      brand={brand}
      columnCount="1+"
      description="Description"
      row2={false}
      size="Medium"
      style={style}
      tagLabel="New"
      title="Title"
      type="Text Inside"
      viewportPadding="var(--cars24-misc-gap-12, 12px)"
    />
  );
}

function resolveSliderContent({
  brand,
  children
}: Pick<StaticSliderWidgetProps, "children"> & { brand: DisplayBrandId }) {
  if (!children) {
    return <DefaultSlider brand={brand} style={{ width: "100%" }} />;
  }

  if (!isValidElement(children)) {
    return children;
  }

  const element = children as ReactElement<{
    style?: CSSProperties;
    viewportPadding?: number | string;
  }>;

  return cloneElement(element, {
    style: {
      ...(element.props.style ?? {}),
      width: "100%"
    },
    viewportPadding: element.props.viewportPadding ?? "var(--cars24-misc-gap-12, 12px)"
  });
}

function TabSlider({
  brand,
  items
}: {
  brand: DisplayBrandId;
  items: StaticSliderWidgetTabItem[];
}) {
  const gap = pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.3")));

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div style={{ display: "flex", gap, width: "max-content" }}>
        {items.map((item, index) => (
          <ChoiceChip
            key={`${item.label}-${index}`}
            brand={brand}
            iconSwap
            label={item.label}
            leadingIcon={false}
            size="Default"
            state={item.state ?? "Rest"}
            trailingIcon={false}
            type="Regular"
            variant="Horizontal"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Discovery widget that combines the approved section header, optional choice-chip tab slider, a static slider flexbox, and a single full-width primary CTA.
 */
export function StaticSliderWidget({
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
  showTabSlider = false,
  tabItems = DEFAULT_TAB_ITEMS,
  showCta = true,
  ctaLabel = "Label",
  ctaLeadingIcon = <Icon decorative name="sparkle-filled" />,
  ctaTrailingIcon = <Icon decorative name="arrow-right-outline" />,
  onCtaClick,
  children,
  className,
  style,
  ...rest
}: StaticSliderWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const inverseSurface = String(getRequiredThemeTokenValue(brand, "color.surface.inverse"));
  const sliderContent = resolveSliderContent({ brand, children });

  const rootStyles: CSSProperties = {
    boxSizing: "border-box",
    maxWidth: pxToRem(360),
    paddingBlock: pxToRem(spacing3),
    width: "100%",
    ...style
  };

  const containerStyles: CSSProperties = {
    background: inverse ? inverseSurface : "transparent",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing3),
    padding: inverse ? `${pxToRem(spacing3)} ${pxToRem(spacing3)}` : `0 ${pxToRem(spacing3)}`,
    width: "100%"
  };

  const sliderViewportStyles: CSSProperties = {
    marginLeft: pxToRem(-spacing3),
    marginRight: pxToRem(-spacing3),
    width: `calc(100% + ${pxToRem(spacing3 * 2)})`
  };

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

        {showTabSlider ? <TabSlider brand={brand} items={tabItems} /> : null}

        <div style={sliderViewportStyles}>
          {sliderContent}
        </div>

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
    </div>
  );
}
