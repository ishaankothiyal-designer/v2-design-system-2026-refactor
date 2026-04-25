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
const figmaTypographyCssOutputPath = path.join(generatedDir, "figma-typography.tokens.css");
const figmaTypographyDocsOutputPath = path.join(generatedDir, "TypographyTokens.mdx");
const figmaTypographyDataOutputPath = path.join(generatedDir, "typographyTokenData.ts");
const figmaGapCssOutputPath = path.join(generatedDir, "figma-gap.tokens.css");
const figmaGapDocsOutputPath = path.join(generatedDir, "GapTokens.mdx");
const figmaGapDataOutputPath = path.join(generatedDir, "gapTokenData.ts");
const radiusDocsOutputPath = path.join(generatedDir, "RadiusTokens.mdx");
const radiusDataOutputPath = path.join(generatedDir, "radiusTokenData.ts");
const REM_BASE_PX = 16;

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

function toRem(value) {
  if (value === 0) {
    return "0";
  }

  return `${Number((value / REM_BASE_PX).toFixed(4)).toString()}rem`;
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

    if (presenter === "FontSize" || presenter === "LineHeight" || presenter === "BorderRadius" || presenter === "Spacing") {
      return toRem(value);
    }

    return `${value}px`;
  }

  return String(value);
}

function serializeTypographyValue(value, presenter) {
  if (typeof value !== "number") {
    return String(value);
  }

  if (presenter === "LetterSpacing") {
    return value === 0 ? "0" : `${value}em`;
  }

  if (presenter === "FontWeight" || presenter === "Opacity") {
    return String(value);
  }

  if (presenter === "FontSize" || presenter === "LineHeight" || presenter === "Spacing" || presenter === "BorderRadius") {
    return toRem(value);
  }

  return `${value}px`;
}

function extractCssVariableName(codeSyntax, fallbackName) {
  if (typeof codeSyntax === "string") {
    const match = codeSyntax.match(/var\((--[^)\s]+)\)/);

    if (match) {
      return match[1];
    }
  }

  return fallbackName;
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

