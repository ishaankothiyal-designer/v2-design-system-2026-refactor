import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export const canonicalSingleBannerCardWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.singleBannerCard"
);

export interface SingleBannerCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  children?: ReactNode;
  onPlayClick?: MouseEventHandler<HTMLButtonElement>;
  playLabel?: string;
  video?: boolean;
}

function getSingleBannerCardToken(slot: string) {
  return canonicalSingleBannerCardWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
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

function resolveSingleBannerCardBindingValue(
  brand: DisplayBrandId,
  slot: string,
  fallback: string
) {
  const token = getSingleBannerCardToken(slot);

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

export function SingleBannerCard({
  brand = "Cars24",
  children,
  className,
  onPlayClick,
  playLabel = "Play video",
  style,
  video = true,
  ...rest
}: SingleBannerCardProps) {
  const borderRadius = tokenValueToRem(resolveSingleBannerCardBindingValue(brand, "container.radius", "0"));
  const width = tokenValueToRem(resolveSingleBannerCardBindingValue(brand, "container.width", "336px"));
  const height = tokenValueToRem(resolveSingleBannerCardBindingValue(brand, "container.height", "168px"));
  const surfaceBackground = resolveSingleBannerCardBindingValue(
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

