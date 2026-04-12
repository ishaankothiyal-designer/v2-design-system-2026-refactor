import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
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
import { createFigspecDesign } from "../storybookFigma";
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

function TypeMatrixStory({ type }: { type: BadgeType }) {
  return (
    <StoryPage>
      <StoryCard>
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
    </StoryPage>
  );
}

function createTypeStory(type: BadgeType): StoryObj {
  return {
    render: () => <TypeMatrixStory type={type} />,
    parameters: {
      controls: { disable: true },
      docs: {
        source: {
          code: badgeVariantsSourceCode
        }
      }
    }
  };
}

function TypeIndexStory() {
  return (
    <StoryPage>
      <div style={{ display: "grid", gap: 24 }}>
        {badgeTypes.map((type) => (
          <StoryCard key={type}>
            <div style={{ display: "grid", gap: 12 }}>
              <strong style={{ fontSize: 16 }}>{type}</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {badgePriorities.map((priority) => (
                  <Badge
                    key={`${type}-${priority}`}
                    type={type}
                    priority={priority}
                    size="Small"
                    pillShape="Yes"
                    labelText={`${priority}`}
                  />
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
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

function ConfigurationsStory({ brand = "Cars24" }: Pick<BadgeProps, "brand">) {
  const examples: Array<{ title: string; node: ReactNode }> = [
    {
      title: "Text only",
      node: (
        <Badge
          brand={brand}
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
      node: <Badge brand={brand} type="Success" priority="High" size="Small" labelText="Badge" />
    },
    {
      title: "Status badge",
      node: <Badge brand={brand} type="Warning" priority="Medium" size="Small" labelText="Action required" />
    },
    {
      title: "Dismissible",
      node: (
        <Badge
          brand={brand}
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
          brand={brand}
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
            brand={brand}
            title="Additional Insights"
            content="The Accordion badge slot now consumes the same canonical Badge API exposed in Storybook."
            badge={
              <Badge
                brand={brand}
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

const BADGE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=120-1830&t=1zgOyFpiLYMyM4XM-11";

const badgeVariantsSourceCode = `<StoryPage>
  <StoryCard>
    <Badge
      brand="Cars24"
      type="Neutral"
      priority="Medium"
      size="Extra Small"
      pillShape="No"
      labelText="Badge"
    />
  </StoryCard>
</StoryPage>`;

const badgeUiExampleSourceCode = `<Badge
  brand="Cars24"
  type="Information"
  priority="Medium"
  size="Small"
  pillShape="Yes"
  labelText="Dismiss me"
  onDismiss={() => undefined}
/>`;

const meta: Meta<BadgeStoryArgs> = {
  title: "Components/Badges/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BADGE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
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
      options: STORYBOOK_BRAND_OPTIONS
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

    return <Badge {...rest} {...optionalProps} />;
  }
};

export default meta;

type Story = StoryObj<BadgeStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Types: StoryObj = {
  render: () => <TypeIndexStory />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: badgeVariantsSourceCode
      }
    }
  }
};

export const DrivePink: StoryObj = createTypeStory("Drive pink");
export const Error: StoryObj = createTypeStory("Error");
export const Feature: StoryObj = createTypeStory("Feature");
export const Information: StoryObj = createTypeStory("Information");
export const Neutral: StoryObj = createTypeStory("Neutral");
export const SkySurge: StoryObj = createTypeStory("Sky surge");
export const Success: StoryObj = createTypeStory("Success");
export const Warning: StoryObj = createTypeStory("Warning");

export const Sizes: StoryObj = {
  render: () => <SizesStory />,
  parameters: {
    controls: { disable: true }
  }
};

export const States: StoryObj = {
  render: () => <StateGallery />,
  parameters: {
    controls: { disable: true }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <ConfigurationsStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: badgeUiExampleSourceCode
      }
    }
  }
};
