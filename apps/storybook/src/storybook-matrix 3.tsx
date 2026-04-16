import type { CSSProperties, ReactNode } from "react";
import { coreTokenCatalog } from "@geist/tokens";

type StoryMatrixTone = "canvas" | "inverse";

function resolveSurface(tone: StoryMatrixTone) {
  return String(tone === "inverse" ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas);
}

const matrixBorderColor = String(coreTokenCatalog.color.border.default);

export function StoryMatrix({
  children,
  columns,
  tone = "canvas"
}: {
  children: ReactNode;
  columns: string;
  tone?: StoryMatrixTone;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        border: `1px dashed ${matrixBorderColor}`,
        borderRadius: 28,
        overflow: "hidden",
        background: resolveSurface(tone)
      }}
    >
      {children}
    </div>
  );
}

export function StoryMatrixSection({
  children,
  style,
  tone = "canvas"
}: {
  children: ReactNode;
  style?: CSSProperties;
  tone?: StoryMatrixTone;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 20,
        padding: 24,
        borderRadius: 24,
        border: `1px solid ${matrixBorderColor}`,
        background: resolveSurface(tone),
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function StoryMatrixCornerCell({
  minHeight = 84,
  tone = "canvas"
}: {
  minHeight?: number;
  tone?: StoryMatrixTone;
}) {
  return (
    <div
      style={{
        minHeight,
        borderBottom: `1px dashed ${matrixBorderColor}`,
        background: resolveSurface(tone)
      }}
    />
  );
}

export function StoryMatrixHeaderCell({
  children,
  minHeight = 84,
  tone = "canvas"
}: {
  children: ReactNode;
  minHeight?: number;
  tone?: StoryMatrixTone;
}) {
  return (
    <div
      style={{
        minHeight,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderLeft: `1px dashed ${matrixBorderColor}`,
        borderBottom: `1px dashed ${matrixBorderColor}`,
        background: resolveSurface(tone)
      }}
    >
      {children}
    </div>
  );
}

export function StoryMatrixRowLabelCell({
  children,
  minHeight = 112,
  tone = "canvas"
}: {
  children: ReactNode;
  minHeight?: number;
  tone?: StoryMatrixTone;
}) {
  return (
    <div
      style={{
        minHeight,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        borderTop: `1px dashed ${matrixBorderColor}`,
        background: resolveSurface(tone)
      }}
    >
      {children}
    </div>
  );
}

export function StoryMatrixValueCell({
  children,
  minHeight = 112,
  tone = "canvas"
}: {
  children: ReactNode;
  minHeight?: number;
  tone?: StoryMatrixTone;
}) {
  return (
    <div
      style={{
        minHeight,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: `1px dashed ${matrixBorderColor}`,
        borderLeft: `1px dashed ${matrixBorderColor}`,
        background: resolveSurface(tone)
      }}
    >
      {children}
    </div>
  );
}
