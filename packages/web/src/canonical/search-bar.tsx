import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  useId,
  useRef,
  useState
} from "react";
import type { DisplayBrandId } from "@turbo/tokens";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue, getThemeTokenValue, pxToRem } from "../theme";

export type SearchBarSize = "Small" | "Large";
export type SearchBarColor = "Solid White" | "Blue" | "Inverse";
export type SearchBarPreviewState = "Rest" | "Hover" | "Active" | "Error" | "Completed";
export type SearchBarValidationState = "Default" | "Error";

type SearchBarVisualState = "rest" | "hover" | "active" | "error" | "completed";

type SearchBarSizeTokens = {
  activeContentGap: number;
  borderWidth: number;
  fieldGap: number;
  height: number;
  iconSize: number;
  paddingBlock: number;
  paddingInline: number;
  radius: number;
};

type SearchBarTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type SearchBarColors = {
  action: string;
  background: string;
  border: string;
  divider: string;
  foreground: string;
  icon: string;
  shadow: string | undefined;
};

const SEARCH_BAR_PREVIEW_SHADOW = "0px 2px 2px 0px rgba(0, 0, 0, 0.04)";
function getSizeKey(size: SearchBarSize) {
  return size === "Large" ? "lg" : "sm";
}

function getSizeTokens(brand: DisplayBrandId, size: SearchBarSize): SearchBarSizeTokens {
  const sizeKey = getSizeKey(size);

  return {
    activeContentGap: Number(getRequiredThemeTokenValue(brand, "spacing.1")),
    borderWidth: Number(getRequiredThemeTokenValue(brand, "component.textInput.border.width")),
    fieldGap: Number(getRequiredThemeTokenValue(brand, `component.textInput.size.${sizeKey}.fieldGap`)),
    height: Number(
      getRequiredThemeTokenValue(brand, size === "Large" ? "component.phoneInput.size.lg.height" : "component.textInput.size.sm.height")
    ),
    iconSize: Number(getRequiredThemeTokenValue(brand, size === "Large" ? "icon.size.lg" : "icon.size.md")),
    paddingBlock: Number(
      getRequiredThemeTokenValue(
        brand,
        size === "Large" ? "component.phoneInput.size.lg.fieldPaddingBlock" : "component.textInput.size.sm.fieldPaddingBlock"
      )
    ),
    paddingInline: Number(
      getRequiredThemeTokenValue(
        brand,
        size === "Large" ? "component.phoneInput.size.lg.fieldPaddingInline" : "component.textInput.size.sm.fieldPaddingInline"
      )
    ),
    radius: Number(getRequiredThemeTokenValue(brand, size === "Large" ? "radius.alt.lg" : "radius.alt.md"))
  };
}

function getTypography(brand: DisplayBrandId, size: SearchBarSize): SearchBarTypography {
  const sizeKey = getSizeKey(size);

  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.input.${sizeKey}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.input.${sizeKey}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `component.textInput.typography.input.${sizeKey}.lineHeight`))
  };
}

function resolveVisualState({
  focused,
  forceState,
  hasValue,
  hovered,
  validationState
}: {
  focused: boolean;
  forceState: SearchBarPreviewState | undefined;
  hasValue: boolean;
  hovered: boolean;
  validationState: SearchBarValidationState;
}): SearchBarVisualState {
  if (forceState === "Error") {
    return "error";
  }

  if (forceState === "Active") {
    return "active";
  }

  if (forceState === "Hover") {
    return "hover";
  }

  if (forceState === "Completed") {
    return "completed";
  }

  if (forceState === "Rest") {
    return "rest";
  }

  if (validationState === "Error") {
    return "error";
  }

  if (focused) {
    return "active";
  }

  if (hasValue) {
    return "completed";
  }

  if (hovered) {
    return "hover";
  }

  return "rest";
}

