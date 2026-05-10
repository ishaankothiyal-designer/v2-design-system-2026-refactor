import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@geist/tokens";
import {
  ListCard,
  ListCardLeftPart,
  ListCardRightPart,
  type ListCardLeftPartProps,
  type ListCardLeftPartType,
  type ListCardProps,
  type ListCardRightPartProps,
  type ListCardRightPartType,
  type ListCardType
} from "@geist/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const LIST_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28097-9554&t=h5zc6W2b6MPFvMVS-11";
const LIST_CARD_RIGHT_PART_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/DLS-Workshop?node-id=28097-9696&t=h5zc6W2b6MPFvMVS-11";

const LIST_CARD_TYPES: ListCardType[] = [
  "Small: 1T + 1ST",
  "Med: 1B + 1T + 1ST",
  "Med: 2T + 1ST",
  "Med: 1T + 2ST",
  "Med: 1T + 1ST + 1P",
  "Large: 1B + 1T + 2ST"
];

const LIST_CARD_LEFT_PART_TYPES: ListCardLeftPartType[] = [
  "S - Image",
  "M - Image",
  "L - Image",
  "XL",
  "Avatar",
  "Icon",
  "Icon container"
];

const LIST_CARD_RIGHT_PART_TYPES: ListCardRightPartType[] = [
  "Icon",
  "Badge",
  "Radio",
  "Checkbox",
  "Link button"
];

function buildVariantArgs(type: ListCardType): Partial<ListCardProps> {
  if (type === "Med: 1B + 1T + 1ST") {
    return {
      badgeLabel: "Badge",
      subtitle: "Subtitles can be coloured"
    };
  }

  if (type === "Med: 2T + 1ST") {
    return {
      title: "Title left (H4) 15px that can go upto 2 lines",
      subtitle: "Subtitles can be coloured"
    };
  }

  if (type === "Med: 1T + 2ST") {
    return {
      subtitle: "Subtitles 13 body regular that can go upto 2 lines of text"
    };
  }

  if (type === "Med: 1T + 1ST + 1P") {
    return {
      price: "₹4.31 lakh",
      originalPrice: "₹4.91 lakh"
    };
  }

  if (type === "Large: 1B + 1T + 2ST") {
    return {
      badgeLabel: "Badge",
      subtitle: "Subtitles 13 body regular that can go upto 3 lines of text"
    };
  }

  return {};
}

