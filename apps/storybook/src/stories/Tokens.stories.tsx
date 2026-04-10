import type { Meta, StoryObj } from "@storybook/react";
import { coreTokenCatalog, deepMergeTokenTrees, getBrandTokenSet } from "@geist/tokens";
import { StoryBadge, StoryCard, StoryPage } from "../storybook-shell";

const brands = ["core", "acme"] as const;

function resolveBrand(brandId: (typeof brands)[number]) {
  return deepMergeTokenTrees(coreTokenCatalog, getBrandTokenSet(brandId).tokens);
}

function Tokens() {
  const core = resolveBrand("core") as typeof coreTokenCatalog;
  const acme = resolveBrand("acme") as typeof coreTokenCatalog;

  const collections = [
    {
      name: "Color",
      summary: "Semantic color tokens for brand, surface, text, border, and status use cases.",
      tokens: [
        ["color.surface.canvas", String(core.color.surface.canvas)],
        ["color.text.primary", String(core.color.text.primary)],
        ["color.status.success", String(core.color.status.success)],
        ["color.brand.primary.600", String(core.color.brand.primary["600"])]
      ]
    },
    {
      name: "Typography",
      summary: "Shared typography scale for font family, size, line height, and weight.",
      tokens: [
        ["typography.fontFamily.sans", String(core.typography.fontFamily.sans)],
        ["typography.fontSize.md", String(core.typography.fontSize.md)],
        ["typography.lineHeight.md", String(core.typography.lineHeight.md)],
        ["typography.fontWeight.semibold", String(core.typography.fontWeight.semibold)]
      ]
    },
    {
      name: "Spacing",
      summary: "Simple spacing scale in pixels for layout and component rhythm.",
      tokens: [
        ["spacing.1", String(core.spacing["1"])],
        ["spacing.4", String(core.spacing["4"])],
        ["spacing.12", String(core.spacing["12"])]
      ]
    },
    {
      name: "Radius",
      summary: "Corner radius scale that supports subtle, medium, large, and pill shapes.",
      tokens: [
        ["radius.sm", String(core.radius.sm)],
        ["radius.md", String(core.radius.md)],
        ["radius.pill", String(core.radius.pill)]
      ]
    },
    {
      name: "Icon",
      summary: "Default icon style, stroke width, and supported sizes.",
      tokens: [
        ["icon.style", String(core.icon.style)],
        ["icon.strokeWidth", String(core.icon.strokeWidth)],
        ["icon.size.md", String(core.icon.size.md)]
      ]
    }
  ] as const;

  const brandRows = [
    ["core", "Cars24", "Team BHP", String(core.color.brand.primary["600"]), String(core.typography.fontFamily.sans)],
    ["acme", "CarInfo", "Vehicle Info", String(acme.color.brand.primary["600"]), String(acme.typography.fontFamily.sans)]
  ] as const;

  return (
    <StoryPage fullscreen>
      <header style={{ display: "grid", gap: 14, maxWidth: 840 }}>
        <StoryBadge>Foundations / Tokens</StoryBadge>
        <h1 style={{ margin: 0, fontSize: 44, lineHeight: "52px" }}>Token Summary</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: core.color.text.secondary }}>
          This page mirrors the token documentation in `packages/tokens/README.md` and reflects the live token catalog
          used by web, native, and Figma workflows.
        </p>
      </header>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>What lives here</strong>
            <p style={{ margin: 0, color: core.color.text.secondary, lineHeight: "24px" }}>
              The token tree is intentionally small and stable. The base catalog defines the full shape and brand
              overrides only replace values that differ.
            </p>
            <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, color: core.color.text.primary }}>
              <li>Color for semantic brand and UI surfaces</li>
              <li>Typography for shared font and text rhythm</li>
              <li>Spacing for layout and component scale</li>
              <li>Radius for corner treatment</li>
              <li>Icon for size and stroke defaults</li>
            </ul>
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Brand model</strong>
            <p style={{ margin: 0, color: core.color.text.secondary, lineHeight: "24px" }}>
              The repo currently supports `core` and `acme`. Figma brand names map to repo brand IDs through
              `FIGMA_BRAND_TO_REPO_BRAND`.
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {brandRows.map(([brandId, figmaA, figmaB, colorValue, fontFamily]) => (
                <div
                  key={brandId}
                  style={{
                    display: "grid",
                    gap: 8,
                    padding: 12,
                    borderRadius: 12,
                    background: String(core.color.surface.subtle),
                    border: `1px solid ${String(core.color.border.default)}`
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <strong>{brandId}</strong>
                    <span style={{ color: core.color.text.secondary, fontSize: 12 }}>{figmaA} / {figmaB}</span>
                  </div>
                  <div style={{ fontSize: 13, color: core.color.text.secondary }}>Primary 600: {colorValue}</div>
                  <div style={{ fontSize: 13, color: core.color.text.secondary }}>Sans family: {fontFamily}</div>
                </div>
              ))}
            </div>
          </div>
        </StoryCard>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {collections.map((collection) => (
          <StoryCard key={collection.name}>
            <div style={{ display: "grid", gap: 12 }}>
              <strong>{collection.name}</strong>
              <p style={{ margin: 0, color: core.color.text.secondary, lineHeight: "24px" }}>{collection.summary}</p>
              <div style={{ display: "grid", gap: 8 }}>
                {collection.tokens.map(([token, value]) => (
                  <div
                    key={token}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "#FFFFFF",
                      border: `1px solid ${String(core.color.border.default)}`
                    }}
                  >
                    <span style={{ fontSize: 13, color: core.color.text.secondary }}>{token}</span>
                    <strong style={{ fontSize: 13 }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </StoryCard>
        ))}
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>How to use</strong>
            <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, color: core.color.text.primary }}>
              <li>Use semantic tokens in components instead of hardcoded values.</li>
              <li>Merge brand overrides onto the base catalog rather than replacing it.</li>
              <li>Use the helper functions in `@geist/tokens` for lookups and platform exports.</li>
            </ul>
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Rules to follow</strong>
            <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, color: core.color.text.primary }}>
              <li>Keep the token tree stable across web, native, Storybook, and Figma.</li>
              <li>Add new base tokens before introducing brand-specific overrides.</li>
              <li>Validate token changes with the token package scripts before publishing.</li>
            </ul>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const meta: Meta<typeof Tokens> = {
  title: "Foundations/Tokens",
  component: Tokens,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof Tokens>;

export const Summary: Story = {};
