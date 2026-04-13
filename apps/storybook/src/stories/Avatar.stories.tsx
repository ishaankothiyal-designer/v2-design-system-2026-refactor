import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { coreTokenCatalog } from "@geist/tokens";
import {
  getAvatarResolvedMetrics,
  Avatar,
  Text,
  type AvatarAdornment,
  type AvatarAppearance,
  type AvatarProps,
  type AvatarSize,
  type AvatarStatusBadgeType,
  type AvatarStatusDotColor
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const AVATAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=20321-21583&p=f&t=1zgOyFpiLYMyM4XM-11";

const avatarImageSrc = new URL("./assets/avatar-image-variant.png", import.meta.url).href;

const avatarSizes: AvatarSize[] = ["Extra large", "Large", "Medium", "Small", "Extra small"];
const avatarAppearances: AvatarAppearance[] = ["Icon", "Image", "Initials"];
const avatarAdornmentModes: Exclude<AvatarAdornment, "None">[] = ["Status dot", "Status badge"];
const dotColors: AvatarStatusDotColor[] = ["Grey", "Red", "Green", "Amber", "Blue"];
const badgeTypes: AvatarStatusBadgeType[] = ["Verified", "Premium", "Cars24"];
const tokenValueLabelStyles: CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 12,
  lineHeight: "16px"
};

function Surface({
  children,
  onDark
}: {
  children: ReactNode;
  onDark: boolean;
}) {
  return (
    <div
      style={{
        background: String(onDark ? coreTokenCatalog.color.surface.inverse : coreTokenCatalog.color.surface.canvas),
        border: `1px solid ${String(onDark ? "transparent" : coreTokenCatalog.color.border.default)}`,
        borderRadius: 24,
        display: "grid",
        gap: 20,
        padding: 24
      }}
    >
      {children}
    </div>
  );
}

function MatrixLabel({
  brand,
  children,
  onDark,
  strong = false
}: {
  brand: NonNullable<AvatarProps["brand"]>;
  children: ReactNode;
  onDark: boolean;
  strong?: boolean;
}) {
  return (
    <Text
      as={strong ? "strong" : "span"}
      brand={brand}
      size="sm"
      tone={onDark ? "inverse" : strong ? "primary" : "secondary"}
      style={{ display: "block" }}
    >
      {children}
    </Text>
  );
}

function AvatarPreview(args: AvatarProps) {
  return <Avatar {...args} imageSrc={avatarImageSrc} />;
}

function AvatarMatrix({
  brand,
  adornment,
  onDark
}: {
  brand: NonNullable<AvatarProps["brand"]>;
  adornment: Exclude<AvatarAdornment, "None">;
  onDark: boolean;
}) {
  return (
    <Surface onDark={onDark}>
      <div style={matrixStyles}>
        <div />
        {avatarSizes.map((size) => (
          <MatrixLabel brand={brand} key={`${adornment}-${onDark}-${size}`} onDark={onDark} strong>
            {size}
          </MatrixLabel>
        ))}

        {avatarAppearances.flatMap((appearance) => [
          <MatrixLabel brand={brand} key={`${adornment}-${onDark}-${appearance}-label`} onDark={onDark} strong>
            {appearance}
          </MatrixLabel>,
          ...avatarSizes.map((size) => (
            <div key={`${adornment}-${onDark}-${appearance}-${size}`} style={avatarCellStyles}>
              <Avatar
                appearance={appearance}
                adornment={adornment}
                badgeType="Verified"
                brand={brand}
                imageSrc={avatarImageSrc}
                initials="MT"
                onDark={onDark}
                size={size}
                statusDotColor="Green"
              />
            </div>
          ))
        ])}
      </div>
    </Surface>
  );
}

