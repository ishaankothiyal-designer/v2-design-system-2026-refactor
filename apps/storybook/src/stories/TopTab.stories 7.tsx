import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import {
  Icon,
  Text,
  TopTab,
  type TopTabConfiguration,
  type TopTabItem,
  type TopTabItemState,
  type TopTabProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const TOP_TAB_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=6881-35258&p=f&t=1zgOyFpiLYMyM4XM-11";

const topTabConfigurations: TopTabConfiguration[] = [
  "Label + icon",
  "Icon only",
  "Label + image",
  "Image only"
];
const topTabCounts = [2, 3, 4, 5, 6] as const;
const visibleStates = ["Rest", "Hover", "Active", "Pressed", "Disabled"] as const;

const imagePlaceholderDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="10" fill="#EFF6FF"/>
    <path d="M10 35L20 25L27 31L32 27L38 35H10Z" fill="#BFDBFE"/>
    <circle cx="33.5" cy="15.5" r="4.5" fill="#DBEAFE"/>
  </svg>`
)}`;

type TopTabStoryArgs = Omit<TopTabProps, "items"> & {
  counterBadgeLabel?: string;
  showCounterBadge?: boolean;
  showNotificationBadge?: boolean;
};

function buildItems(
  count: number,
  configuration: TopTabConfiguration,
  options?: {
    counterBadgeLabel?: string | undefined;
    showCounterBadge?: boolean | undefined;
    showNotificationBadge?: boolean | undefined;
  },
  previewState?: TopTabItemState,
  previewIndex = 0
): TopTabItem[] {
  return Array.from({ length: count }, (_, index) => {
    const item: TopTabItem = {
      ariaLabel: `Tab ${index + 1}`,
      value: `tab-${index + 1}`
    };

    if (configuration === "Label + image" || configuration === "Image only") {
      item.imageAlt = `Tab image ${index + 1}`;
      item.imageSrc = imagePlaceholderDataUri;
    } else {
      item.icon = <Icon name="sparkle-filled" decorative />;
    }

    if (configuration === "Label + icon" || configuration === "Label + image") {
      item.label = "Label";
      item.counterBadgeLabel = options?.counterBadgeLabel ?? "5";
      item.showCounterBadge = options?.showCounterBadge ?? true;
    }

    item.showNotificationBadge = options?.showNotificationBadge ?? true;

    if (index === previewIndex && previewState) {
      item.state = previewState;
    }

    return item;
  });
}

function renderPlayground(args: TopTabStoryArgs) {
  const [
    {
      counterBadgeLabel = "5",
      showCounterBadge = true,
      showNotificationBadge = true,
      value = "tab-1"
    },
    updateArgs
  ] = useArgs<TopTabStoryArgs>();
  const configuration = args.configuration ?? "Label + icon";

  return (
    <TopTab
      {...args}
      items={buildItems(
        3,
        configuration,
        {
          counterBadgeLabel,
          showCounterBadge,
          showNotificationBadge
        }
      )}
      value={value}
      onValueChange={(nextValue) => {
        updateArgs({ value: nextValue });
        args.onValueChange?.(nextValue);
      }}
    />
  );
}

function TopTabPlaygroundComponent({
  counterBadgeLabel,
  showCounterBadge,
  showNotificationBadge,
  ...args
}: TopTabStoryArgs) {
  const configuration = args.configuration ?? "Label + icon";

  return (
    <TopTab
      {...args}
      items={buildItems(
        3,
        configuration,
        {
          counterBadgeLabel,
          showCounterBadge,
          showNotificationBadge
        }
      )}
    />
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

function VariantMatrix({
  brand,
  configuration
}: {
  brand: DisplayBrandId;
  configuration: TopTabConfiguration;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {configuration}
      </Text>
      <div style={matrixTableStyles("160px repeat(2, minmax(420px, 1fr))")}>
        <div style={matrixCornerCellStyles} />
        <div style={matrixHeaderCellStyles}>
          <HeaderCell brand={brand} label="Light" />
        </div>
        <div style={matrixHeaderCellStyles}>
          <HeaderCell brand={brand} label="Inverse" />
        </div>

        {topTabCounts.flatMap((count) => [
          <div key={`${configuration}-${count}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={count === 6 ? "5+ items" : `${count} items`} />
          </div>,
          <div key={`${configuration}-${count}-light`} style={matrixValueCellStyles}>
            <TopTab
              brand={brand}
              configuration={configuration}
              items={buildItems(count, configuration)}
              style={{ width: 360 }}
              value="tab-1"
            />
          </div>,
          <div
            key={`${configuration}-${count}-dark`}
            style={{
              ...matrixValueCellStyles,
              background: String(coreTokenCatalog.color.surface.inverse)
            }}
          >
            <TopTab
              brand={brand}
              configuration={configuration}
              inverse
              items={buildItems(count, configuration)}
              style={{ width: 360 }}
              value="tab-1"
            />
          </div>
        ])}
      </div>
    </div>
  );
}

function ConfigurationStoryPage({
  brand,
  configuration,
  title,
  description
}: {
  brand: DisplayBrandId;
  configuration: TopTabConfiguration;
  title: string;
  description: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title={title}
            description={description}
          />
          <VariantMatrix brand={brand} configuration={configuration} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildStateExample(
  configuration: TopTabConfiguration,
  state: (typeof visibleStates)[number],
  inverse: boolean
) {
  if (state === "Active") {
    return (
      <TopTab
        configuration={configuration}
        inverse={inverse}
        items={buildItems(2, configuration)}
        style={{ width: 180 }}
        value="tab-1"
      />
    );
  }

  return (
    <TopTab
      configuration={configuration}
      inverse={inverse}
      items={buildItems(2, configuration, undefined, state, 0)}
      style={{ width: 180 }}
      value="tab-2"
    />
  );
}

function StateMatrix({
  brand,
  configuration
}: {
  brand: DisplayBrandId;
  configuration: TopTabConfiguration;
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Text brand={brand} as="strong" size="sm">
        {configuration}
      </Text>
      <div style={matrixTableStyles("160px repeat(5, minmax(200px, 1fr))")}>
        <div style={matrixCornerCellStyles} />
        {visibleStates.map((state) => (
          <div key={`${configuration}-${state}-header`} style={matrixHeaderCellStyles}>
            <HeaderCell brand={brand} label={state} />
          </div>
        ))}

        {(["Light", "Inverse"] as const).flatMap((surface) => [
          <div key={`${configuration}-${surface}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={surface} />
          </div>,
          ...visibleStates.map((state) => (
            <div
              key={`${configuration}-${surface}-${state}`}
              style={{
                ...matrixValueCellStyles,
                background:
                  surface === "Inverse"
                    ? String(coreTokenCatalog.color.surface.inverse)
                    : String(coreTokenCatalog.color.surface.canvas)
              }}
            >
              {buildStateExample(configuration, state, surface === "Inverse")}
            </div>
          ))
        ])}
      </div>
    </div>
  );
}

function VisibleStatesStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            brand={brand}
            title="Visible states"
            description="State previews derived from the visible Figma tab atoms: Rest, Hover, Active, Pressed, and Disabled across both supported Top Tab configurations."
          />
          <div style={{ display: "grid", gap: 24 }}>
            {topTabConfigurations.map((configuration) => (
              <StateMatrix key={configuration} brand={brand} configuration={configuration} />
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function matrixTableStyles(columns: string): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: columns,
    overflow: "hidden"
  };
}

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 68
};

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 68,
  padding: "16px 20px"
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 104,
  padding: "20px 16px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 104,
  padding: "16px 20px"
};

const topTabUiExampleSourceCode = `import { TopTab } from "@geist/web";

const items = [
  {
    value: "overview",
    label: "Overview",
    imageSrc: "/path/to/image.png",
    showNotificationBadge: true,
    showCounterBadge: true,
    counterBadgeLabel: "5"
  },
  { value: "specs", label: "Specs", imageSrc: "/path/to/image.png" },
  { value: "history", label: "History", imageSrc: "/path/to/image.png" }
];

export function Example() {
  return (
    <TopTab
      brand="Cars24"
      configuration="Label + image"
      items={items}
      value="overview"
    />
  );
}`;

function buildTopTabConfigurationSourceCode(configuration: TopTabConfiguration) {
  const usesImage = configuration === "Label + image" || configuration === "Image only";
  const includesLabel = configuration === "Label + icon" || configuration === "Label + image";

  return `import { TopTab } from "@geist/web";

const items = [
  {
    value: "tab-1",
    ariaLabel: "Tab 1",${includesLabel ? `
    label: "Label",` : ""}${usesImage ? `
    imageSrc: "/path/to/image.png",
    imageAlt: "Tab image 1"` : `
    icon: <Icon name="sparkle-filled" decorative />`}
  },
  {
    value: "tab-2",
    ariaLabel: "Tab 2",${includesLabel ? `
    label: "Label",` : ""}${usesImage ? `
    imageSrc: "/path/to/image.png",
    imageAlt: "Tab image 2"` : `
    icon: <Icon name="sparkle-filled" decorative />`}
  }
];

export function Example() {
  return (
    <TopTab
      brand="Cars24"
      configuration="${configuration}"
      items={items}
      value="tab-1"
    />
  );
}`;
}

const meta: Meta<TopTabStoryArgs> = {
  title: "Components/Tabs/Top Tab",
  component: TopTabPlaygroundComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(TOP_TAB_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    configuration: "Label + icon",
    inverse: false,
    counterBadgeLabel: "5",
    showCounterBadge: true,
    showNotificationBadge: true,
    value: "tab-1"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    configuration: {
      control: "inline-radio",
      options: topTabConfigurations
    },
    inverse: {
      control: "boolean"
    },
    showCounterBadge: {
      control: "boolean"
    },
    showNotificationBadge: {
      control: "boolean"
    },
    counterBadgeLabel: {
      control: "text"
    },
    onValueChange: {
      action: "value changed"
    },
    value: {
      control: false
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<TopTabStoryArgs>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: topTabUiExampleSourceCode
      }
    }
  }
};

export const LabelIcon: Story = {
  render: ({ brand = "Cars24" }) => (
    <ConfigurationStoryPage
      brand={brand}
      configuration="Label + icon"
      title="Label + Icon"
      description="Canonical Top Tab matrix for the labeled icon configuration across count 2, 3, 4, 5, and 5+ on light and inverse surfaces."
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen",
    docs: {
      source: {
        code: buildTopTabConfigurationSourceCode("Label + icon")
      }
    }
  }
};

export const IconOnly: Story = {
  render: ({ brand = "Cars24" }) => (
    <ConfigurationStoryPage
      brand={brand}
      configuration="Icon only"
      title="Icon"
      description="Canonical Top Tab matrix for the icon-only configuration across count 2, 3, 4, 5, and 5+ on light and inverse surfaces."
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen",
    docs: {
      source: {
        code: buildTopTabConfigurationSourceCode("Icon only")
      }
    }
  }
};

export const LabelImage: Story = {
  render: ({ brand = "Cars24" }) => (
    <ConfigurationStoryPage
      brand={brand}
      configuration="Label + image"
      title="Label + Image"
      description="Canonical Top Tab matrix for the labeled image configuration across count 2, 3, 4, 5, and 5+ on light and inverse surfaces."
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen",
    docs: {
      source: {
        code: buildTopTabConfigurationSourceCode("Label + image")
      }
    }
  }
};

export const ImageOnly: Story = {
  render: ({ brand = "Cars24" }) => (
    <ConfigurationStoryPage
      brand={brand}
      configuration="Image only"
      title="Image"
      description="Canonical Top Tab matrix for the image-only configuration across count 2, 3, 4, 5, and 5+ on light and inverse surfaces."
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen",
    docs: {
      source: {
        code: buildTopTabConfigurationSourceCode("Image only")
      }
    }
  }
};

export const VisibleStates: Story = {
  render: ({ brand = "Cars24" }) => <VisibleStatesStory brand={brand} />,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};