function createTypographyDocSection(category, heading, description) {
  return [
    `### ${escapeMdxText(heading)}`,
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

function toJavaScriptModule(name, value) {
  return `export const ${name} = ${JSON.stringify(value, null, 2)};\n`;
}

function generateFigmaColorDocs() {
  if (!existsSync(figmaTokenExportPath)) {
    return;
  }

  const figmaExport = readJson(figmaTokenExportPath);
  const { resolveColorValue } = createFigmaResolvers(figmaExport);
  const groups = [];

  function pushCollectionSections(collection, options) {
    if (!collection) {
      return;
    }

    const sectionRoots = options.sectionRoots ?? [];

    for (const section of sectionRoots) {
      const sectionVariables = (collection.variables ?? [])
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
          cssName: `--${options.cssPrefix}-${variable.name.split("/").map(toKebabCase).join("-")}`,
          path: `${collection.name}.${variable.name.replace(/\//g, ".")}`,
          description: variable.description,
          codeSyntax: variable.codeSyntax?.WEB,
          presenter: "Color",
          value: resolveColorValue(variable, collection.defaultModeId, options.defaultModeName)
        }))
      });
    }
  }

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

  pushCollectionSections(semanticCollection, {
    cssPrefix: "figma-semantic",
    defaultModeName: "Value",
    sectionRoots: [
      { root: "bg", title: "Semantic / Background", description: "Background fills and overlays across surface, brand, and feedback states." },
      { root: "text", title: "Semantic / Text", description: "Readable foreground text colors for default, inverse, brand, and feedback usage." },
      { root: "icon", title: "Semantic / Icon", description: "Icon foreground colors aligned with the semantic text and feedback system." },
      { root: "border", title: "Semantic / Border", description: "Border and outline colors for default, brand, inverse, and status surfaces." }
    ]
  });

  const primitiveCollection = (figmaExport.collections ?? []).find((collection) => collection.name === "Primitive");

  pushCollectionSections(primitiveCollection, {
    cssPrefix: "figma-primitive",
    defaultModeName: "Value",
    sectionRoots: [
      { root: "base", title: "Primitive / Base", description: "Raw foundational black and white primitives used as palette anchors." },
      { root: "amber", title: "Primitive / Amber", description: "Raw amber palette ramp from lightest tint to strongest tone." },
      { root: "bright-blue", title: "Primitive / Bright Blue", description: "Raw bright blue palette ramp for informational and accent building blocks." },
      { root: "cobalt-blue", title: "Primitive / Cobalt Blue", description: "Raw cobalt blue palette ramp for saturated brand-adjacent usage." },
      { root: "cool-mint", title: "Primitive / Cool Mint", description: "Raw cool mint palette ramp for fresh green-blue tonal steps." },
      { root: "cream-beige", title: "Primitive / Cream Beige", description: "Raw cream beige palette ramp for warm neutral tonal steps." },
      { root: "crimson-red", title: "Primitive / Crimson Red", description: "Raw crimson red palette ramp for strong red tonal steps." },
      { root: "drive-pink", title: "Primitive / Drive Pink", description: "Raw drive pink palette ramp for vivid magenta tonal steps." },
      { root: "electric-violet", title: "Primitive / Electric Violet", description: "Raw electric violet palette ramp for vibrant purple tonal steps." },
      { root: "green", title: "Primitive / Green", description: "Raw green palette ramp for success and natural tonal steps." },
      { root: "lotus-blue", title: "Primitive / Lotus Blue", description: "Raw lotus blue palette ramp for softer blue tonal steps." },
      { root: "mint-green", title: "Primitive / Mint Green", description: "Raw mint green palette ramp for light green tonal steps." },
      { root: "neutral", title: "Primitive / Neutral", description: "Raw neutral grayscale palette ramp for non-brand tonal steps." },
      { root: "orange", title: "Primitive / Orange", description: "Raw orange palette ramp for warning and warm accent tonal steps." },
      { root: "pop-purple", title: "Primitive / Pop Purple", description: "Raw pop purple palette ramp for expressive purple tonal steps." },
      { root: "red", title: "Primitive / Red", description: "Raw red palette ramp for danger and alert tonal steps." },
      { root: "sky-surge", title: "Primitive / Sky Surge", description: "Raw sky surge palette ramp for energetic blue tonal steps." },
      { root: "slate", title: "Primitive / Slate", description: "Raw slate palette ramp for cool neutral tonal steps." },
      { root: "teal", title: "Primitive / Teal", description: "Raw teal palette ramp for blue-green tonal steps." }
    ]
  });

  const utilityCollection = (figmaExport.collections ?? []).find((collection) => collection.name === "Utility");

  pushCollectionSections(utilityCollection, {
    cssPrefix: "figma-utility",
    defaultModeName: "Mode 1",
    sectionRoots: [
      { root: "alpha", title: "Utility / Alpha", description: "Alpha overlays for black and white transparency steps used across surfaces and states." },
      { root: "service", title: "Utility / Service", description: "Service-specific utility ramps for buy, sell, insurance, loan, and related service surfaces." }
    ]
  });

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
    "Complete structural color documentation generated from the full Figma token export. This page covers theme, semantic, primitive, and utility color tokens.",
    ""
  ];

  for (const group of groups) {
    mdxLines.push(...createDocSection(group.category, group.heading, group.description));
  }

  writeFileSync(figmaDocsOutputPath, mdxLines.join("\n"));
}

