import { useState } from "react";
import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  AppHeader,
  Button,
  CheckboxLabel,
  Divider,
  Icon,
  type PhoneInputCountry,
  PhoneInput,
  SectionHeader,
  SocialButton,
  Text,
  getRequiredThemeTokenValue,
  type PhoneInputHelperTone,
  type PhoneInputPreviewState,
  type PhoneInputProps,
  type PhoneInputSize
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

const phoneInputSizes: PhoneInputSize[] = ["Small", "Large"];
const previewStates: PhoneInputPreviewState[] = ["Rest", "Hover", "Active", "Typing", "Filled"];
const helperTones: PhoneInputHelperTone[] = ["Default", "Destructive"];
const phoneInputCountries: PhoneInputCountry[] = ["India", "UAE", "Australia"];
const loginHeroSrc = new URL("./assets/login-hero.png", import.meta.url).href;
const carinfoLoginHeroSrc = new URL("./assets/carinfo-login-hero.png", import.meta.url).href;
const vehicleinfoLoginHeroSrc = new URL("./assets/vehicleinfo-login-hero.png", import.meta.url).href;

function getLoginHeroAsset(brand: DisplayBrandId) {
  switch (brand) {
    case "CarInfo":
      return {
        src: carinfoLoginHeroSrc,
        position: "center top"
      };
    case "VehicleInfo":
      return {
        src: vehicleinfoLoginHeroSrc,
        position: "center top"
      };
    default:
      return {
        src: loginHeroSrc,
        position: "center top"
      };
  }
}

function getLoginHeaderVariant(brand: DisplayBrandId) {
  switch (brand) {
    case "CarInfo":
    case "VehicleInfo":
      return "Light" as const;
    default:
      return "Brand" as const;
  }
}

function getLoginHeaderLogo(brand: DisplayBrandId) {
  if (brand === "VehicleInfo") {
    return <span aria-hidden="true" />;
  }

  return undefined;
}

function DeviceStatusBar({ brand }: { brand: DisplayBrandId }) {
  const foreground = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 12px 4px"
      }}
    >
      <Text
        as="strong"
        brand={brand}
        style={{
          color: foreground,
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: "22px"
        }}
      >
        09:41
      </Text>

      <div style={{ alignItems: "center", color: foreground, display: "flex", gap: 6 }}>
        <div style={{ alignItems: "end", display: "flex", gap: 2, height: 12 }}>
          {[5, 7, 9, 11].map((height, index) => (
            <span
              key={`signal-${index}`}
              style={{
                background: foreground,
                borderRadius: 999,
                display: "block",
                height,
                opacity: 0.95,
                width: 3
              }}
            />
          ))}
        </div>

        <div
          aria-hidden="true"
          style={{
            height: 12,
            position: "relative",
            width: 17
          }}
        >
          <span
            style={{
              borderColor: foreground,
              borderRadius: "50%",
              borderStyle: "solid",
              borderWidth: "0 0 2px 0",
              display: "block",
              height: 10,
              left: 0,
              opacity: 0.95,
              position: "absolute",
              top: 1,
              width: 16
            }}
          />
          <span
            style={{
              borderColor: foreground,
              borderRadius: "50%",
              borderStyle: "solid",
              borderWidth: "0 0 2px 0",
              display: "block",
              height: 7,
              left: 3,
              opacity: 0.95,
              position: "absolute",
              top: 3,
              width: 10
            }}
          />
          <span
            style={{
              background: foreground,
              borderRadius: 999,
              display: "block",
              height: 2,
              left: 7,
              opacity: 0.95,
              position: "absolute",
              top: 8,
              width: 3
            }}
          />
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 1
          }}
        >
          <div
            style={{
              border: `1.5px solid ${foreground}`,
              borderRadius: 4,
              boxSizing: "border-box",
              height: 12,
              padding: 1.5,
              width: 24
            }}
          >
            <span
              style={{
                background: foreground,
                borderRadius: 2,
                display: "block",
                height: "100%",
                width: "75%"
              }}
            />
          </div>
          <span
            style={{
              background: foreground,
              borderRadius: 999,
              display: "block",
              height: 4,
              opacity: 0.9,
              width: 1.5
            }}
          />
        </div>
      </div>
    </div>
  );
}

