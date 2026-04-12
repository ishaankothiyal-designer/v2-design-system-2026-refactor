import type { CSSProperties, ReactNode } from "react";
import { coreTokenCatalog } from "@geist/tokens";
import { Text, type TextProps } from "@geist/web";

// Storybook page content should inherit the design-system typography by default.
const storySansFontFamily = `var(--typography-font-family-sans, ${String(coreTokenCatalog.typography.fontFamily.sans)}), sans-serif`;

const pageStyles: CSSProperties = {
  minHeight: "auto",
  width: "100%",
  padding: 40,
  boxSizing: "border-box",
  background: "transparent",
  color: String(coreTokenCatalog.color.text.primary),
  fontFamily: storySansFontFamily
};

const pageInnerStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  width: "100%",
  maxWidth: "none",
  margin: 0
};

const cardStyles: CSSProperties = {
  border: "none",
  borderRadius: 0,
  background: "transparent",
  padding: 0,
  boxShadow: "none"
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
  textTransform: "uppercase",
  fontFamily: storySansFontFamily
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

export function StoryHeading({
  as = "strong",
  brand = "Cars24",
  children,
  size = "xl",
  tone = "primary",
  style
}: {
  as?: TextProps["as"];
  brand?: TextProps["brand"];
  children: ReactNode;
  size?: TextProps["size"];
  tone?: TextProps["tone"];
  style?: CSSProperties;
}) {
  return (
    <Text brand={brand} as={as} size={size} tone={tone} style={{ margin: 0, display: "block", ...style }}>
      {children}
    </Text>
  );
}

export function StoryCopy({
  as = "p",
  brand = "Cars24",
  children,
  size = "md",
  tone = "secondary",
  style
}: {
  as?: TextProps["as"];
  brand?: TextProps["brand"];
  children: ReactNode;
  size?: TextProps["size"];
  tone?: TextProps["tone"];
  style?: CSSProperties;
}) {
  return (
    <Text brand={brand} as={as} size={size} tone={tone} style={{ margin: 0, display: "block", ...style }}>
      {children}
    </Text>
  );
}
