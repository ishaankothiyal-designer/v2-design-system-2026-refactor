export type TokenLeaf = string | number;

export type TokenTree = {
  [key: string]: TokenLeaf | TokenTree;
};

export type RepoBrandId = "cars24" | "teambhp" | "carinfo" | "vehicleinfo";
export type DisplayBrandId = "Cars24" | "Team BHP" | "CarInfo" | "VehicleInfo";
export type LegacyRepoBrandId = "core" | "acme";
export type BrandId = RepoBrandId | LegacyRepoBrandId | DisplayBrandId;

export const STORYBOOK_BRAND_OPTIONS: DisplayBrandId[] = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"];

export type FigmaBrandName = "Cars24" | "Team BHP" | "CarInfo" | "Vehicle Info";

export const FIGMA_BRAND_TO_REPO_BRAND: Record<FigmaBrandName, RepoBrandId> = {
  Cars24: "cars24",
  "Team BHP": "teambhp",
  CarInfo: "carinfo",
  "Vehicle Info": "vehicleinfo"
};

export const BRAND_ALIAS_TO_REPO_BRAND: Record<BrandId, RepoBrandId> = {
  cars24: "cars24",
  teambhp: "teambhp",
  carinfo: "carinfo",
  vehicleinfo: "vehicleinfo",
  core: "cars24",
  acme: "carinfo",
  Cars24: "cars24",
  "Team BHP": "teambhp",
  CarInfo: "carinfo",
  VehicleInfo: "vehicleinfo"
};

export const REPO_BRAND_IDS: RepoBrandId[] = ["cars24", "teambhp", "carinfo", "vehicleinfo"];

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
