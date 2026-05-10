import type { ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { STORYBOOK_BRAND_OPTIONS } from "@turbo/tokens";
import { ChatBar, type ChatBarProps, type ChatBarState } from "@turbo/web";
import { createFigspecDesign } from "../storybookFigma";
import {
  StoryMatrix,
  StoryMatrixCornerCell,
  StoryMatrixHeaderCell,
  StoryMatrixRowLabelCell,
  StoryMatrixValueCell
} from "../storybook-matrix";
import { StoryPage } from "../storybook-shell";

const CHAT_BAR_FIGMA_URL =
  "https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=14353-33725&t=1zgOyFpiLYMyM4XM-11";

const chatBarStates: ChatBarState[] = ["Default", "Message Typed"];

type ChatBarStoryArgs = ChatBarProps;

function Preview(args: ChatBarStoryArgs) {
  return (
    <div style={{ width: 328 }}>
      <ChatBar {...args} />
    </div>
  );
}

function PlaygroundStory(args: ChatBarStoryArgs) {
  const [{ value }, updateArgs] = useArgs<ChatBarStoryArgs>();
  const isControlled = value !== undefined;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isControlled) {
      updateArgs({ value: event.currentTarget.value });
    }

    args.onChange?.(event);
  }

  return (
    <div style={{ width: 328 }}>
      <ChatBar {...args} {...(isControlled ? { value } : {})} onChange={handleChange} />
    </div>
  );
}

function StateGallery({ brand }: { brand: NonNullable<ChatBarProps["brand"]> }) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px minmax(328px, 1fr)">
        <StoryMatrixHeaderCell>State</StoryMatrixHeaderCell>
        <StoryMatrixHeaderCell>Preview</StoryMatrixHeaderCell>
        {chatBarStates.flatMap((state) => [
          <StoryMatrixRowLabelCell key={`${state}-label`} minHeight={96}>
            {state}
          </StoryMatrixRowLabelCell>,
          <StoryMatrixValueCell key={state} minHeight={96}>
            <Preview
              brand={brand}
              forceState={state}
              {...(state === "Message Typed"
                ? {
                    value: "This is a placeholder message for the chat action bar and it will only show upto 3 lines"
                  }
                : {})}
            />
          </StoryMatrixValueCell>
        ])}
      </StoryMatrix>
    </StoryPage>
  );
}

function StateMatrixStory({
  brand,
  state,
  stateLabel
}: {
  brand: NonNullable<ChatBarProps["brand"]>;
  state: ChatBarState;
  stateLabel: string;
}) {
  return (
    <StoryPage fullscreen>
      <StoryMatrix columns="180px minmax(328px, 1fr)">
        <StoryMatrixCornerCell />
        <StoryMatrixHeaderCell>Chat Bar</StoryMatrixHeaderCell>
        <StoryMatrixRowLabelCell minHeight={96}>{stateLabel}</StoryMatrixRowLabelCell>
        <StoryMatrixValueCell minHeight={96}>
          <Preview
            brand={brand}
            forceState={state}
            {...(state === "Message Typed"
              ? {
                  value: "This is a placeholder message for the chat action bar and it will only show upto 3 lines"
                }
              : {})}
          />
        </StoryMatrixValueCell>
      </StoryMatrix>
    </StoryPage>
  );
}

function buildChatBarStateSourceCode({
  label,
  state
}: {
  label: string;
  state: ChatBarState;
}) {
  return `import { ChatBar } from "@turbo/web";

export function ChatBar${label.replace(/[^a-zA-Z0-9]/g, "")}() {
  return (
    <ChatBar
      brand="Cars24"
      forceState="${state}"${state === "Message Typed" ? '\n      value="This is a placeholder message for the chat action bar and it will only show upto 3 lines"' : ""}
    />
  );
}`;
}

const meta: Meta<ChatBarStoryArgs> = {
  title: "Components/Forms/Chat Bar",
  component: ChatBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: createFigspecDesign(CHAT_BAR_FIGMA_URL)
  },
  args: {
    brand: "Cars24",
    placeholder: "Write a message...",
    value: ""
  },
  argTypes: {
    brand: {
      control: "select",
      options: STORYBOOK_BRAND_OPTIONS
    },
    state: {
      control: "inline-radio",
      options: chatBarStates
    },
    forceState: {
      control: "inline-radio",
      options: [undefined, ...chatBarStates]
    },
    attachmentIconName: {
      control: "text"
    },
    sendIconName: {
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

type Story = StoryObj<ChatBarStoryArgs>;

export const Playground: Story = {
  parameters: {
    layout: "centered"
  }
};

export const AllStates: Story = {
  render: ({ brand = "Cars24" }) => <StateGallery brand={brand} />,
  parameters: {
    controls: {
      include: ["brand"]
    }
  }
};

export const Default: Story = {
  render: ({ brand = "Cars24" }) => <StateMatrixStory brand={brand} state="Default" stateLabel="Default" />,
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildChatBarStateSourceCode({ label: "Default", state: "Default" }) } }
  }
};

export const MessageTyped: Story = {
  render: ({ brand = "Cars24" }) => (
    <StateMatrixStory brand={brand} state="Message Typed" stateLabel="Message Typed" />
  ),
  parameters: {
    controls: { include: ["brand"] },
    docs: { source: { code: buildChatBarStateSourceCode({ label: "MessageTyped", state: "Message Typed" }) } }
  }
};
