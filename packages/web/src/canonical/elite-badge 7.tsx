import type { CSSProperties, HTMLAttributes } from "react";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export type EliteBadgeBrand = "Cars24";
export type EliteBadgeName = "Elite" | "All cars";

export interface EliteBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  brand?: EliteBadgeBrand;
  badgeName?: EliteBadgeName;
}

function toPx(value: number | string) {
  return typeof value === "number" ? `${value}px` : /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
}

function EliteWordmark({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 49.212 10" width="49.212" height="10">
      <g fill={color}>
        <path d="M2.96655 10C1.33094 10 5.08626e-05 8.65065 5.08626e-05 6.99235V3.00825C5.08626e-05 1.34995 1.33094 0 2.96655 0H9.47895C9.87798 0 10.2022 0.32927 10.2022 0.733238C10.2022 1.13721 9.87798 1.46648 9.47895 1.46648H2.96655C2.12841 1.46648 1.44647 2.15788 1.44647 3.00765V6.99175C1.44647 7.84152 2.12841 8.53293 2.96655 8.53293H9.45301C9.85204 8.53293 10.1762 8.8622 10.1762 9.26616C10.1762 9.67013 9.85145 9.9994 9.45301 9.9994H2.96655V10ZM3.14986 5.73324C2.75083 5.73324 2.42665 5.40397 2.42665 5C2.42665 4.59603 2.75142 4.26676 3.14986 4.26676H6.76825C7.16728 4.26676 7.49146 4.59603 7.49146 5C7.49146 5.40397 7.16728 5.73324 6.76825 5.73324H3.14986Z" />
        <path d="M14.7292 10C13.0936 10 11.7627 8.65065 11.7627 6.99235V0.733238C11.7627 0.328672 12.0869 0 12.486 0C12.885 0 13.2092 0.32927 13.2092 0.733238V6.99235C13.2092 7.84212 13.8911 8.53352 14.7292 8.53352H21.2411C21.6401 8.53352 21.9643 8.86279 21.9643 9.26676C21.9643 9.67073 21.6395 10 21.2411 10H14.7292Z" />
        <path d="M24.1949 10C23.7959 10 23.4717 9.67073 23.4717 9.26676V0.733238C23.4717 0.328672 23.7965 0 24.1949 0C24.5934 0 24.9181 0.32927 24.9181 0.733238V9.26676C24.9181 9.67133 24.594 10 24.1949 10Z" />
        <path d="M32.2678 10C31.8688 10 31.5446 9.67073 31.5446 9.26676V2.99928C31.5446 2.59472 31.8693 2.26605 32.2678 2.26605C32.6662 2.26605 32.991 2.59531 32.991 2.99928V9.26676C32.991 9.67133 32.6668 10 32.2678 10ZM27.1523 1.46648C26.7533 1.46648 26.4291 1.13721 26.4291 0.733238C26.4291 0.32927 26.7539 0 27.1523 0H37.3845C37.7835 0 38.1077 0.32927 38.1077 0.733238C38.1077 1.13721 37.7829 1.46648 37.3845 1.46648H27.1523Z" />
        <path d="M41.977 10C40.3414 10 39.0105 8.65065 39.0105 6.99235V3.00825C39.0105 1.34995 40.3414 0 41.977 0H48.4888C48.8878 0 49.212 0.32927 49.212 0.733238C49.212 1.13721 48.8872 1.46648 48.4888 1.46648H41.977C41.1388 1.46648 40.4575 2.15788 40.4575 3.00765V6.99175C40.4575 7.84152 41.1394 8.53293 41.977 8.53293H48.4634C48.8625 8.53293 49.1866 8.8622 49.1866 9.26616C49.1866 9.67013 48.8619 9.9994 48.4634 9.9994H41.977V10ZM42.1597 5.73324C41.7607 5.73324 41.4365 5.40397 41.4365 5C41.4365 4.59603 41.7612 4.26676 42.1597 4.26676H45.7781C46.1771 4.26676 46.5013 4.59603 46.5013 5C46.5013 5.40397 46.1765 5.73324 45.7781 5.73324H42.1597Z" />
      </g>
    </svg>
  );
}

/**
 * Compact premium badge for Elite surfaces, matching the Figma `Entry Point Badge` variants.
 */
export function EliteBadge({
  brand = "Cars24",
  badgeName = "Elite",
  className,
  style,
  ...rest
}: EliteBadgeProps) {
  const foreground = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const borderRadius = toPx(getRequiredThemeTokenValue(brand, "radius.pill"));
  const height = toPx(getRequiredThemeTokenValue(brand, "component.iconButton.size.xxs.boxSize"));
  const gap = toPx(getRequiredThemeTokenValue(brand, "spacing.1"));
  const paddingInlineStart = toPx(getRequiredThemeTokenValue(brand, "spacing.2"));
  const paddingInlineEnd = toPx(getRequiredThemeTokenValue(brand, "spacing.1"));
  const allCarsFontSize = "13px";
  const allCarsLineHeight = toPx(getRequiredThemeTokenValue(brand, "typography.lineHeight.xs"));
  const allCarsFontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const isElite = badgeName === "Elite";
  const background = isElite
    ? String(getRequiredThemeTokenValue(brand, "color.surface.inverse"))
    : String(getRequiredThemeTokenValue(brand, "component.iconButton.color.dark.disabled.background"));
  const borderColor = isElite ? foreground : String(getRequiredThemeTokenValue(brand, "color.text.disabledInverse"));
  const borderWidth = isElite ? "1px" : toPx(getRequiredThemeTokenValue(brand, "component.divider.size.thickness.thin"));
  const chevronSize = isElite
    ? toPx(getRequiredThemeTokenValue(brand, "icon.size.sm"))
    : toPx(getRequiredThemeTokenValue(brand, "component.iconButton.size.xxs.iconSize"));

  return (
    <span
      {...rest}
      className={className}
      style={
        {
          alignItems: "center",
          background,
          border: `${borderWidth} solid ${borderColor}`,
          borderRadius,
          boxSizing: "border-box",
          display: "inline-flex",
          flexShrink: 0,
          gap,
          height,
          justifyContent: "center",
          paddingInlineEnd,
          paddingInlineStart,
          ...style
        } satisfies CSSProperties
      }
    >
      {isElite ? (
        <span style={{ alignItems: "center", display: "inline-flex", flexShrink: 0, lineHeight: 0 }}>
          <EliteWordmark color={foreground} />
        </span>
      ) : (
        <span
          style={{
            color: foreground,
            fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
            fontSize: allCarsFontSize,
            fontWeight: allCarsFontWeight,
            letterSpacing: 0,
            lineHeight: allCarsLineHeight,
            textWrap: "nowrap"
          }}
        >
          {badgeName}
        </span>
      )}

      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          display: "inline-flex",
          flexShrink: 0,
          justifyContent: "center",
          width: chevronSize,
          height: chevronSize
        }}
      >
        <Icon
          brand={brand}
          decorative
          name="chevron-small-right-outline"
          size="sm"
          style={{ color: foreground, fontSize: chevronSize }}
        />
      </span>
    </span>
  );
}
