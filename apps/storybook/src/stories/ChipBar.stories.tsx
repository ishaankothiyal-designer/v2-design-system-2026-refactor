import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { ChipBar, type ChipBarProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage, StoryPreviewSurface } from "../storybook-shell";

const CHIP_BAR_FIGMA_URL =
  "https://www.figma.com/design/skMLeeIF8mbzAT265CI8nP/-TEST--Design-Language-System--DLS-v2.0-2026-?node-id=24352-416&t=TWTKngE1gik3vXtF-11";

type ChipBarStoryArgs = ChipBarProps;

function Preview({
  brand,
  showFilterChip,
  showRow2
}: {
  brand: DisplayBrandId;
  showFilterChip: boolean;
  showRow2: boolean;
}) {
  return (
    <StoryPreviewSurface>
      <ChipBar brand={brand} showFilterChip={showFilterChip} showRow2={showRow2} />
    </StoryPreviewSurface>
  );
}

function CombinationCard({
  brand,
  title,
  subtitle,
  showFilterChip,
  showRow2
}: {
  brand: DisplayBrandId;
  title: string;
  subtitle: string;
  showFilterChip: boolean;
  showRow2: boolean;
}) {
  return (
    <StoryCard style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <StoryHeading brand={brand} size="md">
          {title}
        </StoryHeading>
        <StoryCopy brand={brand} size="sm">
          {subtitle}
        </StoryCopy>
      </div>
      <Preview brand={brand} showFilterChip={showFilterChip} showRow2={showRow2} />
    </StoryCard>
  );
}

function VariantsStory({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <StoryHeading brand={brand} size="xl">
            Chip Bar
          </StoryHeading>
          <StoryCopy brand={brand} size="md">
            Matrix covering the visible Figma component properties: the optional filter trigger and the optional second row.
          </StoryCopy>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
          }}
        >
          <CombinationCard
            brand={brand}
            showFilterChip
            showRow2
            subtitle="Matches the default Figma component with the filter trigger and both clipped chip rows."
            title="Default"
          />
          <CombinationCard
            brand={brand}
            showFilterChip
            showRow2={false}
            subtitle="Retains the filter trigger while collapsing to the first chip row only."
            title="Single Row"
          />
          <CombinationCard
            brand={brand}
            showFilterChip={false}
            showRow2
            subtitle="Shows the two-row layout without the leading filter trigger."
            title="No Filter Chip"
          />
          <CombinationCard
            brand={brand}
            showFilterChip={false}
            showRow2={false}
            subtitle="Smallest visible configuration using only the first row of standard chips."
            title="Minimal"
          />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const meta: Meta<ChipBarStoryArgs> = {
  title: "Components/Chip Bar",
  component: ChipBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(CHIP_BAR_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    showFilterChip: true,
    showRow2: true
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    filterChip: {
      control: false
    },
    firstRowItems: {
      control: false
    },
    secondRowItems: {
      control: false
    }
  }
};

export default meta;

type Story = StoryObj<ChipBarStoryArgs>;

export const Playground: Story = {};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantsStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
