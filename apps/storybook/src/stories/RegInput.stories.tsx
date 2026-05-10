import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  ButtonGroup,
  Icon,
  Module,
  PageHeaderL2,
  RegInput,
  Text,
  type RegInputHelperTone,
  type RegInputTrailingAction,
  type RegInputPreviewState,
  type RegInputProps,
  type RegInputSize
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const regInputSizes: RegInputSize[] = ["Small", "Large"];
const previewStates: RegInputPreviewState[] = ["Rest", "Hover", "Active", "Typing", "Filled", "Disabled"];
const helperTones: RegInputHelperTone[] = ["Default", "Destructive"];
const trailingActions: RegInputTrailingAction[] = ["Camera", "Dismiss", "Search"];
const regInputHeroBurstImageSrc = "https://www.figma.com/api/mcp/asset/7390cbd5-b211-47e8-b5c0-5f092518ea17";
const regInputHeroPersonImageSrc = "https://www.figma.com/api/mcp/asset/6ee42ddb-7409-472d-b355-4f2fa69bbde6";

type RegInputStoryArgs = RegInputProps;

function PlaygroundStory(args: RegInputStoryArgs) {
  const [{ value }, updateArgs] = useArgs<RegInputStoryArgs>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 443 }}>
      <RegInput {...args} {...(isControlled ? { value } : {})} onChange={handleChange} />
    </div>
  );
}

function HeaderCell({ brand, label }: { brand: DisplayBrandId; label: string }) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {label}
    </Text>
  );
}

