import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { ChoiceChip, type ChoiceChipProps } from "./choice-chip";

export const canonicalChipBarWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.chipBar"
);

export interface ChipBarItem
  extends Pick<
    ChoiceChipProps,
    | "disabled"
    | "label"
    | "leadingIcon"
    | "leadingIconName"
    | "state"
    | "trailingIcon"
    | "trailingIconName"
  > {
  key?: string;
}

export interface ChipBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  filterChip?: ChipBarItem;
  firstRowItems?: ChipBarItem[];
  secondRowItems?: ChipBarItem[];
  showFilterChip?: boolean;
  showRow2?: boolean;
}

const DEFAULT_FILTER_CHIP: ChipBarItem = {
  label: "Filters",
  leadingIcon: true,
  leadingIconName: "filter-outline",
  trailingIcon: true,
  trailingIconName: "chevron-down-small-filled"
};

function buildDefaultItems(count: number): ChipBarItem[] {
  return Array.from({ length: count }, () => ({
    label: "Chip label",
    leadingIcon: false,
    trailingIcon: false
  }));
}

const DEFAULT_FIRST_ROW_ITEMS = buildDefaultItems(5);
const DEFAULT_SECOND_ROW_ITEMS = buildDefaultItems(6);

function renderRow({
  brand,
  items,
  keyPrefix
}: {
  brand: DisplayBrandId;
  items: ChipBarItem[];
  keyPrefix: string;
}) {
  return items.map((item, index) => (
    <ChoiceChip
      key={item.key ?? `${keyPrefix}-${index}`}
      brand={brand}
      label={item.label}
      size="Small"
      type="Regular"
      variant="Horizontal"
      {...(item.disabled !== undefined ? { disabled: item.disabled } : {})}
      {...(item.leadingIcon !== undefined ? { leadingIcon: item.leadingIcon } : {})}
      {...(item.leadingIconName !== undefined ? { leadingIconName: item.leadingIconName } : {})}
      {...(item.state !== undefined ? { state: item.state } : {})}
      {...(item.trailingIcon !== undefined ? { trailingIcon: item.trailingIcon } : {})}
      {...(item.trailingIconName !== undefined ? { trailingIconName: item.trailingIconName } : {})}
    />
  ));
}

/**
 * Two-row clipped chip composition that reuses the approved small horizontal Choice Chip instances from Figma.
 */
export function ChipBar({
  brand = "Cars24",
  className,
  filterChip,
  firstRowItems = DEFAULT_FIRST_ROW_ITEMS,
  secondRowItems = DEFAULT_SECOND_ROW_ITEMS,
  showFilterChip = true,
  showRow2 = true,
  style,
  ...rest
}: ChipBarProps) {
  const spacing3 = pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.3")));
  const resolvedFilterChip = { ...DEFAULT_FILTER_CHIP, ...(filterChip ?? {}) };

  const rootStyles: CSSProperties = {
    alignItems: "flex-start",
    boxSizing: "border-box",
    display: "grid",
    gap: spacing3,
    overflow: "hidden",
    padding: spacing3,
    width: pxToRem(360),
    ...style
  };

  const rowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: spacing3,
    width: "max-content"
  };

  const scrollViewportStyles: CSSProperties = {
    boxSizing: "border-box",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
    width: "100%"
  };

  const scrollContentStyles: CSSProperties = {
    display: "grid",
    gap: spacing3,
    width: "max-content"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={scrollViewportStyles}>
        <div style={scrollContentStyles}>
          <div style={rowStyles}>
            {showFilterChip
              ? renderRow({ brand, items: [resolvedFilterChip, ...firstRowItems], keyPrefix: "row-1" })
              : renderRow({ brand, items: firstRowItems, keyPrefix: "row-1" })}
          </div>

          {showRow2 ? (
            <div style={rowStyles}>
              {renderRow({ brand, items: secondRowItems, keyPrefix: "row-2" })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
