import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@turbo/tokens";

export type BrandLogoBrand = DisplayBrandId;
export type BrandLogoType = "Logo" | "Symbol";

export interface BrandLogoProps extends HTMLAttributes<HTMLSpanElement> {
  brand: BrandLogoBrand;
  type?: BrandLogoType;
  onDark?: boolean;
  decorative?: boolean;
  imageFit?: CSSProperties["objectFit"];
  imagePosition?: CSSProperties["objectPosition"];
  label?: string;
  title?: string;
}

type LogoAsset = {
  light: string;
  dark: string;
  width: number;
  height: number;
};

const brandLogoAssets: Record<BrandLogoBrand, Record<BrandLogoType, LogoAsset>> = {
  Cars24: {
    Logo: {
      light: new URL("./assets/brand-logos/cars24-logo-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/cars24-logo-dark.png", import.meta.url).href,
      width: 132,
      height: 40
    },
    Symbol: {
      light: new URL("./assets/brand-logos/cars24-symbol-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/cars24-symbol-dark.png", import.meta.url).href,
      width: 40,
      height: 40
    }
  },
  CarInfo: {
    Logo: {
      light: new URL("./assets/brand-logos/carinfo-logo-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/carinfo-logo-dark.png", import.meta.url).href,
      width: 132,
      height: 40
    },
    Symbol: {
      light: new URL("./assets/brand-logos/carinfo-symbol-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/carinfo-symbol-dark.png", import.meta.url).href,
      width: 40,
      height: 40
    }
  },
  VehicleInfo: {
    Logo: {
      light: new URL("./assets/brand-logos/vehicleinfo-logo-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/vehicleinfo-logo-dark.png", import.meta.url).href,
      width: 174,
      height: 40
    },
    Symbol: {
      light: new URL("./assets/brand-logos/vehicleinfo-symbol-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/vehicleinfo-symbol-dark.png", import.meta.url).href,
      width: 40,
      height: 40
    }
  },
  "Team BHP": {
    Logo: {
      light: new URL("./assets/brand-logos/team-bhp-logo-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/team-bhp-logo-dark.png", import.meta.url).href,
      width: 174,
      height: 40
    },
    Symbol: {
      light: new URL("./assets/brand-logos/team-bhp-symbol-light.png", import.meta.url).href,
      dark: new URL("./assets/brand-logos/team-bhp-symbol-dark.png", import.meta.url).href,
      width: 40,
      height: 40
    }
  }
};

export function BrandLogo({
  brand,
  type = "Logo",
  onDark = false,
  decorative = true,
  imageFit = "contain",
  imagePosition = "center",
  label,
  title,
  className,
  style,
  ...rest
}: BrandLogoProps) {
  const asset = brandLogoAssets[brand][type];
  const src = onDark ? asset.dark : asset.light;
  const accessibilityLabel = label ?? title ?? `${brand} ${type.toLowerCase()}`;
  const accessibilityProps =
    decorative && !label && !title
      ? ({ "aria-hidden": true } as const)
      : ({
          role: "img" as const,
          "aria-label": accessibilityLabel
        } as const);

  return (
    <span
      {...rest}
      {...accessibilityProps}
      title={title}
      className={className}
      style={
        {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: asset.width,
          height: asset.height,
          lineHeight: 0,
          flexShrink: 0,
          ...style
        } satisfies CSSProperties
      }
    >
      <img
        alt=""
        aria-hidden="true"
        src={src}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: imageFit,
          objectPosition: imagePosition
        }}
      />
    </span>
  );
}