function StateMatrixStory({
  brand,
  destructive = false,
  forceState,
  helperTone,
  stateLabel,
  trailingAction,
  value
}: {
  brand: DisplayBrandId;
  destructive?: boolean;
  forceState?: RegInputPreviewState;
  helperTone?: RegInputHelperTone;
  stateLabel: string;
  trailingAction: RegInputTrailingAction;
  value?: string;
}) {
  const common = {
    badgeLabel: "IND",
    brand,
    destructive,
    helperText: "Helper text",
    label: "Label",
    placeholder: "(e.g. AB 12 CD 3456)",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    trailingAction,
    ...(forceState ? { forceState } : {}),
    ...(helperTone ? { helperTone } : {}),
    ...(value !== undefined ? { value } : {})
  } satisfies RegInputProps;

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(443px, 1fr))">
        <StoryMatrixCornerCell />
        {regInputSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={120}>
          <HeaderCell brand={brand} label={stateLabel} />
        </StoryMatrixRowLabelCell>
        {regInputSizes.map((size) => (
          <StoryMatrixValueCell key={`${stateLabel}-${size}`} minHeight={120}>
            <RegInput {...common} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildRegInputStateSourceCode({
  destructive = false,
  forceState,
  helperTone,
  label,
  trailingAction,
  value
}: {
  destructive?: boolean;
  forceState?: RegInputPreviewState;
  helperTone?: RegInputHelperTone;
  label: string;
  trailingAction: RegInputTrailingAction;
  value?: string;
}) {
  return `import { RegInput } from "@turbo/web";

export function RegInput${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <RegInput
        brand="Cars24"
        size="Small"
        badgeLabel="IND"
        label="Label"
        placeholder="(e.g. AB 12 CD 3456)"
        helperText="Helper text"
        trailingAction="${trailingAction}"
        required
        showHelperIcon
        showLabelInfoIcon
${destructive ? `        destructive\n` : ""}${forceState ? `        forceState="${forceState}"\n` : ""}${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
      <RegInput
        brand="Cars24"
        size="Large"
        badgeLabel="IND"
        label="Label"
        placeholder="(e.g. AB 12 CD 3456)"
        helperText="Helper text"
        trailingAction="${trailingAction}"
        required
        showHelperIcon
        showLabelInfoIcon
${destructive ? `        destructive\n` : ""}${forceState ? `        forceState="${forceState}"\n` : ""}${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
    </div>
  );
}`;
}

function MobileScreenStory({ brand }: { brand: DisplayBrandId }) {
  return (
    <StoryPage fullscreen>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          padding: "24px"
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            borderRadius: "32px",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.18)",
            maxWidth: "375px",
            overflow: "hidden",
            width: "100%"
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(180deg, #1F6A6D 0%, #1F6A6D 100%)",
              display: "grid",
              gap: "8px",
              overflow: "hidden",
              padding: "12px 12px 0",
              position: "relative"
            }}
          >
            <img
              alt=""
              aria-hidden="true"
              src={regInputHeroBurstImageSrc}
              style={{
                height: "768px",
                left: "-204px",
                maxWidth: "none",
                opacity: 0.4,
                pointerEvents: "none",
                position: "absolute",
                top: "-189px",
                width: "768px"
              }}
            />

            <PageHeaderL2
              action1={{
                icon: <Icon name="alignment-justify-outline" decorative />,
                label: "Open menu"
              }}
              brand={brand}
              showBackButton
              showAction1
              showAction2={false}
              showAvatar={false}
              showTitle={false}
              showSubtitle={false}
              subtitle=""
              title=""
              variant="Dark"
              style={{ background: "transparent", padding: 0 }}
            />

            <div
              style={{
                alignItems: "end",
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "1fr 126px",
                position: "relative"
              }}
            >
              <div style={{ display: "grid", gap: "12px", padding: "12px 0 28px", position: "relative", zIndex: 1 }}>
                <Text
                  brand={brand}
                  as="strong"
                  tone="inverse"
                  style={{ fontSize: "21px", fontWeight: 600, lineHeight: "25px", maxWidth: "210px" }}
                >
                  E-Challan: Check &amp; pay traffic challan
                </Text>

                <Text
                  brand={brand}
                  as="p"
                  tone="inverse"
                  style={{ fontSize: "13px", fontWeight: 500, lineHeight: "18px", maxWidth: "210px", opacity: 0.92 }}
                >
                  Clear all your offline and online challans at one place.
                </Text>

                <div style={{ alignItems: "center", display: "flex", gap: "4px", paddingTop: "8px" }}>
                  <Icon
                    decorative
                    name="shield-badge-check-filled"
                    style={{ color: "#FFF276", fontSize: "16px" }}
                  />
                  <Text
                    brand={brand}
                    as="strong"
                    tone="inverse"
                    style={{ color: "#FFF276", fontSize: "13px", fontWeight: 600, lineHeight: "18px" }}
                  >
                    Verified data from govt.
                  </Text>
                </div>
              </div>

              <div style={{ height: "206px", position: "relative", width: "126px" }}>
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "10px",
                    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.16)",
                    display: "grid",
                    gap: "2px",
                    padding: "10px 12px",
                    position: "absolute",
                    right: "0px",
                    top: "24px",
                    width: "114px",
                    zIndex: 1
                  }}
                >
                  <Text brand={brand} as="strong" size="xs" tone="secondary" style={{ fontWeight: 500, lineHeight: "12px" }}>
                    Over speeding
                  </Text>
                  <Text brand={brand} as="strong" size="md" style={{ color: "#D4693E", lineHeight: "16px" }}>
                    ₹ 5,000
                  </Text>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.12) 100%)",
                    borderRadius: "0 0 32px 32px",
                    bottom: 0,
                    display: "grid",
                    justifyItems: "center",
                    left: "0px",
                    overflow: "hidden",
                    position: "absolute",
                    width: "126px"
                  }}
                >
                  <div
                    style={{
                      height: "206px",
                      position: "relative",
                      width: "126px"
                    }}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      src={regInputHeroPersonImageSrc}
                      style={{
                        bottom: "0",
                        height: "154px",
                        left: "9px",
                        maxWidth: "none",
                        pointerEvents: "none",
                        position: "absolute",
                        width: "103px"
                      }}
                    />
                    <div
                      style={{
                        alignItems: "center",
                        background: "rgba(255,255,255,0.96)",
                        borderRadius: "0 0 999px 999px",
                        display: "grid",
                        height: "108px",
                        justifyItems: "center",
                        left: "17px",
                        position: "absolute",
                        top: "68px",
                        width: "46px"
                      }}
                    >
                    <Icon
                      decorative
                      name="shield-badge-check-filled"
                      style={{ color: "#7B9EA0", fontSize: "40px", marginTop: "-10px" }}
                    />
                    <Icon
                      decorative
                      name="car-front-view-filled"
                      style={{
                        color: "#FFF276",
                        fontSize: "22px",
                        marginTop: "-6px"
                      }}
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "28px 28px 0 0",
              marginTop: "-12px",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <div
              aria-hidden="true"
              style={{
                background: "rgba(100, 116, 139, 0.24)",
                borderRadius: "999px",
                height: "5px",
                left: "50%",
                position: "absolute",
                top: "12px",
                transform: "translateX(-50%)",
                width: "60px"
              }}
            />

            <Module
              bodyMinHeight="auto"
              brand={brand}
              footer={
                <ButtonGroup
                  brand={brand}
                  contextualAction={{
                    label: "Try with phone number",
                    prompt: "Don't remember?",
                    tone: "Brand",
                    trailingIcon: <Icon name="chevron-right-outline" decorative />,
                    underline: false
                  }}
                  primaryAction={{
                    label: "Get challan details"
                  }}
                  size="Large"
                  type="Contextual Action"
                />
              }
              description=""
              showHeaderAction={false}
              showTag={false}
              subtitle=""
              title="Check and pay traffic challans"
              style={{ borderRadius: "28px 28px 0 0", padding: "28px 20px 24px" }}
            >
              <RegInput
                badgeLabel="IND"
                brand={brand}
                helperText="This is the same as your registration number"
                label="Enter your car plate number"
                placeholder="(e.g. AB 12 CD 3456)"
                showHelperIcon={false}
                showLabelInfoIcon={false}
                size="Small"
                trailingAction="Camera"
              />
            </Module>
          </div>
        </div>
      </div>
    </StoryPage>
  );
}

