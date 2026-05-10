import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  CaptionButton,
  Text,
  type CaptionButtonCaptionPosition,
  type CaptionButtonPreviewState,
  type CaptionButtonProps,
  type CaptionButtonSize,
  type CaptionButtonStyleVariant
} from "@turbo/web";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixSection,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage } from "../storybook-shell";

type CaptionButtonStoryArgs = Omit<CaptionButtonProps, "caption" | "children"> & {
  captionText: string;
  label: string;
};

const captionButtonSizes: CaptionButtonSize[] = ["Medium", "Large"];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: CaptionButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover / Pressed", forceState: "Hover/Pressed" },
  { key: "disabled", label: "Disabled", disabled: true }
];

function HeaderCell({
  brand = "Cars24",
  label,
  tone = "secondary"
}: {
  brand?: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function SectionHeading({
  brand = "Cars24",
  title,
  description
}: {
  brand?: DisplayBrandId;
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md">
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function MatrixCell({
  brand,
  captionPosition,
  disabled,
  forceState,
  size,
  styleVariant
}: {
  brand: DisplayBrandId;
  captionPosition: CaptionButtonCaptionPosition;
  disabled?: boolean;
  forceState?: CaptionButtonPreviewState;
  size: CaptionButtonSize;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <CaptionButton
      brand={brand}
      caption="Caption"
      captionPosition={captionPosition}
      size={size}
      styleVariant={styleVariant}
      {...(disabled ? { disabled: true } : {})}
      {...(forceState ? { forceState } : {})}
    >
      Primary Button
    </CaptionButton>
  );
}

function VariantMatrix({
  brand,
  captionPosition,
  styleVariant
}: {
  brand: DisplayBrandId;
  captionPosition: CaptionButtonCaptionPosition;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {styleVariant}
      </Text>
      <StoryMatrix columns="180px repeat(3, minmax(220px, 1fr))">
        <StoryMatrixCornerCell />
        {documentedStates.map((state) => (
          <StoryMatrixHeaderCell key={`${captionPosition}-${styleVariant}-${state.key}-header`}>
            <HeaderCell brand={brand} label={state.label} />
          </StoryMatrixHeaderCell>
        ))}

        {captionButtonSizes.flatMap((size) => [
          <StoryMatrixRowLabelCell key={`${captionPosition}-${styleVariant}-${size}-label`} minHeight={116}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixRowLabelCell>,
          ...documentedStates.map((state) => (
            <StoryMatrixValueCell key={`${captionPosition}-${styleVariant}-${size}-${state.key}`} minHeight={116}>
              <MatrixCell
                brand={brand}
                captionPosition={captionPosition}
                size={size}
                styleVariant={styleVariant}
                {...(state.forceState ? { forceState: state.forceState } : {})}
                {...(state.disabled ? { disabled: true } : {})}
              />
            </StoryMatrixValueCell>
          ))
        ])}
      </StoryMatrix>
    </div>
  );
}

function CaptionPositionSection({
  brand,
  captionPosition,
  styleVariant
}: {
  brand: DisplayBrandId;
  captionPosition: CaptionButtonCaptionPosition;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <StoryMatrixSection>
      <SectionHeading brand={brand} title={`Caption ${captionPosition}`} />
      <div style={{ display: "grid", gap: 20 }}>
        <VariantMatrix brand={brand} captionPosition={captionPosition} styleVariant={styleVariant} />
      </div>
    </StoryMatrixSection>
  );
}

function StyleVariantMatrixStory({
  brand,
  styleVariant
}: {
  brand: DisplayBrandId;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <StoryCard>
          <CaptionPositionSection brand={brand} captionPosition="Up" styleVariant={styleVariant} />
        </StoryCard>
        <StoryCard>
          <CaptionPositionSection brand={brand} captionPosition="Down" styleVariant={styleVariant} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function PlaygroundStory(args: CaptionButtonStoryArgs) {
  const { captionText, label, ...rest } = args;

  return (
    <CaptionButton {...rest} caption={captionText}>
      {label}
    </CaptionButton>
  );
}

const meta: Meta<CaptionButtonStoryArgs> = {
  title: "Components/Buttons/Caption Button",
  component: CaptionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    captionPosition: "Up",
    captionText: "Caption",
    disabled: false,
    label: "Primary Button",
    size: "Medium",
    styleVariant: "Primary"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    captionPosition: {
      control: "radio",
      options: ["Up", "Down"]
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover/Pressed"]
    },
    size: {
      control: "radio",
      options: captionButtonSizes
    },
    styleVariant: {
      control: "radio",
      options: ["Primary", "Secondary"]
    }
  }
};

export default meta;

type Story = StoryObj<CaptionButtonStoryArgs>;

function buildCaptionButtonStyleSourceCode(styleVariant: CaptionButtonStyleVariant) {
  return `import { CaptionButton } from "@turbo/web";

<CaptionButton brand="Cars24" caption="Caption" captionPosition="Up" size="Medium" styleVariant="${styleVariant}">
  Primary Button
</CaptionButton>
<CaptionButton
  brand="Cars24"
  caption="Caption"
  captionPosition="Up"
  size="Medium"
  styleVariant="${styleVariant}"
  forceState="Hover/Pressed"
>
  Primary Button
</CaptionButton>
<CaptionButton brand="Cars24" caption="Caption" captionPosition="Up" size="Medium" styleVariant="${styleVariant}" disabled>
  Primary Button
</CaptionButton>

<CaptionButton brand="Cars24" caption="Caption" captionPosition="Down" size="Large" styleVariant="${styleVariant}">
  Primary Button
</CaptionButton>
<CaptionButton
  brand="Cars24"
  caption="Caption"
  captionPosition="Down"
  size="Large"
  styleVariant="${styleVariant}"
  forceState="Hover/Pressed"
>
  Primary Button
</CaptionButton>
<CaptionButton brand="Cars24" caption="Caption" captionPosition="Down" size="Large" styleVariant="${styleVariant}" disabled>
  Primary Button
</CaptionButton>`;
}

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Primary: Story = {
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Primary" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildCaptionButtonStyleSourceCode("Primary") } }
  }
};

export const Secondary: Story = {
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Secondary" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildCaptionButtonStyleSourceCode("Secondary") } }
  }
};

export const UIExample: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    }
  }
};
