import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  Badge,
  Icon,
  type BadgePillShape,
  type BadgePriority,
  type BadgeProps,
  type BadgeSize,
  type BadgeType
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type BadgeStoryArgs = BadgeProps & {
  dismissible: boolean;
};

const badgeTypes: BadgeType[] = [
  "Drive pink",
  "Error",
  "Feature",
  "Information",
  "Neutral",
  "Sky surge",
  "Success",
  "Warning"
];

const badgePriorities: BadgePriority[] = ["High", "Medium", "Low"];
const badgeSizes: BadgeSize[] = ["Extra Small", "Small", "Medium"];
const pillShapes: BadgePillShape[] = ["No", "Yes"];

function matrixBadge(type: BadgeType, priority: BadgePriority, size: BadgeSize, pillShape: BadgePillShape) {
  return (
    <Badge
      key={`${type}-${priority}-${size}-${pillShape}`}
      type={type}
      priority={priority}
      size={size}
      pillShape={pillShape}
      labelText="Badge"
    />
  );
}

function MatrixStory() {
  return (
    <StoryPage>
      <header style={{ display: "grid", gap: 12, maxWidth: 760 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Badge</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "#64748B" }}>
          Exact Figma property matrix for `Size`, `Type`, `Priority`, and `Pill shape`.
        </p>
      </header>

      <div style={{ display: "grid", gap: 24 }}>
        {badgeTypes.map((type) => (
          <StoryCard key={type}>
            <div style={{ display: "grid", gap: 16 }}>
              <strong style={{ fontSize: 16 }}>{type}</strong>
              <div style={{ display: "grid", gap: 16 }}>
                {badgePriorities.map((priority) => (
                  <div key={priority} style={{ display: "grid", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>{priority}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {badgeSizes.map((size) => matrixBadge(type, priority, size, "No"))}
                      {badgeSizes.map((size) => matrixBadge(type, priority, size, "Yes"))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

function StateGallery() {
  const states: Array<BadgeProps["forceState"] | "disabled"> = [
    undefined,
    "hover",
    "focus",
    "active",
    "disabled"
  ];

  return (
    <StoryPage>
      <StoryCard>
        <div style={{ display: "grid", gap: 16 }}>
          <strong>Relevant states</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {states.map((state) => (
              <div key={String(state ?? "default")} style={{ display: "grid", gap: 8, justifyItems: "start" }}>
                <span style={{ fontSize: 13, color: "#64748B", textTransform: "capitalize" }}>
                  {state ?? "default"}
                </span>
                <Badge
                  type="Neutral"
                  priority="Medium"
                  size="Medium"
                  pillShape="Yes"
                  labelText="Badge"
                  disabled={state === "disabled"}
                  {...(state && state !== "disabled" ? { forceState: state } : {})}
                />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ConfigurationsStory() {
  const examples: Array<{ title: string; node: ReactNode }> = [
    {
      title: "Text only",
      node: (
        <Badge
          type="Neutral"
          priority="Low"
          size="Extra Small"
          pillShape="Yes"
          labelText="Badge"
          showLeadingIcon={false}
          showTrailingIcon={false}
        />
      )
    },
    {
      title: "Icon + text",
      node: <Badge type="Success" priority="High" size="Small" labelText="Badge" />
    },
    {
      title: "Status badge",
      node: <Badge type="Warning" priority="Medium" size="Small" labelText="Action required" />
    },
    {
      title: "Dismissible",
      node: (
        <Badge
          type="Information"
          priority="Medium"
          size="Small"
          pillShape="Yes"
          labelText="Dismiss me"
          onDismiss={() => undefined}
        />
      )
    },
    {
      title: "Custom icons",
      node: (
        <Badge
          type="Feature"
          priority="Medium"
          size="Medium"
          labelText="Custom"
          leadingIcon={<Icon name="calendar-line" decorative />}
          trailingIcon={<Icon name="check-outline" decorative />}
        />
      )
    },
    {
      title: "Accordion integration",
      node: (
        <div style={{ width: 328 }}>
          <Accordion
            title="Additional Insights"
            content="The Accordion badge slot now consumes the same canonical Badge API exposed in Storybook."
            badge={
              <Badge
                type="Neutral"
                priority="Low"
                size="Extra Small"
                pillShape="Yes"
                labelText="New"
                showLeadingIcon={false}
                showTrailingIcon={false}
              />
            }
          />
        </div>
      )
    }
  ];

  return (
    <StoryPage>
      <div style={configGridStyles}>
        {examples.map((example) => (
          <StoryCard key={example.title}>
            <div style={{ display: "grid", gap: 12 }}>
              <strong>{example.title}</strong>
              {example.node}
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

function SizesStory() {
  return (
    <StoryPage>
      <div style={configGridStyles}>
        {badgeSizes.map((size) => (
          <StoryCard key={size}>
            <div style={{ display: "grid", gap: 12 }}>
              <strong>{size}</strong>
              <Badge type="Drive pink" priority="High" size={size} labelText="Badge" />
              <Badge type="Neutral" priority="Medium" size={size} pillShape="Yes" labelText="Badge" />
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

const configGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
};

const meta: Meta<BadgeStoryArgs> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    labelText: "Badge",
    size: "Extra Small",
    type: "Neutral",
    priority: "Medium",
    pillShape: "No",
    showLeadingIcon: true,
    showTrailingIcon: true,
    leadingIcon: null,
    trailingIcon: null,
    disabled: false,
    dismissible: false
  },
  argTypes: {
    brand: {
      control: "radio",
      options: ["core", "acme"]
    },
    size: {
      control: "inline-radio",
      options: badgeSizes
    },
    type: {
      control: "select",
      options: badgeTypes
    },
    priority: {
      control: "inline-radio",
      options: badgePriorities
    },
    pillShape: {
      control: "inline-radio",
      options: pillShapes
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showTrailingIcon: {
      control: "boolean"
    },
    forceState: {
      control: "select",
      options: ["hover", "focus", "active"]
    },
    dismissible: {
      control: "boolean"
    },
    leadingIcon: {
      control: false
    },
    trailingIcon: {
      control: false
    },
    iconLeft: {
      table: {
        disable: true
      }
    },
    iconRight: {
      table: {
        disable: true
      }
    },
    changeLeftIcon: {
      table: {
        disable: true
      }
    },
    changeRightIcon: {
      table: {
        disable: true
      }
    }
  },
  render: (args) => {
    const { dismissible, ...rest } = args;
    const optionalProps = {
      ...(dismissible ? { onDismiss: () => undefined } : {})
    };

    return (
      <StoryPage>
        <StoryCard style={{ width: "fit-content" }}>
          <Badge {...rest} {...optionalProps} />
        </StoryCard>
      </StoryPage>
    );
  }
};

export default meta;

type Story = StoryObj<BadgeStoryArgs>;

export const Playground: Story = {};

export const FigmaMatrix: StoryObj = {
  render: () => <MatrixStory />
};

export const Sizes: StoryObj = {
  render: () => <SizesStory />
};

export const Configurations: StoryObj = {
  render: () => <ConfigurationsStory />
};

export const States: StoryObj = {
  render: () => <StateGallery />
};
