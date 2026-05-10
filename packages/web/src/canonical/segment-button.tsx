import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState
} from "react";
import type { IconName } from "@turbo/icons";
import { designSystemRegistry } from "@turbo/contracts";
import type { DisplayBrandId } from "@turbo/tokens";
import { getRequiredThemeTokenValue, tokenValueToRem } from "../theme";
import { getTapFeedbackStyles } from "./press-feedback";
import { Icon } from "./icon";

export const canonicalSegmentButtonWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.segmentButton"
);

export type SegmentButtonType = "Text" | "Icon";
export type SegmentButtonSize = "Default" | "Large";
export type SegmentButtonSelectionColor = "White" | "Black" | "Brand";
export type SegmentButtonPreviewState = "Default" | "Hover/Pressed";

export interface SegmentButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  brand?: DisplayBrandId;
  icon?: ReactNode | undefined;
  iconName?: IconName | undefined;
  label?: ReactNode | undefined;
  forceState?: SegmentButtonPreviewState | undefined;
  selected?: boolean | undefined;
  selectionColor?: SegmentButtonSelectionColor | undefined;
  size?: SegmentButtonSize | undefined;
  type?: SegmentButtonType | undefined;
}

type SegmentButtonMetrics = {
  gap: string;
  iconSize: "sm" | "md";
  minHeight?: string;
  padding: string;
  paddingInline?: string;
};

type SegmentButtonSurface = {
  background: string;
  foreground: string;
  shadow?: string;
};

