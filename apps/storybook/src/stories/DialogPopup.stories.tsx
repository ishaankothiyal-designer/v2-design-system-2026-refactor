import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { DialogPopup, Icon, Text, type DialogPopupProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const DIALOG_POPUP_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28456-39041&t=MixdbWFumXa9kfBn-11";

type DialogPopupStoryArgs = Omit<DialogPopupProps, "children" | "primaryAction" | "secondaryAction"> & {
  primaryLabel: string;
  secondaryLabel: string;
  showLeadingIcon: boolean;
  showSecondaryAction: boolean;
  showTrailingIcon: boolean;
};

type DialogPopupAction = NonNullable<DialogPopupProps["primaryAction"]>;
type DialogPopupActionStyle = NonNullable<DialogPopupAction["styleVariant"]>;

const dialogTypes: NonNullable<DialogPopupProps["type"]>[] = ["With Header", "Without Header"];

const matrixGridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
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
  styleVariant: DialogPopupActionStyle;
}): DialogPopupAction {
  return {
    label,
    styleVariant,
    ...(showLeadingIcon ? { leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" /> } : {}),
    ...(showTrailingIcon ? { trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" /> } : {})
  };
}

function buildDialogPopupProps(args: DialogPopupStoryArgs): DialogPopupProps {
  const {
    primaryLabel,
    secondaryLabel,
    showLeadingIcon,
    showSecondaryAction,
    showTrailingIcon,
    ...dialogProps
  } = args;
  const brand = dialogProps.brand ?? "Cars24";

  return {
    ...dialogProps,
    brand,
    primaryAction: makeAction({
      brand,
      label: primaryLabel,
      showLeadingIcon,
      showTrailingIcon,
      styleVariant: "Solid"
    }),
    secondaryAction: showSecondaryAction
      ? makeAction({
          brand,
          label: secondaryLabel,
          showLeadingIcon,
          showTrailingIcon,
          styleVariant: "Outline"
        })
      : null
  };
}

function StoryLabel({ brand, children }: { brand: DisplayBrandId; children: ReactNode }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block", margin: 0 }}>
      {children}
    </Text>
  );
}

function PlaygroundStory(args: DialogPopupStoryArgs) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <DialogPopup {...buildDialogPopupProps(args)} />
      </StoryCard>
    </StoryPage>
  );
}

function TypeVariantsStory({ brand = "Cars24" }: Pick<DialogPopupStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={matrixGridStyles}>
        {dialogTypes.map((type) => (
          <StoryCard key={type} style={{ display: "grid", gap: 12, width: "fit-content" }}>
            <StoryLabel brand={activeBrand}>{type}</StoryLabel>
            <DialogPopup brand={activeBrand} type={type} />
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

function CtaVisibilityStory({ brand = "Cars24" }: Pick<DialogPopupStoryArgs, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={matrixGridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>With CTA</StoryLabel>
          <DialogPopup brand={activeBrand} cta />
        </StoryCard>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without CTA</StoryLabel>
          <DialogPopup brand={activeBrand} cta={false} />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const dialogPopupSourceCode = `import { DialogPopup, Icon } from "@turbo/web";

export function Example() {
  return (
    <DialogPopup
      brand="Cars24"
      type="With Header"
      heading="Heading 15px"
      subHeading="Sub heading 12px"
      primaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />
      }}
      secondaryAction={{
        label: "Label",
        leadingIcon: <Icon name="sparkle-filled" decorative />,
        trailingIcon: <Icon name="arrow-right-outline" decorative />,
        styleVariant: "Outline"
      }}
    />
  );
}`;

const meta: Meta<DialogPopupStoryArgs> = {
  title: "Widgets/Dialog Popup",
  component: DialogPopup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(DIALOG_POPUP_FIGMA_URL),
    docs: {
      description: {
        component:
          "Mobile dialog popup overlay with optional header, content slot, close affordance, and horizontal bottom CTA tray."
      },
      source: {
        code: dialogPopupSourceCode
      }
    }
  },
  args: {
    brand: "Cars24",
    closeLabel: "Close dialog",
    cta: true,
    heading: "Heading 15px",
    primaryLabel: "Label",
    secondaryLabel: "Label",
    showCloseButton: true,
    showLeadingIcon: true,
    showSecondaryAction: true,
    showTrailingIcon: true,
    subHeading: "Sub heading 12px",
    subHeadingVisibility: true,
    type: "With Header"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    closeLabel: {
      control: "text"
    },
    cta: {
      control: "boolean"
    },
    heading: {
      control: "text"
    },
    primaryLabel: {
      control: "text"
    },
    secondaryLabel: {
      control: "text"
    },
    showCloseButton: {
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
    },
    subHeading: {
      control: "text"
    },
    subHeadingVisibility: {
      control: "boolean"
    },
    type: {
      control: "radio",
      options: dialogTypes
    },
    onClose: {
      action: "close"
    },
    actionTrayStyle: {
      control: false
    },
    overlayStyle: {
      control: false
    },
    slotStyle: {
      control: false
    },
    style: {
      control: false
    },
    surfaceStyle: {
      control: false
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<DialogPopupStoryArgs>;

export const Playground: Story = {};

export const TypeVariants: Story = {
  render: ({ brand }) => <TypeVariantsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const CtaVisibility: Story = {
  render: ({ brand }) => <CtaVisibilityStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
