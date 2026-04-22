import { useState, type ChangeEvent, type ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import {
  Avatar,
  Button,
  CheckboxLabel,
  LinkButton,
  PageHeaderL2,
  TextInput,
  getRequiredThemeTokenValue
} from "@geist/web";
import { StoryPage } from "../storybook-shell";

export type EditProfileMobileScreenProps = {
  brand?: DisplayBrandId;
};

function CellularIcon({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        alignItems: "flex-end",
        display: "inline-flex",
        gap: 2,
        height: 12,
        width: 20
      }}
    >
      {[5, 7, 9, 11].map((height, index) => (
        <span
          key={`cellular-bar-${index}`}
          style={{
            background: color,
            borderRadius: 999,
            display: "block",
            height,
            opacity: index === 0 ? 0.75 : 1,
            width: 3
          }}
        />
      ))}
    </span>
  );
}

function WifiIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      height="13"
      viewBox="0 0 17 13"
      width="17"
    >
      <path
        d="M8.5 10.8c.55 0 1 .44 1 1 0 .55-.45 1-1 1s-1-.45-1-1c0-.56.45-1 1-1Zm0-3.2c1.48 0 2.83.53 3.87 1.41a.55.55 0 0 1 .04.78.56.56 0 0 1-.79.05A4.89 4.89 0 0 0 8.5 8.7c-1.18 0-2.27.41-3.12 1.14a.56.56 0 0 1-.79-.05.55.55 0 0 1 .04-.78A6.02 6.02 0 0 1 8.5 7.6Zm0-3.35c2.35 0 4.52.83 6.18 2.22.23.19.26.54.07.77a.55.55 0 0 1-.78.07A8.4 8.4 0 0 0 8.5 5.35a8.4 8.4 0 0 0-5.47 1.96.55.55 0 0 1-.78-.07.55.55 0 0 1 .07-.77A9.54 9.54 0 0 1 8.5 4.25Zm0-3.25c3.2 0 6.16 1.13 8.42 3.03.23.2.26.54.07.78a.55.55 0 0 1-.78.06A11.87 11.87 0 0 0 8.5 2.1c-2.92 0-5.6 1.02-7.71 2.77a.55.55 0 0 1-.78-.06.55.55 0 0 1 .07-.78A13 13 0 0 1 8.5 1Z"
        fill={color}
      />
    </svg>
  );
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      height="13"
      viewBox="0 0 27 13"
      width="27"
    >
      <rect
        fill="none"
        height="11.5"
        opacity="0.35"
        rx="2.5"
        stroke={color}
        strokeWidth="1"
        width="24"
        x="1"
        y="0.75"
      />
      <rect fill={color} height="7.5" rx="1.5" width="18" x="3.5" y="2.75" />
      <rect fill={color} height="4" rx="1" width="1.6" x="25.2" y="4.5" />
    </svg>
  );
}

function DeviceStatusBar({ brand }: { brand: DisplayBrandId }) {
  const textColor = String(getRequiredThemeTokenValue(brand, "color.text.primary"));

  return (
    <div
      style={{
        boxSizing: "border-box",
        height: 48,
        position: "relative",
        width: "100%"
      }}
    >
      <span
        aria-hidden="true"
        style={{
          color: textColor,
          fontFamily: "\"SF Pro Text\", \"SF Pro Display\", -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 17,
          fontWeight: 600,
          left: 31.5,
          letterSpacing: "-0.5px",
          lineHeight: "17px",
          position: "absolute",
          top: 21
        }}
      >
        09:41
      </span>

      <div
        aria-hidden="true"
        style={{
          alignItems: "center",
          display: "inline-flex",
          gap: 6,
          position: "absolute",
          right: 18.7,
          top: 23
        }}
      >
        <CellularIcon color={textColor} />
        <WifiIcon color={textColor} />
        <BatteryIcon color={textColor} />
      </div>
    </div>
  );
}

function ScreenCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 34,
        boxShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
        overflow: "hidden",
        width: 360
      }}
    >
      {children}
    </div>
  );
}

