import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";
import { TestimonialCard, type TestimonialCardProps } from "./testimonial-card";

export const canonicalTestimonialWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.testimonial"
);

export interface TestimonialItem
  extends Pick<
    TestimonialCardProps,
    | "avatar"
    | "avatarImageAlt"
    | "avatarImageSrc"
    | "customerName"
    | "dateLabel"
    | "description"
    | "detailLabel"
    | "initials"
    | "rating"
    | "showRating"
    | "showSource"
    | "showTitle"
    | "size"
    | "sourceLabel"
    | "title"
  > {
  id?: string;
}

export interface TestimonialProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  activeCardIndex?: number;
  background?: CSSProperties["background"];
  bottomCta?: boolean;
  brand?: DisplayBrandId;
  cards?: TestimonialItem[];
  children?: ReactNode;
  description?: string;
  header?: boolean;
  headerActionLabel?: string;
  interactive?: boolean;
  inverse?: boolean;
  onActiveCardIndexChange?: (activeCardIndex: number) => void;
  onHeaderActionClick?: () => void;
  primaryAction?: ButtonGroupButtonAction | null;
  showCardTitle?: boolean;
  showDescription?: boolean;
  showHeader?: boolean;
  showHeaderAction?: boolean;
  showSubtitle?: boolean;
  showTag?: boolean;
  subtitle?: string;
  tagLabel?: string;
  title?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testimonial-1",
    customerName: "Priya Menon",
    dateLabel: "08 Aug, 2025",
    description:
      "Helpful staff, transparent details, and a smooth report flow made the buying process much easier.",
    detailLabel: "Bought vehicle history report",
    initials: "PM",
    rating: 4.5,
    size: "Small"
  },
  {
    id: "testimonial-2",
    customerName: "Ramesh Agrawal",
    dateLabel: "10 Aug, 2025",
    description:
      "Buying was quick, transparent, and stress-free. Would recommend to all my friends.",
    detailLabel: "Bought vehicle history report",
    initials: "RA",
    rating: 4.5,
    size: "Large"
  },
  {
    id: "testimonial-3",
    customerName: "Prashant Kumar",
    dateLabel: "14 Aug, 2025",
    description:
      "Super easy and fast experience. Helpful staff and smooth paperwork made it convenient.",
    detailLabel: "Bought vehicle history report",
    initials: "PK",
    rating: 4.5,
    size: "Small"
  },
  {
    id: "testimonial-4",
    customerName: "Ram Verma",
    dateLabel: "24 Aug, 2025",
    description:
      "Very well coordinated. Made the whole process simple, quick, and easy to understand.",
    detailLabel: "Bought vehicle history report",
    initials: "RV",
    rating: 5,
    size: "Small"
  },
  {
    id: "testimonial-5",
    customerName: "Mr. Pushkar Mehta",
    dateLabel: "12 Aug, 2025",
    description:
      "The car appeared to be in pristine condition, almost as if it had just rolled off the showroom floor. However, the report revealed that it had been involved in two accidents.",
    detailLabel: "Bought vehicle history report",
    initials: "PM",
    rating: 4.5,
    size: "Small"
  },
  {
    id: "testimonial-6",
    customerName: "Meera Iyer",
    dateLabel: "16 Sep, 2025",
    description:
      "The accident and ownership history was easy to understand, and it helped me negotiate with much more confidence.",
    detailLabel: "Bought vehicle history report",
    initials: "MI",
    rating: 5,
    size: "Small"
  }
];

const CARD_OFFSETS = [-2, -1, 0, 1, 2] as const;
const ACTIVE_CARD_SCALE = 1;
const SIDE_CARD_OPACITY_MIN = 0.85;
const SIDE_CARD_OPACITY_MAX = 0.92;
const DRAG_THRESHOLD_RATIO = 0.25;
const VELOCITY_THRESHOLD = 0.45;
const SNAP_DURATION_MS = 420;
const SPRING_TRANSITION =
  "transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 260ms cubic-bezier(0.2, 0, 0, 1)";

function getThemeValue(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function getThemeNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function getThemeRem(brand: DisplayBrandId, path: string) {
  return pxToRem(getThemeNumber(brand, path));
}

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies ButtonGroupButtonAction;
}

