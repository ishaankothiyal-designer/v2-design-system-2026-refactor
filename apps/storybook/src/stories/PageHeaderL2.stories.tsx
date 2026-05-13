import type { Meta, StoryObj } from "@storybook/react";
import { PageHeaderL2, type PageHeaderL2Props } from "@turbo/web";
import { StoryCard, StoryPage } from "../storybook-shell";

function PlaygroundStory(args: PageHeaderL2Props) {
  return (
    <StoryPage>
      <StoryCard style={{ width: 375 }}>
        <PageHeaderL2 {...args} />
      </StoryCard>
    </StoryPage>
  );
}

const meta = {
  title: "Components/Page header L2",
  component: PageHeaderL2,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Backward-compatible alias for App Header rendered in its L2 page variant. Accepts all AppHeader props except `level`."
      },
      source: {
        code: `import { PageHeaderL2 } from "@turbo/web";\n\nexport function Example() {\n  return <PageHeaderL2 brand="Cars24" title="Page title" />;\n}`
      }
    }
  },
  args: {
    brand: "Cars24",
    title: "Page title"
  },
  argTypes: {
    brand: { control: "radio", options: ["Cars24", "CarInfo", "VehicleInfo", "Team BHP"] },
    title: { control: "text" }
  },
  render: PlaygroundStory
} satisfies Meta<PageHeaderL2Props>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
