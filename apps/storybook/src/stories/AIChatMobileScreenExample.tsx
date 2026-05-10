import { useState, type CSSProperties, type ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import {
  AppHeader,
  BottomNav,
  Button,
  ChatBar,
  Icon,
  SegmentedControl,
  Tag,
  Text,
  getRequiredThemeTokenValue,
  type BottomNavItem,
  type SegmentedControlItem
} from "@turbo/web";
import { StoryBadge, StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

export type AIChatMobileScreenProps = {
  brand?: DisplayBrandId;
};

type AIChatScreenState = "default" | "loading" | "empty" | "error";
type AssistantRailValue = "chat" | "explore" | "history";

type AIChatTokens = {
  background: string;
  border: string;
  brand: string;
  brandSoft: string;
  brandStrong: string;
  canvas: string;
  danger: string;
  dangerSoft: string;
  infoSoft: string;
  inverse: string;
  muted: string;
  primary: string;
  secondary: string;
  screenShadow: string;
  subtle: string;
  successSoft: string;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  radiusPill: number;
};

type PromptIdea = {
  description: string;
  iconName: Parameters<typeof Icon>[0]["name"];
  id: string;
  title: string;
};

const RAIL_ITEMS: SegmentedControlItem[] = [
  { value: "chat", label: "Chat", ariaLabel: "Chat workspace" },
  { value: "explore", label: "Explore", ariaLabel: "Explore assistants" },
  { value: "history", label: "History", ariaLabel: "Recent chats" }
];

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    value: "home",
    label: "Home",
    ariaLabel: "Home",
    iconName: "home-personal-feed-for-you-outline"
  },
  {
    value: "chat",
    label: "Chats",
    ariaLabel: "Chats",
    iconName: "bubble-text-message-chat-outline"
  },
  {
    value: "saved",
    label: "Library",
    ariaLabel: "Library",
    iconName: "bookmark-banner-flag-tag-outline"
  },
  {
    value: "profile",
    label: "Profile",
    ariaLabel: "Profile",
    iconName: "people-circle-user-circle-avatar-profile-outline"
  }
];

const EMPTY_PROMPTS: PromptIdea[] = [
  {
    id: "brief",
    title: "Draft a product brief",
    description: "Turn scattered notes into a launch-ready outline.",
    iconName: "sparkle-line"
  },
  {
    id: "roadmap",
    title: "Plan the next sprint",
    description: "Organize tasks, risks, and milestones in minutes.",
    iconName: "calendar-clock-date-time-outline"
  },
  {
    id: "research",
    title: "Summarize research",
    description: "Condense raw findings into key takeaways and next steps.",
    iconName: "page-search-lines-outline"
  }
];

const QUICK_ACTIONS: PromptIdea[] = [
  {
    id: "calendar",
    title: "Turn into itinerary",
    description: "Build a day-by-day plan with timing and budget.",
    iconName: "calendar-clock-date-time-outline"
  },
  {
    id: "compare",
    title: "Compare two options",
    description: "Show tradeoffs in a clear table before I decide.",
    iconName: "cars-search-outline"
  },
  {
    id: "compose",
    title: "Write the reply",
    description: "Draft a crisp answer I can send right away.",
    iconName: "page-edit-text-document-file-outline"
  },
  {
    id: "save",
    title: "Save to library",
    description: "Keep this prompt in a reusable collection.",
    iconName: "bookmark-banner-flag-tag-outline"
  }
];

function toAlpha(color: string, alpha: number) {
  const normalized = color.trim();
  const hex = normalized.startsWith("#") ? normalized.slice(1) : normalized;
  const safeAlpha = Math.max(0, Math.min(1, alpha));

  if (!/^[\da-fA-F]{3}$|^[\da-fA-F]{6}$/.test(hex)) {
    return color;
  }

  const expanded = hex.length === 3 ? hex.split("").map((part) => `${part}${part}`).join("") : hex;
  const red = Number.parseInt(expanded.slice(0, 2), 16);
  const green = Number.parseInt(expanded.slice(2, 4), 16);
  const blue = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
}

