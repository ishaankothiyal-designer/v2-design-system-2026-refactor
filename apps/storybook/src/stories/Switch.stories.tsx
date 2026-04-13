import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Switch, Text, type SwitchProps, type SwitchSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  NotificationSettingsMobileScreen,
  notificationSettingsScreenSourceCode
} from "./NotificationSettingsMobileScreenExample";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const switchSizes: SwitchSize[] = ["Default", "Small"];
const documentedStates = [
  { key: "rest", label: "Rest", checked: false, disabled: false },
  { key: "selected", label: "Selected", checked: true, disabled: false },
  { key: "disabled-rest", label: "Disabled Rest", checked: false, disabled: true },
  { key: "disabled-selected", label: "Disabled Selected", checked: true, disabled: true }
] as const;

type SwitchStoryArgs = Omit<SwitchProps, "defaultChecked">;

function renderPlayground(args: SwitchStoryArgs) {
  const [{ checked = false }, updateArgs] = useArgs<SwitchStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({ checked: event.currentTarget.checked });
    args.onChange?.(event);
  }

  return <Switch {...args} checked={checked} onChange={handleChange} />;
}

function HeaderCell({ brand, label }: { brand: DisplayBrandId; label: string }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function StateMatrixStory({
  brand,
  state
}: {
  brand: DisplayBrandId;
  state: (typeof documentedStates)[number];
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(140px, 1fr))">
        <StoryMatrixCornerCell />
        {switchSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${state.key}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={96}>
          <HeaderCell brand={brand} label={state.label} />
        </StoryMatrixRowLabelCell>
        {switchSizes.map((size) => (
          <StoryMatrixValueCell key={`${state.key}-${size}`} minHeight={96}>
            <Switch
              aria-label={`${brand} ${size} ${state.label}`}
              brand={brand}
              checked={state.checked}
              disabled={state.disabled}
              size={size}
            />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildSwitchStateSourceCode(state: (typeof documentedStates)[number]) {
  return `import { Switch } from "@geist/web";

const sizes = ["Default", "Small"] as const;

export function Switch${state.key.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <Switch
          key={size}
          aria-label={\`${"${size}"} ${state.label}\`}
          brand="Cars24"
          size={size}
          checked={${state.checked}}
          disabled={${state.disabled}}
        />
      ))}
    </div>
  );
}`;
}

const SWITCH_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=77-3690&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<SwitchStoryArgs> = {
  title: "Components/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SWITCH_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    disabled: false,
    size: "Default"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: switchSizes
    },
    checked: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    }
  },
  render: renderPlayground
};

export default meta;

type Story = StoryObj<SwitchStoryArgs>;

export const Playground: Story = {
  args: {
    "aria-label": "Playground switch"
  },
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[0]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildSwitchStateSourceCode(documentedStates[0])
      }
    }
  }
};

export const Selected: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[1]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildSwitchStateSourceCode(documentedStates[1])
      }
    }
  }
};

export const DisabledRest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[2]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildSwitchStateSourceCode(documentedStates[2])
      }
    }
  }
};

export const DisabledSelected: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state={documentedStates[3]} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildSwitchStateSourceCode(documentedStates[3])
      }
    }
  }
};

export const UIExample: Story = {
  parameters: {
    layout: "fullscreen",
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: notificationSettingsScreenSourceCode
      }
    }
  },
  render: ({ brand = "Cars24" }) => <NotificationSettingsMobileScreen brand={brand} />
};
