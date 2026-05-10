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

function parseHexColor(value: string) {
  const normalized = value.trim().replace(/^#/, "");

  if (normalized.length !== 3 && normalized.length !== 6) {
    return null;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return { red, green, blue };
}

function parseRgbColor(value: string) {
  const match = value
    .trim()
    .match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/i);

  if (!match) {
    return null;
  }

  const [, red, green, blue] = match;
  return {
    red: Number(red),
    green: Number(green),
    blue: Number(blue)
  };
}

function parseColor(value: string) {
  return value.startsWith("#") ? parseHexColor(value) : parseRgbColor(value);
}

function toLinearChannel(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function isDarkColor(value: string) {
  const parsed = parseColor(value);

  if (!parsed) {
    return false;
  }

  const luminance =
    0.2126 * toLinearChannel(parsed.red) +
    0.7152 * toLinearChannel(parsed.green) +
    0.0722 * toLinearChannel(parsed.blue);

  return luminance < 0.179;
}

export function getReadableTextColor(background: string, darkText = "#000000", lightText = "#FFFFFF") {
  return isDarkColor(background) ? lightText : darkText;
}

function extractImageUrl(backgroundImage: string) {
  const match = backgroundImage.match(/url\((['"]?)(.*?)\1\)/i);
  return match?.[2] ?? null;
}

function sampleCanvasDarkness(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const { data } = context.getImageData(0, 0, width, height);
  let weightedLuminanceSum = 0;
  let visiblePixelCount = 0;

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] / 255;

    if (alpha <= 0.05) {
      continue;
    }

    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const luminance =
      0.2126 * toLinearChannel(red) +
      0.7152 * toLinearChannel(green) +
      0.0722 * toLinearChannel(blue);

    weightedLuminanceSum += luminance * alpha;
    visiblePixelCount += alpha;
  }

  if (visiblePixelCount === 0) {
    return null;
  }

  return weightedLuminanceSum / visiblePixelCount < 0.179;
}

async function sampleImageSourceIsDark(source: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement("canvas");
  const sampleSize = 24;
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  try {
    context.drawImage(source, 0, 0, width, height, 0, 0, sampleSize, sampleSize);
    return sampleCanvasDarkness(context, sampleSize, sampleSize);
  } catch {
    return null;
  }
}

export async function sampleImageElementIsDark(image: HTMLImageElement) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (!width || !height) {
    return null;
  }

  if (typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {
      // Ignore decode failures and still attempt canvas sampling.
    }
  }

  return sampleImageSourceIsDark(image, width, height);
}

export async function sampleBackgroundImageIsDark(backgroundImage: string) {
  const imageUrl = extractImageUrl(backgroundImage);

  if (!imageUrl) {
    return null;
  }

  return new Promise<boolean | null>((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = async () => {
      resolve(await sampleImageSourceIsDark(image, image.naturalWidth, image.naturalHeight));
    };

    image.onerror = () => resolve(null);
    image.src = imageUrl;
  });
}
