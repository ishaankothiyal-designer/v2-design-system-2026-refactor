import type { ChangeEvent, CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog, type DisplayBrandId } from "@geist/tokens";
import { Consent, Text, type ConsentProps, type ConsentSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const consentSizes: ConsentSize[] = ["Small", "Medium", "Large"];
const consentStates = [
  { key: "rest", label: "Rest", checked: false },
  { key: "selected", label: "Selected", checked: true }
] as const;
const defaultConsentLabel =
  "By clicking 'Submit,' I consent to Cars24 collecting and using my personal data (name, phone, email) to process my car valuation and contact me regarding the sale.";

type ConsentStoryArgs = Omit<ConsentProps, "label"> & {
  label: string;
};

function PlaygroundStory(args: ConsentStoryArgs) {
  const [{ checked = false }, updateArgs] = useArgs<ConsentStoryArgs>();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    updateArgs({ checked: event.currentTarget.checked });
    args.onChange?.(event);
  }

  return (
    <div style={{ width: 328 }}>
      <Consent {...args} checked={checked} label={args.label} onChange={handleChange} />
    </div>
  );
}

function VariantCell({
  brand,
  checked,
  insideCard,
  label,
  size
}: {
  brand: DisplayBrandId;
  checked: boolean;
  insideCard: boolean;
  label: string;
  size: ConsentSize;
}) {
  return (
    <div style={{ width: 328 }}>
      <Consent brand={brand} checked={checked} insideCard={insideCard} label={label} size={size} />
    </div>
  );
}

function SectionHeading({
  brand,
  description,
  title
}: {
  brand: DisplayBrandId;
  description: string;
  title: string;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <Text brand={brand} as="strong" size="md">
        {title}
      </Text>
      <Text brand={brand} as="p" size="sm" tone="secondary" style={{ margin: 0 }}>
        {description}
      </Text>
    </div>
  );
}

function HeaderCell({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function VariantMatrix({
  brand,
  label,
  insideCard
}: {
  brand: DisplayBrandId;
  insideCard: boolean;
  label: string;
}) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <SectionHeading
        brand={brand}
        description={
          insideCard
            ? "Card-backed variants use the Figma surface, padding, and radius tokens for the wrapped state."
            : "Inline variants keep the component fluid while preserving the Figma spacing and typography scale."
        }
        title={insideCard ? "Inside Card" : "Inline"}
      />
      <div style={matrixTableStyles()}>
        <div style={matrixCornerCellStyles} />
        {consentSizes.map((size) => (
          <div key={`${insideCard}-${size}-header`} style={matrixHeaderCellStyles}>
            <HeaderCell brand={brand} label={size} />
          </div>
        ))}

        {consentStates.flatMap((state) => [
          <div key={`${insideCard}-${state.key}-label`} style={matrixRowLabelCellStyles}>
            <HeaderCell brand={brand} label={state.label} />
          </div>,
          ...consentSizes.map((size) => (
            <div key={`${insideCard}-${state.key}-${size}`} style={matrixValueCellStyles}>
              <VariantCell
                brand={brand}
                checked={state.checked}
                insideCard={insideCard}
                label={label}
                size={size}
              />
            </div>
          ))
        ])}
      </div>
    </div>
  );
}

function VariantMatrixStory({
  brand,
  label
}: {
  brand: DisplayBrandId;
  label: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 32 }}>
          <VariantMatrix brand={brand} insideCard={false} label={label} />
          <VariantMatrix brand={brand} insideCard label={label} />
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function matrixTableStyles(): CSSProperties {
  return {
    border: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
    borderRadius: 20,
    display: "grid",
    gridTemplateColumns: "180px repeat(3, minmax(0, 368px))",
    overflow: "hidden"
  };
}

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

const matrixCornerCellStyles: CSSProperties = {
  background: String(coreTokenCatalog.color.surface.canvas),
  borderBottom: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  minHeight: 68
};

const matrixRowLabelCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "flex",
  justifyContent: "flex-start",
  minHeight: 112,
  padding: "20px 16px"
};

const matrixValueCellStyles: CSSProperties = {
  alignItems: "center",
  background: String(coreTokenCatalog.color.surface.canvas),
  borderLeft: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  borderTop: `1px dashed ${String(coreTokenCatalog.color.border.default)}`,
  display: "grid",
  minHeight: 112,
  padding: "20px"
};

const consentVariantsSourceCode = `<div style={{ display: "grid", gap: 24 }}>
  <Consent
    brand="Cars24"
    size="Small"
    label="${defaultConsentLabel}"
  />
  <Consent
    brand="Cars24"
    size="Medium"
    label="${defaultConsentLabel}"
    checked
  />
  <Consent
    brand="Cars24"
    size="Large"
    insideCard
    label="${defaultConsentLabel}"
  />
</div>`;

const consentUiExampleSourceCode = `<Consent
  brand="Cars24"
  size="Medium"
  checked
  label="${defaultConsentLabel}"
/>`;

const CONSENT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14902-6033&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<ConsentStoryArgs> = {
  title: "Components/Forms/Consent",
  component: Consent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(CONSENT_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    checked: false,
    label: defaultConsentLabel,
    insideCard: false,
    size: "Medium"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: consentSizes
    },
    checked: {
      control: "boolean"
    },
    insideCard: {
      control: "boolean"
    },
    label: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<ConsentStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: (args) => <VariantMatrixStory brand={args.brand ?? "Cars24"} label={args.label} />,
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: consentVariantsSourceCode
      }
    }
  }
};

export const UIExample: Story = {
  render: PlaygroundStory,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: consentUiExampleSourceCode
      }
    }
  }
};
