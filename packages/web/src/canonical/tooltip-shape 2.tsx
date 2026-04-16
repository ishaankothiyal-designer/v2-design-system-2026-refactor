import type { CSSProperties } from "react";

export type TooltipStemSide = "top" | "bottom" | "left" | "right";

export interface TooltipStemProps {
  background: string;
  depth: number;
  side: TooltipStemSide;
  style?: CSSProperties;
  width: number;
}

/**
 * Shared curved tooltip stem geometry used by tooltip-like callouts across canonical components.
 */
export function TooltipStem({
  background,
  depth,
  side,
  style,
  width
}: TooltipStemProps) {
  const horizontalStemWidth = width;
  const horizontalStemDepth = depth;
  const verticalStemWidth = depth;
  const verticalStemDepth = width;
  const topCurveInset = horizontalStemWidth * 0.34;
  const topCurveDepth = horizontalStemDepth * 0.58;
  const sideCurveInset = verticalStemWidth * 0.58;
  const sideCurveDepth = verticalStemDepth * 0.34;

  if (side === "top" || side === "bottom") {
    const path =
      side === "bottom"
        ? `M0 0H${horizontalStemWidth}C${(horizontalStemWidth - topCurveInset).toFixed(2)} 0 ${(horizontalStemWidth / 2 + topCurveInset / 2).toFixed(2)} ${topCurveDepth.toFixed(2)} ${(
            horizontalStemWidth / 2
          ).toFixed(2)} ${horizontalStemDepth}C${(horizontalStemWidth / 2 - topCurveInset / 2).toFixed(2)} ${topCurveDepth.toFixed(2)} ${topCurveInset.toFixed(2)} 0 0 0Z`
        : `M${(horizontalStemWidth / 2).toFixed(2)} 0C${(horizontalStemWidth / 2 + topCurveInset / 2).toFixed(2)} ${(horizontalStemDepth - topCurveDepth).toFixed(2)} ${(horizontalStemWidth - topCurveInset).toFixed(2)} ${horizontalStemDepth} ${horizontalStemWidth} ${horizontalStemDepth}H0C${topCurveInset.toFixed(2)} ${horizontalStemDepth} ${(horizontalStemWidth / 2 - topCurveInset / 2).toFixed(2)} ${(horizontalStemDepth - topCurveDepth).toFixed(2)} ${(horizontalStemWidth / 2).toFixed(2)} 0Z`;

    return (
      <svg
        aria-hidden="true"
        height={horizontalStemDepth}
        style={{ display: "block", flex: "0 0 auto", ...style }}
        viewBox={`0 0 ${horizontalStemWidth} ${horizontalStemDepth}`}
        width={horizontalStemWidth}
      >
        <path d={path} fill={background} />
      </svg>
    );
  }

  const path =
    side === "right"
      ? `M0 0V${verticalStemDepth}C0 ${(verticalStemDepth - sideCurveDepth).toFixed(2)} ${sideCurveInset.toFixed(2)} ${(verticalStemDepth / 2 + sideCurveDepth / 2).toFixed(2)} ${verticalStemWidth} ${(verticalStemDepth / 2).toFixed(2)}C${sideCurveInset.toFixed(2)} ${(verticalStemDepth / 2 - sideCurveDepth / 2).toFixed(2)} 0 ${sideCurveDepth.toFixed(2)} 0 0Z`
      : `M${verticalStemWidth} 0V${verticalStemDepth}C${verticalStemWidth} ${(verticalStemDepth - sideCurveDepth).toFixed(2)} ${(verticalStemWidth - sideCurveInset).toFixed(2)} ${(verticalStemDepth / 2 + sideCurveDepth / 2).toFixed(2)} 0 ${(verticalStemDepth / 2).toFixed(2)}C${(verticalStemWidth - sideCurveInset).toFixed(2)} ${(verticalStemDepth / 2 - sideCurveDepth / 2).toFixed(2)} ${verticalStemWidth} ${sideCurveDepth.toFixed(2)} ${verticalStemWidth} 0Z`;

  return (
    <svg
      aria-hidden="true"
      height={verticalStemDepth}
      style={{ display: "block", flex: "0 0 auto", ...style }}
      viewBox={`0 0 ${verticalStemWidth} ${verticalStemDepth}`}
      width={verticalStemWidth}
    >
      <path d={path} fill={background} />
    </svg>
  );
}
