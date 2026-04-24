import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { GridCard } from "./grid-card";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";

export const canonicalGridWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.gridWidget"
);

export interface GridWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  inverse?: boolean;
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
  primaryAction?: ButtonGroupButtonAction | null;
}

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies ButtonGroupButtonAction;
}

function DefaultGridCards({ brand = "Cars24" }: { brand?: DisplayBrandId }) {
  return (
    <>
      <GridCard
        brand={brand}
        columnCount="2 Column"
        description="Description"
        size="Medium"
        tagLabel="New"
        title="Title"
        type="Text Inside"
      />
      <GridCard
        brand={brand}
        columnCount="2 Column"
        description="Description"
        size="Medium"
        tagLabel="New"
        title="Title"
        type="Text Inside"
      />
    </>
  );
}

/**
 * Widget-level discovery surface that combines the approved section header, a two-card grid row, and a single primary CTA.
 */
export function GridWidget({
  brand = "Cars24",
  inverse = false,
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
  primaryAction,
  className,
  style,
  ...rest
}: GridWidgetProps) {
  const spacing3 = Number(getRequiredThemeTokenValue(brand, "spacing.3"));
  const surfaceBackground = String(
    getRequiredThemeTokenValue(brand, inverse ? "color.surface.inverse" : "color.surface.canvas")
  );
  const innerPaddingBlock = inverse ? pxToRem(spacing3) : "var(--cars24-misc-gap-2, 2px)";
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;

  const rootStyles: CSSProperties = {
    background: surfaceBackground,
    boxSizing: "border-box",
    padding: `${pxToRem(spacing3)} 0`,
    width: "100%",
    ...style
  };

  const contentStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(spacing3),
    padding: `${innerPaddingBlock} ${pxToRem(spacing3)}`,
    width: "100%"
  };

  const gridRowStyles: CSSProperties = {
    alignItems: "stretch",
    display: "flex",
    gap: pxToRem(spacing3),
    width: "100%"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={contentStyles}>
        <SectionHeader
          actionLabel={headerActionLabel}
          brand={brand}
          description={description}
          inverse={inverse}
          showAction={showHeaderAction}
          showDescription={Boolean(description)}
          showSubtitle={Boolean(subtitle)}
          showTag={showTag}
          subtitle={subtitle}
          subtitleIcon={subtitleIcon}
          tagLabel={tagLabel}
          title={title}
          titleIcon={titleIcon}
          {...(onHeaderActionClick ? { onActionClick: onHeaderActionClick } : {})}
        />

        <div style={gridRowStyles}>{children ?? <DefaultGridCards brand={brand} />}</div>

        {resolvedPrimaryAction ? (
          <ButtonGroup
            brand={brand}
            onDark={false}
            primaryAction={resolvedPrimaryAction}
            shape="Regular"
            size="Medium"
            type="Vertical"
          />
        ) : null}
      </div>
    </div>
  );
}