function buildBrandTypographyPreviews(baseTokens) {
  const brandFiles = [
    ["Cars24", path.join(repoRoot, "packages/tokens/tokens/brands/cars24.json")],
    ["Team BHP", path.join(repoRoot, "packages/tokens/tokens/brands/teambhp.json")],
    ["CarInfo", path.join(repoRoot, "packages/tokens/tokens/brands/carinfo.json")],
    ["Vehicle Info", path.join(repoRoot, "packages/tokens/tokens/brands/vehicleinfo.json")]
  ];

  return brandFiles.map(([name, filePath]) => {
    const brandTokens = readJson(filePath);
    const fontFamily = brandTokens.typography?.fontFamily?.sans ?? baseTokens.typography.fontFamily.sans;
    const baseWeights = baseTokens.typography.fontWeight;
    const overrideWeights = brandTokens.typography?.fontWeight ?? {};

    return {
      name,
      fontFamily,
      fontWeights: {
        regular: overrideWeights.regular ?? baseWeights.regular,
        medium: overrideWeights.medium ?? baseWeights.medium,
        semibold: overrideWeights.semibold ?? baseWeights.semibold,
        bold: overrideWeights.bold ?? baseWeights.bold
      }
    };
  });
}

function buildTypographyStyleSections(typographyCollection) {
  const variableMap = new Map((typographyCollection.variables ?? []).map((variable) => [variable.name, variable]));
  const groups = new Map();
  const completeStyles = [];

  for (const variable of typographyCollection.variables ?? []) {
    if (!variable.name.startsWith("size/")) {
      continue;
    }

    const styleKey = variable.name.slice("size/".length);
    const lineHeightVariable = variableMap.get(`line-height/${styleKey}`);
    const letterSpacingVariable = variableMap.get(`letter-spacing/${styleKey}`);
    const [sectionKey, ...styleSegments] = styleKey.split("/");

    if (!sectionKey || styleSegments.length === 0 || !lineHeightVariable || !letterSpacingVariable) {
      continue;
    }

    const label = styleSegments.map(toTitleCase).join(" / ");
    const description = variable.description || lineHeightVariable.description || letterSpacingVariable.description || "";
    const styleEntry = {
      key: styleKey,
      label,
      description,
      fontSize: Number(variable.valuesByMode?.[typographyCollection.defaultModeId] ?? 0),
      lineHeight: Number(lineHeightVariable.valuesByMode?.[typographyCollection.defaultModeId] ?? 0),
      letterSpacing: Number(letterSpacingVariable.valuesByMode?.[typographyCollection.defaultModeId] ?? 0),
      sizeToken: variable.codeSyntax?.WEB ?? "",
      lineHeightToken: lineHeightVariable.codeSyntax?.WEB ?? "",
      letterSpacingToken: letterSpacingVariable.codeSyntax?.WEB ?? ""
    };

    completeStyles.push(styleEntry);

    const sectionEntries = groups.get(sectionKey) ?? [];
    sectionEntries.push(styleEntry);
    groups.set(sectionKey, sectionEntries);
  }

  const sectionMetadata = {
    title: "Display styles for high-emphasis values such as numbers, amounts, and standout labels.",
    headline: "Headline sizes for primary content hierarchy and structured section titles.",
    paragraph: "Paragraph styles for readable body copy and longer-form descriptive content.",
    utility: "Utility labels for short supporting text, metadata, and compact interface labels.",
    caption: "Caption styles for secondary text that sits above or around primary information."
  };

  const orderedSectionKeys = ["title", "headline", "paragraph", "utility", "caption"];
  const sections = orderedSectionKeys
    .filter((key) => groups.has(key))
    .map((key) => ({
      key,
      title: toTitleCase(key),
      description: sectionMetadata[key],
      styles: groups.get(key).sort((left, right) => compareNaturally(left.key, right.key))
    }));

  const extraLetterSpacingTokens = (typographyCollection.variables ?? [])
    .filter((variable) => variable.name.startsWith("letter-spacing/"))
    .filter((variable) => !completeStyles.some((style) => `letter-spacing/${style.key}` === variable.name))
    .sort((left, right) => compareNaturally(left.name, right.name))
    .map((variable) => ({
      name: variable.name.replace("letter-spacing/", ""),
      value: Number(variable.valuesByMode?.[typographyCollection.defaultModeId] ?? 0),
      codeSyntax: variable.codeSyntax?.WEB ?? "",
      description: variable.description ?? ""
    }));

  return { sections, extraLetterSpacingTokens };
}