function getSearchBarColors(
  brand: DisplayBrandId,
  color: SearchBarColor,
  visualState: SearchBarVisualState
): SearchBarColors {
  const lightBackground = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.background"));
  const blueBackground = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.background"));
  const blueBorder = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.hover.border"));
  const activeBorder = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.active.border"));
  const errorBorder = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.error.border"));
  const lightDivider = String(getRequiredThemeTokenValue(brand, "component.divider.color.line"));
  const lightPrimary = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.value"));
  const lightSecondary = String(getRequiredThemeTokenValue(brand, "component.textInput.color.helper.default.text"));
  const lightTertiary = String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.rest.placeholder"));
  const inverseBackground = String(
    getThemeTokenValue(brand, "component.iconButton.color.dark.subtle.black.rest.background") ?? "rgba(255, 255, 255, 0.15)"
  );
  const inverseBorder = String(
    getThemeTokenValue(brand, "component.iconButton.color.dark.outline.black.rest.border") ?? "rgba(255, 255, 255, 0.3)"
  );
  const inverseBorderHover = String(
    getThemeTokenValue(brand, "component.iconButton.color.dark.outline.black.hover.border") ?? "rgba(255, 255, 255, 0.6)"
  );
  const inversePrimary = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const inverseSecondary = String(
    getThemeTokenValue(brand, "component.sectionHeader.color.dark.description") ?? "rgba(255, 255, 255, 0.7)"
  );
  const inverseDisabled = String(getRequiredThemeTokenValue(brand, "color.text.disabledInverse"));

  if (color === "Inverse") {
    if (visualState === "active") {
      return {
        action: inverseDisabled,
        background: inverseBackground,
        border: inversePrimary,
        divider: inverseBorderHover,
        foreground: inversePrimary,
        icon: inversePrimary,
        shadow: undefined
      };
    }

    if (visualState === "hover") {
      return {
        action: inverseDisabled,
        background: inverseBackground,
        border: inverseBorderHover,
        divider: inverseBorderHover,
        foreground: inverseSecondary,
        icon: inversePrimary,
        shadow: SEARCH_BAR_PREVIEW_SHADOW
      };
    }

    if (visualState === "error") {
      return {
        action: inverseDisabled,
        background: inverseBackground,
        border: errorBorder,
        divider: inverseBorderHover,
        foreground: inverseDisabled,
        icon: inversePrimary,
        shadow: SEARCH_BAR_PREVIEW_SHADOW
      };
    }

    return {
      action: inverseDisabled,
      background: inverseBackground,
      border: inverseBorder,
      divider: inverseBorderHover,
      foreground: visualState === "completed" ? inversePrimary : inverseDisabled,
      icon: inversePrimary,
      shadow: SEARCH_BAR_PREVIEW_SHADOW
    };
  }

  if (visualState === "active") {
    return {
      action: lightTertiary,
      background: lightBackground,
      border: activeBorder,
      divider: lightPrimary,
      foreground: lightPrimary,
      icon: lightPrimary,
      shadow: undefined
    };
  }

  if (visualState === "error") {
    return {
      action: lightTertiary,
      background: lightBackground,
      border: errorBorder,
      divider: lightPrimary,
      foreground: lightSecondary,
      icon: lightPrimary,
      shadow: SEARCH_BAR_PREVIEW_SHADOW
    };
  }

  if (color === "Blue" && visualState !== "hover") {
    return {
      action: lightTertiary,
      background: blueBackground,
      border: blueBorder,
      divider: lightPrimary,
      foreground: visualState === "completed" ? lightPrimary : lightSecondary,
      icon: lightPrimary,
      shadow: SEARCH_BAR_PREVIEW_SHADOW
    };
  }

  return {
    action: lightTertiary,
    background: lightBackground,
    border: lightDivider,
    divider: lightPrimary,
    foreground: visualState === "completed" ? lightPrimary : lightSecondary,
    icon: lightPrimary,
    shadow: SEARCH_BAR_PREVIEW_SHADOW
  };
}

function makeTypographyStyles({
  brand,
  color,
  typography
}: {
  brand: DisplayBrandId;
  color: string;
  typography: SearchBarTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: pxToRem(typography.fontSize),
    fontWeight: Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular")),
    letterSpacing: pxToRem(typography.letterSpacing),
    lineHeight: pxToRem(typography.lineHeight)
  };
}

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "defaultValue" | "size" | "value"> {
  backAriaLabel?: string;
  brand?: DisplayBrandId;
  clearAriaLabel?: string;
  color?: SearchBarColor;
  defaultValue?: string;
  forceState?: SearchBarPreviewState;
  onBackClick?: () => void;
  onClearClick?: () => void;
  showBackButton?: boolean;
  showClearButton?: boolean;
  size?: SearchBarSize;
  validationState?: SearchBarValidationState;
  value?: string;
}

