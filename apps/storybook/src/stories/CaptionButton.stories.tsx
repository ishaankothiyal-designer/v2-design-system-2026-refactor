import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  CaptionButton,
  type CaptionButtonCaptionPosition,
  type CaptionButtonPreviewState,
  type CaptionButtonProps,
  type CaptionButtonSize,
  type CaptionButtonStyleVariant
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type CaptionButtonStoryArgs = Omit<CaptionButtonProps, "caption" | "children"> & {
  captionText: string;
  label: string;
};

const captionButtonSizes: CaptionButtonSize[] = ["Medium", "Large"];

function HeaderCell({ label }: { label: string }) {
  return <div style={headerCellStyles}>{label}</div>;
}

function MatrixCell({
  captionPosition,
  disabled,
  forceState,
  size,
  styleVariant
}: {
  captionPosition: CaptionButtonCaptionPosition;
  disabled?: boolean;
  forceState?: CaptionButtonPreviewState;
  size: CaptionButtonSize;
  styleVariant: CaptionButtonStyleVariant;
}) {
  return (
    <CaptionButton
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

function MatrixSection({ captionPosition }: { captionPosition: CaptionButtonCaptionPosition }) {
  const rows: Array<{
    forceState?: CaptionButtonPreviewState;
    label: string;
    styleVariant: CaptionButtonStyleVariant;
  }> = [
    { label: "Primary / Rest", styleVariant: "Primary" },
    { label: "Primary / Hover", styleVariant: "Primary", forceState: "Hover/Pressed" },
    { label: "Secondary / Rest", styleVariant: "Secondary" },
    { label: "Secondary / Hover", styleVariant: "Secondary", forceState: "Hover/Pressed" }
  ];

  return (
    <StoryCard>
      <div style={{ display: "grid", gap: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>Caption {captionPosition}</h2>
          <p style={sectionCopyStyles}>
            Figma-aligned matrix for primary and secondary states across both supported sizes.
          </p>
        </header>

        <div style={matrixGridStyles}>
          <HeaderCell label="State" />
          {captionButtonSizes.map((size) => (
            <HeaderCell key={`${captionPosition}-${size}`} label={size} />
          ))}

          {rows.flatMap((row) => [
            <HeaderCell key={`${captionPosition}-${row.label}`} label={row.label} />,
            ...captionButtonSizes.map((size) => (
              <MatrixCell
                key={`${captionPosition}-${row.label}-${size}`}
                captionPosition={captionPosition}
                size={size}
                styleVariant={row.styleVariant}
                {...(row.forceState ? { forceState: row.forceState } : {})}
              />
            ))
          ])}
        </div>
      </div>
    </StoryCard>
  );
}

function DisabledSection() {
  return (
    <StoryCard>
      <div style={{ display: "grid", gap: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>Disabled</h2>
          <p style={sectionCopyStyles}>
            Disabled presentation captured from the Cars24 Figma matrix for caption-up primary buttons.
          </p>
        </header>

        <div style={disabledGridStyles}>
          {captionButtonSizes.map((size) => (
            <div key={`disabled-${size}`} style={{ display: "grid", gap: 10, justifyItems: "start" }}>
              <HeaderCell label={size} />
              <CaptionButton caption="Caption" disabled size={size} styleVariant="Primary">
                Primary Button
              </CaptionButton>
            </div>
          ))}
        </div>
      </div>
    </StoryCard>
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

function MatrixStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Caption Button</h1>
          <p style={introCopyStyles}>
            Token-driven stacked action button with primary and secondary treatments, two sizes, and caption placement
            above or below the label.
          </p>
        </div>
      </StoryCard>

      <MatrixSection captionPosition="Up" />
      <MatrixSection captionPosition="Down" />
      <DisabledSection />
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

const matrixGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "160px repeat(2, minmax(0, 1fr))",
  rowGap: 18
};

const disabledGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
};

const playgroundGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
};

const meta: Meta<CaptionButtonStoryArgs> = {
  title: "Components/Caption Button",
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
