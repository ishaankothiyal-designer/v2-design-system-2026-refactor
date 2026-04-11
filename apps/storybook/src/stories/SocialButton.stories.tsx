import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { Icon, SocialButton, type SocialButtonPreviewState, type SocialButtonProps, type SocialButtonSize } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type SocialButtonStoryArgs = Omit<SocialButtonProps, "children" | "icon"> & {
  iconName: "apple" | "facebook" | "google-icon" | "linkedin" | "x";
  label: string;
};

const socialButtonSizes: SocialButtonSize[] = ["Large", "Medium"];
const providerIcons: SocialButtonStoryArgs["iconName"][] = ["google-icon", "apple", "facebook", "linkedin", "x"];

function StorySocialButton({ iconName, label, ...rest }: SocialButtonStoryArgs) {
  return (
    <SocialButton {...rest} icon={<Icon name={iconName} decorative />}>
      {label}
    </SocialButton>
  );
}

function HeaderCell({ label }: { label: string }) {
  return <div style={headerCellStyles}>{label}</div>;
}

function MatrixCell({
  disabled,
  forceState,
  size
}: {
  disabled?: boolean;
  forceState?: SocialButtonPreviewState;
  size: SocialButtonSize;
}) {
  return (
    <SocialButton
      size={size}
      icon={<Icon name="google-icon" decorative />}
      {...(forceState ? { forceState } : {})}
      {...(disabled ? { disabled: true } : {})}
    >
      Sign in with Google
    </SocialButton>
  );
}

function MatrixStory() {
  const rows: Array<{
    label: string;
    disabled?: boolean;
    forceState?: SocialButtonPreviewState;
  }> = [
    { label: "Rest" },
    { label: "Hover", forceState: "Hover" },
    { label: "Disabled", disabled: true }
  ];

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <header style={{ display: "grid", gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Social Button</h1>
            <p style={introCopyStyles}>
              Figma-aligned social sign-in treatment across large and medium sizes with rest, hover, and disabled states.
            </p>
          </header>

          <div style={matrixGridStyles}>
            <HeaderCell label="State" />
            {socialButtonSizes.map((size) => (
              <HeaderCell key={size} label={size} />
            ))}

            {rows.flatMap((row) => [
              <HeaderCell key={`${row.label}-label`} label={row.label} />,
              ...socialButtonSizes.map((size) => (
                <MatrixCell
                  key={`${row.label}-${size}`}
                  size={size}
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

function PlaygroundStory(args: SocialButtonStoryArgs) {
  const { iconName, label, ...rest } = args;

  return (
    <StoryPage>
      <div style={playgroundGridStyles}>
        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Configured</strong>
            <SocialButton {...rest} icon={<Icon name={iconName} decorative />}>
              {label}
            </SocialButton>
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Hover Preview</strong>
            <SocialButton {...rest} forceState="Hover" icon={<Icon name={iconName} decorative />}>
              {label}
            </SocialButton>
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const headerCellStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const introCopyStyles: CSSProperties = {
  color: "#64748B",
  margin: 0,
  fontSize: 16,
  lineHeight: "24px"
};

const matrixGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "140px repeat(2, minmax(0, 1fr))",
  rowGap: 18
};

const playgroundGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
};

const meta: Meta<SocialButtonStoryArgs> = {
  title: "Components/Social Button",
  component: StorySocialButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    disabled: false,
    iconName: "google-icon",
    label: "Sign in with Google",
    size: "Large"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "radio",
      options: socialButtonSizes
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover"]
    },
    iconName: {
      control: "select",
      options: providerIcons
    }
  }
};

export default meta;

type Story = StoryObj<SocialButtonStoryArgs>;

export const Matrix: Story = {
  render: () => <MatrixStory />
};

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />
};
