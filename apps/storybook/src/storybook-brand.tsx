import { type DisplayBrandId } from "@turbo/tokens";

export type StorybookBrandGlobal = "auto" | DisplayBrandId;

export function resolveStoryBrand(
  brand?: DisplayBrandId,
  globalBrand?: StorybookBrandGlobal,
  fallback: DisplayBrandId = "Cars24"
): DisplayBrandId {
  if (globalBrand && globalBrand !== "auto") {
    return globalBrand;
  }

  return brand ?? fallback;
}