const regInputUiExampleSourceCode = `import {
  ButtonGroup,
  Icon,
  Module,
  PageHeaderL2,
  RegInput,
  Text
} from "@turbo/web";

const burstImageSrc = "${regInputHeroBurstImageSrc}";
const personImageSrc = "${regInputHeroPersonImageSrc}";

export function RegInputMobileScreen() {
  return (
    <div style={{ width: 375, overflow: "hidden", borderRadius: 32, background: "#FFFFFF" }}>
      <div style={{ padding: "12px 12px 0", background: "#1F6A6D", position: "relative", overflow: "hidden" }}>
        <img alt="" aria-hidden="true" src={burstImageSrc} style={{ position: "absolute", left: -204, top: -189, width: 768, height: 768, opacity: 0.4 }} />
        <PageHeaderL2
          brand="Cars24"
          variant="Dark"
          title=""
          showTitle={false}
          subtitle=""
          showSubtitle={false}
          showAction1
          showAction2={false}
          showAvatar={false}
          action1={{
            icon: <Icon name="alignment-justify-outline" decorative />,
            label: "Open menu"
          }}
          style={{ background: "transparent", padding: 0 }}
        />
        <Text as="strong" brand="Cars24" tone="inverse" style={{ fontSize: 21, lineHeight: "25px", fontWeight: 600, maxWidth: 210 }}>
          E-Challan: Check &amp; pay traffic challan
        </Text>
        <Text as="p" brand="Cars24" tone="inverse" style={{ fontSize: 13, lineHeight: "18px", fontWeight: 500, maxWidth: 210 }}>
          Clear all your offline and online challans at one place.
        </Text>
        <img alt="" aria-hidden="true" src={personImageSrc} style={{ position: "absolute", right: 21, bottom: 0, width: 103, height: 154 }} />
      </div>

      <Module
        brand="Cars24"
        bodyMinHeight="auto"
        footer={
          <ButtonGroup
            brand="Cars24"
            contextualAction={{
              label: "Try with phone number",
              prompt: "Don't remember?",
              tone: "Brand",
              trailingIcon: <Icon name="chevron-right-outline" decorative />,
              underline: false
            }}
            primaryAction={{
              label: "Get challan details"
            }}
            size="Large"
            type="Contextual Action"
          />
        }
        description=""
        showHeaderAction={false}
        showTag={false}
        subtitle=""
        title="Check and pay traffic challans"
      >
        <RegInput
          brand="Cars24"
          badgeLabel="IND"
          label="Enter your car plate number"
          placeholder="(e.g. AB 12 CD 3456)"
          helperText="This is the same as your registration number"
          showHelperIcon={false}
          showLabelInfoIcon={false}
          size="Small"
          trailingAction="Camera"
        />
      </Module>
    </div>
  );
}`;

