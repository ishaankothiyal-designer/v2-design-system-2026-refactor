import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { Icon, SectionHeader, type SectionHeaderProps } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

function FigmaVariantsStory() {
  return (
    <StoryPage>
      <div style={variantGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <SectionHeader />
        </StoryCard>

        <StoryCard style={{ background: "#0A0A0A", width: "fit-content" }}>
          <SectionHeader inverse />
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <SectionHeader brand="VehicleInfo" />
        </StoryCard>

        <StoryCard style={{ background: "#0A0A0A", width: "fit-content" }}>
          <SectionHeader brand="VehicleInfo" inverse />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function ConfigurationsStory({ brand = "Cars24" }: Pick<SectionHeaderProps, "brand">) {
  return (
    <StoryPage>
      <div style={configGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>With icons</strong>
            <SectionHeader
              brand={brand}
              titleIcon={<Icon name="sparkle-filled" decorative />}
              subtitleIcon={<Icon name="calendar-line" decorative />}
            />
          </div>
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>No subtitle or tag</strong>
            <SectionHeader
              brand={brand}
              subtitle=""
              showTag={false}
              description="Description goes here upto 2 lines"
            />
          </div>
        </StoryCard>

        <StoryCard style={{ background: "#0A0A0A", width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <strong style={{ color: "#F8FAFC" }}>Inverse, no action</strong>
            <SectionHeader brand={brand} inverse showAction={false} />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

const configGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))"
};

const sectionHeaderVariantsSourceCode = `<StoryPage>
  <SectionHeader
    brand="Cars24"
    title="Section title"
    subtitle="Section title line 2"
    description="Description goes here upto 2 lines"
    tagLabel="New"
    showTag
    showAction
    actionLabel="View all"
  />
</StoryPage>`;

const sectionHeaderUiExampleSourceCode = `<SectionHeader
  brand="Cars24"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  showTag={false}
  showAction={false}
/>`;

const meta: Meta<SectionHeaderProps> = {
  title: "Components/Section Header",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    inverse: false,
    title: "Section title",
    subtitle: "Section title line 2",
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
    subtitle: {
      control: "text"
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

export const Variants: StoryObj = {
  render: () => <FigmaVariantsStory />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: sectionHeaderVariantsSourceCode
      }
    }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <ConfigurationsStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: sectionHeaderUiExampleSourceCode
      }
    }
  }
};