export function EditProfileMobileScreen({ brand = "Cars24" }: EditProfileMobileScreenProps) {
  const [displayName, setDisplayName] = useState("Mayank Kumar");
  const [mobileNumber] = useState("+91 8130677980");
  const [address, setAddress] = useState("11, Lajpat Nagar 4, New Delhi");
  const [email, setEmail] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const frameBorder = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const mutedText = String(getRequiredThemeTokenValue(brand, "color.text.secondary"));

  return (
    <StoryPage fullscreen>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          padding: "24px 12px"
        }}
      >
        <ScreenCard>
          <div
            style={{
              border: `1px solid ${frameBorder}`,
              borderRadius: 34,
              display: "grid",
              gridTemplateRows: "auto 1fr",
              height: 780,
              overflow: "hidden"
            }}
          >
            <div style={{ background: "#FFFFFF" }}>
              <DeviceStatusBar brand={brand} />
              <PageHeaderL2
                brand={brand}
                showAction1={false}
                showAction2={false}
                showAvatar={false}
                showLocation={false}
                showSubtitle={false}
                title="Edit profile"
                variant="Light"
                style={{
                  background: "#FFFFFF",
                  borderBottom: `1px solid ${frameBorder}`
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                position: "relative"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                  inset: 0,
                  overflowX: "hidden",
                  overflowY: "scroll",
                  overscrollBehavior: "contain",
                  padding: "32px 12px 132px",
                  position: "absolute",
                  WebkitOverflowScrolling: "touch"
                }}
              >
                <div style={{ alignItems: "center", display: "grid", justifyItems: "center", gap: 12 }}>
                  <Avatar appearance="Initials" adornment="None" brand={brand} initials="M" onDark size="Extra large" />
                  <LinkButton brand={brand} size="Large" tone="Brand" underline={false}>
                    Edit profile picture
                  </LinkButton>
                </div>

                <div style={{ display: "grid", gap: 20 }}>
                  <TextInput
                    brand={brand}
                    label="Display name"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setDisplayName(event.currentTarget.value)}
                    required
                    showLabelInfoIcon={false}
                    size="Small"
                    value={displayName}
                  />

                  <TextInput
                    brand={brand}
                    disabled
                    helperText="Verified number"
                    label="Mobile number"
                    required
                    showHelperIcon={false}
                    showLabelInfoIcon={false}
                    size="Small"
                    value={mobileNumber}
                  />

                  <TextInput
                    brand={brand}
                    label="Address"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setAddress(event.currentTarget.value)}
                    showLabelInfoIcon={false}
                    size="Small"
                    value={address}
                  />

                  <TextInput
                    brand={brand}
                    label="Email address"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)}
                    placeholder="name@example.com"
                    showLabelInfoIcon={false}
                    size="Small"
                    value={email}
                  />

                  <TextInput
                    brand={brand}
                    label="Occupation"
                    placeholder="Select your role"
                    readOnly
                    showLabelInfoIcon={false}
                    size="Small"
                    suffixIconName="chevron-down-small-outline"
                  />

                  <CheckboxLabel
                    brand={brand}
                    checked={consentChecked}
                    description="A clean report builds buyer trust and helps spot errors that might lower your sale price, leading to better deals and quicker closings."
                    label="Give consent to verify credit report for last selling"
                    onChange={(event) => setConsentChecked(event.currentTarget.checked)}
                    size="Small"
                  />
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 22%, #FFFFFF 100%)",
                  bottom: 0,
                  left: 0,
                  padding: "16px 12px 20px",
                  position: "absolute",
                  right: 0
                }}
              >
                <Button
                  brand={brand}
                  size="Large"
                  style={{
                    minWidth: 0,
                    width: "100%"
                  }}
                >
                  Save changes
                </Button>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: 18
                  }}
                >
                  <span
                    style={{
                      background: mutedText,
                      borderRadius: 999,
                      display: "block",
                      height: 5,
                      opacity: 0.55,
                      width: 134
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScreenCard>
      </div>
    </StoryPage>
  );
}

export const editProfileScreenSourceCode = `import {
  Avatar,
  Button,
  CheckboxLabel,
  LinkButton,
  PageHeaderL2,
  TextInput
} from "@geist/web";

export function EditProfileMobileScreen() {
  return (
    <PageHeaderL2 title="Edit profile" variant="Light" />
  );
}`;
