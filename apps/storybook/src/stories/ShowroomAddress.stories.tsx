import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { STORYBOOK_BRAND_OPTIONS, type DisplayBrandId } from "@turbo/tokens";
import {
  Icon,
  ShowroomAddress,
  Text,
  type ShowroomAddressProps,
  type ShowroomStatusState
} from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import { StoryCard, StoryPage } from "../storybook-shell";

const SHOWROOM_ADDRESS_FIGMA_URL =
  "https://www.figma.com/design/P5dkiAaGjox0hIMcBO8nws/-TEST--Widget-Library?node-id=28720-2456&t=vUpeNbWJ84H8ABzi-11";

const showroomStatuses: ShowroomStatusState[] = ["Open", "Closed", "Closing soon"];

const gridStyles: CSSProperties = {
  display: "grid",
  gap: 24,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, max-content))",
  justifyContent: "center"
};

function StoryLabel({
  brand,
  children
}: {
  brand: DisplayBrandId;
  children: string;
}) {
  return (
    <Text brand={brand} as="strong" size="sm" tone="secondary" style={{ display: "block" }}>
      {children}
    </Text>
  );
}

function PlaygroundStory(args: ShowroomAddressProps) {
  return (
    <StoryPage fullscreen>
      <StoryCard style={{ width: "fit-content" }}>
        <ShowroomAddress {...args} />
      </StoryCard>
    </StoryPage>
  );
}

function StatusStatesStory({ brand = "Cars24" }: Pick<ShowroomAddressProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={gridStyles}>
        {showroomStatuses.map((status) => (
          <StoryCard key={status} style={{ display: "grid", gap: 12, width: "fit-content" }}>
            <StoryLabel brand={activeBrand}>{status}</StoryLabel>
            <ShowroomAddress
              brand={activeBrand}
              showroomTiming={status === "Closed" ? "Opens tomorrow at 10:00 AM" : "Closes at 8:00 PM"}
              status={status}
            />
          </StoryCard>
        ))}
      </div>
    </StoryPage>
  );
}

function CompositionOptionsStory({ brand = "Cars24" }: Pick<ShowroomAddressProps, "brand">) {
  const activeBrand = brand ?? "Cars24";

  return (
    <StoryPage fullscreen>
      <div style={gridStyles}>
        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Default</StoryLabel>
          <ShowroomAddress brand={activeBrand} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Without rating</StoryLabel>
          <ShowroomAddress brand={activeBrand} showRating={false} />
        </StoryCard>

        <StoryCard style={{ display: "grid", gap: 12, width: "fit-content" }}>
          <StoryLabel brand={activeBrand}>Custom content</StoryLabel>
          <ShowroomAddress
            addressLine1="CARS24 Hub, Sector 18"
            addressLine2="DLF Cyber City, Gurugram"
            brand={activeBrand}
            callAction={{
              label: "Call hub",
              leadingIcon: <Icon brand={activeBrand} decorative name="call-1" />
            }}
            directionsAction={{
              label: "Navigate",
              leadingIcon: <Icon brand={activeBrand} decorative name="arrow-lbow-up-right" />
            }}
            distance="2.1 Km from IFFCO Chowk"
            ratingValue="4.7"
            showroomTiming="Closes at 9:00 PM"
          />
        </StoryCard>
      </div>
    </StoryPage>
  );
}

const showroomAddressSourceCode = `<ShowroomAddress
  brand="Cars24"
  addressLine1="Address line 1"
  addressLine2="Address line 2"
  distance="4.5 Km from Connaught Place"
  status="Open"
  showroomTiming="Closes at 8:00 PM"
  showRating
  ratingValue="4.4"
/>`;

const meta = {
  title: "Widgets/Showroom Address",
  component: ShowroomAddress,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(SHOWROOM_ADDRESS_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    addressLine1: "Address line 1",
    addressLine2: "Address line 2",
    distance: "4.5 Km from Connaught Place",
    status: "Open",
    showroomTiming: "Closes at 8:00 PM",
    showRating: true,
    ratingValue: "4.4"
  },
  argTypes: {
    brand: {
      control: "radio",
      options: STORYBOOK_BRAND_OPTIONS
    },
    addressLine1: {
      control: "text"
    },
    addressLine2: {
      control: "text"
    },
    distance: {
      control: "text"
    },
    status: {
      control: "select",
      options: showroomStatuses
    },
    showroomTiming: {
      control: "text"
    },
    showRating: {
      control: "boolean"
    },
    ratingValue: {
      control: "text"
    },
    callAction: {
      control: false
    },
    directionsAction: {
      control: false
    }
  },
  render: PlaygroundStory
} satisfies Meta<ShowroomAddressProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: showroomAddressSourceCode
      }
    }
  }
};

export const StatusStates: Story = {
  render: ({ brand }) => <StatusStatesStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};

export const CompositionOptions: Story = {
  render: ({ brand }) => <CompositionOptionsStory brand={brand ?? "Cars24"} />,
  parameters: {
    controls: { include: ["brand"] }
  }
};
