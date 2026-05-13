import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { AccordionGroup, type AccordionGroupItem } from "./accordion";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { ChipBar, type ChipBarItem } from "./chip-bar";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";

export const canonicalFaqWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.faqWidget"
);

export interface FaqWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
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
  tabItems?: ChipBarItem[];
  items?: AccordionGroupItem[];
  showBottomButton?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
}

const DEFAULT_FAQ_BODY =
  "With an accordion, users can click to expand or collapse content areas, making it simple to access details without overwhelming the screen.";

const DEFAULT_TAB_ITEMS: ChipBarItem[] = Array.from({ length: 5 }, (_, index) => ({
  key: `faq-chip-${index + 1}`,
  label: "Chip label",
  leadingIcon: false,
  trailingIcon: false
}));

const DEFAULT_FAQ_ITEMS: AccordionGroupItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: `faq-${index + 1}`,
  title: `FAQ ${index + 1}`,
  content: DEFAULT_FAQ_BODY,
  leadingIcon: false,
  size: "sm"
}));

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies ButtonGroupButtonAction;
}

/**
 * FAQ widget composition that mirrors the workshop Figma pattern using only approved canonical building blocks.
 */
export function FaqWidget({
  brand = "Cars24",
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
  showTabSlider = true,
  tabItems = DEFAULT_TAB_ITEMS,
  items = DEFAULT_FAQ_ITEMS,
  showBottomButton = false,
  primaryAction,
  className,
  style,
  ...rest
}: FaqWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const surfaceBackground = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;

  const rootStyles: CSSProperties = {
    background: surfaceBackground,
    boxSizing: "border-box",
    maxWidth: pxToRem(360),
    padding: pxToRem(spacing3),
    width: "100%",
    ...style
  };

  const contentStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing3),
    width: "100%"
  };

  const chipBarBleedStyles: CSSProperties = {
    marginLeft: pxToRem(-spacing3),
    marginRight: pxToRem(-spacing3),
    width: `calc(100% + ${pxToRem(spacing3 * 2)})`
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={contentStyles}>
        {showHeader ? (
          <SectionHeader
            actionLabel={headerActionLabel}
            brand={brand}
            description={description}
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

        {showTabSlider ? (
          <div style={chipBarBleedStyles}>
            <ChipBar brand={brand} firstRowItems={tabItems} showFilterChip={false} showRow2={false} />
          </div>
        ) : null}

        <AccordionGroup brand={brand} gap={spacing3} items={items} selectionMode="single" />

        {showBottomButton && resolvedPrimaryAction ? (
          <ButtonGroup
            brand={brand}
            primaryAction={resolvedPrimaryAction}
            shape="Regular"
            size="Large"
            type="Vertical"
          />
        ) : null}
      </div>
    </div>
  );
}