const REG_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=2318-38875&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<RegInputStoryArgs> = {
  title: "Components/Forms/Reg Number",
  component: RegInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(REG_INPUT_FIGMA_URL)
  },
  args: {
    badgeLabel: "IND",
    brand: "Cars24",
    helperText: "Helper text",
    helperTone: "Default",
    label: "Label",
    placeholder: "(e.g. AB 12 CD 3456)",
    required: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small",
    trailingAction: "Camera"
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: regInputSizes
    },
    forceState: {
      control: "select",
      options: [undefined, ...previewStates]
    },
    helperTone: {
      control: "inline-radio",
      options: helperTones
    },
    trailingAction: {
      control: "inline-radio",
      options: trailingActions
    },
    badgeLabel: {
      control: "text"
    },
    label: {
      control: "text"
    },
    helperText: {
      control: "text"
    },
    placeholder: {
      control: "text"
    },
    value: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<RegInputStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" trailingAction="Camera" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildRegInputStateSourceCode({ forceState: "Rest", label: "Rest", trailingAction: "Camera" }) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Hover" stateLabel="Hover" trailingAction="Camera" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildRegInputStateSourceCode({ forceState: "Hover", label: "Hover", trailingAction: "Camera" }) } }
  }
};

export const Active: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Active" stateLabel="Active" trailingAction="Camera" value="" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildRegInputStateSourceCode({ forceState: "Active", label: "Active", trailingAction: "Camera", value: "" }) } }
  }
};

export const Typing: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Typing" stateLabel="Typing" trailingAction="Dismiss" value="AB12" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildRegInputStateSourceCode({ forceState: "Typing", label: "Typing", trailingAction: "Dismiss", value: "AB12" }) } }
  }
};

export const Filled: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Filled" stateLabel="Filled" trailingAction="Dismiss" value="AB12CD3456" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildRegInputStateSourceCode({ forceState: "Filled", label: "Filled", trailingAction: "Dismiss", value: "AB12CD3456" }) } }
  }
};

export const Destructive: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      destructive
      forceState="Rest"
      helperTone="Destructive"
      stateLabel="Destructive"
      trailingAction="Camera"
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRegInputStateSourceCode({
          destructive: true,
          forceState: "Rest",
          helperTone: "Destructive",
          label: "Destructive",
          trailingAction: "Camera"
        })
      }
    }
  }
};

export const DestructiveFilled: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory
      brand={brand}
      destructive
      forceState="Filled"
      helperTone="Destructive"
      stateLabel="Destructive Filled"
      trailingAction="Dismiss"
      value="AB12CD3456"
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildRegInputStateSourceCode({
          destructive: true,
          forceState: "Filled",
          helperTone: "Destructive",
          label: "DestructiveFilled",
          trailingAction: "Dismiss",
          value: "AB12CD3456"
        })
      }
    }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} forceState="Disabled" stateLabel="Disabled" trailingAction="Camera" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildRegInputStateSourceCode({ forceState: "Disabled", label: "Disabled", trailingAction: "Camera" }) } }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <MobileScreenStory brand={brand} />,
  parameters: {
    layout: "fullscreen",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: regInputUiExampleSourceCode
      }
    }
  }
};
