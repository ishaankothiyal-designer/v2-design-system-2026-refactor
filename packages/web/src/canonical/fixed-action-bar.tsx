import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { HomeIndicator } from "./home-indicator";
import { Icon } from "./icon";

export const canonicalFixedActionBarWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.fixedActionBar"
);

export interface FixedActionBarActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  primaryAction?: ButtonGroupButtonAction;
  secondaryAction?: ButtonGroupButtonAction | null;
}

export interface FixedActionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  primaryAction?: ButtonGroupButtonAction;
  secondaryAction?: ButtonGroupButtonAction | null;
  showHomeIndicator?: boolean;
}

function toRem(value: number) {
  return pxToRem(value);
}

function buildDefaultPrimaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    styleVariant: "Solid",
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

function buildDefaultSecondaryAction(brand: DisplayBrandId) {
  return {
    label: "Label",
    leadingIcon: <Icon brand={brand} decorative name="sparkle-filled" />,
    styleVariant: "Outline",
    trailingIcon: <Icon brand={brand} decorative name="arrow-right-outline" />
  } satisfies ButtonGroupButtonAction;
}

export function FixedActionBarActions({
  brand = "Cars24",
  primaryAction,
  secondaryAction,
  style,
  ...rest
}: FixedActionBarActionsProps) {
  const resolvedPrimaryAction = primaryAction ?? buildDefaultPrimaryAction(brand);
  const resolvedSecondaryAction = secondaryAction === undefined ? buildDefaultSecondaryAction(brand) : secondaryAction;

  return (
    <ButtonGroup
      {...rest}
      brand={brand}
      onDark={false}
      primaryAction={resolvedPrimaryAction}
      {...(resolvedSecondaryAction ? { secondaryAction: resolvedSecondaryAction } : {})}
      shape="Regular"
      size="Large"
      style={style}
      type="Vertical"
    />
  );
}

/**
 * Fixed mobile action surface from the Widget Library, composed from the approved Button Group primitive.
 */
export function FixedActionBar({
  brand = "Cars24",
  className,
  primaryAction,
  secondaryAction,
  showHomeIndicator = true,
  style,
  ...rest
}: FixedActionBarProps) {
  const surfaceCanvas = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const spacing2 = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const topRadius = Number(getRequiredThemeTokenValue(brand, "radius.lg"));

  const rootStyles: CSSProperties = {
    alignItems: "stretch",
    background: surfaceCanvas,
    borderTopLeftRadius: toRem(topRadius),
    borderTopRightRadius: toRem(topRadius),
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    maxWidth: "100%",
    overflow: "hidden",
    width: toRem(360),
    ...style
  };

  const actionAreaStyles: CSSProperties = {
    background: surfaceCanvas,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: `${toRem(spacing3)} ${toRem(spacing3)} ${toRem(spacing2)}`,
    width: "100%"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={actionAreaStyles}>
        <FixedActionBarActions
          brand={brand}
          {...(primaryAction ? { primaryAction } : {})}
          {...(secondaryAction !== undefined ? { secondaryAction } : {})}
        />
      </div>
      {showHomeIndicator ? <HomeIndicator brand={brand} /> : null}
    </div>
  );
}
