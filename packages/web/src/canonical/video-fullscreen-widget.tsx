import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalVideoFullscreenWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.videoFullscreenWidget"
);

const VIDEO_FULLSCREEN_WIDGET_WIDTH = 360;
const VIDEO_FULLSCREEN_WIDGET_HEIGHT = 800;
const RELATED_ITEM_WIDTH = 144;
const RELATED_ITEM_HEIGHT = 96;
const RELATED_ITEM_COUNT = 3;
const DEFAULT_PROGRESS_COUNT = 4;
const DEFAULT_ACTIVE_PROGRESS_VALUE = 51.22;
const TOP_OVERLAY_GRADIENT = "linear-gradient(180deg, rgba(0, 0, 0, 1) 12%, rgba(0, 0, 0, 0) 100%)";
const BOTTOM_OVERLAY_GRADIENT = "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)";
const INACTIVE_PROGRESS_COLOR = "rgba(255, 255, 255, 0.4)";

type StylableElement = ReactElement<{ style?: CSSProperties }>;

export interface VideoFullscreenWidgetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  media?: ReactNode;
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  progressCount?: number;
  progressIndex?: number;
  activeProgressValue?: number;
  showAction1?: boolean;
  showAction2?: boolean;
  showAvatarAction?: boolean;
  backLabel?: string;
  action1Label?: string;
  action2Label?: string;
  avatarActionLabel?: string;
  backIcon?: ReactNode;
  action1Icon?: ReactNode;
  action2Icon?: ReactNode;
  avatarActionIcon?: ReactNode;
  onBackClick?: MouseEventHandler<HTMLButtonElement>;
  onAction1Click?: MouseEventHandler<HTMLButtonElement>;
  onAction2Click?: MouseEventHandler<HTMLButtonElement>;
  onAvatarActionClick?: MouseEventHandler<HTMLButtonElement>;
  showRelatedRail?: boolean;
  relatedItems?: ReactNode;
  scrollable?: boolean;
  showCta?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon decorative name="sparkle-filled" />,
    trailingIcon: <Icon decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function fillChild(child: ReactNode) {
  if (!isValidElement(child)) {
    return child;
  }

  const element = child as StylableElement;

  return cloneElement(element, {
    style: {
      height: "100%",
      width: "100%",
      ...(element.props.style ?? {})
    }
  });
}

