import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalVideoTopBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.videoTopBar"
);

export type VideoTopBarType = "Story" | "Video";

const VIDEO_TOP_BAR_WIDTH = 360;
const VIDEO_TOP_BAR_HEADER_HEIGHT = 56;
const STORY_PROGRESS_ROW_HEIGHT = 28;
const VIDEO_CONTROLS_ROW_HEIGHT = 32;
const STORY_VARIANT_BOTTOM_PADDING = 16;
const VIDEO_VARIANT_BOTTOM_PADDING = 12;
const TOP_OVERLAY_GRADIENT = "linear-gradient(180deg, rgba(0, 0, 0, 1) 12%, rgba(0, 0, 0, 0) 100%)";
const STORY_INACTIVE_PROGRESS_COLOR = "rgba(255, 255, 255, 0.4)";
const VIDEO_INACTIVE_PROGRESS_COLOR = "rgba(255, 255, 255, 0.6)";

export interface VideoTopBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  brand?: DisplayBrandId;
  type?: VideoTopBarType;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
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
  onBackClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  onAction1Click?: MouseEventHandler<HTMLButtonElement> | undefined;
  onAction2Click?: MouseEventHandler<HTMLButtonElement> | undefined;
  onAvatarActionClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  showProgress?: boolean;
  progressCount?: number;
  progressIndex?: number;
  activeProgressValue?: number;
  countdownLabel?: string;
  videoProgressValue?: number;
  showMuteAction?: boolean;
  muteActionLabel?: string;
  muteActionIcon?: ReactNode;
  onMuteActionClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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

function parseCountdownLabel(countdownLabel: string) {
  const [minutes = "00", seconds = "00"] = countdownLabel.split(":");
  return { minutes, seconds };
}

/**
 * Media overlay top bar that mirrors the Figma story/video variants with dark header controls and
 * either a segmented story progress rail or video scrub row.
 */
