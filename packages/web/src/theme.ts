import { coreTokenCatalog } from "@geist/tokens";
import { deepMergeTokenTrees, getTokenValue } from "@geist/tokens";
import { getBrandTokenSet } from "@geist/tokens";
import type { BrandId } from "@geist/tokens";

export function getThemeTokens(brandId: BrandId) {
  const brandSet = getBrandTokenSet(brandId);
  return deepMergeTokenTrees(coreTokenCatalog, brandSet.tokens);
}

export function getThemeTokenValue(brandId: BrandId, path: string) {
  return getTokenValue(getThemeTokens(brandId), path);
}

export function getRequiredThemeTokenValue(brandId: BrandId, path: string) {
  const value = getThemeTokenValue(brandId, path);
  if (value === undefined) {
    throw new Error(`Missing theme token value for brand "${brandId}" at path "${path}"`);
  }

  return value;
}
