import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  ActionBar,
  Icon,
  Text,
  type ActionBarAction,
  type ActionBarActionVariant,
  type ActionBarAddressState,
  type ActionBarInfoTone,
  type ActionBarOfferTone,
  type ActionBarProps
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryCard, StoryCopy, StoryPage, StoryPreviewSurface } from "../storybook-shell";

const ACTION_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14353-31213&t=1zgOyFpiLYMyM4XM-11";

const actionVariants: ActionBarActionVariant[] = [
  "Button Group",
  "Loader",
  "Chat Bar",
  "Payment Strip",
  "Payment Option",
  "Payment Breakdown",
  "Strike Amount",
  "Progressive"
];

const infoTones: ActionBarInfoTone[] = ["General", "Brand", "Positive", "Negative", "Warning"];
const offerTones: ActionBarOfferTone[] = ["Brand", "Success", "Danger", "Warning"];

type ActionBarStoryArgs = {
  actionVariant: ActionBarActionVariant;
  addressState: "None" | ActionBarAddressState;
  brand: DisplayBrandId;
  infoTone: ActionBarInfoTone;
  offerTone: ActionBarOfferTone;
  showBottomInfo: boolean;
  showCheckmark: boolean;
  showHomeIndicator: boolean;
  showSecureStrip: boolean;
  topSlot: "None" | "Info" | "Offer";
};

