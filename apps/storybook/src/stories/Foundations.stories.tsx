import type { Meta, StoryObj } from "@storybook/react";
import { coreTokenCatalog, getBrandTokenSet, deepMergeTokenTrees } from "@geist/tokens";
import { StoryCard, StoryPage } from "../storybook-shell";

const brands = ["core", "acme"] as const;

function resolveBrand(brandId: (typeof brands)[number]) {
  return deepMergeTokenTrees(coreTokenCatalog, getBrandTokenSet(brandId).tokens);
}

function Foundations() {
  const core = resolveBrand("core") as typeof coreTokenCatalog;
  const acme = resolveBrand("acme") as typeof coreTokenCatalog;

  const colorRows = [
    ["Surface / Canvas", String(core.color.surface.canvas), String(acme.color.surface.canvas)],
    ["Text / Primary", String(core.color.text.primary), String(acme.color.text.primary)],
    ["Brand / Primary 600", String(core.color.brand.primary["600"]), String(acme.color.brand.primary["600"])],
    ["Border / Default", String(core.color.border.default), String(acme.color.border.default)]
  ] as const;

  const typeRows = [
    ["Font family", String(core.typography.fontFamily.sans)],
    ["Font size md", `${core.typography.fontSize.md}px`],
    ["Line height md", `${core.typography.lineHeight.md}px`],
    ["Semibold", String(core.typography.fontWeight.semibold)]
  ] as const;

  return (
    <StoryPage>
      <header style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Foundations</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: core.color.text.secondary }}>
          A compact reference for the tokens that drive the fresh Storybook surface.
        </p>
      </header>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 16 }}>
            <strong>Brand colors</strong>
            {colorRows.map(([label, coreValue, acmeValue]) => (
              <div key={label} style={{ display: "grid", gap: 10 }}>
                <div style={{ fontSize: 13, color: core.color.text.secondary }}>{label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Swatch label="Core" value={coreValue} />
                  <Swatch label="Acme" value={acmeValue} />
                </div>
              </div>
            ))}
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 16 }}>
            <strong>Typography</strong>
            <div style={{ display: "grid", gap: 12 }}>
              {typeRows.map(([label, value]) => (
                <div key={label} style={{ display: "grid", gap: 4 }}>
                  <div style={{ fontSize: 13, color: core.color.text.secondary }}>{label}</div>
                  <div style={{ fontSize: 18, lineHeight: "24px" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        aria-hidden="true"
        style={{
          height: 44,
          borderRadius: 14,
          border: "1px solid rgba(16, 24, 40, 0.08)",
          background: value
        }}
      />
      <div style={{ display: "grid", gap: 2 }}>
        <strong style={{ fontSize: 13 }}>{label}</strong>
        <span style={{ fontSize: 12, color: coreTokenCatalog.color.text.secondary }}>{value}</span>
      </div>
    </div>
  );
}

const meta: Meta<typeof Foundations> = {
  title: "Foundations/Overview",
  component: Foundations,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof Foundations>;

export const Overview: Story = {};
