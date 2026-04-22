import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useId,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalDropdownWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.dropdown"
);

export type DropdownSize = "Small" | "Large";
export type DropdownPreviewState = "Rest" | "Active" | "Selected" | "Error" | "Disabled";
export type DropdownValidationState = "Default" | "Error";
export type DropdownHelperTone = "Default" | "Error";

type FieldVisualState = "rest" | "active" | "selected" | "error" | "disabled";

type DropdownSizeTokens = {
  affixBoxSize: number;
  affixIconSize: number;
  chevronSize: number;
  containerGap: number;
  fieldGap: number;
  fieldPaddingBlock: number;
  fieldPaddingInline: number;
  height: number;
  helperGap: number;
  helperIconSize: number;
  labelPaddingInline: number;
  textWrapperPaddingBlock: number;
};

type DropdownTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type DropdownFieldColors = {
  background: string;
  border: string;
  chevron: string;
  placeholder: string;
  prefix: string;
  value: string;
};

function getSizeKey(size: DropdownSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: DropdownSize) {
  return size === "Large" ? "Large" : "Medium";
}

function getSizeTokens(brand: DisplayBrandId, size: DropdownSize): DropdownSizeTokens {
  const sizeKey = getSizeKey(size);
  const textInputPrefix = `component.textInput.size.${sizeKey}`;

  return {
    affixBoxSize: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.affixBoxSize`)),
    affixIconSize: Number(getRequiredThemeTokenValue(brand, "component.textInput.icon.affixSize")),
    chevronSize: Number(getRequiredThemeTokenValue(brand, "component.phoneInput.icon.countryChevronSize")),
    containerGap: Number(getRequiredThemeTokenValue(brand, "component.phoneInput.size.sm.containerGap")),
    fieldGap: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.fieldGap`)),
    fieldPaddingBlock: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.fieldPaddingBlock`)),
    fieldPaddingInline: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.fieldPaddingInline`)),
    height: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.height`)),
    helperGap: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.helperGap`)),
    helperIconSize: Number(getRequiredThemeTokenValue(brand, "component.phoneInput.icon.helperSize")),
    labelPaddingInline: Number(getRequiredThemeTokenValue(brand, `${textInputPrefix}.labelPaddingInline`)),
    textWrapperPaddingBlock:
      size === "Large"
        ? Number(getRequiredThemeTokenValue(brand, "component.phoneInput.size.sm.labelPaddingInline"))
        : 0
  };
}

function getTypography(brand: DisplayBrandId, path: string): DropdownTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${path}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${path}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${path}.lineHeight`))
  };
}

function makeTypographyStyles({
  brand,
  color,
  fontWeightPath,
  typography
}: {
  brand: DisplayBrandId;
  color: string;
  fontWeightPath: string;
  typography: DropdownTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`,
    margin: 0
  };
}

function getFieldColors(brand: DisplayBrandId, state: FieldVisualState): DropdownFieldColors {
  const textInputStateKey =
    state === "selected" ? "typed" : state === "disabled" ? "disabled" : state;
  const phoneInputStateKey =
    state === "selected"
      ? "filled"
      : state === "error"
        ? "destructive"
        : state === "disabled"
          ? "disabled"
          : state;
  const textInputPrefix = `component.textInput.color.field.${textInputStateKey}`;
  const phoneInputPrefix = `component.phoneInput.color.field.${phoneInputStateKey}`;

  return {
    background:
      state === "disabled"
        ? String(getRequiredThemeTokenValue(brand, `${phoneInputPrefix}.background`))
        : String(getRequiredThemeTokenValue(brand, `${textInputPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${textInputPrefix}.border`)),
    chevron: String(getRequiredThemeTokenValue(brand, `${phoneInputPrefix}.chevron`)),
    placeholder: String(getRequiredThemeTokenValue(brand, `${textInputPrefix}.placeholder`)),
    prefix: String(getRequiredThemeTokenValue(brand, `${textInputPrefix}.affix`)),
    value: String(getRequiredThemeTokenValue(brand, `${textInputPrefix}.value`))
  };
}

