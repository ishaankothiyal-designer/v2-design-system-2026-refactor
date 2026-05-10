import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalFullBleedBannerCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.fullBleedBannerCard"
);

export type FullBleedBannerCardSize = "XXS" | "XS" | "S" | "M" | "L" | "XL";

type FullBleedBannerCardMetrics = {
  widthSlot: string;
  heightSlot: string;
};

const FULL_BLEED_BANNER_CARD_METRICS: Record<FullBleedBannerCardSize, FullBleedBannerCardMetrics> = {
  XXS: {
    widthSlot: "size.xxs.width",
    heightSlot: "size.xxs.height"
  },
  XS: {
    widthSlot: "size.xs.width",
    heightSlot: "size.xs.height"
  },
  S: {
    widthSlot: "size.s.width",
    heightSlot: "size.s.height"
  },
  M: {
    widthSlot: "size.m.width",
    heightSlot: "size.m.height"
  },
  L: {
    widthSlot: "size.l.width",
    heightSlot: "size.l.height"
  },
  XL: {
    widthSlot: "size.xl.width",
    heightSlot: "size.xl.height"
  }
};

export interface FullBleedBannerCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  children?: ReactNode;
  onPlayClick?: MouseEventHandler<HTMLButtonElement>;
  playLabel?: string;
  size?: FullBleedBannerCardSize;
  video?: boolean;
}

function getFullBleedBannerCardToken(slot: string) {
  return canonicalFullBleedBannerCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveFullBleedBannerCardBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getFullBleedBannerCardToken(slot);

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

export function FullBleedBannerCard({
  brand = "Cars24",
  children,
  className,
  onPlayClick,
  playLabel = "Play video",
  size = "XXS",
  style,
  video = true,
  ...rest
}: FullBleedBannerCardProps) {
  const metrics = FULL_BLEED_BANNER_CARD_METRICS[size];
  const borderRadius = tokenValueToRem(
    resolveFullBleedBannerCardBindingValue(brand, "container.radius", "0")
  );
  const width = tokenValueToRem(
    resolveFullBleedBannerCardBindingValue(brand, metrics.widthSlot, "360px")
  );
  const height = tokenValueToRem(
    resolveFullBleedBannerCardBindingValue(brand, metrics.heightSlot, "80px")
  );
  const surfaceBackground = resolveFullBleedBannerCardBindingValue(
    brand,
    "surface.background",
    "#FFE8F6"
  );

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
          background: surfaceBackground,
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

        {video ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              inset: 0,
              justifyContent: "center",
              pointerEvents: "none",
              position: "absolute"
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
                size="XSmall"
                styleVariant="Solid - Primary"
                type="button"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

