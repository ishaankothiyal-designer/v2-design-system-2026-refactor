import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { getRequiredThemeTokenValue, getThemeTokenValue } from "../theme";

export const canonicalPhoneInputWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.phoneInput"
);

export type PhoneInputSize = "Small" | "Large";
export type PhoneInputPreviewState = "Rest" | "Hover" | "Active" | "Typing" | "Filled";
export type PhoneInputHelperTone = "Default" | "Destructive";
export type PhoneInputCountry = "India" | "UAE" | "Australia";

type FieldVisualState = "rest" | "hover" | "active" | "filled" | "destructive" | "disabled";

type PhoneInputSizeTokens = {
  actionSize: number;
  containerGap: number;
  contentGap: number;
  countryCodeWidth: number;
  fieldPaddingBlock: number;
  fieldPaddingInline: number;
  height: number;
  labelPaddingInline: number;
};

type PhoneInputTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type PhoneInputFieldColors = {
  actionBorder: string;
  actionIcon: string;
  background: string;
  border: string;
  caret?: string;
  chevron: string;
  countryCode: string;
  placeholder: string;
  value: string;
};

const PHONE_INPUT_COUNTRY_PRESETS: Record<
  PhoneInputCountry,
  {
    dialCode: string;
    flagIconName: IconName;
  }
> = {
  India: {
    dialCode: "+91",
    flagIconName: "india"
  },
  UAE: {
    dialCode: "+971",
    flagIconName: "uae"
  },
  Australia: {
    dialCode: "+61",
    flagIconName: "australia"
  }
};
const PHONE_INPUT_COUNTRY_ORDER = Object.keys(PHONE_INPUT_COUNTRY_PRESETS) as PhoneInputCountry[];

function getSizeKey(size: PhoneInputSize) {
  return size === "Large" ? "lg" : "sm";
}

function getSizeTokens(brand: DisplayBrandId, size: PhoneInputSize): PhoneInputSizeTokens {
  const tokenPrefix = `component.phoneInput.size.${getSizeKey(size)}`;

  return {
    actionSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.actionSize`)),
    containerGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.containerGap`)),
    contentGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.contentGap`)),
    countryCodeWidth: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.countryCodeWidth`)),
    fieldPaddingBlock: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldPaddingBlock`)),
    fieldPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.fieldPaddingInline`)),
    height: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.height`)),
    labelPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.labelPaddingInline`))
  };
}

function getTypography(brand: DisplayBrandId, path: string): PhoneInputTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${path}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${path}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${path}.lineHeight`))
  };
}

function getFieldColors(brand: DisplayBrandId, state: FieldVisualState): PhoneInputFieldColors {
  const tokenPrefix = `component.phoneInput.color.field.${state}`;

  return {
    actionBorder: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.actionBorder`)),
    actionIcon: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.actionIcon`)),
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    caret: String(getThemeTokenValue(brand, `${tokenPrefix}.caret`) ?? ""),
    chevron: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.chevron`)),
    countryCode: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.countryCode`)),
    placeholder: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.placeholder`)),
    value: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.value`))
  };
}

function getLabelSize(size: PhoneInputSize) {
  return size === "Large" ? "Large" : "Medium";
}

function resolveVisualState({
  destructive,
  disabled,
  focused,
  forceState,
  hovered,
  hasValue
}: {
  destructive: boolean;
  disabled: boolean;
  focused: boolean;
  forceState: PhoneInputPreviewState | undefined;
  hovered: boolean;
  hasValue: boolean;
}): FieldVisualState {
  if (disabled) {
    return "disabled";
  }

  if (destructive) {
    return "destructive";
  }

  if (forceState === "Hover") {
    return "hover";
  }

  if (forceState === "Active" || forceState === "Typing" || focused) {
    return "active";
  }

  if (forceState === "Filled" || hasValue) {
    return "filled";
  }

  if (hovered) {
    return "hover";
  }

  return "rest";
}

function makeTypographyStyles(
  brand: DisplayBrandId,
  typography: PhoneInputTypography,
  color: string,
  fontWeightPath: string
): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`
  };
}

function getIconSize(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, path));
}

function sanitizePhoneInputValue(value: string) {
  return value.replace(/\D+/g, "");
}

export interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "size" | "value"> {
  actionAriaLabel?: string;
  availableCountries?: PhoneInputCountry[];
  brand?: DisplayBrandId;
  country?: PhoneInputCountry;
  countryCode?: string;
  countryFlagIconName?: IconName;
  countrySelectorAriaLabel?: string;
  defaultCountry?: PhoneInputCountry;
  defaultValue?: string;
  destructive?: boolean;
  forceState?: PhoneInputPreviewState;
  helperText?: ReactNode;
  helperTone?: PhoneInputHelperTone;
  label?: ReactNode;
  onActionClick?: () => void;
  onCountryChange?: (country: PhoneInputCountry) => void;
  onCountryCodeClick?: () => void;
  showAction?: boolean;
  showCountryChevron?: boolean;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: PhoneInputSize;
  value?: string;
}

