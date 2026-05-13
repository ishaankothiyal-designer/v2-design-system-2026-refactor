import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  getReadableTextColor,
  getRequiredThemeTokenValue,
  pxToRem,
  sampleBackgroundImageIsDark,
  sampleImageElementIsDark,
  tokenValueToRem
} from "../theme";

export const canonicalRotatingBannerCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.rotatingBannerCard"
);

export type RotatingBannerCardSize = "Small" | "Medium" | "Large";
export type RotatingBannerCardSlideMode = "Auto" | "Manual";

export interface RotatingBannerCardItem {
  description?: string;
  id?: number | string;
  media?: ReactNode;
  title?: string;
}

export interface RotatingBannerCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  autoPlay?: boolean;
  brand?: DisplayBrandId;
  intervalMs?: number;
  items?: RotatingBannerCardItem[];
  pauseOnHover?: boolean;
  showCopy?: boolean;
  slideMode?: RotatingBannerCardSlideMode;
  size?: RotatingBannerCardSize;
}

type SlotKey = "hiddenLeft" | "left" | "center" | "right" | "hiddenRight";

type RotatingBannerCardMetrics = {
  heightSlot: string;
  sideScaleSlot: string;
};

const DEFAULT_TRANSITION_MS = 560;
const DEFAULT_INTERVAL_MS = 2400;
const DEFAULT_VISIBLE_PEEK_PX = 12;
const FALLBACK_ITEM: RotatingBannerCardItem = {
  title: "Title",
  description: "Description"
};
const DEFAULT_ITEMS: RotatingBannerCardItem[] = [
  {
    title: "Title",
    description: "Description"
  },
  {
    title: "Fresh arrivals",
    description: "Limited inventory"
  },
  {
    title: "Expert picks",
    description: "Curated for today"
  },
  {
    title: "Popular this week",
    description: "Trending banners"
  },
  {
    title: "Daily spotlight",
    description: "Updated every day"
  }
];

const SIZE_METRICS: Record<RotatingBannerCardSize, RotatingBannerCardMetrics> = {
  Small: {
    heightSlot: "size.small.height",
    sideScaleSlot: "motion.sideScale.small"
  },
  Medium: {
    heightSlot: "size.medium.height",
    sideScaleSlot: "motion.sideScale.medium"
  },
  Large: {
    heightSlot: "size.large.height",
    sideScaleSlot: "motion.sideScale.large"
  }
};

const SLOT_Z_INDEX: Record<SlotKey, number> = {
  hiddenLeft: 0,
  left: 1,
  center: 3,
  right: 1,
  hiddenRight: 0
};

const SLOT_OPACITY: Record<SlotKey, number> = {
  hiddenLeft: 0,
  left: 1,
  center: 1,
  right: 1,
  hiddenRight: 0
};

const SLOT_BY_OFFSET: Record<-2 | -1 | 0 | 1 | 2, SlotKey> = {
  [-2]: "hiddenLeft",
  [-1]: "left",
  0: "center",
  1: "right",
  2: "hiddenRight"
};

const singleLineTextStyles: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