function generateTypographyDocs() {
  if (!existsSync(figmaTokenExportPath)) {
    return;
  }

  const baseTokens = readJson(baseTokensPath);
  const figmaExport = readJson(figmaTokenExportPath);
  const typographyCollection = (figmaExport.collections ?? []).find((collection) => collection.name === "Typography");

  if (!typographyCollection) {
    return;
  }

  const brandPreviews = buildBrandTypographyPreviews(baseTokens);
  const { sections, extraLetterSpacingTokens } = buildTypographyStyleSections(typographyCollection);

  const typographyGroups = [
    {
      category: "Typography / Size",
      heading: "Typography / Size",
      description: "Named font-size tokens from the shared typography system.",
      presenter: "FontSize",
      prefix: "size/"
    },
    {
      category: "Typography / Line Height",
      heading: "Typography / Line Height",
      description: "Named line-height tokens paired with the typography system.",
      presenter: "LineHeight",
      prefix: "line-height/"
    },
    {
      category: "Typography / Letter Spacing",
      heading: "Typography / Letter Spacing",
      description: "Tracking tokens used by the typography system, including caption extensions.",
      presenter: "LetterSpacing",
      prefix: "letter-spacing/"
    }
  ].map((group) => ({
    ...group,
    tokens: (typographyCollection.variables ?? [])
      .filter((variable) => variable.name.startsWith(group.prefix))
      .sort((left, right) => compareNaturally(left.name, right.name))
      .map((variable) => ({
        cssName: extractCssVariableName(
          variable.codeSyntax?.WEB,
          `--typography-${variable.name.split("/").map(toKebabCase).join("-")}`
        ),
        path: `Typography.${variable.name.replace(/\//g, ".")}`,
        description: variable.description,
        codeSyntax: variable.codeSyntax?.WEB,
        presenter: group.presenter,
        value: serializeTypographyValue(variable.valuesByMode?.[typographyCollection.defaultModeId], group.presenter)
      }))
  }));

  writeFileSync(
    figmaTypographyCssOutputPath,
    buildCssFile(typographyGroups, "Generated from apps/storybook/token-data/Tokens-variables-full-x.json")
  );

  const typeScale = [...new Set(sections.flatMap((section) => section.styles.map((style) => style.fontSize)))]
    .sort((left, right) => left - right);

  const typographyDataSource = [
    `export const typographyBrandPreviews = ${JSON.stringify(brandPreviews, null, 2)};`,
    "",
    `export const typographyStyleSections = ${JSON.stringify(sections, null, 2)};`,
    "",
    `export const typographyExtraLetterSpacingTokens = ${JSON.stringify(extraLetterSpacingTokens, null, 2)};`,
    ""
  ].join("\n");

  writeFileSync(figmaTypographyDataOutputPath, typographyDataSource);

  const defaultFontFamily = brandPreviews[0]?.fontFamily ?? baseTokens.typography.fontFamily.sans;
  const mdxLines = [
    `import { Meta, Typeset } from "@storybook/addon-docs/blocks";`,
    `import { DesignTokenDocBlock } from "storybook-design-token";`,
    `import { TypographyBrandPreviewGrid, TypographyStyleGallery, TypographyTrackingTable } from "../storybook-typography";`,
    `import { typographyBrandPreviews, typographyExtraLetterSpacingTokens, typographyStyleSections } from "./typographyTokenData";`,
    "",
    `<Meta title="Foundations/Typography Tokens" />`,
    "",
    "# Typography Tokens",
    "",
    "Structured typography documentation generated from the repo token files and the shared typography export. This page combines brand font previews, named text styles, and the raw token catalog.",
    "",
    "## Brand Font Families",
    "",
    "<TypographyBrandPreviewGrid brands={typographyBrandPreviews} />",
    "",
    "## Core Type Scale",
    "",
    "Base size progression preview using the current Cars24 type family.",
    "",
    `<Typeset fontFamily="${escapeMdxText(defaultFontFamily)}" fontSizes={[${typeScale.join(", ")}]} sampleText="Typography scale preview" />`,
    "",
    "## Weight Scale",
    "",
    "<Typeset fontFamily={typographyBrandPreviews[0].fontFamily} fontSizes={[16, 20, 24]} fontWeight={400} sampleText=\"Regular / 400\" />",
    "",
    "<Typeset fontFamily={typographyBrandPreviews[0].fontFamily} fontSizes={[16, 20, 24]} fontWeight={500} sampleText=\"Medium / 500\" />",
    "",
    "<Typeset fontFamily={typographyBrandPreviews[0].fontFamily} fontSizes={[16, 20, 24]} fontWeight={600} sampleText=\"Semibold / 600\" />",
    "",
    "<Typeset fontFamily={typographyBrandPreviews[0].fontFamily} fontSizes={[16, 20, 24]} fontWeight={700} sampleText=\"Bold / 700\" />",
    "",
    "## Named Text Styles",
    "",
    "<TypographyStyleGallery sections={typographyStyleSections} fontFamily={typographyBrandPreviews[0].fontFamily} />",
    ""
  ];

  if (extraLetterSpacingTokens.length > 0) {
    mdxLines.push("## Tracking Modifiers", "");
    mdxLines.push(
      "Additional letter-spacing tokens that extend named styles, such as the caption extended variants.",
      "",
      "<TypographyTrackingTable tokens={typographyExtraLetterSpacingTokens} />",
      ""
    );
  }

  mdxLines.push("## Raw Token Catalog", "");

  for (const group of typographyGroups) {
    mdxLines.push(...createTypographyDocSection(group.category, group.heading, group.description));
  }

  writeFileSync(figmaTypographyDocsOutputPath, mdxLines.join("\n"));
}

