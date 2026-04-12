import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  RatingState,
  Ratings,
  Text,
  type RatingStateSize,
  type RatingStateValue,
  type RatingsProps,
  type RatingsSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const RATINGS_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=6887-40171&p=f&t=1zgOyFpiLYMyM4XM-11";

const ratingValues = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;
const ratingSizes: RatingsSize[] = ["Small", "Medium"];
const ratingStateSizes: RatingStateSize[] = ["Small", "Medium", "Large"];
const ratingStates: RatingStateValue[] = ["Default", "Half Star", "Full Star"];

function PlaygroundStory(args: RatingsProps) {
  return <Ratings {...args} />;
}

function SectionHeading({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand="Cars24" as="strong" size="md">
        {title}
      </Text>
      {description ? (
        <Text brand="Cars24" as="p" size="sm" tone="secondary">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

function LockupMatrixStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Lockup Matrix"
            description="The visible canonical lockup variants cover Small and Medium sizes across the full 0.0 to 5.0 scale in 0.5 steps."
          />
          <div style={matrixTableStyles}>
            <div style={matrixCornerCellStyles} />
            {ratingSizes.map((size) => (
              <div key={`ratings-size-${size}`} style={matrixHeaderCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {size}
                </Text>
              </div>
            ))}

            {ratingValues.flatMap((value) => [
              <div key={`rating-label-${value}`} style={matrixRowLabelCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {value.toFixed(1)}
                </Text>
              </div>,
              ...ratingSizes.map((size) => (
                <div key={`rating-cell-${size}-${value}`} style={matrixValueCellStyles}>
                  <Ratings rating={value} size={size} />
                </div>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function StateMatrixStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionHeading
            title="Visible States"
            description="The underlying star-state master exposes Small, Medium, and Large glyphs for Default, Half Star, and Full Star."
          />
          <div style={stateTableStyles}>
            <div style={matrixCornerCellStyles} />
            {ratingStates.map((state) => (
              <div key={`rating-state-header-${state}`} style={matrixHeaderCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {state}
                </Text>
              </div>
            ))}

            {ratingStateSizes.flatMap((size) => [
              <div key={`rating-state-size-${size}`} style={matrixRowLabelCellStyles}>
                <Text brand="Cars24" as="strong" size="sm">
                  {size}
                </Text>
              </div>,
              ...ratingStates.map((state) => (
                <div key={`rating-state-cell-${size}-${state}`} style={stateValueCellStyles}>
                  <RatingState size={size} state={state} />
                </div>
              ))
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixTableStyles: CSSProperties = {
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  display: "grid",
  gridTemplateColumns: "140px repeat(2, minmax(240px, 1fr))",
  overflow: "hidden"
};

const stateTableStyles: CSSProperties = {
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  display: "grid",
  gridTemplateColumns: "140px repeat(3, minmax(180px, 1fr))",
  overflow: "hidden"
};

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 64
};

const matrixHeaderCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 64,
  padding: "16px 20px"
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 72,
  padding: "16px 20px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "center",
  minHeight: 72,
  padding: "16px 20px"
};

const stateValueCellStyles: CSSProperties = {
  ...matrixValueCellStyles,
  minHeight: 96
};

const ratingsSourceCode = `import { Ratings } from "@geist/web";

export function Example() {
  return <Ratings rating={4.5} size="Medium" />;
}`;

const meta = {
  title: "Components/Ratings",
  component: Ratings,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(RATINGS_FIGMA_URL),
    docs: {
      source: {
        code: ratingsSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    rating: 4.5,
    size: "Medium"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    rating: {
      control: { type: "number", min: 0, max: 5, step: 0.5 }
    },
    size: {
      control: "inline-radio",
      options: ratingSizes
    },
    max: {
      control: { disable: true }
    },
    labelFormatter: {
      control: { disable: true }
    }
  }
} satisfies Meta<typeof Ratings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />
};

export const AllRatings: Story = {
  name: "All Ratings",
  render: () => <LockupMatrixStory />,
  parameters: {
    controls: { disable: true }
  }
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => <StateMatrixStory />,
  parameters: {
    controls: { disable: true }
  }
};
