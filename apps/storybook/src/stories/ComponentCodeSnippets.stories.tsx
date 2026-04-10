import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { designSystemRegistry } from "@geist/contracts";
import { Accordion, Badge, Banner, Button, Icon } from "@geist/web";
import { StoryCard, StoryPage } from "../storybook-shell";

const componentCards = [
  {
    canonicalId: "component.button",
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
    snippet: `import { Button } from "@geist/web";

export function Example() {
  return (
    <Button
      styleVariant="Solid"
      size="Medium"
      shape="Regular"
      onDark={false}
      leadingIcon="sparkle-filled"
      trailingIcon="chevron-small-right-filled"
    >
      Label
    </Button>
  );
}`,
    file: "@geist/web/canonical/button"
  },
  {
    canonicalId: "component.accordion",
    title: "Accordion",
    preview: (
      <div style={{ width: 328 }}>
        <Accordion
          title="Additional Insights"
          content="Accordions help manage space by letting users expand sections to view additional information."
          badge={
            <Badge
              labelText="New"
              size="Extra Small"
              type="Neutral"
              priority="Low"
              pillShape="Yes"
              iconLeft={false}
              iconRight={false}
            />
          }
        />
      </div>
    ),
    snippet: `import { Accordion, Badge } from "@geist/web";

export function Example() {
  return (
    <Accordion
      title="Additional Insights"
      content="Accordions help manage space by letting users expand sections to view additional information."
      badge={
        <Badge
          labelText="New"
          size="Extra Small"
          type="Neutral"
          priority="Low"
          pillShape="Yes"
          iconLeft={false}
          iconRight={false}
        />
      }
    />
  );
}`,
    file: "@geist/web/canonical/accordion"
  },
  {
    canonicalId: "component.badge",
    title: "Badge",
    preview: (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Badge
          labelText="Badge"
          size="Extra Small"
          type="Neutral"
          priority="Medium"
          pillShape="No"
        />
        <Badge
          labelText="Success"
          size="Small"
          type="Success"
          priority="High"
          pillShape="Yes"
        />
      </div>
    ),
    snippet: `import { Badge } from "@geist/web";

export function Example() {
  return (
    <Badge
      labelText="Badge"
      size="Extra Small"
      type="Neutral"
      priority="Medium"
      pillShape="No"
      iconLeft={true}
      iconRight={true}
    />
  );
}`,
    file: "@geist/web/canonical/badge"
  },
  {
    canonicalId: "component.banner",
    title: "Banner",
    preview: (
      <Banner
        theme="Light"
        state="Info"
        heading
        icon
        action
        actionType="Text button"
        title="New Message Alert"
        description="New message received!"
        actionLabel="Label"
      />
    ),
    snippet: `import { Banner } from "@geist/web";

export function Example() {
  return (
    <Banner
      theme="Light"
      state="Info"
      heading={true}
      icon={true}
      action={true}
      actionType="Text button"
      title="New Message Alert"
      description="New message received!"
      actionLabel="Label"
    />
  );
}`,
    file: "@geist/web/canonical/banner"
  }
] as const;

function TokenBindingTable({
  bindings
}: {
  bindings: Array<{ slot: string; token: string }>;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
          lineHeight: "18px"
        }}
      >
        <thead>
          <tr>
            <th style={tableHeadStyles}>Slot</th>
            <th style={tableHeadStyles}>Linked Token</th>
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

function CodeSnippet({ code }: { code: string }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: 16,
        overflowX: "auto",
        borderRadius: 12,
        border: "1px solid rgba(16, 24, 40, 0.08)",
        background: "#0F172A",
        color: "#E2E8F0",
        fontSize: 12,
        lineHeight: "18px"
      }}
    >
      <code>{code}</code>
    </pre>
  );
}

function ComponentDocCard({
  title,
  file,
  preview,
  code,
  bindings
}: {
  title: string;
  file: string;
  preview: ReactNode;
  code: string;
  bindings: Array<{ slot: string; token: string }>;
}) {
  return (
    <StoryCard>
      <div style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: "30px" }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: "#64748B" }}>
            Export: <code>{file}</code>
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 14 }}>Preview</strong>
          <div
            style={{
              display: "grid",
              gap: 12,
              alignItems: "start",
              padding: 16,
              borderRadius: 12,
              border: "1px solid rgba(16, 24, 40, 0.08)",
              background: "#F8FAFC"
            }}
          >
            {preview}
          </div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 14 }}>Code Snippet</strong>
          <CodeSnippet code={code} />
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 14 }}>Token Bindings</strong>
          <TokenBindingTable bindings={bindings} />
        </div>
      </div>
    </StoryCard>
  );
}

function ComponentCodeSnippets() {
  const resolved = componentCards.map((card) => {
    const contract = designSystemRegistry.components.find(
      (component) => component.canonicalId === card.canonicalId
    );

    return {
      ...card,
      bindings: contract?.tokenBindings ?? []
    };
  });

  return (
    <StoryPage>
      <header style={{ display: "grid", gap: 12, maxWidth: 880 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: "48px" }}>Code Snippets</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "#64748B" }}>
          Live component previews, usage snippets, and the linked token bindings declared in the design-system registry.
        </p>
      </header>

      <div style={gridStyles}>
        {resolved.map((component) => (
          <ComponentDocCard
            key={component.canonicalId}
            title={component.title}
            file={component.file}
            preview={component.preview}
            code={component.snippet}
            bindings={component.bindings}
          />
        ))}
      </div>
    </StoryPage>
  );
}

const gridStyles: CSSProperties = {
  display: "grid",
  gap: 24
};

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

const meta: Meta<typeof ComponentCodeSnippets> = {
  title: "Components/Code Snippets",
  component: ComponentCodeSnippets,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof ComponentCodeSnippets>;

export const Overview: Story = {};
