import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { StoryCircle, type StoryCircleSize } from "./story-circle";

export const canonicalStorySliderWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.storySlider"
);

export type StorySliderSize = "Large" | "Small";

export interface StorySliderItem {
  imageAlt?: string;
  imageSrc?: string;
  media?: ReactNode;
  title?: string;
}

export interface StorySliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  items?: StorySliderItem[];
  scrollable?: boolean;
  size?: StorySliderSize;
  viewportPadding?: number | string;
}

type StorySliderMetrics = {
  itemWidth: number;
  viewportWidth: number;
};

const STORY_SLIDER_METRICS: Record<StorySliderSize, StorySliderMetrics> = {
  Large: {
    itemWidth: 96,
    viewportWidth: 336
  },
  Small: {
    itemWidth: 70,
    viewportWidth: 336
  }
};

const DEFAULT_ITEMS: StorySliderItem[] = Array.from({ length: 5 }, () => ({
  title: "Title"
}));

function resolveViewportPadding(viewportPadding: number | string | undefined) {
  if (viewportPadding === undefined) {
    return "0px";
  }

  return typeof viewportPadding === "number" ? pxToRem(viewportPadding) : viewportPadding;
}

function renderMedia(item: StorySliderItem) {
  if (item.media !== undefined) {
    return item.media;
  }

  if (item.imageSrc) {
    return (
      <img
        alt={item.imageAlt ?? `${item.title ?? "Story"} preview`}
        src={item.imageSrc}
        style={{
          display: "block",
          height: "100%",
          objectFit: "cover",
          width: "100%"
        }}
      />
    );
  }

  return undefined;
}

/**
 * Horizontal story rail composed from the approved Story Circle component, clipped to the Figma viewport width.
 */
export function StorySlider({
  brand = "Cars24",
  className,
  items = DEFAULT_ITEMS,
  role,
  scrollable = true,
  size = "Large",
  style,
  viewportPadding,
  ...rest
}: StorySliderProps) {
  const gap = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const metrics = STORY_SLIDER_METRICS[size];
  const resolvedViewportPadding = resolveViewportPadding(viewportPadding);
  const rowWidth =
    metrics.itemWidth * items.length + gap * Math.max(items.length - 1, 0);

  const rootStyles: CSSProperties = {
    boxSizing: "border-box",
    width: pxToRem(metrics.viewportWidth),
    ...style
  };

  const viewportStyles: CSSProperties = {
    boxSizing: "border-box",
    overflowX: scrollable ? "auto" : "hidden",
    overflowY: "hidden",
    paddingLeft: resolvedViewportPadding,
    paddingRight: resolvedViewportPadding,
    WebkitOverflowScrolling: scrollable ? "touch" : undefined,
    msOverflowStyle: scrollable ? "none" : undefined,
    scrollPaddingLeft: scrollable ? resolvedViewportPadding : undefined,
    scrollPaddingRight: scrollable ? resolvedViewportPadding : undefined,
    scrollSnapType: scrollable ? "x proximity" : undefined,
    scrollbarWidth: scrollable ? "none" : undefined,
    width: "100%"
  };

  const rowStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    gap: pxToRem(gap),
    width: pxToRem(rowWidth)
  };

  const itemStyles: CSSProperties = {
    display: "flex",
    flexShrink: 0,
    scrollSnapAlign: scrollable ? "start" : undefined
  };

  return (
    <div {...rest} className={className} role={role ?? "list"} style={rootStyles}>
      <div style={viewportStyles}>
        <div style={rowStyles}>
          {items.map((item, index) => (
            <div key={`story-slider-item-${index}`} role="listitem" style={itemStyles}>
              <StoryCircle brand={brand} size={size as StoryCircleSize} title={item.title ?? "Title"}>
                {renderMedia(item)}
              </StoryCircle>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
