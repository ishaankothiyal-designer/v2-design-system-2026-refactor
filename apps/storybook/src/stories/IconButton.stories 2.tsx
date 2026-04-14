import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  IconButton,
  Text,
  type IconButtonPreviewState,
  type IconButtonProps,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonStyleVariant
} from "@geist/web";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage, StoryPreviewSurface } from "../storybook-shell";

type IconButtonStoryArgs = Omit<IconButtonProps, "icon"> & {
  iconName: "plus-large-filled";
};

const iconButtonSizes: IconButtonSize[] = ["Large", "Medium", "Small", "XSmall", "XXSmall", "XXXSmall"];
const iconButtonShapes: IconButtonShape[] = ["Regular", "Round"];
const styleVariants: IconButtonStyleVariant[] = [
  "Solid - Primary",
  "Solid - Black",
  "Outline - Primary",
  "Outline - Black",
  "Subtle - Primary",
  "Subtle - Black",
  "Ghost - Brand",
  "Ghost - Black",
  "Transparent"
];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: IconButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover / Pressed", forceState: "Hover/Pressed" },
  { key: "disabled", label: "Disabled", disabled: true }
];

function StoryIconButton({ iconName, ...rest }: IconButtonStoryArgs) {
  return <IconButton {...rest} icon={<Icon name={iconName} decorative />} />;
}

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

function SurfaceHeading({
  brand = "Cars24",
  label,
  tone = "primary"
}: {
  brand?: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="md" tone={tone}>
      {label}
    </Text>
  );
}

function MatrixCell({
  brand,
  disabled,
  forceState,
  onDark,
  shape,
  size,
  styleVariant
}: {
  brand: DisplayBrandId;
  disabled?: boolean;
  forceState?: IconButtonPreviewState;
  onDark: boolean;
  shape: IconButtonShape;
  size: IconButtonSize;
  styleVariant: IconButtonStyleVariant;
}) {
  return (
    <IconButton
      aria-label="Add item"
      brand={brand}
      icon={<Icon name="plus-large-filled" decorative />}
      onDark={onDark}
      shape={shape}
      size={size}
      styleVariant={styleVariant}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    />
  );
}

