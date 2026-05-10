import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { designSystemRegistry } from "@geist/contracts";
import type { DisplayBrandId } from "@geist/tokens";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";

export const canonicalSeoContentCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.seoContentCard"
);

const SEO_CONTENT_CARD_WIDTH = 288;
const SEO_CONTENT_CARD_MEDIA_HEIGHT = 140;
const SEO_CONTENT_CARD_PLACEHOLDER_ICON_SIZE = 32;

const DEFAULT_TITLE = "A two line title car easily fit in the container. 15px";
const DEFAULT_DESCRIPTION =
  "Body text covering every aspect of the thing that is covered and conveyed to the user. Body text covering every aspect of the thing that is covered and conveyed to the user.";

function getLineClampStyles(lines: number): CSSProperties {
  return {
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    display: "-webkit-box",
    overflow: "hidden"
  };
}

function DefaultMediaSlot({ brand }: { brand: DisplayBrandId }) {
  const slotSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));

  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "center",
        background: slotSurface,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Icon
        decorative
        name="placeholder-generate-outline"
        style={{
          color: "var(--cars24-primitive-drive-pink-400, #FD49C0)",
          fontSize: pxToRem(SEO_CONTENT_CARD_PLACEHOLDER_ICON_SIZE)
        }}
      />
    </div>
  );
}

export interface SeoContentCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  children?: ReactNode;
  description?: string;
  title?: string;
}

/**
 * SEO-focused media card with a fixed slot, a two-line title, and a four-line body block matching the approved Figma component.
 */
export function SeoContentCard({
  brand = "Cars24",
  children,
  className,
  description = DEFAULT_DESCRIPTION,
  style,
  title = DEFAULT_TITLE,
  ...rest
}: SeoContentCardProps) {
  const fontFamily = `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`;
  const regularWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const semiboldWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const stackGap = pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.3")));
  const textGap = pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.1")));
  const slotRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.xl")));
  const slotSurface = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const titleColor = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const descriptionColor = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const titleFontSize = pxToRem(Number(getRequiredThemeTokenValue(brand, "component.label.lg.typography.label.fontSize")));
  const titleLineHeight = pxToRem(
    Number(getRequiredThemeTokenValue(brand, "component.label.lg.typography.label.lineHeight"))
  );
  const titleLetterSpacing = pxToRem(
    Number(getRequiredThemeTokenValue(brand, "component.label.lg.typography.label.letterSpacing"))
  );
  const descriptionFontSize = pxToRem(
    Number(getRequiredThemeTokenValue(brand, "component.label.md.typography.description.fontSize"))
  );
  const descriptionLineHeight = pxToRem(
    Number(getRequiredThemeTokenValue(brand, "component.label.md.typography.description.lineHeight"))
  );
  const descriptionLetterSpacing = pxToRem(
    Number(getRequiredThemeTokenValue(brand, "component.label.md.typography.description.letterSpacing"))
  );

  return (
    <div
      {...rest}
      className={className}
      style={{
        display: "inline-grid",
        gap: stackGap,
        width: pxToRem(SEO_CONTENT_CARD_WIDTH),
        ...style
      }}
    >
      <div
        style={{
          background: slotSurface,
          borderRadius: slotRadius,
          height: pxToRem(SEO_CONTENT_CARD_MEDIA_HEIGHT),
          overflow: "hidden",
          width: "100%"
        }}
      >
        <div style={{ height: "100%", width: "100%" }}>{children ?? <DefaultMediaSlot brand={brand} />}</div>
      </div>

      <div style={{ display: "grid", gap: textGap, minWidth: 0 }}>
        <p
          style={{
            ...getLineClampStyles(2),
            color: titleColor,
            fontFamily,
            fontSize: titleFontSize,
            fontWeight: semiboldWeight,
            letterSpacing: titleLetterSpacing,
            lineHeight: titleLineHeight,
            margin: 0,
            minWidth: 0
          }}
        >
          {title}
        </p>

        <p
          style={{
            ...getLineClampStyles(4),
            color: descriptionColor,
            fontFamily,
            fontSize: descriptionFontSize,
            fontWeight: regularWeight,
            letterSpacing: descriptionLetterSpacing,
            lineHeight: descriptionLineHeight,
            margin: 0,
            minWidth: 0
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
