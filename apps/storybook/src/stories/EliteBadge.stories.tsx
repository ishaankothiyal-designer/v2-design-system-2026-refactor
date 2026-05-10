import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EliteBadge, type EliteBadgeBrand, type EliteBadgeName, Text } from "@turbo/web";
import { coreTokenCatalog } from "@turbo/tokens";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const ELITE_BADGE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=9270-23869&t=1zgOyFpiLYMyM4XM-11";

const supportedBrands: EliteBadgeBrand[] = ["Cars24"];
const badgeNames: EliteBadgeName[] = ["Elite", "All cars"];

function Surface({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: String(coreTokenCatalog.color.surface.inverse),
        borderRadius: 20,
        display: "flex",
        minHeight: 120,
        padding: 24
      }}
    >
      {children}
    </div>
  );
}

function PlaygroundStory(args: Meta<typeof EliteBadge>["args"]) {
  return (
    <StoryPage>
      <StoryCard>
        <Surface>
          <EliteBadge {...args} />
        </Surface>
      </StoryCard>
    </StoryPage>
  );
}

function VariantsStory() {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 24 }}>
        {supportedBrands.map((brand) => (
          <StoryCard key={brand}>
            <div style={{ display: "grid", gap: 16 }}>
              <Text as="strong" brand="Cars24" size="md">
                {brand}
              </Text>
              <Surface>
                <div style={variantGridStyles}>
                  {badgeNames.map((badgeName) => (
                    <div key={`${brand}-${badgeName}`} style={variantCellStyles}>
                      <Text as="span" brand="Cars24" size="xs" tone="inverse">
                        {badgeName}
                      </Text>
                      <EliteBadge badgeName={badgeName} brand={brand} />
                    </div>
                  ))}
                </div>
              </Surface>
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, max-content))",
  rowGap: 20
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 10,
  justifyItems: "start"
};

const eliteBadgeVariantsSourceCode = `<StoryPage fullscreen>
  <EliteBadge brand="Cars24" badgeName="Elite" />
  <EliteBadge brand="Cars24" badgeName="All cars" />
</StoryPage>`;

const meta = {
  title: "Components/Badges/Elite Badge",
  component: EliteBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(ELITE_BADGE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    badgeName: "Elite"
  },
  argTypes: {
    brand: {
      control: false,
      options: supportedBrands
    },
    badgeName: {
      control: "inline-radio",
      options: badgeNames
    }
  }
} satisfies Meta<typeof EliteBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Variants: Story = {
  render: VariantsStory,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: eliteBadgeVariantsSourceCode
      }
    }
  }
};
