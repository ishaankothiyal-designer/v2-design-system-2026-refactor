import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  Icon,
  IconButton,
  type IconButtonPreviewState,
  type IconButtonProps,
  type IconButtonShape,
  type IconButtonSize,
  type IconButtonStyleVariant
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type IconButtonStoryArgs = Omit<IconButtonProps, "icon"> & {
  iconName: "plus-large-filled";
};

const iconButtonSizes: IconButtonSize[] = ["Large", "Medium", "Small", "XSmall", "XXSmall", "XXXSmall"];
const iconButtonShapes: IconButtonShape[] = ["Regular", "Round"];
const lightStyleVariants: IconButtonStyleVariant[] = [
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
const darkStyleVariants: IconButtonStyleVariant[] = [
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

function StoryIconButton({ iconName, ...rest }: IconButtonStoryArgs) {
  return <IconButton {...rest} icon={<Icon name={iconName} decorative />} />;
}

function HeaderCell({ label }: { label: string }) {
  return <div style={headerCellStyles}>{label}</div>;
}

function MatrixCell({
  disabled,
  forceState,
  onDark,
  styleVariant
}: {
  disabled?: boolean;
  forceState?: IconButtonPreviewState;
  onDark: boolean;
  styleVariant: IconButtonStyleVariant;
}) {
  return (
    <IconButton
      aria-label="Add item"
      icon={<Icon name="plus-large-filled" decorative />}
      onDark={onDark}
      size="Medium"
      styleVariant={styleVariant}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    />
  );
}

function MatrixSection({
  onDark,
  styleVariants,
  title
}: {
  onDark: boolean;
  styleVariants: IconButtonStyleVariant[];
  title: string;
}) {
  return (
    <StoryCard {...(onDark ? { style: darkCardStyles } : {})}>
      <div style={{ display: "grid", gap: 20 }}>
        <strong>{title}</strong>

        <div style={matrixGridStyles}>
          <HeaderCell label="Variant" />
          <HeaderCell label="Rest" />
          <HeaderCell label="Hover / Pressed" />
          <HeaderCell label="Disabled" />

          {styleVariants.flatMap((styleVariant) => [
            <HeaderCell key={`${title}-${styleVariant}-label`} label={styleVariant} />,
            <MatrixCell key={`${title}-${styleVariant}-rest`} onDark={onDark} styleVariant={styleVariant} />,
            <MatrixCell
              key={`${title}-${styleVariant}-hover`}
              forceState="Hover/Pressed"
              onDark={onDark}
              styleVariant={styleVariant}
            />,
            <MatrixCell key={`${title}-${styleVariant}-disabled`} disabled onDark={onDark} styleVariant={styleVariant} />
          ])}
        </div>
      </div>
    </StoryCard>
  );
}

function SizeScaleSection() {
  return (
    <>
      {iconButtonShapes.map((shape) => (
        <StoryCard key={shape}>
          <div style={{ display: "grid", gap: 18 }}>
            <strong>{shape}</strong>

            <div style={sizeGridStyles}>
              {iconButtonSizes.map((size) => (
                <div key={`${shape}-${size}`} style={{ display: "grid", gap: 10, justifyItems: "start" }}>
                  <HeaderCell label={size} />
                  <IconButton
                    aria-label={`Add item ${size}`}
                    icon={<Icon name="plus-large-filled" decorative />}
                    shape={shape}
                    size={size}
                  />
                </div>
              ))}
            </div>
          </div>
        </StoryCard>
      ))}
    </>
  );
}

function PlaygroundStory(args: IconButtonStoryArgs) {
  const { iconName, ...rest } = args;

  return (
    <div style={rest.onDark ? { background: "#0A0A0A", padding: 24, borderRadius: 16 } : undefined}>
      <IconButton {...rest} icon={<Icon name={iconName} decorative />} />
    </div>
  );
}

function MatrixStory() {
  return (
    <StoryPage fullscreen>
      <MatrixSection onDark={false} styleVariants={lightStyleVariants} title="Light" />
      <MatrixSection onDark styleVariants={darkStyleVariants} title="On Dark" />
      <SizeScaleSection />
    </StoryPage>
  );
}

const headerCellStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const introCopyStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  margin: 0,
  fontSize: 16,
  lineHeight: "24px"
};

const sectionCopyStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  margin: 0,
  fontSize: 14,
  lineHeight: "20px"
};

const darkCardStyles: CSSProperties = {
  background: "#0A0A0A"
};

const matrixGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "180px repeat(3, minmax(0, 1fr))",
  rowGap: 16,
  justifyItems: "center"
};

const sizeGridStyles: CSSProperties = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  justifyContent: "center"
};

const playgroundGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
};

const meta: Meta<IconButtonStoryArgs> = {
  title: "Components/Icon Button",
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
      options: [...lightStyleVariants]
    }
  }
};

export default meta;

type Story = StoryObj<IconButtonStoryArgs>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: () => <MatrixStory />,
  parameters: {
    controls: { disable: true }
  }
};

export const UsageGuidelines: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const UIExample: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};