function getAIChatTokens(brand: DisplayBrandId): AIChatTokens {
  const brandSoft = String(getRequiredThemeTokenValue(brand, "color.brand.primary.50"));
  const canvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const subtle = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));

  return {
    background: `linear-gradient(180deg, ${brandSoft} 0%, ${canvas} 22%, ${subtle} 100%)`,
    border: String(getRequiredThemeTokenValue(brand, "color.border.default")),
    brand: String(getRequiredThemeTokenValue(brand, "color.brand.alt.500")),
    brandSoft,
    brandStrong: String(getRequiredThemeTokenValue(brand, "color.brand.alt.600")),
    canvas,
    danger: String(getRequiredThemeTokenValue(brand, "color.status.danger")),
    dangerSoft: "#FEF2F2",
    infoSoft: "#EEF5FF",
    inverse: String(getRequiredThemeTokenValue(brand, "color.text.inverse")),
    muted: String(getRequiredThemeTokenValue(brand, "color.text.muted")),
    primary: String(getRequiredThemeTokenValue(brand, "color.text.primary")),
    secondary: String(getRequiredThemeTokenValue(brand, "color.text.secondary")),
    screenShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
    subtle,
    successSoft: "#F4FCF4",
    xs: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    sm: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
    md: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
    lg: Number(getRequiredThemeTokenValue(brand, "spacing.4")),
    xl: Number(getRequiredThemeTokenValue(brand, "spacing.5")),
    xxl: Number(getRequiredThemeTokenValue(brand, "spacing.6")),
    radiusSm: Number(getRequiredThemeTokenValue(brand, "radius.alt.sm")),
    radiusMd: Number(getRequiredThemeTokenValue(brand, "radius.alt.md")),
    radiusLg: Number(getRequiredThemeTokenValue(brand, "radius.alt.lg")),
    radiusXl: Number(getRequiredThemeTokenValue(brand, "radius.xl")),
    radiusPill: Number(getRequiredThemeTokenValue(brand, "radius.pill"))
  };
}

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
    <svg aria-hidden="true" height="13" viewBox="0 0 17 13" width="17">
      <path
        d="M8.5 10.8c.55 0 1 .44 1 1 0 .55-.45 1-1 1s-1-.45-1-1c0-.56.45-1 1-1Zm0-3.2c1.48 0 2.83.53 3.87 1.41a.55.55 0 0 1 .04.78.56.56 0 0 1-.79.05A4.89 4.89 0 0 0 8.5 8.7c-1.18 0-2.27.41-3.12 1.14a.56.56 0 0 1-.79-.05.55.55 0 0 1 .04-.78A6.02 6.02 0 0 1 8.5 7.6Zm0-3.35c2.35 0 4.52.83 6.18 2.22.23.19.26.54.07.77a.55.55 0 0 1-.78.07A8.4 8.4 0 0 0 8.5 5.35a8.4 8.4 0 0 0-5.47 1.96.55.55 0 0 1-.78-.07.55.55 0 0 1 .07-.77A9.54 9.54 0 0 1 8.5 4.25Zm0-3.25c3.2 0 6.16 1.13 8.42 3.03.23.2.26.54.07.78a.55.55 0 0 1-.78.06A11.87 11.87 0 0 0 8.5 2.1c-2.92 0-5.6 1.02-7.71 2.77a.55.55 0 0 1-.78-.06.55.55 0 0 1 .07-.78A13 13 0 0 1 8.5 1Z"
        fill={color}
      />
    </svg>
  );
}

function BatteryIcon({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" height="13" viewBox="0 0 27 13" width="27">
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
        maxWidth: 360,
        overflow: "hidden",
        width: "100%"
      }}
    >
      {children}
    </div>
  );
}

