import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";
import { IconButton, type IconButtonProps } from "./icon-button";

export const canonicalInlineButtonGroupWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.inlineButtonGroup"
);

export type InlineButtonGroupCount = 3 | 4 | 5;

export interface InlineButtonGroupItemAction
  extends Omit<
    IconButtonProps,
    "brand" | "children" | "icon" | "onDark" | "shape" | "size" | "styleVariant"
  > {
  id?: string;
  label: ReactNode;
  icon?: ReactNode;
  iconName?: IconName;
  ariaLabel?: string;
}

export interface InlineButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  items?: InlineButtonGroupItemAction[];
  numberOfButtons?: InlineButtonGroupCount;
}

const DEFAULT_BUTTON_COUNT: InlineButtonGroupCount = 3;
const DEFAULT_ICON_NAME = "plus-large-filled" satisfies IconName;
const DEFAULT_ITEM_LABEL = "Label";

function clampButtonCount(count: number): InlineButtonGroupCount {
  if (count >= 5) {
    return 5;
  }

  if (count === 4) {
    return 4;
  }

  return 3;
}

function buildDefaultItems(numberOfButtons: InlineButtonGroupCount): InlineButtonGroupItemAction[] {
  return Array.from({ length: numberOfButtons }, (_, index) => ({
    id: `inline-button-${index + 1}`,
    label: DEFAULT_ITEM_LABEL,
    iconName: DEFAULT_ICON_NAME
  }));
}

function getWidgetTokens(brand: DisplayBrandId) {
  return {
    rootPaddingInline: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
    rootPaddingBlock: Number(getRequiredThemeTokenValue(brand, "spacing.2")),
    surfacePadding: Number(getRequiredThemeTokenValue(brand, "spacing.3")),
    itemPaddingInline: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    itemGap: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    surfaceRadius: Number(getRequiredThemeTokenValue(brand, "radius.xl")),
    surfaceBackground: String(getRequiredThemeTokenValue(brand, "color.surface.canvas")),
    iconButtonBackground: String(getRequiredThemeTokenValue(brand, "color.brand.primary.50")),
    iconButtonColor: String(getRequiredThemeTokenValue(brand, "color.brand.primary.500")),
    labelColor: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.label.default")),
    labelFontFamily: String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans")),
    labelFontWeight: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium")),
    labelFontSize: Number(getRequiredThemeTokenValue(brand, "component.label.sm.typography.label.fontSize")),
    labelLineHeight: Number(getRequiredThemeTokenValue(brand, "component.label.sm.typography.label.lineHeight")),
    labelLetterSpacing: Number(getRequiredThemeTokenValue(brand, "component.label.sm.typography.label.letterSpacing"))
  };
}

function InlineButtonGroupItem({
  action,
  brand,
  index,
  tokens
}: {
  action: InlineButtonGroupItemAction;
  brand: DisplayBrandId;
  index: number;
  tokens: ReturnType<typeof getWidgetTokens>;
}) {
  const generatedId = useId();
  const labelId = action.id ? `${action.id}-label` : `${generatedId}-label`;
  const {
    ariaLabel,
    icon,
    iconName = DEFAULT_ICON_NAME,
    label,
    style,
    id: _id,
    ...buttonProps
  } = action;
  const isDisabled = Boolean(buttonProps.disabled);

  const itemStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 0",
    flexDirection: "column",
    gap: pxToRem(tokens.itemGap),
    minWidth: 0,
    paddingInline: pxToRem(tokens.itemPaddingInline)
  };

  const labelStyles: CSSProperties = {
    color: tokens.labelColor,
    display: "block",
    fontFamily: `${tokens.labelFontFamily}, sans-serif`,
    fontSize: pxToRem(tokens.labelFontSize),
    fontWeight: tokens.labelFontWeight,
    letterSpacing: pxToRem(tokens.labelLetterSpacing),
    lineHeight: pxToRem(tokens.labelLineHeight),
    margin: 0,
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    textAlign: "center",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  return (
    <div data-inline-button-group-item={index + 1} style={itemStyles}>
      <IconButton
        {...buttonProps}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelId}
        brand={brand}
        icon={icon ?? <Icon brand={brand} decorative name={iconName} />}
        onDark={false}
        shape="Regular"
        size="Small"
        style={{
          ...(isDisabled
            ? {}
            : {
                background: tokens.iconButtonBackground,
                color: tokens.iconButtonColor
              }),
          ...style
        }}
        styleVariant="Subtle - Primary"
      />
      <span id={labelId} style={labelStyles}>
        {label}
      </span>
    </div>
  );
}

/**
 * Figma-matched inline shortcut widget with 3, 4, or 5 equal-width icon button actions.
 */
export function InlineButtonGroup({
  brand = "Cars24",
  items,
  numberOfButtons = DEFAULT_BUTTON_COUNT,
  style,
  ...rest
}: InlineButtonGroupProps) {
  const resolvedItems = items?.length ? items.slice(0, 5) : buildDefaultItems(numberOfButtons);
  const visibleItems = resolvedItems.slice(0, clampButtonCount(resolvedItems.length));
  const tokens = getWidgetTokens(brand);

  const rootStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    padding: `${pxToRem(tokens.rootPaddingBlock)} ${pxToRem(tokens.rootPaddingInline)}`,
    width: "100%",
    ...style
  };

  const surfaceStyles: CSSProperties = {
    alignItems: "flex-start",
    background: tokens.surfaceBackground,
    borderRadius: pxToRem(tokens.surfaceRadius),
    boxSizing: "border-box",
    display: "flex",
    flex: "1 1 0",
    gap: 0,
    justifyContent: "center",
    minWidth: 0,
    padding: pxToRem(tokens.surfacePadding)
  };

  return (
    <div {...rest} style={rootStyles}>
      <div style={surfaceStyles}>
        {visibleItems.map((action, index) => (
          <InlineButtonGroupItem
            key={action.id ?? index}
            action={action}
            brand={brand}
            index={index}
            tokens={tokens}
          />
        ))}
      </div>
    </div>
  );
}