function resolveVisualState({
  disabled,
  focused,
  forceState,
  open,
  hasValue,
  validationState
}: {
  disabled: boolean;
  focused: boolean;
  forceState: DropdownPreviewState | undefined;
  open: boolean;
  hasValue: boolean;
  validationState: DropdownValidationState;
}): FieldVisualState {
  if (forceState === "Disabled" || disabled) {
    return "disabled";
  }

  if (forceState === "Error" || validationState === "Error") {
    return "error";
  }

  if (forceState === "Active" || open || focused) {
    return "active";
  }

  if (forceState === "Selected" || hasValue) {
    return "selected";
  }

  return "rest";
}

function resolveHelperTone({
  forceState,
  helperTone,
  size,
  validationState
}: {
  forceState: DropdownPreviewState | undefined;
  helperTone: DropdownHelperTone | undefined;
  size: DropdownSize;
  validationState: DropdownValidationState;
}) {
  if (helperTone) {
    return helperTone;
  }

  if (forceState === "Error") {
    return size === "Small" ? "Error" : "Default";
  }

  return validationState === "Error" ? "Error" : "Default";
}

function hasDisplayValue(value: string | undefined) {
  return value !== undefined && value.length > 0;
}

export interface DropdownProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "size" | "value"> {
  brand?: DisplayBrandId;
  forceState?: DropdownPreviewState;
  helperText?: ReactNode;
  helperTone?: DropdownHelperTone;
  label?: ReactNode;
  open?: boolean;
  placeholder?: string;
  prefixIconName?: IconName;
  required?: boolean;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: DropdownSize;
  validationState?: DropdownValidationState;
  value?: string;
}

