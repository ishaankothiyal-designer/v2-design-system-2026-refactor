import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { StoryWidget, type StoryWidgetProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const STORY_WIDGET_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28319-2532&t=h5zc6W2b6MPFvMVS-11";

function PlaygroundStory(args: StoryWidgetProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <div style={{ width: 360 }}>
          <StoryWidget {...args} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ThemeShowcase({
  brand = "Cars24"
}: {
  brand?: NonNullable<StoryWidgetProps["brand"]>;
}) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={themeGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={activeBrand} size="lg">
                Light
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Default story widget composition with a light surface, section header, large story
                rail, and full-width primary CTA.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <StoryWidget brand={activeBrand} />
            </div>
          </div>
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <StoryHeading brand={activeBrand} size="lg">
                Dark
              </StoryHeading>
              <StoryCopy brand={activeBrand} size="sm">
                Inverse widget variant matching the dark Figma surface while reusing the same section
                header, story rail, and CTA structure.
              </StoryCopy>
            </div>
            <div style={{ width: 360 }}>
              <StoryWidget brand={activeBrand} inverse />
            </div>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const themeGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, max-content))",
  justifyContent: "center"
};

const storyWidgetSourceCode = `<StoryWidget
  brand="Cars24"
  title="Section title"
  subtitle="Section title line 2"
  description="Description goes here upto 2 lines"
  tagLabel="New"
  showTag
  showHeaderAction
  headerActionLabel="View all"
  showCta
  ctaLabel="Label"
/>`;

const meta: Meta<StoryWidgetProps> = {
  title: "Widgets/Story Widget",
  component: StoryWidget,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(STORY_WIDGET_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    inverse: false,
    showHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    headerActionLabel: "View all",
    showCta: true,
    ctaLabel: "Label"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
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
    showCta: {
      control: "boolean"
    },
    ctaLabel: {
      control: "text"
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    },
    ctaLeadingIcon: {
      control: false
    },
    ctaTrailingIcon: {
      control: false
    },
    children: {
      control: false
    },
    onHeaderActionClick: {
      action: "header action click"
    },
    onCtaClick: {
      action: "cta click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<StoryWidgetProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: storyWidgetSourceCode
      }
    }
  }
};

export const Themes: Story = {
  render: ({ brand }) => <ThemeShowcase brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
