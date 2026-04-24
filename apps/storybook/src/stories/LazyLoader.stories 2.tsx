import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { LazyLoader, type LazyLoaderProps } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage, StoryPreviewSurface } from "../storybook-shell";

const LAZY_LOADER_FIGMA_URL =
  "https://www.figma.com/design/skMLeeIF8mbzAT265CI8nP/-TEST--Design-Language-System--DLS-v2.0-2026-?node-id=11205-2484&t=mYprHpRuZtMoNQg1-11";

function PlaygroundStory(args: LazyLoaderProps) {
  return <LazyLoader {...args} />;
}

function DocumentedSpecStory({ brand = "Cars24" }: Pick<LazyLoaderProps, "brand">) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <StoryHeading>Documented Figma Spec</StoryHeading>
          <StoryCopy>
            The published Lazy Loader node is a single rest-state component with no exposed variants, sizes, or
            alternate states. The canonical web component preserves the exact 210x32 footprint and gradient treatment
            from the Figma source.
          </StoryCopy>
        </div>

        <StoryPreviewSurface>
          <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
            <div style={specLabelStyles}>Default node</div>
            <LazyLoader brand={brand} />
          </div>
        </StoryPreviewSurface>
      </StoryCard>
    </StoryPage>
  );
}

function BrandGalleryStory() {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <StoryHeading>Brand Review</StoryHeading>
          <StoryCopy>
            Lazy Loader has no Figma variant axes, so the visual review focuses on the shared canonical spec across the
            supported brand scopes.
          </StoryCopy>
        </div>

        <div style={brandGridStyles}>
          {STORYBOOK_BRAND_OPTIONS.map((brand) => (
            <div key={brand} style={brandCardStyles}>
              <div style={brandLabelStyles}>{brand}</div>
              <LazyLoader brand={brand as DisplayBrandId} />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const brandGridStyles: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
};

const brandCardStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderRadius: 20,
  display: "grid",
  gap: 12,
  padding: 20
};

const brandLabelStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const specLabelStyles: CSSProperties = {
  color: String(coreTokenCatalog.color.text.secondary),
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const lazyLoaderUiExampleSourceCode = `import { LazyLoader } from "@geist/web";

export function Example() {
  return <LazyLoader width={320} height={40} />;
}`;

const meta: Meta<typeof LazyLoader> = {
  title: "Components/Lazy Loader",
  component: LazyLoader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: createFigspecDesign(LAZY_LOADER_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    width: 210,
    height: 32
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    width: {
      control: { type: "number", min: 32, max: 640, step: 1 },
      table: {
        category: "Usage overrides"
      }
    },
    height: {
      control: { type: "number", min: 8, max: 160, step: 1 },
      table: {
        category: "Usage overrides"
      }
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DocumentedSpec: Story = {
  render: ({ brand = "Cars24" }) => <DocumentedSpecStory brand={brand} />,
  parameters: {
    controls: { include: ["brand"] },
    layout: "fullscreen"
  }
};

export const BrandGallery: Story = {
  render: () => <BrandGalleryStory />,
  parameters: {
    controls: { disable: true },
    layout: "fullscreen"
  }
};

export const UIExample: Story = {
  parameters: {
    docs: {
      source: {
        code: lazyLoaderUiExampleSourceCode
      }
    }
  }
};
