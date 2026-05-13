import type { CSSProperties } from "react";
import { coreTokenCatalog } from "@turbo/tokens";

type GapToken = {
  name: string;
  label: string;
  value: number;
  codeSyntax: string;
  description: string;
};

type RadiusToken = {
  key: string;
  label: string;
  value: number;
  codeSyntax: string;
};

type RadiusBrandPreview = {
  name: string;
  tokens: Array<{
    key: string;
    label: string;
    value: number;
  }>;
};

type ShadowToken = {
  key: string;
  label: string;
  value: string;
  codeSyntax: string;
};

const gridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
};

const cardStyles: CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 16,
  borderRadius: 16,
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.canvas)
};

const chipStyles: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 8px",
  borderRadius: 999,
  background: String(coreTokenCatalog.color.surface.subtle),
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 11,
  fontWeight: 600,
  lineHeight: "16px"
};

const codeStyles: CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  background: String(coreTokenCatalog.color.surface.subtle),
  color: String(coreTokenCatalog.color.text.primary),
  fontSize: 12,
  lineHeight: "18px",
  overflowX: "auto"
};

function radiusPreviewStyle(value: number): CSSProperties {
  return {
    width: value >= 999 ? 128 : 88,
    height: 88,
    borderRadius: value >= 999 ? 999 : value,
    background: String(coreTokenCatalog.color.surface.subtle),
    border: `1px solid ${String(coreTokenCatalog.color.border.strong)}`
  };
}

export function GapScalePreview({ tokens }: { tokens: GapToken[] }) {
  return (
    <div style={gridStyles}>
      {tokens.map((token) => (
        <article key={token.name} style={cardStyles}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <strong>{token.name}</strong>
            <span style={chipStyles}>{token.value}px</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: token.value,
              alignItems: "center",
              minHeight: 72,
              padding: 12,
              borderRadius: 12,
              background: String(coreTokenCatalog.color.surface.subtle)
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: String(coreTokenCatalog.color.brand.primary[100])
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: String(coreTokenCatalog.color.brand.primary[600])
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: String(coreTokenCatalog.color.brand.secondary[600])
              }}
            />
          </div>

          <code style={codeStyles}>{token.codeSyntax}</code>
        </article>
      ))}
    </div>
  );
}

export function RadiusPreviewGrid({ tokens }: { tokens: RadiusToken[] }) {
  return (
    <div style={gridStyles}>
      {tokens.map((token) => (
        <article key={token.key} style={cardStyles}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <strong>{token.label}</strong>
            <span style={chipStyles}>{token.value}px</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
            <div style={radiusPreviewStyle(token.value)} />
          </div>

          <code style={codeStyles}>{token.codeSyntax}</code>
        </article>
      ))}
    </div>
  );
}

export function RadiusBrandPreviewGrid({ brands }: { brands: RadiusBrandPreview[] }) {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {brands.map((brand) => (
        <section key={brand.name} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 4 }}>
            <h3 style={{ margin: 0 }}>{brand.name}</h3>
            <p style={{ margin: 0, color: String(coreTokenCatalog.color.text.secondary), lineHeight: "24px" }}>
              Brand-specific radius application across the shared radius keys.
            </p>
          </div>

          <div style={gridStyles}>
            {brand.tokens.map((token) => (
              <article key={`${brand.name}-${token.key}`} style={cardStyles}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <strong>{token.label}</strong>
                  <span style={chipStyles}>{token.value}px</span>
                </div>

                <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
                  <div style={radiusPreviewStyle(token.value)} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ShadowPreviewGrid({ tokens }: { tokens: ShadowToken[] }) {
  return (
    <div style={gridStyles}>
      {tokens.map((token) => (
        <article key={token.key} style={cardStyles}>
          <div style={{ display: "grid", gap: 4 }}>
            <strong>{token.label}</strong>
            <span style={chipStyles}>{token.key}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 120,
              padding: 16,
              borderRadius: 16,
              background: String(coreTokenCatalog.color.surface.subtle)
            }}
          >
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: 20,
                background: String(coreTokenCatalog.color.surface.canvas),
                border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
                boxShadow: token.value
              }}
            />
          </div>

          <code style={codeStyles}>{token.codeSyntax}</code>
        </article>
      ))}
    </div>
  );
}