function generateGapDocs() {
  if (!existsSync(figmaTokenExportPath)) {
    return;
  }

  const figmaExport = readJson(figmaTokenExportPath);
  const miscCollection = (figmaExport.collections ?? []).find((collection) => collection.name === "Misc");

  if (!miscCollection) {
    return;
  }

  const gapTokens = (miscCollection.variables ?? [])
    .filter((variable) => variable.name.startsWith("gap/"))
    .sort((left, right) => compareNaturally(left.name, right.name))
    .map((variable) => {
      const rawValue = Number(variable.valuesByMode?.[miscCollection.defaultModeId] ?? 0);

      return {
        name: variable.name,
        label: variable.name.replace("gap/", ""),
        value: rawValue,
        codeSyntax: variable.codeSyntax?.WEB ?? "",
        description: variable.description ?? ""
      };
    });

  const gapGroups = [
    {
      category: "Gap",
      heading: "Gap",
      description: "Shared gap tokens for layout spacing between items, stacks, and grouped controls.",
      tokens: gapTokens.map((token) => ({
        cssName: extractCssVariableName(token.codeSyntax, `--misc-${token.name.split("/").map(toKebabCase).join("-")}`),
        path: `Gap.${token.name.replace(/\//g, ".")}`,
        description: token.description,
        codeSyntax: token.codeSyntax,
        presenter: "Spacing",
        value: serializeTypographyValue(token.value, "Spacing")
      }))
    }
  ];

  writeFileSync(
    figmaGapCssOutputPath,
    buildCssFile(gapGroups, "Generated from apps/storybook/token-data/Tokens-variables-full-x.json")
  );

  writeFileSync(figmaGapDataOutputPath, toJavaScriptModule("gapTokens", gapTokens));

  const mdxLines = [
    `import { Meta } from "@storybook/addon-docs/blocks";`,
    `import { DesignTokenDocBlock } from "storybook-design-token";`,
    `import { GapScalePreview } from "../storybook-layout-tokens";`,
    `import { gapTokens } from "./gapTokenData";`,
    "",
    `<Meta title="Foundations/Gap Tokens" />`,
    "",
    "# Gap Tokens",
    "",
    "Structured gap documentation generated from the shared layout token export. This page previews the spacing rhythm and exposes the raw gap token catalog used for layout separation.",
    "",
    "## Gap Scale Preview",
    "",
    "<GapScalePreview tokens={gapTokens} />",
    "",
    "## Raw Token Catalog",
    "",
    ...createTypographyDocSection("Gap", "Gap", "Shared gap tokens for layout spacing between items, stacks, and grouped controls.")
  ];

  writeFileSync(figmaGapDocsOutputPath, mdxLines.join("\n"));
}