function getSegmentButtonToken(slot: string) {
  return canonicalSegmentButtonWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function resolveSegmentButtonBindingValue(brand: DisplayBrandId, slot: string, fallback: string) {
  const token = getSegmentButtonToken(slot);

  if (!token) {
    return fallback;
  }

  if (
    token.startsWith("component.") ||
    token.startsWith("color.") ||
    token.startsWith("spacing.") ||
    token.startsWith("radius.") ||
    token.startsWith("typography.") ||
    token.startsWith("icon.")
  ) {
    return String(getRequiredThemeTokenValue(brand, token));
  }

  return withTokenFallback(token, fallback);
}

function toPx(value: string) {
  return tokenValueToRem(value);
}

function renderDecorativeIcon({
  brand,
  color,
  content,
  size
}: {
  brand: DisplayBrandId;
  color: string;
  content?: ReactNode;
  size: "sm" | "md";
}) {
  if (!content) {
    return null;
  }

  if (typeof content === "string") {
    return <Icon brand={brand} decorative name={content as IconName} size={size} style={{ color }} />;
  }

  if (isValidElement(content)) {
    const element = content as ReactElement<{ style?: CSSProperties; "aria-hidden"?: boolean }>;

    return cloneElement(element, {
      "aria-hidden": true,
      style: {
        color,
        ...element.props.style
      }
    });
  }

  return content;
}

function getMetrics(brand: DisplayBrandId, size: SegmentButtonSize, type: SegmentButtonType): SegmentButtonMetrics {
  const iconSize = size === "Large" ? "md" : "sm";

  if (type === "Icon") {
    return {
      gap: "0px",
      iconSize,
      padding: toPx(
        resolveSegmentButtonBindingValue(
          brand,
          size === "Large" ? "icon.large.padding" : "icon.default.padding",
          size === "Large" ? "10px" : "8px"
        )
      )
    };
  }

  return {
    gap: toPx(resolveSegmentButtonBindingValue(brand, "text.contentGap", "8")),
    iconSize,
    minHeight: toPx(
      resolveSegmentButtonBindingValue(
        brand,
        size === "Large" ? "text.large.minHeight" : "text.default.minHeight",
        size === "Large" ? "40" : "32"
      )
    ),
    padding: `${toPx(
      resolveSegmentButtonBindingValue(
        brand,
        size === "Large" ? "text.large.paddingBlock" : "text.default.paddingBlock",
        size === "Large" ? "8" : "6"
      )
    )} ${toPx(
      resolveSegmentButtonBindingValue(
        brand,
        size === "Large" ? "text.large.paddingInline" : "text.default.paddingInline",
        size === "Large" ? "16" : "12"
      )
    )}`,
    paddingInline: toPx(
      resolveSegmentButtonBindingValue(
        brand,
        size === "Large" ? "text.large.paddingInline" : "text.default.paddingInline",
        size === "Large" ? "16" : "12"
      )
    )
  };
}

function getSurface({
  brand,
  disabled,
  previewState,
  selected,
  selectionColor
}: {
  brand: DisplayBrandId;
  disabled: boolean;
  previewState: SegmentButtonPreviewState;
  selected: boolean;
  selectionColor: SegmentButtonSelectionColor;
}): SegmentButtonSurface {
  const disabledForeground = resolveSegmentButtonBindingValue(
    brand,
    "color.disabled.foreground",
    String(getRequiredThemeTokenValue(brand, "color.text.disabled"))
  );
  const primaryForeground = resolveSegmentButtonBindingValue(
    brand,
    "color.rest.foreground",
    String(getRequiredThemeTokenValue(brand, "component.iconButton.color.light.transparent.rest.foreground"))
  );
  const inverseForeground = resolveSegmentButtonBindingValue(
    brand,
    "color.selected.inverseForeground",
    String(getRequiredThemeTokenValue(brand, "color.text.inverse"))
  );
  const hoverBackground = resolveSegmentButtonBindingValue(
    brand,
    "color.hover.background",
    String(getRequiredThemeTokenValue(brand, "component.iconButton.color.light.subtle.black.hover.background"))
  );
  const selectedShadow = resolveSegmentButtonBindingValue(
    brand,
    "color.selected.shadow",
    String(getRequiredThemeTokenValue(brand, "component.switch.thumb.shadow"))
  );

  if (disabled) {
    return {
      background: "transparent",
      foreground: disabledForeground
    };
  }

  if (selected) {
    const background =
      selectionColor === "Black"
        ? resolveSegmentButtonBindingValue(brand, "color.selected.black.background", "#0A0A0A")
        : selectionColor === "Brand"
          ? resolveSegmentButtonBindingValue(
              brand,
              "color.selected.brand.background",
              String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"))
            )
          : resolveSegmentButtonBindingValue(
              brand,
              "color.selected.white.background",
              String(getRequiredThemeTokenValue(brand, "color.surface.canvas"))
            );

    return {
      background,
      foreground: selectionColor === "White" ? primaryForeground : inverseForeground,
      shadow: selectedShadow
    };
  }

  return {
    background: previewState === "Hover/Pressed" ? hoverBackground : "transparent",
    foreground: primaryForeground
  };
}

/**
 * Item-level segmented-control button matching the canonical Figma state matrix.
 */
export const SegmentButton = forwardRef<HTMLButtonElement, SegmentButtonProps>(function SegmentButton(
  {
    brand = "Cars24",
    icon,
    iconName,
    label = "Label",
    forceState = "Default",
    selected = false,
    selectionColor = "White",
    size = "Default",
    type = "Text",
    disabled = false,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
    ...rest
  }: SegmentButtonProps,
  ref
) {
  const [pressed, setPressed] = useState(false);
  const metrics = getMetrics(brand, size, type);
  const surface = getSurface({
    brand,
    disabled,
    previewState: forceState === "Hover/Pressed" ? "Hover/Pressed" : pressed ? "Hover/Pressed" : "Default",
    selected,
    selectionColor
  });
  const borderRadius = toPx(resolveSegmentButtonBindingValue(brand, "radius.pill", "999"));
  const fontFamily = resolveSegmentButtonBindingValue(
    brand,
    "typography.fontFamily",
    String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))
  );
  const fontWeight = Number(
    resolveSegmentButtonBindingValue(
      brand,
      "typography.fontWeight",
      String(getRequiredThemeTokenValue(brand, "typography.fontWeight.medium"))
    )
  );
  const fontSize = toPx(
    resolveSegmentButtonBindingValue(
      brand,
      size === "Large" ? "typography.large.fontSize" : "typography.default.fontSize",
      String(
        getRequiredThemeTokenValue(
          brand,
          size === "Large" ? "component.button.typography.md.fontSize" : "component.button.typography.sm.fontSize"
        )
      )
    )
  );
  const lineHeight = toPx(
    resolveSegmentButtonBindingValue(
      brand,
      size === "Large" ? "typography.large.lineHeight" : "typography.default.lineHeight",
      String(
        getRequiredThemeTokenValue(
          brand,
          size === "Large" ? "component.button.typography.md.lineHeight" : "component.button.typography.sm.lineHeight"
        )
      )
    )
  );
  const letterSpacing = toPx(
    resolveSegmentButtonBindingValue(
      brand,
      size === "Large" ? "typography.large.letterSpacing" : "typography.default.letterSpacing",
      "0"
    )
  );
  const content = icon ?? iconName;

  function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
    setPressed(true);
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseUp?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>) {
    setPressed(false);
    onMouseLeave?.(event);
  }

  return (
    <button
      {...rest}
      ref={ref}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      type="button"
      style={{
        alignItems: "center",
        appearance: "none",
        background: surface.background,
        border: 0,
        borderRadius,
        boxShadow: surface.shadow,
        color: surface.foreground,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        gap: metrics.gap,
        justifyContent: "center",
        minHeight: metrics.minHeight,
        minWidth: type === "Text" ? 0 : undefined,
        padding: metrics.padding,
        textDecoration: "none",
        ...getTapFeedbackStyles({
          disabled,
          pressed,
          transition: "background-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)"
        }),
        ...style
      }}
    >
      {content ? renderDecorativeIcon({ brand, color: surface.foreground, content, size: metrics.iconSize }) : null}
      {type === "Text" ? (
        <span
          style={{
            color: surface.foreground,
            fontFamily: `${fontFamily}, sans-serif`,
            fontSize,
            fontWeight,
            letterSpacing,
            lineHeight,
            minWidth: 0,
            whiteSpace: "nowrap"
          }}
        >
          {label}
        </span>
      ) : null}
    </button>
  );
});
