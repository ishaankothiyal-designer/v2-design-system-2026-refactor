import type { Meta, StoryObj } from "@storybook/react";
import { coreTokenCatalog, getBrandTokenSet, deepMergeTokenTrees } from "@turbo/tokens";
import { StoryCard, StoryPage } from "../storybook-shell";

const brands = ["Cars24", "Team BHP", "CarInfo", "VehicleInfo"] as const;

function resolveBrand(brandId: (typeof brands)[number]) {
  return deepMergeTokenTrees(coreTokenCatalog, getBrandTokenSet(brandId).tokens);
}

function Foundations() {
  const cars24 = resolveBrand("Cars24") as typeof coreTokenCatalog;
  const teamBhp = resolveBrand("Team BHP") as typeof coreTokenCatalog;
  const carInfo = resolveBrand("CarInfo") as typeof coreTokenCatalog;
  const vehicleInfo = resolveBrand("VehicleInfo") as typeof coreTokenCatalog;

  const colorRows = [
    [
      "Surface / Canvas",
      String(cars24.color.surface.canvas),
      String(teamBhp.color.surface.canvas),
      String(carInfo.color.surface.canvas),
      String(vehicleInfo.color.surface.canvas)
    ],
    [
      "Text / Primary",
      String(cars24.color.text.primary),
      String(teamBhp.color.text.primary),
      String(carInfo.color.text.primary),
      String(vehicleInfo.color.text.primary)
    ],
    [
      "Brand / Primary 600",
      String(cars24.color.brand.primary["600"]),
      String(teamBhp.color.brand.primary["600"]),
      String(carInfo.color.brand.primary["600"]),
      String(vehicleInfo.color.brand.primary["600"])
    ],
    [
      "Border / Default",
      String(cars24.color.border.default),
      String(teamBhp.color.border.default),
      String(carInfo.color.border.default),
      String(vehicleInfo.color.border.default)
    ]
  ] as const;

  const typeRows = [
    ["Font family", String(cars24.typography.fontFamily.sans)],
    ["Font size md", `${cars24.typography.fontSize.md}px`],
    ["Line height md", `${cars24.typography.lineHeight.md}px`],
    ["Semibold", String(cars24.typography.fontWeight.semibold)]
  ] as const;

  return (
    <StoryPage>
      <header style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Foundations</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: cars24.color.text.secondary }}>
          A compact reference for the tokens that drive the fresh Storybook surface.
        </p>
      </header>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 16 }}>
            <strong>Brand colors</strong>
            {colorRows.map(([label, cars24Value, teamBhpValue, carInfoValue, vehicleInfoValue]) => (
              <div key={label} style={{ display: "grid", gap: 10 }}>
                <div style={{ fontSize: 13, color: cars24.color.text.secondary }}>{label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                  <Swatch label="Cars24" value={cars24Value} />
                  <Swatch label="Team BHP" value={teamBhpValue} />
                  <Swatch label="CarInfo" value={carInfoValue} />
                  <Swatch label="VehicleInfo" value={vehicleInfoValue} />
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
                  <div style={{ fontSize: 13, color: cars24.color.text.secondary }}>{label}</div>
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
