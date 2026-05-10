import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@turbo/tokens";
import { Badge, Icon, Accordion, SectionHeader, Text, type AccordionProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
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

const accordionSizes = [
  { key: "sm", label: "Small", size: "sm" as const },
  { key: "lg", label: "Large", size: "lg" as const }
] as const;

const accordionConnectedCopy = {
  sm: "With an accordion, users can click to expand or collapse content areas, making it simple to access details without overwhelming the screen.",
  lg: "Accordions help manage space by letting users expand sections to view additional info. This keeps the layout tidy and improves user experience."
} as const;

const ACCORDION_FIGMA_URL =
  "https://www.figma.com/design/skMLeeIF8mbzAT265CI8nP/-TEST--Design-Language-System--DLS-v2.0-2026-?node-id=77-2187&t=mYprHpRuZtMoNQg1-11";

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

const doGuidelines = [
  {
    id: "clear-labels",
    title: "Keep labels concise and action-oriented",
    description: "Short trigger labels help users scan quickly and decide whether the hidden content is relevant.",
    preview: {
      title: "Inspection checklist",
      content: "Review inspection steps, documents, and expected timelines before booking your appointment."
    }
  },
  {
    id: "supporting-context",
    title: "Use supporting text only when it adds context",
    description: "Supporting text should clarify the section, not repeat the title. Use it for secondary details only.",
    preview: {
      title: "Loan closure support",
      supportingText: "See how payout and lender paperwork are coordinated.",
      content: "Cars24 can help close the active loan, collect the NOC, and align lender approval before ownership transfer."
    }
  },
  {
    id: "default-open",
    title: "Open the most important panel by default",
    description: "When one answer matters most, starting with it expanded reduces friction for first-time users.",
    preview: {
      title: "Payment timeline",
      content: "Payout is initiated once inspection, offer acceptance, and document checks are completed."
    }
  },
  {
    id: "status-badge",
    title: "Use badges sparingly to highlight fresh updates",
    description: "A lightweight badge can call attention to new or beta information without overwhelming the header.",
    preview: {
      title: "RC transfer status",
      content: "Track the latest ownership-transfer update and the remaining verification steps.",
      badgeLabel: "New"
    }
  }
] as const;

const dontGuidelines = [
  {
    id: "long-labels",
    title: "Don't use long labels that are hard to scan",
    description: "If the trigger reads like a paragraph, users cannot quickly understand what is inside the section.",
    preview: {
      title: "Everything you should know before booking an inspection and sending ownership documents for review",
      content: "Long trigger copy makes the list feel heavy and slows down comprehension."
    }
  },
  {
    id: "critical-hidden",
    title: "Don't hide always-needed information in collapsed panels",
    description: "If users need the information every time, keep it visible in the layout instead of locking it behind disclosure.",
    preview: {
      title: "Daily support hotline",
      content: "Essential contact details should stay visible on the page, not be hidden behind an accordion."
    }
  },
  {
    id: "missing-affordance",
    title: "Don't remove the leading affordance without a clear reason",
    description: "Consistent icon treatment improves recognition and keeps the list visually aligned.",
    preview: {
      title: "Seller eligibility",
      content: "Inconsistent headers reduce scanability across a group of related accordion items.",
      showLeadingIcon: false
    }
  },
  {
    id: "disabled-without-context",
    title: "Don't disable items without explaining what changed",
    description: "If a panel is unavailable, pair that state with adjacent guidance so users know how to proceed.",
    preview: {
      title: "Inspection reschedule",
      content: "Disabled items should include nearby explanation instead of silently blocking the user."
    }
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

function AccordionDocsHeading({ brand, label }: { brand: AccordionBrand; label: string }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function AccordionStateDocument({
  brand,
  forceState,
  disabled = false
}: {
  brand: AccordionBrand;
  forceState?: AccordionProps["forceState"];
  disabled?: boolean;
}) {
  return (
    <StoryPage>
      <StoryCard>
        <StoryMatrix columns="180px repeat(2, minmax(280px, 1fr))">
          <StoryMatrixCornerCell />
          <StoryMatrixHeaderCell>
            <AccordionDocsHeading brand={brand} label="Collapsed" />
          </StoryMatrixHeaderCell>
          <StoryMatrixHeaderCell>
            <AccordionDocsHeading brand={brand} label="Expanded" />
          </StoryMatrixHeaderCell>

          {accordionSizes.flatMap((row) => [
            <StoryMatrixRowLabelCell key={`${row.key}-label`} minHeight={152}>
              <AccordionDocsHeading brand={brand} label={row.label} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`${row.key}-collapsed`} minHeight={152}>
              <Accordion
                brand={brand}
                size={row.size}
                title="Additional Insights"
                content={accordionConnectedCopy[row.size]}
                disabled={disabled}
                {...(forceState ? { forceState } : {})}
              />
            </StoryMatrixValueCell>,
            <StoryMatrixValueCell key={`${row.key}-expanded`} minHeight={152}>
              <Accordion
                brand={brand}
                size={row.size}
                title="Additional Insights"
                content={accordionConnectedCopy[row.size]}
                expanded
                disabled={disabled}
                {...(forceState ? { forceState } : {})}
              />
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function Column({ brand, title, items }: { brand: AccordionBrand; title: string; items: ReactNode[] }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Text brand={brand} as="strong" size="sm" tone="secondary">
        {title}
      </Text>
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

function GuidelineExample({
  brand,
  preview,
  forceExpanded = false,
  disabled = false
}: {
  brand: AccordionBrand;
  preview: {
    title: string;
    content: string;
    supportingText?: string;
    badgeLabel?: string;
    showLeadingIcon?: boolean;
  };
  forceExpanded?: boolean;
  disabled?: boolean;
}) {
  return (
    <div style={guidelinePreviewFrameStyles}>
      <Accordion
        brand={brand}
        size="lg"
        title={preview.title}
        content={preview.content}
        expanded={forceExpanded}
        disabled={disabled}
        {...(preview.supportingText ? { supportingText: preview.supportingText } : {})}
        {...(preview.badgeLabel ? { badge: renderBadge(preview.badgeLabel) } : {})}
        {...(preview.showLeadingIcon === false ? { leadingIcon: false as const } : {})}
      />
    </div>
  );
}

function GuidanceColumn({
  brand,
  tone,
  title,
  items
}: {
  brand: AccordionBrand;
  tone: "do" | "dont";
  title: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    preview: {
      title: string;
      content: string;
      supportingText?: string;
      badgeLabel?: string;
      showLeadingIcon?: boolean;
    };
  }>;
}) {
  const toneStyles = tone === "do" ? doToneStyles : dontToneStyles;
  const iconName = tone === "do" ? "check-outline" : "close-line";

  return (
    <div style={guidanceColumnStyles}>
      <div style={guidanceHeaderStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ ...guidanceIconWrapStyles, ...toneStyles.iconWrap }}>
            <Icon name={iconName} decorative style={toneStyles.icon} />
          </div>
          <Text brand={brand} as="strong" size="lg">
            {title}
          </Text>
        </div>
      </div>

      <div style={guidanceItemsStyles}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              ...guidanceItemStyles,
              ...toneStyles.item
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <Text brand={brand} as="strong" size="md" style={guidanceItemTitleStyles}>
                  {item.title}
                </Text>
                <Text brand={brand} as="p" size="sm" tone="secondary" style={guidanceItemDescriptionStyles}>
                  {item.description}
                </Text>
              </div>
              <GuidelineExample
                brand={brand}
                preview={item.preview}
                forceExpanded={tone === "do" && (item.id === "supporting-context" || item.id === "default-open")}
                disabled={tone === "dont" && item.id === "disabled-without-context"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
          showSubtitle={false}
          showDescription={false}
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
    layout: "fullscreen",
    design: createFigspecDesign(ACCORDION_FIGMA_URL)
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

function getAccordionStateSourceCode({
  forceState,
  disabled = false
}: {
  forceState?: AccordionProps["forceState"];
  disabled?: boolean;
}) {
  const stateProps = disabled
    ? " disabled"
    : forceState
      ? ` forceState="${forceState}"`
      : "";

  return `<Accordion size="sm" title="Additional Insights" content="..."${stateProps} />
<Accordion size="sm" title="Additional Insights" content="..." expanded${stateProps} />
<Accordion size="lg" title="Additional Insights" content="..."${stateProps} />
<Accordion size="lg" title="Additional Insights" content="..." expanded${stateProps} />`;
}

const accordionUiExampleSourceCode = `<SectionHeader
  title="Frequently asked questions"
  showSubtitle={false}
  showDescription={false}
  showTag={false}
  showAction={false}
/>

<Accordion title="How does the car inspection work?" content="..." expanded />
<Accordion title="Which documents should I keep ready before selling?" content="..." />
<Accordion title="When will I receive the payment?" content="..." />`;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Default: Story = {
  render: ({ brand = "Cars24" }) => <AccordionStateDocument brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: getAccordionStateSourceCode({}) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => <AccordionStateDocument brand={brand} forceState="hover" />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: getAccordionStateSourceCode({ forceState: "hover" }) } }
  }
};

export const Focus: Story = {
  render: ({ brand = "Cars24" }) => <AccordionStateDocument brand={brand} forceState="focus" />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: getAccordionStateSourceCode({ forceState: "focus" }) } }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => <AccordionStateDocument brand={brand} disabled />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: getAccordionStateSourceCode({ disabled: true }) } }
  }
};

const guidanceSectionStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto"
};

const guidanceIntroStyles: CSSProperties = {
  margin: 0,
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 16,
  lineHeight: "24px"
};

const guidanceGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  alignItems: "start"
};

const guidanceColumnStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: coreTokenCatalog.radius.xl,
  background: String(coreTokenCatalog.color.surface.canvas),
  padding: coreTokenCatalog.spacing["6"]
};

const guidanceHeaderStyles: CSSProperties = {
  display: "flex",
  alignItems: "center"
};

const guidanceItemsStyles: CSSProperties = {
  display: "grid",
  gap: 16
};

const guidanceItemStyles: CSSProperties = {
  padding: coreTokenCatalog.spacing["5"],
  borderRadius: coreTokenCatalog.radius.lg,
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
  background: String(coreTokenCatalog.color.surface.subtle)
};

const guidanceItemTitleStyles: CSSProperties = {
  display: "block"
};

const guidanceItemDescriptionStyles: CSSProperties = {
  margin: 0,
  display: "block"
};

const guidanceIconWrapStyles: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: coreTokenCatalog.radius.pill,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`
};

const guidelinePreviewFrameStyles: CSSProperties = {
  padding: coreTokenCatalog.spacing["2"],
  borderRadius: coreTokenCatalog.radius.lg,
  background: String(coreTokenCatalog.color.surface.canvas),
  border: `1px solid ${String(coreTokenCatalog.color.border.default)}`
};

const doToneStyles = {
  iconWrap: {
    background: String(coreTokenCatalog.color.surface.subtle)
  } satisfies CSSProperties,
  icon: {
    fontSize: 16,
    color: String(coreTokenCatalog.color.status.success)
  } satisfies CSSProperties,
  item: {
    boxShadow: `inset 3px 0 0 ${String(coreTokenCatalog.color.status.success)}`
  } satisfies CSSProperties
};

const dontToneStyles = {
  iconWrap: {
    background: String(coreTokenCatalog.color.surface.subtle)
  } satisfies CSSProperties,
  icon: {
    fontSize: 16,
    color: String(coreTokenCatalog.color.status.danger)
  } satisfies CSSProperties,
  item: {
    boxShadow: `inset 3px 0 0 ${String(coreTokenCatalog.color.status.danger)}`
  } satisfies CSSProperties
};

export const UIExample: Story = {
  render: (args) => <FaqStory {...args} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: { source: { code: accordionUiExampleSourceCode } }
  }
};
