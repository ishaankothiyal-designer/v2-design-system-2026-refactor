import cars24 from "../tokens/brands/cars24.json";
import teamBhp from "../tokens/brands/teambhp.json";
import carInfo from "../tokens/brands/carinfo.json";
import vehicleInfo from "../tokens/brands/vehicleinfo.json";
import { BRAND_ALIAS_TO_REPO_BRAND, FIGMA_BRAND_TO_REPO_BRAND } from "./types";
import type { BrandId, BrandTokenSet, FigmaBrandName, RepoBrandId } from "./types";

/**
 * Figma and Storybook expose brand-friendly names, while the repo resolves
 * them to the concrete token override sources below.
 */
export const BRAND_OVERRIDE_SOURCE_MAP: Record<FigmaBrandName, RepoBrandId> = FIGMA_BRAND_TO_REPO_BRAND;

const brandSets: Record<RepoBrandId, BrandTokenSet> = {
  cars24: {
    brandId: "cars24",
    mode: "light",
    tokens: cars24
  },
  teambhp: {
    brandId: "teambhp",
    mode: "light",
    tokens: teamBhp
  },
  carinfo: {
    brandId: "carinfo",
    mode: "light",
    tokens: carInfo
  },
  vehicleinfo: {
    brandId: "vehicleinfo",
    mode: "light",
    tokens: vehicleInfo
  }
};

export function normalizeBrandId(brandId: BrandId): RepoBrandId {
  return BRAND_ALIAS_TO_REPO_BRAND[brandId];
}

export function getBrandTokenSet(brandId: BrandId): BrandTokenSet {
  return brandSets[normalizeBrandId(brandId)];
}
