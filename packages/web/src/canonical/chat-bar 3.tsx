import {
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  useId,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";

export const canonicalChatBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.chatBar"
);

export type ChatBarState = "Default" | "Message Typed";

export interface ChatBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "defaultValue" | "size" | "value"> {
  attachmentAriaLabel?: string;
  attachmentIconName?: IconName;
  brand?: DisplayBrandId;
  defaultValue?: string;
  forceState?: ChatBarState;
  onAttachmentClick?: () => void;
  onSendClick?: () => void;
  sendAriaLabel?: string;
  sendIconName?: IconName;
  state?: ChatBarState;
  value?: string;
}

const CHAT_BAR_ROOT_STYLES: CSSProperties = {
  alignItems: "center",
  background: "var(--cars24-semantic-bg-primary, #FFFFFF)",
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: "var(--cars24-theme-radius-alt-lg, 14px)",
  boxSizing: "border-box",
  display: "flex",
  gap: "var(--cars24-misc-gap-8, 8px)",
  minHeight: 44,
  minWidth: 0,
  overflow: "hidden",
  padding: "var(--cars24-misc-gap-10, 10px)",
  width: "100%"
};

const CHAT_BAR_TEXT_BASE_STYLES: CSSProperties = {
  fontFamily: 'var(--cars24-theme-font-family-primary, "Geist"), sans-serif',
  fontWeight: "var(--cars24-theme-font-weight-regular, 400)",
  margin: 0,
  minWidth: 0
};

const CHAT_BAR_TEXT_STYLES: Record<ChatBarState, CSSProperties> = {
  Default: {
    color: "var(--cars24-semantic-text-tertiary, #94A3B8)",
    fontSize: "var(--cars24-typography-size-utility-label-2, 14px)",
    letterSpacing: "var(--cars24-typography-letter-spacing-utility-label-2, 0px)",
    lineHeight: "var(--cars24-typography-line-height-utility-label-2, 18px)"
  },
  "Message Typed": {
    color: "var(--cars24-semantic-text-primary, #020617)",
    fontSize: "var(--cars24-typography-size-paragraph-body-2, 14px)",
    letterSpacing: "var(--cars24-typography-letter-spacing-paragraph-body-2, 0px)",
    lineHeight: "var(--cars24-typography-line-height-paragraph-body-2, 20px)"
  }
};

const CHAT_BAR_BORDER_COLORS: Record<ChatBarState, string> = {
  Default: "var(--cars24-semantic-border-secondary, #CBD5E1)",
  "Message Typed": "var(--cars24-semantic-border-tertiary, #94A3B8)"
};

const CHAT_BAR_SEND_ICON_COLORS: Record<ChatBarState, string> = {
  Default: "var(--cars24-semantic-icon-tertiary, #94A3B8)",
  "Message Typed": "var(--cars24-semantic-icon-brand-base, #4736FE)"
};

const CHAT_BAR_ATTACHMENT_ICON_COLOR = "var(--cars24-semantic-icon-secondary, #64748B)";

function resolveState({
  forceState,
  state,
  value
}: {
  forceState: ChatBarState | undefined;
  state: ChatBarState | undefined;
  value: string;
}) {
  if (forceState) {
    return forceState;
  }

  if (state) {
    return state;
  }

  return value.length > 0 ? "Message Typed" : "Default";
}

export function ChatBar({
  attachmentAriaLabel = "Add attachment",
  attachmentIconName = "circle-plus-outline",
  brand = "Cars24",
  className,
  defaultValue,
  disabled = false,
  forceState,
  onAttachmentClick,
  onChange,
  onSendClick,
  placeholder = "Write a message...",
  sendAriaLabel = "Send message",
  sendIconName = "send-line",
  state,
  style,
  type = "text",
  value,
  ...rest
}: ChatBarProps) {
  const generatedId = useId();
  const placeholderClassName = `geist-chat-bar-placeholder-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const currentValue = value ?? uncontrolledValue;
  const previewMode = forceState !== undefined;
  const resolvedState = resolveState({ forceState, state, value: currentValue });

  const rootStyles: CSSProperties = {
    ...CHAT_BAR_ROOT_STYLES,
    borderColor: CHAT_BAR_BORDER_COLORS[resolvedState],
    ...style
  };

  const iconButtonStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    color: CHAT_BAR_ATTACHMENT_ICON_COLOR,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flex: "0 0 auto",
    justifyContent: "center",
    margin: 0,
    padding: 0
  };

  const inputStyles: CSSProperties = {
    ...CHAT_BAR_TEXT_BASE_STYLES,
    ...CHAT_BAR_TEXT_STYLES[resolvedState],
    appearance: "none",
    background: "transparent",
    border: "none",
    flex: "1 1 auto",
    outline: "none",
    padding: 0
  };

  const previewTextStyles: CSSProperties = {
    ...CHAT_BAR_TEXT_BASE_STYLES,
    ...CHAT_BAR_TEXT_STYLES[resolvedState],
    flex: "1 1 auto",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  }

  const previewValue = resolvedState === "Message Typed" ? currentValue || placeholder : placeholder;

  return (
    <div className={className} style={rootStyles}>
      <style>{`
        .${placeholderClassName}::placeholder {
          color: var(--cars24-semantic-text-tertiary, #94A3B8);
          opacity: 1;
        }
      `}</style>
      <button
        aria-label={attachmentAriaLabel}
        disabled={disabled}
        onClick={onAttachmentClick}
        style={iconButtonStyles}
        type="button"
      >
        <Icon
          brand={brand}
          decorative
          name={attachmentIconName}
          style={{
            color: CHAT_BAR_ATTACHMENT_ICON_COLOR,
            flex: "0 0 auto"
          }}
        />
      </button>
      {previewMode ? (
        <p style={previewTextStyles}>{previewValue}</p>
      ) : (
        <input
          {...rest}
          aria-disabled={disabled}
          className={placeholderClassName}
          disabled={disabled}
          onChange={handleChange}
          placeholder={placeholder}
          style={inputStyles}
          type={type}
          value={currentValue}
        />
      )}
      <button
        aria-label={sendAriaLabel}
        disabled={disabled}
        onClick={onSendClick}
        style={{
          ...iconButtonStyles,
          color: CHAT_BAR_SEND_ICON_COLORS[resolvedState]
        }}
        type="button"
      >
        <Icon
          brand={brand}
          decorative
          name={sendIconName}
          style={{
            color: CHAT_BAR_SEND_ICON_COLORS[resolvedState],
            flex: "0 0 auto"
          }}
        />
      </button>
    </div>
  );
}
