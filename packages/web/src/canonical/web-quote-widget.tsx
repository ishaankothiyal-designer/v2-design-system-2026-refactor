import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";
import { WebQuoteCard, type WebQuoteCardBottomInfoType } from "./web-quote-card";

export const canonicalWebQuoteWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.webQuoteWidget"
);

export interface WebQuoteWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
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
  kicker?: string;
  amount?: string;
  priceVisible?: boolean;
  hiddenDigitCount?: number;
  badgeLabel?: string;
  bottomInfoType?: WebQuoteCardBottomInfoType;
  bottomActionLabel?: string;
  bottomDescription?: string;
  onBottomActionClick?: () => void;
  showCta?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
}

function toPx(value: number) {
  return pxToRem(value);
}

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  const buttonHeight = toPx(Number(getRequiredThemeTokenValue(brand, "component.button.size.md.height")));

  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    style: {
      height: buttonHeight,
      minHeight: buttonHeight
    },
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

export function WebQuoteWidget({
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
  kicker = "Label - 12px regular",
  amount = "Display2 24px Bold",
  priceVisible = true,
  hiddenDigitCount = 9,
  badgeLabel = "Badge",
  bottomInfoType = "Link Button",
  bottomActionLabel = "Label",
  bottomDescription = "Description - 12px regular",
  onBottomActionClick,
  showCta = true,
  primaryAction,
  className,
  style,
  ...rest
}: WebQuoteWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const cardWidth = Number(getRequiredThemeTokenValue(brand, "component.webQuoteCard.layout.width"));
  const background = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const widgetWidth = cardWidth + spacing3 * 2;
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction(brand) : primaryAction;

  const rootStyles: CSSProperties = {
    alignItems: "flex-start",
    background,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: toPx(spacing3),
    justifyContent: "center",
    maxWidth: "100%",
    overflow: "hidden",
    padding: toPx(spacing3),
    width: toPx(widgetWidth),
    ...style
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
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

      <WebQuoteCard
        amount={amount}
        badgeLabel={badgeLabel}
        bottomActionLabel={bottomActionLabel}
        bottomDescription={bottomDescription}
        bottomInfoType={bottomInfoType}
        brand={brand}
        hiddenDigitCount={hiddenDigitCount}
        kicker={kicker}
        priceVisible={priceVisible}
        style={{ width: "100%" }}
        {...(onBottomActionClick ? { onBottomActionClick } : {})}
      />

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
  );
}