function StatusOptionMatrix({
  brand,
  onDark
}: {
  brand?: NonNullable<AvatarProps["brand"]>;
  onDark: boolean;
}) {
  const activeBrand = (brand ?? "Cars24") as NonNullable<AvatarProps["brand"]>;

  return (
    <Surface onDark={onDark}>
      <div style={{ display: "grid", gap: 20 }}>
        <div style={statusGridStyles}>
          <MatrixLabel brand={activeBrand} onDark={onDark} strong>
            Status dot
          </MatrixLabel>
          {dotColors.map((color) => (
            <div key={`${onDark}-${color}`} style={statusCellStyles}>
              <Avatar appearance="Icon" adornment="Status dot" brand={activeBrand} onDark={onDark} size="Extra large" statusDotColor={color} />
              <MatrixLabel brand={activeBrand} onDark={onDark}>{color}</MatrixLabel>
            </div>
          ))}
        </div>

        <div style={statusGridStyles}>
          <MatrixLabel brand={activeBrand} onDark={onDark} strong>
            Status badge
          </MatrixLabel>
          {badgeTypes.map((badgeType) => (
            <div key={`${onDark}-${badgeType}`} style={statusCellStyles}>
              <Avatar appearance="Icon" adornment="Status badge" badgeType={badgeType} brand={activeBrand} onDark={onDark} size="Extra large" />
              <MatrixLabel brand={activeBrand} onDark={onDark}>{badgeType}</MatrixLabel>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

function TokenRow({
  brand,
  size
}: {
  brand: NonNullable<AvatarProps["brand"]>;
  size: AvatarSize;
}) {
  const metrics = getAvatarResolvedMetrics(brand, size);

  return (
    <>
      <MatrixLabel brand={brand} onDark={false} strong>
        {size}
      </MatrixLabel>
      <div style={tokenCellStyles}>
        <Avatar appearance="Initials" adornment="Status dot" brand={brand} imageSrc={avatarImageSrc} initials="MT" size={size} />
      </div>
      <div style={tokenCellStyles}>
        <div style={tokenValueLabelStyles}>{metrics.boxSizeToken}</div>
        <MatrixLabel brand={brand} onDark={false}>{metrics.boxSize}px</MatrixLabel>
      </div>
      <div style={tokenCellStyles}>
        <div style={tokenValueLabelStyles}>{metrics.iconSizeToken}</div>
        <MatrixLabel brand={brand} onDark={false}>{metrics.iconSize}px</MatrixLabel>
      </div>
      <div style={tokenCellStyles}>
        <div style={tokenValueLabelStyles}>{metrics.fontSizeToken}</div>
        <MatrixLabel brand={brand} onDark={false}>{metrics.fontSize}px</MatrixLabel>
      </div>
      <div style={tokenCellStyles}>
        <div style={tokenValueLabelStyles}>{metrics.lineHeightToken}</div>
        <MatrixLabel brand={brand} onDark={false}>{metrics.lineHeight}px</MatrixLabel>
      </div>
      <div style={tokenCellStyles}>
        <div style={tokenValueLabelStyles}>{metrics.letterSpacingToken}</div>
        <MatrixLabel brand={brand} onDark={false}>{metrics.letterSpacing}</MatrixLabel>
      </div>
    </>
  );
}

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(AVATAR_FIGMA_URL)
  },
  args: {
    appearance: "Icon",
    adornment: "Status dot",
    badgeType: "Verified",
    brand: "Cars24",
    imageAlt: "Profile image",
    imageSrc: avatarImageSrc,
    initials: "MT",
    onDark: false,
    size: "Medium",
    statusDotColor: "Green"
  },
  argTypes: {
    appearance: {
      control: "inline-radio",
      options: avatarAppearances
    },
    adornment: {
      control: "inline-radio",
      options: ["None", ...avatarAdornmentModes]
    },
    badgeType: {
      control: "inline-radio",
      options: badgeTypes
    },
    imageSrc: {
      control: false
    },
    size: {
      control: "inline-radio",
      options: avatarSizes
    },
    statusDotColor: {
      control: "inline-radio",
      options: dotColors
    }
  }
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: AvatarPreview,
  parameters: {
    layout: "centered"
  }
};

export const VariantMatrix: Story = {
  render: ({ brand = "Cars24" }) => (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        {avatarAdornmentModes.map((adornment) => (
          <StoryCard key={adornment}>
            <div style={{ display: "grid", gap: 16 }}>
              <StoryHeading>{adornment}</StoryHeading>
              <StoryCopy>
                Five avatar sizes across icon, image, and initials appearances on both canvas and inverse surfaces.
              </StoryCopy>
              <AvatarMatrix adornment={adornment} brand={brand} onDark={false} />
              <AvatarMatrix adornment={adornment} brand={brand} onDark />
            </div>
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  ),
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const StatusOptions: Story = {
  render: ({ brand = "Cars24" }) => (
    <StoryPage fullscreen>
      <div style={{ display: "grid", gap: 32 }}>
        <StoryCard>
          <div style={{ display: "grid", gap: 16 }}>
            <StoryHeading>Attached Status Primitives</StoryHeading>
            <StoryCopy>
              Status-dot colors and badge types surfaced from the Figma core attachment used by the avatar component.
            </StoryCopy>
            <StatusOptionMatrix brand={brand} onDark={false} />
            <StatusOptionMatrix brand={brand} onDark />
          </div>
        </StoryCard>
      </div>
    </StoryPage>
  ),
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const TokenMapping: Story = {
  render: ({ brand = "Cars24" }) => (
    <StoryPage fullscreen>
      <StoryCard>
        <div style={{ display: "grid", gap: 16 }}>
          <StoryHeading>Size And Token Mapping</StoryHeading>
          <StoryCopy>
            Avatar sizing is now driven from shared token-backed specs. This table shows the exact token mapping used for
            each avatar size in the component for the box, icon, and initials typography.
          </StoryCopy>
          <div style={tokenGridStyles}>
            <MatrixLabel brand={brand} onDark={false} strong>
              Size
            </MatrixLabel>
            <MatrixLabel brand={brand} onDark={false} strong>
              Preview
            </MatrixLabel>
            <MatrixLabel brand={brand} onDark={false} strong>
              Box size token
            </MatrixLabel>
            <MatrixLabel brand={brand} onDark={false} strong>
              Icon size token
            </MatrixLabel>
            <MatrixLabel brand={brand} onDark={false} strong>
              Font size token
            </MatrixLabel>
            <MatrixLabel brand={brand} onDark={false} strong>
              Line height token
            </MatrixLabel>
            <MatrixLabel brand={brand} onDark={false} strong>
              Letter spacing token
            </MatrixLabel>
            {avatarSizes.map((size) => (
              <TokenRow brand={brand} key={size} size={size} />
            ))}
          </div>
        </div>
      </StoryCard>
    </StoryPage>
  ),
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

const matrixStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "minmax(140px, auto) repeat(5, minmax(80px, auto))",
  rowGap: 20
};

const avatarCellStyles: CSSProperties = {
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  minHeight: 80
};

const statusGridStyles: CSSProperties = {
  alignItems: "start",
  columnGap: 20,
  display: "grid",
  gridTemplateColumns: "minmax(120px, auto) repeat(5, minmax(92px, auto))",
  rowGap: 16
};

const statusCellStyles: CSSProperties = {
  alignItems: "center",
  display: "grid",
  gap: 10,
  justifyItems: "center"
};

const tokenGridStyles: CSSProperties = {
  alignItems: "center",
  columnGap: 16,
  display: "grid",
  gridTemplateColumns: "minmax(120px, auto) minmax(90px, auto) repeat(5, minmax(180px, 1fr))",
  rowGap: 16
};

const tokenCellStyles: CSSProperties = {
  display: "grid",
  gap: 4,
  justifyItems: "start"
};
