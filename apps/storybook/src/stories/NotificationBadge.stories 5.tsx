import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, coreTokenCatalog } from "@geist/tokens";
import {
  NotificationBadge,
  type NotificationBadgeProps,
  type NotificationBadgeSize
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const NOTIFICATION_BADGE_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=18146-6983&t=1zgOyFpiLYMyM4XM-11";

const badgeSizes: NotificationBadgeSize[] = ["Small", "Medium", "Large"];

function PlaygroundStory(args: NotificationBadgeProps) {
  return <NotificationBadge {...args} />;
}

function HeaderCell({ label }: { label: string }) {
  return <div style={headerCellStyles}>{label}</div>;
}

function SizeCell({ label }: { label: string }) {
  return <div style={sizeCellStyles}>{label}</div>;
}

function PreviewSurface({
  background,
  children
}: {
  background: string;
  children: ReactNode;
}) {
  return <div style={{ ...previewSurfaceStyles, background }}>{children}</div>;
}

function VariantsStory({ brand }: { brand?: NotificationBadgeProps["brand"] }) {
  const resolvedBrand = brand ?? "Cars24";
  const canvasSurface = String(coreTokenCatalog.color.surface.canvas);
  const inverseSurface = String(coreTokenCatalog.color.surface.inverse);

  return (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 16 }}>
          <p style={captionStyles}>
            Cut-out variants are previewed on the inverse surface so the white border token remains visible.
          </p>
          <div style={matrixStyles}>
            <HeaderCell label="Size" />
            <HeaderCell label="Cut out = false" />
            <HeaderCell label="Cut out = true" />

            {badgeSizes.flatMap((size) => [
              <SizeCell key={`${size}-label`} label={size} />,
              <PreviewSurface key={`${size}-plain`} background={canvasSurface}>
                <NotificationBadge brand={resolvedBrand} size={size} />
              </PreviewSurface>,
              <PreviewSurface key={`${size}-cutout`} background={inverseSurface}>
                <NotificationBadge brand={resolvedBrand} size={size} cutOut />
              </PreviewSurface>
            ])}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildVariantsSourceCode(brand: NonNullable<NotificationBadgeProps["brand"]>) {
  return `import { NotificationBadge } from "@geist/web";

const sizes = ["Small", "Medium", "Large"] as const;

export function NotificationBadgeVariants() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <NotificationBadge brand="${brand}" size={size} />
          <NotificationBadge brand="${brand}" size={size} cutOut />
        </div>
      ))}
    </div>
  );
}`;
}

const matrixStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 16,
  display: "grid",
  gridTemplateColumns: "minmax(120px, auto) repeat(2, minmax(160px, auto))",
  rowGap: 16
};

const headerCellStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "18px"
};

const sizeCellStyles: CSSProperties = {
  color: "#020617",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "18px"
};

const previewSurfaceStyles: CSSProperties = {
  alignItems: "center",
  borderRadius: 12,
  display: "flex",
  height: 64,
  justifyContent: "center"
};

const captionStyles: CSSProperties = {
  color: "#64748B",
  fontSize: 13,
  lineHeight: "18px",
  margin: 0
};

const meta: Meta<NotificationBadgeProps> = {
  title: "Components/Badges/Notification Badge",
  component: NotificationBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(NOTIFICATION_BADGE_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    size: "Small",
    cutOut: false
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    size: {
      control: "inline-radio",
      options: badgeSizes
    },
    cutOut: {
      control: "boolean"
    }
  },
  render: PlaygroundStory
};

export default meta;

type Story = StoryObj<NotificationBadgeProps>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const Variants: Story = {
  render: (args) => <VariantsStory brand={args.brand} />,
  parameters: {
    controls: {
      disable: true
    },
    docs: {
      source: {
        code: buildVariantsSourceCode("Cars24")
      }
    }
  }
};