type PhoneInputStoryArgs = PhoneInputProps;

function PlaygroundStory(args: PhoneInputStoryArgs) {
  return (
    <div style={{ width: 328 }}>
      <PhoneInput {...args} />
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
  disabled = false,
  forceState,
  helperTone,
  stateLabel,
  value
}: {
  brand: DisplayBrandId;
  destructive?: boolean;
  disabled?: boolean;
  forceState?: PhoneInputPreviewState;
  helperTone?: PhoneInputHelperTone;
  stateLabel: string;
  value?: string;
}) {
  const common = {
    brand,
    country: "India" as const,
    destructive,
    disabled,
    helperText: "Helper text",
    label: "Label",
    placeholder: "9876543210",
    required: true,
    showCountryChevron: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    ...(forceState ? { forceState } : {}),
    ...(helperTone ? { helperTone } : {}),
    ...(value !== undefined ? { value } : {})
  } satisfies PhoneInputProps;

  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px repeat(2, minmax(328px, 1fr))">
        <StoryMatrixCornerCell />
        {phoneInputSizes.map((size) => (
          <StoryMatrixHeaderCell key={`${stateLabel}-${size}-header`}>
            <HeaderCell brand={brand} label={size} />
          </StoryMatrixHeaderCell>
        ))}

        <StoryMatrixRowLabelCell minHeight={120}>
          <HeaderCell brand={brand} label={stateLabel} />
        </StoryMatrixRowLabelCell>
        {phoneInputSizes.map((size) => (
          <StoryMatrixValueCell key={`${stateLabel}-${size}`} minHeight={120}>
            <PhoneInput {...common} size={size} />
          </StoryMatrixValueCell>
        ))}
      </StoryMatrix>
    </StoryPage>
  );
}

function buildPhoneInputStateSourceCode({
  destructive = false,
  disabled = false,
  forceState,
  helperTone,
  label,
  value
}: {
  destructive?: boolean;
  disabled?: boolean;
  forceState?: PhoneInputPreviewState;
  helperTone?: PhoneInputHelperTone;
  label: string;
  value?: string;
}) {
  return `import { PhoneInput } from "@turbo/web";

export function PhoneInput${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <PhoneInput
        brand="Cars24"
        size="Small"
        country="India"
        label="Label"
        placeholder="9876543210"
        helperText="Helper text"
        required
        showCountryChevron
        showHelperIcon
        showLabelInfoIcon
${destructive ? `        destructive\n` : ""}${disabled ? `        disabled\n` : ""}${forceState ? `        forceState="${forceState}"\n` : ""}${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
      <PhoneInput
        brand="Cars24"
        size="Large"
        country="India"
        label="Label"
        placeholder="9876543210"
        helperText="Helper text"
        required
        showCountryChevron
        showHelperIcon
        showLabelInfoIcon
${destructive ? `        destructive\n` : ""}${disabled ? `        disabled\n` : ""}${forceState ? `        forceState="${forceState}"\n` : ""}${helperTone ? `        helperTone="${helperTone}"\n` : ""}${value !== undefined ? `        value="${value}"\n` : ""}      />
    </div>
  );
}`;
}

const phoneInputUiExampleSourceCode = `<PhoneInput
  brand="Cars24"
  defaultCountry="India"
  placeholder="99998 99999"
/>`;

