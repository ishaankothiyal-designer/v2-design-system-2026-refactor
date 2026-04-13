import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import { Consent, Text, type ConsentProps, type ConsentSize } from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

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

function StateMatrixStory({
  brand,
  checked,
  label
}: {
  brand: DisplayBrandId;
  checked: boolean;
  label: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(3, minmax(0, 368px))">
        <StoryMatrixCornerCell />
        {consentSizes.map((size) => (
          <StoryMatrixHeaderCell key={`inline-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={112}>
          <HeaderCell brand={brand} label="Inline" />
        </StoryMatrixRowLabelCell>
        {consentSizes.map((size) => (
          <StoryMatrixValueCell key={`inline-${size}`} minHeight={112}>
            <VariantCell brand={brand} checked={checked} insideCard={false} label={label} size={size} />
          </StoryMatrixValueCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={112}>
          <HeaderCell brand={brand} label="Inside Card" />
        </StoryMatrixRowLabelCell>
        {consentSizes.map((size) => (
          <StoryMatrixValueCell key={`card-${size}`} minHeight={112}>
            <VariantCell brand={brand} checked={checked} insideCard label={label} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildConsentStateSourceCode(state: (typeof consentStates)[number]) {
  return `import { Consent } from "@geist/web";

const sizes = ["Small", "Medium", "Large"] as const;

export function Consent${state.label}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        {sizes.map((size) => (
          <Consent
            key={size}
            brand="Cars24"
            size={size}
            label="${defaultConsentLabel}"
            checked={${state.checked}}
          />
        ))}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {sizes.map((size) => (
          <Consent
            key={\`\${size}-card\`}
            brand="Cars24"
            size={size}
            insideCard
            label="${defaultConsentLabel}"
            checked={${state.checked}}
          />
        ))}
      </div>
    </div>
  );
}`;
}

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

export const Rest: Story = {
  render: ({ brand = "Cars24", label }) => <StateMatrixStory brand={brand} checked={false} label={label} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildConsentStateSourceCode(consentStates[0])
      }
    }
  }
};

export const Selected: Story = {
  render: ({ brand = "Cars24", label }) => <StateMatrixStory brand={brand} checked label={label} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildConsentStateSourceCode(consentStates[1])
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
