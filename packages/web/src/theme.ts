import { coreTokenCatalog } from "@turbo/tokens";
import { deepMergeTokenTrees, getTokenValue } from "@turbo/tokens";
import { getBrandTokenSet } from "@turbo/tokens";
import { pxToRem, tokenValueToRem } from "@turbo/tokens";
import type { BrandId } from "@turbo/tokens";

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

export { pxToRem, tokenValueToRem };

export function getThemeTokenRem(brandId: BrandId, path: string) {
  const value = getThemeTokenValue(brandId, path);
  return value === undefined ? undefined : tokenValueToRem(value);
}

export function getRequiredThemeTokenRem(brandId: BrandId, path: string) {
  return tokenValueToRem(getRequiredThemeTokenValue(brandId, path));
}
