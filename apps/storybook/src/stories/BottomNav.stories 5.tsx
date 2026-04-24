import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  BottomNav,
  Text,
  type BottomNavConfiguration,
  type BottomNavItem,
  type BottomNavProps,
  type BottomNavType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage, StoryPreviewSurface } from "../storybook-shell";

const BOTTOM_NAV_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=6887-40111&p=f&t=1zgOyFpiLYMyM4XM-11";

const navTypes: BottomNavType[] = ["Sticky", "Floating"];
const navCounts = [3, 4, 5] as const;
const configurations: BottomNavConfiguration[] = ["Label + icon", "Icon only"];

type BottomNavStoryArgs = Omit<BottomNavProps, "items"> & {
  configuration: BottomNavConfiguration;
  itemCount: (typeof navCounts)[number];
};

function buildItems(
  count: number,
  configuration: BottomNavConfiguration
): BottomNavItem[] {
  return Array.from({ length: count }, (_, index) => ({
    value: `tab-${index + 1}`,
    ariaLabel: `Destination ${index + 1}`,
    iconName: "sparkle-filled",
    ...(configuration === "Label + icon" ? { label: "Label" } : {})
  }));
}

function renderPlayground(args: BottomNavStoryArgs) {
  const [{ value = "tab-1" }, updateArgs] = useArgs<BottomNavStoryArgs>();

  return (
    <BottomNav
      {...args}
      items={buildItems(args.itemCount, args.configuration)}
      style={{ width: 360, ...(args.style ?? {}) }}
      value={value}
      onValueChange={(nextValue) => {
        updateArgs({ value: nextValue });
        args.onValueChange?.(nextValue);
      }}
    />
  );
}

function BottomNavStoryComponent({
  itemCount,
  configuration,
  style,
  ...args
}: BottomNavStoryArgs) {
  return (
    <BottomNav
      {...args}
      configuration={configuration}
      items={buildItems(itemCount, configuration)}
      style={{ width: 360, ...(style ?? {}) }}
    />
  );
}

function HeaderCell({
  brand,
  label,
  tone = "secondary"
}: {
  brand: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function SectionHeading({
  brand,
  title,
  description,
  tone = "primary"
}: {
  brand: DisplayBrandId;
  title: string;
  description?: string;
  tone?: "primary" | "secondary" | "inverse";
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md" tone={tone}>
        {title}
      </Text>
      {description ? (
        <Text brand={brand} as="p" size="sm" tone={tone === "inverse" ? "inverse" : "secondary"}>
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function CountMatrix({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryMatrix columns="180px repeat(3, minmax(280px, 1fr))">
      <StoryMatrixCornerCell />
      {navCounts.map((count) => (
        <StoryMatrixHeaderCell key={`count-${count}`}>
          <HeaderCell brand={brand} label={`${count} items`} />
        </StoryMatrixHeaderCell>
      ))}

      {navTypes.flatMap((type) => [
        <StoryMatrixRowLabelCell key={`${type}-label`} minHeight={176}>
          <HeaderCell brand={brand} label={type} />
        </StoryMatrixRowLabelCell>,
        ...navCounts.map((count) => (
          <StoryMatrixValueCell key={`${type}-${count}`} minHeight={176}>
            <StoryPreviewSurface>
              <BottomNav
                brand={brand}
                items={buildItems(count, "Label + icon")}
                type={type}
                value="tab-1"
                style={{ width: 360 }}
              />
            </StoryPreviewSurface>
          </StoryMatrixValueCell>
        ))
      ])}
    </StoryMatrix>
  );
}

function ConfigurationMatrix({
  brand,
  type
}: {
  brand: DisplayBrandId;
  type: BottomNavType;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {type}
      </Text>
      <StoryMatrix columns="180px minmax(320px, 1fr)">
        <StoryMatrixCornerCell />
        <StoryMatrixHeaderCell>
          <HeaderCell brand={brand} label="Preview" />
        </StoryMatrixHeaderCell>
        {configurations.flatMap((configuration) => [
          <StoryMatrixRowLabelCell key={`${type}-${configuration}-label`} minHeight={176}>
            <HeaderCell brand={brand} label={configuration} />
          </StoryMatrixRowLabelCell>,
          <StoryMatrixValueCell key={`${type}-${configuration}-preview`} minHeight={176}>
            <StoryPreviewSurface>
              <BottomNav
                brand={brand}
                configuration={configuration}
                items={buildItems(4, configuration)}
                type={type}
                value="tab-1"
                style={{ width: 360 }}
              />
            </StoryPreviewSurface>
          </StoryMatrixValueCell>
        ])}
      </StoryMatrix>
    </div>
  );
}

function VariantsStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <SectionHeading
          brand={brand}
          title="Bottom Nav variants"
          description="Count variants documented in Figma for the primary label-plus-icon composition across sticky and floating rails."
        />
        <CountMatrix brand={brand} />
      </StoryCard>
    </StoryPage>
  );
}

function StatesStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <SectionHeading
          brand={brand}
          title="Configurations and visible states"
          description="Each preview shows the documented selected destination beside rest-state neighbors for both label and icon-only configurations."
        />
        <div style={{ display: "grid", gap: 24 }}>
          {navTypes.map((type) => (
            <ConfigurationMatrix key={type} brand={brand} type={type} />
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const bottomNavSourceCode = `import { BottomNav } from "@geist/web";

const items = [
  { value: "home", label: "Home", ariaLabel: "Home", iconName: "sparkle-filled" },
  { value: "search", label: "Search", ariaLabel: "Search", iconName: "sparkle-filled" },
  { value: "saved", label: "Saved", ariaLabel: "Saved", iconName: "sparkle-filled" },
  { value: "profile", label: "Profile", ariaLabel: "Profile", iconName: "sparkle-filled" }
];

export function Example() {
  return (
    <BottomNav
      brand="Cars24"
      items={items}
      value="home"
      style={{ width: 360 }}
    />
  );
}`;

const meta: Meta<BottomNavStoryArgs> = {
  title: "Components/Navigation/Bottom Nav",
  component: BottomNavStoryComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(BOTTOM_NAV_FIGMA_URL),
    docs: {
      source: {
        code: bottomNavSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    configuration: "Label + icon",
    itemCount: 4,
    showHomeIndicator: false,
    value: "tab-1"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    configuration: {
      control: "radio",
      options: configurations
    },
    itemCount: {
      control: "radio",
      options: navCounts
    },
    type: {
      control: "radio",
      options: navTypes
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<BottomNavStoryArgs>;

export const Playground: Story = {};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantsStory brand={brand} />
};

export const ConfigurationsAndStates: Story = {
  render: ({ brand = "Cars24" }) => <StatesStory brand={brand} />
};