function ShapeMatrix({
  brand,
  onDark,
  shape,
  styleVariant
}: {
  brand: DisplayBrandId;
  onDark: boolean;
  shape: IconButtonShape;
  styleVariant: IconButtonStyleVariant;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm" tone={onDark ? "inverse" : "primary"}>
        {shape}
      </Text>
      <StoryMatrix columns="180px repeat(3, minmax(180px, 1fr))" tone={onDark ? "inverse" : "canvas"}>
        <StoryMatrixCornerCell tone={onDark ? "inverse" : "canvas"} />
        {documentedStates.map((state) => (
          <StoryMatrixHeaderCell
            key={`${shape}-${styleVariant}-${state.key}-header`}
            tone={onDark ? "inverse" : "canvas"}
          >
            <HeaderCell brand={brand} label={state.label} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixHeaderCell>
        ))}

        {iconButtonSizes.flatMap((size) => [
          <StoryMatrixRowLabelCell
            key={`${shape}-${styleVariant}-${size}-label`}
            minHeight={104}
            tone={onDark ? "inverse" : "canvas"}
          >
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixRowLabelCell>,
          ...documentedStates.map((state) => (
            <StoryMatrixValueCell
              key={`${shape}-${styleVariant}-${size}-${state.key}`}
              minHeight={104}
              tone={onDark ? "inverse" : "canvas"}
            >
              <MatrixCell
                brand={brand}
                onDark={onDark}
                shape={shape}
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

function StyleVariantMatrixStory({
  brand,
  styleVariant
}: {
  brand: DisplayBrandId;
  styleVariant: IconButtonStyleVariant;
}) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 20 }}>
          <SurfaceHeading brand={brand} label="Light" />
          {iconButtonShapes.map((shape) => (
            <ShapeMatrix
              key={`${styleVariant}-${shape}-light`}
              brand={brand}
              onDark={false}
              shape={shape}
              styleVariant={styleVariant}
            />
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            padding: 24,
            borderRadius: 24,
            background: String(coreTokenCatalog.color.surface.inverse)
          }}
        >
          <SurfaceHeading brand={brand} label="Inverse" tone="inverse" />
          {iconButtonShapes.map((shape) => (
            <ShapeMatrix
              key={`${styleVariant}-${shape}-dark`}
              brand={brand}
              onDark
              shape={shape}
              styleVariant={styleVariant}
            />
          ))}
        </div>
      </div>
    </StoryPage>
  );
}

function PlaygroundStory(args: IconButtonStoryArgs) {
  const { iconName, ...rest } = args;

  return (
    <StoryPreviewSurface onDark={Boolean(rest.onDark)}>
      <IconButton {...rest} icon={<Icon name={iconName} decorative />} />
    </StoryPreviewSurface>
  );
}

const meta: Meta<IconButtonStoryArgs> = {
  title: "Components/Buttons/Icon Button",
  component: StoryIconButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    "aria-label": "Add item",
    brand: "Cars24",
    disabled: false,
    iconName: "plus-large-filled",
    onDark: false,
    shape: "Regular",
    size: "Medium",
    styleVariant: "Solid - Primary"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover/Pressed"]
    },
    shape: {
      control: "radio",
      options: iconButtonShapes
    },
    size: {
      control: "radio",
      options: iconButtonSizes
    },
    styleVariant: {
      control: "select",
      options: [...styleVariants]
    }
  }
};

export default meta;

type Story = StoryObj<IconButtonStoryArgs>;

function buildIconButtonVariantSourceCode(styleVariant: IconButtonStyleVariant) {
  return `import { Icon, IconButton } from "@geist/web";

<IconButton
  aria-label="Add item"
  brand="Cars24"
  icon={<Icon name="plus-large-filled" decorative />}
  shape="Regular"
  size="Medium"
  styleVariant="${styleVariant}"
/>
<IconButton
  aria-label="Add item"
  brand="Cars24"
  icon={<Icon name="plus-large-filled" decorative />}
  shape="Round"
  size="Large"
  styleVariant="${styleVariant}"
  forceState="Hover/Pressed"
/>
<IconButton
  aria-label="Add item"
  brand="Cars24"
  icon={<Icon name="plus-large-filled" decorative />}
  shape="Regular"
  size="Small"
  styleVariant="${styleVariant}"
  disabled
/>`;
}

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const SolidPrimary: Story = {
  name: "Solid - Primary",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Solid - Primary" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Solid - Primary") } }
  }
};

export const SolidBlack: Story = {
  name: "Solid - Black",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Solid - Black" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Solid - Black") } }
  }
};

export const OutlinePrimary: Story = {
  name: "Outline - Primary",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Outline - Primary" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Outline - Primary") } }
  }
};

export const OutlineBlack: Story = {
  name: "Outline - Black",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Outline - Black" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Outline - Black") } }
  }
};

export const SubtlePrimary: Story = {
  name: "Subtle - Primary",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Subtle - Primary" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Subtle - Primary") } }
  }
};

export const SubtleBlack: Story = {
  name: "Subtle - Black",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Subtle - Black" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Subtle - Black") } }
  }
};

export const GhostBrand: Story = {
  name: "Ghost - Brand",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Ghost - Brand" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Ghost - Brand") } }
  }
};

export const GhostBlack: Story = {
  name: "Ghost - Black",
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Ghost - Black" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Ghost - Black") } }
  }
};

export const Transparent: Story = {
  render: ({ brand = "Cars24" }) => <StyleVariantMatrixStory brand={brand} styleVariant="Transparent" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildIconButtonVariantSourceCode("Transparent") } }
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
