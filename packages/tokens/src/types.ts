export type TokenLeaf = string | number;

export type TokenTree = {
  [key: string]: TokenLeaf | TokenTree;
};

export type RepoBrandId = "core" | "acme";
export type DisplayBrandId = "Cars24" | "CarInfo" | "VehicleInfo";
export type BrandId = RepoBrandId | DisplayBrandId;

export const STORYBOOK_BRAND_OPTIONS: DisplayBrandId[] = ["Cars24", "CarInfo", "VehicleInfo"];

export type FigmaBrandName = "Cars24" | "Team BHP" | "CarInfo" | "Vehicle Info";

export const FIGMA_BRAND_TO_REPO_BRAND: Record<FigmaBrandName, RepoBrandId> = {
  Cars24: "core",
  "Team BHP": "core",
  CarInfo: "acme",
  "Vehicle Info": "acme"
};

export const BRAND_ALIAS_TO_REPO_BRAND: Record<BrandId, RepoBrandId> = {
  core: "core",
  acme: "acme",
  Cars24: "core",
  CarInfo: "acme",
  VehicleInfo: "acme"
};

export const REPO_BRAND_IDS: RepoBrandId[] = ["core", "acme"];

export type TokenMode = "light" | "dark";

export interface BrandTokenSet {
  brandId: RepoBrandId;
  mode: TokenMode;
  tokens: TokenTree;
}

export interface FlattenedToken {
  path: string;
  value: TokenLeaf;
  brandId: RepoBrandId;
  mode: TokenMode;
}
