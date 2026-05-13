import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import { BlogCard, type BlogCardProps } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryCopy, StoryHeading, StoryPage } from "../storybook-shell";

const BLOG_CARD_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28615-5819&t=h5zc6W2b6MPFvMVS-11";

const DEMO_TITLE = "A two line title car easily fit in the container. 15px";
const DEMO_DESCRIPTION =
  "Body text covering every aspect of the thing that is covered and conveyed to the user.";
const DEMO_AVATAR_SRC = createAvatarSvgDataUri("N", "#5B4CFF", "#F97316");

function createAvatarSvgDataUri(label: string, background: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="32" fill="${background}" />
      <circle cx="20" cy="24" r="11" fill="#FDE68A" />
      <path d="M8 55C11.5 44 20.8 39 32 39C43.2 39 52.5 44 56 55" fill="${accent}" />
      <text x="32" y="38" text-anchor="middle" fill="white" font-family="Geist, Arial, sans-serif" font-size="22" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function DemoMedia() {
  return (
    <div
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 50% 26%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0) 16%), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 42%), var(--cars24-primitive-drive-pink-50, #FFE8F7)",
        height: "100%",
        width: "100%"
      }}
    />
  );
}

function renderCard(args: BlogCardProps) {
  return (
    <BlogCard
      {...args}
      avatarProps={{
        appearance: "Image",
        imageAlt: `${args.authorName ?? "Name"} avatar`,
        imageSrc: DEMO_AVATAR_SRC
      }}
    >
      <DemoMedia />
    </BlogCard>
  );
}

function PlaygroundStory({
  authorName = "Name",
  brand = "Cars24",
  date = "DD MM YYYY",
  description = DEMO_DESCRIPTION,
  inverse = false,
  secondaryInfo = "Secondary info",
  showDescription = true,
  showPlayButton = true,
  showTag = true,
  tagLabel = "Badge",
  title = DEMO_TITLE
}: BlogCardProps) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Blog Card Playground
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Editorial discovery card with the optional tag, floating play affordance, and author
            metadata lockup from the Figma component set.
          </StoryCopy>
        </div>

        {renderCard({
          authorName,
          brand: displayBrand,
          date,
          description,
          inverse,
          secondaryInfo,
          showDescription,
          showPlayButton,
          showTag,
          tagLabel,
          title
        })}
      </StoryCard>
    </StoryPage>
  );
}

function VariantGallery({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  const displayBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <StoryCard style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "grid", gap: 8, maxWidth: 760 }}>
          <StoryHeading brand={displayBrand} size="xl">
            Blog Card Variants
          </StoryHeading>
          <StoryCopy brand={displayBrand} size="md">
            Visible coverage of the approved light and inverse large-card variants, plus the optional
            description, tag, and play affordance toggles exposed by the Figma component props.
          </StoryCopy>
        </div>

        <div style={galleryStyles}>
          {[
            {
              key: "light-default",
              label: "Inverse: No",
              props: {
                inverse: false,
                showDescription: true,
                showPlayButton: true,
                showTag: true
              }
            },
            {
              key: "inverse-default",
              label: "Inverse: Yes",
              props: {
                inverse: true,
                showDescription: true,
                showPlayButton: true,
                showTag: true
              }
            },
            {
              key: "light-no-description",
              label: "Description Off",
              props: {
                inverse: false,
                showDescription: false,
                showPlayButton: true,
                showTag: true
              }
            },
            {
              key: "light-no-overlays",
              label: "Tag + Play Off",
              props: {
                inverse: false,
                showDescription: true,
                showPlayButton: false,
                showTag: false
              }
            }
          ].map((entry) => (
            <div key={entry.key} style={variantCellStyles}>
              <StoryCopy brand={displayBrand} size="sm">
                {entry.label}
              </StoryCopy>
              {renderCard({
                authorName: "Name",
                brand: displayBrand,
                date: "DD MM YYYY",
                description: DEMO_DESCRIPTION,
                secondaryInfo: "Secondary info",
                tagLabel: "Badge",
                title: DEMO_TITLE,
                ...entry.props
              })}
            </div>
          ))}
        </div>
      </StoryCard>
    </StoryPage>
  );
}

const galleryStyles: CSSProperties = {
  alignItems: "start",
  display: "flex",
  flexWrap: "wrap",
  gap: 24
};

const variantCellStyles: CSSProperties = {
  display: "grid",
  gap: 8,
  justifyItems: "start"
};

const defaultSourceCode = `<BlogCard
  brand="Cars24"
  title="${DEMO_TITLE}"
  description="${DEMO_DESCRIPTION}"
  authorName="Name"
  date="DD MM YYYY"
  secondaryInfo="Secondary info"
  tagLabel="Badge"
/>`;

const meta = {
  title: "Components/Blog Card",
  component: BlogCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(BLOG_CARD_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    title: DEMO_TITLE,
    description: DEMO_DESCRIPTION,
    authorName: "Name",
    date: "DD MM YYYY",
    secondaryInfo: "Secondary info",
    tagLabel: "Badge",
    inverse: false,
    showDescription: true,
    showPlayButton: true,
    showTag: true,
    playLabel: "Play article"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    inverse: {
      control: "boolean"
    },
    title: {
      control: "text"
    },
    description: {
      control: "text"
    },
    authorName: {
      control: "text"
    },
    date: {
      control: "text"
    },
    secondaryInfo: {
      control: "text"
    },
    tagLabel: {
      control: "text"
    },
    showDescription: {
      control: "boolean"
    },
    showPlayButton: {
      control: "boolean"
    },
    showTag: {
      control: "boolean"
    },
    avatarProps: {
      control: false
    },
    children: {
      control: false
    },
    onPlayClick: {
      control: false
    },
    playLabel: {
      control: "text"
    },
    type: {
      control: false
    }
  }
} satisfies Meta<typeof BlogCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <PlaygroundStory {...args} />,
  parameters: {
    docs: {
      source: {
        code: defaultSourceCode
      }
    }
  }
};

export const Variants: Story = {
  render: ({ brand = "Cars24" }) => <VariantGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};