export function Dropdown({
  brand = "Cars24",
  disabled = false,
  forceState,
  helperText,
  helperTone,
  id,
  label,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  open = false,
  placeholder = "Select option",
  prefixIconName = "placeholder-generate-outline",
  required = false,
  showHelperIcon = true,
  showLabelInfoIcon = true,
  size = "Small",
  style,
  type = "button",
  validationState = "Default",
  value,
  ...rest
}: DropdownProps) {
  const generatedId = useId();
  const buttonId = id ?? `dropdown-${generatedId}`;
  const helperId = `${buttonId}-helper`;
  const [focused, setFocused] = useState(false);

  const sizeKey = getSizeKey(size);
  const sizeTokens = getSizeTokens(brand, size);
  const inputTypography = getTypography(brand, `component.textInput.typography.input.${sizeKey}`);
  const helperTypography = getTypography(brand, `component.textInput.typography.helper.${sizeKey}`);
  const hasValue = hasDisplayValue(value);
  const visualState = resolveVisualState({
    disabled,
    focused,
    forceState,
    open,
    hasValue,
    validationState
  });
  const resolvedHelperTone = resolveHelperTone({
    forceState,
    helperTone,
    size,
    validationState
  });
  const fieldColors = getFieldColors(brand, visualState);
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.border.width"));
  const fieldRadius = Number(
    getRequiredThemeTokenValue(brand, size === "Large" ? "radius.alt.lg" : "radius.alt.md")
  );
  const labelSize = getLabelSize(size);
  const previewMode = forceState !== undefined;
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const displayText = hasValue ? value : placeholder;
  const textColor = hasValue ? fieldColors.value : fieldColors.placeholder;
  const textFontWeightPath = hasValue ? "typography.fontWeight.medium" : "typography.fontWeight.regular";
  const ariaInvalid = visualState === "error" ? true : undefined;

  const fieldStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: fieldColors.background,
    border: `${borderWidth}px solid ${fieldColors.border}`,
    borderRadius: `${fieldRadius}px`,
    boxSizing: "border-box",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    gap: `${sizeTokens.fieldGap}px`,
    height: `${sizeTokens.height}px`,
    margin: 0,
    minWidth: 0,
    padding: `${sizeTokens.fieldPaddingBlock}px ${sizeTokens.fieldPaddingInline}px`,
    textAlign: "left",
    width: "100%"
  };

  const affixStyles: CSSProperties = {
    alignItems: "center",
    color: fieldColors.prefix,
    display: "inline-flex",
    flex: "0 0 auto",
    height: `${sizeTokens.affixBoxSize}px`,
    justifyContent: "center",
    width: `${sizeTokens.affixBoxSize}px`
  };

  const textWrapperStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 auto",
    minWidth: 0,
    paddingBlock: `${sizeTokens.textWrapperPaddingBlock}px`
  };

  const valueStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: textColor,
      fontWeightPath: textFontWeightPath,
      typography: inputTypography
    }),
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLButtonElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLButtonElement>) {
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: ReactMouseEvent<HTMLButtonElement>) {
    onMouseLeave?.(event);
  }

  const labelNode = (
    <Label
      brand={brand}
      label={label}
      required={required}
      showInfoIcon={showLabelInfoIcon}
      size={labelSize}
    />
  );

  const fieldContent = (
    <>
      {prefixIconName ? (
        <span style={affixStyles}>
          <Icon
            decorative
            brand={brand}
            name={prefixIconName}
            style={{ color: fieldColors.prefix, fontSize: `${sizeTokens.affixIconSize}px` }}
          />
        </span>
      ) : null}

      <span style={textWrapperStyles}>
        <span style={valueStyles}>{displayText}</span>
      </span>

      <span style={{ ...affixStyles, color: fieldColors.chevron }}>
        <Icon
          decorative
          brand={brand}
          name="chevron-down-small-outline"
          style={{ color: fieldColors.chevron, fontSize: `${sizeTokens.chevronSize}px` }}
        />
      </span>
    </>
  );

  return (
    <div
      style={{
        display: "grid",
        gap: `${sizeTokens.containerGap}px`,
        width: "100%",
        ...style
      }}
    >
      {showLabel ? (
        previewMode ? (
          <div
            style={{
              display: "block",
              paddingInline: `${sizeTokens.labelPaddingInline}px`
            }}
          >
            {labelNode}
          </div>
        ) : (
          <label
            htmlFor={buttonId}
            style={{
              display: "block",
              paddingInline: `${sizeTokens.labelPaddingInline}px`
            }}
          >
            {labelNode}
          </label>
        )
      ) : null}

      {previewMode ? (
        <div aria-hidden="true" style={fieldStyles}>
          {fieldContent}
        </div>
      ) : (
        <button
          {...rest}
          aria-describedby={showHelper ? helperId : undefined}
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-required={required || undefined}
          disabled={disabled}
          id={buttonId}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={fieldStyles}
          type={type}
        >
          {fieldContent}
        </button>
      )}

      {showHelper ? (
        <HelperText
          align="center"
          brand={brand}
          fullWidth
          id={previewMode ? undefined : helperId}
          helperText={helperText}
          iconColor={String(
            getRequiredThemeTokenValue(
              brand,
              resolvedHelperTone === "Error"
                ? "component.phoneInput.color.helper.destructive.icon"
                : "component.phoneInput.color.helper.default.icon"
            )
          )}
          iconName={resolvedHelperTone === "Error" ? "error-outline" : "info-outline"}
          iconSize={sizeTokens.helperIconSize}
          showIcon={showHelperIcon}
          size={size}
          style={{ paddingInline: `${sizeTokens.labelPaddingInline}px` }}
          textColor={String(
            getRequiredThemeTokenValue(
              brand,
              resolvedHelperTone === "Error"
                ? "component.phoneInput.color.helper.destructive.text"
                : "component.phoneInput.color.helper.default.text"
            )
          )}
        />
      ) : null}
    </div>
  );
}
