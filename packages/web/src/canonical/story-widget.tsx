import {
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Button } from "./button";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";
import { StorySlider, type StorySliderProps } from "./story-slider";

export const canonicalStoryWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.storyWidget"
);

const STORY_WIDGET_WIDTH = 360;
const DEFAULT_LIGHT_WIDGET_SURFACE = "var(--cars24-semantic-bg-primary, #FFFFFF)";
const DEFAULT_DARK_WIDGET_SURFACE = "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)";

export interface StoryWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
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

function DefaultStorySlider({
  brand = "Cars24",
  style
}: {
  brand?: DisplayBrandId;
  style?: CSSProperties;
}) {
  return <StorySlider brand={brand} size="Large" style={style} />;
}

function resolveSliderContent({
  brand,
  children
}: Pick<StoryWidgetProps, "children"> & { brand: DisplayBrandId }) {
  if (!children) {
    return <DefaultStorySlider brand={brand} style={{ width: "100%" }} />;
  }

  if (!isValidElement(children)) {
    return children;
  }

  const element = children as ReactElement<{
    style?: CSSProperties;
  }>;

  return cloneElement(element, {
    style: {
      ...(element.props.style ?? {}),
      width: "100%"
    }
  });
}

/**
 * Story-focused discovery widget that combines the approved section header, story slider rail, and a single full-width primary CTA.
 */
export function StoryWidget({
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
}: StoryWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const spacing4 = Number(getRequiredThemeTokenValue(brand, "spacing.4"));
  const sliderContent = resolveSliderContent({ brand, children });

  const rootStyles: CSSProperties = {
    background: inverse ? DEFAULT_DARK_WIDGET_SURFACE : DEFAULT_LIGHT_WIDGET_SURFACE,
    boxSizing: "border-box",
    maxWidth: pxToRem(STORY_WIDGET_WIDTH),
    paddingBlock: inverse ? pxToRem(spacing3) : undefined,
    width: "100%",
    ...style
  };

  const containerStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(inverse ? spacing4 : spacing3),
    padding: pxToRem(spacing3),
    width: "100%"
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

        {sliderContent}

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
