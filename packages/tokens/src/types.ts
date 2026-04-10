export type TokenLeaf = string | number;

export type TokenTree = {
  [key: string]: TokenLeaf | TokenTree;
};

export type BrandId = "core" | "acme";

export type FigmaBrandName = "Cars24" | "Team BHP" | "CarInfo" | "Vehicle Info";

export const FIGMA_BRAND_TO_REPO_BRAND: Record<FigmaBrandName, BrandId> = {
  Cars24: "core",
  "Team BHP": "core",
  CarInfo: "acme",
  "Vehicle Info": "acme"
};

export type TokenMode = "light" | "dark";

export interface BrandTokenSet {
  brandId: BrandId;
  mode: TokenMode;
  tokens: TokenTree;
}

export interface FlattenedToken {
  path: string;
  value: TokenLeaf;
  brandId: BrandId;
  mode: TokenMode;
}
