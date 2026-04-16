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
import { getRequiredThemeTokenValue } from "../theme";
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

function getTextBaseStyles(brand: DisplayBrandId): CSSProperties {
  return {
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontWeight: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")),
    margin: 0,
    minWidth: 0
  };
}

function getTextStyles(brand: DisplayBrandId, state: ChatBarState): CSSProperties {
  if (state === "Message Typed") {
    return {
      color: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.value")),
      fontSize: Number(getRequiredThemeTokenValue(brand, "typography.fontSize.sm")),
      letterSpacing: "0px",
      lineHeight: `${Number(getRequiredThemeTokenValue(brand, "typography.lineHeight.sm"))}px`
    };
  }

  return {
    color: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder")),
    fontSize: Number(getRequiredThemeTokenValue(brand, "component.textInput.typography.input.sm.fontSize")),
    letterSpacing: `${Number(getRequiredThemeTokenValue(brand, "component.textInput.typography.input.sm.letterSpacing"))}px`,
    lineHeight: `${Number(getRequiredThemeTokenValue(brand, "component.textInput.typography.input.sm.lineHeight"))}px`
  };
}

function getBorderColor(brand: DisplayBrandId, state: ChatBarState) {
  return state === "Message Typed"
    ? String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder"))
    : String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.border"));
}

function getSendIconColor(brand: DisplayBrandId, state: ChatBarState) {
  return state === "Message Typed"
    ? String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"))
    : String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder"));
}

function getAttachmentIconColor(brand: DisplayBrandId) {
  return String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.helper.default.text"));
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
  const resolvedState = resolveState({ forceState, state, value: currentValue });
  const fieldGap = Number(getRequiredThemeTokenValue(brand, "component.textInput.size.sm.fieldGap"));
  const fieldPadding = Number(getRequiredThemeTokenValue(brand, "component.phoneInput.size.lg.fieldPaddingBlock"));
  const fieldRadius = Number(getRequiredThemeTokenValue(brand, "radius.alt.lg"));
  const backgroundColor = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const textBaseStyles = getTextBaseStyles(brand);
  const resolvedTextStyles = getTextStyles(brand, resolvedState);
  const attachmentIconColor = getAttachmentIconColor(brand);
  const sendIconColor = getSendIconColor(brand, resolvedState);

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: backgroundColor,
    border: `1px solid ${getBorderColor(brand, resolvedState)}`,
    borderRadius: `${fieldRadius}px`,
    boxSizing: "border-box",
    display: "flex",
    gap: `${fieldGap}px`,
    minHeight: 44,
    minWidth: 0,
    overflow: "hidden",
    padding: `${fieldPadding}px`,
    width: "100%",
    ...style
  };

  const iconButtonStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    color: attachmentIconColor,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flex: "0 0 auto",
    justifyContent: "center",
    margin: 0,
    padding: 0
  };

  const inputStyles: CSSProperties = {
    ...textBaseStyles,
    ...resolvedTextStyles,
    appearance: "none",
    background: "transparent",
    border: "none",
    flex: "1 1 auto",
    minWidth: 0,
    outline: "none",
    overflow: "hidden",
    padding: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  }

  return (
    <div className={className} style={rootStyles}>
      <style>{`
        .${placeholderClassName}::placeholder {
          color: ${String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder"))};
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
            color: attachmentIconColor,
            flex: "0 0 auto"
          }}
        />
      </button>
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
      <button
        aria-label={sendAriaLabel}
        disabled={disabled}
        onClick={onSendClick}
        style={{
          ...iconButtonStyles,
          color: sendIconColor
        }}
        type="button"
      >
        <Icon
          brand={brand}
          decorative
          name={sendIconName}
          style={{
            color: sendIconColor,
            flex: "0 0 auto"
          }}
        />
      </button>
    </div>
  );
}
