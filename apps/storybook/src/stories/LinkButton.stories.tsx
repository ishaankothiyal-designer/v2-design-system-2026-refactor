import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  Icon,
  LinkButton,
  type LinkButtonPreviewState,
  type LinkButtonProps,
  type LinkButtonSize,
  type LinkButtonTone
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type LinkButtonStoryArgs = Omit<LinkButtonProps, "children" | "leadingIcon" | "trailingIcon"> & {
  label: string;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
};

const linkButtonSizes: LinkButtonSize[] = ["Extra Small", "Small", "Medium", "Large"];

function makeIcons(showLeadingIcon: boolean, showTrailingIcon: boolean) {
  return {
    leadingIcon: showLeadingIcon ? <Icon name="sparkle-filled" decorative /> : undefined,
    trailingIcon: showTrailingIcon ? <Icon name="arrow-right-outline" decorative /> : undefined
  };
}

function HeaderCell({ label }: { label: string }) {
  return (
    <div style={{ color: "#64748B", fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>{label}</div>
  );
}

function MatrixCell({
  tone,
  size,
  onDark,
  forceState,
  disabled
}: {
  tone: LinkButtonTone;
  size: LinkButtonSize;
  onDark: boolean;
  forceState?: LinkButtonPreviewState;
  disabled?: boolean;
}) {
  return (
    <LinkButton
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

function MatrixStory() {
  const lightRows: Array<{
    label: string;
    tone: LinkButtonTone;
    forceState?: LinkButtonPreviewState;
    disabled?: boolean;
  }> = [
    { label: "Brand / Rest", tone: "Brand" },
    { label: "Brand / Hover", tone: "Brand", forceState: "Hover" },
    { label: "Black / Rest", tone: "Black" },
    { label: "Black / Hover", tone: "Black", forceState: "Hover" },
    { label: "Disabled", tone: "Brand", disabled: true }
  ];

  const darkRows: Array<{
    label: string;
    tone: LinkButtonTone;
    forceState?: LinkButtonPreviewState;
    disabled?: boolean;
  }> = [
    { label: "Brand / Rest", tone: "Brand" },
    { label: "Brand / Hover", tone: "Brand", forceState: "Hover" },
    { label: "Disabled", tone: "Brand", disabled: true }
  ];

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <div style={matrixGridStyles}>
            <HeaderCell label="State" />
            {linkButtonSizes.map((size) => (
              <HeaderCell key={`light-${size}`} label={size} />
            ))}

            {lightRows.flatMap((row) => [
              <HeaderCell key={`${row.label}-label`} label={row.label} />,
              ...linkButtonSizes.map((size) => (
                <MatrixCell
                  key={`${row.label}-${size}`}
                  tone={row.tone}
                  size={size}
                  onDark={false}
                  {...(row.forceState ? { forceState: row.forceState } : {})}
                  {...(row.disabled ? { disabled: true } : {})}
                />
              ))
            ])}
          </div>
        </div>
      </StoryCard>

      <StoryCard style={{ background: "#0B0B0C" }}>
        <div style={{ display: "grid", gap: 20 }}>
          <strong style={{ color: "#F8FAFC" }}>On Dark</strong>

          <div style={matrixGridStyles}>
            <HeaderCell label="State" />
            {linkButtonSizes.map((size) => (
              <HeaderCell key={`dark-${size}`} label={size} />
            ))}

            {darkRows.flatMap((row) => [
              <HeaderCell key={`dark-${row.label}-label`} label={row.label} />,
              ...linkButtonSizes.map((size) => (
                <MatrixCell
                  key={`dark-${row.label}-${size}`}
                  tone={row.tone}
                  size={size}
                  onDark
                  {...(row.forceState ? { forceState: row.forceState } : {})}
                  {...(row.disabled ? { disabled: true } : {})}
                />
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ConfigurationStory(args: LinkButtonStoryArgs) {
  const { label, showLeadingIcon, showTrailingIcon, onDark, ...rest } = args;
  const resolvedOnDark = Boolean(onDark);

  return (
    <div style={resolvedOnDark ? { background: "#0B0B0C", padding: 24, borderRadius: 16 } : undefined}>
      <LinkButton {...rest} onDark={resolvedOnDark} {...makeIcons(showLeadingIcon, showTrailingIcon)}>
        {label}
      </LinkButton>
    </div>
  );
}

const matrixGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "140px repeat(4, minmax(0, 1fr))",
  rowGap: 18,
  justifyItems: "center"
};

const configGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
};

const meta: Meta<LinkButtonStoryArgs> = {
  title: "Components/Link Button",
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

export const Playground: Story = {
  render: (args) => <ConfigurationStory {...args} />,
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

export const UIExample: Story = {
  render: (args) => <ConfigurationStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    }
  }
};
