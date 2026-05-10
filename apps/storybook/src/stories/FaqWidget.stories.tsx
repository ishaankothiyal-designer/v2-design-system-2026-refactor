import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@turbo/tokens";
import { FaqWidget, type FaqWidgetProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const FAQ_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28513-21360&t=h5zc6W2b6MPFvMVS-11";

function PlaygroundStory(args: FaqWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={{ width: 360 }}>
          <FaqWidget {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function CompositionCard({
  brand = "Cars24",
  title,
  subtitle,
  widgetProps
}: {
  brand?: NonNullable<FaqWidgetProps["brand"]>;
  title: string;
  subtitle: string;
  widgetProps: Partial<FaqWidgetProps>;
}) {
  return (
    <StoryCard style={{ display: "grid", gap: 16, width: "fit-content" }}>
      <div style={{ display: "grid", gap: 6 }}>
        <StoryHeading brand={brand} size="md">
          {title}
        </StoryHeading>
        <StoryCopy brand={brand} size="sm">
          {subtitle}
        </StoryCopy>
      </div>
      <div style={{ width: 360 }}>
        <FaqWidget brand={brand} {...widgetProps} />
      </div>
    </StoryCard>
  );
}

function VariantsShowcase({ brand = "Cars24" }: { brand?: NonNullable<FaqWidgetProps["brand"]> }) {
  return (
    <StoryPage fullscreen>
      <div style={variantGridStyles}>
        <CompositionCard
          brand={brand}
          subtitle="Matches the selected Figma widget composition with the section header, one-row chip bar, and collapsed accordion stack."
          title="Default"
          widgetProps={{}}
        />
        <CompositionCard
          brand={brand}
          subtitle="Removes the optional chip bar while keeping the same FAQ hierarchy and spacing."
          title="Without Tab Slider"
          widgetProps={{ showTabSlider: false }}
        />
        <CompositionCard
          brand={brand}
          subtitle="Adds the optional bottom primary CTA using the approved large vertical button group."
          title="With Bottom Button"
          widgetProps={{ showBottomButton: true }}
        />
        <CompositionCard
          brand={brand}
          subtitle="Smallest visible configuration using only the accordion stack."
          title="Minimal"
          widgetProps={{ showHeader: false, showTabSlider: false }}
        />
      </div>
    </StoryPage>
  );
}

const variantGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, max-content))",
  justifyContent: "center"
};

const faqWidgetSourceCode = `<FaqWidget
  brand="Cars24"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showHeaderAction
  headerActionLabel="View all"
  showTabSlider
/>`;

const meta: Meta<FaqWidgetProps> = {
  title: "Widgets/FAQ Widget",
  component: FaqWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(FAQ_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    showHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    showTabSlider: true,
    showBottomButton: false
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    showHeader: {
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
    showHeaderAction: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    showTabSlider: {
      control: "boolean"
    },
    showBottomButton: {
      control: "boolean"
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    },
    tabItems: {
      control: false
    },
    items: {
      control: false
    },
    primaryAction: {
      control: false
    },
    onHeaderActionClick: {
      action: "header action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<FaqWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: faqWidgetSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand }) => <VariantsShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