function SurfaceCard({
  children,
  style
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: 20,
        boxSizing: "border-box",
        display: "grid",
        gap: 12,
        padding: 16,
        width: "100%",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function ScreenPreview({
  children,
  description,
  label
}: {
  children: ReactNode;
  description: string;
  label: string;
}) {
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center", maxWidth: 420, width: "100%" }}>
      <div style={{ display: "grid", gap: 6, justifyItems: "center", textAlign: "center" }}>
        <StoryBadge>{label}</StoryBadge>
        <StoryCopy size="sm">{description}</StoryCopy>
      </div>
      {children}
    </div>
  );
}

function MessageBubble({
  brand,
  body,
  metadata,
  role,
  tokens
}: {
  brand: DisplayBrandId;
  body: ReactNode;
  metadata: string;
  role: "assistant" | "user";
  tokens: AIChatTokens;
}) {
  const isAssistant = role === "assistant";

  return (
    <div
      style={{
        alignItems: "flex-start",
        display: "flex",
        gap: tokens.sm,
        justifyContent: isAssistant ? "flex-start" : "flex-end",
        width: "100%"
      }}
    >
      {isAssistant ? (
        <div
          style={{
            alignItems: "center",
            background: `linear-gradient(180deg, ${tokens.brand} 0%, ${tokens.brandStrong} 100%)`,
            borderRadius: 14,
            display: "inline-flex",
            flex: "0 0 auto",
            height: 32,
            justifyContent: "center",
            width: 32
          }}
        >
          <Icon brand={brand} decorative name="sparkle-filled" size="sm" tone="inverse" />
        </div>
      ) : null}

      <div
        style={{
          background: isAssistant ? tokens.canvas : toAlpha(tokens.brand, 0.1),
          border: `1px solid ${isAssistant ? toAlpha(tokens.border, 0.8) : "transparent"}`,
          borderRadius: isAssistant ? 20 : 18,
          boxShadow: isAssistant ? "0 10px 30px rgba(15, 23, 42, 0.05)" : "none",
          display: "grid",
          gap: 6,
          maxWidth: isAssistant ? "85%" : "78%",
          padding: `${tokens.md}px ${tokens.md}px`
        }}
      >
        <Text as="strong" brand={brand} size="xs" tone={isAssistant ? "secondary" : "primary"}>
          {metadata}
        </Text>
        <div
          style={{
            color: tokens.primary,
            display: "grid",
            gap: 8
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

function PromptCard({
  brand,
  idea,
  tokens
}: {
  brand: DisplayBrandId;
  idea: PromptIdea;
  tokens: AIChatTokens;
}) {
  return (
    <div
      style={{
        background: tokens.canvas,
        border: `1px solid ${toAlpha(tokens.border, 0.85)}`,
        borderRadius: tokens.radiusLg,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        display: "grid",
        gap: tokens.sm,
        minHeight: 96,
        padding: tokens.md
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: toAlpha(tokens.brand, 0.1),
          borderRadius: 12,
          display: "inline-flex",
          height: 36,
          justifyContent: "center",
          width: 36
        }}
      >
        <Icon brand={brand} decorative name={idea.iconName} size="sm" tone="primary" />
      </div>
      <Text as="strong" brand={brand} size="sm">
        {idea.title}
      </Text>
      <Text as="p" brand={brand} size="xs" tone="secondary" style={{ margin: 0 }}>
        {idea.description}
      </Text>
    </div>
  );
}

function SkeletonBlock({
  height,
  width = "100%",
  tokens
}: {
  height: number;
  width?: CSSProperties["width"];
  tokens: AIChatTokens;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: `linear-gradient(90deg, ${toAlpha(tokens.border, 0.18)} 0%, ${toAlpha(tokens.border, 0.32)} 50%, ${toAlpha(tokens.border, 0.18)} 100%)`,
        backgroundSize: "200% 100%",
        borderRadius: 999,
        height,
        width
      }}
    />
  );
}

function ComposerDock({
  brand,
  helper,
  tokens,
  typed = false,
  disabled = false
}: {
  brand: DisplayBrandId;
  helper: string;
  tokens: AIChatTokens;
  typed?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        backdropFilter: "blur(16px)",
        background: toAlpha(tokens.canvas, 0.92),
        borderTop: `1px solid ${toAlpha(tokens.border, 0.65)}`,
        display: "grid",
        gap: tokens.sm,
        padding: `${tokens.sm}px ${tokens.lg}px ${tokens.md}px`
      }}
    >
      <ChatBar
        brand={brand}
        disabled={disabled}
        forceState={typed ? "Message Typed" : "Default"}
        placeholder="Ask Astra AI anything..."
        value={typed ? "Turn this into a 3-day Goa itinerary with budget ranges." : ""}
      />
      <Text as="p" brand={brand} size="xs" tone="muted" style={{ margin: 0 }}>
        {helper}
      </Text>
    </div>
  );
}

function QuickActionSection({
  brand,
  tokens
}: {
  brand: DisplayBrandId;
  tokens: AIChatTokens;
}) {
  return (
    <div style={{ display: "grid", gap: tokens.md }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <Text as="strong" brand={brand} size="sm">
          Suggested actions
        </Text>
        <Tag brand={brand} color="Blue" priority="Low" size="Large">
          4 reusable prompts
        </Tag>
      </div>

      <div
        style={{
          display: "grid",
          gap: tokens.sm,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
        }}
      >
        {QUICK_ACTIONS.map((idea) => (
          <PromptCard key={idea.id} brand={brand} idea={idea} tokens={tokens} />
        ))}
      </div>
    </div>
  );
}

function DefaultConversation({ brand, tokens }: { brand: DisplayBrandId; tokens: AIChatTokens }) {
  return (
    <div style={{ display: "grid", gap: tokens.md }}>
      <SurfaceCard
        style={{
          background: `linear-gradient(180deg, ${toAlpha(tokens.brand, 0.08)} 0%, ${tokens.canvas} 100%)`,
          borderColor: toAlpha(tokens.brand, 0.18),
          gap: tokens.sm
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: tokens.sm, justifyContent: "space-between" }}>
          <Tag brand={brand} color="Brand blue" priority="Low" size="Large">
            GPT-5 ready
          </Tag>
          <Tag brand={brand} color="Green" priority="Low" size="Large">
            Context synced
          </Tag>
        </div>
        <Text as="strong" brand={brand} size="md">
          Plan, write, and refine without leaving the conversation.
        </Text>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          The template keeps the header, chat stack, quick actions, and composer stable so the pattern scales into search,
          saved prompts, and multi-assistant screens.
        </Text>
      </SurfaceCard>

      <div style={{ display: "grid", gap: tokens.md }}>
        <MessageBubble
          brand={brand}
          metadata="Astra AI · 2m ago"
          role="assistant"
          tokens={tokens}
          body={
            <>
              <Text as="p" brand={brand} size="sm" style={{ margin: 0 }}>
                I drafted a Goa long-weekend plan with beaches, cafes, and low-travel hops between each stop.
              </Text>
              <SurfaceCard
                style={{
                  background: tokens.subtle,
                  borderColor: toAlpha(tokens.border, 0.5),
                  gap: tokens.xs,
                  padding: tokens.sm
                }}
              >
                <Text as="strong" brand={brand} size="xs">
                  Trip outline
                </Text>
                <Text as="p" brand={brand} size="xs" tone="secondary" style={{ margin: 0 }}>
                  Day 1: Fontainhas + Panjim dinner
                </Text>
                <Text as="p" brand={brand} size="xs" tone="secondary" style={{ margin: 0 }}>
                  Day 2: Vagator, brunch, sunset viewpoint
                </Text>
                <Text as="p" brand={brand} size="xs" tone="secondary" style={{ margin: 0 }}>
                  Day 3: South Goa beach club and airport transfer
                </Text>
              </SurfaceCard>
            </>
          }
        />

        <MessageBubble
          brand={brand}
          metadata="You · 1m ago"
          role="user"
          tokens={tokens}
          body={
            <Text as="p" brand={brand} size="sm" style={{ margin: 0 }}>
              Make it calmer, keep the budget mid-range, and add a rainy-day backup.
            </Text>
          }
        />

        <MessageBubble
          brand={brand}
          metadata="Astra AI · just now"
          role="assistant"
          tokens={tokens}
          body={
            <>
              <Text as="p" brand={brand} size="sm" style={{ margin: 0 }}>
                Updated. I swapped the busiest clubs for quieter sunset stops and added a museum plus cafe fallback for day two.
              </Text>
              <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: tokens.xs }}>
                <Tag brand={brand} color="Blue" priority="Low" size="Large">
                  Mid-range stays
                </Tag>
                <Tag brand={brand} color="Orange" priority="Low" size="Large">
                  Rain backup
                </Tag>
                <Tag brand={brand} color="Neutral" priority="Low" size="Large">
                  Shareable plan
                </Tag>
              </div>
            </>
          }
        />
      </div>

      <QuickActionSection brand={brand} tokens={tokens} />
    </div>
  );
}

