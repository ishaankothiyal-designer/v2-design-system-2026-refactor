import type { TokenLeaf, TokenTree } from "./types";

export function deepMergeTokenTrees(base: TokenTree, override: TokenTree): TokenTree {
  const merged: TokenTree = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = merged[key];
    if (
      typeof existing === "object" &&
      existing !== null &&
      !Array.isArray(existing) &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      merged[key] = deepMergeTokenTrees(existing as TokenTree, value as TokenTree);
      continue;
    }

    merged[key] = value as TokenLeaf | TokenTree;
  }

  return merged;
}

export function getTokenValue(tokenTree: TokenTree, path: string): TokenLeaf | undefined {
  const segments = path.split(".");
  let current: TokenLeaf | TokenTree | undefined = tokenTree;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }
    current = current[segment];
  }

  return typeof current === "object" ? undefined : current;
}

