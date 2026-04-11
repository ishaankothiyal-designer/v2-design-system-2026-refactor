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
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>{title}</h2>
          <p style={sectionCopyStyles}>
            Medium regular review matrix aligned to the Figma icon button states for this surface mode.
          </p>
        </header>

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
            <header style={{ display: "grid", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>{shape}</h2>
              <p style={sectionCopyStyles}>
                Figma size ladder from large through xxxsmall using the default solid primary treatment.
              </p>
            </header>

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
    <StoryPage>
      <div style={playgroundGridStyles}>
        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Configured</strong>
            <IconButton {...rest} icon={<Icon name={iconName} decorative />} />
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Hover Preview</strong>
            <IconButton {...rest} forceState="Hover/Pressed" icon={<Icon name={iconName} decorative />} />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function MatrixStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Icon Button</h1>
          <p style={introCopyStyles}>
            Token-driven icon-only action button with six sizes, square and round shapes, and surface-aware treatments
            across light and on-dark contexts.
          </p>
        </div>
      </StoryCard>

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
  rowGap: 16
};

const sizeGridStyles: CSSProperties = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
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

export const Matrix: Story = {
  render: () => <MatrixStory />
};

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />
};
