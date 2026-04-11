import type { CSSProperties } from "react";
import { coreTokenCatalog } from "@geist/tokens";

type BrandPreview = {
  name: string;
  fontFamily: string;
  fontWeights: Record<string, number>;
};

type TypographyStyle = {
  key: string;
  label: string;
  description: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  sizeToken: string;
  lineHeightToken: string;
  letterSpacingToken: string;
};

type TypographyStyleSection = {
  key: string;
  title: string;
  description: string;
  styles: TypographyStyle[];
};

type TypographyTrackingToken = {
  name: string;
  value: number;
  codeSyntax: string;
  description: string;
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

const chipRowStyles: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8
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

function formatLetterSpacing(value: number) {
  return value === 0 ? "0" : `${value}em`;
}

export function TypographyBrandPreviewGrid({ brands }: { brands: BrandPreview[] }) {
  return (
    <div style={gridStyles}>
      {brands.map((brand) => (
        <div key={brand.name} style={cardStyles}>
          <div style={{ display: "grid", gap: 4 }}>
            <strong>{brand.name}</strong>
            <span style={{ color: String(coreTokenCatalog.color.text.secondary), fontSize: 13 }}>
              {brand.fontFamily}
            </span>
          </div>
          <div
            style={{
              fontFamily: brand.fontFamily,
              fontSize: 24,
              lineHeight: "32px"
            }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <div style={chipRowStyles}>
            {Object.entries(brand.fontWeights).map(([weightName, weightValue]) => (
              <span key={weightName} style={chipStyles}>
                {weightName}: {weightValue}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TypographyStyleGallery({
  sections,
  fontFamily
}: {
  sections: TypographyStyleSection[];
  fontFamily: string;
}) {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      {sections.map((section) => (
        <section key={section.key} style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h3 style={{ margin: 0 }}>{section.title}</h3>
            <p style={{ margin: 0, color: String(coreTokenCatalog.color.text.secondary), lineHeight: "24px" }}>
              {section.description}
            </p>
          </div>

          <div style={gridStyles}>
            {section.styles.map((style) => (
              <article key={style.key} style={cardStyles}>
                <div style={{ display: "grid", gap: 6 }}>
                  <strong>{style.label}</strong>
                  <span style={{ color: String(coreTokenCatalog.color.text.secondary), fontSize: 13 }}>
                    {style.description}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily,
                    fontSize: style.fontSize,
                    lineHeight: `${style.lineHeight}px`,
                    letterSpacing: formatLetterSpacing(style.letterSpacing),
                    padding: "8px 0",
                    borderTop: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
                    borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}`
                  }}
                >
                  Typography Sample 123
                </div>

                <div style={chipRowStyles}>
                  <span style={chipStyles}>{style.fontSize}px size</span>
                  <span style={chipStyles}>{style.lineHeight}px line height</span>
                  <span style={chipStyles}>{formatLetterSpacing(style.letterSpacing)} tracking</span>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <code style={codeStyles}>{style.sizeToken}</code>
                  <code style={codeStyles}>{style.lineHeightToken}</code>
                  <code style={codeStyles}>{style.letterSpacingToken}</code>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function TypographyTrackingTable({ tokens }: { tokens: TypographyTrackingToken[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th align="left" style={{ padding: "10px 12px", borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}` }}>
              Token
            </th>
            <th align="left" style={{ padding: "10px 12px", borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}` }}>
              Value
            </th>
            <th align="left" style={{ padding: "10px 12px", borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}` }}>
              Web Syntax
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name}>
              <td style={{ padding: "10px 12px", borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}` }}>
                <strong>{token.name}</strong>
                {token.description ? (
                  <div style={{ marginTop: 4, color: String(coreTokenCatalog.color.text.secondary), lineHeight: "18px" }}>
                    {token.description}
                  </div>
                ) : null}
              </td>
              <td style={{ padding: "10px 12px", borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}` }}>
                {formatLetterSpacing(token.value)}
              </td>
              <td style={{ padding: "10px 12px", borderBottom: `1px solid ${String(coreTokenCatalog.color.border.default)}` }}>
                <code>{token.codeSyntax}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
