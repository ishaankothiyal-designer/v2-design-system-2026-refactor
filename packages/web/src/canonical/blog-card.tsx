import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, pxToRem, tokenValueToRem } from "../theme";
import { Avatar, type AvatarProps } from "./avatar";
import { Badge } from "./badge";
import { Icon } from "./icon";

export const canonicalBlogCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.blogCard"
);

export type BlogCardType = "Large";

type BlogCardMetrics = {
  authorFontSize: string;
  authorLineHeight: string;
  contentGap: string;
  contentPadding: string;
  descriptionFontSize: string;
  descriptionLineHeight: string;
  mediaHeight: string;
  metaFontSize: string;
  metaGap: string;
  metaLineHeight: string;
  playButtonIconSize: number;
  playButtonSize: string;
  tagInset: string;
  textGap: string;
  titleFontSize: string;
  titleLineHeight: string;
  width: string;
  writerGap: string;
};

const BLOG_CARD_METRICS: Record<BlogCardType, BlogCardMetrics> = {
  Large: {
    authorFontSize: "12px",
    authorLineHeight: "16px",
    contentGap: "20px",
    contentPadding: "12px",
    descriptionFontSize: "12px",
    descriptionLineHeight: "18px",
    mediaHeight: "213px",
    metaFontSize: "12px",
    metaGap: "4px",
    metaLineHeight: "18px",
    playButtonIconSize: 16,
    playButtonSize: "40px",
    tagInset: "12px",
    textGap: "4px",
    titleFontSize: "16px",
    titleLineHeight: "20px",
    width: "284px",
    writerGap: "8px"
  }
};

const twoLineClampStyles: CSSProperties = {
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  overflow: "hidden"
};

const singleLineClampStyles: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

function getBlogCardToken(slot: string) {
  return canonicalBlogCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveBlogCardBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getBlogCardToken(slot);

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

function resolveBlogCardBindingRem(brand: DisplayBrandId, slot: string, fallback: string) {
  return tokenValueToRem(resolveBlogCardBindingValue(brand, slot, fallback));
}

function DefaultMediaSlot({ brand }: { brand: DisplayBrandId }) {
  const surface = resolveBlogCardBindingValue(
    brand,
    "media.surface",
    "var(--cars24-primitive-drive-pink-50, #FFE8F7)"
  );
  const iconColor = resolveBlogCardBindingValue(
    brand,
    "media.placeholder.icon",
    "var(--cars24-primitive-drive-pink-400, #FD49C0)"
  );

  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "center",
        background: surface,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Icon
        decorative
        name="placeholder-generate-outline"
        style={{ color: iconColor, fontSize: pxToRem(32), opacity: 0.8 }}
      />
    </div>
  );
}

export interface BlogCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  authorName?: string;
  avatarProps?: Partial<AvatarProps>;
  brand?: DisplayBrandId;
  children?: ReactNode;
  date?: string;
  description?: string;
  inverse?: boolean;
  onPlayClick?: MouseEventHandler<HTMLButtonElement>;
  playLabel?: string;
  secondaryInfo?: string;
  showDescription?: boolean;
  showPlayButton?: boolean;
  showTag?: boolean;
  tagLabel?: string;
  title?: string;
  type?: BlogCardType;
}

/**
 * Media-first editorial card with an optional badge, play affordance, and author lockup, matching the approved blog-card Figma component.
 */