function sampleAction(variant: ActionBarActionVariant): ActionBarAction {
  switch (variant) {
    case "Loader":
      return {
        variant,
        progressPercentage: 40,
        cancelAction: { label: "Cancel" }
      };
    case "Chat Bar":
      return {
        variant,
        state: "Message Typed",
        value: "This is a placeholder message for the chat action bar."
      };
    case "Payment Strip":
      return {
        variant,
        productCountLabel: "1 product",
        totalPrefix: "Total:",
        totalAmount: "₹529",
        actionLabel: "Continue"
      };
    case "Payment Option":
      return {
        variant,
        amount: "₹1200",
        subtitle: "Payment method",
        buttonAction: {
          label: "Pay now",
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      };
    case "Payment Breakdown":
      return {
        variant,
        amount: "₹1200",
        breakdownLabel: "Price breakdown",
        buttonAction: {
          label: "Pay now",
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      };
    case "Strike Amount":
      return {
        variant,
        label: "Total amount",
        amount: "₹1999",
        originalAmount: "₹2999",
        buttonAction: {
          label: "Pay now",
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      };
    case "Progressive":
      return {
        variant,
        backLabel: "Back",
        backLeadingIcon: <Icon name="arrow-left-filled" decorative />,
        buttonAction: {
          label: "Proceed to next",
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      };
    case "Button Group":
    default:
      return {
        variant: "Button Group",
        primaryAction: {
          label: "Label",
          leadingIcon: <Icon name="sparkle-filled" decorative />,
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        },
        secondaryAction: {
          label: "Label",
          leadingIcon: <Icon name="sparkle-filled" decorative />,
          trailingIcon: <Icon name="arrow-right-outline" decorative />
        }
      };
  }
}

function buildStoryProps(args: ActionBarStoryArgs): ActionBarProps {
  return {
    brand: args.brand,
    divider: true,
    action: sampleAction(args.actionVariant),
    ...(args.topSlot === "Info"
      ? {
          infoMessage: {
            tone: args.infoTone,
            description: "Discover the thrilling world of digital innovation."
          }
        }
      : {}),
    ...(args.topSlot === "Offer"
      ? {
          offerStrip: {
            tone: args.offerTone,
            align: "Center",
            label: "₹20 off on this order"
          }
        }
      : {}),
    ...(args.showCheckmark
      ? {
          checkmarkStrip: {
            checked: false,
            description: "Helpful description that could potentially wrap to multiple lines",
            label: "Label",
            showInfoIcon: true
          }
        }
      : {}),
    ...(args.addressState === "Saved"
      ? {
          address: {
            state: "Saved",
            title: "Home",
            addressLine: "Tower C, Sector 39, Medicity, Gurgaon...",
            actionLabel: "Change"
          }
        }
      : {}),
    ...(args.addressState === "Empty"
      ? {
          address: {
            state: "Empty",
            title: "No saved address",
            addressLine: "Add an address",
            actionLabel: "Add new"
          }
        }
      : {}),
    ...(args.showBottomInfo
      ? {
          bottomInfo: {
            message: "Dorem ipsum dolor sit amet, Dorem ipsum dol",
            actionLabel: "Button"
          }
        }
      : {}),
    ...(args.showSecureStrip
      ? {
          secureStrip: {
            text: "Secured by Cars24 security"
          }
        }
      : {}),
    showHomeIndicator: args.showHomeIndicator
  };
}

function Preview({
  props
}: {
  props: ActionBarProps;
}) {
  return (
    <StoryPreviewSurface>
      <ActionBar {...props} />
    </StoryPreviewSurface>
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

function ActionVariantsDocument({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <HeaderCell brand={brand} label="Action variants" />
          <StoryCopy brand={brand} size="sm">
            The action slot reuses the existing button primitives where the repo already has an approved pattern, and fills the remaining payment/chat rows with token-driven custom composition.
          </StoryCopy>
        </div>
        <StoryMatrix columns="220px minmax(420px, 1fr)">
          {actionVariants.flatMap((variant) => [
            <StoryMatrixRowLabelCell key={`${variant}-label`} minHeight={176}>
              <HeaderCell brand={brand} label={variant} />
            </StoryMatrixRowLabelCell>,
            <StoryMatrixValueCell key={`${variant}-value`} minHeight={176}>
              <Preview
                props={{
                  brand,
                  divider: true,
                  action: sampleAction(variant)
                }}
              />
            </StoryMatrixValueCell>
          ])}
        </StoryMatrix>
      </StoryCard>
    </StoryPage>
  );
}

function StripVariantsDocument({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 32 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <HeaderCell brand={brand} label="Info message tones" />
          <div style={{ display: "grid", gap: 12 }}>
            {infoTones.map((tone) => (
              <Preview
                key={`info-${tone}`}
                props={{
                  brand,
                  divider: true,
                  infoMessage: {
                    tone,
                    description: "Discover the thrilling world of digital innovation."
                  },
                  action: null
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <HeaderCell brand={brand} label="Offer strip tones" />
          <div style={{ display: "grid", gap: 12 }}>
            {offerTones.flatMap((tone) => [
              <Preview
                key={`offer-${tone}-center`}
                props={{
                  brand,
                  divider: true,
                  offerStrip: {
                    tone,
                    align: "Center",
                    label: "₹20 off on this order"
                  },
                  action: null
                }}
              />,
              <Preview
                key={`offer-${tone}-start`}
                props={{
                  brand,
                  divider: true,
                  offerStrip: {
                    tone,
                    align: "Start",
                    label: "₹20 off on this order"
                  },
                  action: null
                }}
              />
            ])}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <HeaderCell brand={brand} label="Address and assurance rows" />
          <div style={{ display: "grid", gap: 12 }}>
            <Preview
              props={{
                brand,
                divider: true,
                address: {
                  state: "Saved",
                  title: "Home",
                  addressLine: "Tower C, Sector 39, Medicity, Gurgaon...",
                  actionLabel: "Change"
                },
                action: null
              }}
            />
            <Preview
              props={{
                brand,
                divider: true,
                address: {
                  state: "Empty",
                  title: "No saved address",
                  addressLine: "Add an address",
                  actionLabel: "Add new"
                },
                action: null
              }}
            />
            <Preview
              props={{
                brand,
                divider: true,
                checkmarkStrip: {
                  checked: false,
                  description: "Helpful description that could potentially wrap to multiple lines",
                  label: "Label",
                  showInfoIcon: true,
                  showTooltip: true
                },
                action: null
              }}
            />
            <Preview
              props={{
                brand,
                divider: true,
                bottomInfo: {
                  message: "Dorem ipsum dolor sit amet, Dorem ipsum dol",
                  actionLabel: "Button"
                },
                secureStrip: {
                  text: "Secured by Cars24 security"
                },
                action: null
              }}
            />
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const meta: Meta<ActionBarStoryArgs> = {
  title: "Widgets/Action Bar",
  component: ActionBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(ACTION_BAR_FIGMA_URL)
  },
  args: {
    actionVariant: "Button Group",
    addressState: "Saved",
    brand: "Cars24",
    infoTone: "General",
    offerTone: "Brand",
    showBottomInfo: true,
    showCheckmark: true,
    showHomeIndicator: true,
    showSecureStrip: true,
    topSlot: "Info"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    actionVariant: {
      control: "select",
      options: actionVariants
    },
    topSlot: {
      control: "inline-radio",
      options: ["None", "Info", "Offer"]
    },
    infoTone: {
      control: "select",
      options: infoTones
    },
    offerTone: {
      control: "select",
      options: offerTones
    },
    addressState: {
      control: "inline-radio",
      options: ["None", "Saved", "Empty"]
    },
    showCheckmark: {
      control: "boolean"
    },
    showBottomInfo: {
      control: "boolean"
    },
    showSecureStrip: {
      control: "boolean"
    },
    showHomeIndicator: {
      control: "boolean"
    }
  },
  render: (args) => <Preview props={buildStoryProps(args)} />
};

export default meta;

type Story = StoryObj<ActionBarStoryArgs>;

export const Playground: Story = {};

export const ActionVariants: Story = {
  render: ({ brand = "Cars24" }) => <ActionVariantsDocument brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const StripVariants: Story = {
  render: ({ brand = "Cars24" }) => <StripVariantsDocument brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const FullStackExample: Story = {
  render: ({ brand = "Cars24" }) => (
    <Preview
      props={{
        brand,
        divider: true,
        infoMessage: {
          tone: "General",
          description: "Discover the thrilling world of digital innovation."
        },
        checkmarkStrip: {
          checked: false,
          description: "Helpful description that could potentially wrap to multiple lines",
          label: "Label",
          showInfoIcon: true
        },
        address: {
          state: "Saved",
          title: "Home",
          addressLine: "Tower C, Sector 39, Medicity, Gurgaon...",
          actionLabel: "Change"
        },
        action: sampleAction("Button Group"),
        bottomInfo: {
          message: "Dorem ipsum dolor sit amet, Dorem ipsum dol",
          actionLabel: "Button"
        },
        secureStrip: {
          text: "Secured by Cars24 security"
        },
        showHomeIndicator: true
      }}
    />
  ),
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
