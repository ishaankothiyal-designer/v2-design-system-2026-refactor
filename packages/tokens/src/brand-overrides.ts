import core from "../tokens/brands/core.json";
import acme from "../tokens/brands/acme.json";
import { FIGMA_BRAND_TO_REPO_BRAND } from "./types";
import type { BrandId, BrandTokenSet, FigmaBrandName } from "./types";

/**
 * Figma uses brand names like Cars24 and Team BHP, while the repo currently
 * stores the corresponding override sets as `core` and `acme`.
 */
export const BRAND_OVERRIDE_SOURCE_MAP: Record<FigmaBrandName, BrandId> = FIGMA_BRAND_TO_REPO_BRAND;

const brandSets: Record<BrandId, BrandTokenSet> = {
  core: {
    brandId: "core",
    mode: "light",
    tokens: core
  },
  acme: {
    brandId: "acme",
    mode: "light",
    tokens: acme
  }
};

export function getBrandTokenSet(brandId: BrandId): BrandTokenSet {
  return brandSets[brandId];
}
