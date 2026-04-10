import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Banner,
  type BannerActionType,
  type BannerProps,
  type BannerState,
  type BannerTheme
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

const bannerStates: BannerState[] = ["Warning", "Success", "Error", "Info", "Brand"];
const bannerThemes: BannerTheme[] = ["Light", "Dark"];
const actionTypes: BannerActionType[] = ["Text button", "Icon button"];

function VariantCell({
  theme,
  heading,
  actionType,
  state
}: {
  theme: BannerTheme;
  heading: boolean;
  actionType: BannerActionType;
  state: BannerState;
}) {
  return (
    <Banner
      theme={theme}
      state={state}
      actionType={actionType}
      heading={heading}
      title="New Message Alert"
      description="New message received!"
    />
  );
}

function FigmaMatrixStory() {
  return (
    <StoryPage fullscreen>
      <header style={{ display: "grid", gap: 12, maxWidth: 860 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Banner</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "#64748B" }}>
          Full Figma variant matrix across theme, status, heading, and action type.
        </p>
      </header>

      {actionTypes.map((actionType) => (
        <StoryCard key={actionType}>
          <div style={{ display: "grid", gap: 16 }}>
            <strong style={{ fontSize: 16 }}>{actionType}</strong>
            <div style={matrixGridStyles}>
              <HeaderCell label="Light / Heading" />
              <HeaderCell label="Dark / Heading" />
              <HeaderCell label="Light / Inline" />
              <HeaderCell label="Dark / Inline" />

              {bannerStates.flatMap((state) => [
                <VariantCell
                  key={`${actionType}-${state}-light-heading`}
                  actionType={actionType}
                  state={state}
                  theme="Light"
                  heading
                />,
                <VariantCell
                  key={`${actionType}-${state}-dark-heading`}
                  actionType={actionType}
                  state={state}
                  theme="Dark"
                  heading
                />,
                <VariantCell
                  key={`${actionType}-${state}-light-inline`}
                  actionType={actionType}
                  state={state}
                  theme="Light"
                  heading={false}
                />,
                <VariantCell
                  key={`${actionType}-${state}-dark-inline`}
                  actionType={actionType}
                  state={state}
                  theme="Dark"
                  heading={false}
                />
              ])}
            </div>
          </div>
        </StoryCard>
      ))}
    </StoryPage>
  );
}

function HeaderCell({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 13,
        lineHeight: "18px",
        color: "#64748B",
        fontWeight: 600
      }}
    >
      {label}
    </div>
  );
}

function ConfigurationsStory() {
  return (
    <StoryPage>
      <div style={configGridStyles}>
        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>No action</strong>
            <Banner action={false} state="Info" title="System update" description="New message received!" />
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>No leading icon</strong>
            <Banner icon={false} state="Brand" theme="Dark" title="Brand notice" description="New message received!" />
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Inline message</strong>
            <Banner
              heading={false}
              actionType="Icon button"
              state="Warning"
              description="New message received!"
            />
          </div>
        </StoryCard>

        <StoryCard>
          <div style={{ display: "grid", gap: 12 }}>
            <strong>Dark text action</strong>
            <Banner
              theme="Dark"
              state="Success"
              actionType="Text button"
              title="Deployment complete"
              description="New message received!"
              actionLabel="View"
            />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const matrixGridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(4, minmax(328px, 1fr))",
  alignItems: "start"
};

const configGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))"
};

const meta: Meta<BannerProps> = {
  title: "Components/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    theme: "Light",
    state: "Warning",
    heading: true,
    icon: true,
    action: true,
    actionType: "Text button",
    title: "New Message Alert",
    description: "New message received!",
    actionLabel: "Label"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: ["core", "acme"]
    },
    theme: {
      control: "inline-radio",
      options: bannerThemes
    },
    state: {
      control: "inline-radio",
      options: bannerStates
    },
    heading: {
      control: "boolean"
    },
    icon: {
      control: "boolean"
    },
    action: {
      control: "boolean"
    },
    actionType: {
      control: "inline-radio",
      options: actionTypes
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    actionLabel: {
      control: "text"
    },
    onActionClick: {
      action: "action click"
    },
    onDismiss: {
      action: "dismiss"
    }
  },
  render: (args) => (
    <StoryPage>
      <StoryCard style={{ width: "fit-content" }}>
        <Banner {...args} />
      </StoryCard>
    </StoryPage>
  )
};

export default meta;

type Story = StoryObj<BannerProps>;

export const Playground: Story = {};

export const FigmaMatrix: StoryObj = {
  render: () => <FigmaMatrixStory />
};

export const Configurations: StoryObj = {
  render: () => <ConfigurationsStory />
};