function getRotatingBannerCardToken(slot: string) {
  return canonicalRotatingBannerCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function resolveRotatingBannerCardBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getRotatingBannerCardToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

function resolveRotatingBannerCardBindingRem(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  return tokenValueToRem(resolveRotatingBannerCardBindingValue(brand, slot, fallback));
}

function resolveRotatingBannerCardBindingNumber(
  brand: DisplayBrandId,
  slot: string,
  fallback: number
) {
  const value = resolveRotatingBannerCardBindingValue(brand, slot, `${fallback}`);
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function renderDefaultSlide(background: string) {
  return (
    <div
      aria-hidden="true"
      style={{
        background,
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function resolveSlideCopyTone(slideNode: HTMLDivElement | null, fallbackBackground: string) {
  if (!slideNode || typeof window === "undefined") {
    return getReadableTextColor(fallbackBackground);
  }

  const imageElement = slideNode.querySelector("img");
  const imageDarkness = imageElement ? await sampleImageElementIsDark(imageElement) : null;

  if (imageDarkness !== null) {
    return imageDarkness ? "#FFFFFF" : "#000000";
  }

  const mediaElement = slideNode.firstElementChild instanceof HTMLElement ? slideNode.firstElementChild : null;
  const computedStyles = mediaElement ? window.getComputedStyle(mediaElement) : null;
  const mediaBackgroundImage = computedStyles?.backgroundImage;
  const mediaBackgroundColor = computedStyles?.backgroundColor;
  const backgroundImageDarkness =
    mediaBackgroundImage && mediaBackgroundImage !== "none"
      ? await sampleBackgroundImageIsDark(mediaBackgroundImage)
      : null;

  if (backgroundImageDarkness !== null) {
    return backgroundImageDarkness ? "#FFFFFF" : "#000000";
  }

  const effectiveBackground =
    mediaBackgroundColor && mediaBackgroundColor !== "rgba(0, 0, 0, 0)" ? mediaBackgroundColor : fallbackBackground;

  return getReadableTextColor(effectiveBackground);
}

function RotatingBannerCardCopy({
  description,
  descriptionFontFamily,
  descriptionFontSize,
  descriptionFontWeight,
  descriptionLetterSpacing,
  descriptionLineHeight,
  fallbackBackground,
  slideNode,
  contentGap,
  contentInsetInline,
  contentInsetTop,
  title,
  titleFontFamily,
  titleFontSize,
  titleFontWeight,
  titleLetterSpacing,
  titleLineHeight
}: {
  contentGap: string;
  contentInsetInline: string;
  contentInsetTop: string;
  description: string;
  descriptionFontFamily: string;
  descriptionFontSize: string;
  descriptionFontWeight: number;
  descriptionLetterSpacing: string;
  descriptionLineHeight: string;
  fallbackBackground: string;
  slideNode: HTMLDivElement | null;
  title: string;
  titleFontFamily: string;
  titleFontSize: string;
  titleFontWeight: number;
  titleLetterSpacing: string;
  titleLineHeight: string;
}) {
  const defaultTone = getReadableTextColor(fallbackBackground);
  const [copyTone, setCopyTone] = useState(defaultTone);

  useEffect(() => {
    let cancelled = false;

    async function updateTone() {
      const nextTone = await resolveSlideCopyTone(slideNode, fallbackBackground);

      if (!cancelled) {
        setCopyTone(nextTone);
      }
    }

    setCopyTone(defaultTone);
    void updateTone();

    return () => {
      cancelled = true;
    };
  }, [defaultTone, description, fallbackBackground, slideNode, title]);

  return (
    <div
      style={{
        display: "grid",
        gap: contentGap,
        left: contentInsetInline,
        minWidth: 0,
        position: "absolute",
        right: contentInsetInline,
        top: contentInsetTop
      }}
    >
      <p
        style={{
          ...singleLineTextStyles,
          color: copyTone,
          fontFamily: titleFontFamily,
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
          letterSpacing: titleLetterSpacing,
          lineHeight: titleLineHeight,
          margin: 0
        }}
      >
        {title}
      </p>
      <p
        style={{
          ...singleLineTextStyles,
          color: copyTone,
          fontFamily: descriptionFontFamily,
          fontSize: descriptionFontSize,
          fontWeight: descriptionFontWeight,
          letterSpacing: descriptionLetterSpacing,
          lineHeight: descriptionLineHeight,
          margin: 0
        }}
      >
        {description}
      </p>
    </div>
  );
}

/**
 * Banner carousel that mirrors the linked Figma geometry with a clipped 336px viewport, center-focused scale transitions, and endless forward rotation.
 */
export function RotatingBannerCard({
  autoPlay = true,
  brand = "Cars24",
  className,
  intervalMs = DEFAULT_INTERVAL_MS,
  items,
  pauseOnHover = true,
  showCopy = true,
  slideMode = "Auto",
  size = "Small",
  style,
  ...rest
}: RotatingBannerCardProps) {
  const resolvedItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const manualLoopedItems = [...resolvedItems, ...resolvedItems, ...resolvedItems];
  const [activeSequence, setActiveSequence] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualDragging, setIsManualDragging] = useState(false);
  const manualViewportRef = useRef<HTMLDivElement | null>(null);
  const singleSlideRef = useRef<HTMLDivElement | null>(null);
  const manualPointerStateRef = useRef<{
    pointerId: number | null;
    startScrollLeft: number;
    startX: number;
  }>({
    pointerId: null,
    startScrollLeft: 0,
    startX: 0
  });
  const manualSlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const autoSlideRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const metrics = SIZE_METRICS[size];
  const containerWidthPx = resolveRotatingBannerCardBindingNumber(brand, "container.width", 336);
  const containerRadius = resolveRotatingBannerCardBindingRem(brand, "container.radius", "16px");
  const gapPx = resolveRotatingBannerCardBindingNumber(brand, "container.gap", 12);
  const peekPx = resolveRotatingBannerCardBindingNumber(
    brand,
    "container.peek",
    DEFAULT_VISIBLE_PEEK_PX
  );
  const slideWidthPx = resolveRotatingBannerCardBindingNumber(brand, "media.width", 288);
  const slideHeightPx = resolveRotatingBannerCardBindingNumber(brand, metrics.heightSlot, 162);
  const slideRadius = resolveRotatingBannerCardBindingRem(brand, "media.radius", "16px");
  const slideSurface = resolveRotatingBannerCardBindingValue(
    brand,
    "media.surface",
    "var(--cars24-primitive-drive-pink-50, #FFE8F7)"
  );
  const sideScale = resolveRotatingBannerCardBindingNumber(brand, metrics.sideScaleSlot, 0.8);
  const contentInsetInline = resolveRotatingBannerCardBindingRem(brand, "content.inset.inline", "16px");
  const contentInsetTop = resolveRotatingBannerCardBindingRem(brand, "content.inset.top", "16px");
  const contentGap = resolveRotatingBannerCardBindingRem(brand, "content.stackGap", "2px");
  const titleFontFamily = `${resolveRotatingBannerCardBindingValue(
    brand,
    "content.title.fontFamily",
    String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
  )}, sans-serif`;
  const titleFontWeight = resolveRotatingBannerCardBindingNumber(
    brand,
    "content.title.fontWeight",
    Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"))
  );
  const titleFontSize = resolveRotatingBannerCardBindingRem(brand, "content.title.fontSize", "15px");
  const titleLineHeight = resolveRotatingBannerCardBindingRem(brand, "content.title.lineHeight", "18px");
  const titleLetterSpacing = resolveRotatingBannerCardBindingRem(
    brand,
    "content.title.letterSpacing",
    "0px"
  );
  const descriptionFontFamily = `${resolveRotatingBannerCardBindingValue(
    brand,
    "content.description.fontFamily",
    String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
  )}, sans-serif`;
  const descriptionFontWeight = resolveRotatingBannerCardBindingNumber(
    brand,
    "content.description.fontWeight",
    Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"))
  );
  const descriptionFontSize = resolveRotatingBannerCardBindingRem(
    brand,
    "content.description.fontSize",
    "13px"
  );
  const descriptionLineHeight = resolveRotatingBannerCardBindingRem(
    brand,
    "content.description.lineHeight",
    "18px"
  );
  const descriptionLetterSpacing = resolveRotatingBannerCardBindingRem(
    brand,
    "content.description.letterSpacing",
    "0px"
  );
  const scaledSlideWidthPx = slideWidthPx * sideScale;
  const scaledOffsetPx = (slideWidthPx - scaledSlideWidthPx) / 2;
  const centerX = (containerWidthPx - slideWidthPx) / 2;
  const leftX = peekPx - scaledSlideWidthPx - scaledOffsetPx;
  const rightX = containerWidthPx - peekPx - scaledOffsetPx;
  const hiddenLeftX = leftX - slideWidthPx - gapPx;
  const hiddenRightX = rightX + slideWidthPx + gapPx;
  const manualSnapStepPx = rightX - centerX;
  const manualOverlapOffsetPx = manualSnapStepPx - slideWidthPx;
  const manualLoopSpanPx = manualSnapStepPx * resolvedItems.length;
  const slotTransforms: Record<SlotKey, { scale: number; x: number }> = {
    hiddenLeft: { scale: sideScale, x: hiddenLeftX },
    left: { scale: sideScale, x: leftX },
    center: { scale: 1, x: centerX },
    right: { scale: sideScale, x: rightX },
    hiddenRight: { scale: sideScale, x: hiddenRightX }
  };
  const isManualMode = slideMode === "Manual" || !autoPlay;

  function syncManualSlideScales() {
    const viewport = manualViewportRef.current;
    if (!viewport) {
      return;
    }

    const viewportCenterPx = viewport.scrollLeft + containerWidthPx / 2;
    const leadingPaddingPx = centerX;

    manualSlideRefs.current.forEach((slideNode, index) => {
      if (!slideNode) {
        return;
      }

      const slideCenterPx = leadingPaddingPx + index * manualSnapStepPx + slideWidthPx / 2;
      const distanceRatio = clampNumber(
        Math.abs(slideCenterPx - viewportCenterPx) / manualSnapStepPx,
        0,
        1
      );
      const scale = 1 - (1 - sideScale) * distanceRatio;
      const zIndex = Math.round(scale * 100);

      slideNode.style.transform = `scale(${scale})`;
      slideNode.style.zIndex = `${zIndex}`;
    });
  }

  function handleManualPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const viewport = manualViewportRef.current;
    if (!viewport || event.pointerType === "touch") {
      return;
    }

    manualPointerStateRef.current = {
      pointerId: event.pointerId,
      startScrollLeft: viewport.scrollLeft,
      startX: event.clientX
    };
    setIsManualDragging(true);
    viewport.setPointerCapture(event.pointerId);
  }

  function handleManualPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const viewport = manualViewportRef.current;
    if (!viewport || manualPointerStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - manualPointerStateRef.current.startX;
    viewport.scrollLeft = manualPointerStateRef.current.startScrollLeft - deltaX;
    syncManualSlideScales();
  }

  function resetManualPointerState(event?: React.PointerEvent<HTMLDivElement>) {
    const viewport = manualViewportRef.current;

    if (viewport && event && manualPointerStateRef.current.pointerId === event.pointerId) {
      viewport.releasePointerCapture(event.pointerId);
    }

    manualPointerStateRef.current = {
      pointerId: null,
      startScrollLeft: 0,
      startX: 0
    };
    setIsManualDragging(false);
  }

  useEffect(() => {
    if (isManualMode || !autoPlay || resolvedItems.length < 2 || (pauseOnHover && isHovered)) {
      return undefined;
    }

    if (typeof window === "undefined") {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSequence((current) => current + 1);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoPlay, intervalMs, isHovered, isManualMode, pauseOnHover, resolvedItems.length]);

  useEffect(() => {
    if (!isManualMode) {
      return undefined;
    }

    const viewport = manualViewportRef.current;
    if (!viewport) {
      return undefined;
    }

    viewport.scrollLeft = manualLoopSpanPx;
    syncManualSlideScales();

    return undefined;
  }, [isManualMode, manualLoopSpanPx, resolvedItems.length]);

  useEffect(() => {
    if (!isManualMode) {
      return undefined;
    }

    const viewport = manualViewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const handleScroll = () => {
      const approxIndex = Math.round(viewport.scrollLeft / manualSnapStepPx);
      const maxIndexBeforeWrap = manualLoopedItems.length - 2;

      if (approxIndex <= 1) {
        viewport.scrollLeft += manualLoopSpanPx;
      } else if (approxIndex >= maxIndexBeforeWrap) {
        viewport.scrollLeft -= manualLoopSpanPx;
      }

      syncManualSlideScales();
    };

    const handleResize = () => {
      syncManualSlideScales();
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    containerWidthPx,
    isManualMode,
    manualLoopSpanPx,
    manualLoopedItems.length,
    manualSnapStepPx,
    resolvedItems.length,
    sideScale,
    slideWidthPx
  ]);

  if (resolvedItems.length === 1) {
    const onlyItem: RotatingBannerCardItem = resolvedItems[0] ?? FALLBACK_ITEM;

    return (
      <div {...rest} className={className} style={{ display: "grid", justifyItems: "center", ...style }}>
        <div
          style={{
            borderRadius: containerRadius,
            boxSizing: "border-box",
            height: pxToRem(slideHeightPx),
            overflow: "hidden",
            position: "relative",
            width: pxToRem(containerWidthPx)
          }}
        >
          <div
            ref={singleSlideRef}
            style={{
              borderRadius: slideRadius,
              height: "100%",
              left: pxToRem(centerX),
              overflow: "hidden",
              position: "absolute",
              top: 0,
              width: pxToRem(slideWidthPx)
            }}
          >
            <div style={{ background: slideSurface, height: "100%", position: "relative", width: "100%" }}>
              {onlyItem.media ?? renderDefaultSlide(slideSurface)}
              {showCopy ? (
                <RotatingBannerCardCopy
                  contentGap={contentGap}
                  contentInsetInline={contentInsetInline}
                  contentInsetTop={contentInsetTop}
                  description={onlyItem.description ?? "Description"}
                  descriptionFontFamily={descriptionFontFamily}
                  descriptionFontSize={descriptionFontSize}
                  descriptionFontWeight={descriptionFontWeight}
                  descriptionLetterSpacing={descriptionLetterSpacing}
                  descriptionLineHeight={descriptionLineHeight}
                  fallbackBackground={slideSurface}
                  slideNode={singleSlideRef.current}
                  title={onlyItem.title ?? "Title"}
                  titleFontFamily={titleFontFamily}
                  titleFontSize={titleFontSize}
                  titleFontWeight={titleFontWeight}
                  titleLetterSpacing={titleLetterSpacing}
                  titleLineHeight={titleLineHeight}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isManualMode) {
    return (
      <div
        {...rest}
        className={className}
        onMouseEnter={pauseOnHover ? () => setIsHovered(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setIsHovered(false) : undefined}
        style={{
          borderRadius: containerRadius,
          boxSizing: "border-box",
          overflow: "hidden",
          width: pxToRem(containerWidthPx),
          ...style
        }}
      >
        <div
          ref={manualViewportRef}
          onPointerCancel={resetManualPointerState}
          onPointerDown={handleManualPointerDown}
          onPointerMove={handleManualPointerMove}
          onPointerUp={resetManualPointerState}
          style={{
            WebkitOverflowScrolling: "touch",
            boxSizing: "border-box",
            cursor: isManualDragging ? "grabbing" : "grab",
            msOverflowStyle: "none",
            overscrollBehaviorX: "contain",
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            scrollBehavior: "smooth",
            scrollPaddingLeft: pxToRem(centerX),
            scrollPaddingRight: pxToRem(centerX),
            scrollSnapType: "x mandatory",
            touchAction: "pan-x",
            userSelect: isManualDragging ? "none" : "auto",
            width: "100%"
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              display: "flex",
              paddingLeft: pxToRem(centerX),
              paddingRight: pxToRem(centerX),
              width: "max-content"
            }}
          >
            {manualLoopedItems.map((item, index) => {
              const resolvedItem = item ?? FALLBACK_ITEM;

              return (
                <div
                  key={`rotating-banner-card-manual-slide-${resolvedItem.id ?? "item"}-${index}`}
                  style={{
                    flex: "0 0 auto",
                    height: pxToRem(slideHeightPx),
                    marginLeft: index === 0 ? undefined : pxToRem(manualOverlapOffsetPx),
                    scrollSnapAlign: "center",
                    width: pxToRem(slideWidthPx)
                  }}
                >
                  <div
                    ref={(node) => {
                      manualSlideRefs.current[index] = node;
                    }}
                    style={{
                      background: slideSurface,
                      borderRadius: slideRadius,
                      height: "100%",
                      overflow: "hidden",
                      position: "relative",
                      transform: `scale(${sideScale})`,
                      transformOrigin: "center center",
                      transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
                      width: "100%"
                    }}
                  >
                    {resolvedItem.media ?? renderDefaultSlide(slideSurface)}

                    {showCopy ? (
                      <RotatingBannerCardCopy
                        contentGap={contentGap}
                        contentInsetInline={contentInsetInline}
                        contentInsetTop={contentInsetTop}
                        description={resolvedItem.description ?? "Description"}
                        descriptionFontFamily={descriptionFontFamily}
                        descriptionFontSize={descriptionFontSize}
                        descriptionFontWeight={descriptionFontWeight}
                        descriptionLetterSpacing={descriptionLetterSpacing}
                        descriptionLineHeight={descriptionLineHeight}
                        fallbackBackground={slideSurface}
                        slideNode={manualSlideRefs.current[index]}
                        title={resolvedItem.title ?? "Title"}
                        titleFontFamily={titleFontFamily}
                        titleFontSize={titleFontSize}
                        titleFontWeight={titleFontWeight}
                        titleLetterSpacing={titleLetterSpacing}
                        titleLineHeight={titleLineHeight}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const visibleEntries = ([-2, -1, 0, 1, 2] as const).map((offset) => {
    const sequence = activeSequence + offset;
    const item: RotatingBannerCardItem =
      resolvedItems[positiveModulo(sequence, resolvedItems.length)] ??
      DEFAULT_ITEMS[positiveModulo(sequence, DEFAULT_ITEMS.length)] ??
      FALLBACK_ITEM;
    return { item, offset, sequence };
  });

  return (
    <div
      {...rest}
      className={className}
      onMouseEnter={pauseOnHover ? () => setIsHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsHovered(false) : undefined}
      style={{
        borderRadius: containerRadius,
        boxSizing: "border-box",
        height: pxToRem(slideHeightPx),
        overflow: "hidden",
        position: "relative",
        width: pxToRem(containerWidthPx),
        ...style
      }}
    >
      {visibleEntries.map(({ item, offset, sequence }) => {
        const slot = SLOT_BY_OFFSET[offset];
        const { scale, x } = slotTransforms[slot];

        return (
          <div
            key={`rotating-banner-card-slide-${sequence}`}
            aria-hidden={slot === "center" ? undefined : true}
            style={{
              height: pxToRem(slideHeightPx),
              left: 0,
              opacity: SLOT_OPACITY[slot],
              pointerEvents: slot === "center" ? "auto" : "none",
              position: "absolute",
              top: 0,
              transform: `translate3d(${pxToRem(x)}, 0, 0) scale(${scale})`,
              transformOrigin: "center center",
              transition: `transform ${DEFAULT_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${DEFAULT_TRANSITION_MS}ms ease`,
              width: pxToRem(slideWidthPx),
              willChange: "opacity, transform",
              zIndex: SLOT_Z_INDEX[slot]
            }}
          >
          <div
            ref={(node) => {
              autoSlideRefs.current[sequence] = node;
            }}
            style={{
              background: slideSurface,
              borderRadius: slideRadius,
              height: "100%",
              overflow: "hidden",
              position: "relative",
              width: "100%"
            }}
          >
              {item.media ?? renderDefaultSlide(slideSurface)}

              {showCopy && slot === "center" ? (
                <RotatingBannerCardCopy
                  contentGap={contentGap}
                  contentInsetInline={contentInsetInline}
                  contentInsetTop={contentInsetTop}
                  description={item.description ?? "Description"}
                  descriptionFontFamily={descriptionFontFamily}
                  descriptionFontSize={descriptionFontSize}
                  descriptionFontWeight={descriptionFontWeight}
                  descriptionLetterSpacing={descriptionLetterSpacing}
                  descriptionLineHeight={descriptionLineHeight}
                  fallbackBackground={slideSurface}
                  slideNode={autoSlideRefs.current[sequence] ?? null}
                  title={item.title ?? "Title"}
                  titleFontFamily={titleFontFamily}
                  titleFontSize={titleFontSize}
                  titleFontWeight={titleFontWeight}
                  titleLetterSpacing={titleLetterSpacing}
                  titleLineHeight={titleLineHeight}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
