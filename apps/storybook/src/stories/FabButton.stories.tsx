import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  FabButton,
  Icon,
  Text,
  type FabButtonPreviewState,
  type FabButtonProps
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

const FAB_BUTTON_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28600-1413&t=h5zc6W2b6MPFvMVS-11";

const documentedStates: Array<{
  key: string;
  label: string;
  disabled?: boolean;
  forceState?: FabButtonPreviewState;
}> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover / Pressed", forceState: "Hover" },
  { key: "disabled", label: "Disabled", disabled: true }
];

type FabButtonStoryArgs = Omit<FabButtonProps, "children" | "icon" | "tagLabel"> & {
  label: string;
  tagLabel: string;
};

function HeaderCell({
  brand,
  label,
  tone = "secondary"
}: {
  brand: DisplayBrandId;
  label: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone={tone} style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function MatrixCell({
  brand,
  disabled,
  forceState,
  showTag
}: {
  brand: DisplayBrandId;
  disabled?: boolean;
  forceState?: FabButtonPreviewState;
  showTag: boolean;
}) {
  return (
    <FabButton
      aria-label="Upload pending for RC image"
      brand={brand}
      icon={<Icon decorative name="arrow-out-of-box-upload-share-outline" />}
      showTag={showTag}
      tagLabel="10"
      {...(disabled ? { disabled: true } : {})}
      {...(forceState ? { forceState } : {})}
    >
      Upload pending for RC image
    </FabButton>
  );
}

function StatesStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="180px repeat(3, minmax(220px, 1fr))">
          <StoryMatrixCornerCell />
          {documentedStates.map((state) => (
            <StoryMatrixHeaderCell key={state.key}>
              <HeaderCell brand={brand} label={state.label} />
            </StoryMatrixHeaderCell>
          ))}

          <StoryMatrixRowLabelCell minHeight={120}>
            <HeaderCell brand={brand} label="Hover expands" tone="primary" />
          </StoryMatrixRowLabelCell>
          {documentedStates.map((state) => (
            <StoryMatrixValueCell key={state.key} minHeight={120}>
              <MatrixCell
                brand={brand}
                showTag
                {...(state.disabled ? { disabled: true } : {})}
                {...(state.forceState ? { forceState: state.forceState } : {})}
              />
            </StoryMatrixValueCell>
          ))}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function TagVisibilityStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="180px repeat(2, minmax(260px, 1fr))">
          <StoryMatrixCornerCell />
          <StoryMatrixHeaderCell>
            <HeaderCell brand={brand} label="Tag visible" />
          </StoryMatrixHeaderCell>
          <StoryMatrixHeaderCell>
            <HeaderCell brand={brand} label="Tag hidden" />
          </StoryMatrixHeaderCell>

          <StoryMatrixRowLabelCell minHeight={120}>
            <HeaderCell brand={brand} label="Default / Hover" tone="primary" />
          </StoryMatrixRowLabelCell>
          <StoryMatrixValueCell minHeight={120}>
            <MatrixCell brand={brand} showTag />
          </StoryMatrixValueCell>
          <StoryMatrixValueCell minHeight={120}>
            <MatrixCell brand={brand} showTag={false} />
          </StoryMatrixValueCell>
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function PlaygroundStory(args: FabButtonStoryArgs) {
  const { label, tagLabel, ...rest } = args;

  return (
    <StoryPreviewSurface>
      <FabButton
        {...rest}
        aria-label={label}
        icon={<Icon decorative name="arrow-out-of-box-upload-share-outline" />}
        tagLabel={tagLabel}
      >
        {label}
      </FabButton>
    </StoryPreviewSurface>
  );
}

function buildPlaygroundSourceCode() {
  return `import { FabButton, Icon } from "@geist/web";

<FabButton
  aria-label="Upload pending for RC image"
  brand="Cars24"
  icon={<Icon name="arrow-out-of-box-upload-share-outline" decorative />}
  showTag
  tagLabel="10"
>
  Upload pending for RC image
</FabButton>`;
}

function buildStatesSourceCode() {
  return `import { FabButton, Icon } from "@geist/web";

<FabButton
  aria-label="Upload pending for RC image"
  brand="Cars24"
  forceState="Hover"
  icon={<Icon name="arrow-out-of-box-upload-share-outline" decorative />}
  showTag
  tagLabel="10"
>
  Upload pending for RC image
</FabButton>`;
}

const meta: Meta<FabButtonStoryArgs> = {
  title: "Components/Buttons/FAB Button",
  component: FabButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(FAB_BUTTON_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    disabled: false,
    label: "Upload pending for RC image",
    showTag: true,
    tagLabel: "10"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    forceState: {
      control: "radio",
      options: ["Rest", "Hover"]
    },
    showTag: {
      control: "boolean"
    },
    tagLabel: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<FabButtonStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered",
    docs: {
      source: {
        code: buildPlaygroundSourceCode()
      }
    }
  }
};

export const States: Story = {
  render: ({ brand = "Cars24" }) => <StatesStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: buildStatesSourceCode()
      }
    }
  }
};

export const TagVisibility: Story = {
  render: ({ brand = "Cars24" }) => <TagVisibilityStory brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
