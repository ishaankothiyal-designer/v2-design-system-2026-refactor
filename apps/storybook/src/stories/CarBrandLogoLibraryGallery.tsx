import { useMemo, useState, type CSSProperties } from "react";
import { coreTokenCatalog } from "@geist/tokens";
import {
  carBrandImageBrands,
  carBrandVectorBrands,
  getCarBrandLogoLabel,
  totalCarBrandImageCount,
  totalCarBrandVectorCount,
  type CarBrandLogoAspectRatio,
  type CarBrandLogoAssetType,
  type CarBrandLogoBrand
} from "./carBrandLogoLibraryData";

const imagePngAssets = import.meta.glob("./assets/car-brand-logos/image/*.png", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const imageSvgAssets = import.meta.glob("./assets/car-brand-logos/image/*.svg", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const imageAssets = {
  ...imagePngAssets,
  ...imageSvgAssets
};

const vectorAssets = import.meta.glob("./assets/car-brand-logos/vector/*.svg", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const ratioSizes: Record<CarBrandLogoAspectRatio, { width: number; height: number }> = {
  "4:3": { width: 96, height: 72 },
  "1:1": { width: 72, height: 72 }
};

const assetTypeLabels: Record<CarBrandLogoAssetType, string> = {
  image: "Image",
  vector: "Vector"
};

const assetTypeDescriptions: Record<CarBrandLogoAssetType, string> = {
  image: "Raster PNG exports sourced from the car brand logo image set.",
  vector: "Flat SVG exports sourced from the car brand logo vector set."
};

const controlsStyles: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 16
};

const galleryGridStyles: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 24,
  alignItems: "start"
};

const galleryItemStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  minWidth: 0
};

const galleryLabelStyles: CSSProperties = {
  margin: 0,
  fontSize: 16,
  lineHeight: "24px",
  color: String(coreTokenCatalog.color.text.primary)
};

const buttonBaseStyles: CSSProperties = {
  appearance: "none",
  borderRadius: 999,
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 700,
  lineHeight: "18px",
  cursor: "pointer",
  transition: "all 160ms ease"
};

function getAssetSource(brand: CarBrandLogoBrand, assetType: CarBrandLogoAssetType) {
  if (assetType === "vector") {
    return vectorAssets[`./assets/car-brand-logos/vector/${brand}.svg`];
  }

  return (
    imageAssets[`./assets/car-brand-logos/image/${brand}.png`] ??
    imageAssets[`./assets/car-brand-logos/image/${brand}.svg`]
  );
}

function LogoPreview({
  brand,
  assetType,
  ratio
}: {
  brand: CarBrandLogoBrand;
  assetType: CarBrandLogoAssetType;
  ratio: CarBrandLogoAspectRatio;
}) {
  const src = getAssetSource(brand, assetType);

  if (!src) {
    return null;
  }

  const size = ratioSizes[ratio];
  const isVectorAsset = assetType === "vector";

  return (
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: ratio === "4:3" ? 10 : 8,
        borderRadius: 16,
        border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
        background: String(coreTokenCatalog.color.surface.canvas)
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        src={src}
        style={{
          display: "block",
          objectPosition: "center",
          ...(isVectorAsset
            ? {
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%"
              }
            : {
                width: "100%",
                height: "100%",
                objectFit: "contain"
              })
        }}
      />
    </div>
  );
}

export function CarBrandLogoLibraryGallery() {
  const [assetType, setAssetType] = useState<CarBrandLogoAssetType>("image");
  const [ratio, setRatio] = useState<CarBrandLogoAspectRatio>("4:3");

  const visibleBrands = useMemo(
    () => (assetType === "image" ? carBrandImageBrands : carBrandVectorBrands),
    [assetType]
  );

  const assetCount = assetType === "image" ? totalCarBrandImageCount : totalCarBrandVectorCount;

  return (
    <>
      <div style={controlsStyles}>
        {(["image", "vector"] as const).map((value) => {
          const isActive = assetType === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setAssetType(value)}
              style={{
                ...buttonBaseStyles,
                border: `1px solid ${
                  isActive
                    ? String(coreTokenCatalog.color.brand.primary[600])
                    : String(coreTokenCatalog.color.border.default)
                }`,
                background: isActive
                  ? String(coreTokenCatalog.color.brand.primary[50])
                  : String(coreTokenCatalog.color.surface.canvas),
                color: isActive
                  ? String(coreTokenCatalog.color.brand.primary[700])
                  : String(coreTokenCatalog.color.text.primary)
              }}
            >
              {assetTypeLabels[value]}
            </button>
          );
        })}
      </div>

      <div style={controlsStyles}>
        {(["4:3", "1:1"] as const).map((value) => {
          const isActive = ratio === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRatio(value)}
              style={{
                ...buttonBaseStyles,
                border: `1px solid ${
                  isActive
                    ? String(coreTokenCatalog.color.brand.primary[600])
                    : String(coreTokenCatalog.color.border.default)
                }`,
                background: isActive
                  ? String(coreTokenCatalog.color.brand.primary[50])
                  : String(coreTokenCatalog.color.surface.canvas),
                color: isActive
                  ? String(coreTokenCatalog.color.brand.primary[700])
                  : String(coreTokenCatalog.color.text.primary)
              }}
            >
              {value}
            </button>
          );
        })}
      </div>

      <p style={{ color: String(coreTokenCatalog.color.text.secondary), lineHeight: "24px", marginTop: 0 }}>
        {assetTypeDescriptions[assetType]} Currently showing {assetCount} brands in the {ratio} container preset.
      </p>

      <div style={galleryGridStyles}>
        {visibleBrands.map((brand) => (
          <div key={`${assetType}-${ratio}-${brand}`} style={galleryItemStyles}>
            <LogoPreview brand={brand} assetType={assetType} ratio={ratio} />
            <p style={galleryLabelStyles}>{getCarBrandLogoLabel(brand)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
