import { coreTokenCatalog, deepMergeTokenTrees, getBrandTokenSet, getTokenValue } from "@geist/tokens";
import type { BrandId } from "@geist/tokens";

export function getNativeThemeTokens(brandId: BrandId) {
  const brandSet = getBrandTokenSet(brandId);
  return deepMergeTokenTrees(coreTokenCatalog, brandSet.tokens);
}

export function getNativeThemeTokenValue(brandId: BrandId, path: string) {
  return getTokenValue(getNativeThemeTokens(brandId), path);
}

export function getRequiredNativeThemeTokenValue(brandId: BrandId, path: string) {
  const value = getNativeThemeTokenValue(brandId, path);
  if (value === undefined) {
    throw new Error(`Missing native theme token value for brand "${brandId}" at path "${path}"`);
  }

  return value;
}
