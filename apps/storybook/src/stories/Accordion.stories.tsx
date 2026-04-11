import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { Badge, Icon, Accordion, AccordionGroup, type AccordionProps } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type AccordionStoryArgs = AccordionProps & {
  badgeLabel?: string;
  showLeadingIcon?: boolean;
  content: string;
};

const sampleItems = [
  {
    id: "insights",
    title: "Additional Insights",
    content:
      "Accordions help manage space by letting users expand sections to view additional info. This keeps the layout tidy and improves user experience."
  },
  {
    id: "checks",
    title: "Review Checklist",
    supportingText: "Optional supporting context can stay visible while the panel is collapsed.",
    content:
      "Use the accordion when secondary details should be available on demand without competing with the primary layout."
  },
  {
    id: "summary",
    title: "Implementation Notes",
    content:
      "The component supports controlled and uncontrolled state, keyboard interaction, and single or multiple expansion groups."
  }
] as const;

function renderBadge(label?: string) {
  if (!label) {
    return undefined;
  }

  return (
    <Badge
      labelText={label}
      size="Extra Small"
      type="Neutral"
      priority="Low"
      pillShape="Yes"
      showLeadingIcon={false}
      showTrailingIcon={false}
    />
  );
}

function renderAccordion(args: AccordionStoryArgs) {
  const { badgeLabel, showLeadingIcon, ...accordionProps } = args;

  return (
    <div style={{ width: 328 }}>
      <Accordion
        {...accordionProps}
        badge={renderBadge(badgeLabel)}
        leadingIcon={showLeadingIcon === false ? false : undefined}
      />
    </div>
  );
}

