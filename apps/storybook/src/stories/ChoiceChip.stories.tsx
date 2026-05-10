import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@turbo/tokens";
import {
  ChoiceChip,
  type ChoiceChipProps,
  type ChoiceChipSize,
  type ChoiceChipState,
  type ChoiceChipType,
  type ChoiceChipVariant
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage, StoryPreviewSurface } from "../storybook-shell";

const CHOICE_CHIP_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=129-1935&t=1zgOyFpiLYMyM4XM-11";

const states: ChoiceChipState[] = ["Rest", "Hover", "Active", "Disabled"];
const horizontalTypes: ChoiceChipType[] = ["Regular", "Black", "Inverse"];
const horizontalSizes: ChoiceChipSize[] = ["Default", "Small"];
const verticalTypes: ChoiceChipType[] = ["Regular", "Inverse"];
const variants: ChoiceChipVariant[] = ["Horizontal", "Vertical"];

type ChoiceChipStoryArgs = ChoiceChipProps & {
  description: string;
  label: string;
};

function PlaygroundStory({ description, label, ...args }: ChoiceChipStoryArgs) {
  return (
    <ChoiceChip
      {...args}
      description={args.variant === "Vertical" ? description : undefined}
      label={label}
    />
  );
}

function PanelHeader({
  brand,
  title,
  subtitle
}: {
  brand: DisplayBrandId;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <StoryHeading brand={brand} size="lg">
        {title}
      </StoryHeading>
      <StoryCopy brand={brand} size="sm">
        {subtitle}
      </StoryCopy>
    </div>
  );
}

function HorizontalPanel({
  brand,
  size,
  type
}: {
  brand: DisplayBrandId;
  size: ChoiceChipSize;
  type: ChoiceChipType;
}) {
  return (
    <StoryCard
      style={{
        background: type === "Black" ? String(coreTokenCatalog.color.surface.inverse) : "transparent",
        borderRadius: 20,
        display: "grid",
        gap: 20,
        padding: 20
      }}
    >
      <PanelHeader
        brand={brand}
        title={`${size} / ${type}`}
        subtitle="Horizontal chip states with fixed leading and trailing icons."
      />

      <div style={panelRowsStyles}>
        {states.map((state) => (
          <div key={`${size}-${type}-${state}`} style={rowStyles}>
            <span
              style={{
                ...stateLabelStyles,
                color:
                  type === "Black"
                    ? String(coreTokenCatalog.color.text.inverse)
                    : String(coreTokenCatalog.color.text.secondary)
              }}
            >
              {state}
            </span>

            <ChoiceChip
              brand={brand}
              label="Chip label"
              size={size}
              state={state}
              type={type}
              variant="Horizontal"
            />
          </div>
        ))}
      </div>
    </StoryCard>
  );
}

function VerticalPanel({
  brand,
  iconSwap,
  type
}: {
  brand: DisplayBrandId;
  iconSwap: boolean;
  type: ChoiceChipType;
}) {
  return (
    <StoryCard
      style={{
        background: type === "Inverse" ? String(coreTokenCatalog.color.surface.inverse) : "transparent",
        borderRadius: 20,
        display: "grid",
        gap: 20,
        padding: 20
      }}
    >
      <PanelHeader
        brand={brand}
        title={`${type} / iconSwap ${iconSwap ? "Yes" : "No"}`}
        subtitle="Stacked small-chip states with stateful icon placement."
      />

      <div style={panelRowsStyles}>
        {states.map((state) => (
          <div key={`${type}-${iconSwap}-${state}`} style={rowStyles}>
            <span
              style={{
                ...stateLabelStyles,
                color:
                  type === "Inverse"
                    ? String(coreTokenCatalog.color.text.inverse)
                    : String(coreTokenCatalog.color.text.secondary)
              }}
            >
              {state}
            </span>

            <ChoiceChip
              brand={brand}
              description="Description"
              iconSwap={iconSwap}
              label="Chip label"
              state={state}
              type={type}
              variant="Vertical"
            />
          </div>
        ))}
      </div>
    </StoryCard>
  );
}

function VariantsStory({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 32 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <StoryHeading brand={brand} size="xl">
              Choice Chip
            </StoryHeading>
            <StoryCopy brand={brand} size="md">
              Matrix covering every visible Figma combination: horizontal Default and Small in
              Regular, Black, and Inverse themes, plus stacked Small chips in Regular and Inverse
              with both iconSwap modes.
            </StoryCopy>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <StoryHeading brand={brand} size="lg">
              Horizontal
            </StoryHeading>

            <div style={panelGridStyles}>
              {horizontalSizes.flatMap((size) =>
                horizontalTypes.map((type) => (
                  <StoryPreviewSurface
                    key={`horizontal-${size}-${type}`}
                    onDark={type === "Black"}
                  >
                    <HorizontalPanel brand={brand} size={size} type={type} />
                  </StoryPreviewSurface>
                ))
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <StoryHeading brand={brand} size="lg">
              Vertical
            </StoryHeading>

            <div style={panelGridStyles}>
              {verticalTypes.flatMap((type) =>
                [true, false].map((iconSwap) => (
                  <StoryPreviewSurface
                    key={`vertical-${type}-${iconSwap}`}
                    onDark={type === "Inverse"}
                  >
                    <VerticalPanel brand={brand} iconSwap={iconSwap} type={type} />
                  </StoryPreviewSurface>
                ))
              )}
            </div>
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const panelGridStyles: CSSProperties = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
};

const panelRowsStyles: CSSProperties = {
  display: "grid",
  gap: 12
};

const rowStyles: CSSProperties = {
  alignItems: "center",
  display: "grid",
  gap: 16,
  gridTemplateColumns: "72px minmax(0, 1fr)"
};

const stateLabelStyles: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "16px"
};

const meta: Meta<ChoiceChipStoryArgs> = {
  title: "Components/Choice Chip",
  component: ChoiceChip,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(CHOICE_CHIP_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    description: "Description",
    iconSwap: true,
    label: "Chip label",
    leadingIcon: true,
    size: "Default",
    state: "Rest",
    trailingIcon: true,
    type: "Regular",
    variant: "Horizontal"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: horizontalSizes
    },
    state: {
      control: "inline-radio",
      options: states
    },
    type: {
      control: "inline-radio",
      options: horizontalTypes
    },
    variant: {
      control: "inline-radio",
      options: variants
    },
    iconSwap: {
      control: "boolean"
    },
    leadingIcon: {
      control: "boolean"
    },
    label: {
      control: "text"
    },
    description: {
      control: "text"
    },
    trailingIcon: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<ChoiceChipStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantsStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