export function VideoTopBar({
  brand = "Cars24",
  type = "Story",
  title = "Page title",
  subtitle = "Subtext",
  showSubtitle = true,
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
  showProgress = true,
  progressCount = 4,
  progressIndex = 0,
  activeProgressValue = 51.22,
  countdownLabel = "00:02",
  videoProgressValue = 27.27,
  showMuteAction = true,
  muteActionLabel = "Mute",
  muteActionIcon = <Icon decorative name="volume-off-outline" />,
  onMuteActionClick,
  className,
  style,
  ...rest
}: VideoTopBarProps) {
  const spacing1 = Number(getRequiredThemeTokenValue(brand, "spacing.1"));
  const spacing2 = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const titleColor = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const subtitleColor = String(getRequiredThemeTokenValue(brand, "component.sectionHeader.color.dark.description"));
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const titleFontSize = Number(getRequiredThemeTokenValue(brand, "component.button.typography.md.fontSize"));
  const titleLineHeight = Number(getRequiredThemeTokenValue(brand, "component.button.typography.md.lineHeight"));
  const titleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const subtitleFontSize = Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.fontSize"));
  const subtitleLineHeight = Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.xs.lineHeight"));
  const subtitleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const countdownFontSize = 12;
  const countdownLineHeight = 16;
  const safeProgressCount = Math.max(1, Math.round(progressCount));
  const safeProgressIndex = clamp(Math.round(progressIndex), 0, safeProgressCount - 1);
  const safeActiveProgressValue = clamp(activeProgressValue, 0, 100);
  const progressSegments = resolveProgressSegments({
    activeProgressValue: safeActiveProgressValue,
    progressCount: safeProgressCount,
    progressIndex: safeProgressIndex
  });
  const progressTrackWidth =
    (VIDEO_TOP_BAR_WIDTH - spacing3 * 2 - spacing2 * (safeProgressCount - 1)) / safeProgressCount;
  const safeVideoProgressValue = clamp(videoProgressValue, 0, 100);
  const { minutes, seconds } = parseCountdownLabel(countdownLabel);
  const controlsTrackWidth =
    VIDEO_TOP_BAR_WIDTH - spacing3 * 2 - 46 - (showMuteAction ? 32 : 0) - spacing2 * (showMuteAction ? 2 : 1);
  const controlsThumbLeft = (controlsTrackWidth - 12) * (safeVideoProgressValue / 100);

  const rootStyles: CSSProperties = {
    background: TOP_OVERLAY_GRADIENT,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    paddingBottom: pxToRem(type === "Story" ? STORY_VARIANT_BOTTOM_PADDING : VIDEO_VARIANT_BOTTOM_PADDING),
    width: "100%",
    ...style
  };

  const headerRowStyles: CSSProperties = {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    gap: pxToRem(spacing3),
    minHeight: pxToRem(VIDEO_TOP_BAR_HEADER_HEIGHT),
    padding: `${pxToRem(spacing1)} ${pxToRem(spacing3)}`,
    width: "100%"
  };

  const titleStyles: CSSProperties = {
    color: titleColor,
    fontFamily,
    fontSize: pxToRem(titleFontSize),
    fontWeight: titleFontWeight,
    lineHeight: pxToRem(titleLineHeight),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  const subtitleStyles: CSSProperties = {
    color: subtitleColor,
    fontFamily,
    fontSize: pxToRem(subtitleFontSize),
    fontWeight: subtitleFontWeight,
    lineHeight: pxToRem(subtitleLineHeight),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={headerRowStyles}>
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
              justifyContent: showSubtitle ? "flex-start" : "center",
              minWidth: 0
            }}
          >
            <span style={titleStyles}>{title}</span>
            {showSubtitle ? <span style={subtitleStyles}>{subtitle}</span> : null}
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

      {type === "Story" && showProgress ? (
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            gap: pxToRem(spacing2),
            minHeight: pxToRem(STORY_PROGRESS_ROW_HEIGHT),
            padding: pxToRem(spacing3),
            width: "100%"
          }}
        >
          {progressSegments.map((segmentValue, index) => (
            <div
              aria-hidden="true"
              key={`video-top-bar-progress-${index}`}
              style={{
                background: STORY_INACTIVE_PROGRESS_COLOR,
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

      {type === "Video" ? (
        <div
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            gap: pxToRem(spacing2),
            minHeight: pxToRem(VIDEO_CONTROLS_ROW_HEIGHT),
            padding: `0 ${pxToRem(spacing3)}`,
            width: "100%"
          }}
        >
          <div
            style={{
              alignItems: "center",
              color: titleColor,
              display: "inline-flex",
              fontFamily,
              fontSize: pxToRem(countdownFontSize),
              fontWeight: subtitleFontWeight,
              gap: pxToRem(1),
              lineHeight: pxToRem(countdownLineHeight),
              paddingInline: pxToRem(spacing1)
            }}
          >
            <span>{minutes}</span>
            <span>:</span>
            <span>{seconds}</span>
          </div>

          <div
            aria-hidden="true"
            style={{
              alignItems: "center",
              display: "flex",
              flex: `0 0 ${pxToRem(controlsTrackWidth)}`,
              height: pxToRem(12),
              position: "relative"
            }}
          >
            <div
              style={{
                background: VIDEO_INACTIVE_PROGRESS_COLOR,
                borderRadius: pxToRem(999),
                height: pxToRem(4),
                inset: `calc(50% - ${pxToRem(2)}) 0 auto 0`,
                position: "absolute"
              }}
            />
            <div
              style={{
                background: titleColor,
                borderRadius: pxToRem(999),
                height: pxToRem(4),
                inset: `calc(50% - ${pxToRem(2)}) auto auto 0`,
                position: "absolute",
                width: `${safeVideoProgressValue}%`
              }}
            />
            <div
              style={{
                background: titleColor,
                borderRadius: "50%",
                height: pxToRem(12),
                left: pxToRem(controlsThumbLeft),
                position: "absolute",
                top: 0,
                width: pxToRem(12)
              }}
            />
          </div>

          {showMuteAction ? (
            <IconButton
              aria-label={muteActionLabel}
              brand={brand}
              icon={muteActionIcon}
              onClick={onMuteActionClick}
              onDark
              shape="Regular"
              size="Small"
              styleVariant="Transparent"
              type="button"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