export function PhoneInput({
  actionAriaLabel = "Clear phone number",
  availableCountries,
  brand = "Cars24",
  country,
  countryCode,
  countryFlagIconName,
  countrySelectorAriaLabel,
  defaultCountry = "India",
  defaultValue,
  destructive = false,
  disabled = false,
  forceState,
  helperText,
  helperTone,
  id,
  label,
  onActionClick,
  onBlur,
  onChange,
  onCountryChange,
  onCountryCodeClick,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  placeholder = "9876543210",
  required = false,
  showAction,
  showCountryChevron = true,
  showHelperIcon = true,
  showLabelInfoIcon = true,
  size = "Small",
  style,
  type = "tel",
  value,
  ...rest
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId = id ?? `phone-input-${generatedId}`;
  const countryMenuId = `${inputId}-country-menu`;
  const sanitizedId = generatedId.replace(/[^a-zA-Z0-9_-]/g, "");
  const placeholderClassName = `geist-phone-input-${sanitizedId}`;
  const caretKeyframesName = `geist-phone-input-caret-blink-${sanitizedId}`;
  const previewCaretClassName = `geist-phone-input-caret-${sanitizedId}`;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const [uncontrolledCountry, setUncontrolledCountry] = useState<PhoneInputCountry>(defaultCountry);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const countrySelectorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = value ?? uncontrolledValue;
  const selectableCountries =
    availableCountries?.filter(
      (candidate, index, list) =>
        candidate in PHONE_INPUT_COUNTRY_PRESETS && list.indexOf(candidate) === index
    ) ??
    PHONE_INPUT_COUNTRY_ORDER;
  const fallbackCountry = selectableCountries[0] ?? defaultCountry;
  const resolvedSelectedCountry =
    country ?? (selectableCountries.includes(uncontrolledCountry) ? uncontrolledCountry : fallbackCountry);
  const resolvedCountry = PHONE_INPUT_COUNTRY_PRESETS[resolvedSelectedCountry];
  const resolvedCountryCode = countryCode ?? resolvedCountry.dialCode;
  const resolvedCountryFlagIconName = countryFlagIconName ?? resolvedCountry.flagIconName;
  const hasValue = currentValue.length > 0;
  const visualState = resolveVisualState({
    destructive,
    disabled,
    focused,
    forceState,
    hovered,
    hasValue
  });
  const sizeTokens = getSizeTokens(brand, size);
  const inputTypography = getTypography(brand, "component.phoneInput.typography.input");
  const fieldColors = getFieldColors(brand, visualState);
  const resolvedHelperTone = helperTone ?? (destructive ? "Destructive" : "Default");
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.phoneInput.border.width"));
  const fieldRadius = Number(getRequiredThemeTokenValue(brand, "radius.alt.lg"));
  const actionRadius = Number(getRequiredThemeTokenValue(brand, "radius.pill"));
  const flagSize = getIconSize(brand, "component.phoneInput.icon.flagSize");
  const countryChevronSize = getIconSize(brand, "component.phoneInput.icon.countryChevronSize");
  const actionIconSize = getIconSize(brand, "component.phoneInput.icon.actionSize");
  const labelSize = getLabelSize(size);
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const previewMode = forceState !== undefined;
  const previewShowsCaret = forceState === "Active" || forceState === "Typing";
  const defaultShowAction =
    previewMode ? forceState === "Typing" || forceState === "Filled" : hasValue;
  const resolvedShowAction =
    showAction === true ? true : showAction === false ? false : defaultShowAction;
  const canSelectCountry = !disabled && !previewMode && selectableCountries.length > 1;
  const menuSurface = String(getRequiredThemeTokenValue(brand, "color.surface.canvas"));
  const menuBorder = String(getRequiredThemeTokenValue(brand, "color.border.default"));
  const menuOptionHoverBackground = String(getRequiredThemeTokenValue(brand, "color.surface.subtle"));
  const menuOptionText = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const menuMinWidth =
    sizeTokens.fieldPaddingInline * 2 +
    flagSize +
    sizeTokens.countryCodeWidth +
    countryChevronSize;

  useEffect(() => {
    if (!countryMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!countrySelectorRef.current?.contains(event.target as Node)) {
        setCountryMenuOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setCountryMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [countryMenuOpen]);

  const fieldStyles: CSSProperties = {
    alignItems: "center",
    background: fieldColors.background,
    border: `${borderWidth}px solid ${fieldColors.border}`,
    borderRadius: `${fieldRadius}px`,
    display: "flex",
    height: `${sizeTokens.height}px`,
    minWidth: 0,
    overflow: "visible",
    width: "100%"
  };

  const prefixStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    position: "relative",
    padding: `${sizeTokens.fieldPaddingBlock}px 0 ${sizeTokens.fieldPaddingBlock}px ${sizeTokens.fieldPaddingInline}px`
  };

  const countryButtonStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: "none",
    cursor: disabled ? "not-allowed" : canSelectCountry || onCountryCodeClick ? "pointer" : "default",
    display: "flex",
    flexShrink: 0,
    gap: 0,
    margin: 0,
    minHeight: `${inputTypography.lineHeight}px`,
    minWidth: 0,
    padding: 0,
    position: "relative"
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 auto",
    gap: `${sizeTokens.contentGap}px`,
    minWidth: 0,
    padding: `${sizeTokens.fieldPaddingBlock}px ${sizeTokens.fieldPaddingInline}px`
  };

  const inputTextStyles = makeTypographyStyles(
    brand,
    inputTypography,
    hasValue ? fieldColors.value : fieldColors.placeholder,
    "typography.fontWeight.semibold"
  );

  const actualInputStyles: CSSProperties = {
    ...inputTextStyles,
    appearance: "none",
    background: "transparent",
    border: "none",
    caretColor: fieldColors.caret || fieldColors.value,
    flex: "1 1 auto",
    minWidth: 0,
    outline: "none",
    padding: 0
  };

  const previewTextStyles: CSSProperties = {
    ...makeTypographyStyles(
      brand,
      inputTypography,
      hasValue ? fieldColors.value : fieldColors.placeholder,
      "typography.fontWeight.semibold"
    ),
    whiteSpace: "nowrap"
  };

  const actionButtonStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: `${borderWidth}px solid ${fieldColors.actionBorder}`,
    borderRadius: `${actionRadius}px`,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: `${sizeTokens.actionSize}px`,
    justifyContent: "center",
    margin: 0,
    padding: 0,
    width: `${sizeTokens.actionSize}px`
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const sanitizedValue = sanitizePhoneInputValue(event.currentTarget.value);

    if (event.currentTarget.value !== sanitizedValue) {
      event.currentTarget.value = sanitizedValue;
    }

    if (value === undefined) {
      setUncontrolledValue(sanitizedValue);
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

  function handleActionClick() {
    if (disabled) {
      return;
    }

    if (onActionClick) {
      onActionClick();
      return;
    }

    if (value === undefined) {
      setUncontrolledValue("");
    } else if (inputRef.current) {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;

      valueSetter?.call(inputRef.current, "");
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }

    inputRef.current?.focus();
  }

  function handleCountryButtonClick() {
    if (disabled) {
      return;
    }

    onCountryCodeClick?.();

    if (!canSelectCountry) {
      return;
    }

    setCountryMenuOpen((open) => !open);
  }

  function handleCountryButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!canSelectCountry) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setCountryMenuOpen(true);
    }
  }

  function handleCountrySelect(nextCountry: PhoneInputCountry) {
    if (country === undefined) {
      setUncontrolledCountry(nextCountry);
    }

    setCountryMenuOpen(false);
    onCountryChange?.(nextCountry);
  }

  const prefixCountryCodeStyles: CSSProperties = {
    ...makeTypographyStyles(brand, inputTypography, fieldColors.countryCode, "typography.fontWeight.semibold"),
    textAlign: "right",
    width: `${sizeTokens.countryCodeWidth}px`
  };

  const previewTextValue =
    previewShowsCaret || forceState === "Filled" ? currentValue : currentValue || String(placeholder ?? "");
  const previewTextColor =
    previewShowsCaret || forceState === "Filled" || hasValue ? fieldColors.value : fieldColors.placeholder;

  return (
    <div
      style={{
        display: "grid",
        gap: `${sizeTokens.containerGap}px`,
        width: "100%",
        ...style
      }}
    >
      <style>{`
        .${placeholderClassName}::placeholder{color:${fieldColors.placeholder};opacity:1;}
        @keyframes ${caretKeyframesName}{
          0%,49%{opacity:1;}
          50%,100%{opacity:0;}
        }
        .${previewCaretClassName}{
          animation:${caretKeyframesName} 1s steps(1, end) infinite;
        }
      `}</style>

      {showLabel ? (
        <label
          htmlFor={inputId}
          style={{
            display: "block",
            paddingInline: `${sizeTokens.labelPaddingInline}px`
          }}
        >
          <Label
            brand={brand}
            label={label}
            required={required}
            showInfoIcon={showLabelInfoIcon}
            size={labelSize}
          />
        </label>
      ) : null}

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={fieldStyles}>
        <div ref={countrySelectorRef} style={prefixStyles}>
          <button
            aria-controls={canSelectCountry ? countryMenuId : undefined}
            aria-expanded={canSelectCountry ? countryMenuOpen : undefined}
            aria-haspopup={canSelectCountry ? "listbox" : undefined}
            aria-label={countrySelectorAriaLabel ?? `Select country code ${resolvedCountryCode}`}
            disabled={disabled}
            onClick={handleCountryButtonClick}
            onKeyDown={handleCountryButtonKeyDown}
            style={countryButtonStyles}
            type="button"
          >
            <Icon decorative name={resolvedCountryFlagIconName} style={{ fontSize: `${flagSize}px` }} />
            <span style={prefixCountryCodeStyles}>{resolvedCountryCode}</span>
            {showCountryChevron ? (
              <Icon
                decorative
                name="chevron-down-small-outline"
                style={{
                  color: fieldColors.chevron,
                  fontSize: `${countryChevronSize}px`
                }}
              />
            ) : null}
          </button>

          {countryMenuOpen ? (
            <div
              id={countryMenuId}
              role="listbox"
              aria-label="Country code options"
              style={{
                background: menuSurface,
                border: `${borderWidth}px solid ${menuBorder}`,
                borderRadius: `${fieldRadius}px`,
                display: "grid",
                gap: 0,
                left: 0,
                minWidth: `${menuMinWidth}px`,
                padding: `${Math.max(0, sizeTokens.fieldPaddingBlock - borderWidth)}px 0`,
                position: "absolute",
                top: `calc(100% + ${sizeTokens.containerGap}px)`,
                zIndex: 1
              }}
            >
              {selectableCountries.map((countryOption) => {
                const optionPreset = PHONE_INPUT_COUNTRY_PRESETS[countryOption];
                const selected = countryOption === resolvedSelectedCountry;

                return (
                  <button
                    key={countryOption}
                    aria-selected={selected}
                    onClick={() => handleCountrySelect(countryOption)}
                    role="option"
                    style={{
                      alignItems: "center",
                      appearance: "none",
                      background: selected ? menuOptionHoverBackground : "transparent",
                      border: "none",
                      color: menuOptionText,
                      cursor: "pointer",
                      display: "flex",
                      gap: 0,
                      margin: 0,
                      padding: `${sizeTokens.fieldPaddingBlock}px ${sizeTokens.fieldPaddingInline}px`,
                      width: "100%"
                    }}
                    type="button"
                  >
                    <Icon decorative name={optionPreset.flagIconName} style={{ fontSize: `${flagSize}px` }} />
                    <span
                      style={{
                        ...prefixCountryCodeStyles,
                        color: menuOptionText
                      }}
                    >
                      {optionPreset.dialCode}
                    </span>
                    {showCountryChevron ? (
                      <Icon
                        decorative
                        name="chevron-down-small-outline"
                        style={{
                          color: fieldColors.chevron,
                          fontSize: `${countryChevronSize}px`
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={contentStyles}>
          {previewMode ? (
            <div
              aria-hidden="true"
              style={{
                alignItems: "center",
                display: "flex",
                flex: "1 1 auto",
                justifyContent: "flex-start",
                minWidth: 0
              }}
            >
              <span
                style={{
                  ...previewTextStyles,
                  color: previewTextColor
                }}
              >
                {previewTextValue}
              </span>
              {previewShowsCaret ? (
                <span
                  className={previewCaretClassName}
                  style={{
                    background: fieldColors.caret || fieldColors.value,
                    display: "inline-block",
                    flexShrink: 0,
                    height: `${inputTypography.lineHeight - 4}px`,
                    marginLeft: previewTextValue.length > 0 ? "2px" : 0,
                    width: "1px"
                  }}
                />
              ) : null}
            </div>
          ) : (
            <input
              {...rest}
              aria-invalid={destructive}
              className={placeholderClassName}
              disabled={disabled}
              id={inputId}
              inputMode="numeric"
              pattern="[0-9]*"
              ref={inputRef}
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder={placeholder}
              style={actualInputStyles}
              type={type}
              value={currentValue}
            />
          )}

          {resolvedShowAction ? (
            <button
              aria-label={actionAriaLabel}
              disabled={disabled}
              onClick={handleActionClick}
              onMouseDown={handleActionMouseDown}
              style={actionButtonStyles}
              type="button"
            >
              <Icon
                decorative
                name="close-line"
                style={{
                  color: fieldColors.actionIcon,
                  fontSize: `${actionIconSize}px`
                }}
              />
            </button>
          ) : null}
        </div>
      </div>

      {showHelper ? (
        <HelperText
          brand={brand}
          fullWidth
          helperText={helperText}
          showIcon={showHelperIcon}
          size={size}
          style={{ paddingInline: `${sizeTokens.labelPaddingInline}px` }}
          tone={resolvedHelperTone === "Destructive" ? "Error" : "Default"}
        />
      ) : null}
    </div>
  );
}
