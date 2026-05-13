import { type CSSProperties, type HTMLAttributes, useId } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalLazyLoaderWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.lazyLoader"
);

const DEFAULT_WIDTH = 210;
const DEFAULT_HEIGHT = 32;
const TERTIARY_SURFACE_BACKGROUND = "var(--cars24-semantic-bg-tertiary, #E2E8F0)";
const SHIMMER_ANIMATION_NAME = "geist-lazy-loader-shimmer";

function toCssDimension(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

export interface LazyLoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  width?: number | string;
  height?: number | string;
}

/**
 * Token-backed loading placeholder that preserves layout while deferred content is being prepared.
 */
export function LazyLoader({
  brand = "Cars24",
  height = DEFAULT_HEIGHT,
  role,
  style,
  width = DEFAULT_WIDTH,
  ...rest
}: LazyLoaderProps) {
  const generatedId = useId();
  const canvasSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const radius = `${Number(getRequiredThemeTokenValue(brand, "radius.alt.xs"))}px`;
  const shimmerClassName = `geist-lazy-loader-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const hiddenFromAssistiveTech =
    role === undefined &&
    rest["aria-label"] === undefined &&
    rest["aria-labelledby"] === undefined &&
    rest["aria-describedby"] === undefined;

  const rootStyles: CSSProperties = {
    backgroundColor: TERTIARY_SURFACE_BACKGROUND,
    backgroundImage: `linear-gradient(98.66413131689013deg, ${TERTIARY_SURFACE_BACKGROUND} 19.651%, ${canvasSurface} 50%, ${TERTIARY_SURFACE_BACKGROUND} 80.104%)`,
    backgroundPosition: "200% 50%",
    backgroundSize: "250% 100%",
    borderRadius: radius,
    boxSizing: "border-box",
    display: "block",
    height: toCssDimension(height),
    overflow: "hidden",
    willChange: "background-position",
    width: toCssDimension(width),
    ...style
  };

  return (
    <>
      <style>{`
        @keyframes ${SHIMMER_ANIMATION_NAME}{
          from{background-position:200% 50%;}
          to{background-position:-50% 50%;}
        }
        .${shimmerClassName}{
          animation:${SHIMMER_ANIMATION_NAME} 1.6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce){
          .${shimmerClassName}{
            animation:none;
          }
        }
      `}</style>
      <div
        {...rest}
        {...(hiddenFromAssistiveTech ? { "aria-hidden": true } : {})}
        className={[shimmerClassName, rest.className].filter(Boolean).join(" ")}
        role={role}
        style={rootStyles}
      />
    </>
  );
}