function DefaultMedia({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const brandSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const brandPrimary = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const inverseSurface = String(getRequiredThemeTokenValue(brand, "color.surface.inverse"));

  return (
    <div
      aria-hidden="true"
      style={{
        background: [
          "radial-gradient(circle at 50% 24%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 18%)",
          `radial-gradient(circle at 78% 18%, ${brandSurface} 0%, rgba(255, 255, 255, 0) 26%)`,
          `linear-gradient(180deg, ${brandPrimary} 0%, ${inverseSurface} 100%)`
        ].join(", "),
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function DefaultRelatedCard({ brand = "Cars24", index = 0 }: { brand?: DisplayBrandId; index?: number }) {
  const cardSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const cardAccent = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));

  return (
    <div
      aria-hidden="true"
      style={{
        background: [
          `radial-gradient(circle at ${index % 2 === 0 ? "28%" : "72%"} 24%, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 22%)`,
          `linear-gradient(135deg, ${cardSurface} 0%, ${cardAccent} 100%)`
        ].join(", "),
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function buildDefaultRelatedItems(brand: DisplayBrandId) {
  return Array.from({ length: RELATED_ITEM_COUNT }, (_, index) => (
    <DefaultRelatedCard brand={brand} index={index} key={`video-fullscreen-widget-related-${index}`} />
  ));
}

function resolveProgressSegments({
  activeProgressValue,
  progressCount,
  progressIndex
}: {
  activeProgressValue: number;
  progressCount: number;
  progressIndex: number;
}) {
  return Array.from({ length: progressCount }, (_, index) => {
    if (index < progressIndex) {
      return 100;
    }

    if (index === progressIndex) {
      return activeProgressValue;
    }

    return 0;
  });
}

/**
 * Full-screen media discovery widget that mirrors the Figma player shell with an overlaid header,
 * story-style progress indicators, related-card rail, and a single bottom CTA.
 */
export function VideoFullscreenWidget({
  brand = "Cars24",
  media,
  title = "Page title",
  subtitle = "Subtext",
  showProgress = true,
  progressCount = DEFAULT_PROGRESS_COUNT,
  progressIndex = 0,
  activeProgressValue = DEFAULT_ACTIVE_PROGRESS_VALUE,
  showAction1 = true,
  showAction2 = true,
  showAvatarAction = true,
  backLabel = "Back",
  action1Label = "Mood",
  action2Label = "Rewards",
  avatarActionLabel = "Profile",
  backIcon = <Icon decorative name="arrow-left-outline" />,
  action1Icon = <Icon decorative name="emoji-smile-outline" />,
  action2Icon = <Icon decorative name="emoji-smile-outline" />,
  avatarActionIcon = <Icon decorative name="people-circle-user-circle-avatar-profile-outline" />,
  onBackClick,
  onAction1Click,
  onAction2Click,
  onAvatarActionClick,
  showRelatedRail = true,
  relatedItems,
  scrollable = true,
  showCta = true,
  primaryAction,
  className,
  style,
  ...rest
}: VideoFullscreenWidgetProps) {
  const spacing1 = Number(getRequiredThemeTokenValue(brand, "spacing.1"));
  const spacing2 = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const titleColor = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const subtitleColor = String(getRequiredThemeTokenValue(brand, "component.sectionHeader.color.dark.description"));
  const canvasSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const titleFontSize = Number(getRequiredThemeTokenValue(brand, "component.button.typography.md.fontSize"));
  const titleLineHeight = Number(getRequiredThemeTokenValue(brand, "component.button.typography.md.lineHeight"));
  const titleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const subtitleFontSize = Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.fontSize"));
  const subtitleLineHeight = Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.lineHeight"));
  const subtitleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const relatedItemRadius = Number(getRequiredThemeTokenValue(brand, "radius.alt.md"));
  const safeProgressCount = Math.max(1, Math.round(progressCount));
  const safeProgressIndex = clamp(Math.round(progressIndex), 0, safeProgressCount - 1);
  const safeActiveProgressValue = clamp(activeProgressValue, 0, 100);
  const progressSegments = resolveProgressSegments({
    activeProgressValue: safeActiveProgressValue,
    progressCount: safeProgressCount,
    progressIndex: safeProgressIndex
  });
  const progressTrackWidth = (VIDEO_FULLSCREEN_WIDGET_WIDTH - spacing3 * 2 - spacing2 * (safeProgressCount - 1)) / safeProgressCount;
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;
  const resolvedRelatedItems = Children.toArray(relatedItems ?? buildDefaultRelatedItems(brand)).map(fillChild);
  const resolvedMedia = fillChild(media ?? <DefaultMedia brand={brand} />);

  const rootStyles: CSSProperties = {
    aspectRatio: `${VIDEO_FULLSCREEN_WIDGET_WIDTH} / ${VIDEO_FULLSCREEN_WIDGET_HEIGHT}`,
    background: canvasSurface,
    boxSizing: "border-box",
    maxWidth: pxToRem(VIDEO_FULLSCREEN_WIDGET_WIDTH),
    overflow: "hidden",
    position: "relative",
    width: "100%",
    ...style
  };

  const relatedViewportStyles: CSSProperties = {
    WebkitOverflowScrolling: scrollable ? "touch" : undefined,
    msOverflowStyle: scrollable ? "none" : undefined,
    overflowX: scrollable ? "auto" : "hidden",
    overflowY: "hidden",
    scrollSnapType: scrollable ? "x proximity" : undefined,
    scrollbarWidth: scrollable ? "none" : undefined,
    width: "100%"
  };

  const relatedRailStyles: CSSProperties = {
    display: "flex",
    gap: pxToRem(spacing3),
    width: "max-content"
  };

  const relatedItemStyles: CSSProperties = {
    borderRadius: pxToRem(relatedItemRadius),
    display: "flex",
    flexShrink: 0,
    height: pxToRem(RELATED_ITEM_HEIGHT),
    overflow: "hidden",
    scrollSnapAlign: scrollable ? "start" : undefined,
    width: pxToRem(RELATED_ITEM_WIDTH)
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div
        aria-hidden="true"
        style={{
          inset: 0,
          position: "absolute"
        }}
      >
        {resolvedMedia}
      </div>

      <div
        style={{
          background: TOP_OVERLAY_GRADIENT,
          display: "flex",
          flexDirection: "column",
          inset: "0 0 auto 0",
          paddingBottom: pxToRem(16),
          position: "absolute"
        }}
      >
        <div
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            gap: pxToRem(spacing3),
            minHeight: pxToRem(56),
            padding: `${pxToRem(spacing1)} ${pxToRem(spacing3)}`,
            width: "100%"
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flex: "1 1 auto",
              gap: pxToRem(spacing3),
              minWidth: 0
            }}
          >
            <IconButton
              aria-label={backLabel}
              brand={brand}
              icon={backIcon}
              onClick={onBackClick}
              onDark
              shape="Round"
              size="Small"
              styleVariant="Transparent"
              type="button"
            />

            <div
              style={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                minWidth: 0
              }}
            >
              <span
                style={{
                  color: titleColor,
                  fontFamily,
                  fontSize: pxToRem(titleFontSize),
                  fontWeight: titleFontWeight,
                  lineHeight: pxToRem(titleLineHeight),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {title}
              </span>
              <span
                style={{
                  color: subtitleColor,
                  fontFamily,
                  fontSize: pxToRem(subtitleFontSize),
                  fontWeight: subtitleFontWeight,
                  lineHeight: pxToRem(subtitleLineHeight),
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {subtitle}
              </span>
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              flex: "0 0 auto",
              gap: pxToRem(6)
            }}
          >
            {showAction1 ? (
              <IconButton
                aria-label={action1Label}
                brand={brand}
                icon={action1Icon}
                onClick={onAction1Click}
                onDark
                shape="Round"
                size="Small"
                styleVariant="Transparent"
                type="button"
              />
            ) : null}
            {showAction2 ? (
              <IconButton
                aria-label={action2Label}
                brand={brand}
                icon={action2Icon}
                onClick={onAction2Click}
                onDark
                shape="Round"
                size="Small"
                styleVariant="Transparent"
                type="button"
              />
            ) : null}
            {showAvatarAction ? (
              <IconButton
                aria-label={avatarActionLabel}
                brand={brand}
                icon={avatarActionIcon}
                onClick={onAvatarActionClick}
                onDark
                shape="Regular"
                size="Small"
                styleVariant="Transparent"
                type="button"
              />
            ) : null}
          </div>
        </div>

        {showProgress ? (
          <div
            style={{
              boxSizing: "border-box",
              display: "flex",
              gap: pxToRem(spacing2),
              padding: pxToRem(spacing3),
              width: "100%"
            }}
          >
            {progressSegments.map((segmentValue, index) => (
              <div
                aria-hidden="true"
                key={`video-fullscreen-widget-progress-${index}`}
                style={{
                  background: INACTIVE_PROGRESS_COLOR,
                  borderRadius: pxToRem(999),
                  flex: `0 0 ${pxToRem(progressTrackWidth)}`,
                  height: pxToRem(4),
                  overflow: "hidden"
                }}
              >
                {segmentValue > 0 ? (
                  <div
                    style={{
                      background: titleColor,
                      borderRadius: pxToRem(999),
                      height: "100%",
                      width: `${segmentValue}%`
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        style={{
          background: BOTTOM_OVERLAY_GRADIENT,
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: pxToRem(16),
            padding: `${pxToRem(16)} ${pxToRem(spacing3)} ${pxToRem(24)}`,
            width: "100%"
          }}
        >
          {showRelatedRail ? (
            <div role="list" style={relatedViewportStyles}>
              <div style={relatedRailStyles}>
                {resolvedRelatedItems.map((child, index) => (
                  <div key={`video-fullscreen-widget-item-${index}`} role="listitem" style={relatedItemStyles}>
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

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
    </div>
  );
}
