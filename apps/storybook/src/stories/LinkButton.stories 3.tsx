import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  LinkButton,
  Text,
  type LinkButtonPreviewState,
  type LinkButtonProps,
  type LinkButtonSize,
  type LinkButtonTone
} from "@geist/web";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage, StoryPreviewSurface } from "../storybook-shell";

type LinkButtonStoryArgs = Omit<LinkButtonProps, "children" | "leadingIcon" | "trailingIcon"> & {
  label: string;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

const linkButtonSizes: LinkButtonSize[] = ["Extra Small", "Small", "Medium", "Large"];
const documentedStates: Array<{
  key: string;
  label: string;
  forceState?: LinkButtonPreviewState;
  disabled?: boolean;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover", forceState: "Hover" },
  { key: "disabled", label: "Disabled", disabled: true }
];

function makeIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="arrow-right-outline" decorative /> : undefined
  };
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

function MatrixCell({
  brand,
  tone,
  size,
  onDark,
  forceState,
  disabled
}: {
  brand: DisplayBrandId;
  tone: LinkButtonTone;
  size: LinkButtonSize;
  onDark: boolean;
  forceState?: LinkButtonPreviewState;
  disabled?: boolean;
}) {
  return (
    <LinkButton
      brand={brand}
      tone={tone}
      size={size}
      onDark={onDark}
      {...makeIcons(true, true)}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    >
      Label
    </LinkButton>
  );
}

function SectionHeading({
  brand = "Cars24",
  title,
  description,
  tone = "primary"
}: {
  brand?: DisplayBrandId;
  title: string;
  description?: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md" tone={tone}>
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone={tone === "inverse" ? "inverse" : "secondary"}>
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function ToneMatrix({
  brand,
  tone,
  onDark
}: {
  brand: DisplayBrandId;
  tone: LinkButtonTone;
  onDark: boolean;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm" tone={onDark ? "inverse" : "primary"}>
        {tone}
      </Text>
      <StoryMatrix columns="180px repeat(3, minmax(180px, 1fr))" tone={onDark ? "inverse" : "canvas"}>
        <StoryMatrixCornerCell tone={onDark ? "inverse" : "canvas"} />
        {documentedStates.map((state) => (
          <StoryMatrixHeaderCell key={`${tone}-${state.key}-header`} tone={onDark ? "inverse" : "canvas"}>
            <HeaderCell brand={brand} label={state.label} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixHeaderCell>
        ))}

        {linkButtonSizes.flatMap((size) => [
          <StoryMatrixRowLabelCell key={`${tone}-${size}-label`} minHeight={96} tone={onDark ? "inverse" : "canvas"}>
            <HeaderCell brand={brand} label={size} tone={onDark ? "inverse" : "secondary"} />
          </StoryMatrixRowLabelCell>,
          ...documentedStates.map((state) => (
            <StoryMatrixValueCell
              key={`${tone}-${size}-${state.key}`}
              minHeight={96}
              tone={onDark ? "inverse" : "canvas"}
            >
              <MatrixCell
                brand={brand}
                tone={tone}
                size={size}
                onDark={onDark}
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

function ToneVariantMatrixStory({
  brand,
  tone
}: {
  brand: DisplayBrandId;
  tone: LinkButtonTone;
}) {
  return (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <StoryCard>
          <ToneMatrix brand={brand} tone={tone} onDark={false} />
        </StoryCard>

        <StoryCard
          style={{
            background: String(coreTokenCatalog.color.surface.inverse),
            borderRadius: 24,
            padding: 32
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            <SectionHeading
              brand={brand}
              title="On Dark Surface"
              description="The same complete matrix on inverse backgrounds for contrast validation."
              tone="inverse"
            />
            <ToneMatrix brand={brand} tone={tone} onDark />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function ConfigurationStory(args: LinkButtonStoryArgs) {
  const { label, showLeadingIcon, showTrailingIcon, onDark, ...rest } = args;
  const resolvedOnDark = Boolean(onDark);

  return (
    <StoryPreviewSurface onDark={resolvedOnDark}>
      <LinkButton {...rest} onDark={resolvedOnDark} {...makeIcons(showLeadingIcon, showTrailingIcon)}>
        {label}
      </LinkButton>
    </StoryPreviewSurface>
  );
}

const meta: Meta<LinkButtonStoryArgs> = {
  title: "Components/Buttons/Link Button",
  component: LinkButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    tone: "Brand",
    size: "Medium",
    onDark: false,
    underline: true,
    disabled: false,
    label: "Label",
    showLeadingIcon: true,
    showTrailingIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    tone: {
      control: "radio",
      options: ["Brand", "Black"]
    },
    size: {
      control: "radio",
      options: linkButtonSizes
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover"]
    }
  }
};

export default meta;

type Story = StoryObj<LinkButtonStoryArgs>;

function buildLinkButtonToneSourceCode(tone: LinkButtonTone) {
  return `<LinkButton tone="${tone}" size="Medium">Label</LinkButton>
<LinkButton tone="${tone}" size="Medium" forceState="Hover">Label</LinkButton>
<LinkButton tone="${tone}" size="Medium" disabled>Label</LinkButton>`;
}

const linkButtonUiExampleSourceCode = `<LinkButton tone="Brand" size="Small">Privacy statement</LinkButton>`;

export const Playground: Story = {
  render: (args) => <ConfigurationStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Brand: Story = {
  render: ({ brand = "Cars24" }) => <ToneVariantMatrixStory brand={brand} tone="Brand" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildLinkButtonToneSourceCode("Brand") } }
  }
};

export const Black: Story = {
  render: ({ brand = "Cars24" }) => <ToneVariantMatrixStory brand={brand} tone="Black" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildLinkButtonToneSourceCode("Black") } }
  }
};

export const UIExample: Story = {
  render: (args) => <ConfigurationStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: linkButtonUiExampleSourceCode } }
  }
};
