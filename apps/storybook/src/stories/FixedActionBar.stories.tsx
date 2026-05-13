import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@turbo/tokens";
import { FixedActionBar, Icon, Text, type FixedActionBarProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const FIXED_ACTION_BAR_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=29076-8739&t=vUpeNbWJ84H8ABzi-11";

type FixedActionBarStoryArgs = Pick<FixedActionBarProps, "brand" | "showHomeIndicator"> & {
  primaryLabel: string;
  secondaryLabel: string;
  showLeadingIcon: boolean;
  showSecondaryAction: boolean;
  showTrailingIcon: boolean;
};

type FixedActionBarAction = NonNullable<FixedActionBarProps["primaryAction"]>;
type FixedActionBarActionStyle = NonNullable<FixedActionBarAction["styleVariant"]>;

const optionGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

const previewFrameStyles: CSSProperties = {
  alignItems: "flex-end",
  background: String(coreTokenCatalog.color.surface.subtle),
  borderRadius: 24,
  display: "flex",
  minHeight: 240,
  overflow: "hidden",
  width: 360
};

function makeAction({
  brand,
  label,
  showLeadingIcon,
  showTrailingIcon,
  styleVariant
}: {
  brand: DisplayBrandId;
  label: ReactNode;
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
  styleVariant: FixedActionBarActionStyle;
}): FixedActionBarAction {
  return {
    label,
    styleVariant,
    ...(showLeadingIcon ? { leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" /> } : {}),
    ...(showTrailingIcon ? { trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" /> } : {})
  };
}

function buildFixedActionBarProps(args: FixedActionBarStoryArgs): FixedActionBarProps {
  const brand = args.brand ?? "Cars24";

  return {
    brand,
    primaryAction: makeAction({
      brand,
      label: args.primaryLabel,
      showLeadingIcon: args.showLeadingIcon,
      showTrailingIcon: args.showTrailingIcon,
      styleVariant: "Solid"
    }),
    secondaryAction: args.showSecondaryAction
      ? makeAction({
          brand,
          label: args.secondaryLabel,
          showLeadingIcon: args.showLeadingIcon,
          showTrailingIcon: args.showTrailingIcon,
          styleVariant: "Outline"
        })
      : null,
    showHomeIndicator: args.showHomeIndicator ?? true
  };
}

function FixedActionBarPreview({ children }: { children: ReactNode }) {
  return <div style={previewFrameStyles}>{children}</div>;
}

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

function PlaygroundStory(args: FixedActionBarStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <FixedActionBarPreview>
          <FixedActionBar {...buildFixedActionBarProps(args)} />
        </FixedActionBarPreview>
      </StoryCard>
    </StoryPage>
  );
}

function WidgetOptionsStory({ brand = "Cars24" }: Pick<FixedActionBarProps, "brand">) {
  return (
    <StoryPage fullscreen>
      <div style={optionGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Default widget</StoryLabel>
          <FixedActionBarPreview>
            <FixedActionBar brand={brand} />
          </FixedActionBarPreview>
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Primary action only</StoryLabel>
          <FixedActionBarPreview>
            <FixedActionBar brand={brand} secondaryAction={null} />
          </FixedActionBarPreview>
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={brand}>Without home indicator</StoryLabel>
          <FixedActionBarPreview>
            <FixedActionBar brand={brand} showHomeIndicator={false} />
          </FixedActionBarPreview>
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const fixedActionBarSourceCode = `import { FixedActionBar, Icon } from "@turbo/web";

export function Example() {
  return (
    <FixedActionBar
      brand="Cars24"
      primaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
      secondaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
    />
  );
}`;

const meta: Meta<FixedActionBarStoryArgs> = {
  title: "Widgets/Fixed Action Bar",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(FIXED_ACTION_BAR_FIGMA_URL),
    docs: {
      description: {
        component:
          "Fixed mobile bottom action surface with a vertical large button group and optional iOS home indicator."
      },
      source: {
        code: fixedActionBarSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    primaryLabel: "Label",
    secondaryLabel: "Label",
    showHomeIndicator: true,
    showLeadingIcon: true,
    showSecondaryAction: true,
    showTrailingIcon: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    primaryLabel: {
      control: "text"
    },
    secondaryLabel: {
      control: "text"
    },
    showHomeIndicator: {
      control: "boolean"
    },
    showLeadingIcon: {
      control: "boolean"
    },
    showSecondaryAction: {
      control: "boolean"
    },
    showTrailingIcon: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<FixedActionBarStoryArgs>;

export const Playground: Story = {};

export const WidgetOptions: Story = {
  render: ({ brand }) => <WidgetOptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
