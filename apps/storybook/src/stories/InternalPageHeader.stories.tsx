import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  Icon,
  InternalPageHeader,
  InternalPageHeaderMediaSlot,
  Text,
  type InternalPageHeaderProps,
  type InternalPageHeaderType
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

type InternalPageHeaderStoryArgs = InternalPageHeaderProps & {
  actionLabel: string;
};

const INTERNAL_PAGE_HEADER_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28372-3471&t=hFO1h296qgJvQhe9-11";

const headerTypes: InternalPageHeaderType[] = ["With image", "With button"];

const optionGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

function StoryLabel({
  brand,
  children
}: {
  brand: DisplayBrandId;
  children: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {children}
    </Text>
  );
}

function PlaygroundStory(args: InternalPageHeaderStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", justifyItems: "center" }}>
        <InternalPageHeader {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function CustomImageSlot({ brand }: { brand: DisplayBrandId }) {
  return (
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, var(--cars24-primitive-drive-pink-50, #FFE8F7), var(--cars24-semantic-bg-brand-subtler, #F6F6FF))",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%"
      }}
    >
      <Icon
        brand={brand}
        decorative
        name="sparkle-filled"
        style={{ color: "var(--cars24-primitive-drive-pink-400, #FD49C0)", fontSize: 24 }}
      />
    </div>
  );
}

function OptionsStory({ brand = "Cars24" }: Pick<InternalPageHeaderProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>With image</StoryLabel>
          <InternalPageHeader brand={activeBrand} type="With image" />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>With button</StoryLabel>
          <InternalPageHeader brand={activeBrand} type="With button" />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without description</StoryLabel>
          <InternalPageHeader brand={activeBrand} showDescription={false} type="With image" />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without icon</StoryLabel>
          <InternalPageHeader brand={activeBrand} showDescriptionIcon={false} type="With button" />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Swapped icon</StoryLabel>
          <InternalPageHeader brand={activeBrand} iconName="map-pin-flat-route-outline" type="With image" />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Custom image slot</StoryLabel>
          <InternalPageHeader
            brand={activeBrand}
            description="Sector 38, Gurgaon"
            heading="Inspection details"
            imageSlot={<CustomImageSlot brand={activeBrand} />}
            type="With image"
          />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Reusable image slot</StoryLabel>
          <InternalPageHeaderMediaSlot brand={activeBrand} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const internalPageHeaderSourceCode = `import { InternalPageHeader } from "@turbo/web";

<InternalPageHeader
  brand="Cars24"
  type="With image"
  heading="Heading h3 semibold"
  description="Description label3 regular"
  iconName="location-outline"
/>;`;

const meta = {
  title: "Widgets/Internal Page Header",
  component: InternalPageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(INTERNAL_PAGE_HEADER_FIGMA_URL),
    docs: {
      description: {
        component:
          "Implements the linked Figma widget named Internal Page Header. The copy stack and image slot are reusable, while the action variant composes the canonical extra-small primary Button."
      },
      source: {
        code: internalPageHeaderSourceCode
      }
    }
  },
  args: {
    actionLabel: "Button",
    brand: "Cars24",
    description: "Description label3 regular",
    heading: "Heading h3 semibold",
    iconName: "location-outline",
    showDescription: true,
    showDescriptionIcon: true,
    type: "With image"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    type: {
      control: "select",
      options: headerTypes
    },
    heading: {
      control: "text"
    },
    description: {
      control: "text"
    },
    actionLabel: {
      control: "text"
    },
    iconName: {
      control: "text"
    },
    showDescription: {
      control: "boolean"
    },
    showDescriptionIcon: {
      control: "boolean"
    },
    action: {
      control: false
    },
    descriptionIcon: {
      control: false
    },
    descriptionIconName: {
      control: false
    },
    imageSlot: {
      control: false
    }
  },
  render: PlaygroundStory
} satisfies Meta<InternalPageHeaderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Options: Story = {
  render: ({ brand }) => <OptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