function flattenRadiusTokens(radiusTree, prefix = ["radius"]) {
  const entries = [];

  for (const [key, value] of Object.entries(radiusTree ?? {})) {
    const nextPath = [...prefix, key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      entries.push(...flattenRadiusTokens(value, nextPath));
      continue;
    }

    entries.push({
      path: nextPath,
      key: nextPath.slice(1).join("."),
      label: nextPath.slice(1).map(toTitleCase).join(" / "),
      value: Number(value ?? 0),
      codeSyntax: `var(--${nextPath.map(toKebabCase).join("-")})`
    });
  }

  return entries.sort((left, right) => compareNaturally(left.key, right.key));
}

function buildRadiusBrandPreviews(baseTokens) {
  const brandFiles = [
    ["Cars24", path.join(repoRoot, "packages/tokens/tokens/brands/cars24.json")],
    ["Team BHP", path.join(repoRoot, "packages/tokens/tokens/brands/teambhp.json")],
    ["CarInfo", path.join(repoRoot, "packages/tokens/tokens/brands/carinfo.json")],
    ["Vehicle Info", path.join(repoRoot, "packages/tokens/tokens/brands/vehicleinfo.json")]
  ];

  return brandFiles.map(([name, filePath]) => {
    const brandTokens = readJson(filePath);
    const mergedRadius = {
      ...baseTokens.radius,
      ...brandTokens.radius,
      alt: {
        ...(baseTokens.radius.alt ?? {}),
        ...(brandTokens.radius?.alt ?? {})
      }
    };

    return {
      name,
      tokens: flattenRadiusTokens(mergedRadius).map((token) => ({
        key: token.key,
        label: token.label,
        value: token.value
      }))
    };
  });
}

function generateRadiusDocs() {
  const baseTokens = readJson(baseTokensPath);
  const radiusTokens = flattenRadiusTokens(baseTokens.radius);
  const radiusBrandPreviews = buildRadiusBrandPreviews(baseTokens);

  writeFileSync(radiusDataOutputPath, [
    toJavaScriptModule("radiusTokens", radiusTokens),
    "",
    toJavaScriptModule("radiusBrandPreviews", radiusBrandPreviews)
  ].join("\n"));

  const mdxLines = [
    `import { Meta } from "@storybook/addon-docs/blocks";`,
    `import { DesignTokenDocBlock } from "storybook-design-token";`,
    `import { RadiusPreviewGrid, RadiusBrandPreviewGrid } from "../storybook-layout-tokens";`,
    `import { radiusBrandPreviews, radiusTokens } from "./radiusTokenData";`,
    "",
    `<Meta title="Foundations/Radius Tokens" />`,
    "",
    "# Radius Tokens",
    "",
    "Structured radius documentation generated from the repo token files. This page previews the base radius system and shows how brand overrides adjust those values.",
    "",
    "## Base Radius Scale",
    "",
    "<RadiusPreviewGrid tokens={radiusTokens} />",
    "",
    "## Brand Radius Overrides",
    "",
    "<RadiusBrandPreviewGrid brands={radiusBrandPreviews} />",
    "",
    "## Raw Token Catalog",
    "",
    ...createTypographyDocSection("Radius", "Radius", "Base radius tokens covering standard corners, pill shapes, and alternate rounded geometry.")
  ];

  writeFileSync(radiusDocsOutputPath, mdxLines.join("\n"));
}

mkdirSync(generatedDir, { recursive: true });

generateBaseTokenCss();
generateFigmaColorDocs();
generateTypographyDocs();
generateGapDocs();
generateRadiusDocs();