function getNormalizedIndex(activeCardIndex: number, cardCount: number) {
  if (cardCount === 0) {
    return 0;
  }

  return ((activeCardIndex % cardCount) + cardCount) % cardCount;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function getCardHeightKey(size: TestimonialCardProps["size"], showTitle: boolean) {
  if (showTitle) {
    return size === "Large" ? "titleLarge" : "titleSmall";
  }

  return size === "Large" ? "large" : "small";
}

function getCardHeightPx(brand: DisplayBrandId, size: TestimonialCardProps["size"], showTitle: boolean) {
  return getThemeNumber(brand, `component.testimonialCard.layout.card.height.${getCardHeightKey(size, showTitle)}`);
}

function getVisibleTestimonialCards(cards: TestimonialItem[], activeCardIndex: number) {
  if (cards.length === 0) {
    return [];
  }

  const activeIndex = getNormalizedIndex(activeCardIndex, cards.length);
  const usedIndexes = new Set<number>();

  return CARD_OFFSETS.flatMap((offset) => {
    const index = getNormalizedIndex(activeIndex + offset, cards.length);
    const card = cards[index];

    if (!card || usedIndexes.has(index)) {
      return [];
    }

    usedIndexes.add(index);

    return [
      {
        card,
        index,
        offset,
        slot: offset === 0 ? ("active" as const) : ("preview" as const)
      }
    ];
  });
}

function DefaultTestimonialCards({
  activeCardIndex,
  brand,
  cardStridePx,
  cards,
  interactive,
  isDragging,
  largeCardWidth,
  onCardSelect,
  slideOffsetPx,
  showCardTitle
}: {
  activeCardIndex: number;
  brand: DisplayBrandId;
  cardStridePx: number;
  cards: TestimonialItem[];
  interactive: boolean;
  isDragging: boolean;
  largeCardWidth: string;
  onCardSelect: (activeCardIndex: number) => void;
  slideOffsetPx: number;
  showCardTitle?: boolean;
}) {
  const visibleCards = getVisibleTestimonialCards(cards, activeCardIndex);

  return (
    <>
      {visibleCards.map(({ card, index, offset, slot }) => {
        const { id, size: _size, ...cardProps } = card;
        const isActive = slot === "active";
        const isSelectable = interactive && !isActive;
        const resolvedShowTitle = showCardTitle ?? cardProps.showTitle ?? false;
        const largeCardHeightPx = getCardHeightPx(brand, "Large", resolvedShowTitle);
        const sideCardHeightPx = getCardHeightPx(brand, "Small", resolvedShowTitle);
        const sideScale = sideCardHeightPx / largeCardHeightPx;
        const centerDistance = Math.abs((offset * cardStridePx + slideOffsetPx) / cardStridePx);
        const centerProminence = clamp(1 - centerDistance, 0, 1);
        const incomingDirection = slideOffsetPx === 0 ? 0 : slideOffsetPx < 0 ? 1 : -1;
        const isIncoming = offset === incomingDirection;
        const sideOpacity = Math.abs(offset) <= 1 ? SIDE_CARD_OPACITY_MAX : SIDE_CARD_OPACITY_MIN;
        const scale = lerp(sideScale, ACTIVE_CARD_SCALE, centerProminence);
        const opacity = lerp(sideOpacity, ACTIVE_CARD_SCALE, centerProminence);
        const zIndex = 1 + Math.round(centerProminence * 100) + (isIncoming ? 1 : 0);
        const cardAlignment = isActive ? "center" : offset < 0 ? "flex-end" : "flex-start";
        const transformOrigin = offset < 0 ? "right center" : offset > 0 ? "left center" : "center";

        function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
          if (!isSelectable || (event.key !== "Enter" && event.key !== " ")) {
            return;
          }

          event.preventDefault();
          onCardSelect(index);
        }

        return (
          <div
            key={id ?? `${cardProps.customerName ?? "testimonial"}-${index}`}
            aria-label={isSelectable ? `Show testimonial ${index + 1}` : undefined}
            onClick={isSelectable ? () => onCardSelect(index) : undefined}
            onKeyDown={handleKeyDown}
            role={isSelectable ? "button" : undefined}
            style={{
              cursor: interactive ? (isDragging ? "grabbing" : "grab") : "default",
              alignItems: "center",
              display: "flex",
              flex: `0 0 ${largeCardWidth}`,
              justifyContent: cardAlignment,
              opacity,
              outline: "none",
              position: "relative",
              scrollSnapAlign: "center",
              transform: `scale(${scale})`,
              transformOrigin,
              transition: isDragging ? "none" : SPRING_TRANSITION,
              willChange: "transform, opacity",
              zIndex
            }}
            tabIndex={isSelectable ? 0 : undefined}
          >
            <TestimonialCard
              brand={brand}
              {...cardProps}
              showTitle={resolvedShowTitle}
              size="Large"
              style={{
                pointerEvents: "none"
              }}
            />
          </div>
        );
      })}
    </>
  );
}

