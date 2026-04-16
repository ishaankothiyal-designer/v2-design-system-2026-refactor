import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue } from "../theme";
import { Button, type ButtonProps, type ButtonShape } from "./button";
import { LinkButton, type LinkButtonProps } from "./link-button";

export const canonicalButtonGroupWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.buttonGroup"
);

export type ButtonGroupType = "Vertical" | "Horizontal" | "Contextual Action";
export type ButtonGroupSize = "Small" | "Medium" | "Large";

export interface ButtonGroupButtonAction
  extends Omit<ButtonProps, "brand" | "children" | "onDark" | "shape" | "size" | "styleVariant"> {
  label: ReactNode;
}

export interface ButtonGroupContextualAction
  extends Omit<LinkButtonProps, "brand" | "children" | "onDark" | "size"> {
  prompt: ReactNode;
  label: ReactNode;
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  type?: ButtonGroupType;
  size?: ButtonGroupSize;
  shape?: ButtonShape;
  onDark?: boolean;
  primaryAction: ButtonGroupButtonAction;
  secondaryAction?: ButtonGroupButtonAction;
  contextualAction?: ButtonGroupContextualAction;
}

function getButtonSize(size: ButtonGroupSize): Extract<ButtonProps["size"], ButtonGroupSize> {
  return size;
}

function getLayoutMetrics(brand: DisplayBrandId, size: ButtonGroupSize) {
  const stackGap = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const inlineGap = Number(getRequiredThemeTokenValue(brand, "spacing.1"));
  const contextualPaddingBlock = size === "Medium" ? inlineGap / 2 : inlineGap;
  const promptFontSize = Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.md.fontSize"));
  const promptLineHeight = Number(getRequiredThemeTokenValue(brand, "component.linkButton.typography.md.lineHeight"));
  const promptLetterSpacing = Number(
    getRequiredThemeTokenValue(brand, "component.linkButton.typography.md.letterSpacing")
  );

  return {
    stackGap,
    inlineGap,
    contextualPaddingBlock,
    promptFontSize,
    promptLineHeight,
    promptLetterSpacing
  };
}

function getButtonLayoutStyle(type: ButtonGroupType): CSSProperties {
  if (type === "Horizontal") {
    return {
      flex: "1 1 0",
      minWidth: 0,
      width: "100%"
    };
  }

  return {
    minWidth: 0,
    width: "100%"
  };
}

/**
 * Token-driven composition for grouped primary, secondary, and contextual button actions.
 */
export function ButtonGroup({
  brand = "Cars24",
  type = "Vertical",
  size = "Large",
  shape = "Regular",
  onDark = false,
  primaryAction,
  secondaryAction,
  contextualAction,
  style,
  ...rest
}: ButtonGroupProps) {
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const promptColor = String(
    getRequiredThemeTokenValue(brand, onDark ? "color.text.inverse" : "color.text.primary")
  );
  const metrics = getLayoutMetrics(brand, size);
  const buttonSize = getButtonSize(size);
  const buttonLayoutStyle = getButtonLayoutStyle(type);
  const isHorizontal = type === "Horizontal";
  const isContextualAction = type === "Contextual Action";

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    gap: `${metrics.stackGap}px`,
    width: "100%",
    ...style
  };

  const contextualRowStyles: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: `${metrics.inlineGap}px`,
    justifyContent: "center",
    padding: `${metrics.contextualPaddingBlock}px 0`,
    width: "100%"
  };

  const promptStyles: CSSProperties = {
    color: promptColor,
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize: `${metrics.promptFontSize}px`,
    fontWeight,
    letterSpacing: `${metrics.promptLetterSpacing}px`,
    lineHeight: `${metrics.promptLineHeight}px`,
    whiteSpace: "nowrap"
  };

  const {
    label: primaryLabel,
    style: primaryStyle,
    type: primaryButtonType,
    ...primaryButtonProps
  } = primaryAction;

  const resolvedPrimaryStyle: CSSProperties = {
    ...primaryStyle,
    ...buttonLayoutStyle
  };

  return (
    <div {...rest} style={rootStyles}>
      {!isHorizontal ? (
        <Button
          {...primaryButtonProps}
          brand={brand}
          onDark={onDark}
          shape={shape}
          size={buttonSize}
          style={resolvedPrimaryStyle}
          styleVariant="Solid"
          type={primaryButtonType ?? "button"}
        >
          {primaryLabel}
        </Button>
      ) : null}

      {secondaryAction && !isContextualAction ? (
        (() => {
          const {
            label: secondaryLabel,
            style: secondaryStyle,
            type: secondaryButtonType,
            ...secondaryButtonProps
          } = secondaryAction;

          return (
            <Button
              {...secondaryButtonProps}
              brand={brand}
              onDark={onDark}
              shape={shape}
              size={buttonSize}
              style={{
                ...secondaryStyle,
                ...buttonLayoutStyle
              }}
              styleVariant="Outline"
              type={secondaryButtonType ?? "button"}
            >
              {secondaryLabel}
            </Button>
          );
        })()
      ) : null}

      {isHorizontal ? (
        <Button
          {...primaryButtonProps}
          brand={brand}
          onDark={onDark}
          shape={shape}
          size={buttonSize}
          style={resolvedPrimaryStyle}
          styleVariant="Solid"
          type={primaryButtonType ?? "button"}
        >
          {primaryLabel}
        </Button>
      ) : null}

      {isContextualAction && contextualAction ? (
        (() => {
          const {
            prompt,
            label,
            tone = "Brand",
            underline = true,
            type: contextualButtonType,
            ...contextualButtonProps
          } = contextualAction;

          return (
            <div style={contextualRowStyles}>
              <span style={promptStyles}>{prompt}</span>
              <LinkButton
                {...contextualButtonProps}
                brand={brand}
                onDark={onDark}
                size="Medium"
                tone={tone}
                type={contextualButtonType ?? "button"}
                underline={underline}
              >
                {label}
              </LinkButton>
            </div>
          );
        })()
      ) : null}
    </div>
  );
}
