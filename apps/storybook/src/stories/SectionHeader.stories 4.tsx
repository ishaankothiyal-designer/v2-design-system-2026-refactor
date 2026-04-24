import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Icon, SectionHeader, Text, type SectionHeaderProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

function HeaderCell({
  brand,
  label,
  tone = "secondary"
}: {
  brand: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function LeftVariantStory({ brand }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage>
      <StoryMatrix columns="160px minmax(0, 520px)">
        <StoryMatrixCornerCell />
        <StoryMatrixHeaderCell>
          <HeaderCell brand={activeBrand} label="Preview" />
        </StoryMatrixHeaderCell>

        <StoryMatrixRowLabelCell minHeight={180}>
          <HeaderCell brand={activeBrand} label="Light" />
        </StoryMatrixRowLabelCell>
        <StoryMatrixValueCell minHeight={180}>
          <div style={{ width: "100%" }}>
            <SectionHeader brand={activeBrand} />
          </div>
        </StoryMatrixValueCell>

        <StoryMatrixRowLabelCell minHeight={180}>
          <HeaderCell brand={activeBrand} label="Inverse" />
        </StoryMatrixRowLabelCell>
        <StoryMatrixValueCell minHeight={180} tone="inverse">
          <div style={{ width: "100%" }}>
            <SectionHeader brand={activeBrand} inverse />
          </div>
        </StoryMatrixValueCell>
      </StoryMatrix>
    </StoryPage>
  );
}

function CenterVariantStory({ brand }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage>
      <StoryMatrix columns="160px minmax(0, 520px)">
        <StoryMatrixCornerCell />
        <StoryMatrixHeaderCell>
          <HeaderCell brand={activeBrand} label="Preview" />
        </StoryMatrixHeaderCell>

        <StoryMatrixRowLabelCell minHeight={180}>
          <HeaderCell brand={activeBrand} label="Light" />
        </StoryMatrixRowLabelCell>
        <StoryMatrixValueCell minHeight={180}>
          <div style={{ width: "100%" }}>
            <SectionHeader
              brand={activeBrand}
              titleIcon={<Icon name="sparkle-filled" decorative />}
              subtitleIcon={<Icon name="calendar-line" decorative />}
            />
          </div>
        </StoryMatrixValueCell>

        <StoryMatrixRowLabelCell minHeight={180}>
          <HeaderCell brand={activeBrand} label="Inverse" />
        </StoryMatrixRowLabelCell>
        <StoryMatrixValueCell minHeight={180} tone="inverse">
          <div style={{ width: "100%" }}>
            <SectionHeader
              brand={activeBrand}
              inverse
              titleIcon={<Icon name="sparkle-filled" decorative />}
              subtitleIcon={<Icon name="calendar-line" decorative />}
            />
          </div>
        </StoryMatrixValueCell>
      </StoryMatrix>
    </StoryPage>
  );
}

const sectionHeaderLeftSourceCode = `<SectionHeader
  brand="Cars24"
  title="Section title"
  showSubtitle
  subtitle="Section title line 2"
  showDescription
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showAction
  actionLabel="View all"
/>`;

const sectionHeaderCenterSourceCode = `<SectionHeader
  brand="VehicleInfo"
  title="Section title"
  showSubtitle
  subtitle="Section title line 2"
  showDescription
  description="Description goes here upto 2 lines"
  titleIcon={<Icon name="sparkle-filled" decorative />}
  subtitleIcon={<Icon name="calendar-line" decorative />}
/>`;

const SECTION_HEADER_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=17055-8619&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<SectionHeaderProps> = {
  title: "Components/Section Header",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SECTION_HEADER_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    inverse: false,
    title: "Section title",
    showSubtitle: true,
    subtitle: "Section title line 2",
    showDescription: true,
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showAction: true,
    actionLabel: "View all"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
    },
    title: {
      control: "text"
    },
    showSubtitle: {
      control: "boolean"
    },
    subtitle: {
      control: "text"
    },
    showDescription: {
      control: "boolean"
    },
    description: {
      control: "text"
    },
    tagLabel: {
      control: "text"
    },
    showTag: {
      control: "boolean"
    },
    showAction: {
      control: "boolean"
    },
    actionLabel: {
      control: "text"
    },
    onActionClick: {
      action: "action click"
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    }
  },
  render: (args) => <SectionHeader {...args} />
};

export default meta;

type Story = StoryObj<SectionHeaderProps>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Left: Story = {
  render: ({ brand = "Cars24" }) => <LeftVariantStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: sectionHeaderLeftSourceCode
      }
    }
  }
};

export const Center: Story = {
  render: ({ brand = "Cars24" }) => <CenterVariantStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: sectionHeaderCenterSourceCode
      }
    }
  }
};
