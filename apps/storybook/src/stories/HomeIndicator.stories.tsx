import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@turbo/tokens";
import { HomeIndicator, type HomeIndicatorProps } from "@turbo/web";
import { StoryCard, StoryPage } from "../storybook-shell";

function PlaygroundStory(args: HomeIndicatorProps) {
  return (
    <StoryPage>
      <StoryCard style={{ width: 375 }}>
        <HomeIndicator {...args} />
      </StoryCard>
    </StoryPage>
  );
}

const meta = {
  title: "Components/Home indicator",
  component: HomeIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Reusable iOS home indicator chrome for mobile fixed surfaces and Figma review frames."
      },
      source: {
        code: `import { HomeIndicator } from "@turbo/web";\n\nexport function Example() {\n  return <HomeIndicator brand="Cars24" />;\n}`
      }
    }
  },
  args: {
    brand: "Cars24"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    }
  },
  render: PlaygroundStory
} satisfies Meta<HomeIndicatorProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
