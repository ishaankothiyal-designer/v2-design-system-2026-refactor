import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { designSystemRegistry } from "@geist/contracts";
import {
  Accordion,
  BackToTopButton,
  Badge,
  Banner,
  Button,
  Divider,
  Icon,
  LinkButton,
  SectionHeader,
  Text
} from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

type Measurement = {
  width: string;
  height: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  gap: string;
  borderRadius: string;
  backgroundColor: string;
  color: string;
  fontSize: string;
  lineHeight: string;
};

function useMeasurements(targetRef: React.RefObject<HTMLDivElement | null>) {
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    const surface = targetRef.current;
    if (!surface) {
      return;
    }

    const getTarget = () => (surface.firstElementChild as HTMLElement | null) ?? surface;

    const measure = () => {
      const node = getTarget();
      const styles = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();

      setMeasurement({
        width: `${Math.round(rect.width)}px`,
        height: `${Math.round(rect.height)}px`,
        paddingTop: styles.paddingTop,
        paddingRight: styles.paddingRight,
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,
        gap: styles.gap || "0px",
        borderRadius: styles.borderRadius,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(getTarget());

    return () => observer.disconnect();
  }, [targetRef]);

  return measurement;
}

function manualBindings(
  bindings: Array<{ slot: string; token: string }>
): Array<{ slot: string; token: string }> {
  return bindings;
}

const inspectItems = [
  {
    title: "Button",
    preview: (
      <Button
        styleVariant="Solid"
        size="Medium"
        shape="Regular"
        leadingIcon={<Icon name="sparkle-filled" decorative />}
        trailingIcon={<Icon name="chevron-small-right-filled" decorative />}
      >
        Label
      </Button>
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.button")
        ?.tokenBindings ?? []
  },
  {
    title: "Back To Top Button",
    preview: <BackToTopButton>Go to top</BackToTopButton>,
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.backToTopButton")
        ?.tokenBindings ?? []
  },
  {
    title: "Badge",
    preview: (
      <Badge
        labelText="Badge"
        size="Small"
        type="Information"
        priority="Medium"
        pillShape="Yes"
      />
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.badge")
        ?.tokenBindings ?? []
  },
  {
    title: "Link Button",
    preview: (
      <LinkButton
        tone="Brand"
        size="Medium"
        leadingIcon={<Icon name="sparkle-filled" decorative />}
        trailingIcon={<Icon name="arrow-right-outline" decorative />}
      >
        Label
      </LinkButton>
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.linkButton")
        ?.tokenBindings ?? []
  },
  {
    title: "Accordion",
    preview: (
      <div style={{ width: 328 }}>
        <Accordion
          title="Additional Insights"
          content="Accordions help manage space by letting users expand sections to view additional info."
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
        />
      </div>
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.accordion")
        ?.tokenBindings ?? []
  },
  {
    title: "Banner",
    preview: (
      <Banner
        theme="Light"
        state="Warning"
        heading
        icon
        action
        actionType="Text button"
        title="New Message Alert"
        description="New message received!"
        actionLabel="Label"
      />
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.banner")
        ?.tokenBindings ?? []
  },
  {
    title: "Section Header",
    preview: (
      <SectionHeader
        title="Section title"
        subtitle="Section title line 2"
        description="Description goes here upto 2 lines"
        tagLabel="New"
        actionLabel="View all"
      />
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.sectionHeader")
        ?.tokenBindings ?? []
  },
  {
    title: "Divider",
    preview: (
      <Divider
        labelPosition="Center"
        thickness="Regular"
        lineStyle="Plain"
        label="Continue"
        leadingIcon={<Icon name="sparkle-filled" decorative />}
        trailingIcon={<Icon name="sparkle-filled" decorative />}
      />
    ),
    bindings:
      designSystemRegistry.components.find((component) => component.canonicalId === "component.divider")
        ?.tokenBindings ?? []
  },
  {
    title: "Text",
    preview: (
      <Text tone="secondary" size="lg" as="p">
        Inspect text rendering
      </Text>
    ),
    bindings: manualBindings([
      { slot: "content.color.primary", token: "color.text.primary" },
      { slot: "content.color.secondary", token: "color.text.secondary" },
      { slot: "content.color.muted", token: "color.text.muted" },
      { slot: "content.color.inverse", token: "color.text.inverse" },
      { slot: "typography.fontFamily", token: "typography.fontFamily.sans" },
      { slot: "typography.fontWeight.default", token: "typography.fontWeight.regular" },
      { slot: "typography.fontWeight.strong", token: "typography.fontWeight.semibold" },
      { slot: "typography.fontSize.xs", token: "typography.fontSize.xs" },
      { slot: "typography.fontSize.sm", token: "typography.fontSize.sm" },
      { slot: "typography.fontSize.md", token: "typography.fontSize.md" },
      { slot: "typography.fontSize.lg", token: "typography.fontSize.lg" },
      { slot: "typography.fontSize.xl", token: "typography.fontSize.xl" },
      { slot: "typography.lineHeight.xs", token: "typography.lineHeight.xs" },
      { slot: "typography.lineHeight.sm", token: "typography.lineHeight.sm" },
      { slot: "typography.lineHeight.md", token: "typography.lineHeight.md" },
      { slot: "typography.lineHeight.lg", token: "typography.lineHeight.lg" },
      { slot: "typography.lineHeight.xl", token: "typography.lineHeight.xl" }
    ])
  },
  {
    title: "Icon",
    preview: <Icon name="calendar-line" size="md" tone="primary" decorative />,
    bindings: manualBindings([
      { slot: "icon.size.sm", token: "icon.size.sm" },
      { slot: "icon.size.md", token: "icon.size.md" },
      { slot: "icon.size.lg", token: "icon.size.lg" },
      { slot: "icon.color.primary", token: "color.text.primary" },
      { slot: "icon.color.secondary", token: "color.text.secondary" },
      { slot: "icon.color.muted", token: "color.text.muted" },
      { slot: "icon.color.inverse", token: "color.text.inverse" }
    ])
  }
] as const;

function InfoTable({ measurement }: { measurement: Measurement | null }) {
  const rows = measurement
    ? [
        ["Width", measurement.width],
        ["Height", measurement.height],
        ["Padding Top", measurement.paddingTop],
        ["Padding Right", measurement.paddingRight],
        ["Padding Bottom", measurement.paddingBottom],
        ["Padding Left", measurement.paddingLeft],
        ["Gap", measurement.gap],
        ["Border Radius", measurement.borderRadius],
        ["Background", measurement.backgroundColor],
        ["Color", measurement.color],
        ["Font Size", measurement.fontSize],
        ["Line Height", measurement.lineHeight]
      ]
    : [];

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td style={metricLabelStyles}>{label}</td>
            <td style={metricValueStyles}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TokenTable({ bindings }: { bindings: Array<{ slot: string; token: string }> }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={tableHeadStyles}>Slot</th>
            <th style={tableHeadStyles}>Token</th>
          </tr>
        </thead>
        <tbody>
          {bindings.map((binding) => (
            <tr key={`${binding.slot}-${binding.token}`}>
              <td style={tableCellStyles}>{binding.slot}</td>
              <td style={tableCellStyles}>
                <code>{binding.token}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InspectCard({
  title,
  preview,
  bindings
}: {
  title: string;
  preview: ReactNode;
  bindings: Array<{ slot: string; token: string }>;
}) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const measurement = useMeasurements(previewRef);
  const groupedBindings = useMemo(() => bindings, [bindings]);

  return (
    <StoryCard>
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: "#64748B" }}>
            Inspect live box model values from the rendered component root.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 14 }}>Preview</strong>
          <div
            ref={previewRef}
            style={{
              display: "grid",
              justifyItems: "start",
              gap: 12,
              padding: 16,
              borderRadius: 12,
              border: "1px dashed rgba(16, 24, 40, 0.18)",
              background: "#F8FAFC"
            }}
          >
            {preview}
          </div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 14 }}>Inspect Metrics</strong>
          <InfoTable measurement={measurement} />
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 14 }}>Token Usage</strong>
          <TokenTable bindings={groupedBindings} />
        </div>
      </div>
    </StoryCard>
  );
}

function ComponentInspectMode() {
  return (
    <StoryPage>
      <header style={{ display: "grid", gap: 12, maxWidth: 880 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Inspect Mode</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "#64748B" }}>
          Live inspect panels for the canonical components. Each card shows rendered dimensions, padding, gap, radius, and linked token usage.
        </p>
      </header>

      <div style={{ display: "grid", gap: 24 }}>
        {inspectItems.map((item) => (
          <InspectCard
            key={item.title}
            title={item.title}
            preview={item.preview}
            bindings={[...item.bindings]}
          />
        ))}
      </div>
    </StoryPage>
  );
}

const tableHeadStyles: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid rgba(16, 24, 40, 0.08)",
  fontSize: 12,
  color: "#64748B",
  background: "#F8FAFC"
};

const tableCellStyles: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(16, 24, 40, 0.06)",
  verticalAlign: "top"
};

const metricLabelStyles: CSSProperties = {
  width: "32%",
  padding: "8px 12px",
  borderBottom: "1px solid rgba(16, 24, 40, 0.06)",
  color: "#64748B",
  verticalAlign: "top"
};

const metricValueStyles: CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid rgba(16, 24, 40, 0.06)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
};

const meta: Meta<typeof ComponentInspectMode> = {
  title: "Components/Inspect Mode",
  component: ComponentInspectMode,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof ComponentInspectMode>;

export const Overview: Story = {};
