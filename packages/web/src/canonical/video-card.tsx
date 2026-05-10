import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalVideoCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.videoCard"
);

export type VideoCardSize = "Small" | "Medium" | "Large";

type VideoCardMetrics = {
  widthSlot: string;
  heightSlot: string;
  contentPaddingBlockEnd: string;
  titleFontSize: string;
  titleLineHeight: string;
  bodyFontSize: string;
  bodyLineHeight: string;
};

const VIDEO_CARD_METRICS: Record<VideoCardSize, VideoCardMetrics> = {
  Small: {
    widthSlot: "size.small.width",
    heightSlot: "size.small.height",
    contentPaddingBlockEnd: "content.paddingBottom.small",
    titleFontSize: "typography.title.small.fontSize",
    titleLineHeight: "typography.title.small.lineHeight",
    bodyFontSize: "typography.body.small.fontSize",
    bodyLineHeight: "typography.body.small.lineHeight"
  },
  Medium: {
    widthSlot: "size.medium.width",
    heightSlot: "size.medium.height",
    contentPaddingBlockEnd: "content.paddingBottom.medium",
    titleFontSize: "typography.title.medium.fontSize",
    titleLineHeight: "typography.title.medium.lineHeight",
    bodyFontSize: "typography.body.medium.fontSize",
    bodyLineHeight: "typography.body.medium.lineHeight"
  },
  Large: {
    widthSlot: "size.large.width",
    heightSlot: "size.large.height",
    contentPaddingBlockEnd: "content.paddingBottom.large",
    titleFontSize: "typography.title.large.fontSize",
    titleLineHeight: "typography.title.large.lineHeight",
    bodyFontSize: "typography.body.large.fontSize",
    bodyLineHeight: "typography.body.large.lineHeight"
  }
};

export interface VideoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  children?: ReactNode;
  description?: string;
  onPlayClick?: MouseEventHandler<HTMLButtonElement>;
  playLabel?: string;
  size?: VideoCardSize;
  title?: string;
  value?: string;
}

function getVideoCardToken(slot: string) {
  return canonicalVideoCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveVideoCardBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getVideoCardToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("component.") ||
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.") ||
    token.startsWith("icon.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

export function VideoCard({
  brand = "Cars24",
  children,
  className,
  description = "Description",
  onPlayClick,
  playLabel = "Play video",
  size = "Medium",
  style,
  title = "Title",
  value = "Value",
  ...rest
}: VideoCardProps) {
  const metrics = VIDEO_CARD_METRICS[size];
  const borderRadius = tokenValueToRem(resolveVideoCardBindingValue(brand, "container.radius", "16px"));
  const width = tokenValueToRem(resolveVideoCardBindingValue(brand, metrics.widthSlot, "210px"));
  const height = tokenValueToRem(resolveVideoCardBindingValue(brand, metrics.heightSlot, "280px"));
  const slotBackground = resolveVideoCardBindingValue(brand, "surface.background", "#F6F6FF");
  const titleColor = resolveVideoCardBindingValue(brand, "content.title.color", "#FFFFFF");
  const descriptionColor = resolveVideoCardBindingValue(
    brand,
    "content.description.color",
    "rgba(255, 255, 255, 0.7)"
  );
  const valueColor = resolveVideoCardBindingValue(
    brand,
    "content.value.color",
    "rgba(255, 255, 255, 0.7)"
  );
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const titleFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const bodyFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const contentPaddingInline = tokenValueToRem(
    resolveVideoCardBindingValue(brand, "content.paddingInline", "12px")
  );
  const contentPaddingBlockStart = tokenValueToRem(
    resolveVideoCardBindingValue(brand, "content.paddingTop", "20px")
  );
  const contentPaddingBlockEnd = tokenValueToRem(
    resolveVideoCardBindingValue(brand, metrics.contentPaddingBlockEnd, "16px")
  );
  const valueGap = tokenValueToRem(resolveVideoCardBindingValue(brand, "content.valueGap", "8px"));
  const titleFontSize = tokenValueToRem(resolveVideoCardBindingValue(brand, metrics.titleFontSize, "15px"));
  const titleLineHeight = tokenValueToRem(
    resolveVideoCardBindingValue(brand, metrics.titleLineHeight, "18px")
  );
  const bodyFontSize = tokenValueToRem(resolveVideoCardBindingValue(brand, metrics.bodyFontSize, "13px"));
  const bodyLineHeight = tokenValueToRem(resolveVideoCardBindingValue(brand, metrics.bodyLineHeight, "18px"));
  const gradientStart = resolveVideoCardBindingValue(brand, "surface.overlay.start", "rgba(0, 0, 0, 0)");
  const gradientMid = resolveVideoCardBindingValue(brand, "surface.overlay.mid", "rgba(0, 0, 0, 0.64)");
  const gradientEnd = resolveVideoCardBindingValue(brand, "surface.overlay.end", "rgba(0, 0, 0, 1)");
  const gradientMidStop = resolveVideoCardBindingValue(brand, "surface.overlay.midStop", "36%");
  const labelStyles: CSSProperties = {
    bottom: 0,
    boxSizing: "border-box",
    display: "flex",
    left: 0,
    paddingBlockEnd: contentPaddingBlockEnd,
    paddingBlockStart: contentPaddingBlockStart,
    paddingInline: contentPaddingInline,
    position: "absolute",
    right: 0,
    zIndex: 2
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        borderRadius,
        display: "inline-flex",
        height,
        overflow: "hidden",
        position: "relative",
        width,
        ...style
      }}
    >
      <div
        style={{
          background: slotBackground,
          height: "100%",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            width: "100%"
          }}
        >
          {children}
        </div>

        <div
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(180deg, ${gradientStart} 0%, ${gradientMid} ${gradientMidStop}, ${gradientEnd} 100%)`,
            inset: 0,
            pointerEvents: "none",
            position: "absolute",
            zIndex: 1
          }}
        />

        <div
          style={{
            alignItems: "center",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            pointerEvents: "none",
            position: "absolute",
            zIndex: 2
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <IconButton
              aria-label={playLabel}
              brand={brand}
              icon={<Icon decorative name="play-filled" style={{ fontSize: "inherit" }} />}
              onClick={onPlayClick}
              onDark
              shape="Round"
              size="Large"
              styleVariant="Solid - Primary"
              type="button"
            />
          </div>
        </div>

        <div style={labelStyles}>
          <div
            style={{
              alignItems: "flex-end",
              display: "flex",
              gap: value ? valueGap : 0,
              minWidth: 0,
              width: "100%"
            }}
          >
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
                  display: "block",
                  fontFamily,
                  fontSize: titleFontSize,
                  fontWeight: titleFontWeight,
                  lineHeight: titleLineHeight,
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {title}
              </span>
              {description ? (
                <span
                  style={{
                    color: descriptionColor,
                    display: "block",
                    fontFamily,
                    fontSize: bodyFontSize,
                    fontWeight: bodyFontWeight,
                    lineHeight: bodyLineHeight,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {description}
                </span>
              ) : null}
            </div>

            {value ? (
              <span
                style={{
                  color: valueColor,
                  display: "block",
                  flexShrink: 0,
                  fontFamily,
                  fontSize: bodyFontSize,
                  fontWeight: bodyFontWeight,
                  lineHeight: bodyLineHeight,
                  margin: 0,
                  whiteSpace: "nowrap"
                }}
              >
                {value}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