function LoadingConversation({ brand, tokens }: { brand: DisplayBrandId; tokens: AIChatTokens }) {
  return (
    <div style={{ display: "grid", gap: tokens.md }}>
      <SurfaceCard
        style={{
          background: tokens.infoSoft,
          borderColor: toAlpha(tokens.brand, 0.14),
          gap: tokens.sm
        }}
      >
        <Tag brand={brand} color="Blue" priority="Low" size="Large">
          Fetching context
        </Tag>
        <Text as="strong" brand={brand} size="md">
          Pulling chat history, saved prompts, and workspace notes.
        </Text>
        <SkeletonBlock height={10} tokens={tokens} width="68%" />
      </SurfaceCard>

      <SurfaceCard style={{ gap: tokens.md }}>
        <div style={{ display: "grid", gap: tokens.sm }}>
          <SkeletonBlock height={12} tokens={tokens} width="38%" />
          <SkeletonBlock height={18} tokens={tokens} width="84%" />
          <SkeletonBlock height={18} tokens={tokens} width="92%" />
          <SkeletonBlock height={18} tokens={tokens} width="74%" />
        </div>
        <div
          style={{
            alignSelf: "end",
            background: toAlpha(tokens.brand, 0.1),
            borderRadius: 18,
            display: "grid",
            gap: 10,
            marginLeft: "auto",
            padding: tokens.md,
            width: "72%"
          }}
        >
          <SkeletonBlock height={10} tokens={tokens} width="45%" />
          <SkeletonBlock height={14} tokens={tokens} width="92%" />
          <SkeletonBlock height={14} tokens={tokens} width="66%" />
        </div>
      </SurfaceCard>

      <SurfaceCard style={{ gap: tokens.md }}>
        <div style={{ display: "grid", gap: tokens.sm, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <SkeletonBlock height={92} tokens={tokens} />
          <SkeletonBlock height={92} tokens={tokens} />
        </div>
        <Button brand={brand} disabled loading size="Large">
          Preparing actions
        </Button>
      </SurfaceCard>
    </div>
  );
}

function EmptyConversation({ brand, tokens }: { brand: DisplayBrandId; tokens: AIChatTokens }) {
  return (
    <div style={{ display: "grid", gap: tokens.md }}>
      <SurfaceCard
        style={{
          justifyItems: "center",
          padding: tokens.xl,
          textAlign: "center"
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: `linear-gradient(180deg, ${toAlpha(tokens.brand, 0.14)} 0%, ${toAlpha(tokens.brandStrong, 0.06)} 100%)`,
            borderRadius: 22,
            display: "inline-flex",
            height: 72,
            justifyContent: "center",
            width: 72
          }}
        >
          <Icon brand={brand} decorative name="sparkle-line" size="lg" tone="primary" />
        </div>

        <div style={{ display: "grid", gap: tokens.xs }}>
          <Text as="strong" brand={brand} size="md">
            Start with a clear prompt or pick a reusable starter.
          </Text>
          <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
            Empty states still preserve hierarchy: header, navigation, helpful guidance, and composer stay in place so the next screen can load into the same shell.
          </Text>
        </div>

        <Button
          brand={brand}
          leadingIcon={<Icon name="sparkle-filled" decorative />}
          shape="Regular"
          size="Large"
        >
          Start new chat
        </Button>
      </SurfaceCard>

      <div style={{ display: "grid", gap: tokens.sm }}>
        {EMPTY_PROMPTS.map((idea) => (
          <PromptCard key={idea.id} brand={brand} idea={idea} tokens={tokens} />
        ))}
      </div>
    </div>
  );
}

function ErrorConversation({ brand, tokens }: { brand: DisplayBrandId; tokens: AIChatTokens }) {
  return (
    <div style={{ display: "grid", gap: tokens.md }}>
      <SurfaceCard
        style={{
          background: tokens.dangerSoft,
          borderColor: toAlpha(tokens.danger, 0.24)
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: tokens.sm, justifyContent: "space-between" }}>
          <Tag brand={brand} color="Red" priority="Low" size="Large">
            Sync issue
          </Tag>
          <Tag brand={brand} color="Neutral" priority="Low" size="Large">
            Draft preserved
          </Tag>
        </div>
        <Text as="strong" brand={brand} size="md">
          The model response did not load, but the conversation state is still safe.
        </Text>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          Error treatments use semantic color, plain-language recovery, and a stable layout so the user never loses context or input.
        </Text>
        <div style={{ display: "grid", gap: tokens.sm, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <Button brand={brand} size="Large">
            Retry
          </Button>
          <Button brand={brand} size="Large" styleVariant="Outline">
            Work offline
          </Button>
        </div>
      </SurfaceCard>

      <SurfaceCard
        style={{
          background: tokens.successSoft,
          borderColor: toAlpha(tokens.brand, 0.14)
        }}
      >
        <Text as="strong" brand={brand} size="sm">
          Saved draft
        </Text>
        <Text as="p" brand={brand} size="sm" tone="secondary" style={{ margin: 0 }}>
          "Turn this into a 3-day Goa itinerary with budget ranges."
        </Text>
      </SurfaceCard>

      <SurfaceCard style={{ gap: tokens.sm }}>
        <Text as="strong" brand={brand} size="sm">
          Recent conversation
        </Text>
        <div
          style={{
            background: toAlpha(tokens.brand, 0.06),
            borderRadius: tokens.radiusLg,
            display: "grid",
            gap: 6,
            padding: tokens.md
          }}
        >
          <Text as="strong" brand={brand} size="xs">
            Weekend Goa plan
          </Text>
          <Text as="p" brand={brand} size="xs" tone="secondary" style={{ margin: 0 }}>
            Last good response saved 2 minutes ago.
          </Text>
        </div>
      </SurfaceCard>
    </div>
  );
}

function AIChatMobileScreen({
  brand = "Cars24",
  screenState = "default"
}: AIChatMobileScreenProps & {
  screenState?: AIChatScreenState;
}) {
  const tokens = getAIChatTokens(brand);
  const [railValue, setRailValue] = useState<AssistantRailValue>("chat");
  const [navValue, setNavValue] = useState("chat");

  return (
    <ScreenCard>
      <div
        style={{
          background: tokens.background,
          display: "grid",
          minHeight: 780,
          width: "100%"
        }}
      >
        <DeviceStatusBar brand={brand} />

        <div
          style={{
            display: "grid",
            gap: tokens.md,
            padding: `0 ${tokens.lg}px ${tokens.md}px`
          }}
        >
          <AppHeader
            actions={[
              {
                icon: <Icon name="search-menu-list-search-outline" decorative />,
                label: "Search"
              },
              {
                icon: <Icon name="people-circle-user-circle-avatar-profile-outline" decorative />,
                label: "Profile"
              }
            ]}
            brand={brand}
            level="Page - L2"
            showAction1={false}
            showAction2={false}
            showAvatar={false}
            showBackButton={false}
            showLocation={false}
            subtitle="Mobile AI chat template"
            title="Astra AI"
            variant="Light"
          />

          <SegmentedControl
            brand={brand}
            items={RAIL_ITEMS}
            onValueChange={(value) => {
              setRailValue(value as AssistantRailValue);
            }}
            selectionColor="White"
            size="Large"
            type="Label"
            value={railValue}
          />

          {screenState === "default" ? <DefaultConversation brand={brand} tokens={tokens} /> : null}
          {screenState === "loading" ? <LoadingConversation brand={brand} tokens={tokens} /> : null}
          {screenState === "empty" ? <EmptyConversation brand={brand} tokens={tokens} /> : null}
          {screenState === "error" ? <ErrorConversation brand={brand} tokens={tokens} /> : null}
        </div>

        <div style={{ alignSelf: "end", marginTop: "auto" }}>
          <ComposerDock
            brand={brand}
            disabled={screenState === "loading"}
            helper={
              screenState === "error"
                ? "Your last prompt is safe. Retry when you are back online."
                : screenState === "loading"
                  ? "Fetching context before you send the next prompt."
                  : "Touch targets stay 44px or larger across the composer and footer."
            }
            tokens={tokens}
            typed={screenState === "default" || screenState === "error"}
          />
          <div style={{ padding: `0 ${tokens.md}px ${tokens.md}px` }}>
            <BottomNav
              brand={brand}
              configuration="Label + icon"
              items={BOTTOM_NAV_ITEMS}
              onValueChange={setNavValue}
              showHomeIndicator
              type="Floating"
              value={navValue}
            />
          </div>
        </div>
      </div>
    </ScreenCard>
  );
}

function InteractionStatesPanel({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <SurfaceCard>
        <Text as="strong" brand={brand} size="md">
          Buttons
        </Text>
        <StoryCopy brand={brand} size="sm">
          Primary, secondary, hover/pressed, loading, and disabled states use the canonical button component with the existing token bindings.
        </StoryCopy>
        <div style={{ display: "grid", gap: 12 }}>
          <Button brand={brand} size="Large">
            Primary action
          </Button>
          <Button brand={brand} forceState="Hover/Pressed" size="Large">
            Pressed state
          </Button>
          <Button brand={brand} size="Large" styleVariant="Outline">
            Secondary action
          </Button>
          <Button brand={brand} disabled size="Large">
            Disabled action
          </Button>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <Text as="strong" brand={brand} size="md">
          Composer states
        </Text>
        <StoryCopy brand={brand} size="sm">
          The composer covers default, typed, and disabled states while preserving the minimum 44px control height needed for touch targets.
        </StoryCopy>
        <div style={{ display: "grid", gap: 12 }}>
          <ChatBar brand={brand} forceState="Default" />
          <ChatBar
            brand={brand}
            forceState="Message Typed"
            value="Summarize this thread into 3 action items."
          />
          <ChatBar brand={brand} disabled forceState="Default" />
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <Text as="strong" brand={brand} size="md">
          Navigation states
        </Text>
        <StoryCopy brand={brand} size="sm">
          Top rail and bottom navigation reuse existing navigation primitives so the shell can stay consistent across chat, library, and profile views.
        </StoryCopy>
        <div style={{ display: "grid", gap: 16 }}>
          <SegmentedControl
            brand={brand}
            items={RAIL_ITEMS}
            selectionColor="White"
            size="Large"
            type="Label"
            value="chat"
          />
          <BottomNav
            brand={brand}
            configuration="Label + icon"
            items={BOTTOM_NAV_ITEMS}
            showHomeIndicator
            type="Floating"
            value="chat"
          />
        </div>
      </SurfaceCard>
    </div>
  );
}

function DocumentationPanel({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <SurfaceCard>
        <Text as="strong" brand={brand} size="md">
          Component breakdown
        </Text>
        <StoryCopy brand={brand} size="sm">
          The page shell is built from `AppHeader`, `SegmentedControl`, `ChatBar`, `BottomNav`, `Button`, and `Tag`, with custom surface cards and message bubbles only where the current library does not expose a dedicated chat-thread component.
        </StoryCopy>
        <StoryCopy brand={brand} size="sm">
          This keeps the high-variance pieces reusable while leaving room for product-specific content modules.
        </StoryCopy>
      </SurfaceCard>

      <SurfaceCard>
        <Text as="strong" brand={brand} size="md">
          Spacing and layout
        </Text>
        <StoryCopy brand={brand} size="sm">
          The template follows an 8pt rhythm using semantic spacing tokens from `spacing.1` through `spacing.6`, with 16px edge padding, 12px-16px content gaps, and 20px surface radii for hierarchy.
        </StoryCopy>
        <StoryCopy brand={brand} size="sm">
          Primary actions, segmented controls, the composer, and footer navigation stay at 44px or larger to remain mobile friendly and accessible.
        </StoryCopy>
      </SurfaceCard>

      <SurfaceCard>
        <Text as="strong" brand={brand} size="md">
          Scaling guidance
        </Text>
        <StoryCopy brand={brand} size="sm">
          The screen scales cleanly into assistant marketplaces, saved prompt libraries, and workspace detail views by keeping the shell fixed and swapping only the central content module.
        </StoryCopy>
        <StoryCopy brand={brand} size="sm">
          Semantic colors support loading, success, and error states without relying on color alone, while the stable header and footer reduce cognitive load as the user moves between flows.
        </StoryCopy>
      </SurfaceCard>
    </div>
  );
}

export function AIChatMobileKit({ brand = "Cars24" }: AIChatMobileScreenProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard
        style={{
          display: "grid",
          gap: 32
        }}
      >
        <div style={{ display: "grid", gap: 12, maxWidth: 860 }}>
          <StoryBadge>AI chat screen</StoryBadge>
          <StoryHeading brand={brand} size="xl">
            Mobile AI chat page template
          </StoryHeading>
          <StoryCopy brand={brand} size="md">
            This UI kit example frames an AI chat experience like ChatGPT or Gemini inside the existing design system. It shows a reusable mobile shell, token-led spacing, consistent typography, and explicit empty, loading, and error states.
          </StoryCopy>
        </div>

        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            justifyItems: "center"
          }}
        >
          <ScreenPreview
            description="Primary conversation state with reusable message surfaces, quick actions, and a typed composer."
            label="Default state"
          >
            <AIChatMobileScreen brand={brand} screenState="default" />
          </ScreenPreview>

          <ScreenPreview
            description="Loading state keeps the structure visible, reduces layout shift, and maintains the shell while data streams in."
            label="Loading state"
          >
            <AIChatMobileScreen brand={brand} screenState="loading" />
          </ScreenPreview>

          <ScreenPreview
            description="Empty state guides the first action with a clear CTA and reusable prompt starters instead of a blank canvas."
            label="Empty state"
          >
            <AIChatMobileScreen brand={brand} screenState="empty" />
          </ScreenPreview>

          <ScreenPreview
            description="Error state uses semantic feedback, draft preservation, and recovery actions without breaking the page hierarchy."
            label="Error state"
          >
            <AIChatMobileScreen brand={brand} screenState="error" />
          </ScreenPreview>
        </div>

        <InteractionStatesPanel brand={brand} />
        <DocumentationPanel brand={brand} />
      </StoryCard>
    </StoryPage>
  );
}

export const aiChatMobileScreenSourceCode = `import {
  AppHeader,
  BottomNav,
  Button,
  ChatBar,
  SegmentedControl,
  Tag
} from "@turbo/web";

export function AIChatMobileScreen() {
  return (
    <>
      <AppHeader
        brand="Cars24"
        level="Page - L2"
        variant="Light"
        title="Astra AI"
        subtitle="Mobile AI chat template"
        showBackButton={false}
        showLocation={false}
      />

      <SegmentedControl
        brand="Cars24"
        size="Large"
        type="Label"
        value="chat"
        items={[
          { value: "chat", label: "Chat" },
          { value: "explore", label: "Explore" },
          { value: "history", label: "History" }
        ]}
      />

      <Tag brand="Cars24" color="Brand blue" priority="Low" size="Large">
        GPT-5 ready
      </Tag>

      <ChatBar
        brand="Cars24"
        forceState="Message Typed"
        value="Turn this into a 3-day Goa itinerary with budget ranges."
      />

      <BottomNav
        brand="Cars24"
        type="Floating"
        configuration="Label + icon"
        value="chat"
        items={[
          { value: "home", label: "Home", iconName: "home-personal-feed-for-you-outline" },
          { value: "chat", label: "Chats", iconName: "bubble-text-message-chat-outline" },
          { value: "saved", label: "Library", iconName: "bookmark-banner-flag-tag-outline" },
          { value: "profile", label: "Profile", iconName: "people-circle-user-circle-avatar-profile-outline" }
        ]}
      />

      <Button brand="Cars24" size="Large">
        Retry
      </Button>
    </>
  );
}`;

export const UIExample = {
  render: ({ brand = "Cars24" }: AIChatMobileScreenProps) => <AIChatMobileKit brand={brand} />,
  parameters: {
    layout: "fullscreen",
    docs: {
      source: {
        code: aiChatMobileScreenSourceCode
      }
    }
  }
};
