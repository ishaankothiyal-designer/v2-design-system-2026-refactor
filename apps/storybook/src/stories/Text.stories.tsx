import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { Text, type TextProps } from "@turbo/web";
import { StoryCard, StoryPage } from "../storybook-shell";

const tones: NonNullable<TextProps["tone"]>[] = ["primary", "secondary", "muted", "inverse"];
const sizes: NonNullable<TextProps["size"]>[] = ["xs", "sm", "md", "lg", "xl"];
const elements: NonNullable<TextProps["as"]>[] = ["span", "p", "label", "strong"];

function PlaygroundStory(args: TextProps) {
  return (
    <StoryPage>
      <StoryCard>
        <Text {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function ToneMatrixStory({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard
        style={{ background: brand === "Cars24" ? "#1a1a1a" : undefined, display: "grid", gap: 12, padding: 24 }}
      >
        {tones.map((tone) => (
          <div key={tone} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Text brand={brand} size="xs" tone="secondary" style={{ width: 80, flexShrink: 0 }}>
              {tone}
            </Text>
            {sizes.map((size) => (
              <Text key={size} brand={brand} tone={tone} size={size}>
                {size.toUpperCase()} text
              </Text>
            ))}
          </div>
        ))}
      </StoryCard>
    </StoryPage>
  );
}

const meta = {
  title: "Primitives/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Theme-aware text primitive supporting tone, size, and semantic element overrides."
      },
      source: {
        code: `import { Text } from "@turbo/web";\n\nexport function Example() {\n  return <Text brand="Cars24" size="md" tone="primary">Hello world</Text>;\n}`
      }
    }
  },
  args: {
    brand: "Cars24",
    children: "The quick brown fox jumps over the lazy dog",
    tone: "primary",
    size: "md",
    as: "span"
  },
  argTypes: {
    brand: { control: "radio", options: STORYBOOK_BRAND_OPTIONS },
    tone: { control: "radio", options: tones },
    size: { control: "radio", options: sizes },
    as: { control: "radio", options: elements },
    children: { control: "text" }
  },
  render: PlaygroundStory
} satisfies Meta<TextProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ToneMatrix: Story = {
  render: ({ brand }) => <ToneMatrixStory brand={brand ?? "Cars24"} />,
  parameters: { controls: { include: ["brand"] } }
};