export function BlogCard({
  authorName = "Name",
  avatarProps,
  brand = "Cars24",
  children,
  className,
  date = "DD MM YYYY",
  description = "Body text covering every aspect of the thing that is covered and conveyed to the user.",
  inverse = false,
  onPlayClick,
  playLabel = "Play article",
  secondaryInfo = "Secondary info",
  showDescription = true,
  showPlayButton = true,
  showTag = true,
  style,
  tagLabel = "Badge",
  title = "A two line title car easily fit in the container. 15px",
  type = "Large",
  ...rest
}: BlogCardProps) {
  const metrics = BLOG_CARD_METRICS[type];
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const regularWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const semiboldWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const rootSurface = resolveBlogCardBindingValue(
    brand,
    inverse ? "container.surface.dark" : "container.surface.light",
    inverse ? "var(--cars24-semantic-bg-secondary-inverse, #262626)" : "var(--cars24-semantic-bg-primary, #FFFFFF)"
  );
  const borderColor = resolveBlogCardBindingValue(
    brand,
    inverse ? "container.border.dark" : "container.border.light",
    inverse
      ? "var(--cars24-semantic-border-secondary-inverse, #404040)"
      : "var(--cars24-semantic-border-primary, #E2E8F0)"
  );
  const borderRadius = resolveBlogCardBindingRem(brand, "container.radius", "16px");
  const width = resolveBlogCardBindingRem(brand, "container.width", metrics.width);
  const mediaHeight = resolveBlogCardBindingRem(brand, "media.height", metrics.mediaHeight);
  const contentPadding = resolveBlogCardBindingRem(brand, "layout.content.padding", metrics.contentPadding);
  const contentGap = resolveBlogCardBindingRem(brand, "layout.content.gap", metrics.contentGap);
  const textGap = resolveBlogCardBindingRem(brand, "layout.text.gap", metrics.textGap);
  const writerGap = resolveBlogCardBindingRem(brand, "layout.author.gap", metrics.writerGap);
  const metaGap = resolveBlogCardBindingRem(brand, "layout.meta.gap", metrics.metaGap);
  const tagInset = resolveBlogCardBindingRem(brand, "layout.tag.inset", metrics.tagInset);
  const playButtonSize = resolveBlogCardBindingRem(brand, "playButton.size", metrics.playButtonSize);
  const playButtonSurface = resolveBlogCardBindingValue(
    brand,
    "playButton.surface",
    "var(--cars24-semantic-bg-brand-subtler, #F6F6FF)"
  );
  const playButtonIconColor = resolveBlogCardBindingValue(
    brand,
    "playButton.icon.color",
    "var(--cars24-semantic-icon-primary, #020617)"
  );
  const playButtonShadow = resolveBlogCardBindingValue(
    brand,
    "playButton.shadow",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)"
  );
  const titleColor = resolveBlogCardBindingValue(
    brand,
    inverse ? "content.title.color.dark" : "content.title.color.light",
    inverse ? "var(--cars24-semantic-text-primary-inverse, #FFFFFF)" : "var(--cars24-semantic-text-primary, #020617)"
  );
  const descriptionColor = resolveBlogCardBindingValue(
    brand,
    inverse ? "content.description.color.dark" : "content.description.color.light",
    inverse
      ? "var(--cars24-semantic-text-secondary-on-color, rgba(255, 255, 255, 0.7))"
      : "var(--cars24-semantic-text-secondary, #64748B)"
  );
  const authorNameColor = resolveBlogCardBindingValue(
    brand,
    inverse ? "content.authorName.color.dark" : "content.authorName.color.light",
    inverse ? "var(--cars24-semantic-text-primary-inverse, #FFFFFF)" : "var(--cars24-semantic-text-primary, #020617)"
  );
  const metaColor = resolveBlogCardBindingValue(
    brand,
    inverse ? "content.meta.color.dark" : "content.meta.color.light",
    inverse
      ? "var(--cars24-semantic-text-secondary-on-color, rgba(255, 255, 255, 0.7))"
      : "var(--cars24-semantic-text-disabled, #94A3B8)"
  );
  const metaDividerColor = resolveBlogCardBindingValue(
    brand,
    "content.meta.divider.color",
    "var(--cars24-semantic-icon-secondary, #64748B)"
  );
  const titleFontSize = resolveBlogCardBindingRem(brand, "content.title.fontSize", metrics.titleFontSize);
  const titleLineHeight = resolveBlogCardBindingRem(brand, "content.title.lineHeight", metrics.titleLineHeight);
  const descriptionFontSize = resolveBlogCardBindingRem(
    brand,
    "content.description.fontSize",
    metrics.descriptionFontSize
  );
  const descriptionLineHeight = resolveBlogCardBindingRem(
    brand,
    "content.description.lineHeight",
    metrics.descriptionLineHeight
  );
  const authorFontSize = resolveBlogCardBindingRem(brand, "content.authorName.fontSize", metrics.authorFontSize);
  const authorLineHeight = resolveBlogCardBindingRem(
    brand,
    "content.authorName.lineHeight",
    metrics.authorLineHeight
  );
  const metaFontSize = resolveBlogCardBindingRem(brand, "content.meta.fontSize", metrics.metaFontSize);
  const metaLineHeight = resolveBlogCardBindingRem(brand, "content.meta.lineHeight", metrics.metaLineHeight);
  const resolvedAvatarProps: AvatarProps = {
    appearance: avatarProps?.appearance ?? (avatarProps?.imageSrc ? "Image" : "Initials"),
    adornment: avatarProps?.adornment ?? "Status dot",
    brand,
    imageAlt: avatarProps?.imageAlt ?? `${authorName} avatar`,
    initials: avatarProps?.initials ?? authorName,
    onDark: avatarProps?.onDark ?? false,
    size: avatarProps?.size ?? "Extra small",
    statusDotColor: avatarProps?.statusDotColor ?? "Green",
    ...avatarProps
  };
  const hasDate = date.trim().length > 0;
  const hasDescription = showDescription && description.trim().length > 0;
  const hasSecondaryInfo = secondaryInfo.trim().length > 0;

  const titleStyles: CSSProperties = {
    ...twoLineClampStyles,
    color: titleColor,
    fontFamily,
    fontSize: titleFontSize,
    fontWeight: semiboldWeight,
    lineHeight: titleLineHeight,
    margin: 0,
    minWidth: 0
  };

  const descriptionStyles: CSSProperties = {
    ...twoLineClampStyles,
    color: descriptionColor,
    fontFamily,
    fontSize: descriptionFontSize,
    fontWeight: regularWeight,
    lineHeight: descriptionLineHeight,
    margin: 0,
    minWidth: 0
  };

  const authorNameStyles: CSSProperties = {
    ...singleLineClampStyles,
    color: authorNameColor,
    fontFamily,
    fontSize: authorFontSize,
    fontWeight: semiboldWeight,
    lineHeight: authorLineHeight,
    margin: 0,
    minWidth: 0
  };

  const metaTextStyles: CSSProperties = {
    ...singleLineClampStyles,
    color: metaColor,
    fontFamily,
    fontSize: metaFontSize,
    fontWeight: regularWeight,
    lineHeight: metaLineHeight,
    margin: 0
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        background: rootSurface,
        border: `1px solid ${borderColor}`,
        borderRadius,
        boxSizing: "border-box",
        display: "inline-flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        width,
        ...style
      }}
    >
      <div
        style={{
          background: resolveBlogCardBindingValue(
            brand,
            "media.surface",
            "var(--cars24-primitive-drive-pink-50, #FFE8F7)"
          ),
          height: mediaHeight,
          overflow: "hidden",
          position: "relative",
          width: "100%"
        }}
      >
        <div style={{ height: "100%", width: "100%" }}>{children ?? <DefaultMediaSlot brand={brand} />}</div>

        {showTag ? (
          <div
            style={{
              left: tagInset,
              pointerEvents: "none",
              position: "absolute",
              top: tagInset,
              zIndex: 2
            }}
          >
            <Badge
              brand={brand}
              iconLeft
              iconRight
              labelText={tagLabel}
              pillShape="No"
              priority="High"
              size="Extra Small"
              type="Drive pink"
            />
          </div>
        ) : null}

        {showPlayButton ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              inset: 0,
              justifyContent: "center",
              pointerEvents: "none",
              position: "absolute",
              zIndex: 1
            }}
          >
            <button
              aria-label={playLabel}
              onClick={onPlayClick}
              style={{
                alignItems: "center",
                appearance: "none",
                background: playButtonSurface,
                border: "none",
                borderRadius: tokenValueToRem(9999),
                boxShadow: playButtonShadow,
                color: playButtonIconColor,
                cursor: "pointer",
                display: "inline-flex",
                height: playButtonSize,
                justifyContent: "center",
                padding: 0,
                pointerEvents: "auto",
                width: playButtonSize
              }}
              type="button"
            >
              <Icon
                decorative
                name="play-filled"
                style={{ color: "inherit", fontSize: pxToRem(metrics.playButtonIconSize) }}
              />
            </button>
          </div>
        ) : null}
      </div>

      <div
        style={{
          boxSizing: "border-box",
          display: "grid",
          gap: contentGap,
          padding: contentPadding,
          width: "100%"
        }}
      >
        <div style={{ display: "grid", gap: textGap, minWidth: 0 }}>
          <p style={titleStyles}>{title}</p>
          {hasDescription ? <p style={descriptionStyles}>{description}</p> : null}
        </div>

        <div style={{ alignItems: "center", display: "flex", gap: writerGap, minWidth: 0 }}>
          <Avatar {...resolvedAvatarProps} />

          <div style={{ display: "grid", flex: "1 1 auto", gap: pxToRem(0), minWidth: 0 }}>
            <p style={authorNameStyles}>{authorName}</p>

            {(hasDate || hasSecondaryInfo) ? (
              <div style={{ alignItems: "center", display: "flex", gap: metaGap, minWidth: 0 }}>
                {hasDate ? <p style={metaTextStyles}>{date}</p> : null}
                {hasDate && hasSecondaryInfo ? (
                  <span
                    aria-hidden="true"
                    style={{
                      background: metaDividerColor,
                      borderRadius: tokenValueToRem(999),
                      display: "inline-flex",
                      flexShrink: 0,
                      height: pxToRem(2),
                      width: pxToRem(2)
                    }}
                  />
                ) : null}
                {hasSecondaryInfo ? (
                  <p style={{ ...metaTextStyles, flex: "0 1 auto", minWidth: 0 }}>{secondaryInfo}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
