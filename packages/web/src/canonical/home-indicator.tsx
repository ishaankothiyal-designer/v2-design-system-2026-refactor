import type { CSSProperties, HTMLAttributes } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { pxToRem } from "../theme";

export interface HomeIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  handleClassName?: string;
  handleStyle?: CSSProperties;
}

const HOME_INDICATOR_HANDLE_COLOR = "var(--cars24-utility-alpha-black-900, rgba(26, 26, 26, 0.8))";

function toRem(value: number) {
  return pxToRem(value);
}

/**
 * Reusable iOS home indicator chrome for mobile fixed surfaces and Figma review frames.
 */
export function HomeIndicator({
  brand = "Cars24",
  className,
  handleClassName,
  handleStyle,
  style,
  ...rest
}: HomeIndicatorProps) {
  const rootStyles: CSSProperties = {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    padding: `${toRem(21)} 0 ${toRem(8)}`,
    width: "100%",
    ...style
  };

  const handleStyles: CSSProperties = {
    background: HOME_INDICATOR_HANDLE_COLOR,
    borderRadius: toRem(30),
    height: toRem(5),
    opacity: 0.75,
    width: toRem(134),
    ...handleStyle
  };

  return (
    <div {...rest} className={className} data-brand={brand} style={rootStyles}>
      <div aria-hidden="true" className={handleClassName} style={handleStyles} />
    </div>
  );
}
