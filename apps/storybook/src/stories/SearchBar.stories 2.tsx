import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  SearchBar,
  Text,
  type SearchBarColor,
  type SearchBarPreviewState,
  type SearchBarProps,
  type SearchBarSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const searchBarSizes: SearchBarSize[] = ["Small", "Large"];
const previewStates: SearchBarPreviewState[] = ["Rest", "Hover", "Active", "Error", "Completed"];
const searchBarColors: SearchBarColor[] = ["Solid White", "Blue", "Inverse"];

type SearchBarStoryArgs = SearchBarProps;

function PlaygroundStory(args: SearchBarStoryArgs) {
  const [{ value }, updateArgs] = useArgs<SearchBarStoryArgs>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 336 }}>
      <SearchBar {...args} {...(isControlled ? { value } : {})} onChange={handleChange} />
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
  tone?: "secondary" | "inverse";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function getValue(color: SearchBarColor, state: SearchBarPreviewState) {
  if (state === "Active" && color === "Inverse") {
    return "Honda";
  }

  if (state === "Completed") {
    return color === "Inverse" ? "Honda" : "Search";
  }

  return undefined;
}

function StateMatrixStory({
  brand,
  forceState,
  stateLabel
}: {
  brand: DisplayBrandId;
  forceState: SearchBarPreviewState;
  stateLabel: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(336px, 1fr))">
        <StoryMatrixCornerCell />
        {searchBarSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        {searchBarColors.flatMap((color) => {
          const tone = color === "Inverse" ? "inverse" : "secondary";
          const cellTone = color === "Inverse" ? "inverse" : "canvas";
          const value = getValue(color, forceState);
          return [
            <StoryMatrixRowLabelCell key={`${stateLabel}-${color}-label`} minHeight={112} tone={cellTone}>
              <HeaderCell brand={brand} label={color} tone={tone} />
            </StoryMatrixRowLabelCell>,
            ...searchBarSizes.map((size) => (
              <StoryMatrixValueCell key={`${stateLabel}-${color}-${size}`} minHeight={112} tone={cellTone}>
                <SearchBar
                  brand={brand}
                  color={color}
                  forceState={forceState}
                  size={size}
                  {...(value !== undefined ? { value } : {})}
                />
              </StoryMatrixValueCell>
            ))
          ];
        })}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildSearchBarStateSourceCode({
  forceState,
  label
}: {
  forceState: SearchBarPreviewState;
  label: string;
}) {
  return `import { SearchBar } from "@geist/web";

const colors = ["Solid White", "Blue", "Inverse"] as const;
const sizes = ["Small", "Large"] as const;

export function SearchBar${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      {colors.map((color) => (
        <div key={color} style={{ display: "grid", gap: 16 }}>
          {sizes.map((size) => (
            <SearchBar
              key={size}
              brand="Cars24"
              color={color}
              size={size}
              forceState="${forceState}"
            />
          ))}
        </div>
      ))}
    </div>
  );
}`;
}

const searchBarUiExampleSourceCode = `<SearchBar
  brand="Cars24"
  color="Blue"
  size="Large"
  placeholder="Search"
  value="Search"
/>`;

const SEARCH_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=935-8224&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<SearchBarStoryArgs> = {
  title: "Components/Forms/Search Bar",
  component: SearchBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SEARCH_BAR_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    color: "Solid White",
    placeholder: "Search",
    size: "Small",
    validationState: "Default"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    color: {
      control: "select",
      options: searchBarColors
    },
    size: {
      control: "select",
      options: searchBarSizes
    },
    forceState: {
      control: "select",
      options: [undefined, ...previewStates]
    },
    validationState: {
      control: "select",
      options: ["Default", "Error"]
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<SearchBarStoryArgs>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildSearchBarStateSourceCode({ forceState: "Rest", label: "Rest" }) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Hover" stateLabel="Hover" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildSearchBarStateSourceCode({ forceState: "Hover", label: "Hover" }) } }
  }
};

export const Active: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Active" stateLabel="Active" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildSearchBarStateSourceCode({ forceState: "Active", label: "Active" }) } }
  }
};

export const Error: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Error" stateLabel="Error" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildSearchBarStateSourceCode({ forceState: "Error", label: "Error" }) } }
  }
};

export const Completed: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Completed" stateLabel="Completed" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildSearchBarStateSourceCode({ forceState: "Completed", label: "Completed" }) } }
  }
};

export const UiExample: Story = {
  args: {
    brand: "Cars24",
    color: "Blue",
    placeholder: "Search",
    size: "Large",
    value: "Search"
  },
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: searchBarUiExampleSourceCode
      }
    }
  }
};
