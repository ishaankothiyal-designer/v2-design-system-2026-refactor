import type { TokenLeaf } from "./types";

export const REM_BASE_PX = 16;

function trimTrailingZeros(value: number) {
  return value.toFixed(4).replace(/\.?0+$/, "");
}

export function pxToRem(value: number) {
  if (value === 0) {
    return "0";
  }

  return `${trimTrailingZeros(value / REM_BASE_PX)}rem`;
}

export function tokenValueToRem(value: TokenLeaf) {
  if (typeof value === "number") {
    return pxToRem(value);
  }

  const trimmed = value.trim();

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return pxToRem(Number(trimmed));
  }

  const pixelMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)px$/i);

  if (pixelMatch) {
    return pxToRem(Number(pixelMatch[1]));
  }

  return trimmed;
}