function PlaygroundStory(args: ListCardProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <ListCard {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function VariantMatrix({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={activeBrand} size="xl">
            List Card Matrix
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Full Figma family across the six content combinations and both light and inverse surfaces.
          </StoryCopy>
        </div>

        <div style={matrixStyles}>
          {LIST_CARD_TYPES.map((type) => {
            const variantArgs = buildVariantArgs(type);

            return (
              <div key={type} style={{ display: "grid", gap: 12 }}>
                <StoryHeading brand={activeBrand} size="lg">
                  {type}
                </StoryHeading>

                <div style={variantRowStyles}>
                  <div style={variantCellStyles}>
                    <StoryCopy brand={activeBrand} size="sm">
                      Light
                    </StoryCopy>
                    <ListCard brand={activeBrand} type={type} {...variantArgs} />
                  </div>

                  <div style={variantCellStyles}>
                    <StoryCopy brand={activeBrand} size="sm">
                      Inverse
                    </StoryCopy>
                    <ListCard brand={activeBrand} inverse type={type} {...variantArgs} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildLeftPartArgs(type: ListCardLeftPartType): Partial<ListCardLeftPartProps> {
  if (type === "Avatar") {
    return {
      avatarProps: {
        appearance: "Icon",
        adornment: "Status dot",
        size: "Medium",
        statusDotColor: "Green"
      }
    };
  }

  if (type === "Icon" || type === "Icon container") {
    return {
      iconName: "placeholder-generate-outline"
    };
  }

  return {
    expandButton: true
  };
}

function LeftPartGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
          <StoryHeading brand={activeBrand} size="xl">
            List Card Left Part
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Sub-component gallery for the leading slot family used by List Card, including the image,
            avatar, icon, and icon-container variants from Figma.
          </StoryCopy>
        </div>

        <div style={leftPartGridStyles}>
          {LIST_CARD_LEFT_PART_TYPES.map((type) => (
            <div key={type} style={leftPartCellStyles}>
              <StoryCopy brand={activeBrand} size="sm">
                {type}
              </StoryCopy>
              <ListCardLeftPart brand={activeBrand} type={type} {...buildLeftPartArgs(type)} />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function LeftPartInContextGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";
  const contextualTypes: ListCardLeftPartType[] = [
    "S - Image",
    "M - Image",
    "L - Image",
    "Avatar",
    "Icon",
    "Icon container"
  ];

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={activeBrand} size="xl">
            Left Part In List Card
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Parent List Card rendering the new left-part sub-component in-context, including the
            non-image variants that do not appear in the default matrix.
          </StoryCopy>
        </div>

        <div style={leftPartInContextGridStyles}>
          {contextualTypes.map((leftPartType) => (
            <div key={leftPartType} style={variantCellStyles}>
              <StoryCopy brand={activeBrand} size="sm">
                {leftPartType}
              </StoryCopy>
              <ListCard
                brand={activeBrand}
                leftPartExpandButton={leftPartType === "S - Image" || leftPartType === "M - Image" || leftPartType === "L - Image"}
                leftPartIconName="placeholder-generate-outline"
                leftPartType={leftPartType}
                title="Title left (H4) 15px"
                type={leftPartType === "L - Image" ? "Large: 1B + 1T + 2ST" : "Med: 1B + 1T + 1ST"}
                {...(leftPartType === "Avatar"
                  ? {
                      avatarProps: {
                        appearance: "Icon",
                        adornment: "Status dot",
                        size: "Small",
                        statusDotColor: "Green"
                      } satisfies NonNullable<ListCardProps["avatarProps"]>
                    }
                  : {})}
              />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function buildRightPartArgs(type: ListCardRightPartType): Partial<ListCardRightPartProps> {
  if (type === "Badge") {
    return {
      badgeLabel: "Badge"
    };
  }

  if (type === "Radio") {
    return {
      selected: true
    };
  }

  if (type === "Checkbox") {
    return {
      checked: true
    };
  }

  if (type === "Link button") {
    return {
      linkLabel: "Know more"
    };
  }

  return {};
}

function RightPartGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
          <StoryHeading brand={activeBrand} size="xl">
            List Card Right Part
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Sub-component gallery for the trailing slot family used by List Card, including the
            icon, badge, radio, checkbox, and link-button variants from Figma.
          </StoryCopy>
        </div>

        <div style={rightPartGridStyles}>
          {LIST_CARD_RIGHT_PART_TYPES.map((type) => (
            <div key={type} style={leftPartCellStyles}>
              <StoryCopy brand={activeBrand} size="sm">
                {type}
              </StoryCopy>
              <div style={rightPartPreviewFrameStyles}>
                <ListCardRightPart brand={activeBrand} type={type} {...buildRightPartArgs(type)} />
              </div>
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

function RightPartInContextGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={activeBrand} size="xl">
            Right Part In List Card
          </StoryHeading>
          <StoryCopy brand={activeBrand} size="md">
            Parent List Card rendering the new right-part sub-component in-context across the
            complete trailing-slot family from Figma.
          </StoryCopy>
        </div>

        <div style={rightPartInContextGridStyles}>
          {LIST_CARD_RIGHT_PART_TYPES.map((rightPartType) => (
            <div key={rightPartType} style={variantCellStyles}>
              <StoryCopy brand={activeBrand} size="sm">
                {rightPartType}
              </StoryCopy>
              <ListCard
                badgeLabel="Badge"
                brand={activeBrand}
                rightPartBadgeLabel="Badge"
                rightPartChecked={rightPartType === "Checkbox"}
                rightPartLinkLabel="Know more"
                rightPartSelected={rightPartType === "Radio"}
                rightPartType={rightPartType}
                title="Title left (H4) 15px"
                type="Med: 1B + 1T + 1ST"
              />
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const matrixStyles: CSSProperties = {
  display: "grid",
  gap: 24
};

const variantRowStyles: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const leftPartGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, max-content))"
};

const leftPartCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const leftPartInContextGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))"
};

const rightPartGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, max-content))"
};

const rightPartInContextGridStyles: CSSProperties = {
  alignItems: "start",
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))"
};

const rightPartPreviewFrameStyles: CSSProperties = {
  alignItems: "stretch",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  display: "flex",
  height: 100,
  justifyContent: "flex-end",
  paddingInlineStart: 16,
  width: "100%"
};

const listCardSourceCode = `<ListCard
  brand="Cars24"
  type="Med: 1B + 1T + 1ST"
  title="Title left (H4) 15px"
  subtitle="Subtitles can be coloured"
  badgeLabel="Badge"
/>\n`;

const meta: Meta<ListCardProps> = {
  title: "Components/Cards/List Card",
  component: ListCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(LIST_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    inverse: false,
    type: "Med: 1B + 1T + 1ST",
    title: "Title left (H4) 15px",
    subtitle: "Subtitles can be coloured",
    badgeLabel: "Badge",
    price: "₹4.31 lakh",
    originalPrice: "₹4.91 lakh",
    linkLabel: null,
    rightPartBadgeLabel: null,
    rightPartChecked: false,
    rightPartLinkLabel: null,
    rightPartSelected: false,
    showChevron: true
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
    },
    type: {
      control: "select",
      options: LIST_CARD_TYPES
    },
    title: {
      control: "text"
    },
    subtitle: {
      control: "text"
    },
    badgeLabel: {
      control: "text"
    },
    price: {
      control: "text"
    },
    originalPrice: {
      control: "text"
    },
    linkLabel: {
      control: "text"
    },
    leftPartType: {
      control: "select",
      options: LIST_CARD_LEFT_PART_TYPES
    },
    leftPartExpandButton: {
      control: "boolean"
    },
    rightPartType: {
      control: "select",
      options: LIST_CARD_RIGHT_PART_TYPES
    },
    rightPartBadgeLabel: {
      control: "text"
    },
    rightPartSelected: {
      control: "boolean"
    },
    rightPartChecked: {
      control: "boolean"
    },
    rightPartLinkLabel: {
      control: "text"
    },
    showChevron: {
      control: "boolean"
    },
    avatarProps: {
      control: false
    },
    media: {
      control: false
    },
    leftPartIconName: {
      control: false
    },
    ctaLeadingIconName: {
      control: false
    },
    ctaTrailingIconName: {
      control: false
    }
  },
  render: (args) => <PlaygroundStory {...args} />
};

export default meta;

type Story = StoryObj<ListCardProps>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: listCardSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand }) => <VariantMatrix brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const LeftPartVariants: Story = {
  render: ({ brand }) => <LeftPartGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: `<ListCardLeftPart brand="Cars24" type="M - Image" expandButton />`
      }
    }
  }
};

export const LeftPartInListCard: Story = {
  render: ({ brand }) => <LeftPartInContextGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] },
    docs: {
      source: {
        code: `<ListCard
  brand="Cars24"
  type="Med: 1B + 1T + 1ST"
  leftPartType="Icon container"
  leftPartIconName="placeholder-generate-outline"
  title="Title left (H4) 15px"
  subtitle="Subtitles can be coloured"
  badgeLabel="Badge"
/>`
      }
    }
  }
};

export const RightPartVariants: Story = {
  render: ({ brand }) => <RightPartGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] },
    design: createFigspecDesign(LIST_CARD_RIGHT_PART_FIGMA_URL),
    docs: {
      source: {
        code: `<ListCardRightPart brand="Cars24" type="Badge" badgeLabel="Badge" />`
      }
    }
  }
};

export const RightPartInListCard: Story = {
  render: ({ brand }) => <RightPartInContextGallery brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] },
    design: createFigspecDesign(LIST_CARD_RIGHT_PART_FIGMA_URL),
    docs: {
      source: {
        code: `<ListCard
  brand="Cars24"
  type="Med: 1B + 1T + 1ST"
  badgeLabel="Badge"
  rightPartType="Checkbox"
  rightPartChecked
  title="Title left (H4) 15px"
  subtitle="Subtitles can be coloured"
/>`
      }
    }
  }
};
