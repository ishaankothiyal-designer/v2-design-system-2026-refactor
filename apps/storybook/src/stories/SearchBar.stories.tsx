import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@geist/tokens";
import {
  SearchBar,
  Text,
  type SearchBarColor,
  type SearchBarPreviewState,
  type SearchBarProps,
  type SearchBarSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const searchBarSizes: SearchBarSize[] = ["Small", "Large"];
const previewStates: SearchBarPreviewState[] = ["Rest", "Hover", "Active", "Error", "Completed"];
const searchBarColors: SearchBarColor[] = ["Solid White", "Blue", "Inverse"];

function PlaygroundStory(args: SearchBarProps) {
  const [{ value }, updateArgs] = useArgs<SearchBarProps>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 336 }}>
      <SearchBar
        {...args}
        {...(isControlled ? { value } : {})}
        onChange={handleChange}
      />
    </div>
  );
}

function VariantMatrixStory() {
  const rows: SearchBarPreviewState[] = ["Rest", "Active", "Error", "Hover", "Completed"];

  function getValue(color: SearchBarColor, state: SearchBarPreviewState) {
    if (state === "Active" && color === "Inverse") {
      return "Honda";
    }

    if (state === "Completed") {
      return color === "Inverse" ? "Honda" : "Search";
    }

    return undefined;
  }

  function getValueProps(color: SearchBarColor, state: SearchBarPreviewState) {
    const value = getValue(color, state);

    return value === undefined ? {} : { value };
  }

  function renderSection(color: SearchBarColor) {
    const sectionSurfaceStyles =
      color === "Solid White"
        ? solidWhiteSurfaceStyles
        : color === "Blue"
          ? blueSurfaceStyles
          : inverseSurfaceStyles;

    return (
      <section key={color} style={{ display: "grid", gap: 20 }}>
        <header style={{ display: "grid", gap: 4 }}>
          <Text brand="Cars24" as="strong" size="md" tone={color === "Inverse" ? "inverse" : "primary"}>
            {color}
          </Text>
          <Text brand="Cars24" as="span" size="xs" tone={color === "Inverse" ? "inverse" : "secondary"}>
            Figma variants inspected across Rest, Active, Error, Hover, and Completed states.
          </Text>
        </header>

        <div style={{ ...sectionSurfaceStyles, display: "grid", gap: 24 }}>
          <div style={matrixHeaderStyles}>
            <div />
            <Text brand="Cars24" as="strong" size="md" tone={color === "Inverse" ? "inverse" : "primary"}>
              Small
            </Text>
            <Text brand="Cars24" as="strong" size="md" tone={color === "Inverse" ? "inverse" : "primary"}>
              Large
            </Text>
          </div>

          <div style={matrixStyles}>
            {rows.flatMap((state) => [
              <div
                key={`${color}-${state}-label`}
                style={{
                  ...rowLabelStyles,
                  color: color === "Inverse" ? "rgba(255, 255, 255, 0.72)" : rowLabelStyles.color
                }}
              >
                {state}
              </div>,
              <SearchBar
                key={`${color}-${state}-small`}
                brand="Cars24"
                color={color}
                forceState={state}
                size="Small"
                {...getValueProps(color, state)}
              />,
              <SearchBar
                key={`${color}-${state}-large`}
                brand="Cars24"
                color={color}
                forceState={state}
                size="Large"
                {...getValueProps(color, state)}
              />
            ])}
          </div>
        </div>
      </section>
    );
  }

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 28 }}>
          {searchBarColors.map(renderSection)}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function ThemeCoverageStory() {
  return (
    <StoryPage>
      <StoryCard>
        <div style={{ display: "grid", gap: 20 }}>
          <header style={{ display: "grid", gap: 6 }}>
            <Text brand="Cars24" as="strong" size="md">
              Theme Coverage
            </Text>
            <Text brand="Cars24" as="span" size="xs" tone="secondary">
              Completed brand-tinted search bars rendered across all supported brand themes.
            </Text>
          </header>

          <div style={{ display: "grid", gap: 20 }}>
            {STORYBOOK_BRAND_OPTIONS.map((brand) => (
              <div key={brand} style={{ display: "grid", gap: 10, width: 336 }}>
                <Text brand={brand} as="strong" size="sm">
                  {brand}
                </Text>
                <SearchBar
                  brand={brand}
                  color="Blue"
                  placeholder="Search"
                  value="Search"
                />
              </div>
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "120px repeat(2, minmax(336px, 1fr))",
  justifyContent: "center",
  rowGap: 20
};

const matrixHeaderStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 24,
  display: "grid",
  gridTemplateColumns: "120px repeat(2, minmax(336px, 1fr))"
};

const rowLabelStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px",
  paddingTop: 10
};

const solidWhiteSurfaceStyles: CSSProperties = {
  background: "#4736FE",
  borderRadius: 20,
  padding: 24
};

const blueSurfaceStyles: CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 20,
  padding: 24
};

const inverseSurfaceStyles: CSSProperties = {
  background: "#0A0A0A",
  borderRadius: 20,
  padding: 24
};

const searchBarVariantsSourceCode = `<StoryPage fullscreen>
  <SearchBar
    brand="Cars24"
    color="Solid White"
    size="Small"
    placeholder="Search"
  />
</StoryPage>`;

const searchBarUiExampleSourceCode = `<SearchBar
  brand="Cars24"
  color="Blue"
  size="Large"
  placeholder="Search"
  value="Search"
/>`;

const SEARCH_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=935-8224&t=1zgOyFpiLYMyM4XM-11";

const meta = {
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
  }
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: PlaygroundStory
};

export const Variants: Story = {
  render: VariantMatrixStory,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: searchBarVariantsSourceCode
      }
    }
  }
};

export const ThemeCoverage: Story = {
  render: ThemeCoverageStory,
  parameters: {
    controls: { disable: true }
  }
};

export const UiExample: Story = {
  render: PlaygroundStory,
  args: {
    brand: "Cars24",
    color: "Blue",
    placeholder: "Search",
    size: "Large",
    value: "Search"
  },
  parameters: {
    docs: {
      source: {
        code: searchBarUiExampleSourceCode
      }
    }
  }
};