function MobileAuthExampleStory({ brand = "Cars24" }: { brand: DisplayBrandId }) {
  const [phoneValue, setPhoneValue] = useState("");
  const [whatsAppOptIn, setWhatsAppOptIn] = useState(true);
  const heroAsset = getLoginHeroAsset(brand);
  const headerLogo = getLoginHeaderLogo(brand);
  const headerVariant = getLoginHeaderVariant(brand);
  const brandPrimary = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const textSecondary = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));
  const borderDefault = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const success = String(getRequiredThemeTokenValue(brand, "color.status.success"));
  const radiusXl = Number(getRequiredThemeTokenValue(brand, "radius.xl"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const spacing4 = Number(getRequiredThemeTokenValue(brand, "spacing.4"));
  const spacing5 = Number(getRequiredThemeTokenValue(brand, "spacing.5"));
  const spacing6 = Number(getRequiredThemeTokenValue(brand, "spacing.6"));

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    setPhoneValue(event.currentTarget.value);
  }

  function handleOptInChange(event: ChangeEvent<HTMLInputElement>) {
    setWhatsAppOptIn(event.currentTarget.checked);
  }

  return (
    <StoryPage>
      <div
        style={{
          background: "#F3F4F6",
          display: "flex",
          justifyContent: "center",
          padding: 24,
          width: "100%"
        }}
      >
        <div
          style={{
            background: surfaceCanvas,
            border: `1px solid ${borderDefault}`,
            borderRadius: 32,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
            display: "flex",
            flexDirection: "column",
            height: 780,
            overflow: "hidden",
            position: "relative",
            width: 360
          }}
        >
          <div
            style={{
              backgroundColor: brandPrimary,
              backgroundImage: `url(${heroAsset.src})`,
              backgroundPosition: heroAsset.position,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              flexShrink: 0,
              height: 356,
              overflow: "hidden",
              padding: "16px 16px 0",
              position: "relative"
            }}
          >
            <DeviceStatusBar brand={brand} />

            <AppHeader
              brand={brand}
              level="Page - L1"
              logo={headerLogo}
              pillAction={{
                label: "Skip",
                style: {
                  background: headerVariant === "Light" ? "rgba(255, 255, 255, 0.72)" : "rgba(255, 255, 255, 0.14)",
                  minWidth: 84
                }
              }}
              showAction1={false}
              showAction2={false}
              showAvatar={false}
              showLocation={false}
              style={{
                background: "transparent",
                left: 0,
                position: "absolute",
                right: 0,
                top: 44,
                zIndex: 1
              }}
              variant={headerVariant}
            />
          </div>

          <div
            style={{
              boxSizing: "border-box",
              background: surfaceCanvas,
              borderTopLeftRadius: radiusXl + 12,
              borderTopRightRadius: radiusXl + 12,
              display: "flex",
              flex: 1,
              flexDirection: "column",
              marginTop: -28,
              minHeight: 0,
              overflow: "hidden",
              padding: `${spacing6}px 16px 0`,
              position: "relative",
              zIndex: 1
            }}
          >
            <SectionHeader
              brand={brand}
              showAction={false}
              showDescription={false}
              showSubtitle={false}
              showTag={false}
              title="Login or sign up"
            />

            <div style={{ display: "grid", gap: spacing4, marginTop: spacing5 }}>
              <PhoneInput
                brand={brand}
                country="India"
                label="Enter phone number"
                onChange={handlePhoneChange}
                placeholder="99998 99999"
                showCountryChevron={false}
                showLabelInfoIcon={false}
                size="Large"
                value={phoneValue}
              />

              <Button
                brand={brand}
                size="Large"
                style={{ width: "100%" }}
                styleVariant="Solid"
              >
                Get OTP
              </Button>

              <CheckboxLabel
                brand={brand}
                checked={whatsAppOptIn}
                label={
                  <span>
                    Get updates on{" "}
                    <span style={{ color: success, fontWeight: 600 }}>
                      WhatsApp
                    </span>
                  </span>
                }
                onChange={handleOptInChange}
                size="Small"
              />

              <Divider brand={brand} label="OR" labelPosition="Center" style={{ width: "100%" }} />

              <SocialButton
                brand={brand}
                icon={<Icon name="call-filled" decorative />}
                size="Large"
                style={{ width: "100%" }}
              >
                Continue with Truecaller
              </SocialButton>

              <Text
                brand={brand}
                as="p"
                size="xs"
                tone="secondary"
                style={{
                  color: textSecondary,
                  lineHeight: "16px",
                  margin: 0
                }}
              >
                By continuing, you agree to CARS24&apos;s{" "}
                <a href="#" style={{ color: brandPrimary, textDecoration: "underline" }}>
                  Terms of service
                </a>{" "}
                &{" "}
                <a href="#" style={{ color: brandPrimary, textDecoration: "underline" }}>
                  Privacy policy
                </a>
                , and CARS24 NBFC&apos;s{" "}
                <a href="#" style={{ color: brandPrimary, textDecoration: "underline" }}>
                  Terms of Use
                </a>{" "}
                &{" "}
                <a href="#" style={{ color: brandPrimary, textDecoration: "underline" }}>
                  TU CIBIL terms of use
                </a>
                .
              </Text>
            </div>
          </div>
        </div>
      </div>
    </StoryPage>
  );
}

