import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS } from "@turbo/tokens";
import {
  Accordion,
  Module,
  Text,
  TextInput,
  type ModuleProps
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type ModuleSlotVariant = "Text input" | "Accordion";

type ModuleStoryArgs = ModuleProps & {
  slotVariant: ModuleSlotVariant;
};

const MODULE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14911-5034&t=1zgOyFpiLYMyM4XM-11";

function InputSlot({ brand = "Cars24", inverse = false }: Pick<ModuleProps, "brand" | "inverse">) {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <Text
        as="p"
        brand={brand}
        size="sm"
        style={{ color: inverse ? "rgba(255, 255, 255, 0.7)" : undefined, margin: 0 }}
        tone={inverse ? "inverse" : "secondary"}
      >
        Drop any approved component into the module body slot. This example uses the existing text input.
      </Text>
      <TextInput
        brand={brand}
        helperText="We will send an OTP to continue."
        label="Mobile number"
        placeholder="Enter mobile number"
        required
        showHelperIcon={false}
        showLabelInfoIcon={false}
        size="Large"
      />
    </div>
  );
}

function AccordionSlot({ brand = "Cars24" }: Pick<ModuleProps, "brand">) {
  return (
    <Accordion
      brand={brand}
      content={
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
          The module body stays intentionally open so we can plug in any approved component set, not just static
          content.
        </Text>
      }
      defaultExpanded
      size="lg"
      supportingText="Expandable body content"
      title="Engine and transmission"
    />
  );
}

function getSlotContent(slotVariant: ModuleSlotVariant, brand: NonNullable<ModuleProps["brand"]>, inverse: boolean) {
  if (slotVariant === "Accordion") {
    return <AccordionSlot brand={brand} />;
  }

  return <InputSlot brand={brand} inverse={inverse} />;
}

function PlaygroundStory({
  brand = "Cars24",
  inverse = false,
  slotVariant = "Text input",
  ...args
}: ModuleStoryArgs) {
  return (
    <div
      style={{
        background: inverse ? "#0A0A0A" : undefined,
        padding: 16,
        width: 360
      }}
    >
      <Module brand={brand} inverse={inverse} {...args}>
        {getSlotContent(slotVariant, brand, inverse)}
      </Module>
    </div>
  );
}

function SlotCompositionStory({ brand = "Cars24" }: Pick<ModuleProps, "brand">) {
  return (
    <StoryPage>
      <div style={slotGridStyles}>
        <StoryCard style={{ width: "fit-content" }}>
          <PlaygroundStory
            brand={brand}
            description="A slot can host form controls, banners, accordions, or any other approved component."
            inverse={false}
            slotVariant="Text input"
            subtitle="Lead capture"
            title="Module"
          />
        </StoryCard>

        <StoryCard style={{ width: "fit-content" }}>
          <PlaygroundStory
            brand={brand}
            description="The same module shell can frame collapsible content while preserving header and footer structure."
            inverse={false}
            primaryAction={{
              label: "Explore specs"
            }}
            showTag={false}
            slotVariant="Accordion"
            subtitle="Vehicle details"
            title="Module"
          />
        </StoryCard>

        <StoryCard style={{ background: "#0A0A0A", width: "fit-content" }}>
          <PlaygroundStory
            brand={brand}
            description="Inverse styling keeps the exact same composition pattern while swapping the surface and action treatment."
            headerActionLabel="See all"
            inverse
            slotVariant="Text input"
            subtitle="Section title line 2"
            title="Section title"
          />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const slotGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, max-content))",
  justifyContent: "center"
};

const moduleSourceCode = `import { Module, TextInput } from "@turbo/web";

export function Example() {
  return (
    <div style={{ width: 328 }}>
      <Module
        title="Section title"
        subtitle="Section title line 2"
        description="Description goes here upto 2 lines"
      >
        <TextInput
          label="Mobile number"
          placeholder="Enter mobile number"
          helperText="We will send an OTP to continue."
          required
          showHelperIcon={false}
          showLabelInfoIcon={false}
          size="Large"
        />
      </Module>
    </div>
  );
}`;

const meta: Meta<ModuleStoryArgs> = {
  title: "Widgets/Module",
  component: Module,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(MODULE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    inverse: false,
    showSectionHeader: true,
    title: "Section title",
    subtitle: "Section title line 2",
    description: "Description goes here upto 2 lines",
    tagLabel: "New",
    showTag: true,
    showHeaderAction: true,
    showButtonGroup: true,
    headerActionLabel: "View all",
    slotVariant: "Text input"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
    },
    showSectionHeader: {
      control: "boolean"
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    description: {
      control: "text"
    },
    tagLabel: {
      control: "text"
    },
    showTag: {
      control: "boolean"
    },
    showHeaderAction: {
      control: "boolean"
    },
    showButtonGroup: {
      control: "boolean"
    },
    headerActionLabel: {
      control: "text"
    },
    slotVariant: {
      control: "inline-radio",
      options: ["Text input", "Accordion"]
    },
    titleIcon: {
      control: false
    },
    subtitleIcon: {
      control: false
    },
    primaryAction: {
      control: false
    },
    secondaryAction: {
      control: false
    },
    footer: {
      control: false
    },
    onHeaderActionClick: {
      action: "header action click"
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<ModuleStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: moduleSourceCode
      }
    }
  }
};

export const SlotCompositions: Story = {
  render: ({ brand = "Cars24" }) => <SlotCompositionStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: moduleSourceCode
      }
    }
  }
};
