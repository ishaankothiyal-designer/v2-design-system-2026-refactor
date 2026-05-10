import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@turbo/tokens";
import {
  BackToTopButton,
  Text,
  type BackToTopButtonPreviewState,
  type BackToTopButtonProps
} from "@turbo/web";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryPage, StoryPreviewSurface } from "../storybook-shell";

type BackToTopButtonStoryArgs = Omit<BackToTopButtonProps, "children"> & {
  label: string;
};

function HeaderCell({
  brand,
  label,
  tone = "secondary"
}: {
  brand: NonNullable<BackToTopButtonProps["brand"]>;
  label: string;
  tone?: "primary" | "secondary" | "inverse";
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
  inverse
}: {
  brand: NonNullable<BackToTopButtonProps["brand"]>;
  disabled?: boolean;
  forceState?: BackToTopButtonPreviewState;
  inverse?: boolean;
}) {
  return (
    <BackToTopButton
      brand={brand}
      {...(inverse !== undefined ? { inverse } : {})}
      {...(disabled ? { disabled: true } : {})}
      {...(forceState ? { forceState } : {})}
    >
      Go to top
    </BackToTopButton>
  );
}

function StateDocument({
  brand,
  disabled,
  forceState
}: {
  brand?: NonNullable<BackToTopButtonProps["brand"]>;
  disabled?: boolean;
  forceState?: BackToTopButtonPreviewState;
}) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <StoryMatrix columns="180px repeat(2, minmax(240px, 1fr))">
          <StoryMatrixCornerCell />
          <StoryMatrixHeaderCell>
            <HeaderCell brand={activeBrand} label="Light" />
          </StoryMatrixHeaderCell>
          <StoryMatrixHeaderCell tone="inverse">
            <HeaderCell brand={activeBrand} label="Inverse" tone="inverse" />
          </StoryMatrixHeaderCell>

          {[
            <StoryMatrixRowLabelCell key={`${activeBrand}-label`} minHeight={116}>
              <HeaderCell brand={activeBrand} label={activeBrand} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`${activeBrand}-light`} minHeight={116}>
              <MatrixCell
                brand={activeBrand}
                {...(disabled ? { disabled: true } : {})}
                {...(forceState ? { forceState } : {})}
              />
            </StoryMatrixValueCell>,
            <StoryMatrixValueCell key={`${activeBrand}-inverse`} minHeight={116} tone="inverse">
              <MatrixCell
                brand={activeBrand}
                inverse
                {...(disabled ? { disabled: true } : {})}
                {...(forceState ? { forceState } : {})}
              />
            </StoryMatrixValueCell>
          ]}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function PlaygroundStory(args: BackToTopButtonStoryArgs) {
  const { label, ...rest } = args;

  return (
    <StoryPreviewSurface onDark={Boolean(rest.inverse)}>
      <BackToTopButton {...rest}>{label}</BackToTopButton>
    </StoryPreviewSurface>
  );
}

function buildBackToTopStateSourceCode({
  forceState,
  disabled = false
}: {
  forceState?: BackToTopButtonPreviewState;
  disabled?: boolean;
}) {
  const stateProps = disabled
    ? " disabled"
    : forceState
      ? ` forceState="${forceState}"`
      : "";

  return `<BackToTopButton brand="Cars24"${stateProps}>
  Go to top
</BackToTopButton>

<BackToTopButton brand="Cars24" inverse${stateProps}>
  Go to top
</BackToTopButton>`;
}

const backToTopUiExampleSourceCode = `<BackToTopButton brand="Cars24">
  Go to top
</BackToTopButton>`;

const meta: Meta<BackToTopButtonStoryArgs> = {
  title: "Components/Back To Top Button",
  component: BackToTopButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  args: {
    brand: "Cars24",
    disabled: false,
    inverse: false,
    label: "Go to top"
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
    inverse: {
      control: "boolean"
    }
  }
};

export default meta;

type Story = StoryObj<BackToTopButtonStoryArgs>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateDocument brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildBackToTopStateSourceCode({})
      }
    }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => <StateDocument brand={brand} forceState="Hover" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildBackToTopStateSourceCode({ forceState: "Hover" })
      }
    }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => <StateDocument brand={brand} disabled />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildBackToTopStateSourceCode({ disabled: true })
      }
    }
  }
};

export const UIExample: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: backToTopUiExampleSourceCode
      }
    }
  }
};
