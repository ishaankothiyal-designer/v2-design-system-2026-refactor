import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { pxToRem } from "../theme";
import { BentoRow, type BentoRowProps } from "./bento-row";
import { ButtonGroup, type ButtonGroupButtonAction } from "./button-group";
import { Icon } from "./icon";
import { SectionHeader } from "./section-header";

export const canonicalGridBentoWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.gridBento"
);

export interface GridBentoRowConfig
  extends Pick<BentoRowProps, "columns" | "items" | "showTags" | "size" | "tagLabel"> {}

export interface GridBentoProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  brand?: DisplayBrandId;
  inverse?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  tagLabel?: string;
  showTag?: boolean;
  showHeader?: boolean;
  showHeaderAction?: boolean;
  headerActionLabel?: string;
  onHeaderActionClick?: () => void;
  titleIcon?: ReactNode;
  subtitleIcon?: ReactNode;
  rows?: GridBentoRowConfig[];
  showButtonGroup?: boolean;
  primaryAction?: ButtonGroupButtonAction | null;
}

const WIDGET_WIDTH = 360;
const CONTENT_WIDTH = 336;
const WIDGET_GAP = 12;
const WIDGET_PADDING = 12;

const DEFAULT_ROWS: GridBentoRowConfig[] = [
  { columns: 2, showTags: true, size: "Landscape" },
  { columns: 2, showTags: true, size: "Landscape" },
  { columns: 3, showTags: true, size: "Portrait" }
];

function buildDefaultPrimaryAction() {
  return {
    label: "Label",
    leadingIcon: <Icon name="sparkle-filled" decorative />,
    trailingIcon: <Icon name="arrow-right-outline" decorative />
  } satisfies ButtonGroupButtonAction;
}

function resolveRows(rows: GridBentoRowConfig[] | undefined) {
  return rows && rows.length > 0 ? rows : DEFAULT_ROWS;
}

/**
 * Figma Bento Grid widget composed from SectionHeader, BentoRow, and ButtonGroup.
 */
export function GridBento({
  brand = "Cars24",
  className,
  description = "Description goes here upto 2 lines",
  headerActionLabel = "View all",
  inverse = false,
  onHeaderActionClick,
  primaryAction,
  rows,
  showButtonGroup = true,
  showHeader = true,
  showHeaderAction = true,
  showTag = true,
  style,
  subtitle = "Section title line 2",
  subtitleIcon,
  tagLabel = "New",
  title = "Section title",
  titleIcon,
  ...rest
}: GridBentoProps) {
  const resolvedRows = resolveRows(rows);
  const resolvedPrimaryAction = primaryAction === undefined ? buildDefaultPrimaryAction() : primaryAction;

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: inverse
      ? "var(--cars24-semantic-bg-primary-inverse, #0A0A0A)"
      : "var(--cars24-semantic-bg-primary, #FFFFFF)",
    boxSizing: "border-box",
    display: "flex",
    overflow: "hidden",
    padding: pxToRem(WIDGET_PADDING),
    width: pxToRem(WIDGET_WIDTH),
    ...style
  };

  const contentStyles: CSSProperties = {
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(WIDGET_GAP),
    width: pxToRem(CONTENT_WIDTH)
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={contentStyles}>
        {showHeader ? (
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
        ) : null}

        {resolvedRows.map((row, index) => {
          const columns = row.columns ?? 3;
          const rowSize = row.size ?? "Landscape";

          return (
            <BentoRow
              key={`${columns}-${rowSize}-${index}`}
              brand={brand}
              columns={columns}
              showTags={row.showTags ?? true}
              size={rowSize}
              tagLabel={row.tagLabel ?? tagLabel}
              {...(row.items ? { items: row.items } : {})}
            />
          );
        })}

        {showButtonGroup && resolvedPrimaryAction ? (
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
