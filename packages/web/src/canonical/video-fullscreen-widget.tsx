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
import { VideoTopBar, type VideoTopBarType } from "./video-top-bar";

export const canonicalVideoFullscreenWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.videoFullscreenWidget"
);

const VIDEO_FULLSCREEN_WIDGET_WIDTH = 360;
const VIDEO_FULLSCREEN_WIDGET_HEIGHT = 800;
const RELATED_ITEM_WIDTH = 144;
const RELATED_ITEM_HEIGHT = 96;
const RELATED_ITEM_COUNT = 3;
const BOTTOM_OVERLAY_GRADIENT = "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)";

type StylableElement = ReactElement<{ style?: CSSProperties }>;

export interface VideoFullscreenWidgetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  media?: ReactNode;
  topBarType?: VideoTopBarType;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  showProgress?: boolean;
  progressCount?: number;
  progressIndex?: number;
  activeProgressValue?: number;
  countdownLabel?: string;
  videoProgressValue?: number;
  showAction1?: boolean;
  showAction2?: boolean;
  showAvatarAction?: boolean;
  showMuteAction?: boolean;
  backLabel?: string;
  action1Label?: string;
  action2Label?: string;
  avatarActionLabel?: string;
  muteActionLabel?: string;
  backIcon?: ReactNode;
  action1Icon?: ReactNode;
  action2Icon?: ReactNode;
  avatarActionIcon?: ReactNode;
  muteActionIcon?: ReactNode;
  onBackClick?: MouseEventHandler<HTMLButtonElement>;
  onAction1Click?: MouseEventHandler<HTMLButtonElement>;
  onAction2Click?: MouseEventHandler<HTMLButtonElement>;
  onAvatarActionClick?: MouseEventHandler<HTMLButtonElement>;
  onMuteActionClick?: MouseEventHandler<HTMLButtonElement>;
  showRelatedRail?: boolean;
  relatedItems?: ReactNode;
  scrollable?: boolean;
  showCta?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
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

/**
 * Full-screen media discovery widget that mirrors the Figma player shell with an overlaid header,
 * story-style progress indicators, related-card rail, and a single bottom CTA.
 */
export function VideoFullscreenWidget({
  brand = "Cars24",
  media,
  topBarType = "Story",
  title = "Page title",
  subtitle = "Subtext",
  showSubtitle = true,
  showProgress = true,
  progressCount = 4,
  progressIndex = 0,
  activeProgressValue = 51.22,
  countdownLabel = "00:02",
  videoProgressValue = 27.27,
  showAction1 = true,
  showAction2 = true,
  showAvatarAction = true,
  showMuteAction = true,
  backLabel = "Back",
  action1Label = "Mood",
  action2Label = "Rewards",
  avatarActionLabel = "Profile",
  muteActionLabel = "Mute",
  backIcon = <Icon decorative name="arrow-left-outline" />,
  action1Icon = <Icon decorative name="emoji-smile-outline" />,
  action2Icon = <Icon decorative name="emoji-smile-outline" />,
  avatarActionIcon = <Icon decorative name="people-circle-user-circle-avatar-profile-outline" />,
  muteActionIcon = <Icon decorative name="volume-off-outline" />,
  onBackClick,
  onAction1Click,
  onAction2Click,
  onAvatarActionClick,
  onMuteActionClick,
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
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const canvasSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const relatedItemRadius = Number(getRequiredThemeTokenValue(brand, "radius.alt.md"));
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
          inset: "0 0 auto 0",
          position: "absolute"
        }}
      >
        <VideoTopBar
          action1Icon={action1Icon}
          action1Label={action1Label}
          action2Icon={action2Icon}
          action2Label={action2Label}
          activeProgressValue={activeProgressValue}
          avatarActionIcon={avatarActionIcon}
          avatarActionLabel={avatarActionLabel}
          backIcon={backIcon}
          backLabel={backLabel}
          brand={brand}
          countdownLabel={countdownLabel}
          muteActionIcon={muteActionIcon}
          muteActionLabel={muteActionLabel}
          onAction1Click={onAction1Click}
          onAction2Click={onAction2Click}
          onAvatarActionClick={onAvatarActionClick}
          onBackClick={onBackClick}
          onMuteActionClick={onMuteActionClick}
          progressCount={progressCount}
          progressIndex={progressIndex}
          showAction1={showAction1}
          showAction2={showAction2}
          showAvatarAction={showAvatarAction}
          showMuteAction={showMuteAction}
          showProgress={showProgress}
          showSubtitle={showSubtitle}
          subtitle={subtitle}
          title={title}
          type={topBarType}
          videoProgressValue={videoProgressValue}
        />
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
