import type { TokenLeaf, TokenTree, FlattenedToken } from "./types";

export interface FigmaVariableRef {
  collection: string;
  name: string;
  value: TokenLeaf;
}

function isTokenTree(value: TokenLeaf | TokenTree): value is TokenTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function flattenTokens(
  tokenTree: TokenTree,
  prefix: string[] = []
): Array<{ path: string; value: TokenLeaf }> {
  const entries: Array<{ path: string; value: TokenLeaf }> = [];

  for (const [key, value] of Object.entries(tokenTree)) {
    const nextPath = [...prefix, key];
    if (isTokenTree(value)) {
      entries.push(...flattenTokens(value, nextPath));
      continue;
    }

    entries.push({
      path: nextPath.join("."),
      value
    });
  }

  return entries;
}

export function toFigmaVariables(
  collection: string,
  tokenTree: TokenTree
): FigmaVariableRef[] {
  return flattenTokens(tokenTree).map(({ path, value }) => ({
    collection,
    name: path,
    value
  }));
}

export function createFlattenedTokenSet(
  brandId: "core" | "acme",
  mode: "light" | "dark",
  tokenTree: TokenTree
): FlattenedToken[] {
  return flattenTokens(tokenTree).map(({ path, value }) => ({
    brandId,
    mode,
    path,
    value
  }));
}

