import { coreTokenCatalog } from "./base-tokens";
import { flattenTokens } from "./figma-bridge";
import { getBrandTokenSet } from "./brand-overrides";
import { deepMergeTokenTrees } from "./lookup";
import { REPO_BRAND_IDS } from "./types";

const requiredCollections = ["color", "typography", "spacing", "radius", "icon"];

const baseCollections = Object.keys(coreTokenCatalog);
for (const collection of requiredCollections) {
  if (!baseCollections.includes(collection)) {
    throw new Error(`Missing required token collection: ${collection}`);
  }
}

for (const brandId of REPO_BRAND_IDS) {
  const set = getBrandTokenSet(brandId);
  const flattened = flattenTokens(deepMergeTokenTrees(coreTokenCatalog, set.tokens));
  if (flattened.length === 0) {
    throw new Error(`Brand token set is empty: ${brandId}`);
  }
}

console.log("Token catalog validation passed.");
