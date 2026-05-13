import {
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  isValidElement
} from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { designSystemRegistry } from "@turbo/contracts";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";

export const canonicalDividerWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.divider"
);

export type DividerLabelPosition = "None" | "Left" | "Center" | "Right";
export type DividerThickness = "Regular" | "Thin";
export type DividerLineStyle = "Plain" | "Dash";

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  brand?: DisplayBrandId;
  labelPosition?: DividerLabelPosition;
  thickness?: DividerThickness;
  lineStyle?: DividerLineStyle;
  label?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

function toPx(value: number) {
  return tokenValueToRem(value);
}

function renderDecorativeSlot(content: ReactNode, color: string, size: number) {
  if (!content) {
    return null;
  }

  if (typeof content === "string" || typeof content === "number") {
    return (
      <span
        aria-hidden="true"
        style={{
          color,
          display: "inline-flex",
          fontSize: toPx(size),
          lineHeight: 0
        }}
      >
        {content}
      </span>
    );
  }

  if (isValidElement(content)) {
    const element = content as ReactElement<{ style?: CSSProperties }>;

    return cloneElement(element, {
      style: {
        color,
        fontSize: toPx(size),
        ...element.props.style
      }
    });
  }

  return content;
}

function DividerLine({
  color,
  lineStyle,
  thickness,
  width
}: {
  color: string;
  lineStyle: DividerLineStyle;
  thickness: number;
  width?: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        backgroundColor: lineStyle === "Plain" ? color : "transparent",
        borderTopColor: lineStyle === "Dash" ? color : "transparent",
        borderTopStyle: lineStyle === "Dash" ? "dashed" : "solid",
        borderTopWidth: lineStyle === "Dash" ? thickness : 0,
        boxSizing: "border-box",
        display: "block",
        flex: width === undefined ? 1 : "0 0 auto",
        height: lineStyle === "Plain" ? thickness : 0,
        minWidth: width === undefined ? 0 : toPx(width),
        width: width === undefined ? undefined : toPx(width)
      }}
    />
  );
}

export function Divider({
  brand = "Cars24",
  labelPosition = "None",
  thickness = "Regular",
  lineStyle = "Plain",
  label,
  leadingIcon,
  trailingIcon,
  className,
  style,
  ...rest
}: DividerProps) {
  const containerWidth = Number(getRequiredThemeTokenValue(brand, "component.divider.size.width"));
  const shortSegmentLength = Number(
    getRequiredThemeTokenValue(brand, "component.divider.size.shortSegmentLength")
  );
  const contentGap = Number(getRequiredThemeTokenValue(brand, "component.divider.size.contentGap"));
  const contentPaddingInline = Number(
    getRequiredThemeTokenValue(brand, "component.divider.size.contentPaddingInline")
  );
  const contentPaddingBlock = Number(
    getRequiredThemeTokenValue(brand, "component.divider.size.contentPaddingBlock")
  );
  const iconSize = Number(getRequiredThemeTokenValue(brand, "component.divider.size.iconSize"));
  const resolvedThickness = Number(
    getRequiredThemeTokenValue(
      brand,
      thickness === "Thin"
        ? "component.divider.size.thickness.thin"
        : "component.divider.size.thickness.regular"
    )
  );
  const contentRadius = Number(
    getRequiredThemeTokenValue(
      brand,
      thickness === "Thin"
        ? "component.divider.size.contentRadius.thin"
        : "component.divider.size.contentRadius.regular"
    )
  );
  const lineColor = String(getRequiredThemeTokenValue(brand, "component.divider.color.line"));
  const contentColor = String(getRequiredThemeTokenValue(brand, "component.divider.color.content"));
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const fontWeight = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const fontSize = Number(getRequiredThemeTokenValue(brand, "component.divider.typography.label.fontSize"));
  const lineHeight = Number(getRequiredThemeTokenValue(brand, "component.divider.typography.label.lineHeight"));
  const letterSpacing = Number(
    getRequiredThemeTokenValue(brand, "component.divider.typography.label.letterSpacing")
  );
  const hasContent = Boolean(label || leadingIcon || trailingIcon);
  const resolvedLabelPosition = hasContent ? labelPosition : "None";

  if (resolvedLabelPosition === "None") {
    return (
      <div
        {...rest}
        className={className}
        style={{
          maxWidth: "100%",
          width: toPx(containerWidth),
          ...style
        }}
      >
        <DividerLine color={lineColor} lineStyle={lineStyle} thickness={resolvedThickness} />
      </div>
    );
  }

  const leadingWidth = resolvedLabelPosition === "Left" ? shortSegmentLength : undefined;
  const trailingWidth = resolvedLabelPosition === "Right" ? shortSegmentLength : undefined;

  return (
    <div
      {...rest}
      className={className}
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        maxWidth: "100%",
        minWidth: 0,
        width: toPx(containerWidth),
        ...style
      }}
    >
      <DividerLine
        color={lineColor}
        lineStyle={lineStyle}
        thickness={resolvedThickness}
        {...(leadingWidth !== undefined ? { width: leadingWidth } : {})}
      />
      <div
        style={{
          alignItems: "center",
          borderRadius: toPx(contentRadius),
          display: "inline-flex",
          flexShrink: 0,
          gap: toPx(contentGap),
          justifyContent: "center",
          overflow: "hidden",
          padding: `${toPx(contentPaddingBlock)} ${toPx(contentPaddingInline)}`
        }}
      >
        {leadingIcon ? renderDecorativeSlot(leadingIcon, contentColor, iconSize) : null}
        {label ? (
          <span
            style={{
              color: contentColor,
              fontFamily: `${fontFamily}, sans-serif`,
              fontSize: toPx(fontSize),
              fontWeight,
              letterSpacing: toPx(letterSpacing),
              lineHeight: toPx(lineHeight),
              whiteSpace: "nowrap"
            }}
          >
            {label}
          </span>
        ) : null}
        {trailingIcon ? renderDecorativeSlot(trailingIcon, contentColor, iconSize) : null}
      </div>
      <DividerLine
        color={lineColor}
        lineStyle={lineStyle}
        thickness={resolvedThickness}
        {...(trailingWidth !== undefined ? { width: trailingWidth } : {})}
      />
    </div>
  );
}
