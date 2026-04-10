import type { CSSProperties, ReactNode } from "react";
import { coreTokenCatalog } from "@geist/tokens";

const pageStyles: CSSProperties = {
  minHeight: "100vh",
  padding: 32,
  background: `radial-gradient(circle at top left, rgba(71, 54, 254, 0.12), transparent 30%), linear-gradient(180deg, ${String(coreTokenCatalog.color.surface.subtle)} 0%, ${String(coreTokenCatalog.color.surface.canvas)} 60%, #FFFFFF 100%)`,
  color: String(coreTokenCatalog.color.text.primary),
  fontFamily: String(coreTokenCatalog.typography.fontFamily.sans)
};

const pageInnerStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  maxWidth: 1160,
  margin: "0 auto"
};

const cardStyles: CSSProperties = {
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: Number(coreTokenCatalog.radius.lg),
  background: "#FFFFFF",
  padding: 20,
  boxShadow: "0 8px 28px rgba(16, 24, 40, 0.06)"
};

const badgeStyles: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  gap: 8,
  padding: "6px 12px",
  borderRadius: 999,
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.canvas),
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.04,
  textTransform: "uppercase"
};

export function StoryPage({ children, fullscreen = false }: { children: ReactNode; fullscreen?: boolean }) {
  return (
    <div style={pageStyles}>
      <div style={{ ...pageInnerStyles, ...(fullscreen ? { maxWidth: "none" } : {}) }}>{children}</div>
    </div>
  );
}

export function StoryCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...cardStyles, ...style }}>{children}</div>;
}

export function StoryBadge({ children }: { children: ReactNode }) {
  return <div style={badgeStyles}>{children}</div>;
}