const PHONE_INPUT_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=1114-13995&t=1zgOyFpiLYMyM4XM-11";

const meta: Meta<PhoneInputStoryArgs> = {
  title: "Components/Forms/Phone Number",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(PHONE_INPUT_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    defaultCountry: "India",
    defaultValue: "",
    helperText: "Helper text",
    helperTone: "Default",
    label: "Label",
    placeholder: "9876543210",
    required: true,
    showCountryChevron: true,
    showHelperIcon: true,
    showLabelInfoIcon: true,
    size: "Small"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: phoneInputSizes
    },
    disabled: {
      control: "inline-radio",
      options: [false, true]
    },
    showAction: {
      control: "inline-radio",
      options: ["Auto", "Hidden", "Visible"],
      mapping: {
        Auto: undefined,
        Hidden: false,
        Visible: true
      }
    },
    defaultCountry: {
      control: "inline-radio",
      options: phoneInputCountries
    },
    availableCountries: {
      control: false,
      table: {
        disable: true
      }
    },
    country: {
      control: "select",
      options: [undefined, ...phoneInputCountries]
    },
    forceState: {
      control: "select",
      options: [undefined, ...previewStates]
    },
    helperTone: {
      control: "inline-radio",
      options: helperTones
    },
    label: {
      control: "text"
    },
    helperText: {
      control: "text"
    },
    defaultValue: {
      control: "text"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<PhoneInputStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Rest: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Rest" stateLabel="Rest" helperTone="Default" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ forceState: "Rest", helperTone: "Default", label: "Rest" }) } }
  }
};

export const Hover: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Hover" stateLabel="Hover" helperTone="Default" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ forceState: "Hover", helperTone: "Default", label: "Hover" }) } }
  }
};

export const Active: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Active" stateLabel="Active" helperTone="Default" value="" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ forceState: "Active", helperTone: "Default", label: "Active", value: "" }) } }
  }
};

export const Typing: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Typing" stateLabel="Typing" helperTone="Default" value="980" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ forceState: "Typing", helperTone: "Default", label: "Typing", value: "980" }) } }
  }
};

export const Filled: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} forceState="Filled" stateLabel="Filled" helperTone="Default" value="9806578901" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ forceState: "Filled", helperTone: "Default", label: "Filled", value: "9806578901" }) } }
  }
};

export const Destructive: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} destructive helperTone="Destructive" stateLabel="Destructive" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ destructive: true, helperTone: "Destructive", label: "Destructive" }) } }
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
      value="9806578901"
    />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: buildPhoneInputStateSourceCode({
          destructive: true,
          forceState: "Filled",
          helperTone: "Destructive",
          label: "DestructiveFilled",
          value: "9806578901"
        })
      }
    }
  }
};

export const Disabled: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} disabled stateLabel="Disabled" helperTone="Default" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildPhoneInputStateSourceCode({ disabled: true, helperTone: "Default", label: "Disabled" }) } }
  }
};

export const UIExample: Story = {
  render: ({ brand = "Cars24" }) => <MobileAuthExampleStory brand={brand} />,
  parameters: {
    layout: "centered",
    controls: {
      include: ["brand"]
    },
    docs: {
      source: {
        code: phoneInputUiExampleSourceCode
      }
    }
  }
};