function OverviewGrid() {
  return (
    <StoryPage>
      <header style={{ display: "grid", gap: 12, maxWidth: 720 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Accordion</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "#64748B" }}>
          Canonical accordion implementation translated directly from the provided Figma component.
        </p>
      </header>

      <div style={comparisonGridStyles}>
        <StoryCard>
          <Column
            title="Small / Rest"
            items={[
              <Accordion
                key="small-collapsed"
                title="Additional Insights"
                content={sampleItems[0].content}
              />,
              <Accordion
                key="small-expanded"
                title="Additional Insights"
                content="With an accordion, users can click to expand or collapse content areas, making it simple to access details without overwhelming the screen."
                expanded
              />
            ]}
          />
        </StoryCard>

        <StoryCard>
          <Column
            title="Large / Rest"
            items={[
              <Accordion
                key="large-collapsed"
                size="lg"
                title="Additional Insights"
                content={sampleItems[0].content}
              />,
              <Accordion
                key="large-expanded"
                size="lg"
                title="Additional Insights"
                content="Accordions help manage space by letting users expand sections to view additional info. This keeps the layout tidy and improves user experience."
                expanded
              />
            ]}
          />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

function Column({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <strong style={{ fontSize: 14 }}>{title}</strong>
      <div style={{ display: "grid", gap: 16 }}>
        {items.map((item, index) => (
          <div key={index} style={{ width: 328 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const comparisonGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))"
};

const meta: Meta<AccordionStoryArgs> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    title: "Additional Insights",
    supportingText: "",
    content:
      "Accordions help manage space by letting users expand sections to view additional info. This keeps the layout tidy and improves user experience.",
    size: "sm",
    defaultExpanded: false,
    disabled: false,
    showLeadingIcon: true,
    badgeLabel: ""
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: ["sm", "lg"]
    },
    forceState: {
      control: "select",
      options: ["hover", "focus", "active"]
    },
    badgeLabel: {
      control: "text"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    badge: {
      control: false
    },
    leadingIcon: {
      control: false
    },
    children: {
      control: false
    },
    onExpandedChange: {
      action: "expanded changed"
    }
  },
  render: renderAccordion
};

export default meta;

type Story = StoryObj<AccordionStoryArgs>;

export const Playground: Story = {};

export const FigmaReference: StoryObj = {
  render: () => <OverviewGrid />
};

export const States: StoryObj = {
  render: () => (
    <StoryPage>
      <div style={comparisonGridStyles}>
        <StoryCard>
          <Column
            title="Collapsed"
            items={[
              <Accordion key="default" title="Default" content={sampleItems[0].content} />,
              <Accordion key="hover" title="Hover" content={sampleItems[0].content} forceState="hover" />,
              <Accordion key="focus" title="Focus" content={sampleItems[0].content} forceState="focus" />,
              <Accordion key="active" title="Active" content={sampleItems[0].content} forceState="active" />,
              <Accordion key="disabled" title="Disabled" content={sampleItems[0].content} disabled />
            ]}
          />
        </StoryCard>

        <StoryCard>
          <Column
            title="Expanded"
            items={[
              <Accordion key="expanded-default" title="Default" content={sampleItems[0].content} expanded />,
              <Accordion
                key="expanded-hover"
                title="Hover"
                content={sampleItems[0].content}
                expanded
                forceState="hover"
              />,
              <Accordion
                key="expanded-focus"
                title="Focus"
                content={sampleItems[0].content}
                expanded
                forceState="focus"
              />,
              <Accordion
                key="expanded-active"
                title="Active"
                content={sampleItems[0].content}
                expanded
                forceState="active"
              />,
              <Accordion
                key="expanded-disabled"
                title="Disabled"
                content={sampleItems[0].content}
                expanded
                disabled
              />
            ]}
          />
        </StoryCard>
      </div>
    </StoryPage>
  )
};

export const SizesAndConfigurations: StoryObj = {
  render: () => (
    <StoryPage>
      <div style={comparisonGridStyles}>
        <StoryCard>
          <Column
            title="Small"
            items={[
              <Accordion key="small-default" title="Additional Insights" content={sampleItems[0].content} />,
              <Accordion
                key="small-supporting"
                title="Additional Insights"
                supportingText="Optional supporting text stays visible in the header."
                content={sampleItems[0].content}
                expanded
              />,
              <Accordion
                key="small-badge"
                title="Additional Insights"
                content={sampleItems[0].content}
                badge={
                  <Badge
                    labelText="New"
                    size="Extra Small"
                    type="Neutral"
                    priority="Low"
                    pillShape="Yes"
                    showLeadingIcon={false}
                    showTrailingIcon={false}
                  />
                }
              />,
              <Accordion
                key="small-no-icon"
                title="Additional Insights"
                content={sampleItems[0].content}
                leadingIcon={false}
              />
            ]}
          />
        </StoryCard>

        <StoryCard>
          <Column
            title="Large"
            items={[
              <Accordion key="large-default" size="lg" title="Additional Insights" content={sampleItems[0].content} />,
              <Accordion
                key="large-supporting"
                size="lg"
                title="Additional Insights"
                supportingText="Optional supporting text stays visible in the header."
                content={sampleItems[0].content}
                expanded
              />,
              <Accordion
                key="large-badge"
                size="lg"
                title="Additional Insights"
                content={sampleItems[0].content}
                badge={
                  <Badge
                    labelText="Beta"
                    size="Extra Small"
                    type="Neutral"
                    priority="Low"
                    pillShape="Yes"
                    showLeadingIcon={false}
                    showTrailingIcon={false}
                  />
                }
              />,
              <Accordion
                key="large-custom-icon"
                size="lg"
                title="Additional Insights"
                content={sampleItems[0].content}
                leadingIcon={<Icon name="sparkle-line" decorative style={{ fontSize: 20, color: "#020617" }} />}
              />
            ]}
          />
        </StoryCard>
      </div>
    </StoryPage>
  )
};

export const SingleExpandGroup: StoryObj = {
  render: () => (
    <StoryPage>
      <StoryCard style={{ width: 360 }}>
        <AccordionGroup items={sampleItems.map((item) => ({ ...item, size: "sm" as const }))} />
      </StoryCard>
    </StoryPage>
  )
};

export const MultipleExpandGroup: StoryObj = {
  render: () => (
    <StoryPage>
      <StoryCard style={{ width: 360 }}>
        <AccordionGroup
          selectionMode="multiple"
          defaultExpandedIds={["insights"]}
          items={sampleItems.map((item) => ({ ...item, size: "sm" as const }))}
        />
      </StoryCard>
    </StoryPage>
  )
};
