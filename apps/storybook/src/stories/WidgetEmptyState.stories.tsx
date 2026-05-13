import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  Text,
  WidgetEmptyState,
  WidgetEmptyStateImageSlot,
  type ButtonGroupButtonAction,
  type WidgetEmptyStateProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type WidgetEmptyStateStoryArgs = WidgetEmptyStateProps & {
  primaryLabel: string;
  secondaryLabel: string;
  showSecondaryAction: boolean;
};

const WIDGET_EMPTY_STATE_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28426-1955&t=hFO1h296qgJvQhe9-11";

const optionGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

function makeButtonAction(
  brand: DisplayBrandId,
  label: string,
  styleVariant: NonNullable<ButtonGroupButtonAction["styleVariant"]>
) {
  return {
    label,
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    styleVariant,
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function StoryLabel({
  brand,
  children
}: {
  brand: DisplayBrandId;
  children: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {children}
    </Text>
  );
}

function PlaygroundStory({
  brand = "Cars24",
  primaryAction: _primaryAction,
  primaryLabel,
  secondaryAction: _secondaryAction,
  secondaryLabel,
  showSecondaryAction,
  ...args
}: WidgetEmptyStateStoryArgs) {
  const activeBrand = brand ?? "Cars24";
  const secondaryAction = showSecondaryAction
    ? makeButtonAction(activeBrand, secondaryLabel, "Ghost")
    : null;

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <WidgetEmptyState
          {...args}
          brand={activeBrand}
          primaryAction={makeButtonAction(activeBrand, primaryLabel, "Solid")}
          secondaryAction={secondaryAction}
        />
      </StoryCard>
    </StoryPage>
  );
}

function CustomImageSlot({ brand }: { brand: DisplayBrandId }) {
  return (
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, var(--cars24-primitive-drive-pink-50, #FFE8F7), var(--cars24-brand-primary-50, #F6F6FF))",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Icon
        brand={brand}
        decorative
        name="sparkle-filled"
        style={{ color: "var(--cars24-primitive-drive-pink-400, #FD49C0)", fontSize: 48 }}
      />
    </div>
  );
}

function OptionsStory({ brand = "Cars24" }: Pick<WidgetEmptyStateProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Default</StoryLabel>
          <WidgetEmptyState brand={activeBrand} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>No image slot</StoryLabel>
          <WidgetEmptyState brand={activeBrand} showImageSlot={false} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Custom image slot</StoryLabel>
          <WidgetEmptyState
            brand={activeBrand}
            imageSlot={<CustomImageSlot brand={activeBrand} />}
            title="Nothing to show right now"
            description="New recommendations will appear here once they are ready."
            dynamicLabel="Come back soon"
          />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Reusable image slot</StoryLabel>
          <WidgetEmptyStateImageSlot brand={activeBrand} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const widgetEmptyStateSourceCode = `import { Icon, WidgetEmptyState } from "@geist/web";

<WidgetEmptyState
  brand="Cars24"
  title="Title comes here, up to two lines"
  description="Description that can go upto 2 lines of text for long descriptions"
  dynamicLabel="Dynamic Label"
/>;`;

const meta = {
  title: "Widgets/Empty State",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(WIDGET_EMPTY_STATE_FIGMA_URL),
    docs: {
      description: {
        component:
          "Implements the linked Figma node named Widget / Empty State. The placeholder image slot is reusable, while actions reuse the canonical Button Group with large vertical buttons."
      },
      source: {
        code: widgetEmptyStateSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    title: "Title comes here, up to two lines",
    description: "Description that can go upto 2 lines of text for long descriptions",
    dynamicLabel: "Dynamic Label",
    primaryLabel: "Label",
    secondaryLabel: "Label",
    showDescription: true,
    showDynamicLabel: true,
    showImageSlot: true,
    showSecondaryAction: true,
    showTitle: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    dynamicLabel: {
      control: "text"
    },
    primaryLabel: {
      control: "text"
    },
    secondaryLabel: {
      control: "text"
    },
    showTitle: {
      control: "boolean"
    },
    showDescription: {
      control: "boolean"
    },
    showDynamicLabel: {
      control: "boolean"
    },
    showImageSlot: {
      control: "boolean"
    },
    showSecondaryAction: {
      control: "boolean"
    },
    imageSlot: {
      control: false
    },
    primaryAction: {
      control: false
    },
    secondaryAction: {
      control: false
    }
  },
  render: PlaygroundStory
} satisfies Meta<WidgetEmptyStateStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Options: Story = {
  render: ({ brand }) => <OptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
