import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Icon } from "./icon";

export const canonicalPaginationWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.pagination"
);

export type PaginationType = "1" | "2";
export type PaginationPlatform = "Mobile" | "Desktop";
export type PaginationMove = "only right" | "only left" | "both ways";
export type PaginationPageItem = number | "ellipsis";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  brand?: DisplayBrandId;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageItems?: PaginationPageItem[];
  platform?: PaginationPlatform;
  previousLabel?: string;
  summaryLabel?: string;
  nextLabel?: string;
  type?: PaginationType;
}

type PaginationMetrics = {
  borderColor: string;
  borderWidth: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  gap: string;
  iconColor: string;
  iconColorDisabled: string;
  iconSize: string;
  inverseTextColor: string;
  itemRadius: string;
  itemSize: string;
  letterSpacing: string;
  lineHeight: string;
  pageActiveBackground: string;
  pageBackground: string;
  pillRadius: string;
  textColor: string;
};

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(Math.trunc(page), 1), totalPages);
}

function range(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

function getMove(currentPage: number, totalPages: number): PaginationMove {
  if (currentPage <= 1) {
    return "only right";
  }

  if (currentPage >= totalPages) {
    return "only left";
  }

  return "both ways";
}

function getDefaultPageItems(
  currentPage: number,
  totalPages: number,
  platform: PaginationPlatform
): PaginationPageItem[] {
  const edgeCount = platform === "Desktop" ? 3 : 2;
  const maxVisible = platform === "Desktop" ? 7 : 5;

  if (totalPages <= maxVisible) {
    return range(1, totalPages);
  }

  if (currentPage <= edgeCount) {
    return [...range(1, edgeCount), "ellipsis", ...range(totalPages - (edgeCount - 1), totalPages)];
  }

  if (currentPage >= totalPages - (edgeCount - 1)) {
    return [...range(1, edgeCount), "ellipsis", ...range(totalPages - (edgeCount - 1), totalPages)];
  }

  if (platform === "Desktop") {
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

function getMetrics(brand: DisplayBrandId, platform: PaginationPlatform): PaginationMetrics {
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = String(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"));
  const typographySizeKey = platform === "Desktop" ? "md" : "sm";
  const itemSizeKey = platform === "Desktop" ? "md" : "sm";
  const fontSize = pxToRem(
    Number(getRequiredThemeTokenValue(brand, `component.linkButton.typography.${typographySizeKey}.fontSize`))
  );
  const lineHeight = pxToRem(
    Number(getRequiredThemeTokenValue(brand, `component.linkButton.typography.${typographySizeKey}.lineHeight`))
  );
  const letterSpacing = pxToRem(
    Number(getRequiredThemeTokenValue(brand, `component.linkButton.typography.${typographySizeKey}.letterSpacing`))
  );
  const itemSize = pxToRem(Number(getRequiredThemeTokenValue(brand, `component.iconButton.size.${itemSizeKey}.boxSize`)));
  const borderWidth = pxToRem(Number(getRequiredThemeTokenValue(brand, "component.iconButton.border.width")));
  const pageBackground = String(
    getRequiredThemeTokenValue(brand, "component.iconButton.color.light.outline.black.rest.background")
  );
  const borderColor = String(
    getRequiredThemeTokenValue(brand, "component.iconButton.color.light.outline.black.rest.border")
  );
  const textColor = String(
    getRequiredThemeTokenValue(brand, "component.iconButton.color.light.outline.black.rest.foreground")
  );
  const iconColorDisabled = String(getRequiredThemeTokenValue(brand, "component.iconButton.color.light.disabled.foreground"));
  const iconSize = pxToRem(Number(getRequiredThemeTokenValue(brand, "component.phoneInput.icon.countryChevronSize")));
  const activeBackground = String(getRequiredThemeTokenValue(brand, "color.brand.alt.500"));
  const inverseTextColor = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const pillRadius = pxToRem(Number(getRequiredThemeTokenValue(brand, "radius.pill")));

  return {
    borderColor,
    borderWidth,
    fontFamily,
    fontSize,
    fontWeight,
    gap: pxToRem(6),
    iconColor: textColor,
    iconColorDisabled,
    iconSize,
    inverseTextColor,
    itemRadius: pillRadius,
    itemSize,
    letterSpacing,
    lineHeight,
    pageActiveBackground: activeBackground,
    pageBackground,
    pillRadius,
    textColor
  };
}

function getLabelStyles(metrics: PaginationMetrics, color: string): CSSProperties {
  return {
    color,
    fontFamily: `${metrics.fontFamily}, sans-serif`,
    fontSize: metrics.fontSize,
    fontWeight: metrics.fontWeight,
    letterSpacing: metrics.letterSpacing,
    lineHeight: metrics.lineHeight,
    margin: 0,
    textAlign: "center",
    whiteSpace: "nowrap"
  };
}

function getPageItemStyles(metrics: PaginationMetrics, active: boolean): CSSProperties {
  return {
    alignItems: "center",
    appearance: "none",
    background: active ? metrics.pageActiveBackground : metrics.pageBackground,
    border: active ? "none" : `${metrics.borderWidth} solid ${metrics.borderColor}`,
    borderRadius: metrics.itemRadius,
    color: active ? metrics.inverseTextColor : metrics.textColor,
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: metrics.itemSize,
    justifyContent: "center",
    minWidth: metrics.itemSize,
    padding: 0,
    width: metrics.itemSize
  };
}

function PaginationChevronButton({
  ariaLabel,
  direction,
  disabled,
  metrics,
  onClick,
  shape = "standalone"
}: {
  ariaLabel: string;
  direction: "left" | "right";
  disabled: boolean;
  metrics: PaginationMetrics;
  onClick?: () => void;
  shape?: "embedded" | "standalone";
}) {
  const iconColor = disabled ? metrics.iconColorDisabled : metrics.iconColor;
  const isStandalone = shape === "standalone";

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      type="button"
      style={{
        alignItems: "center",
        appearance: "none",
        background: isStandalone ? metrics.pageBackground : "transparent",
        border: isStandalone ? `${metrics.borderWidth} solid ${metrics.borderColor}` : "none",
        borderRadius: isStandalone ? metrics.itemRadius : "0",
        color: iconColor,
        cursor: disabled ? "default" : "pointer",
        display: "inline-flex",
        flexShrink: 0,
        height: metrics.itemSize,
        justifyContent: "center",
        minWidth: metrics.itemSize,
        padding: 0,
        width: metrics.itemSize
      }}
    >
      <Icon
        decorative
        name={direction === "left" ? "chevron-large-left-outline" : "chevron-right-outline"}
        size="sm"
        style={{
          color: iconColor,
          fontSize: metrics.iconSize
        }}
      />
    </button>
  );
}

/**
 * Token-driven pagination with compact summary and page-list variants matching the canonical Figma component.
 */
export function Pagination({
  brand = "Cars24",
  currentPage = 1,
  nextLabel = "Go to next page",
  onPageChange,
  pageItems,
  platform = "Mobile",
  previousLabel = "Go to previous page",
  style,
  summaryLabel,
  totalPages,
  type = "1",
  ...rest
}: PaginationProps) {
  const resolvedTotalPages = Math.max(1, Math.trunc(totalPages ?? (type === "1" ? 4 : 32)));
  const resolvedCurrentPage = clampPage(currentPage, resolvedTotalPages);
  const resolvedMove = getMove(resolvedCurrentPage, resolvedTotalPages);
  const resolvedItems = pageItems ?? getDefaultPageItems(resolvedCurrentPage, resolvedTotalPages, platform);
  const metrics = getMetrics(brand, platform);
  const summary = summaryLabel ?? `${resolvedCurrentPage} of ${resolvedTotalPages}`;
  const previousDisabled = resolvedMove === "only right";
  const nextDisabled = resolvedMove === "only left";

  function handlePrevious() {
    if (previousDisabled) {
      return;
    }

    onPageChange?.(resolvedCurrentPage - 1);
  }

  function handleNext() {
    if (nextDisabled) {
      return;
    }

    onPageChange?.(resolvedCurrentPage + 1);
  }

  function handlePageSelection(page: number) {
    if (page === resolvedCurrentPage) {
      return;
    }

    onPageChange?.(page);
  }

  if (type === "1") {
    return (
      <nav
        aria-label="Pagination"
        {...rest}
        style={{
          alignItems: "center",
          background: metrics.pageBackground,
          border: `${metrics.borderWidth} solid ${metrics.borderColor}`,
          borderRadius: metrics.pillRadius,
          display: "inline-flex",
          height: metrics.itemSize,
          justifyContent: "center",
          overflow: "hidden",
          ...style
        }}
      >
        <PaginationChevronButton
          ariaLabel={previousLabel}
          direction="left"
          disabled={previousDisabled}
          metrics={metrics}
          onClick={handlePrevious}
          shape="embedded"
        />
        <span aria-live="polite" style={getLabelStyles(metrics, metrics.textColor)}>
          {summary}
        </span>
        <PaginationChevronButton
          ariaLabel={nextLabel}
          direction="right"
          disabled={nextDisabled}
          metrics={metrics}
          onClick={handleNext}
          shape="embedded"
        />
      </nav>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      {...rest}
      style={{
        alignItems: "center",
        display: "inline-flex",
        gap: metrics.gap,
        ...style
      }}
    >
      <PaginationChevronButton
        ariaLabel={previousLabel}
        direction="left"
        disabled={previousDisabled}
        metrics={metrics}
        onClick={handlePrevious}
      />

      {resolvedItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              style={{
                ...getPageItemStyles(metrics, false),
                cursor: "default"
              }}
            >
              <span style={getLabelStyles(metrics, metrics.textColor)}>...</span>
            </span>
          );
        }

        const active = item === resolvedCurrentPage;

        return (
          <button
            key={`page-${item}`}
            aria-current={active ? "page" : undefined}
            aria-label={active ? `Current page, page ${item}` : `Go to page ${item}`}
            onClick={() => handlePageSelection(item)}
            type="button"
            style={getPageItemStyles(metrics, active)}
          >
            <span style={getLabelStyles(metrics, active ? metrics.inverseTextColor : metrics.textColor)}>
              {item}
            </span>
          </button>
        );
      })}

      <PaginationChevronButton
        ariaLabel={nextLabel}
        direction="right"
        disabled={nextDisabled}
        metrics={metrics}
        onClick={handleNext}
      />
    </nav>
  );
}
