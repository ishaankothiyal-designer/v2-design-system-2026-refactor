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

function matrixBadge(
  brand: NonNullable<BadgeProps["brand"]>,
  type: BadgeType,
  priority: BadgePriority,
  size: BadgeSize,
  pillShape: BadgePillShape
) {
  return (
    <Badge
      brand={brand}
      key={`${type}-${priority}-${size}-${pillShape}`}
      type={type}
      priority={priority}
      size={size}
      pillShape={pillShape}
      labelText="Badge"
    />
  );
}

function TypeMatrixStory({
  brand = "Cars24",
  type
}: {
  brand?: NonNullable<BadgeProps["brand"]>;
  type: BadgeType;
}) {
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
                  {badgeSizes.map((size) => matrixBadge(brand, type, priority, size, "No"))}
                  {badgeSizes.map((size) => matrixBadge(brand, type, priority, size, "Yes"))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function createTypeStory(type: BadgeType): StoryObj<BadgeStoryArgs> {
  return {
    render: ({ brand = "Cars24" }) => <TypeMatrixStory brand={brand} type={type} />,
    parameters: {
      controls: { include: ["brand"] },
      docs: {
        source: {
          code: badgeVariantsSourceCode
        }
      }
    }
  };
}

function TypeIndexStory({ brand = "Cars24" }: Pick<BadgeProps, "brand">) {
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
                    brand={brand}
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

function StateGallery({ brand = "Cars24" }: Pick<BadgeProps, "brand">) {
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
                  brand={brand}
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

function SizesStory({ brand = "Cars24" }: Pick<BadgeProps, "brand">) {
  return (
    <StoryPage>
      <div style={configGridStyles}>
        {badgeSizes.map((size) => (
          <StoryCard key={size}>
            <div style={{ display: "grid", gap: 12 }}>
              <strong>{size}</strong>
              <Badge brand={brand} type="Drive pink" priority="High" size={size} labelText="Badge" />
              <Badge brand={brand} type="Neutral" priority="Medium" size={size} pillShape="Yes" labelText="Badge" />
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

export const Types: Story = {
  render: ({ brand = "Cars24" }) => <TypeIndexStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: badgeVariantsSourceCode
      }
    }
  }
};

export const DrivePink: Story = createTypeStory("Drive pink");
export const Error: Story = createTypeStory("Error");
export const Feature: Story = createTypeStory("Feature");
export const Information: Story = createTypeStory("Information");
export const Neutral: Story = createTypeStory("Neutral");
export const SkySurge: Story = createTypeStory("Sky surge");
export const Success: Story = createTypeStory("Success");
export const Warning: Story = createTypeStory("Warning");

export const Sizes: Story = {
  render: ({ brand = "Cars24" }) => <SizesStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const States: Story = {
  render: ({ brand = "Cars24" }) => <StateGallery brand={brand} />,
  parameters: {
    controls: { include: ["brand"] }
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
