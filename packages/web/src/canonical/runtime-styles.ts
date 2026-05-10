import {
  coreTokenCatalog,
  deepMergeTokenTrees,
  flattenTokens,
  getBrandTokenSet,
  getTokenValue,
  normalizeBrandId,
  REPO_BRAND_IDS,
  type BrandId,
  type RepoBrandId,
  type TokenTree
} from "@turbo/tokens";
import { pxToRem } from "../theme";

const mergedBrandTokenTrees = Object.fromEntries(
  REPO_BRAND_IDS.map((brandId) => [
    brandId,
    deepMergeTokenTrees(coreTokenCatalog as TokenTree, getBrandTokenSet(brandId).tokens)
  ])
) as Record<RepoBrandId, TokenTree>;

export { normalizeBrandId, REPO_BRAND_IDS };

export const VISUALLY_HIDDEN_CLASS = "geist-visually-hidden";
const VISUALLY_HIDDEN_STYLESHEET_ID = "geist-visually-hidden-styles";
const RUNTIME_TOKEN_STYLESHEET_ID = "geist-runtime-theme-token-styles";
const VISUALLY_HIDDEN_STYLESHEET = toCssRule(`.${VISUALLY_HIDDEN_CLASS}`, {
  border: "0",
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  "white-space": "nowrap",
  width: "1px"
});

function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function runtimeTokenCssVarName(path: string) {
  const kebabPath = path
    .split(".")
    .map((segment) => toKebabCase(segment))
    .join("-");

  if (kebabPath.startsWith("color-")) {
    return `--cars24-${kebabPath.slice("color-".length)}`;
  }

  return `--cars24-${kebabPath}`;
}

export function runtimeTokenVar(path: string, fallback?: string) {
  const cssVarName = runtimeTokenCssVarName(path);
  return fallback === undefined ? `var(${cssVarName})` : `var(${cssVarName}, ${fallback})`;
}

export function runtimeTokenVarPx(path: string) {
  return `calc(${runtimeTokenVar(path)} * 1px)`;
}

const RUNTIME_TOKEN_STYLESHEET = REPO_BRAND_IDS.map((brandId) =>
  toCssRule(
    `[data-brand="${brandId}"]`,
    Object.fromEntries(
      flattenTokens(mergedBrandTokenTrees[brandId]).map(({ path, value }) => [
        runtimeTokenCssVarName(path),
        String(value)
      ])
    )
  )
).join("");

function appendStyleSheet(id: string, cssText: string) {
  if (typeof document === "undefined" || document.getElementById(id)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.id = id;
  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
}

export function getRequiredRuntimeTokenValue(brandId: RepoBrandId, path: string) {
  const value = getTokenValue(mergedBrandTokenTrees[brandId], path);

  if (value === undefined) {
    throw new Error(`Missing runtime token for brand "${brandId}" at path "${path}"`);
  }

  return value;
}

export function getRequiredRuntimeTokenValueForBrand(brandId: BrandId, path: string) {
  return getRequiredRuntimeTokenValue(normalizeBrandId(brandId), path);
}

export function toRem(value: string | number) {
  return pxToRem(Number(value));
}

export function toCssDeclarationBlock(declarations: Record<string, string | undefined>) {
  return Object.entries(declarations)
    .filter(([, value]) => value !== undefined)
    .map(([property, value]) => `${property}:${value};`)
    .join("");
}

export function toCssRule(selector: string, declarations: Record<string, string | undefined>) {
  return `${selector}{${toCssDeclarationBlock(declarations)}}`;
}

export function ensureRuntimeTokenStyles() {
  appendStyleSheet(RUNTIME_TOKEN_STYLESHEET_ID, RUNTIME_TOKEN_STYLESHEET);
}

export function ensureStyleSheet(id: string, cssText: string) {
  if (typeof document === "undefined") {
    return;
  }

  if (id !== RUNTIME_TOKEN_STYLESHEET_ID) {
    ensureRuntimeTokenStyles();
  }

  appendStyleSheet(id, cssText);
}

export function ensureVisuallyHiddenStyles() {
  ensureStyleSheet(VISUALLY_HIDDEN_STYLESHEET_ID, VISUALLY_HIDDEN_STYLESHEET);
}

export function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
