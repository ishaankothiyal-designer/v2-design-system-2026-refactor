import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const storybookRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(scriptDir, "../../..");

const generatedDir = path.join(storybookRoot, "src/generated");
const baseTokensPath = path.join(repoRoot, "packages/tokens/tokens/base.json");
const baseCssOutputPath = path.join(generatedDir, "design-tokens.tokens.css");
const figmaTokenExportPath = path.join(storybookRoot, "token-data/Tokens-variables-full-x.json");
const figmaCssOutputPath = path.join(generatedDir, "figma-color-tokens.tokens.css");
const figmaDocsOutputPath = path.join(generatedDir, "ColorTokens.mdx");

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function flattenTokens(tokenTree, prefix = []) {
  const entries = [];

  for (const [key, value] of Object.entries(tokenTree)) {
    const nextPath = [...prefix, key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      entries.push(...flattenTokens(value, nextPath));
      continue;
    }

    entries.push({ path: nextPath, value });
  }

  return entries;
}

function toWords(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim();
}

function toTitleCase(value) {
  return toWords(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toKebabCase(value) {
  return toWords(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
    .join("-");
}

function compareNaturally(left, right) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

function sanitizeComment(value) {
  return value.replace(/\*\//g, "*\\/").replace(/\s+/g, " ").trim();
}

function isColorToken(value) {
  return (
    typeof value === "string" &&
    /^(#|rgb\(|rgba\(|hsl\(|hsla\(|linear-gradient\(|radial-gradient\()/i.test(value.trim())
  );
}

function determineBaseCategory(tokenPath) {
  if (tokenPath[0] === "color") {
    return "Colors";
  }

  if (tokenPath[0] === "typography") {
    return "Typography";
  }

  if (tokenPath[0] === "component") {
    return `${toTitleCase(tokenPath[1] ?? "Component")} Tokens`;
  }

  return toTitleCase(tokenPath[0] ?? "Tokens");
}

function determinePresenter(tokenPath, value) {
  const joinedPath = tokenPath.join(".").toLowerCase();

  if (isColorToken(value)) {
    return "Color";
  }

  if (joinedPath.includes("fontfamily")) {
    return "FontFamily";
  }

  if (joinedPath.includes("fontsize")) {
    return "FontSize";
  }

  if (joinedPath.includes("fontweight")) {
    return "FontWeight";
  }

  if (joinedPath.includes("lineheight")) {
    return "LineHeight";
  }

  if (joinedPath.includes("letterspacing")) {
    return "LetterSpacing";
  }

  if (joinedPath.includes("shadow")) {
    return "Shadow";
  }

  if (joinedPath.includes("opacity")) {
    return "Opacity";
  }

  if (joinedPath.includes("radius")) {
    return "BorderRadius";
  }

  if (typeof value === "number") {
    return "Spacing";
  }

  return undefined;
}

function serializeBaseValue(value, presenter) {
  if (typeof value === "number") {
    if (presenter === "FontWeight" || presenter === "Opacity") {
      return String(value);
    }

    return `${value}px`;
  }

  return String(value);
}

function buildCssFile(groups, headerComment) {
  const lines = [":root {", `  /* ${headerComment} */`];

  for (const group of groups) {
    lines.push("  /**");
    lines.push(`   * @tokens ${group.category}`);
    lines.push("   */");

    for (const token of group.tokens) {
      const details = [token.path];

      if (token.description) {
        details.push(token.description);
      }

      if (token.codeSyntax) {
        details.push(`WEB: ${token.codeSyntax}`);
      }

      if (token.presenter) {
        details.push(`@presenter ${token.presenter}`);
      }

      lines.push(`  ${token.cssName}: ${token.value}; /* ${sanitizeComment(details.join(" | "))} */`);
    }

    lines.push("");
  }

  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

function generateBaseTokenCss() {
  const tokenEntries = flattenTokens(readJson(baseTokensPath));
  const groupedTokens = new Map();

  for (const entry of tokenEntries) {
    const presenter = determinePresenter(entry.path, entry.value);
    const token = {
      cssName: `--${entry.path.map(toKebabCase).join("-")}`,
      path: entry.path.join("."),
      presenter,
      value: serializeBaseValue(entry.value, presenter)
    };

    const category = determineBaseCategory(entry.path);
    const existing = groupedTokens.get(category) ?? [];
    existing.push(token);
    groupedTokens.set(category, existing);
  }

  const groups = [...groupedTokens.entries()].map(([category, tokens]) => ({
    category,
    tokens
  }));

  writeFileSync(baseCssOutputPath, buildCssFile(groups, "Generated from packages/tokens/tokens/base.json"));
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value * 255)));
}

function toHex(value) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function serializeFigmaColor(color) {
  const red = clampChannel(color.r ?? 0);
  const green = clampChannel(color.g ?? 0);
  const blue = clampChannel(color.b ?? 0);
  const alpha = typeof color.a === "number" ? Number(color.a.toFixed(4)) : 1;

  if (alpha >= 1) {
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function escapeMdxText(value) {
  return value.replace(/[{}]/g, "\\$&");
}

function createFigmaResolvers(figmaExport) {
  const collections = figmaExport.collections ?? [];
  const variableById = new Map();
  const collectionById = new Map();

  for (const collection of collections) {
    collectionById.set(collection.id, collection);

    for (const variable of collection.variables ?? []) {
      variableById.set(variable.id, variable);
    }
  }

  function pickModeValue(variable, preferredModeId, preferredModeName) {
    const valuesByMode = variable.valuesByMode ?? {};

    if (preferredModeId && valuesByMode[preferredModeId]) {
      return valuesByMode[preferredModeId];
    }

    const collection = collectionById.get(variable.variableCollectionId);

    if (preferredModeName && collection) {
      const matchingMode = (collection.modes ?? []).find(
        (mode) => mode.name === preferredModeName && valuesByMode[mode.modeId]
      );

      if (matchingMode) {
        return valuesByMode[matchingMode.modeId];
      }
    }

    if (collection?.defaultModeId && valuesByMode[collection.defaultModeId]) {
      return valuesByMode[collection.defaultModeId];
    }

    const values = Object.values(valuesByMode);

    if (values.length === 1) {
      return values[0];
    }

    throw new Error(`Could not determine color mode for ${variable.name}`);
  }

  function resolveColorValue(variable, preferredModeId, preferredModeName, seen = new Set()) {
    const seenKey = `${variable.id}:${preferredModeId ?? preferredModeName ?? "default"}`;

    if (seen.has(seenKey)) {
      throw new Error(`Circular alias detected while resolving ${variable.name}`);
    }

    seen.add(seenKey);

    const value = pickModeValue(variable, preferredModeId, preferredModeName);

    if (value?.type === "VARIABLE_ALIAS") {
      const target = variableById.get(value.id);

      if (!target) {
        throw new Error(`Missing alias target ${value.id} for ${variable.name}`);
      }

      return resolveColorValue(target, preferredModeId, preferredModeName, seen);
    }

    if (typeof value?.r === "number" && typeof value?.g === "number" && typeof value?.b === "number") {
      return serializeFigmaColor(value);
    }

    throw new Error(`Unsupported color value for ${variable.name}`);
  }

  return { resolveColorValue };
}

function createDocSection(category, heading, description) {
  return [
    `## ${escapeMdxText(heading)}`,
    "",
    escapeMdxText(description),
    "",
    `<DesignTokenDocBlock`,
    `  categoryName="${category}"`,
    `  maxHeight={720}`,
    `  pageSize={Number.MAX_VALUE}`,
    `  showSearch={false}`,
    `  viewType="card"`,
    `/>`,
    ""
  ];
}

function generateFigmaColorDocs() {
  if (!existsSync(figmaTokenExportPath)) {
    return;
  }

  const figmaExport = readJson(figmaTokenExportPath);
  const { resolveColorValue } = createFigmaResolvers(figmaExport);
  const groups = [];

  const themeCollection = (figmaExport.collections ?? []).find((collection) => collection.name === "Theme");

  if (themeCollection) {
    for (const mode of themeCollection.modes ?? []) {
      const colorVariables = (themeCollection.variables ?? [])
        .filter((variable) => variable.resolvedType === "COLOR")
        .sort((left, right) => compareNaturally(left.name, right.name));

      groups.push({
        category: `Theme / ${mode.name}`,
        heading: `Theme / ${mode.name}`,
        description: `${mode.name} theme palette with brand and alternate brand ramps from the Figma token export.`,
        tokens: colorVariables.map((variable) => ({
          cssName: `--figma-theme-${toKebabCase(mode.name)}-${variable.name.split("/").map(toKebabCase).join("-")}`,
          path: `Theme.${mode.name}.${variable.name.replace(/\//g, ".")}`,
          description: variable.description,
          codeSyntax: variable.codeSyntax?.WEB,
          presenter: "Color",
          value: resolveColorValue(variable, mode.modeId, mode.name)
        }))
      });
    }
  }

  const semanticCollection = (figmaExport.collections ?? []).find((collection) => collection.name === "Semantic");

  if (semanticCollection) {
    const semanticSections = [
      { root: "bg", title: "Semantic / Background", description: "Background fills and overlays across surface, brand, and feedback states." },
      { root: "text", title: "Semantic / Text", description: "Readable foreground text colors for default, inverse, brand, and feedback usage." },
      { root: "icon", title: "Semantic / Icon", description: "Icon foreground colors aligned with the semantic text and feedback system." },
      { root: "border", title: "Semantic / Border", description: "Border and outline colors for default, brand, inverse, and status surfaces." }
    ];

    for (const section of semanticSections) {
      const sectionVariables = (semanticCollection.variables ?? [])
        .filter((variable) => variable.resolvedType === "COLOR" && variable.name.startsWith(`${section.root}/`))
        .sort((left, right) => compareNaturally(left.name, right.name));

      if (sectionVariables.length === 0) {
        continue;
      }

      groups.push({
        category: section.title,
        heading: section.title,
        description: section.description,
        tokens: sectionVariables.map((variable) => ({
          cssName: `--figma-semantic-${variable.name.split("/").map(toKebabCase).join("-")}`,
          path: `Semantic.${variable.name.replace(/\//g, ".")}`,
          description: variable.description,
          codeSyntax: variable.codeSyntax?.WEB,
          presenter: "Color",
          value: resolveColorValue(variable, semanticCollection.defaultModeId, "Value")
        }))
      });
    }
  }

  writeFileSync(
    figmaCssOutputPath,
    buildCssFile(groups, "Generated from apps/storybook/token-data/Tokens-variables-full-x.json")
  );

  const mdxLines = [
    `import { Meta } from "@storybook/addon-docs/blocks";`,
    `import { DesignTokenDocBlock } from "storybook-design-token";`,
    "",
    `<Meta title="Foundations/Color Tokens" />`,
    "",
    "# Color Tokens",
    "",
    "Complete structural color documentation generated from the full Figma token export. This page covers every exported color token across theme modes and semantic token families.",
    ""
  ];

  for (const group of groups) {
    mdxLines.push(...createDocSection(group.category, group.heading, group.description));
  }

  writeFileSync(figmaDocsOutputPath, mdxLines.join("\n"));
}

mkdirSync(generatedDir, { recursive: true });

generateBaseTokenCss();
generateFigmaColorDocs();
