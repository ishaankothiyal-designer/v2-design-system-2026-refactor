import {
  type ChangeEvent,
  type InputHTMLAttributes,
  useId,
  useInsertionEffect,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import { designSystemRegistry } from "@geist/contracts";
import { type DisplayBrandId, normalizeBrandId } from "@geist/tokens";
import { Icon } from "./icon";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";

export const canonicalChatBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.chatBar"
);

export type ChatBarState = "Default" | "Message Typed";

const CHAT_BAR_ROOT_CLASS = "geist-chat-bar";
const CHAT_BAR_ACTION_CLASS = "geist-chat-bar__action";
const CHAT_BAR_INPUT_CLASS = "geist-chat-bar__input";
const CHAT_BAR_STYLESHEET_ID = "geist-chat-bar-styles";

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

const CHAT_BAR_STYLESHEET = [
  toCssRule(`.${CHAT_BAR_ROOT_CLASS}`, {
    "align-items": "center",
    background: runtimeTokenVar("color.surface.canvas"),
    border: `1px solid ${runtimeTokenVar("component.textInput.color.field.rest.border")}`,
    "border-radius": runtimeTokenVarPx("radius.alt.lg"),
    "box-sizing": "border-box",
    display: "flex",
    gap: runtimeTokenVarPx("component.textInput.size.sm.fieldGap"),
    "min-height": "2.75rem",
    "min-width": "0",
    overflow: "hidden",
    padding: runtimeTokenVarPx("component.phoneInput.size.lg.fieldPaddingBlock"),
    width: "100%"
  }),
  toCssRule(`.${CHAT_BAR_ROOT_CLASS}[data-state="typed"]`, {
    border: `1px solid ${runtimeTokenVar("component.textInput.color.field.rest.placeholder")}`
  }),
  toCssRule(`.${CHAT_BAR_ACTION_CLASS}`, {
    "align-items": "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    color: runtimeTokenVar("component.phoneInput.color.helper.default.text"),
    cursor: "pointer",
    display: "inline-flex",
    "flex": "0 0 auto",
    "justify-content": "center",
    margin: "0",
    padding: "0"
  }),
  toCssRule(`.${CHAT_BAR_ROOT_CLASS}[data-disabled="true"] .${CHAT_BAR_ACTION_CLASS}`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${CHAT_BAR_ACTION_CLASS}[data-role="send"]`, {
    color: runtimeTokenVar("component.textInput.color.field.rest.placeholder")
  }),
  toCssRule(`.${CHAT_BAR_ROOT_CLASS}[data-state="typed"] .${CHAT_BAR_ACTION_CLASS}[data-role="send"]`, {
    color: runtimeTokenVar("color.brand.alt.500")
  }),
  toCssRule(`.${CHAT_BAR_INPUT_CLASS}`, {
    appearance: "none",
    background: "transparent",
    border: "none",
    color: runtimeTokenVar("component.textInput.color.field.rest.placeholder"),
    "flex": "1 1 auto",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-size": runtimeTokenVarPx("component.textInput.typography.input.sm.fontSize"),
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "letter-spacing": runtimeTokenVarPx("component.textInput.typography.input.sm.letterSpacing"),
    "line-height": runtimeTokenVarPx("component.textInput.typography.input.sm.lineHeight"),
    "min-width": "0",
    outline: "none",
    overflow: "hidden",
    padding: "0",
    "text-overflow": "ellipsis",
    "white-space": "nowrap"
  }),
  toCssRule(`.${CHAT_BAR_ROOT_CLASS}[data-state="typed"] .${CHAT_BAR_INPUT_CLASS}`, {
    color: runtimeTokenVar("component.textInput.color.field.rest.value"),
    "font-size": runtimeTokenVarPx("typography.fontSize.sm"),
    "letter-spacing": "0px",
    "line-height": runtimeTokenVarPx("typography.lineHeight.sm")
  }),
  toCssRule(`.${CHAT_BAR_INPUT_CLASS}::placeholder`, {
    color: runtimeTokenVar("component.textInput.color.field.rest.placeholder"),
    opacity: "1"
  })
].join("");

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
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const currentValue = value ?? uncontrolledValue;
  const resolvedState = resolveState({ forceState, state, value: currentValue });
  const repoBrand = normalizeBrandId(brand);
  const dataState = resolvedState === "Message Typed" ? "typed" : "default";
  const inputId = useId();

  useInsertionEffect(() => {
    ensureStyleSheet(CHAT_BAR_STYLESHEET_ID, CHAT_BAR_STYLESHEET);
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  }

  return (
    <div
      className={joinClassNames(CHAT_BAR_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-state={dataState}
      style={style}
    >
      <button
        aria-label={attachmentAriaLabel}
        className={CHAT_BAR_ACTION_CLASS}
        data-role="attachment"
        disabled={disabled}
        onClick={onAttachmentClick}
        type="button"
      >
        <Icon
          brand={brand}
          decorative
          name={attachmentIconName}
          style={{ color: "inherit", flex: "0 0 auto" }}
        />
      </button>
      <input
        {...rest}
        aria-disabled={disabled}
        className={CHAT_BAR_INPUT_CLASS}
        disabled={disabled}
        id={inputId}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={currentValue}
      />
      <button
        aria-label={sendAriaLabel}
        className={CHAT_BAR_ACTION_CLASS}
        data-role="send"
        disabled={disabled}
        onClick={onSendClick}
        type="button"
      >
        <Icon
          brand={brand}
          decorative
          name={sendIconName}
          style={{ color: "inherit", flex: "0 0 auto" }}
        />
      </button>
    </div>
  );
}