/**
 * Widget-level testimonial carousel with a section header and horizontally scrollable testimonial cards.
 */
export function Testimonial({
  activeCardIndex = 1,
  background,
  bottomCta = true,
  brand = "Cars24",
  cards = DEFAULT_TESTIMONIALS,
  children,
  className,
  description = "Description goes here upto 2 lines",
  header,
  headerActionLabel = "View all",
  interactive = true,
  inverse = false,
  onActiveCardIndexChange,
  onHeaderActionClick,
  primaryAction,
  showCardTitle,
  showDescription = true,
  showHeader = true,
  showHeaderAction = true,
  showSubtitle = true,
  showTag = true,
  style,
  subtitle = "Section title line 2",
  tagLabel = "New",
  title = "Section title",
  ...rest
}: TestimonialProps) {
  const [resolvedActiveCardIndex, setResolvedActiveCardIndex] = useState(activeCardIndex);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapDirection, setSnapDirection] = useState(0);
  const activeCardIndexRef = useRef(activeCardIndex);
  const dragStartXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const pointerVelocityRef = useRef(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const hasDraggedRef = useRef(false);
  const latestDragOffsetRef = useRef(0);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextCardSelectRef = useRef(false);

  const isHeaderVisible = header ?? showHeader;
  const isBottomCtaVisible = bottomCta && primaryAction !== null;
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;
  const widgetGapPx = getThemeNumber(brand, "component.testimonialCard.layout.widget.gap");
  const widgetPadding = getThemeRem(brand, "component.testimonialCard.layout.widget.padding");
  const widgetWidthPx = getThemeNumber(brand, "component.testimonialCard.layout.widget.width");
  const largeCardWidthPx = getThemeNumber(brand, "component.testimonialCard.layout.card.width.large");
  const carouselCardGapPx = widgetGapPx;
  const largeCardWidth = pxToRem(largeCardWidthPx);
  const widgetGap = pxToRem(widgetGapPx);
  const carouselCardGap = pxToRem(carouselCardGapPx);
  const cardStridePx = largeCardWidthPx + carouselCardGapPx;
  const dragThresholdPx = largeCardWidthPx * DRAG_THRESHOLD_RATIO;
  const trackCenterOffsetPx = widgetWidthPx / 2 - (2 * cardStridePx + largeCardWidthPx / 2);
  const normalizedActiveCardIndex = getNormalizedIndex(resolvedActiveCardIndex, cards.length);
  const activeDragOffset = snapDirection !== 0 ? -snapDirection * cardStridePx : dragOffset;
  activeCardIndexRef.current = normalizedActiveCardIndex;

  useEffect(() => {
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = null;
    }

    setSnapDirection(0);
    setDragOffset(0);
    setIsDragging(false);
    activeCardIndexRef.current = getNormalizedIndex(activeCardIndex, cards.length);
    setResolvedActiveCardIndex(activeCardIndex);
  }, [activeCardIndex]);

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  function setActiveCard(nextActiveCardIndex: number) {
    const normalizedIndex = getNormalizedIndex(nextActiveCardIndex, cards.length);

    activeCardIndexRef.current = normalizedIndex;
    setResolvedActiveCardIndex(normalizedIndex);
    onActiveCardIndexChange?.(normalizedIndex);
  }

  function handleCardSelect(nextActiveCardIndex: number) {
    if (suppressNextCardSelectRef.current) {
      suppressNextCardSelectRef.current = false;
      return;
    }

    setActiveCard(nextActiveCardIndex);
  }

  function clearSnapTimeout() {
    if (!snapTimeoutRef.current) {
      return;
    }

    clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = null;
  }

  function startSnap(direction: number) {
    if (direction === 0) {
      setDragOffset(0);
      return;
    }

    clearSnapTimeout();

    setIsDragging(false);
    setSnapDirection(direction);
    setDragOffset(0);
    latestDragOffsetRef.current = 0;

    snapTimeoutRef.current = setTimeout(() => {
      setActiveCard(normalizedActiveCardIndex + direction);
      setSnapDirection(0);
      setDragOffset(0);
      snapTimeoutRef.current = null;
    }, SNAP_DURATION_MS);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || cards.length <= 1) {
      return;
    }

    dragPointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = event.timeStamp;
    pointerVelocityRef.current = 0;
    hasDraggedRef.current = false;
    latestDragOffsetRef.current = 0;
    suppressNextCardSelectRef.current = false;
    clearSnapTimeout();
    setSnapDirection(0);
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    const elapsed = Math.max(1, event.timeStamp - lastPointerTimeRef.current);
    pointerVelocityRef.current = (event.clientX - lastPointerXRef.current) / elapsed;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = event.timeStamp;

    let nextDragOffset = event.clientX - dragStartXRef.current;

    while (nextDragOffset <= -cardStridePx) {
      setActiveCard(activeCardIndexRef.current + 1);
      dragStartXRef.current -= cardStridePx;
      nextDragOffset += cardStridePx;
    }

    while (nextDragOffset >= cardStridePx) {
      setActiveCard(activeCardIndexRef.current - 1);
      dragStartXRef.current += cardStridePx;
      nextDragOffset -= cardStridePx;
    }

    nextDragOffset = clamp(nextDragOffset, -cardStridePx, cardStridePx);
    latestDragOffsetRef.current = nextDragOffset;
    hasDraggedRef.current = hasDraggedRef.current || Math.abs(nextDragOffset) > 3;
    setDragOffset(nextDragOffset);
  }

  function releasePointer(event: PointerEvent<HTMLDivElement>) {
    if (dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragPointerIdRef.current = null;

    const releasedDragOffset = latestDragOffsetRef.current;
    const shouldMoveNext = releasedDragOffset <= -dragThresholdPx || pointerVelocityRef.current <= -VELOCITY_THRESHOLD;
    const shouldMovePrevious =
      releasedDragOffset >= dragThresholdPx || pointerVelocityRef.current >= VELOCITY_THRESHOLD;

    if (hasDraggedRef.current) {
      suppressNextCardSelectRef.current = true;
      setTimeout(() => {
        suppressNextCardSelectRef.current = false;
      }, 150);
    }

    if (shouldMoveNext) {
      startSnap(1);
      return;
    }

    if (shouldMovePrevious) {
      startSnap(-1);
      return;
    }

    setIsDragging(false);
    setDragOffset(0);
    latestDragOffsetRef.current = 0;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive || cards.length <= 1) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      startSnap(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      startSnap(1);
    }
  }

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background:
      background ?? getThemeValue(brand, inverse ? "color.surface.inverse" : "component.testimonialCard.color.background"),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: widgetGap,
    justifyContent: "center",
    maxWidth: "100%",
    overflow: "hidden",
    padding: widgetPadding,
    width: getThemeRem(brand, "component.testimonialCard.layout.widget.width"),
    ...style
  };

  const carouselViewportStyles: CSSProperties = {
    cursor: interactive && cards.length > 1 ? (isDragging ? "grabbing" : "grab") : "default",
    marginInline: `calc(${widgetPadding} * -1)`,
    outline: "none",
    overflowX: "auto",
    overflowY: "hidden",
    overscrollBehaviorX: "contain",
    position: "relative",
    scrollSnapType: "x proximity",
    scrollbarWidth: "none",
    touchAction: "pan-y",
    userSelect: isDragging ? "none" : undefined,
    width: `calc(100% + (${widgetPadding} * 2))`
  };

  const carouselTrackStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: carouselCardGap,
    minWidth: "max-content",
    transform: `translate3d(${pxToRem(trackCenterOffsetPx + activeDragOffset)}, 0, 0)`,
    transition: isDragging ? "none" : SPRING_TRANSITION,
    willChange: "transform"
  };

  const ariaLabel = rest["aria-label"] ?? "Testimonials";

  return (
    <div {...rest} aria-label={ariaLabel} className={className} style={rootStyles}>
      {isHeaderVisible ? (
        <SectionHeader
          actionLabel={headerActionLabel}
          brand={brand}
          description={description}
          inverse={inverse}
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

      <div
        aria-label="Testimonials"
        onKeyDown={handleKeyDown}
        onPointerCancel={releasePointer}
        onPointerDownCapture={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releasePointer}
        role="group"
        style={carouselViewportStyles}
        tabIndex={interactive && cards.length > 1 ? 0 : undefined}
      >
        <div style={carouselTrackStyles}>
          {children ?? (
            <DefaultTestimonialCards
              activeCardIndex={normalizedActiveCardIndex}
              brand={brand}
              cardStridePx={cardStridePx}
              cards={cards}
              interactive={interactive}
              isDragging={isDragging}
              largeCardWidth={largeCardWidth}
              onCardSelect={handleCardSelect}
              slideOffsetPx={activeDragOffset}
              {...(showCardTitle === undefined ? {} : { showCardTitle })}
            />
          )}
        </div>
      </div>

      {isBottomCtaVisible && resolvedPrimaryAction ? (
        <ButtonGroup
          brand={brand}
          onDark={inverse}
          primaryAction={resolvedPrimaryAction}
          shape="Regular"
          size="Medium"
          type="Vertical"
        />
      ) : null}
    </div>
  );
}
