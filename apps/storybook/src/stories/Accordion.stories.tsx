import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import { Badge, Icon, Accordion, SectionHeader, type AccordionProps } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type AccordionStoryArgs = AccordionProps & {
  badgeLabel?: string;
  showLeadingIcon?: boolean;
  content: string;
};

type AccordionBrand = NonNullable<AccordionProps["brand"]>;

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

const cars24FaqItems = [
  {
    id: "inspection",
    title: "How does the Cars24 car inspection work?",
    content:
      "Cars24 schedules a doorstep or hub inspection to verify the vehicle condition, documents, and service history. The inspection summary is then used to guide pricing and the next selling step."
  },
  {
    id: "documents",
    title: "Which documents should I keep ready before selling?",
    content:
      "Keep the RC, insurance copy, valid ID proof, pollution certificate, and service records ready. Having these documents handy helps the evaluation and ownership transfer process move faster."
  },
  {
    id: "payment",
    title: "When will I receive the payment after the sale is confirmed?",
    content:
      "Once the final offer is accepted and required checks are completed, the payout is usually initiated quickly through the registered bank account details shared during the process."
  },
  {
    id: "loan",
    title: "Can I sell my car if there is an active loan on it?",
    content:
      "Yes. Cars24 can guide you through the loan closure and NOC process. The outstanding amount and lender paperwork are reviewed before finalizing the transaction."
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
    <div style={{ width: "100%" }}>
      <Accordion
        {...accordionProps}
        badge={renderBadge(badgeLabel)}
        leadingIcon={showLeadingIcon === false ? false : undefined}
      />
    </div>
  );
}

function OverviewGrid({ brand }: { brand: AccordionBrand }) {
  return (
    <StoryPage>
      <div style={comparisonGridStyles}>
        <StoryCard>
          <Column
            title="Small / Rest"
            items={[
              <Accordion
                key="small-collapsed"
                brand={brand}
                title="Additional Insights"
                content={sampleItems[0].content}
              />,
              <Accordion
                key="small-expanded"
                brand={brand}
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
                brand={brand}
                size="lg"
                title="Additional Insights"
                content={sampleItems[0].content}
              />,
              <Accordion
                key="large-expanded"
                brand={brand}
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
          <div key={index} style={{ width: "100%" }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildAccordionKey({
  brand,
  title,
  supportingText,
  content,
  size,
  disabled,
  defaultExpanded,
  forceState,
  badgeLabel,
  showLeadingIcon
}: AccordionStoryArgs) {
  return JSON.stringify({
    brand,
    title,
    supportingText,
    content: typeof content === "string" ? content : "content",
    size,
    disabled,
    defaultExpanded,
    forceState,
    badgeLabel,
    showLeadingIcon
  });
}

function FaqStory(args: AccordionStoryArgs) {
  const {
    brand = "Cars24",
    title,
    supportingText,
    content,
    size = "sm",
    disabled = false,
    defaultExpanded = false,
    forceState,
    onExpandedChange,
    badgeLabel,
    showLeadingIcon = true
  } = args;

  const sharedAccordionProps = {
    brand,
    size,
    disabled,
    ...(forceState ? { forceState } : {}),
    ...(badgeLabel ? { badge: renderBadge(badgeLabel) } : {}),
    ...(showLeadingIcon === false ? { leadingIcon: false as const } : {})
  } satisfies Partial<AccordionProps>;

  const storyKey = buildAccordionKey(args);

  return (
    <StoryPage>
      <div style={faqShellStyles}>
        <SectionHeader
          brand={brand}
          title="Frequently asked questions"
          subtitle=""
          description=""
          showTag={false}
          showAction={false}
        />

        <div style={faqListStyles}>
          <div style={faqAccordionListStyles}>
            <Accordion
              key={`${storyKey}-primary`}
              {...sharedAccordionProps}
              title={title}
              {...(supportingText ? { supportingText } : {})}
              content={content}
              defaultExpanded={defaultExpanded}
              {...(onExpandedChange ? { onExpandedChange } : {})}
            />

            {cars24FaqItems.slice(1).map((item) => (
              <Accordion
                key={`${storyKey}-${item.id}`}
                {...sharedAccordionProps}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
        </div>
      </div>
    </StoryPage>
  );
}

const comparisonGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  justifyContent: "center"
};

const faqShellStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  maxWidth: 760,
  margin: "0 auto",
  padding: 24
};

const faqListStyles: CSSProperties = {
  width: "100%"
};

const faqAccordionListStyles: CSSProperties = {
  display: "grid",
  gap: 24
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

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => (
    <>
      <OverviewGrid brand={brand} />
      <StoryPage>
        <div style={comparisonGridStyles}>
          <StoryCard>
            <Column
              title="Collapsed"
              items={[
                <Accordion key="default" brand={brand} title="Default" content={sampleItems[0].content} />,
                <Accordion key="hover" brand={brand} title="Hover" content={sampleItems[0].content} forceState="hover" />,
                <Accordion key="focus" brand={brand} title="Focus" content={sampleItems[0].content} forceState="focus" />,
                <Accordion key="active" brand={brand} title="Active" content={sampleItems[0].content} forceState="active" />,
                <Accordion key="disabled" brand={brand} title="Disabled" content={sampleItems[0].content} disabled />
              ]}
            />
          </StoryCard>

          <StoryCard>
            <Column
              title="Expanded"
              items={[
                <Accordion key="expanded-default" brand={brand} title="Default" content={sampleItems[0].content} expanded />,
                <Accordion
                  key="expanded-hover"
                  brand={brand}
                  title="Hover"
                  content={sampleItems[0].content}
                  expanded
                  forceState="hover"
                />,
                <Accordion
                  key="expanded-focus"
                  brand={brand}
                  title="Focus"
                  content={sampleItems[0].content}
                  expanded
                  forceState="focus"
                />,
                <Accordion
                  key="expanded-active"
                  brand={brand}
                  title="Active"
                  content={sampleItems[0].content}
                  expanded
                  forceState="active"
                />,
                <Accordion
                  key="expanded-disabled"
                  brand={brand}
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
    </>
  ),
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const UsageGuidelines: Story = {
  render: ({ brand = "Cars24" }) => (
    <StoryPage>
      <div style={comparisonGridStyles}>
        <StoryCard>
          <Column
            title="Small"
            items={[
              <Accordion key="small-default" brand={brand} title="Additional Insights" content={sampleItems[0].content} />,
              <Accordion
                key="small-supporting"
                brand={brand}
                title="Additional Insights"
                supportingText="Optional supporting text stays visible in the header."
                content={sampleItems[0].content}
                expanded
              />,
              <Accordion
                key="small-badge"
                brand={brand}
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
                brand={brand}
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
              <Accordion
                key="large-default"
                brand={brand}
                size="lg"
                title="Additional Insights"
                content={sampleItems[0].content}
              />,
              <Accordion
                key="large-supporting"
                brand={brand}
                size="lg"
                title="Additional Insights"
                supportingText="Optional supporting text stays visible in the header."
                content={sampleItems[0].content}
                expanded
              />,
              <Accordion
                key="large-badge"
                brand={brand}
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
                brand={brand}
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
  ),
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const UIExample: Story = {
  render: (args) => <FaqStory {...args} />
};
