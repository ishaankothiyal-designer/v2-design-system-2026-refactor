import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";

export const canonicalModuleWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.module"
);

export interface ModuleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  inverse?: boolean;
  showSectionHeader?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showHeaderAction?: boolean;
  headerActionLabel?: string;
  onHeaderActionClick?: () => void;
  titleIcon?: ReactNode;
  subtitleIcon?: ReactNode;
  children?: ReactNode;
  bodyMinHeight?: number | string;
  showButtonGroup?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
  secondaryAction?: ButtonGroupButtonAction;
  footer?: ReactNode;
}

function toCssSize(value: number | string) {
  return typeof value === "number" ? pxToRem(value) : value;
}

/**
 * Composed content module that packages a section header, a flexible body slot, and footer actions.
 */
export function Module({
  brand = "Cars24",
  inverse = false,
  showSectionHeader = true,
  title = "Section title",
  subtitle = "Section title line 2",
  description = "Description goes here upto 2 lines",
  tagLabel = "New",
  showTag = true,
  showHeaderAction = true,
  headerActionLabel = "View all",
  onHeaderActionClick,
  titleIcon,
  subtitleIcon,
  children,
  bodyMinHeight = 100,
  showButtonGroup = true,
  primaryAction,
  secondaryAction,
  footer,
  className,
  style,
  ...rest
}: ModuleProps) {
  const spacing4 = Number(getRequiredThemeTokenValue(brand, "spacing.4"));
  const surfaceBackground = String(
    getRequiredThemeTokenValue(brand, inverse ? "color.surface.inverse" : "color.surface.canvas")
  );

  const rootStyles: CSSProperties = {
    background: surfaceBackground,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing4),
    overflow: "hidden",
    padding: pxToRem(spacing4),
    width: "100%",
    ...style
  };

  const bodyStyles: CSSProperties = {
    minHeight: toCssSize(bodyMinHeight),
    width: "100%"
  };

  const defaultPrimaryAction: ButtonGroupButtonAction = {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  };

  const resolvedPrimaryAction =
    primaryAction === undefined ? defaultPrimaryAction : primaryAction;
  const hasCustomFooter = footer !== undefined;
  const shouldRenderActionGroup = showButtonGroup && !hasCustomFooter && resolvedPrimaryAction;

  return (
    <div {...rest} className={className} style={rootStyles}>
      {showSectionHeader ? (
        <SectionHeader
          actionLabel={headerActionLabel}
          brand={brand}
          description={description}
          inverse={inverse}
          showAction={showHeaderAction}
          showDescription={Boolean(description)}
          showTag={showTag}
          showSubtitle={Boolean(subtitle)}
          subtitle={subtitle}
          subtitleIcon={subtitleIcon}
          tagLabel={tagLabel}
          title={title}
          titleIcon={titleIcon}
          {...(onHeaderActionClick ? { onActionClick: onHeaderActionClick } : {})}
        />
      ) : null}

      <div style={bodyStyles}>{children ?? null}</div>

      {showButtonGroup && hasCustomFooter ? (
        <div style={{ width: "100%" }}>{footer}</div>
      ) : shouldRenderActionGroup ? (
        <ButtonGroup
          brand={brand}
          onDark={inverse}
          primaryAction={resolvedPrimaryAction}
          shape="Regular"
          size="Medium"
          type="Vertical"
          {...(secondaryAction ? { secondaryAction } : {})}
        />
      ) : null}
    </div>
  );
}