export function SearchBar({
  backAriaLabel = "Go back",
  brand = "Cars24",
  clearAriaLabel = "Clear search",
  color = "Solid White",
  defaultValue,
  forceState,
  id,
  inputMode = "search",
  onBackClick,
  onBlur,
  onChange,
  onClearClick,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  placeholder = "Search",
  showBackButton,
  showClearButton,
  size = "Small",
  style,
  type = "search",
  validationState = "Default",
  value,
  ...rest
}: SearchBarProps) {
  const generatedId = useId();
  const inputId = id ?? `search-bar-${generatedId}`;
  const sanitizedId = generatedId.replace(/[^a-zA-Z0-9_-]/g, "");
  const placeholderClassName = `geist-search-bar-placeholder-${sanitizedId}`;
  const caretKeyframesName = `geist-search-bar-caret-blink-${sanitizedId}`;
  const previewCaretClassName = `geist-search-bar-caret-${sanitizedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");

  const currentValue = value ?? uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const previewMode = forceState !== undefined;
  const visualState = resolveVisualState({
    focused,
    forceState,
    hasValue,
    hovered,
    validationState
  });
  const sizeTokens = getSizeTokens(brand, size);
  const typography = getTypography(brand, size);
  const colors = getSearchBarColors(brand, color, visualState);
  const previewValue = currentValue || placeholder;
  const previewShowsCaret = forceState === "Active";
  const resolvedShowBackButton = showBackButton ?? visualState === "active";
  const resolvedShowClearButton = showClearButton ?? (visualState === "active" || visualState === "error");
  const iconName = resolvedShowBackButton ? "arrow-left-outline" : "magnifying-glass-outline";
  const iconSize = size === "Large" ? "lg" : "md";

  const rootStyles: CSSProperties = {
    alignItems: "center",
    background: colors.background,
    border: `${pxToRem(sizeTokens.borderWidth)} solid ${colors.border}`,
    borderRadius: pxToRem(sizeTokens.radius),
    boxShadow: colors.shadow,
    boxSizing: "border-box",
    display: "flex",
    gap: pxToRem(sizeTokens.fieldGap),
    height: pxToRem(sizeTokens.height),
    minWidth: 0,
    overflow: "hidden",
    padding: `${pxToRem(sizeTokens.paddingBlock)} ${pxToRem(sizeTokens.paddingInline)}`,
    width: "100%",
    ...style
  };

  const iconButtonStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    color: colors.icon,
    cursor: "pointer",
    display: "inline-flex",
    flex: "0 0 auto",
    justifyContent: "center",
    margin: 0,
    padding: 0
  };

  const clearButtonStyles: CSSProperties = {
    ...iconButtonStyles,
    color: colors.action
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 auto",
    gap: resolvedShowBackButton ? pxToRem(sizeTokens.activeContentGap) : "0px",
    minWidth: 0
  };

  const inputStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: colors.foreground,
      typography
    }),
    appearance: "none",
    background: "transparent",
    border: "none",
    caretColor: colors.foreground,
    flex: "1 1 auto",
    margin: 0,
    minWidth: 0,
    outline: "none",
    padding: 0
  };

  const previewTextStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: colors.foreground,
      typography
    }),
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(true);
    onMouseEnter?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
  }

  function handleMouseLeave(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(false);
    onMouseLeave?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
  }

  function handleActionMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleBackActionClick() {
    onBackClick?.();
  }

  function handleClearActionClick() {
    if (onClearClick) {
      onClearClick();
      inputRef.current?.focus();
      return;
    }

    if (value === undefined) {
      setUncontrolledValue("");
    } else if (inputRef.current) {
      const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

      valueSetter?.call(inputRef.current, "");
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }

    inputRef.current?.focus();
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={rootStyles}>
      <style>{`
        .${placeholderClassName}::placeholder{color:${colors.foreground};opacity:1;}
        @keyframes ${caretKeyframesName}{
          0%,49%{opacity:1;}
          50%,100%{opacity:0;}
        }
        .${previewCaretClassName}{
          animation:${caretKeyframesName} 1s steps(1, end) infinite;
        }
      `}</style>

      {previewMode ? (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            color: colors.icon,
            display: "inline-flex",
            flex: "0 0 auto",
            justifyContent: "center"
          }}
        >
          <Icon brand={brand} decorative name={iconName} size={iconSize} />
        </span>
      ) : resolvedShowBackButton ? (
        <button
          aria-label={backAriaLabel}
          onClick={handleBackActionClick}
          onMouseDown={handleActionMouseDown}
          style={iconButtonStyles}
          type="button"
        >
          <Icon brand={brand} decorative name={iconName} size={iconSize} />
        </button>
      ) : (
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            color: colors.icon,
            display: "inline-flex",
            flex: "0 0 auto",
            justifyContent: "center"
          }}
        >
          <Icon brand={brand} decorative name={iconName} size={iconSize} />
        </span>
      )}

      <div style={contentStyles}>
        {previewMode ? (
          <>
            <span style={previewTextStyles}>{previewValue}</span>
            {previewShowsCaret ? (
              <span
                className={previewCaretClassName}
                style={{
                  background: colors.foreground,
                  display: "inline-block",
                  flex: "0 0 auto",
                  height: pxToRem(typography.lineHeight),
                  width: pxToRem(1)
                }}
              />
            ) : null}
          </>
        ) : (
          <input
            {...rest}
            className={placeholderClassName}
            id={inputId}
            inputMode={inputMode}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            ref={inputRef}
            style={inputStyles}
            type={type}
            value={currentValue}
          />
        )}

      </div>

      {resolvedShowClearButton ? (
        previewMode ? (
          <span
            aria-hidden="true"
            style={{
              alignItems: "center",
              color: colors.action,
              display: "inline-flex",
              flex: "0 0 auto",
              justifyContent: "center"
            }}
          >
            <Icon brand={brand} decorative name="close-line" size={iconSize} />
          </span>
        ) : (
          <button
            aria-label={clearAriaLabel}
            onClick={handleClearActionClick}
            onMouseDown={handleActionMouseDown}
            style={clearButtonStyles}
            type="button"
          >
            <Icon brand={brand} decorative name="close-line" size={iconSize} />
          </button>
        )
      ) : null}
    </div>
  );
}
